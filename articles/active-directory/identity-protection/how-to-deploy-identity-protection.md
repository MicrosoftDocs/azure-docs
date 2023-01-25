---
title: Plan an Azure AD Identity Protection deployment
description: Deploy Azure Active Directory Identity Protection

services: active-directory
ms.service: active-directory
ms.subservice: identity-protection
ms.topic: how-to
ms.date: 01/25/2023

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: jhenders, tracyyu, chuqiaoshi

ms.collection: M365-identity-device-management
---
# Plan an Identity Protection deployment

Azure Active Directory (Azure AD) Identity Protection enhances other capabilities like Conditional Access, self-service password reset, and logs. 

This deployment plan extends concepts introduced in the [Conditional Access deployment plan](../conditional-access/plan-conditional-access.md).

## Prerequisites

* A working Azure AD tenant with Azure AD Premium P2, or trial license enabled. If needed, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
   * Azure AD Premium P2 is required to include Identity Protection risk in Conditional Access policies.
* Conditional Access policies can be created or modified by anyone assigned the following roles:
   * [Conditional Access Administrator](../roles/permissions-reference.md#conditional-access-administrator)
   * [Security Administrator](../roles/permissions-reference.md#security-administrator)
   * [Global Administrator](../roles/permissions-reference.md#global-administrator)
* Identity Protection and Conditional Access policies and configuration can be read by anyone assigned the following roles:
   * [Security Reader](../roles/permissions-reference.md#security-reader)
   * [Global Reader](../roles/permissions-reference.md#global-reader)
* Identity Protection can be managed by anyone assigned the following roles:
   * [Security Operator](../roles/permissions-reference.md#security-operator)
   * [Security Administrator](../roles/permissions-reference.md#security-administrator)
   * [Global Administrator](../roles/permissions-reference.md#global-administrator)
* A test user (non-administrator) that allows you to verify policies work as expected before you affect real users. If you need to create a user, see [Quickstart: Add new users to Azure Active Directory](../fundamentals/add-users-azure-active-directory.md).
* A group that the non-administrator user is a member of. If you need to create a group, see [Create a group and add members in Azure Active Directory](../fundamentals/active-directory-groups-create-azure-portal.md).

### Engage the right stakeholders

When technology projects fail, they typically do so due to mismatched expectations on affect, outcomes, and responsibilities. To avoid these pitfalls, ensure that you’re engaging the right stakeholders and that stakeholder roles in the project are well understood by documenting the stakeholders, their project input, and accountability. 

### Communication plan

Communication is critical to the success of any new functionality. You should proactively communicate with your users how their [experience](concept-identity-protection-user-experience.md) will change, when it will change, and how to get support if they experience issues.

## Step 1: Review existing reports

It's important to understand your current Identity Protection reports before deploying risk based Conditional Access policies. This review is to give you an understanding of your environment, investigate suspicious behavior you may have missed and to dismiss or confirm safe user who you have determined aren't at risk. We recommend allowing users to self-remediate through policies that will be discussed in [Step 3](#step-3-configure-your-policies).

### Existing risk detections

If your users haven't been remediating risk, then they may have accumulated risk. Users who reset their password on-premises don't remediate risk. Make sure before you dismiss risks, you've determined they aren't really at risk by [investigating risk detections](howto-identity-protection-investigate-risk.md). After investigating, you can remediate user risk by following the steps in the article, [Remediate risks and unblock users](howto-identity-protection-remediate-unblock.md). Make bulk changes to user risk by following the samples in the article, [Azure Active Directory Identity Protection and the Microsoft Graph PowerShell](howto-identity-protection-graph-api.md).

## Step 2: Plan for Conditional Access risk policies

Conditional Access brings signals together to make decisions and enforce organizational policies. Conditional access sign-in risk and user policies work to automate threat detections and allow users to self-remediate risk.

### Policy exclusions

[!INCLUDE [active-directory-policy-exclusions](../../../includes/active-directory-policy-exclude-user.md)]

### Related features

For users to self-remediate risk though, they must register for Azure AD Multifactor Authentication before they become risky. For more information see the article, [Plan an Azure Active Directory Multi-Factor Authentication deployment](../authentication/howto-mfa-getstarted.md).

Other features that you may wish to consider include:

- [Plan a passwordless authentication deployment in Azure Active Directory](../authentication/howto-authentication-passwordless-deployment.md)
- [Plan an Azure Active Directory self-service password reset deployment](../authentication/howto-sspr-deployment.md)
- [Plan and deploy on-premises Azure Active Directory Password Protection](../authentication/howto-password-ban-bad-on-premises-deploy.md)

### Known network locations

It's important to configure named locations in Conditional Access and add your VPN ranges to Defender for Cloud Apps. Sign-ins from named locations, marked as trusted or known, improve the accuracy of Azure AD Identity Protection's risk calculation. These sign-ins lower a user's risk when they authenticate from a location marked as trusted or known. This practice will reduce false positives for some detections in your environment.

### Report only mode 

Report-only mode is a Conditional Access policy state that allows administrators to evaluate the effect of Conditional Access policies before enforcing them in their environment.

## Step 3: Configure your policies

### Identity Protection MFA registration policy

Use the Identity Protection multifactor authentication registration policy to help get your users registered for Azure AD Multifactor Authentication before they need to use it. Follow the steps in the article [How To: Configure the Azure AD multifactor authentication registration policy](howto-identity-protection-configure-mfa-policy.md) to enable this policy.

### Conditional Access sign-in risk policy

Most users have a normal behavior that can be tracked, when they fall outside of this norm it could be risky to allow them to just sign in. You may want to block that user or maybe just ask them to perform multi-factor authentication to prove that they're really who they say they are. You may want to start by scoping these policies to admins only. 

The article [Common Conditional Access policy: Sign-in risk-based multifactor authentication](../conditional-access/howto-conditional-access-policy-risk.md) provides guidance to create a sign-in risk policy.

### Conditional Access user risk

Microsoft works with researchers, law enforcement, various security teams at Microsoft, and other trusted sources to find leaked username and password pairs. When these vulnerable users are detected, we recommend requiring users perform multifactor authentication then reset their password.

The article [Common Conditional Access policy: User risk-based password change](../conditional-access/howto-conditional-access-policy-risk-user.md) provides guidance to create a user risk policy that requires password change.

### Migrating from older Identity Protection policies

If you already deployed legacy Identity Protection risk policies we recommend migrating them to Conditional Access policies. Conditional Access policies provide the following benefits: 

- Enhanced diagnostic data
- Report-only mode integration
- Graph API support
- Ability to use more Conditional Access attributes like sign-in frequency in the policy

For more information, see the section [Migrate risk policies from Identity Protection to Conditional Access](howto-identity-protection-configure-risk-policies.md#migrate-risk-policies-from-identity-protection-to-conditional-access).

## Step 4: Monitoring and continuous operational needs

### Enable notifications

[Enable notifications](howto-identity-protection-configure-notifications.md) so you can respond when a user is flagged as at risk so you can start investigating immediately. You can also set up weekly digest emails giving you an overview of risk for that week.

### Monitor and investigate

The [Identity Protection workbook](../reports-monitoring/workbook-risk-analysis.md) can help monitor and look for patterns in your tenant. Monitor this workbook for trends and also Conditional Access Report Only mode results to see if there are any changes that need to be made, for example, additions to named locations.
 
Microsoft Defender for Cloud Apps provides an investigation framework organizations can use as a starting point. For more information, see the article [How to investigate anomaly detection alerts] (/defender-cloud-apps/investigate-anomaly-alerts).

You can also use the Identity Protection APIs to [export risk information](howto-export-risk-data.md) to other tools, so your security team can monitor and alert on risk events. 

During testing, you might want to [simulate some threats](howto-identity-protection-simulate-risk.md) to test your investigation processes.

## Step 5: Enable Conditional Access policies

After you've completed all your analysis, evaluated policies in report only mode, and you have your stakeholders on board it's time to turn on your Conditional Access risk policies.

## Next steps

[What is risk?](concept-identity-protection-risks.md)
