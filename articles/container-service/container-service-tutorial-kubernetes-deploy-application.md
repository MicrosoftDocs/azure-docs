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
ms.date: 06/26/2017
ms.author: nepeters
---

# Run applications in Kubernetes

In this tutorial, a sample application is deployed into a Kubernetes cluster. Steps completed include:

> [!div class="checklist"]
> * Kubernetes objects introduction
> * Download Kubernetes manifest files
> * Run application in Kubernetes
> * Test the application

In subsequent tutorials, this application is scaled out, updated, and the Kubernetes cluster monitored.

## Before you begin

In previous tutorials, an application was packaged into container images, these images uploaded to Azure Container Registry, and a Kubernetes cluster created. If you have not done these steps, and would like to follow along, return to [Tutorial 1 – Create container images](./container-service-tutorial-kubernetes-prepare-app.md). 

At minimum, this tutorial requires a Kubernetes cluster.

## Kubernetes objects

When deploying a containerized application into Kubernetes, many different Kubernetes objects are created. Each object represents the desired state for a portion of the deployment. For example, a simple application may consist of a pod, which is a grouping of closely related containers, a persistent volume, which is a piece of networked storage, and a deployment, which manages the state of the application. 

For details on all Kubernetes object, see [Kubernetes Concepts](https://kubernetes.io/docs/concepts/) on kubernetes.io.

## Get manifest files

For this tutorial, Kubernetes objects are deployed using Kubernetes manifests. A Kubernetes manifest is a YAML file containing object configuration instructions.

The manifest files for each object in this tutorial are available in the Azure Vote application repo, which was cloned in a pervious tutorial. If you have not already done so, clone the repo with the following command: 

```bash
git clone https://github.com/Azure-Samples/azure-voting-app.git
```

The manifest files are found in the following directory of the cloned repo.

```bash
/azure-voting-app/kubernetes-manifests/
```

## Run application

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

[Kubernetes secrets](https://kubernetes.io/docs/concepts/configuration/secret/) provide secure storage for sensitive information. Using the `pod-secrets.yaml` file, the Azure Vote database credentials are stored in a secret. 

Run the following to create the secrets objects.

```bash
kubectl create -f pod-secrets.yaml
```

### Create deployments

A [Kubernetes deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/) manages the state of Kubernetes pods. This management includes things like ensuring that the desired replica counts are running, volumes are mounted, and the proper container images are being used.

The `azure-vote-deployment.yaml` manifest file creates a deployment for the front-end and back-end portions of the Azure Vote application.

#### Update image names

If using Azure Container Registry to store images, the image names need to be prepended with the ACR logins server name.

Get the ACR login server name with the [az acr list](/cli/azure/acr#list) command.

```azurecli-interactive
az acr list --resource-group myResourceGroup --query "[].{acrLoginServer:loginServer}" --output table
```

Update the *azure-vote-front* and *azure-vote-back* container image names in the `azure-vote-deployment.yaml` file.

Front-end image name example:

```yaml
containers:
      - name: azure-vote-front
        image: <acrLoginServer>/azure-vote-front:v1
```

Back-end image name example:

```yaml
containers:
      - name: azure-vote-back
        image: <acrLoginServer>/azure-vote-front:v1
```

#### Create deployment objects

Run [kubectl create](https://kubernetes.io/docs/user-guide/kubectl/v1.6/#create) to start the Azure Vote application.

```bash
kubectl create -f azure-vote-deployment.yaml
```

### Expose application

A [Kubernetes service](https://kubernetes.io/docs/concepts/services-networking/service/) defines how a deployment is accessed. With the Azure Vote app, the back-end deployment must be internally accessible by deployment name. The font-end deployment must be accessible over the internet. The Azure Vote app service configurations are defined in the `services.yaml` manifest file.

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

After the service is ready, run `CTRL-C` to terminate kubectl watch.

Browse to the returned external IP address to see the application.

![Image of Kubernetes cluster on Azure](media/container-service-kubernetes-tutorials/vote-app-external.png)

## Next steps

In this tutorial, the Azure vote application was deployed to an Azure Container Service Kubernetes cluster. Tasks completed include:  

> [!div class="checklist"]
> * Kubernetes objects introduction
> * Download Kubernetes manifest files
> * Run application in Kubernetes
> * Test the application

Advance to the next tutorial to learn about scaling both a Kubernetes application and the underlying Kubernetes infrastructure. 

> [!div class="nextstepaction"]
> [Scale Kubernetes application and infrastructure](./container-service-tutorial-kubernetes-scale.md)