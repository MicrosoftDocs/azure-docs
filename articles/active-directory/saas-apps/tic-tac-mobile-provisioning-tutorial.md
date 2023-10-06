---
title: 'Tutorial: Configure Tic-Tac Mobile for automatic user provisioning with Microsoft Entra ID'
description: Learn how to automatically provision and deprovision user accounts from Microsoft Entra ID to Tic-Tac Mobile.
services: active-directory
documentationcenter: ''
author: twimmers
writer: twimmers
manager: jeedes

ms.assetid: d0f24e81-fecf-4e71-bd8a-ab911366fdf5
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: tutorial
ms.date: 11/21/2022
ms.author: thwimmer
---

# Tutorial: Configure Tic-Tac Mobile for automatic user provisioning

This tutorial describes the steps you need to perform in both Tic-Tac Mobile and Microsoft Entra ID to configure automatic user provisioning. When configured, Microsoft Entra ID automatically provisions and deprovisions users and groups to [Tic-Tac Mobile](https://www.tictacmobile.com/) by using the Microsoft Entra provisioning service. For information on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to software as a service (SaaS) applications with Microsoft Entra ID](../app-provisioning/user-provisioning.md).


## Capabilities supported

> [!div class="checklist"]
> * Create users in Tic-Tac Mobile.
> * Remove users in Tic-Tac Mobile when they don't require access anymore.
> * Keep user attributes synchronized between Microsoft Entra ID and Tic-Tac Mobile.

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* [A Microsoft Entra tenant](../develop/quickstart-create-new-tenant.md).
* A user account in Microsoft Entra ID with [permission](../roles/permissions-reference.md) to configure provisioning. Examples are Application administrator, Cloud Application administrator, Application owner, or Global administrator.
* A [Tic-Tac Mobile](https://www.tictacmobile.com/) account with a super admin role.


## Step 1: Plan your provisioning deployment

1. Learn about [how the provisioning service works](../app-provisioning/user-provisioning.md).
1. Determine who will be in [scope for provisioning](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).
1. Determine what data to [map between Microsoft Entra ID and Tic-Tac Mobile](../app-provisioning/customize-application-attributes.md).

<a name='step-2-configure-tic-tac-mobile-to-support-provisioning-with-azure-ad'></a>

## Step 2: Configure Tic-Tac Mobile to support provisioning with Microsoft Entra ID

Contact support@tictacmobile.com to get your **Tenant URL** and **Secret Token**. You must have a super admin role in Tic-Tac Mobile to receive a token. The token will be entered in the **Secret Token** box on the **Provisioning** tab of your Tic-Tac Mobile application.

<a name='step-3-add-tic-tac-mobile-from-the-azure-ad-application-gallery'></a>

## Step 3: Add Tic-Tac Mobile from the Microsoft Entra application gallery

Add Tic-Tac Mobile from the Microsoft Entra application gallery to start managing provisioning to Tic-Tac Mobile. If you've previously set up Tic-Tac Mobile for single sign-on, you can use the same application. When you test out the integration initially, create a separate app. To learn more about how to add an application from the gallery, see [Attribute-based application provisioning with scoping filters](../manage-apps/add-application-portal.md).

## Step 4: Define who will be in scope for provisioning

With the Microsoft Entra provisioning service, you can scope who will be provisioned based on assignment to the application or based on attributes of the user or group. If you choose to scope who will be provisioned to your app based on assignment, follow the steps in [Manage user assignment for an app in Microsoft Entra ID](../manage-apps/assign-user-or-group-access-portal.md) to assign users and groups to the application. If you choose to scope who will be provisioned based solely on attributes of the user or group, use a scoping filter as described in [Attribute-based application provisioning with scoping filters](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

* When you assign users and groups to Tic-Tac Mobile, you must select a role other than **Default Access**. Users with the default access role are excluded from provisioning and will be marked as not effectively entitled in the provisioning logs. If the only role available on the application is the default access role, you can [update the application manifest](../develop/howto-add-app-roles-in-azure-ad-apps.md) to add more roles.
* Start small. Test with a small set of users and groups before you roll out to everyone. When scope for provisioning is set to assigned users and groups, you can maintain control by assigning one or two users or groups to the app. When scope is set to all users and groups, you can specify an [attribute-based scoping filter](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

## Step 5: Configure automatic user provisioning to Tic-Tac Mobile

This section guides you through the steps to configure the Microsoft Entra provisioning service to create, update, and disable users or groups in TestApp based on user or group assignments in Microsoft Entra ID.

<a name='configure-automatic-user-provisioning-for-tic-tac-mobile-in-azure-ad'></a>

### Configure automatic user provisioning for Tic-Tac Mobile in Microsoft Entra ID

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications**.

	![Screenshot that shows the Enterprise applications pane.](common/enterprise-applications.png)

1. In the applications list, select **Tic-Tac Mobile**.

	![Screenshot that shows the Tic-Tac Mobile link in the Applications list.](common/all-applications.png)

1. Select the **Provisioning** tab.

	![Screenshot that shows the Provisioning tab.](common/provisioning.png)

1. Set **Provisioning Mode** to **Automatic**.

	![Screenshot that shows the Provisioning tab Automatic option.](common/provisioning-automatic.png)

1. Under the **Admin Credentials** section, input your Tic-Tac Mobile **Tenant URL** and **Secret Token**. Select **Test Connection** to ensure Microsoft Entra ID can connect to Tic-Tac Mobile. If the connection fails, ensure your Tic-Tac Mobile account has admin permissions and try again.

 	![Screenshot that shows the Secret Token box.](common/provisioning-testconnection-tenanturltoken.png)

1. In the **Notification Email** box, enter the email address of a person or group who should receive the provisioning error notifications. Select the **Send an email notification when a failure occurs** check box.

	![Screenshot that shows the Notification Email box.](common/provisioning-notification-email.png)

1. Select **Save**.

1. Under the **Mappings** section, select **Synchronize Microsoft Entra users to Tic-Tac Mobile**.

1. Review the user attributes that are synchronized from Microsoft Entra ID to Tic-Tac Mobile in the **Attribute-Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in Tic-Tac Mobile for update operations. If you change the [matching target attribute](../app-provisioning/customize-application-attributes.md), you must ensure that the Tic-Tac Mobile API supports filtering users based on that attribute. Select the **Save** button to commit any changes.

   |Attribute|Type|
   |---|---|
   |userName|String|
   |name.givenName|String|
   |name.familyName|String|
   |externalId|String|
   |title|String|
   |emails[type eq "work"].value|String|
   |preferredLanguage|String|
   |externalId|String|
   |userType|String|
   |locale|String|
   |timezone|String|
   |urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:employeeNumber|String|
   |urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:costCenter|String|
   |urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:organization|String|
   |urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:division|String|
   |urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:department|String|

1. To configure scoping filters, see the instructions in the [Scoping filter tutorial](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

1. To enable the Microsoft Entra provisioning service for Tic-Tac Mobile, change **Provisioning Status** to **On** in the **Settings** section.

	![Screenshot that shows the Provisioning Status toggled On.](common/provisioning-toggle-on.png)

1. Define the users or groups that you want to provision to Tic-Tac Mobile by selecting the desired values in **Scope** in the **Settings** section.

	![Screenshot that shows the provisioning Scope.](common/provisioning-scope.png)

1. When you're ready to provision, select **Save**.

	![Screenshot that shows saving the provisioning configuration.](common/provisioning-configuration-save.png)

This operation starts the initial synchronization cycle of all users and groups defined in **Scope** in the **Settings** section. The initial cycle takes longer to perform than subsequent cycles, which occur approximately every 40 minutes as long as the Microsoft Entra provisioning service is running.

## Step 6: Monitor your deployment

After you've configured provisioning, use the following resources to monitor your deployment.

1. Use the [provisioning logs](../reports-monitoring/concept-provisioning-logs.md) to determine which users have been provisioned successfully or unsuccessfully.
1. Check the [progress bar](../app-provisioning/application-provisioning-when-will-provisioning-finish-specific-user.md) to see the status of the provisioning cycle and how close it is to completion.
1. If the provisioning configuration seems to be in an unhealthy state, the application will go into quarantine. To learn more about quarantine states, see [Application provisioning in quarantine status](../app-provisioning/application-provisioning-quarantine-status.md).

## Additional resources

* [Managing user account provisioning for enterprise apps](../app-provisioning/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md)
