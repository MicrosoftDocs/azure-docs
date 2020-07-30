---
title: What's New for Azure Key Vault | Microsoft Docs
description: Recent updates for Azure Key Vault
services: key-vault
author: msmbaldwin
tags: azure-resource-manager

ms.service: key-vault
ms.subservice: general
ms.topic: tutorial
ms.date: 07/27/2020
ms.author: mbaldwin

#Customer intent: As an Azure Key Vault administrator, I want to react to soft-delete being turned on for all key vaults.

---

# What's New for Azure Key Vault

> [!WARNING]
> There are two updates to key vault that have the potential to break implementations of the service: [key vault soft-delete on by default](#soft-delete-on-by-default) and [Azure TLS certificate changes](#azure-tls-certificate-changes). See below for details.

## July 2020

### Soft delete on by default

By the end of 2020, the **soft-delete will be on by default for all key vaults**, both new and pre-existing. For full details on this potentially breaking change, as well as steps to find affected key vaults and update them beforehand, see the article [Soft-delete will be enabled on all key vaults](soft-delete-change.md). 

### Azure TLS Certificate Changes  

Microsoft is updating Azure services to use TLS certificates from a different set of Root Certificate Authorities (CAs). This change is being made because the current CA certificates do not comply with one of the CA/Browser Forum Baseline requirements.

#### When will this change happen?

- Azure Active Directory (Azure AD) services began this transition on July 7, 2020. 
- All newly created Azure TLS/SSL endpoints contain updated certificates chaining up to the new Root CAs. 
- Existing Azure endpoints will transition in a phased manner beginning August 13, 2020.  

> [!IMPORTANT]
> Customers may need to update their application(s) after this change to prevent connectivity failures when attempting to connect to Azure services. 

#### What is changing

Today, most of the TLS certificates used by Azure services chain up to the following Root CA:

CURRENT ROOT

| Test | Table |
|--|--|
| one | two |

| Common name of the CA | Thumbprint (SHA1) |
|--|--|
| Baltimore CyberTrust Root | d4de20d05e66fc53fe1a50882c78db2852cae474 |

TLS certificates used by Azure services will chain up to one of the following Root CAs:

ROOTS

| Common name of the CA | Thumbprint (SHA1) |
|--|--|
| [DigiCert Global Root G2](https://cacerts.digicert.com/DigiCertGlobalRootG2.crt) | df3c24f9bfd666761b268073fe06d1cc8d4f82a4 |
| [DigiCert Global Root CA](https://cacerts.digicert.com/DigiCertGlobalRootCA.crt) | a8985d3a65e5e5c4b2d7d66d40c6dd2fb19c5436 |
| [Baltimore CyberTrust Root](https://cacerts.digicert.com/BaltimoreCyberTrustRoot.crt) | d4de20d05e66fc53fe1a50882c78db2852cae474 |
| [D-TRUST Root Class 3 CA 2 2009](https://www.d-trust.net/cgi-bin/D-TRUST_Root_Class_3_CA_2_2009.crt) | 58e8abb0361533fb80f79b1b6d29d3ff8d5f00f0 |
| [Microsoft RSA Root Certificate Authority 2017](https://www.microsoft.com/pkiops/certs/Microsoft+RSA+Root+Certificate+Authority+2017.crt) | 73a5e64a3bff8316ff0edccc618a906e4eae4d74 | 
| [Microsoft EV ECC Root Certificate Authority 2017](https://www.microsoft.com/pkiops/certs/Microsoft+EV+ECC+Root+Certificate+Authority+2017.crt) | 6b1937abfd64e1e40daf2262a27857c015d6228d |

#### Frequently asked questions

##### When can I retire the old intermediate thumbprint?

The current CA certificates will *not* be revoked until Feb 15, 2021. After that date you can remove the old thumbprints from your code.

If this date changes, you will be notified of the new revocation date.

##### Will this affect me?

We expect that most Azure customers will **not** be impacted.  However, your application may be impacted if it explicitly specifies a list of acceptable CAs. This practice is known as certificate pinning.

Here are some ways to detect if your application is impacted:

- Search your source code for the thumbprint, Common Name, and other cert properties of any of the Microsoft IT TLS CAs found here. If there is a match, then your application will be impacted. To resolve this problem, update the source code include the new CAs. As a best practice ensure that CAs can be added or edited on short notice. Industry regulations requires CA certificates to be replaced within 7 days and hence customers relying on pinning need to react swiftly.

- If you have an application that integrates with Azure APIs or other Azure services and you are unsure if it uses certificate pinning, check with the application vendor.

- Different operating systems and language runtimes that communicate with Azure services may require additional steps to correctly build the certificate chain with these new roots: 
    - Linux. Many distributions require you to add CAs listed above to /etc/ssl/certs. For specific instructions refer to the distribution’s documentation.
    - Java. Ensure that the Java key store contains the CAs listed above.
    - Windows running in disconnected environments. Systems running in disconnected environments will need to have the roots listed above added to the Trusted Root Certification Authorities store, and the intermediates added to the Intermediate Certification Authorities store.
    - Android. Check the documentation for your device and version of Android.
    - Other hardware devices especially IoT. Contact the device manufacturer. 

_ _You have an environment where firewall rules are set to allow outbound calls to only specific Certificate Revocation List (CRL) download and/or Online Certificate Status Protocol (OCSP) verification locations. You will need to allow the following CRL and OCSP URLs:
    - https://crl3.digicert.com
    - https://crl4.digicert.com
    - https://ocsp.digicert.com
    - https://www.d-trust.net
    - https:// root-c3-ca2-2009.ocsp.d-trust.net
    - https://crl.microsoft.com
    - https://oneocsp.microsoft.com
    - https://ocsp.msocsp.com



If you have any questions, please contact us through [support](https://azure.microsoft.com/support/options/). 

## Next steps
 
