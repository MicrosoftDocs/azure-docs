---
title: Plan an Azure Active Directory Conditional Access deployment
description: Learn how to design Conditional Access policies and effectively deploy in your organization.

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: how-to
ms.date: 08/11/2022

ms.author: gasinh
author: gargi-sinha
manager: martinco
ms.reviewer: joflore

ms.collection: M365-identity-device-management
---
# Plan a Conditional Access deployment

Planning your Conditional Access deployment is critical to achieving your organization's access strategy for apps and resources.

[Azure Active Directory (Azure AD) Conditional Access](overview.md) analyses signals such as user, device, and location to automate decisions and enforce organizational access policies for resources. Conditional Access policies allow you to build conditions that manage security controls that can block access, require multifactor authentication, or restrict the user’s session when needed and stay out of the user’s way when not.

With this evaluation and enforcement, Conditional Access defines the basis of [Microsoft’s Zero Trust security posture management](https://www.microsoft.com/security/business/zero-trust).

![Conditional Access overview](./media/plan-conditional-access/conditional-access-overview-how-it-works.png)

Microsoft provides [security defaults](../fundamentals/concept-fundamentals-security-defaults.md) that ensure a basic level of security enabled in tenants that don't have Azure AD Premium. With Conditional Access, you can create policies that provide the same protection as security defaults, but with granularity. Conditional Access and security defaults aren't meant to be combined as creating Conditional Access policies will prevent you from enabling security defaults.

### Prerequisites

* A working Azure AD tenant with Azure AD Premium or trial license enabled. If needed, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* An account with Conditional Access Administrator privileges.
* A test user (non-administrator) that allows you to verify policies work as expected before you impact real users. If you need to create a user, see [Quickstart: Add new users to Azure Active Directory](../fundamentals/add-users-azure-active-directory.md).
* A group that the non-administrator user is a member of. If you need to create a group, see [Create a group and add members in Azure Active Directory](../fundamentals/active-directory-groups-create-azure-portal.md).

## Understand Conditional Access policy components

Policies answer questions about who should access your resources, what resources they should access, and under what conditions. Policies can be designed to grant access, limit access with session controls, or to block access. You [build a Conditional Access policy](concept-conditional-access-policies.md)  by defining the if-then statements: **If an assignment is met, then apply the access controls**.

### Ask the right questions

Here are some common questions about [Assignments and Access Controls](concept-conditional-access-cloud-apps.md). Document the answers to questions for each policy before building it out.

**Users or workload identities**

* Which users, groups, directory roles and workload identities will be included in or excluded from the policy?
* What emergency access accounts or groups should be excluded from policy?

**Cloud apps or actions**

Will this policy apply to any application, user action, or authentication context? If yes-

*	What application(s) will the policy apply to?
*	What user actions will be subject to this policy?
*	What authentication contexts does this policy will be applied to?

**Conditions**

* Which device platforms will be included in or excluded from the policy?
* What are the organization’s trusted locations?
* What locations will be included in or excluded from the policy?
* What client app types will be included in or excluded from the policy?
* Do you have policies that would drive excluding Azure AD joined devices or Hybrid Azure AD joined devices from policies? 
* If using [Identity Protection](../identity-protection/concept-identity-protection-risks.md), do you want to incorporate sign-in risk protection?

**Grant or Block** 

Do you want to grant access to resources by requiring one or more of the following?

* Require MFA
* Require device to be marked as compliant
* Require hybrid Azure AD joined device
* Require approved client app
* Require app protection policy
* Require password change
* Use Terms of Use 

**Session control**

Do you want to enforce any of the following access controls on cloud apps?

* Use app enforced restrictions
* Use Conditional Access App control
* Enforce sign-in frequency
* Use persistent browser sessions
* Customize continuous access evaluation

### Access token issuance

[Access tokens](../develop/access-tokens.md) grant or deny access based on whether the user making a request has been authorized and authenticated. If the requestor can prove they're who they claim to be, they can access the protected resources or functionality. 

![Access token issuance diagram](media/plan-conditional-access/CA-policy-token-issuance.png)

**Access tokens are by default issued if a Conditional Access policy condition does not trigger an access control**. 

This doesn’t prevent the app to have separate authorization to block access. For example, consider a policy where: 
  
  * IF user is in finance team, THEN force MFA to access their payroll app.
  * IF a user not in finance team attempts to access the payroll app, the user will be issued an access token. 
  * To ensure users outside of finance group can't access the payroll app, a separate policy should be created to block all other users. If all users except for finance team and emergency access accounts group, accessing payroll app, then block access.

## Follow best practices

Conditional Access provides you with great configuration flexibility. However, great flexibility also means you should carefully review each configuration policy before releasing it to avoid undesirable results.

### Set up emergency access accounts

**If you misconfigure a policy, it can lock the organizations out of the Azure portal**. 

Mitigate the impact of accidental administrator lockout by creating two or more [emergency access accounts](../roles/security-emergency-access.md) in your organization. Create a user account dedicated to policy administration and excluded from all your policies.

### Apply Conditional Access policies to every app

**Ensure that every app has at least one Conditional Access policy applied**. From a security perspective it's better to create a policy that encompasses **All cloud apps**, and then exclude applications that you don't want the policy to apply to. This ensures you don't need to update Conditional Access policies every time you onboard a new application.

> [!IMPORTANT]
> Be very careful in using block and all apps in a single policy. This could lock admins out of the Azure portal, and exclusions cannot be configured for important endpoints such as Microsoft Graph.

### Minimize the number of Conditional Access policies

Creating a policy for each app isn’t efficient and leads to difficult administration. Conditional Access has a limit of 195 policies per-tenant. We recommend that you **analyze your apps and group them into applications that have the same resource requirements for the same users**. For example, if all Microsoft 365 apps or all HR apps have the same requirements for the same users, create a single policy and include all the apps to which it applies.

### Set up report-only mode

It can be difficult to predict the number and names of users affected by common deployment initiatives such as:

* Blocking legacy authentication
* Requiring MFA
* Implementing sign-in risk policies

[Report-only mode ](concept-conditional-access-report-only.md) allows administrators to evaluate the impact of Conditional Access policies before enabling them in their environment. **First configure your policies in report-only mode and let it run for an interval before enforcing it in your environment**. 

### Plan for disruption

If you rely on a single access control such as MFA or a network location to secure your IT systems, you're susceptible to access failures if that single access control becomes unavailable or misconfigured. 

**To reduce the risk of lockout during unforeseen disruptions, [plan strategies](../authentication/concept-resilient-controls.md) to adopt for your organization**.

### Set naming standards for your policies

**A naming standard helps you to find policies and understand their purpose without opening them in the Azure admin portal**. We recommend that you name your policy to show:

* A Sequence Number
* The cloud app(s) it applies to
* The response
* Who it applies to
* When it applies (if applicable)

![Screenshot that shows the naming standards for policies.](media/plan-conditional-access/11.png)

**Example**; A policy to require MFA for marketing users accessing the Dynamics CRP app from external networks might be:

![Naming standard](media/plan-conditional-access/naming-example.png)

A descriptive name helps you to keep an overview of your Conditional Access implementation. The Sequence Number is helpful if you need to reference a policy in a conversation. For example, when you talk to an administrator on the phone, you can ask them to open policy CA01 to solve an issue.

#### Naming standards for emergency access controls

In addition to your active policies, implement disabled policies that act as secondary [resilient access controls in outage or emergency scenarios](../authentication/concept-resilient-controls.md). Your naming standard for the contingency policies should include:

* ENABLE IN EMERGENCY at the beginning to make the name stand out among the other policies.
* The name of disruption it should apply to.
* An ordering sequence number to help the administrator to know in which order policies should be enabled.

**Example**

The following name indicates that this policy is the first of four policies to enable if there's an MFA disruption:

* EM01 - ENABLE IN EMERGENCY: MFA Disruption [1/4] - Exchange SharePoint: Require hybrid Azure AD join For VIP users.

### Block countries from which you never expect a sign-in.

Azure active directory allows you to create [named locations](location-condition.md). Create the list of countries that are allowed, and then create a network block policy with these "allowed countries" as an exclusion. This is less overhead for customers who are based in smaller geographic locations.**Be sure to exempt your emergency access accounts from this policy**.

## Deploy Conditional Access policy

When new policies are ready, deploy your Conditional Access policies in phases.

### Build your Conditional Access policy

Refer to common [Conditional Access policies](concept-conditional-access-policy-common.md) for a head start. A convenient way will be to use the Conditional Access template that comes with Microsoft recommendations. Make sure you exclude your emergency access accounts.

### Evaluate the policy impact

Before you see the impact of your Conditional Access policy in your production environment, we recommend that you use the following two tools to run the simulation. 

#### Set up report-only mode

By default, each policy is created in report-only mode, we recommended organizations test and monitor usage, to ensure intended result, before turning on each policy.

[Enable the policy in report-only mode](howto-conditional-access-insights-reporting.md). Once you save the policy in report-only mode, you can see the impact on real-time sign-ins in the sign-in logs. From the sign-in logs, select an event and navigate to the Report-only tab to see the result of each report-only policy.

You can view the aggregate impact of your Conditional Access policies in the Insights and Reporting workbook. To access the workbook, you need an Azure Monitor subscription and you'll need to [stream your sign-in logs to a log analytics workspace](../reports-monitoring/howto-integrate-activity-logs-with-log-analytics.md)  .

#### Simulate sign-ins using the What If tool

Another way to validate your Conditional Access policy is by using the [What If tool](troubleshoot-conditional-access-what-if.md), which simulates which policies would apply to a user signing in under hypothetical circumstances. Select the sign-in attributes you want to test (such as user, application, device platform, and location) and see which policies would apply.

> [!NOTE] 
> While a simulated run gives you a good idea of the impact a Conditional Access policy has, it does not replace an actual test run.

### Test your policy

**Ensure you test the exclusion criteria of a policy**. For example, you may exclude a user or group from a policy that requires MFA. Test if the excluded users are prompted for MFA, because the combination of other policies might require MFA for those users.

Perform each test in your test plan with test users. The test plan is important to have a comparison between the expected results and the actual results. The following table outlines example test cases. Adjust the scenarios and expected results based on how your Conditional Access policies are configured.

| Policy| Scenario| Expected Result |
| - | - | - |
| [Risky sign-ins](../identity-protection/howto-identity-protection-configure-risk-policies.md)| User signs into App using an unapproved browser| Calculates a risk score based on the probability that the sign-in wasn't performed by the user. Requires user to self-remediate using MFA  |
| [Device management](require-managed-devices.md)| Authorized user attempts to sign in from an authorized device| Access granted |
| [Device management](require-managed-devices.md)| Authorized user attempts to sign in from an unauthorized device| Access blocked |
| [Password change for risky users](../identity-protection/howto-identity-protection-configure-risk-policies.md)| Authorized user attempts to sign in with compromised credentials (high risk sign in)| User is prompted to change password or access is blocked based on your policy |

### Deploy in production

After confirming impact using **report-only mode**, an administrator can move the **Enable policy** toggle from **Report-only** to **On**.

### Roll back policies

In case you need to roll back your newly implemented policies, use one or more of the following options:

* **Disable the policy.** Disabling a policy makes sure it doesn't apply when a user tries to sign in. You can always come back and enable the policy when you would like to use it.

 ![enable policy image](media/plan-conditional-access/enable-policy.png)

* **Exclude a user or group from a policy.** If a user is unable to access the app, you can choose to exclude the user from the policy.

 ![exclude users and groups](media/plan-conditional-access/exclude-users-groups.png)

> [!NOTE]
>  This option should be used sparingly, only in situations where the user is trusted. The user should be added back into the policy or group as soon as possible.

* **Delete the policy.** If the policy is no longer required, [delete](../authentication/tutorial-enable-azure-mfa.md?bc=%2fazure%2factive-directory%2fconditional-access%2fbreadcrumb%2ftoc.json&toc=%2fazure%2factive-directory%2fconditional-access%2ftoc.json) it.

## Troubleshoot Conditional Access policy

When a user is having an issue with a Conditional Access policy, collect the following information to facilitate troubleshooting.

* User Principal Name
* User display name
* Operating system name
* Time stamp (approximate is ok)
* Target application
* Client application type (browser vs client)
* Correlation ID (this is unique to the sign-in)

If the user received a message with a More details link, they can collect most of this information for you.

![Can’t get to app error message](media/plan-conditional-access/cant-get-to-app.png)

Once you've collected the information, See the following resources:

* [Sign-in problems with Conditional Access](troubleshoot-conditional-access.md) – Understand unexpected sign-in outcomes related to Conditional Access using error messages and Azure AD sign-ins log.
* [Using the What-If tool](troubleshoot-conditional-access-what-if.md) - Understand why a policy was or wasn't applied to a user in a specific circumstance or if a policy would apply in a known state.

## Next Steps

[Learn more about Multifactor authentication](../authentication/concept-mfa-howitworks.md)

[Learn more about Identity Protection](../identity-protection/overview-identity-protection.md)

[Manage Conditional Access policies with Microsoft Graph API](/graph/api/resources/conditionalaccesspolicy)
