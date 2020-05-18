---
title: 'Tutorial: Configure Harness for automatic user provisioning with Azure Active Directory | Microsoft Docs'
description: Learn how to configure Azure Active Directory to automatically provision and deprovision user accounts to Harness.
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

In this article, you learn how to configure Azure Active Directory (Azure AD) to automatically provision and deprovision users or groups to Harness.

> [!NOTE]
> This article describes a connector that's built on top of the Azure AD user provisioning service. For important information about this service and answers to frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Azure Active Directory](../app-provisioning/user-provisioning.md).
>
> This connector is currently in preview. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

The scenario outlined in this article assumes that you already have the following prerequisites:

* An Azure AD tenant
* [A Harness tenant](https://harness.io/pricing/)
* A user account in Harness with *Admin* permissions

## Assign users to Harness

Azure Active Directory uses a concept called *assignments* to determine which users should receive access to selected apps. In the context of automatic user provisioning, only the users or groups that have been assigned to an application in Azure AD are synchronized.

Before you configure and enable automatic user provisioning, decide which users or groups in Azure AD need access to Harness. You can then assign these users or groups to Harness by following the instructions in [Assign a user or group to an enterprise app](../manage-apps/assign-user-or-group-access-portal.md).

## Important tips for assigning users to Harness

* We recommended that you assign a single Azure AD user to Harness to test the automatic user provisioning configuration. Additional users or groups can be assigned later.

* When you assign a user to Harness, you must select any valid application-specific role (if available) in the **Assignment** dialog box. Users with the *Default Access* role are excluded from provisioning.

## Set up Harness for provisioning

1. Sign in to your [Harness Admin Console](https://app.harness.io/#/login), and then go to **Continuous Security** > **Access Management**.

	![Harness Admin Console](media/harness-provisioning-tutorial/admin.png)

1. Select **API Keys**.

	![Harness API Keys link](media/harness-provisioning-tutorial/apikeys.png)

1. Select **Add API Key**. 

	![Harness Add API Key link](media/harness-provisioning-tutorial/addkey.png)

1. In the **Add Api Key** pane, do the following:

	![Harness Add Api Key pane](media/harness-provisioning-tutorial/title.png)
   
   a. In the **Name** box, provide a name for the key.  
   b. In the **Permissions Inherited from** drop-down list, select an option. 
   
1. Select **Submit**.

1. Copy the **Key** for later use in this tutorial.

	![Harness Create Token](media/harness-provisioning-tutorial/token.png)

## Add Harness from the gallery

Before you configure Harness for automatic user provisioning with Azure AD, you need to add Harness from the Azure AD application gallery to your list of managed SaaS applications.

1. In the [Azure portal](https://portal.azure.com), in the left pane, select **Azure Active Directory**.

	![The "Azure Active Directory" button](common/select-azuread.png)

1. Select **Enterprise applications** > **All applications**.

	![The "All applications" link](common/enterprise-applications.png)

1. To add a new application, select the **New application** button at the top of the pane.

	![The "New application" button](common/add-new-app.png)

1. In the search box, enter **Harness**, select **Harness** in the results list, and then select the **Add** button to add the application.

	![Harness in the results list](common/search-new-app.png)

## Configure automatic user provisioning to Harness 

This section guides you through the steps to configure the Azure AD provisioning service to create, update, and disable users or groups in Harness based on user or group assignments in Azure AD.

> [!TIP]
> You may also choose to enable SAML-based single sign-on for Harness by following the instructions in the [Harness single sign-on tutorial](https://docs.microsoft.com/azure/active-directory/saas-apps/harness-tutorial). You can configure single sign-on independent of automatic user provisioning, although these two features complement each other.

> [!NOTE]
> To learn more about the Harness SCIM endpoint, see the Harness [API Keys](https://docs.harness.io/article/smloyragsm-api-keys) article.

To configure automatic user provisioning for Harness in Azure AD, do the following:

1. In the [Azure portal](https://portal.azure.com), select **Enterprise Applications** > **All applications**.

	![Enterprise applications blade](common/enterprise-applications.png)

1. In the applications list, select **Harness**.

	![The Harness link in the applications list](common/all-applications.png)

1. Select **Provisioning**.

	![The Provisioning button](common/provisioning.png)

1. In the **Provisioning Mode** drop-down list, select **Automatic**.

	![The "Provisioning Mode" drop-down list](common/provisioning-automatic.png)

1. Under **Admin Credentials**, do the following:

	![Tenant URL + Token](common/provisioning-testconnection-tenanturltoken.png)
 
   a. In the **Tenant URL** box, enter **`https://app.harness.io/gateway/api/scim/account/XCPzWkCIQ46ypIu2DeT7yw`**.  
   b. In the **Secret Token** box, enter the SCIM Authentication Token value that you saved in step 6 of the "Set up Harness for provisioning" section.  
   c. Select **Test Connection** to ensure that Azure AD can connect to Harness. If the connection fails, ensure that your Harness account has *Admin* permissions, and then try again.

1. In the **Notification Email** box, enter the email address of a person or group that should receive the provisioning error notifications, and then select the **Send an email notification when a failure occurs** check box.

	![The "Notification Email" box](common/provisioning-notification-email.png)

1. Select **Save**.

1. Under **Mappings**, select **Synchronize Azure Active Directory Users to Harness**.

	![Harness "Synchronize Azure Active Directory Users to Harness" link](media/harness-provisioning-tutorial/usermappings.png)

1. Under **Attribute Mappings**, review the user attributes that are synchronized from Azure AD to Harness. The attributes selected as *Matching* are used to match the user accounts in Harness for update operations. Select **Save** to commit any changes.

	![Harness user "Attribute Mappings" pane](media/harness-provisioning-tutorial/userattributes.png)

1. Under **Mappings**, select **Synchronize Azure Active Directory Groups to Harness**.

	![Harness "Synchronize Azure Active Directory Groups to Harness" link](media/harness-provisioning-tutorial/groupmappings.png)

1. Under **Attribute Mappings**, review the group attributes that are synchronized from Azure AD to Harness. The attributes selected as *Matching* properties are used to match the groups in Harness for update operations. Select **Save** to commit any changes.

	![Harness group "Attribute Mappings" pane](media/harness-provisioning-tutorial/groupattributes.png)

1. To configure scoping filters, see [Attribute-based application provisioning with scoping filters](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

1. Under **Settings**, to enable the Azure AD provisioning service for Harness, toggle the **Provisioning Status** switch to **On**.

	![Provisioning Status switch toggled to "On"](common/provisioning-toggle-on.png)

1. Under **Settings**, in the **Scope** drop-down list, select how you want to sync the users or groups that you're provisioning to Harness.

	![Provisioning Scope](common/provisioning-scope.png)

1. When you're ready to provision, select **Save**.

	![The provisioning Save button](common/provisioning-configuration-save.png)

This operation starts the initial sync of the users or groups you're provisioning. The initial sync takes longer to perform than later ones. Syncs occur approximately every 40 minutes, as long as the Azure AD provisioning service is running. To monitor progress, go to the **Synchronization Details** section. You can also follow links to a provisioning activity report, which describes all actions performed by the Azure AD provisioning service on Harness.

For more information about how to read the Azure AD provisioning logs, see [Report on automatic user account provisioning](../app-provisioning/check-status-user-account-provisioning.md).

## Additional resources

* [Manage user account provisioning for enterprise apps](../app-provisioning/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md)
