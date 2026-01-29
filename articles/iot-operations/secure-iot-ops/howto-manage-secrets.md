---
title: Manage secrets 
description: Create, update, and manage secrets that are required to give your Arc-enabled Kubernetes cluster access to Azure resources.
author: dominicbetts
ms.author: dobett
ms.topic: how-to
ms.date: 01/27/2026
ms.custom: sfi-image-nochange

#CustomerIntent: As an IT professional, I want to manage secrets in Azure IoT Operations, by leveraging Key Vault and Azure Secrete Store to sync the secrets down from the cloud and store them on the edge as Kubernetes secrets.
---

# Manage secrets for your Azure IoT Operations deployment

Azure IoT Operations uses Azure Key Vault as the managed vault solution on the cloud, and uses [Azure Key Vault Secret Store extension for Kubernetes](/azure/azure-arc/kubernetes/secret-store-extension) to sync the secrets down from the cloud and store them on the edge as Kubernetes secrets. Edge resources like connectors and dataflows can then use these secrets for authentication when connecting to external systems.

## Prerequisites

To manage secrets, you need an Azure IoT Operations instance deployed with secure settings. If you deployed Azure IoT Operations with test settings, you need to first [enable secure settings](../deploy-iot-ops/howto-enable-secure-settings.md).

## Configure Azure Key Vault permissions

[!INCLUDE [key-vault-permissions](../includes/key-vault-permissions.md)]

## Add and use secrets

Secrets management for Azure IoT Operations uses Secret Store extension to sync the secrets from an Azure Key Vault and store them on the edge as Kubernetes secrets. When you enabled secure settings during deployment, you selected an Azure Key Vault for secret management. It is in this Key Vault where all secrets to be used within Azure IoT Operations are stored. 

> [!NOTE]
> Azure IoT Operations instances work with only one Azure Key Vault, multiple key vaults per instance isn't supported.

After the [set up secrets management](../deploy-iot-ops/howto-enable-secure-settings.md#set-up-secrets-management) steps are complete, you can add secrets to Azure Key Vault, and sync them to the Kubernetes cluster to be used in **Device inbound endpoints** or **Data flow endpoints** using the [operations experience](https://iotoperations.azure.com) web UI. Secrets are typically usernames, passwords, certificates, or private keys required for authentication to external systems.

Secrets are used in device inbound endpoints and data flow endpoints for authentication. This section uses device inbound endpoints as an example. The same process can be applied to data flow endpoints. You can directly create the secret in Azure Key Vault and have it automatically synchronize to the cluster, or use an existing secret reference from the key vault:

1. Go to the **Device inbound endpoints** page in the [operations experience](https://iotoperations.azure.com) web UI.

1. To add a new secret reference, select **Add reference** when creating a new device inbound endpoint:

    :::image type="content" source="media/howto-manage-secrets/use-secrets.png" lightbox="media/howto-manage-secrets/use-secrets.png" alt-text="Screenshot that shows the Add from Azure Key Vault and Create new options when selecting a secret in operations experience.":::

    - **Create a new secret**: creates a secret in the Azure Key Vault and synchronizes the secret down to the cluster using the secret store extension. 
    
    - **Add from Azure Key Vault**: synchronizes an existing secret in key vault down to the cluster if it wasn't synchronized before. Selecting this option shows you the list of secrets in the selected key vault. Only the latest version of the secret is synced to the cluster.

1. When you add the username and password references to the devices or data flow endpoints, you then need to give the synchronized secret a name. The secret references are saved in the cluster with this given name as one secret sync resource. In the example from the following screenshot, the username and password references are saved to the cluster as *edp1secrets*.

    :::image type="content" source="media/howto-manage-secrets/synced-secret-name.png" lightbox="media/howto-manage-secrets/synced-secret-name.png" alt-text="Screenshot that shows the synced secret name field when username password is selected for authentication mode in operations experience.":::

## Manage synced secrets

This section uses device inbound endpoints as an example. The same process can be applied to data flow endpoints:

1. Go to the **Devices** page in the [operations experience](https://iotoperations.azure.com) web UI.

1. To view the secrets list, select **Manage certificates and secrets** and then **Secrets**:

    :::image type="content" source="media/howto-manage-secrets/synced-secret-list.png" lightbox="media/howto-manage-secrets/synced-secret-list.png" alt-text="Screenshot that shows the synced secrets list in the operations experience secrets page.":::

You can use the **Secrets** page to view synchronized secrets in your devices and data flow endpoints. Secrets page shows the list of all current synchronized secrets at the edge for the resource you're viewing. A synced secret represents one or multiple secret references, depending on the resource using it. Any operation applied to a synced secret applies to all secret references contained within the synced secret. 

You can delete synced secrets from the **Secrets** page. When you delete a synced secret, it only deletes the synced secret from the Kubernetes cluster, and doesn't delete the contained secret reference from Azure Key Vault. You must delete the certificate secret manually from the key vault.

> [!WARNING]
> Directly editing **SecretProviderClass** and **SecretSync** custom resources in your Kubernetes cluster can break the secrets flow in Azure IoT Operations. For any operations related to secrets, use the operations experience web UI.
>
> Before deleting a synced secret, make sure that all references to the secret from Azure IoT Operations components are removed.

## Use CLI commands to create secrets

The previous sections explained how to manage secrets using the operations experience web UI and the Azure portal. You can also use the Azure CLI and `kubectl` command to create and synchronize secrets for your device inbound endpoints and data flow endpoints:

1. Ensure that *secure settings* are enabled for your Azure IoT Operations instance. These settings configure the Azure Key Vault secret store extension to sync secrets from the selected key vault to the Kubernetes cluster. To learn more, see [Enable secure settings for your Azure IoT Operations deployment](../deploy-iot-ops/howto-enable-secure-settings.md).

1. Use `az keyvault secret set` to add a secret to Azure Key Vault.

1. Use `kubectl` to create an `AKVSync` custom resource to configure the synchronization of a secret from Azure Key Vault to the Kubernetes cluster.

1. Use `az iot ops ns device endpoint inbound add` to configure an endpoint that references the synced secrets.
