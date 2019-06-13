---
title: Package an Azure Service Fabric app | Microsoft Docs
description: How to package a Service Fabric application before deploying to a cluster.
services: service-fabric
documentationcenter: .net
author: athinanthny
manager: chackdan
editor: mani-ramaswamy

ms.assetid:
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: conceptual
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 2/23/2018
ms.author: atsenthi

---
# Package an application

This article describes how to package a Service Fabric application and make it ready for deployment.

## Package layout

The application manifest, one or more service manifests, and other necessary package files must be organized in a specific layout for deployment into a Service Fabric cluster. The example manifests in this article would need to be organized in the following directory structure:

```
tree /f .\MyApplicationType
```

```Output
D:\TEMP\MYAPPLICATIONTYPE
│   ApplicationManifest.xml
│
└───MyServiceManifest
    │   ServiceManifest.xml
    │
    ├───MyCode
    │       MyServiceHost.exe
    │
    ├───MyConfig
    │       Settings.xml
    │
    └───MyData
            init.dat
```

The folders are named to match the **Name** attributes of each corresponding element. For example, if the service manifest contained two code packages with the names **MyCodeA** and **MyCodeB**, then two folders with the same names would contain the necessary binaries for each code package.

## Use SetupEntryPoint

Typical scenarios for using **SetupEntryPoint** are when you need to run an executable before the service starts or you need to perform an operation with elevated privileges. For example:

* Setting up and initializing environment variables that the service executable needs. It is not limited to only executables written via the Service Fabric programming models. For example, npm.exe needs some environment variables configured for deploying a node.js application.
* Setting up access control by installing security certificates.

For more information on how to configure the **SetupEntryPoint**, see [Configure the policy for a service setup entry point](service-fabric-application-runas-security.md)

<a id="Package-App"></a>

## Configure

### Build a package by using Visual Studio

If you use Visual Studio 2015 to create your application, you can use the Package command to automatically create a package that matches the layout described above.

To create a package, right-click the application project in Solution Explorer and choose the Package command, as shown below:

![Packaging an application with Visual Studio][vs-package-command]

When packaging is complete, you can find the location of the package in the **Output** window. The packaging step occurs automatically when you deploy or debug your application in Visual Studio.

### Build a package by command line

It is also possible to programmatically package up your application using `msbuild.exe`. Under the hood, Visual Studio is running it so the output is same.

```shell
D:\Temp> msbuild HelloWorld.sfproj /t:Package
```

## Test the package

You can verify the package structure locally through PowerShell by using the [Test-ServiceFabricApplicationPackage](/powershell/module/servicefabric/test-servicefabricapplicationpackage?view=azureservicefabricps) command.
This command checks for manifest parsing issues and verify all references. This command only verifies the structural correctness of the directories and files in the package.
It doesn't verify any of the code or data package contents beyond checking that all necessary files are present.

```powershell
Test-ServiceFabricApplicationPackage .\MyApplicationType
```

```Output
False
Test-ServiceFabricApplicationPackage : The EntryPoint MySetup.bat is not found.
FileName: C:\Users\servicefabric\AppData\Local\Temp\TestApplicationPackage_7195781181\nrri205a.e2h\MyApplicationType\MyServiceManifest\ServiceManifest.xml
```

This error shows that the *MySetup.bat* file referenced in the service manifest **SetupEntryPoint** is missing from the code package. After the missing file is added, the application verification passes:

```
tree /f .\MyApplicationType
```

```Output
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
```

```powershell
Test-ServiceFabricApplicationPackage .\MyApplicationType
```

```Output
True
```

If your application has [application parameters](service-fabric-manage-multiple-environment-app-configuration.md) defined, you can pass them in [Test-ServiceFabricApplicationPackage](/powershell/module/servicefabric/test-servicefabricapplicationpackage?view=azureservicefabricps) for proper validation.

If you know the cluster where the application will be deployed, it is recommended you pass in the `ImageStoreConnectionString` parameter. In this case, the package is also validated against previous versions of the application
that are already running in the cluster. For example, the validation can detect whether a package with the same version but different content was already deployed.  

Once the application is packaged correctly and passes validation, consider compressing the package for faster deployment operations.

## Compress a package

