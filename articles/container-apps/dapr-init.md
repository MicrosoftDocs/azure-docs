---
title: "Initialize Dapr in a container app environment using the Azure CLI (preview)"
titleSuffix: "Azure Container Apps"
description: Learn how to initialize your Dapr components using the Azure CLI.
author: hhunter-ms
ms.author: hannahhunter
ms.service: container-apps
ms.topic: how-to
ms.date: 11/27/2023
---

# Initialize Dapr in a container app environment using the Azure CLI (preview)

Simplify your Dapr development experience by initializing Dapr components directly to your Azure Container Apps environment with one command. 

Initially, deploying and running your Dapr-enabled container apps on the Azure Container Apps platform required a significant amount of time around configuring the infrastructure and Dapr components. Due to this complexity, when migrating your local workload to Azure Container Apps, you redid much of the setup.  

The `az containerapp env dapr-component init` command:
-	Seamlessly transitions from code to cloud, bringing the local dev experience to ACA using either the Azure CLI or the Dapr CLI.
-	Deploys the application code without any changes specific to ACA.
-	Implements lightweight development-grade services powering the infrastructure.
-	Automatically manages secrets via the service binding.

## Supported Dapr components

Currently, the `dapr-component init`` command supports the following Dapr components:
-	Redis for state stores and pub/sub
-	Apache Kafka for pub/sub
-	PostgreSQL for state stores

## Prerequisites

- An Azure subscription. If you don't have one yet, [you can create a free Azure account.](https://azure.microsoft.com/free)
- Install the [Azure CLI](/cli/azure/install-azure-cli).
- Sign into [Docker Hub](https://www.docker.com/products/docker-hub/)

## Build and run the Docker images

In the terminal, package the `order-processor` and `order-publisher` services into Docker images and build the images to your Docker Hub account.

```shell
docker buildx build --platform linux/amd64 -t daprms.azurecr.io/public/daprio/samples/azcli-capps/python-order-publisher:latest --push ./order-publisher
docker buildx build --platform linux/amd64 -t daprms.azurecr.io/public/daprio/samples/azcli-capps/python-order-processor:latest --push ./order-processor
```

## Set the environment variables

In the terminal, set the environment variables. Replace the text within brackets below to values applicable to your scenario.

```shell
VAR_RESOURCE_GROUP="{PREFIX}-$(uuidgen | cut -c1-4)"
VAR_ENVIRONMENT="{YOUR-ACA-ENVIRONMENT}"
VAR_LOCATION="{YOUR LOCATION}"
echo $VAR_RESOURCE_GROUP
```

## Create the resource group

Create the resource group to which you'd like to deploy your container app managed environment.

```shell
az group create --name "$VAR_RESOURCE_GROUP" --location "$VAR_LOCATION"
```

## Create the managed environment 

Deploy and create the managed environment to the resource group you just created, using the environment name you set earlier.

```shell
az deployment group create --resource-group "$VAR_RESOURCE_GROUP" --template-file ./deploy/managedEnvironment.bicep --parameters environment_name="$VAR_ENVIRONMENT" --parameters location="$VAR_LOCATION"
```

## Initialize Dapr components

Run the new `dapr-component init` command to initialize managed Dapr components in your container app environment.

```shell
az containerapp env dapr-component init -g $VAR_RESOURCE_GROUP --name $VAR_ENVIRONMENT 
```

## Deploy your container apps

Now that your container app environment and Dapr components are prepared, deploy the sample container apps.

```shell
az deployment group create --resource-group "$VAR_RESOURCE_GROUP" --template-file ./deploy/containerApps.bicep --parameters environment_name="$VAR_ENVIRONMENT" --parameters location="$VAR_LOCATION"
```

You're up and running with Dapr in Azure Container Apps!

## View logs

In the Azure portal, navigate to your container app. 

NEED SCREENSHOT

Use the following query to view console logs.

```
ContainerAppConsoleLogs_CL
// | summarize min(time_t), max(time_t) by RevisionName_s
| where RevisionName_s in ("order-publisher--fi3vasv", "order-processor--c236r52")
| where ContainerName_s == "daprd"
| project time_t, RevisionName_s, Log_s
| order by time_t asc
```

NEED SCREENSHOT OF RESULTS

## Clean up resources

When you're finished experimenting with this tutorial, remove lingering resources with the following command.

```shell
az group delete --name "$VAR_RESOURCE_GROUP"
```

## Next steps

Learn more about [deploying Dapr applications to Azure Container Apps](./microservices-dapr.md).