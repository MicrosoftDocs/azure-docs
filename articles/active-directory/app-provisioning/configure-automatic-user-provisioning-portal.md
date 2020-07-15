---
title: User provisioning management for enterprise apps in Azure AD
description: Learn how to manage user account provisioning for enterprise apps using the Azure Active Directory
services: active-directory
documentationcenter: ''
author: kenwith
manager: celestedg
ms.service: active-directory
ms.subservice: app-provisioning
ms.topic: how-to
ms.workload: identity
ms.date: 11/25/2019
ms.author: kenwith
ms.reviewer: arvinh
---

# Managing user account provisioning for enterprise apps in the Azure portal

This article describes the general steps for managing automatic user account provisioning and de-provisioning for applications that support it. *User account provisioning* is the act of creating, updating, and/or disabling user account records in an application’s local user profile store. Most cloud and SaaS applications store the users role and permissions in the user's own local user profile store, and presence of such a user record in the user's local store is *required* for single sign-on and access to work. To learn more about automatic user account provisioning, see [Automate User Provisioning and Deprovisioning to SaaS Applications with Azure Active Directory](user-provisioning.md).

> [!IMPORTANT]
> Azure Active Directory (Azure AD) has a gallery that contains thousands of pre-integrated applications that are enabled for automatic provisioning with Azure AD. You should start by finding the provisioning setup tutorial specific to your application in the [List of tutorials on how to integrate SaaS apps with Azure Active Directory](https://azure.microsoft.com/documentation/articles/active-directory-saas-tutorial-list/). You'll likely find step-by-step guidance for configuring both the app and Azure AD to create the provisioning connection.

## Finding your apps in the portal

Use the Azure Active Directory portal to view and manage all applications that are configured for single sign-on in a directory. Enterprise apps are apps that are deployed and used within your organization. Follow these steps to view and manage your enterprise applications:

1. Open the [Azure Active Directory portal](https://aad.portal.azure.com).
1. Select **Enterprise applications** from the left pane. A list of all configured apps is shown, including apps that were added from the gallery.
1. Select any app to load its resource pane, where you can view reports and manage app settings.
1. Select **Provisioning** to manage user account provisioning settings for the selected app.

   ![Provisioning screen to manage user account provisioning settings](./media/configure-automatic-user-provisioning-portal/enterprise-apps-provisioning.png)

## Provisioning modes

The **Provisioning** pane begins with a **Mode** menu, which shows the provisioning modes supported for an enterprise application, and lets you configure them. The available options include:

* **Automatic** - This option is shown if Azure AD supports automatic API-based provisioning or de-provisioning of user accounts to this application. Select this mode to display an interface that helps administrators:

  * Configure Azure AD to connect to the application's user management API
  * Create account mappings and workflows that define how user account data should flow between Azure AD and the app
  * Manage the Azure AD provisioning service

* **Manual** - This option is shown if Azure AD doesn't support automatic provisioning of user accounts to this application. In this case, user account records stored in the application must be managed using an external process, based on the user management and provisioning capabilities provided by that application (which can include SAML Just-In-Time provisioning).

## Configuring automatic user account provisioning

Select the **Automatic** option to specify settings for admin credentials, mappings, starting and stopping, and synchronization.

### Admin Credentials

Expand **Admin Credentials** to enter the credentials required for Azure AD to connect to the application's user management API. The input required varies depending on the application. To learn about the credential types and requirements for specific applications, see the [configuration tutorial for that specific application](user-provisioning.md).

Select **Test Connection** to test the credentials by having Azure AD attempt to connect to the app's provisioning app using the supplied credentials.

### Mappings

Expand **Mappings** to view and edit the user attributes that flow between Azure AD and the target application when user accounts are provisioned or updated.

There's a preconfigured set of mappings between Azure AD user objects and each SaaS app’s user objects. Some apps manage other types of objects, such as Groups or Contacts. Select a mapping in the table to open the mapping editor to the right, where you can view and customize them.

![Shows the Attribute Mapping screen](./media/configure-automatic-user-provisioning-portal/enterprise-apps-provisioning-mapping.png)

Supported customizations include:

* Enabling and disabling mappings for specific objects, such as the Azure AD user object to the SaaS app's user object.
* Editing the attributes that flow from the Azure AD user object to the app's user object. For more information on attribute mapping, see [Understanding attribute mapping types](customize-application-attributes.md#understanding-attribute-mapping-types).
* Filtering the provisioning actions that Azure AD runs on the targeted application. Instead of having Azure AD fully synchronize objects, you can limit the actions run.

  For example, only select **Update** and Azure AD only updates existing user accounts in an application but doesn't create new ones. Only select **Create** and Azure only creates new user accounts but doesn't update existing ones. This feature lets admins create different mappings for account creation and update workflows.

* Adding a new attribute mapping. Select **Add New Mapping** at the bottom of the **Attribute Mapping** pane. Fill out the **Edit Attribute** form and select **Ok** to add the new mapping to the list.

### Settings

You can start and stop the Azure AD provisioning service for the selected application in the **Settings** area of the **Provisioning** screen. You can also choose to clear the provisioning cache and restart the service.

If provisioning is being enabled for the first time for an application, turn on the service by changing the **Provisioning Status** to **On**. This change causes the Azure AD provisioning service to run an initial cycle. It reads the users assigned in the **Users and groups** section, queries the target application for them, and then runs the provisioning actions defined in the Azure AD **Mappings** section. During this process, the provisioning service stores cached data about what user accounts it's managing, so non-managed accounts inside the target applications that were never in scope for assignment aren't affected by de-provisioning operations. After the initial cycle, the provisioning service automatically synchronizes user and group objects on a forty-minute interval.

Change the **Provisioning Status** to **Off**  to pause the provisioning service. In this state, Azure doesn't create, update, or remove any user or group objects in the app. Change the state back to **On** and the service picks up where it left off.

**Clear current state and restart synchronization** triggers an initial cycle. The service will then evaluate all the users in the source system again and determine if they are in scope for provisioning. This can be useful when your application is currently in quarantine or you need to make a change to your attribute mappings. Note that the initial cycle takes longer to complete than the typical incremental cycle due to the number of objects that need to be evaluated. You can learn more about the performance of initial and incremental cycles [here](application-provisioning-when-will-provisioning-finish-specific-user.md). 
