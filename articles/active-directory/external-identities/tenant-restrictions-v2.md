---
title: Configure tenant restrictions - Microsoft Entra ID
description: Use tenant restrictions to control the types of external accounts your users can use on your networks and the devices you manage. You can scope settings to apps, groups, and users for specified tenants.
services: active-directory
ms.service: active-directory
ms.subservice: B2B
ms.topic: how-to
ms.date: 10/04/2023

ms.author: mimart
author: msmimart
manager: celestedg
ms.custom: it-pro
ms.collection: M365-identity-device-management
---

# Set up tenant restrictions v2

> [!NOTE]
> Certain features described in this article are preview features. For more information about previews, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

To enhance security, you can limit what your users can access when they use an external account to sign in from your networks or devices. The **Tenant restrictions** settings, included with [cross-tenant access settings](cross-tenant-access-overview.md), let you create a policy to control access to external apps.

For example, suppose a user in your organization has created a separate account in an unknown tenant, or an external organization has given your user an account that lets them sign in to their organization. You can use tenant restrictions to prevent the user from using some or all external apps while they're signed in with the external account on your network or devices.

:::image type="content" source="media/tenant-restrictions-v2/authentication-flow.png" alt-text="Diagram illustrating tenant restrictions v2.":::


| Steps  | Description  |
|---------|---------|
|**1**     | Contoso configures **Tenant restrictions** in their cross-tenant access settings to block all external accounts and external apps. Contoso enforces the policy on each Windows device by updating the local computer configuration with Contoso's tenant ID and the tenant restrictions policy ID.       |
|**2**     |  A user with a Contoso-managed Windows device tries to sign in to an external app using an account from an unknown tenant. The Windows device adds an HTTP header to the authentication request. The header contains Contoso's tenant ID and the tenant restrictions policy ID.        |
|**3**     | *Authentication plane protection:* Microsoft Entra ID uses the header in the authentication request to look up the tenant restrictions policy in the Microsoft Entra cloud. Because Contoso's policy blocks external accounts from accessing external tenants, the request is blocked at the authentication level.        |
|**4**     | *Data plane protection (preview):* The user tries to access the external application by copying an authentication response token they obtained outside of Contoso's network and pasting it into the Windows device. However, Microsoft Entra ID compares the claim in the token to the HTTP header added by the Windows device. Because they don't match, Microsoft Entra ID blocks the session so the user can't access the application.        |
|||

Tenant restrictions v2 provides options for both authentication plane protection and data plane protection. 

- *Authentication plane protection* refers to using a tenant restrictions v2 policy to block sign-ins using external identities. For example, you can prevent a malicious insider from leaking data over external email by preventing the attacker from signing in to their malicious tenant. Tenant restrictions v2 authentication plane protection is generally available.

- *Data Plane protection* refers to preventing attacks that bypass authentication. For example, an attacker might try to allow access to malicious tenant apps by using Teams anonymous meeting join or SharePoint anonymous file access. Or the attacker might copy an access token from a device in a malicious tenant and import it to your organizational device. Tenant restrictions v2 data plane protection forces the user to authenticate when attempting to access a resource and blocks access if authentication fails.

While [tenant restrictions v1](../manage-apps/tenant-restrictions.md) provide authentication plane protection through a tenant allowlist configured on your corporate proxy, tenant restrictions v2 give you options for granular authentication and data plane protection, with or without a corporate proxy.

## Tenant restrictions v2 overview

In your organization's [cross-tenant access settings](cross-tenant-access-overview.md), you can configure a tenant restrictions v2 policy. After you create the policy, there are three ways to apply the policy in your organization.

