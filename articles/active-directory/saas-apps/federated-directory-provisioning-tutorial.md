---
title: 'Tutorial: Configure Federated Directory for automatic user provisioning with Azure Active Directory | Microsoft Docs'
description: Learn how to configure Azure Active Directory to automatically provision and de-provision user accounts to Federated Directory.
services: active-directory
documentationcenter: ''
author: zchia
writer: zchia
manager: beatrizd

ms.assetid: na
ms.service: active-directory
ms.component: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/12/2019
ms.author: zhchia
---

# Tutorial: Configure Federated Directory for automatic user provisioning

The objective of this tutorial is to demonstrate the steps to be performed in Federated Directory and Azure Active Directory (Azure AD) to configure Azure AD to automatically provision and de-provision users and/or groups to Federated Directory.

> [!NOTE]
>  This tutorial describes a connector built on top of the Azure AD User Provisioning Service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Azure Active Directory](../manage-apps/user-provisioning.md).
>
> This connector is currently in Public Preview. For more information on the general Microsoft Azure terms of use for Preview features, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* An Azure AD tenant.
* [A Federated Directory](https://www.federated.directory/pricing).
* A user account in Federated Directory with Admin permissions.

## Assign Users to Federated Directory
Azure Active Directory uses a concept called assignments to determine which users should receive access to selected apps. In the context of automatic user provisioning, only the users and/or groups that have been assigned to an application in Azure AD are synchronized.

Before configuring and enabling automatic user provisioning, you should decide which users and/or groups in Azure AD need access to Federated Directory. Once decided, you can assign these users and/or groups to Federated Directory by following the instructions here:

 * [Assign a user or group to an enterprise app](../manage-apps/assign-user-or-group-access-portal.md) 
 
 ## Important tips for assigning users to Federated Directory
 * It is recommended that a single Azure AD user is assigned to Federated Directory to test the automatic user provisioning configuration. Additional users and/or groups may be assigned later.

* When assigning a user to Federated Directory, you must select any valid application-specific role (if available) in the assignment dialog. Users with the Default Access role are excluded from provisioning.
	
 ## Set up Federated Directory for provisioning

Before configuring Federated Directory for automatic user provisioning with Azure AD, you will need to enable SCIM provisioning on Federated Directory.

1. Sign in to your [Federated Directory Admin Console](https://federated.directory/of)

	![Federated Directory tutorial](media/federated-directory-provisioning-tutorial/companyname.png)

2. Navigate to **Directories > User directories** and select your tenant. 

	![federated directory](media/federated-directory-provisioning-tutorial/ad-user-directories.png)

3. 	To generate a permanent bearer token, navigate to **Directory Keys > Create New Key.** 

	![federated directory](media/federated-directory-provisioning-tutorial/federated01.png)

4. Create a directory key. 

	![federated directory](media/federated-directory-provisioning-tutorial/federated02.png)
	

5. Copy the **Access Token** value. This value will be entered in the **Secret Token** field in the Provisioning tab of your Federated Directory application in the Azure portal. 

	![federated directory](media/federated-directory-provisioning-tutorial/federated03.png)
	
## Add Federated Directory from the gallery

To configure Federated Directory for automatic user provisioning with Azure AD, you need to add Federated Directory from the Azure AD application gallery to your list of managed SaaS applications.

**To add Federated Directory from the Azure AD application gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, in the left navigation panel, select **Azure Active Directory**.

	![The Azure Active Directory button](common/select-azuread.png)

2. Go to **Enterprise applications**, and then select **All applications**.

	![The Enterprise applications blade](common/enterprise-applications.png)

3. To add a new application, select the **New application** button at the top of the pane.

	![The New application button](common/add-new-app.png)

4. In the search box, enter **Federated Directory**, select **Federated Directory** in the results panel.

	![Federated Directory in the results list](common/search-new-app.png)

5. Navigate to the **URL** highlighted below in a separate browser. 

	![federated directory](media/federated-directory-provisioning-tutorial/loginpage1.png)

6. Click **LOG IN**.

	![federated directory](media/federated-directory-provisioning-tutorial/federated04.png)

7.  As Federated Directory is an OpenIDConnect app, choose to login to Federated Directory using your Microsoft work account.
	
	![federated directory](media/federated-directory-provisioning-tutorial/loginpage3.png)
 
8. After a successful authentication, accept the consent prompt for the consent page. The application will then be automatically added to your tenant and you will be redirected to your Federated Directory account.

	![federated directory Add SCIM](media/federated-directory-provisioning-tutorial/premission.png)



## Configuring automatic user provisioning to Federated Directory 

This section guides you through the steps to configure the Azure AD provisioning service to create, update, and disable users and/or groups in Federated Directory based on user and/or group assignments in Azure AD.

### To configure automatic user provisioning for Federated Directory in Azure AD:

1. Sign in to the [Azure portal](https://portal.azure.com). Select **Enterprise Applications**, then select **All applications**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **Federated Directory**.

	![The Federated Directory link in the Applications list](common/all-applications.png)

3. Select the **Provisioning** tab.

	![Provisioning tab](common/provisioning.png)

4. Set the **Provisioning Mode** to **Automatic**.

	![Provisioning tab](common/provisioning-automatic.png)

5. Under the **Admin Credentials** section, input `https://api.federated.directory/v2/` in Tenant URL. Input the value that you retrieved and saved earlier from Federated Directory in **Secret Token**. Click **Test Connection** to ensure Azure AD can connect to Federated Directory. If the connection fails, ensure your Federated Directory account has Admin permissions and try again.

	![Tenant URL + Token](common/provisioning-testconnection-tenanturltoken.png)

8. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and check the checkbox - **Send an email notification when a failure occurs**.

	![Notification Email](common/provisioning-notification-email.png)

9. Click **Save**.

10. Under the **Mappings** section, select **Synchronize Azure Active Directory Users to Federated Directory**.

	![Federated Directory tutorial](media/federated-directory-provisioning-tutorial/user-mappings.png)
	
	
11. Review the user attributes that are synchronized from Azure AD to Federated Directory in the **Attribute Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in Federated Directory for update operations. Select the **Save** button to commit any changes.

	![Federated Directory tutorial](media/federated-directory-provisioning-tutorial/user-attributes.png)
	

12. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](../manage-apps/define-conditional-rules-for-provisioning-user-accounts.md).

13. To enable the Azure AD provisioning service for Federated Directory, change the **Provisioning Status** to **On** in the **Settings** section.

	![Provisioning Status Toggled On](common/provisioning-toggle-on.png)

14. Define the users and/or groups that you would like to provision to Federated Directory by choosing the desired values in **Scope** in the **Settings** section.

	![Provisioning Scope](common/provisioning-scope.png)

15. When you are ready to provision, click **Save**.

	![Saving Provisioning Configuration](common/provisioning-configuration-save.png)

This operation starts the initial synchronization of all users and/or groups defined in **Scope** in the **Settings** section. The initial sync takes longer to perform than subsequent syncs, which occur approximately every 40 minutes as long as the Azure AD provisioning service is running. You can use the **Synchronization Details** section to monitor progress and follow links to provisioning activity report, which describes all actions performed by the Azure AD provisioning service on Federated Directory.

For more information on how to read the Azure AD provisioning logs, see [Reporting on automatic user account provisioning](../manage-apps/check-status-user-account-provisioning.md)
## Additional resources

* [Managing user account provisioning for Enterprise Apps](../manage-apps/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../manage-apps/check-status-user-account-provisioning.md)