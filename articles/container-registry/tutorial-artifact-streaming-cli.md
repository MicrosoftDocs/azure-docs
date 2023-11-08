---
title: "Enable Artifact Streaming- Azure CLI"
description: "Artifact Streaming is a feature in Azure Container Registry to enhance and supercharge managing, scaling, and deploying artifacts through containerized platforms."
ms.author: tejaswikolli-web
ms.service: container-registry
ms.topic: tutorial  #Don't change.
ms.date: 10/31/2023

---
# Artifact Streaming - Azure CLI

Start Artifact Streaming with a series of Azure CLI commands for pushing, importing, and generating streaming artifacts for container images in an Azure Container Registry (ACR). These commands outline the process for creating a *Premium* [SKU](container-registry-skus.md) ACR, importing an image, generating a streaming artifact, and managing the artifact streaming operation. Make sure to replace the placeholders with your actual values where necessary.

This article is part two in a four-part tutorial series. In this tutorial, you learn how to:

> [!div class="checklist"]
> * Push/Import the image and generate the streaming artifact  - Azure CLI
> * Deploy the image in Azure Kubernetes Service (AKS) - Azure CLI

## Prerequisites

> * Login to your Azure Account
> * Set the Active Azure Subscription
> * install CLI 2.54 and above version and az login to start the session
>* You have Docker and the Azure CLI installed within the container, and the "rosanch.azurecr.io/cli:v3" image is correctly configured to provide the Azure CLI and necessary tools.
> * You have an Azure Container Registry (ACR) instance with the Premium SKU. If you don't have an ACR instance, see [Create an Azure Container Registry](../quickstart-create-azure-container-registry.md).
## Push/Import the image and generate the streaming artifact  - Azure CLI

Artifact Streaming is available in the **Premium** container registry service tier. To enable Artifact Streaming, update a registry using the Azure CLI (version 2.54.0 or above). To install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).

Enable Artifact Streaming, by following these general steps:

>[!NOTE]
> If you already have a premium container registry, you can skip this step. If the user is on Basic of Standard SKUs, the following commands will fail. 
> The code is written in Azure CLI and can be executed in an interactive mode. 
> Please note that the placeholders should be replaced with actual values before executing the command.

1. Create a new Azure Container Registry (ACR) using the premium SKU through:

For example, run the [az group create] command to create an Azure Resource Group with name `my-streaming-test` in the West US region and then run the [az acr create] command to create a premium Azure Container Registry with name `mystreamingtest` in that resource group.

```azurecli-interactive
az group create -n my-streaming-test -l westus
az acr create -n mystreamingtest -g my-streaming-test -l westus --sku premium
```

1. Push or import an image to the registry through:

For example, run the [az configure] command to configure the default ACR and [az acr import] command to import a Jupyter Notebook image from Docker Hub into the `mystreamingtest` ACR.

```azurecli-interactive
az configure --defaults acr="mystreamingtest"
az acr import -source docker.io/jupyter/all-spark-notebook:latest -t jupyter/all-spark-notebook:latest
```

1. Create a streaming Artifact from the Image

Initiates the creation of a streaming artifact from the specified image.

For example, run the [az acr artifact-streaming create] commands to create a streaming artifact from the `jupyter/all-spark-notebook:latest` image in the `mystreamingtest` ACR.

```azurecli-interactive
az acr artifact-streaming create --image jupyter/all-spark-notebook:latest
```

1. Verify the generated Artifact Streaming in the Azure portal.

For example, run the [az acr manifest list-referrers] command to list the streaming artifacts for the `jupyter/all-spark-notebook:latest` image in the `mystreamingtest` ACR.

```azurecli-interactive
az acr manifest list-referrers -n jupyter/all-spark-notebook:latest
```

1. Cancel the Artifact Streaming creation (if needed)

Cancel the streaming artifact creation if the conversion is not finished yet. It will stop the operation.

For example, run the [az acr artifact-streaming operation cancel] command to cancel the conversion operation for the `jupyter/all-spark-notebook:latest` image in the `mystreamingtest` ACR.

```azurecli-interactive
az acr artifact-streaming operation cancel --repository jupyter/all-spark-notebook --id c015067a-7463-4a5a-9168-3b17dbe42ca3
```

1. Enable auto-conversion on the repository

Enables auto-conversion in the repository for newly pushed or imported images. When enabled, new images pushed into that repository will trigger the generation of streaming artifacts.

