'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import {
  X, ZoomIn, ZoomOut, RotateCcw, Eye, Sun, Moon, Contrast,
  Volume2, VolumeX, Type, Bold, MousePointer, Underline,
  ImageOff, Pause, Sparkles, Check, Bookmark, AlignLeft, Shield
} from 'lucide-react';

export default function AccessibilityModal() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  // Accessibility States
  const [zoom, setZoom] = useState(100);
  const [fontScale, setFontScale] = useState(16);
  const [colorBlindMode, setColorBlindMode] = useState<'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'greyscale' | 'high_contrast'>('none');

  // Display tools toggles
  const [darkContrast, setDarkContrast] = useState(false);
  const [invert, setInvert] = useState(false);
  const [highSaturation, setHighSaturation] = useState(false);
  const [highlightLinks, setHighlightLinks] = useState(false);
  const [hideImages, setHideImages] = useState(false);
  const [bigCursor, setBigCursor] = useState(false);

  // Reading & visual aids
  const [lineSpacing, setLineSpacing] = useState(false);
  const [textSpacing, setTextSpacing] = useState(false);
  const [dyslexiaFont, setDyslexiaFont] = useState(false);
  const [boldText, setBoldText] = useState(false);
  const [highlightHeadings, setHighlightHeadings] = useState(false);
  const [readingGuide, setReadingGuide] = useState(false);
  const [guideY, setGuideY] = useState(0);
  const [stopAnimations, setStopAnimations] = useState(false);
  const [highlightFocus, setHighlightFocus] = useState(false);
  const [isReadingAloud, setIsReadingAloud] = useState(false);

  // Listen to open accessibility events
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('openAccessibilityModal', handleOpen);
    return () => window.removeEventListener('openAccessibilityModal', handleOpen);
  }, []);

  // Track mouse for reading guide
  useEffect(() => {
    if (!readingGuide) return;
    const handleMouseMove = (e: MouseEvent) => {
      setGuideY(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [readingGuide]);

  // Load saved preferences
  useEffect(() => {
    try {
      const saved = localStorage.getItem('vidyasetu_accessibility');
      if (saved) {
        const p = JSON.parse(saved);
        if (p.zoom) setZoom(p.zoom);
        if (p.fontScale) setFontScale(p.fontScale);
        if (p.colorBlindMode) setColorBlindMode(p.colorBlindMode);
        if (p.darkContrast !== undefined) setDarkContrast(p.darkContrast);
        if (p.invert !== undefined) setInvert(p.invert);
        if (p.highSaturation !== undefined) setHighSaturation(p.highSaturation);
        if (p.highlightLinks !== undefined) setHighlightLinks(p.highlightLinks);
        if (p.hideImages !== undefined) setHideImages(p.hideImages);
        if (p.bigCursor !== undefined) setBigCursor(p.bigCursor);
        if (p.lineSpacing !== undefined) setLineSpacing(p.lineSpacing);
        if (p.textSpacing !== undefined) setTextSpacing(p.textSpacing);
        if (p.dyslexiaFont !== undefined) setDyslexiaFont(p.dyslexiaFont);
        if (p.boldText !== undefined) setBoldText(p.boldText);
        if (p.highlightHeadings !== undefined) setHighlightHeadings(p.highlightHeadings);
        if (p.stopAnimations !== undefined) setStopAnimations(p.stopAnimations);
        if (p.highlightFocus !== undefined) setHighlightFocus(p.highlightFocus);
      }
    } catch {
      // ignore
    }
  }, []);

  // Save preferences and apply styles
  useEffect(() => {
    const p = {
      zoom, fontScale, colorBlindMode, darkContrast, invert, highSaturation,
      highlightLinks, hideImages, bigCursor, lineSpacing, textSpacing,
      dyslexiaFont, boldText, highlightHeadings, stopAnimations, highlightFocus
    };
    try {
      localStorage.setItem('vidyasetu_accessibility', JSON.stringify(p));
    } catch {
      // ignore
    }

    // Apply Zoom
    document.documentElement.style.zoom = `${zoom}%`;

    // Apply Font Size
    document.documentElement.style.fontSize = `${fontScale}px`;

    // Color Blind Filters
    const docCl = document.documentElement.classList;
    const bodyCl = document.body.classList;

    // Reset filter classes
    ['protanopia', 'deuteranopia', 'tritanopia', 'greyscale', 'high-contrast'].forEach(c => {
      docCl.remove(`access-${c}`);
    });

    if (colorBlindMode !== 'none') {
      docCl.add(`access-${colorBlindMode.replace('_', '-')}`);
    }

    // Toggles
    darkContrast ? docCl.add('access-dark-contrast') : docCl.remove('access-dark-contrast');
    invert ? docCl.add('access-invert') : docCl.remove('access-invert');
    highSaturation ? docCl.add('access-saturation') : docCl.remove('access-saturation');
    highlightLinks ? docCl.add('access-highlight-links') : docCl.remove('access-highlight-links');
    hideImages ? docCl.add('access-hide-images') : docCl.remove('access-hide-images');
    bigCursor ? docCl.add('access-big-cursor') : docCl.remove('access-big-cursor');

    lineSpacing ? docCl.add('access-line-spacing') : docCl.remove('access-line-spacing');
    textSpacing ? docCl.add('access-text-spacing') : docCl.remove('access-text-spacing');
    dyslexiaFont ? docCl.add('access-dyslexia') : docCl.remove('access-dyslexia');
    boldText ? docCl.add('access-bold-text') : docCl.remove('access-bold-text');
    highlightHeadings ? docCl.add('access-highlight-headings') : docCl.remove('access-highlight-headings');
    stopAnimations ? docCl.add('access-stop-animations') : docCl.remove('access-stop-animations');
    highlightFocus ? docCl.add('access-highlight-focus') : docCl.remove('access-highlight-focus');
  }, [
    zoom, fontScale, colorBlindMode, darkContrast, invert, highSaturation,
    highlightLinks, hideImages, bigCursor, lineSpacing, textSpacing,
    dyslexiaFont, boldText, highlightHeadings, stopAnimations, highlightFocus
  ]);

  // Read page aloud handler using Web Speech API
  const handleToggleReadAloud = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (isReadingAloud) {
      window.speechSynthesis.cancel();
      setIsReadingAloud(false);
      return;
    }

    const textToRead = document.querySelector('main')?.textContent || document.body.textContent || '';
    const cleanText = textToRead.slice(0, 1500).replace(/\s+/g, ' ').trim();

    if (!cleanText) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsReadingAloud(false);
    utterance.onerror = () => setIsReadingAloud(false);

    window.speechSynthesis.speak(utterance);
    setIsReadingAloud(true);
  };

  // Reset All to Default
  const handleResetAll = () => {
    setZoom(100);
    setFontScale(16);
    setColorBlindMode('none');
    setDarkContrast(false);
    setInvert(false);
    setHighSaturation(false);
    setHighlightLinks(false);
    setHideImages(false);
    setBigCursor(false);
    setLineSpacing(false);
    setTextSpacing(false);
    setDyslexiaFont(false);
    setBoldText(false);
    setHighlightHeadings(false);
    setReadingGuide(false);
    setStopAnimations(false);
    setHighlightFocus(false);
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsReadingAloud(false);
    try {
      localStorage.removeItem('vidyasetu_accessibility');
    } catch {}
  };

  return (
    <>
      {/* ── READING GUIDE RULER (Tracks mouse Y position) ── */}
      {readingGuide && (
        <div
          className="fixed left-0 right-0 z-50 pointer-events-none transition-all duration-75 shadow-lg border-y-2 border-amber-400 bg-amber-400/20 backdrop-blur-xs"
          style={{ top: `${guideY - 20}px`, height: '40px' }}
        />
      )}

      {/* ── ACCESSIBILITY MODAL WINDOW ── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border-2 border-blue-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200 text-slate-800 font-sans"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#001D4A] via-[#002B7A] to-[#0A2540] text-white p-5 flex items-start justify-between border-b-2 border-amber-400">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#3B82F6] to-blue-600 flex items-center justify-center text-white shadow-md">
                  <span className="text-xl">👤</span>
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-white">{t('Accessibility')}</h3>
                  <p className="text-xs text-blue-200">{t('Customise your viewing experience')}</p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
                aria-label="Close accessibility controls"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6 text-xs">

              {/* 1. Page Zoom */}
              <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{t('Page Zoom')}</h4>
                    <p className="text-slate-500 text-[11px]">{t('Scale the entire page')}</p>
                  </div>
                  <span className="font-mono font-extrabold text-sm text-[#003087] bg-white px-3 py-1 rounded-full border border-slate-200 shadow-2xs">
                    {zoom}%
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => setZoom(prev => Math.max(70, prev - 10))}
                    className="flex-1 py-2 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl font-bold text-slate-700 shadow-2xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <ZoomOut size={14} /> Zoom -
                  </button>
                  <button
                    onClick={() => setZoom(prev => Math.min(180, prev + 10))}
                    className="flex-1 py-2 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl font-bold text-slate-700 shadow-2xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <ZoomIn size={14} /> Zoom +
                  </button>
                  <button
                    onClick={() => setZoom(100)}
                    className="px-3 py-2 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl font-bold text-slate-500 hover:text-slate-800 transition-all flex items-center gap-1 cursor-pointer"
                    title="Reset Zoom to 100%"
                  >
                    <RotateCcw size={13} /> {t('Reset')}
                  </button>
                </div>
              </div>

              {/* 2. Font Size */}
              <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{t('Font Size')}</h4>
                    <p className="text-slate-500 text-[11px]">{t('Adjust text size across the page')}</p>
                  </div>
                  <span className="font-mono font-extrabold text-sm text-[#003087] bg-white px-3 py-1 rounded-full border border-slate-200 shadow-2xs">
                    {fontScale === 16 ? `${t('Default')} (16px)` : `${fontScale}px`}
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => setFontScale(prev => Math.max(12, prev - 1))}
                    className="flex-1 py-2 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl font-black text-slate-700 shadow-2xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    A-
                  </button>
                  <button
                    onClick={() => setFontScale(16)}
                    className="flex-1 py-2 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl font-bold text-slate-700 shadow-2xs transition-all flex items-center justify-center cursor-pointer"
                  >
                    {t('Default')}
                  </button>
                  <button
                    onClick={() => setFontScale(prev => Math.min(24, prev + 1))}
                    className="flex-1 py-2 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl font-black text-slate-700 shadow-2xs transition-all flex items-center justify-center gap-1 cursor-pointer text-sm"
                  >
                    A+
                  </button>
                  <button
                    onClick={() => setFontScale(16)}
                    className="px-3 py-2 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl font-bold text-slate-500 hover:text-slate-800 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw size={13} /> {t('Reset')}
                  </button>
                </div>
              </div>

              {/* 3. Color Blind Mode */}
              <div className="space-y-2">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{t('Color Blind Mode')}</h4>
                  <p className="text-slate-500 text-[11px]">{t('Apply vision-friendly colour filters')}</p>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1">
                  {[
                    { id: 'none', label: t('None') },
                    { id: 'protanopia', label: t('Protanopia') },
                    { id: 'deuteranopia', label: t('Deuteranopia') },
                    { id: 'tritanopia', label: t('Tritanopia') },
                    { id: 'greyscale', label: t('Greyscale') },
                    { id: 'high_contrast', label: t('High Contrast') },
                  ].map(mode => (
                    <button
                      key={mode.id}
                      onClick={() => setColorBlindMode(mode.id as any)}
                      className={`p-2.5 rounded-xl border text-center font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        colorBlindMode === mode.id
                          ? 'bg-[#003087] text-white border-[#003087] shadow-sm'
                          : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {colorBlindMode === mode.id && <Check size={12} />}
                      <span>{mode.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Display Tools */}
              <div className="space-y-2">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{t('Display Tools')}</h4>
                  <p className="text-slate-500 text-[11px]">{t('Quick visual adjustments')}</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  <button
                    onClick={() => setDarkContrast(prev => !prev)}
                    className={`p-2.5 rounded-xl border font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
                      darkContrast ? 'bg-[#003087] text-white border-[#003087]' : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <Moon size={14} />
                    <span>{t('Dark Contrast')}</span>
                  </button>

                  <button
                    onClick={() => setInvert(prev => !prev)}
                    className={`p-2.5 rounded-xl border font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
                      invert ? 'bg-[#003087] text-white border-[#003087]' : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <Contrast size={14} />
                    <span>{t('Invert')}</span>
                  </button>

                  <button
                    onClick={() => setHighSaturation(prev => !prev)}
                    className={`p-2.5 rounded-xl border font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
                      highSaturation ? 'bg-[#003087] text-white border-[#003087]' : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <Sun size={14} />
                    <span>{t('Saturation')}</span>
                  </button>

                  <button
                    onClick={() => setHighlightLinks(prev => !prev)}
                    className={`p-2.5 rounded-xl border font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
                      highlightLinks ? 'bg-[#003087] text-white border-[#003087]' : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <Underline size={14} />
                    <span>{t('Highlight Links')}</span>
                  </button>

                  <button
                    onClick={() => setHideImages(prev => !prev)}
                    className={`p-2.5 rounded-xl border font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
                      hideImages ? 'bg-[#003087] text-white border-[#003087]' : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <ImageOff size={14} />
                    <span>{t('Hide Images')}</span>
                  </button>

                  <button
                    onClick={() => setBigCursor(prev => !prev)}
                    className={`p-2.5 rounded-xl border font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
                      bigCursor ? 'bg-[#003087] text-white border-[#003087]' : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <MousePointer size={14} />
                    <span>{bigCursor ? t('Big Cursor') : t('Default Cursor')}</span>
                  </button>
                </div>
              </div>

              {/* 5. Reading & Visual Aids */}
              <div className="space-y-2">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{t('Reading & Visual Aids')}</h4>
                  <p className="text-slate-500 text-[11px]">{t('Spacing, fonts, guide, focus and read aloud')}</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                  <button
                    onClick={() => setLineSpacing(prev => !prev)}
                    className={`p-2.5 rounded-xl border font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
                      lineSpacing ? 'bg-[#003087] text-white border-[#003087]' : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <AlignLeft size={14} />
                    <span>{t('Line Spacing')}</span>
                  </button>

                  <button
                    onClick={() => setTextSpacing(prev => !prev)}
                    className={`p-2.5 rounded-xl border font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
                      textSpacing ? 'bg-[#003087] text-white border-[#003087]' : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <Type size={14} />
                    <span>{t('Text Spacing')}</span>
                  </button>

                  <button
                    onClick={() => setDyslexiaFont(prev => !prev)}
                    className={`p-2.5 rounded-xl border font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
                      dyslexiaFont ? 'bg-[#003087] text-white border-[#003087]' : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <Bookmark size={14} />
                    <span>{t('Dyslexia Friendly Font')}</span>
                  </button>

                  <button
                    onClick={() => setBoldText(prev => !prev)}
                    className={`p-2.5 rounded-xl border font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
                      boldText ? 'bg-[#003087] text-white border-[#003087]' : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <Bold size={14} />
                    <span>{t('Bold Text')}</span>
                  </button>

                  <button
                    onClick={() => setHighlightHeadings(prev => !prev)}
                    className={`p-2.5 rounded-xl border font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
                      highlightHeadings ? 'bg-[#003087] text-white border-[#003087]' : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <Sparkles size={14} />
                    <span>{t('Highlight Headings')}</span>
                  </button>

                  <button
                    onClick={() => setReadingGuide(prev => !prev)}
                    className={`p-2.5 rounded-xl border font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
                      readingGuide ? 'bg-[#003087] text-white border-[#003087]' : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <Eye size={14} />
                    <span>{t('Reading Guide')}</span>
                  </button>

                  <button
                    onClick={() => setStopAnimations(prev => !prev)}
                    className={`p-2.5 rounded-xl border font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
                      stopAnimations ? 'bg-[#003087] text-white border-[#003087]' : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <Pause size={14} />
                    <span>{t('Stop Animations')}</span>
                  </button>

                  <button
                    onClick={() => setHighlightFocus(prev => !prev)}
                    className={`p-2.5 rounded-xl border font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
                      highlightFocus ? 'bg-[#003087] text-white border-[#003087]' : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <Shield size={14} />
                    <span>{t('Highlight Focus')}</span>
                  </button>

                  <button
                    onClick={handleToggleReadAloud}
                    className={`p-2.5 rounded-xl border font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
                      isReadingAloud ? 'bg-[#E8571A] text-white border-[#E8571A] animate-pulse' : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {isReadingAloud ? <VolumeX size={14} /> : <Volume2 size={14} />}
                    <span>{isReadingAloud ? t('Stop Reading') : t('Read Page Aloud')}</span>
                  </button>
                </div>
              </div>

              {/* Reset Everything */}
              <div className="pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleResetAll}
                  className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RotateCcw size={15} />
                  <span>{t('Reset all accessibility settings')}</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
