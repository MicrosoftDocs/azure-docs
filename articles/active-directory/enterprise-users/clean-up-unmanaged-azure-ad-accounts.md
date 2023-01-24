---
title: Clean up unmanaged Azure AD accounts - Azure Active Directory | Microsoft Docs
description: Clean up unmanaged accounts using email OTP and PowerShell modules in Azure Active Directory
services: active-directory 
author: gargi-sinha
ms.author: gasinh
manager: martinco
ms.date: 06/28/2022
ms.topic: how-to
ms.service: active-directory
ms.subservice: enterprise-users
ms.workload: identity
ms.custom: it-pro
ms.collection: M365-identity-device-management
---

# Clean up unmanaged Azure Active Directory accounts

Prior to August 2022, Azure AD B2B supported Self-service sign-up for email-verified users which allowed users to create Azure AD accounts if they can verify ownership of the email. These accounts were created in unmanaged (aka “viral”) tenants. This meant that the user created an account with an organization’s domain that is not under the lifecycle management of the organization’s IT and access can persist after the user leaves the organization. To learn more, see, [What is self-service sign-up for Azure Active Directory?](./directory-self-service-signup.md)

The creation of unmanaged Azure AD accounts via Azure AD B2B is now deprecated and new B2B invitations cannot be redeemed with these accounts as of August 2022. However, invitations sent prior to August 2022 could have been redeemed with unmanaged Azure AD accounts. 

## Remove unmanaged Azure AD accounts

Admins can use either this sample application in [Azure-samples/Remove-unmanaged-guests](https://github.com/Azure-Samples/Remove-Unmanaged-Guests) or PowerShell cmdlets in [AzureAD/MSIdentityTools](https://github.com/AzureAD/MSIdentityTools/wiki/) to remove existing unmanaged Azure AD accounts from your Azure AD tenants. These tools allow you to identify viral users in your Azure AD tenant and reset the redemption status of these users.  

Once you have run one of the available tools, when users with unmanaged Azure AD accounts try to access your tenant, they will re-redeem their invitations. However, Azure AD will prevent users from redeeming with an existing unmanaged Azure AD account and they’ll redeem with another account type. Google Federation and SAML/WS-Fed are not enabled by default. So by default, these users will redeem with either an MSA or Email OTP, with MSA taking precedence. For a full explanation on the B2B redemption precedence, refer to the [redemption precedence flow chart](../external-identities/redemption-experience.md#invitation-redemption-flow).

## Overtaken tenants and domains

Some tenants created as unmanaged tenants can be taken over and
converted to a managed tenant. See, [take over an unmanaged directory as
administrator in Azure AD](./domains-admin-takeover.md).

In some cases, overtaken domains might not be updated, for example, missing a DNS TXT record and therefore become flagged as unmanaged. Implications are:

- For guest users who belong to formerly unmanaged tenants, redemption status is reset and one consent prompt appears. Redemption occurs with same account as before.

- After unmanaged user redemption status is reset, the tool might identify unmanaged users that are false positives.

## Reset redemption using a sample application

Use the sample application on
    [Azure-Samples/Remove-Unmanaged-Guests](https://github.com/Azure-Samples/Remove-Unmanaged-Guests).

## Reset redemption using MSIdentityTools PowerShell Module

MSIdentityTools PowerShell Module is a collection of cmdlets and
scripts. They are for use in the Microsoft identity platform and Azure
AD; they augment capabilities in the PowerShell SDK. See, [Microsoft
Graph PowerShell
SDK](https://github.com/microsoftgraph/msgraph-sdk-powershell).

Run the following cmdlets:

- `Install-Module Microsoft.Graph -Scope CurrentUser`

- `Install-Module MSIdentityTools`

- `Import-Module msidentitytools,microsoft.graph`

To identify unmanaged Azure AD accounts, run:

- `Connect-MgGraph --Scope User.Read.All`

- `Get-MsIdUnmanagedExternalUser`

To reset unmanaged Azure AD account redemption status, run:

- `Connect-MgGraph --Scope User.Readwrite.All`

- `Get-MsIdUnmanagedExternalUser | Reset-MsIdExternalUser`

To delete unmanaged Azure AD accounts, run:

- `Connect-MgGraph --Scope User.Readwrite.All`

- `Get-MsIdUnmanagedExternalUser | Remove-MgUser`

## Next steps

Examples of using
[Get-MSIdUnmanagedExternalUser](https://github.com/AzureAD/MSIdentityTools/wiki/Get-MsIdUnmanagedExternalUser)
