---
title: 'Tutorial: Configuring Samanage for automatic user provisioning with Azure Active Directory | Microsoft Docs'
description: Learn how to configure Azure Active Directory to automatically provision and de-provision user accounts to Samanage.
services: active-directory
documentationcenter: ''
author: asmalser-msft
writer: asmalser-msft
manager: stevenpo

ms.assetid: d4ca2365-6729-48f7-bb7f-c0f5ffe740a3
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/14/2017
ms.author: asmalser-msft
---

# Tutorial: Configuring Samanage for Automatic User Provisioning


The objective of this tutorial is to show you the steps you need to perform in Samanage and Azure AD to automatically provision and de-provision user accounts from Azure AD to Samanage. 

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following items:

*   An Azure Active directory tenant
*   A Samanage tenant with the [Professional plan](https://www.samanage.com/pricing/) or better enabled 
*   A user account in Samanage with Admin permissions 

> [!NOTE]
> The Azure AD provisioning integration relies on the [Samanage REST API](https://www.samanage.com/api/), which is available to Samanage teams on the Professional plan or better.

## Assigning users to Samanage

Azure Active Directory uses a concept called "assignments" to determine which users should receive access to selected apps. In the context of automatic user account provisioning, only the users and groups that have been "assigned" to an application in Azure AD is synchronized. 

Before configuring and enabling the provisioning service, you need to decide what users and/or groups in Azure AD represent the users who need access to your Samanage app. Once decided, you can assign these users to your Samanage app by following the instructions here:

[Assign a user or group to an enterprise app](active-directory-coreapps-assign-user-azure-portal.md)

### Important tips for assigning users to Samanage

*	It is recommended that a single Azure AD user is assigned to Samanage to test the provisioning configuration. Additional users and/or groups may be assigned later.

*	When assigning a user to Samanage, you must select either the **User** role, or another valid application-specific role (if available) in the assignment dialog. The **Default Access** role does not work for provisioning, and these users are skipped.

> [!NOTE]
> As an added feature, the provisioning service reads any custom roles defined in Samanage, and imports them into Azure AD where they can be selected in the Select Role dialog. These roles will be visible in the Azure portal after the provisioning service is enabled and one synchronization cycle has completed.

## Configuring user provisioning to Samanage 

This section guides you through connecting your Azure AD to Samanage's user account provisioning API, and configuring the provisioning service to create, update, and disable assigned user accounts in Samanage based on user and group assignment in Azure AD.

> [!TIP]
> You may also choose to enabled SAML-based Single Sign-On for Samanage, following the instructions provided in [Azure portal](https://portal.azure.com). Single sign-on can be configured independently of automatic provisioning, though these two features compliment each other.


### Configure automatic user account provisioning to Samanage in Azure AD:


1. In the [Azure portal](https://portal.azure.com), browse to the **Azure Active Directory > Enterprise Apps > All applications**  section.

2. If you have already configured Samanage for single sign-on, search for your instance of Samanage using the search field. Otherwise, select **Add** and search for **Samanage** in the application gallery. Select Samanage from the search results, and add it to your list of applications.

3. Select your instance of Samanage, then select the **Provisioning** tab.

4. Set the **Provisioning Mode** to **Automatic**.

	![Samanage Provisioning](./media/active-directory-saas-samanage-provisioning-tutorial/Samanage1.png)

5. Under the **Admin Credentials** section, input the **Admin Username&Admin Password** of your Samanage's account. 

6. In the Azure portal, click **Test Connection** to ensure Azure AD can connect to your Samanage app. If the connection fails, ensure your Samanage account has Admin permissions and try step 5 again.

7. Enter the email address of a person or group who should receive provisioning error notifications in the **Notification Email** field, and check the checkbox "Send an email notification when a failure occurs."

8. Click **Save**. 

9. Under the Mappings section, select **Synchronize Azure Active Directory Users to Samanage**.

10. In the **Attribute Mappings** section, review the user attributes that are synchronized from Azure AD to Samanage. The attributes selected as **Matching** properties are used to match the user accounts in Samanage for update operations. Select the Save button to commit any changes.

11. To enable the Azure AD provisioning service for Samanage, change the **Provisioning Status** to **On** in the **Settings** section

12. Click **Save**. 

This operation starts the initial synchronization of any users and/or groups assigned to Samanage in the Users and Groups section. The initial sync takes longer to perform than subsequent syncs, which occur approximately every 20 minutes as long as the service is running. You can use the **Synchronization Details** section to monitor progress and follow links to provisioning activity reports, which describe all actions performed by the provisioning service.

For more information on how to read the Azure AD provisioning logs, see [Reporting on automatic user account provisioning](https://docs.microsoft.com/en-us/azure/active-directory/active-directory-saas-provisioning-reporting).


## Additional resources

* [Managing user account provisioning for Enterprise Apps](active-directory-enterprise-apps-manage-provisioning.md)
* [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](active-directory-saas-provisioning-reporting.md)
