---
title: Global Secure Access (preview) and universal tenant restrictions
description: Learn about how Global Secure Access (preview) secures access to your corporate network by restricting access to external tenants.

ms.service: network-access
ms.subservice: 
ms.topic: how-to
ms.date: 07/27/2023

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: mamkumar
---
# Universal tenant restrictions

Universal tenant restrictions enhance the functionality of [tenant restriction v2](https://aka.ms/tenant-restrictions-enforcement) using Global Secure Access (preview) to tag all traffic no matter the operating system, browser, or device form factor. It allows support for both client and remote network connectivity. Administrators no longer have to manage proxy server configurations or complex network configurations.

Universal Tenant Restrictions does this enforcement using Global Secure Access based policy signaling for both the authentication and data plane. Tenant restrictions v2 enables enterprises to prevent data exfiltration by users using external tenant identities for Microsoft Entra ID integrated applications like Microsoft Graph, SharePoint Online, and Exchange Online. These technologies work together to prevent data exfiltration universally across all devices and networks.

:::image type="content" source="media/how-to-universal-tenant-restrictions/tenant-restrictions-v-2-universal-tenant-restrictions-flow.png" alt-text="Diagram showing how tenant restrictions v2 protects against malicious users." lightbox="media/how-to-universal-tenant-restrictions/tenant-restrictions-v-2-universal-tenant-restrictions-flow.png":::

The following table explains the steps taken at each point in the previous diagram.

| Step | Description |
| --- | --- |
| **1** | Contoso configures a **tenant restrictions v2** policy in their cross-tenant access settings to block all external accounts and external apps. Contoso enforces the policy using Global Secure Access universal tenant restrictions. |
| **2** | A user with a Contoso-managed device tries to access a Microsoft Entra ID integrated app with an unsanctioned external identity. |
| **3** | When the traffic reaches Microsoft's Security Service Edge, an HTTP header is added to the request. The header contains Contoso's tenant ID and the tenant restrictions policy ID. |
| **4** | *Authentication plane protection:* Microsoft Entra ID uses the header in the authentication request to look up the tenant restrictions policy. Contoso's policy blocks unsanctioned external accounts from accessing external tenants. |
| **5** | *Data plane protection:* If the user again tries to access an external unsanctioned application by copying an authentication response token they obtained outside of Contoso's network and pasting it into the device, they're blocked. The resource provider checks that the claim in the token and the header in the packet match. Any mismatch in the token and header triggers reauthentication and blocks access. |

Universal tenant restrictions help to prevent data exfiltration across browsers, devices, and networks in the following ways:

- It injects the following attributes into the header of outbound HTTP traffic at the client level in both the authentication control and data path to Microsoft 365 endpoints:
    - Cloud ID of the device tenant
    - Tenant ID of the device tenant
    - Tenant restrictions v2 policy ID of the device tenant
- It enables Microsoft Entra ID, Microsoft Accounts, and Microsoft 365 applications to interpret this special HTTP header enabling lookup and enforcement of the associated tenant restrictions v2 policy. This lookup enables consistent policy application. 
- Works with all Microsoft Entra ID integrated third-party apps at the auth plane during sign in.
- Works with Exchange, SharePoint, and Microsoft Graph for data plane protection.

## Prerequisites

* Administrators who interact with **Global Secure Access preview** features must have one or more of the following role assignments depending on the tasks they're performing.
   * The **Global Secure Access Administrator** role to manage the Global Secure Access preview features
   * [Conditional Access Administrator](/azure/active-directory/roles/permissions-reference#conditional-access-administrator) or [Security Administrator](/azure/active-directory/roles/permissions-reference#security-administrator) to create and interact with Conditional Access policies and named locations.
* The preview requires a Microsoft Entra ID Premium P1 license. If needed, you can [purchase licenses or get trial licenses](https://aka.ms/azureadlicense).

### Known limitations

- If you have enabled universal tenant restrictions and you are accessing the Microsoft Entra admin center for one of the allow listed tenants, you may see an "Access denied" error. Add the following feature flag to the Microsoft Entra admin center:
    - `?feature.msaljs=true&exp.msaljsexp=true`
    - For example, you work for Contoso and you have allow listed Fabrikam as a partner tenant. You may see the error message for the Fabrikam tenant's Microsoft Entra admin center.
        - If you received the "access denied" error message for this URL: `https://entra.microsoft.com/#home` then add the feature flag as follows: `https://entra.microsoft.com/?feature.msaljs%253Dtrue%2526exp.msaljsexp%253Dtrue#home`


Outlook uses the QUIC protocol for some communications. We don't currently support the QUIC protocol. Organizations can use a firewall policy to block QUIC and fallback to non-QUIC protocol. The following PowerShell command creates a firewall rule to block this protocol.

```PowerShell
@New-NetFirewallRule -DisplayName "Block QUIC for Exchange Online" -Direction Outbound -Action Block -Protocol UDP -RemoteAddress 13.107.6.152/31,13.107.18.10/31,13.107.128.0/22,23.103.160.0/20,40.96.0.0/13,40.104.0.0/15,52.96.0.0/14,131.253.33.215/32,132.245.0.0/16,150.171.32.0/22,204.79.197.215/32,6.6.0.0/16 -RemotePort 443 
```
## Configure tenant restrictions v2 policy 

Before an organization can use universal tenant restrictions, they must configure both the default tenant restrictions and tenant restrictions for any specific partners.

For more information to configure these policies, see the article [Set up tenant restrictions V2 (Preview)](/azure/active-directory/external-identities/tenant-restrictions-v2).

:::image type="content" source="media/how-to-universal-tenant-restrictions/sample-tenant-restrictions-policy-blocking-access.png" alt-text="Screenshot showing a sample tenant restriction policy in the portal." lightbox="media/how-to-universal-tenant-restrictions/sample-tenant-restrictions-policy-blocking-access.png":::

## Enable tagging for tenant restrictions v2

Once you have created the tenant restriction v2 policies, you can utilize Global Secure Access to apply tagging for tenant restrictions v2. An administrator with both the [Global Secure Access Administrator](/azure/active-directory/roles/permissions-reference) and [Security Administrator](/azure/active-directory/roles/permissions-reference#security-administrator) roles must take the following steps to enable enforcement with Global Secure Access.

1. Sign in to the **[Microsoft Entra admin center](https://entra.microsoft.com)** as a Global Secure Access Administrator.
1. Browse to **Global Secure Access** > **Global Settings** > **Session Management**.
1. Select the **Tenant Restrictions** tab.
1. Select the toggle to **Enable tagging to enforce tenant restrictions on your network**.
1. Select **Save**.

:::image type="content" source="media/how-to-universal-tenant-restrictions/toggle-enable-tagging-to-enforce-tenant-restrictions.png" alt-text="Screenshot showing the toggle to enable tagging.":::

## Try Universal tenant restrictions with SharePoint Online.

This capability works the same for Exchange Online and Microsoft Graph in the following examples we explain how to see it in action in your own environment.

### Try the authentication path:

1. With universal tenant restrictions turned off in Global Secure Access global settings.
1. Go to SharePoint Online, `https://yourcompanyname.sharepoint.com/`, with an external identity that isn't allow-listed in a tenant restrictions v2 policy. 
   1. For example, a Fabrikam user in the Fabrikam tenant. 
   1. The Fabrikam user should be able to access SharePoint Online.
1. Turn on universal tenant restrictions.
1. As an end-user, with the Global Secure Access Client running, go to SharePoint Online with an external identity that hasn't been explicitly allow-listed. 
   1. For example, a Fabrikam user in the Fabrikam tenant. 
   1. The Fabrikam user should be blocked from accessing SharePoint Online with an error message saying: 
      1. **Access is blocked, The Contoso IT department has restricted which organizations can be accessed. Contact the Contoso IT department to gain access.**

### Try the data path  

1. With universal tenant restrictions turned off in Global Secure Access global settings.
1. Go to SharePoint Online, `https://yourcompanyname.sharepoint.com/`, with an external identity that isn't allow-listed in a tenant restrictions v2 policy. 
   1. For example, a Fabrikam user in the Fabrikam tenant. 
   1. The Fabrikam user should be able to access SharePoint Online.
1. In the same browser with SharePoint Online open, go to Developer Tools, or press F12 on the keyboard. Start capturing the network logs. You should see Status 200, when everything is working as expected. 
1. Ensure the **Preserve log** option is checked before continuing.
1. Keep the browser window open with the logs.  
1. Turn on universal tenant restrictions.
1. As the Fabrikam user, in the browser with SharePoint Online open, within a few minutes, new logs appear. Also, the browser may refresh itself based on the request and responses happening in the back-end. If the browser doesn't automatically refresh after a couple of minutes, hit refresh on the browser with SharePoint Online open. 
   1. The Fabrikam user sees that their access is now blocked saying: 
      1. **Access is blocked, The Contoso IT department has restricted which organizations can be accessed. Contact the Contoso IT department to gain access.** 
1. In the logs, look for a **Status** of 302. This row shows universal tenant restrictions being applied to the traffic. 
   1. In the same response, check the headers for the following information identifying that universal tenant restrictions were applied:
      1. `Restrict-Access-Confirm: 1`
      1. `x-ms-diagnostics: 2000020;reason="xms_trpid claim was not present but sec-tenant-restriction-access-policy header was in requres";error_category="insufficiant_claims"`

[!INCLUDE [Public preview important note](./includes/public-preview-important-note.md)]

## Next steps

The next step for getting started with Microsoft Entra Internet Access is to [Enable enhanced Global Secure Access signaling](how-to-source-ip-restoration.md#enable-global-secure-access-signaling-for-conditional-access).

For more information on Conditional Access policies for Global Secure Access (preview), see the following articles:

- [Set up tenant restrictions V2 (Preview)](/azure/active-directory/external-identities/tenant-restrictions-v2)
- [Source IP restoration](how-to-source-ip-restoration.md)
- [Enable compliant network check with Conditional Access](how-to-compliant-network.md)
