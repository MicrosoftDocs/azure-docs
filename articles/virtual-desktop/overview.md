---
title: What is Windows Virtual Desktop? (preview)  - Azure
description: An overview of Windows Virtual Desktop.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: overview
ms.date: 03/21/2019
ms.author: helohr
---
# What is Windows Virtual Desktop? 

Windows Virtual Desktop is a comprehensive desktop and app virtualization service running on the cloud.

Here’s what you can do when you run Windows Virtual Desktop on Azure:

* Set up a multi-session Windows 10 deployment that delivers a full Windows 10 with scalability
* Virtualize Office 365 ProPlus and optimize it to run in multi-user virtual scenarios
* Provide Windows 7 virtual desktops with free Extended Security Updates
* Bring your existing Remote Desktop Services (RDS) and Windows Server desktops and apps to any computer
* Virtualize both desktops and apps
* Manage Windows 10, Windows Server, and Windows 7 desktops and apps with a unified management experience

## Key capabilities

With Windows Virtual Desktop, you can:

* Benefit from a scalable and flexible environment
    * Create a full desktop virtualization environment in your Azure subscription without having to run any additional gateway servers.
    * Publish as many host pools as you need to accommodate your diverse workloads.
    * Bring your own image for production workloads or test from the Azure Gallery.
    * Reduce costs with pooled, multi-session resources. With the new Windows 10 Enterprise multi-session capability exclusive to Windows Virtual Desktop and Remote Desktop Session Host (RDSH) role on Windows Server, you can greatly reduce the number of virtual machines and operating system (OS) overhead while still providing the same resources to your users.
* Provide individual ownership through personal (persistent) desktops.
    * Streamline deployment and management
    * Use the Windows Virtual Desktop PowerShell and REST interfaces to configure the host pools, create app groups, assign users, and publish resources
    * Publish full desktop or individual remote apps from a single host pool, create individual app groups for different sets of users, or even assign users to multiple app groups to reduce the number of images.
    * As you manage your environment, use built-in delegated access to assign roles and collect diagnostics to understand various configuration or user errors.
    * Use the new Diagnostics service to troubleshoot errors. 
    * Only manage the image and virtual machines, not the infrastructure. You don't need to personally manage the Remote Desktop roles like you do with Remote Desktop Services, just the virtual machines in your Azure subscription.
* Once assigned, users can launch any Windows Virtual Desktop client to connect users to their published Windows desktops and applications. Connect from any device through either a native application on your device or the Windows Virtual Desktop HTML5 web client.
* Securely establish users through reverse connections to the service, so you never have to leave any inbound ports open.

## Requirements

There are a few things you need to set up Windows Virtual Desktop and successfully connect your users to their Windows desktops and applications.

First, make sure you have the appropriate licenses for your users based on the desktop and apps you plan to deploy:

|OS|Required License|
|---|---|
|Windows 10 Enterprise multi-session or Windows 10 single-session|Microsoft E3, E5, A3, A5, Business<br>Windows E3, E5, A3, A5|
|Windows 7|Microsoft E3, E5, A3, A5, Business<br>Windows E3, E5, A3, A5|
|Windows Server 2012 R2, 2016, 2019|RDS Client Access License (CAL) with Software Assurance|

Your infrastructure needs the following things to support Windows Virtual Desktop:

* An [Azure Active Directory](https://docs.microsoft.com/en-us/azure/active-directory/)
* A Windows Server Active Directory in sync with Azure Active Directory. This can be enabled through:
  * Azure AD Connect
  * Azure AD Domain Services
* An Azure subscription, containing:
  * A virtual network either containing or connected to the Windows Server Active Directory
  
The Azure virtual machines you create for Windows Virtual Desktop must be:

* [Standard domain-joined](https://docs.microsoft.com/en-us/microsoft-desktop-optimization-pack/appv-v4/domain-joined-and-non-domain-joined-clients) or [Hybrid AD-joined](https://docs.microsoft.com/en-us/azure/active-directory/devices/hybrid-azuread-join-plan). Virtual machines can't be Azure AD-joined.
* Running one of the following supported OS images:
  * Windows 10 Enterprise multi-session
  * Windows Server 2016

## Get started

To get started, you'll need to create a tenant. To learn more about how to create a tenant, continue to the tenant creation tutorial.

> [!div class="nextstepaction"]
> [Create a host pool with Azure Marketplace](tenant-setup-azure-active-directory.md)
