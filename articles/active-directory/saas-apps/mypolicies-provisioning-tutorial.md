---
title: 'Tutorial: Configure myPolicies for automatic user provisioning with Microsoft Entra ID'
description: Learn how to configure Microsoft Entra ID to automatically provision and de-provision user accounts to myPolicies.
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

# Tutorial: Configure myPolicies for automatic user provisioning

The objective of this tutorial is to demonstrate the steps to be performed in myPolicies and Microsoft Entra ID to configure Microsoft Entra ID to automatically provision and de-provision users and/or groups to myPolicies.

> [!NOTE]
> This tutorial describes a connector built on top of the Microsoft Entra user Provisioning Service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Microsoft Entra ID](../app-provisioning/user-provisioning.md).
>

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* A Microsoft Entra tenant.
* [A myPolicies tenant](https://mypolicies.com/).
* A user account in myPolicies with Admin permissions.

## Assigning users to myPolicies

Microsoft Entra ID uses a concept called *assignments* to determine which users should receive access to selected apps. In the context of automatic user provisioning, only the users and/or groups that have been assigned to an application in Microsoft Entra ID are synchronized.

Before configuring and enabling automatic user provisioning, you should decide which users and/or groups in Microsoft Entra ID need access to myPolicies. Once decided, you can assign these users and/or groups to myPolicies by following the instructions here:
* [Assign a user or group to an enterprise app](../manage-apps/assign-user-or-group-access-portal.md)

## Important tips for assigning users to myPolicies

* It is recommended that a single Microsoft Entra user is assigned to myPolicies to test the automatic user provisioning configuration. Additional users and/or groups may be assigned later.

* When assigning a user to myPolicies, you must select any valid application-specific role (if available) in the assignment dialog. Users with the **Default Access** role are excluded from provisioning.

## Setup myPolicies for provisioning

Before configuring myPolicies for automatic user provisioning with Microsoft Entra ID, you will need to enable SCIM provisioning on myPolicies.

1. Reach out to your myPolicies representative at **support@mypolicies.com** to obtain the secret token needed to configure SCIM provisioning.

2.  Save the token value provided by the myPolicies representative. This value will be entered in the **Secret Token** field in the Provisioning tab of your myPolicies application.

## Add myPolicies from the gallery

To configure myPolicies for automatic user provisioning with Microsoft Entra ID, you need to add myPolicies from the Microsoft Entra application gallery to your list of managed SaaS applications.

**To add myPolicies from the Microsoft Entra application gallery, perform the following steps:**

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the **Add from the gallery** section, type **myPolicies**, select **myPolicies** in the search box.
1. Select **myPolicies** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.
	![myPolicies in the results list](common/search-new-app.png)

## Configuring automatic user provisioning to myPolicies 

This section guides you through the steps to configure the Microsoft Entra provisioning service to create, update, and disable users and/or groups in myPolicies based on user and/or group assignments in Microsoft Entra ID.

> [!TIP]
> You may also choose to enable SAML-based single sign-on for myPolicies, following the instructions provided in the [myPolicies Single sign-on tutorial](mypolicies-tutorial.md). Single sign-on can be configured independently of automatic user provisioning, though these two features compliment each other.

<a name='to-configure-automatic-user-provisioning-for-mypolicies-in-azure-ad'></a>

### To configure automatic user provisioning for myPolicies in Microsoft Entra ID:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications**

	![Enterprise applications blade](common/enterprise-applications.png)

1. In the applications list, select **myPolicies**.

	![The myPolicies link in the Applications list](common/all-applications.png)

3. Select the **Provisioning** tab.

	![Screenshot of the Manage options with the Provisioning option called out.](common/provisioning.png)

4. Set the **Provisioning Mode** to **Automatic**.

	![Screenshot of the Provisioning Mode dropdown list with the Automatic option called out.](common/provisioning-automatic.png)

5. Under the **Admin Credentials** section, input `https://<myPoliciesCustomDomain>.mypolicies.com/scim` in **Tenant URL** where `<myPoliciesCustomDomain>` is your myPolicies custom domain. You can retrieve your myPolicies customer domain, from your URL.
Example: `<demo0-qa>`.mypolicies.com.

6. In **Secret Token**, enter the token value which was retrieved earlier. Click **Test Connection** to ensure Microsoft Entra ID can connect to myPolicies. If the connection fails, ensure your myPolicies account has Admin permissions and try again.

	![Tenant URL + Token](common/provisioning-testconnection-tenanturltoken.png)

7. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and check the checkbox - **Send an email notification when a failure occurs**.

	![Notification Email](common/provisioning-notification-email.png)

8. Click **Save**.

9. Under the **Mappings** section, select **Synchronize Microsoft Entra users to myPolicies**.

	:::image type="content" source="media/mypolicies-provisioning-tutorial/usermapping.png" alt-text="Screenshot of the Mappings section. Under Name, Synchronize Microsoft Entra users to customappsso is visible." border="false":::

10. Review the user attributes that are synchronized from Microsoft Entra ID to myPolicies in the **Attribute Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in myPolicies for update operations. Select the **Save** button to commit any changes.

   |Attribute|Type|
   |---|---|
   |userName|String|
   |active|Boolean|
   |emails[type eq "work"].value|String|
   |name.givenName|String|
   |name.familyName|String|
   |name.formatted|String|
   |externalId|String|
   |addresses[type eq "work"].country|String|
   |urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:manager|Reference|


11. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

12. To enable the Microsoft Entra provisioning service for myPolicies, change the **Provisioning Status** to **On** in the **Settings** section.

	![Provisioning Status Toggled On](common/provisioning-toggle-on.png)

13. Define the users and/or groups that you would like to provision to myPolicies by choosing the desired values in **Scope** in the **Settings** section.

	![Provisioning Scope](common/provisioning-scope.png)

14. When you are ready to provision, click **Save**.

	![Saving Provisioning Configuration](common/provisioning-configuration-save.png)

This operation starts the initial synchronization of all users and/or groups defined in **Scope** in the **Settings** section. The initial sync takes longer to perform than subsequent syncs, which occur approximately every 40 minutes as long as the Microsoft Entra provisioning service is running. You can use the **Synchronization Details** section to monitor progress and follow links to provisioning activity report, which describes all actions performed by the Microsoft Entra provisioning service on myPolicies.

For more information on how to read the Microsoft Entra provisioning logs, see [Reporting on automatic user account provisioning](../app-provisioning/check-status-user-account-provisioning.md).

## Connector limitations

* myPolicies always requires **userName**, **email** and **externalId**.
* myPolicies does not support hard deletes for user attributes.

## Change log

* 09/15/2020 - Added support for "country" attribute for Users.

## Additional resources

* [Managing user account provisioning for Enterprise Apps](../app-provisioning/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md)
