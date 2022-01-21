

# Configure customer-managed keys for Azure Machine Learning

While most Azure services encrypt data at rest or in transit, by default this is done using a Microsoft-managed key. In this article, you'll learn how to use a customer-managed key that you provide. Your key is used to secure the services that Azure Machine Learning uses to store data.

A customer-managed key can be used with the following services that Azure Machine Learning relies on:

| Service | What it is used for |
| ----- | ----- |
| Azure Cosmos DB |
| Azure Container Instance | Hosting trained models as inference endpoints |
| Azure Kubernetes Service | Hosting trained models as inference endpoints |

## Open questions

* Do we recommend re-using the same key to secure multiple services? Seems like separate keys offers less of an attack surface. Someone gets one key, they only get that service and you can regenerate the key as needed.

* How do we (or do we?) position HBI in here? It's not a customer-managed key, but is adjacent, as it enables encryption of 'more stuff'.

* Key rotation info/considerations for ACI/AKS?

* Does the AKS info also apply to ARC K8S deployments?

* Does the diagram at /azure/cosmos-db/media/how-to-setup-cmk/cmk-intro.png apply generically to all CMK? Or just Cosmos DB? That is, representing it as the CMK being applied on top of the service-managed keys?

## Prerequisites

* An Azure subscription.
* An Azure Key Vault instance. Key vault is used to securely store your keys. For more information, see [Create a key vault](/azure/key-vault/general/quick-create-portal).

    > [!TIP]
    > While it may be possible to use the same key for everything, using a different key for each service or instance allows you to rotate or revoke the keys without impacting multiple things.

## Limitations

### Azure Cosmos DB

Azure Machine Learning stores metadata in an Azure Cosmos DB. If you __don't__ use a customer-managed key, the Azure Cosmos DB instance is created in a _Microsoft subscription_ managed by Azure Machine Learning. So it does not appear in your Azure subscription. All the data stored in Azure Cosmos DB is encrypted at rest with Microsoft-managed keys.

When using a customer-managed key, the Cosmos DB instance is created in a Microsoft-managed resource group in __your subscription__. The following services are also created in this resource group, and are used by the customer-managed key configuration:

* Azure Storage Account
* Azure Search

Since these services are created in your Azure subscription, it means that you are charged for these service instances. If your subscription does not have enough quota for the Azure Cosmos DB service, a failure will occur. For more information on quotas, see [Azure Cosmos DB service quotas](../articles/cosmos-db/concepts-limits.md)

The managed resource group is named in the format `<AML Workspace Resource Group Name><GUID>`. If your Azure Machine Learning workspace uses a private endpoint, a virtual network is also created in this resource group. This VNet is used to secure communication between the services in this resource group and your Azure Machine Learning workspace.

> [!WARNING]
> __Don't delete the resource group__ that contains this Azure Cosmos DB instance, or any of the resources automatically created in this group. If you need to delete the resource group, Cosmos DB, etc., you must delete the Azure Machine Learning workspace that uses it. The resource group, Cosmos DB instance, and other automatically created resources are deleted when the associated workspace is deleted.

The  [__Request Units__](../articles/cosmos-db/request-units.md) used by this Cosmos DB account automatically scale as needed. The __minimum__ RU is __1200__. The __maximum__ RU is __12000__.

You __cannot provide your own VNet for use with the Cosmos DB__ that is created. You also __cannot modify the virtual network__. For example, you cannot change the IP address range that it uses.

To estimate the additional cost of the Azure Cosmos DB instance, use the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/).

## Azure Cosmos DB

Azure Machine Learning stores metadata in an Azure Cosmos DB instance. By default, this instance is associated with a Microsoft subscription managed by Azure Machine Learning. All the data stored in Azure Cosmos DB is encrypted at rest with Microsoft-managed keys.

To use your own (customer-managed) keys to encrypt the Azure Cosmos DB instance, use the following steps:

1. Register the __Microsoft.DocumentDB__ resource provider in your subscription, if not done already. For more information, see For information on registering resource providers, see [Resolve errors for resource provider registration](../articles/azure-resource-manager/templates/error-register-resource-provider.md).

1. Configure your key vault instance following the guidance in [Configure customer-managed keys for your Azure Cosmos account with Azure Key Vault](/azure/cosmos-db/how-to-setup-cmk).

    > [!IMPORTANT]
    > When following the steps to configure key vault, don't create a new Azure Cosmos account. One will be created for you when you create the Azure Machine Learning workspace.

1. Create an Azure Machine Learning workspace. When creating the workspace, use the following parameters. Both parameters are mandatory and supported in SDK, Azure CLI, REST APIs, and Resource Manager templates.

    * `cmk_keyvault`: This parameter is the resource ID of the key vault in your subscription. This key vault needs to be in the same region and subscription that you will use for the Azure Machine Learning workspace. 

    * `resource_cmk_uri`: This parameter is the full resource URI of the customer managed key in your key vault, including the [version information for the key](../key-vault/general/about-keys-secrets-certificates.md#objects-identifiers-and-versioning). 

> [!TIP]
> If you need to __rotate or revoke__ your key, you can do so at any time. When rotating a key, Cosmos DB will start using the new key (latest version) to encrypt data at rest. When revoking (disabling) a key, Cosmos DB takes care of failing requests. It usually takes an hour for the rotation or revocation to be effective.

For more information on customer-managed keys with Cosmos DB, see [Configure customer-managed keys for your Azure Cosmos DB account](../cosmos-db/how-to-setup-cmk.md).

## Azure Container Instance

When deploying a trained model to an Azure Container instance (ACI), you can encrypt the deployed resource using a customer-managed key. For information on generating a key, see [Encrypt data with a customer-managed key](../container-instances/container-instances-encrypt-data.md#generate-a-new-key).

To use the key when deploying a model to Azure Container Instance, create a new deployment configuration using `AciWebservice.deploy_configuration()`. Provide the key information using the following parameters:

* `cmk_vault_base_url`: The URL of the key vault that contains the key.
* `cmk_key_name`: The name of the key.
* `cmk_key_version`: The version of the key.

For more information on creating and using a deployment configuration, see the following articles:

* [AciWebservice.deploy_configuration()](/python/api/azureml-core/azureml.core.webservice.aci.aciwebservice#deploy-configuration-cpu-cores-none--memory-gb-none--tags-none--properties-none--description-none--location-none--auth-enabled-none--ssl-enabled-none--enable-app-insights-none--ssl-cert-pem-file-none--ssl-key-pem-file-none--ssl-cname-none--dns-name-label-none--primary-key-none--secondary-key-none--collect-model-data-none--cmk-vault-base-url-none--cmk-key-name-none--cmk-key-version-none-) reference
* [Where and how to deploy](how-to-deploy-and-where.md)
* [Deploy a model to Azure Container Instances](how-to-deploy-azure-container-instance.md)

For more information on using a customer-managed key with ACI, see [Encrypt data with a customer-managed key](../container-instances/container-instances-encrypt-data.md#encrypt-data-with-a-customer-managed-key).

## Azure Kubernetes Service

You may encrypt a deployed Azure Kubernetes Service resource using customer-managed keys at any time. For more information, see [Bring your own keys with Azure Kubernetes Service](../aks/azure-disk-customer-managed-keys.md). 

This process allows you to encrypt both the Data and the OS Disk of the deployed virtual machines in the Kubernetes cluster.

> [!IMPORTANT]
> This process only works with AKS K8s version 1.17 or higher.