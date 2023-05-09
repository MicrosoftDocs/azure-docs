---
title: 'Azure Event Grid Namespace MQTT client authentication using certificate chain'
description: 'Describes how to configure MQTT clients to authenticate using CA certificate chains.'
ms.topic: conceptual
ms.date: 04/20/2023
author: veyaddan
ms.author: veyaddan
---

# Client authentication using CA certificate chain
Use CA certificate chain in Azure Event Grid to authenticate clients while connecting to the service.

In this guide, you perform the following tasks:
1. Upload a CA certificate, the immediate parent certificate of the client certificate, to the namespace.
2. Configure client authentication settings.
3. Connect a client using the client certificate signed by the previously uploaded CA certificate.

## Prerequisites
  -	You need an Event Grid Namespace already created.
  -	You need a CA certificate chain:  Client certificates and the parent certificate (typically an intermediate certificate) that was used to sign the client certificates.

## Upload the CA certificate to the namespace
1. In Azure portal, navigate to your Event Grid namespace.
2. Under the MQTT section in left rail, navigate to CA certificates menu.

:::image type="content" source="./media/mqtt-certificate-chain-client-authentication/event-grid-namespace-upload-certificate-authority-certificate.png" alt-text="Screenshot showing the CA certificate page under MQTT section in Event Grid namespace.":::

3. Select **+ Certificate** to launch the Upload certificate page.
4. On the Upload certificate page, give a Certificate name and browse for the certificate file.
5. Select **Upload** button to add the parent certificate.

:::image type="content" source="./media/mqtt-certificate-chain-client-authentication/event-grid-namespace-parent-certificate-added.png" alt-text="Screenshot showing the added CA certificate listed in the CA certificates page.":::

## Configure client authentication settings
1. Navigate to the Clients page.
2. Select **+ Client** to add a new client.  If you want to update an existing client, you can select the client name and open the Update client page.
3. In the Create client page, add the client name, client authentication name, and the client certificate authentication validation scheme.  Typically the client authentication name would be in the subject name field for the client certificate. 

:::image type="content" source="./media/mqtt-certificate-chain-client-authentication/client-authentication-name-in-certificate-subject.png" alt-text="Screenshot showing the client metadata using the subject matches the authentication name option.":::

4. Select **Create** button to create the client.

### Sample certificate object schema

```json
{
    "properties": {
        "description": "CA certificate description",
        "encodedCertificate": "-----BEGIN CERTIFICATE-----`Base64 encoded Certificate`-----END CERTIFICATE-----"
    }
}
```

### Azure CLI configuration
Use the following commands to upload/show/delete a certificate authority (CA) certificate to the service

**Upload certificate authority root or intermediate certificate**
```azurecli-interactive
az resource create --resource-type Microsoft.EventGrid/namespaces/caCertificates --id /subscriptions/`Subscription ID`/resourceGroups/`Resource Group`/providers/Microsoft.EventGrid/namespaces/`Namespace Name`/caCertificates/`CA certificate name` --api-version  --properties @./resources/ca-cert.json
```

**Show certificate information**
```azurecli-interactive
az resource show --id /subscriptions/`Subscription ID`/resourceGroups/`Resource Group`/providers/Microsoft.EventGrid/namespaces/`Namespace Name`/caCertificates/`CA certificate name`
```

**Delete certificate**
```azurecli-interactive
az resource delete --id /subscriptions/`Subscription ID`/resourceGroups/`Resource Group`/providers/Microsoft.EventGrid/namespaces/`Namespace Name`/caCertificates/`CA certificate name`
```

## Next steps
- [Publish and subscribe to MQTT message using Event Grid](mqtt-publish-and-subscribe-portal.md)