---
title: 'Tutorial: Configure Harness for automatic user provisioning with Azure Active Directory | Microsoft Docs'
description: Learn how to configure Azure Active Directory to automatically provision and de-provision user accounts to Harness.
services: active-directory
documentationcenter: ''
author: zchia
writer: zchia
manager: beatrizd

ms.assetid: 0cdb970b-440b-4e7c-9118-2f03baab6a20
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/29/2019
ms.author: Zhchia
---

# Tutorial: Configure Harness for automatic user provisioning

The objective of this tutorial is to demonstrate the steps to be performed in Harness and Azure Active Directory (Azure AD) to configure Azure AD to automatically provision and de-provision users and/or groups to Harness.

> [!NOTE]
> This tutorial describes a connector built on top of the Azure AD User Provisioning Service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Azure Active Directory](../manage-apps/user-provisioning.md).
>
> This connector is currently in Public Preview. For more information on the general Microsoft Azure terms of use for Preview features, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* An Azure AD tenant
* [A Harness tenant](https://harness.io/pricing/)
* A user account in Harness with Admin permissions.

## Assigning users to Harness

Azure Active Directory uses a concept called *assignments* to determine which users should receive access to selected apps. In the context of automatic user provisioning, only the users and/or groups that have been assigned to an application in Azure AD are synchronized.

Before configuring and enabling automatic user provisioning, you should decide which users and/or groups in Azure AD need access to Harness. Once decided, you can assign these users and/or groups to Harness by following the instructions here:
* [Assign a user or group to an enterprise app](../manage-apps/assign-user-or-group-access-portal.md)

## Important tips for assigning users to Harness

* It is recommended that a single Azure AD user is assigned to Harness to test the automatic user provisioning configuration. Additional users and/or groups may be assigned later.

* When assigning a user to Harness, you must select any valid application-specific role (if available) in the assignment dialog. Users with the **Default Access** role are excluded from provisioning.

## Set up Harness for provisioning

1. Sign in to your [Harness Admin Console](https://app.harness.io/#/login). Navigate to **Continuous Security > Access Management**.

	![Harness Admin Console](media/harness-provisioning-tutorial/admin.png)

2.	Click on **API Keys**.

	![Harness Add SCIM](media/harness-provisioning-tutorial/apikeys.png)

3. Click on **Add New Key**. In the **Add Api Key** dialog box, provide a **Name** and select an option from **Permissions Inherited from** dropdown menu. Click on **Submit** button.

	![Harness Add New Key](media/harness-provisioning-tutorial/addkey.png)

	![Harness Add New Key dialog](media/harness-provisioning-tutorial/title.png)

3.	Copy the **Key**. This value will be entered in the Secret Token field in the Provisioning tab of your Harness application in the Azure portal.

	![Harness Create Token](media/harness-provisioning-tutorial/token.png)

## Add Harness from the gallery

Before configuring Harness for automatic user provisioning with Azure AD, you need to add Harness from the Azure AD application gallery to your list of managed SaaS applications.

**To add Harness from the Azure AD application gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, in the left navigation panel, select **Azure Active Directory**.

	![The Azure Active Directory button](common/select-azuread.png)

2. Go to **Enterprise applications**, and then select **All applications**.

	![The Enterprise applications blade](common/enterprise-applications.png)

3. To add a new application, select the **New application** button at the top of the pane.

	![The New application button](common/add-new-app.png)

4. In the search box, enter **Harness**, select **Harness** in the results panel, and then click the **Add** button to add the application.

	![Harness in the results list](common/search-new-app.png)

## Configuring automatic user provisioning to Harness 

This section guides you through the steps to configure the Azure AD provisioning service to create, update, and disable users and/or groups in Harness based on user and/or group assignments in Azure AD.

> [!TIP]
> You may also choose to enable SAML-based single sign-on for Harness by following the instructions provided in the [Harness Single sign-on tutorial](https://docs.microsoft.com/azure/active-directory/saas-apps/harness-tutorial). Single sign-on can be configured independently of automatic user provisioning, although these two features complement each other

> [!NOTE]
> To learn more about Harness' SCIM endpoint, refer [this](https://docs.harness.io/article/smloyragsm-api-keys)

### To configure automatic user provisioning for Harness in Azure AD:

1. Sign in to the [Azure portal](https://portal.azure.com). Select **Enterprise Applications**, then select **All applications**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **Harness**.

	![The Harness link in the Applications list](common/all-applications.png)

3. Select the **Provisioning** tab.

	![Provisioning tab](common/provisioning.png)

4. Set the **Provisioning Mode** to **Automatic**.

	![Provisioning tab](common/provisioning-automatic.png)

5. Under the **Admin Credentials** section, input `https://app.harness.io/gateway/api/scim/account/XCPzWkCIQ46ypIu2DeT7yw` in **Tenant URL**. Input the **SCIM Authentication Token** value retrieved earlier in **Secret Token**. Click **Test Connection** to ensure Azure AD can connect to Harness. If the connection fails, ensure your Harness account has Admin permissions and try again.

	![Tenant URL + Token](common/provisioning-testconnection-tenanturltoken.png)

6. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and check the checkbox - **Send an email notification when a failure occurs**.

	![Notification Email](common/provisioning-notification-email.png)

7. Click **Save**.

8. Under the **Mappings** section, select **Synchronize Azure Active Directory Users to Harness**.

	![Harness User Mappings](media/harness-provisioning-tutorial/usermappings.png)

9. Review the user attributes that are synchronized from Azure AD to Harness in the **Attribute Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in Harness for update operations. Select the **Save** button to commit any changes.

	![Harness User Attributes](media/harness-provisioning-tutorial/userattributes.png)

10. Under the **Mappings** section, select **Synchronize Azure Active Directory Groups to Harness**.

	![Harness Group Mappings](media/harness-provisioning-tutorial/groupmappings.png)

11. Review the group attributes that are synchronized from Azure AD to Harness in the **Attribute Mapping** section. The attributes selected as **Matching** properties are used to match the groups in Harness for update operations. Select the **Save** button to commit any changes.

	![Harness Group Attributes](media/harness-provisioning-tutorial/groupattributes.png)

12. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](../manage-apps/define-conditional-rules-for-provisioning-user-accounts.md).

13. To enable the Azure AD provisioning service for Harness, change the **Provisioning Status** to **On** in the **Settings** section.

	![Provisioning Status Toggled On](common/provisioning-toggle-on.png)

14. Define the users and/or groups that you would like to provision to Harness by choosing the desired values in **Scope** in the **Settings** section.

	![Provisioning Scope](common/provisioning-scope.png)

15. When you are ready to provision, click **Save**.

	![Saving Provisioning Configuration](common/provisioning-configuration-save.png)

This operation starts the initial synchronization of all users and/or groups defined in **Scope** in the **Settings** section. The initial sync takes longer to perform than subsequent syncs, which occur approximately every 40 minutes as long as the Azure AD provisioning service is running. You can use the **Synchronization Details** section to monitor progress and follow links to provisioning activity report, which describes all actions performed by the Azure AD provisioning service on Harness.

For more information on how to read the Azure AD provisioning logs, see [Reporting on automatic user account provisioning](../manage-apps/check-status-user-account-provisioning.md).

## Additional resources

* [Managing user account provisioning for Enterprise Apps](../manage-apps/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../manage-apps/check-status-user-account-provisioning.md)
