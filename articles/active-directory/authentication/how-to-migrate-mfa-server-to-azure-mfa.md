---
title: Migrate from Azure MFA Server to Azure multi-factor authentication - Azure Active Directory
description: Step-by-step guidance to migrate from Azure MFA Server on-premises to Azure multi-factor authentication

services: multi-factor-authentication
ms.service: active-directory
ms.subservice: authentication
ms.topic: how-to
ms.date: 06/22/2021

ms.author: BaSelden
author: BarbaraSelden
manager: daveba
ms.reviewer: michmcla

ms.collection: M365-identity-device-management
---
# Migrate from Azure MFA Server to Azure multi-factor authentication

Multi-factor authentication (MFA) is important to securing your infrastructure and assets from bad actors. Azure MFA Server isn’t available for new deployments and will be deprecated. Customers who are using MFA Server should move to using cloud-based Azure Active Directory (Azure AD) multi-factor authentication. 
In this documentation, we assume that you have a hybrid environment where:

- You are using MFA Server for MFA.
- You are using federation on Azure AD with Active Directory Federation Services (AD FS) or another identity provider federation product.
  - While this article is scoped to AD FS, similar steps apply to other identity providers.
- Your MFA Server is integrated with AD FS. 
- You might have applications using AD FS for authentication.

There are multiple possible end states to your migration, depending on your goal.

| <br> | Goal: Decommission MFA Server ONLY | Goal: Decommission MFA Server and move to Azure AD Authentication | Goal: Decommission MFA Server and AD FS |
|------|------------------------------------|-------------------------------------------------------------------|-----------------------------------------|
|MFA provider | Change MFA provider from MFA Server to Azure AD MFA. | Change MFA provider from MFA Server to Azure AD MFA. |	Change MFA provider from MFA Server to Azure AD MFA. |
|User authentication  |Continue to use federation for Azure AD authentication. | Move to Azure AD with Password Hash Synchronization (preferred) or Passthrough Authentication **and** seamless single sign-on.| Move to Azure AD with Password Hash Synchronization (preferred) or Passthrough Authentication **and** seamless single sign-on. |
|Application authentication | Continue to use AD FS authentication for your applications. | Continue to use AD FS authentication for your applications. | Move apps to Azure AD before migrating to Azure MFA. |

If you can, move both your MFA and your user authentication to Azure. For step-by-step guidance, see [Moving to Azure AD MFA and Azure AD user authentication](how-to-migrate-mfa-server-to-azure-mfa-user-authentication.md). 

If you can’t move your user authentication, see the step-by-step guidance for [Moving to Azure AD MFA with federation](how-to-migrate-mfa-server-to-azure-mfa-with-federation.md).

## Prerequisites

- AD FS environment (required if you are not migrating all your apps to Azure AD prior to migrating MFA)
  - Upgrade to AD FS for Windows Server 2019, Farm behavior level (FBL) 4. This enables you to select authentication provider based on group membership for a more seamless user transition. While it is possible to migrate while on AD FS for Windows Server 2016 FBL 3, it is not as seamless for users. During the migration users will be prompted to select an authentication provider (MFA Server or Azure MFA) until the migration is complete. 
- Permissions
  - Enterprise administrator role in Active Directory to configure AD FS farm for Azure AD MFA
  - Global administrator role in Azure AD to perform configuration of Azure AD using Azure AD PowerShell


## Considerations for all migration paths

Migrating from MFA Server to Azure AD MFA involves more than just moving the registered MFA phone numbers. 
Microsoft’s MFA server can be integrated with many systems, and you must evaluate how these systems are using MFA Server to understand the best ways to integrate with Azure AD MFA. 

### Migrating MFA user information

Common ways to think about moving users in batches include moving them by regions, departments, or roles such as administrators. 
Whichever strategy you choose, ensure that you move users iteratively, starting with test and pilot groups, and that you have a rollback plan in place. 

While you can migrate users’ registered MFA phone numbers and hardware tokens, you cannot migrate device registrations such as their Microsoft Authenticator app settings. 
Users will need to register and add a new account on the Authenticator app and remove the old account. 

To help users to differentiate the newly added account from the old account linked to the MFA Server, make sure the Account name for the Mobile App on the MFA Server is named in a way to distinguish the two accounts. 
For example, the Account name that appears under Mobile App on the MFA Server has been renamed to OnPrem MFA Server. 
The account name on the Authenticator App will change with the next push notification to the user. 

Migrating phone numbers can also lead to stale numbers being migrated and make users more likely to stay on phone-based MFA instead of setting up more secure methods like Microsoft Authenticator in passwordless mode. 
We therefore recommend that regardless of the migration path you choose, that you have all users register for [combined security information](howto-registration-mfa-sspr-combined.md).


#### Migrating hardware security keys

