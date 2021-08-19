---
title: Deployment considerations for Azure AD Multi-Factor Authentication
description: Learn about deployment considerations and strategy for successful implementation of Azure AD Multi-Factor Authentication

services: multi-factor-authentication
ms.service: active-directory
ms.subservice: authentication
ms.topic: how-to
ms.date: 07/22/2021

ms.author: BaSelden
author: BarbaraSelden
manager: daveba
ms.reviewer: michmcla

ms.collection: M365-identity-device-management
---
# Plan an Azure Active Directory Multi-Factor Authentication deployment 

Azure Active Directory (Azure AD) Multi-Factor Authentication (MFA) helps safeguard access to data and applications, providing another layer of security by using a second form of authentication. Organizations can enable multifactor authentication with [Conditional Access](../conditional-access/overview.md) to make the solution fit their specific needs.

This deployment guide shows you how to plan and implement an [Azure AD MFA](concept-mfa-howitworks.md) roll-out.

## Prerequisites for deploying Azure AD MFA

Before you begin your deployment, ensure you meet the following prerequisites for your relevant scenarios.

| Scenario | Prerequisite |
|----------|--------------|
|**Cloud-only** identity environment with modern authentication | **No prerequisite tasks** |
|**Hybrid identity** scenarios | Deploy [Azure AD Connect](../hybrid/whatis-hybrid-identity.md) and synchronize user identities between the on-premises Active Directory Domain Services (AD DS) and Azure AD. |
| **On-premises legacy applications** published for cloud access| Deploy [Azure AD Application Proxy](../app-proxy/application-proxy-deployment-plan.md) |

## Choose authentication methods for MFA

There are many methods that can be used for a second-factor authentication. You can choose from the list of available authentication methods, evaluating each in terms of security, usability, and availability.

>[!IMPORTANT]
>Enable more than one MFA method so that users have a backup method available in case their primary method is unavailable. 
Methods include:

