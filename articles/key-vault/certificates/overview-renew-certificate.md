---
title: About Azure Key Vault certificate renewal
description: This article discusses how to renew Azure Key Vault certificates.
services: key-vault
author: msmbaldwin
tags: azure-resource-manager

ms.service: key-vault
ms.subservice: certificates
ms.topic: overview
ms.date: 07/20/2020
ms.author: sebansal
---

# Renew your Azure Key Vault certificates

With Azure Key Vault, you can easily provision, manage, and deploy digital certificates for your network and enable secure communications for your applications. For more information about certificates, see [About Azure Key Vault certificates](./about-certificates.md).

By using short-lived certificates or by increasing the frequency of certificate rotation, you can help prevent access to your applications by unauthorized users.

This article discusses how to renew your Azure Key Vault certificates.

## Get notified about certificate expiration
To get notified about certificate life events, you would need to add certificate contact. Certificate contacts contain contact information to send notifications triggered by certificate lifetime events. The contacts information is shared by all the certificates in the key vault. A notification is sent to all the specified contacts for an event for any certificate in the key vault.

### Steps to set certificate notifications:
First, add a certificate contact to your key vault. You can add using Azure portal or PowerShell cmdlet [`Add-AzureKeyVaultCertificateContact`](/powershell/module/azurerm.keyvault/add-azurekeyvaultcertificatecontact).

Second, configure when you want to be notified about the certificate expiration. To configure the lifecycle attributes of the certificate, see [Configure certificate autorotation in Key Vault](./tutorial-rotate-certificates.md#update-lifecycle-attributes-of-a-stored-certificate).

If a certificate's policy is set to auto renewal, then a notification is sent on the following events.

- Before certificate renewal
- After certificate renewal, stating if the certificate was successfully renewed, or if there was an error, requiring manual renewal of the certificate.  

  When a certificate policy that is set to be manually renewed (email only), a notification is sent when it's time to renew the certificate.  

In Key Vault, there are three categories of certificates:
-    Certificates that are created with an integrated certificate authority (CA), such as DigiCert or GlobalSign
-    Certificates that are created with a nonintegrated CA
-    Self-signed certificates

## Renew an integrated CA certificate 
Azure Key Vault handles the end-to-end maintenance of certificates that are issued by trusted Microsoft certificate authorities DigiCert and GlobalSign. Learn how to [integrate a trusted CA with Key Vault](./how-to-integrate-certificate-authority.md).

## Renew a nonintegrated CA certificate 
By using Azure Key Vault, you can import certificates from any CA, a benefit that lets you integrate with several Azure resources and make deployment easy. If you're worried about losing track of your certificate expiration dates or, worse, you've discovered that a certificate has already expired, your key vault can help keep you up to date. For nonintegrated CA certificates, the key vault lets you set up near-expiration email notifications. Such notifications can be set for multiple users as well.

> [!IMPORTANT]
> A certificate is a versioned object. If the current version is expiring, you need to create a new version. Conceptually, each new version is a new certificate that's composed of a key and a blob that ties that key to an identity. When you use a nonpartnered CA, the key vault generates a key/value pair and returns a certificate signing request (CSR).

To renew a nonintegrated CA certificate, do the following:

1. Sign in to the Azure portal, and then open the certificate you want to renew.
1. On the certificate pane, select **New Version**.
1. Select **Certificate Operation**.
1. Select **Download CSR** to download a CSR file to your local drive.
1. Send the CSR to your choice of CA to sign the request.
1. Bring back the signed request, and select **Merge CSR** on the same certificate operation pane.

> [!NOTE]
> It's important to merge the signed CSR with the same CSR request that you created. Otherwise, the key won't match.

For more information about creating a new CSR, see [Create and merge a CSR in Key Vault]( https://docs.microsoft.com/azure/key-vault/certificates/create-certificate-signing-request#azure-portal).

## Renew a self-signed certificate

Azure Key Vault also handles autorenewal of self-signed certificates. To learn more about changing the issuance policy and updating a certificate's lifecycle attributes, see [Configure certificate autorotation in Key Vault](./tutorial-rotate-certificates.md#update-lifecycle-attributes-of-a-stored-certificate).

## Troubleshoot
* If the issued certificate is in *disabled* status in the Azure portal, go to **Certificate Operation** to view the certificate's error message.
* Error type "The CSR used to get your certificate has already been used. Please try to generate a new certificate with a new CSR."
  Go to 'Advanced Policy' section of the certificate and check if **'reuse key on renewal'** option is turned off.


## Frequently asked questions

**How can I test the autorotation feature of the certificate?**

Create a self-signed certificate with a validity of **1 month**, and then set the lifetime action for rotation at **1%**. You should be able to view certificate version history being created over next few days.
  
**Will the tags be replicated after autorenewal of the certificate?**

Yes, the tags are replicated after autorenewal.

## Next steps
*    [Integrate Key Vault with DigiCert certificate authority](how-to-integrate-certificate-authority.md)
*    [Tutorial: Configure certificate autorotation in Key Vault](tutorial-rotate-certificates.md)
