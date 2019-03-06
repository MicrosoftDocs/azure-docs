---
title: 'Tutorial: Configure ServiceNow for automatic user provisioning with Azure Active Directory | Microsoft Docs'
description: Learn how to automatically provision and de-provision user accounts from Azure AD to ServiceNow.
services: active-directory
documentationCenter: na
author: jeevansd
manager: daveba
ms.reviewer: joflore

ms.assetid: 4d6f06dd-a798-4c22-b84f-8a11f1b8592a
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
# Tutorial: Configure ServiceNow for automatic user provisioning with Azure Active Directory

The objective of this tutorial is to show you the steps you need to perform in ServiceNow and Azure AD to automatically provision and de-provision user accounts from Azure AD to ServiceNow.

> [!NOTE]
> This tutorial describes a connector built on top of the Azure AD User Provisioning Service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Azure Active Directory](../manage-apps/user-provisioning.md).

## Prerequisites

To configure Azure AD integration with ServiceNow, you need the following items:

- An Azure AD subscription
- For ServiceNow, an instance or tenant of ServiceNow, Calgary version or higher
- For ServiceNow Express, an instance of ServiceNow Express, Helsinki version or higher

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can [get a one-month trial](https://azure.microsoft.com/pricing/free-trial/).


## Assigning users to ServiceNow

Azure Active Directory uses a concept called "assignments" to determine which users should receive access to selected apps. In the context of automatic user account provisioning, only the users and groups that have been "assigned" to an application in Azure AD is synchronized.

Before configuring and enabling the provisioning service, you need to decide what users and/or groups in Azure AD represent the users who need access to your ServiceNow app. Once decided, you can assign these users to your ServiceNow app by following the instructions here:
[Assign a user or group to an enterprise app](https://docs.microsoft.com/azure/active-directory/active-directory-coreapps-assign-user-azure-portal)


> [!IMPORTANT]
>*   It is recommended that a single Azure AD user is assigned to ServiceNow to test the provisioning configuration. Additional users and/or groups may be assigned later.
>*   When assigning a user to ServiceNow, you must select a valid user role. The "Default Access" role does not work for provisioning.

## Enable automated user provisioning

This section guides you through connecting your Azure AD to ServiceNow's user account provisioning API, and configuring the provisioning service to create, update, and disable assigned user accounts in ServiceNow based on user and group assignment in Azure AD.

> [!TIP]
>You may also choose to enabled SAML-based Single Sign-On for ServiceNow, following the instructions provided in [Azure portal](https://portal.azure.com). Single sign-on can be configured independently of automatic provisioning, though these two features compliment each other.

### Configure automatic user account provisioning

1. In the [Azure portal](https://portal.azure.com), browse to the **Azure Active Directory > Enterprise Apps > All applications** section.

1. If you have already configured ServiceNow for single sign-on, search for your instance of ServiceNow using the search field. Otherwise, select **Add** and search for **ServiceNow** in the application gallery. Select ServiceNow from the search results, and add it to your list of applications.

1. Select your instance of ServiceNow, then select the **Provisioning** tab.

1. Set the **Provisioning** Mode to **Automatic**. 

    ![provisioning](./media/servicenow-provisioning-tutorial/provisioning.png)

1. Under the Admin Credentials section, perform the following steps:
   
    a. In the **ServiceNow Instance Name** textbox, type the ServiceNow instance name.

    b. In the **ServiceNow Admin User Name** textbox, type the user name of an administrator.

    c. In the **ServiceNow Admin Password** textbox, the administrator's password.

1. In the Azure portal, click **Test Connection** to ensure Azure AD can connect to your ServiceNow app. If the connection fails, ensure your ServiceNow account has Team Admin permissions and try the **"Admin Credentials"** step again.

1. Enter the email address of a person or group who should receive provisioning error notifications in the **Notification Email** field, and check the checkbox.

1. Click **Save.**

1. Under the Mappings section, select **Synchronize Azure Active Directory Users to ServiceNow.**

1. In the **Attribute Mappings** section, review the user attributes that are synchronized from Azure AD to ServiceNow. The attributes selected as **Matching** properties are used to match the user accounts in ServiceNow for update operations. Select the Save button to commit any changes.

1. To enable the Azure AD provisioning service for ServiceNow, change the **Provisioning Status** to **On** in the Settings section

1. Click **Save.**

It starts the initial synchronization of any users and/or groups assigned to ServiceNow in the Users and Groups section. The initial sync takes longer to perform than subsequent syncs, which occur approximately every 40 minutes as long as the service is running. You can use the **Synchronization Details** section to monitor progress and follow links to provisioning activity logs, which describe all actions performed by the provisioning service on your ServiceNow app.

For more information on how to read the Azure AD provisioning logs, see [Reporting on automatic user account provisioning](../manage-apps/check-status-user-account-provisioning.md).

## Additional resources

* [Managing user account provisioning for Enterprise Apps](tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)
* [Configure Single Sign-on](servicenow-tutorial.md)


