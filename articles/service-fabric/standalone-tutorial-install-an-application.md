---
title: Creating the infrastructure for a service fabric cluster on AWS - Azure Service Fabric | Microsoft Docs
description: In this tutorial, you learn how to set up the AWS infrastructure to run a service fabric cluster.
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
ms.date: 03/09/2018
ms.author: dastanfo
ms.custom: mvc
---
# Create AWS Infrastructure to host a service fabric cluster

This tutorial is part three of a series.  Service Fabric for Windows Server deployment (standalone) offers you the option to choose your own environment and create a cluster as part of our "any OS, any cloud" approach with Service Fabric. This tutorial shows you how to create the AWS infrastructure necessary to host this standalone cluster.

In part three of the series, you learn how to:

> [!div class="checklist"]
> * Create a set of EC2 instances
> * VPC?
> * Security Groups?
> * Login to one of the instances

## Download the Voting sample application

If you did not build the Voting sample application in [part one of this tutorial series](service-fabric-tutorial-create-dotnet-app.md), you can download it. In a command window, run the following command to clone the sample app repository to your local machine.

```
git clone https://github.com/Azure-Samples/service-fabric-dotnet-quickstart
```

## Deploy the app to the AWS

Now that the application is ready, you can deploy it to the Party Cluster direct from Visual Studio.

1. Right-click **Voting** in the Solution Explorer and choose **Publish**. 

    ![Publish Dialog](./media/service-fabric-quickstart-containers/publish-app.png)

2. Copy the **Connection Endpoint** from the Party cluster page into the **Connection Endpoint** field. For example, `zwin7fh14scd.westus.cloudapp.azure.com:19000`. Click **Advanced Connection Parameters** and fill in the following information.  *FindValue* and *ServerCertThumbprint* values must match the thumbprint of the certificate installed in the previous step. Click **Publish**. 

    Once the publish has finished, you should be able to send a request to the application via a browser.

3. Open you preferred browser and type in the cluster address (the connection endpoint without the port information - for example, win1kw5649s.westus.cloudapp.azure.com).

    You should now see the same result as you saw when running the application locally.

    ![API Response from Cluster](./media/service-fabric-tutorial-deploy-app-to-party-cluster/response-from-cluster.png)

## Remove the application from a cluster using Service Fabric Explorer

Service Fabric Explorer is a graphical user interface to explore and manage applications in a Service Fabric cluster.

To remove the application from the Party Cluster:

1. Browse to the Service Fabric Explorer, using the link provided by the Party Cluster sign-up page. For example, https://win1kw5649s.westus.cloudapp.azure.com:19080/Explorer/index.html.

2. In Service Fabric Explorer, navigate to the **fabric:/Voting** node in the treeview on the left-hand side.

3. Click the **Action** button in the right-hand **Essentials** pane, and choose **Delete Application**. Confirm deleting the application instance, which removes the instance of our application running in the cluster.

![Delete Application in Service Fabric Explorer](./media/service-fabric-tutorial-deploy-app-to-party-cluster/delete-application.png)

## Remove the application type from a cluster using Service Fabric Explorer

Applications are deployed as application types in a Service Fabric cluster, which enables you to have multiple instances and versions of the application running within the cluster. After having removed the running instance of our application, we can also remove the type, to complete the cleanup of the deployment.

For more information about the application model in Service Fabric, see [Model an application in Service Fabric](service-fabric-application-model.md).

1. Navigate to the **VotingType** node in the treeview.

2. Click the **Action** button in the right-hand **Essentials** pane, and choose **Unprovision Type**. Confirm unprovisioning the application type.

![Unprovision Application Type in Service Fabric Explorer](./media/service-fabric-tutorial-deploy-app-to-party-cluster/unprovision-type.png)

## Next steps

In part three of the series, you learned about uploading large amounts of random data to a storage account in parallel, such as how to:

> [!div class="checklist"]
> * Configure the connection string
> * Build the application
> * Run the application
> * Validate the number of connections

Advance to part four of the series to download large amounts of data from a storage account.

> [!div class="nextstepaction"]
> [Upload large amounts of large files in parallel to a storage account](storage-blob-scalable-app-download-files.md)