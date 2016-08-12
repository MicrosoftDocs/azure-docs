<properties
   pageTitle="Service Fabric application deployment | Microsoft Azure"
   description="How to deploy and remove applications in Service Fabric"
   services="service-fabric"
   documentationCenter=".net"
   authors="rwike77"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="06/15/2016"
   ms.author="ryanwi"/>

# Deploy an application

Once an [application type has been packaged][10], it's ready for deployment into an Azure Service Fabric cluster. Deployment involves the following three steps:

1. Uploading the application package
2. Registering the application type
3. Creating the application instance

>[AZURE.NOTE] If you use Visual Studio for deploying and debugging applications on your local development cluster, all of the steps described below are handled automatically through a PowerShell script found in the Scripts folder of the application project. This article provides background on what those scripts are doing so that you can perform the same operations outside of Visual Studio.

## Upload the application package

Uploading the application package puts it in a location that's accessible by internal Service Fabric components. You can use PowerShell to perform the upload. Before you run any PowerShell commands in this article, always start by using **Connect-ServiceFabricCluster** to connect to the Service Fabric cluster.

Suppose you have a folder named *MyApplicationType* that contains the necessary application manifest, service manifest(s), and code/config/data package(s). The **Copy-ServiceFabricApplicationPackage** command will upload the package to the cluster image store. The **Get-ImageStoreConnectionStringFromClusterManifest** cmdlet, which is part of the Service Fabric SDK PowerShell module, is used to get the image store connection string.  To import the SDK module, run *Import-Module "$ENV:ProgramFiles\Microsoft SDKs\Service Fabric\Tools\PSModule\ServiceFabricSDK\ServiceFabricSDK.psm1"*.

The following example uploads the package:

~~~
PS D:\temp> dir

    Directory: D:\temp

Mode                LastWriteTime     Length Name
----                -------------     ------ ----
d----         3/19/2015   8:11 PM            MyApplicationType

PS D:\temp> tree /f .\MyApplicationType

D:\TEMP\MYAPPLICATIONTYPE
│   ApplicationManifest.xml
│
└───MyServiceManifest
    │   ServiceManifest.xml
    │
    ├───MyCode
    │       MyServiceHost.exe
    │       MySetup.bat
    │
    ├───MyConfig
    │       Settings.xml
    │
    └───MyData
            init.dat

PS D:\temp> Copy-ServiceFabricApplicationPackage -ApplicationPackagePath MyApplicationType -ImageStoreConnectionString (Get-ImageStoreConnectionStringFromClusterManifest(Get-ServiceFabricClusterManifest))
Copy application package succeeded

PS D:\temp>
~~~

## Register the application package

Registering the application package makes the application type and version declared in the application manifest available for use. The system will read the package uploaded in the previous step, verify the package (equivalent to running **Test-ServiceFabricApplicationPackage** locally), process the package contents, and copy the processed package to an internal system location.

~~~
PS D:\temp> Register-ServiceFabricApplicationType MyApplicationType
Register application type succeeded

PS D:\temp> Get-ServiceFabricApplicationType

ApplicationTypeName    : MyApplicationType
ApplicationTypeVersion : AppManifestVersion1
DefaultParameters      : {}

PS D:\temp>
~~~

The **Register-ServiceFabricApplicationType** command returns only after the system has successfully copied the application package. How long this takes depends on the contents of the application package. The **-TimeoutSec** parameter can be used to supply a longer timeout if needed. (The default timeout is 60 seconds.)

The **Get-ServiceFabricApplicationType** command lists all successfully registered application type versions.

## Create the application

You can instantiate an application by using any application type version that has been registered successfully through the **New-ServiceFabricApplication** command. The name of each application must start with the *fabric:* scheme and be unique for each application instance. If any default services were defined in the application manifest of the target application type, then those will also be created at this time.

~~~
PS D:\temp> New-ServiceFabricApplication fabric:/MyApp MyApplicationType AppManifestVersion1

ApplicationName        : fabric:/MyApp
ApplicationTypeName    : MyApplicationType
ApplicationTypeVersion : AppManifestVersion1
ApplicationParameters  : {}

PS D:\temp> Get-ServiceFabricApplication  

ApplicationName        : fabric:/MyApp
ApplicationTypeName    : MyApplicationType
ApplicationTypeVersion : AppManifestVersion1
ApplicationStatus      : Ready
HealthState            : OK
ApplicationParameters  : {}

