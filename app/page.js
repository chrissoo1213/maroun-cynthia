"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Mousewheel,
  Keyboard,
  Pagination,
  EffectFade,
  HashNavigation,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { motion, AnimatePresence } from "framer-motion";
import {
  Music2,
  VolumeX,
  MapPin,
  Calendar,
  Clock,
  Heart,
  Send,
  Check,
  X,
  ChevronRight,
  Sparkles,
  Gift,
  BedDouble,
  Car,
  ArrowRight,
  Mail,
} from "lucide-react";

const PHOTOS = [
  "/wedding/1.jpg",
  "/wedding/3.jpg",
  "/wedding/4.jpg",
  "/wedding/5.jpg",
  "/wedding/6.jpg",
  "/wedding/7.jpg",
  "/wedding/8.jpg",
  "/wedding/9.jpg",
  "/wedding/10.jpg",
];

const WEDDING_DATE = new Date("2026-07-23T15:00:00+03:00");

function BackgroundSlideshow({
  photos = PHOTOS,
  interval = 4000,
  overlay = "rgba(0,0,0,0.28)",
}) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(
      () => setIdx((i) => (i + 1) % photos.length),
      interval,
    );
    return () => clearInterval(t);
  }, [photos.length, interval]);
  return (
    <div className="absolute inset-0 overflow-hidden">
      {photos.map((src, i) => (
        <motion.div
          key={src}
          initial={false}
          animate={{ opacity: i === idx ? 1 : 0 }}
          transition={{ duration: 1.6, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 slow-zoom"
            style={{
              backgroundImage: `url(${src})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "brightness(1.05) saturate(1.05)",
            }}
          />
        </motion.div>
      ))}
      <div className="absolute inset-0" style={{ background: overlay }} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/35" />
    </div>
  );
}

function useCountdown(target) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, target.getTime() - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff / 3600000) % 24);
  const m = Math.floor((diff / 60000) % 60);
  const s = Math.floor((diff / 1000) % 60);
  return { d, h, m, s };
}

function MusicToggle({ playing, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="fixed top-5 right-5 z-50 glass-dark rounded-full p-3 hover:scale-110 transition-transform"
      aria-label="Toggle music"
    >
      {playing ? (
        <Music2 size={18} className="text-champagne" />
      ) : (
        <VolumeX size={18} className="text-white/80" />
      )}
    </button>
  );
}

function CinematicIntro({ onDone }) {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 600);
    const t2 = setTimeout(() => setStage(2), 2800);
    const t3 = setTimeout(() => onDone(), 5600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
      className="fixed inset-0 z-[60] bg-black flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,184,150,0.07)_0%,transparent_70%)]" />

      <AnimatePresence>
        {stage >= 1 && (
          <motion.div
            key="initials"
            initial={{ opacity: 0, scale: 0.9, filter: "blur(20px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute text-center"
          >
            <div className="font-script text-champagne text-[7rem] md:text-[10rem] leading-none drop-shadow-[0_0_30px_rgba(212,184,150,0.35)]">
              M{" "}
              <span className="text-white/70 text-6xl md:text-8xl align-middle">
                &amp;
              </span>{" "}
              C
            </div>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.4, delay: 0.4, ease: "easeInOut" }}
              className="mx-auto h-px w-40 bg-gradient-to-r from-transparent via-champagne to-transparent mt-6 origin-center"
            />
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 1 }}
              className="mt-6 text-white/70 tracking-luxury text-[11px] uppercase"
            >
              A Wedding Story
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {stage >= 2 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0"
        >
          <motion.div
            initial={{ scale: 1.15, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${PHOTOS[0]})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div className="absolute inset-0 bg-black/35" />
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}

function Slide1Hero() {
  const { d, h, m, s } = useCountdown(WEDDING_DATE);
  const countdownItems = [
    { value: d, label: "Days" },
    { value: h, label: "Hours" },
    { value: m, label: "Minutes" },
    { value: s, label: "Seconds" },
  ];

  return (
    <div className="relative h-full w-full flex items-center justify-center overflow-hidden">
      <BackgroundSlideshow />
      <div className="relative z-10 text-center px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.2 }}
          className="text-white/85 italic font-serif text-base md:text-xl max-w-md mx-auto leading-relaxed"
        >
          &ldquo;In all the world, there is no heart for me like yours.&rdquo;
        </motion.p>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.8 }}
          className="mx-auto h-px w-24 bg-champagne my-8 origin-center"
        />
        <motion.h1
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 2, delay: 1, ease: [0.22, 1, 0.36, 1] }}
          className="font-script text-champagne text-[5rem] sm:text-[7rem] md:text-[9rem] leading-[0.9] drop-shadow-[0_4px_30px_rgba(0,0,0,0.7)]"
        >
          Maroun
          <span className="block text-white/85 text-4xl sm:text-5xl my-2 font-serif italic">
            &amp;
          </span>
          Cynthia
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 2.2 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3"
        >
          {countdownItems.map((item) => (
            <div
              key={item.label}
              className="min-w-[78px] rounded-2xl border border-white/20 bg-white/10 px-3 py-3 backdrop-blur-sm"
            >
              <div className="font-serif text-lg sm:text-2xl font-semibold text-white tabular-nums">
                {String(item.value).padStart(2, "0")}
              </div>
              <div className="mt-1 text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-champagne/90">
                {item.label}
              </div>
            </div>
          ))}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 2.2 }}
          className="mt-8 space-y-2"
        >
          <p className="tracking-luxury text-white text-xs md:text-sm uppercase">
            are getting married
          </p>
          <p className="tracking-elegant text-champagne text-sm md:text-base">
            23 . 07 . 2026
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 3.4 }}
          className="mt-12 flex items-center justify-center gap-2 text-white/85 text-xs tracking-luxury uppercase"
        >
          <span className="shimmer">Swipe to begin</span>
          <ChevronRight size={14} className="shimmer" />
        </motion.div>
      </div>
    </div>
  );
}

function Slide2Invitation() {
  return (
    <div className="relative h-full w-full flex items-center justify-center overflow-hidden">
      <BackgroundSlideshow photos={[PHOTOS[1], PHOTOS[2]]} interval={7000} />
      <div className="relative z-10 px-6 w-full flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="glass rounded-3xl p-8 md:p-10 max-w-2xl w-full text-center"
        >
          <p className="tracking-luxury text-[11px] uppercase text-white/80">
            Together with their families,
          </p>

          <div className="mt-8 space-y-4">
            <p className="font-script text-champagne text-xl sm:text-2xl md:text-3xl leading-snug">
              Boutrous Touma<span className="mx-3 text-white">&amp;</span> Wafaa Jarjour
            </p>
            <div className="mx-auto h-px w-24 bg-white/30" />
            <p className="font-script text-champagne text-xl sm:text-2xl md:text-3xl leading-snug mt-2">
              Robert El Hajj<span className="mx-3 text-white">&amp;</span> Gisele El Alam
            </p>
          </div>

          <div className="mx-auto my-7 h-px w-24 bg-champagne/70" />

          <p className="text-white/90 font-serif text-sm md:text-base leading-relaxed">
            joyfully invite you to celebrate their wedding day
          </p>

          <p className="mt-7 text-white/85 font-serif italic text-sm md:text-base leading-relaxed">
            “And now these three remain: faith, hope and love. But the greatest of these is love.” <br /> - 1 Corinthians 13:13
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function Slide4Gallery() {
  const polaroids = [
    { src: PHOTOS[0], rot: -6, top: "14%", left: "6%" },
    { src: PHOTOS[1], rot: 5, top: "18%", right: "6%" },
    { src: PHOTOS[2], rot: -3, top: "44%", left: "14%" },
    { src: PHOTOS[3], rot: 7, top: "48%", right: "10%" },
    { src: PHOTOS[4], rot: -8, bottom: "6%", left: "8%" },
    { src: PHOTOS[5], rot: 4, bottom: "8%", right: "8%" },
  ];
  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b0b0d] via-[#15110a] to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,184,150,0.08),transparent_60%)]" />

      <div className="relative z-10 h-full w-full">
      <div className="absolute top-2 left-0 right-0 text-center z-50">
          <p className="tracking-luxury text-white/80 text-[11px] uppercase">
            Memories
          </p>
          <h2 className="relative z-50 font-script text-champagne text-4xl md:text-7xl mt-2 text-center">
              Moments of us
          </h2>
        </div>

        {polaroids.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 60, rotate: 0 }}
            whileInView={{ opacity: 1, y: 0, rotate: p.rot }}
            transition={{
              duration: 1.1,
              delay: i * 0.18,
              ease: [0.22, 1, 0.36, 1],
            }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.06, rotate: 0, zIndex: 30 }}
            className="absolute polaroid rounded-sm"
            style={{
              width: "min(38vw, 170px)",
              ...p,
            }}
          >
            <div
              className="aspect-[3/4] w-full bg-cover bg-center"
              style={{
                backgroundImage: `url(${p.src})`,
                filter: "brightness(1.08) saturate(1.04)",
              }}
            />
            <div className="text-center text-black/70 font-hand text-xs absolute bottom-3 left-0 right-0">
              M &amp; C
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function GlassEventCard({
  kicker,
  title,
  date,
  time,
  venue,
  city,
  mapsQuery,
  mapsUrl,
  icon,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true }}
      className="glass rounded-3xl p-8 md:p-10 max-w-md w-full text-center"
    >
      <div className="flex items-center justify-center gap-2 text-champagne mb-3">
        {icon}
        <span className="tracking-luxury text-[11px] uppercase">{kicker}</span>
      </div>
      <h3 className="font-script text-white text-5xl md:text-6xl">{title}</h3>
      <div className="mx-auto h-px w-16 bg-champagne my-5" />
      <div className="space-y-2 text-white/90">
        <div className="flex items-center justify-center gap-2 text-sm tracking-elegant">
          <Calendar size={14} className="text-champagne" /> {date}
        </div>
        <div className="flex items-center justify-center gap-2 text-sm tracking-elegant">
          <Clock size={14} className="text-champagne" /> {time}
        </div>
        <div className="flex items-center justify-center gap-2 text-sm font-serif italic">
          <MapPin size={14} className="text-champagne" /> {venue}
        </div>
        <div className="text-white/70 text-xs">{city}</div>
      </div>
      <a
        href={
          mapsUrl ||
          `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}`
        }
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 mt-7 px-6 py-3 rounded-full border border-champagne/60 text-champagne text-xs tracking-luxury uppercase hover:bg-champagne hover:text-black transition-colors"
      >
        Open in Maps <ArrowRight size={14} />
      </a>
    </motion.div>
  );
}

function Slide5BeforeCeremony() {
  return (
    <div className="relative h-full w-full flex items-center justify-center overflow-hidden">
      <BackgroundSlideshow
        photos={[PHOTOS[4], PHOTOS[0]]}
        interval={7000}
      />
      <div className="relative z-10 px-6 w-full flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          className="glass rounded-3xl p-8 md:p-10 max-w-md w-full text-center"
        >
          <div className="flex items-center justify-center gap-2 text-champagne mb-3">
            <Heart size={14} />
            <span className="tracking-luxury text-[11px] uppercase">Before the Ceremony</span>
          </div>
          <h3 className="font-script text-white text-5xl md:text-6xl">Let&apos;s start together</h3>
          <div className="mx-auto h-px w-16 bg-champagne my-5" />
          <div className="space-y-3 text-white/90">
            <p className="text-sm md:text-base font-serif leading-relaxed">
              We will be delighted to welcome you
            </p>
            <div className="flex items-center justify-center gap-2 text-sm tracking-elegant text-white">
              <Clock size={14} className="text-champagne" /> Starting 4:00 pm
            </div>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Hotel"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 mt-2 px-6 py-3 rounded-full border border-champagne/60 text-champagne text-xs tracking-luxury uppercase hover:bg-champagne hover:text-black transition-colors"
            >
              Hotel <ArrowRight size={14} />
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Slide6Ceremony() {
  return (
    <div className="relative h-full w-full flex items-center justify-center overflow-hidden">
      <BackgroundSlideshow
        photos={[PHOTOS[4], PHOTOS[0]]}
        interval={7000}
      />
      <div className="relative z-10 px-6 w-full flex justify-center">
        <GlassEventCard
          kicker="The Ceremony"
          title="Vows"
          date="Monday, July 23, 2026"
          time="6:00 pm — 7:00 pm"
          venue="Hemlaya"
          city="Lebanon"
          mapsUrl="https://maps.app.goo.gl/6ggKA5orbpzdngGe6"
          icon={<Heart size={14} />}
        />
      </div>
    </div>
  );
}

function Slide7Reception() {
  return (
    <div className="relative h-full w-full flex items-center justify-center overflow-hidden">
      <BackgroundSlideshow
        photos={[PHOTOS[5], PHOTOS[3]]}
        interval={7000}

      />
      <div className="relative z-10 px-6 w-full flex justify-center">
        <GlassEventCard
          kicker="The Celebration"
          title="Reception"
          date="Monday, July 23, 2026"
          time="7:30 pm onwards"
          venue="Blanc De Chêne"
          city="Lebanon"
          mapsQuery="Blanc De Chene Lebanon"
          icon={<Sparkles size={14} />}
        />
      </div>
    </div>
  );
}

function ExpandableCard({ icon, title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <motion.div layout className="glass rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-champagne">{icon}</span>
          <span className="font-serif text-white text-base">{title}</span>
        </div>
        <motion.span
          animate={{ rotate: open ? 90 : 0 }}
          className="text-white/70"
        >
          <ChevronRight size={16} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="px-5 pb-5 text-white/85 text-sm leading-relaxed"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function Slide8Gift() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative h-full w-full flex items-center justify-center overflow-hidden">
      <BackgroundSlideshow
        photos={[PHOTOS[1]]}
        interval={9999}
        
      />
      <div className="relative z-10 px-6 max-w-md w-full text-center">
        <p className="tracking-luxury text-white/80 text-[11px] uppercase">
          A Note on Gifts
        </p>
        <h2 className="font-script text-champagne text-5xl md:text-6xl mt-2">
          With Love
        </h2>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="mt-8 glass rounded-3xl p-8 relative"
        >
          <motion.div
            animate={{ y: open ? -10 : 0 }}
            transition={{ duration: 0.7 }}
            className="mx-auto w-20 h-14 relative mb-5"
            style={{ perspective: 800 }}
          >
            <div className="absolute inset-0 bg-champagne rounded-md shadow-lg" />
            <div
              className="absolute inset-x-0 top-0 h-7 bg-gradient-to-b from-[#e9d4ae] to-[#c9a878] rounded-t-md origin-top"
              style={{
                transform: open ? "rotateX(-160deg)" : "rotateX(0deg)",
                transition: "transform .7s",
              }}
            />
            <Mail className="absolute inset-0 m-auto text-black/40" size={20} />
          </motion.div>
          <p className="text-white/90 font-serif italic leading-relaxed">
            Your presence is the greatest gift of all. Should you wish to honor
            us further, a contribution toward our new beginning would be
            cherished.
          </p>
          <button
            onClick={() => setOpen((o) => !o)}
            className="mt-6 px-6 py-3 rounded-full border border-champagne/60 text-champagne text-xs tracking-luxury uppercase hover:bg-champagne hover:text-black transition-colors inline-flex items-center gap-2"
          >
            <Gift size={14} /> {open ? "Hide details" : "View details"}
          </button>
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5 }}
                className="overflow-hidden"
              >
                <div className="mt-6 text-left text-sm text-white/90 space-y-1">
                  <div className="tracking-elegant text-champagne text-[11px] uppercase mb-2">
                    Bank Transfer
                  </div>
                  <div>Account Name: Maroun &amp; Cynthia</div>
                  <div>IBAN: LB00 00 00 0000 0000 0000 0000 0000</div>
                  <div>FR - Wero : +33 7 77 72 92 19</div>
                  <div className="text-white/70 text-xs mt-3 italic">
                    Thank you, from the bottom of our hearts.
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

function Slide9Message() {
  return (
    <div className="relative h-full w-full flex items-center justify-center overflow-hidden">
      <BackgroundSlideshow
        photos={[PHOTOS[3], PHOTOS[5]]}
        interval={8000}
        
      />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4 }}
        className="relative z-10 px-8 max-w-xl text-center"
      >
        <p className="tracking-luxury text-white/80 text-[11px] uppercase">
          From us, to you
        </p>
        <h2 className="font-script text-champagne text-5xl md:text-6xl mt-2 mb-6">
          A Loving Note
        </h2>
        <p className="font-hand text-white text-2xl md:text-3xl leading-snug">
          Today marks the beginning of a new chapter,
and it would not be complete without you. <br />
          Thank you for sharing in our joy,
our love, and the promise of forever.
 <br />
          We look forward to celebrating this unforgettable day together.
        </p>
        <p className="font-hand text-champagne text-2xl mt-8">
          — Maroun &amp; Cynthia
        </p>
      </motion.div>
    </div>
  );
}

function SuccessCelebration({ guests }) {
  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="relative text-center max-w-md"
    >
      {Array.from({ length: 24 }).map((_, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 0, x: 0 }}
          animate={{
            opacity: [0, 1, 0],
            y: [0, -120 - Math.random() * 120],
            x: [(Math.random() - 0.5) * 200, (Math.random() - 0.5) * 240],
          }}
          transition={{
            duration: 2.4 + Math.random() * 1.2,
            delay: i * 0.05,
            repeat: Infinity,
            repeatDelay: 0.8,
          }}
          className="absolute left-1/2 top-1/2 w-1.5 h-1.5 rounded-full bg-champagne shadow-[0_0_10px_rgba(212,184,150,0.8)]"
        />
      ))}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
        className="mx-auto w-20 h-20 rounded-full bg-champagne flex items-center justify-center shadow-[0_0_60px_rgba(212,184,150,0.6)]"
      >
        <Check className="text-black" size={36} />
      </motion.div>
      <h2 className="font-script text-champagne text-5xl md:text-6xl mt-6">
        Thank you
      </h2>
      <p className="font-serif italic text-white/90 mt-2 text-lg">
        Your response has been received.
      </p>
      <p className="text-white/75 mt-6 text-sm leading-relaxed">
        We can&rsquo;t wait to celebrate with{" "}
        {guests.filter((g) => g.status === "accept").length > 0
          ? "you"
          : "you in spirit"}{" "}
        on July 23, 2026.
      </p>
      <p className="font-hand text-champagne text-2xl mt-8">
        with love, M &amp; C
      </p>
    </motion.div>
  );
}



function SlideRSVP({ guests, setGuests }) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const setStatus = (i, status) => {
    setGuests((prev) =>
      prev.map((g, idx) =>
        idx === i ? { ...g, status } : g
      )
    );
  };

  const submit = async () => {
    setError("");

    if (guests.some((g) => !g.status)) {
      setError("Please respond for each guest.");
      return;
    }

    setSubmitting(true);

    try {
      const params = new URLSearchParams(window.location.search);
      const rsvpId = params.get("rsvp");
    
      const url =
        "https://script.google.com/macros/s/AKfycbxZz3YRhRjgBG7jDrb5BZQWTsfLedhgBFKLgZ5R5Rn9GehZXOH1xTBXBI0gS1WLpO-vkA/exec" +
        "?action=submit" +
        "&id=" + encodeURIComponent(rsvpId) +
        "&guest1Status=" + encodeURIComponent(guests[0]?.status || "") +
        "&guest2Status=" + encodeURIComponent(guests[1]?.status || "") +
        "&note=" + encodeURIComponent(message);
    
      const response = await fetch(url);
      const result = await response.json();
    
      if (!result.success) {
        throw new Error("Failed to save RSVP");
      }
    
      setSubmitted(true);
    
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative h-full w-full overflow-y-auto no-scrollbar">
      <BackgroundSlideshow
        photos={[PHOTOS[0], PHOTOS[4]]}
        interval={8000}
        
      />

      <div className="relative z-10 min-h-full flex flex-col items-center justify-center py-20 px-6">
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8 }}
              className="w-full max-w-md"
            >
              <div className="text-center mb-8">
                

                <h2 className="font-script text-champagne text-5xl md:text-6xl mt-2">
                  RSVP
                </h2>

                <p className="text-white/80 font-serif italic mt-3 text-sm">
                  Please reply by July 15, 2026
                </p>
              </div>

              <div className="space-y-3">
                {guests.map((g, i) => (
                  <motion.div
                  key={g.name + i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass rounded-2xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3"
                >
                    <div className="font-serif text-white text-base md:text-lg text-center sm:text-left">
                         {g.name}
                      </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setStatus(i, "Accepted")}
                        className={`px-3 py-1.5 rounded-full text-[10px] tracking-luxury uppercase border transition-all ${
                          g.status === "Accepted"
                            ? "bg-champagne text-black border-champagne shadow-[0_0_20px_rgba(212,184,150,0.5)]"
                            : "border-white/40 text-white hover:border-champagne"
                        }`}
                      >
                        <Check size={10} className="inline mr-1" />
                        Accept
                      </button>

                      <button
                        onClick={() => setStatus(i, "Declined")}
                        className={`px-3 py-1.5 rounded-full text-[10px] tracking-luxury uppercase border transition-all ${
                          g.status === "Declined"
                            ? "bg-white/15 text-white border-white/70"
                            : "border-white/40 text-white hover:border-white/70"
                        }`}
                      >
                        <X size={10} className="inline mr-1" />
                        Decline
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-5">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Leave a sweet note for Maroun & Cynthia (optional)"
                  rows={3}
                  className="w-full glass rounded-2xl p-4 text-white placeholder:text-white/50 text-sm font-serif italic focus:outline-none focus:ring-1 focus:ring-champagne/60 resize-none"
                />
              </div>

              {error && (
                <p className="text-red-300 text-sm text-center mt-3">
                  {error}
                </p>
              )}

              <motion.button
                whileTap={{ scale: 0.96 }}
                disabled={submitting}
                onClick={submit}
                className="mt-6 w-full py-4 rounded-full bg-champagne text-black tracking-luxury text-sm uppercase font-medium shadow-[0_10px_40px_rgba(212,184,150,0.35)] disabled:opacity-60 inline-flex items-center justify-center gap-2"
              >
                {submitting ? (
                  "Sending..."
                ) : (
                  <>
                    Send Response <Send size={14} />
                  </>
                )}
              </motion.button>
            </motion.div>
          ) : (
            <SuccessCelebration guests={guests} />
          )}
        </AnimatePresence>

        <div className="mt-8 flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.28em] text-white/70">
          <span>Made with love</span>
          <Heart size={14} className="text-champagne fill-champagne" />
          <span>by</span>
          <a
            href="mailto:hazzouri.chris@gmail.com"
            className="text-champagne transition-colors hover:text-champagne/80"
          >
            Chris
          </a>
        </div>
      </div>
    </div>
  );
}

function ProgressDots({ total, current }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1.5 pointer-events-none">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`transition-all duration-500 rounded-full ${i === current ? "w-7 h-1.5 bg-champagne" : "w-1.5 h-1.5 bg-white/40"}`}
        />
      ))}
    </div>
  );
}

function App() {
  const [introDone, setIntroDone] = useState(false);
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [musicOn, setMusicOn] = useState(false);
  const [readyToEnter, setReadyToEnter] = useState(false);

  const [guests, setGuests] = useState([]);
  const [guestData, setGuestData] = useState(null);

  const audioRef = useRef(null);


  useEffect(() => {
    const audio = new Audio("/wedding/song.mp3");
    audio.preload = "auto";
    audio.load();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("rsvp");
  
    if (!id) return;
  
    fetch(
      "https://script.google.com/macros/s/AKfycbxZz3YRhRjgBG7jDrb5BZQWTsfLedhgBFKLgZ5R5Rn9GehZXOH1xTBXBI0gS1WLpO-vkA/exec?id=" +
        id
    )
      .then((res) => res.json())
      .then((data) => {
        setGuestData(data);
  
        const loadedGuests = [];
  
        if (data.guest1) {
          loadedGuests.push({
            name: data.guest1,
            status: data.guest1Status || null,
          });
        }
  
        if (data.guest2) {
          loadedGuests.push({
            name: data.guest2,
            status: data.guest2Status || null,
          });
        }
  
        setGuests(loadedGuests);
      })
      .catch(console.error);
  }, []);

  // Load guest names from URL
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);

    const names = params.get("names") || params.get("guests");

    if (names) {
      const list = names
        .split(",")
        .map((n) => ({
          name: decodeURIComponent(n.trim()),
          status: null,
        }))
        .filter((g) => g.name);

      if (list.length) {
        setGuests(list);
      }
    }
  }, []);

  // PRELOAD EVERYTHING
  useEffect(() => {
    let cancelled = false;

    const finishPreload = () => {
      if (!cancelled) {
        setAssetsLoaded(true);
        setReadyToEnter(true);
      }
    };

    const imagePromises = PHOTOS.map((src) => {
      return new Promise((resolve) => {
        const img = new Image();

        img.onload = resolve;
        img.onerror = resolve;
        img.src = src;
      });
    });

    const audioPromise = new Promise((resolve) => {
      if (!audioRef.current) {
        resolve();
        return;
      }

      audioRef.current.addEventListener(
        "loadeddata",
        () => resolve(),
        { once: true }
      );

      audioRef.current.load();
    });

    const fallbackTimer = window.setTimeout(finishPreload, 1800);

    Promise.allSettled([...imagePromises, audioPromise]).finally(() => {
      if (!cancelled) {
        window.clearTimeout(fallbackTimer);
        finishPreload();
      }
    });

    return () => {
      cancelled = true;
      window.clearTimeout(fallbackTimer);
    };
  }, []);

  // Music control
  useEffect(() => {
    if (!audioRef.current) return;

    if (musicOn) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [musicOn]);


  const slides = useMemo(
    () => [
      <Slide1Hero key="s1" />,
      <Slide2Invitation key="s2" />,
      <Slide5BeforeCeremony key="s5" />,
      <Slide6Ceremony key="s6" />,
      <Slide7Reception key="s7" />,
      <Slide8Gift key="s8" />,
      <Slide9Message key="s9" />,
      <Slide4Gallery key="s4" />,
      <SlideRSVP
        key="s10"
        guests={guests}
        setGuests={setGuests}
      />,
    ],
    [guests]
  );

  return (
    <main className="relative h-[100dvh] w-full bg-black overflow-hidden">
      <audio
          ref={audioRef}
          src="/wedding/song.mp3"
          loop
          preload="auto"
      />

      {/* Loading Screen */}
      {!assetsLoaded && (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-script text-champagne text-7xl">
              M & C
            </h1>

            <p className="text-white/70 mt-4 tracking-luxury uppercase text-xs">
              Preparing your invitation...
            </p>
          </div>
        </div>
      )}

      {/* Intro */}
      {readyToEnter && !introDone && (
  <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center">
    <h1 className="font-script text-champagne text-5xl md:text-7xl mb-6 text-center px-6">
        Maroun & Cynthia
    </h1>


    <button
      onClick={async () => {
        try {
            await audioRef.current?.play();
            setMusicOn(true);
            } catch (e) {}

              setIntroDone(true);
            }}
            className="px-8 py-4 rounded-full border border-champagne text-champagne hover:bg-champagne hover:text-black transition-all"
            >
              Enter Invitation
            </button>
          </div>
        )}
      {/* Website */}
      {introDone && (
        <>
          <MusicToggle
            playing={musicOn}
            onToggle={() => setMusicOn((m) => !m)}
          />

          <Swiper
            modules={[
              Mousewheel,
              Keyboard,
              Pagination,
              EffectFade,
              HashNavigation,
            ]}
            slidesPerView={1}
            mousewheel={{
              forceToAxis: true,
              releaseOnEdges: true,
            }}
            keyboard={{ enabled: true }}
            speed={900}
            onSlideChange={(sw) =>
              setActiveIndex(sw.activeIndex)
            }
            className="h-full w-full"
          >
            {slides.map((node, i) => (
              <SwiperSlide
                key={i}
                className="h-full w-full"
              >
                {node}
              </SwiperSlide>
            ))}
          </Swiper>

          <ProgressDots
            total={slides.length}
            current={activeIndex}
          />
        </>
      )}
    </main>
  );
}

export default App;
