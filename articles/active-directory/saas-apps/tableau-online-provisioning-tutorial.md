---
title: 'Tutorial: Configure Tableau Online for automatic user provisioning with Azure Active Directory | Microsoft Docs'
description: Learn how to configure Azure Active Directory to automatically provision and de-provision user accounts to Tableau Online.
services: active-directory
documentationcenter: ''
author: zchia
writer: zchia
manager: beatrizd-msft

ms.assetid: na
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/30/2018
ms.author: v-wingf-msft
---

# Tutorial: Configure Tableau Online for automatic user provisioning

The objective of this tutorial is to demonstrate the steps to be performed in Tableau Online and Azure Active Directory (Azure AD) to configure Azure AD to automatically provision and de-provision users and/or groups to Tableau Online.

> [!NOTE]
> This tutorial describes a connector built on top of the Azure AD User Provisioning Service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Azure Active Directory](../manage-apps/user-provisioning.md).

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following:

*   An Azure AD tenant
*   A [Tableau Online tenant](https://www.tableau.com/)
*   A user account in Tableau Online with Admin permissions

> [!NOTE]
> The Azure AD provisioning integration relies on the [Tableau Online Rest API](https://onlinehelp.tableau.com/current/api/rest_api/en-us/help.htm), which is available to Tableau Online developers.

## Adding Tableau Online from the gallery
Before configuring Tableau Online for automatic user provisioning with Azure AD, you need to add Tableau Online from the Azure AD application gallery to your list of managed SaaS applications.

**To add Tableau Online from the Azure AD application gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click on the **Azure Active Directory** icon.

	![The Azure Active Directory button][1]

2. Navigate to **Enterprise applications** > **All applications**.

	![The Enterprise applications Section][2]

3. To add Tableau Online, click the **New application** button on the top of the dialog.

	![The New application button][3]

4. In the search box, type **Tableau Online**.

	![Tableau Online Provisioning](./media/tableau-online-provisioning-tutorial/AppSearch.png)

5. In the results panel, select **Tableau Online**, and then click the **Add** button to add Tableau Online to your list of SaaS applications.

	![Tableau Online Provisioning](./media/tableau-online-provisioning-tutorial/AppSearchResults.png)

	![Tableau Online Provisioning](./media/tableau-online-provisioning-tutorial/AppCreation.png)

## Assigning users to Tableau Online

Azure Active Directory uses a concept called "assignments" to determine which users should receive access to selected apps. In the context of automatic user provisioning, only the users and/or groups that have been "assigned" to an application in Azure AD are synchronized.

Before configuring and enabling automatic user provisioning, you should decide which users and/or groups in Azure AD need access to Tableau Online. Once decided, you can assign these users and/or groups to Tableau Online by following the instructions here:

*   [Assign a user or group to an enterprise app](https://docs.microsoft.com/azure/active-directory/active-directory-coreapps-assign-user-azure-portal)

### Important tips for assigning users to Tableau Online

*	It is recommended that a single Azure AD user is assigned to Tableau Online to test the automatic user provisioning configuration. Additional users and/or groups may be assigned later.

*	When assigning a user to Tableau Online, you must select any valid application-specific role (if available) in the assignment dialog. Users with the **Default Access** role are excluded from provisioning.

## Configuring automatic user provisioning to Tableau Online

This section guides you through the steps to configure the Azure AD provisioning service to create, update, and disable users and/or groups in Tableau Online based on user and/or group assignments in Azure AD.

> [!TIP]
> You may also choose to enable SAML-based single sign-on for Tableau Online, following the instructions provided in the [Tableau Online single sign-on tutorial](tableauonline-tutorial.md). Single sign-on can be configured independently of automatic user provisioning, though these two features compliment each other.

### To configure automatic user provisioning for Tableau Online in Azure AD:

1. Sign in to the [Azure portal](https://portal.azure.com) and browse to **Azure Active Directory > Enterprise applications > All applications**.

2. Select Tableau Online from your list of SaaS applications.

	![Tableau Online Provisioning](./media/tableau-online-provisioning-tutorial/AppInstanceSearch.png)

3. Select the **Provisioning** tab.

	![Tableau Online Provisioning](./media/tableau-online-provisioning-tutorial/ProvisioningTab.png)

4. Set the **Provisioning Mode** to **Automatic**.

	![Tableau Online Provisioning](./media/tableau-online-provisioning-tutorial/ProvisioningCredentials.png)

5. Under the **Admin Credentials** section, input the **Domain**, **Admin Username**, **Admin Password**, and **Content URL** of your Tableau Online account:

	*   In the **Domain** field, populate subdomain based on Step 6.

	*   In the **Admin Username** field, populate the username of the admin account on your Clarizen Tenant. Example: admin@contoso.com.

	*   In the **Admin Password** field, populate the password of the admin account corresponding to the admin username.

	*   In the **Content URL** field, populate subdomain based on Step 6.

6. After logging in to your administrative account for Tableau Online, the values for **Domain** and **Content URL** can be extracted from the URL of the Admin page.

	*	The **Domain** for your Tableau Online account can be copied from this part of the URL:	
	![Tableau Online Provisioning](./media/tableau-online-provisioning-tutorial/DomainUrlPart.png)

	*	The **Content URL** for your Tableau Online account can be copied from this section, and is a value defined during account set-up. In this example, the value is "contoso":	
	![Tableau Online Provisioning](./media/tableau-online-provisioning-tutorial/ContentUrlPart.png)

		> [!NOTE]
		> Your **Domain** may be different from the one shown here. 


7. Upon populating the fields shown in Step 5, click **Test Connection** to ensure Azure AD can connect to Tableau Online. If the connection fails, ensure your Tableau Online account has Admin permissions and try again.

	![Tableau Online Provisioning](./media/tableau-online-provisioning-tutorial/TestConnection.png)

8. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and check the checkbox **Send an email notification when a failure occurs**.

	![Tableau Online Provisioning](./media/tableau-online-provisioning-tutorial/EmailNotification.png)

10. Click **Save**.

11. Under the **Mappings** section, select **Synchronize Azure Active Directory Users to Tableau**.

	![Tableau Online Provisioning](./media/tableau-online-provisioning-tutorial/UserMappings.png)

12. Review the user attributes that are synchronized from Azure AD to Tableau Online in the **Attribute Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in Tableau Online for update operations. Select the **Save** button to commit any changes.

	![Tableau Online Provisioning](./media/tableau-online-provisioning-tutorial/UserAttributeMapping.png)

13. Under the **Mappings** section, select **Synchronize Azure Active Directory Groups to Tableau**.

	![Tableau Online Provisioning](./media/tableau-online-provisioning-tutorial/GroupMappings.png)

14.	Review the group attributes that are synchronized from Azure AD to Tableau Online in the **Attribute Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in Tableau Online for update operations. Select the **Save** button to commit any changes.

	![Tableau Online Provisioning](./media/tableau-online-provisioning-tutorial/GroupAttributeMapping.png)

15. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](../manage-apps/define-conditional-rules-for-provisioning-user-accounts.md).

16. To enable the Azure AD provisioning service for Tableau Online, change the **Provisioning Status** to **On** in the **Settings** section.

	![Tableau Online Provisioning](./media/tableau-online-provisioning-tutorial/ProvisioningStatus.png)

17. Define the users and/or groups that you would like to provision to Tableau Online by choosing the desired values in **Scope** in the **Settings** section.

	![Tableau Online Provisioning](./media/tableau-online-provisioning-tutorial/ScopeSync.png)

18. When you are ready to provision, click **Save**.

	![Tableau Online Provisioning](./media/tableau-online-provisioning-tutorial/SaveProvisioning.png)

This operation starts the initial synchronization of all users and/or groups defined in **Scope** in the **Settings** section. The initial sync takes longer to perform than subsequent syncs, which occur approximately every 40 minutes as long as the Azure AD provisioning service is running. You can use the **Synchronization Details** section to monitor progress and follow links to provisioning activity report, which describes all actions performed by the Azure AD provisioning service on Tableau Online.

For more information on how to read the Azure AD provisioning logs, see [Reporting on automatic user account provisioning](../manage-apps/check-status-user-account-provisioning.md).

## Additional resources

* [Managing user account provisioning for Enterprise Apps](../manage-apps/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)


## Next steps

* [Learn how to review logs and get reports on provisioning activity](../manage-apps/check-status-user-account-provisioning.md)

<!--Image references-->
[1]: ./media/tableau-online-provisioning-tutorial/tutorial_general_01.png
[2]: ./media/tableau-online-provisioning-tutorial/tutorial_general_02.png
[3]: ./media/tableau-online-provisioning-tutorial/tutorial_general_03.png
