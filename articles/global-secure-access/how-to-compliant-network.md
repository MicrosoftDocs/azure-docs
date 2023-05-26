---
title: Enable compliant network check with Conditional Access
description: Require known compliant network locations with Conditional Access.

ms.service: network-access
ms.subservice: 
ms.topic: how-to
ms.date: 05/23/2023

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: mamkumar
---
# Enable compliant network check with Conditional Access

Using Conditional Access along with Global Secure Access customers can prevent malicious access to Microsoft apps, third-party SaaS apps, and private line-of-business (LoB) apps using multiple conditions to provide defense-in-depth. These conditions may include device compliance, location, and more to provide protection against user identity or token theft. Global Secure Access introduces the concept of a compliant network within Conditional Access and continuous access evaluation. This compliant network check ensures users connect from a verified network connectivity model for their specific tenant and are compliant with security policies enforced by administrators. 

Using the Global Secure Access client installed on devices or configured branch office locations allows administrators to secure resource behind a compliant network with advanced Conditional Access controls. This compliant network makes it easier for administrators to manage and maintain, without having to maintain a list of all of an organization's locations IP addresses. Administrators don't need to hairpin traffic through their organization's VPN egress points to ensure security.

This compliant network check is specific to each tenant. 

- Using this check you can ensure that other organizations using Microsoft's Global Secure Access services can't access your resources. 
   - For example: Contoso can protect their services like Exchange Online and SharePoint Online behind their compliant network check to ensure only Contoso users can access these resources. 
   - If another organization like Fabrikam was using a compliant network check, they wouldn't pass Contoso's compliant network check. 

The compliant network is different than [IPv4, IPv6, or country locations](/azure/active-directory/conditional-access/location-condition) you may configure in Microsoft Entra ID. No administrator upkeep is required.

## Prerequisites

* A working Microsoft Entra ID tenant with the appropriate license. If needed, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* Administrators who interact with **Global Secure Access preview** features must have one or more of the following role assignments depending on the tasks they're performing. To follow the [Zero Trust principle of least privilege](/security/zero-trust/), consider using [Privileged Identity Management (PIM)](/azure/active-directory/privileged-identity-management/pim-configure) to activate just-in-time privileged role assignments.
   * Global Secure Access Administrator role
   * [Conditional Access Administrator](/azure/active-directory/roles/permissions-reference#conditional-access-administrator) or [Security Administrator](/azure/active-directory/roles/permissions-reference#security-administrator) to create and interact with Conditional Access policies and named locations.
* A Windows client machine with the [Global Secure Access client installed](how-to-install-windows-client.md) and running or a [branch office configured](how-to-manage-branch-locations.md).
* You must be routing your end-user Microsoft 365 network traffic through the **Global Secure Access preview** using the steps in [How to enable the Microsoft 365 profile](how-to-enable-m365-profile.md).

<!--- Remove to this to general page
### Known limitations

The preview doesn't support IPv6 traffic. IPv6 must be turned off for this preview.

Some Outlook traffic may use the QUIC protocol. Global Secure Access doesn’t yet support the QUIC protocol.
--->

## Enable Global Secure Access signaling for Conditional Access

To enable the required setting to allow the compliant network check, an administrator must take the following steps.

1. Sign in to the **Microsoft Entra admin center** as a Global Secure Access Administrator.
1. Browse to **NEED THE ACTUAL PATH** > **Security**> **Adaptive Access**.
1. Select the toggle to **Enable Global Secure Access signaling in Conditional Access**.
1. Browse to **Azure Active Directory** > **Security** > **Conditional Access** > **Named locations**.
   1. Confirm you have a location **All Network Access locations of my tenant** with location type **Network Access**. Organizations can optionally mark this location as trusted.

:::image type="content" source="media/how-to-compliant-network/toggle-enable-signaling-in-conditional-access.png" alt-text="Screenshot showing the toggle to enable signaling in Conditional Access.":::

> [!CAUTION]
> If your organization has active Conditional Access policies based on compliant network check, and you disable Global Secure Access signaling in Conditional Access, you may unintentionally block targeted end-users from being able to access the resources. If you must disable this feature, first delete any corresponding Conditional Access policies. 

## Protect Exchange and SharePoint Online behind the compliant network

The following example shows a Conditional Access policy that requires Exchange Online and SharePoint Online to be accessed from behind a compliant network.

:::image type="content" source="media/how-to-compliant-network/all-network-access-locations.png" alt-text="Screenshot showing a Conditional Access policy highlighting the All Network Access locations of my tenant location." lightbox="media/how-to-compliant-network/all-network-access-locations.png":::

1. Sign in to the **Microsoft Entra admin center** as a Conditional Access Administrator or Security Administrator.
1. Browse to **Azure Active Directory** > **Security** > **Conditional Access**.
1. Select **New policy**.
1. Give your policy a name. We recommend that organizations create a meaningful standard for the names of their policies.
1. Under **Assignments**, select **Users or workload identities**.
   1. Under **Include**, select **All users**.
   1. Under **Exclude**, select **Users and groups** and choose your organization's emergency access or break-glass accounts. 
1. Under **Target resources** > **Include**, and select **Select apps**.
   1. Choose **Office 365 Exchange Online** and **Office 365 SharePoint Online**.
1. Under **Conditions** > **Location**.
   1. Set **Configure** to **Yes**
   1. Under **Include**, select **Any location**.
   1. Under **Exclude**, select **Selected locations**
      1. Select the **All Network Access locations of my tenant** location.
   1. Select **Select**.
1. Under **Access controls**: 
   1. **Grant**, select **Block Access**, and select **Select**.
1. Confirm your settings and set **Enable policy** to **Report-only**.
1. Select **Create** to create to enable your policy.

After administrators confirm the policy settings using [report-only mode](../active-directory/conditional-access/howto-conditional-access-insights-reporting.md), an administrator can move the **Enable policy** toggle from **Report-only** to **On**.

## Try your compliant network policy

1. On an end-user device with the [NaaS client installed and running](how-to-install-windows-client.md)
1. Browse to [https://outlook.office.com/mail/](https://outlook.office.com/mail/) or [https://yourcompanyname.sharepoint.com/](https://yourcompanyname.sharepoint.com/), you have access to resources.
1. Pause the NaaS client by right-clicking the application in the Windows tray and selecting **Pause**.
1. Browse to [https://outlook.office.com/mail/](https://outlook.office.com/mail/) or [https://yourcompanyname.sharepoint.com/](https://yourcompanyname.sharepoint.com/), you're blocked from accessing resources with an error message that says **You cannot access this right now**.

<!---Add lightbox with more details-->
:::image type="content" source="media/how-to-compliant-network/you-cannot-access-this-right-now-error.png" alt-text="Screenshot showing error message in browser window You cannot access this right now.":::

## Troubleshooting

Verify the new named location was automatically created using [Microsoft Graph](https://developer.microsoft.com/graph/graph-explorer). 

GET https://graph.microsoft.com/beta/identity/conditionalAccess/namedLocations 

:::image type="content" source="media/how-to-compliant-network/graph-explorer-expected-result-location-creation.png" alt-text="Screenshot showing Graph Explorer results of query":::

<!--- To be added
## FAQs
## Known limitations
## Next steps
Tenant restrictions
Source IP restoration
Compliant network policy
--->
