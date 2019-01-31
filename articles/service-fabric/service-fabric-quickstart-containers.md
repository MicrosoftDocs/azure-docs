---
title: Create a Windows container app on Service Fabric in Azure | Microsoft Docs
description: In this quickstart, you create your first Windows container application on Azure Service Fabric.  
services: service-fabric
documentationcenter: .net
author: TylerMSFT
manager: timlt
editor: 'vturecek'

ms.assetid: 
ms.service: service-fabric
ms.devlang: dotNet
ms.topic: quickstart
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 04/30/2018
ms.author: twhitney
ms.custom: mvc

---
# Quickstart: Deploy Windows containers to Service Fabric

Azure Service Fabric is a distributed systems platform for deploying and managing scalable and reliable microservices and containers.

Running an existing application in a Windows container on a Service Fabric cluster doesn't require any changes to your application. This quickstart shows you how to deploy a pre-built Docker container image in a Service Fabric application. When you're finished, you'll have a running Windows Server 2016 Nano Server and IIS container. This quickstart describes deploying a Windows container, read [this quickstart](service-fabric-quickstart-containers-linux.md) to deploy a Linux container.

![IIS default web page][iis-default]

In this quickstart you learn how to:

* Package a Docker image container
* Configure communication
* Build and package the Service Fabric application
* Deploy the container application to Azure

## Prerequisites

* An Azure subscription (you can create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)).
* A development computer running:
  * Visual Studio 2015 or Visual Studio 2017.
  * [Service Fabric SDK and tools](service-fabric-get-started.md).

## Package a Docker image container with Visual Studio

The Service Fabric SDK and tools provide a service template to help you deploy a container to a Service Fabric cluster.

Start Visual Studio as "Administrator".  Select **File** > **New** > **Project**.

Select **Service Fabric application**, name it "MyFirstContainer", and click **OK**.

Select **Container** from the **Hosted Containers and Applications** templates.

In **Image Name**, enter "microsoft/iis:nanoserver", the [Windows Server Nano Server and IIS base image](https://hub.docker.com/r/microsoft/iis/).

Configure the container port-to-host port mapping so that incoming requests to the service on port 80 are mapped to port 80 on the container.  Set **Container Port** to "80" and set **Host Port** to "80".  

Name your service "MyContainerService", and click **OK**.

![New service dialog][new-service]

## Specify the OS build for your container image

Containers built with a specific version of Windows Server may not run on a host running a different version of Windows Server. For example, containers built using Windows Server version 1709 do not run on hosts running Windows Server 2016. To learn more, see [Windows Server container OS and host OS compatibility](service-fabric-get-started-containers.md#windows-server-container-os-and-host-os-compatibility). 

With version 6.1 of the Service Fabric runtime and newer, you can specify multiple OS images per container and tag each with the build version of the OS that it should be deployed to. This helps to make sure that your application will run across hosts running different versions of Windows OS. To learn more, see [Specify OS build specific container images](service-fabric-get-started-containers.md#specify-os-build-specific-container-images). 

Microsoft publishes different images for versions of IIS built on different versions of Windows Server. To make sure that Service Fabric deploys a container compatible with the version of Windows Server running on the cluster nodes where it deploys your application, add the following lines to the *ApplicationManifest.xml* file. The build version for Windows Server 2016 is 14393 and the build version for Windows Server version 1709 is 16299. 

```xml
    <ContainerHostPolicies CodePackageRef="Code"> 
      <ImageOverrides> 
        ...
	      <Image Name="microsoft/iis:nanoserverDefault" /> 
          <Image Name= "microsoft/iis:nanoserver" Os="14393" /> 
          <Image Name="microsoft/iis:windowsservercore-1709" Os="16299" /> 
      </ImageOverrides> 
    </ContainerHostPolicies> 
```

The service manifest continues to specify only one image for the nanoserver, `microsoft/iis:nanoserver`. 

## Deploy the application to Azure using Visual Studio

Now that the application is ready, you can deploy it to a cluster directly from Visual Studio.  For this quickstart, we will use a local cluster.

By default, Visual Studio will create a local cluster for you. Because we are using a local test cluster, in ApplicationManifest.xml, set  **PasswordEncrypted** to **false**.

Right-click **MyFirstContainer** in the Solution Explorer and choose **Publish**. The Publish dialog appears.

Because we will use a local cluster, change **Target Profile** to **PublishPofiles\Local.1Node.xml** and change **Connection Endpoint**  to **Local Cluster**.

![Publish Dialog](./media/service-fabric-quickstart-containers/publish-app.png)

Click **Publish**.

Each application in the cluster must have a unique name. If there is a name conflict, rename the Visual Studio project and deploy again.

Open a browser and navigate to the **Connection endpoint** specified in the cluster page. Because we are using a local cluster, navigate to `http://localhost:80`. You should see the IIS default web page:
![IIS default web page][iis-default]

## Next steps

In this quickstart, you learned how to:

* Package a Docker image container
* Configure communication
* Build and package the Service Fabric application
* Deploy the container application to Azure

To learn more about working with Windows containers in Service Fabric, continue to the tutorial for Windows container apps.

> [!div class="nextstepaction"]
> [Create a Windows container app](./service-fabric-host-app-in-a-container.md)

[iis-default]: ./media/service-fabric-quickstart-containers/iis-default.png
[publish-dialog]: ./media/service-fabric-quickstart-containers/publish-dialog.png
[new-service]: ./media/service-fabric-quickstart-containers/NewService.png