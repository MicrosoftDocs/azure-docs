---
title: Create a job with Azure Container Apps (preview)
description: Learn to create an on-demand or scheduled job in Azure Container Apps
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: quickstart
ms.date: 04/12/2023
ms.author: cshoe
zone_pivot_groups: container-apps-job-types
---

# Create a job with Azure Container Apps (preview)

- intro
- prerequisites
- create container app environment
- create job
- run job (manual)
- list executions
- view logs
- next steps

Azure Container Apps jobs enable you run containerized workloads that have a finite duration. Jobs can execute manually or on a schedule. You can use jobs to perform tasks such as data processing, machine learning, and more.

## Prerequisites

- An Azure account with an active subscription.
  - If you don't have one, you [can create one for free](https://azure.microsoft.com/free/).
- Install the [Azure CLI](/cli/azure/install-azure-cli).

## Setup

To sign in to Azure from the CLI, run the following command and follow the prompts to complete the authentication process.

```azurecli
az login
```

Ensure you're running the latest version of the CLI via the upgrade command.

```azurecli
az upgrade
```

Next, uninstall any existing versions of the Azure Container Apps extension for the CLI and install the latest version that supports the jobs private preview.

```azurecli
az extension remove --name containerapp
az extension add --upgrade --source
https://containerappextension.blob.core.windows.net/containerappcliext/containerapp-private_preview_jobs_1.0.3-py2.py3-none-any.whl
```

> [!NOTE]
> Only use this version of the extension for the jobs private preview. To use the Azure CLI for other Container Apps scenarios, uninstall this version and install the latest version of the extension.
> 
> ```azurecli
> az extension remove --name containerapp
> az extension add --name containerapp
> ```

Register the `Microsoft.App` and `Microsoft.OperationalInsights` namespaces if you haven't already registered them in your Azure subscription.

```azurecli
az provider register --namespace Microsoft.App
az provider register --namespace Microsoft.OperationalInsights
```

Now that your Azure CLI setup is complete, you can define the environment variables that are used throughout this article.

```azurecli
export RESOURCE_GROUP="jobs-quickstart"
export LOCATION="centraluseuap"
ENVIRONMENT="env-jobs-quickstart"
JOB_NAME="my-job"
```

> [!NOTE]
> The jobs private preview is only supported in the Central US EUAP (`centraluseuap`) region.

## Create a Container Apps environment

The Azure Container Apps environment acts as a secure boundary. Container apps and jobs in an environment share the same network and can communicate with each other.

Create the Container Apps environment using the following command.

```
az containerapp env create \
  --name $ENVIRONMENT \
  --resource-group $RESOURCE_GROUP \
  --location "$LOCATION"
```

::: zone pivot="container-apps-job-manual"

## Create and run a manual job

To use manual jobs, you first create a job and then start an execution. You can start multiple executions of the same job and multiple job executions can run concurrently.

Create a job in the Container Apps environment using the following command.

```azurecli
az containerapp job create \
  --name $JOB_NAME \
  --resource-group $RESOURCE_GROUP \
  --environment $ENVIRONMENT \
  --image "mcr.microsoft.com/azuredocs/azuredocs-job:latest"
```

Start an execution of the job using the following command.

```azurecli
az containerapp job start \
  --name $JOB_NAME \
  --resource-group $RESOURCE_GROUP \
  --environment $ENVIRONMENT
```

The command returns details of the job execution, including its name.

::: zone-end

::: zone pivot="container-apps-job-scheduled"

Scheduled

::: zone-end

## List job execution history



## Next steps

> [!div class="nextstepaction"]
> [TBD](overview.md)
