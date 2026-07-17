'use client';

import React, { useState } from 'react';
import { 
  motion, 
  AnimatePresence 
} from 'motion/react';
import { 
  CreditCard, 
  Building2, 
  Ticket, 
  CheckCircle2, 
  Copy, 
  Check, 
  X,
  Globe,
  ExternalLink,
  Info,
  AlertCircle,
  ArrowRight
} from 'lucide-react';

// Tipos de datos para el historial y bancos
interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountType: { es: string; en: string };
  holder: string;
  rtn: string;
  currency: 'HNL' | 'USD';
}

const BANK_ACCOUNTS: BankAccount[] = [
  {
    id: 'bac-usd',
    bankName: 'BAC Credomatic',
    accountNumber: '7420-1983-102',
    accountType: { es: 'Cuenta Corriente', en: 'Checking Account' },
    holder: 'Roatan Self Storage S. de R.L.',
    rtn: '11019012345678',
    currency: 'USD'
  },
  {
    id: 'atlantida-hnl',
    bankName: 'Banco Atlántida',
    accountNumber: '120-203-4981-99',
    accountType: { es: 'Cuenta de Cheques', en: 'Checking Account' },
    holder: 'Roatan Self Storage S. de R.L.',
    rtn: '11019012345678',
    currency: 'HNL'
  },
  {
    id: 'ficohsa-hnl',
    bankName: 'Banco Ficohsa',
    accountNumber: '001-201-0998-34',
    accountType: { es: 'Cuenta Corriente', en: 'Checking Account' },
    holder: 'Roatan Self Storage S. de R.L.',
    rtn: '11019012345678',
    currency: 'HNL'
  }
];

