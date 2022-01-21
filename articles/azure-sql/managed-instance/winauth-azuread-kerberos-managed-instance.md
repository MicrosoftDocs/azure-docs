---
title: Configure Azure SQL Managed Instance for Windows Authentication for Azure Active Directory (Preview)
titleSuffix: Azure SQL Managed Instance
description: Learn how to configure Azure SQL Managed Instance for Windows Authentication for Azure Active Directory.
services: sql-database
ms.service: sql-managed-instance
ms.subservice: deployment-configuration
ms.devlang: 
ms.topic: how-to
author: srdan-bozovic-msft
ms.author: srbozovi
ms.reviewer: mathoma, bonova, urmilano, wiassaf, kendralittle
ms.date: 01/31/2022
---

# Configure Azure SQL Managed Instance for Windows Authentication for Azure Active Directory (Preview)

This article describes how to configure a managed instance to support [Windows Authentication for Azure AD principals](winauth-azuread-overview.md). The steps to set up Azure SQL Managed Instance are the same for both the [incoming trust-based authentication flow](winauth-azuread-setup-incoming-trust-based-flow.md) and the [modern interactive authentication flow](winauth-azuread-setup-modern-interactive-flow.md). 

## Prerequisites

The following prerequisites are required to configure a managed instance for Windows Authentication for Azure AD principals:

|Prerequisite  | Description  |
|---------|---------|
|Az.Sql PowerShell module | This PowerShell module provides management cmdlets for Azure SQL resources. Install this module by running the following PowerShell command: `Install-Module -Name Az.Sql`   |
|Azure Active Directory PowerShell Module  | This module provides management cmdlets for Azure AD administrative tasks such as user and service principal management. Install this module by running the following PowerShell command: `Install-Module –Name AzureAD`  |
| A managed instance | You may [create a new managed instance](../../azure-arc/data/create-sql-managed-instance.md) or use an existing managed instance. You must [enable Azure AD authentication](../database/authentication-aad-configure.md) on the managed instance. |

## Configure Azure AD Authentication for Azure SQL Managed Instance

To enable Windows Authentication for Azure AD Principals, you need to enable a system assigned service principal on each managed instance. The system assigned service principal allows managed instance users to authenticate using the Kerberos protocol. You also need to grant admin consent to each service principal.
### Enable a system assigned service principal

To enable a system assigned service principal for a managed instance:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Navigate to your managed instance
1. Select **Identity**
1. Set **System assigned service principal** to **On**.
1. Select **Save**.

TODO: add screenshot

### Grant admin consent to a system assigned service principal

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Open Azure Active Directory.
1. Select **App registrations**.
1. Select **All applications**.
1. Find the application with the name matching your Managed Instance. The name will be in the format: `<managedinstancename> principal`


TODO: Insufficient privileges to view applications, so I can't tell what the step is or generate a new screenshot -- do they click the check mark? Do they need to click save?

## Connect to the managed instance with Windows Authentication

If you have already implemented either the incoming trust-based authentication flow](winauth-azuread-setup-incoming-trust-based-flow.md) or the [modern interactive authentication flow](winauth-azuread-setup-modern-interactive-flow.md), depending on the version of your client, you can now test connecting to your managed instance with Windows Authentication.

To test the connection with [SQL Server Management Studio](/sql/ssms/download-sql-server-management-studio-ssms) (SSMS), follow the steps in [Quickstart: Use SSMS to connect to and query Azure SQL Database or Azure SQL Managed Instance](../database/connect-query-ssms.md). Select **Windows Authentication** as your authentication type.

TODO: insert screenshot

## Next steps

Learn more about implementing Windows Authentication for Azure AD principals on Azure SQL Managed Instance:

- TODO: add link for announcement blog post
- TODO: add links to related articles in this set after titles and filenames are finalized