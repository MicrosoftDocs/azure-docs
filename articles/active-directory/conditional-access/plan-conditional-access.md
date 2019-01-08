---
title: Plan conditional access policies in Azure Active Directory | Microsoft Docs
description: In this article, you learn how to plan conditional access policies for Azure Active Directory.
services: active-directory
author: MarkusVi
manager: mtillman
tags: azuread
ms.service: active-directory
ms.component: conditional-access
ms.topic: conceptual
ms.workload: identity
ms.date: 12/13/2018
ms.author: markvi
ms.reviewer: martincoetzer
---

# How To: Plan your conditional access deployment in Azure Active Directory


## Learn

Familiarize yourself with 



## Plan

Azure Active Directory conditional access enables you to bring the protection of your cloud apps to a new level. In this new level, how you can access a cloud app is based on a dynamic policy evaluation instead of a static access configuration. With a conditional access policy, you define a response (**do this**) to an access condition (**when this happens**).

![Reason and response](./media/conditions/10.png)

At a minimum, **when this happens** defines the principal (**who**) that attempts to access a cloud app (**what**). If required, you can also include **how** an access attempt is performed. In conditional access, the elements that define the who, what, and how are known as conditions. For a complete overview, see [What are conditions in Azure Active Directory conditional access?](conditions.md) 

With **then do this**, you define the response of your policy to an access condition. In your response, you either block or grant access with additional requirements such as multi-factor authentication (MFA). For a complete overview, see [What are access controls in Azure Active Directory conditional access?](controls.md)  
 

When planning your conditional access policies, use this model to track your requirements.
    

|When *this* happens:|Then do *this*:|
|-|-|
|An access attempt is made:<br>- To a cloud app*<br>- By users and groups*<br>Using:<br>- Condition 1 (for example, outside Corp network)<br>- Condition 2 (for example, sign-in risk)|Block access to the application|
|An access attempt is made:<br>- To a cloud app*<br>- By users and groups*<br>Using:<br>- Condition 1 (for example, outside Corp network)<br>- Condition 2 (for example, sign-in risk)|Grant access with (AND):<br>- Requirement 1 (for example, MFA)<br>- Requirement 2 (for example, Device compliance)|
|An access attempt is made:<br>- To a cloud app*<br>- By users and groups*<br>Using:<br>- Condition 1 (for example, outside Corp network)<br>- Condition 2 (for example, sign-in risk)|Grant access with (OR):<br>- Requirement 1 (for example, MFA)<br>- Requirement 2 (for example, Device compliance)|




## Common access scenarios

### Enforce MFA for your admins

