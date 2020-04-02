---
title: 'Tutorial: Configure Comeet Recruiting Software for automatic user provisioning with Azure Active Directory | Microsoft Docs'
description: Learn how to configure Azure Active Directory to automatically provision and de-provision user accounts to Comeet Recruiting Software.
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
ms.date: 05/07/2019
ms.author: "jeedes"
---

# Tutorial: Configure Comeet Recruiting Software for automatic user provisioning

The objective of this tutorial is to demonstrate the steps to be performed in Comeet Recruiting Software and Azure Active Directory (Azure AD) to configure Azure AD to automatically provision and de-provision users and/or groups to Comeet Recruiting Software.

> [!NOTE]
> This tutorial describes a connector built on top of the Azure AD User Provisioning Service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Azure Active Directory](../app-provisioning/user-provisioning.md).
>
> This connector is currently in Public Preview. For more information on the general Microsoft Azure terms of use for Preview features, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* An Azure AD tenant
* [A Comeet Recruiting Software tenant](https://www.comeet.co/)
* A user account in Comeet Recruiting Software with Admin permissions.

## Add Comeet Recruiting Software from the gallery

Before configuring Comeet Recruiting Software for automatic user provisioning with Azure AD, you need to add Comeet Recruiting Software from the Azure AD application gallery to your list of managed SaaS applications.

**To add Comeet Recruiting Software from the Azure AD application gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, in the left navigation panel, select **Azure Active Directory**.

	![The Azure Active Directory button](common/select-azuread.png)

2. Go to **Enterprise applications**, and then select **All applications**.

	![The Enterprise applications blade](common/enterprise-applications.png)

3. To add a new application, select the **New application** button at the top of the pane.

	![The New application button](common/add-new-app.png)

4. In the search box, enter **Comeet Recruiting Software**, select **Comeet Recruiting Software** in the results panel, and then click the **Add** button to add the application.

	![Comeet Recruiting Software in the results list](common/search-new-app.png)

## Assigning users to Comeet Recruiting Software

Azure Active Directory uses a concept called *assignments* to determine which users should receive access to selected apps. In the context of automatic user provisioning, only the users and/or groups that have been assigned to an application in Azure AD are synchronized.

Before configuring and enabling automatic user provisioning, you should decide which users and/or groups in Azure AD need access to Comeet Recruiting Software. Once decided, you can assign these users and/or groups to Comeet Recruiting Software by following the instructions here:

* [Assign a user or group to an enterprise app](../manage-apps/assign-user-or-group-access-portal.md)

### Important tips for assigning users to Comeet Recruiting Software

* It is recommended that a single Azure AD user is assigned to Comeet Recruiting Software to test the automatic user provisioning configuration. Additional users and/or groups may be assigned later.

* When assigning a user to Comeet Recruiting Software, you must select any valid application-specific role (if available) in the assignment dialog. Users with the **Default Access** role are excluded from provisioning.

## Configuring automatic user provisioning to Comeet Recruiting Software 

This section guides you through the steps to configure the Azure AD provisioning service to create, update, and disable users and/or groups in Comeet Recruiting Software based on user and/or group assignments in Azure AD.

> [!TIP]
> You may also choose to enable SAML-based single sign-on for Comeet Recruiting Software, following the instructions provided in the [Comeet Recruiting Software single sign-on tutorial](comeetrecruitingsoftware-tutorial.md). Single sign-on can be configured independently of automatic user provisioning, though these two features compliment each other.

### To configure automatic user provisioning for Comeet Recruiting Software in Azure AD:

1. Sign in to the [Azure portal](https://portal.azure.com). Select **Enterprise Applications**, then select **All applications**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **Comeet Recruiting Software**.

	![The Comeet Recruiting Software link in the Applications list](common/all-applications.png)

3. Select the **Provisioning** tab.

	![Provisioning tab](common/provisioning.png)

4. Set the **Provisioning Mode** to **Automatic**.

	![Provisioning tab](common/provisioning-automatic.png)

5. Under the **Admin Credentials** section, input the **Tenant URL** and **Secret Token** of your Comeet Recruiting Software's account as described in Step 6.

6. In the [Comeet Recruiting Software admin console](https://app.comeet.co/), navigate to  **Comeet > Settings > Authentication > Microsoft Azure**, and copy the **Secret Token for your company** value to the **Secret Token** field in Azure AD.

	![Comeet Recruiting Software Provisioning](./media/comeet-recruiting-software-provisioning-tutorial/secret-token-1.png)

7. Upon populating the fields shown in Step 5, click **Test Connection** to ensure Azure AD can connect to Comeet Recruiting Software. If the connection fails, ensure your Comeet Recruiting Software account has Admin permissions and try again.

	![Token](common/provisioning-testconnection-token.png)

8. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and check the checkbox - **Send an email notification when a failure occurs**.

	![Notification Email](common/provisioning-notification-email.png)

9. Click **Save**.

10. Under the **Mappings** section, select **Synchronize Azure Active Directory Users to Comeet**.

	![Comeet Recruiting Software User Mappings](media/comeet-recruiting-software-provisioning-tutorial/user-mappings.png)

11. Review the user attributes that are synchronized from Azure AD to Comeet Recruiting Software in the **Attribute Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in Comeet Recruiting Software for update operations. Select the **Save** button to commit any changes.

	![Comeet Recruiting Software Group Attributes](media/comeet-recruiting-software-provisioning-tutorial/user-mapping-attributes.png)

12. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

13. To enable the Azure AD provisioning service for Comeet Recruiting Software, change the **Provisioning Status** to **On** in the **Settings** section.

	![Provisioning Status Toggled On](common/provisioning-toggle-on.png)

14. Define the users and/or groups that you would like to provision to Comeet Recruiting Software by choosing the desired values in **Scope** in the **Settings** section.

	![Provisioning Scope](common/provisioning-scope.png)

15. When you are ready to provision, click **Save**.

	![Saving Provisioning Configuration](common/provisioning-configuration-save.png)

This operation starts the initial synchronization of all users and/or groups defined in **Scope** in the **Settings** section. The initial sync takes longer to perform than subsequent syncs, which occur approximately every 40 minutes as long as the Azure AD provisioning service is running. You can use the **Synchronization Details** section to monitor progress and follow links to provisioning activity report, which describes all actions performed by the Azure AD provisioning service on Comeet Recruiting Software.

For more information on how to read the Azure AD provisioning logs, see [Reporting on automatic user account provisioning](../app-provisioning/check-status-user-account-provisioning.md).

## Connector Limitations

* Comeet Recruiting Software does not currently support groups.

## Additional resources

* [Managing user account provisioning for Enterprise Apps](../app-provisioning/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md)

