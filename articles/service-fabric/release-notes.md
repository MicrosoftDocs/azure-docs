---
title: Azure Service Fabric releases
description: Release notes for Azure Service Fabric. Includes information on the latest features and improvements in Service Fabric.
ms.date: 04/24/2023
ms.topic: reference
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
hide_comments: true
hideEdit: true
---

# Service Fabric releases

This article provides more information on the latest releases and updates to the Service Fabric runtime and SDKs.

The following resources are also available:
- <a href="https://github.com/Azure/Service-Fabric-Troubleshooting-Guides" target="blank">Troubleshooting Guides</a> 
- <a href="https://github.com/Azure/service-fabric-issues" target="blank">Issue Tracking</a> 
- <a href="/azure/service-fabric/service-fabric-support" target="blank">Support Options</a> 
- <a href="/azure/service-fabric/service-fabric-versions" target="blank">Supported Versions</a> 
- <a href="https://azure.microsoft.com/resources/samples/?service=service-fabric&sort=0" target="blank">Code Samples</a>

## Service Fabric 10.1

We're excited to announce that the 10.1 release of the Service Fabric runtime has started rolling out to the various Azure regions along with tooling and SDK updates. The updates for .NET SDK, Java SDK, and Service Fabric runtimes can be downloaded from the links provided in Release Notes. The SDK, NuGet packages, and Maven repositories are available in all regions within 7-10 days.

### Key announcements
- Service Fabric runtime defines two client roles - Admin and Client. The Admin role is highly privileged, and undistinguishable from the runtime itself which can be problematic in shared clusters, where all tenants have Admin privileges and can perform unintended destructive operations on the services of another tenant. In this release we are introducing third client role - ElevatedAdmin, which, combined with properly configured Security/ClientAccess section of cluster manifest, can prevent the described scenario.
- Service Fabric now emits a health event visible in SFX/SFE when Sessions are exhausted.
- This allows the weight of InBuild Auxiliary replicas to be set when applied to InBuild throttling. A higher weight means that an InBuild Auxiliary replica will take up more of the InBuild limit, and likewise a lower weight would consume less of the limit, allowing more replicas to be placed InBuild before the limit is reached.

