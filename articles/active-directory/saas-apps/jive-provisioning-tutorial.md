---
title: 'Tutorial: Configure Jive for automatic user provisioning with Azure Active Directory | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Jive.
services: active-directory
documentationCenter: na
author: jeevansd
manager: daveba

ms.assetid: 6fbfdbe7-d66c-4305-9fea-76d6a6a92830
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/26/2018
ms.author: jeedes

ms.collection: M365-identity-device-management
---
# Tutorial: Configure Jive for automatic user provisioning

The objective of this tutorial is to show you the steps you need to perform in Jive and Azure AD to automatically provision and de-provision user accounts from Azure AD to Jive.

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following items:

*   An Azure Active directory tenant.
*   A Jive single-sign on enabled subscription.
*   A user account in Jive with Team Admin permissions.

## Assigning users to Jive

Azure Active Directory uses a concept called "assignments" to determine which users should receive access to selected apps. In the context of automatic user account provisioning, only the users and groups that have been "assigned" to an application in Azure AD is synchronized.

Before configuring and enabling the provisioning service, you need to decide what users and/or groups in Azure AD represent the users who need access to your Jive app. Once decided, you can assign these users to your Jive app by following the instructions here:

[Assign a user or group to an enterprise app](https://docs.microsoft.com/azure/active-directory/active-directory-coreapps-assign-user-azure-portal)

### Important tips for assigning users to Jive

*   It is recommended that a single Azure AD user be assigned to Jive to test the provisioning configuration. Additional users and/or groups may be assigned later.

*   When assigning a user to Jive, you must select a valid user role. The "Default Access" role does not work for provisioning.

## Enable User Provisioning

This section guides you through connecting your Azure AD to Jive's user account provisioning API, and configuring the provisioning service to create, update, and disable assigned user accounts in Jive based on user and group assignment in Azure AD.

> [!TIP]
> You may also choose to enabled SAML-based Single Sign-On for Jive, following the instructions provided in [Azure portal](https://portal.azure.com). Single sign-on can be configured independently of automatic provisioning, though these two features compliment each other.

### To configure user account provisioning:

The objective of this section is to outline how to enable user provisioning of Active Directory user accounts to Jive.
As part of this procedure, you are required to provide a user security token you need to request from Jive.com.

1. In the [Azure portal](https://portal.azure.com), browse to the **Azure Active Directory > Enterprise Apps > All applications** section.

1. If you have already configured Jive for single sign-on, search for your instance of Jive using the search field. Otherwise, select **Add** and search for **Jive** in the application gallery. Select Jive from the search results, and add it to your list of applications.

1. Select your instance of Jive, then select the **Provisioning** tab.

1. Set the **Provisioning Mode** to **Automatic**. 

    ![provisioning](./media/jive-provisioning-tutorial/provisioning.png)

1. Under the **Admin Credentials** section, provide the following configuration settings:
   
    a. In the **Jive Admin User Name** textbox, type a Jive account name that has the **System Administrator** profile in Jive.com assigned.
   
    b. In the **Jive Admin Password** textbox, type the password for this account.
   
    c. In the **Jive Tenant URL** textbox, type the Jive tenant URL.
      
      > [!NOTE]
      > The Jive tenant URL is URL that is used by your organization to log in to Jive.  
      > Typically, the URL has the following format: **www.\<organization\>.jive.com**.          

1. In the Azure portal, click **Test Connection** to ensure Azure AD can connect to your Jive app.

1. Enter the email address of a person or group who should receive provisioning error notifications in the **Notification Email** field, and check the checkbox below.

1. Click **Save.**

1. Under the Mappings section, select **Synchronize Azure Active Directory Users to Jive.**

1. In the **Attribute Mappings** section, review the user attributes that are synchronized from Azure AD to Jive. The attributes selected as **Matching** properties are used to match the user accounts in Jive for update operations. Select the Save button to commit any changes.

1. To enable the Azure AD provisioning service for Jive, change the **Provisioning Status** to **On** in the Settings section

1. Click **Save.**

It starts the initial synchronization of any users and/or groups assigned to Jive in the Users and Groups section. The initial sync takes longer to perform than subsequent syncs, which occur approximately every 40 minutes as long as the service is running. You can use the **Synchronization Details** section to monitor progress and follow links to provisioning activity logs, which describe all actions performed by the provisioning service on your Jive app.

For more information on how to read the Azure AD provisioning logs, see [Reporting on automatic user account provisioning](../manage-apps/check-status-user-account-provisioning.md).

## Additional resources

* [Managing user account provisioning for Enterprise Apps](tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)
* [Configure Single Sign-on](jive-tutorial.md)
