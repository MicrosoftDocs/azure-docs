---
title: Soft Delete will be enabled on all Azure Key Vaults | Microsoft Docs
description: Use this document to adopt soft-delete for all key vaults.
services: key-vault
author: ShaneBala-keyvault
manager: ravijan
tags: azure-resource-manager

ms.service: key-vault
ms.subservice: general
ms.topic: tutorial
ms.date: 07/27/2020
ms.author: sudbalas

#Customer intent: As an Azure Key Vault administrator, I want to react to soft-delete being turned on for all key vaults.

---

# What's New for Azure Key Vault

> [!WARNING]
> There are two updates to key vault that have the potential to break implementations of the service: [key vault soft-delete on by default](#soft-delete-on-by-default) and [Azure TLS certificate changes](#azure-tls-certificate-changes). See below for details.

## July 2020

### Soft delete on be default

By the end of 2020, the **soft-delete will be on by default** for all key vaults, both new and existsing.  For full details on this potentially breaking change, as well as steps to find and updates your key vaults in anticipation of the update, see the article [Soft-delete will be enabled on all key vaults](soft-delete-change.md).

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
Common Name of the CA	Thumbprint (SHA1)
Baltimore CyberTrust Root
d4de20d05e66fc53fe1a50882c78db2852cae474
TLS certificates used by Azure services will chain up to one of the following Root CAs  
ROOTS
Common Name of the CA	Thumbprint (SHA1)
DigiCert Global Root G2
df3c24f9bfd666761b268073fe06d1cc8d4f82a4
DigiCert Global Root CA
a8985d3a65e5e5c4b2d7d66d40c6dd2fb19c5436
Baltimore CyberTrust Root
d4de20d05e66fc53fe1a50882c78db2852cae474
D-TRUST Root Class 3 CA 2 2009
58e8abb0361533fb80f79b1b6d29d3ff8d5f00f0
Microsoft RSA Root Certificate Authority 2017
73a5e64a3bff8316ff0edccc618a906e4eae4d74
Microsoft EV ECC Root Certificate Authority 2017
6b1937abfd64e1e40daf2262a27857c015d6228d
 


When can I retire the old intermediate thumbprint?
The current CA certificates will *not* be revoked until Feb 15, 2021. After that date you can remove the old thumbprints from your code.
If this date changes, you will be notified of the new revocation date.
Will this affect you?
We expect that most Azure customers will *not* be impacted.  However, your application may be impacted if it explicitly specifies a list of acceptable CAs. This practice is known as certificate pinning.   
Here are some ways to detect if your application is impacted:

1.	Search your source code for the thumbprint, Common Name, and other cert properties of any of the Microsoft IT TLS CAs found here. If there is a match, then your application will be impacted. To resolve this problem, update the source code include the new CAs. As a best practice ensure that CAs can be added or edited on short notice. Industry regulations requires CA certificates to be replaced within 7 days and hence customers relying on pinning need to react swiftly.

2.	If you have an application that integrates with Azure APIs or other Azure services and you are unsure if it uses certificate pinning, check with the application vendor.

3.	Different operating systems and language runtimes that communicate with Azure services may require additional steps to correctly build the certificate chain with these new roots: 
a.	Linux. Many distributions require you to add CAs listed above to /etc/ssl/certs. For specific instructions refer to the distribution’s documentation.
b.	Java. Ensure that the Java key store contains the CAs listed above.
c.	Windows running in disconnected environments. Systems running in disconnected environments will need to have the roots listed above added to the Trusted Root Certification Authorities store, and the intermediates added to the Intermediate Certification Authorities store.
d.	Android. Check the documentation for your device and version of Android.
e.	Other hardware devices especially IoT. Contact the device manufacturer. 

4.	You have an environment where firewall rules are set to allow outbound calls to only specific Certificate Revocation List (CRL) download and/or Online Certificate Status Protocol (OCSP) verification locations. You will need to allow the following CRL and OCSP URLs:
a.	http://crl3.digicert.com
b.	http://crl4.digicert.com
c.	http://ocsp.digicert.com
d.	http://www.d-trust.net
e.	http:// root-c3-ca2-2009.ocsp.d-trust.net
f.	http://crl.microsoft.com
g.	http://oneocsp.microsoft.com
h.	http://ocsp.msocsp.com

If you have any questions, please contact us through support. 

# Key Vault soft-delete on by default
 
