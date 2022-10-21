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

This topic covers steps to migrate policy settings that separately control multifactor authentication (MFA) and self-service password reset (SSPR) to unified management with the Authentication methods policy. The migration process lets customers make changes on their own schedule. You can continue using legacy MFA and SSPR policies while you consolidate settings in the Authentication methods policy. For more information about these policies and how they work together, see [Manage authentication methods for Azure AD](concept-authentication-methods-manage.md)

When you're ready, you can choose to manage all authentication methods in the Authentication methods policy. If you run into problems, you can roll back to legacy MFA and SSPR policies any time.   

## Audit current policy settings

Start the migration by documenting your current settings for all authentication methods. In case you choose to roll back, you'll need a record of the settings for each authentication method in each of the following policies:

- SSPR policy
- MFA policy
- Authentication methods policy

### SSPR policy settings

Record which users are in scope for SSPR. 

### MFA policy settings



### Authentication methods policy settings

## Update the Authentication methods policy

Make sure the Authentication methods policy reflects all of the settings from your audit. You might need to adjust some settings to account for differences between the policies. 

## Switch to Migration in Progress

Make changes only in Authentication methods policy. Step through the process to remove each authentication method in the legacy policies. One-by-one. start with SSPR, then MFA. Test after each auth method is removed. 


