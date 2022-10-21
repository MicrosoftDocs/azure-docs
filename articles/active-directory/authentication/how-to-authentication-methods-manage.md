---
title: How to migrate to the Authentication methods policy - Azure Active Directory
description: Learn about how to centrally manage multifactor authentication (MFA) and self-service password reset (SSPR) settings in the Authentication methods policy.

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 10/21/2022

ms.author: justinha
author: justinha
manager: amycolannino

ms.collection: M365-identity-device-management
ms.custom: contperf-fy20q4

# Customer intent: As an identity administrator, I want to understand what authentication options are available in Azure AD and how I can manage them.
---
# How to migrate MFA and SSPR settings to the Authentication methods policy for Azure AD

This topic covers steps to migrate policy settings that separately control multifactor authentication (MFA) and self-service password reset (SSPR) to unified management with the Authentication methods policy. The migration process lets customers make changes on their own schedule. You can continue using legacy MFA and SSPR policies while you test and consolidate settings in the Authentication methods policy. For more information about how these policies work together, see [Manage authentication methods for Azure AD](concept-authentication-methods-manage.md).

You can complete the migration whenever you're ready to manage all authentication methods together in the Authentication methods policy. You can roll back to the legacy MFA and SSPR policies any time you run into problems. 

## Pre-migration

Migration management Start by conducting an audit of your existing settings for all of the different authentication methods available to users for MFA and SSPR. If you choose to roll back during migration, you'll want a record of the authentication method settings from each of the following policies:

- SSPR policy
- MFA policy
- Authentication methods policy

### SSPR policy settings

Record which users are in scope for SSPR and the authentication methods they can use. Make sure you copy security questions for later use after they are available to manage in the Authentication methods policy. Let's use Contoso as an example. Contoso has the following methods configured for SSPR.


### MFA policy settings

Document each authentication method that can be used for MFA. Let's say Contoso has the following methods configured for MFA. 



### Authentication methods policy settings

For each authentication method listed in the Authentication methods policy, write down which users and groups are included or excluded from the policy. Also write down and configuration parameters that govern how users can authenticate with each method. For example, document if any group is included in the policy for Microsoft Authenticator to receive location in push notifications. 



## Update the Authentication methods policy

Make sure the Authentication methods policy reflects all settings from every policy in your audit. You might need to adjust some settings to account for differences between the policies. 

For example, your MFA policy might allow **Verification code from mobile app or hardware token**. In the Authentication methods policy, **Software OATH tokens** and **Hardware OATH** tokens are managed separately. You'll need to adjust the Authentication methods policy as you wish for each method.  

## Migration in progress

AfterStep through the process to remove each authentication method in the legacy policies. One-by-one. start with SSPR, then MFA. Test after each auth method is removed. To test excluded users, try to sign in both as a member of the excluded group and again as a non-member. 


## Migration complete
Make changes only in Authentication methods policy. 

