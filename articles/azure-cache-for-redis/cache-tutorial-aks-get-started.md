---
title: 'Tutorial: Get started connecting an AKS application to a cache'
description: In this tutorial, you learn how to connect your AKS-hosted application to an Azure Cache for Redis instance.
ms.topic: tutorial
ms.custom:
  - ignite-2024
ms.date: 10/01/2024
#CustomerIntent: As a developer, I want to see how to use a Azure Cache for Redis instance with an AKS container so that I see how I can use my cache instance with a Kubernetes cluster.
---

# Tutorial: Connect to Azure Cache for Redis or Azure Managed Redis (preview) from your application hosted on Azure Kubernetes Service

In this tutorial, you use this [sample](https://github.com/Azure-Samples/azure-cache-redis-samples/tree/main/tutorial/connect-from-aks) to connect with an Azure Cache for Redis or Azure Managed Redis(preview) instance.

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An Azure Kubernetes Service Cluster - For more information on creating a cluster, see [Quickstart: Deploy an Azure Kubernetes Service (AKS) cluster using the Azure portal](/azure/aks/learn/quick-kubernetes-deploy-portal).
- A user assigned managed identity that you want to use to connect to your Azure Cache for Redis instance.

> [!IMPORTANT]
> This tutorial assumes that you are familiar with basic Kubernetes concepts like containers, pods and service.

## Set up an Azure Cache for Redis instance

1. Create a new Azure Cache for Redis instance by using the Azure portal or your preferred CLI tool. Use the [quickstart guide](quickstart-create-redis.md) to get started. Alternately, you can create an Azure Managed Redis instance too.

    For this tutorial, use a Standard C1 cache.
    :::image type="content" source="media/cache-tutorial-aks-get-started/cache-new-instance.png" alt-text="Screenshot of creating a Standard C1 cache in the Azure portal":::

1. Follow the steps through to create the cache.

1. Once your Redis cache instance is created, navigate to the **Authentication** tab. Select the user assigned managed identity you want to use to connect to your Redis cache instance, then select **Save**.

1. Alternatively, you can navigate to Data Access Configuration on the Resource menu to create a new Redis user with your user assigned managed identity to connect to your cache.

1. Take note of the user name for your Redis user from the portal. You use this user name with the AKS workload.

## Run sample locally


To run this sample locally, configure your user principal as a Redis User on your Redis instance. The code sample uses your user principal through [DefaultAzureCredential](/dotnet/azure/sdk/authentication/?tabs=command-line#use-defaultazurecredential-in-an-application) to connect to Redis instance.

## Configure your AKS cluster

Follow these [steps](/azure/aks/workload-identity-deploy-cluster) to configure a workload identity for your AKS cluster.

Then, complete the following steps:

- Enable OIDC issuer and workload identity
- Skip the step to create user assigned managed identity if you already created your managed identity. If you create a new managed identity, ensure that you create a new Redis User for your managed identity and assign appropriate data access permissions.
- Create a Kubernetes Service account annotated with the client ID of your user assigned managed identity
- Create a federated identity credential for your AKS cluster.

## Configure your workload that connects to Azure Cache for Redis

Next, set up the AKS workload to connect to Azure Cache for Redis after you configure the AKS cluster.

1. Download the code for the [sample app](https://github.com/Azure-Samples/azure-cache-redis-samples/tree/main/tutorial/connect-from-aks/ConnectFromAKS).

1. Build and push docker image to your Azure Container Registry using [az acr build](/cli/azure/acr#az-acr-build) command.

   ```bash
    az acr build --image sample/connect-from-aks-sample:1.0 --registry yourcontainerregistry --file Dockerfile .
   ```

1. Attach your container registry to your AKS cluster using following command:

    ```bash
    az aks update --name clustername --resource-group mygroup --attach-acr youracrname
    ```

## Deploy your workload

In this section, you first install the Kubernetes CLI and then connect to an AKS cluster.

### Install the Kubernetes CLI

Use the Kubernetes CLI, _kubectl_, to connect to the Kubernetes cluster from your local computer. If you're running locally, then you can use the following command to install _kubectl_.

```bash
az aks install-cli
```

If you use Azure Cloud Shell, _kubectl_ is already installed, and you can skip this step.

### Connect to your AKS cluster

1. Use the portal to copy the resource group and cluster name for your AKS cluster. To configure _kubectl_ to connect to your AKS cluster, use the following command with your resource group and cluster name:

   ```bash
   az aks get-credentials --resource-group myResourceGroup --name myClusterName
    ```

1. Verify that you're able to connect to your cluster by running the following command:

    ```bash
    kubectl get nodes
    ```

    You should see similar output showing the list of your cluster nodes.

    ```bash
    NAME                                STATUS   ROLES   AGE   VERSION
    aks-agentpool-21274953-vmss000001   Ready    agent   1d    v1.29.7
    aks-agentpool-21274953-vmss000003   Ready    agent   1d    v1.29.7
    aks-agentpool-21274953-vmss000006   Ready    agent   1d    v1.29.7
    ```

## Run your workload

1. The following code describes the pod specification file that you use to run our workload. Take note that the pod has the label _azure.workloadidentity/use: "true"_ and is annotated with _serviceAccountName_ as required by AKS workload identity. When using access key authentication, replace the value of AUTHENTICATION_TYPE, REDIS_HOSTNAME, REDIS_ACCESSKEY and REDIS_PORT environment variables. For Azure Managed Redis instance, set the value of REDIS_PORT to 10000.

   ```yml
    apiVersion: v1
    kind: Pod
    metadata:
      name: entrademo-pod
      labels:
        azure.workload.identity/use: "true"  # Required. Only pods with this label can use workload identity.
    spec:
      serviceAccountName: workload-identity-sa
      containers:
      - name: entrademo-container
        image: youracr.azurecr.io/connect-from-aks-sample:1.0
        imagePullPolicy: Always
        command: ["dotnet", "ConnectFromAKS.dll"] 
        resources:
          limits:
            memory: "256Mi"
            cpu: "500m"
          requests:
            memory: "128Mi"
            cpu: "250m"
        env:
             - name: AUTHENTICATION_TYPE
               value: "MANAGED_IDENTITY" # change to ACCESS_KEY to authenticate using access key
             - name: REDIS_HOSTNAME
               value: "your redis hostname"
             - name: REDIS_ACCESSKEY
               value: "your access key" 
             - name: REDIS_PORT
               value: "6380" # change to 10000 for Azure Managed Redis
      restartPolicy: Never
    
   ```

1. Save this file as podspec.yaml and then apply it to your AKS cluster by running the folloWing command:

    ```bash
    kubectl apply -f podspec.yaml
    ```

   You get a response indicating your pod was created:

    ```bash
    pod/entrademo-pod created
    ```

1. To test the application, run the following command to check if the pod is running:

    ```bash
    kubectl get pods
    ```

    You see your pod running successfully like:

    ```bash
    NAME                       READY   STATUS      RESTARTS       AGE
    entrademo-pod              0/1     Completed   0              42s
   ```

1. Because this tutorial is a console app, you need to check the logs of the pod to verify that it ran as expected using this command.

    ```bash
    kubectl logs entrademo-app
    ```

    You see the following logs that indicate your pod successfully connected to your Redis instance using user assigned managed identity

    ```bash
    Connecting with managed identity..
    Retrieved value from Redis: Hello, Redis!
    Success! Previous value: Hello, Redis!
   ```

## Clean up your cluster

To clean up your cluster, run the following commands:

```bash
kubectl delete pod entrademo-pod
```

[!INCLUDE [cache-delete-resource-group](includes/cache-delete-resource-group.md)]

## Related content

- [Quickstart: Deploy an Azure Kubernetes Service (AKS) cluster using the Azure portal](/azure/aks/learn/quick-kubernetes-deploy-portal)
- [Quickstart: Deploy and configure workload identity on an Azure Kubernetes Service (AKS) cluster](/azure/aks/workload-identity-deploy-cluster)
- [Azure Cache for Redis Microsoft Entra ID Authentication](/azure/azure-cache-for-redis/cache-azure-active-directory-for-authentication)
