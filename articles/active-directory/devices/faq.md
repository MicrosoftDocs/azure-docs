---
title: Azure Active Directory device management FAQ | Microsoft Docs
description: Azure Active Directory device management FAQ.
services: active-directory
documentationcenter: ''
author: MarkusVi
manager: mtillman

ms.assetid: cdc25576-37f2-4afb-a786-f59ba4c284c2
ms.service: active-directory
ms.component: devices
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/15/2018
ms.author: markvi
ms.reviewer: jairoc

---

# Azure Active Directory device management FAQ

**Q: I registered the device recently. Why can’t I see the device under my user info in the Azure portal? Or why is the device owner marked as N/A for hybrid Azure Active Directory (Azure AD) joined devices?**

**A:** Windows 10 devices that are hybrid Azure AD joined don't show up under **USER devices**.
You need to use the **All devices** view in the Azure portal. You can also use a PowerShell [Get-MsolDevice](/powershell/module/msonline/get-msoldevice?view=azureadps-1.0) cmdlet.

Only the following devices are listed under **USER devices**:

- All personal devices that aren't hybrid Azure AD joined. 
- All non-Windows 10 or Windows Server 2016 devices.
- All non-Windows devices. 

--- 

**Q: How do I know what the device registration state of the client is?**

**A:** In the Azure portal, go to **All devices**. Search for the device by using the device ID. Check the value under the join type column. Sometimes, the device might be reset or reimaged. So it's essential to also check the device registration state on the device:

- For Windows 10 and Windows Server 2016 or later devices, run `dsregcmd.exe /status`.
- For down-level OS versions, run `%programFiles%\Microsoft Workplace Join\autoworkplace.exe`.

---

**Q: I see the device record under the **USER** info in the Azure portal. And I see the state as registered on the device. Am I set up correctly to use conditional access?**

**A:** The device join state, reflected by **deviceID**, must match the state on Azure AD and meet any evaluation criteria for conditional access. 
For more information, see [Require managed devices for cloud app access with conditional access](../conditional-access/require-managed-devices.md).

---

**Q: I deleted my device in the Azure portal or by using Windows PowerShell. But the local state on the device says it's still registered.**

**A:** This operation is by design. The device doesn't have access to resources in the cloud. 

If you want to re-register, you must take a manual action on the device. 

To clear the join state from Windows 10 and Windows Server 2016 that are on-premises Active Directory domain joined, take the following steps:

1.	Open the command prompt as an administrator.

2.	Enter `dsregcmd.exe /debug /leave`.

3.	Sign out and sign in to trigger the scheduled task that registers the device with Azure AD again. 

For down-level Windows OS versions that are on-premises Active Directory domain joined:

1.	Open the command prompt as an administrator.
2.	Enter `"%programFiles%\Microsoft Workplace Join\autoworkplace.exe /l"`.
3.	Enter `"%programFiles%\Microsoft Workplace Join\autoworkplace.exe /j"`.

---

**Q: Why do I see duplicate device entries in the Azure portal?**

**A:**

-	For Windows 10 and Windows Server 2016, repeated attempts to unjoin and rejoin the same device might cause duplicate entries. 

-	If you use **Add Work or School Account**, each Windows user who uses **Add Work or School Account** creates a new device record with the same device name.

-	For down-level Windows OS versions that are on-premises Azure Directory domain joined, automatic registration creates a new device record with the same device name for each domain user who signs in to the device. 

-	An Azure AD joined machine that's wiped, reinstalled, and rejoined with the same name shows up as another record with the same device name.

---

**Q: Why can a user still access resources from a device I disabled in the Azure portal?**

**A:** It takes up to an hour for a revoke to be applied.

>[!NOTE] 
>For enrolled devices, we recommend that you wipe the device to make sure users can't access the resources. For more information, see [What is device enrollment?](https://docs.microsoft.com/intune/deploy-use/enroll-devices-in-microsoft-intune). 

---

## Azure AD join FAQ

**Q: How do I unjoin an Azure AD joined device locally on the device?**

**A:** 
- For hybrid Azure AD joined devices, make sure to turn off automatic registration. Then the scheduled task doesn't register the device again. Next, open a command prompt as an administrator and enter `dsregcmd.exe /debug /leave`. Or run this command as a script across multiple devices to unjoin in bulk.

- For pure Azure AD joined devices, make sure you have an offline local administrator account or create one. You can't sign in with any Azure AD user credentials. Next, go to **Settings** > **Accounts** > **Access Work or School**. Select your account and select **Disconnect**. Follow the prompts and provide the local administrator credentials when prompted. Reboot the device to finish the unjoin process.

---

**Q: Can my users sign in to Azure AD joined devices that are deleted or disabled in Azure AD?**

**A:** Yes. Windows has cached username and password capability that allows users who signed in previously to access the desktop quickly even without network connectivity. When a device is deleted or disabled in Azure AD, it's not known to the Windows device. So users who signed in previously continue to access the desktop with the cached username and password. But as the device is deleted or disabled, users can't access any resources protected by device-based conditional access. 

Users who who didn't sign in previously can't access the device. There's no cached username and password enabled for them. 

---

**Q: Can disabled or deleted users sign in to Azure AD joined devices?**