PS D:\temp> Get-ServiceFabricApplication | Get-ServiceFabricService

ServiceName            : fabric:/MyApp/MyService
ServiceKind            : Stateless
ServiceTypeName        : MyServiceType
IsServiceGroup         : False
ServiceManifestVersion : SvcManifestVersion1
ServiceStatus          : Active
HealthState            : Ok

PS D:\temp>
~~~

The **Get-ServiceFabricApplication** command lists all application instances that were successfully created, along with their overall status.

The **Get-ServiceFabricService** command lists all service instances that were successfully created within a given application instance. Default services (if any) will be listed here.

Multiple application instances can be created for any given version of a registered application type. Each application instance will run in isolation, with its own work directory and process.

## Remove an application

When an application instance is no longer needed, you can permanently remove it by using the **Remove-ServiceFabricApplication** command. This command will automatically remove all services that belong to the application as well, permanently removing all service state. This operation cannot be reversed, and application state cannot be recovered.

~~~
PS D:\temp> Remove-ServiceFabricApplication fabric:/MyApp

Confirm
Continue with this operation?
[Y] Yes  [N] No  [S] Suspend  [?] Help (default is "Y"):
Remove application instance succeeded

PS D:\temp> Get-ServiceFabricApplication
PS D:\temp>
~~~

When a particular version of an application type is no longer needed, you should unregister it by using the **Unregister-ServiceFabricApplicationType** command. Unregistering unused types will release storage space used by the application package contents of that type on the image store. An application type can be unregistered as long as no applications are instantiated against it and no pending application upgrades are referencing it.

~~~
PS D:\temp> Get-ServiceFabricApplicationType

ApplicationTypeName    : DemoAppType
ApplicationTypeVersion : v1
DefaultParameters      : {}

ApplicationTypeName    : DemoAppType
ApplicationTypeVersion : v2
DefaultParameters      : {}

ApplicationTypeName    : MyApplicationType
ApplicationTypeVersion : AppManifestVersion1
DefaultParameters      : {}

PS D:\temp> Unregister-ServiceFabricApplicationType MyApplicationType AppManifestVersion1
Unregister application type succeeded

PS D:\temp> Get-ServiceFabricApplicationType

ApplicationTypeName    : DemoAppType
ApplicationTypeVersion : v1
DefaultParameters      : {}

ApplicationTypeName    : DemoAppType
ApplicationTypeVersion : v2
DefaultParameters      : {}

PS D:\temp>
~~~

## Troubleshooting

### Copy-ServiceFabricApplicationPackage asks for an ImageStoreConnectionString

The Service Fabric SDK environment should already have the correct defaults set up. But if needed, the ImageStoreConnectionString for all commands should match the value that the Service Fabric cluster is using. You can find this in the cluster manifest retrieved through the **Get-ServiceFabricClusterManifest** command:

~~~
PS D:\temp> Copy-ServiceFabricApplicationPackage .\MyApplicationType

cmdlet Copy-ServiceFabricApplicationPackage at command pipeline position 1
Supply values for the following parameters:
ImageStoreConnectionString:

PS D:\temp> Get-ServiceFabricClusterManifest
<ClusterManifest xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" Name="Server-Default-SingleNode" Version="1.0" xmlns="http://schemas.microsoft.com/2011/01/fabric">

    [...]

    <Section Name="Management">
      <Parameter Name="ImageStoreConnectionString" Value="file:D:\ServiceFabric\Data\ImageStore" />
    </Section>

    [...]

PS D:\temp> Copy-ServiceFabricApplicationPackage .\MyApplicationType -ImageStoreConnectionString file:D:\ServiceFabric\Data\ImageStore
Copy application package succeeded

PS D:\temp>
~~~

## Next steps

[Service Fabric application upgrade](service-fabric-application-upgrade.md)

[Service Fabric health introduction](service-fabric-health-introduction.md)

[Diagnose and troubleshoot a Service Fabric service](service-fabric-diagnostics-how-to-monitor-and-diagnose-services-locally.md)

[Model an application in Service Fabric](service-fabric-application-model.md)

<!--Link references--In actual articles, you only need a single period before the slash-->
[10]: service-fabric-application-model.md
[11]: service-fabric-application-upgrade.md
