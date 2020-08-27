---
title: What's new in Windows Virtual Desktop? - Azure
description: New features and product updates for Windows Virtual Desktop.
author: Heidilohr
ms.topic: overview
ms.date: 08/07/2020
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

July was when Windows Virtual Desktop with Azure Resource Management integration became generally available.

Here's what changed with this new release: 

- The "Fall 2019 release" is now known as "Windows Virtual Desktop (Classic)," while the "Spring 2020 release" is now just "Windows Virtual Desktop." For more information, check out [this blog post](https://azure.microsoft.com/blog/new-windows-virtual-desktop-capabilities-now-generally-available/). 

To learn more about new features, check out [this blog post](https://techcommunity.microsoft.com/t5/itops-talk-blog/windows-virtual-desktop-spring-update-enters-public-preview/ba-p/1340245). 

### Autoscaling tool update

The latest version of the autoscaling tool that was in preview is now generally available. This tool uses an Azure automation account and the Azure Logic App to automatically shut down and restart session host virtual machines (VMs) within a host pool, reducing infrastructure costs. Learn more at [Scale session hosts using Azure Automation](set-up-scaling-script.md).

### Azure portal

You can now do the following things with the Azure portal in Windows Virtual Desktop: 

- Directly assign users to personal desktop session hosts  
- Change the validation environment setting for host pools 

### Diagnostics

We've released some new prebuilt queries for the Log Analytics workspace. To access the queries, go to **Logs** and under **Category**, select **Windows Virtual Desktop**. Learn more at [Use Log Analytics for the diagnostics feature](diagnostics-log-analytics.md).

### Update for Remote Desktop client for Android

The [Remote Desktop client for Android](https://play.google.com/store/apps/details?id=com.microsoft.rdc.androidx) now supports Windows Virtual Desktop connections. Starting with version 10.0.7, the Android client features a new UI for improved user experience. The client also integrates with Microsoft Authenticator on Android devices to enable conditional access when subscribing to Windows Virtual Desktop workspaces.  

The previous version of Remote Desktop client is now called “Remote Desktop 8." Any existing connections you have in the earlier version of the client will be transferred seamlessly to the new client. The new client has been rewritten to the same underlying RDP core engine as the iOS and macOS clients, faster release of new features across all platforms. 

### Teams update

We've made improvements to Microsoft Teams for Windows Virtual Desktop. Most importantly, Windows Virtual Desktop now supports audio and video optimization for the Windows Desktop client. Redirection improves latency by creating direct paths between users when they use audio or video in calls and meetings. Less distance means fewer hops, which makes calls look and sound smoother. Learn more at [Use Teams on Windows Virtual Desktop](teams-on-wvd.md).

## June 2020

Last month, we introduced Windows Virtual Desktop with Azure Resource Manager integration in preview. This update has lots of exciting new features we'd love to tell you about. Here's what's new for this version of Windows Virtual Desktop.

### Windows Virtual Desktop is now integrated with Azure Resource Manager

Windows Virtual Desktop is now integrated into Azure Resource Manager. In the latest update, all Windows Virtual Desktop objects are now Azure Resource Manager resources. This update is also integrated with Azure role-based access control (Azure RBAC). See [What is Azure Resource Manager?](../azure-resource-manager/management/overview.md) to learn more.

Here's what this change does for you:

- Windows Virtual Desktop is now integrated with the Azure portal. This means you can manage everything directly in the portal, no PowerShell, web apps, or third-party tools required. To get started, check out our tutorial at [Create a host pool with the Azure portal](create-host-pools-azure-marketplace.md).

- Before this update, you could only publish RemoteApps and Desktops to individual users. With Azure Resource Manager, you can now publish resources to Azure Active Directory groups.

- The earlier version of Windows Virtual Desktop had four built-in admin roles that you could assign to a tenant or host pool. These roles are now in [Azure role-based access control (Azure RBAC)](../role-based-access-control/overview.md). You can apply these roles to every Windows Virtual Desktop Azure Resource Manager object, which lets you have a full, rich delegation model.

- In this update, you no longer need to run Azure Marketplace or the GitHub template repeatedly to expand a host pool. All you need to expand a host pool is to go to your host pool in the Azure portal and select **+ Add** to deploy additional session hosts.

- Host pool deployment is now fully integrated with the [Azure Shared Image Gallery](../virtual-machines/windows/shared-image-galleries.md). Shared Image Gallery is a separate Azure service that stores virtual machine (VM) image definitions, including image versioning. You can also use global replication to copy and send your images to other Azure regions for local deployment.

- Monitoring functions that used to be done through PowerShell or the Diagnostics Service web app have now moved to Log Analytics in the Azure portal. You also now have two options to visualize your reports. You can run Kusto queries and use Workbooks to create visual reports.

- You're no longer required to complete Azure Active Directory (Azure AD) consent to use Windows Virtual Desktop. In this update, the Azure AD tenant on your Azure subscription authenticates your users and provides Azure RBAC controls for your admins.


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
