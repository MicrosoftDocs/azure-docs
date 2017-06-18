---
title: Azure Container Service tutorial - Deploy Application | Microsoft Docs
description: Azure Container Service tutorial - Deploy Application
services: container-service
documentationcenter: ''
author: neilpeterson
manager: timlt
editor: ''
tags: acs, azure-container-service
keywords: Docker, Containers, Micro-services, Kubernetes, DC/OS, Azure

ms.assetid: 
ms.service: container-service
ms.devlang: aurecli
ms.topic: sample
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 06/17/2017
ms.author: nepeters
---

# Deploy application to Kubernetes cluster

In previous tutorials of this set, an application has been tested and container images created. These images have been pushed to an Azure Container Registry. Finally, and Azure Container Service Kubernetes cluster has been deployed. In this tutorial, the Azure Voting app is deployed into the Kubernetes cluster. In subsequent tutorials, this application is scaled out, updated, and monitored.

Tasks completed in this tutorial include:

> [!div class="checklist"]
> * Understand the Kubernetes objects
> * Download Kubernetes manifest files
> * Deploy application into Kubernetes cluster
> * Test the application

## Prerequisites

This is one tutorial of a multi-part series. You do not need to complete the full series to work through this tutorial, however the following items are required.

**ACS Kubernetes cluster** – see, [Create a Kubernetes cluster](container-service-tutorial-kubernetes-deploy-cluster.md) for information on creating the cluster.

**Azure Container Registry** – if you would like to integrate Azure Container registry, an ACR instance is needed. See, [Deploy container registry](container-service-tutorial-kubernetes-prepare-acr.md) for information on the deployment steps.

## Introduction to Kubernetes objects

When deploying a containerized application into a Kubernetes cluster, many different Kubernetes objects are created. Each object represents the desired state for a portion of the deployment. For example, a simple application may consist of a pod, which is a grouping of closely related containers, a persistent volume, which is a piece of networked storage that is used for data storage, persistent volume claim, which is a request to use a persistent volume, and a deployment, which manages the state of the application. 

For details on all Kubernetes object, see [Kubernetes Concepts]( https://kubernetes.io/docs/concepts/) on kubernetes.io.

## Get manifest files

For this tutorial, Kubernetes object will be deployed using Kubernetes manifest files. Manifest files are YAML files that contain the configuration instructions.

The manifest files for each object in this tutorial are available in the Azure Vote application repo. If you have not already done so, clone the repo with the following command: 

```bash
git clone https://github.com/Azure-Samples/azure-voting-app.git
```

Once downloaded, change to the kubernetes-manifests directory.

```bash
cd kubernetes-manifests
```

## Deploy the Azure Vote app

### Update the deployment manifest

Because your images are stored in an Azure Container Registry, or any other registry service, the deployment manifest must be updated to reference this location. 

Open up the ` azure-vote-all-in-one.yaml` file, locate the two container images inside of the deployment object, and updated the image name to include the ACR login server name. If this step is skipped, pre-created images will be pulled from a public registry. 

Example of the azure-vote back-end deployment configuration:

```yaml
containers:
      - name: azure-vote-back
        image: <acrLoginServer>/azure-vote-back:v1
```

Example of the azure-vote front-end deployment configuration:

```yaml
containers:
      - name: azure-vote-front
        image: <acrLoginServer>/azure-vote-front:v1
```

### Deploy the application

The all in one deployment manifest deploys all Kubernetes objects. Collectively these create the application.  

```bash
kubectl create -f azure-vote-all-in-one.yaml
```

Output:

```bash
storageclass "slow" created
persistentvolumeclaim "mysql-pv-claim" created
secret "azure-vote" created
deployment "azure-vote-back" created
service "azure-vote-back" created
deployment "azure-vote-front" created
service "azure-vote-front" created
```

## Test application

Once all resources have been created, the application can be accessed over the external IP address for the azure-vote-front service. This service can take a few minutes to create. To monitor the service creation process, run the following command. When the *EXTERNAL-IP* value for the *azure-vote-front* service switches from *pending* to an IP address, the application is ready and can be accessed on the external IP address.

```bash
kubectl get service -w
```

Output:

```bash
NAME               CLUSTER-IP    EXTERNAL-IP     PORT(S)        AGE
azure-vote-back    10.0.77.30    <none>          3306/TCP       4m
azure-vote-front   10.0.120.96   40.71.227.124   80:31482/TCP   4m
kubernetes         10.0.0.1      <none>          443/TCP        7m
```

Browse to the returned external IP address to see the application.

![Image of Kubernetes cluster on Azure](media/container-service-kubernetes-tutorials/vote-app-external.png)

## Next steps

In this tutorial, the Azure vote application was deployed to an Azure Container Service Kubernetes cluster. Tasks completed include:  

> [!div class="checklist"]
> * Understand the Kubernetes objects
> * Download Kubernetes manifest files
> * Deploy application into Kubernetes cluster
> * Test the application

Advance to the next tutorial to learn about scaling both a Kubernetes application and the underlying Kubernetes infrastructure. 

> [!div class="nextstepaction"]
> [Scale Kubernetes application and infrastructure](./container-service-tutorial-kubernetes-scale.md)