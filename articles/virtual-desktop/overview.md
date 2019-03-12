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

Windows Virtual Desktop (preview) enables you to create a full desktop virtualization environment in your Azure subscription without having to run any additional gateway servers. You can publish as many host pools as you need to accommodate your diverse workloads. You can use the Windows Virtual Desktop PowerShell and REST interfaces to configure the host pools, create app groups, assign users, and publish resources. Once assigned, users can launch any Windows Virtual Desktop client to connect to their published Windows desktops and applications. Users are securely established through reverse connections to the service, so you never have to leave any inbound ports open. For ongoing maintenance of your Windows Virtual Desktop environment, you can use built-in delegated access to assign roles and collect diagnostics to understand various configuration or user errors.

## Key capabilities

With Windows Virtual Desktop, you can:

* Bring your own image for production workloads, or test from the Azure Gallery.
* Reduce costs with pooled, multi-session resources. With the Remote Desktop Session Host (RDSH) role on Windows Server and the new Windows 10 Enterprise multi-session capability (preview) exclusive to Windows Virtual Desktop, you can greatly reduce the number of virtual machines and OS overhead while still providing the same resources to your users.
* Provide individual ownership through personal desktops.
* Publish full desktop or individual RemoteApps (preview) from a single host pool, create individual app groups for different sets of users, or even assign users to multiple app groups to reduce the number of images.
* Only manage the image and virtual machines, not the infrastructure. You don't need to personally manage the Remote Desktop roles like you do with Remote Desktop Services, just the virtual machines in your Azure subscription.
* Use the new Diagnostics service to troubleshoot errors.
* Connect with any device through either a native application on your device or the Windows Virtual Desktop web client.

## Requirements

There are a few things you need to set up Windows Virtual Desktop and successfully connect your users to their Windows desktops and applications.

Your infrastructure needs the following things to support Windows Virtual Desktop:

* An Azure Active Directory
* A Windows Server Active Directory in sync with Azure Active Directory. This can be enabled through:
  * Azure AD Connect
  * Azure AD Domain Services
* An Azure subscription, containing:
  * A virtual network either containing or connected to the Windows Server Active Directory
  
The Azure virtual machines you create for Windows Virtual Desktop must be:

* Standard domain-joined or Hybrid AD-joined. Virtual machines can't be Azure AD-joined.
* Running one of the following supported OS images:
  * Windows 10 Enterprise multi-session
  * Windows Server 2016

## Next steps

To get started, you'll need to create a tenant. To learn more about how to create a tenant, continue to the tenant creation tutorial.

> [!div class="nextstepaction"]
> [Create a host pool with Azure Marketplace](tenant-setup-azure-active-directory.md)
