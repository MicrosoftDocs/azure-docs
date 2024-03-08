---
title: 'Tutorial: Get started connecting an AKS application to a cache'
description: In this tutorial, you learn how to connect your AKS-hosted application to an Azure Cache for Redis instance.
author: flang-msft

ms.author: franlanglois
ms.service: cache
ms.topic: tutorial
ms.date: 08/15/2023
#CustomerIntent: As a developer, I want to see how to use a Azure Cache for Redis instance with an AKS container so that I see how I can use my cache instance with a Kubernetes cluster.

---

# Tutorial: Connect to Azure Cache for Redis from your application hosted on Azure Kubernetes Service

In this tutorial, you adapt the [AKS sample voting application](https://github.com/Azure-Samples/azure-voting-app-redis/tree/master) to use with an Azure Cache for Redis instance instead. The original sample uses a Redis cache deployed as a container to your AKS cluster. Following some simple steps, you can configure the AKS sample voting application to connect to your Azure Cache for Redis instance.

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An Azure Kubernetes Service Cluster - For more information on creating a cluster, see [Quickstart: Deploy an Azure Kubernetes Service (AKS) cluster using the Azure portal](/azure/aks/learn/quick-kubernetes-deploy-portal).

> [!IMPORTANT]
> This tutorial assumes that you are familiar with basic Kubernetes concepts like containers, pods and service.

## Set up an Azure Cache for Redis instance

1. Create a new Azure Cache for Redis instance by using the Azure portal or your preferred CLI tool. Use the [quickstart guide](quickstart-create-redis.md) to get started.

    For this tutorial, use a Standard C1 cache.
    :::image type="content" source="media/cache-tutorial-aks-get-started/cache-new-instance.png" alt-text="Screenshot of creating a Standard C1 cache in the Azure portal":::

1. On the **Advanced** tab, enable **Non-TLS port**.
    :::image type="content" source="media/cache-tutorial-aks-get-started/cache-non-tls.png" alt-text="Screenshot of the Advanced tab with Non-TLS enabled during cache creation.":::

1. Follow the steps through to create the cache.

> [!IMPORTANT]
> This tutorial uses a non-TLS port for demonstration, but we highly recommend that you use a TLS port for anything in production.

Creating the cache can take a few minutes. You can move to the next section while the process finishes.

## Install and connect to your AKS cluster

In this section, you first install the Kubernetes CLI and then connect to an AKS cluster.

### Install the Kubernetes CLI

Use the Kubernetes CLI, _kubectl_, to connect to the Kubernetes cluster from your local computer. If you're running locally, then you can use the following command to install _kubectl_.

```bash
az aks install-cli
```

If you use Azure Cloud Shell, _kubectl_ is already installed, and you can skip this step.

### Connect to your AKS cluster

Use the portal to copy the resource group and cluster name for your AKS cluster. To configure _kubectl_ to connect to your AKS cluster, use the following command with your resource group and cluster name:

```bash
 az aks get-credentials --resource-group myResourceGroup --name myClusterName
 ```

Verify that you're able to connect to your cluster by running the following command:

```bash
kubectl get nodes
```

You should see similar output showing the list of your cluster nodes.

```output
NAME                                STATUS   ROLES   AGE   VERSION
aks-agentpool-21274953-vmss000001   Ready    agent   1d    v1.24.15
aks-agentpool-21274953-vmss000003   Ready    agent   1d    v1.24.15
aks-agentpool-21274953-vmss000006   Ready    agent   1d    v1.24.15
```

## Update the voting application to use Azure Cache for Redis

Use the [.yml file](https://github.com/Azure-Samples/azure-voting-app-redis/blob/master/azure-vote-all-in-one-redis.yaml) in the sample for reference.

Make the following changes to the deployment file before you save the file as _azure-vote-sample.yaml_.

1. Remove the deployment and service named `azure-vote-back`. This deployment is used to deploy a Redis container to your cluster that is not required when using Azure Cache for Redis.

2. Replace the value `REDIS` variable from "azure-vote-back" to the _hostname_ of the Azure Cache for Redis instance that you created earlier. This change indicates that your application should use Azure Cache for Redis instead of a Redis container.

3. Define variable named `REDIS_PWD`, and set the value to the _access key_ for the Azure Cache for Redis instance that you created earlier.

After all the changes, the deployment file should look like following file with your _hostname_ and _access key_. Save your file as _azure-vote-sample.yaml_.

```YAML
apiVersion: apps/v1
kind: Deployment
metadata:
  name: azure-vote-front
spec:
  replicas: 1
  selector:
    matchLabels:
      app: azure-vote-front
  strategy:
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 1
  minReadySeconds: 5 
  template:
    metadata:
      labels:
        app: azure-vote-front
    spec:
      nodeSelector:
        "kubernetes.io/os": linux
      containers:
      - name: azure-vote-front
        image: mcr.microsoft.com/azuredocs/azure-vote-front:v1
        ports:
        - containerPort: 80
        resources:
          requests:
            cpu: 250m
          limits:
            cpu: 500m
        env:
        - name: REDIS
          value: myrediscache.redis.cache.windows.net
        - name: REDIS_PWD
          value: myrediscacheaccesskey
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

## Deploy and test your application

Run the following command to deploy this application to your AKS cluster:

```bash
kubectl apply -f azure-vote-sample.yaml
```

You get a response indicating your deployment and service was created:

```output
deployment.apps/azure-vote-front created
service/azure-vote-front created
```

To test the application, run the following command to check if the pod is running:

```bash
kubectl get pods
```

You see your pod running successfully like:

```output
NAME                                READY   STATUS                       RESTARTS   AGE
azure-vote-front-7dd44597dd-p4cnq   1/1     Running                      0          68s
```

Run the following command to get the endpoint for your application:

```bash
kubectl get service azure-vote-front
```

You might see that the EXTERNAL-IP has status `<pending>` for a few minutes. Keep retrying until the status is replaced by an IP address.

```output
NAME                   TYPE           CLUSTER-IP     EXTERNAL-IP     PORT(S)        AGE
azure-vote-front       LoadBalancer   10.0.166.147   20.69.136.105   80:30390/TCP   90s
```

Once the External-IP is available, open a web browser to the External-IP address of your service and you see the application running as follows:

:::image type="content" source="media/cache-tutorial-aks-get-started/cache-web-voting-app.png" alt-text="Screenshot of the voting application running in a browser with buttons for cats, dogs, and reset.":::

## Clean up your deployment

To clean up your cluster, run the following commands:

```bash
kubectl delete deployment azure-vote-front
kubectl delete service azure-vote-front
```

[!INCLUDE [cache-delete-resource-group](includes/cache-delete-resource-group.md)]

## Related content

- [Quickstart: Deploy an Azure Kubernetes Service (AKS) cluster using the Azure portal](/azure/aks/learn/quick-kubernetes-deploy-portal)
- [AKS sample voting application](https://github.com/Azure-Samples/azure-voting-app-redis/tree/master)
