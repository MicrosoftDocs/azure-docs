---
title: 'Tutorial: Configure snowflake for automatic user provisioning with Azure Active Directory | Microsoft Docs'
description: Learn how to configure Azure Active Directory to automatically provision and de-provision user accounts to snowflake.
services: active-directory
documentationcenter: ''
author: zchia
writer: zchia
manager: beatrizd

ms.assetid: f9ce85f4-0992-4bc6-8276-4b2efbce8dcb
ms.service: active-directory
ms.component: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/19/2019
ms.author: zhchia
---

# Tutorial: Configure snowflake for automatic user provisioning

The objective of this tutorial is to demonstrate the steps to be performed in snowflake and Azure Active Directory (Azure AD) to configure Azure AD to automatically provision and de-provision users and/or groups to snowflake.

> [!NOTE]
> This tutorial describes a connector built on top of the Azure AD User Provisioning Service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Azure Active Directory](../manage-apps/user-provisioning.md).
>
> This connector is currently in Public Preview. For more information on the general Microsoft Azure terms of use for Preview features, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* An Azure AD tenant.
* [A snowflake tenant](https://www.snowflake.com/pricing/).
* A user account in snowflake with Admin permissions.

## Assigning users to snowflake

Azure Active Directory uses a concept called *assignments* to determine which users should receive access to selected apps. In the context of automatic user provisioning, only the users and/or groups that have been assigned to an application in Azure AD are synchronized.

Before configuring and enabling automatic user provisioning, you should decide which users and/or groups in Azure AD need access to snowflake. Once decided, you can assign these users and/or groups to snowflake by following the instructions here:
* [Assign a user or group to an enterprise app](../manage-apps/assign-user-or-group-access-portal.md)

## Important tips for assigning users to snowflake

* It is recommended that a single Azure AD user is assigned to snowflake to test the automatic user provisioning configuration. Additional users and/or groups may be assigned later.

* When assigning a user to snowflake, you must select any valid application-specific role (if available) in the assignment dialog. Users with the **Default Access** role are excluded from provisioning.

## Setup snowflake for provisioning

1. Sign in to your [snowflake Admin Console](https://azure_trial.east-us-2.azure.snowflakecomputing.com/console/login#/). Enter the Query in the workarea and click **Run**.

	![snowflake Admin Console](media/snowflake-provisioning-tutorial/image00.png)

2. Click on the below generated link.

	![snowflake Add SCIM](media/snowflake-provisioning-tutorial/image01.png)

3. Copy the generated value from the text field and click **Done**. This value will be entered in the **Secret Token** field in the Provisioning tab of your snowflake application in the Azure portal.

	![snowflake Add SCIM](media/snowflake-provisioning-tutorial/image02.png)

## Add snowflake from the gallery

Before configuring snowflake for automatic user provisioning with Azure AD, you need to add snowflake from the Azure AD application gallery to your list of managed SaaS applications.

**To add snowflake from the Azure AD application gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, in the left navigation panel, select **Azure Active Directory**.

	![The Azure Active Directory button](common/select-azuread.png)

2. Go to **Enterprise applications**, and then select **All applications**.

	![The Enterprise applications blade](common/enterprise-applications.png)

3. To add a new application, select the **New application** button at the top of the pane.

	![The New application button](common/add-new-app.png)

4. In the search box, enter **snowflake**, select **snowflake** in the results panel, and then click the **Add** button to add the application.

	![snowflake in the results list](common/search-new-app.png)

## Configuring automatic user provisioning to snowflake 

This section guides you through the steps to configure the Azure AD provisioning service to create, update, and disable users and/or groups in snowflake based on user and/or group assignments in Azure AD.

> [!TIP]
> You may also choose to enable SAML-based single sign-on for snowflake , following the instructions provided in the [snowflake Single sign-on tutorial](snowflake-tutorial.md). Single sign-on can be configured independently of automatic user provisioning, though these two features compliment each other.

### To configure automatic user provisioning for snowflake in Azure AD:

1. Sign in to the [Azure portal](https://portal.azure.com). Select **Enterprise Applications**, then select **All applications**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **snowflake**.

	![The snowflake link in the Applications list](common/all-applications.png)

3. Select the **Provisioning** tab.

	![Provisioning tab](common/provisioning.png)

4. Set the **Provisioning Mode** to **Automatic**.

	![Provisioning tab](common/provisioning-automatic.png)

5. Under the **Admin Credentials** section, input `https://<account>.<region>.<cloud>.snowflakecomputing.com/scim/v2` in **Tenant URL**. Input the **SCIM Authentication Token** value retrieved earlier in **Secret Token**. Click **Test Connection** to ensure Azure AD can connect to snowflake. If the connection fails, ensure your snowflake account has Admin permissions and try again.

	![Tenant URL + Token](common/provisioning-testconnection-tenanturltoken.png)

6. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and check the checkbox - **Send an email notification when a failure occurs**.

	![Notification Email](common/provisioning-notification-email.png)

7. Click **Save**.

8. Under the **Mappings** section, select **Synchronize Azure Active Directory Users to snowflake**.

	![snowflake User Mappings](media/snowflake-provisioning-tutorial/user-mapping.png)

9. Review the user attributes that are synchronized from Azure AD to snowflake in the **Attribute Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in snowflake for update operations. Select the **Save** button to commit any changes.

	![snowflake User Attributes](media/snowflake-provisioning-tutorial/user-attribute.png)

10. Under the **Mappings** section, select **Synchronize Azure Active Directory Groups to snowflake**.

	![snowflake Group Mappings](media/snowflake-provisioning-tutorial/group-mapping.png)

11. Review the group attributes that are synchronized from Azure AD to snowflake in the **Attribute Mapping** section. The attributes selected as **Matching** properties are used to match the groups in snowflake for update operations. Select the **Save** button to commit any changes.

	![snowflake Group Attributes](media/snowflake-provisioning-tutorial/group-attribute.png)

12. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](../manage-apps/define-conditional-rules-for-provisioning-user-accounts.md).

13. To enable the Azure AD provisioning service for snowflake, change the **Provisioning Status** to **On** in the **Settings** section.

	![Provisioning Status Toggled On](common/provisioning-toggle-on.png)

14. Define the users and/or groups that you would like to provision to snowflake by choosing the desired values in **Scope** in the **Settings** section.

	![Provisioning Scope](common/provisioning-scope.png)

15. When you are ready to provision, click **Save**.

	![Saving Provisioning Configuration](common/provisioning-configuration-save.png)

	This operation starts the initial synchronization of all users and/or groups defined in **Scope** in the **Settings** section. The initial sync takes longer to perform than subsequent syncs, which occur approximately every 40 minutes as long as the Azure AD provisioning service is running. You can use the **Synchronization Details** section to monitor progress and follow links to provisioning activity report, which describes all actions performed by the Azure AD provisioning service on snowflake.

	For more information on how to read the Azure AD provisioning logs, see [Reporting on automatic user account provisioning](../manage-apps/check-status-user-account-provisioning.md)

## Connector limitations


## Additional resources

* [Managing user account provisioning for Enterprise Apps](../manage-apps/configure-automatic-user-provisioning-portal.md).
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)

## Next steps
* [Learn how to review logs and get reports on provisioning activity](../manage-apps/check-status-user-account-provisioning.md).