>[!NOTE]
Auto-conversion cannot work on existing images. You can enable auto-conversion only for newly pushed or imported images.

For example, run the [az acr artifact-streaming update] command to enable auto-conversion for the `jupyter/all-spark-notebook` repository in the `mystreamingtest` ACR.

```azurecli-interactive
az acr artifact-streaming update --repository jupyter/all-spark-notebook --enable-streaming true
```

1. Verify the streaming conversion progress, after pushing a new image `jupyter/all-spark-notebook:newtag` to the above repository.

For example, run the [az acr artifact-streaming operation show] command to check the status of the conversion operation for the `jupyter/all-spark-notebook:newtag` image in the `mystreamingtest` ACR.

```azurecli-interactive
az acr artifact-streaming operation show --image jupyter/all-spark-notebook:newtag
```

## Deploy the images in Azure Kubernetes Service (AKS) - Azure CLI

>[!IMPORTANT]
>* Create an AKS cluster in the same region as the ACR registry and attach to it.

>[!NOTE]
> Artifact Streaming can work across regions, regardless of whether geo-replication is enabled or not.
> Artifact Streaming can work through a private endpoint and attach to it.

1. Run `az aks create`` command to create an Azure Kubernetes Service (AKS) cluster. 
    
```azurecli-interactive
    az aks create \
      --resource-group my-streaming-test \
      --name mystreamingtest \
      --enable-aad \
      --enable-azure-rbac \
      --location "westus" \
      --attach-acr mystreamingtest \
      --enable-managed-identity \
      --generate-ssh-keys \
      --enable-cluster-autoscaler \
      --min-count 3 \
      --max-count 30 \
      --aad-admin-group-object-ids ********-****-****-****-************ 
```

1. Set up the Kubernetes configuration for an Azure Kubernetes Service (AKS) cluster and then retrieve information about the nodes in the cluster. 

```azurecli-interactive
    az aks get-credentials -g my-streaming-test -n mystreamingtest
    kubectl get nodes
```

1. Once your Kubernetes configuration is set up, you can use kubectl to get information about the nodes in your AKS cluster. 

```azurecli-interactive
    kubectl get nodes
```

1. The az aks command is not available right now. Temporarily use a daemonsets, enabling the streaming feature on Azure Kubernetes Service (AKS) nodes.

```yml

apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: enable-artifact-streaming
spec:
  selector:
    matchLabels:
      name: enable-artifact-streaming
  template:
    metadata:
      labels:
        name: enable-artifact-streaming
    spec:
      containers:
      - name: enable-artifact-streaming
        image: your-enabling-image:latest
```

1. Apply the DaemonSet manifest to your AKS cluster using the kubectl command:

create the DaemonSet, and one pod will be scheduled on each node in your AKS cluster.

```azurecli-interactive
    kubectl apply -f enable-artifact-streaming.yaml
```

1. Monitor the progress of the DaemonSet by checking the pods status:

```azurecli-interactive
    kubectl get ds -o wide 

```

1. Create a YAML file (jupyter-spark.yml) that defines the Kubernetes Deployment for your application.

```yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: jupyter-spark
spec:
  replicas: 3
  selector:
    matchLabels:
      app: jupyter-spark
  template:
    metadata:
      labels:
        app: jupyter-spark
    spec:
      containers:
      - name: jupyter-spark
        image: your-registry/your-image:latest

```

1. Apply the YAML file to create the deployment.
    
    ```azurecli-interactive
        kubectl apply -f jupyter-spark.yml
    ```

1. Check the status of the pods created by the deployment, use the following command to list and match the pods with the label app=jupyter-spark.

    ```azurecli-interactive
        kubectl get pods --selector=app=jupyter-spark
    ```

1. Run the `kubectl get pods --selector` command to extracts the imageID of the containers and verify that they are using the streaming artifact.

    ```azurecli-interactive
        kubectl get pods --selector=app=jupyter-spark -o jsonpath-as-json='{.items[*].status.containerStatuses[*].imageID}'

    ```

1. Check the condition message and start latency for a specific pod, use the following command. The `kubectl events` return information on events related to the specified pod, which can include messages about container streaming and start latency.

    ```azurecli-interactive
        kubectl events --field-selector involvedObject.name=<pod-name>
    ```


## Next steps

> [!div class="nextstepaction"]
> [Enable Artifact Streaming- Portal](tutorial-artifact-streaming-portal.md)