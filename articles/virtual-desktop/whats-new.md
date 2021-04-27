---
title: What's new in Windows Virtual Desktop? - Azure
description: New features and product updates for Windows Virtual Desktop.
author: Heidilohr
ms.topic: overview
ms.date: 04/08/2021
ms.author: helohr
ms.reviewer: thhickli; darank
manager: femila
ms.custom: references_regions
---
# What's new in Windows Virtual Desktop?

Windows Virtual Desktop updates regularly. This article is where you'll find out about:

- The latest updates
- New features
- Improvements to existing features
- Bug fixes

This article is updated monthly. Make sure to check back here often to keep up with new updates.

## Client updates

Check out these articles to learn about updates for our clients for Windows Virtual Desktop and Remote Desktop Services:

- [Windows](/windows-server/remote/remote-desktop-services/clients/windowsdesktop-whatsnew)
- [macOS](/windows-server/remote/remote-desktop-services/clients/mac-whatsnew)
- [iOS](/windows-server/remote/remote-desktop-services/clients/ios-whatsnew)
- [Android](/windows-server/remote/remote-desktop-services/clients/android-whatsnew)
- [Web](/windows-server/remote/remote-desktop-services/clients/web-client-whatsnew)

## Windows Virtual Desktop Agent updates

The Windows Virtual Desktop agent updates at least once per month.

Here's what's changed in the Windows Virtual Desktop Agent:

- Version 1.0.2990.800: This update was released April 13 2021, and has the following changes:
    - Updated agent error messages.
    - Adds an exception that prevents you from installing non-Windows 7 agents on Windows 7 VMs.
    - Has updated heartbeat service logic.
- Version 1.0.2944.1400: This update was released April 7, 2021 and has the following changes:
    - Placed links to the Windows Virtual Desktop Agent troubleshooting guide in the event viewer logs for agent errors.
    - Added an additional exception for better error handling.
    - Added the WVDAgentUrlTool.exe that allows customers to check which required URLs they can access.
- Version 1.0.2866.1500: This update was released March 26, 2021 and it fixes an issue with the stack health check.
- Version 1.0.2800.2802: This update was released March 10, 2021 and it has general improvements and bug fixes.
- Version 1.0.2800.2800: This update was released March 2, 2021 and it fixes a reverse connection issue.
- Version 1.0.2800.2700: This update was released February 10, 2021 and it has general improvements and bug fixes.
- Version 1.0.2800.2700: This update was released February 4, 2021 and it fixes an access denied orchestration issue.

## FSLogix updates

