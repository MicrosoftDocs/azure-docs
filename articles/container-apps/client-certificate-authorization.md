---
title: Configure client certificate authentication in Azure Container Apps
description: How to configure client authentication in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: how-to
ms.date: 03/29/2023
ms.author: cshoe
---

# Configure client certificate authentication in Azure Container Apps

Azure Container Apps supports client certificate authentication (also known as mutual TLS or mTLS) that allows access to your container app through two-way authentication. This article shows you how to configure client certificate authorization in Azure Container Apps.

When client certificates are used, the TLS certificates are exchanged between the client and your container app to authenticate identity and encrypt traffic.  Client certificates are often used in "zero trust" security models to authorize client access within an organization.

For example, you may want to require a client certificate for a container app that manages sensitive data.

Container Apps accepts client certificates in the PKCS12 format are that issued by a trusted certificate authority (CA), or are self-signed.  

## Configure client certificate authorization

Set the `clientCertificateMode` property in your container app template to configure support of client certificates.

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

## Next Steps

> [!div class="nextstepaction"]
> [Configure ingress](ingress-how-to.md)