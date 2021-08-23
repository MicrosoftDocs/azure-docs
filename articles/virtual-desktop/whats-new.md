---
title: What's new in Azure Virtual Desktop? - Azure
description: New features and product updates for Azure Virtual Desktop.
author: Heidilohr
ms.topic: overview
ms.date: 07/30/2021
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

This article is updated monthly. Make sure to check back here often to keep up with new updates.

## Client updates

Check out these articles to learn about updates for our clients for Azure Virtual Desktop and Remote Desktop Services:

- [Windows](/windows-server/remote/remote-desktop-services/clients/windowsdesktop-whatsnew)
- [macOS](/windows-server/remote/remote-desktop-services/clients/mac-whatsnew)
- [iOS](/windows-server/remote/remote-desktop-services/clients/ios-whatsnew)
- [Android](/windows-server/remote/remote-desktop-services/clients/android-whatsnew)
- [Web](/windows-server/remote/remote-desktop-services/clients/web-client-whatsnew)

## Azure Virtual Desktop Agent updates

The Azure Virtual Desktop agent updates at least once per month.

Here's what's changed in the Azure Virtual Desktop Agent:

- Version 1.0.3130.2900: This update was released July 2021 and has the following changes:
    - General improvements and bug fixes.
    - Fixes an issue with getting the host pool path for Intune registration.
    - Added logging to better diagnose agent issues.
    - Fixes an issue with orchestration timeouts.
- Version 1.0.3050.2500: This update was released July 2021 and has the following changes:
    - Updated internal monitors for agent health.
    - Updated retry logic for stack health.
- Version 1.0.2990.1500: This update was released April 2021 and has the following changes:
    - Updated agent error messages.
    - Added an exception that prevents you from installing non-Windows 7 agents on Windows 7 VMs.
    - Has updated heartbeat service logic.
- Version 1.0.2944.1400: This update was released April 2021 and has the following changes:
    - Placed links to the Azure Virtual Desktop Agent troubleshooting guide in the event viewer logs for agent errors.
    - Added an additional exception for better error handling.
    - Added the WVDAgentUrlTool.exe that allows customers to check which required URLs they can access.
-	Version 1.0.2866.1500: This update was released March 2021 and it fixes an issue with the stack health check.
-	Version 1.0.2800.2802: This update was released March 2021 and it has general improvements and bug fixes.
-	Version 1.0.2800.2800: This update was released March 2021 and it fixes a reverse connection issue.
-	Version 1.0.2800.2700: This update was released February 2021 and it fixes an access denied orchestration issue.

## FSLogix updates