### Service Fabric 10.1 releases
| Release date | Release | More info |
|---|---|---|
| November 1, 2023 | Azure Service Fabric 10.1 Release  | [Release notes](https://github.com/microsoft/service-fabric/blob/master/release_notes/Service_Fabric_ReleaseNotes_101RTO.md) |
| April 1, 2024 | Azure Service Fabric 10.1 Second Refresh Release | [Release notes](https://github.com/microsoft/service-fabric/blob/master/release_notes/Service_Fabric_ReleaseNotes_101CU2.md) |

## Service Fabric 10.0

We're excited to announce that the 10.0 release of the Service Fabric runtime has started rolling out to the various Azure regions along with tooling and SDK updates. The updates for .NET SDK, Java SDK, and Service Fabric runtimes can be downloaded from the links provided in Release Notes. The SDK, NuGet packages, and Maven repositories are available in all regions within 7-10 days.

### Key announcements
- Enhance Container image pruning.
- Balancing of a cluster per node type.
- Expose health check phase and timer for application and cluster upgrade.
- Support ESE.dll version compatibility in the replica building process.
- Enable Lease probes.
- Extend the FabricClient constructor to include "SecurityCredentials" without "HostEndpoints".
- Security audit of cluster management endpoint settings.

### Service Fabric 10.0 releases
| Release date | Release | More info |
|---|---|---|
| September 09, 2023 | Azure Service Fabric 10.0 Release  | [Release notes](https://github.com/microsoft/service-fabric/blob/master/release_notes/Service_Fabric_ReleaseNotes_10.md) |
| November 1, 2023 | Azure Service Fabric 10.0 First Refresh Release  | [Release notes](https://github.com/microsoft/service-fabric/blob/master/release_notes/Service_Fabric_ReleaseNotes_100CU1.md) |
| April 1, 2024 | Azure Service Fabric 10.1 Third Refresh Release | [Release notes](https://github.com/microsoft/service-fabric/blob/master/release_notes/Service_Fabric_ReleaseNotes_100CU3.md) |

## Service Fabric 9.1

We're excited to announce that the 9.1 release of the Service Fabric runtime has started rolling out to the various Azure regions along with tooling and SDK updates. The updates for .NET SDK, Java SDK, and Service Fabric runtimes can be downloaded from the links provided in Release Notes. The SDK, NuGet packages, and Maven repositories are available in all regions within 7-10 days.

### Key announcements
- Azure Service Fabric blocks deployments that don't meet Silver or Gold durability requirements starting on 11/10/2022 (The date is extended from 10/30/2022 to 11/10/2022). Five VMs or more will be enforced with this change for newer clusters created after 11/10/2022 to help avoid data loss from VM-level infrastructure requests for production workloads. VM count requirement isn't changing for Bronze durability. Enforcement for existing clusters will be rolled out in the coming months.
- Azure Service Fabric node types with Virtual Machine Scale Set durability of Silver or Gold should always have the property "virtualMachineProfile.osProfile.windowsConfiguration.enableAutomaticUpdates" set to false in the scale set model definition. Setting enableAutomaticUpdates to false will prevent unintended OS restarts due to the Windows updates like patching, which can impact the production workloads.
Instead, you should enable Automatic OS upgrades through Virtual Machine Scale Set OS Image updates by setting "enableAutomaticOSUpgrade" to true. With automatic OS image upgrades enabled on your scale set, an extra patching process through Windows Update isn't required.
- Starting 9.1.1436.9590, Service Fabric Runtime provides a configuration on Linux and Windows called "Setup/BlockAccessToWireServer" to allow the runtime deployer to set up Access Control Lists (ACLs) on the Virtual Machine (VM) to prevent access from containers to the wire server. These ACLs are kept in sync during new cluster creation/upgrade and VM/SF node restart scenarios.

### Service Fabric 9.1 releases
| Release date | Release | More info |
|---|---|---|
| October 24, 2022 | [Azure Service Fabric 9.1](https://techcommunity.microsoft.com/t5/azure-service-fabric-blog/microsoft-azure-service-fabric-9-1-release/ba-p/3667628)  | [Release notes](https://github.com/microsoft/service-fabric/blob/master/release_notes/Service_Fabric_ReleaseNotes_91.md) |
| December 8, 2022 | [Azure Service Fabric 9.1 First Refresh Release](https://techcommunity.microsoft.com/t5/azure-service-fabric-blog/azure-service-fabric-9-1-first-refresh-is-now-available/ba-p/3698646)  | [Release notes](https://github.com/microsoft/service-fabric/blob/master/release_notes/Service_Fabric_ReleaseNotes_91CU1.md) |
| March 1, 2023 | Azure Service Fabric 9.1 Second Refresh Release  | [Release notes](https://github.com/microsoft/service-fabric/blob/master/release_notes/Service_Fabric_ReleaseNotes_91CU2.md) |
| April 6, 2023 | Azure Service Fabric 9.1 Third Refresh Release  | [Release notes](https://github.com/microsoft/service-fabric/blob/master/release_notes/Service_Fabric_ReleaseNotes_91CU3.md) |
| May 15, 2023 | Azure Service Fabric 9.1 Fourth Refresh Release  | [Release notes](https://github.com/microsoft/service-fabric/blob/master/release_notes/Service_Fabric_ReleaseNotes_91CU4.md) |
| June 19, 2023 | Azure Service Fabric 9.1 Fifth Refresh Release  | [Release notes](https://github.com/microsoft/service-fabric/blob/master/release_notes/Service_Fabric_ReleaseNotes_91CU5.md) |
| August 30, 2023 | Azure Service Fabric 9.1 Sixth Refresh Release  | [Release notes](https://github.com/microsoft/service-fabric/blob/master/release_notes/Service_Fabric_ReleaseNotes_91CU6.md) |
| November 1, 2023 | Azure Service Fabric 9.1 Seventh Refresh Release  | [Release notes](https://github.com/microsoft/service-fabric/blob/master/release_notes/Service_Fabric_ReleaseNotes_91CU7.md) |
| April 1, 2024 | Azure Service Fabric 9.1 Ninth Refresh Release  | [Release notes](https://github.com/microsoft/service-fabric/blob/master/release_notes/Service_Fabric_ReleaseNotes_91CU9.md) |

## Service Fabric 9.0

We're excited to announce that 9.0 release of the Service Fabric runtime has started rolling out to the various Azure regions along with tooling and SDK updates. The updates for .NET SDK, Java SDK and Service Fabric runtime are available through Web Platform Installer, NuGet packages and Maven repositories.

### Key announcements
- **General Availability** Support for .NET 6.0
- **General Availability** Support for Ubuntu 20.04
- **General Availability** Support for Multi-AZ within a single Virtual Machine Scale Set
- Added support for IHost, IHostBuilder and Minimal Hosting Model
- Enabling opt-in option for Data Contract Serialization (DCS) based remoting exception
- Support creation of End-to-End Developer Experience for Linux development on Windows using WSL2
- Support for parallel recursive queries to Service Fabric DNS Service
- Support for Managed KeyVaultReference
- Expose Container ID for currently deployed code packages
- Added Fabric_InstanceId environment variable for stateless guest applications
- Exposed API for reporting MoveCost
- Enforce a configurable Max value on the InstanceCloseDelayDuration
- Added ability to enumerate actor reminders
- Made updates to platform events
- Introduced a property in Service Fabric runtime that can be set via SFRP as the ARM resource ID
- Exposed application type provision timestamp
- Support added for Service Fabric Resource Provider (SFRP) metadata to application type + version entities, starting with ARM resource ID
- Windows Server 2022 is now supported as of the 9.0 CU2 release.
- Mirantis Container runtime support on Windows for Service Fabric containers
- The Microsoft Web Platform Installer (WebPI) used for installing Service Fabric SDK and Tools was retired on July 1, 2022.
- Azure Service Fabric blocks deployments that don't meet Silver or Gold durability requirements starting on 9/30/2022. 5 VMs or more will be enforced with this change to help avoid data loss from VM-level    infrastructure requests for production workloads. Enforcement for existing clusters will be rolled out in the coming months.
- Azure Service Fabric node types with Virtual Machine Scale Set durability of Silver or Gold should always have Windows update explicitly disabled to avoid unintended OS restarts due to the Windows updates, which can impact the production workloads. This can be done by setting the "enableAutomaticUpdates": false, in the Virtual Machine Scale Set OSProfile. Consider enabling Automatic Virtual Machine Scale Set Image upgrades instead. The deployments will start failing from 09/30/2022 for new clusters, if the WindowsUpdates aren't disabled on the Virtual Machine Scale Set. Enforcement for existing clusters will be rolled out in the coming months.

### Service Fabric 9.0 releases
| Release date | Release | More info |
|---|---|---|
| April 29, 2022 | [Azure Service Fabric 9.0](https://techcommunity.microsoft.com/t5/azure-service-fabric-blog/azure-service-fabric-9-0-release/ba-p/3299108)  | [Release notes](https://github.com/microsoft/service-fabric/blob/master/release_notes/Service_Fabric_ReleaseNotes_90.md) |
| June 06, 2022 | [Azure Service Fabric 9.0 First Refresh Release](https://techcommunity.microsoft.com/t5/azure-service-fabric-blog/microsoft-azure-service-fabric-9-0-first-refresh-release/ba-p/3469489)  | [Release notes](https://github.com/microsoft/service-fabric/blob/master/release_notes/Service_Fabric_ReleaseNotes_90CU1.md) |
| July 14, 2022 | [Azure Service Fabric 9.0 Second Refresh Release](https://techcommunity.microsoft.com/t5/azure-service-fabric-blog/microsoft-azure-service-fabric-9-0-second-refresh-release/ba-p/3575842)  | [Release notes](https://github.com/microsoft/service-fabric/blob/master/release_notes/Service_Fabric_ReleaseNotes_90CU2.md) |
| September 13, 2022 | [Azure Service Fabric 9.0 Third Refresh Release](https://techcommunity.microsoft.com/t5/azure-service-fabric-blog/microsoft-azure-service-fabric-9-0-third-refresh-update-release/ba-p/3631367)  | [Release notes](https://github.com/microsoft/service-fabric/blob/master/release_notes/Service_Fabric_ReleaseNotes_90CU3.md) |
| October 11, 2022 | [Azure Service Fabric 9.0 Fourth Refresh Release](https://techcommunity.microsoft.com/t5/azure-service-fabric-blog/microsoft-azure-service-fabric-9-0-fourth-refresh-update-release/ba-p/3658429)  | [Release notes](https://github.com/microsoft/service-fabric/blob/master/release_notes/Service_Fabric_ReleaseNotes_90CU4.md) |
| December 8, 2022 | [Azure Service Fabric 9.0 Fifth Refresh Release](https://techcommunity.microsoft.com/t5/azure-service-fabric-blog/azure-service-fabric-9-0-fifth-refresh-is-now-available/ba-p/3698661)  | [Release notes](https://github.com/microsoft/service-fabric/blob/master/release_notes/Service_Fabric_ReleaseNotes_90CU5.md) |
| March 1, 2023 | Azure Service Fabric 9.0 Seventh Refresh Release  | [Release notes](https://github.com/microsoft/service-fabric/blob/master/release_notes/Service_Fabric_ReleaseNotes_90CU7.md) |
| April 6, 2023 | Azure Service Fabric 9.0 Eighth Refresh Release  | [Release notes](https://github.com/microsoft/service-fabric/blob/master/release_notes/Service_Fabric_ReleaseNotes_90CU8.md) |
| May 15, 2023 | Azure Service Fabric 9.0 Ninth Refresh Release  | [Release notes](https://github.com/microsoft/service-fabric/blob/master/release_notes/Service_Fabric_ReleaseNotes_90CU9.md) |
| November 1, 2023 | Azure Service Fabric 9.0 Twelfth Refresh Release  | [Release notes](https://github.com/microsoft/service-fabric/blob/master/release_notes/Service_Fabric_ReleaseNotes_90CU12.md) |

## Service Fabric 8.2

We're excited to announce that 8.2 release of the Service Fabric runtime has started rolling out to the various Azure regions along with tooling and SDK updates. The updates for .NET SDK, Java SDK and Service Fabric runtime are available through Web Platform Installer, NuGet packages and Maven repositories.

### Key announcements
- Expose an API in Cluster Manager to note if upgrade is impactful
- Azure Service Fabric blocks deployments that don't meet Silver or Gold durability requirements starting on 11/10/2022 (The date is extended from 10/30/2022 to 11/10/2022). Five VMs or more will be enforced with this change for newer clusters created after 11/10/2022 to help avoid data loss from VM-level infrastructure requests for production workloads. VM count requirement isn't changing for Bronze durability. Enforcement for existing clusters will be rolled out in the coming months.
- Azure Service Fabric node types with Virtual Machine Scale Set durability of Silver or Gold should always have the property "virtualMachineProfile.osProfile.windowsConfiguration.enableAutomaticUpdates" set to false in the scale set model definition. Setting enableAutomaticUpdates to false will prevent unintended OS restarts due to the Windows updates like patching, which can impact the production workloads.
Instead, you should enable Automatic OS upgrades through Virtual Machine Scale Set OS Image updates by setting "enableAutomaticOSUpgrade" to true. With automatic OS image upgrades enabled on your scale set, an extra patching process through Windows Update isn't required.

### Service Fabric 8.2 releases
| Release date | Release | More info |
|---|---|---|
| October 29, 2021 | [Azure Service Fabric 8.2](https://techcommunity.microsoft.com/t5/azure-service-fabric/azure-service-fabric-8-2-release/ba-p/2895108)  | [Release notes](https://github.com/microsoft/service-fabric/blob/master/release_notes/Service_Fabric_ReleaseNotes_82.md)|
| December 16, 2021 | [Azure Service Fabric 8.2 First Refresh Release](https://techcommunity.microsoft.com/t5/azure-service-fabric-blog/azure-service-fabric-8-2-first-refresh-release/ba-p/3040415)  | [Release notes](https://github.com/microsoft/service-fabric/blob/master/release_notes/Service_Fabric_ReleaseNotes_82CU1.md)|
| February 12, 2022 | [Azure Service Fabric 8.2 Second Refresh Release](https://techcommunity.microsoft.com/t5/azure-service-fabric-blog/azure-service-fabric-8-2-second-refresh-release/ba-p/3095454)  | [Release notes](https://github.com/microsoft/service-fabric/blob/master/release_notes/Service_Fabric_ReleaseNotes_82CU2.md)|
| June 06, 2022 | [Azure Service Fabric 8.2 Third Refresh Release](https://techcommunity.microsoft.com/t5/azure-service-fabric-blog/azure-service-fabric-8-2-third-refresh-release/ba-p/3469508)  | [Release notes](https://github.com/microsoft/service-fabric/blob/master/release_notes/Service_Fabric_ReleaseNotes_82CU3.md)|
| July 14, 2022 | [Azure Service Fabric 8.2 Fourth Refresh Release](https://techcommunity.microsoft.com/t5/azure-service-fabric-blog/microsoft-azure-service-fabric-8-2-fourth-refresh-release/ba-p/3575845)  | [Release notes](https://github.com/microsoft/service-fabric/blob/master/release_notes/Service_Fabric_ReleaseNotes_82CU4.md)|
| October 11, 2022 | [Azure Service Fabric 8.2 Sixth Refresh Release](https://techcommunity.microsoft.com/t5/azure-service-fabric-blog/microsoft-azure-service-fabric-8-2-sixth-refresh-release/ba-p/3666852)  | [Release notes](https://github.com/microsoft/service-fabric/blob/master/release_notes/Service_Fabric_ReleaseNotes_82CU6.md)|
| October 24, 2022 | [Azure Service Fabric 8.2 Seventh Refresh Release](https://techcommunity.microsoft.com/t5/azure-service-fabric-blog/azure-service-fabric-8-2-seventh-refresh-is-now-available/ba-p/3666872)  | [Release notes](https://github.com/microsoft/service-fabric/blob/master/release_notes/Service_Fabric_ReleaseNotes_82CU7.md)|
| March 1, 2023 | Azure Service Fabric 8.2 Ninth Refresh Release  | [Release notes](https://github.com/microsoft/service-fabric/blob/master/release_notes/Service_Fabric_ReleaseNotes_82CU9.md)|


## Service Fabric 8.1

We're excited to announce that 8.1 release of the Service Fabric runtime has started rolling out to the various Azure regions along with tooling and SDK updates. The updates for .NET SDK, Java SDK and Service Fabric runtime are available through Web Platform Installer, NuGet packages and Maven repositories.

### Key announcements
- Added support for Auxiliary Replica
- **Preview** Added support for .NET 6.0 Service Fabric applications
- Added API support for updating application descriptions
- Added periodic ping between Reconfiguration Agent (RA) and Reconfiguration Agent Proxy (RAP) to detect IPC failure and process stuck
- Added support for liveness and readiness probes for non containerized applications
- Made cluster upgrade for node capacity updates impactless

### Service Fabric 8.1 releases
| Release date | Release | More info |
|---|---|---|
| July 28, 2021 | [Azure Service Fabric 8.1](https://techcommunity.microsoft.com/t5/azure-service-fabric/azure-service-fabric-8-1-release/ba-p/2594194)  | [Release notes](https://github.com/microsoft/service-fabric/blob/master/release_notes/Service_Fabric_ReleaseNotes_81.md)|
| August 13, 2021 | [Azure Service Fabric 8.1 First Refresh Release](https://techcommunity.microsoft.com/t5/azure-service-fabric/azure-service-fabric-8-1-first-refresh-release/ba-p/2638798) | [Release notes](https://github.com/microsoft/service-fabric/blob/master/release_notes/Service_Fabric_ReleaseNotes_81CU1.md) |
| September 09, 2021 | [Azure Service Fabric 8.1 Second Refresh Release](https://techcommunity.microsoft.com/t5/azure-service-fabric/azure-service-fabric-8-1-second-refresh-release/ba-p/2734904) | [Release notes](https://github.com/microsoft/service-fabric/blob/master/release_notes/Service_Fabric_ReleaseNotes_81CU2.md) |
| October 06 2021 | [Azure Service Fabric 8.1 Third Refresh Release](https://techcommunity.microsoft.com/t5/azure-service-fabric/azure-service-fabric-8-1-third-refresh-release/ba-p/2816117) | [Release notes](https://github.com/microsoft/service-fabric/blob/master/release_notes/Service_Fabric_ReleaseNotes_81CU3.md) |



## Service Fabric 8.0

We are excited to announce that 8.0 release of the Service Fabric runtime has started rolling out to the various Azure regions along with tooling and SDK updates. The updates for .NET SDK, Java SDK and Service Fabric runtime are available through Web Platform Installer, NuGet packages and Maven repositories.

### Key announcements

- **General Availability** of support for .NET 5 for Windows
- **General Availability** of [Stateless NodeTypes](./service-fabric-stateless-node-types.md)
- Ability to move stateless service instances
- Ability to add parameterized DefaultLoad in the application manifest
- For singleton replica upgrades - ability to have some of the cluster level settings to be defined at an application level
- Ability for smart placement based on node tags
- Ability to define percentage threshold of unhealthy nodes that influence cluster health
- Ability to query top loaded services
- Ability to add a new interval for new error codes
- Capability to mark service instance as completed
- Support for wave-based deployment model for automatic upgrades
- Added readiness probe for containerized applications
- Enable UseSeparateSecondaryMoveCost to true by default
- Fixed StateManager to release the reference as soon as safe to release
- Block Central Secret Service removal while storing user secrets

### Service Fabric 8.0 releases
| Release date | Release | More info |
|---|---|---|
| April 08, 2021 | [Azure Service Fabric 8.0](https://techcommunity.microsoft.com/t5/azure-service-fabric/azure-service-fabric-8-0-release/ba-p/2260016)  | [Release notes](https://github.com/microsoft/service-fabric/blob/master/release_notes/Service_Fabric_ReleaseNotes_80.md)|
| May 17, 2021 | [Azure Service Fabric 8.0 First Refresh Release](https://techcommunity.microsoft.com/t5/azure-service-fabric/azure-service-fabric-8-0-first-refresh-release/ba-p/2362556) | [Release notes](https://github.com/microsoft/service-fabric/blob/master/release_notes/Service_Fabric_ReleaseNotes_80CU1.md) |
| June 17, 2021 | [Azure Service Fabric 8.0 Second Refresh Release](https://techcommunity.microsoft.com/t5/azure-service-fabric/azure-service-fabric-8-0-second-refresh-release/ba-p/2462979) | [Release notes](https://github.com/microsoft/service-fabric/blob/master/release_notes/Service_Fabric_ReleaseNotes_80CU2.md) |
| July 28, 2021 | [Azure Service Fabric 8.0 Third Refresh Release](https://techcommunity.microsoft.com/t5/azure-service-fabric/azure-service-fabric-8-0-third-refresh-release/ba-p/2594180) | [Release notes](https://github.com/microsoft/service-fabric/blob/master/release_notes/Service_Fabric_ReleaseNotes_80CU3.md) |


## Previous versions

### Service Fabric 7.2

#### Key announcements

- **Preview**: [**Service Fabric managed clusters**](https://techcommunity.microsoft.com/t5/azure-service-fabric/azure-service-fabric-managed-clusters-are-now-in-public-preview/ba-p/1721572) are now in public preview. Service Fabric managed clusters aim to simplify cluster deployment and management by encapsulating the underlying resources that make up a Service Fabric cluster into a single ARM resource. For more information see, [Service Fabric managed cluster overview](./overview-managed-cluster.md).
- **Preview**: [**Supporting stateless services with a number of instances greater than the number of nodes**](./service-fabric-cluster-resource-manager-advanced-placement-rules-placement-policies.md) is now in public preview. A placement policy enables the creation of multiple stateless instances of a partition on a node.
- [**FabricObserver (FO) 3.0**](https://aka.ms/sf/fabricobserver) is now available.
    - You can now run FabricObserver in Linux and Windows clusters.
    - You can now build custom observer plugins. See [plugins readme](https://github.com/microsoft/service-fabric-observer/blob/master/Documentation/Plugins.md) and the [sample plugin project](https://github.com/microsoft/service-fabric-observer/tree/master/SampleObserverPlugin) for details and code.
    - You can now change any observer setting via application parameters upgrade. This means you no longer need to redeploy FO to modify specific observer settings. See the [sample](https://github.com/microsoft/service-fabric-observer/blob/master/Documentation/Using.md#parameterUpdates).
- [**Support for Ubuntu 18.04 OneBox container images**](https://hub.docker.com/_/microsoft-service-fabric-onebox).
- **Preview**: [**KeyVault Reference for Service Fabric applications supports **ONLY versioned secrets**. Secrets without versions are not supported.**](./service-fabric-keyvault-references.md)
- SF SDK requires the latest VS 2019 update 16.7.6 or 16.8 Preview 4 to be able create new .NET Framework stateless/stateful/actors projects. If you don't have the latest VS update, after creating the service project, use package manager to install Microsoft.ServiceFabric.Services (version 4.2.x) for stateful/stateless projects and Microsoft.ServiceFabric.Actors (version 4.2.x) for actor projects from nuget.org.
- **RunToCompletion**: Service Fabric supports concept of run to completion for guest executables. With this update once the replica runs to completion, the cluster resources allocated to this replica will be released.
- [**Resource governance support has been enhanced**](./service-fabric-resource-governance.md): allowing requests and limits specifications for cpu and memory resources.

#### Service Fabric 7.2 releases
| Release date | Release | More info |
|---|---|---|
| October 21, 2020 | [Azure Service Fabric 7.2](https://techcommunity.microsoft.com/t5/azure-service-fabric/azure-service-fabric-7-2-release/ba-p/1805653)  | [Release notes](https://github.com/microsoft/service-fabric/blob/master/release_notes/Service-Fabric-72-releasenotes.md)|
| November 9, 2020 | [Azure Service Fabric 7.2 Second Refresh Release](https://techcommunity.microsoft.com/t5/azure-service-fabric/azure-service-fabric-7-2-second-refresh-release/ba-p/1874738) | [Release notes](https://github.com/microsoft/service-fabric/blob/master/release_notes/Service-Fabric-72CU2-releasenotes.md) |
| November 10, 2020  | Azure Service Fabric 7.2 Third Refresh Release | [Release notes](https://github.com/microsoft/service-fabric/blob/master/release_notes/Service-Fabric-72CU3-releasenotes.md) |
| December 2, 2020 | [Azure Service Fabric 7.2 Fourth Refresh Release](https://techcommunity.microsoft.com/t5/azure-service-fabric/azure-service-fabric-7-2-fourth-refresh-release/ba-p/1950584) | [Release notes](https://github.com/microsoft/service-fabric/blob/master/release_notes/Service-Fabric-72CU4.md)
| January 25, 2021 | [Azure Service Fabric 7.2 Fifth Refresh Release](https://techcommunity.microsoft.com/t5/azure-service-fabric/azure-service-fabric-7-2-fifth-refresh-release/ba-p/2096575) | [Release notes](https://github.com/microsoft/service-fabric/blob/master/release_notes/Service-Fabric-72CU5-ReleaseNotes.md)
| February 17, 2021 | [Azure Service Fabric 7.2 Sixth Refresh Release](https://techcommunity.microsoft.com/t5/azure-service-fabric/azure-service-fabric-sixth-refresh-release/ba-p/2144685) | [Release notes](https://github.com/microsoft/service-fabric/blob/master/release_notes/Service-Fabric-72CU6-ReleaseNotes.md)
| March 10, 2021 | [Azure Service Fabric 7.2 Seventh Refresh Release](https://techcommunity.microsoft.com/t5/azure-service-fabric/azure-service-fabric-seventh-refresh-release/ba-p/2201100) | [Release notes](https://github.com/microsoft/service-fabric/blob/master/release_notes/Service-Fabric-72CU7-releasenotes.md)


### Service Fabric 7.1

Due to the current COVID-19 crisis, and taking into consideration the challenges faced by our customers, we're making 7.1 available, but won't automatically upgrade clusters set to receive automatic upgrades. We're pausing automatic upgrades until further notice to ensure that customers can apply upgrades when most appropriate for them, to avoid unexpected disruptions.

You're able to update to 7.1 via through the [Azure portal](./service-fabric-cluster-upgrade-version-azure.md#manual-upgrades-with-azure-portal) or via an [Azure Resource Manager deployment](./service-fabric-cluster-upgrade-version-azure.md#resource-manager-template).

Service Fabric clusters with automatic upgrades enabled will begin to receive the 7.1 update automatically once we resume the standard rollout procedure. We provide another announcement before the standard rollout begins on the [Service Fabric Tech Community Site](https://techcommunity.microsoft.com/t5/azure-service-fabric/bg-p/Service-Fabric).
We also have published updates to end of support date for major releases starting from 6.5 up to 7.1 [here](./service-fabric-versions.md). 

#### Key announcements

- **General Availability** of [**Service Fabric Managed Identities for Service Fabric applications**](./concepts-managed-identity.md)
- [**Support for Ubuntu 18.04**](./service-fabric-tutorial-create-vnet-and-linux-cluster.md)
 - [**Preview: Virtual machine scale set Ephemeral OS disk support**](./service-fabric-cluster-azure-deployment-preparation.md#use-ephemeral-os-disks-for-virtual-machine-scale-sets)**: Ephemeral OS disks are storage created on the local virtual machine, and not saved to remote Azure Storage. They're recommended for all Service Fabric node types (Primary and Secondary), because compared to traditional persistent OS disks, ephemeral OS disks:
      -  Reduce read/write latency to OS disk
      -  Enable faster reset/re-image node management operations
      -  Reduce overall costs (the disks are free and incur no extra storage cost)
- Support for declaration of [**Service Endpoint certificates of Service Fabric applications by subject common name**](./service-fabric-service-manifest-resources.md).
- [**Support for Health Probes for containerized services**](./probes-codepackage.md): Support for Liveness Probe mechanism for containerized applications. Liveness Probe help announce the liveness of the containerized application and when they don't respond in a timely fashion, it results in a restart. 
- [**Support for Initializer Code Packages**](./initializer-codepackages.md) for [containers](./service-fabric-containers-overview.md) and [guest executable](./service-fabric-guest-executables-introduction.md) applications. This allows executing Code Packages (for example, containers), in a specified order, to perform Service Package initialization.
- **FabricObserver and ClusterObserver** are stateless applications that capture Service Fabric Telemetry related to different aspects of an SF cluster. Both these applications are ready for deployment to Windows production clusters to capture rich telemetry with implemented support for ApplicationInsights, EventSource and LogAnalytics.
    - [**FabricObserver (FO) 2.0**](https://github.com/microsoft/service-fabric-observer)- runs on all nodes, generates health events, emits telemetry when user configured resource usage thresholds are reached. This release contains several enhancements across monitoring, data management, health event details, structured telemetry.
     - [**ClusterObserver (CO) 1.1**](https://github.com/microsoft/service-fabric-observer/tree/master/ClusterObserver) - runs on one node, captures cluster level health telemetry. In this release, ClusterObserver also monitors node status and emits telemetry when node is down/disabling/disabled  for longer than user-specified time period.

#### Improve application life cycle experience

- **[Preview:Request drain](./service-fabric-application-upgrade-advanced.md#avoid-connection-drops-during-stateless-service-planned-downtime)**: During planned service maintenance, such as service upgrades or node deactivation, you would like to allow the  services to gracefully drain connections. This feature adds an instance close delay duration in the service configuration. During planned operations, SF removes the Service's address from discovery and then waits this duration before shutting down the service.
- **[Automatic Subcluster Detection and Balancing](./cluster-resource-manager-subclustering.md)**: Subclustering happens when services with different placement constraints have a common [load metric](./service-fabric-cluster-resource-manager-metrics.md). If the load on the different sets of nodes differs significantly, the Service Fabric Cluster Resource Manager believes that the cluster is imbalanced, even when it has the best possible balance because of the placement constraints. As a result, it attempts to rebalance the cluster, potentially causing unnecessary service movements (since the "imbalance" can't be substantially improved). The Cluster Resource Manager will now attempt to automatically detect these sorts of configurations and understand when the imbalance can be fixed through movement, and when instead it should leave things alone since no substantial improvement can be made.  
- [**Different Move cost for secondary replicas**](./service-fabric-cluster-resource-manager-movement-cost.md): We have introduced new move cost value VeryHigh that provides more flexibility in some scenarios to define if a separate move cost should be used for secondary replicas.
- Enabled [**Liveness Probe**](./probes-codepackage.md) mechanism for containerized applications. Liveness Probe help announce the liveness of the containerized application and when they don't respond in a timely fashion, it results in a restart.
- [**Run to completion/once for services**](./run-to-completion.md)**

#### Image Store improvements
 - Service Fabric 7.1 uses **custom transport to secure file transfer between nodes by default**. The dependency on SMB file share is removed from the version 7.1. The secured SMB file shares still exist on nodes that contain Image Store Service replica for customer's choice to opt out from default and for upgrade and downgrade to old version.
       
 #### Reliable Collections improvements

- [**In memory only store support for stateful services using Reliable Collections**](./service-fabric-work-with-reliable-collections.md#volatile-reliable-collections): Volatile Reliable Collections allows data to be persisted to disk for durability against large-scale outages, can be used for workloads like replicated cache, for example, where occasional data loss can be tolerated. Based on the [limitations and restrictions of Volatile Reliable Collections](./service-fabric-reliable-services-reliable-collections-guidelines.md#additional-guidelines-for-volatile-reliable-collections), we recommend this for workloads that don't need persistence, for services that handle the rare occasions of Quorum Loss.
- [**Preview: Service Fabric Backup Explorer**](https://github.com/microsoft/service-fabric-backup-explorer): To ease management of Reliable Collections backups for Service Fabric Stateful applications, Service Fabric Backup Explorer enables users to
    - Audit and review the contents of the Reliable Collections,
    - Update current state to a consistent view
    - Create Backup of the current snapshot of the Reliable Collections
    - Fix data corruption
                 
#### Service Fabric 7.1 releases
| Release date | Release | More info |
|---|---|---|
| April 20, 2020 | [Azure Service Fabric 7.1](https://techcommunity.microsoft.com/t5/azure-service-fabric/azure-service-fabric-7-1-release/ba-p/1311373)  | [Release notes](https://github.com/microsoft/service-fabric/tree/master/release_notes/Service-Fabric-71-releasenotes.md)|
| June 16, 2020 | [Microsoft Azure Service Fabric 7.1 First Refresh](https://techcommunity.microsoft.com/t5/azure-service-fabric/azure-service-fabric-7-1-first-refresh-release/ba-p/1466517) | [Release notes](https://github.com/microsoft/service-fabric/blob/master/release_notes/Service-Fabric-71CU1-releasenotes.md)
| July 20, 2020 | [Microsoft Azure Service Fabric 7.1 Second Refresh](https://techcommunity.microsoft.com/t5/azure-service-fabric/azure-service-fabric-7-1-second-refresh-release/ba-p/1534246) | [Release notes](https://github.com/microsoft/service-fabric/blob/master/release_notes/Service-Fabric-71CU2-releasenotes.md)
| August 12, 2020 | [Microsoft Azure Service Fabric 7.1 Third Refresh](https://techcommunity.microsoft.com/t5/azure-service-fabric/azure-service-fabric-7-1-third-refresh-release/ba-p/1587586) | [Release notes](https://github.com/microsoft/service-fabric/blob/master/release_notes/Service-Fabric-71CU3-releasenotes.md)
| September 10, 2020 | [Microsoft Azure Service Fabric 7.1 Fourth Refresh](https://techcommunity.microsoft.com/t5/azure-service-fabric/azure-service-fabric-7-1-fourth-refresh-release/ba-p/1653859)  | [Release notes](https://github.com/microsoft/service-fabric/blob/master/release_notes/Service-Fabric-71CU5-releasenotes.md)|
| October 7, 2020 | Microsoft Azure Service Fabric 7.1 Sixth Refresh | [Release notes](https://github.com/microsoft/service-fabric/blob/master/release_notes/Service-Fabric-71CU6-releasenotes.md)|
| November 23, 2020 | Microsoft Azure Service Fabric 7.1 Eighth Refresh | [Release notes](https://github.com/microsoft/service-fabric/blob/master/release_notes/Service-Fabric-71CU8-releasenotes.md)|


### Service Fabric 7.0

Azure Service Fabric 7.0 is now available! You are able to update to 7.0 through the Azure portal or via an Azure Resource Manager deployment. Due to customer feedback on releases around the holiday period we will not begin automatically updating clusters set to receive automatic upgrades until January.
   In January, we resume the standard roll-out procedure and clusters with automatic upgrades enabled will begin to receive the 7.0 update automatically. We provide another announcement before the roll-out begins.
We will also update our planned release dates to indicate that we take this policy into consideration. Look here for updates on our future [release schedules](https://github.com/Microsoft/service-fabric/#service-fabric-release-schedule).

#### Key announcements
 - [**KeyVaultReference support for application secrets (Preview)**](./service-fabric-keyvault-references.md): Service Fabric applications that have enabled [Managed Identities](./concepts-managed-identity.md) can now directly reference a Key Vault secret URL as an environment variable, application parameter, or container repository credential. Service Fabric will automatically resolve the secret using the application's managed identity. 
     
- **Improved upgrade safety for stateless services**: To guarantee availability during an application upgrade, we have introduced new 
  configurations to define the [minimum number of instances for stateless services](/dotnet/api/system.fabric.description.statelessservicedescription) to be considered available. Previously this value 
  was 1 for all services and was not changeable. With this new per-service safety check, you can ensure that your services retain a 
  minimum number of up instances during application upgrades, cluster upgrades, and other maintenance that relies on Service Fabric’s 
  health and safety checks.
  
- [**Resource Limits for User Services**](./service-fabric-resource-governance.md#enforcing-the-resource-limits-for-user-services): Users can set up resource limits for the user services on a node to prevent scenarios such as 
  resource exhaustion of the Service Fabric system services. 
  
- [**Very High service move cost**](./service-fabric-cluster-resource-manager-movement-cost.md) for a replica type. Replicas with Very High move cost will be moved only if there is a constraint violation in the cluster that cannot be fixed in any other way. Refer to the linked document for additional information on when usage of a “Very High” move cost is reasonable and for more considerations.
  
-  **Additional cluster safety checks**: In this release, we introduced a configurable seed node quorum safety check. This allows you to 
   customize how many seed nodes must be available during cluster life-cycle and management scenarios. Operations that would take the 
   cluster below the configured value are blocked. Today the default value is always a quorum of the seed nodes, for example, if you have seven seed nodes, an operation that would take you below five seed nodes would be blocked by default. With this change, you could make 
   the minimum safe value 6, which would allow only one seed node to be down at a time.
   
- Added support for [**managing the Backup and Restore service in Service Fabric Explorer**](./service-fabric-backuprestoreservice-quickstart-azurecluster.md). This makes the following activities possible directly from within 
 SFX: discovering the backup and restore service, creating backup policy, enabling automatic backups, taking adhoc backups, triggering restore operations and browsing existing backups.

- Announcing availability of the [**ReliableCollectionsMissingTypesTool**](https://github.com/hiadusum/ReliableCollectionsMissingTypesTool): 
This tool helps validate that types used in reliable collections are forward and backward compatible during a rolling application upgrade. This helps prevent upgrade failures or data loss and data corruption due to missing or incompatible types.

- [**Enable stable reads on secondary replicas**](./service-fabric-reliable-services-configuration.md#configuration-names-1): Stable reads restrict secondary replicas to returning values which have been quorum-acked.

In addition, this release contains other new features, bug fixes, and supportability, reliability, and performance improvements. For the full list of changes, please refer to the [release notes](https://github.com/Azure/service-fabric/blob/master/release_notes/Service_Fabric_ReleaseNotes_70.md).

#### Service Fabric 7.0 releases

| Release date | Release | More info |
|---|---|---|
| November 18, 2019 | [Azure Service Fabric 7.0](https://techcommunity.microsoft.com/t5/Azure-Service-Fabric/Service-Fabric-7-0-Release/ba-p/1015482)  | [Release notes](https://github.com/microsoft/service-fabric/blob/master/release_notes/Service_Fabric_ReleaseNotes_70.md)|
| January 30, 2020 | [Azure Service Fabric 7.0 Refresh Release](https://techcommunity.microsoft.com/t5/azure-service-fabric/azure-service-fabric-7-0-second-refresh-release/ba-p/1137690)  | [Release notes](https://github.com/microsoft/service-fabric/blob/master/release_notes/Service-Fabric-70CU2-releasenotes.md)|
| February 6, 2020 | [Azure Service Fabric 7.0 Refresh Release](https://techcommunity.microsoft.com/t5/azure-service-fabric/azure-service-fabric-7-0-third-refresh-release/ba-p/1156508)  | [Release notes](https://github.com/microsoft/service-fabric/blob/master/release_notes/Service-Fabric-70CU3-releasenotes.md)|
| March 2, 2020 | [Azure Service Fabric 7.0 Refresh Release](https://techcommunity.microsoft.com/t5/azure-service-fabric/azure-service-fabric-7-0-fourth-refresh-release/ba-p/1205414)  | [Release notes](https://github.com/microsoft/service-fabric/blob/master/release_notes/Service-Fabric-70CU4-releasenotes.md)
| May 6, 2020 | [Azure Service Fabric 7.0 Sixth Refresh Release](https://techcommunity.microsoft.com/t5/azure-service-fabric/azure-service-fabric-7-0-sixth-refresh-release/ba-p/1365709) | [Release notes](https://github.com/microsoft/service-fabric/blob/master/release_notes/Service-Fabric-70CU6-releasenotes.md)|
| October 9, 2020 | Azure Service Fabric 7.0 Ninth Refresh Release | [Release notes](https://github.com/microsoft/service-fabric/blob/master/release_notes/Service-Fabric-70CU9-releasenotes.md)|

### Service Fabric 6.5

This release includes supportability, reliability, and performance improvements, new features, bug fixes, and enhancements to ease cluster and application lifecycle management.

> [!IMPORTANT]
> Service Fabric 6.5 is the final release with Service Fabric tools support in Visual Studio 2015. Customers are advised to move to [Visual Studio 2019](https://visualstudio.microsoft.com/vs/) going forward.

What's new in Service Fabric 6.5:

- Service Fabric Explorer includes an [Image Store Viewer](service-fabric-visualizing-your-cluster.md#image-store-viewer) for inspecting applications you've uploaded to image store.

- [Patch Orchestration Application (POA)](service-fabric-patch-orchestration-application.md) version [1.4.0](https://github.com/microsoft/Service-Fabric-POA/releases/tag/v1.4.0) includes many self-diagnostic improvements. Customers of POA are recommended to move to this version.

- [EventStore Service is enabled by default](service-fabric-visualizing-your-cluster.md#event-store) for Service Fabric 6.5 clusters unless you have opted out.

- Added [replica lifecycle events](service-fabric-diagnostics-event-generation-operational.md#replica-events) for stateful services.

- [Better visibility of seed node status](service-fabric-understand-and-troubleshoot-with-system-health-reports.md#seed-node-status), including cluster-level warnings if a seed node is unhealthy (*Down*, *Removed* or *Unknown*).

- [Service Fabric Application Disaster Recovery Tool](https://github.com/Microsoft/Service-Fabric-AppDRTool) allows Service Fabric stateful services to recover quickly when the  primary cluster encounters a disaster. Data from primary cluster is continuously synchronized on the secondary standby application using periodic backup and restore.

- Visual Studio support for [publishing .NET Core apps to Linux-based clusters](service-fabric-how-to-publish-linux-app-vs.md).

- [Azure Service Fabric CLI (SFCTL)](./service-fabric-cli.md) will be installed automatically for Service Fabric 6.5 (and later versions) when you upgrade or create a new Linux cluster on Azure.

- [SFCTL](./service-fabric-cli.md) is installed by default on MacOS/Linux OneBox clusters.

For more information, see the [Service Fabric 6.5 Release Notes](https://github.com/Azure/service-fabric/blob/master/release_notes/Service_Fabric_ReleaseNotes_65.pdf).

#### Service Fabric 6.5 releases

| Release date | Release | More info |
|---|---|---|
| June 11, 2019 | [Azure Service Fabric 6.5](https://techcommunity.microsoft.com/t5/azure-service-fabric/bg-p/Service-Fabric)  | [Release notes](https://github.com/microsoft/service-fabric/blob/master/release_notes/Service_Fabric_ReleaseNotes_65.pdf)|
| July 2, 2019 | [Azure Service Fabric 6.5 Refresh Release](https://techcommunity.microsoft.com/t5/azure-service-fabric/bg-p/Service-Fabric)  | [Release notes](https://github.com/microsoft/service-fabric/blob/master/release_notes/Service_Fabric_ReleaseNotes_65CU1.pdf)  |
| July 29, 2019 | [Azure Service Fabric 6.5 Refresh Release](https://techcommunity.microsoft.com/t5/Azure-Service-Fabric/Azure-Service-Fabric-6-5-Second-Refresh-Release/ba-p/800523)  | [Release notes](https://github.com/microsoft/service-fabric/blob/master/release_notes/Service_Fabric_ReleaseNotes_65CU2.pdf)  |
| Aug 23, 2019 | [Azure Service Fabric 6.5 Refresh Release](https://techcommunity.microsoft.com/t5/Azure-Service-Fabric/Azure-Service-Fabric-6-5-Third-Refresh-Release/ba-p/818599)  | [Release notes](https://github.com/microsoft/service-fabric/blob/master/release_notes/Service_Fabric_ReleaseNotes_65CU3.pdf)  |
| Oct 14, 2019 | [Azure Service Fabric 6.5 Refresh Release](https://techcommunity.microsoft.com/t5/Azure-Service-Fabric/Azure-Service-Fabric-6-5-Fifth-Refresh-Release/ba-p/913296)  | [Release notes](https://github.com/microsoft/service-fabric/blob/master/release_notes/Service_Fabric_ReleaseNotes_65CU5.md) |

### Service Fabric 6.4 releases

| Release date | Release |
|---|---|
| November 30, 2018 | [Azure Service Fabric 6.4](https://blogs.msdn.microsoft.com/azureservicefabric/2018/11/30/azure-service-fabric-6-4-release/) |
| December 12, 2018 | [Azure Service Fabric 6.4 Refresh Release for Windows clusters](https://techcommunity.microsoft.com/t5/azure-service-fabric/bg-p/Service-Fabric) |
| February 4, 2019 | [Azure Service Fabric 6.4 Refresh Release](https://techcommunity.microsoft.com/t5/azure-service-fabric/bg-p/Service-Fabric) |
| March 4, 2019 | [Azure Service Fabric 6.4 Refresh Release](https://techcommunity.microsoft.com/t5/azure-service-fabric/bg-p/Service-Fabric) |
| April 8, 2019 | [Azure Service Fabric 6.4 Refresh Release](https://techcommunity.microsoft.com/t5/azure-service-fabric/bg-p/Service-Fabric) |
| May 2, 2019 | [Azure Service Fabric 6.4 Refresh Release](https://techcommunity.microsoft.com/t5/azure-service-fabric/bg-p/Service-Fabric) |
| May 28, 2019 | [Azure Service Fabric 6.4 Refresh Release](https://techcommunity.microsoft.com/t5/azure-service-fabric/bg-p/Service-Fabric) |
