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

You can view and manage the security posture of multiple tenants in Security Center by activating Azure delegated resource management. Service providers can administer resources from different tenants efficiently, from one place, without having to sign-in and implement the same action repeatedly.  This simplified management ability enables you to delegate resources efficiently and it prevents errors that can happen when repeating the same action many times.

> [!NOTE]
> Azure delegated resource management is one of the key components of Azure Lighthouse. 

  ![Cross-tenants management](./media/security-center-cross-tenant-management/cross-tenant-secure-score.png)

## Activate Azure delegated resource management


## How does it work?

The same management and security features, that you use for one tenant, you can also use when managing multiple tenants. The views and actions are basically the same. Here are some examples:

- Cross-tenant visibility enables you to view the overall health of all your tenants and where and how to best improve the secure score and compliance posture for each of them.

  ![Cross-tenant secure score management](./media/security-center-cross-tenant-management/cross-tenant-secure-score.png)

  ![Cross-tenant regulatory compliance](./media/security-center-cross-tenant-management/cross-tenant-regulatory-compliance.png)

- Monitor and remediate a recommendation for many resources from various tenants at one time.

  ![Cross-tenant ](./media/security-center-cross-tenant-management/cross-tenant-recommendation.png)

- Manage security posture with policies, take actions with security recommendations, and collect and manage security related data.

  ![Cross-tenant ](./media/security-center-cross-tenant-management/cross-tenant-security-policy.png)

- Detect alerts throughout the different tenants.

  ![Cross-tenant alerts](./media/security-center-cross-tenant-management/cross-tenant-alerts.png)

- Take action on resources that are out of compliance with actionable security recommendations.

  ![Cross-tenant remediation](./media/security-center-cross-tenant-management/cross-tenant-alert-remediate.png)

- Manage the various threat detection and protection services, such as just-in-time (JIT) VM access, Adaptive Network Hardening, and File Integrity Monitoring (FIM).

  ![Cross-tenant Adaptive Network Hardening](./media/security-center-cross-tenant-management/cross-tenant-adaptive-network-hardening.png)
