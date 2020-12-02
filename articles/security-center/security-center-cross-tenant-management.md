---
title: Cross-tenant management in Azure Security Center | Microsoft Docs
description: Learn how to set up cross-tenant management to manage the security posture of multiple tenants in Security Center using Azure delegated resource management.
services: security-center
documentationcenter: na
author: memildin
manager: rkarlin
ms.assetid: 7d51291a-4b00-4e68-b872-0808b60e6d9c
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 08/11/2019
ms.author: memildin

---

# Cross-tenant management in Security Center

Cross-tenant management enables you to view and manage the security posture of multiple tenants in Security Center by leveraging [Azure delegated resource management](../lighthouse/concepts/azure-delegated-resource-management.md)
. Manage multiple tenants efficiently, from a single view, without having to sign in to each tenant's directory.

- Service providers can manage the security posture of resources, for multiple customers, from within their own tenant.

- Security teams of organizations with multiple tenants can view and manage their security posture from a single location.

## Configure cross-tenant management permissions for your organization

Azure delegated resource management is one of the key components of Azure Lighthouse. Set up cross-tenant management by delegating access to resources of managed tenants to your own tenant using these instructions from Azure Lighthouse's documentation: [Azure delegated resource management](../lighthouse/concepts/azure-delegated-resource-management.md).


## Enable tenant-wide permissions for yourself

A user with the Azure Active Directory role of **Global Administrator** might have tenant-wide responsibilities, but lack the Azure permissions to view that organization-wide information in Azure Security Center. 

To assign yourself tenant-level permissions:

1. As a Global Administrator user without an assignment on the root management group of the tenant, open Security Center's **Overview** page and select the **tenant-wide visibility** link in the banner. 

    :::image type="content" source="media/security-center-cross-tenant-management/enable-tenant-level-permissions-banner.png" alt-text="Enable tenant-level permissions in Azure Security Center":::

1. Select the new Azure role to be defined. 

    :::image type="content" source="media/security-center-cross-tenant-management/enable-tenant-level-permissions-form.png" alt-text="Form for defining the tenant-level permissions to be assigned to your user":::

    > [!TIP]
    > To understand the differences between the optional roles, use the table in [Roles and allowed actions](security-center-permissions.md#roles-and-allowed-actions).

The organizational-wide view is achieved by granting roles on the root management group level of the tenant.  

Learn more about the [Global Administrator role](../role-based-access-control/rbac-and-directory-admin-roles.md#azure-ad-roles)

## How does cross-tenant management work in Security Center

You are able to review and manage subscriptions across multiple tenants in the same way that you manage multiple subscriptions in a single tenant.

From the top menu bar, click the filter icon, and select the subscriptions, from each tenant's directory, you'd like to view.

  ![Filter tenants](./media/security-center-cross-tenant-management/cross-tenant-filter.png)

The views and actions are basically the same. Here are some examples:

- **Manage security policies**: From one view, manage the security posture of many resources with [policies](tutorial-security-policy.md), take actions with security recommendations, and collect and manage security-related data.
- **Improve Secure Score and compliance posture**: Cross-tenant visibility enables you to view the overall security posture of all your tenants and where and how to best improve the [secure score](secure-score-security-controls.md) and [compliance posture](security-center-compliance-dashboard.md) for each of them.
- **Remediate recommendations**: Monitor and remediate a [recommendation](security-center-recommendations.md) for many resources from various tenants at one time. You can then immediately tackle the vulnerabilities that present the highest risk across all tenants.
- **Manage Alerts**: Detect [alerts](security-center-alerts-overview.md) throughout the different tenants. Take action on resources that are out of compliance with actionable [remediation steps](security-center-managing-and-responding-alerts.md).

- **Manage advanced cloud defense features and more**: Manage the various threat protection services, such as [just-in-time (JIT) VM access](security-center-just-in-time.md), [Adaptive Network Hardening](security-center-adaptive-network-hardening.md), [adaptive application controls](security-center-adaptive-application.md), and more.
 
## Next steps
This article explains how cross-tenant management works in Security Center. To learn more about Security Center, see the following:

* [Strengthen your security posture with Azure Security Center](security-center-monitoring.md) - Learn how to monitor the health of your Azure resources.
* [Azure Security Center FAQ](faq-general.md) - Find frequently asked questions about using the service.
* [Learn about Azure Lighthouse in enterprise scenarios](../lighthouse/concepts/enterprise.md) - Discover how Azure Lighthouse can simplify cross-tenant management within an enterprise which uses multiple Azure AD tenants.