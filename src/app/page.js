"use client";

import React, { useEffect, useState, useRef } from "react";
import { useAppContext } from "@/context/store";
import { motion, AnimatePresence, animate } from "framer-motion";
import Papa from "papaparse";
import { Factory, Car, CarFront, CircleDot, Star, ArrowRight, Ruler, Disc } from "lucide-react";

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

const TYRE_BRAND_LOGOS = {
  apollo: "/tyre-brands/apollo.png",
  ceat: "/tyre-brands/ceat.png",
  bridgestone: "/tyre-brands/bridgestone.png",
  michelin: "/tyre-brands/michelin.png",
  mrf: "/tyre-brands/mrf.png",
  goodyear: "/tyre-brands/goodyear.png",
};

const getTyreImageCandidates = (fileName) => {
  if (!fileName) return [];
  const clean = fileName.toString().trim();
  const hasExt = /\.[a-zA-Z0-9]+$/.test(clean);
  if (hasExt) return [`/tyres/${clean}`];

  return [
    `/tyres/${clean}.png`,
    `/tyres/${clean}.jpg`,
    `/tyres/${clean}.jpeg`,
    `/tyres/${clean}.webp`,
  ];
};

function TyreImage({ fileName, alt, className, style }) {
  const initialCandidates = getTyreImageCandidates(fileName);
  const [imgSrc, setImgSrc] = useState(
    initialCandidates.length > 0
      ? initialCandidates[0]
      : 'https://placehold.co/400x400/f5f5f5/a3a3a3?text=Image+Coming+Soon'
  );
  const [errorIndex, setErrorIndex] = useState(0);

  useEffect(() => {
    const candidates = getTyreImageCandidates(fileName);
    setImgSrc(
      candidates.length > 0
        ? candidates[0]
        : 'https://placehold.co/400x400/f5f5f5/a3a3a3?text=Image+Coming+Soon'
    );
    setErrorIndex(0);
  }, [fileName]);

  const handleError = () => {
    const candidates = getTyreImageCandidates(fileName);
    if (errorIndex + 1 < candidates.length) {
      setErrorIndex(prev => prev + 1);
      setImgSrc(candidates[errorIndex + 1]);
    } else {
      setImgSrc('https://placehold.co/400x400/f5f5f5/a3a3a3?text=Image+Coming+Soon');
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      style={style}
      onLoad={(e) => { e.target.style.opacity = 1; }}
      onError={handleError}
    />
  );
}

function TyreBrandLogo({ brand, className, textClassName, imgClassName }) {
  if (!brand) return <h4 className={textClassName}>Premium</h4>;
  const cleanBrand = brand.toString().trim().toLowerCase();

  const matchedKey = Object.keys(TYRE_BRAND_LOGOS).find(
    k => cleanBrand.includes(k) || k.includes(cleanBrand) || cleanBrand === k
  );

  if (matchedKey) {
    return (
      <div className={`flex items-center ${className}`}>
        <img
          src={TYRE_BRAND_LOGOS[matchedKey]}
          alt={brand}
          className={`w-auto object-contain shrink-0 ${imgClassName || 'h-full'}`}
          style={{ filter: "contrast(1.1) brightness(1.05)" }}
        />
      </div>
    );
  }

  return <h4 className={textClassName}>{brand}</h4>;
}

const BRANDS = [
  { name: "KIA", id: "Kia", image: "kia.png" },
  { name: "MARUTI SUZUKI", id: "Maruti Suzuki", image: "suzuki.png" },
  { name: "HYUNDAI", id: "Hyundai", image: "hyundai.png" },
  { name: "HONDA", id: "Honda", image: "honda.png" },
  { name: "VOLKSWAGEN", id: "Volkswagen", image: "volkswagen.png" },
  { name: "JEEP", id: "Jeep", image: "jeep.png" },
  { name: "TATA MOTORS", id: "Tata Motors", image: "tata.png" },
  { name: "AUDI", id: "Audi", image: "audi.png" },
  { name: "BMW", id: "BMW", image: "bmw.png" },
  { name: "MERCEDES", id: "Mercedes", image: "mercedes.png" },
  { name: "MAHINDRA", id: "Mahindra", image: "mahindra.png" },
  { name: "SKODA", id: "Skoda", image: "skoda.png" }
];

const getBrandTheme = (brand) => {
  if (!brand) return { primary: '#00254d', secondary: '#001a33', accent: '#60a5fa', stripePrimary: '#ffffff', stripeSecondary: '#93c5fd' };
  const clean = brand.toString().trim().toLowerCase();

  if (clean.includes('apollo')) return { primary: '#6D28D9', secondary: '#4C1D95', accent: '#C4B5FD', stripePrimary: '#ffffff', stripeSecondary: '#A78BFA' };
  if (clean.includes('bridgestone')) return { primary: '#18181b', secondary: '#010101', accent: '#DC2626', stripePrimary: '#ffffff', stripeSecondary: '#DC2626' };
  if (clean.includes('ceat')) return { primary: '#1D4ED8', secondary: '#1E3A8A', accent: '#F97316', stripePrimary: '#ffffff', stripeSecondary: '#EA580C' };
  if (clean.includes('michelin')) return { primary: '#1D4ED8', secondary: '#1E3A8A', accent: '#FACC15', stripePrimary: '#ffffff', stripeSecondary: '#FACC15' };
  if (clean.includes('mrf')) return { primary: '#DC2626', secondary: '#991B1B', accent: '#FCA5A5', stripePrimary: '#ffffff', stripeSecondary: '#FCA5A5' };
  if (clean.includes('goodyear')) return { primary: '#1E3A8A', secondary: '#172554', accent: '#FACC15', stripePrimary: '#ffffff', stripeSecondary: '#FACC15' };

  return { primary: '#00254d', secondary: '#001a33', accent: '#60a5fa', stripePrimary: '#ffffff', stripeSecondary: '#93c5fd' };
};

const getBenefits = (tyre) => {
  const bf = (tyre.BestFor || '').toLowerCase();
  const desc = (tyre.Description || '').toLowerCase();
  const cat = (tyre.Category || '').toLowerCase();

  if (bf.includes('city') || bf.includes('urban') || desc.includes('fuel')) {
    return [
      { title: 'Excellent Fuel Efficiency', desc: 'Lower rolling resistance for better mileage', icon: 'local_gas_station' },
      { title: 'Long Lasting', desc: 'Durable compound for extended life', icon: 'verified_user' },
      { title: 'Superior Grip', desc: 'Confident handling on wet and dry roads', icon: 'tire_repair' },
      { title: 'Comfortable Ride', desc: 'Reduced road noise for a smoother drive', icon: 'airline_seat_recline_extra' }
    ];
  }
  if (bf.includes('highway') || bf.includes('touring') || cat.includes('ht') || desc.includes('comfort')) {
    return [
      { title: 'Highway Stability', desc: 'Smooth performance at high speeds', icon: 'speed' },
      { title: 'Enhanced Braking', desc: 'Shorter braking distances', icon: 'car_crash' },
      { title: 'Quiet Cabin', desc: 'Optimized tread pattern reduces noise', icon: 'volume_off' },
      { title: 'All-Weather Ready', desc: 'Reliable traction in varied conditions', icon: 'water_drop' }
    ];
  }
  if (bf.includes('all-terrain') || cat.includes('at') || desc.includes('off')) {
    return [
      { title: 'Rugged Durability', desc: 'Reinforced sidewalls resist cuts', icon: 'shield' },
      { title: 'All-Terrain Traction', desc: 'Aggressive grip on dirt & mud', icon: 'terrain' },
      { title: 'Responsive Handling', desc: 'Stable performance on paved roads', icon: 'compare_arrows' },
      { title: 'Self-Cleaning Tread', desc: 'Evacuates mud and stones quickly', icon: 'cleaning_services' }
    ];
  }
  return [
    { title: 'Precision Control', desc: 'Immediate steering response', icon: 'sports_motorsports' },
    { title: 'High-Speed Stability', desc: 'Maintains shape under intense forces', icon: 'speed' },
    { title: 'Maximum Grip', desc: 'Specialized compound sticks to road', icon: 'tire_repair' },
    { title: 'Sport Performance', desc: 'Engineered for dynamic driving', icon: 'flag' }
  ];
};

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
  const [activeCarTypeFilter, setActiveCarTypeFilter] = useState('ALL');

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
  const sizeSectionRef = useRef(null);
  const [highlightSizes, setHighlightSizes] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [showStickyBar, setShowStickyBar] = useState(false);

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

    const specificBrandInventory = fitments.filter(row =>
      row.CarBrand && row.CarBrand.toString().trim().toLowerCase() === brand.id.toString().trim().toLowerCase()
    );
    const newUniqueModels = [...new Set(specificBrandInventory.map(row => row.CarModel))].filter(Boolean);
    const firstModel = newUniqueModels[0] || null;

    setSelectedModel(firstModel);

    if (firstModel) {
      const mi = specificBrandInventory.filter(row =>
        row.CarModel && row.CarModel.toString().trim().toLowerCase() === firstModel.toString().trim().toLowerCase()
      );
      const sizes = [...new Set(mi.map(row => row.WheelSize + " Inch"))]
        .filter(Boolean)
        .sort((a, b) => parseInt(a) - parseInt(b));
      setSelectedSize(sizes.length > 0 ? sizes[0] : null);
    } else {
      setSelectedSize(null);
    }

    setStep(2);
  };

  const handleModelSelect = (model) => {
    setSelectedModel(model);

    const mi = brandInventory.filter(row =>
      row.CarModel && row.CarModel.toString().trim().toLowerCase() === model.toString().trim().toLowerCase()
    );
    const sizes = [...new Set(mi.map(row => row.WheelSize + " Inch"))]
      .filter(Boolean)
      .sort((a, b) => parseInt(a) - parseInt(b));

    setSelectedSize(sizes.length > 0 ? sizes[0] : null);
  };

  const brandInventory = fitments.filter(row =>
    row.CarBrand && selectedBrand && row.CarBrand.toString().trim().toLowerCase() === selectedBrand.toString().trim().toLowerCase()
  );
  const uniqueModels = [...new Set(brandInventory.map(row => row.CarModel))].filter(Boolean);

  const modelInventory = brandInventory.filter(row =>
    row.CarModel && selectedModel && row.CarModel.toString().trim().toLowerCase() === selectedModel.toString().trim().toLowerCase()
  );
  const uniqueSizes = [...new Set(modelInventory.map(row => row.WheelSize + " Inch"))]
    .filter(Boolean)
    .sort((a, b) => parseInt(a) - parseInt(b));

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

    const normalize = (str) => str?.toString().trim().toLowerCase().replace(/\s+/g, '-');

    return matchingInventory.map(invItem => {
      const catMatch = catalogue.find(cat =>
        normalize(cat.ModelID) === normalize(invItem.ModelID)
      );

      const parts = invItem.ModelID?.split('-') || [];
      const fallbackBrand = parts[0]
        ? parts[0].charAt(0).toUpperCase() + parts[0].slice(1)
        : "Unknown";
      const fallbackModel = parts.slice(1).join(' ') || "Model Missing";

      console.log("Mapping:", invItem.ModelID, "→", catMatch?.ModelID);

      return {
        ...invItem,
        ...(catMatch || {}),
        ModelID: invItem.ModelID?.toString().trim() || "",
        TyreBrand: (catMatch?.TyreBrand || fallbackBrand)?.toString().trim() || "",
        TyreModel: (catMatch?.TyreModel || fallbackModel)?.toString().trim() || "",
        Description: catMatch?.Description?.toString().trim() || "",
        BestFor: catMatch?.BestFor?.toString().trim() || "",
        ImageFileName: catMatch?.ImageFileName?.toString().trim() || invItem.ImageFileName?.toString().trim() || "",
        PromoBadge: invItem.PromoBadge?.toString().trim() || catMatch?.PromoBadge?.toString().trim() || "",
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

  const selectedSidebarTheme = selectedTyre ? getBrandTheme(selectedTyre.TyreBrand || selectedTyre.Brand) : getBrandTheme('');

  return (
    <div className="flex h-screen w-full overflow-hidden text-[#0f172a] bg-[#f0f4f8] font-sans">
      {/* ── PREMIUM LEFT SIDEBAR ── */}
      <aside
        className="hidden xl:flex flex-col h-screen w-[240px] 2xl:w-[260px] z-50 fixed left-0 top-0 text-slate-300 overflow-hidden"
        style={{
          /* Layered gradient: lighter navy top → deep navy bottom */
          background: "linear-gradient(175deg, #0d3a6e 0%, #072850 35%, #041d3d 65%, #020f22 100%)",
          /* Right-edge inner shadow separating from content */
          boxShadow: "inset -1px 0 0 rgba(255,255,255,0.06), inset -4px 0 24px rgba(0,0,0,0.35), 4px 0 32px rgba(0,0,0,0.40)",
        }}
      >
        {/* ── Top highlight line (subtle upper rim light) */}
        <div
          className="absolute top-0 left-0 right-0 h-px pointer-events-none z-10"
          style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.18) 45%, transparent)" }}
        />

        {/* ── Noise texture overlay (very low opacity) */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            opacity: 0.028,
            mixBlendMode: "overlay",
          }}
        />

        {/* ── Vertical lighting overlay: brighter top, darker bottom */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: "linear-gradient(180deg, rgba(255,255,255,0.045) 0%, transparent 45%, rgba(0,0,0,0.18) 100%)",
          }}
        />

        {/* ── Radial light near top-center (behind logo focal point) */}
        <div
          className="absolute top-0 left-0 right-0 h-48 pointer-events-none z-10"
          style={{
            background: "radial-gradient(ellipse 80% 90% at 50% 0%, rgba(56,139,253,0.18) 0%, transparent 70%)",
          }}
        />

        {/* ── All sidebar content (above overlays, so z-20) */}
        <div className="relative z-20 flex flex-col h-full py-8 px-4">

          {/* ── LOGO AREA ── */}
          <div className="mb-8 px-4 flex flex-col items-center text-center cursor-pointer group" onClick={() => setStep(1)}>

            {/* Radial glow behind logo */}
            <div
              className="absolute pointer-events-none"
              style={{
                top: "20px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "120px",
                height: "120px",
                background: "radial-gradient(circle, rgba(96,165,250,0.22) 0%, transparent 70%)",
                borderRadius: "50%",
                filter: "blur(8px)",
              }}
            />

            {/* Logo */}
            <img
              src="/logo.png"
              alt="Tyre Centre"
              className="relative h-16 w-16 object-contain mb-3 rounded-full transition-transform duration-300 group-active:scale-95 group-hover:scale-105"
              style={{
                filter: "drop-shadow(0 0 14px rgba(96,165,250,0.45)) drop-shadow(0 4px 12px rgba(0,0,0,0.55))",
              }}
            />

            {/* Title */}
            <div className="text-lg font-black text-white uppercase leading-none" style={{ letterSpacing: "-0.01em" }}>
              Tyre Centre
            </div>

            {/* Subtitle */}
            <div className="text-[10px] uppercase font-bold mt-1" style={{ letterSpacing: "0.22em", color: "rgba(147,197,253,0.55)" }}>
              Bilaspur Atelier
            </div>

          </div>

          {/* Divider */}
          <div className="w-full h-px mb-6" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12) 45%, transparent)" }} />

          {/* ── NAV ITEMS ── */}
          <nav className="flex-1 space-y-1.5 mt-2">

            {/* Step 1 */}
            <a
              onClick={() => setStep(1)}
              href="#"
              className={`sidebar-nav-item${step === 1 ? ' sidebar-nav-active' : ''} group flex items-center gap-3.5 py-3 px-4 cursor-pointer rounded-xl mx-1 active:scale-[0.97]`}
              style={{
                transition: "background 300ms ease, box-shadow 300ms ease, transform 300ms ease, color 300ms ease",
                ...(step === 1
                  ? {
                    background: "linear-gradient(90deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.055) 100%)",
                    boxShadow: "0 4px 18px rgba(0,0,0,0.28), inset 0 0 0 1px rgba(255,255,255,0.12), 0 0 14px rgba(96,165,250,0.14)",
                    color: "#ffffff",
                  }
                  : { color: "rgba(255,255,255,0.58)" }),
              }}
            >
              <Car
                size={20}
                strokeWidth={2}
                className="sidebar-nav-icon"
                style={{
                  transition: "color 300ms ease",
                  color: step === 1 ? "#ffffff" : "rgba(255,255,255,0.52)",
                }}
              />
              <span className="text-[12px] font-semibold uppercase" style={{ letterSpacing: "0.09em" }}>Select Vehicle</span>
              {step === 1 && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.75)]" />}
            </a>

            {/* Step 2 */}
            <a
              onClick={() => selectedBrand && setStep(2)}
              href="#"
              className={`sidebar-nav-item${step === 2 ? ' sidebar-nav-active' : ''} group flex items-center gap-3.5 py-3 px-4 cursor-pointer rounded-xl mx-1 active:scale-[0.97]`}
              style={{
                transition: "background 300ms ease, box-shadow 300ms ease, transform 300ms ease, color 300ms ease",
                ...(step === 2
                  ? {
                    background: "linear-gradient(90deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.055) 100%)",
                    boxShadow: "0 4px 18px rgba(0,0,0,0.28), inset 0 0 0 1px rgba(255,255,255,0.12), 0 0 14px rgba(96,165,250,0.14)",
                    color: "#ffffff",
                  }
                  : { color: "rgba(255,255,255,0.58)" }),
              }}
            >
              <Ruler
                size={20}
                strokeWidth={2}
                className="sidebar-nav-icon"
                style={{
                  transition: "color 300ms ease",
                  color: step === 2 ? "#ffffff" : "rgba(255,255,255,0.52)",
                }}
              />
              <span className="text-[12px] font-semibold uppercase" style={{ letterSpacing: "0.09em" }}>Model & Size</span>
              {step === 2 && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.75)]" />}
            </a>

            {/* Step 3 */}
            <a
              onClick={() => selectedModel && selectedSize && setStep(3)}
              href="#"
              className={`sidebar-nav-item${step === 3 ? ' sidebar-nav-active' : ''} group flex items-center gap-3.5 py-3 px-4 cursor-pointer rounded-xl mx-1 active:scale-[0.97]`}
              style={{
                transition: "background 300ms ease, box-shadow 300ms ease, transform 300ms ease, color 300ms ease",
                ...(step === 3
                  ? {
                    background: "linear-gradient(90deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.055) 100%)",
                    boxShadow: "0 4px 18px rgba(0,0,0,0.28), inset 0 0 0 1px rgba(255,255,255,0.12), 0 0 14px rgba(96,165,250,0.14)",
                    color: "#ffffff",
                  }
                  : { color: "rgba(255,255,255,0.58)" }),
              }}
            >
              <Disc
                size={20}
                strokeWidth={2}
                className="sidebar-nav-icon"
                style={{
                  transition: "color 300ms ease",
                  color: step === 3 ? "#ffffff" : "rgba(255,255,255,0.52)",
                }}
              />
              <span className="text-[12px] font-semibold uppercase flex-1" style={{ letterSpacing: "0.09em" }}>View Tyres</span>
              {step === 3 && (
                <span className="relative flex h-1.5 w-1.5 ml-auto">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.75)]"></span>
                </span>
              )}
            </a>

          </nav>

          {/* Bottom divider */}
          <div className="w-full mb-4 mt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }} />

          {/* ── BOTTOM UTILITY LINKS ── */}
          <div className="space-y-1 px-1">
            <a
              className="sidebar-util-link flex items-center gap-3.5 py-2.5 px-4 rounded-lg active:scale-[0.97]"
              href="#"
              style={{ color: "rgba(255,255,255,0.38)", transition: "color 300ms ease, background 300ms ease" }}
            >
              <span className="material-symbols-outlined text-[18px]">settings</span>
              <span className="text-[9px] uppercase font-semibold" style={{ letterSpacing: "0.1em" }}>Settings</span>
            </a>
            <a
              className="sidebar-util-link flex items-center gap-3.5 py-2.5 px-4 rounded-lg active:scale-[0.97]"
              href="#"
              style={{ color: "rgba(255,255,255,0.38)", transition: "color 300ms ease, background 300ms ease" }}
            >
              <span className="material-symbols-outlined text-[18px]">help</span>
              <span className="text-[9px] uppercase font-semibold" style={{ letterSpacing: "0.1em" }}>Help</span>
            </a>
          </div>

        </div>
      </aside>

      {/* ── MOBILE / TABLET TOP NAV (below xl) ── */}
      <nav className="xl:hidden fixed top-0 left-0 right-0 w-full bg-[#00254d]/95 backdrop-blur-sm text-white flex items-center justify-between px-4 sm:px-6 md:px-8 py-3 z-50 shadow-md border-b border-white/[0.08]">
        <div className="flex items-center gap-3 cursor-pointer active:scale-95 transition-transform" onClick={() => setStep(1)}>
          <img src="/logo.png" alt="Tyre Centre" className="h-8 w-8 object-contain rounded-full shadow-sm bg-white" />
          <div className="flex flex-col">
            <div className="text-base sm:text-lg font-black tracking-[-0.02em] uppercase leading-tight">Tyre Centre</div>
            <div className="text-[8px] uppercase tracking-[0.2em] text-blue-200/50 font-bold mt-0.5">Bilaspur Atelier</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button onClick={() => setStep(1)} className={`py-1.5 px-3 sm:px-4 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-200 ${step === 1 ? 'bg-blue-500/90 text-white shadow-[0_2px_12px_rgba(59,130,246,0.4)]' : 'bg-white/[0.08] text-white/50 hover:bg-white/[0.14] hover:text-white/90'}`}>Vehicle</button>
          <button onClick={() => selectedBrand && setStep(2)} className={`py-1.5 px-3 sm:px-4 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-200 ${step === 2 ? 'bg-blue-500/90 text-white shadow-[0_2px_12px_rgba(59,130,246,0.4)]' : 'bg-white/[0.08] text-white/50 hover:bg-white/[0.14] hover:text-white/90'} ${!selectedBrand ? 'opacity-30 cursor-not-allowed' : ''}`}>Model</button>
          <button onClick={() => selectedModel && selectedSize && setStep(3)} className={`py-1.5 px-3 sm:px-4 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-200 ${step === 3 ? 'bg-blue-500/90 text-white shadow-[0_2px_12px_rgba(59,130,246,0.4)]' : 'bg-white/[0.08] text-white/50 hover:bg-white/[0.14] hover:text-white/90'} ${!(selectedModel && selectedSize) ? 'opacity-30 cursor-not-allowed' : ''}`}>Tyres</button>
        </div>
      </nav>

      <>
        {step === 1 && (
          <main
            key="step1"
            className="xl:ml-[240px] 2xl:ml-[260px] flex-1 h-full flex flex-col bg-[#f0f4f8] relative overflow-y-auto scroll-smooth pt-[52px] xl:pt-0 animate-[fadeInFast_0.15s_ease-out]"
          >
            {/* ── PREMIUM HERO CARD ── */}
            <section className="w-full px-4 sm:px-6 md:px-8 xl:px-10 pt-6 sm:pt-8 xl:pt-10">
              <div className="max-w-[1320px] mx-auto">
                <div
                  className="relative w-full rounded-2xl xl:rounded-3xl overflow-hidden"
                  style={{
                    minHeight: "clamp(300px, 42vh, 540px)",
                    backgroundImage: "url('/hero/hero-bg.webp')",
                    backgroundSize: "cover",
                    backgroundPosition: "center right",
                    boxShadow: "0 8px 48px rgba(15,23,42,0.12), 0 2px 8px rgba(15,23,42,0.06)",
                  }}
                >
                  {/* Left-to-right gradient overlay for text readability */}
                  <div
                    className="absolute inset-0 z-[1]"
                    style={{
                      background: "linear-gradient(to right, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.88) 30%, rgba(255,255,255,0.55) 55%, rgba(255,255,255,0.10) 78%, rgba(255,255,255,0.0) 100%)",
                    }}
                  />

                  {/* Hero content: text left, tyre right */}
                  <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between h-full w-full px-8 sm:px-10 md:px-14 lg:px-16 py-12 sm:py-14 md:py-16 gap-8 sm:gap-6">

                    {/* LEFT — text only */}
                    <div className="flex flex-col items-start">

                      {/* WELCOME TO */}
                      <span
                        className="text-[10px] sm:text-[11px] xl:text-[12px] font-medium uppercase text-[#2563eb]/70 mb-3 font-body"
                        style={{ letterSpacing: "0.32em" }}
                      >
                        Welcome to
                      </span>

                      {/* TYRE CENTRE — Clash Display, breathable */}
                      <h1
                        className="uppercase text-[#061735] whitespace-nowrap mb-7 font-headline"
                        style={{ fontSize: "clamp(2.8rem, 5.4vw, 5.8rem)", fontWeight: 700, letterSpacing: "-0.01em", lineHeight: "1.05" }}
                      >
                        Tyre Centre
                      </h1>

                      {/* Thin accent line */}
                      <div className="w-12 h-[2.5px] rounded-full bg-[#2563eb]/40 mb-5" />

                      {/* Subheading — Inter semibold, deeper navy */}
                      <p className="text-[17px] sm:text-[18px] xl:text-[19px] font-semibold text-[#071e3d] leading-snug mb-3 font-body">
                        Chhattisgarh&apos;s Trusted Tyre Experts
                      </p>

                      {/* Since 1995 — Pacifico accent with elegant extending line */}
                      <div className="flex items-center gap-4 mb-7">
                        <span
                          className="text-[18px] sm:text-[21px] text-[#2563eb] font-accent"
                          style={{ letterSpacing: "0.02em" }}
                        >
                          Since 1995
                        </span>
                        <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-[#2563eb]/30 to-transparent rounded-full" />
                      </div>

                      {/* Description — Inter regular, readable contrast */}
                      <p className="text-[14px] sm:text-[15px] xl:text-[16px] text-[#4b5563] leading-relaxed max-w-[300px] sm:max-w-[340px] xl:max-w-[360px] font-body font-normal">
                        Premium tyres, expert fitment and trusted service in Bilaspur.
                      </p>

                    </div>

                    {/* RIGHT — tyre image, shifted slightly right & grounded */}
                    <div className="flex items-end justify-center shrink-0 w-[240px] sm:w-[320px] md:w-[400px] lg:w-[440px] xl:w-[480px] self-end pr-2 xl:pr-6">
                      <img
                        src="/hero/hero-tyre.webp"
                        alt="Premium Tyre"
                        draggable="false"
                        className="hero-tyre-float select-none w-full h-auto object-contain"
                        style={{
                          filter: "drop-shadow(0 32px 24px rgba(15,23,42,0.22)) drop-shadow(0 8px 16px rgba(15,23,42,0.10))",
                          maxHeight: "clamp(220px, 36vh, 460px)",
                        }}
                      />
                    </div>

                  </div>
                </div>
              </div>
            </section>

            {/* ── BRAND SECTION ── */}
            <section
              id="brand-section"
              className="w-full flex-1 pb-8 sm:pb-12 md:pb-16 flex flex-col items-center pt-6 sm:pt-8"
            >
              <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 md:px-8 xl:px-10 flex flex-col items-center">

                {/* Section heading */}
                <div className="flex flex-col items-center text-center mb-6 sm:mb-8 w-full">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-semibold tracking-tight text-[#0f172a] uppercase font-headline">
                    Choose Your Vehicle Brand
                  </h2>
                  <div className="w-8 sm:w-12 h-[2px] bg-[#2563eb]/30 mx-auto mt-3 rounded-full" />
                </div>

                {/* Brand cards */}
                <div className="w-full max-w-[1200px] mx-auto rounded-2xl md:rounded-3xl border border-white/70 bg-white/60 shadow-[0_4px_32px_rgba(15,23,42,0.07),inset_0_1px_0_rgba(255,255,255,0.8)] p-5 sm:p-6 md:p-8 lg:p-10">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 md:gap-5 justify-items-center w-full">
                    {BRANDS.map((brand) => {
                      const isSelected = selectedBrand === brand.id;
                      return (
                        <button
                          type="button"
                          key={brand.id}
                          onClick={() => handleBrandClick(brand)}
                          className={
                            "relative group aspect-[1.1/1] w-full max-w-[148px] rounded-2xl transition-all duration-200 active:scale-[0.94] " +
                            (isSelected
                              ? "scale-[1.05] ring-2 ring-[#2563eb] shadow-[0_8px_28px_rgba(37,99,235,0.22)]"
                              : "[@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-1 [@media(hover:hover)_and_(pointer:fine)]:hover:shadow-[0_8px_24px_rgba(15,23,42,0.10)]")
                          }
                        >
                          <div
                            className={
                              "relative h-full w-full rounded-2xl flex flex-col items-center justify-between p-3.5 transition-all duration-200 " +
                              (isSelected
                                ? "bg-[#eff6ff] border-2 border-[#2563eb]"
                                : "bg-white border border-slate-100 shadow-sm")
                            }
                          >
                            {isSelected && (
                              <div className="absolute top-2 right-2 z-10 w-5 h-5 rounded-full bg-[#2563eb] text-white flex items-center justify-center shadow-sm">
                                <span className="material-symbols-outlined text-[12px]">check</span>
                              </div>
                            )}
                            <div className="w-full h-[78px] flex items-center justify-center">
                              <img
                                src={`/logos/${brand.image}`}
                                alt={brand.name}
                                className="h-full w-auto object-contain transition-transform duration-200 [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-110 drop-shadow-[0_4px_10px_rgba(0,0,0,0.12)]"
                              />
                            </div>
                            <span className={`text-[8px] sm:text-[9px] font-medium uppercase tracking-widest mt-1 font-body ${isSelected ? 'text-[#1d4ed8]' : 'text-slate-400'}`}>
                              {brand.name}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>
            </section>
          </main>
        )}

        {step === 2 && (() => {
          const getBrandThemeColor = (brand) => {
            if (!brand) return '#00254d';
            const clean = brand.toString().trim().toLowerCase();
            if (clean.includes('hyundai')) return '#002c5f';
            if (clean.includes('kia')) return '#bb162b';
            if (clean.includes('tata')) return '#0033a0';
            if (clean.includes('mahindra')) return '#e31837';
            if (clean.includes('maruti') || clean.includes('suzuki')) return '#1e293b';
            if (clean.includes('jeep')) return '#4b5320';
            if (clean.includes('mercedes')) return '#000000';
            if (clean.includes('audi')) return '#000000';
            if (clean.includes('skoda')) return '#4ba82e';
            if (clean.includes('volkswagen')) return '#001e50';
            if (clean.includes('honda')) return '#0f172a';
            if (clean.includes('bmw')) return '#0066b1';
            if (clean.includes('toyota')) return '#eb0a1e';
            return '#00254d';
          };
          const brandThemeColor = getBrandThemeColor(selectedBrand);
          const activeModelName = selectedModel || uniqueModels[0];

          const activeModelDetails = brandInventory.find(row => row.CarModel === activeModelName);
          const activeModelSubCat = activeModelDetails?.BodyType || activeModelDetails?.Category || 'Premium SUV';

          const activeModelSizes = (() => {
            if (!activeModelName) return [];
            const mi = brandInventory.filter(row =>
              row.CarModel && row.CarModel.toString().trim().toLowerCase() === activeModelName.toString().trim().toLowerCase()
            );
            return [...new Set(mi.map(row => row.WheelSize + " Inch"))]
              .filter(Boolean)
              .sort((a, b) => parseInt(a) - parseInt(b));
          })();

          const modelsByCategory = {};
          uniqueModels.forEach(model => {
            const match = brandInventory.find(row => row.CarModel === model);
            const cat = match?.Category || 'SUVs';
            if (!modelsByCategory[cat]) modelsByCategory[cat] = [];
            modelsByCategory[cat].push({
              name: model,
              sub: match?.BodyType || match?.Category || ''
            });
          });
          const categoryOrder = ['SUVs', 'Sedans', 'Hatchbacks', 'EVs', 'MUVs'];
          const sortedCategories = Object.keys(modelsByCategory).sort((a, b) => {
            const idxA = categoryOrder.findIndex(c => c.toLowerCase() === a.toLowerCase());
            const idxB = categoryOrder.findIndex(c => c.toLowerCase() === b.toLowerCase());
            return (idxA !== -1 ? idxA : 99) - (idxB !== -1 ? idxB : 99);
          });

          const carTypeFilters = ['ALL', ...sortedCategories];

          const getCatIcon = (cat) => {
            const c = cat.toLowerCase();
            if (c === 'all') return 'directions_car';
            if (c.includes('suv')) return 'airport_shuttle';
            if (c.includes('sedan')) return 'directions_car';
            if (c.includes('hatch')) return 'time_to_leave';
            if (c.includes('ev')) return 'electric_car';
            if (c.includes('muv') || c.includes('mpv')) return 'airport_shuttle';
            return 'directions_car';
          };

          return (
            <>

              <main
                key="step2"
                className="xl:ml-[240px] 2xl:ml-[260px] flex-1 h-full flex flex-col relative overflow-y-auto overflow-x-hidden scroll-smooth pt-[68px] xl:pt-16 pb-16 px-4 sm:px-6 animate-[fadeInFast_0.12s_ease-out]"
                style={{ background: 'radial-gradient(circle at top, #f8fbff 0%, #eef3f9 55%, #f6f9fd 100%)' }}
              >
                {/* Subtle background radial glow */}
                <div className="pointer-events-none absolute top-[15%] left-1/2 -translate-x-1/2 w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] rounded-full bg-blue-400/[0.06] blur-[120px] z-0" />

                {/* Brand watermark */}
                <div className="flex fixed top-16 left-0 w-full h-full overflow-hidden pointer-events-none z-0 items-start justify-center">
                  <span className="text-[14vw] font-black text-[#0f172a]/[0.02] tracking-[-0.02em] uppercase leading-none select-none mt-12 w-full text-center">
                    {selectedBrand}
                  </span>
                </div>

                <div className="flex flex-col z-10 w-full max-w-6xl mx-auto relative">



                  {/* ── Page heading ── */}
                  <div
                    className="mb-7 text-left"
                  >
                    <h1 className="text-[32px] sm:text-4xl md:text-[42px] font-black text-[#0a1929] tracking-[-0.03em] mb-1.5 leading-tight">
                      Choose your <span className="text-[#1185f4]">{selectedBrand}</span> model
                    </h1>
                    <p className="text-[13px] md:text-sm text-slate-500 font-medium tracking-wide">
                      Select a vehicle to view available tyre sizes
                    </p>
                  </div>

                  {/* ══════════════════════════════════════════════════
                      HERO CARD — premium light showroom
                  ══════════════════════════════════════════════════ */}
                  <div
                    className="model-hero-card rounded-[28px] shadow-[0_18px_50px_rgba(15,23,42,0.16)] border border-white/70 mb-10 flex flex-col md:flex-row min-h-[280px] md:min-h-[330px] relative overflow-hidden items-stretch bg-slate-50"
                    style={{
                      backgroundImage: "url('/background.jpeg')",
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                    }}
                  >
                    {/* Right-side readability gradient only */}
                    <div
                      className="absolute inset-0 pointer-events-none z-[3] hidden md:block"
                      style={{ background: 'linear-gradient(to right, transparent 0%, transparent 48%, rgba(2,15,34,0.45) 65%, rgba(2,15,34,0.88) 100%)' }}
                    />
                    {/* Top edge highlight */}
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none z-[4]" />

                    {/* Left — Car image */}
                    <div className="w-full md:w-[59%] flex justify-center items-end relative pt-10 pb-4 md:pt-8 md:pb-2 px-5 sm:px-6 shrink-0 overflow-hidden min-h-[240px] md:min-h-0">
                      {/* Soft natural contact shadow under the tyres */}
                      <div
                        className="absolute bottom-[5%] left-1/2 -translate-x-1/2 pointer-events-none z-[6]"
                        style={{ width: '62%', height: '14px', background: 'radial-gradient(ellipse, rgba(15,23,42,0.30) 0%, rgba(15,23,42,0.16) 42%, transparent 72%)', filter: 'blur(7px)' }}
                      />
                      <img
                        src={`/cars/${activeModelName.toLowerCase().replace(/\s+/g, '-')}.webp`}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `/cars/${activeModelName.toLowerCase().replace(/\s+/g, '-')}.jpg`;
                        }}
                        alt={activeModelName}
                        className="w-full max-w-[540px] xl:max-w-[620px] h-auto object-contain z-10 relative translate-y-3 md:translate-y-5 [@media(hover:hover)_and_(pointer:fine)]:hover:scale-[1.035] transition-transform duration-[0.65s] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
                        style={{
                          filter: 'brightness(1.03) contrast(1.02)',
                        }}
                      />
                    </div>

                    {/* Right — Model info + wheel sizes */}
                    <div
                      className="w-full md:w-[41%] flex flex-col justify-center text-left z-10 px-7 py-8 md:py-10 md:pr-10 lg:pl-5 shrink-0 bg-[linear-gradient(180deg,rgba(2,15,34,0.82),rgba(2,15,34,0.92))] md:bg-none"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      <div
                        className="flex flex-col"
                      >


                        {/* Model title — bigger, tighter */}
                        <h2
                          className="text-[26px] md:text-[34px] font-bold text-[#f8fafc] mb-2.5 tracking-[-0.02em] leading-[1.05]"
                          style={{
                            fontFamily: "'Satoshi', 'Inter', sans-serif",
                            textShadow: '0 2px 12px rgba(0,0,0,0.25)',
                          }}
                        >
                          {selectedBrand}&nbsp;{activeModelName}
                        </h2>

                        {/* Thin rule */}
                        <div className="w-10 h-[2px] rounded-full bg-gradient-to-r from-[#1e90ff] to-transparent mb-2.5" />



                        {/* Wheel sizes */}
                        <h3 className="text-[12px] font-semibold text-white/60 uppercase tracking-[0.08em] mb-2.5 shrink-0">Available Wheel Sizes</h3>
                        <div className="flex flex-wrap gap-2 w-full">
                          {activeModelSizes.length > 0 ? (
                            activeModelSizes.map(size => {
                              const isSelectedSize = selectedModel === activeModelName && selectedSize === size;
                              return (
                                <button
                                  key={size}
                                  onClick={() => {
                                    if (selectedModel !== activeModelName) handleModelSelect(activeModelName);
                                    setSelectedSize(size);
                                  }}
                                  className="flex items-center gap-1.5 shrink-0 px-4 py-2 rounded-[10px] text-[11px] font-black tracking-widest transition-all duration-300 border active:scale-[0.96]"
                                  style={isSelectedSize ? {
                                    background: 'linear-gradient(135deg, #1e90ff, #0a6ed4)',
                                    borderColor: 'rgba(96,165,250,0.6)',
                                    color: '#ffffff',
                                    boxShadow: '0 6px 22px rgba(17,133,244,0.5), inset 0 1px 0 rgba(255,255,255,0.15)',
                                    transform: 'scale(1.05)',
                                  } : {
                                    background: 'rgba(255,255,255,0.06)',
                                    backdropFilter: 'blur(8px)',
                                    borderColor: 'rgba(255,255,255,0.12)',
                                    color: 'rgba(255,255,255,0.85)',
                                  }}
                                >
                                  {size}
                                  {isSelectedSize && (
                                    <span
                                      className="material-symbols-outlined text-[12px]"
                                    >check_circle</span>
                                  )}
                                </button>
                              );
                            })
                          ) : (
                            <p className="text-[11px] text-white/40">No sizes found in database</p>
                          )}
                        </div>

                        {/* ── CTA Button: View Available Tyres — only shown once size is selected ── */}
                        {selectedSize && (
                          <div className="mt-5 w-full" style={{ maxWidth: '360px' }}>
                            <button
                              onClick={() => {
                                if (activeModelName && (selectedModel !== activeModelName || !selectedSize)) {
                                  handleModelSelect(activeModelName);
                                }
                                if (selectedModel && selectedSize) setStep(3);
                              }}
                              disabled={!(selectedModel && selectedSize)}
                              className="group relative overflow-hidden w-full flex items-center justify-between px-7 rounded-xl font-black uppercase tracking-widest text-white text-[11px] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.97]"
                              style={{
                                height: '52px',
                                background: 'linear-gradient(to right, #1185f4, #0066d6)',
                                boxShadow: '0 10px 25px rgba(37, 99, 235, 0.35)',
                              }}
                              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 14px 34px rgba(37, 99, 235, 0.38)'; }}
                              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 10px 25px rgba(37, 99, 235, 0.35)'; }}
                            >
                              {/* Shine sweep — outer handles slide, inner handles skew */}
                              <span
                                className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none overflow-hidden"
                              >
                                <span
                                  className="absolute inset-0"
                                  style={{
                                    background: 'linear-gradient(120deg, transparent, rgba(255,255,255,0.32), transparent)',
                                    transform: 'skewX(-20deg)',
                                  }}
                                />
                              </span>
                              <span>View Available Tyres</span>
                              <ArrowRight size={16} strokeWidth={2.5} className="transition-transform duration-300 group-hover:translate-x-1 shrink-0" />
                            </button>

                            {/* Helper text */}
                            <p className="mt-2 text-[12px] text-white/55">
                              See compatible tyres based on selected size
                            </p>
                          </div>
                        )}

                      </div>
                    </div>
                  </div>



                  {/* ══════════════════════════════════════════════════
                      CAR TYPE FILTER TABS — premium spacious pill group
                  ══════════════════════════════════════════════════ */}
                  <div
                    className="mt-8 mb-7"
                  >
                    <div className="w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] px-px">
                      <div className="inline-flex items-center gap-1 bg-white border border-slate-100 rounded-2xl p-1.5 shadow-[0_8px_24px_rgba(15,23,42,0.06)] min-w-max">
                        {carTypeFilters.map((filter) => {
                          const isActive = activeCarTypeFilter === filter;
                          const label = filter === 'ALL' ? 'All Types' : filter;
                          return (
                            <button
                              key={filter}
                              onClick={() => setActiveCarTypeFilter(filter)}
                              className={`px-6 py-3 text-[13px] font-black whitespace-nowrap shrink-0 rounded-xl min-w-[110px] transition-all duration-300 ${isActive
                                ? 'bg-[#1185f4] text-white shadow-[0_8px_20px_rgba(17,133,244,0.25)]'
                                : 'text-slate-500 hover:text-[#1185f4] hover:bg-blue-50'
                                }`}
                            >
                              {label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* ══════════════════════════════════════════════════
                      CATEGORY-GROUPED MODEL GRIDS
                  ══════════════════════════════════════════════════ */}
                  <div className="flex flex-col gap-10 w-full">
                    {sortedCategories.map((cat, catIdx) => {
                      const isVisible = activeCarTypeFilter === 'ALL' || activeCarTypeFilter === cat;
                      if (!isVisible) return null;
                      const items = modelsByCategory[cat] || [];
                      return (
                        <div
                          key={cat}
                          className="flex flex-col"
                        >
                          {/* Category header — text only, no icon */}
                          <div className="flex items-center gap-4 mb-5">
                            <div className="flex items-center gap-2 shrink-0">
                              <h3 className="text-[15px] font-black text-[#0a1929] tracking-tight">{cat}</h3>
                              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 rounded-full px-2 py-0.5">{items.length}</span>
                            </div>
                            <div className="flex-1 h-px bg-slate-200/70" />
                          </div>

                          {/* Cards grid */}
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
                            {items.map((item, itemIdx) => {
                              const isSelected = selectedModel === item.name;
                              return (
                                <div
                                  key={item.name}
                                  onClick={() => handleModelSelect(item.name)}
                                  className={`relative cursor-pointer rounded-[18px] border flex flex-col group overflow-hidden transition-all duration-300 ${isSelected
                                    ? 'border-[#1185f4] shadow-md xl:shadow-[0_14px_36px_rgba(17,133,244,0.22)] -translate-y-1'
                                    : 'border-transparent shadow-sm xl:shadow-[0_8px_24px_rgba(15,23,42,0.04)] [@media(hover:hover)_and_(pointer:fine)]:hover:shadow-[0_14px_34px_rgba(15,23,42,0.08)] [@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-1'
                                    }`}
                                  style={isSelected ? { background: 'linear-gradient(to bottom, #ffffff, #f8fbff)' } : { background: '#ffffff' }}
                                >
                                  {/* Selected check badge */}
                                  {isSelected && (
                                    <div
                                      className="absolute top-3 right-3 w-[22px] h-[22px] rounded-full bg-[#1185f4] text-white flex items-center justify-center z-20 shadow-[0_4px_10px_rgba(17,133,244,0.4)]"
                                    >
                                      <span className="material-symbols-outlined text-[13px]">check</span>
                                    </div>
                                  )}

                                  {/* Car image area — premium showroom background */}
                                  <div className="relative flex items-center justify-center h-[116px] px-3 pt-5 pb-2 overflow-hidden">
                                    {/* 1. Blue-white radial gradient base */}
                                    <div
                                      className="absolute inset-0 pointer-events-none"
                                      style={{
                                        background: `
radial-gradient(circle at 30% 50%, rgba(59,130,246,0.35), transparent 40%),
radial-gradient(circle at 70% 30%, rgba(96,165,250,0.25), transparent 45%),
linear-gradient(135deg, #020617 0%, #020617 30%, #0a2540 70%, #020617 100%)
`
                                      }}
                                    />
                                    {/* 2. Blue dot texture */}
                                    <div
                                      className="absolute inset-0 pointer-events-none opacity-[0.35]"
                                      style={{
                                        backgroundImage: 'radial-gradient(rgba(17,133,244,0.10) 1px, transparent 1px)',
                                        backgroundSize: '8px 8px',
                                      }}
                                    />
                                    {/* 3. Soft blue glow centred behind car */}
                                    <div className="absolute inset-x-[18%] top-[15%] bottom-[20%] bg-[#1185f4]/[0.10] blur-[22px] rounded-full pointer-events-none z-0" />
                                    {/* 4. Floor shadow */}
                                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[68%] h-3 bg-black/[0.08] blur-xl rounded-full pointer-events-none z-0" />
                                    <img
                                      src={`/cars/${item.name.toLowerCase().replace(/\s+/g, '-')}.webp`}
                                      onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = `/cars/${item.name.toLowerCase().replace(/\s+/g, '-')}.jpg`;
                                      }}
                                      alt={item.name}
                                      className={`max-w-full max-h-[88px] w-auto object-contain relative z-10 transition-transform duration-500 ease-out ${isSelected ? 'scale-[1.08]' : '[@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-[1.10]'}`}
                                    />
                                  </div>

                                  {/* Text area */}
                                  <div className="px-4 py-3 flex flex-col justify-center">
                                    <h4
                                      className="text-[16px] font-black tracking-[0.02em] truncate leading-none"
                                      style={{ color: isSelected ? '#1185f4' : '#0f172a' }}
                                    >
                                      {item.name}
                                    </h4>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* ── Trust Strip — in-flow, appears at end of page ── */}
                  <div
                    className="w-full mt-14 mb-6"
                  >
                    <div className="bg-white rounded-[22px] border border-slate-100 shadow-[0_10px_30px_rgba(15,23,42,0.07)] px-5 sm:px-8 py-5">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {[
                          { icon: 'verified_user', title: '100% Genuine', sub: `${selectedBrand} Approved Tyres` },
                          { icon: 'verified', title: 'Best Price Guaranteed', sub: 'On all premium brands' },
                          { icon: 'handyman', title: 'Free Installation', sub: '& Wheel Balancing' },
                          { icon: 'support_agent', title: 'Best Experts Support', sub: 'Always available for you' },
                        ].map(item => (
                          <div key={item.title} className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                              <span className="material-symbols-outlined text-[18px] text-[#1185f4]">{item.icon}</span>
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-[12px] font-black text-slate-700 leading-snug truncate">{item.title}</span>
                              <span className="text-[11px] text-slate-400 font-medium leading-snug truncate">{item.sub}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>



                </div>
              </main>




            </>
          );
        })()}




        {step === 3 && (
          <main
            key="step3"
            className="xl:ml-[240px] 2xl:ml-[260px] flex flex-col xl:flex-row flex-1 h-full overflow-hidden bg-[#f0f4f8] relative pt-[52px] xl:pt-0 animate-[fadeInFast_0.12s_ease-out]"
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
                {compareList.length > 0 && (() => {
                  const firstBrand = compareList[0].TyreBrand || compareList[0].Brand;
                  const allSameBrand = compareList.every(t => (t.TyreBrand || t.Brand) === firstBrand);
                  const compareTheme = allSameBrand ? getBrandTheme(firstBrand) : { primary: '#0f172a', secondary: '#1e293b' };

                  return (
                    <motion.div
                      initial={{ y: 80, opacity: 0, scale: 0.95 }}
                      animate={{ y: 0, opacity: 1, scale: 1 }}
                      exit={{ y: 80, opacity: 0, scale: 0.95 }}
                      transition={{ type: 'spring', damping: 24, stiffness: 260 }}
                      className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-[70] bg-white/95 sm:bg-white/85 backdrop-blur-xl text-[#0f172a] shadow-[0_12px_48px_rgba(0,37,77,0.18)] border border-white/60 rounded-2xl p-3 sm:p-3 flex flex-col sm:flex-row items-center gap-3 w-[calc(100vw-1rem)] max-w-[720px] md:max-w-fit"
                      style={{ boxShadow: `0 12px 48px ${compareTheme.primary}40, 0 0 0 1px rgba(255,255,255,0.6) inset` }}
                    >
                      <div className="flex w-full sm:w-auto items-center justify-between sm:justify-start gap-3 sm:gap-4 sm:flex-1 sm:pl-2">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-inner relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${compareTheme.primary}15, ${compareTheme.primary}05)` }}>
                            <div className="absolute inset-0 opacity-20" style={{ background: `linear-gradient(135deg, ${compareTheme.primary}, transparent)` }}></div>
                            <span className="material-symbols-outlined text-[20px] relative z-10" style={{ color: compareTheme.primary }}>balance</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-black text-[12px] uppercase tracking-widest">{compareList.length} Tyre{compareList.length > 1 ? 's' : ''} Selected</span>
                            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Select up to 3</span>
                          </div>
                        </div>

                        <button
                          onClick={() => { setCompareList([]); setIsCompareOpen(false); }}
                          className="sm:hidden w-[28px] h-[28px] rounded-full bg-slate-50 hover:bg-[#eef2f7] flex items-center justify-center text-[#64748b] hover:text-[#0f172a] transition-all duration-200 ease-out shadow-sm active:scale-95 shrink-0"
                        >
                          <span className="material-symbols-outlined text-[16px]">close</span>
                        </button>
                      </div>

                      <div className="flex w-full sm:w-auto items-center gap-2 sm:gap-3 sm:pl-4">
                        <button
                          onClick={() => setIsCompareOpen(true)}
                          className="w-full sm:w-auto active:scale-[0.96] text-white px-6 py-3.5 sm:py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all shadow-lg hover:shadow-xl shrink-0 flex items-center gap-2 justify-center relative overflow-hidden group/btn"
                          style={{ background: `linear-gradient(135deg, ${compareTheme.primary}, ${compareTheme.secondary})`, boxShadow: `0 6px 20px ${compareTheme.primary}60` }}
                        >
                          <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover/btn:translate-y-0 transition-transform duration-300 ease-out rounded-[inherit] pointer-events-none"></div>
                          <span className="relative z-10 transition-transform group-active/btn:scale-95">Compare Now</span>
                          <span className="material-symbols-outlined text-[16px] relative z-10 transition-transform group-hover/btn:translate-x-0.5 ease-out">arrow_forward</span>
                        </button>

                        <button
                          onClick={() => { setCompareList([]); setIsCompareOpen(false); }}
                          className="hidden sm:flex w-[36px] h-[36px] rounded-full bg-slate-50 hover:bg-[#eef2f7] items-center justify-center text-[#64748b] hover:text-[#0f172a] transition-all duration-200 ease-out shadow-sm border border-slate-200/50 active:scale-[0.96] shrink-0"
                        >
                          <span className="material-symbols-outlined text-[18px]">close</span>
                        </button>
                      </div>
                    </motion.div>
                  );
                })()}
              </AnimatePresence>

              <div className="px-4 sm:px-6 md:px-8 xl:px-12 py-4 sm:py-5 md:py-6 pb-24 xl:pb-8 relative">
                {displayedTyres.length > 0 ? (
                  <>
                    <h3 className="text-[11px] sm:text-xs font-bold text-slate-400 mb-3 sm:mb-4 px-1 uppercase tracking-widest">Top picks for your {selectedBrand} {selectedModel}</h3>
                    <div className={`grid gap-4 md:gap-5 ${selectedTyre ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3'}`}>
                      {displayedTyres.map((tyre, index) => {
                        const isSelected = selectedTyre?.ModelID === tyre.ModelID;
                        const theme = getBrandTheme(tyre.TyreBrand || tyre.Brand);

                        let smartBadge = null;
                        if (tyre.PromoBadge) {
                          const pb = tyre.PromoBadge.toString().toLowerCase();
                          if (pb.includes('sale') || pb.includes('offer') || pb.includes('clearance')) {
                            smartBadge = { label: tyre.PromoBadge, icon: 'sell', color: 'bg-red-500 text-white shadow-sm' };
                          } else if (pb.includes('popular') || pb.includes('recommend')) {
                            smartBadge = { label: tyre.PromoBadge, icon: 'local_fire_department', color: 'bg-[#00254d] text-white shadow-sm' };
                          } else {
                            smartBadge = { label: tyre.PromoBadge, icon: 'stars', color: 'bg-slate-700 text-white shadow-sm' };
                          }
                        }
                        return (
                          <div
                            key={index}
                            onClick={() => setSelectedTyre(selectedTyre?.ModelID === tyre.ModelID ? null : tyre)}
                            style={{
                              '--brand-primary': theme.primary,
                              '--brand-secondary': theme.secondary,
                            }}
                            className={`cursor-pointer flex flex-col group overflow-hidden transition-all duration-300 text-left w-full relative active:scale-[0.98] bg-white rounded-2xl min-h-[220px] ${isSelected
                              ? 'ring-2 ring-[var(--brand-primary)] ring-offset-2 shadow-[0_4px_24px_rgba(0,0,0,0.12)] -translate-y-0.5'
                              : 'shadow-sm xl:shadow-[0_4px_16px_rgba(15,23,42,0.04)] [@media(hover:hover)_and_(pointer:fine)]:hover:shadow-[0_12px_32px_rgba(15,23,42,0.08)] [@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-1'
                              }`}
                          >

                            {/* Background Shapes */}
                            <div className="absolute top-0 right-0 bottom-0 w-[60%] sm:w-[55%] pointer-events-none overflow-hidden rounded-r-2xl z-0">
                              {/* Secondary Accent Gradient */}
                              {theme.accent && (
                                <div
                                  className="absolute top-[-20%] right-[-10%] w-[80%] h-[70%] transition-transform duration-700 ease-out group-hover:scale-[1.15] opacity-60 z-0"
                                  style={{
                                    background: `radial-gradient(ellipse at top right, ${theme.accent}, transparent 60%)`,
                                    filter: 'blur(12px)'
                                  }}
                                ></div>
                              )}

                              <div className="absolute inset-0 transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.03]">
                                {/* Base Primary Arc */}
                                <div
                                  className="absolute top-[-10%] right-[-15%] w-[110%] h-[120%] shadow-[-6px_0_20px_rgba(0,0,0,0.12)] z-0"
                                  style={{
                                    background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                                    borderRadius: '50% 0 0 50% / 50% 0 0 50%',
                                  }}
                                >
                                  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent rounded-[inherit]"></div>
                                </div>
                              </div>
                            </div>

                            {/* Decorative Strips Container (Unclipped, Layered Above Base) */}
                            <div className="absolute top-0 right-0 bottom-0 w-[60%] sm:w-[55%] pointer-events-none rounded-r-2xl z-[1]">
                              <div className="absolute inset-0 transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.03]">
                                {/* Outer Stripe (Secondary e.g. Red) */}
                                <div
                                  className="absolute top-[-15%] right-[-15%] w-[110%] h-[130%] border-l-[3px] border-y-transparent border-r-transparent opacity-95 shadow-[-4px_0_12px_rgba(0,0,0,0.06)]"
                                  style={{
                                    borderColor: theme.stripeSecondary,
                                    borderRadius: '50% 0 0 50% / 50% 0 0 50%',
                                    transform: 'translateX(-22px)',
                                  }}
                                />

                                {/* Inner Stripe (Primary e.g. White) */}
                                <div
                                  className="absolute top-[-15%] right-[-15%] w-[110%] h-[130%] border-l-[3px] border-y-transparent border-r-transparent opacity-100 shadow-[-2px_0_8px_rgba(0,0,0,0.06)] z-10"
                                  style={{
                                    borderColor: theme.stripePrimary,
                                    borderRadius: '50% 0 0 50% / 50% 0 0 50%',
                                    transform: 'translateX(-11px)',
                                  }}
                                />
                              </div>
                            </div>

                            {/* Content Array */}
                            <div className="relative z-10 p-4 flex flex-col h-full w-full pointer-events-none">

                              {/* Top Left: Badges */}
                              <div className="flex flex-col items-start gap-1.5 relative z-20">
                                {smartBadge && (
                                  <span className={`${smartBadge.color} text-[8px] sm:text-[9px] px-2 py-0.5 font-bold rounded-[4px] uppercase tracking-widest flex items-center gap-1 shadow-sm`}>
                                    <span className="material-symbols-outlined text-[10px]">{smartBadge.icon}</span>
                                    {smartBadge.label}
                                  </span>
                                )}
                                {tyre.Warranty && (
                                  <span className="text-[8px] sm:text-[9px] px-2 py-0.5 font-extrabold rounded-[4px] uppercase tracking-widest shadow-sm ring-1 ring-inset"
                                    style={{ backgroundColor: `${theme.primary}10`, color: theme.primary, ringColor: `${theme.primary}40` }}>
                                    {tyre.Warranty} WARRANTY
                                  </span>
                                )}
                                {tyre.BestFor && (
                                  <span className="text-[8px] sm:text-[9px] px-2 py-0.5 font-extrabold rounded-[4px] uppercase tracking-widest shadow-sm ring-1 ring-inset"
                                    style={{ backgroundColor: `${theme.secondary}10`, color: theme.secondary, ringColor: `${theme.secondary}40` }}>
                                    FOR: {tyre.BestFor}
                                  </span>
                                )}
                              </div>

                              {/* Middle Left: Logo & Model */}
                              <div className="mt-3 max-w-[55%] relative z-20">
                                <TyreBrandLogo
                                  brand={tyre.TyreBrand}
                                  className="mb-2"
                                  imgClassName="h-6 sm:h-8 w-auto object-contain object-left opacity-90 transition-opacity duration-300 [@media(hover:hover)_and_(pointer:fine)]:group-hover:opacity-100 drop-shadow-sm"
                                  textClassName="text-[12px] sm:text-[14px] font-bold uppercase tracking-[0.08em] text-slate-700 mb-1.5 truncate"
                                />
                                <h3 className="text-sm sm:text-base font-black text-[#0f172a] leading-tight line-clamp-3 pr-2 shadow-white/50 drop-shadow-[0_1px_1px_rgba(255,255,255,1)]">
                                  {tyre.TyreModel || tyre.ModelID}
                                </h3>
                              </div>

                              {/* Bottom Left: Price */}
                              <div className="mt-auto pt-4 relative z-20">
                                <p className="text-[7.5px] sm:text-[8px] text-[#64748b] font-extrabold uppercase tracking-widest mb-0.5">Per Tyre</p>
                                <p className="text-lg sm:text-xl font-black text-[var(--brand-primary)] leading-none tracking-tight">
                                  {tyre.Price ? `₹${Number(String(tyre.Price).replace(/[^0-9.]/g, '')).toLocaleString('en-IN')}` : 'POA'}
                                </p>
                              </div>

                              {/* Tyre Image */}
                              <div className="absolute top-[8%] -right-2 sm:-right-4 w-[60%] sm:w-[65%] h-[90%] flex items-center justify-center pointer-events-none">
                                <TyreImage
                                  fileName={tyre.ImageFileName}
                                  alt={tyre.TyreModel || 'Tyre'}
                                  className="w-[85%] sm:w-[90%] h-auto max-h-[160px] object-contain transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-110 [@media(hover:hover)_and_(pointer:fine)]:group-hover:-translate-y-1 relative z-30"
                                  style={{ filter: "drop-shadow(-4px 6px 8px rgba(0,0,0,0.25))" }}
                                />
                              </div>

                              {/* Balance Icon */}
                              {(() => {
                                const isSelected = compareList.some(t => t.ModelID === tyre.ModelID);
                                return (
                                  <button
                                    onClick={(e) => toggleCompare(e, tyre)}
                                    className={`absolute bottom-3 right-3 w-8 h-8 sm:w-9 sm:h-9 rounded-[8px] flex items-center justify-center z-40 transition-all duration-300 active:scale-90 pointer-events-auto group/compare overflow-hidden ${isSelected
                                      ? 'text-white shadow-lg scale-105'
                                      : 'bg-white/95 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-white backdrop-blur-sm shadow-sm xl:shadow-[0_2px_8px_rgba(0,0,0,0.08)]'
                                      }`}
                                    style={isSelected ? {
                                      background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                                      boxShadow: `0 4px 16px ${theme.primary}60, inset 0 0 0 1px rgba(255,255,255,0.4)`
                                    } : { color: theme.primary }}
                                  >
                                    <span className="material-symbols-outlined text-[18px] sm:text-[20px] relative z-10 transition-transform group-active/compare:scale-90">balance</span>
                                    {isSelected && (
                                      <div className="absolute inset-0 bg-white/20 animate-pulse pointer-events-none rounded-[inherit]"></div>
                                    )}
                                  </button>
                                );
                              })()}

                            </div>
                          </div>
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
                    <TyreBrandLogo brand={selectedTyre.TyreBrand} className="mb-1" imgClassName="h-5 sm:h-6 w-auto object-contain object-left opacity-90" textClassName="text-[12px] font-bold uppercase tracking-[0.08em] text-slate-700 mb-1 truncate" />
                    <p className="text-sm font-black text-[#0f172a] truncate line-clamp-1">{selectedTyre.TyreModel || selectedTyre.ModelID}</p>
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
              {selectedTyre && (() => {
                const benefits = getBenefits(selectedTyre);
                return (
                  <motion.aside
                    initial={{ x: '100%', opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: '100%', opacity: 0 }}
                    transition={{ type: 'spring', damping: 28, stiffness: 220 }}
                    className="hidden xl:flex w-full xl:w-[400px] h-auto xl:h-full flex-col relative shrink-0 z-40 bg-white shadow-[-1px_0_0_0_rgba(0,37,77,0.06)] border-l border-slate-100"
                  >
                    <div className="flex flex-col h-full">
                      {/* Image Area */}
                      <div className="relative w-full flex items-center justify-center pt-16 pb-12 overflow-hidden" style={{ minHeight: '300px' }}>
                        <div className="absolute inset-0 z-0 bg-[#ffffff] overflow-hidden">
                          {/* Main colored backdrop fills the area */}
                          <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${selectedSidebarTheme.primary}, ${selectedSidebarTheme.secondary})` }} />

                          {/* Decorative Strips & Content Base Wrapper */}
                          {/* Center at bottom-left corner to sweep naturally upward to top-right */}
                          <div className="absolute top-[105%] left-[-10%] w-0 h-0">
                            {/* Outer Stripe (Primary e.g. White) */}
                            <div className="absolute rounded-[100%] border-[3px] -translate-x-1/2 -translate-y-1/2 opacity-90"
                              style={{ width: '980px', height: '980px', borderColor: selectedSidebarTheme.stripePrimary }} />

                            {/* Middle Stripe (Secondary e.g. Red) */}
                            <div className="absolute rounded-[100%] border-[3px] -translate-x-1/2 -translate-y-1/2 shadow-[0_0_12px_rgba(0,0,0,0.1)]"
                              style={{ width: '956px', height: '956px', borderColor: selectedSidebarTheme.stripeSecondary }} />

                            {/* Inner Solid White Base */}
                            <div className="absolute rounded-[100%] -translate-x-1/2 -translate-y-1/2 shadow-[0_0_40px_rgba(0,0,0,0.15)]"
                              style={{ width: '932px', height: '932px', backgroundColor: '#ffffff' }} />
                          </div>
                        </div>

                        <button
                          onClick={() => setSelectedTyre(null)}
                          className="absolute top-4 right-4 text-white hover:text-slate-100 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full w-9 h-9 flex items-center justify-center transition-all z-50 shadow-sm border border-white/30"
                        >
                          <span className="material-symbols-outlined text-[15px]">close</span>
                        </button>

                        {/* Image Drop Shadow base */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[55%] h-5 bg-[#000]/25 blur-[14px] rounded-[100%] pointer-events-none z-10"></div>

                        <TyreImage
                          fileName={selectedTyre.ImageFileName}
                          alt={selectedTyre.TyreModel || 'Tyre'}
                          className="w-[75%] h-auto max-h-[220px] object-contain relative z-20 transition-transform duration-500 hover:scale-[1.03]"
                          style={{ opacity: 0, animation: 'fadeIn 0.6s ease forwards' }}
                        />
                      </div>

                      <div className="flex-1 overflow-y-auto px-7 py-2 flex flex-col hide-scrollbar">
                        {/* Brand & Model */}
                        <div className="mb-4">
                          <TyreBrandLogo brand={selectedTyre.TyreBrand} className="mb-2" imgClassName="h-6 sm:h-8 w-auto object-contain object-left opacity-90 transition-opacity duration-300 hover:opacity-100" textClassName="text-[12px] sm:text-[14px] font-bold uppercase tracking-[0.08em] text-slate-700 mb-1.5 flex-wrap" />
                          <h1 className="text-[26px] text-[#0f172a] font-black tracking-[-0.02em] leading-tight mb-2">{selectedTyre.TyreModel || selectedTyre.ModelID}</h1>
                          {selectedTyre.BestFor && (
                            <span className="inline-block px-2.5 py-1 text-[9px] font-black uppercase tracking-widest rounded shadow-sm border"
                              style={{ backgroundColor: `${selectedSidebarTheme.primary}10`, color: selectedSidebarTheme.primary, borderColor: `${selectedSidebarTheme.primary}40` }}>
                              FOR: {selectedTyre.BestFor}
                            </span>
                          )}
                        </div>

                        {/* Price */}
                        <div className="mb-6 pt-3 pb-6 border-b border-slate-100">
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-1">Price per tyre</p>
                          <div style={{ color: selectedSidebarTheme.primary }} className="text-3xl font-black tracking-[-0.02em] drop-shadow-sm"><AnimatedPrice price={selectedTyre.Price} /></div>
                        </div>

                        {/* Description */}
                        <p className="text-[13px] text-slate-500 leading-[1.6] mb-8">
                          {selectedTyre.Description || 'Designed to provide optimal grip, enhanced handling, and a comfortable ride — the ideal match for high-performance vehicles.'}
                        </p>

                        {/* Key Benefits */}
                        <h3 className="text-[10px] font-bold text-[#00254d] uppercase tracking-[0.15em] mb-4 flex items-center gap-2">
                          <span className="w-3 h-[2px] bg-[#00254d]/30"></span> Key Benefits
                        </h3>
                        <div className="flex flex-col gap-4 mb-8">
                          {benefits.map((b, i) => (
                            <div key={i} className="flex gap-3.5 items-start">
                              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border"
                                style={{ backgroundColor: `${selectedSidebarTheme.primary}08`, color: selectedSidebarTheme.primary, borderColor: `${selectedSidebarTheme.primary}20` }}>
                                <span className="material-symbols-outlined text-[16px]">{b.icon}</span>
                              </div>
                              <div className="flex flex-col pt-0.5">
                                <p className="text-[12px] font-bold text-[#0f172a] leading-tight mb-0.5">{b.title}</p>
                                <p className="text-[11px] text-slate-500 leading-tight">{b.desc}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Specs */}
                        <h3 className="text-[10px] font-bold text-[#00254d] uppercase tracking-[0.15em] mb-3 flex items-center gap-2">
                          <span className="w-3 h-[2px] bg-[#00254d]/30"></span> Specifications
                        </h3>
                        <div className="flex flex-col mb-4">
                          {selectedTyre.Warranty && (
                            <div className="flex items-center justify-between py-2.5 border-b border-slate-50">
                              <span className="text-[11px] text-slate-500 font-medium">Warranty</span>
                              <span className="text-[10px] text-[#0f172a] font-bold bg-slate-100 border border-slate-200/60 px-2.5 py-1 rounded-md">{selectedTyre.Warranty}</span>
                            </div>
                          )}
                          {selectedTyre.BestFor && (
                            <div className="flex items-center justify-between py-2.5 border-b border-slate-50">
                              <span className="text-[11px] text-slate-500 font-medium">Best For</span>
                              <span className="text-[10px] text-[#0f172a] font-bold bg-slate-100 border border-slate-200/60 px-2.5 py-1 rounded-md">{selectedTyre.BestFor}</span>
                            </div>
                          )}
                          {selectedTyre.SpeedRating && (
                            <div className="flex items-center justify-between py-2.5 border-b border-slate-50">
                              <span className="text-[11px] text-slate-500 font-medium">Speed Rating</span>
                              <span className="text-[10px] text-[#0f172a] font-bold bg-slate-100 border border-slate-200/60 px-2.5 py-1 rounded-md">{selectedTyre.SpeedRating}</span>
                            </div>
                          )}
                          {selectedTyre.LoadIndex && (
                            <div className="flex items-center justify-between py-2.5 border-b border-slate-50">
                              <span className="text-[11px] text-slate-500 font-medium">Load Index</span>
                              <span className="text-[10px] text-[#0f172a] font-bold bg-slate-100 border border-slate-200/60 px-2.5 py-1 rounded-md">{selectedTyre.LoadIndex}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="p-5 bg-white border-t border-slate-100 shrink-0">
                        <button
                          onClick={() => setCheckoutTyre(selectedTyre)}
                          style={{ backgroundColor: selectedSidebarTheme.primary }}
                          className="w-full text-white font-black py-4 rounded-xl text-[12px] tracking-[0.12em] uppercase transition-all duration-200 active:scale-[0.97] flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                        >
                          <span className="material-symbols-outlined text-[16px]">shopping_cart</span>
                          Add {selectedTyre.TyreModel || 'Tyre'} to Cart
                        </button>
                      </div>
                    </div>
                  </motion.aside>
                );
              })()}
            </AnimatePresence>
          </main>
        )}
      </>

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
                {compareList.map((tyre, idx) => {
                  const theme = getBrandTheme(tyre.TyreBrand || tyre.Brand);
                  const benefits = getBenefits(tyre);

                  return (
                    <div key={idx} className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(15,23,42,0.06)] group/ccard border border-slate-100 relative h-full">
                      {/* Top Hero Section */}
                      <div className="relative w-full shrink-0 flex p-5 sm:p-7 min-h-[250px] sm:min-h-[300px]">
                        {/* Background Curves */}
                        <div className="absolute top-0 right-0 bottom-0 w-[60%] sm:w-[55%] pointer-events-none overflow-hidden rounded-tr-2xl z-0">
                          <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover/ccard:scale-[1.03]">
                            <div
                              className="absolute top-[-10%] right-[-15%] w-[110%] h-[120%] shadow-[-8px_0_24px_rgba(0,0,0,0.15)] z-0"
                              style={{
                                background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                                borderRadius: '50% 0 0 50% / 50% 0 0 50%',
                              }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent rounded-[inherit]"></div>
                            </div>
                          </div>
                        </div>

                        {/* Decorative Strips (Unclipped) */}
                        <div className="absolute top-0 right-0 bottom-0 w-[60%] sm:w-[55%] pointer-events-none rounded-tr-2xl z-[1]">
                          <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover/ccard:scale-[1.03]">
                            <div
                              className="absolute top-[-15%] right-[-15%] w-[110%] h-[130%] border-l-[3px] border-y-transparent border-r-transparent opacity-95 shadow-[-4px_0_12px_rgba(0,0,0,0.06)]"
                              style={{ borderColor: theme.stripeSecondary, borderRadius: '50% 0 0 50% / 50% 0 0 50%', transform: 'translateX(-22px)' }}
                            />
                            <div
                              className="absolute top-[-15%] right-[-15%] w-[110%] h-[130%] border-l-[3px] border-y-transparent border-r-transparent opacity-100 shadow-[-2px_0_8px_rgba(0,0,0,0.06)] z-10"
                              style={{ borderColor: theme.stripePrimary, borderRadius: '50% 0 0 50% / 50% 0 0 50%', transform: 'translateX(-11px)' }}
                            />
                          </div>
                        </div>

                        {/* Content Front Layer */}
                        <div className="relative z-10 w-[55%] sm:w-[50%] flex flex-col justify-center">
                          <TyreBrandLogo brand={tyre.TyreBrand || tyre.Brand} className="mb-2" imgClassName="h-6 sm:h-8 w-auto object-contain object-left opacity-90 transition-opacity duration-300 group-hover/ccard:opacity-100" textClassName="text-[12px] sm:text-[14px] font-bold uppercase tracking-[0.08em] text-slate-700 mb-1.5" />
                          <h3 className="text-xl sm:text-2xl font-black text-[#0f172a] uppercase tracking-[-0.02em] leading-tight mb-2 pr-2 drop-shadow-[0_1px_1px_rgba(255,255,255,1)]">{tyre.TyreModel || tyre.ModelID}</h3>
                          <div className="text-2xl sm:text-3xl font-black tracking-tight mb-4 drop-shadow-[0_1px_1px_rgba(255,255,255,1)]" style={{ color: theme.primary }}>
                            {tyre.Price ? `₹${Number(String(tyre.Price).replace(/[^0-9.]/g, '')).toLocaleString('en-IN')}` : 'POA'}
                          </div>

                          <div className="flex flex-col gap-2.5 mt-auto">
                            {tyre.Warranty && (
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-widest">Warranty</span>
                                <span className="text-[9px] sm:text-[10px] font-black uppercase text-[#0f172a] border border-[#0f172a]/10 px-1.5 py-0.5 rounded bg-[#0f172a]/[0.02] inline-block w-fit">{tyre.Warranty}</span>
                              </div>
                            )}
                            {tyre.BestFor && (
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-widest">Best For</span>
                                <span className="text-[9px] sm:text-[10px] font-black uppercase inline-block w-fit" style={{ color: theme.primary, backgroundColor: `${theme.primary}10`, border: `1px solid ${theme.primary}30`, padding: '2px 6px', borderRadius: '4px' }}>{tyre.BestFor}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Tyre Image Right Side */}
                        <div className="absolute top-[10%] sm:top-1/2 -right-2 sm:-right-4 sm:-translate-y-1/2 w-[60%] sm:w-[65%] h-[80%] sm:h-[90%] flex items-center justify-center pointer-events-none z-[30]">
                          <TyreImage
                            fileName={tyre.ImageFileName}
                            alt={tyre.TyreModel || 'Tyre'}
                            className="w-[85%] sm:w-[85%] h-auto max-h-[100%] object-contain transition-transform duration-700 ease-out group-hover/ccard:scale-110 group-hover/ccard:-translate-y-1 relative z-30"
                            style={{ filter: "drop-shadow(-8px 12px 16px rgba(0,0,0,0.35))" }}
                          />
                        </div>
                      </div>

                      {/* Bottom Details Section */}
                      <div className="relative z-20 flex-1 bg-[#ffffff] p-5 sm:p-7 pt-0 flex flex-col">
                        {tyre.Description && (
                          <p className="mb-4 text-[11px] sm:text-[12px] text-slate-500 leading-relaxed line-clamp-3">{tyre.Description}</p>
                        )}

                        <div className="flex items-center gap-3 mb-4 mt-2">
                          <span className="h-[2px] w-6" style={{ backgroundColor: theme.primary, opacity: 0.3 }}></span>
                          <span className="text-[10px] text-[#0f172a] font-bold uppercase tracking-widest">Key Benefits</span>
                        </div>

                        <div className="flex flex-col gap-3.5 flex-1 pr-2">
                          {benefits.slice(0, 4).map((b, i) => (
                            <div key={i} className="flex gap-3 items-start relative z-10 w-full overflow-hidden">
                              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center shrink-0 border"
                                style={{ backgroundColor: `${theme.primary}08`, color: theme.primary, borderColor: `${theme.primary}20` }}>
                                <span className="material-symbols-outlined text-[13px] sm:text-[14px]">{b.icon}</span>
                              </div>
                              <div className="flex flex-col flex-1 min-w-0">
                                <p className="text-[11px] sm:text-[12px] font-bold text-[#0f172a] leading-tight mb-0.5 truncate">{b.title}</p>
                                <p className="text-[10px] sm:text-[11px] text-slate-500 leading-snug line-clamp-2">{b.desc}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-6 pt-5 border-t border-slate-100">
                          <button
                            onClick={(e) => { e.stopPropagation(); setCheckoutTyre(tyre); setIsCompareOpen(false); }}
                            className="relative overflow-hidden group w-full text-white font-black py-3.5 sm:py-4 rounded-xl text-[11px] sm:text-[12px] tracking-[0.12em] uppercase transition-all shadow-[0_4px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.22)] active:scale-[0.97] flex items-center justify-center gap-2"
                            style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
                          >
                            <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-out rounded-[inherit] pointer-events-none"></div>
                            <span className="material-symbols-outlined text-[16px] sm:text-[18px] relative z-10 transition-transform group-hover:-translate-y-0.5 ease-out">shopping_cart</span>
                            <span className="relative z-10 transition-transform group-hover:-translate-y-0.5 ease-out delay-75">Add to Cart</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
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
