---
title: Create workspaces with Azure CLI
titleSuffix: Azure Machine Learning
description: Learn how to use the Azure CLI machine learning extension to create and manage Azure Machine Learning workspaces.
services: machine-learning
ms.service: azure-machine-learning
ms.subservice: core
ms.author: larryfr
author: Blackmist
ms.reviewer: deeikele
ms.date: 06/17/2024
ms.topic: how-to
ms.custom: devx-track-azurecli, cliv2
---

# Manage Azure Machine Learning workspaces by using Azure CLI

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

In this article, you learn how to create and manage Azure Machine Learning workspaces by using the Azure CLI. The Azure CLI provides commands for managing Azure resources and is designed to get you working quickly with Azure, with an emphasis on automation. The Azure CLI machine learning extension provides commands for working with Azure Machine Learning resources.

You can also use the following methods to create and manage Azure Machine Learning workspaces:

- [Azure Machine Learning studio](quickstart-create-resources.md#create-the-workspace)
- [Azure portal](how-to-manage-workspace.md)
- [Python SDK](how-to-manage-workspace.md)
- [Azure PowerShell](how-to-manage-workspace-powershell.md)
- [Visual Studio Code with the Azure Machine Learning extension](how-to-setup-vs-code.md)

## Prerequisites

- An Azure subscription with a free or paid version of Azure Machine Learning. If you don't have an Azure subscription, [create a free account before you begin](https://azure.microsoft.com/free/).
- [Azure CLI](/cli/azure/install-azure-cli) installed, if you want to run the Azure CLI commands in this article locally.

  If you run the Azure CLI commands in [Azure Cloud Shell](https://azure.microsoft.com//features/cloud-shell/), you don't need to install anything. The browser accesses the latest cloud version of Azure CLI and the Azure Machine Learning extension.

## Limitations

[!INCLUDE [register-namespace](includes/machine-learning-register-namespace.md)]

## Connect to your Azure subscription

If you use Azure Cloud Shell from the Azure portal, you can skip this section. The cloud shell automatically authenticates you using the Azure subscription you're signed in with.

There are several ways to authenticate locally to your Azure subscription from Azure CLI. The simplest way is by using a browser.

To authenticate interactively, open a command line or terminal and run `az login`. If the CLI can open your default browser, it does so, and loads a sign-in page. Otherwise, follow the command-line instructions to open a browser to [https://aka.ms/devicelogin](https://aka.ms/devicelogin) and enter a device authorization code.

[!INCLUDE [select-subscription](includes/machine-learning-cli-subscription.md)]

For other methods of authenticating, see [Sign in with Azure CLI](/cli/azure/authenticate-azure-cli).

## Create a resource group

The Azure Machine Learning workspace must be created inside an existing or new resource group. To create a new resource group, run the following command. Replace `<resource-group-name>` with the name and `<location>` with the Azure region you want to use for this resource group.

> [!NOTE]
> Make sure to select a region where Azure Machine Learning is available. For information, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=machine-learning-service).

```azurecli-interactive
az group create --name <resource-group-name> --location <azure-region>
```

The response to this command is similar to the following JSON. You can use the output values to locate the created resources or pass them as input to other Azure CLI commands or automation.

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

A deployed Azure Machine Learning workspace requires various other services as [dependent associated resources](./concept-workspace.md#associated-resources). When you use Azure CLI to create a workspace, the CLI can create the new associated resources or you can attach existing resources.

To create a new workspace with new automatically created dependent services, run the following command:

```azurecli-interactive
az ml workspace create -n <workspace-name> -g <resource-group-name>
```

To create a new workspace that uses existing resources, you first define the resources in a YAML configuration file, as described in the following section. Then you reference the YAML file in the Azure CLI workspace creation command as follows:

```azurecli-interactive
az ml workspace create -g <resource-group-name> --file <configuration-file>.yml
```

The output of the workspace creation command is similar to the following JSON. You can use the output values to locate the created resources or pass them as input to other Azure CLI commands.

```json
{
  "applicationInsights": "/subscriptions/<subscription-GUID>/resourcegroups/<resource-group-name>/providers/microsoft.insights/components/<application-insight-name>",
  "containerRegistry": "/subscriptions/<subscription-GUID>/resourcegroups/<resource-group-name>/providers/microsoft.containerregistry/registries/<container-registry-name>",
  "creationTime": "2019-08-30T20:24:19.6984254+00:00",
  "description": "",
  "friendlyName": "<workspace-name>",
  "id": "/subscriptions/<subscription-GUID>/resourceGroups/<resource-group-name>/providers/Microsoft.MachineLearningServices/workspaces/<workspace-id>",
  "identityPrincipalId": "<GUID>",
  "identityTenantId": "<GUID>",
  "identityType": "SystemAssigned",
  "keyVault": "/subscriptions/<subscription-GUID>/resourcegroups/<resource-group-name>/providers/microsoft.keyvault/vaults/<key-vault-name>",
  "location": "<location>",
  "name": "<workspace-name>",
  "resourceGroup": "<resource-group-name>",
  "storageAccount": "/subscriptions/<subscription-GUID>/resourcegroups/<resource-group-name>/providers/microsoft.storage/storageaccounts/<storage-account-name>",
  "type": "Microsoft.MachineLearningServices/workspaces",
  "workspaceid": "<GUID>"
}
```

### YAML configuration file

To use existing resources for a new workspace, you define the resources in a YAML configuration file. The following example shows a YAML workspace configuration file:

:::code language="YAML" source="~/azureml-examples-main/cli/resources/workspace/with-existing-resources.yml":::

You don't have to specify all the associated dependent resources in the configuration file. You can specify one or more of the resources, and let the others be created automatically.

You must provide the IDs for existing resources in the YAML file. You can get these IDs either by viewing the resource **Properties** in the Azure portal, or by running the following Azure CLI commands:

- **Azure Application Insights**:<br>
  `az monitor app-insights component show --app <application-insight-name> -g <resource-group-name> --query "id"`
- **Azure Container Registry**:<br>
  `az acr show --name <container-registry-name> -g <resource-group-name> --query "id"`
- **Azure Key Vault**:<br>
  `az keyvault show --name <key-vault-name> --query "id"`
- **Azure Storage Account**:<br>
  `az storage account show --name <storage-account-name> --query "id"`

The query results look like the following string:<br>
`"/subscriptions/<subscription-GUID>/resourceGroups/<resource-group-name>/providers/<provider>/<subresource>/<id>"`.

### Associated dependent resources

The following considerations and limitations apply to dependent resources associated with workspaces.

#### Application Insights

[!INCLUDE [application-insight](includes/machine-learning-application-insight.md)]

#### Container Registry

The Azure Machine Learning workspace uses Azure Container Registry for some operations, and automatically creates a Container Registry instance when it first needs one.
[!INCLUDE [machine-learning-delete-acr](includes/machine-learning-delete-acr.md)]

To use an existing Azure container registry with an Azure Machine Learning workspace, you must [enable the admin account](/azure/container-registry/container-registry-authentication#admin-account) on the container registry.

#### Storage Account

If you use an existing storage account for the workspace, it must meet the following criteria. These requirements apply to the default storage account only.

- The account can't be Premium_LRS or Premium_GRS.
- Azure Blob and Azure File capabilities must both be enabled.
- Hierarchical namespace must be disabled for Azure Data Lake Storage.

## Secure Azure CLI communications

All Azure Machine Learning V2 `az ml` commands communicate operational data, such as YAML parameters and metadata, to Azure Resource Manager. Some of the Azure CLI commands communicate with Azure Resource Manager over the internet.

If your Azure Machine Learning workspace is public and isn't behind a virtual network, communications are secured by using HTTPS/TLS 1.2. No extra configuration is required.

If your Azure Machine Learning workspace uses a private endpoint and virtual network, you must choose one of the following configurations to use Azure CLI:

- To communicate over the public internet, set the `--public-network-access` parameter to `Enabled`.

- To avoid communicating over the public internet for security reasons, configure Azure Machine Learning to use private network connectivity with an Azure Private Link endpoint, as described in the following section.

### Private network connectivity

Depending on your use case and organizational requirements, you can configure Azure Machine Learning to use private network connectivity. You can use the Azure CLI to deploy a workspace and a Private Link endpoint for the workspace resource.

If you use private link endpoints for both Azure Container Registry and Azure Machine Learning, you can't use Container Registry tasks to build Docker environment images. Instead you must build images by using an Azure Machine Learning compute cluster.

In your YAML workspace configuration file, you must set the `image_build_compute` property to a compute cluster name to use for Docker image environment building. You can also specify that the private link workspace isn't accessible over the internet by setting the `public_network_access` property to `Disabled`.

The following code shows an example workspace configuration file for private network connectivity.

:::code language="YAML" source="~/azureml-examples-main/cli/resources/workspace/privatelink.yml":::

After you create the workspace, use the [Azure networking CLI commands](/cli/azure/network/private-endpoint#az-network-private-endpoint-create) to create a private link endpoint for the workspace.

```azurecli-interactive
az network private-endpoint create \
    --name <private-endpoint-name> \
    --vnet-name <virtual-network-name> \
    --subnet <subnet-name> \
    --private-connection-resource-id "/subscriptions/<subscription>/resourceGroups/<resource-group-name>/providers/Microsoft.MachineLearningServices/workspaces/<workspace-name>" \
    --group-id amlworkspace \
    --connection-name workspace -l <location>
```

To create the private Domain Name System (DNS) zone entries for the workspace, use the following commands:

```azurecli-interactive
# Add privatelink.api.azureml.ms
az network private-dns zone create \
    -g <resource-group-name> \
    --name 'privatelink.api.azureml.ms'

az network private-dns link vnet create \
    -g <resource-group-name> \
    --zone-name 'privatelink.api.azureml.ms' \
    --name <link-name> \
    --virtual-network <virtual-network-name> \
    --registration-enabled false

az network private-endpoint dns-zone-group create \
    -g <resource-group-name> \
    --endpoint-name <private-endpoint-name> \
    --name <zone-group-name> \
    --private-dns-zone 'privatelink.api.azureml.ms' \
    --zone-name 'privatelink.api.azureml.ms'

# Add privatelink.notebooks.azure.net
az network private-dns zone create \
    -g <resource-group-name> \
    --name 'privatelink.notebooks.azure.net'

az network private-dns link vnet create \
    -g <resource-group-name> \
    --zone-name 'privatelink.notebooks.azure.net' \
    --name <link-name> \
    --virtual-network <virtual-network-name> \
    --registration-enabled false

az network private-endpoint dns-zone-group add \
    -g <resource-group-name> \
    --endpoint-name <private-endpoint-name> \
    --name <zone-group-name> \
    --private-dns-zone 'privatelink.notebooks.azure.net' \
    --zone-name 'privatelink.notebooks.azure.net'
```

For more information on using a private endpoint and virtual network with your workspace, see the following articles:

- [Private endpoint configuration for your Azure Machine Learning workspace](how-to-configure-private-link.md)
- [Virtual network isolation and privacy overview](how-to-network-security-overview.md)

### Resource management private links

You can use the following process to secure communications with all Azure Resource Manager resources in an Azure management group by using Private Link:

1. [Create a private link for managing Azure resources](/azure/azure-resource-manager/management/create-private-link-access-portal). 
1. [Create a private endpoint](/azure/azure-resource-manager/management/create-private-link-access-portal#create-private-endpoint) for the private link created in the previous step.

> [!IMPORTANT]
> To configure a private link for Azure Resource Manager, you must be the **Owner** of the Azure subscription, and an **Owner** or **Contributor** on the root management group. For more information, see [Create a private link for managing Azure resources](/azure/azure-resource-manager/management/create-private-link-access-portal).

## Advanced configurations

There are several other advanced configurations you can apply to workspaces. For complex resource configurations, also refer to template based deployment options including [Azure Resource Manager](how-to-create-workspace-template.md).

<a name="customer-managed-key-and-high-business-impact-workspace"></a>
### Customer-managed keys

By default, workspace metadata is stored in an Azure Cosmos DB instance that Microsoft maintains, and encrypted using Microsoft-managed keys. Instead of using the Microsoft-managed key, you can provide your own key. Using your own key creates an extra set of resources in your Azure subscription to store your data.

> [!NOTE]
> Azure Cosmos DB isn't used to store model performance information, information logged by experiments, or information logged from your model deployments.

To create a workspace that uses your own key, use the `customer_managed_key` parameter in the YAML workspace configuration file, and specify the resource ID of the containing `key_vault` and the `key_uri` of the key within the vault.

:::code language="YAML" source="~/azureml-examples-main/cli/resources/workspace/cmk.yml":::

To learn more about the resources that are created when you use your own key for encryption, see [Data encryption with Azure Machine Learning](./concept-data-encryption.md#azure-cosmos-db).

> [!NOTE]
> To manage the added data encryption resources, use Identity and Access Management to authorize the Machine Learning App with **Contributor** permissions on your subscription.

### High business impact workspaces

To [limit the data that Microsoft collects](./concept-data-encryption.md#encryption-at-rest) on your workspace, you can specify a high business impact workspace by setting the `hbi_workspace` property in the YAML configuration file to `TRUE`. You can set high business impact only when you create a workspace. You can't change this setting after workspace creation.

For more information on customer-managed keys and high business impact workspace, see [Enterprise security for Azure Machine Learning](concept-data-encryption.md#encryption-at-rest).

## Use Azure CLI to manage workspaces

You can use the [az ml workspace](/cli/azure/ml/workspace) commands to manage workspaces.

### Get workspace information

To get information about a workspace, use the following command:

```azurecli-interactive
az ml workspace show -n <workspace-name> -g <resource-group-name>
```

For more information, see [az ml workspace show](/cli/azure/ml/workspace#az-ml-workspace-show).

### Update a workspace

To update a workspace, use the following command:

```azurecli-interactive
az ml workspace update -n <workspace-name> -g <resource-group-name>
```

For example, the following command updates a workspace to enable public network access:

```azurecli
az ml workspace update -n <workspace-name> -g <resource-group-name> --public-network-access enabled
```

For more information, see [az ml workspace update](/cli/azure/ml/workspace#az-ml-workspace-update).

### Sync keys for dependent resources

If you change access keys for one of the resources your workspace uses, it takes about an hour for the workspace to synchronize to the new keys. To force the workspace to sync the new keys immediately, use the following command:

```azurecli-interactive
az ml workspace sync-keys -n <workspace-name> -g <resource-group-name>
```

- For more information on the `sync-keys` command, see [az ml workspace sync-keys](/cli/azure/ml/workspace#az-ml-workspace-sync-keys).
- For more information on changing keys, see [Regenerate storage access keys](how-to-change-storage-access-key.md).

### Move a workspace

Moving an Azure Machine Learning workspace is currently in preview. For more information, see [Move Azure Machine Learning workspaces between subscriptions (preview)](how-to-move-workspace.md).

### Delete a workspace

To delete a workspace after it's no longer needed, use the following command:

```azurecli-interactive
az ml workspace delete -n <workspace-name> -g <resource-group-name>
```

The default behavior for Azure Machine Learning is to *soft-delete* the workspace. The workspace isn't immediately deleted, but instead is marked for deletion. For more information, see [Soft delete](./concept-soft-delete.md).

[!INCLUDE [machine-learning-delete-workspace](includes/machine-learning-delete-workspace.md)]

Deleting a workspace doesn't delete the application insights, storage account, key vault, or container registry used by the workspace. To delete the workspace, the dependent resources, and all other Azure resources in the resource group, you can delete the resource group. To delete the resource group, use the following command:

```azurecli-interactive
az group delete -g <resource-group-name>
```

For more information, see [az ml workspace delete](/cli/azure/ml/workspace#az-ml-workspace-delete).

## Troubleshoot resource provider errors

[!INCLUDE [machine-learning-resource-provider](includes/machine-learning-resource-provider.md)]

## Related resources

- For more information about the Azure CLI extension for machine learning, see the [az ml](/cli/azure/ml) documentation.
- For information about diagnostics that can identify and help resolve workspace problems, see [How to use workspace diagnostics](how-to-workspace-diagnostic-api.md).
- For information on how to keep your Azure Machine Learning up to date with the latest security updates, see [Vulnerability management](concept-vulnerability-management.md).
