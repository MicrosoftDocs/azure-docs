---
title: Conditional Access
description: Learn how to configure Conditional Access for Azure SQL Database, Azure SQL Managed Instance, and Azure Synapse Analytics.
services: sql-database
ms.service: sql-database
ms.subservice: security
ms.topic: conceptual
author: GithubMirek
ms.author: mireks
ms.reviewer: vanto
ms.custom: sqldbrb=1
ms.date: 04/28/2020
tag: azure-synpase
---
# Conditional Access (MFA) with Azure SQL Database and Azure Synapse Analytics

[Azure SQL Database](sql-database-technical-overview.md), [Azure SQL Managed Instance](sql-database-managed-instance.md), and [Azure Synapse Analytics](../synapse-analytics/sql-data-warehouse/sql-data-warehouse-overview-what-is.md) support Microsoft Conditional Access. 

The following steps show how to configure Azure SQL Database, SQL Managed Instance, or Azure Synapse to enforce a Conditional Access (CA) policy.  

## Prerequisites  
- You must configure your SQL Database, SQL Managed Instance, or SQL pool in Azure Synapse to support Azure Active Directory authentication. For specific steps, see [Configure and manage Azure Active Directory authentication with SQL Database or Azure Synapse](sql-database-aad-authentication-configure.md).  
- When multi-factor authentication is enabled, you must connect with at supported tool, such as the latest SQL Server Management Studio (SSMS). For more information, see [Configure Azure SQL Database multi-factor authentication for SQL Server Management Studio](sql-database-ssms-mfa-authentication-configure.md).  

## Configure conditional access

> [!NOTE]
> The below example uses Azure SQL Database, but you should select the appropriate product that you want to configure conditional access. 

1. Sign in to the Portal, select **Azure Active Directory**, and then select **Conditional Access**. For more information, see [Azure Active Directory Conditional Access technical reference](https://docs.microsoft.com/azure/active-directory/active-directory-conditional-access-technical-reference).  
   ![Conditional Access blade](./media/sql-database-conditional-access/conditional-access-blade.png) 
     
2. In the **Conditional Access-Policies** blade, click **New policy**, provide a name, and then click **Configure rules**.  
3. Under **Assignments**, select **Users and groups**, check **Select users and groups**, and then select the user or group for Conditional Access. Click **Select**, and then click **Done** to accept your selection.  
   ![select users and groups](./media/sql-database-conditional-access/select-users-and-groups.png)  

4. Select **Cloud apps**, click **Select apps**. You see all apps available for Conditional Access. Select **Azure SQL Database**, at the bottom click **Select**, and then click **Done**.  
   ![select SQL Database](./media/sql-database-conditional-access/select-sql-database.png)  
   If you can't find **Azure SQL Database** listed in the following third screenshot, complete the following steps:   
   - Sign in to your Azure SQL Database using SSMS with an Azure AD admin account.  
   - Execute `CREATE USER [user@yourtenant.com] FROM EXTERNAL PROVIDER`.  
   - Sign into Azure AD and verify that Azure SQL Database, SQL Managed Instance, or Azure Synapse are listed in the applications in your AAD.  

5. Select **Access controls**, select **Grant**, and then check the policy you want to apply. For this example, we select **Require multi-factor authentication**.  
   ![select grant access](./media/sql-database-conditional-access/grant-access.png)  

## Summary  
The selected application (Azure SQL Database) using Azure AD Premium, now enforces the selected Conditional Access policy, **Required multi-factor authentication.** 

For questions about Azure SQL Database and Azure Synapse regarding multi-factor authentication, contact <MFAforSQLDB@microsoft.com>.  

## Next steps  

For a tutorial, see [Secure your Azure SQL Database](sql-database-security-tutorial.md).
