---
title: Troubleshooting hybrid Azure Active Directory joined down-level devices | Microsoft Docs
description: Troubleshooting hybrid Azure Active Directory joined down-level devices. 
services: active-directory
documentationcenter: ''
author: MarkusVi
manager: femila

ms.assetid: cdc25576-37f2-4afb-a786-f59ba4c284c2
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/17/2017
ms.author: markvi
ms.reviewer: jairoc

---
# Troubleshooting hybrid Azure Active Directory joined down-level devices 

This topic is applicable only to the following devices: 

- Windows 7 
- Windows 8.1 
- Windows Server 2008 R2 
- Windows Server 2012 
- Windows Server 2012 R2 
 

For Windows 10 or Windows Server 2016, see [Troubleshooting hybrid Azure Active Directory joined Windows 10 and Windows Server 2016 devices](device-management-troubleshoot-hybrid-join-windows-current.md).

This topic assumes that you have [configured hybrid Azure Active Directory joined devices](device-management-hybrid-azuread-joined-devices-setup.md) to support the following scenarios:

- Device-based conditional access

- [Enterprise roaming of settings](active-directory-windows-enterprise-state-roaming-overview.md)

- [Windows Hello for Business](active-directory-azureadjoin-passport-deployment.md) 





This topic provides you with troubleshooting guidance on how to resolve potential issues.  

**What you should know:** 

- The maximum number of devices per user is device-centric. For example, if *jdoe* and *jharnett* sign-in to a device, a separate registration (DeviceID) is created for each of them in the **USER** info tab.  

- The initial registration / join of devices is configured to perform an attempt at either logon or lock / unlock. There could be 5-minute delay triggered by a task scheduler task. 

- A reinstall of the operating system or a manual unregister and re-register may create a new registration on Azure AD and results in multiple entries under the USER info tab in the Azure portal. 


## Step 1: Retrieve the registration status 

**To verify the registration status:**  

1. Open the command prompt as an administrator 

2. Type `"%programFiles%\Microsoft Workplace Join\autoworkplace.exe /i"`

This command displays a dialog box that provides you with more details about the join status.

![Workplace Join for Windows](./media/active-directory-device-registration-troubleshoot-windows-legacy/01.png)


## Step 2: Evaluate the hybrid Azure AD join status 

If the hybrid Azure AD join was not successful, the dialog box provides you with details about the issue that has occurred.

**The most common issues are:**

- A misconfigured AD FS or Azure AD

    ![Workplace Join for Windows](./media/active-directory-device-registration-troubleshoot-windows-legacy/02.png)

- You are not signed on as a domain user

    ![Workplace Join for Windows](./media/active-directory-device-registration-troubleshoot-windows-legacy/03.png)

- A quota has been reached

    ![Workplace Join for Windows](./media/active-directory-device-registration-troubleshoot-windows-legacy/04.png)

- The service is not responding 

    ![Workplace Join for Windows](./media/active-directory-device-registration-troubleshoot-windows-legacy/05.png)

You can also find the status information in the event log under **Applications and Services Log\Microsoft-Workplace Join**.
  
**The most common causes for a failed hybrid Azure AD join are:** 

- Your computer is not on the organization’s internal network or a VPN without connection to an on-premises AD domain controller.

- You are logged on to your computer with a local computer account. 

- Service configuration issues: 

  - The federation server has been configured to support **WIAORMULTIAUTHN**. 

  - There is no Service Connection Point object that points to your verified domain name in Azure AD in the AD forest where the computer belongs to.

  - A user has reached the limit of devices. 

## Next steps

For questions, see the [device management FAQ](device-management-faq.md)  
