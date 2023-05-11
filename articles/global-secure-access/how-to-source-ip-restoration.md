---
title: Enable source IP restoration
description: Learn how to enable source IP restoration to ensure source IP match in downstream resources.

ms.service: network-access
ms.subservice: 
ms.topic: 
ms.date: 05/11/2023

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: mamkumar
---
# Enabling source IP restoration

With a cloud based network proxy between users and their resources, the source IP address that the resources see doesn't always match the actual source IP. In place of the end-users’ source IP, the resource endpoints typically see the cloud proxy as the source IP. Customers that use IP-based location information as a control in Conditional Access typically have issues with these traditional SASE solutions breaking this capability. 

Without source IP restoration enabled, administrators and services are unable to properly identify traffic. In areas like sign-in logs, administrators see IP addresses from Global Secure Access, not a user's actual source IP.

Source IP restoration allows services to see the real source IP address, these services include: [Conditional Access](/azure/active-directory/conditional-access/overview), [continuous access evaluation](/azure/active-directory/conditional-access/concept-continuous-access-evaluation), [Identity Protection risk detections](/azure/active-directory/identity-protection/concept-identity-protection-risks), [sign-in logs](/azure/active-directory/reports-monitoring/concept-sign-ins), and [endpoint detection & response (EDR)](/microsoft-365/security/defender-endpoint/overview-endpoint-detection-response).

INSERT A SCREENSHOT SIGN IN LOGS SHOWING ENTRIES WITH ENABLED AND DISABLED SOURCE IP RESTORATION

## Prerequisites

* A working Azure AD tenant with the appropriate [Global Secure Access license](NEED-LINK-TO-DOC). If needed, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* Administrators who interact with **Global Secure Access preview** features must have one or more of the following role assignments depending on the tasks they're performing. To follow the [Zero Trust principle of least privilege](/security/zero-trust/), consider using [Privileged Identity Management (PIM)](/azure/active-directory/privileged-identity-management/pim-configure) to activate just-in-time privileged role assignments.
   * [Global Secure Access Administrator role](/azure/active-directory/privileged-identity-management/how-to-manage-admin-access#global-secure-access-administrator-role)
* A Windows client machine with the [Global Secure Access client installed](how-to-install-windows-client.md) and running or a [branch office configured](how-to-create-branch-office-location.md).

## Enable Global Secure Access signaling for Conditional Access

To enable the required setting to allow source IP restoration, an administrator must take the following steps.

1. Sign in to the **Azure portal** as a Global Secure Access Administrator.
1. Browse to **NEED THE PATH** > **Security** > **Adaptive Access**.
1. Select the toggle to **Enable Network Access signaling in Conditional Access**.

This functionality allows services like Azure AD, SharePoint Online and Exchange Online to see the actual source IP address.

> [!CAUTION]
> If your organization has active Conditional Access policies based on compliant network, and you disable network access signaling in Conditional Access, you may unintentionally block targeted end-users from being able to access the resources. If you must disable network access signaling, first disable or delete the corresponding Conditional Access policies. 

## Sign-in log behavior

To see source IP restoration in action administrators can take the following steps.

1. Sign in to the **Azure portal** as a [Security Reader](/azure/active-directory/roles/permissions-reference#security-reader).
1. Browse to **Azure Active Directory** > **Users** > select one of your test users > **Sign-in logs**.
1. With source IP restoration enabled, you see IP addresses that include their actual IP address. 
   1. If source IP restoration is disabled, you see NaaS edge IP addresses that begin with 147.

Sign-in log data may take some time to appear, this delay is normal as there's some processing that must take place.

## Next steps

TBD