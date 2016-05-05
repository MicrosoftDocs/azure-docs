<properties
   pageTitle="Connect to SQL Data Warehouse By Using Azure Active Directory Authentication | Microsoft Azure"
   description="Learn how to connect to SQL Data Warehouse by using Azure Active Directory Authentication."
   services="sql-database"
   documentationCenter=""
   authors="BYHAM"
   manager="jhubbard"
   editor=""
   tags=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="data-management"
   ms.date="05/05/2016"
   ms.author="rick.byham@microsoft.com"/>

# Connecting to SQL Data Warehouse By Using Azure Active Directory Authentication


Azure Active Directory authentication is a mechanism of connecting to Microsoft Azure SQL Data Warehouse by using identities in Azure Active Directory (Azure AD). With Azure Active Directory authentication you can centrally manage the identities of database users and other Microsoft services in one central location. Central ID management provides a single place to manage SQL Data Warehouse users and simplifies permission management. Benefits include the following:

- It provides an alternative to SQL Server authentication.
- Helps stop the proliferation of user identities across database servers.
- Allows password rotation in a single place
- Customers can manage database permissions using external (AAD) groups.
- It can eliminate storing passwords by enabling integrated Windows authentication and other forms of authentication supported by Azure Active Directory.
- Azure Active Directory authentication uses contained database users to authenticate identities at the database level.
- Azure Active Directory supports [token-based authentication for applications](../sql-database/sql-database-aad-authentication-csharp.md) token-based authentication for applications connecting to SQL Data Warehouse.

> [AZURE.IMPORTANT] Azure Active Directory authentication is a preview feature and is subject to the preview terms in the license agreement (e.g., the Enterprise Agreement, Microsoft Azure Agreement, or Microsoft Online Subscription Agreement), as well as any applicable [Supplemental Terms of Use for Microsoft Azure Preview](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

The configuration steps include the following procedures to configure and use Azure Active Directory authentication.

1. Create and populate an Azure Active Directory
2. Optional: Associate or change the active directory that is currently associated with your Azure Subscription
3. Create an Azure Active Directory administrator for Azure SQL Data Warehouse.
4. Configure your client computers
5. Create contained database users in your database mapped to Azure AD identities
6. Connect to your data warehouse by using Azure AD identities

The detailed steps to configure and use Azure Active Directory authentication are nearly identical for Azure SQL Database and Azure SQL Data Warehouse. Follow the detailed steps in the topic [Connecting to SQL Database or SQL Data Warehouse By Using Azure Active Directory Authentication](../sql-database/sql-database-aad-authentication.md).

The principal differences between using Azure Active Directory authentication with Azure SQL Database and Azure SQL Data Warehouse is that you must you use SQL Server Data Tools instead of SQL Server Management Studio to connect to SQL Data Warehouse.