---
title: Scalability and performance targets for standard storage accounts
titleSuffix: Azure Storage
description: Learn about scalability and performance targets for standard storage accounts.
services: storage
author: jimmart-dev

ms.service: storage
ms.topic: conceptual
ms.date: 05/25/2022
ms.author: jammart
ms.subservice: common
---

# Scalability and performance targets for standard storage accounts

[!INCLUDE [storage-scalability-intro-include](../../../includes/storage-scalability-intro-include.md)]

The service-level agreement (SLA) for Azure Storage accounts is available at [SLA for Storage Accounts](https://azure.microsoft.com/support/legal/sla/storage/v1_5/).

## Scale targets for standard storage accounts

[!INCLUDE [azure-storage-account-limits-standard](../../../includes/azure-storage-account-limits-standard.md)]

## See also

- [Scalability targets for the Azure Storage resource provider](../common/scalability-targets-resource-provider.md)
- [Azure subscription limits and quotas](../../azure-resource-manager/management/azure-subscription-service-limits.md)
++ To include Default maximum egress for general-purpose v1 for all the regions : 120Gbps
++ Change the Default maximum Ingress for general-purpose v1 for all the regions : 60Gbps in the document it is mentioned as 10 Gbps which in incorrect as per this ICM:https://portal.microsofticm.com/imp/v3/incidents/details/360162422/home
