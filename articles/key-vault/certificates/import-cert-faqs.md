---
title: Frequently asked questions - Azure Key Vault certificate import
description: Get answers to frequently asked questions about importing Azure Key Vault certificates.
services: key-vault
author: msmbaldwin
tags: azure-resource-manager

ms.service: key-vault
ms.subservice: certificates
ms.topic: how-to
ms.date: 07/20/2020
ms.author: sebansal
---

# Importing Azure Key Vault certificates FAQ

This article answers frequently asked questions about importing Azure Key Vault certificates.

## Frequently asked questions

### How can I import a certificate in Azure Key Vault?

For a certificate import operation, Azure Key Vault accepts two certificate file formats: PEM and PFX. Although there are PEM files with only the public portion, Key Vault requires and accepts only a PEM or PFX file with a private key. For more information, see [Import a certificate to Key Vault](./tutorial-import-certificate.md#import-a-certificate-to-key-vault).

### After I import a password-protected certificate to Key Vault and then download it, why can't I see the password that's associated with it?
     
After a certificate is imported and protected in Key Vault, its associated password isn't saved. The password is required only once during the import operation. This is by design, but you can always get the certificate as a secret and convert it from Base64 to PFX by adding the password through [Azure PowerShell](https://social.technet.microsoft.com/wiki/contents/articles/37431.exporting-azure-app-service-certificates.aspx).

### How can I resolve a "Bad parameter" error? What are the supported certificate formats for importing to Key Vault?

When you import a certificate, you need to ensure that the key is included in the file. If you have a private key stored separately in a different format, you need to combine the key with the certificate. Some certificate authorities (CAs) provide certificates in other formats. Therefore, before you import the certificate, make sure that it's in either PEM or PFX file format and that the key uses either Rivest–Shamir–Adleman (RSA) or elliptic-curve cryptography (ECC) encryption. 

For more information, see [certificate requirements](./certificate-scenarios.md#formats-of-import-we-support) and [certificate key requirements](../keys/about-keys.md).

###  Can I import a certificate by using an ARM template?

No, it isn't possible to perform certificate operations by using an Azure Resource Manager (ARM) template. A recommended workaround would be to use the certificate import methods in the Azure API, the Azure CLI, or PowerShell. If you have an existing certificate, you can import it as a secret.

### When I import a certificate via the Azure portal, I get a "Something went wrong" error. How can I investigate further?
     
To view a more descriptive error, import the certificate file by using [the Azure CLI](/cli/azure/keyvault/certificate#az-keyvault-certificate-import) or [PowerShell](/powershell/module/azurerm.keyvault/import-azurekeyvaultcertificate).

### How can I resolve "Error type: Access denied or user is unauthorized to import certificate"?
    
The import operation requires that you grant the user permissions to import the certificate under the access policies. To do so, go to your key vault, select **Access policies** > **Add Access Policy** > **Select Certificate Permissions** > **Principal**, search for the user, and then add the user's email address. 

For more information about certificate-related access policies, see [About Azure Key Vault certificates](./about-certificates.md#certificate-access-control).


### How can I resolve "Error type: Conflict when creating a certificate"?
    
Each certificate name must be unique. A certificate with the same name might be in a soft-deleted state. Also, according to the [composition of a certificate](./about-certificates.md#composition-of-a-certificate), when new certificate is created, it creates an addressable secret with the same name so if there's another key or secret in the key vault with the same name as the one you're trying to specify for your certificate, the certificate creation will fail and you'll need to either remove that key or secret or use a different name for your certificate. 

For more information, see [Get Deleted Certificate operation](/rest/api/keyvault/getdeletedcertificate/getdeletedcertificate).

### Why am I getting "Error type: char length is too long"?
This error could be caused by either of two reasons:    
* The certificate subject name is limited to 200 characters.
* The certificate password is limited to 200 characters.


### Error "The specified PEM X.509 certificate content is in an unexpected format. Please check if certificate is in valid PEM format."
Please verify that the content in the PEM file is uses UNIX-style line separators `(\n)`

### Can I import an expired certificate to Azure Key Vault?
    
No, expired PFX certificates can't be imported to Key Vault.

### How can I convert my certificate to the proper format?

You can ask your CA to provide the certificate in the required format. There are also third-party tools that can help you convert the certificate to the proper format.

### Can I import certificates from non-partner CAs?
Yes, you can import certificates from any CA, but your key vault won't be able to renew them automatically. You can set reminders to be notified about the certificate expiration.

### If I import a certificate from a partner CA, will the autorenewal feature still work?
Yes. After you've uploaded the certificate, be sure to specify the autorotation in the certificate's issuance policy. Your settings will remain in effect until the next cycle or certificate version is released.

### Why can't I see the App Service certificate that I imported to Key Vault? 
If you've imported the certificate successfully, you should be able to confirm it by going to the **Secrets** pane.


## Next steps

- [Azure Key Vault certificates](./about-certificates.md)
