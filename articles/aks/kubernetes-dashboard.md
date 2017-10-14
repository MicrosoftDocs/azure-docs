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

## Run an application

In the Kubernetes dashboard, click **Create** button in the upper right window.

Give the deployment the name `nginx` and enter `nginx:latest` for the images name.

Under **Service**, select **External** and enter `80` for both the port and target port.

![Kubernetes Service Create Dialog](./media/container-service-kubernetes-ui/create-deployment.png)

Click **Deploy** to create the deployment.

## View the application

Status about the application can be seein on the Kubernetes dashboard. Once the application is running, each component will have a green checkbox next to it.

![Kubernetes Pods](./media/container-service-kubernetes-ui/complete-deployment.png)

To see more information about the application pods, click on **Pods** in the left-hand menu, and then select the **NGINX** pod. Here you can see information such as resource consumption.

![Kubernetes Resources](./media/container-service-kubernetes-ui/running-pods.png)

To find the IP address of the application, click on **Services** in the left-hand menu, and then select the **NGINX** service.

![nginx view](./media/container-service-kubernetes-ui/nginx-service.png)

## Editing the deployment

In addition to viewing your objects in the UI, you can edit and update the Kubernetes API objects.

First, click **Deployments** in the left navigation pane to see the deployment for your service.

Once you are in that view, click on the replica set, and then click **Edit** in the upper navigation bar:

![Kubernetes Edit](./media/container-service-kubernetes-ui/edit.png)

Edit the `spec.replicas` field to be `2`, and click **Update**.

This causes the number of replicas to drop to two by deleting one of your pods.