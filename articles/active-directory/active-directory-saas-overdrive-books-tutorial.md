---
title: 'Tutorial: Azure Active Directory integration with Overdrive Books | Microsoft Docs'
description: Learn how to use Overdrive Books with Azure Active Directory to enable single sign-on, automated provisioning, and more!
services: active-directory
author: jeevansd
documentationcenter: na
manager: femila

ms.assetid: e68cede7-1130-4813-bd55-22a9a6fc6bf5
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 03/24/2017
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Overdrive Books
The objective of this tutorial is to show the integration of Azure and OverDrive.  

The scenario outlined in this tutorial assumes that you already have the following items:

* A valid Azure subscription
* An OverDrive single sign-on (SSO) enabled subscription

After completing this tutorial, the Azure AD users you have assigned to OverDrive will be able to single sign-on (SSO) to the application at your OverDrive company site (service provider initiated sign on), or using the [Introduction to the Access Panel](active-directory-saas-access-panel-introduction.md).

The scenario outlined in this tutorial consists of the following building blocks:

1. Enabling the application integration for OverDrive
2. Configuring single sign-on (SSO)
3. Configuring user provisioning
4. Assigning users

![Scenario](./media/active-directory-saas-overdrive-books-tutorial/IC784462.png "Scenario")

## Enable the application integration for OverDrive
The objective of this section is to outline how to enable the application integration for OverDrive.

**To enable the application integration for OverDrive, perform the following steps:**

1. In the Azure classic portal, on the left navigation pane, click **Active Directory**.
   
   ![Active Directory](./media/active-directory-saas-overdrive-books-tutorial/IC700993.png "Active Directory")
2. From the **Directory** list, select the directory for which you want to enable directory integration.
3. To open the applications view, in the directory view, click **Applications** in the top menu.
   
   ![Applications](./media/active-directory-saas-overdrive-books-tutorial/IC700994.png "Applications")
4. Click **Add** at the bottom of the page.
   
   ![Add application](./media/active-directory-saas-overdrive-books-tutorial/IC749321.png "Add application")
5. On the **What do you want to do** dialog, click **Add an application from the gallery**.
   
   ![Add an application from gallerry](./media/active-directory-saas-overdrive-books-tutorial/IC749322.png "Add an application from gallerry")
6. In the **search box**, type **OverDrive**.
   
   ![Application Gallery](./media/active-directory-saas-overdrive-books-tutorial/IC784463.png "Application Gallery")
7. In the results pane, select **OverDrive**, and then click **Complete** to add the application.
   
   ![OverDrive](./media/active-directory-saas-overdrive-books-tutorial/IC799950.png "OverDrive")
   
## Configure single sign-on

The objective of this section is to outline how to enable users to authenticate to OverDrive with their account in Azure AD using federation based on the SAML protocol.

**To configure SSO, perform the following steps:**

1. In the Azure classic portal, on the **OverDrive** application integration page, click **Configure single sign-on** to open the **Configure Single Sign On ** dialog.
   
   ![Enable single sign-on](./media/active-directory-saas-overdrive-books-tutorial/IC784465.png "Enable single sign-on")
2. On the **How would you like users to sign on to OverDrive** page, select **Microsoft Azure AD Single Sign-On**, and then click **Next**.
   
   ![Configure single sign-on](./media/active-directory-saas-overdrive-books-tutorial/IC784466.png "Configure single sign-on")
3. On the **Configure App URL** page, in the **OverDrive Sign In URL** textbox, type your URL using the following pattern "*http://mslibrarytest.libraryreserve.com*", and then click **Next**.
   
   ![Configure App URL](./media/active-directory-saas-overdrive-books-tutorial/IC784467.png "Configure App URL")
4. On the **Configure single sign-on at OverDrive** page, to download the metadata file, and then send it to the OverDrive support team.
   
   ![Configure single sign-on](./media/active-directory-saas-overdrive-books-tutorial/IC784468.png "Configure single sign-on")
   
   >[!NOTE]
   >The OverDrive support team configures single sign-on for you and sends you a notification when the configuration has been completed.
   > 
   > 
5. On the Azure classic portal, select the single sign-on configuration confirmation, and then click **Complete** to close the **Configure Single Sign On** dialog.
   
   ![Configure single sign-on](./media/active-directory-saas-overdrive-books-tutorial/IC784469.png "Configure single sign-on")
   
## Configure user provisioning

There is no action item for you to configure user provisioning to OverDrive.  

When an assigned user tries to log into OverDrive, an OverDrive account is automatically created if necessary.

>[!NOTE]
>You can use any other OverDrive user account creation tools or APIs provided by OverDrive to provision AAD user accounts.
>
>
 
## Assign users
To test your configuration, you need to grant the Azure AD users you want to allow using your application access to it by assigning them.

**To assign users to OverDrive, perform the following steps:**

1. In the Azure classic portal, create a test account.
2. On the **OverDrive** application integration page, click **Assign users**.
   
   ![Assign Users](./media/active-directory-saas-overdrive-books-tutorial/IC784470.png "Assign Users")
   
3. Select your test user, click **Assign**, and then click **Yes** to confirm your assignment.
   
   ![Yes](./media/active-directory-saas-overdrive-books-tutorial/IC767830.png "Yes")

If you want to test your SSO settings, open the Access Panel. For more details about the Access Panel, see [Introduction to the Access Panel](active-directory-saas-access-panel-introduction.md).

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](active-directory-saas-tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)
