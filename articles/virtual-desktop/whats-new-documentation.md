---
title: What's new in documentation - Azure Virtual Desktop
description: Learn about new and updated articles to the Azure Virtual Desktop documentation.
ms.topic: release-notes
author: dknappettmsft
ms.author: daknappe
ms.date: 12/04/2024
---

# What's new in documentation for Azure Virtual Desktop

We update documentation for Azure Virtual Desktop regularly. In this article, we highlight articles for new features and where there are significant updates to existing articles. To learn what's new in the service, see [What's new for Azure Virtual Desktop](whats-new.md).

## November 2024

Here are the highlights of documentation changes in November 2024:

- Updated autoscale content to include the preview of dynamic autoscale:
   - [Autoscale scaling plans and example scenarios](autoscale-scenarios.md)
   - [Create and assign an autoscale scaling plan](autoscale-create-assign-scaling-plan.md?pivots=dynamic)
   - [Autoscale FAQ](autoscale-faq.yml)

- Changed all references of Azure Stack HCI to Azure Local, as part of the product changes. For more information, see [Azure Virtual Desktop on Azure Local](azure-local-overview.md).

- Updated Azure Virtual Desktop on Azure Extended Zones for general availability. For more information, see [Azure Virtual Desktop on Azure Extended Zones](azure-extended-zones.md).

- Updated app attach articles with App-V support. For more information, see [App attach and MSIX app attach in Azure Virtual Desktop](app-attach-overview.md?pivots=app-attach).

- Published a new article to [Deliver applications from partner solutions to Azure Virtual Desktop with app attach](app-attach-partner-solutions.md).

