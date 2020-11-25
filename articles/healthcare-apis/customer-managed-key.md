---
title: Configure customer-managed keys for Azure API for FHIR
description: Bring your own key feature supported in Azure API for FHIR through Cosmos DB
services: healthcare-apis
author: matjazl
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: overview
ms.date: 09/28/2020
ms.author: matjazl
---

# Configure customer-managed keys

When you create a new Azure API for FHIR account, your data is encrypted using Microsoft-managed keys by default. Now, you can add a second layer of encryption for the data using your own key that you choose and manage yourself.

In Azure, this is typically accomplished using an encryption key in the customer's Azure Key Vault (AKV). Azure SQL, Azure Storage, and Cosmos DB are some examples that provide this capability today. Azure API for FHIR leverages this support from Cosmos DB. When you create an account, you will have the option to specify an AKV key URI. We will pass this key to Cosmos DB when the DB account is provisioned. When a FHIR request is made, Cosmos DB fetches your key and uses it to encrypt/decrypt the data. To get started, you can refer to the following links:

- [Register the Azure Cosmos DB resource provider for your Azure subscription](../cosmos-db/how-to-setup-cmk.md#register-resource-provider) 
- [Configure your AKV instance](../cosmos-db/how-to-setup-cmk.md#configure-your-azure-key-vault-instance)
-  [Add an access policy to your AKV instance](../cosmos-db/how-to-setup-cmk.md#add-an-access-policy-to-your-azure-key-vault-instance)
- [Generate a key in AKV](../cosmos-db/how-to-setup-cmk.md#generate-a-key-in-azure-key-vault)

After creating your Azure API for FHIR account on Azure portal, you can see a "Data Encryption" configuration option under the "Database Settings" on the "Additional Settings" tab. By default, the service-managed key option will be chosen. You can specify your AKV key here by selecting "Customer-managed key" option. You can enter the copied key URI here.

:::image type="content" source="media/bring-your-own-key/bring-your-own-key-create.png" alt-text="Create Azure API for FHIR":::

Or, you can choose your key from the KeyPicker:

:::image type="content" source="media/bring-your-own-key/bring-your-own-key-keypicker.png" alt-text="KeyPicker":::

For existing FHIR accounts, you can view the key encryption choice (service- or customer-managed key) in "Database" blade as below. The configuration option can't be modified once chosen. However, you can modify and update your key.

:::image type="content" source="media/bring-your-own-key/bring-your-own-key-database.png" alt-text="Database":::

In addition, you can create a new version of the specified key, after which your data will get encrypted with the new version without any service interruption. You can also remove access to the key to remove access to the data.