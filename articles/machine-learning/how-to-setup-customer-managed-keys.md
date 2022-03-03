---
title: Use customer-managed keys
titleSuffix: Azure Machine Learning
description: 'Learn how to improve data security with Azure Machine Learning by using customer-managed keys.'
services: machine-learning
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.topic: conceptual
ms.author: jhirono
author: jhirono
ms.reviewer: larryfr
ms.date: 03/03/2022
---
# Use customer-managed keys with Azure Machine Learning

In the [customer-managed keys concepts article](concept-customer-managed-keys.md), you learned about the encryption capabilities that Azure Machine Learning provides. Now learn how to use customer-managed keys with Azure Machine Learning.

Customer-managed keys are used with the following services that Azure Machine Learning relies on:

| Service | What it’s used for |
| ----- | ----- |
| Azure Cosmos DB | Stores metadata for Azure Machine Learning |
| Azure Cognitive Search | Stores workspace metadata for Azure Machine Learning |
| Azure Storage Account | Stores workspace metadata for Azure Machine Learning | 
| Azure Container Instance | Hosting trained models as inference endpoints |
| Azure Kubernetes Service | Hosting trained models as inference endpoints |

> [!TIP]
> While it may be possible to use the same key for everything, using a different key for each service or instance allows you to rotate or revoke the keys without impacting multiple services.

> [!NOTE]
> To use a customer-managed key with Azure Cosmos DB, Search or Storage Account, the key is provided when you create your workspace. The key(s) used with Azure Container Instance and Kubernetes Service are provided separately when configuring those resources.

## Prerequisites

* An Azure subscription.

* The following Azure resource providers must be registered:

    | Resource provider | Why it's needed |
    | ----- | ----- |
    | Microsoft.MachineLearningServices | Creating the Azure Machine Learning workspace.
    | Microsoft.Storage	Azure | Storage Account is used as the default storage for the workspace.
    | Microsoft.KeyVault |Azure Key Vault is used by the workspace to store secrets.
    | Microsoft.DocumentDB/databaseAccounts | Azure CosmosDB instance that logs metadata for the workspace.
    | Microsoft.Search/searchServices | Azure Search provides indexing capabilities for the workspace.

    For information on registering resource providers, see [Resolve errors for resource provider registration](/azure/azure-resource-manager/templates/error-register-resource-provider).

## Limitations

* The customer-managed key for resources the workspace depends on can’t be updated after workspace creation.
* Resources managed by Microsoft in your subscription can’t transfer ownership to you.
* You can't delete Microsoft-managed resources used for customer-managed keys without also deleting your workspace.

## Create Azure Key Vault

For the steps to create the key vault, see [Create a key vault](/azure/key-vault/general/quick-create-portal). When creating Azure Key Vault, you must enable __soft delete__ and __purge protection__.

### Create a key

1. From the [Azure portal](https://portal.azure.com), select the key vault instance. Then select __Keys__ from the left.
1. Select __+ Generate/import__ from the top of the page. Use the following values to create a key:

    * Set __Options__ to __Generate__.
    * Enter a __Name__ for the key. The name should be something that you identifies what the planned use is. For example, `my-cosmos-key`.
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

Once the workspace has been created, you will notice that Azure resource group is created in your subscription. This is in addition to the resource group for your workspace. This resource group will contain the Microsoft-managed resources that your key is used with. The resource group will be named using the formula of `<Azure Machine Learning workspace resource group name><GUID>`. It will contain an Azure Cosmos DB instance, Azure Storage Account, and Azure Cognitive Search.

> [!TIP]
> * The [__Request Units__](/azure/cosmos-db/request-units) for the Azure Cosmos DB instance automatically scale as needed.
> * If your Azure Machine Learning workspace uses a private endpoint, this resource group will also contain a Microsoft-managed Azure Virtual Network. This VNet is used to secure communications between the managed services and the workspace. You __cannot provide your own VNet for use with the Microsoft-managed resources__. You also __cannot modify the virtual network__. For example, you cannot change the IP address range that it uses.

> [!IMPORTANT]
> If your subscription does not have enough quota for these services, a failure will occur.

> [!WARNING]
> __Don't delete the resource group__ that contains this Azure Cosmos DB instance, or any of the resources automatically created in this group. If you need to delete the resource group or Microsoft-managed services in it, you must delete the Azure Machine Learning workspace that uses it. The resource group resources are deleted when the associated workspace is deleted.

For more information on customer-managed keys with Cosmos DB, see [Configure customer-managed keys for your Azure Cosmos DB account](../cosmos-db/how-to-setup-cmk.md).

### Azure Container Instance

When __deploying__ a trained model to an Azure Container instance (ACI), you can encrypt the deployed resource using a customer-managed key. For information on generating a key, see [Encrypt data with a customer-managed key](../container-instances/container-instances-encrypt-data.md#generate-a-new-key).

To use the key when deploying a model to Azure Container Instance, create a new deployment configuration using `AciWebservice.deploy_configuration()`. Provide the key information using the following parameters:

* `cmk_vault_base_url`: The URL of the key vault that contains the key.
* `cmk_key_name`: The name of the key.
* `cmk_key_version`: The version of the key.

For more information on creating and using a deployment configuration, see the following articles:

* [AciWebservice.deploy_configuration()](/python/api/azureml-core/azureml.core.webservice.aci.aciwebservice#deploy-configuration-cpu-cores-none--memory-gb-none--tags-none--properties-none--description-none--location-none--auth-enabled-none--ssl-enabled-none--enable-app-insights-none--ssl-cert-pem-file-none--ssl-key-pem-file-none--ssl-cname-none--dns-name-label-none--primary-key-none--secondary-key-none--collect-model-data-none--cmk-vault-base-url-none--cmk-key-name-none--cmk-key-version-none-) reference
* [Where and how to deploy](how-to-deploy-and-where.md)
* [Deploy a model to Azure Container Instances](how-to-deploy-azure-container-instance.md)

For more information on using a customer-managed key with ACI, see [Encrypt data with a customer-managed key](../container-instances/container-instances-encrypt-data.md#encrypt-data-with-a-customer-managed-key).

### Azure Kubernetes Service

You may encrypt a deployed Azure Kubernetes Service resource using customer-managed keys at any time. For more information, see [Bring your own keys with Azure Kubernetes Service](../aks/azure-disk-customer-managed-keys.md). 

This process allows you to encrypt both the Data and the OS Disk of the deployed virtual machines in the Kubernetes cluster.

> [!IMPORTANT]
> This process only works with AKS K8s version 1.17 or higher.

## Next steps

* [Customer-managed keys with Azure Machine Learning](concept-customer-managed-keys.md)
