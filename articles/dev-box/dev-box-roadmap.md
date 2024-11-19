---
title: Roadmap for Microsoft Dev Box
description: Learn about features coming soon and in development for Microsoft Dev Box.
ms.service: dev-box
ms.topic: concept-article
author: Taysser-Gherfal
ms.author: tagherfa
ms.date: 11/06/2024

#customer intent: As a customer, I want to understand upcoming features and enhancements in Microsoft Dev Box so that I can plan and optimize development and deployment strategies.

---
# Microsoft Dev Box roadmap

This roadmap presents a set of planned feature releases that underscores Microsoft's commitment to deliver the most secure and productive developer experience from the cloud. This feature list offers a glimpse into our plans for the next six months, highlighting key features we're developing. It's not exhaustive but shows major investments. Some features might release as previews and evolve based on your feedback before becoming generally available. We always listen to your input, so the timing, design, and delivery of some features might change.

Key Dev Box deliverables can be grouped under the following themes:

- Ready-to-code development environment
- Enterprise management
- Fundamental performance & reliability  

## Ready-to-code development environment

Microsoft Dev Box can significantly enhance developer productivity by minimizing configuration time and IT overhead compared to traditional virtual desktop infrastructure (VDI) solutions. We're making it incredibly easy and quick for developers to create ready-to-code environments tailored to their specific projects. Not only are we reducing the time required to set up Dev Boxes, but we're also introducing innovative new customization options for both teams and individuals.

**Config-as-code workflow improvements**

