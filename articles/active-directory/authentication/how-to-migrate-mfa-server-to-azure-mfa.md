---
title: Migrate from MFA Server to Microsoft Entra multifactor authentication
description: Step-by-step guidance to migrate from MFA Server on-premises to Microsoft Entra multifactor authentication

services: multi-factor-authentication
ms.service: active-directory
ms.subservice: authentication
ms.custom: has-azure-ad-ps-ref
ms.topic: how-to
ms.date: 09/28/2023

ms.author: justinha
author: Gargi-Sinha
manager: martinco
ms.reviewer: michmcla

ms.collection: M365-identity-device-management
---
# Migrate from MFA Server to Microsoft Entra multifactor authentication

Multifactor authentication is important to securing your infrastructure and assets from bad actors. Microsoft Entra multifactor authentication Server (MFA Server) isn't available for new deployments and will be deprecated. Customers who are using MFA Server should move to using cloud-based Microsoft Entra multifactor authentication.

In this article, we assume that you have a hybrid environment where:

- You're using MFA Server for multifactor authentication.
- You're using federation on Microsoft Entra ID with Active Directory Federation Services (AD FS) or another identity provider federation product.
  - While this article is scoped to AD FS, similar steps apply to other identity providers.
- Your MFA Server is integrated with AD FS. 
- You might have applications using AD FS for authentication.

There are multiple possible end states to your migration, depending on your goal.

| <br> | Goal: Decommission MFA Server ONLY | Goal: Decommission MFA Server and move to Microsoft Entra authentication | Goal: Decommission MFA Server and AD FS |
|------|------------------------------------|-------------------------------------------------------------------|-----------------------------------------|
|MFA provider | Change MFA provider from MFA Server to Microsoft Entra multifactor authentication. | Change MFA provider from MFA Server to Microsoft Entra multifactor authentication. |    Change MFA provider from MFA Server to Microsoft Entra multifactor authentication. |
|User authentication  |Continue to use federation for Microsoft Entra authentication. | Move to Microsoft Entra ID with Password Hash Synchronization (preferred) or Passthrough Authentication **and** Seamless single sign-on (SSO).| Move to Microsoft Entra ID with Password Hash Synchronization (preferred) or Passthrough Authentication **and** SSO. |
|Application authentication | Continue to use AD FS authentication for your applications. | Continue to use AD FS authentication for your applications. | Move apps to Microsoft Entra ID before migrating to Microsoft Entra multifactor authentication. |

If you can, move both your multifactor authentication and your user authentication to Azure. For step-by-step guidance, see [Moving to Microsoft Entra multifactor authentication and Microsoft Entra user authentication](how-to-migrate-mfa-server-to-mfa-user-authentication.md). 

If you can't move your user authentication, see the step-by-step guidance for [Moving to Microsoft Entra multifactor authentication with federation](how-to-migrate-mfa-server-to-mfa-with-federation.md).

## Prerequisites

