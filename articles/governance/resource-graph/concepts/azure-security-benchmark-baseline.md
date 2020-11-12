---
title: Azure Resource Graph security baseline for Azure Security Benchmark
description: The Azure Resource Graph security baseline provides procedural guidance and resources for implementing the security recommendations specified in the Azure Security Benchmark.
author: msmbaldwin
ms.service: resource-graph
ms.topic: conceptual
ms.date: 07/07/2020
ms.author: mbaldwin
ms.custom: subject-security-benchmark

# Important: This content is machine generated; do not modify this topic directly. Contact mbaldwin for more information.

---

# Azure Resource Graph security baseline for Azure Security Benchmark

This security baseline applies guidance from the [Azure Security Benchmark](../../../security/benchmarks/overview.md) to Azure Resource Graph. The Azure Security Benchmark provides recommendations on how you can secure your cloud solutions on Azure. The content is grouped by the **security controls** defined by the Azure Security Benchmark and the related guidance applicable to Azure Resource Graph. **Controls** not applicable to Azure Resource Graph have been excluded. To see how Azure Resource Graph completely maps to the Azure Security Benchmark, see the [full Azure Virtual Network security baseline mapping file](https://github.com/MicrosoftDocs/SecurityBenchmarks/tree/master/Azure%20Offer%20Security%20Baselines).



## Identity and access control

*For more information, see [Security control: Identity and access control](../../../security/benchmarks/security-control-identity-access-control.md).*

### 3.10: Regularly review and reconcile user access

**Guidance**: Azure Resource Graph provides access to resource types and properties based on Azure role-based access control (Azure RBAC). Audit and review the access granted to security principals (users, groups, and service accounts) on a regular basis to make sure that queries return results for the appropriate resources.

* [Permissions in Azure Resource Graph](../overview.md#permissions-in-azure-resource-graph)

* [How to use Azure Identity Access Reviews](../../../active-directory/governance/access-reviews-overview.md)


**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

## Data protection

*For more information, see [Security control: Data protection](../../../security/benchmarks/security-control-data-protection.md).*

### 4.6: Use Azure RBAC to control access to resources

**Guidance**: Use Azure role-based access control (Azure RBAC) to control access to data and resources. To use Azure Resource Graph, you must also have appropriate access to the resources you want to query. This access should be scoped to read only and be only granted to required personnel.

* [Permissions in Azure Resource Graph](../overview.md#permissions-in-azure-resource-graph)

* [How to configure Azure RBAC](../../../role-based-access-control/role-assignments-rest.md)


**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Inventory and asset management

*For more information, see [Security control: Inventory and asset management](../../../security/benchmarks/security-control-inventory-asset-management.md).*

### 6.1: Use automated asset discovery solution

**Guidance**: 
Use Azure Resource Graph to query and discover all supported resources within your subscriptions, management groups, and tenants. Ensure you have appropriate permissions in your tenant and are able to enumerate all Azure subscriptions as well as resources within your subscriptions.

* [How to create queries with Azure Resource Graph](../first-query-portal.md)

* [Understand Azure RBAC](../../../role-based-access-control/overview.md)


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.4: Define and maintain inventory of approved Azure resources

**Guidance**: Create an inventory of approved Azure resources and approved software for compute resources as per your organizational needs. Use Azure Resource Graph to query for approved Azure resources and Change History (preview) to review snapshots and see what changed.

* [Query Azure resources with Azure Resource Graph](../first-query-portal.md)

* [Get resource changes](../how-to/get-resource-changes.md)


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.5: Monitor for unapproved Azure resources

**Guidance**: Use Azure Resource Graph to query and discover resources in your subscriptions, management groups, and tenants. Make sure that all Azure resources in the environment are approved.

* [Query Azure resources with Azure Resource Graph](../first-query-portal.md)

* [Samples: Starter queries for Azure Resource Graph](../samples/starter.md)


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Next steps

- See the [Azure security benchmark](../../../security/benchmarks/overview.md)
- Learn more about [Azure security baselines](../../../security/benchmarks/security-baselines-overview.md)
