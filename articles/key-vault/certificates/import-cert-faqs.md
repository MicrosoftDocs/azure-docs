---
title: Frequently asked questions - Azure Key Vault certificate import
description: Frequently asked questions - Azure Key Vault certificate import
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

# Frequently asked questions - Azure Key Vault Certificate import

## Frequently asked questions

### How can I import a certificate in Azure Key Vault?

Import certificate – For import operation, Azure key vault accepts two certificate formats PEM and PFX. Although there are PEM files with only the public portion, Azure key vault requires and only accepts a PEM or PFX on file folder and with a private key. Follow [tutorial to import certificate](https://docs.microsoft.com/azure/key-vault/certificates/tutorial-import-certificate#import-a-certificate-to-key-vault)

### After importing password protected certificate into the key vault and then downloading it, I am not able to see the password associated with the certificate?
 	
The uploaded protected certificate after storage into key vault would not save password associated with it. It is only required once during the import operation. Although this is a by-design concept, you can always get the certificate as a secret and convert from Base64 to PFX adding the previous password through [Azure PowerShell](https://social.technet.microsoft.com/wiki/contents/articles/37431.exporting-azure-app-service-certificates.aspx).

### How can I resolve 'Bad parameter error'? What are the supported certificate formats for importing in Key vault?

When you are importing the certificate, you need to ensure that the key is included in the file itself. If you have the private key separately in a different format, you would need to combine the key with the certificate. Some certificate authorities provide certificates in different formats, therefore before importing the certificate, make sure that they are either in .pem or .pfx format and that the key used is either RSA or ECC. Refer these for reviewing [certificate requirements](https://docs.microsoft.com/azure/key-vault/certificates/certificate-scenarios#formats-of-import-we-support) and [certificate key requirements](https://docs.microsoft.com/azure/key-vault/keys/about-keys#cryptographic-protection).

### Error when importing certificate via Portal "Something went wrong". How can I investigate further?
 	
To view more descriptive error, import the certificate file via [Azure CLI](https://docs.microsoft.com/cli/azure/keyvault/certificate?view=azure-cli-latest#az-keyvault-certificate-import) or [PowerShell](https://docs.microsoft.com/powershell/module/azurerm.keyvault/import-azurekeyvaultcertificate?view=azurermps-6.13.0).

### How can I resolve 'Error type: Access denied or user is unauthorized to import certificate'?
	
This operation requires the certificates/import permission. Navigate to where the Key Vault is located, you will need to grant the user appropriate permissions under access policies. Navigate to the Key Vault> Access policies > Add Access Policy > Select Certificate Permissions (or as you want the permissions) > Principal > search for and then add user's email. [Read more about certificate related access policies](https://docs.microsoft.com/azure/key-vault/certificates/about-certificates#certificate-access-control)


### How can I resolve 'Error type: Conflict when creating a certificate'?
	
Certificate name should be unique. Certificate with the same name might be in soft-deleted state, also, as per the [composition of a certificate](https://docs.microsoft.com/azure/key-vault/certificates/about-certificates#composition-of-a-certificate) in Azure key vault, if there is another Key or Secret in the Key Vault with the same name you are trying to specify for your certificate, it will fail and you will need to either remove that key or secret or use a different name for your certificate. [view deleted certificate](https://docs.microsoft.com/rest/api/keyvault/getdeletedcertificate/getdeletedcertificate)

### Why am I getting the 'Error type: char length is too long'?
	
* Certificate Subject name length has a character limit of 200 char
* Certificate password length has a character limit of 200 char

### Can I import an expired certificate in Azure Key vault?
	
No, the expired PFX certificates won't get imported to Azure Key Vault.

### How can I convert my certificate to proper format?

You can ask to your Certificate Authority to provide the certificate in the needed format, also there are third party tools that can help you to convert to the proper format, however, Microsoft will not be able to advise further on how to get the certificate in the desired format.

### Can I import certificates from non-partner CAs?
Yes, you can import certificates from any CA but key vault will not be able to automatically renew those certificates. You would be able to set email notifications to get notified about the certificate expiry.

### If I import a certificate from a partner CA, will the auto renew feature still work?
Yes, you need to make sure that once uploaded you specify the autorotation in the certificate’s issuance policy. Also, the changes will be reflected until the next cycle or certificate version.


## Next steps

- [Azure Key Vault Certificates](/azure/key-vault/certificates/about-certificates)
