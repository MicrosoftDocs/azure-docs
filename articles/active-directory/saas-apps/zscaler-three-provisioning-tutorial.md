---
title: 'Tutorial: Configure Zscaler Three for automatic user provisioning with Microsoft Entra ID'
description: In this tutorial, you'll learn how to configure Microsoft Entra ID to automatically provision and deprovision user accounts to Zscaler Three.
services: active-directory
author: twimmers
writer: twimmers
manager: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 11/21/2022
ms.author: jeedes
---

# Tutorial: Configure Zscaler Three for automatic user provisioning

In this tutorial, you'll learn how to configure Microsoft Entra ID to automatically provision and deprovision users and/or groups to Zscaler Three.

> [!NOTE]
> This tutorial describes a connector that's built on the Microsoft Entra user provisioning service. For important details on what this service does and how it works, and answers to frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Microsoft Entra ID](../app-provisioning/user-provisioning.md).

## Prerequisites

To complete the steps outlined in this tutorial, you need the following:

* A Microsoft Entra tenant.
* A Zscaler Three tenant.
* A user account in Zscaler Three with admin permissions.

> [!NOTE]
> The Microsoft Entra provisioning integration relies on the Zscaler ZSCloud SCIM API, which is available for Enterprise accounts.

## Adding Zscaler Three from the gallery

Before you configure Zscaler Three for automatic user provisioning with Microsoft Entra ID, you need to add Zscaler Three from the Microsoft Entra application gallery to your list of managed SaaS applications.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Zscaler Three**. 
1. Select **Zscaler Three** in the results and then select **Add**.

![Results list](common/search-new-app.png)

## Assign users to Zscaler Three

Microsoft Entra users need to be assigned access to selected apps before they can use them. In the context of automatic user provisioning, only the users or groups that are assigned to an application in Microsoft Entra ID are synchronized.

Before you configure and enable automatic user provisioning, you should decide which users and/or groups in Microsoft Entra ID need access to Zscaler Three. After you decide that, you can assign these users and groups to Zscaler Three by following the instructions in [Assign a user or group to an enterprise app](../manage-apps/assign-user-or-group-access-portal.md).

### Important tips for assigning users to Zscaler Three

* We recommended that you first assign a single Microsoft Entra user to Zscaler Three to test the automatic user provisioning configuration. You can assign more users and groups later.

* When you assign a user to Zscaler Three, you need to select any valid application-specific role (if available) in the assignment dialog box. Users with the **Default Access** role are excluded from provisioning.

## Set up automatic user provisioning

This section guides you through the steps for configuring the Microsoft Entra provisioning service to create, update, and disable users and groups in Zscaler Three based on user and group assignments in Microsoft Entra ID.

> [!TIP]
> You might also want to enable SAML-based single sign-on for Zscaler Three. If you do, follow the instructions in the [Zscaler Three single sign-on tutorial](zscaler-three-tutorial.md). Single sign-on can be configured independently of automatic user provisioning, but the two features complement each other.

> [!NOTE]
> When users and groups are provisioned or de-provisioned we recommend to periodically restart provisioning to ensure that group memberships are properly updated. Doing a restart will force our service to re-evaluate all the groups and update the memberships. 

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Zscaler Three**.

	![Enterprise applications](common/enterprise-applications.png)

1. In the applications list, select **Zscaler Three**:

	![Applications list](common/all-applications.png)

1. Select the **Provisioning** tab:

	![Zscaler Three Provisioning](./media/zscaler-three-provisioning-tutorial/provisioning-tab.png)

1. Set the **Provisioning Mode** to **Automatic**:

	![Set the Provisioning Mode](./media/zscaler-three-provisioning-tutorial/provisioning-credentials.png)

1. In the **Admin Credentials** section, enter the **Tenant URL** and **Secret Token** of your Zscaler Three account, as described in the next step.

