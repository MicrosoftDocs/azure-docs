---
title:  Quotas overview
description: Learn about to view quotas and request increases in the Azure portal.
ms.date: 08/17/2023
ms.topic: how-to
---

# Quotas overview

Many Azure services have quotas, which are the assigned number of resources for your Azure subscription. Each quota represents a specific countable resource, such as the number of virtual machines you can create, the number of storage accounts you can use concurrently, the number of networking resources you can consume, or the number of API calls to a particular service you can make.

The concept of quotas is designed to help protect customers from things like inaccurately resourced deployments and mistaken consumption. For Azure, it helps minimize risks from deceptive or inappropriate consumption and unexpected demand. Quotas are set and enforced in the scope of the [subscription](/microsoft-365/enterprise/subscriptions-licenses-accounts-and-tenants-for-microsoft-cloud-offerings).

## Quotas or limits?

Quotas were previously referred to as limits. Quotas do have limits, but the limits are variable and dependent on many factors. Each subscription has a default value for each quota.  

> [!NOTE]
> There is no cost associated with requesting a quota increase. Costs are incurred based on resource usage, not the quotas themselves.

## Usage Alerts

The Quotas page allows you to [Monitor & Create Alerts](monitoring-alerting.md) for specific Quotas, enabling you to receive notifications when the usage reaches predefined thresholds.

## Adjustable and non-adjustable quotas

Quotas can be adjustable or non-adjustable.

- **Adjustable quotas**: Quotas for which you can request quota increases fall into this category. Each subscription has a default quota value for each quota. You can request an increase for an adjustable quota from the [Azure Home](https://portal.azure.com/#home) **My quotas** page, providing an amount or usage percentage and submitting it directly. This is the quickest way to increase quotas.
- **Non-adjustable quotas**: These are quotas which have a hard limit, usually determined by the scope of the subscription. To make changes, you must submit a support request, and the Azure support team will help provide solutions.

## Work with quotas

Different entry points, data views, actions, and programming options are available, depending on your organization and administrator preferences.

| Option | Azure portal | Quota APIs | Support API |
|---------|---------|---------|---------|
| Summary | The portal provides a customer-friendly user interface for accessing quota information.<br><br>From [Azure Home](https://portal.azure.com/#home), **Quotas** is a centralized location to directly view quotas and quota usage and request quota increases.<br><br>From the Subscriptions page, **Quotas + usage** offers quick access to requesting quota increases for a given subscription.| The [Azure Quota Service REST API](/rest/api/quota) programmatically provides the ability to get current quota limits, find current usage, and request quota increases by subscription, resource provider, and location. | The [Azure Support REST API](/rest/api/support/) enables customers to create service quota support tickets programmatically. |
| Availability | All customers | All customers | All customers with unified, premier, professional direct support plans |
| Which to choose? | Useful for customers desiring a central location and an efficient visual interface for viewing and managing quotas. Provides quick access to requesting quota increases. | Useful for customers who want granular and programmatic control of quota management for adjustable quotas. Intended for end to end automation of quota usage validation and quota increase requests through APIs. | Customers who want end to end automation of support request creation and management. Provides an alternative path to Azure portal for requests. |
| Providers supported | All providers | Compute, Machine Learning | All providers |

## Next steps

- Learn more about [viewing quotas in the Azure portal](view-quotas.md).
- Learn more about [Monitoring & Creating Alerts](how-to-guide-monitoring-alerting.md) for Quota usages.
- Learn how to request increases for [VM-family vCPU quotas](per-vm-quota-requests.md), [vCPU quotas by region](regional-quota-requests.md), and [spot vCPU quotas](spot-quota.md).
- Learn about [Azure subscription and service limits, quotas, and constraints](../azure-resource-manager/management/azure-subscription-service-limits.md).