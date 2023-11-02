---
title: ACR Transfer with Az CLI
description: Use ACR Transfer with Az CLI
ms.topic: article
author: tejaswikolli-web
ms.author: tejaswikolli
ms.date: 10/11/2022
ms.custom: devx-track-azurecli
---

# ACR Transfer with Az CLI

This article shows how to use the ACR Transfer feature with the acrtransfer Az CLI extension.

## Complete prerequisites

Please complete the prerequisites outlined [here](./container-registry-transfer-prerequisites.md) prior to attempting the actions in this article. This means that:

- You have an existing Premium SKU Registry in both clouds.
- You have an existing Storage Account Container in both clouds.
- You have an existing Keyvault with a secret containing a valid SAS token with the necessary permissions in both clouds.
- You have a recent version of Az CLI installed in both clouds.

## Install the Az CLI extension

In AzureCloud, you can install the extension with the following command:

```azurecli
az extension add --name acrtransfer
```

In AzureCloud and other clouds, you can install the blob directly from a public storage account container. The blob is hosted in the `acrtransferext` storage account, `dist` container, `acrtransfer-1.0.0-py2.py3-none-any.wh` blob. You may need to change the storage URI suffix depending on which cloud you are in. The following will install in AzureCloud:

```azurecli
az extension add --source https://acrtransferext.blob.core.windows.net/dist/acrtransfer-1.0.0-py2.py3-none-any.whl
```

## Create ExportPipeline with the acrtransfer Az CLI extension

Create an ExportPipeline resource for your AzureCloud container registry using the acrtransfer Az CLI extension.

Create an export pipeline with no options and a system-assigned identity:

```azurecli
az acr export-pipeline create \
--resource-group $MyRG \
--registry $MyReg \
--name $MyPipeline \
--secret-uri https://$MyKV.vault.azure.net/secrets/$MySecret \
--storage-container-uri https://$MyStorage.blob.core.windows.net/$MyContainer
```

Create an export pipeline with all possible options and a user-assigned identity:

```azurecli
az acr export-pipeline create \
--resource-group $MyRG \
--registry $MyReg \
--name $MyPipeline \
--secret-uri https://$MyKV.vault.azure.net/secrets/$MySecret \
--storage-container-uri https://$MyStorage.blob.core.windows.net/$MyContainer \
--options OverwriteBlobs ContinueOnErrors \
--assign-identity /subscriptions/$MySubID/resourceGroups/$MyRG/providers/Microsoft.ManagedIdentity/userAssignedIdentities/$MyIdentity
```

### Export options

The `options` property for the export pipelines supports optional boolean values. The following values are recommended:

|Parameter  |Value  |
|---------|---------|
|options | OverwriteBlobs - Overwrite existing target blobs<br/>ContinueOnErrors - Continue export of remaining artifacts in the source registry if one artifact export fails.

### Give the ExportPipeline identity keyvault policy access

If you created your pipeline with a user-assigned identity, simply give this user-assigned identity `secret get` access policy permissions on the keyvault.

If you created your pipeline with a system-assigned identity, you will first need to retrieve the principalId that the system has assigned to your pipeline resource.

Run the following command to retrieve your pipeline resource:

```azurecli
az acr export-pipeline show --resource-group $MyRG --registry $MyReg --name $MyPipeline
```

From this output, you will want to copy the value in the `principalId` field.

Then, you will run the following command to give this principal the appropriate `secret get` access policy permissions on your keyvault.

```azurecli
az keyvault set-policy --name $MyKeyvault --secret-permissions get --object-id $MyPrincipalID
```

## Create ImportPipeline with the acrtransfer Az CLI extension

Create an ImportPipeline resource in your target container registry using the acrtransfer Az CLI extension. By default, the pipeline is enabled to create an Import PipelineRun automatically when the attached storage account container receives a new artifact blob.

Create an import pipeline with no options and a system-assigned identity:

```azurecli
az acr import-pipeline create \
--resource-group $MyRG \
--registry $MyReg \
--name $MyPipeline \
--secret-uri https://$MyKV.vault.azure.net/secrets/$MySecret \
--storage-container-uri https://$MyStorage.blob.core.windows.net/$MyContainer
```

Create an import pipeline with all possible options, source-trigger disabled, and a user-assigned identity:

```azurecli
az acr import-pipeline create \
--resource-group $MyRG \
--registry $MyReg \
--name $MyPipeline \
--secret-uri https://$MyKV.vault.azure.net/secrets/$MySecret \
--storage-container-uri https://$MyStorage.blob.core.windows.net/$MyContainer \
--options DeleteSourceBlobOnSuccess OverwriteTags ContinueOnErrors \
--assign-identity /subscriptions/$MySubID/resourceGroups/$MyRG/providers/Microsoft.ManagedIdentity/userAssignedIdentities/$MyIdentity \
--source-trigger-enabled False
```

### Import options

The `options` property for the import pipeline supports optional boolean values. The following values are recommended:

|Parameter  |Value  |
|---------|---------|
|options | OverwriteTags - Overwrite existing target tags<br/>DeleteSourceBlobOnSuccess - Delete the source storage blob after successful import to the target registry<br/>ContinueOnErrors - Continue import of remaining artifacts in the target registry if one artifact import fails.

### Give the ImportPipeline identity keyvault policy access

If you created your pipeline with a user-assigned identity, simply give this user-assigned identity `secret get` access policy permissions on the keyvault.

If you created your pipeline with a system-assigned identity, you will first need to retrieve the principalId that the system has assigned to your pipeline resource.

Run the following command to retrieve your pipeline resource:

