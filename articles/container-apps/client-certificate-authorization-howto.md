---
title: Configure client certificate authentication in Azure Container Apps
description: How to configure client authentication in Azure Container Apps
services: container-apps
author: cebundy
ms.service: container-apps
ms.topic: how-to
ms.date: 02/27/2023
ms.author: v-bcatherine
---

# Configure client certificate authentication in Azure Container Apps

Azure Container Apps supports client certificate authentication (also known as mutual TLS or mTLS) to allow access to your container app through two-way authentication. This article shows you how to configure client certificate authorization in Azure Container Apps.
 
When client certificate are used, the TLS certificates are exchanged between the client and your container app to authenticate identity and enable traffic encryption.  Client certificates are often used in "zero trust" security models to authorize client access within an organization.  For example, you might want to require a client certificate for a backend container app used to manage sensitive data.

Container Apps accepts client certificates in the PKCS12 format are that issued by a trusted certificate authority (CA) or are self-signed.  

<!--
Anthony mentioned that we customer will be able to obtain a client certificate through Azure.  So this will need to be added to the doc.
-->

>[!NOTE]
> Client certificate authorization is only supported in Container Apps environments that use a [custom VNET](vnet-custom.md).
> Question:  Are certificates available in the consumption tier?  Any other limitations?  
> Should we include more use cases?

## Configure client certificate authorization

The client certificate mode is an ingress property that can be configured for your container app.  The property can be set to one of the following values:

- require: The client certificate is required for all requests to the container app.
- accept: The client certificate is optional. If the client certificate isn't provided, the request is still accepted.
- ignore: The client certificate is ignored. 

When `require` or `accept` are set, ingress passes the client certificate to the container app.


The following template example configures ingress to require a client certificate for all requests to the container app.

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

<!--

Add this section when we have the CLI and portal support
You can configure client certificate authorization for your container app in the Azure portal or by using the Azure CLI.  

# [Azure portal](#tab/azure-portal)

To configure client certificate authorization in the Azure portal, follow these steps:

1. In the Azure portal, go to your container app resource page.
1. Select **Ingress** from .
1. Select the **Client certificate mode** drop-down list.
    1. **Require**: Client certificate are required.
    1. **Accept**: Client certificates are not required, but are accepted if provided.
    1. **Ignore**: Client certificates are ignored.
1. Select **Save**


# [Azure CLI](#tab/azure-cli)
  
>[!NOTE]
> need to add the CLI commands here

---

-->

## Next Steps

> [!div class="nextstepaction"]
> [Configure ingress](ingress.md)