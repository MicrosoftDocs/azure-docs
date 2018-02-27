---
title: Deploy an Azure Service Fabric application to a Cluster from Visual Studio | Microsoft Docs
description: Learn how to deploy an application to a Cluster from Visual Studio
services: service-fabric
documentationcenter: .net
author: cristyg
manager: paulyuk
editor: ''

ms.assetid:
ms.service: service-fabric
ms.devlang: dotNet
ms.topic: tutorial
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 02/21/2018
ms.author: cristyg
ms.custom: mvc

---

# Deploy an application to a Cluster in Azure
This tutorial is part two of a series and shows you how to deploy an Azure Service Fabric application to an existing or new cluster in Azure directly from Visual Studio.

In part two of the tutorial series, you learn how to:
> [!div class="checklist"]
> * [Build a .NET Service Fabric application](service-fabric-tutorial-create-dotnet-app.md)
> * Deploy the application to a remote cluster
> * [Configure CI/CD using Visual Studio Team Services](service-fabric-tutorial-deploy-app-with-cicd-vsts.md)
> * [Set up monitoring and diagnostics for the application](service-fabric-tutorial-monitoring-aspnet.md)

In this tutorial series you learn how to:
> [!div class="checklist"]
> * Deploy an application to a remote cluster using Visual Studio
> * Remove an application from a cluster using Service Fabric Explorer

## Prerequisites
Before you begin this tutorial:
- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)
- [Install Visual Studio 2017](https://www.visualstudio.com/) and install the **Azure development** and **ASP.NET and web development** workloads.
- [Install the Service Fabric SDK](service-fabric-get-started.md)

## Download the Voting sample application
If you did not build the Voting sample application in [part one of this tutorial series](service-fabric-tutorial-create-dotnet-app.md), you can download it. In a command window, run the following command to clone the sample app repository to your local machine.

```
git clone https://github.com/Azure-Samples/service-fabric-dotnet-quickstart
```


### Select a Service Fabric cluster to which to publish
Now that the application is ready, you can deploy it to a cluster directly from Visual Studio.

You have three options for deployment:
- Create a cluster from Visual Studio. This option allows you to create a secure cluster directly from Visual Studio with your preferred configurations. This type of cluster is ideal for test scenarios.
- Publish to a party cluster. Party clusters are free, limited-time Service Fabric clusters run by the Service Fabric team. Currently they are available for use for one hour.
- Publish to an existing cluster in your subscription.


> [!NOTE]
> Many services use the reverse proxy to communicate with each other. Clusters created from Visual Studio and Party Clusters have reverse proxy enabled by default.  If using an existing cluster, you must [enable the reverse proxy in the cluster](../service-fabric-reverseproxy.md#setup-and-configuration.md).

### Deploy the app to the Service Fabric cluster

1. Right-click on the application project in the Solution Explorer and choose **Publish**.

    ![Publish Dialog](../media/service-fabric-tutorial-deploy-app-to-party-cluster/publish-app.png)

2. Sign in by using your Azure account so that you can have access to your subscription(s). This step is optional if you're using a party cluster.

3. Select the dropdown for the **Connection Endpoint** field

    a. If you select the "<Create New Cluster...>" option, it will take you through a dialog where you can create a new cluster in your subscription. You can modify several basic settings from this menu to create a secure test cluster. Creation takes a few minutes.

    b. If you select the "<Use Trial Cluster>" option, it will open a page in your default browser where you can get the connection endpoint for a limited-time Party Cluster.

    c. If you want to use your own cluster, you can paste the connection endpoint in this field, or select it from the dropdown list if you're signed into your Azure account.

4. Once you have selected a cluster, click **Publish**.

    Once the publish has finished, you should be able to send a request to the application via a browser.

5. Open you preferred browser and type in the cluster address (the connection endpoint without the port information - for example, win1kw5649s.westus.cloudapp.azure.com).

    You should now see the same result as you saw when running the application locally.

    ![API Response from Cluster](../media/service-fabric-tutorial-deploy-app-to-party-cluster/response-from-cluster.png)

## Next steps
In this tutorial, you learned how to:

> [!div class="checklist"]
> * Deploy an application to a remote cluster using Visual Studio
> * Remove an application from a cluster using Service Fabric Explorer

Advance to the next tutorial:
> [!div class="nextstepaction"]
> [Set up continuous integration using Visual Studio Team Services](service-fabric-tutorial-deploy-app-with-cicd-vsts.md)
