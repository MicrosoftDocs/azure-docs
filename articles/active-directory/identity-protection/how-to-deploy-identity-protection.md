---
title: 
description: 

services: active-directory
ms.service: active-directory
ms.subservice: identity-protection
ms.topic: how-to
ms.date: 11/01/2022

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: jhenders, tracyyu, chuqiaoshi

ms.collection: M365-identity-device-management
---
# How To: Plan an Azure Active Directory Identity Protection deployment guide

Azure AD Identity Protection contributes both a registration policy for and automated risk detection and remediation policies to the Azure AD Multi-Factor Authentication story. Policies can be created to force password changes when there is a threat of compromised identity or require MFA when a sign in is deemed risky. If you use Azure AD Identity Protection, configure the Azure AD MFA registration policy to prompt your users to register the next time they sign in interactively.

To monitor your Azure multi factor authentication and self service password reset deployment check the Authentication methods activity tab in the Microsoft Entra portal.

## Prerequisites

### Engage the right stakeholders

CREATE AN INCLUDE BASED ON https://learn.microsoft.com/en-us/azure/active-directory/fundamentals/active-directory-deployment-plans#include-the-right-stakeholders AND PUT IT HERE

When technology projects fail, they typically do so due to mismatched expectations on impact, outcomes, and responsibilities. To avoid these pitfalls, ensure that you’re engaging the right stakeholders and that stakeholder roles in the project are well understood by documenting the stakeholders and their project input and accountabilities. 

### License requirements

Azure Active Directory Identity protection requires an appropriate license for the features they use.
To compare editions and features, see Azure Active Directory Identity Protection license requirement
For more information about pricing, see Azure Active Directory pricing.

### Permissions

Identity Protection requires users be a Security Reader, Security Operator, Security Administrator, Global Reader, or Global Administrator to access. See Azure AD identity protection roles.

### Communication plan

Communication is critical to the success of any new service. You should proactively communicate with your users how their experience will change, when it will change, and how to gain support if they experience issues.

## Step 1: Review existing reports

It is important to understand your current Identity Protection reports before deploying risk based Conditional Access policies. This is to give you an understanding of your environment, investigate suspicious behavior you may have missed and to dismiss or confirm safe user who you have determined are not at risk. We recommend allowing users to self-remediate through policies that will be discussed in Step 3.

### Existing risk detections

If your users have not been remediating risk then they could have accumulated risk or the user may have reset their password on-premises, which does not remediate risk. Make sure before you bulk dismiss users, you have determined they are not at risk. You can see samples for bulk dismiss via Microsoft Graph API in our Identity Protection Tools.

## Step 2: Plan for Conditional Access risk policies

Conditional Access brings signals together to make decisions and enforce organizational policies. Conditional access sign-in risk and user policies work to automate threat detections and allow users to self-remediate risk.

### Policy exclusions

FIX THE INCLUDE AND PUT IT HERE

### Related features

Azure MFA and Secure password reset is a pre-requisite for using Conditional Access risk policies. For users to be able to remediate risk your must have your users registered in Azure Active Directory self-service password reset and Azure Active Directory multi-factor authentication. 

We have guidance and deployment plans for both Azure AD self-service password reset and Azure Active Directory multi-factor authentication. 

Combined registration MFA registration and SSPR - Enable combined security information registration - Azure Active Directory - Microsoft Entra | Microsoft Docs

Plan your Azure Active Directory self-service password reset deployment and enable users - Enable Azure Active Directory self-service password reset - Microsoft Entra | Microsoft Docs

Plan your Azure Active Directory Multi-Factor Authentication deployment with Conditional Access - Enable Azure AD Multi-Factor Authentication - Microsoft Entra | Microsoft Docs

### Known network locations

It is important to configure both trusted named locations in Conditional Access and to add your VPN ranges in Defender for Cloud Apps. Sign-ins from trusted named locations improve the accuracy of Azure AD Identity Protection's risk calculation, lowering a user's sign-in risk when they authenticate from a location marked as trusted. This will reduce the amount of false positives for some of the detections in your environment as these locations are used in our analysis of risk.

