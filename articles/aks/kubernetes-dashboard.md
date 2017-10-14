---
title: Manage Azure Kubernetes cluster with web UI | Microsoft Docs
description: Using the Kubernetes web UI in Azure Container Service
services: container-service
documentationcenter: ''
author: neilpeterson
manager: timlt
editor: ''
tags: acs, azure-container-service, kubernetes
keywords: ''

ms.assetid: 
ms.service: container-service
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/13/2017
ms.author: nepeters
ms.custom: mvc

---

# Using the Kubernetes dashboard with AKS

The Azure CLI can be used to start the Kubernetes Dashboard. This document walks through starting the Kubernetes dashboard and using it to run an application the AKS Kubernetes cluster. 

## Before you begin

The steps detailed in this document assume that you have created an AKS Kubernetes cluster and have established a kubectl connection with the cluster. If you need these items see, the [AKS Kubernetes quickstart](./kubernetes-walkthrough.md).

You also need the Azure CLI version 2.0.4 or later installed and configured. Run az --version to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0](/cli/azure/install-azure-cli).

## Start Kubernetes dashboard

Use the `az aks browse` command to start the Kubernetes dashboard.

```console
$ az acs kubernetes browse -g [Resource Group] -n [Container service instance name]
```

This command creates a proxy between your development system and the Kubernetes API, and opens a web browser to the Kubernetes dashboard.

## Create a Kubernetes deployment

In the Kubernetes dashboard, click **Create** button in the upper right window.

Give the deployment the name `hello-nginx` and enter `nginx:latest` for the images name.

Under **Service**, select **External** and enter 80 for both the port and target port.

![Kubernetes Service Create Dialog](./media/container-service-kubernetes-ui/create-deployment.png)

Click **Deploy** to create the deployment.

![Kubernetes Deploy](./media/container-service-kubernetes-ui/deploy.png)

## View the deployed application

After you click **Deploy**, the UI shows a view of your service as it deploys:

![Kubernetes Status](./media/container-service-kubernetes-ui/status.png)

You can see the status of each Kubernetes object in the circle on the left-hand side of the UI, under **Pods**. If it is a partially full circle, then the object is still deploying. When an object is fully deployed, it displays a green check mark:

![Kubernetes Deployed](./media/container-service-kubernetes-ui/deployed.png)

Once everything is running, click one of your pods to see details about the running web service.

![Kubernetes Pods](./media/container-service-kubernetes-ui/pods.png)

In the **Pods** view, you can see information about the containers in the pod as well as the CPU and memory resources used by those containers:

![Kubernetes Resources](./media/container-service-kubernetes-ui/resources.png)

If you don't see the resources, you may need to wait a few minutes for the monitoring data to propagate.

To see the logs for your container, click **View logs**.

![Kubernetes Logs](./media/container-service-kubernetes-ui/logs.png)

## Editing the deployment

In addition to running your containers, the Kubernetes UI has created an external `Service` which provisions a load balancer to bring traffic to the containers in your cluster.

In the left navigation pane, click **Services** to view all services (there should be only one).

![Kubernetes Services](./media/container-service-kubernetes-ui/service-deployed.png)

In that view, you should see an external endpoint (IP address) that has been allocated to your service. If you click that IP address, you should see your Nginx container running behind the load balancer.

![nginx view](./media/container-service-kubernetes-ui/nginx-page.png)

### Resizing your service
In addition to viewing your objects in the UI, you can edit and update the Kubernetes API objects.

First, click **Deployments** in the left navigation pane to see the deployment for your service.

Once you are in that view, click on the replica set, and then click **Edit** in the upper navigation bar:

![Kubernetes Edit](./media/container-service-kubernetes-ui/edit.png)

Edit the `spec.replicas` field to be `2`, and click **Update**.

This causes the number of replicas to drop to two by deleting one of your pods.