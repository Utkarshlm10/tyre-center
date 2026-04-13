"use client";

import React, { useEffect, useState, useRef } from "react";
import { useAppContext } from "@/context/store";
import { motion, AnimatePresence, animate } from "framer-motion";
import Papa from "papaparse";

function AnimatedPrice({ price }) {
  const nodeRef = useRef(null);
  const prevPriceRef = useRef(0);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    if (!price || String(price).trim() === 'POA') {
      node.textContent = 'POA';
      return;
    }

    const num = Number(String(price).replace(/[^0-9.]/g, ''));
    if (isNaN(num)) return;

    const from = prevPriceRef.current;

    const controls = animate(from, num, {
      duration: 0.8,
      ease: "easeOut",
      onUpdate(v) {
        node.textContent = '₹' + Math.floor(v).toLocaleString('en-IN');
      }
    });

    prevPriceRef.current = num;

    return () => controls.stop();
  }, [price]);

  return <span ref={nodeRef}></span>;
}

const BRANDS = [
  { name: "KIA", id: "Kia", image: "kia.jpg" },
  { name: "MARUTI SUZUKI", id: "Maruti Suzuki", image: "maruti-suzuki.jpg" },
  { name: "HYUNDAI", id: "Hyundai", image: "hyundai.jpg" },
  { name: "HONDA", id: "Honda", image: "honda.jpg" },
  { name: "VOLKSWAGEN", id: "Volkswagen", image: "volkswagen.jpg" },
  { name: "JEEP", id: "Jeep", image: "jeep.jpg" },
  { name: "TATA MOTORS", id: "Tata Motors", image: "tata-motors.jpg" },
  { name: "AUDI", id: "Audi", image: "audi-logo-with-black-background.jpeg" },
  { name: "BMW", id: "BMW", image: "bmw-logo-with-black-background.jpeg" },
  { name: "MERCEDES", id: "Mercedes", image: "mercedes.jpg" },
  { name: "MAHINDRA", id: "Mahindra", image: "mahindra.jpeg" },
  { name: "SKODA", id: "Skoda", image: "skoda logo.jpg" }
];

