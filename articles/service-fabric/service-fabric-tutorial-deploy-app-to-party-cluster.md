---
title: Deploy an Azure Service Fabric application to a cluster from Visual Studio | Microsoft Docs
description: Learn how to deploy an application to a cluster from Visual Studio
services: service-fabric
documentationcenter: .net
-author: mikkelhegn 
-manager: msfussell 
editor: ''

ms.assetid:
ms.service: service-fabric
ms.devlang: dotNet
ms.topic: tutorial
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 02/21/2018
ms.author: mikkelhegn
ms.custom: mvc

---

# Tutorial: Deploy an application to a Service Fabric cluster in Azure
This tutorial is part two of a series and shows you how to deploy an Azure Service Fabric application to a new cluster in Azure directly from Visual Studio.

In this tutorial you learn how to:
> [!div class="checklist"]
> * Create a cluster from Visual Studio
> * Deploy an application to a remote cluster using Visual Studio


In this tutorial series, you learn how to:
> [!div class="checklist"]
> * [Build a .NET Service Fabric application](service-fabric-tutorial-create-dotnet-app.md)
> * Deploy the application to a remote cluster
> * [Configure CI/CD using Visual Studio Team Services](service-fabric-tutorial-deploy-app-with-cicd-vsts.md)
> * [Set up monitoring and diagnostics for the application](service-fabric-tutorial-monitoring-aspnet.md)


## Prerequisites
Before you begin this tutorial:
- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)
- [Install Visual Studio 2017](https://www.visualstudio.com/) and install the **Azure development** and **ASP.NET and web development** workloads.
- [Install the Service Fabric SDK](service-fabric-get-started.md)

## Download the voting sample application
If you did not build the voting sample application in [part one of this tutorial series](service-fabric-tutorial-create-dotnet-app.md), you can download it. In a command window, run the following command to clone the sample app repository to your local machine.

```
git clone https://github.com/Azure-Samples/service-fabric-dotnet-quickstart
```

## Deploy the sample application

### Select a Service Fabric cluster to which to publish
Now that the application is ready, you can deploy it to a cluster directly from Visual Studio.

You have two options for deployment:
- Create a cluster from Visual Studio. This option allows you to create a secure cluster directly from Visual Studio with your preferred configurations. This type of cluster is ideal for test scenarios, where you can create the cluster and then publish directly to it within Visual Studio.
- Publish to an existing cluster in your subscription.

This tutorial will follow steps to create a cluster from Visual Studio. For the other options, you can copy and paste your connection endpoint or choose it from your subscription.
> [!NOTE]
> Many services use the reverse proxy to communicate with each other. Clusters created from Visual Studio and party clusters have reverse proxy enabled by default.  If using an existing cluster, you must [enable the reverse proxy in the cluster](service-fabric-reverseproxy.md#setup-and-configuration).

### Deploy the app to the Service Fabric cluster

1. Right-click on the application project in the Solution Explorer and choose **Publish**.

2. Sign in by using your Azure account so that you can have access to your subscription(s). This step is optional if you're using a party cluster.

3. Select the dropdown for the **Connection Endpoint** and select the "<Create New Cluster...>" option.
    
    ![Publish Dialog](./media/service-fabric-tutorial-deploy-app-to-party-cluster/publish-app.png)
    
4. In the "Create cluster" dialog, modify the following settings:

    1. Specify the name of your cluster in the "Cluster Name" field, as well as the subscription and location you want to use.
    2. Optional: You can modify the number of nodes. By default you have three nodes, the minimum required for testing Service Fabric scenarios.
    3. Select the "Certificate" tab. In this tab, type a password to use to secure the certificate of your cluster. This certificate helps make your cluster secure. You can also modify the path to where you want to save the certificate. Visual Studio can also import the certificate for you, since this is a required step to publish the application to the cluster.
    4. Select the "VM Detail" tab. Specify the password you would like to use for the Virtual Machines (VM) that make up the cluster. The user name and password can be used to remotely connect to the VMs. You must also select a VM machine size and can change the VM image if needed.
    5. Optional: On the "Advanced" tab you can modify the list of ports you want opened on the load balancer that will be created along with the cluster. You can also add an existing Application Insights key to be used to route application log files to.
    6. When you are done modifying settings, select the "Create" button. Creation takes a few minutes to complete; the output window will indicate when the cluster is fully created.
    
    ![Create Cluster Dialog](./media/service-fabric-tutorial-deploy-app-to-party-cluster/create-cluster.png)

4. Once the cluster you want to use is ready, right-click on the application project and choose **Publish**.

    When the publish has finished, you should be able to send a request to the application via a browser.

5. Open you preferred browser and type in the cluster address (the connection endpoint without the port information - for example, win1kw5649s.westus.cloudapp.azure.com).

    You should now see the same result as you saw when running the application locally.

    ![API Response from Cluster](./media/service-fabric-tutorial-deploy-app-to-party-cluster/response-from-cluster.png)

## Next steps
In this tutorial, you learned how to:

> [!div class="checklist"]
> * Create a cluster from Visual Studio
> * Deploy an application to a remote cluster using Visual Studio

Advance to the next tutorial:
> [!div class="nextstepaction"]
> [Set up continuous integration using Visual Studio Team Services](service-fabric-tutorial-deploy-app-with-cicd-vsts.md)
