# Microsoft Azure Service Fabric 7.1 Release Notes


This release includes the bug fixes and features described in this document. This release includes runtime, SDKs and Windows Server Standalone deployments to run on-premises. 

The following packages and versions are part of this release:

| Service | Platform | Version |
|---------|----------|---------|
|Service Fabric Runtime| Ubuntu <br> Windows | 7.1.410.1 <br> 7.1.409.9590  |
|Service Fabric for Windows Server|Service Fabric Standalone Installer Package | 7.1.409.9590 |
|.NET SDK |Windows .NET SDK <br> Microsoft.ServiceFabric <br> Reliable Services and Reliable Actors <br> ASP.NET Core Service Fabric integration| 4.1.409  <br> 7.1.409 <br> 4.0.457 <br> 4.1.409 |
|Java SDK  |Java for Linux SDK  | 1.0.6 |
|Service Fabric PowerShell and CLI | AzureRM PowerShell Module  <br> SFCTL |  0.3.15  <br> 8.0.0 |

## Contents 
- [Key Annoucements](#key-annoucements)
- [Breaking Changes](#breaking-changes)
- [Service Fabric Runtime](#service-fabric-runtime)
- [Service Fabric Common Bug Fixes](#service-fabric-common-bug-fixes)
- [Reliable Collections](#reliable-collections)
- [Repositories and Download Links](#repositories-and-download-links)

## Key Annoucements
- General Availability of [Service Fabric Managed Identities for Service Fabric applications](https://docs.microsoft.com/en-us/azure/service-fabric/concepts-managed-identity)
- [Support for Ubuntu 1804](https://docs.microsoft.com/en-us/azure/service-fabric/service-fabric-tutorial-create-vnet-and-linux-cluster) 
- Support for declaration of Service Endpoint certificates of Service Fabric applications by [subject common name](https://docs.microsoft.com/en-us/azure/service-fabric/service-fabric-application-secret-management ).
 - **[Preview: VMSS Ephemeral OS disk support](https://docs.microsoft.com/en-us/azure/service-fabric/service-fabric-cluster-azure-deployment-preparation#use-ephemeral-os-disks-for-virtual-machine-scale-sets)**: Ephemeral OS disks are storage created on the local virtual machine, and not saved to remote Azure Storage. They are recommended for all Service Fabric node types (Primary and Secondary), because compared to traditional persistent OS disks, ephemeral OS disks:
      - Reduce read/write latency to OS disk
      - Enable faster reset/re-image node management operations
      - Reduce overall costs (the disks are free and incur no additional storage cost)
- Endpoint certificates of Service Fabric applications can be declared by subject common name.  
- [**FabricObserver (FO) 2.0**](https://github.com/microsoft/service-fabric-observer). Bug fixes and enhancements, structured telemetry implementations for ApplicationInsights, LogAnalytics, EventSource. Production-ready, including [sfpkgs with Microsoft-signed binares](https://github.com/microsoft/service-fabric-observer/releases).
- [**ClusterObserver (CO) 1.1**](https://github.com/microsoft/service-fabric-observer/tree/master/ClusterObserver). Bug fixes, enhancements, new features including node status monitoring capability for when a node is Down or Disabled/Disabling for longer than a user-configured amount of time. Structured telemetry implementations for ApplicationInsights, LogAnalytics, EventSource. Production-ready, including [sfpkgs with Microsoft-signed binares](https://github.com/microsoft/service-fabric-observer/releases).
   
### Improve Application life cycle experience

- **[Preview:Request drain](https://docs.microsoft.com/en-us/azure/service-fabric/service-fabric-application-upgrade-advanced#avoid-connection-drops-during-planned-downtime-of-stateless-services)**: During planned service maintenance, such as service upgrades or node deactivation, you would like to allow the  services to gracefully drain connections. This feature adds an instance close delay duration in the service configuration. During planned operations, SF will remove the Service’s address from discovery and then wait this duration before shutting down the service.
- **[Automatic Subcluster Detection and Balancing](https://docs.microsoft.com/en-us/azure/service-fabric/cluster-resource-manager-subclustering )**: Subclustering happens when services with different placement constraints have a common [load metric](https://docs.microsoft.com/en-us/azure/service-fabric/service-fabric-cluster-resource-manager-metrics). If the load on the different sets of nodes differs significantly, the Service Fabric Cluster Resource Manager believes that the cluster is imbalanced, even when it has the best possible balance because of the placement constraints. As a result, it attempts to rebalance the cluster, potentially causing unnecessary service movements (since the “imbalance” cannot be substantially improved). Starting with this release, the Cluster Resource Manager will now attempt to automatically detect these sorts of configurations and understand when the imbalance can be fixed through movement, and when instead it should leave things alone since no substantial improvement can be made.  
- **[Different Move cost for secondary replicas](https://docs.microsoft.com/en-us/azure/service-fabric/service-fabric-cluster-fabric-settings#placementandloadbalancing)**: Support for new PlacementAndLoadBalancing custom configuration option "UseSeparateSecondaryMoveCost" to define if a separate move cost should be used for secondary replicas.
- **[Run till completion/once for services](https://docs.microsoft.com/en-us/azure/service-fabric/run-to-completion)**
- Enabled **[Liveness Probe](https://docs.microsoft.com/en-us/azure/service-fabric/probes-codepackage )** mechanism for containerized    applications. Liveness Probe help announce the liveness of the containerized application and when they do not respond in a timely fashion, it will result in a restart.

### Image Store improvements
 - Service Fabric 7.1 uses **custom transport to secure file transfer between nodes by default**. The dependency on SMB file share is removed from the version 7.1. The secured SMB file shares are still existing on nodes that contains Image Store Service replica for customer's choice to opt out from default and for upgrade and downgrade to old version.
       
 ### Reliable Collections Improvements

- **[In memory only store support for stateful services using Reliable Collections](https://docs.microsoft.com/en-us/azure/service-fabric/service-fabric-work-with-reliable-collections#volatile-reliable-collections)**: Volatile Reliable Collections allows data to be persisted to disk for durability against large-scale outages, can be used for workloads like replicated cache for example where occasional data loss can be tolerated.Based on the [limitations and restrictions of Volatile Reliable Collections](https://docs.microsoft.com/en-us/azure/service-fabric/service-fabric-reliable-services-reliable-collections-guidelines#volatile-reliable-collections), we recommend this for workloads that don't need persistence, for services that handle the rare occasions of Quorum Loss.
- **[Preview: Service Fabric Backup Explorer](https://github.com/microsoft/service-fabric-backup-explorer)**: To ease management of Reliable Collections backups for Service Fabric Stateful applications, Service Fabric Backup Explorer enables users to
    - Audit and review the contents of the Reliable Collections,
    - Update current state to a consistent view
    - Create Backup of the current snapshot of the Reliable Collections
    - Fix data corruption
    
## Breaking Changes
- For customers using service fabric managed identities, **please switch to new environment variables ‘IDENTITY_ENDPOINT’ and ‘IDENTITY_HEADER’**. The prior environment variables'MSI_ENDPOINT' and 'MSI_SECRET' are now removed.
- Service Fabric Managed Identity endpoint is now secure(HTTPs). There is additional guidance on how to validate the MITS server certificate in the docs.
- Currently Service Fabric ships the following nuget packages as a part of our    ASP.Net Integration and support:
    -  Microsoft.ServiceFabric.AspNetCore.Abstractions
    -  Microsoft.ServiceFabric.AspNetCore.Configuration
    -  Microsoft.ServiceFabric.AspNetCore.Kestrel
    -  Microsoft.ServiceFabric.AspNetCore.HttpSys
    -  Microsoft.ServiceFabric.AspNetCore.WebListener

   These packages are built against AspNetCore 1.0.0 binaries which have gone out of support (https://dotnet.microsoft.com/platform/support/policy/dotnet-core). Starting in Service Fabric 8.x we will start building Service Fabric AspNetCore integration against AspNetCore 2.1  and for netstandard 2.0. As a result, there will be following changes:
    1. The following binaries and their nuget packages will be released for     
      netstandard 2.0 only.These packages can be used in applications targeting .net framework <4.6.1 and .net core >=2.0
            -  Microsoft.ServiceFabric.AspNetCore.Abstractions
            -  Microsoft.ServiceFabric.AspNetCore.Configuration
            -  Microsoft.ServiceFabric.AspNetCore.Kestrel
            -  Microsoft.ServiceFabric.AspNetCore.HttpSys
            
    2. The following package will no longer be shipped:
            - Microsoft.ServiceFabric.AspNetCore.WebListener:
                 - Use Microsoft.ServiceFabric.AspNetCore.HttpSys instead.

## Service Fabric Runtime

| Versions | IssueType | Description | Resolution | 
|----------|-----------|-|-|
| **Windows 7.1.409.9590  <br> Ubuntu 7.1.410.1** | **Feature** | VeryHigh service move cost | **Brief desc** We have introduced new move cost value VeryHigh that provides additional flexibility in some usage scenarios. For more details please consult the [Service movement cost](https://docs.microsoft.com/en-us/azure/service-fabric/service-fabric-cluster-resource-manager-movement-cost) documentation.
| **Windows 7.1.409.9590** | **Bug** | Account created alerts | **Brief desc** In certain SF cluster configurations, the runtime would create user accounts with random names that would raise security alerts. These accounts now have standardized names with "WF-" prefix which can be used to identify them as Service Fabric accounts. This should stop automated alerts from being raised on these accounts.
| **Windows 7.1.409.9590  <br> Ubuntu 7.1.410.1** | **Bug** | Subclustered balancing | **Brief desc** Improved balancing for subclustered metrics which previously caused suboptimal balancing in some situations. For more information, see [Subclustering documentation](https://docs.microsoft.com/en-us/azure/service-fabric/cluster-resource-manager-subclustering).
| **Windows 7.1.409.9590** | **Feature** | SSL certs declared by CN | **Brief desc** Application endpoint certificates can be declared by subject common name to enable auto-rollover. For more details please refer to [specifying endpoints in service manifest](https::/docs.microsoft.com/azure/service-fabric/service-fabric-service-manifest-resources.md).
| **Ubuntu 7.1.410.1** | **Feature** | Custom cipher list | **Brief desc** Config setting TLS1_2_CipherList can now be used to configure a custom cipher list on Linux. See [documentation](https://docs.microsoft.com/en-us/azure/service-fabric/service-fabric-cluster-fabric-settings) for details.


## Service Fabric Common Bug Fixes

| Versions | IssueType | Description | Resolution | 
|-|-|-|-|
| **Windows 7.1.409.9590*  <br> Ubuntu 7.1.410.1** | **Bug** | Add aligned affinity support to Move primary replica API | **Brief desc**: Service Fabric supports service affinity and also provides management and troubleshooting APIs such as the ability to manually [move a primary](https://docs.azure.cn/en-us/dotnet/api/system.fabric.fabricclient.faultmanagementclient.moveprimaryasync?view=azure-dotnet) from one node to another. However, operations to move a primary that was a part of an aligned affinity relationship would only move the specific targeted primary, temporarially breaking the affinity relationship. In order to help ensure high availability, in Service Fabric v7.1 we improve the MovePrimary API to take aligned affinity into consideration. With this change, if the primary to be moved is a part of an aligned affinity relationship, then all the replicas in that relationship will be moved together. With this change, the API can now return a new exception in the case that the primary replicas of such services are only partially able to move within specified timeout: FabricErrorCode.AsyncOperationNotComplete. This means that the services will temporarily be in a torn aligned affinity state. If this happens customer is advised to issue the operation again.<br> **Impact**: Service unavailability<br> **Workaround**: Manually move all individual primary replicas in aligned affinity correlation<br> **How/When to Consume it**: Issue Move primary replica operation for primary replica in aligned affinity correlation.
| **Windows 7.1.409.9590** | **Bug** | Backup policy operation works in wrong way when '/' is there in entity name | **Brief desc**: Few of backup policy operations used to work improperly when there is '/' in the application name.  <br> **Impact**: Operations like enable backup, suspend backup and retention management were impacted because of this and all the operations are fixed with this release.<br> **Workaround**: N/A. <br> **How/When to Consume it**: Upgrade the service fabric cluster to 7.1. This fix should only be consumed when user has '/' in application name or service name and also using Backup Restore service to configure backup policy for that application. 
| **Windows 7.1.409.9590** | **Bug** |Backup restore operations failed to work on FIPS compliant system.|**Brief desc**: Backup restore service was using non-FIPS compliant APIs in backup workflow and due to this few operations used to fail on FIPS compliant system.  <br> **Impact**: This impacted complete backup flow when azure blob was used as storage and it is fixed with this release. <br> **Workaround**: N/A. <br> **How/When to Consume it**: Upgrade the service fabric cluster to 7.1. This fix should only be consumed when Backup restore service is being used in FIPS compliant system.
| **Windows 7.1.409.9590** | **Bug** |Fix trace upload on FIPS enabled machines|**Brief desc**:  DCA does not upload to azure storage on FIPS enabled machines. The fix changes the default MD5 algorithm used by the storage api so that it is compliant.  <br> **Impact**: Causes trace upload to fail.


## Java SDK 
| IssueType | Description | Resolution | 
|-|-|-|
|  **Bug** |Java - Class loading issues in JNI when using Custom Class Loader| **Symptom**: JNI code intermittently asserts with NoClassDefFoundError in spring boot applications. <br> **Rootcause**: Spring boot uses LaunchedURLClassLoader which loads classes defined in jars in BOOT-INF/lib folder inside spring boot fat jar. In the case of reliable collections, if the operation completes synchronously then Runtime posts the result on the same thread which made the native call. If the operation completes asynchronously then Runtime calls into java on a new thread which doesnt know about the Custom Class loader. AppClassLoader can only load defined in the java class path. As the jars are present only in BOOT-INF/lib folder, AppClassLoader fails to load them.Added support for frameworks like SpringBoot which uses Custom Class loaders. <br> **Fix**: Save Custom Class loader and use it if the default class loader fails to find a class. <br> **Workaround**:Define Class Path in manifest and place one copy of SF jars outside fat jar. <br> **Impact**: SpringBoot applications using ReliableCollections intermittently crashes causing the service to restart.
 | **Bug** |Java - weak reference JNI crash| **Symptom**: JNI code intermittently asserts with ReliableCollections native calls. <br> **RootCause**: If a reliable collections call fails to complete synchronously, then a callback is registered by saving the context of the operation. When the TStore call completes asynchronously, this callback is invoked using the saved context.As this context is saved using weakreferences, Garbage collector could collect these objects during GC cycle. When a callback is invoked using such freed context, JNI code would assert because of invalid access to memory location. <br> **Workaround**: N/A <br> **Fix**: Use strong references to save context. <br> **Impact**:Applications using ReliableCollections intermittently crashes because of the garbage collected weak references.
 | **Bug** |Java - Handle RSP->GetEndpoint failures| **Symptom**: When the replica primary replica reconfiguration, Java code throws NullPointerException. <br> **Rootcause**: When primary replica closes, Native returns 0x80071be8L. In such a case, JNI code returns NULL to Java which is causing NullPointerException.<br> Resolving endpoint of the stateful service whose primary is in reconfiguring state causes NullPointerException.Fixed code to return right exception to the caller in such state. <br> **Workaround**: Handle exception and re-resolve the endpoint. <br> **Fix**: Throw exception from GetEndpoint() for Failed(HResult) during reconfiguration.
 

## Reliable Collections
| IssueType | Description | Resolution | 
|-|-|-|
| **Feature** | [In memory only store support for stateful services using Reliable Collections](): | **Desc**: Data can be persisted to disk for durability against large-scale outages. Some Reliable Collections also support a volatile mode (with exceptions) where all data is kept in-memory, such as a replicated in-memory cache. Useful for workloads that don’t need persistence and can handle rare occurrences of data loss. An example would be a service that acts as a replicated cache.Because there is no persistence, Quorum Loss will mean full data loss. We recommend this setting for services that can handle the rare occasions of Quorum Loss.There is no upgrade path for existing services. You will need to delete the existing service and recreate it with the flag changed. This is also true if you would like to make a volatile service persisted by changing the flag back to “true”.
| **Feature** | [Service Fabric Backup Explorer](https://github.com/microsoft/service-fabric-backup-explorer):| **Desc**: To ease management of Reliable Collections backup for Service Fabric Stateful applications, we are announcing public preview of Service Fabric Backup Explorer. It is a utility that  enables users to i)Audit and review the contents of the Reliable Collections, ii) update current state to a consistent view, iii) create Backup of the current snapshot of the Reliable Collections and iv) Fix data corruption.
 
## Repositories and Download Links
The table below is an overview of the direct links to the packages associated with this release. 
Follow this guidance for setting up your developer environment: 
* [Geting Started with Linux](https://docs.microsoft.com/azure/service-fabric/service-fabric-get-started-linux)
* [Getting Started with Mac](https://docs.microsoft.com/azure/service-fabric/service-fabric-get-started-mac)
* [Getting Started with Windows](https://docs.microsoft.com/azure/service-fabric/service-fabric-get-started)

| Area | Package | Version | Repository | Direct Download Link |
|-|-|-|-|-|
|Service Fabric Runtime |Ubuntu Developer Set-up | 7.1.410.1 |N/A | Cluster Runtime: https://apt-mo.trafficmanager.net/repos/servicefabric/pool/main/s/servicefabric <br> Service Fabric SDK for local cluster setup: https://apt-mo.trafficmanager.net/repos/servicefabric/pool/main/s/servicefabricsdkcommon/ <br> Container image: https://hub.docker.com/r/microsoft/service-fabric-onebox/ 
|| Windows Developer Set-up| 7.1.409.9590 | N/A | https://download.microsoft.com/download/c/8/c/c8c98ab2-6e7a-4d9a-a0a5-506b18111677/MicrosoftServiceFabric.7.1.409.9590.exe |
|Service Fabric for Windows Server |Service Fabric Standalone Installer Package | 7.1.409.9590 |N/A | https://download.microsoft.com/download/8/3/6/836E3E99-A300-4714-8278-96BC3E8B5528/7.1.409.9590/Microsoft.Azure.ServiceFabric.WindowsServer.7.1.409.9590.zip |
||Service Fabric Standalone Runtime | 7.1.409.9590 |N/A | https://download.microsoft.com/download/B/0/B/B0BCCAC5-65AA-4BE3-AB13-D5FF5890F4B5/7.1.409.9590/MicrosoftAzureServiceFabric.7.1.409.9590.cab |
|.NET SDK |Windows .NET SDK | 4.1.409 |N/A | https://download.microsoft.com/download/c/8/c/c8c98ab2-6e7a-4d9a-a0a5-506b18111677/MicrosoftServiceFabricSDK.4.1.409.msi |
||Microsoft.ServiceFabric | 7.1.409 |N/A |https://www.nuget.org |
||Reliable Services and Reliable Actors<br>\-Microsoft.ServiceFabric.Services<br>\-Microsoft.ServiceFabric.Services.Remoting<br>\-Microsoft.ServiceFabric.Services.Wcf <br>\-Microsoft.ServiceFabric.Actors <br>\-Microsoft.ServiceFabric.Actors.Wcf | 4.1.409 |https://github.com/Azure/service-fabric-services-and-actors-dotnet |https://www.nuget.org |
||ASP.NET Core Service Fabric integration<br>\-Microsoft.ServiceFabric.Services.AspNetCore.*| 4.1.409 |https://github.com/Azure/service-fabric-aspnetcore |https://www.nuget.org |
||Data, Diagnostics and Fabric transport<br>\-Microsoft.ServiceFabric.Data <br>\-Microsoft.ServiceFabric.Data.Interfaces <br>\-Microsoft.ServiceFabric.Diagnostics.Internal <br>\-Microsoft.ServiceFabric.FabricTransport/Internal | 4.1.409 |N/A| https://www.nuget.org |
||Microsoft.ServiceFabric.Data.Extensions | 4.1.409 | N/A |https://www.nuget.org |
|Java SDK |Java SDK | 1.0.6 |N/A |https://mvnrepository.com/artifact/com.microsoft.servicefabric/sf-actors/1.0.6 |
|Eclipse |Service Fabric plug-in for Eclipse | 2.0.7 | N/A |N/A |
|Yeoman |Azure Service Fabric Java generator | 1.0.7 |https://github.com/Azure/generator-azuresfjava |N/A |
||Azure Service Fabric C# generator | 1.0.9 |https://github.com/Azure/generator-azuresfcsharp |N/A |
||Azure Service Fabric guest executables generator | 1.0.1 |https://github.com/Azure/generator-azuresfguest |N/A|
||Azure Service Fabric Container generators | 1.0.1 |https://github.com/Azure/generator-azuresfcontainer |N/A |
|CLI |Service Fabric CLI | 8.0.0 |https://github.com/Azure/service-fabric-cli |https://pypi.python.org/pypi/sfctl |
|PowerShell |AzureRM.ServiceFabric | 0.3.15 |https://github.com/Azure/azure-powershell/tree/preview/src/ResourceManager/ServiceFabric |https://www.powershellgallery.com/packages/AzureRM.ServiceFabric/0.3.15  |

