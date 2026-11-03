---
title: Troubleshoot environment capacity errors in Azure Container Apps
description: Troubleshoot regional capacity errors during Azure Container Apps environment creation, retry provisioning, and plan deployments across regions.
#customer intent: As a developer provisioning an Azure Container Apps environment, I want to understand capacity errors and my deployment options, so that I can complete provisioning.
author: craigshoemaker
ms.service: azure-container-apps
ms.topic: troubleshooting
ms.date: 10/09/2026
ms.author: cshoe
---

# Troubleshoot environment capacity errors in Azure Container Apps

When you create a new Azure Container Apps environment, provisioning can fail with a capacity error. The error message includes a link to this article. This article explains why the error occurs, what you can try immediately, and how to plan deployments to reduce the impact of capacity constraints.

## Why the error occurs

The error indicates that the region you selected has limited capacity for the managed infrastructure needed to create your environment. Demand can exceed available capacity even in a region that supports Container Apps.

> [!NOTE]
> Capacity and quota are different. Quota limits how many resources you're allowed to use; capacity determines whether the service can allocate those resources at the time of your request. A quota increase doesn't resolve regional capacity constraints. If the deployment instead reports a quota limit, see [Quotas for Azure Container Apps](quotas.md).

## Recover from a failed provisioning attempt

1. **Confirm the error.** Review the failed deployment's error details. If the message links to this article, follow these steps. Record the target region and the full error message. This guidance applies to environment provisioning capacity errors, not application startup or image pull failures.

1. **Try another supported region.** If your requirements allow, create the environment in another region. Verify that the region supports your required Container Apps features and workload profiles, that you have sufficient quota there, and that your networking, dependencies, and data residency requirements can be met. See [Supported regions](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=container-apps). For an existing workload, see [Relocate Azure Container Apps to another region](relocate-region.md).

1. **Retry later if you must use the same region.** Available capacity can change over time, so a later attempt might succeed. Wait for the current provisioning attempt to finish before retrying. For automated deployments, use a bounded retry policy with increasing delays rather than continuous, rapid retries. There's no guaranteed retry interval or time by which capacity becomes available.

## Plan deployments for capacity flexibility

Use the following practices to give yourself more deployment options. None of them guarantees that a provisioning request succeeds.

### Use multiple regions

Identify at least two regions that can host your workload. When your requirements allow, plan for three or more regions to give yourself more alternatives if one region is constrained. Validate feature availability, quota, latency, data residency, and dependent services in each candidate region before you need to deploy.

For regional redundancy, deploy separate environments and applications in multiple regions, configure traffic routing and failover, and plan data replication for stateful dependencies. Having a list of alternate regions alone doesn't provide failover. See [Custom multiregion solutions for resiliency](/azure/reliability/reliability-container-apps#custom-multiregion-solutions-for-resiliency).

### Provision ahead of schedule

Create and validate your environments before a launch, migration, or other time-sensitive event. Allow time to retry or use an alternate region rather than making environment creation a last-minute dependency.

Creating an environment early doesn't reserve capacity for future scaling. Account for the cost of resources you deploy and the [environment lifecycle policies](environment.md#policies), especially if an environment remains idle. See [Billing in Azure Container Apps](billing.md).

### Try provisioning outside business hours

If your schedule allows, try provisioning outside normal business hours for the target region. For example, try a window between 3:00 AM and 5:00 AM in the target region's local time zone.

Treat this window as an option to try, not a guaranteed period of available capacity. Azure serves global demand, and capacity constraints can persist outside local business hours.

### Evaluate zone redundancy requirements

Zone-redundant environments distribute infrastructure across multiple availability zones within a region. This requirement limits placement flexibility compared with an environment that doesn't require zone redundancy.

If your availability requirements allow, consider creating a new environment without zone redundancy and supplementing it with deployments in other regions. This option might provide more provisioning flexibility, but it doesn't guarantee available capacity.

> [!IMPORTANT]
> Zone redundancy and regional redundancy protect against different failures. A multiregion deployment isn't a like-for-like replacement for zone redundancy within each region. Don't remove required zone protection solely to work around a provisioning error. Review [Reliability in Azure Container Apps](/azure/reliability/reliability-container-apps) before changing your design.

Choose zone redundancy when you create the environment. You can't enable or disable it on an existing environment; a different setting requires a new environment and redeployment of your apps. See [Create a zone-redundant container app](how-to-zone-redundancy.md).

## When to contact support

If provisioning remains blocked after you try the applicable options, or your requirements prevent using another region or a different redundancy configuration, [create an Azure support request](/azure/azure-portal/supportability/how-to-create-azure-support-request) for Container Apps.

Include the subscription ID, resource group, environment name or resource ID, target region, zone redundancy setting, full error message, failed attempt timestamps in UTC, and correlation or operation IDs if available. Describe the retries and alternate regions you tried, along with any deployment deadline or regional requirements.

A support request can help investigate the failure, but it doesn't guarantee immediate capacity allocation. Request a quota increase only if the reported error also identifies a quota limit.

## Related content

- [Quotas for Azure Container Apps](quotas.md)
- [Request quota changes for Azure Container Apps](quota-requests.md)
- [Reliability in Azure Container Apps](/azure/reliability/reliability-container-apps)
