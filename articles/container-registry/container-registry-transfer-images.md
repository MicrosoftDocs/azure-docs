---
title: Transfer images
description: You learn how to ...
ms.topic: article
ms.date: 03/31/2020
ms.custom: 
---

# Transfer images to another registry

[Intro]

If you'd like to use the Azure CLI locally, you must have Azure CLI version **XXX** or later installed  and logged in with [az login][az-login]. Run `az --version` to find the version. If you need to install or upgrade the CLI, see [Install Azure CLI][azure-cli].


## Prerequisites

* **Storage accounts** - Create source and target storage accounts. If needed, create the storage accounts with the [Azure CLI](../storage/common/storage-account-create.md?tabs=azure-cli) or other tools. The source and target storage accounts can be in the same or a different Azure subscription. For the steps in article, the accounts must be in the same Active Directory tenant.
* **Key vault** for storing secrets - If needed, create a key vault with the [Azure CLI](../key-vault/quick-create-cli.md) or other tools
* **Container registries** - For this scenario you need an existing source registry with images to transfer, and a target registry. The source and target registry can be in the same or a different Azure subscription. For the steps in article, the registries must be in the same Active Directory tenant. If you need to create a registry, see [Quickstart: Create a private container registry using the Azure CLI](container-registry-get-started-cli.md). 

## Scenario overview

The following three resources are used for ACR Transfer. All are created using PUT operations. 

* **ExportPipeline** - Long lasting resource that contains high level target info, such as storage blob container URI and the KV secret URI of the target storage SAS token. 
* **ImportPipeline** - Long lasting resource that contains high level source info, such as storage blob container URI and the KV secret URI of the source storage SAS token. Source trigger is enabled by default so the pipeline will run automatically when artifacts land in the source storage container. 
* **PipelineRun** Resource used to invoke either an ExportPipeline or ImportPipeline resource.  

An ExportPipeline must be run manualIly by creating a PipelineRun resource. When you run the ExportPipeline, you specify the artifacts to be exported.  

An ImportPipeline configured with source trigger enabled is run automatically. It can also be run manually using a PipelineRun. 

### Assumptions for this article
* The export and import SAS tokens are located in the same key vault, and a user-assigned identity is shared between export and import. 
* The source and target registries and storage accounts are in the same tenant.

### Alternate scenarios
* The ImportPipeline and ExportPipeline may be located in different tenants. In this case, you need separate managed identities and key vaults for the export and import resources.
* ExportPipelines and ImportPipelines also support system-assigned identities. In this case, assign the identity permissions to your key vault after the export resource is created and before running. 

## Create and store SAS tokens

Transfer uses shared access signature (SAS) tokens to export to and import from storage accounts. The properties required to create SAS tokens are detailed below.  

### SAS token for export

Generate a SAS token for export in the source storage account.

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

Store the SAS token in your Azure key vault using [az keyvault secret set][az-keyvault-secret-set]:

```azurecli
az keyvault secret set \
  --name acrexportsas \
  --value $EXPORT_SAS \
  --vault-name mykeyvault 
```

### SAS token for import

Generate a SAS token for import in the target storage account.

SAS properties:
* **Allowed services** - Blob 
* **Allowed resource types** - Service, Container, Object 
* **Allowed permissions** - Read, Delete, List

You can accept default values for other settings.

Generate a SAS using the Azure portal or the [az storage account generate-sas][az-storage-account-generate-sas] command.

Copy the generated SAS token and use it to set the IMPORT_SAS environment variable:

```console
IMPORT_SAS='?sv=2019-02-02&...'

Store the SAS token in your Azure key vault using [az keyvault secret set][az-keyvault-secret-set]:

```azurecli
az keyvault secret set \
  --name acrimportsas \
  --value $IMPORT_SAS \
  --vault-name mykeyvault 
```

## Create identity 

Create the user-assigned managed identity by running the [az identity create][az-identity-create] command. 

 
```azurecli
az identity create \
  --resource-group myResourceGroup \
  --name myPipelineId  
```

Set the following variables using the [az identity show][az-identity-show] command:

```azurecli
principalID=$(az identity show \
  --resource-group myResourceGroup \
  --name myPipelineId --query principalId --output tsv) 

resourceID=$(az identity show \
  --resource-group myResourceGroup \
  --name myPipelineId --query id --output tsv) 
```

## Grant the identity access to key vault 

Run the [az keyvault set-policy][az-keyvault-set-policy] command to grant the identity access to your key vault:

```azurecli
az keyvault set-policy --name mykeyvault \
  --resource-group myResourceGroup \
  --object-id $principalID \
  --secret-permissions get
```

## Export

### Create the ExportPipeline resource 

Create an ExportPipeline resource in your source container registry using Azure Resource Manager template deployment. The ExportPipeline resource is provisioned with the user-assigned identity you created previously.

Copy ExportPipeline Resource Manager template files from [here](add link - TBD).

Run [az deployment group create][az-deployment-group-create] to create the resource.

```azurecli
az deployment group create \
  --resource-group myResourceGroup \
  --template-file azuredeploy.json \
  --parameters azuredeploy.parameters.json \
  --parameters userAssignedIdentity=$resourceID
```
 
### Run the ExportPipeline resource 

Copy ExportPipeline Resource Manager template files from [here](add link - TBD).

Run [az deployment group create][az-deployment-group-create] to run the resource.

```azurecli
az group deployment create \ 
  --resource-group myResourceGroup \
  --template-file azuredeploy.json \
  --parameters azuredeploy.parameters.json
```

[How to specify the artifacts?]

## Transfer blob (optional) 

Copy the blob to the target storage account using the AzCopy command. See [Copy blobs between storage accounts](/storage/common/storage-use-azcopy-blobs.md#copy-blobs-between-storage-accounts). 

[What does the AzCopy command look like?]

## Import 

### Create the ImportPipeline resource 

Create an ImportPipeline resource in your target container registry using Azure Resource Manager template deployment. The ImportPipeline resource is provisioned with the user-assigned identity you created previously. 

Copy ImportPipeline Resource Manager template files from [here](add link - TBD).

Run [az deployment group create][az-deployment-group-create] to create the resource.

```azurecli
az group deployment create \ 
  --resource-group myResourceGroup \ 
  --template-file azuredeploy.json \ 
  --parameters azuredeploy.parameters.json \
  --parameters userAssignedIdentity=$resourceID 
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



