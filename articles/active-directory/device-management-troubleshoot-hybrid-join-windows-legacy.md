---
title: Troubleshooting hybrid Azure Active Directory joined down-level devices | Microsoft Docs
description: Troubleshooting hybrid Azure Active Directory joined down-level devices. 
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
ms.date: 04/23/2018
ms.author: markvi
ms.reviewer: jairoc

---
# Troubleshooting hybrid Azure Active Directory joined down-level devices 

This article is applicable only to the following devices: 

- Windows 7 
- Windows 8.1 
- Windows Server 2008 R2 
- Windows Server 2012 
- Windows Server 2012 R2 
 

For Windows 10 or Windows Server 2016, see [Troubleshooting hybrid Azure Active Directory joined Windows 10 and Windows Server 2016 devices](device-management-troubleshoot-hybrid-join-windows-current.md).

This article assumes that you have [configured hybrid Azure Active Directory joined devices](device-management-hybrid-azuread-joined-devices-setup.md) to support the following scenarios:

- Device-based conditional access

- [Enterprise roaming of settings](active-directory-windows-enterprise-state-roaming-overview.md)

- [Windows Hello for Business](active-directory-azureadjoin-passport-deployment.md) 





This article provides you with troubleshooting guidance on how to resolve potential issues.  

**What you should know:** 

- The maximum number of devices per user is device-centric. For example, if *jdoe* and *jharnett* sign in to a device, a separate registration (DeviceID) is created for each of them in the **USER** info tab.  

- The initial registration / join of devices is configured to perform an attempt at either logon or lock / unlock. There could be 5-minute delay triggered by a task scheduler task. 

- A reinstallation of the operating system or manual re-registration may create a new registration in Azure AD, which results in multiple entries under the USER info tab in the Azure portal. 

- Make sure [KB4284842](https://support.microsoft.com/en-us/help/4284842) is installed, in case of Windows 7 SP1 or Windows Server 2008 R2 SP1. This update prevents future authentication failures due to customer's access loss to protected keys after changing password.

## Step 1: Retrieve the registration status 

**To verify the registration status:**  

1. Sign on with the user account that has performed a hybrid Azure AD join.

2. Open the command prompt as an administrator 

3. Type `"%programFiles%\Microsoft Workplace Join\autoworkplace.exe" /i`

This command displays a dialog box that provides you with more details about the join status.

![Workplace Join for Windows](./media/active-directory-device-registration-troubleshoot-windows-legacy/01.png)


## Step 2: Evaluate the hybrid Azure AD join status 

If the hybrid Azure AD join was not successful, the dialog box provides you with details about the issue that has occurred.

**The most common issues are:**

- A misconfigured AD FS or Azure AD

    ![Workplace Join for Windows](./media/active-directory-device-registration-troubleshoot-windows-legacy/02.png)

- You are not signed on as a domain user

    ![Workplace Join for Windows](./media/active-directory-device-registration-troubleshoot-windows-legacy/03.png)
    
    There are a few different reasons why this can occur:
    
    - The signed in user is not a domain user (for example, a local user). Hybrid Azure AD join on down-level devices is supported only for domain users.
    
    - Autoworkplace.exe is unable to silently authenticate with Azure AD or AD FS. This could be due to an out-bound network connectivity issues to the Azure AD URLs. It could also be that multi-factor authentication (MFA) is enabled/configured for the user and WIAORMUTLIAUTHN is not configured at the federation server. Another possibility is that home realm discovery (HRD) page is waiting for user interaction, which prevents **autoworkplace.exe** from silently obtaining a token.
    
    - Your organization uses Azure AD Seamless Single Sign-On, `https://autologon.microsoftazuread-sso.com` or `https://aadg.windows.net.nsatc.net` are not present on the device's IE intranet settings, and **Allow updates to status bar via script** is not enabled for the Intranet zone.

- A quota has been reached

    ![Workplace Join for Windows](./media/active-directory-device-registration-troubleshoot-windows-legacy/04.png)

- The service is not responding 

    ![Workplace Join for Windows](./media/active-directory-device-registration-troubleshoot-windows-legacy/05.png)

You can also find the status information in the event log under: **Applications and Services Log\Microsoft-Workplace Join**
  
**The most common causes for a failed hybrid Azure AD join are:** 

- Your computer is not connected to your organization’s internal network or to a VPN with a connection to your on-premises AD domain controller.

- You are logged on to your computer with a local computer account. 

- Service configuration issues: 

  - The federation server has been configured to support **WIAORMULTIAUTHN**. 

  - Your computer's forest has no Service Connection Point object that points to your verified domain name in Azure AD 

  - A user has reached the limit of devices. 

## Next steps

For questions, see the [device management FAQ](device-management-faq.md)  