// Traducciones estructuradas para el idioma
const TRANSLATIONS = {
  es: {
    portalTitle: "Métodos de Pago",
    portalSubtitle: "Seleccione un método para completar el pago de su unidad en",
    portalSubtitleHighlight: "Roatan Self Storage",
    secureConnection: "Portal de Pago Seguro",
    
    // Opciones
    optionCardTitle: "Tarjeta",
    optionCardSub: "Pago instantáneo con Visa o Mastercard",
    optionTransferTitle: "Transferencia",
    optionTransferSub: "Banca en línea ACH directa",
    optionCashTitle: "Pago en Caja",
    optionCashSub: "Acreditación mediante Token físico",

    // Pestaña Tarjeta
    cardTitle: "Pagar con Tarjeta de Crédito / Débito",
    cardSubtitle: "Procesador de pagos seguro y cifrado.",
    cardDesc: "Para su seguridad, procesamos los pagos con tarjeta a través de nuestra pasarela internacional certificada. Haga clic abajo para abrir el carrusel de pagos interactivo de forma segura.",
    cardBtn: "Ir a Pasarela de Tarjetas",

    // Pestaña Transferencia
    transferTitle: "Detalles de Transferencia Bancaria",
    transferSubtitle: "Realice el depósito desde su banca en línea favorita y digite el ID de transacción abajo.",
    transferBtnShow: "Ver Cuentas Bancarias",
    transferBtnHide: "Ocultar Cuentas Bancarias",
    transferLabelType: "Tipo de Cuenta",
    transferLabelAcc: "Número de Cuenta",
    transferLabelBeneficiary: "Beneficiario",
    transferAmountLabel: "Monto del Depósito",
    transferIdLabel: "ID de la Transferencia / Referencia de Pago",
    transferWarning: "Al enviar, nuestro departamento de cobros verificará la transferencia y aplicará el pago a su bodega en un lapso estimado de 15 minutos.",
    transferSubmit: "Registrar Comprobante",
    transferSuccessTitle: "Transferencia Reportada",
    transferSuccessDesc: "Hemos registrado la referencia con éxito. Su bodega estará al día en cuanto el banco confirme los fondos.",
    transferAnother: "Registrar otro depósito",

    // Pestaña Caja
    cashTitle: "Acreditación de Pago en Caja",
    cashDesc: "¿Realizó su pago físicamente en nuestra sucursal de French Harbour? Ingrese el token de caja impreso en su comprobante para actualizar el sistema.",
    cashBtn: "Validar Token de Caja",
    cashDemoTitle: "Tokens autorizados de muestra para pruebas de flujo:",
    cashSuccessTitle: "Token de Caja Validado",
    cashSuccessSubtitle: "Pago Acreditado",
    cashLabelToken: "Código del Token:",
    cashLabelClient: "Cliente de Bodega:",
    cashLabelUnit: "Bodega/Unidad:",
    cashLabelAmount: "Monto Registrado:",
    cashLabelDate: "Fecha de Emisión:",
    cashClear: "Ingresar otro token",

    // Modal
    modalHeader: "Ingresar Token de Caja",
    modalLabel: "Código de Seguridad Token",
    modalPlaceholder: "Ej: ROT-CASH-101",
    modalBtnCancel: "Cerrar",
    modalBtnValidate: "Confirmar Pago",
    modalError: "El token ingresado no es válido. Asegúrese de que inicie con 'ROT-' o contenga mínimo 6 caracteres.",

    // Estados
    processing: "Sincronizando...",
    processingStep1: "Validando autenticidad de token de caja...",
    processingStep2: "Guardando datos de transferencia en su expediente...",

    // Footer
    footerSecured: "Conexión cifrada de extremo a extremo • TLS 1.3",
    footerCreated: "Creado por"
  },
  en: {
    portalTitle: "Payment Methods",
    portalSubtitle: "Select a method to complete the payment for your unit at",
    portalSubtitleHighlight: "Roatan Self Storage",
    secureConnection: "Secure Payment Portal",

    // Opciones
    optionCardTitle: "Card",
    optionCardSub: "Instant payment with Visa or Mastercard",
    optionTransferTitle: "Transfer",
    optionTransferSub: "Direct ACH online banking",
    optionCashTitle: "Cash Desk",
    optionCashSub: "Acreditation via physical Token",

    // Pestaña Tarjeta
    cardTitle: "Pay with Credit or Debit Card",
    cardSubtitle: "Secure and encrypted payment processor.",
    cardDesc: "For your safety, we process card payments through our certified international gateway. Click below to securely open the interactive checkout carousel.",
    cardBtn: "Go to Card Gateway",

    // Pestaña Transferencia
    transferTitle: "Bank Transfer Details",
    transferSubtitle: "Make the deposit from your online banking app and type the transaction ID below.",
    transferBtnShow: "Show Bank Accounts",
    transferBtnHide: "Hide Bank Accounts",
    transferLabelType: "Account Type",
    transferLabelAcc: "Account Number",
    transferLabelBeneficiary: "Beneficiary",
    transferAmountLabel: "Deposited Amount",
    transferIdLabel: "Transfer ID / Payment Reference",
    transferWarning: "Upon submission, our billing department will verify the transfer and apply the payment to your storage unit in approximately 15 minutes.",
    transferSubmit: "Submit Reference",
    transferSuccessTitle: "Transfer Reported",
    transferSuccessDesc: "We have successfully registered the reference. Your unit will be updated as soon as the bank confirms the funds.",
    transferAnother: "Register another deposit",

    // Pestaña Caja
    cashTitle: "Cash Desk Payment Accreditation",
    cashDesc: "Did you pay in cash or card physically at our French Harbour branch? Enter the cashier token printed on your receipt to update the system.",
    cashBtn: "Validate Cashier Token",
    cashDemoTitle: "Authorized sample tokens for flow testing:",
    cashSuccessTitle: "Cashier Token Validated",
    cashSuccessSubtitle: "Payment Applied",
    cashLabelToken: "Token Code:",
    cashLabelClient: "Storage Client:",
    cashLabelUnit: "Storage Unit:",
    cashLabelAmount: "Registered Amount:",
    cashLabelDate: "Issue Date:",
    cashClear: "Enter another token",

    // Modal
    modalHeader: "Enter Cashier Token",
    modalLabel: "Security Token Code",
    modalPlaceholder: "E.g., ROT-CASH-101",
    modalBtnCancel: "Close",
    modalBtnValidate: "Confirm Payment",
    modalError: "The entered token is invalid. Make sure it starts with 'ROT-' or has at least 6 characters.",

    // Estados
    processing: "Synchronizing...",
    processingStep1: "Validating authenticity of cashier token...",
    processingStep2: "Saving bank transfer data to your record...",

    // Footer
    footerSecured: "End-to-end encrypted connection • TLS 1.3",
    footerCreated: "Created by"
  }
};

