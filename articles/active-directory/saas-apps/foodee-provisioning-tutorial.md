---
title: 'Tutorial: Configure Foodee for automatic user provisioning by using Azure Active Directory | Microsoft Docs'
description: Learn how to configure Azure Active Directory to automatically provision and deprovision user accounts to Foodee.
services: active-directory
documentationcenter: ''
author: zchia
writer: zchia
manager: beatrizd

ms.assetid: fb48deae-4653-448a-ba2f-90258edab3a7
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/30/2019
ms.author: Zhchia
---

# Tutorial: Configure Foodee for automatic user provisioning

This article shows you how to configure Azure Active Directory (Azure AD) in Foodee and Azure AD to automatically provision or deprovision users or groups to Foodee.

> [!NOTE]
> The article describes a connector that's built on top of the Azure AD User Provisioning service. To learn what this service does and how it works, and to get answers to frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Azure Active Directory](../app-provisioning/user-provisioning.md).
>
> This connector is currently in preview. For more information about the Azure terms-of-use feature for preview features, go to [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

This tutorial assumes that you've met the following prerequisites:

* An Azure AD tenant
* [A Foodee tenant](https://www.food.ee/about/)
* A user account in Foodee with Admin permissions

## Assign users to Foodee 

Azure AD uses a concept called *assignments* to determine which users should receive access to selected apps. In the context of automatic user provisioning, only the users or groups that have been assigned to an application in Azure AD are synchronized.

Before you configure and enable automatic user provisioning, you should decide which users or groups in Azure AD need access to Foodee. After you've made this determination, you can assign these users or groups to Foodee by following the instructions in [Assign a user or group to an enterprise app](../manage-apps/assign-user-or-group-access-portal.md).

## Important tips for assigning users to Foodee 

When you're assigning users, keep the following tips in mind:

* We recommend that you assign only a single Azure AD user to Foodee to test the configuration of automatic user provisioning. You can assign additional users or groups later.

* When you're assigning a user to Foodee, select any valid application-specific role, if it's available, in the **Assignment** pane. Users who have the *Default Access* role are excluded from provisioning.

## Set up Foodee for provisioning

Before you configure Foodee for automatic user provisioning by using Azure AD, you need to enable System for Cross-domain Identity Management (SCIM) provisioning in Foodee.

1. Sign in to [Foodee](https://www.food.ee/login/), and then select your tenant ID.

	![Foodee](media/Foodee-provisioning-tutorial/tenant.png)

1. Under **Enterprise portal**, select **Single Sign On**.

	![The Foodee Enterprise Portal left-pane menu](media/Foodee-provisioning-tutorial/scim.png)

1. Copy the value in the **API Token** box for later use. You'll enter it in the **Secret Token** box in the **Provisioning** tab of your Foodee application in the Azure portal.

	![Foodee](media/Foodee-provisioning-tutorial/token.png)

## Add Foodee from the gallery

To configure Foodee for automatic user provisioning by using Azure AD, you need to add Foodee from the Azure AD application gallery to your list of managed SaaS applications.

To add Foodee from the Azure AD application gallery, do the following:

1. In the [Azure portal](https://portal.azure.com), in the left pane, select **Azure Active Directory**.

	![The Azure Active Directory command](common/select-azuread.png)

1. Select **Enterprise applications** > **All applications**.

	![The Enterprise applications pane](common/enterprise-applications.png)

1. To add a new application, select **New application** at the top of the pane.

	![The New application button](common/add-new-app.png)

1. In the search box, enter **Foodee**, select **Foodee** in the results pane, and then select **Add** to add the application.

	![Foodee in the results list](common/search-new-app.png)

## Configure automatic user provisioning to Foodee 

In this section, you configure the Azure AD provisioning service to create, update, and disable users or groups in Foodee based on user or group assignments in Azure AD.

> [!TIP]
> You can also enable SAML-based single sign-on for Foodee by following the instructions in the [Foodee single sign-on tutorial](Foodee-tutorial.md). You can configure single sign-on independent of automatic user provisioning, though these two features complement each other.

Configure automatic user provisioning for Foodee in Azure AD by doing the following:

1. In the [Azure portal](https://portal.azure.com), select **Enterprise Applications** > **All applications**.

	![Enterprise applications pane](common/enterprise-applications.png)

1. In the **Applications** list, select **Foodee**.

	![The Foodee link in the Applications list](common/all-applications.png)

1. Select the **Provisioning** tab.

	![Provisioning tab](common/provisioning.png)

1. In the **Provisioning Mode** drop-down list, select **Automatic**.

	![Provisioning tab](common/provisioning-automatic.png)

1. Under **Admin Credentials**, do the following:

   a. In the **Tenant URL** box, enter the **https:\//concierge.food.ee/scim/v2** value that you retrieved earlier.

   b. In the **Secret Token** box, enter the **API Token** value that you retrieved earlier.
   
   c. To ensure that Azure AD can connect to Foodee, select **Test Connection**. If the connection fails, ensure that your Foodee account has administrator permissions, and then try again.

	![The Test Connection link](common/provisioning-testconnection-tenanturltoken.png)

1. In the **Notification Email** box, enter the email address of a person or group who should receive the provisioning error notifications, and then select the **Send an email notification when a failure occurs** check box.

	![The Notification Email text box](common/provisioning-notification-email.png)

1. Select **Save**.

1. Under **Mappings**, select **Synchronize Azure Active Directory Users to Foodee**.

	![Foodee user mappings](media/Foodee-provisioning-tutorial/usermapping.png)

1. Under **Attribute Mappings**, review the user attributes that are synchronized from Azure AD to Foodee. The attributes that are selected as **Matching** properties are used to match the *user accounts* in Foodee for update operations. 

	![Foodee user mappings](media/Foodee-provisioning-tutorial/userattribute.png)

1. To commit your changes, select **Save**.
1. Under **Mappings**, select **Synchronize Azure Active Directory Groups to Foodee**.

	![Foodee user mappings](media/Foodee-provisioning-tutorial/groupmapping.png)

1. Under **Attribute Mappings**, review the user attributes that are synchronized from Azure AD to Foodee. The attributes that are selected as **Matching** properties are used to match the *group accounts* in Foodee for update operations.

	![Foodee user mappings](media/Foodee-provisioning-tutorial/groupattribute.png)

1. To commit your changes, select **Save**.
1. Configure the scoping filters. To learn how, refer to the instructions in the [Scoping filter tutorial](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

1. To enable the Azure AD provisioning service for Foodee, in the **Settings** section, change the **Provisioning Status** to **On**.

	![The Provisioning Status switch](common/provisioning-toggle-on.png)

1. Under **Settings**, in the **Scope** drop-down list, define the users or groups that you want to provision to Foodee.

	![The Provisioning Scope drop-down list](common/provisioning-scope.png)

1. When you're ready to provision, select **Save**.

	![The Provisioning Configuration Save button](common/provisioning-configuration-save.png)

The preceding operation starts the initial synchronization of the users or groups that you've defined in the **Scope** drop-down list. The initial sync takes longer to perform than subsequent syncs. For more information, see [How long will it take to provision users?](../app-provisioning/application-provisioning-when-will-provisioning-finish-specific-user.md#how-long-will-it-take-to-provision-users).

You can use the **Current Status** section to monitor progress and follow links to your provisioning activity report. The report describes all actions that are performed by the Azure AD provisioning service on Foodee. For more information, see [Check the status of user provisioning](../app-provisioning/application-provisioning-when-will-provisioning-finish-specific-user.md). To read the Azure AD provisioning logs, see [Reporting on automatic user account provisioning](../app-provisioning/check-status-user-account-provisioning.md).

## Additional resources

* [Manage user account provisioning for enterprise apps](../app-provisioning/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md)
