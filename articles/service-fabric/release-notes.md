---
title: Azure Service Fabric releases
description: Release notes for Azure Service Fabric. Includes information on the latest features and improvements in Service Fabric.
ms.date: 06/10/2019
ms.topic: conceptual
hide_comments: true
hideEdit: true
---

# Service Fabric releases

| <a href="https://github.com/Azure/Service-Fabric-Troubleshooting-Guides" target="blank">Troubleshooting Guides</a> 
| <a href="https://github.com/Azure/service-fabric-issues" target="blank">Issue Tracking</a> 
| <a href="https://docs.microsoft.com/azure/service-fabric/service-fabric-support" target="blank">Support Options</a> 
| <a href="https://docs.microsoft.com/azure/service-fabric/service-fabric-versions" target="blank">Supported Versions</a> 
| <a href="https://azure.microsoft.com/resources/samples/?service=service-fabric&sort=0" target="blank">Code Samples</a>

This article provides more information on the latest releases and updates to the Service Fabric runtime and SDKs.

## What's new in Service Fabric

### Service Fabric 7.0

Azure Service Fabric 7.0 is now available! You will be able to update to 7.0 through the Azure portal or via an Azure Resource Manager deployment. Due to customer feedback on releases around the holiday period we will not begin automatically updating clusters set to receive automatic upgrades until January.
   In January, we will resume the standard roll-out procedure and clusters with automatic upgrades enabled will begin to receive the 7.0 update automatically. We will provide another announcement before the roll-out begins.
