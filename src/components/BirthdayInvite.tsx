"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const ICONS = ["🎀", "🍓", "🎂"];
type Card = { id: number; icon: string };

function makeDeck(): Card[] {
  const cards = [...ICONS, ...ICONS].map((icon, id) => ({ icon, id }));
  for (let i = cards.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

const QUIZ = [
  {
    question: "What does 🎂 + 🎉 + 💗 mean?",
    answers: ["A birthday celebration!", "A cake-eating competition", "A secret homework club"],
    correct: 0,
  },
  {
    question: "What should you bring to Ishika's party?",
    answers: ["Your sleepy face", "A big smile and good vibes", "Your entire wardrobe"],
    correct: 1,
  },
  {
    question: "What's the best birthday-party accessory?",
    answers: ["A party crown 👑", "A maths textbook 📚", "A rainy-day umbrella ☔"],
    correct: 0,
  },
];

export function BirthdayInvite() {
  const [deck, setDeck] = useState<Card[]>(() => [
    { icon: "🍓", id: 0 }, { icon: "🎀", id: 1 }, { icon: "🎂", id: 2 },
    { icon: "🎀", id: 3 }, { icon: "🍓", id: 4 }, { icon: "🎂", id: 5 },
  ]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [shareMessage, setShareMessage] = useState("");
  const hearts = Array.from({ length: 20 }, (_, i) => ({
    left: (i * 37 + 11) % 100,
    delay: -((i * 1.7) % 18),
    duration: 12 + (i % 8) * 1.5,
    icon: ["♡", "♥", "✦", "୨୧"][i % 4],
  }));
  const timerRef = useRef<number | null>(null);

  // Bonus game: collect as many hearts as possible in 10 seconds.
  const [catchRunning, setCatchRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(10);
  const [caught, setCaught] = useState(0);
  const [targetPosition, setTargetPosition] = useState({ x: 50, y: 50 });

  // Bonus game: a quick three-question birthday quiz.
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizChoice, setQuizChoice] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

  const restart = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setDeck(makeDeck());
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setLocked(false);
    setInviteOpen(false);
    setShareMessage("");
  }, []);

  useEffect(() => () => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
  }, []);

  useEffect(() => {
    if (!inviteOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setInviteOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [inviteOpen]);

  useEffect(() => {
    if (!catchRunning || secondsLeft <= 0) return;
    const timer = window.setTimeout(() => {
      setSecondsLeft((s) => {
        const next = s - 1;
        if (next <= 0) setCatchRunning(false);
        return Math.max(0, next);
      });
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [catchRunning, secondsLeft]);

  const chooseCard = (index: number) => {
    if (locked || flipped.includes(index) || matched.includes(index) || deck.length === 0) return;
    if (flipped.length === 0) {
      setFlipped([index]);
      return;
    }

    const firstIndex = flipped[0];
    const secondIndex = index;
    setMoves((n) => n + 1);
    setFlipped([firstIndex, secondIndex]);
    setLocked(true);

    if (deck[firstIndex]?.icon === deck[secondIndex]?.icon) {
      timerRef.current = window.setTimeout(() => {
        const nextMatched = [...matched, firstIndex, secondIndex];
        setMatched(nextMatched);
        setFlipped([]);
        setLocked(false);
        timerRef.current = null;
        if (nextMatched.length === deck.length) {
          setInviteOpen(true);
          window.setTimeout(() => {
            document.getElementById("birthday-invitation")?.focus();
          }, 100);
        }
      }, 420);
    } else {
      timerRef.current = window.setTimeout(() => {
        setFlipped([]);
        setLocked(false);
        timerRef.current = null;
      }, 900);
    }
  };

  const shareInvite = async () => {
    const text = "You're invited to Ishika's birthday! Wednesday, 14 October at 4:00 PM — Meekos Rooftop Cafe & Taverna. Solve the matching game to reveal the surprise. ♡";
    if (navigator.share) {
      try {
        await navigator.share({ title: "Ishika's Birthday ♡", text });
        setShareMessage("Invite shared — see you there! ♡");
        return;
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      setShareMessage("Invite text copied. Paste it into your group chat! ♡");
    } catch {
      setShareMessage(text);
    }
  };

  const startCatchGame = () => {
    setCaught(0);
    setSecondsLeft(10);
    setTargetPosition({ x: 50, y: 50 });
    setCatchRunning(true);
  };

  const catchHeart = () => {
    if (!catchRunning) return;
    const next = caught + 1;
    setCaught(next);
    setTargetPosition({
      x: 12 + ((next * 29 + 17) % 76),
      y: 18 + ((next * 41 + 13) % 62),
    });
    if (next >= 10) setCatchRunning(false);
  };

  const currentQuestion = QUIZ[quizIndex];
  const gameSolved = deck.length > 0 && matched.length === deck.length;

  const answerQuiz = (choice: number) => {
    if (quizChoice !== null) return;
    setQuizChoice(choice);
    if (choice === currentQuestion.correct) setQuizScore((s) => s + 1);
  };

  const nextQuizQuestion = () => {
    if (quizIndex === QUIZ.length - 1) {
      setQuizDone(true);
      return;
    }
    setQuizIndex((i) => i + 1);
    setQuizChoice(null);
  };

  const restartQuiz = () => {
    setQuizIndex(0);
    setQuizChoice(null);
    setQuizScore(0);
    setQuizDone(false);
  };

  return (
    <>
      <div className="floating-hearts" aria-hidden="true">
        {hearts.map((heart, i) => (
          <span key={i} className="float-heart" style={{
            left: heart.left + "%",
            animationDelay: heart.delay + "s",
            animationDuration: heart.duration + "s",
          }}>{heart.icon}</span>
        ))}
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
            <div className="eyebrow"><span className="eyebrow-dot" /> YOU’RE ON THE GUEST LIST <span className="eyebrow-dot" /></div>
            <h1 id="hero-title">Hey, birthday <em>cutie!</em></h1>
            <p className="hero-copy">Ishika is planning a little birthday celebration, and you’re invited! There’s just one tiny thing… the party details are locked behind a cute little game.</p>
            <a className="button button-primary" href="#game">Unlock the surprise <span aria-hidden="true">♡</span></a>
            <div className="hero-foot">✧ Good friends, sweet treats & lovely memories ✧</div>
          </div>
          <div className="hero-orbit orbit-one" aria-hidden="true" />
          <div className="hero-orbit orbit-two" aria-hidden="true" />
        </section>

        <section className="game-section panel" id="game" aria-labelledby="game-title">
          <div className="section-heading">
            <span className="eyebrow">THE MINI CHALLENGE</span>
            <h2 id="game-title">Find the matching pairs</h2>
            <p>Flip the cards and match all <strong>3 pairs</strong> to reveal the party location and time.</p>
          </div>
          <div className="game-stats" aria-label="Game progress">
            <div className="stat"><span className="stat-icon" aria-hidden="true">🃏</span><span className="stat-label">Moves</span><strong>{moves}</strong></div>
            <div className="stat"><span className="stat-icon" aria-hidden="true">💗</span><span className="stat-label">Pairs found</span><strong>{matched.length / 2}<span className="stat-total"> / 3</span></strong></div>
          </div>
          <div className="game-board" role="group" aria-label="Memory matching cards">
            {deck.map((card, index) => {
              const isFlipped = flipped.includes(index);
              const isMatched = matched.includes(index);
              return (
                <button type="button" key={card.id}
                  className={`memory-card ${isFlipped ? "is-flipped" : ""} ${isMatched ? "is-matched" : ""}`}
                  onClick={() => chooseCard(index)}
                  disabled={isMatched || isFlipped || locked}
                  aria-label={isFlipped || isMatched ? `Card showing ${card.icon}` : `Hidden card ${index + 1}`}
                  aria-pressed={isFlipped || isMatched}>
                  <span className="card-back" aria-hidden="true">♡</span>
                  <span className="card-front" aria-hidden="true">{card.icon}</span>
                </button>
              );
            })}
          </div>
          <p className="game-status" role="status" aria-live="polite">
            {gameSolved ? `Perfect match! You did it in ${moves} moves. Surprise unlocked! ♡`
              : flipped.length === 1 ? "Now find the matching picture…"
              : matched.length > 0 ? "It's a match! Find another pair. ♡"
              : "Pick any two cards to get started!"}
          </p>
          <div className="game-controls"><button className="button button-soft" type="button" onClick={restart}>↻ Restart game</button></div>
          <p className="game-hint">✦ Hint: matching cards have the same little picture.</p>
        </section>

        <section className="bonus-section" id="bonus-games" aria-labelledby="bonus-title">
          <div className="section-heading bonus-heading">
            <span className="eyebrow">BONUS ROUND</span>
            <h2 id="bonus-title">Two more tiny games</h2>
            <p>The invitation is unlocked above — stay for a couple more fun challenges! ♡</p>
          </div>
          <div className="bonus-grid">
            <article className="bonus-card catch-card">
              <div className="bonus-emoji" aria-hidden="true">💗</div>
              <span className="bonus-tag">GAME 02 · QUICK REFLEXES</span>
              <h3>Catch the hearts!</h3>
              <p>Catch 10 hearts before the timer runs out. Ready, set, tap!</p>
              <div className="catch-arena">
                {catchRunning ? (
                  <button className="moving-heart" type="button" style={{ left: targetPosition.x + "%", top: targetPosition.y + "%" }} onClick={catchHeart} aria-label="Catch the moving heart">💖</button>
                ) : (
                  <span className="arena-idle" aria-hidden="true">{caught >= 10 ? "🏆" : caught > 0 ? "⏰" : "♡"}</span>
                )}
                <span className="arena-counter">{caught}/10 hearts</span>
              </div>
              <div className="catch-meta"><span>⏱ {secondsLeft}s left</span><span>{caught >= 10 ? "You did it!" : !catchRunning && secondsLeft === 0 ? "Time's up!" : "Target: 10 hearts"}</span></div>
              <button className="button button-primary bonus-button" type="button" onClick={startCatchGame}>{caught >= 10 ? "Play again ♡" : catchRunning ? "Restart challenge ↻" : "Start challenge ♡"}</button>
              <p className="bonus-feedback" role="status" aria-live="polite">{caught >= 10 ? "Lightning-fast! Heart catcher champion. 💗" : !catchRunning && secondsLeft === 0 ? `You caught ${caught} hearts — try once more!` : catchRunning ? "Go go go! Tap the moving heart!" : "Your 10-second challenge is ready."}</p>
            </article>

            <article className="bonus-card quiz-card">
              <div className="bonus-emoji" aria-hidden="true">🎀</div>
              <span className="bonus-tag">GAME 03 · QUICK QUIZ</span>
              <h3>Birthday bestie quiz</h3>
              {quizDone ? (
                <div className="quiz-result">
                  <div className="quiz-score" aria-hidden="true">{quizScore === 3 ? "🏆" : quizScore === 2 ? "🌟" : "💝"}</div>
                  <p className="quiz-question">You scored {quizScore} out of {QUIZ.length}!</p>
                  <p>{quizScore === 3 ? "Certified birthday bestie energy!" : "A little more party practice and you're ready!"}</p>
                  <button type="button" className="button button-soft bonus-button" onClick={restartQuiz}>Play quiz again ↻</button>
                </div>
              ) : (
                <>
                  <div className="quiz-progress">QUESTION {quizIndex + 1} OF {QUIZ.length}</div>
                  <p className="quiz-question">{currentQuestion.question}</p>
                  <div className="quiz-answers">
                    {currentQuestion.answers.map((answer, index) => {
                      const selected = quizChoice === index;
                      const showCorrect = quizChoice !== null && index === currentQuestion.correct;
                      return (
                        <button type="button" key={answer}
                          className={`quiz-answer ${selected ? "is-selected" : ""} ${showCorrect ? "is-correct" : ""}`}
                          onClick={() => answerQuiz(index)} disabled={quizChoice !== null}>
                          <span>{["A", "B", "C"][index]}</span>{answer}
                        </button>
                      );
                    })}
                  </div>
                  {quizChoice !== null && (
                    <div className="quiz-next-wrap">
                      <p className="quiz-feedback">{quizChoice === currentQuestion.correct ? "Correct! Party pro! ♡" : "Cute try! Here's the right answer ♡"}</p>
                      <button type="button" className="button button-primary bonus-button" onClick={nextQuizQuestion}>{quizIndex === QUIZ.length - 1 ? "See my score" : "Next question →"}</button>
                    </div>
                  )}
                </>
              )}
            </article>
          </div>
        </section>

        <footer className="site-footer"><div className="footer-bow" aria-hidden="true">୨୧</div><p>Made with lots of love for Ishika’s birthday crew.</p><span>Be there. Be cute. Make memories. ♡</span></footer>
      </main>

      {inviteOpen && gameSolved && (
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
            <p className="bring-note">Bring your biggest smile, your cutest fit, and your birthday energy. Let's make lovely memories together! ♡</p>
            <div className="surprise-actions">
              <a className="button button-primary" href="https://www.google.com/maps/search/?api=1&query=Meekos+Rooftop+Cafe+%26+Taverna" target="_blank" rel="noopener noreferrer">Get directions ↗</a>
              <button className="button button-soft" type="button" onClick={shareInvite}>Share invite ♡</button>
            </div>
            <p className="share-status" role="status" aria-live="polite">{shareMessage}</p>
            <button className="bonus-link" type="button" onClick={() => { setInviteOpen(false); window.setTimeout(() => document.getElementById("bonus-games")?.scrollIntoView({ behavior: "smooth" }), 80); }}>Play two more games ↓</button>
          </section>
        </div>
      )}
    </>
  );
}