export default function PaymentPage() {
  const [lang, setLang] = useState<'es' | 'en'>('es');
  const t = TRANSLATIONS[lang];

  // Estado para la pestaña seleccionada
  const [activeMethod, setActiveMethod] = useState<'tarjeta' | 'transferencia' | 'caja'>('tarjeta');
  
  // Estado para notificar copia al portapapeles
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Estados de Transferencia
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [transferId, setTransferId] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferSuccess, setTransferSuccess] = useState(false);

  // Estados de Pago en Caja (Ventanita / Modal para ingresar Token)
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [cajaToken, setCajaToken] = useState('');
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [tokenSuccess, setTokenSuccess] = useState<any | null>(null);

  // Estado general de transacción simulada
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');

  // Función para copiar texto
  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Simular envío de Transferencia Bancaria
  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferId.trim()) return;

    setIsProcessing(true);
    setProcessingStep(t.processingStep2);

    setTimeout(() => {
      setIsProcessing(false);
      setTransferSuccess(true);
    }, 1500);
  };

  // Simular validación de Token de Pago en Caja
  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cajaToken.trim()) {
      setTokenError(lang === 'es' ? 'Por favor ingrese un código.' : 'Please enter a code.');
      return;
    }

    setIsProcessing(true);
    setProcessingStep(t.processingStep1);

    setTimeout(() => {
      const upperToken = cajaToken.trim().toUpperCase();
      if (upperToken.startsWith('ROT-') || upperToken.length >= 6) {
        setIsProcessing(false);
        setTokenError(null);
        setTokenSuccess({
          token: upperToken,
          client: 'Bryan Williams',
          unit: 'Bodega B-45',
          amount: '$125.00 USD',
          date: new Date().toLocaleDateString(lang === 'es' ? 'es-HN' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })
        });
        setShowTokenModal(false);
      } else {
        setIsProcessing(false);
        setTokenError(t.modalError);
      }
    }, 1200);
  };

  // Reiniciar estados del flujo
  const resetFlow = () => {
    setTransferSuccess(false);
    setTransferId('');
    setTransferAmount('');
    setShowBankDetails(false);
    
    setTokenSuccess(null);
    setCajaToken('');
    setTokenError(null);
    setShowTokenModal(false);
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between py-8 px-4 sm:px-6 md:py-12">
      
      {/* Fondo geométrico original con ondas y gradiente diagonal en base a la imagen de referencia */}
      <div className="absolute inset-0 z-0 bg-[#eef5fc] overflow-hidden">
        {/* Banda diagonal superior */}
        <div className="absolute top-0 right-0 w-[60%] h-[120%] bg-gradient-to-l from-[#cfe3fc] via-[#e2eeff] to-[#eef5fc] transform skew-x-12 origin-top-right transition-all duration-1000 opacity-80 pointer-events-none" />
        {/* Banda diagonal inferior */}
        <div className="absolute bottom-0 left-0 w-[40%] h-[70%] bg-gradient-to-tr from-[#daebff] to-[#eef5fc] transform -skew-x-12 origin-bottom-left opacity-60 pointer-events-none" />
        {/* Esferas decorativas */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#2563eb]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#3b82f6]/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-4xl w-full mx-auto flex-grow flex flex-col justify-center">
        
        {/* Selector de idioma minimalista y robusto en la esquina superior derecha */}
        <div className="flex justify-end mb-6">
          <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200/80 flex items-center">
            <Globe className="w-3.5 h-3.5 text-slate-400 mx-2" />
            <button
              onClick={() => setLang('es')}
              className={`px-3 py-1 text-xs font-bold tracking-tight rounded-lg transition-all cursor-pointer ${
                lang === 'es' 
                  ? 'bg-[#1e3a8a] text-white shadow-sm' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              ESPAÑOL
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-3 py-1 text-xs font-bold tracking-tight rounded-lg transition-all cursor-pointer ${
                lang === 'en' 
                  ? 'bg-[#1e3a8a] text-white shadow-sm' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              ENGLISH
            </button>
          </div>
        </div>

        {/* Encabezado sin distracciones, enfocado puramente en la marca y la robustez */}
        <header className="text-center mb-8 flex flex-col items-center">
          <div className="w-40 h-40 mb-4 transition-transform hover:scale-105 duration-300 flex items-center justify-center">
            <svg viewBox="0 0 200 200" className="w-full h-full" id="roatan-logo-header" aria-label="Roatan Self Storage Logo">
              {/* Roof Structure */}
              {/* Outer Roof Slope */}
              <path 
                d="M 32,82 L 100,20 L 168,82" 
                stroke="#111827" 
                strokeWidth="6.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                fill="none" 
              />
              {/* Left Vertical Foot */}
              <path 
                d="M 49,81 L 49,94" 
                stroke="#111827" 
                strokeWidth="6.5" 
                strokeLinecap="round" 
                fill="none" 
              />
              {/* Right Vertical Foot */}
              <path 
                d="M 151,81 L 151,94" 
                stroke="#111827" 
                strokeWidth="6.5" 
                strokeLinecap="round" 
                fill="none" 
              />
              {/* Inner Roof Slope */}
              <path 
                d="M 59,82 L 100,45 L 141,82" 
                stroke="#111827" 
                strokeWidth="6.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                fill="none" 
              />

              {/* Golden/Yellow Circle */}
              <circle 
                cx="100" 
                cy="63.5" 
                r="19" 
                fill="#f2b807" 
                stroke="#111827" 
                strokeWidth="6.5" 
              />

              {/* Black Keyhole */}
              <path 
                d="M 100,55 A 4.5,4.5 0 0,0 96.8,62 L 95.2,71.5 C 95.1,72.1 95.6,72.6 96.2,72.6 L 103.8,72.6 C 104.4,72.6 104.9,72.1 104.8,71.5 L 103.2,62 A 4.5,4.5 0 0,0 100,55 Z" 
                fill="#111827" 
              />

              {/* ROATAN Text */}
              <text 
                x="100" 
                y="119" 
                textAnchor="middle" 
                fill="#084c2e" 
                style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontWeight: 900 }}
                fontSize="24" 
                letterSpacing="0.5"
              >
                ROATAN
              </text>

              {/* Divider Line */}
              <line 
                x1="48" 
                y1="128" 
                x2="152" 
                y2="128" 
                stroke="#111827" 
                strokeWidth="4.5" 
                strokeLinecap="round" 
              />

              {/* SELF STORAGE Text */}
              <text 
                x="100" 
                y="151" 
                textAnchor="middle" 
                fill="#084c2e" 
                style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontWeight: 900 }}
                fontSize="19.5" 
                letterSpacing="0.2"
              >
                SELF STORAGE
              </text>

              {/* SAFE & SECURE Text */}
              <text 
                x="100" 
                y="173" 
                textAnchor="middle" 
                fill="#111827" 
                style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontWeight: 900 }}
                fontSize="14.5" 
                letterSpacing="0.5"
              >
                SAFE & SECURE
              </text>
            </svg>
          </div>

          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-[#112a52] tracking-tight">
            {t.portalTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-lg mt-1 leading-relaxed">
            {t.portalSubtitle} <strong className="text-[#112a52]">{t.portalSubtitleHighlight}</strong>
          </p>
        </header>

        {/* CONTENEDOR DE CONTENIDO PRINCIPAL: Robusto, limpio y elegante (Diseño Stripe Style) */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200/60 relative overflow-hidden" id="main-payment-widget">
          
          {/* Navegación de Métodos de Pago: 3 columnas de botones robustos tipo Stripe checkout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
            {/* Opción 1: Tarjeta */}
            <button
              onClick={() => { setActiveMethod('tarjeta'); resetFlow(); }}
              className={`relative flex items-center justify-between p-5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                activeMethod === 'tarjeta'
                  ? 'border-[#1a365d] bg-[#f8fafc] text-[#1a365d] shadow-sm'
                  : 'border-slate-100 bg-[#fdfdfd] text-slate-600 hover:border-slate-200 hover:text-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${activeMethod === 'tarjeta' ? 'bg-[#1a365d] text-white' : 'bg-slate-100 text-slate-500'}`}>
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <span className="block font-display font-extrabold text-sm tracking-tight">{t.optionCardTitle}</span>
                  <span className="block text-[10px] text-slate-400 mt-0.5 font-medium">{t.optionCardSub}</span>
                </div>
              </div>
            </button>

            {/* Opción 2: Transferencia */}
            <button
              onClick={() => { setActiveMethod('transferencia'); resetFlow(); }}
              className={`relative flex items-center justify-between p-5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                activeMethod === 'transferencia'
                  ? 'border-[#1a365d] bg-[#f8fafc] text-[#1a365d] shadow-sm'
                  : 'border-slate-100 bg-[#fdfdfd] text-slate-600 hover:border-slate-200 hover:text-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${activeMethod === 'transferencia' ? 'bg-[#1a365d] text-white' : 'bg-slate-100 text-slate-500'}`}>
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="block font-display font-extrabold text-sm tracking-tight">{t.optionTransferTitle}</span>
                  <span className="block text-[10px] text-slate-400 mt-0.5 font-medium">{t.optionTransferSub}</span>
                </div>
              </div>
            </button>

            {/* Opción 3: Pago en Caja */}
            <button
              onClick={() => { setActiveMethod('caja'); resetFlow(); }}
              className={`relative flex items-center justify-between p-5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                activeMethod === 'caja'
                  ? 'border-[#1a365d] bg-[#f8fafc] text-[#1a365d] shadow-sm'
                  : 'border-slate-100 bg-[#fdfdfd] text-slate-600 hover:border-slate-200 hover:text-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${activeMethod === 'caja' ? 'bg-[#1a365d] text-white' : 'bg-slate-100 text-slate-500'}`}>
                  <Ticket className="w-5 h-5" />
                </div>
                <div>
                  <span className="block font-display font-extrabold text-sm tracking-tight">{t.optionCashTitle}</span>
                  <span className="block text-[10px] text-slate-400 mt-0.5 font-medium">{t.optionCashSub}</span>
                </div>
              </div>
            </button>
          </div>

          {/* VISTAS DINÁMICAS */}
          <div className="min-h-[240px] flex flex-col justify-between">
            <AnimatePresence mode="wait">
              
              {/* ================= PESTAÑA 1: TARJETA DE CRÉDITO ================= */}
              {activeMethod === 'tarjeta' && (
                <motion.div
                  key="tarjeta-content"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="bg-[#f8fafc] rounded-2xl p-6 border border-slate-200/80 flex flex-col md:flex-row items-center gap-6">
                    {/* Tarjeta Simbolizada Plana de Alto Contraste (Stripe Style) */}
                    <div className="w-full md:w-[240px] h-[140px] rounded-xl bg-gradient-to-tr from-[#111827] to-[#1f2937] p-5 text-white relative overflow-hidden flex flex-col justify-between shrink-0 shadow-sm border border-slate-850">
                      <div className="flex justify-between items-start">
                        <div className="w-8 h-6 bg-amber-500/90 rounded" />
                        <span className="font-mono text-[10px] tracking-wider text-slate-400">CREDIT / DEBIT</span>
                      </div>
                      <div>
                        <p className="font-mono text-sm tracking-widest text-slate-200">•••• •••• •••• 5590</p>
                        <p className="font-mono text-[8px] text-slate-500 tracking-wider uppercase mt-1">Roatan Self Storage</p>
                      </div>
                    </div>

                    <div className="space-y-2 text-center md:text-left flex-grow">
                      <h3 className="text-lg font-display font-extrabold text-slate-950">
                        {t.cardTitle}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-lg">
                        {t.cardDesc}
                      </p>
                    </div>
                  </div>

                  {/* Enlace al Carrusel de Pagos de Tarjeta */}
                  <div className="pt-2 flex justify-center">
                    <a 
                      href="https://checkout.roatanselfstorage.com/payment-carousel"
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-10 py-3.5 rounded-xl bg-[#1e3a8a] hover:bg-[#112a52] text-white font-extrabold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md"
                    >
                      <span>{t.cardBtn}</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </motion.div>
              )}

              {/* ================= PESTAÑA 2: TRANSFERENCIA BANCARIA ================= */}
              {activeMethod === 'transferencia' && (
                <motion.div
                  key="transferencia-content"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="bg-[#f8fafc] rounded-2xl p-6 border border-slate-200 space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                      <div>
                        <h3 className="text-base font-display font-bold text-slate-900">
                          {t.transferTitle}
                        </h3>
                        <p className="text-xs text-slate-400">{t.transferSubtitle}</p>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => setShowBankDetails(!showBankDetails)}
                        className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 self-start sm:self-auto cursor-pointer"
                      >
                        {showBankDetails ? t.transferBtnHide : t.transferBtnShow}
                      </button>
                    </div>

                    {/* Acordeón de Datos Bancarios */}
                    <AnimatePresence>
                      {showBankDetails && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="pt-4 border-t border-slate-200/60 grid grid-cols-1 md:grid-cols-3 gap-3 overflow-hidden"
                        >
                          {BANK_ACCOUNTS.map((acc) => (
                            <div key={acc.id} className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="font-display font-extrabold text-xs text-slate-800">{acc.bankName}</span>
                                <span className="text-[9px] font-bold bg-blue-50 px-2 py-0.5 rounded text-[#1e3a8a]">
                                  {acc.currency}
                                </span>
                              </div>

                              <div className="space-y-2 text-[11px] text-slate-600">
                                <div>
                                  <span className="block text-[8px] uppercase text-slate-400 font-bold">{t.transferLabelType}</span>
                                  <span className="font-semibold text-slate-700">{lang === 'es' ? acc.accountType.es : acc.accountType.en}</span>
                                </div>
                                <div className="group relative">
                                  <span className="block text-[8px] uppercase text-slate-400 font-bold">{t.transferLabelAcc}</span>
                                  <div className="flex items-center justify-between gap-1 mt-0.5 bg-slate-50 p-1 px-2 rounded border border-slate-100">
                                    <span className="font-mono font-bold text-slate-800">{acc.accountNumber}</span>
                                    <button 
                                      type="button"
                                      onClick={() => handleCopyText(acc.accountNumber, `${acc.id}-num`)}
                                      className="text-blue-600 hover:text-blue-800 p-0.5 rounded cursor-pointer"
                                    >
                                      {copiedId === `${acc.id}-num` ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                                    </button>
                                  </div>
                                </div>
                                <div className="group relative">
                                  <span className="block text-[8px] uppercase text-slate-400 font-bold">RTN:</span>
                                  <div className="flex items-center justify-between gap-1 mt-0.5 bg-slate-50 p-1 px-2 rounded border border-slate-100">
                                    <span className="font-mono text-slate-700">{acc.rtn}</span>
                                    <button 
                                      type="button"
                                      onClick={() => handleCopyText(acc.rtn, `${acc.id}-rtn`)}
                                      className="text-blue-600 hover:text-blue-800 p-0.5 rounded cursor-pointer"
                                    >
                                      {copiedId === `${acc.id}-rtn` ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                                    </button>
                                  </div>
                                </div>
                                <div>
                                  <span className="block text-[8px] uppercase text-slate-400 font-bold">{t.transferLabelBeneficiary}</span>
                                  <span className="font-semibold text-slate-700">{acc.holder}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Formulario de registro de ID de Transferencia */}
                  <form onSubmit={handleTransferSubmit} className="space-y-4">
                    <div className="bg-[#f8fafc] rounded-2xl p-6 border border-slate-200 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">{t.transferAmountLabel}</label>
                          <div className="relative rounded-xl">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold text-xs">
                              $ / Lps
                            </div>
                            <input
                              type="text"
                              required
                              placeholder="Ej: 125.00"
                              value={transferAmount}
                              onChange={(e) => setTransferAmount(e.target.value)}
                              className="w-full text-sm pl-16 pr-3.5 py-3 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-400 font-bold text-slate-800"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">{t.transferIdLabel}</label>
                          <input
                            type="text"
                            required
                            placeholder="Ej: ACH-9923184"
                            value={transferId}
                            onChange={(e) => setTransferId(e.target.value)}
                            className="w-full text-sm px-3.5 py-3 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-400 font-mono font-bold text-slate-800"
                          />
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-500 flex items-start gap-1.5 leading-relaxed bg-white p-3 rounded-lg border border-slate-100">
                        <Info className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                        <span>{t.transferWarning}</span>
                      </p>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        disabled={isProcessing}
                        className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#1e3a8a] hover:bg-[#112a52] text-white font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow"
                      >
                        {isProcessing ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>{t.processing}</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>{t.transferSubmit}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>

                  {/* Feedback de transferencia completada */}
                  {transferSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl p-5 flex items-start gap-3"
                    >
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-sm text-emerald-900">{t.transferSuccessTitle}</h4>
                        <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                          {t.transferSuccessDesc.replace('por un monto de', `por un monto de $${transferAmount}`)} <strong className="font-mono text-[#1a365d] bg-white px-2 py-0.5 rounded border border-slate-100">{transferId}</strong>.
                        </p>
                        <button type="button" onClick={resetFlow} className="mt-3 text-xs font-black text-emerald-900 hover:underline cursor-pointer">
                          {t.transferAnother}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* ================= PESTAÑA 3: PAGO EN CAJA ================= */}
              {activeMethod === 'caja' && (
                <motion.div
                  key="caja-content"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="bg-[#f8fafc] rounded-2xl p-6 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-2 text-center md:text-left flex-grow">
                      <h3 className="text-lg font-display font-extrabold text-slate-900">
                        {t.cashTitle}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed max-w-lg">
                        {t.cashDesc}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => { setShowTokenModal(true); setTokenSuccess(null); setTokenError(null); }}
                      className="w-full md:w-auto px-6 py-4 rounded-xl bg-[#1e3a8a] hover:bg-[#112a52] text-white font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-sm hover:shadow"
                    >
                      <span>{t.cashBtn}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>



                  {/* Comprobante de validación de Token */}
                  {tokenSuccess && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-slate-900 text-white rounded-2xl p-6 shadow-lg border border-slate-800 space-y-4"
                    >
                      <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                        <div>
                          <span className="text-[10px] bg-emerald-500 text-white font-black px-2 py-0.5 rounded uppercase tracking-wider">{t.cashSuccessSubtitle}</span>
                          <h4 className="font-display font-extrabold text-base mt-1 text-slate-200">{t.cashSuccessTitle}</h4>
                        </div>
                        <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                      </div>

                      <div className="grid grid-cols-2 gap-y-3 text-xs font-mono text-slate-400">
                        <div>{t.cashLabelToken}</div>
                        <div className="text-right text-white font-bold">{tokenSuccess.token}</div>
                        
                        <div>{t.cashLabelClient}</div>
                        <div className="text-right text-white">{tokenSuccess.client}</div>
                        
                        <div>{t.cashLabelUnit}</div>
                        <div className="text-right text-white">{tokenSuccess.unit}</div>
                        
                        <div>{t.cashLabelAmount}</div>
                        <div className="text-right text-emerald-400 font-bold text-sm">{tokenSuccess.amount}</div>
                        
                        <div>{t.cashLabelDate}</div>
                        <div className="text-right text-slate-500">{tokenSuccess.date}</div>
                      </div>

                      <div className="pt-4 border-t border-slate-850 flex justify-end">
                        <button 
                          type="button"
                          onClick={resetFlow}
                          className="text-xs text-slate-400 hover:text-white underline font-semibold cursor-pointer"
                        >
                          {t.cashClear}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}

            </AnimatePresence>
          </div>

        </div>

      </div>

      {/* ================= VENTANITA (MODAL INTERACTIVO) DE TOKEN DE CAJA ================= */}
      <AnimatePresence>
        {showTokenModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Overlay desenfocado */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTokenModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />

            {/* Ventana de diálogo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden z-10 border border-slate-200"
            >
              {/* Header de la ventanita */}
              <div className="bg-[#112a52] text-white p-5 flex justify-between items-center">
                <h3 className="font-display font-bold text-sm uppercase tracking-wider">{t.modalHeader}</h3>
                <button
                  type="button"
                  onClick={() => setShowTokenModal(false)}
                  className="p-1 rounded hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Contenido de la ventanita */}
              <div className="p-6 space-y-4">
                {isProcessing ? (
                  <div className="py-8 text-center space-y-4">
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-xs font-mono text-slate-500">{processingStep}</p>
                  </div>
                ) : (
                  <form onSubmit={handleTokenSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">{t.modalLabel}</label>
                      <input
                        type="text"
                        required
                        placeholder={t.modalPlaceholder}
                        value={cajaToken}
                        onChange={(e) => setCajaToken(e.target.value)}
                        className="w-full text-center text-lg font-mono font-black tracking-widest px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-400 text-slate-800 uppercase placeholder:text-slate-300"
                        autoFocus
                      />
                    </div>

                    {tokenError && (
                      <div className="p-3.5 bg-rose-50 border border-rose-150 text-rose-700 rounded-xl text-xs flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <span>{tokenError}</span>
                      </div>
                    )}

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-500 leading-relaxed">
                      {lang === 'es' 
                        ? 'Ingrese el código entregado por su cajero. La acreditación es instantánea.' 
                        : 'Enter the code provided by your cashier. Acreditation is instantaneous.'}
                    </div>

                    <div className="pt-2 flex gap-3">
                      <button
                        type="button"
                        onClick={() => setShowTokenModal(false)}
                        className="flex-1 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        {t.modalBtnCancel}
                      </button>
                      
                      <button
                        type="submit"
                        className="flex-1 py-3 rounded-xl bg-[#1e3a8a] hover:bg-[#112a52] text-white font-black text-xs uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        {t.modalBtnValidate}
                      </button>
                    </div>
                  </form>
                )}
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FOOTER: Firma impecable y profesional de bwpsoftware */}
      <footer className="mt-12 text-center relative z-10 space-y-2">
        <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
          {t.footerSecured}
        </p>
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-xs">
          <span className="text-slate-500 font-medium">{t.footerCreated}</span>
          <a 
            href="https://bwpsoftware.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="font-black text-[#1e3a8a] hover:text-[#112a52] tracking-tight flex items-center gap-1"
          >
            <span>bwpsoftware</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          </a>
        </div>
      </footer>

    </div>
  );
}
