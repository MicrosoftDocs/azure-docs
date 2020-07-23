---
title: Create and Publish a.Net Core app to a remote Linux Cluster
description: Create and publish .Net Core apps targeting a remote Linux cluster from Visual Studio
author: peterpogorski

ms.topic: troubleshooting
ms.date: 5/20/2019
ms.author: pepogors
---
# Use Visual Studio to create and publish .Net Core applications targeting a remote Linux Service Fabric cluster
With Visual Studio tooling you can develop and publish Service Fabric .Net Core applications targeting a Linux Service Fabric cluster. The SDK version must be 3.4 or above to deploy a .Net Core application targeting Linux Service Fabric clusters from Visual Studio.

> [!Note]
> Visual Studio doesn't support debugging Service Fabric applications which target Linux.
>

## Create a Service Fabric application targeting .Net Core
1. Launch Visual Studio as an **administrator**.
2. Create a project with **File->New->Project**.
3. In the **New Project** dialog, choose **Cloud -> Service Fabric Application**.
![create-application]
4. Name the application and click **Ok**.
5. On the **New Service Fabric Service** page, select the type of service you would like to create under the **.Net Core Section**.
![create-service]

## Deploy to a remote Linux cluster
1. In the solution explorer, right click on the application and select **Build**.
![build-application]
2. Once the build process for the application has completed, right click on the service and select edit the **csproj file**.
![edit-csproj]
3. Edit the UpdateServiceFabricManifestEnabled property from True to **False** if the service is an **actor project type**. If your application does not have an actor service, skip to step 4.
```xml
    <UpdateServiceFabricManifestEnabled>False</UpdateServiceFabricManifestEnabled>
```
> [!Note]
> Setting UpdateServiceFabricManifestEnabled to false, will disable updates to the ServiceManifest.xml during a build. Any change such as add, remove, or rename to the service will not be reflected in the ServiceManifest.xml. If any changes are made you must either update the ServiceManifest manually or temporarily set UpdateServiceFabricManifestEnabled to true and build the service that will update the ServiceManifest.xml and then revert it back to false.
>

4. Update the RuntimeIndetifier from win7-x64 to the target platform in the service project.
```xml
    <RuntimeIdentifier>ubuntu.16.04-x64</RuntimeIdentifier>
```
5. In the ServiceManifest, update the entrypoint program to remove .exe. 
```xml
    <EntryPoint> 
    <ExeHost> 
        <Program>Actor1</Program> 
    </ExeHost> 
    </EntryPoint>
```
6. In Solution Explorer, right-click on the application and select **Publish**. The **Publish** dialog box appears.
7. In **Connection Endpoint**, select the endpoint for the remote Service Fabric Linux cluster that you would like to target.
![publish-application]

<!--Image references-->
[create-application]:./media/service-fabric-how-to-vs-remote-linux-cluster/create-application-remote-linux.png
[create-service]:./media/service-fabric-how-to-vs-remote-linux-cluster/create-service-remote-linux.png
[build-application]:./media/service-fabric-how-to-vs-remote-linux-cluster/build-application-remote-linux.png
[edit-csproj]:./media/service-fabric-how-to-vs-remote-linux-cluster/edit-csproj-remote-linux.png
[publish-application]:./media/service-fabric-how-to-vs-remote-linux-cluster/publish-remote-linux.png

## Next steps
* Learn about [Getting started with Service Fabric with .Net Core](https://azure.microsoft.com/resources/samples/service-fabric-dotnet-core-getting-started/)
