---
title: Azure security baseline for Azure Resource Graph
description: The Azure Resource Graph security baseline provides procedural guidance and resources for implementing the security recommendations specified in the Azure Security Benchmark.
author: msmbaldwin
ms.service: resource-graph
ms.topic: conceptual
ms.date: 02/17/2021
ms.author: mbaldwin
ms.custom: subject-security-benchmark

# Important: This content is machine generated; do not modify this topic directly. Contact mbaldwin for more information.

---

# Azure security baseline for Azure Resource Graph

This security
baseline applies guidance from the [Azure Security Benchmark version
1.0](../../../security/benchmarks/overview-v1.md) to Azure Resource Graph. The Azure Security Benchmark
provides recommendations on how you can secure your cloud solutions on Azure.
The content is grouped by the **security controls** defined by the Azure
Security Benchmark and the related guidance applicable to Azure Resource Graph. **Controls** not applicable to Azure Resource Graph have been excluded.

 
To see how Azure Resource Graph completely maps to the Azure
Security Benchmark, see the [full Azure Resource Graph security baseline mapping
file](https://github.com/MicrosoftDocs/SecurityBenchmarks/tree/master/Azure%20Offer%20Security%20Baselines).

## Identity and Access Control

*For more information, see the [Azure Security Benchmark: Identity and Access Control](../../../security/benchmarks/security-control-identity-access-control.md).*

### 3.10: Regularly review and reconcile user access

**Guidance**: Azure Resource Graph provides access to resource types and properties based on Azure role-based access controls (Azure RBAC). Audit and review the access granted to security principals (users, groups, and service accounts) on a regular basis to make sure that queries return results for the appropriate resources.

- [Permissions in Azure Resource Graph](../overview.md#permissions-in-azure-resource-graph)

- [How to use Azure Identity Access Reviews](../../../active-directory/governance/access-reviews-overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Data Protection

*For more information, see the [Azure Security Benchmark: Data Protection](../../../security/benchmarks/security-control-data-protection.md).*

### 4.6: Use Azure RBAC to control access to resources 

**Guidance**: Use Azure RBAC to control access to data and resources. To use Azure Resource Graph, you must also have appropriate access to the resources you want to query. This access should be scoped to read only and be only granted to required personnel.

- [Permissions in Azure Resource Graph](../overview.md#permissions-in-azure-resource-graph)

- [How to configure Azure RBAC](../../../role-based-access-control/role-assignments-rest.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Inventory and Asset Management

*For more information, see the [Azure Security Benchmark: Inventory and Asset Management](../../../security/benchmarks/security-control-inventory-asset-management.md).*

### 6.1: Use automated asset discovery solution

**Guidance**: Use Azure Resource Graph to query and discover all supported resources within your subscriptions, management groups, and tenants. Ensure you have appropriate permissions in your tenant and are able to enumerate all Azure subscriptions as well as resources within your subscriptions.

- [How to create queries with Azure Resource Graph](../first-query-portal.md)

- [Understand Azure RBAC](../../../role-based-access-control/overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.4: Define and maintain inventory of approved Azure resources

**Guidance**: Create an inventory of approved Azure resources and approved software for compute resources as per your organizational needs. Use Azure Resource Graph to query for approved Azure resources and Change History (preview) to review snapshots and see what changed.

- [Query Azure resources with Azure Resource Graph](../first-query-portal.md)

- [Get resource changes](../how-to/get-resource-changes.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.5: Monitor for unapproved Azure resources

**Guidance**: Use Azure Resource Graph to query and discover resources in your subscriptions, management groups, and tenants. Make sure that all Azure resources in the environment are approved.

- [Query Azure resources with Azure Resource Graph](../first-query-portal.md)

- [Samples: Starter queries for Azure Resource Graph](../samples/starter.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Next steps

- See the [Azure Security Benchmark V2 overview](../../../security/benchmarks/overview.md)
- Learn more about [Azure security baselines](../../../security/benchmarks/security-baselines-overview.md)