---
author: craigshoemaker
ms.service: container-apps
ms.topic: include
ms.date: 01/26/2022
ms.author: cshoe
---

## Prerequisites

- An Azure account with an active subscription.
  - If you don't have one, you [can create one for free](https://azure.microsoft.com/free/).
- Install the [Azure CLI](/cli/azure/install-azure-cli).
- See [Jobs preview limitations](../articles/container-apps/jobs.md#jobs-preview-limitations) for a list of limitations.

## Setup

1. To sign in to Azure from the CLI, run the following command and follow the prompts to complete the authentication process.

    ```azurecli
    az login
    ```

1. Ensure you're running the latest version of the CLI via the upgrade command.

    ```azurecli
    az upgrade
    ```

1. Uninstall any existing versions of the Azure Container Apps extension for the CLI and install the latest version that supports the jobs preview.

    ```azurecli
    az extension remove --name containerapp
    az extension add --upgrade --source https://containerappextension.blob.core.windows.net/containerappcliext/containerapp-private_preview_jobs_1.0.5-py2.py3-none-any.whl --yes
    ```

    > [!NOTE]
    > Only use this version of the CLI extension for the jobs preview. To use the Azure CLI for other Container Apps scenarios, uninstall this version and install the latest public version of the extension.
    > 
    > ```azurecli
    > az extension remove --name containerapp
    > az extension add --name containerapp
    > ```

1. Register the `Microsoft.App` and `Microsoft.OperationalInsights` namespaces if you haven't already registered them in your Azure subscription.

    ```azurecli
    az provider register --namespace Microsoft.App
    az provider register --namespace Microsoft.OperationalInsights
    ```

1. Now that your Azure CLI setup is complete, you can define the environment variables that are used throughout this article.

    ```azurecli
    RESOURCE_GROUP="jobs-quickstart"
    LOCATION="northcentralus"
    ENVIRONMENT="env-jobs-quickstart"
    JOB_NAME="my-job"
    ```

    > [!NOTE]
    > The jobs preview is only supported in the East US 2 EUAP, North Central US, and Australia East regions.

## Create a Container Apps environment

The Azure Container Apps environment acts as a secure boundary around container apps and jobs so they can share the same network and communicate with each other.

1. Create a resource group using the following command.

    ```azurecli
    az group create \
        --name "$RESOURCE_GROUP" \
        --location "$LOCATION"
    ```

1. Create the Container Apps environment using the following command.

    ```azurecli
    az containerapp env create \
        --name "$ENVIRONMENT" \
        --resource-group "$RESOURCE_GROUP" \
        --location "$LOCATION"
    ```
