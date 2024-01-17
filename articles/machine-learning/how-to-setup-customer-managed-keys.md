---
title: Use customer-managed keys
titleSuffix: Azure Machine Learning
description: 'Learn how to improve data security with Azure Machine Learning by using customer-managed keys.'
services: machine-learning
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.custom:
  - event-tier1-build-2022
  - ignite-2022
  - engagement-fy23
  - ignite-2023
ms.topic: conceptual
ms.author: jhirono
author: jhirono
ms.reviewer: larryfr
ms.date: 09/12/2023
monikerRange: 'azureml-api-2 || azureml-api-1'
---
# Use customer-managed keys with Azure Machine Learning

In the [customer-managed keys concepts article](concept-customer-managed-keys.md), you learned about the encryption capabilities that Azure Machine Learning provides. Now learn how to use customer-managed keys with Azure Machine Learning.

[!INCLUDE [machine-learning-customer-managed-keys.md](includes/machine-learning-customer-managed-keys.md)]

## Prerequisites

* An Azure subscription.

* The following Azure resource providers must be registered:

    | Resource provider | Why it's needed |
    | ----- | ----- |
    | Microsoft.MachineLearningServices | Creating the Azure Machine Learning workspace.
    | Microsoft.Storage    Azure | Storage Account is used as the default storage for the workspace.
    | Microsoft.KeyVault |Azure Key Vault is used by the workspace to store secrets.
    | Microsoft.DocumentDB/databaseAccounts | Azure Cosmos DB instance that logs metadata for the workspace.
    | Microsoft.Search | Azure AI Search provides indexing capabilities for the workspace.

    For information on registering resource providers, see [Resolve errors for resource provider registration](/azure/azure-resource-manager/templates/error-register-resource-provider).


## Limitations

* The customer-managed key for resources the workspace depends on can't be updated after workspace creation.
* Resources managed by Microsoft in your subscription can't transfer ownership to you.
* You can't delete Microsoft-managed resources used for customer-managed keys without also deleting your workspace.
* The key vault that contains your customer-managed key must be in the same Azure subscription as the Azure Machine Learning workspace.
* OS disk of machine learning compute can't be encrypted with customer-managed key, but can be encrypted with Microsoft-managed key if the workspace is created with `hbi_workspace` parameter set to `TRUE`. For more details, see [Data encryption](concept-data-encryption.md#machine-learning-compute).

> [!IMPORTANT]
> When using a customer-managed key, the costs for your subscription will be higher because of the additional resources in your subscription. To estimate the cost, use the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/).

## Create Azure Key Vault

To create the key vault, see [Create a key vault](../key-vault/general/quick-create-portal.md). When creating Azure Key Vault, you must enable __soft delete__ and __purge protection__.

> [!IMPORTANT]
> The key vault must be in the same Azure subscription that will contain your Azure Machine Learning workspace.

### Create a key

> [!TIP]
> If you have problems creating the key, it may be caused by Azure role-based access controls that have been applied in your subscription. Make sure that the security principal (user, managed identity, service principal, etc.) you are using to create the key has been assigned the __Contributor__ role for the key vault instance. You must also configure an __Access policy__ in key vault that grants the security principal __Create__, __Get__, __Delete__, and __Purge__ authorization.
>
> If you plan to use a user-assigned managed identity for your workspace, the managed identity must also be assigned these roles and access policies.
>
> For more information, see the following articles:
> * [Provide access to key vault keys, certificates, and secrets](../key-vault/general/rbac-guide.md)
> * [Assign a key vault access policy](../key-vault/general/assign-access-policy.md)
> * [Use managed identities with Azure Machine Learning](how-to-identity-based-service-authentication.md)

