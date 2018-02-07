---
title: 'Tutorial: Configure Zendesk for automatic user provisioning with Azure Active Directory | Microsoft Docs'
description: Learn how to configure Azure Active Directory to automatically provision and de-provision user accounts to Zendesk.
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
ms.date: 01/31/2018
ms.author: v-ant-msft
---

# Tutorial: Configure Zendesk for automatic user provisioning


The objective of this tutorial is to show you the steps you need to perform in Zendesk and Azure AD to automatically provision and de-provision user accounts from Azure AD to Zendesk. 

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following items:

*   An Azure Active Directory tenant
*   A Zendesk tenant with the [Enterprise](https://www.zendesk.com/product/pricing/) plan or better enabled 
*   A user account in Zendesk with Admin permissions 

> [!NOTE]
> The Azure AD provisioning integration relies on the [Zendesk Rest API](https://developer.zendesk.com/rest_api/docs/core/introduction), which is available to Zendesk teams on the Enterprise plan or better.

## Assigning users to Zendesk

Azure Active Directory uses a concept called "assignments" to determine which users should receive access to selected apps. In the context of automatic user account provisioning, only the users and groups that have been "assigned" to an application in Azure AD are synchronized. 

Before configuring and enabling the provisioning service, you should decide which users and/or groups in Azure AD represent the users who need access to Zendesk. Once decided, you can assign these users and/or groups to your Zendesk app by following the instructions here:

*   [Assign a user or group to an enterprise app](active-directory-coreapps-assign-user-azure-portal.md)

### Important tips for assigning users to Zendesk

*	It is recommended that a single Azure AD user is assigned to Zendesk to test the provisioning configuration. Additional users and/or groups may be assigned later.

*	When assigning a user to Zendesk, you must select either the **User** role, or another valid application-specific role (if available) in the assignment dialog. Users with **Default Access** role are excluded from provisioning.


## Configuring user provisioning to Zendesk 

This section guides you through connecting your Azure AD to Zendesk's user roster using Zendesk's user account provisioning API, and configuring the provisioning service to create, update, and disable assigned user accounts in Zendesk based on user and group assignment in Azure AD.

> [!TIP]
> You may also choose to enabled SAML-based Single Sign-On for Zendesk, following the instructions provided in [Azure portal](https://portal.azure.com). Single sign-on can be configured independently of automatic provisioning, though these two features compliment each other.For more information, see the [Zendesk single sign-on tutorial](active-directory-saas-zendesk-tutorial.md).


### To configure automatic user provisioning to Zendesk in Azure AD:


1. Sign in to [Azure portal](https://portal.azure.com), browse to the **Azure Active Directory > Enterprise Apps > All applications**  section.

2. If you have already configured Zendesk for single sign-on, search for your instance of Zendesk using the search field. Otherwise, select **Add** and search for **Zendesk** in the application gallery. Select Zendesk from the search results, and add it to your list of applications.
	![Zendesk Provisioning](./media/active-directory-saas-zendesk-provisioning-tutorial/ZenDesk3.png)

3. Select your instance of Zendesk, then select the **Provisioning** tab.

4. Set the **Provisioning Mode** to **Automatic**.

	![Zendesk Provisioning](./media/active-directory-saas-zendesk-provisioning-tutorial/ZenDesk1.png)

5. Under the **Admin Credentials** section, input the **Admin UserName,Domain&tokenkey** of your Zendesk's account (you can find the token under your Zendesk account in **Admin > API > Settings**). 
	![Zendesk Provisioning](./media/active-directory-saas-zendesk-provisioning-tutorial/ZenDesk4.png)

	![Zendesk Provisioning](./media/active-directory-saas-zendesk-provisioning-tutorial/ZenDesk2.png)

6. Upon populating the fields shown above, click **Test Connection** to ensure Azure AD can connect to your Zendesk app. If the connection fails, ensure your Zendesk account has Admin permissions and try Step 5 above.

7. Enter the email address of a person or group who should receive provisioning error notifications in the **Notification Email** field, and check the checkbox "Send an email notification when a failure occurs."

8. Click **Save**.

9. Under the **Mappings** section, select **Synchronize Azure Active Directory Users to Zendesk**.

10. Review the user attributes that are synchronized from Azure AD to Zendesk. The attributes selected as **Matching** properties are used to match the user accounts in Zendesk for update operations. Select the Save button to commit any changes.

11. Under the **Mappings** section, select **Synchronize Azure Active Directory Groups to ZenDesk**.

12. Review the group attributes that are synchronized from Azure AD to Zendesk. The attributes selected as **Matching** properties are used to match the groups in Zendesk for update operations. Select the Save button to commit any changes.

13. To enable the Azure AD provisioning service for Zendesk, change the **Provisioning Status** to **On** in the **Settings** section

14. Click **Save**. 

This starts the initial synchronization of any users and/or groups assigned to Zendesk in the **Users and Groups**. The initial sync takes longer to perform than subsequent syncs, which occur approximately every 20 minutes as long as the Azure AD provisioning service is running. You can use the **Synchronization Details** section to monitor progress and follow links to provisioning activity reports, which describes all actions performed by the Azure AD provisioning service on your Zendesk app.

For more information on how to read the Azure AD provisioning logs, see [Reporting on automatic user account provisioning](https://docs.microsoft.com/azure/active-directory/active-directory-saas-provisioning-reporting).


## Additional resources

* [Managing user account provisioning for Enterprise Apps](active-directory-enterprise-apps-manage-provisioning.md)
* [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](active-directory-saas-provisioning-reporting.md)
