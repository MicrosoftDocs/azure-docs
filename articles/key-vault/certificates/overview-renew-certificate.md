---
title: About Azure Key Vault certificate renewal
description: About Azure Key Vault certificate renewal
services: key-vault
author: msmbaldwin
manager: rkarlin
tags: azure-resource-manager

ms.service: key-vault
ms.subservice: certificates
ms.topic: conceptual
ms.date: 07/20/2020
ms.author: sebansal
---

# About Azure Key Vault certificate renewal

Azure Key Vault allows you to easily provision, manage, and deploy digital certificates for your network and to enable secure communications for applications. For more general information about Certificates, see [Azure Key Vault Certificates](https://docs.microsoft.com/azure/key-vault/certificates/about-certificates)

Having short lived certificate or increasing the frequency of certificate rotation limits the adversary’s scope for damage.

There three categories of certificate creation in key vault. This guide will help you to understand how renewal of certificates can be achieved.
-	Certificates created with integrated CA (DigiCert or GlobalSign)
-	Certificates created with non-integrated CA
-	Self-signed certificates

## Renewal of integrated CA certificate 
Good news! Azure Key Vaults takes care of end-to-end maintenance of certificates that are issued by Microsoft trusted CAs i.e. DigiCert and GlobalSign. Learn how to [integrate a trusted CA with key vault](https://docs.microsoft.com/azure/key-vault/certificates/how-to-integrate-certificate-authority).

## Renewal of non-integrated CA certificate 
Azure key vault provides its users with the benefit of importing certificates from any CA to allow its users to integrate with several Azure resources and make deployment easy. If you are worried about losing the track of your certificate getting expired, or worse discovered that your certificate has already expired; then Key Vault can help you in staying up to date. For non-integrated CA certificate, key vault allows its user to set up near expiry email notifications. Those notifications can be set for multiple users as well.

Now, to renew a certificate, it is important to understand that an Azure Key Vault certificate is a versioned object. If the current version is expiring, you would need to create a new version. Conceptually, each new version would be altogether a new certificate composed of key and a blob which ties that key to an identity. When you use a non-partnered CA, key vault will generate a key value pair and return the CSR.

**Steps to follow in Azure portal:-**
1.	Open the certificate you want to renew.
2.	Select **+ New Version** button on the Certificate screen.
3.	Select **Certificate Operation**
4.	Select **Download CSR**. This will download a .csr file on your local drive.
5.	Bring CSR to your choice of CA to sign the request
6.	Bring back the signed request and select **Merge CSR** on the same Certificate Operation screen.

> [!NOTE]
> It is important to merge the signed CSR with same CSR request that was created, otherwise the key would not match.

Steps are similar to creating a new certificate and are documented more in details [here]( https://docs.microsoft.com/azure/key-vault/certificates/create-certificate-signing-request#azure-portal).

## Renewal of self-signed certificate

Good news again! Azure Key Vaults will also take care of auto-renewal of self-signed certificates for its users. To learn more about changing the Issuance policy and updating certificate's lifetime Action attributes, read more [here](https://docs.microsoft.com/azure/key-vault/certificates/tutorial-rotate-certificates#update-lifecycle-attributes-of-a-stored-certificate).

### Troubleshoot
If the certificate issued is in 'disabled' status in the Azure portal, proceed to view the Certificate Operation to view the error message for that certificate.

### See Also
*	[Integrating Key Vault with DigiCert Certificate Authority](how-to-integrate-certificate-authority.md)
*	[Tutorial: Configure certificate auto-rotation in Key Vault](tutorial-rotate-certificates.md)