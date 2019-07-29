---
title: 
description: 

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: conceptual
ms.date: 

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: calebb, rogoya

ms.collection: M365-identity-device-management
---
# Require MFA for Service Management
Organizations use a variety of Azure services and manage them from Azure Resource Manager based tools like:
•	Azure portal
•	Azure PowerShell
•	Azure CLI
Using any of these tools to perform resource management is a highly privileged action. These tools can alter subscription-wide configurations, such as service settings and subscription billing. To protect privileged actions, this Require MFA for service management (preview) policy will require multi-factor authentication for any user accessing Azure portal, Azure PowerShell, or Azure CLI.

This section details how to set up the equivalent policy through Conditional Access.
Step 1: Naming the Policy and Specifying User Scope
Navigate to the Conditional Access blade and select New policy. Name the policy something descriptive such as “Require MFA for Service Management”.
If you’d like your policy to be exactly like Baseline protection, it needs to apply to all users in your tenant. To do so, select Users and groups -> Include -> All users.  If you have users that are assigned one of these eight roles that need to be excluded from this policy, click the Exclude tab and select the users that need to be excluded from the policy. Click Done once you’ve defined the users this policy will apply to. 


 

Step 2: Selecting Application Scope
Select Cloud apps or actions and set the toggle at the top of the blade to Cloud apps. Under the Include tab, choose the Select apps option and then search for and select Microsoft Azure Management. This selection encompasses Azure Portal, Azure PowerShell, and Azure Command Line Interface. 
Once complete, click Done.

 


Step 3: Requiring MFA

Now that we have our conditions defined, we need to define our Access controls. Under the Access controls heading, select Grant and choose Grant access. Many different options will appear. Since the policy requires users to perform MFA every single time they sign in, select the first option: Require multi-factor authentication. Then click Select to save your selection. 
 

Step 4: Enabling Policy
Now that you’ve defined your Conditional Access policy to protect Azure Service Management, enable the policy by setting the Enable policy toggle to On. Click Create and you’ve now created a CA policy for Require MFA for Service Management.

 
