---
title: Introduction to Azure Security Center Security Policies | Microsoft Docs
description: Learn about Azure Security Center security policies, and its key capabilities.
services: security-center
documentationcenter: na
author: YuriDio
manager: MBaldwin
editor: ''

ms.assetid: f24b1e4a-cc36-4542-b21e-041453cdfcd8
ms.service: security-center
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/13/2017
ms.author: yurid

---
# Security Policies Overview
This document provides an overview of security policies in Security Center.

## What are security policies?
A security policy defines the desired configuration of your workloads and helps ensure compliance with company or regulatory security requirements. In Security Center, you can define policies for your Azure subscriptions, which can be tailored to the type of workload or the sensitivity of data. For example, applications that use regulated data like personally identifiable information might require a higher level of security than other workloads. 

Security Center policies contain the following components:

- Data collection: agent provisioning and [data collection](https://docs.microsoft.com/azure/security-center/security-center-enable-data-collection) settings.
- Security policy: determines which controls are monitored and recommended by Security Center (edit the [security policy](https://docs.microsoft.com/en-us/azure/security-center/security-center-policies) in Security Center, or use [Azure Policy](security-center-azure-policy.md), in limited preview to create new definitions, define additional policies, and assign policies across Management Groups).
- Email notifications: security contacts, and [e-mail notification](https://docs.microsoft.com/azure/security-center/security-center-provide-security-contact-details) settings.
- Pricing tier: free or standard [pricing selection](https://docs.microsoft.com/azure/security-center/security-center-pricing), which determines which Security Center features are available for resources in scope (can be specified for subscriptions, resource groups, and workspaces). 


## Who can edit security policies?
Security Center uses Role-Based Access Control (RBAC), which provides built-in roles that can be assigned to users, groups, and services in Azure. When a user opens Security Center, they only see information related to resources they have access to. Which means the user is assigned the role of Owner, Contributor, or Reader to the subscription or resource group that a resource belongs to. In addition to these roles, there are two specific Security Center roles:

- Security reader: user that belongs to this role is able to view rights to Security Center, which includes recommendations, alerts, policy, and health, but it won't be able to make changes.
- Security admin: same as security reader but it can also update the security policy, dismiss recommendations and alerts.


## Next steps
In this document, you learned about security policies in Azure Security Center. To learn more about Azure Security Center, see the following:

* [Setting security policies in Azure Security Center](security-center-policies.md) — Learn how to configure security policies for your Azure subscriptions and resource groups.
* [Managing security recommendations in Azure Security Center](security-center-recommendations.md) — Learn how recommendations help you protect your Azure resources.
* [Security health monitoring in Azure Security Center](security-center-monitoring.md) — Learn how to monitor the health of your Azure resources.
* [Managing and responding to security alerts in Azure Security Center](security-center-managing-and-responding-alerts.md) — Learn how to manage and respond to security alerts.
* [Monitoring partner solutions with Azure Security Center](security-center-partner-solutions.md) — Learn how to monitor the health status of your partner solutions.
- [Azure Security Center data security](security-center-data-security.md) - Learn how data is managed and safeguarded in Security Center.
* [Azure Security Center FAQ](security-center-faq.md) — Find frequently asked questions about using the service.
* [Azure Security blog](http://blogs.msdn.com/b/azuresecurity/) — Get the latest Azure security news and information.


