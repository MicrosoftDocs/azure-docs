---
title: Naming rules and restrictions for Azure Enclave resources
description: Naming rules and restrictions for Azure Enclave resources.
author: jadean-msft
ms.author: jadean
ms.topic: overview
ms.date: 10/23/2026
ms.service: azure-enclave
ai-usage: ai-assisted
---

# Naming rules and restrictions for Azure Enclave resources

This article lists naming requirements for Azure Enclave resources in the `Microsoft.Mission` resource provider. These requirements define allowed characters. The Azure Enclave service validation enforces name length constraints, which can vary by resource type and API version. For naming recommendations for sensitive workloads, see [Considerations for naming Azure Government resources](/azure/azure-government/documentation-government-concept-naming-resources). For general recommendations, see [Recommended naming and tagging conventions](/azure/cloud-adoption-framework/ready/azure-best-practices/naming-and-tagging).

This article lists resources by resource provider namespace. For a list of how resource providers match Azure services, see [Resource providers for Azure services](/azure/azure-resource-manager/management/azure-services-resource-providers).

> [!NOTE]
> 
> Resource and resource group names are case-insensitive unless specifically noted in the valid characters column.
> When using various APIs to retrieve the name for a resource or resource group, the returned value might have different casing than what you originally specified for the name. The returned value might even display different case values than what is listed in the valid characters table.
> Always perform a case-insensitive comparison of names.

In the following table, the term alphanumeric refers to:

- **a** through **z** (lowercase letters)
- **A** through **Z** (uppercase letters)
- **0** through **9** (numbers)

> [!NOTE]
> 
> All resources with a public endpoint can't include reserved words or trademarks in the name. For a list of the blocked words, see [Resolve reserved resource name errors](/azure/azure-resource-manager/troubleshooting/error-reserved-resource-name).

## Azure Enclave resource provider naming rules
The following table shows the resource types and scopes for the Mission Management REST API version `2026-03-01-preview`. The `dedicatedHubs` resource is available starting with API version `2025-11-01-preview`. Name character patterns are consistent across API versions `2025-05-01-preview`, `2025-11-01-preview`, and `2026-03-01-preview`.

The REST API specifications define name character patterns, and the Azure Enclave services enforce length constraints at runtime. The following length values reflect current runtime validation behavior for these resource types.

| Resource type | Scope | Length | Valid characters |
| --- | --- | --- | --- |
| `communities` | Resource group | 3-30 | Alphanumeric characters and hyphens. Start with a letter and end with an alphanumeric character. |
| `communities/communityEndpoints` | Community | 3-64 | Alphanumeric characters, hyphens, and underscores. Start with a letter and end with an alphanumeric character. |
| `communities/dedicatedHubs` | Community | 3-64 | Alphanumeric characters, hyphens, and underscores. Start with a letter and end with an alphanumeric character. |
| `communities/transitHubs` | Community | 3-64 | Alphanumeric characters, hyphens, and underscores. Start with a letter and end with an alphanumeric character. |
| `virtualEnclaves` | Resource group | 3-30 | Alphanumeric characters and hyphens. Start with a letter and end with an alphanumeric character. |
| `virtualEnclaves/enclaveEndpoints` | Enclave | 3-64 | Alphanumeric characters, hyphens, and underscores. Start with a letter and end with an alphanumeric character. |
| `virtualEnclaves/workloads` | Enclave | 3-30 | Alphanumeric characters and hyphens. Start with a letter and end with an alphanumeric character. |
| `enclaveConnections` | Resource group | 3-36 | Alphanumeric characters, hyphens, and underscores. Start with a letter and end with an alphanumeric character. |