When a package is large or has many files, you can compress it for faster deployment. Compression reduces the number of files and the package size.
For a compressed application package, [uploading the application package](service-fabric-deploy-remove-applications.md#upload-the-application-package) may take longer compared to uploading the uncompressed package, especially if compression is done as part of copy. With compression, [registering](service-fabric-deploy-remove-applications.md#register-the-application-package) and [un-registering the application type](service-fabric-deploy-remove-applications.md#unregister-an-application-type) are faster.

The deployment mechanism is same for compressed and uncompressed packages. If the package is compressed, it is stored as such in the cluster image store and it's uncompressed on the node before the application is run.
The compression replaces the valid Service Fabric package with the compressed version. The folder must allow write permissions. Running compression on an already compressed package yields no changes.

You can compress a package by running the Powershell command [Copy-ServiceFabricApplicationPackage](/powershell/module/servicefabric/copy-servicefabricapplicationpackage?view=azureservicefabricps)
with `CompressPackage` switch. You can uncompress the package with the same command, using `UncompressPackage` switch.

The following command compresses the package without copying it to the image store. You can copy a compressed package to one or more Service Fabric clusters, as needed, using [Copy-ServiceFabricApplicationPackage](/powershell/module/servicefabric/copy-servicefabricapplicationpackage?view=azureservicefabricps)
without the `SkipCopy` flag.
The package now includes zipped files for the `code`, `config`, and `data` packages. The application manifest and the service manifests are not zipped,
because they are needed for many internal operations. For example, package sharing, application type name and version extraction for certain validations all need to access the manifests. Zipping the manifests would make these operations inefficient.

```
tree /f .\MyApplicationType
```

```Output
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
```

```powershell
Copy-ServiceFabricApplicationPackage -ApplicationPackagePath .\MyApplicationType -CompressPackage -SkipCopy
tree /f .\MyApplicationType
```

```Output
D:\TEMP\MYAPPLICATIONTYPE
│   ApplicationManifest.xml
│
└───MyServiceManifest
       ServiceManifest.xml
       MyCode.zip
       MyConfig.zip
       MyData.zip

```

Alternatively, you can compress and copy the package with [Copy-ServiceFabricApplicationPackage](/powershell/module/servicefabric/copy-servicefabricapplicationpackage?view=azureservicefabricps) in one step.
If the package is large, provide a high enough timeout to allow time for both the package compression and the upload to the cluster.

```powershell
Copy-ServiceFabricApplicationPackage -ApplicationPackagePath .\MyApplicationType -ApplicationPackagePathInImageStore MyApplicationType -ImageStoreConnectionString fabric:ImageStore -CompressPackage -TimeoutSec 5400
```

Internally, Service Fabric computes checksums for the application packages for validation. When using compression, the checksums are computed on the zipped versions of each package. Generating a new zip from the same application package creates different checksums. To prevent validation errors, use [diff provisioning](service-fabric-application-upgrade-advanced.md). With this option, do not include the unchanged packages in the new version. Instead, reference them directly from the new service manifest.

If diff provisioning is not an option and you must include the packages, generate new versions for the `code`, `config`, and `data` packages to avoid checksum mismatch. Generating new versions for unchanged packages is necessary when a compressed package is used, regardless of whether previous version uses compression or not.

The package is now packaged correctly, validated, and compressed (if needed), so it is ready for [deployment](service-fabric-deploy-remove-applications.md) to one or more Service Fabric clusters.

### Compress packages when deploying using Visual Studio

You can instruct Visual Studio to compress packages on deployment, by adding the `CopyPackageParameters` element to your publish profile, and set the `CompressPackage` attribute to `true`.

``` xml
    <PublishProfile xmlns="http://schemas.microsoft.com/2015/05/fabrictools">
        <ClusterConnectionParameters ConnectionEndpoint="mycluster.westus.cloudapp.azure.com" />
        <ApplicationParameterFile Path="..\ApplicationParameters\Cloud.xml" />
        <CopyPackageParameters CompressPackage="true"/>
    </PublishProfile>
```

## Create an sfpkg

Starting with version 6.1, Service Fabric allows provisioning from an external store.
With this option, the application package doesn't have to be copied to the image store. Instead, you can create an `sfpkg` and upload it to an external store, then provide the download URI to Service Fabric when provisioning. The same package can be provisioned to multiple clusters. Provisioning from the external store saves the time needed to copy the package to each cluster.

The `sfpkg` file is a zip that contains the initial application package and has the extension ".sfpkg".
Inside the zip, the application package can be compressed or uncompressed. The compression of the application package inside the zip is done at code, config, and data package levels, as [mentioned earlier](service-fabric-package-apps.md#compress-a-package).

To create an `sfpkg`, start with a folder that contains the original application package, compressed or not. Then, use any utility to zip the folder with the extension ".sfpkg". For example, use [ZipFile.CreateFromDirectory](https://msdn.microsoft.com/library/hh485721(v=vs.110).aspx).

```csharp
ZipFile.CreateFromDirectory(appPackageDirectoryPath, sfpkgFilePath);
```

The `sfpkg` must be uploaded to the external store out of band, outside of Service Fabric. The external store can be any store that exposes a REST http or https endpoint. During provisioning, Service Fabric executes a GET operation to download the `sfpkg` application package, so the store must allow READ access for the package.

To provision the package, use external provision, which requires the download URI and the application type information.

>[!NOTE]
> Provisioning based on image store relative path doesn't currently support `sfpkg` files. Therefore, the `sfpkg` should not be copied to the image store.

## Next steps

[Deploy and remove applications][10] describes how to use PowerShell to manage application instances

[Managing application parameters for multiple environments][11] describes how to configure parameters and environment variables for different application instances.

[Configure security policies for your application][12] describes how to run services under security policies to restrict access.

<!--Image references-->
[vs-package-command]: ./media/service-fabric-package-apps/vs-package-command.png

<!--Link references--In actual articles, you only need a single period before the slash-->
[10]: service-fabric-deploy-remove-applications.md
[11]: service-fabric-manage-multiple-environment-app-configuration.md
[12]: service-fabric-application-runas-security.md