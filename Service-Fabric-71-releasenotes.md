Microsoft Azure Service Fabric 7.1 Release Notes

* [Key Announcements](#key-announcements)
* [Upcoming Breaking Changes](#upcomig-breaking-changes)
* [Service Fabric Runtime](#service-fabric-runtime)
* [Service Fabric Common Bug Fixes](#service-fabric-common-bug-fixes)
* [Repositories and Download Links](#repositories-and-download-links)
* [Visual Studio 2015 Tool for Service Fabric - Localized Download Links](#visual-studio-2015-tool-for-service-fabric-\--localized-download-links)

## Key Annoucements
-  Service Fabric applications with [Managed Identities](https://docs.microsoft.com/en-us/azure/service-fabric/concepts-managed-identity) enabled can directly [reference a keyvault](https://docs.microsoft.com/azure/service-fabric/service-fabric-keyvault-references) secret URL as environment/parameter variable. Service Fabric will automatically resolve the secret using the application's managed identity.
- [Service Fabric Backup Explorer](https://github.com/microsoft/service-fabric-backup-explorer):  To ease management of Reliable Collections backup for Service Fabric Stateful applications, we are announcing public preview of Service Fabric Backup Explorer. It is a utility that  enables users to i)Audit and review the contents of the Reliable Collections, ii) update current state to a consistent view, iii) create Backup of the current snapshot of the Reliable Collections and iv) Fix data corruption.
  

## Upcoming Breaking Changes
- For customers using service fabric managed identities, **please switch to new environment variables ‘IDENTITY_ENDPOINT’ and ‘IDENTITY_HEADER’**. The prior environment variables'MSI_ENDPOINT', ‘MSI_ENDPOINT_’ and 'MSI_SECRET' are now deprecated and will be removed in next CU release.

## Service Fabric Runtime

| Versions | IssueType | Description | Resolution | 
|----------|-----------|-|-|
| **Windows 7.1.*   <br> Ubuntu 7.1.*** | **Feature** | VeryHigh service move cost | **Brief desc** We have introduced new move cost value VeryHigh that provides additional flexibility in some usage scenarios. For more details please consult the [Service movement cost](https://docs.microsoft.com/en-us/azure/service-fabric/service-fabric-cluster-resource-manager-movement-cost) documentation.
| **Windows 7.1.*   <br> Ubuntu 7.1.*** | **Bug** | Subclustered balancing | **Brief desc** Improved balancing for subclustered metrics which previously caused suboptimal balancing in some situations. For more information, see [Subclustering documentation](https://docs.microsoft.com/en-us/azure/service-fabric/cluster-resource-manager-subclustering).

## Service Fabric Common Bug Fixes

| Versions | IssueType | Description | Resolution | 
|-|-|-|-|
| **Windows 7.1.*** | **Bug** |Improve DNS intermittent resolve errors|**Brief desc**: Intermittent resolve shows up as short periods of time where a resolve will timeout or be unable to correctly statisfy a request.  <br> **Impact**: Causes interruptions in service for customers. <br> **Workaround**: Wait for it to self correct or apply a patch script. <br> **How/When to Consume it**: In fabric settings, set the Hosting parameter DnsServerListTwoIps to true. **Documentation: https://docs.microsoft.com/en-us/azure/service-fabric/service-fabric-cluster-fabric-settings#dnsservice| 
| ***Windows 7.1.*   <br> Ubuntu 7.1.** | **Bug** | Add aligned affinity support to Move primary replica API | **Brief desc**: Service Fabric supports service affinity and also provides management and troubleshooting APIs such as the ability to manually move a primary (https://docs.azure.cn/en-us/dotnet/api/system.fabric.fabricclient.faultmanagementclient.moveprimaryasync?view=azure-dotnet) from one node to another. However, operations to move a primary that was a part of an aligned affinity relationship would only move the specific targeted primary, temporarially breaking the affinity relationship. In order to help ensure high availability, in Service Fabric v7.1 we improve the MovePrimary API to take aligned affinity into consideration. With this change, if the primary to be moved is a part of an aligned affinity relationship, then all the replicas in that relationship will be moved together. With this change, the API can now return a new exception in the case that the primary replicas of such services are only partially able to move within specified timeout: FabricErrorCode.AsyncOperationNotComplete. This means that the services will temporarily be in a torn aligned affinity state. If this happens customer is advised to issue the operation again.<br> **Impact**: Service unavailability<br> **Workaround**: Manually move all individual primary replicas in aligned affinity correlation<br> **How/When to Consume it**: Issue Move primary replica operation for primary replica in aligned affinity correlation

## Service Fabric Explorer
| Versions | IssueType | Description | Resolution | 
|-|-|-|-|
 

## Reliable Collections
| Versions | IssueType | Description | Resolution | 
|-|-|-|-|
- [Service Fabric Backup Explorer](https://github.com/microsoft/service-fabric-backup-explorer):  To ease management of Reliable Collections backup for Service Fabric Stateful applications, we are announcing public preview of Service Fabric Backup Explorer. It is a utility that  enables users to i)Audit and review the contents of the Reliable Collections, ii) update current state to a consistent view, iii) create Backup of the current snapshot of the Reliable Collections and iv) Fix data corruption.
 
## Repositories and Download Links
The table below is an overview of the direct links to the packages associated with this release. 
Follow this guidance for setting up your developer environment: 
* [Geting Started with Linux](https://docs.microsoft.com/azure/service-fabric/service-fabric-get-started-linux)
* [Getting Started with Mac](https://docs.microsoft.com/azure/service-fabric/service-fabric-get-started-mac)
* [Getting Started with Windows](https://docs.microsoft.com/azure/service-fabric/service-fabric-get-started)

| Area | Package | Version | Repository | Direct Download Link |
|-|-|-|-|-|
|Service Fabric Runtime |Ubuntu Developer Set-up | 7.0.457.1 |N/A | Cluster Runtime: https://apt-mo.trafficmanager.net/repos/servicefabric/pool/main/s/servicefabric <br> Service Fabric SDK for local cluster setup: https://apt-mo.trafficmanager.net/repos/servicefabric/pool/main/s/servicefabricsdkcommon/ <br> Container image: https://hub.docker.com/r/microsoft/service-fabric-onebox/ 
|| Windows Developer Set-up| 7.0.457.9590 | N/A | https://download.microsoft.com/download/5/e/e/5ee43eba-5c87-4d11-8a7c-bb26fd162b29/MicrosoftServiceFabric.7.0.457.9590.exe |
|Service Fabric for Windows Server |Service Fabric Standalone Installer Package | 7.0.457.9590 |N/A | https://download.microsoft.com/download/8/3/6/836E3E99-A300-4714-8278-96BC3E8B5528/7.0.457.9590/Microsoft.Azure.ServiceFabric.WindowsServer.7.0.457.9590.zip |
||Service Fabric Standalone Runtime | 7.0.457.9590 |N/A | https://download.microsoft.com/download/B/0/B/B0BCCAC5-65AA-4BE3-AB13-D5FF5890F4B5/7.0.457.9590/MicrosoftAzureServiceFabric.7.0.457.9590.cab |
|.NET SDK |Windows .NET SDK | 4.0.457 |N/A | https://download.microsoft.com/download/5/e/e/5ee43eba-5c87-4d11-8a7c-bb26fd162b29/MicrosoftServiceFabricSDK.4.0.457.msi |
||Microsoft.ServiceFabric | 7.0.457 |N/A |https://www.nuget.org |
||Reliable Services and Reliable Actors<br>\-Microsoft.ServiceFabric.Services<br>\-Microsoft.ServiceFabric.Services.Remoting<br>\-Microsoft.ServiceFabric.Services.Wcf <br>\-Microsoft.ServiceFabric.Actors <br>\-Microsoft.ServiceFabric.Actors.Wcf | 4.0.457 |https://github.com/Azure/service-fabric-services-and-actors-dotnet |https://www.nuget.org |
||ASP.NET Core Service Fabric integration<br>\-Microsoft.ServiceFabric.Services.AspNetCore.*| 4.0.457 |https://github.com/Azure/service-fabric-aspnetcore |https://www.nuget.org |
||Data, Diagnostics and Fabric transport<br>\-Microsoft.ServiceFabric.Data <br>\-Microsoft.ServiceFabric.Data.Interfaces <br>\-Microsoft.ServiceFabric.Diagnostics.Internal <br>\-Microsoft.ServiceFabric.FabricTransport/Internal | 4.0.457 |N/A| https://www.nuget.org |
||Microsoft.ServiceFabric.Data.Extensions | 4.0.457 | N/A |https://www.nuget.org |
|Java SDK |Java SDK | 1.0.5 |N/A |https://mvnrepository.com/artifact/com.microsoft.servicefabric/sf-actors/1.0.5 |
|Eclipse |Service Fabric plug-in for Eclipse | 2.0.7 | N/A |N/A |
|Yeoman |Azure Service Fabric Java generator | 1.0.7 |https://github.com/Azure/generator-azuresfjava |N/A |
||Azure Service Fabric C# generator | 1.0.9 |https://github.com/Azure/generator-azuresfcsharp |N/A |
||Azure Service Fabric guest executables generator | 1.0.1 |https://github.com/Azure/generator-azuresfguest |N/A|
||Azure Service Fabric Container generators | 1.0.1 |https://github.com/Azure/generator-azuresfcontainer |N/A |
|CLI |Service Fabric CLI | 8.0.0 |https://github.com/Azure/service-fabric-cli |https://pypi.python.org/pypi/sfctl |
|PowerShell |AzureRM.ServiceFabric | 0.3.15 |https://github.com/Azure/azure-powershell/tree/preview/src/ResourceManager/ServiceFabric |https://www.powershellgallery.com/packages/AzureRM.ServiceFabric/0.3.15  |

