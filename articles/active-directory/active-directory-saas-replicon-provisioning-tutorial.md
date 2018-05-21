---
title: 'Tutorial: Configure Replicon for automatic user provisioning with Azure Active Directory | Microsoft Docs'
description: Learn how to configure Azure Active Directory to automatically provision and de-provision user accounts to Replicon.
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
ms.date: 02/20/2018
ms.author: v-ant

---

# Tutorial: Configure Replicon for automatic user provisioning

The objective of this tutorial is to demonstrate the steps to be performed in Replicon and Azure Active Directory (Azure AD) to configure Azure AD to automatically provision and de-provision users and/or groups to Replicon.

> [!NOTE]
> This tutorial describes a connector built on top of the Azure AD User Provisioning Service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Azure Active Directory](./active-directory-saas-app-provisioning.md).

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following items:

*   An Azure AD tenant
*   A Replicon tenant with the [Plus](https://www.replicon.com/time-bill-pricing/) plan or better enabled
*   A user account in Replicon with Admin permissions

> [!NOTE]
> The Azure AD provisioning integration relies on the [Replicon API](https://www.replicon.com/help/developers), which is available to Replicon teams on the Plus plan or better.

## Adding Replicon from the gallery
Before configuring Replicon for automatic user provisioning with Azure AD, you need to add Replicon from the Azure AD application gallery to your list of managed SaaS applications.

**To add Replicon from the Azure AD application gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click on the **Azure Active Directory** icon. 

	![The Azure Active Directory button][1]

2. Navigate to **Enterprise applications** > **All applications**.

	![The Enterprise applications Section][2]
	
3. To add Replicon, click the **New application** button on the top of the dialog.

	![The New application button][3]

4. In the search box, type **Replicon**.

	![Replicon Application Search](./media/active-directory-saas-replicon-provisioning-tutorial/RepliconAppSearch.png)

5. In the results panel, select **Replicon**, and then click the **Add** button to add Replicon to your list of SaaS applications.

	![Replicon Search Results](./media/active-directory-saas-replicon-provisioning-tutorial/RepliconAppSearchResults.png)

	![Replicon Create Application](./media/active-directory-saas-replicon-provisioning-tutorial/RepliconAppCreate.png)


## Assigning users to Replicon

Azure Active Directory uses a concept called "assignments" to determine which users should receive access to selected apps. In the context of automatic user provisioning, only the users and/or groups that have been "assigned" to an application in Azure AD are synchronized.

Before configuring and enabling automatic user provisioning, you should decide which users and/or groups in Azure AD need access to Replicon. Once decided, you can assign these users and/or groups to Replicon by following the instructions here:

*   [Assign a user or group to an enterprise app](active-directory-coreapps-assign-user-azure-portal.md)

### Important tips for assigning users to Replicon

*	It is recommended that a single Azure AD user is assigned to Replicon to test the automatic user provisioning configuration. Additional users and/or groups may be assigned later.

*	When assigning a user to Replicon, you must select any valid application-specific role (if available) in the assignment dialog. Users with the **Default Access** role are excluded from provisioning.

## Configuring automatic user provisioning to Replicon 

This section guides you through the steps to configure the Azure AD provisioning service to create, update, and disable users and/or groups in Replicon based on user and/or group assignments in Azure AD.

> [!TIP]
> You may also choose to enable SAML-based single sign-on for Replicon, following the instructions provided in the [Replicon single sign-on tutorial](active-directory-saas-replicon-tutorial.md). Single sign-on can be configured independently of automatic user provisioning, though these two features compliment each other.

### To configure automatic user provisioning for Replicon in Azure AD:

1. Sign in to the [Azure portal](https://portal.azure.com) and browse to **Azure Active Directory > Enterprise applications > All applications**.

2. Select Replicon from your list of SaaS applications.

	![Replicon Provisioning](./media/active-directory-saas-replicon-provisioning-tutorial/Replicon2.png)

3. Select the **Provisioning** tab.

	![Replicon Provisioning](./media/active-directory-saas-replicon-provisioning-tutorial/RepliconProvisioningTab.png)

4. Set the **Provisioning Mode** to **Automatic**.

	![Replicon Provisioning](./media/active-directory-saas-replicon-provisioning-tutorial/Replicon1.png)

5. Under the **Admin Credentials** section, input the **Admin Username**, **Admin Password**, **CompanyId**, and **Domain** of your Replicon's account. Examples of these values are:

	*   In the **Admin Username** field, populate the username of the admin account on your Replicon tenant. Example: contosoadmin.

	*   In the **Admin Password** field, populate the password corresponding to the admin username.

	*   In the **CompanyId** field, populate the CompanyId of your Replicon tenant. Example: The CompanyID based on the log-in below is Contoso.

	![Replicon Login](./media/active-directory-saas-replicon-provisioning-tutorial/RepliconLogin.png)

	*   In the **Domain** field, populate the Domain as described in Step 6.
	
6. Obtain **serviceEndpointRootURL** for your Replicon tenant account based on steps mentioned in [Replicon Service Help](https://www.replicon.com/help/determining-the-url-for-your-service-calls). Upon obtaining the URL , the **domain** would be the subdomain of **serviceEndpointRootURL** as highlighted. 

	![Replicon Provisioning](./media/active-directory-saas-replicon-provisioning-tutorial/RepliconEndpoint.png)

7. Upon populating the fields shown in Step 5, click **Test Connection** to ensure Azure AD can connect to Replicon. If the connection fails, ensure your Replicon account has Admin permissions and try again.

	![Replicon Provisioning](./media/active-directory-saas-replicon-provisioning-tutorial/RepliconTestConnection.png)

8. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and check the checkbox **Send an email notification when a failure occurs**.

	![Replicon Provisioning](./media/active-directory-saas-replicon-provisioning-tutorial/RepliconNotificationEmail.png)

9. Click **Save**.

10. Under the **Mappings** section, select **Synchronize Azure Active Directory Users to Replicon**.
	
	![Replicon Provisioning](./media/active-directory-saas-replicon-provisioning-tutorial/RepliconUserMapping.png)

11. Review the user attributes that are synchronized from Azure AD to Replicon in the **Attribute Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in Replicon for update operations. Select the **Save** button to commit any changes.

	![Replicon Provisioning](./media/active-directory-saas-replicon-provisioning-tutorial/RepliconUserMappingAtrributes.png)

12. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](./active-directory-saas-scoping-filters.md).

13. To enable the Azure AD provisioning service for Replicon, change the **Provisioning Status** to **On** in the **Settings** section.

	![Replicon Provisioning](./media/active-directory-saas-replicon-provisioning-tutorial/RepliconProvisioningStatus.png)

14. Define the users and/or groups that you would like to provision to Replicon by choosing the desired values in **Scope** in the **Settings** section.

	![Replicon Provisioning](./media/active-directory-saas-replicon-provisioning-tutorial/UserGroupSelection.png)

15. When you are ready to provision, click **Save**.

	![Replicon Provisioning](./media/active-directory-saas-replicon-provisioning-tutorial/SaveProvisioning.png)

This operation starts the initial synchronization of all users and/or groups defined in **Scope** in the **Settings** section. The initial sync takes longer to perform than subsequent syncs, which occur approximately every 40 minutes as long as the Azure AD provisioning service is running. You can use the **Synchronization Details** section to monitor progress and follow links to provisioning activity report, which describes all actions performed by the Azure AD provisioning service on Replicon.

For more information on how to read the Azure AD provisioning logs, see [Reporting on automatic user account provisioning](./active-directory-saas-provisioning-reporting.md).

## Additional resources

* [Managing user account provisioning for Enterprise Apps](active-directory-enterprise-apps-manage-provisioning.md)
* [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](active-directory-saas-provisioning-reporting.md)

<!--Image references-->
[1]: ./media/active-directory-saas-replicon-tutorial/tutorial_general_01.png
[2]: ./media/active-directory-saas-replicon-tutorial/tutorial_general_02.png
[3]: ./media/active-directory-saas-replicon-tutorial/tutorial_general_03.png
