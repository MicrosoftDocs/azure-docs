---
title: 'Tutorial: Configure Cornerstone OnDemand for automatic user provisioning with Azure Active Directory | Microsoft Docs'
description: Learn how to configure Azure Active Directory to automatically provision and deprovision user accounts to Cornerstone OnDemand.
services: active-directory
documentationcenter: ''
author: zhchia
writer: zhchia
manager: beatrizd
ms.assetid: d4ca2365-6729-48f7-bb7f-c0f5ffe740a3
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/27/2019
ms.author: "jeedes"
ms.collection: M365-identity-device-management
---

# Tutorial: Configure Cornerstone OnDemand for automatic user provisioning

This tutorial demonstrates the steps to perform in Cornerstone OnDemand and Azure Active Directory (Azure AD) to configure Azure AD to automatically provision and deprovision users or groups to Cornerstone OnDemand.

> [!NOTE]
> This tutorial describes a connector that's built on top of the Azure AD user provisioning service. For information on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to software-as-a-service (SaaS) applications with Azure Active Directory](../app-provisioning/user-provisioning.md).

## Prerequisites

The scenario outlined in this tutorial assumes that you have:

* An Azure AD tenant.
* A Cornerstone OnDemand tenant.
* A user account in Cornerstone OnDemand with admin permissions.

