---
title: Quickstart - Azure Kubernetes cluster portal quickstart | Microsoft Docs
description: Quickly learn to create a Kubernetes cluster for Linux containers in AKS with the Azure portal.
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
ms.date: 11/28/2017
ms.author: nepeters
ms.custom:
---

# Deploy an Azure Container Service (AKS) cluster

In this quickstart, an AKS cluster is deployed using the Azure portal. A multi-container application consisting of web front end and a Redis instance is then run on the cluster. Once completed, the application is accessible over the internet.

![Image of browsing to Azure Vote](media/container-service-kubernetes-walkthrough/azure-vote.png)

This quickstart assumes a basic understanding of Kubernetes concepts, for detailed information on Kubernetes see the [Kubernetes documentation](https://kubernetes.io/docs/home/).

## Log in to Azure

Log in to the Azure portal at http://portal.azure.com

## Create service principal

![Create service principal one](media/container-service-walkthrough-portal/create-sp-one.png)

![Create service principal two](media/container-service-walkthrough-portal/create-sp-two.png)

![Create service principal three](media/container-service-walkthrough-portal/create-sp-three.png)

## Create AKS cluster

![Create AKS cluster one](media/container-service-walkthrough-portal/create-aks-portal-one.png)

![Create AKS cluster two](media/container-service-walkthrough-portal/create-aks-portal-two.png)

## Connect to the cluster

To manage a Kubernetes cluster, use [kubectl](https://kubernetes.io/docs/user-guide/kubectl/), the Kubernetes command-line client.

Open Cloud Shell using the button on the top right hand corner of the Azure portal.


Use the [az aks get-credentials](/cli/azure/aks?view=azure-cli-latest#az_aks_get_credentials) command to configure kubectl to connect to your Kubernetes cluster.

```azurecli-interactive
az aks get-credentials --resource-group myAKSCluster --name myAKSCluster
```

![Cloud shell](media/container-service-walkthrough-portal/kubectl-cs.png)

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

