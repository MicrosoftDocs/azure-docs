---
title: Service Fabric application deployment | Microsoft Docs
description: How to deploy and remove applications in Service Fabric
services: service-fabric
documentationcenter: .net
author: rwike77
manager: timlt
editor: ''

ms.assetid: b120ffbf-f1e3-4b26-a492-347c29f8f66b
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 02/23/2017
ms.author: ryanwi

---
# Deploy and remove applications using PowerShell
> [!div class="op_single_selector"]
> * [PowerShell](service-fabric-deploy-remove-applications.md)
> * [Visual Studio](service-fabric-publish-app-remote-cluster.md)
> * [FabricClient APIs](service-fabric-deploy-remove-applications-fabricclient.md)
> 
> 

<br/>

Once an [application type has been packaged][10], it's ready for deployment into an Azure Service Fabric cluster. Deployment involves the following three steps:

1. Upload the application package to the image store
2. Register the application type
3. Create the application instance

After an app is deployed and an instance is running in the cluster, you can delete the app instance and its application type. To completely remove an app from the cluster involves the following steps:

1. Remove (or delete) the running application instance
2. Unregister the application type if you no longer need it
3. Remove the application package from the image store

If you use [Visual Studio for deploying and debugging applications](service-fabric-publish-app-remote-cluster.md) on your local development cluster, all the preceding steps are handled automatically through a PowerShell script.  This script is found in the *Scripts* folder of the application project. This article provides background on what that script is doing so that you can perform the same operations outside of Visual Studio. 
 
## Connect to the cluster
Before you run any PowerShell commands in this article, always start by using [Connect-ServiceFabricCluster](/powershell/module/servicefabric/connect-servicefabriccluster?view=azureservicefabricps) to connect to the Service Fabric cluster. To connect to the local development cluster, run the following:

```powershell
PS C:\>Connect-ServiceFabricCluster
```

For examples of connecting to a remote cluster or cluster secured using Azure Active Directory, X509 certificates, or Windows Active Directory see [Connect to a secure cluster](service-fabric-connect-to-secure-cluster.md).

## Upload the application package
Uploading the application package puts it in a location that's accessible by internal Service Fabric components.
If you want to verify the application package locally, use the [Test-ServiceFabricApplicationPackage](/powershell/module/servicefabric/test-servicefabricapplicationpackage?view=azureservicefabricps) cmdlet.

The [Copy-ServiceFabricApplicationPackage](/powershell/module/servicefabric/copy-servicefabricapplicationpackage?view=azureservicefabricps) command uploads the application package to the cluster image store.
The **Get-ImageStoreConnectionStringFromClusterManifest** cmdlet, which is part of the Service Fabric SDK PowerShell module, is used to get the image store connection string.  To import the SDK module, run:

```powershell
Import-Module "$ENV:ProgramFiles\Microsoft SDKs\Service Fabric\Tools\PSModule\ServiceFabricSDK\ServiceFabricSDK.psm1"
```

Suppose you build and package an app named *MyApplication* in Visual Studio. By default, the application type name listed in the ApplicationManifest.xml is "MyApplicationType".  The application package, which contains the necessary application manifest, service manifests, and code/config/data packages, is located in *C:\Users\username\Documents\Visual Studio 2015\Projects\MyApplication\MyApplication\pkg\Debug*. 

The following command lists the contents of the application package:

```powershell
PS C:\> $path = 'C:\Users\user\Documents\Visual Studio 2015\Projects\MyApplication\MyApplication\pkg\Debug'
PS C:\> tree /f $path
Folder PATH listing for volume OSDisk
Volume serial number is 0459-2393
C:\USERS\USER\DOCUMENTS\VISUAL STUDIO 2015\PROJECTS\MYAPPLICATION\MYAPPLICATION\PKG\DEBUG
│   ApplicationManifest.xml
│
└───Stateless1Pkg
    │   ServiceManifest.xml
    │
    ├───Code
    │       Microsoft.ServiceFabric.Data.dll
    │       Microsoft.ServiceFabric.Data.Interfaces.dll
    │       Microsoft.ServiceFabric.Internal.dll
    │       Microsoft.ServiceFabric.Internal.Strings.dll
    │       Microsoft.ServiceFabric.Services.dll
    │       ServiceFabricServiceModel.dll
    │       Stateless1.exe
    │       Stateless1.exe.config
    │       Stateless1.pdb
    │       System.Fabric.dll
    │       System.Fabric.Strings.dll
    │
    └───Config
            Settings.xml
```

