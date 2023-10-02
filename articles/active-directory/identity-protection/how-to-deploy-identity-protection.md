---
title: Plan a Microsoft Entra ID Protection deployment
description: Deploy Microsoft Entra ID Protection

services: active-directory
ms.service: active-directory
ms.subservice: identity-protection
ms.topic: how-to
ms.date: 03/10/2023

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: jhenders, tracyyu, chuqiaoshi

ms.collection: M365-identity-device-management
---
# Plan an Identity Protection deployment

Microsoft Entra ID Protection detects identity-based risks, reports them, and allows administrators to investigate and remediate these risks to keep organizations safe and secure. The risks can be further fed into tools like Conditional Access to make access decisions or fed back to a security information and event management (SIEM) tool for further investigation. 

:::image type="content" source="media/how-to-deploy-identity-protection/identity-protection-overview.png" alt-text="Screenshot showing the Identity Protection Overview page showing some risky users and sign-ins." lightbox="media/how-to-deploy-identity-protection/identity-protection-overview.png":::

This deployment plan extends concepts introduced in the [Conditional Access deployment plan](../conditional-access/plan-conditional-access.md).

## Prerequisites

* A working Microsoft Entra tenant with Microsoft Entra ID P2, or trial license enabled. If needed, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
   * Microsoft Entra ID P2 is required to include Identity Protection risk in Conditional Access policies.
* Administrators who interact with Identity Protection must have one or more of the following role assignments depending on the tasks they're performing. To follow the [Zero Trust principle of least privilege](/security/zero-trust/), consider using [Privileged Identity Management (PIM)](../privileged-identity-management/pim-configure.md) to just-in-time activate privileged role assignments.
   * Read Identity Protection and Conditional Access policies and configurations 
      * [Security Reader](../roles/permissions-reference.md#security-reader)
      * [Global Reader](../roles/permissions-reference.md#global-reader)
   * Manage Identity Protection 
      * [Security Operator](../roles/permissions-reference.md#security-operator)
      * [Security Administrator](../roles/permissions-reference.md#security-administrator)
   * Create or modify Conditional Access policies 
      * [Conditional Access Administrator](../roles/permissions-reference.md#conditional-access-administrator)
      * [Security Administrator](../roles/permissions-reference.md#security-administrator)
* A test user (non-administrator) that allows you to verify policies work as expected before deploying to real users. If you need to create a user, see [Quickstart: Add new users to Microsoft Entra ID](../fundamentals/add-users.md).
* A group that the non-administrator user is a member of. If you need to create a group, see [Create a group and add members in Microsoft Entra ID](../fundamentals/how-to-manage-groups.md).

### Engage the right stakeholders

When technology projects fail, they typically do so due to mismatched expectations on affect, outcomes, and responsibilities. To avoid these pitfalls, ensure that you’re engaging the right stakeholders and that stakeholder roles in the project are well understood by documenting the stakeholders, their project input, and accountability. 

### Communicating change

Communication is critical to the success of any new functionality. You should proactively communicate with your users how their [experience](concept-identity-protection-user-experience.md) changes, when it changes, and how to get support if they experience issues.

## Step 1: Review existing reports

It's important to review the [Identity Protection reports](howto-identity-protection-investigate-risk.md) before deploying risk-based Conditional Access policies. This review gives an opportunity to investigate existing suspicious behavior you may have missed and to dismiss or confirm these users as safe if you've determined they aren't at risk. 

- [Investigate risk detections](howto-identity-protection-investigate-risk.md)
- [Remediate risks and unblock users](howto-identity-protection-remediate-unblock.md)
- [Make bulk changes using Microsoft Graph PowerShell](howto-identity-protection-graph-api.md)

For efficiency, we recommend allowing users to self-remediate through policies that are discussed in [Step 3](#step-3-configure-your-policies).

## Step 2: Plan for Conditional Access risk policies

Identity Protection sends risk signals to Conditional Access, to make decisions and enforce organizational policies like requiring multifactor authentication or password change. There are several items organizations should plan for prior to creating their policies.

### Policy exclusions

[!INCLUDE [active-directory-policy-exclusions](../../../includes/active-directory-policy-exclude-user.md)]

### Multifactor authentication

For users to self-remediate risk though, they must register for Microsoft Entra multifactor authentication before they become risky. For more information, see the article [Plan a Microsoft Entra multifactor authentication deployment](../authentication/howto-mfa-getstarted.md).

### Known network locations

It's important to configure named locations in Conditional Access and add your VPN ranges to [Defender for Cloud Apps](/defender-cloud-apps/ip-tags#create-an-ip-address-range). Sign-ins from named locations, marked as trusted or known, improve the accuracy of Microsoft Entra ID Protection risk calculations. These sign-ins lower a user's risk when they authenticate from a location marked as trusted or known. This practice reduces false positives for some detections in your environment.

### Report only mode 

[Report-only mode](../conditional-access/howto-conditional-access-insights-reporting.md) is a Conditional Access policy state that allows administrators to evaluate the effect of Conditional Access policies before enforcing them in their environment.

## Step 3: Configure your policies

### Identity Protection MFA registration policy

Use the Identity Protection multifactor authentication registration policy to help get your users registered for Microsoft Entra multifactor authentication before they need to use it. Follow the steps in the article [How To: Configure the Microsoft Entra multifactor authentication registration policy](howto-identity-protection-configure-mfa-policy.md) to enable this policy.

### Conditional Access policies

**Sign-in risk** - Most users have a normal behavior that can be tracked, when they fall outside of this norm it could be risky to allow them to just sign in. You may want to block that user or maybe just ask them to perform multifactor authentication to prove that they're really who they say they are. You may want to start by scoping these policies to admins only. 

**User risk** - Microsoft works with researchers, law enforcement, various security teams at Microsoft, and other trusted sources to find leaked username and password pairs. When these vulnerable users are detected, we recommend requiring users perform multifactor authentication then reset their password.

The article [Configure and enable risk policies](howto-identity-protection-configure-risk-policies.md) provides guidance to create Conditional Access policies to address these risks.

## Step 4: Monitoring and continuous operational needs

### Email notifications

[Enable notifications](howto-identity-protection-configure-notifications.md) so you can respond when a user is flagged as at risk so you can start investigating immediately. You can also set up weekly digest emails giving you an overview of risk for that week.

### Monitor and investigate

The [Identity Protection workbook](../reports-monitoring/workbook-risk-analysis.md) can help monitor and look for patterns in your tenant. Monitor this workbook for trends and also Conditional Access Report Only mode results to see if there are any changes that need to be made, for example, additions to named locations.
 
Microsoft Defender for Cloud Apps provides an investigation framework organizations can use as a starting point. For more information, see the article [How to investigate anomaly detection alerts](/defender-cloud-apps/investigate-anomaly-alerts).

You can also use the Identity Protection APIs to [export risk information](howto-export-risk-data.md) to other tools, so your security team can monitor and alert on risk events. 

During testing, you might want to [simulate some threats](howto-identity-protection-simulate-risk.md) to test your investigation processes.

## Next steps

[What is risk?](concept-identity-protection-risks.md)
