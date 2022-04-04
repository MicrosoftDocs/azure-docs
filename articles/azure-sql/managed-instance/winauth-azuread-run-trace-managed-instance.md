---
title: Run a trace against Azure SQL Managed Instance using Windows Authentication for Azure Active Directory principals (preview)
description: Learn how to run a trace against Azure SQL Managed Instance using Authentication for Azure Active Directory principals
author: srdan-bozovic-msft
ms.author: srbozovi
ms.service: sql-managed-instance
ms.topic: how-to
ms.custom: template-how-to
ms.reviewer: mathoma, bonova, urmilano, wiassaf, kendralittle
ms.date: 03/01/2022
---

# Run a trace against Azure SQL Managed Instance using Windows Authentication for Azure Active Directory principals (preview)

This article shows how to connect and run a trace against Azure SQL Managed Instance using Windows Authentication for Azure Active Directory (Azure AD) principals. Windows authentication provides a convenient way for customers to connect to a managed instance, especially for database administrators and developers who are accustomed to launching [SQL Server Management Studio](/sql/ssms/download-sql-server-management-studio-ssms) (SSMS) with their Windows credentials.

This article shares two options to run a trace against a managed instance: you can trace with [extended events](/sql/relational-databases/extended-events/extended-events) or with  [SQL Server Profiler](/sql/tools/sql-server-profiler/sql-server-profiler). While SQL Server Profiler may still be used, the trace functionality used by SQL Server Profiler is deprecated and will be removed in a future version of Microsoft SQL Server.

## Prerequisites

To use Windows Authentication to connect to and run a trace against a managed instance, you must first meet the following prerequisites:

- [Set up Windows Authentication for Azure SQL Managed Instance using Azure Active Directory and Kerberos (Preview)](winauth-azuread-setup.md).
- Install [SQL Server Management Studio](/sql/ssms/download-sql-server-management-studio-ssms) (SSMS) on the client that is connecting to the managed instance. The SSMS installation includes SQL Server Profiler and built-in components to create and run extended events traces.
- Enable tooling on your client machine to connect to the managed instance. This may be done by any of the following:
    - [Configure an Azure VM to connect to Azure SQL Managed Instance](connect-vm-instance-configure.md).
    - [Configure a point-to-site connection to Azure SQL Managed Instance from on-premises](point-to-site-p2s-configure.md).
    - [Configure a public endpoint in Azure SQL Managed Instance](public-endpoint-configure.md).
- To create or modify extended events sessions, ensure that your account has the [server permission](/sql/t-sql/statements/grant-server-permissions-transact-sql) of ALTER ANY EVENT SESSION on the managed instance.
- To create or modify traces in SQL Server Profiler, ensure that your account has the [server permission](/sql/t-sql/statements/grant-server-permissions-transact-sql) of ALTER TRACE on the managed instance.

If you have not yet enabled Windows authentication for Azure AD principals against your managed instance, you may run a trace against a managed instance using an [Azure AD Authentication](/azure/azure-sql/database/authentication-aad-overview) option, including:

- 'Azure Active Directory - Password'
- 'Azure Active Directory - Universal with MFA'
- 'Azure Active Directory – Integrated'

## Run a trace with extended events

To run a trace with extended events against a managed instance using Windows Authentication, you will first connect Object Explorer to your managed instance using Windows Authentication.

1. Launch SQL Server Management Studio from a client machine where you have logged in using Windows Authentication.
1. The 'Connect to Server' dialog box should automatically appear. If it does not, ensure that **Object Explorer** is open and select **Connect**.
1. Enter the name of your managed instance as the **Server name**. The name of your managed instance should be in a format similar to `managedinstancename.12a34b5c67ce.database.windows.net`.
1. After **Authentication**, select **Windows Authentication**.

    :::image type="content" source="media/winauth-azuread/winauth-connect-to-managed-instance.png" alt-text="Dialog box from SQL Server Management Studio with a managed instance name in the 'Server Name' area and 'Authentication' set to 'Windows Authentication'.":::
    
1. Select **Connect**.

Now that **Object Explorer** is connected, you can create and run an extended events trace. Follow the steps in [Quick Start: Extended events in SQL Server](/sql/relational-databases/extended-events/quick-start-extended-events-in-sql-server) to learn how to create, test, and display the results of an extended events session.

## Run a trace with Profiler 

To run a trace with SQL Server Profiler against a managed instance using Windows Authentication, launch the Profiler application. Profiler may be [run from the Windows Start menu or from SQL Server Management Studio](/sql/tools/sql-server-profiler/start-sql-server-profiler).

1. On the File menu, select **New Trace**.
1. Enter the name of your managed instance as the **Server name**. The name of your managed instance should be in a format similar to `managedinstancename.12a34b5c67ce.database.windows.net`.
1. After **Authentication**, select **Windows Authentication**.

    :::image type="content" source="media/winauth-azuread/winauth-connect-to-managed-instance.png" alt-text="Dialog box from SQL Server Management Studio with a managed instance name in the 'Server Name' area and 'Authentication' set to 'Windows Authentication'.":::
    
1. Select **Connect**.
1. Follow the steps in [Create a Trace (SQL Server Profiler)](/sql/tools/sql-server-profiler/create-a-trace-sql-server-profiler) to configure the trace.
1. Select **Run** after configuring the trace.

## Next steps

Learn more about Windows Authentication for Azure AD principals with Azure SQL Managed Instance:

- [What is Windows Authentication for Azure Active Directory principals on Azure SQL Managed Instance? (Preview)](winauth-azuread-overview.md)
- [How to set up Windows Authentication for Azure SQL Managed Instance using Azure Active Directory and Kerberos (Preview)](winauth-azuread-setup.md)
- [How Windows Authentication for Azure SQL Managed Instance is implemented with Azure Active Directory and Kerberos (Preview)](winauth-implementation-aad-kerberos.md)
- [Extended Events](/sql/relational-databases/extended-events/extended-events)