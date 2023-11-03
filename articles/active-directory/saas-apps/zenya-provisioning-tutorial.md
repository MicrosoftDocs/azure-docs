---
title: 'Tutorial: Configure Zenya for automatic user provisioning with Microsoft Entra ID'
description: Learn how to configure Microsoft Entra ID to automatically provision and de-provision user accounts to Zenya.
services: active-directory
author: twimmers
writer: twimmers
manager: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 11/21/2022
ms.author: thwimmer
---

# Tutorial: Configure Zenya for automatic user provisioning

The objective of this tutorial is to demonstrate the steps to be performed in Zenya and Microsoft Entra ID to configure Microsoft Entra ID to automatically provision and de-provision users and/or groups to [Zenya](https://www.infoland.nl/). For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Microsoft Entra ID](../app-provisioning/user-provisioning.md). Before you attempt to use this tutorial, be sure that you know and meet all requirements. If you have questions, contact Infoland.

## Capabilities supported
> * Create users in Zenya
> * Remove/disable users in Zenya when they do not require access anymore
> * Keep user attributes synchronized between Microsoft Entra ID and Zenya
> * Provision groups and group memberships in Zenya
> * [Single sign-on](./zenya-tutorial.md) to Zenya (recommended)

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* [A Microsoft Entra tenant](../develop/quickstart-create-new-tenant.md).
* A user account in Microsoft Entra ID with [permission](../roles/permissions-reference.md) to configure provisioning (for example, Application Administrator, Cloud Application administrator, Application Owner, or Global Administrator).
* [A Zenya tenant](https://www.infoland.nl/).
* A user account in Zenya with admin permissions.

## Step 1: Plan your provisioning deployment
1. Learn about [how the provisioning service works](../app-provisioning/user-provisioning.md).
2. Determine who will be in [scope for provisioning](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).
3. Determine what data to [map between Microsoft Entra ID and Zenya](../app-provisioning/customize-application-attributes.md). 

<a name='step-2-configure-zenya-to-support-provisioning-with-azure-ad'></a>

## Step 2: Configure Zenya to support provisioning with Microsoft Entra ID

1. Sign in to your [Zenya Admin Console](https://www.infoland.nl/). Navigate to **Go to > Application Management**.

	![Screenshot showing the Zenya Admin Console.](media/zenya-provisioning-tutorial/admin.png)

2.	Select **External user management**.

	![Screenshot showing the Zenya Users and Groups page with the External user management link highlighted.](media/zenya-provisioning-tutorial/external.png)

3. To add a new provider, select the **plus** icon. In the new **Add provider** dialog box, provide a **Title**. You can choose to add **IP-based access restriction**. Select **OK**.

	![Screenshot showing the Zenya add new button.](media/zenya-provisioning-tutorial/add.png)

	![Screenshot showing the Zenya add provider page.](media/zenya-provisioning-tutorial/add-provider.png)

4.	Select the **Permanent token** button. Copy the **Permanent token** and save it. You won't be able to view it later. This value will be entered in the Secret Token field in the Provisioning tab of your Zenya application.

	![Screenshot showing the Zenya User provisioning page for creating a Token.](media/zenya-provisioning-tutorial/token.png)

<a name='step-3-add-zenya-from-the-azure-ad-application-gallery'></a>

## Step 3: Add Zenya from the Microsoft Entra application gallery

Add Zenya from the Microsoft Entra application gallery to start managing provisioning to Zenya. If you have previously setup Zenya for SSO, you can use the same application. However it's recommended that you create a separate app when testing out the integration initially. Learn more about adding an application from the gallery [here](../manage-apps/add-application-portal.md). 

## Step 4: Define who will be in scope for provisioning 

The Microsoft Entra provisioning service allows you to scope who will be provisioned based on assignment to the application and or based on attributes of the user / group. If you choose to scope who will be provisioned to your app based on assignment, you can use the following [steps](../manage-apps/assign-user-or-group-access-portal.md) to assign users and groups to the application. If you choose to scope who will be provisioned based solely on attributes of the user or group, you can use a scoping filter as described [here](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md). 

* Start small. Test with a small set of users and groups before rolling out to everyone. When scope for provisioning is set to assigned users and groups, maintain control by assigning one or two users or groups to the app. When scope is set to all users and groups, you can specify an [attribute based scoping filter](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

* If you need additional roles, you can [update the application manifest](../develop/howto-add-app-roles-in-azure-ad-apps.md) to add new roles.

## Step 5: Configure automatic user provisioning to Zenya 

This section guides you through the steps to configure the Microsoft Entra provisioning service to create, update, and disable users and/or groups in Zenya based on user and/or group assignments in Microsoft Entra ID.

For more information (in dutch) also read: [`Implementatie SCIM koppeling`](https://webshare.iprova.nl/8my7yg8c1ofsmdj9/Document.aspx)

<a name='to-configure-automatic-user-provisioning-for-zenya-in-azure-ad'></a>

### To configure automatic user provisioning for Zenya in Microsoft Entra ID:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications**

	![Screenshot showing the Enterprise applications blade.](common/enterprise-applications.png)

1. In the applications list, select **Zenya**.

	![Screenshot showing Zenya link in the Applications list.](media/zenya-provisioning-tutorial/browse-application.png)

1. Select the **Provisioning** tab.

	![Screenshot of the Manage options with the Provisioning option called out.](common/provisioning.png)

1. Set the **Provisioning Mode** to **Automatic**.

	![Screenshot of the Provisioning Mode dropdown list with the Automatic option called out.](common/provisioning-automatic.png)

1. In the **Admin Credentials** section, input the **SCIM 2.0 base URL and Permanent Token** values retrieved earlier in the **Tenant URL** and add /scim/ to it. Also add the  **Secret Token**. You can generate a secret token in Zenya by using the **permanent token** button. Select **Test Connection** to ensure Microsoft Entra ID can connect to Zenya. If the connection fails, ensure your Zenya account has Admin permissions and try again. 

	![Screenshot showing the Test connection page and fields for Tenant URL and Token.](common/provisioning-testconnection-tenanturltoken.png)

1. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and check the checkbox - **Send an email notification when a failure occurs**.

	![Screenshot showing the field for entering an email address for notification.](common/provisioning-notification-email.png)

1. Select **Save**.

1. Under the **Mappings** section, select **Synchronize Microsoft Entra users to Zenya**.

1. Review the user attributes that are synchronized from Microsoft Entra ID to Zenya in the **Attribute Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in Zenya for update operations. Select the **Save** button to commit any changes.

   |Attribute|Type|
   |---|---|
   |active|Boolean|
   |displayName|String|
   |emails[type eq "work"].value|String|
   |preferredLanguage|String|
   |userName|String|
   |phoneNumbers[type eq "work"].value|String|
   |externalId|String|
   |urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:department|String|
   |title|String|
   |urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:manager|String|


1. Under the **Mappings** section, select **Synchronize Microsoft Entra groups to Zenya**.

1. Review the group attributes that are synchronized from Microsoft Entra ID to Zenya in the **Attribute Mapping** section. The attributes selected as **Matching** properties are used to match the groups in Zenya for update operations. Select the **Save** button to commit any changes.

      |Attribute|Type|
      |---|---|
      |displayName|String|
      |members|Reference|
      |externalID|String|

1. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

1. To enable the Microsoft Entra provisioning service for Zenya, change the **Provisioning Status** to **On** in the **Settings** section.

	![Screenshot showing the provisioning status toggled on.](common/provisioning-toggle-on.png)

1. Define the users and/or groups that you would like to provision to Zenya by choosing the desired values in **Scope** in the **Settings** section. You'll need a P1 or P2 license in order to allow provisioning assigned users and groups. 

	![Screenshot showing where to select the provisioning scope.](common/provisioning-scope.png)

1. When you're ready to provision, select **Save**.

	![Screenshot showing the Save button to save the provisioning configuration.](common/provisioning-configuration-save.png)

This operation starts the initial synchronization of all users and/or groups defined in **Scope** in the **Settings** section. The initial sync takes longer to perform than subsequent syncs, which occur approximately every 40 minutes as long as the Microsoft Entra provisioning service is running. 


## Step 6: Monitor your deployment
Once you've configured provisioning, use the following resources to monitor your deployment:

1. Use the [provisioning logs](../reports-monitoring/concept-provisioning-logs.md) to determine which users have been provisioned successfully or unsuccessfully
2. Check the [progress bar](../app-provisioning/application-provisioning-when-will-provisioning-finish-specific-user.md) to see the status of the provisioning cycle and how close it is to completion
3. If the provisioning configuration seems to be in an unhealthy state, the application will go into quarantine. Learn more about quarantine states [here](../app-provisioning/application-provisioning-quarantine-status.md).  

## Change log

* 06/17/2020 - Enterprise extension attribute "Manager" has been removed.

## Additional resources

* [Managing user account provisioning for Enterprise Apps](../app-provisioning/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)
* [`Implementatie SCIM koppeling`](https://webshare.iprova.nl/8my7yg8c1ofsmdj9/Document.aspx)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md)
