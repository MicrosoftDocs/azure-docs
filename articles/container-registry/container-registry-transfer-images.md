---
title: Transfer artifacts
description: Transfer collections of images or other artifacts from one container registry to another registry by creating a transfer pipeline using Azure storage accounts
ms.topic: article
ms.date: 05/08/2020
ms.custom: 
---

# Transfer artifacts to another registry

This article shows how to transfer collections of images or other registry artifacts from one Azure container registry to another registry. The source and target registries can be in the same or different subscriptions, Active Directory tenants, Azure clouds, or physically disconnected clouds. 

To transfer artifacts, you create a *transfer pipeline* that replicates artifacts between two registries by using [blob storage](../storage/blobs/storage-blobs-introduction.md):

* Artifacts from a source registry are exported to a blob in a source storage account 
* The blob is copied from the source storage account to a target storage account
* The blob in the target storage account gets imported as artifacts in the target registry. You can set up the import pipeline to trigger whenever the artifact blob updates in the target storage.

Transfer is ideal for copying content between two Azure container registries in physically disconnected clouds, mediated by storage accounts in each cloud. For image copy from container registries in connected clouds including Docker Hub and other cloud vendors, [image import](container-registry-import-images.md) is recommended instead.

In this article, you use Azure Resource Manager template deployments to create and run the transfer pipeline. The Azure CLI is used to provision the associated resources such as storage secrets. Azure CLI version 2.2.0 or later is recommended. If you need to install or upgrade the CLI, see [Install Azure CLI][azure-cli].

This feature is available in the **Premium** container registry service tier. For information about registry service tiers and limits, see [Azure Container Registry tiers](container-registry-skus.md).

> [!IMPORTANT]
> This feature is currently in preview. Previews are made available to you on the condition that you agree to the [supplemental terms of use][terms-of-use]. Some aspects of this feature may change prior to general availability (GA).

## Prerequisites

* **Container registries** - You need an existing source registry with artifacts to transfer, and a target registry. ACR transfer is intended for movement across physically disconnected clouds. For testing, the source and target registries can be in the same or a different Azure subscription, Active Directory tenant, or cloud. If you need to create a registry, see [Quickstart: Create a private container registry using the Azure CLI](container-registry-get-started-azure-cli.md). 
* **Storage accounts** - Create source and target storage accounts in a subscription and location of your choice. For testing purposes, you can use the same subscription or subscriptions as your source and target registries. For cross-cloud scenarios, typically you create a separate storage account in each cloud. If needed, create the storage accounts with the [Azure CLI](../storage/common/storage-account-create.md?tabs=azure-cli) or other tools. 

  Create a blob container for artifact transfer in each account. For example, create a container named *transfer*. Two or more transfer pipelines can share the same storage account, but should use different storage container scopes.
* **Key vaults** - Key vaults are needed to store SAS token secrets used to access source and target storage accounts. Create the source and target key vaults in the same Azure subscription or subscriptions as your source and target registries. If needed, create key vaults with the [Azure CLI](../key-vault/quick-create-cli.md) or other tools.
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

You create the following three pipeline resources for image transfer between registries. All are created using PUT operations. These resources operate on your *source* and *target* registries and storage accounts. 

Storage authentication uses SAS tokens, managed as secrets in key vaults. The pipelines use managed identities to read the secrets in the vaults.

