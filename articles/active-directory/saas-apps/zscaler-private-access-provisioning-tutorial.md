---
title: 'Tutorial: Configure Zscaler Private Access (ZPA) for automatic user provisioning with Microsoft Entra ID'
description: Learn how to configure Microsoft Entra ID to automatically provision and de-provision user accounts to Zscaler Private Access (ZPA).
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

# Tutorial: Configure Zscaler Private Access (ZPA) for automatic user provisioning

The objective of this tutorial is to demonstrate the steps to be performed in Zscaler Private Access (ZPA) and Microsoft Entra ID to configure Microsoft Entra ID to automatically provision and de-provision users and/or groups to Zscaler Private Access (ZPA).

> [!NOTE]
> This tutorial describes a connector built on top of the Microsoft Entra user Provisioning Service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Microsoft Entra ID](../app-provisioning/user-provisioning.md).
>

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* A Microsoft Entra tenant
* [A Zscaler Private Access (ZPA) tenant](https://www.zscaler.com/pricing-and-plans#contact-us)
* A user account in Zscaler Private Access (ZPA) with Admin permissions.

## Assigning users to Zscaler Private Access (ZPA)

Microsoft Entra ID uses a concept called *assignments* to determine which users should receive access to selected apps. In the context of automatic user provisioning, only the users and/or groups that have been assigned to an application in Microsoft Entra ID are synchronized.

Before configuring and enabling automatic user provisioning, you should decide which users and/or groups in Microsoft Entra ID need access to Zscaler Private Access (ZPA). Once decided, you can assign these users and/or groups to Zscaler Private Access (ZPA) by following the instructions here:
* [Assign a user or group to an enterprise app](../manage-apps/assign-user-or-group-access-portal.md)

## Important tips for assigning users to Zscaler Private Access (ZPA)

* It is recommended that a single Microsoft Entra user is assigned to Zscaler Private Access (ZPA) to test the automatic user provisioning configuration. Additional users and/or groups may be assigned later.

* When assigning a user to Zscaler Private Access (ZPA), you must select any valid application-specific role (if available) in the assignment dialog. Users with the **Default Access** role are excluded from provisioning.

## Set up Zscaler Private Access (ZPA) for provisioning

1. Sign in to your [Zscaler Private Access (ZPA) Admin Console](https://admin.private.zscaler.com/). Navigate to **Administration > IdP Configuration**.

	![Zscaler Private Access (ZPA) Admin Console](media/zscaler-private-access-provisioning-tutorial/idpconfig.png)

2.	Verify to make sure that an IdP for **Single sign-on** is configured. If no IdP is setup, then add one by clicking the plus icon at the top right corner of the screen.

	![Zscaler Private Access (ZPA) Add SCIM](media/zscaler-private-access-provisioning-tutorial/plusicon.png)

3. Follow through the **Add IdP Configuration** wizard to add an IdP. Leave the **Single sign-on** field set to **User**. Provide a **Name** and select the **Domains** from the drop down list. Click on **Next** to navigate to the next window.

	![Zscaler Private Access (ZPA) Add IdP](media/zscaler-private-access-provisioning-tutorial/addidp.png)

4. Download the **Service Provider Certificate**. Click on **Next** to navigate to the next window.

	![Zscaler Private Access (ZPA) SP certificate](media/zscaler-private-access-provisioning-tutorial/spcertificate.png)

5. In the next window, upload the **Service Provider Certificate** downloaded previously.

	![Zscaler Private Access (ZPA) upload certificate](media/zscaler-private-access-provisioning-tutorial/uploadfile.png)

6.	Scroll down to provide the **Single sign-On URL** and **IdP Entity ID**.

	![Zscaler Private Access (ZPA) IdP ID](media/zscaler-private-access-provisioning-tutorial/idpid.png)

7.	Scroll down to **Enable SCIM Sync**. Click on **Generate New Token** button. Copy the **Bearer Token**. This value will be entered in the Secret Token field in the Provisioning tab of your Zscaler Private Access (ZPA) application.

	![Zscaler Private Access (ZPA) Create Token](media/zscaler-private-access-provisioning-tutorial/token.png)

8.	To locate the **Tenant URL**, navigate to **Administration > IdP Configuration**. Click on the name of the newly added IdP configuration listed on the page.

	![Zscaler Private Access (ZPA) Idp Name](media/zscaler-private-access-provisioning-tutorial/idpname.png)

9.	Scroll down to view the **SCIM Service Provider Endpoint** at the end of the page. Copy the **SCIM Service Provider Endpoint**. This value will be entered in the Tenant URL field in the Provisioning tab of your Zscaler Private Access (ZPA) application.

	![Zscaler Private Access (ZPA) SCIM URL](media/zscaler-private-access-provisioning-tutorial/tenanturl.png)


## Add Zscaler Private Access (ZPA) from the gallery

Before configuring Zscaler Private Access (ZPA) for automatic user provisioning with Microsoft Entra ID, you need to add Zscaler Private Access (ZPA) from the Microsoft Entra application gallery to your list of managed SaaS applications.

**To add Zscaler Private Access (ZPA) from the Microsoft Entra application gallery, perform the following steps:**

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the **Add from the gallery** section, type **Zscaler Private Access (ZPA)**, select **Zscaler Private Access (ZPA)** in the search box.
1. Select **Zscaler Private Access (ZPA)** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.
	![Zscaler Private Access (ZPA) in the results list](common/search-new-app.png)

## Configuring automatic user provisioning to Zscaler Private Access (ZPA) 

This section guides you through the steps to configure the Microsoft Entra provisioning service to create, update, and disable users and/or groups in Zscaler Private Access (ZPA) based on user and/or group assignments in Microsoft Entra ID.

> [!TIP]
> You may also choose to enable SAML-based single sign-on for Zscaler Private Access (ZPA) by following the instructions provided in the [Zscaler Private Access (ZPA) Single sign-on tutorial](./zscalerprivateaccess-tutorial.md). Single sign-on can be configured independently of automatic user provisioning, although these two features complement each other.

> [!NOTE]
> When users and groups are provisioned or de-provisioned we recommend to periodically restart provisioning to ensure that group memberships are properly updated. Doing a restart will force our service to re-evaluate all the groups and update the memberships.  

> [!NOTE]
> To learn more about Zscaler Private Access's SCIM endpoint, refer [this](https://www.zscaler.com/partners/microsoft).

<a name='to-configure-automatic-user-provisioning-for-zscaler-private-access-zpa-in-azure-ad'></a>

### To configure automatic user provisioning for Zscaler Private Access (ZPA) in Microsoft Entra ID:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Zscaler Private Access (ZPA)**.

	![The Zscaler Private Access (ZPA) link in the Applications list](common/all-applications.png)

1. Select the **Provisioning** tab.

	![Screenshot of the Manage options with the Provisioning option called out.](common/provisioning.png)

1. Set the **Provisioning Mode** to **Automatic**.

	![Screenshot of the Provisioning Mode dropdown list with the Automatic option called out.](common/provisioning-automatic.png)

1. Under the **Admin Credentials** section, input the **SCIM Service Provider Endpoint** value retrieved earlier in **Tenant URL**. Input the **Bearer Token** value retrieved earlier in **Secret Token**. Click **Test Connection** to ensure Microsoft Entra ID can connect to Zscaler Private Access (ZPA). If the connection fails, ensure your Zscaler Private Access (ZPA) account has Admin permissions and try again.

	![Tenant URL + Token](common/provisioning-testconnection-tenanturltoken.png)

1. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and check the checkbox - **Send an email notification when a failure occurs**.

	![Notification Email](common/provisioning-notification-email.png)

1. Click **Save**.

1. Under the **Mappings** section, select **Synchronize Microsoft Entra users to Zscaler Private Access (ZPA)**.

	![Zscaler Private Access (ZPA) User Mappings](media/zscaler-private-access-provisioning-tutorial/usermappings.png)

1. Review the user attributes that are synchronized from Microsoft Entra ID to Zscaler Private Access (ZPA) in the **Attribute Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in Zscaler Private Access (ZPA) for update operations. Select the **Save** button to commit any changes.

	![Zscaler Private Access (ZPA) User Attributes](media/zscaler-private-access-provisioning-tutorial/userattributes.png)

1. Under the **Mappings** section, select **Synchronize Microsoft Entra groups to Zscaler Private Access (ZPA)**.

	![Zscaler Private Access (ZPA) Group Mappings](media/zscaler-private-access-provisioning-tutorial/groupmappings.png)

1. Review the group attributes that are synchronized from Microsoft Entra ID to Zscaler Private Access (ZPA) in the **Attribute Mapping** section. The attributes selected as **Matching** properties are used to match the groups in Zscaler Private Access (ZPA) for update operations. Select the **Save** button to commit any changes.

	![Zscaler Private Access (ZPA) Group Attributes](media/zscaler-private-access-provisioning-tutorial/groupattributes.png)

1. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

1. To enable the Microsoft Entra provisioning service for Zscaler Private Access (ZPA), change the **Provisioning Status** to **On** in the **Settings** section.

	![Provisioning Status Toggled On](common/provisioning-toggle-on.png)

1. Define the users and/or groups that you would like to provision to Zscaler Private Access (ZPA) by choosing the desired values in **Scope** in the **Settings** section.

	![Provisioning Scope](common/provisioning-scope.png)

1. When you are ready to provision, click **Save**.

	![Saving Provisioning Configuration](common/provisioning-configuration-save.png)

This operation starts the initial synchronization of all users and/or groups defined in **Scope** in the **Settings** section. The initial sync takes longer to perform than subsequent syncs, which occur approximately every 40 minutes as long as the Microsoft Entra provisioning service is running. You can use the **Synchronization Details** section to monitor progress and follow links to provisioning activity report, which describes all actions performed by the Microsoft Entra provisioning service on Zscaler Private Access (ZPA).

For more information on how to read the Microsoft Entra provisioning logs, see [Reporting on automatic user account provisioning](../app-provisioning/check-status-user-account-provisioning.md).

## Additional resources

* [Managing user account provisioning for Enterprise Apps](../app-provisioning/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md)
