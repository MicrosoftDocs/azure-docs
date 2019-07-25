---
title: Supported cluster versions in Azure Service Fabric | Microsoft Docs
description: Learn about cluster versions in Azure Service Fabric.
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
ms.date: 07/03/2019
ms.author: aljo

---
# Supported Service Fabric versions

Make sure your cluster is always running a supported Azure Service Fabric version. A minimum of 60 days after we announce the release of a new version of Service Fabric, support for the previous version ends. You'll find announcements of new releases on the [Service Fabric team blog](https://blogs.msdn.microsoft.com/azureservicefabric/).

Refer to the following documents for details on how to keep your cluster running a supported Service Fabric version:

- [Upgrade an Azure Service Fabric cluster](service-fabric-cluster-upgrade.md)
- [Upgrade the Service Fabric version that runs on your standalone Windows Server cluster](service-fabric-cluster-upgrade-windows-server.md)

## Supported versions

The following table lists the versions of Service Fabric and their support end dates.

| Service Fabric runtime in the cluster | Can upgrade directly from cluster version |Compatible SDK or NuGet package version | End of support |
| --- | --- |--- | --- |
| All cluster versions before 5.3.121 | 5.1.158.* |Less than or equal to version  2.3 |January 20, 2017 |
| 5.3.* | 5.1.158.* |Less than or equal to version  2.3 |February 24, 2017 |
| 5.4.* | 5.1.158.* |Less than or equal to version  2.4 |May 10, 2017       |
| 5.5.* | 5.4.164.* |Less than or equal to version  2.5 |August 10,2017    |
| 5.6.* | 5.4.164.* |Less than or equal to version  2.6 |October 13,2017   |
| 5.7.* | 5.4.164.* |Less than or equal to version  2.7 |December 15, 2017  |
| 6.0.* | 5.6.205.* |Less than or equal to version  2.8 |March 30, 2018     |
| 6.1.* | 5.7.221.* |Less than or equal to version  3.0 |July 15, 2018      |
| 6.2.* | 6.0.232.* |Less than or equal to version  3.1 |October 26, 2018   |
| 6.3.* | 6.1.480.* |Less than or equal to version  3.2 |March 31, 2019  |
| 6.4.* | 6.2.301.* |Less than or equal to version  3.3 |September 15, 2019 |
| 6.5.* | 6.4.617.* |Less than or equal to version  3.4 |Current version, so no end date |

## Supported operating systems

The following table lists the supported operating systems for the supported Service Fabric versions.

| Operating system | Earliest supported Service Fabric version |
| --- | --- |
| Windows Server 2012 R2 | All versions |
| Windows Server 2016 | All versions |
| Windows Server 1709 | 6.0 |
| Windows Server 1803 | 6.4 |
| Windows Server 1809 | 6.4.654.9590 |
| Windows Server 2019 | 6.4.654.9590 |
| Linux Ubuntu 16.04 | 6.0 |

## Supported version names

The following table lists the version names of Service Fabric and their corresponding version numbers.

| Version name | Windows version number | Linux version number |
| --- | --- | --- |
| 5.3 RTO |	5.3.121.9494 | NA |
| 5.3 CU1 | 5.3.204.9494 | NA |
| 5.3 CU2 | 5.3.301.9590 | NA |
| 5.3 CU3 | 5.3.311.9590 | NA |
| 5.4 CU2 | 5.4.164.9494 | NA |
| 5.5 CU1 | 5.5.216.0    | NA |
| 5.5 CU2 |	5.5.219.0	 | NA |
| 5.5 CU3 | 5.5.227.0	 | NA |
| 5.5 CU4 | 5.5.232.0 	 | NA |
| 5.6 RTO |	5.6.204.9494 | NA |
| 5.6 CU2 | 5.6.210.9494 | NA |
| 5.6 CU3 |	5.6.220.9494 | NA |
| 5.7 RTO | 5.7.198.9494 | NA |
| 5.7 CU4 | 5.7.221.9494 | NA |
| 6.0 RTO | 6.0.211.9494 | 6.0.120.1 |
| 6.0 CU1 | 6.0.219.9494 | 6.0.127.1 |
| 6.0 CU2 | 6.0.232.9494 | 6.0.133.1 |
| 6.1 CU1 | 6.1.456.9494 | 6.1.183.1 |
| 6.1 CU2 | 6.1.467.9494 | 6.1.185.1 |
| 6.1 CU3 | 6.1.472.9494 | NA |
| 6.1 CU4 | 6.1.480.9494 | 6.1.187.1 |
| 6.2 RTO | 6.2.269.9494 | 6.2.184.1 | 
| 6.2 CU1 | 6.2.274.9494 | 6.2.191.1 |
| 6.2 CU2 | 6.2.283.9494 | 6.2.194.1 |
| 6.2 CU3 | 6.2.301.9494 | 6.2.199.1 |
| 6.3 RTO | 6.3.162.9494 | 6.3.119.1 |
| 6.3 CU1 | 6.3.176.9494 | 6.3.124.1 |
| 6.3 CU1 | 6.3.187.9494 | 6.3.129.1 |
| 6.4 RTO | 6.4.617.9590 | 6.4.625.1 |
| 6.4 CU2 | 6.4.622.9590 | NA |
| 6.4 CU3 |	6.4.637.9590 | 6.4.634.1 |
| 6.4 CU4 | 6.4.644.9590 | 6.4.639.1 |
| 6.4 CU5 | 6.4.654.9590 | 6.4.649.1 |
| 6.4 CU6 | 6.4.658.9590 | NA |
| 6.4 CU7 | 6.4.664.9590 | 6.4.661.1 |
| 6.4 CU8 | 6.4.670.9590 | NA |
| 6.5 RTO | 6.5.639.9590 | 6.5.435.1 |
| 6.5 CU1 | 6.5.641.9590 | 6.5.454.1 |