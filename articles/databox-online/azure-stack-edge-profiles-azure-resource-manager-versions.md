---
title: Resource provider API profile versions for Azure Stack Edge | Microsoft Docs
description: Learn about the Azure Resource Manager API versions supported by profiles in Azure Stack Edge.
services: databox
author: v-dalc
ms.service: databox
ms.subservice: edge
ms.custom: devx-track-arm-template
ms.topic: article
ms.date: 05/17/2021
ms.author: alkohli
---

# Resource provider API profile versions for Azure Stack Edge


[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

You can find the resource provider and version numbers for each API profile used by Azure Stack Edge in this article. The tables in this article list the versions supported for each resource provider and the API versions of the profiles. Each resource provider contains a set of resource types and specific version numbers.

The API profile uses three naming conventions:

- **latest**
- **yyyy-mm-dd-hybrid**
- **yyyy-mm-dd-profile**


## Overview of the 2019-03-01-hybrid profile

|Resource Provider                                   |API Version |
|----------------------------------------------------|------------|
|Microsoft.Compute                                   |2017-12-01  |
|Microsoft.Network                                   |2017-10-01<br>VPN Gateway will be 2017-10-01 |
|Microsoft.Storage (Data Plane)                      |2019-07-07  |
|Microsoft.Storage (Control Plane)                   |2019-06-01  |
|Microsoft.Resources (Azure Resource Manager itself) |2020-06-01  |
|Microsoft.Authorization (policy operations)         |2016-09-01  |

For a list of the versions for each resource type for the providers in the API profile, see [Details for the 2019-03-01-hybrid profile](/azure-stack/user/azure-stack-profiles-azure-resource-manager-versions?view=azs-2008&preserve-view=true#details-for-the-2019-03-01-hybrid-profile).

## Details for the 2019-03-01-hybrid profile

### Microsoft.Compute

The Azure Compute APIs give you programmatic access to virtual machines and their supporting resources. For more information, see [Azure Compute](/rest/api/compute/).

|Resource Type               |API Version |
|----------------------------|------------|
|Locations                   |2017-12-01  |
|Locations/vmSizes           |2017-12-01  |
|Virtual Machines            |2017-12-01  |
|Virtual Machines/extensions |2017-12-01  |

### Microsoft.Network

The operations call result is a representation of the available Network cloud operations list. For more information, see [Operation REST API](/rest/api/operation/).

|Resource Types     |API Versions|
|-------------------|------------|
|Network Interfaces |2017-10-01  |
|Virtual Networks   |2017-10-01  |

### Microsoft.Resources

Azure Resource Manager lets you deploy and manage the infrastructure for your Azure solutions. You organize related resources in resource groups and deploy your resources with JSON templates. For an introduction to deploying and managing resources with Resource Manager, see the [Azure Resource Manager overview](../azure-resource-manager/management/overview.md).

|Resource Types                        |API Versions|
|--------------------------------------|------------|
|Deployments                           |2020-06-01  |
|Deployments/operations                |2020-06-01  |
|Links                                 |2020-06-01  |
|Locations                             |2020-06-01  |
|Operations	                           |2020-06-01  |
|Providers                             |2020-06-01  |
|ResourceGroups                        |2020-06-01  |
|Resources	                           |2020-06-01  |
|Subscriptions	                       |2018-09-01  |
|Subscriptions/locations               |2018-09-01  |
|Subscriptions/operationresults        |2020-06-01  |
|Subscriptions/providers               |2020-06-01  |
|Subscriptions/ResourceGroups          |2020-06-01  |
|Subscriptions/resourceGroups/resources|2020-06-01  |
|Subscriptions/resources               |2020-06-01  |
|Subscriptions/tagNames                |2020-06-01  |
|Subscriptions/tagNames/tagValues      |2020-06-01  |
|Tenants                               |2018-09-01  |

### Microsoft.Storage

The Storage Resource Provider (SRP) lets you manage your storage account and keys programmatically. For more information, see the [Azure Storage Resource Provider REST API reference](/rest/api/storagerp/).

|Resource Types       |API Versions|
|---------------------|------------|
|CheckNameAvailability|2019-06-01  |
|Locations            |2019-06-01  |
|Locations/quotas     |2019-06-01  |
|Operations           |2019-06-01  |
|StorageAccounts      |2019-06-01  |
|Usages               |2019-06-01  |

## Next steps

- [Manage an Azure Stack Edge Pro GPU device via Windows PowerShell](azure-stack-edge-gpu-connect-powershell-interface.md)
