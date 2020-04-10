---
title: Transfer images
description: Transfer images in bulk from one container registry to another registry by creating a transfer pipeline using Azure storage accounts
ms.topic: article
ms.date: 04/09/2020
ms.custom: 
---

# Transfer artifacts to another registry

This article shows how to transfer collections of images or other registry artifacts from one Azure container registry to another registry. The source and target registries can be in the same or different subscriptions, Active Directory tenants, Azure clouds, or physically disconnected clouds. 

To transfer artifacts, you create a *transfer pipeline* that replicates artifacts between two registries by using [blob storage](../storage/blobs/storage-blobs-introduction.md):

* Artifacts from a source registry are exported to a blob in a source storage account 
* The blob is copied from the source storage account to a target storage account
* The blob in the target storage account gets imported as artifacts in the target registry. You can set up the import pipeline to trigger whenever the artifact blob updates in the target storage.

Transfer is ideal for copying content between two registries in physically disconnected clouds, mediated by storage accounts in each cloud. Azure Container Registry also offers [image import](container-registry-import-images.md) for image copy from registries in connected clouds including Docker Hub and other cloud vendors.

In this article, you use Azure Resource Manager template deployments to create and run the transfer pipeline. The Azure CLI is used to provision the associated resources such as storage secrets, key vaults, and managed identities. Azure CLI version 2.2.0 or later is recommended. If you need to install or upgrade the CLI, see [Install Azure CLI][azure-cli].

This feature is available in the **Premium** container registry service tier. For information about registry service tiers and limits, see [Azure Container Registry SKUs](container-registry-skus.md).

## Prerequisites

* **Container registries** - You need an existing source registry with artifacts to transfer, and a target registry. ACR transfer is intended for movement across physically disconnected clouds. However, for testing, the source and target registries can be in the same or a different Azure subscription, Active Directory tenant, or cloud. If you need to create a registry, see [Quickstart: Create a private container registry using the Azure CLI](container-registry-get-started-azure-cli.md). 
* **Storage accounts** - Create source and target storage accounts in a subscription and location of your choice. For testing purposes, you can use the same subscription or subscriptions as your source and target registries. For cross-cloud scenarios, typically you create a separate storage account in each cloud. If needed, create the storage accounts with the [Azure CLI](../storage/common/storage-account-create.md?tabs=azure-cli) or other tools. 

  In each account, create a blob container for artifact transfer. For example, create a container named *transfer*. Two or more ACR Transfer pipelines can share the same storage account, but should use different storage container scopes.
* **Key vaults** - Create key vaults to store secrets in the same Azure subscription or subscriptions as your source and target registries. If needed, create source and target key vaults with the [Azure CLI](../key-vault/quick-create-cli.md) or other tools.
* **Environment variables** - For example commands in this article, set the following environment variables for the source and target environments. All examples are formatted for the Bash shell.
  ```console
  SOURCE_RG="<source-resource-group>"
  TARGET_RG="<target-resource-group>"
  SOURCE_KV="<source-key-vault>"
  TARGET_KV="<target-key-vault>"
  SOURCE_SA="<source-storage-account>"
  TARGET_SA="<target-storage-account>"
  ```

## Scenario overview

You create the following three resources for image transfer between registries. All are created using PUT operations. These resources operate on your *source* and *target* registries and storage accounts.