We will also update our planned release dates to indicate that we take this policy into consideration. Look here for updates on our future [release schedules](https://github.com/Microsoft/service-fabric/#service-fabric-release-schedule).
 
This is the latest release of Service Fabric and is loaded with key features and improvements.

### Key Announcements
 - [**KeyVaultReference support for application secrets (Preview)**](https://docs.microsoft.com/azure/service-fabric/service-fabric-keyvault-references): Service Fabric applications that have enabled [Managed Identities](https://docs.microsoft.com/azure/service-fabric/concepts-managed-identity) can now directly reference a Key Vault secret URL as an environment variable, application parameter, or container repository credential. Service Fabric will automatically resolve the secret using the application's managed identity. 
     
- **Improved upgrade safety for stateless services**: To guarantee availability during an application upgrade, we have introduced new 
  configurations to define the [minimum number of instances for stateless services](https://docs.microsoft.com/dotnet/api/system.fabric.description.statelessservicedescription?view=azure-dotnet) to be considered available. Previously this value 
  was 1 for all services and was not changeable. With this new per-service safety check, you can ensure that your services retain a 
  minimum number of up instances during application upgrades, cluster upgrades, and other maintenance that relies on Service Fabric’s 
  health and safety checks.
  
- [**Resource Limits for User Services**](https://docs.microsoft.com/azure/service-fabric/service-fabric-resource-governance#enforcing-the-resource-limits-for-user-services): Users can set up resource limits for the user services on a node to prevent scenarios such as 
  resource exhaustion of the Service Fabric system services. 
  
- [**Very High service move cost**](https://docs.microsoft.com/azure/service-fabric/service-fabric-cluster-resource-manager-movement-cost) for a replica type. Replicas with Very High move cost will be moved only if there is a constraint violation in the cluster that cannot be fixed in any other way. Please see the docs for additional information on when usage of a “Very High” move cost is reasonable and for additional considerations.
  
-  **Additional cluster safety checks**: In this release we introduced a configurable seed node quorum safety check. This allows you to 
   customize how many seed nodes must be available during cluster life-cycle and management scenarios. Operations which would take the 
   cluster below the configured value are blocked. Today the default value is always a quorum of the seed nodes, for example, if you have 7 seed nodes, an operation that would take you below 5 seed nodes would be blocked by default. With this change, you could make 
   the minimum safe value 6, which would allow only one seed node to be down at a time.
   
- Added support for [**managing the Backup and Restore service in Service Fabric Explorer**](https://docs.microsoft.com/azure/service-fabric/service-fabric-backuprestoreservice-quickstart-azurecluster). This makes the following activities possible directly from within 
 SFX: discovering the backup and restore service, creating backup policy, enabling automatic backups, taking adhoc backups, triggering restore operations and browsing existing backups.

- Announcing availability of the [**ReliableCollectionsMissingTypesTool**](https://github.com/hiadusum/ReliableCollectionsMissingTypesTool): 
This tool helps validate that types used in reliable collections are forward and backward compatible during a rolling application upgrade. This helps prevent upgrade failures or data loss and data corruption due to missing or incompatible types.

- [**Enable stable reads on secondary replicas**](https://docs.microsoft.com/azure/service-fabric/service-fabric-reliable-services-configuration#configuration-names-1):Stable reads will restrict secondary replicas to returning values which have been quorum-acked.

In addition, this release contains other new features, bug fixes, and supportability, reliability, and performance improvements. For the full list of changes, please refer to the [release notes](https://github.com/Azure/service-fabric/blob/master/release_notes/Service_Fabric_ReleaseNotes_70.md).

### Service Fabric 7.0 releases

| Release date | Release | More info |
|---|---|---|
| November 18, 2019 | [Azure Service Fabric 7.0](https://techcommunity.microsoft.com/t5/Azure-Service-Fabric/Service-Fabric-7-0-Release/ba-p/1015482)  | [Release notes](https://github.com/Azure/service-fabric/blob/master/release_notes/Service_Fabric_ReleaseNotes_70.md)|
| January 30, 2020 | [Azure Service Fabric 7.0 Refresh Release](https://techcommunity.microsoft.com/t5/azure-service-fabric/azure-service-fabric-7-0-second-refresh-release/ba-p/1137690)  | [Release notes](https://github.com/Azure/service-fabric/blob/master/release_notes/Service-Fabric-70CU2-releasenotes.md)|
| February 6, 2020 | [Azure Service Fabric 7.0 Refresh Release](https://techcommunity.microsoft.com/t5/azure-service-fabric/azure-service-fabric-7-0-third-refresh-release/ba-p/1156508)  | [Release notes](https://github.com/Azure/service-fabric/blob/master/release_notes/Service-Fabric-70CU3-releasenotes.md)|

### Service Fabric 6.5

This release includes supportability, reliability, and performance improvements, new features, bug fixes, and enhancements to ease cluster and application lifecycle management.

> [!IMPORTANT]
> Service Fabric 6.5 is the final release with Service Fabric tools support in Visual Studio 2015. Customers are advised to move to [Visual Studio 2019](https://visualstudio.microsoft.com/vs/) going forward.

Here's what's new in Service Fabric 6.5:

- Service Fabric Explorer includes an [Image Store Viewer](service-fabric-visualizing-your-cluster.md#image-store-viewer) for inspecting applications you've uploaded to image store.

- [Patch Orchestration Application (POA)](service-fabric-patch-orchestration-application.md) version [1.4.0](https://github.com/microsoft/Service-Fabric-POA/releases/tag/v1.4.0) includes many self-diagnostic improvements. Customers of POA are recommended to move to this version.

- [EventStore Service is enabled by default](service-fabric-visualizing-your-cluster.md#event-store) for Service Fabric 6.5 clusters unless you have opted out.

- Added [replica lifecycle events](service-fabric-diagnostics-event-generation-operational.md#replica-events) for stateful services.

- [Better visibility of seed node status](service-fabric-understand-and-troubleshoot-with-system-health-reports.md#seed-node-status), including cluster-level warnings if a seed node is unhealthy (*Down*, *Removed* or *Unknown*).

- [Service Fabric Application Disaster Recovery Tool](https://github.com/Microsoft/Service-Fabric-AppDRTool) allows Service Fabric stateful services to recover quickly when the  primary cluster encounters a disaster. Data from primary cluster is continuously synchronized on the secondary standby application using periodic backup and restore.

- Visual Studio support for [publishing .NET Core apps to Linux-based clusters](service-fabric-how-to-publish-linux-app-vs.md).

- [Azure Service Fabric CLI (SFCTL)](https://docs.microsoft.com/azure/service-fabric/service-fabric-cli) will be installed automatically for Service Fabric 6.5 (and later versions) when you upgrade or create a new Linux cluster on Azure.

- [SFCTL](https://docs.microsoft.com/azure/service-fabric/service-fabric-cli) is installed by default on MacOS/Linux OneBox clusters.

For further details, see the [Service Fabric 6.5 Release Notes](https://github.com/Azure/service-fabric/blob/master/release_notes/Service_Fabric_ReleaseNotes_65.pdf).

### Service Fabric 6.5 releases

| Release date | Release | More info |
|---|---|---|
| June 11, 2019 | [Azure Service Fabric 6.5](https://blogs.msdn.microsoft.com/azureservicefabric/2019/06/11/azure-service-fabric-6-5-release/)  | [Release notes](https://github.com/Azure/service-fabric/blob/master/release_notes/Service_Fabric_ReleaseNotes_65.pdf)|
| July 2, 2019 | [Azure Service Fabric 6.5 Refresh Release](https://blogs.msdn.microsoft.com/azureservicefabric/2019/07/04/azure-service-fabric-6-5-refresh-release/)  | [Release notes](https://github.com/Azure/service-fabric/blob/master/release_notes/Service_Fabric_ReleaseNotes_65CU1.pdf)  |
| July 29, 2019 | [Azure Service Fabric 6.5 Refresh Release](https://techcommunity.microsoft.com/t5/Azure-Service-Fabric/Azure-Service-Fabric-6-5-Second-Refresh-Release/ba-p/800523)  | [Release notes](https://github.com/Azure/service-fabric/blob/master/release_notes/Service_Fabric_ReleaseNotes_65CU2.pdf)  |
| Aug 23, 2019 | [Azure Service Fabric 6.5 Refresh Release](https://techcommunity.microsoft.com/t5/Azure-Service-Fabric/Azure-Service-Fabric-6-5-Third-Refresh-Release/ba-p/818599)  | [Release notes](https://github.com/Azure/service-fabric/blob/master/release_notes/Service_Fabric_ReleaseNotes_65CU3.pdf)  |
| Oct 14, 2019 | [Azure Service Fabric 6.5 Refresh Release](https://techcommunity.microsoft.com/t5/Azure-Service-Fabric/Azure-Service-Fabric-6-5-Fifth-Refresh-Release/ba-p/913296)  | [Release notes](https://github.com/Azure/service-fabric/blob/master/release_notes/Service_Fabric_ReleaseNotes_65CU5.md)  |


## Previous versions

### Service Fabric 6.4 releases

| Release date | Release | More info |
|---|---|---|
| November 30, 2018 | [Azure Service Fabric 6.4](https://blogs.msdn.microsoft.com/azureservicefabric/2018/11/30/azure-service-fabric-6-4-release/)  | [Release notes](https://msdnshared.blob.core.windows.net/media/2018/12/Service-Fabric-6.4-Release.pdf)|
| December 12, 2018 | [Azure Service Fabric 6.4 Refresh Release for Windows clusters](https://blogs.msdn.microsoft.com/azureservicefabric/2018/12/12/azure-service-fabric-6-4-refresh-for-windows-clusters/)  | [Release notes](https://msdnshared.blob.core.windows.net/media/2018/12/Links.pdf)  |
| February 4, 2019 | [Azure Service Fabric 6.4 Refresh Release](https://blogs.msdn.microsoft.com/azureservicefabric/2019/02/04/azure-service-fabric-6-4-refresh-release/) | [Release notes](https://msdnshared.blob.core.windows.net/media/2019/02/Service-Fabric-6.4CU3-Release-Notes.pdf) |
| March 4, 2019 | [Azure Service Fabric 6.4 Refresh Release](https://blogs.msdn.microsoft.com/azureservicefabric/2019/03/12/azure-service-fabric-6-4-refresh-release-2/) | [Release notes](https://msdnshared.blob.core.windows.net/media/2019/03/Service-Fabric-6.4CU4-Release-Notes.pdf)
| April 8, 2019 | [Azure Service Fabric 6.4 Refresh Release](https://blogs.msdn.microsoft.com/azureservicefabric/2019/04/08/azure-service-fabric-6-4-refresh-release-5/) | [Release notes](https://msdnshared.blob.core.windows.net/media/2019/04/Service-Fabric-6.4CU5-ReleaseNotes3.pdf)
| May 2, 2019 | [Azure Service Fabric 6.4 Refresh Release](https://blogs.msdn.microsoft.com/azureservicefabric/2019/05/02/azure-service-fabric-6-4-refresh-release-3/) | [Release notes](https://msdnshared.blob.core.windows.net/media/2019/05/Service-Fabric-64CU6-Release-Notes-V2.pdf)
| May 28, 2019 | [Azure Service Fabric 6.4 Refresh Release](https://blogs.msdn.microsoft.com/azureservicefabric/2019/05/28/azure-service-fabric-6-4-refresh-release-4/) | [Release notes](https://msdnshared.blob.core.windows.net/media/2019/05/Service_Fabric_64CU7_Release_Notes1.pdf)
