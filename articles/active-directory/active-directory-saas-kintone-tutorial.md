<properties 
    pageTitle="Tutorial: Azure Active Directory Integration with Kintone | Microsoft Azure" 
    description="Learn how to use Kintone with Azure Active Directory to enable single sign-on, automated provisioning, and more!" 
    services="active-directory" 
    authors="jeevansd"  
    documentationCenter="na" 
    manager="femila"/>
<tags 
    ms.service="active-directory" 
    ms.devlang="na" 
    ms.topic="article" 
    ms.tgt_pltfrm="na" 
    ms.workload="identity" 
    ms.date="06/09/2016" 
    ms.author="jeedes" />

#Tutorial: Azure Active Directory Integration with Kintone
  
The objective of this tutorial is to show the integration of Azure and Kintone.  
The scenario outlined in this tutorial assumes that you already have the following items:

-   A valid Azure subscription
-   A Kintone single sign-on enabled subscription
  
After completing this tutorial, the Azure AD users you have assigned to Kintone will be able to single sign into the application at your Kintone company site (service provider initiated sign on), or using the [Introduction to the Access Panel](active-directory-saas-access-panel-introduction.md).
  
The scenario outlined in this tutorial consists of the following building blocks:

1.  Enabling the application integration for Kintone
2.  Configuring single sign-on
3.  Configuring user provisioning
4.  Assigning users

![Scenario](./media/active-directory-saas-kintone-tutorial/IC785859.png "Scenario")
##Enabling the application integration for Kintone
  
The objective of this section is to outline how to enable the application integration for Kintone.

###To enable the application integration for Kintone, perform the following steps:

1.  In the Azure classic portal, on the left navigation pane, click **Active Directory**.

    ![Active Directory](./media/active-directory-saas-kintone-tutorial/IC700993.png "Active Directory")

2.  From the **Directory** list, select the directory for which you want to enable directory integration.

3.  To open the applications view, in the directory view, click **Applications** in the top menu.

    ![Applications](./media/active-directory-saas-kintone-tutorial/IC700994.png "Applications")

4.  Click **Add** at the bottom of the page.

    ![Add application](./media/active-directory-saas-kintone-tutorial/IC749321.png "Add application")

5.  On the **What do you want to do** dialog, click **Add an application from the gallery**.

    ![Add an application from gallerry](./media/active-directory-saas-kintone-tutorial/IC749322.png "Add an application from gallerry")

6.  In the **search box**, type **Kintone**.

    ![Application Gallery](./media/active-directory-saas-kintone-tutorial/IC785867.png "Application Gallery")

7.  In the results pane, select **Kintone**, and then click **Complete** to add the application.

    ![Kintone](./media/active-directory-saas-kintone-tutorial/IC785871.png "Kintone")
##Configuring single sign-on
  
The objective of this section is to outline how to enable users to authenticate to Kintone with their account in Azure AD using federation based on the SAML protocol.

###To configure single sign-on, perform the following steps:

1.  In the Azure classic portal, on the **Kintone** application integration page, click **Configure single sign-on** to open the **Configure Single Sign On ** dialog.

    ![Configure Single Sign-On](./media/active-directory-saas-kintone-tutorial/IC785872.png "Configure Single Sign-On")

2.  On the **How would you like users to sign on to Kintone** page, select **Microsoft Azure AD Single Sign-On**, and then click **Next**.

    ![Configure Single Sign-On](./media/active-directory-saas-kintone-tutorial/IC785873.png "Configure Single Sign-On")

3.  On the **Configure App URL** page, in the **Kintone Sign On URL** textbox, type your URL using the following pattern "*https://company.kintone.com*", and then click **Next**.

    ![Configure App URL](./media/active-directory-saas-kintone-tutorial/IC785875.png "Configure App URL")

4.  On the **Configure single sign-on at Kintone** page, to download your certificate, click **Download certificate**, and then save the certificate file on your computer.

    ![Configure Single Sign-On](./media/active-directory-saas-kintone-tutorial/IC785878.png "Configure Single Sign-On")

5.  In a different web browser window, log into your **Kintone** company site as an administrator.

6.  Click **Settings**.

    ![Settings](./media/active-directory-saas-kintone-tutorial/IC785879.png "Settings")

7.  Click **Users & System Administration**.

    ![Users & System Administration](./media/active-directory-saas-kintone-tutorial/IC785880.png "Users & System Administration")

8.  Under **System Administration \> Security** click **Login**.

    ![Login](./media/active-directory-saas-kintone-tutorial/IC785881.png "Login")

9.  Click **Enable SAML authentication**.

    ![SAML Authentication](./media/active-directory-saas-kintone-tutorial/IC785882.png "SAML Authentication")

10. In the SAML Authentication section, perform the following steps:

    ![SAML Authentication](./media/active-directory-saas-kintone-tutorial/IC785883.png "SAML Authentication")

    1.  In the Azure classic portal, on the **Configure single sign-on at Kintone** dialog page, copy the **Remote Login URL** value, and then paste it into the **Login URL** textbox.
    2.  In the Azure classic portal, on the **Configure single sign-on at Kintone** dialog page, copy the **Remote Logout URL** value, and then paste it into the **Logout URL** textbox.
    3.  Click **Browse** to upload your downloaded certificate.
    4.  Click **Save**.

11. On the Azure classic portal, select the single sign-on configuration confirmation, and then click **Complete** to close the **Configure Single Sign On** dialog.

    ![Configure Single Sign-On](./media/active-directory-saas-kintone-tutorial/IC785884.png "Configure Single Sign-On")
##Configuring user provisioning
  
In order to enable Azure AD users to log into Kintone, they must be provisioned into Kintone.  
In the case of Kintone, provisioning is a manual task.

###To provision a user accounts, perform the following steps:

1.  Log in to your **Kintone** company site as an administrator.

2.  Click **Setting**.

    ![Settings](./media/active-directory-saas-kintone-tutorial/IC785879.png "Settings")

3.  Click **Users & System Administration**.

    ![User & System Administration](./media/active-directory-saas-kintone-tutorial/IC785880.png "User & System Administration")

4.  Under **User Administration**, click **Departments & Users**.

    ![Department & Users](./media/active-directory-saas-kintone-tutorial/IC785888.png "Department & Users")

5.  Click **New User**.

    ![New Users](./media/active-directory-saas-kintone-tutorial/IC785889.png "New Users")

6.  In the **New User** section, perform the following steps:

    ![New Users](./media/active-directory-saas-kintone-tutorial/IC785890.png "New Users")

    1.  Type a **Display Name**, **Login Name**, **New Password**, **Confirm Password**, **E-mail Address** and other details of a valid AAD account you want to provision into the related texboxes.
    2.  Click **Save**.

>[AZURE.NOTE] You can use any other Kintone user account creation tools or APIs provided by Kintone to provision AAD user accounts.

##Assigning users
  
To test your configuration, you need to grant the Azure AD users you want to allow using your application access to it by assigning them.

###To assign users to Kintone, perform the following steps:

1.  In the Azure classic portal, create a test account.

2.  On the **Kintone **application integration page, click **Assign users**.

    ![Assign Users](./media/active-directory-saas-kintone-tutorial/IC785891.png "Assign Users")

3.  Select your test user, click **Assign**, and then click **Yes** to confirm your assignment.

    ![Yes](./media/active-directory-saas-kintone-tutorial/IC767830.png "Yes")
  
If you want to test your single sign-on settings, open the Access Panel. For more details about the Access Panel, see [Introduction to the Access Panel](active-directory-saas-access-panel-introduction.md).