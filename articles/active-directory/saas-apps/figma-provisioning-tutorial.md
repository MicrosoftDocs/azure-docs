---
title: 'Tutorial: Configure Figma automatic user provisioning with Azure Active Directory'
description: Learn how to configure Azure Active Directory to automatically provision and de-provision user accounts to Figma.
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

# Tutorial: Configure Figma for automatic user provisioning

The objective of this tutorial is to demonstrate the steps to be performed in Figma  and Azure Active Directory (Azure AD) to configure Azure AD to automatically provision and de-provision user accounts to Figma.

> [!NOTE]
> This tutorial describes a connector built on top of the Azure AD User Provisioning Service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Azure Active Directory](../app-provisioning/user-provisioning.md).
>

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* An Azure AD tenant.
* [A Figma tenant](https://www.figma.com/pricing/).
* A user account in Figma  with Admin permissions.

## Assign users to Figma.
Azure Active Directory uses a concept called assignments to determine which users should receive access to selected apps. In the context of automatic user provisioning, only the users and/or groups that have been assigned to an application in Azure AD are synchronized.

Before configuring and enabling automatic user provisioning, you should decide which users and/or groups in Azure AD need access to Figma. Once decided, you can assign these users and/or groups to Figma by following the instructions here:
 
* [Assign a user or group to an enterprise app](../manage-apps/assign-user-or-group-access-portal.md)
## Important tips for assigning users to Figma

 * It is recommended that a single Azure AD user is assigned to Figma to test the automatic user provisioning configuration. Additional users and/or groups may be assigned later.

* When assigning a user to Figma, you must select any valid application-specific role (if available) in the assignment dialog. Users with the Default Access role are excluded from provisioning.

## Set up Figma for provisioning

Before configuring Figma for automatic user provisioning with Azure AD, you will need to retrieve some provisioning information from Figma.

1. Sign in to your [Figma Admin Console](https://www.Figma.com/). Click on the gear icon next to your tenant.

	:::image type="content" source="media/Figma-provisioning-tutorial/image0.png" alt-text="Screenshot of the Figma admin console. A tenant named A A D Scim Test is visible. Next to the tenant, a gear icon is highlighted." border="false":::

2. Navigate to **General > Update Log in Settings**.

	:::image type="content" source="media/Figma-provisioning-tutorial/figma03.png" alt-text="Screenshot of the General tab of the Figma admin console. Under Log in and provisioning, Update log in settings is highlighted." border="false":::

3. Copy the **Tenant ID**. This value will be used to construct the SCIM endpoint URL to be entered into the **Tenant URL** field in the Provisioning tab of your Figma application in the Azure portal.

	:::image type="content" source="media/Figma-provisioning-tutorial/figma-tenantid.png" alt-text="Screenshot of the S A M L S S O section in the Figma admin console. A Tenant ID label and an adjacent link that says Copy are highlighted." border="false":::

4. Scroll down and click on **Generate API Token**.

	:::image type="content" source="media/Figma-provisioning-tutorial/token.png" alt-text="Screenshot of the S C I M provisioning section in the Figma admin console. A link labeled Generate A P I token is highlighted." border="false":::

5. Copy the  **API Token** value. This value will be entered in the **Secret Token** field in the Provisioning tab of your Figma application in the Azure portal. 

	:::image type="content" source="media/Figma-provisioning-tutorial/figma04.png" alt-text="Screenshot of a page in the Figma admin console. Under Your provisioning A P I token, a placeholder for the token is highlighted." border="false":::

## Add Figma from the gallery

To configure Figma for automatic user provisioning with Azure AD, you need to add Figma from the Azure AD application gallery to your list of managed SaaS applications.

1. In the **[Azure portal](https://portal.azure.com)**, in the left navigation panel, select **Azure Active Directory**.

	![The Azure Active Directory button](common/select-azuread.png)

2. Go to **Enterprise applications**, and then select **All applications**.

	![The Enterprise applications blade](common/enterprise-applications.png)

3. To add a new application, select the **New application** button at the top of the pane.

	![The New application button](common/add-new-app.png)

4. In the search box, enter **Figma**, select **Figma** in the results panel, and then click the **Add** button to add the application.

	![Figma  in the results list](common/search-new-app.png)

## Configuring automatic user provisioning to Figma 

This section guides you through the steps to configure the Azure AD provisioning service to create, update, and disable users and/or groups in Figma  based on user and/or group assignments in Azure AD.

> [!TIP]
> You may also choose to enable SAML-based single sign-on for Figma, following the instructions provided in the [Figma Single sign-on tutorial](figma-tutorial.md). Single sign-on can be configured independently of automatic user provisioning, though these two features compliment each other.

### To configure automatic user provisioning for Figma  in Azure AD:

1. Sign in to the [Azure portal](https://portal.azure.com). Select **Enterprise Applications**, then select **All applications**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **Figma**.

	![The Figma  link in the Applications list](common/all-applications.png)

3. Select the **Provisioning** tab.

	![Screenshot of the Manage options with the Provisioning option called out.](common/provisioning.png)

4. Set the **Provisioning Mode** to **Automatic**.

	![Screenshot of the Provisioning Mode dropdown list with the Automatic option called out.](common/provisioning-automatic.png)

5. Under the **Admin Credentials** section, input `https://www.figma.com/scim/v2/<TenantID>` in **Tenant URL** where **TenantID** is the value that you retrieved from Figma earlier. Input the **API Token** value in **Secret Token**. Click **Test Connection** to ensure Azure AD can connect to Figma. If the connection fails, ensure your Figma account has Admin permissions and try again.

	![Tenant URL + Token](common/provisioning-testconnection-tenanturltoken.png)

8. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and check the checkbox - **Send an email notification when a failure occurs**.

	![Notification Email](common/provisioning-notification-email.png)

9. Click **Save**.

10. Under the **Mappings** section, select **Synchronize Azure Active Directory Users to Figma**.

	![Figma User Mappings](media/Figma-provisioning-tutorial/figma05.png)

11. Review the user attributes that are synchronized from Azure AD to Figma  in the **Attribute Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in Figma  for update operations. Select the **Save** button to commit any changes.

	![Figma User Attributes](media/Figma-provisioning-tutorial/figma06.png)

12. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

13. To enable the Azure AD provisioning service for Figma, change the **Provisioning Status** to **On** in the **Settings** section.

	![Provisioning Status Toggled On](common/provisioning-toggle-on.png)

14. Define the users and/or groups that you would like to provision to Figma  by choosing the desired values in **Scope** in the **Settings** section.

	![Provisioning Scope](common/provisioning-scope.png)

15. When you are ready to provision, click **Save**.

	![Saving Provisioning Configuration](common/provisioning-configuration-save.png)

This operation starts the initial synchronization of all users and/or groups defined in **Scope** in the **Settings** section. The initial sync takes longer to perform than subsequent syncs, which occur approximately every 40 minutes as long as the Azure AD provisioning service is running. You can use the **Synchronization Details** section to monitor progress and follow links to provisioning activity report, which describes all actions performed by the Azure AD provisioning service on Figma.

For more information on how to read the Azure AD provisioning logs, see [Reporting on automatic user account provisioning](../app-provisioning/check-status-user-account-provisioning.md).

## Additional resources

* [Managing user account provisioning for Enterprise Apps](../app-provisioning/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md)
