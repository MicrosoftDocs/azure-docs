---
title: 'Tutorial: Configure OfficeSpace Software for automatic user provisioning with Azure Active Directory | Microsoft Docs'
description: Learn how to configure Azure Active Directory to automatically provision and de-provision user accounts to OfficeSpace Software.
services: active-directory
documentationcenter: ''
author: zchia
writer: zchia
manager: beatrizd

ms.assetid: f832a0a6-ad0a-453f-a747-9cd717e11181
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/02/2019
ms.author: Zhchia
---

# Tutorial: Configure OfficeSpace Software for automatic user provisioning

The objective of this tutorial is to demonstrate the steps to be performed in OfficeSpace Software and Azure Active Directory (Azure AD) to configure Azure AD to automatically provision and de-provision users and/or groups to OfficeSpace Software.

> [!NOTE]
> This tutorial describes a connector built on top of the Azure AD User Provisioning Service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Azure Active Directory](../app-provisioning/user-provisioning.md).
>
> This connector is currently in Public Preview. For more information on the general Microsoft Azure terms of use for Preview features, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* An Azure AD tenant
* An [OfficeSpace Software tenant](https://www.officespacesoftware.com/)
* A user account in OfficeSpace Software with Admin permissions.

## Assigning users to OfficeSpace Software

Azure Active Directory uses a concept called *assignments* to determine which users should receive access to selected apps. In the context of automatic user provisioning, only the users and/or groups that have been assigned to an application in Azure AD are synchronized.

Before configuring and enabling automatic user provisioning, you should decide which users and/or groups in Azure AD need access to OfficeSpace Software. Once decided, you can assign these users and/or groups to OfficeSpace Software by following the instructions here:
* [Assign a user or group to an enterprise app](../manage-apps/assign-user-or-group-access-portal.md)

## Important tips for assigning users to OfficeSpace Software

* It is recommended that a single Azure AD user is assigned to OfficeSpace Software to test the automatic user provisioning configuration. Additional users and/or groups may be assigned later.

* When assigning a user to OfficeSpace Software, you must select any valid application-specific role (if available) in the assignment dialog. Users with the **Default Access** role are excluded from provisioning.

## Set up OfficeSpace Software for provisioning

1. Sign in to your [OfficeSpace Software Admin Console](https://support.officespacesoftware.com/hc). Navigate to **Settings > Connectors**.

	![OfficeSpace Software Admin Console](media/officespace-software-provisioning-tutorial/settings.png)

2.	Navigate to **Directory Synchronization > SCIM**.

	![OfficeSpace Software Add SCIM](media/officespace-software-provisioning-tutorial/scim.png)

3.	Copy the **SCIM Authentication Token**. This value will be entered in the Secret Token field in the Provisioning tab of your OfficeSpace Software application in the Azure portal.

	![OfficeSpace Software Create Token](media/officespace-software-provisioning-tutorial/token.png)

## Add OfficeSpace Software from the gallery

Before configuring OfficeSpace Software for automatic user provisioning with Azure AD, you need to add OfficeSpace Software from the Azure AD application gallery to your list of managed SaaS applications.

**To add OfficeSpace Software from the Azure AD application gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, in the left navigation panel, select **Azure Active Directory**.

	![The Azure Active Directory button](common/select-azuread.png)

2. Go to **Enterprise applications**, and then select **All applications**.

	![The Enterprise applications blade](common/enterprise-applications.png)

3. To add a new application, select the **New application** button at the top of the pane.

	![The New application button](common/add-new-app.png)

4. In the search box, enter **OfficeSpace Software**, select **OfficeSpace Software** in the results panel, and then click the **Add** button to add the application.

	![OfficeSpace Software in the results list](common/search-new-app.png)

## Configuring automatic user provisioning to OfficeSpace Software 

This section guides you through the steps to configure the Azure AD provisioning service to create, update, and disable users and/or groups in OfficeSpace Software based on user and/or group assignments in Azure AD.

> [!TIP]
> You may also choose to enable SAML-based single sign-on for OfficeSpace Software by following the instructions provided in the [OfficeSpace Software Single sign-on tutorial](https://docs.microsoft.com/azure/active-directory/saas-apps/officespace-tutorial). Single sign-on can be configured independently of automatic user provisioning, though these two features complement each other.

### To configure automatic user provisioning for OfficeSpace Software in Azure AD:

1. Sign in to the [Azure portal](https://portal.azure.com). Select **Enterprise Applications**, then select **All applications**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **OfficeSpace Software**.

	![The OfficeSpace Software link in the Applications list](common/all-applications.png)

3. Select the **Provisioning** tab.

	![Provisioning tab](common/provisioning.png)

4. Set the **Provisioning Mode** to **Automatic**.

	![Provisioning tab](common/provisioning-automatic.png)

5. Under the **Admin Credentials** section, input `https://<subdomain>.officespacesoftware.com/api/scim/v2/` URL format in **Tenant URL**. For example `https://contoso.officespacesoftware.com/api/scim/v2/`. Input the **SCIM Authentication Token** value retrieved earlier in **Secret Token**. Click **Test Connection** to ensure Azure AD can connect to OfficeSpace Software. If the connection fails, ensure your OfficeSpace Software account has Admin permissions and try again.

	![Tenant URL + Token](common/provisioning-testconnection-tenanturltoken.png)

6. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and select the **Send an email notification when a failure occurs** check box.

	![Notification Email](common/provisioning-notification-email.png)

7. Click **Save**.

8. Under the **Mappings** section, select **Synchronize Azure Active Directory Users to OfficeSpace Software**.

	![OfficeSpace Software User Mappings](media/officespace-software-provisioning-tutorial/usermappings.png)

9. Review the user attributes that are synchronized from Azure AD to OfficeSpace Software in the **Attribute Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in OfficeSpace Software for update operations. Select the **Save** button to commit any changes.

	![OfficeSpace Software User Attributes](media/officespace-software-provisioning-tutorial/userattributes.png)

11. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

12. To enable the Azure AD provisioning service for OfficeSpace Software, change the **Provisioning Status** to **On** in the **Settings** section.

	![Provisioning Status Toggled On](common/provisioning-toggle-on.png)

13. Define the users and/or groups that you would like to provision to OfficeSpace Software by choosing the desired values in **Scope** in the **Settings** section.

	![Provisioning Scope](common/provisioning-scope.png)

14. When you are ready to provision, click **Save**.

	![Saving Provisioning Configuration](common/provisioning-configuration-save.png)

This operation starts the initial synchronization of all users and/or groups defined in **Scope** in the **Settings** section. The initial sync takes longer to perform than subsequent syncs, which occur approximately every 40 minutes as long as the Azure AD provisioning service is running. You can use the **Synchronization Details** section to monitor progress and follow links to provisioning activity report, which describes all actions performed by the Azure AD provisioning service on OfficeSpace Software.

For more information on how to read the Azure AD provisioning logs, see [Reporting on automatic user account provisioning](../app-provisioning/check-status-user-account-provisioning.md).

## Additional resources

* [Managing user account provisioning for Enterprise Apps](../app-provisioning/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md)

