---
title: 'Tutorial: Configure Storegate for automatic user provisioning with Azure Active Directory | Microsoft Docs'
description: Learn how to configure Azure Active Directory to automatically provision and de-provision user accounts to Storegate.
services: active-directory
documentationcenter: ''
author: zchia
writer: zchia
manager: beatrizd

ms.assetid: 628fa804-c0e6-4db1-ab6b-46ee9aab4d41
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/15/2019
ms.author: Zhchia
---

# Tutorial: Configure Storegate for automatic user provisioning

The objective of this tutorial is to demonstrate the steps to be performed in Storegate and Azure Active Directory (Azure AD) to configure Azure AD to automatically provision and de-provision users and/or groups to Storegate.

> [!NOTE]
> This tutorial describes a connector built on top of the Azure AD User Provisioning Service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Azure Active Directory](../app-provisioning/user-provisioning.md).
>
> This connector is currently in Public Preview. For more information on the general Microsoft Azure terms of use for Preview features, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* An Azure AD tenant
* [A Storegate tenant](https://www.storegate.com)
* A user account on a Storegate with Administrator permissions.

## Assign users to Storegate

Azure Active Directory uses a concept called assignments to determine which users should receive access to selected apps. In the context of automatic user provisioning, only the users and/or groups that have been assigned to an application in Azure AD are synchronized.

Before configuring and enabling automatic user provisioning, you should decide which users and/or groups in Azure AD need access to Storegate. Once decided, you can assign these users and/or groups to Storegate by following the instructions here:

* [Assign a user or group to an enterprise app](../manage-apps/assign-user-or-group-access-portal.md)

### Important tips for assigning users to Storegate

* It is recommended that a single Azure AD user is assigned to Storegate to test the automatic user provisioning configuration. Additional users and/or groups may be assigned later.

* When assigning a user to Storegate, you must select any valid application-specific role (if available) in the assignment dialog. Users with the **Default Access** role are excluded from provisioning.

## Set up Storegate for provisioning

Before configuring Storegate for automatic user provisioning with Azure AD, you will need to retrieve some provisioning information from Storegate.

1. Sign in to your [Storegate Admin Console](https://ws1.storegate.com/identity/core/login?signin=c71fb8fe18243c571da5b333d5437367) and navigate to the settings by clicking on the user icon in the upper right corner and select **Account Settings**.

	![Storegate Add SCIM](media/storegate-provisioning-tutorial/admin.png)

2. Within settings navigate to **Team > Settings** and verify that the toggle switch is switched on in the **Single sign-on** section.

	![Storegate settings](media/storegate-provisioning-tutorial/team.png)

	![Storegate toggle button](media/storegate-provisioning-tutorial/sso.png)

3. Copy the **Tenant URL** and **Token**. These values will be entered in the **Tenant URL** and **Secret Token** fields respectively in the Provisioning tab of your Storegate application in the Azure portal. 

	![Storegate Create Token](media/storegate-provisioning-tutorial/token.png)

## Add Storegate from the gallery

To configure Storegate for automatic user provisioning with Azure AD, you need to add Storegate from the Azure AD application gallery to your list of managed SaaS applications.

1. In the **[Azure portal](https://portal.azure.com)**, in the left navigation panel, select **Azure Active Directory**.

	![The Azure Active Directory button](common/select-azuread.png)

2. Go to **Enterprise applications**, and then select **All applications**.

	![The Enterprise applications blade](common/enterprise-applications.png)

3. To add a new application, select the **New application** button at the top of the pane.

	![The New application button](common/add-new-app.png)

4. In the search box, enter **Storegate**, select **Storegate** in the results panel. 

	![Storegate in the results list](common/search-new-app.png)

5. Select the **Sign-up for Storegate** button which will redirect you to Storegate's login page. 

	![Storegate OIDC Add](media/storegate-provisioning-tutorial/signup.png)

6.  Sign in to your [Storegate Admin Console](https://ws1.storegate.com/identity/core/login?signin=c71fb8fe18243c571da5b333d5437367) and navigate to the settings by clicking on the user icon in the upper right corner and select **Account Settings**.

	![Storegate login](media/storegate-provisioning-tutorial/admin.png)

7. Within settings navigate to **Team > Settings** and click on toggle switch in the Single sign-on section, this will start the consent-flow. Click on **Activate**.

	![Storegate team](media/storegate-provisioning-tutorial/team.png)

	![Storegate sso](media/storegate-provisioning-tutorial/sso.png)

	![Storegate activate](media/storegate-provisioning-tutorial/activate.png)

8. As Storegate is an OpenIDConnect app, choose to login to Storegate using your Microsoft work account.

	![Storegate OIDC login](media/storegate-provisioning-tutorial/login.png)

9. After a successful authentication, accept the consent prompt for the consent page. The application will then be automatically added to your tenant and you will be redirected to your Storegate account.

	![Storegate OIDc Consent](media/storegate-provisioning-tutorial/accept.png)

## Configure automatic user provisioning to Storegate 

This section guides you through the steps to configure the Azure AD provisioning service to create, update, and disable users and/or groups in Storegate based on user and/or group assignments in Azure AD.

> [!NOTE]
> To learn more about Storegate's SCIM endpoint, refer [this](https://en-support.storegate.com/article/step-by-step-instruction-how-to-enable-azure-provisioning-to-your-storegate-team-account/).

### To configure automatic user provisioning for Storegate in Azure AD

1. Sign in to the [Azure portal](https://portal.azure.com). Select **Enterprise Applications**, then select **All applications**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **Storegate**.

	![The Storegate link in the Applications list](common/all-applications.png)

3. Select the **Provisioning** tab.

	![Provisioning tab](common/provisioning.png)

4. Set the **Provisioning Mode** to **Automatic**.

	![Provisioning tab](common/provisioning-automatic.png)

5. Under the **Admin Credentials** section, input `https://dialpad.com/scim` in **Tenant URL**. Input the value that you retrieved and saved earlier from Storegate in **Secret Token**. Click **Test Connection** to ensure Azure AD can connect to Storegate. If the connection fails, ensure your Storegate account has Admin permissions and try again.

	![Tenant URL + Token](common/provisioning-testconnection-tenanturltoken.png)

6. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and check the checkbox - **Send an email notification when a failure occurs**.

	![Notification Email](common/provisioning-notification-email.png)

7. Click **Save**.

8. Under the **Mappings** section, select **Synchronize Azure Active Directory Users to Storegate**.

	![Storegate User Mappings](media/storegate-provisioning-tutorial/usermappings.png)

9. Review the user attributes that are synchronized from Azure AD to Storegate in the **Attribute Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in Storegate for update operations. Select the **Save** button to commit any changes.

	![Storegate User Attributes](media/storegate-provisioning-tutorial/userattributes.png)

10. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

11. To enable the Azure AD provisioning service for Storegate, change the **Provisioning Status** to **On** in the **Settings** section.

	![Provisioning Status Toggled On](common/provisioning-toggle-on.png)

12. Define the users and/or groups that you would like to provision to Storegate by choosing the desired values in **Scope** in the **Settings** section.

	![Provisioning Scope](common/provisioning-scope.png)

13. When you are ready to provision, click **Save**.

	![Saving Provisioning Configuration](common/provisioning-configuration-save.png)

This operation starts the initial synchronization of all users and/or groups defined in **Scope** in the **Settings** section. The initial sync takes longer to perform than subsequent syncs, which occur approximately every 40 minutes as long as the Azure AD provisioning service is running. You can use the **Synchronization Details** section to monitor progress and follow links to provisioning activity report, which describes all actions performed by the Azure AD provisioning service on Storegate.

For more information on how to read the Azure AD provisioning logs, see [Reporting on automatic user account provisioning](../app-provisioning/check-status-user-account-provisioning.md).

## Additional resources

* [Managing user account provisioning for Enterprise Apps](../app-provisioning/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md)
