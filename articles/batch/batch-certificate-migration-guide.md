---
title: Migrate Batch certificates to Azure Key Vault
description: Learn how to migrate access management from using certificates in Azure Batch to Azure Key Vault and plan for feature end of support.
author: harperche
ms.author: harpercheng
ms.service: batch
ms.topic: how-to
ms.date: 08/15/2022
---

# Migrate Batch certificates to Azure Key Vault

On *February 29, 2024*, the certificates feature for Azure Batch access management will be retired. Learn how to migrate your access management approach from using certificates in Azure Batch to using Azure Key Vault.

## About the feature

Often, you need to store secure data for an application. Your data must be securely managed so that only administrators or authorized users can access it.

Currently, Azure Batch offers two ways to secure access. You can use a certificate that you create and manage in Azure Batch or you can use Azure Key Vault to store an access key. Using a key vault is an Azure-standard way to deliver more controlled secure access management.

You can use a certificate at the account level in Azure Batch. You must generate the certificate and upload it manually to Batch by using the Azure portal. To access the certificate, the certificate must be associated with and installed for only the current user. A certificate typically is valid for one year, and it must be updated each year.

## Feature end of support

To move toward a simpler, standardized way to secure access to your Batch resources, on February 29, 2024, we'll retire the certificates feature in Azure Batch. We recommend that you use Azure Key Vault as a standard and more modern method to secure your resources in Batch.

In Key Vault, you get these benefits:

- Reduced manual maintenance and streamlined maintenance overall
- Reduced access to and readability of the key that's generated
- Advanced security

After the certificates feature in Azure Batch is retired on February 29, 2024, a certificate in Batch might not work as expected. After that date, you won't be able to create a pool by using a certificate. Pools that continue to use certificates after the feature is retired might increase in size and cost.

## Alternative: Use Key Vault

Azure Key Vault is an Azure service you can use to store and manage secrets, certificates, tokens, keys, and other configuration values that give authenticated users access to secure applications and services. Key Vault is based on the idea that security is improved and standardized when you remove hard-coded secrets and keys from application code that's deployed.

Key Vault provides security at the transport layer by ensuring that any data flow from the key vault to the client application is encrypted. Azure Key Vault stores secrets and keys with such strong encryption that even Microsoft can't read key vault-protected keys and secrets.

Azure Key Vault gives you a secure way to store essential access information and to set fine-grained access control. You can manage all secrets from one dashboard. Choose to store a key in either software-protected or hardware-protected hardware security modules (HSMs). You also can set Key Vault to auto-renew certificates

## Create a key vault

To create a key vault to manage access for Batch resources, use one of the following options:

- Azure portal
- PowerShell
- Azure CLI

### Create a key vault by using the Azure portal

- **Prerequisites**: To create a key vault by using the Azure portal, you must have a valid Azure subscription and Owner or Contributor access for Azure Key Vault.

To create a key vault:

1. Sign in to the Azure portal.

1. Search for **key vaults**.

1. In the Key Vault dashboard, select **Create**.

1. Enter or select your subscription, a resource group name, a key vault name, the pricing tier (Standard or Premium), and the region closest to your users. Each key vault name must be unique in Azure.

1. Select **Review**, and then select **Create** to create the key vault account.

1. Go to the key vault you created. The key vault name and the URI you use to access the vault are shown under deployment details.

For more information, see [Quickstart: Create a key vault by using the Azure portal](../key-vault/general/quick-create-portal.md).

### Create a key vault by using PowerShell

1. Use the PowerShell option in Azure Cloud Shell to sign in to your account:

   ```powershell
   Login-AzAccount
   ```

1. Use the following command to create a new resource group in the region that's closest to your users. For the `<placeholder>` values, enter the information for the Key Vault instance you want to create.

   ```powershell
   New-AzResourceGroup -Name <ResourceGroupName> -Location <Location>
   ```

1. Use the following cmdlet to create the key vault. For the `<placeholder>` values, use the use key vault name, resource group name, and region for the key vault you want to create.

   ```powershell
   New-AzKeyVault -Name <KeyVaultName> -ResourceGroupName <ResourceGroupName> -Location <Location>
   ```

For more information, see [Quickstart: Create a key vault by using PowerShell](../key-vault/general/quick-create-powershell.md).

### Create a key vault by using the Azure CLI

1. Use the Bash option in the Azure CLI to create a new resource group in the region that's closest to your users. For the `<placeholder>` values, enter the information for the Key Vault instance you want to create.

   ```bash
   az group create -name <ResourceGroupName> -l <Location>
   ```

1. Create the key vault by using the following command. For the `<placeholder>` values, use the use key vault name, resource group name, and region for the key vault you want to create.

   ```bash
   az keyvault create -name <KeyVaultName> -resource-group <ResourceGroupName> -location <Location>
   ```

For more information, see [Quickstart: Create a key vault by using the Azure CLI](../key-vault/general/quick-create-cli.md).

## FAQs

- Does Microsoft recommend using Azure Key Vault for access management in Batch?

  Yes. We recommend that you use Azure Key Vault as part of your approach to essential data protection in the cloud.

- Does user subscription mode support Azure Key Vault?

  Yes. In user subscription mode, you must create the key vault at the time you create the Batch account.

- Where can I find best practices for using Azure Key Vault?
  
  See [Azure Key Vault best practices](../key-vault/general/best-practices.md).

## Next steps

For more information, see [Key Vault certificate access control](../key-vault/certificates/certificate-access-control.md).
