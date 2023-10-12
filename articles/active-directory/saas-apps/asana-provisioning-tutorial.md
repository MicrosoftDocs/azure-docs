---
title: 'Tutorial: Configure Asana for automatic user provisioning with Microsoft Entra ID'
description: Learn how to automatically provision and deprovision user accounts from Microsoft Entra ID to Asana.
services: active-directory
author: twimmers
writer: twimmers
manager: jeedes

ms.assetid: 274810a2-bd74-4500-95f1-c720abf23541
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 04/04/2023
ms.author: thwimmer
---

# Tutorial: Configure Asana for automatic user provisioning

This tutorial describes the steps you need to do in both Asana and Microsoft Entra ID to configure automatic user provisioning. When configured, Microsoft Entra ID automatically provisions and deprovisions users and groups to [Asana](https://www.asana.com/) using the Microsoft Entra provisioning service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Microsoft Entra ID](../app-provisioning/user-provisioning.md). 


## Capabilities Supported
> [!div class="checklist"]
> * Create users in Asana.
> * Remove users in Asana when they do not require access anymore.
> * Keep user attributes synchronized between Microsoft Entra ID and Asana.
> * Provision groups and group memberships in Asana.
> * [Single sign-on](asana-tutorial.md) to Asana(recommended).

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* A Microsoft Entra tenant
* An Asana tenant with an [Enterprise](https://www.asana.com/pricing) plan or better enabled
* A user account in Asana with admin permissions

> [!NOTE]
> Microsoft Entra provisioning integration relies on the [Asana API](https://asana.com/developers/api-reference/users), which is available to Asana.

## Step 1: Plan your provisioning deployment
1. Learn about [how the provisioning service works](../app-provisioning/user-provisioning.md).
1. Determine who will be in [scope for provisioning](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).
1. Determine what data to [map between Microsoft Entra ID and Asana](../app-provisioning/customize-application-attributes.md). 

<a name='step-2-configure-asana-to-support-provisioning-with-azure-ad'></a>

## Step 2: Configure Asana to support provisioning with Microsoft Entra ID
 > [!TIP]
 > To enable SAML-based single sign-on for Asana, follow the instructions provided. Single sign-on can be configured independently of automatic provisioning, although these two features complement each other.

### Generate Secret Token in Asana

* Sign in to [Asana](https://app.asana.com/-/login) by using your admin account.
* Select the profile photo from the top bar, and select your current organization-name settings.
* Go to the **Service Accounts** tab.
* Select **Add Service Account**.
* Update **Name** and **About** and the profile photo as needed. Copy the token in **Token**, and select it in Save Changes.

<a name='step-3-add-asana-from-the-azure-ad-application-gallery'></a>

## Step 3: Add Asana from the Microsoft Entra application gallery

Add Asana from the Microsoft Entra application gallery to start managing provisioning to Asana. If you have previously setup Asana for SSO, you can use the same application. However it's recommended that you create a separate app when testing out the integration initially. Learn more about adding an application from the gallery [here](../manage-apps/add-application-portal.md). 

## Step 4: Define who will be in scope for provisioning 

The Microsoft Entra provisioning service allows you to scope who will be provisioned based on assignment to the application and or based on attributes of the user / group. If you choose to scope who will be provisioned to your app based on assignment, you can use the following [steps](../manage-apps/assign-user-or-group-access-portal.md) to assign users and groups to the application. If you choose to scope who will be provisioned based solely on attributes of the user or group, you can use a scoping filter as described [here](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

* Start small. Test with a small set of users and groups before rolling out to everyone. When scope for provisioning is set to assigned users and groups, you can control this by assigning one or two users or groups to the app. When scope is set to all users and groups, you can specify an [attribute based scoping filter](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

* If you need more roles, you can [update the application manifest](../develop/howto-add-app-roles-in-azure-ad-apps.md) to add new roles.


## Step 5: Configure automatic user provisioning to Asana 

This section guides you through the steps to configure the Microsoft Entra provisioning service to create, update, and disable users and groups in Asana based on user and/or group assignments in Microsoft Entra ID.

<a name='to-configure-automatic-user-provisioning-for-asana-in-azure-ad'></a>

### To configure automatic user provisioning for Asana in Microsoft Entra ID:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications**

	![Screenshot of Enterprise applications blade.](common/enterprise-applications.png)

1. In the applications list, select **Asana**.

	![Screenshot of the Asana link in the Applications list.](common/all-applications.png)

1. Select the **Provisioning** tab.

	![Screenshot of Provisioning tab.](common/provisioning.png)

1. Set the **Provisioning Mode** to **Automatic**.

	![Screenshot of Provisioning tab automatic.](common/provisioning-automatic.png)

1. In the **Admin Credentials** section, input your Asana Tenant URL and Secret Token provided by Asana. Click **Test Connection** to ensure Microsoft Entra ID can connect to Asana. If the connection fails, contact Asana to check your account setup.

 	![Screenshot of token.](common/provisioning-testconnection-tenanturltoken.png)

1. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and select the **Send an email notification when a failure occurs** check box.

	![Screenshot of notification email.](common/provisioning-notification-email.png)

1. Select **Save**.

1. In the **Mappings** section, select **Synchronize Microsoft Entra users to Asana**.

1. Review the user attributes that are synchronized from Microsoft Entra ID to Asana in the **Attribute-Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in Asana for update operations. If you choose to change the [matching target attribute](../app-provisioning/customize-application-attributes.md), you need to ensure that the Asana API supports filtering users based on that attribute. Select the **Save** button to commit any changes.

   |Attribute|Type|Supported for filtering|Required by Asana|
   |---|---|---|---|
   |userName|String|&check;|&check;   
   |active|Boolean||
   |name.formatted|String||
   |title|String||
   |urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:department|String||
   |urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:manager|Reference||
   |addresses[type eq "work"].country|String||
   |addresses[type eq "work"].region|String||
   |addresses[type eq "work"].locality|String||
   |phoneNumbers[type eq "work"].value|String||
   |urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:employeeNumber|String||
   |urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:costCenter|String||
   |urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:organization|String||
   |urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:division|String||


1. Under the **Mappings** section, select **Synchronize Microsoft Entra groups to Asana**.

1. Review the group attributes that are synchronized from Microsoft Entra ID to Asana in the **Attribute-Mapping** section. The attributes selected as **Matching** properties are used to match the groups in Asana for update operations. Select the **Save** button to commit any changes.

      |Attribute|Type|Supported for filtering|Required by Asana|
      |---|---|---|---|
      |displayName|String|&check;|&check;      
      |members|Reference||

1. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

1. To enable the Microsoft Entra provisioning service for Asana, change the **Provisioning Status** to **On** in the **Settings** section.

	![Screenshot of Provisioning status toggled on.](common/provisioning-toggle-on.png)

1. Define the users and groups that you would like to provision to Asana by choosing the appropriate values in **Scope** in the **Settings** section.

	![Screenshot of Provisioning scope.](common/provisioning-scope.png)

1. When you're ready to provision, click **Save**.

	![Screenshot of Saving provisioning configuration.](common/provisioning-configuration-save.png)

This operation starts the initial synchronization cycle of all users and groups defined in **Scope** in the **Settings** section. The initial cycle takes longer to execute than next cycles, which occur approximately every 40 minutes as long as the Microsoft Entra provisioning service is running. 

## Step 6: Monitor your deployment
Once you've configured provisioning, use the following resources to monitor your deployment:

* Use the [provisioning logs](../reports-monitoring/concept-provisioning-logs.md) to determine which users have been provisioned successfully or unsuccessfully
* Check the [progress bar](../app-provisioning/application-provisioning-when-will-provisioning-finish-specific-user.md) to see the status of the provisioning cycle and how close it's to completion
* If the provisioning configuration seems to be in an unhealthy state, the application goes into quarantine. Learn more about quarantine states [here](../app-provisioning/application-provisioning-quarantine-status.md).  

## Change log

* 11/06/2021 - Dropped support for **externalId, name.givenName and name.familyName**. Added support for **preferredLanguage , title and urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:department**. Enabled **Group Provisioning**.
* 05/23/2023 - Dropped support for **preferredLanguage** Added support for **urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:manager**.
* 09/07/2023 - Added support for **addresses[type eq "work"].locality, addresses[type eq "work"].region, addresses[type eq "work"].country, phoneNumbers[type eq "work"].value, urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:employeeNumber, urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:costCenter, 
urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:organization and urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:division**.

## More resources

* [Managing user account provisioning for Enterprise Apps](../app-provisioning/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md)
