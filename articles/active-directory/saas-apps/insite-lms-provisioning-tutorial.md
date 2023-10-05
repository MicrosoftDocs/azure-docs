---
title: 'Tutorial: Configure Insite LMS for automatic user provisioning with Microsoft Entra ID'
description: Learn how to automatically provision and deprovision user accounts from Microsoft Entra ID to Insite LMS.
services: active-directory
author: twimmers
writer: twimmers
manager: jeedes
ms.assetid: c4dbe83d-b5b4-4089-be89-b357e8d6f359
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 11/21/2022
ms.author: thwimmer
---

# Tutorial: Configure Insite LMS for automatic user provisioning

This tutorial describes the steps you need to do in both Insite LMS and Microsoft Entra ID to configure automatic user provisioning. When configured, Microsoft Entra ID automatically provisions and deprovisions users and groups to [Insite LMS](https://www.insite-it.net/) using the Microsoft Entra provisioning service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Microsoft Entra ID](../app-provisioning/user-provisioning.md). 


## Capabilities Supported
> [!div class="checklist"]
> * Create users in Insite LMS
> * Remove users in Insite LMS when they do not require access anymore
> * Keep user attributes synchronized between Microsoft Entra ID and Insite LMS

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* [A Microsoft Entra tenant](../develop/quickstart-create-new-tenant.md) 
* A user account in Microsoft Entra ID with [permission](../roles/permissions-reference.md) to configure provisioning (for example, Application Administrator, Cloud Application administrator, Application Owner, or Global Administrator). 
* A [Insite LMS tenant](https://www.insite-it.net/).
* A user account in Insite LMS with Admin permissions.

## Step 1: Plan your provisioning deployment

1. Learn about [how the provisioning service works](../app-provisioning/user-provisioning.md).
1. Determine who is in [scope for provisioning](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).
1. Determine what data to [map between Microsoft Entra ID and Insite LMS](../app-provisioning/customize-application-attributes.md).

<a name='step-2-configure-insite-lms-to-support-provisioning-with-azure-ad'></a>

## Step 2: Configure Insite LMS to support provisioning with Microsoft Entra ID
To generate the Secret Token

1. Log in to [Insite LMS Console](https://portal.insitelms.net) with your Admin account. 
1. Navigate to **Applications** module on the left hand side menu.
1. In the section **Self hosted Jobs**, you'll find a job named “SCIM”. If you can't find the job, contact the Insite LMS support team.

	![Screenshot of generate API Key.](media/insite-lms-provisioning-tutorial/generate-api-key.png)

1. Click on **Generate Api Key**.
Copy and save the **Api Key**. This value is entered in the **Secret Token** field in the Provisioning tab of your Insite LMS application.

> [!NOTE]
> The Api Key is only valid for 1 year and needs to be renewed manually before it expires.

<a name='step-3-add-insite-lms-from-the-azure-ad-application-gallery'></a>

## Step 3: Add Insite LMS from the Microsoft Entra application gallery

Add Insite LMS from the Microsoft Entra application gallery to start managing provisioning to Insite LMS. If you have previously setup Insite LMS for SSO, you can use the same application. However it's recommended that you create a separate app when testing out the integration initially. Learn more about adding an application from the gallery [here](../manage-apps/add-application-portal.md). 

## Step 4: Define who is in scope for provisioning 

The Microsoft Entra provisioning service allows you to scope who is provisioned based on assignment to the application and or based on attributes of the user / group. If you choose to scope who is provisioned to your app based on assignment, you can use the following [steps](../manage-apps/assign-user-or-group-access-portal.md) to assign users and groups to the application. If you choose to scope who is provisioned based solely on attributes of the user or group, you can use a scoping filter as described [here](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md). 

* Start small. Test with a small set of users and groups before rolling out to everyone. When scope for provisioning is set to assigned users and groups, you can control this by assigning one or two users or groups to the app. When scope is set to all users and groups, you can specify an [attribute based scoping filter](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

* If you need more roles, you can [update the application manifest](../develop/howto-add-app-roles-in-azure-ad-apps.md) to add new roles.


## Step 5: Configure automatic user provisioning to Insite LMS

This section guides you through the steps to configure the Microsoft Entra provisioning service to create, update, and disable users and/or groups in Insite LMS app based on user and group assignments in Microsoft Entra ID.

<a name='to-configure-automatic-user-provisioning-for-insite-lms-in-azure-ad'></a>

### To configure automatic user provisioning for Insite LMS in Microsoft Entra ID:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications**

	![Screenshot of Enterprise applications blade.](common/enterprise-applications.png)

1. In the applications list, select **Insite LMS**.

	![Screenshot of The Insite LMS link in the Applications list.](common/all-applications.png)

1. Select the **Provisioning** tab.

	![Screenshot of Provisioning tab.](common/provisioning.png)

1.  Set the **Provisioning Mode** to **Automatic**.

	![Screenshot of Provisioning tab automatic.](common/provisioning-automatic.png)

1. In the **Admin Credentials** section,
enter your Insite LMS **Tenant URL** as `https://api.insitelms.net/scim` and enter the **Secret token** generated in Step 2 above. Select **Test Connection** to ensure that Microsoft Entra ID can connect to Insite LMS. If the connection fails, ensure that your Insite LMS account has admin permissions and try again.

 	![Screenshot of Token.](common/provisioning-testconnection-tenanturltoken.png)

1. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications. Select the **Send an email notification when a failure occurs** check box.

	![Screenshot of Notification Email.](common/provisioning-notification-email.png)

1. Select **Save**.

1. In the **Mappings** section, select **Synchronize Microsoft Entra users to Insite LMS**.

1. Review the user attributes that are synchronized from Microsoft Entra ID to Insite LMS in the **Attribute Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in Insite LMS for update operations. If you change the [matching target attribute](../app-provisioning/customize-application-attributes.md), you need to ensure that the Insite LMS API supports filtering users based on that attribute. Select **Save** to commit any changes.

   |Attribute|Type|Supported for filtering|Required by Insite LMS|
   |---|---|---|---|
   |userName|String|&check;|&check;|
   |emails[type eq "work"].value|String|&check;|&check;|
   |active|Boolean||
   |name.givenName|String||
   |name.familyName|String||
   |phoneNumbers[type eq "work"].value|String||

1. To configure scoping filters, see the instructions provided in the [Scoping filter tutorial](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

1. To enable the Microsoft Entra provisioning service for Insite LMS, change **Provisioning Status** to **On** in the **Settings** section.

	![Screenshot of Provisioning Status Toggled On.](common/provisioning-toggle-on.png)

1. Define the users or groups that you want to provision to Insite LMS by selecting the desired values in **Scope** in the **Settings** section.

	![Screenshot of Provisioning Scope.](common/provisioning-scope.png)

1. When you're ready to provision, select **Save**.

	![Screenshot of Saving Provisioning Configuration.](common/provisioning-configuration-save.png)

This operation starts the initial synchronization cycle of all users and groups defined in **Scope** in the **Settings** section. The initial cycle takes longer to do than next cycles, which occur about every 40 minutes as long as the Microsoft Entra provisioning service is running.

## Step 6: Monitor your deployment

After you've configured provisioning, use the following resources to monitor your deployment:

* Use the [provisioning logs](../reports-monitoring/concept-provisioning-logs.md) to determine which users were provisioned successfully or unsuccessfully.
* Check the [progress bar](../app-provisioning/application-provisioning-when-will-provisioning-finish-specific-user.md) to see the status of the provisioning cycle and how close it's to completion.
* If the provisioning configuration seems to be in an unhealthy state, the application goes into quarantine. To learn more about quarantine states, see [Application provisioning status of quarantine](../app-provisioning/application-provisioning-quarantine-status.md).

## More resources

* [Managing user account provisioning for enterprise apps](../app-provisioning/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md)
