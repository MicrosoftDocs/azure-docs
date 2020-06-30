---
title: Security baseline for Azure Resource Graph
description: Security baseline for Azure Resource Graph
author: msmbaldwin
ms.service: security
ms.topic: conceptual
ms.date: 06/30/2020
ms.author: mbaldwin
ms.custom: security-benchmark

# Important: This content is machine generated; do not modify this topic directly. Contact mbaldwin for more information.

---

# Security baseline for Azure Resource Graph

This security baseline applies guidance from the [Azure Security Benchmark](https://docs.microsoft.com/azure/security/benchmarks/overview) to Azure Resource Graph. The Azure Security Benchmark provides recommendations on how you can secure your cloud solutions on Azure. The content is grouped by the **security controls** defined by the Azure Security Benchmark and the related guidance applicable to Azure Resource Graph. **Controls** not applicable to Azure Resource Graph have been excluded. To see how Azure Resource Graph completely maps to the Azure Security Benchmark, see the [full Azure Resource Graph security baseline mapping file](https://github.com/MicrosoftDocs/SecurityBenchmarks/tree/master/spreadsheets/security_baselines).



## Identity and access control

*For more information, see [Security control: Identity and access control](https://docs.microsoft.com/azure/security/benchmarks/security-control-identity-access-control).*

### 3.10: Regularly review and reconcile user access

**Guidance**: Azure Resource Graph provides access to resource types and properties based on role-based access controls (RBAC). Audit and review the access granted to security principals (users, groups, and service accounts) on a regular basis to make sure that queries are returned results for the correct set of resources.

* [Permissions in Azure Resource Graph](https://docs.microsoft.com/azure/governance/resource-graph/overview#permissions-in-azure-resource-graph)

* [How to use Azure Identity Access Reviews](https://docs.microsoft.com/azure/active-directory/governance/access-reviews-overview)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

## Data protection

*For more information, see [Security control: Data protection](https://docs.microsoft.com/azure/security/benchmarks/security-control-data-protection).*

### 4.6: Use Role-based access control to control access to resources

**Guidance**: Use role-based access control (RBAC) to control access to data and resources. To use Azure Resource Graph, you must also have appropriate access to the resources you want to query. This access should be scoped to read only and be only granted to required personnel.

* [Permissions in Azure Resource Graph](https://docs.microsoft.com/azure/governance/resource-graph/overview)

* [How to configure RBAC in Azure](https://docs.microsoft.com/azure/role-based-access-control/role-assignments-rest)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Inventory and asset management

*For more information, see [Security control: Inventory and asset management](https://docs.microsoft.com/azure/security/benchmarks/security-control-inventory-asset-management).*

### 6.1: Use automated Asset Discovery solution

**Guidance**: Use Azure Resource Graph to query and discover all supported resources within your subscriptions and tenants. Ensure you have appropriate permissions in your tenant and are able to enumerate all Azure subscriptions as well as resources within your subscriptions.

* [How to create queries with Azure Resource Graph](https://docs.microsoft.com/azure/governance/resource-graph/first-query-portal)

* [Understand Azure RBAC](https://docs.microsoft.com/azure/role-based-access-control/overview)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.4: Define and Maintainan inventory of approved Azure resources

**Guidance**: Create an inventory of approved Azure resources and approved software for compute resources as per your organizational needs. Use Azure Resource Graph to query for approved Azure resources and Change History (preview) to review snapshots and see what changed.

* [Query Azure resources with Azure Resource Graph](https://docs.microsoft.com/azure/governance/resource-graph/first-query-portal)

* [Get resource changes](https://docs.microsoft.com/azure/governance/resource-graph/how-to/get-resource-changes)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.5: Monitor for unapproved Azure resources

**Guidance**: Use Azure Resource Graph to query and discover resources in your subscriptions and tenants. Make sure that all Azure resources in the environment are approved.

* [Query Azure resources with Azure Resource Graph](https://docs.microsoft.com/azure/governance/resource-graph/first-query-portal)

* [Samples: Starter queries for Azure Resource Graph](https://docs.microsoft.com/azure/governance/resource-graph/samples/starter?tabs=azure-cli)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Next steps

- See the [Azure security benchmark](https://docs.microsoft.com/azure/security/benchmarks/overview)
- Learn more about [Azure security baselines](https://docs.microsoft.com/azure/security/benchmarks/security-baselines-overview)
