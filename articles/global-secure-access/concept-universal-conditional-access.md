title: Learn about Universal Conditional Access through Global Secure Access
description: Conditional Access concepts.

ms.service: network-access
ms.subservice: 
ms.topic: how-to
ms.date: 06/21/2023

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: mamkumar
---
# Universal Conditional Access through Global Secure Access

In addition to sending traffic to Global Secure Access (preview), administrators can use Conditional Access policies to secure traffic profiles. They can mix and match controls as needed like requiring multifactor authentication, requiring a compliant device, or defining an acceptable sign-in risk. Applying these controls to network traffic not just cloud applications allows for what we call universal Conditional Access.

Conditional Access on traffic profiles provides administrators with enormous control over their security posture. Administrators can enforce [Zero Trust principles](/security/zero-trust/) using policy to manage access to the network. Using traffic profiles allows consistent application of policy. For example, applications that don't support modern authentication can now be protected behind a traffic profile.

This functionality allows administrators to consistently enforce Conditional Access policy based on [traffic profiles](concept-traffic-forwarding.md), not just applications or actions. Administrators can target specific traffic profiles like Microsoft 365 or private, internal resources with these policies. Users can access these configured endpoints or traffic profiles only when they satisfy the configured Conditional Access policies. 

## Prerequisites

* Administrators who interact with **Global Secure Access preview** features must have one or more of the following role assignments depending on the tasks they're performing.
   * [Global Secure Access Administrator role](../active-directory/roles/permissions-reference.md)
   * [Conditional Access Administrator](../active-directory/roles/permissions-reference.md#conditional-access-administrator) or [Security Administrator](../active-directory/roles/permissions-reference.md#security-administrator) to create and interact with Conditional Access policies.
* A Windows client machine with the [Global Secure Access Client installed](how-to-install-windows-client.md) and running.
* You must be routing your Microsoft 365 and private network traffic through the **Global Secure Access preview**.