> [!NOTE]
> The Azure AD provisioning integration relies on the [Cornerstone OnDemand web service](https://www.cornerstoneondemand.com/). This service is available to Cornerstone OnDemand teams.

## Add Cornerstone OnDemand from the Azure Marketplace

Before you configure Cornerstone OnDemand for automatic user provisioning with Azure AD, add Cornerstone OnDemand from the Marketplace to your list of managed SaaS applications.

To add Cornerstone OnDemand from the Marketplace, follow these steps.

1. In the [Azure portal](https://portal.azure.com), in the navigation pane on the left, select **Azure Active Directory**.

	![The Azure Active Directory icon](common/select-azuread.png)

2. Go to **Enterprise applications**, and then select **All applications**.

	![The Enterprise applications blade](common/enterprise-applications.png)

3. To add a new application, select **New application** at the top of the dialog box.

	![The New application button](common/add-new-app.png)

4. In the search box, enter **Cornerstone OnDemand** and select **Cornerstone OnDemand** from the result panel. To add the application, select **Add**.

	![Cornerstone OnDemand in the results list](common/search-new-app.png)

## Assign users to Cornerstone OnDemand

Azure Active Directory uses a concept called *assignments* to determine which users should receive access to selected apps. In the context of automatic user provisioning, only the users or groups that were assigned to an application in Azure AD are synchronized.

Before you configure and enable automatic user provisioning, decide which users or groups in Azure AD need access to Cornerstone OnDemand. To assign these users or groups to Cornerstone OnDemand, follow the instructions in [Assign a user or group to an enterprise app](../manage-apps/assign-user-or-group-access-portal.md).

### Important tips for assigning users to Cornerstone OnDemand

* We recommend that you assign a single Azure AD user to Cornerstone OnDemand to test the automatic user provisioning configuration. You can assign additional users or groups later.

* When you assign a user to Cornerstone OnDemand, select any valid application-specific role, if available, in the assignment dialog box. Users with the **Default Access** role are excluded from provisioning.

## Configure automatic user provisioning to Cornerstone OnDemand

This section guides you through the steps to configure the Azure AD provisioning service. Use it to create, update, and disable users or groups in Cornerstone OnDemand based on user or group assignments in Azure AD.

To configure automatic user provisioning for Cornerstone OnDemand in Azure AD, follow these steps.

1. Sign in to the [Azure portal](https://portal.azure.com). Select **Enterprise applications** > **All applications** > **Cornerstone OnDemand**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **Cornerstone OnDemand**.

	![The Cornerstone OnDemand link in the applications list](common/all-applications.png)

3. Select the **Provisioning** tab.

	![Cornerstone OnDemand Provisioning](./media/cornerstone-ondemand-provisioning-tutorial/ProvisioningTab.png)

4. Set **Provisioning Mode** to **Automatic**.

	![Cornerstone OnDemand Provisioning Mode](./media/cornerstone-ondemand-provisioning-tutorial/ProvisioningCredentials.png)

5. Under the **Admin Credentials** section, enter the admin username, admin password, and domain of your Cornerstone OnDemand's account:

	* In the **Admin Username** box, fill in the domain or username of the admin account on your Cornerstone OnDemand tenant. An example is contoso\admin.

	* In the **Admin Password** box, fill in the password that corresponds to the admin username.

	* In the **Domain** box, fill in the web service URL of the Cornerstone OnDemand tenant. For example, the service is located at `https://ws-[corpname].csod.com/feed30/clientdataservice.asmx`, and for Contoso the domain is `https://ws-contoso.csod.com/feed30/clientdataservice.asmx`. For more information on how to retrieve the web service URL, see [this pdf](https://help.csod.com/help/csod_0/Content/Resources/Documents/WebServices/CSOD_Web_Services_-_User-OU_Technical_Specification_v20160222.pdf).

6. After you fill in the boxes shown in Step 5, select **Test Connection** to make sure that Azure AD can connect to Cornerstone OnDemand. If the connection fails, make sure that your Cornerstone OnDemand account has admin permissions and try again.

	![Cornerstone OnDemand Test Connection](./media/cornerstone-ondemand-provisioning-tutorial/TestConnection.png)

7. In the **Notification Email** box, enter the email address of the person or group to receive the provisioning error notifications. Select the **Send an email notification when a failure occurs** check box.

	![Cornerstone OnDemand Notification Email](./media/cornerstone-ondemand-provisioning-tutorial/EmailNotification.png)

8. Select **Save**.

9. Under the **Mappings** section, select **Synchronize Azure Active Directory Users to Cornerstone OnDemand**.

	![Cornerstone OnDemand synchronization](./media/cornerstone-ondemand-provisioning-tutorial/UserMapping.png)

10. Review the user attributes that are synchronized from Azure AD to Cornerstone OnDemand in the **Attribute Mappings** section. The attributes selected as **Matching** properties are used to match the user accounts in Cornerstone OnDemand for update operations. To save any changes, select **Save**.

	![Cornerstone OnDemand Attribute Mappings](./media/cornerstone-ondemand-provisioning-tutorial/UserMappingAttributes.png)

11. To configure scoping filters, follow the instructions in the [scoping filter tutorial](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

12. To enable the Azure AD provisioning service for Cornerstone OnDemand, in the **Settings** section, change **Provisioning Status** to **On**.

	![Cornerstone OnDemand Provisioning Status](./media/cornerstone-ondemand-provisioning-tutorial/ProvisioningStatus.png)

13. Define the users or groups that you want to provision to Cornerstone OnDemand. In the **Settings** section, select the values you want in **Scope**.

	![Cornerstone OnDemand Scope](./media/cornerstone-ondemand-provisioning-tutorial/SyncScope.png)

14. When you're ready to provision, select **Save**.

	![Cornerstone OnDemand Save](./media/cornerstone-ondemand-provisioning-tutorial/Save.png)

This operation starts the initial synchronization of all users or groups defined in **Scope** in the **Settings** section. The initial sync takes longer to perform than later syncs. They occur approximately every 40 minutes as long as the Azure AD provisioning service runs. 

You can use the **Synchronization Details** section to monitor progress and follow links to the provisioning activity report. The report describes all the actions performed by the Azure AD provisioning service on Cornerstone OnDemand.

For information on how to read the Azure AD provisioning logs, see [Reporting on automatic user account provisioning](../app-provisioning/check-status-user-account-provisioning.md).

## Connector limitations

The Cornerstone OnDemand **Position** attribute expects a value that corresponds to the roles on the Cornerstone OnDemand portal. To get a list of valid **Position** values, go to **Edit User Record > Organization Structure > Position** in the Cornerstone OnDemand portal.

![Cornerstone OnDemand Provisioning Edit User Record](./media/cornerstone-ondemand-provisioning-tutorial/UserEdit.png)

![Cornerstone OnDemand Provisioning Position](./media/cornerstone-ondemand-provisioning-tutorial/UserPosition.png)

![Cornerstone OnDemand Provisioning position list](./media/cornerstone-ondemand-provisioning-tutorial/PostionId.png)

## Additional resources

* [Manage user account provisioning for enterprise apps](../app-provisioning/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md)

<!--Image references-->
[1]: ./media/cornerstone-ondemand-provisioning-tutorial/tutorial_general_01.png
[2]: ./media/cornerstone-ondemand-provisioning-tutorial/tutorial_general_02.png
[3]: ./media/cornerstone-ondemand-provisioning-tutorial/tutorial_general_03.png
