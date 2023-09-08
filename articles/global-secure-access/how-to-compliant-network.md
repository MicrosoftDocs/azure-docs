---
title: Enable compliant network check with Conditional Access
description: Learn how to require known compliant network locations in order to connect to your secured resources with Conditional Access.

ms.service: network-access
ms.subservice: 
ms.topic: how-to
ms.date: 08/09/2023

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: mamkumar
---
# Enable compliant network check with Conditional Access

Organizations who use Conditional Access along with the Global Secure Access preview, can prevent malicious access to Microsoft apps, third-party SaaS apps, and private line-of-business (LoB) apps using multiple conditions to provide defense-in-depth. These conditions may include device compliance, location, and more to provide protection against user identity or token theft. Global Secure Access introduces the concept of a compliant network within Conditional Access and continuous access evaluation. This compliant network check ensures users connect from a verified network connectivity model for their specific tenant and are compliant with security policies enforced by administrators. 

The Global Secure Access Client installed on devices or configured remote network allows administrators to secure resources behind a compliant network with advanced Conditional Access controls. This compliant network makes it easier for administrators to manage and maintain, without having to maintain a list of all of an organization's locations IP addresses. Administrators don't need to hairpin traffic through their organization's VPN egress points to ensure security.

This compliant network check is specific to each tenant. 

- Using this check you can ensure that other organizations using Microsoft's Global Secure Access services can't access your resources. 
   - For example: Contoso can protect their services like Exchange Online and SharePoint Online behind their compliant network check to ensure only Contoso users can access these resources. 
   - If another organization like Fabrikam was using a compliant network check, they wouldn't pass Contoso's compliant network check. 

The compliant network is different than [IPv4, IPv6, or geographic locations](/azure/active-directory/conditional-access/location-condition) you may configure in Microsoft Entra ID. No administrator upkeep is required.

## Prerequisites

* Administrators who interact with **Global Secure Access preview** features must have one or more of the following role assignments depending on the tasks they're performing.
   * The **Global Secure Access Administrator** role to manage the Global Secure Access preview features
   * [Conditional Access Administrator](/azure/active-directory/roles/permissions-reference#conditional-access-administrator) or [Security Administrator](/azure/active-directory/roles/permissions-reference#security-administrator) to create and interact with Conditional Access policies and named locations.
* The preview requires a Microsoft Entra ID Premium P1 license. If needed, you can [purchase licenses or get trial licenses](https://aka.ms/azureadlicense).
* To use the Microsoft 365 traffic forwarding profile, a Microsoft 365 E3 license is recommended.

### Known limitations

- Continuous access evaluation is not currently supported for compliant network check.

## Enable Global Secure Access signaling for Conditional Access

To enable the required setting to allow the compliant network check, an administrator must take the following steps.

1. Sign in to the **Microsoft Entra admin center** as a Global Secure Access Administrator.
1. Select the toggle to **Enable Global Secure Access signaling in Conditional Access**.
1. Browse to **Microsoft Entra ID Conditional Access** > **Named locations**.
   1. Confirm you have a location called **All Compliant Network locations** with location type **Network Access**. Organizations can optionally mark this location as trusted.

:::image type="content" source="media/how-to-compliant-network/toggle-enable-signaling-in-conditional-access.png" alt-text="Screenshot showing the toggle to enable signaling in Conditional Access.":::

> [!CAUTION]
> If your organization has active Conditional Access policies based on compliant network check, and you disable Global Secure Access signaling in Conditional Access, you may unintentionally block targeted end-users from being able to access the resources. If you must disable this feature, first delete any corresponding Conditional Access policies. 

## Protect Exchange and SharePoint Online behind the compliant network

The following example shows a Conditional Access policy that requires Exchange Online and SharePoint Online to be accessed from behind a compliant network as part of the preview.

1. Sign in to the **[Microsoft Entra admin center](https://entra.microsoft.com)** as a Conditional Access Administrator or Security Administrator.
1. Browse to **Microsoft Entra ID** > **Protection** > **Conditional Access**.
1. Select **Create new policy**.
1. Give your policy a name. We recommend that organizations create a meaningful standard for the names of their policies.
1. Under **Assignments**, select **Users or workload identities**.
   1. Under **Include**, select **All users**.
   1. Under **Exclude**, select **Users and groups** and choose your organization's [emergency access or break-glass accounts](#user-exclusions). 
1. Under **Target resources** > **Include**, and select **Select apps**.
   1. Choose **Office 365 Exchange Online** and/or **Office 365 SharePoint Online**.
   1. Office 365 apps are currently NOT supported, so do not select this option.
1. Under **Conditions** > **Location**.
   1. Set **Configure** to **Yes**
   1. Under **Include**, select **Any location**.
   1. Under **Exclude**, select **Selected locations**
      1. Select the **All Compliant Network locations** location.
   1. Select **Select**.
1. Under **Access controls**: 
   1. **Grant**, select **Block Access**, and select **Select**.
1. Confirm your settings and set **Enable policy** to **Report-only**.
1. Select **Create** to create to enable your policy.

After administrators confirm the policy settings using [report-only mode](/azure/active-directory/conditional-access/howto-conditional-access-insights-reporting), an administrator can move the **Enable policy** toggle from **Report-only** to **On**.

### User exclusions

[!INCLUDE [active-directory-policy-exclusions](../../includes/active-directory-policy-exclude-user.md)]

## Try your compliant network policy

1. On an end-user device with the [NaaS client installed and running](how-to-install-windows-client.md)
1. Browse to [https://outlook.office.com/mail/](https://outlook.office.com/mail/) or `https://yourcompanyname.sharepoint.com/`, you have access to resources.
1. Pause the NaaS client by right-clicking the application in the Windows tray and selecting **Pause**.
1. Browse to [https://outlook.office.com/mail/](https://outlook.office.com/mail/) or `https://yourcompanyname.sharepoint.com/`, you're blocked from accessing resources with an error message that says **You cannot access this right now**.

:::image type="content" source="media/how-to-compliant-network/you-cannot-access-this-right-now-error.png" alt-text="Screenshot showing error message in browser window You can't access this right now.":::

## Troubleshooting

Verify the new named location was automatically created using [Microsoft Graph](https://developer.microsoft.com/graph/graph-explorer). 

GET https://graph.microsoft.com/beta/identity/conditionalAccess/namedLocations 

:::image type="content" source="media/how-to-compliant-network/graph-explorer-expected-result-location-creation.png" alt-text="Screenshot showing Graph Explorer results of query":::

[!INCLUDE [Public preview important note](./includes/public-preview-important-note.md)]

## Next steps

[The Global Secure Access Client for Windows (preview)](how-to-install-windows-client.md)
