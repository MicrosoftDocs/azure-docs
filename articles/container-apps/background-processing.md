---
title: 'Tutorial: Deploy a background processing application with Azure Container Apps Preview'
description: Learn to create an application that continuously runs in the background with Azure Container Apps
services: app-service
author: jorgearteiro
ms.service: app-service
ms.topic:  conceptual
ms.date: 10/21/2021
ms.author: joarteir
---

# Tutorial: Deploy a background processing application with Azure Container Apps Preview

Azure Container Apps allows you to deploy applications without requiring the exposure of public endpoints. In this tutorial, you deploy a sample application that reads messages from an Azure Storage Queue and logs the messages in Azure log Analytics workspace. Using Container Apps scale rules, the application can scale up and down based on the Azure Storage queue length. When there are no messages on the queue, the container app scales down to zero.

You learn how to:

> [!div class="checklist"]
> * Create a Container Apps environment to deploy your container apps
> * Create an Azure Storage Queue to send messages to the container app
> * Deploy your background processing application as a container app
> * Verify that the queue messages are processed by the container app

## Prerequisites

The following items are required to complete this tutorial:

* **Azure CLI**: You must have Azure CLI version 2.29.0 or later installed on your local computer.
  * Run `az --version` to find the version. If you need to install or upgrade, see [Install the Azure CLI](/cli/azure/install-azure-cli)
* **Bash or zsh**: All script snippets used on this tutorial are using bash or zsh shell.
  
## Setup

This tutorial makes use of the following environment variables:

```bash
RESOURCE_GROUP="containerapps-rg"
LOCATION="eastus2"
CONTAINERAPPS_ENVIRONMENT="containerappsenv"
LOG_ANALYTICS_WORKSPACE="containerappslogs"
STORAGE_ACCOUNT="<MY_STORAGE_ACCOUNT_NAME>"
```

Replace the `<MY_STORAGE_ACCOUNT_NAME>` placeholder with your own value before you run this snippet. Storage account names must be unique within Azure, be between 3 and 24 characters in length, and may contain numbers or lowercase letters only. The storage account will be created in a following step.

Next, sign in to Azure from the CLI.

Run the following command, and follow the prompts to complete the authentication process.

```azurecli
az login
```

Ensure you're running the latest version of the CLI via the upgrade command.

```azurecli
az upgrade
```

Next, install the Azure Container Apps extension to the CLI.

```azurecli
az extension add \
  --source https://workerappscliextension.blob.core.windows.net/azure-cli-extension/containerapp-0.2.0-py2.py3-none-any.whl
```

Create a resource group to organize the services related to your new container app.

```azurecli
az group create \
  --name $RESOURCE_GROUP \
  --location $LOCATION
```

With the CLI upgraded and a new resource group available, you can create a Container Apps environment and deploy your container app.

## Create an environment

Azure Container Apps environments act as isolation boundaries between a group of container apps. Different container apps in the same environment are deployed in the same virtual network and write logs to the same Log Analytics workspace.

Azure Log Analytics is used to monitor your container app required when creating a Container Apps environment.

Create a new Log Analytics workspace with the following command:

```azurecli
az monitor log-analytics workspace create \
  --resource-group $RESOURCE_GROUP \
  --workspace-name $LOG_ANALYTICS_WORKSPACE
```

Next, retrieve the Log Analytics Client ID and client secret.

```azurecli
LOG_ANALYTICS_WORKSPACE_CLIENT_ID=`az monitor log-analytics workspace show --query customerId -g $RESOURCE_GROUP -n $LOG_ANALYTICS_WORKSPACE --out json | tr -d '"'`

LOG_ANALYTICS_WORKSPACE_CLIENT_SECRET=`az monitor log-analytics workspace get-shared-keys --query primarySharedKey -g $RESOURCE_GROUP -n $LOG_ANALYTICS_WORKSPACE --out json | tr -d '"'`
```

Individual container apps are deployed to an Azure Container Apps environment. To create the environment, run the following command:

```azurecli
az containerapp env create \
  --name $CONTAINERAPPS_ENVIRONMENT \
  --resource-group $RESOURCE_GROUP \
  --logs-workspace-id $LOG_ANALYTICS_WORKSPACE_CLIENT_ID \
  --logs-workspace-key $LOG_ANALYTICS_WORKSPACE_CLIENT_SECRET \
  --location $LOCATION
```

## Set up a storage queue

Create an Azure Storage account.

```azurecli
az storage account create \
  --name $STORAGE_ACCOUNT \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --sku Standard_RAGRS \
  --kind StorageV2
```

Next, get the queue's connection string.

```azurecli
QUEUE_CONNECTION_STRING=$(az storage account show-connection-string -g $RESOURCE_GROUP --name $STORAGE_ACCOUNT --query connectionString -o tsv)
```

Now you can create the queue.

```azurecli
az storage queue create \
  --name "myqueue" \
  --account-name $STORAGE_ACCOUNT \
  --connection-string $QUEUE_CONNECTION_STRING
```

Finally, you can send a message to the queue.

```azurecli
az storage message put \
  --content "Hello Queue Reader App" \
  --queue-name "myqueue" \
  --connection-string $QUEUE_CONNECTION_STRING
```

## Deploy the background application

The first step is to define scale rules for the container app.

Create a file named *myscalerules.yaml*, and pass the following configuration code in the file.

```yml
- name: myqueuerule
  type: azureQueue 
  queueName: myqueue
  queueLength: 100
  auth:
  - secretRef: queueconnection
    triggerParameter: connection
```

Now you can create and deploy your container app.

```azurecli
az containerapp create \
  --name queuereaderapp \
  --resource-group $RESOURCE_GROUP \
  --environment $CONTAINERAPPS_ENVIRONMENT \
  --revisions-mode single \
  --min-replicas 1 \
  --max-replicas 10 \
  --scale-rules "./myscalerules.yaml" \
  --secrets "queueconnection=$QUEUE_CONNECTION_STRING" \
  --image "vturecek/dotnet-queuereader:v1" \
  --environment-variables "QueueName=myqueue,QueueConnectionString=secretref:queueconnection"
```

This command deploys the demo background application from the public container image called vturecek/dotnet-queuereader:v1 setting secrets and environments variables used by the application.
Application will scale up to 10 replicas based on the queue length as defined on *myscalerules.yaml* file created on previous step.

## Verify the result

The container app is running as a background process creates logs entries in Log analytics as messages arrive from Azure Storage Queue.

Run the following command to see logged messages. This command requires the Log analytics extension, so accept the prompt to install extension when requested.

```azurecli
az monitor log-analytics query \
  --workspace $LOG_ANALYTICS_WORKSPACE_CLIENT_ID \
  --analytics-query "ContainerAppConsoleLogs_CL | where ContainerAppName_s contains 'queuereaderapp' and Log_s contains 'Message ID'" 
```

## Clean up resources

If you're not going to continue to use this application, you can delete the Azure Container Apps instance and all the associated services by removing the resource group.

```azurecli
az group delete --resource-group $RESOURCE_GROUP
```
