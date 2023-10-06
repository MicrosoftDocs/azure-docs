---
title: What's new in Azure Virtual Desktop? - Azure
description: New features and product updates for Azure Virtual Desktop.
author: Heidilohr
ms.topic: release-notes
ms.date: 08/22/2023
ms.author: helohr
ms.reviewer: thhickli; darank
manager: femila
ms.custom: references_regions
---
# What's new in Azure Virtual Desktop?

Azure Virtual Desktop updates regularly. This article is where you'll find out about:

- The latest updates
- New features
- Improvements to existing features
- Bug fixes

Make sure to check back here often to keep up with new updates.

> [!TIP]
> See [What's new in documentation](whats-new-documentation.md), where we highlight new and updated articles for Azure Virtual Desktop.

## July 2023

Here's what changed in July 2023:

### Watermarking is now generally available

[Watermarking](watermarking.md), when used with [screen capture protection](#screen-capture-protection), helps protect your sensitive information from capture on client endpoints. When you enable watermarking, QR code watermarks appear as part of remote desktops. The QR code contains the connection ID of a remote session that admins can use to trace the session. You can configure watermarking on session hosts and enforce it with the Remote Desktop client.

### Audio call redirection for Azure Virtual Desktop in preview

Call redirection, which optimizes audio calls for WebRTC-based calling apps, is now in preview. Multimedia redirection redirects media content from Azure Virtual Desktop to your local machine for faster processing and rendering. Both Microsoft Edge and Google Chrome support this feature when using the Windows Desktop client.

For more information about which sites are compatible with this feature, see [Call redirection](multimedia-redirection-intro.md#call-redirection).

### Autoscale for personal host pools is currently in preview

Autoscale for personal host pools is now in preview. Autoscale lets you scale your session host virtual machines (VMs) in a host pool up or down according to a schedule to optimize deployment costs.

To learn more about autoscale for personal host pools, see [Autoscale scaling plans and example scenarios in Azure Virtual Desktop](autoscale-scenarios.md).

### Confidential VMs are now generally available in Azure Virtual Desktop

Confidential VM and Trusted Launch security features for Azure Virtual Desktop host pool provisioning are now generally available.

Azure confidential virtual machines (VMs) offer VM memory encryption with integrity protection, which strengthens guest protections to deny the hypervisor and other host management components code access to the VM memory and state. For more information about the security benefits of confidential VMs, see our [confidential computing documentation](../confidential-computing/confidential-vm-overview.md).  

Trusted Launch protects against advanced and persistent attack techniques. This feature allows you to securely deploy your VMs with verified boot loaders, OS kernels, and drivers. Trusted Launch also protects keys, certificates, and secrets in VMs. For more information about the benefits of Trusted Launch, see our [Trusted Launch documentation](../virtual-machines/trusted-launch.md). Trusted Launch is now enabled by default for all Windows images used with Azure Virtual Desktop.

For more information about this announcement, see [Announcing General Availability of confidential VMs in Azure Virtual Desktop](https://techcommunity.microsoft.com/t5/azure-virtual-desktop-blog/announcing-general-availability-of-confidential-vms-in-azure/ba-p/3857974). 

### Private Link with Azure Virtual Desktop is now generally available

Private Link with Azure Virtual Desktop allows users to establish secure connections to remote resources using private endpoints. With Private Link, traffic between your virtual network and the Azure Virtual Desktop service is routed through the Microsoft *backbone* network. This routing eliminates the need to expose your service to the public internet, enhancing the overall security of your infrastructure. By keeping traffic within this protected network, Private Link adds an extra layer of security for your Azure Virtual Desktop environment. For more information about Private Link, see [Azure Private Link with Azure Virtual Desktop](private-link-overview.md) or read [our blog post](https://techcommunity.microsoft.com/t5/azure-virtual-desktop-blog/announcing-the-general-availability-of-private-link-for-azure/ba-p/3874429). 

## June 2023

Here's what changed in June 2023:

### Azure Virtual Desktop Insights support for the Azure Monitor Agent now in preview

Azure Virtual Desktop Insights is a dashboard built on Azure Monitor workbooks that helps IT professionals understand their Azure Virtual Desktop environments. Azure Virtual Desktops Insights support for the Azure Monitor agent is now in preview. For more information see [Use Azure Virtual Desktop Insights to monitor your deployment](insights.md?tabs=monitor).

### Administrative template for Azure Virtual Desktop now available in Intune

We've created an administrative template for Azure Virtual Desktop to help you configure certain features in Azure Virtual Desktop. This administrative template is now available in Intune, which enables you to centrally configure session hosts that are enrolled in Intune and joined to Azure Active Directory (Azure AD) or hybrid Azure AD joined.

For more information see [Administrative template for Azure Virtual Desktop](administrative-template.md?tabs=intune).

## May 2023

Here's what changed in May 2023: 

### Custom image templates is now in preview 

Custom image templates is now in  preview. Custom image templates help you easily create a custom image that you can use when deploying session host VMs. With custom images, you can standardize the configuration of your session host VMs for your organization. Custom image templates is built on [Azure Image Builder](../virtual-machines/image-builder-overview.md) and tailored for Azure Virtual Desktop. For more information about the preview, check out [Custom image templates](custom-image-templates.md) or read [our blog post](https://techcommunity.microsoft.com/t5/azure-virtual-desktop-blog/announcing-the-public-preview-of-azure-virtual-desktop-custom/ba-p/3784361).

## April 2023

Here's what changed in April 2023:

### Azure Virtual Desktop Store app for Windows in public preview

The [Azure Virtual Desktop Store app for Windows](users/connect-windows-azure-virtual-desktop-app.md?toc=%2Fazure%2Fvirtual-desktop%2Ftoc.json&bc=%2Fazure%2Fvirtual-desktop%2Fbreadcrumb%2Ftoc.json) is now in public preview for Windows 10 and 11. With the Store App, you can now automatically update the client, unlike with the Remote Desktop client. You can also pin a RemoteApp to your Start menu to personalize your desktop and reduce clutter.

For more information about the public preview release version, check out [Use features of the Azure Virtual Desktop Store app for Windows when connecting to Azure Virtual Desktop (preview)](users/client-features-windows.md?toc=%2Fazure%2Fvirtual-desktop%2Ftoc.json&bc=%2Fazure%2Fvirtual-desktop%2Fbreadcrumb%2Ftoc.json), [What's new in the Azure Virtual Desktop Store App (preview)](whats-new-client-windows-azure-virtual-desktop-app.md), or read [our blog post](https://techcommunity.microsoft.com/t5/azure-virtual-desktop-blog/announcing-public-preview-of-the-new-azure-virtual-desktop-app/ba-p/3785698).

### Intune user-scope configuration for Windows 10 Enterprise multi-session VMs now generally available

Microsoft Intune user-scope configuration for Azure Virtual Desktop multi-session Virtual Machines (VMs) on Windows 10 and 11 are now generally available. With this feature, you are able to:

- Configure user-scope policies using the Settings catalog and assign those policies to groups of users.
- Configure user certificates and assign them to users.
- Configure PowerShell scripts to install in user context and assign the scripts to users.

For more information, see [Azure Virtual Desktop multi-session with Intune](/mem/intune/fundamentals/azure-virtual-desktop-multi-session) or [our blog post](https://techcommunity.microsoft.com/t5/azure-virtual-desktop-blog/microsoft-intune-user-scope-configuration-for-azure-virtual/ba-p/3667410).

## March 2023

Here's what changed in March 2023:

### Redesigned connection bar for the Windows Desktop client

The latest version of the Windows Desktop client includes a redesigned connection bar. For more information, see [Updates for version 1.2.4159](whats-new-client-windows.md#updates-for-version-124159). 

### Shutdown session host status

The Shutdown session host status is now available in the Azure Virtual Desktop portal and the most recent API version. For more information, see [Session host statuses and health checks](troubleshoot-statuses-checks.md#session-host-statuses).

### Windows 10 and 11 22H2 images now visible in the image drop-down menu

Windows 10 and 11 22H2 Enterprise and Enterprise multi-session images are now visible in the image dropdown when creating a new host pool or adding a VM in a host pool from the Azure Virtual Desktop portal.

### Uniform Resource Identifier Schemes in public preview

Uniform Resource Identifier (URI) schemes with the Remote Desktop client for Azure Virtual Desktop is now in public preview. This new feature lets you subscribe to a workspace or connect to a particular desktop or RemoteApp using URI schemes. URI schemes also provide fast and efficient end-user connection to Azure Virtual Desktop resources. For more information, see [our blog post](https://techcommunity.microsoft.com/t5/azure-virtual-desktop-blog/announcing-the-public-preview-of-uniform-resource-identifier/ba-p/3763075) and [URI schemes with the Remote Desktop client for Azure Virtual Desktop (preview)](uri-scheme.md). 

### Azure Virtual Desktop Insights at Scale now generally available

Azure Virtual Desktop Insights at Scale is now generally available. This feature gives you the ability to review performance and diagnostic information in multiple host pools at the same time in a single view. If you're an existing Azure Virtual Desktop Insights user, you get this feature without having to do any extra configuration or setup. For more information, see [our blog post](https://techcommunity.microsoft.com/t5/azure-virtual-desktop-blog/announcing-the-general-availability-of-azure-virtual-desktop/ba-p/3738624) and [Use Azure Virtual Desktop Insights to monitor your deployment](insights.md). 

## February 2023

Here's what changed in February 2023:

### Symmetric NAT support for RDP Shortpath in public preview

This feature is an extension of the generally available Remote Desktop Protocol (RDP) Shortpath feature that allows us to establish a User Datagram Platform (UDP) connection indirectly using a relay with the TURN (Traversal Using Relays around NAT) protocol for symmetric NAT (Network Address Translation). For more information, see [our blog post](https://techcommunity.microsoft.com/t5/azure-virtual-desktop-blog/announcing-public-preview-of-symmetric-nat-support-for-rdp/ba-p/3736466) or [RDP Shortpath for Azure Virtual Desktop](rdp-shortpath.md?tabs=public-networks).

### Multimedia redirection enhancements now generally available

Multimedia Redirection (MMR) is now generally available. MMR enables smooth video playback while viewing videos in a browser running on Azure Virtual Desktop. For more information, see [our blog post](https://techcommunity.microsoft.com/t5/azure-virtual-desktop-blog/announcing-general-availability-of-multimedia-redirection-mmr-on/ba-p/3736489) or [Understanding multimedia redirection for Azure Virtual Desktop](multimedia-redirection-intro.md).

### New User Interface for Azure Virtual Desktop web client now in public preview

The Azure Virtual Desktop web client has a new user interface (UI) that's now in public preview. This new UI gives the web client a cleaner, more modern look and feel. For more information, see [our blog post](https://techcommunity.microsoft.com/t5/azure-virtual-desktop-blog/announcing-public-preview-of-the-new-azure-virtual-desktop-web/ba-p/3731165) or [Use features of the Remote Desktop Web client](./users/client-features-web.md?toc=%2Fazure%2Fvirtual-desktop%2Ftoc.json#display-preferences).

## January 2023

Here's what changed in January 2023:

### Watermarking for Azure Virtual Desktop now in public preview

Watermarking for Azure Virtual Desktop is now in public preview for the Windows Desktop client. This feature protects sensitive information from being captured on client endpoints by adding watermarks to remote desktops. For more information, see [our blog post](https://techcommunity.microsoft.com/t5/azure-virtual-desktop-blog/announcing-public-preview-for-watermarking-on-azure-virtual/ba-p/3730264) or [Watermarking in Azure Virtual Desktop](watermarking.md).
	
### Give or Take Control for macOS Teams on Azure Virtual Desktop now generally available

Version 1.31.2211.15001 of the WebRTC Redirector service includes support for Give or Take Control for macOS users. This version includes performance improvements for Give or Take Control on Windows. For more information, see [Updates for version 1.31.2211.15001](whats-new-webrtc.md#updates-for-version-131221115001).

### Microsoft Teams application window sharing on Azure Virtual Desktop now generally available

Previously, users could only share their full desktop windows or a Microsoft PowerPoint Live presentation during Teams calls. With application window sharing, users can now choose a specific window to share from their desktop screen and help reduce the risk of displaying sensitive content during meetings or calls. For more information, see [our blog post](https://techcommunity.microsoft.com/t5/azure-virtual-desktop-blog/microsoft-teams-application-window-sharing-is-now-generally/ba-p/3719595).

### Windows 7 End of Support

Starting January 10, 2023, Azure Virtual Desktop no longer supports Windows 7 as a client or host. We recommend upgrading to a supported Windows release. For more information, see [our blog post](https://techcommunity.microsoft.com/t5/azure-virtual-desktop/avd-support-for-windows-7-ended-on-january-10th-2023/m-p/3715785).

## December 2022

Here's what changed in December 2022:

### FSLogix 2210 now generally available

FSLogix version 2210 is now generally available. This version introduces new features like VHD Disk Compaction, a new process that improves user experience with AppX applications like built-in Windows apps (inbox apps) and Recycle Bin roaming. For more information, see [our blog post](https://techcommunity.microsoft.com/t5/azure-virtual-desktop-blog/announcing-general-availability-of-fslogix-2210/ba-p/3695166) or [What’s new in FSLogix](/fslogix/whats-new?context=%2Fazure%2Fvirtual-desktop%2Fcontext%2Fcontext#fslogix-2210-29836152326).
	
### India metadata service now generally available

The Azure Virtual Desktop region in India is now generally available. Customers can now store their Azure Virtual Desktop objects and metadata within a database located in the India geography. For more information, see [our blog post](https://techcommunity.microsoft.com/t5/azure-virtual-desktop-blog/azure-virtual-desktop-metadata-database-is-now-available-in/ba-p/3670768).

### Confidential Virtual Machine support for Azure Virtual Desktop now in public preview

Azure Confidential VM support is now in public preview. Azure Confidential VMs increase data privacy and security by protecting data in use. The public preview update also adds support for Windows 11 22H2 to Confidential VMs. For more information, see [our blog post](https://techcommunity.microsoft.com/t5/azure-virtual-desktop-blog/confidential-virtual-machine-support-for-azure-virtual-desktop/ba-p/3686350).

## November 2022

Here's what changed in November 2022:

### RDP Shortpath for public networks now generally available

Remote Desktop Protocol (RDP) Shortpath for public networks is now generally available. RDP Shortpath improves the transport reliability of Azure Virtual Desktop connections by establishing a direct User Datagram Protocol (UDP) data flow between the Remote Desktop client and session hosts. This feature will be enabled by default for all customers. For more information, see [our blog post](https://techcommunity.microsoft.com/t5/azure-virtual-desktop-blog/announcing-general-availability-of-rdp-shortpath/ba-p/3691026).

### Azure Virtual Desktop Insights at Scale in public preview

The ability to review performance and diagnostic information across multiple host pools in one view with Azure Virtual Desktop Insights at Scale is now in public preview. For more information, see [our blog post](https://techcommunity.microsoft.com/t5/azure-virtual-desktop-blog/announcing-the-public-preview-of-avd-insights-at-scale/ba-p/3685387) or [Use Azure Virtual Desktop Insights to monitor your deployment](insights.md).
	
### Intune user configuration for Windows 11 Enterprise multi-session VMs now generally available

Microsoft Intune user scope configuration for Azure Virtual Desktop multi-session VMs on Windows 11 is now generally available. With this feature, you’ll be able to:

- Configure user scope policies using the Settings catalog and assign them to groups of users. 
- Configure user certificates and assign them to users.
- Configure PowerShell scripts to install in the user context and assign them to users.

For more information, see [Azure Virtual Desktop multi-session with Intune](/mem/intune/fundamentals/azure-virtual-desktop-multi-session) or [our blog post](https://techcommunity.microsoft.com/t5/azure-virtual-desktop-blog/microsoft-intune-user-scope-configuration-for-azure-virtual/ba-p/3667410).

### Azure Active Directory Join VMs with FSLogix profiles on Azure Files now generally available

FSLogix profiles with Azure Active Directory (AD)-joined Windows 10, 11, and Windows Server 2022 VMs for hybrid users in Azure Virtual Desktop are now generally available. These FSLogix profiles let you seamlessly access file shares from Azure AD-joined VMs and use them to store your FSLogix profile containers. For more information, see [our blog post](https://techcommunity.microsoft.com/t5/azure-virtual-desktop-blog/announcing-general-availability-of-fslogix-profiles-for-azure-ad/ba-p/3671310).

### Private Link for Azure Virtual Desktop now in public preview

Private endpoints from Azure Private Link for Azure Virtual Desktop are now in public preview. Private Link can enable traffic between session hosts, clients, and the Azure Virtual Desktop service to flow through a private endpoint within your virtual network instead of the public internet. For more information, see [our blog post](https://techcommunity.microsoft.com/t5/azure-virtual-desktop/announcing-public-preview-of-private-link-for-azure-virtual/m-p/3671226), read our overview at [Use Azure Private Link with Azure Virtual Desktop (preview)](private-link-overview.md), or get started at [Set up Private Link for Azure Virtual Desktop (preview)](private-link-setup.md).

## October 2022

Here's what changed in October 2022:

### Background effects for macOS Teams on Azure Virtual Desktop now generally available

Background effects for Teams on Azure Virtual Desktop is now generally available for the macOS version of Teams on Azure Virtual Desktop. This feature lets meeting participants select an available image in Teams to change their background or choose to blur their background. Background effects are only compatible with version 10.7.10 or later of the Azure Virtual Desktop macOS client. For more information, see [What’s new in the macOS client](/windows-server/remote/remote-desktop-services/clients/mac-whatsnew?toc=%2Fazure%2Fvirtual-desktop%2Ftoc.json&bc=%2Fazure%2Fvirtual-desktop%2Fbreadcrumb%2Ftoc.json#updates-for-version-10710).

### Host pool deployment support for Azure availability zones now generally available

We've improved the host pool deployment process. You can now deploy host pools into up to three availability zones in supported Azure regions. For more information, see [our blog post](https://techcommunity.microsoft.com/t5/azure-virtual-desktop-blog/announcing-general-availability-of-support-for-azure/ba-p/3636262).

### FSLogix version 2210 now in public preview

FSLogix version 2210 is now public preview. This new version includes new features, bug fixes, and other improvements. One of the new features is Disk Compaction, which lets you remove white space in a disk to shrink the disk size. Disk Compaction will save you significant amounts of storage capacity in the storage spaces where you keep your FSLogix disks. For more information, see [What’s new in FSLogix](/fslogix/whats-new#fslogix-2210-29830844092---public-preview) or [the FSLogix Disk Compaction blog post](https://techcommunity.microsoft.com/t5/azure-virtual-desktop-blog/announcing-public-preview-fslogix-disk-compaction/ba-p/3644807).

### Universal Print for Azure Virtual Desktop now generally available

The release of Windows 11 22H2 includes an improved printing experience that combines the benefits of Azure Virtual Desktop and Universal Print for Windows 11 multi-session users. Learn more at [Printing on Azure Virtual Desktop using Universal Print](/universal-print/fundamentals/universal-print-avd).

## September 2022

Here's what changed in September 2022:

### Single sign-on and passwordless authentication now in public preview

The ability to enable an Azure Active Directory (AD)-based single sign-on experience and support for passwordless authentication, using Windows Hello and security devices (like FIDO2 keys) is now in public preview. This feature is available for Windows 10, Windows, 11 and Windows Server 2022 session hosts with the September Cumulative Update Preview installed. The single sign-on experience is currently compatible with the Windows Desktop and web clients. For more information, see [our blog post](https://techcommunity.microsoft.com/t5/azure-virtual-desktop-blog/announcing-public-preview-of-sso-and-passwordless-authentication/ba-p/3638244). 

### Connection graphics data logs for Azure Virtual Desktop now in public preview

The ability to collect graphics data for your Azure Virtual Desktop connections through Azure Log Analytics is now in public preview. This data can help administrators understand factors across the server, client, and network that contribute to slow or choppy experiences for a user. For more information, see [our blog post](https://techcommunity.microsoft.com/t5/azure-virtual-desktop/collect-and-query-graphics-data-for-azure-virtual-desktop/m-p/3638565). 

### Multimedia redirection enhancements now in public preview

An upgraded version of multimedia redirection (MMR) for Azure Virtual Desktop is now in public preview. We've made various improvements to this version, including more supported websites, RemoteApp browser support, and enhancements to media controls for better clarity and one-click tracing. Learn more at [Use multimedia redirection on Azure Virtual Desktop (preview)](multimedia-redirection.md) and [our blog post](https://techcommunity.microsoft.com/t5/azure-virtual-desktop/new-multimedia-redirection-upgrades-on-azure-virtual-desktop-are/m-p/3639520). 

### Grouping costs by Azure Virtual Desktop host pool now in public preview

Microsoft Cost Management has a new feature in public preview that lets you group Azure Virtual Desktop costs with Azure tags by using the cm-resource-parent tag key. Cost grouping makes it easier to understand and manage costs by host pool. Learn more at [Tag Azure Virtual Desktop resources to manage costs](tag-virtual-desktop-resources.md) and [our blog post](https://techcommunity.microsoft.com/t5/azure-virtual-desktop-blog/group-costs-by-host-pool-with-cost-management-now-in-public/ba-p/3638285). 

## August 2022

Here's what changed in August 2022:

### Azure portal updates

We've made the following updates to the Azure portal:

- Improved search, filtering, and performance.
- Added Windows Server 2022 images to the image selection list.
- Added "Preferred group type" to the "Basics" tab in the host pool creation process.
- Enabled custom images for trusted launch VMs.
- New selectable cards, including the following:
  - Unavailable machines.
  - User session.
- Removed the "Advanced" tab for the process to add a VM to the host pool.
- Removed the storage blob image option from the host pool creation and adding VM processes.
- Bug fixes.
- Made the following improvements to the "getting started" setup process:
  - Unchecked link Azure template.
  - Removed validation on existing domain admins.

### Updates to the preview version of FSLogix profiles for Azure AD-joined VMs

We've updated the public preview version of the Azure Files integration with Azure AD Kerberos for hybrid identities so that it's now simpler to deploy and manage. The update should give users using FSLogix user profiles on Azure AD-joined session host an overall better experience. For more information, see [the Azure Files blog post](https://techcommunity.microsoft.com/t5/azure-storage-blog/public-preview-leverage-azure-active-directory-kerberos-with/ba-p/3612111).  

### Single sign-on and passwordless authentication now in Windows Insider preview

In the Windows Insider build of Windows 11 22H2, you can now enable a preview version of the Azure AD-based single sign-on experience. This Windows Insider build also supports passwordless authentication with Windows Hello and security devices like FIDO2 keys. For more information, see [our blog post](https://techcommunity.microsoft.com/t5/azure-virtual-desktop/insider-preview-single-sign-on-and-passwordless-authentication/m-p/3608842). 

### Universal Print for Azure Virtual Desktop now in Windows Insider preview

The Windows Insider build of Windows 11 22H2 also includes a preview version of the Universal Print for Azure Virtual Desktop feature. We hope this feature will provide an improved printing experience that combines the benefits of Azure Virtual Desktop and Universal Print for Windows 11 multi-session users. Learn more at [Printing on Azure Virtual Desktop using Universal Print](/universal-print/fundamentals/universal-print-avd) and [our blog post](https://techcommunity.microsoft.com/t5/azure-virtual-desktop/a-better-printing-experience-for-azure-virtual-desktop-with/m-p/3598592). 

### Autoscale for pooled host pools now generally available

Autoscale on Azure Virtual Desktop for pooled host pools is now generally available. This feature is a native automated scaling solution that automatically turns session host virtual machines on and off according to the schedule and capacity thresholds that you define to fit your workload. Learn more at [How autoscale works](autoscale-scenarios.md) and [our blog post](https://techcommunity.microsoft.com/t5/azure-virtual-desktop-blog/announcing-general-availability-of-autoscale-for-pooled-host/ba-p/3591462). 

### Azure Virtual Desktop with Trusted Launch update

Azure Virtual Desktop now supports provisioning Trusted Launch virtual machines with custom images stored in an Azure Compute Gallery. For more information, see [our blog post](https://techcommunity.microsoft.com/t5/azure-virtual-desktop/avd-now-supports-azure-compute-gallery-custom-images-with/m-p/3593955). 

## July 2022

Here's what changed in July 2022: 

### Scheduled agent updates now generally available

Scheduled agent updates on Azure Virtual Desktop are now generally available. This feature gives IT admins control over when the Azure Virtual Desktop agent, side-by-side stack, and Geneva Monitoring agent get updated. For more information, see [our blog post](https://techcommunity.microsoft.com/t5/azure-virtual-desktop-blog/announcing-general-availability-of-scheduled-agent-updates-on/ba-p/3579236). 

### FSLogix 2201 hotfix 2 

The FSLogix 2201 hotfix 2 update includes fixes to multi-session VHD mounting, Cloud Cache meta tracking files, and registry cleanup operations. This update doesn't include new features. Learn more at [What’s new in FSLogix](/fslogix/whats-new?context=%2Fazure%2Fvirtual-desktop%2Fcontext%2Fcontext#fslogix-2201-hotfix-2-29822850276) and [our blog post](https://techcommunity.microsoft.com/t5/azure-virtual-desktop/announcing-fslogix-2201-hotfix-2-2-9-8228-50276-has-been/m-p/3579409). 

### Japan and Australia metadata service now generally available

The Azure Virtual Desktop metadata database located in Japan and Australia is now generally available. This update allows customers to store their Azure Virtual Desktop objects and metadata within a database located within that geography. For more information, see [our blog post](https://techcommunity.microsoft.com/t5/azure-virtual-desktop-blog/announcing-general-availability-of-the-azure-virtual-desktop/ba-p/3570756). 

### Azure Virtual Desktop moving away from Storage Blob image type

Storage Blob images are created from unmanaged disks, which means they lack the availability, scalability, and frictionless user experience that managed images and Shared Image Gallery images offer. As a result, Azure Virtual Desktop will be deprecating support for Storage Blobs image types by August 22, 2022. For more information, see [our blog post](https://techcommunity.microsoft.com/t5/azure-virtual-desktop-blog/azure-virtual-desktop-is-moving-away-from-storage-blob-image/ba-p/3568364). 

### Azure Virtual Desktop Custom Configuration changing to PowerShell

Starting July 21, 2022, Azure Virtual Desktop will replace the Custom Configuration Azure Resource Manager template parameters for creating host pools, adding session hosts to host pools, and the Getting Started feature with a PowerShell script URL parameter stored in a publicly accessible location. This replacement includes the parameters' respective Azure Resource Manager templates. For more information, see [our blog post](https://techcommunity.microsoft.com/t5/azure-virtual-desktop/azure-virtual-desktop-custom-configuration-breaking-change/m-p/3568069). 

## June 2022

Here's what changed in June 2022:

### Australia metadata service in public preview

The Azure Virtual Desktop metadata database located in Australia is now in public preview. This allows customers to store their Azure Virtual Desktop objects and metadata within a database located within our Australia geography, ensuring that the data will only reside within Australia. For more information, see [our blog post](https://techcommunity.microsoft.com/t5/azure-virtual-desktop-blog/announcing-the-public-preview-of-the-azure-virtual-desktop/ba-p/3483090).

### Intune user configuration for Windows 11 Enterprise multi-session VMs in public preview

Deploying Intune user configuration policies from the Microsoft Intune admin center to Windows 11 Enterprise multi-session VMs on Azure Virtual Desktop is now in public preview. In this preview, you can configure the following features:

- User scope policies using the Settings catalog.
- User certificates via Templates.
- PowerShell scripts to run in the user context.

For more information, see [our blog post](https://techcommunity.microsoft.com/t5/azure-virtual-desktop/public-preview-intune-user-configuration-for-windows-11-multi/m-p/3562093).

### Teams media optimizations for macOS now generally available

Teams media optimizations for redirecting audio and video during calls and meetings to a local macOS machine is now generally available. To use this feature, you'll need to update or install, at a minimum, version 10.7.7 of the Azure Virtual Desktop macOS client. Learn more at [Use Microsoft Teams on Azure Virtual Desktop](teams-on-avd.md) and [our blog post](https://techcommunity.microsoft.com/t5/azure-virtual-desktop-blog/microsoft-teams-media-optimizations-is-now-generally-available/ba-p/3563125).

## May 2022

Here's what changed in May 2022:

### Background effects with Teams on Azure Virtual Desktop now generally available

Users can now make meetings more personalized and avoid unexpected distractions by applying background effects. Meeting participants can select an available image in Teams to change their background or choose to blur their background. For more information, see [our blog post](https://techcommunity.microsoft.com/t5/azure-virtual-desktop-blog/microsoft-teams-background-effects-is-now-generally-available-on/ba-p/3401961).

### Multi-window and "Call me with Teams" features now generally available

The multi-window feature gives users the option to pop out chats, meetings, calls, or documents into separate windows to streamline their workflow. The "Call me with Teams" feature lets users transfer a Teams call to their phone. Both features are now generally available in Teams on Azure Virtual Desktop. For more information, see [our blog post](https://techcommunity.microsoft.com/t5/azure-virtual-desktop-blog/microsoft-teams-multi-window-support-and-call-me-are-now-in-ga/ba-p/3401830).

### Japan metadata service in public preview

The Azure Virtual Desktop metadata database located in Japan is now in public preview. This allows customers to store their Azure Virtual Desktop objects and metadata within a database located within our Japan geography, ensuring that the data will only reside within Japan. For more information, see [our blog post](https://techcommunity.microsoft.com/t5/azure-virtual-desktop/announcing-the-public-preview-of-the-azure-virtual-desktop/m-p/3417497).

### FSLogix 2201 hotfix

The latest update for FSLogix 2201 includes fixes to Cloud Cache and container redirection processes. No new features are included with this update. Learn more at [What’s new in FSLogix](/fslogix/whats-new?context=%2Fazure%2Fvirtual-desktop%2Fcontext%2Fcontext) and [our blog post](https://techcommunity.microsoft.com/t5/azure-virtual-desktop/announcing-fslogix-2201-hotfix-1-2-9-8171-14983-has-been/m-p/3435445).

## April 2022

Here's what changed in April 2022:

### Intune device configuration for Windows multi-session now generally available

Deploying Intune device configuration policies from the Microsoft Intune admin center to Windows multi-session VMs on Azure Virtual Desktop is now generally available. Learn more at [Using Azure Virtual Desktop multi-session with Intune](/mem/intune/fundamentals/azure-virtual-desktop-multi-session) and [our blog post](https://techcommunity.microsoft.com/t5/azure-virtual-desktop-blog/intune-device-configuration-for-azure-virtual-desktop-multi/ba-p/3294444).

### Scheduled Agent Updates public preview

Scheduled Agent Updates is a new feature in public preview that lets IT admins specify the time and day the Azure Virtual Desktop agent, side-by-side stack, and Geneva Monitoring agent will update. For more information, see [our blog post](https://techcommunity.microsoft.com/t5/azure-virtual-desktop/scheduled-agent-updates-is-now-in-public-preview-on-azure/m-p/3285874).

### RDP Shortpath for public networks now in public preview

A new feature for RDP Shortpath is now in public preview. With this feature, RDP Shortpath can provide a direct UDP-based network transport for user sessions over public networks. Learn more at [Azure Virtual Desktop RDP Shortpath for public networks (preview)](shortpath-public.md) and [our blog post](https://techcommunity.microsoft.com/t5/azure-virtual-desktop/announcing-public-preview-of-azure-virtual-desktop-rdp-shortpath/m-p/3284763).

### The Azure Virtual Desktop web client has a new URL

Starting April 18, 2022, the Azure Virtual Desktop and Azure Virtual Desktop (classic) web clients will redirect to a new URL. For more information, see [our blog post](https://techcommunity.microsoft.com/t5/azure-virtual-desktop/reminder-the-avd-web-client-will-be-moving-to-a-new-url/m-p/3278231).

## March 2022

Here's what changed in March 2022:

### Live Captions with Teams on Azure Virtual Desktop now generally available

Accessibility has always been important to us, so we're pleased to announce that Teams for Azure Virtual Desktop now supports real-time captions. Learn how to use live captions at [Use live captions in a Teams meeting](https://support.microsoft.com/office/use-live-captions-in-a-teams-meeting-4be2d304-f675-4b57-8347-cbd000a21260). For more information, see [our blog post](https://techcommunity.microsoft.com/t5/azure-virtual-desktop-blog/microsoft-teams-live-captions-is-now-generally-available-on/ba-p/3264148).

### Multimedia redirection enhancements now in public preview

An upgraded version of multimedia redirection (MMR) for Azure Virtual Desktop is now in public preview. We've made various improvements to this version, including more supported websites and media controls for our users. Learn more at [Multimedia redirection for Azure Virtual Desktop](multimedia-redirection.md) and [our blog post](https://techcommunity.microsoft.com/t5/azure-virtual-desktop-blog/new-multimedia-redirection-upgrades-on-azure-virtual-desktop-are/ba-p/3264146).

### FSLogix version 2201 is now generally available

FSLogix version 2201 is now generally available. This version includes improved sign-in and sign-out times, cloud cache performance improvements, and accessibility updates. For more information, see [the FSLogix release notes](/fslogix/whats-new?context=/azure/virtual-desktop/context/context#fslogix-2201-29811153415) and [our blog post](https://techcommunity.microsoft.com/t5/azure-virtual-desktop/announcing-general-availability-of-fslogix-2201-2-9-8111-53415/m-p/3270742).

## February 2022

Here's what changed in February 2022:

### Network data for Azure Virtual Desktop user connections

You now collect network data (both round trip time and available bandwidth) throughout a user’s connection in Azure Virtual Desktop with Azure Log Analytics. For more information, see [our blog post](https://techcommunity.microsoft.com/t5/azure-virtual-desktop/collect-and-query-network-data-for-azure-virtual-desktop/m-p/3140397).

### Unassigning and reassigning personal desktops now generally available

The feature that lets you reassign or unassign personal desktops is now generally available. You can unassign or reassign desktops using the Azure portal or REST API. For more information, see [our blog post](https://techcommunity.microsoft.com/t5/azure-virtual-desktop/azure-virtual-desktop-support-for-personal-desktop-unassignment/m-p/3168914).

### Teams media optimizations for macOS now in public preview

Teams media optimizations for redirecting audio and video during calls and meetings to a local macOS machine are now in public preview. To use this feature, you'll need to update your Azure Virtual Desktop macOS client to version 10.7.7 or later. For more information, see [our blog post](https://techcommunity.microsoft.com/t5/azure-virtual-desktop-blog/teams-media-optimizations-now-in-public-preview-on-azure-virtual/ba-p/3165276) or [Use Microsoft Teams on Azure Virtual Desktop](teams-on-avd.md).

## January 2022

Here's what changed in January 2022:

### FSLogix version 2201 public preview

FSLogix version 2201 is now in public preview. For more information, see [our blog post](https://techcommunity.microsoft.com/t5/azure-virtual-desktop/the-fslogix-2201-public-preview-is-now-available/td-p/3070794) or [the FSLogix release notes](/fslogix/whats-new#fslogix-2201-public-preview-29804843478).

### Migration tool now generally available

The PowerShell commands that migrate metadata from Azure Virtual Desktop (classic) to Azure Virtual Desktop are now generally available. To learn more about migrating your existing deployment, see [Migrate automatically from Azure Virtual Desktop (classic)](automatic-migration.md) or [our blog post](https://techcommunity.microsoft.com/t5/azure-virtual-desktop/tool-to-migrate-from-azure-virtual-desktop-classic-to-arm/m-p/3094856#M8527).

### Increased application group limit

We've increased number of Azure Virtual Desktop application groups you can have on each Azure Active Directory tenant from 200 to 500. For more information, see [our blog post](https://techcommunity.microsoft.com/t5/azure-virtual-desktop/increase-in-avd-application-group-limit-to-500/m-p/3094678).

### Updates to required URLs

We've updated the required URL list for Azure Virtual Desktop to accommodate Azure Virtual Desktop agent traffic. For more information, see [our blog post](https://techcommunity.microsoft.com/t5/azure-virtual-desktop/important-new-changes-in-required-urls/m-p/3094897#M8529).

## December 2021

Here's what changed in December 2021:

### Azure portal updates

You can now automatically create trusted launch virtual machines through the host pool creation process instead of having to manually create and add them to a host pool after deployment. To access this feature, select the **Virtual machines** tab while creating a host pool. Learn more at [Trusted launch for Azure virtual machines](../virtual-machines/trusted-launch.md).
 
### Azure Active Directory Join VMs with FSLogix profiles on Azure Files

Azure Active Directory-joined session hosts for FSLogix profiles on Azure Files in Windows 10 and 11 multi-session is now in public preview. We've updated Azure Files to use a Kerberos protocol for Azure Active Directory that lets you secure folders in the file share to individual users. This new feature also allows FSLogix to function within your deployment without an Active Directory Domain Controller. For more information, check out [our blog post](https://techcommunity.microsoft.com/t5/azure-virtual-desktop-blog/announcing-public-preview-of-fslogix-profiles-for-azure-ad/ba-p/3019855).

### Azure Virtual Desktop pricing calculator updates

We've made some significant updates to improve the Azure Virtual Desktop pricing experience on the Azure pricing calculator, including the following:

- You can now calculate costs for any number of users greater than zero.
- The calculator now includes storage and networking or bandwidth costs.
- We've added new info messages for clarity.
- Fixed bugs that affected storage configuration.

For more information, see the [pricing calculator](https://azure.microsoft.com/pricing/calculator/).

## November 2021

Here's what changed in November 2021:

### Azure Virtual Desktop for Azure Stack HCI

Azure Virtual Desktop for Azure Stack HCI is now in public preview. This feature is for customers who need desktop virtualization for apps that have to stay on-premises for performance and data security reasons. To learn more, see [our blog post](https://aka.ms/avd-ignite2021-blogpost) and [the Azure Virtual Desktop for Azure Stack HCI documentation](azure-stack-hci-overview.md).

### Autoscale public preview

We're pleased to introduce the new autoscale feature, which lets you stop or start session hosts automatically based on a schedule you set. Autoscale lets you optimize infrastructure costs by configuring your shared or pooled desktops to only charge for the resources you actually use. You can learn more about the autoscale feature by reading [our documentation](autoscale-scaling-plan.md) and watching [our Azure Academy video](https://www.youtube.com/watch?v=JolOG7abfa4&ab_channel=AzureAcademy).

### Azure Virtual Desktop starter kit for Power Automate

Your organization can now use the Azure Virtual Desktop starter kit to manage its robotic process automation (RPA) workloads. Learn more by reading [our documentation](/power-automate/desktop-flows/avd-overview).

### Tagging with Azure Virtual Desktop

We recently released new documentation about how to configure tags for Azure Virtual Desktop to track and manage costs. For more information, see [Tag Azure Virtual Desktop resources](tag-virtual-desktop-resources.md).

## October 2021

Here's what changed in October 2021:

### Azure Virtual Desktop support for Windows 11

Azure Virtual Desktop support for Windows 11 is now generally available for single and multi-session deployments. You can now use Windows 11 images when creating host pools in the Azure portal. For more information, see [our blog post](https://techcommunity.microsoft.com/t5/azure-virtual-desktop/windows-11-is-now-generally-available-on-azure-virtual-desktop/ba-p/2810545).

### RDP Shortpath now generally available

Remote Desktop Protocol (RDP) Shortpath for managed networks is now generally available. RDP Shortpath establishes a direct connection between the Remote Desktop client and the session host. This direct connection reduces dependency on gateways, improves the connection's reliability, and increases the bandwidth available for each user session. For more information, see [our blog post](https://techcommunity.microsoft.com/t5/azure-virtual-desktop/rdp-shortpath-for-managed-networks-is-generally-available/m-p/2861468).

### Screen capture protection updates

Screen capture protection is now supported on the macOS client and the Azure Government and Azure operated by 21Vianet clouds. For more information, see [our blog post](https://techcommunity.microsoft.com/t5/azure-virtual-desktop/screen-capture-protection-for-macos-client-and-support-for/m-p/2840089#M7940).

### Azure Active Directory domain join 

Azure Active Directory domain join for Azure Virtual Desktop VMs is now available in the Azure Government and Azure operated by 21Vianet clouds. Microsoft Intune is currently only supported in the Azure Public cloud. Learn more at [Deploy Azure AD-joined virtual machines in Azure Virtual Desktop](deploy-azure-ad-joined-vm.md).

### Breaking change in Azure Virtual Desktop Azure Resource Manager template

A breaking change has been introduced into the Azure Resource Manager template for Azure Virtual Desktop. If you're using any code that depends on the change, then you'll need to follow the directions in [our blog post](https://techcommunity.microsoft.com/t5/azure-virtual-desktop/azure-virtual-desktop-arm-template-change-removal-of-script/m-p/2851538#M7971) to address the issue.

### Autoscale (preview) public preview

Autoscale for Azure Virtual Desktop is now in public preview. This feature natively turns your VMs in pooled host pools on or off based on availability needs. Scheduling when your VMs turn on and off optimizes deployment costs, and this feature also offers flexible scheduling options based on your needs. Once you've configured the required custom Role-Based Access Control (RBAC) role, you can start configuring your scaling plan. For more information, see [Autoscale (preview) for Azure Virtual Desktop host pools](autoscale-scaling-plan.md).

## September 2021

Here's what changed in September 2021.

### Azure portal updates

You can now use Azure Resource Manager templates for any update you want to apply to your session hosts after deployment. You can access this feature by selecting the **Virtual machines** tab while creating a host pool.

You can also now set host pool, application group, and workspace diagnostic settings while creating host pools instead of afterwards. Configuring these settings during the host pool creation process also automatically sets up reporting data for Azure Virtual Desktop Insights.

### Azure Active Directory domain join

Azure Active Directory domain join is now generally available. This service lets you join your session hosts to Azure Active Directory (Azure AD). Domain join also lets you autoenroll into Microsoft Intune. You can access this feature in the Azure public cloud, but not the Government cloud or Azure operated by 21Vianet. For more information, see [our blog post](https://techcommunity.microsoft.com/t5/azure-virtual-desktop/announcing-general-availability-of-azure-ad-joined-vms-support/ba-p/2751083).

### Azure operated by 21Vianet

Azure Virtual Desktop is now generally available in the Azure operated by 21Vianet cloud. For more information, see [our blog post](https://azure.microsoft.com/updates/general-availability-azure-virtual-desktop-is-now-available-in-the-azure-china-cloud/).

### Automatic migration module tool

With the automatic migration tool, you can move your organization from Azure Virtual Desktop (classic) to Azure Virtual Desktop with just a few PowerShell commands. This feature is currently in public preview, and you can find out more at [Automatic migration](automatic-migration.md).

## August 2021

Here's what changed in August 2021:

### Windows 11 (Preview) for Azure Virtual Desktop

Windows 11 (Preview) images are now available in the Azure Marketplace for customers to test and validate with Azure Virtual Desktop. For more information, see [our announcement](https://techcommunity.microsoft.com/t5/azure-virtual-desktop/windows-11-preview-is-now-available-on-azure-virtual-desktop/ba-p/2666468).

### Multimedia redirection is now in public preview

Multimedia redirection gives you smooth video playback while watching videos in your Azure Virtual Desktop web browser and works with Microsoft Edge and Google Chrome. Learn more at [our blog post](https://techcommunity.microsoft.com/t5/azure-virtual-desktop/public-preview-announcing-public-preview-of-multimedia/m-p/2663244#M7692).

### Windows Defender Application Control and Azure Disk Encryption support

Azure Virtual Desktop now supports Windows Defender Application Control to control which drivers and applications are allowed to run on Windows VMs, and Azure Disk Encryption, which uses Windows BitLocker to provide volume encryption for the OS and data disks of your VMs. For more information, see [our announcement](https://techcommunity.microsoft.com/t5/azure-virtual-desktop/support-for-windows-defender-application-control-and-azure-disk/m-p/2658633#M7685).
 
### Signing into Azure Active Directory using smart cards are now supported in Azure Virtual Desktop

While this isn't a new feature for Azure Active Directory, Azure Virtual Desktop now supports configuring Active Directory Federation Services to sign in with smart cards. For more information, see [our announcement](https://techcommunity.microsoft.com/t5/azure-virtual-desktop/signing-in-to-azure-ad-using-smart-cards-now-supported-in-azure/m-p/2654209#M7671).

### Screen capture protection is now generally available

Prevent sensitive information from being screen captured by software running on the client endpoints with screen capture protection in Azure Virtual Desktop. Learn more at our [blog post](https://techcommunity.microsoft.com/t5/azure-virtual-desktop/announcing-general-availability-of-screen-capture-protection-for/m-p/2699684).

## July 2021

Here's what changed in July 2021:

### Azure Virtual Desktop images now include optimized Teams

All available images in the Azure Virtual Desktop image gallery that include Microsoft 365 Apps for Enterprise now have the media-optimized version of Teams for Azure Virtual Desktop pre-installed. For more information, see [our announcement](https://techcommunity.microsoft.com/t5/azure-virtual-desktop/media-optimization-for-microsoft-teams-now-part-of-win10/m-p/2550054#M7442).

### Azure Active Directory Domain Join for Session hosts is in public preview

You can now join your Azure Virtual Desktop VMs directly to Azure Active Directory (Azure AD). This feature lets you connect to your VMs from any device with basic credentials. You can also automatically enroll your VMs with Microsoft Intune. For certain scenarios, this will help eliminate the need for a domain controller, reduce costs, and streamline your deployment. Learn more at [Deploy Azure AD joined virtual machines in Azure Virtual Desktop](deploy-azure-ad-joined-vm.md).

### FSLogix version 2105 is now available

FSLogix version 2105 is now generally available. This version includes improved sign-in times and bug fixes that weren't available in the public preview version (version 2105). For more detailed information, you can see [the FSLogix release notes](/fslogix/whats-new) and [our blog post](https://techcommunity.microsoft.com/t5/azure-virtual-desktop/announcing-general-availability-of-fslogix-2105-2-9-7838-44263/m-p/2539491#M7412).

### Azure Virtual Desktop in China has entered public preview

With Azure Virtual Desktop available in China, we now have more rounded global coverage that helps organizations support customers in this region with improved performance and latency. Learn more at [our announcement page](https://azure.microsoft.com/updates/azure-virtual-desktop-is-now-available-in-the-azure-china-cloud-in-preview/).
 
### The getting started feature for Azure Virtual Desktop

This feature offers a streamlined onboarding experience in the Azure portal to set up your Azure Virtual Desktop environment. You can use this feature to create deployments that meet system requirements for automated Azure Active Directory Domain Services the simple and easy way. For more information, check out our [blog post](https://techcommunity.microsoft.com/t5/azure-virtual-desktop/getting-started-wizard-in-azure-virtual-desktop/m-p/2451385).

### Start VM on connect is now generally available

The start VM on connect feature is now generally available. This feature helps you optimize costs by letting you turn off deallocated or stopped VMs, letting your deployment be flexible with user demands. For more information, see [Start Virtual Machine on Connect](start-virtual-machine-connect.md).

### RemoteApp streaming

We recently announced a new pricing option for RemoteApp streaming for using Azure Virtual Desktop to deliver apps as a service to your customers and business partners. For example, software vendors can use RemoteApp streaming to deliver apps as a software as a service (SaaS) solution that's accessible to their customers. To learn more about RemoteApp streaming, check out [our documentation](./remote-app-streaming/overview.md).


### New Azure Virtual Desktop handbooks

We recently released four new handbooks to help you design and deploy Azure Virtual Desktop in different scenarios: 

- [Application Management](https://azure.microsoft.com/resources/azure-virtual-desktop-handbook-application-management/) will show you how to modernize application delivery and simplify IT management.  
- In [Disaster Recovery](https://azure.microsoft.com/resources/azure-virtual-desktop-handbook-disaster-recovery/), learn how to strengthen business resilience by developing a disaster recovery strategy.  
- Get more value from Citrix investments with the [Citrix Cloud with Azure Virtual Desktop](https://azure.microsoft.com/resources/migration-guide-citrix-cloud-with-azure-virtual-desktop/) migration guide.
- Get more value from existing VMware investments with the [VMware Horizon with Azure Virtual Desktop](https://azure.microsoft.com/resources/migration-guide-vmware-horizon-cloud-and-azure-virtual-desktop/) migration guide.

## June 2021

Here's what changed in June 2021:

### Windows Virtual Desktop is now Azure Virtual Desktop

To better align with our vision of a flexible cloud desktop and application platform, we've renamed Windows Virtual Desktop to Azure Virtual Desktop. Learn more at [the announcement post in our blog](https://azure.microsoft.com/blog/azure-virtual-desktop-the-desktop-and-app-virtualization-platform-for-the-hybrid-workplace/).

### EU, UK, and Canada geographies are now generally available

Metadata service for the European Union, UK, and Canada is now in general availability. These new locations are very important to data sovereignty outside the US. For more information, see [our blog post](https://techcommunity.microsoft.com/t5/azure-virtual-desktop/announcing-public-preview-of-azure-virtual-desktop-service/m-p/2478401#M7314).

### The Getting Started tool is now in public preview

We created the Azure Virtual Desktop Getting Started tool to make the deployment process easier for first-time users. By simplifying and automating the deployment process, we hope this tool will help make adopting Azure Virtual Desktop faster and more accessible to a wider variety of users. Learn more at our [blog post](https://techcommunity.microsoft.com/t5/azure-virtual-desktop/getting-started-wizard-in-azure-virtual-desktop/m-p/2451385).

### Azure Virtual Desktop pricing calculator updates

We've made some significant updates to improve the Azure Virtual Desktop pricing experience on the Azure pricing calculator, including the following:  
  
- We've updated the service name to Azure Virtual Desktop  
- We also updated the layout with the following new items:  
   - A Storage section with both managed disk and file storage bandwidth  
   - A custom section that shows cost-per-user

You can access the pricing calculator at [this page](https://azure.microsoft.com/pricing/calculator/).

### Single Sign-on (SSO) using Active Directory Federation Services (AD FS)

The AD FS single-sign on feature is now generally available. This feature lets customers use AD FS to give a single sign-on experience for users on the Windows and web clients. For more information, see [Configure AD FS single sign-on for Azure Virtual Desktop](configure-adfs-sso.md).

## May 2021

Here's what's new for May 2021:

### Smart card authentication

We've now officially released the Key Distribution Center (KDC) Proxy Remote Desktop Protocol (RDP) properties. These properties enable Kerberos authentication for the RDP portion of an Azure Virtual Desktop session, which includes permitting Network Level Authentication without a password. Learn more at our [blog post](https://techcommunity.microsoft.com/t5/windows-virtual-desktop/new-feature-smart-card-authentication-for-windows-virtual/m-p/2323226).

### The web client now supports file transfer

Starting with the public preview version of the web client, version 1.0.24.7 (preview), users can now transfer files between their remote session and local computer. To upload files to the remote session, select the upload icon in the menu at the top of the web client page. To download files, search for **Remote Desktop Virtual Drive** in the Start menu on your remote session. After you've opened your virtual drive, just drag and drop your files into the Downloads folder and the browser will begin downloading the files to your local computer.

### Start VM on connect support updates

Start VM on connect (preview) now supports pooled host pools and the Azure Government Cloud. To learn more, read our [blog post](https://techcommunity.microsoft.com/t5/windows-virtual-desktop/leverage-start-vm-on-connect-for-pooled-host-pools-and-azure-gov/m-p/2349866).

### Latency improvements for the United Arab Emirates region

We've expanded our Azure control plane presence to the United Arab Emirates (UAE), so customers in that region can now experience improved latency. Learn more at our [Azure Virtual Desktop roadmap](https://www.microsoft.com/microsoft-365/roadmap?filters=Windows%20Virtual%20Desktop&searchterms=64545).

### Ending Internet Explorer 11 support

On September 30, 2021, the Azure Virtual Desktop web client will no longer support Internet Explorer 11. We recommend you start using the [Microsoft Edge](https://www.microsoft.com/edge?form=MY01R2&OCID=MY01R2&r=1) browser for your web client and remote sessions instead. For more information, see the announcement in [this blog post](https://techcommunity.microsoft.com/t5/windows-virtual-desktop/windows-virtual-desktop-web-client-to-end-support-for-internet/m-p/2369007).

### Microsoft Intune public preview

We've started the public preview for Microsoft Intune support in Windows 10 Enterprise multi-session. This new feature will let you manage your Windows 10 VMs with the same tools as your local devices. Learn more at our [Microsoft Endpoint Manger documentation](/mem/intune/fundamentals/windows-virtual-desktop-multi-session).

### FSLogix version 2105 public preview

We have released a public preview of the latest version of the FSLogix agent. Check out our [blog post](https://techcommunity.microsoft.com/t5/windows-virtual-desktop/public-preview-fslogix-release-2105-is-now-available-in-public/m-p/2380996/thread-id/7105) for more information and to submit the form you'll need to access the preview.

### May 2021 updates for Teams for Azure Virtual Desktop

For this update, we resolved an issue that caused the screen to remain black while sharing video. We also fixed a mismatch in video resolutions between the session client and the Teams server. Teams on Azure Virtual Desktop should now change resolution and bit rates based on input from the Teams server.

### Azure portal deployment updates

We've made the following updates to the deployment process in the Azure portal:

- Added new images (including GEN2) to the drop-down list box of "image" when creating a new Azure Virtual Desktop session host VM.
- You can now configure boot diagnostics for virtual machines when creating a host pool.
- Added a tool tip to the RDP proxy in the advanced host pool RDP properties tab.
- Added an information bubble for the icon path when adding an application from an MSIX package.
- You can no longer do managed boot diagnostics with an unmanaged disk.
- Updated the template for creating a host pool in Azure Resource Manager so that the Azure portal can now support creating host pools with third-party marketplace images.

### Single sign-on using Active Directory Federation Services public preview

We've started a public preview for Active Directory Federation Services (AD FS) support for single sign-on (SSO) per host pool. Learn more at [Configure AD FS single sign-on for Azure Virtual Desktop](configure-adfs-sso.md). 

### Enterprise-scale support

We've released an updated section of the Cloud Adoption framework for Enterprise-scale support for Azure Virtual Desktop. For more information, see [Enterprise-scale support for the Azure Virtual Desktop construction set](/azure/cloud-adoption-framework/scenarios/wvd/enterprise-scale-landing-zone).

### Customer adoption kit

We've recently released the Azure Virtual Desktop Customer adoption kit to help customers and partners set up Azure Virtual Desktop for their customers. You can download the kit [here](https://www.microsoft.com/azure/partners/resources/customer-adoption-kit-windows-virtual-desktop).

## April 2021

Here's what's new for April:

### Use the Start VM on Connect feature (preview) in the Azure portal

You can now configure Start VM on Connect (preview) in the Azure portal. With this update, users can access their VMs from the Android and macOS clients. To learn more, see [Start VM on Connect](start-virtual-machine-connect.md).

### Required URL Check tool 

The Azure Virtual Desktop agent, version 1.0.2944.400 includes a tool that validates URLs and displays whether the virtual machine can access the URLs it needs to function. If any required URLs are accessible, the tool will list them so you can unblock them, if needed. Learn more at [Required URL Check tool](required-url-check-tool.md).

### Updates to the Azure portal UI for Azure Virtual Desktop

Here's what changed in the latest update of the Azure portal UI for Azure Virtual Desktop:

- Fixed an issue that caused an error to appear when retrieving the session host while drain mode is enabled.
- Upgraded the Portal SDK to version 7.161.0.
- Fixed an issue that caused the resource ID missing error message to appear in the User Sessions tab.
- The Azure portal now shows detailed sub-status messages for session hosts.

### April 2021 updates for Teams on Azure Virtual Desktop

Here's what's new for Teams on Azure Virtual Desktop:

- Added hardware acceleration for video processing of outgoing video streams for Windows 10-based clients.
- When joining a meeting with both a front facing camera and a rear facing or external camera, the front facing camera will be selected by default.
- Resolved an issue that made Teams crash on x86-based machines.
- Resolved an issue that caused striations during screen sharing.
- Resolved an issue that prevented meeting members from seeing incoming video or screen sharing.

### MSIX app attach is now generally available

MSIX app attach for Azure Virtual Desktop has now come out of public preview and is available to all users. Learn more about MSIX app attach at [our TechCommunity announcement](https://techcommunity.microsoft.com/t5/windows-virtual-desktop/msix-app-attach-is-now-generally-available/m-p/2270468).

### The macOS client now supports Apple Silicon and Big Sur

The macOS Azure Virtual Desktop client now supports Apple Silicon and Big Sur. The full list of updates is available in [What's new in the macOS client](/windows-server/remote/remote-desktop-services/clients/mac-whatsnew).

## March 2021

Here's what changed in March 2021.

### Updates to the Azure portal UI for Azure Virtual Desktop

We've made the following updates to Azure Virtual Desktop for the Azure portal:

- We've enabled new availability options (availability set and zones) for the workflows to create host pools and add VMs.
- We've fixed an issue where a host with the "Needs assistance" status appeared as unavailable. Now the host will have a warning icon next to it.
- We've enabled sorting for active sessions.
- You can now send messages to or sign out specific users on the host details tab.
- We've changed the maximum session limit field.
- We've added an OU validation path to the workflow to create a host pool.
- You can now use the latest version of the Windows 10 image when you create a personal host pool.

### Generation 2 images and Trusted Launch

The Azure Marketplace now has Generation 2 images for Windows 10 Enterprise and Windows 10 Enterprise multi-session. These images will let you use Trusted Launch VMs. Learn more about Generation 2 VMs at [Should I create a generation 1 or 2 virtual machine](../virtual-machines/generation-2.md). To learn how to provision Azure Virtual Desktop Trusted Launch VMs, see [our TechCommunity post](https://techcommunity.microsoft.com/t5/windows-virtual-desktop/windows-virtual-desktop-support-for-trusted-launch/m-p/2206170).

### FSLogix is now preinstalled on Windows 10 Enterprise multi-session images

Based on customer feedback, we've released a new version of the Windows 10 Enterprise multi-session image that has an unconfigured version of FSLogix already installed. We hope this makes your Azure Virtual Desktop deployment easier.

### Azure Virtual Desktop Insights is now in General Availability

Azure Virtual Desktop Insights is now generally available to the public. This feature is an automated service that monitors your deployments and lets you view events, health, and troubleshooting suggestions in a single place. For more information, see [our documentation](insights.md) or check out [our TechCommunity post](https://techcommunity.microsoft.com/t5/windows-virtual-desktop/azure-monitor-for-windows-virtual-desktop-is-generally-available/m-p/2242861).

### March 2021 updates for Teams on Azure Virtual Desktop

We've made the following updates for Teams on Azure Virtual Desktop:

- We've improved video quality performance on calls and 2x2 mode.
- We've reduced CPU utilization by 5-10% (depending on CPU generation) by using hardware offload of video processing (XVP).
- Older machines can now use XVP and hardware decoding to display more incoming video streams smoothly in 2x2 mode.
- We've updated the WebRTC stack from M74 to M88 for better AV sync performance and fewer transient issues.
- We've replaced our software H264 encoder with OpenH264 (OSS used in Teams on the web), which increased the video quality of the outgoing camera.
- We enabled 2x2 mode for Teams Server for the general public on March 30. 2x2 mode shows up to four incoming video streams at the same time.

### Start VM on Connect public preview

The new host pool setting, Start VM on Connect, is now available in public preview. This setting lets you turn on your VMs whenever you need them. If you want to save costs, you'll need to deallocate your VMs by configuring your Azure Compute settings. For more information, check out [our blog post](https://aka.ms/wvdstartvmonconnect) and [our documentation](start-virtual-machine-connect.md).

### Azure Virtual Desktop Specialty certification

We've released a beta version of the AZ-140 exam that will let you prove your expertise in Azure Virtual Desktop in Azure. To learn more, check out [our TechCommunity post](https://techcommunity.microsoft.com/t5/microsoft-learn-blog/beta-exam-prove-your-expertise-in-windows-virtual-desktop-on/ba-p/2147107).

## February 2021

Here's what changed in February 2021.

### Portal experience

We've improved the Azure portal experience in the following ways:

- Bulk drain mode on hosts in the session host grid tab. 
- MSIX app attach is now available for public preview.
- Fixed host pool overview info for dark mode.

### EU metadata storage now in public preview

We're now hosting a public preview of the Europe (EU) geography as a storage option for service metadata in Azure Virtual Desktop. Customers can choose between West or North Europe when they create their service objects. The service objects and metadata for the host pools will be stored in the Azure geography associated with each region. To learn more, read [our blog post announcing the public preview](https://techcommunity.microsoft.com/t5/windows-virtual-desktop/announcing-public-preview-of-windows-virtual-desktop-service/m-p/2143939).

### Teams on Azure Virtual Desktop plugin updates

We've improved video call quality on the Azure Virtual Desktop plugin by addressing the most commonly reported issues, such as when the screen would suddenly go dark or the video and sound desynchronized. These improvements should increase the performance of single-video view with active speaker switching. We also fixed an issue where hardware devices with special characters weren't available in Teams.

## January 2021

Here's what changed in January 2021:

### New Azure Virtual Desktop offer

New customers save 30 percent on Azure Virtual Desktop computing costs for D-series and Bs-series virtual machines for up to 90 days when using the native Microsoft solution. You can redeem this offer in the Azure portal before March 31, 2021. Learn more at our [Azure Virtual Desktop offer page](https://azure.microsoft.com/services/virtual-desktop/offer/).

### networkSecurityGroupRules value change 

In the Azure Resource Manager nested template, we changed the default value for networkSecurityGroupRules from an object to an array. This will prevent any errors if you use managedDisks-customimagevm.json without specifying a value for networkSecurityGroupRules. This wasn't a breaking change and is backward compatible.

### FSLogix hotfix update

We’ve released FSLogix, version 2009 HF_01 (2.9.7654.46150) to solve issues in the previous release (2.9.7621.30127). We recommend you stop using the previous version and update FSLogix as soon as possible.

For more information, see the release notes in [What's new in FSLogix](/fslogix/whats-new#fslogix-apps-2009-hf_01-29765446150).

### Azure portal experience improvements

We've made the following improvements to the Azure portal experience:

- You can now add local VM admin credentials directly instead of having to add a local account created with the Active Directory domain join account credentials.
- Users can now list both individual and group assignments in separate tabs for individual users and groups.
- The version number of the Azure Virtual Desktop Agent is now visible in the Virtual Machine overview for host pools.
- Added bulk delete for host pools and application groups.
- You can now enable or disable drain mode for multiple session hosts in a host pool.
- Removed the public IP field from the VM details page.

### Azure Virtual Desktop Agent troubleshooting

We recently set up the [Azure Virtual Desktop Agent troubleshooting guide](troubleshoot-agent.md) to help customers who have encountered common issues.

### Microsoft Defender for Endpoint integration

Microsoft Defender for Endpoint integration is now generally available. This feature gives your Azure Virtual Desktop VMs the same investigation experience as a local Windows 10 machine. If you're using Windows 10 Enterprise multi-session, Microsoft Defender for Endpoint will support up to 50 concurrent user connections, giving you the cost savings of Windows 10 Enterprise multi-session and the confidence of Microsoft Defender for Endpoint. For more information, check out our [blog post](https://techcommunity.microsoft.com/t5/microsoft-defender-for-endpoint/windows-virtual-desktop-support-is-now-generally-available/ba-p/2103712).

### Azure Security baseline for Azure Virtual Desktop

We've recently published [an article about the Azure security baseline](security-baseline.md) for Azure Virtual Desktop that we'd like to call your attention to. These guidelines include information about how to apply the Microsoft cloud security benchmark to Azure Virtual Desktop. The Microsoft cloud security benchmark describes the settings and practices we recommend you use to secure your cloud solutions on Azure.

## December 2020

Here's what changed in December 2020: 

### Azure Virtual Desktop Insights

The public preview for Azure Virtual Desktop Insights is now available. This new feature includes a robust dashboard built on top of Azure Monitor Workbooks to help IT professionals understand their Azure Virtual Desktop environments. Check out [the announcement on our blog](https://techcommunity.microsoft.com/t5/windows-virtual-desktop/azure-monitor-for-windows-virtual-desktop-public-preview/m-p/1946587) for more details. 

### Azure Resource Manager template change 

In the latest update, we've removed all public IP address parameter from the Azure Resource Manager template for creating and provisioning host pools. We highly recommend you avoid using public IPs for Azure Virtual Desktop to keep your deployment secure. If your deployment relied on public IPs, you'll need to reconfigure it to use private IPs instead, otherwise your deployment won't work properly.

### MSIX app attach public preview 

MSIX app attach is another service that began its public preview this month. MSIX app attach is a service that dynamically presents MSIX applications to your Azure Virtual Desktop Session host VMs. Check out [the announcement on our blog](https://techcommunity.microsoft.com/t5/windows-virtual-desktop/msix-app-attach-azure-portal-integration-public-preview/m-p/1986231) for more details. 

### Screen capture protection 

This month also marked the beginning of the public preview for screen capture protection. You can use this feature to prevent sensitive information from being captured on the client endpoints. Give screen capture protection a try by going to [this page](https://aka.ms/WVDScreenCaptureProtection).  

### Built-in roles

We've added new built-in roles for Azure Virtual Desktop for admin permissions. For more information, see [Built-in roles for Azure Virtual Desktop](rbac.md). 

### Application group limit increase

We've increased the default application group limit per Azure Active Directory tenant to 200 groups.

## November 2020

### Azure portal experience

We've fixed two bugs in the Azure portal user experience:

- The Desktop application friendly name is no longer overwritten on the "Add VM" workflow.
- The session host tab will now load if session hosts are part of scale sets.

### FSLogix client, version 2009 

We've released a new version of the FSLogix client with many fixes and improvements. Learn more at [our blog post](https://social.msdn.microsoft.com/Forums/defe5828-fba4-4715-a68c-0e4d83eefa6b/release-notes-for-fslogix-apps-release-2009-29762130127?forum=FSLogix).

### RDP Shortpath public preview

RDP Shortpath introduces direct connectivity to your Azure Virtual Desktop session host using point-to-site and site-to-site VPNs and ExpressRoute. It also introduces the URCP transport protocol. RDP Shortpath is designed to reduce latency and network hops in order to improve user experience. Learn more at [Azure Virtual Desktop RDP Shortpath](shortpath.md).

### Az.DesktopVirtualization, version 2.0.1

We've released version 2.0.1 of the Azure Virtual Desktop cmdlets. This update includes cmdlets that will let you manage MSIX App Attach. You can download the new version at [the PowerShell gallery](https://www.powershellgallery.com/packages/Az.DesktopVirtualization/2.0.1).

### Azure Advisor updates

Azure Advisor now has a new recommendation for proximity guidance in Azure Virtual Desktop, and a new recommendation for optimizing performance in depth-first load balanced host pools. Learn more at [the Azure website](https://azure.microsoft.com/updates/new-recommendations-from-azure-advisor/).

## October 2020

Here's what changed in October 2020:

### Improved performance

We've optimized performance by reducing connection latency in the following Azure geographies:

- Switzerland
- Canada

You can now use the [Experience Estimator](https://azure.microsoft.com/services/virtual-desktop/assessment/) to estimate the user experience quality in these areas.

### Azure Government Cloud availability

The Azure Government Cloud is now generally available. Learn more at [our blog post](https://azure.microsoft.com/updates/windows-virtual-desktop-is-now-generally-available-in-the-azure-government-cloud/).

### Azure Virtual Desktop Azure portal updates

We've made some updates to the Azure Virtual Desktop Azure portal:

- Fixed a resourceID error that prevented users from opening the "Sessions" tab.
- Streamlined the UI on the "Session hosts" tab.
- Fixed the "Defaults," "Usability," and "Restore defaults" settings under RDP properties.
- Made "Remove" and "Delete" functions consistent across all tabs.
- The portal now validates app names in the "Add an app" workflow.
- Fixed an issue where the session host export data wasn't aligned in the columns.
- Fixed an issue where the portal couldn't retrieve user sessions.
- Fixed an issue in session host retrieval that happened when the virtual machine was created in a different resource group.
- Updated the "Session host" tab to list both active and disconnected sessions.
- The "Applications" tab now has pages.
- Fixed an issue where the "requires command line" text didn't display correctly in the "Application list" tab.
- Fixed an issue when the portal couldn't deploy host pools or virtual machines while using the German-language version of the Shared Image Gallery.

## September 2020

Here's what changed in September 2020:

- We've optimized performance by reducing connection latency in the following Azure geographies:
    - Germany
    - South Africa (for validation environments only)

You can now use the [Experience Estimator](https://azure.microsoft.com/services/virtual-desktop/assessment/) to estimate the user experience quality in these areas.

- We released version 1.2.1364 of the Windows Desktop client for Azure Virtual Desktop. In this update, we made the following changes:
    - Fixed an issue where single sign-on (SSO) didn't work on Windows 7.
    - Fixed an issue that caused the client to disconnect when a user who enabled media optimization for Teams tried to call or join a Teams meeting while another app had an audio stream open in exclusive mode.
    - Fixed an issue where Teams didn't enumerate audio or video devices when media optimization for Teams was enabled.
    - Added a "Need help with settings?" link to the desktop settings page.
    - Fixed an issue with the "Subscribe" button that happened when using high-contrast dark themes.
    
- Thanks to the tremendous help from our users, we've fixed two critical issues for the Microsoft Store Remote Desktop client. We'll continue to review feedback and fix issues as we broaden our phased release of the client to more users worldwide.
    
- We've added a new feature that lets you change VM location, image, resource group, prefix name, network config as part of the workflow for adding a VM to your deployment in the Azure portal.

- IT Pros can now manage hybrid Azure Active Directory-joined Windows 10 Enterprise VMs using Microsoft Intune. To learn more, see [our blog post](https://techcommunity.microsoft.com/t5/microsoft-endpoint-manager-blog/microsoft-endpoint-manager-announces-support-for-windows-virtual/ba-p/1681048).

## August 2020

Here's what changed in August 2020:

- We've improved performance to reduce connection latency in the following Azure regions: 

    - United Kingdom
    - France
    - Norway
    - South Korea

   You can use the [Experience Estimator](https://azure.microsoft.com/services/virtual-desktop/assessment/) to get a general idea of how these changes will affect your users.

- The Microsoft Store Remote Desktop Client (v10.2.1522+) is now generally available! This version of the Microsoft Store Remote Desktop Client is compatible with Azure Virtual Desktop. We've also introduced refreshed UI flows for improved user experiences. This update includes fluent design, light and dark modes, and many other exciting changes. We've also rewritten the client to use the same underlying remote desktop protocol (RDP) engine as the iOS, macOS, and Android clients. This lets us deliver new features at a faster rate across all platforms. [Download the client](https://www.microsoft.com/p/microsoft-remote-desktop/9wzdncrfj3ps?rtc=1&activetab=pivot:overviewtab) and give it a try!

- We fixed an issue in the Teams Desktop client (version 1.3.00.21759) where the client only showed the UTC time zone in the chat, channels, and calendar. The updated client now shows the remote session's time zone instead.

- Azure Advisor is now a part of Azure Virtual Desktop. When you access Azure Virtual Desktop through the Azure portal, you can see recommendations for optimizing your Azure Virtual Desktop environment. Learn more at [Introduction to Azure Advisor](../advisor/advisor-overview.md).

- Azure CLI now supports Azure Virtual Desktop (`az desktopvirtualization`) to help you automate your Azure Virtual Desktop deployments. Check out [desktopvirtualization](/cli/azure/desktopvirtualization) for a list of extension commands.

- We've updated our deployment templates to make them fully compatible with the Azure Virtual Desktop Azure Resource Manager interfaces. You can find the templates on [GitHub](https://github.com/Azure/RDS-Templates/tree/master/ARM-wvd-templates).

- The Azure Virtual Desktop US Gov portal is now in public preview. To learn more, see [our announcement](https://azure.microsoft.com/updates/windows-virtual-desktop-is-now-available-in-the-azure-government-cloud-in-preview/).

## July 2020  

July was when Azure Virtual Desktop with Azure Resource Management integration became generally available.

Here's what changed with this new release: 

- The "Fall 2019 release" is now known as "Azure Virtual Desktop (classic)," while the "Spring 2020 release" is now just "Azure Virtual Desktop." For more information, check out [this blog post](https://azure.microsoft.com/blog/new-windows-virtual-desktop-capabilities-now-generally-available/). 

To learn more about new features, check out [this blog post](https://techcommunity.microsoft.com/t5/itops-talk-blog/windows-virtual-desktop-spring-update-enters-public-preview/ba-p/1340245). 

### Autoscaling tool update

The latest version of the autoscaling tool that was in preview is now generally available. This tool uses an Azure Automation account and the Azure Logic App to automatically shut down and restart session host VMs within a host pool, reducing infrastructure costs. Learn more at [Scale session hosts using Azure Automation](set-up-scaling-script.md).

### Azure portal

You can now do the following things with the Azure portal in Azure Virtual Desktop: 

- Directly assign users to personal desktop session hosts  
- Change the validation environment setting for host pools 

### Diagnostics

We've released some new prebuilt queries for the Log Analytics workspace. To access the queries, go to **Logs** and under **Category**, select **Azure Virtual Desktop**. Learn more at [Use Log Analytics for the diagnostics feature](diagnostics-log-analytics.md).

### Update for Remote Desktop client for Android

The [Remote Desktop client for Android](https://play.google.com/store/apps/details?id=com.microsoft.rdc.androidx) now supports Azure Virtual Desktop connections. Starting with version 10.0.7, the Android client features a new UI for improved user experience. The client also integrates with Microsoft Authenticator on Android devices to enable conditional access when subscribing to Azure Virtual Desktop workspaces.  

The previous version of Remote Desktop client is now called “Remote Desktop 8." Any existing connections you have in the earlier version of the client will be transferred seamlessly to the new client. The new client has been rewritten to the same underlying RDP core engine as the iOS and macOS clients, faster release of new features across all platforms. 

### Teams update

We've made improvements to Microsoft Teams for Azure Virtual Desktop. Most importantly, Azure Virtual Desktop now supports audio and video optimization for the Windows Desktop client. Redirection improves latency by creating direct paths between users when they use audio or video in calls and meetings. Less distance means fewer hops, which makes calls look and sound smoother. Learn more at [Use Teams on Azure Virtual Desktop](./teams-on-avd.md).

## June 2020

Last month, we introduced Azure Virtual Desktop with Azure Resource Manager integration in preview. This update has lots of exciting new features we'd love to tell you about. Here's what's new for this version of Azure Virtual Desktop.

### Azure Virtual Desktop is now integrated with Azure Resource Manager

Azure Virtual Desktop is now integrated into Azure Resource Manager. In the latest update, all Azure Virtual Desktop objects are now Azure Resource Manager resources. This update is also integrated with Azure role-based access control (Azure RBAC). See [What is Azure Resource Manager?](../azure-resource-manager/management/overview.md) to learn more.

Here's what this change does for you:

- Azure Virtual Desktop is now integrated with the Azure portal. This means you can manage everything directly in the portal, no PowerShell, web apps, or third-party tools required. To get started, check out our tutorial at [Create a host pool with the Azure portal](create-host-pools-azure-marketplace.md).

- Before this update, you could only publish desktops and applications to individual users. With Azure Resource Manager, you can now publish resources to Azure Active Directory groups.

- The earlier version of Azure Virtual Desktop had four built-in admin roles that you could assign to a tenant or host pool. These roles are now in [Azure role-based access control (Azure RBAC)](../role-based-access-control/overview.md). You can apply these roles to every Azure Virtual Desktop Azure Resource Manager object, which lets you have a full, rich delegation model.

- In this update, you no longer need to run Azure Marketplace or the GitHub template repeatedly to expand a host pool. All you need to expand a host pool is to go to your host pool in the Azure portal and select **+ Add** to deploy additional session hosts.

- Host pool deployment is now fully integrated with the [Azure Shared Image Gallery](../virtual-machines/shared-image-galleries.md). Shared Image Gallery is a separate Azure service that stores VM image definitions, including image versioning. You can also use global replication to copy and send your images to other Azure regions for local deployment.

- Monitoring functions that used to be done through PowerShell or the Diagnostics Service web app have now moved to Log Analytics in the Azure portal. You also now have two options to visualize your reports. You can run Kusto queries and use Workbooks to create visual reports.

- You're no longer required to complete Azure Active Directory consent to use Azure Virtual Desktop. In this update, the Azure Active Directory tenant on your Azure subscription authenticates your users and provides Azure RBAC controls for your admins.

### PowerShell support

We've added new AzWvd cmdlets to the Azure Az PowerShell module with this update. This new module is supported in PowerShell Core, which runs on .NET Core.

To install the module, follow the instructions in [Set up the PowerShell module for Azure Virtual Desktop](powershell-module.md).

You can also see a list of available commands at the [AzWvd PowerShell reference](/powershell/module/az.desktopvirtualization/#desktopvirtualization).

For more information about the new features, check out [our blog post](https://techcommunity.microsoft.com/t5/itops-talk-blog/windows-virtual-desktop-spring-update-enters-public-preview/ba-p/1340245).

### Additional gateways

We've added a new gateway cluster in South Africa to reduce connection latency.

### Microsoft Teams on Azure Virtual Desktop (Preview)

We've made some improvements to Microsoft Teams for Azure Virtual Desktop. Most importantly, Azure Virtual Desktop now supports audio and visual redirection for calls. Redirection improves latency by creating direct paths between users when they call using audio or video. Less distance means fewer hops, which makes calls look and sound smoother.

To learn more, see [our blog post](https://azure.microsoft.com/updates/windows-virtual-desktop-media-optimization-for-microsoft-teams-is-now-available-in-public-preview/).
