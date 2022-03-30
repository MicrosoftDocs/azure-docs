---
title: How to set up Windows Authentication for Azure SQL Managed Instance using Azure Active Directory and Kerberos (Preview)
titleSuffix: Azure SQL Managed Instance
description: Learn how to set up Windows Authentication access to Azure SQL Managed Instance using Azure Active Directory and Kerberos.
services: sql-database
ms.service: sql-managed-instance
ms.subservice: deployment-configuration
ms.devlang: 
ms.topic: conceptual
author: srdan-bozovic-msft
ms.author: srbozovi
ms.reviewer: mathoma, bonova, urmilano, wiassaf, kendralittle
ms.date: 03/01/2022
---


# How to set up Windows Authentication for Azure SQL Managed Instance using Azure Active Directory and Kerberos (Preview)

This article gives an overview of how to set up infrastructure and managed instances to implement [Windows Authentication for Azure AD principals on Azure SQL Managed Instance](winauth-azuread-overview.md).

There are two phases to set up Windows Authentication for Azure SQL Managed Instance using Azure Active Directory (Azure AD) and Kerberos.

- **One-time infrastructure setup.**
    - Synchronize Active Directory (AD) and Azure AD, if this hasn't already been done.
    - Enable the modern interactive authentication flow, when available. The modern interactive flow is recommended for organizations with Azure AD joined or Hybrid AD joined clients running Windows 10 20H1 / Windows Server 2022 and higher where clients are joined to Azure AD or Hybrid AD.
    - Set up the incoming trust-based authentication flow. This is recommended for customers who can’t use the modern interactive flow, but who have AD joined clients running Windows 10 / Windows Server 2012 and higher.
- **Configuration of Azure SQL Managed Instance.**
    - Create a system assigned service principal for each managed instance.

## One-time infrastructure setup

The first step in infrastructure setup is to synchronize AD with Azure AD, if this hasn't already been completed.

Following this, a system administrator configures authentication flows. Two authentication flows are available to implement Windows Authentication for Azure AD principals on Azure SQL Managed Instance: the incoming trust-based flow supports AD joined clients running Windows server 2012 or higher, and the modern interactive flow supports Azure AD joined clients running Windows 10 21H1 or higher.

### Synchronize AD with Azure AD

Customers should first implement [Azure AD Connect](/azure/active-directory/hybrid/whatis-azure-ad-connect) to integrate on-premises directories with Azure AD.

### Select which authentication flow(s) you will implement

The following diagram shows eligibility and the core functionality of the modern interactive flow and the incoming trust-based flow:

:::image type="complex" source="media/winauth-azuread/decision-authentication.svg" alt-text="A decision tree showing criteria to select authentication flows." :::
"A decision tree showing that the modern interactive flow is suitable for clients running Windows 10 20H1 or Windows Server 2022 or higher, where clients are Azure AD joined or Hybrid AD joined. The incoming trust-based flow is suitable for clients running Windows 10 or Windows Server 2012 or higher where clients are AD joined."
:::image-end:::

The modern interactive flow works with enlightened clients running Windows 10 21H1 and higher that are Azure AD or Hybrid Azure AD joined. In the modern interactive flow,  users can access Azure SQL Managed Instance without requiring a line of sight to Domain Controllers (DCs). There is no need for a trust object to be created in the customer's AD. To enable the modern interactive flow, an administrator will set group policy for Kerberos authentication tickets (TGT) to be used during login.

The incoming trust-based flow works for clients running Windows 10 or Windows Server 2012 and higher. This flow requires that clients be joined to AD and have a line of sight to AD from on-premises. In the incoming trust-based flow, a trust object is created in the customer's AD and is registered in Azure AD. To enable the incoming trust-based flow, an administrator will set up an incoming trust with Azure AD and set up Kerberos Proxy via group policy.

### Modern interactive authentication flow

The following prerequisites are required to implement the modern interactive authentication flow:

|Prerequisite  |Description  |
|---------|---------|
|Clients must run Windows 10 20H1, Windows Server 2022, or a higher version of Windows. |         |
|Clients must be joined to Azure AD or Hybrid Azure AD. |  You can determine if this prerequisite is met by running the [dsregcmd command](/azure/active-directory/devices/troubleshoot-device-dsregcmd): `dsregcmd.exe /status` |
|Application must connect to the managed instance via an interactive session. | This supports applications such as SQL Server Management Studio (SSMS) and web applications, but won't work for applications that run as a service. |
|Azure AD tenant. |         |
|Azure AD Connect installed. | Hybrid environments where identities exist both in Azure AD and AD. |


