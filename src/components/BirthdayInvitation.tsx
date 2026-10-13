"use client";

import { useEffect, useRef, useState } from "react";

type MemoryCard = {
  id: number;
  pair: string;
  emoji: string;
};

const SYMBOLS = [
  { pair: "bow", emoji: "🎀" },
  { pair: "strawberry", emoji: "🍓" },
  { pair: "cake", emoji: "🎂" },
];

const ORIGINAL_CARDS: MemoryCard[] = SYMBOLS.flatMap((item, pairIndex) => [
  { id: pairIndex * 2 + 1, pair: item.pair, emoji: item.emoji },
  { id: pairIndex * 2 + 2, pair: item.pair, emoji: item.emoji },
]);

const PARTY_DATE = "Wednesday, 14 October 2026";
const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Meekos+Rooftop+Cafe+%26+Taverna";

function shuffleCards(cards: MemoryCard[]): MemoryCard[] {
  const shuffled = [...cards];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[target]] = [shuffled[target], shuffled[index]];
  }
  return shuffled;
}

export function BirthdayInvitation() {
  const [cards, setCards] = useState<MemoryCard[]>(ORIGINAL_CARDS);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [isResolving, setIsResolving] = useState(false);
  const [showSurprise, setShowSurprise] = useState(false);
  const [status, setStatus] = useState("Pick any two cards to get started!");
  const [shareStatus, setShareStatus] = useState("");
  const [confetti, setConfetti] = useState<
    { id: number; emoji: string; left: string; delay: string; size: string }[]
  >([]);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    setCards(shuffleCards(ORIGINAL_CARDS));
    return () => {
      timers.current.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  useEffect(() => {
    if (!showSurprise) {
      setConfetti([]);
      return;
    }

    const emojis = ["💗", "✨", "🎀", "💕", "🌸", "🎉"];
    setConfetti(
      Array.from({ length: 28 }, (_, index) => ({
        id: index,
        emoji: emojis[index % emojis.length],
        left: (4 + Math.random() * 92) + "%",
        delay: (Math.random() * 0.6) + "s",
        size: (14 + Math.random() * 16) + "px",
      })),
    );
  }, [showSurprise]);

  function later(callback: () => void, delay: number) {
    const timer = setTimeout(callback, delay);
    timers.current.push(timer);
  }

  function resetGame() {
    timers.current.forEach((timer) => clearTimeout(timer));
    timers.current = [];
    setCards(shuffleCards(ORIGINAL_CARDS));
    setFlippedIds([]);
    setMatchedPairs([]);
    setMoves(0);
    setIsResolving(false);
    setShowSurprise(false);
    setShareStatus("");
    setStatus("Fresh shuffle! Pick any two cards. ♡");
  }

  function flipCard(card: MemoryCard) {
    if (
      isResolving ||
      flippedIds.includes(card.id) ||
      matchedPairs.includes(card.pair) ||
      showSurprise
    ) {
      return;
    }

    if (flippedIds.length === 0) {
      setFlippedIds([card.id]);
      setStatus("Now find its matching picture…");
      return;
    }

    const firstId = flippedIds[0];
    const firstCard = cards.find((item) => item.id === firstId);
    if (!firstCard) {
      setFlippedIds([]);
      return;
    }

    const selectedIds = [firstId, card.id];
    const nextMoveCount = moves + 1;
    setMoves(nextMoveCount);
    setFlippedIds(selectedIds);
    setIsResolving(true);

    if (firstCard.pair === card.pair) {
      const nextMatched = [...matchedPairs, card.pair];
      setMatchedPairs(nextMatched);
      setStatus("It's a match! You're so good at this. ♡");

      later(() => {
        setFlippedIds([]);
        setIsResolving(false);
        if (nextMatched.length === SYMBOLS.length) {
          setStatus("You matched every pair! The surprise is all yours. ♡");
          setShowSurprise(true);
        } else {
          setStatus("Lovely! Find the next matching pair.");
        }
      }, 650);
      return;
    }

    setStatus("Not a match — remember where those pictures are!");
    later(() => {
      setFlippedIds([]);
      setIsResolving(false);
      setStatus("Try another pair. You've got this!");
    }, 900);
  }

  async function shareInvitation() {
    const shareData = {
      title: "Ishika's Birthday ♡",
      text:
        "You're invited to celebrate with Ishika tomorrow, Wednesday 14 October at 4:00 PM — Meekos Rooftop Cafe & Taverna. Open the birthday invitation and solve the matching game to reveal the surprise. ♡",
      url: typeof window !== "undefined" ? window.location.href : undefined,
    };

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(shareData);
        setShareStatus("Invite shared. See you there! ♡");
        return;
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
      }
    }

    try {
      await navigator.clipboard.writeText(
        shareData.text + (shareData.url ? "\n" + shareData.url : ""),
      );
      setShareStatus("Invite copied! Paste it into your friends' group chat. ♡");
    } catch {
      setShareStatus(shareData.text);
    }
  }

  function jumpToGame() {
    document.getElementById("birthday-game")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <div className="invite-page">
      <div className="invite-float-layer" aria-hidden="true">
        {Array.from({ length: 16 }, (_, index) => (
          <span
            className="invite-float"
            key={index}
            style={{
              left: ((index * 17 + 5) % 97) + "%",
              animationDuration: 12 + (index % 5) * 2 + "s",
              animationDelay: -((index % 8) * 2) + "s",
              fontSize: 14 + (index % 4) * 5 + "px",
            }}
          >
            {["♡", "♥", "✦", "୨୧"][index % 4]}
          </span>
        ))}
      </div>

      {confetti.map((piece) => (
        <span
          aria-hidden="true"
          className="invite-confetti"
          key={piece.id}
          style={{
            left: piece.left,
            animationDelay: piece.delay,
            fontSize: piece.size,
          }}
        >
          {piece.emoji}
        </span>
      ))}

      <header className="invite-header">
        <a className="invite-logo" href="#top" aria-label="Birthday invitation home">
          ishika<span>♡</span>
        </a>
        <span className="invite-header-note">a little surprise for you</span>
      </header>

      <main id="top" className="invite-main">
        <section className="invite-hero invite-panel" aria-labelledby="invite-title">
          <span className="invite-sticker invite-sticker-one" aria-hidden="true">🎀</span>
          <span className="invite-sticker invite-sticker-two" aria-hidden="true">✦</span>
          <span className="invite-sticker invite-sticker-three" aria-hidden="true">♡</span>
          <div className="invite-hero-content">
            <div className="invite-eyebrow">
              <span /> YOU&apos;RE ON THE GUEST LIST <span />
            </div>
            <h1 id="invite-title">
              Hey, birthday <em>cutie!</em>
            </h1>
            <p className="invite-hero-copy">
              Ishika is planning a little birthday celebration, and you&apos;re invited!
              There&apos;s just one tiny thing… the party details are locked behind a cute
              little game.
            </p>
            <button className="invite-button invite-button-primary" onClick={jumpToGame} type="button">
              Unlock the surprise <span aria-hidden="true">♡</span>
            </button>
            <div className="invite-hero-foot">
              <span aria-hidden="true">✧</span> Good friends, sweet treats &amp; lovely memories <span aria-hidden="true">✧</span>
            </div>
          </div>
          <div className="invite-orbit invite-orbit-one" aria-hidden="true" />
          <div className="invite-orbit invite-orbit-two" aria-hidden="true" />
        </section>

        <section
          className="invite-game invite-panel"
          id="birthday-game"
          aria-labelledby="game-title"
        >
          <div className="invite-section-heading">
            <span className="invite-eyebrow">THE MINI CHALLENGE</span>
            <h2 id="game-title">Find the matching pairs</h2>
            <p>
              Flip the cards and match all <strong>3 pairs</strong> to reveal the party
              location and time.
            </p>
          </div>

          <div className="invite-game-stats" aria-label="Game progress">
            <div className="invite-stat">
              <span className="invite-stat-icon" aria-hidden="true">🃏</span>
              <span className="invite-stat-label">Moves</span>
              <strong>{moves}</strong>
            </div>
            <div className="invite-stat">
              <span className="invite-stat-icon" aria-hidden="true">💗</span>
              <span className="invite-stat-label">Pairs found</span>
              <strong>{matchedPairs.length}<span className="invite-stat-total"> / 3</span></strong>
            </div>
          </div>

          <div className="invite-board" role="group" aria-label="Memory matching cards">
            {cards.map((card) => {
              const isMatched = matchedPairs.includes(card.pair);
              const isFlipped = flippedIds.includes(card.id) || isMatched;
              return (
                <button
                  aria-label={isFlipped ? "Revealed " + card.pair : "Hidden memory card"}
                  aria-pressed={isFlipped}
                  className={[
                    "invite-memory-card",
                    isFlipped ? "is-flipped" : "",
                    isMatched ? "is-matched" : "",
                  ].filter(Boolean).join(" ")}
                  disabled={isMatched || isResolving || showSurprise}
                  key={card.id}
                  onClick={() => flipCard(card)}
                  type="button"
                >
                  <span className="invite-card-back" aria-hidden="true">♡</span>
                  <span className="invite-card-front" aria-hidden="true">{card.emoji}</span>
                </button>
              );
            })}
          </div>

          <p className="invite-game-status" aria-live="polite" role="status">{status}</p>
          <div className="invite-game-controls">
            <button className="invite-button invite-button-soft" onClick={resetGame} type="button">
              <span aria-hidden="true">↻</span> Restart game
            </button>
          </div>
          <p className="invite-game-hint"><span aria-hidden="true">✦</span> Matching cards have the same little picture.</p>
        </section>

        {showSurprise && (
          <section className="invite-surprise" aria-labelledby="surprise-title">
            <div className="invite-confetti-row" aria-hidden="true">🎉　💗　🎂　🎀　✨</div>
            <div className="invite-surprise-card">
              <span className="invite-pill">SURPRISE UNLOCKED!</span>
              <h2 id="surprise-title">It&apos;s birthday time! <span>♡</span></h2>
              <p className="invite-surprise-intro">Come celebrate with Ishika and the crew!</p>
              <div className="invite-venue-art" aria-hidden="true">
                <span className="invite-venue-spark invite-spark-a">✦</span>
                <span className="invite-venue-spark invite-spark-b">♡</span>
                <span className="invite-venue-emoji">🌷</span>
              </div>
              <h3 className="invite-venue-name">Meekos Rooftop<br />Cafe &amp; Taverna</h3>
              <div className="invite-event-details">
                <div className="invite-event-detail">
                  <span className="invite-detail-icon" aria-hidden="true">📅</span>
                  <div><span className="invite-detail-label">WHEN</span><strong>{PARTY_DATE}</strong></div>
                </div>
                <div className="invite-event-detail">
                  <span className="invite-detail-icon" aria-hidden="true">🕓</span>
                  <div><span className="invite-detail-label">TIME</span><strong>4:00 PM</strong></div>
                </div>
              </div>
              <p className="invite-bring-note">
                Bring your biggest smile, your cutest fit, and your birthday energy.
                Can&apos;t wait to make memories together! ♡
              </p>
              <div className="invite-surprise-actions">
                <a className="invite-button invite-button-primary" href={MAPS_URL} target="_blank" rel="noreferrer">
                  Get directions <span aria-hidden="true">↗</span>
                </a>
                <button className="invite-button invite-button-soft" onClick={shareInvitation} type="button">
                  Share invite <span aria-hidden="true">♡</span>
                </button>
              </div>
              <p className="invite-share-status" aria-live="polite">{shareStatus}</p>
            </div>
          </section>
        )}

        <footer className="invite-footer">
          <div className="invite-footer-bow" aria-hidden="true">୨୧</div>
          <p>Made with lots of love for Ishika&apos;s birthday crew.</p>
          <span>Be there. Be cute. Make memories. ♡</span>
        </footer>
      </main>
    </div>
  );
}
