---
title: Create server configured with user-assigned managed identity and customer-managed TDE
titleSuffix: Azure SQL Database & Azure Synapse Analytics 
description: Learn how to configure user-assigned managed identity and customer-managed transparent data encryption (TDE) while creating an Azure SQL Database using the Azure portal, PowerShell, or Azure CLI.
ms.service: sql-database
ms.subservice: security
ms.topic: how-to
author: shohamMSFT
ms.author: shohamd
ms.reviewer: vanto
ms.date: 06/30/2021
---
# Create server configured with user-assigned managed identity and customer-managed TDE
[!INCLUDE[appliesto-sqldb-asa](../includes/appliesto-sqldb-asa.md)]


This tutorial outlines the steps to create a [server](logical-servers.md) configured with transparent data encryption (TDE) with customer-managed keys (CMK) using a [user-assigned managed identity](/azure/active-directory/managed-identities-azure-resources/overview#managed-identity-types) to access Azure Key Vault. 

## Prerequisites

- This how-to guide assumes that you have already created an [Azure Key Vault](/azure/key-vault/general/quick-create-portal) and imported a key into it to use as the TDE protector for Azure SQL Database. For more information, see [Transparent Data Encryption with BYOK Support](transparent-data-encryption-byok-overview.md).
- You must have created a [user-assigned managed identity](/azure/active-directory/managed-identities-azure-resources/overview#managed-identity-types) and provided it the required TDE permissions (*Get, Wrap Key, Unwrap Key*) on the above key vault. For creating a user-assigned managed identity, see [Create a user-assigned managed identity](/azure/active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-portal).
- You must have Azure PowerShell installed and running.
- [Recommended but optional] Create the key material for the TDE protector in a hardware security module (HSM) or local key store first, and import the key material to Azure Key Vault. Follow the [instructions for using a hardware security module (HSM) and Key Vault](../../key-vault/general/overview.md) to learn more.


> [!IMPORTANT]
> The PowerShell Azure Resource Manager (RM) module is still supported, but all future development is for the Az.Sql module. The AzureRM module will continue to receive bug fixes until at least December 2020.  The arguments for the commands in the Az module and in the AzureRm modules are substantially identical. For more about their compatibility, see [Introducing the new Azure PowerShell Az module](/powershell/azure/new-azureps-module-az).


## Create server configured with TDE with customer-managed key (CMK)

 The following steps outline the process of creating a new Azure SQL Database logical server and a new database with a user-assigned managed identity assigned, that is required for configuring a customer-managed key for TDE at server creation time. 

# [Portal](#tab/azure-portal)

1. Browse to the [Select SQL deployment](https://portal.azure.com/#create/Microsoft.AzureSQL) option page.

2. If you are not already signed in to Azure portal, sign in when prompted.

3. Under **SQL databases**, leave **Resource type** set to **Single database**, and select **Create**.

4. On the **Basics** tab of the **Create SQL Database** form, under **Project details**, select the desired Azure **Subscription**.

5. For **Resource group**, select **Create new**, enter a name for your resource group, and select **OK**.

6. For **Database name** enter ContosoHR.

7. For **Server**, select **Create new**, and fill out the **New server** form with the following values:

    - **Server name**: Enter mysqlserver, and add some characters for uniqueness. We can't provide an exact server name to use because server names must be globally unique for all servers in Azure, not just unique within a subscription. So enter something like mysqlserver135, and the portal lets you know if it is available or not.
    - **Server admin login**: Enter an admin login name, for example: azureuser.
    - **Password**: Enter a password that meets requirements, and enter it again in the **Confirm password** field.
    - **Location**: Select a location from the dropdown list


8. Select **Next: Networking** at the bottom of the page.

9. On the **Networking** tab, for **Connectivity method**, select **Public endpoint**.

10. For **Firewall rules**, set **Add current client IP address** to **Yes**. Leave **Allow Azure services and resources to access this server** set to **No**.

11. Select **Next: Security** at the bottom of the page.

12. On the Security tab, under **Identity (preview)**, click **Configure Identities**.

13. On the **Identity (preview)** blade, select **Customer managed key** click **Add**. Select the desired **Subscription** and then under **User assigned managed identities** select the desired user assigned managed identity from the selected subscription. Then click **Select**. 

14. Under **Primary identity**, select the same user-assigned managed identity selected in the previous step.

15. Select **Apply**

16. On the Security tab, under **Transparent data encryption**, select **Configure Transparent data encryption**. Then select **Select a key** and click **Change key**. Select the desired **Subscription**, **Key vault**, **Key** and **Version** for the customer-managed key to be used for TDE. Click **Select**.

17. Select **Apply** 

18. Select **Review + create** at the bottom of the page

19. On the **Review + create** page, after reviewing, select **Create**.


# [Azure CLI](#tab/azure-cli)

For information on installing the current release of Azure CLI, see [Install the Azure CLI](/cli/azure/install-azure-cli) article.

Create a server configured with user-assigned managed identity and customer-managed TDE using the [az sql server create](/cli/azure/sql/server) command.

```azurecli
az sql server create \
    --name $serverName \
    --resource-group $resourceGroupName \
    --location $location  \
    --admin-user $adminlogin \
    --admin-password $password
    --assign-identity
    --identity-type $identitytype
    --user-assigned-identity-id $identityid
    --primary-user-assigned-identity-id $primaryidentityid
 
```
Create a database with the [az sql db create](/cli/azure/sql/db) command. 

```azurecli
az sql db create \
    --resource-group $resourceGroupName \
    --server $serverName \
    --name mySampleDatabase \
    --sample-name AdventureWorksLT \
    --edition GeneralPurpose \
    --compute-model Serverless \
    --family Gen5 \
    --capacity 2
```


# [PowerShell](#tab/azure-powershell)

For Az module installation instructions, see [Install Azure PowerShell](/powershell/azure/install-az-ps). For specific cmdlets, see [AzureRM.Sql](/powershell/module/AzureRM.Sql/).

Use the [New-AzSqlServer](/powershell/module/az.sql/New-AzSqlServer) cmdlet.

```powershell
# create a server with user-assigned managed identity and customer-managed TDE
New-AzSqlServer -ResourceGroupName <ResourceGroupName> -Location <RegionName> -ServerName <ServerName> -ServerVersion "12.0" -SqlAdministratorCredentials (Get-Credential) -SqlAdministratorLogin <ServerAdminName> -SqlAdministratorPassword <ServerAdminPassword> -AssignIdentity -IdentityType <IdentityType> -UserAssignedIdentityId <UserAssignedIdentityId> -PrimaryUserAssignedIdentityId <PrimaryUserAssignedIdentityId> -KeyId <CustomerManagedKeyId>

```

---

## Next steps

- Get started with Azure Key Vault integration and Bring Your Own Key support for TDE: [Turn on TDE using your own key from Key Vault using PowerShell](transparent-data-encryption-byok-configure.md).