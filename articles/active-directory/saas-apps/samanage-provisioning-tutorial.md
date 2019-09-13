---
title: 'Tutorial: Configure Samanage for automatic user provisioning with Azure Active Directory | Microsoft Docs'
description: Learn how to configure Azure Active Directory to automatically provision and deprovision user accounts to Samanage.
services: active-directory
documentationcenter: ''
author: zchia
writer: zchia
manager: beatrizd-msft
ms.assetid: 62d0392f-37d4-436e-9aff-22f4e5b83623
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/28/2019
ms.author: "jeedes"
ms.collection: M365-identity-device-management
---

# Tutorial: Configure Samanage for automatic user provisioning

This tutorial demonstrates the steps to perform in Samanage and Azure Active Directory (Azure AD) to configure Azure AD to automatically provision and deprovision users and groups to Samanage.

> [!NOTE]
> This tutorial describes a connector that's built on top of the Azure AD user provisioning service. For information on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to software-as-a-service (SaaS) applications with Azure Active Directory](../manage-apps/user-provisioning.md).

## Prerequisites

The scenario outlined in this tutorial assumes that you have:

* An Azure AD tenant.
* A [Samanage tenant](https://www.samanage.com/pricing/) with the Professional package.
* A user account in Samanage with admin permissions.

> [!NOTE]
> The Azure AD provisioning integration relies on the [Samanage Rest API](https://www.samanage.com/api/). This API is available to Samanage developers for accounts with the Professional package.

## Add Samanage from the Azure Marketplace

Before you configure Samanage for automatic user provisioning with Azure AD, add Samanage from the Azure Marketplace to your list of managed SaaS applications.

To add Samanage from the Marketplace, follow these steps.

1. In the [Azure portal](https://portal.azure.com), in the navigation pane on the left, select **Azure Active Directory**.

	![The Azure Active Directory icon](common/select-azuread.png)

2. Go to **Enterprise applications**, and then select **All applications**.

	![The Enterprise applications blade](common/enterprise-applications.png)

3. To add a new application, select **New application** at the top of the dialog box.

	![The New application button](common/add-new-app.png)

4. In the search box, enter **Samanage** and select **Samanage** from the result panel. To add the application, select **Add**.

	![Samanage in the results list](common/search-new-app.png)

## Assign users to Samanage

Azure Active Directory uses a concept called *assignments* to determine which users should receive access to selected apps. In the context of automatic user provisioning, only the users or groups that were assigned to an application in Azure AD are synchronized.

Before you configure and enable automatic user provisioning, decide which users or groups in Azure AD need access to Samanage. To assign these users or groups to Samanage, follow the instructions in [Assign a user or group to an enterprise app](https://docs.microsoft.com/azure/active-directory/active-directory-coreapps-assign-user-azure-portal).

### Important tips for assigning users to Samanage

*    Today, Samanage roles are automatically and dynamically populated in the Azure portal UI. Before you assign Samanage roles to users, make sure that an initial sync is completed against Samanage to retrieve the latest roles in your Samanage tenant.

*    We recommend that you assign a single Azure AD user to Samanage to test your initial automatic user provisioning configuration. You can assign additional users and groups later after the tests are successful.

*	 When you assign a user to Samanage, select any valid application-specific role, if available, in the assignment dialog box. Users with the **Default Access** role are excluded from provisioning.

## Configure automatic user provisioning to Samanage

This section guides you through the steps to configure the Azure AD provisioning service. Use it to create, update, and disable users or groups in Samanage based on user or group assignments in Azure AD.

> [!TIP]
> You also can enable SAML-based single sign-on for Samanage. Follow the instructions in the [Samanage single sign-on tutorial](samanage-tutorial.md). Single sign-on can be configured independently of automatic user provisioning, although these two features complement each other.

### Configure automatic user provisioning for Samanage in Azure AD

1. Sign in to the [Azure portal](https://portal.azure.com). Select **Enterprise Applications** > **All applications** > **Samanage**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **Samanage**.

	![The Samanage link in the applications list](common/all-applications.png)

3. Select the **Provisioning** tab.

	![Samanage Provisioning](./media/samanage-provisioning-tutorial/ProvisioningTab.png)

4. Set the **Provisioning Mode** to **Automatic**.

	![Samanage Provisioning Mode](./media/samanage-provisioning-tutorial/ProvisioningCredentials.png)

5. Under the **Admin Credentials** section, enter the admin username and admin password of your Samanage account. Examples of these values are:

   * In the **Admin Username** box, fill in the username of the admin account on your Samanage tenant. An example is admin@contoso.com.

   * In the **Admin Password** box, fill in the password of the admin account that corresponds to the admin username.

6. After you fill in the boxes shown in Step 5, select **Test Connection** to make sure that Azure AD can connect to Samanage. If the connection fails, make sure that your Samanage account has admin permissions and try again.

	![Samanage Test Connection](./media/samanage-provisioning-tutorial/TestConnection.png)

7. In the **Notification Email** box, enter the email address of the person or group to receive the provisioning error notifications. Select the **Send an email notification when a failure occurs** check box.

	![Samanage Notification Email](./media/samanage-provisioning-tutorial/EmailNotification.png)

8. Select **Save**.

9. Under the **Mappings** section, select **Synchronize Azure Active Directory Users to Samanage**.

	![Samanage user synchronization](./media/samanage-provisioning-tutorial/UserMappings.png)

10. Review the user attributes that are synchronized from Azure AD to Samanage in the **Attribute Mappings** section. The attributes selected as **Matching** properties are used to match the user accounts in Samanage for update operations. To save any changes, select **Save**.

	![Samanage matching user attributes](./media/samanage-provisioning-tutorial/UserAttributeMapping.png)

11. To enable group mappings, under the **Mappings** section, select **Synchronize Azure Active Directory Groups to Samanage**.

	![Samanage group synchronization](./media/samanage-provisioning-tutorial/GroupMappings.png)

12. Set **Enabled** to **Yes** to synchronize groups. Review the group attributes that are synchronized from Azure AD to Samanage in the **Attribute Mappings** section. The attributes selected as **Matching** properties are used to match the user accounts in Samanage for update operations. To save any changes, select **Save**.

	![Samanage matching group attributes](./media/samanage-provisioning-tutorial/GroupAttributeMapping.png)

13. To configure scoping filters, follow the instructions in the [scoping filter tutorial](../manage-apps/define-conditional-rules-for-provisioning-user-accounts.md).

14. To enable the Azure AD provisioning service for Samanage, in the **Settings** section, change **Provisioning Status** to **On**.

	![Samanage Provisioning Status](./media/samanage-provisioning-tutorial/ProvisioningStatus.png)

15. Define the users or groups that you want to provision to Samanage. In the **Settings** section, select the values you want in **Scope**. When you select the **Sync all users and groups** option, consider the limitations as described in the following section "Connector limitations."

	![Samanage Scope](./media/samanage-provisioning-tutorial/ScopeSync.png)

16. When you're ready to provision, select **Save**.

	![Samanage Save](./media/samanage-provisioning-tutorial/SaveProvisioning.png)


This operation starts the initial synchronization of all users or groups defined in **Scope** in the **Settings** section. The initial sync takes longer to perform than later syncs. They occur approximately every 40 minutes as long as the Azure AD provisioning service runs. 

You can use the **Synchronization Details** section to monitor progress and follow links to the provisioning activity report. The report describes all the actions performed by the Azure AD provisioning service on Samanage.

For information on how to read the Azure AD provisioning logs, see [Reporting on automatic user account provisioning](../manage-apps/check-status-user-account-provisioning.md).

## Connector limitations

If you select the **Sync all users and groups** option and configure a value for the Samanage **roles** attribute, the value under the **Default value if null (is optional)** box must be expressed in the following format:

- {"displayName":"role"}, where role is the default value you want.

## Additional resources

* [Manage user account provisioning for enterprise apps](../manage-apps/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)


## Next steps

* [Learn how to review logs and get reports on provisioning activity](../manage-apps/check-status-user-account-provisioning.md)

<!--Image references-->
[1]: ./media/samanage-provisioning-tutorial/tutorial_general_01.png
[2]: ./media/samanage-provisioning-tutorial/tutorial_general_02.png
[3]: ./media/samanage-provisioning-tutorial/tutorial_general_03.png