```azurecli
az acr import-pipeline show --resource-group $MyRG --registry $MyReg --name $MyPipeline
```

From this output, you will want to copy the value in the `principalId` field.

Then, you will run the following command to give this principal the appropriate `secret get` access policy on your keyvault.

```azurecli
az keyvault set-policy --name $MyKeyvault --secret-permissions get --object-id $MyPrincipalID
```

## Create PipelineRun for export with the acrtransfer Az CLI extension

Create a PipelineRun resource for your container registry using the acrtransfer Az CLI extension. This resource runs the ExportPipeline resource you created previously and exports specified artifacts from your container registry as a blob to your storage account container.

Create an export pipeline-run:

```azurecli
az acr pipeline-run create \
--resource-group $MyRG \
--registry $MyReg \
--pipeline $MyPipeline \
--name $MyPipelineRun \
--pipeline-type export \
--storage-blob $MyBlob \
--artifacts hello-world:latest hello-world@sha256:90659bf80b44ce6be8234e6ff90a1ac34acbeb826903b02cfa0da11c82cbc042 \
--force-redeploy
```

If redeploying a PipelineRun resource with identical properties, you must use the --force-redeploy flag.

It can take several minutes for artifacts to export. When deployment completes successfully, verify artifact export by listing the exported blob in the container of the source storage account. For example, run the [az storage blob list][az-storage-blob-list] command:

```azurecli
az storage blob list --account-name $MyStorageAccount --container $MyContainer --output table
```

## Transfer blob across domain

In most use-cases, you will now use a Cross Domain Solution or other method to transfer your blob from the storage account in your source domain (the storage account associated with your export pipeline) to the storage account in your target domain (the storage account associated with your import pipeline). At this point, we will assume that the blob has arrived in the target domain storage account associated with your import pipeline.

## Trigger ImportPipeline resource

If you did not use the `--source-trigger-enabled False` parameter when creating your import pipeline, the pipeline will be triggered within 15 minutes after the blob arrives in the storage account container. It can take several minutes for artifacts to import. When the import completes successfully, verify artifact import by listing the tags on the repository you are importing in the target container registry. For example, run [az acr repository show-tags][az-acr-repository-show-tags]:

```azurecli
az acr repository show-tags --name $MyRegistry --repository $MyRepository
```

> [!Note]
> Source Trigger will only import blobs that have a Last Modified time within the last 60 days. If you intend to use Source Trigger to import blobs older than that, please refresh the Last Modified time of the blobs by add blob metadata to them or else import them with manually created pipeline runs.

If you did use the `--source-trigger-enabled False` parameter when creating your ImportPipeline, you will need to create a PipelineRun manually, as shown in the following section.

## Create PipelineRun for import with the acrtransfer Az CLI extension

Create a PipelineRun resource for your container registry using the acrtransfer Az CLI extension. This resource runs the ImportPipeline resource you created previously and imports specified blobs from your storage account into your container registry.

Create an import pipeline-run:

```azurecli
az acr pipeline-run create \
--resource-group $MyRG \
--registry $MyReg \
--pipeline $MyPipeline \
--name $MyPipelineRun \
--pipeline-type import \
--storage-blob $MyBlob \
--force-redeploy
```

If redeploying a PipelineRun resource with identical properties, you must use the --force-redeploy flag.

It can take several minutes for artifacts to import. When the import completes successfully, verify artifact import by listing the repositories in the target container registry. For example, run [az acr repository show-tags][az-acr-repository-show-tags]:

```azurecli
az acr repository show-tags --name $MyRegistry --repository $MyRepository
```

## Delete ACR Transfer resources

Delete an ExportPipeline:

```azurecli
az acr export-pipeline delete --resource-group $MyRG --registry $MyReg --name $MyPipeline
```

Delete an ImportPipeline:

```azurecli
az acr import-pipeline delete --resource-group $MyRG --registry $MyReg --name $MyPipeline
```

Delete a PipelineRun resource. Note that this does not reverse the action taken by the PipelineRun. This is more like deleting the log of the PipelineRun.

```azurecli
az acr pipeline-run delete --resource-group $MyRG --registry $MyReg --name $MyPipelineRun
```

## ACR Transfer troubleshooting

View [ACR Transfer Troubleshooting](container-registry-transfer-troubleshooting.md) for troubleshooting guidance.

## Next steps

* Learn how to [block creation of export pipelines](data-loss-prevention.md) from a network-restricted container registry.

<!-- LINKS - External -->
[terms-of-use]: https://azure.microsoft.com/support/legal/preview-supplemental-terms/

<!-- LINKS - Internal -->
[azure-cli]: /cli/azure/install-azure-cli
[az-login]: /cli/azure/reference-index#az-login
[az-keyvault-secret-set]: /cli/azure/keyvault/secret#az-keyvault-secret-set
[az-keyvault-secret-show]: /cli/azure/keyvault/secret#az-keyvault-secret-show
[az-keyvault-set-policy]: /cli/azure/keyvault#az-keyvault-set-policy
[az-storage-container-generate-sas]: /cli/azure/storage/container#az-storage-container-generate-sas
[az-storage-blob-list]: /cli/azure/storage/blob#az-storage-blob-list
[az-deployment-group-create]: /cli/azure/deployment/group#az-deployment-group-create
[az-deployment-group-delete]: /cli/azure/deployment/group#az-deployment-group-delete
[az-deployment-group-show]: /cli/azure/deployment/group#az-deployment-group-show
[az-acr-repository-show-tags]: /cli/azure/acr/repository##az_acr_repository_show_tags
[az-acr-import]: /cli/azure/acr#az-acr-import
[az-resource-delete]: /cli/azure/resource#az-resource-delete
