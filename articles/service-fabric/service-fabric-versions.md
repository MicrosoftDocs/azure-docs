---
title: Upgrade your Azure Service Fabric cluster version
description: Learn about cluster versions in Azure Service Fabric, including a link to the newest releases from the Service Fabric team blog.

ms.topic: troubleshooting
ms.date: 06/15/2020
---

# Upgrade your Azure Service Fabric cluster version

Make sure your cluster is always running a supported version of Azure Service Fabric. A minimum of 60 days after we announce the release of a new version of Service Fabric, support for the previous version ends. You'll find announcements of new releases on the [Service Fabric team blog](https://azure.microsoft.com/updates/?product=service-fabric).

For each version of the Service Fabric runtime, you can use the specified or older versions of the SDK/NuGet packages. Newer versions of the packages might be unable to target older clusters. Older clusters might have feature or protocol changes that the newer package environments don't support.

Refer to the following articles for details on how to keep your cluster running a supported Service Fabric version:

- [Upgrade an Azure Service Fabric cluster](service-fabric-cluster-upgrade.md)
- [Upgrade the Service Fabric version that runs on your standalone Windows Server cluster](service-fabric-cluster-upgrade-windows-server.md)

## Unsupported versions

### Upgrade alert for versions between 5.7 and 6.3.63.*

To improve security and availability, Azure infrastructure has made a change that might affect Service Fabric customers. This change affects all Service Fabric clusters running versions 5.7 to 6.3.

An update to the Service Fabric runtime is available for all supported Service Fabric versions in all regions. Upgrade to one of the latest supported versions by January 19, 2021, to avoid service disruptions.

If you have a support plan and you need technical help, reach out via Azure support channels. Open a support request for Azure Service Fabric and mention this context in the support ticket.

#### If you don't upgrade to a supported version

Azure Service Fabric clusters that run on versions from 5.7 to 6.3.63.* will be unavailable if you didn't upgrade by January 19, 2021.

#### Required action

Upgrade to a supported Service Fabric version to prevent downtime or loss of functionality related to this change. Ensure that your clusters are running at least the following versions to prevent issues in your environment.

> [!Note]
> **All released versions of 7.2 include the necessary changes**.
  
  | OS | Current Service Fabric runtime in the cluster | CU/Patch release |
  | --- | --- |--- |
  | Windows | 7.0.* | 7.0.478.9590 |
  | Windows | 7.1.* | 7.1.503.9590 |
  | Windows | 7.2.* | 7.2.* |
  | Ubuntu 16 | 7.0.* | 7.0.472.1  |
  | Linux Ubuntu 16.04 | 7.1.* | 7.1.455.1  |
  | Linux Ubuntu 18.04 | 7.1.* | 7.1.455.1804 |
  | Linux Ubuntu 16.04 | 7.2.* | 7.2.* |
  | Linux Ubuntu 18.04 | 7.2.* | 7.2.* |

### Upgrade alert for versions later than 6.3

