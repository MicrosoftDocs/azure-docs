---
title: 'Tutorial: Configure Blinq for automatic user provisioning with Microsoft Entra ID'
description: Learn how to automatically provision and de-provision user accounts from Microsoft Entra ID to Blinq.
services: active-directory
author: twimmers
writer: twimmers
manager: jeedes
ms.assetid: 5b076ac0-cd0e-43c3-85ed-8591bfd424ff
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 11/21/2022
ms.author: thwimmer
---

# Tutorial: Configure Blinq for automatic user provisioning

This tutorial describes the steps you need to do in both Blinq and Microsoft Entra ID to configure automatic user provisioning. When configured, Microsoft Entra ID automatically provisions and de-provisions users and groups to [Blinq](https://blinq.me/) using the Microsoft Entra provisioning service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Microsoft Entra ID](../app-provisioning/user-provisioning.md). 


## Capabilities supported
> [!div class="checklist"]
> * Create users in Blinq.
> * Remove users in Blinq when they do not require access anymore.
> * Keep user attributes synchronized between Microsoft Entra ID and Blinq.

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* [A Microsoft Entra tenant](../develop/quickstart-create-new-tenant.md) 
* A user account in Microsoft Entra ID with [permission](../roles/permissions-reference.md) to configure provisioning (for example, Application Administrator, Cloud Application administrator, Application Owner, or Global Administrator).
* A user account in Blinq with Admin permission

## Step 1: Plan your provisioning deployment
1. Learn about [how the provisioning service works](../app-provisioning/user-provisioning.md).
1. Determine who will be in [scope for provisioning](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).
1. Determine what data to [map between Microsoft Entra ID and Blinq](../app-provisioning/customize-application-attributes.md). 

<a name='step-2-configure-blinq-to-support-provisioning-with-azure-ad'></a>

## Step 2: Configure Blinq to support provisioning with Microsoft Entra ID

1. Navigate to [Blinq Admin Console](https://dash.blinq.me) in a separate browser tab.
1. If you aren't logged in to Blinq you will need to do so.
1. Click on your workspace in the top left hand corner of the screen and select **Settings** in the dropdown menu.

   	[![Screenshot of the Blinq settings option.](media/blinq-provisioning-tutorial/blinq-settings.png)](media/blinq-provisioning-tutorial/blinq-settings.png#lightbox)

1. Under the **Integrations** page you should see **Team Card Provisioning** which contains a URL and Token. You will need to generate the token by clicking **Generate**.
Copy the **URL** and **Token**. The URL and the Token are to be inserted into the **Tenant URL** and **Secret Token** field in the Azure portal respectively.

   	[![Screenshot of the Blinq integration page.](media/blinq-provisioning-tutorial/blinq-integrations-page.png)](media/blinq-provisioning-tutorial/blinq-integrations-page.png#lightbox)

<a name='step-3-add-blinq-from-the-azure-ad-application-gallery'></a>

## Step 3: Add Blinq from the Microsoft Entra application gallery

Add Blinq from the Microsoft Entra application gallery to start managing provisioning to Blinq. If you have previously setup Blinq for SSO, you can use the same application. However it's recommended you create a separate app when testing out the integration initially. Learn more about adding an application from the gallery [here](../manage-apps/add-application-portal.md). 

## Step 4: Define who will be in scope for provisioning 

The Microsoft Entra provisioning service allows you to scope who will be provisioned based on assignment to the application and or based on attributes of the user and group. If you choose to scope who will be provisioned to your app based on assignment, you can use the following [steps](../manage-apps/assign-user-or-group-access-portal.md) to assign users and groups to the application. If you choose to scope who will be provisioned based solely on attributes of the user or group, you can use a scoping filter as described [here](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md). 

* Start small. Test with a small set of users and groups before rolling out to everyone. When scope for provisioning is set to assigned users and groups, you can control this by assigning one or two users or groups to the app. When scope is set to all users and groups, you can specify an [attribute based scoping filter](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

* If you need additional roles, you can [update the application manifest](../develop/howto-add-app-roles-in-azure-ad-apps.md) to add new roles.


## Step 5: Configure automatic user provisioning to Blinq 

This section guides you through the steps to configure the Microsoft Entra provisioning service to create, update, and disable users and groups in Blinq based on user and group assignments in Microsoft Entra ID.

<a name='to-configure-automatic-user-provisioning-for-blinq-in-azure-ad'></a>

### To configure automatic user provisioning for Blinq in Microsoft Entra ID:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications**

	![Screenshot of Enterprise applications blade.](common/enterprise-applications.png)

1. In the applications list, select **Blinq**.

	![Screenshot of the Blinq link in the Applications list.](common/all-applications.png)

1. Select the **Provisioning** tab.

	![Screenshot of Provisioning tab.](common/provisioning.png)

1. Set the **Provisioning Mode** to **Automatic**.

	![Screenshot of Provisioning tab automatic.](common/provisioning-automatic.png)

1. In the **Admin Credentials** section, input your Blinq Tenant URL and Secret Token. Click **Test Connection** to ensure Microsoft Entra ID can connect to Blinq. If the connection fails, ensure your Blinq account has Admin permissions and try again.

	![Screenshot of Token field.](common/provisioning-testconnection-tenanturltoken.png)

1. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and select the **Send an email notification when a failure occurs** check box.

	![Screenshot of Notification Email.](common/provisioning-notification-email.png)

1. Select **Save**.

1. In the **Mappings** section, select **Synchronize Microsoft Entra users to Blinq**.

1. Review the user attributes that are synchronized from Microsoft Entra ID to Blinq in the **Attribute-Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in Blinq for update operations. If you choose to change the [matching target attribute](../app-provisioning/customize-application-attributes.md), you'll need to ensure that the Blinq API supports filtering users based on that attribute. Select the **Save** button to commit any changes.

   |Attribute|Type|Supported for filtering|Required by Blinq|
   |---|---|---|---|
   |userName|String|&check;|&check;
   |active|Boolean||
   |displayName|String||
   |nickName|String||
   |title|String||
   |preferredLanguage|String||
   |locale|String||
   |timezone|String||
   |name.givenName|String||
   |name.familyName|String||
   |name.formatted|String||
   |name.middleName|String||
   |name.honorificPrefix|String||
   |name.honorificSuffix|String||
   |externalId|String||
   |emails[type eq "work"].value|String||
   |emails[type eq "home"].value|String||
   |emails[type eq "other"].value|String||
   |phoneNumbers[type eq "work"].value|String||
   |phoneNumbers[type eq "mobile"].value|String||
   |phoneNumbers[type eq "fax"].value|String||
   |phoneNumbers[type eq "home"].value|String||
   |phoneNumbers[type eq "other"].value|String||
   |phoneNumbers[type eq "pager"].value|String||
   |addresses[type eq "work"].formatted|String||
   |addresses[type eq "work"].streetAddress|String||
   |addresses[type eq "work"].locality|String||
   |addresses[type eq "work"].region|String||
   |addresses[type eq "work"].postalCode|String||
   |addresses[type eq "work"].country|String||
   |addresses[type eq "home"].formatted|String||
   |addresses[type eq "home"].streetAddress|String||
   |addresses[type eq "home"].locality|String||
   |addresses[type eq "home"].region|String||
   |addresses[type eq "home"].postalCode|String||
   |addresses[type eq "home"].country|String||
   |addresses[type eq "other"].formatted|String||
   |addresses[type eq "other"].streetAddress|String||
   |addresses[type eq "other"].locality|String||
   |addresses[type eq "other"].region|String||
   |addresses[type eq "other"].postalCode|String||
   |addresses[type eq "other"].country|String||
   |urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:employeeNumber|String||
   |urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:organization|String||
   |urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:division|String||
   |urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:department|String||


1. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

1. To enable the Microsoft Entra provisioning service for Blinq, change the **Provisioning Status** to **On** in the **Settings** section.

	![Screenshot of Provisioning Status Toggled On.](common/provisioning-toggle-on.png)

1. Define the users and groups that you would like to provision to Blinq by choosing the desired values in **Scope** in the **Settings** section.

	![Screenshot of Provisioning Scope.](common/provisioning-scope.png)

1. When you're ready to provision, click **Save**.

	![Screenshot of Saving Provisioning Configuration.](common/provisioning-configuration-save.png)

This operation starts the initial synchronization cycle of all users and groups defined in **Scope** in the **Settings** section. The initial cycle takes longer to complete than next cycles, which occur approximately every 40 minutes as long as the Microsoft Entra provisioning service is running. 

## Step 6: Monitor your deployment
Once you've configured provisioning, use the following resources to monitor your deployment:

* Use the [provisioning logs](../reports-monitoring/concept-provisioning-logs.md) to determine which users have been provisioned successfully or unsuccessfully
* Check the [progress bar](../app-provisioning/application-provisioning-when-will-provisioning-finish-specific-user.md) to see the status of the provisioning cycle and how close it's to completion
* If the provisioning configuration seems to be in an unhealthy state, the application will go into quarantine. Learn more about quarantine states [here](../app-provisioning/application-provisioning-quarantine-status.md).  

## Change Logs
* 05/25/2022 - **Schema Discovery** feature enabled on this app.
* 12/22/2022 - The source attribute of **addresses[type eq "work"].formatted** ha been changed to **Join("", [streetAddress], IIF(IsPresent([city]),", ",""), [city], IIF(IsPresent([state]),", ",""), [state], IIF(IsPresent([postalCode])," ",""), [postalCode]) --> addresses[type eq "work"].formatted**.

## More resources

* [Managing user account provisioning for Enterprise Apps](../app-provisioning/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md)
