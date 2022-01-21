---
title: How to set up Windows Authentication for Azure SQL Managed Instance using Azure Active Directory and Kerberos (Preview)
titleSuffix: Azure SQL Managed Instance
description: Learn how to set up Windows Authentication access to Azure SQL Managed Instance using Azure Active Directory (AAD) and Kerberos.
services: sql-database
ms.service: sql-managed-instance
ms.subservice: deployment-configuration
ms.devlang: 
ms.topic: conceptual
author: srdan-bozovic-msft
ms.author: srbozovi
ms.reviewer: mathoma, bonova, urmilano, wiassaf, kendralittle
ms.date: 01/31/2022
---


# How to set up Windows Authentication for Azure SQL Managed Instance using Azure Active Directory and Kerberos (Preview)

TODO: reposition modern interactive flow as recommended when available, and incoming trust-based as fallback.

TODO: update other prereq tables with mods here.

 This article gives an overview of how to set up infrastructure and managed instances to implement [Windows Authentication for Azure AD principals on Azure SQL Managed Instance](winauth-azuread-overview.md).

There are two phases to set up Windows Authentication for Azure SQL Managed Instance using Azure AD and Kerberos. 

- **One-time infrastructure setup**
TODO: refer to matrix and update these

    - Synchronize Active Directory (AD) and Azure AD, if this has not already been done.
    - Set up incoming trust-based authentication flow for down-level clients. 
    - Enable the modern interactive authentication flow for clients running Windows 10 21H1 and higher.
- **Configuration of Azure SQL Managed Instance**
    - Create a system assigned service principal for each managed instance.

## One-time infrastructure setup

The first step in infrastructure setup is to synchronize AD with Azure AD, if this has not already been completed.

Following this, a system administrator configures authentication flows. Two authentication flows are available to implement Windows Authentication for Azure AD principals on Azure SQL Managed Instance: the incoming trust-based flow supports AD joined clients running Windows server 2012 or higher, and the modern interactive flow supports Azure AD joined clients running Windows 10 21H1 or higher.

### Synchronize AD with Azure AD

Customers should first implement [Azure AD Connect](/azure/active-directory/hybrid/whatis-azure-ad-connect.md) to integrate on-premises directories with Azure AD.

### Incoming trust-based flow

The incoming trust-based flow works for clients running Windows Server 2012 and higher. This flow requires that clients be joined to AD. Clients must have a line of sight to AD from on-premises. In the incoming trust-based flow, a trust object is created in the customer's AD and is registered in Azure AD.

#### Prerequisites for the incoming trust-based flow

The following prerequisites are required to implement the incoming trust-based authentication flow:

|Prerequisite  |Description  |
|---------|---------|
|Clients running Windows Server 2012 or higher. *TODO: Is this available only for server versions of windows? Can customers using non-server OSes access? A: yes will work for consumer equivalent.* |         |
|Azure AD Hybrid Authentication Management Module. | This PowerShell module provides management features for on-premises setup. |
|Azure tenant.  |         |
|Azure subscription under the same Azure AD tenant you plan to use for authentication.|         |
|Azure AD Connect installed. | Hybrid environments where identities exist both in Azure AD and AD. |
|AD joined machine.  *TODO: not sure how this pre-req differs from the clients? Same client-- move to just below the top line and change wording.* |  You can determine if this prerequisite is met by running the [dsregcmd command](/azure/active-directory/devices/troubleshoot-device-dsregcmd.md): `dsregcmd.exe /status`  |

#### Implement the incoming trust-based flow

TODO: add wording and final link to [How to set up Windows Authentication for Azure Active Directory with the incoming trust based flow (Preview)](winauth-azuread-setup-incoming-trust-based-flow.md) when titles and file names are finalized.

### Modern interactive flow (recommended)

The modern interactive flow works with enlightened clients running Windows 10 21H1 and higher that are Azure AD or Hybrid Azure AD joined. In the modern interactive flow,  users can access Azure SQL Managed Instance without requiring a line of sight to Domain Controllers (DCs). There is no need for a trust object to be created in the customer's AD.

#### Prerequisites for the modern interactive flow

The following prerequisites are required to implement the modern interactive authentication flow:

|Prerequisite  |Description  |
|---------|---------|
|Clients running Windows 10 21H1 or higher. |         |
|Azure AD tenant. |         |
|Azure AD Connect installed. | Hybrid environments where identities exist both in Azure AD and AD. |
|Clients are joined to Azure AD or Hybrid Azure AD. *TODO: Same as client, move up and tweak wording.* |  You can determine if this prerequisite is met by running the [dsregcmd command](/azure/active-directory/devices/troubleshoot-device-dsregcmd.md): `dsregcmd.exe /status` |
|Interactive session (like you are logged into SSMS. Not a service running on a machine.) TODO: work on wording for this, possibly with a link | |

#### Implement the modern interactive flow

TODO: add wording and final link to [How to set up Windows Authentication for Azure Active Directory with the modern interactive flow (Preview)](winauth-azuread-setup-modern-interactive-flow.md) when titles and file names are finalized.


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


TODO: add wording and final link to [Configure Azure SQL Managed Instance for Windows Authentication for Azure Active Directory](winauth-azuread-kerberos-managed-instance.md) when titles and file names are finalized.

## Limitations

The following limitations apply to Windows Authentication for Azure AD principals on Azure SQL Managed Instance:

### Single instance per subnet

Due to Service Principal Name (SPN) configuration requirements, during the limited private preview only one managed instance per subnet can be enabled for Windows Authentication.

###	 Azure AD cached logon
<!--TODO: clarify -- Azure AD cached credentials? Not finding much when I search for "cached logon" -->

<!-- TODO: clarify - upgrade of what? A client machine? The Managed Instance? Something else? -->
Windows limits how often it connects to Azure AD, so there is a potential for user accounts to not have a refreshed Kerberos Ticket Granting Ticket (TGT) within 4 hours of an upgrade or fresh deployment.  User accounts who do not have a refreshed TGT results in failed ticket requests from Azure AD.  

<!--TODO: clarify where dsregcmd.exe is run and what locking and unlocking means. Does dsregcmd.exe need to be run on each client machine? A: YES -->
As an administrator, you can trigger an online logon immediately to handle upgrade scenarios by running the following command, then locking and unlocking the user session to get a refreshed TGT:

```dos
dsregcmd.exe /RefreshPrt
```

## Next steps

Learn more about implementing Windows Authentication for Azure AD principals on Azure SQL Managed Instance:

- TODO: add link for announcement blog post
- TODO: add links to related articles in this set after titles and filenames are finalized