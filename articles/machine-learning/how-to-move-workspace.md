---
title: Move workspace between subscriptions (preview)
titleSuffix: Azure Machine Learning
description: Learn how to move an Azure Machine Learning workspace between Azure subscriptions.
services: machine-learning
author: rastala
ms.author: roastala
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.reviewer: larryfr
ms.topic: how-to
ms.date: 06/08/2023
---

# Move Azure Machine Learning workspaces between subscriptions (preview)

As the requirements of your machine learning application change, you may need to move your workspace to a different Azure subscription. For example, you may need to move the workspace in the following situations:

* Promote workspace from test subscription to production subscription.
* Change the design and architecture of your application.
* Move workspace to a subscription with more available quota.
* Move workspace to a subscription with different cost center.

Moving the workspace enables you to migrate the workspace and its contents as a single, automated step. The following table describes the workspace contents that are moved:

| Workspace contents | Moved with workspace |
| ----- |:-----:|
| Datastores | Yes |
| Datasets | No |
| Experiment jobs | Yes |
| Environments | Yes |
| Models and other assets stored in the workspace | Yes |
| Compute resources | No |
| Endpoints | No |

> [!IMPORTANT]    
> Workspace move is currently in public preview. This preview is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.     
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

- An Azure Machine Learning workspace in the source subscription. For more information, see [Create workspace resources](quickstart-create-resources.md).
- You must have permissions to manage resources in both source and target subscriptions. For example, Contributor or Owner role at the __subscription__ level. For more information on roles, see [Azure roles](../role-based-access-control/rbac-and-directory-admin-roles.md#azure-roles).

    - You need permissions to __delete__ resources from the source location.
    - You need permissions to __create__ resources in the destination location.
    - Thee move mustn't violate Azure Policies in the destination location.
    - Any role assignments to the source workspace scope aren't moved; you must recreate them in the destination.

- The destination subscription must be registered for required resource providers. The following table contains a list of the resource providers required by Azure Machine Learning:

    | Resource provider | Why it's needed |
    | ----- | ----- |
    | __Microsoft.MachineLearningServices__ | Creating the Azure Machine Learning workspace. |
    | __Microsoft.Storage__ | Azure Storage Account is used as the default storage for the workspace. |
    | __Microsoft.ContainerRegistry__ | Azure Container Registry is used by the workspace to build Docker images. |
    | __Microsoft.KeyVault__ | Azure Key Vault is used by the workspace to store secrets. |
    | __Microsoft.Notebooks/NotebookProxies__ | Integrated notebooks on Azure Machine Learning compute instance. |
    | __Microsoft.ContainerService__ | If you plan on deploying trained models to Azure Kubernetes Services. |

    If you plan on using a customer-managed key with Azure Machine Learning, then the following service providers must be registered:

    | Resource provider | Why it's needed |
    | ----- | ----- |
    | __Microsoft.DocumentDB/databaseAccounts__ | Azure Cosmos DB instance that logs metadata for the workspace. |
    | __Microsoft.Search/searchServices__ | Azure Search provides indexing capabilities for the workspace. |

    For information on registering resource providers, see [Resolve errors for resource provider registration](/azure/azure-resource-manager/templates/error-register-resource-provider).

- The [Azure CLI](/cli/azure/install-azure-cli).

    > [!TIP]
    > The move operation does not use the Azure CLI extension for machine learning.

## Supported scenarios

* Automated workspace move across resource groups or subscriptions within the same region. For more information, see [Moving resources to a new resource group or subscription](/azure/azure-resource-manager/management/move-resource-group-and-subscription).

    > [!NOTE]
    > The workspace must be quiescent before the move; computes are deleted, no live endpoints or running experiments.

    :::image type="content" source="./media/how-to-move-workspace/move-resources.png" alt-text="Screenshot of the move resources steps in the Azure portal." lightbox="./media/how-to-move-workspace/move-resources.png":::

* Moving a workspace that has private endpoints configured is supported. The private endpoints are disconnected and transitive private endpoints are recreated after the move. However, you're responsible for approving the new private endpoints (including the workspace private endpoint) after the move.

## Limitations

* Workspace move isn't meant for replicating workspaces, or moving individual assets such as models or datasets from one workspace to another.
* Workspace move doesn't support migration across Azure regions.
* Workspace move doesn't support migration across Azure Active Directory tenants.

    > [!TIP]
    > For information on manually moving tenants, see the [Transfer an Azure subscription to a different Azure Active Directory](/azure/role-based-access-control/transfer-subscription) article.

* The workspace mustn't be in use during the move operation. Verify that all experiment jobs, data profiling jobs, and labeling projects have completed. Also verify that inference endpoints aren't being invoked.
* The workspace becomes unavailable during the move.
* Before to the move, you must delete or detach computes and inference endpoints from the workspace.
* Datastores may still show the old subscription information after the move. For steps to manually update the datastores, see [Scenario: Move a workspace with nondefault datastores](#scenario-move-a-workspace-with-nondefault-datastores).

The following scenarios __are not__ supported:

* Workspace with computes (either existing computes or in the process of creating the compute).
* Workspace with deployed services.
* Workspace with online endpoints/deployments.
* Workspace configured for [customer managed-key](how-to-setup-customer-managed-keys.md).
* Workspace with currently running labeling projects.
* Workspace linked with Azure Databricks.
* Workspace move across regions.

## Prepare and validate the move

1. In Azure CLI, set the subscription to that of your origin workspace

    ```azurecli-interactive
    az account set -s origin-sub-id
    ```

2. Verify that the origin workspace isn't being used. Check that any experiment jobs, data profiling jobs, or labeling projects have completed. Also verify that inferencing endpoints aren't being invoked. 

3. Delete or detach any computes from the workspace, and delete any inferencing endpoints. Moving computes and endpoints isn't supported. Also note that the workspace becomes unavailable during the move.

4. Create a destination resource group in the new subscription. This resource group will contain the workspace after the move. The destination must be in the same region as the origin.

    ```azurecli-interactive
    az group create -g destination-rg -l my-region --subscription destination-sub-id                  
    ```

5. The following command demonstrates how to validate the move operation for workspace. You can include associated resources such as storage account, container registry, key vault, and application insights into the move by adding them to the ```resources``` list. The validation may take several minutes. In this command, `origin-rg` is the origin resource group, while `destination-rg` is the destination. The subscription IDs are `origin-sub-id` and `destination-sub-id`, while the workspace is `origin-workspace-name`:

    ```azurecli-interactive
    az resource invoke-action --action validateMoveResources --ids "/subscriptions/origin-sub-id/resourceGroups/origin-rg" --request-body "{  \"resources\": [\"/subscriptions/origin-sub-id/resourceGroups/origin-rg/providers/Microsoft.MachineLearningServices/workspaces/origin-workspace-name\"],\"targetResourceGroup\":\"/subscriptions/destination-sub-id/resourceGroups/destination-rg\" }"
    ```

## Move the workspace

Once the validation has succeeded, move the workspace. You may also include any associated resources into move operation by adding them to the ```ids``` parameter. This operation may take several minutes.

```azurecli-interactive
az resource move --destination-group destination-rg --destination-subscription-id destination-sub-id --ids "/subscriptions/origin-sub-id/resourceGroups/origin-rg/providers/Microsoft.MachineLearningServices/workspaces/origin-workspace-name"
```

After the move has completed, recreate any computes and redeploy any web service endpoints at the new location.

## Scenario: Move a workspace with nondefault datastores

The automated workspace move operation doesn't move nondefault datastores. Use the following steps to manually update the data store credentials after the move.

1. Within [Azure Machine Learning studio](https://ml.azure.com), select __Data__ and then select a nondefault data store. For each nondefault data store, check if the __Subscription ID__ and __Resource group name__ fields are empty. If they are, select __Update authentication__.

    :::image type="content" source="./media/how-to-move-workspace/update-authentication.png" alt-text="Screenshot of the data asset overview." lightbox="./media/how-to-move-workspace/update-authentication.png":::

    In the __Update datastore credentials__ dialog, select the subscription ID and resource group name that the storage account was moved to and then select __Save__.
    
    :::image type="content" source="./media/how-to-move-workspace/update-datastore-credentials.png" alt-text="Screenshot of the update datastore credentials dialog." lightbox="./media/how-to-move-workspace/update-datastore-credentials.png":::

1. If the __Subscription ID__ and __Resource group name__ fields are populated for the nondefault data assets, and refer to the subscription ID and resource group prior to the move, use the following steps:

    1. Navigate to the __Datastores__ tab, select the datastore, and then select __Unregister__.
    
        :::image type="content" source="./media/how-to-move-workspace/unregister-datastore.png" alt-text="Screenshot of the unregister datastore link." lightbox="./media/how-to-move-workspace/unregister-datastore.png":::

    1. Select __Create__ to create a new datastore.
    
        :::image type="content" source="./media/how-to-move-workspace/create-datastore.png" alt-text="Screenshot of the create datastore link." lightbox="./media/how-to-move-workspace/create-datastore.png":::

    1. From the __Create datastore__ dialog, use the same name, type, etc. as the datastore you unregistered. Select the subscription ID and storage account from the new location. Finally, select __Create__ to create the new datastore registration. 
    
        :::image type="content" source="./media/how-to-move-workspace/create-datastore-form.png" alt-text="Screenshot of the create dataset dialog." lightbox="./media/how-to-move-workspace/create-datastore-form.png":::

## Next steps

* Learn about [resource move](../azure-resource-manager/management/move-resource-group-and-subscription.md)
