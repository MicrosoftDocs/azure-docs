---
title: 'Tutorial: Configure Priority Matrix for automatic user provisioning with Azure Active Directory | Microsoft Docs'
description: Learn how to configure Azure Active Directory to automatically provision and de-provision user accounts to Priority Matrix.
services: active-directory
documentationcenter: ''
author: zchia
writer: zchia
manager: beatrizd

ms.assetid: a4598a99-3c98-4c14-86c2-95cc562e2439
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/08/2019
ms.author: Zhchia
---

# Tutorial: Configure Priority Matrix for automatic user provisioning

The objective of this tutorial is to demonstrate the steps to be performed in Priority Matrix and Azure Active Directory (Azure AD) to configure Azure AD to automatically provision and de-provision users and/or groups to Priority Matrix.

> [!NOTE]
> This tutorial describes a connector built on top of the Azure AD User Provisioning Service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Azure Active Directory](../app-provisioning/user-provisioning.md).
>
> This connector is currently in Public Preview. For more information on the general Microsoft Azure terms of use for Preview features, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* An Azure AD tenant
* [A Priority Matrix tenant](https://appfluence.com/pricing/)
* A user account on a Priority Matrix with Admin permissions.

## Assign users to Priority Matrix

Azure Active Directory uses a concept called assignments to determine which users should receive access to selected apps. In the context of automatic user provisioning, only the users and/or groups that have been assigned to an application in Azure AD are synchronized.

Before configuring and enabling automatic user provisioning, you should decide which users and/or groups in Azure AD need access to Priority Matrix. Once decided, you can assign these users and/or groups to Priority Matrix by following the instructions here:

* [Assign a user or group to an enterprise app](../manage-apps/assign-user-or-group-access-portal.md)

### Important tips for assigning users to Priority Matrix

* It is recommended that a single Azure AD user is assigned to Priority Matrix to test the automatic user provisioning configuration. Additional users and/or groups may be assigned later.

* When assigning a user to Priority Matrix, you must select any valid application-specific role (if available) in the assignment dialog. Users with the **Default Access** role are excluded from provisioning.

## Set up Priority Matrix for provisioning

Before configuring Priority Matrix for automatic user provisioning with Azure AD, you will need to retrieve some provisioning information from Priority Matrix.

1. Sign in to your [Priority Matrix Admin Console](https://sync.appfluence.com/accounts/login/?next=/accounts/provisioning).

3. Click **Oauth login token** for Priority Matrix

	![Priority Matrix Add SCIM](media/priority-matrix-provisioning-tutorial/oauthlogin.png)

4. Click the **GET NEW TOKEN** button. Copy the **Token String**. This value will be entered in the **Secret Token** field in the Provisioning tab of your Priority Matrix application in the Azure portal. 

	![Priority Matrix Create Token](media/priority-matrix-provisioning-tutorial/token.png)

## Add Priority Matrix from the gallery

To configure Priority Matrix for automatic user provisioning with Azure AD, you need to add Priority Matrix from the Azure AD application gallery to your list of managed SaaS applications.

1. In the **[Azure portal](https://portal.azure.com)**, in the left navigation panel, select **Azure Active Directory**.

	![The Azure Active Directory button](common/select-azuread.png)

2. Go to **Enterprise applications**, and then select **All applications**.

	![The Enterprise applications blade](common/enterprise-applications.png)

3. To add a new application, select the **New application** button at the top of the pane.

	![The New application button](common/add-new-app.png)

4. In the search box, enter **Priority Matrix**, select **Priority Matrix** in the results panel. 

	![Priority Matrix in the results list](common/search-new-app.png)

5. Select the **Sign-up for Priority Matrix** button which will redirect you to Priority Matrix's login page. 

	![Priority Matrix OIDC Add](media/priority-matrix-provisioning-tutorial/signup.png)

6. As Priority Matrix is an OpenIDConnect app, choose to login to Priority Matrix using your Microsoft work account.

	![Priority Matrix OIDC login](media/priority-matrix-provisioning-tutorial/msftsignin.png)

7. After a successful authentication, accept the consent prompt for the consent page. The application will then be automatically added to your tenant and you will be redirected to your Priority Matrix account.

	![Priority Matrix OIDc Consent](media/priority-matrix-provisioning-tutorial/consent.png)

## Configure automatic user provisioning to Priority Matrix 

This section guides you through the steps to configure the Azure AD provisioning service to create, update, and disable users and/or groups in Priority Matrix based on user and/or group assignments in Azure AD.

> [!NOTE]
> To learn more about Priority Matrix's SCIM endpoint, refer to [User provisioning and Priority Matrix](https://appfluence.com/help/article/user-provisioning/).

### To configure automatic user provisioning for Priority Matrix in Azure AD:

1. Sign in to the [Azure portal](https://portal.azure.com). Select **Enterprise Applications**, then select **All applications**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **Priority Matrix**.

	![The Priority Matrix link in the Applications list](common/all-applications.png)

3. Select the **Provisioning** tab.

	![Provisioning tab](common/provisioning.png)

4. Set the **Provisioning Mode** to **Automatic**.

	![Provisioning tab](common/provisioning-automatic.png)

5. Under the **Admin Credentials** section, input `https://sync.appfluence.com/scim/v2/` in **Tenant URL**. Input the value that you retrieved and saved earlier from Priority Matrix in **Secret Token**. Click **Test Connection** to ensure Azure AD can connect to Priority Matrix. If the connection fails, ensure your Priority Matrix account has Admin permissions and try again.

	![Tenant URL + Token](common/provisioning-testconnection-tenanturltoken.png)

6. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and check the checkbox - **Send an email notification when a failure occurs**.

	![Notification Email](common/provisioning-notification-email.png)

7. Click **Save**.

8. Under the **Mappings** section, select **Synchronize Azure Active Directory Users to Priority Matrix**.

	![Priority Matrix User Mappings](media/priority-matrix-provisioning-tutorial/usermappings.png)

9. Review the user attributes that are synchronized from Azure AD to Priority Matrix in the **Attribute Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in Priority Matrix for update operations. Select the **Save** button to commit any changes.

	![Priority Matrix User Attributes](media/priority-matrix-provisioning-tutorial/userattributes.png)

10. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

11. To enable the Azure AD provisioning service for Priority Matrix, change the **Provisioning Status** to **On** in the **Settings** section.

	![Provisioning Status Toggled On](common/provisioning-toggle-on.png)

12. Define the users and/or groups that you would like to provision to Priority Matrix by choosing the desired values in **Scope** in the **Settings** section.

	![Provisioning Scope](common/provisioning-scope.png)

13. When you are ready to provision, click **Save**.

	![Saving Provisioning Configuration](common/provisioning-configuration-save.png)

This operation starts the initial synchronization of all users and/or groups defined in **Scope** in the **Settings** section. The initial sync takes longer to perform than subsequent syncs, which occur approximately every 40 minutes as long as the Azure AD provisioning service is running. You can use the **Synchronization Details** section to monitor progress and follow links to provisioning activity report, which describes all actions performed by the Azure AD provisioning service on Priority Matrix.

For more information on how to read the Azure AD provisioning logs, see [Reporting on automatic user account provisioning](../app-provisioning/check-status-user-account-provisioning.md).

## Additional resources

* [Managing user account provisioning for Enterprise Apps](../app-provisioning/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md)


