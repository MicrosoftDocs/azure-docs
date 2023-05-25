---
title: Global Secure Access and universal tenant restrictions
description: What are universal tenant restrictions

ms.service: network-access
ms.subservice: 
ms.topic: how-to
ms.date: 05/23/2023

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: mamkumar
---
# Universal tenant restrictions

Universal tenant restrictions enhance the functionality of [tenant restriction v2](https://aka.ms/tenant-restrictions-enforcement) using Global Secure Access to tag all traffic no matter the operating system, browser, or device form factor. It allows support for both client and branch connectivity. Administrators no longer have to manage proxy server configurations or complex network configurations.

Universal Tenant Restrictions does this enforcement using Global Secure Access based policy signaling for both the authentication and data plane endpoints. Tenant restrictions v2 enables enterprises to prevent data exfiltration by malicious users using external tenant identities for Azure AD integrated applications like Microsoft Graph, SharePoint Online, and Exchange Online. These technologies work together to prevent data exfiltration universally across all devices and networks.

:::image type="content" source="media/how-to-universal-tenant-restrictions/tenant-restrictions-v-2-universal-tenant-restrictions-flow.png" alt-text="Diagram showing how tenant restrictions v2 protects against malicious users." lightbox="media/how-to-universal-tenant-restrictions/tenant-restrictions-v-2-universal-tenant-restrictions-flow.png":::

The following table explains the steps taken at each point in the previous diagram.

| Step | Description |
| --- | --- |
| **1** | Contoso configures a **tenant restrictions v2** policy in their cross-tenant access settings to block all external accounts and external apps. Contoso enforces the policy using Global Secure Access universal tenant restrictions. |
| **2** | A user with a Contoso-managed device tries to sign in to an external app using an account from an unknown tenant. Global Secure Access universal tenant restrictions add an HTTP header to the authentication request. The header contains Contoso's tenant ID and the tenant restrictions policy ID. |
| **3** | *Authentication plane protection:* Azure AD uses the header in the authentication request to look up the tenant restrictions policy in Azure AD. Because Contoso's policy blocks external accounts from accessing external tenants, the request is blocked at the authentication level. |
| **4** | *Data plane protection:* The user again tries to access the external application by copying an authentication response token they obtained outside of Contoso's network and pasting it into the device. The resource provider checks that the claim in the token and the header in the packet match. Any mismatch in the token and header triggers reauthentication. |

Universal tenant restrictions help to prevent data exfiltration across browsers, devices, and networks in the following ways:

- It injects the following attributes into the header of outbound HTTP traffic at the client level in both the authentication control and data path to Microsoft 365 endpoints:
    - Cloud ID of the device tenant
    - Tenant ID of the device tenant
    - Tenant restrictions v2 policy ID of the device tenant
- It enables Azure AD, Microsoft Accounts, and Microsoft 365 applications to interpret this special HTTP header enabling lookup and enforcement of the associated tenant restrictions v2 policy. This lookup enables consistent policy application. 
- Works with all Azure AD integrated third-party apps at the auth plane during sign in.

## Configure tenant restrictions v2 policy 

Before an organization can use universal tenant restrictions, they must configure both the default tenant restrictions and tenant restrictions for any specific partners.

For more information to configure these policies, see the article [Set up tenant restrictions V2 (Preview)](https://review.learn.microsoft.com/en-us/azure/active-directory/external-identities/tenant-restrictions-v2?branch=pr-en-us-204786#step-1-configure-default-tenant-restrictions-v2).

:::image type="content" source="media/how-to-universal-tenant-restrictions/sample-tenant-restrictions-policy-blocking-access.png" alt-text="Screenshot showing a sample tenant restriction policy in the portal." lightbox="media/how-to-universal-tenant-restrictions/sample-tenant-restrictions-policy-blocking-access.png":::

## Enable tagging for tenant restrictions v2

Once you have created the tenant restriction v2 policies, you must allow Global Secure Access to apply tagging for tenant restrictions v2. An administrator with both the [Global Secure Access Administrator](../active-directory/roles/permissions-reference.md) and [Security Administrator](../active-directory/roles/permissions-reference.md#security-administrator) roles must take the following steps to enable enforcement with Global Secure Access.

1. Sign in to the **Azure portal** as a Global Secure Access Administrator.
1. Browse to **NEED THE ACTUAL PATH** > **Security** > **Tenant Restrictions**.
1. Select the toggle to **Enable tagging to enforce tenant restrictions on your network**.

:::image type="content" source="media/how-to-universal-tenant-restrictions/toggle-enable-tagging-to-enforce-tenant-restrictions.png" alt-text="Screenshot showing the toggle to enable tagging.":::

## Try Universal tenant restrictions with SharePoint Online.

This capability works the same for Exchange Online and Microsoft Graph in the following examples we explain how to see it in action in your own environment.

### Try the authentication path:

1. With universal tenant restrictions turned off in Global Secure Access global settings.
1. Go to SharePoint Online, [https://yourcompanyname.sharepoint.com/](https://yourcompanyname.sharepoint.com/), with an external identity that isn't allow-listed in a tenant restrictions v2 policy. 
   1. For example, a Fabrikam guest in the Contoso tenant. 
   1. The Fabrikam user should be able to access SharePoint Online.
1. Turn on universal tenant restrictions.
1. As an end-user, with the Global Secure Access client running, go to SharePoint Online with an external identity that hasn't been explicitly allow-listed. 
   1. For example, a Fabrikam guest in the Contoso tenant. 
   1. The Fabrikam user should be blocked from accessing SharePoint Online with an error message saying: 
      1. **Access is blocked, The Contoso IT department has restricted which organizations can be accessed. Contact the Contoso IT department to gain access.**

### Try the data path  

1. With universal tenant restrictions turned off in Global Secure Access global settings.
1. Go to SharePoint Online, [https://yourcompanyname.sharepoint.com/](https://yourcompanyname.sharepoint.com/), with an external identity that isn't allow-listed in a tenant restrictions v2 policy. 
   1. For example, a Fabrikam guest in the Contoso tenant. 
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

<!--- To be added
## FAQs
## Known limitations
## Next steps
Tenant restrictions
Source IP restoration
Compliant network policy
--->
