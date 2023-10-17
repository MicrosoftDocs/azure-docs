---
title: 'Tutorial: User provisioning for Cerner Central'
description: Learn how to configure Microsoft Entra ID to automatically provision users to a roster in Cerner Central.
services: active-directory
author: ArvindHarinder1
manager: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 11/21/2022
ms.author: arvinh
---

# Tutorial: Configure Cerner Central for automatic user provisioning

The objective of this tutorial is to show you the steps you need to perform in Cerner Central and Microsoft Entra ID to automatically provision and de-provision user accounts from Microsoft Entra ID to a user roster in Cerner Central.

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following items:

* A Microsoft Entra tenant
* A Cerner Central tenant

> [!NOTE]
> Microsoft Entra ID integrates with Cerner Central using the SCIM protocol.

## Assigning users to Cerner Central

Microsoft Entra ID uses a concept called "assignments" to determine which users should receive access to selected apps. In the context of automatic user account provisioning, only the users and groups that have been "assigned" to an application in Microsoft Entra ID are synchronized. 

Before configuring and enabling the provisioning service, you should decide what users and/or groups in Microsoft Entra ID represent the users who need access to Cerner Central. Once decided, you can assign these users to Cerner Central by following the instructions here:

[Assign a user or group to an enterprise app](../manage-apps/assign-user-or-group-access-portal.md)

### Important tips for assigning users to Cerner Central

* It is recommended that a single Microsoft Entra user be assigned to Cerner Central to test the provisioning configuration. Additional users and/or groups may be assigned later.

* Once initial testing is complete for a single user, Cerner Central recommends assigning the entire list of users intended to access any Cerner solution (not just Cerner Central) to be provisioned to Cerner’s user roster.  Other Cerner solutions leverage this list of users in the user roster.

* When assigning a user to Cerner Central, you must select the **User** role in the assignment dialog. Users with the "Default Access" role are excluded from provisioning.

## Configuring user provisioning to Cerner Central

This section guides you through connecting your Microsoft Entra ID to Cerner Central’s User Roster using Cerner's SCIM user account provisioning API, and configuring the provisioning service to create, update, and disable assigned user accounts in Cerner Central based on user and group assignment in Microsoft Entra ID.

> [!TIP]
> You may also choose to enable SAML-based single sign-on for Cerner Central, following the instructions provided in the [Azure portal](https://portal.azure.com). Single sign-on can be configured independently of automatic provisioning, though these two features complement each other. For more information, see the [Cerner Central single sign-on tutorial](cernercentral-tutorial.md).

<a name='to-configure-automatic-user-account-provisioning-to-cerner-central-in-azure-ad'></a>

### To configure automatic user account provisioning to Cerner Central in Microsoft Entra ID:

In order to provision user accounts to Cerner Central, you’ll need to request a Cerner Central system account from Cerner, and generate an OAuth bearer token that Microsoft Entra ID can use to connect to Cerner's SCIM endpoint. It is also recommended that the integration be performed in a Cerner sandbox environment before deploying to production.

1. The first step is to ensure the people managing the Cerner and Microsoft Entra integration have a CernerCare account, which is required to access the documentation necessary to complete the instructions. If necessary, use the URLs below to create CernerCare accounts in each applicable environment.

   * Sandbox:  https://sandboxcernercare.com/accounts/create

   * Production:  https://cernercare.com/accounts/create  

1. Next, a system account must be created for Microsoft Entra ID. Use the instructions below to request a System Account for your sandbox and production environments.

   * Instructions:  https://wiki.ucern.com/display/CernerCentral/Requesting+A+System+Account

   * Sandbox: https://sandboxcernercentral.com/system-accounts/

   * Production:  https://cernercentral.com/system-accounts/

1. Next, generate an OAuth bearer token for each of your system accounts. To do this, follow the instructions below.

   * Instructions:  https://wiki.ucern.com/display/public/reference/Accessing+Cerner%27s+Web+Services+Using+A+System+Account+Bearer+Token

   * Sandbox: https://sandboxcernercentral.com/system-accounts/

   * Production:  https://cernercentral.com/system-accounts/

1. Finally, you need to acquire User Roster Realm IDs for both the sandbox and production environments in Cerner to complete the configuration. For information on how to acquire this, see: https://wiki.ucern.com/display/public/reference/Publishing+Identity+Data+Using+SCIM. 

1. Now you can configure Microsoft Entra ID to provision user accounts to Cerner. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **All applications**.

1. If you have already configured Cerner Central for single sign-on, search for your instance of Cerner Central using the search field. Otherwise, select **Add** and search for **Cerner Central** in the application gallery. Select Cerner Central from the search results, and add it to your list of applications.

1. Select your instance of Cerner Central, then select the **Provisioning** tab.

1. Set the **Provisioning Mode** to **Automatic**.

   ![Cerner Central Provisioning](./media/cernercentral-provisioning-tutorial/Cerner.PNG)

1. Fill in the following fields under **Admin Credentials**:

   * In the **Tenant URL** field, enter a URL in the format below, replacing "User-Roster-Realm-ID" with the realm ID you acquired in step #4.

    > Sandbox:
    > ```https://user-roster-api.sandboxcernercentral.com/scim/v1/Realms/User-Roster-Realm-ID/```
    > 
    > Production:
    > ```https://user-roster-api.cernercentral.com/scim/v1/Realms/User-Roster-Realm-ID/``` 

   * In the **Secret Token** field, enter the OAuth bearer token you generated in step #3 and click **Test Connection**.

   * You should see a success notification on the upper-right side of your portal.

1. Enter the email address of a person or group who should receive provisioning error notifications in the **Notification Email** field, and check the checkbox below.

1. Click **Save**.

1. In the **Attribute Mappings** section, review the user and group attributes to be synchronized from Microsoft Entra ID to Cerner Central. The attributes selected as **Matching** properties are used to match the user accounts and groups in Cerner Central for update operations. Select the Save button to commit any changes.

1. To enable the Microsoft Entra provisioning service for Cerner Central, change the **Provisioning Status** to **On** in the **Settings** section

1. Click **Save**.

This starts the initial synchronization of any users and/or groups assigned to Cerner Central in the Users and Groups section. The initial sync takes longer to perform than subsequent syncs, which occur approximately every 40 minutes as long as the Microsoft Entra provisioning service is running. You can use the **Synchronization Details** section to monitor progress and follow links to provisioning activity logs, which describe all actions performed by the provisioning service on your Cerner Central app.

For more information on how to read the Microsoft Entra provisioning logs, see [Reporting on automatic user account provisioning](../app-provisioning/check-status-user-account-provisioning.md).

## Additional resources

* [Cerner Central: Publishing identity data using Microsoft Entra ID](https://wiki.ucern.com/display/public/reference/Publishing+Identity+Data+Using+Azure+AD)
* [Tutorial: Configuring Cerner Central for single sign-on with Microsoft Entra ID](cernercentral-tutorial.md)
* [Managing user account provisioning for Enterprise Apps](../app-provisioning/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md).