- [Team customizations](https://developercommunity.visualstudio.com/t/Share-customization-files-across-my-team/10729596?sort=newest): as a project lead or a dev center admin, set up a config-as-code Dev Box configuration for an entire team, allowing quicker onboarding of developers without having them deal with onboarding complexity.
- [Dev Center Imaging](https://developercommunity.visualstudio.com/t/Speed-up-Dev-Box-customization-using-a-c/10729598): as a project lead or a dev center admin, tailor customizations to each team without losing out Dev Box creation performance. Optimize these team customizations into an image without investing in and maintaining your own custom image generation capabilities. 
- [Secrets & variables](https://developercommunity.visualstudio.com/t/Customization-YAMLs:-Use-secrets-from-a/10729608?sort=newest): as a project lead or a dev center admin, you can now source secrets from subscriptions that are different from the one your DevCenter is in, allowing you to reuse centralized secret stores with Dev Box
- [Native Run as user support](https://developercommunity.visualstudio.com/t/Improve-run-as-user-support-for-Dev-Box/10719951): some of your Dev Box customization tasks require to be run as the signed in user. Native run as user support provides capability of executing customization under the user context with improved reliability, status tracking, and error reporting. 

**Enhanced user provided customizations**

- [Native support for WinGet & DSC](https://developercommunity.visualstudio.com/t/I-would-like-my-Dev-Box-to-run-Winget-an/10719983): all Dev Boxes will be able to use WinGet and DSC to install packages and apply configurations, without requiring a catalog to be attached.

**Developer onboarding & experience**

- [Developer Portal landing page and welcome tour](https://developercommunity.microsoft.com/t/Developer-Portal-landing-page-and-welcom/10720999): as a developer getting onboarded to Dev Box, you get to learn about how to use the product and discover features.
- [Region Selection Optimization for Dev Box Creation](https://developercommunity.visualstudio.com/t/Region-selection-optimization-based-on-l/10784537): as a developer, easily create your new Dev Box in an optimal region based on your location. As a dev center admin, optimize the location of existing Dev Boxes based on end user location and available capacity.
- [Direct launch via the Windows App](https://developercommunity.visualstudio.com/t/Direct-launch-via-the-Windows-App/10784545): as a developer, quickly launch Dev Box from the developer portal on the Windows App RDP client.
- [Cross clients multi-monitor settings](https://developercommunity.visualstudio.com/t/Dual-Screen-Settings-adjustment-setting-/10770153): as a developer, your multi-monitor settings will be shared consistently across RDP clients.
- [Notification center for Developer Portal](https://developercommunity.visualstudio.com/t/Outage-notifications-for-Dev-Box/10720453?q=notifications): as a developer, you will get service notifications and updates right in the Developer Portal.
- [Pin Dev Box to task view from Developer Portal](https://developercommunity.visualstudio.com/t/Ping-to-task-view-is-not-quite-working-f/10719957): as a developer, you can quickly access your Developer Box by pinning it to your Windows task view.

## Enterprise management

Microsoft Dev Box aims to deliver centralized governance based on organizational standards for security, compliance, and cost controls. During this period, we're reducing the time it takes enterprises to get started with Dev Box by making it easier to set up a proof of concept (POC) and then move to production. We're also improving our monitoring, cost control, security, and privacy capabilities.

**Streamlined and flexible onboarding for enterprises**

- [In product prerequisites](https://developercommunity.visualstudio.com/t/User-License-Assignment-as-Pre-requisite/10523902?q=pre-requisits): as a dev center admin, you will get a dynamic prerequisites page that highlights any missing requirements and helps you track the progress you are making in setting up the Dev Box service.
- [New Supported Regions](https://devblogs.microsoft.com/develop-from-the-cloud/microsoft-dev-box-regional-availability/): as a dev center admin, you will be able to enable your development team to create dev boxes in new regions including [UAE North](https://developercommunity.visualstudio.com/t/Support-for-Dev-Box-in-UAE-North/10781448) and [Spain Central](https://developercommunity.visualstudio.com/t/Dev-Box-support-in-Spain-Central/10781449).
- [Expand IPs within existing subnets](https://developercommunity.visualstudio.com/t/Expand-IPs-within-existing-Subnets-in-a/10781464): as a dev center admin, you will be able to expand IP ranges in subnets that are running out of IP addresses.
- [RRS Integration into QMS](https://developercommunity.visualstudio.com/t/Automatically-approve-higher-amounts-of/10781465): as a dev center admin for a trusted customer, you will be able to request and get larger amount of quota automatically approved through QMS.

**Enhanced monitoring and cost controls capabilities**

- [Hibernation on disconnect:](https://developercommunity.visualstudio.com/t/Customize-hibernation-options/10640621?entry=suggestion&q=hibernation+disconnect) as a dev center admin, reduce cost of compute by enabling dev boxes to hibernate on disconnect based on active working hours of developers.
- [Dev Box logs:](https://developercommunity.visualstudio.com/t/When-Microsoft-Monitoring-Agent-will-be/10471575?entry=suggestion&q=Azure+Monitor) as a dev center admin, access user level engagement metrics and connectivity related metrics. 

**Security and privacy**

- [Project Policy](https://developercommunity.visualstudio.com/t/Curation-for-Dev-Center-and-Projects-und/10719953): as a dev center admin, set up guardrails around resources that different projects should and shouldn't access.
- [Customer Managed Keys (CMK):](https://developercommunity.visualstudio.com/t/Encryption-with-customer-managed-keys-fo/10720463) as a dev center admin, have a greater control over your data encryption by managing your own encryption keys.
- [Developer offboarding](https://developercommunity.visualstudio.com/t/Provide-a-means-to-do-external-cleanup/10670632?q=delete+unused+): as a dev center admin, configure your Dev Box service to offload users from Dev Boxes when they leave the organization and switch between teams.
- [Firewall Service Tags](https://developercommunity.visualstudio.com/t/Dev-Box:-Advanced-notice-and-notificatio/10704156?q=firewall): as IT administrator working on setting up Dev Box for your organization, quickly configure traffic roles by utilizing Service Tags in your Firewall set up.  

## Fundamental performance & reliability

Microsoft Dev Box aims to provide a "like-local" developer experience that is as responsive and seamless as working on a local machine. We're continually enhancing the reliability, speed, and performance of Dev Box by optimizing everything from your favorite Visual Studio development tools to Windows, RDP, and the location of Dev Boxes.

**Seamless and reliable connectivity**

- [Single Sign On (SSO)](https://developercommunity.visualstudio.com/t/Enable-single-sign-on-for-dev-boxes/10720478): as a developer, you no longer need to provide your sign-in credentials every time you access your Dev Box.
- [Visual Studio 2022 RDP optimizations](https://developercommunity.microsoft.com/t/VS-and-VS-Code-optimizations-for-Dev-Box/10720946): as a developer, type and navigate your code without any noticeable latency.
- [Auto network repair](https://developercommunity.visualstudio.com/t/Enable-Network-Adapter-after-wrongly-dis/10656306): as a developer, if you lose connectivity to your Dev Box due to miss configuring your Dev Box network adapter, Dev Box will automatically reset your network connection.
- [Azure region optimizations based on user locations:](https://developercommunity.visualstudio.com/t/Move-VM-to-different-poolregion/10277787) as a dev center admin, optimize the location of existing Dev Boxes based on end user location and available capacity. 

**Service health & reliability**

- [Startup optimizations](https://developercommunity.visualstudio.com/t/Startup-optimizations-for-Dev-box/10781438): as a developer, you will experience a more reliable and stable Dev Box startup experience.
- [Backup SKUs:](https://developercommunity.visualstudio.com/t/Back-up-SKUs-in-case-of-capacity-outage/10720451) as a developer, you will be able to smoothly resume working on existing dev boxes during service outages by opting to using a fallback SKU.
- [Self-service snapshot and restore](https://developercommunity.visualstudio.com/t/Self-serve-snapshot-and-restore/10719611): as a developer, you can recover your Dev Box by restoring it to a previous snapshot.
- [Outage notifications:](https://developercommunity.visualstudio.com/t/Outage-notifications-for-Dev-Box/10720453) developers and admins can stay informed about ongoing service outages via outage notification shared within the developer and Azure status portals including [Azure Service Health](https://azure.microsoft.com/get-started/azure-portal/service-health) and [Azure Status](https://azure.status.microsoft/status) portals.


This roadmap outlines our current priorities, and we remain flexible to adapt based on customer feedback. We invite you to [share your thoughts and suggest more capabilities you would like to see](https://aka.ms/DevBox/Feedback). Your insights help us refine our focus and deliver even greater value.

## Related content

- [What is Microsoft Dev Box?](overview-what-is-microsoft-dev-box.md)
