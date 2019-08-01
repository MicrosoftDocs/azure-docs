---
title: Cross-tenant management in Azure Security Center | Microsoft Docs
description: " Learn how to enable data collection in Azure Security Center. "
services: security-center
documentationcenter: na
author: monhaber
manager: rkarlin
editor: ''

ms.assetid: 7d51291a-4b00-4e68-b872-0808b60e6d9c
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 07/28/2019
ms.author: v-mohabe

---

# Cross-tenant management in Security Center

Cross-tenant management enables you to view and manage the security posture of multiple tenants in Security Center by leveraging [Azure delegated resource management](../lighthouse/concepts/azure-delegated-resource-management.md)
. Manage multiple tenants efficiently, from a single view, without having to sign in to different accounts.

- Service providers can manage Azure resources efficiently for multiple customers from within their own tenant.

- Managed service providers (MSP) can seamlessly manage an enterprise with multiple tenants from one location.

  ![Cross-tenants management](./media/security-center-cross-tenant-management/cross-tenant-security-center.png)

> [!NOTE]
> Azure delegated resource management is one of the key components of Azure Lighthouse. For details, see [Azure delegated resource management](../lighthouse/concepts/azure-delegated-resource-management.md).

## How does cross-tenant management work in Security Center

You are able to review and manage subscriptions across multiple tenants in the same way that you manage multiple subscriptions in a single tenant.

From each screen, click on the filter icon to select the tenants to view.

  ![Filter tenants](./media/security-center-cross-tenant-management/cross-tenant-filter.png)

The views and actions are basically the same. Here are some examples:

- **Improve secure score and compliance posture**: Cross-tenant visibility enables you to view the overall health of all your tenants and where and how to best improve the [secure score](security-center-secure-score.md) and [compliance posture](security-center-compliance-dashboard.md) for each of them. The following image shows how one secure score measures the overall security health of all the selected subscriptions from different tenants. It prioritizes all the security recommendations, so you know which ones to remediate first. This helps you find the most serious security vulnerabilities across all your subscriptions, so you can prioritize remediating them.

  ![Cross-tenant secure score management](./media/security-center-cross-tenant-management/cross-tenant-security-list.png)

- **Remediate recommendations**: Monitor and remediate a [recommendation](security-center-recommendations.md) for many resources from various tenants at one time.

  ![Cross-tenant ](./media/security-center-cross-tenant-management/cross-tenant-recommendation.png)

- **Manage policies**: From one view, manage security posture of many resources with [policies](tutorial-security-policy.md), take actions with security recommendations, and collect and manage security related data.

- **Manage Alerts**: Detect [alerts](security-center-alerts-overview.md) throughout the different tenants. Take action on resources, at one time, that are out of compliance with actionable [remediation steps](security-center-managing-and-responding-alerts.md).

**Manage services and more**: Manage the various threat detection and protection services, such as [just-in-time (JIT)] VM access(security-center-just-in-time.md), [Adaptive Network Hardening](security-center-adaptive-network-hardening.md), [File Integrity Monitoring (FIM)](security-center-file-integrity-monitoring.md), and more.

  ![Cross-tenant Adaptive Network Hardening](./media/security-center-cross-tenant-management/cross-tenant-adaptive-network-hardening.png)
