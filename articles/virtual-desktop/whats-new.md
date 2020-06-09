---
title: What's new in Windows Virtual Desktop? - Azure
description: New features and product updates for Windows Virtual Desktop.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: overview
ms.date: 06/09/2020
ms.author: helohr
manager: lizross
---
# What's new in Windows Virtual Desktop?

Windows Virtual Desktop updates on a regular basis. This article is where you'll find out about:

- The latest releases
- New features
- Improvements to existing features
- Bug fixes

This article is updated monthly. Make sure to check back here often to keep up with new releases.

## June 2020

Last month, we released the Windows Virtual Desktop Spring 2020 release. This update has lots of exciting new features we'd love to tell you about. Here's what's new for the Spring 2020 release as well as the updates we've made in the month since.

### Windows Virtual Desktop is now an Azure Resource Manager service

Windows Virtual Desktop is now an Azure Resource Manager service. In the Spring 2020 release, all Windows Virtual Desktop objects are now Azure Resource Manager resources. Since the Windows Virtual Desktop Spring 2020 release has integrated with the Azure portal, users can use Azure Resource Manager to interact the Azure service fabric. To learn more, see [What is Azure Resource Manager?](../azure-resource-manager/management/overview.md).

Here's what this change does for you:

- Windows Virtual Desktop is now integrated with the Azure portal. This means you can manage everything directly in the portal, no PowerShell, web apps, or third-party tools required.

- Before the Spring 2020 release, you could only publish RemoteApps and Desktops to individual users. With Azure Resource Manager, you can now publish resources to Azure Active Directory groups.

- In the Fall 2019 release, there were four Remote Desktop Service (RDS) admin roles that you could assign to a tenant or host pool. These roles are now in Azure [role-based access control](../role-based-access-control/overview.md). You can apply these roles to every Windows Virtual Desktop Azure Resource Manager object, which lets you have a full, rich delegation model.

- In the Spring 2020 release, you no longer need to run Azure Marketplace or the GitHub template repeatedly to expand a host pool. All you need to expand a host pool is to go to yoru host pool in teh Azure portal and select **+ Add session hosts**.

- Host pool deployment is now fully integrated with the [Azure Shared Image Gallery](../virtual-machines/windows/shared-image-galleries.md). Shared Image Gallery is a separate Azure service that stores virtual machine (VM) image definitions, including image versioning. You can also use global replication to copy and send your images to other Azure regions for local deployment.

- Monitoring functions that used to be done through PowerShell or the Diagnostics Service web app have now moved to Log Analytics in the Azure portal. You can run independent reports for multiple Azure Resource Manager objects at once. You can now either integrate with Power BI or run a Kusto query and use Workbooks to create visual reports.

- You're no longer required to complete Azure Active Directory (Azure AD) consent to use Windows Virtual Desktop. In the Spring 2020 release, the Azure AD tenant on your Azure subscription authenticates your users and provides RBAC controls for your admins.

### Service metadata storage location

With the Spring 2020 release, Windows Virtual Desktop now lets you select additional US and EU geographies to store your metadata in.

Learn more about data locations at [Data locations](data-locations.md).

### PowerShell support

The Spring 2020 release features the new AzWvd PowerShell module. This new module is supported in PowerShell Core, which runs on .NET Core.

To install the module, run the following cmdlet:

```powershell
Install-Module Az.DesktopVirtualization
```

Once you've installed the module, run this cmdlet to get the list of available commands:

```powershell
Get-Command-Module Az.DesktopVirtualization
```

For more information about the new features, check out [our blog post](https://techcommunity.microsoft.com/t5/itops-talk-blog/windows-virtual-desktop-spring-update-enters-public-preview/ba-p/1340245). You can also see a list of available commands at the [AzWvd PowerShell reference](/powershell/module/az.desktopvirtualization/?view=azps-4.2.0#desktopvirtualization).

### Microsoft Teams on Windows Virtual Desktop

We've made some improvements to Microsoft Teams for Windows Virtual Desktop. Most importantly, we now support audio and visual redirection for calls. Redirection improves latency by creating a direct path between users when they use audio and video. Less distance means fewer hops, which makes calls look and sound smoother.

To learn more, see [our blog post](https://azure.microsoft.com/updates/windows-virtual-desktop-media-optimization-for-microsoft-teams-is-now-available-in-public-preview/).

## Next steps

Check out these articles to learn about updates for our clients for Windows Virtual Desktop and Remote Desktop Services:

- [Windows](/windows-server/remote/remote-desktop-services/clients/windowsdesktop-whatsnew)
- [macOS](/windows-server/remote/remote-desktop-services/clients/mac-whatsnew)
- [iOS](/windows-server/remote/remote-desktop-services/clients/ios-whatsnew)
- [Android](/windows-server/remote/remote-desktop-services/clients/android-whatsnew)
- [Web](/windows-server/remote/remote-desktop-services/clients/web-client-whatsnew)