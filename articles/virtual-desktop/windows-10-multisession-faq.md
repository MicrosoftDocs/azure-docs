---
title: Windows 10 Enterprise multi-session FAQ - Azure
description: Frequently asked questions and best practices for using Windows 10 Enterprise multi-session for Windows Virtual Desktop.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 08/22/2019
ms.author: helohr
---
# Windows 10 Enterprise multi-session FAQ

This article will answer frequently asked questions and cover best practices for Windows 10 Enterprise multi-session.
 
## What is Windows 10 Enterprise multi-session? 

Windows 10 Enterprise multi-session, earlier referred to as Windows 10 Enterprise for Virtual Desktops (EVD), is a new Remote Desktop Session Host that allows multiple concurrent interactive sessions, a capability previously exclusive to Windows Server. This gives users a familiar Windows 10 experience while IT can benefit from the cost advantages of multi-session and use existing per user windows licensing instead of RDS Client Access Licenses (CALs). For more information about licenses and pricing, see [Windows Virtual Desktop pricing](https://azure.microsoft.com/pricing/details/virtual-desktop/). 
 
## How many users can simultaneously have an interactive session on Windows 10 Enterprise multi-session?

How many interactive sessions that can be active at the same time relies on how many hardware resources are assigned to your system (vCPU, memory, disk, and vGPU) and how your users use their applications while signed in to a session. It also depends on how heavy of a workload your system is under, so we recommend validating performance. To learn more, see [Windows Virtual Desktop pricing](https://azure.microsoft.com/pricing/details/virtual-desktop/). 
 
## Why does my application report Windows 10 Enterprise multi-session as a Server operating system?

Windows 10 Enterprise multi-session is a virtual edition of Windows 10 Enterprise. One of the differences is that this operating system reports the [ProductType](https://docs.microsoft.com/windows/desktop/cimwin32prov/win32-operatingsystem) as having a value of 2, the same value as Windows Server. This is to keep it compatible with existing RDSH management tooling, RDSH multi-session-aware applications, and mostly low-level system performance optimizations for RDSH environments. Some application installers check whether the ProductType is set to **Client** and block installation on Windows 10 multi-session as a result. If your app won't install, contact your application vendor for an updated version. 
 
## Can I run Windows 10 Enterprise multi-session on-premises?

Windows 10 Enterprise multi-session is optimized for Windows Virtual Desktop, an Azure service, and is not allowed to run in on-premises production environments. It’s against the licensing agreement to run Windows 10 Enterprise multi-session outside of Azure for production purposes. Windows 10 Enterprise multi-session will not activate against on-premise Key Management Services (KMS).  
 
## How do I customize the Windows 10 Enterprise multi-session image for my organization?

You can start a virtual machine (VM) in Azure with Windows 10 Windows 10 Enterprise multi-session and customize it by installing LOB applications, sysprep/generalize, and then create an image using the Azure portal.  
 
Alternatively, you can create a VM in Azure with Windows 10 Windows 10 Enterprise multi-session. Instead of starting the VM in Azure, you can download the VHD directly. After that, you can use the downloaded VHD to create a new Generation 1 VM on a Windows 10 PC with Hyper-V enabled.

Customize the image to your needs by installing LOB applications and sysprep the image. Once done, you can upload the image to Azure and put the VHD in an image. You can then use the marketplace offering called “Windows Virtual Desktop” to deploy a new host pool with the customized image. 
 
## How do I manage Windows 10 Enterprise multi-session after deployment?

You can use any supported configuration tool, but we recommend System Center Configuration Manager 1906 because it supports Windows 10 Enterprise multi-session. We're currently working on Microsoft Intune support.
 
## Can Windows 10 Enterprise multi-session be Azure Active Directory (AD)-joined?

Windows 10 Enterprise multi-session is currently supported to be hybrid Azure AD-joined. After Windows 10 Enterprise multi-session is domain-joined, use the existing Group Policy Object to enable Azure AD registration. For more information, see [Plan your hybrid Azure Active Directory join implementation](https://docs.microsoft.com/azure/active-directory/devices/hybrid-azuread-join-plan).
 
## Where can I find the Windows 10 Enterprise multi-session image?

Windows 10 Enterprise multi-session can be found in the Azure gallery. To find it, navigate to the Azure portal and find the Windows 10 Enterprise for Virtual Desktops release. For an image integrated with Office Pro Plus, find Microsoft Windows 10 + Office 365 ProPlus.
 
<!--Do we really need instructions for this?-->

## Which Windows 10 Enterprise multi-session image should I use?

In the Azure gallery, you can find several releases including Windows 10 Enterprise multi-session, version 1809 and Windows 10 Enterprise multi-session, version 1903. We recommend using the latest version for improved performance and reliability.
 
## Which Windows 10 Enterprise multi-session versions are supported?

Windows 10 Enterprise multi-session, versions 1809 and later are supported and are available in the Azure gallery. These releases follow the same support life cycle policy as Windows 10 Enterprise. This means the spring release is supported for 18 months and the fall release for 30 months.
 
## Which profile management solution should I use for Windows 10 Enterprise multi-session?

In non-persistent virtualized environments, we recommend using a roaming profile solution. This ensures the user profile is available and up-to-date whenever a user session is created. We recommend using FSLogix on Windows 10 Enterprise multi-session for seamless profile management. FSLogix can store the user profile in a virtual hard drive (VHD or VHDX) outside of the VM on a file server and/or Azure blob. Whenever a user is assigned a VM and a session is created, FSLogix mounts the virtual hard drive to %userprofile%. All Windows Virtual Desktop users can use FSLogix at no additional cost.

<!--This sounds like marketing language. Change?-->
 
For more information about how to configure an FSLogix profile container, see [Configure the FSLogix profile container](create-host-pools-user-profile.md#configure-the-fslogix-profile-container).  

## Which license do I need to access Windows 10 Enterprise multi-session?

For a full list of applicable licenses, see [Windows Virtual Desktop pricing](https://azure.microsoft.com/pricing/details/virtual-desktop/).
 
## Next steps

Learn more about Windows Virtual Desktop and Windows 10 Enterprise multi-session by reading the [Windows Virtual Desktop Preview documentation](overview.md), visit our [TechCommunity](https://techcommunity.microsoft.com/t5/Windows-Virtual-Desktop/bd-p/WindowsVirtualDesktop), or follow along with the [Windows Virtual Desktop tutorials](tenant-setup-azure-active-directory.md).
