---
title: Manage secrets 
description: Create, update, and manage secrets that are required to give your Arc-enabled Kubernetes cluster access to Azure resources.
author: asergaz
ms.author: sergaz
ms.topic: how-to
ms.date: 09/24/2024

#CustomerIntent: As an IT professional, I want to manage secrets in Azure IoT Operations, by leveraging Key Vault and Azure Secrete Store to sync the secrets down from the cloud and store them on the edge as Kubernetes secrets.
---

# Manage secrets for your Azure IoT Operations Preview deployment

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

Azure IoT Operations uses Azure Key Vault as the managed vault solution on the cloud, and uses [Azure Secret Store](#manage-secrets-for-your-azure-iot-operations-preview-deployment) to sync the secrets down from the cloud and store them on the edge as Kubernetes secrets.

## Prerequisites

* An Azure IoT Operations instance deployed with secure settings. If you deployed Azure IoT Operations with test settings and now want to use secrets, you need to first [enable secure settings](./howto-enable-secure-settings.md).

## Add and use secrets

Secrets management for Azure IoT Operations uses Azure Secret Store to sync the secrets from an Azure Key Vault and store them on the edge as Kubernetes secrets. When you enabled secure settings during deployment, you selected an Azure Key Vault for secret management. It is in this Key Vault where all secrets to be used within Azure IoT Operations are stored. Azure IoT Operations instances work with only one Azure Key Vault, multiple key vaults per instance isn't supported.

Once the setup secrets management steps are completed, you can start adding secrets to Azure Key Vault, and sync them to the edge to be used in Asset Endpoint Profile or Dataflow Endpoints using the [operations experience web UI](https://iotoperations.azure.com).

Secrets are used in Asset Endpoint profile and Dataflow endpoints for authentication. In this section, we use Asset Endpoint profile as an example, the same can be applied to dataflow endpoints. You have the following options When using a secret from the selected key vault:

1. **Create a new secret**: creates a secret reference in the Azure Key Vault and also automatically synchronizes the secret down to the edge using Azure Secret Store. Use this option if you didn't create the secret you require for this scenario in the key vault beforehand. 

1. **Add from Azure Key Vault**: synchronizes an existing secret in key vault down to the edge in Azure Key Vault that wasn't synchronized before. Selecting this option shows you the list of secret references in the selected key vault. Use this option if you created the secret in the key vault beforehand.  

1. **Add synced secret**: uses an existing and synchronized to the edge secret for the component. Selecting this option shows you the list of already synchronized secrets. Use this option if you previously created and synchronized the secret but didn't use it in an Azure IoT Operations component.

## Manage Synced Secrets

You can use Manage Synced Secrets for asset endpoint profiles and dataflow endpoints to view or delete synced secrets. 

You can delete synced secrets as well. When you delete a synced secret, it only deletes the secret from the edge, and doesn't delete the secret from key vault. Before deleting a synced secret, make sure that all references to the secret from Azure IoT Operations components are removed.