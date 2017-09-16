---
title: Service Fabric tutorial - Failover & Scale Containers | Microsoft Docs
description: Service Fabric tutorial - Failover & Scale Containers
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

# Failover Scenario & Scaling of Container Applications

This tutorial is part five of a series. In this tutorial, you learn how failover is handled in Service Fabric container applications. Additionally, you learn how to scale applications. Steps included in this tutorial are:

> [!div class="checklist"]
> * Learn about the failover scenario in a Service Fabric cluster  
> * Scale applications and services in a cluster

## Prerequisites

 - Application from [Part 4](service-fabric-tutorial-deploy-run-containers.md) is running in an active Service Fabric cluster.

## Fail over a container in a cluster
Service Fabric makes sure your container instances automatically moves to other nodes in the cluster, should a failure occur. You can also manually drain a node for containers and move then gracefully to other nodes in the cluster. You have multiple ways of scaling your services, in this example, we are using Service Fabric Explorer.

To fail over the front-end container, do the following steps:

1. Open Service Fabric Explorer in your cluster - for example,`http://<my-azure-cluster-url>:19080`.
2. Click on the **fabric:/TestContainer/azurevotefront** node in the tree-view and expand the partition node (represented by a GUID). Notice the node name in the treeview, which shows you the nodes that container is currently running on - for example `_nodetype_1`
3. Expand the **Nodes** node in the treeview. Click on the ellipsis (three dots) next to the node, which is running the container.
1. Choose **Restart** to restart that node and confirm the restart action. The restart causes the container to fail over to another node in the cluster.

![sfx][sfx]


Notice how the node name indicating where the front-end containers runs, now changes to another node in the cluster. After a few moments, you should be able to browse to the application again and see the application now running on a different node.

## Scale applications and services in a cluster
Service Fabric services can be scaled across a cluster to accommodate for the load on the services. You scale a service by changing the number of instances running in the cluster.

To scale the web front-end service, do the following steps:

1. Open Service Fabric Explorer in your cluster - for example,`http://<my-cluster-url>.cloudapp.azure.com:19080`.
2. Click on the ellipsis (three dots) next to the **fabric:/TestContainer/azurevotefront** node in the treeview and choose **Scale Service**.

    ![sfxscale][sfxscale]

    You can now choose to scale the number of instances of the web front-end service.

3. Change the number to **2** and click **Scale Service**.
4. Click on the **fabric:/TestContainer/azurevotefront** node in the tree-view and expand the partition node (represented by a GUID).

    ![sfxscaledone][sfxscaledone]

    You can now see that the service has two instances. In the tree view, you see which nodes the instances run on.

By this simple management task, we doubled the resources available for our front-end service to process user load. It's important to understand that you do not need multiple instances of a service to have it run reliably. If a service fails, Service Fabric makes sure a new service instance runs in the cluster.

## Next steps

In this tutorial, service failover was demonstrated as well as scaling of an application. The following steps were completed:

> [!div class="checklist"]
> * Demonstrate failover scenario and how it is handled
> * Scale applications in a service fabric cluster

In this tutorial series, you learned how to: 
> [!div class="checklist"]
> * Create container images
> * Push container images to Azure Container Registry
> * Package Containers for Service Fabric using Yeoman
> * Build and Run a Service Fabric Application with Containers
> * How failover and scaling are handled in Service Fabric

[sfx]: ./media/service-fabric-tutorial-containers-failover/sfxnoderestart.png
[sfxscale]: ./media/service-fabric-tutorial-containers-failover/sfxscaleservicelocation.png
[sfxscaledone]: ./media/service-fabric-tutorial-containers-failover/sfxscaleservicedone.png