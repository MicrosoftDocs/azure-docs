---
title: What is Windows Virtual Desktop? - Azure
description: An overview of Windows Virtual Desktop.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: overview
ms.date: 05/07/2020
ms.author: helohr
manager: lizross
---
# What is Windows Virtual Desktop? 

Windows Virtual Desktop is a desktop and app virtualization service that runs on the cloud.

Here's what you can do when you run Windows Virtual Desktop on Azure:

* Set up a multi-session Windows 10 deployment that delivers a full Windows 10 with scalability
* Virtualize Microsoft 365 Apps for enterprise and optimize it to run in multi-user virtual scenarios
* Provide Windows 7 virtual desktops with free Extended Security Updates
* Bring your existing Remote Desktop Services (RDS) and Windows Server desktops and apps to any computer
* Virtualize both desktops and apps
* Manage Windows 10, Windows Server, and Windows 7 desktops and apps with a unified management experience

## Introductory video

Learn about Windows Virtual Desktop, why it's unique, and what's new in this video:

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
|Windows 10 Enterprise multi-session or Windows 10 Enterprise|Microsoft 365 E3, E5, A3, A5, F3, Business Premium<br>Windows E3, E5, A3, A5|
|Windows 7 Enterprise |Microsoft 365 E3, E5, A3, A5, F3, Business Premium<br>Windows E3, E5, A3, A5|
|Windows Server 2012 R2, 2016, 2019|RDS Client Access License (CAL) with Software Assurance|

Your infrastructure needs the following things to support Windows Virtual Desktop:

* An [Azure Active Directory](/azure/active-directory/)
* A Windows Server Active Directory in sync with Azure Active Directory. You can configure this with one of the following:
  * Azure AD Connect (for hybrid organizations)
  * Azure AD Domain Services (for hybrid or cloud organizations)
* An Azure subscription that contains a virtual network that either contains or is connected to the Windows Server Active Directory
  
The Azure virtual machines you create for Windows Virtual Desktop must be:

