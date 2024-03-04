---
title: Learn about Universal Conditional Access through Global Secure Access
description: Learn about how Microsoft Entra Internet Access and Microsoft Entra Private Access secures access to your resources through Conditional Access.

ms.service: network-access
ms.subservice: 
ms.topic: how-to
ms.date: 07/27/2023

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
   * [Global Secure Access Administrator role](/azure/active-directory/roles/permissions-reference)
   * [Conditional Access Administrator](/azure/active-directory/roles/permissions-reference#conditional-access-administrator) or [Security Administrator](/azure/active-directory/roles/permissions-reference#security-administrator) to create and interact with Conditional Access policies.
* The preview requires a Microsoft Entra ID Premium P1 license. If needed, you can [purchase licenses or get trial licenses](https://aka.ms/azureadlicense).
* To use the Microsoft 365 traffic forwarding profile, a Microsoft 365 E3 license is recommended.

### Known limitations

- Continuous access evaluation is not currently supported for Universal Conditional Access for Microsoft 365 traffic.
- Applying Conditional Access policies to Private Access traffic is not currently supported. To model this behavior, you can apply a Conditional Access policy at the application level for Quick Access and Global Secure Access apps. For more information, see [Apply Conditional Access to Private Access apps](how-to-target-resource-private-access-apps.md).
- Applying Conditional Access policies to Internet traffic is not currently supported. Internet traffic is in private preview. To request access to the private preview, complete [the private preview interest form](https://aka.ms/entra-ia-preview).
- Microsoft 365 traffic can be accessed through remote network connectivity without the Global Secure Access Client; however the Conditional Access policy isn't enforced. In other words, Conditional Access policies for the Global Secure Access Microsoft 365 traffic are only enforced when a user has the Global Secure Access Client.


## Conditional Access policies

With Conditional Access, you can enable access controls and security policies for the network traffic acquired by Microsoft Entra Internet Access and Microsoft Entra Private Access. 

- Create a policy that targets all [Microsoft 365 traffic](how-to-target-resource-microsoft-365-profile.md).
- Apply Conditional Access policies to your [Private Access apps](how-to-target-resource-private-access-apps.md), such as Quick Access.
- Enable [Global Secure Access signaling in Conditional Access](how-to-source-ip-restoration.md) so the source IP address is visible in the appropriate logs and reports.


## User experience

When users sign in to a machine with the Global Secure Access Client installed, configured, and running for the first time they're prompted to sign in. When users attempt to access a resource protected by a policy. like the previous example, the policy is enforced and they're prompted to sign in if they haven't already. Looking at the system tray icon for the Global Secure Access Client you see a red circle indicating it's signed out or not running.

:::image type="content" source="media/how-to-target-resource-microsoft-365-profile/windows-client-pick-an-account.png" alt-text="Screenshot showing the pick an account window for the Global Secure Access Client.":::

When a user signs in the Global Secure Access Client has a green circle that you're signed in, and the client is running.

:::image type="content" source="media/how-to-target-resource-microsoft-365-profile/global-secure-access-client-signed-in.png" alt-text="Screenshot showing the Global Secure Access Client is signed in and running.":::

## Next steps

- [Enable source IP restoration](how-to-source-ip-restoration.md)
- [Create a Conditional Access policy for Microsoft 365 traffic](how-to-target-resource-microsoft-365-profile.md)
- [Create a Conditional Access policy for Private Access apps](how-to-target-resource-private-access-apps.md)