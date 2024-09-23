---
title: Manage secrets 
description: Create, update, and manage secrets that are required to give your Arc-enabled Kubernetes cluster access to Azure resources.
author: asergaz
ms.author: sergaz
ms.subservice: orchestrator
ms.topic: how-to
ms.date: 03/21/2024
ms.custom: ignite-2023, devx-track-azurecli

#CustomerIntent: As an IT professional, I want to manage secrets in Azure IoT Operations, by leveraging Key Vault and Azure Secrete Store to sync the secrets down from the cloud and store them on the edge as Kubernetes secrets.
---

# Manage secrets for your Azure IoT Operations Preview deployment

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

Azure IoT Operations uses Azure Key Vault as the managed vault solution on the cloud and uses [Azure Secret Store](#TODO-ADD-LINK) to sync the secrets down from the cloud and store them on the edge as Kubernetes secrets.

## Prerequisites

* An Azure IoT Operations instance deployed with secure settings.
* If you deployed Azure IoT Operations with test settings and now want to use secrets with Azure IoT Operations, you need to first [enable secure settings](./howto-enable-secure-settings.md).

## Add and use secrets

Azure IoT Operations has integrated with [Azure Secret Store](#TODO-ADD-LINK) to provide a seamless secret management experience.  

To use secrets with AIO components, deployment in “Secure Settings” is required. In “Secure Settings” deployment, you will have selected an Azure Key Vault for secret managed. It is in this Key Vault where all secrets to be used within AIO should be placed. AIO instances works with only one Azure Key Vault, multiple Azure Key Vault per instance is not supported. 

Once the set-up steps are completed, you can now add secrets to Azure Key Vault, sync it to the edge to be used in Asset Endpoint Profile or Dataflow Endpoints using Digital Operators Experience. 

Secrets are used in Asset Endpoint profile and Dataflow endpoints for authentication. In this section, we will use Asset Endpoint profile as an example, the same can be applied to dataflow endpoints. 

While using a secret from the selected key vault, there are a few options:

1. Create a new secret: This creates a secret reference in the azure key vault and also automatically synchronizes the secret down to the edge using SSC. Use this option if you haven’t already created the secret you require for this scenario in the key vault. 

1. Add from Azure Key Vault: This synchronizes an existing secret in key vault down to the edge in azure key vault which has not been synchronized before. Selecting this option will show you the list of secret references in the selected key vault. Use this option if you have already created the secret in the key vault.  

1. Add synced secret: This uses an existing and synchronized to the edge secret for the component. Selecting this option will show you the list of already synchronized secrets. Use this if you have previously created and synchronized the secret but have not used it in an AIO component.  

## Manage Synced Secrets

You can use manage synced secrets for asset endpoint profiles and dataflow endpoints to view or delete synced secrets. 

You can delete synced secrets as well, this will only delete the secret from the edge, this will not delete the secret from key vault. Before deleting synced secret, make sure all references of the secret from AIO components have been removed.