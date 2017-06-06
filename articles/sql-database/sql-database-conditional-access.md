<properties
   pageTitle="Conditional Access with Azure SQL Database and Data Warehouse | Microsoft Azure"
   description="Learn how to Conditional Access for Azure SQL Database and Data Warehouse."
   services="sql-database"
   documentationCenter=""
   authors="BYHAM"
   manager="jhubbard"
   editor=""
   tags=""/>

<tags
   ms.service="sql-database"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="data-management"
   ms.date="06/06/2017"
   ms.author="rick.byham@microsoft.com"/>

# Conditional Access with Azure SQL Database and Data Warehouse  

Both SQL Database and SQL Data Warehouse support Microsoft Conditional Access. The following steps show how to configure SQL Database to enforce a Conditional Access policy.  

## Prerequisite steps:  
- You must configure your SQL Database or SQL Data Warehouse to support Azure Active Directory authentication. For specific steps, see [Configure and manage Azure Active Directory authentication with SQL Database or SQL Data Warehouse](sql-database-aad-authentication-configure.md).  
- When multi-factor authentication is enabled, you must connect with at supported tool, such as the latest SSMS. For more information, see [Configure Azure SQL Database multi-factor authentication for SQL Server Management Studio](sql-database-ssms-mfa-authentication-configure.md).  

## Configure CA for Azure SQL DB/DW  
1.	Login to the Portal -> select **Azure Active Directory** -> select **Conditional access**. For more information, see [Azure Active Directory Conditional Access technical reference](https://docs.microsoft.com/en-us/azure/active-directory/active-directory-conditional-access-technical-reference).  
  ![conditional access blade](./media/sql-database-conditional-access/conditional-access-blade.png) 
     
2.	In the **Conditional Access-Policies** blade, click **New policy** -> give a name -> then configure rules.  
3.	Under **Assignments** -> select **Users and groups** -> check **Select users and groups** -> select the user or group for CA -> click **Select** button -> click **Done** button.  
  ![select users and groups](./media/sql-database-conditional-access/select-users-and-groups.png)  

4.	Select **Cloud apps** -> click **Select apps**. You see all apps available for conditional access -> Select **Azure SQL Database** -> click **Select** button at the bottom -> click **Done** button.  
  ![select SQL Database](./media/sql-database-conditional-access/select-sql-database.png)  
  If you can’t find **Azure SQL Database** listed in the following third screen shot, complete the following steps:   
  - Login to your Azure SQL DB/DW instance using SSMS with an AAD admin account.  
  - Execute `CREATE USER [user@yourtenant.com] FROM EXTERNAL PROVIDER`.  
  - Login to AAD and verify that Azure SQL Database and Data Warehouse are listed in the applications in your AAD.  

5.	Set **Access controls** -> select **Grant** -> check the policy you want to apply. For this example, we select **Require multi-factor authentication**.  
  ![select grant access](./media/sql-database-conditional-access/grant-access.png)  

## Summary  
The selected application (Azure SQL Database) allowing to connect to Azure SQL DB/DW using Azure AD Premium, now enforces the selected Conditional Access policy, **Required multi-factor authentication.**  
For questions about Azure SQL Database and Data Warehouse regarding multi-factor authentication, contact MFAforSQLDB@microsoft.com.  

