---
title: Reporting FAQ | Microsoft Docs
description: Azure Active Directory reporting FAQ.
services: active-directory
documentationcenter: ''
author: MarkusVi
manager: femila

ms.assetid: 6a6d66b0-8607-4273-957b-ade4f9a494ca
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/15/2017
ms.author: markvi

---
# Azure Active Directory reporting FAQ

**Q: Where can I view the existing reports (in Classic portal) in Azure Portal?**

**A:**  

---

**Q: What’s the data retention for Activity logs (Audit and Sign-ins) in the portal?** 

**A:** We provide 7 days of data for our free customers and by switching to Premium 1 and Premium 2 licenses, you can access up to 30 days data. For more detailed information on retention, click here

--- 

**Q: How long will take for me to see the Activity data from the time I completed my task?**

**A:** 

---

**Q: Do I nee to be a Global Admin to see the Activity logs in Azure Portal or get data through the API?**

**A:** 

---

**Q: Which of the Azure AD sign-in and audit reports are free and which reports are available for Premium and Premium 2?**

**A:**



---

**Q: Which of the security reports are free and which reports are available for Premium and Premium 2?**

**A:** 


---

**Q: Can I get O365 Activity log information through Azure Portal?**

**A:** If you have configured certain conditional access rules to require a specific device state and the device does not meet the criteria, users are blocked and see this message. 
Please evaluate the rules and ensure that the device is able to meet the criteria to avoid this message.

---


**Q: I see the device record under the USER info in the Azure portal and can see the state as registered on the client. Am I setup correctly for using conditional access?**

**A:** The device record (deviceID) and state on the Azure portal must match the client and meet any evaluation criteria for conditional access. 
For more details, see [Get started with Azure Active Directory Device Registration](active-directory-conditional-access-device-registration-overview.md).

---

**Q: Why do I get a "username or password is incorrect" message for a device I have just joined to Azure AD?**

**A:** Common reasons for this scenario are:

1.	Your user credentials are no longer valid.

2.	Your computer is unable to communicate with Azure Active Directory. Check for any network connectivity issues.

3.	The Azure AD Join pre-requisites were not met. Please ensure that you have followed the steps for [Extending cloud capabilities to Windows 10 devices through Azure Active Directory Join](active-directory-azureadjoin-overview.md).  

4.	Federated logins requires your federation server to support a WS-Trust active endpoint. 

---

**Q: Why do I see the “Oops… an error occurred!" dialog when I try do join my PC?**

**A:** This is a result of setting up Azure Active Directory enrollment with Intune. For more details, see [Set up Windows device management](https://docs.microsoft.com/intune/deploy-use/set-up-windows-device-management-with-microsoft-intune#azure-active-directory-enrollment).  

---

**Q: Why did my attempt to join a PC fail although I didn't get any error information?**

**A:** A likely cause is that the user is logged in to the device using the built-in administrator account. 
Please create a different local account before using Azure Active Directory Join to complete the setup. 

---

**Q: Where can I find instructions for the setup of automatic device registration?**

**A:** For detailed instructions, see [How to configure automatic registration of Windows domain-joined devices with Azure Active Directory](active-directory-conditional-access-automatic-device-registration-setup.md)

---

**Q: Where can I find troubleshooting information about the automatic device registration?**

**A:** For troubleshooting information, see:

1. [Troubleshooting auto-registration of domain joined computers to Azure AD – Windows 10 and Windows Server 2016](active-directory-conditional-access-automatic-device-registration-troubleshoot-windows.md)

2. [Troubleshooting auto-registration of domain joined computers to Azure AD for Windows down-level clients](active-directory-conditional-access-automatic-device-registration-troubleshoot-windows-legacy.md)
 
---