1. To get the **Tenant URL** and **Secret Token**, go to **Administration** > **Authentication Settings** in the Zscaler Three portal and select **SAML** under **Authentication Type**:

	![Zscaler Three Authentication Settings](./media/zscaler-three-provisioning-tutorial/secret-token-1.png)

	Select **Configure SAML** to open the **Configure SAML** window:

	![Configure SAML window](./media/zscaler-three-provisioning-tutorial/secret-token-2.png)

	Select **Enable SCIM-Based Provisioning** and copy the **Base URL** and **Bearer Token**, and then save the settings. In the Azure portal, paste the **Base URL** into the **Tenant URL** box and the **Bearer Token** into the **Secret Token** box.

1. After you enter the values in the **Tenant URL** and **Secret Token** boxes, select **Test Connection** to make sure Microsoft Entra ID can connect to Zscaler Three. If the connection fails, make sure your Zscaler Three account has admin permissions and try again.

	![Test the connection](./media/zscaler-three-provisioning-tutorial/test-connection.png)

1. In the **Notification Email** box, enter the email address of a person or group that should receive the provisioning error notifications. Select **Send an email notification when a failure occurs**:

	![Set up notification email](./media/zscaler-three-provisioning-tutorial/notification.png)

1. Select **Save**.

1. In the **Mappings** section, select **Synchronize Microsoft Entra users to ZscalerThree**:

	![Synchronize Microsoft Entra users](./media/zscaler-three-provisioning-tutorial/user-mappings.png)

1. Review the user attributes that are synchronized from Microsoft Entra ID to Zscaler Three in the **Attribute Mappings** section. The attributes selected as **Matching** properties are used to match the user accounts in Zscaler Three for update operations. Select **Save** to commit any changes.

	![Screenshot of the Attribute Mappings section with seven mappings displayed.](./media/zscaler-three-provisioning-tutorial/user-attribute-mappings.png)

1. In the **Mappings** section, select **Synchronize Microsoft Entra groups to ZscalerThree**:

	![Synchronize Microsoft Entra groups](./media/zscaler-three-provisioning-tutorial/group-mappings.png)

1. Review the group attributes that are synchronized from Microsoft Entra ID to Zscaler Three in the **Attribute Mappings** section. The attributes selected as **Matching** properties are used to match the groups in Zscaler Three for update operations. Select **Save** to commit any changes.

	![Screenshot of the Attribute Mappings section with three mappings displayed.](./media/zscaler-three-provisioning-tutorial/group-attribute-mappings.png)

1. To configure scoping filters, refer to the instructions in the [Scoping filter tutorial](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

1. To enable the Microsoft Entra provisioning service for Zscaler Three, change the **Provisioning Status** to **On** in the **Settings** section:

	![Provisioning Status](./media/zscaler-three-provisioning-tutorial/provisioning-status.png)

1. Define the users and/or groups that you want to provision to Zscaler Three by choosing the values you want under **Scope** in the **Settings** section:

	![Scope values](./media/zscaler-three-provisioning-tutorial/scoping.png)

1. When you're ready to provision, select **Save**:

	![Select Save](./media/zscaler-three-provisioning-tutorial/save-provisioning.png)

This operation starts the initial synchronization of all users and groups defined under **Scope** in the **Settings** section. The initial sync takes longer than subsequent syncs, which occur about every 40 minutes, as long as the Microsoft Entra provisioning service is running. You can monitor progress in the **Synchronization Details** section. You can also follow links to a provisioning activity report, which describes all actions performed by the Microsoft Entra provisioning service on Zscaler Three.

For information on how to read the Microsoft Entra provisioning logs, see [Reporting on automatic user account provisioning](../app-provisioning/check-status-user-account-provisioning.md).

## Additional resources

* [Managing user account provisioning for enterprise apps](../app-provisioning/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md)

<!--Image references-->
[1]: ./media/zscaler-three-provisioning-tutorial/tutorial-general-01.png
[2]: ./media/zscaler-three-provisioning-tutorial/tutorial-general-02.png
[3]: ./media/zscaler-three-provisioning-tutorial/tutorial-general-03.png