To improve security and availability, Azure infrastructure has made a change that might affect Service Fabric customers. This change will affect all Service Fabric clusters that use [Open networking mode for containers](./service-fabric-networking-modes.md#set-up-open-networking-mode) and run versions 6.3 to 7.0 or incompatible supported versions later than 7.0. An update to the Service Fabric runtime is available for all supported Service Fabric versions in all regions.

#### If you don't upgrade to a supported version

Azure Service Fabric clusters that run on unchanged versions later than 6.3 will experience loss of functionality or service disruptions if they weren't upgraded to a supported version by January 19, 2021.
  
  - **For clusters running a version of Service Fabric greater than 6.3 NOT using Open Networking feature**, the cluster will remain up.

 - **For clusters running a version of Service Fabric greater than 6.3 and use [Open Networking feature for Containers](./service-fabric-networking-modes.md#set-up-open-networking-mode)** ,the cluster could become unavailable and will cease functioning which could cause service interruptions for your workloads.
 
 -   **For clusters running [Windows Versions between 7.0.457 and 7.0.466 (both versions included) ](#supported-version-names) and the Windows OS has the Windows Containers Feature enabled. NOTE: Linux versions 7.0.457, 7.0.464 and  7.0.465 are NOT  impacted**.
    - **Impact**: The cluster will cease functioning which could cause service interruptions for your workloads.
    
#### Required action

To prevent downtime or loss of functionality, ensure that your clusters are running one of the following versions.

The versions of Service Fabric in the table contain the necessary changes to prevent loss of functionality. Make sure you're using one of these versions.  

> [!Note]
> **Azure Service Fabric clusters running on version 6.5, have to perform multiple upgrades at the same time before infrastucuture change to avoid loss of functionality to the cluster**. 
>   -   1. Upgrade to 7.0.466. **Clusters running the Windows OS that has the Windows Containers Feature enabled CANNOT be on this intermediate version. They need to perform  next step (ii) below.i.e.  Upgrade to be on safer and compliant verion to avoid service disruptions**
>   -   2. Upgrade to latest complaint versions in 7.0* release (7.0.478)  or any of the higher versions listed below.


> [!Note]
> **All release versions of 7.2 include the necessary changes**.

 | OS | Current Service Fabric runtime in the cluster | CU/Patch release |
  | --- | --- |--- |
  | Windows | 7.0.* | 7.0.478.9590 |
  | Windows | 7.1.* | 7.1.503.9590 |
  | Windows | 7.2.* | 7.2.* |
  | Linux Ubuntu 16.04 | 7.0.* | 7.0.472.1  |
  | Linux Ubuntu 16.04 | 7.1.* | 7.1.455.1  |
  | Linux Ubuntu 18.04 | 7.1.* | 7.1.455.1804 |
  | Linux Ubuntu 16.04 | 7.2.* | 7.2.* |
  | Linux Ubuntu 18.04 | 7.2.* | 7.2.* |

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
| 6.5.* | 6.4.617.* |Less than or equal to version  3.4 |August 1, 2020 |
| 7.0.466.* | 6.4.664.* |Less than or equal to version  4.0|January 31, 2021  |
| 7.0.466.* | 6.5.* |Less than or equal to version  4.0|January 31, 2021 |
| 7.0.470.* | 7.0.466.* |Less than or equal to version  4.0 |January 31, 2021  |
| 7.0.472.* | 7.0.466.* |Less than or equal to version  4.0 |January 31, 2021  |
| 7.0.478.* | 7.0.466.* |Less than or equal to version  4.0 |January 31, 2021  |
| 7.1.409.* | 7.0.466.* |Less than or equal to version  4.1 |July 31, 2021 |
| 7.1.417.* | 7.0.466.* |Less than or equal to version  4.1 |July 31, 2021 |
| 7.1.428.* | 7.0.466.* |Less than or equal to version  4.1 |July 31, 2021 |
| 7.1.456.* | 7.0.466.* |Less than or equal to version  4.1 |July 31, 2021 |
| 7.1.458.* | 7.0.466.* |Less than or equal to version  4.1 |July 31, 2021 |
| 7.1.459.* | 7.0.466.* |Less than or equal to version  4.1 |July 31, 2021 |
| 7.1.503.* | 7.0.466.* |Less than or equal to version  4.1 |July 31, 2021 |
| 7.1.510.* | 7.0.466.* |Less than or equal to version  4.1 |July 31, 2021 |
| 7.2.413.* | 7.0.470.* |Less than or equal to version  4.2 |Current version, so no end date |
| 7.2.432.* | 7.0.470.* |Less than or equal to version  4.2 |Current version, so no end date |
| 7.2.433.* | 7.0.470.* |Less than or equal to version  4.2 |Current version, so no end date |
| 7.2.445.* | 7.0.470.* |Less than or equal to version  4.2 |Current version, so no end date |
| 7.2.452.* | 7.0.470.* |Less than or equal to version  4.2 |Current version, so no end date |
| 7.2.457.* | 7.0.470.* |Less than or equal to version  4.2 |Current version, so no end date |
| 7.2.477.* | 7.0.478.* |Less than or equal to version  4.2 |Current version, so no end date |

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
| Linux Ubuntu 18.04 | 7.1 |

## Supported version names

The following table lists the version names of Service Fabric and their corresponding version numbers.

| Version name | Windows version number | Linux version number |
| --- | --- | --- |
| 5.3 RTO | 5.3.121.9494 | Not applicable|
| 5.3 CU1 | 5.3.204.9494 | Not applicable|
| 5.3 CU2 | 5.3.301.9590 | Not applicable|
| 5.3 CU3 | 5.3.311.9590 | Not applicable|
| 5.4 CU2 | 5.4.164.9494 | Not applicable|
| 5.5 CU1 | 5.5.216.0    | Not applicable|
| 5.5 CU2 | 5.5.219.0 | Not applicable|
| 5.5 CU3 | 5.5.227.0 | Not applicable|
| 5.5 CU4 | 5.5.232.0 | Not applicable|
| 5.6 RTO | 5.6.204.9494 | Not applicable|
| 5.6 CU2 | 5.6.210.9494 | Not applicable|
| 5.6 CU3 | 5.6.220.9494 | Not applicable|
| 5.7 RTO | 5.7.198.9494 | Not applicable|
| 5.7 CU4 | 5.7.221.9494 | Not applicable|
| 6.0 RTO | 6.0.211.9494 | 6.0.120.1 |
| 6.0 CU1 | 6.0.219.9494 | 6.0.127.1 |
| 6.0 CU2 | 6.0.232.9494 | 6.0.133.1 |
| 6.1 CU1 | 6.1.456.9494 | 6.1.183.1 |
| 6.1 CU2 | 6.1.467.9494 | 6.1.185.1 |
| 6.1 CU3 | 6.1.472.9494 | Not applicable|
| 6.1 CU4 | 6.1.480.9494 | 6.1.187.1 |
| 6.2 RTO | 6.2.269.9494 | 6.2.184.1 |
| 6.2 CU1 | 6.2.274.9494 | 6.2.191.1 |
| 6.2 CU2 | 6.2.283.9494 | 6.2.194.1 |
| 6.2 CU3 | 6.2.301.9494 | 6.2.199.1 |
| 6.3 RTO | 6.3.162.9494 | 6.3.119.1 |
| 6.3 CU1 | 6.3.176.9494 | 6.3.124.1 |
| 6.3 CU1 | 6.3.187.9494 | 6.3.129.1 |
| 6.4 RTO | 6.4.617.9590 | 6.4.625.1 |
| 6.4 CU2 | 6.4.622.9590 | Not applicable|
| 6.4 CU3 | 6.4.637.9590 | 6.4.634.1 |
| 6.4 CU4 | 6.4.644.9590 | 6.4.639.1 |
| 6.4 CU5 | 6.4.654.9590 | 6.4.649.1 |
| 6.4 CU6 | 6.4.658.9590 | Not applicable|
| 6.4 CU7 | 6.4.664.9590 | 6.4.661.1 |
| 6.4 CU8 | 6.4.670.9590 | Not applicable|
| 6.5 RTO | 6.5.639.9590 | 6.5.435.1 |
| 6.5 CU1 | 6.5.641.9590 | 6.5.454.1 |
| 6.5 CU2 | 6.5.658.9590 | 6.5.460.1 |
| 6.5 CU3 | 6.5.664.9590 | 6.5.466.1 |
| 6.5 CU5 | 6.5.676.9590 | 6.5.467.1 |
| 7.0 RTO | 7.0.457.9590 | 7.0.457.1 |
| 7.0 CU2 | 7.0.464.9590 | 7.0.464.1 |
| 7.0 CU3 | 7.0.466.9590 | 7.0.465.1 |
| 7.0 CU4 | 7.0.470.9590 | 7.0.469.1 |
| 7.0 CU6 | 7.0.472.9590 | 7.0.471.1 |
| 7.0 CU9 | 7.0.478.9590 | 7.0.472.1 |
| 7.1 RTO | 7.1.409.9590 | 7.1.410.1 |
| 7.1 CU1 | 7.1.417.9590 | 7.1.418.1 |
| 7.1 CU2 | 7.1.428.9590 | 7.1.428.1 |
| 7.1 CU3 | 7.1.456.9590 | 7.1.452.1 |
| 7.1 CU5 | 7.1.458.9590 | 7.1.454.1 |
| 7.1 CU6 | 7.1.459.9590 | 7.1.455.1 |
| 7.1 CU8 | 7.1.503.9590 | 7.1.508.1 |
| 7.1 CU10 | 7.1.510.9590 | NA |
| 7.2 RTO | 7.2.413.9590 | NA |
| 7.2 CU2 | 7.2.432.9590 | 7.2.431.1 |
| 7.2 CU3 | 7.2.433.9590 | NA |
| 7.2 CU4 | 7.2.445.9590 | 7.2.447.1 |
| 7.2 CU5 | 7.2.452.9590 | 7.2.454.1 |
| 7.2 CU6 | 7.2.457.9590 | 7.2.456.1 |
| 7.2 CU7 | 7.2.477.9590 | 7.2.476.1 |