If the application package is large and/or has many files, you can [compress it](service-fabric-package-apps.md#compress-a-package). The compression reduces the size and the number of files.
The side effect is that registering and un-registering the application type are faster. Upload time may be slower currently, especially if you include the time to compress the package. 

To compress a package, use the same [Copy-ServiceFabricApplicationPackage](/powershell/module/servicefabric/copy-servicefabricapplicationpackage?view=azureservicefabricps) command. Compression can be done separate from upload,
by using the `SkipCopy` flag, or together with the upload operation. Applying compression on a compressed package is no-op.
To uncompress a compressed package, use the same [Copy-ServiceFabricApplicationPackage](/powershell/module/servicefabric/copy-servicefabricapplicationpackage?view=azureservicefabricps) command with the `UncompressPackage` switch.

The following cmdlet compresses the package without copying it to the image store. The package now includes zipped files for the `Code` and `Config` packages. 
The application and the service manifests are not zipped, because they are needed for many internal operations (like package sharing, application type name and version extraction for certain validations). Zipping the manifests would make these operations inefficient.

```
PS C:\> Copy-ServiceFabricApplicationPackage -ApplicationPackagePath $path -CompressPackage -SkipCopy
PS C:\> tree /f $path
Folder PATH listing for volume OSDisk
Volume serial number is 0459-2393
C:\USERS\USER\DOCUMENTS\VISUAL STUDIO 2015\PROJECTS\MYAPPLICATION\MYAPPLICATION\PKG\DEBUG
|   ApplicationManifest.xml
|
└───Stateless1Pkg
       Code.zip
       Config.zip
       ServiceManifest.xml
```

For large application packages, the compression takes time. For best results, use a fast SSD drive. The compression times and the size of the compressed package also differ based on the package content.
For example, here is compression statistics for some packages, which show the initial and the compressed package size, with the compression time.

|Initial size (MB)|File count|Compression Time|Compressed package size (MB)|
|----------------:|---------:|---------------:|---------------------------:|
|100|100|00:00:03.3547592|60|
|512|100|00:00:16.3850303|307|
|1024|500|00:00:32.5907950|615|
|2048|1000|00:01:04.3775554|1231|
|5012|100|00:02:45.2951288|3074|

Once a package is compressed, it can be uploaded to one or multiple Service Fabric clusters as needed. The deploy mechanism is same for compressed and uncompressed packages. If the package is compressed, it is stored as such in the cluster image store and it's uncompressed on the node before the application is run.


The following example uploads the package to the image store, into a folder named "MyApplicationV1":

```powershell
PS C:\> Copy-ServiceFabricApplicationPackage -ApplicationPackagePath $path -ApplicationPackagePathInImageStore MyApplicationV1 -ImageStoreConnectionString (Get-ImageStoreConnectionStringFromClusterManifest(Get-ServiceFabricClusterManifest)) -TimeoutSec 1800
```

If you do not specify the *-ApplicationPackagePathInImageStore* parameter, the app package is copied into the "Debug" folder in the image store.

The time it takes to upload a package differs depending on multiple factors. Some of these factors are the number of files in the package, the package size, and the file sizes. The network speed between
the source machine and the Service Fabric cluster also impacts the upload time. 
The default timeout for [Copy-ServiceFabricApplicationPackage](/powershell/module/servicefabric/copy-servicefabricapplicationpackage?view=azureservicefabricps) is 30 minutes.
Depending on the described factors, you may have to increase the timeout. If you are compressing the package in the copy call, you need to also consider the compression time.

See [Understand the image store connection string](service-fabric-image-store-connection-string.md) for supplementary information about the image store and image store connection string.

## Register the application package
The application type and version declared in the application manifest become available for use when the app package is registered. The system reads the package uploaded in the previous step, verifies the package, processes the package contents, and copies the processed package to an internal system location.  

Run the [Register-ServiceFabricApplicationType](/powershell/module/servicefabric/register-servicefabricapplicationtype?view=azureservicefabricps) cmdlet to register the application type in the cluster and make it available for deployment:

```powershell
PS C:\> Register-ServiceFabricApplicationType MyApplicationV1
Register application type succeeded
```

"MyApplicationV1" is the folder in the image store where the app package is located. The application type with name "MyApplicationType" and version "1.0.0" (both are found in the application manifest) is now registered in the cluster.

The [Register-ServiceFabricApplicationType](/powershell/module/servicefabric/register-servicefabricapplicationtype?view=azureservicefabricps) command returns only after the system has successfully registered the application package. How long registration takes depends on the size and contents of the application package. If needed, the **-TimeoutSec** parameter can be used to supply a longer timeout (the default timeout is 60 seconds).

If you have a large app package or if you are experiencing timeouts, use the **-Async** parameter. The command returns when the cluster accepts the register command, and the processing continues as needed.
The [Get-ServiceFabricApplicationType](/powershell/module/servicefabric/get-servicefabricapplicationtype?view=azureservicefabricps) command lists all successfully registered application type versions and their registration status. You can use
this command to determine when the registration is done.

```powershell
PS C:\> Get-ServiceFabricApplicationType

ApplicationTypeName    : MyApplicationType
ApplicationTypeVersion : 1.0.0
Status                 : Available
DefaultParameters      : { "Stateless1_InstanceCount" = "-1" }
```

## Create the application
You can instantiate an application from any application type version that has been registered successfully by using the [New-ServiceFabricApplication](/powershell/module/servicefabric/new-servicefabricapplication?view=azureservicefabricps) cmdlet. The name of each application must start with the *fabric:* scheme and be unique for each application instance. Any default services defined in the application manifest of the target application type are also created.

```powershell
PS C:\> New-ServiceFabricApplication fabric:/MyApp MyApplicationType 1.0.0

ApplicationName        : fabric:/MyApp
ApplicationTypeName    : MyApplicationType
ApplicationTypeVersion : 1.0.0
ApplicationParameters  : {}
```
Multiple application instances can be created for any given version of a registered application type. Each application instance runs in isolation, with its own work directory and process.

To see which named apps and services are running in the cluster, run the [Get-ServiceFabricApplication](/powershell/servicefabric/vlatest/get-servicefabricapplication) and [Get-ServiceFabricService](/powershell/module/servicefabric/get-servicefabricservice?view=azureservicefabricps) cmdlets:

```powershell
PS C:\> Get-ServiceFabricApplication  

ApplicationName        : fabric:/MyApp
ApplicationTypeName    : MyApplicationType
ApplicationTypeVersion : 1.0.0
ApplicationStatus      : Ready
HealthState            : Ok
ApplicationParameters  : {}

PS C:\> Get-ServiceFabricApplication | Get-ServiceFabricService

ServiceName            : fabric:/MyApp/Stateless1
ServiceKind            : Stateless
ServiceTypeName        : Stateless1Type
IsServiceGroup         : False
ServiceManifestVersion : 1.0.0
ServiceStatus          : Active
HealthState            : Ok
```

## Remove an application
When an application instance is no longer needed, you can permanently remove it by name using the [Remove-ServiceFabricApplication](/powershell/module/servicefabric/remove-servicefabricapplication?view=azureservicefabricps) cmdlet. [Remove-ServiceFabricApplication](/powershell/module/servicefabric/remove-servicefabricapplication?view=azureservicefabricps) automatically removes all services that belong to the application as well, permanently removing all service state. This operation cannot be reversed, and application state cannot be recovered.

```powershell
PS C:\> Remove-ServiceFabricApplication fabric:/MyApp

Confirm
Continue with this operation?
[Y] Yes  [N] No  [S] Suspend  [?] Help (default is "Y"):
Remove application instance succeeded

PS C:\> Get-ServiceFabricApplication
```

## Unregister an application type
When a particular version of an application type is no longer needed, you should unregister the application type using the [Unregister-ServiceFabricApplicationType](/powershell/module/servicefabric/unregister-servicefabricapplicationtype?view=azureservicefabricps) cmdlet. Unregistering unused application types releases storage space used by the image store. An application type can be unregistered as long as no applications are instantiated against it and no pending application upgrades are referencing it.

Run [Get-ServiceFabricApplicationType](/powershell/module/servicefabric/get-servicefabricapplicationtype?view=azureservicefabricps) to see the application types currently registered in the cluster:

```powershell
PS C:\> Get-ServiceFabricApplicationType

ApplicationTypeName    : MyApplicationType
ApplicationTypeVersion : 1.0.0
Status                 : Available
DefaultParameters      : { "Stateless1_InstanceCount" = "-1" }
```

Run [Unregister-ServiceFabricApplicationType](/powershell/module/servicefabric/unregister-servicefabricapplicationtype?view=azureservicefabricps) to unregister a specific application type:

```powershell
PS C:\> Unregister-ServiceFabricApplicationType MyApplicationType 1.0.0
```

## Remove an application package from the image store
When an application package is no longer needed, you can delete it from the image store to free up system resources.

```powershell
PS C:\>Remove-ServiceFabricApplicationPackage -ApplicationPackagePathInImageStore MyApplicationV1 -ImageStoreConnectionString (Get-ImageStoreConnectionStringFromClusterManifest(Get-ServiceFabricClusterManifest))
```

## Troubleshooting
### Copy-ServiceFabricApplicationPackage asks for an ImageStoreConnectionString
The Service Fabric SDK environment should already have the correct defaults set up. But if needed, the ImageStoreConnectionString for all commands should match the value that the Service Fabric cluster is using. You can find the ImageStoreConnectionString in the cluster manifest, retrieved using the [Get-ServiceFabricClusterManifest](/powershell/module/servicefabric/get-servicefabricclustermanifest?view=azureservicefabricps) commanC:

```powershell
PS C:\> Get-ServiceFabricClusterManifest
```

The ImageStoreConnectionString is found in the cluster manifest:

```xml
<ClusterManifest xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" Name="Server-Default-SingleNode" Version="1.0" xmlns="http://schemas.microsoft.com/2011/01/fabric">

    [...]

    <Section Name="Management">
      <Parameter Name="ImageStoreConnectionString" Value="file:D:\ServiceFabric\Data\ImageStore" />
    </Section>

    [...]
```

See [Understand the image store connection string](service-fabric-image-store-connection-string.md) for supplementary information about the image store and image store connection string.

### Deploy large application package
Issue: [Copy-ServiceFabricApplicationPackage](/powershell/module/servicefabric/copy-servicefabricapplicationpackage?view=azureservicefabricps) times out for a large application package (order of GB).
Try:
- Specify a larger timeout for [Copy-ServiceFabricApplicationPackage](/powershell/module/servicefabric/copy-servicefabricapplicationpackage?view=azureservicefabricps) command, with `TimeoutSec` parameter. By default, the timeout is 30 minutes.
- Check the network connection between your source machine and cluster. If the connection is slow, consider using a machine with a better network connection.
If the client machine is in another region than the cluster, consider using a client machine in a closer or same region as the cluster.
- Check if you are hitting external throttling. For example, when the image store is configured to use azure storage, upload may be throttled.

Issue: Upload package completed successfully, but [Register-ServiceFabricApplicationType](/powershell/module/servicefabric/register-servicefabricapplicationtype?view=azureservicefabricps) times out.
Try:
- [Compress the package](service-fabric-package-apps.md#compress-a-package) before copying to the image store.
The compression reduces the size and the number of files, which in turn reduces the amount of traffic and work that Service Fabric must perform. The upload operation may be slower (especially if you include the compression time), but register and un-register the application type are faster.
- Specify a larger timeout for [Register-ServiceFabricApplicationType](/powershell/module/servicefabric/register-servicefabricapplicationtype?view=azureservicefabricps) with `TimeoutSec` parameter.
- Specify `Async` switch for [Register-ServiceFabricApplicationType](/powershell/module/servicefabric/register-servicefabricapplicationtype?view=azureservicefabricps). The command returns when the cluster accepts the command and the provision continues async.
For this reason, there is no need to specify a higher timeout in this case.

### Deploy application package with many files
Issue: [Register-ServiceFabricApplicationType](/powershell/module/servicefabric/register-servicefabricapplicationtype?view=azureservicefabricps) times out for an application package with many files (order of thousands).
Try:
- [Compress the package](service-fabric-package-apps.md#compress-a-package) before copying to the image store. The compression reduces the number of files.
- Specify a larger timeout for [Register-ServiceFabricApplicationType](/powershell/module/servicefabric/register-servicefabricapplicationtype?view=azureservicefabricps) with `TimeoutSec` parameter.
- Specify `Async` switch for [Register-ServiceFabricApplicationType](/powershell/module/servicefabric/register-servicefabricapplicationtype?view=azureservicefabricps). The command returns when the cluster accepts the command and the provision continues async.
For this reason, there is no need to specify a higher timeout in this case. 

## Next steps
[Service Fabric application upgrade](service-fabric-application-upgrade.md)

[Service Fabric health introduction](service-fabric-health-introduction.md)

[Diagnose and troubleshoot a Service Fabric service](service-fabric-diagnostics-how-to-monitor-and-diagnose-services-locally.md)

[Model an application in Service Fabric](service-fabric-application-model.md)

<!--Link references--In actual articles, you only need a single period before the slash-->
[10]: service-fabric-application-model.md
[11]: service-fabric-application-upgrade.md
