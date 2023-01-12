---
title: ACR Transfer Troubleshooting
description: Troubleshoot ACR Transfer
author: tejaswikolli-web
ms.author: tejaswikolli
ms.date: 10/11/2022
ms.topic: article
---

# ACR Transfer troubleshooting

## Template deployment failures or errors
  * If a pipeline run fails, look at the `pipelineRunErrorMessage` property of the run resource.
  * For common template deployment errors, see [Troubleshoot ARM template deployments](../azure-resource-manager/templates/template-tutorial-troubleshoot.md)
## Problems accessing Key Vault
  * If your pipelineRun deployment fails with a `403 Forbidden` error when accessing Azure Key Vault, verify that your pipeline managed identity has adequate permissions.
  * A pipelineRun uses the exportPipeline or importPipeline managed identity to fetch the SAS token secret from your Key Vault. ExportPipelines and importPipelines are provisioned with either a system-assigned or user-assigned managed identity. This managed identity is required to have `secret get` permissions on the Key Vault in order to read the SAS token secret. Ensure that an access policy for the managed identity was added to the Key Vault. For more information, reference [Give the ExportPipeline identity keyvault policy access](./container-registry-transfer-cli.md#give-the-exportpipeline-identity-keyvault-policy-access) and [Give the ImportPipeline identity keyvault policy access](./container-registry-transfer-cli.md#give-the-importpipeline-identity-keyvault-policy-access).
## Problems accessing storage
  * If you see a `403 Forbidden` error from storage, you likely have a problem with your SAS token.
  * The SAS token might not currently be valid. The SAS token might be expired or the storage account keys might have changed since the SAS token was created. Verify that the SAS token is valid by attempting to use the SAS token to authenticate for access to the storage account container. For example, put an existing blob endpoint followed by the SAS token in the address bar of a new Microsoft Edge InPrivate window or upload a blob to the container with the SAS token by using `az storage blob upload`.
  * The SAS token might not have sufficient Allowed Resource Types. Verify that the SAS token has been given permissions to Service, Container, and Object under Allowed Resource Types (`srt=sco` in the SAS token).
  * The SAS token might not have sufficient permissions. For export pipelines, the required SAS token permissions are Read, Write, List, and Add. For import pipelines, the required SAS token permissions are Read, Delete, and List. (The Delete permission is required only if the import pipeline has the `DeleteSourceBlobOnSuccess` option enabled.)
  * The SAS token might not be configured to work with HTTPS only. Verify that the SAS token is configured to work with HTTPS only (`spr=https` in the SAS token).
## Problems with export or import of storage blobs
  * SAS token may be invalid, or may have insufficient permissions for the specified export or import run. See [Problems accessing storage](#problems-accessing-storage).
  * Existing storage blob in source storage account might not be overwritten during multiple export runs. Confirm that the OverwriteBlob option is set in the export run and the SAS token has sufficient permissions.
  * Storage blob in target storage account might not be deleted after successful import run. Confirm that the DeleteBlobOnSuccess option is set in the import run and the SAS token has sufficient permissions.
  * Storage blob not created or deleted. Confirm that container specified in export or import run exists, or specified storage blob exists for manual import run.
## Problems with Source Trigger Imports
  * The SAS token must have the List permission for Source Trigger imports to work.
  * Source Trigger imports will only fire if the Storage Blob has a Last Modified time within the last 60 days.
  * The Storage Blob must have a valid ContentMD5 property in order to be imported by the Source Trigger feature.
  * The Storage Blob must have the "category":"acr-transfer-blob" blob metadata in order to be imported by the Source Trigger feature. This metadata is added automatically during an Export Pipeline Run, but may be stripped when moved from storage account to storage account depending on the method of copy.
## AzCopy issues
  * See [Troubleshoot AzCopy issues](../storage/common/storage-use-azcopy-configure.md).
## Artifacts transfer problems
  * Not all artifacts, or none, are transferred. Confirm spelling of artifacts in export run, and name of blob in export and import runs. Confirm you're transferring a maximum of 50 artifacts.
  * Pipeline run might not have completed. An export or import run can take some time.
  * For other pipeline issues, provide the deployment [correlation ID](../azure-resource-manager/templates/deployment-history.md) of the export run or import run to the Azure Container Registry team.
  * To create ACR Transfer resources such as `exportPipelines`,` importPipelines`, and `pipelineRuns`, the user must have at least Contributor access on the ACR subscription. Otherwise, they'll see authorization to perform the transfer denied or scope is invalid errors.
## Problems pulling the image in a physically isolated environment
  * If you see errors regarding foreign layers or attempts to resolve mcr.microsoft.com when attempting to pull an image in a physically isolated environment, your image manifest likely has non-distributable layers. Due to the nature of a physically isolated environment, these images will often fail to pull. You can confirm that this is the case by checking the image manifest for any references to external registries. If so, you'll need to push the non-distributable layers to your public cloud ACR prior to deploying an export pipeline-run for that image. For guidance on how to do this, see [How do I push non-distributable layers to a registry?](./container-registry-faq.yml#how-do-i-push-non-distributable-layers-to-a-registry-)

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
