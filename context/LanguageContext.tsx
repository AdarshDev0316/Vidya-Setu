'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (text: string, fallback?: string) => string;
}

const HINDI_DICTIONARY: Record<string, string> = {
  // Top utility & Navigation
  'भारत सरकार': 'भारत सरकार',
  'Government of India': 'भारत सरकार',
  'Ministry of Education': 'शिक्षा मंत्रालय',
  'Important Note': 'महत्वपूर्ण सूचना',
  'Helpline & Support': 'हेल्पलाइन एवं सहायता',
  'Explore': 'अन्वेषण करें',
  'Govt Portals': 'सरकारी पोर्टल',
  'Institutions': 'संस्थान',
  'Verify Student': 'छात्र सत्यापन',
  'Institution Portal': 'संस्थान पोर्टल',
  'Login': 'लॉग इन',
  'Register Free': 'निःशुल्क पंजीकरण',
  'Official Portal Login': 'आधिकारिक पोर्टल लॉगिन',
  'Public APAAR Verification': 'सार्वजनिक अपार सत्यापन',
  'Public Verification': 'सार्वजनिक सत्यापन',

  // Hero Section
  'Our student records are as Indian as': 'हमारे छात्र अभिलेख उतने ही प्रामाणिक हैं',
  'a verified degree': 'जितनी एक सत्यापित डिग्री',
  'Your Verified Academic Record Is Just': 'आपका सत्यापित शैक्षणिक अभिलेख है बस',
  'A Single APAAR Click Away': 'एक एकल अपार क्लिक की दूरी पर',
  'Connecting Indian students and AICTE-approved institutions with trusted academic identities, authentic enrollment data, and real-time regulatory compliance.':
    'भारतीय छात्रों और एआईसीटीई-अनुमोदित संस्थानों को विश्वसनीय शैक्षणिक पहचान, प्रामाणिक नामांकन डेटा और वास्तविक समय नियामक अनुपालन से जोड़ना।',
  'Ministries, state technical directorates, Fortune 500 recruiters and skilling foundations — all validating on the same central APAAR ledger.':
    'मंत्रालय, राज्य तकनीकी निदेशालय, फॉर्च्यून 500 नियोजक और कौशल संस्थान — सभी एक ही केंद्रीय अपार लेज़र पर सत्यापन कर रहे हैं।',
  'Enter 12-Digit APAAR ID or Roll No': '12-अंकीय अपार (APAAR) आईडी या रोल नंबर दर्ज करें',
  'Select City or State (Eg. Delhi, IIT Bombay)': 'शहर या राज्य चुनें (उदा. दिल्ली, आईआईटी बॉम्बे)',
  'Find & Verify': 'खोजें और सत्यापित करें',
  'Institution Data Portal': 'संस्थान डेटा पोर्टल',
  'Verify Student Record': 'छात्र अभिलेख सत्यापित करें',

  // Stats
  'Approved Institutions': 'अनुमोदित संस्थान',
  'Students Enrolled': 'नामांकित छात्र',
  'APAAR Verified': 'अपार सत्यापित',
  'Duplicate Records Active': 'सक्रिय डुप्लिकेट रिकॉर्ड',
  '10,284 APPROVED INSTITUTIONS ONBOARDED': '10,284 अनुमोदित संस्थान सम्मिलित',
  '42.8L+ STUDENTS': '42.8 लाख+ छात्र',
  'Active AICTE': 'सक्रिय एआईसीटीई',
  'AY 2024-25': 'शैक्षणिक वर्ष 2024-25',
  'Validated': 'सत्यापित',
  'Clean Ledger': 'स्वच्छ लेज़र',

  // How it works / Milestones
  'HOW IT ACTUALLY WORKS': 'यह वास्तव में कैसे कार्य करता है',
  'From enrollment to': 'नामांकन से लेकर',
  'graduation': 'स्नातक एवं उपाधि तक',
  'Five milestones, end to end — no agents and no fees. This is the government\'s own pipeline.':
    'पांच मील के पत्थर, शुरू से अंत तक — कोई मध्यस्थ नहीं और कोई शुल्क नहीं। यह सरकार का अपना तंत्र है।',
  'Start milestone one — It\'s free →': 'पहला चरण प्रारंभ करें — यह निःशुल्क है →',
  'Start milestone one — It’s free →': 'पहला चरण प्रारंभ करें — यह निःशुल्क है →',
  'SIGN UP': 'पंजीकरण',
  'DATA UPLOAD': 'डेटा अपलोड',
  'AUTO VALIDATE': 'स्वचालित सत्यापन',
  'AUDIT & LEDGER': 'लेखापरीक्षा एवं लेज़र',
  'CERTIFIED': 'प्रमाणित',

  // Features
  'NATIONAL APAAR ARCHITECTURE': 'राष्ट्रीय अपार (APAAR) वास्तुकला',
  'Intelligent APAAR Data Ecosystem': 'बुद्धिमान अपार डेटा पारिस्थितिकी तंत्र',
  'Beyond simple data collection: automated validation, anomaly detection, real-time seat monitoring, and authorized verification.':
    'केवल डेटा संग्रह से परे: स्वचालित सत्यापन, विसंगति पहचान, वास्तविक समय सीट निगरानी और अधिकृत सत्यापन।',
  'Secure Data Upload': 'सुरक्षित डेटा अपलोड',
  'AES-256 encrypted bulk CSV/Excel upload with role-based access controls and full audit trails.':
    'भूमिका-आधारित पहुंच नियंत्रण और पूर्ण ऑडिट ट्रेल्स के साथ AES-256 एन्क्रिप्टेड थोक CSV/Excel अपलोड।',
  'APAAR Validation': 'अपार सत्यापन',
  'Real-time 12-digit APAAR ID verification against the National Academic Registry.':
    'राष्ट्रीय शैक्षणिक रजिस्ट्री के विरुद्ध वास्तविक समय 12-अंकीय अपार आईडी सत्यापन।',
  'Real-time Dashboard': 'वास्तविक समय डैशबोर्ड',
  'Live enrollment statistics, category-wise breakdowns, and compliance progress for institutions.':
    'संस्थानों के लिए लाइव नामांकन आंकड़े, श्रेणी-वार विवरण और अनुपालन प्रगति।',
  'Anomaly Detection': 'विसंगति पहचान',
  'AI-assisted flagging of duplicate entries, format violations, and statistical outliers.':
    'डुप्लिकेट प्रविष्टियों, प्रारूप उल्लंघनों और सांख्यिकीय विसंगतियों की एआई-सहायता प्राप्त पहचान।',
  'Digital Credentials': 'डिजिटल साख-पत्र',
  'Tamper-proof digitally signed verification certificates issued instantly on demand.':
    'मांग पर तुरंत जारी किए जाने वाले छेड़छाड़-रोधी डिजिटल हस्ताक्षरित सत्यापन प्रमाण पत्र।',

  // RBAC Stakeholders
  'DPDP Act 2023 Compliant RBAC': 'डीपीडीपी अधिनियम 2023 अनुपालक आरबीएसी',
  'Stakeholder Access & Permissions': 'हितधारक पहुंच एवं अनुमतियां',
  'Role-Based Access Control (RBAC) ensuring data privacy, tenant isolation, and strict purpose limitation under the DPDP Act 2023.':
    'भूमिका-आधारित पहुंच नियंत्रण (RBAC) जो डीपीडीपी अधिनियम 2023 के तहत डेटा गोपनीयता, किरायेदार अलगाव और सख्त उद्देश्य सीमा सुनिश्चित करता है।',
  'Institution Admin': 'संस्थान प्रशासक',
  'AICTE Officer': 'एआईसीटीई अधिकारी',
  'Student': 'छात्र',
  'Employer / Verifier': 'नियोक्ता / सत्यापनकर्ता',
  'Statutory Auditor': 'सांविधिक लेखापरीक्षक',

  // Footer & Portals
  'Platform Portals': 'मंच पोर्टल',
  'Institution Admin Login': 'संस्थान प्रशासक लॉगिन',
  'Public Student Verification': 'सार्वजनिक छात्र सत्यापन',
  'Student Batch Upload': 'छात्र बैच अपलोड',
  'Accreditation & BI Reports': 'प्रत्यायन एवं बीआई रिपोर्ट',
  'Statutory Compliance': 'सांविधिक अनुपालन',
  'AICTE Central Helpdesk': 'एआईसीटीई केंद्रीय हेल्पडेस्क',
  'National Academic Depository': 'राष्ट्रीय शैक्षणिक निक्षेपागार (NAD)',

  // Common UI Elements
  'Search': 'खोजें',
  'Submit': 'जमा करें',
  'Back': 'वापस',
  'Download': 'डाउनलोड करें',
  'Print': 'प्रिंट करें',
  'Close': 'बंद करें',
  'Save': 'सहेजें',
  'Cancel': 'रद्द करें',
  'Next': 'आगे',
  'Previous': 'पिछला',
  'View Details': 'विवरण देखें',
  'All rights reserved.': 'सर्वाधिकार सुरक्षित।',
  'Password': 'पासवर्ड',
  'Email Address': 'ईमेल पता',
  'Select Role': 'भूमिका चुनें',
  'Sign In': 'साइन इन करें',
  'Sign Out Session': 'सत्र समाप्त करें / लॉग आउट',
  'Log Out': 'लॉग आउट',
  'Dashboard': 'डैशबोर्ड',
  'Upload Student Data': 'छात्र डेटा अपलोड करें',
  'Regulatory Reports': 'नियामक रिपोर्ट',
  'Duplicate Radar': 'डुप्लिकेट रडार',
  'Anomaly Log': 'विसंगति लॉग',
  'Consent Registry': 'सहमति रजिस्ट्री',
  'Profile': 'प्रोफ़ाइल',

  // Policies & Live Circulars
  'Live Policies & AICTE Regulatory Circulars': 'नवीनतम नीतियां एवं एआईसीटीई नियामक परिपत्र',
  'Official Gazette Notifications, statutory policy circulars, and academic guidelines': 'आधिकारिक राजपत्र अधिसूचनाएं, सांविधिक नीति परिपत्र और शैक्षणिक दिशानिर्देश',
  'Universal Public Student Verification Gateway (No Auth Required)': 'सार्वजनिक छात्र सत्यापन पोर्टल (लॉगिन की आवश्यकता नहीं)',
  'AICTE Approval Process Handbook (APH) 2024-27 Regulatory Guidelines': 'एआईसीटीई अनुमोदन प्रक्रिया पुस्तिका (APH) नियामक दिशानिर्देश',
  'Mandatory APAAR ID Integration in Technical Admissions': 'तकनीकी प्रवेश में अनिवार्य अपार (APAAR) आईडी एकीकरण',
  'Supernumerary & Foreign National (FN/NRI/OCI) Seat Policy Framework 2024-25': 'अतिरिक्त एवं विदेशी नागरिक (FN/NRI/OCI) सीट नीति ढांचा',
  'National Academic Depository (NAD) Real-Time Credit Transfer Norms Live': 'राष्ट्रीय शैक्षणिक निक्षेपागार (NAD) रियल-टाइम क्रेडिट ट्रांसफर नियम',
  'Reservation Quota Compliance & Category Ceiling Norms for Technical Colleges': 'तकनीकी कॉलेजों के लिए आरक्षण कोटा अनुपालन एवं श्रेणी सीमाएं',
  'National Technical Education Repository Norms': 'राष्ट्रीय तकनीकी शिक्षा भंडार मानदंड',
  'View Regulations': 'विनियम देखें',
  'Read Guidelines': 'दिशानिर्देश पढ़ें',
  'Explore Policies': 'नीतियां देखें',

  // Navigation & Dropdowns
  'AICTE Official Portal': 'एआईसीटीई आधिकारिक पोर्टल',
  'ABC Academic Bank of Credits': 'एकेडमिक बैंक ऑफ क्रेडिट्स (ABC)',
  'DigiLocker': 'डिजिटल लॉकर (DigiLocker)',
  'NAD National Academic Depository': 'राष्ट्रीय शैक्षणिक निक्षेपागार',
  'UDISE Plus': 'यूडाइस प्लस (UDISE Plus)',
  'APAAR Official Portal': 'अपार आधिकारिक पोर्टल',
  'National Internship Portal': 'राष्ट्रीय इंटर्नशिप पोर्टल',
  'Register Institution': 'संस्थान पंजीकृत करें',
  'Validation Engine': 'सत्यापन इंजन',
  'View Compliance Status': 'अनुपालन स्थिति देखें',
  'Student Records': 'छात्र रिकॉर्ड',
  'API Integration Guide': 'एपीआई एकीकरण मार्गदर्शिका',
  'Batch Upload & Validation': 'बैच अपलोड एवं सत्यापन',
  'Anomaly Detection Engine': 'विसंगति पहचान इंजन',
  'Degree Certificates (R10)': 'उपाधि प्रमाण पत्र (R10)',
  'Regulatory BI Reports': 'नियामक बीआई रिपोर्ट',

  // Verification & Public Gateway
  'Universal Student Credential Verification Gateway': 'सार्वजनिक छात्र साख-पत्र सत्यापन पोर्टल',
  'AICTE & APAAR National Academic Depository (NAD) Real-Time Verification': 'एआईसीटीई एवं अपार राष्ट्रीय शैक्षणिक निक्षेपागार वास्तविक समय सत्यापन',
  'Enter 12-Digit APAAR ID': '12-अंकीय अपार आईडी दर्ज करें',
  'Enter 12-digit APAAR ID': '12-अंकीय अपार आईडी दर्ज करें',
  'Verify Student Status': 'छात्र स्थिति सत्यापित करें',
  'Verifying...': 'सत्यापन प्रगति पर है...',
  'Verification Result': 'सत्यापन परिणाम',
  'Candidate Details': 'अभ्यर्थी विवरण',
  'Student Name': 'छात्र का नाम',
  'Institution': 'संस्थान',
  'Program': 'पाठ्यक्रम / डिग्री',
  'Academic Year': 'शैक्षणिक सत्र',
  'Enrollment Status': 'नामांकन स्थिति',
  'APAAR ID Status': 'अपार आईडी स्थिति',
  'Verified': 'सत्यापित (Verified)',
  'Active': 'सक्रिय (Active)',
  'Print Verification Certificate': 'सत्यापन प्रमाण पत्र प्रिंट करें',
  'Download Certificate': 'प्रमाण पत्र डाउनलोड करें',

  // Accessibility terms
  'Accessibility': 'अभिगम्यता (Accessibility)',
  'Accessibility Options': 'अभिगम्यता विकल्प',
  'Customise your viewing experience': 'अपने देखने के अनुभव को अनुकूलित करें',
  'Page Zoom': 'पृष्ठ ज़ूम',
  'Scale the entire page': 'पूरे पृष्ठ को स्केल करें',
  'Font Size': 'फ़ॉन्ट आकार',
  'Adjust text size across the page': 'पृष्ठ भर में टेक्स्ट का आकार समायोजित करें',
  'Default': 'डिफ़ॉल्ट',
  'Reset': 'रीसेट',
  'Color Blind Mode': 'कलर ब्लाइंड मोड',
  'Apply vision-friendly colour filters': 'दृष्टि-अनुकूल रंग फ़िल्टर लागू करें',
  'None': 'कोई नहीं',
  'Protanopia': 'प्रोटानोपिया (लाल-हरा)',
  'Deuteranopia': 'ड्यूटेरानोपिया (हरा-दुर्बल)',
  'Tritanopia': 'ट्रिटानोपिया (नीला-पीला)',
  'Greyscale': 'ग्रेस्केल (श्वेत-श्याम)',
  'High Contrast': 'उच्च कंट्रास्ट',
  'Display Tools': 'प्रदर्शन उपकरण',
  'Quick visual adjustments': 'त्वरित दृश्य समायोजन',
  'Dark Contrast': 'गहरा कंट्रास्ट',
  'Invert': 'रंग उलटें (Invert)',
  'Saturation': 'संतृप्ति (Saturation)',
  'Text Size Increase': 'टेक्स्ट आकार बढ़ाएं',
  'Text Size Decrease': 'टेक्स्ट आकार घटाएं',
  'Highlight Links': 'लिंक हाइलाइट करें',
  'Hide Images': 'चित्र छिपाएं',
  'Big Cursor': 'बड़ा कर्सर',
  'Default Cursor': 'सामान्य कर्सर',
  'Reading & Visual Aids': 'पठन एवं दृश्य सहायता',
  'Spacing, fonts, guide, focus and read aloud': 'रिक्ति, फ़ॉन्ट्स, गाइड, फ़ोकस और पृष्ठ वाचन',
  'Line Spacing': 'पंक्ति रिक्ति',
  'Text Spacing': 'टेक्स्ट रिक्ति',
  'Dyslexia Friendly Font': 'डिस्लेक्सिया अनुकूल फ़ॉन्ट',
  'Bold Text': 'मोटे अक्षर (Bold Text)',
  'Highlight Headings': 'शीर्षक हाइलाइट करें',
  'Reading Guide': 'रीडिंग गाइड (पठन रेखा)',
  'Stop Animations': 'एनीमेशन रोकें',
  'Highlight Focus': 'फ़ोकस हाइलाइट करें',
  'Read Page Aloud': 'पृष्ठ बोलकर सुनाएं (Read Aloud)',
  'Stop Reading': 'वाचन रोकें',
  'Reset all accessibility settings': 'सभी अभिगम्यता सेटिंग्स रीसेट करें',

  // Roles & RBAC
  'Select Your Role': 'अपनी भूमिका चुनें',
  'Select Your Access Role': 'अपनी पहुंच भूमिका चुनें',
  'Institution Admin (College Principal / Nodal Officer)': 'संस्थान प्रशासक (प्राचार्य / नोडल अधिकारी)',
  'AICTE Regulatory Officer': 'एआईसीटीई नियामक अधिकारी',
  'Student / Degree Holder': 'छात्र / डिग्री धारक',
  'Corporate Employer / Verification Agency': 'कॉर्पोरेट नियोक्ता / सत्यापन एजेंसी',
  'Statutory Auditor / State Directorate': 'सांविधिक लेखापरीक्षक / राज्य निदेशालय',
  'Sign in to access your authorized VIDYA-SETU console': 'अपने अधिकृत विद्या-सेतु कंसोल तक पहुंचने के लिए साइन इन करें',
  'Secure Login': 'सुरक्षित लॉगिन',
  'Authenticating...': 'प्रमाणीकरण जारी है...',
  'Need help signing in?': 'साइन इन करने में सहायता चाहिए?',
  'Contact AICTE Nodal Helpdesk': 'एआईसीटीई नोडल हेल्पडेस्क से संपर्क करें',

  // Registration
  'AICTE Institution Onboarding & Registration': 'एआईसीटीई संस्थान ऑनबोर्डिंग एवं पंजीकरण',
  'Official portal for technical institutions to register under APAAR mandate': 'अपार अधिदेश के तहत तकनीकी संस्थानों के पंजीकरण हेतु आधिकारिक पोर्टल',
  'AICTE Permanent Institute ID (PID)': 'एआईसीटीई स्थायी संस्थान आईडी (PID)',
  'Institution Name': 'संस्थान का नाम',
  'State / UT': 'राज्य / केंद्र शासित प्रदेश',
  'Affiliating University': 'संबद्ध विश्वविद्यालय',
  'Head of Institution / Principal Name': 'संस्थान प्रमुख / प्राचार्य का नाम',
  'Official Email': 'आधिकारिक ईमेल',
  'Mobile Number': 'मोबाइल नंबर',
  'Submit Application': 'आवेदन जमा करें',
  'Submitting...': 'जमा हो रहा है...',
  'Application Submitted Successfully!': 'आवेदन सफलतापूर्वक जमा किया गया!',

  // Dashboard Navigation & Modules
  'Overview': 'सिंहावलोकन',
  'College Dashboard': 'कॉलेज डैशबोर्ड',
  'Upload Students': 'छात्र डेटा अपलोड',
  'Batch History': 'बैच इतिहास',
  'Anomaly Alerts': 'विसंगति अलर्ट',
  'Reports & Export': 'रिपोर्ट एवं निर्यात',
  'Degree Certificates': 'उपाधि प्रमाण पत्र',
  'Institution Profile': 'संस्थान प्रोफ़ाइल',
  'API Gateway Keys': 'एपीआई गेटवे कुंजी',
  'National Monitor': 'राष्ट्रीय निगरानी',
  'All Submissions': 'सभी प्रस्तुतियां',
  'Validation Rules': 'सत्यापन नियम',
  'Anomaly Cases': 'विसंगति मामले',
  'Operator Profile': 'ऑपरेटर प्रोफ़ाइल',
  'Approver Profile': 'अनुमोदक प्रोफ़ाइल',
  'Degree Approvals': 'डिग्री अनुमोदन',
  'Batch Submissions': 'बैच प्रस्तुतियां',
  'Flagged Anomalies': 'पहचानी गई विसंगतियां',
  'Run Validation': 'सत्यापन प्रारंभ करें',
  'Data Operations': 'डेटा संचालन',
  'Data Management': 'डेटा प्रबंधन',
  'Regulatory Oversight': 'नियामक पर्यवेक्षण',
  'Account': 'खाता',
  'System': 'सिस्टम',
  'AICTE Headquarters': 'एआईसीटीई मुख्यालय',
  'Verification & Review': 'सत्यापन एवं समीक्षा',
  'Data Upload': 'डेटा अपलोड',
  'Batch Upload': 'बैच अपलोड',
  'Validation Results': 'सत्यापन परिणाम',
  'Anomalies': 'विसंगतियां',
  'Credential Registry': 'साख-पत्र रजिस्ट्री',
  'BI Analytics': 'बीआई विश्लेषण',
  'Audit Trail': 'ऑडिट ट्रेल',
  'Audit Logs': 'ऑडिट लॉग',
  'Settings': 'सेटिंग्स',
  'System Active': 'सिस्टम सक्रिय',
  'All India Council for Technical Education': 'अखिल भारतीय तकनीकी शिक्षा परिषद',
  'Student Data Management Platform': 'छात्र डेटा प्रबंधन मंच',
  'Sign Out': 'लॉग आउट',

  // Dashboard Stats & Metrics
  'Total Enrolled': 'कुल नामांकित',
  'Total Students': 'कुल छात्र',
  'Total Uploads': 'कुल अपलोड',
  'Verified Students': 'सत्यापित छात्र',
  'Pending Validation': 'लंबित सत्यापन',
  'Pending Approval': 'लंबित अनुमोदन',
  'Critical Anomalies': 'गंभीर विसंगतियां',
  'Duplicate Alerts': 'डुप्लिकेट अलर्ट',
  'Active Intake': 'सक्रिय प्रवेश',
  'Approved Capacity': 'अनुमोदित क्षमता',
  'Intake Utilization': 'प्रवेश उपयोग',
  'Sanctioned Intake': 'स्वीकृत प्रवेश',
  'Enrolled Count': 'नामांकन संख्या',
  'Vacant Seats': 'रिक्त सीटें',
  'Supernumerary Seats': 'अतिरिक्त सीटें',
  'Recent Batches': 'हाल के बैच',
  'Batch ID': 'बैच आईडी',
  'File Name': 'फ़ाइल का नाम',
  'Uploaded At': 'अपलोड समय',
  'Upload Date': 'अपलोड तिथि',
  'Records': 'अभिलेख',
  'Status': 'स्थिति',
  'Actions': 'कार्रवाई',
  'Action': 'कार्रवाई',
  'Download Report': 'रिपोर्ट डाउनलोड करें',
  'View Report': 'रिपोर्ट देखें',
  'Export CSV': 'CSV निर्यात करें',
  'Export PDF': 'PDF निर्यात करें',
  'Upload New Batch': 'नया बैच अपलोड करें',
  'Upload Batch': 'बैच अपलोड करें',
  'Validate Batch': 'बैच सत्यापित करें',
  'Processing...': 'प्रक्रिया जारी है...',
  'Upload Successful': 'अपलोड सफल रहा',
  'Upload Failed': 'अपलोड विफल',
  'Error': 'त्रुटि',
  'Warning': 'चेतावनी',
  'Information': 'सूचना',
  'Success': 'सफलता',
  'All Institutions': 'सभी संस्थान',
  'Search by APAAR ID, Student Name, or Roll No': 'अपार आईडी, छात्र का नाम या रोल नंबर द्वारा खोजें',
  'Filter by Status': 'स्थिति द्वारा फ़िल्टर करें',
  'Filter by Category': 'श्रेणी द्वारा फ़िल्टर करें',
  'Filter by Course': 'पाठ्यक्रम द्वारा फ़िल्टर करें',
  'All Statuses': 'सभी स्थितियां',
  'All Categories': 'सभी श्रेणियां',
  'All Courses': 'सभी पाठ्यक्रम',
  'Active Enrolled': 'सक्रिय नामांकित',
  'Graduated': 'उत्तीर्ण / स्नातक',
  'Discontinued': 'स्थगित / छोड़ा हुआ',
  'Suspended': 'निलंबित',
  'Flagged for Review': 'समीक्षा हेतु चिन्हित',
  'Course': 'पाठ्यक्रम',
  'Branch': 'शाखा',
  'Specialization': 'विशेषज्ञता',
  'Semester': 'सत्र / सेमेस्टर',
  'Year of Admission': 'प्रवेश वर्ष',
  'CGPA': 'सीजीपीए (CGPA)',
  'Enrollment No': 'नामांकन संख्या',
  'Back to Home': 'होम पेज पर वापस जाएं',
  'Return to Home': 'होम पेज पर लौटें',
  'Back to Chat →': 'चैट पर वापस जाएं →',
  'Switch to Another Role:': 'अन्य भूमिका में बदलें:',
  'Public View': 'सार्वजनिक दृश्य',
  'AI Helpdesk & Feedback': 'एआई हेल्पडेस्क एवं फीडबैक',
  'AI Chat': 'एआई चैट',
  'Sign In to Portal': 'पोर्टल में साइन इन करें',
  'Remember me on this device': 'इस डिवाइस पर मुझे याद रखें',
  'Forgot Password?': 'पासवर्ड भूल गए?',
  'New User Registration →': 'नया उपयोगकर्ता पंजीकरण →',
  'No account? Apply for Access': 'खाता नहीं है? पहुंच के लिए आवेदन करें',
  'Quick Demo Login (1-Click Fill)': 'त्वरित डेमो लॉगिन (1-क्लिक)',
  'Pre-configured roles': 'पूर्व-कॉन्फ़िगर की गई भूमिकाएं',
  'General': 'सामान्य (General)',
  'OBC-NCL': 'अन्य पिछड़ा वर्ग (OBC-NCL)',
  'SC': 'अनुसूचित जाति (SC)',
  'ST': 'अनुसूचित जनजाति (ST)',
  'EWS': 'आर्थिक रूप से कमजोर (EWS)',
  'PwD': 'दिव्यांग (PwD)',
  'NRI': 'अनिवासी भारतीय (NRI)',
  'FN': 'विदेशी नागरिक (FN)',
  'OCI': 'प्रवासी भारतीय नागरिक (OCI)',
  'TFW': 'ट्यूशन फीस छूट (TFW)',
  'Male': 'पुरुष',
  'Female': 'महिला',
  'Other': 'अन्य',

  // Policies & Ticker Announcements
  'New Policy: AICTE Approval Process Handbook (APH) AY 2024-25 Published': 'नई नीति: एआईसीटीई अनुमोदन प्रक्रिया पुस्तिका (APH) शैक्षणिक वर्ष 2024-25 प्रकाशित',
  'Mandatory 12-Digit APAAR ID Linkage Circular for All AICTE-Approved Institutions': 'सभी एआईसीटीई-अनुमोदित संस्थानों के लिए अनिवार्य 12-अंकीय अपार आईडी लिंकेज परिपत्र',
  'Academic Bank of Credits (ABC) & DigiLocker National Guidelines Released': 'एकेडेमिक बैंक ऑफ क्रेडिट्स (ABC) और डिजिलॉकर राष्ट्रीय दिशानिर्देश जारी',
  'Public Student Academic Credential Verification Portal Open under DPDP Act 2023': 'डीपीडीपी अधिनियम 2023 के तहत सार्वजनिक छात्र शैक्षणिक साख सत्यापन पोर्टल उपलब्ध',
  'Supernumerary & Foreign National Seat Quota Monitoring Circular': 'अतिरिक्त एवं विदेशी नागरिक सीट कोटा निगरानी परिपत्र',
  'Policy': 'नीति',
  'Mandate': 'आदेश / अधिदेश',
  'Circular': 'परिपत्र',
  'Public': 'सार्वजनिक',
  'Quota': 'कोटा',

  // Modals & Popups
  'AICTE 24x7 Helpline & Support': 'एआईसीटीई 24x7 हेल्पलाइन एवं सहायता',
  'APAAR Student Support Desk': 'अपार छात्र सहायता केंद्र',
  'Toll-Free Numbers:': 'टोल-फ्री नंबर:',
  'Timing: 9:30 AM to 5:30 PM (Mon - Fri)': 'समय: सुबह 9:30 से शाम 5:30 बजे (सोम - शुक्र)',
  'Official Email Grievances:': 'आधिकारिक ईमेल शिकायतें:',
  'Nodal Officer Portal Access:': 'नोडल अधिकारी पोर्टल पहुंच:',
  'Approved SPOCs can raise emergency ticket via the Institution Dashboard.': 'अनुमोदित SPOC संस्थान डैशबोर्ड के माध्यम से आपातकालीन टिकट दर्ज कर सकते हैं।',
  'Important Public Advisory': 'महत्वपूर्ण सार्वजनिक परामर्श',
  'AICTE Statutory Advisory: AY 2024-25 APAAR Seeding & Intake Quotas': 'एआईसीटीई वैधानिक परामर्श: शैक्षणिक वर्ष 2024-25 अपार सीडिंग एवं प्रवेश कोटा',
  'Notice Ref: ADVISORY-AICTE/REG/2024-25/001': 'सूचना संदर्भ: ADVISORY-AICTE/REG/2024-25/001',
  'To: Heads of All Approved Technical Institutions, Universities, Students & Employers': 'प्रति: सभी अनुमोदित तकनीकी संस्थानों, विश्वविद्यालयों के प्रमुख, छात्र एवं नियोक्ता',
  '1. Strict Prohibition of Off-Ledger / Unapproved Admissions': '1. गैर-लेज़र / अमान्य नामांकनों पर पूर्ण प्रतिबंध',
  'Any student enrolled beyond the AICTE-sanctioned ceiling or without a verified 12-digit APAAR ID cannot be verified for degree awards, national scholarships, or recruitment clearances.': 'एआईसीटीई द्वारा स्वीकृत सीमा से अधिक या बिना सत्यापित 12-अंकीय अपार आईडी वाले किसी भी छात्र को डिग्री, राष्ट्रीय छात्रवृत्ति या भर्ती सत्यापन हेतु मान्यता नहीं दी जा सकती।',
  '2. Free Public Verification Gateway': '2. निःशुल्क सार्वजनिक सत्यापन पोर्टल',
  'Recruiters, government bodies, and academic institutions may verify candidate status instantly without charge using the public verification gateway at': 'नियोक्ता, सरकारी निकाय एवं शैक्षणिक संस्थान बिना किसी शुल्क के सार्वजनिक सत्यापन पोर्टल का उपयोग कर सकते हैं:',
  '3. DPDP Act 2023 Consent Mandate': '3. डीपीडीपी अधिनियम 2023 सहमति अधिदेश',
  'Institutions are strictly advised to record student/parent consent prior to uploading enrollment registers to VIDYA-SETU platform.': 'संस्थानों को कड़ाई से सलाह दी जाती है कि वे विद्या-सेतु पोर्टल पर नामांकन रजिस्टर अपलोड करने से पहले छात्र/अभिभावक की सहमति दर्ज करें।',
  'Read Complete Guideline': 'संपूर्ण दिशानिर्देश पढ़ें',
  'Open Official Portal': 'आधिकारिक पोर्टल खोलें',
  'Close Advisory': 'परामर्श बंद करें',
  'Milestone': 'चरण',
  'of': 'का',
  'Free': 'निःशुल्क',
  '1 tap': '1 क्लिक',
  'AI Review': 'एआई समीक्षा',
  'Credits': 'क्रेडिट्स',
  'Automated Validation': 'स्वचालित सत्यापन',
  'The intelligent anomaly engine validates APAAR IDs in real time, checks for cross-institution duplicates, and flags quota overflows.': 'बुद्धिमान विसंगति इंजन वास्तविक समय में अपार आईडी को सत्यापित करता है, क्रॉस-संस्थान डुप्लिकेट की जांच करता है, और कोटा सीमा उल्लंघन को चिन्हित करता है।',
  'AICTE Review & Approval': 'एआईसीटीई समीक्षा एवं अनुमोदन',
  'Bureau officers review flagged records, verify supernumerary and foreign national seats, and approve submissions to the central repository.': 'ब्यूरो अधिकारी चिन्हित रिकॉर्डों की समीक्षा करते हैं, अतिरिक्त और विदेशी नागरिक सीटों का सत्यापन करते हैं, और केंद्रीय रिपॉजिटरी में प्रविष्टियों को अनुमोदित करते हैं।',
  'Verified Credentials': 'सत्यापित साख-पत्र',
  'A government-issued, QR-verifiable certificate linked to the student\'s APAAR identity, ready for degree printing and employment verification.': 'छात्र की अपार पहचान से जुड़ा एक सरकारी, क्यूआर-सत्यापनीय प्रमाण पत्र, डिग्री मुद्रण और रोजगार सत्यापन के लिए तैयार।',
  'Automated Permanent Academic Account Registry (APAAR) ID-Based Student Data Management and Verification Platform.': 'स्वचालित स्थायी शैक्षणिक खाता रजिस्ट्री (अपार) आईडी-आधारित छात्र डेटा प्रबंधन और सत्यापन मंच।',
  'Regulation & Approval Bureau · Government of India': 'विनियमन एवं अनुमोदन ब्यूरो · भारत सरकार',
  'All India Council for Technical Education (AICTE)': 'अखिल भारतीय तकनीकी शिक्षा परिषद (AICTE)',
  'Section 6 Consent Enforced': 'धारा 6 सहमति लागू',
  'Dual Degree Programme Validation': 'दोहरी डिग्री कार्यक्रम सत्यापन',
  'Seat Ceiling Monitoring': 'सीट सीमा निगरानी',
  'Standard W3C Credentials': 'मानक W3C साख-पत्र',
  'Nelson Mandela Marg, Vasant Kunj, New Delhi - 110070': 'नेल्सन मंडेला मार्ग, वसंत कुंज, नई दिल्ली - 110070',
  'AICTE Helpline & Support': 'एआईसीटीई हेल्पलाइन एवं सहायता',
  'All Circulars & Handbooks': 'सभी परिपत्र एवं पुस्तिकाएं',
};

