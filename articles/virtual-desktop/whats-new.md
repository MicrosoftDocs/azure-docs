---
title: What's new in Windows Virtual Desktop? - Azure
description: New features and product updates for Windows Virtual Desktop.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: overview
ms.date: 06/15/2020
ms.author: helohr
ms.reviewer: thhickli; darank
manager: lizross
---
# What's new in Windows Virtual Desktop?

Windows Virtual Desktop updates on a regular basis. This article is where you'll find out about:

- The latest updates
- New features
- Improvements to existing features
- Bug fixes

This article is updated monthly. Make sure to check back here often to keep up with new updates.


## July 2020  

Within July, new capabilities of Windows Virtual Desktop entered General Availability. Many new features were enabled as part of this release: 

What was known previously as the Spring 2020 Update set of capabilities has now been released into General Availability. In this process this set of updates has had a name change. The Spring 2020 Update capability will now simply be referred to as ‘Windows Virtual Desktop’. What was referred to as Fall 2019 Release is now known as ‘Windows Virtual Desktop (classic)’. Please see this [article](https://azure.microsoft.com/en-us/blog/new-windows-virtual-desktop-capabilities-now-generally-available/) for further information. 

For more information about the new features, check out [our blog post](https://techcommunity.microsoft.com/t5/itops-talk-blog/windows-virtual-desktop-spring-update-enters-public-preview/ba-p/1340245). 

###Updated Autoscaling tool.  
An updated version of the autoscaling tool has been made generally available. This tool makes use of an Azure automation account and an Azure Logic App to provide the autoscaling capability that will automatically shut down and restart session host VMs within a host pool, allowing you to reduce your infrastructure costs. More information is available here.   

###Quality improvements 

Improvements in reliability, performance and capacity, and multi-geo DB improvements. 

###Azure portal 
Within the Windows Virtual Desktop section of the Azure portal it is now possible to enable: 

- Direct user assignment of users to personal desktop session hosts  
- The Validation Environment setting for host pools 
 

###Diagnostics 
We have released a handful of prebuilt queries directly into your Log Analytics workspace. To access, go to Logs and select Category Windows Virtual Desktop. More information is available here. 

###Client for Android 

The new [Remote Desktop client for Android](https://play.google.com/store/apps/details?id=com.microsoft.rdc.androidx) now supports Windows Virtual Desktop connections. In this new client (version 10.0.7 or later) we have brought in refreshed UI flows for improved user-experiences. The app also integrates with Microsoft Authenticator on the device to enable conditional access when subscribing to Windows Virtual Desktop workspaces.  

The older Remote Desktop client is now renamed to “Remote Desktop 8” and your existing connections will be transferred over to the new client seamlessly. The new client has been re-written to the same underlying RDP core engine as the iOS and macOS clients, which enables us to deliver new features at a faster cadence across all platforms. 

###Teams with Media Optimizations GA  

We've made improvements to Microsoft Teams for Windows Virtual Desktop. Most importantly, Windows Virtual Desktop now supports audio and video optimization for the Windows Desktop client. Redirection improves latency by creating direct paths between users when they call using audio or video in calls and meetings. Less distance means fewer hops, which makes calls look and sound smoother. More information is available [here](https://aka.ms/wvdteams).


## June 2020

Last month, we introduced Windows Virtual Desktop with Azure Resource Manager integration in preview. This update has lots of exciting new features we'd love to tell you about. Here's what's new for this version of Windows Virtual Desktop.

### Windows Virtual Desktop is now integrated with Azure Resource Manager (Preview)

Windows Virtual Desktop is now integrated into Azure Resource Manager. In the latest update, all Windows Virtual Desktop objects are now Azure Resource Manager resources. This update is also integrated with Azure role-based access controls (RBAC). See [What is Azure Resource Manager?](../azure-resource-manager/management/overview.md) to learn more.

Here's what this change does for you:

- Windows Virtual Desktop is now integrated with the Azure portal. This means you can manage everything directly in the portal, no PowerShell, web apps, or third-party tools required. To get started, check out our tutorial at [Create a host pool with the Azure portal](create-host-pools-azure-marketplace.md).

- Before this update, you could only publish RemoteApps and Desktops to individual users. With Azure Resource Manager, you can now publish resources to Azure Active Directory groups.

- The earlier version of Windows Virtual Desktop had four built-in admin roles that you could assign to a tenant or host pool. These roles are now in Azure [role-based access control](../role-based-access-control/overview.md). You can apply these roles to every Windows Virtual Desktop Azure Resource Manager object, which lets you have a full, rich delegation model.

- In this update, you no longer need to run Azure Marketplace or the GitHub template repeatedly to expand a host pool. All you need to expand a host pool is to go to your host pool in the Azure portal and select **+ Add** to deploy additional session hosts.

- Host pool deployment is now fully integrated with the [Azure Shared Image Gallery](../virtual-machines/windows/shared-image-galleries.md). Shared Image Gallery is a separate Azure service that stores virtual machine (VM) image definitions, including image versioning. You can also use global replication to copy and send your images to other Azure regions for local deployment.

- Monitoring functions that used to be done through PowerShell or the Diagnostics Service web app have now moved to Log Analytics in the Azure portal. You also now have two options to visualize your reports. You can run Kusto queries and use Workbooks to create visual reports.

- You're no longer required to complete Azure Active Directory (Azure AD) consent to use Windows Virtual Desktop. In this update, the Azure AD tenant on your Azure subscription authenticates your users and provides RBAC controls for your admins.


### PowerShell support

We've added new AzWvd cmdlets to the Azure PowerShell Az Module with this update. This new module is supported in PowerShell Core, which runs on .NET Core.

To install the module, follow the instructions in [Set up the PowerShell module for Windows Virtual Desktop](powershell-module.md).

You can also see a list of available commands at the [AzWvd PowerShell reference](/powershell/module/az.desktopvirtualization/?view=azps-4.2.0#desktopvirtualization).

For more information about the new features, check out [our blog post](https://techcommunity.microsoft.com/t5/itops-talk-blog/windows-virtual-desktop-spring-update-enters-public-preview/ba-p/1340245). 

### Additional gateways

We've added a new gateway cluster in South Africa to reduce connection latency.

### Microsoft Teams on Windows Virtual Desktop (Preview)

We've made some improvements to Microsoft Teams for Windows Virtual Desktop. Most importantly, Windows Virtual Desktop now supports audio and visual redirection for calls. Redirection improves latency by creating direct paths between users when they call using audio or video. Less distance means fewer hops, which makes calls look and sound smoother.

To learn more, see [our blog post](https://azure.microsoft.com/updates/windows-virtual-desktop-media-optimization-for-microsoft-teams-is-now-available-in-public-preview/).

## Next steps

Learn about future plans at the [Microsoft 365 Windows Virtual Desktop roadmap](https://www.microsoft.com/microsoft-365/roadmap?filters=Windows%20Virtual%20Desktop).

Check out these articles to learn about updates for our clients for Windows Virtual Desktop and Remote Desktop Services:

- [Windows](/windows-server/remote/remote-desktop-services/clients/windowsdesktop-whatsnew)
- [macOS](/windows-server/remote/remote-desktop-services/clients/mac-whatsnew)
- [iOS](/windows-server/remote/remote-desktop-services/clients/ios-whatsnew)
- [Android](/windows-server/remote/remote-desktop-services/clients/android-whatsnew)
- [Web](/windows-server/remote/remote-desktop-services/clients/web-client-whatsnew)
