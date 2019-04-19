---
title: SSL termination with Key Vault certificates
description: Learn how you can integrate Azure application gateway with Key Vault for server certificates that are attached to HTTPS enabled listeners.
services: application-gateway
author: vhorne
ms.service: application-gateway
ms.topic: article
ms.date: 4/19/2019
ms.author: victorh
---

# SSL termination with Key Vault certificates

[Azure Key Vault](../key-vault/key-vault-whatis.md) is a platform-managed secret store you can use to safeguard secrets, keys, and SSL certificates. Application Gateway supports integration with Key Vault (in public preview) for server certificates that are attached to HTTPS enabled listeners. This support is limited to the v2 SKU of Application Gateway.

> [!IMPORTANT]
> The Application Gateway Key Vault integration is currently in public preview. This preview is provided without a service level agreement and is not recommended for production workloads. Certain features may not be supported or may have constrained capabilities. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for details.

There are two models for SSL termination with this public preview:

- You can explicitly provide SSL certificates attached to the listener. This is the traditional model of passing SSL certificates to Application Gateway for SSL termination.
- You can optionally provide a reference to an existing Key Vault certificate or secret during HTTPS enabled listener creation.

There are many benefits with Key Vault integration, including:

- Stronger security since SSL certificates are not directly handled by the application development team. Integration with Key Vault allows a separate security team to provision, control life cycle, and give appropriate permission to select Application Gateways to access certificates stored in Key Vault.
- Support to import existing certificates into Key Vault, or use Key Vault APIs to create and manage new certificates with any of the trusted Key Vault partners.
- Support for certificates stored in Key Vault to automatically renew.

Application Gateway currently supports software validated certificates only. Hardware security module (HSM) validated certificates are not supported. Once Application Gateway is configured to use Key Vault certificates, its instances retrieve the certificate from Key Vault and install them locally for SSL termination. The instances also periodically poll Key Vault at a 24-hour interval to retrieve a renewed version of the certificate, if it exists. If an updated certificate is found, the SSL certificate currently associated with the HTTPS Listener is automatically rotated.

## How it works

Integration with Key Vault requires a three-step configuration process:

1. **Create user assigned managed identity**

   You must create or reuse an existing user assigned managed identity which Application Gateway uses to retrieve certificates from Key Vault on your behalf. For more information, see [What is managed identities for Azure resources?](../active-directory/managed-identities-azure-resources/overview.md) This step creates a new identity in Azure AD tenant, which is trusted by the subscription used to create the identity.
1. **Configure Key Vault**

   You must then either import or create a new certificate in Key Vault used by applications running through Application Gateway. A Key Vault secret stored as password-less base 64 encoded PFX file can also be used in this step. Using a certificate type is preferred due to autorenewal capabilities available with certificate type objects in Key Vault. Once a certificate or secret is created, access policies must be defined in the Key Vault to allow the identity to be granted *get* access to fetch the secret.

1. **Configure Application Gateway**

   Once the previous two steps are completed, you can provision or modify an existing Application Gateway to use the user assigned managed identity. You also configure the HTTP listener’s SSL certificate to point to the complete URI of Key Vault's certificate or secret ID.

![Key Vault certificates](media/key-vault-certs/ag-kv.png)

## Next steps

[Configure SSL termination with Key Vault certificates using Azure PowerShell](configure-keyvault-ps.md).