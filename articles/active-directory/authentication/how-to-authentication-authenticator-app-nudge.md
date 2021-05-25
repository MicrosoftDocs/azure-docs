---
title: Nudge users to use Microsoft Authenticator app (Preview) - Azure Active Directory
description: Learn how to move your organization away from less secure authentication methods to the Microsoft Authenticator app

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 05/24/2021

ms.author: justinha
author: justinha
manager: daveba

ms.collection: M365-identity-device-management

# Customer intent: As an identity administrator, I want to encourage users to use the Microsoft Authenticator app in Azure AD to improve and secure user sign-in events.
---
# How to nudge users to use Microsoft Authenticator app (Preview) - Microsoft Authenticator app

You can nudge users to set up the Microsoft Authenticator app during sign-in. Users will go through their regular sign-in, perform multifactor authentication as usual, and then be prompted to set up the Microsoft Authenticator app. You can include or exclude sets of users to control who gets nudged to set up the app. This allows targeted campaigns to move users from less secure authentication methods to the Microsoft Authenticator app.  

In addition to choosing who can be nudged, you can define how many days a user can postpone, or "snooze", the nudge. If a user taps **Not Now** to snooze the app setup, they will be nudged again on the next MFA attempt after the snooze duration has elapsed. 

## Prerequisites 

Your organization must have enabled Azure MFA. 

Users targeted by this feature must not have the Microsoft Authenticator app set up for push notifications on their account. 

Admins need to enable users for the Microsoft Authenticator using either one of the 2 policies below.  

MFA Registration Policy – Users will need to be enabled for “Notification through mobile app”.  

Authentication Methods Policy: Users will need to be enabled for the Microsoft Authenticator and the Authentication mode set to “Any” or “Push”. If the policy is set to **Passwordless**, the user will not be eligible for the Nudge. 

## User experience


## Enable the nudge policy


## Frequently asked questions

**Will this feature be available for MFA Server?** 
No. This feature will be available for users using Azure MFA only. 

**How long will the campaign run for?** 
You can use the APIs to enable the campaign for as long as you like. Whenever you want to be done running the campaign, simply use the APIs to disable the campaign.  
 
**Can each group of users have a different snooze duration?** 
No. The snooze duration for the prompt is a tenant wide setting and applies to all groups in scope. 

**Can users be nudged to setup Passwordless phone sign-in?** 
The feature aims to empower admins to get users setup with MFA using the Authenticator app and not passwordless phone sign-in.  

**Will a user who has a 3rd party authenticator app setup see the nudge?** 
If this user doesn’t have the Microsoft Authenticator app set up for push notifications and are enabled for it by policy, yes, the user will see the nudge. 

**If a user just went through MFA registration, will they be nudged in the same sign-in session?** 
No. To provide a good user experience, users will not be nudged to set up the Authenticator in the same session that they registered other authentication methods.  

**Can I nudge my users to register another authentication method?** 
No. The feature, for now, aims to nudge users to set up the Microsoft Authenticator app only. 

**Is there a way for me to hide the snooze option and force my users to setup the Authenticator app?**  
At this time, there is not a way to hide the snooze option on the Nudge. You can set the snoozeDuration to 0 which will ensure that users will see the Nudge during each MFA attempt.  

**Will I be able to Nudge my users if I am not using Azure MFA?** 
No. The Nudge will only work for users who are doing MFA using the Azure MFA service. 

**Will Guest/B2B users in my tenant be Nudged?** 
Yes. If they have been scoped for the Nudge using the policy. 