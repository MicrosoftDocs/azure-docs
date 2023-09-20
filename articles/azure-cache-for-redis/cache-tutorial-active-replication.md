---
title: 'Tutorial: Get started using Azure Cache for Redis Enterprise active replication with an AKS-hosted application'
description: In this tutorial, you learn how to connect your AKS hosted application to Azure Cache for Redis Enterprise instances and leverage active geo-replication.
author: flang-msft

ms.author: franlanglois
ms.service: cache
ms.topic: tutorial
ms.date: 09/18/2023
#CustomerIntent: As a developer, I want to see how to use a Azure Cache for Redis Enterprise instance with an AKS container so that I see how I can use my cache instance with a Kubernetes cluster.

---

# Get started using Azure Cache for Redis Enterprise active replication with an AKS-hosted application

In this tutorial, you will host a simple inventory application on Azure Kubernetes Service (AKS) and find out how you can leverage active geo-replication to replicate data in your Azure Cache for Redis Enterprise instances across Azure regions.

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Two Azure Kubernetes Service Clusters in different regions- For more information on creating a cluster, see [Quickstart: Deploy an Azure Kubernetes Service (AKS) cluster using the Azure portal](/azure/aks/learn/quick-kubernetes-deploy-portal). Alternately, you can host two instances of the demo application on the same AKS cluster.

> [!IMPORTANT]
> This tutorial assumes that you are familiar with basic Kubernetes concepts like containers, pods and service.

## Overview

This tutorial uses a sample inventory page which shows three different T-shirt options. The user can "purchase" each T-shirt and see the inventory drop. The unique thing about this demo is that we run the inventory app in two different regions. Typically, you would have to run the database storing inventory data in a single region so that there are no consistency issues. That can result in unpleasant customer experience due to higher latency for calls across different Azure regions. By using Azure Cache for Redis Enterprise as the backend, however, you can link two caches together with active geo-replication so that the inventory remains consistent across both regions while enjoying low latency performance from Redis Enterprise in the same region.

## Set up two Azure Cache for Redis instances

1. Create a new Azure Cache for Redis Enterprise instance in **West US 2** region by using the Azure portal or your preferred CLI tool. Alternately, you can use any region of your choice. Use the [quickstart guide](quickstart-create-redis-enterprise.md) to get started.

1. On the **Advanced** tab:

   1. Enable **Non-TLS access only**.
   1. Set **Clustering Policy** to **Enterprise**
   1. Configure active geo-replication using [this guide](cache-how-to-active-geo-replication.md) to both caches to the same replication group. Create the group name with the first cache, and add the second cache to the same group.

    > [!IMPORTANT]
    > This tutorial uses a non-TLS port for demonstration, but we highly recommend that you use a TLS port for anything in production.

1. Set up another Azure Cache for Redis Enterprise in **East US** region with the exact same configuration as the first cache. Alternately, you can use any region of your choice. Ensure that you choose the same replication group as the first cache.

## Prepare Kubernetes deployment files

To demonstrate data replication across regions, we will run two instances of the same application in different regions. Let's assume one instance runs in Seattle (west) while the second in New York (east).

Update the following fields in the YAML file below and save it as app_west.yaml

- Update environment variables REDIS_HOST and REDIS_PASSWORD with hostname and access key of your Azure Cache for Redis Enterprise instance in West US 2 or one of the two regions your chose earlier.
- Update APP_LOCATION to display the region where this application instance is running. In this sample, we are configuring the APP_LOCATION to Seattle to indicate this application instance is running in Seattle.

