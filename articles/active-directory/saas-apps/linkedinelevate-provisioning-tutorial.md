---
title: 'Tutorial: User provisioning for LinkedIn Elevate'
description: Learn how to configure Azure Active Directory to automatically provision and de-provision user accounts to LinkedIn Elevate.
services: active-directory
author: ArvindHarinder1
manager: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 11/21/2022
ms.author: arvinh
---

# Tutorial: Configure LinkedIn Elevate for automatic user provisioning

The objective of this tutorial is to show you the steps you need to perform in LinkedIn Elevate and Azure AD to automatically provision and de-provision user accounts from Azure AD to LinkedIn Elevate.

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following items:

* An Azure Active Directory tenant
* A LinkedIn Elevate tenant
* An administrator account in LinkedIn Elevate with access to the LinkedIn Account Center

> [!NOTE]
> Azure Active Directory integrates with LinkedIn Elevate using the SCIM protocol.

## Assigning users to LinkedIn Elevate

Azure Active Directory uses a concept called "assignments" to determine which users should receive access to selected apps. In the context of automatic user account provisioning, only the users and groups that have been "assigned" to an application in Azure AD will be synchronized.

Before configuring and enabling the provisioning service, you will need to decide what users and/or groups in Azure AD represent the users who need access to LinkedIn Elevate. Once decided, you can assign these users to LinkedIn Elevate by following the instructions here:

[Assign a user or group to an enterprise app](../manage-apps/assign-user-or-group-access-portal.md)

### Important tips for assigning users to LinkedIn Elevate

* It is recommended that a single Azure AD user be assigned to LinkedIn Elevate to test the provisioning configuration. Additional users and/or groups may be assigned later.

* When assigning a user to LinkedIn Elevate, you must select the **User** role in the assignment dialog. The "Default Access" role does not work for provisioning.

## Configuring user provisioning to LinkedIn Elevate

This section guides you through connecting your Azure AD to LinkedIn Elevate's SCIM user account provisioning API, and configuring the provisioning service to create, update and disable assigned user accounts in LinkedIn Elevate based on user and group assignment in Azure AD.

**Tip:** You may also choose to enabled SAML-based Single Sign-On for LinkedIn Elevate, following the instructions provided in the [Azure portal](https://portal.azure.com). Single sign-on can be configured independently of automatic provisioning, though these two features complement each other.

### To configure automatic user account provisioning to LinkedIn Elevate in Azure AD:

The first step is to retrieve your LinkedIn access token. If you are an Enterprise administrator, you can self-provision an access token. In your account center, go to **Settings &gt; Global Settings** and open the **SCIM Setup** panel.

> [!NOTE]
> If you are accessing the account center directly rather than through a link, you can reach it using the following steps.

1. Sign in to Account Center.

2. Select **Admin &gt; Admin Settings** .

3. Click **Advanced Integrations** on the left sidebar. You are directed to the account center.

4. Click **+ Add new SCIM configuration** and follow the procedure by filling in each field.

    > [!NOTE]
    > When auto-assign licenses is not enabled, it means that only user data is synced.

    ![Screenshot shows the LinkedIn Account Center Global Settings.](./media/linkedinelevate-provisioning-tutorial/linkedin_elevate1.PNG)

    > [!NOTE]
    > When auto-license assignment is enabled, you need to note the application instance and license type. Licenses are assigned on a first come, first serve basis until all the licenses are taken.

    ![Screenshot shows the S C I M Setup page.](./media/linkedinelevate-provisioning-tutorial/linkedin_elevate2.PNG)

5. Click **Generate token**. You should see your access token display under the **Access token** field.

6. Save your access token to your clipboard or computer before leaving the page.

7. Next, sign in to the [Azure portal](https://portal.azure.com), and browse to the **Azure Active Directory > Enterprise Apps > All applications**  section.

8. If you have already configured LinkedIn Elevate for single sign-on, search for your instance of LinkedIn Elevate using the search field. Otherwise, select **Add** and search for **LinkedIn Elevate** in the application gallery. Select LinkedIn Elevate from the search results, and add it to your list of applications.

9. Select your instance of LinkedIn Elevate, then select the **Provisioning** tab.

10. Set the **Provisioning Mode** to **Automatic**.

    ![Screenshot shows the LinkedIn Elevate Provisioning page.](./media/linkedinelevate-provisioning-tutorial/linkedin_elevate3.PNG)

11. Fill in the following fields under **Admin Credentials** :

    * In the **Tenant URL** field, enter `https://api.linkedin.com`.

    * In the **Secret Token** field, enter the access token you generated in step 1 and click **Test Connection** .

    * You should see a success notification on the upper-right side of your portal.

12. Enter the email address of a person or group who should receive provisioning error notifications in the **Notification Email** field, and check the checkbox below.

13. Click **Save**.

14. In the **Attribute Mappings** section, review the user and group attributes that will be synchronized from Azure AD to LinkedIn Elevate. Note that the attributes selected as **Matching** properties will be used to match the user accounts and groups in LinkedIn Elevate for update operations. Select the Save button to commit any changes.

    ![Screenshot shows Mappings, including Attribute Mappings.](./media/linkedinelevate-provisioning-tutorial/linkedin_elevate4.PNG)

15. To enable the Azure AD provisioning service for LinkedIn Elevate, change the **Provisioning Status** to **On** in the **Settings** section

16. Click **Save**.

This will start the initial synchronization of any users and/or groups assigned to LinkedIn Elevate in the Users and Groups section. Note that the initial sync will take longer to perform than subsequent syncs, which occur approximately every 40 minutes as long as the service is running. You can use the **Synchronization Details** section to monitor progress and follow links to provisioning activity logs, which describe all actions performed by the provisioning service on your LinkedIn Elevate app.

For more information on how to read the Azure AD provisioning logs, see [Reporting on automatic user account provisioning](../app-provisioning/check-status-user-account-provisioning.md).

## Additional Resources

* [Managing user account provisioning for Enterprise Apps](../app-provisioning/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)