See [How to set up Windows Authentication for Azure Active Directory with the modern interactive flow (Preview)](winauth-azuread-setup-modern-interactive-flow.md) for steps to enable this authentication flow.

### Incoming trust-based authentication flow

The following prerequisites are required to implement the incoming trust-based authentication flow:

|Prerequisite  |Description  |
|---------|---------|
|Client must run Windows 10, Windows Server 2012, or a higher version of Windows. |         |
|Clients must be joined to AD. The domain must have a functional level of Windows Server 2012 or higher. |  You can determine if the client is joined to AD by running the [dsregcmd command](/azure/active-directory/devices/troubleshoot-device-dsregcmd): `dsregcmd.exe /status`  |
|Azure AD Hybrid Authentication Management Module. | This PowerShell module provides management features for on-premises setup. |
|Azure tenant.  |         |
|Azure subscription under the same Azure AD tenant you plan to use for authentication.|         |
|Azure AD Connect installed. | Hybrid environments where identities exist both in Azure AD and AD. |


See [How to set up Windows Authentication for Azure Active Directory with the incoming trust based flow (Preview)](winauth-azuread-setup-incoming-trust-based-flow.md) for instructions on enabling this authentication flow.


## Configure Azure SQL Managed Instance

The steps to set up Azure SQL Managed Instance are the same for both the incoming trust-based authentication flow and the modern interactive authentication flow.

#### Prerequisites to configure a managed instance

The following prerequisites are required to configure a managed instance for Windows Authentication for Azure AD principals:

|Prerequisite  | Description  |
|---------|---------|
|Az.Sql PowerShell module | This PowerShell module provides management cmdlets for Azure SQL resources. Install this module by running the following PowerShell command: `Install-Module -Name Az.Sql`   |
|Azure Active Directory PowerShell Module  | This module provides management cmdlets for Azure AD administrative tasks such as user and service principal management. Install this module by running the following PowerShell command: `Install-Module –Name AzureAD`  |
| A managed instance | You may [create a new managed instance](../../azure-arc/data/create-sql-managed-instance.md) or use an existing managed instance. |

#### Configure each managed instance

See [Configure Azure SQL Managed Instance for Windows Authentication for Azure Active Directory](winauth-azuread-kerberos-managed-instance.md) for steps to configure each managed instance.

## Limitations

The following limitations apply to Windows Authentication for Azure AD principals on Azure SQL Managed Instance:

###	Not available for Linux clients

Windows Authentication for Azure AD principals is currently supported only for client machines running Windows.

###	Azure AD cached logon

Windows limits how often it connects to Azure AD, so there is a potential for user accounts to not have a refreshed Kerberos Ticket Granting Ticket (TGT) within 4 hours of an upgrade or fresh deployment of a client machine.  User accounts who do not have a refreshed TGT results in failed ticket requests from Azure AD.  

As an administrator, you can trigger an online logon immediately to handle upgrade scenarios by running the following command on the client machine, then locking and unlocking the user session to get a refreshed TGT:

```dos
dsregcmd.exe /RefreshPrt
```

## Next steps

Learn more about implementing Windows Authentication for Azure AD principals on Azure SQL Managed Instance:

- [What is Windows Authentication for Azure Active Directory principals on Azure SQL Managed Instance? (Preview)](winauth-azuread-overview.md)
- [How Windows Authentication for Azure SQL Managed Instance is implemented with Azure Active Directory and Kerberos (Preview)](winauth-implementation-aad-kerberos.md)
- [How to set up Windows Authentication for Azure Active Directory with the modern interactive flow (Preview)](winauth-azuread-setup-modern-interactive-flow.md)
- [How to set up Windows Authentication for Azure AD with the incoming trust-based flow (Preview)](winauth-azuread-setup-incoming-trust-based-flow.md)
- [Configure Azure SQL Managed Instance for Windows Authentication for Azure Active Directory (Preview)](winauth-azuread-kerberos-managed-instance.md)