// Sorted dictionary keys by length descending to match full multi-word phrases first
const SORTED_KEYS = Object.keys(HINDI_DICTIONARY).sort((a, b) => b.length - a.length);

// Cache original English values for lossless restoration
const originalTextMap = new WeakMap<Node, string>();
const originalPlaceholderMap = new WeakMap<Element, string>();
const originalTitleMap = new WeakMap<Element, string>();
let isTranslating = false;

function translateElementAndChildren(root: Node) {
  if (!root || typeof window === 'undefined') return;

  // Process TEXT_NODE
  if (root.nodeType === Node.TEXT_NODE) {
    const parent = root.parentElement;
    if (parent) {
      const tag = parent.tagName.toLowerCase();
      if (['script', 'style', 'code', 'pre', 'noscript', 'svg'].includes(tag)) return;
      if (parent.closest('[data-no-translate]')) return;
    }

    const val = root.nodeValue || '';
    const trimmed = val.trim();
    if (!trimmed || /^\d+$/.test(trimmed) || /^[0-9.,/:%+\-–\s()🇮🇳🇬🇧✨⚡🏛️🎓📋🏢🔍🌱🛡️⚠️💬👤✓]+$/.test(trimmed)) {
      return;
    }

    const hasDevanagari = /[\u0900-\u097F]/.test(val);
    if (!hasDevanagari && !originalTextMap.has(root)) {
      originalTextMap.set(root, val);
    }
    const orig = originalTextMap.get(root) || val;
    const origTrimmed = orig.trim();

    // Direct match
    if (HINDI_DICTIONARY[origTrimmed]) {
      root.nodeValue = orig.replace(origTrimmed, HINDI_DICTIONARY[origTrimmed]);
      return;
    }

    // Phrase replacement
    let updated = orig;
    let replaced = false;
    for (const en of SORTED_KEYS) {
      if (en.length >= 3 && updated.includes(en)) {
        updated = updated.split(en).join(HINDI_DICTIONARY[en]);
        replaced = true;
      }
    }
    if (replaced) {
      root.nodeValue = updated;
    }
    return;
  }

  // Process ELEMENT_NODE attributes
  if (root.nodeType === Node.ELEMENT_NODE) {
    const el = root as HTMLElement;
    const tag = el.tagName.toLowerCase();
    if (['script', 'style', 'code', 'pre', 'noscript', 'svg'].includes(tag)) return;
    if (el.closest('[data-no-translate]')) return;

    // Placeholder
    if (el.hasAttribute('placeholder')) {
      const ph = el.getAttribute('placeholder') || '';
      if (!originalPlaceholderMap.has(el)) {
        originalPlaceholderMap.set(el, ph);
      }
      const origPh = originalPlaceholderMap.get(el) || ph;
      const trimmedPh = origPh.trim();
      if (HINDI_DICTIONARY[trimmedPh]) {
        el.setAttribute('placeholder', HINDI_DICTIONARY[trimmedPh]);
      } else {
        let updatedPh = origPh;
        let replacedPh = false;
        for (const en of SORTED_KEYS) {
          if (en.length >= 3 && updatedPh.includes(en)) {
            updatedPh = updatedPh.split(en).join(HINDI_DICTIONARY[en]);
            replacedPh = true;
          }
        }
        if (replacedPh) el.setAttribute('placeholder', updatedPh);
      }
    }

    // Title
    if (el.hasAttribute('title')) {
      const t = el.getAttribute('title') || '';
      if (!originalTitleMap.has(el)) {
        originalTitleMap.set(el, t);
      }
      const origT = originalTitleMap.get(el) || t;
      const trimmedT = origT.trim();
      if (HINDI_DICTIONARY[trimmedT]) {
        el.setAttribute('title', HINDI_DICTIONARY[trimmedT]);
      }
    }

    // Recurse into children
    const children = Array.from(root.childNodes);
    for (const child of children) {
      translateElementAndChildren(child);
    }
  }
}

