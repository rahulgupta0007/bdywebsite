"use client";

import { useCallback, useEffect, useState } from "react";

const ICONS = ["🎀", "🍓", "🎂"];

type Card = { id: number; icon: string };

function makeDeck(): Card[] {
  const cards = [...ICONS, ...ICONS].map((icon, id) => ({ id, icon }));
  for (let i = cards.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

export function BirthdayInvite() {
  const [deck, setDeck] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);
  const [shareMessage, setShareMessage] = useState("");
  const [hearts, setHearts] = useState<{ left: number; delay: number; duration: number; icon: string }[]>([]);

  const restart = useCallback(() => {
    setDeck(makeDeck());
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setLocked(false);
    setShareMessage("");
  }, []);

  useEffect(() => {
    restart();
    setHearts(Array.from({ length: 20 }, (_, i) => ({
      left: (i * 37 + 11) % 100,
      delay: -((i * 1.7) % 18),
      duration: 12 + (i % 8) * 1.5,
      icon: ["♡", "♥", "✦", "୨୧"][i % 4],
    })));
  }, [restart]);

  useEffect(() => {
    if (flipped.length !== 2) return;
    const [first, second] = flipped;
    if (deck[first]?.icon === deck[second]?.icon) {
      const timer = window.setTimeout(() => {
        setMatched((old) => {
          const next = [...old, first, second];
          return next;
        });
        setFlipped([]);
      }, 300);
      return () => window.clearTimeout(timer);
    }
    const timer = window.setTimeout(() => setFlipped([]), 850);
    return () => window.clearTimeout(timer);
  }, [flipped, deck]);

  useEffect(() => {
    if (flipped.length === 2) {
      setLocked(true);
      const timer = window.setTimeout(() => setLocked(false), 860);
      return () => window.clearTimeout(timer);
    }
    setLocked(false);
  }, [flipped]);

  const chooseCard = (index: number) => {
    if (locked || flipped.includes(index) || matched.includes(index) || deck.length === 0) return;
    setMoves((n) => n + (flipped.length === 1 ? 1 : 0));
    setFlipped((old) => [...old, index]);
  };

  const solved = deck.length > 0 && matched.length === deck.length;
  const shareInvite = async () => {
    const text = "You're invited to Ishika's birthday! Wednesday, 14 October at 4:00 PM — Meekos Rooftop Cafe & Taverna. Open the invite and solve the matching game to reveal the surprise. ♡";
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
        <a className="logo" href="#top">ishika<span>♡</span></a>
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
                <button
                  type="button"
                  key={card.id}
                  className={`memory-card ${isFlipped ? "is-flipped" : ""} ${isMatched ? "is-matched" : ""}`}
                  onClick={() => chooseCard(index)}
                  disabled={isMatched || isFlipped || locked}
                  aria-label={isFlipped || isMatched ? `Card showing ${card.icon}` : `Hidden card ${index + 1}`}
                  aria-pressed={isFlipped || isMatched}
                >
                  <span className="card-back" aria-hidden="true">♡</span>
                  <span className="card-front" aria-hidden="true">{card.icon}</span>
                </button>
              );
            })}
          </div>
          <p className="game-status" role="status" aria-live="polite">
            {solved ? `Perfect match! You did it in ${moves} moves. Surprise time! ♡`
              : flipped.length === 1 ? "Now find the matching picture…"
              : matched.length > 0 ? "It's a match! Find another pair. ♡"
              : "Pick any two cards to get started!"}
          </p>
          <div className="game-controls">
            <button className="button button-soft" type="button" onClick={restart}>↻ Restart game</button>
          </div>
          <p className="game-hint">✦ Hint: matching cards have the same little picture.</p>
        </section>

        {solved && (
          <section className="surprise-section" aria-labelledby="surprise-title">
            <div className="confetti-row" aria-hidden="true">🎉　💗　🎂　🎀　✨</div>
            <div className="surprise-card">
              <span className="pill">SURPRISE UNLOCKED!</span>
              <h2 id="surprise-title">It’s birthday time! <span aria-hidden="true">♡</span></h2>
              <p className="surprise-intro">Come celebrate with Ishika and the crew!</p>
              <div className="venue-art" aria-hidden="true"><span className="venue-spark spark-a">✦</span><span className="venue-spark spark-b">♡</span><span className="venue-emoji">🌷</span></div>
              <h3 className="venue-name">Meekos Rooftop<br />Cafe &amp; Taverna</h3>
              <div className="event-details">
                <div className="event-detail"><span className="detail-icon" aria-hidden="true">📅</span><div><span className="detail-label">WHEN</span><strong>Wednesday, 14 October 2026</strong></div></div>
                <div className="event-detail"><span className="detail-icon" aria-hidden="true">🕓</span><div><span className="detail-label">TIME</span><strong>4:00 PM</strong></div></div>
              </div>
              <p className="bring-note">Bring your biggest smile, your cutest fit, and your birthday energy. Can’t wait to make memories together! ♡</p>
              <div className="surprise-actions">
                <a className="button button-primary" href="https://www.google.com/maps/search/?api=1&query=Meekos+Rooftop+Cafe+%26+Taverna" target="_blank" rel="noopener noreferrer">Get directions ↗</a>
                <button className="button button-soft" type="button" onClick={shareInvite}>Share invite ♡</button>
              </div>
              <p className="share-status" role="status" aria-live="polite">{shareMessage}</p>
            </div>
          </section>
        )}

        <footer className="site-footer"><div className="footer-bow" aria-hidden="true">୨୧</div><p>Made with lots of love for Ishika’s birthday crew.</p><span>Be there. Be cute. Make memories. ♡</span></footer>
      </main>
    </>
  );
}
