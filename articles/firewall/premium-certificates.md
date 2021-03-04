---
title: Azure Firewall Premium Preview certificates
description: To properly configure TLS inspection on Azure Firewall Premium Preview, you must configure and install Intermediate CA certificates.
author: vhorne
ms.service: firewall
services: firewall
ms.topic: conceptual
ms.date: 02/16/2021
ms.author: victorh
---

# Azure Firewall Premium Preview certificates 

> [!IMPORTANT]
> Azure Firewall Premium is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

 To properly configure Azure Firewall Premium Preview TLS inspection, you must provide a valid intermediate CA certificate and deposit it in Azure Key vault.

## Certificates used by Azure Firewall Premium Preview

There are three types of certificates used in a typical deployment:

- **Intermediate CA Certificate (CA Certificate)**

   A Certificate Authority (CA) is an organization that is trusted to sign digital certificates. A CA verifies identity and legitimacy of a company or individual requesting a certificate. If the verification is successful, the CA issues a signed certificate. When the server presents the certificate to the client (for example, your web browser) during a SSL/TLS handshake, the client attempts to verify the signature against a list of *known good* signers. Web browsers normally come with lists of CAs that they implicitly trust to identify hosts. If the authority is not in the list, as with some sites that sign their own certificates, the browser alerts the user that the certificate is not signed by a recognized authority and asks the user if they wish to continue communications with unverified site.

- **Server Certificate (Website certificate)**

   A certificate associated with to specific domain name. If a website has a valid certificate, it means that a certificate authority has taken steps to verify that the web address actually belongs to that organization. When you type a URL or follow a link to a secure website, your browser checks the certificate for the following characteristics:
   - The website address matches the address on the certificate.
   - The certificate is signed by a certificate authority that the browser recognizes as a *trusted* authority.
   
   Occasionally users may connect to a server with an untrusted certificate. Azure Firewall will drop the connection as if the server terminated the connection.

- **Root CA Certificate (root certificate)**

   A certificate authority can issue multiple certificates in the form of a tree structure. A root certificate is the top-most certificate of the tree.

Azure Firewall Premium Preview can intercept outbound HTTP/S traffic and auto-generate a server certificate for `www.website.com`. This certificate is generated using the Intermediate CA certificate that you provide. End-user browser and client applications must trust your organization Root CA certificate or intermediate CA certificate for this procedure to work. 

:::image type="content" source="media/premium-certificates/certificate-process.png" alt-text="Certificate process":::

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

## Azure Key Vault

[Azure Key Vault](../key-vault/general/overview.md) is a platform-managed secret store that you can use to safeguard secrets, keys, and TLS/SSL certificates. Azure Firewall Premium supports integration with Key Vault for server certificates that are attached to a Firewall Policy.
 
To configure your key vault:

- You need to import an existing certificate with its key pair into your key vault. 
- Alternatively, you can also use a key vault secret that's stored as a password-less, base-64 encoded PFX file.  A PFX file is a digital certificate containing both private key and public key.
- It's recommended to use a CA certificate import because it allows you to configure an alert based on certificate expiration date.
- After you've imported a certificate or a secret, you need to define access policies in the key vault to allow the identity to be granted get access to the certificate/secret.
- The provided CA certificate needs to be trusted by your Azure workload. Ensure they are deployed correctly.

You can either create or reuse an existing user-assigned managed identity, which Azure Firewall uses to retrieve certificates from Key Vault on your behalf. For more information, see [What is managed identities for Azure resources?](../active-directory/managed-identities-azure-resources/overview.md) 

## Configure a certificate in your policy

To configure a CA certificate in your Firewall Premium policy, select your policy and then select **TLS inspection (preview)**. Select **Enabled** on the **TLS inspection** page. Then select your CA certificate in Azure Key Vault, as shown in the following figure:

:::image type="content" source="media/premium-certificates/tls-inspection.png" alt-text="Azure Firewall Premium overview diagram":::
 
> [!IMPORTANT]
> To see and configure a certificate from the Azure portal, you must add your Azure user account to the Key Vault Access policy. Give your user account **Get** and **List** under **Secret Permissions**.
   :::image type="content" source="media/premium-certificates/secret-permissions.png" alt-text="Azure Key Vault Access policy":::


## Troubleshooting

If your CA certificate is valid, but you can’t access FQDNs or URLs under TLS inspection, check the following items:

- Ensure the web server certificate is valid.  

- Ensure the Root CA certificate is installed on client operating system.  

- Ensure the browser or HTTPS client contains a valid root certificate. Firefox and some other browsers may have special certification policies.  

- Ensure the URL destination type in your application rule covers the correct path and any other hyperlinks embedded in the destination HTML page. You can use wildcards for easy coverage of the entire required URL path.  


## Next steps

- [Learn more about Azure Firewall Premium features](premium-features.md)
