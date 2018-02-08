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


The objective of this tutorial is to show you the steps you need to perform in Bluejeans and Azure AD to automatically provision and de-provision user accounts from Azure AD to Bluejeans. 

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following items:

*   An Azure Active Directory tenant
*   A Bluejeans tenant with the [Standard](https://www.Bluejeans.com/pricing) plan or better enabled
*   A user account in Bluejeans with Admin permissions

> [!NOTE]
> The Azure AD provisioning integration relies on the [Bluejeans API](https://Bluejeans.github.io/developer), which is available to Bluejeans teams on the Standard plan or better.

## Assigning users to Bluejeans

Azure Active Directory uses a concept called "assignments" to determine which users should receive access to selected apps. In the context of automatic user account provisioning, only the users and groups that have been "assigned" to an application in Azure AD are synchronized.

Before configuring and enabling the provisioning service, you should decide what users and/or groups in Azure AD represent the users who need access Bluejeans. Once decided, you can assign these users to your Bluejeans app by following the instructions here:

*   [Assign a user or group to an enterprise app](active-directory-coreapps-assign-user-azure-portal.md)

### Important tips for assigning users to Bluejeans

*	It is recommended that a single Azure AD user is assigned to Bluejeans to test the provisioning configuration. Additional users and/or groups may be assigned later.

*	When assigning a user to Bluejeans, you must select either the **User** role, or another valid application-specific role (if available) in the assignment dialog. Users with the **Default Access** role are excluded from provisioning.


## Configuring user provisioning to Bluejeans 

This section guides you through connecting your Azure AD to Bluejeans's user roster using Bluejeans's user account provisioning API, and configuring the provisioning service to create, update, and disable assigned user accounts in Bluejeans based on user and group assignment in Azure AD.

> [!TIP]
> You may also choose to enabled SAML-based Single Sign-On for Bluejeans, following the instructions provided in [Azure portal](https://portal.azure.com). Single sign-on can be configured independently of automatic provisioning, though these two features compliment each other.For more information, see the [Bluejeans single sign-on tutorial](active-directory-saas-bluejeans-tutorial.md).


### To configure automatic user provisioning to Samanage in Azure AD:

1. Sign in to the [Azure portal](https://portal.azure.com), browse to the **Azure Active Directory > Enterprise Apps > All applications**  section.

2. If you have already configured Bluejeans for single sign-on, search for your instance of Bluejeans using the search field. Otherwise, select **Add** and search for **Bluejeans** in the application gallery. Select Bluejeans from the search results, and add it to your list of applications.

	![Bluejeans Provisioning](./media/active-directory-saas-bluejeans-provisioning-tutorial/Bluejeans2.png)

3. Select your instance of Bluejeans, then select the **Provisioning** tab.

4. Set the **Provisioning Mode** to **Automatic**.

	![Bluejeans Provisioning](./media/active-directory-saas-bluejeans-provisioning-tutorial/Bluejeans1.png)

5. Under the **Admin Credentials** section, input the **Admin Username & Admin Password** of your Bluejeans's account.

6. Upon populating the fields shown above, click **Test Connection** to ensure Azure AD can connect to your Bluejeans app. If the connection fails, ensure your Bluejeans account has Admin permissions and try Step 5 again.

7. Enter the email address of a person or group who should receive provisioning error notifications in the **Notification Email** field, and check the checkbox "Send an email notification when a failure occurs."

8. Click **Save**. 

9. Under the **Mappings** section, select **Synchronize Azure Active Directory Users to Bluejeans**.

10. Review the user attributes that are synchronized from Azure AD to Bluejeans. The attributes selected as **Matching** properties are used to match the user accounts in Bluejeans for update operations. Select the Save button to commit any changes.

11. To enable the Azure AD provisioning service for Bluejeans, change the **Provisioning Status** to **On** in the **Settings** section

12. Click **Save**.

This starts the initial synchronization of any users and/or groups assigned to Bluejeans in the Users and Groups section. The initial sync takes longer to perform than subsequent syncs, which occur approximately every 20 minutes as long as the service is running. You can use the **Synchronization Details** section to monitor progress and follow links to provisioning activity reports, which describe all actions performed by the provisioning service.

For more information on how to read the Azure AD provisioning logs, see [Reporting on automatic user account provisioning](https://docs.microsoft.com/azure/active-directory/active-directory-saas-provisioning-reporting).


## Additional resources

* [Managing user account provisioning for Enterprise Apps](active-directory-enterprise-apps-manage-provisioning.md)
* [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](active-directory-saas-provisioning-reporting.md)
