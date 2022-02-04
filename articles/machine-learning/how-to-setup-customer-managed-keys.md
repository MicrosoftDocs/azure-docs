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
ms.date: 01/28/2022
---
# Customer-managed keys for Azure Machine Learning

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
* Resources managed by Microsoft in your subscription, can’t transfer ownership to you, or vice versa.
* Sharing dependent resources for storing encrypted data between workspaces isn’t recommended.
* When bringing your own Azure Cosmos DB, serverless capacity mode configurations aren't supported. Use the provisioned throughput capacity mode instead.

## Create Azure Key Vault

1. When creating Azure Key Vault, you must enable __soft delete__ and __purge protection__.

    For the steps to create the key vault, see [Create a key vault](/azure/key-vault/general/quick-create-portal).

1. Once the key vault has been created, select it in the [Azure portal](https://portal.azure.com). From __Overview__, copy the __Vault URI__. This value is needed by other steps in this article.
1. 
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

### Azure Cosmos DB

Azure Machine Learning stores metadata in an Azure Cosmos DB instance. By default, this instance is associated with a Microsoft subscription managed by Azure Machine Learning. All the data stored in Azure Cosmos DB is encrypted at rest with Microsoft-managed keys.

To use your own (customer-managed) keys to encrypt the Azure Cosmos DB instance, use the following steps:

1. Register the __Microsoft.DocumentDB__ resource provider in your subscription, if not done already. For more information, see For information on registering resource providers, see [Resolve errors for resource provider registration](/azure/azure-resource-manager/templates/error-register-resource-provider).

1. To configure the key vault, select it in the [Azure portal](https://portal.azure.com) and then select __Access polices__ from the left menu.

    1. To create permissions for Azure Cosmos DB, select __+ Create__ at the top of the page. Under __Key permissions__, select __Get__, __Unwrap Key__, and __Wrap key__ permissions.
    1. Under __Principal__, search for __Azure Cosmos DB__ and then select it. The principal ID for this entry is different depending on the Azure region you are using:

        | Region | Principal ID |
        | ----- | ----- |
        | Azure public | `a232010e-820c-4083-83bb-3ace5fc29d0b` |
        | Azure Government | `57506a73-e302-42a9-b869-6f12d9ec29e9` |
        | Azure China | ????? |

    1. Select __Review + Create__, and then select __Create__.

1. Create an Azure Machine Learning workspace. When creating the workspace, use the following parameters. Both parameters are mandatory and supported in SDK, Azure CLI, REST APIs, and Resource Manager templates.

    * `cmk_keyvault`: This parameter is the resource ID of the key vault in your subscription. This key vault needs to be in the same region and subscription that you will use for the Azure Machine Learning workspace. 

    * `resource_cmk_uri`: This parameter is the full resource URI of the customer managed key in your key vault, including the [version information for the key](../key-vault/general/about-keys-secrets-certificates.md#objects-identifiers-and-versioning). 

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
 -->
