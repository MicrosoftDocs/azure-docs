---
title: Naming rules and restrictions for Azure Virtual Enclaves resources
description: Naming rules and restrictions for Azure Virtual Enclaves resources
author: jadean-msft
ms.author: jadean
# ms.service: Azure Virtual Enclaves
ms.topic: overview
ms.date: 01/31/2025
---

# Naming rules and restrictions for Azure Virtual Enclaves resources

This article summarizes naming rules and restrictions for Azure Virtual Enclave resources. For recommendations about how to name resources, see [Recommended naming and tagging conventions](../cloud-adoption-framework/ready/azure-best-practices/naming-and-tagging.md).

This article lists resources by resource provider namespace. For a list of how resource providers match Azure services, see [Resource providers for Azure services](../azure-resource-manager/management/azure-services-resource-providers.md).

Note
* Resource and resource group names are case-insensitive unless specifically noted in the valid characters column.
* When using various APIs to retrieve the name for a resource or resource group, the returned value may have different casing than what you originally specified for the name. The returned value may even display different case values than what is listed in the valid characters table.
* Always perform a case-insensitive comparison of names.

In the following tables, the term alphanumeric refers to:

- **a** through **z** (lowercase letters)
- **A** through **Z** (uppercase letters)
- **0** through **9** (numbers)

Note
* All resources with a public endpoint can't include reserved words or trademarks in the name. For a list of the blocked words, see [Resolve reserved resource name errors](../azure-resource-manager/troubleshooting/error-reserved-resource-name.md).

## Microsoft.Mission

| Entity | Scope | Length | Valid Characters |
|--|--|--|--|
| communities | Resource group | 3-30 | Alphanumerics and hyphens. Start with a letter and end with alphanumerics. |
| communities/communityEndpoints | Community | 3-30 | Alphanumerics and hyphens. Start with a letter and end with alphanumerics.  |
| virtualEnclaves | Resource group | 3-30 | Alphanumerics and hyphens. Start with a letter and end with alphanumerics.  |
| virtualEnclaves/enclaveEndpoints | Enclave | 3-30 | Alphanumerics and hyphens. Start with a letter and end with alphanumerics.  |
| virtualEnclaves/workloads | Enclave & Subscription| 3-30 | Alphanumerics and hyphens. Start with a letter and end with alphanumerics.  |
| enclaveConnections | Resource group | 3-30 | Alphanumerics and hyphens. Start with a letter and end with alphanumerics.  |
| transitHubs | Resource group | 3-30 | Alphanumerics and hyphens. Start with a letter and end with alphanumerics.  |