* **[ExportPipeline](#create-the-exportpipeline-resource-with-azure-resource-manager)** - Long-lasting resource that contains high-level information about the *source* registry and storage account. This information includes the source storage blob container URI and the key vault secret URI of the storage SAS token. 
* **[ImportPipeline](#create-the-importpipeline-resource)** - Long-lasting resource that contains high-level information about the *target* registry and storage account. This information includes the target storage blob container URI and the key vault secret URI of the storage SAS token. An import trigger is enabled by default, so the pipeline runs automatically when artifacts land in the target storage container. 
* **[PipelineRun](#create-a-pipelinerun-with-resource-manager)** - Resource used to invoke either an ExportPipeline or ImportPipeline resource.  
  * You run the ExportPipeline manually by creating a PipelineRun resource and specify the artifacts to export.  
  * If an import trigger is enabled, the ImportPipeline runs automatically. It can also be run manually using a PipelineRun. 

### Things to know
* The ExportPipeline and ImportPipeline will typically be in different Active Directory tenants associated with the source and destination clouds. This scenario requires separate managed identities and key vaults for the export and import resources. For testing purposes, these resources can be placed in the same cloud, sharing identities.
* ExportPipelines and ImportPipelines also support system-assigned identities. In this case, assign the identity permissions to your key vault after the ExportPipeline resource is created and before running. 

## Create and store SAS keys

Transfer uses shared access signature (SAS) tokens to access the designated storage accounts in the source and target environments. Generate and store tokens as described in the following sections.  

### Generate SAS token for export

Run the [az storage container generate-sas][az-storage-container-generate-sas] command to generate a SAS token for the container in the source storage account, used for artifact export.

Generate the token with the following permissions: Read, Write, List, Add, Create. 

In the following example, command output is assigned to the EXPORT_SAS environment variable. Update the `--expiry` value for your environment:

```azurecli
EXPORT_SAS=$(az storage container generate-sas \
  --name transfer \
  --account-name $SA_SOURCE \
  --expiry 2020-05-01 \
  --permissions alrw \
  --https-only \
  --output tsv)
```

### Store SAS token for export

Store the SAS token in your source Azure key vault using [az keyvault secret set][az-keyvault-secret-set]:

```azurecli
az keyvault secret set \
  --name acrexportsas \
  --value $EXPORT_SAS \
  --vault-name $SOURCE_KV 
```

In the command output, take note of the secret's URI (`id`). You use the URI in the export pipelines. The following example uses the [az keyvault secret show][az-keyvault-secret-show] command to store the value in the EXPORT_KV_URI variable:

```azurecli
EXPORT_KV_URI=$(az keyvault secret show \
  --name acrexportsas \
  --vault-name $SOURCE_KV \
  --query 'id' \
  --output tsv)
```

### Generate SAS token for import

Run the [az storage container generate-sas][az-storage-container-generate-sas] command to generate a SAS token for the container in the target storage account, used for artifact import.

Generate the token with the following permissions: Read, Delete, List

In the following example, command output is assigned to the IMPORT_SAS environment variable. Update the `--expiry` value for your environment:

```azurecli
IMPORT_SAS=$(az storage container generate-sas \
  --name transfer \
  --account-name $SA_TARGET \
  --expiry 2020-05-01 \
  --permissions dlr \
  --https-only \
  --output tsv)
```

### Store SAS token for import

Store the SAS token in your target Azure key vault using [az keyvault secret set][az-keyvault-secret-set]:

```azurecli
az keyvault secret set \
  --name acrimportsas \
  --value $IMPORT_SAS \
  --vault-name $TARGET_KV 
```

In the command output, take note of the secret's URI (`id`). You use the URI in the export pipelines. The following example uses the [az keyvault secret show][az-keyvault-secret-show] command to store the value in the IMPORT_KV_URI variable:

```azurecli
IMPORT_KV_URI=$(az keyvault secret show \
  --name acrimportsas \
  --vault-name $TARGET_KV \
  --query 'id' \
  --output tsv)
```

## Create identities 

Create user-assigned managed identities to access source and target key vaults by running the [az identity create][az-identity-create] command. 

```azurecli
# Managed identity to access source vault
az identity create \
  --resource-group $SOURCE_RG \
  --name sourceId  

# Managed identity to access target vault
az identity create \
  --resource-group $TARGET_RG \
  --name targetId 
```

Set the following variables using the [az identity show][az-identity-show] command:

```azurecli
SOURCE_PR_ID=$(az identity show \
  --resource-group $SOURCE_RG \
  --name sourceId --query principalId --output tsv) 

SOURCE_RES_ID=$(az identity show \
  --resource-group $SOURCE_RG \
  --name sourceId --query id --output tsv) 

TARGET_PR_ID=$(az identity show \
  --resource-group $TARGET_RG \
  --name targetId --query principalId --output tsv) 

TARGET_RES_ID=$(az identity show \
  --resource-group $TARGET_RG \
  --name targetId --query id --output tsv) 
```

## Grant each identity access to key vault 

Run the [az keyvault set-policy][az-keyvault-set-policy] command to grant the source and target identities access to their respective key vaults:

```azurecli
# Source key vault
az keyvault set-policy --name $SOURCE_KV \
  --resource-group $SOURCE_RG \
  --object-id $SOURCE_PR_ID \
  --secret-permissions get

# Target key vault
az keyvault set-policy --name $TARGET_KV \
  --resource-group $TARGET_RG \
  --object-id $TARGET_PR_ID \
  --secret-permissions get
```

## Create ExportPipeline resource with Resource Manager

Create an ExportPipeline resource for your source container registry using Azure Resource Manager template deployment. The ExportPipeline resource is provisioned with the source user-assigned identity you created in the previous section.

Copy ExportPipeline Resource Manager [template files](https://github.com/Azure/acr/tree/master/docs/image-transfer/ExportPipelines) to a local folder.

Enter the following parameter values in the file `azuredeploy.parameters.json`:

|Parameter  |Value  |
|---------|---------|
|registryName     | Name of your source container registry      |
|exportPipelineName     |  Name you choose for the export pipeline       |
|targetUri     |  URI of the storage container in your source environment (the target of the export pipeline).<br/>Example: `https://sourcestorage.blob.core.windows.net/transfer`       |
|keyVaultUri     |  URI of the SAS token secret in the source key vault, stored previously in the EXPORT_KV_URI variable. <br/>Example: `https://sourcevault.vault-int.azure-int.net/secrets/acrexportsas/xxxxxxxxxx`       |

### Export options

The `Options` property for the export pipelines supports optional boolean values. The following values are recommended:

|Parameter  |Description  |
|---------|---------|
|Options | OverwriteBlobs - Existing target blobs are overwritten<br/>ContinueOnErrors - Continue export of remaining artifacts in the source registry if one artifact export fails.

### Create the resource

Run [az deployment group create][az-deployment-group-create] to create the resource. The following example names the deployment *exportPipeline*.

```azurecli
az deployment group create \
  --resource-group $SOURCE_RG \
  --template-file azuredeploy.json \
  --name exportPipeline \
  --parameters azuredeploy.parameters.json \
  --parameters userAssignedIdentity=$SOURCE_RES_ID
```

Take note of the resource ID (`id`) of the pipeline, which is used in later steps. Example:

```
"/subscriptions/<subscriptionID>/resourceGroups/<resourceGroupName>/providers/Microsoft.ContainerRegistry/registries/<sourceRegistryName>/exportPipelines/myExportPipeline"
```

## Create PipelineRun resource with Resource Manager 

Create a PipelineRun resource for your source container registry using Azure Resource Manager template deployment. This resource runs the ExportPipeline resource you created in the previous step, and exports specified artifacts from your container registry to your source storage account.

Copy PipelineRun Resource Manager [template files](https://github.com/Azure/acr/tree/master/docs/image-transfer/PipelineRun) to a local folder.

Enter the following parameter values in the file `azuredeploy.parameters.json`:

|Parameter  |Value  |
|---------|---------|
|registryName     | Name of your source container registry      |
|pipelineRunName     |  Name you choose for the run       |
|pipelineResourceId     |  Resource ID of the export pipeline.<br/>Example: `/subscriptions/<subscriptionID>/resourceGroups/<resourceGroupName>/providers/Microsoft.ContainerRegistry/registries/<sourceRegistryName>/exportPipelines/myExportPipeline`|
|targetName     |  Name you choose for the artifacts blob exported to your source storage account, such as *myblob*
|artifacts | Array of source artifacts to transfer, as tags or manifest digests<br/>Example: `[samples/hello-world:v1", "samples/nginx:v1"]`

Run [az deployment group create][az-deployment-group-create] to create the PipelineRun resource. The following example names the deployment *exportPipelineRun*.

```azurecli
az deployment group create \
  --resource-group $SOURCE_RG \
  --template-file azuredeploy.json \
  --name exportPipelineRun \
  --parameters azuredeploy.parameters.json
```

> [!IMPORTANT]
> For artifact export, if prompted, leave the `sourceName` blank. For testing, you can also leave `catalogDigest` and `forceUpdateTag` values blank.

When deployment completes successfully, verify artifact export by viewing the exported blob in the *transfer* container of the source storage account.

## Transfer blob (optional) 

Use the AzCopy command to [transfer blob data](../storage/common/storage-use-azcopy-blobs.md#copy-blobs-between-storage-accounts) from the source storage account to the target storage account.

For example, the following [`azcopy sync`](/azure/storage/common/storage-ref-azcopy-sync) command replicates the *transfer* container from the source storage account to the *transfer* container in the target account. Authentication uses SAS tokens with appropriate permissions for the source and target containers. (Steps to create tokens are not shown).

```console
azcopy sync \
  'https://<source-storage-account-name>.blob.core.windows.net/transfer/'$SOURCE_SAS \
  'https://<destination-storage-account-name>.blob.core.windows.net/transfer/'$TARGET_SAS \
  --recursive 
```

## Create ImportPipeline resource with Resource Manager 

Create an ImportPipeline resource in your target container registry using Azure Resource Manager template deployment. The ImportPipeline resource is provisioned with the target user-assigned identity you created previously. By default, the pipeline is enabled to import automatically when the storage account in the target environment has an artifact blob.

Copy ImportPipeline Resource Manager [template files](https://github.com/Azure/acr/tree/master/docs/image-transfer/ImportPipelines) to a local folder.

Enter the following parameter values in the file `azuredeploy.parameters.json`:

Parameter  |Value  |
|---------|---------|
|registryName     | Name of your target container registry      |
|importPipelineName     |  Name you choose for the import pipeline       |
|sourceUri     |  URI of the storage container in your target environment (the source for the import pipeline).<br/>Example: `https://targetstorage.blob.core.windows.net/transfer/`|
|keyVaultUri     |  URI of the SAS token secret in the target key vault, stored previously in the IMPORT_KV_URI variable.<br/>Example: `https://targetvault.vault-int.azure-int.net/secrets/acrimportsas/xxxxxxxxxx` |

### Export options

The `Options` property for the import pipeline supports optional boolean values. The following values are recommended:

|Parameter  |Description  |
|---------|---------|
|Options | OverwriteTags - Existing target tags are overwritten<br/>DeleteSourceBlobOnSuccess - Delete the source storage blob after successful import to the target registry<br/>ContinueOnErrors - Continue import of remaining artifacts in the target registry if one artifact import fails.

### Create the resource

Run [az deployment group create][az-deployment-group-create] to create the resource.

```azurecli
az deployment group create \
  --resource-group $TARGET_RG \
  --template-file azuredeploy.json \
  --parameters azuredeploy.parameters.json \
  --name importPipeline \
  --parameters userAssignedIdentity=$TARGET_RES_ID
```

If you plan to run the import manually, take note of the resource ID (`id`) of the pipeline, which is used in later steps. Example:

```
"/subscriptions/<subscriptionID>/resourceGroups/<resourceGroupName>/providers/Microsoft.ContainerRegistry/registries/<sourceRegistryName>/importPipelines/myImportPipeline
```

It can take several minutes for artifacts to import. When the import completes successfully, verify artifact import by listing the repositories in the target container registry. For example, run [az acr repository list][az-acr-repository-list]:

```azurecli
az acr repository list --name <target-registry-name>
```

### Run the ImportPipeline resource manually (optional) 
 
You can also use a PipelineRun resource to trigger an ImportPipeline for artifact import to your target container registry.

Copy PipelineRun Resource Manager [template files](https://github.com/Azure/acr/tree/master/docs/image-transfer/PipelineRun) to a local folder.

Enter the following parameter values in the file `azuredeploy.parameters.json`:

|Parameter  |Value  |
|---------|---------|
|registryName     | Name of your target container registry      |
|pipelineRunName     |  Name you choose for the run       |
|pipelineResourceId     |  Resource ID of the import pipeline.<br/>Example: `/subscriptions/<subscriptionID>/resourceGroups/<resourceGroupName>/providers/Microsoft.ContainerRegistry/registries/<sourceRegistryName>/importPipelines/myImportPipeline`       |
|sourceName     |  Name of the existing blob for exported artifacts in your storage account, such as *myblob*

Run [az deployment group create][az-deployment-group-create] to run the resource.

```azurecli
az deployment group create \
  --resource-group $resourceGroup \
  --template-file azuredeploy.json \
  --parameters azuredeploy.parameters.json
```

> [!IMPORTANT]
> For artifact import to your registry, if prompted, leave the `targetName` blank. You can also leave `catalogDigest` and `forceUpdateTag` values blank.

When deployment completes successfully, verify artifact import by listing the repositories in the target container registry. For example, run [az acr repository list][az-acr-repository-list]:

```azurecli
az acr repository list --name <target-registry-name>
```

## Delete pipeline resources

To delete a pipeline resource, delete its Resource Manager deployment by using the [az deployment group delete][az deployment group delete] command. The following example deletes a an ExportPipeline deployment named *exportPipeline*:

```azurecli
az deployment group delete \
  --resource-group $SOURCE_RG \
  --name exportPipeline
```

## Troubleshooting

* **Template deployment failures or errors**
  * If a pipeline run fails, look at the `pipelineRunErrorMessage` property of the run resource.
  * For common template deployment errors, see [Troubleshoot ARM template deployments](../azure-resource-manager/templates/template-tutorial-troubleshoot.md)
* **Problems with export or import of storage blobs**
  * SAS token may be expired, or may have insufficient permissions for the specified export or import run
  * Existing storage blob in source storage account might not be overwritten during multiple export runs. Confirm that the OverwriteBlob option is set in the export run and the SAS token has
  * Storage blob in target storage account might not be deleted after successful import run. Confirm that the DeleteBlobOnSuccess option is set in the import run.
  * Container specified in export or import run does not exist, or specified storage blob doesn't exist for manual import run. 
* **Artifacts transfer problems**
  * Artifacts are transferred incompletely or not at all. Confirm spelling of artifacts in export run, and name of blob in export and import runs.
  * Pipeline run might not have completed. An export or import run can take some time, especially for a large number of artifacts. 
  * For other pipeline issues, provide the deployment `correlationId` of the export run or import run to the Azure Container Registry team.




<!-- LINKS - External -->


<!-- LINKS - Internal -->
[azure-cli]: /cli/azure/install-azure-cli
[az-identity-create]: /cli/azure/identity#az-identity-create
[az-identity-show]: /cli/azure/identity#az-identity-show
[az-login]: /cli/azure/reference-index#az-login
[az-keyvault-secret-set]: /cli/azure/keyvault/secret#az-keyvault-secret-set
[az-keyvault-secret-show]: /cli/azure/keyvault/secret#az-keyvault-secret-show
[az-keyvault-set-policy]: /cli/azure/keyvault#az-keyvault-set-policy
[az-storage-container-generate-sas]: /cli/azure/storage/container#az-storage-container-generate-sas
[az-deployment-group-create]: /cli/azure/deployment/group#az-deployment-group-create
[az-deployment-group-delete]: /cli/azure/deployment/group#az-deployment-group-delete
[az-acr-repository-list]: /cli/azure/acr/repository#az-acr-repository-list



