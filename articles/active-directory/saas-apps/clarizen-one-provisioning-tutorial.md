---
title: 'Tutorial: Configure Clarizen One for automatic user provisioning with Microsoft Entra ID'
description: Learn how to automatically provision and deprovision user accounts from Microsoft Entra ID to Clarizen One.
services: active-directory
documentationcenter: ''
author: twimmers
writer: twimmers
manager: jeedes

ms.assetid: d8021105-eb5b-4a20-8739-f02e0e22c147
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: tutorial
ms.date: 11/21/2022
ms.author: thwimmer
---

# Tutorial: Configure Clarizen One for automatic user provisioning

This tutorial describes the steps you need to perform in both Clarizen One and Microsoft Entra ID to configure automatic user provisioning. When configured, Microsoft Entra ID automatically provisions and deprovisions users and groups to [Clarizen One](https://www.clarizen.com/) by using the Microsoft Entra provisioning service. For information on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to software as a service (SaaS) applications with Microsoft Entra ID](../app-provisioning/user-provisioning.md).

## Capabilities supported

> [!div class="checklist"]
> * Create users in Clarizen One.
> * Remove users in Clarizen One when they don't require access anymore.
> * Keep user attributes synchronized between Microsoft Entra ID and Clarizen One.
> * Provision groups and group memberships in Clarizen One.
> * [Single sign-on (SSO)](./clarizen-tutorial.md) to Clarizen One is recommended.

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* [A Microsoft Entra tenant](../develop/quickstart-create-new-tenant.md).
* A user account in Microsoft Entra ID with [permission](../roles/permissions-reference.md) to configure provisioning. Examples are Application administrator, Cloud Application administrator, Application owner, or Global administrator.
* A user account in Clarizen One with **Integration User** and **Lite Admin** [permissions](https://success.clarizen.com/hc/articles/360011833079-API-Keys-Support).

## Step 1: Plan your provisioning deployment

1. Learn about [how the provisioning service works](../app-provisioning/user-provisioning.md).
1. Determine who will be in [scope for provisioning](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).
1. Determine what data to [map between Microsoft Entra ID and Clarizen One](../app-provisioning/customize-application-attributes.md).

<a name='step-2-configure-clarizen-one-to-support-provisioning-with-azure-ad'></a>

## Step 2: Configure Clarizen One to support provisioning with Microsoft Entra ID

1. Select one of the four following Tenant URLs according to your Clarizen One environment and data center:
      * US Production data center: https://servicesapp2.clarizen.com/scim/v2
      * EU Production data center: https://serviceseu1.clarizen.com/scim/v2
      * US Sandbox data center: https://servicesapp.clarizentb.com/scim/v2
      * EU Sandbox data center: https://serviceseu.clarizentb.com/scim/v2

1. Generate an [API key](https://success.clarizen.com/hc/articles/360011833079-API-Keys-Support). This value will be entered in the **Secret Token** box on the **Provisioning** tab of your Clarizen One application.

<a name='step-3-add-clarizen-one-from-the-azure-ad-application-gallery'></a>

## Step 3: Add Clarizen One from the Microsoft Entra application gallery

Add Clarizen One from the Microsoft Entra application gallery to start managing provisioning to Clarizen One. If you've previously set up Clarizen One for SSO, you can use the same application. When you test out the integration initially, create a separate app. To learn more about how to add an application from the gallery, see [Add an application to your Microsoft Entra tenant](../manage-apps/add-application-portal.md).

## Step 4: Define who will be in scope for provisioning

With the Microsoft Entra provisioning service, you can scope who will be provisioned based on assignment to the application or based on attributes of the user or group. If you choose to scope who will be provisioned to your app based on assignment, follow the steps in [Manage user assignment for an app in Microsoft Entra ID](../manage-apps/assign-user-or-group-access-portal.md) to assign users and groups to the application. If you choose to scope who will be provisioned based solely on attributes of the user or group, use a scoping filter as described in [Attribute-based application provisioning with scoping filters](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

* When you assign users and groups to Clarizen One, you must select a role other than **Default Access**. Users with the default access role are excluded from provisioning and will be marked as not effectively entitled in the provisioning logs. If the only role available on the application is the default access role, you can [update the application manifest](../develop/howto-add-app-roles-in-azure-ad-apps.md) to add more roles.
* Start small. Test with a small set of users and groups before you roll out to everyone. When scope for provisioning is set to assigned users and groups, you can maintain control by assigning one or two users or groups to the app. When scope is set to all users and groups, you can specify an [attribute-based scoping filter](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

## Step 5: Configure automatic user provisioning to Clarizen One

This section guides you through the steps to configure the Microsoft Entra provisioning service to create, update, and disable users or groups in TestApp based on user or group assignments in Microsoft Entra ID.

<a name='configure-automatic-user-provisioning-for-clarizen-one-in-azure-ad'></a>

### Configure automatic user provisioning for Clarizen One in Microsoft Entra ID

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications**.

      ![Screenshot that shows the Enterprise applications pane.](common/enterprise-applications.png)

1. In the applications list, select **Clarizen One**.

      ![Screenshot that shows the Clarizen One link in the Applications list.](common/all-applications.png)

1. Select the **Provisioning** tab.

      ![Screenshot that shows the Provisioning tab.](common/provisioning.png)

1. Set **Provisioning Mode** to **Automatic**.

      ![Screenshot that shows the Provisioning tab Automatic option.](common/provisioning-automatic.png)

1. Under the **Admin Credentials** section, input your Clarizen One **Tenant URL** and **Secret Token**. Select **Test Connection** to ensure Microsoft Entra ID can connect to Clarizen One. If the connection fails, ensure your Clarizen One account has admin permissions and try again.

    ![Screenshot that shows the Secret Token box.](common/provisioning-testconnection-tenanturltoken.png)

1. In the **Notification Email** box, enter the email address of a person or group who should receive the provisioning error notifications. Select the **Send an email notification when a failure occurs** check box.

    ![Screenshot that shows the Notification Email box.](common/provisioning-notification-email.png)

1. Select **Save**.

1. Under the **Mappings** section, select **Synchronize Microsoft Entra users to Clarizen One**.

1. Review the user attributes that are synchronized from Microsoft Entra ID to Clarizen One in the **Attribute-Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in Clarizen One for update operations. If you change the [matching target attribute](../app-provisioning/customize-application-attributes.md), you must ensure that the Clarizen One API supports filtering users based on that attribute. Select the **Save** button to commit any changes.

   |Attribute|Type|
   |---|---|
   |userName|String|
   |displayName|String|
   |active|Boolean|
   |title|String|
   |emails[type eq "work"].value|String|
   |emails[type eq "home"].value|String|
   |emails[type eq "other"].value|String|
   |preferredLanguage|String|
   |name.givenName|String|
   |name.familyName|String|
   |name.formatted|String|
   |name.honorificPrefix|String|
   |name.honorificSuffix|String|
   |addresses[type eq "other"].formatted|String|
   |addresses[type eq "work"].formatted|String|
   |addresses[type eq "work"].country|String|
   |addresses[type eq "work"].region|String|
   |addresses[type eq "work"].locality|String|
   |addresses[type eq "work"].postalCode|String|
   |addresses[type eq "work"].streetAddress|String|
   |phoneNumbers[type eq "work"].value|String|
   |phoneNumbers[type eq "mobile"].value|String|
   |phoneNumbers[type eq "fax"].value|String|
   |phoneNumbers[type eq "home"].value|String|
   |phoneNumbers[type eq "other"].value|String|
   |phoneNumbers[type eq "pager"].value|String|
   |externalId|String|
   |nickName|String|
   |locale|String|
   |roles[primary eq "True".type]|String|
   |roles[primary eq "True".value]|String|
   |timezone|String|
   |userType|String|
   |urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:department|String|
   |urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:employeeNumber|String|
   |urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:manager|Reference|
   |urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:costCenter|String|
   |urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:division|String|
   |urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:division|String|

1. Under the **Mappings** section, select **Synchronize Microsoft Entra groups to Clarizen One**.

1. Review the group attributes that are synchronized from Microsoft Entra ID to Clarizen One in the **Attribute-Mapping** section. The attributes selected as **Matching** properties are used to match the groups in Clarizen One for update operations. Select the **Save** button to commit any changes.

      |Attribute|Type|
      |---|---|
      |displayName|String|
      |externalId|String|
      |members|Reference|

1. To configure scoping filters, see the instructions in the  [Scoping filter tutorial](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

1. To enable the Microsoft Entra provisioning service for Clarizen One, change **Provisioning Status** to **On** in the **Settings** section.

      ![Screenshot that shows the Provisioning Status toggled On.](common/provisioning-toggle-on.png)

1. Define the users or groups that you want to provision to Clarizen One by selecting the desired values in **Scope** in the **Settings** section.

      ![Screenshot that shows the provisioning Scope.](common/provisioning-scope.png)

1. When you're ready to provision, select **Save**.

      ![Screenshot that shows saving the provisioning configuration.](common/provisioning-configuration-save.png)

This operation starts the initial synchronization cycle of all users and groups defined in **Scope** in the **Settings** section. The initial cycle takes longer to perform than subsequent cycles, which occur approximately every 40 minutes as long as the Microsoft Entra provisioning service is running.

## Step 6: Monitor your deployment

After you've configured provisioning, use the following resources to monitor your deployment.

1. Use the [provisioning logs](../reports-monitoring/concept-provisioning-logs.md) to determine which users have been provisioned successfully or unsuccessfully.
1. Check the [progress bar](../app-provisioning/application-provisioning-when-will-provisioning-finish-specific-user.md) to see the status of the provisioning cycle and how close it is to completion.
1. If the provisioning configuration seems to be in an unhealthy state, the application will go into quarantine. To learn more about quarantine states, see [Application provisioning in quarantine status](../app-provisioning/application-provisioning-quarantine-status.md).

## Troubleshooting tips

When you assign a user to the Clarizen One gallery app, select only the **User** role. The following roles are invalid:

* Administrator (admin)
* Email Reporting user
* External user
* Financial user
* Social user
* Superuser
* Time & Expense user

## Additional resources

* [Managing user account provisioning for enterprise apps](../app-provisioning/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md)