export default function Home() {
  const { selectedBrand, setSelectedBrand } = useAppContext();

  const [step, setStep] = useState(1);
  const [fitments, setFitments] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [catalogue, setCatalogue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [sortBy, setSortBy] = useState('brand-asc');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [activeBrandFilter, setActiveBrandFilter] = useState('ALL');
  const [selectedTyre, setSelectedTyre] = useState(null);
  const [compareList, setCompareList] = useState([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const [checkoutTyre, setCheckoutTyre] = useState(null);
  const [quantity, setQuantity] = useState(4);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [vehicleReg, setVehicleReg] = useState('');
  const [isOrderComplete, setIsOrderComplete] = useState(false);

  const resetKiosk = () => {
    setStep(1); setSelectedBrand(null); setSelectedModel(null);
    setSelectedSize(null); setSelectedTyre(null); setCheckoutTyre(null);
    setCompareList([]); setIsOrderComplete(false);
    setCustomerName(''); setCustomerPhone(''); setVehicleReg('');
  };

  const filterBarRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    if (selectedBrand) {
      console.log("Brand Selected:", selectedBrand);
    }
  }, [selectedBrand]);

  useEffect(() => {
    const FITMENT_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSlDGu7O4tPZ71uHLIeW8i9DzdEUOqwaeKYVV1e8jky1RDuuIEcIBQ-TCLPTjfqLYgkNB5alBBA9sZL/pub?gid=419797847&single=true&output=csv";
    const INVENTORY_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSlDGu7O4tPZ71uHLIeW8i9DzdEUOqwaeKYVV1e8jky1RDuuIEcIBQ-TCLPTjfqLYgkNB5alBBA9sZL/pub?gid=1665298536&single=true&output=csv";
    const CATALOGUE_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSlDGu7O4tPZ71uHLIeW8i9DzdEUOqwaeKYVV1e8jky1RDuuIEcIBQ-TCLPTjfqLYgkNB5alBBA9sZL/pub?gid=0&single=true&output=csv";

    const fetchCSV = (url) => {
      return new Promise((resolve) => {
        Papa.parse(url, {
          download: true,
          header: true,
          transformHeader: (header) => header.trim(),
          complete: (results) => resolve(results.data),
          error: () => resolve([])
        });
      });
    };

    Promise.all([fetchCSV(FITMENT_URL), fetchCSV(INVENTORY_URL), fetchCSV(CATALOGUE_URL)]).then(([fitmentData, inventoryData, catalogueData]) => {
      setFitments(fitmentData);
      setInventory(inventoryData);
      setCatalogue(catalogueData);
      setLoading(false);
    });
  }, []);

  const handleBrandClick = (brand) => {
    const isSameBrand = selectedBrand === brand.id;

    if (isSameBrand) {
      setSelectedBrand(null);
      setSelectedModel(null);
      setSelectedSize(null);
      setStep(1);
      return;
    }

    setSelectedBrand(brand.id);
    setSelectedModel(null);
    setSelectedSize(null);
    setStep(2);
  };

  const brandInventory = fitments.filter(row =>
    row.CarBrand && selectedBrand && row.CarBrand.toString().trim().toLowerCase() === selectedBrand.toString().trim().toLowerCase()
  );
  const uniqueModels = [...new Set(brandInventory.map(row => row.CarModel))].filter(Boolean);

  const modelInventory = brandInventory.filter(row =>
    row.CarModel && selectedModel && row.CarModel.toString().trim().toLowerCase() === selectedModel.toString().trim().toLowerCase()
  );
  const uniqueSizes = [...new Set(modelInventory.map(row => row.WheelSize + " Inch"))].filter(Boolean);

  const filteredTyres = (() => {
    if (!selectedBrand || !selectedModel || !selectedSize) return [];

    const fitmentMatch = fitments.find(row =>
      row.CarBrand?.toString().trim().toLowerCase() === selectedBrand.toString().trim().toLowerCase() &&
      row.CarModel?.toString().trim().toLowerCase() === selectedModel.toString().trim().toLowerCase() &&
      row.WheelSize?.toString().replace(/[^0-9]/g, '') === selectedSize?.toString().replace(/[^0-9]/g, '')
    );

    if (!fitmentMatch) return [];

    const requiredSize = fitmentMatch.RequiredSize;

    const matchingInventory = inventory.filter(row =>
      row.RequiredSize && requiredSize && row.RequiredSize.toString().trim().toLowerCase() === requiredSize.toString().trim().toLowerCase()
    );

    return matchingInventory.map(invItem => {
      const invModelID = invItem.ModelID?.toString().trim().toLowerCase();
      const catMatch = catalogue.find(cat => cat.ModelID?.toString().trim().toLowerCase() === invModelID) || {};

      return {
        ...invItem,
        ...catMatch,
        TyreBrand: catMatch.TyreBrand || invItem.Brand,
        TyreModel: catMatch.TyreModel || invItem.Model || "Model Info Missing",
        Price: invItem.Price,
        Warranty: invItem.Warranty,
        Description: catMatch.Description,
        BestFor: catMatch.BestFor,
        PromoBadge: catMatch.PromoBadge || invItem.PromoBadge,
        ImageFileName: catMatch.ImageFileName || invItem.ImageFileName
      };
    });
  })();

  const sortedTyres = [...filteredTyres].sort((a, b) => {
    if (sortBy === 'brand-asc') {
      const brandA = a.TyreBrand || a.Brand || '';
      const brandB = b.TyreBrand || b.Brand || '';
      return brandA.localeCompare(brandB);
    }
    if (sortBy === 'price-asc') {
      const priceA = parseFloat(String(a.Price).replace(/[^0-9.]/g, '')) || 0;
      const priceB = parseFloat(String(b.Price).replace(/[^0-9.]/g, '')) || 0;
      return priceA - priceB;
    }
    if (sortBy === 'price-desc') {
      const priceA = parseFloat(String(a.Price).replace(/[^0-9.]/g, '')) || 0;
      const priceB = parseFloat(String(b.Price).replace(/[^0-9.]/g, '')) || 0;
      return priceB - priceA;
    }
    return 0;
  });

  const uniqueTyreBrands = [...new Set(filteredTyres.map(t => t.TyreBrand || t.Brand))].filter(Boolean).sort();
  const displayedTyres = activeBrandFilter === 'ALL'
    ? sortedTyres
    : sortedTyres.filter(t => (t.TyreBrand || t.Brand) === activeBrandFilter);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - filterBarRef.current.offsetLeft);
    setScrollLeft(filterBarRef.current.scrollLeft);
  };
  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - filterBarRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    filterBarRef.current.scrollLeft = scrollLeft - walk;
  };

  const getWarrantyColor = (warrantyString) => {
    const s = (warrantyString || '').toLowerCase();
    if (s.includes('5')) return 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200/50 text-[9px] px-2.5 py-1 font-black rounded-sm uppercase tracking-widest';
    if (s.includes('3')) return 'bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200/50 text-[9px] px-2.5 py-1 font-black rounded-sm uppercase tracking-widest';
    return 'bg-slate-100 text-slate-600 text-[9px] px-2.5 py-1 font-black rounded-sm uppercase tracking-widest';
  };

  const getBestForColor = (bestForString) => {
    const s = (bestForString || '').toLowerCase();
    if (s.includes('city') || s.includes('urban')) return 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200/50 text-[9px] px-2.5 py-1 font-black rounded-sm uppercase tracking-widest';
    if (s.includes('highway') || s.includes('touring')) return 'bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-200/50 text-[9px] px-2.5 py-1 font-black rounded-sm uppercase tracking-widest';
    return 'bg-[#f1f5f9] text-[#475569] ring-1 ring-inset ring-slate-200/50 text-[9px] px-2.5 py-1 font-black rounded-sm uppercase tracking-widest';
  };

  const toggleCompare = (e, tyre) => {
    e.stopPropagation();
    setCompareList(prev => {
      const exists = prev.some(t => t.ModelID === tyre.ModelID);
      if (exists) return prev.filter(t => t.ModelID !== tyre.ModelID);
      if (prev.length < 3) return [...prev, tyre];
      return prev;
    });
  };

  const handleDispatch = async (e) => {
    e.preventDefault();
    if (!customerName || customerPhone.length < 10) return alert("Please enter valid details.");

    // Calculate totals
    const totalNum = Number(String(checkoutTyre.Price).replace(/[^0-9.]/g, '')) * quantity;
    const totalStr = totalNum.toLocaleString('en-IN');
    const vehicleFull = `${selectedBrand} ${selectedModel} ${vehicleReg ? `(${vehicleReg})` : ''}`;
    const tyreFull = `${checkoutTyre.TyreBrand || checkoutTyre.Brand} ${checkoutTyre.TyreModel || checkoutTyre.Model}`;

    // 1. SILENT WEBHOOK POST TO GOOGLE SHEETS
    const WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbwfBcvVBPhohp2FV357_rPFq-XISou7o-6zs-y1aCWgNQ7sue2JqPyWOG1jIvJR5URx/exec"; // <-- REPLACE THIS!
    const orderData = {
      customerName,
      customerPhone,
      vehicle: vehicleFull,
      tyreInfo: tyreFull,
      size: selectedSize,
      quantity,
      total: totalNum
    };

    try {
      // We don't await this because we don't want to slow down the UI
      fetch(WEBHOOK_URL, {
        method: "POST",
        body: JSON.stringify(orderData),
        // Using text/plain avoids CORS preflight issues with Google Apps Script
        headers: { "Content-Type": "text/plain;charset=utf-8" }
      });
    } catch (err) {
      console.error("Webhook failed:", err);
    }

    // 2. WHATSAPP REDIRECT (Existing Logic)
    const shopNumber = "918085888288";
    const now = new Date();
    const dateTime = `${now.toLocaleDateString('en-IN')} at ${now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;

    const message = `*ORDER RECEIPT* | ${dateTime}%0A%0A*Customer:* ${customerName}%0A*Phone:* ${customerPhone}%0A*Vehicle:* ${vehicleFull}%0A%0A*Order Details:*%0A- ${quantity}x ${tyreFull}%0A- Size: ${selectedSize}%0A- Total Estimate: ₹${totalStr}%0A%0A_Please bring the car to the service bay._`;

    window.open(`https://wa.me/${shopNumber}?text=${message}`, '_blank');
    setIsOrderComplete(true);
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#f0f4f8] text-[#0f172a] font-sans">
        <div className="flex flex-col items-center">
          <motion.div
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-20 h-20 mb-8 flex items-center justify-center rounded-full relative"
          >
            <div className="absolute inset-0 rounded-full bg-[#00254d]/5"></div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#00254d]/20"
            ></motion.div>
            <span className="material-symbols-outlined text-3xl text-[#00254d]">tire_repair</span>
          </motion.div>
          <div className="text-center">
            <h1 className="text-[#0f172a] text-xl font-black uppercase tracking-[-0.02em] mb-3">Bilaspur Atelier</h1>
            <p className="text-[#00254d]/60 text-[10px] font-bold tracking-[0.4em] uppercase animate-pulse">Syncing Database...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden text-[#0f172a] bg-[#f0f4f8] font-sans">
      <aside className="hidden xl:flex flex-col h-screen py-8 px-4 w-[240px] 2xl:w-[260px] z-50 bg-[#00254d] text-slate-300 border-r-0 fixed left-0 top-0">
        <div className="mb-10 px-4">
          <div className="text-lg font-black text-white tracking-[-0.02em] uppercase cursor-pointer" onClick={() => setStep(1)}>
            Tyre Center
          </div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-blue-200/40 font-bold mt-1.5">Bilaspur Atelier</div>
        </div>
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />
        <nav className="flex-1 space-y-1 mt-2">
          <a onClick={() => setStep(1)} className={`group flex items-center gap-3.5 py-3 px-4 cursor-pointer transition-all duration-300 active:scale-[0.97] rounded-lg mx-1 ${step === 1 ? 'bg-white/[0.12] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-sm' : 'text-white/50 hover:text-white/90 hover:bg-white/[0.06]'}`} href="#">
            <span className={`material-symbols-outlined text-[1.2rem] transition-all duration-300 ${step === 1 ? 'text-blue-300' : 'opacity-60 group-hover:opacity-90'}`}>directions_car</span>
            <span className="text-[12px] font-bold tracking-[0.15em] uppercase">Select Vehicle</span>
            {step === 1 && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_6px_rgba(96,165,250,0.6)]" />}
          </a>
          <a onClick={() => selectedBrand && setStep(2)} className={`group flex items-center gap-3.5 py-3 px-4 cursor-pointer transition-all duration-300 active:scale-[0.97] rounded-lg mx-1 ${step === 2 ? 'bg-white/[0.12] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-sm' : 'text-white/50 hover:text-white/90 hover:bg-white/[0.06]'}`} href="#">
            <span className={`material-symbols-outlined text-[1.2rem] transition-all duration-300 ${step === 2 ? 'text-blue-300' : 'opacity-60 group-hover:opacity-90'}`}>straighten</span>
            <span className="text-[12px] font-bold tracking-[0.15em] uppercase">Model & Size</span>
            {step === 2 && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_6px_rgba(96,165,250,0.6)]" />}
          </a>
          <a onClick={() => selectedModel && selectedSize && setStep(3)} className={`group flex items-center gap-3.5 py-3 px-4 cursor-pointer transition-all duration-300 active:scale-[0.97] rounded-lg mx-1 ${step === 3 ? 'bg-white/[0.12] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-sm' : 'text-white/50 hover:text-white/90 hover:bg-white/[0.06]'}`} href="#">
            <span className={`material-symbols-outlined text-[1.2rem] transition-all duration-300 ${step === 3 ? 'text-blue-300' : 'opacity-60 group-hover:opacity-90'}`}>tire_repair</span>
            <span className="text-[12px] font-bold tracking-[0.15em] uppercase flex-1">View Tyres</span>
            {step === 3 && (
              <span className="relative flex h-2 w-2 ml-auto">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-400"></span>
              </span>
            )}
          </a>
        </nav>
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-4 mt-4" />
        <div className="space-y-1 px-1">
          <a className="flex items-center gap-3.5 py-2.5 px-4 text-white/30 hover:text-white/70 transition-all duration-200 rounded-lg hover:bg-white/[0.04]" href="#">
            <span className="material-symbols-outlined text-[1.1rem]">settings</span>
            <span className="text-[10px] uppercase tracking-[0.15em] font-bold">Settings</span>
          </a>
          <a className="flex items-center gap-3.5 py-2.5 px-4 text-white/30 hover:text-white/70 transition-all duration-200 rounded-lg hover:bg-white/[0.04]" href="#">
            <span className="material-symbols-outlined text-[1.1rem]">help</span>
            <span className="text-[10px] uppercase tracking-[0.15em] font-bold">Help</span>
          </a>
        </div>
      </aside>

      {/* ── MOBILE / TABLET TOP NAV (below xl) ── */}
      <nav className="xl:hidden fixed top-0 left-0 right-0 w-full bg-[#00254d]/95 backdrop-blur-xl text-white flex items-center justify-between px-4 sm:px-6 md:px-8 py-3 z-50 shadow-[0_4px_20px_rgba(0,37,77,0.25)] border-b border-white/[0.08]">
        <div className="flex flex-col">
          <div className="text-base sm:text-lg font-black tracking-[-0.02em] uppercase cursor-pointer leading-tight" onClick={() => setStep(1)}>Tyre Center</div>
          <div className="text-[8px] uppercase tracking-[0.2em] text-blue-200/40 font-bold mt-0.5">Bilaspur Atelier</div>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button onClick={() => setStep(1)} className={`py-1.5 px-3 sm:px-4 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-200 ${step === 1 ? 'bg-blue-500/90 text-white shadow-[0_2px_12px_rgba(59,130,246,0.4)]' : 'bg-white/[0.08] text-white/50 hover:bg-white/[0.14] hover:text-white/90'}`}>Vehicle</button>
          <button onClick={() => selectedBrand && setStep(2)} className={`py-1.5 px-3 sm:px-4 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-200 ${step === 2 ? 'bg-blue-500/90 text-white shadow-[0_2px_12px_rgba(59,130,246,0.4)]' : 'bg-white/[0.08] text-white/50 hover:bg-white/[0.14] hover:text-white/90'} ${!selectedBrand ? 'opacity-30 cursor-not-allowed' : ''}`}>Model</button>
          <button onClick={() => selectedModel && selectedSize && setStep(3)} className={`py-1.5 px-3 sm:px-4 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-200 ${step === 3 ? 'bg-blue-500/90 text-white shadow-[0_2px_12px_rgba(59,130,246,0.4)]' : 'bg-white/[0.08] text-white/50 hover:bg-white/[0.14] hover:text-white/90'} ${!(selectedModel && selectedSize) ? 'opacity-30 cursor-not-allowed' : ''}`}>Tyres</button>
        </div>
      </nav>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.main
            key="step1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="xl:ml-[240px] 2xl:ml-[260px] flex-1 h-full flex flex-col bg-[#f0f4f8] relative overflow-y-auto scroll-smooth pt-[52px] xl:pt-0"
          >
            {/* HERO */}
            <section className="relative w-full overflow-hidden bg-[#f0f4f8]">
              <div
                className="relative w-full h-[42vh] md:h-[58vh] lg:h-[64vh] xl:h-[68vh] min-h-[300px] max-h-[760px] overflow-hidden"
              >
                {/* ambient base */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.95)_0%,_rgba(241,245,249,0.92)_38%,_rgba(240,244,248,1)_72%)]" />

                {/* soft side atmospheric shading */}
                <div className="absolute inset-y-0 left-0 w-[18%] bg-gradient-to-r from-[#dfe5ec] via-[#e8edf2]/70 to-transparent z-[1]" />
                <div className="absolute inset-y-0 right-0 w-[18%] bg-gradient-to-l from-[#eef2f6] via-[#f3f6f9]/60 to-transparent z-[1]" />

                {/* glow behind car */}
                <div className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 w-[78%] h-[58%] rounded-full bg-white/75 blur-[90px] z-[1]" />

                {/* car wrapper */}
                <div className="absolute inset-0 z-10 flex items-start justify-center pointer-events-none">
                  <img
                    src="/hero car.png"
                    alt="Premium SUV"
                    draggable="false"
                    className="select-none h-auto object-contain"
                    style={{
                      width: "min(1500px, 108vw)",
                      marginTop: "clamp(6px, 1.5vh, 18px)",
                      filter: "drop-shadow(0 26px 60px rgba(15,23,42,0.16))",
                      WebkitMaskImage:
                        "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.95) 10%, rgba(0,0,0,1) 18%, rgba(0,0,0,1) 82%, rgba(0,0,0,0.95) 90%, transparent 100%), linear-gradient(to bottom, rgba(0,0,0,0.92) 0%, rgba(0,0,0,1) 12%, rgba(0,0,0,1) 72%, rgba(0,0,0,0.55) 88%, transparent 100%)",
                      maskImage:
                        "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.95) 10%, rgba(0,0,0,1) 18%, rgba(0,0,0,1) 82%, rgba(0,0,0,0.95) 90%, transparent 100%), linear-gradient(to bottom, rgba(0,0,0,0.92) 0%, rgba(0,0,0,1) 12%, rgba(0,0,0,1) 72%, rgba(0,0,0,0.55) 88%, transparent 100%)",
                      WebkitMaskComposite: "source-in",
                      maskComposite: "intersect",
                    }}
                  />
                </div>

                {/* floor reflection / fade */}
                <div className="absolute left-0 right-0 bottom-0 h-[34%] z-20 bg-gradient-to-t from-[#f0f4f8] via-[#f0f4f8]/92 via-[35%] to-transparent" />
                <div className="absolute left-1/2 bottom-[7%] -translate-x-1/2 w-[62%] h-10 rounded-[100%] bg-slate-400/20 blur-[26px] z-[5]" />

                {/* blend hero into rest of page */}
                <div className="absolute left-0 right-0 bottom-0 h-28 md:h-36 lg:h-44 z-30 bg-gradient-to-t from-[#f0f4f8] via-[#f0f4f8]/96 via-[38%] to-transparent" />
              </div>
            </section>

            {/* CONTENT */}
            <section
              className="w-full bg-[#f0f4f8] flex-1 pb-16 sm:pb-20 md:pb-28 flex flex-col items-center relative z-40"
              style={{ marginTop: "clamp(-1.5rem, -3vw, -3.75rem)" }}
            >
              <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 flex flex-col items-center">
                {/* Heading */}
                <div className="flex flex-col items-center text-center mb-6 sm:mb-8 md:mb-10 w-full">
                  <p className="text-[10px] sm:text-[11px] font-bold text-[#00254d] uppercase tracking-[0.25em] mb-2 sm:mb-3">Step 1</p>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-black tracking-[-0.03em] text-[#0f172a] uppercase">
                    Select Manufacturer
                  </h1>
                  <div className="w-10 sm:w-14 h-[2px] bg-[#00254d]/20 mx-auto my-3 sm:my-4 rounded-full" />
                  <p className="text-slate-400 text-xs sm:text-sm md:text-base xl:text-lg font-medium tracking-wide max-w-xl">
                    Choose your vehicle brand to explore precision-matched tyre options
                  </p>
                </div>

                {/* Manufacturer panel */}
                <div className="w-[calc(100%-1rem)] md:w-full max-w-5xl mx-auto rounded-2xl md:rounded-3xl border border-white/60 bg-white/40 backdrop-blur-2xl shadow-[0_8px_60px_rgba(15,23,42,0.08),_inset_0_1px_0_rgba(255,255,255,0.5)] p-4 sm:p-6 md:p-8 lg:p-10">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4 lg:gap-5 justify-items-center w-full">
                    {BRANDS.map((brand, index) => {
                      const isSelected = selectedBrand === brand.id;

                      return (
                        <motion.button
                          type="button"
                          key={brand.id}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.35, delay: index * 0.035, ease: [0.25, 0.46, 0.45, 0.94] }}
                          onClick={() => handleBrandClick(brand)}
                          className={
                            "relative group aspect-[1.15/1] w-full max-w-[110px] sm:max-w-[126px] md:max-w-[140px] rounded-2xl p-[2.5px] transition-all duration-300 active:scale-[0.94] " +
                            (isSelected
                              ? "bg-gradient-to-br from-[#003d7a] via-[#00254d] to-[#0b2f63] shadow-[0_12px_36px_rgba(0,37,77,0.30)] scale-[1.04]"
                              : "bg-transparent hover:-translate-y-1.5 hover:scale-[1.02]")
                          }
                        >
                          <div
                            className={
                              "relative h-full w-full rounded-[0.85rem] flex flex-col items-center justify-between overflow-hidden transition-all duration-300 p-3 " +
                              (isSelected
                                ? "bg-[#00254d]"
                                : "bg-white shadow-[0_4px_16px_rgba(15,23,42,0.05)] group-hover:shadow-[0_12px_28px_rgba(15,23,42,0.10)]")
                            }
                          >
                            {isSelected && (
                              <div className="absolute top-2 right-2 z-20 w-5 h-5 rounded-full bg-blue-400 text-white flex items-center justify-center shadow-[0_2px_8px_rgba(96,165,250,0.5)]">
                                <span className="material-symbols-outlined text-[12px]">check</span>
                              </div>
                            )}

                            {/* subtle inner plate for selected state so logos remain visible */}
                            <div
                              className={
                                "absolute inset-[6px] rounded-[0.65rem] transition-all duration-300 " +
                                (isSelected
                                  ? "bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] border border-white/[0.08]"
                                  : "bg-transparent")
                              }
                            />

                            {/* Image Container - Fixed height prevents collapsing */}
                            <div className="w-full h-[70px] flex items-center justify-center relative z-10">
                              <img
                                src={`/logos/${brand.image}`}
                                alt={brand.name}
                                className="
      h-full w-auto object-contain
      transition-all duration-300
      group-hover:scale-110
      drop-shadow-[0_6px_14px_rgba(0,0,0,0.15)]
    "
                              />
                            </div>

                            {/* Text Container - mt-auto pushes it to the bottom */}
                            <div className="mt-auto shrink-0 text-center w-full transition-colors duration-300 z-10">
                              <span className={`text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-widest ${selectedBrand === brand.id ? 'text-blue-100' : 'text-slate-400 group-hover:text-slate-600'}`}>
                                {brand.name}
                              </span>
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>
          </motion.main>
        )}

        {step === 2 && (
          <>
            <motion.main
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="xl:ml-[240px] 2xl:ml-[260px] 2xl:mr-[360px] flex-1 h-full flex flex-col bg-[#f0f4f8] relative overflow-y-auto overflow-x-hidden scroll-smooth pt-[68px] xl:pt-20 pb-32 sm:pb-36 2xl:pb-32 px-5 sm:px-8 md:px-12 lg:px-16 2xl:px-20"
            >
              <div className="hidden md:flex fixed top-20 xl:left-[240px] 2xl:left-[260px] left-0 w-full 2xl:w-[calc(100%-620px)] h-full overflow-hidden pointer-events-none z-0 items-start justify-center opacity-[0.025]">
                <span className="text-[18vw] xl:text-[22vw] font-black text-[#0f172a] leading-none tracking-[-0.03em] uppercase whitespace-nowrap select-none" style={{ fontFamily: 'inherit' }}>
                  {selectedBrand && selectedBrand.length > 5 ? selectedBrand.substring(0, 3) : selectedBrand}
                </span>
              </div>

              <div className="flex flex-col z-10 w-full max-w-5xl mx-auto h-full">
                <div className="mb-6 sm:mb-10 md:mb-14">
                  <h2 className="text-[#00254d] font-bold text-[10px] uppercase tracking-[0.25em] mb-2 sm:mb-3 flex items-center gap-2">
                    <span className="w-4 h-px bg-[#00254d]/30"></span>
                    Step 2 · Configuration
                  </h2>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-black text-[#0f172a] tracking-[-0.03em] capitalize leading-[0.9]">{selectedBrand}</h1>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end pb-3 sm:pb-4 mb-5 sm:mb-6 w-full gap-2 border-b border-slate-200/60">
                  <h3 className="text-[11px] font-bold text-[#0f172a] uppercase tracking-[0.2em]">Select Model Variant</h3>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{uniqueModels.length} Models</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4 w-full">
                  {uniqueModels.map(model => (
                    <div
                      key={model}
                      onClick={() => setSelectedModel(model)}
                      className={`relative flex flex-col rounded-[24px] cursor-pointer overflow-hidden group transition-all duration-300 ${selectedModel === model
                        ? 'bg-white ring-1 ring-[#00254d]/15 shadow-[0_20px_50px_rgba(0,37,77,0.14)] -translate-y-0.5'
                        : 'bg-white/92 ring-1 ring-black/5 hover:bg-white hover:shadow-[0_16px_40px_rgba(15,23,42,0.08)] hover:-translate-y-1'
                        }`}
                    >
                      {/* IMAGE SECTION */}
                      <div className="relative px-4 pt-4 pb-2">
                        <div className="relative w-full h-[170px] md:h-[190px] rounded-[18px] overflow-hidden bg-[linear-gradient(180deg,#f8fafc_0%,#eef2f7_100%)] flex items-center justify-center">

                          {/* soft shadow under car */}
                          <div className="absolute inset-x-[12%] bottom-3 h-6 bg-black/10 blur-xl rounded-full" />

                          <img
                            src={`/cars/${model.toLowerCase().replace(/\s+/g, '-')}.png`}
                            alt={model}
                            className="relative z-10 max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-[1.025]"
                            draggable="false"
                          />

                          {/* ACTION ICON */}
                          {selectedModel === model ? (
                            <div className="absolute top-3 right-3 z-20 w-10 h-10 rounded-full bg-[#00254d] text-white flex items-center justify-center shadow-[0_10px_24px_rgba(0,37,77,0.28)]">
                              <span className="material-symbols-outlined text-[18px]">check</span>
                            </div>
                          ) : (
                            <div className="absolute top-3 right-3 z-20 w-10 h-10 rounded-full bg-white/95 text-[#64748b] flex items-center justify-center shadow-[0_10px_24px_rgba(15,23,42,0.10)] group-hover:text-[#00254d] transition-colors">
                              <span className="material-symbols-outlined text-[18px]">add</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* TEXT SECTION */}
                      <div className="px-5 pb-5 pt-2 flex items-center justify-between">
                        <div>
                          <p className="text-[16px] font-extrabold uppercase tracking-[0.06em] text-[#0f172a] group-hover:text-[#00254d] transition-colors">
                            {model}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 sm:mt-12 md:mt-16">
                  <h3 className="text-[11px] font-bold text-[#0f172a] uppercase tracking-[0.2em] pb-4 sm:pb-5 mb-5 sm:mb-6 border-b border-slate-200/60">Specified Wheel Diameter</h3>
                  <div className="flex flex-row flex-wrap gap-3">
                    {uniqueSizes.length > 0 ? (
                      uniqueSizes.map(size => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`min-w-[110px] py-4 px-5 font-black tracking-widest rounded-xl transition-all duration-300 text-sm active:scale-[0.96] ${selectedSize === size
                            ? 'bg-[#00254d] text-white shadow-[0_8px_24px_rgba(0,37,77,0.20)] scale-[1.02]'
                            : 'bg-white text-slate-500 hover:text-[#0f172a] hover:shadow-[0_4px_16px_rgba(15,23,42,0.08)] hover:-translate-y-0.5 shadow-[0_2px_8px_rgba(15,23,42,0.04)]'
                            }`}
                        >
                          {size}
                        </button>
                      ))
                    ) : (
                      <div className="text-slate-400 font-medium text-sm py-4">{selectedModel ? 'No sizes available in database.' : 'Select a vehicle model to view available sizes.'}</div>
                    )}
                  </div>
                </div>

                {/* ── Inline CTA — visible below 2xl where summary panel is hidden ── */}
                {selectedModel && selectedSize && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="2xl:hidden mt-8 sm:mt-12 md:mt-14 w-full"
                  >
                    <div className="bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-5 sm:p-7 shadow-[0_8px_40px_rgba(0,37,77,0.08)]">
                      <div className="flex items-center justify-between mb-5">
                        <div>
                          <p className="text-[9px] text-slate-400 font-bold tracking-[0.2em] uppercase mb-1">Ready to continue</p>
                          <p className="text-[#0f172a] font-black text-lg sm:text-xl uppercase tracking-tight">{selectedModel} · {selectedSize}</p>
                        </div>
                        <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-bold tracking-widest">
                          <span>REF: {selectedBrand ? selectedBrand.substring(0, 3).toUpperCase() : '---'}-{selectedModel ? selectedModel.substring(0, 3).toUpperCase() : '---'}-{selectedSize ? selectedSize.replace(/[^0-9]/g, '') : 'XX'}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setStep(3)}
                        className="w-full bg-[#00254d] hover:bg-[#001a33] text-white font-black py-4 sm:py-5 rounded-xl flex justify-center items-center gap-3 transition-all duration-300 hover:shadow-[0_12px_32px_rgba(0,37,77,0.18)] active:scale-[0.98] shadow-[0_4px_16px_rgba(0,37,77,0.12)]"
                      >
                        <span className="text-[12px] tracking-[0.12em] uppercase">View Available Tyres</span>
                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.main>

            <motion.aside
              initial={{ x: 360 }}
              animate={{ x: 0 }}
              exit={{ x: 360 }}
              transition={{ ease: "circOut", duration: 0.5 }}
              className="hidden 2xl:flex fixed right-0 top-0 w-[360px] h-screen bg-white/95 backdrop-blur-xl flex-col z-40 p-10 shadow-[-1px_0_0_0_rgba(0,37,77,0.08)] border-l border-slate-200/60"
            >
              <div className="flex items-center gap-3 mb-14">
                <div className="w-1.5 h-5 rounded-full bg-[#00254d]"></div>
                <h2 className="text-[#0f172a] font-black tracking-[0.2em] uppercase text-[12px]">Summary</h2>
              </div>

              <div className="flex flex-col gap-8 flex-1">
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] text-slate-400 font-bold tracking-[0.2em] uppercase">Selected Configuration</span>
                </div>

                <div className="flex justify-between items-end pb-4 border-b border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold tracking-[0.2em] uppercase">Vehicle</span>
                  <span className="text-[#0f172a] font-black text-xl uppercase text-right leading-none">{selectedModel || '-'}</span>
                </div>

                <div className="flex justify-between items-end pb-4 border-b border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold tracking-[0.2em] uppercase">Wheel Diameter</span>
                  <span className={`font-black text-2xl text-right leading-none ${selectedSize ? 'text-[#00254d]' : 'text-slate-300'}`}>{selectedSize || '-'}</span>
                </div>

                {selectedModel && selectedSize && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 bg-[#f8fafc] p-5 rounded-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] border border-slate-100 relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 rounded-r-full bg-[#00254d]"></div>
                    <h4 className="text-[10px] text-[#00254d] font-bold tracking-[0.2em] uppercase mb-2 ml-3">Performance Note</h4>
                    <p className="text-[12px] text-slate-500 font-medium leading-relaxed ml-3">
                      Recommended configuration based on manufacturer specifications. Optimized for a balance of precision handling and ride comfort.
                    </p>
                  </motion.div>
                )}
              </div>

              <div className="mt-auto flex flex-col gap-4 pt-8">
                <div className="flex justify-between text-[9px] text-slate-400 font-bold tracking-widest px-1">
                  <span>REF: {selectedBrand ? selectedBrand.substring(0, 3).toUpperCase() : '---'}-{selectedModel ? selectedModel.substring(0, 3).toUpperCase() : '---'}-{selectedSize ? selectedSize.replace(/[^0-9]/g, '') : 'XX'}</span>
                  <span>V2.05</span>
                </div>
                <button
                  onClick={() => setStep(3)}
                  disabled={!selectedModel || !selectedSize}
                  className="relative overflow-hidden group w-full bg-[#00254d] hover:bg-[#001a33] text-white font-black py-5 rounded-xl flex justify-center items-center gap-3 transition-all duration-300 hover:shadow-[0_12px_32px_rgba(0,37,77,0.18)] active:scale-[0.97] disabled:opacity-20 disabled:pointer-events-none disabled:bg-slate-200 disabled:text-slate-400 shadow-[0_4px_16px_rgba(0,37,77,0.12)]"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    <span className="text-[12px] tracking-[0.12em] uppercase">View Available Tyres</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </span>
                </button>
              </div>
            </motion.aside>
          </>
        )}

        {step === 3 && (
          <motion.main
            key="step3"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ ease: "easeOut", duration: 0.4 }}
            className="xl:ml-[240px] 2xl:ml-[260px] flex flex-col xl:flex-row flex-1 h-full overflow-hidden bg-[#f0f4f8] relative pt-[52px] xl:pt-0"
          >
            <div className={`flex-1 h-full flex flex-col relative overflow-y-auto scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] transition-all duration-500 ${selectedTyre ? "w-full xl:w-2/3" : "w-full"}`}>
              <div className="sticky top-0 z-30 bg-[#f0f4f8]/95 backdrop-blur-[20px] pt-4 sm:pt-5 xl:pt-6 pb-4 sm:pb-4 flex flex-col gap-3 sm:gap-3.5 w-full mb-3 sm:mb-4 border-b border-slate-200/50 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
                <div className="flex flex-col md:flex-row md:items-center justify-between px-4 sm:px-6 md:px-8 xl:px-12 gap-3 md:gap-0">
                  <div className="flex flex-col">
                    <button onClick={() => { setStep(2); setSelectedTyre(null); }} className="flex items-center gap-2 text-[#00254d] hover:text-[#001a33] font-bold uppercase tracking-widest text-[10px] mb-1.5 transition-colors active:scale-95 w-fit">
                      <span className="material-symbols-outlined text-[14px]">arrow_back</span>
                      Back to Configuration
                    </button>
                    <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-black text-[#0f172a] tracking-[-0.02em] uppercase">
                      Tyres for <span className="text-[#00254d]">{selectedBrand} {selectedModel}</span> <span className="text-slate-400 font-bold">({selectedSize})</span>
                    </h1>
                  </div>
                  {/* Custom animated sort dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setIsSortOpen(v => !v)}
                      className="flex items-center gap-2.5 bg-white border border-slate-200/80 text-slate-700 text-[13px] rounded-xl px-4 py-2.5 shadow-[0_2px_8px_rgba(15,23,42,0.04)] hover:shadow-[0_4px_12px_rgba(15,23,42,0.08)] hover:border-slate-300 transition-all duration-200 min-w-[180px] justify-between"
                    >
                      <span className="font-semibold truncate">
                        {{ 'brand-asc': 'Brand (A–Z)', 'price-asc': 'Price: Low → High', 'price-desc': 'Price: High → Low' }[sortBy]}
                      </span>
                      <svg className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${isSortOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <AnimatePresence>
                      {isSortOpen && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -4 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -4 }}
                          transition={{ duration: 0.15, ease: 'easeOut' }}
                          className="absolute right-0 top-[calc(100%+4px)] z-50 bg-white border border-slate-200/80 rounded-xl shadow-[0_12px_40px_rgba(15,23,42,0.12)] overflow-hidden min-w-[200px]"
                        >
                          {[{ value: 'brand-asc', label: 'Brand (A–Z)' }, { value: 'price-asc', label: 'Price: Low → High' }, { value: 'price-desc', label: 'Price: High → Low' }].map(opt => (
                            <button
                              key={opt.value}
                              onClick={() => { setSortBy(opt.value); setIsSortOpen(false); }}
                              className={`w-full text-left px-4 py-3 text-sm font-semibold transition-colors flex items-center justify-between gap-3 ${sortBy === opt.value ? 'bg-[#f0f4f8] text-[#00254d]' : 'text-slate-700 hover:bg-slate-50'
                                }`}
                            >
                              {opt.label}
                              {sortBy === opt.value && <span className="material-symbols-outlined text-[#00254d] text-[16px]">check</span>}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {uniqueTyreBrands.length > 0 && (
                  <div
                    ref={filterBarRef}
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseLeave}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    className="flex items-center gap-2 w-full overflow-x-auto pb-1 cursor-grab active:cursor-grabbing [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] select-none px-4 sm:px-6 md:px-8 xl:px-12"
                  >
                    <button
                      onClick={() => setActiveBrandFilter('ALL')}
                      className={`shrink-0 px-5 py-2 rounded-full text-[11px] font-bold tracking-widest uppercase transition-all duration-200 active:scale-[0.96] ${activeBrandFilter === 'ALL' ? 'bg-[#00254d] text-white shadow-[0_4px_16px_rgba(0,37,77,0.20)]' : 'bg-white text-slate-500 hover:bg-slate-50 hover:text-[#0f172a] border border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.04)]'}`}
                    >
                      <span className="pointer-events-none">All Brands</span>
                    </button>
                    {uniqueTyreBrands.map(brand => (
                      <button
                        key={brand}
                        onClick={() => setActiveBrandFilter(brand)}
                        className={`shrink-0 px-5 py-2 rounded-full text-[11px] font-bold tracking-widest uppercase transition-all duration-200 active:scale-[0.96] ${activeBrandFilter === brand ? 'bg-[#00254d] text-white shadow-[0_4px_16px_rgba(0,37,77,0.20)]' : 'bg-white text-slate-500 hover:bg-slate-50 hover:text-[#0f172a] border border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.04)]'}`}
                      >
                        <span className="pointer-events-none">{brand}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <AnimatePresence>
                {compareList.length > 0 && (
                  <motion.div
                    initial={{ y: 80, opacity: 0, scale: 0.95 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 80, opacity: 0, scale: 0.95 }}
                    transition={{ type: 'spring', damping: 24, stiffness: 260 }}
                    className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] bg-white/80 backdrop-blur-xl text-[#0f172a] shadow-[0_12px_48px_rgba(0,37,77,0.18)] border border-white/60 rounded-2xl p-3 pl-5 flex items-center gap-4 w-max max-w-[95vw]"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#00254d]/10 hidden sm:flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[#00254d] text-[18px]">balance</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-black text-[11px] uppercase tracking-widest">{compareList.length} Tyre{compareList.length > 1 ? 's' : ''} Selected</span>
                      <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">Select up to 3</span>
                    </div>
                    <button onClick={() => setIsCompareOpen(true)} className="bg-[#00254d] hover:bg-[#001a33] active:scale-[0.96] text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-[0_4px_16px_rgba(0,37,77,0.18)] ml-3 shrink-0">Compare Now</button>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="px-4 sm:px-6 md:px-8 xl:px-12 py-4 sm:py-5 md:py-6 pb-24 xl:pb-8 relative">
                {displayedTyres.length > 0 ? (
                  <>
                    <h3 className="text-[11px] sm:text-xs font-bold text-slate-400 mb-3 sm:mb-4 px-1 uppercase tracking-widest">Top picks for your {selectedBrand} {selectedModel}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
                      {displayedTyres.map((tyre, index) => {
                        const isSelected = selectedTyre?.ModelID === tyre.ModelID;
                        let smartBadge = null;
                        if (tyre.PromoBadge) {
                          const pb = tyre.PromoBadge.toString().toLowerCase();
                          if (pb.includes('sale') || pb.includes('offer') || pb.includes('clearance')) {
                            smartBadge = { label: tyre.PromoBadge, icon: 'sell', color: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-200/50' };
                          } else if (pb.includes('popular') || pb.includes('recommend')) {
                            smartBadge = { label: tyre.PromoBadge, icon: 'local_fire_department', color: 'bg-[#00254d] text-white' };
                          } else {
                            smartBadge = { label: tyre.PromoBadge, icon: 'stars', color: 'bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-300/50' };
                          }
                        }
                        return (
                          <motion.div
                            key={index}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.03 }}
                            onClick={() => setSelectedTyre(selectedTyre?.ModelID === tyre.ModelID ? null : tyre)}
                            className={`cursor-pointer rounded-xl border flex flex-col group overflow-hidden transition-all duration-300 text-left w-full relative active:scale-[0.98] ${isSelected
                              ? 'border-[#00254d]/40 bg-white ring-2 ring-[#00254d]/20 shadow-[0_8px_32px_rgba(0,37,77,0.12)] -translate-y-0.5'
                              : 'border-slate-200/80 bg-white shadow-[0_2px_8px_rgba(15,23,42,0.04)] hover:-translate-y-1 hover:shadow-[0_8px_28px_rgba(15,23,42,0.08)]'
                              }`}
                          >

                            {/* Image */}
                            <div className="h-40 sm:h-44 w-full relative flex items-center justify-center p-3 sm:p-4 overflow-hidden bg-gradient-to-b from-slate-50/50 to-white">
                              {/* Top-right action stack: tick only */}
                              <div className="absolute top-3 right-3 flex flex-col gap-2 items-center z-30">
                                {isSelected && (
                                  <div className="w-6 h-6 bg-[#00254d] rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(0,37,77,0.25)]">
                                    <span className="material-symbols-outlined text-white text-[13px]">check</span>
                                  </div>
                                )}
                              </div>

                              <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start z-20">
                                {smartBadge && (
                                  <span className={`${smartBadge.color} text-[8px] px-2 py-0.5 font-black rounded-md uppercase tracking-widest flex items-center gap-1`}>
                                    <span className="material-symbols-outlined text-[9px]">{smartBadge.icon}</span>
                                    {smartBadge.label}
                                  </span>
                                )}
                                {tyre.Warranty && <span className={getWarrantyColor(tyre.Warranty)}>{tyre.Warranty.toUpperCase()} WARRANTY</span>}
                                {tyre.BestFor && <span className={getBestForColor(tyre.BestFor)}>FOR: {tyre.BestFor.toUpperCase()}</span>}
                              </div>
                              {/* Floor shadow */}
                              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1/2 h-3 bg-[#0f172a]/10 blur-[10px] rounded-[100%] pointer-events-none"></div>
                              <img
                                src={tyre.ImageFileName ? `/tyres/${tyre.ImageFileName}` : 'https://placehold.co/400x400/f5f5f5/a3a3a3?text=Image+Coming+Soon'}
                                alt={tyre.TyreModel || 'Tyre'}
                                className="w-4/5 h-4/5 object-contain mix-blend-multiply transition-transform duration-500 relative z-10 group-hover:scale-[1.04]"
                                style={{ opacity: 0, animation: 'fadeIn 0.4s ease forwards' }}
                                onLoad={(e) => { e.target.style.opacity = 1; }}
                                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x400/f5f5f5/a3a3a3?text=Image+Coming+Soon'; }}
                              />
                            </div>

                            {/* Details */}
                            <div className="p-4 flex flex-col flex-grow">
                              <div className="mb-3">
                                <h4 className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400 mb-0.5 truncate">{tyre.TyreBrand || tyre.Brand || 'Premium'}</h4>
                                <h3 className="text-sm font-black text-[#0f172a] leading-tight line-clamp-1">{tyre.TyreModel || tyre.Model || 'Tyre'}</h3>
                              </div>
                              <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between min-h-[40px]">
                                <div>
                                  <p className="text-[8px] text-slate-400 uppercase tracking-widest mb-0.5 font-bold">Per Tyre</p>
                                  <p className="text-lg font-black text-[#0f172a] leading-none tracking-tight">{tyre.Price ? `₹${Number(String(tyre.Price).replace(/[^0-9.]/g, '')).toLocaleString('en-IN')}` : 'POA'}</p>
                                </div>
                                <button
                                  onClick={(e) => toggleCompare(e, tyre)}
                                  className={`p-2 rounded-lg transition-all duration-200 flex items-center justify-center z-20 shrink-0 active:scale-[0.92] ${compareList.some(t => t.ModelID === tyre.ModelID)
                                    ? 'bg-[#e0e7ff] text-[#3730a3] shadow-sm'
                                    : 'bg-slate-50 text-slate-300 hover:bg-slate-100 hover:text-[#00254d]'
                                    }`}
                                >
                                  <span className="material-symbols-outlined text-[18px]">balance</span>
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="w-full h-80 flex flex-col items-center justify-center rounded-2xl bg-[#f0f4f8]">
                    <span className="material-symbols-outlined text-5xl text-[#475569] mb-4 opacity-50">inventory_2</span>
                    <h3 className="text-2xl font-black text-[#0f172a] tracking-tight">No stock matched your filter</h3>
                    <button onClick={() => setActiveBrandFilter('ALL')} className="text-[#00254d] text-sm mt-4 font-bold uppercase tracking-widest hover:underline">Clear Filter</button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile sticky bottom bar — shown when a tyre is selected on small screens */}
            <AnimatePresence>
              {selectedTyre && (
                <motion.div
                  initial={{ y: 80, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 80, opacity: 0 }}
                  transition={{ type: 'spring', damping: 26, stiffness: 280 }}
                  className="fixed bottom-0 left-0 right-0 z-[60] xl:hidden bg-white/95 backdrop-blur-xl border-t border-slate-200/80 shadow-[0_-4px_24px_rgba(0,37,77,0.10)] px-4 py-3.5 flex items-center gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 truncate">{selectedTyre.TyreBrand || selectedTyre.Brand}</p>
                    <p className="text-sm font-black text-[#0f172a] truncate line-clamp-1">{selectedTyre.TyreModel || selectedTyre.Model}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Per Tyre</p>
                    <p className="text-base font-black text-[#00254d]">{selectedTyre.Price ? `₹${Number(String(selectedTyre.Price).replace(/[^0-9.]/g, '')).toLocaleString('en-IN')}` : 'POA'}</p>
                  </div>
                  <button
                    onClick={() => setCheckoutTyre(selectedTyre)}
                    className="shrink-0 bg-[#00254d] text-white font-black text-[11px] uppercase tracking-widest px-5 py-3 rounded-xl hover:bg-[#001a33] active:scale-[0.96] transition-all shadow-[0_4px_16px_rgba(0,37,77,0.18)]"
                  >
                    Add to Cart
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {selectedTyre && (
                <motion.aside
                  initial={{ x: '100%', opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: '100%', opacity: 0 }}
                  transition={{ type: 'spring', damping: 28, stiffness: 220 }}
                  className="hidden xl:flex w-full xl:w-[400px] h-auto xl:h-full flex-col relative shrink-0 z-40 bg-white shadow-[-1px_0_0_0_rgba(0,37,77,0.06)] border-l border-slate-100"
                >
                  <div className="flex flex-col h-full">
                    {/* Image Area */}
                    <div className="relative w-full flex items-center justify-center p-8 overflow-hidden bg-gradient-to-b from-slate-50 to-white" style={{ minHeight: '240px' }}>
                      <button
                        onClick={() => setSelectedTyre(null)}
                        className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-white/80 backdrop-blur-sm rounded-full w-8 h-8 flex items-center justify-center transition-all z-50 shadow-sm border border-slate-200/60 hover:shadow-md"
                      >
                        <span className="material-symbols-outlined text-[15px]">close</span>
                      </button>
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1/2 h-3 bg-[#0f172a]/[0.06] blur-[12px] rounded-[100%] pointer-events-none"></div>
                      <img
                        src={selectedTyre.ImageFileName ? `/tyres/${selectedTyre.ImageFileName}` : '/tyre-placeholder.png'}
                        alt={selectedTyre.TyreModel || 'Tyre'}
                        className="w-4/5 h-48 object-contain mix-blend-multiply relative z-10 transition-transform duration-300 hover:scale-[1.02]"
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x400/f5f5f5/a3a3a3?text=Image+Coming+Soon'; }}
                      />
                    </div>

                    <div className="flex-1 overflow-y-auto px-7 py-6 flex flex-col hide-scrollbar">
                      {/* Brand & Model */}
                      <div className="mb-5">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mb-1">{selectedTyre.TyreBrand || selectedTyre.Brand || 'Brand'}</p>
                        <h1 className="text-2xl text-[#0f172a] font-black tracking-tight leading-tight">{selectedTyre.TyreModel || selectedTyre.Model || 'Model'}</h1>
                      </div>

                      {/* Price */}
                      <div className="mb-6 pb-6 border-b border-slate-100">
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-1">Price per tyre</p>
                        <div className="text-[#00254d] text-3xl font-black tracking-tight"><AnimatedPrice price={selectedTyre.Price} /></div>
                      </div>

                      {/* Description */}
                      <p className="text-[13px] text-slate-500 leading-relaxed mb-6">
                        {selectedTyre.Description || 'Designed to provide optimal grip, enhanced handling, and a comfortable ride — the ideal match for high-performance vehicles.'}
                      </p>

                      {/* Specs */}
                      <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Specifications</h3>
                      <div className="flex flex-col divide-y divide-slate-100 mb-6">
                        {selectedTyre.SpeedRating && (
                          <div className="flex items-center justify-between py-3">
                            <span className="text-[11px] text-slate-500 font-medium">Speed Rating</span>
                            <span className="text-[11px] text-[#0f172a] font-black bg-slate-50 px-2.5 py-1 rounded-md">{selectedTyre.SpeedRating}</span>
                          </div>
                        )}
                        {selectedTyre.LoadIndex && (
                          <div className="flex items-center justify-between py-3">
                            <span className="text-[11px] text-slate-500 font-medium">Load Index</span>
                            <span className="text-[11px] text-[#0f172a] font-black bg-slate-50 px-2.5 py-1 rounded-md">{selectedTyre.LoadIndex}</span>
                          </div>
                        )}
                        {selectedTyre.Warranty && (
                          <div className="flex items-center justify-between py-3">
                            <span className="text-[11px] text-slate-500 font-medium">Warranty</span>
                            <span className="text-[11px] text-[#0f172a] font-black bg-slate-50 px-2.5 py-1 rounded-md">{selectedTyre.Warranty}</span>
                          </div>
                        )}
                        {selectedTyre.BestFor && (
                          <div className="flex items-center justify-between py-3">
                            <span className="text-[11px] text-slate-500 font-medium">Best For</span>
                            <span className="text-[11px] text-[#0f172a] font-black bg-slate-50 px-2.5 py-1 rounded-md">{selectedTyre.BestFor}</span>
                          </div>
                        )}
                        {selectedTyre.Category && (
                          <div className="flex items-center justify-between py-3">
                            <span className="text-[11px] text-slate-500 font-medium">Category</span>
                            <span className="text-[11px] text-[#0f172a] font-black bg-slate-50 px-2.5 py-1 rounded-md">{selectedTyre.Category}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="p-5 bg-white border-t border-slate-100 shrink-0">
                      <button
                        onClick={() => setCheckoutTyre(selectedTyre)}
                        className="w-full bg-[#00254d] hover:bg-[#001a33] text-white font-black py-4 rounded-xl text-[12px] tracking-[0.12em] uppercase transition-all duration-200 active:scale-[0.97] flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(0,37,77,0.15)] hover:shadow-[0_8px_24px_rgba(0,37,77,0.22)]"
                      >
                        <span className="material-symbols-outlined text-[16px]">shopping_cart</span>
                        Add {selectedTyre.TyreModel || 'Tyre'} to Cart
                      </button>
                    </div>
                  </div>
                </motion.aside>
              )}
            </AnimatePresence>
          </motion.main>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCompareOpen && compareList.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#0f172a]/20 backdrop-blur-[16px] flex flex-col overflow-y-auto"
          >
            <div className="sticky top-0 w-full px-5 sm:px-8 md:px-12 py-5 sm:py-6 flex justify-between items-center z-50 bg-[#f0f4f8]/90 backdrop-blur-xl border-b border-slate-200/50">
              <div>
                <p className="text-[10px] text-[#00254d] font-bold tracking-[0.25em] uppercase mb-1">Compare</p>
                <h2 className="text-[#0f172a] text-xl sm:text-2xl font-black uppercase tracking-[-0.02em]">Side-by-Side Analysis</h2>
              </div>
              <button
                onClick={() => setIsCompareOpen(false)}
                className="w-10 h-10 bg-white hover:bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:text-[#0f172a] transition-all shadow-sm border border-slate-200/60"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="flex-1 px-5 sm:px-8 md:px-12 py-6 sm:py-8 md:py-12">
              <div className={`grid gap-4 sm:gap-6 ${compareList.length === 2 ? 'grid-cols-1 md:grid-cols-2' : compareList.length === 3 ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                {compareList.map((tyre, idx) => (
                  <div key={idx} className="flex flex-col bg-white rounded-xl overflow-hidden shadow-[0_4px_24px_rgba(15,23,42,0.06)] group border border-slate-100">
                    <div className="h-60 w-full relative bg-gradient-to-b from-slate-50 to-white flex items-center justify-center overflow-hidden p-6 rounded-t-xl">
                      <img
                        src={tyre.ImageFileName ? `/tyres/${tyre.ImageFileName}` : "https://placehold.co/400x400/f5f5f5/a3a3a3?text=Image+Coming+Soon"}
                        alt={tyre.TyreModel || "Tyre"}
                        className="w-5/6 h-5/6 object-contain mix-blend-darken group-hover:scale-105 transition-transform duration-700 ease-out z-10 relative"
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x400/f5f5f5/a3a3a3?text=Image+Coming+Soon"; }}
                      />
                    </div>

                    <div className="p-8 flex flex-col flex-1 bg-[#ffffff]">
                      <div className="mb-6">
                        <div className="text-[#475569] font-bold text-xs uppercase tracking-widest mb-1">{tyre.TyreBrand || tyre.Brand || "Premium"}</div>
                        <div className="text-3xl font-black text-[#0f172a] uppercase tracking-[-0.02em] leading-none mb-4">{tyre.TyreModel || tyre.Model || "Tyre"}</div>
                        <div className="text-[#00254d] text-3xl font-black tracking-[-0.02em]">{tyre.Price ? `₹${Number(String(tyre.Price).replace(/[^0-9.]/g, '')).toLocaleString('en-IN')}` : 'POA'}</div>
                      </div>

                      <div className="flex-1 pt-6 flex flex-col gap-4">
                        <div className="flex flex-col gap-3 mb-4">
                          <div className="flex justify-between items-center bg-transparent pb-2">
                            <span className="text-[10px] text-[#475569] font-bold uppercase tracking-widest">Warranty</span>
                            {tyre.Warranty ? <span className={`${getWarrantyColor(tyre.Warranty)} text-[9px] px-2 py-0.5 font-bold uppercase`}>{tyre.Warranty}</span> : <span className="text-[#475569]">-</span>}
                          </div>
                          <div className="flex justify-between items-center bg-transparent pb-2">
                            <span className="text-[10px] text-[#475569] font-bold uppercase tracking-widest">Best For</span>
                            {tyre.BestFor ? <span className={`${getBestForColor(tyre.BestFor)} text-[9px] px-2 py-0.5 font-black uppercase`}>{tyre.BestFor}</span> : <span className="text-[#475569]">-</span>}
                          </div>
                        </div>

                        {tyre.Description && (
                          <div className="mb-2">
                            <p className="text-sm text-[#475569] leading-relaxed line-clamp-3">{tyre.Description}</p>
                          </div>
                        )}
                      </div>

                      <div className="mt-6 pt-5 border-t border-slate-100">
                        <button onClick={(e) => { e.stopPropagation(); setCheckoutTyre(tyre); }} className="relative overflow-hidden group w-full bg-[#00254d] hover:bg-[#001a33] text-white font-black py-4 rounded-xl text-[12px] tracking-[0.12em] uppercase transition-all shadow-[0_4px_16px_rgba(0,37,77,0.12)] hover:shadow-[0_8px_24px_rgba(0,37,77,0.18)] active:scale-[0.97]">
                          <span className="relative z-10 flex justify-center items-center gap-2">Add to Cart</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {checkoutTyre && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#0f172a]/30 backdrop-blur-[16px] flex items-center justify-center p-4"
          >
            <>
              {isOrderComplete ? (
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="bg-white rounded-2xl w-full max-w-md p-10 flex flex-col items-center text-center shadow-[0_24px_80px_rgba(0,37,77,0.16)]"
                >
                  <div className="w-16 h-16 rounded-full bg-[#00254d]/10 flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-[#00254d] text-4xl">check_circle</span>
                  </div>
                  <h2 className="text-[#0f172a] text-2xl font-black uppercase tracking-[-0.02em] mb-2">Order Sent!</h2>
                  <p className="text-slate-500 text-sm mb-8 leading-relaxed">The receptionist has received your order via WhatsApp. Please proceed to the front desk.</p>
                  <button onClick={resetKiosk} className="w-full bg-[#00254d] hover:bg-[#001a33] text-white font-black py-4 rounded-xl uppercase tracking-widest text-[11px] transition-all shadow-[0_4px_16px_rgba(0,37,77,0.15)] hover:shadow-[0_8px_24px_rgba(0,37,77,0.22)] active:scale-[0.97]">Start New Order</button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="bg-white rounded-2xl w-full max-w-lg relative flex flex-col shadow-[0_24px_80px_rgba(0,37,77,0.16)] overflow-hidden"
                >
                  {/* Header */}
                  <div className="px-7 pt-7 pb-5 border-b border-slate-100">
                    <button
                      onClick={() => setCheckoutTyre(null)}
                      className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-full w-8 h-8 flex items-center justify-center transition-all shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                    <p className="text-[10px] text-[#00254d] font-bold tracking-[0.25em] uppercase mb-1">Checkout</p>
                    <h2 className="text-[#0f172a] text-xl font-black uppercase tracking-[-0.02em]">Registration</h2>
                  </div>

                  <div className="flex flex-col gap-5 px-7 py-6">
                    {/* Product summary */}
                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                      <div className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-0.5">{checkoutTyre.TyreBrand || checkoutTyre.Brand || "Tyre"}</div>
                      <div className="text-[#0f172a] font-black text-lg mb-4">{checkoutTyre.TyreModel || checkoutTyre.Model || "Premium Tyre"}</div>

                      <div className="flex justify-between items-center bg-white p-3 rounded-xl shadow-[0_2px_8px_rgba(15,23,42,0.04)] border border-slate-100">
                        <div className="flex items-center gap-2">
                          <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#0f172a] flex items-center justify-center font-bold transition-colors active:scale-[0.94]">-</button>
                          <span className="text-[#0f172a] font-black text-xl w-8 text-center">{quantity}</span>
                          <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#0f172a] flex items-center justify-center font-bold transition-colors active:scale-[0.94]">+</button>
                        </div>
                        <div className="flex gap-1.5">
                          {[1, 2, 3, 4].map(q => (
                            <button key={q} onClick={() => setQuantity(q)} className={`w-8 h-8 rounded-lg text-xs font-bold transition-all duration-200 ${quantity === q ? 'bg-[#00254d] text-white shadow-sm' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-[#0f172a]'}`}>{q}</button>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 flex justify-between items-end">
                        <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Total Estimate</div>
                        <div className="text-[#00254d] font-black text-2xl tracking-tight">₹{(Number(String(checkoutTyre.Price).replace(/[^0-9.]/g, '')) * quantity).toLocaleString('en-IN')}</div>
                      </div>
                    </div>

                    {/* Customer details */}
                    <div className="flex flex-col gap-4">
                      <div>
                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.15em] mb-1.5 block">Customer Name</label>
                        <input type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} className="w-full bg-slate-50 border border-slate-200/80 focus:border-[#00254d] focus:ring-2 focus:ring-[#00254d]/10 text-[#0f172a] px-4 py-3 rounded-xl outline-none transition-all text-sm" placeholder="Enter Full Name" />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.15em] mb-1.5 block">Phone Number</label>
                        <input type="tel" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} className="w-full bg-slate-50 border border-slate-200/80 focus:border-[#00254d] focus:ring-2 focus:ring-[#00254d]/10 text-[#0f172a] px-4 py-3 rounded-xl outline-none transition-all text-sm" placeholder="10-digit Mobile Number" />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.15em] mb-1.5 block">Vehicle Reg (Optional)</label>
                        <input type="text" value={vehicleReg} onChange={e => setVehicleReg(e.target.value)} className="w-full bg-slate-50 border border-slate-200/80 focus:border-[#00254d] focus:ring-2 focus:ring-[#00254d]/10 text-[#0f172a] px-4 py-3 rounded-xl outline-none transition-all uppercase text-sm" placeholder="e.g. CG 10 AB 1234" />
                      </div>
                    </div>

                    <button onClick={handleDispatch} className="w-full bg-[#00254d] hover:bg-[#001a33] text-white font-black text-base py-5 rounded-xl uppercase tracking-widest shadow-[0_4px_16px_rgba(0,37,77,0.15)] hover:shadow-[0_12px_32px_rgba(0,37,77,0.22)] transition-all active:scale-[0.97] mt-1">
                      Send to Reception
                    </button>
                  </div>
                </motion.div>
              )}
            </>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}