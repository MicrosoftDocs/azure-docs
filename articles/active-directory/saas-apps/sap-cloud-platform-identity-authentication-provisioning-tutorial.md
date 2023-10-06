---
title: 'Tutorial: Configure SAP Cloud Identity Services for automatic user provisioning with Microsoft Entra ID'
description: Learn how to configure Microsoft Entra ID to automatically provision and deprovision user accounts to SAP Cloud Identity Services.
services: active-directory
author: twimmers
writer: twimmers
manager: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 05/23/2023
ms.author: thwimmer
---

# Tutorial: Configure SAP Cloud Identity Services for automatic user provisioning

This tutorial aims to demonstrate the steps for configuring Microsoft Entra ID and SAP Cloud Identity Services. The goal is to set up Microsoft Entra ID to automatically provision and deprovision users to SAP Cloud Identity Services.

> [!NOTE]
> This tutorial describes a connector built on top of the Microsoft Entra user Provisioning Service. For important details on what this service does, how it works, and frequently asked questions, see [Automate user provisioning and deprovisioning to SaaS applications with Microsoft Entra ID](../app-provisioning/user-provisioning.md).
>

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following prerequisites:

* A Microsoft Entra tenant
* [A Cloud Identity Services tenant](https://www.sap.com/products/cloud-platform.html)
* A user account in SAP Cloud Identity Services with Admin permissions.

> [!NOTE]
> This integration is also available to use from Microsoft Entra US Government Cloud environment. You can find this application in the Microsoft Entra US Government Cloud Application Gallery and configure it in the same way as you do from public cloud.

## Assigning users to SAP Cloud Identity Services

Microsoft Entra ID uses a concept called *assignments* to determine which users should receive access to selected apps. In the context of automatic user provisioning, only the users that have been assigned to an application in Microsoft Entra ID are synchronized.

Before configuring and enabling automatic user provisioning, you should decide which users in Microsoft Entra ID need access to SAP Cloud Identity Services. Once decided, you can assign these users to SAP Cloud Identity Services by following the instructions here:
* [Assign a user to an enterprise app](../manage-apps/assign-user-or-group-access-portal.md)

## Important tips for assigning users to SAP Cloud Identity Services

* It's recommended that a single Microsoft Entra user is assigned to SAP Cloud Identity Services to test the automatic user provisioning configuration. More users may be assigned later.

* When assigning a user to SAP Cloud Identity Services, you must select any valid application-specific role (if available) in the assignment dialog. Users with the **Default Access** role are excluded from provisioning.

## Set up SAP Cloud Identity Services for provisioning

1. Sign in to your [SAP Cloud Identity Services Admin Console](https://sapmsftintegration.accounts.ondemand.com/admin). Navigate to **Users & Authorizations > Administrators**.

	![Screenshot of the SAP Cloud Identity Services Admin Console.](media/sap-cloud-platform-identity-authentication-provisioning-tutorial/adminconsole.png)

1. Press the **+Add** button on the left hand panel in order to add a new administrator to the list. Choose **Add System** and enter the name of the system.   

	> [!NOTE]
	> The administrator user in SAP Cloud Identity Services must be of type **System**. Creating a normal administrator user can lead to *unauthorized* errors while provisioning.   

1. Under Configure Authorizations, switch on the toggle button against **Manage Users**.

	![Screenshot of the SAP Cloud Identity Services Add SCIM.](media/sap-cloud-platform-identity-authentication-provisioning-tutorial/configurationauth.png)

1.  You'll get an email to activate your account and set up a password for the **SAP Cloud Identity Services Service**.

1. Copy the **User ID** and **Password**. These values are entered in the Admin Username and Admin Password fields respectively.
This is done in the Provisioning tab of your SAP Cloud Identity Services application.

## Add SAP Cloud Identity Services from the gallery

Before configuring SAP Cloud Identity Services for automatic user provisioning with Microsoft Entra ID, you need to add SAP Cloud Identity Services from the Microsoft Entra application gallery to your list of managed SaaS applications.

**To add SAP Cloud Identity Services from the Microsoft Entra application gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, in the left navigation panel, select **Microsoft Entra ID**.

	![Screenshot of the Microsoft Entra button.](common/select-azuread.png)

1. Go to **Enterprise applications**, and then select **All applications**.

	![Screenshot of the Enterprise applications blade.](common/enterprise-applications.png)

1. To add a new application, select the **New application** button at the top of the pane.

	![Screenshot of the New application button.](common/add-new-app.png)

1. In the search box, enter **SAP Cloud Identity Services**, select **SAP Cloud Identity Services** in the search box.
1. Select **SAP Cloud Identity Services** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.
	![Screenshot of the SAP Cloud Identity Services in the results list.](common/search-new-app.png)

## Configuring automatic user provisioning to SAP Cloud Identity Services 

This section guides you through the steps to configure the Microsoft Entra provisioning service to create, update, and disable users in SAP Cloud Identity Services based on users assignments in Microsoft Entra ID.

> [!TIP]
> You may also choose to enable SAML-based single sign-on for SAP Cloud Identity Services, following the instructions provided in the [SAP Cloud Identity Services Single sign-on tutorial](./sap-hana-cloud-platform-identity-authentication-tutorial.md). Single sign-on can be configured independently of automatic user provisioning, though these two features complement each other

### To configure automatic user provisioning for SAP Cloud Identity Services in Microsoft Entra ID:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications**

	![Screenshot of Enterprise applications blade.](common/enterprise-applications.png)

1. In the applications list, select **SAP Cloud Identity Services**.

	![Screenshot of the SAP Cloud Identity Services link in the Applications list.](common/all-applications.png)

1. Select the **Provisioning** tab.

	![Screenshot of the Manage options with the Provisioning option called out.](common/provisioning.png)

1. Set the **Provisioning Mode** to **Automatic**.

	![Screenshot of the Provisioning Mode dropdown list with the Automatic option called out.](common/provisioning-automatic.png)

1. Under the **Admin Credentials** section, input `https://<tenantID>.accounts.ondemand.com/service/scim ` in **Tenant URL**. Input the **User ID** and **Password** values retrieved earlier in **Admin Username** and **Admin Password** respectively. Click **Test Connection** to ensure Microsoft Entra ID can connect to SAP Cloud Identity Services. If the connection fails, ensure your SAP Cloud Identity Services account has Admin permissions and try again.

	![Screenshot of the Tenant URL and Token.](media/sap-cloud-platform-identity-authentication-provisioning-tutorial/testconnection.png)

1. In the **Notification Email** field, enter the email address of a person or group who should receive the provisioning error notifications and check the checkbox - **Send an email notification when a failure occurs**.

	![Screenshot of the Notification Email.](common/provisioning-notification-email.png)

1. Click **Save**.

1. Under the **Mappings** section, select **Synchronize Microsoft Entra users to SAP Cloud Identity Services**.

	![Screenshot of the SAP Cloud Identity Services User Mappings.](media/sap-cloud-platform-identity-authentication-provisioning-tutorial/mapping.png)

1. Review the user attributes that are synchronized from Microsoft Entra ID to SAP Cloud Identity Services in the **Attribute Mapping** section. The attributes selected as **Matching** properties are used to match the user accounts in SAP Cloud Identity Services for update operations. Select the **Save** button to commit any changes.

	|Attribute|Type|Supported for filtering|Required by SAP Cloud Identity Services|
	|---|---|---|---|
	|userName|String|&check;|&check;
	|emails[type eq "work"].value|String||&check;
	|active|Boolean||
	|displayName|String||
	|urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:manager|Reference||
	|addresses[type eq "work"].country|String||
	|addresses[type eq "work"].locality|String||
	|addresses[type eq "work"].postalCode|String||
	|addresses[type eq "work"].region|String||
	|addresses[type eq "work"].streetAddress|String||
	|name.givenName|String||
	|name.familyName|String||
	|name.honorificPrefix|String||
	|phoneNumbers[type eq "fax"].value|String||
	|phoneNumbers[type eq "mobile"].value|String||
	|phoneNumbers[type eq "work"].value|String||
	|urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:costCenter|String||
	|urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:department|String||
	|urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:division|String||
	|urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:employeeNumber|String||
	|urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:organization|String||
	|locale|String||
	|timezone|String||
	|userType|String||
	|company|String||
	|urn:sap:cloud:scim:schemas:extension:custom:2.0:User:attributes:customAttribute1|String||
	|urn:sap:cloud:scim:schemas:extension:custom:2.0:User:attributes:customAttribute2|String||
	|urn:sap:cloud:scim:schemas:extension:custom:2.0:User:attributes:customAttribute3|String||
	|urn:sap:cloud:scim:schemas:extension:custom:2.0:User:attributes:customAttribute4|String||
	|urn:sap:cloud:scim:schemas:extension:custom:2.0:User:attributes:customAttribute5|String||
	|urn:sap:cloud:scim:schemas:extension:custom:2.0:User:attributes:customAttribute6|String||
	|urn:sap:cloud:scim:schemas:extension:custom:2.0:User:attributes:customAttribute7|String||
	|urn:sap:cloud:scim:schemas:extension:custom:2.0:User:attributes:customAttribute8|String||
	|urn:sap:cloud:scim:schemas:extension:custom:2.0:User:attributes:customAttribute9|String||
	|urn:sap:cloud:scim:schemas:extension:custom:2.0:User:attributes:customAttribute10|String||
	|sendMail|String||
	|mailVerified|String||

1. To configure scoping filters, refer to the following instructions provided in the [Scoping filter tutorial](../app-provisioning/define-conditional-rules-for-provisioning-user-accounts.md).

1. To enable the Microsoft Entra provisioning service for SAP Cloud Identity Services, change the **Provisioning Status** to **On** in the **Settings** section.

	![Screenshot of Provisioning Status Toggled On.](common/provisioning-toggle-on.png)

1. Define the users that you would like to provision to SAP Cloud Identity Services by choosing the desired values in **Scope** in the **Settings** section.

	![Screenshot of Provisioning Scope.](common/provisioning-scope.png)

1. When you're ready to provision, click **Save**.

	![Screenshot of Saving Provisioning Configuration.](common/provisioning-configuration-save.png)

This operation starts the initial synchronization of all users defined in **Scope** in the **Settings** section. The initial sync takes longer to perform than subsequent syncs, which occur approximately every 40 minutes as long as the Microsoft Entra provisioning service is running. You can use the **Synchronization Details** section to monitor progress and follow links to provisioning activity report, which describes all actions performed by the Microsoft Entra provisioning service on SAP Cloud Identity Services.

For more information on how to read the Microsoft Entra provisioning logs, see [Reporting on automatic user account provisioning](../app-provisioning/check-status-user-account-provisioning.md).

## Connector limitations

* SAP Cloud Identity Services's SCIM endpoint requires certain attributes to be of specific format. You can know more about these attributes and their specific format [here](https://help.sap.com/viewer/6d6d63354d1242d185ab4830fc04feb1/Cloud/en-US/b10fc6a9a37c488a82ce7489b1fab64c.html#).

## More resources

* [Managing user account provisioning for Enterprise Apps](../app-provisioning/configure-automatic-user-provisioning-portal.md)
* [What is application access and single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)

## Next steps

* [Learn how to review logs and get reports on provisioning activity](../app-provisioning/check-status-user-account-provisioning.md)
