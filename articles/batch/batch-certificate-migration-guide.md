---
author: harpercheng
ms.author: harperche
ms.date: 08/15/2022
---
### Executive Summary

Securing the application and critical information has become essential in today's needs. With growing customers and increasing demand for security, managing key information plays a significant role in securing data. Many customers need to store secure data in the application, and it needs to be managed to avoid any leakage. In addition, only legitimate administrators or authorized users should access it. Azure Batch offers Certificates created and managed by the Batch service. Azure Batch also provides a key vault option, and it is considered an azure-standard method for delivering more controlled secure access management.

Azure Batch provides certificates feature at the account level. Customers must generate the Certificate and upload it manually to the Azure Batch via the portal. To access the Certificate, it must be associated and installed for the 'Current User.' The Certificate is usually valid for one year and must follow a similar procedure every year.

For Azure Batch customers, a secure way of access should be provided in a more standardized way, reducing any manual interruption and reducing the readability of key generated. Therefore, we will retire the certificate feature on **29 February 2024** to reduce the maintenance effort and better guide customers to use Azure Key Vault as a standard and more modern method with advanced security. After it is retired, the Certificate functionality may cease working properly. Additionally, pool creation with certificates will be rejected and possibly resize up.

### Retirement Alternatives

Azure Key Vault is the service provided by Microsoft Azure to store and manage secrets, certificates, tokens, keys, and other configuration values that authenticated users access the applications and services. The original idea was to remove the hard-coded storing of these secrets and keys in the application code.

Azure key vault provides security at the transport layer by ensuring any data flow from the key vault to the client application is encrypted. Azure key vault stores the secrets and keys with such strong encryption that even Microsoft itself won't see the keys or secrets in any way.

Azure key vault provides a secure way to store the information and define the fine-grained access control. All the secrets can be managed from one dashboard. Azure key vault can store the key in the software-protected or hardware protected by hardware security module (HSMs) mechanism. In addition, it has a mechanism to auto-renew the key vault certificates.

### Migration Steps

Azure key vault can be created in three ways:

1. Using Azure portal

2. Using PowerShell

3. Using CLI

***Create Azure key vault step by step procedure using Azure portal:***

__Prerequisite__: Valid Azure subscription and owner/contributor access on key vault service.

   1. Login to Azure portal.

   2. In the top-level search box, look for \“Key vaults.\”

   3. In the key vault dashboard, click on create and provide all the details like subscription, resource group, key vault name, select the pricing tier (standard/premium), and select region. Once all these details are provided, click on review, and create. This will create the key vault account.

   4. Key vault names need to be unique across the globe. Once any user has taken a name, it won’t be available for other users.

   5. Now go to the newly created Azure key vault. There you can see the vault name and the vault URI used to access the vault.

***Create Azure Key Vault step by step using the azure PowerShell:***

   1. Login to the user PowerShell using the following command - Login-AzAccount

   2. Create a 'azuresecure' resource group in the 'eastus' location. You can change the name and location as per your need.
``` 
    New-AzResourceGroup -Name "azuresecure" -Location "EastUS"
```
   3. Create the azure key vault using the cmdlet. You need to provide the key vault name, resource group, and location.
```
     New-AzKeyVault -Name "azuresecureKeyVault" -ResourceGroupName "azuresecure" -Location "East US"
``` 

   4. Created the azure key vault successfully using the PowerShell cmdlet.

***Create Azure Key Vault step by step using the azure CLI bash:***

   1. Create an 'azuresecure' resource in the 'eastus' location. You can change the name and location as per your need. Use the following bash command.

``` 
az group create –name "azuresecure" -l "EastUS."
``` 

   2. Create the azure key vault using the bash command. You need to provide the key vault name, resource group, and location.
``` 
az keyvault create –name “azuresecureKeyVault” –resource-group “azure” –location “EastUS”
```
   3. Successfully created the azure key vault using the CLI bash command.

### FAQ

   1. Is Certificates or Azure Key Vault recommended?  
   Azure Key Vault is recommended and essential to protect the data in the cloud.

   2. Does user subscription mode support Azure Key Vault?   
   Yes, it is mandatory to create Key Vault while creating the Batch account in user subscription mode.

   3. Are there best practices to use Azure Key Vault?   
   Best practices are covered [here](https://docs.microsoft.com/en-us/azure/key-vault/general/best-practices).

