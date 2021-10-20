---
title: 'Tutorial: Deploy a Background processing Application with Azure Container Apps'
description: Learn to create an application that continuously runs in the background with Azure Container Apps
services: app-service
author: jorgearteiro
ms.service: app-service
ms.topic:  conceptual
ms.date: 10/16/2021
ms.author: joarteir
---

# Tutorial: Deploy a Background processing Application with Azure Container Apps

Azure Container Apps allows an application to be deployed without opening any ingress to the container where the application is running. Application runs as a background process using the container image, cpu cores, memory, secrets, environment variables and scale rules defined by you. 

In this Tutorial, a sample application is deployed to read messages from an Azure Storage Queue and logs the message in Azure log Analytics workspace. Using container apps scale rules feature, the application will scale up and down based on the Azure Storage queue length. When there is no messages on the queue, application will scales down to zero. You learn how to:

> [!div class="checklist"]
> * Create a Container Apps environment to deploy your container apps
> * Create an Azure Storage Queue to send messages to the container app
> * Deploy your Background processing application as a container app
> * Verify if Azure Storage Queue messages have been processed by the container app

<!-- ## Setup application and container

## Configure auto-scaling

## Upgrade to new version of background processing job -->

## Prerequisites

You must satisfy the following requirements to complete this tutorial:

**Azure CLI**: You must have Azure CLI version 2.29.0 or later installed on your local computer. Run az --version to find the version. If you need to install or upgrade, see [Install the Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)

**Bash or zsh**: All script snippets used on this tutorial are using bash or zsh shell. 

## Before you begin



This tutorial makes use of the following environment variables:

```bash
RESOURCE_GROUP="containerapps-rg"
LOCATION="northcentralus"
CONTAINERAPPS_ENVIRONMENT="containerappsenv"
LOG_ANALYTICS_WORKSPACE="containerappslogs"
STORAGE_ACCOUNT="<storage account name>"
STORAGE_ACCOUNT_QUEUE="demoqueue"
```
> [!NOTE]
> Choose a name for the `STORAGE_ACCOUNT` environment variable above, before you run this snippet. Storage Account will be created in a following step. Storage account names must be *unique within Azure* and between 3 and 24 characters in length and may contain numbers and lowercase letters only.

## Setup

Begin by signing in to Azure from the CLI.

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
  --source https://workerappscliextension.blob.core.windows.net/azure-cli-extension/containerapp-0.1.6-py2.py3-none-any.whl 
```

Create a resource group to organize the services related to your new container app.

```azurecli
az group create \
  --name $RESOURCE_GROUP \
  --location $LOCATION
```

With the CLI upgraded and a new resource group available, you can create a Container Apps environment and deploy your container app.

## Create an environment

Azure Container Apps environments act as isolation boundaries between a group of container apps. Container Apps deployed to the same environment are deployed in the same virtual network and write logs to the same Log Analytics workspace.

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

## Set up a storage Queue


### Create an Azure Storage account

```azurecli
az storage account create \
  --name $STORAGE_ACCOUNT \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --sku Standard_RAGRS \
  --kind StorageV2
```

### Create Queue
```azurecli
az storage queue create \
  --name $STORAGE_ACCOUNT_QUEUE
```
### Get queue ConnectionString 

```azurecli
QUEUE_CONNECTION_STRING=$(az storage account show-connection-string -g $RESOURCE_GROUP --name $STORAGE_ACCOUNT --query connectionString -o tsv)
```

### Send a message to the storage queue 

```azurecli
az storage message put \
  --content "Hello Queue Reader App" \
  --queue-name $STORAGE_ACCOUNT_QUEUE
```

## Deploy the background application

### Create Container App's Scale Rule as a local YAML file 

This command generates a local YAML file called myscalerules.yaml required by the next tutorial step.

```azurecli
cat <<EOF > myscalerules.yaml
- name: myqueuerule
  type: azureQueue 
  queueName: $STORAGE_ACCOUNT_QUEUE
  queueLength: 100
  auth:
  - secretRef: queueconnection
    triggerParameter: connection
EOF
```

### Deploy Container App 

```azurecli
az containerapp create \
  --name queuereaderapp \
  --resource-group $RESOURCE_GROUP \
  --environment $CONTAINERAPPS_ENVIRONMENT \
  --enable-dapr false \
  --cpu 0.2 \
  --memory 100Mi \
  --revisions-mode single \
  --min-replicas 0 \
  --max-replicas 10 \
  --scale-rules "./myscalerules.yaml" \
  --secrets "queueconnection=$QUEUE_CONNECTION_STRING" \
  --image "vturecek/dotnet-queuereader:v1" \
  --environment-variables "QueueName=$STORAGE_ACCOUNT_QUEUE,QueueConnectionString=secretref:queueconnection"
```

This command deploys the demo background application from the public container image called vturecek/dotnet-queuereader:v1

## Verify the result

### Query Log Analytics

The Background container app creates logs entries on Log analytics when processing the message from Azure Storage Queue. Run this command to search for this message.
```azurecli
az monitor app-insights query \
  --apps $LOG_ANALYTICS_WORKSPACE_CLIENT_ID \
  --analytics-query "ContainerAppConsoleLogs_CL | where ContainerAppName_s contains 'queuereader' and Log_s contains 'Message ID'" \
  --offset 48h
```

> [!NOTE]
> This command requires the extension application-insights to be installed, please accept prompt to install extension when requested.

## Clean up resources

Once you are done, clean up your Container App resources by running the following command to delete your resource group.

```azurecli
az group delete --resource-group $RESOURCE_GROUP --yes
```

This will delete the entire resource group including container apps, storage account, log analytics workspace, container apps environment and any other resources in the resource group.


