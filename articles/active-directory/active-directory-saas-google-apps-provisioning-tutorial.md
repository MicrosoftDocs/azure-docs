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
# Tutorial: Configure Google Apps for automatic user provisioning

The objective of this tutorial is to show you how to automatically provision and de-provision user accounts from Azure Active Directory (Azure AD) to Google Apps.

## Prerequisites

The scenario that's outlined in this tutorial assumes that you already have the following items:

*   An Azure Active directory tenant.
*   A valid tenant for Google Apps for Work or Google Apps for Education. You can use a free trial account for either service.
*   A user account in Google Apps with Team Admin permissions.

## Assign users to Google Apps

Azure Active Directory uses a concept called "assignments" to determine which users should receive access to selected apps. In the context of automatic user account provisioning, only the users and groups that have been "assigned" to an application in Azure AD are synchronized.

Before you configure and enable the provisioning service, you need to decide which users or groups in Azure AD need access to your Google Apps app. After you've made this decision, you can assign these users to your Google Apps app by following the instructions in
[Assign a user or group to an enterprise app](https://docs.microsoft.com/azure/active-directory/active-directory-coreapps-assign-user-azure-portal).

> [!IMPORTANT]
> We recommend  that a single Azure AD user be assigned to Google Apps to test the provisioning configuration. You can assign additional users and groups later.

> When you assign a user to Google Apps, select the **User** or **Group** role in the assignment dialog box. The **Default Access** role doesn't work for provisioning.

## Enable automated user provisioning

This section guides you through the process of connecting your Azure AD to the user account provisioning API of Google Apps. It also helps you configure the provisioning service to create, update, and disable assigned user accounts in Google Apps based on user and group assignment in Azure AD.

>[!TIP]
>You might also choose to enable SAML-based single sign-on for Google Apps, by following the instructions in the [Azure portal](https://portal.azure.com). Single sign-on can be configured independently of automatic provisioning, though these two features compliment each other.

### Configure automatic user account provisioning

> [!NOTE]
> Another viable option for automating user provisioning to Google Apps is to use [Google Apps Directory Sync (GADS)](https://support.google.com/a/answer/106368?hl=en). GADS provisions your on-premises Active Directory identities to Google Apps. In contrast, the solution in this tutorial provisions your Azure Active Directory (cloud) users and email-enabled groups to Google Apps. 

1. Sign in to the [Google Apps Admin console](http://admin.google.com/) with your administrator account, and then select **Security**. If you don't see the link, it might be hidden under the **More Controls** menu at the bottom of the screen.
   
    ![Select security.][10]

2. On the **Security** page, select **API Reference**.
   
    ![Select API Reference.][15]

3. Select **Enable API access**.
   
    ![Select API Reference.][16]

    > [!IMPORTANT]
    > For every user that you intend to provision to Google Apps, their user name in Azure Active Directory *must* be tied to a custom domain. For example, user names that look like bob@contoso.onmicrosoft.com are not accepted by Google Apps. On the other hand, bob@contoso.com is accepted. You can change an existing user's domain by editing their properties in Azure AD. We've included instructions for how to set a custom domain for both Azure Active Directory and Google Apps in the following steps.
      
4. If you haven't added a custom domain name to your Azure Active Directory yet, then take the following steps:
  
    a. In the [Azure portal](https://portal.azure.com), on the left navigation pane, select **Active Directory**. In the directory list, select your directory. 

    b. Select **Domain name** on the left navigation pane, and then select **Add**.
     
     ![Domain](./media/active-directory-saas-google-apps-provisioning-tutorial/domain_1.png)

     ![Domain add](./media/active-directory-saas-google-apps-provisioning-tutorial/domain_2.png)

    c. Type your domain name into the **Domain name** field. This domain name should be the same domain name that you intend to use for Google Apps. Then select the **Add Domain** button.
     
     ![Domain name](./media/active-directory-saas-google-apps-provisioning-tutorial/domain_3.png)

    d. Select **Next** to go to the verification page. To verify that you own this domain, edit the domain's DNS records according to the values that are provided on this page. You might choose to verify by using either **MX records** or **TXT records**, depending on what you select for the **Record Type** option. 
    
    For more comprehensive instructions on how to verify domain names with Azure AD, see [Add your own domain name to Azure AD](https://go.microsoft.com/fwLink/?LinkID=278919&clcid=0x409).
     
     ![Domain](./media/active-directory-saas-google-apps-provisioning-tutorial/domain_4.png)

    e. Repeat the preceding steps for all the domains that you intend to add to your directory.

5. Now that you have verified all your domains with Azure AD, you must verify them again with Google Apps. For each domain that isn't already registered with Google Apps, take the following steps:
   
    a. In the [Google Apps Admin Console](http://admin.google.com/), select **Domains**.
     
     ![Select Domains][20]

    b. Select **Add a domain or a domain alias**.
     
     ![Add a new domain][21]

    c. Select **Add another domain**, and then type in the name of the domain that you want to add.
     
     ![Type in your domain name][22]

    d. Select **Continue and verify domain ownership**. Then follow the steps to verify that you own the domain name. For comprehensive instructions on how to verify your domain with Google Apps, see [Verify your site ownership with Google Apps](https://support.google.com/webmasters/answer/35179).

    e. Repeat the preceding steps for any additional domains that you intend to add to Google Apps.
     
     > [!WARNING]
     > If you change the primary domain for your Google Apps tenant, and if you have already configured single sign-on with Azure AD, then you have to repeat step #3 under [Step 2: Enable single sign-on](#step-two-enable-single-sign-on).
       
6. In the [Google Apps Admin console](http://admin.google.com/), select **Admin Roles**.
   
     ![Select Google Apps][26]

7. Determine which admin account you want to use to manage user provisioning. For the **admin role** of that account, edit the **Privileges** for that role. Make sure to enable all **Admin API Privileges** so that this account can be used for provisioning.
   
     ![Select Google Apps][27]
   
    > [!NOTE]
    > If you are configuring a production environment, the best practice is to create an admin account in Google Apps specifically for this step. These accounts must have an admin role associated with them that has the necessary API privileges.
     
8. In the [Azure portal](https://portal.azure.com), browse to the **Azure Active Directory** > **Enterprise Apps** > **All applications** section.

9. If you have already configured Google Apps for single sign-on, search for your instance of Google Apps by using the search field. Otherwise, select **Add**, and then search for **Google Apps** in the application gallery. Select **Google Apps** from the search results, and then add it to your list of applications.

10. Select your instance of Google Apps, and then select the **Provisioning** tab.

11. Set the **Provisioning Mode** to **Automatic**. 

     ![Provisioning](./media/active-directory-saas-google-apps-provisioning-tutorial/provisioning.png)

12. Under the **Admin Credentials** section, select **Authorize**. It opens a Google Apps authorization dialog box in a new browser window.

13. Confirm that you want to give Azure Active Directory permission to make changes to your Google Apps tenant. Select **Accept**.
    
     ![Confirm permissions.][28]

14. In the Azure portal, select **Test Connection** to ensure that Azure AD can connect to your Google Apps app. If the connection fails, ensure that your Google Apps account has Team Admin permissions. Then try the **Authorize** step again.

15. Enter the email address of a person or group who should receive provisioning error notifications in the **Notification Email** field. Then select the check box.

16. Select **Save.**

17. Under the **Mappings** section, select **Synchronize Azure Active Directory Users to Google Apps**.

18. In the **Attribute Mappings** section, review the user attributes that are synchronized from Azure AD to Google Apps. The attributes that are **Matching** properties are used to match the user accounts in Google Apps for update operations. Select **Save** to commit any changes.

19. To enable the Azure AD provisioning service for Google Apps, change the **Provisioning Status** to **On** in **Settings**.

20. Select **Save**.

This process starts the initial synchronization of any users or groups that are assigned to Google Apps in the Users and Groups section. The initial sync takes longer to perform than subsequent syncs, which occur approximately every 20 minutes while the service is running. 

You can use the **Synchronization Details** section to monitor progress and follow links to provisioning activity reports. These reports describe all actions that the are performed by the provisioning service  on your Google Apps app.

## Additional resources

* [Managing user account provisioning for Enterprise Apps](active-directory-saas-tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)
* [Configure single sign-on](active-directory-saas-google-apps-tutorial.md)



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
