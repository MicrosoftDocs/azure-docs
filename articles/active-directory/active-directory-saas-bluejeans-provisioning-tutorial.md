---
title: 'Tutorial: Configure Bluejeans for automatic user provisioning with Azure Active Directory | Microsoft Docs'
description: Learn how to configure Azure Active Directory to automatically provision and de-provision user accounts to Bluejeans.
services: active-directory
documentationcenter: ''
author: zhchia-msft
writer: zhchia-msft
manager: beatrizd-msft

ms.assetid: d4ca2365-6729-48f7-bb7f-c0f5ffe740a3
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/01/2018
ms.author: v-ant-msft

---

# Tutorial: Configure Bluejeans for automatic user provisioning

The objective of this tutorial is to demonstrate the steps to be performed in Bluejeans and Azure Active Directory (Azure AD) to configure Azure AD to automatically provision and de-provision users and/or groups to Bluejeans.

> [!NOTE]
> This tutorial describes a connector built on top of the Azure AD User Provisioning Service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Azure Active Directory](./active-directory-saas-app-provisioning.md).

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following:

*   An Azure AD tenant
*   A Bluejeans tenant with the [My Company](https://www.Bluejeans.com/pricing) plan or better enabled
*   A user account in Bluejeans with Admin permissions

> [!NOTE]
> TThe Azure AD provisioning integration relies on the [Bluejeans API](https://Bluejeans.github.io/developer), which is available to Bluejeans teams on the Standard plan or better.

## Adding Bluejeans from the gallery
Before configuring Bluejeans for automatic user provisioning with Azure AD, you need to add Bluejeans from the Azure AD application gallery to your list of managed SaaS applications.

**To add Bluejeans from the Azure AD application gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click on the **Azure Active Directory** icon. 

	![The Azure Active Directory button][1]

2. Navigate to **Enterprise applications** > **All applications**.

	![The Enterprise applications Section][2]
	
3. To add Bluejeans, click the **New application** button on the top of the dialog.

	![The New application button][3]

4. In the search box, type **Bluejeans**.

	![Bluejeans Provisioning](./media/active-directory-saas-bluejeans-provisioning-tutorial/BluejeansAppSearch.png)

5. In the results panel, select **Bluejeans**, and then click the **Add** button to add Bluejeans to your list of SaaS applications.

	![Bluejeans Provisioning](./media/active-directory-saas-bluejeans-provisioning-tutorial/BluejeansAppSearchResults.png)

	![Bluejeans Provisioning](./media/active-directory-saas-bluejeans-provisioning-tutorial/BluejeansAppCreate.png)
	
## Assigning users to Bluejeans

Azure Active Directory uses a concept called "assignments" to determine which users should receive access to selected apps. In the context of automatic user provisioning, only the users and/or groups that have been "assigned" to an application in Azure AD are synchronized.

Before configuring and enabling automatic user provisioning, you should decide which users and/or groups in Azure AD need access to Bluejeans. Once decided, you can assign these users and/or groups to Bluejeans by following the instructions here:

*   [Assign a user or group to an enterprise app](active-directory-coreapps-assign-user-azure-portal.md)

### Important tips for assigning users to Bluejeans

*	It is recommended that a single Azure AD user is assigned to Bluejeans to test the automatic user provisioning configuration. Additional users and/or groups may be assigned later.

*	When assigning a user to Bluejeans, you must select any valid application-specific role (if available) in the assignment dialog. Users with the **Default Access** role are excluded from provisioning.

## Configuring automatic user provisioning to Bluejeans

This section guides you through the steps to configure the Azure AD provisioning service to create, update, and disable users and/or groups in Bluejeans based on user and/or group assignments in Azure AD.

> [!TIP]
> You may also choose to enable SAML-based single sign-on for Bluejeans, following the instructions provided in the [Bluejeans single sign-on tutorial](active-directory-saas-bluejeans-tutorial.md). Single sign-on can be configured independently of automatic user provisioning, though these two features compliment each other.

### To configure automatic user provisioning for Bluejeans in Azure AD:

1. Sign in to the [Azure portal](https://portal.azure.com) and browse to **Azure Active Directory > Enterprise applications > All applications**.

2. Select Bluejeans from your list of SaaS applications.
 
	![Bluejeans Provisioning](./media/active-directory-saas-bluejeans-provisioning-tutorial/Bluejeans2.png)

3. Select the **Provisioning** tab.

	![Bluejeans Provisioning](./media/active-directory-saas-bluejeans-provisioning-tutorial/BluejeansProvisioningTab.png)

4. Set the **Provisioning Mode** to **Automatic**.

	![Bluejeans Provisioning](./media/active-directory-saas-bluejeans-provisioning-tutorial/Bluejeans1.png)

5. Under the **Admin Credentials** section, input the **Admin Username**, and **Admin Password** of your Bluejeans's account. Examples of these values are:

	*   In the **Admin Username** field, populate the username of the admin account on your Bluejeans Tenant. Example: admin@contoso.com.

	*   In the **Admin Password** field, populate the password corresponding to the admin username.

6. Upon populating the fields shown in Step 5, click **Test Connection** to ensure Azure AD can connect to Bluejeans. If the connection fails, ensure your Bluejeans account has Admin permissions and try again.

	![Bluejeans Provisioning](./media/active-directory-saas-bluejeans-provisioning-tutorial/BluejeansTestConnection.png)

7. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and check the checkbox **Send an email notification when a failure occurs**.

	![Bluejeans Provisioning](./media/active-directory-saas-bluejeans-provisioning-tutorial/BluejeansNotificationEmail.png)

8. Click **Save**. 

9. Under the **Mappings** section, select **Synchronize Azure Active Directory Users to Bluejeans**.

10. Under the **Mappings** section, select **Synchronize Azure Active Directory Users to Bluejeans**.

	![Bluejeans Provisioning](./media/active-directory-saas-bluejeans-provisioning-tutorial/BluejeansMapping.png)

11. Review the user attributes that are synchronized from Azure AD to Bluejeans in the **Attribute Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in Bluejeans for update operations. Select the **Save** button to commit any changes.

	![Bluejeans Provisioning](./media/active-directory-saas-Bluejeans-provisioning-tutorial/BluejeansUserMappingAtrributes.png)

12. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](./active-directory-saas-scoping-filters).

13. To enable the Azure AD provisioning service for Bluejeans, change the **Provisioning Status** to **On** in the **Settings** section.

	![Bluejeans Provisioning](./media/active-directory-saas-bluejeans-provisioning-tutorial/BluejeansProvisioningStatus.png)

14. Define the users and/or groups that you would like to provision to Bluejeans by choosing the desired values in **Scope** in the **Settings** section.

	![Bluejeans Provisioning](./media/active-directory-saas-bluejeans-provisioning-tutorial/UserGroupSelection.png)

15. When you are ready to provision, click **Save**.

	![Bluejeans Provisioning](./media/active-directory-saas-bluejeans-provisioning-tutorial/SaveProvisioning.png)

This operation starts the initial synchronization of all users and/or groups defined in **Scope** in the **Settings** section. The initial sync takes longer to perform than subsequent syncs, which occur approximately every 40 minutes as long as the Azure AD provisioning service is running. You can use the **Synchronization Details** section to monitor progress and follow links to provisioning activity report, which describes all actions performed by the Azure AD provisioning service on Bluejeans.

For more information on how to read the Azure AD provisioning logs, see [Reporting on automatic user account provisioning](./active-directory-saas-provisioning-reporting.md).

## Additional resources

* [Managing user account provisioning for Enterprise Apps](active-directory-enterprise-apps-manage-provisioning.md)
* [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](active-directory-saas-provisioning-reporting.md)

<!--Image references-->
[1]: ./media/active-directory-saas-bluejeans-provisioning-tutorial/tutorial_general_01.png
[2]: ./media/active-directory-saas-bluejeans-tutorial/tutorial_general_02.png
[3]: ./media/active-directory-saas-bluejeans-tutorial/tutorial_general_03.png