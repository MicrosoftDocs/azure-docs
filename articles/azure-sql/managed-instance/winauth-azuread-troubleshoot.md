---
title: Troubleshoot Windows Authentication for Azure AD principals on Azure SQL Managed Instance
titleSuffix: Azure SQL Managed Instance
description: Learn to troubleshoot Azure Active Directory Kerberos authentication for Azure SQL Managed Instance.
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


# Troubleshoot Windows Authentication for Azure AD principals on Azure SQL Managed Instance

This article contains troubleshooting steps for use when implementing [Windows Authentication for Azure AD principals](winauth-azuread-overview.md).

## Verify tickets are getting cached

Use the [klist](/windows-server/administration/windows-commands/klist) command to display a list of currently cached Kerberos tickets.

The `klist get krbtgt` command should return a ticket from the on-premises Active Directory realm. 

```dos
klist get krbtgt/kerberos.microsoftonline.com
```

The `klist get MSSQLSvc` command should return a ticket from the `kerberos.microsoftonline.com` realm with a Service Principal Name (SPN) to `MSSQLSvc/<miname>.<dnszone>.database.windows.net:1433`.

```dos
klist get MSSQLSvc/<miname>.<dnszone>.database.windows.net:1433
```


The following are some well-known error codes:

- **0x6fb: SQL SPN not found** - Check that you’ve entered a valid SPN. If you've implemented the incoming trust-based authentication flow, revisit steps to [create and configure the Azure AD Kerberos Trusted Domain Object](winauth-azuread-setup-incoming-trust-based-flow.md#create-and-configure-the-azure-ad-kerberos-trusted-domain-object) to validate that you’ve performed all the configuration steps.
- **0x51f** - This error is likely related to a conflict with the Fiddler tool. Turn on Fiddler to mitigate the issue.

## Investigate message flow failures

Use Wireshark, or the network traffic analyzer of your choice, to monitor traffic between the client and on-prem Kerberos Key Distribution Center (KDC).

When using Wireshark the following is expected:

- AS-REQ: Client => on-prem KDC => returns on-prem TGT.
- TGS-REQ: Client => on-prem KDC => returns referral to `kerberos.microsoftonline.com`.

## Next steps

Learn more about implementing Windows Authentication for Azure AD principals on Azure SQL Managed Instance:

- [What is Windows Authentication for Azure Active Directory principals on Azure SQL Managed Instance? (Preview)](winauth-azuread-overview.md)
- [How to set up Windows Authentication for Azure SQL Managed Instance using Azure Active Directory and Kerberos (Preview)](winauth-azuread-setup.md)
- [How Windows Authentication for Azure SQL Managed Instance is implemented with Azure Active Directory and Kerberos (Preview)](winauth-implementation-aad-kerberos.md)
- [How to set up Windows Authentication for Azure Active Directory with the modern interactive flow (Preview)](winauth-azuread-setup-modern-interactive-flow.md)
- [How to set up Windows Authentication for Azure AD with the incoming trust-based flow (Preview)](winauth-azuread-setup-incoming-trust-based-flow.md)