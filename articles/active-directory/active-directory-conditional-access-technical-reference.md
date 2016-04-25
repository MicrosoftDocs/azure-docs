
<properties
	pageTitle="Technical reference: conditional access to Azure AD apps | Microsoft Azure"
	description="With Conditional access control, Azure Active Directory checks the specific conditions you pick when authenticating the user and before allowing access to the application. Once those conditions are met, the user is authenticated and allowed access to the application."
    services="active-directory"
	documentationCenter=""
	authors="femila"
	manager="stevenpo"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.devlang="na"
	ms.topic="article"
    ms.tgt_pltfrm="na"
    ms.workload="identity" 
	ms.date="02/11/2016"
	ms.author="femila"/>

# Technical reference: conditional access to Azure AD apps

## Services enabled with conditional access
Conditional Access rules are supported across various Azure AD application types. This list includes:

- Federated applications from the Azure AD application gallery
- Password SSO applications from the Azure AD application gallery
- Applications registered with the Azure Application Proxy
- Developed line of business and multi-tenant applications registered with Azure AD
- Visual Studio Online
- Azure Remote App

## Enable access rules

Each rule can be enabled or disabled on a per application bases. When rules are ‘ON’ they will be enabled and enforced for users accessing the application. When they are ‘OFF’ they will not be used and will not impact the users sign in experience.

## Applying rules to specific users
The rules can be applied to specific sets of users based on security group by setting ‘Apply To’. ‘Apply To’ can be set to ‘All Users’ or ‘Groups. When set to ‘All Users’ the rules will apply to any user with access to the application. The ‘Groups’ option allows specific security and distribution groups to be selected, rules will only be enforced for these groups.
  When first deploying a rule it is common to first apply it a limited set of users, that are members of a piloting groups. Once complete the rule can be applied to “All Users” this will cause the rule to be enforce for all users in the organization.
Select groups may also be exempted from policy using the ‘Except’ option. Any members of these groups will be exempted even if they appear in an included group.

## “At work” networks

Conditional Access rules that use an “At work” network, rely on trusted IP ranges that have been configured in Azure AD. These rules include:

- Require multi-factor authentication when not at work
- Block access when not at work

Trusted IP ranges can be configured in the [multi-factor authentication configuration page](../multi-factor-authentication/multi-factor-authentication-whats-next.md). Conditional Access policy will use the configured ranges on each authentication request and token issuance to evaluate rules. The inside corpnet claim is not used since it is not available for longer lived sessions, such as refresh tokens in mobile applications.

## Per-application rules
Rules are configured per application allowing the high value services to be secured without impacting access to other services. Conditional Access rules can be configured on a the ‘Configure’ Tab of the application. 

The currently offered rules are:

- Require multi-factor authentication
 - All users that the policy is applied to will be required to have performed multi-factor authentication at least once.
- Require multi-factor authentication when not at work
 - All users that the policy is applied to will be required to have performed multi-factor authentication at least once if they access the service from a remote location. If they move from a work to remote location, they will be require to perform multifactor authentication when accessing the service.
- Block access when not at work 
 - All users that the policy is applied to will be block when accessing the service from a remote location. If they move from a work to remote location. The will be allowed access when at a work location.


