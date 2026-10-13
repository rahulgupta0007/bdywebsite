"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type GameStatus = "ready" | "playing" | "won" | "lost";
type TargetKind = "heart" | "gold" | "broken";
type CatchTarget = { id: string; kind: TargetKind; x: number; y: number };
type BonusCard = { id: number; icon: string };

const WIN_SCORE = 18;
const ROUND_SECONDS = 20;
const BONUS_ICONS = ["🎀", "🍓", "🎂"];
const QUIZ = [
  { question: "What does 🎂 + 🎉 + 💗 mean?", answers: ["A birthday celebration!", "A cake-eating competition", "A secret homework club"], correct: 0 },
  { question: "What should you bring to Ishika’s party?", answers: ["Your sleepy face", "A big smile and good vibes", "Your entire wardrobe"], correct: 1 },
  { question: "Best birthday-party accessory?", answers: ["A party crown 👑", "A maths textbook 📚", "A rainy-day umbrella ☔"], correct: 0 },
];

const INITIAL_TARGETS: CatchTarget[] = [
  { id: "init-1", kind: "heart", x: 16, y: 28 },
  { id: "init-2", kind: "heart", x: 50, y: 30 },
  { id: "init-3", kind: "gold", x: 84, y: 28 },
  { id: "init-4", kind: "broken", x: 16, y: 70 },
  { id: "init-5", kind: "heart", x: 50, y: 70 },
  { id: "init-6", kind: "heart", x: 84, y: 69 },
];

function makeTargets(): CatchTarget[] {
  const kinds: TargetKind[] = ["heart", "heart", "heart", "heart", "gold", "broken"];
  const spots = [
    { x: 16, y: 27 }, { x: 50, y: 29 }, { x: 84, y: 27 },
    { x: 16, y: 70 }, { x: 50, y: 70 }, { x: 84, y: 69 },
  ];
  for (let i = kinds.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [kinds[i], kinds[j]] = [kinds[j], kinds[i]];
  }
  return spots.map((spot, i) => ({
    id: `${Date.now()}-${i}-${Math.random().toString(36).slice(2, 8)}`,
    kind: kinds[i],
    x: Math.max(12, Math.min(88, spot.x + (Math.random() * 12 - 6))),
    y: Math.max(20, Math.min(78, spot.y + (Math.random() * 14 - 7))),
  }));
}

