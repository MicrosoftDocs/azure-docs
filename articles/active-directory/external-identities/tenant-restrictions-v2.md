---
title: Configure tenant restrictions - Azure AD
description: Use tenant restrictions to control the types of external accounts your users can use on your networks and the devices you manage. You can scope settings to apps, groups, and users for specified tenants.
services: active-directory
ms.service: active-directory
ms.subservice: B2B
ms.topic: how-to
ms.date: 05/17/2023

ms.author: mimart
author: msmimart
manager: celestedg
ms.custom: it-pro, devx-track-dotnet
ms.collection: M365-identity-device-management
---

# Set up tenant restrictions V2 (Preview)

> [!NOTE]
> The **Tenant restrictions** settings, which are included with cross-tenant access settings, are preview features of Azure Active Directory. For more information about previews, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

For increased security, you can limit what your users can access when they use an external account to sign in from your networks or devices. With the **Tenant restrictions** settings included with [cross-tenant access settings](cross-tenant-access-overview.md), you can control the external apps that your Windows device users can access when they're using external accounts.

For example, let's say a user in your organization has created a separate account in an unknown tenant, or an external organization has given your user an account that lets them sign in to their organization. You can use tenant restrictions to prevent the user from using some or all external apps while they're signed in with the external account on your network or devices.

:::image type="content" source="media/tenant-restrictions-v2/authentication-flow.png" alt-text="Diagram illustrating tenant restrictions v2.":::

|  |  |
|---------|---------|
|**1**     | Contoso configures **Tenant restrictions** in their cross-tenant access settings to block all external accounts and external apps. Contoso enforces the policy on each Windows device by updating the local computer configuration with Contoso's tenant ID and the tenant restrictions policy ID.       |
|**2**     |  A user with a Contoso-managed Windows device tries to sign in to an external app using an account from an unknown tenant. The Windows device adds an HTTP header to the authentication request. The header contains Contoso's tenant ID and the tenant restrictions policy ID.        |
|**3**     | *Authentication plane protection:* Azure AD uses the header in the authentication request to look up the tenant restrictions policy in the Azure AD cloud. Because Contoso's policy blocks external accounts from accessing external tenants, the request is blocked at the authentication level.        |
|**4**     | *Data plane protection:* The user tries to access the external application by copying  an authentication response token they obtained outside of Contoso's network and pasting it into the Windows device. However, Azure AD compares the claim in the token to the HTTP header added by the Windows device. Because they don't match, Azure AD blocks the session so the user can't access the application.        |
|||

This article describes how to configure tenant restrictions V2 using the Azure portal. You can also use the [Microsoft Graph cross-tenant access API](/graph/api/resources/crosstenantaccesspolicy-overview?view=graph-rest-beta&preserve-view=true) to create these same tenant restrictions policies.

## Tenant restrictions V2 overview

Azure AD offers two versions of tenant restrictions policies:

- Tenant restrictions V1, described in [Set up tenant restrictions V1 for B2B collaboration](../manage-apps/tenant-restrictions.md), let you restrict access to external tenants by configuring a tenant allowlist on your corporate proxy.
- Tenant restrictions V2, described in this article, let you apply policies directly to your users' Windows devices instead of through your corporate proxy, reducing overhead and providing more flexible, granular control.

### Supported scenarios

Tenant restrictions V2 can be scoped to specific users, groups, organizations, or external apps. Apps built on the Windows operating system networking stack are protected, including:

- All Office apps (all versions/release channels).
- Universal Windows Platform (UWP) .NET applications.
- Microsoft Edge and all websites in Microsoft Edge.
- Auth plane protection for all applications that authenticate with Azure AD, including all Microsoft first-party applications and any third-party applications that use Azure AD for authentication.
- Data plane protection for SharePoint Online and Exchange Online.
- Anonymous access protection for SharePoint Online, OneDrive for business, and Teams (with Federation Controls configured).
- Authentication and Data plane protection for Microsoft tenant or Consumer accounts.

