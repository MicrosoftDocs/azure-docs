---
title: 'Tutorial: Configure Dropbox for Business for automatic user provisioning with Azure Active Directory | Microsoft Docs'
description: Learn how to configure Azure Active Directory to automatically provision and de-provision user accounts to Dropbox for Business.
services: active-directory
author: zchia
writer: zchia
manager: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 05/20/2019
ms.author: jeedes
---

# Tutorial: Configure Dropbox for Business for automatic user provisioning

The objective of this tutorial is to demonstrate the steps to be performed in Dropbox for Business and Azure Active Directory (Azure AD) to configure Azure AD to automatically provision and de-provision users and/or groups to Dropbox for Business.

> [!IMPORTANT]
> In the future, Microsoft and Dropbox will be deprecating the old Dropbox integration. This was originally planned for 4/1/2021, but has been postponed indefinitely. However, to avoid disruption of service, we recommend migrating to the new SCIM 2.0 Dropbox integration which supports Groups. To migrate to the new Dropbox integration, add and configure a new instance of Dropbox for Provisioning in your Azure AD tenant using the steps below. Once you have configured the new Dropbox integration, disable Provisioning on the old Dropbox integration to avoid Provisioning conflicts. For more detailed steps on migrating to the new Dropbox integration, see [Update to the newest Dropbox for Business application using Azure AD](https://help.dropbox.com/installs-integrations/third-party/update-dropbox-azure-ad-connector).

> [!NOTE]
> This tutorial describes a connector built on top of the Azure AD User Provisioning Service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Azure Active Directory](../app-provisioning/user-provisioning.md).

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* An Azure AD tenant
* [A Dropbox for Business tenant](https://www.dropbox.com/business/pricing)
* A user account in Dropbox for Business with Admin permissions.

## Add Dropbox for Business from the gallery

Before configuring Dropbox for Business for automatic user provisioning with Azure AD, you need to add Dropbox for Business from the Azure AD application gallery to your list of managed SaaS applications.

**To add Dropbox for Business from the Azure AD application gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, in the left navigation panel, select **Azure Active Directory**.

	![The Azure Active Directory button](common/select-azuread.png)

2. Go to **Enterprise applications**, and then select **All applications**.

	![The Enterprise applications blade](common/enterprise-applications.png)

3. To add a new application, select the **New application** button at the top of the pane.

	![The New application button](common/add-new-app.png)

4. In the search box, enter **Dropbox for Business**, select **Dropbox for Business** in the results panel, and then click the **Add** button to add the application.

	![Dropbox for Business in the results list](common/search-new-app.png)

## Assigning users to Dropbox for Business

Azure Active Directory uses a concept called *assignments* to determine which users should receive access to selected apps. In the context of automatic user provisioning, only the users and/or groups that have been assigned to an application in Azure AD are synchronized.

Before configuring and enabling automatic user provisioning, you should decide which users and/or groups in Azure AD need access to Dropbox for Business. Once decided, you can assign these users and/or groups to Dropbox for Business by following the instructions here:

* [Assign a user or group to an enterprise app](../manage-apps/assign-user-or-group-access-portal.md)

### Important tips for assigning users to Dropbox for Business

* It is recommended that a single Azure AD user is assigned to Dropbox for Business to test the automatic user provisioning configuration. Additional users and/or groups may be assigned later.

* When assigning a user to Dropbox for Business, you must select any valid application-specific role (if available) in the assignment dialog. Users with the **Default Access** role are excluded from provisioning.

## Configuring automatic user provisioning to Dropbox for Business 

This section guides you through the steps to configure the Azure AD provisioning service to create, update, and disable users and/or groups in Dropbox for Business based on user and/or group assignments in Azure AD.

> [!TIP]
> You may also choose to enable SAML-based single sign-on for Dropbox for Business, following the instructions provided in the [Dropbox for Business single sign-on tutorial](dropboxforbusiness-tutorial.md). Single sign-on can be configured independently of automatic user provisioning, though these two features compliment each other.

### To configure automatic user provisioning for Dropbox for Business in Azure AD:

1. Sign in to the [Azure portal](https://portal.azure.com). Select **Enterprise Applications**, then select **All applications**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **Dropbox for Business**.

	![The Dropbox for Business link in the Applications list](common/all-applications.png)

3. Select the **Provisioning** tab.

	![Screenshot of the Manage options with the Provisioning option called out.](common/provisioning.png)

4. Set the **Provisioning Mode** to **Automatic**.

	![Screenshot of the Provisioning Mode dropdown list with the Automatic option called out.](common/provisioning-automatic.png)

5. Under the **Admin Credentials** section, click **Authorize**. It opens a Dropbox for Business login dialog in a new browser window.

	![Provisioning ](common/provisioning-oauth.png)

6. On the **Sign-in to Dropbox for Business to link with Azure AD** dialog, sign in to your Dropbox for Business tenant and verify your identity.

	![Dropbox for Business sign-in](media/dropboxforbusiness-provisioning-tutorial/dropbox01.png)

7. Upon completing steps 5 and 6, click **Test Connection** to ensure Azure AD can connect to Dropbox for Business. If the connection fails, ensure your Dropbox for Business account has Admin permissions and try again.

	![Token](common/provisioning-testconnection-oauth.png)

8. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and check the checkbox - **Send an email notification when a failure occurs**.

	![Notification Email](common/provisioning-notification-email.png)

9. Click **Save**.

10. Under the **Mappings** section, select **Synchronize Azure Active Directory Users to Dropbox**.

	![Dropbox User Mappings](media/dropboxforbusiness-provisioning-tutorial/dropbox-user-mapping.png)

11. Review the user attributes that are synchronized from Azure AD to Dropbox in the **Attribute Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in Dropbox for update operations. Select the **Save** button to commit any changes.

	![Dropbox User Attributes](media/dropboxforbusiness-provisioning-tutorial/dropbox-user-attributes.png)

12. Under the **Mappings** section, select **Synchronize Azure Active Directory Groups to Dropbox**.

	![Dropbox Group Mappings](media/dropboxforbusiness-provisioning-tutorial/dropbox-group-mapping.png)

13. Review the group attributes that are synchronized from Azure AD to Dropbox in the **Attribute Mapping** section. The attributes selected as **Matching** properties are used to match the groups in Dropbox for update operations. Select the **Save** button to commit any changes.

	![Dropbox Group Attributes](media/dropboxforbusiness-provisioning-tutorial/dropbox-group-attributes.png)

14. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

15. To enable the Azure AD provisioning service for Dropbox, change the **Provisioning Status** to **On** in the **Settings** section.

	![Provisioning Status Toggled On](common/provisioning-toggle-on.png)

16. Define the users and/or groups that you would like to provision to Dropbox by choosing the desired values in **Scope** in the **Settings** section.

	![Provisioning Scope](common/provisioning-scope.png)

17. When you are ready to provision, click **Save**.

	![Saving Provisioning Configuration](common/provisioning-configuration-save.png)

This operation starts the initial synchronization of all users and/or groups defined in **Scope** in the **Settings** section. The initial sync takes longer to perform than subsequent syncs, which occur approximately every 40 minutes as long as the Azure AD provisioning service is running. You can use the **Synchronization Details** section to monitor progress and follow links to provisioning activity report, which describes all actions performed by the Azure AD provisioning service on Dropbox.

For more information on how to read the Azure AD provisioning logs, see [Reporting on automatic user account provisioning](../app-provisioning/check-status-user-account-provisioning.md).

## Connector Limitations
 
* Dropbox does not support suspending invited users. If an invited user is  suspended, that user will be deleted.

## Additional resources

* [Managing user account provisioning for Enterprise Apps](../app-provisioning/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md)

