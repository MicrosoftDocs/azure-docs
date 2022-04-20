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
ms.date: 03/01/2022
---

# How to set up Windows Authentication for Azure Active Directory with the modern interactive flow (Preview)

This article describes how to implement the modern interactive authentication flow to allow enlightened clients running Windows 10 20H1, Windows Server 2022, or a higher version of Windows to authenticate to Azure SQL Managed Instance using Windows Authentication. Clients must be joined to Azure Active Directory (Azure AD) or Hybrid Azure AD.

Enabling the modern interactive authentication flow is one step in [setting up Windows Authentication for Azure SQL Managed Instance using Azure Active Directory and Kerberos (Preview)](winauth-azuread-setup.md). The [incoming trust-based flow (Preview)](winauth-azuread-setup-incoming-trust-based-flow.md) is available for AD joined clients running Windows 10 / Windows Server 2012 and higher.

With this preview, Azure AD is now its own independent Kerberos realm. Windows 10 21H1 clients are already enlightened and will redirect clients to access Azure AD Kerberos to request a Kerberos ticket. The capability for clients to access Azure AD Kerberos is switched off by default and can be enabled by modifying group policy. Group policy can be used to deploy this feature in a staged manner by choosing specific clients you want to pilot on and then expanding it to all the clients across your environment.

## Prerequisites

There is no AD to Azure AD set up required for enabling software running on Azure AD Joined VMs to access Azure SQL Managed Instance using Windows Authentication. The following prerequisites are required to implement the modern interactive authentication flow:

|Prerequisite  |Description  |
|---------|---------|
|Clients must run Windows 10 20H1, Windows Server 2022, or a higher version of Windows. |         |
|Clients must be joined to Azure AD or Hybrid Azure AD. |  You can determine if this prerequisite is met by running the [dsregcmd command](../../active-directory/devices/troubleshoot-device-dsregcmd.md): `dsregcmd.exe /status` |
|Application must connect to the managed instance via an interactive session. | This supports applications such as SQL Server Management Studio (SSMS) and web applications, but won't work for applications that run as a service. |
|Azure AD tenant. |         |
|Azure AD Connect installed. | Hybrid environments where identities exist both in Azure AD and AD. |



## Configure group policy

Enable the following group policy setting `Administrative Templates\System\Kerberos\Allow retrieving the cloud Kerberos ticket during the logon`:

1. Open the group policy editor.
1. Navigate to `Administrative Templates\System\Kerberos\`.
1. Select the **Allow retrieving the cloud kerberos ticket during the logon** setting.

    :::image type="content" source="media/winauth-azuread/policy-allow-retrieving-cloud-kerberos-ticket-during-logon.png" alt-text="A list of kerberos policy settings in the Windows policy editor. The 'Allow retrieving the cloud kerberos tikcet during the logon' policy is highlighted with a red box."  lightbox="media/winauth-azuread/policy-allow-retrieving-cloud-kerberos-ticket-during-logon.png":::

1. In the setting dialog, select **Enabled**.
1. Select **OK**.

    :::image type="content" source="media/winauth-azuread/policy-enable-cloud-kerberos-ticket-during-logon-setting.png" alt-text="Screenshot of the 'Allow retrieving the cloud kerberos ticket during the logon' dialog. Select 'Enabled' and then 'OK' to enable the policy setting."  lightbox="media/winauth-azuread/policy-enable-cloud-kerberos-ticket-during-logon-setting.png":::
    
## Refresh PRT (optional)

Users with existing logon sessions may need to refresh their Azure AD Primary Refresh Token (PRT) if they attempt to use this feature immediately after it has been enabled. It can take up to a few hours for the PRT to refresh on its own.

To refresh PRT manually, run this command from a command prompt:

``` dos
dsregcmd.exe /RefreshPrt
```

## Next steps

Learn more about implementing Windows Authentication for Azure AD principals on Azure SQL Managed Instance:

- [What is Windows Authentication for Azure Active Directory principals on Azure SQL Managed Instance? (Preview)](winauth-azuread-overview.md)
- [How Windows Authentication for Azure SQL Managed Instance is implemented with Azure Active Directory and Kerberos (Preview)](winauth-implementation-aad-kerberos.md)
- [How to set up Windows Authentication for Azure AD with the incoming trust-based flow (Preview)](winauth-azuread-setup-incoming-trust-based-flow.md)
- [Configure Azure SQL Managed Instance for Windows Authentication for Azure Active Directory (Preview)](winauth-azuread-kerberos-managed-instance.md)
- [Troubleshoot Windows Authentication for Azure AD principals on Azure SQL Managed Instance](winauth-azuread-troubleshoot.md)