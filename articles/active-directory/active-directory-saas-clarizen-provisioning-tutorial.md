---
title: 'Tutorial: Configure Clarizen for automatic user provisioning with Azure Active Directory | Microsoft Docs'
description: Learn how to configure Azure Active Directory to automatically provision and de-provision user accounts to Clarizen.
services: active-directory
documentationcenter: ''
author: zhchia
writer: zhchia
manager: beatrizd-msft

ms.assetid: na
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/31/2018
ms.author: v-ant-msft
---

# Tutorial: Configure Clarizen for automatic user provisioning

The objective of this tutorial is to demonstrate the steps to be performed in Clarizen and Azure Active Directory (Azure AD) to configure Azure AD to automatically provision and de-provision users and/or groups to Clarizen.

> [!NOTE]
> This tutorial describes a connector built on top of the Azure AD User Provisioning Service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Azure Active Directory](./active-directory-saas-app-provisioning.md).

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following:

*   An Azure AD tenant
*   A Clarizen tenant with the [Enterprise Edition](https://www.clarizen.com/product/pricing/) plan or better enabled 
*   A user account in Clarizen with Admin permissions

> [!NOTE]
> The Azure AD provisioning integration relies on the [Clarizen API](https://api.clarizen.com/v2.0/services/), which is available to Clarizen teams on the Enterprise Edition plan or better.

## Adding Clarizen from the gallery
Before configuring Clarizen for automatic user provisioning with Azure AD, you need to add Clarizen from the Azure AD application gallery to your list of managed SaaS applications.

**To add Clarizen from the Azure AD application gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click on the **Azure Active Directory** icon. 

	![The Azure Active Directory button][1]

2. Navigate to **Enterprise applications** > **All applications**.

	![The Enterprise applications Section][2]
	
3. To add Clarizen, click the **New application** button on the top of the dialog.

	![The New application button][3]

4. In the search box, type **Clarizen**.

	![Clarizen Provisioning](./media/active-directory-saas-clarizen-provisioning-tutorial/AppSearch.png)

5. In the results panel, select **Clarizen**, and then click the **Add** button to add Clarizen to your list of SaaS applications.

	![Clarizen Provisioning](./media/active-directory-saas-clarizen-provisioning-tutorial/AppSearchResults.png)

	![Clarizen Provisioning](./media/active-directory-saas-clarizen-provisioning-tutorial/AppCreation.png)

## Assigning users to Clarizen

Azure Active Directory uses a concept called "assignments" to determine which users should receive access to selected apps. In the context of automatic user provisioning, only the users and/or groups that have been "assigned" to an application in Azure AD are synchronized. 

Before configuring and enabling automatic user provisioning, you should decide which users and/or groups in Azure AD need access to Clarizen. Once decided, you can assign these users and/or groups to Clarizen by following the instructions here:

*   [Assign a user or group to an enterprise app](active-directory-coreapps-assign-user-azure-portal.md)

### Important tips for assigning users to Clarizen

*	It is recommended that a single Azure AD user is assigned to Clarizen to test the automatic user provisioning configuration. Additional users and/or groups may be assigned later.

*	When assigning a user to Clarizen, you must select any valid application-specific role (if available) in the assignment dialog. Users with the **Default Access** role are excluded from provisioning.

## Configuring automatic user provisioning to Clarizen 

This section guides you through the steps to configure the Azure AD provisioning service to create, update, and disable users and/or groups in Clarizen based on user and/or group assignments in Azure AD.

> [!TIP]
> You may also choose to enable SAML-based single sign-on for Clarizen, following the instructions provided in the [Clarizen single sign-on tutorial](active-directory-saas-clarizen-tutorial.md). Single sign-on can be configured independently of automatic user provisioning, though these two features compliment each other.

### To configure automatic user provisioning for Clarizen in Azure AD:

1. Sign in to the [Azure portal](https://portal.azure.com) and browse to **Azure Active Directory > Enterprise applications > All applications**.

2. Select Clarizen from your list of SaaS applications.
 
	![Clarizen Provisioning](./media/active-directory-saas-clarizen-provisioning-tutorial/AppInstanceSearch.png)

3. Select the **Provisioning** tab.
	
	![Clarizen Provisioning](./media/active-directory-saas-clarizen-provisioning-tutorial/ProvisioningTab.png)

4. Set the **Provisioning Mode** to **Automatic**.

	![Clarizen Provisioning](./media/active-directory-saas-clarizen-provisioning-tutorial/ProvisioningCredentials.png)

5. Under the **Admin Credentials** section, input the **Domain**, **Admin Username**, and **Admin Password** of your Clarizen's account. Examples of these values are:

	*   In the **Admin Username** field, populate the username of the admin account on your Clarizen Tenant. Example: admin@contoso.com.

	*   In the **Admin Password** field, populate the password of the admin account corresponding to the admin username.

	*   In the **Domain** field, populate subdomain based on Step 6.
	
6. Retrieve the **serverLocation** for your Clarizen account based on steps mentioned under **Authentication** of [Clarizen's Rest API Guide](https://success.clarizen.com/hc/en-us/articles/205711828-REST-API-Guide-Version-2). Upon obtaining the serverLocation, use the subdomain of the URL as highlighted below, to populate the **Domain** field.

	![Clarizen Provisioning](./media/active-directory-saas-clarizen-provisioning-tutorial/ClarizenDomain.png)

7. Upon populating the fields shown in Step 5, click **Test Connection** to ensure Azure AD can connect to Clarizen. If the connection fails, ensure your Clarizen account has Admin permissions and try again.

	![Clarizen Provisioning](./media/active-directory-saas-clarizen-provisioning-tutorial/TestConnection.png)
	
8. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and check the checkbox **Send an email notification when a failure occurs**.

	![Clarizen Provisioning](./media/active-directory-saas-clarizen-provisioning-tutorial/NotificationEmail.png)

9. Click **Save**.

10. Under the **Mappings** section, select **Synchronize Azure Active Directory Users to Clarizen**.

	![Clarizen Provisioning](./media/active-directory-saas-clarizen-provisioning-tutorial/UserMapping.png)

11. Review the user attributes that are synchronized from Azure AD to Clarizen in the **Attribute Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in Clarizen for update operations. Select the **Save** button to commit any changes.

	![Clarizen Provisioning](./media/active-directory-saas-clarizen-provisioning-tutorial/UserMappingAttributes.png)

12. Under the **Mappings** section, select **Synchronize Azure Active Directory Groups to Clarizen**.

	![Clarizen Provisioning](./media/active-directory-saas-clarizen-provisioning-tutorial/GroupMapping.png)

13. Review the group attributes that are synchronized from Azure AD to Clarizen in the **Attribute Mapping** section. The attributes selected as **Matching** properties are used to match the groups in Clarizen for update operations. Select the **Save** button to commit any changes.

	![Clarizen Provisioning](./media/active-directory-saas-clarizen-provisioning-tutorial/GroupMappingAttributes.png)

14. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](./active-directory-saas-scoping-filters.md).

15. To enable the Azure AD provisioning service for Clarizen, change the **Provisioning Status** to **On** in the **Settings** section.

	![Clarizen Provisioning](./media/active-directory-saas-clarizen-provisioning-tutorial/ProvisioningStatus.png)

16. Define the users and/or groups that you would like to provision to Clarizen by choosing the desired values in **Scope** in the **Settings** section.

	![Clarizen Provisioning](./media/active-directory-saas-clarizen-provisioning-tutorial/ScopeSelection.png)

17. When you are ready to provision, click **Save**.

	![Clarizen Provisioning](./media/active-directory-saas-clarizen-provisioning-tutorial/SaveProvisioning.png)


This operation starts the initial synchronization of all users and/or groups defined in **Scope** in the **Settings** section. The initial sync takes longer to perform than subsequent syncs, which occur approximately every 40 minutes as long as the Azure AD provisioning service is running. You can use the **Synchronization Details** section to monitor progress and follow links to provisioning activity report, which describes all actions performed by the Azure AD provisioning service on Clarizen.

For more information on how to read the Azure AD provisioning logs, see [Reporting on automatic user account provisioning](./active-directory-saas-provisioning-reporting.md).

## Additional resources

* [Managing user account provisioning for Enterprise Apps](active-directory-enterprise-apps-manage-provisioning.md)
* [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](active-directory-saas-provisioning-reporting.md)

<!--Image references-->
[1]: ./media/active-directory-saas-clarizen-provisioning-tutorial/tutorial_general_01.png
[2]: ./media/active-directory-saas-clarizen-tutorial/tutorial_general_02.png
[3]: ./media/active-directory-saas-clarizen-tutorial/tutorial_general_03.png
