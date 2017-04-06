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
ms.custom: authentication and authorization
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: data-management
ms.date: 01/23/2017
ms.author: rickbyh

---
# SSMS support for Azure AD MFA with SQL Database and SQL Data Warehouse
Azure SQL Database and Azure SQL Data Warehouse now support connections from SQL Server Management Studio (SSMS) using *Active Directory Universal Authentication*. Active Directory Universal Authentication is an interactive work flow that supports *Azure Multi-Factor Authentication* (MFA). Azure MFA helps safeguard access to data and applications while meeting user demand for a simple sign-in process. It delivers strong authentication with a range of easy verification options—phone call, text message, smart cards with pin, or mobile app notification—allowing users to choose the method they prefer. 

* For a description of Multi-Factor Authentication, see [Multi-Factor Authentication](../multi-factor-authentication/multi-factor-authentication.md).
* For configuration steps, see [Configure Azure SQL Database multi-factor authentication for SQL Server Management Studio](sql-database-ssms-mfa-authentication-configure.md).

## Multi-factor options

SSMS now supports:

* Interactive MFA with Azure AD with the potential for pop-up dialog box validation.
* Non-interactive Active Directory Password and Active Directory Integrated Authentication methods that can be used in many different applications (ADO.NET, JDBC, ODBC, etc.). These two methods never result in pop-up dialog boxes.

When the user account is configured for MFA the interactive authentication work flow requires additional user interaction through pop-up dialog boxes, smart card use, etc. When the user account is configured for MFA, the user must select Azure Universal Authentication to connect. If the user account does not require MFA, the user can still use the other two Azure Active Directory Authentication options.

## Universal Authentication limitations for SQL Database and SQL Data Warehouse
* SSMS is the only tool currently enabled for MFA through Active Directory Universal Authentication.
* Only a single Azure Active Directory account can log in for an instance of SSMS using Universal Authentication. To log in as another Azure AD account, you must use another instance of SSMS. (This restriction is limited to Active Directory Universal Authentication; you can log in to different servers using Active Directory Password Authentication, Active Directory Integrated Authentication, or SQL Server Authentication).
* SSMS supports Active Directory Universal Authentication for Object Explorer, Query Editor, and Query Store visualization.
* Neither DacFx nor the Schema Designer support Universal Authentication.
* MSA accounts are not supported for Active Directory Universal Authentication.
* Active Directory Universal Authentication is not supported in SSMS for users that are imported into the current Active Directory from other Azure Active Directories. These users are not supported, because it would require a tenant ID to validate the accounts, and there is no mechanism to provide that.
* There are no additional software requirements for Active Directory Universal Authentication except that you must use a supported version of SSMS.



## Next steps

* For configuration steps, see [Configure Azure SQL Database multi-factor authentication for SQL Server Management Studio](sql-database-ssms-mfa-authentication-configure.md).
* Grant others access to your database: [SQL Database Authentication and Authorization: Granting Access](sql-database-manage-logins.md)  
Make sure others can connect through the firewall: [Configure an Azure SQL Database server-level firewall rule using the Azure portal](sql-database-configure-firewall-settings.md)