```YAML
apiVersion: apps/v1
kind: Deployment
metadata:
  name: shoppingcart-app
  namespace: west
spec:
  replicas: 1 
  selector:
    matchLabels:
      app: shoppingcart
  template:
    metadata:
      labels:
        app: shoppingcart
    spec:
      containers:
      - name: demoapp
        image: mcr.microsoft.com/azure-redis-cache/redisactivereplicationdemo:latest
        resources:
          limits:
            cpu: "0.5"
            memory: "250Mi"
          requests:
            cpu: "0.5"
            memory: "128Mi"
        env:
         - name: REDIS_HOST
           value: "DemoWest.westus.redisenterprise.cache.azure.net"
         - name: REDIS_PASSWORD
           value: "myaccesskey"
         - name: REDIS_PORT
           value: "10000"   # redis enterprise port
         - name: HTTP_PORT
           value: "8080"
         - name: APP_LOCATION
           value: "Seattle, WA" 
---
apiVersion: v1
kind: Service
metadata:
  name: shoppingcart-svc
  namespace: west
spec:
  type: LoadBalancer
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8080
  selector:
    app: shoppingcart
```

Save another copy of the same YAML file as app_east.yaml. This time, update the REDIS_HOST, REDIS_PASSWORD and APP_LOCATION to point to Redis Enterprise instance in East US or your second region of choice.

## Install and connect to your AKS cluster

In this section, you first install the Kubernetes CLI and then connect to an AKS cluster.

### Install the Kubernetes CLI

Use the Kubernetes CLI, _kubectl_ , to connect to the Kubernetes cluster from your local computer. If you are running locally, then you can using the following command to install kubectl.

```bash
az aks install-cli
```

If you use Azure Cloud Shell, _kubectl_ is already installed, and you can skip this step.

### Connect to your AKS cluster

Use the portal to copy the resource group and cluster name for your AKS cluster. To configure _kubectl_ to connect to your AKS cluster, use the following command with your resource group and cluster name:

```bash
 az aks get-credentials --resource-group myResourceGroup --name myClusterName
 ```

Verify that you are able to connect to your cluster by running the following command:

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

## Deploy and test your application

Run the following command to deploy the application instance to your AKS cluster in **West US 2**:

```bash
kubectl apply -f app_west.yaml
```

You get a response indicating your deployment and service was created:

```output
deployment.apps/shoppingcart-app created
service/shoppingcart-svc created
```

To test the application, run the following command to check if the pod is running:

```bash
kubectl get pods -n west
```

You see your pod running successfully like:

```output
NAME                                READY   STATUS                       RESTARTS   AGE
shoppingcart-app-5fffdcb5cd-48bl5   1/1     Running                      0          68s
```

Run the following command to get the endpoint for your application:

```bash
kubectl get service -n west
```

You might see that the EXTERNAL-IP has status `<pending>` for a few minutes. Keep retrying until the status is replaced by an IP address.

```output
NAME                   TYPE           CLUSTER-IP     EXTERNAL-IP     PORT(S)        AGE
shoppingcart-svc       LoadBalancer   10.0.166.147   20.69.136.105   80:30390/TCP   90s
```

Once the External-IP is available, open a web browser to the External-IP address of your service and you see the application running like below:

<!-- <screenshot for Seattle> -->

Run the same deployment steps and deploy an instance of the demo application to run in East US region.

```bash
kubectl apply -f app_east

kubectl get pods -n east

kubectl get service -n east
```

With two services opened in your browser, you should see that changing the inventory in one region is virtually instantly reflected in the other region. The inventory data is stored in the Redis Enterprise instances which are replicating data across regions.

You did it! Click on the buttons and explore the demo. To reset the count, add `/reset` after the url:

 `<IP address>/reset`

## Clean up your deployment

To clean up your cluster, run the following commands:

```bash
kubectl delete deployment shoppingcart-app -n west
kubectl delete service shoppingcart-svc -n west
kubectl delete deployment shoppingcart-app -n east
kubectl delete service shoppingcart-svc -n east
```

[!INCLUDE [cache-delete-resource-group](includes/cache-delete-resource-group.md)]

## Related Content

- [Tutorial: Connect to Azure Cache for Redis from your application hosted on Azure Kubernetes Service](cache-tutorial-aks-get-started.md)
- [Quickstart: Deploy an Azure Kubernetes Service (AKS) cluster using the Azure portal](/azure/aks/learn/quick-kubernetes-deploy-portal)
- [AKS sample voting application](https://github.com/Azure-Samples/azure-voting-app-redis/tree/master)