**A:** Yes, but only for a limited time. When a user is deleted or disabled in Azure AD, it's not immediately known to the Windows device. So users who signed in previously can access the desktop with the cached username and password. Typically, the device is aware of the user state in less than four hours. Then Windows blocks those users' access to the desktop. As the user is deleted or disabled in Azure AD, all their tokens are revoked. So they can't access any resources. 

Deleted or disabled users who didn't sign in previously can't access a device. There's no cached username and password enabled for them. 

---

**Q: My users can't search printers from Azure AD joined devices. How can I enable printing from those devices?**

**A:** To deploy printers for Azure AD joined devices, see [Deploy Windows Server Hybrid Cloud Print with Pre-Authentication](https://docs.microsoft.com/windows-server/administration/hybrid-cloud-print/hybrid-cloud-print-deploy). You need an on-premises Windows Server to deploy hybrid cloud print. Currently, cloud-based print service isn't available. 

---

**Q: How do I connect to a remote Azure AD joined device?**

**A:** See [Connect to remote Azure Active Directory-joined PC](https://docs.microsoft.com/windows/client-management/connect-to-remote-aadj-pc).

---

**Q: Why do my users see *You can’t get there from here*?**

**A:** If you configure certain conditional access rules to require a specific device state, and the device doesn't meet the criteria, users are blocked. They see that message. 
Evaluate the conditional access policy rules. Make sure the device meets the criteria to avoid the message.

---

**Q: Why don't some of my users get Azure Multi-Factor Authentication prompts on Azure AD joined devices?**

**A:** If a user joins or registers a device with Azure AD by using Multi-Factor Authentication, the device itself becomes a trusted second factor for that particular user. Then whenever the same user signs in to the device and accesses an application, Azure AD considers the device as a second factor. It enables that user to seamlessly access applications without additional Multi-Factor Authentication prompts. 

This behavior isn't applicable to any other user who signs in to that device. So all other users who access that device are prompted with a Multi-Factor Authentication challenge before they access applications that require Multi-Factor Authentication.

---

**Q: Why do I get a *username or password is incorrect* message for a device I just joined to Azure AD?**

**A:** Common reasons for this scenario are as follows:

- Your user credentials are no longer valid.

- Your computer can't communicate with Azure Active Directory. Check for any network connectivity issues.

- Federated sign-ins require your federation server to support WS-Trust endpoints that are enabled and accessible. 

- You enabled pass-through authentication. So your temporary password needs to be changed when you sign in.

---

**Q: Why do I see the *Oops… an error occurred!* dialog when I try to Azure AD join my PC?**

**A:** This error happens when you set up Azure Active Directory enrollment with Intune. Make sure that the user who attempts to Azure AD join has the correct Intune license assigned. For more information, see [Set up enrollment for Windows devices](https://docs.microsoft.com/intune/deploy-use/set-up-windows-device-management-with-microsoft-intune#azure-active-directory-enrollment).  

---

**Q: Why did my attempt to Azure AD join a PC fail, although I didn't get any error information?**

**A:** A likely cause is that you signed in to the device by using the local built-in administrator account. 
Create a different local account before you use Azure Active Directory join to finish the setup. 

---

## Hybrid Azure AD join FAQ

**Q: Where can I find troubleshooting information to diagnose hybrid Azure AD join failures?**

**A:** For troubleshooting information, see these articles:

- [Troubleshooting hybrid Azure Active Directory joined Windows 10 and Windows Server 2016 devices](troubleshoot-hybrid-join-windows-current.md)

- [Troubleshooting hybrid Azure Active Directory joined down-level devices](troubleshoot-hybrid-join-windows-legacy.md)
 
**Q: Why do I see a duplicate Azure AD registered record for my Windows 10 hybrid Azure AD joined device in the Azure AD devices list?**

**A:** When your users add their accounts to apps on a domain-joined device, they might be prompted: **Add account to Windows?**. If they enter **Yes** on the prompt, the device registers with Azure AD. The trust type is marked as Azure AD registered. After you enable Hybrid Azure AD join in your organization, the device also gets hybrid Azure AD joined. Then two device states show up for the same device. 

However, hybrid Azure AD join takes precedence over the Azure AD registered state. So your device is considered hybrid Azure AD joined for any authentication and conditional access evaluation. You can safely delete the Azure AD registered device record from the Azure AD portal. Learn to [avoid or cleanup this dual state on the Windows 10 machine](https://docs.microsoft.com/azure/active-directory/devices/hybrid-azuread-join-plan#review-things-you-should-know) in the Hybrid Azure AD join article. 

---

## Azure AD register FAQ

**Q: Can I register Android or iOS BYOD devices?**

**A:** Yes, but only with Azure device registration service and for hybrid customers. It's not supported with on-premises device registration service in Active Directory Federation Services (AD FS).

**Q: How can I register a macOS device?**

**A:** Take the following steps:

1.	[Create a compliance policy](https://docs.microsoft.com/intune/compliance-policy-create-mac-os)
2.	[Define a conditional access policy for macOS devices](../active-directory-conditional-access-azure-portal.md) 

**Remarks:**

- The users included in your conditional access policy need a [supported version of Office for macOS](../conditional-access/technical-reference.md#client-apps-condition) to access resources. 

- During the first access attempt, your users are prompted to enroll the device by using the company portal.

---
