---
title: ACR Transfer with Arm Templates
description: ACR Transfer with Az CLI with ARM templates
ms.topic: article
author: tejaswikolli-web
ms.author: tejaswikolli
ms.date: 10/11/2022
ms.custom: devx-track-azurecli
---

# ACR Transfer with ARM templates

## Complete Prerequisites

Please complete the prerequisites outlined [here](./container-registry-transfer-prerequisites.md) prior to attempting the actions in this article. This means that:

- You have an existing Premium SKU Registry in both clouds.
- You have an existing Storage Account Container in both clouds.
- You have an existing Keyvault with a secret containing a valid SAS token with the necessary permissions in both clouds.
- You have a recent version of Az CLI installed in both clouds.

> [!IMPORTANT]
- The ACR Transfer supports artifacts with the layer size limits to 8 GB due to the technical limitations.

## Consider using the Az CLI extension

For most nonautomated use-cases, we recommend using the Az CLI Extension if possible. You can view documentation for the Az CLI Extension [here](./container-registry-transfer-cli.md).

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

Run [az deployment group create][az-deployment-group-create] to create a resource named *exportPipeline* as shown in the following examples. By default, with the first option, the example template enables a system-assigned identity in the ExportPipeline resource.

With the second option, you can provide the resource with a user-assigned identity. (Creation of the user-assigned identity not shown.)

With either option, the template configures the identity to access the SAS token in the export key vault.

#### Option 1: Create resource and enable system-assigned identity

```azurecli
az deployment group create \
  --resource-group $SOURCE_RG \
  --template-file azuredeploy.json \
  --name exportPipeline \
  --parameters azuredeploy.parameters.json
```

#### Option 2: Create resource and provide user-assigned identity

In this command, provide the resource ID of the user-assigned identity as an additional parameter.

```azurecli
az deployment group create \
  --resource-group $SOURCE_RG \
  --template-file azuredeploy.json \
  --name exportPipeline \
  --parameters azuredeploy.parameters.json \
  --parameters userAssignedIdentity="/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourcegroups/myResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/myUserAssignedIdentity"
```

In the command output, take note of the resource ID (`id`) of the pipeline. You can store this value in an environment variable for later use by running the [az deployment group show][az-deployment-group-show]. For example:

```azurecli
EXPORT_RES_ID=$(az deployment group show \
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
|sourceUri     |  URI of the storage container in your target environment (the source for the import pipeline).<br/>Example: `https://targetstorage.blob.core.windows.net/transfer`|
|keyVaultName     |  Name of the target key vault |
|sasTokenSecretName     |  Name of the SAS token secret in the target key vault<br/>Example: acr importsas |

### Import options

The `options` property for the import pipeline supports optional boolean values. The following values are recommended:

|Parameter  |Value  |
|---------|---------|
|options | OverwriteTags - Overwrite existing target tags<br/>DeleteSourceBlobOnSuccess - Delete the source storage blob after successful import to the target registry<br/>ContinueOnErrors - Continue import of remaining artifacts in the target registry if one artifact import fails.

### Create the resource

Run [az deployment group create][az-deployment-group-create] to create a resource named *importPipeline* as shown in the following examples. By default, with the first option, the example template enables a system-assigned identity in the ImportPipeline resource.

With the second option, you can provide the resource with a user-assigned identity. (Creation of the user-assigned identity not shown.)

With either option, the template configures the identity to access the SAS token in the import key vault.

#### Option 1: Create resource and enable system-assigned identity

```azurecli
az deployment group create \
  --resource-group $TARGET_RG \
  --template-file azuredeploy.json \
  --name importPipeline \
  --parameters azuredeploy.parameters.json
```

#### Option 2: Create resource and provide user-assigned identity

In this command, provide the resource ID of the user-assigned identity as an additional parameter.

```azurecli
az deployment group create \
  --resource-group $TARGET_RG \
  --template-file azuredeploy.json \
  --name importPipeline \
  --parameters azuredeploy.parameters.json \
  --parameters userAssignedIdentity="/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourcegroups/myResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/myUserAssignedIdentity"
```

If you plan to run the import manually, take note of the resource ID (`id`) of the pipeline. You can store this value in an environment variable for later use by running the [az deployment group show][az-deployment-group-show] command. For example:

```azurecli
IMPORT_RES_ID=$(az deployment group show \
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

If redeploying a PipelineRun resource with identical properties, you must also use the [forceUpdateTag](#redeploy-pipelinerun-resource) property.

Run [az deployment group create][az-deployment-group-create] to create the PipelineRun resource. The following example names the deployment *exportPipelineRun*.

```azurecli
az deployment group create \
  --resource-group $SOURCE_RG \
  --template-file azuredeploy.json \
  --name exportPipelineRun \
  --parameters azuredeploy.parameters.json
```

For later use, store the resource ID of the pipeline run in an environment variable:

```azurecli
EXPORT_RUN_RES_ID=$(az deployment group show \
  --resource-group $SOURCE_RG \
  --name exportPipelineRun \
  --query 'properties.outputResources[0].id' \
  --output tsv)
