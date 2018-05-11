---
title: Tutorial install an application on your standalone Service Fabric cluster - Azure Service Fabric | Microsoft Docs
description: In this tutorial you learn how to install an application into your standalone Service Fabric cluster.
services: service-fabric
documentationcenter: .net
author: david-stanford
manager: timlt
editor: ''

ms.assetid: 
ms.service: service-fabric
ms.devlang: dotNet
ms.topic: tutorial
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 05/11/2018
ms.author: dastanfo
ms.custom: mvc
---
# Tutorial: Install an application on your Service Fabric standalone cluster

Service Fabric standalone clusters offer you the option to choose your own environment and create a cluster as part of the "any OS, any cloud" approach that Service Fabric is taking. In this tutorial series you will be creating a standalone cluster hosted on AWS.

This tutorial is part three of a series.  Service Fabric standalone clusters offers you the option to choose your own environment and create a cluster as part of our "any OS, any cloud" approach with Service Fabric. This tutorial shows you how to create the AWS infrastructure necessary to host this standalone cluster.

In part three of the series, you learn how to:

> [!div class="checklist"]
> * Download the sample app
> * Deploy to the cluster

## Prerequisites

Before you begin this tutorial:

* [Install Visual Studio 2017](https://www.visualstudio.com/) and install the **Azure development** and **ASP.NET and web development** workloads.
* [Install the Service Fabric SDK](service-fabric-get-started.md)

## Download the voting sample application

If you did not build the Voting sample application in [part one of this tutorial series](service-fabric-tutorial-create-dotnet-app.md), you can download it. In a command window, run the following command to clone the sample app repository to your local machine.

```
git clone https://github.com/Azure-Samples/service-fabric-dotnet-quickstart
```

### Deploy the app to the Service Fabric cluster

Now that the application is ready, you can deploy it to a cluster directly from Visual Studio.

> [!NOTE]
> Many services use the reverse proxy to communicate with each other. Clusters created from Visual Studio and party clusters have reverse proxy enabled by default.  If using an existing cluster, you must [enable the reverse proxy in the cluster](service-fabric-reverseproxy.md#setup-and-configuration).

1. Right-click on the application project in the Solution Explorer and choose **Publish**.

2. Select the dropdown for the **Connection Endpoint** and select the `<Create New Cluster...>` option.

    ![Publish Dialog](./media/service-fabric-tutorial-deploy-app-to-party-cluster/publish-app.png)

3. In the "Create cluster" dialog, modify the following settings:

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

In part three of the series, how to deploy an application to your cluster, such as how to:

> [!div class="checklist"]
> * Download the sample app
> * Deploy to the cluster

Advance to part four of the series to clean up your cluster.

> [!div class="nextstepaction"]
> [Clean up your resources](standalone-tutorial-clean-up.md)