---
title: 'Tutorial: Configure Salesforce for automatic user provisioning with Azure Active Directory| Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Salesforce.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman

ms.assetid: 49384b8b-3836-4eb1-b438-1c46bb9baf6f
ms.service: active-directory
ms.component: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/08/2018
ms.author: jeedes

---
# Tutorial: Configure Salesforce for automatic user provisioning

The objective of this tutorial is to show the steps required to perform in Salesforce and Azure AD to automatically provision and de-provision user accounts from Azure AD to Salesforce.

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following items:

* An Azure Active directory tenant
* A Salesforce.com tenant

> [!IMPORTANT]
> If you are using a Salesforce.com trial account, then you will be unable to configure automated user provisioning. Trial accounts do not have the necessary API access enabled until they are purchased. You can get around this limitation by using a free [developer account](https://developer.salesforce.com/signup) to complete this tutorial.

If you are using a Salesforce Sandbox environment, please see the [Salesforce Sandbox integration tutorial](https://go.microsoft.com/fwLink/?LinkID=521879).

## Assigning users to Salesforce

Azure Active Directory uses a concept called "assignments" to determine which users should receive access to selected apps. In the context of automatic user account provisioning, only the users and groups that have been "assigned" to an application in Azure AD is synchronized.

Before configuring and enabling the provisioning service, you need to decide which users or groups in Azure AD need access to your Salesforce app. After you've made this decision, you can assign these users to your Salesforce app by following the instructions in [Assign a user or group to an enterprise app](https://docs.microsoft.com/azure/active-directory/active-directory-coreapps-assign-user-azure-portal)

### Important tips for assigning users to Salesforce

* It is recommended that a single Azure AD user is assigned to Salesforce to test the provisioning configuration. Additional users and/or groups may be assigned later.

* When assigning a user to Salesforce, you must select a valid user role. The "Default Access" role does not work for provisioning

    > [!NOTE]
    > This app imports profiles from Salesforce as part of the provisioning process, which the customer may want to select when assigning users in Azure AD. Please note that the profiles that get imported from Salesforce appear as Roles in Azure AD.

## Enable automated user provisioning

This section guides you through connecting your Azure AD to Salesforce's user account provisioning API, and configuring the provisioning service to create, update, and disable assigned user accounts in Salesforce based on user and group assignment in Azure AD.

> [!Tip]
> You may also choose to enabled SAML-based Single Sign-On for Salesforce, following the instructions provided in [Azure portal](https://portal.azure.com). Single sign-on can be configured independently of automatic provisioning, though these two features compliment each other.

### configure automatic user account provisioning

The objective of this section is to outline how to enable user provisioning of Active Directory user accounts to Salesforce.

1. In the [Azure portal](https://portal.azure.com), browse to the **Azure Active Directory > Enterprise Apps > All applications** section.

2. If you have already configured Salesforce for single sign-on, search for your instance of Salesforce using the search field. Otherwise, select **Add** and search for **Salesforce** in the application gallery. Select Salesforce from the search results, and add it to your list of applications.

3. Select your instance of Salesforce, then select the **Provisioning** tab.

4. Set the **Provisioning Mode** to **Automatic**.

    ![provisioning](./media/salesforce-provisioning-tutorial/provisioning.png)

5. Under the **Admin Credentials** section, provide the following configuration settings:

    a. In the **Admin Username** textbox, type a Salesforce account name that has the **System Administrator** profile in Salesforce.com assigned.

    b. In the **Admin Password** textbox, type the password for this account.

6. To get your Salesforce security token, open a new tab and sign into the same Salesforce admin account. On the top right corner of the page, click your name, and then click **Settings**.

    ![Enable automatic user provisioning](./media/salesforce-provisioning-tutorial/sf-my-settings.png "Enable automatic user provisioning")

7. On the left navigation pane, click **My Personal Information** to expand the related section, and then click **Reset My Security Token**.
  
    ![Enable automatic user provisioning](./media/salesforce-provisioning-tutorial/sf-personal-reset.png "Enable automatic user provisioning")

8. On the **Reset Security Token** page, click **Reset Security Token** button.

    ![Enable automatic user provisioning](./media/salesforce-provisioning-tutorial/sf-reset-token.png "Enable automatic user provisioning")

9. Check the email inbox associated with this admin account. Look for an email from Salesforce.com that contains the new security token.

10. Copy the token, go to your Azure AD window, and paste it into the **Secret Token** field.

11. The **Tenant URL** should be entered if the instance of Salesforce is on the Salesforce Government Cloud. Otherwise, it is optional. Enter the tenant URL using the format of "https://\<your-instance\>.my.salesforce.com," replacing \<your-instance\> with the name of your Salesforce instance.

12. In the Azure portal, click **Test Connection** to ensure Azure AD can connect to your Salesforce app.

13. In the **Notification Email** field, enter the email address of a person or group who should receive provisioning error notifications, and check the checkbox below.

14. Click **Save.**  

15. Under the Mappings section, select **Synchronize Azure Active Directory Users to Salesforce.**

16. In the **Attribute Mappings** section, review the user attributes that are synchronized from Azure AD to Salesforce. Note that the attributes selected as **Matching** properties are used to match the user accounts in Salesforce for update operations. Select the Save button to commit any changes.

17. To enable the Azure AD provisioning service for Salesforce, change the **Provisioning Status** to **On** in the Settings section

18. Click **Save.**

This starts the initial synchronization of any users and/or groups assigned to Salesforce in the Users and Groups section. Note that the initial sync takes longer to perform than subsequent syncs, which occur approximately every 40 minutes as long as the service is running. You can use the **Synchronization Details** section to monitor progress and follow links to provisioning activity logs, which describe all actions performed by the provisioning service on your Salesforce app.

For more information on how to read the Azure AD provisioning logs, see [Reporting on automatic user account provisioning](../manage-apps/check-status-user-account-provisioning.md).

## Additional resources

* [Managing user account provisioning for Enterprise Apps](tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)
* [Configure Single Sign-on](https://docs.microsoft.com/azure/active-directory/active-directory-saas-salesforce-tutorial)