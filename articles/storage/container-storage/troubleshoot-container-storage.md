---
title: Troubleshoot Azure Container Storage
description: Troubleshoot common issues with Azure Container Storage.
author: khdownie
ms.service: azure-container-storage
ms.date: 03/05/2024
ms.author: kendownie
ms.topic: conceptual
---

# Troubleshoot Azure Container Storage

[Azure Container Storage](container-storage-introduction.md) is a cloud-based volume management, deployment, and orchestration service built natively for containers. Use this article to troubleshoot common issues with Azure Container Storage and find resolutions to problems.

## Extension operation fails when installing Azure Container Storage

You might see this error when trying to install Azure Container Storage: *(ExtensionOperationFailed) The extension operation failed with the following error: Unable to get the status from the local CRD with the error : {Error : Retry for given duration didn't get any results with err {status not populated}}?*

This error is due to a lack of permissions for Azure Container Storage to install and deploy storage in your AKS Cluster. Azure Container Storage is deployed using an ARC extension. To resolve this, you must [assign the Contributor role](install-container-storage-aks.md#assign-contributor-role-to-aks-managed-identity) to the AKS managed identity.

## Can't delete resource group containing AKS cluster

If you've created an Elastic SAN storage pool, you might not be able to delete the resource group in which your AKS cluster is located.

To resolve this, sign in to the [Azure portal](https://portal.azure.com?azure-portal=true) and select **Resource groups**. Locate the resource group that AKS created (the resource group name starts with **MC_**). Select the SAN resource object within that resource group. Manually remove all volumes and volume groups. Then retry deleting the resource group that includes your AKS cluster.

## See also

- [Azure Container Storage FAQ](container-storage-faq.md)
