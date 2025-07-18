import { toast } from "sonner";

const toastBaseStyle = {
  fontSize: "clamp(10px, 4vw, 18px)",
  padding: "clamp(10px, 2vw, 12px)",
  borderRadius: "12px",
  borderWidth: "2px",
};

const toastVariants = {
  success: {
    borderColor: "#4CAF50",
    backgroundColor: "#dcfce7",
    color: "#4CAF50"
  },
  error: {
    borderColor: "#F44336",
    backgroundColor: "#fef2f2",
    color: "#F44336"
  },
  warning: {
    borderColor: "#d97425",
    backgroundColor: "#fffcf0",
    color: "#d97425"
  }
}

export function showToast(type, message, options = {}) {
  const variantStyle = toastVariants[type] || {};
  const mergedStyle = {
    ...toastBaseStyle,
    ...variantStyle,
    ...options.style,
  };

  const commonOpts = {
    position: options.position || "top-center",
    duration: 3000,
    ...options,
    style: mergedStyle,
  };

  switch (type) {
    case "success":
        toast.success(message, commonOpts);
        break;
    case "error":
        toast.error(message, commonOpts);
        break;
    case "warning":
        toast.warning(message, commonOpts);
        break; 
  }
}

