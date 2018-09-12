---
title: 'Tutorial: Configure Cornerstone OnDemand for automatic user provisioning with Azure Active Directory | Microsoft Docs'
description: Learn how to configure Azure Active Directory to automatically provision and de-provision user accounts to Cornerstone OnDemand.
services: active-directory
documentationcenter: ''
author: zhchia
writer: zhchia
manager: beatrizd

ms.assetid: d4ca2365-6729-48f7-bb7f-c0f5ffe740a3
ms.service: active-directory
ms.component: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/31/2018
ms.author: v-ant
---

# Tutorial: Configure Cornerstone OnDemand for automatic user provisioning


The objective of this tutorial is to demonstrate the steps to be performed in Cornerstone OnDemand and Azure Active Directory (Azure AD) to configure Azure AD to automatically provision and de-provision users and/or groups to Cornerstone OnDemand.


> [!NOTE]
> This tutorial describes a connector built on top of the Azure AD User Provisioning Service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Azure Active Directory](../manage-apps/user-provisioning.md).

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

*   An Azure AD tenant
*   A Cornerstone OnDemand tenant
*   A user account in Cornerstone OnDemand with Admin permissions


> [!NOTE]
> The Azure AD provisioning integration relies on the [Cornerstone OnDemand Webservice](https://help.csod.com/help/csod_0/Content/Resources/Documents/WebServices/CSOD_-_Summary_of_Web_Services_v20151106.pdf), which is available to Cornerstone OnDemand teams.

## Adding Cornerstone OnDemand from the gallery
Before configuring Cornerstone OnDemand for automatic user provisioning with Azure AD, you need to add Cornerstone OnDemand from the Azure AD application gallery to your list of managed SaaS applications.

**To add Cornerstone OnDemand from the Azure AD application gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click on the **Azure Active Directory** icon. 

	![The Azure Active Directory button][1]

2. Navigate to **Enterprise applications** > **All applications**.

	![The Enterprise applications Section][2]
	
3. To add Cornerstone OnDemand, click the **New application** button on the top of the dialog.

	![The New application button][3]

4. In the search box, type **Cornerstone OnDemand**.

	![Cornerstone OnDemand Provisioning](./media/cornerstone-ondemand-provisioning-tutorial/AppSearch.png)

5. In the results panel, select **Cornerstone OnDemand**, and then click the **Add** button to add Cornerstone OnDemand to your list of SaaS applications.

	![Cornerstone OnDemand Provisioning](./media/cornerstone-ondemand-provisioning-tutorial/AppSearchResults.png)

	![Cornerstone OnDemand Provisioning](./media/cornerstone-ondemand-provisioning-tutorial/AppCreation.png)

## Assigning users to Cornerstone OnDemand

Azure Active Directory uses a concept called "assignments" to determine which users should receive access to selected apps. In the context of automatic user provisioning, only the users and/or groups that have been "assigned" to an application in Azure AD are synchronized. 

Before configuring and enabling automatic user provisioning, you should decide which users and/or groups in Azure AD need access to Cornerstone OnDemand. Once decided, you can assign these users and/or groups to Cornerstone OnDemand by following the instructions here:

*   [Assign a user or group to an enterprise app](../manage-apps/assign-user-or-group-access-portal.md)

### Important tips for assigning users to Cornerstone OnDemand

*	It is recommended that a single Azure AD user is assigned to Cornerstone OnDemand to test the automatic user provisioning configuration. Additional users and/or groups may be assigned later.

*	When assigning a user to Cornerstone OnDemand, you must select any valid application-specific role (if available) in the assignment dialog. Users with the **Default Access** role are excluded from provisioning.

## Configuring automatic user provisioning to Cornerstone OnDemand

This section guides you through the steps to configure the Azure AD provisioning service to create, update, and disable users and/or groups in Cornerstone OnDemand based on user and/or group assignments in Azure AD.


### To configure automatic user provisioning for Cornerstone OnDemand in Azure AD:


1. Sign in to the [Azure portal](https://portal.azure.com) and browse to **Azure Active Directory > Enterprise applications > All applications**.

2. Select Cornerstone OnDemand from your list of SaaS applications.
 
	![Cornerstone OnDemand Provisioning](./media/cornerstone-ondemand-provisioning-tutorial/Successcenter2.png)

3. Select the **Provisioning** tab.

	![Cornerstone OnDemand Provisioning](./media/cornerstone-ondemand-provisioning-tutorial/ProvisioningTab.png)

4. Set the **Provisioning Mode** to **Automatic**.

	![Cornerstone OnDemand Provisioning](./media/cornerstone-ondemand-provisioning-tutorial/ProvisioningCredentials.png)

5. Under the **Admin Credentials** section, input the **Admin Username**, **Admin Password**, and **Domain** of your Cornerstone OnDemand's account.

	*   In the **Admin Username** field, populate the domain\username of the admin account on your Cornerstone OnDemand tenant. Example: contoso\admin.

	*   In the **Admin Password** field, populate the password corresponding to the admin username.

	*   In the **Domain** field, populate the webservice URL of the Cornerstone OnDemand tenant. Example: The service is located at `https://ws-[corpname].csod.com/feed30/clientdataservice.asmx`, for Contoso the domain is `https://ws-contoso.csod.com/feed30/clientdataservice.asmx`. For more information on how to retrieve the webservice URL, see [here](https://help.csod.com/help/csod_0/Content/Resources/Documents/WebServices/CSOD_Web_Services_-_User-OU_Technical_Specification_v20160222.pdf).

6. Upon populating the fields shown in Step 5, click **Test Connection** to ensure Azure AD can connect to Cornerstone OnDemand. If the connection fails, ensure your Cornerstone OnDemand account has Admin permissions and try again.

	![Cornerstone OnDemand Provisioning](./media/cornerstone-ondemand-provisioning-tutorial/TestConnection.png)

7. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and check the checkbox - **Send an email notification when a failure occurs**.

	![Cornerstone OnDemand Provisioning](./media/cornerstone-ondemand-provisioning-tutorial/EmailNotification.png)

8. Click **Save**.

9. Under the **Mappings** section, select **Synchronize Azure Active Directory Users to Cornerstone OnDemand**.

	![Cornerstone OnDemand Provisioning](./media/cornerstone-ondemand-provisioning-tutorial/UserMapping.png)

10. Review the user attributes that are synchronized from Azure AD to Cornerstone OnDemand in the **Attribute Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in Cornerstone OnDemand for update operations. Select the **Save** button to commit any changes.

	![Cornerstone OnDemand Provisioning](./media/cornerstone-ondemand-provisioning-tutorial/UserMappingAttributes.png)

11. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](../manage-apps/define-conditional-rules-for-provisioning-user-accounts.md).

12. To enable the Azure AD provisioning service for Cornerstone OnDemand, change the **Provisioning Status** to **On** in the **Settings** section.

	![Cornerstone OnDemand Provisioning](./media/cornerstone-ondemand-provisioning-tutorial/ProvisioningStatus.png)

13. Define the users and/or groups that you would like to provision to Cornerstone OnDemand by choosing the desired values in **Scope** in the **Settings** section.

	![Cornerstone OnDemand Provisioning](./media/cornerstone-ondemand-provisioning-tutorial/SyncScope.png)

14. When you are ready to provision, click **Save**.

	![Cornerstone OnDemand Provisioning](./media/cornerstone-ondemand-provisioning-tutorial/Save.png)


This operation starts the initial synchronization of all users and/or groups defined in **Scope** in the **Settings** section. The initial sync takes longer to perform than subsequent syncs, which occur approximately every 40 minutes as long as the Azure AD provisioning service is running. You can use the **Synchronization Details** section to monitor progress and follow links to provisioning activity report, which describes all actions performed by the Azure AD provisioning service on Cornerstone OnDemand.

For more information on how to read the Azure AD provisioning logs, see [Reporting on automatic user account provisioning](../manage-apps/check-status-user-account-provisioning.md).
## Connector Limitations

* The Cornerstone OnDemand **Position** attribute expects a value that corresponds to the roles on the Cornerstone OnDemand portal. The list of valid **Position** values can be obtained by navigating to **Edit User Record > Organization Structure > Position** in the Cornerstone OnDemand portal.
	![Cornerstone OnDemand Provisioning Edit User](./media/cornerstone-ondemand-provisioning-tutorial/UserEdit.png)
	![Cornerstone OnDemand Provisioning Position](./media/cornerstone-ondemand-provisioning-tutorial/UserPosition.png)
	![Cornerstone OnDemand Provisioning Positions List](./media/cornerstone-ondemand-provisioning-tutorial/PostionId.png)
	
## Additional resources

* [Managing user account provisioning for Enterprise Apps](../manage-apps/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)



## Next steps

* [Learn how to review logs and get reports on provisioning activity](../manage-apps/check-status-user-account-provisioning.md)

<!--Image references-->
[1]: ./media/cornerstone-ondemand-provisioning-tutorial/tutorial_general_01.png
[2]: ./media/cornerstone-ondemand-provisioning-tutorial/tutorial_general_02.png
[3]: ./media/cornerstone-ondemand-provisioning-tutorial/tutorial_general_03.png
