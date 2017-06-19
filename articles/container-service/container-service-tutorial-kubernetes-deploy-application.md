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
ms.date: 06/21/2017
ms.author: nepeters
---

# Deploy application to Kubernetes cluster

In previous tutorials, an application has been tested and container images created. These images have been pushed to an Azure Container Registry. Finally, and Azure Container Service Kubernetes cluster has been deployed. In this tutorial, the Azure Voting app is deployed into the Kubernetes cluster. In subsequent tutorials, this application is scaled out, updated, and the Kubernetes cluster monitored.

Tasks completed in this tutorial include:

> [!div class="checklist"]
> * Understand the Kubernetes objects
> * Download Kubernetes manifest files
> * Deploy application into Kubernetes cluster
> * Test the application

## Prerequisites

This tutorial is one of a multi-part series. You do not need to complete the full series to work through this tutorial, however the following items are required.

**ACS Kubernetes cluster** – see, [Create a Kubernetes cluster](container-service-tutorial-kubernetes-deploy-cluster.md) for information on creating the cluster.

## Kubernetes objects

When deploying a containerized application into Kubernetes, many different Kubernetes objects are created. Each object represents the desired state for a portion of the deployment. For example, a simple application may consist of a pod, which is a grouping of closely related containers, a persistent volume, which is a piece of networked storage, and a deployment, which manages the state of the application. 

For details on all Kubernetes object, see [Kubernetes Concepts](https://kubernetes.io/docs/concepts/) on kubernetes.io.

## Get manifest files

For this tutorial, Kubernetes objects are deployed using Kubernetes manifest files. Manifest files are YAML files that contain configuration instructions.

The manifest files for each object in this tutorial are available in the Azure Vote application repo. If you have not already done so, clone the repo with the following command: 

```bash
git clone https://github.com/Azure-Samples/azure-voting-app.git
```

The manifest files are found in the following directory of the cloned repo. The files are used throughout this tutorial.

```bash
/azure-voting-app/kubernetes-manifests/
```

## All in one deployment

To quickly deploy the application and skip the step-by-step explanation, run the following command. To step through a detailed deployment, skip to the [step-by-step deployment](#step-by-step-deployment) section of this document. 

```bash
kubectl create -f azure-vote-all-in-one.yaml
```

When complete, jump ahead to the [Test application](#test-application) section of this document.

## Step-by-step deployment

### Storage objects

Because the Azure Vote application includes a MySQL database, you want to store the database file on a volume that can be shared between pods. In this configuration, if the MySQL pod is recreated, the database file remains intact.

The `storage-resources.yaml` manifest file creates a [storage class object](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#storageclasses), which defines how and where a persistent volume is created. Several volume plug-ins are available for Kubernetes. In this case, the [Azure disk](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#azure-disk) plug-in is used. 

A [persistent volume claim](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims) is also created, which configures a piece of storage (using a storage class), and assigns it to a pod.

Run the following to create the storage objects.

```bash
kubectl create -f storage-resources.yaml
```

Once completed, a virtual disk is created and attached to the resulting Kubernetes pod. The virtual disk is automatically created in a storage account residing in the same resource group as the Kubernetes cluster, and of the same configuration as the storage class object (Standard_LRS).

### Secure sensitive values

[Kubernetes secrets](https://kubernetes.io/docs/concepts/configuration/secret/) provide a secure storage environment for sensitive information. These secrets can then be used inside Kubernetes deployments.

Using the `pod-secrets.yaml` file, the Azure Vote database credentials are stored in a secret. The values for each secret are stored in the Kubernetes manifest as base64 encoded strings. For this sample, notes have been placed inside the manifest with the decoded values.

Run the following to create the secrets objects.

```bash
kubectl create -f pod-secrets.yaml
```

### Create back-end deployment

A [Kubernetes deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/) manages the state of Kubernetes pods. This management includes things like ensuring that the desired replica counts are running, volumes are mounted, and the proper container images are being used.

The `backend-deployment.yaml` manifest file creates a deployment for the back-end portion of the Azure Vote application.

If using Azure Container Registry, update the container image name in the `backend-deployment.yaml` file with the loginServer of the ACR instance. If you do not update the container image name, a pre-created image is pulled from a public registry.

```yaml
containers:
      - name: azure-vote-back
        image: <acrLoginServer>/azure-vote-back:v1
```

Run the following to create the back-end deployment.

```bash
kubectl create -f backend-deployment.yaml
```

### Create front-end deployment

The front-end deployment is configured in the `frontend-deployment.yaml` manifest file.

Again, if using ACR, update the container image name in the `frontend-deployment.yaml` file to reference the ACR loginServer name. If you do not update the container image name, a pre-created image is pulled from a public registry.

```yaml
containers:
      - name: azure-vote-front
        image: <acrLoginServer>/azure-vote-front:v1
```

Run the following to create the front-end deployment.

```bash
kubectl create -f frontend-deployment.yaml
```

### Expose application

A [Kubernetes service](https://kubernetes.io/docs/concepts/services-networking/service/) defines how a deployment is accessed. With the Azure Vote app, the back-end deployment must be internally accessible by deployment name. The font-end deployment must be accessible over the internet. The Azure Vote app service configuration is defined in the `services.yaml` manifest file.

Run the following to create the services.

```bash
kubectl create -f services.yaml
```

## Test application

Once all objects have been created, the application can be accessed over the external IP address for the azure-vote-front service. This service can take a few minutes to create. To monitor the service creation process, run the following command. When the *EXTERNAL-IP* value for the *azure-vote-front* service switches from *pending* to an IP address, the application is ready, and can be accessed on the external IP address.

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