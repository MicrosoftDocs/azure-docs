---
title: 'Tutorial: Configure Federated Directory for automatic user provisioning with Microsoft Entra ID'
description: Learn how to configure Microsoft Entra ID to automatically provision and de-provision user accounts to Federated Directory.
services: active-directory
author: twimmers
writer: twimmers
manager: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 11/21/2022
ms.author: thwimmer
---

# Tutorial: Configure Federated Directory for automatic user provisioning

The objective of this tutorial is to demonstrate the steps to be performed in Federated Directory and Microsoft Entra ID to configure Microsoft Entra ID to automatically provision and de-provision users and/or groups to Federated Directory.

> [!NOTE]
>  This tutorial describes a connector built on top of the Microsoft Entra user Provisioning Service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Microsoft Entra ID](../app-provisioning/user-provisioning.md).
>

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* A Microsoft Entra tenant.
* [A Federated Directory](https://www.federated.directory/pricing).
* A user account in Federated Directory with Admin permissions.

## Assign Users to Federated Directory
Microsoft Entra ID uses a concept called assignments to determine which users should receive access to selected apps. In the context of automatic user provisioning, only the users and/or groups that have been assigned to an application in Microsoft Entra ID are synchronized.

Before configuring and enabling automatic user provisioning, you should decide which users and/or groups in Microsoft Entra ID need access to Federated Directory. Once decided, you can assign these users and/or groups to Federated Directory by following the instructions here:

 * [Assign a user or group to an enterprise app](../manage-apps/assign-user-or-group-access-portal.md) 
 
 ## Important tips for assigning users to Federated Directory
 * It is recommended that a single Microsoft Entra user is assigned to Federated Directory to test the automatic user provisioning configuration. Additional users and/or groups may be assigned later.

* When assigning a user to Federated Directory, you must select any valid application-specific role (if available) in the assignment dialog. Users with the Default Access role are excluded from provisioning.
	
 ## Set up Federated Directory for provisioning

Before configuring Federated Directory for automatic user provisioning with Microsoft Entra ID, you will need to enable SCIM provisioning on Federated Directory.

1. Sign in to your [Federated Directory Admin Console](https://federated.directory/of)

	:::image type="content" source="media/federated-directory-provisioning-tutorial/companyname.png" alt-text="Screenshot of the Federated Directory admin console showing a field for entering a company name. Sign in buttons are also visible." border="false":::

2. Navigate to **Directories > User directories** and select your tenant. 

	:::image type="content" source="media/federated-directory-provisioning-tutorial/ad-user-directories.png" alt-text="Screenshot of the Federated Directory admin console, with Directories and Federated Directory Microsoft Entra ID Test highlighted." border="false":::

3. 	To generate a permanent bearer token, navigate to **Directory Keys > Create New Key.** 

	:::image type="content" source="media/federated-directory-provisioning-tutorial/federated01.png" alt-text="Screenshot of the Directory keys page of the Federated Directory admin console. The Create new key button is highlighted." border="false":::

4. Create a directory key. 

	:::image type="content" source="media/federated-directory-provisioning-tutorial/federated02.png" alt-text="Screenshot of the Create directory key page of the Federated Directory admin console, with Name and Description fields and a Create key button." border="false":::
	

5. Copy the **Access Token** value. This value will be entered in the **Secret Token** field in the Provisioning tab of your Federated Directory application. 

	:::image type="content" source="media/federated-directory-provisioning-tutorial/federated03.png" alt-text="Screenshot of a page in the Federated Directory admin console. An access token placeholder and a key name, description, and issuer are visible." border="false":::
	
## Add Federated Directory from the gallery

To configure Federated Directory for automatic user provisioning with Microsoft Entra ID, you need to add Federated Directory from the Microsoft Entra application gallery to your list of managed SaaS applications.

**To add Federated Directory from the Microsoft Entra application gallery, perform the following steps:**

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the **Add from the gallery** section, type **Federated Directory**, select **Federated Directory** in the results panel.

	![Federated Directory in the results list](common/search-new-app.png)

5. Navigate to the **URL** highlighted below in a separate browser. 

	:::image type="content" source="media/federated-directory-provisioning-tutorial/loginpage1.png" alt-text="Screenshot of a page in the Azure portal that displays information on Federated Directory. The U R L value is highlighted." border="false":::

6. Click **LOG IN**.

	:::image type="content" source="media/federated-directory-provisioning-tutorial/federated04.png" alt-text="Screenshot of the main menu on the Federated Directory site. The Log in button is highlighted." border="false":::

7.  As Federated Directory is an OpenIDConnect app, choose to login to Federated Directory using your Microsoft work account.
	
	:::image type="content" source="media/federated-directory-provisioning-tutorial/loginpage3.png" alt-text="Screenshot of the S C I M A D test page on the Federated Directory site. Log in with your Microsoft account is highlighted." border="false":::
 
8. After a successful authentication, accept the consent prompt for the consent page. The application will then be automatically added to your tenant and you will be redirected to your Federated Directory account.

	![federated directory Add SCIM](media/federated-directory-provisioning-tutorial/premission.png)



## Configuring automatic user provisioning to Federated Directory 

This section guides you through the steps to configure the Microsoft Entra provisioning service to create, update, and disable users and/or groups in Federated Directory based on user and/or group assignments in Microsoft Entra ID.

<a name='to-configure-automatic-user-provisioning-for-federated-directory-in-azure-ad'></a>

### To configure automatic user provisioning for Federated Directory in Microsoft Entra ID:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications**

	![Enterprise applications blade](common/enterprise-applications.png)

1. In the applications list, select **Federated Directory**.

	![The Federated Directory link in the Applications list](common/all-applications.png)

3. Select the **Provisioning** tab.

	![Screenshot of the Manage options with the Provisioning option called out.](common/provisioning.png)

4. Set the **Provisioning Mode** to **Automatic**.

	![Screenshot of the Provisioning Mode dropdown list with the Automatic option called out.](common/provisioning-automatic.png)

5. Under the **Admin Credentials** section, input `https://api.federated.directory/v2/` in Tenant URL. Input the value that you retrieved and saved earlier from Federated Directory in **Secret Token**. Click **Test Connection** to ensure Microsoft Entra ID can connect to Federated Directory. If the connection fails, ensure your Federated Directory account has Admin permissions and try again.

	![Tenant URL + Token](common/provisioning-testconnection-tenanturltoken.png)

8. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and check the checkbox - **Send an email notification when a failure occurs**.

	![Notification Email](common/provisioning-notification-email.png)

9. Click **Save**.

10. Under the **Mappings** section, select **Synchronize Microsoft Entra users to Federated Directory**.

	:::image type="content" source="media/federated-directory-provisioning-tutorial/user-mappings.png" alt-text="Screenshot of the Mappings section. Under Name, Synchronize Microsoft Entra users to Federated Directory is highlighted." border="false":::
	
	
11. Review the user attributes that are synchronized from Microsoft Entra ID to Federated Directory in the **Attribute Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in Federated Directory for update operations. Select the **Save** button to commit any changes.

	:::image type="content" source="media/federated-directory-provisioning-tutorial/user-attributes.png" alt-text="Screenshot of the Attribute Mappings page. A table lists Microsoft Entra ID and Federated Directory attributes and the matching status." border="false":::
	

12. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

13. To enable the Microsoft Entra provisioning service for Federated Directory, change the **Provisioning Status** to **On** in the **Settings** section.

	![Provisioning Status Toggled On](common/provisioning-toggle-on.png)

14. Define the users and/or groups that you would like to provision to Federated Directory by choosing the desired values in **Scope** in the **Settings** section.

	![Provisioning Scope](common/provisioning-scope.png)

15. When you are ready to provision, click **Save**.

	![Saving Provisioning Configuration](common/provisioning-configuration-save.png)

This operation starts the initial synchronization of all users and/or groups defined in **Scope** in the **Settings** section. The initial sync takes longer to perform than subsequent syncs, which occur approximately every 40 minutes as long as the Microsoft Entra provisioning service is running. You can use the **Synchronization Details** section to monitor progress and follow links to provisioning activity report, which describes all actions performed by the Microsoft Entra provisioning service on Federated Directory.

For more information on how to read the Microsoft Entra provisioning logs, see [Reporting on automatic user account provisioning](../app-provisioning/check-status-user-account-provisioning.md)
## Additional resources

* [Managing user account provisioning for Enterprise Apps](../app-provisioning/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md)
