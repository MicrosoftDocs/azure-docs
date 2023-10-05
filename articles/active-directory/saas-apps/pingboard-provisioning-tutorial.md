---
title: 'Tutorial: User provisioning for Pingboard'
description: Learn how to configure Microsoft Entra ID to automatically provision and de-provision user accounts to Pingboard.
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

# Tutorial: Configure Pingboard for automatic user provisioning

The purpose of this tutorial is to show you the steps you need to follow to enable automatic provisioning and de-provisioning of user accounts from Microsoft Entra ID to Pingboard.

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following items:

* A Microsoft Entra tenant
* A Pingboard tenant [Pro account](https://pingboard.com/pricing)
* A user account in Pingboard with admin permissions

> [!NOTE]
> Microsoft Entra provisioning integration relies on the [Pingboard API](https://pingboard.docs.apiary.io/#), which is available to your account.

## Assign users to Pingboard

Microsoft Entra ID uses a concept called "assignments" to determine which users should receive access to selected applications. In the context of automatic user account provisioning, only the users assigned to an application in Microsoft Entra ID are synchronized. 

Before you configure and enable the provisioning service, you must decide which users in Microsoft Entra ID need access to your Pingboard app. Then you can assign these users to your Pingboard app by following the instructions here:

[Assign a user to an enterprise app](../manage-apps/assign-user-or-group-access-portal.md)

### Important tips for assigning users to Pingboard

We recommend that you assign a single Microsoft Entra user to Pingboard to test the provisioning configuration. Additional users can be assigned later.

## Configure user provisioning to Pingboard 

This section guides you through connecting your Microsoft Entra ID to the Pingboard user account provisioning API. You also configure the provisioning service to create, update, and disable assigned user accounts in Pingboard that are based on user assignments in Microsoft Entra ID.

> [!TIP]
> To enable SAML-based single sign-on for Pingboard, follow the instructions provided in the [Azure portal](https://portal.azure.com). Single sign-on can be configured independently of automatic provisioning, although these two features complement each other.

<a name='to-configure-automatic-user-account-provisioning-to-pingboard-in-azure-ad'></a>

### To configure automatic user account provisioning to Pingboard in Microsoft Entra ID

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications**.

1. If you already configured Pingboard for single sign-on, search for your instance of Pingboard by using the search field. Otherwise, select **Add** and search for **Pingboard** in the application gallery. Select **Pingboard** from the search results, and add it to your list of applications.

1. Select your instance of Pingboard, and then select the **Provisioning** tab.

1. Set **Provisioning Mode** to **Automatic**.

    ![Pingboard Provisioning](./media/pingboard-provisioning-tutorial/pingboardazureprovisioning.png)

1. Under the **Admin Credentials** section, use the following steps:

    a. In **Tenant URL**, enter `https://your_domain.pingboard.com/scim/v2`, and replace "your_domain" with your real domain.

    b. Sign in to [Pingboard](https://pingboard.com/) by using your admin account.

    c. Select **Add-Ons** > **Integrations** > **Microsoft Entra ID**.

    d. Go to the **Configure** tab, and select **Enable user provisioning from Azure**.

    e. Copy the token in **OAuth Bearer Token**, and enter it in **Secret Token**.

1. Select **Test Connection** to test that you can connect to your Pingboard app. If the connection fails, test that your Pingboard account has admin permissions, and try the **Test Connection** step again.

1. Enter the email address of a person or group that you want to receive provisioning error notifications in **Notification Email**. Select the check box underneath.

1. Select **Save**.

1. Under the **Mappings** section, select **Synchronize Microsoft Entra users to Pingboard**.

1. In the **Attribute Mappings** section, review the user attributes to be synchronized from Microsoft Entra ID to Pingboard. The attributes selected as **Matching** properties are used to match the user accounts in Pingboard for update operations. Select **Save** to commit any changes. For more information, see [Customize user provisioning attribute mappings](../app-provisioning/customize-application-attributes.md).

1. To enable the Microsoft Entra provisioning service for Pingboard, in the **Settings** section, change **Provisioning Status** to **On**.

1. Select **Save** to start the initial synchronization of users assigned to Pingboard.

The initial synchronization takes longer to run than following syncs, which occur approximately every 40 minutes as long as the service is running. Use the **Synchronization Details** section to monitor progress and follow links to provisioning activity logs. The logs describe all actions taken by the provisioning service on your Pingboard app.

For more information on how to read the Microsoft Entra provisioning logs, see [Report on automatic user account provisioning](../app-provisioning/check-status-user-account-provisioning.md).

## Additional resources

* [Manage user account provisioning for enterprise apps](../app-provisioning/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)
* [Configure single sign-on](pingboard-tutorial.md)
