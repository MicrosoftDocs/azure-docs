---
title: 'Tutorial: Configure Visitly for automatic user provisioning with Azure Active Directory | Microsoft Docs'
description: Learn how to configure Azure Active Directory to automatically provision and deprovision user accounts to Visitly.
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

The objective of this tutorial is to demonstrate the steps you perform in Visitly and Azure Active Directory (Azure AD) to configure Azure AD to automatically provision and deprovision users or groups to Visitly.

> [!NOTE]
> This tutorial describes a connector built on top of the Azure AD user provisioning service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to software-as-a-service (SaaS) applications with Azure Active Directory](../app-provisioning/user-provisioning.md).
>
> This connector is currently in Public Preview. For more information on the general Microsoft Azure terms of use for preview features, see [Supplemental terms of use for Microsoft Azure previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* An Azure AD tenant
* [A Visitly tenant](https://www.visitly.io/pricing/)
* A user account in Visitly with admin permissions

## Assign users to Visitly 

Azure Active Directory uses a concept called *assignments* to determine which users should receive access to selected apps. In the context of automatic user provisioning, only the users or groups that were assigned to an application in Azure AD are synchronized.

Before you configure and enable automatic user provisioning, decide which users or groups in Azure AD need access to Visitly. Then assign these users or groups to Visitly by following the instructions here:
* [Assign a user or group to an enterprise app](../manage-apps/assign-user-or-group-access-portal.md)

## Important tips for assigning users to Visitly 

* We recommend that you assign a single Azure AD user to Visitly to test the automatic user provisioning configuration. Additional users or groups can be assigned later.

* When you assign a user to Visitly, you must select any valid application-specific role (if available) in the assignment dialog box. Users with the Default Access role are excluded from provisioning.

## Set up Visitly for provisioning

Before you configure Visitly for automatic user provisioning with Azure AD, you need to enable System for Cross-domain Identity Management (SCIM) provisioning on Visitly.

1. Sign in to [Visitly](https://app.visitly.io/login). Select **Integrations** > **Host Synchronization**.

	![Host Synchronization](media/Visitly-provisioning-tutorial/login.png)

2. Select the **Azure AD** section.

	![Azure AD section](media/Visitly-provisioning-tutorial/integration.png)

3. Copy the **API Key**. These values are entered in the **Secret Token** box on the **Provisioning** tab of your Visitly application in the Azure portal.

	![API Key](media/Visitly-provisioning-tutorial/token.png)


## Add Visitly from the gallery

To configure Visitly for automatic user provisioning with Azure AD, add Visitly from the Azure AD application gallery to your list of managed SaaS applications.

To add Visitly from the Azure AD application gallery, follow these steps.

1. In the [Azure portal](https://portal.azure.com), in the left navigation pane, select **Azure Active Directory**.

	![The Azure Active Directory button](common/select-azuread.png)

2. Go to **Enterprise applications**, and then select **All applications**.

	![The Enterprise applications blade](common/enterprise-applications.png)

3. To add a new application, select the **New application** button at the top of the pane.

	![The New application button](common/add-new-app.png)

4. In the search box, enter **Visitly**, select **Visitly** in the results panel, and then select **Add** to add the application.

	![Visitly in the results list](common/search-new-app.png)

## Configure automatic user provisioning to Visitly 

This section guides you through the steps to configure the Azure AD provisioning service to create, update, and disable users or groups in Visitly based on user or group assignments in Azure AD.

> [!TIP]
> To enable SAML-based single sign-on for Visitly, follow the instructions in the [Visitly single sign-on tutorial](Visitly-tutorial.md). Single sign-on can be configured independently of automatic user provisioning, although these two features complement each other.

### Configure automatic user provisioning for Visitly in Azure AD

1. Sign in to the [Azure portal](https://portal.azure.com). Select **Enterprise Applications** > **All applications**.

	![All applications](common/enterprise-applications.png)

2. In the applications list, select **Visitly**.

	![The Visitly link in the Applications list](common/all-applications.png)

3. Select the **Provisioning** tab.

	![Provisioning tab](common/provisioning.png)

4. Set the **Provisioning Mode** to **Automatic**.

	![Provisioning Mode set to Automatic](common/provisioning-automatic.png)

5. Under the Admin Credentials section, input the `https://api.visitly.io/v1/usersync/SCIM` and **API Key** values retrieved earlier in **Tenant URL** and **Secret Token**, respectively. Select **Test Connection** to ensure that Azure AD can connect to Visitly. If the connection fails, make sure that your Visitly account has admin permissions and try again.

	![Tenant URL + token](common/provisioning-testconnection-tenanturltoken.png)

6. In the **Notification Email** box, enter the email address of a person or group who should receive the provisioning error notifications. Select the **Send an email notification when a failure occurs** check box.

	![Notification email](common/provisioning-notification-email.png)

7. Select **Save**.

8. Under the **Mappings** section, select **Synchronize Azure Active Directory Users to Visitly**.

	![Visitly user mappings](media/visitly-provisioning-tutorial/usermapping.png)

9. Review the user attributes that are synchronized from Azure AD to Visitly in the **Attribute Mappings** section. The attributes selected as **Matching** properties are used to match the user accounts in Visitly for update operations. Select **Save** to commit any changes.

	![Visitly user attributes](media/visitly-provisioning-tutorial/userattribute.png)

10. To configure scoping filters, follow the instructions in the [Scoping filter tutorial](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

11. To enable the Azure AD provisioning service for Visitly, change the **Provisioning Status** to **On** in the **Settings** section.

	![Provisioning Status toggled On](common/provisioning-toggle-on.png)

12. Define the users or groups that you want to provision to Visitly by choosing the desired values in **Scope** in the **Settings** section.

	![Provisioning Scope](common/provisioning-scope.png)

13. When you're ready to provision, select **Save**.

	![Saving provisioning configuration](common/provisioning-configuration-save.png)

This operation starts the initial synchronization of all users or groups defined in **Scope** in the **Settings** section. The initial sync takes longer to perform than subsequent syncs. For more information on how long it takes for users or groups to provision, see [How long will it take to provision users?](../app-provisioning/application-provisioning-when-will-provisioning-finish-specific-user.md#how-long-will-it-take-to-provision-users).

You can use the **Current Status** section to monitor progress and follow links to your provisioning activity report, which describes all actions performed by the Azure AD provisioning service on Visitly. For more information, see [Check the status of user provisioning](../app-provisioning/application-provisioning-when-will-provisioning-finish-specific-user.md). To read the Azure AD provisioning logs, see [Reporting on automatic user account provisioning](../app-provisioning/check-status-user-account-provisioning.md).

## Connector limitations

Visitly doesn't support hard deletes. Everything is soft delete only.

## Additional resources

* [Manage user account provisioning for enterprise apps](../app-provisioning/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md)
