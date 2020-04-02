---
title: 'Tutorial: Configure Wrike for automatic user provisioning with Azure Active Directory | Microsoft Docs'
description: Learn how to configure Azure Active Directory to automatically provision and deprovision user accounts to Wrike.
services: active-directory
documentationcenter: ''
author: zchia
writer: zchia
manager: beatrizd

ms.assetid: na
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/26/2019
ms.author: Zhchia
---

# Tutorial: Configure Wrike for automatic user provisioning

The objective of this tutorial is to demonstrate the steps you perform in Wrike and Azure Active Directory (Azure AD) to configure Azure AD to automatically provision and deprovision users or groups to Wrike.

> [!NOTE]
> This tutorial describes a connector built on top of the Azure AD user provisioning service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to software-as-a-service (SaaS) applications with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/manage-apps/user-provisioning).
>
> This connector is currently in Public Preview. For more information on the general Microsoft Azure terms of use for preview features, see [Supplemental terms of use for Microsoft Azure previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* An Azure AD tenant
* [A Wrike tenant](https://www.wrike.com/price/)
* A user account in Wrike with admin permissions

## Assign users to Wrike
Azure Active Directory uses a concept called *assignments* to determine which users should receive access to selected apps. In the context of automatic user provisioning, only the users or groups that were assigned to an application in Azure AD are synchronized.

Before you configure and enable automatic user provisioning, decide which users or groups in Azure AD need access to Wrike. Then assign these users or groups to Wrike by following the instructions here:

* [Assign a user or group to an enterprise app](../manage-apps/assign-user-or-group-access-portal.md)

## Important tips for assigning users to Wrike

* We recommend that you assign a single Azure AD user to Wrike to test the automatic user provisioning configuration. Additional users or groups can be assigned later.

* When you assign a user to Wrike, you must select any valid application-specific role (if available) in the assignment dialog box. Users with the Default Access role are excluded from provisioning.

## Set up Wrike for provisioning

Before you configure Wrike for automatic user provisioning with Azure AD, you need to enable System for Cross-domain Identity Management (SCIM) provisioning on Wrike.

1. Sign in to your [Wrike admin console](https://www.Wrike.com/login/). Go to your Tenant ID. Select **Apps & Integrations**.

	![Apps & Integrations](media/Wrike-provisioning-tutorial/admin.png)

2.  Go to **Azure AD** and select it.

	![Azure AD](media/Wrike-provisioning-tutorial/Capture01.png)

3.  Select SCIM. Copy the **Base URL**.

	![Base URL](media/Wrike-provisioning-tutorial/Wrike-tenanturl.png)

4. Select **API** > **Azure SCIM**.

	![Azure SCIM](media/Wrike-provisioning-tutorial/Wrike-add-scim.png)

5.  A pop-up opens. Enter the same password that you created earlier to create an account.

	![Wrike Create token](media/Wrike-provisioning-tutorial/password.png)

6. 	Copy the **Secret Token**, and paste it in Azure AD. Select **Save** to finish the provisioning setup on Wrike.

	![Permanent access token](media/Wrike-provisioning-tutorial/Wrike-create-token.png)


## Add Wrike from the gallery

Before you configure Wrike for automatic user provisioning with Azure AD, add Wrike from the Azure AD application gallery to your list of managed SaaS applications.

To add Wrike from the Azure AD application gallery, follow these steps.

1. In the [Azure portal](https://portal.azure.com), in the left navigation pane, select **Azure Active Directory**.

	![The Azure Active Directory button](common/select-azuread.png)

2. Go to **Enterprise applications**, and then select **All applications**.

	![The Enterprise applications blade](common/enterprise-applications.png)

3. To add a new application, select the **New application** button at the top of the pane.

	![The New application button](common/add-new-app.png)

4. In the search box, enter **Wrike**, select **Wrike** in the results panel, and then select **Add** to add the application.

	![Wrike in the results list](common/search-new-app.png)


## Configure automatic user provisioning to Wrike 

This section guides you through the steps to configure the Azure AD provisioning service to create, update, and disable users or groups in Wrike based on user or group assignments in Azure AD.

> [!TIP]
> To enable SAML-based single sign-on for Wrike, follow the instructions in the [Wrike single sign-on tutorial](wrike-tutorial.md). Single sign-on can be configured independently of automatic user provisioning, although these two features complement each other.

### Configure automatic user provisioning for Wrike in Azure AD

1. Sign in to the [Azure portal](https://portal.azure.com). Select **Enterprise Applications** > **All applications**.

	![All applications](common/enterprise-applications.png)

2. In the applications list, select **Wrike**.

	![The Wrike link in the Applications list](common/all-applications.png)

3. Select the **Provisioning** tab.

	![Provisioning tab](common/provisioning.png)

4. Set the **Provisioning Mode** to **Automatic**.

	![Provisioning Mode set to Automatic](common/provisioning-automatic.png)

5. Under the Admin Credentials section, input the **Base URL** and **Permanent access token** values retrieved earlier in **Tenant URL** and **Secret Token**, respectively. Select **Test Connection** to ensure that Azure AD can connect to Wrike. If the connection fails, make sure that your Wrike account has admin permissions and try again.

	![Tenant URL + token](common/provisioning-testconnection-tenanturltoken.png)

7. In the **Notification Email** box, enter the email address of a person or group who should receive the provisioning error notifications. Select the **Send an email notification when a failure occurs** check box.

	![Notification email](common/provisioning-notification-email.png)

8. Select **Save**.

9. Under the **Mappings** section, select **Synchronize Azure Active Directory Users to Wrike**.

	![Wrike user mappings](media/Wrike-provisioning-tutorial/Wrike-user-mappings.png)

10. Review the user attributes that are synchronized from Azure AD to Wrike in the **Attribute Mappings** section. The attributes selected as **Matching** properties are used to match the user accounts in Wrike for update operations. Select **Save** to commit any changes.

	![Wrike user attributes](media/Wrike-provisioning-tutorial/Wrike-user-attributes.png)

11. To configure scoping filters, follow the instructions in the [Scoping filter tutorial](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

12. To enable the Azure AD provisioning service for Wrike, change the **Provisioning Status** to **On** in the **Settings** section.

	![Provisioning Status toggled On](common/provisioning-toggle-on.png)

13. Define the users or groups that you want to provision to Wrike by choosing the desired values in **Scope** in the **Settings** section.

	![Provisioning Scope](common/provisioning-scope.png)

14. When you're ready to provision, select **Save**.

	![Saving provisioning configuration](common/provisioning-configuration-save.png)

This operation starts the initial synchronization of all users or groups defined in **Scope** in the **Settings** section. The initial sync takes longer to perform than subsequent syncs. For more information on how long it takes for users or groups to provision, see [How long will it take to provision users?](../app-provisioning/application-provisioning-when-will-provisioning-finish-specific-user.md#how-long-will-it-take-to-provision-users).

You can use the **Current Status** section to monitor progress and follow links to your provisioning activity report, which describes all actions performed by the Azure AD provisioning service on Wrike. For more information, see [Check the status of user provisioning](../app-provisioning/application-provisioning-when-will-provisioning-finish-specific-user.md). To read the Azure AD provisioning logs, see [Reporting on automatic user account provisioning](../app-provisioning/check-status-user-account-provisioning.md).

## Additional resources

* [Manage user account provisioning for enterprise apps](../app-provisioning/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md)
