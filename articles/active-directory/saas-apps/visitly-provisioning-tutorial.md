---
title: 'Tutorial: Configure Visitly for automatic user provisioning with Microsoft Entra ID'
description: Learn how to configure Microsoft Entra ID to automatically provision and deprovision user accounts to Visitly.
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

# Tutorial: Configure Visitly for automatic user provisioning

The objective of this tutorial is to demonstrate the steps you perform in Visitly and Microsoft Entra ID to configure Microsoft Entra ID to automatically provision and deprovision users or groups to Visitly.

> [!NOTE]
> This tutorial describes a connector built on top of the Microsoft Entra user provisioning service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to software-as-a-service (SaaS) applications with Microsoft Entra ID](../app-provisioning/user-provisioning.md).
>

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* A Microsoft Entra tenant
* [A Visitly tenant](https://www.visitly.io/pricing/)
* A user account in Visitly with admin permissions

## Assign users to Visitly 

Microsoft Entra ID uses a concept called *assignments* to determine which users should receive access to selected apps. In the context of automatic user provisioning, only the users or groups that were assigned to an application in Microsoft Entra ID are synchronized.

Before you configure and enable automatic user provisioning, decide which users or groups in Microsoft Entra ID need access to Visitly. Then assign these users or groups to Visitly by following the instructions here:
* [Assign a user or group to an enterprise app](../manage-apps/assign-user-or-group-access-portal.md)

## Important tips for assigning users to Visitly 

* We recommend that you assign a single Microsoft Entra user to Visitly to test the automatic user provisioning configuration. Additional users or groups can be assigned later.

* When you assign a user to Visitly, you must select any valid application-specific role (if available) in the assignment dialog box. Users with the Default Access role are excluded from provisioning.

## Set up Visitly for provisioning

Before you configure Visitly for automatic user provisioning with Microsoft Entra ID, you need to enable System for Cross-domain Identity Management (SCIM) provisioning on Visitly.

1. Sign in to [Visitly](https://app.visitly.io/login). Select **Integrations** > **Host Synchronization**.

	![Host Synchronization](media/Visitly-provisioning-tutorial/login.png)

2. Select the **Microsoft Entra ID** section.

	![Microsoft Entra ID section](media/Visitly-provisioning-tutorial/integration.png)

3. Copy the **API Key**. These values are entered in the **Secret Token** box on the **Provisioning** tab of your Visitly application.

	![API Key](media/Visitly-provisioning-tutorial/token.png)


## Add Visitly from the gallery

To configure Visitly for automatic user provisioning with Microsoft Entra ID, add Visitly from the Microsoft Entra application gallery to your list of managed SaaS applications.

To add Visitly from the Microsoft Entra application gallery, follow these steps.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.Visitly**, select **Visitly** in the results panel, and then select **Add** to add the application.

	![Visitly in the results list](common/search-new-app.png)

## Configure automatic user provisioning to Visitly 

This section guides you through the steps to configure the Microsoft Entra provisioning service to create, update, and disable users or groups in Visitly based on user or group assignments in Microsoft Entra ID.

> [!TIP]
> To enable SAML-based single sign-on for Visitly, follow the instructions in the [Visitly single sign-on tutorial](Visitly-tutorial.md). Single sign-on can be configured independently of automatic user provisioning, although these two features complement each other.

<a name='configure-automatic-user-provisioning-for-visitly-in-azure-ad'></a>

### Configure automatic user provisioning for Visitly in Microsoft Entra ID

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Visitly**.

	![The Visitly link in the Applications list](common/all-applications.png)

3. Select the **Provisioning** tab.

	![Provisioning tab](common/provisioning.png)

4. Set the **Provisioning Mode** to **Automatic**.

	![Provisioning Mode set to Automatic](common/provisioning-automatic.png)

5. Under the Admin Credentials section, input the `https://api.visitly.io/v1/usersync/SCIM` and **API Key** values retrieved earlier in **Tenant URL** and **Secret Token**, respectively. Select **Test Connection** to ensure that Microsoft Entra ID can connect to Visitly. If the connection fails, make sure that your Visitly account has admin permissions and try again.

	![Tenant URL + token](common/provisioning-testconnection-tenanturltoken.png)

6. In the **Notification Email** box, enter the email address of a person or group who should receive the provisioning error notifications. Select the **Send an email notification when a failure occurs** check box.

	![Notification email](common/provisioning-notification-email.png)

7. Select **Save**.

8. Under the **Mappings** section, select **Synchronize Microsoft Entra users to Visitly**.

	![Visitly user mappings](media/visitly-provisioning-tutorial/usermapping.png)

9. Review the user attributes that are synchronized from Microsoft Entra ID to Visitly in the **Attribute Mappings** section. The attributes selected as **Matching** properties are used to match the user accounts in Visitly for update operations. Select **Save** to commit any changes.

	![Visitly user attributes](media/visitly-provisioning-tutorial/userattribute.png)

10. To configure scoping filters, follow the instructions in the [Scoping filter tutorial](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

11. To enable the Microsoft Entra provisioning service for Visitly, change the **Provisioning Status** to **On** in the **Settings** section.

	![Provisioning Status toggled On](common/provisioning-toggle-on.png)

12. Define the users or groups that you want to provision to Visitly by choosing the desired values in **Scope** in the **Settings** section.

	![Provisioning Scope](common/provisioning-scope.png)

13. When you're ready to provision, select **Save**.

	![Saving provisioning configuration](common/provisioning-configuration-save.png)

This operation starts the initial synchronization of all users or groups defined in **Scope** in the **Settings** section. The initial sync takes longer to perform than subsequent syncs. For more information on how long it takes for users or groups to provision, see [How long will it take to provision users?](../app-provisioning/application-provisioning-when-will-provisioning-finish-specific-user.md#how-long-will-it-take-to-provision-users).

You can use the **Current Status** section to monitor progress and follow links to your provisioning activity report, which describes all actions performed by the Microsoft Entra provisioning service on Visitly. For more information, see [Check the status of user provisioning](../app-provisioning/application-provisioning-when-will-provisioning-finish-specific-user.md). To read the Microsoft Entra provisioning logs, see [Reporting on automatic user account provisioning](../app-provisioning/check-status-user-account-provisioning.md).

## Connector limitations

Visitly doesn't support hard deletes. Everything is soft delete only.

## Additional resources

* [Manage user account provisioning for enterprise apps](../app-provisioning/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md)
