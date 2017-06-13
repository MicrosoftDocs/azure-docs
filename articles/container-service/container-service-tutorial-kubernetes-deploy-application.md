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
ms.date: 06/11/2017
ms.author: nepeters
---

# Azure Container Service tutorial - Deploy Application

If you have been following along in this tutorial set, at this point an application was tested in a development environment, container images created and up loaded to an Azure Container registry, and finally an Azure Container Service Kubernetes cluster deployed. In this tutorial, the Azure Voting app will be deployed onto the cluster. In subsequent tutorials, this application will be scaled out, updated, and the deployment process simplified using Helm.

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

To create an object in Kubernetes, the `kubectl create` command is used. For instance, if the pervious storage class object definition was saved in a file named *storage-class.yaml*, it would be deployed using the following command.

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

```bash
kubectl create -f https://raw.githubusercontent.com/neilpeterson/azure-kubernetes-samples/master/flask-mysql-vote/azure-vote-kubernetes.yaml
```

```bash
storageclass "slow" created
persistentvolumeclaim "mysql-pv-claim" created
secret "azure-vote" created
deployment "azure-vote-back" created
service "azure-vote-back" created
deployment "azure-vote-front" created
service "azure-vote-front" created
```

## Next steps

In this tutorial, the Azure vote application was deployed to an Azure Container Service Kubernetes cluster. Tasks completed include:  

> [!div class="checklist"]
> * Understand the Kubernetes resources that will be deployed
> * Deploy and test the application

Advance to the next tutorial to learn about scaling both a Kubernetes application and the underlying Kubernetes infrastructure. 

> [!div class="nextstepaction"]
> [Scale Kubernetes application and infrastructure](./container-service-tutorial-kubernetes-scale-application.md)

