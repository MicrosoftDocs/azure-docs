---
title: AVE Managed Resources
description: Azure Virtual Enclaves Documentation
author: jadean-msft
ms.author: jadean
ms.service: Azure Virtual Enclaves
ms.topic: overview
ms.date: 01/31/2025
---

# Overview
This article describes the resources that are deployed and managed for you when they deploy Virtual Enclave resources like Community, Enclave, Workload, Endpoint, Connection, or Transit Hub. 

## AVE Resources
AVE resources are managed for you so you can focus on your mission or organization needs. This article explains what actions are permitted and prohibited with these resources.

### Create AVE Resources
As described in the other [overview](/docs/overview/overview) articles, you can create the AVE resources using the methods described in those articles including the portal or powershell.

### Moving AVE Resources
Currently, moving AVE resources is not supported.

| Resource type | Resource group | Subscription | Region move |
| ------
---- | ---
------
------
 | ------
-- |
| virtualenclaves | No | No | No |
| communities | No | No | No |
| catalogs | No | No | No |
| internalconnections | No | No | No |
| externalconnections | No | No | No |
| enclaveconnections | No | No | No |

### Deleting AVE Resources
It is best to follow the AVE methods for deleting AVE resources and the managed resources associated with each. For example, don't delete the resource groups managed by AVE. Instead delete the AVE resource which will also delete the AVE managed resource group.
