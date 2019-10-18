---
title: Deploy a Node.js application that uses MongoDB to Azure Service Fabric | Microsoft Docs
description: Walkthrough on how to package multiple guest executables to deploy to an Azure Service Fabric cluster
services: service-fabric
documentationcenter: .net
author: mikkelhegn
manager: chackdan
editor: ''

ms.assetid: b76bb756-c1ba-49f9-9666-e9807cf8f92f
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: conceptual
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 02/23/2018
ms.author: mikhegn

---
# Deploy multiple guest executables
This article shows how to package and deploy multiple guest executables to Azure Service Fabric. For building and deploying a single Service Fabric package read how to [deploy a guest executable to Service Fabric](service-fabric-deploy-existing-app.md).

While this walkthrough shows how to deploy an application with a Node.js front end that uses MongoDB as the data store, you can apply the steps to any application that has dependencies on another application.   

You can use Visual Studio to produce the application package that contains multiple guest executables. See [Using Visual Studio to package an existing application](service-fabric-deploy-existing-app.md). After you have added the first guest executable, right click on the application project and select the **Add->New Service Fabric service** to add the second guest executable project to the solution. Note: If you choose to link the source in the Visual Studio project, building the Visual Studio solution, will make sure that your application package is up to date with changes in the source. 

## Samples
* [Sample for packaging and deploying a guest executable](https://github.com/Azure-Samples/service-fabric-dotnet-getting-started)
* [Sample of two guest executables (C# and nodejs) communicating via the Naming service using REST](https://github.com/Azure-Samples/service-fabric-containers)

## Manually package the multiple guest executable application
Alternatively you can manually package the guest executable. For details, see [Manually package and deploy an existing executable](service-fabric-deploy-existing-app.md#manually-package-and-deploy-an-existing-executable).

### Packaging the Node.js application
This article assumes that Node.js is not installed on the nodes in the Service Fabric cluster. As a consequence, you need to add Node.exe to the root directory of your node application before packaging. The directory structure of the Node.js application (using Express web framework and Jade template engine) should look similar to the one below:

```
|-- NodeApplication
    |-- bin
        |-- www
    |-- node_modules
        |-- .bin
        |-- express
        |-- jade
        |-- etc.
    |-- public
        |-- images
        |-- etc.
    |-- routes
        |-- index.js
        |-- users.js
    |-- views
        |-- index.jade
        |-- etc.
    |-- app.js
    |-- package.json
    |-- node.exe
```

As a next step, you create an application package for the Node.js application. The code below creates a Service Fabric application package that contains the Node.js application.

```
.\ServiceFabricAppPackageUtil.exe /source:'[yourdirectory]\MyNodeApplication' /target:'[yourtargetdirectory] /appname:NodeService /exe:'node.exe' /ma:'bin/www' /AppType:NodeAppType
```

Below is a description of the parameters that are being used:

* **/source** points to the directory of the application that should be packaged.
* **/target** defines the directory in which the package should be created. This directory has to be different from the source directory.
* **/appname** defines the application name of the existing application. It's important to understand that this translates to the service name in the manifest, and not to the Service Fabric application name.
* **/exe** defines the executable that Service Fabric is supposed to launch, in this case `node.exe`.
* **/ma** defines the argument that is being used to launch the executable. As Node.js is not installed, Service Fabric needs to launch the Node.js web server by executing `node.exe bin/www`.  `/ma:'bin/www'` tells the packaging tool to use `bin/www` as the argument for node.exe.
* **/AppType** defines the Service Fabric application type name.

If you browse to the directory that was specified in the /target parameter, you can see that the tool has created a fully functioning Service Fabric package as shown below:

```
|--[yourtargetdirectory]
    |-- NodeApplication
        |-- C
              |-- bin
              |-- data
              |-- node_modules
              |-- public
              |-- routes
              |-- views
              |-- app.js
              |-- package.json
              |-- node.exe
        |-- config
              |--Settings.xml
        |-- ServiceManifest.xml
    |-- ApplicationManifest.xml
```
The generated ServiceManifest.xml now has a section that describes how the Node.js web server should be launched, as shown in the code snippet below:

```xml
<CodePackage Name="C" Version="1.0">
    <EntryPoint>
        <ExeHost>
            <Program>node.exe</Program>
            <Arguments>'bin/www'</Arguments>
            <WorkingFolder>CodePackage</WorkingFolder>
        </ExeHost>
    </EntryPoint>
</CodePackage>
```
In this sample, the Node.js web server listens to port 3000, so you need to update the endpoint information in the ServiceManifest.xml file as shown below.   

```xml
<Resources>
      <Endpoints>
         <Endpoint Name="NodeServiceEndpoint" Protocol="http" Port="3000" Type="Input" />
      </Endpoints>
</Resources>
```
### Packaging the MongoDB application
Now that you have packaged the Node.js application, you can go ahead and package MongoDB. As mentioned before, the steps that you go through now are not specific to Node.js and MongoDB. In fact, they apply to all applications that are meant to be packaged together as one Service Fabric application.  

To package MongoDB, you want to make sure you package Mongod.exe and Mongo.exe. Both binaries are located in the `bin` directory of your MongoDB installation directory. The directory structure looks similar to the one below.

```
|-- MongoDB
    |-- bin
        |-- mongod.exe
        |-- mongo.exe
        |-- anybinary.exe
```
Service Fabric needs to start MongoDB with a command similar to the one below, so you need to use the `/ma` parameter when packaging MongoDB.

```
mongod.exe --dbpath [path to data]
```
> [!NOTE]
> The data is not being preserved in the case of a node failure if you put the MongoDB data directory on the local directory of the node. You should either use durable storage or implement a MongoDB replica set in order to prevent data loss.  
>
>

In PowerShell or the command shell, we run the packaging tool with the following parameters:

```
.\ServiceFabricAppPackageUtil.exe /source: [yourdirectory]\MongoDB' /target:'[yourtargetdirectory]' /appname:MongoDB /exe:'bin\mongod.exe' /ma:'--dbpath [path to data]' /AppType:NodeAppType
```

In order to add MongoDB to your Service Fabric application package, you need to make sure that the /target parameter points to the same directory that already contains the application manifest along with the Node.js application. You also need to make sure that you are using the same ApplicationType name.

Let's browse to the directory and examine what the tool has created.

```
|--[yourtargetdirectory]
    |-- MyNodeApplication
    |-- MongoDB
        |-- C
            |--bin
                |-- mongod.exe
                |-- mongo.exe
                |-- etc.
        |-- config
            |--Settings.xml
        |-- ServiceManifest.xml
    |-- ApplicationManifest.xml
```
As you can see, the tool added a new folder, MongoDB, to the directory that contains the MongoDB binaries. If you open the `ApplicationManifest.xml` file, you can see that the package now contains both the Node.js application and MongoDB. The code below shows the content of the application manifest.

```xml
<ApplicationManifest xmlns:xsd="https://www.w3.org/2001/XMLSchema" xmlns:xsi="https://www.w3.org/2001/XMLSchema-instance" ApplicationTypeName="MyNodeApp" ApplicationTypeVersion="1.0" xmlns="http://schemas.microsoft.com/2011/01/fabric">
   <ServiceManifestImport>
      <ServiceManifestRef ServiceManifestName="MongoDB" ServiceManifestVersion="1.0" />
   </ServiceManifestImport>
   <ServiceManifestImport>
      <ServiceManifestRef ServiceManifestName="NodeService" ServiceManifestVersion="1.0" />
   </ServiceManifestImport>
   <DefaultServices>
      <Service Name="MongoDBService">
         <StatelessService ServiceTypeName="MongoDB">
            <SingletonPartition />
         </StatelessService>
      </Service>
      <Service Name="NodeServiceService">
         <StatelessService ServiceTypeName="NodeService">
            <SingletonPartition />
         </StatelessService>
      </Service>
   </DefaultServices>
</ApplicationManifest>  
```

### Publishing the application
The last step is to publish the application to the local Service Fabric cluster by using the PowerShell scripts below:

```
Connect-ServiceFabricCluster localhost:19000

Write-Host 'Copying application package...'
Copy-ServiceFabricApplicationPackage -ApplicationPackagePath '[yourtargetdirectory]' -ImageStoreConnectionString 'file:C:\SfDevCluster\Data\ImageStoreShare' -ApplicationPackagePathInImageStore 'NodeAppType'

Write-Host 'Registering application type...'
Register-ServiceFabricApplicationType -ApplicationPathInImageStore 'NodeAppType'

New-ServiceFabricApplication -ApplicationName 'fabric:/NodeApp' -ApplicationTypeName 'NodeAppType' -ApplicationTypeVersion 1.0  
```

Once the application is successfully published to the local cluster, you can access the Node.js application on the port that we have entered in the service manifest of the Node.js application--for example http:\//localhost:3000.

In this tutorial, you have seen how to easily package two existing applications as one Service Fabric application. You have also learned how to deploy it to Service Fabric so that it can benefit from some of the Service Fabric features, such as high availability and health system integration.

## Adding more guest executables to an existing application using Yeoman on Linux

To add another service to an application already created using `yo`, perform the following steps: 
1. Change directory to the root of the existing application.  For example, `cd ~/YeomanSamples/MyApplication`, if `MyApplication` is the application created by Yeoman.
2. Run `yo azuresfguest:AddService` and provide the necessary details.

## Next steps
* Learn about deploying containers with [Service Fabric and containers overview](service-fabric-containers-overview.md)
* [Sample for packaging and deploying a guest executable](https://github.com/Azure-Samples/service-fabric-dotnet-getting-started)
* [Sample of two guest executables (C# and nodejs) communicating via the Naming service using REST](https://github.com/Azure-Samples/service-fabric-containers)
