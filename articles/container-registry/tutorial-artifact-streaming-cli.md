---
title: "Enable Artifact Streaming- Azure CLI"
description: "Enable Artifact Streaming in Azure Container Registry using Azure CLI commands to enhance and supercharge managing, scaling, and deploying artifacts through containerized platforms."
ms.author: tejaswikolli
ms.service: container-registry
ms.topic: tutorial  #Don't change.
ms.date: 10/31/2023

---
# Artifact Streaming - Azure CLI

Start Artifact Streaming with a series of Azure CLI commands for pushing, importing, and generating streaming artifacts for container images in an Azure Container Registry (ACR). These commands outline the process for creating a *Premium* [SKU](container-registry-skus.md) ACR, importing an image, generating a streaming artifact, and managing the artifact streaming operation. Make sure to replace the placeholders with your actual values where necessary.

This article is part two in a four-part tutorial series. In this tutorial, you learn how to:

> [!div class="checklist"]
> * Push/Import the image and generate the streaming artifact  - Azure CLI.

## Prerequisites

* You can use the [Azure Cloud Shell][Azure Cloud Shell] or a local installation of the Azure CLI to run the command examples in this article. If you'd like to use it locally, version 2.54.0 or later is required. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][Install Azure CLI].

## Push/Import the image and generate the streaming artifact  - Azure CLI

Artifact Streaming is available in the **Premium** container registry service tier. To enable Artifact Streaming, update a registry using the Azure CLI (version 2.54.0 or above). To install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).

Enable Artifact Streaming by following these general steps:

>[!NOTE]
> If you already have a premium container registry, you can skip this step. If the user is on Basic of Standard SKUs, the following commands will fail. 
> The code is written in Azure CLI and can be executed in an interactive mode. 
> Please note that the placeholders should be replaced with actual values before executing the command.

Use the following command to create an Azure Resource Group with name `my-streaming-test` in the West US region and a premium Azure Container Registry with name `mystreamingtest` in that resource group.

```azurecli-interactive
az group create -n my-streaming-test -l westus
az acr create -n mystreamingtest -g my-streaming-test -l westus --sku premium
```

To push or import an image to the registry, run the `az configure` command to configure the default ACR and `az acr import` command to import a Jupyter Notebook image from Docker Hub into the `mystreamingtest` ACR.

```azurecli-interactive
az configure --defaults acr="mystreamingtest"
az acr import -source docker.io/jupyter/all-spark-notebook:latest -t jupyter/all-spark-notebook:latest
```

Use the following command to create a streaming artifact from the specified image. This example creates a streaming artifact from the `jupyter/all-spark-notebook:latest` image in the `mystreamingtest` ACR.

```azurecli-interactive
az acr artifact-streaming create --image jupyter/all-spark-notebook:latest
```

To verify the generated Artifact Streaming in the Azure CLI, run the `az acr manifest list-referrers` command. This command lists the streaming artifacts for the `jupyter/all-spark-notebook:latest` image in the `mystreamingtest` ACR.

```azurecli-interactive
az acr manifest list-referrers -n jupyter/all-spark-notebook:latest
```

If you need to cancel the streaming artifact creation, run the `az acr artifact-streaming operation cancel` command. This command stops the operation. For example, this command cancels the conversion operation for the `jupyter/all-spark-notebook:latest` image in the `mystreamingtest` ACR.

```azurecli-interactive
az acr artifact-streaming operation cancel --repository jupyter/all-spark-notebook --id c015067a-7463-4a5a-9168-3b17dbe42ca3
```

Enable auto-conversion in the repository for newly pushed or imported images. When enabled, new images pushed into that repository trigger the generation of streaming artifacts.

>[!NOTE]
Auto-conversion does not apply to existing images. Existing images can be manually converted.

For example, run the `az acr artifact-streaming update` command to enable auto-conversion for the `jupyter/all-spark-notebook` repository in the `mystreamingtest` ACR.

```azurecli-interactive
az acr artifact-streaming update --repository jupyter/all-spark-notebook --enable-streaming true
```

Use the `az acr artifact-streaming operation show` command to verify the streaming conversion progress. For example, this command checks the status of the conversion operation for the `jupyter/all-spark-notebook:newtag` image in the `mystreamingtest` ACR.

```azurecli-interactive
az acr artifact-streaming operation show --image jupyter/all-spark-notebook:newtag
```

>[!NOTE]
> Artifact Streaming can work across regions, regardless of whether geo-replication is enabled or not.
> Artifact Streaming can work through a private endpoint and attach to it.

## Next steps

> [!div class="nextstepaction"]
> [Enable Artifact Streaming- Portal](tutorial-artifact-streaming-portal.md)

<!-- LINKS - External -->
[Install Azure CLI]: /cli/azure/install-azure-cli
[Azure Cloud Shell]: /azure/cloud-shell/quickstart
