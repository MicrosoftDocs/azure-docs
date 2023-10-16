---
title: 'Tutorial: Configure Contentful for automatic user provisioning with Microsoft Entra ID'
description: Learn how to automatically provision and deprovision user accounts from Microsoft Entra ID to Contentful.
services: active-directory
documentationcenter: ''
author: twimmers
manager: jeedes

ms.assetid: 3b761984-a9a0-4519-b23e-563438978de5
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: tutorial
ms.date: 11/21/2022
ms.author: thwimmer
---

# Tutorial: Configure Contentful for automatic user provisioning

This article describes the steps you need to complete in Contentful and in Microsoft Entra ID to configure automatic user provisioning. When configured, Microsoft Entra ID automatically provisions and deprovisions users and groups to [Contentful](https://www.contentful.com/) by using the Microsoft Entra provisioning service. For important details about what this service does and how it works, and for frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Microsoft Entra ID](../app-provisioning/user-provisioning.md). 

## Capabilities supported

> [!div class="checklist"]
> * Create users in Contentful
> * Remove users in Contentful when they don't require access anymore
> * Keep user attributes synchronized between Microsoft Entra ID and Contentful
> * Provision groups and group memberships in Contentful
> * [Single sign-on](contentful-tutorial.md) to Contentful (recommended)

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* [A Microsoft Entra tenant](../develop/quickstart-create-new-tenant.md). 
* A user account in Microsoft Entra ID that has [permission](../roles/permissions-reference.md) to configure provisioning (for example, Application Administrator, Cloud Application administrator, Application Owner, or Global Administrator). 
* A Contentful organization account that has a subscription that supports System for Cross-domain Identity Management (SCIM) provisioning. If you have questions about your organization's subscription, contact [Contentful Support](mailto:support@contentful.com).
 
## Plan your provisioning deployment

1. Learn about [how the provisioning service works](../app-provisioning/user-provisioning.md).
2. Determine who will be in [scope for provisioning](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).
3. Determine what data to [map between Microsoft Entra ID and Contentful](../app-provisioning/customize-application-attributes.md). 

<a name='configure-contentful-to-support-provisioning-with-azure-ad'></a>

## Configure Contentful to support provisioning with Microsoft Entra ID

1. In Contentful, create a **Service User** account. All provisioning permissions for Azure are provided through this account. We recommend that you choose **Owner** as the organization role for this account.

2. Sign in to Contentful as the **Service User**.

3. In the left menu, select **Organization settings** > **Access Tools** > **User provisioning**.

   ![Screenshot of the Organization settings menu in Contentful, with User provisioning highlighted under Access Tools.](media/contentful-provisioning-tutorial/access.png)

4. Copy and save the **SCIM URL**. You'll enter this value in the Azure portal, on the **Provisioning** tab of your Contentful application.

5. Select **Generate personal access token**.

    ![Screenshot showing the SCIM URL to generate a personal access token.](media/contentful-provisioning-tutorial/generate.png)

6. In the modal window, enter a name for your personal access token, and then select **Generate**.

7. The SCIM URL and the secret token are generated. Copy and save these values. You'll enter these values on the **Provisioning** tab of your Contentful application.

    ![Screenshot of the Personal access token pane, with C F P A T and the token placeholder name highlighted.](media/contentful-provisioning-tutorial/token.png)


If you have questions while you configure provisioning in the Contentful admin console, contact [Contentful Support](mailto:support@contentful.com).

<a name='add-contentful-from-the-azure-ad-application-gallery'></a>

## Add Contentful from the Microsoft Entra application gallery

To manage provisioning to Contentful, add Contentful from the Microsoft Entra application gallery. If you have previously set up Contentful for single sign-on, you can use the same application. However, we recommend that you create a separate app to initially test the integration. Learn how to [add an application in the gallery](../manage-apps/add-application-portal.md). 

## Define who will be in scope for provisioning 

You can use the Microsoft Entra provisioning service to scope who will be provisioned based on assignment to the application or based on attributes of the user or group. 

If you choose to scope who will be provisioned to your app based on assignment, complete the steps to [assign users and groups to the application](../manage-apps/assign-user-or-group-access-portal.md).

If you choose to scope who will be provisioned based solely on attributes of the user or group, use a scoping filter to [define conditional rules for provisioning user accounts](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md). 

* When you assign users and groups to Contentful, you must select a role other than **Default Access**. Users who have the Default Access role are excluded from provisioning and are indicated in the provisioning logs as not effectively entitled. If the only role available on the application is the Default Access role, you can [update the application manifest](../develop/howto-add-app-roles-in-azure-ad-apps.md) to add more roles. 
* Start small. Test with a small set of users and groups before you roll out to everyone. When provisioning scope is set to assigned users and groups, you can control the scope by assigning one or two users or groups to the app. When the scope is set to all users and groups, you can specify an [attribute-based scoping filter](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md). 

## Configure automatic user provisioning to Contentful 

This section guides you through the steps to set up the Microsoft Entra provisioning service to create, update, and disable users and groups in a test app based on user or group assignments in Microsoft Entra ID.

<a name='configure-automatic-user-provisioning-for-contentful-in-azure-ad'></a>

### Configure automatic user provisioning for Contentful in Microsoft Entra ID

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications**.

   ![Screenshot that shows the Enterprise applications menu in the Azure portal, with All applications highlighted.](common/enterprise-applications.png)

1. In the applications list, select **Contentful**.

   ![Screenshot that shows the first 20 results returned in the Applications list.](common/all-applications.png)

3. Select the **Provisioning** tab.

   ![Screenshot of the Provisioning tab highlighted in the Manage section of the left menu.](common/provisioning.png)

4. Set **Provisioning Mode** to **Automatic**.

   ![Screenshot that shows the Provisioning Mode options, with Automatic highlighted.](common/provisioning-automatic.png)

5. In the **Admin Credentials** section, enter your Contentful tenant URL and secret token. To ensure that Microsoft Entra ID can connect to Contentful, select **Test Connection**. If the connection fails, be sure that your Contentful account has Admin permissions, and then try again.

   ![Screenshot that shows the Tenant U R L and Secret Token text boxes, with the Test Connection button highlighted.](common/provisioning-testconnection-tenanturltoken.png)

6. In **Notification Email**, enter the email address of a person or group who should receive the provisioning error notifications, and then select the **Send an email notification when a failure occurs** check box.

   ![Screenshot that shows the Notification Email text box.](common/provisioning-notification-email.png)

7. Select **Save**.

8. In the **Mappings** section, select **Synchronize Microsoft Entra users to Contentful**.

9. In the **Attribute-Mapping** section, review the user attributes that are synced from Microsoft Entra ID to Contentful. The attributes selected as **Matching** properties are used to match the user accounts in Contentful for update operations. If you choose to change the [matching target attribute](../app-provisioning/customize-application-attributes.md), you must ensure that the Contentful API supports filtering users based on that attribute. Select the **Save** button to commit any changes.

   |Attribute|Type|Supported for filtering|
   |---|---|---|
   |userName|String|&check;|
   |name.givenName|String|
   |name.familyName|String|

10. In the **Mappings** section, select **Synchronize Microsoft Entra groups to Contentful**.

11. In the **Attribute-Mapping** section, review the group attributes that are synced from Microsoft Entra ID to Contentful. The attributes selected as **Matching** properties are used to match the groups in Contentful for update operations. Select the **Save** button to commit any changes.

    |Attribute|Type|Supported for filtering|
    |---|---|---|
    |displayName|String|&check;|
    |members|Reference|

12. To set up scoping filters, complete the steps that are described in the [scoping filter tutorial](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

13. To enable the Microsoft Entra provisioning service for Contentful, in the **Settings** section, for **Provisioning Status**, select **On**.

    ![Screenshot that shows Provisioning Status On and Off toggle.](common/provisioning-toggle-on.png)

14. To define the users or groups that you want to provision to Contentful, in the **Settings** section, for **Scope**, select the relevant option.

    ![Screenshot that shows options you can select in the Scope pane.](common/provisioning-scope.png)

15. When you're ready to provision, select **Save**.

    ![Screenshot that shows the Save button and the Cancel button.](common/provisioning-configuration-save.png)

This operation starts the initial sync cycle of all users and groups defined in **Scope** under **Settings**. The initial cycle takes longer to perform than subsequent cycles, which occur approximately every 40 minutes as long as the Microsoft Entra provisioning service is running. 

## Monitor your deployment

After you configure provisioning, use the following resources to monitor your deployment:

* To determine which users have been provisioned successfully or unsuccessfully, view the [provisioning logs](../reports-monitoring/concept-provisioning-logs.md).
* To see the status of the provisioning cycle and how close it is to finishing, check the [progress bar](../app-provisioning/application-provisioning-when-will-provisioning-finish-specific-user.md).
* If the provisioning configuration seems to be in an unhealthy state, the application goes into quarantine. Learn more about [quarantine states](../app-provisioning/application-provisioning-quarantine-status.md).  

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md)
* [Manage user account provisioning for Enterprise Apps](../app-provisioning/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)
