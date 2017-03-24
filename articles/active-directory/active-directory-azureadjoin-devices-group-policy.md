---
title: Connect domain-joined devices to Azure AD for Windows 10 experiences | Microsoft Docs
description: Explains how administrators can configure Group Policy to enable devices to be domain-joined to the enterprise network.
services: active-directory
documentationcenter: ''
author: MarkusVi
manager: femila
editor: ''
tags: azure-classic-portal

ms.assetid: 2ff29f3e-5325-4f43-9baa-6ae8d6bad3e3
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/10/2017
ms.author: markvi

---
# Connect domain-joined devices to Azure AD for Windows 10 experiences
Domain join is the traditional way organizations have connected devices for work for the last 15 years and more. It has enabled users to sign in to their devices by using their Windows Server Active Directory (Active Directory) work or school accounts and allowed IT to fully manage these devices. Organizations typically rely on imaging methods to provision devices to users and generally use System Center Configuration Manager (SCCM) or Group Policy to manage them.


Domain join in Windows 10 provides you with the following benefits after you connect devices to Azure Active Directory (Azure AD):

* Single sign-on (SSO) to Azure AD resources from anywhere
* Access to the enterprise Windows Store by using work or school accounts (no Microsoft account required)
* Enterprise-compliant roaming of user settings across devices by using work or school accounts (no Microsoft account required)
* Strong authentication and convenient sign-in for work or school accounts with Windows Hello for Business and Windows Hello
* Ability to restrict access only to devices that comply with organizational device Group Policy settings

## Prerequisites
Domain join continues to be useful. However, to get the Azure AD benefits of SSO, roaming of settings with work or school accounts, and access to Windows Store with work or school accounts, you will need the following:

* Azure AD subscription
* Azure AD Connect to extend the on-premises directory to Azure AD
* Policy that's set to connect domain-joined devices to Azure AD
* Windows 10 build (build 10551 or newer) for devices

To enable Windows Hello for Business and Windows Hello, you will also need the following:

- **Public key infrastructure (PKI)** for user certificates issuance.

- **System Center Configuration Manager Current Branch** - You need to install version 1606 or better.  
For more information, see: 
    - [Documentation for System Center Configuration Manager](https://technet.microsoft.com/library/mt346023.aspx)
    - [System Center Configuration Manager Team Blog](http://blogs.technet.com/b/configmgrteam/archive/2015/09/23/now-available-update-for-system-center-config-manager-tp3.aspx)
    - [Windows Hello for Business settings in System Center Configuration Manager](https://docs.microsoft.com/sccm/protect/deploy-use/windows-hello-for-business-settings)

As an alternative to the PKI deployment requirement, you can do the following:

* Have a few domain controllers with Windows Server 2016 Active Directory Domain Services.

To enable conditional access, you can create Group Policy settings that allow access to domain-joined devices with no additional deployments. To manage access control based on compliance of the device, you will need the following:

* System Center Configuration Manager Current Branch (1606 or later) for Windows Hello for Business scenarios

## Deployment instructions

To deploy, follow the steps listed in [How to configure automatic registration of Windows domain-joined devices with Azure Active Directory](active-directory-conditional-access-automatic-device-registration-setup.md)

## Next step
* [Windows 10 for the enterprise: Ways to use devices for work](active-directory-azureadjoin-windows10-devices-overview.md)
* [Extending cloud capabilities to Windows 10 devices through Azure Active Directory Join](active-directory-azureadjoin-user-upgrade.md)
* [Learn about usage scenarios for Azure AD Join](active-directory-azureadjoin-deployment-aadjoindirect.md)
* [Connect domain-joined devices to Azure AD for Windows 10 experiences](active-directory-azureadjoin-devices-group-policy.md)
* [Set up Azure AD Join](active-directory-azureadjoin-setup.md)

