---
title: Resource provider API versions supported by profiles in Azure Stack Edge | Microsoft Docs
description: Learn about the Azure Resource Manager API versions supported by profiles in Azure Stack Edge.
services: databox
author: v-dalc
ms.service: databox
ms.subservice: edge
ms.topic: article
ms.date: 04/27/2021
ms.author: alkohli
---

# Resource provider API versions supported by profiles in Azure Stack Edge

You can find the resource provider and version numbers for each API profile used by Azure Stack Edge in this article. The tables in this article list the versions supported for each resource provider and the API versions of the profiles. Each resource provider contains a set of resource types and specific version numbers.

The API profile uses three naming conventions:

- **latest**
- **yyyy-mm-dd-hybrid**
- **yyyy-mm-dd-profile**

For an explanation of API profiles and version release cadence for Azure Stack Edge, see [Manage API version profiles in Azure Stack Hub](https://docs.microsoft.com/azure-stack/user/azure-stack-version-profiles?view=azs-2008&preserve-view=true).<!--Article title cites "Hub," not "Edge."-->


## Overview of 2019-03-01-hybrid profile

<!--Intro needed.-->

|Resource types                        |API version|
|--------------------------------------|-----------|
|Deployment/operations<!--Does slash indicate 2 resource types? Throughout.-->|2018-05-01 |
|Links                                 |2018-05-01 |
|Locations                             |2018-05-01 |
|Operations	                           |2018-05-01 |
|Providers                             |2018-05-01 |
|ResourceGroups                        |2018-05-01 |
|Resources	                           |2018-05-01 |
|Subscriptions	                       |2018-05-01 |
|Subscriptions/locations               |2016-06-01 |
|Subscriptions/operationresults        |2018-05-01 |
|Subscriptions/providers               |2018-05-01 |
|Subscriptions/ResourceGroups          |2018-05-01 |
|Subscriptions/resourceGroups/resources|2018-05-01 |
|Subscriptions/resources               |2018-05-01 |
|Subscriptions/tagNames                |2018-05-01 |
|Subscriptions/tagNames/tagValues      |2018-05-01 |
|Tenants                               |2016-06-01 |

## Microsoft.Network

The operations call result is a representation of the available Network cloud operations list. For more information, see [Operation REST API](https://docs.microsoft.com/rest/api/operation/).<!--What is this link expected to provide for the user? It opens an empty "Overview" article with no links to subordinate articles.-->

|Resource type     |API version|
|------------------|-----------|
|Network Interfaces|2017-10-01 |
|Virtual Networks  |2017-10-01 |

## Microsoft Storage

The Storage Resource Provider (SRP) lets you manage your storage account and keys programmatically. For more information, see the [Azure Storage Resource Provider REST API reference](https://docs.microsoft.com/rest/api/storagerp/).

|Resource types       |API versions|
|---------------------|------------|
|CheckNameAvailability|2019-06-01  |
|Locations            |2019-06-01  |
|Locations/quotas     |2019-06-01  |
|Operations           |2019-06-01  |
|StorageAccounts      |2019-06-01  |
|Usages               |2019-06-01  |

## Next steps

- XX