- [Windows Hello for Business](/windows/security/identity-protection/hello-for-business/hello-overview)
- [Microsoft Authenticator app](concept-authentication-authenticator-app.md)
- [FIDO2 security key (preview)](concept-authentication-passwordless.md#fido2-security-keys)
- [OATH hardware tokens (preview)](concept-authentication-oath-tokens.md#oath-hardware-tokens-preview)
- [OATH software tokens](concept-authentication-oath-tokens.md#oath-software-tokens)
- [SMS verification](concept-authentication-phone-options.md#mobile-phone-verification)
- [Voice call verification](concept-authentication-phone-options.md)

When choosing authenticating methods that will be used in your tenant consider the security and usability of these methods:

![Choose the right authentication method](media/concept-authentication-methods/authentication-methods.png)

To learn more about the strength and security of these methods and how they work, see the following resources:

- [What authentication and verification methods are available in Azure Active Directory?](concept-authentication-methods.md)
- [Video: Choose the right authentication methods to keep your organization safe](https://youtu.be/LB2yj4HSptc)

You can use this [PowerShell script](/samples/azure-samples/azure-mfa-authentication-method-analysis/azure-mfa-authentication-method-analysis/) to analyze users’ MFA configurations and suggest the appropriate MFA authentication method. 

For the best flexibility and usability, use the Microsoft Authenticator app. This authentication method provides the best user experience and multiple modes, such as passwordless, MFA push notifications, and OATH codes. The Microsoft Authenticator app also meets the National Institute of Standards and Technology (NIST) [Authenticator Assurance Level 2 requirements](../standards/nist-authenticator-assurance-level-2.md).

You can control the authentication methods available in your tenant. For example, you may want to block some of the least secure methods, such as SMS.

| Authentication method	| Manage from | Scoping |
|-----------------------|-------------|---------|
| Microsoft Authenticator (Push notification and passwordless phone sign-in)	| MFA settings or
Authentication methods policy | Authenticator passwordless phone sign-in can be scoped to users and groups |
| FIDO2 security key | Authentication methods policy | Can be scoped to users and groups |
| Software or Hardware OATH tokens | MFA settings |     |
| SMS verification | MFA settings | Manage SMS sign-in for primary authentication in authentication policy.	SMS sign-in can be scoped to users and groups. |
| Voice calls | Authentication methods policy |       |


## Plan Conditional Access policies

Azure AD MFA is enforced with Conditional Access policies. These policies allow you to prompt users for multifactor authentication when needed for security and stay out of users’ way when not needed.

![Conceptual Conditional Access process flow](media/howto-mfa-getstarted/conditional-access-overview-how-it-works.png)

In the Azure portal, you configure Conditional Access policies under **Azure Active Directory** > **Security** > **Conditional Access**.

To learn more about creating Conditional Access policies, see [Conditional Access policy to prompt for Azure AD MFA when a user signs in to the Azure portal](tutorial-enable-azure-mfa.md). This helps you to:

- Become familiar with the user interface
- Get a first impression of how Conditional Access works

For end-to-end guidance on Azure AD Conditional Access deployment, see the [Conditional Access deployment plan](../conditional-access/plan-conditional-access.md).

### Common policies for Azure AD MFA

Common use cases to require Azure AD MFA include:

- For [administrators](../conditional-access/howto-conditional-access-policy-admin-mfa.md)
- To [specific applications](tutorial-enable-azure-mfa.md)
- For [all users](../conditional-access/howto-conditional-access-policy-all-users-mfa.md)
- For [Azure management](../conditional-access/howto-conditional-access-policy-azure-management.md)
- From [network locations you don't trust](../conditional-access/untrusted-networks.md)

### Named locations

To manage your Conditional Access policies, the location condition of a Conditional Access policy enables you to tie access controls settings to the network locations of your users. We recommend to use [Named Locations](../conditional-access/location-condition.md) so that you can create logical groupings of IP address ranges or countries and regions. This creates a policy for all apps that blocks sign in from that named location. Be sure to exempt your administrators from this policy.

### Risk-based policies

If your organization uses [Azure AD Identity Protection](../identity-protection/overview-identity-protection.md) to detect risk signals, consider using [risk-based policies](../identity-protection/howto-identity-protection-configure-risk-policies.md) instead of named locations. Policies can be created to force password changes when there is a threat of compromised identity or require multifactor authentication when a sign-in is deemed [risky by events](../identity-protection/overview-identity-protection.md#risk-detection-and-remediation) such as leaked credentials, sign-ins from anonymous IP addresses, and more. 

Risk policies include:

- [Require all users to register for Azure AD MFA](../identity-protection/howto-identity-protection-configure-mfa-policy.md)
- [Require a password change for users that are high-risk](../identity-protection/howto-identity-protection-configure-risk-policies.md#enable-policies)
- [Require MFA for users with medium or high sign-in risk](../identity-protection/howto-identity-protection-configure-risk-policies.md#enable-policies)

### Convert users from per-user MFA to Conditional Access based MFA

If your users were enabled using per-user enabled and enforced Azure AD Multi-Factor Authentication the following PowerShell can assist you in making the conversion to Conditional Access based Azure AD Multi-Factor Authentication.

Run this PowerShell in an ISE window or save as a `.PS1` file to run locally. The operation can only be done by using the [MSOnline module](/powershell/module/msonline/?view=azureadps-1.0#msonline). 

```PowerShell
# Sets the MFA requirement state
function Set-MfaState {
    [CmdletBinding()]
    param(
        [Parameter(ValueFromPipelineByPropertyName=$True)]
        $ObjectId,
        [Parameter(ValueFromPipelineByPropertyName=$True)]
        $UserPrincipalName,
        [ValidateSet("Disabled","Enabled","Enforced")]
        $State
    )
    Process {
        Write-Verbose ("Setting MFA state for user '{0}' to '{1}'." -f $ObjectId, $State)
        $Requirements = @()
        if ($State -ne "Disabled") {
            $Requirement =
                [Microsoft.Online.Administration.StrongAuthenticationRequirement]::new()
            $Requirement.RelyingParty = "*"
            $Requirement.State = $State
            $Requirements += $Requirement
        }
        Set-MsolUser -ObjectId $ObjectId -UserPrincipalName $UserPrincipalName `
                     -StrongAuthenticationRequirements $Requirements
    }
}
# Disable MFA for all users
Get-MsolUser -All | Set-MfaState -State Disabled
```

## Plan user session lifetime

When planning your MFA deployment, it’s important to think about how frequently you would like to prompt your users. Asking users for credentials often seems like a sensible thing to do, but it can backfire. If users are trained to enter their credentials without thinking, they can unintentionally supply them to a malicious credential prompt.
Azure AD has multiple settings that determine how often you need to reauthenticate. Understand the needs of your business and users and configure settings that provide the best balance for your environment.

We recommend using devices with Primary Refresh Tokens (PRT) for improved end user experience and reduce the session lifetime with sign-in frequency policy only on specific business use cases.

For more information, see [Optimize reauthentication prompts and understand session lifetime for Azure AD MFA](concepts-azure-multi-factor-authentication-prompts-session-lifetime.md).

## Plan user registration

A major step in every MFA deployment is getting users registered to use MFA. Authentication methods such as Voice and SMS allow pre-registration, while others like the Authenticator App require user interaction. Administrators must determine how users will register their methods. 

### Combined registration for SSPR and Azure AD MFA
We recommend using the [combined registration experience](howto-registration-mfa-sspr-combined.md) for Azure AD MFA and [Azure AD self-service password reset (SSPR)](concept-sspr-howitworks.md). SSPR allows users to reset their password in a secure way using the same methods they use for Azure AD MFA. Combined registration is a single step for end users.

### Registration with Identity Protection
Azure AD Identity Protection contributes both a registration policy for and automated risk detection and remediation policies to the Azure AD MFA story. Policies can be created to force password changes when there is a threat of compromised identity or require MFA when a sign-in is deemed risky.
If you use Azure AD Identity Protection, [configure the Azure AD MFA registration policy](../identity-protection/howto-identity-protection-configure-mfa-policy.md) to prompt your users to register the next time they sign in interactively.

### Registration without Identity Protection
If you don’t have licenses that enable Azure AD Identity Protection, users are prompted to register the next time that MFA is required at sign-in. 
To require users to use MFA, you can use Conditional Access policies and target frequently used applications like HR systems. 
If a user’s password is compromised, it could be used to register for MFA, taking control of their account. We therefore recommend [securing the security registration process with conditional access policies](../conditional-access/howto-conditional-access-policy-registration.md) requiring trusted devices and locations. 
You can further secure the process by also requiring a [Temporary Access Pass](howto-authentication-temporary-access-pass.md). A time-limited passcode issued by an admin that satisfies strong authentication requirements and can be used to onboard other authentication methods, including Passwordless ones.

### Increase the security of registered users
If you have users registered for MFA using SMS or voice calls, you may want to move them to more secure methods such as the Microsoft Authenticator app. Microsoft now offers a public preview of functionality that allows you to prompt users to set up the Microsoft Authenticator app during sign-in. You can set these prompts by group, controlling who is prompted, enabling targeted campaigns to move users to the more secure method. 

### Plan recovery scenarios 
As mentioned before, ensure users are registered for more than one MFA method, so that if one is unavailable, they have a backup. 
If the user does not have a backup method available, you can: 

- Provide them a Temporary Access Pass so that they can manage their own authentication methods. You can also provide a Temporary Access Pass to enable temporary access to resources. 
- Update their methods as an administrator. To do so, select the user in the Azure portal, then select Authentication methods and update their methods.
User communications

It’s critical to inform users about upcoming changes, Azure AD MFA registration requirements, and any necessary user actions. 
We provide [communication templates](https://aka.ms/mfatemplates) and [end-user documentation](../user-help/security-info-setup-signin.md) to help draft your communications. Send users to [https://myprofile.microsoft.com](https://myprofile.microsoft.com/) to register by selecting the **Security Info** link on that page.

## Plan integration with on-premises systems

Applications that authenticate directly with Azure AD and have modern authentication (WS-Fed, SAML, OAuth, OpenID Connect) can make use of Conditional Access policies.
Some legacy and on-premises applications do not authenticate directly against Azure AD and require additional steps to use Azure AD MFA. You can integrate them by using Azure AD Application proxy or [Network policy services](/windows-server/networking/core-network-guide/core-network-guide#BKMK_optionalfeatures).

### Integrate with AD FS resources

We recommend migrating applications secured with Active Directory Federation Services (AD FS) to Azure AD. However, if you are not ready to migrate these to Azure AD, you can use the Azure MFA adapter with AD FS 2016 or newer.
If your organization is federated with Azure AD, you can [configure Azure AD MFA as an authentication provider with AD FS resources](/windows-server/identity/ad-fs/operations/configure-ad-fs-and-azure-mfa) both on-premises and in the cloud.  

### RADIUS clients and Azure AD MFA

For applications that are using RADIUS authentication, we recommend moving client applications to modern protocols such as SAML, Open ID Connect, or OAuth on Azure AD. If the application cannot be updated, then you can deploy [Network Policy Server (NPS) with the Azure MFA extension](howto-mfa-nps-extension.md). The network policy server (NPS) extension acts as an adapter between RADIUS-based applications and Azure AD MFA to provide a second factor of authentication.

#### Common integrations

Many vendors now support SAML authentication for their applications. When possible, we recommend federating these applications with Azure AD and enforcing MFA through Conditional Access. If your vendor doesn’t support modern authentication – you can use the NPS extension.
Common RADIUS client integrations include applications such as [Remote Desktop Gateways](howto-mfa-nps-extension-rdg.md) and [VPN servers](howto-mfa-nps-extension-vpn.md). 

Others might include:

- Citrix Gateway

  [Citrix Gateway](https://docs.citrix.com/en-us/advanced-concepts/implementation-guides/citrix-gateway-microsoft-azure.html#microsoft-azure-mfa-deployment-methods) supports both RADIUS and NPS extension integration, and a SAML integration.

- Cisco VPN
  - The Cisco VPN supports both RADIUS and [SAML authentication for SSO](../saas-apps/cisco-anyconnect.md).
  - By moving from RADIUS authentication to SAML, you can integrate the Cisco VPN without deploying the NPS extension.

- All VPNs

## Deploy Azure AD MFA

Your MFA rollout plan should include a pilot deployment followed by deployment waves that are within your support capacity. Begin your rollout by applying your Conditional Access policies to a small group of pilot users. After evaluating the effect on the pilot users, process used, and registration behaviors, you can either add more groups to the policy or add more users to the existing groups.

Follow the steps below:

1. Meet the necessary prerequisites
1. Configure chosen authentication methods
1. Configure your Conditional Access policies
1. Configure session lifetime settings
1. Configure Azure AD MFA registration policies 

## Manage Azure AD MFA
This section provides reporting and troubleshooting information for Azure AD MFA.

### Reporting and Monitoring

Azure AD has reports that provide technical and business insights, follow the progress of your deployment and check if your users are successful at sign-in with MFA. Have your business and technical application owners assume ownership of and consume these reports based on your organization’s requirements.

You can monitor authentication method registration and usage across your organization using the [Authentication Methods Activity dashboard](howto-authentication-methods-activity.md). This helps you understand what methods are being registered and how they're being used.

#### Sign-in report to review MFA events

The Azure AD sign-in reports include authentication details for events when a user is prompted for multi-factor authentication, and if any Conditional Access policies were in use. You can also use PowerShell for reporting on users registered for MFA. 

NPS extension and AD FS logs can be viewed from **Security** > **MFA** > **Activity report**.

For more information, and additional MFA reports, see [Review Azure AD Multi-Factor Authentication events](howto-mfa-reporting.md#view-the-azure-ad-sign-ins-report).

### Troubleshoot Azure AD MFA
See [Troubleshooting Azure AD MFA](https://support.microsoft.com/help/2937344/troubleshooting-azure-multi-factor-authentication-issues) for common issues.

## Next steps

[Deploy other identity features](../fundamentals/active-directory-deployment-plans.md)
