---
title: What is Windows Virtual Desktop Preview?  - Azure
description: An overview of Windows Virtual Desktop Preview.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: overview
ms.date: 05/31/2019
ms.author: helohr
---
# What is Windows Virtual Desktop Preview? 

Now available in public preview, Windows Virtual Desktop Preview is a desktop and app virtualization service that runs on the cloud.

Here’s what you can do when you run Windows Virtual Desktop on Azure:

* Set up a multi-session Windows 10 deployment that delivers a full Windows 10 with scalability
* Virtualize Office 365 ProPlus and optimize it to run in multi-user virtual scenarios
* Provide Windows 7 virtual desktops with free Extended Security Updates
* Bring your existing Remote Desktop Services (RDS) and Windows Server desktops and apps to any computer
* Virtualize both desktops and apps
* Manage Windows 10, Windows Server, and Windows 7 desktops and apps with a unified management experience

## Introductory video

In the following video, Scott Manchester demonstrates some of Windows Virtual Desktop's capabilities:

<br></br><iframe src="https://www.youtube-nocookie.com/embed/30dOLcZ4_9U" width="640" height="320" allowFullScreen="true" frameBorder="0"></iframe>

## Key capabilities

With Windows Virtual Desktop, you can set up a scalable and flexible environment:

* Create a full desktop virtualization environment in your Azure subscription without having to run any additional gateway servers.
* Publish as many host pools as you need to accommodate your diverse workloads.
* Bring your own image for production workloads or test from the Azure Gallery.
* Reduce costs with pooled, multi-session resources. With the new Windows 10 Enterprise multi-session capability exclusive to Windows Virtual Desktop and Remote Desktop Session Host (RDSH) role on Windows Server, you can greatly reduce the number of virtual machines and operating system (OS) overhead while still providing the same resources to your users.
* Provide individual ownership through personal (persistent) desktops.

You can deploy and manage virtual desktops:

* Use the Windows Virtual Desktop PowerShell and REST interfaces to configure the host pools, create app groups, assign users, and publish resources.
* Publish full desktop or individual remote apps from a single host pool, create individual app groups for different sets of users, or even assign users to multiple app groups to reduce the number of images.
* As you manage your environment, use built-in delegated access to assign roles and collect diagnostics to understand various configuration or user errors.
* Use the new Diagnostics service to troubleshoot errors.
* Only manage the image and virtual machines, not the infrastructure. You don't need to personally manage the Remote Desktop roles like you do with Remote Desktop Services, just the virtual machines in your Azure subscription.

You can also assign and connect users to your virtual desktops:

* Once assigned, users can launch any Windows Virtual Desktop client to connect users to their published Windows desktops and applications. Connect from any device through either a native application on your device or the Windows Virtual Desktop HTML5 web client.
* Securely establish users through reverse connections to the service, so you never have to leave any inbound ports open.

## Requirements

There are a few things you need to set up Windows Virtual Desktop and successfully connect your users to their Windows desktops and applications.

We plan to add support for the following OSes, so make sure you have the [appropriate licenses](https://azure.microsoft.com/pricing/details/virtual-desktop/) for your users based on the desktop and apps you plan to deploy:

|OS|Required license|
|---|---|
|Windows 10 Enterprise multi-session or Windows 10 Enterprise|Microsoft 365 E3, E5, A3, A5, F1, Business<br>Windows E3, E5, A3, A5|
|Windows 7 Enterprise |Microsoft 365 E3, E5, A3, A5, F1, Business<br>Windows E3, E5, A3, A5|
|Windows Server 2012 R2, 2016, 2019|RDS Client Access License (CAL) with Software Assurance|

Your infrastructure needs the following things to support Windows Virtual Desktop:

* An [Azure Active Directory](https://docs.microsoft.com/azure/active-directory/)
* A Windows Server Active Directory in sync with Azure Active Directory. This can be enabled through:
  * Azure AD Connect
  * Azure AD Domain Services
* An Azure subscription, containing a virtual network that either contains or is connected to the Windows Server Active Directory
  
The Azure virtual machines you create for Windows Virtual Desktop must be:

* [Standard domain-joined](https://docs.microsoft.com/azure/active-directory-domain-services/active-directory-ds-comparison) or [Hybrid AD-joined](https://docs.microsoft.com/azure/active-directory/devices/hybrid-azuread-join-plan). Virtual machines can't be Azure AD-joined.
* Running one of the following [supported OS images](#supported-virtual-machine-os-image).

>[!NOTE]
>If you need an Azure subscription, you can [sign up for a one-month free trial](https://azure.microsoft.com/free/). If you're using the free trial version of Azure, you should use Azure AD Domain Services to keep your Windows Server Active Directory in sync with Azure Active Directory.

Windows Virtual Desktop comprises the Windows desktops and apps you deliver to users and the management solution, which is hosted as a service on Azure by Microsoft. During public preview, desktops and apps can be deployed on virtual machines (VMs) in any Azure region, and the management solution and data for these VMs will reside in the United States (US East 2 region). This may result in data transfer to the United States while you test the service during public preview. We'll start to scale out the management solution and data localization to all Azure regions starting at general availability.

For optimal performance, make sure your network meets the following requirements:

* Round-trip (RTT) latency from the client's network to the Azure region where host pools have been deployed should be less than 150 ms.
* Network traffic may flow outside country/region borders when VMs that host desktops and apps connect to the management service.
* To optimize for network performance, we recommend that the session host's VMs are collocated in the same Azure region as the management service.

## Supported Remote Desktop clients

The following Remote Desktop clients support Windows Virtual Desktop:

* [Windows](https://docs.microsoft.com/azure/virtual-desktop/connect-windows-7-and-10)
* [HTML5](https://docs.microsoft.com/azure/virtual-desktop/connect-web)

## Supported virtual machine OS image

Windows Virtual Desktop supports the following OS images:

* Windows 10 Enterprise multi-session
* Windows Server 2016

## Provide feedback

Visit the [Windows Virtual Desktop Tech Community](https://techcommunity.microsoft.com/t5/Windows-Virtual-Desktop/bd-p/WindowsVirtualDesktop) to discuss the Windows Virtual Desktop service with the product team and active community members. We currently aren't taking support cases while Windows Virtual Desktop is in preview.

## Next steps

To get started, you'll need to create a tenant. To learn more about how to create a tenant, continue to the tenant creation tutorial.

> [!div class="nextstepaction"]
> [Create a tenant in Windows Virtual Desktop Preview](tenant-setup-azure-active-directory.md)
