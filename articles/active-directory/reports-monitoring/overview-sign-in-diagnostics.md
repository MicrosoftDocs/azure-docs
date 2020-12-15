---

title: What are sign-in diagnostics in Azure AD? | Microsoft Docs
description: Provides a general overview of the sign-in diagnostics in Azure AD.
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

# Customer intent: As an Azure AD administrator, I want a tool that gives me the right level of insights into the activities in my system so that I can easily diagnose and solve problems when they occur.
ms.collection: M365-identity-device-management
---

# What are sign-in diagnostics in Azure AD?

Azure AD provides you with a flexible security model to control what users can do with the managed resources. Access to these resources is not only controlled by who you are but also by how you access them. Typically, flexibility comes along with a certain degree of complexity because of the number of configuration options you have. Complexity has the potential to increase the risk for errors.

As an IT admin, you need a tool (solution?) that gives you the right level of insights into the activities in your system so that you can easily diagnose and solve problems when they occur. The sign-in diagnostics for Azure AD are an example for such a tool. Use the diagnostic to analyze what happened during a sign-in and what actions you can take to resolve problems without being required to involve Microsoft support.

This article gives you an overview of what this tool does and how you can use it.


## Requirements

The sign-in diagnostics is available in all editions of Azure AD.<br> 
You must be a global administrator member in Azure AD to use this tool.

## How it works

In Azure AD, the response to a sign-in attempt is not just tied to who you are but also how you access your tenant. For example, as an administrator, you might be able to configure all aspects of your tenant while you are signed-in from your corporate network. However, you might be even blocked when you sign in using the same account from an untrusted network. 
Due to the greater flexibility the system has to response to a sign-in attempt, you might end-up in scenarios where you need troubleshoot sign-in attempts. The sign-in diagnostics is a feature that analyzes data from the sign-in and presents specific messages about what happened, and recommendations on what to do to resolve problems. 
The sign-in diagnostics for Azure AD is designed to enable self-diagnosis of sign-in errors. The diagnostics process consists of four main building blocks:

![Sign-in diagnostics process](./media/overview-sign-in-diagnostics/process.png)
 
1. **Define** the scope for the sign-in events you care about

2. **Select** the event you want to review

3. **Review** diagnosis

4. **Take** actions

 
### Define sign-ins

The goal of this step to define a scope for the list of sign-in events you want to investigate. Your scope is either based on a user or identifier and a time range. Additionally, you can also specify an app name if available. Azure AD uses the scope information to locate the right events for you.  

### Select sign-in event 

Based on your search criteria, Azure AD retrieves all matching sign-in events and presents them in an authentication summary list view. 

![Authentication summary](./media/overview-sign-in-diagnostics/authentication-summary.png)


 
You can customize the columns displayed in this view.

### Review diagnosis

For the selected sign-in event, Azure AD provides you with a diagnostic result. 

![Diagnostic results](./media/overview-sign-in-diagnostics/diagnostics-results.png)

 
The result starts with an assessment. The assessment explains in a few sentences what happened. The explanation helps you to understand the behavior of the system. As a next step, you get a summary of the related conditional access policies that were applied to the selected sign-in. 
This part is completed by recommended remediation steps to resolve your issue. Because it is not always possible to resolve issues without additional help, a recommended step might be to open a support ticket. 

### Take action 
At this point, you should have the information you need to fix your issue.


## Scenarios

This section provides you with an overview of the covered diagnostics scenarios. The following scenarios are implemented: 
 
- Blocked by conditional access

- Failed conditional access

- MFA from conditional access

- MFA from other requirements

- MFA Proof up required

- MFA Proof up required but user sign-in attempt is not from secure location

- Successful Sign-in


###	Blocked by conditional access

This scenario results from applied conditional access policies that have the block grant control set.

![Block access](./media/overview-sign-in-diagnostics/block-access.png)

The diagnostic presents details about the user sign-in and the policy or policies that were applied.


### Failed conditional access

This scenario is typically a result of a sign-in that failed because the requirements of a conditional access policy were not satisfied. Common examples are:

![Require controls](./media/overview-sign-in-diagnostics/require-controls.png)

- Require hybrid Azure AD joined device

- Require approved client app

- Require app protection policy   


The diagnostic presents details about the user sign-in and the policy or policies that were applied.


### MFA from conditional access

This scenario is caused by a conditional access policy that has the requirement to sign-in using multi-factor authentication set.

![Require multi-factor authentication](./media/overview-sign-in-diagnostics/require-mfa.png)



\<[Tim]: What about the diagnostics in this scenario? \> 





### MFA from other requirements

This scenario occurs when the requirement to sign-in using multi-factor authentication was not emposed by a conditional access policy. For example, you have configured multi-factor authentication on a per user basis in your tenant.


![Require multi-factor authentication per user](./media/overview-sign-in-diagnostics/mfa-per-user.png)


\<[Tim]: What about the diagnostics in this scenario? \> 



### MFA proof up required

This scenario results from sign-ins that were interrupted by requests to set up multi-factor authentication. This setup process is also known as “proof up”.

Multi-factor authentication proof up occurs when a user is required to use multi-factor authentication but has never set it up before, or an administrator has configured the user to require setting it up.

The intent of this diagnostic scenario is to provide insight that the multi-factor authentication interruption was to set it up and to provide the recommendation to have the user complete the proof up.

### MFA Proof up required but user sign-in attempt is not from secure location

This scenario results from sign-ins that were interrupted by a request to set up multi-factor authentication but the sign-in was seen to be risky. 

Multi-factor authentication Proof up occurs when a user is required to use multi-factor authentication but has never set it up before, or an administrator has configured the user to require setting it up.

The intent of this diagnostic scenario is to provide insight that the multi-factor authentication interruption was to set it up, to provide the recommendation to have the user complete the proof up but to do so from a network location which does not appear risky. For example, if a corporate network is defined as a named location attempt to do the Proof up from the corporate network instead.


### Successful sign-in

This scenario covers the Azure AD sign-in without interruption from conditional access or multi-factor authentication.

The intent of this diagnostic scenario is to provide insight into what the user supplied during the sign-in in case there was a Conditional Access policy or policies which were expected to apply, or a configured Multi-Factor Authentication which was expected to interrupt the user sign-in.



## Next steps

* [Activity logs in Azure Monitor](concept-activity-logs-azure-monitor.md)
* [Stream logs to event hub](tutorial-azure-monitor-stream-logs-to-event-hub.md)
* [Send logs to Azure Monitor logs](howto-integrate-activity-logs-with-log-analytics.md)
