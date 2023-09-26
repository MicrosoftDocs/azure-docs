---
title: 'Tutorial: Configure UNIFI for automatic user provisioning with Microsoft Entra ID'
description: Learn how to automatically provision and de-provision user accounts from Microsoft Entra ID to UNIFI.
services: active-directory
author: twimmers
writer: twimmers
manager: jeedes
ms.assetid: 924c603f-574e-4e0a-9345-0cb0c7593dbb
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 11/21/2022
ms.author: thwimmer
---

# Tutorial: Configure UNIFI for automatic user provisioning

This tutorial describes the steps you need to perform in both UNIFI and Microsoft Entra ID to configure automatic user provisioning. When configured, Microsoft Entra ID automatically provisions and de-provisions users and groups to [UNIFI](http://www.unifilabs.com/) using the Microsoft Entra provisioning service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Microsoft Entra ID](../app-provisioning/user-provisioning.md). 


## Capabilities Supported
> [!div class="checklist"]
> * Create users in UNIFI
> * Remove users in UNIFI when they do not require access anymore
> * Keep user attributes synchronized between Microsoft Entra ID and UNIFI
> * Provision groups and group memberships in UNIFI
> * [Single sign-on](unifi-tutorial.md) to UNIFI (recommended)

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* [A Microsoft Entra tenant](../develop/quickstart-create-new-tenant.md) 
* A user account in Microsoft Entra ID with [permission](../roles/permissions-reference.md) to configure provisioning (for example, Application Administrator, Cloud Application administrator, Application Owner, or Global Administrator). 
* A [UNIFI](http://www.unifilabs.com/) tenant.
* A user account in UNIFI with Admin permissions.

## Step 1: Plan your provisioning deployment
1. Learn about [how the provisioning service works](../app-provisioning/user-provisioning.md).
1. Determine who will be in [scope for provisioning](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).
1. Determine what data to [map between Microsoft Entra ID and UNIFI](../app-provisioning/customize-application-attributes.md). 

<a name='step-2-configure-unifi-to-support-provisioning-with-azure-ad'></a>

## Step 2: Configure UNIFI to support provisioning with Microsoft Entra ID

1. Make sure SSO is enabled successfully in your Enterprise Application in Azure. 
1. Find the **Login URL** in Single sign-on. In our case it is `https://login.microsoftonline.com/<guid>/saml2`.
1. Download the Certificate (Base64) under the SAML Signing Certificate section.

	![Enterprise Application SSO View](media/unifi-provisioning-tutorial/enterprise-application-view.png)

1. If your identity provider is not added to UNIFI , then login to UNIFI Portal as a **Company Admin**. Navigate to **Users -> Configure SSO -> add provider** button.

	![Add Identity Provider View](media/unifi-provisioning-tutorial/add-identity-provider-view.png)

1. The add SSO Provider modal will be displayed.

	![Add Identity Provider Modal](media/unifi-provisioning-tutorial/add-identity-provider-modal.png)

1. Provide any unique **Name** value you desire. the **URL** will be the **Login URL** from your Microsoft Entra Enterprise Application. Provide any value for the **Token**. Place your Certificate (Base64) value in the **Certificate** field. If you want all of your users created from this point forward to use this identity provider, select the **Make this the default identity provider** checkbox.

	![Add Identity Provider Modal Populated](media/unifi-provisioning-tutorial/add-identity-provider-modal-populated.png)

1. Click SAVE Button.

<a name='step-3-add-unifi-from-the-azure-ad-application-gallery'></a>

## Step 3: Add UNIFI from the Microsoft Entra application gallery

Add UNIFI from the Microsoft Entra application gallery to start managing provisioning to UNIFI. If you have previously setup UNIFI for SSO you can use the same application. However it is recommended that you create a separate app when testing out the integration initially. Learn more about adding an application from the gallery [here](../manage-apps/add-application-portal.md). 

## Step 4: Define who will be in scope for provisioning 

The Microsoft Entra provisioning service allows you to scope who will be provisioned based on assignment to the application and or based on attributes of the user / group. If you choose to scope who will be provisioned to your app based on assignment, you can use the following [steps](../manage-apps/assign-user-or-group-access-portal.md) to assign users and groups to the application. If you choose to scope who will be provisioned based solely on attributes of the user or group, you can use a scoping filter as described [here](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md). 

* Start small. Test with a small set of users and groups before rolling out to everyone. When scope for provisioning is set to assigned users and groups, you can control this by assigning one or two users or groups to the app. When scope is set to all users and groups, you can specify an [attribute based scoping filter](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

* If you need additional roles, you can [update the application manifest](../develop/howto-add-app-roles-in-azure-ad-apps.md) to add new roles.


## Step 5: Configure automatic user provisioning to UNIFI 

This section guides you through the steps to configure the Microsoft Entra provisioning service to create, update, and disable users and/or groups in UNIFI based on user and/or group assignments in Microsoft Entra ID.

<a name='to-configure-automatic-user-provisioning-for-unifi-in-azure-ad'></a>

### To configure automatic user provisioning for UNIFI in Microsoft Entra ID:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications**

	![Enterprise applications blade](common/enterprise-applications.png)

1. In the applications list, select **UNIFI**.

	![The UNIFI link in the Applications list](common/all-applications.png)

1. Select the **Provisioning** tab.

	![Provisioning tab](common/provisioning.png)

1. Set the **Provisioning Mode** to **Automatic**.

	![Provisioning tab automatic](common/provisioning-automatic.png)

1. In the **Admin Credentials** section, input your UNIFI **Tenant URL** -`https://licensing.inviewlabs.com/api/scim/v2/` and **Secret Token**. Click **Test Connection** to ensure Microsoft Entra ID can connect to UNIFI. If the connection fails , ensure your UNIFI account has Admin permissions and try again.

	![Token](common/provisioning-testconnection-tenanturltoken.png)

1. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and select the **Send an email notification when a failure occurs** check box.

	![Notification Email](common/provisioning-notification-email.png)

1. Select **Save**.

1. In the **Mappings** section, select **Synchronize Microsoft Entra users to UNIFI**.

1. Review the user attributes that are synchronized from Microsoft Entra ID to UNIFI in the **Attribute-Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in UNIFI for update operations. If you choose to change the [matching target attribute](../app-provisioning/customize-application-attributes.md), you will need to ensure that the UNIFI API supports filtering users based on that attribute. Select the **Save** button to commit any changes.

   |Attribute|Type|Supported for filtering|
   |---|---|---|
   |userName|String|&check;
   |active|Boolean|   
   |name.givenName|String|
   |name.familyName|String|
   |externalId|String|


1. Under the **Mappings** section, select **Synchronize Microsoft Entra groups to UNIFI**.

1. Review the group attributes that are synchronized from Microsoft Entra ID to UNIFI in the **Attribute-Mapping** section. The attributes selected as **Matching** properties are used to match the groups in UNIFI for update operations. Select the **Save** button to commit any changes.

      |Attribute|Type|Supported for filtering|
      |---|---|---|
      |displayName|String|&check;
      |members|Reference|
      |externalId|String|      

1. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

1. To enable the Microsoft Entra provisioning service for UNIFI, change the **Provisioning Status** to **On** in the **Settings** section.

	![Provisioning Status Toggled On](common/provisioning-toggle-on.png)

1. Define the users and/or groups that you would like to provision to UNIFI by choosing the desired values in **Scope** in the **Settings** section.

	![Provisioning Scope](common/provisioning-scope.png)

1. When you are ready to provision, click **Save**.

	![Saving Provisioning Configuration](common/provisioning-configuration-save.png)

This operation starts the initial synchronization cycle of all users and groups defined in **Scope** in the **Settings** section. The initial cycle takes longer to perform than subsequent cycles, which occur approximately every 40 minutes as long as the Microsoft Entra provisioning service is running. 

## Step 6: Monitor your deployment
Once you've configured provisioning, use the following resources to monitor your deployment:

* Use the [provisioning logs](../reports-monitoring/concept-provisioning-logs.md) to determine which users have been provisioned successfully or unsuccessfully
* Check the [progress bar](../app-provisioning/application-provisioning-when-will-provisioning-finish-specific-user.md) to see the status of the provisioning cycle and how close it is to completion
* If the provisioning configuration seems to be in an unhealthy state, the application will go into quarantine. Learn more about quarantine states [here](../app-provisioning/application-provisioning-quarantine-status.md).  

## More resources

* [Managing user account provisioning for Enterprise Apps](../app-provisioning/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md)
