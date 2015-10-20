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


# Deploy a Node.js app using MongoDB

The main purpose of this tutorial is to show how to package and deploy multiple applications to Service Fabric. For our walkthrough we use a Node.js frontend that uses MongoDB as the data store.   

## Package the Node.js application

Let's assume that our Node.js application is using Express and Jade and that Node.js is not installed on the nodes in the Service fabric cluster. As a consequence we need to add node.exe to the root directory of MyNodeApplication as well. The directory structure of the Node.js application would now look similar to the one below:
```
|-- MyNodeApplication
	|-- bin
        |-- www
	|-- data
        |-- journal
        |-- etc.
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

As opposed to [deploying a simple existing applications to Service Fabric ](https://azure.microsoft.com/en-us/documentation/articles/service-fabric-deploy-existing-app/) where we just need to launch an .exe we need to execute something like

    node.exe bin/www

to launch the web server. We can do that by using an argument parameter /ma when running the packaging tool. The code below creates a Service Fabric application package that contains our Node.js application.

    .\ServiceFabricAppPackageUtil.exe /source:'[yourdirectory]\MyNodeApplication' /target:'[yourtargetdirectory] /appname:NodeService /exe:'node.exe' /ma:'bin/www' /AppType:ToDoList

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

As our Node.js application is a web application we need to add

```xml
<Resources>
      <Endpoints>
     	<Endpoint Name="WebServerTypeEndpoint" Protocol="http" Port="8080" Type="Input" />
      </Endpoints>
</Resources>
```
 The last step is to publish the application to the local Service Fabric cluster using the PowerShell scripts below:

    Connect-ServiceFabricCluster localhost:19000

    Write-Host 'Copying application package...'
    Copy-ServiceFabricApplicationPackage -ApplicationPackagePath 'D:\Dev\WebServerPackage' -ImageStoreConnectionString 'file:C:\SfDevCluster\Data\ImageStore' -ApplicationPackagePathInImageStore 'Store\WebServer'

    Write-Host 'Registering application type...'
    Register-ServiceFabricApplicationType -ApplicationPathInImageStore 'Store\WebServer'

    New-ServiceFabricApplication -ApplicationName 'fabric:/WebServer' -ApplicationTypeName 'WebServerType' -ApplicationTypeVersion 1.0  


Once the application is successfully published to the local cluster we can access the web server through http://localhost:8080.
This is a good opportunity to check on one of the advantages of running an application in Service Fabric. Let's test what happens if we reboot the node on which our web server runs, we can use Service Fabric Explorer to restart nodes. Figure 1 shows that our web server runs on Node1 and that we are about to restart the node in Service Fabric Explorer.

![RestartNode](./media/service-fabric-custom-application-orchestration/restartnode.png)

If we check back after a short while we can see that Service Fabric started our web server on another node. Figure 2 shows our web server running on Node 3 after the failover.

![New Node](./media/service-fabric-custom-application-orchestration/newnode.png)

In this little tutorial we have seen how to easily package and deploy an existing application to Service Fabric so that it can benefit from some of the Service Fabric features such as high availability and heath system integration.

For more information see the following topics

[Service Fabric Packaging format ](https://azure.microsoft.com/en-us/documentation/articles/service-fabric-deploy-existing-app/)

[Deploy multiple exsiting applications to Service Fabric ](https://azure.microsoft.com/en-us/documentation/articles/service-fabric-deploy-existing-app/)
