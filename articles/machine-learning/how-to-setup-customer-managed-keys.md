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

Azure Machine Learning is built on top of multiple Azure services. Several of these services allow you to use a key you provide (customer-managed key) to add an extra layer of encryption. The keys you provide are stored securely using Azure Key Vault.

You can use customer-managed keys with the following services that Azure Machine Learning relies on:

| Service | What it is used for |
| ----- | ----- |
| Azure Cosmos DB | Stores metadata for Azure Machine Learning |
| Azure Search | Stores workspace metadata for Azure Machine Learning |
| Azure Storage | Stores workspace metadata for Azure Machine Learning | 
| Azure Container Instance | Hosting trained models as inference endpoints |
| Azure Kubernetes Service | Hosting trained models as inference endpoints |

> [!TIP]
> While it may be possible to use the same key for everything, using a different key for each service or instance allows you to rotate or revoke the keys without impacting multiple things.

You'll also learn about the [hbi_workspace flag](/python/api/azureml-core/azureml.core.workspace%28class%29#create-name--auth-none--subscription-id-none--resource-group-none--location-none--create-resource-group-true--sku--basic---friendly-name-none--storage-account-none--key-vault-none--app-insights-none--container-registry-none--cmk-keyvault-none--resource-cmk-uri-none--hbi-workspace-false--default-cpu-compute-target-none--default-gpu-compute-target-none--exist-ok-false--show-output-true-). This flag controls the amount of data Microsoft collects for diagnostic purposes and enables [additional encryption in Microsoft-managed environments](../security/fundamentals/encryption-atrest.md). In addition, it enables the following behaviors:

* Starts encrypting the local scratch disk in your Azure Machine Learning compute cluster, provided you have not created any previous clusters in that subscription. Else, you need to raise a support ticket to enable encryption of the scratch disk of your compute clusters.
* Cleans up your local scratch disk between runs.
* Securely passes credentials for your storage account, container registry, and SSH account from the execution layer to your compute clusters using your key vault.

> [!TIP]
> The `hbi_workspace` flag does not impact encryption in transit, only encryption at rest.

## Prerequisites

* An Azure subscription.

## How workspace metadata is stored

TODO: Intro about how Azure Machine Learning stores metadata on encrypted resources. Talk about Azure Storage, Search, and Cosmos.

### Azure Key Vault
The Azure Key Vault that contains your keys must be in the same Azure region that you plan to create the Azure Machine Learning workspace in.

### Azure Cosmos DB

* Azure Machine Learning stores metadata in an Azure Cosmos DB. If you __don't__ use a customer-managed key, the Azure Cosmos DB instance is created in a _Microsoft subscription_ managed by Azure Machine Learning. So it does not appear in your Azure subscription. All the data stored in Azure Cosmos DB is encrypted at rest with Microsoft-managed keys.

* The decision to use a customer-managed key for the Azure Cosmos DB instance can only be made when the workspace is created. It cannot be changed for an existing workspace.

* When using a customer-managed key, the Cosmos DB instance is created in a Microsoft-managed resource group in __your subscription__. It is __created automatically when you create the Azure Machine Learning workspace__. The following services are also created in this resource group, and are used by the customer-managed key configuration:

    * Azure Storage Account
    * Azure Search

    Since these services are created in your Azure subscription, it means that you are charged for these service instances. If your subscription does not have enough quota for the Azure Cosmos DB service, a failure will occur. For more information on quotas, see [Azure Cosmos DB service quotas](/azure/cosmos-db/concepts-limits)

    The managed resource group is named in the format `<AML Workspace Resource Group Name><GUID>`. If your Azure Machine Learning workspace uses a private endpoint, a virtual network is also created in this resource group. This VNet is used to secure communication between the services in this resource group and your Azure Machine Learning workspace.

    > [!WARNING]
    > __Don't delete the resource group__ that contains this Azure Cosmos DB instance, or any of the resources automatically created in this group. If you need to delete the resource group, Cosmos DB, etc., you must delete the Azure Machine Learning workspace that uses it. The resource group, Cosmos DB instance, and other automatically created resources are deleted when the associated workspace is deleted.

* The  [__Request Units__](/azure/cosmos-db/request-units) used by this Cosmos DB account automatically scale as needed. The __minimum__ RU is __1200__. The __maximum__ RU is __12000__.

* You __cannot provide your own VNet for use with the Cosmos DB__ that is created. You also __cannot modify the virtual network__. For example, you cannot change the IP address range that it uses.

* To estimate the additional cost of the Azure Cosmos DB instance, use the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/).
## Encrypted data at rest

### HBI_workspace flag

* The `hbi_workspace` flag can only be set when a workspace is created. It cannot be changed for an existing workspace.
* When this flag is set to True, one possible impact is increased difficulty troubleshooting issues. This could happen because some telemetry isn't sent to Microsoft and there is less visibility into success rates or problem types, and therefore may not be able to react as proactively when this flag is True.

To enable the `hbi_workspace` flag when creating an Azure Machine Learning workspace, follow the steps in one of the following articles:

* [How to create and manage a workspace](how-to-manage-workspace.md).
* [How to create and manage a workspace using the Azure CLI](how-to-manage-workspace-cli.md).
* [How to create a workspace using Hashicorp Terraform](how-to-manage-workspace-terraform.md).
* [How to create a workspace using Azure Resource Manager templates](how-to-create-workspace-template.md).
## Use your own encryption resources

## How to rotate keys

## Rotate keys

* Cosmos DB: If you need to __rotate or revoke__ your key, you can do so at any time. When rotating a key, Cosmos DB will start using the new key (latest version) to encrypt data at rest. When revoking (disabling) a key, Cosmos DB takes care of failing requests. It usually takes an hour for the rotation or revocation to be effective.


## How-to info

TODO: Can we link out to other docs for this? For example, there's maybe a key vault article on creating keys.
### Create Azure Key Vault

1. When creating Azure Key Vault, you must enable __soft delete__ and __purge protection__.

    <!-- :::image type="content" source="{source}" alt-text="{alt-text}"::: -->

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

