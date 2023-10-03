---
title: 'Tutorial: Configure GitHub Enterprise Managed User (OIDC) for automatic user provisioning with Microsoft Entra ID'
description: Learn how to automatically provision and de-provision user accounts from Microsoft Entra ID to GitHub Enterprise Managed User (OIDC).
documentationcenter: ''
author: twimmers
writer: twimmers
manager: jeedes

ms.assetid: e39cbad7-e23a-4986-9725-54a7aeb7b1ea
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: tutorial
ms.date: 11/21/2022
ms.author: thwimmer
---

# Tutorial: Configure GitHub Enterprise Managed User (OIDC) for automatic user provisioning

This tutorial describes the steps you need to perform in both GitHub Enterprise Managed User (OIDC) and Microsoft Entra ID to configure automatic user provisioning. When configured, Microsoft Entra ID automatically provisions and de-provisions users and groups to GitHub Enterprise Managed User (OIDC) using the Microsoft Entra provisioning service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Microsoft Entra ID](../app-provisioning/user-provisioning.md).

> [!NOTE]
> [GitHub Enterprise Managed User (EMU)](https://docs.github.com/enterprise-cloud@latest/admin/authentication/managing-your-enterprise-users-with-your-identity-provider/about-enterprise-managed-users) is a different type of [GitHub Enteprise Account](https://docs.github.com/enterprise-cloud@latest/admin/overview/about-enterprise-accounts). If you haven't specifically requested EMU instance, you have a standard GitHub Enterprise Account. In that case, please refer to [the documentation](./github-provisioning-tutorial.md) to configure user provisioning in your non-EMU organisation. User provisioning is not supported for [standard GitHub Enteprise Accounts](https://docs.github.com/enterprise-cloud@latest/admin/overview/about-enterprise-accounts), but is supported for organisations under standard GitHub Enterprise Account.

## Capabilities Supported
> [!div class="checklist"]
> * Create users in GitHub Enterprise Managed User (OIDC)
> * Remove users in GitHub Enterprise Managed User (OIDC) when they do not require access anymore
> * Keep user attributes synchronized between Microsoft Entra ID and GitHub Enterprise Managed User (OIDC)
> * Provision groups and group memberships in GitHub Enterprise Managed User (OIDC)
> * [Single sign-on](../manage-apps/add-application-portal-setup-oidc-sso.md) to GitHub Enterprise Managed User (OIDC) (recommended).

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* [A Microsoft Entra tenant](../develop/quickstart-create-new-tenant.md)
* A user account in Microsoft Entra ID with [permission](../roles/permissions-reference.md) to configure provisioning (for example, Application Administrator, Cloud Application administrator, Application Owner, or Global Administrator).
* Enabled and configured Enterprise Managed Users GitHub Enterprise to login with OIDC SSO through your Microsoft Entra tenant.

> [!NOTE]
> This integration is also available to use from Microsoft Entra US Government Cloud environment. You can find this application in the Microsoft Entra US Government Cloud Application Gallery and configure it in the same way as you do from public cloud.

## Step 1: Plan your provisioning deployment
1. Learn about [how the provisioning service works](../app-provisioning/user-provisioning.md).
2. Determine who will be in [scope for provisioning](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).
3. Determine what data to [map between Microsoft Entra ID and GitHub Enterprise Managed User](../app-provisioning/customize-application-attributes.md).

<a name='step-2-configure-github-enterprise-managed-user-oidc-to-support-provisioning-with-azure-ad'></a>

## Step 2: Configure GitHub Enterprise Managed User (OIDC) to support provisioning with Microsoft Entra ID

1. The Tenant URL is `https://api.github.com/scim/v2/enterprises/{enterprise}`. This value will be entered in the Tenant URL field in the Provisioning tab of your GitHub Enterprise Managed User (OIDC) application.

2. As a GitHub Enterprise Managed administrator navigate to the upper-right corner -> click your profile photo -> then click **Settings**.

3. In the left sidebar, click **Developer settings**.

4. In the left sidebar, click **Personal access tokens**.

5. Click **Generate new token**.

6. Select the **admin:enterprise** scope for this token.

7. Click **Generate Token**.

8. Copy and save the **secret token**. This value will be entered in the Secret Token field in the Provisioning tab of your GitHub Enterprise Managed User (OIDC) application.

<a name='step-3-add-github-enterprise-managed-user-oidc-from-the-azure-ad-application-gallery'></a>

## Step 3: Add GitHub Enterprise Managed User (OIDC) from the Microsoft Entra application gallery

Add GitHub Enterprise Managed User (OIDC) from the Microsoft Entra application gallery to start managing provisioning to GitHub Enterprise Managed User (OIDC). If you have previously setup GitHub Enterprise Managed User (OIDC) for SSO, you can use the same application. However it is recommended that you create a separate app when testing out the integration initially. Learn more about adding an application from the gallery [here](../manage-apps/add-application-portal.md).

## Step 4: Define who will be in scope for provisioning

The Microsoft Entra provisioning service allows you to scope who will be provisioned based on assignment to the application and or based on attributes of the user / group. If you choose to scope who will be provisioned to your app based on assignment, you can use the following [steps](../manage-apps/assign-user-or-group-access-portal.md) to assign users and groups to the application. If you choose to scope who will be provisioned based solely on attributes of the user or group, you can use a scoping filter as described [here](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

* Start small. Test with a small set of users and groups before rolling out to everyone. When scope for provisioning is set to assigned users and groups, you can control this by assigning one or two users or groups to the app. When scope is set to all users and groups, you can specify an [attribute based scoping filter](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

* If you need additional roles, you can [update the application manifest](../develop/howto-add-app-roles-in-azure-ad-apps.md) to add new roles.


## Step 5: Configure automatic user provisioning to GitHub Enterprise Managed User (OIDC)

This section guides you through the steps to configure the Microsoft Entra provisioning service to create, update, and disable users and/or groups in TestApp based on user and/or group assignments in Microsoft Entra ID.

<a name='to-configure-automatic-user-provisioning-for-github-enterprise-managed-user-oidc-in-azure-ad'></a>

### To configure automatic user provisioning for GitHub Enterprise Managed User (OIDC) in Microsoft Entra ID:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications**

    ![Enterprise applications blade](common/enterprise-applications.png)

1. In the applications list, select **GitHub Enterprise Managed User (OIDC)**.

    ![The GitHub Enterprise Managed User (OIDC) link in the Applications list](common/all-applications.png)

3. Select the **Provisioning** tab.

    ![Provisioning tab](common/provisioning.png)

4. Set the **Provisioning Mode** to **Automatic**.

    ![Provisioning tab automatic](common/provisioning-automatic.png)

5. Under the **Admin Credentials** section, input your GitHub Enterprise Managed User (OIDC) Tenant URL and Secret Token. Click **Test Connection** to ensure Microsoft Entra ID can connect to GitHub Enterprise Managed User (OIDC). If the connection fails, ensure your GitHub Enterprise Managed User (OIDC) account has created the secret token as an enterprise owner and try again.

   For "Tenant URL", type `https://api.github.com/scim/v2/enterprises/YOUR_ENTERPRISE`, replacing YOUR_ENTERPRISE with the name of your enterprise account.
   
   For example, if your enterprise account's URL is https://github.com/enterprises/octo-corp, the name of the enterprise account is octo-corp.
   
   For "Secret token", paste the personal access token with the admin:enterprise scope that  you created earlier.
   
     ![Token](common/provisioning-testconnection-tenanturltoken.png)

6. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and select the **Send an email notification when a failure occurs** check box.

    ![Notification Email](common/provisioning-notification-email.png)

7. Select **Save**.

8. Under the **Mappings** section, select **Synchronize Microsoft Entra users to GitHub Enterprise Managed User (OIDC)**.

9. Review the user attributes that are synchronized from Microsoft Entra ID to GitHub Enterprise Managed User (OIDC) in the **Attribute-Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in GitHub Enterprise Managed User (OIDC) for update operations. If you choose to change the [matching target attribute](../app-provisioning/customize-application-attributes.md), you will need to ensure that the GitHub Enterprise Managed User (OIDC) API supports filtering users based on that attribute. Select the **Save** button to commit any changes.

   |Attribute|Type|Supported For Filtering|
   |---|---|---|
   |externalId|String|&check;|
   |userName|String|
   |active|Boolean|
   |roles|String|
   |displayName|String|
   |name.givenName|String|
   |name.familyName|String|
   |name.formatted|String|
   |emails[type eq "work"].value|String|
   |emails[type eq "home"].value|String|
   |emails[type eq "other"].value|String|

10. Under the **Mappings** section, select **Synchronize Microsoft Entra groups to GitHub Enterprise Managed User (OIDC)**.

11. Review the group attributes that are synchronized from Microsoft Entra ID to GitHub Enterprise Managed User (OIDC) in the **Attribute-Mapping** section. The attributes selected as **Matching** properties are used to match the groups in GitHub Enterprise Managed User (OIDC) for update operations. Select the **Save** button to commit any changes.

      |Attribute|Type|Supported For Filtering|
      |---|---|---|
      |externalId|String|&check;|
      |displayName|String|
      |members|Reference|

12. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

13. To enable the Microsoft Entra provisioning service for GitHub Enterprise Managed User (OIDC), change the **Provisioning Status** to **On** in the **Settings** section.

    ![Provisioning Status Toggled On](common/provisioning-toggle-on.png)

14. Define the users and/or groups that you would like to provision to GitHub Enterprise Managed User (OIDC) by choosing the desired values in **Scope** in the **Settings** section.

    ![Provisioning Scope](common/provisioning-scope.png)

15. When you are ready to provision, click **Save**.

    ![Saving Provisioning Configuration](common/provisioning-configuration-save.png)

This operation starts the initial synchronization cycle of all users and groups defined in **Scope** in the **Settings** section. The initial cycle takes longer to perform than subsequent cycles, which occur approximately every 40 minutes as long as the Microsoft Entra provisioning service is running.

## Step 6: Monitor your deployment
Once you've configured provisioning, use the following resources to monitor your deployment:

1. Use the [provisioning logs](../reports-monitoring/concept-provisioning-logs.md) to determine which users have been provisioned successfully or unsuccessfully
2. Check the [progress bar](../app-provisioning/application-provisioning-when-will-provisioning-finish-specific-user.md) to see the status of the provisioning cycle and how close it is to completion
3. If the provisioning configuration seems to be in an unhealthy state, the application will go into quarantine. Learn more about quarantine states [here](../app-provisioning/application-provisioning-quarantine-status.md).

## Additional resources

* [Managing user account provisioning for Enterprise Apps](../app-provisioning/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md)
