---
title: 'Tutorial: Configure GitHub for automatic user provisioning with Azure Active Directory | Microsoft Docs'
description: Learn how to configure Azure Active Directory to automatically provision and de-provision user accounts to GitHub.
services: active-directory
documentationcenter: ''
author: ArvindHarinder1
manager: CelesteDG

ms.assetid: d4ca2365-6729-48f7-bb7f-c0f5ffe740a3
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/27/2019
ms.author: arvinh

ms.collection: M365-identity-device-management
---
# Tutorial: Configure GitHub for automatic user provisioning

The objective of this tutorial is to show you the steps you need to perform in GitHub and Azure AD to automatically provision and de-provision user accounts from Azure AD to GitHub.

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following items:

* An Azure Active directory tenant
* A GitHub organization created in [GitHub Enterprise Cloud](https://help.github.com/articles/github-s-products/#github-enterprise), which requires the [GitHub Enterprise billing plan](https://help.github.com/articles/github-s-billing-plans/#billing-plans-for-organizations)
* A user account in GitHub with Admin permissions to the organization

> [!NOTE]
> The Azure AD provisioning integration relies on the [GitHub SCIM API](https://developer.github.com/v3/scim/), which is available to [GitHub Enterprise Cloud](https://help.github.com/articles/github-s-products/#github-enterprise) customers on the [GitHub Enterprise billing plan](https://help.github.com/articles/github-s-billing-plans/#billing-plans-for-organizations).

## Assigning users to GitHub

Azure Active Directory uses a concept called "assignments" to determine which users should receive access to selected apps. In the context of automatic user account provisioning, only the users and groups that have been "assigned" to an application in Azure AD is synchronized. 

Before configuring and enabling the provisioning service, you need to decide what users and/or groups in Azure AD represent the users who need access to your GitHub app. Once decided, you can assign these users to your GitHub app by following the instructions here:

[Assign a user or group to an enterprise app](../manage-apps/assign-user-or-group-access-portal.md)

### Important tips for assigning users to GitHub

* It is recommended that a single Azure AD user is assigned to GitHub to test the provisioning configuration. Additional users and/or groups may be assigned later.

* When assigning a user to GitHub, you must select either the **User** role, or another valid application-specific role (if available) in the assignment dialog. The **Default Access** role does not work for provisioning, and these users are skipped.

## Configuring user provisioning to GitHub

This section guides you through connecting your Azure AD to GitHub's user account provisioning API, and configuring the provisioning service to create, update, and disable assigned user accounts in GitHub based on user and group assignment in Azure AD.

> [!TIP]
> You may also choose to enabled SAML-based Single Sign-On for GitHub, following the instructions provided in [Azure portal](https://portal.azure.com). Single sign-on can be configured independently of automatic provisioning, though these two features compliment each other.

### Configure automatic user account provisioning to GitHub in Azure AD

1. In the [Azure portal](https://portal.azure.com), browse to the **Azure Active Directory > Enterprise Apps > All applications**  section.

2. If you have already configured GitHub for single sign-on, search for your instance of GitHub using the search field. Otherwise, select **Add** and search for **GitHub** in the application gallery. Select GitHub from the search results, and add it to your list of applications.

3. Select your instance of GitHub, then select the **Provisioning** tab.

4. Set the **Provisioning Mode** to **Automatic**.

	![GitHub Provisioning](./media/github-provisioning-tutorial/GitHub1.png)

5. Under the **Admin Credentials** section, click **Authorize**. This operation opens a GitHub authorization dialog in a new browser window. 

6. In the new window, sign into GitHub using your Admin account. In the resulting authorization dialog, select the GitHub team that you want to enable provisioning for, and then select **Authorize**. Once completed, return to the Azure portal to complete the provisioning configuration.

	![Authorization Dialog](./media/github-provisioning-tutorial/GitHub2.png)

7. In the Azure portal, input **Tenant URL** and click **Test Connection** to ensure Azure AD can connect to your GitHub app. If the connection fails, ensure your GitHub account has Admin permissions and **Tenant URl** is inputted correctly, then try the "Authorize" step again (you can constitute **Tenant URL** by rule: `https://api.github.com/scim/v2/organizations/<Organization_name>`, you can find your organizations under your GitHub account: **Settings** > **Organizations**).

	![Authorization Dialog](./media/github-provisioning-tutorial/GitHub3.png)

8. Enter the email address of a person or group who should receive provisioning error notifications in the **Notification Email** field, and check the checkbox "Send an email notification when a failure occurs."

9. Click **Save**.

10. Under the Mappings section, select **Synchronize Azure Active Directory Users to GitHub**.

11. In the **Attribute Mappings** section, review the user attributes that are synchronized from Azure AD to GitHub. The attributes selected as **Matching** properties are used to match the user accounts in GitHub for update operations. Select the Save button to commit any changes.

12. To enable the Azure AD provisioning service for GitHub, change the **Provisioning Status** to **On** in the **Settings** section

13. Click **Save**.

This operation starts the initial synchronization of any users and/or groups assigned to GitHub in the Users and Groups section. The initial sync takes longer to perform than subsequent syncs, which occur approximately every 40 minutes as long as the service is running. You can use the **Synchronization Details** section to monitor progress and follow links to provisioning activity logs, which describe all actions performed by the provisioning service.

For more information on how to read the Azure AD provisioning logs, see [Reporting on automatic user account provisioning](../manage-apps/check-status-user-account-provisioning.md).

## Additional resources

* [Managing user account provisioning for Enterprise Apps](../manage-apps/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../manage-apps/check-status-user-account-provisioning.md)
