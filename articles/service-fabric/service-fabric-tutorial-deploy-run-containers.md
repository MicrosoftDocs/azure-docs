---
title: Service Fabric tutorial - Deploy & Run Containers | Microsoft Docs
description: Service Fabric tutorial - Deploy & Run Containers
services: service-fabric
documentationcenter: ''
author: suhuruli
manager: mfussel
editor: suhuruli
tags: servicefabric
keywords: Docker, Containers, Micro-services, Service Fabric, Azure

ms.assetid: 
ms.service: service-fabric
ms.topic: tutorial
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/12/2017
ms.author: suhuruli
ms.custom: mvc
---

# Build and Deploy Service Fabric Container Applications

This tutorial is part four of a series. You learn how to build and deploy a Service Fabric application for containers to a Service Fabric cluster. Additionally, you learn how to clean up artifacts of an application from a cluster. When you are finished, you have a working Voting application that you can access through the internet. 

![votingapp][votingapp]

In this tutorial, you learn how to build and deploy a Service Fabric application with containers. Steps include: 

> [!div class="checklist"]
> * Build the application  
> * Deploy and run the application 
> * Clean up the application

## Prerequisites

- The application package created in [Part 3](service-fabric-tutorial-package-containers.md) of this tutorial series is used. 
- Linux developer environment is [set up](service-fabric-tutorial-create-container-images.md).

## Creating a Service Fabric cluster
To deploy the application to a cluster in Azure, use your own cluster, or use a Party Cluster.

Party clusters are free, limited-time Service Fabric clusters hosted on Azure. It is maintained by the Service Fabric team where anyone can deploy applications and learn about the platform. To get access to a Party Cluster, [follow the instructions](http://aka.ms/tryservicefabric). 

For information about creating your own cluster, see [Create your first Service Fabric cluster on Azure](service-fabric-get-started-azure-cluster.md).

## Build and Deploy application to the cluster
From the 'container-tutorial' directory change directories into the TestContainer directory.

```
cd TestContainer
``` 
The Service Fabric Yeoman templates include a build script for [Gradle](https://gradle.org/), which you can use to build the application from the terminal. Save all your changes.  To build and package the application, run the following:

```bash
gradle
```
Once the application is built, you can deploy it to the Azure cluster using the Service Fabric CLI. If Service Fabric CLI is not installed on your machine, follow instructions [here](service-fabric-get-started-linux.md#set-up-the-service-fabric-cli) to install it. 

Connect to the Service Fabric cluster in Azure.

```bash
sfctl cluster select --endpoint http://<my-azure-service-fabric-cluster-url>:<port>
```

Use the install script provided in the template to copy the application package to the cluster's image store, register the application type, and create an instance of the application.

```bash
./install.sh
```

Open a browser and navigate to Service Fabric Explorer at http://\<my-azure-service-fabric-cluster-url>:19080/Explorer. Expand the Applications node and note that there is an entry for your application type and another for the instance.

![Service Fabric Explorer][sfx]

Connect to the running container.  Open a web browser pointing to the IP address returned on port 80. You should see the Voting application in the web UI.

![votingapp][votingapp]

## Clean up
Use the uninstall script provided in the template to delete the application instance from the cluster and unregister the application type. This command takes some time to clean up the instance and the 'install.sh' command cannot be run immediately after this script. 

```bash
./uninstall.sh
```

## Next steps 

In this tutorial, the Azure voting application was deployed to a Service Fabric instance. Tasks completed include: 

> [!div class="checklist"]
> * Build the Service Fabric application 
> * Deploy and run the application 
> * Clean up the application 

Advance to the next tutorial to learn about failover and scaling of the application in Service Fabric.

> [!div class="nextstepaction"]
> [Learn about failover and scaling applications](service-fabric-tutorial-containers-failover.md)

[votingapp]: ./media/service-fabric-tutorial-deploy-run-containers/votingapp.png
[sfx]: ./media/service-fabric-tutorial-deploy-run-containers/deploy-run-containers-sfx.png