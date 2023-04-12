---
title: How to manage admin access
description: Learn how to manage admin access for Global Secure Access.
author: kenwith
ms.author: kenwith
manager: amycolannino
ms.topic: how-to
ms.date: 03/22/2023
ms.service: network-access
ms.custom: 
---


<!-- 1. H1
Required. Set expectations for what the content covers, so customers know the 
content meets their needs. H1 format is # What is <product/service>?
-->

# Learn how to manage admin access for Global Secure Access
Certain Active Directory roles are required to manage Global Secure Access. In particular, you must understand these roles: global administrator, applications administrator, conditional access administrator, compliance administrator, and global reader. To learn more about these roles in Active Directory, see [Active Directory built-in roles](../active-directory/roles/permissions-reference.md).

## Active Directory roles with access to Global Secure Access

By default, the following existing Active Directory admin roles have access to Global Secure Access.
* Global Administrator: Have full permissions in Global Secure Access. They can add admins (only global admin), add policies, profiles, and settings.
* Applications Administrator – can manage all the aspects of app discovery, including app onboarding and app connector management.
* Conditional Access Administrator – can link/unlink filtering policies to Conditional Access policies.
* Compliance Administrator - Can manage Enterprise DLP settings (but can't push configuration changes).
* Global Reader: Has full read-only access to all aspects of Global Secure Access. Can't change any settings or take any actions. No access to logs.

## Global Secure Access Administrator role

Users with this role have global permissions within Global Secure Access solutions, including full read-write access to the admin portal for Microsoft Entra Internet Access and Microsoft Entra Private Access. 
This role does not grant the ability to manage enterprise applications, application registrations, and application proxy settings.

## Peripheral tasks
Even with Global Secure Access Administrator role, you will need additional permissions. 

For example:

|Scenario  |Area       |Role        |
|----------|-----------|------------|
|Enriched Microsoft 365|Logs |        |
|Enable Quick Access|Private Access   |Application Administrator, Global Administrator |
|Associating Conditional Access policies with network filtering policies|Common (Conditional Access) |Conditional Access Administrator, Security Administrator, Global Administrator|
|Set the target resource type to *Network Access (Preview)* and select the appropriate traffic profile in Conditional Access policies| Common (Conditional Access)|Conditional Access Administrator, Security Administrator, Global Administrator|
|Enable use of NaaS service in Conditional Access’ (Conditional Access Signaling) | Common (Conditional Access) | Conditional Access Administrator, Security Administrator, Global Administrator|
 

## Admin activity auditing

Admin activity logs include audit logs, which is a comprehensive report on every logged event in Global Secure Access. Changes to profiles, policies, rules, and additional entities are all captured in the Active Directory audit logs.


<!-- 4. Next steps
Required. Provide at least one next step and no more than three. Include some 
context so the customer can determine why they would click the link.
-->

## Next steps
<!-- Add a context sentence for the following links -->
- [Get started with Global Secure Access](how-to-get-started-with-global-secure-access.md)