* [Standard domain-joined](../active-directory-domain-services/active-directory-ds-comparison.md) or [Hybrid AD-joined](../active-directory/devices/hybrid-azuread-join-plan.md). Virtual machines can't be Azure AD-joined.
* Running one of the following [supported OS images](#supported-virtual-machine-os-images).

>[!NOTE]
>If you need an Azure subscription, you can [sign up for a one-month free trial](https://azure.microsoft.com/free/). If you're using the free trial version of Azure, you should use Azure AD Domain Services to keep your Windows Server Active Directory in sync with Azure Active Directory.

The Azure virtual machines you create for Windows Virtual Desktop must have access to the following URLs:

|Address|Outbound TCP port|Purpose|Service Tag|
|---|---|---|---|
|*.wvd.microsoft.com|443|Service traffic|WindowsVirtualDesktop|
|mrsglobalsteus2prod.blob.core.windows.net|443|Agent and SXS stack updates|AzureCloud|
|*.core.windows.net|443|Agent traffic|AzureCloud|
|*.servicebus.windows.net|443|Agent traffic|AzureCloud|
|prod.warmpath.msftcloudes.com|443|Agent traffic|AzureCloud|
|catalogartifact.azureedge.net|443|Azure Marketplace|AzureCloud|
|kms.core.windows.net|1688|Windows activation|Internet|
|wvdportalstorageblob.blob.core.windows.net|443|Azure portal support|AzureCloud|

>[!IMPORTANT]
>Windows Virtual Desktop now supports the FQDN tag. For more information, see [Use Azure Firewall to protect Window Virtual Desktop deployments](../firewall/protect-windows-virtual-desktop.md).
>
>We recommend you use FQDN tags or service tags instead of URLs to prevent service issues. The listed URLs and tags only correspond to Windows Virtual Desktop sites and resources. They don't include URLs for other services like Azure Active Directory.

The following table lists optional URLs that your Azure virtual machines can have access to:

|Address|Outbound TCP port|Purpose|Service Tag|
|---|---|---|---|
|*.microsoftonline.com|443|Authentication to Microsoft Online Services|None|
|*.events.data.microsoft.com|443|Telemetry Service|None|
|www.msftconnecttest.com|443|Detects if the OS is connected to the internet|None|
|*.prod.do.dsp.mp.microsoft.com|443|Windows Update|None|
|login.windows.net|443|Sign in to Microsoft Online Services, Office 365|None|
|*.sfx.ms|443|Updates for OneDrive client software|None|
|*.digicert.com|443|Certificate revocation check|None|


>[!NOTE]
>Windows Virtual Desktop currently doesn't have a list of IP address ranges that you can whitelist to allow network traffic. We only support whitelisting specific URLs at this time.
>
>For a list of Office-related URLs, including required Azure Active Directory-related URLs, see [Office 365 URLs and IP address ranges](/office365/enterprise/urls-and-ip-address-ranges).
>
>You must use the wildcard character (*) for URLs involving service traffic. If you prefer to not use * for agent-related traffic, here's how to find the URLs without wildcards:
>
>1. Register your virtual machines to the Windows Virtual Desktop host pool.
>2. Open **Event viewer** and navigate to **Windows logs** > **Application** > **WVD-Agent** and look for Event ID 3702.
>3. Whitelist the URLs that you find under Event ID 3702. The URLs under Event ID 3702 are region-specific. You'll need to repeat the whitelisting process with the relevant URLs for each region you want to deploy your virtual machines in.

Windows Virtual Desktop comprises the Windows desktops and apps you deliver to users and the management solution, which is hosted as a service on Azure by Microsoft. Desktops and apps can be deployed on virtual machines (VMs) in any Azure region, and the management solution and data for these VMs will reside in the United States. This may result in data transfer to the United States.

For optimal performance, make sure your network meets the following requirements:

* Round-trip (RTT) latency from the client's network to the Azure region where host pools have been deployed should be less than 150 ms.
* Network traffic may flow outside country/region borders when VMs that host desktops and apps connect to the management service.
* To optimize for network performance, we recommend that the session host's VMs are collocated in the same Azure region as the management service.

## Supported Remote Desktop clients

The following Remote Desktop clients support Windows Virtual Desktop:

* [Windows Desktop](connect-windows-7-and-10.md)
* [Web](connect-web.md)
* [macOS](connect-macos.md)
* [iOS](connect-ios.md)
* [Android (Preview)](connect-android.md)

> [!IMPORTANT]
> Windows Virtual Desktop doesn't support the RemoteApp and Desktop Connections (RADC) client or the Remote Desktop Connection (MSTSC) client.

> [!IMPORTANT]
> Windows Virtual Desktop doesn't currently support the Remote Desktop client from the Windows Store. Support for this client will be added in a future release.

The Remote Desktop clients must have access to the following URLs:

|Address|Outbound TCP port|Purpose|Client(s)|
|---|---|---|---|
|*.wvd.microsoft.com|443|Service traffic|All|
|*.servicebus.windows.net|443|Troubleshooting data|All|
|go.microsoft.com|443|Microsoft FWLinks|All|
|aka.ms|443|Microsoft URL shortener|All|
|docs.microsoft.com|443|Documentation|All|
|privacy.microsoft.com|443|Privacy statement|All|
|query.prod.cms.rt.microsoft.com|443|Client updates|Windows Desktop|

>[!IMPORTANT]
>Opening these URLs is essential for a reliable client experience. Blocking access to these URLs is unsupported and will affect service functionality. These URLs only correspond to the client sites and resources, and don't include URLs for other services like Azure Active Directory.

## Supported virtual machine OS images

Windows Virtual Desktop supports the following x64 operating system images:

* Windows 10 Enterprise multi-session, version 1809 or later
* Windows 10 Enterprise, version 1809 or later
* Windows 7 Enterprise
* Windows Server 2019
* Windows Server 2016
* Windows Server 2012 R2

Windows Virtual Desktop does not support x86 (32-bit), Windows 10 Enterprise N, or Windows 10 Enterprise KN operating system images. Windows 7 also doesn't support any VHD or VHDX-based profile solutions hosted on managed Azure Storage due to a sector size limitation.

Available automation and deployment options depend on which OS and version you choose, as shown in the following table: 

|Operating system|Azure Image Gallery|Manual VM deployment|Azure Resource Manager template integration|Provision host pools on Azure Marketplace|
|--------------------------------------|:------:|:------:|:------:|:------:|
|Windows 10 multi-session, version 1903|Yes|Yes|Yes|Yes|
|Windows 10 multi-session, version 1809|Yes|Yes|No|No|
|Windows 10 Enterprise, version 1903|Yes|Yes|Yes|Yes|
|Windows 10 Enterprise, version 1809|Yes|Yes|No|No|
|Windows 7 Enterprise|Yes|Yes|No|No|
|Windows Server 2019|Yes|Yes|No|No|
|Windows Server 2016|Yes|Yes|Yes|Yes|
|Windows Server 2012 R2|Yes|Yes|No|No|

## Next steps

If you're using the Windows Virtual Desktop Fall 2019 release, you can get started with our tutorial at [Create a tenant in Windows Virtual Desktop](./virtual-desktop-fall-2019/tenant-setup-azure-active-directory.md).

If you're using the Windows Virtual Desktop Spring 2020 release, you'll need to create a host pool instead. Head to the following tutorial to get started.

> [!div class="nextstepaction"]
> [Create a host pool with the Azure portal](create-host-pools-azure-marketplace.md)
