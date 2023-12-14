---
title: "Artifact Streaming in Azure Container Registry (Preview)"
description: "Artifact Streaming is a feature in Azure Container Registry to enhance and supercharge managing, scaling, and deploying artifacts through containerized platforms."
author: tejaswikolli-web
ms.author: tejaswikolli
ms.service: container-registry
ms.topic: conceptual #Don't change
ms.date: 12/14/2023

#customer intent: As a developer, I want artifact streaming capabilities so that I can efficiently deliver and serve containerized applications to end-users in real-time.
---

# Artifact Streaming in Azure Container Registry (Preview)

Artifact Streaming is a feature in Azure Container Registry that allows you to store container images within a single registry, manage, and stream the container images to Azure Kubernetes Service (AKS) clusters in multiple regions. This feature is designed to accelerate containerized workloads for Azure customers using AKS. With Artifact Streaming, you can easily scale workloads without having to wait for slow pull times for your node.

## Use cases

Here are few scenarios to use Artifact Streaming:

**Deploying containerized applications to multiple regions**: With Artifact Streaming, you can store container images within a single registry and manage and stream container images to AKS clusters in multiple regions. Artifact Streaming deploys container applications to multiple regions without consuming time and resources.

**Reducing image pull latency**: Artifact Streaming can reduce time to pod readiness by over 15%, depending on the size of the image, and it works best for images < 30GB. This feature reduces image pull latency and fast container startup, which is beneficial for software developers and system architects.

**Effective scaling of containerized applications**:  Artifact Streaming is a time and performance effective scaling mechanism to design, build, and deploy container applications and cloud solutions at high scale.

**Supercharging the process of deploying containerized platforms**: Artifact Streaming supercharges the process of deploying and managing container images. 

## Artifact Streaming aspects

Here are some brief aspects of Artifact Streaming:

1. Customers with new and existing registries can enable Artifact Streaming for specific repositories or tags.

1. Once Artifact Streaming is enabled, the original artifact and the Artifact Streaming artifact will be stored in the customer’s ACR.

1. If the user decides to turn off Artifact Streaming for repositories or artifacts, the Artifact Streaming artifact and the original artifact will still be present.

1. If a customer deletes a repository or artifact with Artifact Streaming and Soft Delete enabled, then both the original and Artifact Streaming versions will be deleted. However, only the original version will be available on the soft delete blade.

## Availability and pricing information

Artifact Streaming is only available in the **Premium** SKU [service tiers](container-registry-skus.md). Please note that Artifact Streaming may increase the overall registry storage consumption and customers may be subjected to additional storage charges as outlined in our [pricing](/pricing/details/container-registry/) if the consumption exceeds the included 500 GiB Premium SKU threshold.

## Preview limitations

Artifact Streaming is currently in preview. The following limitations apply:

* Only images with Linux AMD64 architecture are supported in the preview release.
* The preview release doesn't support Windows-based container images, and ARM64 images.
* The preview release partially support multi-architecture images, only the AMD64 architecture is enabled.
* For creating Ubuntu based node pool in AKS, choose Ubuntu version 20.04 or higher.
* For Kubernetes, use Kubernetes version 1.26 or higher or k8s version > 1.25. 
* Only premium SKU registries support generating streaming artifacts in the preview release. The non-premium SKU registries do not offer this functionality during the preview.
* The CMK (Customer-Managed Keys) registries are NOT supported in the preview release.
* Kubernetes regcred is currently NOT supported.

## Prerequisites

> * You can use the [Azure Cloud Shell][Azure Cloud Shell] or a local installation of the Azure CLI to run the command examples in this article. If you'd like to use it locally, version 2.54.0 or later is required. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][Install Azure CLI].

> * Sign in to the [Azure portal](https://ms.portal.azure.com/). 

## Enable Artifact Streaming 

Start Artifact Streaming with a series with Azure CLI commands and Azure portal for pushing, importing, and generating streaming artifacts for container images in an Azure Container Registry (ACR). These instructions outline the process for creating a *Premium* [SKU](container-registry-skus.md) ACR, importing an image, generating a streaming artifact, and managing the Artifact Streaming operation. Make sure to replace the placeholders with your actual values where necessary.

### Push/Import the image and generate the streaming artifact  - Azure CLI

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

1. Verify the generated Artifact Streaming in the Azure CLI.

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
Auto-conversion does not apply to existing images. Existing images can be manually converted.

For example, run the [az acr artifact-streaming update] command to enable auto-conversion for the `jupyter/all-spark-notebook` repository in the `mystreamingtest` ACR.

```azurecli-interactive
az acr artifact-streaming update --repository jupyter/all-spark-notebook --enable-streaming true
```

1. Verify the streaming conversion progress, after pushing a new image `jupyter/all-spark-notebook:newtag` to the above repository.

For example, run the [az acr artifact-streaming operation show] command to check the status of the conversion operation for the `jupyter/all-spark-notebook:newtag` image in the `mystreamingtest` ACR.

```azurecli-interactive
az acr artifact-streaming operation show --image jupyter/all-spark-notebook:newtag
```

>[!NOTE]
> Artifact Streaming can work across regions, regardless of whether geo-replication is enabled or not.
> Artifact Streaming can work through a private endpoint and attach to it.

### Push/Import the image and generate the streaming artifact - Azure portal

Artifact Streaming is available in the *premium* [SKU](container-registry-skus.md) Azure Container Registry. To enable Artifact Streaming, update a registry using the Azure portal.

Follow the steps to create Artifact Streaming in the [Azure portal](https://portal.azure.com). 

1. Navigate to your Azure Container Registry. 

1. In the side **Menu**, under the **Services**, select **Repositories**.

1. Select the latest imported image.

1. Convert the image and create Artifact Streaming in Azure portal.

    :::image type="content" source="./media/container-registry-artifact-streaming/01-create-artifact-streaming.png" alt-text="Screenshot for Create Artifact Streaming.":::

1. Check the streaming artifact generated from the image in Referrers tab.     
    
    :::image type="content" source="./media/container-registry-artifact-streaming/02-artifact-streaming-generated.png" alt-text="Screenshot to verify Artifact Streaming for an image.":::

1. You can also delete the Artifact streaming from the repository blade. 

    :::image type="content" source="./media/container-registry-artifact-streaming/04-delete-artifact-streaming.png" alt-text="Screenshot to delete Artifact Streaming.":::

1. You can also enable auto-conversion on the repository blade. Active means auto-conversion is enabled on the repository. Inactive means auto-conversion is disabled on the repository. 

    :::image type="content" source="./media/container-registry-artifact-streaming/03-start-artifact-streaming.png" alt-text="Screenshot to enable auto-conversion.":::

> [!NOTE]
> The state of Artifact Streaming in a repository (inactive or active) determines whether newly pushed compatible images will be automatically converted. By default, all repositories are in an inactive state for Artifact Streaming. This means that when new compatible images are pushed to the repository, Artifact Streaming will not be triggered, and the images will not be automatically converted. If you want to enable automatic conversion of newly pushed images, you need to set the repository's Artifact Streaming to the active state. Once the repository is in the active state, any new compatible container images that are pushed to the repository will trigger Artifact Streaming. This will start the automatic conversion of those images.

## Next steps

> [!div class="nextstepaction"]
> [Troubleshoot Artifact Streaming](troubleshoot-artifact-streaming.md)

<!-- LINKS - External -->
[Install Azure CLI]: /cli/azure/install-azure-cli
[Azure Cloud Shell]: /azure/cloud-shell/quickstart