1. From the [Azure portal](https://portal.azure.com), select the key vault instance. Then select __Keys__ from the left.
1. Select __+ Generate/import__ from the top of the page. Use the following values to create a key:

    * Set __Options__ to __Generate__.
    * Enter a __Name__ for the key. The name should be something that identifies what the planned use is. For example, `my-cosmos-key`.
    * Set __Key type__ to __RSA__.
    * We recommend selecting at least __3072__ for the __RSA key size__.
    * Leave __Enabled__ set to yes.

    Optionally you can set an activation date, expiration date, and tags.

1. Select __Create__ to create the key.

### Allow Azure Cosmos DB to access the key

1. To configure the key vault, select it in the [Azure portal](https://portal.azure.com) and then select __Access polices__ from the left menu.
1. To create permissions for Azure Cosmos DB, select __+ Create__ at the top of the page. Under __Key permissions__, select __Get__, __Unwrap Key__, and __Wrap key__ permissions.
1. Under __Principal__, search for __Azure Cosmos DB__ and then select it. The principal ID for this entry is `a232010e-820c-4083-83bb-3ace5fc29d0b` for all regions other than Azure Government. For Azure Government, the principal ID is `57506a73-e302-42a9-b869-6f12d9ec29e9`.
1. Select __Review + Create__, and then select __Create__.

## Create a workspace that uses a customer-managed key

Create an Azure Machine Learning workspace. When creating the workspace, you must select the __Azure Key Vault__ and the __key__. Depending on how you create the workspace, you specify these resources in different ways:

> [!WARNING]
> The key vault that contains your customer-managed key must be in the same Azure subscription as the workspace.

* __Azure portal__: Select the key vault and key from a dropdown input box when configuring the workspace.
* __SDK, REST API, and Azure Resource Manager templates__: Provide the Azure Resource Manager ID of the key vault and the URL for the key. To get these values, use the [Azure CLI](/cli/azure/install-azure-cli) and the following commands:

    ```azurecli
    # Replace `mykv` with your key vault name.
    # Replace `mykey` with the name of your key.

    # Get the Azure Resource Manager ID of the key vault
    az keyvault show --name mykv --query id
    # Get the URL for the key
    az keyvault key show --vault-name mykv -n mykey --query key.kid
    ```

    The key vault ID value will be similar to `/subscriptions/{GUID}/resourceGroups/{resource-group-name}/providers/Microsoft.KeyVault/vaults/mykv`. The URL for the key will be similar to `https://mykv.vault.azure.net/keys/mykey/{GUID}`.

For examples of creating the workspace with a customer-managed key, see the following articles:

| Creation method | Article |
| ----- | ----- |
| CLI | [Create a workspace with Azure CLI](how-to-manage-workspace-cli.md#customer-managed-key-and-high-business-impact-workspace) |
| Azure portal/</br>Python SDK | [Create and manage a workspace](how-to-manage-workspace.md#use-your-own-data-encryption-key) |
| Azure Resource Manager</br>template | [Create a workspace with a template](how-to-create-workspace-template.md#deploy-an-encrypted-workspace) |
| REST API | [Create, run, and delete Azure Machine Learning resources with REST](how-to-manage-rest.md#create-a-workspace-using-customer-managed-encryption-keys) |

Once the workspace has been created, you'll notice that Azure resource group is created in your subscription. This group is in addition to the resource group for your workspace. This resource group will contain the Microsoft-managed resources that your key is used with. The resource group will be named using the formula of `<Azure Machine Learning workspace resource group name><GUID>`. It will contain an Azure Cosmos DB instance, Azure Storage Account, and Azure AI Search.

> [!TIP]
> * The [__Request Units__](../cosmos-db/request-units.md) for the Azure Cosmos DB instance automatically scale as needed.
> * If your Azure Machine Learning workspace uses a private endpoint, this resource group will also contain a Microsoft-managed Azure Virtual Network. This VNet is used to secure communications between the managed services and the workspace. You __cannot provide your own VNet for use with the Microsoft-managed resources__. You also __cannot modify the virtual network__. For example, you cannot change the IP address range that it uses.

> [!IMPORTANT]
> If your subscription does not have enough quota for these services, a failure will occur.

> [!WARNING]
> __Don't delete the resource group__ that contains this Azure Cosmos DB instance, or any of the resources automatically created in this group. If you need to delete the resource group or Microsoft-managed services in it, you must delete the Azure Machine Learning workspace that uses it. The resource group resources are deleted when the associated workspace is deleted.

For more information on customer-managed keys with Azure Cosmos DB, see [Configure customer-managed keys for your Azure Cosmos DB account](../cosmos-db/how-to-setup-cmk.md).

:::moniker range="azureml-api-1"
### Azure Container Instance

> [!IMPORTANT]
> Deploying to Azure Container Instances is not available in SDK or CLI v2. Only through SDK & CLI v1.

When __deploying__ a trained model to an Azure Container instance (ACI), you can encrypt the deployed resource using a customer-managed key. For information on generating a key, see [Encrypt data with a customer-managed key](../container-instances/container-instances-encrypt-data.md#generate-a-new-key).

To use the key when deploying a model to Azure Container Instance, create a new deployment configuration using `AciWebservice.deploy_configuration()`. Provide the key information using the following parameters:

* `cmk_vault_base_url`: The URL of the key vault that contains the key.
* `cmk_key_name`: The name of the key.
* `cmk_key_version`: The version of the key.

For more information on creating and using a deployment configuration, see the following articles:

* [AciWebservice.deploy_configuration()](/python/api/azureml-core/azureml.core.webservice.aci.aciwebservice#deploy-configuration-cpu-cores-none--memory-gb-none--tags-none--properties-none--description-none--location-none--auth-enabled-none--ssl-enabled-none--enable-app-insights-none--ssl-cert-pem-file-none--ssl-key-pem-file-none--ssl-cname-none--dns-name-label-none--primary-key-none--secondary-key-none--collect-model-data-none--cmk-vault-base-url-none--cmk-key-name-none--cmk-key-version-none-)
* [Deploy a model to Azure Container Instances (SDK/CLI v1)](v1/how-to-deploy-azure-container-instance.md)

    For more information on using a customer-managed key with ACI, see [Encrypt deployment data](../container-instances/container-instances-encrypt-data.md).
:::moniker-end
### Azure Kubernetes Service

You may encrypt a deployed Azure Kubernetes Service resource using customer-managed keys at any time. For more information, see [Bring your own keys with Azure Kubernetes Service](../aks/azure-disk-customer-managed-keys.md). 

This process allows you to encrypt both the Data and the OS Disk of the deployed virtual machines in the Kubernetes cluster.

> [!IMPORTANT]
> This process only works with AKS K8s version 1.17 or higher.

## Next steps

* [Customer-managed keys with Azure Machine Learning](concept-customer-managed-keys.md)
* [Create a workspace with Azure CLI](how-to-manage-workspace-cli.md#customer-managed-key-and-high-business-impact-workspace) |
* [Create and manage a workspace](how-to-manage-workspace.md#use-your-own-data-encryption-key) |
* [Create a workspace with a template](how-to-create-workspace-template.md#deploy-an-encrypted-workspace) |
* [Create, run, and delete Azure Machine Learning resources with REST](how-to-manage-rest.md#create-a-workspace-using-customer-managed-encryption-keys) |
