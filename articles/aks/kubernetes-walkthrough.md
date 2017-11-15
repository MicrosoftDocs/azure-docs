---
title: Quickstart - Azure Kubernetes cluster for Linux | Microsoft Docs
description: Quickly learn to create a Kubernetes cluster for Linux containers in AKS with the Azure CLI.
services: container-service
documentationcenter: ''
author: neilpeterson
manager: timlt
editor: ''
tags: aks, azure-container-service, kubernetes
keywords: ''

ms.assetid: 8da267e8-2aeb-4c24-9a7a-65bdca3a82d6
ms.service: container-service
ms.devlang: na
ms.topic: quickstart
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 11/11/2017
ms.author: nepeters
ms.custom: H1Hack27Feb2017, mvc, devcenter
---

# Deploy an Azure Container Service (AKS) cluster

In this quickstart, an AKS cluster is deployed using the Azure CLI. A multi-container application consisting of web front end and a Redis instance is then run on the cluster. Once completed, the application is accessible over the internet.

![Image of browsing to Azure Vote](media/container-service-kubernetes-walkthrough/azure-vote.png)

This quickstart assumes a basic understanding of Kubernetes concepts, for detailed information on Kubernetes see the [Kubernetes documentation]( https://kubernetes.io/docs/home/).

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this quickstart requires that you are running the Azure CLI version 2.0.20 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI]( /cli/azure/install-azure-cli).

## Enabling AKS preview for your Azure subscription
While AKS is in preview, creating new clusters requires a feature flag on your subscription. You may request this feature for any number of subscriptions that you would like to use. Use the `az provider register` command to register the AKS provider:

```azurecli-interactive
az provider register -n Microsoft.ContainerService
```

After registering, you are now ready to create a Kubernetes cluster with AKS.

You may need to register other providers depending on if you have used them previously

```azurecli-interactive
az provider register -n Microsoft.Compute
az provider register -n Microsoft.Network
```

## Create a resource group

Create a resource group with the [az group create](/cli/azure/group#create) command. An Azure resource group is a logical group in which Azure resources are deployed and managed.

The following example creates a resource group named *myResourceGroup* in the *eastus* location. [Read more about available locations during preview.](https://github.com/Azure/AKS/blob/master/preview_regions.md)

```azurecli-interactive
az group create --name myResourceGroup --location eastus
```

Output:

```json
{
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup",
  "location": "eastus",
  "managedBy": null,
  "name": "myResourceGroup",
  "properties": {
    "provisioningState": "Succeeded"
  },
  "tags": null
}
```

## Create AKS cluster

The following example creates a cluster named *myK8sCluster* with one node.

```azurecli-interactive
az aks create --resource-group myResourceGroup --location eastus --name myK8sCluster --agent-count 1 --generate-ssh-keys
```

After several minutes, the command completes and returns JSON-formatted information about the cluster.

## Connect to the cluster

To manage a Kubernetes cluster, use [kubectl](https://kubernetes.io/docs/user-guide/kubectl/), the Kubernetes command-line client.

If you're using Azure Cloud Shell, kubectl is already installed. If you want to install it locally, run the following command.


```azurecli
az aks install-cli
```

To configure kubectl to connect to your Kubernetes cluster, run the following command. This step downloads credentials and configures the Kubernetes CLI to use them.

```azurecli-interactive
az aks get-credentials --resource-group myResourceGroup --name myK8sCluster
```

To verify the connection to your cluster, use the [kubectl get](https://kubernetes.io/docs/user-guide/kubectl/v1.6/#get) command to return a list of the cluster nodes.

```azurecli-interactive
kubectl get nodes
```

Output:

```
NAME                          STATUS    ROLES     AGE       VERSION
k8s-myk8scluster-36346190-0   Ready     agent     2m        v1.7.7
```

## Run the application

A Kubernetes manifest file defines a desired state for the cluster, including what container images should be running. For this example, a manifest is used to create all objects needed to run the Azure Vote application.

Create a file named `azure-vote.yml` and copy into it the following YAML code. If you are working in Azure Cloud Shell, this file can be created using vi or Nano as if working on a virtual or physical system.

```yaml
apiVersion: apps/v1beta1
kind: Deployment
metadata:
  name: azure-vote-back
spec:
  replicas: 1
  template:
    metadata:
      labels:
        app: azure-vote-back
    spec:
      containers:
      - name: azure-vote-back
        image: redis
        ports:
        - containerPort: 6379
          name: redis
---
apiVersion: v1
kind: Service
metadata:
  name: azure-vote-back
spec:
  ports:
  - port: 6379
  selector:
    app: azure-vote-back
---
apiVersion: apps/v1beta1
kind: Deployment
metadata:
  name: azure-vote-front
spec:
  replicas: 1
  template:
    metadata:
      labels:
        app: azure-vote-front
    spec:
      containers:
      - name: azure-vote-front
        image: microsoft/azure-vote-front:redis-v1
        ports:
        - containerPort: 80
        env:
        - name: REDIS
          value: "azure-vote-back"
---
apiVersion: v1
kind: Service
metadata:
  name: azure-vote-front
spec:
  type: LoadBalancer
  ports:
  - port: 80
  selector:
    app: azure-vote-front
```

Use the [kubectl create](https://kubernetes.io/docs/user-guide/kubectl/v1.6/#create) command to run the application.

```azurecli-interactive
kubectl create -f azure-vote.yml
```

Output:

```
deployment "azure-vote-back" created
service "azure-vote-back" created
deployment "azure-vote-front" created
service "azure-vote-front" created
```

## Test the application

As the application is run, a [Kubernetes service](https://kubernetes.io/docs/concepts/services-networking/service/) is created that exposes the application front end to the internet. This process can take a few minutes to complete.

To monitor progress, use the [kubectl get service](https://kubernetes.io/docs/user-guide/kubectl/v1.6/#get) command with the `--watch` argument.

```azurecli-interactive
kubectl get service azure-vote-front --watch
```

Initially the *EXTERNAL-IP* for the *azure-vote-front* service appears as *pending*.

```
NAME               TYPE           CLUSTER-IP   EXTERNAL-IP   PORT(S)        AGE
azure-vote-front   LoadBalancer   10.0.37.27   <pending>     80:30572/TCP   6s
```

Once the *EXTERNAL-IP* address has changed from *pending* to an *IP address*, use `CTRL-C` to stop the kubectl watch process.

```
azure-vote-front   LoadBalancer   10.0.37.27   52.179.23.131   80:30572/TCP   2m
```

You can now browse to the external IP address to see the Azure Vote App.

![Image of browsing to Azure Vote](media/container-service-kubernetes-walkthrough/azure-vote.png)

## Delete cluster
When the cluster is no longer needed, you can use the [az group delete](/cli/azure/group#delete) command to remove the resource group, container service, and all related resources.

```azurecli-interactive
az group delete --name myResourceGroup --yes --no-wait
```

## Get the code

In this quickstart, pre-created container images have been used to create a Kubernetes deployment. The related application code, Dockerfile, and Kubernetes manifest file are available on GitHub.

[https://github.com/Azure-Samples/azure-voting-app-redis](https://github.com/Azure-Samples/azure-voting-app-redis.git)

## Next steps

In this quick start, you deployed a Kubernetes cluster and deployed a multi-container application to it.

To learn more about AKS, and walk through a complete code to deployment example, continue to the Kubernetes cluster tutorial.

> [!div class="nextstepaction"]
> [Manage an AKS cluster](./tutorial-kubernetes-prepare-app.md)
