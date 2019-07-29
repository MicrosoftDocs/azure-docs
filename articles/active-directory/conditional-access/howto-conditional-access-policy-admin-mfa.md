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
# Require MFA for Admins

Require MFA for Admins is a baseline policy that requires multi-factor authentication (MFA) for the following directory roles, which are considered some of the most privileged Azure AD roles:
1.	Global Administrator
2.	SharePoint Administrator
3.	Exchange Administrator
4.	Conditional Access Administrator
5.	Security Administrator
6.	Helpdesk Administrator/Password Administrator
7.	Billing Administrator
8.	User Administrator
Below is how you can configure Require MFA for Admins using Conditional Access.
Step 1: Creating A New Policy
Navigate to the Conditional Access blade and select New policy
 

 



 
Step 2: Naming and Selecting the Administrator Roles
Name your Conditional Access policy “Require MFA for Admins” or something similar. To mimick Baseline Protection, your CA policy must apply to the above eight AAD administrator roles. 
To do so, select Users and groups. Under the Include tab, choose Select users and group and check the Directory roles box. Using the dropdown menu, select the below eight AAD administrator roles:
1.	Global Administrator
2.	SharePoint Administrator
3.	Exchange Administrator
4.	Conditional Access Administrator
5.	Security Administrator
6.	Helpdesk Administrator/Password Administrator
7.	Billing Administrator
8.	User Administrator

 
 
If you have users that are assigned one of these eight roles that need to be excluded from this policy, click the Exclude tab and select the users that need to be excluded from the policy. 
 
 
Once you’re done defining your user exclusions, you have successfully defined the administrators this policy will apply to. Click Done to move on. 
 

 
Step 3: Selecting Policy Scope  
Baseline policy: Require MFA for Admins applies to all cloud applications. To configure the equivalent using CA, select the Cloud apps or actions and set the toggle at the top to Cloud apps. Under the Include tab, select All cloud apps. If you have applications that you don’t want to require MFA for, use the Exclude tab to remove these applications from the policy.
Click Done once you’ve completed selecting the Cloud applications this policy will apply to. 
 

 
Step 4: Defining Client Apps
The goal of the Require MFA for Admins policy is to challenge privileged AAD administrators every single time they sign-in. We need to ensure that regardless of which protocol or client app the administrator is logging in from, the administrator will be challenged for MFA. 
Click on Conditions -> Client apps and then set the Configure toggle at the top of the blade to Yes. The following checkboxes will appear. Make sure you have the following selected. Once complete, click Done.
  
 
Step 5: Defining Access Controls
Now that we have your conditions defined, we need to define our Access controls. Select Grant and choose Grant access. Many different options will appear. Since the policy requires administrators to perform MFA every single time they sign in, select the first option: Require multi-factor authentication. 
Click Select to save your selection and move on. 
 
 
Step 6: Enabling Policy
Now you’ve completed configuring your policy. To enable it, set the Enable policy toggle to On. Click Create and you’ve now created a CA policy for Require MFA for Admins. 
 
 
