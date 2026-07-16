---
title: Naming rules and restrictions for Azure Enclave resources
description: Naming rules and restrictions for Azure Enclave resources.
author: jadean-msft
ms.author: jadean
ms.topic: overview
ms.date: 9/30/2025
---

# Naming rules and restrictions for Azure Enclave resources

This article summarizes naming rules and restrictions for Azure Enclave resources. There are also other considerations that should be adhered to when naming Azure Enclave resources for sensitive workloads, see [Considerations for naming Azure Government resources](/azure/azure-government/documentation-government-concept-naming-resources). For recommendations about how to name Azure resources, see [Recommended naming and tagging conventions](/azure/cloud-adoption-framework/ready/azure-best-practices/naming-and-tagging).

This article lists resources by resource provider namespace. For a list of how resource providers match Azure services, see [Resource providers for Azure services](/azure/azure-resource-manager/management/azure-services-resource-providers).

> [!NOTE]
> 
> Resource and resource group names are case-insensitive unless specifically noted in the valid characters column.
> When using various APIs to retrieve the name for a resource or resource group, the returned value might have different casing than what you originally specified for the name. The returned value might even display different case values than what is listed in the valid characters table.
> Always perform a case-insensitive comparison of names.

In the following tables, the term alphanumeric refers to:

- **a** through **z** (lowercase letters)
- **A** through **Z** (uppercase letters)
- **0** through **9** (numbers)

> [!NOTE]
> 
> All resources with a public endpoint can't include reserved words or trademarks in the name. For a list of the blocked words, see [Resolve reserved resource name errors](/azure/azure-resource-manager/troubleshooting/error-reserved-resource-name).

## Azure Enclave resource provider naming rules
There are naming rules for each Azure Enclave resource under the `Microsoft.Mission` resource provider.

| Entity | Scope | Length | Valid Characters |
|--|--|--|--|
| communities | Resource group | 3-30 | Alphanumerics and hyphens. Start with a letter and end with alphanumerics. |
| communities/communityEndpoints | community | 3-30 | Alphanumerics and hyphens. Start with a letter and end with alphanumerics.  |
| virtualEnclaves | Resource group | 3-30 | Alphanumerics and hyphens. Start with a letter and end with alphanumerics.  |
| virtualEnclaves/enclaveEndpoints | Enclave | 3-30 | Alphanumerics and hyphens. Start with a letter and end with alphanumerics.  |
| virtualEnclaves/workloads | Enclave & Subscription| 3-30 | Alphanumerics and hyphens. Start with a letter and end with alphanumerics.  |
| enclaveConnections | Resource group | 3-30 | Alphanumerics and hyphens. Start with a letter and end with alphanumerics.  |
| transitHubs | Resource group | 3-30 | Alphanumerics and hyphens. Start with a letter and end with alphanumerics.  |
