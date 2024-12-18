---
title: Manage secrets 
description: Create, update, and manage secrets that are required to give your Arc-enabled Kubernetes cluster access to Azure resources.
author: asergaz
ms.author: sergaz
ms.topic: how-to
ms.date: 10/22/2024

#CustomerIntent: As an IT professional, I want to manage secrets in Azure IoT Operations, by leveraging Key Vault and Azure Secrete Store to sync the secrets down from the cloud and store them on the edge as Kubernetes secrets.
---

# Manage secrets for your Azure IoT Operations deployment

Azure IoT Operations uses Azure Key Vault as the managed vault solution on the cloud, and uses [Azure Key Vault Secret Store extension for Kubernetes](/azure/azure-arc/kubernetes/secret-store-extension) to sync the secrets down from the cloud and store them on the edge as Kubernetes secrets.

## Prerequisites

* An Azure IoT Operations instance deployed with secure settings. If you deployed Azure IoT Operations with test settings and now want to use secrets, you need to first [enable secure settings](../deploy-iot-ops/howto-enable-secure-settings.md).

* Creating secrets in the key vault requires **Secrets officer** permissions at the resource level. For information about assigning roles to users, see [Steps to assign an Azure role](../../role-based-access-control/role-assignments-steps.md).

## Add and use secrets

Secrets management for Azure IoT Operations uses Secret Store extension to sync the secrets from an Azure Key Vault and store them on the edge as Kubernetes secrets. When you enabled secure settings during deployment, you selected an Azure Key Vault for secret management. It is in this Key Vault where all secrets to be used within Azure IoT Operations are stored. 

> [!NOTE]
> Azure IoT Operations instances work with only one Azure Key Vault, multiple key vaults per instance isn't supported.

Once the [set up secrets management](../deploy-iot-ops/howto-enable-secure-settings.md#set-up-secrets-management) steps are completed, you can start adding secrets to Azure Key Vault, and sync them to the edge to be used in **Asset Endpoints** or **Dataflow Endpoints** using the [operations experience](https://iotoperations.azure.com) web UI.

Secrets are used in asset endpoints and dataflow endpoints for authentication. In this section, we use asset endpoints as an example, the same can be applied to dataflow endpoints. You have the option to directly create the secret in Azure Key Vault and have it automatically synchronized down to the edge, or use an existing secret reference from the key vault:

:::image type="content" source="media/howto-manage-secrets/use-secrets.png" alt-text="Screenshot that shows the Add from Azure Key Vault and Create new options when selecting a secret in operations experience.":::

- **Create a new secret**: creates a secret reference in the Azure Key Vault and also automatically synchronizes the secret down to the edge using Secret Store extension. Use this option if you didn't create the secret you require for this scenario in the key vault beforehand. 

- **Add from Azure Key Vault**: synchronizes an existing secret in key vault down to the edge if it wasn't synchronized before. Selecting this option shows you the list of secret references in the selected key vault. Use this option if you created the secret in the key vault beforehand.

When you add the username and password references to the asset endpoints or dataflow endpoints, you then need to give the synchronized secret a name. The secret references will be saved in the edge with this given name as one resource. In the example from the screenshot below, the username and password references are saved to the edge as *edp1secrets*.

:::image type="content" source="media/howto-manage-secrets/synced-secret-name.png" alt-text="Screenshot that shows the synced secret name field when username password is selected for authentication mode in operations experience.":::

## Manage Synced Secrets

You can use **Manage secrets** for asset endpoints and dataflow endpoints to manage synchronized secrets. Manage secrets shows the list of all current synchronized secrets at the edge for the resource you are viewing. A synced secret represents one or multiple secret references, depending on the resource using it. Any operation applied to a synced secret will be applied to all secret references contained within the synced secret. 

You can delete synced secrets as well in manage secrets. When you delete a synced secret, it only deletes the synced secret from the edge, and doesn't delete the contained secret reference from key vault. 

> [!NOTE]
> Before deleting a synced secret, make sure that all references to the secret from Azure IoT Operations components are removed.