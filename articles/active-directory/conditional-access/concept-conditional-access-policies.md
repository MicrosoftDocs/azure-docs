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
ms.reviewer: calebb

ms.collection: M365-identity-device-management
---
# Building a Conditional Access policy from the ground up

As explained in the article [What is Conditional Access](overview.md), a Conditional Access policy is an if-then statement that brings signals together, to make decisions, and enforce organizational policies.

How does an organization create these policies? What is required?

![Conditional Access (Signals + Decisions + Enforcement = Policies)](./media/concept-conditional-access-policies/conditional-access-signal-decision-enforcement.png)

## Policy components

A Conditional Access policy is made up of multiple components, segmented into assignments and access controls.

### Assignments

The assignments portion of the Conditional Access policy controls who, what, and where.

#### Users and groups

Users and groups assigns who the policy will include or exclude. This can include all users, specific groups of users, directory roles, or external guest users. 

#### Cloud apps or actions

Cloud apps or actions can include or exclude cloud applications or user actions that will be subject to the policy. This can include all or just specific applications. Or User actions can be assigned like the security information registration process.

#### Conditions

A policy can contain multiple conditions.

##### Sign-in risk

For organizations with [Azure AD Identity Protection](../identity-protection/overview.md), the risk detections generated there can influence your Conditional Access policies.

##### Device platforms

##### Locations

##### Client apps

##### Device state

### Access controls

The access controls portion of the Conditional Access policy controls how a policy is enforced.

#### Grant

##### Block access

##### Grant access

Require multi-factor authentication
Require device to be marked as compliant
Require Hybrid Azure AD joined device
Require approved client app
Require app protection policy

Require all the selected controls 
Require one of the selected controls

#### Session

Use app enforced restrictions
Use Conditional Access App Control
Sign-in requency
Persistent browser session

## Simple policies

A Conditional Access policy must contain at minimum the following to be enabled:

- **Name** of the policy.
- **Assignments**
   - **Users and/or groups** to apply the policy to.
   - **Cloud apps or actions** to apply the policy to.
- **Access controls**
   - **Grant** or **Block** controls

![Blank Conditional Access policy](conditional-access-blank-policy.png)

## Next steps
