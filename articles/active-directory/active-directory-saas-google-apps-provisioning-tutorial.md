---
title: 'Tutorial: Configuring Google Apps for automatic user provisioning in Azure | Microsoft Docs'
description: Learn how to automatically provision and de-provision user accounts from Azure AD to Google Apps.
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila

ms.assetid: 6dbd50b5-589f-4132-b9eb-a53a318a64e5
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/12/2017
ms.author: jeedes

---
# Tutorial: Configuring Google Apps for automatic user provisioning

The objective of this tutorial is to show you the steps you need to perform in Google Apps and Azure AD to automatically provision and de-provision user accounts from Azure AD to Google Apps.

## Prerequisites

The scenario outlined in this tutorial assumes that you already have the following items:

*   An Azure Active directory tenant.
*   You must have a valid tenant for Google Apps for Work or Google Apps for Education. You may use a free trial account for either service.
*   A user account in Google Apps with Team Admin permissions.

## Assigning users to Google Apps

Azure Active Directory uses a concept called "assignments" to determine which users should receive access to selected apps. In the context of automatic user account provisioning, only the users and groups that have been "assigned" to an application in Azure AD is synchronized.

Before configuring and enabling the provisioning service, you need to decide what users and/or groups in Azure AD represent the users who need access to your Google Apps app. Once decided, you can assign these users to your Google Apps app by following the instructions here:
[Assign a user or group to an enterprise app](https://docs.microsoft.com/azure/active-directory/active-directory-coreapps-assign-user-azure-portal)

> [!IMPORTANT]
>*   It is recommended that a single Azure AD user be assigned to Google Apps to test the provisioning configuration. Additional users and/or groups may be assigned later.
>*   When assigning a user to Google Apps, you must select the User or "Group" role in the assignment dialog. The "Default Access" role does not work for provisioning.

## Enable automated user provisioning

This section guides you through connecting your Azure AD to Google Apps's user account provisioning API, and configuring the provisioning service to create, update, and disable assigned user accounts in Google Apps based on user and group assignment in Azure AD.

>[!Tip]
>You may also choose to enabled SAML-based Single Sign-On for Google Apps, following the instructions provided in [Azure portal](https://portal.azure.com). Single sign-on can be configured independently of automatic provisioning, though these two features compliment each other.

### Configure automatic user account provisioning

> [!NOTE]
> Another viable option for automating user provisioning to Google Apps is to use [Google Apps Directory Sync (GADS)](https://support.google.com/a/answer/106368?hl=en) which provisions your on-premises Active Directory identities to Google Apps. In contrast, the solution in this tutorial provisions your Azure Active Directory (cloud) users and mail-enabled groups to Google Apps. 

1. Sign into the [Google Apps Admin Console](http://admin.google.com/) using your administrator account, and click **Security**. If you don't see the link, it may be hidden under the **More Controls** menu at the bottom of the screen.
   
    ![Click Security.][10]

2. On the **Security** page, click **API Reference**.
   
    ![Click API Reference.][15]

3. Select **Enable API access**.
   
    ![Click API Reference.][16]

    > [!IMPORTANT]
    > For every user that you intend to provision to Google Apps, their username in Azure Active Directory *must* be tied to a custom domain. For example, usernames that look like bob@contoso.onmicrosoft.com is not accepted by Google Apps, whereas bob@contoso.com is accepted. You can change an existing user's domain by editing their properties in Azure AD. Instructions for how to set a custom domain for both Azure Active Directory and Google Apps are included in following steps.
      
4. If you haven't added a custom domain name to your Azure Active Directory yet, then follow the following steps:
  
    a. In the [Azure portal](https://portal.azure.com), on the left navigation pane, click **Active Directory**. In the directory list, select your directory. 

    b. Click **Domains name** on the left navigation pane, and then click **Add**.
     
     ![domain](./media/active-directory-saas-google-apps-provisioning-tutorial/domain_1.png)

     ![domain add](./media/active-directory-saas-google-apps-provisioning-tutorial/domain_2.png)

    c. Type your domain name into the **Domain name** field. This domain name should be the same domain name that you intend to use for Google Apps. When ready, click the **Add Domain** button.
     
     ![domain name](./media/active-directory-saas-google-apps-provisioning-tutorial/domain_3.png)

    d. Click **Next** to go to the verification page. To verify that you own this domain, you must edit the domain's DNS records according to the values provided on this page. You may choose to verify using either **MX records** or **TXT records**, depending on what you select for the **Record Type** option. For more comprehensive instructions on how to verify domain name with Azure AD, refer [Add your own domain name to Azure AD](https://go.microsoft.com/fwLink/?LinkID=278919&clcid=0x409).
     
     ![domain](./media/active-directory-saas-google-apps-provisioning-tutorial/domain_4.png)

    e. Repeat the preceding steps for all the domains that you intend to add to your directory.

5. Now that you have verified all your domains with Azure AD, you must now verify them again with Google Apps. For each domain that isn't already registered with Google Apps, perform the following steps:
   
    a. In the [Google Apps Admin Console](http://admin.google.com/), click **Domains**.
     
     ![Click on Domains][20]

    b. Click **Add a domain or a domain alias**.
     
     ![Add a new domain][21]

    c. Select **Add another domain**, and type in the name of the domain that you would like to add.
     
     ![Type in your domain name][22]

    d. Click **Continue and verify domain ownership**. Then follow the steps to verify that you own the domain name. For comprehensive instructions on how to verify your domain with Google Apps, see. [Verify your site ownership with Google Apps](https://support.google.com/webmasters/answer/35179).

    e. Repeat the preceding steps for any additional domains that you intend to add to Google Apps.
     
     > [!WARNING]
     > If you change the primary domain for your Google Apps tenant, and if you have already configured single sign-on with Azure AD, then you have to repeat step #3 under [Step Two: Enable Single Sign-On](#step-two-enable-single-sign-on).
       
6. In the [Google Apps Admin Console](http://admin.google.com/), click **Admin Roles**.
   
     ![Click on Google Apps][26]

7. Determine which admin account you would like to use to manage user provisioning. For the **admin role** of that account, edit the **Privileges** for that role. Make sure it has all the **Admin API Privileges** enabled so that this account can be used for provisioning.
   
     ![Click on Google Apps][27]
   
    > [!NOTE]
    > If you are configuring a production environment, the best practice is to create an admin account in Google Apps specifically for this step. These accounts must have an admin role associated with it that has the necessary API privileges.
     
8. In the [Azure portal](https://portal.azure.com), browse to the **Azure Active Directory > Enterprise Apps > All applications** section.

9. If you have already configured Google Apps for single sign-on, search for your instance of Google Apps using the search field. Otherwise, select **Add** and search for **Google Apps** in the application gallery. Select Google Apps from the search results, and add it to your list of applications.

10. Select your instance of Google Apps, then select the **Provisioning** tab.

11. Set the **Provisioning Mode** to **Automatic**. 

     ![provisioning](./media/active-directory-saas-google-apps-provisioning-tutorial/provisioning.png)

12. Under the **Admin Credentials** section, click **Authorize**. It opens a Google Apps authorization dialog in a new browser window.

13. Confirm that you would like to give Azure Active Directory permission to make changes to your Google Apps tenant. Click **Accept**.
    
     ![Confirm permissions.][28]

14. In the Azure portal, click **Test Connection** to ensure Azure AD can connect to your Google Apps app. If the connection fails, ensure your Google Apps account has Team Admin permissions and try the **"Authorize"** step again.

15. Enter the email address of a person or group who should receive provisioning error notifications in the **Notification Email** field, and check the checkbox.

16. Click **Save.**

17. Under the Mappings section, select **Synchronize Azure Active Directory Users to Google Apps.**

18. In the **Attribute Mappings** section, review the user attributes that are synchronized from Azure AD to Google Apps. The attributes selected as **Matching** properties are used to match the user accounts in Google Apps for update operations. Select the Save button to commit any changes.

19. To enable the Azure AD provisioning service for Google Apps, change the **Provisioning Status** to **On** in the Settings section

20. Click **Save.**

It starts the initial synchronization of any users and/or groups assigned to Google Apps in the Users and Groups section. The initial sync takes longer to perform than subsequent syncs, which occur approximately every 20 minutes as long as the service is running. You can use the **Synchronization Details** section to monitor progress and follow links to provisioning activity reports, which describe all actions performed by the provisioning service on your Google Apps app.

## Additional resources

* [Managing user account provisioning for Enterprise Apps](active-directory-saas-tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)
* [Configure Single Sign-on](active-directory-saas-google-apps-tutorial.md)



<!--Image references-->

[10]: ./media/active-directory-saas-google-apps-provisioning-tutorial/gapps-security.png
[15]: ./media/active-directory-saas-google-apps-provisioning-tutorial/gapps-api.png
[16]: ./media/active-directory-saas-google-apps-provisioning-tutorial/gapps-api-enabled.png
[20]: ./media/active-directory-saas-google-apps-provisioning-tutorial/gapps-domains.png
[21]: ./media/active-directory-saas-google-apps-provisioning-tutorial/gapps-add-domain.png
[22]: ./media/active-directory-saas-google-apps-provisioning-tutorial/gapps-add-another.png
[24]: ./media/active-directory-saas-google-apps-provisioning-tutorial/gapps-provisioning.png
[25]: ./media/active-directory-saas-google-apps-provisioning-tutorial/gapps-provisioning-auth.png
[26]: ./media/active-directory-saas-google-apps-provisioning-tutorial/gapps-admin.png
[27]: ./media/active-directory-saas-google-apps-provisioning-tutorial/gapps-admin-privileges.png
[28]: ./media/active-directory-saas-google-apps-provisioning-tutorial/gapps-auth.png