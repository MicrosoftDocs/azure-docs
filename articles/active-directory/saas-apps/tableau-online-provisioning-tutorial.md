---
title: 'Tutorial: Configure Tableau Online for automatic user provisioning with Azure Active Directory | Microsoft Docs'
description: Learn how to configure Azure Active Directory to automatically provision and deprovision user accounts to Tableau Online.
services: active-directory
documentationcenter: ''
author: zchia
writer: zchia
manager: beatrizd-msft
ms.assetid: 0be9c435-f9a1-484d-8059-e578d5797d8e
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/27/2019
ms.author: "jeedes"
ms.collection: M365-identity-device-management
---

# Tutorial: Configure Tableau Online for automatic user provisioning

This tutorial demonstrates the steps to perform in Tableau Online and Azure Active Directory (Azure AD) to configure Azure AD to automatically provision and deprovision users and groups to Tableau Online.

> [!NOTE]
> This tutorial describes a connector that's built on top of the Azure AD user provisioning service. For information on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to software-as-a-service (SaaS) applications with Azure Active Directory](../manage-apps/user-provisioning.md).

## Prerequisites

The scenario outlined in this tutorial assumes that you have:

*   An Azure AD tenant.
*   A [Tableau Online tenant](https://www.tableau.com/).
*   A user account in Tableau Online with admin permissions.

> [!NOTE]
> The Azure AD provisioning integration relies on the [Tableau Online Rest API](https://onlinehelp.tableau.com/current/api/rest_api/en-us/help.htm). This API is available to Tableau Online developers.

## Add Tableau Online from the Azure Marketplace
Before you configure Tableau Online for automatic user provisioning with Azure AD, add Tableau Online from the Azure Marketplace to your list of managed SaaS applications.

To add Tableau Online from the Marketplace, follow these steps.

1. In the [Azure portal](https://portal.azure.com), in the navigation pane on the left, select **Azure Active Directory**.

	![The Azure Active Directory icon](common/select-azuread.png)

2. Go to **Enterprise applications**, and then select **All applications**.

	![The Enterprise applications blade](common/enterprise-applications.png)

3. To add a new application, select **New application** at the top of the dialog box.

	![The New application button](common/add-new-app.png)

4. In the search box, enter **Tableau Online** and select **Tableau Online** from the result panel. To add the application, select **Add**.

	![Tableau Online in the results list](common/search-new-app.png)

## Assign users to Tableau Online

Azure Active Directory uses a concept called *assignments* to determine which users should receive access to selected apps. In the context of automatic user provisioning, only the users or groups that were assigned to an application in Azure AD are synchronized.

Before you configure and enable automatic user provisioning, decide which users or groups in Azure AD need access to Tableau Online. To assign these users or groups to Tableau Online, follow the instructions in [Assign a user or group to an enterprise app](https://docs.microsoft.com/azure/active-directory/active-directory-coreapps-assign-user-azure-portal).

### Important tips for assigning users to Tableau Online

*	We recommend that you assign a single Azure AD user to Tableau Online to test the automatic user provisioning configuration. You can assign additional users or groups later.

*	When you assign a user to Tableau Online, select any valid application-specific role, if available, in the assignment dialog box. Users with the **Default Access** role are excluded from provisioning.

## Configure automatic user provisioning to Tableau Online

This section guides you through the steps to configure the Azure AD provisioning service. Use it to create, update, and disable users or groups in Tableau Online based on user or group assignments in Azure AD.

> [!TIP]
> You also can enable SAML-based single sign-on for Tableau Online. Follow the instructions in the [Tableau Online single sign-on tutorial](tableauonline-tutorial.md). Single sign-on can be configured independently of automatic user provisioning, although these two features complement each other.

### Configure automatic user provisioning for Tableau Online in Azure AD

1. Sign in to the [Azure portal](https://portal.azure.com). Select **Enterprise applications** > **All applications** > **Tableau Online**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **Tableau Online**.

	![The Tableau Online link in the applications list](common/all-applications.png)

3. Select the **Provisioning** tab.

	![Tableau Online Provisioning](./media/tableau-online-provisioning-tutorial/ProvisioningTab.png)

4. Set the **Provisioning Mode** to **Automatic**.

	![Tableau Online Provisioning Mode](./media/tableau-online-provisioning-tutorial/ProvisioningCredentials.png)

5. Under the **Admin Credentials** section, input the domain, admin username, admin password, and content URL of your Tableau Online account:

   * In the **Domain** box, fill in the subdomain based on Step 6.

   * In the **Admin Username** box, fill in the username of the admin account on your Clarizen Tenant. An example is admin@contoso.com.

   * In the **Admin Password** box, fill in the password of the admin account that corresponds to the admin username.

   * In the **Content URL** box, fill in the subdomain based on Step 6.

6. After you sign in to your administrative account for Tableau Online, you can get the values for **Domain** and **Content URL** from the URL of the admin page.

	* The **Domain** for your Tableau Online account can be copied from this part of the URL:

		![Tableau Online Domain](./media/tableau-online-provisioning-tutorial/DomainUrlPart.png)

	* The **Content URL** for your Tableau Online account can be copied from this section. It's a value that's defined during account setup. In this example, the value is "contoso":

		![Tableau Online Content URL](./media/tableau-online-provisioning-tutorial/ContentUrlPart.png)

		> [!NOTE]
		> Your **Domain** might be different from the one shown here.

7. After you fill in the boxes shown in Step 5, select **Test Connection** to make sure that Azure AD can connect to Tableau Online. If the connection fails, make sure your Tableau Online account has admin permissions and try again.

	![Tableau Online Test Connection](./media/tableau-online-provisioning-tutorial/TestConnection.png)

8. In the **Notification Email** box, enter the email address of the person or group to receive the provisioning error notifications. Select the **Send an email notification when a failure occurs** check box.

	![Tableau Online Notification Email](./media/tableau-online-provisioning-tutorial/EmailNotification.png)

9. Select **Save**.

10. Under the **Mappings** section, select **Synchronize Azure Active Directory Users to Tableau**.

	![Tableau Online user synchronization](./media/tableau-online-provisioning-tutorial/UserMappings.png)

11. Review the user attributes that are synchronized from Azure AD to Tableau Online in the **Attribute Mappings** section. The attributes selected as **Matching** properties are used to match the user accounts in Tableau Online for update operations. To save any changes, select **Save**.

	![Tableau Online matching user attributes](./media/tableau-online-provisioning-tutorial/UserAttributeMapping.png)

12. Under the **Mappings** section, select **Synchronize Azure Active Directory Groups to Tableau**.

	![Tableau Online group synchronization](./media/tableau-online-provisioning-tutorial/GroupMappings.png)

13.	Review the group attributes that are synchronized from Azure AD to Tableau Online in the **Attribute Mappings** section. The attributes selected as **Matching** properties are used to match the user accounts in Tableau Online for update operations. To save any changes, select **Save**.

	![Tableau Online matching group attributes](./media/tableau-online-provisioning-tutorial/GroupAttributeMapping.png)

14. To configure scoping filters, follow the instructions in the [scoping filter tutorial](../manage-apps/define-conditional-rules-for-provisioning-user-accounts.md).

15. To enable the Azure AD provisioning service for Tableau Online, in the **Settings** section, change **Provisioning Status** to **On**.

	![Tableau Online Provisioning Status](./media/tableau-online-provisioning-tutorial/ProvisioningStatus.png)

16. Define the users or groups that you want to provision to Tableau Online. In the **Settings** section, select the values you want in **Scope**.

	![Tableau Online Scope](./media/tableau-online-provisioning-tutorial/ScopeSync.png)

17. When you're ready to provision, select **Save**.

	![Tableau Online Save](./media/tableau-online-provisioning-tutorial/SaveProvisioning.png)

This operation starts the initial synchronization of all users or groups defined in **Scope** in the **Settings** section. The initial sync takes longer to perform than later syncs. They occur approximately every 40 minutes as long as the Azure AD provisioning service runs. 

You can use the **Synchronization Details** section to monitor progress and follow links to the provisioning activity report. The report describes all the actions performed by the Azure AD provisioning service on Tableau Online.

For information on how to read the Azure AD provisioning logs, see [Reporting on automatic user account provisioning](../manage-apps/check-status-user-account-provisioning.md).

## Additional resources

* [Manage user account provisioning for enterprise apps](../manage-apps/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../manage-apps/check-status-user-account-provisioning.md)

<!--Image references-->
[1]: ./media/tableau-online-provisioning-tutorial/tutorial_general_01.png
[2]: ./media/tableau-online-provisioning-tutorial/tutorial_general_02.png
[3]: ./media/tableau-online-provisioning-tutorial/tutorial_general_03.png