```

It can take several minutes for artifacts to export. When deployment completes successfully, verify artifact export by listing the exported blob in the *transfer* container of the source storage account. For example, run the [az storage blob list][az-storage-blob-list] command:

```azurecli
az storage blob list \
  --account-name $SOURCE_SA \
  --container transfer \
  --output table
```

## Transfer blob (optional)

Use the AzCopy tool or other methods to [transfer blob data](../storage/common/storage-use-azcopy-v10.md#transfer-data) from the source storage account to the target storage account.

For example, the following [`azcopy copy`](../storage/common/storage-ref-azcopy-copy.md) command copies myblob from the *transfer* container in the source account to the *transfer* container in the target account. If the blob exists in the target account, it's overwritten. Authentication uses SAS tokens with appropriate permissions for the source and target containers. (Steps to create tokens aren't shown.)

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

> [!Note]
> Source Trigger will only import blobs that have a Last Modified time within the last 60 days. If you intend to use Source Trigger to import blobs older than that, please refresh the Last Modified time of the blobs by add blob metadata to them or else import them with manually created pipeline runs.

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

If redeploying a PipelineRun resource with identical properties, you must also use the [forceUpdateTag](#redeploy-pipelinerun-resource) property.

Run [az deployment group create][az-deployment-group-create] to run the resource.

```azurecli
az deployment group create \
  --resource-group $TARGET_RG \
  --name importPipelineRun \
  --template-file azuredeploy.json \
  --parameters azuredeploy.parameters.json
```

For later use, store the resource ID of the pipeline run in an environment variable:

```azurecli
IMPORT_RUN_RES_ID=$(az deployment group show \
  --resource-group $TARGET_RG \
  --name importPipelineRun \
  --query 'properties.outputResources[0].id' \
  --output tsv)
```

When deployment completes successfully, verify artifact import by listing the repositories in the target container registry. For example, run [az acr repository list][az-acr-repository-list]:

```azurecli
az acr repository list --name <target-registry-name>
```

## Redeploy PipelineRun resource

If redeploying a PipelineRun resource with *identical properties*, you must leverage the **forceUpdateTag** property. This property indicates that the PipelineRun resource should be recreated even if the configuration has not changed. Ensure forceUpdateTag is different each time you redeploy the PipelineRun resource. The example below recreates a PipelineRun for export. The current datetime is used to set forceUpdateTag, thereby ensuring this property is always unique.

```console
CURRENT_DATETIME=`date +"%Y-%m-%d:%T"`
```

```azurecli
az deployment group create \
  --resource-group $SOURCE_RG \
  --template-file azuredeploy.json \
  --name exportPipelineRun \
  --parameters azuredeploy.parameters.json \
  --parameters forceUpdateTag=$CURRENT_DATETIME
```

## Delete pipeline resources

The following example commands use [az resource delete][az-resource-delete] to delete the pipeline resources created in this article. The resource IDs were previously stored in environment variables.

```
# Delete export resources
az resource delete \
--resource-group $SOURCE_RG \
--ids $EXPORT_RES_ID $EXPORT_RUN_RES_ID \
--api-version 2019-12-01-preview

# Delete import resources
az resource delete \
--resource-group $TARGET_RG \
--ids $IMPORT_RES_ID $IMPORT_RUN_RES_ID \
--api-version 2019-12-01-preview
```

## ACR Transfer troubleshooting

View [ACR Transfer Troubleshooting](container-registry-transfer-troubleshooting.md) for troubleshooting guidance.

## Next steps

* Learn how to [block creation of export pipelines](data-loss-prevention.md) from a network-restricted container registry.

<!-- LINKS - External -->
[terms-of-use]: https://azure.microsoft.com/support/legal/preview-supplemental-terms/



<!-- LINKS - Internal -->
[azure-cli]: /cli/azure/install-azure-cli
[az-login]: /cli/azure/reference-index#az_login
[az-keyvault-secret-set]: /cli/azure/keyvault/secret#az_keyvault_secret_set
[az-keyvault-secret-show]: /cli/azure/keyvault/secret#az_keyvault_secret_show
[az-keyvault-set-policy]: /cli/azure/keyvault#az_keyvault_set_policy
[az-storage-container-generate-sas]: /cli/azure/storage/container#az_storage_container_generate_sas
[az-storage-blob-list]: /cli/azure/storage/blob#az_storage-blob-list
[az-deployment-group-create]: /cli/azure/deployment/group#az_deployment_group_create
[az-deployment-group-delete]: /cli/azure/deployment/group#az_deployment_group_delete
[az-deployment-group-show]: /cli/azure/deployment/group#az_deployment_group_show
[az-acr-repository-list]: /cli/azure/acr/repository#az_acr_repository_list
[az-acr-import]: /cli/azure/acr#az_acr_import
[az-resource-delete]: /cli/azure/resource#az_resource_delete
