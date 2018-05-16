---
title: Azure Active Directory device management FAQ | Microsoft Docs
description: Azure Active Directory device management FAQ.
services: active-directory
documentationcenter: ''
author: MarkusVi
manager: mtillman

ms.assetid: cdc25576-37f2-4afb-a786-f59ba4c284c2
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/15/2018
ms.author: markvi
ms.reviewer: jairoc

---
# Azure Active Directory device management FAQ



**Q: How can I register a macOS device?**

**A:** To register macOS device:

1.	[Create a compliance policy](https://docs.microsoft.com/intune/compliance-policy-create-mac-os)
2.	[Define a conditional access policy for macOS devices](active-directory-conditional-access-azure-portal.md) 

**Remarks:**

- The users that are included in your conditional access policy need a [supported version of Office for macOS](active-directory-conditional-access-technical-reference.md#client-apps-condition) to access resources. 

- During the first access attempt, your users are prompted to enroll the device using the company portal.

---

**Q: I registered the device recently. Why can’t I see the device under my user info in the Azure portal?**

**A:** Windows 10 devices that are hybrid Azure AD joined do not show up under the USER devices.
You need to use PowerShell to see all devices. 

Only the following devices are listed under the USER devices:

- All personal devices that are not hybrid Azure AD joined. 
- All non-Windows 10 / Windows Server 2016 devices.
- All non-Windows devices 

---

**Q: Why can I not see all the devices registered in Azure Active Directory in the Azure portal?** 

**A:** You can now see them under Azure AD Directory -> all devices menu. 
You can also use Azure PowerShell to find all devices. 
For more details, see the [Get-MsolDevice](/powershell/module/msonline/get-msoldevice?view=azureadps-1.0) cmdlet.

--- 

**Q: How do I know what the device registration state of the client is?**

**A:** For Windows 10 and Windows Server 2016 or later devices, run dsregcmd.exe /status.

For down-level OS versions, run "%programFiles%\Microsoft Workplace Join\autoworkplace.exe"

---

**Q: Why is a device I have deleted in the Azure portal or using Windows PowerShell still listed as registered?**

**A:** This is by design. The device will not have access to resources in the cloud. 
If you want to re-register again, a manual action must be to be taken on the device. 

To clear the join state from Windows 10 and Windows Server 2016 that are on-premises AD domain-joined:

1.	Open the command prompt as an administrator.

2.	Type `dsregcmd.exe /debug /leave`

3.	Sign out and sign in to trigger the scheduled task that registers the device with Azure AD again. 

For down-level Windows OS versions that are on-premises AD domain-joined:

1.	Open the command prompt as an administrator.
2.	Type `"%programFiles%\Microsoft Workplace Join\autoworkplace.exe /l"`.
3.	Type `"%programFiles%\Microsoft Workplace Join\autoworkplace.exe /j"`.

---

**Q: Why do I see duplicate device entries in Azure portal?**

**A:**

-	For Windows 10 and Windows Server 2016, if there are repeated attempts to unjoin and re-join the same device, there might be duplicate entries. 

-	If you have used Add Work or School Account, each windows user who uses Add Work or School Account will create a new device record with the same device name.

-	For down-level Windows OS versions that are on-premises AD domain-joined using automatic registration will create a new device record with the same device name for each domain user who logs into the device. 

-	An Azure AD joined machine that has been wiped, re-installed and re-joined with the same name, will show up as another record with the same device name.

---

**Q: Why can a user still access resources from a device I have disabled in the Azure portal?**

**A:** It can take up to an hour for a revoke to be applied.

>[!Note] 
>For enrolled devices, we recommend wiping the device to ensure that users cannot access the resources. For more details, see [Enroll devices for management in Intune](https://docs.microsoft.com/intune/deploy-use/enroll-devices-in-microsoft-intune). 


---

**Q: Why do my users see “You can’t get there from here”?**

**A:** If you have configured certain conditional access rules to require a specific device state and the device does not meet the criteria, users are blocked and see this message. 
Please evaluate the conditional access policy rules and ensure that the device is able to meet the criteria to avoid this message.

---


**Q: I see the device record under the USER info in the Azure portal and can see the state as registered on the client. Am I setup correctly for using conditional access?**

**A:** The device join state, reflected by deviceID, must match with that on Azure AD and meet any evaluation criteria for conditional access. 
For more details, see [Get started with Azure Active Directory Device Registration](active-directory-device-registration.md).

---

**Q: Why do I get a "username or password is incorrect" message for a device I have just joined to Azure AD?**

**A:** Common reasons for this scenario are:

- Your user credentials are no longer valid.

- Your computer is unable to communicate with Azure Active Directory. Check for any network connectivity issues.

- The Azure AD Join pre-requisites were not met. Please ensure that you have followed the steps for [Extending cloud capabilities to Windows 10 devices through Azure Active Directory Join](active-directory-azureadjoin-overview.md).  

- Federated logins requires your federation server to support a WS-Trust active endpoint. 

---

**Q: Why do I see the “Oops… an error occurred!" dialog when I try do Azure AD join my PC?**

**A:** This is a result of setting up Azure Active Directory enrollment with Intune. Please make sure that the user attempting to do Azure AD join has correct Intune license assigned. For more details, see [Set up Windows device management](https://docs.microsoft.com/intune/deploy-use/set-up-windows-device-management-with-microsoft-intune#azure-active-directory-enrollment).  

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

- [Troubleshooting auto-registration of domain joined computers to Azure AD – Windows 10 and Windows Server 2016](device-management-troubleshoot-hybrid-join-windows-current.md)

- [Troubleshooting auto-registration of domain joined computers to Azure AD for Windows down-level clients](device-management-troubleshoot-hybrid-join-windows-legacy.md)
 
---

