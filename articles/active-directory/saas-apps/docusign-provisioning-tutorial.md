---
title: 'Tutorial: Configure DocuSign for automatic user provisioning with Microsoft Entra ID| Microsoft Docs'
description: Learn how to configure single sign-on between Microsoft Entra ID and DocuSign.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 11/21/2022
ms.author: jeedes
---
# Tutorial: Configure DocuSign for automatic user provisioning

The objective of this tutorial is to show you the steps you need to perform in DocuSign and Microsoft Entra ID to automatically provision and de-provision user accounts from Microsoft Entra ID to DocuSign.

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following items:

*   A Microsoft Entra tenant.
*   A DocuSign single sign-on enabled subscription.
*   A user account in DocuSign with Team Admin permissions.

## Assigning users to DocuSign

Microsoft Entra ID uses a concept called "assignments" to determine which users should receive access to selected apps. In the context of automatic user account provisioning, only the users and groups that have been "assigned" to an application in Microsoft Entra ID are synchronized.

Before configuring and enabling the provisioning service, you need to decide what users and/or groups in Microsoft Entra ID represent the users who need access to your DocuSign app. Once decided, you can assign these users to your DocuSign app by following the instructions here:

[Assign a user or group to an enterprise app](../manage-apps/assign-user-or-group-access-portal.md)

### Important tips for assigning users to DocuSign

*   It is recommended that a single Microsoft Entra user is assigned to DocuSign to test the provisioning configuration. Additional users may be assigned later.

*   When assigning a user to DocuSign, you must select a valid user role. The "Default Access" role does not work for provisioning.

> [!NOTE]
> Microsoft Entra ID does not support group provisioning with the Docusign application, only users can be provisioned.

## Enable User Provisioning

This section guides you through connecting your Microsoft Entra ID to DocuSign's user account provisioning API, and configuring the provisioning service to create, update, and disable assigned user accounts in DocuSign based on user and group assignment in Microsoft Entra ID.

> [!Tip]
> You may also choose to enabled SAML-based Single Sign-On for DocuSign, following the instructions provided in the [Azure portal](https://portal.azure.com). Single sign-on can be configured independently of automatic provisioning, though these two features compliment each other.

### To configure user account provisioning:

The objective of this section is to outline how to enable user provisioning of Active Directory user accounts to DocuSign.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications**.

1. If you have already configured DocuSign for single sign-on, search for your instance of DocuSign using the search field. Otherwise, select **Add** and search for **DocuSign** in the application gallery. Select DocuSign from the search results, and add it to your list of applications.

1. Select your instance of DocuSign, then select the **Provisioning** tab.

1. Set the **Provisioning Mode** to **Automatic**. 

    ![Screenshot of the Provisioning tab for DocuSign in Azure portal. Provisioning Mode is set to Automatic and Admin Username, Password and Test Connection are highlighted.](./media/docusign-provisioning-tutorial/provisioning.png)

1. Under the **Admin Credentials** section, provide the following configuration settings:
   
    1. In the **Admin User Name** textbox, type a DocuSign account name that has the **System Administrator** profile in DocuSign.com assigned.
   
    1. In the **Admin Password** textbox, type the password for this account.

> [!NOTE]
> If both SSO and user provisioning is setup, the authorization credentials used for provisioning needs to be configured to work with both SSO and Username/Password.

1. Select **Test Connection** to ensure Microsoft Entra ID can connect to your DocuSign app.

1. In the **Notification Email** field, enter the email address of a person or group who should receive provisioning error notifications, and check the checkbox.

1. Click **Save.**

1. Under the Mappings section, select **Synchronize Microsoft Entra users to DocuSign.**

1. In the **Attribute Mappings** section, review the user attributes that are synchronized from Microsoft Entra ID to DocuSign. The attributes selected as **Matching** properties are used to match the user accounts in DocuSign for update operations. Select the Save button to commit any changes.

1. To enable the Microsoft Entra provisioning service for DocuSign, change the **Provisioning Status** to **On** in the Settings section

1. Click **Save.**

It starts the initial synchronization of any users assigned to DocuSign in the Users and Groups section. The initial sync takes longer to perform than subsequent syncs, which occur approximately every 40 minutes as long as the service is running. You can use the **Synchronization Details** section to monitor progress and follow links to provisioning activity logs, which describe all actions performed by the provisioning service on your DocuSign app.

For more information on how to read the Microsoft Entra provisioning logs, see [Reporting on automatic user account provisioning](../app-provisioning/check-status-user-account-provisioning.md).

## Troubleshooting Tips
* Provisioning a role or permission profile for a user in Docusign can be accomplished by using an expression in your attribute mappings using the [switch](../app-provisioning/functions-for-customizing-application-data.md#switch) and [singleAppRoleAssignment](../app-provisioning/functions-for-customizing-application-data.md#singleapproleassignment) functions. For example, the expression below will provision the ID "8032066" when a user has the "DS Admin" role assigned in Microsoft Entra ID. It will not provision any permission profile if the user isn't assigned a role on the Microsoft Entra ID side. The ID can be retrieved from the DocuSign [portal](https://support.docusign.com/).

Switch(SingleAppRoleAssignment([appRoleAssignments])," ", "DS Admin", "8032066")


## Additional resources

* [Managing user account provisioning for Enterprise Apps](tutorial-list.md)
* [What is application access and single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)
* [Configure Single Sign-on](docusign-tutorial.md)
