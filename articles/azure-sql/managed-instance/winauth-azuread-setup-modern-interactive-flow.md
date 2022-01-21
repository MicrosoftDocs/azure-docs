---
title: How to set up Windows authentication for Azure Active Directory with the modern interactive flow (Preview)
titleSuffix: Azure SQL Managed Instance
description: Learn how to set up Windows Authentication for Azure Active Directory with the modern interactive flow.
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

# How to set up Windows Authentication for Azure Active Directory with the modern interactive flow (Preview)

This article describes how to implement the modern interactive authentication flow to allow enlightened clients running Windows 10 21H1 and higher to authenticate to an Azure SQL Managed Instance using Windows Authentication. Clients must be joined to Azure Active Directory (Azure AD) or Hybrid Azure AD. 

Enabling the modern interactive authentication flow is one step in [setting up Windows Authentication for Azure SQL Managed Instance using Azure Active Directory and Kerberos (Preview)](winauth-azuread-setup.md). The [incoming trust-based flow (Preview)](winauth-azuread-setup-incoming-trust-based-flow.md) is available for clients running Windows Server 2012 and higher.

With this preview, Azure AD is now its own independent Kerberos realm. Windows 10 21H1 clients are already enlightened and will redirect clients to access Azure AD Kerberos to request a Kerberos ticket. The capability for clients to access Azure AD Kerberos is switched off by default and can be enabled by modifying Group Policy. Group Policy can be used to deploy this feature in a staged manner by choosing specific clients you want to pilot on and then expanding it to all the clients across your environment. 

## Prerequisites

There is no AD to Azure AD set up required for enabling software running on Azure AD Joined VMs to access Azure SQL Managed Instance using Windows Authentication. The following prerequisites are required to implement the modern interactive authentication flow:

|Prerequisite  |Description  |
|---------|---------|
|Clients running Windows 10 21H1 or higher that are joined to Azure AD. |         |
|Azure AD tenant. |         |
|Azure AD Connect installed. | Hybrid environments where identities exist both in Azure AD and AD. |
|Azure AD joined or Hybrid Azure AD joined machine. *TODO: not sure how this pre-req differs from the clients? Is this machine for something else?* |  You can determine if this prerequisite is met by running the [dsregcmd command](/azure/active-directory/devices/troubleshoot-device-dsregcmd.md): `dsregcmd.exe /status` |


TODO: add that this can be done through Local Policy
## Configure group or local policy

Enable the following Group Policy setting `Administrative Templates\System\Kerberos\Allow retrieving the cloud Kerberos ticket during the logon`.

TODO: screenshot here


## Refresh PRT (Optional)

Users with existing logon sessions may need to refresh their Azure AD Primary Refresh Token (PRT) if they attempt to use this feature immediately after it has been enabled. It can take up to a few hours for the PRT to refresh on its own. 

To refresh PRT manually, run this command from a command prompt:

``` dos
dsregcmd.exe /RefreshPrt
```

## Next steps

Learn more about implementing Windows Authentication for Azure AD principals on Azure SQL Managed Instance:

- TODO: add link for announcement blog post
- TODO: add links to related articles in this set after titles and filenames are finalized