---
title: Roadmap for Microsoft Dev Box
description: Learn about features coming soon and in development for Microsoft Dev Box.
ms.service: dev-box
ms.topic: concept-article
author: fawadalikhan
ms.author: fkhan
ms.date: 03/05/2025

#customer intent: As a customer, I want to understand upcoming features and enhancements in Microsoft Dev Box so that I can plan and optimize development and deployment strategies.

---

# Microsoft Dev Box roadmap


This roadmap presents a set of planned feature releases that underscores Microsoft's commitment to deliver the most secure and productive developer experience from the cloud. This feature list offers a glimpse into our plans for the next six months, highlighting key features we're developing. It's not exhaustive but shows major investments. Some features might release as previews and evolve based on your feedback before becoming generally available. We always listen to your input, so the timing, design, and delivery of some features might change.

Key Dev Box deliverables can be grouped under the following themes:

- Ready-to-code development environment

- Enterprise management

- Fundamental performance & reliability

## Ready-to-code development environment

Microsoft Dev Box can significantly enhance developer productivity by minimizing configuration time and IT overhead compared to traditional virtual desktop infrastructure (VDI) solutions. We're making it incredibly easy and quick for developers to create ready-to-code environments tailored to their specific projects. Not only are we reducing the time required to set up Dev Box machines, but we're also introducing innovative new customization options for both teams and individuals.

**Config-as-code workflow improvements**

