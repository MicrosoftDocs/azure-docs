---
title: Multi-Factor authentication - Azure SQL | Microsoft Docs
description: Use Multi-Factored Authentication with SSMS for SQL Database and SQL Data Warehouse.
services: sql-database
documentationcenter: ''
author: BYHAM
manager: jhubbard
editor: ''
tags: ''

ms.assetid: fbd6e644-0520-439c-8304-2e4fb6d6eb91
ms.service: sql-database
ms.custom: security
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: data-management
ms.date: 04/07/2017
ms.author: rickbyh

---
# Universal Authentication with SQL Database and SQL Data Warehouse (SSMS support for MFA)
Azure SQL Database and Azure SQL Data Warehouse support connections from SQL Server Management Studio (SSMS) using *Active Directory Universal Authentication*. 

- Active Directory Universal Authentication supports the two non-interactive authentication methods (Active Directory Password Authentication and Active Directory Integrated Authentication). Non-interactive Active Directory Password and Active Directory Integrated Authentication methods can be used in many different applications (ADO.NET, JDBC, ODBC, etc.). These two methods never result in pop-up dialog boxes.

- Active Directory Universal Authentication is an interactive method that also supports *Azure Multi-Factor Authentication* (MFA). Azure MFA helps safeguard access to data and applications while meeting user demand for a simple sign-in process. It delivers strong authentication with a range of easy verification options—phone call, text message, smart cards with pin, or mobile app notification—allowing users to choose the method they prefer. Interactive MFA with Azure AD can result in a pop-up dialog box for validation.

For a description of Multi-Factor Authentication, see [Multi-Factor Authentication](../multi-factor-authentication/multi-factor-authentication.md).
For configuration steps, see [Configure Azure SQL Database multi-factor authentication for SQL Server Management Studio](sql-database-ssms-mfa-authentication-configure.md).

### Azure AD domain name or tenant ID parameter   

Beginning with [SSMS version 17](https://docs.microsoft.com/sql/ssms/download-sql-server-management-studio-ssms), users that are imported into the current Active Directory from other Azure Active Directories, can provide the Azure AD domain name, or tenant ID when they connect. This allows **Active Directory Universal Authentication** to identify the correct authenticating authority. This option is also required to support Microsoft accounts (MSA) such as outlook.com, hotmail.com or live.com. All these users who want to be authenticated using Universal Authentication must enter their Azure AD domain name or tenant ID. This parameter represents the current Azure AD domain name/tenant ID the Azure Server is linked with. For example, if Azure Server is associated with Azure AD domain `contosotest.onmicrosoft.com` where user `joe@contosodev.onmicrosoft.com` is hosted as an imported user from Azure AD domain `contosodev.onmicrosoft.com`, the domain name required to authenticate this user is `contosotest.onmicrosoft.com`. When the user is a native user of the Azure AD linked to Azure Server, and is not an MSA account, no domain name or tenant ID is required. To enter the parameter (beginning with SSMS version 17), in the **Connect to Database** dialog box, complete the dialog box, selecting **Active Directory Universal Authentication**, click **Options**, click the **Connection Properties** tab, check the **AD domain name or tenant ID** box, and provide authenticating authority, such as the domain name (**contosotest.onmicrosoft.com**) or the guid of the tenant ID.

## Universal Authentication limitations for SQL Database and SQL Data Warehouse
* SSMS is the only tool currently enabled for MFA through Active Directory Universal Authentication.
* Only a single Azure Active Directory account can log in for an instance of SSMS using Universal Authentication. To log in as another Azure AD account, you must use another instance of SSMS. (This restriction is limited to Active Directory Universal Authentication; you can log in to different servers using Active Directory Password Authentication, Active Directory Integrated Authentication, or SQL Server Authentication).
* SSMS supports Active Directory Universal Authentication for Object Explorer, Query Editor, and Query Store visualization.
* Neither DacFx nor the Schema Designer support Universal Authentication.
* There are no additional software requirements for Active Directory Universal Authentication except that you must use a supported version of SSMS.


## Next steps

* For configuration steps, see [Configure Azure SQL Database multi-factor authentication for SQL Server Management Studio](sql-database-ssms-mfa-authentication-configure.md).
* Grant others access to your database: [SQL Database Authentication and Authorization: Granting Access](sql-database-manage-logins.md)  
Make sure others can connect through the firewall: [Configure an Azure SQL Database server-level firewall rule using the Azure portal](sql-database-configure-firewall-settings.md)
* For Azure AD configuration and management, see [Configure and manage Azure Active Directory authentication with SQL Database or SQL Data Warehouse](sql-database-aad-authentication-configure.md).


