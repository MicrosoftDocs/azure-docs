---
title: How to set up Windows Authentication Azure SQL Managed Instance using Azure Active Directory and Kerberos (Preview)
titleSuffix: Azure SQL Managed Instance
description: Learn how to set up Windows Authentication access to Azure SQL Managed Instance using Azure Active Directory (AAD) and Kerberos.
services: sql-database
ms.service: sql-managed-instance
ms.subservice: deployment-configuration
ms.devlang: 
ms.topic: concept
author: srdan-bozovic-msft
ms.author: srbozovi
ms.reviewer: mathoma, bonova, urmilano, wiassaf, kendralittle
ms.date: 01/31/2022
---


# How to set up Windows Authentication Azure SQL Managed Instance using Azure Active Directory and Kerberos (Preview)


## Authentication flows

Two authentication flows are available to implement Windows Authentication for Azure AD principals on Azure SQL Managed Instance: the incoming trust-based flow supports AD joined clients running Windows server 2012 or higher, and the modern interactive flow supports Azure AD joined clients running Windows 10 21H1 or higher.
### Incoming trust-based flow

The incoming trust-based flow works for clients running Windows Server 2012 and higher. This flow requires that clients be joined to AD. Clients must have a line of sight to AD from on-premises. In the incoming trust-based flow, a trust object is created in the customer's AD and is registered in Azure AD.

#### Prerequisites for the incoming trust-based flow

|Prerequisite  |Description  |
|---------|---------|
|Clients running Windows Server 2012 or higher. *TODO: Is this available only for server versions of windows? Can customers using non-server OSes access? Or am I wrong and this line is not about the clients?* |         |
|Azure AD Hybrid Authentication Management Module. | This PowerShell module provides management features for on-premises setup. |
|Azure tenant.  |         |
|Azure subscription under the same Azure AD tenant you plan to use for authentication.|         |
|Azure AD Connect installed. | Hybrid environments where identities exist both in Azure AD and AD. |
|AD joined machine.  *TODO: not sure how this pre-req differs from the clients? Is this machine for something else?* |  You can determine if this prerequisite is met by running the [dsregcmd command](/azure/active-directory/devices/troubleshoot-device-dsregcmd.md): `dsregcmd.exe /status`  |

#### Implement the incoming trust-based flow

TODO: add wording and final link to [How to set up Windows Authentication for Azure Active Directory with the incoming trust based flow (Preview)](winauth-aad-setup-incoming-trust-based-flow.md) when titles and file names are finalized.

### Modern interactive flow

The modern interactive flow works with enlightened clients running Windows 10 21H1 and higher that are Azure AD or Hybrid Azure AD joined. In the modern interactive flow,  users can access Azure SQL Managed Instance without requiring a line of sight to Domain Controllers (DCs). There is no need for a trust object to be created in the customer's AD.
#### Prerequisites for the modern interactive flow

|Prerequisite  |Description  |
|---------|---------|
|Clients running Windows 10 21H1 or higher that are joined to Azure AD. |         |
|Azure AD tenant. |         |
|Azure AD Connect installed. | Hybrid environments where identities exist both in Azure AD and AD. |
|Azure AD joined or Hybrid Azure AD joined machine. *TODO: not sure how this pre-req differs from the clients? Is this machine for something else?* |  You can determine if this prerequisite is met by running the [dsregcmd command](/azure/active-directory/devices/troubleshoot-device-dsregcmd.md): `dsregcmd.exe /status` |

#### Implement the modern interactive flow

TODO: add wording and final link to [How to set up Windows Authentication for Azure Active Directory with the modern interactive flow (Preview)](winauth-aad-setup-modern-interactive-flow.md) when titles and file names are finalized.


## Azure SQL Managed Instance service principal

Enable Windows Authentication for Azure AD principals on a managed instance by:

- Configuring Azure AD authentication on the managed instance. 
- Enabling a system assigned service principal on the managed instance. The system assigned service principal allows managed instance users to authenticate using the Kerberos protocol.
- Granting admin consent to the service principal.

TODO: add wording and final link to [Configure Azure SQL Managed Instance for Windows Authentication for Azure Active Directory](winauth-aad-kerberos-managed-instance.md) when titles and file names are finalized.

## Limitations

The following limitations apply to Windows Authentication for Azure AD principals on Azure SQL Managed Instance:

### Single instance per subnet

Due to Service Principal Name (SPN) configuration requirements, during the limited private preview only one managed instance per subnet can be enabled for Windows Authentication.

###	 Azure AD cached logon
<!--TODO: clarify -- Azure AD cached credentials? Not finding much when I search for "cached logon" -->

<!-- TODO: clarify - upgrade of what? A client machine? The Managed Instance? Something else? -->
Windows limits how often it connects to Azure AD, so there is a potential for user accounts to not have a refreshed Kerberos Ticket Granting Ticket (TGT) within 4 hours of an upgrade or fresh deployment.  User accounts who do not have a refreshed TGT results in failed ticket requests from Azure AD.  

<!--TODO: clarify where dsregcmd.exe is run and what locking and unlocking means. Does dsregcmd.exe need to be run on each client machine?  Is the locking and unlocking of the user done in AD? Azure AD? Can we link to specific instructions for locking and unlocking? -->
As an administrator, you can trigger an online logon immediately to handle upgrade scenarios by running the following command, then locking and unlocking the user session to get a refreshed TGT:

```dos
dsregcmd.exe /RefreshPrt
```



## Next steps

Learn more about implementing Windows Authentication for Azure AD principals on Azure SQL Managed Instance:

- TODO: add link for announcement blog post
- TODO: add links related articles in this set after titles and filenames are finalized