- [Team customizations](https://developercommunity.visualstudio.com/t/Share-customization-files-across-my-team/10729596?sort=newest) and [Dev Center Imaging](https://developercommunity.visualstudio.com/t/Speed-up-Dev-Box-customization-using-a-c/10729598): 

    - As a project lead or a dev center admin, you can now use custom images to create image definitions, instead of just marketplace images.

    - As a project lead or a dev center admin, you can specify a custom network connection to use when building images, so that you can access and fetch resources that are only accessible from your custom virtual networks.

    - You can now use the CLI and VS Code extension to debug tasks that use the PowerShell and Winget primitives, and you can set them to have a custom time out for long running scripts.

    - As a project lead or a dev center admin you can use the Dev Box Visual Studio Code extension, now powered by GitHub Copilot chat, to create customization files.

**Developer onboarding & experience**

- [Region Selection Optimization for Dev Box Creation](https://developercommunity.visualstudio.com/t/Region-selection-optimization-based-on-l/10784537): As a developer, easily create your new Dev Box in an optimal region based on your location. As a dev center admin, optimize the location of existing Dev Box machines based on end user location and available capacity.

## Enterprise management

Microsoft Dev Box aims to deliver centralized governance based on organizational standards for security, compliance, and cost controls. During this period, we're reducing the time it takes enterprises to get started with Dev Box by making it easier to set up a proof of concept (POC) and then move to production. We're also improving our monitoring, cost control, security, and privacy capabilities.

**Streamlined and flexible onboarding for enterprises**

- [In product prerequisites](https://developercommunity.visualstudio.com/t/User-License-Assignment-as-Pre-requisite/10523902?q=pre-requisits): As a dev center admin, you'll be able to identify the prerequisites, and quickly start setting up the Dev Box service.

- [New Supported Regions](https://devblogs.microsoft.com/develop-from-the-cloud/microsoft-dev-box-regional-availability/): As a dev center admin, you'll be able to enable your development team to create Dev Box machines in new regions including [UAE North](https://developercommunity.visualstudio.com/t/Support-for-Dev-Box-in-UAE-North/10781448) and [Spain Central](https://developercommunity.visualstudio.com/t/Dev-Box-support-in-Spain-Central/10781449).

- [On-behalf creation](https://developercommunity.microsoft.com/t/On-behalf-creation-of-machines/10859734): As a dev center admin, you'll be able to provision a Dev Box machine for other developers in your team.

**Network setup and expansion**

- [Expand IPs within existing subnets](https://developercommunity.visualstudio.com/t/Expand-IPs-within-existing-Subnets-in-a/10781464): As a dev center admin, you'll be able to expand IP ranges in subnets that are running out of IP addresses.

- [RRS Integration into QMS](https://developercommunity.visualstudio.com/t/Automatically-approve-higher-amounts-of/10781465): As a dev center admin for a trusted customer, you'll be able to request and get larger quota automatically approved through QMS.

- [Firewall Service Tags](https://developercommunity.visualstudio.com/t/Dev-Box:-Advanced-notice-and-notificatio/10704156?q=firewall): As an IT administrator working on setting up Dev Box for their organization, quickly configure traffic roles by utilizing Service Tags in your Firewall set up.

**Enhanced monitoring and cost controls capabilities**

- [Active hours of usage and auto-start](https://developercommunity.microsoft.com/t/Automatic-ShutdownPower-up-based-on-wor/10729429): As a dev center admin, reduce the cost of compute by enabling Dev Box machines to be active for certain hours during the day. Give developers the ability to start their machines 15 mins before the active hours begin. 

- [Monitoring logs:](https://developercommunity.visualstudio.com/t/When-Microsoft-Monitoring-Agent-will-be/10471575?entry=suggestion&q=Azure+Monitor) As a dev center admin, access user level engagement metrics and connectivity related metrics.

**Security and privacy**

- [Project Policy](https://developercommunity.visualstudio.com/t/Curation-for-Dev-Center-and-Projects-und/10719953): As a dev center admin, set up guardrails using policies around resources that different projects should and shouldn't access.

- [Customer Managed Keys (CMK):](https://developercommunity.visualstudio.com/t/Encryption-with-customer-managed-keys-fo/10720463) As a dev center admin, have greater control over your data encryption by managing your own encryption keys.

- [Developer offboarding](https://developercommunity.visualstudio.com/t/Provide-a-means-to-do-external-cleanup/10670632?q=delete+unused+): As a dev center admin, configure your Dev Box service to offload users from the service when they leave the organization and switch between teams.

## Fundamental performance & reliability

Microsoft Dev Box aims to provide a "like-local" developer experience that is as responsive and seamless as working on a local machine. We're continually enhancing the reliability, speed, and performance of Dev Box by optimizing everything from your favorite Visual Studio development tools to Windows, RDP, and the location of Dev Box machines.

**Seamless and reliable connectivity**

- [Single Sign On (SSO) for existing Dev Box machines](https://developercommunity.microsoft.com/t/Single-Sign-On-SSO-for-existing-Dev-Bo/10859770): As a dev center admin, you'll be able to enable Single Sign On experience for already existing Dev Box machines.

- [Auto Remediation Improvements](https://developercommunity.microsoft.com/t/Network-connection-auto-remediation/10861428): As a developer, you won't be blocked from connecting to your Dev Box machine due to networking issues. Autoremediation of connectivity issues should allow you to connect to your machine.

- [Latency Improvements](https://developercommunity.visualstudio.com/t/Latency-improvements-when-using-a-mouse/10859786): As a developer you'll experience reduced mouse latency with high-resolution monitors along with other generic latency improvements.

- [Open Dev Box machine in Visual Studio Code](https://developercommunity.microsoft.com/t/Open-a-Dev-Box-machine-in-VS-Code/10859793): As a developer, you'll be able to access your developer environments on your Dev box machine, including WSL, from your local developer machine.

**Service health & reliability**

- [Backup SKUs:](https://developercommunity.visualstudio.com/t/Back-up-SKUs-in-case-of-capacity-outage/10720451) As a developer, you'll be able to smoothly resume working on existing Dev Box machines during service outages by opting to using a fallback SKU.

- [Self-service snapshot and restore](https://developercommunity.visualstudio.com/t/Self-serve-snapshot-and-restore/10719611): As a developer, you can recover your Dev Box by restoring it to a previous snapshot.

- [Azure region optimizations based on user locations:](https://developercommunity.visualstudio.com/t/Move-VM-to-different-poolregion/10277787) As a dev center admin, optimize the location of existing Dev Box machines based on end user location and available capacity.

This roadmap outlines our current priorities, and we remain flexible to adapt based on customer feedback. We invite you to [share your thoughts and suggest more capabilities you would like to see](https://aka.ms/DevBox/Feedback). Your insights help us refine our focus and deliver even greater value.

## Related content

- [What's new in Microsoft Dev Box](https://aka.ms/devbox/whatsnew)
- [What is Microsoft Dev Box?](/azure/dev-box/overview-what-is-microsoft-dev-box)
- [Key concepts for Microsoft Dev Box - Microsoft Dev Box | Microsoft Learn](/azure/dev-box/concept-dev-box-concepts)
- [Microsoft Dev Box architecture - Microsoft Dev Box | Microsoft Learn](/azure/dev-box/concept-dev-box-architecture)
