---
title: Tutorial- Debug an Azure Service Fabric Mesh web application running in your local development cluster | Microsoft Docs
description: In this tutorial, debug an Azure Service Fabric Mesh application running on your local cluster.
services: service-fabric-mesh
documentationcenter: .net
author: TylerMSFT
manager: jeconnoc 
editor: ''
ms.assetid:  
ms.service: service-fabric-mesh
ms.devlang: dotNet
ms.topic: tutorial
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 09/18/2018
ms.author: twhitney
ms.custom: mvc, devcenter 
#Customer intent: As a developer, I want learn how to debug a Service Fabric Mesh app on my local development cluster
---

# Tutorial: Debug a Service Fabric Mesh application running in your local development cluster

This tutorial is part two of a series and shows you how to build and debug an Azure Service Fabric Mesh app on your local development cluster.

In this tutorial you will learn:

> [!div class="checklist"]
> * What happens when you build an Azure Service Fabric Mesh application
> * How to set a breakpoint to observe a service-to-service call

In this tutorial series you learn how to:
> [!div class="checklist"]
> * [Create a Service Fabric Mesh app in Visual Studio](service-fabric-mesh-tutorial-create-dotnetcore.md)
> * Debug a Service Fabric Mesh app running in your local development cluster
> * [Deploy a Service Fabric Mesh app](service-fabric-mesh-tutorial-deploy-service-fabric-mesh-app.md)
> * [Upgrade a Service Fabric Mesh app](service-fabric-mesh-tutorial-upgrade.md)
> * [Clean up Service Fabric Mesh resources](service-fabric-mesh-tutorial-cleanup-resources.md)

[!INCLUDE [preview note](./includes/include-preview-note.md)]

## Prerequisites

Before you begin this tutorial:

* If you don't have an Azure subscription, you can [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

* Make sure that you've [set up your development environment](service-fabric-mesh-howto-setup-developer-environment-sdk.md) which includes installing the Service Fabric runtime, SDK, Docker, and Visual Studio 2017.

## Download the to-do sample application

If you did not create the to-do sample application in [part one of this tutorial series](service-fabric-mesh-tutorial-create-dotnetcore.md), you can download it. In a command window, run the following command to clone the sample app repository to your local machine.

```
git clone https://github.com/azure-samples/service-fabric-mesh
```

The application is under the `src\todolistapp` directory.

## Build and debug on your local cluster

A Docker image is automatically built and deployed to your local cluster as soon as your project loads. This process may take a while. To monitor the progress in the Visual Studio **Output** pane, set the Output pane **Show output from:** drop down to **Service Fabric Tools**.

Press **F5** to compile and run your service locally. When the project is run and debugged locally, Visual Studio will:

* Make sure that Docker for Windows is running and set to use Windows as the container operating system.
* Download any missing Docker base images. This part may take some time
* Build (or rebuild) the Docker image used to host your code project.
* Deploy and run the container on the local Service Fabric development cluster.
* Run your services and hit any breakpoints you have set.

After the local deployment is finished, and Visual Studio is running your app, a browser window will open to a default sample web page.

**Debugging tips**

There is currently an issue that causes the call to `using (HttpResponseMessage response = client.GetAsync("").GetAwaiter().GetResult())` to fail connect to the service. This can happen whenever your host IP address changes. To resolve this:

1. Remove the app from the local cluster (in Visual Studio, **Build** > **Clean Solution**).
2. From the Service Fabric Local Cluster Manager, select **Stop Local CLuster**, and then **Start Local Cluster**.
3. Redeploy the app (in Visual Studio, **F5**).

If you get the **No Service Fabric local cluster is running** error, make sure that the Service Fabric Local Custer Manager (LCM) is running and right-click the LCM icon in the task bar, then click **Start Local Cluster**. Once it has started, return to Visual Studio and press **F5**.

If you get a **404** error when the app starts, it could mean that your environment variables in **service.yaml** are incorrect. Make sure that `ApiHostPort` and `ToDoServiceName` are set correctly per the instructions in [Create environment variables](https://docs.microsoft.com/azure/service-fabric-mesh/service-fabric-mesh-tutorial-create-dotnetcore#create-environment-variables).

If you get build errors in **service.yaml**, make sure that spaces, not tabs, are used to indent the lines. Also, for now, you must build the app using the English locale.

### Debug in Visual Studio

When you debug a Service Fabric Mesh application in Visual Studio, you are using a local Service Fabric development cluster. To see how to-do items are retrieved from the back-end service, debug into the OnGet() method.
1. In the **WebFrontEnd** project, open **Pages** > **Index.cshtml** > **Index.cshtml.cs** and set a breakpoint in the **Get** method (line 17).
2. In the **ToDoService** project, open **TodoController.cs** and set a breakpoint in the **OnGet** method (line 15).
3. Go back to the browser and refresh the page. You hit the  breakpoint in the web front-end `OnGet()` method. You can inspect the `backendUrl` variable to see how the environment variables that you defined in the **service.yaml** file are combined into the URL used to contact the back-end service.
4. Step over (F10) the `client.GetAsync(backendUrl).GetAwaiter().GetResult())` call and you'll hit the controller's `Get()` breakpoint. In this method, you can see how the list of to-do items is retrieved from the in-memory list.
5. When you are done, stop debugging your project in Visual Studio by pressing **Shift+F5**.
 
## Next steps

In this part of the tutorial, you learned:

> [!div class="checklist"]
> * What happens when you build an Azure Service Fabric Mesh application
> * How to set a breakpoint to observe a service-to-service call

Advance to the next tutorial:
> [!div class="nextstepaction"]
> [Deploy a Service Fabric Mesh app](service-fabric-mesh-tutorial-deploy-service-fabric-mesh-app.md)