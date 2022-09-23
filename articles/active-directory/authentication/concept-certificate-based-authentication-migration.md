---
title:  Migrate from federation to Azure AD CBA
description: Learn how to migrate from Federated server to Azure AD

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: how-to
ms.date: 09/23/2022


ms.author: justinha
author: vimrang
manager: amycolannino
ms.reviewer: vimrang

ms.collection: M365-identity-device-management
ms.custom: has-adal-ref
---

#  Migrate from federation to Azure AD certificate-based authentication (CBA)

This article explains how to migrate from a federated servers such as Active Directory Federation Services (AD FS) to cloud authentication using Azure Active Directory (Azure AD) certificate-based authentication (CBA).

## Staged Rollout to transition from AD FS to Azure AD

Staged Rollout helps customers transition from AD FS to Azure AD by testing cloud authentication with selected groups of users before switching the entire tenant. 

## Enable a Staged Rollout for Certificate-based authentication on your tenant

To configure Staged Rollout, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com/) in the User Administrator role for the organization.
1. Search for and select **Azure Active Directory**.
1. From the left menu, select **Azure AD Connect**.
1. On the Azure AD Connect page, under the Staged Rollout of cloud authentication, click **Enable Staged Rollout for managed user sign-in**.
1. On the **Enable Staged Rollout** feature page, click **On** for the option [Certificate-based Authentication](active-directory-certificate-based-authentication-get-started.md)
1. Click **Manage groups** and add groups you want to be part of cloud authentication. To avoid a time-out, ensure that the security groups contain no more than 200 members initially.

More information can be found at [Staged Rollout](../hybrid/how-to-connect-staged-rollout.md).

## Azure AD connect to sync values for federated users from AD FS to Azure AD

An AD FS admin can use **Synchronization Rules Editor** to create rules to sync the values of attributes from AD FS to Azure AD user objects. 

Follow the steps in [Sync rules for certificateUserIds](concept-certificate-based-authentication-certificateuserids.md#update-certificateuserids-using-azure-ad-connect-for-federated-users).

The AWS service (which is the service AADConnect uses to access AAD) uses a special role **Hybrid Identity Administrator** that grants the necessary permissions. This role needs to get the right permissions to write to the new cloud attribute.

 >[!NOTE] 
 >For security, the AD FS admin must make sure that no other party can write to the attributes for synced users.

>[!NOTE] 
>If a user is using sync'd attributes, such as the onPremisesUserPrincipalName attribute in the user object for username binding, be aware that any user that has administrative access to the Azure AD Connect server can change the sync attribute mapping and in turn change the value of the synced attribute. The user does not need to be a cloud admin. The AD FS admin should make sure the administrative access to the Azure AD Connect server should be limited, and privileged accounts should be cloud-only accounts.

## Frequently asked questions about migrating from AD FS to Azure AD

### Can we have privileged accounts with a federated AD FS server?
        
While this is possible, Microsoft recommends privileged accounts be cloud-only accounts. This will limit the exposure in Azure AD from a compromise on-
premise environment.

### AD FS + Azure AD CBA - If an organization is a hybrid running both AD FS and Azure CBA, are they still vulnerable to the AD FS compromise?

Microsoft recommends privileged accounts be cloud-only accounts. This will limit the exposure in Azure AD from a compromise on-premise environment. 
Maintaining privileged accounts a cloud-only is foundational to this goal.

For Sync’d account:

If they are in a managed domain (not federated) there is no risk from the federated IdP.
If they are in a federated domain, but a subset are being moved to Azure AD CBA via Staged Rollout they are still subject to risks related to the federated 
Idp, until the federated domain is fully switched to cloud authentication.

### Should a customer eliminate Federated server like AD FS to prevent the capability to pivot from AD FS to Azure? 
 
Even with cloud-only GA (any role) account with AD FS an attacker could impersonate anyone, like the CIO, even if they cannot obtain a GA or similar role

When a domain is federated in Azure AD, a high level of trust is being placed on the Federated IdP (AD FS in this example but holds true for ANY federated 
IdP). There are many customers that deploy federated IdP such as AD FS exclusively to accomplish certificate based authentication. Azure AD CBA completely 
removes the AD FS dependency in this case. With Azure AD CBA, customers can move their application estate to Azure AD to modernize their IAM infrastructure 
and reduce costs with increased security.

From a security perspective, there is no change to the credential (X.509 certificate, CACs, PIVs etc.) or PKI being used. The PKI owners retain complete 
control of certificate lifecyle and policy (Issuance & Revocation). The revocation check and the authentication will happen at Azure AD instead of 
federated Idp. This will enable passwordless, phishing resistant authentication method to Azure AD to directly for all customers.

### How does authentication work with Federated AD FS and Azure AD cloud authentication with windows?

Azure AD CBA requires the user or application to supply the AzureAD UPN of the user intending to be signed in. 

In the browser example this is essentially the user typing in their AAD UPN. This is used for realm and user discovery. The certificate used then must match 
this user via one of the configured username bindings in the policy. 

In Windows sign-in this depends on if the device is Azure/Hybrid Azure AD joined. But in both cases if username hint is provided, Windows will send the hint 
as AzureAD UPN and subsequently the certificate used then must match this user via one of the configured username bindings in the policy.


## Next steps

- [Overview of Azure AD CBA](concept-certificate-based-authentication.md)
- [Technical deep dive for Azure AD CBA](concept-certificate-based-authentication-technical-deep-dive.md)
- [Limitations with Azure AD CBA](concept-certificate-based-authentication-limitations.md)
- [How to configure Azure AD CBA](how-to-certificate-based-authentication.md)
- [Windows SmartCard logon using Azure AD CBA](concept-certificate-based-authentication-smartcard.md)
- [Azure AD CBA on mobile devices (Android and iOS)](concept-certificate-based-authentication-mobile.md)
- [CertificateUserIDs](concept-certificate-based-authentication-certificateuserids.md)
- [FAQ](certificate-based-authentication-faq.yml)
