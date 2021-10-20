---
title: 'Tutorial: Deploy a Dapr application to Azure Container Apps'
description: Deploy a Dapr application to Azure Container Apps.
services: app-service
author: asw101 
ms.service: app-service
ms.topic:  conceptual
ms.date: 10/16/2021
ms.author: aawislan
---

# Tutorial: Deploy a Dapr application to Azure Container Apps

[Dapr](https://dapr.io/) (Distributed Application Runtime) is a runtime that helps build resilient, stateless and stateful microservices. In this tutorial, a sample Dapr application is deployed to Azure Container Apps.

You learn how to:

> [!div class="checklist"]
> * Create a Container Apps environment for your container apps
> * Create an Azure Blob Storage state store for the container app
> * Deploy two apps that a produce and consume messages and persist them using the state store
> * Verify the interaction between the two microservices.

Azure Container Apps offers a fully managed version of the Dapr APIs when building microservices. When you use Dapr in Azure Container Apps, you can enable sidecars to run next to your microservices that provide a rich set of capabilities. Available Dapr APIs include [Service to Service calls](https://docs.dapr.io/developing-applications/building-blocks/service-invocation/), [Pub/Sub](https://docs.dapr.io/developing-applications/building-blocks/pubsub/), [Event Bindings](https://docs.dapr.io/developing-applications/building-blocks/bindings/), [State Stores](https://docs.dapr.io/developing-applications/building-blocks/state-management/) and [Actors](https://docs.dapr.io/developing-applications/building-blocks/actors/).

In this tutorial, you deploy the same applications from the Dapr [Hello World](https://github.com/dapr/quickstarts/tree/master/hello-kubernetes) quickstart, which consists of a producer (Python) app that generates messages, and a consumer (Node) app that consumes and persists those messages in a configured state store. The following architecture diagram illustrates the components that make up this tutorial:

![Dapr architecture diagram for Hello World quickstart](https://github.com/dapr/quickstarts/raw/master/hello-kubernetes/img/Architecture_Diagram.png)

## Prerequisites

* [Azure CLI](../../cli/azure/install-azure-cli.md)

## Before you begin

This guide makes use of the following environment variables:

```bash
RESOURCE_GROUP="containerapps-rg"
LOCATION="northcentralus"
CONTAINERAPPS_ENVIRONMENT="containerappsenv"
LOG_ANALYTICS_WORKSPACE="containerappslogs"
STORAGE_ACCOUNT="<storage account name>"
STORAGE_ACCOUNT_CONTAINER="mycontainer"
```

The above snippet can be used to set the environment variables using bash or zsh.

Choose a name for `STORAGE_ACCOUNT`. It will be created in a following step. Storage account names must be *unique within Azure* and between 3 and 24 characters in length and may contain numbers and lowercase letters only.

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

## Set up a state store



### Create an Azure Blob Storage account

Use the following command to create a new Azure Storage account.

```azurecli
az storage account create \
  --name $STORAGE_ACCOUNT \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --sku Standard_RAGRS \
  --kind StorageV2
```

Once your Azure Blob Storage account is created, you will need to use the following values.

**accountName** will be the value of `STORAGE_ACCOUNT` that you chose above.

**containerName** will be the value of `STORAGE_ACCOUNT_CONTAINER` defined above (e.g. mycontainer). Dapr will create a container with this name if it doesn't exist.

Get an **accountKey** with the following command.

```azurecli
az storage account keys list \
  --resource-group $RESOURCE_GROUP \
  --account-name $STORAGE_ACCOUNT
```

### Configure the state store component

Using the properties you sourced from the steps above, create a config file named *components.yaml*. This file helps enable your Dapr app to access your state store. The following example shows how your *components.yaml* file should look when configured for your Azure Blob Storage account:

```yaml
# components.yaml for Azure Blob storage component
- name: statestore
  type: state.azure.blobstorage
  version: v1
  metadata:
  # Note that in a production scenario, account keys and secrets 
  # should be securely stored. For more information, see
  # https://docs.dapr.io/operations/components/component-secrets
  - name: accountName
    value: <YOUR_STORAGE_ACCOUNT_NAME>
  - name: accountKey
    value: <YOUR_KEY>
  - name: containerName
    value: <YOUR_CONTAINER_NAME>
```

To use this file, make sure to replace the placeholder values between the `<>` brackets with your own values.

> [!NOTE]
> Container Apps currently does not support the native [Dapr components schema](https://docs.dapr.io/operations/components/component-schema/). The above example is the schema that is currently supported in Container Apps.
>
> In a production-grade application, follow [secret management](https://docs.dapr.io/operations/components/component-secrets) instructions to securely manage your secrets.



## Deploy the producer application (HTTP web server)

Navigate to the directory in which you stored the *components.yaml* file and run the command below to deploy the producer container app.

```azurecli
az containerapp create \
  --name nodeapp \
  --resource-group $RESOURCE_GROUP \
  --environment $CONTAINERAPPS_ENVIRONMENT \
  --image dapriosamples/hello-k8s-node:latest \
  --target-port 3000 \
  --ingress 'external' \
  --min-replicas 1 \
  --max-replicas 1 \
  --enable-dapr \
  --dapr-app-port 3000 \
  --dapr-app-id nodeapp \
  --dapr-components ./components.yaml
```

This command that the producer (Node) app server on `--target-port 3000` (the app's port) along with its accompanying Dapr side car configured with `--dapr-app-id nodeapp` and `--dapr-app-port 3000` for service discovery and invocation. Your state store is configured using `--dapr-components ./components.yaml`, which enables the sidecar to persist state.


## Deploy the consumer application (headless client)

Navigate to the directory in which you stored the *components.yaml* file and run the command below to deploy the consumer container app.

```azurecli
az containerapp create \
  --name pythonapp \
  --resource-group $RESOURCE_GROUP \
  --environment $CONTAINERAPPS_ENVIRONMENT \
  --image dapriosamples/hello-k8s-python:latest \
  --min-replicas 1 \
  --max-replicas 1 \
  --enable-dapr \
  --dapr-app-id pythonapp
```

Run the command below to deploy `pythonapp` which also runs with a Dapr sidecar that is used to look up and securely call the Dapr sidecar for `nodeapp`. Note that since this app is headless there is no `--target-port` to start a server, nor is there a need to enable ingress.

## Verify the result

### Confirm successful state persistence

You can confirm the services are working correctly by viewing data in your Azure Storage account.

1. Open the [Azure portal](https://portal.azure.com) in your browser and navigate to your storage account.

1. Select **Containers** on the left.

1. Select **mycontainer**.

1. Verify that you can see the files in the container.

## Clean up resources

Once you are done, clean up your Container App resources by running the following command to delete your resource group.

```azurecli
az group delete --resource-group $RESOURCE_GROUP --yes
```

This will delete both container apps, the storage account, the container apps environment and any other resources in the resource group.

> [!NOTE]
> Since `pythonapp` continuously makes calls to `nodeapp` with messages that get persisted into your configured state store, it is important to complete these cleanup steps to avoid ongoing billable operations.
