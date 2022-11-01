---
title: Batch Certificate Migration Guide
description: Describes the migration steps for the batch certificates and the end of support details.
author: harperche
ms.author: harpercheng
ms.service: batch
ms.topic: how-to #Required; leave this attribute/value as-is.
ms.date: 08/15/2022
---
# Batch Certificate Migration Guide

Securing the application and critical information has become essential in today's needs. With growing customers and increasing demand for security, managing key information plays a significant role in securing data. Many customers need to store secure data in the application, and it needs to be managed to avoid any leakage. In addition, only legitimate administrators or authorized users should access it. Azure Batch offers Certificates created and managed by the Batch service. Azure Batch also provides a Key Vault option, and it's considered an azure-standard method for delivering more controlled secure access management.

Azure Batch provides certificates feature at the account level. Customers must generate the Certificate and upload it manually to the Azure Batch via the portal. To access the Certificate, it must be associated and installed for the 'Current User.' The Certificate is usually valid for one year and must follow a similar procedure every year.

For Azure Batch customers, a secure way of access should be provided in a more standardized way, reducing any manual interruption and reducing the readability of key generated. Therefore, we'll retire the certificate feature on **29 February 2024** to reduce the maintenance effort and better guide customers to use Azure Key Vault as a standard and more modern method with advanced security. After it's retired, the Certificate functionality may cease working properly. Additionally, pool creation with certificates will be rejected and possibly resize up.

## Retirement alternatives

Azure Key Vault is the service provided by Microsoft Azure to store and manage secrets, certificates, tokens, keys, and other configuration values that authenticated users access the applications and services. The original idea was to remove the hard-coded storing of these secrets and keys in the application code.

Azure Key Vault provides security at the transport layer by ensuring any data flow from the key vault to the client application is encrypted. Azure key vault stores the secrets and keys with such strong encryption that even Microsoft itself won't see the keys or secrets in any way.

Azure Key Vault provides a secure way to store the information and define the fine-grained access control. All the secrets can be managed from one dashboard. Azure Key Vault can store the key in the software-protected or hardware protected by hardware security module (HSMs) mechanism. In addition, it has a mechanism to auto-renew the Key Vault certificates.

## Migration steps

Azure Key Vault can be created in three ways:

1. Using Azure portal

2. Using PowerShell

3. Using CLI

**Create Azure Key Vault step by step procedure using Azure portal:**

__Prerequisite__: Valid Azure subscription and owner/contributor access on Key Vault service.

   1. Log in to the Azure portal.

   2. In the top-level search box, look for **Key Vaults**.

   3. In the Key Vault dashboard, click on create and provide all the details like subscription, resource group, Key Vault name, select the pricing tier (standard/premium), and select region. Once all these details are provided, click on review, and create. This will create the Key Vault account.

   4. Key Vault names need to be unique across the globe. Once any user has taken a name, it won’t be available for other users.

   5. Now go to the newly created Azure Key Vault. There you can see the vault name and the vault URI used to access the vault.

**Create Azure Key Vault step by step using the Azure PowerShell:**

   1. Log in to the user PowerShell using the following command - Login-AzAccount

   2. Create an 'azure secure' resource group in the 'eastus' location. You can change the name and location as per your need.
``` 
  New-AzResourceGroup -Name "azuresecure" -Location "EastUS"
```
   3. Create the Azure Key Vault using the cmdlet. You need to provide the key vault name, resource group, and location.
```
  New-AzKeyVault -Name "azuresecureKeyVault" -ResourceGroupName "azuresecure" -Location "East US"
``` 

   4. Created the Azure Key Vault successfully using the PowerShell cmdlet.

**Create Azure Key Vault step by step using the Azure CLI bash:**

   1. Create an 'azure secure' resource in the 'eastus' location. You can change the name and location as per your need. Use the following bash command.
``` 
  az group create –name "azuresecure" -l "EastUS."
``` 

   2. Create the Azure Key Vault using the bash command. You need to provide the key vault name, resource group, and location.
``` 
  az keyvault create –name “azuresecureKeyVault” –resource-group “azure” –location “EastUS”
```
   3. Successfully created the Azure Key Vault using the Azure CLI bash command.

## FAQ

   1. Is Certificates or Azure Key Vault recommended?  
   Azure Key Vault is recommended and essential to protect the data in the cloud.

   2. Does user subscription mode support Azure Key Vault?   
   Yes, it's mandatory to create Key Vault while creating the Batch account in user subscription mode.

   3. Are there best practices to use Azure Key Vault?   
   Best practices are covered [here](../key-vault/general/best-practices.md).

## Next steps

For more information, see [Certificate Access Control](../key-vault/certificates/certificate-access-control.md).
