---
title: Roadmap for Microsoft Dev Box
description: Learn about features coming soon and in development for Microsoft Dev Box.
ms.service: dev-box
ms.topic: concept-article
author: Taysser-Gherfal
ms.author: tagherfa
ms.date: 08/26/2024

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
- [Native Run as user support for Dev Box customizations](https://developercommunity.visualstudio.com/t/Improve-run-as-user-support-for-Dev-Box/10719951): some of your Dev Box customization tasks require to be run as the signed in user. Native run as user support provides capability of executing customization under the user context with improved reliability, status tracking, and error reporting. 
- [Project Policy](https://developercommunity.visualstudio.com/t/Curation-for-Dev-Center-and-Projects-und/10719953): as a dev center admin, set up guardrails around resources that different projects should and shouldn't access.

**Enhanced user provided customizations**

- [Improved Dev Box creation flow on Dev Home and Developer Portal](https://developercommunity.visualstudio.com/t/I-would-like-to-use-Dev-Box-customizatio/10719976): as a developer, get started with Dev Box customizations using a UI to choose repositories to clone or packages to install, without having to author a yaml configuration by hand.
- [Native support for WinGet & DSC](https://developercommunity.visualstudio.com/t/I-would-like-my-Dev-Box-to-run-Winget-an/10719983): all Dev Boxes will be able to use WinGet and DSC to install packages and apply configurations, without requiring a catalog to be attached. 

**First time developer experience**

- [Developer Portal landing page and welcome tour](https://developercommunity.microsoft.com/t/Developer-Portal-landing-page-and-welcom/10720999): as a developer getting onboarded to Dev Box, you get to learn about how to use the product and discover features.
- [Pin Developer Portal to task view/desktop](https://developercommunity.visualstudio.com/t/Ping-to-task-view-is-not-quite-working-f/10719957): as a developer, you can quickly access your Developer Box by pinning it to your Windows task view.

## Enterprise management

Microsoft Dev Box aims to deliver centralized governance based on organizational standards for security, compliance, and cost controls. During this period, we're reducing the time it takes enterprises to get started with Dev Box by making it easier to set up a proof of concept (POC) and then move to production. We're also improving our monitoring, cost control, security, and privacy capabilities.

**Streamlined and flexible onboarding for enterprises**

- [Firewall Service Tags](https://developercommunity.visualstudio.com/t/Dev-Box:-Advanced-notice-and-notificatio/10704156?q=firewall): as IT administrator working on setting up Dev Box for your organization, quickly configure traffic roles by utilizing Service Tags in your Firewall set up.  
- [Guest Account](https://developercommunity.visualstudio.com/t/Enable-Guest-accountsVendors-to-access-/10290470): as a dev center admin, securely onboard and support external teams and contractors to your Dev Box service.

**Enhanced monitoring and cost controls capabilities**

- [Dev Box logs:](https://developercommunity.visualstudio.com/t/When-Microsoft-Monitoring-Agent-will-be/10471575?entry=suggestion&q=Azure+Monitor) as a dev center admin, access user level engagement metrics and connectivity related metrics. 
- [Azure Monitor Agent (AMA) scoping](https://developercommunity.visualstudio.com/t/When-Microsoft-Monitoring-Agent-will-be/10471575?entry=suggestion&q=Azure+Monitor): as a dev center admin, focus your monitoring solely on Dev Box devices, which simplifies monitoring and reduces costs. 
- [Hibernation on disconnect (preview):](https://developercommunity.visualstudio.com/t/Customize-hibernation-options/10640621?entry=suggestion&q=hibernation+disconnect) as a dev center admin, reduce cost of compute by enabling Dev Boxes to hibernate on disconnect based on active working hours of developers. 

**Security and privacy**

- [Customer Managed Keys (CMK):](https://developercommunity.visualstudio.com/t/Encryption-with-customer-managed-keys-fo/10720463) as a dev center admin, have a greater control over your data encryption by managing your own encryption keys.
- [Privileged Identity Management (PIM)](https://developercommunity.visualstudio.com/t/Only-allows-Dev-Box-projects-to-utilize-/10502335): as a dev center admin, get just-in-time admin access to project configurations.
- [Developer offboarding](https://developercommunity.visualstudio.com/t/Provide-a-means-to-do-external-cleanup/10670632?q=delete+unused+): as a dev center admin, configure your Dev Box service to offload users from Dev Boxes when they leave the organization and switch between teams. 

## Fundamental performance & reliability

Microsoft Dev Box aims to provide a "like-local" developer experience that is as responsive and seamless as working on a local machine. We're continually enhancing the reliability, speed, and performance of Dev Box by optimizing everything from your favorite Visual Studio development tools to Windows, RDP, and the location of Dev Boxes.

**Seamless and reliable connectivity**

- [Single Sign On (SSO)](https://developercommunity.visualstudio.com/t/Enable-single-sign-on-for-dev-boxes/10720478): as a developer, you no longer need to provide your sign-in credentials every time you access your Dev Box.
- [Simple Multiple Independent Links Evaluation & Switching](https://developercommunity.microsoft.com/t/Reliable-Connectivity-to-Dev-Box/10720996) [(SMILES):](https://developercommunity.microsoft.com/t/Reliable-Connectivity-to-Dev-Box/10720996) as a developer, you get an uninterrupted reliable Dev Box connection by automatically switching to backup links as needed without disconnecting your active session.
- [Azure region optimizations based on user locations:](https://developercommunity.visualstudio.com/t/Move-VM-to-different-poolregion/10277787) as a developer, easily create your new Dev Box in an optimal region based on your location. As a dev center admin, optimize the location of existing Dev Boxes based on end user location and available capacity. 
- [Visual Studio 2022 and Visual Studio Code RDP optimizations](https://developercommunity.microsoft.com/t/VS-and-VS-Code-optimizations-for-Dev-Box/10720946): as a developer, type and navigate your code without any noticeable latency. 

**Service health & reliability**

- [Backup SKUs:](https://developercommunity.visualstudio.com/t/Back-up-SKUs-in-case-of-capacity-outage/10720451) as a dev center admin, you get the option to select backup SKUs to be automatically utilized to avoid interruptions during a service outage. 
- [Self-service snapshot and restore](https://developercommunity.visualstudio.com/t/Self-serve-snapshot-and-restore/10719611): as a developer, you can recover your Dev Box by restoring it to a previous snapshot.
- [Outage notifications:](https://developercommunity.visualstudio.com/t/Outage-notifications-for-Dev-Box/10720453) developers and admins can stay informed about ongoing service outages via outage notification shared within the developer and Azure status portals. 

## Related content

- [What is Microsoft Dev Box?](overview-what-is-microsoft-dev-box.md)