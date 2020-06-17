---
title: 'Tutorial: Configure SmartFile for automatic user provisioning with Azure Active Directory | Microsoft Docs'
description: Learn how to configure Azure Active Directory to automatically provision and de-provision user accounts to SmartFile.
services: active-directory
documentationcenter: ''
author: zchia
writer: zchia
manager: beatrizd

ms.assetid: 5eeff992-a84f-4f88-a360-9accbd077538
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/26/2019
ms.author: zhchia
---

# Tutorial: Configure SmartFile for automatic user provisioning

The objective of this tutorial is to demonstrate the steps to be performed in SmartFile and Azure Active Directory (Azure AD) to configure Azure AD to automatically provision and de-provision users and/or groups to SmartFile.

> [!NOTE]
> This tutorial describes a connector built on top of the Azure AD User Provisioning Service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Azure Active Directory](../app-provisioning/user-provisioning.md).
>
> This connector is currently in Public Preview. For more information on the general Microsoft Azure terms of use for Preview features, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* An Azure AD tenant.
* [A SmartFile tenant](https://www.SmartFile.com/pricing/).
* A user account in SmartFile with Admin permissions.

## Assigning users to SmartFile

Azure Active Directory uses a concept called *assignments* to determine which users should receive access to selected apps. In the context of automatic user provisioning, only the users and/or groups that have been assigned to an application in Azure AD are synchronized.

Before configuring and enabling automatic user provisioning, you should decide which users and/or groups in Azure AD need access to SmartFile. Once decided, you can assign these users and/or groups to SmartFile by following the instructions here:
* [Assign a user or group to an enterprise app](../manage-apps/assign-user-or-group-access-portal.md)

## Important tips for assigning users to SmartFile

* It is recommended that a single Azure AD user is assigned to SmartFile to test the automatic user provisioning configuration. Additional users and/or groups may be assigned later.

* When assigning a user to SmartFile, you must select any valid application-specific role (if available) in the assignment dialog. Users with the **Default Access** role are excluded from provisioning.

## Setup SmartFile for provisioning

Before configuring SmartFile for automatic user provisioning with Azure AD, you will need to enable SCIM provisioning on SmartFile and collect additional details needed.

1. Sign into your SmartFile Admin Console. Navigate to the top-right hand corner of the SmartFile Admin Console. Select **Product Key**.

	![SmartFile Admin Console](media/smartfile-provisioning-tutorial/login.png)

2. To generate a bearer token, copy the **Product Key** and **Product Password**. Paste them in a notepad with a colon in between them.
 	
	 ![SmartFile Add SCIM](media/smartfile-provisioning-tutorial/auth.png)

	![SmartFile Add SCIM](media/smartfile-provisioning-tutorial/key.png)

## Add SmartFile from the gallery

To configure SmartFile for automatic user provisioning with Azure AD, you need to add SmartFile from the Azure AD application gallery to your list of managed SaaS applications.

**To add SmartFile from the Azure AD application gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, in the left navigation panel, select **Azure Active Directory**.

	![The Azure Active Directory button](common/select-azuread.png)

2. Go to **Enterprise applications**, and then select **All applications**.

	![The Enterprise applications blade](common/enterprise-applications.png)

3. To add a new application, select the **New application** button at the top of the pane.

	![The New application button](common/add-new-app.png)

4. In the search box, enter **SmartFile**, select **SmartFile** in the results panel, and then click the **Add** button to add the application.

	![SmartFile in the results list](common/search-new-app.png)

## Configuring automatic user provisioning to SmartFile 

This section guides you through the steps to configure the Azure AD provisioning service to create, update, and disable users and/or groups in SmartFile based on user and/or group assignments in Azure AD.

> [!TIP]
> You may also choose to enable SAML-based single sign-on for SmartFile , following the instructions provided in the [SmartFile Single sign-on tutorial](SmartFile-tutorial.md). Single sign-on can be configured independently of automatic user provisioning, though these two features compliment each other

### To configure automatic user provisioning for SmartFile in Azure AD:

1. Sign in to the [Azure portal](https://portal.azure.com). Select **Enterprise Applications**, then select **All applications**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **SmartFile**.

	![The SmartFile link in the Applications list](common/all-applications.png)

3. Select the **Provisioning** tab.

	![Provisioning tab](common/provisioning.png)

4. Set the **Provisioning Mode** to **Automatic**.

	![Provisioning tab](common/provisioning-automatic.png)

5.  Under the **Admin Credentials** section, input `https://<SmartFile sitename>.smartfile.com/ftp/scim` in **Tenant URL**. An example would look like `https://demo1test.smartfile.com/ftp/scim`. Enter the **Bearer token** value (ProductKey:ProductPassword) that you retrieved earlier in **Secret Token**. Click **Test Connection** to ensure Azure AD can connect to SmartFile. If the connection fails, ensure your SmartFile account has Admin permissions and try again.

	![Tenant URL + Token](common/provisioning-testconnection-tenanturltoken.png)

6. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and check the checkbox - **Send an email notification when a failure occurs**.

	![Notification Email](common/provisioning-notification-email.png)

7. Click **Save**.

8. Under the **Mappings** section, select **Synchronize Azure Active Directory Users to SmartFile**.

	![SmartFile User Mappings](media/smartfile-provisioning-tutorial/usermapping.png)

9. Review the user attributes that are synchronized from Azure AD to SmartFile in the **Attribute Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in SmartFile for update operations. Select the **Save** button to commit any changes.

	![SmartFile User Attributes](media/smartfile-provisioning-tutorial/userattribute.png)

10. Under the **Mappings** section, select **Synchronize Azure Active Directory Groups to SmartFile**.

	![SmartFile Group Mappings](media/smartfile-provisioning-tutorial/groupmapping.png)

11. Review the group attributes that are synchronized from Azure AD to SmartFile in the **Attribute Mapping** section. The attributes selected as **Matching** properties are used to match the groups in SmartFile for update operations. Select the **Save** button to commit any changes.

	![SmartFile Group Attributes](media/smartfile-provisioning-tutorial/groupattribute.png)

12. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

13. To enable the Azure AD provisioning service for SmartFile, change the **Provisioning Status** to **On** in the **Settings** section.

	![Provisioning Status Toggled On](common/provisioning-toggle-on.png)

14. Define the users and/or groups that you would like to provision to SmartFile by choosing the desired values in **Scope** in the **Settings** section.

	![Provisioning Scope](common/provisioning-scope.png)

15. When you are ready to provision, click **Save**.

	![Saving Provisioning Configuration](common/provisioning-configuration-save.png)

	This operation starts the initial synchronization of all users and/or groups defined in **Scope** in the **Settings** section. The initial sync takes longer to perform than subsequent syncs, which occur approximately every 40 minutes as long as the Azure AD provisioning service is running. You can use the **Synchronization Details** section to monitor progress and follow links to provisioning activity report, which describes all actions performed by the Azure AD provisioning service on SmartFile.

	For more information on how to read the Azure AD provisioning logs, see [Reporting on automatic user account provisioning](../app-provisioning/check-status-user-account-provisioning.md)
	
## Connector limitations

* SmartFile only supports hard deletes. 

## Additional resources

* [Managing user account provisioning for Enterprise Apps](../app-provisioning/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)

## Next steps

 [Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md)
