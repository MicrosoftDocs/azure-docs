---
title: Frequently asked questions - Azure Key Vault Certificate import
description: Frequently asked questions - Azure Key Vault Certificate import
services: key-vault
author: msmbaldwin
manager: rkarlin
tags: azure-resource-manager

ms.service: key-vault
ms.subservice: certificates
ms.topic: conceptual
ms.date: 07/09/2020
ms.author: sebansal
---

# Frequently asked questions - Azure Key Vault Certificate import

## Frequently Asked Questions

### How can I import a certificate in Azure Key Vault?

Import certificate – requires a PEM or PFX to be on disk and have a private key. Follow [tutorial to import certificate](https://docs.microsoft.com/azure/key-vault/certificates/tutorial-import-certificate#import-a-certificate-to-key-vault)

### After importing password protected certificate into the key vault and then downloading it, I am not able to see the password associated with the certificate?
 	
The uploaded protected certificate after storage into key vault would not save password associated with it. It is only required once during the import operation.

### How can I resolve 'Bad parameter error'? What are the supported certificate formats for importing in Key vault?

When you are importing the certificate, you need to ensure that the key is included in the file itself. If you have the private key separately in a different format, you would need to combine the key with the certificate. Some certificate authorities provide certificates in different formats, therefore before importing the certificate, make sure that they are either in .pem or .pfx format. [Read more](https://docs.microsoft.com/azure/key-vault/certificates/certificate-scenarios#formats-of-import-we-support) 

### Error when importing certificate via Portal "Something went wrong". How can I investigate further?
 	
To view more descriptive error, import the certificate file via [Azure CLI](https://docs.microsoft.com/cli/azure/keyvault/certificate?view=azure-cli-latest#az-keyvault-certificate-import) or [PowerShell](https://docs.microsoft.com/powershell/module/azurerm.keyvault/import-azurekeyvaultcertificate?view=azurermps-6.13.0).

### How can I resolve 'Error type: Access denied or user is unauthorized to import certificate'?
	
This operation requires the certificates/import permission. Navigate to where the Key Vault is located, you will need to grant the user appropriate permissions under access policies. Navigate to the KeyVault> Access policies > Add Access Policy > Select Certificate Permissions (or as you want the permissions) > Principal > search for and then add user's email. [Read more about certificate related access policies](https://docs.microsoft.com/azure/key-vault/certificates/about-certificates#certificate-access-control)


### How can I resolve 'Error type : Conflict when creating a certificate'?
	
Certificate name should be unique. Certificate with the same name might be in soft-deleted state, [view deleted certificate](https://docs.microsoft.com/rest/api/keyvault/getdeletedcertificate/getdeletedcertificate)

### Can I import an expired certificate in Azure Key vault?
	
No, the expired PFX certificates won't get imported to Azure Key Vault.


## Next steps

- [Azure Key Vault Certificates](/azure/key-vault/certificates/about-certificates)