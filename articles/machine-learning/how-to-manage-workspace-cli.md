---
title: Create workspaces with Azure CLI
titleSuffix: Azure Machine Learning
description: Learn how to use the Azure CLI extension for machine learning to create a new Azure Machine Learning workspace.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.author: deeikele
author: deeikele
ms.reviewer: larryfr
ms.date: 06/16/2023
ms.topic: how-to
ms.custom: devx-track-azurecli, cliv2, event-tier1-build-2022
---

# Manage Azure Machine Learning workspaces using Azure CLI

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]


In this article, you learn how to create and manage Azure Machine Learning workspaces using the Azure CLI. The Azure CLI provides commands for managing Azure resources and is designed to get you working quickly with Azure, with an emphasis on automation. The machine learning extension to the CLI provides commands for working with Azure Machine Learning resources.

You can also manage workspaces the [Azure portal and Python SDK](how-to-manage-workspace.md), [Azure PowerShell](how-to-manage-workspace-powershell.md), or [via the VS Code extension](how-to-setup-vs-code.md).

## Prerequisites

* An **Azure subscription**. If you don't have one, try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/).

* To use the CLI commands in this document from your **local environment**, you need the [Azure CLI](/cli/azure/install-azure-cli).

    If you use the [Azure Cloud Shell](https://azure.microsoft.com//features/cloud-shell/), the CLI is accessed through the browser and lives in the cloud.

## Limitations

[!INCLUDE [register-namespace](includes/machine-learning-register-namespace.md)]

[!INCLUDE [application-insight](includes/machine-learning-application-insight.md)]

### Secure CLI communications

Some of the Azure CLI commands communicate with Azure Resource Manager over the internet. This communication is secured using HTTPS/TLS 1.2.

With the Azure Machine Learning CLI extension v2 ('ml'), all of the commands communicate with the Azure Resource Manager. This includes operational data such as YAML parameters and metadata. If your Azure Machine Learning workspace is public (that is, not behind a virtual network), then there's no extra configuration required. Communications are secured using HTTPS/TLS 1.2.

If your Azure Machine Learning workspace uses a private endpoint and virtual network and you're using CLI v2, choose one of the following configurations to use:

* If you're __OK__ with the CLI v2 communication over the public internet, use the following `--public-network-access` parameter for the `az ml workspace update` command to enable public network access. For example, the following command updates a workspace for public network access:

    ```azurecli
    az ml workspace update --name myworkspace --public-network-access enabled
    ```

* If you are __not OK__ with the CLI v2 communication over the public internet, you can use an Azure Private Link to increase security of the communication. Use the following links to secure communications with Azure Resource Manager by using Azure Private Link.

    1. [Secure your Azure Machine Learning workspace inside a virtual network using a private endpoint](how-to-configure-private-link.md).
    2. [Create a Private Link for managing Azure resources](../azure-resource-manager/management/create-private-link-access-portal.md). 
    3. [Create a private endpoint](../azure-resource-manager/management/create-private-link-access-portal.md#create-private-endpoint) for the Private Link created in the previous step.

    > [!IMPORTANT]
    > To configure the private link for Azure Resource Manager, you must be the _subscription owner_ for the Azure subscription, and an _owner_ or _contributor_ of the root management group. For more information, see [Create a private link for managing Azure resources](../azure-resource-manager/management/create-private-link-access-portal.md).

For more information on CLI v2 communication, see [Install and set up the CLI](how-to-configure-cli.md#secure-communications).

## Connect the CLI to your Azure subscription

> [!IMPORTANT]
> If you are using the Azure Cloud Shell, you can skip this section. The cloud shell automatically authenticates you using the account you log into your Azure subscription.

There are several ways that you can authenticate to your Azure subscription from the CLI. The most simple is to interactively authenticate using a browser. To authenticate interactively, open a command line or terminal and use the following command:

```azurecli-interactive
az login
```

If the CLI can open your default browser, it will do so and load a sign-in page. Otherwise, you need to open a browser and follow the instructions on the command line. The instructions involve browsing to [https://aka.ms/devicelogin](https://aka.ms/devicelogin) and entering an authorization code.

[!INCLUDE [select-subscription](includes/machine-learning-cli-subscription.md)] 

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

When you deploy an Azure Machine Learning workspace, various other services are [required as dependent associated resources](./concept-workspace.md#associated-resources). When you use the CLI to create the workspace, the CLI can either create new associated resources on your behalf or you could attach existing resources.

> [!IMPORTANT]
> When attaching your own storage account, make sure that it meets the following criteria:
>
> * The storage account is _not_ a premium account (Premium_LRS and Premium_GRS)
> * Both Azure Blob and Azure File capabilities enabled
> * Hierarchical Namespace (ADLS Gen 2) is disabled
> These requirements are only for the _default_ storage account used by the workspace.
>
> When attaching Azure container registry, you must have the [admin account](../container-registry/container-registry-authentication.md#admin-account) enabled before it can be used with an Azure Machine Learning workspace.

# [Create with new resources](#tab/createnewresources)

To create a new workspace where the __services are automatically created__, use the following command:

```azurecli-interactive
az ml workspace create -n <workspace-name> -g <resource-group-name>
```

# [Bring existing resources](#tab/bringexistingresources)

To create a new workspace while bringing existing associated resources using the CLI, you'll first have to define how your workspace should be configured in a configuration file.

:::code language="YAML" source="~/azureml-examples-main/cli/resources/workspace/with-existing-resources.yml":::

Then, you can reference this configuration file as part of the workspace creation CLI command.

```azurecli-interactive
az ml workspace create -g <resource-group-name> --file workspace.yml
```

If attaching existing resources, you must provide the ID for the resources. You can get this ID either via the 'properties'  tab on each resource in the Azure portal, or by running the following commands using the Azure CLI.

* **Azure Storage Account**: 
      `az storage account show --name <storage-account-name> --query "id"`
* **Azure Application Insights**: 
      `az monitor app-insights component show --app <application-insight-name> -g <resource-group-name> --query "id"`
* **Azure Key Vault**:
      `az keyvault show --name <key-vault-name> --query "ID"`
* **Azure Container Registry**:
      `az acr show --name <acr-name> -g <resource-group-name> --query "id"`

The Resource ID value looks similar to the following text: `"/subscriptions/<service-GUID>/resourceGroups/<resource-group-name>/providers/<provider>/<subresource>/<resource-name>"`.

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

Dependent on your use case and organizational requirements, you can choose to configure Azure Machine Learning using private network connectivity. You can use the Azure CLI to deploy a workspace and a Private link endpoint for the workspace resource. For more information on using a private endpoint and virtual network (VNet) with your workspace, see [Virtual network isolation and privacy overview](how-to-network-security-overview.md). For complex resource configurations, also refer to template based deployment options including [Azure Resource Manager](how-to-create-workspace-template.md).

When using private link, your workspace can't use Azure Container Registry to build docker images. Hence, you must set the image_build_compute property to a CPU compute cluster name to use for Docker image environment building. You can also specify whether the private link workspace should be accessible over the internet using the public_network_access property.

:::code language="YAML" source="~/azureml-examples-main/cli/resources/workspace/privatelink.yml":::

```azurecli-interactive
az ml workspace create -g <resource-group-name> --file privatelink.yml
```

After creating the workspace, use the [Azure networking CLI commands](/cli/azure/network/private-endpoint#az-network-private-endpoint-create) to create a private link endpoint for the workspace.

```azurecli-interactive
az network private-endpoint create \
    --name <private-endpoint-name> \
    --vnet-name <vnet-name> \
    --subnet <subnet-name> \
    --private-connection-resource-id "/subscriptions/<subscription>/resourceGroups/<resource-group-name>/providers/Microsoft.MachineLearningServices/workspaces/<workspace-name>" \
    --group-id amlworkspace \
    --connection-name workspace -l <location>
```

To create the private DNS zone entries for the workspace, use the following commands:

```azurecli-interactive
# Add privatelink.api.azureml.ms
az network private-dns zone create \
    -g <resource-group-name> \
    --name 'privatelink.api.azureml.ms'

az network private-dns link vnet create \
    -g <resource-group-name> \
    --zone-name 'privatelink.api.azureml.ms' \
    --name <link-name> \
    --virtual-network <vnet-name> \
    --registration-enabled false

az network private-endpoint dns-zone-group create \
    -g <resource-group-name> \
    --endpoint-name <private-endpoint-name> \
    --name myzonegroup \
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
    --virtual-network <vnet-name> \
    --registration-enabled false

az network private-endpoint dns-zone-group add \
    -g <resource-group-name> \
    --endpoint-name <private-endpoint-name> \
    --name myzonegroup \
    --private-dns-zone 'privatelink.notebooks.azure.net' \
    --zone-name 'privatelink.notebooks.azure.net'
```

### Customer-managed key and high business impact workspace

By default, metadata for the workspace is stored in an Azure Cosmos DB instance that Microsoft maintains. This data is encrypted using Microsoft-managed keys. Instead of using the Microsoft-managed key, you can also provide your own key. Doing so creates an extra set of resources in your Azure subscription to store your data.

To learn more about the resources that are created when you bring your own key for encryption, see [Data encryption with Azure Machine Learning](./concept-data-encryption.md#azure-cosmos-db).

Use the `customer_managed_key` parameter and containing `key_vault` and `key_uri` parameters, to specify the resource ID and uri of the key within the vault.

To [limit the data that Microsoft collects](./concept-data-encryption.md#encryption-at-rest) on your workspace, you can additionally specify the `hbi_workspace` property. 

:::code language="YAML" source="~/azureml-examples-main/cli/resources/workspace/cmk.yml":::

Then, you can reference this configuration file as part of the workspace creation CLI command.

```azurecli-interactive
az ml workspace create -g <resource-group-name> --file cmk.yml
```

> [!NOTE]
> Authorize the __Machine Learning App__ (in Identity and Access Management) with contributor permissions on your subscription to manage the data encryption additional resources.

> [!NOTE]
> Azure Cosmos DB is __not__ used to store information such as model performance, information logged by experiments, or information logged from your model deployments.

> [!IMPORTANT]
> Selecting high business impact can only be done when creating a workspace. You cannot change this setting after workspace creation.

For more information on customer-managed keys and high business impact workspace, see [Enterprise security for Azure Machine Learning](concept-data-encryption.md#encryption-at-rest).

## Using the CLI to manage workspaces

### Get workspace information

To get information about a workspace, use the following command:

```azurecli-interactive
az ml workspace show -n <workspace-name> -g <resource-group-name>
```

For more information, see the [az ml workspace show](/cli/azure/ml/workspace#az-ml-workspace-show) documentation.

### Update a workspace

To update a workspace, use the following command:

```azurecli-interactive
az ml workspace update -n <workspace-name> -g <resource-group-name>
```

For more information, see the [az ml workspace update](/cli/azure/ml/workspace#az-ml-workspace-update) documentation.

### Sync keys for dependent resources

If you change access keys for one of the resources used by your workspace, it takes around an hour for the workspace to synchronize to the new key. To force the workspace to sync the new keys immediately, use the following command:

```azurecli-interactive
az ml workspace sync-keys -n <workspace-name> -g <resource-group-name>
```

For more information on changing keys, see [Regenerate storage access keys](how-to-change-storage-access-key.md).

For more information on the sync-keys command, see [az ml workspace sync-keys](/cli/azure/ml/workspace#az-ml-workspace-sync-keys).

### Delete a workspace

[!INCLUDE [machine-learning-delete-workspace](includes/machine-learning-delete-workspace.md)]

To delete a workspace after it's no longer needed, use the following command:

```azurecli-interactive
az ml workspace delete -n <workspace-name> -g <resource-group-name>
```

> [!IMPORTANT]
> Deleting a workspace does not delete the application insight, storage account, key vault, or container registry used by the workspace.

You can also delete the resource group, which deletes the workspace and all other Azure resources in the resource group. To delete the resource group, use the following command:

```azurecli-interactive
az group delete -g <resource-group-name>
```

For more information, see the [az ml workspace delete](/cli/azure/ml/workspace#az-ml-workspace-delete) documentation.

> [!TIP]
> The default behavior for Azure Machine Learning is to _soft delete_ the workspace. This means that the workspace is not immediately deleted, but instead is marked for deletion. For more information, see [Soft delete](./concept-soft-delete.md).

## Troubleshooting

### Resource provider errors

[!INCLUDE [machine-learning-resource-provider](includes/machine-learning-resource-provider.md)]

### Moving the workspace

> [!WARNING]
> Moving your Azure Machine Learning workspace to a different subscription, or moving the owning subscription to a new tenant, is not supported. Doing so may cause errors.

### Deleting the Azure Container Registry

The Azure Machine Learning workspace uses Azure Container Registry (ACR) for some operations. It will automatically create an ACR instance when it first needs one.

[!INCLUDE [machine-learning-delete-acr](includes/machine-learning-delete-acr.md)]

## Next steps

For more information on the Azure CLI extension for machine learning, see the [az ml](/cli/azure/ml) documentation.

To check for problems with your workspace, see [How to use workspace diagnostics](how-to-workspace-diagnostic-api.md).

To learn how to move a workspace to a new Azure subscription, see [How to move a workspace](how-to-move-workspace.md).

For information on how to keep your Azure Machine Learning up to date with the latest security updates, see [Vulnerability management](concept-vulnerability-management.md).
