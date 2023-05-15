---
title: Global Secure Access as a Conditional Access target resource
description: 

ms.service: network-access
ms.subservice: 
ms.topic: 
ms.date: 05/03/2023

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: mamkumar
---
# Traffic profiles as a Conditional Access target resource

Using Global Secure Access traffic profiles in Conditional Access policy configuration provides administrators with enormous control over their security posture. Administrators can enforce [Zero Trust principles](/security/zero-trust/) using policy at the first attempt of access to the network. Targeting these traffic profiles allows consistent application of policy no matter if the application supports Conditional Access natively or not. For example, applications that may only support basic authentication can now be targeted behind a traffic profile.

This functionality allows administrators to consistently enforce Conditional Access policy based on [traffic profile](LINK-TBD), not just applications or actions. Administrators can target specific traffic profiles like Microsoft 365 with these policies. Users can acquire a token to access these configured endpoints or traffic profiles only when they satisfy the required Conditional Access policies. 

## Prerequisites

* A working Azure AD tenant with the appropriate [Global Secure Access license](NEED-LINK-TO-DOC). If needed, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* Administrators who interact with **Global Secure Access preview** features must have one or more of the following role assignments depending on the tasks they're performing. To follow the [Zero Trust principle of least privilege](/security/zero-trust/), consider using [Privileged Identity Management (PIM)](/azure/active-directory/privileged-identity-management/pim-configure) to activate just-in-time privileged role assignments.
   * [Global Secure Access Administrator role](/azure/active-directory/privileged-identity-management/how-to-manage-admin-access#global-secure-access-administrator-role)
   * [Conditional Access Administrator](/azure/active-directory/roles/permissions-reference#conditional-access-administrator) or [Security Administrator](/azure/active-directory/roles/permissions-reference#security-administrator) to create and interact with Conditional Access policies.
* A Windows client machine with the [Global Secure Access client installed](how-to-install-windows-client.md) and running.
* You must be routing your end-user Microsoft 365 network traffic through the **Global Secure Access preview** using the steps in [Learn how to configure traffic forwarding for Global Secure Access](how-to-configure-traffic-forwarding.md).

## Create a Conditional Access policy targeting the Microsoft 365 traffic profile

The following example policy targets all users except for your break-glass accounts requiring multifactor authentication, device compliance, or hybrid Azure AD join when accessing Microsoft 365 traffic.

1. Sign in to the **Azure portal** as a Conditional Access Administrator or Security Administrator.
1. Browse to **Azure Active Directory** > **Security** > **Conditional Access**.
1. Select **New policy**.
1. Give your policy a name. We recommend that organizations create a meaningful standard for the names of their policies.
1. Under **Assignments**, select **Users or workload identities**.
   1. Under **Include**, select **All users**.
   1. Under **Exclude**, select **Users and groups** and choose your organization's emergency access or break-glass accounts. 
1. Under **Target Resources** > **Network Access (Preview)***.
   1. Choose **M365 traffic**.
1. Under **Access controls** > **Grant**.
   1. Select **Require multifactor authentication**, **Require device to be marked as compliant**, and **Require hybrid Azure AD joined device**
   1. **For multiple controls** select **Require one of the selected controls**.
   1. Select **Select**.

After administrators confirm the policy settings using [report-only mode](howto-conditional-access-insights-reporting.md), an administrator can move the **Enable policy** toggle from **Report-only** to **On**.

## Try your Conditional Access policy targeting the Microsoft 365 traffic profile



## Next steps
