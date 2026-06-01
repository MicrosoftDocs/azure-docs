---
title: Manage secrets 
description: Create, update, and manage secrets that are required to give your Arc-enabled Kubernetes cluster access to Azure resources.
author: dominicbetts
ms.author: dobett
ms.topic: how-to
ms.date: 05/12/2026
ms.custom: sfi-image-nochange
ai-usage: ai-assisted

#CustomerIntent: As an IT professional, I want to manage secrets in Azure IoT Operations, by leveraging Key Vault and Azure Secrete Store to sync the secrets down from the cloud and store them on the edge as Kubernetes secrets.
---

# Manage secrets for your Azure IoT Operations deployment

Azure IoT Operations uses Azure Key Vault as the managed vault solution on the cloud, and uses [Azure Key Vault secret store extension for Kubernetes](/azure/azure-arc/kubernetes/secret-store-extension) to sync the secrets down from the cloud and store them on the edge as Kubernetes secrets. Edge resources like connectors and data flows can then use these secrets for authentication when connecting to external systems.

Examples of secrets that you might store in Azure Key Vault for use by Azure IoT Operations include:

- Usernames and passwords for external systems that your connectors or data flows need to authenticate against.
- X.509 certificates and private keys for devices or services that use mutual TLS (mTLS).

## Prerequisites

[!INCLUDE [prereq-secure-settings](../includes/prereq-secure-settings.md)]

## Configure Azure Key Vault permissions

[!INCLUDE [key-vault-permissions](../includes/key-vault-permissions.md)]

## Add and use secrets

Secrets management for Azure IoT Operations uses the Azure Key Vault secret store extension to sync the secrets from an Azure Key Vault and store them on the edge as Kubernetes secrets. When you enabled secure settings during deployment, you selected an Azure Key Vault for secret management. It is in this Key Vault where all secrets to be used within Azure IoT Operations are stored. 

> [!NOTE]
> Azure IoT Operations instances work with only one Azure Key Vault, multiple key vaults per instance isn't supported.