### Unsupported scenarios

- Chrome, Firefox, and .NET applications such as PowerShell.
- Anonymous blocking to consumer OneDrive account. Customers can work around at proxy level by blocking https://onedrive.live.com/.
- When a user accesses a third-party app, like Slack, using an anonymous link or non-Azure AD account.
- When a user copies an Azure AD-issued token from a home machine to a work machine and uses it to access a third-party app like Slack.

### Compare Tenant restrictions V1 and V2

The following table compares the features in each version.

|  |Tenant restrictions V1  |Tenant restrictions V2  |
|----------------------|---------|---------|
|**Policy enforcement**    | The corporate proxy enforces the tenant restriction policy in the Azure AD control plane.         |     Windows devices are configured to point Microsoft traffic to the tenant restriction policy, and the policy is enforced in the cloud. Tenant restrictions are enforced upon resource access, providing data path coverage and protection against token infiltration. For non-Windows devices, the corporate proxy enforces the policy.    |
|**Malicious tenant requests** | Azure AD blocks malicious tenant authentication requests to provide authentication plane protection.         |    Azure AD blocks malicious tenant authentication requests to provide authentication plane protection.     |
|**Granularity**           | Limited.        |   Tenant, user, group, and application granularity.      |
|**Anonymous access**      | Anonymous access to Teams meetings and file sharing is allowed.         |   Anonymous access to Teams meetings is blocked. Access to anonymously shared resources (“Anyone with the link”) is blocked.      |
|**Microsoft accounts (MSA)**          |Uses a Restrict-MSA header to block access to consumer accounts.         |  Allows control of Microsoft account (MSA and Live ID) authentication on both the identity and data planes. For example, if you enforce tenant restrictions by default, you can create a Microsoft accounts-specific policy that allows users to access specific apps with their Microsoft accounts, for example: <br> Microsoft Learn (app ID `18fbca16-2224-45f6-85b0-f7bf2b39b3f3`), or <br> Microsoft Enterprise Skills Initiative (app ID `195e7f27-02f9-4045-9a91-cd2fa1c2af2f`).       |
|**Proxy management**      | Manage corporate proxies by adding tenants to the Azure AD traffic allowlist.         |   N/A      |
|**Platform support**      |Supported on all platforms. Provides only authentication plane protection.        |     Supported on Windows operating systems and Microsoft Edge by adding the tenant restrictions V2 header using Windows Group Policy. This configuration provides both authentication plane and data plane protection.<br></br>On other platforms, like macOS, Chrome browser, and .NET applications, tenant restrictions V2 are supported when the tenant restrictions V2 header is added by the corporate proxy. This configuration provides only authentication plane protection.     |
|**Portal support**        |No user interface in the Azure portal for configuring the policy.         |   User interface available in the Azure portal for setting up the cloud policy.      |
|**Unsupported apps**      |     N/A    |   Block unsupported app use with Microsoft endpoints by using Windows Defender Application Control (WDAC) or Windows Firewall  (for example, for Chrome, Firefox, and so on). See [Block Chrome, Firefox and .NET applications like PowerShell](#block-chrome-firefox-and-net-applications-like-powershell).      |

### Migrate tenant restrictions V1 policies to V2

Along with using tenant restrictions V2 to manage access for your Windows device users, we recommend configuring your corporate proxy to enforce tenant restrictions V2 to manage other devices and apps in your corporate network. Although configuring tenant restrictions on your corporate proxy doesn't provide data plane protection, it provides authentication plane protection. For details, see [Step 4: Set up tenant restrictions V2 on your corporate proxy](#step-4-set-up-tenant-restrictions-v2-on-your-corporate-proxy).

### Tenant restrictions vs. inbound and outbound settings

Although tenant restrictions are configured along with your cross-tenant access settings, they operate separately from inbound and outbound access settings. Cross-tenant access settings give you control when users sign in with an account from your organization. By contrast, tenant restrictions give you control when users are using an external account. Your inbound and outbound settings for B2B collaboration and B2B direct connect don't affect (and are unaffected by) your tenant restrictions settings.

Think of the different cross-tenant access settings this way:

- Inbound settings control *external* account access to your *internal* apps.
- Outbound settings control *internal* account access to *external* apps.
- Tenant restrictions control *external* account access to *external* apps.

### Tenant restrictions vs. B2B collaboration

When your users need access to external organizations and apps, we recommend enabling tenant restrictions to block external accounts and use B2B collaboration instead. B2B collaboration gives you the ability to:

- Use Conditional Access and force multi-factor authentication for B2B collaboration users.
- Manage inbound and outbound access.
- Terminate sessions and credentials when a B2B collaboration user's employment status changes or their credentials are breached.
- Use sign-in logs to view details about the B2B collaboration user.

### Tenant restrictions and Microsoft Teams

Teams by default has open federation, which means we do not block anyone joining a meeting hosted by an external tenant. For greater control over access to Teams meetings, you can use [Federation Controls](/microsoftteams/manage-external-access) in Teams to allow or block specific tenants, along with tenant restrictions V2 to block anonymous access to Teams meetings. To enforce tenant restrictions for Teams, you need to configure tenant restrictions V2 in your Azure AD cross-tenant access settings. You also need to set up Federation Controls in the Teams Admin portal and restart Teams. Tenant restrictions implemented on the corporate proxy won't block anonymous access to Teams meetings, SharePoint files, and other resources that don't require authentication.

- Teams currently allows users to join <i>any</i> externally hosted meeting using their corporate/home provided identity. You can use outbound cross-tenant access settings to control users with corporate/home provided identity to join externally hosted Teams meetings.
- Tenant restrictions prevent users from using an externally issued identity to join Teams meetings.

#### Pure Anonymous Meeting join

Tenant restrictions V2 automatically block all unauthenticated and externally-issued identity access to externally-hosted Teams meetings.
For example, suppose Contoso uses Teams Federation Controls to block the Fabrikam tenant. If someone with a Contoso device uses a Fabrikam account to join a Contoso Teams meeting, they're allowed into the meeting as an anonymous user. Now, if Contoso also enables tenant restrictions V2, Teams blocks anonymous access, and the user isn't able to join the meeting.

#### Meeting join using an externally issued identity

You can configure the tenant restrictions V2 policy to allow specific users or groups with externally issued identities to join specific externally hosted Teams meetings. With this configuration, users can sign in to Teams with their externally issued identities and join the specified tenant's externally hosted Teams meetings.

There is currently a known issue where, if Teams federation is off, Teams blocks a home identity authenticated session from joining externally hosted Teams meetings.

| Auth identity | Authenticated session  | Result |
|----------------------|---------|---------|
|Anonymous (no authenticated session) <br></br> Example: A user tries to use an unauthenticated session, for example in an InPrivate browser window, to access a Teams meeting. | Not authenticated |  Access to the Teams meeting is blocked by Tenant restrictions V2 |
|Externally issued identity (authenticated session)<br></br> Example: A user uses any identity other than their home identity (for example, user@externaltenant.com) | Authenticated as an externally-issued identity |  Allow or block access to the Teams meeting per Tenant restrictions V2 policy. If allowed by the policy, the user can join the meeting. Otherwise access is blocked. <br></br> Note: There is currently a known issue where, if Teams is not explicitly federated with the external tenant, Teams and Tenant restrictions V2 block users using a home identity authenticated session from joining externally hosted Teams meetings.  

### Tenant restrictions V2 and SharePoint Online

SharePoint Online supports tenant restrictions v2 on both the authentication plane and the data plane.

#### Authenticated sessions

When tenant restrictions v2 are enabled on a tenant, unauthorized access is blocked during authentication. If a user directly accesses a SharePoint Online resource without an authenticated session, they're prompted to sign in. If the tenant restrictions v2 policy allows access, the user can access the resource; otherwise, access is blocked.

#### Anonymous access

If a user tries to access an anonymous file using their home tenant/corporate identity, they'll be able to access the file. But if the user tries to access the anonymous file using any externally issued identity, access is blocked.

For example, say a user is using a managed device configured with tenant restrictions V2 for Tenant A. If they select an anonymous access link generated for a Tenant A resource, they should be able to access the resource anonymously. But if they select an anonymous access link generated for Tenant B SharePoint Online, they're prompted to sign-in. Anonymous access to resources using an externally issued identity is always blocked.

### Tenant restrictions V2 and OneDrive

Like SharePoint, OneDrive for Business supports tenant restrictions v2 on both the authentication plane and the data plane. Blocking anonymous access to OneDrive for business is also supported. For example, tenant restrictions V2 policy enforcement works at the OneDrive for Business endpoint (microsoft-my.sharepoint.com).

However, OneDrive for consumer accounts (via onedrive.live.com) doesn't support tenant restrictions V2. Some URLs (such as onedrive.live.com) are unconverged and use our legacy stack. When a user accesses the OneDrive consumer tenant through these URLs, the policy isn't enforced. As a workaround, you can block https://onedrive.live.com/ at the proxy level.

### Tenant restrictions V2 and non-Windows platforms

For non-Windows platforms, you can break and inspect traffic to add the tenant restrictions V2 parameters into the header via proxy. However, some platforms don't support break and inspect, so tenant restrictions V2 won't work. For these platforms, the following features of Azure AD can provide protection:

- [Conditional Access: Only allow use of managed/compliant devices](/mem/intune/protect/conditional-access-intune-common-ways-use#device-based-conditional-access)
- [Conditional Access: Manage access for guest/external users](/microsoft-365/security/office-365-security/identity-access-policies-guest-access)
- [B2B Collaboration: Restrict outbound rules by Cross-tenant access for the same tenants listed in the parameter "Restrict-Access-To-Tenants"](../external-identities/cross-tenant-access-settings-b2b-collaboration.md)
- [B2B Collaboration: Restrict invitations to B2B users to the same domains listed in the "Restrict-Access-To-Tenants" parameter](../external-identities/allow-deny-list.md)
- [Application management: Restrict how users consent to applications](../manage-apps/configure-user-consent.md)
- [Intune: Apply App Policy through Intune to restrict usage of managed apps to only the UPN of the account that enrolled the device](/mem/intune/apps/app-configuration-policies-use-android) (under **Allow only configured organization accounts in apps**)

Although these alternatives provide protection, certain scenarios can only be covered through tenant restrictions, such as the use of a browser to access Microsoft 365 services through the web instead of the dedicated app.

## Prerequisites

To configure tenant restrictions, you'll need the following:

- Azure AD Premium P1 or P2
- Account with a role of Global administrator or Security administrator
- Windows devices running Windows 10, Windows 11 with the latest updates

## Step 1: Configure default tenant restrictions V2

Settings for tenant restrictions V2 are located in the Azure portal under **Cross-tenant access settings**. First, configure the default tenant restrictions you want to apply to all users, groups, apps, and organizations. Then, if you need partner-specific configurations, you can add a partner's organization and customize any settings that differ from your defaults.

### To configure default tenant restrictions

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

1. Sign in to the [Azure portal](https://portal.azure.com) using a Global administrator, Security administrator, or Conditional Access administrator account. Then open the **Azure Active Directory** service.

1. Select **External Identities**

1. Select **Cross-tenant access settings**, and then select the **Default settings** tab.

   :::image type="content" source="media/tenant-restrictions-v2/tenant-restrictions-default-section.png" alt-text="Screenshot showing the tenant restrictions section on the default settings tab.":::

1. Scroll to the **Tenant restrictions (Preview)** section.

1. Select the **Edit tenant restrictions defaults** link.

   :::image type="content" source="media/tenant-restrictions-v2/tenant-restrictions-default-section-edit.png" alt-text="Screenshot showing edit buttons for Default settings.":::

1. If a default policy doesn't exist yet in the tenant, next to the **Policy ID** you'll see a **Create Policy** link. Select this link.

   :::image type="content" source="media/tenant-restrictions-v2/create-tenant-restrictions-policy.png" alt-text="Screenshot showing the Create Policy link.":::

1. The **Tenant restrictions** page displays both your **Tenant ID** and your tenant restrictions **Policy ID**. Use the copy icons to copy both of these values. You'll use them when you configure Windows clients to enable tenant restrictions.

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
   - **Select external applications**: Lets you choose the external applications you want the action under **Access status** to apply to. To select applications, choose **Add Microsoft applications** or **Add other applications**. Then search by the application name or the application ID (either the *client app ID* or the *resource app ID*) and select the app. ([See a list of IDs for commonly used Microsoft applications.](https://learn.microsoft.com/troubleshoot/azure/active-directory/verify-first-party-apps-sign-in)) If you want to add more apps, use the **Add** button. When you're done, select **Submit**. 

   :::image type="content" source="media/tenant-restrictions-v2/tenant-restrictions-default-applications-applies-to.png" alt-text="Screenshot showing selecting the external applications tab.":::

1. Select **Save**.

## Step 2: Configure tenant restrictions V2 for specific partners

Suppose you use tenant restrictions to block access by default, but you want to allow users to access certain applications using their own external accounts. For example, say you want users to be able to access Microsoft Learn with their own Microsoft accounts (MSAs). The instructions in this section describe how to add organization-specific settings that take precedence over the default settings.

### Example: Configure tenant restrictions V2 to allow Microsoft Accounts

1. Sign in to the [Azure portal](https://portal.azure.com) using a Global administrator, Security administrator, or Conditional Access administrator account. Then open the **Azure Active Directory** service.
1. Select **External Identities**, and then select **Cross-tenant access settings**.
1. Select **Organizational settings**. (If the organization you want to add has already been added to the list, you can skip adding it and go directly to modifying the settings.)
1. Select **Add organization**.
1. On the **Add organization** pane, type the full domain name (or tenant ID) for the organization.

   **Example**: Search for the following Microsoft Accounts tenant ID:

   ```
   9188040d-6c67-4c5b-b112-36a304b66dad
   ```

   :::image type="content" source="media/tenant-restrictions-v2/add-organization-microsoft-accounts.png" alt-text="Screenshot showing adding an organization.":::

1. Select the organization in the search results, and then select **Add**.

1. The organization appears in the **Organizational settings** list. Scroll to the right to see the **Tenant restrictions** column. At this point, all tenant restrictions settings for this organization are inherited from your default settings. To change the settings for this organization, select the **Inherited from default** link under the **Tenant restrictions** column.

   :::image type="content" source="media/tenant-restrictions-v2/tenant-restrictions-edit-link.png" alt-text="Screenshot showing an organization added with default settings.":::

1. The **Tenant restrictions (Preview)** page for the organization appears. Copy the values for **Tenant ID** and **Policy ID**. You'll use them when you configure Windows clients to enable tenant restrictions.

   :::image type="content" source="media/tenant-restrictions-v2/org-tenant-policy-id.png" alt-text="Screenshot showing tenant ID and policy ID.":::

1. Select **Customize settings**, and then select the **External users and groups** tab. Under **Access status**, choose an option:

   - **Allow access**: Allows users and groups specified under **Applies to** who are signed in with external accounts to access external apps (specified on the **External applications** tab).
   - **Block access**: Blocks users and groups specified under **Applies to** who are signed in with external accounts from accessing external apps (specified on the **External applications** tab).

   > [!NOTE]
   > For our Microsoft Accounts example, we select **Allow access**.

   :::image type="content" source="media/tenant-restrictions-v2/tenant-restrictions-external-users-organizational.png" alt-text="Screenshot showing selecting the external users allow access selections.":::

1. Under **Applies to**, choose either **All &lt;organization&gt; users and groups** or **Select &lt;organization&gt; users and groups**. If you choose **Select &lt;organization&gt; users and groups**, perform these steps for each user or group you want to add:

      - Select **Add external users and groups**.
      - In the **Select** pane, type the user name or group name in the search box.
      - Select the user or group in the search results.
      - If you want to add more, select **Add** and repeat these steps. When you're done selecting the users and groups you want to add, select **Submit**.

   > [!NOTE]
   > For our Microsoft Accounts example, we select **All Microsoft Accounts users and groups**.

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
   - In the search box, type the application name or the application ID (either the *client app ID* or the *resource app ID*). ([See a list of IDs for commonly used Microsoft applications.](https://learn.microsoft.com/troubleshoot/azure/active-directory/verify-first-party-apps-sign-in)) For our Microsoft Learn example, we enter the application ID `18fbca16-2224-45f6-85b0-f7bf2b39b3f3`.
   - Select the application in the search results, and then select **Add**.
   - Repeat for each application you want to add.
   - When you're done selecting applications, select **Submit**.

   :::image type="content" source="media/tenant-restrictions-v2/add-learning-app.png" alt-text="Screenshot showing selecting applications.":::

1. The applications you selected are listed on the **External applications** tab. Select **Save**.

   :::image type="content" source="media/tenant-restrictions-v2/add-app-save.png" alt-text="Screenshot showing the selected application.":::

> [!NOTE]
   >
   > Blocking MSA tenant will not block 
   > - user-less traffic for devices. This includes traffic for Autopilot, Windows Update, and organizational telemetry.
   > - B2B authentication of consumer accounts.
   > - "Passthrough" authentication, used by many Azure apps and Office.com, where apps use Azure AD to sign in consumer users in a consumer context.

## Step 3: Enable tenant restrictions on Windows managed devices

After you create a tenant restrictions V2 policy, you can enforce the policy on each Windows 10, Windows 11, and Windows Server 2022 device by adding your tenant ID and the policy ID to the device's **Tenant Restrictions** configuration. When tenant restrictions are enabled on a Windows device, corporate proxies aren't required for policy enforcement. Devices don't need to be Azure AD managed to enforce tenant restrictions V2; domain-joined devices that are managed with Group Policy are also supported.

### Administrative Templates (.admx) for Windows 10 November 2021 Update (21H2) and Group policy settings

You can use Group Policy to deploy the tenant restrictions configuration to Windows devices. Refer to these resources:

- [Administrative Templates for Windows 10](https://www.microsoft.com/download/details.aspx?id=104042)
- [Group Policy Settings Reference Spreadsheet for Windows 10](https://www.microsoft.com/download/details.aspx?id=104043)

### Test the policies on a device

To test the tenant restrictions V2 policy on a device, follow these steps.

> [!NOTE]
>
> - The device must be running Windows 10, Windows 11, or Windows Server 2022 with the latest updates.

1. On the Windows computer, press the Windows key, type **gpedit**, and then select **Edit group policy (Control panel)**.

1. Go to **Computer Configuration** > **Administrative Templates** > **Windows Components** > **Tenant Restrictions**.

1. Right-click **Cloud Policy Details** in the right pane, and then select **Edit**.

1. Retrieve the **Tenant ID** and **Policy ID** you recorded earlier (in step 7 under [To configure default tenant restrictions](#to-configure-default-tenant-restrictions)) and enter them in the following fields (leave all other fields blank):

   - **Azure AD Directory ID**: Enter the **Tenant ID** you recorded earlier. You can also find your tenant ID in the [Azure portal](https://portal.azure.com) by navigating to **Azure Active Directory** > **Properties** and copying the **Tenant ID**.
   - **Policy GUID**: The ID for your cross-tenant access policy. It's the **Policy ID** you recorded earlier. You can also find this ID by using the Graph Explorer command [https://graph.microsoft.com/v1.0/policies/crossTenantAccessPolicy/default](https://graph.microsoft.com/v1.0/policies/crossTenantAccessPolicy/default).

   :::image type="content" source="media/tenant-restrictions-v2/windows-cloud-policy-details.png" alt-text="Screenshot of Windows Cloud Policy Details.":::

1. Select **OK**.

## Step 4: Set up tenant restrictions V2 on your corporate proxy

Tenant restrictions V2 policies can't be directly enforced on non-Windows 10, Windows 11, or Windows Server 2022 devices, such as Mac computers, mobile devices, unsupported Windows applications, and Chrome browsers. To ensure sign-ins are restricted on all devices and apps in your corporate network, configure your corporate proxy to enforce tenant restrictions V2. Although configuring tenant restrictions on your corporate proxy don't provide data plane protection, it does provide authentication plane protection.

> [!IMPORTANT]
> If you've previously set up tenant restrictions, you'll need to stop sending `restrict-msa` to login.live.com. Otherwise, the new settings will conflict with your existing instructions to the MSA login service.

1. Configure the tenant restrictions V2 header as follows:

   |Header name  |Header Value  |
   |---------|---------|
   |`sec-Restrict-Tenant-Access-Policy`     |  `<DirectoryId>:<policyGuid>`       |

   - `DirectoryID` is your Azure AD tenant ID. Find this value by signing in to the Azure portal as an administrator, select **Azure Active Directory**, then select **Properties**.
   - `policyGUID` is the object ID for your cross-tenant access policy. Find this value by calling `/crosstenantaccesspolicy/default` and using the “id” field returned.

1. On your corporate proxy, send the tenant restrictions V2 header to the following Microsoft login domains:

   - login.live.com
   - login.microsoft.com
   - login.microsoftonline.com
   - login.windows.net

   This header enforces your tenant restrictions V2 policy on all sign-ins on your network. This header won't block anonymous access to Teams meetings, SharePoint files, or other resources that don't require authentication.

## Block Chrome, Firefox and .NET applications like PowerShell

You can use the Windows Firewall feature to block unprotected apps from accessing Microsoft resources via Chrome, Firefox, and .NET applications like PowerShell. The applications that would be blocked/allowed as per the tenant restrictions V2 policy.

For example, if a customer adds PowerShell to their tenant restrictions V2 CIP policy and has graph.microsoft.com in their tenant restrictions V2 policy endpoint list, then PowerShell should be able to access it with firewall enabled.

1. On the Windows computer, press the Windows key, type **gpedit**, and then select **Edit group policy (Control panel)**.

1. Go to **Computer Configuration** > **Administrative Templates** > **Windows Components** > **Tenant Restrictions**.

1. Right-click **Cloud Policy Details** in the right pane, and then select **Edit**.

1. Select the **Enable firewall protection of Microsoft endpoints** checkbox, and then select **OK**.

:::image type="content" source="media/tenant-restrictions-v2/cloud-policy-block.png" alt-text="Screenshot showing enabling the firewall policy.":::

After you enable the firewall setting, try signing in using a Chrome browser. Sign-in should fail with the following message:
  
:::image type="content" source="media/tenant-restrictions-v2/end-user-access-blocked.png" alt-text="Screenshot showing internet access is blocked.":::

### View tenant restrictions V2 events

View events related to tenant restrictions in Event Viewer.

1. In Event Viewer, open **Applications and Services Logs**.
1. Navigate to **Microsoft** > **Windows** > **TenantRestrictions** > **Operational** and look for events.  


## Audit logs

The Azure AD audit logs provide records of system and user activities, including activities initiated by guest users. To access audit logs, in Azure Active Directory, under Monitoring, select Audit logs. To access audit logs of one specific user, select Azure Active Directory > Users > select the user > Audit logs.
 
:::image type="content" source="media/tenant-restrictions-v2/audit-logs.png" alt-text="Screenshot showing the Audit logs page.":::

You can get more details about each event listed in the audit log. For example, let's look at the user update details.
 
:::image type="content" source="media/tenant-restrictions-v2/audit-log-details.png" alt-text="Screenshot showing Audit Log Details.":::

You can also export these logs from Azure AD and use the reporting tool of your choice to get customized reports.

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
