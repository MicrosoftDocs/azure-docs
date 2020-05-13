---
title: 'Tutorial: Configure Zendesk for automatic user provisioning with Azure Active Directory | Microsoft Docs'
description: Learn how to configure Azure Active Directory to automatically provision and deprovision user accounts to Zendesk.
services: active-directory
documentationcenter: ''
author: zhchia
writer: zhchia
manager: beatrizd-msft
ms.assetid: 01d5e4d5-d856-42c4-a504-96fa554baf66
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/06/2019
ms.author: "jeedes"
ms.collection: M365-identity-device-management
---

# Tutorial: Configure Zendesk for automatic user provisioning

This tutorial demonstrates the steps to perform in Zendesk and Azure Active Directory (Azure AD) to configure Azure AD to automatically provision and deprovision users and groups to Zendesk.

> [!NOTE]
> This tutorial describes a connector that's built on top of the Azure AD user provisioning service. For information on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to software-as-a-service (SaaS) applications with Azure Active Directory](../app-provisioning/user-provisioning.md).

## Prerequisites

The scenario outlined in this tutorial assumes that you have:

* An Azure AD tenant.
* A Zendesk tenant with the Professional plan or better enabled.
* A user account in Zendesk with admin permissions.

## Add Zendesk from the Azure Marketplace

Before you configure Zendesk for automatic user provisioning with Azure AD, add Zendesk from the Azure Marketplace to your list of managed SaaS applications.

To add Zendesk from the Marketplace, follow these steps.

