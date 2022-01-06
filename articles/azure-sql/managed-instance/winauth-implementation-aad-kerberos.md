---
title: How Windows Authentication for Azure SQL Managed Instance is implemented with Azure AD and Kerberos (Preview)
titleSuffix: Azure SQL Managed Instance
description: Learn how Windows Authentication for Azure SQL Managed Instance is implemented with Azure Active Directory (Azure AD) and Kerberos.
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

# How Windows Authentication for Azure SQL Managed Instance is implemented with Azure Active Directory and Kerberos (Preview)

[Windows Authentication for Azure AD principals on Azure SQL Managed Instance](winauth-aad-overview.md) enables customers to move existing services to the cloud while maintaining a seamless user experience and provides the basis for security infrastructure modernization. To enable Windows Authentication for Azure Active Directory (Azure AD) principals, you will turn your Azure AD tenant into an independent Kerberos realm and create an incoming trust in the customer domain. This configuration allows users in the customer domain to access resources in your Azure AD tenant. It will not allow users in the Azure AD tenant to access resources in the customer domain.

## How Azure AD provides Kerberos authentication

To create an independent Kerberos realm for an Azure AD tenant, customers install the Azure AD Hybrid Authentication Management PowerShell module on any Windows server and run a cmdlet to create an Azure AD Kerberos object in their cloud and Active Directory. Trust created in this way enables existing Windows clients to access Azure AD with Kerberos.

Windows 10 21H1 clients and above have been enlightened for interactive mode and do not need configuration for interactive login flows to work. Clients running previous versions of Windows can be configured to use Kerberos Key Distribution Center (KDC) proxy servers to use Kerberos authentication.

Kerberos authentication in Azure AD enables:

- Traditional on-premises applications to move to the cloud without changing their fundamental authentication scheme.

- Applications to trust Azure AD directly. There is no need for traditional Active Directory (AD).


TODO: Diagram from Word doc here. Need to clarify a little how to interpret the diagram.
## Authentication flows

Two authentication flows are available to implement Windows Authentication for Azure AD principals on Azure SQL Managed Instance: an incoming trust-based flow, and a modern interactive flow.
### Incoming trust-based flow

The incoming trust-based flow works for clients running Windows Server 2012 and higher. This flow requires that clients be joined to AD. Clients must have a line of sight to AD from on-premises. In the incoming trust-based flow, a trust object is created in the customer's AD and is registered in Azure AD.

#### Prerequisites for the incoming trust-based flow

|Prerequisite  |Description  |
|---------|---------|
|Clients running Windows Server 2012 or higher. |         |
|Azure AD Hybrid Authentication Management Module. | This PowerShell module provides management features for on-premises setup. |
|Azure tenant.  |         |
|Azure subscription under the same Azure AD tenant you plan to use for authentication.|         |
|Azure AD Connect installed. | Hybrid environments where identities exist both in Azure AD and AD. |
|Active Directory joined machine. |  You can determine if this prerequisite is met by running `dsregcmd.exe /status` |

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
|Active Directory joined machine. |  You can determine if this prerequisite is met by running `dsregcmd.exe /status` |

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

Learn more about enabling Windows Authentication for Azure AD principals on Azure SQL Managed Instance:

- TODO: add link for announcement blog post
- TODO: add links for related articles in this set after titles and filenames are finalized