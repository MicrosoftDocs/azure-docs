---
title: Configure mutual TLS authentication in Azure Container Apps
description: How to configure mutual TLS authentication in Azure Container Apps
services: container-apps
author: cebundy
ms.service: container-apps
ms.topic: how-to
ms.date: 02/27/2023
ms.author: v-bcatherine
---

# Configure mutual TLS authentication in Azure Container Apps

Azure Container Apps supports mutual TLS to allow you to authorize access to your container app through two-way authentication. mTLS exchanges certificates between the client and your container app to authenticate the identity of the client and the server. This article shows you how to configure client certificate authorization in Azure Container Apps.
 
mTLS is often used in "zero trust" security models to authorize client access within an organization.  For example, you might want to require a client certificate for a backend container app used to manage sensitive data.

Container Apps accepts client certificates in the PKCS12 format issued by a trusted certificate authority (CA) or is self-signed.  

> [!NOTE}
> Is this true?
>
>The certificate must be configured with a password to protect the certificate's private key.  The password is not used to authenticate the client.


>[!NOTE]
> Client certificate authorization is only supported in Container Apps environments that use a [custom VNET](vnet-custom.md).
> Question:  Are certificates available in the consumption tier?  Any other limitations?  
> Should we include more use cases?

## Configure client certificate authorization

The client certificate mode is an ingress property that can be configured for your container app.  The property can be set to one of the following values:

    - require: The client certificate is required for all requests to the container app.
    - accept: The client certificate is optional. If the client certificate is not provided, the request is still accepted.
    - ignore: The client certificate is ignored. 

When `require` or `accept` are set, ingress passes the client certificate to the container app.


The following template example configures ingress to require a client certificate for all requests to the container app.

```text
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

You can configure client certificate authorization for your container app in the Azure portal or by using the Azure CLI.  

# [Azure portal](#tab/azure-portal)

To configure client certificate authorization in the Azure portal, follow these steps:

1. In the Azure portal, go to your container app.
1. Select **Networking**.
1. ???


# [Azure CLI](#tab/azure-cli)
  
>[!NOTE]
> need to add the CLI commands here

---