- **Universal tenant restrictions v2**. This option provides both authentication plane and data plane protection without a corporate proxy. [Universal tenant restrictions](/azure/global-secure-access/how-to-universal-tenant-restrictions) use Global Secure Access (preview) to tag all traffic no matter the operating system, browser, or device form factor. It allows support for both client and remote network connectivity.
- **Authentication plane tenant restrictions v2**. You can deploy a corporate proxy in your organization and [configure the proxy to set tenant restrictions v2 signals](#option-2-set-up-tenant-restrictions-v2-on-your-corporate-proxy) on all traffic to Microsoft Entra ID and Microsoft Accounts (MSA).
- **Windows tenant restrictions v2**. For your corporate-owned Windows devices, you can enforce both authentication plane and data plane protection by enforcing tenant restrictions directly on devices. Tenant restrictions are enforced upon resource access, providing data path coverage and protection against token infiltration. A corporate proxy isn't required for policy enforcement. Devices can be Microsoft Entra ID managed or domain-joined devices that are managed via Group Policy.

> [!NOTE]
> This article describes how to configure tenant restrictions v2 using the Microsoft Entra admin center. You can also use the [Microsoft Graph cross-tenant access API](/graph/api/resources/crosstenantaccesspolicy-overview?view=graph-rest-beta&preserve-view=true) to create these same tenant restrictions policies.

### Supported scenarios

Tenant restrictions v2 can be scoped to specific users, groups, organizations, or external apps. Apps built on the Windows operating system networking stack are protected, including:

- All Office apps (all versions/release channels).
- Universal Windows Platform (UWP) .NET applications.
- Auth plane protection for all applications that authenticate with Microsoft Entra ID, including all Microsoft first-party applications and any third-party applications that use Microsoft Entra ID for authentication.
- Data plane protection for SharePoint Online and Exchange Online.
- Anonymous access protection for SharePoint Online, OneDrive for business, and Teams (with Federation Controls configured).
- Authentication and Data plane protection for Microsoft tenant or Consumer accounts.
- When using Universal tenant restrictions in Global Secure Access (preview), all browsers and platforms.
- When using Windows Group Policy, Microsoft Edge and all websites in Microsoft Edge.
### Unsupported scenarios

- Anonymous blocking to consumer OneDrive account. Customers can work around at proxy level by blocking https://onedrive.live.com/.
- When a user accesses a third-party app, like Slack, using an anonymous link or non-Azure AD account.
- When a user copies a Microsoft Entra ID-issued token from a home machine to a work machine and uses it to access a third-party app like Slack.
- Per-user tenant restrictions for Microsoft Accounts.


### Compare Tenant restrictions v1 and v2

The following table compares the features in each version.

|  |Tenant restrictions v1  |Tenant restrictions v2  |
|----------------------|---------|---------|
|**Policy enforcement**    | The corporate proxy enforces the tenant restriction policy in the Microsoft Entra ID control plane.         |     Options: <br></br>- Universal tenant restrictions in Global Secure Access (preview), which uses policy signaling to tag all traffic, providing both authentication and data plane support on all platforms. <br></br>- Authentication plane-only protection, where the corporate proxy sets tenant restrictions v2 signals on all traffic. <br></br>- Windows device management, where devices are configured to point Microsoft traffic to the tenant restriction policy, and the policy is enforced in the cloud.     |
|**Policy enforcement limitation**    | Manage corporate proxies by adding tenants to the Microsoft Entra ID traffic allowlist. The character limit of the header value in Restrict-Access-To-Tenants: `<allowed-tenant-list>` limits the number of tenants that can be added. |     Managed by a cloud policy in the cross-tenant access policy. A partner policy is created for each external tenant. Currently, the configuration for all external tenants is contained in one policy with a 25KB size limit.  |
|**Malicious tenant requests** | Microsoft Entra ID blocks malicious tenant authentication requests to provide authentication plane protection.         |    Microsoft Entra ID blocks malicious tenant authentication requests to provide authentication plane protection.     |
|**Granularity**           | Limited.        |   Tenant, user, group, and application granularity. (User-level granularity isn't supported with Microsoft Accounts.)      |
|**Anonymous access**      | Anonymous access to Teams meetings and file sharing is allowed.         |   Anonymous access to Teams meetings is blocked. Access to anonymously shared resources (“Anyone with the link”) is blocked.      |
|**Microsoft Accounts**          |Uses a Restrict-MSA header to block access to consumer accounts.         |  Allows control of Microsoft Accounts (MSA and Live ID) authentication on both the identity and data planes.<br></br>For example, if you enforce tenant restrictions by default, you can create a Microsoft Accounts-specific policy that allows users to access specific apps with their Microsoft Accounts, for example: <br> Microsoft Learn (app ID `18fbca16-2224-45f6-85b0-f7bf2b39b3f3`), or <br> Microsoft Enterprise Skills Initiative (app ID `195e7f27-02f9-4045-9a91-cd2fa1c2af2f`).       |
|**Proxy management**      | Manage corporate proxies by adding tenants to the Microsoft Entra traffic allowlist.         |   For corporate proxy authentication plane protection, configure the proxy to set tenant restrictions v2 signals on all traffic.      |
|**Platform support**      |Supported on all platforms. Provides only authentication plane protection.        |     Universal tenant restrictions in Global Secure Access (preview) support any operating system, browser, or device form factor.<br></br>Corporate proxy authentication plane protection supports macOS, Chrome browser, and .NET applications.<br></br>Windows device management supports Windows operating systems and Microsoft Edge.     |
|**Portal support**        |No user interface in the Microsoft Entra admin center for configuring the policy.         |   User interface available in the Microsoft Entra admin center for setting up the cloud policy.      |
|**Unsupported apps**      |     N/A    |   Block unsupported app use with Microsoft endpoints by using Windows Defender Application Control (WDAC) or Windows Firewall  (for example, for Chrome, Firefox, and so on). See [Block Chrome, Firefox and .NET applications like PowerShell](#block-chrome-firefox-and-net-applications-like-powershell).      |


### Tenant restrictions vs. inbound and outbound settings

Although tenant restrictions are configured along with your cross-tenant access settings, they operate separately from inbound and outbound access settings. Cross-tenant access settings give you control when users sign in with an account from your organization. By contrast, tenant restrictions give you control when users are using an external account. Your inbound and outbound settings for B2B collaboration and B2B direct connect don't affect (and are unaffected by) your tenant restrictions settings.

Think of the different cross-tenant access settings this way:

- Inbound settings control *external* account access to your *internal* apps.
- Outbound settings control *internal* account access to *external* apps.
- Tenant restrictions control *external* account access to *external* apps.

### Tenant restrictions vs. B2B collaboration

When your users need access to external organizations and apps, we recommend enabling tenant restrictions to block external accounts and use B2B collaboration instead. B2B collaboration gives you the ability to:

- Use Conditional Access and force multifactor authentication for B2B collaboration users.
- Manage inbound and outbound access.
- Terminate sessions and credentials when a B2B collaboration user's employment status changes or their credentials are breached.
- Use sign-in logs to view details about the B2B collaboration user.

### Tenant restrictions and Microsoft Teams (preview)

Teams by default has open federation, which means we don't block anyone joining a meeting hosted by an external tenant. For greater control over access to Teams meetings, you can use [Federation Controls](/microsoftteams/manage-external-access) in Teams to allow or block specific tenants, along with tenant restrictions v2 to block anonymous access to Teams meetings. To enforce tenant restrictions for Teams, you need to configure tenant restrictions v2 in your Microsoft Entra cross-tenant access settings. You also need to set up Federation Controls in the Teams Admin portal and restart Teams. Tenant restrictions implemented on the corporate proxy won't block anonymous access to Teams meetings, SharePoint files, and other resources that don't require authentication.

- Teams currently allows users to join <i>any</i> externally hosted meeting using their corporate/home provided identity. You can use outbound cross-tenant access settings to control users with corporate/home provided identity to join externally hosted Teams meetings.
- Tenant restrictions prevent users from using an externally issued identity to join Teams meetings.

#### Pure Anonymous Meeting join

Tenant restrictions v2 automatically block all unauthenticated and externally issued identity access to externally hosted Teams meetings.
For example, suppose Contoso uses Teams Federation Controls to block the Fabrikam tenant. If someone with a Contoso device uses a Fabrikam account to join a Contoso Teams meeting, they're allowed into the meeting as an anonymous user. Now, if Contoso also enables tenant restrictions v2, Teams blocks anonymous access, and the user isn't able to join the meeting.

#### Meeting join using an externally issued identity

You can configure the tenant restrictions v2 policy to allow specific users or groups with externally issued identities to join specific externally hosted Teams meetings. With this configuration, users can sign in to Teams with their externally issued identities and join the specified tenant's externally hosted Teams meetings.


| Auth identity | Authenticated session  | Result |
|----------------------|---------|---------|
|Tenant Member users (authenticated session)<br></br> Example: A user uses their home identity as a member user (for example, user@mytenant.com) | Authenticated |  Tenant restrictions v2 allows access to the Teams meeting. TRv2 never get applied to tenant member users. Cross tenant access inbound/outbound policy applies.  |
|Anonymous (no authenticated session) <br></br> Example: A user tries to use an unauthenticated session, for example in an InPrivate browser window, to access a Teams meeting. | Not authenticated |  Tenant restrictions v2 blocks access to the Teams meeting.  |
|Externally issued identity (authenticated session)<br></br> Example: A user uses any identity other than their home identity (for example, user@externaltenant.com) | Authenticated as an externally issued identity |  Allow or block access to the Teams meeting per Tenant restrictions v2 policy. If allowed by the policy, the user can join the meeting. Otherwise access is blocked. |   

### Tenant restrictions v2 and SharePoint Online

SharePoint Online supports tenant restrictions v2 on both the authentication plane and the data plane.

#### Authenticated sessions

When tenant restrictions v2 are enabled on a tenant, unauthorized access is blocked during authentication. If a user directly accesses a SharePoint Online resource without an authenticated session, they're prompted to sign in. If the tenant restrictions v2 policy allows access, the user can access the resource; otherwise, access is blocked.

#### Anonymous access (preview)

If a user tries to access an anonymous file using their home tenant/corporate identity, they're able to access the file. But if the user tries to access the anonymous file using any externally issued identity, access is blocked.

For example, say a user is using a managed device configured with tenant restrictions v2 for Tenant A. If they select an anonymous access link generated for a Tenant A resource, they should be able to access the resource anonymously. But if they select an anonymous access link generated for Tenant B SharePoint Online, they're prompted to sign-in. Anonymous access to resources using an externally issued identity is always blocked.

### Tenant restrictions v2 and OneDrive

#### Authenticated sessions

When tenant restrictions v2 are enabled on a tenant, unauthorized access is blocked during authentication. If a user directly accesses a OneDrive for Business without an authenticated session, they're prompted to sign in. If the tenant restrictions v2 policy allows access, the user can access the resource; otherwise, access is blocked.

#### Anonymous access (preview)

Like SharePoint, OneDrive for Business supports tenant restrictions v2 on both the authentication plane and the data plane. Blocking anonymous access to OneDrive for business is also supported. For example, tenant restrictions v2 policy enforcement works at the OneDrive for Business endpoint (microsoft-my.sharepoint.com).

#### Not in scope

OneDrive for consumer accounts (via onedrive.live.com) doesn't support tenant restrictions v2. Some URLs (such as onedrive.live.com) are unconverged and use our legacy stack. When a user accesses the OneDrive consumer tenant through these URLs, the policy isn't enforced. As a workaround, you can block https://onedrive.live.com/ at the proxy level.

## Prerequisites

To configure tenant restrictions, you need:

- Microsoft Entra ID P1 or P2
- Account with a role of Global administrator or Security administrator
- Windows devices running Windows 10, Windows 11 with the latest updates

## Configure server-side tenant restrictions v2 cloud policy

### Step 1: Configure default tenant restrictions v2

Settings for tenant restrictions v2 are located in the Microsoft Entra admin center under **Cross-tenant access settings**. First, configure the default tenant restrictions you want to apply to all users, groups, apps, and organizations. Then, if you need partner-specific configurations, you can add a partner's organization and customize any settings that differ from your defaults.

#### To configure default tenant restrictions

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Security administrator](../roles/permissions-reference.md#security-administrator).

1. Browse to **Identity** > **External Identities** > **Cross-tenant access settings**, then select  **Cross-tenant access settings**.

1. Select the **Default settings** tab.

   :::image type="content" source="media/tenant-restrictions-v2/tenant-restrictions-default-section.png" alt-text="Screenshot showing the tenant restrictions section on the default settings tab.":::

1. Scroll to the **Tenant restrictions** section.

1. Select the **Edit tenant restrictions defaults** link.

   :::image type="content" source="media/tenant-restrictions-v2/tenant-restrictions-default-section-edit.png" alt-text="Screenshot showing edit buttons for Default settings.":::

1. If a default policy doesn't exist yet in the tenant, next to the **Policy ID** a **Create Policy** link appears. Select this link.

   :::image type="content" source="media/tenant-restrictions-v2/create-tenant-restrictions-policy.png" alt-text="Screenshot showing the Create Policy link.":::

1. The **Tenant restrictions** page displays both your **Tenant ID** and your tenant restrictions **Policy ID**. Use the copy icons to copy both of these values. You use them later when you configure Windows clients to enable tenant restrictions.

   :::image type="content" source="media/tenant-restrictions-v2/tenant-policy-id.png" alt-text="Screenshot showing the tenant ID and policy ID for the tenant restrictions.":::

1. Select the **External users and groups** tab. Under **Access status**, choose one of the following:

   - **Allow access**: Allows all users who are signed in with external accounts to access external apps (specified on the **External applications** tab).
   - **Block access**: Blocks all users who are signed in with external accounts from accessing external apps (specified on the **External applications** tab).

   :::image type="content" source="media/tenant-restrictions-v2/tenant-restrictions-default-external-users-block.png" alt-text="Screenshot showing settings for access status.":::

   > [!NOTE]
   > Default settings can't be scoped to individual accounts or groups, so **Applies to** always equals **All &lt;your tenant&gt; users and groups**. Be aware that if you block access for all users and groups, you also need to block access to all external applications (on the **External applications** tab).

1. Select the **External applications** tab. Under **Access status**, choose one of the following:

   - **Allow access**: Allows all users who are signed in with external accounts to access the apps specified in the **Applies to** section.
   - **Block access**: Blocks all users who are signed in with external accounts from accessing the apps specified in the **Applies to** section.

   :::image type="content" source="media/tenant-restrictions-v2/tenant-restrictions-default-applications.png" alt-text="Screenshot showing access status on the external applications tab.":::

1. Under **Applies to**, select one of the following:

   - **All external applications**: Applies the action you chose under **Access status** to all external applications. If you block access to all external applications, you also need to block access for all of your users and groups (on the **Users and groups** tab).
   - **Select external applications**: Lets you choose the external applications you want the action under **Access status** to apply to. To select applications, choose **Add Microsoft applications** or **Add other applications**. Then search by the application name or the application ID (either the *client app ID* or the *resource app ID*) and select the app. ([See a list of IDs for commonly used Microsoft applications.](/troubleshoot/azure/active-directory/verify-first-party-apps-sign-in)) If you want to add more apps, use the **Add** button. When you're done, select **Submit**. 

   :::image type="content" source="media/tenant-restrictions-v2/tenant-restrictions-default-applications-applies-to.png" alt-text="Screenshot showing selecting the external applications tab.":::

1. Select **Save**.

### Step 2: Configure tenant restrictions v2 for specific partners

Suppose you use tenant restrictions to block access by default, but you want to allow users to access certain applications using their own external accounts. For example, say you want users to be able to access Microsoft Learn with their own Microsoft Accounts. The instructions in this section describe how to add organization-specific settings that take precedence over the default settings.

#### Example: Configure tenant restrictions v2 to allow Microsoft Accounts

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Security administrator](../roles/permissions-reference.md#security-administrator) or a [Conditional Access administrator](../roles/permissions-reference.md#conditional-access-administrator).

1. Browse to **Identity** > **External Identities** > **Cross-tenant access settings**.

1. Select  **Organizational settings**. 

   > [!NOTE]
   > If the organization you want to add has already been added to the list, you can skip adding it and go directly to modifying the settings.

1. Select **Add organization**.

1. On the **Add organization** pane, type the full domain name (or tenant ID) for the organization.

   **Example**: Search for the following Microsoft Accounts tenant ID:

   ```
   9188040d-6c67-4c5b-b112-36a304b66dad
   ```

   :::image type="content" source="media/tenant-restrictions-v2/add-organization-microsoft-accounts.png" alt-text="Screenshot showing adding an organization.":::

1. Select the organization in the search results, and then select **Add**.

1. Modifying the settings: Find the organization in the **Organizational settings** list, and then scroll horizontally to see the **Tenant restrictions** column. At this point, all tenant restrictions settings for this organization are inherited from your default settings. To change the settings for this organization, select the **Inherited from default** link under the **Tenant restrictions** column.

   :::image type="content" source="media/tenant-restrictions-v2/tenant-restrictions-edit-link.png" alt-text="Screenshot showing an organization added with default settings.":::

1. The **Tenant restrictions** page for the organization appears. Copy the values for **Tenant ID** and **Policy ID**. You use them later when you configure Windows clients to enable tenant restrictions.

   :::image type="content" source="media/tenant-restrictions-v2/org-tenant-policy-id.png" alt-text="Screenshot showing tenant ID and policy ID.":::

1. Select **Customize settings**, and then select the **External users and groups** tab. Under **Access status**, choose an option:

   - **Allow access**: Allows users and groups specified under **Applies to** who are signed in with external accounts to access external apps (specified on the **External applications** tab).
   - **Block access**: Blocks users and groups specified under **Applies to** who are signed in with external accounts from accessing external apps (specified on the **External applications** tab).

   > [!NOTE]
   > For our Microsoft Accounts example, we select **Allow access**.

   :::image type="content" source="media/tenant-restrictions-v2/tenant-restrictions-external-users-organizational.png" alt-text="Screenshot showing selecting the external users allow access selections.":::

1. Under **Applies to**, choose **All &lt;organization&gt; users and groups**. 

   > [!NOTE]
   > User granularity isn't supported with Microsoft Accounts, so the **Select &lt;organization&gt; users and groups** capability isn't available. For other organizations, you could choose **Select &lt;organization&gt; users and groups**, and then perform these steps for each user or group you want to add:
   >
   >- Select **Add external users and groups**.
   >- In the **Select** pane, type the user name or group name in the search box.
   >- Select the user or group in the search results.
   >- If you want to add more, select **Add** and repeat these steps. When you're done selecting the users and groups you want to add, select **Submit**.

   :::image type="content" source="media/tenant-restrictions-v2/tenant-restrictions-external-users-organizational-applies-to.png" alt-text="Screenshot showing selecting the external users and groups selections.":::

1. Select the **External applications** tab. Under **Access status**, choose whether to allow or block access to external applications.

   - **Allow access**: Allows the external applications specified under **Applies to** to be accessed by your users when using external accounts.
   - **Block access**: Blocks the external applications specified under **Applies to** from being accessed by your users when using external accounts.

   > [!NOTE]
   > For our Microsoft Accounts example, we select **Allow access**.

   :::image type="content" source="media/tenant-restrictions-v2/tenant-restrictions-edit-applications-access-status.png" alt-text="Screenshot showing the Access status selections.":::

1. Under **Applies to**, select one of the following:

   - **All external applications**: Applies the action you chose under **Access status** to all external applications.
   - **Select external applications**: Applies the action you chose under **Access status** to all external applications.

   > [!NOTE]
   >
   > - For our Microsoft Accounts example, we choose **Select external applications**.
   > - If you block access to all external applications, you also need to block access for all of your users and groups (on the **Users and groups** tab).

   :::image type="content" source="media/tenant-restrictions-v2/tenant-restrictions-edit-applications-applies-to.png" alt-text="Screenshot showing selecting the Applies to selections.":::

1. If you chose **Select external applications**, do the following for each application you want to add:

   - Select **Add Microsoft applications** or **Add other applications**. For our Microsoft Learn example, we choose **Add other applications**.
   - In the search box, type the application name or the application ID (either the *client app ID* or the *resource app ID*). ([See a list of IDs for commonly used Microsoft applications.](/troubleshoot/azure/active-directory/verify-first-party-apps-sign-in)) For our Microsoft Learn example, we enter the application ID `18fbca16-2224-45f6-85b0-f7bf2b39b3f3`.
   - Select the application in the search results, and then select **Add**.
   - Repeat for each application you want to add.
   - When you're done selecting applications, select **Submit**.

   :::image type="content" source="media/tenant-restrictions-v2/add-learning-app.png" alt-text="Screenshot showing selecting applications.":::

1. The applications you selected are listed on the **External applications** tab. Select **Save**.

   :::image type="content" source="media/tenant-restrictions-v2/add-app-save.png" alt-text="Screenshot showing the selected application.":::

> [!NOTE]
   >
   > Blocking the MSA tenant will not block:
   > - User-less traffic for devices. This includes traffic for Autopilot, Windows Update, and organizational telemetry.
   > - B2B authentication of consumer accounts.
   > - "Passthrough" authentication, used by many Azure apps and Office.com, where apps use Microsoft Entra ID to sign in consumer users in a consumer context.

## Configure client-side tenant restrictions v2

There are three options for enforcing tenant restrictions v2 for clients:

- [Option 1](#option-1-universal-tenant-restrictions-v2-as-part-of-microsoft-entra-global-secure-access-preview): Universal tenant restrictions v2 as part of Microsoft Entra Global Secure Access (preview)
- [Option 2](#option-2-set-up-tenant-restrictions-v2-on-your-corporate-proxy): Set up tenant restrictions v2 on your corporate proxy
- [Option 3](#option-3-enable-tenant-restrictions-on-windows-managed-devices-preview): Enable tenant restrictions on Windows managed devices (preview)

### Option 1: Universal tenant restrictions v2 as part of Microsoft Entra Global Secure Access (preview)

Universal tenant restrictions v2 as part of [Microsoft Entra Global Secure Access](/azure/global-secure-access/overview-what-is-global-secure-access) is recommended because it provides authentication and data plane protection for all devices and platforms. This option provides more protection against sophisticated attempts to bypasses authentication. For example, attackers might try to allow anonymous access to a malicious tenant’s apps, such as anonymous meeting join in Teams. Or, attackers might attempt to import to your organizational device an access token lifted from a device in the malicious tenant. Universal tenant restrictions v2 prevents these attacks by sending tenant restrictions v2 signals on the authentication plane (Microsoft Entra ID and Microsoft Account) and data plane (Microsoft cloud applications).

### Option 2: Set up tenant restrictions v2 on your corporate proxy

Tenant restrictions v2 policies can't be directly enforced on non-Windows 10, Windows 11, or Windows Server 2022 devices, such as Mac computers, mobile devices, unsupported Windows applications, and Chrome browsers. To ensure sign-ins are restricted on all devices and apps in your corporate network, configure your corporate proxy to enforce tenant restrictions v2. Although configuring tenant restrictions on your corporate proxy doesn't provide data plane protection, it does provide authentication plane protection.

> [!IMPORTANT]
> If you've previously set up tenant restrictions, you'll need to stop sending `restrict-msa` to login.live.com. Otherwise, the new settings will conflict with your existing instructions to the MSA login service.

1. Configure the tenant restrictions v2 header as follows:

   |Header name  |Header Value  |
   |---------|---------|
   |`sec-Restrict-Tenant-Access-Policy`     |  `<TenantId>:<policyGuid>`       |

   - `TenantID` is your Microsoft Entra tenant ID. Find this value by signing in to the [Microsoft Entra admin center](https://entra.microsoft.com) as an administrator and browsing to **Identity** > **Overview** and selecting the **Overview** tab.
   - `policyGUID` is the object ID for your cross-tenant access policy. Find this value by calling `/crosstenantaccesspolicy/default` and using the “id” field returned.

1. On your corporate proxy, send the tenant restrictions v2 header to the following Microsoft login domains:

   - login.live.com
   - login.microsoft.com
   - login.microsoftonline.com
   - login.windows.net

   This header enforces your tenant restrictions v2 policy on all sign-ins on your network. This header doesn't block anonymous access to Teams meetings, SharePoint files, or other resources that don't require authentication.

### Migrate tenant restrictions v1 policies to v2

Migrating tenant restriction policies from v1 to v2 is a one-time operation. After migration, no client-side changes are required. You can make any subsequent policy changes via the Microsoft Entra admin center.

On your corporate proxy, you can move from tenant restrictions v1 to tenant restrictions v2 by changing this tenant restrictions v1 header:

`Restrict-Access-To-Tenants: <allowed-tenant-list>`

to this tenant restrictions v2 header:

`sec-Restrict-Tenant-Access-Policy: <DirectoryID>:<policyGUID>`

where `<DirectoryID>` is your Azure AD tenant ID and `<policyGUID>` is the object ID for your cross-tenant access policy.

#### Tenant restrictions v1 settings on the corporate proxy

The following example shows an existing tenant restrictions V1 setting on the corporate proxy:

`Restrict-Access-To-Tenants: contoso.com, fabrikam.com, dogfood.com sec-Restrict-Tenant-Access-Policy: restrict-msa`

[Learn more](../manage-apps/tenant-restrictions.md) about tenant restrictions v1.

#### Tenant restrictions v2 settings on the corporate proxy

You can configure the corporate proxy to enable client-side tagging of the tenant restrictions V2 header by using the following corporate proxy setting:

`sec-Restrict-Tenant-Access-Policy: <DirectoryID>:<policyGUID>`
   
where `<DirectoryID>` is your Azure AD tenant ID and `<policyGUID>` is the object ID for your cross-tenant access policy. For details, see [Set up tenant restrictions v2 on your corporate proxy](#option-2-set-up-tenant-restrictions-v2-on-your-corporate-proxy)

You can configure server-side cloud tenant restrictions v2 policies by following the steps at [Step 2: Configure tenant restrictions v2 for specific partners](#step-2-configure-tenant-restrictions-v2-for-specific-partners). Be sure to follow these guidelines:

- Keep the tenant restrictions v2 default policy that blocks all external tenant access using foreign identities (for example, `user@externaltenant.com`).

- Create a partner tenant policy for each tenant listed in your v1 allowlist by following the steps at [Step 2: Configure tenant restrictions v2 for specific partners](#step-2-configure-tenant-restrictions-v2-for-specific-partners).

- Allow only specific users to access specific applications. This design increases your security posture by limiting access to necessary users only.

- Tenant restrictions v2 policies treat MSA as a partner tenant. Create a partner tenant configuration for MSA by following the steps in [Step 2: Configure tenant restrictions v2 for specific partners](#step-2-configure-tenant-restrictions-v2-for-specific-partners). Because user-level assignment isn't available for MSA tenants, the policy applies to all MSA users. However, application-level granularity is available, and you should limit the applications that MSA or consumer accounts can access to only those applications that are necessary.

> [!NOTE]
>Blocking the MSA tenant will not block user-less traffic for devices, including:
>
>- Traffic for Autopilot, Windows Update, and organizational telemetry.
>- B2B authentication of consumer accounts, or "passthrough" authentication, where Azure apps and Office.com apps use Azure AD to sign in consumer users in a consumer context.

#### Tenant restrictions v2 with no support for break and inspect

For non-Windows platforms, you can break and inspect traffic to add the tenant restrictions v2 parameters into the header via proxy. However, some platforms don't support break and inspect, so tenant restrictions v2 don't work. For these platforms, the following features of Microsoft Entra ID can provide protection:

- [Conditional Access: Only allow use of managed/compliant devices](/mem/intune/protect/conditional-access-intune-common-ways-use#device-based-conditional-access)
- [Conditional Access: Manage access for guest/external users](/microsoft-365/security/office-365-security/identity-access-policies-guest-access)
- [B2B Collaboration: Restrict outbound rules by Cross-tenant access for the same tenants listed in the parameter "Restrict-Access-To-Tenants"](../external-identities/cross-tenant-access-settings-b2b-collaboration.md)
- [B2B Collaboration: Restrict invitations to B2B users to the same domains listed in the "Restrict-Access-To-Tenants" parameter](../external-identities/allow-deny-list.md)
- [Application management: Restrict how users consent to applications](../manage-apps/configure-user-consent.md)
- [Intune: Apply App Policy through Intune to restrict usage of managed apps to only the UPN of the account that enrolled the device](/mem/intune/apps/app-configuration-policies-use-android) (under **Allow only configured organization accounts in apps**)

Although these alternatives provide protection, certain scenarios can only be covered through tenant restrictions, such as the use of a browser to access Microsoft 365 services through the web instead of the dedicated app.

### Option 3: Enable tenant restrictions on Windows managed devices (preview)

After you create a tenant restrictions v2 policy, you can enforce the policy on each Windows 10, Windows 11, and Windows Server 2022 device by adding your tenant ID and the policy ID to the device's **Tenant Restrictions** configuration. When tenant restrictions are enabled on a Windows device, corporate proxies aren't required for policy enforcement. Devices don't need to be Microsoft Entra ID managed to enforce tenant restrictions v2; domain-joined devices that are managed with Group Policy are also supported.

> [!NOTE]
> Tenant restrictions V2 on Windows is a partial solution that protects the authentication and data planes for some scenarios. It works on managed Windows devices and does not protect .NET stack, Chrome, or Firefox. The Windows solution provides a temporary solution until general availability of Universal tenant restrictions in [Microsoft Entra Global Secure Access (preview)](/azure/global-secure-access/overview-what-is-global-secure-access).

#### Administrative Templates (.admx) for Windows 10 November 2021 Update (21H2) and Group policy settings

You can use Group Policy to deploy the tenant restrictions configuration to Windows devices. Refer to these resources:

- [Administrative Templates for Windows 10](https://www.microsoft.com/download/details.aspx?id=104042)
- [Group Policy Settings Reference Spreadsheet for Windows 10](https://www.microsoft.com/download/details.aspx?id=104043)

#### Test the policies on a device

To test the tenant restrictions v2 policy on a device, follow these steps.

> [!NOTE]
>
> - The device must be running Windows 10 or Windows 11 with the latest updates.

1. On the Windows computer, press the Windows key, type **gpedit**, and then select **Edit group policy (Control panel)**.

1. Go to **Computer Configuration** > **Administrative Templates** > **Windows Components** > **Tenant Restrictions**.

1. Right-click **Cloud Policy Details** in the right pane, and then select **Edit**.

1. Retrieve the **Tenant ID** and **Policy ID** you recorded earlier (in step 7 under [To configure default tenant restrictions](#to-configure-default-tenant-restrictions)) and enter them in the following fields (leave all other fields blank):

   - **Microsoft Entra Directory ID**: Enter the **Tenant ID** you recorded earlier. by signing in to the [Microsoft Entra admin center](https://entra.microsoft.com) as an administrator and browsing to **Identity** > **Overview** and selecting the **Overview** tab.
   - **Policy GUID**: The ID for your cross-tenant access policy. It's the **Policy ID** you recorded earlier. You can also find this ID by using the Graph Explorer command [https://graph.microsoft.com/v1.0/policies/crossTenantAccessPolicy/default](https://graph.microsoft.com/v1.0/policies/crossTenantAccessPolicy/default).

   :::image type="content" source="media/tenant-restrictions-v2/windows-cloud-policy-details.png" alt-text="Screenshot of Windows Cloud Policy Details.":::

1. Select **OK**.

#### Block Chrome, Firefox and .NET applications like PowerShell

You can use the Windows Firewall feature to block unprotected apps from accessing Microsoft resources via Chrome, Firefox, and .NET applications like PowerShell. The applications that would be blocked/allowed as per the tenant restrictions v2 policy.

For example, if a customer adds PowerShell to their tenant restrictions v2 CIP policy and has graph.microsoft.com in their tenant restrictions v2 policy endpoint list, then PowerShell should be able to access it with firewall enabled.

1. On the Windows computer, press the Windows key, type **gpedit**, and then select **Edit group policy (Control panel)**.

1. Go to **Computer Configuration** > **Administrative Templates** > **Windows Components** > **Tenant Restrictions**.

1. Right-click **Cloud Policy Details** in the right pane, and then select **Edit**.

1. Select the **Enable firewall protection of Microsoft endpoints** checkbox, and then select **OK**.

:::image type="content" source="media/tenant-restrictions-v2/cloud-policy-block.png" alt-text="Screenshot showing enabling the firewall policy.":::

After you enable the firewall setting, try signing in using a Chrome browser. Sign-in should fail with the following message:
  
:::image type="content" source="media/tenant-restrictions-v2/end-user-access-blocked.png" alt-text="Screenshot showing internet access is blocked.":::

#### View tenant restrictions v2 events

View events related to tenant restrictions in Event Viewer.

1. In Event Viewer, open **Applications and Services Logs**.
1. Navigate to **Microsoft** > **Windows** > **TenantRestrictions** > **Operational** and look for events.  

## Sign-in logs

Microsoft Entra sign-in logs let you view details about sign-ins with a tenant restrictions v2 policy in place. When a B2B user signs into a resource tenant to collaborate, a sign-in log is generated in both the home tenant and the resource tenant. These logs include information such as the application being used, email addresses, tenant name, and tenant ID for both the home tenant and the resource tenant. The following example shows a successful sign-in:

:::image type="content" source="media/tenant-restrictions-v2/sign-in-details-success.png" alt-text="Screenshot showing activity details for a successful sign-in." lightbox="media/tenant-restrictions-v2/sign-in-details-success-large.png":::

If sign-in fails, the Activity Details give information about the reason for failure:

:::image type="content" source="media/tenant-restrictions-v2/sign-in-details-failure.png" alt-text="Screenshot showing activity details for a failed sign-in." lightbox="media/tenant-restrictions-v2/sign-in-details-failure-large.png":::

## Audit logs

The **Audit logs** provide records of system and user activities, including activities initiated by guest users. You can view audit logs for the tenant under Monitoring, or view audit logs for a specific user by navigating to the user's profile.
 
:::image type="content" source="media/tenant-restrictions-v2/audit-logs.png" alt-text="Screenshot showing the Audit logs page.":::

Select an event in the log to get more details about the event, for example:
 
:::image type="content" source="media/tenant-restrictions-v2/audit-log-details.png" alt-text="Screenshot showing Audit Log Details.":::

You can also export these logs from Microsoft Entra ID and use the reporting tool of your choice to get customized reports.

## Microsoft Graph

Use Microsoft Graph to get policy information:

### HTTP request

- Get default policy

   ``` http
   GET https://graph.microsoft.com/beta/policies/crossTenantAccessPolicy/default
   ```

- Reset to system default

   ``` http
   POST https://graph.microsoft.com/beta/policies/crossTenantAccessPolicy/default/resetToSystemDefault
   ```

- Get partner configuration

   ``` http
   GET https://graph.microsoft.com/beta/policies/crossTenantAccessPolicy/partners
   ```

- Get a specific partner configuration

   ``` http
   GET https://graph.microsoft.com/beta/policies/crossTenantAccessPolicy/partners/9188040d-6c67-4c5b-b112-36a304b66dad
   ```

- Update a specific partner

   ``` http
   PATCH https://graph.microsoft.com/beta/policies/crossTenantAccessPolicy/partners/9188040d-6c67-4c5b-b112-36a304b66dad
   ```

### Request body

``` json
"tenantRestrictions": {
    "usersAndGroups": {
        "accessType": "allowed",
        "targets": [
            {
                "target": "AllUsers",
                "targetType": "user"
            }
        ]
    },
    "applications": {
        "accessType": "allowed",
        "targets": [
            {
                "target": "AllApplications",
                "targetType": "application"
            }
        ]
    }
}
```

## Next steps

See [Configure external collaboration settings](external-collaboration-settings-configure.md) for B2B collaboration with non-Azure AD identities, social identities, and non-IT managed external accounts.
