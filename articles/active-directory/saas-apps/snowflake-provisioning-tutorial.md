---
title: 'Tutorial: Configure Snowflake for automatic user provisioning with Azure Active Directory | Microsoft Docs'
description: Learn how to configure Azure Active Directory to automatically provision and de-provision user accounts to Snowflake.
services: active-directory
documentationcenter: ''
author: zchia
writer: zchia
manager: beatrizd

ms.assetid: f9ce85f4-0992-4bc6-8276-4b2efbce8dcb
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/26/2019
ms.author: zhchia
---

# Tutorial: Configure Snowflake for automatic user provisioning

The objective of this tutorial is to demonstrate the steps to be performed in Snowflake and Azure Active Directory (Azure AD) to configure Azure AD to automatically provision and de-provision users and/or groups to Snowflake.

> [!NOTE]
> This tutorial describes a connector built on top of the Azure AD User Provisioning Service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Azure Active Directory](../app-provisioning/user-provisioning.md).
>
> This connector is currently in Public Preview. For more information on the general Microsoft Azure terms of use for Preview features, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* An Azure AD tenant.
* [A Snowflake tenant](https://www.Snowflake.com/pricing/).
* A user account in Snowflake with Admin permissions.

## Assigning users to Snowflake

Azure Active Directory uses a concept called *assignments* to determine which users should receive access to selected apps. In the context of automatic user provisioning, only the users and/or groups that have been assigned to an application in Azure AD are synchronized.

Before configuring and enabling automatic user provisioning, you should decide which users and/or groups in Azure AD need access to Snowflake. Once decided, you can assign these users and/or groups to Snowflake by following the instructions here:
* [Assign a user or group to an enterprise app](../manage-apps/assign-user-or-group-access-portal.md)

## Important tips for assigning users to Snowflake

* It is recommended that a single Azure AD user is assigned to Snowflake to test the automatic user provisioning configuration. Additional users and/or groups may be assigned later.

* When assigning a user to Snowflake, you must select any valid application-specific role (if available) in the assignment dialog. Users with the **Default Access** role are excluded from provisioning.

## Setup Snowflake for provisioning

Before configuring Snowflake for automatic user provisioning with Azure AD, you will need to enable SCIM provisioning on Snowflake.

1. Sign in to your Snowflake Admin Console. Enter the query shown below in the worksheet highlighted and click **Run**.

	![Snowflake Admin Console](media/Snowflake-provisioning-tutorial/image00.png)

2.  A SCIM Access Token will be generated for your Snowflake tenant. To retrieve it, click on the link highlighted below.

	![Snowflake Add SCIM](media/Snowflake-provisioning-tutorial/image01.png)

3. Copy the generated token value and click **Done**. This value will be entered in the **Secret Token** field in the Provisioning tab of your Snowflake application in the Azure portal.

	![Snowflake Add SCIM](media/Snowflake-provisioning-tutorial/image02.png)

## Add Snowflake from the gallery

To configure Snowflake for automatic user provisioning with Azure AD, you need to addSnowflake from the Azure AD application gallery to your list of managed SaaS applications.

**To add Snowflake from the Azure AD application gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, in the left navigation panel, select **Azure Active Directory**.

	![The Azure Active Directory button](common/select-azuread.png)

2. Go to **Enterprise applications**, and then select **All applications**.

	![The Enterprise applications blade](common/enterprise-applications.png)

3. To add a new application, select the **New application** button at the top of the pane.

	![The New application button](common/add-new-app.png)

4. In the search box, enter **Snowflake**, select **Snowflake** in the results panel, and then click the **Add** button to add the application.

	![Snowflake in the results list](common/search-new-app.png)

## Configuring automatic user provisioning to Snowflake 

This section guides you through the steps to configure the Azure AD provisioning service to create, update, and disable users and/or groups in Snowflake based on user and/or group assignments in Azure AD.

> [!TIP]
> You may also choose to enable SAML-based single sign-on for Snowflake , following the instructions provided in the [Snowflake Single sign-on tutorial](Snowflake-tutorial.md). Single sign-on can be configured independently of automatic user provisioning, though these two features compliment each other.

### To configure automatic user provisioning for Snowflake in Azure AD:

1. Sign in to the [Azure portal](https://portal.azure.com). Select **Enterprise Applications**, then select **All applications**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **Snowflake**.

	![The Snowflake link in the Applications list](common/all-applications.png)

3. Select the **Provisioning** tab.

	![Provisioning tab](common/provisioning.png)

4. Set the **Provisioning Mode** to **Automatic**.

	![Provisioning tab](common/provisioning-automatic.png)

5. Under the Admin Credentials section, input `https://<Snowflake Account URL>/scim/v2` in tenant 	URL. An example of the tenant URL: `https://acme.snowflakecomputing.com/scim/v2`

6. Input the **SCIM Authentication Token** value retrieved earlier in **Secret Token**. Click **Test Connection** to ensure Azure AD can connect to Snowflake. If the connection fails, ensure your Snowflake account has Admin permissions and try again.

	![Tenant URL + Token](common/provisioning-testconnection-tenanturltoken.png)

7. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and check the checkbox - **Send an email notification when a failure occurs**.

	![Notification Email](common/provisioning-notification-email.png)

8. Click **Save**.

9. Under the **Mappings** section, select **Synchronize Azure Active Directory Users to Snowflake**.

	![Snowflake User Mappings](media/Snowflake-provisioning-tutorial/user-mapping.png)

10. Review the user attributes that are synchronized from Azure AD to Snowflake in the **Attribute Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in Snowflake for update operations. Select the **Save** button to commit any changes.

	![Snowflake User Attributes](media/Snowflake-provisioning-tutorial/user-attribute.png)

11. Under the **Mappings** section, select **Synchronize Azure Active Directory Groups to Snowflake**.

	![Snowflake Group Mappings](media/Snowflake-provisioning-tutorial/group-mapping.png)

12. Review the group attributes that are synchronized from Azure AD to Snowflake in the **Attribute Mapping** section. The attributes selected as **Matching** properties are used to match the groups in Snowflake for update operations. Select the **Save** button to commit any changes.

	![Snowflake Group Attributes](media/Snowflake-provisioning-tutorial/group-attribute.png)

13. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

14. To enable the Azure AD provisioning service for Snowflake, change the **Provisioning Status** to **On** in the **Settings** section.

	![Provisioning Status Toggled On](common/provisioning-toggle-on.png)

15. Define the users and/or groups that you would like to provision to Snowflake by choosing the desired values in **Scope** in the **Settings** section. If this option is not available, please configure the required fields under Admin Credentials, Click **Save** and refresh the page. 

	![Provisioning Scope](common/provisioning-scope.png)

16. When you are ready to provision, click **Save**.

	![Saving Provisioning Configuration](common/provisioning-configuration-save.png)

	This operation starts the initial synchronization of all users and/or groups defined in **Scope** in the **Settings** section. The initial sync takes longer to perform than subsequent syncs, which occur approximately every 40 minutes as long as the Azure AD provisioning service is running. You can use the **Synchronization Details** section to monitor progress and follow links to provisioning activity report, which describes all actions performed by the Azure AD provisioning service on Snowflake.

	For more information on how to read the Azure AD provisioning logs, see [Reporting on automatic user account provisioning](../app-provisioning/check-status-user-account-provisioning.md)

## Connector limitations

* Snowflake generated SCIM tokens expire in 6 months. Be aware that these need to be refreshed before they expire to allow the provisioning syncs to continue working. 

## Additional resources

* [Managing user account provisioning for Enterprise Apps](../app-provisioning/configure-automatic-user-provisioning-portal.md).
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)

## Next steps
* [Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md).
