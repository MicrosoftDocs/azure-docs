---
title: How to push and pull images and other artifacts to/from a Storage Account backed artifact store.
description: Learn how to push and pull images and other artifacts to/from a Storage Account backed artifact store.
author: pjw711
ms.author: peterwhiting
ms.date: 03/18/2024
ms.topic: how-to
ms.service: azure-operator-service-manager
ms.custom: devx-track-azurecli

---
# Push and pull VHD images to/from a Storage Account backed artifact store

The Azure Operator Service Manager (AOSM) artifact store resource manages the artifacts required to deploy network functions (NFs). These artifacts include containerized network function (CNF) images, virtualized network function (VNF) images, Azure Resource Manager (ARM) templates, and Helm packages. There are two flavors of artifact store:

- **Azure Container Registry (ACR)** - Used to provide storage for CNFs on all platforms and VNFs on Azure Operator Nexus
- **Storage Account** - Used to provide storage for VNFs on Azure Core

The Azure CLI Azure Operator Service Manager extension provides a command to push all the artifacts needed by a VNF. There are some use cases where you might need to push artifacts to or pull them from an artifact store individually.

- You might have provided the wrong virtual machine image and need to push a single replacement image
- You might need to push a new version of a virtual machine to provide a fix for an issue

This How-To article describes how to push VHD images to and pull VHD images from an existing blob storage backed artifact store using the AOSM Artifact Manifest resource. See this [How-To](how-to-manage-artifacts-nexus.md) for the equivalent article for ACR-backed artifact stores.

## Prerequisites

- [Enable AOSM](quickstart-onboard-subscription-azure-operator-service-manager.md) on your Azure subscription
- Installed the [Azure CLI](/cli/azure/install-azure-cli)
- Deploy an Artifact Store resource of type Azure Storage Account
- Deploy an Artifact manifest resource that contains an entry for the image you want to push. This example shows the artifact manifest BICEP definition for a fictional Contoso VNF virtual machine image

```bicep
resource storageAccountArtifactManifest 'Microsoft.Hybridnetwork/publishers/artifactStores/artifactManifests@2023-09-01' = {
  parent: 'contoso-vnf-store'
  name: 'contoso-vnf-manifest'
  location: 'eastus'
  properties: {
    artifacts: [
      {
        artifactName: 'contoso-vnf-vm-vhd'
        artifactType: 'VhdImageFile'
        artifactVersion: '1-0-0'
      }
    ]
  }
}
```

>[!IMPORTANT]
> The `artifactVersion` must be in `1-0-0` format, ie, numbers in the range 0-9 separated by hyphens.

- (If you're downloading an image) The VHD image is already available in the AOSM artifact store resource
- (If you're uploading an image) The VHD image is available in the environment from which you execute the commands in this article
- You require the Contributor role over the resource group that contains your artifact store

### Sign in to a storage account backed artifact store

1. Get repository-scoped permissions from the artifact manifest resource

```azurecli
az rest --method POST --url 'https://management.azure.com/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.HybridNetwork/publishers/<publisher>/artifactStores/<artifact-store-name>/artifactManifests/<artifact-manifest-name>/listCredential?api-version=2023-09-01'
```

This command returns the SAS URI you'll use to sign in to the storage account backing the artifact store.

```bash
{
  "containerCredentials": [
    {
      "containerName": "<container-name>",
      "containerSasUri": "<container-sas-uri>?<container-sas-token>"
    }
  ],
  "credentialType": "AzureStorageAccountToken",
  "expiry": "<expiry-time>",
  "storageAccountId": "/subscriptions/<subscription>/resourcegroups/<resource-group>/providers/Microsoft.Storage/storageAccounts/<storage-account-name>"
}
```

## Push an image to a storage account backed artifact store

1. Push the image to a storage blob using the credentials returned from the artifact manifest.

```azurecli
az storage blob upload \
    --account-name <storage-account-name> \
    --container-name <container-name> \
    --name <image-name> \
    --file </path/to/file> \
    --sas-token <container-sas-token>
```

## Pull an image from a storage account backed artifact store

1. Pull the image from a storage blob using the credentials returned from the artifact manifest.

```azurecli
az storage blob download \
    --account-name <storage-account-name> \
    --container-name <container-name> \
    --name <image-name> \
    --file <~/destination/path/for/file> \
    --sas-token <container-sas-token>
```

## Next steps

- See the [Azure storage account quickstart](/azure/storage/blobs/storage-quickstart-blobs-cli) for more detailed usage instructions
- See the [Azure storage account documentation](/azure/storage/common/storage-sas-overview) for more detailed information on shared access signatures (SAS)
