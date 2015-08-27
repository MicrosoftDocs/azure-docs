<properties
   pageTitle="Node.js and reliable actors | Microsoft Azure"
   description="A walk through on how to build an node.js express application that uses Reliable Actors and runs on top of the Azure Service Fabric platform."
   services="service-fabric"
   documentationCenter=".net"
   authors="clca"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="08/17/2015"
   ms.author="claudioc"/>


# Node.js and reliable actors: a winning combination
This article is an overview on how you can build an application that uses node.js and Reliable Actors. The final solution is a blend of javascript code used mainly to provide the frontend side of the app (Web/Rest APIs) and C# for more complex computation. By leveraging Service Fabric programming model, the application is scalable and reliable out of the box.
The process is bsed on the following steps:

1. create a new Service Fabric Stateless or Stateful Actor project using Service Fabric tools for Visual Studio
2. create a node.js project using, for instance [node.js tools for Visual Studio](https://github.com/Microsoft/nodejstools/releases/tag/v1.1.RC) 
3. Add a node.js project (a basic express 4 app for instance) to the Service Fabric solution. You can simply use solution/Add Existing project to include the node.js project. 
4. Package the node.js app so it can be deployed using VS Tools for Service Fabric

## create the node.js project
After you create the node.js project and add the dependencies, you need to change the directory structure of the project so it follows the structure that the Service Fabric tools for Visual Studio required in order to be able to package and deploy the app like any other Service Fabric service. The goal is to make the changes to the directory structure only once so you can benefits from being able to use the deployment process in Visual Studio and hence deploy your node.js app along with the other services in the solution. 
The changes that needs to be done to the directory structure are:

1. Create a PackageRoot directory
2. Create a Code directory under PackageRoot
3. Move all files and directories under the Code directory

After you are done, the project structure in Visual Studio should look like the following:

![][8]

As you can see all the node.js code is under the PackageRoot/Code directory. Service Fabric does not make any assumption about the applications/libraries installed on the node where the application is going to be deployed so you need to include all the dependencies. In the case of node.js you need to include node.exe so Service Fabric can run the code (you can find node.exe under the program files\nodejs directory).

![][3]

## Add servicemanifest.xml metadata file
In order to deploy the node.js application, we need to add a metadata file that is required to specify some properties that will be used by Service Fabric in order to determine how to deploy and launch the application.

This is an example on how the servicemanifest.xml should look like, please refer to [this article](service-fabric-deploy-existing-app.md) for more details on what are the important element that needs to be updated but typically you need to update:

* Name (ServiceManifest element)
* ServiceTypeName (StatelessServiceType element)
* Arguments (ExeHost element) to specify the js file that should be used to launch the app.


```xml

<?xml version="1.0" encoding="utf-8"?>

<ServiceManifest Name="NodejsFrontendPkg"
                 Version="1.0.0.0"
                 xmlns="http://schemas.microsoft.com/2011/01/fabric"
                 xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">

  <ServiceTypes>
    <StatelessServiceType ServiceTypeName="NodejsFrontendType" UseImplicitHost="true" />
  </ServiceTypes>
  <CodePackage Name="Code" Version="1.0.0.0">
    <EntryPoint>
      <ExeHost>
        <Program>node.exe</Program>
        <Arguments>server.js</Arguments>
        <WorkingFolder>CodeBase</WorkingFolder>
      </ExeHost>
    </EntryPoint>
  </CodePackage>
  <ConfigPackage Name="Config" Version="1.0.0.0" />
  <Resources>
    <Endpoints>
      <Endpoint Name="ServiceEndpoint" />
    </Endpoints>
  </Resources>
</ServiceManifest>

```

> [AZURE.NOTE] Please note that one of the servicemanifest.xml options may not work with node.js. In some cases `ConsoleRedirection` does not work if a node.js module (ex. Express) assumed that the fd for stdout and stderr are 1 and 2.

After the `servicemanifest.xml` file is added to the node.js project, the structure of the project should look like this:

![][4]

## Add Service Fabric binaries
Next step is to add Service Fabric binaries that are used to connect with the Actors running in the Service Fabric cluster. As you can see in the Edge.js sample, there are some references to asemblies. To make those assemblies available to edge.js, they need to be copied along with the node.js code.
The easiest way is to copy the binaries from an existing projects, the files that needs to be included in the code directory (and will be used by edge.js) are the following:

```
Microsoft.ServiceFabric.Actors.dll
Microsoft.ServiceFabric.Collections.dll
Microsoft.ServiceFabric.Data.dll
Microsoft.ServiceFabric.Data.Log.dll
Microsoft.ServiceFabric.ReplicatedStore.dll
Microsoft.ServiceFabric.Replicator.dll
Microsoft.ServiceFabric.Services.dll
ServiceFabricServiceModel.dll
System.Fabric.Common.Internal.dll
System.Fabric.Common.Internal.Strings.resources.dll
System.Fabric.dll
```

After you added the binaries to the project, the project structure should like the following:

![][5]

## Add a reference to the node.js project in the applicationmanifest file
Next step is to add the node.js service to the application manifest so it can be deployed using Visual Studio tools for Service Fabric. This is necessary because there is no integration in Service Fabric tools for Visual Studio with the node.js project so it needs to be added manually. 

In the `applicationmanifest.xml` file you need to add the following elements:

* `ServiceManifestImport`
* `Service`

> [AZURE.NOTE] Make sure you are using the same names that you used in the `servicemanifest.xml` to specify `ServiceName` and `ServiceTypeName`. the `applicationmanifest.xml` file should be similar to the following:

```
<?xml version="1.0" encoding="utf-8"?>
<ApplicationManifest xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ApplicationTypeName="NodeServiceFabricSampleApplication" ApplicationTypeVersion="1.0.0.0" xmlns="http://schemas.microsoft.com/2011/01/fabric">
    <ServiceManifestImport>
      <ServiceManifestRef ServiceManifestName="NodeServiceFabricSamplePkg" ServiceManifestVersion="1.0.0.0" />
   </ServiceManifestImport>
   <ServiceManifestImport>
       <ServiceManifestRef ServiceManifestName="VisualObjectsNodejsWebServicePkg" ServiceManifestVersion="1.0.0.0" />
       </ServiceManifestImport>
   <DefaultServices>
      <Service Name="NodeServiceFabricSampleActorService">
         <StatelessService ServiceTypeName="NodeServiceFabricSampleActorServiceType">
            <UniformInt64Partition PartitionCount="9" LowKey="-9223372036854775808" HighKey="9223372036854775807" />
         </StatelessService>
      </Service>
     <Service Name="NodejsFrontendPkg">
       <StatelessService ServiceTypeName="NodejsFrontendType">
         <SingletonPartition />
       </StatelessService>
     </Service>
   </DefaultServices>
</ApplicationManifest>

```

## Using Reliable Actors in the Node.js app
Now that the project structure is set, we can focus on the code that allow the node.js application to connect to Reliable Actors in the cluster like you can do from a .NET application. The scenario we want to enable is to buld a node.js application that act as frontend/gateway for client application and expose an web-based application or a set of rest APIs a client app can use.
Node.js provides the frontend of the app while Reliable Actors provide the scalable and reliable 'application server' layer of the app.
In Service Fabric, Reliable Actors can be invoked by using the [ActorProxy class](service-fabric-reliable-actors-introduction.md#actor-communication). Luckly there is a great node.js module that can be use to call into .NET code: [Edge.js](https://github.com/tjanczuk/edge). You can use the instructions on the github repo to find out how to install edge on your machine.

 
![][2]

After you install edge either using NPM or the NPM UI in Visual Studio, you need to move the new installed module in the node_modules directory under the Code subdirectory (we changed the structure of the node.js project and moved all code under the PackageRoot/Code directory).
You can find good examples in the edge.js repo on Github on how you can use edge to call .NET code, the following is a simple example of how the code looks like when you need to call Reliable Actors using the ActorProxy class.

```javascript

var getActorStatus = edge.func(function () {

/*

    #r "Microsoft.ServiceFabric.Actors.dll"
    #r "System.Globalization.dll"
    #r "System.dll"
    #r  "visualobjects.interfaces.dll"
    
    using Microsoft.ServiceFabric.Actors;
    using System.Globalization;
    using VisualObjects.Interfaces;
    using System.Threading.Tasks;
    using System; 


public class Startup
    {
         public async Task<object> Invoke(dynamic input)
        {

            var objectId = (string) input.actorId;
            var serviceUri = (string) input.serviceUri;
            var actId = new ActorId(objectId);
            var serId = new Uri(serviceUri);
            var actorProxy = ActorProxy.Create<IVisualObjectActor>(actId, serId);
            var buffer = await actorProxy.GetStateAsJsonAsync();
            if (!string.IsNullOrEmpty(buffer))
                return buffer;
                else 
                return "null";
         }
  }
 
 */ 

});

```

> [AZURE.NOTE] The ActorProxy uses the Actor interface in order to know which actor it should connect to. In order for the managed code running in the node.js process to be able to instantiate that class, the Actor interface assembly needs to be copied in the code directory like the other Service Fabric dlls.
Note: you will have to copy (or set a post-build action in VS) the dll any time you are making changes to methods/parameters in the interface.

![][6]

## Deployment
At this point the project can be deployed using Service Fabric Tools for Visual Studio. The last step of the process is to reference the project in the Service Fabric Application project so it can be included in the Application package and deployed in the cluster.

![][9]
 
You can deploy the application (that will include the node.js app) by using, for instance, the  solution context menu.

![][10]

## Next steps
* Learn more about [Reliable Actors](service-fabric-reliable-actors-introduction.md)
* Learn more about Service Fabric [application lifecycle](service-fabric-application-lifecycle.md)
* Lean more about upgrading a [Service Fabric application](service-fabric-application-upgrade.md) 

<!-- images -->
[1]: ./media/service-fabric-node-and-reliable-actors-app/nodejs-project-structure.PNG
[2]: ./media/service-fabric-node-and-reliable-actors-app/edge-js.PNG
[3]: ./media/service-fabric-node-and-reliable-actors-app/node-exe.PNG
[4]: ./media/service-fabric-node-and-reliable-actors-app/project-structure-with-manifest.PNG
[5]: ./media/service-fabric-node-and-reliable-actors-app/project-structure-with-dlls.PNG
[6]: ./media/service-fabric-node-and-reliable-actors-app/project-structure-interface-dll.PNG
[7]: ./media/service-fabric-node-and-reliable-actors-app/project-structure-config.PNG
[8]: ./media/service-fabric-node-and-reliable-actors-app/nodejs-project-structure1.PNG
[9]: ./media/service-fabric-node-and-reliable-actors-app/application-project-reference.PNG
[10]: ./media/service-fabric-node-and-reliable-actors-app/solution-deploy.PNG
