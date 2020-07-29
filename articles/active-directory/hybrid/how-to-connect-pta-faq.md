---
title: 'Azure AD Connect: Pass-through Authentication - Frequently asked questions | Microsoft Docs'
description: Answers to frequently asked questions about Azure Active Directory Pass-through Authentication
services: active-directory
keywords: Azure AD Connect Pass-through Authentication, install Active Directory, required components for Azure AD, SSO, Single Sign-on
documentationcenter: ''
author: billmath
manager: daveba
ms.assetid: 9f994aca-6088-40f5-b2cc-c753a4f41da7
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 06/09/2020
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---

# Azure Active Directory Pass-through Authentication: Frequently asked questions

This article addresses frequently asked questions about Azure Active Directory (Azure AD) Pass-through Authentication. Keep checking back for updated content.

## Which of the methods to sign in to Azure AD, Pass-through Authentication, password hash synchronization, and Active Directory Federation Services (AD FS), should I choose?

Review [this guide](https://docs.microsoft.com/azure/security/fundamentals/choose-ad-authn) for a comparison of the various Azure AD sign-in methods and how to choose the right sign-in method for your organization.

## Is Pass-through Authentication a free feature?

Pass-through Authentication is a free feature. You don't need any paid editions of Azure AD to use it.

## Is Pass-through Authentication available in the [Microsoft Azure Germany cloud](https://www.microsoft.de/cloud-deutschland) and the [Microsoft Azure Government cloud](https://azure.microsoft.com/features/gov/)?

No. Pass-through Authentication is only available in the worldwide instance of Azure AD.

## Does [Conditional Access](../active-directory-conditional-access-azure-portal.md) work with Pass-through Authentication?

Yes. All Conditional Access capabilities, including Azure Multi-Factor Authentication, work with Pass-through Authentication.

## Does Pass-through Authentication support "Alternate ID" as the username, instead of "userPrincipalName"?
Yes, sign-in using a non-UPN value, such as an alternate email, is supported for both pass-through authentication (PTA) and password hash sync (PHS). For more information about [Alternate Login ID](../authentication/howto-authentication-use-email-signin.md).

## Does password hash synchronization act as a fallback to Pass-through Authentication?

No. Pass-through Authentication _does not_ automatically failover to password hash synchronization. To avoid user sign-in failures, you should configure Pass-through Authentication for [high availability](how-to-connect-pta-quick-start.md#step-4-ensure-high-availability).

## What happens when I switch from password hash synchronization to Pass-through Authentication?

When you use Azure AD Connect to switch the sign-in method from password hash synchronization to Pass-through Authentication, Pass-through Authentication becomes the primary sign-in method for your users in managed domains. Please note that all users' password hashes which were previously synchronized by password hash synchronization remain stored on Azure AD.

## Can I install an [Azure AD Application Proxy](../manage-apps/application-proxy.md) connector on the same server as a Pass-through Authentication Agent?

Yes. The rebranded versions of the Pass-through Authentication Agent, version 1.5.193.0 or later, support this configuration.

## What versions of Azure AD Connect and Pass-through Authentication Agent do you need?

For this feature to work, you need version 1.1.750.0 or later for Azure AD Connect and 1.5.193.0 or later for the Pass-through Authentication Agent. Install all the software on servers with Windows Server 2012 R2 or later.

## What happens if my user's password has expired and they try to sign in by using Pass-through Authentication?

If you have configured [password writeback](../authentication/concept-sspr-writeback.md) for a specific user, and if the user signs in by using Pass-through Authentication, they can change or reset their passwords. The passwords are written back to on-premises Active Directory as expected.

If you have not configured password writeback for a specific user or if the user doesn't have a valid Azure AD license assigned, the user can't update their password in the cloud. They can't update their password, even if their password has expired. The user instead sees this message: "Your organization doesn't allow you to update your password on this site. Update it according to the method recommended by your organization, or ask your admin if you need help." The user or the administrator must reset their password in on-premises Active Directory.

## How does Pass-through Authentication protect you against brute-force password attacks?

[Read information about Smart Lockout](../authentication/howto-password-smart-lockout.md).

## What do Pass-through Authentication Agents communicate over ports 80 and 443?

- The Authentication Agents make HTTPS requests over port 443 for all feature operations.
- The Authentication Agents make HTTP requests over port 80 to download the TLS/SSL certificate revocation lists (CRLs).

     >[!NOTE]
     >Recent updates reduced the number of ports that the feature requires. If you have older versions of Azure AD Connect or the Authentication Agent, keep these ports open as well: 5671, 8080, 9090, 9091, 9350, 9352, and 10100-10120.

## Can the Pass-through Authentication Agents communicate over an outbound web proxy server?

Yes. If Web Proxy Auto-Discovery (WPAD) is enabled in your on-premises environment, Authentication Agents automatically attempt to locate and use a web proxy server on the network.

If you don't have WPAD in your environment, you can add proxy information (as shown below) to allow a Pass-through Authentication Agent to communicate with Azure AD:
- Configure proxy information in Internet Explorer before you install the Pass-through Authentication Agent on the server. This will allow you to complete the installation of the Authentication Agent, but it will still show up as **Inactive** on the Admin portal.
- On the server, navigate to "C:\Program Files\Microsoft Azure AD Connect Authentication Agent".
- Edit the "AzureADConnectAuthenticationAgentService" configuration file and add the following lines (replace "http\://contosoproxy.com:8080" with your actual proxy address):

```
   <system.net>
      <defaultProxy enabled="true" useDefaultCredentials="true">
         <proxy
            usesystemdefault="true"
            proxyaddress="http://contosoproxy.com:8080"
            bypassonlocal="true"
         />
     </defaultProxy>
   </system.net>
```

## Can I install two or more Pass-through Authentication Agents on the same server?

No, you can only install one Pass-through Authentication Agent on a single server. If you want to configure Pass-through Authentication for high availability, [follow the instructions here](how-to-connect-pta-quick-start.md#step-4-ensure-high-availability).

## Do I have to manually renew certificates used by Pass-through Authentication Agents?

The communication between each Pass-through Authentication Agent and Azure AD is secured using certificate-based authentication. These [certificates are automatically renewed every few months by Azure AD](how-to-connect-pta-security-deep-dive.md#operational-security-of-the-authentication-agents). There is no need to manually renew these certificates. You can clean up older expired certificates as required.

## How do I remove a Pass-through Authentication Agent?

As long as a Pass-through Authentication Agent is running, it remains active and continually handles user sign-in requests. If you want to uninstall an Authentication Agent, go to **Control Panel -> Programs -> Programs and Features** and uninstall both the **Microsoft Azure AD Connect Authentication Agent** and the **Microsoft Azure AD Connect Agent Updater** programs.

If you check the Pass-through Authentication blade on the [Azure Active Directory admin center](https://aad.portal.azure.com) after completing the preceding step, you'll see the Authentication Agent showing as **Inactive**. This is _expected_. The Authentication Agent is automatically dropped from the list after a few days.

## I already use AD FS to sign in to Azure AD. How do I switch it to Pass-through Authentication?

If you are migrating from AD FS (or other federation technologies) to Pass-through Authentication, we highly recommend that you follow our detailed deployment guide published [here](https://github.com/Identity-Deployment-Guides/Identity-Deployment-Guides/blob/master/Authentication/Migrating%20from%20Federated%20Authentication%20to%20Pass-through%20Authentication.docx?raw=true).

## Can I use Pass-through Authentication in a multi-forest Active Directory environment?

Yes. Multi-forest environments are supported if there are forest trusts (two-way) between your Active Directory forests and if name suffix routing is correctly configured.

## Does Pass-through Authentication provide load balancing across multiple Authentication Agents?

No, installing multiple Pass-through Authentication Agents ensures only [high availability](how-to-connect-pta-quick-start.md#step-4-ensure-high-availability). It does not provide deterministic load balancing between the Authentication Agents. Any Authentication Agent (at random) can process a particular user sign-in request.

## How many Pass-through Authentication Agents do I need to install?

Installing multiple Pass-through Authentication Agents ensures [high availability](how-to-connect-pta-quick-start.md#step-4-ensure-high-availability). But, it does not provide deterministic load balancing between the Authentication Agents.

Consider the peak and average load of sign-in requests that you expect to see on your tenant. As a benchmark, a single Authentication Agent can handle 300 to 400 authentications per second on a standard 4-core CPU, 16-GB RAM server.

To estimate network traffic, use the following sizing guidance:
- Each request has a payload size of (0.5K + 1K * num_of_agents) bytes; i.e., data from Azure AD to the Authentication Agent. Here, "num_of_agents" indicates the number of Authentication Agents registered on your tenant.
- Each response has a payload size of 1K bytes; i.e., data from the Authentication Agent to Azure AD.

For most customers, two or three Authentication Agents in total are sufficient for high availability and capacity. You should install Authentication Agents close to your domain controllers to improve sign-in latency.

>[!NOTE]
>There is a system limit of 40 Authentication Agents per tenant.

## Can I install the first Pass-through Authentication Agent on a server other than the one that runs Azure AD Connect?

No, this scenario is _not_ supported.

## Why do I need a cloud-only Global Administrator account to enable Pass-through Authentication?

It is recommended that you enable or disable Pass-through Authentication using a cloud-only Global Administrator account. Learn about [adding a cloud-only Global Administrator account](../active-directory-users-create-azure-portal.md). Doing it this way ensures that you don't get locked out of your tenant.

## How can I disable Pass-through Authentication?

Rerun the Azure AD Connect wizard and change the user sign-in method from Pass-through Authentication to another method. This change disables Pass-through Authentication on the tenant and uninstalls the Authentication Agent from the server. You must manually uninstall the Authentication Agents from the other servers.

## What happens when I uninstall a Pass-through Authentication Agent?

If you uninstall a Pass-through Authentication Agent from a server, it causes the server to stop accepting sign-in requests. To avoid breaking the user sign-in capability on your tenant, ensure that you have another Authentication Agent running before you uninstall a Pass-through Authentication Agent.

## I have an older tenant that was originally setup using AD FS.  We recently migrated to PTA but now are not seeing our UPN changes synchronizing to Azure AD.  Why are our UPN changes not being synchronized?

A: Under the following circumstances your on-premises UPN changes may not synchronize if:

- Your Azure AD tenant was created prior to June 15th 2015
- You initially were federated with your Azure AD tenant using AD FS for authentication
- You switched to having managed users using PTA as authentication

This is because the default behavior of tenants created prior to June 15th 2015 was to block UPN changes.  If you need to un-block UPN changes you need to run the following PowerShell cmdlt:  

`Set-MsolDirSyncFeature -Feature SynchronizeUpnForManagedUsers -Enable $True`

Tenants created after June 15th 2015 have the default behavior of synchronizing UPN changes.   



## Next steps
- [Current limitations](how-to-connect-pta-current-limitations.md): Learn which scenarios are supported and which ones are not.
- [Quick start](how-to-connect-pta-quick-start.md): Get up and running on Azure AD Pass-through Authentication.
- [Migrate from AD FS to Pass-through Authentication](https://github.com/Identity-Deployment-Guides/Identity-Deployment-Guides/blob/master/Authentication/Migrating%20from%20Federated%20Authentication%20to%20Pass-through%20Authentication.docx?raw=true) - A detailed guide to migrate from AD FS (or other federation technologies) to Pass-through Authentication.
- [Smart Lockout](../authentication/howto-password-smart-lockout.md): Learn how to configure the Smart Lockout capability on your tenant to protect user accounts.
- [Technical deep dive](how-to-connect-pta-how-it-works.md): Understand how the Pass-through Authentication feature works.
- [Troubleshoot](tshoot-connect-pass-through-authentication.md): Learn how to resolve common problems with the Pass-through Authentication feature.
- [Security deep dive](how-to-connect-pta-security-deep-dive.md): Get deep technical information on the Pass-through Authentication feature.
- [Azure AD Seamless SSO](how-to-connect-sso.md): Learn more about this complementary feature.
- [UserVoice](https://feedback.azure.com/forums/169401-azure-active-directory/category/160611-directory-synchronization-aad-connect): Use the Azure Active Directory Forum to file new feature requests.

