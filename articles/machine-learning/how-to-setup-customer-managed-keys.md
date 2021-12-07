

# Configure customer-managed keys for Azure Machine Learning

While most Azure services encrypt data at rest or in transit, by default this is done using a Microsoft-managed key. In this article, you'll learn how to use a customer-managed key with Azure Machine Learning and the following services that it relies on:

* Azure Cosmos DB
* Azure Containe Instance
* Azure Kubernetes Service

## Open questions

* Do we recommend that it be the same AKS used by the Azure ML workspace, or separate? Seems like using a different AKS might be more secure, as the workspace wouldn't have access to write to it maybe?

* Do we recommend re-using the same key to secure multiple services? Seems like separate keys offers less of an attack surface. Someone gets one key, they only get that service and you can regenerate the key as needed.

* How do we (or do we?) position HBI in here? It's not a customer-managed key, but is adjacent, as it enables encryption of 'more stuff'.

* Key rotation info/considerations for ACI/AKS?

* Does the AKS info also apply to ARC K8S deployments?

* Does the diagram at /azure/cosmos-db/media/how-to-setup-cmk/cmk-intro.png apply generically to all CMK? Or just Cosmos DB? That is, representing it as the CMK being applied on top of the service-managed keys?

## Prerequisites

## Azure Cosmos DB

Azure Machine Learning stores metadata in an Azure Cosmos DB instance. By default, this instance is associated with a Microsoft subscription managed by Azure Machine Learning. All the data stored in Azure Cosmos DB is encrypted at rest with Microsoft-managed keys.

To use your own (customer-managed) keys to encrypt the Azure Cosmos DB instance, use the following steps:

[!INCLUDE [machine-learning-customer-managed-keys.md](../../includes/machine-learning-customer-managed-keys.md)] <!-- Does this need to still be an include? Probably needs to be rewritten. -->

[TODO - extract info from https://docs.microsoft.com/azure/cosmos-db/how-to-setup-cmk#configure-your-azure-key-vault-instance on setting up the key vault].

1. [Create an Azure Key Vault]() instance. [TODO - do we have any Azure ML specific requirements for AKV?]

    > [!NOTE]
    > Enabling soft delete and purge protection on the CMK key vault instance is required before creating an encrypted machine learning workspace to protect against accidental data loss in case of vault deletion.

    > [!NOTE]
    > This key vault instance can be different than the key vault that is created by Azure Machine Learning when you create the workspace. If you want to use the same key vault instance for the workspace, pass the same key vault while provisioning the workspace by using the [key_vault parameter](/python/api/azureml-core/azureml.core.workspace%28class%29#create-name--auth-none--subscription-id-none--resource-group-none--location-none--create-resource-group-true--sku--basic---friendly-name-none--storage-account-none--key-vault-none--app-insights-none--container-registry-none--cmk-keyvault-none--resource-cmk-uri-none--hbi-workspace-false--default-cpu-compute-target-none--default-gpu-compute-target-none--exist-ok-false--show-output-true-). 

1. When creating the workspace, se the following parameters. Both parameters are mandatory and supported in SDK, Azure CLI, REST APIs, and Resource Manager templates.

    * `cmk_keyvault`: This parameter is the resource ID of the key vault in your subscription. This key vault needs to be in the same region and subscription that you will use for the Azure Machine Learning workspace. 

    * `resource_cmk_uri`: This parameter is the full resource URI of the customer managed key in your key vault, including the [version information for the key](../key-vault/general/about-keys-secrets-certificates.md#objects-identifiers-and-versioning). 

If you need to __rotate or revoke__ your key, you can do so at any time. When rotating a key, Cosmos DB will start using the new key (latest version) to encrypt data at rest. When revoking (disabling) a key, Cosmos DB takes care of failing requests. It usually takes an hour for the rotation or revocation to be effective.

For more information on customer-managed keys with Cosmos DB, see [Configure customer-managed keys for your Azure Cosmos DB account](../cosmos-db/how-to-setup-cmk.md).

## Azure Container Instance

You may encrypt a deployed Azure Container Instance (ACI) resource using customer-managed keys. The customer-managed key used for ACI can be stored in the Azure Key Vault for your workspace. For information on generating a key, see [Encrypt data with a customer-managed key](../container-instances/container-instances-encrypt-data.md#generate-a-new-key).

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