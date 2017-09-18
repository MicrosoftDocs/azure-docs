---
title: 'Tutorial: Azure Active Directory integration with Box | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Box .
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila

ms.assetid: 1c959595-6e57-4954-9c0d-67ba03ee212b
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/19/2017
ms.author: jeedes

---
# Tutorial: Configuring Box for Automatic User Provisioning

The objective of this tutorial is to show the steps you need to perform in Box and Azure AD to automatically provision and de-provision user accounts from Azure AD to Box.

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following items:

*   An Azure Active directory tenant.
*   A Box single-sign on enabled subscription.
*   A user account in Box with Team Admin permissions.

## Assigning users to Box 

Azure Active Directory uses a concept called "assignments" to determine which users should receive access to selected apps. In the context of automatic user account provisioning, only the users and groups that have been "assigned" to an application in Azure AD is synchronized.

Before configuring and enabling the provisioning service, you need to decide what users and/or groups in Azure AD represent the users who need access to your Box app. Once decided, you can assign these users to your Box app by following the instructions here:

[Assign a user or group to an enterprise app](https://docs.microsoft.com/azure/active-directory/active-directory-coreapps-assign-user-azure-portal)

## Assign users and groups
The **Box > Users and Groups** tab in the Azure portal allows you to specify which users and groups should be granted access to Box. Assignment of a user or group causes the following things to occur:

* Azure AD permits the assigned user (either by direct assignment or group membership) to authenticate to Box. If a user is not assigned, then Azure AD does not permit them to sign in to Box and returns an error on the Azure AD sign-in page.
* An app tile for Box is added to the user's [application launcher](active-directory-appssoaccess-whatis.md#deploying-azure-ad-integrated-applications-to-users).
* If automatic provisioning is enabled, then the assigned users and/or groups are added to the provisioning queue to be automatically provisioned.
  
  * If only user objects were configured to be provisioned, then all directly assigned users are placed in the provisioning queue, and all users that are members of any assigned groups are placed in the provisioning queue. 
  * If group objects were configured to be provisioned, then all assigned group objects are provisioned to Box, and all users that are members of those groups. The group and user memberships are preserved upon being written to Box.

You can use the **Attributes > Single Sign-On** tab to configure which user attributes (or claims) are presented to Box during SAML-based authentication, and the **Attributes > Provisioning** tab to configure how user and group attributes flow from Azure AD to Box during provisioning operations.

### Important tips for assigning users to Box 

*   It is recommended that a single Azure AD user assigned to Box to test the provisioning configuration. Additional users and/or groups may be assigned later.

*   When assigning a user to box, you must select a valid user role. The "Default Access" role does not work for provisioning.

## Enable Automated User Provisioning

This section guides through connecting your Azure AD to Box's user account provisioning API, and configuring the provisioning service to create, update, and disable assigned user accounts in Box based on user and group assignment in Azure AD.

If automatic provisioning is enabled, then the assigned users and/or groups are added to the provisioning queue to be automatically provisioned.
	
 * If only user objects are configured to be provisioned, then directly assigned users are placed in the provisioning queue, and all users that are members of any assigned groups are placed in the provisioning queue. 
	
 * If group objects were configured to be provisioned, then all assigned group objects are provisioned to Box, and all users that are members of those groups. The group and user memberships are preserved upon being written to Box.

> [!TIP] 
> You may also choose to enabled SAML-based Single Sign-On for Box, following the instructions provided in [Azure portal](https://portal.azure.com). Single sign-on can be configured independently of automatic provisioning, though these two features compliment each other.

### To configure automatic user account provisioning:

The objective of this section is to outline how to enable provisioning of Active Directory user accounts to Box.

1. In the [Azure portal](https://portal.azure.com), browse to the **Azure Active Directory > Enterprise Apps > All applications** section.

2. If you have already configured Box for single sign-on, search for your instance of Box using the search field. Otherwise, select **Add** and search for **Box** in the application gallery. Select Box from the search results, and add it to your list of applications.

3. Select your instance of Box, then select the **Provisioning** tab.

4. Set the **Provisioning Mode** to **Automatic**. 

    ![provisioning](./media/active-directory-saas-box-userprovisioning-tutorial/provisioning.png)

5. Under the **Admin Credentials** section, click **Authorize** to open a Box login dialog in a new browser window.

6. On the **Login to grant access to Box** page, provide the required credentials, and then click **Authorize**. 
   
    ![Enable automatic user provisioning](./media/active-directory-saas-box-userprovisioning-tutorial/IC769546.png "Enable automatic user provisioning")

7. Click **Grant access to Box** to authorize this operation and to return to the Azure portal. 
   
    ![Enable automatic user provisioning](./media/active-directory-saas-box-userprovisioning-tutorial/IC769549.png "Enable automatic user provisioning")

8. In the Azure portal, click **Test Connection** to ensure Azure AD can connect to your Box app. If the connection fails, ensure your Box account has Team Admin permissions and try the **"Authorize"** step again.

9. Enter the email address of a person or group who should receive provisioning error notifications in the **Notification Email** field, and check the checkbox.

10. Click **Save.**

11. Under the Mappings section, select **Synchronize Azure Active Directory Users to Box.**

12. In the **Attribute Mappings** section, review the user attributes that are synchronized from Azure AD to Box. The attributes selected as **Matching** properties are used to match the user accounts in Box for update operations. Select the Save button to commit any changes.

13. To enable the Azure AD provisioning service for Box, change the **Provisioning Status** to **On** in the Settings section

14. Click **Save.**

That starts the initial synchronization of any users and/or groups assigned to Box in the Users and Groups section. The initial sync takes longer to perform than subsequent syncs, which occur approximately every 20 minutes as long as the service is running. You can use the **Synchronization Details** section to monitor progress and follow links to provisioning activity reports, which describe all actions performed by the provisioning service on your Box app.

You can now create a test account. Wait for up to 20 minutes to verify that the account has been synchronized to box.

In your Box tenant, synchronized users are listed under **Managed Users** in the **Admin Console**.

![Integration status](./media/active-directory-saas-box-userprovisioning-tutorial/IC769556.png "Integration status")


## Additional resources

* [Managing user account provisioning for Enterprise Apps](active-directory-saas-tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)
* [Configure Single Sign-on](active-directory-saas-box-tutorial.md)