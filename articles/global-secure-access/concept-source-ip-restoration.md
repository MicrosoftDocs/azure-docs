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
# Source IP restoration

With a cloud based network proxy between users and their resources, the source IP address that the resources see doesn't always match the actual source IP. In place of the end-users’ source IP, the resource endpoints typically see the cloud proxy as the source IP. Customers that use IP-based location information as a control in Conditional Access typically have issues with traditional SASE solutions breaking this capability. Source IP restoration provides the ability to restore the source IP and allow Conditional Access and other downstream applications to continue to use this in decision making. These IP location-based checks are relied on in places like: [continuous access evaluation](/azure/active-directory/conditional-access/concept-continuous-access-evaluation), [Identity Protection risk detections](/azure/active-directory/identity-protection/concept-identity-protection-risks), [audit logs](/azure/active-directory/reports-monitoring/concept-sign-ins), and [endpoint detection & response (EDR)](/microsoft-365/security/defender-endpoint/overview-endpoint-detection-response).

:::image type="content" source="media/concept-conditional-access/global-secure-access-overview.png" alt-text="Diagram showing NaaS conceptual traffic flow." lightbox="media/concept-conditional-access/global-secure-access-overview.png":::

With Global Secure Access, Microsoft is addressing this difference in apparent IP address by restoring the client IP address seen at the edge, so that source IP enforcement at the destination continues to work as before. The endpoint may have a public IP address of 203.0.113.1, then appear to have an IP of 147.243.229.116 in the sign-in logs in the middle, but using source IP restoration Exchange Online sees the original IP address 203.0.113.1.

## Scenarios

Source IP functionality restores the end user’s IP in various locations. [Learn how to use enriched Office 365 logs for Global Secure Access](how-to-enriched-logs.md), [Learn how to use network logging for Global Secure Access](how-to-network-logging.md), [Learn how to use admin audit logging for Global Secure Access](how-to-admin-audit-logging.md).

When enabled SharePoint Online, Exchange Online, and other applications will see the Source IP where expected in Azure AD and Microsoft 365 services.

## Enable source IP restoration

### Prerequisites

* A working Azure AD tenant with the appropriate [Global Secure Access license](NEED-LINK-TO-DOC). If needed, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* Administrators who interact with the **Global Secure Access preview** features must have one or more of the following role assignments depending on the tasks they're performing. To follow the [Zero Trust principle of least privilege](/security/zero-trust/), consider using [Privileged Identity Management (PIM)](/azure/active-directory/privileged-identity-management/pim-configure) to activate just-in-time privileged role assignments.
   * [Global Secure Access Administrator role](/azure/active-directory/privileged-identity-management/how-to-manage-admin-access#global-secure-access-administrator-role)
   * [Conditional Access Administrator](/azure/active-directory/roles/permissions-reference#conditional-access-administrator) or [Security Administrator](/azure/active-directory/roles/permissions-reference#security-administrator) to create and interact with Conditional Access policies and named locations.
* A Windows client machine with the [Global Secure Access client installed](how-to-install-windows-client.md) and running or a [branch office configured](NEED-LINK-TO-DOC).

### Enable Network Access signaling for Conditional Access

To enable the required setting to allow source IP restoration an administrator must take the following steps.

1. Sign in to the **Azure portal** as a Global Secure Access Administrator.
1. Browse to **NEED THE PATH** > **Security** > **Adaptive Access**.
1. Select the toggle to **Enable Network Access signaling in Conditional Access**.

This functionality allows downstream applications like SharePoint Online and Exchange Online to see the actual source IP address.

> [!WARNING]
> If your organization has active Conditional Access policies based on compliant network, and you disable network access signaling in Conditional Access, you may unintentionally block targeted end-users from being able to access the resources. If you must disable network access signaling, first disable or delete the corresponding Conditional Access policies. 

## Enforcing IP locations with Conditional Access

In the following example we create: 

1. A named location to represent a specific network location like an organization's primary headquarters
1. Then create a Conditional Access policy that requires multifactor authentication for users who aren't in that network location.
1. Then create a Conditional Access policy that enforces continuous access evaluation (CAE) strict location enforcement for Exchange and SharePoint.

This combination of location and Conditional Access policies will allow you to enable and enforce source IP restoration.

### Create a named location

Create a known IPv4 address location to test with using the steps in the article [IPv4 and IPv6 address ranges](../active-directory/conditional-access/location-condition.md#define-locations).

### Create a location based Conditional Access policy requiring multifactor authentication

1. Sign in to the **Azure portal** as a Conditional Access Administrator or Security Administrator.
1. Browse to **Azure Active Directory** > **Security** > **Conditional Access**.
1. Select **New policy**.
1. Give your policy a name. We recommend that organizations create a meaningful standard for the names of their policies.
1. Under **Assignments**, select **Users or workload identities**.
   1. Under **Include**, select **All users**.
   1. Under **Exclude**, select **Users and groups** and choose your organization's emergency access or break-glass accounts. 
1. Under **Cloud apps or actions** > **Include**, and select **All cloud apps**.
1. Under **Conditions** > **Location**.
   1. Set **Configure** to **Yes**
   1. Under **Include**, select **Any location**.
   1. Under **Exclude**, select **Selected locations**
      1. Select the headquarters location you created for your organization in the previous section.
   1. Click **Select**.
1. Under **Access controls** > **Grant**, select **Grant Access**, **Require multifactor authentication**, and select **Select**.
1. Confirm your settings and set **Enable policy** to **Report-only**.
1. Select **Create** to create to enable your policy.

After administrators confirm the policy settings using [report-only mode](howto-conditional-access-insights-reporting.md), an administrator can move the **Enable policy** toggle from **Report-only** to **On**.

#### Try Conditional Access multifactor authentication and source IP restoration

As an administrator with the Global Secure Access Administrator role, if you toggle the source IP restoration feature off, you'll require your end users outside of the network location you created to perform multifactor authentication. This is because the end-user’s IP will now show the **Global Secure Access** IP instead, and your end users appear to not be coming from the named location you configured. 

### Create a location based Conditional Access policy that enables CAE strict location enforcement

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
      1. Select the headquarters location you created for your organization in the previous section.
   1. Click **Select**.
1. Under **Access controls**: 
   1. **Grant**, select **Block Access**, and select **Select**.
   1. **Session**, select **Customize continuous access evaluation**, **Strictly enforce location policies**, and select **Select**.
1. Confirm your settings and set **Enable policy** to **Report-only**.
1. Select **Create** to create to enable your policy.

After administrators confirm the policy settings using [report-only mode](howto-conditional-access-insights-reporting.md), an administrator can move the **Enable policy** toggle from **Report-only** to **On**.

#### Try Conditional Access strict location policies

With this Conditional Access policy and source IP restoration enabled browse to [https://outlook.office365.com](https://outlook.office365.com) from the location you created, this should work. If you disable source IP restoration or change networks (connecting to a hotspot or other external network) and wait a few minutes, you should see a message stating "You cannot access this right now". You'll also see this message if you attempt to sign back in to Outlook. 

Re-enable source IP restoration or switch back to the created network and access should be restored.

## Sign-in log behavior

1. Sign in to the **Azure portal** as a [Security Reader](/azure/active-directory/roles/permissions-reference#security-reader).
1. Browse to **Azure Active Directory** > **Users** > select one of your test users > **Sign-in logs**.
1. With source IP restoration enabled you should see IP addresses that include their actual IP address. 
   1. If source IP restoration is disabled you'll see NaaS edge IP addresses that begin with 147.

Sign-in log data may take a few minutes to appear, this is normal as there's some processing that must take place.

## Next steps