function makeBonusDeck(): BonusCard[] {
  const cards = [...BONUS_ICONS, ...BONUS_ICONS].map((icon, id) => ({ icon, id }));
  for (let i = cards.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

export function BirthdayInvite() {
  const [gameStatus, setGameStatus] = useState<GameStatus>("ready");
  const [targets, setTargets] = useState<CatchTarget[]>(INITIAL_TARGETS);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [message, setMessage] = useState("Ready to catch some love?");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [shareMessage, setShareMessage] = useState("");
  const caughtIds = useRef<Set<string>>(new Set());
  const gameAreaRef = useRef<HTMLDivElement>(null);

  // Bonus game one: find three matching pairs, available only after winning the main game.
  const [bonusDeck, setBonusDeck] = useState<BonusCard[]>(() => makeBonusDeck());
  const [bonusFlipped, setBonusFlipped] = useState<number[]>([]);
  const [bonusMatched, setBonusMatched] = useState<number[]>([]);
  const [bonusMoves, setBonusMoves] = useState(0);
  const [bonusLocked, setBonusLocked] = useState(false);

  // Bonus game two: a birthday quiz, also only available after the invitation is unlocked.
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizChoice, setQuizChoice] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

  const won = gameStatus === "won";
  const currentQuestion = QUIZ[quizIndex];

  const startGame = useCallback(() => {
    caughtIds.current.clear();
    setScore(0);
    setTimeLeft(ROUND_SECONDS);
    setStreak(0);
    setBestStreak(0);
    setMessage("Go go go! Tap pink hearts; golden hearts are worth 3!");
    setTargets(makeTargets());
    setGameStatus("playing");
    setInviteOpen(false);
    setShareMessage("");
  }, []);

  useEffect(() => {
    if (gameStatus !== "playing") return;
    if (timeLeft <= 0) {
      setGameStatus("lost");
      setMessage("Time is up! Your surprise is still locked. Try again!");
      return;
    }
    const timer = window.setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [gameStatus, timeLeft]);

  useEffect(() => {
    if (gameStatus !== "playing") return;
    const movement = window.setInterval(() => setTargets(makeTargets()), 850);
    return () => window.clearInterval(movement);
  }, [gameStatus]);

  useEffect(() => {
    if (!inviteOpen) return;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setInviteOpen(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = oldOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [inviteOpen]);

  useEffect(() => {
    if (bonusFlipped.length !== 2) return;
    const [first, second] = bonusFlipped;
    if (bonusDeck[first]?.icon === bonusDeck[second]?.icon) {
      const timer = window.setTimeout(() => {
        setBonusMatched((old) => [...old, first, second]);
        setBonusFlipped([]);
        setBonusLocked(false);
      }, 280);
      return () => window.clearTimeout(timer);
    }
    const timer = window.setTimeout(() => {
      setBonusFlipped([]);
      setBonusLocked(false);
    }, 780);
    return () => window.clearTimeout(timer);
  }, [bonusFlipped, bonusDeck]);

  const catchTarget = (target: CatchTarget) => {
    if (gameStatus !== "playing" || caughtIds.current.has(target.id)) return;
    caughtIds.current.add(target.id);

    if (target.kind === "broken") {
      const nextScore = Math.max(0, score - 2);
      setScore(nextScore);
      setStreak(0);
      setMessage("Oops, a broken heart! −2 points. Catch the pink ones!");
      setTargets(makeTargets());
      return;
    }

    const nextStreak = streak + 1;
    const points = target.kind === "gold" ? 3 : 1;
    const combo = nextStreak % 5 === 0 ? 2 : 0;
    const nextScore = score + points + combo;
    setScore(nextScore);
    setStreak(nextStreak);
    setBestStreak((best) => Math.max(best, nextStreak));

    if (target.kind === "gold") {
      setMessage("Golden heart! +3 points ✨");
    } else if (combo > 0) {
      setMessage("5-heart streak! Bonus +2 points! 💖");
    } else {
      setMessage("Lovely catch! Keep going 💗");
    }

    if (nextScore >= WIN_SCORE) {
      setScore(nextScore);
      setGameStatus("won");
      setMessage("You won! Your birthday surprise is ready! ♡");
      setInviteOpen(true);
      // Give the newly unlocked section and overlay a little celebratory arrival.
      window.setTimeout(() => document.getElementById("birthday-invitation")?.focus(), 100);
      return;
    }
    setTargets(makeTargets());
  };

  const shareInvite = async () => {
    const inviteText = "You’re invited to Ishika’s birthday! Wednesday, 14 October 2026 at 4:00 PM — Meekos Rooftop Cafe & Taverna. ♡";
    if (navigator.share) {
      try {
        await navigator.share({ title: "Ishika’s Birthday ♡", text: inviteText });
        setShareMessage("Invite shared — see you there! ♡");
        return;
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(inviteText);
      setShareMessage("Invite text copied. Paste it into your group chat! ♡");
    } catch {
      setShareMessage(inviteText);
    }
  };

  const restartBonusMatch = () => {
    setBonusDeck(makeBonusDeck());
    setBonusFlipped([]);
    setBonusMatched([]);
    setBonusMoves(0);
    setBonusLocked(false);
  };

  const chooseBonusCard = (index: number) => {
    if (bonusLocked || bonusFlipped.includes(index) || bonusMatched.includes(index)) return;
    if (bonusFlipped.length === 0) {
      setBonusFlipped([index]);
      return;
    }
    setBonusMoves((moves) => moves + 1);
    setBonusFlipped([bonusFlipped[0], index]);
    setBonusLocked(true);
  };

  const answerQuiz = (choice: number) => {
    if (quizChoice !== null) return;
    setQuizChoice(choice);
    if (choice === currentQuestion.correct) setQuizScore((value) => value + 1);
  };

  const nextQuizQuestion = () => {
    if (quizIndex === QUIZ.length - 1) {
      setQuizDone(true);
      return;
    }
    setQuizIndex((index) => index + 1);
    setQuizChoice(null);
  };

  const restartQuiz = () => {
    setQuizIndex(0);
    setQuizChoice(null);
    setQuizScore(0);
    setQuizDone(false);
  };

  const stars = Array.from({ length: 20 }, (_, i) => ({
    left: (i * 37 + 11) % 100,
    delay: -((i * 1.7) % 18),
    duration: 12 + (i % 8) * 1.5,
    icon: ["♡", "♥", "✦", "୨୧"][i % 4],
  }));

  return (
    <>
      <div className="floating-hearts" aria-hidden="true">
        {stars.map((heart, index) => <span key={index} className="float-heart" style={{ left: heart.left + "%", animationDelay: heart.delay + "s", animationDuration: heart.duration + "s" }}>{heart.icon}</span>)}
      </div>
      <header className="site-header">
        <a className="logo" href="#top" aria-label="Ishika birthday home">ishika<span>♡</span></a>
        <span className="header-note">a little surprise for you</span>
      </header>

      <main id="top" className="page-shell">
        <section className="hero panel" aria-labelledby="hero-title">
          <span className="sticker sticker-one" aria-hidden="true">🎀</span>
          <span className="sticker sticker-two" aria-hidden="true">✦</span>
          <span className="sticker sticker-three" aria-hidden="true">♡</span>
          <div className="hero-content">
            <div className="eyebrow"><span className="eyebrow-dot" /> YOUR BIRTHDAY MISSION <span className="eyebrow-dot" /></div>
            <h1 id="hero-title">Catch some <em>love!</em></h1>
            <p className="hero-copy">Ishika has a birthday surprise for you! Catch enough hearts before the timer ends to unlock the party invitation. The location is a secret until you win.</p>
            <a className="button button-primary" href="#catch-game">Let’s play <span aria-hidden="true">♡</span></a>
            <div className="hero-foot">✧ Quick fingers, lucky hearts & birthday magic ✧</div>
          </div>
          <div className="hero-orbit orbit-one" aria-hidden="true" />
          <div className="hero-orbit orbit-two" aria-hidden="true" />
        </section>

        <section className="catch-section panel" id="catch-game" aria-labelledby="catch-title">
          <div className="catch-heading">
            <span className="eyebrow">THE MAIN EVENT</span>
            <h2 id="catch-title">Catch the Hearts!</h2>
            <p>Catch <strong>{WIN_SCORE} points</strong> in <strong>{ROUND_SECONDS} seconds</strong> to unlock the surprise.</p>
          </div>
          <div className="how-to-play">
            <span><i className="how-icon">💗</i> Pink heart <b>+1</b></span>
            <span><i className="how-icon">💛</i> Golden heart <b>+3</b></span>
            <span><i className="how-icon">💔</i> Broken heart <b>−2</b></span>
          </div>
          <div className="catch-stats">
            <div className="catch-stat"><span>YOUR SCORE</span><strong>{score}<small> / {WIN_SCORE}</small></strong></div>
            <div className={`catch-timer ${timeLeft <= 5 && gameStatus === "playing" ? "urgent" : ""}`}><span>TIME LEFT</span><strong>00:{String(timeLeft).padStart(2, "0")}</strong></div>
            <div className="catch-stat"><span>HEART STREAK</span><strong>🔥 {streak}</strong></div>
          </div>
          <div className="score-track" role="progressbar" aria-label="Points needed to unlock the invitation" aria-valuemin={0} aria-valuemax={WIN_SCORE} aria-valuenow={Math.min(score, WIN_SCORE)}>
            <span style={{ width: Math.min(100, score / WIN_SCORE * 100) + "%" }} />
          </div>
          <div className={`catch-arena ${gameStatus === "playing" ? "arena-playing" : ""} ${gameStatus === "won" ? "arena-won" : ""}`} ref={gameAreaRef}>
            <div className="arena-sparkle sparkle-top" aria-hidden="true">✦</div>
            <div className="arena-sparkle sparkle-bottom" aria-hidden="true">✧</div>
            {gameStatus === "ready" && <div className="arena-message"><span className="arena-big-emoji">💗</span><strong>Your surprise is waiting!</strong><p>Press start, then tap the floating hearts as fast as you can.</p></div>}
            {gameStatus === "lost" && <div className="arena-message"><span className="arena-big-emoji">🥺</span><strong>So close!</strong><p>You scored {score} points. Your surprise is still locked — try again!</p></div>}
            {gameStatus === "won" && <div className="arena-message"><span className="arena-big-emoji">🎉</span><strong>You unlocked it!</strong><p>Your birthday invitation is ready!</p></div>}
            {(gameStatus === "playing" ? targets : []).map((target) => (
              <button key={target.id} type="button"
                className={`flying-target target-${target.kind}`}
                style={{ left: target.x + "%", top: target.y + "%" }}
                onClick={() => catchTarget(target)}
                aria-label={target.kind === "broken" ? "Broken heart, minus two points" : target.kind === "gold" ? "Golden bonus heart, plus three points" : "Catch pink heart, plus one point"}>
                {target.kind === "broken" ? "💔" : target.kind === "gold" ? "💛" : "💖"}
              </button>
            ))}
          </div>
          <p className={`catch-feedback ${gameStatus === "lost" ? "feedback-lost" : gameStatus === "won" ? "feedback-won" : ""}`} role="status" aria-live="polite">{message}</p>
          {gameStatus === "ready" && <button className="button button-primary catch-start" type="button" onClick={startGame}>Start the challenge! <span aria-hidden="true">♡</span></button>}
          {gameStatus === "playing" && <button className="button button-soft catch-start" type="button" onClick={startGame}>Restart round ↻</button>}
          {gameStatus === "lost" && <button className="button button-primary catch-start" type="button" onClick={startGame}>Try again — I’ve got this! ♡</button>}
          {gameStatus === "won" && <button className="button button-primary catch-start" type="button" onClick={() => setInviteOpen(true)}>Open my invitation 🎀</button>}
          <p className="catch-footnote">Best streak: <strong>{bestStreak}</strong> hearts · Golden hearts give a boost, broken hearts cost points! ✨</p>
        </section>

        {won && !inviteOpen && (
          <section className="unlocked-invite panel" aria-labelledby="unlocked-invite-title">
            <div className="unlocked-bow" aria-hidden="true">🎉　♡　🎀</div>
            <span className="pill">YOU DID IT!</span>
            <h2 id="unlocked-invite-title">You're invited, birthday bestie!</h2>
            <p>Come celebrate with Ishika at</p>
            <h3 className="venue-name">Meekos Rooftop<br />Cafe &amp; Taverna</h3>
            <div className="event-details">
              <div className="event-detail"><span className="detail-icon" aria-hidden="true">📅</span><div><span className="detail-label">WHEN</span><strong>Wednesday, 14 October 2026</strong></div></div>
              <div className="event-detail"><span className="detail-icon" aria-hidden="true">🕓</span><div><span className="detail-label">TIME</span><strong>4:00 PM</strong></div></div>
            </div>
            <div className="surprise-actions">
              <a className="button button-primary" href="https://www.google.com/maps/search/?api=1&query=Meekos+Rooftop+Cafe+%26+Taverna" target="_blank" rel="noopener noreferrer">Get directions ↗</a>
              <button className="button button-soft" type="button" onClick={shareInvite}>Share invite ♡</button>
              <button className="button button-soft" type="button" onClick={() => setInviteOpen(true)}>View invitation again</button>
            </div>
            <p className="share-status" role="status" aria-live="polite">{shareMessage}</p>
          </section>
        )}

        {won && (
          <section className="bonus-section" id="bonus-games" aria-labelledby="bonus-title">
            <div className="section-heading bonus-heading">
              <span className="eyebrow">UNLOCKED BONUS ROUND</span>
              <h2 id="bonus-title">Stay for two more games!</h2>
              <p>You’ve earned the invite. Fancy a little more birthday fun? ♡</p>
            </div>
            <div className="bonus-grid">
              <article className="bonus-card">
                <div className="bonus-emoji" aria-hidden="true">🃏</div><span className="bonus-tag">BONUS GAME 01</span><h3>Memory match</h3>
                <p>Match all three cute pairs in as few moves as you can.</p>
                <div className="bonus-match-board">
                  {bonusDeck.map((card, index) => {
                    const show = bonusFlipped.includes(index) || bonusMatched.includes(index);
                    return <button type="button" key={card.id} className={`bonus-memory-card ${show ? "is-revealed" : ""} ${bonusMatched.includes(index) ? "is-pair" : ""}`} onClick={() => chooseBonusCard(index)} disabled={bonusLocked || show} aria-label={show ? `Card ${card.icon}` : `Hidden card ${index+1}`}>{show ? card.icon : "♡"}</button>;
                  })}
                </div>
                <p className="bonus-feedback" role="status" aria-live="polite">{bonusMatched.length === 6 ? `All pairs found in ${bonusMoves} moves! Amazing memory. ♡` : `${bonusMatched.length / 2} of 3 pairs · ${bonusMoves} moves`}</p>
                <button type="button" className="button button-soft bonus-button" onClick={restartBonusMatch}>Restart memory game ↻</button>
              </article>

              <article className="bonus-card">
                <div className="bonus-emoji" aria-hidden="true">🎀</div><span className="bonus-tag">BONUS GAME 02</span><h3>Birthday bestie quiz</h3>
                {quizDone ? (
                  <div className="quiz-result"><div className="quiz-score" aria-hidden="true">{quizScore === 3 ? "🏆" : quizScore === 2 ? "🌟" : "💝"}</div><p className="quiz-question">You scored {quizScore} out of {QUIZ.length}!</p><p>{quizScore === 3 ? "Certified birthday bestie energy!" : "A little more party practice and you’re ready!"}</p><button type="button" className="button button-soft bonus-button" onClick={() => { setQuizIndex(0); setQuizChoice(null); setQuizScore(0); setQuizDone(false); }}>Play quiz again ↻</button></div>
                ) : (
                  <>
                    <div className="quiz-progress">QUESTION {quizIndex + 1} OF {QUIZ.length}</div>
                    <p className="quiz-question">{currentQuestion.question}</p>
                    <div className="quiz-answers">{currentQuestion.answers.map((answer, index) => <button type="button" key={answer} className={`quiz-answer ${quizChoice === index ? "is-selected" : ""} ${quizChoice !== null && index === currentQuestion.correct ? "is-correct" : ""}`} onClick={() => { if (quizChoice === null) answerQuiz(index); }} disabled={quizChoice !== null}><span>{["A", "B", "C"][index]}</span>{answer}</button>)}</div>
                    {quizChoice !== null && <div className="quiz-next-wrap"><p className="quiz-feedback">{quizChoice === currentQuestion.correct ? "Correct! Party pro! ♡" : "Cute try! Here's the right answer ♡"}</p><button type="button" className="button button-primary bonus-button" onClick={nextQuizQuestion}>{quizIndex === QUIZ.length - 1 ? "See my score" : "Next question →"}</button></div>}
                  </>
                )}
              </article>
            </div>
          </section>
        )}

        <footer className="site-footer"><div className="footer-bow" aria-hidden="true">୨୧</div><p>Made with lots of love for Ishika’s birthday crew.</p><span>Be there. Be cute. Make memories. ♡</span></footer>
      </main>

      {inviteOpen && won && (
        <div className="invite-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setInviteOpen(false); }}>
          <section className="invite-modal" id="birthday-invitation" role="dialog" aria-modal="true" aria-labelledby="surprise-title" tabIndex={-1}>
            <button className="modal-close" type="button" onClick={() => setInviteOpen(false)} aria-label="Close invitation">×</button>
            <div className="modal-confetti" aria-hidden="true">🎉　💗　🎂　🎀　✨</div>
            <span className="pill">SURPRISE UNLOCKED!</span>
            <h2 id="surprise-title">You did it, birthday bestie! <span aria-hidden="true">♡</span></h2>
            <p className="surprise-intro">Your invitation to celebrate with Ishika is here!</p>
            <div className="venue-art" aria-hidden="true"><span className="venue-spark spark-a">✦</span><span className="venue-spark spark-b">♡</span><span className="venue-emoji">🌷</span></div>
            <h3 className="venue-name">Meekos Rooftop<br />Cafe &amp; Taverna</h3>
            <div className="event-details">
              <div className="event-detail"><span className="detail-icon" aria-hidden="true">📅</span><div><span className="detail-label">WHEN</span><strong>Wednesday, 14 October 2026</strong></div></div>
              <div className="event-detail"><span className="detail-icon" aria-hidden="true">🕓</span><div><span className="detail-label">TIME</span><strong>4:00 PM</strong></div></div>
            </div>
            <p className="bring-note">Bring your biggest smile, your cutest fit, and your birthday energy. Let’s make lovely memories together! ♡</p>
            <div className="surprise-actions"><a className="button button-primary" href="https://www.google.com/maps/search/?api=1&query=Meekos+Rooftop+Cafe+%26+Taverna" target="_blank" rel="noopener noreferrer">Get directions ↗</a><button className="button button-soft" type="button" onClick={shareInvite}>Share invite ♡</button></div>
            <p className="share-status" role="status" aria-live="polite">{shareMessage}</p>
            <button className="bonus-link" type="button" onClick={() => { setInviteOpen(false); window.setTimeout(() => document.getElementById("bonus-games")?.scrollIntoView({ behavior: "smooth" }), 80); }}>Try the bonus games ↓</button>
          </section>
        </div>
      )}
    </>
  );
}
