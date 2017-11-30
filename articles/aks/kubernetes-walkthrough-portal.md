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

Before creating the AKS cluster in the Azure portal, you need to create a service principal. This service principal is used to manage the Azure infrastructure associated with the AKS cluster.

Select **Azure Active Directory** > **App registrations** > **New application registration**.

Enter a name for the application, this can be any value. Select `Web app / API` for the application type. Enter a value for the Sign-on URL, this can be any value with a valid URL format. 

Select **Create** when finished.

![Create service principal one](media/container-service-walkthrough-portal/create-sp-one.png)

Select the newly created registered application, and take note of the Application ID. This value is needed when creating the AKS cluster. 

![Create service principal two](media/container-service-walkthrough-portal/create-sp-two.png)

Select **All Settings** > **Keys**, and enter a key description, this can be any value. Select a duration, this is the time for which the service principal is valid. 

Click **Save** and take note of the password value, this value is needed when creating an AKS cluster.  

![Create service principal three](media/container-service-walkthrough-portal/create-sp-three.png)

## Create AKS cluster

Select **New** > **Containers** > **Azure Container Service - AKS (preview)**.

Provide a name for the cluster, an optional DNS name, select a Kubernetes version, and a resource group name and location. Take note of the cluster name and resource group name, these are needed when connecting to the cluster. 

Select **OK** when complete.

![Create AKS cluster one](media/container-service-walkthrough-portal/create-aks-portal-one.png)

Enter a **User name**, this is used for the administrative account created on the cluster nodes. Enter an **SSH public key** value, and the **Service principal ID** and **Service principal secret** from the newly created service principal. Select the number of nodes for the cluster, and the VM size for these nodes. Optionally, the node disk size can be configured.

Select **OK** when complete.

![Create AKS cluster two](media/container-service-walkthrough-portal/create-aks-portal-two.png)

After a short wait, the ASK cluster is deployed and ready to use.

## Connect to the cluster

To manage a Kubernetes cluster, use [kubectl](https://kubernetes.io/docs/user-guide/kubectl/), the Kubernetes command-line client. The kubectl client is pre-installed in the Azure Cloud Shell.

Open Cloud Shell using the button on the top right-hand corner of the Azure portal.

![Cloud shell](media/container-service-walkthrough-portal/kubectl-cs.png)

Use the [az aks get-credentials](/cli/azure/aks?view=azure-cli-latest#az_aks_get_credentials) command to configure kubectl to connect to your Kubernetes cluster.

Copy and paste the following command into the Cloud Shell

```azurecli-interactive
az aks get-credentials --resource-group myAKSCluster --name myAKSCluster
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

When the cluster is no longer needed, the cluster resource group can be deleted, which deletes all associated resources. This can be completed by selecting the resource group and clicking the delete button. Alternatively, the [az group delete](/cli/azure/group#delete) command can be used in the Cloud Shell.

```azurecli-interactive
az group delete --name myAKSCluster --no-wait
```

## Get the code

In this quickstart, pre-created container images have been used to create a Kubernetes deployment. The related application code, Dockerfile, and Kubernetes manifest file are available on GitHub.

[https://github.com/Azure-Samples/azure-voting-app-redis](https://github.com/Azure-Samples/azure-voting-app-redis.git)

## Next steps

In this quick start, you deployed a Kubernetes cluster and deployed a multi-container application to it.

To learn more about AKS, and walk through a complete code to deployment example, continue to the Kubernetes cluster tutorial.

> [!div class="nextstepaction"]
> [Manage an AKS cluster](./tutorial-kubernetes-prepare-app.md)

