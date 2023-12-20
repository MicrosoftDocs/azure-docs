---
author: craigshoemaker
ms.service: container-apps
ms.topic: include
ms.date: 05/04/2023
ms.author: cshoe
ms.custom: references_regions
---

## Prerequisites

- An Azure account with an active subscription.
  - If you don't have one, you [can create one for free](https://azure.microsoft.com/free/).
- Install the [Azure CLI](/cli/azure/install-azure-cli).
- Refer to [jobs restrictions](../articles/container-apps/jobs.md#jobs-restrictions) for a list of limitations.

## Setup

1. To sign in to Azure from the CLI, run the following command and follow the prompts to complete the authentication process.

    ```azurecli
    az login
    ```

1. Ensure you're running the latest version of the CLI via the upgrade command.

    ```azurecli
    az upgrade
    ```

1. Install the latest version of the Azure Container Apps CLI extension.

    ```azurecli
    az extension add --name containerapp --upgrade
    ```

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