Curious about the latest updates for FSLogix? Check out [What's new at FSLogix](/fslogix/whats-new).

## March 2021

Here's what changed in March 2021.

### Updates to the Azure portal UI for Windows Virtual Desktop

We've made the following updates to Windows Virtual Desktop for the Azure portal:

- We've enabled new availability options (availability set and zones) for the workflows to create host pools and add VMs.
- We've fixed an issue where a host with the "Needs assistance" status appeared as unavailable. Now the host will have a warning icon next to it.
- We've enabled sorting for active sessions.
- You can now send messages to or sign out specific users on the host details tab.
- We've changed the maximum session limit field.
- We've added an OU validation path to the workflow to create a host pool.
- You can now use the latest version of the Windows 10 image when you create a personal host pool.

### Generation 2 images and Trusted Launch

The Azure Marketplace now has Generation 2 images for Windows 10 Enterprise and Windows 10 Enterprise multi-session. These images will let you use Trusted Launch VMs. Learn more about Generation 2 VMs at [Should I create a generation 1 or 2 virtual machine](../virtual-machines/generation-2.md). To learn how to provision Windows Virtual Desktop Trusted Launch VMs, see [our TechCommunity post](https://techcommunity.microsoft.com/t5/windows-virtual-desktop/windows-virtual-desktop-support-for-trusted-launch/m-p/2206170).

### FSLogix is now preinstalled on Windows 10 Enterprise multi-session images

Based on customer feedback, we've set up a new version of the Windows 10 Enterprise multi-session image that has an unconfigured version of FSLogix already installed. We hope this makes your Windows Virtual Desktop deployment easier.

### Azure Monitor for Windows Virtual Desktop is now in General Availability

Azure Monitor for Windows Virtual Desktop is now generally available to the public. This feature is an automated service that monitors your deployments and lets you view events, health, and troubleshooting suggestions in a single place. For more information, see [our documentation](azure-monitor.md) or check out [our TechCommunity post](https://techcommunity.microsoft.com/t5/windows-virtual-desktop/azure-monitor-for-windows-virtual-desktop-is-generally-available/m-p/2242861).

### March 2021 updates for Teams on Windows Virtual Desktop

We've made the following updates for Teams on Windows Virtual Desktop:

- We've improved video quality performance on calls and 2x2 mode.
- We've reduced CPU utilization by 5-10% (depending on CPU generation) by using hardware offload of video processing (XVP).
- Older machines can now use XVP and hardware decoding to display more incoming video streams smoothly in 2x2 mode.
- We've updated the WebRTC stack from M74 to M88 for better AV sync performance and fewer transient issues.
- We've replaced our software H264 encoder with OpenH264 (OSS used in Teams on the web), which increased the video quality of the outgoing camera.
- We enabled 2x2 mode for Teams Server for the general public on March 30. 2x2 mode shows up to four incoming video streams at the same time.

### Start VM on Connect public preview

The new host pool setting, Start VM on Connect, is now available in public preview. This setting lets you turn on your VMs whenever you need them. If you want to save costs, you'll need to deallocate your VMs by configuring your Azure Compute settings. For more information, check out [our blog post](https://aka.ms/wvdstartvmonconnect) and [our documentation](start-virtual-machine-connect.md).

### Windows Virtual Desktop Specialty certification

We've released a beta version of the AZ-140 exam that will let you prove your expertise in Windows Virtual Desktop in Azure. To learn more, check out [our TechCommunity post](https://techcommunity.microsoft.com/t5/microsoft-learn-blog/beta-exam-prove-your-expertise-in-windows-virtual-desktop-on/ba-p/2147107).

## February 2021

Here's what changed in February 2021.

### Portal experience

We've improved the Azure portal experience in the following ways:

- Bulk drain mode on hosts in the session host grid tab. 
- MSIX app attach is now available for public preview.
- Fixed host pool overview info for dark mode.

### EU metadata storage now in public preview

We're now hosting a public preview of the Europe (EU) geography as a storage option for service metadata in Windows Virtual Desktop. Customers can choose between West or North Europe when they create their service objects. The service objects and metadata for the host pools will be stored in the Azure geography associated with each region. To learn more, read [our blog post announcing the public preview](https://techcommunity.microsoft.com/t5/windows-virtual-desktop/announcing-public-preview-of-windows-virtual-desktop-service/m-p/2143939).

### Teams on Windows Virtual Desktop plugin updates

We've improved video call quality on the Windows Virtual Desktop plugin by addressing the most commonly reported issues, such as when the screen would suddenly go dark or the video and sound desynchronized. These improvements should increase the performance of single-video view with active speaker switching. We also fixed an issue where hardware devices with special characters weren't available in Teams.

## January 2021

Here's what changed in January 2021:

### New Windows Virtual Desktop offer

New customers save 30 percent on Windows Virtual Desktop computing costs for D-series and Bs-series virtual machines for up to 90 days when using the native Microsoft solution. You can redeem this offer in the Azure portal before March 31, 2021. Learn more at our [Windows Virtual Desktop offer page](https://azure.microsoft.com/services/virtual-desktop/offer/).

### networkSecurityGroupRules value change 

In the Azure Resource Manager nested template, we changed the default value for networkSecurityGroupRules from an object to an array. This will prevent any errors if you use managedDisks-customimagevm.json without specifying a value for networkSecurityGroupRules. This wasn't a breaking change and is backward compatible.

### FSLogix hotfix update

We’ve released FSLogix, version 2009 HF_01 (2.9.7654.46150) to solve issues in the previous release (2.9.7621.30127). We recommend you stop using the previous version and update FSLogix as soon as possible.

For more information, see the release notes in [What's new in FSLogix](/fslogix/whats-new#fslogix-apps-2009-hf_01-29765446150).

### Azure portal experience improvements

We've made the following improvements to the Azure portal experience:

- You can now add local VM admin credentials directly instead of having to add a local account created with the Active Directory domain join account credentials.
- Users can now list both individual and group assignments in separate tabs for individual users and groups.
- The version number of the Windows Virtual Desktop Agent is now visible in the Virtual Machine overview for host pools.
- Added bulk delete for host pools and application groups.
- You can now enable or disable drain mode for multiple session hosts in a host pool.
- Removed the public IP field from the VM details page.

### Windows Virtual Desktop Agent troubleshooting

We recently set up the [Windows Virtual Desktop Agent troubleshooting guide](troubleshoot-agent.md) to help customers who have encountered common issues.

### Microsoft Defender for Endpoint integration

Microsoft Defender for Endpoint integration is now generally available. This feature gives your Windows Virtual Desktop VMs the same investigation experience as a local Windows 10 machine. If you're using Windows 10 Enterprise multi-session, Microsoft Defender for Endpoint will support up to 50 concurrent user connections, giving you the cost savings of Windows 10 Enterprise multi-session and the confidence of Microsoft Defender for Endpoint. For more information, check out our [blog post](https://techcommunity.microsoft.com/t5/microsoft-defender-for-endpoint/windows-virtual-desktop-support-is-now-generally-available/ba-p/2103712).

### Azure Security baseline for Windows Virtual Desktop

We've recently published [an article about the Azure security baseline](security-baseline.md) for Windows Virtual Desktop that we'd like to call your attention to. These guidelines include information about how to apply the Azure Security Benchmark, version 2.0 to Windows Virtual Desktop. The Azure Security Benchmark describes the settings and practices we recommend you use to secure your cloud solutions on Azure.

## December 2020

Here's what changed in December 2020: 

### Azure Monitor for Windows Virtual Desktop

The public preview for Azure Monitor for Windows Virtual Desktop is now available. This new feature includes a robust dashboard built on top of Azure Monitor Workbooks to help IT professionals understand their Windows Virtual Desktop environments. Check out [the announcement on our blog](https://techcommunity.microsoft.com/t5/windows-virtual-desktop/azure-monitor-for-windows-virtual-desktop-public-preview/m-p/1946587) for more details. 

### Azure Resource Manager template change 

In the latest update, we've removed all public IP address parameter from the Azure Resource Manager template for creating and provisioning host pools. We highly recommend you avoid using public IPs for Windows Virtual Desktop to keep your deployment secure. If your deployment relied on public IPs, you'll need to reconfigure it to use private IPs instead, otherwise your deployment won't work properly.

### MSIX app attach public preview 

MSIX app attach is another service that began its public preview this month. MSIX app attach is a service that dynamically presents MSIX applications to your Windows Virtual Desktop Session host VMs. Check out [the announcement on our blog](https://techcommunity.microsoft.com/t5/windows-virtual-desktop/msix-app-attach-azure-portal-integration-public-preview/m-p/1986231) for more details. 

### Screen capture protection 

This month also marked the beginning of the public preview for screen capture protection. You can use this feature to prevent sensitive information from being captured on the client endpoints. Give screen capture protection a try by going to [this page](https://aka.ms/WVDScreenCaptureProtection).  

### Built-in roles

We've added new built-in roles for Windows Virtual Desktop for admin permissions. For more information, see [Built-in roles for Windows Virtual Desktop](rbac.md). 

### Application group limit increase

We've increased the default application group limit per Azure Active Directory tenant to 200 groups.

### Client updates for December 2020

We've released new versions of the following clients: 

- Android
- macOS
- Windows

For more information about client updates, see [Client updates](whats-new.md#client-updates).

## November 2020

### Azure portal experience

We've fixed two bugs in the Azure portal user experience:

- The Desktop application friendly name is no longer overwritten on the "Add VM" workflow.
- The session host tab will now load if session hosts are part of scale sets.

### FSLogix client, version 2009 

We've released a new version of the FSLogix client with many fixes and improvements. Learn more at [our blog post](https://social.msdn.microsoft.com/Forums/en-US/defe5828-fba4-4715-a68c-0e4d83eefa6b/release-notes-for-fslogix-apps-release-2009-29762130127?forum=FSLogix).

### RDP Shortpath public preview

RDP Shortpath introduces direct connectivity to your Windows Virtual Desktop session host using point-to-site and site-to-site VPNs and ExpressRoute. It also introduces the URCP transport protocol. RDP Shortpath is designed to reduce latency and network hops in order to improve user experience. Learn more at [Windows Virtual Desktop RDP Shortpath](shortpath.md).

### Az.DesktopVirtualization, version 2.0.1

We've released version 2.0.1 of the Windows Virtual Desktop cmdlets. This update includes cmdlets that will let you manage MSIX App Attach. You can download the new version at [the PowerShell gallery](https://www.powershellgallery.com/packages/Az.DesktopVirtualization/2.0.1).

### Azure Advisor updates

Azure Advisor now has a new recommendation for proximity guidance in Windows Virtual Desktop, and a new recommendation for optimizing performance in depth-first load balanced host pools. Learn more at [the Azure website](https://azure.microsoft.com/updates/new-recommendations-from-azure-advisor/).

## October 2020

Here's what changed in October 2020:

### Improved performance

- We've optimized performance by reducing connection latency in the following Azure geographies:
    - Switzerland
    - Canada

You can now use the [Experience Estimator](https://azure.microsoft.com/services/virtual-desktop/assessment/) to estimate the user experience quality in these areas.

### Azure Government Cloud availability

The Azure Government Cloud is now generally available. Learn more at [our blog post](https://azure.microsoft.com/updates/windows-virtual-desktop-is-now-generally-available-in-the-azure-government-cloud/).

### Windows Virtual Desktop Azure portal updates

We've made some updates to the Windows Virtual Desktop Azure portal:

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

### Client updates for October 2020

We've released new versions of the clients. See these articles to learn more:

- [Windows](/windows-server/remote/remote-desktop-services/clients/windowsdesktop-whatsnew)
- [iOS](/windows-server/remote/remote-desktop-services/clients/ios-whatsnew)

For more information about the other clients, see [Client updates](#client-updates).

## September 2020

Here's what changed in September 2020:

- We've optimized performance by reducing connection latency in the following Azure geographies:
    - Germany
    - South Africa (for validation environments only)

You can now use the [Experience Estimator](https://azure.microsoft.com/services/virtual-desktop/assessment/) to estimate the user experience quality in these areas.

- We released version 1.2.1364 of the Windows Desktop client for Windows Virtual Desktop. In this update, we made the following changes:
    - Fixed an issue where single sign-on (SSO) didn't work on Windows 7.
    - Fixed an issue that caused the client to disconnect when a user who enabled media optimization for Teams tried to call or join a Teams meeting while another app had an audio stream open in exclusive mode.
    - Fixed an issue where Teams didn't enumerate audio or video devices when media optimization for Teams was enabled.
    - Added a "Need help with settings?" link to the desktop settings page.
    - Fixed an issue with the "Subscribe" button that happened when using high-contrast dark themes.
    
- Thanks to the tremendous help from our users, we've fixed two critical issues for the Microsoft Store Remote Desktop client. We'll continue to review feedback and fix issues as we broaden our phased release of the client to more users worldwide.
    
- We've added a new feature that lets you change VM location, image, resource group, prefix name, network config as part of the workflow for adding a VM to your deployment in the Azure portal.

- IT Pros can now manage hybrid Azure Active Directory-joined Windows 10 Enterprise VMs using Microsoft Endpoint Manager. To learn more, see [our blog post](https://techcommunity.microsoft.com/t5/microsoft-endpoint-manager-blog/microsoft-endpoint-manager-announces-support-for-windows-virtual/ba-p/1681048).

## August 2020

Here's what changed in August 2020:

- We've improved performance to reduce connection latency in the following Azure regions: 

    - United Kingdom
    - France
    - Norway
    - South Korea

   You can use the [Experience Estimator](https://azure.microsoft.com/services/virtual-desktop/assessment/) to get a general idea of how these changes will affect your users.

- The Microsoft Store Remote Desktop Client (v10.2.1522+) is now generally available! This version of the Microsoft Store Remote Desktop Client is compatible with Windows Virtual Desktop. We've also introduced refreshed UI flows for improved user experiences. This update includes fluent design, light and dark modes, and many other exciting changes. We've also rewritten the client to use the same underlying remote desktop protocol (RDP) engine as the iOS, macOS, and Android clients. This lets us deliver new features at a faster rate across all platforms. [Download the client](https://www.microsoft.com/p/microsoft-remote-desktop/9wzdncrfj3ps?rtc=1&activetab=pivot:overviewtab) and give it a try!

- We fixed an issue in the Teams Desktop client (version 1.3.00.21759) where the client only showed the UTC time zone in the chat, channels, and calendar. The updated client now shows the remote session's time zone instead.

- Azure Advisor is now a part of Windows Virtual Desktop. When you access Windows Virtual Desktop through the Azure portal, you can see recommendations for optimizing your Windows Virtual Desktop environment. Learn more at [Azure Advisor](azure-advisor.md).

- Azure CLI now supports Windows Virtual Desktop (`az desktopvirtualization`) to help you automate your Windows Virtual Desktop deployments. Check out [desktopvirtualization](/cli/azure/) for a list of extension commands.

- We've updated our deployment templates to make them fully compatible with the Windows Virtual Desktop Azure Resource Manager interfaces. You can find the templates on [GitHub](https://github.com/Azure/RDS-Templates/tree/master/ARM-wvd-templates).

- The Windows Virtual Desktop US Gov portal is now in public preview. To learn more, see [our announcement](https://azure.microsoft.com/updates/windows-virtual-desktop-is-now-available-in-the-azure-government-cloud-in-preview/).

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

- Host pool deployment is now fully integrated with the [Azure Shared Image Gallery](../virtual-machines/shared-image-galleries.md). Shared Image Gallery is a separate Azure service that stores virtual machine (VM) image definitions, including image versioning. You can also use global replication to copy and send your images to other Azure regions for local deployment.

- Monitoring functions that used to be done through PowerShell or the Diagnostics Service web app have now moved to Log Analytics in the Azure portal. You also now have two options to visualize your reports. You can run Kusto queries and use Workbooks to create visual reports.

- You're no longer required to complete Azure Active Directory (Azure AD) consent to use Windows Virtual Desktop. In this update, the Azure AD tenant on your Azure subscription authenticates your users and provides Azure RBAC controls for your admins.

### PowerShell support

We've added new AzWvd cmdlets to the Azure PowerShell Az Module with this update. This new module is supported in PowerShell Core, which runs on .NET Core.

To install the module, follow the instructions in [Set up the PowerShell module for Windows Virtual Desktop](powershell-module.md).

You can also see a list of available commands at the [AzWvd PowerShell reference](/powershell/module/az.desktopvirtualization/#desktopvirtualization).

For more information about the new features, check out [our blog post](https://techcommunity.microsoft.com/t5/itops-talk-blog/windows-virtual-desktop-spring-update-enters-public-preview/ba-p/1340245).

### Additional gateways

We've added a new gateway cluster in South Africa to reduce connection latency.

### Microsoft Teams on Windows Virtual Desktop (Preview)

We've made some improvements to Microsoft Teams for Windows Virtual Desktop. Most importantly, Windows Virtual Desktop now supports audio and visual redirection for calls. Redirection improves latency by creating direct paths between users when they call using audio or video. Less distance means fewer hops, which makes calls look and sound smoother.

To learn more, see [our blog post](https://azure.microsoft.com/updates/windows-virtual-desktop-media-optimization-for-microsoft-teams-is-now-available-in-public-preview/).

## Next steps

Learn about future plans at the [Microsoft 365 Windows Virtual Desktop roadmap](https://www.microsoft.com/microsoft-365/roadmap?filters=Windows%20Virtual%20Desktop).
