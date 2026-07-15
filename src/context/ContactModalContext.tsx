import * as React from "react";

export type ContactTab = "project" | "message" | "career";

interface ContactModalContextType {
  isOpen: boolean;
  activeTab: ContactTab;
  openModal: (tab?: ContactTab) => void;
  closeModal: () => void;
  setActiveTab: (tab: ContactTab) => void;
}

const ContactModalContext = React.createContext<ContactModalContextType | undefined>(undefined);

export function ContactModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<ContactTab>("project");

  const openModal = React.useCallback((tab?: ContactTab) => {
    if (tab) {
      setActiveTab(tab);
    }
    setIsOpen(true);
  }, []);

  const closeModal = React.useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <ContactModalContext.Provider value={{ isOpen, activeTab, openModal, closeModal, setActiveTab }}>
      {children}
    </ContactModalContext.Provider>
  );
}

export function useContactModal() {
  const context = React.useContext(ContactModalContext);
  if (context === undefined) {
    throw new Error("useContactModal must be used within a ContactModalProvider");
  }
  return context;
}
