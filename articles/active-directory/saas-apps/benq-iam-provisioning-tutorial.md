---
title: 'Tutorial: Configure BenQ IAM for automatic user provisioning with Microsoft Entra ID'
description: Learn how to automatically provision and de-provision user accounts from Microsoft Entra ID to BenQ IAM.
services: active-directory
author: twimmers
writer: twimmers
manager: jeedes
ms.assetid: 8c21c81c-f9dc-4818-b2fe-7a06b205af8d
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 11/21/2022
ms.author: thwimmer
---

# Tutorial: Configure BenQ IAM for automatic user provisioning

This tutorial describes the steps you need to perform in both BenQ IAM and Microsoft Entra ID to configure automatic user provisioning. When configured, Microsoft Entra ID automatically provisions and de-provisions users and groups to [BenQ IAM](https://service-portal.benq.com/login) using the Microsoft Entra provisioning service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Microsoft Entra ID](../app-provisioning/user-provisioning.md). 


## Supported capabilities
> [!div class="checklist"]
> * Create users in BenQ IAM
> * Remove users in BenQ IAM when they do not require access anymore
> * Keep user attributes synchronized between Microsoft Entra ID and BenQ IAM
> * [Single sign-on](benq-iam-tutorial.md) to BenQ IAM (recommended)

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* [A Microsoft Entra tenant](../develop/quickstart-create-new-tenant.md) 
* A user account in Microsoft Entra ID with [permission](../roles/permissions-reference.md) to configure provisioning (e.g. Application Administrator, Cloud Application administrator, Application Owner, or Global Administrator).
* An administrator account with BenQ IAM. You can register for a BenQ admin account at [BenQ IAM](https://service-portaltest.benq.com/login).


## Step 1: Plan your provisioning deployment
1. Learn about [how the provisioning service works](../app-provisioning/user-provisioning.md).
2. Determine who will be in [scope for provisioning](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).
3. Determine what data to [map between Microsoft Entra ID and BenQ IAM](../app-provisioning/customize-application-attributes.md).

<a name='step-2-configure-benq-iam-to-support-provisioning-with-azure-ad'></a>

## Step 2: Configure BenQ IAM to support provisioning with Microsoft Entra ID

1. Sign in to the [BenQ IAM](https://service-portaltest.benq.com/login) with BenQ administrator account, click on **SSO Setting** in the Account Management section.
	![SSO Setting](media/benq-iam-provisioning-tutorial/sso-setting.png)

2. Select **SSO by SAML** as SSO Setting in the pop up and click Next. 
	![sso-with-saml](media/benq-iam-provisioning-tutorial/sso-by-saml.png)

3. Follow [the tutorial for Microsoft Entra SSO integration with BenQ IAM](benq-iam-tutorial.md) to complete the required settings.

4. After finishing the settings for SSO by SAML, you will see a success message as shown in the image below. Click on **Create Token** in the Automated User Provisioning section.
	![created-token](media/benq-iam-provisioning-tutorial/create-token.png)

5. Copy the token to a safe place. This token will be used in Azure portal in **Step 5**.
	![copying-token](media/benq-iam-provisioning-tutorial/copy-token.png)

<a name='step-3-add-benq-iam-from-the-azure-ad-application-gallery'></a>

## Step 3: Add BenQ IAM from the Microsoft Entra application gallery

Add BenQ IAM from the Microsoft Entra application gallery to start managing provisioning to BenQ IAM. If you have previously setup BenQ IAM for SSO you can use the same application. However it is recommended that you create a separate app when testing out the integration initially. Learn more about adding an application from the gallery [here](../manage-apps/add-application-portal.md). 

## Step 4: Define who will be in scope for provisioning 

The Microsoft Entra provisioning service allows you to scope who will be provisioned based on assignment to the application and or based on attributes of the user / group. If you choose to scope who will be provisioned to your app based on assignment, you can use the following [steps](../manage-apps/assign-user-or-group-access-portal.md) to assign users and groups to the application. If you choose to scope who will be provisioned based solely on attributes of the user or group, you can use a scoping filter as described [here](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md). 

* Start small. Test with a small set of users and groups before rolling out to everyone. When scope for provisioning is set to assigned users and groups, you can control this by assigning one or two users or groups to the app. When scope is set to all users and groups, you can specify an [attribute based scoping filter](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

* If you need additional roles, you can [update the application manifest](../develop/howto-add-app-roles-in-azure-ad-apps.md) to add new roles.


## Step 5: Configure automatic user provisioning to BenQ IAM 

This section guides you through the steps to configure the Microsoft Entra provisioning service to create, update, and disable users and/or groups in TestApp based on user and/or group assignments in Microsoft Entra ID.

<a name='to-configure-automatic-user-provisioning-for-benq-iam-in-azure-ad'></a>

### To configure automatic user provisioning for BenQ IAM in Microsoft Entra ID:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications**

	![Enterprise applications blade](common/enterprise-applications.png)

1. In the applications list, select **BenQ IAM**.

	![The BenQ IAM link in the Applications list](common/all-applications.png)

3. Select the **Provisioning** tab.

	![Provision tab](common/provisioning.png)

4. Set the **Provisioning Mode** to **Automatic**.

	![Provisioning tab](common/provisioning-automatic.png)

5. Under the **Admin Credentials** section, input your BenQ IAM Tenant URL and Secret Token. Click **Test Connection** to ensure Microsoft Entra ID can connect to BenQ IAM. If the connection fails, ensure your BenQ IAM account has Admin permissions and try again.

 	![Token](common/provisioning-testconnection-tenanturltoken.png)

6. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and select the **Send an email notification when a failure occurs** check box.

	![Notification Email](common/provisioning-notification-email.png)

7. Select **Save**.

8. Under the **Mappings** section, select **Synchronize Microsoft Entra users to BenQ IAM**.

9. Review the user attributes that are synchronized from Microsoft Entra ID to BenQ IAM in the **Attribute-Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in BenQ IAM for update operations. If you choose to change the [matching target attribute](../app-provisioning/customize-application-attributes.md), you will need to ensure that the BenQ IAM API supports filtering users based on that attribute. Select the **Save** button to commit any changes.

   |Attribute|Type|Supported for filtering|
   |---|---|---|
   |userName|String|&check;
   |externalId|String|
   |active|Boolean|
   |displayName|String|

10. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

11. To enable the Microsoft Entra provisioning service for BenQ IAM, change the **Provisioning Status** to **On** in the **Settings** section.

	![Provisioning Status Toggled On](common/provisioning-toggle-on.png)

12. Define the users and/or groups that you would like to provision to BenQ IAM by choosing the desired values in **Scope** in the **Settings** section.

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
