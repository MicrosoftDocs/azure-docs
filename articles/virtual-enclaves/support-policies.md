---
title: Support policies for Azure Virtual Enclaves
description: Support policies for Azure Virtual Enclaves
author: jadean-msft
ms.author: jadean
# ms.service: Azure Virtual Enclaves
ms.topic: overview
ms.date: 01/31/2025
---

# Support policies for Azure Virtual Enclaves

This article describes technical support policies and limitations for Azure Virtual Enclaves (AVE). It also details managed resource group components and security or patch management. [Learn more about how Azure Virtual Enclaves works](./best-practices.md).

## Support during Private Preview

Thank you for participating in the Private Preview of Azure Virtual Enclaves! For all questions or concerns that cannot be addressed using the documentation found in this site, please do not hesitate to reach out to your designated Azure Virtual Enclaves Product Manager (PM)point-of-contact. As part of your onboarding to the Private Preview, you and your team will have been assigned a PM that will help you with any questions you have while using Azure Virtual Enclaves.

## Service updates and releases

* [Versioning policy for Azure services](https://learn.microsoft.com/azure/developer/intro/azure-service-sdk-tool-versioning)

## Managed features in AVE

Base infrastructure as a service (IaaS) cloud components, such as compute or networking components, allow you access to low-level controls and customization options. By contrast, AVE provides a turnkey, isolated landing zone deployment that gives you a common set of pre-configured Azure resources and capabilities you need for your environment. As an AVE user, you have limited customization and deployment options. 

AVE isn't a Platform-as-a-Service (PaaS) solution. Some components, such as the enclave network, have *shared responsibility*, where you must help maintain the enclave network. User input is required, for example, to create networking rules and changes on the enclave or apply an operating system (OS) security patches to [Admin Workstations](./understanding-admin-workstations.md).

The services are *managed* in the sense that Microsoft and the AVE team deploys, operates, and is responsible for service availability and functionality. Customers can't alter these managed components. Microsoft limits customization to ensure a consistent and scalable user experience.

## Shared responsibility

When an [enclave](./what-is-an-enclave.md) is created, you can create and add your own [workloads](./what-is-a-workload.md). Your workloads are deployed into an enclave.

Because your workloads execute private code and store sensitive data, Microsoft Support can access them only in a limited way. Microsoft Support can't sign into, execute commands in, or view logs for these workloads without your express permission or assistance.

Any modification made directly to the resources in any of the AVE managed resource groups using any one of the IaaS or PaaS APIs potentially renders the environment unsupportable. Similarly, while you may add any metadata to the enclave and workloads, such as tags and labels, changing any of the system created metadata renders the environment unsupported.

## AVE support coverage

Microsoft provides technical support for the following examples:

* Management, uptime, QoS, and operations of AVE control plane services (For example, AVE control plane and API server).
* Any integration points in the Azure cloud provider driver for Kubernetes. These include integrations into other Azure services such as networking. 
* Issues about networking, such as Azure Virtual Networks, or other network access and functionality issues. Issues could include DNS resolution, packet loss, routing, and so on. Microsoft supports various networking scenarios:
  * Azure Networking using managed VNETs or with custom (bring your own) subnets.
  * Connectivity to other Azure services and applications
  * Network performance and latency

Microsoft doesn't provide technical support for the following scenarios:

* Third-party closed-source software. This software can include security scanning tools and networking devices or software.
* Network customizations.
* Stand-by and proactive scenarios. Microsoft Support provides reactive support to help solve active issues in a timely and professional manner. However, standby or proactive support to help you eliminate operational risks, increase availability, and optimize performance are not covered. [Eligible customers](https://www.microsoft.com/unifiedsupport) can contact their account team to get nominated for [Azure Event Management service](https://devblogs.microsoft.com/premier-developer/proactively-plan-for-your-critical-event-in-azure-with-enhanced-support-and-engineering-services/). It's a paid service delivered by Microsoft support engineers that includes a proactive solution risk assessment and coverage during the event.

## Network ports, access, and NSGs

You may only customize the NSGs on custom subnets. You may not customize NSGs on managed subnets or at the NIC level of your workloads. AVE has egress requirements to specific endpoints. For ingress, the requirements are based on the applications you have deployed to your enclave.

## Preview features or feature flags

For features and functionality that requires extended testing and user feedback, Microsoft releases new preview features or features behind a feature flag. Consider these features as prerelease or beta features.

Preview features or feature-flag features aren't meant for production. Ongoing changes in APIs and behavior, bug fixes, and other changes can result in unstable clusters and downtime.

Features in public preview fall under **best effort** support, as these features are in preview and are not meant for production. The AVE technical support teams provides support during business hours only. For more information, see [Azure Support FAQ](https://azure.microsoft.com/support/faq/).
