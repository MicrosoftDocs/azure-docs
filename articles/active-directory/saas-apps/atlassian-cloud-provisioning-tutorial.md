---
title: 'Tutorial: Configure Atlassian Cloud for automatic user provisioning with Microsoft Entra ID'
description: Learn how to automatically provision and de-provision user accounts from Microsoft Entra ID to Atlassian Cloud.
services: active-directory
documentationcenter: ''
author: twimmers
writer: Thwimmer
manager: jeedes
ms.assetid: 53b804ba-b632-4c4b-a77e-ec6468536898
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.devlang: na
ms.topic: tutorial
ms.date: 11/21/2022
ms.author: Thwimmer
---

# Tutorial: Configure Atlassian Cloud for automatic user provisioning

This tutorial describes the steps you need to perform in both Atlassian Cloud and Microsoft Entra ID to configure automatic user provisioning. When configured, Microsoft Entra ID automatically provisions and de-provisions users and groups to [Atlassian Cloud](https://www.atlassian.com/cloud) using the Microsoft Entra provisioning service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Microsoft Entra ID](../app-provisioning/user-provisioning.md). 


## Capabilities supported
> [!div class="checklist"]
> * Create users in Atlassian Cloud
> * Remove users in Atlassian Cloud when they do not require access anymore
> * Keep user attributes synchronized between Microsoft Entra ID and Atlassian Cloud
> * Provision groups and group memberships in Atlassian Cloud
> * [Single sign-on](./atlassian-cloud-tutorial.md) to Atlassian Cloud (recommended)

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* [A Microsoft Entra tenant](../develop/quickstart-create-new-tenant.md).
* A user account in Microsoft Entra ID with [permission](../roles/permissions-reference.md) to configure provisioning (e.g. Application Administrator, Cloud Application administrator, Application Owner, or Global Administrator).
* Make sure you're an admin for an Atlassian organization. See [Organization administration.](https://support.atlassian.com/organization-administration/docs/explore-an-atlassian-organization).
* Verify one or more or your domains in your organization. See [Domain verification](https://support.atlassian.com/user-management/docs/verify-a-domain-to-manage-accounts).
* Subscribe to Atlassian Access from your organization. See [Atlassian Access security policies and features](https://support.atlassian.com/security-and-access-policies/docs/understand-atlassian-access).
* [An Atlassian Cloud tenant](https://www.atlassian.com/licensing/cloud) with an Atlassian Access subscription.
* Make sure you're an admin for at least one Jira or Confluence site that you want to grant synced users access to.

   > [!NOTE]
   > This integration is also available to use from Microsoft Entra US Government Cloud environment. You can find this application in the Microsoft Entra US Government Cloud Application Gallery and configure it in the same way as you do from public cloud.

## Step 1: Plan your provisioning deployment
1. Learn about [how the provisioning service works](../app-provisioning/user-provisioning.md).
1. Determine who will be in [scope for provisioning](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).
1. Determine what data to [map between Microsoft Entra ID and Atlassian Cloud](../app-provisioning/customize-application-attributes.md).

<a name='step-2-configure-atlassian-cloud-to-support-provisioning-with-azure-ad'></a>

## Step 2: Configure Atlassian Cloud to support provisioning with Microsoft Entra ID
1. Navigate to [Atlassian Admin Console](http://admin.atlassian.com/). Select your organization if you have more than one.
1. Select **Security > Identity providers**.
1. Select your Identity provider directory.
1. Select **Set up user provisioning**.
1. Copy the values for **SCIM base URL** and **API key**. You'll need them when you configure Azure. 
1. Save your **SCIM configuration**.
   > [!NOTE]
   > Make sure you store these values in a safe place, as we won't show them to you again.
   
   Users and groups will automatically be provisioned to your organization. See the [user provisioning](https://support.atlassian.com/provisioning-users/docs/understand-user-provisioning) page for more details on how your users and groups sync to your organization.
<a name='step-3-add-atlassian-cloud-from-the-azure-ad-application-gallery'></a>

## Step 3: Add Atlassian Cloud from the Microsoft Entra application gallery

Add Atlassian Cloud from the Microsoft Entra application gallery to start managing provisioning to Atlassian Cloud. If you have previously setup Atlassian Cloud for SSO you can use the same application. However it is recommended that you create a separate app when testing out the integration initially. Learn more about adding an application from the gallery [here](../manage-apps/add-application-portal.md). 

## Step 4: Define who will be in scope for provisioning 

The Microsoft Entra provisioning service allows you to scope who will be provisioned based on assignment to the application and or based on attributes of the user / group. If you choose to scope who will be provisioned to your app based on assignment, you can use the following [steps](../manage-apps/assign-user-or-group-access-portal.md) to assign users and groups to the application. If you choose to scope who will be provisioned based solely on attributes of the user or group, you can use a scoping filter as described [here](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md). 

* Start small. Test with a small set of users and groups before rolling out to everyone. When scope for provisioning is set to assigned users and groups, you can control this by assigning one or two users or groups to the app. When scope is set to all users and groups, you can specify an [attribute based scoping filter](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

* If you need additional roles, you can [update the application manifest](../develop/howto-add-app-roles-in-azure-ad-apps.md) to add new roles.


## Step 5: Configuring automatic user provisioning to Atlassian Cloud 

This section guides you through the steps to configure the Microsoft Entra provisioning service to create, update, and disable users and/or groups in Atlassian Cloud based on user and/or group assignments in Microsoft Entra ID.

<a name='to-configure-automatic-user-provisioning-for-atlassian-cloud-in-azure-ad'></a>

### To configure automatic user provisioning for Atlassian Cloud in Microsoft Entra ID:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Atlassian Cloud**.

	![Enterprise applications blade](common/enterprise-applications.png)

1. In the applications list, select **Atlassian Cloud**.

	![The Atlassian Cloud link in the Applications list](common/all-applications.png)

3. Select the **Provisioning** tab.

	![Screenshot of the Manage options with the Provisioning option called out.](common/provisioning.png)

4. Set the **Provisioning Mode** to **Automatic**.

	![Screenshot of the Provisioning Mode dropdown list with the Automatic option called out.](common/provisioning-automatic.png)

5. Under the **Admin Credentials** section, input the **Tenant URL** and **Secret Token** retrieved earlier from your Atlassian Cloud's account. Click **Test Connection** to ensure Microsoft Entra ID can connect to Atlassian Cloud. If the connection fails, ensure your Atlassian Cloud account has Admin permissions and try again.

	![Tenant URL + Token](common/provisioning-testconnection-tenanturltoken.png)

6. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and check the checkbox - **Send an email notification when a failure occurs**.

	![Notification Email](common/provisioning-notification-email.png)

7. Click **Save**.

8. Under the **Mappings** section, select **Synchronize Microsoft Entra users to Atlassian Cloud**.

9. Review the user attributes that are synchronized from Microsoft Entra ID to Atlassian Cloud in the **Attribute Mapping** section.
   **The email attribute will be used to match Atlassian Cloud accounts with your Microsoft Entra accounts.**
   Select the **Save** button to commit any changes.

   |Attribute|Type|
   |---|---|
   |userName|String|
   |active|Boolean|
   |name.familyName|String|
   |name.givenName|String|
   |emails[type eq "work"].value|String|   

10. Under the **Mappings** section, select **Synchronize Microsoft Entra groups to Atlassian Cloud**.

11. Review the group attributes that are synchronized from Microsoft Entra ID to Atlassian Cloud in the **Attribute Mapping** section.
    The display name attribute will be used to match Atlassian Cloud groups with your Microsoft Entra groups.
    Select the **Save** button to commit any changes.

      |Attribute|Type|
      |---|---|
      |displayName|String|
      |externalId|String|
      |members|Reference|

12. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

13. To enable the Microsoft Entra provisioning service for Atlassian Cloud, change the **Provisioning Status** to **On** in the **Settings** section.

	![Provisioning Status Toggled On](common/provisioning-toggle-on.png)

14. Define the users and/or groups that you would like to provision to Atlassian Cloud by choosing the desired values in **Scope** in the **Settings** section.

	![Provisioning Scope](common/provisioning-scope.png)

15. When you are ready to provision, click **Save**.

	![Saving Provisioning Configuration](common/provisioning-configuration-save.png)

This operation starts the initial synchronization of all users and/or groups defined in **Scope** in the **Settings** section. The initial sync takes longer to perform than subsequent syncs, which occur approximately every 40 minutes as long as the Microsoft Entra provisioning service is running.

## Step 6: Monitor your deployment
Once you've configured provisioning, use the following resources to monitor your deployment:

1. Use the [provisioning logs](../reports-monitoring/concept-provisioning-logs.md) to determine which users have been provisioned successfully or unsuccessfully
2. Check the [progress bar](../app-provisioning/application-provisioning-when-will-provisioning-finish-specific-user.md) to see the status of the provisioning cycle and how close it is to completion
3. If the provisioning configuration seems to be in an unhealthy state, the application will go into quarantine. Learn more about quarantine states [here](../app-provisioning/application-provisioning-quarantine-status.md).  

## Connector Limitations

* Atlassian Cloud only supports provisioning updates for users with verified domains. Changes made to users from a non-verified domain will not be pushed to Atlassian Cloud. Learn more about Atlassian verified domains [here](https://support.atlassian.com/provisioning-users/docs/understand-user-provisioning/).
* Atlassian Cloud does not support group renames today. This means that any changes to the displayName of a group in Microsoft Entra ID will not be updated and reflected in Atlassian Cloud.
* The value of the **mail** user attribute in Microsoft Entra ID is only populated if the user has a Microsoft Exchange Mailbox. If the user does not have one, it is recommended to map a different desired attribute to the **emails** attribute in Atlassian Cloud.


## Change log

* 06/15/2020 - Added support for batch PATCH for groups.
* 04/21/2021 - Added support for **Schema Discovery**.
* 10/14/2022 - Updated Connector Limitations.

## Additional resources

* [Managing user account provisioning for Enterprise Apps](../app-provisioning/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md)

<!--Image references-->
[1]: ./media/atlassian-cloud-provisioning-tutorial/tutorial-general-01.png
[2]: ./media/atlassian-cloud-provisioning-tutorial/tutorial-general-02.png
[3]: ./media/atlassian-cloud-provisioning-tutorial/tutorial-general-03.png
