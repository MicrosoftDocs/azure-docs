---
title: 'Tutorial: Configure Dialpad for automatic user provisioning with Azure Active Directory | Microsoft Docs'
description: Learn how to configure Azure Active Directory to automatically provision and de-provision user accounts to Dialpad.
services: active-directory
documentationcenter: ''
author: zchia
writer: zchia
manager: beatrizd

ms.assetid: na
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/28/2019
ms.author: zhchia
---

# Tutorial: Configure Dialpad for automatic user provisioning

The objective of this tutorial is to demonstrate the steps to be performed in Dialpad and Azure Active Directory (Azure AD) to configure Azure AD to automatically provision and de-provision users and/or groups to Dialpad.

> [!NOTE]
>  This tutorial describes a connector built on top of the Azure AD User Provisioning Service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Azure Active Directory](../app-provisioning/user-provisioning.md).

> This connector is currently in Preview. For more information on the general Microsoft Azure terms of use for Preview features, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* An Azure AD tenant.
* [A Dialpad tenant](https://www.dialpad.com/pricing/).
* A user account in Dialpad with Admin permissions.

## Assign Users to Dialpad
Azure Active Directory uses a concept called assignments to determine which users should receive access to selected apps. In the context of automatic user provisioning, only the users and/or groups that have been assigned to an application in Azure AD are synchronized.

Before configuring and enabling automatic user provisioning, you should decide which users and/or groups in Azure AD need access to Dialpad. Once decided, you can assign these users and/or groups to Dialpad by following the instructions here:
 
* [Assign a user or group to an enterprise app](../manage-apps/assign-user-or-group-access-portal.md) 

 ## Important tips for assigning users to Dialpad

 * It is recommended that a single Azure AD user is assigned to Dialpad to test the automatic user provisioning configuration. Additional users and/or groups may be assigned later.

* When assigning a user to Dialpad, you must select any valid application-specific role (if available) in the assignment dialog. Users with the Default Access role are excluded from provisioning.

## Setup Dialpad for provisioning

Before configuring Dialpad for automatic user provisioning with Azure AD, you will need to retrieve some provisioning information from Dialpad.

1. Sign in to your [Dialpad Admin Console](https://dialpadbeta.com/login) and select **Admin settings**. Ensure that **My Company** is selected from the dropdown. Navigate to **Authentication > API Keys**.

	![Dialpad Add SCIM](media/dialpad-provisioning-tutorial/dialpad01.png)

2. Generate a new key by clicking **Add a key** and configuring the properties of your secret token.

	![Dialpad Add SCIM](media/dialpad-provisioning-tutorial/dialpad02.png)

	![Dialpad Add SCIM](media/dialpad-provisioning-tutorial/dialpad03.png)

3. Click the **Click to show value** button for your recently created API key and copy the value shown. This value will be entered in the **Secret Token** field in the Provisioning tab of your Dialpad application in the Azure portal. 

	![Dialpad Create Token](media/dialpad-provisioning-tutorial/dialpad04.png)

## Add Dialpad from the gallery

To configuring Dialpad for automatic user provisioning with Azure AD, you need to add Dialpad from the Azure AD application gallery to your list of managed SaaS applications.

**To add Dialpad from the Azure AD application gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, in the left navigation panel, select **Azure Active Directory**.

	![The Azure Active Directory button](common/select-azuread.png)

2. Go to **Enterprise applications**, and then select **All applications**.

	![The Enterprise applications blade](common/enterprise-applications.png)

3. To add a new application, select the **New application** button at the top of the pane.

	![The New application button](common/add-new-app.png)

4. In the search box, enter **Dialpad**, select **Dialpad** in the results panel.
	![Dialpad in the results list](common/search-new-app.png)

5. Navigate to the **URL** highlighted below in a separate browser. 

 	![Dialpad Add SCIM](media/dialpad-provisioning-tutorial/dialpad05.png)

6. In the top right-hand corner, select **Log In > Use Dialpad online**.

	![Dialpad Add SCIM](media/dialpad-provisioning-tutorial/dialpad06.png)

7. As Dialpad is an OpenIDConnect app, choose to login to Dialpad using your Microsoft work account.

	![Dialpad Add SCIM](media/dialpad-provisioning-tutorial/loginpage.png)

8. After a successful authentication, accept the consent prompt for the consent page. The application will then be automatically added to your tenant and you will be redirected to your Dialpad account.

	![Dialpad Add SCIM](media/dialpad-provisioning-tutorial/redirect.png)

 ## Configure automatic user provisioning to Dialpad

This section guides you through the steps to configure the Azure AD provisioning service to create, update, and disable users and/or groups in Dialpad based on user and/or group assignments in Azure AD.

### To configure automatic user provisioning for Dialpad in Azure AD:

1. Sign in to the [Azure portal](https://portal.azure.com). Select **Enterprise Applications**, then select **All applications**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **Dialpad**.

	![The Dialpad link in the Applications list](common/all-applications.png)

3. Select the **Provisioning** tab.

	![Provisioning tab](common/provisioning.png)

4. Set the **Provisioning Mode** to **Automatic**.

	![Provisioning tab](common/provisioning-automatic.png)

5. Under the **Admin Credentials** section, input `https://dialpad.com/scim` in **Tenant URL**. Input the value that you retrieved and saved earlier from Dialpad in **Secret Token**. Click **Test Connection** to ensure Azure AD can connect to Dialpad. If the connection fails, ensure your Dialpad account has Admin permissions and try again.

	![Tenant URL + Token](common/provisioning-testconnection-tenanturltoken.png)

6. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and check the checkbox - **Send an email notification when a failure occurs**.

	![Notification Email](common/provisioning-notification-email.png)

7. Click **Save**.

8. Under the **Mappings** section, select **Synchronize Azure Active Directory Users to Dialpad**.

	![Dialpad User Mappings](media/dialpad-provisioning-tutorial/dialpad-user-mappings-new.png)

9. Review the user attributes that are synchronized from Azure AD to Dialpad in the **Attribute Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in Dialpad for update operations. Select the **Save** button to commit any changes.

	![Dialpad User Attributes](media/dialpad-provisioning-tutorial/dialpad07.png)

10. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

11. To enable the Azure AD provisioning service for Dialpad, change the **Provisioning Status** to **On** in the **Settings** section.

	![Provisioning Status Toggled On](common/provisioning-toggle-on.png)

12. Define the users and/or groups that you would like to provision to Dialpad by choosing the desired values in **Scope** in the **Settings** section.

	![Provisioning Scope](common/provisioning-scope.png)

13. When you are ready to provision, click **Save**.

	![Saving Provisioning Configuration](common/provisioning-configuration-save.png)

This operation starts the initial synchronization of all users and/or groups defined in **Scope** in the **Settings** section. The initial sync takes longer to perform than subsequent syncs, which occur approximately every 40 minutes as long as the Azure AD provisioning service is running. You can use the **Synchronization Details** section to monitor progress and follow links to provisioning activity report, which describes all actions performed by the Azure AD provisioning service on Dialpad.

For more information on how to read the Azure AD provisioning logs, see [Reporting on automatic user account provisioning](../app-provisioning/check-status-user-account-provisioning.md)
## 	Connector limitations
* Dialpad does not support group renames today. This means that any changes to the **displayName** of a group in Azure AD will not be updated and reflected in Dialpad.

## Additional resources

* [Managing user account provisioning for Enterprise Apps](../app-provisioning/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md)
