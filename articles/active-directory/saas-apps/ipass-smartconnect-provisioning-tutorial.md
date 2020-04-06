---
title: 'Tutorial: Configure iPass SmartConnect for automatic user provisioning with Azure Active Directory | Microsoft Docs'
description: Learn how to configure Azure Active Directory to automatically provision and de-provision user accounts to iPass SmartConnect.
services: active-directory
documentationcenter: ''
author: zchia
writer: zchia
manager: beatrizd

ms.assetid: 43d6de4a-b3a2-439b-95f2-8883fffded52
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/26/2019
ms.author: zhchia 
---

# Tutorial: Configure iPass SmartConnect for automatic user provisioning

The objective of this tutorial is to demonstrate the steps to be performed in iPass SmartConnect and Azure Active Directory (Azure AD) to configure Azure AD to automatically provision and de-provision users and/or groups to iPass SmartConnect.

> [!NOTE]
> This tutorial describes a connector built on top of the Azure AD User Provisioning Service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Azure Active Directory](../app-provisioning/user-provisioning.md).
>
> This connector is currently in Public Preview. For more information on the general Microsoft Azure terms of use for Preview features, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* An Azure AD tenant.
* [A iPass SmartConnect tenant](https://www.ipass.com/buy-ipass/).
* A user account in iPass SmartConnect with Admin permissions.

## Assigning users to iPass SmartConnect

Azure Active Directory uses a concept called *assignments* to determine which users should receive access to selected apps. In the context of automatic user provisioning, only the users and/or groups that have been assigned to an application in Azure AD are synchronized.

Before configuring and enabling automatic user provisioning, you should decide which users and/or groups in Azure AD need access to iPass SmartConnect. Once decided, you can assign these users and/or groups to iPass SmartConnect by following the instructions here:
* [Assign a user or group to an enterprise app](../manage-apps/assign-user-or-group-access-portal.md)

## Important tips for assigning users to iPass SmartConnect

* It is recommended that a single Azure AD user is assigned to iPass SmartConnect to test the automatic user provisioning configuration. Additional users and/or groups may be assigned later.

* When assigning a user to iPass SmartConnect, you must select any valid application-specific role (if available) in the assignment dialog. Users with the **Default Access** role are excluded from provisioning.

## Setup iPass SmartConnect for provisioning

Before configuring iPass SmartConnect for automatic user provisioning with Azure AD, you will need to retrieve configuration information from the iPass SmartConnect admin console:

1. To retrieve the bearer token that is needed to authenticate against your iPass SmartConnect SCIM endpoint, refer to the very first time that you set up iPass SmartConnect as this value is only provided then. 
2. If you do not have the bearer token, reach out to [iPass SmartConnect's support team](mailto:help@ipass.com) to retrieve a new one.

## Add iPass SmartConnect from the gallery

To configure iPass SmartConnect for automatic user provisioning with Azure AD, you need to add iPass SmartConnect from the Azure AD application gallery to your list of managed SaaS applications.

**To add iPass SmartConnect from the Azure AD application gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, in the left navigation panel, select **Azure Active Directory**.

	![The Azure Active Directory button](common/select-azuread.png)

2. Go to **Enterprise applications**, and then select **All applications**.

	![The Enterprise applications blade](common/enterprise-applications.png)

3. To add a new application, select the **New application** button at the top of the pane.

	![The New application button](common/add-new-app.png)

4. In the search box, enter **iPass SmartConnect**, select **iPass SmartConnect** in the results panel, and then click the **Add** button to add the application.

	![iPass SmartConnect in the results list](common/search-new-app.png)

## Configuring automatic user provisioning to iPass SmartConnect 

This section guides you through the steps to configure the Azure AD provisioning service to create, update, and disable users and/or groups in iPass SmartConnect based on user and/or group assignments in Azure AD.

> [!TIP]
>  You may also choose to enable SAML-based single sign-on for BitaBIZ , following the instructions provided in the [iPass SmartConnect Single sign-on tutorial](ipasssmartconnect-tutorial.md). Single sign-on can be configured independently of automatic user provisioning, though these two features compliment each other.

### To configure automatic user provisioning for iPass SmartConnect in Azure AD:

1. Sign in to the [Azure portal](https://portal.azure.com). Select **Enterprise Applications**, then select **All applications**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **iPass SmartConnect**.

	![The iPass SmartConnect link in the Applications list](common/all-applications.png)

3. Select the **Provisioning** tab.

	![Provisioning tab](common/provisioning.png)

4. Set the **Provisioning Mode** to **Automatic**.

	![Provisioning tab](common/provisioning-automatic.png)

5. Under the **Admin Credentials** section, input `https://openmobile.ipass.com/moservices/scim/v1` in **Tenant URL**. Enter the bearer token retrieved earlier in **Secret Token**. Click **Test Connection** to ensure Azure AD can connect to iPass SmartConnect. If the connection fails, ensure that your iPass SmartConnect account has Admin permissions and try again.

	![Tenant URL + Token](common/provisioning-testconnection-tenanturltoken.png)

6. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and check the checkbox - **Send an email notification when a failure occurs**.

	![Notification Email](common/provisioning-notification-email.png)

7. Click **Save**.

8. Under the **Mappings** section, select **Synchronize Azure Active Directory Users to iPass SmartConnect**.

	![iPass SmartConnect User Mappings](media/ipass-smartconnect-provisioning-tutorial/usermapping.png)

9. Review the user attributes that are synchronized from Azure AD to iPass SmartConnect in the **Attribute Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in iPass SmartConnect for update operations. Select the **Save** button to commit any changes.

	![iPass SmartConnect User Mappings](media/ipass-smartconnect-provisioning-tutorial/userattribute.png)


10. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

11. To enable the Azure AD provisioning service for iPass SmartConnect, change the **Provisioning Status** to **On** in the **Settings** section.

	![Provisioning Status Toggled On](common/provisioning-toggle-on.png)

12. Define the users and/or groups that you would like to provision to iPass SmartConnect by choosing the desired values in **Scope** in the **Settings** section.

	![Provisioning Scope](common/provisioning-scope.png)

13. When you are ready to provision, click **Save**.

	![Saving Provisioning Configuration](common/provisioning-configuration-save.png)

This operation starts the initial synchronization of all users and/or groups defined in **Scope** in the **Settings** section. The initial sync takes longer to perform than subsequent syncs, which occur approximately every 40 minutes as long as the Azure AD provisioning service is running. You can use the **Synchronization Details** section to monitor progress and follow links to provisioning activity report, which describes all actions performed by the Azure AD provisioning service on iPass SmartConnect.

For more information on how to read the Azure AD provisioning logs, see [Reporting on automatic user account provisioning](../app-provisioning/check-status-user-account-provisioning.md).

## Connector limitations

* iPass SmartConnect only accepts usernames that have their domains registered in the iPass SmartConnect admin console.  

## Additional resources

* [Managing user account provisioning for Enterprise Apps](../app-provisioning/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md)
