---
title: 'Tutorial: Get started with connecting your AKS application to Azure Cache for Redis'
description: In this tutorial, you learn how to connect your AKS hosted application to Azure Cache for Redis.
author: flang-msft

ms.author: franlanglois
ms.service: cache
ms.topic: tutorial
ms.date: 08/15/2023
#CustomerIntent: As a < type of user >, I want < what? > so that < why? >.

---

# Tutorial: Connect to Azure Cache for Redis from your application hosted on Azure Kubernetes Service

In this tutorial, we will use the [AKS sample voting application](https://github.com/Azure-Samples/azure-voting-app-redis/tree/master) which leverages Redis deployed as a container to your AKS cluster. Using the following simple steps, you can configure the AKS sample voting application to connect to your Azure Cache for Redis instance instead.

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An Azure Kubernetes Service Cluster

> [!IMPORTANT]
> This tutorial assumes that you are familiar with basic Kubernetes concepts like containers, pods and service.

## Set up an Azure Cache for Redis instance

Create a new Azure Cache for Redis instance by using the Azure portal or your preferred CLI tool. Use the [quickstart guide](quickstart-create-redis.md) to get started and ensure that you configure your Azure Cache for Redis to allow non-TLS port.

:::image type="content" source="media/cache-tutorial-functions-getting-started/cache-new-standard.png" alt-text="Screenshot of creating a cache in the Azure portal.":::

> [!IMPORTANT]
> This tutorial uses a non-TLS port for demonstration, but we highly recommend that you use a TLS port for anything in production.

Creating the cache can take a few minutes. You can move to the next section while the process finishes.

## Connect to your AKS cluster

### Install the Kubernetes CLI

Use the Kubernetes CLI, kubectl, to connect to the Kubernetes cluster from your local computer. Azure Cloud Shell already installs kubectl, however, if you are running locally, then you can using the following command to install kubectl.

```bash
az aks install-cli
```

### Connect to your AKS cluster

To configure kubectl to connect to your AKS cluster, use the following command:

```bash
 az aks get-credentials --resource-group myResourceGroup --name myClusterName
 ```

Verify that you are able to connect to your cluster by running the following commane:
```bash
kubectl get nodes
```

You should see output like this showing the list of your cluster nodes.
```output
NAME                                STATUS   ROLES   AGE   VERSION
aks-agentpool-21274953-vmss000001   Ready    agent   1d    v1.24.15
aks-agentpool-21274953-vmss000003   Ready    agent   1d    v1.24.15
aks-agentpool-21274953-vmss000006   Ready    agent   1d    v1.24.15
```

## Update the voting application to use Azure Cache for Redis

We will use [this](https://github.com/Azure-Samples/azure-voting-app-redis/blob/master/azure-vote-all-in-one-redis.yaml) deployment file in sample for reference.
Make the following changes to the deployment file:
1.	Remove the deployment and service named “azure-vote-back”. This deployment is to deploy a Redis container to your cluster which is not required when using Azure Cache for Redis.
2.	Replace the value REDIS environment variable from "azure-vote-back" to the hostname for your Azure Cache for Redis instance that you created earlier. This change indicates to the application to use Azure Cache for Redis instead of Redis container.
3.	Define another environment variable named REDIS_PWD and set the value to be the access key for your Azure Cache for Redis instance that you created earlier.

After all the changes, the deployment file should look like below. Save your file as azure-vote-sample.yaml.

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

You will get a response indicating your deployment and service was created:

```output
deployment.apps/azure-vote-front created
service/azure-vote-front created
```

To test the application, run the following command to check if the pod is running:

```bash
kubectl get pods
```

You will see your pod running successfully like:

```output
NAME                                READY   STATUS                       RESTARTS   AGE
azure-vote-front-7dd44597dd-p4cnq   1/1     Running                      0          68s
```

Run the following command to get the endpoint for your application:
```bash
kubectl get service azure-vote-front
```

You may see that the EXTERNAL-IP has status <pending> for a few minutes. Keep retrying and the status will be replaced by an IP address.
```output
NAME                   TYPE           CLUSTER-IP     EXTERNAL-IP     PORT(S)        AGE
azure-vote-front       LoadBalancer   10.0.166.147   20.69.136.105   80:30390/TCP   90s
```

Once the External-IP is available, open a web browser to the External-IP address of your service and you will see the application running like below:

<screenshot of the application>

## Clean up

To clean up your cluster, run the following commands:

```bash
kubectl delete deployment azure-vote-front
kubectl delete service azure-vote-front
```

## Next steps

> [!div class="nextstepaction"]
> [Use Azure Key Vault Provider to securely store your access key](https://learn.microsoft.com/azure/aks/csi-secrets-store-driver)