- Added Windows Server 2025 as a supported operating system for session hosts. For more information, see [Operating systems and licenses](prerequisites.md#operating-systems-and-licenses).

## October 2024

Here are the highlights of documentation changes in October 2024:

- Published a new article where you can lean about [Graphics encoding over the Remote Desktop Protocol](graphics-encoding.md).

- Rewrote [Multimedia redirection for video playback and calls](multimedia-redirection-video-playback-calls.md) and added a new article for [Developer integration with multimedia redirection for WebRTC-based calling apps](multimedia-redirection-developer-integration.md).

- Published a set of new articles for host pools using the session host configuration management approach and session host update:

   - [Host pool management approaches](host-pool-management-approaches.md).
   - [Session host update](session-host-update.md).
   - [Update session hosts using session host update](session-host-update-configure.md).
   - [Example diagnostic queries for session host update](session-host-update-diagnostics.md).
   - [Troubleshoot session host update](troubleshoot-session-host-update.md).

- Updated [Deploy Azure Virtual Desktop](deploy-azure-virtual-desktop.md) and [Add session hosts to a host pool](add-session-hosts-host-pool.md) to include the session host configuration management approach.

- Consolidated Remote Desktop client articles per platform into a [single article with a tab per platform](./users/connect-remote-desktop-client.md) and separated [legacy Windows clients to their own article](./users/connect-legacy-windows.md).

- Reorganized the table of contents into a new structure, changing the way articles are grouped and displayed. The new structure is designed to make it easier to find the information you need in the different stages of your journey with Azure Virtual Desktop.

## September 2024

Here are the highlights of documentation changes in September 2024:

- Updated [Enable GPU acceleration for Azure Virtual Desktop](graphics-enable-gpu-acceleration.md) for the support of the High Efficiency Video Coding (HEVC), also known as H.265, which is in preview.

- Updated [Use Microsoft OneDrive with a RemoteApp](onedrive-remoteapp.md), which is generally available.

- Published a new article where you can learn [What's new in the Azure Virtual Desktop SxS Network Stack](whats-new-sxs.md).

## August 2024

Here are the highlights of documentation changes in August 2024:

- Published a new set of documentation to learn about peripheral and resource redirection and how to configure different classes of redirection:
   - [Peripheral and resource redirection over the Remote Desktop Protocol](redirection-remote-desktop-protocol.md)
   - [Configure audio and video redirection over the Remote Desktop Protocol](redirection-configure-audio-video.md).
   - [Configure camera, webcam, and video capture redirection over the Remote Desktop Protocol](redirection-configure-camera-webcam-video-capture.md).
   - [Configure clipboard redirection over the Remote Desktop Protocol](redirection-configure-clipboard.md).
   - [Configure fixed, removable, and network drive redirection over the Remote Desktop Protocol](redirection-configure-drives-storage.md).
   - [Configure location redirection over the Remote Desktop Protocol](redirection-configure-location.md).
   - [Configure Media Transfer Protocol and Picture Transfer Protocol redirection on Windows over the Remote Desktop Protocol](redirection-configure-plug-play-mtp-ptp.md).
   - [Configure printer redirection over the Remote Desktop Protocol](redirection-configure-printers.md).
   - [Configure serial or COM port redirection over the Remote Desktop Protocol](redirection-configure-serial-com-ports.md).
   - [Configure smart card redirection over the Remote Desktop Protocol](redirection-configure-smart-cards.md).
   - [Configure USB redirection on Windows over the Remote Desktop Protocol](redirection-configure-usb.md).
   - [Configure WebAuthn redirection over the Remote Desktop Protocol](redirection-configure-webauthn.md).

- Updated [Set custom Remote Desktop Protocol (RDP) properties on a host pool in Azure Virtual Desktop](customize-rdp-properties.md) to include rewritten steps for Azure PowerShell and added steps for Azure CLI.

- Updated [Use Microsoft Teams on Azure Virtual Desktop](teams-on-avd.md) to include information on how to publish new Teams as a RemoteApp.

- Published a new article for [Azure Virtual Desktop on Azure Extended Zones](azure-extended-zones.md).

- Published a new article to [Configure the session lock behavior for Azure Virtual Desktop](configure-session-lock-behavior.md) and updated [Configure single sign-on for Azure Virtual Desktop using Microsoft Entra ID](configure-single-sign-on.md) to include the relevant information.

- Published a new article to [Onboard Azure Virtual Desktop session hosts to forensic evidence from Microsoft Purview Insider Risk Management](purview-forensic-evidence.md).

- Updated [Configure the clipboard transfer direction and data types that can be copied in Azure Virtual Desktop](clipboard-transfer-direction-data-types.md?tabs=intune) to include the steps for using the Microsoft Intune settings catalog.

## July 2024

In July 2024, there were no significant changes to the documentation.

## June 2024

Here are the highlights of documentation changes in June 2024:

- Published a new article to [Configure the default chroma value](configure-default-chroma-value.md).

- Published two new articles about the [Preferred application group type behavior for pooled host pools](preferred-application-group-type.md) and how to [Set the preferred application group type for a pooled host pool](set-preferred-application-group-type.md).

- Added information about TLS 1.3 support in [Understanding Azure Virtual Desktop network connectivity](network-connectivity.md).

- Updated [Use Microsoft Teams on Azure Virtual Desktop](teams-on-avd.md) to include New Teams SlimCore changes.

- Added a section to [Use cases for Azure Virtual Desktop Insights](insights-use-cases.md) for how you can view [connection reliability](insights-use-cases.md#connection-reliability) information.

- Rewrote [Configure RDP Shortpath](configure-rdp-shortpath.md) to include host pool settings and a better flow.

- Rewrote [Compare Remote Desktop app features across platforms and devices](compare-remote-desktop-clients.md) to include more comprehensive information. This article is shared for Azure Virtual Desktop, Windows 365, Microsoft Dev Box, Remote Desktop Services, and remote PC connections.

- Combined host pool load balancing information to the single article [Configure host pool load balancing](configure-host-pool-load-balancing.md) and added Azure CLI steps.

- Consolidated information on [Azure Virtual Desktop business continuity and disaster recovery concepts](disaster-recovery-concepts.md) in the product documentation, focusing more on the more comprehensive information for Azure Virtual Desktop in the [Cloud Adoption Framework](/azure/cloud-adoption-framework/scenarios/wvd/eslz-business-continuity-and-disaster-recovery) and the [Azure Architecture Center](/azure/architecture/example-scenario/azure-virtual-desktop/azure-virtual-desktop-multi-region-bcdr).

## May 2024

Here are the highlights of documentation changes in May 2024:

- Published a new article to [Configure client device redirection settings for Windows App and the Remote Desktop app using Microsoft Intune](client-device-redirection-intune.md).

- Updated the branding of the Getting started feature to [Quickstart](quickstart.md) to match the Azure portal.

- Added the steps to [Set up Start VM on Connect](start-virtual-machine-connect.md) using Azure CLI.

## April 2024

Here are the highlights of documentation changes in April 2024:

- Published a new article to [Monitor Autoscale operations with Insights in Azure Virtual Desktop](autoscale-monitor-operations-insights.md). Integrated with Insights in Azure Virtual Desktop, Autoscale diagnostic data enables you to monitor scaling operations, identify issues that need to be fixed, and recognize opportunities to optimize your scaling plan configuration to save costs. 

- Updated [Azure Virtual Desktop Insights glossary](insights-glossary.md) to include a list of [gateway region codes](insights-glossary.md#gateway-region-codes) used in Azure Virtual Desktop Insights and the Azure regions they correspond to.

- Updated [Watermarking](watermarking.md) to include the updated policy settings and add steps for configuring watermarking using Microsoft Intune.

## March 2024

Here are the highlights of documentation changes in March 2024:

- Published a new article to [Configure the clipboard transfer direction and types of data that can be copied](clipboard-transfer-direction-data-types.md) between a local device and a remote session.

- Published a new article to [Migrate MSIX packages from MSIX app attach to app attach](msix-app-attach-migration.md).

- Updated [Eligible licenses to use Azure Virtual Desktop](licensing.md#eligible-licenses-to-use-azure-virtual-desktop) to include Windows Server 2022 RDS Subscriber Access License (SAL).

## February 2024

Here are the highlights of documentation changes in February 2024:

- Added guidance for MSIX and Appx package certificates when using MSIX app attach or app attach. For more information, see [MSIX app attach and app attach in Azure Virtual Desktop](app-attach-overview.md#msix-and-appx-package-certificates).

- Consolidated articles for the three Remote Desktop clients available for Windows into a single article, [Connect to Azure Virtual Desktop with the Remote Desktop client for Windows](users/connect-windows.md).

- Added Azure CLI guidance to [Configure personal desktop assignment](configure-host-pool-personal-desktop-assignment-type.md).

- Updated [Drain session hosts for maintenance in Azure Virtual Desktop](drain-mode.md), including prerequisites and separating the Azure portal and Azure PowerShell steps into tabs.

- Updated [Customize the feed for Azure Virtual Desktop users](customize-feed-for-virtual-desktop-users.md), including prerequisite, Azure PowerShell steps, and separating the Azure portal and Azure PowerShell steps into tabs.

## January 2024

Here are the highlights of documentation changes in January 2024:

- Consolidated articles to [Create and assign an autoscale scaling plan for Azure Virtual Desktop](autoscale-scaling-plan.md) into a single article.

- Added PowerShell commands to [Create and assign an autoscale scaling plan for Azure Virtual Desktop](autoscale-scaling-plan.md).

- Removed the separate documentation section for RemoteApp streaming and combined it with the main Azure Virtual Desktop documentation. Some articles that were previously only in the RemoteApp section are now discoverable in the main Azure Virtual Desktop documentation, such as [Understand and estimate costs for Azure Virtual Desktop](understand-estimate-costs.md) and [Licensing Azure Virtual Desktop](licensing.md).

## December 2023

Here are the highlights of documentation changes in December 2023:

- Published new content for the preview of *app attach*, which is now available alongside MSIX app attach. App attach brings many benefits over MSIX app attach, including assigning applications per user, using the same application package across multiple host pools, upgrading applications, and being able to run two versions of the same application concurrently on the same session host. For more information, see [MSIX app attach and app attach in Azure Virtual Desktop](app-attach-overview.md?pivots=app-attach).

- Updated the article [Use Microsoft Teams on Azure Virtual Desktop](teams-on-avd.md) to include support for [new Teams desktop client](/microsoftteams/new-teams-desktop-admin) on your session hosts.

- Updated the article [Configure single sign-on for Azure Virtual Desktop using Microsoft Entra ID authentication](configure-single-sign-on.md) to include example PowerShell commands to help configure single sign-on using Microsoft Entra ID authentication.

## November 2023

Here are the highlights of documentation changes in November 2023:

- Updated articles for the general availability of autoscale for personal host pools. We also added in support for hibernate (preview). For more information, see [Autoscale scaling plans and example scenarios in Azure Virtual Desktop](autoscale-scenarios.md).

- Updated articles for the updated preview of Azure Virtual Desktop on Azure Stack HCI. You can now deploy Azure Virtual Desktop with your session hosts on Azure Stack HCI as an integrated experience with Azure Virtual Desktop in the Azure portal. For more information, see [Azure Virtual Desktop on Azure Stack HCI](azure-stack-hci-overview.md) and [Deploy Azure Virtual Desktop](deploy-azure-virtual-desktop.md).

- Updated articles for the general availability of Single sign-on using Microsoft Entra authentication and In-session passwordless authentication. For more information, see [Configure single sign-on for Azure Virtual Desktop using Microsoft Entra authentication](configure-single-sign-on.md) and [In-session passwordless authentication](authentication.md#in-session-authentication).

- Published a new set of documentation for Windows App (preview). You can use Windows App to connect to Azure Virtual Desktop, Windows 365, Microsoft Dev Box, Remote Desktop Services, and remote PCs, securely connecting you to Windows devices and apps. For more information, see [Windows App](/windows-app/overview).

## October 2023

Here are the highlights of documentation changes in October 2023:

- Published a new article about the service architecture for Azure Virtual Desktop and how it provides a resilient, reliable, and secure service for organizations and users. Most components are Microsoft-managed, but some are customer-managed. You can learn more at [Azure Virtual Desktop service architecture and resilience](service-architecture-resilience.md).

- Updated [Connect to Azure Virtual Desktop with the Remote Desktop Web client](./users/connect-web.md) and [Use features of the Remote Desktop Web client when connecting to Azure Virtual Desktop](./users/client-features-web.md) for the general availability of the updated user interface for the Remote Desktop Web client.

## September 2023

Here are the highlights of documentation changes in September 2023:

- Published a new article to [Use Microsoft OneDrive with a RemoteApp](onedrive-remoteapp.md).

- Published a new article to [Uninstall and reinstall Remote Desktop Connection](/windows-server/remote/remote-desktop-services/clients/uninstall-remote-desktop-connection) (MSTSC) on Windows 11 23H2.

- Published a new article for [Azure Virtual Desktop (classic) retirement](/previous-versions/azure/virtual-desktop-classic/classic-retirement).

- Updated articles for custom images templates general availability:
  - [Custom image templates](custom-image-templates.md).
  - [Use Custom image templates to create custom images](create-custom-image-templates.md).
  - [Troubleshoot Custom image templates](troubleshoot-custom-image-templates.md).

- Updated [Use Azure Virtual Desktop Insights to monitor your deployment](insights.md?tabs=monitor) for the general availability of using the Azure Monitor Agent with Azure Virtual Desktop Insights.

## August 2023

Here are the highlights of documentation changes in August 2023:

- Updated [Administrative template for Azure Virtual Desktop](administrative-template.md) to include being able to configure settings using the settings catalog in Intune.

- Published a new article for [Use cases for Azure Virtual Desktop Insights](insights-use-cases.md) that includes example scenarios for how you can use Azure Virtual Desktop Insights to help understand your Azure Virtual Desktop environment.

## July 2023

Here are the highlights of documentation changes in July 2023:

- Updated autoscale articles for the preview of autoscale for personal host pools. Learn more at [Autoscale scaling plans and example scenarios](autoscale-scenarios.md) and [Create an autoscale scaling plan](autoscale-scaling-plan.md).

- Updated multimedia redirection articles for the preview of call redirection. Learn more at [Multimedia redirection for video playback and calls in a remote session](multimedia-redirection-video-playback-calls.md).

- Updated [Watermarking](watermarking.md) for general availability.

- Updated [Security best practices](security-guide.md#azure-confidential-computing-virtual-machines) to include the general availability of Azure Confidential computing virtual machines with Azure Virtual Desktop.

- Updated [Set up Private Link with Azure Virtual Desktop](private-link-setup.md) for general availability, made the configuration process clearer, and added commands for Azure PowerShell and Azure CLI.

- Improved the search experience of the table of contents, allowing you to search for articles by alternative search terms. For example, searching for *SSO* shows entries for *single sign-on*.

## June 2023

Here are the highlights of documentation changes in June 2023:

- Updated [Use Azure Virtual Desktop Insights](insights.md) to use the Azure Monitor Agent.

- Updated [Supported features for Microsoft Teams on Azure Virtual Desktop](teams-supported-features.md) to include simulcast, mirror my video, manage breakout rooms, call health panel.

- Published a new article to [Assign Azure RBAC roles or Microsoft Entra roles to the Azure Virtual Desktop service principals](service-principal-assign-roles.md).

- Added Intune to [Administrative template for Azure Virtual Desktop](administrative-template.md).

- Updated [Configure single sign-on using Azure AD Authentication](configure-single-sign-on.md) to include how to use an Active Directory domain admin account with single sign-on, and highlight the need to create a Kerberos server object.

## May 2023

Here are the highlights of documentation changes in May 2023:

- New articles for the custom images templates preview:
  - [Custom image templates](custom-image-templates.md).
  - [Use Custom image templates to create custom images](create-custom-image-templates.md).
  - [Troubleshoot Custom image templates](troubleshoot-custom-image-templates.md).

- Added how to steps for the Azure portal to configure automatic or direct assignment type in [Configure personal desktop assignment](configure-host-pool-personal-desktop-assignment-type.md).

- Rewrote the article to [Create an MSIX image](msix-app-attach-create-msix-image.md).

## April 2023

Here are the highlights of documentation changes in April 2023:

- New articles for the Azure Virtual Desktop Store app preview:
  - [Connect to Azure Virtual Desktop with the Azure Virtual Desktop Store app for Windows](users/connect-windows-azure-virtual-desktop-app.md).
  - [Use features of the Azure Virtual Desktop Store app for Windows](users/client-features-windows-azure-virtual-desktop-app.md).
  - [What's new in the Azure Virtual Desktop Store app for Windows](whats-new-client-windows-azure-virtual-desktop-app.md).

- Provided guidance on how to [Install the Remote Desktop client for Windows on a per-user basis](install-client-per-user.md) when using Intune or Configuration Manager.

- Documented [MSIXMGR tool parameters](msixmgr-tool-syntax-description.md).

- Published a new article to learn [What's new in the MSIXMGR tool](whats-new-msixmgr.md).

## March 2023

Here are the highlights of documentation changes in March 2023:

- Published a new article for the preview of [Uniform Resource Identifier (URI) schemes with the Remote Desktop client](uri-scheme.md).

- Updated [Configure personal desktop assignment](configure-host-pool-personal-desktop-assignment-type.md) showing you how to [Give session hosts in a personal host pool a friendly name](configure-host-pool-personal-desktop-assignment-type.md#give-session-hosts-in-a-personal-host-pool-a-friendly-name).

## February 2023

Here are the highlights of documentation changes in February 2023:

- Updated [RDP Shortpath](rdp-shortpath.md?tabs=public-networks) and [Configure RDP Shortpath](configure-rdp-shortpath.md?tabs=public-networks) articles with the preview information for an indirect UDP connection using the Traversal Using Relay NAT (TURN) protocol with a relay between a client and session host.

- Reorganized the table of contents.

- Published the following articles for deploying Azure Virtual Desktop:
  - [Tutorial to create and connect to a Windows 11 desktop with Azure Virtual Desktop](tutorial-create-connect-personal-desktop.md).
  - [Create a host pool](create-host-pool.md).
  - [Create an application group, a workspace, and assign users](create-application-group-workspace.md).
  - [Add session hosts to a host pool](add-session-hosts-host-pool.md).

- Published an article providing guidance to [Apply Zero Trust principles to an Azure Virtual Desktop deployment](/security/zero-trust/azure-infrastructure-avd).

## January 2023

Here are the highlights of documentation changes in January 2023, we made the following change to the documentation:

- Published a new article for the preview of [Watermarking](watermarking.md).

## Next steps

Learn [What's new for Azure Virtual Desktop](whats-new.md).
