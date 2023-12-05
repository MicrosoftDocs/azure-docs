---
title: 'Azure Event Grid Namespace MQTT client authentication using certificate chain'
description: 'Describes how to configure MQTT clients to authenticate using CA certificate chains.'
ms.topic: conceptual
ms.custom:
  - build-2023
  - ignite-2023
ms.date: 11/15/2023
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

## Generate sample client certificate and thumbprint
If you don't already have a certificate, you can create a sample certificate using the [step CLI](https://smallstep.com/docs/step-cli/installation/).  Consider installing manually for Windows.

Once you installed Step, in Windows PowerShell, run the command to create root and intermediate certificates.

```powershell
.\step ca init --deployment-type standalone --name MqttAppSamplesCA --dns localhost --address 127.0.0.1:443 --provisioner MqttAppSamplesCAProvisioner
```

Using the CA files generated to create certificate for the client.

```powershell
.\step certificate create client1-authnID client1-authnID.pem client1-authnID.key --ca .step/certs/intermediate_ca.crt --ca-key .step/secrets/intermediate_ca_key --no-password --insecure --not-after 2400h
```

## Upload the CA certificate to the namespace
1. In Azure portal, navigate to your Event Grid namespace.
1. Under the MQTT broker section in left rail, navigate to CA certificates menu.
1. Select **+ Certificate** to launch the Upload certificate page.  
1. Add certificate name and browse to find the intermediate certificate (.step/certs/intermediate_ca.crt) and select **Upload**. You can upload a file of .pem, .cer, or .crt type. 


  :::image type="content" source="./media/mqtt-certificate-chain-client-authentication/event-grid-namespace-parent-certificate-added.png" alt-text="Screenshot showing the added CA certificate listed in the CA certificates page." lightbox="./media/mqtt-certificate-chain-client-authentication/event-grid-namespace-parent-certificate-added.png":::

  > [!NOTE]
  > - CA certificate name can be 3-50 characters long.
  > - CA certificate name can include alphanumeric, hyphen(-) and, no spaces.
  > - The name needs to be unique per namespace.

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
