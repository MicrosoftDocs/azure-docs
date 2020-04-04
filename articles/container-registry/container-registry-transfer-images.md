---
title: Transfer images
description: Transfer images in bulk from one container registry to another registry by creating a transfer pipeline using Azure storage accounts
ms.topic: article
ms.date: 04/03/2020
ms.custom: 
---

# Transfer images to another registry

This article shows how to transfer images or other registry artifacts in bulk from one Azure container registry to another registry. The source and target registries can be in the same or different subscriptions, or potentially different Active Directory tenants or Azure clouds. 

To transfer images, you create a transfer *pipeline*:

* Create source and target storage resources, and store storage access secrets in Azure key vaults 
* Create and run a resource that exports images to the source storage account 
* Copy images from the source storage account to the target storage account
* Create a resource that imports images to the target registry. You can set up the import pipeline to trigger whenever images are in the source storage account

Transferring registry images is a more general, scalable alternative to [importing images](container-registry-import-images.md) from one container registry to another.

In this article, you use the Azure CLI and Azure Resource Manager templates to create the resources and transfer pipeline. If you'd like to use the Azure CLI locally, you must have Azure CLI version **XXX** or later installed and logged in with [az login][az-login]. Run `az --version` to find the version. If you need to install or upgrade the CLI, see [Install Azure CLI][azure-cli].

This feature is available in the **Premium** container registry service tier. For information about registry service tiers and limits, see [Azure Container Registry SKUs](container-registry-skus.md).

## Prerequisites

* **Container registries** - For this scenario you need an existing source registry with images to transfer, and a target registry. The source and target registries can be in the same or a different Azure subscription. The steps in this article assume that the registries are in the same Active Directory tenant. If you need to create a registry, see [Quickstart: Create a private container registry using the Azure CLI](container-registry-get-started-cli.md). 
* **Storage accounts** - Create source and target storage accounts in the same Azure subscription or subscriptions as your source and target registries. If needed, create the storage accounts with the [Azure CLI](../storage/common/storage-account-create.md?tabs=azure-cli) or other tools. In each account, create a blob container for image transfer. For example, create a container named *transfer*
* **Key vaults** Create key vaults to store secrets in the same Azure subscription or subscriptions as your source and target registries. If needed, create source and target key vaults with the [Azure CLI](../key-vault/quick-create-cli.md) or other tools.

## Scenario overview

You create the following three resources for ACR Transfer. All are created using PUT operations. These resources operate on two storage accounts:

* A *source* storage account, where images from the source registry get exported
* A *target* storage account, from which images are imported to the target registry

* **ExportPipeline** - Long-lasting resource that contains high-level information about the the *source* storage account. This information includes the storage blob container URI and the key vault secret URI of the storage SAS token. 
* **ImportPipeline** - Long-lasting resource that contains high-level information about the *target* storage account. This information includes the storage blob container URI and the key vault secret URI of the storage SAS token. An import trigger is enabled by default, so the pipeline runs automatically when artifacts land in the target storage container. 
* **PipelineRun** Resource used to invoke either an ExportPipeline or ImportPipeline resource.  

You run the ExportPipeline manually by creating a PipelineRun resource. When you run the ExportPipeline, you specify the artifacts to be exported.  

If an import trigger is enabled, an ImportPipeline runs automatically. It can also be run manually using a PipelineRun. 

### Things to know
* The ImportPipeline and ExportPipeline may be located in different Active Directory tenants, or different Azure clouds. If run in different tenants or clouds, you need separate managed identities and key vaults for the export and import resources.
* ExportPipelines and ImportPipelines also support system-assigned identities. In this case, assign the identity permissions to your key vault after the export resource is created and before running. 

## Create and store SAS tokens

Transfer uses shared access signature (SAS) tokens to export to and import from the designated storage accounts. The properties required to create SAS tokens are detailed below.  

### SAS token for export

Generate a SAS token for export to the source storage account.

SAS properties:
* **Allowed services** - Blob 
* **Allowed resource types** - Container, Object 
* **Allowed permissions** - Read, Write, List, Add, Create

You can accept default values for other settings.

Generate the SAS using the Azure portal or the [az storage account generate-sas][az-storage-account-generate-sas] command.

Copy the generated SAS token and use it to set the EXPORT_SAS environment variable:

```console
EXPORT_SAS='?sv=2019-02-02&...'
```

Store the SAS token in your source Azure key vault using [az keyvault secret set][az-keyvault-secret-set]:

```azurecli
az keyvault secret set \
  --name acrexportsas \
  --value $EXPORT_SAS \
  --vault-name sourcekeyvault 
```

### SAS token for import

Generate a SAS token for import from the target storage account.

SAS properties:
* **Allowed services** - Blob 
* **Allowed resource types** - Service, Container, Object 
* **Allowed permissions** - Read, Delete, List

You can accept default values for other settings.

Generate a SAS using the Azure portal or the [az storage account generate-sas][az-storage-account-generate-sas] command.

Copy the generated SAS token and use it to set the IMPORT_SAS environment variable:

```console
IMPORT_SAS='?sv=2019-02-02&...'

Store the SAS token in your target Azure key vault using [az keyvault secret set][az-keyvault-secret-set] command:

```azurecli
az keyvault secret set \
  --name acrimportsas \
  --value $IMPORT_SAS \
  --vault-name targetkeyvault 
```

## Create identities 

Create user-assigned managed identities for source and target key vaults by running the [az identity create][az-identity-create] command. 


```azurecli
# Managed identity for source vault
az identity create \
  --resource-group myResourceGroup \
  --name sourceId  

# Managed identity for target vault
az identity create \
  --resource-group myResourceGroup \
  --name targetId 
```

Set the following variables using the [az identity show][az-identity-show] command:

```azurecli
sourcePrincipalID=$(az identity show \
  --resource-group myResourceGroup \
  --name sourceId --query principalId --output tsv) 

sourceResourceID=$(az identity show \
  --resource-group myResourceGroup \
  --name myPipelineId --query id --output tsv) 

targetPrincipalID=$(az identity show \
  --resource-group myResourceGroup \
  --name sourceId --query principalId --output tsv) 

targetResourceID=$(az identity show \
  --resource-group myResourceGroup \
  --name myPipelineId --query id --output tsv) 
```

## Grant each identity access to key vault 

Run the [az keyvault set-policy][az-keyvault-set-policy] command to grant the source and target identities access to their respective key vaults:

```azurecli
# Source key vault
az keyvault set-policy --name sourcekeyvault \
  --resource-group myResourceGroup \
  --object-id $principalID \
  --secret-permissions get

# Target key vault
az keyvault set-policy --name targetkeyvault \
  --resource-group myResourceGroup \
  --object-id $principalID \
  --secret-permissions get
```

## Export

### Create the ExportPipeline resource 

Create an ExportPipeline resource for your source container registry using Azure Resource Manager template deployment. The ExportPipeline resource is provisioned with the source user-assigned identity you created previously.

Copy ExportPipeline Resource Manager template files from [here](add link - TBD).

Run [az deployment group create][az-deployment-group-create] to create the resource.

```azurecli
az deployment group create \
  --resource-group myResourceGroup \
  --template-file azuredeploy.json \
  --parameters azuredeploy.parameters.json \
  --parameters userAssignedIdentity=$sourceResourceID
```
 
### Run the ExportPipeline resource 

Copy ExportPipeline Resource Manager template files from [here](add link - TBD).

[Create a list of images to transfer - what is format?]

Run [az deployment group create][az-deployment-group-create] to run the resource.

```azurecli
az group deployment create \ 
  --resource-group myResourceGroup \
  --template-file azuredeploy.json \
  --parameters azuredeploy.parameters.json
```

## Transfer blob (optional) 

Use the AzCopy command to copy the blob from the source storage account to the target storage account. See [Copy blobs between storage accounts](/storage/common/storage-use-azcopy-blobs.md#copy-blobs-between-storage-accounts). 

[TODO: What does the AzCopy command look like? Is it the `azcopy sync` shown below?]

The following `azcopy sync` command ynchronizes the transfer containers in the source and target storage accounts:

```console
azcopy sync \
  'https://<source-storage-account-name>.blob.core.windows.net/transfer' \
  'https://<destination-storage-account-name>.blob.core.windows.net/transfer' \
  --recursive 
```

## Import 

### Create the ImportPipeline resource 

Create an ImportPipeline resource in your target container registry using Azure Resource Manager template deployment. The ImportPipeline resource is provisioned with the target user-assigned identity you created previously. By default, the pipeline is triggered to import automatically when the target storage account has images.

Copy ImportPipeline Resource Manager template files from [here](add link - TBD).

Run [az deployment group create][az-deployment-group-create] to create the resource.

```azurecli
az group deployment create \ 
  --resource-group myResourceGroup \ 
  --template-file azuredeploy.json \ 
  --parameters azuredeploy.parameters.json \
  --parameters userAssignedIdentity=$targetResourceID 
```

### Run the ImportPipeline resource manually (optional) 
 
Copy ImportPipeline Resource Manager template files from [here](add link - TBD).

Run [az deployment group create][az-deployment-group-create] to run the resource.
 
```azurecli
az group deployment create \ 
  --resource-group myResourceGroup \ 
  --template-file azuredeploy.json \ 
  --parameters azuredeploy.parameters.json 
```

## Verify image transfer

[TODO]

<!-- LINKS - External -->


<!-- LINKS - Internal -->
[azure-cli]: /cli/azure/install-azure-cli
[az-identity-create]: /cli/azure/identity#az-identity-create
[az-identity-show]: /cli/azure/identity#az-identity-show
[az-login]: /cli/azure/reference-index#az-login
[az-keyvault-secret-set]: /cli/azure/keyvault/secret#az-keyvault-secret-set
[az-keyvault-set-policy]: /cli/azure/keyvault#az-keyvault-set-policy
[az-storage-account-generate-sas]: /cli/azure/storage/account#az-storage-account-generate-sas
[az-deployment-group-create]: /cli/azure/deployment/group#az-deployment-group-create