### Report only mode 

Report-only mode is a Conditional Access policy state that allows administrators to evaluate the impact of Conditional Access policies before enforcing them in their environment.

## Step 3: Build Conditional Access risk policies

### Conditional Access templates

FIX THE INCLUDE AND PUT IT HERE

### Conditional Access sign-in risk policy

Most users have a normal behaviour that can be tracked, when they fall outside of this norm it could be risky to allow them to just sign in. You may want to block that user or maybe just ask them to perform multi-factor authentication to prove that they are really who they say they are. You may want to start by scoping these policies to admins only. 

1.	Sign in to the Azure portal as a global administrator, security administrator, or Conditional Access administrator.
2.	Browse to Azure Active Directory > Security > Conditional Access.
3.	Select New policy.
4.	Give your policy a name. We recommend that organizations create a meaningful standard for the names of their policies.
5.	Under Assignments, select Users and groups.
   1.	Under Include, select All users.
   2.	Under Exclude, select Users and groups and choose your organization's emergency access or break-glass accounts.
   3.	Select Done.
6.	Under Cloud apps or actions > Include, select All cloud apps.
7.	Under Conditions > Sign-in risk, set Configure to Yes. Under Select the sign-in risk level this policy will apply to.
   1.	Select High and Medium.
   2.	Select Done.
8.	Under Access controls > Grant.
   1.	Select Grant access, Require multi-factor authentication.
   2.	Select Select.
9.	Confirm your settings and set Enable policy to Report-only.
10.	Select Create to create to enable your policy.

### Conditional Access user risk

Microsoft works with researchers, law enforcement, various security teams at Microsoft, and other trusted sources to find leaked username and password pairs. Organizations with Azure AD Premium P2 licenses can create Conditional Access policies incorporating Azure AD Identity Protection user risk detections.

1.	Sign in to the Azure portal as a global administrator, security administrator, or Conditional Access administrator.
2.	Browse to Azure Active Directory > Security > Conditional Access.
3.	Select New policy.
4.	Give your policy a name. We recommend that organizations create a meaningful standard for the names of their policies.
5.	Under Assignments, select Users and groups.
1.	Under Include, select All users.
2.	Under Exclude, select Users and groups and choose your organization's emergency access or break-glass accounts.
3.	Select Done.
6.	Under Cloud apps or actions > Include, select All cloud apps.
7.	Under Conditions > User risk, set Configure to Yes.
1.	Under Configure user risk levels needed for policy to be enforced, select High.
2.	Select Done.
8.	Under Access controls > Grant.
1.	Select Grant access, Require password change.
2.	Select Select.
9.	Confirm your settings, and set Enable policy to Report-only.
10.	Select Create to create to enable your policy.

### ?Enable MFA registration policy?

### Migrating from older Identity Protection policies

## Step 4: Monitoring and continuous operational needs

### Enable notifications

Enable notifications so you can respond when a user is flagged as at risk so you can start investigating immediately. You can also set up weekly digest emails giving you an overview of risk for that week in your tenant.

### Monitor and investigate

Investigate risk with Identity Protection Alerts (in DRAFT)
Identity Protection workbook to help monitor and look for patterns in your tenant. Monitor this for trends and also Conditional Access Report Only mode results to see if there are any tweaks that need to be made for example additions to named locations.
 
How to investigate anomaly detection with Defender for Cloud App Security Alerts 
You can also use the Identity Protection API’s to export the risk to your SIEM tool so your security team can monitor and alert on risk events. 

During this testing time you might want to simulate some threats Identity Protection protects against and you can see some of these here.

## Step 5: Enable Conditional Access policies

After you have completed all your analysis and evaluated the report only mode for Conditional Access and you have your stakeholders on board it is time to turn on your Conditional Access risk policies.

## Next steps
