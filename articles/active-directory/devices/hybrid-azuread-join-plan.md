---
title: How to configure hybrid Azure Active Directory joined devices | Microsoft Docs
description: Learn how to configure hybrid Azure Active Directory joined devices.
services: active-directory
documentationcenter: ''
author: MarkusVi
manager: mtillman
editor: ''

ms.assetid: 54e1b01b-03ee-4c46-bcf0-e01affc0419d
ms.service: active-directory
ms.component: devices
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/15/2018
ms.author: markvi
ms.reviewer: jairoc

---
# How to plan your hybrid Azure Active Directory join implementation

As a IT admin, you typically want to so that I can do...
You can accomplish this goal by ...


With device management in Azure Active Directory (Azure AD), you can ensure that your users are accessing your resources from devices that meet your standards for security and compliance. For more details, see [Introduction to device management in Azure Active Directory](../device-management-introduction.md).

If you have an on-premises Active Directory environment and you want to join your domain-joined devices to Azure AD, you can accomplish this by configuring hybrid Azure AD joined devices. This article provides you with the related steps to implement a hybrid Azure AD join in your environment. 


## Prerequisites

This article assumes that you are familiar with the [Introduction to device management in Azure Active Directory](../device-management-introduction.md).


## Plan your implementation

To plan your hybrid Azure AD implementation, you should familiarize yourself with:

|   |   |
|---|---|
|![Check][1]|Review supported devices|
|![Check][1]|Control the hybrid Azure AD join|
|![Check][1]|Select your scenario|


 


## Review supported devices 

Hybrid Azure AD join supports a broad range of Windows devices. Because the configuration for devices running older versions of Windows requires additional or different steps, the supported devices are grouped into two categories:

- **Windows current devices**

    - Windows 10
    
    - Windows Server 2016

- **Windows down-level devices**

    - Windows 8.1
 
    - Windows 7
 
    - Windows Server 2012 R2
 
    - Windows Server 2012 
 
    - Windows Server 2008 R2 


As a first planning step, you should review your environment and determine whether you need to support Windows down-level devices.


### Windows current devices

Windows current devices refers to domain-joined devices running Windows 10 or Windows Server 2016.

For devices running the Windows desktop operating system, the supported version is the Windows 10 Anniversary Update (version 1607) or later. As a best practice, upgrade to the latest version of Windows 10.


### Windows down-level devices

The following Windows down-level devices are supported:

- Windows 8.1
- Windows 7
- Windows Server 2012 R2
- Windows Server 2012
- Windows Server 2008 R2

The registration of Windows down-level devices is not supported for devices configured for user profile roaming or credential roaming. If you are relying on roaming of profiles or settings, use Windows 10.


## Control the hybrid Azure AD join 
 
Hybrid Azure AD join is a process to automatically register your on-premises domain-joined devices with Azure AD. There are cases where you don't want all your devices to register automatically. If this is true for you, see [How to control the hybrid Azure AD join of your devices](hybrid-azuread-join-control.md).

  
## Select your scenario

You can't use a hybrid Azure AD join if your environment consists of a single forest that synchronized identity data to more than one Azure AD tenant.

If you are relying on the System Preparation Tool (Sysprep), make sure you create images from an installation of Windows that has not been configured for hybrid Azure AD join.

If you are relying on a Virtual Machine (VM) snapshot to create additional VMs, make sure you use a VM snapshot that has not been configured for hybrid Azure AD join.



You can configure hybrid Azure AD join for the following scenarios:

- Managed domains
- Federated domains  



If your environment has managed domains, hybrid Azure AD join supports:

- Pass Through Authentication (PTA) 

- Password Has Sync (PHS) with Seamless Single Sign On (SSO) 

Beginning with version 1.1.819.0, Azure AD Connect provides you with a wizard to configure hybrid Azure AD join. The wizard enables you to significantly simplify the configuration process. For more information, see:

- [Configure hybrid Azure Active Directory join for federated domains](hybrid-azuread-join-federated-domains.md)

- [Configure hybrid Azure Active Directory join for managed domains](hybrid-azuread-join-managed-domains.md)


 If installing the required version of Azure AD Connect is not an option for you, see [how to manually configure device registration](../device-management-hybrid-azuread-joined-devices-setup.md). 






## Next steps

> [!div class="nextstepaction"]
> [Configure hybrid Azure Active Directory join for federated domains](hybrid-azuread-join-federated-domains.md)
> [Configure hybrid Azure Active Directory join for managed domains](hybrid-azuread-join-managed-domains.md)
> [Configure hybrid Azure Active Directory join manually](../device-management-hybrid-azuread-joined-devices-setup.md)



<!--Image references-->
[1]: ./media/hybrid-azuread-join-plan/12.png
