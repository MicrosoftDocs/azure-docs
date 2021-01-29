---
title: Azure Firewall Premium Preview certificates
description: To properly configure TLS inspection on Azure Firewall Premium Preview, you must configure and install Intermediate CA certificates.
author: vhorne
ms.service: firewall
services: firewall
ms.topic: conceptual
ms.date: 01/29/2021
ms.author: victorh
---

# Azure Firewall Premium Preview certificates 

> [!IMPORTANT]
> Azure Firewall Premium is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

 To properly configure Azure Firewall Premium Preview TLS inspection, you must provide a valid intermediate CA certificate and deposit it in Azure Key vault.

## Intermediate CA certificate requirements

Ensure your CA certificate complies with the following requirements:

- When deployed as a Key Vault secret, you must use Password-less PFX (Pkcs12) with a certificate and a private key.

- It must be a single certificate, and shouldn’t include the entire chain of certificates.  

- It must be valid for one year forward.  

- It must be an RSA private key with minimal size of 4096 bytes.  

- It must have the `KeyUsage` extension marked as Critical with the `KeyCertSign` flag (RFC 5280; 4.2.1.3 Key Usage).

- It must have the `BasicContraints` extension marked as Critical (RFC 5280; 4.2.1.9 Basic Constraints).  

- The `CA` flag must be set to TRUE.

- The Path Length must be greater than or equal to one.

## Troubleshooting

If your CA certificate is valid, but you can’t access FQDNs or URLs under TLS inspection, check the following items:

- Ensure the web server certificate is valid.  

- Ensure the Root CA certificate is installed on client operating system.  

- Ensure the browser or HTTPS client contains a valid root certificate. Firefox and some other browsers may have special certification policies.  

- Ensure the URL destination type in your application rule covers the correct path and any other hyperlinks embedded in the destination HTML page. You can use wildcards for easy coverage of the entire required URL path.  


## Next steps

- [Learn more about Azure Firewall Premium features](premium-overview.md)
