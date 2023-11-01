---
title: Enable Microsoft Entra authentication for Azure SSIS integration runtime
description: This article describes how to enable Microsoft Entra authentication with the specified system/user-assigned managed identity for Azure Data Factory to create Azure-SSIS integration runtime.
ms.service: data-factory
ms.subservice: integration-services
ms.devlang: powershell
ms.topic: conceptual
author: chugugrace
ms.author: chugu
ms.custom: seo-lt-2019, has-azure-ad-ps-ref
ms.date: 07/17/2023
---

# Enable Microsoft Entra authentication for Azure-SSIS integration runtime

[!INCLUDE[appliesto-adf-asa-preview-md](includes/appliesto-adf-asa-preview-md.md)]

This article shows you how to enable Microsoft Entra authentication with the specified system/user-assigned managed identity for your Azure Data Factory (ADF) or Azure Synapse and use it instead of conventional authentication methods (like SQL authentication) to:

- Create an Azure-SSIS integration runtime (IR) that will in turn provision SSIS catalog database (SSISDB) in Azure SQL Database server/Managed Instance on your behalf.

- Connect to various Azure resources when running SSIS packages on Azure-SSIS IR.

For more info about the managed identity for your ADF, see [Managed identity for Data Factory and Azure Synapse](./data-factory-service-identity.md).

> [!NOTE]
> - In this scenario, Microsoft Entra authentication with the specified system/user-assigned managed identity for your ADF is only used in the provisioning and subsequent starting operations of your Azure-SSIS IR that will in turn provision and or connect to SSISDB. For SSIS package executions, your Azure-SSIS IR will still connect to SSISDB to fetch packages using SQL authentication with fully managed accounts (*AzureIntegrationServiceDbo* and *AzureIntegrationServiceWorker*) that are created during SSISDB provisioning.
> 
> - To use **connection manager user-assigned managed identity** feature, [OLEDB connection manager](/sql/integration-services/connection-manager/ole-db-connection-manager) for example, SSIS IR needs to be provisioned with the same user-assigned managed identity used in connection manager.  
> 
> - If you have already created your Azure-SSIS IR using SQL authentication, you can not reconfigure it to use Microsoft Entra authentication via PowerShell at this time, but you can do so via Azure portal/ADF app. 

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

<a name='enable-azure-ad-authentication-on-azure-sql-database'></a>

## Enable Microsoft Entra authentication on Azure SQL Database

Azure SQL Database supports creating a database with a Microsoft Entra user. First, you need to create a Microsoft Entra group with the specified system/user-assigned managed identity for your ADF as a member. Next, you need to set a Microsoft Entra user as the Active Directory admin for your Azure SQL Database server and then connect to it on SQL Server Management Studio (SSMS) using that user. Finally, you need to create a contained user representing the Microsoft Entra group, so the specified system/user-assigned managed identity for your ADF can be used by Azure-SSIS IR to create SSISDB on your behalf.

<a name='create-an-azure-ad-group-with-the-specified-systemuser-assigned-managed-identity-for-your-adf-as-a-member'></a>

### Create a Microsoft Entra group with the specified system/user-assigned managed identity for your ADF as a member

You can use an existing Microsoft Entra group or create a new one using Azure AD PowerShell.

1. Install the [Azure AD PowerShell](/powershell/azure/active-directory/install-adv2) module.

