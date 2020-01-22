---
title: What is Windows Virtual Desktop? - Azure
description: An overview of Windows Virtual Desktop.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: overview
ms.date: 01/21/2020
ms.author: helohr
---
# What is Windows Virtual Desktop? 

Windows Virtual Desktop is a desktop and app virtualization service that runs on the cloud.

Here’s what you can do when you run Windows Virtual Desktop on Azure:

* Set up a multi-session Windows 10 deployment that delivers a full Windows 10 with scalability
* Virtualize Office 365 ProPlus and optimize it to run in multi-user virtual scenarios
* Provide Windows 7 virtual desktops with free Extended Security Updates
* Bring your existing Remote Desktop Services (RDS) and Windows Server desktops and apps to any computer
* Virtualize both desktops and apps
* Manage Windows 10, Windows Server, and Windows 7 desktops and apps with a unified management experience

## Introductory video

Learn about Windows Virtual Desktop, why it’s unique, and what’s new in this video:

<br></br><iframe src="https://www.youtube.com/embed/NQFtI3JLtaU" width="640" height="320" allowFullScreen="true" frameBorder="0"></iframe>

For more videos about Windows Virtual Desktop, see [our playlist](https://www.youtube.com/watch?v=NQFtI3JLtaU&list=PLXtHYVsvn_b8KAKw44YUpghpD6lg-EHev).

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
* A Windows Server Active Directory in sync with Azure Active Directory. You can configure this with one of the following:
  * Azure AD Connect (for hybrid organizations)
  * Azure AD Domain Services (for hybrid or cloud organizations)
* An Azure subscription that contains a virtual network that either contains or is connected to the Windows Server Active Directory
  
The Azure virtual machines you create for Windows Virtual Desktop must be:

* [Standard domain-joined](https://docs.microsoft.com/azure/active-directory-domain-services/active-directory-ds-comparison) or [Hybrid AD-joined](https://docs.microsoft.com/azure/active-directory/devices/hybrid-azuread-join-plan). Virtual machines can't be Azure AD-joined.
* Running one of the following [supported OS images](#supported-virtual-machine-os-images).

>[!NOTE]
>If you need an Azure subscription, you can [sign up for a one-month free trial](https://azure.microsoft.com/free/). If you're using the free trial version of Azure, you should use Azure AD Domain Services to keep your Windows Server Active Directory in sync with Azure Active Directory.

The Azure virtual machines you create for Windows Virtual Desktop must have access to the following URLs:

|Address|Outbound port|Purpose|
|---|---|---|
|*.wvd.microsoft.com|TCP port 443|Service traffic|
|*.blob.core.windows.net|TCP port 443|Agent, SXS stack updates, and Agent traffic|
|*.core.windows.net|TCP port 443|Agent traffic|
|*.servicebus.windows.net|TCP port 443|Agent traffic|
|prod.warmpath.msftcloudes.com|TCP port 443|Agent traffic|
|catalogartifact.azureedge.net|TCP port 443|Azure Marketplace|
|kms.core.windows.net|TCP port 1688|Windows 10 activation|

>[!IMPORTANT]
>Opening these URLs is essential for a reliable Windows Virtual Desktop deployment. Blocking access to these URLs is unsupported and will affect service functionality. These URLs only correspond to Windows Virtual Desktop sites and resources, and do not include URLs for other services like Azure AD.

>[!NOTE]
>You must use the wildcard character (*) for URLs involving service traffic. If you prefer to not use * for agent-related traffic, here's how to find the URLs without wildcards:
>
>1. Register your virtual machines to the Windows Virtual Desktop host pool.
>2. Open **Event viewer** and navigate to **Windows** > **Application logs** and look for Event ID 3702.
>3. Whitelist the URLs that you find under Event ID 3702. The URLs under Event ID 3702 are region-specific. You'll need to repeat the whitelisting process with the relevant URLs for each region you want to deploy your virtual machines in.

Windows Virtual Desktop comprises the Windows desktops and apps you deliver to users and the management solution, which is hosted as a service on Azure by Microsoft. Desktops and apps can be deployed on virtual machines (VMs) in any Azure region, and the management solution and data for these VMs will reside in the United States. This may result in data transfer to the United States.

For optimal performance, make sure your network meets the following requirements:

* Round-trip (RTT) latency from the client's network to the Azure region where host pools have been deployed should be less than 150 ms.
* Network traffic may flow outside country/region borders when VMs that host desktops and apps connect to the management service.
* To optimize for network performance, we recommend that the session host's VMs are collocated in the same Azure region as the management service.

## Supported Remote Desktop clients

The following Remote Desktop clients support Windows Virtual Desktop:

* [Windows](connect-windows-7-and-10.md)
* [Web](connect-web.md)
* [Mac](connect-macos.md)
* [iOS](connect-ios.md)
* [Android (Preview)](connect-android.md)

## Supported virtual machine OS images

Windows Virtual Desktop supports the following x64 operating system images:

* Windows 10 Enterprise multi-session, version 1809 or later
* Windows 10 Enterprise, version 1809 or later
* Windows 7 Enterprise
* Windows Server 2019
* Windows Server 2016
* Windows Server 2012 R2

Windows Virtual Desktop does not support x86 (32-bit), Windows 10 Enterprise N, or Windows 10 Enterprise KN operating system images.

Available automation and deployment options depend on which OS and version you choose, as shown in the following table: 

|Operating system|Azure Image Gallery|Manual VM deployment|Azure Resource Manager template integration|Provision host pools on Azure Marketplace|Windows Virtual Desktop Agent updates|
|--------------------------------------|:------:|:------:|:------:|:------:|:------:|
|Windows 10 multi-session, version 1903|Yes|Yes|Yes|Yes|Automatic|
|Windows 10 multi-session, version 1809|Yes|Yes|No|No|Automatic|
|Windows 10 Enterprise, version 1903|Yes|Yes|Yes|Yes|Automatic|
|Windows 10 Enterprise, version 1809|Yes|Yes|No|No|Automatic|
|Windows 7 Enterprise|Yes|Yes|No|No|Manual|
|Windows Server 2019|Yes|Yes|No|No|Automatic|
|Windows Server 2016|Yes|Yes|Yes|Yes|Automatic|
|Windows Server 2012 R2|Yes|Yes|No|No|Automatic|

## Next steps

To get started, you'll need to create a tenant. To learn more about how to create a tenant, continue to the tenant creation tutorial.

> [!div class="nextstepaction"]
> [Create a tenant in Windows Virtual Desktop](tenant-setup-azure-active-directory.md)