After the [set up secrets management](howto-enable-secure-settings.md#set-up-secrets-management) steps are complete, you can add secrets to Azure Key Vault, and sync them to the Kubernetes cluster to be used in **Device inbound endpoints** or **Data flow endpoints** using the [operations experience](https://iotoperations.azure.com) web UI. Secrets are typically usernames, passwords, certificates, or private keys required for authentication to external systems.

You can create a synced secret on the cluster using either the operations experience web UI or the Azure CLI. The two flows partially overlap: the operations experience can both upload a new value to Azure Key Vault and sync it to the cluster, while the Azure CLI flow assumes the secret already exists in Azure Key Vault and only handles the sync:

This section uses device inbound endpoints that use username and password authentication as an example. The same process applies to data flow endpoints.

# [Operations experience](#tab/portal)

The operations experience can either upload a new value for a username or password to Azure Key Vault and sync it to the cluster in one step, or sync an existing Key Vault secret to the cluster.

1. Go to the **Device inbound endpoints** page in the [operations experience](https://iotoperations.azure.com) web UI.

1. To add a new secret reference, select **Add reference** when creating a new device inbound endpoint:

    :::image type="content" source="media/howto-manage-secrets/use-secrets.png" lightbox="media/howto-manage-secrets/use-secrets.png" alt-text="Screenshot that shows the Add from Azure Key Vault and Create new options when selecting a secret in operations experience.":::

    - **Create a new secret**: creates a secret in the Azure Key Vault and synchronizes the secret down to the cluster using the secret store extension. 
    
    - **Add from Azure Key Vault**: synchronizes an existing secret in key vault down to the cluster if it wasn't synchronized before. Selecting this option shows you the list of secrets in the selected key vault. Only the latest version of the secret is synced to the cluster.

1. When you add the username and password references to the devices or data flow endpoints, you then need to give the synchronized secret a name. The secret references are saved in the cluster with this given name as one secret sync resource. In the example from the following screenshot, the username and password references are saved to the cluster as *edp1secrets*.

    :::image type="content" source="media/howto-manage-secrets/synced-secret-name.png" lightbox="media/howto-manage-secrets/synced-secret-name.png" alt-text="Screenshot that shows the synced secret name field when username password is selected for authentication mode in operations experience.":::

# [Azure CLI](#tab/cli)

The Azure CLI flow assumes the values are already stored as secrets in Azure Key Vault. To learn how to add secrets to Azure Key Vault, see [Add secrets to Azure Key Vault](#add-secrets-to-azure-key-vault).

Use [az iot ops secretsync secret set](/cli/azure/iot/ops/secretsync/secret#az-iot-ops-secretsync-secret-set) to create a synced secret on the cluster that maps one or more Key Vault secrets to keys inside the synced secret. The following example creates a synced secret named `my-endpoint-creds` that maps the Key Vault secrets `my-kv-username` and `my-kv-password` to the keys `username` and `password`:

```azurecli
az iot ops secretsync secret set \
  --instance <your-instance-name> \
  --resource-group <your-resource-group> \
  --name my-endpoint-creds \
  --secret target=username source=my-kv-username \
  --secret target=password source=my-kv-password
```

To reference the synced secret from a device inbound endpoint, use the `<synced-secret-name>/<key>` form. For example:

- Azure CLI: pass `--user-ref my-endpoint-creds/username` and `--pass-ref my-endpoint-creds/password` to [az iot ops ns device endpoint inbound add](/cli/azure/iot/ops/ns/device/endpoint/inbound/add).
- Bicep: set `usernameSecretName: 'my-endpoint-creds/username'` and `passwordSecretName: 'my-endpoint-creds/password'` in the `usernamePasswordCredentials` block.

---

## Sync a client certificate and private key for mutual TLS

Several connectors support mTLS authentication to southbound data sources. With mTLS, the connector presents a client certificate and private key to the southbound endpoint to authenticate itself, in addition to validating the server's TLS certificate. The following connectors currently support mTLS to southbound data sources:

- [Connector for OPC UA](../discover-manage-assets/howto-configure-opc-ua.md#configure-a-device-to-use-an-x509-certificate)
- [Connector for HTTP/REST](../discover-manage-assets/howto-use-http-connector.md#configure-a-device-to-use-an-x509-certificate)
- [Connector for SSE](../discover-manage-assets/howto-use-sse-connector.md#configure-a-device-to-use-an-x509-certificate)
- [Connector for MQTT](../discover-manage-assets/howto-use-mqtt-connector.md#configure-a-device-to-use-an-x509-certificate)

Other connectors, such as the connector for media and the connector for ONVIF, don't currently support mTLS to southbound data sources.

You configure mTLS on the device's inbound endpoint by referencing a synced secret on the cluster that contains the client certificate and private key. You can create the synced secret using either the operations experience or the Azure CLI. Select the tab that matches the tool you want to use.

# [Operations experience](#tab/portal)

When you create the inbound endpoint and choose the **X509 certificate** authentication mode, you can either upload a new certificate and private key (the operations experience uploads them to Azure Key Vault and syncs them) or pick existing Key Vault secrets to sync.

# [Azure CLI](#tab/cli)

The Azure CLI flow assumes that the certificate and private key are already stored as secrets in Azure Key Vault. You use `az iot ops secretsync secret set` to create a single synced secret on the cluster that maps the Key Vault secrets to keys inside the synced secret.

To add the certificate and private key files as secrets to Azure Key Vault before you sync them, see [Add secrets to Azure Key Vault](#add-secrets-to-azure-key-vault).

The following example creates a synced secret named `my-endpoint-cert` that maps the Key Vault secrets `my-kv-client-cert` and `my-kv-client-key` to the keys `certificate` and `privateKey`:

```azurecli
az iot ops secretsync secret set \
  --instance <your-instance-name> \
  --resource-group <your-resource-group> \
  --name my-endpoint-cert \
  --secret target=certificate source=my-kv-client-cert \
  --secret target=privateKey source=my-kv-client-key
```

If the southbound endpoint requires intermediate certificates, add a third `--secret target=intermediateCerts source=<my-kv-intermediate-certs>` mapping.

To reference the synced secret from the device inbound endpoint, use the `<synced-secret-name>/<key>` form. For example:

- Azure CLI: pass `--cert-ref my-endpoint-cert/certificate` and `--key-ref my-endpoint-cert/privateKey` to [az iot ops ns device endpoint inbound add](/cli/azure/iot/ops/ns/device/endpoint/inbound/add). To include intermediate certificates, also pass `--icr my-endpoint-cert/intermediateCerts`.
- Bicep: set `method: 'Certificate'` and reference the synced secret in the `x509Credentials` block:

    ```bicep
    authentication: {
        method: 'Certificate'
            x509Credentials: {
                certificateSecretName: 'my-endpoint-cert/certificate'
                keySecretName: 'my-endpoint-cert/privateKey'
            }
    }
    ```

---

## Manage synced secrets

This section uses device inbound endpoints as an example. The same process can be applied to data flow endpoints:

1. Go to the **Devices** page in the [operations experience](https://iotoperations.azure.com) web UI.

1. To view the secrets list, select **Manage certificates and secrets** and then **Secrets**:

    :::image type="content" source="media/howto-manage-secrets/synced-secret-list.png" lightbox="media/howto-manage-secrets/synced-secret-list.png" alt-text="Screenshot that shows the synced secrets list in the operations experience secrets page.":::

You can use the **Secrets** page to view synchronized secrets in your devices and data flow endpoints. Secrets page shows the list of all current synchronized secrets at the edge for the resource you're viewing. A synced secret represents one or multiple secret references, depending on the resource using it. Any operation applied to a synced secret applies to all secret references contained within the synced secret. 

You can delete synced secrets from the **Secrets** page. When you delete a synced secret, it only deletes the synced secret from the Kubernetes cluster, and doesn't delete the contained secret reference from Azure Key Vault. You must delete the certificate secret manually from the key vault.

You can also use the Azure CLI to view synced secrets on the cluster:

- To list the synced secret resources on the cluster, use [az iot ops secretsync list](/cli/azure/iot/ops/secretsync#az-iot-ops-secretsync-list).
- To list the individual Key Vault secret references inside a synced secret, use [az iot ops secretsync secret list](/cli/azure/iot/ops/secretsync/secret#az-iot-ops-secretsync-secret-list).

> [!WARNING]
> Directly editing **SecretProviderClass** and **SecretSync** custom resources in your Kubernetes cluster can break the secrets flow in Azure IoT Operations. For any operations related to secrets, use the operations experience web UI.
>
> Before deleting a synced secret, make sure that all references to the secret from Azure IoT Operations components are removed.

## Add secrets to Azure Key Vault

If you use the operations experience to select existing secrets that were previously added to Azure Key Vault, make sure that the secrets are in a format and encoding that's supported by Azure IoT Operations.

To add a PEM certificate secret to Azure Key Vault, you can use a command like the following example:

```azcli
az keyvault secret set \
  --vault-name <your-key-vault-name> \
  --name client-cert-pem \
  --file ./client-cert.pem \
  --encoding hex \
  --content-type 'application/x-pem-file'
```

To add a binary DER certificate secret to Azure Key Vault, you can use a command like the following example:

```azcli
az keyvault secret set \
  --vault-name <your-key-vault-name> \
  --name cert-file-der \
  --file ./cert-file.der \
  --encoding hex \
  --content-type 'application/pkix-cert'
```
