---
title: Microsoft Energy Data Services - Data Security and Encryption in Microsoft Energy Data Services #Required; page title is displayed in search results. Include the brand.
description: Guide on security in Microsoft Energy Data Services and how to set up customer managed keys on Microsoft Energy Data Services #Required; article description that is displayed in search results. 
author: sandeepchads #Required; your GitHub user alias, with correct capitalization.
ms.author: sancha #Required; microsoft alias of author; optional team alias.
ms.service: azure #Required; service per approved list. slug assigned by ACOM.
ms.topic: how-to #Required; leave this attribute/value as-is.
ms.date: 09/29/2022
ms.custom: template-concept #Required; leave this attribute/value as-is.

#Customer intent: As a developer, I want to set up customer-managed keys on Microsoft Energy Data Services
---
# Data Security and Encryption in Microsoft Energy Data Services

This article provides an overview of security features in Microsoft Energy Data Services. It covers the major areas of [encryption at rest](https://learn.microsoft.com/azure/security/fundamentals/encryption-atrest), encryption in transit, TLS, https, microsoft-managed keys, and customer managed key. 

## Encrypt data at rest

Microsoft Energy Data Services uses several storage resources for storing metadata, user data, in-memory data etc. The platform uses service-side encryption to automatically encrypt all the data when it is persisted to the cloud. Data encryption at rest protects your data to help you to meet your organizational security and compliance commitments. All data in Microsoft Energy Data Services is encrypted with Microsoft-managed keys by default.
In addition to Microsoft-managed key, you can use your own encryption key to protect the data in Microsoft Energy Data Services Preview. When you specify a customer-managed key, that key is used to protect and control access to the Microsoft-managed key that encrypts your data. 

## Encrypt data in transit

Microsoft Energy Data Services supports Transport Layer Security (TLS 1.2) protocol to protect data when it’s traveling between the cloud services and customers. TLS provides strong authentication, message privacy, and integrity (enabling detection of message tampering, interception, and forgery), interoperability, and algorithm flexibility.

In addition to TLS, when you interact with Microsoft Energy Data Services, all transactions take place over HTTPS. 

## Set up Customer Managed Keys (CMK) for Microsoft Energy Data Services Preview instance

### Pre-requisites

**Step 1- Configure the key vault**

1.	You can use a new or existing key vault to store customer-managed keys. To learn more about Azure Key Vault, see [Azure Key Vault Overview](https://learn.microsoft.com/azure/key-vault/general/overview) and [What is Azure Key Vault](https://learn.microsoft.com/azure/key-vault/general/basic-concepts)?.
2.	Using customer-managed keys with Microsoft Energy Data Services requires that both soft delete and purge protection be enabled for the key vault. Soft delete is enabled by default when you create a new key vault and cannot be disabled. You can enable purge protection either when you create the key vault or after it is created.
3.	To learn how to create a key vault with the Azure portal, see [Quickstart: Create a key vault using the Azure portal](https://learn.microsoft.com/azure/key-vault/general/quick-create-portal). When you create the key vault, select Enable purge protection.

 
4.	To enable purge protection on an existing key vault, follow these steps:
*	Navigate to your key vault in the Azure portal.
*	Under Settings, choose Properties.
*	In the Purge protection section, choose Enable purge protection.

**Step 2 - Add a key**
1.	Next, add a key to the key vault.
2.	To learn how to add a key with the Azure portal, see [Quickstart: Set and retrieve a key from Azure Key Vault using the Azure portal](https://learn.microsoft.com/azure/key-vault/keys/quick-create-portal).
3.	It is recommended that the RSA key size is 3072, see [Configure customer-managed keys for your Azure Cosmos DB account | Microsoft Learn](https://learn.microsoft.com/azure/cosmos-db/how-to-setup-customer-managed-keys#generate-a-key-in-azure-key-vault).

**Step 3 - Choose a managed identity to authorize access to the key vault**
1.	When you enable customer-managed keys for an existing Microsoft Energy Data Services Preview instance you must specify a managed identity that will be used to authorize access to the key vault that contains the key. The managed identity must have permissions to access the key in the key vault.
2.	You can create a [user-assigned managed identity](https://learn.microsoft.com/azure/active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities?pivots=identity-mi-methods-azp#create-a-user-assigned-managed-identity).

### Configure customer-managed keys for an existing account
1.	Create a **Microsoft Energy Data Services** instance.
2.	Select the **Encryption** tab.
 
3.	In the encryption tab, select **Customer-managed keys (CMK)**. 
4.	For using CMK, you need to select the key vault where the key is stored. 
5.	Select Encryption key as “**Select a key vault and key**.” 
6.	Then, select “**Select a key vault and key**.”
7.	Next, select the **key vault** and **key**.
8.	Next, select the user-assigned managed identity that will be used to authorize access to the key vault that contains the key. 
9.	Select “**Select a user identity**.” Select the user-assigned managed identity that you created in the pre-requisites. 
 
10.	This user assigned identity must have _get key_, _list key_, _wrap key_, and _unwrap key_ permissions on the key vault. For more information on assigning Azure Key Vault access policies, see [Assign a Key Vault Access Policy](https://learn.microsoft.com/azure/key-vault/general/assign-access-policy?tabs=azure-portal). 
 
11.	You can also select Encryption Key as “**Enter key from Uri**.” It is mandatory for the Key to have soft delete and purge protection to be enabled. You will have to confirm that by checking the box shown below.
 
12.	Next, select “**Review+Create**” after completing other tabs. 
13.	Select the "**Create**" button. 
14.	A Microsoft Energy Data Services instance is created with customer-managed keys.
15.	Once CMK is enabled you will see its status on the **Overview** screen.
 
16.	You can navigate to **Encryption **and see that CMK enabled with user managed identity.
 

> NOTE: You cannot edit CMK settings once the Microsoft Energy Data Services instance is created.

