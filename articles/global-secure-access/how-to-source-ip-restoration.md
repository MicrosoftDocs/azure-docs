---
title: 
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
# Enabling source IP restoration

Source IP functionality restores the end user’s IP in various locations. Without it enabled downstream services like Exchange Online, SharePoint Online, and others see 147.x.x.x addresses from Global Secure Access. 

## Prerequisites

* A working Azure AD tenant with the appropriate [Global Secure Access license](NEED-LINK-TO-DOC). If needed, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* Administrators who interact with **Global Secure Access preview** features must have one or more of the following role assignments depending on the tasks they're performing. To follow the [Zero Trust principle of least privilege](/security/zero-trust/), consider using [Privileged Identity Management (PIM)](/azure/active-directory/privileged-identity-management/pim-configure) to activate just-in-time privileged role assignments.
   * [Global Secure Access Administrator role](/azure/active-directory/privileged-identity-management/how-to-manage-admin-access#global-secure-access-administrator-role)
   * [Conditional Access Administrator](/azure/active-directory/roles/permissions-reference#conditional-access-administrator) or [Security Administrator](/azure/active-directory/roles/permissions-reference#security-administrator) to create and interact with Conditional Access policies and named locations.
* A Windows client machine with the [Global Secure Access client installed](how-to-install-windows-client.md) and running or a [branch office configured](how-to-create-branch-office-location.md).

## Enable Network Access signaling for Conditional Access

To enable the required setting to allow source IP restoration an administrator must take the following steps.

1. Sign in to the **Azure portal** as a Global Secure Access Administrator.
1. Browse to **NEED THE PATH** > **Security** > **Adaptive Access**.
1. Select the toggle to **Enable Network Access signaling in Conditional Access**.

This functionality allows downstream applications like SharePoint Online and Exchange Online to see the actual source IP address.

> [!WARNING]
> If your organization has active Conditional Access policies based on compliant network, and you disable network access signaling in Conditional Access, you may unintentionally block targeted end-users from being able to access the resources. If you must disable network access signaling, first disable or delete the corresponding Conditional Access policies. 

## Sign-in log behavior

1. Sign in to the **Azure portal** as a [Security Reader](/azure/active-directory/roles/permissions-reference#security-reader).
1. Browse to **Azure Active Directory** > **Users** > select one of your test users > **Sign-in logs**.
1. With source IP restoration enabled, you see IP addresses that include their actual IP address. 
   1. If source IP restoration is disabled, you see NaaS edge IP addresses that begin with 147.

Sign-in log data may take a few minutes to appear, this delay is normal as there's some processing that must take place.

## Next steps
