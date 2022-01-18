---
title: Move workspace between subscriptions
titleSuffix: Azure Machine Learning
description: Learn how to move workspace between subscriptions
services: machine-learning
author: rastala
ms.author: roastala
ms.service: machine-learning
ms.subservice: core
ms.reviewer: larryfr
ms.topic: how-to
ms.date: 01/18/2022
---

# Move Azure Machine Learning Workspaces between Subscriptions (preview)

As the requirements of your machine learning application change, you may need to move your
workspace to a different subscription. Applicable scenarios include:

 * Promote workspace from test subscription to production subscription
 * Change the design and architecture of your application
 * Move workspace to a subscription with more available quota
 * Move workspace to a subscription with different cost center
 
Workspace move enables you to migrate your workspace and its contents in a single automated step.

> [!IMPORTANT]	
> Workspace move is currently in public preview. This preview is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 	
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).


> [!IMPORTANT]	
> Workspace move is not meant for replicating workspaces, or moving individual assets such as models or datasets from one workspace to another.

> [!IMPORTANT]	
> Workspace move does not support migration across Azure regions.

## Prerequisites

- An Azure Machine Learning workspace. For more information, see [Create an Azure Machine Learning workspace](how-to-manage-workspace.md).
- You must have permissions to manage resources in both source and target subscriptions, such as Contributor role.
-The destination subscription must be registered for Azure Machine Learning resource provider.

## Prepare and validate workspace for move

In Azure CLI, set the subscription to that of your origin workspace

```azurecli-interactive
>az account set -s origin-sub-id
```

Ensure that the origin workspace is not actively used. Check that any experiment runs, data profiling runs, or labeling projects have completed, and that inferencing endpoints are not being invoked. 

Then, delete or detach any computes from the workspace, and delete any inferencing endpoints. Move of computes or endpoints is not supported currently. Also note that the workspace will become unavailable during the move.

Create a destination resource group where to move the workspace. The destination must be in the same region as the origin.

```azurecli-interactive
az group create -g destination-rg -l my-region --subscription destination-sub-id                  
```

Validate the move operation for workspace. You can also include associated resources such as storage account, container registry, key vault, and application insights into the move by adding them to the ```resources``` list. The validation may take several minutes.

```azurecli-interactive
az resource invoke-action --action validateMoveResources --ids "/subscriptions/origin-sub-id/resourceGroups/origin-rg" --request-body "{  \"resources\": [\"/subscriptions/origin-sub-id/resourceGroups/origin-rg/providers/Microsoft.MachineLearningServices/workspaces/origin-workspace-name\"],\"targetResourceGroup\":\"/subscriptions/destination-sub-id/resourceGroups/destination-rg\" }"
```

## Move workspace

Once the validation has succeeded, move the workspace. You may also include any associated resources into move operation by adding them to the ```ids``` argument. This operation may take several minutes.

```azurecli-interactive
az resource move --destination-group destination-rg --destination-subsctiption-id destination-sub-id --ids "/subscriptions/origin-sub-id/resourceGroups/origin-rg/providers/Microsoft.MachineLearningServices/workspaces/origin-workspace-name"
```

After the move has completed, recreate any computes and redeploy any web service endpoints at the new location.

## Next steps

 * Learn about [resource move](https://docs.microsoft.com/azure/azure-resource-manager/management/move-resource-group-and-subscription)