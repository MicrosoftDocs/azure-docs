---
title: 'Tutorial: Configure Zscaler for automatic user provisioning with Azure Active Directory | Microsoft Docs'
description: Learn how to configure Azure Active Directory to automatically provision and de-provision user accounts to Zscaler.
services: active-directory
documentationcenter: ''
author: zchia
writer: zchia
manager: beatrizd-msft
ms.assetid: 31f67481-360d-4471-88c9-1cc9bdafee24
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/27/2019
ms.author: "jeedes"
---

# Tutorial: Configure Zscaler for automatic user provisioning

The objective of this tutorial is to demonstrate the steps to be performed in Zscaler and Azure Active Directory (Azure AD) to configure Azure AD to automatically provision and de-provision users and/or groups to Zscaler.

> [!NOTE]
> This tutorial describes a connector built on top of the Azure AD User Provisioning Service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Azure Active Directory](../active-directory-saas-app-provisioning.md).
>

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following:

* An Azure AD tenant.
* A Zscaler tenant.
* A user account in Zscaler with Admin permissions.

> [!NOTE]
> The Azure AD provisioning integration relies on the Zscaler SCIM API, which is available to Zscaler developers for accounts with the Enterprise package.

## Adding Zscaler from the gallery

Before configuring Zscaler for automatic user provisioning with Azure AD, you need to add Zscaler from the Azure AD application gallery to your list of managed SaaS applications.

**To add Zscaler from the Azure AD application gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon.

	![The Azure Active Directory button](common/select-azuread.png)

2. Navigate to **Enterprise Applications** and then select the **All Applications** option.

	![The Enterprise applications blade](common/enterprise-applications.png)

3. To add new application, click **New application** button on the top of dialog.

	![The New application button](common/add-new-app.png)

4. In the search box, type **Zscaler**, select **Zscaler** from result panel then click **Add** button to add the application.

	![Zscaler in the results list](common/search-new-app.png)

## Assigning users to Zscaler

Azure Active Directory uses a concept called "assignments" to determine which users should receive access to selected apps. In the context of automatic user provisioning, only the users and/or groups that have been "assigned" to an application in Azure AD are synchronized.

Before configuring and enabling automatic user provisioning, you should decide which users and/or groups in Azure AD need access to Zscaler. Once decided, you can assign these users and/or groups to Zscaler by following the instructions here:

* [Assign a user or group to an enterprise app](https://docs.microsoft.com/azure/active-directory/active-directory-coreapps-assign-user-azure-portal)

### Important tips for assigning users to Zscaler

* It is recommended that a single Azure AD user is assigned to Zscaler to test the automatic user provisioning configuration. Additional users and/or groups may be assigned later.

* When assigning a user to Zscaler, you must select any valid application-specific role (if available) in the assignment dialog. Users with the **Default Access** role are excluded from provisioning.

## Configuring automatic user provisioning to Zscaler

This section guides you through the steps to configure the Azure AD provisioning service to create, update, and disable users and/or groups in Zscaler based on user and/or group assignments in Azure AD.

> [!TIP]
> You may also choose to enable SAML-based single sign-on for Zscaler, following the instructions provided in the [Zscaler single sign-on tutorial](zscaler-tutorial.md). Single sign-on can be configured independently of automatic user provisioning, though these two features compliment each other.

### To configure automatic user provisioning for Zscaler in Azure AD:

1. Sign in to the [Azure portal](https://portal.azure.com) and select **Enterprise Applications**, select **All applications**, then select **Zscaler**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **Zscaler**.

	![The Zscaler link in the Applications list](common/all-applications.png)

3. Select the **Provisioning** tab.

	![Zscaler Provisioning](./media/zscaler-provisioning-tutorial/provisioning-tab.png)

4. Set the **Provisioning Mode** to **Automatic**.

	![Zscaler Provisioning](./media/zscaler-provisioning-tutorial/provisioning-credentials.png)

5. Under the **Admin Credentials** section, input the **Tenant URL** and **Secret Token** of your Zscaler account as described in Step 6.

6. To obtain the **Tenant URL** and **Secret Token**, navigate to **Administration > Authentication Settings** in the Zscaler portal user interface and click on **SAML** under **Authentication Type**.

	![Zscaler Provisioning](./media/zscaler-provisioning-tutorial/secret-token-1.png)

	Click on **Configure SAML** to open **Configuration SAML** options.

	![Zscaler Provisioning](./media/zscaler-provisioning-tutorial/secret-token-2.png)

	Select **Enable SCIM-Based Provisioning** to retrieve **Base URL** and **Bearer Token**, then save the settings. Copy the **Base URL** to **Tenant URL**, and **Bearer Token**  to **Secret Token** in the Azure portal.

7. Upon populating the fields shown in Step 5, click **Test Connection** to ensure Azure AD can connect to Zscaler. If the connection fails, ensure your Zscaler account has Admin permissions and try again.

	![Zscaler Provisioning](./media/zscaler-provisioning-tutorial/test-connection.png)

8. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and check the checkbox **Send an email notification when a failure occurs**.

	![Zscaler Provisioning](./media/zscaler-provisioning-tutorial/notification.png)

9. Click **Save**.

10. Under the **Mappings** section, select **Synchronize Azure Active Directory Users to Zscaler**.

	![Zscaler Provisioning](./media/zscaler-provisioning-tutorial/user-mappings.png)

11. Review the user attributes that are synchronized from Azure AD to Zscaler in the **Attribute Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in Zscaler for update operations. Select the **Save** button to commit any changes.

	![Zscaler Provisioning](./media/zscaler-provisioning-tutorial/user-attribute-mappings.png)

12. Under the **Mappings** section, select **Synchronize Azure Active Directory Groups to Zscaler**.

	![Zscaler Provisioning](./media/zscaler-provisioning-tutorial/group-mappings.png)

13. Review the group attributes that are synchronized from Azure AD to Zscaler in the **Attribute Mapping** section. The attributes selected as **Matching** properties are used to match the groups in Zscaler for update operations. Select the **Save** button to commit any changes.

	![Zscaler Provisioning](./media/zscaler-provisioning-tutorial/group-attribute-mappings.png)

14. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](./../active-directory-saas-scoping-filters.md).

15. To enable the Azure AD provisioning service for Zscaler, change the **Provisioning Status** to **On** in the **Settings** section.

	![Zscaler Provisioning](./media/zscaler-provisioning-tutorial/provisioning-status.png)

16. Define the users and/or groups that you would like to provision to Zscaler by choosing the desired values in **Scope** in the **Settings** section.

	![Zscaler Provisioning](./media/zscaler-provisioning-tutorial/scoping.png)

17. When you are ready to provision, click **Save**.

	![Zscaler Provisioning](./media/zscaler-provisioning-tutorial/save-provisioning.png)

This operation starts the initial synchronization of all users and/or groups defined in **Scope** in the **Settings** section. The initial sync takes longer to perform than subsequent syncs, which occur approximately every 40 minutes as long as the Azure AD provisioning service is running. You can use the **Synchronization Details** section to monitor progress and follow links to provisioning activity report, which describes all actions performed by the Azure AD provisioning service on Zscaler.

For more information on how to read the Azure AD provisioning logs, see [Reporting on automatic user account provisioning](../active-directory-saas-provisioning-reporting.md).

## Additional resources

* [Managing user account provisioning for Enterprise Apps](../app-provisioning/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../active-directory-saas-provisioning-reporting.md)

<!--Image references-->
[1]: ./media/zscaler-provisioning-tutorial/tutorial-general-01.png
[2]: ./media/zscaler-provisioning-tutorial/tutorial-general-02.png
[3]: ./media/zscaler-provisioning-tutorial/tutorial-general-03.png