2. Sign in using `Connect-AzureAD`, run the following cmdlet to create a group, and save it in a variable:

   ```powershell
   $Group = New-AzureADGroup -DisplayName "SSISIrGroup" `
                             -MailEnabled $false `
                             -SecurityEnabled $true `
                             -MailNickName "NotSet"
   ```

   The result looks like the following example, which also displays the variable value:

   ```powershell
   $Group

   ObjectId DisplayName Description
   -------- ----------- -----------
   6de75f3c-8b2f-4bf4-b9f8-78cc60a18050 SSISIrGroup
   ```

3. Add the specified system/user-assigned managed identity for your ADF to the group. You can follow the [Managed identity for Data Factory or Azure Synapse](./data-factory-service-identity.md) article to get the Object ID of specified system/user-assigned managed identity for your ADF (e.g. 765ad4ab-XXXX-XXXX-XXXX-51ed985819dc, but do not use the Application ID for this purpose).

   ```powershell
   Add-AzureAdGroupMember -ObjectId $Group.ObjectId -RefObjectId 765ad4ab-XXXX-XXXX-XXXX-51ed985819dc
   ```

   You can also check the group membership afterwards.

   ```powershell
   Get-AzureAdGroupMember -ObjectId $Group.ObjectId
   ```

<a name='configure-azure-ad-authentication-for-azure-sql-database'></a>

### Configure Microsoft Entra authentication for Azure SQL Database

You can [Configure and manage Microsoft Entra authentication for Azure SQL Database](/azure/azure-sql/database/authentication-aad-configure) using the following steps:

1. In Azure portal, select **All services** -> **SQL servers** from the left-hand navigation.

2. Select your Azure SQL Database server to be configured with Microsoft Entra authentication.

3. In the **Settings** section of the blade, select **Active Directory admin**.

4. In the command bar, select **Set admin**.

5. Select a Microsoft Entra user account to be made administrator of the server, and then select **Select.**

6. In the command bar, select **Save.**

<a name='create-a-contained-user-in-azure-sql-database-representing-the-azure-ad-group'></a>

### Create a contained user in Azure SQL Database representing the Microsoft Entra group

For this next step, you need [SSMS](/sql/ssms/download-sql-server-management-studio-ssms).

1. Start SSMS.

2. In the **Connect to Server** dialog, enter your server name in the **Server name** field.

3. In the **Authentication** field, select **Active Directory - Universal with MFA support** (you can also use the other two Active Directory authentication types, see [Configure and manage Microsoft Entra authentication for Azure SQL Database](/azure/azure-sql/database/authentication-aad-configure)).

4. In the **User name** field, enter the name of Microsoft Entra account that you set as the server administrator, e.g. testuser@xxxonline.com.

5. Select **Connect** and complete the sign-in process.

6. In the **Object Explorer**, expand the **Databases** -> **System Databases** folder.

7. Right-click on **master** database and select **New query**.

8. In the query window, enter the following T-SQL command, and select **Execute** on the toolbar.

   ```sql
   CREATE USER [SSISIrGroup] FROM EXTERNAL PROVIDER
   ```

   The command should complete successfully, creating a contained user to represent the group.

9. Clear the query window, enter the following T-SQL command, and select **Execute** on the toolbar.

   ```sql
   ALTER ROLE dbmanager ADD MEMBER [SSISIrGroup]
   ```

   The command should complete successfully, granting the contained user the ability to create a database (SSISDB).

10. If your SSISDB was created using SQL authentication and you want to switch to use Microsoft Entra authentication for your Azure-SSIS IR to access it, first make sure that the above steps to grant permissions to the **master** database have finished successfully. Then, right-click on the **SSISDB** database and select **New query**.

    1. In the query window, enter the following T-SQL command, and select **Execute** on the toolbar.

       ```sql
       CREATE USER [SSISIrGroup] FROM EXTERNAL PROVIDER
       ```

       The command should complete successfully, creating a contained user to represent the group.

    2. Clear the query window, enter the following T-SQL command, and select **Execute** on the toolbar.

       ```sql
       ALTER ROLE db_owner ADD MEMBER [SSISIrGroup]
       ```

       The command should complete successfully, granting the contained user the ability to access SSISDB.

<a name='enable-azure-ad-authentication-on-azure-sql-managed-instance'></a>

## Enable Microsoft Entra authentication on Azure SQL Managed Instance

Azure SQL Managed Instance supports creating a database with the specified system/user-assigned managed identity for your ADF directly. You need not join the specified system/user-assigned managed identity for your ADF to a Microsoft Entra group nor create a contained user representing that group in Azure SQL Managed Instance.

<a name='configure-azure-ad-authentication-for-azure-sql-managed-instance'></a>

### Configure Microsoft Entra authentication for Azure SQL Managed Instance

Follow the steps in [Provision a Microsoft Entra administrator for Azure SQL Managed Instance](/azure/azure-sql/database/authentication-aad-configure#provision-azure-ad-admin-sql-managed-instance).

### Add the specified system/user-assigned managed identity for your ADF or Azure Synapse as a user in Azure SQL Managed Instance

For this next step, you need [SSMS](/sql/ssms/download-sql-server-management-studio-ssms).

1. Start SSMS.

2. Connect to Azure SQL Managed Instance using SQL Server account that is a **sysadmin**. This is a temporary limitation that will be removed once the support for Microsoft Entra server principals (logins) on Azure SQL Managed Instance becomes generally available. You will see the following error if you try to use a Microsoft Entra admin account to create the login: *Msg 15247, Level 16, State 1, Line 1 User does not have permission to perform this action*.

3. In the **Object Explorer**, expand the **Databases** -> **System Databases** folder.

4. Right-click on **master** database and select **New query**.

5. In the query window, execute the following T-SQL script to add the specified system/user-assigned managed identity for your ADF as a user.

   ```sql
   CREATE LOGIN [{your managed identity name}] FROM EXTERNAL PROVIDER
   ALTER SERVER ROLE [dbcreator] ADD MEMBER [{your managed identity name}]
   ALTER SERVER ROLE [securityadmin] ADD MEMBER [{your managed identity name}]
   ```

   If you use the system managed identity for your ADF, then *your managed identity name* should be your ADF name. If you use a user-assigned managed identity for your ADF, then *your managed identity name* should be the specified user-assigned managed identity name.
    
   The command should complete successfully, granting the system/user-assigned managed identity for your ADF the ability to create a database (SSISDB).

6. If your SSISDB was created using SQL authentication and you want to switch to use Microsoft Entra authentication for your Azure-SSIS IR to access it, first make sure that the above steps to grant permissions to the **master** database have finished successfully. Then, right-click on the **SSISDB** database and select **New query**.

   1. In the query window, enter the following T-SQL command, and select **Execute** on the toolbar.

      ```sql
      CREATE USER [{your managed identity name}] FOR LOGIN [{your managed identity name}] WITH DEFAULT_SCHEMA = dbo
      ALTER ROLE db_owner ADD MEMBER [{your managed identity name}]
      ```

      The command should complete successfully, granting the system/user-assigned managed identity for your ADF the ability to access SSISDB.

## Provision Azure-SSIS IR in Azure portal/ADF app

When you provision your Azure-SSIS IR in Azure portal/ADF app, on the **Deployment settings** page, select the **Create SSIS catalog (SSISDB) hosted by Azure SQL Database server/Managed Instance to store your projects/packages/environments/execution logs** check box and select either the **Use Microsoft Entra authentication with the system managed identity for Data Factory** or **Use Microsoft Entra authentication with a user-assigned managed identity for Data Factory** check box to choose Microsoft Entra authentication method for Azure-SSIS IR to access your database server that hosts SSISDB.

For more information, see [Create an Azure-SSIS IR in ADF](./create-azure-ssis-integration-runtime.md).

## Provision Azure-SSIS IR with PowerShell

To provision your Azure-SSIS IR with PowerShell, do the following things:

1. Install [Azure PowerShell](https://github.com/Azure/azure-powershell/releases/tag/v5.5.0-March2018) module.

2. In your script, do not set `CatalogAdminCredential` parameter. For example:

   ```powershell
   Set-AzDataFactoryV2IntegrationRuntime -ResourceGroupName $ResourceGroupName `
                                         -DataFactoryName $DataFactoryName `
                                         -Name $AzureSSISName `
                                         -Description $AzureSSISDescription `
                                         -Type Managed `
                                         -Location $AzureSSISLocation `
                                         -NodeSize $AzureSSISNodeSize `
                                         -NodeCount $AzureSSISNodeNumber `
                                         -Edition $AzureSSISEdition `
                                         -MaxParallelExecutionsPerNode $AzureSSISMaxParallelExecutionsPerNode `
                                         -CatalogServerEndpoint $SSISDBServerEndpoint `
                                         -CatalogPricingTier $SSISDBPricingTier

   Start-AzDataFactoryV2IntegrationRuntime -ResourceGroupName $ResourceGroupName `
                                           -DataFactoryName $DataFactoryName `
                                           -Name $AzureSSISName
   ```

<a name='run-ssis-packages-using-azure-ad-authentication-with-the-specified-systemuser-assigned-managed-identity-for-your-adf'></a>

## Run SSIS packages using Microsoft Entra authentication with the specified system/user-assigned managed identity for your ADF

When you run SSIS packages on Azure-SSIS IR, you can use Microsoft Entra authentication with the specified system/user-assigned managed identity for your ADF to connect to various Azure resources. Currently we support Microsoft Entra authentication with the specified system/user-assigned managed identity for your ADF on the following connection managers.

- [OLEDB Connection Manager](/sql/integration-services/connection-manager/ole-db-connection-manager#managed-identities-for-azure-resources-authentication)

- [ADO.NET Connection Manager](/sql/integration-services/connection-manager/ado-net-connection-manager#managed-identities-for-azure-resources-authentication)

- [Azure Storage Connection Manager](/sql/integration-services/connection-manager/azure-storage-connection-manager#managed-identities-for-azure-resources-authentication)
