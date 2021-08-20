---
title: What is Azure Virtual Desktop? - Azure
description: An overview of Azure Virtual Desktop.
author: Heidilohr
ms.topic: overview
ms.date: 07/14/2021
ms.author: helohr
manager: femila
---
# What is Azure Virtual Desktop?

Azure Virtual Desktop is a desktop and app virtualization service that runs on the cloud.

Here's what you can do when you run Azure Virtual Desktop on Azure:

* Set up a multi-session Windows 10 deployment that delivers a full Windows 10 with scalability
* Virtualize Microsoft 365 Apps for enterprise and optimize it to run in multi-user virtual scenarios
* Provide Windows 7 virtual desktops with free Extended Security Updates
* Bring your existing Remote Desktop Services (RDS) and Windows Server desktops and apps to any computer
* Virtualize both desktops and apps
* Manage Windows 10, Windows Server, and Windows 7 desktops and apps with a unified management experience

## Introductory video

Learn about Azure Virtual Desktop, why it's unique, and what's new in this video:

<br></br><iframe src="https://www.youtube.com/embed/NQFtI3JLtaU" width="640" height="320" allowFullScreen="true" frameBorder="0"></iframe>

For more videos about Azure Virtual Desktop, see [our playlist](https://www.youtube.com/watch?v=NQFtI3JLtaU&list=PLXtHYVsvn_b8KAKw44YUpghpD6lg-EHev).

## Key capabilities

With Azure Virtual Desktop, you can set up a scalable and flexible environment:

* Create a full desktop virtualization environment in your Azure subscription without running any gateway servers.
* Publish as many host pools as you need to accommodate your diverse workloads.
* Bring your own image for production workloads or test from the Azure Gallery.
* Reduce costs with pooled, multi-session resources. With the new Windows 10 Enterprise multi-session capability, exclusive to Azure Virtual Desktop and Remote Desktop Session Host (RDSH) role on Windows Server, you can greatly reduce the number of virtual machines and operating system (OS) overhead while still providing the same resources to your users.
* Provide individual ownership through personal (persistent) desktops.

You can deploy and manage virtual desktops:

* Use the Azure portal, Azure Virtual Desktop PowerShell and REST interfaces to configure the host pools, create app groups, assign users, and publish resources.
* Publish full desktop or individual remote apps from a single host pool, create individual app groups for different sets of users, or even assign users to multiple app groups to reduce the number of images.
* As you manage your environment, use built-in delegated access to assign roles and collect diagnostics to understand various configuration or user errors.
* Use the new Diagnostics service to troubleshoot errors.
* Only manage the image and virtual machines, not the infrastructure. You don't need to personally manage the Remote Desktop roles like you do with Remote Desktop Services, just the virtual machines in your Azure subscription.

You can also assign and connect users to your virtual desktops:

* Once assigned, users can launch any Azure Virtual Desktop client to connect to their published Windows desktops and applications. Connect from any device through either a native application on your device or the Azure Virtual Desktop HTML5 web client.
* Securely establish users through reverse connections to the service, so you never have to leave any inbound ports open.

## Requirements

There are a few things you need to set up Azure Virtual Desktop and successfully connect your users to their Windows desktops and applications.

We support the following operating systems, so make sure you have the [appropriate licenses](https://azure.microsoft.com/pricing/details/virtual-desktop/) for your users based on the desktop and apps you plan to deploy:

|OS|Required license|
|---|---|
|Windows 10 Enterprise multi-session or Windows 10 Enterprise|Microsoft 365 E3, E5, A3, A5, F3, Business Premium<br>Windows E3, E5, A3, A5|
|Windows 7 Enterprise |Microsoft 365 E3, E5, A3, A5, F3, Business Premium<br>Windows E3, E5, A3, A5|
|Windows Server 2012 R2, 2016, 2019|RDS Client Access License (CAL) with Software Assurance|

Your infrastructure needs the following things to support Azure Virtual Desktop:

* An [Azure Active Directory](../active-directory/index.yml).
* A Windows Server Active Directory in sync with Azure Active Directory. You can configure this using Azure AD Connect (for hybrid organizations) or Azure AD Domain Services (for hybrid or cloud organizations).
  * A Windows Server AD in sync with Azure Active Directory. User is sourced from Windows Server AD and the Azure Virtual Desktop VM is joined to Windows Server AD domain.
  * A Windows Server AD in sync with Azure Active Directory. User is sourced from Windows Server AD and the Azure Virtual Desktop VM is joined to Azure AD Domain Services domain.
  * An Azure AD Domain Services domain. User is sourced from Azure Active Directory, and the Azure Virtual Desktop VM is joined to Azure AD Domain Services domain.
* An Azure subscription, parented to the same Azure AD tenant, that contains a virtual network that either contains or is connected to the Windows Server Active Directory or Azure AD DS instance.

User requirements to connect to Azure Virtual Desktop:

* The user must be sourced from the same Active Directory that's connected to Azure AD. Azure Virtual Desktop does not support B2B or MSA accounts.
* The UPN you use to subscribe to Azure Virtual Desktop must exist in the Active Directory domain the VM is joined to.

The Azure virtual machines you create for Azure Virtual Desktop must be:

* [Standard domain-joined](../active-directory-domain-services/compare-identity-solutions.md) or [Hybrid AD-joined](../active-directory/devices/hybrid-azuread-join-plan.md). [Azure AD-joined](deploy-azure-ad-joined-vm.md) virtual machines are available in preview.
* Running one of the following [supported OS images](#supported-virtual-machine-os-images).

>[!NOTE]
>If you need an Azure subscription, you can [sign up for a one-month free trial](https://azure.microsoft.com/free/). If you're using the free trial version of Azure, you should use Azure AD Domain Services to keep your Windows Server Active Directory in sync with Azure Active Directory.

For a list of URLs you should unblock for your Azure Virtual Desktop deployment to work as intended, see our [Required URL list](safe-url-list.md).

Azure Virtual Desktop includes the Windows desktops and apps you deliver to users and the management solution, which is hosted as a service on Azure by Microsoft. Desktops and apps can be deployed on virtual machines (VMs) in any Azure region, and the management solution and data for these VMs will reside in the United States. This may result in data transfer to the United States.

For optimal performance, make sure your network meets the following requirements:

* Round-trip (RTT) latency from the client's network to the Azure region where host pools have been deployed should be less than 150 ms. Use the [Experience Estimator](https://azure.microsoft.com/services/virtual-desktop/assessment) to view your connection health and recommended Azure region.
* Network traffic may flow outside country/region borders when VMs that host desktops and apps connect to the management service.
* To optimize for network performance, we recommend that the session host's VMs are collocated in the same Azure region as the management service.

You can see a typical architectural setup of Azure Virtual Desktop for the enterprise in our [architecture documentation](/azure/architecture/example-scenario/wvd/windows-virtual-desktop).

## Supported Remote Desktop clients

The following Remote Desktop clients support Azure Virtual Desktop:

* [Windows Desktop](./user-documentation/connect-windows-7-10.md)
* [Web](./user-documentation/connect-web.md)
* [macOS](./user-documentation/connect-macos.md)
* [iOS](./user-documentation/connect-ios.md)
* [Android](./user-documentation/connect-android.md)
* Microsoft Store Client

> [!IMPORTANT]
> Azure Virtual Desktop doesn't support the RemoteApp and Desktop Connections (RADC) client or the Remote Desktop Connection (MSTSC) client.

To learn more about URLs you must unblock to use the clients, see the [Safe URL list](safe-url-list.md).

## Supported virtual machine OS images

Azure Virtual Desktop follows the [Microsoft Lifecycle Policy](/lifecycle/) and supports the following x64 operating system images:

* Windows 10 Enterprise multi-session
* Windows 10 Enterprise
* Windows 7 Enterprise
* Windows Server 2019
* Windows Server 2016
* Windows Server 2012 R2

Azure Virtual Desktop doesn't support x86 (32-bit), Windows 10 Enterprise N, Windows 10 LTSB, Windows 10 LTSC, Windows 10 Pro, or Windows 10 Enterprise KN operating system images. Windows 7 also doesn't support any VHD or VHDX-based profile solutions hosted on managed Azure Storage due to a sector size limitation.

Available automation and deployment options depend on which OS and version you choose, as shown in the following table:

|Operating system|Azure Image Gallery|Manual VM deployment|Azure Resource Manager template integration|Provision host pools on Azure Marketplace|
|--------------------------------------|:------:|:------:|:------:|:------:|
|Windows 10 Enterprise multi-session, version 1909 and later|Yes|Yes|Yes|Yes|
|Windows 10 Enterprise, version 1909 and later|Yes|Yes|Yes|Yes|
|Windows 7 Enterprise|Yes|Yes|No|No|
|Windows Server 2019|Yes|Yes|No|No|
|Windows Server 2016|Yes|Yes|Yes|Yes|
|Windows Server 2012 R2|Yes|Yes|No|No|

## Next steps

If you're using Azure Virtual Desktop (classic), you can get started with our tutorial at [Create a tenant in Azure Virtual Desktop](./virtual-desktop-fall-2019/tenant-setup-azure-active-directory.md).

If you're using the Azure Virtual Desktop with Azure Resource Manager integration, you'll need to create a host pool instead. Head to the following tutorial to get started.

> [!div class="nextstepaction"]
> [Create a host pool with the Azure portal](create-host-pools-azure-marketplace.md)