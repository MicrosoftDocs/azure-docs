---
title: 'Tutorial: Configure Freshservice Provisioning for automatic user provisioning with Microsoft Entra ID'
description: Learn how to automatically provision and de-provision user accounts from Microsoft Entra ID to Freshservice Provisioning.
services: active-directory
documentationcenter: ''
author: twimmers
writer: twimmers
manager: jeedes

ms.assetid: e03ec65a-25ef-4c91-a364-36b2f007443c
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: tutorial
ms.date: 11/21/2022
ms.author: thwimmer
---

# Tutorial: Configure Freshservice Provisioning for automatic user provisioning

This tutorial describes the steps you need to perform in both Freshservice Provisioning and Microsoft Entra ID to configure automatic user provisioning. When configured, Microsoft Entra ID automatically provisions and de-provisions users to [Freshservice Provisioning](https://effy.co.in/) using the Microsoft Entra provisioning service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Microsoft Entra ID](../app-provisioning/user-provisioning.md). 


## Capabilities supported
> [!div class="checklist"]
> * Create users in Freshservice Provisioning
> * Remove users in Freshservice Provisioning when they do not require access anymore
> * Keep user attributes synchronized between Microsoft Entra ID and Freshservice Provisioning

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* [A Microsoft Entra tenant](../develop/quickstart-create-new-tenant.md) 
* A user account in Microsoft Entra ID with [permission](../users-groups-roles/directory-assign-admin-roles.md) to configure provisioning (for example, Application Administrator, Cloud Application administrator, Application Owner, or Global Administrator). 
* A [Freshservice account](https://www.freshservice.com) with the Organizational Admin permissions.

## Step 1: Plan your provisioning deployment
1. Learn about [how the provisioning service works](../manage-apps/user-provisioning.md).
2. Determine who will be in [scope for provisioning](../manage-apps/define-conditional-rules-for-provisioning-user-accounts.md).
3. Determine what data to [map between Microsoft Entra ID and Freshservice Provisioning](../manage-apps/customize-application-attributes.md). 

<a name='step-2-configure-freshservice-provisioning-to-support-provisioning-with-azure-ad'></a>

## Step 2: Configure Freshservice Provisioning to support provisioning with Microsoft Entra ID

1. On your Freshservice account, install the **Azure Provisioning (SCIM)** app from the marketplace by navigating to **Freshservice Admin** > **Apps** > **Get Apps**.
2. In the configuration screen, provide your **Freshservice Domain** (for example, `acme.freshservice.com`) and the **Organization Admin API key**.
3. Click **Continue**.
4. Highlight and copy the **Bearer Token**. This value will be entered in the **Secret Token** field in the Provisioning tab of your Freshservice Provisioning application.
5. Click **Install** to complete the installation.
6. The **Tenant URL** is `https://scim.freshservice.com/scim/v2`. This value will be entered in the **Tenant URL** field in the Provisioning tab of your Freshservice Provisioning application.

<a name='step-3-add-freshservice-provisioning-from-the-azure-ad-application-gallery'></a>

## Step 3: Add Freshservice Provisioning from the Microsoft Entra application gallery

Add Freshservice Provisioning from the Microsoft Entra application gallery to start managing provisioning to Freshservice Provisioning. Learn more about adding an application from the gallery [here](../manage-apps/add-gallery-app.md). 

## Step 4: Define who will be in scope for provisioning 

The Microsoft Entra provisioning service allows you to scope who will be provisioned based on assignment to the application and or based on attributes of the user. If you choose to scope who will be provisioned to your app based on assignment, you can use the following [steps](../manage-apps/assign-user-or-group-access-portal.md) to assign users to the application. If you choose to scope who will be provisioned based solely on attributes of the user, you can use a scoping filter as described [here](../manage-apps/define-conditional-rules-for-provisioning-user-accounts.md). 

* Start small. Test with a small set of users and groups before rolling out to everyone. When scope for provisioning is set to assigned users and groups, you can control this by assigning one or two users or groups to the app. When scope is set to all users and groups, you can specify an [attribute based scoping filter](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

* Start small. Test with a small set of users before rolling out to everyone. When scope for provisioning is set to assigned users, you can control this by assigning one or two users to the app. When scope is set to all users and groups, you can specify an [attribute based scoping filter](../manage-apps/define-conditional-rules-for-provisioning-user-accounts.md). 


## Step 5: Configure automatic user provisioning to Freshservice Provisioning 

This section guides you through the steps to configure the Microsoft Entra provisioning service to create, update, and disable users in Freshservice Provisioning based on user assignments in Microsoft Entra ID.

<a name='to-configure-automatic-user-provisioning-for-freshservice-provisioning-in-azure-ad'></a>

### To configure automatic user provisioning for Freshservice Provisioning in Microsoft Entra ID

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications**

	![Enterprise applications blade](common/enterprise-applications.png)

1. In the applications list, select **Freshservice Provisioning**.

	![The Freshservice Provisioning link in the Applications list](common/all-applications.png)

3. Select the **Provisioning** tab.

	![Provisioning tab](common/provisioning.png)

4. Set the **Provisioning Mode** to **Automatic**.

	![Provisioning tab automatic](common/provisioning-automatic.png)

5. Under the **Admin Credentials** section, input your Freshservice Provisioning Tenant URL and Secret Token. Click **Test Connection** to ensure Microsoft Entra ID can connect to Freshservice Provisioning. If the connection fails, ensure your Freshservice Provisioning account has Admin permissions and try again.

 	![Token](common/provisioning-testconnection-tenanturltoken.png)

6. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and select the **Send an email notification when a failure occurs** check box.

	![Notification Email](common/provisioning-notification-email.png)

7. Select **Save**.

8. Under the **Mappings** section, select **Synchronize Microsoft Entra users to Freshservice Provisioning**.

9. Review the user attributes that are synchronized from Microsoft Entra ID to Freshservice Provisioning in the **Attribute-Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in Freshservice Provisioning for update operations. If you choose to change the [matching target attribute](../manage-apps/customize-application-attributes.md), you will need to ensure that the Freshservice Provisioning API supports filtering users based on that attribute. Select the **Save** button to commit any changes.

   |Attribute|Type|Supported For Filtering|
   |---|---|---|
   |userName|String|&check;|
   |active|Boolean|
   |emails[type eq "work"].value|String|
   |displayName|String|
   |name.givenName|String|
   |name.familyName|String|
   |phoneNumbers[type eq "work"].value|String|
   |phoneNumbers[type eq "mobile"].value|String|
   |addresses[type eq "work"].formatted|String|
   |locale|String|
   |title|String|
   |timezone|String|
   |externalId|String|
   |urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:department|String|
   |urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:manager|Reference|
   |urn:ietf:params:scim:schemas:extension:freshservice:2.0:User:isAgent|String|

> [!NOTE]
> Custom extension attributes can be added to your schema to meet your application's needs by following the below steps:
> * Under Mappings, select **Provision Microsoft Entra users**.
> * At the bottom of the page, select **Show advanced options**.
> * Select **Edit attribute list for Freshservice**.
> * At the bottom of the attribute list, enter information about the custom attribute in the fields provided. The custom attribute urn namespace must follow the pattern as shown in the below example. The **CustomAttribute** can be customized per your application's requirements, for example: urn:ietf:params:scim:schemas:extension:freshservice:2.0:User:**isAgent**.
> * The appropriate data type has to be selected for the custom attribute and click **Save**.
> * Navigate back to the default mappings screen and click on **Add  New Mapping**. The custom attributes will show up in the **Target Attribute** list dropdown.

10. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

11. To enable the Microsoft Entra provisioning service for Freshservice Provisioning, change the **Provisioning Status** to **On** in the **Settings** section.

	![Provisioning Status Toggled On](common/provisioning-toggle-on.png)

12. Define the users that you would like to provision to Freshservice Provisioning by choosing the desired values in **Scope** in the **Settings** section.

	![Provisioning Scope](common/provisioning-scope.png)

13. When you are ready to provision, click **Save**.

	![Saving Provisioning Configuration](common/provisioning-configuration-save.png)

This operation starts the initial synchronization cycle of all users defined in **Scope** in the **Settings** section. The initial cycle takes longer to perform than subsequent cycles, which occur approximately every 40 minutes as long as the Microsoft Entra provisioning service is running. 

## Step 6: Monitor your deployment
Once you've configured provisioning, use the following resources to monitor your deployment:

1. Use the [provisioning logs](../reports-monitoring/concept-provisioning-logs.md) to determine which users have been provisioned successfully or unsuccessfully
2. Check the [progress bar](../app-provisioning/application-provisioning-when-will-provisioning-finish-specific-user.md) to see the status of the provisioning cycle and how close it is to completion
3. If the provisioning configuration seems to be in an unhealthy state, the application will go into quarantine. Learn more about quarantine states [here](../manage-apps/application-provisioning-quarantine-status.md).

## Additional resources

* [Managing user account provisioning for Enterprise Apps](../app-provisioning/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md)
