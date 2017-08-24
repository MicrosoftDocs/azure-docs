---
title: 'Tutorial: Azure Active Directory integration with DocuSign | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and DocuSign.
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila

ms.assetid: 294cd6b8-74d7-44bc-92bc-020ccd13ff12
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/10/2017
ms.author: jeedes

---
# Tutorial: Configuring DocuSign for User Provisioning

The objective of this tutorial is to show you the steps you need to perform in DocuSign and Azure AD to automatically provision and de-provision user accounts from Azure AD to DocuSign.

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following items:

*   An Azure Active directory tenant.
*   A DocuSign single sign-on enabled subscription.
*   A user account in DocuSign with Team Admin permissions.

## Assigning users to DocuSign

Azure Active Directory uses a concept called "assignments" to determine which users should receive access to selected apps. In the context of automatic user account provisioning, only the users and groups that have been "assigned" to an application in Azure AD are synchronized.

Before configuring and enabling the provisioning service, you need to decide what users and/or groups in Azure AD represent the users who need access to your DocuSign app. Once decided, you can assign these users to your DocuSign app by following the instructions here:

[Assign a user or group to an enterprise app](https://docs.microsoft.com/azure/active-directory/active-directory-coreapps-assign-user-azure-portal)

### Important tips for assigning users to DocuSign

*   It is recommended that a single Azure AD user is assigned to DocuSign to test the provisioning configuration. Additional users and/or groups may be assigned later.

*   When assigning a user to DocuSign, you must select a valid user role. The "Default Access" role does not work for provisioning.

## Enable User Provisioning

This section guides you through connecting your Azure AD to DocuSign's user account provisioning API, and configuring the provisioning service to create, update, and disable assigned user accounts in DocuSign based on user and group assignment in Azure AD.

> [!Tip]
> You may also choose to enabled SAML-based Single Sign-On for DocuSign, following the instructions provided in [Azure portal](https://portal.azure.com). Single sign-on can be configured independently of automatic provisioning, though these two features compliment each other.

### To configure user account provisioning:

The objective of this section is to outline how to enable user provisioning of Active Directory user accounts to DocuSign.

1. In the [Azure portal](https://portal.azure.com), browse to the **Azure Active Directory > Enterprise Apps > All applications** section.

2. If you have already configured DocuSign for single sign-on, search for your instance of DocuSign using the search field. Otherwise, select **Add** and search for **DocuSign** in the application gallery. Select DocuSign from the search results, and add it to your list of applications.

3. Select your instance of DocuSign, then select the **Provisioning** tab.

4. Set the **Provisioning Mode** to **Automatic**. 

    ![provisioning](./media/active-directory-saas-docusign-provisioning-tutorial/provisioning.png)

5. Under the **Admin Credentials** section, provide the following configuration settings:
   
    a. In the **Admin User Name** textbox, type a DocuSign account name that has the **System Administrator** profile in DocuSign.com assigned.
   
    b. In the **Admin Password** textbox, type the password for this account.

6. In the Azure portal, click **Test Connection** to ensure Azure AD can connect to your DocuSign app.

7. In the **Notification Email** field, enter the email address of a person or group who should receive provisioning error notifications, and check the checkbox.

8. Click **Save.**

9. Under the Mappings section, select **Synchronize Azure Active Directory Users to DocuSign.**

10. In the **Attribute Mappings** section, review the user attributes that are synchronized from Azure AD to DocuSign. The attributes selected as **Matching** properties are used to match the user accounts in DocuSign for update operations. Select the Save button to commit any changes.

11. To enable the Azure AD provisioning service for DocuSign, change the **Provisioning Status** to **On** in the Settings section

12. Click **Save.**

It starts the initial synchronization of any users and/or groups assigned to DocuSign in the Users and Groups section. The initial sync takes longer to perform than subsequent syncs, which occur approximately every 20 minutes as long as the service is running. You can use the **Synchronization Details** section to monitor progress and follow links to provisioning activity reports, which describe all actions performed by the provisioning service on your DocuSign app.

You can now create a test account. Wait for up to 20 minutes to verify that the account has been synchronized to DocuSign.

## Additional resources

* [Managing user account provisioning for Enterprise Apps](active-directory-saas-tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)
* [Configure Single Sign-on](active-directory-saas-docusign-tutorial.md)