---
title: 'Tutorial: Configure Replicon for automatic user provisioning with Azure Active Directory | Microsoft Docs'
description: Learn how to configure Azure Active Directory to automatically provision and de-provision user accounts to Replicon.
services: active-directory
documentationcenter: ''
author: zhchia-msft
writer: zhchia-msft
manager: beatrizd-msft

ms.assetid: na
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/01/2018
ms.author: v-ant-msft

---

# Tutorial: Configure Replicon for automatic user provisioning


The objective of this tutorial is to show you the steps you need to perform in Replicon and Azure AD to automatically provision and de-provision user accounts from Azure AD to Replicon. 

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following items:

*   An Azure Active Directory tenant
*   A Replicon tenant with the [Plus](https://www.replicon.com/time-bill-pricing/) plan or better enabled
*   A user account in Replicon with Admin permissions

> [!NOTE]
> The Azure AD provisioning integration relies on the [Replicon API](https://www.replicon.com/help/developers), which is available to Replicon teams on the Plus plan or better.

## Assigning users to Replicon

Azure Active Directory uses a concept called "assignments" to determine which users should receive access to selected apps. In the context of automatic user account provisioning, only the users and groups that have been "assigned" to an application in Azure AD are synchronized. 

Before configuring and enabling the provisioning service, you should decide what users and/or groups in Azure AD represent the users who need access Replicon. Once decided, you can assign these users to your Replicon app by following the instructions here:

*   [Assign a user or group to an enterprise app](active-directory-coreapps-assign-user-azure-portal.md)

### Important tips for assigning users to Replicon

*	It is recommended that a single Azure AD user is assigned to Replicon to test the provisioning configuration. Additional users and/or groups may be assigned later.

*	When assigning a user to Replicon, you must select either the **User** role, or another valid application-specific role (if available) in the assignment dialog. Users with the **Default Access** role are excluded from provisioning.


## Configuring user provisioning to Replicon 

This section guides you through connecting your Azure AD to Replicon's user roster using Replicon's user account provisioning API, and configuring the provisioning service to create, update, and disable assigned user accounts in Replicon based on user and group assignment in Azure AD.

> [!TIP]
> You may also choose to enabled SAML-based Single Sign-On for Replicon, following the instructions provided in [Azure portal](https://portal.azure.com). Single sign-on can be configured independently of automatic provisioning, though these two features compliment each other.For more information, see the [Replicon single sign-on tutorial](active-directory-saas-replicon-tutorial.md).

### To configure automatic user provisioning to Replicon in Azure AD:


1. Sign in to the [Azure portal](https://portal.azure.com), browse to the **Azure Active Directory > Enterprise Apps > All applications**  section.

2. If you have already configured Replicon for single sign-on, search for your instance of Replicon using the search field. Otherwise, select **Add** and search for **Replicon** in the application gallery. Select Replicon from the search results, and add it to your list of applications.

	![Replicon Provisioning](./media/active-directory-saas-replicon-provisioning-tutorial/Replicon2.png)

3. Select your instance of Replicon, then select the **Provisioning** tab.

4. Set the **Provisioning Mode** to **Automatic**.

	![Replicon Provisioning](./media/active-directory-saas-replicon-provisioning-tutorial/Replicon1.png)

5. Under the **Admin Credentials** section, input the **Admin Username,Admin Password,CompanyId & Domain** of your Replicon's account.

6. Upon populating the fields shown above, click **Test Connection** to ensure Azure AD can connect to your Replicon app. If the connection fails, ensure your Replicon account has Admin permissions and try Step 5 again.

7. Enter the email address of a person or group who should receive provisioning error notifications in the **Notification Email** field, and check the checkbox "Send an email notification when a failure occurs."

8. Click **Save**.

9. Under the **Mappings** section, select **Synchronize Azure Active Directory Users to Replicon**.

10. Review the user attributes that are synchronized from Azure AD to Replicon. The attributes selected as **Matching** properties are used to match the user accounts in Replicon for update operations. Select the Save button to commit any changes.

11. To enable the Azure AD provisioning service for Replicon, change the **Provisioning Status** to **On** in the **Settings** section

12. Click **Save**.

This starts the initial synchronization of any users and/or groups assigned to Replicon in the Users and Groups section. The initial sync takes longer to perform than subsequent syncs, which occur approximately every 20 minutes as long as the service is running. You can use the **Synchronization Details** section to monitor progress and follow links to provisioning activity reports, which describe all actions performed by the provisioning service on your Replicon app.

For more information on how to read the Azure AD provisioning logs, see [Reporting on automatic user account provisioning](https://docs.microsoft.com/azure/active-directory/active-directory-saas-provisioning-reporting).


## Additional resources

* [Managing user account provisioning for Enterprise Apps](active-directory-enterprise-apps-manage-provisioning.md)
* [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](active-directory-saas-provisioning-reporting.md)
