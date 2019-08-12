---
title: Windows 10 Enterprise multi-session FAQ and best practices - Azure
description: Frequently asked questions and best practices for using Windows 10 Enterprise multi-session for Windows Virtual Desktop.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 08/12/2019
ms.author: helohr
---
# Windows 10 Enterprise multi-session FAQ and best practices

Windows Virtual Desktop supports multiple operating systems, including:

<!--I thought we weren't supposed to mention we supported these OSes yet?-->
<!--This isn't much of an intro paragraph, and I don't think we do "applies to" sections in Azure-->

- Windows 7 with 3 years of free extended security updates
- Windows 10 Enterprise
- Windows Server 2012 R2
- Windows Server 2016
- Windows Server 2019
- Windows 10 Enterprise multi-session
 
## What is Windows 10 Enterprise multi-session? 

Windows 10 Enterprise multi-session, earlier referred to as Windows 10 Enterprise for Virtual Desktops (EVD), is a new Remote Desktop Session Host that allows multiple concurrent interactive sessions, a capability previously exclusive to Windows Server. This gives users a familiar Windows 10 experience while IT can benefit from the cost advantages of multi-session and use existing per user windows licensing instead of RDS Client Access Licenses (CALs). For more information about licenses and pricing, see [Windows Virtual Desktop pricing](https://azure.microsoft.com/pricing/details/virtual-desktop/). 
 
## How many users can simultaneously have an interactive session on Windows 10 Enterprise multi-session?

How many interactive sessions that can be active at the same time relies on how many hardware resources are assigned to your system (vCPU, memory, disk, and vGPU) and how your users use their applications while signed in to a session. It also depends on how heavy of a workload your system is under, so we recommend validating performance. To learn more, see [Windows Virtual Desktop pricing](https://azure.microsoft.com/pricing/details/virtual-desktop/). 
 
## My application is reporting this is a server operating system

Windows 10 Enterprise multi-session is a virtual edition of Windows 10 Enterprise. One of the differences is that this operating system reports the [ProductType](https://docs.microsoft.com/windows/desktop/cimwin32prov/win32-operatingsystem) as having a value of 2, the same value as Windows Server. This is to keep it compatible with existing RDSH management tooling, RDSH multi-session-aware applications, and mostly low-level system performance optimizations for RDSH environments. Some application installers check whether the ProductType is set to **Client** and block installation on Windows 10 multi-session as a result. If your app won't install, contact your application vendor for an updated version. 
 
## Can I run Windows 10 Enterprise multi-session on-premises?

Windows 10 Enterprise multi-session is optimized for Windows Virtual Desktop, an Azure service, and is not allowed to run in on-premises production environments. It’s against the licensing agreement to run Windows 10 Enterprise multi-session outside of Azure for production purposes. Windows 10 Enterprise multi-session will not activate against on-premise Key Management Services (KMS).  
 
## How do I customize the Windows 10 Enterprise multi-session image for my organization?

You can start a virtual machine (VM) in Azure with Windows 10 Windows 10 Enterprise multi-session and customize it by installing LOB applications, sysprep/generalize, and then create an image using the Azure portal.  
 
Alternatively, you can create a VM in Azure with Windows 10 Windows 10 Enterprise multi-session. Instead of starting the VM in Azure, you can download the VHD directly. After that, you can use the downloaded VHD to create a new Generation 1 VM on a Windows 10 PC with Hyper-V enabled.

Customize the image to your needs by installing LOB applications and sysprep the image. Once done, you can upload the image to Azure and put the VHD in an image.   You can then use the marketplace offering called “Windows Virtual Desktop” to deploy a new host pool with the customized image. 
 
## How do I manage Windows 10 Enterprise multi-session after deployment?

You can use any supported configuration tool, but we recommend System Center Configuration Manager 1906 because it supports Windows 10 Enterprise multi-session. We're currently working on Microsoft Intune support.
 
## Can Windows 10 Enterprise multi-session be Azure Active Directory (AAD) joined?

Windows 10 Enterprise multi-session currently is supported to be hybrid joined. After Windows 10 Enterprise multi-session is domain joined, use the existing Group Policy Object to enable AAD registration. We're currently working on Azure AD support (non-hybrid).
 
## Where can I find the Windows 10 Enterprise multi-session image?

Windows 10 Enterprise multi-session can be found in the Azure gallery. To find it, navigate to the Azure portal and find the Windows 10 Enterprise for Virtual Desktops release. For an image integrated with Office Pro Plus, find Microsoft Windows 10 + Office 365 ProPlus.
 
<!--Do we really need instructions for this?-->

## Which Windows 10 Enterprise multi-session image should I use?

In the Azure gallery, you can find several releases including Windows 10 Enterprise multi-session, version 1809 and Windows 10 Enterprise multi-session, version 1903. We recommend using the latest version for improved performance and reliability.
 
## Which Windows 10 Enterprise multi-session versions are supported?

Windows 10 Enterprise multi-session, versions 1809, 1903, and later are supported and are available in the Azure gallery. These releases follow the same support life cycle policy as Windows 10 Enterprise. This means the spring release is supported for 18 months and the fall release for 30 months.
 
##Which profile management solution should I use for Windows 10 Enterprise multi-session?

In non-persistent virtualized environments, we recommended using a roaming profile solution. This greatly enhances user experience by making sure the user profile is available and up-to-date whenever a user session is created. We highly recommend using FSLogix on Windows 10 Enterprise multi-session to provide seamless profile management. FSLogix can store the user profile in a virtual hard drive (VHD or VHDX) outside of the VM on a fileserver and/or Azure blob. When a user is assigned a VM and a session is created, the FSLogix technology makes sure the VHD/VHDX is mounted to %userprofile%. All WVD users are entitled to use FSLogix at no additional cost.

<!--This sounds like marketing language. Change?-->
 
For more information about how to configure the FSLogix profile container, see [Configure the FSLogix profile container](./virtual-desktop/create-host-pools-user-profile#configure-the-fslogix-profile-container).  

## Which license do I need to access Windows 10 Enterprise multi-session?

A user connecting to Windows 10 Enterprise multi-session needs to have one of the following licenses:

- Windows 10 Enterprise E3 per-user 
- Windows 10 Enterprise E5 per-user 
- Microsoft 365 E3 per-user 
- Microsoft 365 E5 per-user 
- Microsoft 365 Business per-user 
- Microsoft 365 F1 per-user 
 
Accessing Windows 10 Enterprise multi-session doesn't require an RDS Client Access License (CAL).

For more information about licenses and pricing, see [Windows Virtual Desktop pricing](https://azure.microsoft.com/pricing/details/virtual-desktop/).
 
## How do I get started?

Learn more about Windows Virtual Desktop and Windows 10 Enterprise multi-session by reading the [Windows Virtual Desktop Preview documentation](overview.md), visit our [TechCommunity](https://techcommunity.microsoft.com/t5/Windows-Virtual-Desktop/bd-p/WindowsVirtualDesktop), or follow along with the [Windows Virtual Desktop tutorials](./virtual-desktop/tenant-setup-azure-active-directory.md).