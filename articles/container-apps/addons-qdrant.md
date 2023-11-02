---
title: 'Tutorial: Connect to a Qdrant vector database in Azure Container Apps (preview)'
description: Learn to use a Container Apps add on to quickly connect to a Qdrant vector database.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: conceptual
ms.date: 11/02/2023
ms.author: cshoe
---

# Tutorial: Connect to a Qdrant vector database in Azure Container Apps (preview)

Azure Container Apps uses [add-ons](services.md) to make it easy to connect to various development-grade cloud services. Rather than creating instances of services ahead of time to establish connections with complex configuration settings, you can use an add-on to connect your container app to a database like Qdrant.

For a full list of supported services, see [Connect to services in Azure Container Apps](services.md).

In this tutorial you:

> [!div class="checklist"]
> * Create a container app
> * Use a Container Apps add-on to connect to a Qdrant database
> * Interact with a Jupyter Notebook to explore the data

> [!IMPORTANT]
> This tutorial uses services that can affect your Azure bill. If you decide to follow along step-by-step, make sure you deactivate or delete the resources featured in this article to avoid unexpected billing.

## Prerequisites

To complete this project, you need the following items:

| Requirement  | Instructions |
|--|--|
| Azure account | If you don't have one, [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). You need the *Contributor* or *Owner* permission on the Azure subscription to proceed. <br><br>Refer to [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md?tabs=current) for details. |
| Azure CLI | Install the [Azure CLI](/cli/azure/install-azure-cli).|

## Setup

1. Set up application name and resource group variables. You can change these values to your preference.

    ```bash
    export APP_NAME=music-recommendations-demo-app
    export RESOURCE_GROUP=playground
    ```

1. Create variables to support the application. Don't change these values.

    ```bash
    export SERVICE_NAME=qdrantdb
    export LOCATION=southcentralus
    export ENVIRONMENT=music-recommendations-demo-environment
    export WORKLOAD_PROFILE_TYPE=D32
    export CPU_SIZE=8.0
    export MEMORY_SIZE=16.0Gi
    export IMAGE=simonj.azurecr.io/aca-ephemeral-music-recommendation-image
    ```

    | Variable | Description |
    |---|---|
    | `SERVICE_NAME` | The name of the add-on service created for your container app. In this case, you create a development-grade instance of a Qdrant database.  |
    | `LOCATION` | The Azure region location where you create your container app and add-on. |
    | `ENVIRONMENT` | The Azure Container Apps environment name for your demo application. |
    | `WORKLOAD_PROFILE_TYPE` | The workload profile  |
    | `CPU_SIZE` |  |
    | `MEMORY_SIZE` |  |
    | `IMAGE` |  |

1. Create a resource group.

    ```azurecli
    az group create --name $RESOURCE_GROUP --location $LOCATION
    ```

1. Create an environment.

    ```azurecli
    az containerapp env create \
      --name $ENVIRONMENT \
      --resource-group $RESOURCE_GROUP \
      --location $LOCATION
    ```

1. Create a workload profile.

    ```azurecli
    az containerapp env workload-profile set \
      --name $ENVIRONMENT \
      --resource-group $RESOURCE_GROUP \
      --workload-profile-type $WORKLOAD_PROFILE_TYPE \
      --workload-profile-name bigProfile \
      --min-nodes 0 \
      --max-nodes 2
    ```

## Use the Qdrant add-on

1. Create the Qdrant add-on service.

    ```azurecli
    az containerapp service qdrant create \
      --environment $ENVIRONMENT \
      --resource-group $RESOURCE_GROUP \
      --name $SERVICE_NAME
    ```

1. Create the container app.

    ```azurecli
    az containerapp create \
      --name $APP_NAME \
      --resource-group $RESOURCE_GROUP \
      --environment $ENVIRONMENT \
      --workload-profile-name bigProfile \
      --cpu $CPU_SIZE \
      --memory $MEMORY_SIZE \
      --image $IMAGE \
      --min-replicas 1 \
      --max-replicas 1 \
      --env-vars RESTARTABLE=yes
    ```

1. Bind the Qdrant add-on service to the container app.

    ```azurecli
    az containerapp update \
      --name $APP_NAME \
      -resource-group $RESOURCE_GROUP \
      --bind qdrantdb
    ```

## Configure the container app

1. Enable ingress on the container app.

    ```azurecli
    az containerapp ingress enable \
      --name $APP_NAME \
      --resource-group $RESOURCE_GROUP \
      --type external \
      --target-port 8888 \
      --transport auto
    ```

1. Enable ingress on the container app.

    ```azurecli
    az containerapp ingress cors enable \
      --name $APP_NAME \
      --resource-group $RESOURCE_GROUP \
      --allowed-origins *
    ```

1. Get the token.

    ```bash
    echo Your login token is: `az containerapp logs show -g $RESOURCE_GROUP --name $APP_NAME --tail 300 | \
      grep token |  cut -d= -f 2 | cut -d\" -f 1 | uniq`
    ```

    When you run this command, your token is printed to the terminal. The message should look like the following example.

    ```text
    Your login token is: 348c8aed080b44f3aaab646287624c70aed080b44f
    ```

    Copy your token value to your text editor to use to sign-in to the Jupyter Notebook.

## Use the Jupyter Notebook

1. Open a web browser and paste in the URL for your container app you set aside in a text editor.

    Next to the *Password to token* label, enter your token in the input box and select **Login**.

1. Enter the token value into the dialog box.

1. Open the *aca_environment.sh* file and execute the commands in the Jupyter Notebook.
