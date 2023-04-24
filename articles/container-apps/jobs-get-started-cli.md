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



::: zone pivot="container-apps-job-manual"

Manual

::: zone-end

::: zone pivot="container-apps-job-scheduled"

Scheduled

::: zone-end

## Next steps

> [!div class="nextstepaction"]
> [TBD](overview.md)
