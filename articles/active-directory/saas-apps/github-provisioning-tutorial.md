---
title: 'Tutorial: User provisioning for GitHub'
description: Learn how to configure Microsoft Entra ID to automatically provision and de-provision user organization membership in GitHub Enterprise Cloud.
services: active-directory
author: twimmers
manager: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 11/21/2022
ms.author: thwimmer
---
# Tutorial: Configure GitHub for automatic user provisioning

The objective of this tutorial is to show you the steps you need to perform in GitHub and Microsoft Entra ID to automate provisioning of GitHub Enterprise Cloud organization membership.

> [!NOTE]
> The Microsoft Entra provisioning integration relies on the [GitHub SCIM API](https://developer.github.com/v3/scim/), which is available to [GitHub Enterprise Cloud](https://help.github.com/articles/github-s-products/#github-enterprise) customers on the [GitHub Enterprise billing plan](https://help.github.com/articles/github-s-billing-plans/#billing-plans-for-organizations).

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following items:

* A Microsoft Entra tenant
* A GitHub organization created in [GitHub Enterprise Cloud](https://help.github.com/articles/github-s-products/#github-enterprise), which requires the [GitHub Enterprise billing plan](https://help.github.com/articles/github-s-billing-plans/#billing-plans-for-organizations)
* A user account in GitHub with Admin permissions to the organization
* [SAML configured for the GitHub Enterprise Cloud organization](./github-tutorial.md)
* Ensure that OAuth access has been provided for your organization as described [here](https://help.github.com/en/github/setting-up-and-managing-organizations-and-teams/approving-oauth-apps-for-your-organization)
* SCIM provisioning to a single organization is supported only when SSO is enabled at the organization level

> [!NOTE]
> This integration is also available to use from Microsoft Entra US Government Cloud environment. You can find this application in the Microsoft Entra US Government Cloud Application Gallery and configure it in the same way as you do from public cloud.

## Assigning users to GitHub

Microsoft Entra ID uses a concept called "assignments" to determine which users should receive access to selected apps. In the context of automatic user account provisioning, only the users and groups that have been "assigned" to an application in Microsoft Entra ID is synchronized. 

Before configuring and enabling the provisioning service, you need to decide what users and/or groups in Microsoft Entra ID represent the users who need access to your GitHub app. Once decided, you can assign these users to your GitHub app by following the instructions here:

For more information, see [Assign a user or group to an enterprise app](../manage-apps/assign-user-or-group-access-portal.md).

### Important tips for assigning users to GitHub

* We recommend that you assign a single Microsoft Entra user to GitHub to test the provisioning configuration. Additional users and/or groups may be assigned later.

* When assigning a user to GitHub, you must select either the **User** role, or another valid application-specific role (if available) in the assignment dialog. The **Default Access** role does not work for provisioning, and these users are skipped.

## Configuring user provisioning to GitHub

This section guides you through connecting your Microsoft Entra ID to GitHub's SCIM provisioning API to automate provisioning of GitHub organization membership. This integration, which leverages an [OAuth app](https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/authorizing-oauth-apps#oauth-apps-and-organizations), automatically adds, manages, and removes members' access to a GitHub Enterprise Cloud organization based on user and group assignment in Microsoft Entra ID. When users are [provisioned to a GitHub organization via SCIM](https://docs.github.com/en/rest/enterprise-admin/scim), an email invitation is sent to the user's email address.

<a name='configure-automatic-user-account-provisioning-to-github-in-azure-ad'></a>

### Configure automatic user account provisioning to GitHub in Microsoft Entra ID

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications**.

2. If you have already configured GitHub for single sign-on, search for your instance of GitHub using the search field. Otherwise, select **Add** and search for **GitHub** in the application gallery. Select GitHub from the search results, and add it to your list of applications.

3. Select your instance of GitHub, then select the **Provisioning** tab.

4. Set the **Provisioning Mode** to **Automatic**.

   ![GitHub Provisioning](./media/github-provisioning-tutorial/github1.png)

5. Under the **Admin Credentials** section, click **Authorize**. This operation opens a GitHub authorization dialog in a new browser window. Note that you need to ensure you are approved to authorize access. Follow the directions described [here](https://help.github.com/github/setting-up-and-managing-organizations-and-teams/approving-oauth-apps-for-your-organization).

6. In the new window, sign into GitHub using your Admin account. In the resulting authorization dialog, select the GitHub team that you want to enable provisioning for, and then select **Authorize**. Once completed, return to the Azure portal to complete the provisioning configuration.

   ![Screenshot shows the sign-in page for GitHub.](./media/github-provisioning-tutorial/github2.png)

7. In the Azure portal, input **Tenant URL** and click **Test Connection** to ensure Microsoft Entra ID can connect to your GitHub app. If the connection fails, ensure your GitHub account has Admin permissions and **Tenant URl** is inputted correctly, then try the "Authorize" step again (you can constitute **Tenant URL** by rule: `https://api.github.com/scim/v2/organizations/<Organization_name>`, you can find your organizations under your GitHub account: **Settings** > **Organizations**).

   ![Screenshot shows Organizations page in GitHub.](./media/github-provisioning-tutorial/github3.png)

8. Enter the email address of a person or group who should receive provisioning error notifications in the **Notification Email** field, and check the checkbox "Send an email notification when a failure occurs."

9. Click **Save**.

10. Under the Mappings section, select **Synchronize Microsoft Entra users to GitHub**.

11. In the **Attribute Mappings** section, review the user attributes that are synchronized from Microsoft Entra ID to GitHub. The attributes selected as **Matching** properties are used to match the user accounts in GitHub for update operations. Do not enable the **Matching precedence** setting for the other default attributes in the **Provisioning** section because errors might occur. Select **Save** to commit any changes.

12. To enable the Microsoft Entra provisioning service for GitHub, change the **Provisioning Status** to **On** in the **Settings** section.

13. Click **Save**.

This operation starts the initial synchronization of any users and/or groups assigned to GitHub in the Users and Groups section. The initial sync takes longer to perform than subsequent syncs, which occur approximately every 40 minutes as long as the service is running. You can use the **Synchronization Details** section to monitor progress and follow links to provisioning activity logs, which describe all actions performed by the provisioning service. 

For more information on how to read the Microsoft Entra provisioning logs, see [Reporting on automatic user account provisioning](../app-provisioning/check-status-user-account-provisioning.md).

## Additional resources

* [Managing user account provisioning for Enterprise Apps](../app-provisioning/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md)