Curious about the latest updates for FSLogix? Check out [What's new at FSLogix](/fslogix/whats-new).

## July 2021

Here's what changed in July 2021:

### Azure Virtual Desktop images now include optimized Teams

All available images in the Azure Virtual Desktop image gallery that include Microsoft 365 Apps for Enterprise now have the media-optimized version of Teams for Azure Virtual Desktop pre-installed. For more information, see [our announcement](https://techcommunity.microsoft.com/t5/azure-virtual-desktop/media-optimization-for-microsoft-teams-now-part-of-win10/m-p/2550054#M7442).

### Azure Active Directory Domain Join for Session hosts is in public preview

You can now join your Azure Virtual Desktop virtual machines (VMs) directly to Azure Active Directory (Azure AD). This feature lets you connect to your VMs from any device with basic credentials. You can also automatically enroll your VMs with Microsoft Endpoint Manager. For certain scenarios, this will help eliminate the need for a domain controller, reduce costs, and streamline your deployment. Learn more at [Deploy Azure AD joined virtual machines in Azure Virtual Desktop](deploy-azure-ad-joined-vm.md).

### FSLogix version 2105 is now available

FSLogix version 2105 is now generally available. This version includes improved sign-in times and bug fixes that weren't available in the public preview version (version 2105). For more detailed information, you can see [the FSLogix release notes](/fslogix/whats-new) and [our blog post](https://techcommunity.microsoft.com/t5/azure-virtual-desktop/announcing-general-availability-of-fslogix-2105-2-9-7838-44263/m-p/2539491#M7412).

### Azure Virtual Desktop in China has entered public preview

With Azure Virtual Desktop available in China, we now have more rounded global coverage that helps organizations support customers in this region with improved performance and latency. Learn more at [our announcement page](https://azure.microsoft.com/updates/azure-virtual-desktop-is-now-available-in-the-azure-china-cloud-in-preview/).
 
### The getting started feature for Azure Virtual Desktop

This feature offers a streamlined onboarding experience in the Azure portal to set up your Azure Virtual Desktop environment. You can use this feature to create deployments that meet system requirements for automated Azure Active Directory Domain Services the simple and easy way. For more information, check out our [blog post](https://techcommunity.microsoft.com/t5/azure-virtual-desktop/getting-started-wizard-in-azure-virtual-desktop/m-p/2451385).

### Start VM on connect is now generally available

The start VM on connect feature is now generally available. This feature helps you optimize costs by letting you turn off deallocated or stopped VMs, letting your deployment be flexible with user demands. For more information, see [Start Virtual Machine on Connect](start-virtual-machine-connect.md).

### Remote app streaming documentation

We recently announced a new pricing option for remote app streaming for using Azure Virtual Desktop to deliver apps as a service to your customers and business partners. For example, software vendors can use remote app streaming to deliver apps as a software as a service (SaaS) solution that's accessible to their customers. To learn more about remote app streaming, check out [our documentation](./remote-app-streaming/overview.md).

From July 14th, 2021 to December 31st, 2021, we're giving customers who use remote app streaming a promotional offer that lets their business partners and customers access Azure Virtual Desktop for no charge. This offer only applies to external user access rights. Regular billing will resume on January 1st, 2022. In the meantime, you can continue to use your existing Windows license entitlements found in licenses like Microsoft 365 E3 or Windows E3. To learn more about this offer, see the [Azure Virtual Desktop pricing page](https://azure.microsoft.com/pricing/details/virtual-desktop/).

### New Azure Virtual Desktop handbooks

We recently released four new handbooks to help you design and deploy Azure Virtual Desktop in different scenarios: 

- [Application Management](https://azure.microsoft.com/resources/azure-virtual-desktop-handbook-application-management/) will show you how to modernize application delivery and simplify IT management.  
- In [Disaster Recovery](https://azure.microsoft.com/resources/azure-virtual-desktop-handbook-disaster-recovery/), learn how to strengthen business resilience by developing a disaster recovery strategy.  
- Get more value from Citrix investments with the [Citrix Cloud with Azure Virtual Desktop](https://azure.microsoft.com/resources/migration-guide-citrix-cloud-with-azure-virtual-desktop/) migration guide.
- Get more value from existing VMware investments with the [VMware Horizon with Azure Virtual Desktop](https://azure.microsoft.com/resources/migration-guide-vmware-horizon-cloud-and-azure-virtual-desktop/) migration guide.

## June 2021

Here's what changed in June 2021:

### Windows Virtual Desktop is now Azure Virtual Desktop

To better align with our vision of a flexible cloud desktop and remote application platform, we've renamed Windows Virtual Desktop to Azure Virtual Desktop. Learn more at [the announcement post in our blog](https://azure.microsoft.com/blog/azure-virtual-desktop-the-desktop-and-app-virtualization-platform-for-the-hybrid-workplace/).

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

On September 30th, 2021, the Azure Virtual Desktop web client will no longer support Internet Explorer 11. We recommend you start using the [Microsoft Edge](https://www.microsoft.com/edge?form=MY01R2&OCID=MY01R2&r=1) browser for your web client and remote sessions instead. For more information, see the announcement in [this blog post](https://techcommunity.microsoft.com/t5/windows-virtual-desktop/windows-virtual-desktop-web-client-to-end-support-for-internet/m-p/2369007).

### Microsoft Endpoint Manager public preview

We've started the public preview for Microsoft Endpoint Manager support in Windows 10 Enterprise multi-session. This new feature will let you manage your Windows 10 VMs with the same tools as your local devices. Learn more at our [Microsoft Endpoint Manger documentation](/mem/intune/fundamentals/windows-virtual-desktop-multi-session).

### FSLogix agent public preview

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

You can now configure Start VM on Connect (preview) in the Azure portal. With this update, users can access their VMs from the Android and macOS clients. To learn more, see [Start VM on Connect](start-virtual-machine-connect.md#use-the-azure-portal).

### Required URL Check tool 

The Azure Virtual Desktop agent, version 1.0.2944.400 includes a tool that validates URLs and displays whether the virtual machine can access the URLs it needs to function. If any required URLs are accessible, the tool will list them so you can unblock them, if needed. Learn more at our [Safe URL list](safe-url-list.md#required-url-check-tool).

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

Based on customer feedback, we've set up a new version of the Windows 10 Enterprise multi-session image that has an unconfigured version of FSLogix already installed. We hope this makes your Azure Virtual Desktop deployment easier.

### Azure Monitor for Azure Virtual Desktop is now in General Availability

Azure Monitor for Azure Virtual Desktop is now generally available to the public. This feature is an automated service that monitors your deployments and lets you view events, health, and troubleshooting suggestions in a single place. For more information, see [our documentation](azure-monitor.md) or check out [our TechCommunity post](https://techcommunity.microsoft.com/t5/windows-virtual-desktop/azure-monitor-for-windows-virtual-desktop-is-generally-available/m-p/2242861).

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

We've recently published [an article about the Azure security baseline](security-baseline.md) for Azure Virtual Desktop that we'd like to call your attention to. These guidelines include information about how to apply the Azure Security Benchmark, version 2.0 to Azure Virtual Desktop. The Azure Security Benchmark describes the settings and practices we recommend you use to secure your cloud solutions on Azure.

## December 2020

Here's what changed in December 2020: 

### Azure Monitor for Azure Virtual Desktop

The public preview for Azure Monitor for Azure Virtual Desktop is now available. This new feature includes a robust dashboard built on top of Azure Monitor Workbooks to help IT professionals understand their Azure Virtual Desktop environments. Check out [the announcement on our blog](https://techcommunity.microsoft.com/t5/windows-virtual-desktop/azure-monitor-for-windows-virtual-desktop-public-preview/m-p/1946587) for more details. 

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

RDP Shortpath introduces direct connectivity to your Azure Virtual Desktop session host using point-to-site and site-to-site VPNs and ExpressRoute. It also introduces the URCP transport protocol. RDP Shortpath is designed to reduce latency and network hops in order to improve user experience. Learn more at [Azure Virtual Desktop RDP Shortpath](shortpath.md).

### Az.DesktopVirtualization, version 2.0.1

We've released version 2.0.1 of the Azure Virtual Desktop cmdlets. This update includes cmdlets that will let you manage MSIX App Attach. You can download the new version at [the PowerShell gallery](https://www.powershellgallery.com/packages/Az.DesktopVirtualization/2.0.1).

### Azure Advisor updates

Azure Advisor now has a new recommendation for proximity guidance in Azure Virtual Desktop, and a new recommendation for optimizing performance in depth-first load balanced host pools. Learn more at [the Azure website](https://azure.microsoft.com/updates/new-recommendations-from-azure-advisor/).

## October 2020

Here's what changed in October 2020:

### Improved performance

- We've optimized performance by reducing connection latency in the following Azure geographies:
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

- We released version 1.2.1364 of the Windows Desktop client for Azure Virtual Desktop. In this update, we made the following changes:
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

- The Microsoft Store Remote Desktop Client (v10.2.1522+) is now generally available! This version of the Microsoft Store Remote Desktop Client is compatible with Azure Virtual Desktop. We've also introduced refreshed UI flows for improved user experiences. This update includes fluent design, light and dark modes, and many other exciting changes. We've also rewritten the client to use the same underlying remote desktop protocol (RDP) engine as the iOS, macOS, and Android clients. This lets us deliver new features at a faster rate across all platforms. [Download the client](https://www.microsoft.com/p/microsoft-remote-desktop/9wzdncrfj3ps?rtc=1&activetab=pivot:overviewtab) and give it a try!

- We fixed an issue in the Teams Desktop client (version 1.3.00.21759) where the client only showed the UTC time zone in the chat, channels, and calendar. The updated client now shows the remote session's time zone instead.

- Azure Advisor is now a part of Azure Virtual Desktop. When you access Azure Virtual Desktop through the Azure portal, you can see recommendations for optimizing your Azure Virtual Desktop environment. Learn more at [Azure Advisor](azure-advisor.md).

- Azure CLI now supports Azure Virtual Desktop (`az desktopvirtualization`) to help you automate your Azure Virtual Desktop deployments. Check out [desktopvirtualization](/cli/azure/desktopvirtualization) for a list of extension commands.

- We've updated our deployment templates to make them fully compatible with the Azure Virtual Desktop Azure Resource Manager interfaces. You can find the templates on [GitHub](https://github.com/Azure/RDS-Templates/tree/master/ARM-wvd-templates).

- The Azure Virtual Desktop US Gov portal is now in public preview. To learn more, see [our announcement](https://azure.microsoft.com/updates/windows-virtual-desktop-is-now-available-in-the-azure-government-cloud-in-preview/).

## July 2020  

July was when Azure Virtual Desktop with Azure Resource Management integration became generally available.

Here's what changed with this new release: 

- The "Fall 2019 release" is now known as "Azure Virtual Desktop (Classic)," while the "Spring 2020 release" is now just "Azure Virtual Desktop." For more information, check out [this blog post](https://azure.microsoft.com/blog/new-windows-virtual-desktop-capabilities-now-generally-available/). 

To learn more about new features, check out [this blog post](https://techcommunity.microsoft.com/t5/itops-talk-blog/windows-virtual-desktop-spring-update-enters-public-preview/ba-p/1340245). 

### Autoscaling tool update

The latest version of the autoscaling tool that was in preview is now generally available. This tool uses an Azure automation account and the Azure Logic App to automatically shut down and restart session host virtual machines (VMs) within a host pool, reducing infrastructure costs. Learn more at [Scale session hosts using Azure Automation](set-up-scaling-script.md).

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

- Before this update, you could only publish RemoteApps and Desktops to individual users. With Azure Resource Manager, you can now publish resources to Azure Active Directory groups.

- The earlier version of Azure Virtual Desktop had four built-in admin roles that you could assign to a tenant or host pool. These roles are now in [Azure role-based access control (Azure RBAC)](../role-based-access-control/overview.md). You can apply these roles to every Azure Virtual Desktop Azure Resource Manager object, which lets you have a full, rich delegation model.

- In this update, you no longer need to run Azure Marketplace or the GitHub template repeatedly to expand a host pool. All you need to expand a host pool is to go to your host pool in the Azure portal and select **+ Add** to deploy additional session hosts.

- Host pool deployment is now fully integrated with the [Azure Shared Image Gallery](../virtual-machines/shared-image-galleries.md). Shared Image Gallery is a separate Azure service that stores virtual machine (VM) image definitions, including image versioning. You can also use global replication to copy and send your images to other Azure regions for local deployment.

- Monitoring functions that used to be done through PowerShell or the Diagnostics Service web app have now moved to Log Analytics in the Azure portal. You also now have two options to visualize your reports. You can run Kusto queries and use Workbooks to create visual reports.

- You're no longer required to complete Azure Active Directory (Azure AD) consent to use Azure Virtual Desktop. In this update, the Azure AD tenant on your Azure subscription authenticates your users and provides Azure RBAC controls for your admins.

### PowerShell support

We've added new AzWvd cmdlets to the Azure PowerShell Az Module with this update. This new module is supported in PowerShell Core, which runs on .NET Core.

To install the module, follow the instructions in [Set up the PowerShell module for Azure Virtual Desktop](powershell-module.md).

You can also see a list of available commands at the [AzWvd PowerShell reference](/powershell/module/az.desktopvirtualization/#desktopvirtualization).

For more information about the new features, check out [our blog post](https://techcommunity.microsoft.com/t5/itops-talk-blog/windows-virtual-desktop-spring-update-enters-public-preview/ba-p/1340245).

### Additional gateways

We've added a new gateway cluster in South Africa to reduce connection latency.

### Microsoft Teams on Azure Virtual Desktop (Preview)

We've made some improvements to Microsoft Teams for Azure Virtual Desktop. Most importantly, Azure Virtual Desktop now supports audio and visual redirection for calls. Redirection improves latency by creating direct paths between users when they call using audio or video. Less distance means fewer hops, which makes calls look and sound smoother.

To learn more, see [our blog post](https://azure.microsoft.com/updates/windows-virtual-desktop-media-optimization-for-microsoft-teams-is-now-available-in-public-preview/).

## Next steps

Learn about future plans at the [Microsoft 365 Azure Virtual Desktop roadmap](https://www.microsoft.com/microsoft-365/roadmap?filters=Windows%20Virtual%20Desktop).
