---

title: What is Sign-in Diagnostics in Azure AD? | Microsoft Docs
description: Provides a general overview of the Sign-in Diagnostics in Azure AD.
services: active-directory
documentationcenter: ''
author: MarkusVi
manager: daveba
editor: ''

ms.assetid: e2b3d8ce-708a-46e4-b474-123792f35526
ms.service: active-directory
ms.devlang: na
ms.topic: overview
ms.tgt_pltfrm: na
ms.workload: identity
ms.subservice: report-monitor
ms.date: 12/15/2020
ms.author: markvi
ms.reviewer: tspring  

# Customer intent: As an Azure AD administrator, I want a tool that gives me the right level of insights into the sign-in activities in my system so that I can easily diagnose and solve problems when they occur.
ms.collection: M365-identity-device-management
---

# What is Sign-in Diagnostic in Azure AD?

Azure AD provides you with a flexible security model to control what users can do with the managed resources. Access to these resources is not only controlled by **who** you are but also by **how** you access them. Typically, flexibility comes along with a certain degree of complexity because of the number of configuration options you have. Complexity has the potential to increase the risk for errors.

As an IT admin, you need a solution that gives you the right level of insights into the activities in your system so that you can easily diagnose and solve problems when they occur. The Sign-in Diagnostic for Azure AD is an example for such a solution. Use the diagnostic to analyze what happened during a sign-in and what actions you can take to resolve problems without being required to involve Microsoft support.

This article gives you an overview of what the solution does and how you can use it.


## Requirements

The Sign-in Diagnostics is available in all editions of Azure AD.<br> 
You must be a global administrator in Azure AD to use it.

## How it works

In Azure AD, the response to a sign-in attempt is tied to **who** you are and **how** you access your tenant. For example, as an administrator, you can typically configure all aspects of your tenant when you sign in from your corporate network. However, you might be even blocked when you sign in with the same account from an untrusted network.
 
Due to the greater flexibility of the system to respond to a sign-in attempt, you might end-up in scenarios where you need to troubleshoot sign-ins. The sign-in diagnostic is a feature that:

- Analyzes data from sign-ins. 

- Displays what happened, and recommendations on how to resolve problems. 

The Sign-in Diagnostic for Azure AD is designed to enable self-diagnosis of sign-in errors. To complete the diagnostic process, you need to:

![Sign-in diagnostics process](./media/overview-sign-in-diagnostics/process.png)
 
1. **Define** the scope of the sign-in events you care about

2. **Select** the sign-in you want to review

3. **Review** the diagnostic result

4. **Take** actions

 
### Define scope

The goal of this step is to define the scope for the sign-ins you want to investigate. Your scope is either based on a user or an identifier (correlationId, requestId) and a time range. To narrow down the scope further, you can also specify an app name. Azure AD uses the scope information to locate the right events for you.  

### Select sign-in  

Based on your search criteria, Azure AD retrieves all matching sign-ins and presents them in an authentication summary list view. 

![Authentication summary](./media/overview-sign-in-diagnostics/authentication-summary.png)
 
You can customize the columns displayed in this view.

### Review diagnostic 

For the selected sign-in event, Azure AD provides you with a diagnostics result. 

![Diagnostic results](./media/overview-sign-in-diagnostics/diagnostics-results.png)

 
The result starts with an assessment. The assessment explains in a few sentences what happened. The explanation helps you to understand the behavior of the system. 

As a next step, you get a summary of the related conditional access policies that were applied to the selected sign-in. This part is completed by recommended remediation steps to resolve your issue. Because it is not always possible to resolve issues without additional help, a recommended step might be to open a support ticket. 

### Take action 
At this point, you should have the information you need to fix your issue.


## Scenarios

This section provides you with an overview of the covered diagnostic scenarios. The following scenarios are implemented: 
 
- Blocked by conditional access

- Failed conditional access

- MFA from conditional access

- MFA from other requirements

- MFA Proof up required

- MFA Proof up required but user sign-in attempt is not from secure location

- Successful Sign-in


###	Blocked by conditional access

This scenario is based on a sign-in that was blocked by a conditional access policy.

![Block access](./media/overview-sign-in-diagnostics/block-access.png)

The diagnostic section for this scenario shows details about the user sign-in and the applied policies.


### Failed conditional access

This scenario is typically a result of a sign-in that failed because the requirements of a conditional access policy were not satisfied. Common examples are:

![Require controls](./media/overview-sign-in-diagnostics/require-controls.png)

- Require hybrid Azure AD joined device

- Require approved client app

- Require app protection policy   


The diagnostic section for this scenario shows details about the user sign-in and the applied policies.


### MFA from conditional access

This scenario is based on a conditional access policy that has the requirement to sign-in using multi-factor authentication set.

![Require multi-factor authentication](./media/overview-sign-in-diagnostics/require-mfa.png)

The diagnostic section for this scenario shows details about the user sign-in and the applied policies.



### MFA from other requirements

This scenario is based on a multi-factor authentication requirement that was not enforced by a conditional access policy. For example, multi-factor authentication on a per user basis.


![Require multi-factor authentication per user](./media/overview-sign-in-diagnostics/mfa-per-user.png)


The intent of this diagnostic scenario is to provide more details about:

- The source of the multi-factor authentication interrupt. 
- The result of the client interaction.

Additionally, this section also provides you with all details about the user sign-in attempt. 


### MFA proof up required

This scenario is based on sign-ins that were interrupted by requests to set up multi-factor authentication. This setup is also known as “proof up”.

Multi-factor authentication proof up occurs when a user is required to use multi-factor authentication but has not configured it yet, or an administrator has configured the user to configure it.

The intent of this diagnostic scenario is to provide insight that the multi-factor authentication interruption was to set it up and to provide the recommendation to have the user complete the proof up.

### MFA proof up required from a risky sign-in

This scenario results from sign-ins that were interrupted by a request to set up multi-factor authentication from a risky sign-on. 

The intent of this diagnostic scenario is to provide insight that the multi-factor authentication interruption was to set it up, to provide the recommendation to have the user complete the proof up but to do so from a network location which does not appear risky. For example, if a corporate network is defined as a named location attempt to do the Proof up from the corporate network instead.


### Successful sign-in

This scenario is based on sign-ins that were not interrupted by conditional access or multi-factor authentication.

The intent of this diagnostic scenario is to provide insight into what the user supplied during the sign-in in case there was a Conditional Access policy or policies which were expected to apply, or a configured multi-factor authentication which was expected to interrupt the user sign-in.



## Next steps

* [What are Azure Active Directory reports?](overview-reports.md)
* [What is Azure Active Directory monitoring?](overview-monitoring.md)