function restoreElementAndChildren(root: Node) {
  if (!root || typeof window === 'undefined') return;

  if (root.nodeType === Node.TEXT_NODE) {
    if (originalTextMap.has(root)) {
      const orig = originalTextMap.get(root);
      if (orig && !/[\u0900-\u097F]/.test(orig)) {
        root.nodeValue = orig;
      }
    }
    return;
  }

  if (root.nodeType === Node.ELEMENT_NODE) {
    const el = root as HTMLElement;
    if (originalPlaceholderMap.has(el)) {
      el.setAttribute('placeholder', originalPlaceholderMap.get(el) || '');
    }
    if (originalTitleMap.has(el)) {
      el.setAttribute('title', originalTitleMap.get(el) || '');
    }
    const children = Array.from(root.childNodes);
    for (const child of children) {
      restoreElementAndChildren(child);
    }
  }
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (text: string) => text,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  // Sync Google Translate cookie / select element if present
  const syncGoogleTranslate = (lang: Language) => {
    if (typeof window === 'undefined') return;
    try {
      const val = lang === 'hi' ? '/en/hi' : '/en/en';
      document.cookie = `googtrans=${val}; path=/;`;
      if (window.location.hostname && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        document.cookie = `googtrans=${val}; domain=${window.location.hostname}; path=/;`;
      }
      const combo = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
      if (combo) {
        combo.value = lang;
        combo.dispatchEvent(new Event('change'));
      }
    } catch {
      // ignore
    }
  };

  const applyDOM = (lang: Language) => {
    if (typeof window === 'undefined' || !document.body || isTranslating) return;
    isTranslating = true;
    try {
      if (lang === 'hi') {
        translateElementAndChildren(document.body);
      } else {
        restoreElementAndChildren(document.body);
      }
    } finally {
      setTimeout(() => {
        isTranslating = false;
      }, 30);
    }
  };

  useEffect(() => {
    try {
      const stored = localStorage.getItem('vidyasetu_lang') as Language;
      if (stored === 'hi' || stored === 'en') {
        setLanguageState(stored);
        document.documentElement.lang = stored;
        syncGoogleTranslate(stored);
        if (stored === 'hi') {
          setTimeout(() => applyDOM('hi'), 100);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Set up MutationObserver to translate any newly added nodes when language is Hindi
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let timer: NodeJS.Timeout | null = null;
    const observer = new MutationObserver(() => {
      if (isTranslating) return;
      if (language === 'hi') {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
          applyDOM('hi');
        }, 50);
      }
    });

    if (document.body) {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }

    return () => {
      if (timer) clearTimeout(timer);
      observer.disconnect();
    };
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('vidyasetu_lang', lang);
      document.documentElement.lang = lang;
      syncGoogleTranslate(lang);
      applyDOM(lang);
      window.dispatchEvent(new Event('languageChange'));
    } catch {
      // ignore
    }
  };

  const toggleLanguage = () => {
    const nextLang = language === 'en' ? 'hi' : 'en';
    setLanguage(nextLang);
  };

  const t = (text: string, fallback?: string): string => {
    if (language === 'en') return text;
    const trimmed = text.trim();
    if (HINDI_DICTIONARY[trimmed]) {
      return HINDI_DICTIONARY[trimmed];
    }
    return fallback || HINDI_DICTIONARY[text] || text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
