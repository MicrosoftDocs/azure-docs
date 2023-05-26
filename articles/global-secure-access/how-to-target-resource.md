---
title: Traffic profiles as a target resource in Conditional Access
description: How to use a traffic profile in a Conditional Access policy.

ms.service: network-access
ms.subservice: 
ms.topic: how-to
ms.date: 05/23/2023

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: mamkumar
---
# Traffic profiles as a target resource in Conditional Access 

In addition to sending traffic to Global Secure Access, administrators can use Conditional Access policies to secure traffic profiles. They can mix and match controls as needed like requiring multifactor authentication, requiring a compliant device, or defining an acceptable sign in risk.

Conditional Access on traffic profiles provides administrators with enormous control over their security posture. Administrators can enforce [Zero Trust principles](/security/zero-trust/) using policy to manage access to the network. Using traffic profiles allows consistent application of policy. For example, applications that don't support modern authentication can now be protected behind a traffic profile.

This functionality allows administrators to consistently enforce Conditional Access policy based on [traffic profiles](concept-traffic-forwarding.md), not just applications or actions. Administrators can target specific traffic profiles like Microsoft 365, private, or internet with these policies. Users can access these configured endpoints or traffic profiles only when they satisfy the configured Conditional Access policies. 

## Prerequisites

* A working Microsoft Entra ID tenant with the appropriate license. If needed, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* Administrators who interact with **Global Secure Access preview** features must have one or more of the following role assignments depending on the tasks they're performing. To follow the [Zero Trust principle of least privilege](/security/zero-trust/), consider using [Privileged Identity Management (PIM)](../active-directory/privileged-identity-management/pim-configure.md) to activate just-in-time privileged role assignments.
   * [Global Secure Access Administrator role](../active-directory/roles/permissions-reference.md)
   * [Conditional Access Administrator](../active-directory/roles/permissions-reference.md#conditional-access-administrator) or [Security Administrator](../active-directory/roles/permissions-reference.md#security-administrator) to create and interact with Conditional Access policies.
* A Windows client machine with the [Global Secure Access client installed](how-to-install-windows-client.md) and running.
* You must be routing your Microsoft 365, Internet, or private network traffic through the **Global Secure Access preview** using the steps in [How to enable the M365 profile](how-to-enable-m365-profile.md).

## Create a Conditional Access policy targeting the Microsoft 365 traffic profile

The following example policy targets all users except for your break-glass accounts requiring multifactor authentication, device compliance, or hybrid Azure AD join when accessing Microsoft 365 traffic.

<!---Change name of policy when capturing new screenshot to MFA for Microsoft 365 traffic--->
:::image type="content" source="media/how-to-target-resource/target-resource-traffic-profile.png" alt-text="Screenshot showing a Conditional Access policy targeting a traffic profile.":::

1. Sign in to the **Microsoft Entra admin center** as a Conditional Access Administrator or Security Administrator.
1. Browse to **Azure Active Directory** > **Security** > **Conditional Access**.
1. Select **New policy**.
1. Give your policy a name. We recommend that organizations create a meaningful standard for the names of their policies.
1. Under **Assignments**, select **Users or workload identities**.
   1. Under **Include**, select **All users**.
   1. Under **Exclude**:
      1. Select **Users and groups** and choose your organization's emergency access or break-glass accounts. 
      1. Select **Guest or external users** and select all checkboxes.
1. Under **Target Resources** > **Network Access (Preview)***.
   1. Choose **M365 traffic**.
1. Under **Access controls** > **Grant**.
   1. Select **Require multifactor authentication**, **Require device to be marked as compliant**, and **Require hybrid Azure AD joined device**
   1. **For multiple controls** select **Require one of the selected controls**.
   1. Select **Select**.

After administrators confirm the policy settings using [report-only mode](../active-directory/conditional-access/howto-conditional-access-insights-reporting.md), an administrator can move the **Enable policy** toggle from **Report-only** to **On**.

## User experience

When users sign in to a machine with the Global Secure Access client installed, configured, and running they may be prompted to sign in. When users attempt to access a resource protected by a policy like the example above they policy is enforced and will be prompeted to sign in if they havent already. Looking at the system tray icon for the Global Secure Access client you see a red circle indicating it's signed out or not running.

<!---Try to make the icon and state appear larger in some way clean up the notifications area--->
:::image type="content" source="media/how-to-target-resource/windows-client-pick-an-account.png" alt-text="Screenshot showing the pick an account window for the Global Secure Access Client.":::

When a user signs in the Global Secure Access Client has a green circle that you're signed in, and the client is running.

:::image type="content" source="media/how-to-target-resource/global-secure-access-client-signed-in.png" alt-text="Screenshot showing the Global Secure Access Client is signed in and running.":::

<!--- To be added
## FAQs
## Known limitations
## Next steps
Tenant restrictions
Source IP restoration
Compliant network policy
--->