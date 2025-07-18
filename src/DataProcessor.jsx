import React, { useState, useRef, useEffect } from 'react';
import { FileUp, CheckLine, Download, Loader2, RotateCcw, ChevronDown, Moon } from 'lucide-react';
import Lottie from 'react-lottie';
import downloadAnimation from './assets/lottie-icon/download-icon.json'; 
import Select from 'react-select';
import { themeColors } from './styles/themeColors.js';
import { components } from 'react-select';
import { validateCSVFile } from './lib/validateCSVFile';
import { processAndDownload } from './lib/processAndDownload';
import { showToast } from './lib/toastUtils';
import ToggleSwitch from "./lib/ToggleSwitch";
import { toast } from 'sonner';
import './index.css';

export default function DataProcessor() {
  const options = [
    { value: 'bulk_full_ip', label: 'Bulk Registration Full IP' },
    { value: 'bulk_prefix_ip', label: 'Bulk Registration Prefix IP' },
    { value: 'bulk_mp1', label: 'Bulk Registration MP1' },
  ];

  const [selectedCode, setSelectedCode] = useState(null);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState(null);
  const [dark, setDark] = useState(false);
  const fileInputRef = useRef(null);
  const selectRef = useRef(null); 
  const isProcessingRef = useRef(false);
  
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [dark]);
    

  const DropdownIndicator = (props) => {
    const { selectProps } = props;
    return (
      <components.DropdownIndicator {...props}>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transform transition-transform duration-500 ease-in-out origin-center ${
            selectProps.menuIsOpen ? 'rotate-180' : 'rotate-0'
          }`}
        />
      </components.DropdownIndicator>
    );
  };

  const validateAndSetFile = (selected) => {
    const { isValid, message } = validateCSVFile(selected);
    if (!isValid) {
      showToast('warning',message);
      return;
    }
    setFile(selected);
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) validateAndSetFile(selected);
  };

    // ✅ Drag and drop handlers
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) validateAndSetFile(droppedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDownload = async () => {
  if (isProcessingRef.current || isLoading || !selectedCode || !file) return;
  isProcessingRef.current = true;
  setIsLoading(true);
  try {
    await processAndDownload({ file, code: selectedCode.value });
    showToast('success','Download Success!');
  } catch (err) {
    const message = err?.message || "Terjadi kesalahan tak diketahui.";

    if (
      message.includes("Processor") ||
      message.includes("Gagal membaca") ||
      message.includes("File tidak memiliki kolom") ||
      message.includes("tidak dikenali")
    ) {
      setErrorModalMessage(message);
    } else {
        showToast('error',message);
    }
  } finally {
    isProcessingRef.current = false;
    setIsLoading(false);
  }
};

  const handleReset = () => {
    if (isResetDisabled) return;

    setFile(null);
    setSelectedCode(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    if (selectRef.current) {
      selectRef.current.clearValue();
    }
  };

const customStyles = (dark) => ({
  control: (base) => ({
    ...base,
    borderColor: 
    isLoading 
    ? dark ? themeColors.dark.border : themeColors.light.border
    : dark ? themeColors.dark.border : themeColors.light.border,
    backgroundColor: 
    isLoading 
    ? dark ? themeColors.dark.boxColumn.default : themeColors.light.boxColumn.muted
    : dark ? themeColors.dark.boxColumn.default : themeColors.light.boxColumn.default,
    borderWidth: '2px',
    boxShadow: 'none',
    height: 50,
    borderRadius: '0.5rem',
    cursor: isLoading ? 'not-allowed' : 'pointer',
    opacity: isLoading ? 0.6 : 1,
    '&:hover': {
      borderColor: dark ? themeColors.dark.primary : themeColors.light.primary,
    },
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: 
      state.isSelected
      ? dark ? themeColors.light.primary : themeColors.light.primary
      : 'transparent',
    color: 
      state.isSelected
        ? dark
          ? themeColors.dark.text.default
          : themeColors.light.text.primary
        : dark
          ? themeColors.dark.text.default
          : themeColors.light.text.default,
    transition: 'background-color 150ms ease',
    cursor: 'pointer',
    padding: '8px 12px',
    '&:hover': {
      backgroundColor: 
        state.isSelected
          ? dark
            ? themeColors.light.primary
            : themeColors.light.primary
          : dark
            ? themeColors.dark.secondary
            : themeColors.light.secondary,
      color:
        state.isSelected
          ? dark
            ? themeColors.dark.text.default
            : themeColors.light.text.primary
          : dark
            ? themeColors.dark.card
            : themeColors.light.text.default,
    },
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: dark ? themeColors.dark.boxColumn.default : themeColors.light.boxColumn.default,
    color: dark ? themeColors.dark.text.default : themeColors.light.text.default,
    borderColor: dark ? themeColors.dark.border : themeColors.light.border,
    borderWidth: '2px',
    borderRadius: '0.5rem',
    boxShadow: 'none', 
  }),
  placeholder: (base) => ({
    ...base,
    color: dark ? themeColors.dark.text.placeholder : themeColors.light.text.placeholder,
  }),
  singleValue: (base) => ({
    ...base,
    color: dark ? themeColors.dark.text.default : themeColors.light.text.default,
  }),

  indicatorSeparator: (base) => ({
    ...base,
    backgroundColor: dark ? themeColors.dark.border : themeColors.light.border,
    width: '1px', // Tentukan ketebalan garis
  }),

  dropdownIndicator: (base) => ({
    ...base,
    color: dark ? themeColors.dark.border : themeColors.light.border,
  }),
});

  const isDownloadDisabled = !selectedCode || !file;
  const isResetDisabled = (!selectedCode && !file) || isLoading;

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-8 py-12 
      ${dark ? 'bg-themeColors-dark-base' : 'bg-themeColors-light-base'}`}>
      <div className={`max-w-6xl w-full mx-auto px-10 py-10 rounded-3xl shadow-md border-2 
        ${dark ? 'border-themeColors-dark-border bg-themeColors-dark-card' : 'border-themeColors-light-border bg-themeColors-light-card'}`}>
        <h1 className={`text-[clamp(1.5rem,_5vw,_2rem)] font-bold text-center mb-6 ${dark ? 'text-themeColors-dark-text-default' : 'text-themeColors-light-text-default'}`}>
          Data Processor
        </h1>
          
        <div className="mb-5">
          <div className={`mb-3 ${dark ? "bg-themeColors-dark-card" : "bg-themeColors-light-card"}`}>
            <header className="flex">
              <ToggleSwitch checked={dark} onChange={setDark} />
            </header>
          </div>

          <h2 className={`text-[clamp(1.2rem,_4vw,_1.5rem)] font-bold mb-1 ${dark ? 'text-themeColors-dark-text-default' : 'text-themeColors-light-text-default'}`}>
            Select Code
          </h2>

          <Select
            ref={selectRef}
            options={options}
            styles={customStyles(dark)}
            placeholder="Select Code"
            value={selectedCode}
            isDisabled={isLoading}
            isSearchable={false}
            classNamePrefix="react-select"
            className="select-animate"
            components={{ DropdownIndicator }}
            onChange={(selected) => setSelectedCode(selected)}/>
        </div>



        <div className="mb-5">
          <h2 className={`text-[clamp(1.2rem,_4vw,_1.5rem)] font-bold mb-1 ${dark ? 'text-themeColors-dark-text-default' : 'text-themeColors-light-text-default'}`}>
            Upload File
          </h2>

          <div 
            className={`group w-full h-[12rem] flex items-center justify-center cursor-pointer border-2 border-dashed rounded-lg transition-colors duration-150
            ${
              isDragging
                ? dark
                  ? 'border-themeColors-dark-primary bg-themeColors-dark-boxColumn-default drag-active' // dark mode dragging
                  : 'border-themeColors-light-primary bg-themeColors-light-secondary drag-active' // light mode dragging
                : isLoading
                ? dark
                  ? 'opacity-60 pointer-events-none bg-themeColors-dark-boxColumn-default border-themeColors-dark-border' // dark mode loading
                  : 'opacity-60 pointer-events-none bg-themeColors-light-boxColumn-muted border-themeColors-light-border' // light mode loading
                : dark
                ? 'border-themeColors-dark-border bg-themeColors-dark-boxColumn-default hover:border-themeColors-dark-primary' // dark idle
                : 'border-themeColors-light-border bg-themeColors-light-boxColumn-default hover:border-themeColors-light-primary hover:bg-themeColors-light-secondary' // light idle
            }
            `}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => document.getElementById('file-upload').click()}>
            <label htmlFor="file-upload" className="sr-only">
              Upload CSV File
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
              disabled={isLoading}
            />
            <div className={`flex flex-col items-center justify-center transition-colors duration-150
              ${dark ? 'text-themeColors-dark-text-placeholder group-hover:text-themeColors-dark-primary' : 'text-themeColors-light-text-placeholder group-hover:text-themeColors-light-primary'}`}>
              <FileUp className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 mb-2 opacity-60" />
              <p className="mb-2 text-[clamp(0.5rem,_4vw,_1rem)] opacity-60">
                <span className="font-bold">Click or drag and drop</span> to upload
              </p>
              <p className="mb-2 text-[clamp(0.5rem,_4vw,_1rem)] opacity-60">
                CSV File
              </p>
            </div>
          </div>

          {file && (
            <div className={`mt-2 text-[clamp(0.5rem,_3vw,_1rem)] rounded-lg px-4 py-2 file-uploaded shadow-md border-2 ${dark 
            ? 'border-themeColors-dark-primary text-themeColors-dark-text-default bg-themeColors-dark-card' 
            : 'border-themeColors-light-uploaded-border text-themeColors-light-text-default bg-themeColors-light-uploaded-bg'}`}>
              <div className="font-semibold mb-1">🔗 File Uploaded:</div>
              <div>
                <span className="block"><strong>Name:</strong> {file.name}</span>
                <span className="block"><strong>Size:</strong> {(file.size / 1024).toFixed(1)} KB</span>
                <span className="block"><strong>Type:</strong> {file.type || "Unknown"}</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-4 mt-4 flex-wrap">
          <button
            onClick={handleDownload}
            disabled={isLoading}
            className={`flex-1 sm:w-2/3 md:w-2/3 lg:w-7/10 flex items-center justify-center gap-1 px-6 py-2 rounded-xl text-sm sm:text-base md:text-lg lg:text-xl transition duration-150 ease-in-out focus:outline-none active:scale-[0.98] active:translate-y-[1px] border-2
              ${
                isDownloadDisabled || isLoading
                ? dark 
                  ? 'opacity-60 bg-themeColors-dark-boxColumn-default border-themeColors-dark-border text-themeColors-dark-text-placeholder cursor-not-allowed pointer-events-none' 
                  : 'bg-themeColors-light-boxColumn-muted border-themeColors-light-border text-themeColors-light-text-muted cursor-not-allowed pointer-events-none opacity-60'
                : dark 
                    ? 'bg-themeColors-dark-primary text-themeColors-dark-text-default hover:bg-themeColors-dark-boxColumn-hover border-none shadow-md hover:shadow-lg' 
                    : 'bg-themeColors-light-primary text-themeColors-light-card hover:bg-themeColors-light-boxColumn-hover border-none shadow-md hover:shadow-lg'
              }`} >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" />
                <span>Download</span>
              </>
            )}
          </button>
          <button 
            className={`group sm:w-1/3 md:w-1/3 lg:w-3/10 w-full flex items-center justify-center gap-1 text-sm sm:text-base md:text-lg lg:text-xl px-6 py-2 rounded-xl transition duration-150 ease-in-out active:scale-[0.98] active:translate-y-[1px] border-2
              ${isResetDisabled 
                ? dark 
                  ? "opacity-60 bg-themeColors-dark-boxColumn-default border-themeColors-dark-border text-themeColors-dark-text-placeholder cursor-not-allowed pointer-events-none"
                  : "bg-themeColors-light-boxColumn-muted border-themeColors-light-border text-themeColors-light-text-muted cursor-not-allowed pointer-events-none opacity-60"
                : dark 
                  ? "bg-themeColors-light-boxColumn-default text-themeColors-light-text-default border-themeColors-light-border hover:border-themeColors-dark-primary hover:text-themeColors-light-primary shadow-md hover:shadow-lg"
                  : "bg-themeColors-light-boxColumn-default text-themeColors-light-text-default border-themeColors-light-border hover:border-themeColors-light-primary hover:text-themeColors-light-primary shadow-md hover:shadow-lg"}
            `}
            onClick={handleReset}
            disabled={isResetDisabled}>
            <RotateCcw className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 group-hover:rotate-[-180deg] transition-transform duration-500" />
            Reset
          </button>
        </div>

        {errorModalMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
            <div className={`
              w-full max-w-[70vw] sm:max-w-md rounded-2xl shadow-xl 
              px-4 py-4 sm:px-6 sm:py-6 text-center border-2
              ${dark 
                ? 'bg-themeColors-dark-card border-themeColors-dark-border text-themeColors-dark-text-default' 
                : 'bg-themeColors-light-card border-themeColors-light-border text-themeColors-light-text-default'
              }`
            }>
              <h2 className="text-[clamp(1rem,4vw,1.5rem)] font-bold text-red-500 mb-2">
                Error
              </h2>
              <p className={`mb-4 text-[clamp(0.875rem,3vw,1rem)] ${dark ? 'text-themeColors-dark-text-default' : 'text-gray-700'}`}>
                {errorModalMessage}
              </p>
              <button
                onClick={() => setErrorModalMessage(null)}
                className={`
                  px-6 py-2 rounded-lg font-semibold transition duration-200
                  text-[clamp(0.875rem,2.5vw,1rem)] 
                  ${dark 
                    ? 'bg-themeColors-dark-primary text-themeColors-dark-text-default hover:bg-themeColors-dark-boxColumn-hover border-none shadow-md hover:shadow-lg' 
                    : 'bg-themeColors-light-primary text-themeColors-light-card hover:bg-themeColors-light-boxColumn-hover border-none shadow-md hover:shadow-lg'
                  }
                `}
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}