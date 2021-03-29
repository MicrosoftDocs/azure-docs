---
title: 'Tutorial: configure UNIFI for automatic user provisioning | Microsoft Docs'
description: Learn how to configure automatic user provisioning between Azure Active Directory and UNIFI.
services: active-directory
author: alex-ganchuk
manager: 
ms.reviewer: 
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 03/16/2021
ms.author: 
---
# Tutorial: Azure Active Directory integration with UNIFI

## User Provisioning capabilities supported

* Create users 
* Remove users when they do not require access anymore
* Keep user attributes synchronized between Azure AD and UNIFI
* Provision groups and group memberships in UNIFI


## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following items:
* An Azure Active directory [tenant](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-create-new-tenant).
* A user account in Azure AD with [permission]() to configure provisioning (e.g. Application Administrator, Cloud Application administrator, Application Owner, or Global Administrator).
* A user account in UNIFI with Admin permissions for the organization
* Single Sign-On (SSO) Provider for Azure configured within UNIFI platform - [tutorial](https://docs.microsoft.com/en-us/azure/active-directory/saas-apps/unifi-tutorial)

## Assigning users to UNIFI

Azure Active Directory uses a concept called "assignments" to determine which users should receive access to selected apps. In the context of automatic user account provisioning, synchronizing the users and groups that have been "assigned" to an application in Azure AD is a preferred way.
Before configuring and enabling the provisioning service, you need to decide what users and/or groups in Azure AD represent the users who need access to your UNIFI app. Once decided, you can assign these users to your UNIFI app by following the instructions [here](https://docs.microsoft.com/en-us/azure/active-directory/manage-apps/assign-user-or-group-access-portal)


### Tips for assigning users to UNIFI

* It is recommended that a single Azure AD user is assigned to UNIFI to test the provisioning configuration. Additional users and/or groups may be assigned later.
* When assigning a user to UNIFI, you must select either the **User** role, or another valid application-specific role (if available) in the assignment dialog. The **Default Access** role does not work for provisioning, and these users are skipped.


## Configuring user provisioning to UNIFI

This section guides you through connecting your Azure AD to UNIFI's user account provisioning API, and configuring the provisioning service to create, update, and disable assigned user accounts in UNIFI based on user and group assignment in Azure AD.


1.	Sign in to the [Azure portal](https://portal.azure.com/) and select **Enterprise Applications**, select **All applications**, then select **UNIFI** in the applications list.

	![Screenshot shows Users selected from the UNIFI site.](https://user-images.githubusercontent.com/63358567/112865744-ed2e4680-906d-11eb-9725-6595b39fa6b0.png)
 
2.	Select the **Provisioning** tab.

	![Screenshot shows Users selected from the UNIFI site.](https://user-images.githubusercontent.com/63358567/112865763-ef90a080-906d-11eb-8d71-2c73cd44d970.png)
 
3.	Set the **Provisioning Mode** to **Automatic**.

	![Screenshot shows Users selected from the UNIFI site.](https://user-images.githubusercontent.com/63358567/112865745-edc6dd00-906d-11eb-8431-633575b13132.png)
 
4.	Under the **Admin Credentials** section, input the **Secret Token** of your UNIFI account as described in Step 5.
* **Tenant URL** - https://licensing.inviewcloud.com/api/scim/v2

	![Screenshot shows Users selected from the UNIFI site.](https://user-images.githubusercontent.com/63358567/112865747-edc6dd00-906d-11eb-90db-e01d14af86c6.png)
 

5.	The **Secret Token** for your UNIFI account is located in **Users > Configure SSO > Azure > Token**. In case if you have not setup the Single Sign-On (SSO) for Azure please refer to this [tutorial](https://docs.microsoft.com/en-us/azure/active-directory/saas-apps/unifi-tutorial).

	![Screenshot shows Users selected from the UNIFI site.](https://user-images.githubusercontent.com/63358567/112865749-edc6dd00-906d-11eb-9f1a-c75fa2c5cf7b.png)
 

6.	Upon populating the fields shown in Step 5, click **Test Connection** to ensure Azure AD can connect to UNIFI. If the connection fails, ensure your UNIFI account has Admin permissions and try again.

	![Screenshot shows Users selected from the UNIFI site.](https://user-images.githubusercontent.com/63358567/112865750-ee5f7380-906d-11eb-8a2b-18ff90be424d.png)
 

7.	In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and check the checkbox **Send an email notification when a failure occurs**.

	![Screenshot shows Users selected from the UNIFI site.](https://user-images.githubusercontent.com/63358567/112865751-ee5f7380-906d-11eb-95de-816638556090.png)
 

8.	Click **Save**.
9.	Under the **Mappings section, select Provision Azure Active Directory Users & Groups to UNIFI**.

	![Screenshot shows Users selected from the UNIFI site.](https://user-images.githubusercontent.com/63358567/112865754-ee5f7380-906d-11eb-981c-cd0ba14c827f.png)
 
10.	Review the **User & Group** attributes that are synchronized from Azure AD to UNIFI in the **Attribute Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in UNIFI for update operations. Select the **Save** button to commit any changes.
 
 	![Screenshot shows Users selected from the UNIFI site.](https://user-images.githubusercontent.com/63358567/112865755-eef80a00-906d-11eb-9f51-93d8b4a4e6e3.png)
	
	![Screenshot shows Users selected from the UNIFI site.](https://user-images.githubusercontent.com/63358567/112865757-eef80a00-906d-11eb-8502-cf7dc4791424.png)
 
11.	To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](https://docs.microsoft.com/en-us/azure/active-directory/app-provisioning/define-conditional-rules-for-provisioning-user-accounts).
12.	To enable the Azure AD provisioning service for UNIFI, change the **Provisioning Status** to **On** in the **Settings** section.

	![Screenshot shows Users selected from the UNIFI site.](https://user-images.githubusercontent.com/63358567/112865760-eef80a00-906d-11eb-9c0b-e72ac21882aa.png)
 
13.	Define the users and/or groups that you would like to provision to UNIFI by choosing the desired values in **Scope** in the **Settings** section.

	![Screenshot shows Users selected from the UNIFI site.](https://user-images.githubusercontent.com/63358567/112865761-eef80a00-906d-11eb-84c4-aa2cb5e59d3e.png)
 
14.	When you are ready to provision, click **Save**.

This operation starts the initial synchronization of all users and/or groups defined in **Scope** in the **Settings** section. The initial sync takes longer to perform than subsequent syncs, which occur approximately every 40 minutes as long as the Azure AD provisioning service is running. You can use the **Synchronization Details** section to monitor progress and follow links to provisioning activity report, which describes all actions performed by the Azure AD provisioning service on **UNIFI**.

For more information on how to read the Azure AD provisioning logs, see [Reporting on automatic user account provisioning](https://docs.microsoft.com/en-us/azure/active-directory/app-provisioning/check-status-user-account-provisioning).

Once you've configured provisioning, use the following resources to monitor your deployment:
* Use the [provisioning logs](https://docs.microsoft.com/en-us/azure/active-directory/reports-monitoring/concept-provisioning-logs) to determine which users have been provisioned successfully or unsuccessfully
* Check the [progress bar](https://docs.microsoft.com/en-us/azure/active-directory/app-provisioning/application-provisioning-when-will-provisioning-finish-specific-user) to see the status of the provisioning cycle and how close it is to completion
* If the provisioning configuration seems to be in an unhealthy state, the application will go into quarantine. Learn more about quarantine states [here](https://docs.microsoft.com/en-us/azure/active-directory/app-provisioning/application-provisioning-quarantine-status).


## Additional resources

* [Managing user account provisioning for Enterprise Apps](https://docs.microsoft.com/en-us/azure/active-directory/app-provisioning/configure-automatic-user-provisioning-portal)
* [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/en-us/azure/active-directory/manage-apps/what-is-single-sign-on)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](https://docs.microsoft.com/en-us/azure/active-directory/app-provisioning/check-status-user-account-provisioning)
