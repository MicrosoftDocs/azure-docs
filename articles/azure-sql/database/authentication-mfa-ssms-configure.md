---
title: Configure multi-factor authentication
titleSuffix: Azure SQL Database & SQL Managed Instance & Azure Synapse Analytics 
description: Learn how to use multi-factored authentication with SSMS for Azure SQL Database, Azure SQL Managed Instance and Azure Synapse Analytics.
services: sql-database
ms.service: sql-database
ms.subservice: security
ms.custom: has-adal-ref, sqldbrb=3
ms.devlang: 
ms.topic: conceptual
author: GithubMirek
ms.author: mireks
ms.reviewer: vanto
ms.date: 08/27/2019
---
# Configure multi-factor authentication for SQL Server Management Studio and Azure AD
[!INCLUDE[appliesto-sqldb-sqlmi-asa](../includes/appliesto-sqldb-sqlmi-asa.md)]

This article shows you how to use Azure Active Directory (Azure AD) multi-factor authentication (MFA) with SQL Server Management Studio (SSMS). Azure AD MFA can be used when connecting SSMS or SqlPackage.exe to [Azure SQL Database](sql-database-paas-overview.md), [Azure SQL Managed Instance](../managed-instance/sql-managed-instance-paas-overview.md) and [Azure Synapse Analytics (formerly Azure SQL Data Warehouse)](../../synapse-analytics/sql-data-warehouse/sql-data-warehouse-overview-what-is.md). For an overview of multi-factor authentication, see [Universal Authentication with SQL Database, SQL Managed Instance, and Azure Synapse (SSMS support for MFA)](../database/authentication-mfa-ssms-overview.md).

> [!IMPORTANT]
> Databases in Azure SQL Database, Azure SQL Managed Instance, and Azure Synapse (formerly Azure SQL Data Warehouse) are referred to collectively in the remainder of this article as databases, and the server is referring to the [server](logical-servers.md) that hosts databases for Azure SQL Database and Azure Synapse.

## Configuration steps

1. **Configure an Azure Active Directory** - For more information, see [Administering your Azure AD directory](https://msdn.microsoft.com/library/azure/hh967611.aspx), [Integrating your on-premises identities with Azure Active Directory](../../active-directory/hybrid/whatis-hybrid-identity.md), [Add your own domain name to Azure AD](https://azure.microsoft.com/blog/20../../windows-azure-now-supports-federation-with-windows-server-active-directory/), [Microsoft Azure now supports federation with Windows Server Active Directory](https://azure.microsoft.com/blog/20../../windows-azure-now-supports-federation-with-windows-server-active-directory/), and [Manage Azure AD using Windows PowerShell](https://msdn.microsoft.com/library/azure/jj151815.aspx).
2. **Configure MFA** - For step-by-step instructions, see [What is Azure Multi-Factor Authentication?](../../active-directory/authentication/multi-factor-authentication.md), [Conditional Access (MFA) with Azure SQL Database and Data Warehouse](conditional-access-configure.md). (Full Conditional Access requires a Premium Azure Active Directory. Limited MFA is available with a standard Azure AD.)
3. **Configure Azure AD Authentication** - For step-by-step instructions, see [Connecting to SQL Database, SQL Managed Instance, or Azure Synapse using Azure Active Directory Authentication](authentication-aad-overview.md).
4. **Download SSMS** - On the client computer, download the latest SSMS, from [Download SQL Server Management Studio (SSMS)](https://msdn.microsoft.com/library/mt238290.aspx).

## Connecting by using universal authentication with SSMS

The following steps show how to connect using the latest SSMS.

1. To connect using Universal Authentication, on the **Connect to Server** dialog box in SQL Server Management Studio (SSMS), select **Active Directory - Universal with MFA support**. (If you see **Active Directory Universal Authentication** you are not on the latest version of SSMS.)

   ![1mfa-universal-connect](./media/authentication-mfa-ssms-configure/mfa-no-tenant-ssms.png)  
2. Complete the **User name** box with the Azure Active Directory credentials, in the format `user_name@domain.com`.

   ![1mfa-universal-connect-user](./media/authentication-mfa-ssms-configure/1mfa-universal-connect-user.png)
3. If you are connecting as a guest user, you no longer need to complete the AD domain name or tenant ID field for guest users because SSMS 18.x or later automatically recognizes it. For more information, see [Universal Authentication with SQL Database, SQL Managed Instance, and Azure Synapse (SSMS support for MFA)](../database/authentication-mfa-ssms-overview.md).

   ![mfa-no-tenant-ssms](./media/authentication-mfa-ssms-configure/mfa-no-tenant-ssms.png)

   However, If you are connecting as a guest user using SSMS 17.x or older, you must click **Options**, and on the **Connection Property** dialog box, and complete the **AD domain name or tenant ID** box.

   ![mfa-tenant-ssms](./media/authentication-mfa-ssms-configure/mfa-tenant-ssms.png)

4. Select **Options** and specify the database on the **Options** dialog box. (If the connected user is a guest user (i.e. joe@outlook.com), you must check the box and add the current AD domain name or tenant ID as part of Options. See [Universal Authentication with SQL Database and SQL Data Warehouse (SSMS support for MFA)](../database/authentication-mfa-ssms-overview.md). Then click **Connect**.  
5. When the **Sign in to your account** dialog box appears, provide the account and password of your Azure Active Directory identity. No password is required if a user is part of a domain federated with Azure AD.

   ![2mfa-sign-in](./media/authentication-mfa-ssms-configure/mfa-no-tenant-ssms.png)  

   > [!NOTE]
   > For Universal Authentication with an account that does not require MFA, you connect at this point. For users requiring MFA, continue with the following steps:
   >  

6. Two MFA setup dialog boxes might appear. This one time operation depends on the MFA administrator setting, and therefore may be optional. For an MFA enabled domain this step is sometimes pre-defined (for example, the domain requires users to use a smartcard and pin).

   ![3mfa-setup](./media/authentication-mfa-ssms-configure/mfa-no-tenant-ssms.png)  
7. The second possible one time dialog box allows you to select the details of your authentication method. The possible options are configured by your administrator.

   ![4mfa-verify-1](./media/authentication-mfa-ssms-configure/mfa-no-tenant-ssms.png)  
8. The Azure Active Directory sends the confirming information to you. When you receive the verification code, enter it into the **Enter verification code** box, and click **Sign in**.

   ![5mfa-verify-2](./media/authentication-mfa-ssms-configure/mfa-no-tenant-ssms.png)  

When verification is complete, SSMS connects normally presuming valid credentials and firewall access.

## Next steps

- For an overview of multi-factor authentication, see [Universal Authentication with SQL Database, SQL Managed Instance, and Azure Synapse (SSMS support for MFA)](../database/authentication-mfa-ssms-overview.md).  
- Grant others access to your database: [SQL Database Authentication and Authorization: Granting Access](logins-create-manage.md)  
- Make sure others can connect through the firewall: [Configure a server-level firewall rule using the Azure portal](/database/firewall-configure.md)  
- When using **Active Directory- Universal with MFA** authentication, ADAL tracing is available beginning with [SSMS 17.3](https://docs.microsoft.com/sql/ssms/download-sql-server-management-studio-ssms). Off by default, you can turn on ADAL tracing by using the **Tools**, **Options** menu, under **Azure Services**, **Azure Cloud**, **ADAL Output Window Trace Level**, followed by enabling **Output**  in the **View** menu. The traces are available in the output window when selecting **Azure Active Directory option**.