1. In the [Azure portal](https://portal.azure.com), in the navigation pane on the left, select **Azure Active Directory**.

	![The Azure Active Directory icon](common/select-azuread.png)

2. Go to **Enterprise applications**, and then select **All applications**.

	![The Enterprise applications blade](common/enterprise-applications.png)

3. To add a new application, select **New application** at the top of the dialog box.

	![The New application button](common/add-new-app.png)

4. In the search box, enter **Zendesk** and select **Zendesk** from the result panel. To add the application, select **Add**.

	![Zendesk in the results list](common/search-new-app.png)

## Assign users to Zendesk

Azure Active Directory uses a concept called *assignments* to determine which users should receive access to selected apps. In the context of automatic user provisioning, only the users or groups that were assigned to an application in Azure AD are synchronized.

Before you configure and enable automatic user provisioning, decide which users or groups in Azure AD need access to Zendesk. To assign these users or groups to Zendesk, follow the instructions in [Assign a user or group to an enterprise app](../manage-apps/assign-user-or-group-access-portal.md).

### Important tips for assigning users to Zendesk

* Today, Zendesk roles are automatically and dynamically populated in the Azure portal UI. Before you assign Zendesk roles to users, make sure that an initial sync is completed against Zendesk to retrieve the latest roles in your Zendesk tenant.

* We recommend that you assign a single Azure AD user to Zendesk to test your initial automatic user provisioning configuration. You can assign additional users or groups later after the tests are successful.

* When you assign a user to Zendesk, select any valid application-specific role, if available, in the assignment dialog box. Users with the **Default Access** role are excluded from provisioning.

## Configure automatic user provisioning to Zendesk 

This section guides you through the steps to configure the Azure AD provisioning service. Use it to create, update, and disable users or groups in Zendesk based on user or group assignments in Azure AD.

> [!TIP]
> You also can enable SAML-based single sign-on for Zendesk. Follow the instructions in the [Zendesk single sign-on tutorial](zendesk-tutorial.md). Single sign-on can be configured independently of automatic user provisioning, although these two features complement each other.

### Configure automatic user provisioning for Zendesk in Azure AD

1. Sign in to the [Azure portal](https://portal.azure.com). Select **Enterprise applications** > **All applications** > **Zendesk**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **Zendesk**.

	![The Zendesk link in the applications list](common/all-applications.png)

3. Select the **Provisioning** tab.

	![Zendesk Provisioning](./media/zendesk-provisioning-tutorial/ZenDesk16.png)

4. Set the **Provisioning Mode** to **Automatic**.

	![Zendesk Provisioning Mode](./media/zendesk-provisioning-tutorial/ZenDesk1.png)

5. Under the **Admin Credentials** section, input the admin username, secret token, and domain of your Zendesk account. Examples of these values are:

   * In the **Admin Username** box, fill in the username of the admin account on your Zendesk tenant. An example is admin@contoso.com.

   * In the **Secret Token** box, fill in the secret token as described in Step 6.

   * In the **Domain** box, fill in the subdomain of your Zendesk tenant. For example, for an account with a tenant URL of `https://my-tenant.zendesk.com`, your subdomain is **my-tenant**.

6. The secret token for your Zendesk account is located in **Admin** > **API** > **Settings**. Make sure that **Token Access** is set to **Enabled**.

	![Zendesk admin settings](./media/zendesk-provisioning-tutorial/ZenDesk4.png)

	![Zendesk secret token](./media/zendesk-provisioning-tutorial/ZenDesk2.png)

7. After you fill in the boxes shown in Step 5, select **Test Connection** to make sure that Azure AD can connect to Zendesk. If the connection fails, make sure your Zendesk account has admin permissions and try again.

	![Zendesk Test Connection](./media/zendesk-provisioning-tutorial/ZenDesk19.png)

8. In the **Notification Email** box, enter the email address of the person or group to receive the provisioning error notifications. Select the **Send an email notification when a failure occurs** check box.

	![Zendesk Notification Email](./media/zendesk-provisioning-tutorial/ZenDesk9.png)

9. Select **Save**.

10. Under the **Mappings** section, select **Synchronize Azure Active Directory Users to Zendesk**.

	![Zendesk user synchronization](./media/zendesk-provisioning-tutorial/ZenDesk10.png)

11. Review the user attributes that are synchronized from Azure AD to Zendesk in the **Attribute Mappings** section. The attributes selected as **Matching** properties are used to match the user accounts in Zendesk for update operations. To save any changes, select **Save**.

	![Zendesk matching user attributes](./media/zendesk-provisioning-tutorial/ZenDesk11.png)

12. Under the **Mappings** section, select **Synchronize Azure Active Directory Groups to Zendesk**.

	![Zendesk group synchronization](./media/zendesk-provisioning-tutorial/ZenDesk12.png)

13. Review the group attributes that are synchronized from Azure AD to Zendesk in the **Attribute Mappings** section. The attributes selected as **Matching** properties are used to match the groups in Zendesk for update operations. To save any changes, select **Save**.

	![Zendesk matching group attributes](./media/zendesk-provisioning-tutorial/ZenDesk13.png)

14. To configure scoping filters, follow the instructions in the [scoping filter tutorial](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

15. To enable the Azure AD provisioning service for Zendesk, in the **Settings** section, change **Provisioning Status** to **On**.

	![Zendesk Provisioning Status](./media/zendesk-provisioning-tutorial/ZenDesk14.png)

16. Define the users or groups that you want to provision to Zendesk. In the **Settings** section, select the values you want in **Scope**.

	![Zendesk Scope](./media/zendesk-provisioning-tutorial/ZenDesk15.png)

17. When you're ready to provision, select **Save**.

	![Zendesk Save](./media/zendesk-provisioning-tutorial/ZenDesk18.png)

This operation starts the initial synchronization of all users or groups defined in **Scope** in the **Settings** section. The initial sync takes longer to perform than later syncs. They occur approximately every 40 minutes as long as the Azure AD provisioning service runs. 

You can use the **Synchronization Details** section to monitor progress and follow links to the provisioning activity report. The report describes all the actions performed by the Azure AD provisioning service on Zendesk.

For information on how to read the Azure AD provisioning logs, see [Reporting on automatic user account provisioning](../app-provisioning/check-status-user-account-provisioning.md).

## Connector limitations

* Zendesk supports the use of groups for users with **Agent** roles only. For more information, see the [Zendesk documentation](https://support.zendesk.com/hc/en-us/articles/203661966-Creating-managing-and-using-groups).

* When a custom role is assigned to a user or group, the Azure AD automatic user provisioning service also assigns the default role **Agent**. Only Agents can be assigned a custom role. For more information, see the [Zendesk API documentation](https://developer.zendesk.com/rest_api/docs/support/users#json-format-for-agent-or-admin-requests). 

## Additional resources

* [Manage user account provisioning for enterprise apps](../app-provisioning/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md)

<!--Image references-->
[1]: ./media/zendesk-tutorial/tutorial_general_01.png
[2]: ./media/zendesk-tutorial/tutorial_general_02.png
[3]: ./media/zendesk-tutorial/tutorial_general_03.png
