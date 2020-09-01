---
title: What's New for Azure Key Vault | Microsoft Docs
description: Recent updates for Azure Key Vault
services: key-vault
author: msmbaldwin
tags: azure-resource-manager

ms.service: key-vault
ms.subservice: general
ms.topic: overview
ms.date: 07/27/2020
ms.author: mbaldwin

#Customer intent: As an Azure Key Vault administrator, I want to react to soft-delete being turned on for all key vaults.

---

# What's New for Azure Key Vault

> [!WARNING]
> **July 2020**: There are two updates to key vault that have the potential to impact implementations of the service: [key vault soft-delete on by default](#soft-delete-on-by-default) and [Azure TLS certificate changes](#azure-tls-certificate-changes). See below for details.

Here's what's new with Azure Key Vault. New features and improvements are also announced on the [Azure updates Key Vault channel](https://azure.microsoft.com/updates/?category=security&query=Key%20vault).

## Soft delete on by default

By the end of 2020, the **soft-delete will be on by default for all key vaults**, both new and pre-existing. For full details on this potentially breaking change, as well as steps to find affected key vaults and update them beforehand, see the article [Soft-delete will be enabled on all key vaults](soft-delete-change.md). 

## Azure TLS Certificate Changes  

Microsoft is updating Azure services to use TLS certificates from a different set of Root Certificate Authorities (CAs). This change is being made because the current CA certificates do not comply with one of the CA/Browser Forum Baseline requirements.

### When will this change happen?

- Azure Active Directory (Azure AD) services began this transition on July 7, 2020.
- All newly created Azure TLS/SSL endpoints contain updated certificates chaining up to the new Root CAs. 
- Existing Azure endpoints will transition in a phased manner beginning August 13, 2020 and completing by October 26, 2020.

> [!IMPORTANT]
> Customers may need to update their application(s) after this change to prevent connectivity failures when attempting to connect to Azure services. 

### What is changing?

Today, most of the TLS certificates used by Azure services chain up to the following Root CA:

| Common name of the CA | Thumbprint (SHA1) |
|--|--|
| [Baltimore CyberTrust Root](https://cacerts.digicert.com/BaltimoreCyberTrustRoot.crt) | d4de20d05e66fc53fe1a50882c78db2852cae474 |

TLS certificates used by Azure services will chain up to one of the following Root CAs:

| Common name of the CA | Thumbprint (SHA1) |
|--|--|
| [DigiCert Global Root G2](https://cacerts.digicert.com/DigiCertGlobalRootG2.crt) | df3c24f9bfd666761b268073fe06d1cc8d4f82a4 |
| [DigiCert Global Root CA](https://cacerts.digicert.com/DigiCertGlobalRootCA.crt) | a8985d3a65e5e5c4b2d7d66d40c6dd2fb19c5436 |
| [Baltimore CyberTrust Root](https://cacerts.digicert.com/BaltimoreCyberTrustRoot.crt) | d4de20d05e66fc53fe1a50882c78db2852cae474 |
| [D-TRUST Root Class 3 CA 2 2009](https://www.d-trust.net/cgi-bin/D-TRUST_Root_Class_3_CA_2_2009.crt) | 58e8abb0361533fb80f79b1b6d29d3ff8d5f00f0 |
| [Microsoft RSA Root Certificate Authority 2017](https://www.microsoft.com/pkiops/certs/Microsoft%20RSA%20Root%20Certificate%20Authority%202017.crt) | 73a5e64a3bff8316ff0edccc618a906e4eae4d74 | 
| [Microsoft EV ECC Root Certificate Authority 2017](https://www.microsoft.com/pkiops/certs/Microsoft%20EV%20ECC%20Root%20Certificate%20Authority%202017.crt) | 6b1937abfd64e1e40daf2262a27857c015d6228d |

### When can I retire the old intermediate thumbprint?

The current CA certificates will *not* be revoked until Feb 15, 2021. After that date you can remove the old thumbprints from your code.

If this date changes, you will be notified of the new revocation date.

### Will this affect me?

We expect that **most Azure customers will not** be impacted.  However, your application may be impacted if it explicitly specifies a list of acceptable CAs. This practice is known as certificate pinning.

Here are some ways to detect if your application is impacted:

- Search your source code for the thumbprint, Common Name, and other cert properties of any of the Microsoft IT TLS CAs found [here](https://www.microsoft.com/pki/mscorp/cps/default.htm). If there is a match, then your application will be impacted. To resolve this problem, update the source code include the new CAs. As a best practice ensure that CAs can be added or edited on short notice. Industry regulations requires CA certificates to be replaced within 7 days and hence customers relying on pinning need to react swiftly.

- If you have an application that integrates with Azure APIs or other Azure services and you are unsure if it uses certificate pinning, check with the application vendor.

- Different operating systems and language runtimes that communicate with Azure services may require additional steps to correctly build the certificate chain with these new roots: 
    - **Linux**: Many distributions require you to add CAs listed above to /etc/ssl/certs. For specific instructions refer to the distribution’s documentation.
    - **Java**: Ensure that the Java key store contains the CAs listed above.
    - **Windows running in disconnected environments**: Systems running in disconnected environments will need to have the roots listed above added to the Trusted Root Certification Authorities store, and the intermediates added to the Intermediate Certification Authorities store.
    - **Android**: Check the documentation for your device and version of Android.
    - **Other hardware devices, especially IoT**: Contact the device manufacturer. 

- If you have an environment where firewall rules are set to allow outbound calls to only specific Certificate Revocation List (CRL) download and/or Online Certificate Status Protocol (OCSP) verification locations. You will need to allow the following CRL and OCSP URLs:

    - http://crl3&#46;digicert&#46;com
    - http://crl4&#46;digicert&#46;com
    - http://ocsp&#46;digicert&#46;com
    - http://www&#46;d-trust&#46;net
    - http://root-c3-ca2-2009&#46;ocsp&#46;d-trust&#46;net
    - http://crl&#46;microsoft&#46;com
    - http://oneocsp&#46;microsoft&#46;com
    - http://ocsp&#46;msocsp&#46;com

## June 2020

Azure Monitor for Key Vault is now in preview.  Azure Monitor provides comprehensive monitoring of your key vaults by delivering a unified view of your Key Vault requests, performance, failures, and latency. For more information, see [Azure Monitor for Key Vault (preview).](../../azure-monitor/insights/key-vault-insights-overview.md).

## May 2020

Key Vault "bring your own key" (BYOK) is now generally available. See the [Azure Key Vault BYOK specification](../keys/byok-specification.md), and learn how to [Import HSM-protected keys to Key Vault (BYOK)](../keys/hsm-protected-keys-byok.md).

## March 2020

Private endpoints now available in preview. Azure Private Link Service enables you to access Azure Key Vault and Azure hosted customer/partner services over a Private Endpoint in your virtual network.  Learn how to [Integrate Key Vault with Azure Private Link](private-link-service.md).

## 2019

- Release of the next-generation Azure Key Vault SDKs. For examples of their use, see the Azure Key Vault secret quickstarts for [Python](../secrets/quick-create-python.md), [.NET](../secrets/quick-create-net.md), [Java](../secrets/quick-create-java.md), and [Node.js](../secrets/quick-create-node.md)
- New Azure policies to manage key vault certificates. See the [Azure Policy built-in definitions for Key Vault](../policy-samples.md).
- Azure Key Vault Virtual Machine extension now generally available.  See [Key Vault virtual machine extension for Linux](../../virtual-machines/extensions/key-vault-linux.md) and [Key Vault virtual machine extension for Windows](../../virtual-machines/extensions/key-vault-windows.md).
- Event-driven secrets management for Azure Key Vault now available in Azure Event Grid. For more information, see [the Event Grid schema for events in Azure Key Vault](../../event-grid/event-schema-key-vault.md], and learn how to [Receive and respond to key vault notifications with Azure Event Grid](event-grid-tutorial.md).

## 2018

New features and integrations released this year:

- Integration with Azure Functions. For an example scenario leveraging [Azure Functions](../../azure-functions/index.yml) for key vault operations, see [Automate the rotation of a secret](../secrets/tutorial-rotation.md). 
- [Integration with Azure Databricks](/azure/databricks/scenarios/store-secrets-azure-key-vault). With this, Azure Databricks now supports two types of secret scopes: Azure Key Vault-backed and Databricks-backed. For more information, see [Create an Azure Key Vault-backed secret scope](/azure/databricks/security/secrets/secret-scopes#--create-an-azure-key-vault-backed-secret-scope)
- [Virtual network service endpoints for Azure Key Vault](overview-vnet-service-endpoints.md).

## 2016

New features released this year:

- Managed storage account keys. Storage Account Keys feature added easier integration with Azure Storage. See the overview topic for more information, [Managed Storage Account Keys overview](https://docs.microsoft.com/azure/key-vault/key-vault-ovw-storage-keys).
- Soft delete. Soft-delete feature improves data protection of your key vaults and key vault objects. See the overview topic for more information, [Soft-delete overview](https://docs.microsoft.com/azure/key-vault/key-vault-ovw-soft-delete).

## 2015

New features released this year:
- Certificate management. Added as a feature to the GA version 2015-06-01 on September 26, 2016.

General Availability (version 2015-06-01) was announced on June 24, 2015. The following changes were made at this release: 
- Delete a key - "use" field removed.
- Get information about a key - "use" field removed.
- Import a key into a vault - "use" field removed.
- Restore a key - "use" field removed.     
- Changed "RSA_OAEP" to "RSA-OAEP" for RSA Algorithms. See [About keys, secrets, and certificates](about-keys-secrets-certificates.md).    
 
Second preview version (version 2015-02-01-preview) was announced April 20, 2015. For more information, see [REST API Update](https://docs.microsoft.com/archive/blogs/kv/rest-api-update) blog post. The following tasks were updated:
 
- List the keys in a vault - added pagination support to operation.
- List the versions of a key - added operation to list the versions of a key.  
- List secrets in a vault - added pagination support.
- List versions of a secret - add operation to list the versions of a secret.  
- All operations - Added created/updated timestamps to attributes.  
- Create a secret - added Content-Type to secrets.
- Create a key - added tags as optional information.
- Create a secret - added tags as optional information.
- Update a key - added tags as optional information.
- Update a secret - added tags as optional information.
- Changed max size for secrets from 10 K to 25 K Bytes. See, [About keys, secrets, and certificates](about-keys-secrets-certificates.md).    

## 2014
 
First preview version (version 2014-12-08-preview) was announced on January 8, 2015.  

## Next steps

If you have additional questions, please contact us through [support](https://azure.microsoft.com/support/options/).  
