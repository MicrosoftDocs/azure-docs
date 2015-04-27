<properties
   pageTitle="Service Fabric application deployment"
   description="How to deploy and remove applications in Service Fabric"
   services="service-fabric"
   documentationCenter=".net"
   authors="alexwun"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="04/23/2015"
   ms.author="alexwun"/>

# Deploy an application

Once an [application type has been packaged][10], it's ready for deployment into a Service Fabric cluster. Deployment involves the following three steps:

1. Uploading the application package
2. Registering the application type
3. Creating the application instance

>[AZURE.NOTE] If you use Visual Studio for deploying and debugging applications on your local development cluster, all of the steps described below are handled automatically by invoking the PowerShell scripts found in the Scripts folder of the application project. This article provides background on what those scripts are doing so that you can perform the same operations outside of Visual Studio.

## Upload the application package

Uploading the application package puts it in a location accessible by internal Service Fabric components and can be performed through PowerShell. Before running any PowerShell commands in this article, always start by first connecting to the Service Fabric cluster using **Connect-ServiceFabricCluster**.

Suppose you have a folder named *MyApplicationType* containing the necessary application manifest, service manifest(s), and code/config/data package(s), then the **Copy-ServiceFabricApplicationPackage** command will upload the package. For example:

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

PS D:\temp> Copy-ServiceFabricApplicationPackage MyApplicationType
Copy application package succeeded

PS D:\temp>
~~~

## Register the application package

Registering the application package, makes the application type and version declared in the application manifest available for use. The system will read the package uploaded in the previous step, verify the package (equivalent to running **Test-ServiceFabricApplicationPackage** locally), process the package contents, and copy the processed package to an internal system location.

~~~
PS D:\temp> Register-ServiceFabricApplicationType MyApplicationType
Register application type succeeded

PS D:\temp> Get-ServiceFabricApplicationType

ApplicationTypeName    : MyApplicationType
ApplicationTypeVersion : AppManifestVersion1
DefaultParameters      : {}

PS D:\temp>
~~~

The **Register-ServiceFabricApplicationType** command  returns only after the application package has been successfully copied by the system. How long this takes depends on the contents of the application package. The **-TimeoutSec** parameter can be used to supply a longer timeout if needed (the default timeout is 60 seconds).

The **Get-ServiceFabricApplicationType** command will list all successfully registered application type versions.

## Create the application

An application can be instantiated using any application type version that has been registered successfully using the **New-ServiceFabricApplication** command. The name of each application must start with the *fabric:* scheme and be unique for each application instance. If there were any default services defined in the application manifest of the target application type, then those will also be created at this time.

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

The **Get-ServiceFabricApplication** command lists all applications instances that were successfully created along with their overall status.

The **Get-ServiceFabricService** command lists all service instances that were successfully created within a given application instance. Default services (if any) will be listed here.

Multiple application instances can be created for any given version of a registered application type. Each application instance will run in isolation, with its own work directory and process.

## Remove an application

When an application instance is no longer needed, it can be permanently removed using the **Remove-ServiceFabricApplication** command. This will automatically remove all services belonging to the application as well, permanently removing all service state. This operation cannot be reversed and application state cannot be recovered.

~~~
PS D:\temp> Remove-ServiceFabricApplication fabric:/MyApp

Confirm
Continue with this operation?
[Y] Yes  [N] No  [S] Suspend  [?] Help (default is "Y"):
Remove application instance succeeded

PS D:\temp> Get-ServiceFabricApplication
PS D:\temp>
~~~

When a particular version of an application type is no longer needed, it should be unregistered using the **Unregister-ServiceFabricApplicationType** command. Unregistering unused types will release storage space used by the application package contents of that type on the Image Store. An application type can be unregistered as long as there are no applications instantiated against it or pending application upgrades referencing it.

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

<!--
## Next steps

TODO [Upgrade applications][11]
-->

## Troubleshooting

### Copy-ServiceFabricApplicationPackage asks for an ImageStoreConnectionString

The Service Fabric SDK environment should already have the correct defaults set up. But if needed, the ImageStoreConnectionString for all commands should match the value being used by the Service Fabric cluster, which can be found in the cluster manifest retrieved using the **Get-ServiceFabricClusterManifest** command:

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

[Service Fabric Application Upgrade](service-fabric-application-upgrade.md)

[Service Fabric Health Introduction](service-fabric-health-introduction.md)

[Diagnose and troubleshoot a Service Fabric service](service-fabric-diagnose-monitor-your-service-index.md)

[Model an application in Service Fabric](service-fabric-application-model.md)

<!--Link references--In actual articles, you only need a single period before the slash-->
[10]: ./service-fabric-application-model.md
[11]: ./service-fabric-application-upgrade.md