* **[ExportPipeline](#create-exportpipeline-with-resource-manager)** - Long-lasting resource that contains high-level information about the *source* registry and storage account. This information includes the source storage blob container URI and the key vault managing the source SAS token. 
* **[ImportPipeline](#create-importpipeline-with-resource-manager)** - Long-lasting resource that contains high-level information about the *target* registry and storage account. This information includes the target storage blob container URI and the key vault managing the target SAS token. An import trigger is enabled by default, so the pipeline runs automatically when an artifact blob lands in the target storage container. 
* **[PipelineRun](#create-pipelinerun-for-export-with-resource-manager)** - Resource used to invoke either an ExportPipeline or ImportPipeline resource.  
  * You run the ExportPipeline manually by creating a PipelineRun resource and specify the artifacts to export.  
  * If an import trigger is enabled, the ImportPipeline runs automatically. It can also be run manually using a PipelineRun. 
  * Currently a maximum of **10 artifacts** can be transferred with each PipelineRun.

### Things to know
* The ExportPipeline and ImportPipeline will typically be in different Active Directory tenants associated with the source and destination clouds. This scenario requires separate managed identities and key vaults for the export and import resources. For testing purposes, these resources can be placed in the same cloud, sharing identities.
* The pipeline examples create system-assigned managed identities to access key vault secrets. ExportPipelines and ImportPipelines also support user-assigned identities. In this case, you must configure the key vaults with access policies for the identities. 

## Create and store SAS keys

Transfer uses shared access signature (SAS) tokens to access the storage accounts in the source and target environments. Generate and store tokens as described in the following sections.  

### Generate SAS token for export

Run the [az storage container generate-sas][az-storage-container-generate-sas] command to generate a SAS token for the container in the source storage account, used for artifact export.

*Recommended token permissions*: Read, Write, List, Add. 

In the following example, command output is assigned to the EXPORT_SAS environment variable, prefixed with the '?' character. Update the `--expiry` value for your environment:

```azurecli
EXPORT_SAS=?$(az storage container generate-sas \
  --name transfer \
  --account-name $SOURCE_SA \
  --expiry 2021-01-01 \
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

### Generate SAS token for import

Run the [az storage container generate-sas][az-storage-container-generate-sas] command to generate a SAS token for the container in the target storage account, used for artifact import.

*Recommended token permissions*: Read, Delete, List

In the following example, command output is assigned to the IMPORT_SAS environment variable, prefixed with the '?' character. Update the `--expiry` value for your environment:

```azurecli
IMPORT_SAS=?$(az storage container generate-sas \
  --name transfer \
  --account-name $TARGET_SA \
  --expiry 2021-01-01 \
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

## Create ExportPipeline with Resource Manager

Create an ExportPipeline resource for your source container registry using Azure Resource Manager template deployment.

Copy ExportPipeline Resource Manager [template files](https://github.com/Azure/acr/tree/master/docs/image-transfer/ExportPipelines) to a local folder.

Enter the following parameter values in the file `azuredeploy.parameters.json`:

|Parameter  |Value  |
|---------|---------|
|registryName     | Name of your source container registry      |
|exportPipelineName     |  Name you choose for the export pipeline       |
|targetUri     |  URI of the storage container in your source environment (the target of the export pipeline).<br/>Example: `https://sourcestorage.blob.core.windows.net/transfer`       |
|keyVaultName     |  Name of the source key vault  |
|sasTokenSecretName  | Name of the SAS token secret in the source key vault <br/>Example: acrexportsas

### Export options

The `options` property for the export pipelines supports optional boolean values. The following values are recommended:

|Parameter  |Value  |
|---------|---------|
|options | OverwriteBlobs - Overwrite existing target blobs<br/>ContinueOnErrors - Continue export of remaining artifacts in the source registry if one artifact export fails.

### Create the resource

Run [az deployment group create][az-deployment-group-create] to create the resource. The following example names the deployment *exportPipeline*.

```azurecli
az deployment group create \
  --resource-group $SOURCE_RG \
  --template-file azuredeploy.json \
  --name exportPipeline \
  --parameters azuredeploy.parameters.json
```

In the command output, take note of the resource ID (`id`) of the pipeline. You can store this value in an environment variable for later use by running the [az deployment group show][az-deployment-group-show]. For example:

```azurecli
EXPORT_RES_ID=$(az group deployment show \
  --resource-group $SOURCE_RG \
  --name exportPipeline \
  --query 'properties.outputResources[1].id' \
  --output tsv)
```

## Create ImportPipeline with Resource Manager 

Create an ImportPipeline resource in your target container registry using Azure Resource Manager template deployment. By default, the pipeline is enabled to import automatically when the storage account in the target environment has an artifact blob.

Copy ImportPipeline Resource Manager [template files](https://github.com/Azure/acr/tree/master/docs/image-transfer/ImportPipelines) to a local folder.

Enter the following parameter values in the file `azuredeploy.parameters.json`:

Parameter  |Value  |
|---------|---------|
|registryName     | Name of your target container registry      |
|importPipelineName     |  Name you choose for the import pipeline       |
|sourceUri     |  URI of the storage container in your target environment (the source for the import pipeline).<br/>Example: `https://targetstorage.blob.core.windows.net/transfer/`|
|keyVaultName     |  Name of the target key vault |
|sasTokenSecretName     |  Name of the SAS token secret in the target key vault<br/>Example: acr importsas |

### Import options

The `options` property for the import pipeline supports optional boolean values. The following values are recommended:

|Parameter  |Value  |
|---------|---------|
|options | OverwriteTags - Overwrite existing target tags<br/>DeleteSourceBlobOnSuccess - Delete the source storage blob after successful import to the target registry<br/>ContinueOnErrors - Continue import of remaining artifacts in the target registry if one artifact import fails.

### Create the resource

Run [az deployment group create][az-deployment-group-create] to create the resource.

```azurecli
az deployment group create \
  --resource-group $TARGET_RG \
  --template-file azuredeploy.json \
  --parameters azuredeploy.parameters.json \
  --name importPipeline
```

If you plan to run the import manually, take note of the resource ID (`id`) of the pipeline. You can store this value in an environment variable for later use by running the [az deployment group show][az-deployment-group-show]. For example:

```azurecli
IMPORT_RES_ID=$(az group deployment show \
  --resource-group $TARGET_RG \
  --name importPipeline \
  --query 'properties.outputResources[1].id' \
  --output tsv)
```

## Create PipelineRun for export with Resource Manager 

Create a PipelineRun resource for your source container registry using Azure Resource Manager template deployment. This resource runs the ExportPipeline resource you created previously, and exports specified artifacts from your container registry as a blob to your source storage account.

Copy PipelineRun Resource Manager [template files](https://github.com/Azure/acr/tree/master/docs/image-transfer/PipelineRun/PipelineRun-Export) to a local folder.

Enter the following parameter values in the file `azuredeploy.parameters.json`:

|Parameter  |Value  |
|---------|---------|
|registryName     | Name of your source container registry      |
|pipelineRunName     |  Name you choose for the run       |
|pipelineResourceId     |  Resource ID of the export pipeline.<br/>Example: `/subscriptions/<subscriptionID>/resourceGroups/<resourceGroupName>/providers/Microsoft.ContainerRegistry/registries/<sourceRegistryName>/exportPipelines/myExportPipeline`|
|targetName     |  Name you choose for the artifacts blob exported to your source storage account, such as *myblob*
|artifacts | Array of source artifacts to transfer, as tags or manifest digests<br/>Example: `[samples/hello-world:v1", "samples/nginx:v1" , "myrepository@sha256:0a2e01852872..."]` |

Run [az deployment group create][az-deployment-group-create] to create the PipelineRun resource. The following example names the deployment *exportPipelineRun*.

```azurecli
az deployment group create \
  --resource-group $SOURCE_RG \
  --template-file azuredeploy.json \
  --name exportPipelineRun \
  --parameters azuredeploy.parameters.json
```

It can take several minutes for artifacts to export. When deployment completes successfully, verify artifact export by listing the exported blob in the *transfer* container of the source storage account. For example, run the [az storage blob list][az-storage-blob-list] command:

```azurecli
az storage blob list \
  --account-name $SA_SOURCE
  --container transfer
  --output table
```

## Transfer blob (optional) 

Use the AzCopy tool or other methods to [transfer blob data](../storage/common/storage-use-azcopy-blobs.md#copy-blobs-between-storage-accounts) from the source storage account to the target storage account.

For example, the following [`azcopy copy`](/azure/storage/common/storage-ref-azcopy-copy) command copies myblob from the *transfer* container in the source account to the *transfer* container in the target account. If the blob exists in the target account, it's overwritten. Authentication uses SAS tokens with appropriate permissions for the source and target containers. (Steps to create tokens are not shown.)

```console
azcopy copy \
  'https://<source-storage-account-name>.blob.core.windows.net/transfer/myblob'$SOURCE_SAS \
  'https://<destination-storage-account-name>.blob.core.windows.net/transfer/myblob'$TARGET_SAS \
  --overwrite true
```

## Trigger ImportPipeline resource

If you enabled the `sourceTriggerStatus` parameter of the ImportPipeline (the default value), the pipeline is triggered after the blob is copied to the target storage account. It can take several minutes for artifacts to import. When the import completes successfully, verify artifact import by listing the repositories in the target container registry. For example, run [az acr repository list][az-acr-repository-list]:

```azurecli
az acr repository list --name <target-registry-name>
```

If you didn't enable the `sourceTriggerStatus` parameter of the import pipeline, run the ImportPipeline resource manually, as shown in the following section. 

## Create PipelineRun for import with Resource Manager (optional) 
 
You can also use a PipelineRun resource to trigger an ImportPipeline for artifact import to your target container registry.

Copy PipelineRun Resource Manager [template files](https://github.com/Azure/acr/tree/master/docs/image-transfer/PipelineRun/PipelineRun-Import) to a local folder.

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
  --resource-group $TARGET_RG \
  --template-file azuredeploy.json \
  --parameters azuredeploy.parameters.json
```

When deployment completes successfully, verify artifact import by listing the repositories in the target container registry. For example, run [az acr repository list][az-acr-repository-list]:

```azurecli
az acr repository list --name <target-registry-name>
```

## Delete pipeline resources

To delete a pipeline resource, delete its Resource Manager deployment by using the [az deployment group delete][az-deployment-group-delete] command. The following examples delete the pipeline resources created in this article:

```azurecli
az deployment group delete \
  --resource-group $SOURCE_RG \
  --name exportPipeline

az deployment group delete \
  --resource-group $SOURCE_RG \
  --name exportPipelineRun

az deployment group delete \
  --resource-group $TARGET_RG \
  --name importPipeline  
```

## Troubleshooting

* **Template deployment failures or errors**
  * If a pipeline run fails, look at the `pipelineRunErrorMessage` property of the run resource.
  * For common template deployment errors, see [Troubleshoot ARM template deployments](../azure-resource-manager/templates/template-tutorial-troubleshoot.md)
* **Problems with export or import of storage blobs**
  * SAS token may be expired, or may have insufficient permissions for the specified export or import run
  * Existing storage blob in source storage account might not be overwritten during multiple export runs. Confirm that the OverwriteBlob option is set in the export run and the SAS token has sufficient permissions.
  * Storage blob in target storage account might not be deleted after successful import run. Confirm that the DeleteBlobOnSuccess option is set in the import run and the SAS token has sufficient permissions.
  * Storage blob not created or deleted. Confirm that container specified in export or import run exists, or specified storage blob exists for manual import run. 
* **AzCopy issues**
  * See [Troubleshoot AzCopy issues](../storage/common/storage-use-azcopy-configure.md#troubleshoot-issues).  
* **Artifacts transfer problems**
  * Not all artifacts, or none, are transferred. Confirm spelling of artifacts in export run, and name of blob in export and import runs. Confirm you are transferring a maximum of 10 artifacts.
  * Pipeline run might not have completed. An export or import run can take some time. 
  * For other pipeline issues, provide the deployment [correlation ID](../azure-resource-manager/templates/deployment-history.md) of the export run or import run to the Azure Container Registry team.


## Next steps

To import single container images to an Azure container registry from a public registry or another private registry, see the [az acr import][az-acr-import] command reference.

<!-- LINKS - External -->
[terms-of-use]: https://azure.microsoft.com/support/legal/preview-supplemental-terms/



<!-- LINKS - Internal -->
[azure-cli]: /cli/azure/install-azure-cli
[az-identity-create]: /cli/azure/identity#az-identity-create
[az-identity-show]: /cli/azure/identity#az-identity-show
[az-login]: /cli/azure/reference-index#az-login
[az-keyvault-secret-set]: /cli/azure/keyvault/secret#az-keyvault-secret-set
[az-keyvault-secret-show]: /cli/azure/keyvault/secret#az-keyvault-secret-show
[az-keyvault-set-policy]: /cli/azure/keyvault#az-keyvault-set-policy
[az-storage-container-generate-sas]: /cli/azure/storage/container#az-storage-container-generate-sas
[az-storage-blob-list]: /cli/azure/storage/blob#az-storage-blob-list
[az-deployment-group-create]: /cli/azure/deployment/group#az-deployment-group-create
[az-deployment-group-delete]: /cli/azure/deployment/group#az-deployment-group-delete
[az-deployment-group-show]: /cli/azure/deployment/group#az-deployment-group-show
[az-acr-repository-list]: /cli/azure/acr/repository#az-acr-repository-list
[az-acr-import]: /cli/azure/acr#az-acr-import



