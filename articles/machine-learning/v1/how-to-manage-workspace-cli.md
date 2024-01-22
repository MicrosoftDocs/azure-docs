---
title: Create workspaces with Azure CLI extension v1
titleSuffix: Azure Machine Learning
description: Learn how to use the Azure CLI extension v1 for machine learning to create a new Azure Machine Learning workspace.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.author: deeikele
author: deeikele
ms.reviewer: larryfr
ms.date: 08/12/2022
ms.topic: how-to
ms.custom: UpdateFrequency5, devx-track-azurecli, cliv1, event-tier1-build-2022
---

# Manage Azure Machine Learning workspaces using Azure CLI extension v1

[!INCLUDE [cli v1](../includes/machine-learning-cli-v1.md)]


[!INCLUDE [cli-version-info](../includes/machine-learning-cli-v1-deprecation.md)]

In this article, you learn how to create and manage Azure Machine Learning workspaces using the Azure CLI. The Azure CLI provides commands for managing Azure resources and is designed to get you working quickly with Azure, with an emphasis on automation. The machine learning extension for the CLI provides commands for working with Azure Machine Learning resources.

## Prerequisites

* An **Azure subscription**. If you don't have one, try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/).

* To use the CLI commands in this document from your **local environment**, you need the [Azure CLI](/cli/azure/install-azure-cli).

    If you use the [Azure Cloud Shell](https://azure.microsoft.com//features/cloud-shell/), the CLI is accessed through the browser and lives in the cloud.

## Limitations

[!INCLUDE [register-namespace](../includes/machine-learning-register-namespace.md)]

[!INCLUDE [application-insight](../includes/machine-learning-application-insight.md)]

### Secure CLI communications

Some of the Azure CLI commands communicate with Azure Resource Manager over the internet. This communication is secured using HTTPS/TLS 1.2.

With the Azure Machine Learning CLI extension v1 (`azure-cli-ml`), only some of the commands communicate with the Azure Resource Manager. Specifically, commands that create, update, delete, list, or show Azure resources. Operations such as submitting a training job communicate directly with the Azure Machine Learning workspace. **If your workspace is [secured with a private endpoint](../how-to-configure-private-link.md), that is enough to secure commands provided by the `azure-cli-ml` extension**.


## Connect the CLI to your Azure subscription

> [!IMPORTANT]
> If you are using the Azure Cloud Shell, you can skip this section. The cloud shell automatically authenticates you using the account you log into your Azure subscription.

There are several ways that you can authenticate to your Azure subscription from the CLI. The most simple is to interactively authenticate using a browser. To authenticate interactively, open a command line or terminal and use the following command:

```azurecli-interactive
az login
```

If the CLI can open your default browser, it will do so and load a sign-in page. Otherwise, you need to open a browser and follow the instructions on the command line. The instructions involve browsing to [https://aka.ms/devicelogin](https://aka.ms/devicelogin) and entering an authorization code.

[!INCLUDE [select-subscription](../includes/machine-learning-cli-subscription.md)] 

For other methods of authenticating, see [Sign in with Azure CLI](/cli/azure/authenticate-azure-cli).

## Create a resource group

The Azure Machine Learning workspace must be created inside a resource group. You can use an existing resource group or create a new one. To __create a new resource group__, use the following command. Replace `<resource-group-name>` with the name to use for this resource group. Replace `<location>` with the Azure region to use for this resource group:

> [!NOTE]
> You should select a region where Azure Machine Learning is available. For information, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=machine-learning-service).

```azurecli-interactive
az group create --name <resource-group-name> --location <location>
```

The response from this command is similar to the following JSON. You can use the output values to locate the created resources or parse them as input to subsequent CLI steps for automation.

```json
{
  "id": "/subscriptions/<subscription-GUID>/resourceGroups/<resourcegroupname>",
  "location": "<location>",
  "managedBy": null,
  "name": "<resource-group-name>",
  "properties": {
    "provisioningState": "Succeeded"
  },
  "tags": null,
  "type": null
}
```

For more information on working with resource groups, see [az group](/cli/azure/group).

## Create a workspace

When you deploy an Azure Machine Learning workspace, various other services are [required as dependent associated resources](../concept-workspace.md#associated-resources). When you use the CLI to create the workspace, the CLI can either create new associated resources on your behalf or you could attach existing resources.

> [!IMPORTANT]
> When attaching your own storage account, make sure that it meets the following criteria:
>
> * The storage account is _not_ a premium account (Premium_LRS and Premium_GRS)
> * Both Azure Blob and Azure File capabilities enabled
> * Hierarchical Namespace (ADLS Gen 2) is disabled
> These requirements are only for the _default_ storage account used by the workspace.
>
> When attaching Azure container registry, you must have the [admin account](../../container-registry/container-registry-authentication.md#admin-account) enabled before it can be used with an Azure Machine Learning workspace.

# [Create with new resources](#tab/createnewresources)

To create a new workspace where the __services are automatically created__, use the following command:

```azurecli-interactive
az ml workspace create -w <workspace-name> -g <resource-group-name>
```

# [Bring existing resources](#tab/bringexistingresources1)

To create a workspace that uses existing resources, you must provide the resource ID for each resource. You can get this ID either via the 'properties' tab on each resource via the Azure portal, or by running the following commands using the Azure CLI.

  * **Azure Storage Account**: 
        `az storage account show --name <storage-account-name> --query "id"`
  * **Azure Application Insights**: 
        `az monitor app-insights component show --app <application-insight-name> -g <resource-group-name> --query "id"`
  * **Azure Key Vault**:
        `az keyvault show --name <key-vault-name> --query "ID"`
  * **Azure Container Registry**:
        `az acr show --name <acr-name> -g <resource-group-name> --query "id"`

  The returned resource ID has the following format: `"/subscriptions/<service-GUID>/resourceGroups/<resource-group-name>/providers/<provider>/<subresource>/<resource-name>"`.

Once you have the IDs for the resource(s) that you want to use with the workspace, use the base `az workspace create -w <workspace-name> -g <resource-group-name>` command and add the parameter(s) and ID(s) for the existing resources. For example, the following command creates a workspace that uses an existing container registry:

```azurecli-interactive
az ml workspace create -w <workspace-name>
                       -g <resource-group-name>
                       --container-registry "/subscriptions/<service-GUID>/resourceGroups/<resource-group-name>/providers/Microsoft.ContainerRegistry/registries/<acr-name>"
```

---

> [!IMPORTANT]
> When you attaching existing resources, you don't have to specify all. You can specify one or more. For example, you can specify an existing storage account and the workspace will create the other resources.

The output of the workspace creation command is similar to the following JSON. You can use the output values to locate the created resources or parse them as input to subsequent CLI steps.

```json
{
  "applicationInsights": "/subscriptions/<service-GUID>/resourcegroups/<resource-group-name>/providers/microsoft.insights/components/<application-insight-name>",
  "containerRegistry": "/subscriptions/<service-GUID>/resourcegroups/<resource-group-name>/providers/microsoft.containerregistry/registries/<acr-name>",
  "creationTime": "2019-08-30T20:24:19.6984254+00:00",
  "description": "",
  "friendlyName": "<workspace-name>",
  "id": "/subscriptions/<service-GUID>/resourceGroups/<resource-group-name>/providers/Microsoft.MachineLearningServices/workspaces/<workspace-name>",
  "identityPrincipalId": "<GUID>",
  "identityTenantId": "<GUID>",
  "identityType": "SystemAssigned",
  "keyVault": "/subscriptions/<service-GUID>/resourcegroups/<resource-group-name>/providers/microsoft.keyvault/vaults/<key-vault-name>",
  "location": "<location>",
  "name": "<workspace-name>",
  "resourceGroup": "<resource-group-name>",
  "storageAccount": "/subscriptions/<service-GUID>/resourcegroups/<resource-group-name>/providers/microsoft.storage/storageaccounts/<storage-account-name>",
  "type": "Microsoft.MachineLearningServices/workspaces",
  "workspaceid": "<GUID>"
}

```

## Advanced configurations
### Configure workspace for private network connectivity

Dependent on your use case and organizational requirements, you can choose to configure Azure Machine Learning using private network connectivity. You can use the Azure CLI to deploy a workspace and a Private link endpoint for the workspace resource. For more information on using a private endpoint and virtual network (VNet) with your workspace, see [Virtual network isolation and privacy overview](../how-to-network-security-overview.md). For complex resource configurations, also refer to template based deployment options including [Azure Resource Manager](../how-to-create-workspace-template.md).

If you want to restrict workspace access to a virtual network, you can use the following parameters as part of the `az ml workspace create` command or use the `az ml workspace private-endpoint` commands.

```azurecli-interactive
az ml workspace create -w <workspace-name>
                       -g <resource-group-name>
                       --pe-name "<pe name>"
                       --pe-auto-approval "<pe-autoapproval>"
                       --pe-resource-group "<pe name>"
                       --pe-vnet-name "<pe name>"
                       --pe-subnet-name "<pe name>"
```

* `--pe-name`: The name of the private endpoint that is created.
* `--pe-auto-approval`: Whether private endpoint connections to the workspace should be automatically approved.
* `--pe-resource-group`: The resource group to create the private endpoint in. Must be the same group that contains the virtual network.
* `--pe-vnet-name`: The existing virtual network to create the private endpoint in.
* `--pe-subnet-name`: The name of the subnet to create the private endpoint in. The default value is `default`.

For more information on how to use these commands, see the [CLI reference pages](/cli/azure/ml(v1)/workspace).

### Customer-managed key and high business impact workspace

By default, metadata for the workspace is stored in an Azure Cosmos DB instance that Microsoft maintains. This data is encrypted using Microsoft-managed keys. Instead of using the Microsoft-managed key, you can also provide your own key. Doing so creates an extra set of resources in your Azure subscription to store your data.

To learn more about the resources that are created when you bring your own key for encryption, see [Data encryption with Azure Machine Learning](../concept-data-encryption.md#azure-cosmos-db).

Use the `--cmk-keyvault` parameter to specify the Azure Key Vault that contains the key, and `--resource-cmk-uri` to specify the resource ID and uri of the key within the vault.

To [limit the data that Microsoft collects](../concept-data-encryption.md#encryption-at-rest) on your workspace, you can additionally specify the `--hbi-workspace` parameter. 

```azurecli-interactive
az ml workspace create -w <workspace-name>
                       -g <resource-group-name>
                       --cmk-keyvault "<cmk keyvault name>"
                       --resource-cmk-uri "<resource cmk uri>"
                       --hbi-workspace
```

> [!NOTE]
> Authorize the __Machine Learning App__ (in Identity and Access Management) with contributor permissions on your subscription to manage the data encryption additional resources.

> [!NOTE]
> Azure Cosmos DB is __not__ used to store information such as model performance, information logged by experiments, or information logged from your model deployments. For more information on monitoring these items, see the [Monitoring and logging](concept-azure-machine-learning-architecture.md) section of the architecture and concepts article.

> [!IMPORTANT]
> Selecting high business impact can only be done when creating a workspace. You cannot change this setting after workspace creation.

For more information on customer-managed keys and high business impact workspace, see [Enterprise security for Azure Machine Learning](../concept-data-encryption.md#encryption-at-rest).

## Using the CLI to manage workspaces

### Get workspace information

To get information about a workspace, use the following command:

```azurecli-interactive
az ml workspace show -w <workspace-name> -g <resource-group-name>
```

### Update a workspace

To update a workspace, use the following command:

```azurecli-interactive
az ml workspace update -n <workspace-name> -g <resource-group-name>
```

### Sync keys for dependent resources

If you change access keys for one of the resources used by your workspace, it takes around an hour for the workspace to synchronize to the new key. To force the workspace to sync the new keys immediately, use the following command:

```azurecli-interactive
az ml workspace sync-keys -w <workspace-name> -g <resource-group-name>
```

For more information on changing keys, see [Regenerate storage access keys](../how-to-change-storage-access-key.md).

### Delete a workspace

[!INCLUDE [machine-learning-delete-workspace](../includes/machine-learning-delete-workspace.md)]

To delete a workspace after it's no longer needed, use the following command:

```azurecli-interactive
az ml workspace delete -w <workspace-name> -g <resource-group-name>
```

> [!IMPORTANT]
> Deleting a workspace does not delete the application insight, storage account, key vault, or container registry used by the workspace.

You can also delete the resource group, which deletes the workspace and all other Azure resources in the resource group. To delete the resource group, use the following command:

```azurecli-interactive
az group delete -g <resource-group-name>
```

> [!TIP]
> The default behavior for Azure Machine Learning is to _soft delete_ the workspace. This means that the workspace is not immediately deleted, but instead is marked for deletion. For more information, see [Soft delete](../concept-soft-delete.md).

## Troubleshooting

### Resource provider errors

[!INCLUDE [machine-learning-resource-provider](../includes/machine-learning-resource-provider.md)]

### Moving the workspace

> [!WARNING]
> Moving your Azure Machine Learning workspace to a different subscription, or moving the owning subscription to a new tenant, is not supported. Doing so may cause errors.

### Deleting the Azure Container Registry

The Azure Machine Learning workspace uses Azure Container Registry (ACR) for some operations. It will automatically create an ACR instance when it first needs one.

[!INCLUDE [machine-learning-delete-acr](../includes/machine-learning-delete-acr.md)]

## Next steps

For more information on the Azure CLI extension for machine learning, see the [az ml](/cli/azure/ml(v1)) (v1) documentation.

To check for problems with your workspace, see [How to use workspace diagnostics](../how-to-workspace-diagnostic-api.md).

To learn how to move a workspace to a new Azure subscription, see [How to move a workspace](../how-to-move-workspace.md).

For information on how to keep your Azure Machine Learning up to date with the latest security updates, see [Vulnerability management](../concept-vulnerability-management.md).