---
title:  Migrate from Federated server to Azure AD
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

#  Migrate from Federated server like ADFS to Azure AD CBA

This article explains how to migrate from a federated server like ADFS to cloud authentication on Azure Active Directory (Azure AD) certificate-based authentication (CBA).

## Staged rollout to transition from Active Directory Federated Server(ADFS) to Azure AD

Staged rollout helps customers to transition from ADFS to Azure AD by selectively test groups of users with cloud authentication before switching the entire tenant to cloud authentication. 

## Enable a Staged Rollout for Certificate-based authentication on your tenant

To configure Staged Rollout, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com/) in the User Administrator role for the organization.
1. Search for and select **Azure Active Directory**.
1. From the left menu, select **Azure AD Connect**.
1. On the Azure AD Connect page, under the Staged rollout of cloud authentication, select the **Enable staged rollout for managed user sign-in** link.
1. On the Enable staged rollout feature page, Select **On** for the option [Certificate-based Authentication](https://learn.microsoft.com/en-us/azure/active-directory/authentication/active-directory-certificate-based-authentication-get-started)
1. Click on **Manage groups** and add groups you want to be part of cloud authentication. To avoid a time-out, ensure that the security groups contain no more than 200 members initially.

More information can be found at [Staged rollout] (https://learn.microsoft.com/en-us/azure/active-directory/hybrid/how-to-connect-staged-rollout)

## Azure AD connect to sync values for federated users from ADFS to Azure AD

ADFS admin can use **Synchronization Rules Editor** to create rules to sync the values of attributes from ADFS to Azure AD user objects. 

Please follow the steps described at [Sync rules for certificateUserIds](https://learn.microsoft.com/en-us/azure/active-directory/authentication/concept-certificate-based-authentication-certificateuserids#update-certificateuserids-using-azure-ad-connect-for-federated-users)

The AWS service (which is the service AADConnect uses to access AAD) uses a special role **Hybrid Identity Administrator** that grants the necessary permissions.This role needs to get the right permissions to write to the new cloud attribute.

 >[!NOTE] 
 >To be secure the ADFS admin must make sure that for synced users, no other party can write to the attribute.

>[!NOTE] 
>If a user is using sync'd attributes, say onPremisesUserPrincipalName attribute in the user object for username binding, be aware that any user that has administrative access to the AADConnect server can change the sync attribute mapping and in turn change the value of the synced attribute to their needs. The user does not need to be a cloud admin. ADFS admin should make sure the administrative access to the AADConnect server should be limited and privileged accounts be cloud-only accounts.

## Frequently asked questions for ADFS to Azure AD

**Can we have privileged accounts with a federated ADFS server?**

While this is possible, Microsoft recommends privileged accounts be cloud-only accounts. This will limit the exposure in Azure AD from a compromise on-premise environment.

**ADFS + Azure AD CBA - If an organization is a hybrid running both ADFS and Azure CBA, are they still vulnerable to the ADFS compromise?  For ex: if an organization still wishes to auth Global Administrators (GAs) with a federated ADFS identity, but configures the GA accounts exclusively with Azure CBA, are they still vulnerable to the escalation of privilege from ADFS to Azure AD?**

Microsoft recommends privileged accounts be cloud-only accounts. This will limit the exposure in Azure AD from a compromise on-premise environment. Maintaining privileged accounts a cloud-only is foundational to this goal.

For Sync’d account:

If they are in a managed domain (not federated) there is no risk from the federated IdP.
If they are in a federated domain, but a subset are being moved to Azure AD CBA via staged-rollout they are still subject to risks related to the federated Idp, until the federated domain is fully switched to cloud authentication.

**Should a customer eliminate Federated server like ADFS to prevent the capability to pivot from ADFS to Azure? Even with cloud-only GA (any role) account with ADFS an attacker could impersonate anyone, like the CIO, even if they cannot obtain a GA or similar role**

When a domain is federated in Azure AD, a high level of trust is being placed on the Federated IdP (ADFS in this example but holds true for ANY federated IdP). There are many customers that deploy federated IdP such as ADFS exclusively to accomplish certificate based authentication. Azure AD CBA completely removes the ADFS dependency in this case. With Azure AD CBA, customers can move their application estate to Azure AD to modernize their IAM infrastructure and reduce costs with increased security.

From a security perspective, there is no change to the credential (X.509 certificate, CACs, PIVs etc.) or PKI being used. The PKI owners retain complete control of certificate lifecyle and policy (Issuance & Revocation). The revocation check and the authentication will happen at Azure AD instead of federated Ip.  This will enable passwordless, phishing resistant authentication method to Azure AD to directly for all customers.

**How does authentication work with Federated ADFS and Azure AD cloud authentication with windows?**

Azure AD CBA requires the user or application to supply the AzureAD UPN of the user intending to be signed in. 

In the browser example this is essentially the user typing in their AAD UPN. This is used for realm and user discovery. The certificate used then must match this user via one of the configured username bindings in the policy. 

In Windows sign-in this depends on if the device is Azure/Hybrid Azure AD joined. But in both cases if username hint is provided, Windows will send the hint as AzureAD UPN and subsequently the certificate used then must match this user via one of the configured username bindings in the policy.


