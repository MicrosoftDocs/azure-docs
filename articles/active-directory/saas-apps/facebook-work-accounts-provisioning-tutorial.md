---
title: 'Tutorial: Configure Meta Work Accounts for automatic user provisioning with Microsoft Entra ID'
description: Learn how to automatically provision and de-provision user accounts from Microsoft Entra ID to Meta Work Accounts.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.author: jeedes
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 01/06/2023
---

# Tutorial: Configure Meta Work Accounts for automatic user provisioning

This tutorial describes the steps you need to perform in both Meta Work Accounts and Microsoft Entra ID to configure automatic user provisioning. When configured, Microsoft Entra ID automatically provisions and de-provisions users and groups to [Meta Work Accounts](https://work.meta.com) using the Microsoft Entra provisioning service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Microsoft Entra ID](../app-provisioning/user-provisioning.md).

## Capabilities supported

> [!div class="checklist"]
> * Create users in Meta Work Accounts
> * Remove users in Meta Work Accounts when they do not require access anymore
> * Keep user attributes synchronized between Microsoft Entra ID and Meta Work Accounts
> * Single sign-on to Meta Work Accounts (recommended)

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* [A Microsoft Entra tenant](../develop/quickstart-create-new-tenant.md)
* A user account in Microsoft Entra ID with [permission](../roles/permissions-reference.md) to configure provisioning (for example, Application Administrator, Cloud Application administrator, Application Owner, or Global Administrator).
* An admin account in Work Accounts with the permission to change company settings and configure integrations.

## Step 1: Plan your provisioning deployment

1. Learn about [how the provisioning service works](../app-provisioning/user-provisioning.md).
1. Determine who will be in [scope for provisioning](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).
1. Determine what data to [map between Microsoft Entra ID and Meta Work Accounts](../app-provisioning/customize-application-attributes.md).

<a name='step-2-add-meta-work-accounts-from-the-azure-ad-application-gallery'></a>

## Step 2: Add Meta Work Accounts from the Microsoft Entra application gallery

Add Meta Work Accounts from the Microsoft Entra application gallery to start managing provisioning to Meta Work Accounts. If you have previously setup Meta Work Accounts for SSO, you can use the same application. However it is recommended that you create a separate app when testing out the integration initially. Learn more about adding an application from the gallery [here](../manage-apps/add-application-portal.md).

## Step 3: Define who will be in scope for provisioning

The Microsoft Entra provisioning service allows you to scope who will be provisioned based on assignment to the application and or based on attributes of the user / group. If you choose to scope who will be provisioned to your app based on assignment, you can use the following [steps](../manage-apps/assign-user-or-group-access-portal.md) to assign users and groups to the application. If you choose to scope who will be provisioned based solely on attributes of the user or group, you can use a scoping filter as described [here](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

* Start small. Test with a small set of users and groups before rolling out to everyone. When scope for provisioning is set to assigned users and groups, you can control this by assigning one or two users or groups to the app. When scope is set to all users and groups, you can specify an [attribute based scoping filter](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

* If you need additional roles, you can [update the application manifest](../develop/howto-add-app-roles-in-azure-ad-apps.md) to add new roles.

## Step 4: Configure automatic user provisioning to Meta Work Accounts

This section guides you through the steps to configure the Microsoft Entra provisioning service to create, update, and disable users and/or groups in TestApp based on user and/or group assignments in Microsoft Entra ID.

<a name='to-configure-automatic-user-provisioning-for-meta-work-accounts-in-azure-ad'></a>

### To configure automatic user provisioning for Meta Work Accounts in Microsoft Entra ID:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications**

1. In the applications list, select **Meta Work Accounts**.

1. Select the **Provisioning** tab.

1. Set the **Provisioning Mode** to **Automatic**.

1. Under the **Admin Credentials** section, click on **Authorize**. You will be redirected to **Meta Work Accounts**'s authorization page. Input your Meta Work Accounts username and click on the **Continue** button. Click **Test Connection** to ensure Microsoft Entra ID can connect to Meta Work Accounts. If the connection fails, ensure your Meta Work Accounts account has Admin permissions and try again.

    :::image type="content" source="media/facebook-work-accounts-provisioning-tutorial/azure-connect.png" alt-text="Screenshot shows the Meta Work Accounts authorization page.":::

1. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and select the **Send an email notification when a failure occurs** check box.

1. Select **Save**.

1. Under the **Mappings** section, select **Synchronize Microsoft Entra users to Meta Work Accounts**.

1. Review the user attributes that are synchronized from Microsoft Entra ID to Meta Work Accounts in the **Attribute-Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in Meta Work Accounts for update operations. If you choose to change the [matching target attribute](../app-provisioning/customize-application-attributes.md), you will need to ensure that the Meta Work Accounts API supports filtering users based on that attribute. Select the **Save** button to commit any changes.

    |Attribute|Type|Supported for filtering|
    |---|---|---|
    |userName|String|&check;
    |externalId|String|
    |active|Boolean|
    |title|String|
    |emails[type eq "work"].value|String|
    |preferredLanguage|String|
    |name.givenName|String|
    |name.familyName|String|
    |name.formatted|String|
    |addresses[type eq "work"].formatted|String|
    |addresses[type eq "work"].streetAddress|String|
    |addresses[type eq "work"].locality|String|
    |addresses[type eq "work"].region|String|
    |addresses[type eq "work"].postalCode|String|
    |addresses[type eq "work"].country|String|
    |phoneNumbers[type eq "work"].value|String|
    |urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:employeeNumber|String|
    |urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:department|String|

1. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

1. To enable the Microsoft Entra provisioning service for Meta Work Accounts, change the **Provisioning Status** to **On** in the **Settings** section.

1. Define the users and/or groups that you would like to provision to Meta Work Accounts by choosing the desired values in **Scope** in the **Settings** section.

   ![Screenshot shows the Scope dropdown in the Settings section.](common/provisioning-scope.png)

1. When you are ready to provision, click **Save**.

This operation starts the initial synchronization cycle of all users and groups defined in **Scope** in the **Settings** section. The initial cycle takes longer to perform than subsequent cycles, which occur approximately every 40 minutes as long as the Microsoft Entra provisioning service is running.

## Step 5: Monitor your deployment

Once you've configured provisioning, use the following resources to monitor your deployment:

* Use the [provisioning logs](../reports-monitoring/concept-provisioning-logs.md) to determine which users have been provisioned successfully or unsuccessfully
* Check the [progress bar](../app-provisioning/application-provisioning-when-will-provisioning-finish-specific-user.md) to see the status of the provisioning cycle and how close it is to completion
* If the provisioning configuration seems to be in an unhealthy state, the application will go into quarantine. Learn more about quarantine states [here](../app-provisioning/application-provisioning-quarantine-status.md).

## More resources

* [Managing user account provisioning for Enterprise Apps](../app-provisioning/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md)