- AD FS environment (required if you aren't migrating all your apps to Microsoft Entra prior to migrating MFA Server)
  - Upgrade to AD FS for Windows Server 2019, Farm behavior level (FBL) 4. This upgrade enables you to select authentication provider based on group membership for a more seamless user transition. While it's possible to migrate while on AD FS for Windows Server 2016 FBL 3, it isn't as seamless for users. During the migration, users are prompted to select an authentication provider (MFA Server or Microsoft Entra multifactor authentication) until the migration is complete. 
- Permissions
  - Enterprise administrator role in Active Directory to configure AD FS farm for Microsoft Entra multifactor authentication
  - Global administrator role in Microsoft Entra ID to configure Microsoft Entra ID by using PowerShell


## Considerations for all migration paths

Migrating from MFA Server to Microsoft Entra multifactor authentication involves more than just moving the registered MFA phone numbers. 
Microsoft's MFA server can be integrated with many systems, and you must evaluate how these systems are using MFA Server to understand the best ways to integrate with Microsoft Entra multifactor authentication. 

### Migrating MFA user information

Common ways to think about moving users in batches include moving them by regions, departments, or roles such as administrators. You should move user accounts iteratively, starting with test and pilot groups, and make sure you have a rollback plan in place. 

You can use the [MFA Server Migration Utility](how-to-mfa-server-migration-utility.md) to synchronize MFA data stored in the on-premises Azure MFA Server to Microsoft Entra multifactor authentication and use [Staged Rollout](../hybrid/connect/how-to-connect-staged-rollout.md) to reroute users to Azure MFA. Staged Rollout helps you test without making any changes to your domain federation settings.

To help users to differentiate the newly added account from the old account linked to the MFA Server, make sure the Account name for the Mobile App on the MFA Server is named in a way to distinguish the two accounts. 
For example, the Account name that appears under Mobile App on the MFA Server has been renamed to **On-Premises MFA Server**. 
The account name on Microsoft Authenticator will change with the next push notification to the user. 

Migrating phone numbers can also lead to stale numbers being migrated and make users more likely to stay on phone-based MFA instead of setting up more secure methods like Microsoft Authenticator in passwordless mode. 
We therefore recommend that regardless of the migration path you choose, that you have all users register for [combined security information](howto-registration-mfa-sspr-combined.md).

#### Migrating hardware security keys

Microsoft Entra ID provides support for OATH hardware tokens. You can use the [MFA Server Migration Utility](how-to-mfa-server-migration-utility.md) to synchronize MFA settings between MFA Server and Microsoft Entra multifactor authentication and use [Staged Rollout](../hybrid/connect/how-to-connect-staged-rollout.md) to test user migrations without changing domain federation settings. 

If you only want to migrate OATH hardware tokens, you need to [upload tokens to Microsoft Entra ID by using a CSV file](concept-authentication-oath-tokens.md#oath-hardware-tokens-preview), commonly referred to as a "seed file". 
The seed file contains the secret keys, token serial numbers, and other necessary information needed to upload the tokens into Microsoft Entra ID. 

If you no longer have the seed file with the secret keys, it isn't possible to export the secret keys from MFA Server. 
If you no longer have access to the secret keys, contact your hardware vendor for support.

The MFA Server Web Service SDK can be used to export the serial number for any OATH tokens assigned to a given user. 
You can use this information along with the seed file to import the tokens into Microsoft Entra ID and assign the OATH token to the specified user based on the serial number. 
The user will also need to be contacted at the time of import to supply OTP information from the device to complete the registration. 
Refer to the help file topic **GetUserInfo** > **userSettings** > **OathTokenSerialNumber** in multifactor authentication Server on your MFA Server. 

### More migrations

The decision to migrate from MFA Server to Microsoft Entra multifactor authentication opens the door for other migrations. Completing more migrations depends upon many factors, including specifically:

- Your willingness to use Microsoft Entra authentication for users
- Your willingness to move your applications to Microsoft Entra ID

Because MFA Server is integral to both application and user authentication, consider moving both of those functions to Azure as a part of your MFA migration, and eventually decommission AD FS. 

Our recommendations: 

- Use Microsoft Entra ID for authentication as it enables more robust security and governance
- Move applications to Microsoft Entra ID if possible

To select the best user authentication method for your organization, see [Choose the right authentication method for your Microsoft Entra hybrid identity solution](../hybrid/connect/choose-ad-authn.md). 
We recommend that you use Password Hash Synchronization (PHS).

### Passwordless authentication

As part of enrolling users to use Microsoft Authenticator as a second factor, we recommend you enable passwordless phone sign-in as part of their registration. For more information, including other passwordless methods such as FIDO2 security keys and Windows Hello for Business, visit [Plan a passwordless authentication deployment with Microsoft Entra ID](howto-authentication-passwordless-deployment.md#plan-for-and-deploy-microsoft-authenticator).

### Microsoft Identity Manager self-service password reset 

Microsoft Identity Manager (MIM) SSPR can use MFA Server to invoke SMS one-time passcodes as part of the password reset flow. 
MIM can't be configured to use Microsoft Entra multifactor authentication. 
We recommend you evaluate moving your SSPR service to Microsoft Entra SSPR.
You can use the opportunity of users registering for Microsoft Entra multifactor authentication to use the combined registration experience to register for Microsoft Entra SSPR.

If you can't move your SSPR service, or you leverage MFA Server to invoke MFA requests for Privileged Access Management (PAM) scenarios, we recommend you update to an [alternate 3rd party MFA option](/microsoft-identity-manager/working-with-custommfaserver-for-mim).

<a name='radius-clients-and-azure-ad-multi-factor-authentication'></a>

### RADIUS clients and Microsoft Entra multifactor authentication

MFA Server supports RADIUS to invoke multifactor authentication for applications and network devices that support the protocol. 
If you're using RADIUS with MFA Server, we recommend moving client applications to modern protocols such as SAML, OpenID Connect, or OAuth on Microsoft Entra ID. 
If the application can't be updated, then you can deploy Network Policy Server (NPS) with the Microsoft Entra multifactor authentication extension. 
The network policy server (NPS) extension acts as an adapter between RADIUS-based applications and Microsoft Entra multifactor authentication to provide a second factor of authentication. This "adapter" allows you to move your RADIUS clients to Microsoft Entra multifactor authentication and decommission your MFA Server.

#### Important considerations

There are limitations when using NPS for RADIUS clients, and we recommend evaluating any RADIUS clients to determine if you can upgrade them to modern authentication protocols. 
Check with the service provider for supported product versions and their capabilities. 

- The NPS extension doesn't use Microsoft Entra Conditional Access policies. If you stay with RADIUS and use the NPS extension, all authentication requests going to NPS will require the user to perform MFA.
- Users must register for Microsoft Entra multifactor authentication prior to using the NPS extension. Otherwise, the extension fails to authenticate the user, which can generate help desk calls.
- When the NPS extension invokes MFA, the MFA request is sent to the user's default MFA method. 
  - Because the sign-in happens on non-Microsoft applications, the user often can't see visual notification that multifactor authentication is required and that a request has been sent to their device.
  - During the multifactor authentication requirement, the user must have access to their default authentication method to complete the requirement. They can't choose an alternative method. Their default authentication method will be used even if it's disabled in the tenant authentication methods and multifactor authentication policies.
  - Users can change their default multifactor authentication method in the Security Info page (aka.ms/mysecurityinfo).
- Available MFA methods for RADIUS clients are controlled by the client systems sending the RADIUS access requests.
  - MFA methods that require user input after they enter a password can only be used with systems that support access-challenge responses with RADIUS. Input methods might include OTP, hardware OATH tokens or Microsoft Authenticator.
  - Some systems might limit available multifactor authentication methods to Microsoft Authenticator push notifications and phone calls.

>[!NOTE]
>The password encryption algorithm used between the RADIUS client and the NPS system, and the input methods the client can use affect which authentication methods are available. For more information, see [Determine which authentication methods your users can use](howto-mfa-nps-extension.md). 

Common RADIUS client integrations include applications such as [Remote Desktop Gateways](howto-mfa-nps-extension-rdg.md) and [VPN Servers](howto-mfa-nps-extension-vpn.md). 
Others might include:

- Citrix Gateway
  - [Citrix Gateway](https://docs.citrix.com/en-us/citrix-gateway) supports both RADIUS and NPS extension integration, and a SAML integration.
- Cisco VPN
  - The Cisco VPN supports both RADIUS and [SAML authentication for SSO](../saas-apps/cisco-anyconnect.md).
  - By moving from RADIUS authentication to SAML, you can integrate the Cisco VPN without deploying the NPS extension.
- All VPNs
  - We recommend federating your VPN as a SAML app if possible. This federation will allow you to use Conditional Access. For more information, see a [list of VPN vendors that are integrated into the Microsoft Entra ID](../manage-apps/secure-hybrid-access.md#secure-hybrid-access-through-azure-ad-partner-integrations) App gallery.


### Resources for deploying NPS

- [Adding new NPS infrastructure](/windows-server/networking/technologies/nps/nps-top)
- [NPS deployment best practices](https://www.youtube.com/watch?v=qV9wddunpCY)
- [Microsoft Entra multifactor authentication NPS extension health check script](/samples/azure-samples/azure-mfa-nps-extension-health-check/azure-mfa-nps-extension-health-check/)
- [Integrating existing NPS infrastructure with Microsoft Entra multifactor authentication](howto-mfa-nps-extension-vpn.md)

## Next steps

- [Moving to Microsoft Entra multifactor authentication with federation](how-to-migrate-mfa-server-to-mfa-with-federation.md)
- [Moving to Microsoft Entra multifactor authentication and Microsoft Entra user authentication](how-to-migrate-mfa-server-to-mfa-user-authentication.md)
- [How to use the MFA Server Migration Utility](how-to-mfa-server-migration-utility.md)
