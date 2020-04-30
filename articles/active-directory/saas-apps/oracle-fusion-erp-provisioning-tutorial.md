---
title: 'Tutorial: Configure Oracle Fusion ERP for automatic user provisioning with Azure Active Directory | Microsoft Docs'
description: Learn how to configure Azure Active Directory to automatically provision and de-provision user accounts to Oracle Fusion ERP.
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
ms.date: 07/26/2019
ms.author: Zhchia
---

# Tutorial: Configure Oracle Fusion ERP for automatic user provisioning

The objective of this tutorial is to demonstrate the steps to be performed in Oracle Fusion ERP and Azure Active Directory (Azure AD) to configure Azure AD to automatically provision and de-provision users and/or groups to Oracle Fusion ERP.

> [!NOTE]
>  This tutorial describes a connector built on top of the Azure AD User Provisioning Service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Azure Active Directory](../app-provisioning/user-provisioning.md).
>
> This connector is currently in Preview. For more information on the general Microsoft Azure terms of use for Preview features, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/)

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* An Azure AD tenant
* An [Oracle Fusion ERP tenant](https://www.oracle.com/applications/erp/).
* A user account in Oracle Fusion ERP with Admin permissions.

## Assign Users to Oracle Fusion ERP 
Azure Active Directory uses a concept called assignments to determine which users should receive access to selected apps. In the context of automatic user provisioning, only the users and/or groups that have been assigned to an application in Azure AD are synchronized.

Before configuring and enabling automatic user provisioning, you should decide which users and/or groups in Azure AD need access to Oracle Fusion ERP. Once decided, you can assign these users and/or groups to Oracle Fusion ERP by following the instructions here:
 
* [Assign a user or group to an enterprise app](../manage-apps/assign-user-or-group-access-portal.md) 

 ## Important tips for assigning users to Oracle Fusion ERP 

 * It is recommended that a single Azure AD user is assigned to Oracle Fusion ERP to test the automatic user provisioning configuration. Additional users and/or groups may be assigned later.

* When assigning a user to Oracle Fusion ERP, you must select any valid application-specific role (if available) in the assignment dialog. Users with the Default Access role are excluded from provisioning.

## Set up Oracle Fusion ERP for provisioning

Before configuring Oracle Fusion ERP for automatic user provisioning with Azure AD, you will need to enable SCIM provisioning on Oracle Fusion ERP.

1. Sign in to your [Oracle Fusion ERP Admin Console](https://cloud.oracle.com/sign-in)

2. Click the Navigator on the top-left top corner. Under **Tools**, select **Security Console**.

	![Oracle Fusion ERP Add SCIM](media/oracle-fusion-erp-provisioning-tutorial/login.png)

3. Navigate to **Users**.
	
	![Oracle Fusion ERP Add SCIM](media/oracle-fusion-erp-provisioning-tutorial/user.png)

4. Save the username and password for the admin user account which you will use to log into the Oracle Fusion ERP admin console. These values need to be entered in the **Admin Username** and **Password** fields in the Provisioning tab of your Oracle Fusion ERP application in the Azure portal.

## Add Oracle Fusion ERP from the gallery

To configure Oracle Fusion ERP for automatic user provisioning with Azure AD, you need to add Oracle Fusion ERP from the Azure AD application gallery to your list of managed SaaS applications.

**To add Oracle Fusion ERP from the Azure AD application gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, in the left navigation panel, select **Azure Active Directory**.

	![The Azure Active Directory button](common/select-azuread.png)

2. Go to **Enterprise applications**, and then select **All applications**.

	![The Enterprise applications blade](common/enterprise-applications.png)

3. To add a new application, select the **New application** button at the top of the pane.

	![The New application button](common/add-new-app.png)

4. In the search box, enter **Oracle Fusion ERP**, select **Oracle Fusion ERP** in the results panel.

	![Oracle Fusion ERP in the results list](common/search-new-app.png)

 ## Configure automatic user provisioning to Oracle Fusion ERP 

This section guides you through the steps to configure the Azure AD provisioning service to create, update, and disable users and/or groups in Oracle Fusion ERP based on user and/or group assignments in Azure AD.

> [!TIP]
> You may also choose to enable SAML-based single sign-on for Oracle Fusion ERP by following the instructions provided in the [Oracle Fusion ERP Single sign-on tutorial](oracle-fusion-erp-tutorial.md). Single sign-on can be configured independently of automatic user provisioning, though these two features complement each other.

> [!NOTE]
> To learn more about Oracle Fusion ERP's SCIM endpoint, refer to [REST API for Common Features in Oracle Applications Cloud](https://docs.oracle.com/en/cloud/saas/applications-common/18b/farca/index.html).

### To configure automatic user provisioning for Fuze in Azure AD:

1. Sign in to the [Azure portal](https://portal.azure.com). Select **Enterprise Applications**, then select **All applications**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **Oracle Fusion ERP**.

	![The Oracle Fusion ERP link in the Applications list](common/all-applications.png)

3. Select the **Provisioning** tab.

	![Provisioning tab](common/provisioning.png)

4. Set the **Provisioning Mode** to **Automatic**.

	![Provisioning tab](common/provisioning-automatic.png)

5. Under the **Admin Credentials** section, input `https://ejlv.fa.em2.oraclecloud.com/hcmRestApi/scim/` in **Tenant URL**. Enter the admin user name and password retrieved earlier into the **Admin Username** and **Password** fields. Click on **Test connection** between Azure AD and Oracle Fusion ERP. 

	![Oracle Fusion ERP Add SCIM](media/oracle-fusion-erp-provisioning-tutorial/admin.png)

6. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and check the checkbox - **Send an email notification when a failure occurs**.

	![Notification Email](common/provisioning-notification-email.png)

7. Click **Save**.

8. Under the **Mappings** section, select **Synchronize Azure Active Directory Users to Oracle Fusion ERP**.

	![Oracle Fusion ERP Add SCIM](media/oracle-fusion-erp-provisioning-tutorial/user-mapping.png)

9. Review the user attributes that are synchronized from Azure AD to Oracle Fusion ERP in the **Attribute-Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in Oracle Fusion ERP for update operations. Select the **Save** button to commit any changes.

	![Oracle Fusion ERP Add SCIM](media/oracle-fusion-erp-provisioning-tutorial/user-attribute.png)

10. Under the **Mappings** section, select **Synchronize Azure Active Directory Groups to Oracle Fusion ERP**.

	![Oracle Fusion ERP Group Mappings](media/oracle-fusion-erp-provisioning-tutorial/groupmappings.png)

11. Review the group attributes that are synchronized from Azure AD to Oracle Fusion ERP in the **Attribute Mapping** section. The attributes selected as **Matching** properties are used to match the groups in Oracle Fusion ERP for update operations. Select the **Save** button to commit any changes.

	![Oracle Fusion ERP Group Attributes](media/oracle-fusion-erp-provisioning-tutorial/groupattributes.png)

12. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

13. To enable the Azure AD provisioning service for Oracle Fusion ERP, change the **Provisioning Status** to **On** in the **Settings** section.

	![Provisioning Status Toggled On](common/provisioning-toggle-on.png)

14. Define the users and/or groups that you would like to provision to Oracle Fusion ERP by choosing the desired values in **Scope** in the **Settings** section.

	![Provisioning Scope](common/provisioning-scope.png)

15. When you are ready to provision, click **Save**.

	![Saving Provisioning Configuration](common/provisioning-configuration-save.png)

	This operation starts the initial synchronization of all users and/or groups defined in **Scope** in the **Settings** section. The initial sync takes longer to perform than subsequent syncs, which occur approximately every 40 minutes as long as the Azure AD provisioning service is running. You can use the **Synchronization Details** section to monitor progress and follow links to provisioning activity report, which describes all actions performed by the Azure AD provisioning service on Oracle Fusion ERP.

	For more information on how to read the Azure AD provisioning logs, see [Reporting on automatic user account provisioning](../app-provisioning/check-status-user-account-provisioning.md).

## Connector limitations

* Oracle Fusion ERP only supports Basic Authentication for their SCIM endpoint.
* Oracle Fusion ERP does not support group provisioning.
* Roles in Oracle Fusion ERP are mapped to groups in Azure AD. To assign roles to users in Oracle Fusion ERP from Azure AD, you will need to assign users to the desired Azure AD groups that are named after roles in Oracle Fusion ERP.

## Additional resources

* [Managing user account provisioning for Enterprise Apps](../app-provisioning/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md)
