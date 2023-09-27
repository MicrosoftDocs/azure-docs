---
title: 'Tutorial: Configure Bonusly for automatic user provisioning with Microsoft Entra ID'
description: Learn how to configure Microsoft Entra ID to automatically provision and de-provision user accounts to Bonusly.
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

# Tutorial: Configure Bonusly for automatic user provisioning

The objective of this tutorial is to demonstrate the steps to be performed in Bonusly and Microsoft Entra ID to configure Microsoft Entra ID to automatically provision and de-provision users and/or groups to Bonusly.

> [!NOTE]
> This tutorial describes a connector built on top of the Microsoft Entra user Provisioning Service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Microsoft Entra ID](../app-provisioning/user-provisioning.md).

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following:

* A Microsoft Entra tenant
* A [Bonusly tenant](https://bonus.ly/pricing)
* A user account in Bonusly with Admin permissions

> [!NOTE]
> The Microsoft Entra provisioning integration relies on the [Bonusly REST API](https://konghq.com/solutions/gateway/), which is available to Bonusly developers.

## Adding Bonusly from the gallery

Before configuring Bonusly for automatic user provisioning with Microsoft Entra ID, you need to add Bonusly from the Microsoft Entra application gallery to your list of managed SaaS applications.

**To add Bonusly from the Microsoft Entra application gallery, perform the following steps:**

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the search box, type **Bonusly**, select **Bonusly** from result panel then click **Add** button to add the application.

	![Bonusly in the results list](common/search-new-app.png)

## Assigning users to Bonusly

Microsoft Entra ID uses a concept called "assignments" to determine which users should receive access to selected apps. In the context of automatic user provisioning, only the users and/or groups that have been "assigned" to an application in Microsoft Entra ID are synchronized. 

Before configuring and enabling automatic user provisioning, you should decide which users and/or groups in Microsoft Entra ID need access to Bonusly. Once decided, you can assign these users and/or groups to Bonusly by following the instructions here:

* [Assign a user or group to an enterprise app](../manage-apps/assign-user-or-group-access-portal.md)

### Important tips for assigning users to Bonusly

* It is recommended that a single Microsoft Entra user is assigned to Bonusly to test the automatic user provisioning configuration. Additional users and/or groups may be assigned later.

* When assigning a user to Bonusly, you must select any valid application-specific role (if available) in the assignment dialog. Users with the **Default Access** role are excluded from provisioning.

## Configuring automatic user provisioning to Bonusly

This section guides you through the steps to configure the Microsoft Entra provisioning service to create, update, and disable users and/or groups in Bonusly based on user and/or group assignments in Microsoft Entra ID.

> [!TIP]
> You may also choose to enable SAML-based single sign-on for Bonusly, following the instructions provided in the [Bonusly single sign-on tutorial](bonus-tutorial.md). Single sign-on can be configured independently of automatic user provisioning, though these two features compliment each other.

<a name='to-configure-automatic-user-provisioning-for-bonusly-in-azure-ad'></a>

### To configure automatic user provisioning for Bonusly in Microsoft Entra ID:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Bonusly**.

	![Enterprise applications blade](common/enterprise-applications.png)

1. In the applications list, select **Bonusly**.

	![The Bonusly link in the Applications list](common/all-applications.png)

3. Select the **Provisioning** tab.

	:::image type="content" source="./media/bonusly-provisioning-tutorial/ProvisioningTab.png" alt-text="Screenshot of the Bonusly - Provisioning tab. Under Manage, Provisioning is highlighted." border="false":::

4. Set the **Provisioning Mode** to **Automatic**.

	:::image type="content" source="./media/bonusly-provisioning-tutorial/ProvisioningCredentials.png" alt-text="Screenshot showing a Provisioning Mode list box, with Automatic selected and highlighted." border="false":::

5. Under the **Admin Credentials** section, input the **Secret Token** of your Bonusly account as described in Step 6.

	:::image type="content" source="./media/bonusly-provisioning-tutorial/secrettoken.png" alt-text="Screenshot of the Admin credentials section. The Secret token box is empty, but the box is highlighted." border="false":::

6. The **Secret Token** for your Bonusly account is located in **Admin > Company > Integrations**. In the **If you want to code** section, click on **API > Create New API Access Token** to create a new Secret Token.

	:::image type="content" source="./media/bonusly-provisioning-tutorial/BonuslyIntegrations.png" alt-text="Screenshot of the Bonusly menu. Under Admin, Company is highlighted. Under Company, Integrations is highlighted." border="false":::

	:::image type="content" source="./media/bonusly-provisioning-tutorial/BonsulyRestApi.png" alt-text="Screenshot of the If you want to code section of the Bonusly site, with A P I highlighted." border="false":::

	:::image type="content" source="./media/bonusly-provisioning-tutorial/CreateToken.png" alt-text="Screenshot of the Bonusly site. The Services tab is open. Under Your A P I access tokens, Create new A P I access token is highlighted." border="false":::

7. On the following screen, type a name for the access token in the provided text box, then press **Create Api Key**. The new access token will appear for a few seconds in a pop-up.

	:::image type="content" source="./media/bonusly-provisioning-tutorial/Token01.png" alt-text="Screenshot of the New access token page of the Bonusly site. An unlabeled box contains My Token, and the Create A P I key button is highlighted." border="false":::

	:::image type="content" source="./media/bonusly-provisioning-tutorial/Token02.png" alt-text="Screenshot of the Bonusly site. A notification is visible that displays New access token created, followed by an indecipherable token." border="false":::

8. Upon populating the fields shown in Step 5, click **Test Connection** to ensure Microsoft Entra ID can connect to Bonusly. If the connection fails, ensure your Bonusly account has Admin permissions and try again.

	:::image type="content" source="./media/bonusly-provisioning-tutorial/TestConnection.png" alt-text="Screenshot of the Admin Credentials section. The Text connection button is highlighted." border="false":::

9. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and check the checkbox **Send an email notification when a failure occurs**.

	:::image type="content" source="./media/bonusly-provisioning-tutorial/EmailNotification.png" alt-text="Screenshot showing an empty Notification email box. An option is visible that is labeled Send an email notification when a failure occurs." border="false":::

10. Click **Save**.

11. Under the **Mappings** section, select **Synchronize Microsoft Entra users to Bonusly**.

	:::image type="content" source="./media/bonusly-provisioning-tutorial/UserMappings.png" alt-text="Screenshot of the Mappings section. Under Name, Synchronize Microsoft Entra users to Bonusly is highlighted." border="false":::

12. Review the user attributes that are synchronized from Microsoft Entra ID to Bonusly in the **Attribute Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in Bonusly for update operations. Select the **Save** button to commit any changes.

	:::image type="content" source="./media/bonusly-provisioning-tutorial/UserAttributeMapping.png" alt-text="Screenshot of the Attribute Mappings page. A table lists Microsoft Entra attributes, corresponding Bonusly attributes, and the matching status." border="false":::

13. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

14. To enable the Microsoft Entra provisioning service for Bonusly, change the **Provisioning Status** to **On** in the **Settings** section.

	:::image type="content" source="./media/bonusly-provisioning-tutorial/ProvisioningStatus.png" alt-text="Screenshot of the Settings section. The Provisioning status toggle is set to Off." border="false":::

15. Define the users and/or groups that you would like to provision to Bonusly by choosing the desired values in **Scope** in the **Settings** section.

	:::image type="content" source="./media/bonusly-provisioning-tutorial/ScopeSync.png" alt-text="Screenshot showing the Scope list box. Sync only assigned users and groups is selected in the box." border="false":::

16. When you are ready to provision, click **Save**.

	:::image type="content" source="./media/bonusly-provisioning-tutorial/SaveProvisioning.png" alt-text="Screenshot of the Bonusly - Provisioning page, with the Save button highlighted." border="false":::

This operation starts the initial synchronization of all users and/or groups defined in **Scope** in the **Settings** section. The initial sync takes longer to perform than subsequent syncs, which occur approximately every 40 minutes as long as the Microsoft Entra provisioning service is running. You can use the **Synchronization Details** section to monitor progress and follow links to provisioning activity report, which describes all actions performed by the Microsoft Entra provisioning service on Bonusly.

For more information on how to read the Microsoft Entra provisioning logs, see [Reporting on automatic user account provisioning](../app-provisioning/check-status-user-account-provisioning.md).

## Additional resources

* [Managing user account provisioning for Enterprise Apps](../app-provisioning/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md)

<!--Image references-->
[1]: ./media/bonusly-provisioning-tutorial/tutorial_general_01.png
[2]: ./media/bonusly-provisioning-tutorial/tutorial_general_02.png
[3]: ./media/bonusly-provisioning-tutorial/tutorial_general_03.png
