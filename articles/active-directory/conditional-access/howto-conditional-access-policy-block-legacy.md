---
title: 
description: Create a custom Conditional Access policy to 

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
# Conditional Access: Block legacy authentication

The Block legacy authentication (preview) baseline policy blocks authentication requests that are made using legacy protocols. Modern authentication must be used to successfully sign in for all users. Used in conjunction with the other baseline policies, requests coming from legacy protocols will be blocked. This policy does not block Exchange ActiveSync.
Baseline policy: Block legacy authentication applies tenant wide to all users. Before configuring and enabling this policy, ensure that all your users are using modern authentication supported applications and are not dependent on legacy protocols.

Step 1: Creating Policy and Specifying User Scope
Navigate to the Conditional Access blade and select New policy. Name the policy something descriptive that indicates legacy authentication will be blocked. 
If you’d like your policy to be exactly like Baseline protection, it needs to apply to all users in your tenant. To do so, select Users and groups -> Include -> All users.  



 
 
If only a subset of your users have migrated over to modern authentication, this CA policy should only apply to them. Create a user group that contains these individuals. Under the Include tab, click Select users and groups and select the group that contains all the users for whom legacy authentication will be blocked. 
 
 
Step 2: Selecting Application Scope
Baseline policies apply to all applications. Please ensure that your applications support modern authentication. 
Select Cloud apps and actions and set the toggle to Cloud apps. Under the Include tab, select All cloud apps. If you have applications that do not support modern authentication or need to be upgraded, exclude them from this policy by selecting the Exclude tab and removing those applications. If you only have a handful of applications you want to block legacy authentication from, you can just elect those few by choosing Select apps instead of All cloud apps and defining which applications you want this policy to apply to. 
Once complete, click Done. 

 
 
Step 3: Specifying Legacy Authentication Protocols
Apply the policy to legacy authentication protocols.
Click on Conditions -> Client apps and set the Configure toggle to say Yes. In order for this policy to apply to legacy authentication protocols only, make sure the below two check boxes are checked. No other boxes should be checked, nor should other conditions be configured (as shown below):
1.	Mobile apps and desktop clients
2.	Other clients
Baseline policies do not block Exchange ActiveSync. Once complete, click Done.


 
Step 4: Blocking Access and Enabling Policy
We want to block all access for this policy since we don’t want authentication requests made from legacy protocols to be successful. 
Under Access controls, click on Grant -> Block access and then click Select. 

 
Finally, we can toggle Enable “On” and Create the policy.
