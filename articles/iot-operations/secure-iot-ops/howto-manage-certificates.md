---
title: Manage certificates
description: Azure IoT Operations uses TLS to encrypt communication. Learn how to manage certificates for internal and external communications, and how to bring your own certificate authority (CA) issuer for a production deployment.
author: dominicbetts
ms.author: dobett
ms.topic: how-to
ms.date: 01/27/2026

#CustomerIntent: As an operator, I want to configure Azure IoT Operations components to use TLS so that I have secure communication between all components.
---

# Manage certificates for your Azure IoT Operations deployment

Azure IoT Operations uses TLS to encrypt communication between all components. This article describes how to manage certificates for external communications.

For information about managing certificates for internal communications, including the default self-signed issuer and bringing your own CA issuer, see [Bring your own issuer](../deploy-iot-ops/howto-bring-your-own-issuer.md).

## Prerequisites

To manage certificates for external communications, you need an Azure IoT Operations instance deployed with secure settings. If you deployed Azure IoT Operations with test settings, you need to first [enable secure settings](../deploy-iot-ops/howto-enable-secure-settings.md).

## Manage certificates for external communications

Azure IoT Operations uses Azure Key Vault as the managed vault solution on the cloud, and uses [Azure Key Vault secret store extension for Kubernetes](/azure/azure-arc/kubernetes/secret-store-extension) to sync the secrets down from the cloud and store them on the edge as Kubernetes secrets.

> [!IMPORTANT]
> Although Azure IoT Operations uses certificates to secure external communications, these certificates are stored as secrets in Azure Key Vault. When you add a certificate to Azure Key Vault, make sure to add it as a secret, not as a certificate resource.

### Configure Azure Key Vault permissions

[!INCLUDE [key-vault-permissions](../includes/key-vault-permissions.md)]

### Add and use certificates

Connectors use the certificate management experience to configure application authentication to external servers. To learn more about how connectors use certificates to establish mutual trust with external servers, see the connector-specific certificate management documentation such as [Understand the OPC UA certificates infrastructure](../discover-manage-assets/overview-opc-ua-connector-certificates-management.md).

When you [deploy Azure IoT Operations with secure settings](../deploy-iot-ops/overview-deploy.md#secure-settings-deployment), you can start adding certificates to Azure Key Vault, and sync them to the Kubernetes cluster to be used in the *Trust list* and *Issuer list* stores for external connections. Each connector has its own trust list to store the certificates of the external servers it trusts and connects to.

To manage certificates for external communications, follow these steps:

1. Go to [Azure IoT Operations experience](https://iotoperations.azure.com), and choose your site and Azure IoT Operations instance.
1. In the left navigation pane, select **Devices**.
1. Select on **Manage certificates and secrets**.

    :::image type="content" source="media/howto-manage-certificates/manage-certificates.png" lightbox="media/howto-manage-certificates/manage-certificates.png" alt-text="Screenshot that shows the Manage certificates and secrets option in the left navigation pane.":::

1. In the Certificates and Secrets page, select on **Add new certificate**.

    :::image type="content" source="media/howto-manage-certificates/add-new-certificate.png" lightbox="media/howto-manage-certificates/add-new-certificate.png" alt-text="Screenshot that shows the Add new certificate button in the devices page.":::

1. You can add a new certificate in two ways:

    - **Upload Certificate**: Uploads a certificate to add as a secret to Azure Key Vault and automatically synchronize to the cluster using secret store extension.

        - View the certificate details once uploaded, to ensure you have the correct certificate before adding to Azure Key Vault and synchronizing to the cluster.
        - Use an intuitive name so that you can recognize which secret represents your secret in the future.
        - Select the appropriate certificate store for the connector that uses the certificate. For example, **OPC UA trust list**.

        :::image type="content" source="media/howto-manage-certificates/upload-certificate.png" lightbox="media/howto-manage-certificates/upload-certificate.png" alt-text="Screenshot that shows the Upload certificate option when adding a new certificate to the devices page.":::

        > [!NOTE]
        > Simply uploading the certificate doesn't add the secret to Azure Key Vault and synchronize to the cluster, you must select **Apply** for the changes to be applied.

    - **Add from Azure Key Vault**: Add an existing secret from the Azure Key vault to be synchronized to the cluster.

        :::image type="content" source="media/howto-manage-certificates/add-from-key-vault.png" lightbox="media/howto-manage-certificates/add-from-key-vault.png" alt-text="Screenshot that shows the Add from Azure Key Vault option when adding a new certificate to the devices page.":::

        > [!NOTE]
        > Make sure to select the secret that holds the certificate you would like to synchronize to the cluster. Selecting a secret that isn't the correct certificate causes the connection to fail.

1. Using the list view you can manage the synchronized certificates. You can view all the synchronized certificates, and which certificate store it's synchronized to:

    :::image type="content" source="media/howto-manage-certificates/list-certificates.png" lightbox="media/howto-manage-certificates/list-certificates.png" alt-text="Screenshot that shows the list of certificates in the devices page and how to filter by Trust List and Issuer List.":::

You can delete synced certificates as well. When you delete a synced certificate, it only deletes the synced certificate from the Kubernetes cluster, and doesn't delete the contained secret reference from Azure Key Vault. You must delete the certificate secret manually from the key vault.

## Use CLI commands to create certificates

The previous sections explained how to manage certificates using the operations experience web UI and the Azure portal. You can also use the Azure CLI to manage the certificates in the connector for OPC UA trust and issuer lists. For more information, see [az iot ops connector opcua trust](/cli/azure/iot/ops/connector/opcua/trust) and [az iot ops connector opcua issuer](/cli/azure/iot/ops/connector/opcua/issuer) commands.

> [!TIP]
> Remember, these certificates must be stored as secrets in Azure Key Vault.

## Add certificates as secrets to Azure Key Vault

If you use the operations experience to select existing certificates that were previously added to Azure Key Vault, make sure that the secrets are in a format and encoding that's supported by Azure IoT Operations.

To add a PEM certificate secret to Azure Key Vault, you can use a command like the following example:

```azcli
az keyvault secret set \
  --vault-name <your-key-vault-name> \
  --name my-cert-pem \
  --file ./my-cert.pem \
  --encoding hex \
  --content-type 'application/x-pem-file'
```

To add a binary DER certificate secret to Azure Key Vault, you can use a command like the following example:

```azcli
az keyvault secret set \
  --vault-name <your-key-vault-name> \
  --name my-cert-der \
  --file ./my-cert.der \
  --encoding hex \
  --content-type 'application/pkix-cert'
```
