---
title: Enable compliant network check with Conditional Access
description: Require known compliant network locations with Conditional Access.

ms.service: network-access
ms.subservice: 
ms.topic: 
ms.date: 05/03/2023

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: mamkumar
---
# Enable compliant network check with Conditional Access

Putting resources and applications behind both the network perimeter *and* identity policy engine has advantages over traditional virtual private network (VPN) solutions. Administrators can apply advanced access controls to enforce Zero Trust policies. In the industry, these approaches are sometimes referred to as Secure Access Service Edge (SASE), Security Service Edge (SSE)​, or Zero Trust network access (ZTNA).

In Microsoft's implementation, we allow administrators to enforce user, device, and location based checks using Conditional Access. Administrators can define a set of conditions that must be met and continue to apply in order for access to continue. For example if a user moves from a network that is in scope (a headquarters location) to one that isn't (a deli around the corner), continuous access evaluation can sense this change and take action to block access.

:::image type="content" source="media/concept-conditional-access/global-secure-access-overview.png" alt-text="Diagram showing NaaS conceptual traffic flow." lightbox="media/concept-conditional-access/global-secure-access-overview.png":::

These compliant network locations are specific to each tenant. Branch locations or clients for one organization do not appear in another's.

## Prerequisites

* A working Azure AD tenant with the appropriate [Global Secure Access license](NEED-LINK-TO-DOC). If needed, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* Administrators who interact with **Global Secure Access preview** features must have one or more of the following role assignments depending on the tasks they're performing. To follow the [Zero Trust principle of least privilege](/security/zero-trust/), consider using [Privileged Identity Management (PIM)](/azure/active-directory/privileged-identity-management/pim-configure) to activate just-in-time privileged role assignments.
   * [Global Secure Access Administrator role](/azure/active-directory/privileged-identity-management/how-to-manage-admin-access#global-secure-access-administrator-role)
   * [Conditional Access Administrator](/azure/active-directory/roles/permissions-reference#conditional-access-administrator) or [Security Administrator](/azure/active-directory/roles/permissions-reference#security-administrator) to create and interact with Conditional Access policies and named locations.
* A Windows client machine with the [Global Secure Access client installed](how-to-install-windows-client.md) and running or a [branch office configured](NEED-LINK-TO-DOC).
* You must be routing your end-user Microsoft 365 network traffic through the **Global Secure Access preview** using the steps in [Learn how to configure traffic forwarding for Global Secure Access](how-to-configure-traffic-forwarding.md)

### Enable Network Access signaling for Conditional Access

To enable the required setting to allow source IP restoration an administrator must take the following steps.

1. Sign in to the **Azure portal** as a Global Secure Access Administrator.
1. Browse to **NEED THE ACTUAL PATH** > **Security **> **Adaptive Access**.
1. Select the toggle to **Enable Network Access signaling in Conditional Access**.
1. Browse to **Azure Active Directory** > **Security** > **Conditional Access** > **Named locations**.
   1. Confirm you have a location **All Network Access locations of my tenant** with location type 	
**Network Access**.

> [!CAUTION]
> If your organization has active Conditional Access policies based on compliant network, and you disable network access signaling in Conditional Access, you may unintentionally block targeted end-users from being able to access the resources. If you must disable network access signaling, first disable or delete the corresponding Conditional Access policies. 

## Protect Exchange and SharePoint Online behind the compliant network

The follwoing example shows a Conditional Access policy that requires Exchange Online and SharePoint Online to be accessed from a network location like a branch office or client with the Global Secure Access client installed.

1. Sign in to the **Azure portal** as a Conditional Access Administrator or Security Administrator.
1. Browse to **Azure Active Directory** > **Security** > **Conditional Access**.
1. Select **New policy**.
1. Give your policy a name. We recommend that organizations create a meaningful standard for the names of their policies.
1. Under **Assignments**, select **Users or workload identities**.
   1. Under **Include**, select **All users**.
   1. Under **Exclude**, select **Users and groups** and choose your organization's emergency access or break-glass accounts. 
1. Under **Cloud apps or actions** > **Include**, and select **Select apps**.
   1. Choose **Office 365 Exchange Online** and **Office 365 SharePoint Online**.
1. Under **Conditions** > **Location**.
   1. Set **Configure** to **Yes**
   1. Under **Include**, select **Any location**.
   1. Under **Exclude**, select **Selected locations**
      1. Select the **All Network Access locations of my tenant** location.
   1. Click **Select**.
1. Under **Access controls**: 
   1. **Grant**, select **Block Access**, and select **Select**.
1. Confirm your settings and set **Enable policy** to **Report-only**.
1. Select **Create** to create to enable your policy.

After administrators confirm the policy settings using [report-only mode](howto-conditional-access-insights-reporting.md), an administrator can move the **Enable policy** toggle from **Report-only** to **On**.

## Try your compliant network policy

1. On an end-user device with the [NaaS client installed and running](how-to-install-windows-client.md)
1. Browse to [https://outlook.office.com/mail/](https://outlook.office.com/mail/) or [http://yourcompanyname.sharepoint.com/](http://yourcompanyname.sharepoint.com/), this should allow you access to resources.
1. Pause the NaaS client by right-clicking the application in the Windows tray and selecting **Pause**.
1. Browse to [https://outlook.office.com/mail/](https://outlook.office.com/mail/) or [http://yourcompanyname.sharepoint.com/](http://yourcompanyname.sharepoint.com/), this should block access to resources and you should see an error message that says **You cannot access this right now**.

## Next steps

TBD