---
title: 'Tutorial: Configure Cloud Academy - SSO for automatic user provisioning with Microsoft Entra ID'
description: Learn how to automatically provision and de-provision user accounts from Microsoft Entra ID to Cloud Academy - SSO.
services: active-directory
documentationcenter: ''
author: twimmers
writer: twimmers
manager: jeedes

ms.assetid: 224777cb-fc03-4e4a-8c8d-5befe1174233
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: tutorial
ms.date: 11/21/2022
ms.author: thwimmer
---

# Tutorial: Configure Cloud Academy - SSO for automatic user provisioning

This tutorial describes the steps you need to perform in both Cloud Academy - SSO and Microsoft Entra ID to configure automatic user provisioning. When configured, Microsoft Entra ID automatically provisions and de-provisions users and groups to [Cloud Academy - SSO](https://cloudacademy.com) using the Microsoft Entra provisioning service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Microsoft Entra ID](../app-provisioning/user-provisioning.md). 


## Capabilities Supported
> [!div class="checklist"]
> * Create users in Cloud Academy - SSO
> * Remove users in Cloud Academy - SSO when they do not require access anymore
> * Keep user attributes synchronized between Microsoft Entra ID and Cloud Academy - SSO
> * [Single sign-on](./cloud-academy-sso-tutorial.md) to Cloud Academy - SSO (recommended)

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* [A Microsoft Entra tenant](../develop/quickstart-create-new-tenant.md) 
* A user account in Microsoft Entra ID with [permission](../roles/permissions-reference.md) to configure provisioning (for example, Application Administrator, Cloud Application administrator, Application Owner, or Global Administrator). 
* A user account in Cloud Academy with an Administrator role in your company to activate the AD Integration and generate the API Key.

## Step 1: Plan your provisioning deployment
1. Learn about [how the provisioning service works](../app-provisioning/user-provisioning.md).
2. Determine who will be in [scope for provisioning](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).
3. Determine what data to [map between Microsoft Entra ID and Cloud Academy - SSO](../app-provisioning/customize-application-attributes.md). 

<a name='step-2-configure-cloud-academy---sso-to-support-provisioning-with-azure-ad'></a>

## Step 2: Configure Cloud Academy - SSO to support provisioning with Microsoft Entra ID

1. Login to [Sigma Computing](https://cloudacademy.com/) admin portal.

2. Click on **Dashboard** on the home page next to the profile icon.

	![Home](media/cloud-academy-sso-provisioning-tutorial/dashboard.png)

3. Navigate to **your profile** > **Settings & Integrations**.

	![Integrations](media/cloud-academy-sso-provisioning-tutorial/settings.png)

4. Click on **Integrations** tab and click on **View Integration** in Microsoft Entra ID.

	![Directory](media/cloud-academy-sso-provisioning-tutorial/active.png)

5. Click on **Generate a new API Key**.

	![Generate](media/cloud-academy-sso-provisioning-tutorial/key.png)

6. Copy the full API Key. This value will be entered in the **Secret Token** field in the Provisioning tab of your Cloud Academy - SSO application.

   >[!Note]
   >You can generate a new API Key as required. The old API Key will be marked as expired in the next **8 hours** to allow the time needed to update the configuration in the AD Portal.

7. The Tenant URL is `https://cloudacademy.com/webhooks/ad/v1/scim` or `https://app.qa.com/webhooks/ad/v1/scim` based on where your company is registered. This value will be entered in the **Tenant URL** field in the Provisioning tab of your Cloud Academy - SSO application.

<a name='step-3-add-cloud-academy---sso-from-the-azure-ad-application-gallery'></a>

## Step 3: Add Cloud Academy - SSO from the Microsoft Entra application gallery

Add Cloud Academy - SSO from the Microsoft Entra application gallery to start managing provisioning to Cloud Academy - SSO. If you have previously setup Cloud Academy - SSO for SSO, you can use the same application. However it is recommended that you create a separate app when testing out the integration initially. Learn more about adding an application from the gallery [here](../manage-apps/add-application-portal.md). 

## Step 4: Define who will be in scope for provisioning 

The Microsoft Entra provisioning service allows you to scope who will be provisioned based on assignment to the application and or based on attributes of the user / group. If you choose to scope who will be provisioned to your app based on assignment, you can use the following [steps](../manage-apps/assign-user-or-group-access-portal.md) to assign users and groups to the application. If you choose to scope who will be provisioned based solely on attributes of the user or group, you can use a scoping filter as described [here](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md). 

* Start small. Test with a small set of users and groups before rolling out to everyone. When scope for provisioning is set to assigned users and groups, you can control this by assigning one or two users or groups to the app. When scope is set to all users and groups, you can specify an [attribute based scoping filter](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

* If you need additional roles, you can [update the application manifest](../develop/howto-add-app-roles-in-azure-ad-apps.md) to add new roles.


## Step 5: Configure automatic user provisioning to Cloud Academy - SSO 

This section guides you through the steps to configure the Microsoft Entra provisioning service to create, update, and disable users and/or groups in TestApp based on user and/or group assignments in Microsoft Entra ID.

<a name='to-configure-automatic-user-provisioning-for-cloud-academy---sso-in-azure-ad'></a>

### To configure automatic user provisioning for Cloud Academy - SSO in Microsoft Entra ID:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications**

	![Enterprise applications blade](common/enterprise-applications.png)

1. In the applications list, select **Cloud Academy - SSO**.

	![The Cloud Academy - SSO link in the Applications list](common/all-applications.png)

3. Select the **Provisioning** tab.

	![Provisioning tab](common/provisioning.png)

4. Set the **Provisioning Mode** to **Automatic**.

	![Provisioning tab automatic](common/provisioning-automatic.png)

5. Under the **Admin Credentials** section, input your Cloud Academy - SSO Tenant URL and Secret Token. Click **Test Connection** to ensure Microsoft Entra ID can connect to Cloud Academy - SSO. If the connection fails, ensure your Cloud Academy - SSO account has Admin permissions and try again.

 	![Token](common/provisioning-testconnection-tenanturltoken.png)

6. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and select the **Send an email notification when a failure occurs** check box.

	![Notification Email](common/provisioning-notification-email.png)

7. Select **Save**.

8. Under the **Mappings** section, select **Synchronize Microsoft Entra users to Cloud Academy - SSO**.

9. Review the user attributes that are synchronized from Microsoft Entra ID to Cloud Academy - SSO in the **Attribute-Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in Cloud Academy - SSO for update operations. If you choose to change the [matching target attribute](../app-provisioning/customize-application-attributes.md), you will need to ensure that the Cloud Academy - SSO API supports filtering users based on that attribute. Select the **Save** button to commit any changes.

   |Attribute|Type|Supported For Filtering|
   |---|---|---|
   |userName|String|&check;|
   |externalId|String|
   |active|Boolean|
   |name.givenName|String|
   |name.familyName|String|

10. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

11. To enable the Microsoft Entra provisioning service for Cloud Academy - SSO, change the **Provisioning Status** to **On** in the **Settings** section.

	![Provisioning Status Toggled On](common/provisioning-toggle-on.png)

12. Define the users and/or groups that you would like to provision to Cloud Academy - SSO by choosing the desired values in **Scope** in the **Settings** section.

	![Provisioning Scope](common/provisioning-scope.png)

13. When you are ready to provision, click **Save**.

	![Saving Provisioning Configuration](common/provisioning-configuration-save.png)

This operation starts the initial synchronization cycle of all users and groups defined in **Scope** in the **Settings** section. The initial cycle takes longer to perform than subsequent cycles, which occur approximately every 40 minutes as long as the Microsoft Entra provisioning service is running. 

## Step 6: Monitor your deployment
Once you've configured provisioning, use the following resources to monitor your deployment:

1. Use the [provisioning logs](../reports-monitoring/concept-provisioning-logs.md) to determine which users have been provisioned successfully or unsuccessfully
2. Check the [progress bar](../app-provisioning/application-provisioning-when-will-provisioning-finish-specific-user.md) to see the status of the provisioning cycle and how close it is to completion
3. If the provisioning configuration seems to be in an unhealthy state, the application will go into quarantine. Learn more about quarantine states [here](../app-provisioning/application-provisioning-quarantine-status.md).

## Additional resources

* [Managing user account provisioning for Enterprise Apps](../app-provisioning/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md)
