---
title: 'Tutorial: Configure RFPIO for automatic user provisioning with Azure Active Directory | Microsoft Docs'
description: Learn how to configure Azure Active Directory to automatically provision and de-provision user accounts to RFPIO.
services: active-directory
documentationcenter: ''
author: zchia
writer: zchia
manager: beatrizd

ms.assetid: 54419db4-47d5-4fb4-ab74-7b0b28afb11b
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/26/2019
ms.author: zhchia 
---

# Tutorial: Configure RFPIO for automatic user provisioning

The objective of this tutorial is to demonstrate the steps to be performed in RFPIO and Azure Active Directory (Azure AD) to configure Azure AD to automatically provision and de-provision users and/or groups to RFPIO.

> [!NOTE]
> This tutorial describes a connector built on top of the Azure AD User Provisioning Service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Azure Active Directory](../app-provisioning/user-provisioning.md).
>
> This connector is currently in Public Preview. For more information on the general Microsoft Azure terms of use for Preview features, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* An Azure AD tenant.
* [A RFPIO tenant](https://www.rfpio.com/product/).
* A user account in RFPIO with Admin permissions.

## Assigning users to RFPIO

Azure Active Directory uses a concept called *assignments* to determine which users should receive access to selected apps. In the context of automatic user provisioning, only the users and/or groups that have been assigned to an application in Azure AD are synchronized.

Before configuring and enabling automatic user provisioning, you should decide which users and/or groups in Azure AD need access to RFPIO. Once decided, you can assign these users and/or groups to RFPIO by following the instructions here:
* [Assign a user or group to an enterprise app](../manage-apps/assign-user-or-group-access-portal.md)

## Important tips for assigning users to RFPIO

* It is recommended that a single Azure AD user is assigned to RFPIO to test the automatic user provisioning configuration. Additional users and/or groups may be assigned later.

* When assigning a user to RFPIO, you must select any valid application-specific role (if available) in the assignment dialog. Users with the **Default Access** role are excluded from provisioning.

## Setup RFPIO for provisioning

Before configuring RFPIO for automatic user provisioning with Azure AD, you will need to enable SCIM provisioning on RFPIO.

1. 	Sign in to your RFPIO Admin Console. On the bottom left of the admin console, click on **Tenant**.

	![RFPIO Admin Console](media/rfpio-provisioning-tutorial/aadtest0.png)

2.	Click **Organization Settings**.
	
	![RFPIO Admin](media/rfpio-provisioning-tutorial/aadtest.png)

3.	Navigate to **USER MANAGEMENT** > **SECURITY** > **SCIM**.

	![RFPIO Add SCIM](media/rfpio-provisioning-tutorial/scim.png)

4.	Ensure that **Auto User Provisioning** is enabled. Click on **GENERATE SCIM API TOKEN**.

	![RFPIO Create Token](media/rfpio-provisioning-tutorial/generate.png)

5.	Save the **SCIM API Token** as this token will not be displayed again for security purpose. This value will be entered in the **Secret Token** field in the Provisioning tab of your RFPIO application in the Azure portal.

	![RFPIO Create Token](media/rfpio-provisioning-tutorial/auth.png)

## Add RFPIO from the gallery

To configure RFPIO for automatic user provisioning with Azure AD, you need to add RFPIO from the Azure AD application gallery to your list of managed SaaS applications.

**To add RFPIO from the Azure AD application gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, in the left navigation panel, select **Azure Active Directory**.

	![The Azure Active Directory button](common/select-azuread.png)

2. Go to **Enterprise applications**, and then select **All applications**.

	![The Enterprise applications blade](common/enterprise-applications.png)

3. To add a new application, select the **New application** button at the top of the pane.

	![The New application button](common/add-new-app.png)

4. In the search box, enter **RFPIO**, select **RFPIO** in the results panel, and then click the 	**Add** button to add the application.

	![RFPIO in the results list](common/search-new-app.png)

## Configuring automatic user provisioning to RFPIO 

This section guides you through the steps to configure the Azure AD provisioning service to create, update, and disable users and/or groups in RFPIO based on user and/or group assignments in Azure AD.

> [!TIP]
> You may also choose to enable SAML-based single sign-on for RFPIO , following the instructions provided in the [RFPIO Single sign-on tutorial](rfpio-tutorial.md). Single sign-on can be configured independently of automatic user provisioning, though these two features compliment each other.

### To configure automatic user provisioning for RFPIO in Azure AD:

1. Sign in to the [Azure portal](https://portal.azure.com). Select **Enterprise Applications**, then select **All applications**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **RFPIO**.

	![The RFPIO link in the Applications list](common/all-applications.png)

3. Select the **Provisioning** tab.

	![Provisioning tab](common/provisioning.png)

4. Set the **Provisioning Mode** to **Automatic**.

	![Provisioning tab](common/provisioning-automatic.png)

5. Under the **Admin Credentials** section, input `https://<RFPIO tenant instance>.rfpio.com/rfpserver/scim/v2 ` in **Tenant URL**. An example value is `https://Azure-test1.rfpio.com/rfpserver/scim/v2`. Input the **SCIM API Token** value retrieved earlier in **Secret Token**. Click **Test Connection** to ensure Azure AD can connect to RFPIO. If the connection fails, ensure your RFPIO account has Admin permissions and try again.

	![Tenant URL + Token](common/provisioning-testconnection-tenanturltoken.png)

6. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and check the checkbox - **Send an email notification when a failure occurs**.

	![Notification Email](common/provisioning-notification-email.png)

7. Click **Save**.

8. Under the **Mappings** section, select **Synchronize Azure Active Directory Users to RFPIO**.

	![RFPIO User Mappings](media/rfpio-provisioning-tutorial/usermapping.png)

9. Review the user attributes that are synchronized from Azure AD to RFPIO in the **Attribute Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in RFPIO for update operations. Select the **Save** button to commit any changes.

	![RFPIO User Attributes](media/rfpio-provisioning-tutorial/userattributes.png)

10. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

11. To enable the Azure AD provisioning service for RFPIO, change the **Provisioning Status** to **On** in the **Settings** section.

	![Provisioning Status Toggled On](common/provisioning-toggle-on.png)

12. Define the users and/or groups that you would like to provision to RFPIO by choosing the desired values in **Scope** in the **Settings** section.

	![Provisioning Scope](common/provisioning-scope.png)

13. When you are ready to provision, click **Save**.

	![Saving Provisioning Configuration](common/provisioning-configuration-save.png)

This operation starts the initial synchronization of all users and/or groups defined in **Scope** in the **Settings** section. The initial sync takes longer to perform than subsequent syncs, which occur approximately every 40 minutes as long as the Azure AD provisioning service is running. You can use the **Synchronization Details** section to monitor progress and follow links to provisioning activity report, which describes all actions performed by the Azure AD provisioning service on RFPIO.

For more information on how to read the Azure AD provisioning logs, see [Reporting on automatic user account provisioning](../app-provisioning/check-status-user-account-provisioning.md).

## Connector Limitations

* RFPIO does not support groups provisioning currently.

## Additional resources

* [Managing user account provisioning for Enterprise Apps](../app-provisioning/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md)
