---
title: Azure Security Center security policy settings | Microsoft Docs
description: Configure Azure Security Center security policy settings.
services: security-center
documentationcenter: na
author: rkarlin
manager: MBaldwin
editor: ''

ms.assetid: f24b1e4a-cc36-4542-b21e-041453cdfcd8
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/3/2018
ms.author: rkarlin

---
# Security policy settings
This article provides an overview of security policy settings in Security Center.

## What are security policies?
A security policy defines the desired configuration of your workloads and helps ensure compliance with company or regulatory security requirements. In Azure Security Center, you can define policies for your Azure subscriptions and tailor them to your type of workload or the sensitivity of your data. For example, applications that use regulated data, such as personally identifiable information, might require a higher level of security than other workloads.

You can set the following under Security Policy:

- **Data collection**: Determines agent provisioning and [data collection](https://docs.microsoft.com/azure/security-center/security-center-enable-data-collection) settings.
- **Security policy**: Determines which controls Security Center monitors and recommends. You can edit the [security policy](security-center-policies.md) in Security Center. You can also use [Azure Policy](security-center-azure-policy.md) to create new definitions, define additional policies, and assign policies across management groups. 
- **Email notifications**: Determines security contacts, and [email notification](security-center-provide-security-contact-details.md) settings.
- **Pricing tier**: Defines free or standard [pricing selection](security-center-pricing.md). The tier you choose determines which Security Center features are available for resources in scope. You can specify a tier for subscriptions, resource groups, and workspaces.

> [!NOTE]
> You can set all of these per subscription. For Workspaces, you can set only Data collection and Pricing tier. For Resource groups you can set only Pricing tier.
>


## Who can edit security policies?
Security Center uses Role-Based Access Control (RBAC), which provides built-in roles that can be assigned to users, groups, and services in Azure. When users open Security Center, they see only information that's related to resources they have access to. Which means that users are assigned the role of *owner*, *contributor*, or *reader* to the subscription or resource group that a resource belongs to. In addition to these roles, there are two specific Security Center roles:

- **Security reader**: Have view rights to Security Center, which includes recommendations, alerts, policy, and health, but they can't make changes.
- **Security admin**: Have the same view rights as *security reader*, and they can also update the security policy and dismiss recommendations and alerts.


## Next steps
In this article, you learned about security policies in Azure Security Center. To learn more about Azure Security Center, see the following articles:

* [Setting security policies in Azure Security Center](security-center-policies.md): Learn how to configure security policies for your Azure subscriptions and resource groups.
* [Managing security recommendations in Azure Security Center](security-center-recommendations.md): Learn how Security Center recommendations help you protect your Azure resources.
* [Security health monitoring in Azure Security Center](security-center-monitoring.md): Learn how to monitor the health of your Azure resources.
* [Managing and responding to security alerts in Azure Security Center](security-center-managing-and-responding-alerts.md): Learn how to manage and respond to security alerts.
* [Monitoring partner solutions with Azure Security Center](security-center-partner-solutions.md): Learn how to monitor the health status of your partner solutions.
- [Azure Security Center data security](security-center-data-security.md): Learn how Security Center manages and safeguards data.
* [Azure Security Center FAQ](security-center-faq.md): Get answers to frequently asked questions about using the service.
* [Azure Security blog](http://blogs.msdn.com/b/azuresecurity/): Get the latest Azure security news and information.
