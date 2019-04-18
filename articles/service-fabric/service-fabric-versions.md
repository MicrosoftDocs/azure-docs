---
title: Learn about Azure Service Fabric cluster versions | Microsoft Docs
description: Supported Azure Service Fabric cluster versions
services: service-fabric
documentationcenter: .net
author: aljo-microsoft
manager: chakdan
editor: 

ms.assetid: 
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: troubleshooting
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 9/24/2018
ms.author: aljo

---
# Supported Service Fabric versions

Make sure that your cluster is always running a supported Service Fabric version. As and when we announce the release of a new version of Service Fabric, the previous version is marked for end of support after a minimum of 60 days from that date. The new releases are announced [on the Service Fabric team blog](https://blogs.msdn.microsoft.com/azureservicefabric/).

Refer to the following documents on details on how to keep your cluster running a supported Service Fabric version.

- [Upgrade Service Fabric version on an Azure cluster](service-fabric-cluster-upgrade.md)
- [Upgrade Service Fabric version on a standalone windows server cluster](service-fabric-cluster-upgrade-windows-server.md)

## Supported versions

The following table lists the Service Fabric versions that are supported and their support end dates.

| **Service Fabric runtime in the cluster** | **Can upgrade directly from cluster version** |**Compatible SDK / NuGet Package Versions** | **End of Support Date** |
| --- | --- |--- | --- |
| All cluster versions prior to 5.3.121 | 5.1.158* |Less than or equal to version  2.3 |January 20, 2017 |
| 5.3.* | 5.1.158.* |Less than or equal to version  2.3 |February 24, 2017 |
| 5.4.* | 5.1.158.* |Less than or equal to version  2.4 |May 10,2017       |
| 5.5.* | 5.4.164.* |Less than or equal to version  2.5 |August 10,2017    |
| 5.6.* | 5.4.164.* |Less than or equal to version  2.6 |October 13,2017   |
| 5.7.* | 5.4.164.* |Less than or equal to version  2.7 |December 15,2017  |
| 6.0.* | 5.6.205.* |Less than or equal to version  2.8 |March 30,2018     |
| 6.1.* | 5.7.221.* |Less than or equal to version  3.0 |July 15,2018      |
| 6.2.* | 6.0.232.* |Less than or equal to version  3.1 |October 26,2018   |
| 6.3.* | 6.1.480.* |Less than or equal to version  3.2 |March 31,2019  |
| 6.4.* | 6.2.301.* |Less than or equal to version  3.3 |Current version and so no end date |

## Supported operating systems

 The following table lists the supported operating systems for the supported Service Fabric versions.

| **Operating System** | **Earliest Supported Service Fabric Version** |
| --- | --- |
| Windows Server 2012 R2 | All Versions |
| Windows Server 2016 | All Versions |
| Windows Server 1709 | 6.0 |
| Windows Server 1803 | 6.4 |
| Windows Server 1809 | 6.4.654.9590 |
| Windows Server 2019 | 6.4.654.9590 |
| Linux Ubuntu 16.04 | 6.0 |

