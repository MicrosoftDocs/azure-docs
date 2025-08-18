---
title: Configure client certificate authentication in Azure Container Apps
description: How to configure client authentication in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic: how-to
ms.date: 06/30/2025
ms.author: cshoe
---

# Configure client certificate authentication in Azure Container Apps

Azure Container Apps supports client certificate authentication (also known as mutual TLS or mTLS) that allows access to your container app through two-way authentication. This article shows you how to configure client certificate authorization in Azure Container Apps.

When client certificates are used, the TLS certificates are exchanged between the client and your container app to authenticate identity and encrypt traffic. Client certificates are often used in "zero trust" security models to authorize client access within an organization.

For example, you might want to require a client certificate for a container app that manages sensitive data.

Container Apps accepts client certificates in the PKCS12 format when a trusted certificate authority (CA) issues them or when they're self-signed.

## Configure client certificate authorization

To configure support for client certificates, set the `clientCertificateMode` property in your container app template.

The property can be set to one of the following values:

- `require`: The client certificate is required for all requests to the container app.
- `accept`: The client certificate is optional. If the client certificate isn't provided, the request is still accepted.
- `ignore`: The client certificate is ignored. 

Ingress passes the client certificate to the container app if `require` or `accept` are set.

The following ARM template example configures ingress to require a client certificate for all requests to the container app.

```json
{
  "properties": {
    "configuration": {
      "ingress": {
        "clientCertificateMode": "require"
      }
    }
  }
}
```
> [!NOTE]
> You can set the `clientCertificateMode` directly on the ingress property. It isn't available as an explicit option in the CLI, but you can patch your app using the Azure CLI.

Before you run the following commands, make sure to replace the placeholders surrounded by `<>` with your own values.

Get the Azure Resource Manager (ARM) ID of your container app:

```bash
APP_ID=$(az containerapp show \
  --name <APP_NAME> \
  --resource-group <RESOURCE_GROUP> \
  --query id \
  --output tsv)
```

Patch the `clientCertificateMode` property on the app:

```azurecli
az rest \
  --method patch \
  --url "https://management.azure.com/$APP_ID?api-version=<API_VERSION>" \
  --body '{
    "properties": {
      "configuration": {
        "ingress": {
          "clientCertificateMode": "require"
        }
      }
    }
  }'
```

> [!NOTE]
> Be sure to use a valid and stable API version that supports this feature. For example, replace <API_VERSION> in the command with 2025-01-01 or another supported version.

## Client certificate mode and header format

The value for `clientCertificateMode` varies what you need to provide for Container Apps to manage your certificate:
- When `require` is set, the client must provide a certificate.
- When `accept` is set, the certificate is optional. If the client provides a certificate, it passes to the app in the `X-Forwarded-Client-Cert` header, as a semicolon-separated list. 

### Example `X-Forwarded-Client-Cert` header value

The following example is a sample value of the `X-Forwarded-Client-Cert` header that your app might receive:

```text
Hash=<HASH_VALUE>;Cert="-----BEGIN CERTIFICATE-----<CERTIFICATE_VALUE>";Chain="-----BEGIN CERTIFICATE-----<CERTIFICATE_VALUE>";
```

### Header field breakdown

| Field   | Description                                                                | How to Use It                                                  |
|---|---|---|
| `Hash`  | The SHA-256 thumbprint of the client certificate.                         | Use the thumbprint to identify or validate the client certificate.              |
| `Cert`  | The base64-encoded client certificate in PEM format (single certificate). | Parse the certificate to inspect metadata such as subject and issuer. |
| `Chain` | One or more PEM-encoded intermediate certificates.                        | Provide the intermediate certificates when building a full trust chain for validation. |


## Next Steps

> [!div class="nextstepaction"]
> [Configure ingress](ingress-how-to.md)