Users with access to privileged accounts have unrestricted access to your environment. Due to the power these accounts have, you should treat them with special care. One common method to improve the protection of privileged accounts is to require a stronger form of account verification during a sign-in. In Azure Active Directory, you can get a stronger account verification by requiring multi-factor authentication (MFA). For more information, see [Require MFA for admins](baseline-protection.md#require-mfa-for-admins).

>[!TIP]
> At a minimum, require MFA for global admins when accessing your cloud apps.


### Enforce MFA for specific apps

To simplify the sign-in experience of your users, you might want to allow them to sign in to your cloud apps using a user name and a password. However, many environments have at least a few apps for which it is advisable to require a stronger form of account verification. This might be, for example true, for access to your organization's email system or your HR apps. For more information, see [equire MFA for specific apps with Azure Active Directory conditional access](app-based-mfa). 


### Respond to detected sign-in risks

The sign-in risk level is an indicator for the probability that an account has been compromised. The level is based on the risk events that have been detected during the sign-in of a user. To keep your environment protected, you should configure a policy that responds to detected sign-in risks. For more information, see [Block access when a session risk is detected with Azure Active Directory conditional access](app-sign-in-risk.md).

> [!TIP]
> As a best practice, apply this policy to all your cloud applications.


### Respond to detected user risks

The user risk level is another indicator for the probability that an account has been compromised. The level is based on all active risk events that have been detected for a user. To keep your environment protected, you should configure a policy that responds to detected user risks. For more information, see [How to configure the user risk policy](../identity-protection/howto-user-risk-policy.md).



### Access to cloud apps from a network location you don’t trust

To master the balance between security and productivity, it might be sufficient for you to only require a password for sign-ins from your organization's network. However, for access from an untrusted network location, there is an increased risk that sign-ins are not performed by legitimate users. To address this concern, you can block access from untrusted networks. Alternatively, you can also require multi-factor authentication (MFA) to gain back additional assurance that an attempt was made by the legitimate owner of the account. For more information, see [How to require MFA for access from untrusted networks with conditional access](untrusted-networks.md).




### Access a cloud apps with devices that aren't managed by your organization

The proliferation of supported devices to access your cloud resources helps to improve the productivity of your users. On the flip side, you probably don't want certain resources in your environment to be accessed by devices with an unknown protection level. For the affected resources, you should require that users can only access them using a managed device. For more information, see [How to require managed devices for cloud app access with conditional access](require-managed-devices.md). 

### Restrict access to cloud apps to approved client apps

Your employees use mobile devices for both personal and work tasks. While making sure your employees can be productive, you also want to prevent data loss. With Azure Active Directory (Azure AD) conditional access, you can restrict access to your cloud apps to approved client apps that can protect your corporate data. For more information, see [How to require approved client apps for cloud app access with conditional access](app-based-conditional-access).


### Block legacy authentication

Azure AD supports several of the most widely used authentication and authorization protocols including legacy authentication. How can you prevent apps using legacy authentication from accessing your tenant's resources? The recommendation is to just block them with a conditional access policy. If necessary, you allow only certain users and specific network locations to use apps that are based on legacy authentication. For more information, see [How to block legacy authentication to Azure AD with conditional access](block-legacy-authentication.md).




## Implement your solution

The foundation of proper planning is the basis upon which you can deploy an application successfully with Azure Active Directory. It provides intelligent security and integration that simplifies onboarding while reducing the time for successful deployments. This combination makes sure your application is integrated with ease while mitigating down time for your end users.

Use the following phases to plan for and deploy your solution in your organization:

* Phase 1: Configuring your solution
* Phase 2: Testing
* Phase 3: Rollback Steps
* Phase 4: Moving to Production

### Phase 1: Implementation steps

Use this section to help with your implementation. Based on the policies that you selected in the design section, identify the users, groups, conditions, and controls that apply to each policy.

#### Identify a set of users and groups to validate the implementation

>[!TIP]
> Microsoft recommends starting with a set of pilot users and groups before rolling out a Conditional Access policy to the entire set of users and groups that the policy covers. Define a test users group you can use for the pilot.

#### Configure your policy

Once you’re ready to create your policy:

1. Go to portal.azure.com
2. Navigate to Azure Active Directory
3. Click on Conditional Access on the left navigation
4. Click on New Policy
5. Configure the Users, Apps, Conditions, and Controls
6. Set Enable Policy to on

![Picture 26](Media/azure-ad-ca-deployment-image1.png)

### Phase 2: Test

Use the following table to identify test cases that you would like to verify before rolling out your application to the rest of the organization. We’ve created a set of default use cases for you to get started with. Add and remove test cases based on the policies that you would like to implement. Use the [What-if](https://docs.microsoft.com/azure/active-directory/active-directory-conditional-access-whatif) tool to verify the scenarios below.

>[!NOTE]
> Make sure to open a new browser session for all tests
>[!TIP]
> Microsoft recommends using the Whatif tool to verify that policies are working as expected

The following table outlines example test cases. Adjust the scenarios and expected results based on how your CA policies are configured.

|Policy |Scenario |Expected Results |
|-|-|-|
|[Require MFA when not at work](https://docs.microsoft.com/azure/active-directory/conditional-access/untrusted-networks)|Authorized user signs into *App* while on a trusted location / work|User isn't prompted to MFA|
|[Require MFA when not at work](https://docs.microsoft.com/azure/active-directory/conditional-access/untrusted-networks)|Authorized user signs into *App* while not on a trusted location / work|User is prompted to MFA and can sign in successfully|
|[Require MFA (for admin)](https://docs.microsoft.com/azure/active-directory/conditional-access/baseline-protection#require-mfa-for-admins)|Global Admin signs into *App*|Admin is prompted to MFA|
|[Risky Sign-Ins](https://docs.microsoft.com/azure/active-directory/identity-protection/howto-sign-in-risk-policy)|User signs into *App* using a [Tor browser](https://docs.microsoft.com/azure/active-directory/active-directory-identityprotection-playbook)|Admin is prompted to MFA|
|[Device Management](https://docs.microsoft.com/azure/active-directory/conditional-access/require-managed-devices)|Authorized user attempts to sign in from an authorized device|Access Granted|
|[Device Management](https://docs.microsoft.com/azure/active-directory/conditional-access/require-managed-devices)|Authorized user attempts to sign in from an unauthorized device|Access blocked|
|[Password Change for risky users](https://docs.microsoft.com/azure/active-directory/identity-protection/howto-user-risk-policy)|Authorized user attempts to sign in with compromised credentials (high risk sign in)|User is prompted to change password or access is blocked based on your policy|

### Phase 3: Move to production

1. Provide Internal Change Communication to end users.
2. Apply a policy to a small set of users and verify it behaves as expected.
3. When you expand a policy to include more users, continue to exclude one admin from the policy. Excluding one admin will make sure admin account still have access and can update a policy if a change is required.

>[!TIP]
>Follow the production deployment [best practices](https://docs.microsoft.com/azure/active-directory/active-directory-conditional-access-best-practices).

### Phase 4: Rollback steps

Use the following options to roll back a Conditional Access policy

1. **Disable the policy** - Disabling a policy makes sure it doesn't apply when a user tries to sign in. You can always come back and enable the policy when you’d like to use it.

![Picture 27](Media/Cazure-ad-ca-deployment-image2.png)

2. **Exclude a user / group from a policy** - If a user is unable to access the app, you can choose to exclude the user from the policy

>[!NOTE]
> This option should be used sparingly, only in situations where the user is trusted. The user should be added back into the policy or group as soon as possible.

![Picture 30](Media/azure-ad-ca-deployment-image3.png)

3. **Delete the policy** - If the policy is no longer required, delete it.

## Next steps

* Conditional access [technical reference](https://docs.microsoft.com/azure/active-directory/conditional-access/technical-reference)
