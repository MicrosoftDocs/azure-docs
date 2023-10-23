---
title: 'Tutorial: Configure Zoho One for automatic user provisioning with Microsoft Entra ID | Microsoft Docs'
description: Learn how to automatically provision and de-provision user accounts from Microsoft Entra ID to Zoho One.
services: active-directory
author: twimmers
writer: twimmers
manager: jeedes
ms.assetid: 691f20c5-4d88-407c-a882-94b4864547a8
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 03/07/2023
ms.author: thwimmer
---

# Tutorial: Configure Zoho One for automatic user provisioning

This tutorial describes the steps you need to perform in both Zoho One and Microsoft Entra ID to configure automatic user provisioning. When configured, Microsoft Entra ID automatically provisions and de-provisions users and groups to [Zoho One](https://www.zoho.com) using the Microsoft Entra provisioning service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Microsoft Entra ID](../app-provisioning/user-provisioning.md). 


## Supported capabilities
> [!div class="checklist"]
> * Create users in Zoho One.
> * Remove users in Zoho One when they do not require access anymore.
> * Keep user attributes synchronized between Microsoft Entra ID and Zoho One.
> * Provision groups and group memberships in Zoho One
> * [Single sign-on](zohoone-tutorial.md) to Zoho One (recommended).

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* [A Microsoft Entra tenant](../develop/quickstart-create-new-tenant.md) 
* A user account in Microsoft Entra ID with [permission](../roles/permissions-reference.md) to configure provisioning (for example, Application Administrator, Cloud Application administrator, Application Owner, or Global Administrator).
* An administrator account with Zoho One. 

## Step 1: Plan your provisioning deployment
1. Learn about [how the provisioning service works](../app-provisioning/user-provisioning.md).
1. Determine who will be in [scope for provisioning](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).
1. Determine what data to [map between Microsoft Entra ID and Zoho One](../app-provisioning/customize-application-attributes.md).

<a name='step-2-configure-zoho-one-to-support-provisioning-with-azure-ad'></a>

## Step 2: Configure Zoho One to support provisioning with Microsoft Entra ID

Contact Zoho One support to configure Zoho One to support provisioning with Microsoft Entra ID.

<a name='step-3-add-zoho-one-from-the-azure-ad-application-gallery'></a>

## Step 3: Add Zoho One from the Microsoft Entra application gallery

Add Zoho One from the Microsoft Entra application gallery to start managing provisioning to Zoho One. If you have previously setup Zoho One for SSO you can use the same application. However it's recommended that you create a separate app when testing out the integration initially. Learn more about adding an application from the gallery [here](../manage-apps/add-application-portal.md). 

## Step 4: Define who will be in scope for provisioning 

The Microsoft Entra provisioning service allows you to scope who will be provisioned based on assignment to the application and or based on attributes of the user / group. If you choose to scope who will be provisioned to your app based on assignment, you can use the following [steps](../manage-apps/assign-user-or-group-access-portal.md) to assign users and groups to the application. If you choose to scope who will be provisioned based solely on attributes of the user or group, you can use a scoping filter as described [here](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md). 

* Start small. Test with a small set of users and groups before rolling out to everyone. When scope for provisioning is set to assigned users and groups, you can control this by assigning one or two users or groups to the app. When scope is set to all users and groups, you can specify an [attribute based scoping filter](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

* If you need more roles, you can [update the application manifest](../develop/howto-add-app-roles-in-azure-ad-apps.md) to add new roles.


## Step 5: Configure automatic user provisioning to Zoho One 

This section guides you through the steps to configure the Microsoft Entra provisioning service to create, update, and disable users and/or groups in TestApp based on user and/or group assignments in Microsoft Entra ID.

<a name='to-configure-automatic-user-provisioning-for-zoho-one-in-azure-ad'></a>

### To configure automatic user provisioning for Zoho One in Microsoft Entra ID:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications**

	![Screenshot of Enterprise applications blade.](common/enterprise-applications.png)

1. In the applications list, select **Zoho One**.

	![Screenshot of the Zoho One link in the Applications list.](common/all-applications.png)

1. Select the **Provisioning** tab.

	![Screenshot of Provisioning tab.](common/provisioning.png)

1. Set the **Provisioning Mode** to **Automatic**.

	![Screenshot of Provisioning tab automatic.](common/provisioning-automatic.png)

1. Under the **Admin Credentials** section, input your Zoho One Tenant URL, Authorization Endpoint and Token Endpoint. Click **Test Connection** to ensure Microsoft Entra ID can connect to Zoho One. If the connection fails, ensure your Zoho One account has Admin permissions and try again.

 	![Screenshot of Token.](media/zoho-one-provisioning-tutorial/test-connection.png)

   >[!NOTE]
   >* Zoho One's Tenant URL, Authorization Endpoint and Token Endpoint are all region specific. So be carful in entering those.
   >* **Authorization Endpoint** should always be appended with `?access_type=offline&prompt=consent&response_type=code&state=&client_id=1000.T3YYZHB8J5Y2BQ185U2FWOIKREUWAH&scope=ZohoOne.SCIM.ALL&redirect_uri=https%3A%2f%2fportal.azure.com%2fTokenAuthorize` while entering the value (For example, if the region is US, then the Authorization Endpoint to be entered should be `https://accounts.zoho.com/oauth/v2/auth?access_type=offline&prompt=consent&response_type=code&state=&client_id=1000.T3YYZHB8J5Y2BQ185U2FWOIKREUWAH&scope=ZohoOne.SCIM.ALL&redirect_uri=https%3A%2f%2fportal.azure.com%2fTokenAuthorize`)

1. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and select the **Send an email notification when a failure occurs** check box.

	![Screenshot of Notification Email.](common/provisioning-notification-email.png)

1. Select **Save**.

1. Under the **Mappings** section, select **Synchronize Microsoft Entra users to Zoho One**.

1. Review the user attributes that are synchronized from Microsoft Entra ID to Zoho One in the **Attribute-Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in Zoho One for update operations. If you choose to change the [matching target attribute](../app-provisioning/customize-application-attributes.md), you'll need to ensure that the Zoho One API supports filtering users based on that attribute. Select the **Save** button to commit any changes.

   |Attribute|Type|Supported for filtering|Required by Zoho One|
   |---|---|---|---|
   |userName|String|&check;|&check;
   |active|Boolean||
   |displayName|String||
   |title|String||
   |emails[type eq "work"].value|String||
   |preferredLanguage|String||
   |name.givenName|String||
   |name.familyName|String||
   |name.formatted|String||
   |preferredLanguage|String||
   |addresses[type eq "work"].formatted|String||
   |addresses[type eq "work"].streetAddress|String||
   |addresses[type eq "work"].locality|String||
   |addresses[type eq "work"].region|String||
   |addresses[type eq "work"].postalCode|String||
   |addresses[type eq "work"].country|String||
   |phoneNumbers[type eq "mobile"].value|String||
   |pphoneNumbers[type eq "fax"].value|String||
   |phoneNumbers[type eq "work"].value|String||
   |externalId|String||

1. Under the **Mappings** section, select **Synchronize Microsoft Entra groups to Zoho One**.

1. Review the group attributes that are synchronized from Microsoft Entra ID to Zoho One in the **Attribute-Mapping** section. The attributes selected as **Matching** properties are used to match the groups in Zoho One for update operations. Select the **Save** button to commit any changes.

   |Attribute|Type|Supported for filtering|Required by Zoho One|
   |---|---|---|---|
   |displayName|String|&check;|&check;
   |members|Reference||
   |externalId|String||


1. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

1. To enable the Microsoft Entra provisioning service for Zoho One, change the **Provisioning Status** to **On** in the **Settings** section.

	![Screenshot of Provisioning Status Toggled On.](common/provisioning-toggle-on.png)

1. Define the users and/or groups that you would like to provision to Zoho One by choosing the desired values in **Scope** in the **Settings** section.

	![Screenshot of Provisioning Scope.](common/provisioning-scope.png)

1. When you're ready to provision, click **Save**.

	![Screenshot of Saving Provisioning Configuration.](common/provisioning-configuration-save.png)

This operation starts the initial synchronization cycle of all users and groups defined in **Scope** in the **Settings** section. The initial cycle takes longer to perform than subsequent cycles, which occur approximately every 40 minutes as long as the Microsoft Entra provisioning service is running. 

## Step 6: Monitor your deployment
Once you've configured provisioning, use the following resources to monitor your deployment:

* Use the [provisioning logs](../reports-monitoring/concept-provisioning-logs.md) to determine which users have been provisioned successfully or unsuccessfully
* Check the [progress bar](../app-provisioning/application-provisioning-when-will-provisioning-finish-specific-user.md) to see the status of the provisioning cycle and how close it's to completion
* If the provisioning configuration seems to be in an unhealthy state, the application goes into quarantine. Learn more about quarantine states [here](../app-provisioning/application-provisioning-quarantine-status.md).

## More resources

* [Managing user account provisioning for Enterprise Apps](../app-provisioning/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md)
