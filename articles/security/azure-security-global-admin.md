---
title: Enable MFA for all Azure administrators    
description: Guidance for enabling global admin
ms.service: security
author: barclayn
manager: barbkess
editor: TomSh
ms.topic: article
ms.date: 03/20/2018
ms.author: barclayn
---
# Enforce multi-factor authentication (MFA) for subscription administrators

When you create your administrators, including your global administrator account, it is essential that you use very strong authentication methods.

You can perform day-to-day administration by assigning specific administrator roles—such as Exchange administrator or Password administrator—to user accounts of IT staff as needed.
Additionally, enabling [Azure Multi-factor Authentication (MFA)](https://docs.microsoft.com/azure/multi-factor-authentication/multi-factor-authentication) for your administrators adds a second layer of security to user sign-ins and transactions. Azure MFA also helps IT reduce the likelihood that a compromised credential will have access to organization’s data.

For example: You enforce Azure MFA for your users and configure it to use a phone call or text message as verification. If the user’s credentials are compromised, the attacker won’t be able to access any resource since they will not have access to user’s phone. Organizations that do not add extra layers of identity protection are more susceptible for credential theft attack, which may lead to data compromise.

One alternative for organizations that want to keep the entire authentication control on-premises is to use [Azure Multi-Factor Authentication Server](https://docs.microsoft.com/azure/multi-factor-authentication/multi-factor-authentication-get-started-server), also called "MFA on-premises". By using this method, you will still be able to enforce multi-factor authentication, while keeping the MFA server on-premises.

To check who in your organization has administrative privileges you can verify by using the following Microsoft Azure AD V2 PowerShell command:

```azurepowershell-interactive
Get-AzureADDirectoryRole | Where { $_.DisplayName -eq "Company Administrator" } | Get-AzureADDirectoryRoleMember | Ft DisplayName
```

## Enabling MFA

Review how [MFA](https://docs.microsoft.com/azure/multi-factor-authentication/multi-factor-authentication-whats-next) operates before you proceed.

As long as your users have licenses that include Azure Multi-Factor Authentication, there's nothing that you need to do to turn on Azure MFA. You can start requiring two-step verification on an individual user basis. The licenses that enable Azure MFA are:

- Azure Multi-Factor Authentication
- Azure Active Directory Premium
- Enterprise Mobility + Security

## Turn on two-step verification for users

Use one of the procedures listed in [How to require two-step verification](https://docs.microsoft.com/azure/multi-factor-authentication/multi-factor-authentication-get-started-user-states) for a user or group to start using Azure MFA. You can choose to enforce two-step verification for all sign-ins, or you can create Conditional Access policies to require two-step verification only when it matters to you.

