---
title: How to push and pull images and other artifacts to/from an Azure Container Registry (ACR) backed artifact store.
description: Learn how to push and pull images and other artifacts to/from an Azure Container Registry (ACR) backed artifact store.
author: pjw711
ms.author: peterwhiting
ms.date: 03/18/2024
ms.topic: how-to
ms.service: azure-operator-service-manager
ms.custom: devx-track-azurecli

---
# Push and pull images and other artifacts to/from an Azure Container Registry (ACR) backed artifact store

The Azure Operator Service Manager (AOSM) artifact store resource manages the artifacts required to deploy network functions (NFs). These artifacts include containerized network function (CNF) images, virtualized network function (VNF) images, Azure Resource Manager (ARM) templates, and Helm packages. There are two flavors of artifact store:

- **Azure Container Registry (ACR)** - Used to provide storage for CNFs on all platforms and VNFs on Azure Operator Nexus
- **Storage Account** - Used to provide storage for VNFs on Azure Core

The Azure CLI AOSM extension provides a command to push all the artifacts needed by a CNF or VNF on Azure Operator Nexus. There are some use cases where you might need to push artifacts to or pull them from an artifact store individually.

- You might have provided the wrong container image and need to push a single replacement image
- You might need to push a new version of a single container to provide a fix for an issue
- You might need to edit the NF ARM template as part of a debugging cycle
- You might need to edit helm packages or a VM ARM template as part of a debugging cycle

This How-To article describes how to push artifacts to and pull artifacts from an existing ACR-backed artifact store using the AOSM Artifact Manifest resource and the [ORAS command line tool](https://oras.land/docs/). See this [How-To](how-to-manage-artifacts-virtualized-network-function-cloud.md) for the equivalent article for Storage Account backed artifact stores.

## Prerequisites

- [Enable AOSM](quickstart-onboard-subscription-azure-operator-service-manager.md) on your Azure subscription
- Install the [Azure CLI](/cli/azure/install-azure-cli)
- Deploy an Artifact Store resource of type Azure Container Registry
- Deploy an Artifact manifest resource that contains an entry for the artifact you want to install. This example shows the artifact manifest BICEP definition for a fictional Contoso CNF container image

```bicep
resource acrArtifactManifest 'Microsoft.Hybridnetwork/publishers/artifactStores/artifactManifests@2023-09-01' = {
  parent: 'contoso-cnf-store'
  name: 'contoso-cnf-manifest'
  location: 'eastus'
  properties: {
    artifacts: [
      {
        artifactName: 'contoso-cnf-container'
        artifactType: 'OCIArtifact'
        artifactVersion: '0.1.0'
      }
    ]
  }
}
```

- (If you're downloading an artifact) The artifact is already available in the AOSM artifact store resource
- (If you're uploading an artifact) The artifact is available in the environment from which you execute the commands in this article
- Install the [ORAS CLI](https://oras.land/docs/installation/)
- You require the Contributor role over the resource group that contains your artifact store

## Sign in to an ACR-backed artifact store

1. Get repository-scoped permissions from the artifact manifest resource

    ```azurecli
    az rest --method POST --url 'https://management.azure.com/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.HybridNetwork/publishers/<publisher>/artifactStores/<artifact-store-name>/artifactManifests/<artifact-manifest-name>/listCredential?api-version=2023-09-01'
    ```

    This command returns the username and password you'll use to sign in to the ACR backing the artifact store. The password is in the `token` field.

    ```bash
    {
      "acrServerUrl": "https://<acr-name>.azurecr.io",
      "acrToken": "<token>",
      "credentialType": "AzureContainerRegistryScopedToken",
      "expiry": "2024-03-27T10:25:03.9217887+00:00",
      "repositories": [
        "<artifact-name>"
      ],
      "username": "<artifact-manifest-name>"
    }
    ```

    >[!IMPORTANT]
    > The artifact manifest resource grants tightly scoped permissions for push and pull operations. You must use an artifact manifest that contains an entry for the artifact you want to push or pull. The `artifactName` must match the artifact name in the repository. The `artifactVersion` must match the artifact tag

1. Find the name of the ACR that backs the artifact store resource by opening the navigating to the artifact store and copying the `Backing storage` field

    :::image type="content" source="media/how-to-find-backing-artifact-store.png" alt-text="Diagram showing the Azure portal Artifact Store backing resource field." lightbox="media/how-to-find-backing-artifact-store.png":::

1. Sign in to the ACR using the ORAS CLI

```bash
oras login <acr-name>.azurecr.io --username <artifact-manifest-name> --password <token>
```

## Push an artifact to an ACR-backed artifact store

1. Use ORAS to upload the artifact to the ACR. The `<artifact-name>` must match the `artifactName` property in the artifact manifest. The `<artifact-tag>` must match the `artifactVersion` property in the artifact manifest. The `<artifact-tag>` must be in `1.0.0` format

```bash
oras push <acr-name>.azurecr.io/<artifact-name>:<artifact-tag> </path/to/artifact>
```

## Pull an artifact from an ACR-backed artifact store

1. Use ORAS to pull the artifact from the ACR.

```bash
oras pull <acr-name>.azurecr.io/<artifact-name>:<artifact-tag>
```

## Next steps

- See [ORAS push](https://oras.land/docs/commands/oras_push) for more detailed usage instructions for the `oras push` command
- See [ORAS pull](https://oras.land/docs/commands/oras_pull) for more detailed usage instructions for the `oras pull` command
