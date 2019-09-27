---
title: 'Tutorial: Configure Visitly  for automatic user provisioning with Azure Active Directory | Microsoft Docs'
description: Learn how to configure Azure Active Directory to automatically provision and de-provision user accounts to Visitly.
services: active-directory
documentationcenter: ''
author: zchia
writer: zchia
manager: beatrizd

ms.assetid: fb48deae-4653-448a-ba2f-90258edab3a7
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/30/2019
ms.author: Zhchia
---

# Tutorial: Configure Visitly for automatic user provisioning

The objective of this tutorial is to demonstrate the steps to be performed in Visitly  and Azure Active Directory (Azure AD) to configure Azure AD to automatically provision and de-provision users and/or groups to Visitly.

> [!NOTE]
> This tutorial describes a connector built on top of the Azure AD User Provisioning Service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Azure Active Directory](../manage-apps/user-provisioning.md).
>
> This connector is currently in Public Preview. For more information on the general Microsoft Azure terms of use for Preview features, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* An Azure AD tenant.
* [A Visitly tenant](https://www.visitly.io/pricing/)
* A user account in Visitly  with Admin permissions.

## Assigning users to Visitly 

Azure Active Directory uses a concept called *assignments* to determine which users should receive access to selected apps. In the context of automatic user provisioning, only the users and/or groups that have been assigned to an application in Azure AD are synchronized.

Before configuring and enabling automatic user provisioning, you should decide which users and/or groups in Azure AD need access to Visitly. Once decided, you can assign these users and/or groups to Visitly  by following the instructions here:
* [Assign a user or group to an enterprise app](../manage-apps/assign-user-or-group-access-portal.md)

## Important tips for assigning users to Visitly 

* It is recommended that a single Azure AD user is assigned to Visitly  to test the automatic user provisioning configuration. Additional users and/or groups may be assigned later.

* When assigning a user to Visitly, you must select any valid application-specific role (if available) in the assignment dialog. Users with the **Default Access** role are excluded from provisioning.

## Setup Visitly for provisioning

Before configuring Visitly for automatic user provisioning with Azure AD, you will need to enable SCIM provisioning on Visitly.

1. Log in into [Visitly](https://app.visitly.io/login). Click on **Integrations** > **Host Synchronization**.

	![Visitly](media/Visitly-provisioning-tutorial/login.png)

2. Scroll down Select  **Azure AD section**

	![Visitly](media/Visitly-provisioning-tutorial/integration.png)

3. Copy the **API Key**. These values will be entered in the **Secret Token** field in the Provisioning tab of your Visitly application in the Azure portal.

	![Visitly](media/Visitly-provisioning-tutorial/token.png)


## Add Visitly from the gallery

To configure Visitly  for automatic user provisioning with Azure AD, you need to add Visitly  from the Azure AD application gallery to your list of managed SaaS applications.

**To add Visitly  from the Azure AD application gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, in the left navigation panel, select **Azure Active Directory**.

	![The Azure Active Directory button](common/select-azuread.png)

2. Go to **Enterprise applications**, and then select **All applications**.

	![The Enterprise applications blade](common/enterprise-applications.png)

3. To add a new application, select the **New application** button at the top of the pane.

	![The New application button](common/add-new-app.png)

4. In the search box, enter **Visitly**, select **Visitly** in the results panel, and then click the **Add** button to add the application.

	![Visitly  in the results list](common/search-new-app.png)

## Configuring automatic user provisioning to Visitly  

This section guides you through the steps to configure the Azure AD provisioning service to create, update, and disable users and/or groups in Visitly  based on user and/or group assignments in Azure AD.

> [!TIP]
> You may also choose to enable SAML-based single sign-on for Visitly, following the instructions provided in the [Visitly Single sign-on tutorial](Visitly-tutorial.md). Single sign-on can be configured independently of automatic user provisioning, though these two features compliment each other

### To configure automatic user provisioning for Visitly  in Azure AD:

1. Sign in to the [Azure portal](https://portal.azure.com). Select **Enterprise Applications**, then select **All applications**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **Visitly**.

	![The Visitly  link in the Applications list](common/all-applications.png)

3. Select the **Provisioning** tab.

	![Provisioning tab](common/provisioning.png)

4. Set the **Provisioning Mode** to **Automatic**.

	![Provisioning tab](common/provisioning-automatic.png)

5. Under the Admin Credentials section, input the ` https://api.visitly.io/v1/usersync/SCIM` and **API Key** values retrieved earlier in **Tenant URL** and **Secret Token** respectively. Click **Test Connection** to ensure Azure AD can connect to Visitly. If the connection fails, ensure your Visitly account has Admin permissions and try again.

	![Tenant URL + Token](common/provisioning-testconnection-tenanturltoken.png)

6. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and check the checkbox - **Send an email notification when a failure occurs**.

	![Notification Email](common/provisioning-notification-email.png)

7. Click **Save**.

8. Under the **Mappings** section, select **Synchronize Azure Active Directory Users to Visitly**.

	![Visitly User Mappings](media/visitly-provisioning-tutorial/usermapping.png)

9. Review the user attributes that are synchronized from Azure AD to Visitly  in the **Attribute Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in Visitly  for update operations. Select the **Save** button to commit any changes.

	![Visitly  User Attributes](media/visitly-provisioning-tutorial/userattribute.png)



10. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](../manage-apps/define-conditional-rules-for-provisioning-user-accounts.md).

11. To enable the Azure AD provisioning service for Visitly, change the **Provisioning Status** to **On** in the **Settings** section.

	![Provisioning Status Toggled On](common/provisioning-toggle-on.png)

12. Define the users and/or groups that you would like to provision to Visitly  by choosing the desired values in **Scope** in the **Settings** section.

	![Provisioning Scope](common/provisioning-scope.png)

13. When you are ready to provision, click **Save**.

	![Saving Provisioning Configuration](common/provisioning-configuration-save.png)

This operation starts the initial synchronization of all users and/or groups defined in **Scope** in the **Settings** section. The initial sync takes longer to perform than subsequent syncs. For more information on how long it will take for users and/or groups to provision, see [How long will it take to provision users](../manage-apps/application-provisioning-when-will-provisioning-finish-specific-user.md#how-long-will-it-take-to-provision-users).

You can use the **Current Status** section to monitor progress and follow links to your provisioning activity report, which describes all actions performed by the Azure AD provisioning service on Visitly. For more information, see [Check the status of user provisioning](../manage-apps/application-provisioning-when-will-provisioning-finish-specific-user.md). To read the Azure AD provisioning logs, see [Reporting on automatic user account provisioning](../manage-apps/check-status-user-account-provisioning.md).

## Connector Limitations

Visitly does not support hard deletes, everything is soft delete only.  

## Additional resources

* [Managing user account provisioning for Enterprise Apps](../manage-apps/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../manage-apps/check-status-user-account-provisioning.md)
