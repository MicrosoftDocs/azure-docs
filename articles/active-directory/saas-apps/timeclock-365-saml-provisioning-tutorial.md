---
title: 'Tutorial: Configure TimeClock 365 SAML for automatic user provisioning with Microsoft Entra ID'
description: Learn how to automatically provision and de-provision user accounts from Microsoft Entra ID to TimeClock 365 SAML.
services: active-directory
author: twimmers
writer: twimmers
manager: jeedes
ms.assetid: 7f87db7f-ee99-4798-bca9-e281508e6b76
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 11/21/2022
ms.author: thwimmer
---

# Tutorial: Configure TimeClock 365 SAML for automatic user provisioning

This tutorial describes the steps you need to perform in both TimeClock 365 SAML and Microsoft Entra ID to configure automatic user provisioning. When configured, Microsoft Entra ID automatically provisions and de-provisions users and groups to [TimeClock 365 SAML](https://timeclock365.com/) using the Microsoft Entra provisioning service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Microsoft Entra ID](../app-provisioning/user-provisioning.md). 


## Capabilities Supported
> [!div class="checklist"]
> * Create users in TimeClock 365 SAML
> * Remove users in TimeClock 365 SAML when they do not require access anymore
> * Keep user attributes synchronized between Microsoft Entra ID and TimeClock 365 SAML
> * [Single sign-on](timeclock-365-saml-tutorial.md) to TimeClock 365 SAML (recommended).

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* [A Microsoft Entra tenant](../develop/quickstart-create-new-tenant.md) 
* A user account in Microsoft Entra ID with [permission](../roles/permissions-reference.md) to configure provisioning (for example, Application Administrator, Cloud Application administrator, Application Owner, or Global Administrator). 
* A [TimeClock 365 SAML](https://timeclock365.com/) tenant.
* A user account in TimeClock 365 SAML with Admin permissions.

## Step 1: Plan your provisioning deployment
1. Learn about [how the provisioning service works](../app-provisioning/user-provisioning.md).
1. Determine who will be in [scope for provisioning](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).
1. Determine what data to [map between Microsoft Entra ID and TimeClock 365 SAML](../app-provisioning/customize-application-attributes.md). 

<a name='step-2-configure-timeclock-365-saml-to-support-provisioning-with-azure-ad'></a>

## Step 2: Configure TimeClock 365 SAML to support provisioning with Microsoft Entra ID

1. Login to [Timeclock365 admin console](https://live.timeclock365.com).

1. Navigate to **Settings > Company profile > General**.

	[![Generate Token Page](media/timeclock-365-saml-provisioning-tutorial/generate-token-page.png)](media/timeclock-365-saml-provisioning-tutorial/generate-token-page.png#lightbox)

1. Scroll down to **Azure user synchronization**.Copy and save the **Microsoft Entra token**. This value will be entered in the **Secret Token** * field in the Provisioning tab of your TimeClock 365 SAML application. 

	[![Generate Token](media/timeclock-365-saml-provisioning-tutorial/generate-token.png)](media/timeclock-365-saml-provisioning-tutorial/generate-token.png#lightbox)

1. `https://live.timeclock365.com/scim` will be entered in the **Tenant URL** field in the Provisioning tab of your TimeClock 365 SAML application.

<a name='step-3-add-timeclock-365-saml-from-the-azure-ad-application-gallery'></a>

## Step 3: Add TimeClock 365 SAML from the Microsoft Entra application gallery

Add TimeClock 365 SAML from the Microsoft Entra application gallery to start managing provisioning to TimeClock 365 SAML. If you have previously setup TimeClock 365 SAML for SSO you can use the same application. However it is recommended that you create a separate app when testing out the integration initially. Learn more about adding an application from the gallery [here](../manage-apps/add-application-portal.md). 

## Step 4: Define who will be in scope for provisioning 

The Microsoft Entra provisioning service allows you to scope who will be provisioned based on assignment to the application and or based on attributes of the user / group. If you choose to scope who will be provisioned to your app based on assignment, you can use the following [steps](../manage-apps/assign-user-or-group-access-portal.md) to assign users and groups to the application. If you choose to scope who will be provisioned based solely on attributes of the user or group, you can use a scoping filter as described [here](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md). 

* Start small. Test with a small set of users and groups before rolling out to everyone. When scope for provisioning is set to assigned users and groups, you can control this by assigning one or two users or groups to the app. When scope is set to all users and groups, you can specify an [attribute based scoping filter](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

* If you need additional roles, you can [update the application manifest](../develop/howto-add-app-roles-in-azure-ad-apps.md) to add new roles.


## Step 5: Configure automatic user provisioning to TimeClock 365 SAML 

This section guides you through the steps to configure the Microsoft Entra provisioning service to create, update, and disable users and/or groups in TimeClock 365 SAML based on user and/or group assignments in Microsoft Entra ID.

<a name='to-configure-automatic-user-provisioning-for-timeclock-365-saml-in-azure-ad'></a>

### To configure automatic user provisioning for TimeClock 365 SAML in Microsoft Entra ID:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications**

	![Enterprise applications blade](common/enterprise-applications.png)

1. In the applications list, select **TimeClock 365 SAML**.

	![The TimeClock 365 SAML link in the Applications list](common/all-applications.png)

1. Select the **Provisioning** tab.

	![Provisioning tab](common/provisioning.png)

1. Set the **Provisioning Mode** to **Automatic**.

	![Provisioning tab automatic](common/provisioning-automatic.png)

1. In the **Admin Credentials** section, input your TimeClock 365 **Tenant URL** and **Secret Token**. Click **Test Connection** to ensure Microsoft Entra ID can connect to TimeClock 365. If the connection fails , ensure your TimeClock 365 account has Admin permissions and try again.

	![Token](common/provisioning-testconnection-tenanturltoken.png)

1. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and select the **Send an email notification when a failure occurs** check box.

	![Notification Email](common/provisioning-notification-email.png)

1. Select **Save**.

1. In the **Mappings** section, select **Synchronize Microsoft Entra users to TimeClock 365 SAML**.

1. Review the user attributes that are synchronized from Microsoft Entra ID to TimeClock 365 SAML in the **Attribute-Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in TimeClock 365 SAML for update operations. If you choose to change the [matching target attribute](../app-provisioning/customize-application-attributes.md), you will need to ensure that the TimeClock 365 SAML API supports filtering users based on that attribute. Select the **Save** button to commit any changes.

   |Attribute|Type|Supported for filtering|
   |---|---|---|
   |userName|String|&check;
   |active|Boolean|
   |displayName|String|   
   |emails[type eq "work"].value|String|
   |externalId|String|
   |urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:employeeNumber|String|
   |urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:manager|String|
   
1. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

1. To enable the Microsoft Entra provisioning service for TimeClock 365 SAML, change the **Provisioning Status** to **On** in the **Settings** section.

	![Provisioning Status Toggled On](common/provisioning-toggle-on.png)

1. Define the users and/or groups that you would like to provision to TimeClock 365 SAML by choosing the desired values in **Scope** in the **Settings** section.

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
