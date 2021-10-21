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

In this tutorial, you deploy the same applications from the Dapr [Hello World](https://github.com/dapr/quickstarts/tree/master/hello-kubernetes) quickstart, which consists of a client (Python) app that generates messages, and a service (Node) app that consumes and persists those messages in a configured state store. The following architecture diagram illustrates the components that make up this tutorial:

:::image type="content" source="media/microservices-dapr/azure-container-apps-microservices-dapr.png" alt-text="Architecture diagram for Dapr Hello World microservices on Azure Container Apps":::

## Prerequisites

* [Azure CLI](/cli/azure/install-azure-cli)

## Before you begin

This guide makes use of the following environment variables:

```bash
RESOURCE_GROUP="my-containerapps"
LOCATION="eastus"
CONTAINERAPPS_ENVIRONMENT="containerapps-env"
LOG_ANALYTICS_WORKSPACE="containerapps-logs"
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

Azure Log Analytics is used to monitor your container app and is required when creating a Container Apps environment.

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

Once your Azure Blob Storage account is created, source the following values that are needed for subsequent steps in this tutorial.

**accountName** will be the value of `STORAGE_ACCOUNT` that you chose above.

**containerName** will be the value of `STORAGE_ACCOUNT_CONTAINER` defined above (e.g. mycontainer). Dapr will create a container with this name if it doesn't already exist in your Azure Storage account.

Get an **accountKey** with the following command.

```azurecli
STORAGE_ACCOUNT_KEY=`az storage account keys list --resource-group $RESOURCE_GROUP --account-name $STORAGE_ACCOUNT --query [0].value --out json | tr -d '"'`
```

### Configure the state store component

Using the properties you sourced from the steps above, create an ARM template. The ARM template has the Container App definition and a Dapr component definition. The following example shows how your ARM template should look when configured for your Azure Blob Storage account:

```json

```

> [!NOTE]
> Container Apps currently does not support the native [Dapr components schema](https://docs.dapr.io/operations/components/component-schema/). The above example is the schema that is currently supported in Container Apps.
>
> In a production-grade application, follow [secret management](https://docs.dapr.io/operations/components/component-secrets) instructions to securely manage your secrets.


## Deploy the service application (HTTP web server)

Navigate to the directory in which you stored the ARM template file and run the command below to deploy the service container app.

```azurecli
az deployment group create --resource-group "$RESOURCE_GROUP" --template-file ./httpapp.json --parameters environment_name="$CONTAINERAPPS_ENVIRONMENT" storage_account_name="$STORAGE_ACCOUNT" storage_account_key="$STORAGE_ACCOUNT_KEY" storage_container_name="$STORAGE_ACCOUNT_CONTAINER"
```


This command deploys the service (Node) app server on `--target-port 3000` (the app's port) along with its accompanying Dapr sidecar configured with `--dapr-app-id nodeapp` and `--dapr-app-port 3000` for service discovery and invocation. Your state store is configured using `--dapr-components ./components.yaml`, which enables the sidecar to persist state.


## Deploy the client application (headless client)

Run the command below to deploy the client container app.

```azurecli
az deployment group create --resource-group "$RESOURCE_GROUP" --template-file ./clientapp.json --parameters environment_name="$CONTAINERAPPS_ENVIRONMENT"
```


This command deploys `pythonapp` which also runs with a Dapr sidecar that is used to look up and securely call the Dapr sidecar for `nodeapp`. Note that since this app is headless there is no `--target-port` to start a server, nor is there a need to enable ingress.

## Verify the result

### Confirm successful state persistence

You can confirm the services are working correctly by viewing data in your Azure Storage account.

1. Open the [Azure portal](https://portal.azure.com) in your browser and navigate to your storage account.

1. Select **Containers** on the left.

1. Select **mycontainer**.

1. Verify that you can see the file named `order` in the container.

1. Click on the file.

1. Click the **Edit** tab.

1. Click the **Refresh** button to observe updates.


### View Logs

Data logged via a container app are stored in the `ContainerAppConsoleLogs_CL` custom table in the Log Analytics workspace. You can view logs through the Azure portal or with the CLI.

Use the following CLI command to view logs on the command line.

```azurecli
az monitor log-analytics query \
  -w $LOG_ANALYTICS_WORKSPACE \
  --analytics-query "ContainerAppConsoleLogs_CL | where AppName_s contains 'pythonapp' | project AppName_s, Log_s, TimeGenerated | take 3" \
  -o table
```

The following output demonstrates the type of response to expect from the CLI command.

```console
AppName_s      Log_s                                                       TableName      TimeGenerated
-------------  ----------------------------------------------------------  -------------  ------------------------
myapp-igsvt3p  INFO:     127.0.0.1:34504 - "GET /healthz HTTP/1.1" 200 OK  PrimaryResult  2021-07-26T11:33:01.079Z
myapp-ad07o77  INFO:     127.0.0.1:51410 - "GET /healthz HTTP/1.1" 200 OK  PrimaryResult  2021-07-26T11:33:42.084Z
myapp-ad07o77  INFO:     127.0.0.1:38612 - "GET /healthz HTTP/1.1" 200 OK  PrimaryResult  2021-07-26T11:34:26.564Z
```


## Clean up resources

Once you are done, clean up your Container App resources by running the following command to delete your resource group.

```azurecli
az group delete --resource-group $RESOURCE_GROUP
```

This will delete both container apps, the storage account, the container apps environment and any other resources in the resource group.

> [!NOTE]
> Since `pythonapp` continuously makes calls to `nodeapp` with messages that get persisted into your configured state store, it is important to complete these cleanup steps to avoid ongoing billable operations.

## Next steps

> [!div class="nextstepaction"]
> [Monitor an app](monitor.md)
