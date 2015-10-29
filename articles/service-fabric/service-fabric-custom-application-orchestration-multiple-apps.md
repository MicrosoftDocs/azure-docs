<properties
   pageTitle="Deploy a Node.js application using MongoDB | Microsoft Azure"
   description="Walkthrough on how to package multiple applications to deploy to a Azure Service Fabric cluster"
   services="service-fabric"
   documentationCenter=".net"
   authors="bscholl"
   manager=""
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="09/09/2015"
   ms.author="bscholl"/>


# Deploy mulitple existing applications

The main purpose of this tutorial is to show how to package and deploy multiple applications to Service Fabric. For our walkthrough we use a Node.js frontend that uses MongoDB as the data store.   

## Package the Node.js application

Let's assume that our Node.js application is using Express and Jade and that Node.js is not installed on the nodes in the Service fabric cluster. As a consequence we need to add node.exe to the root directory of MyNodeApplication as well. The directory structure of the Node.js application would now look similar to the one below:

```
|-- MyNodeApplication
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

As a next step we create an application package for our Node.js application. The easiest way to create an application package is using the Service Fabric packaging tool that ships as part of the SDK. The packaging tool is located in the Tools folder of the Service Fabric SDK installation path. The default installation location is C:\Program Files\Microsoft SDKs\Service Fabric\Tools. Let's go ahead an browse to the tools folder using command line or PowerShell.

As opposed to [deploying a simple existing applications to Service Fabric ](service-fabric-custom-application-orchestration.md) where we just need to launch an .exe we need to execute something like

```
node.exe bin/www
```
to launch the web server. We can do that by using an argument parameter /ma when running the packaging tool. The code below creates a Service Fabric application package that contains our Node.js application.

```
.\ServiceFabricAppPackageUtil.exe /source:'[yourdirectory]\MyNodeApplication' /target:'[yourtargetdirectory] /appname:NodeService /exe:'node.exe' /ma:'bin/www' /AppType:NodeAppType
```

Before we look at the package itself we should look closer at the parameters that we were using:

- **/source**: Points to the directory of the application that should be packaged
- **/target**: Defines the directory in which the package should be created. This directory should be different from the target directory.
- **/appname**: Defines the application name of our existing application. It's important to understand that this translates to the Service Name in the manifest and not to the Service Fabric application name.
- **/exe**: Defines the executable that Service Fabric is supposed to launch, in our case node.exe
- **/ma**: Define the argument that is being used to launch the executable
- **/AppType**: Defines Service Fabric application type name.

If we browse to the directory that we specified in the /target parameter we can see that the tool has created a fully functioning Service Fabric package as shown below:

```
|--[yourtargetdirectory]
    |-- MyNodeApplication
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
The generated ServiceManifest.xml now has a section that describes how the Node.js web server should be launched as shown in the code snippet below:

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
In our case the Node.js web server listens to port 3000, so we need to update the endpoint information in the ServiceManifest.xml as shown below.   

```xml
<Resources>
      <Endpoints>
     	<Endpoint Name="NodeServiceEndpoint" Protocol="http" Port="3000" Type="Input" />
      </Endpoints>
</Resources>
```
Now that we have packaged our Node.js application we can go ahead and package MongoDB. The steps we will go through now are not specific to Node.js and MongoDB, in fact they apply to all applications that are meant to be packaged together as one Service Fabric application.  
Before we package MongoDB let's have a look at the directory structure.

```
|-- MyNodeApplication
	|-- bin
        |-- mongod.exe
        |-- mongo.exe
        |-- etc.
```
In order to start MongoDB we need to execute a command similar to the one below:

```
mongod.exe --dbpath [path to data]
```
> [AZURE.NOTE] The data is not being preserved in the case of a node failure in case you put the MongoDB data directory on the local directory of the node. You should either use durable storage or implement a MongoDB ReplicaSet in order to prevent data loss.  

To package MongoDB we run a similar command to what we have executed to package the Node.js app.
In PowerShell or Command Shell we run the packaging tool with the following parameters:

```
.\ServiceFabricAppPackageUtil.exe /source: [yourdirectory]\MongoDB' /target:'[yourtargetdirectory]' /appname:MongoDB /exe:'bin\mongod.exe' /ma:'--dbpath [path to data]' /AppType:NodeAppType
```

In order to add MongoDB to our Service Fabric application package we need to make sure that the /target parameter points to the same directory that already contains the application manifest and the Node.js application and that we are using the same ApplicationType name.

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
As we can see the tool added a new folder MongoDB to the directory that contains the MongoDB binaries. If we open the ApplicationManifest.xml file we can see that our Service Fabric now contains both our Node.js application and MongoDB. The code below shows the content of the applcation manifest.

```xml
<ApplicationManifest xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ApplicationTypeName="MyNodeApp" ApplicationTypeVersion="1.0" xmlns="http://schemas.microsoft.com/2011/01/fabric">
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

The last step is to publish the application to the local Service Fabric cluster using the PowerShell scripts below:

```
Connect-ServiceFabricCluster localhost:19000

Write-Host 'Copying application package...'
Copy-ServiceFabricApplicationPackage -ApplicationPackagePath '[yourtargetdirectory]' -ImageStoreConnectionString 'file:C:\SfDevCluster\Data\ImageStore' -ApplicationPackagePathInImageStore 'Store\NodeAppType'

Write-Host 'Registering application type...'
Register-ServiceFabricApplicationType -ApplicationPathInImageStore 'Store\NodeAppType'

New-ServiceFabricApplication -ApplicationName 'fabric:/NodeApp' -ApplicationTypeName 'NodeAppType' -ApplicationTypeVersion 1.0  
```

Once the application is successfully published to the local cluster we can access the Node.js application on the port we have entered in the service manifest of the Node.js application, for example http://localhost:3000.

In this little tutorial we have seen how to easily package two existing application as one Service Fabric application and deploy it to Service Fabric so that it can benefit from some of the Service Fabric features such as high availability and heath system integration.

For more information see the following topics:

[Service Fabric Packaging format ](service-fabric-deploy-existing-app.md)
[Deploy multiple exsiting applications to Service Fabric ](service-fabric-custom-application-orchestration.md)
