---
title: 'Tutorial: Configure Symantec Web Security Service (WSS) for automatic user provisioning with Azure Active Directory | Microsoft Docs'
description: Learn how to configure Azure Active Directory to automatically provision and de-provision user accounts to Symantec Web Security Service (WSS).
services: active-directory
documentationcenter: ''
author: zchia
writer: zchia
manager: beatrizd

ms.assetid: fb48deae-4653-448a-ba2f-90258edab3a7
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/23/2019
ms.author: Zhchia
---

# Tutorial: Configure Symantec Web Security Service (WSS) for automatic user provisioning

The objective of this tutorial is to demonstrate the steps to be performed in Symantec Web Security Service (WSS) and Azure Active Directory (Azure AD) to configure Azure AD to automatically provision and de-provision users and/or groups to Symantec Web Security Service (WSS).

> [!NOTE]
> This tutorial describes a connector built on top of the Azure AD User Provisioning Service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Azure Active Directory](../app-provisioning/user-provisioning.md).
>
> This connector is currently in Public Preview. For more information on the general Microsoft Azure terms of use for Preview features, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* An Azure AD tenant
* [A Symantec Web Security Service (WSS) tenant](https://www.websecurity.symantec.com/buy-renew?inid=brmenu_nav_brhome)
* A user account in Symantec Web Security Service (WSS) with Admin permissions.

## Assigning users to Symantec Web Security Service (WSS)

Azure Active Directory uses a concept called *assignments* to determine which users should receive access to selected apps. In the context of automatic user provisioning, only the users and/or groups that have been assigned to an application in Azure AD are synchronized.

Before configuring and enabling automatic user provisioning, you should decide which users and/or groups in Azure AD need access to Symantec Web Security Service (WSS). Once decided, you can assign these users and/or groups to Symantec Web Security Service (WSS) by following the instructions here:
* [Assign a user or group to an enterprise app](../manage-apps/assign-user-or-group-access-portal.md)

##  Important tips for assigning users to Symantec Web Security Service (WSS)

* It is recommended that a single Azure AD user is assigned to Symantec Web Security Service (WSS) to test the automatic user provisioning configuration. Additional users and/or groups may be assigned later.

* When assigning a user to Symantec Web Security Service (WSS), you must select any valid application-specific role (if available) in the assignment dialog. Users with the **Default Access** role are excluded from provisioning.

## Setup Symantec Web Security Service (WSS) for provisioning

Before configuring Symantec Web Security Service (WSS) for automatic user provisioning with Azure AD, you will need to enable SCIM provisioning on Symantec Web Security Service (WSS).

1. Sign in to your [Symantec Web Security Service admin console](https://portal.threatpulse.com/login.jsp). Navigate to **Solutions** > **Service**.

	![Symantec Web Security Service(WSS)](media/symantec-web-security-service/service.png)

2. Navigate to **Account Maintenance** > **Integrations** > **New Integration**.

	![Symantec Web Security Service (WSS)](media/symantec-web-security-service/acount.png)

3.  Select **Third-Party Users & Groups Sync**. 

	![Symantec Web Security Service](media/symantec-web-security-service/third-party-users.png)

4.  Copy the **SCIM URL** and **Token**. These values will be entered in the **Tenant URL** and **Secret Token** field in the Provisioning tab of your Symantec Web Security Service (WSS)  		application in the Azure portal.

	![Symantec Web Security Service](media/symantec-web-security-service/scim.png)

## Add Symantec Web Security Service (WSS) from the gallery

To configure Symantec Web Security Service (WSS) for automatic user provisioning with Azure AD, you need to add Symantec Web Security Service (WSS) from the Azure AD application gallery to your list of managed SaaS applications.

**To add Symantec Web Security Service (WSS) from the Azure AD application gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, in the left navigation panel, select **Azure Active Directory**.

	![The Azure Active Directory button](common/select-azuread.png)

2. Go to **Enterprise applications**, and then select **All applications**.

	![The Enterprise applications blade](common/enterprise-applications.png)

3. To add a new application, select the **New application** button at the top of the pane.

	![The New application button](common/add-new-app.png)

4. In the search box, enter **Symantec Web Security Service**, select **Symantec Web Security Service** in the results panel, and then click the **Add** button to add the application.

	![Symantec Web Security Service (WSS) in the results list](common/search-new-app.png)

## Configuring automatic user provisioning to Symantec Web Security Service (WSS)

This section guides you through the steps to configure the Azure AD provisioning service to create, update, and disable users and/or groups in Symantec Web Security Service (WSS) based on user and/or group assignments in Azure AD.

> [!TIP]
> You may also choose to enable SAML-based single sign-on for Symantec Web Security Service (WSS), following the instructions provided in the [Symantec Web Security Service (WSS) Single sign-on tutorial](symantec-tutorial.md). Single sign-on can be configured independently of automatic user provisioning, though these two features complement each other.

### To configure automatic user provisioning for Symantec Web Security Service (WSS) in Azure AD:

1. Sign in to the [Azure portal](https://portal.azure.com). Select **Enterprise Applications**, then select **All applications**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **Symantec Web Security Service**.

	![The Symantec Web Security Service (WSS) link in the Applications list](common/all-applications.png)

3. Select the **Provisioning** tab.

	![Provisioning tab](common/provisioning.png)

4. Set the **Provisioning Mode** to **Automatic**.

	![Provisioning tab](common/provisioning-automatic.png)

5. Under the Admin Credentials section, input the **SCIM URL** and **Token** values retrieved earlier in **Tenant URL** and **Secret Token** respectively. Click **Test Connection** to ensure Azure AD can connect to Symantec Web Security Service. If the connection fails, ensure your Symantec Web Security Service (WSS) account has Admin permissions and try again.

	![Tenant URL + Token](common/provisioning-testconnection-tenanturltoken.png)

6. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and check the checkbox - **Send an email notification when a failure occurs**.

	![Notification Email](common/provisioning-notification-email.png)

7. Click **Save**.

8. Under the **Mappings** section, select **Synchronize Azure Active Directory Users to Symantec Web Security Service (WSS)**.

	![Symantec Web Security Service (WSS) User Mappings](media/symantec-web-security-service/usermapping.png)

9. Review the user attributes that are synchronized from Azure AD to Symantec Web Security Service (WSS) in the **Attribute Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in Symantec Web Security Service (WSS) for update operations. Select the **Save** button to commit any changes.

	![Symantec Web Security Service (WSS) User Mappings](media/symantec-web-security-service/userattribute.png)

10. Under the **Mappings** section, select **Synchronize Azure Active Directory Groups to Symantec Web Security Service**.

	![Symantec Web Security Service (WSS) User Mappings](media/symantec-web-security-service/groupmapping.png)

11. Review the group attributes that are synchronized from Azure AD to Symantec Web Security Service (WSS) in the **Attribute Mapping** section. The attributes selected as **Matching** properties are used to match the groups in Symantec Web Security Service (WSS) for update operations. Select the **Save** button to commit any changes.

	![Symantec Web Security Service (WSS) User Mappings](media/symantec-web-security-service/groupattribute.png)

12. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

13. To enable the Azure AD provisioning service for Symantec Web Security Service, change the **Provisioning Status** to **On** in the **Settings** section.

	![Provisioning Status Toggled On](common/provisioning-toggle-on.png)

14. Define the users and/or groups that you would like to provision to Symantec Web Security Service (WSS) by choosing the desired values in **Scope** in the **Settings** section.

	![Provisioning Scope](common/provisioning-scope.png)

15. When you are ready to provision, click **Save**.

	![Saving Provisioning Configuration](common/provisioning-configuration-save.png)

This operation starts the initial synchronization of all users and/or groups defined in **Scope** in the **Settings** section. The initial sync takes longer to perform than subsequent syncs. For more information on how long it will take for users and/or groups to provision, see [How long will it take to provision users](../app-provisioning/application-provisioning-when-will-provisioning-finish-specific-user.md#how-long-will-it-take-to-provision-users).

You can use the **Current Status** section to monitor progress and follow links to your provisioning activity report, which describes all actions performed by the Azure AD provisioning service on Symantec Web Security Service (WSS). For more information, see [Check the status of user provisioning](../app-provisioning/application-provisioning-when-will-provisioning-finish-specific-user.md). To read the Azure AD provisioning logs, see [Reporting on automatic user account provisioning](../app-provisioning/check-status-user-account-provisioning.md).

## Additional resources

* [Managing user account provisioning for Enterprise Apps](../app-provisioning/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md)
