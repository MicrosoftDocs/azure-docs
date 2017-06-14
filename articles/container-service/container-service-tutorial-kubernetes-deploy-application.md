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
ms.date: 06/13/2017
ms.author: nepeters
---

# Azure Container Service tutorial - Deploy Application

If you have been following along, at this point, an application was tested, container images created and up loaded to an Azure Container registry, and finally an Azure Container Service Kubernetes cluster deployed. In this tutorial, the Azure Voting app will be deployed into the Kubernetes cluster. In subsequent tutorials, this application will be scaled out, updated, and the deployment process simplified using Helm.

Tasks completed in this tutorial include:

> [!div class="checklist"]
> * Understand the Kubernetes resources that will be deployed
> * Deploy and test the application

## Understand Kubernetes Objects

When deploying a containerized application into a Kubernetes cluster, many different Kubernetes objects are created. Each object represents the desired state for a portion of the application deployment. For example, a simple application may consist of a pod, which is a grouping of closely related containers, a persistent volume, which is a piece of networked storage that is used for data storage, persistent volume claim which is a request to use a persistent volume, and a deployment which manages the state of the application. 

For details on all Kubernetes object, see [Kubernetes Concepts]( https://kubernetes.io/docs/concepts/) on kubernetes.io.

Each Kubernetes object is defined and deployed using YAML. The following example show the configuration for a storage class object. 

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
 name: slow
provisioner: kubernetes.io/azure-disk
parameters:
 skuName: Standard_LRS
 location: eastus
```

To create an object in Kubernetes, the `kubectl create` command is used. For instance, if the pervious storage class object definition was saved in a file named *storage-class.yaml*, it could be deployed using the following command.

```bash
kubectl create -f storage-class.yaml
```

To return a list of Kubernetes object, use the `kubectl get` command, with the object class name. For instance, the following example returns a list of existing storage class object.

```bash
kubectl get storageclass
```

Output:

```bash
NAME                TYPE
default (default)   kubernetes.io/azure-disk   
slow                kubernetes.io/azure-disk
```

To gather detailed information on a specific object, including configuration and deployment status, use the `kubectl describe` command.

```bash
kubectl describe storageclass slow
```

Output:

```bash
ame:		slow
IsDefaultClass:	No
Annotations:	<none>
Provisioner:	kubernetes.io/azure-disk
Parameters:	location=eastus,skuName=Standard_LRS
Events:		<none>
```

## Deploy Azure Vote App

A pre-configured YAML file has been created for the Azure Voting application. The file can be found in the Azure Voting app repository. If you cloned the repository in an earlier tutorial, find the *azure-vote-kubernetes.yaml* files at the root of the repo. If you need to clone the repo, run the following.

```bash
git clone https://github.com/neilpeterson/azure-kubernetes-samples.git
```

The Kubernetes manifest file is ready to go as is, however is configured to pull container images from a public registry. To configure it such that the Azure Vote app images are pulled from your Azure Container Registry instance, update the image names with the `loginServer` name for the ACR instance.

To get the ACR login server name, run the following.

```azurecli-interactive

```

Update line 46 and 104 of the *azure-vote-kubernetes.yaml* to reflect your ACR instance.

```yaml

```

When ready, start the app deployment with the `kubectl create` command.

```bash
kubectl create -f azure-vote-kubernetes.yaml
```

Once run, kubectl will return a list of created objects. 

```bash
storageclass "slow" created
persistentvolumeclaim "mysql-pv-claim" created
secret "azure-vote" created
deployment "azure-vote-back" created
service "azure-vote-back" created
deployment "azure-vote-front" created
service "azure-vote-front" created
```

To determine when the application is ready to be accessed, return a list of services.

```bash
kubectl get service
```

## Understand the created objects

Each of these objects types is detailed in the following table.

| Kubernetes Object | Description |
|---|---|
| storageclass | Defines types of available storage. Many volume plug-ins are valuable including [Azure Disk](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#azure-disk), which is used here.  |
| persistentvolumeclaim | A request for storage including the size needed and access configuration (read-only, read-write). |
| secret | A secure storage environment for sensitive information. In this example, the Azure Vote database credentials are stored in a secret and used in the application deployment. |
| deployment | The application management object. A deployment creates and maintains pods. Pods are the compute processes that run the application containers. It is in the deployment that a container image is selected, resource allocation is configured, and replica counts are defined.   |
| service | Defines how a pod is accessed over a network. In this example, the MySQL pod is only accessible internally to the cluster. The front-end application is exposed externally using a service type of *LoadBalancer*. |

## Next steps

In this tutorial, the Azure vote application was deployed to an Azure Container Service Kubernetes cluster. Tasks completed include:  

> [!div class="checklist"]
> * Understand the Kubernetes resources that will be deployed
> * Deploy and test the application

Advance to the next tutorial to learn about scaling both a Kubernetes application and the underlying Kubernetes infrastructure. 

> [!div class="nextstepaction"]
> [Scale Kubernetes application and infrastructure](./container-service-tutorial-kubernetes-scale-application.md)

