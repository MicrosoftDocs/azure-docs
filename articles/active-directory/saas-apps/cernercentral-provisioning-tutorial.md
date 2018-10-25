---
title: 'Tutorial: Configure Cerner Central for automatic user provisioning with Azure Active Directory | Microsoft Docs'
description: Learn how to configure Azure Active Directory to automatically provision users to a roster in Cerner Central.
services: active-directory
documentationcenter: ''
author: asmalser-msft
writer: asmalser-msft
manager: mtillman

ms.assetid: d4ca2365-6729-48f7-bb7f-c0f5ffe740a3
ms.service: active-directory
ms.component: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/26/2018
ms.author: asmalser-msft
---

# Tutorial: Configure Cerner Central for automatic user provisioning

The objective of this tutorial is to show you the steps you need to perform in Cerner Central and Azure AD to automatically provision and de-provision user accounts from Azure AD to a user roster in Cerner Central. 


## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following items:

*   An Azure Active Directory tenant
*   A Cerner Central tenant 

> [!NOTE]
> Azure Active Directory integrates with Cerner Central using the [SCIM](http://www.simplecloud.info/) protocol.

## Assigning users to Cerner Central

Azure Active Directory uses a concept called "assignments" to determine which users should receive access to selected apps. In the context of automatic user account provisioning, only the users and groups that have been "assigned" to an application in Azure AD are synchronized. 

Before configuring and enabling the provisioning service, you should decide what users and/or groups in Azure AD represent the users who need access to Cerner Central. Once decided, you can assign these users to Cerner Central by following the instructions here:

[Assign a user or group to an enterprise app](../manage-apps/assign-user-or-group-access-portal.md)

### Important tips for assigning users to Cerner Central

*	It is recommended that a single Azure AD user be assigned to Cerner Central to test the provisioning configuration. Additional users and/or groups may be assigned later.

* Once initial testing is complete for a single user, Cerner Central recommends assigning the entire list of users intended to access any Cerner solution (not just Cerner Central) to be provisioned to Cerner’s user roster.  Other Cerner solutions leverage this list of users in the user roster.

*	When assigning a user to Cerner Central, you must select the **User** role in the assignment dialog. Users with the "Default Access" role are excluded from provisioning.


## Configuring user provisioning to Cerner Central

This section guides you through connecting your Azure AD to Cerner Central’s User Roster using Cerner's SCIM user account provisioning API, and configuring the provisioning service to create, update, and disable assigned user accounts in Cerner Central based on user and group assignment in Azure AD.

> [!TIP]
> You may also choose to enabled SAML-based Single Sign-On for Cerner Central, following the instructions provided in [Azure portal (https://portal.azure.com). Single sign-on can be configured independently of automatic provisioning, though these two features complement each other. For more information, see the [Cerner Central single sign-on tutorial](cernercentral-tutorial.md).


### To configure automatic user account provisioning to Cerner Central in Azure AD:


In order to provision user accounts to Cerner Central, you’ll need to request a Cerner Central system account from Cerner, and generate an OAuth bearer token that Azure AD can use to connect to Cerner's SCIM endpoint. It is also recommended that the integration be performed in a Cerner sandbox environment before deploying to production.

1.	The first step is to ensure the people managing the Cerner and Azure AD integration have a CernerCare account, which is required to access the documentation necessary to complete the instructions. If necessary, use the URLs below to create CernerCare accounts in each applicable environment.

   * Sandbox:  https://sandboxcernercare.com/accounts/create

   * Production:  https://cernercare.com/accounts/create  

2.	Next, a system account must be created for Azure AD. Use the instructions below to request a System Account for your sandbox and production environments.

   * Instructions:  https://wiki.ucern.com/display/CernerCentral/Requesting+A+System+Account

   * Sandbox: https://sandboxcernercentral.com/system-accounts/

   * Production:  https://cernercentral.com/system-accounts/

3.	Next, generate an OAuth bearer token for each of your system accounts. To do this, follow the instructions below.

   * Instructions:  https://wiki.ucern.com/display/public/reference/Accessing+Cerner%27s+Web+Services+Using+A+System+Account+Bearer+Token

   * Sandbox: https://sandboxcernercentral.com/system-accounts/

   * Production:  https://cernercentral.com/system-accounts/

4. Finally, you need to acquire User Roster Realm IDs for both the sandbox and production environments in Cerner to complete the configuration. For information on how to acquire this, see: https://wiki.ucern.com/display/public/reference/Publishing+Identity+Data+Using+SCIM. 

5. Now you can configure Azure AD to provision user accounts to Cerner. Sign in to the [Azure portal](https://portal.azure.com), and browse to the **Azure Active Directory > Enterprise Apps > All applications**  section.

6. If you have already configured Cerner Central for single sign-on, search for your instance of Cerner Central using the search field. Otherwise, select **Add** and search for **Cerner Central** in the application gallery. Select Cerner Central from the search results, and add it to your list of applications.

7.	Select your instance of Cerner Central, then select the **Provisioning** tab.

8.	Set the **Provisioning Mode** to **Automatic**.

   ![Cerner Central Provisioning](./media/cernercentral-provisioning-tutorial/Cerner.PNG)

9.  Fill in the following fields under **Admin Credentials**:

   * In the **Tenant URL** field, enter a URL in the format below, replacing "User-Roster-Realm-ID" with the realm ID you acquired in step #4.

> Sandbox:
> https://user-roster-api.sandboxcernercentral.com/scim/v1/Realms/User-Roster-Realm-ID/ 

> Production:
> https://user-roster-api.cernercentral.com/scim/v1/Realms/User-Roster-Realm-ID/ 

   * In the **Secret Token** field, enter the OAuth bearer token you generated in step #3 and click **Test Connection**.

   * You should see a success notification on the upper­right side of your portal.

10. Enter the email address of a person or group who should receive provisioning error notifications in the **Notification Email** field, and check the checkbox below.

11. Click **Save**. 

12. In the **Attribute Mappings** section, review the user and group attributes to be synchronized from Azure AD to Cerner Central. The attributes selected as **Matching** properties are used to match the user accounts and groups in Cerner Central for update operations. Select the Save button to commit any changes.

13. To enable the Azure AD provisioning service for Cerner Central, change the **Provisioning Status** to **On** in the **Settings** section

14. Click **Save**. 

This starts the initial synchronization of any users and/or groups assigned to Cerner Central in the Users and Groups section. The initial sync takes longer to perform than subsequent syncs, which occur approximately every 40 minutes as long as the Azure AD provisioning service is running. You can use the **Synchronization Details** section to monitor progress and follow links to provisioning activity logs, which describe all actions performed by the provisioning service on your Cerner Central app.

For more information on how to read the Azure AD provisioning logs, see [Reporting on automatic user account provisioning](../manage-apps/check-status-user-account-provisioning.md).

## Additional resources

* [Cerner Central: Publishing identity data using Azure AD](https://wiki.ucern.com/display/public/reference/Publishing+Identity+Data+Using+Azure+AD)
* [Tutorial: Configuring Cerner Central for single sign-on with Azure Active Directory](cernercentral-tutorial.md)
* [Managing user account provisioning for Enterprise Apps](../manage-apps/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)

## Next steps
* [Learn how to review logs and get reports on provisioning activity](https://docs.microsoft.com/azure/active-directory/active-directory-saas-provisioning-reporting).
