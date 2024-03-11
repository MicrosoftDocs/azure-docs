---
title: Certificates in Azure Container Apps
description: Learn the different options available to using and managing secure certificates in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: conceptual
ms.date: 03/11/2024
ms.author: cshoe
---

# Certificates in Azure Container Apps

You can add digital security certificates to [secure custom DNS names](configure-ssl-bindings.md) in [Azure App Service](overview.md), which provides a highly scalable, self-patching web hosting service. Transport Layer Security (TLS) certificates, also previously known as Secure Socket Layer (SSL) certificates, are private or public certificates that help you secure internet connections by encrypting data sent between your browser, websites that you visit, and the website server.

The following table lists the options for you to add certificates in Container Apps:

|Option|Description|
|---|---|
| [Create a free Container Apps managed certificate](./custom-domains-managed-certificates.md) | A private certificate that's free of charge and easy to use if you just need to secure your custom domain in Container Apps. |
| Import an Container Apps certificate | A private certificate managed by Azure. It combines the simplicity of automated certificate management and the flexibility of renewal and export options. |
| Import a certificate from Key Vault | Useful if you use [Azure Key Vault](../key-vault/index.yml) to manage your [PKCS12 certificates](https://wikipedia.org/wiki/PKCS_12). See [Private certificate requirements](#private-certificate-requirements). |
| [Upload a private certificate](./custom-domains-certificates) | You can upload a a private certificate if you already have one. See [Private certificate requirements](#private-certificate-requirements). |

## Private certificate requirements

The [free Container Apps managed certificate](./custom-domains-managed-certificates.md) and the Container Apps certificate already satisfy the requirements of App Service. If you choose to upload or import a private certificate to App Service, your certificate must meet the following requirements:

* Exported as a [password-protected PFX file](https://en.wikipedia.org/w/index.php?title=X.509&section=4#Certificate_filename_extensions), encrypted using triple DES.

* Contains private key at least 2,048 bits long.

* Contains all intermediate certificates and the root certificate in the certificate chain.

To secure a custom domain in a TLS binding, the certificate has more requirements:

* Contains an [Extended Key Usage](https://en.wikipedia.org/w/index.php?title=X.509&section=4#Extensions_informing_a_specific_usage_of_a_certificate) for server authentication (OID = 1.3.6.1.5.5.7.3.1)

* Signed by a trusted certificate authority

> [!NOTE]
> **Elliptic Curve Cryptography (ECC) certificates** work with Container Apps but aren't covered by this article. For the exact steps to create ECC certificates, work with your certificate authority.

> [!NOTE]
> After you upload a private certificate to an app, the certificate is stored in a deployment unit that's bound to the Container Apps plan's resource group, region, and operating system combination, internally called a *webspace*. That way, the certificate is accessible to other apps in the same resource group and region combination. Private certificates uploaded or imported to Container Apps are shared with App Services in the same deployment unit.

## Next steps

> [!div class="nextstepaction"]
> [Manage certificates](certificates-manage.md)