Azure AD provides support for OATH hardware tokens. 
In order to migrate the tokens from MFA Server to Azure AD MFA, the [tokens must be uploaded into Azure AD using a CSV file](concept-authentication-oath-tokens.md#oath-hardware-tokens-preview), commonly referred to as a "seed file". 
The seed file contains the secret keys and token serial numbers, as well as other necessary information needed to upload the tokens into Azure AD. 

If you no longer have the seed file with the secret keys, it is not possible to export the secret keys from MFA Server. 
If you no longer have access to the secret keys, please contact your hardware vendor for support.

The MFA Server Web Service SDK can be used to export the serial number for any OATH tokens assigned to a given user. 
Using this information along with the seed file, IT admins can import the tokens into Azure AD and assign the OATH token to the specified user based on the serial number. 
The user will also need to be contacted at the time of import to supply OTP information from the device to complete the registration. 
Please refer to the GetUserInfo > userSettings > OathTokenSerialNumber topic in the Multi-Factor Authentication Server help file on your MFA Server. 


### Additional migrations

The decision to migrate from MFA Server to Azure MFA opens the door for other migrations. Completing additional migrations depends upon many factors, including specifically:

- Your willingness to use Azure AD authentication for users
- Your willingness to move your applications to Azure AD

As MFA Server is deeply integrated with both applications and user authentication, you may want to consider moving both of those functions to Azure as a part of your MFA migration, and eventually decommission AD FS. 

Our recommendations: 

- Use Azure AD for authentication as it enables more robust security and governance
- Move applications to Azure AD if possible

To select the user authentication method best for your organization, see [Choose the right authentication method for your Azure AD hybrid identity solution](../hybrid/choose-ad-authn.md). 
We recommend that you use Password Hash Synchronization (PHS).

### Passwordless authentication

As part of enrolling users to use Microsoft Authenticator as a second factor, we recommend you enable passwordless phone sign-in as part of their registration. For more information, including other passwordless methods such as FIDO and Windows Hello for Business, visit [Plan a passwordless authentication deployment with Azure AD](howto-authentication-passwordless-deployment.md#plan-for-and-deploy-the-microsoft-authenticator-app).

### Microsoft Identity Manager self-service password reset 

Microsoft Identity Manager (MIM) SSPR can use MFA Server to invoke SMS one-time passcodes as part of the password reset flow. 
MIM cannot be configured to use Azure MFA. 
We recommend you evaluate moving your SSPR service to Azure AD SSPR.

You can use the opportunity of users registering for Azure MFA to use the combined registration experience to register for Azure AD SSPR.


### RADIUS clients and Azure AD MFA

MFA Server supports RADIUS to invoke MFA for applications and network devices that support the protocol. 
If you are using RADIUS with MFA Server, we recommend moving client applications to modern protocols such as SAML, Open ID Connect, or OAuth on Azure AD. 
If the application cannot be updated, then you can deploy Network Policy Server (NPS) with the Azure MFA extension. 
The network policy server (NPS) extension acts as an adapter between RADIUS-based applications and Azure AD MFA to provide a second factor of authentication. This allows you to move your RADIUS clients to Azure MFA and decommission your MFA Server.

#### Important considerations

There are limitations when using NPS for RADIUS clients, and we recommend evaluating any RADIUS clients to determine if you can upgrade them to modern authentication protocols. 
Check with the service provider for supported product versions and their capabilities. 

- The NPS extension does not use Azure AD Conditional Access policies. If you stay with RADIUS and use the NPS extension, all authentication requests going to NPS will require the user to perform MFA.
- Users must register for Azure AD MFA prior to using the NPS extension. Otherwise, the extension fails to authenticate the user, which can generate help desk calls.
- When the NPS extension invokes MFA, the MFA request is sent to the user's default MFA method. 
  - Because the sign-in happens on 3rd party applications, it is unlikely that the user will see visual notification that MFA is required and that a request has been sent to their device.
  - During the MFA requirement, the user must have access to their default authentication method to complete the MFA requirement. They cannot choose an alternative method. Their default authentication method will be used even if it's been disabled in the tenant authentication methods and MFA policies.
  - Users can change their default MFA method in the Security Info page (aka.ms/mysecurityinfo).
- Available MFA methods for RADIUS clients are controlled by the client systems sending the RADIUS access requests.
  - MFA methods that require user input after they enter a password can only be used with systems that support access-challenge responses with RADIUS. Input methods might include OTP, hardware OATH tokens or the Microsoft Authenticator application.
  - Some systems might limit available MFA methods to Microsoft Authenticator push notifications and phone calls.


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
  - We recommend federating your VPN as a SAML app if possible. This will allow you to use Conditional Access. For more information, see a [list of VPN vendors that are integrated into the Azure AD](../manage-apps/secure-hybrid-access.md#sha-through-vpn-and-sdp-applications) App gallery.


### Resources for deploying NPS

- [Adding new NPS infrastructure](/windows-server/networking/technologies/nps/nps-top)
- [NPS deployment best practices](https://www.youtube.com/watch?v=qV9wddunpCY)
- [Azure MFA NPS extension health check script](/samples/azure-samples/azure-mfa-nps-extension-health-check/azure-mfa-nps-extension-health-check/)
- [Integrating existing NPS infrastructure with Azure AD MFA](howto-mfa-nps-extension-vpn.md)

## Next steps

- [Moving to Azure AD MFA with federation](how-to-migrate-mfa-server-to-azure-mfa-with-federation.md)
- [Moving to Azure AD MFA and Azure AD user authentication](how-to-migrate-mfa-server-to-azure-mfa-user-authentication.md)


