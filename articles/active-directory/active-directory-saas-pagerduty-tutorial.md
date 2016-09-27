<properties 
    pageTitle="Tutorial: Azure Active Directory Integration with Pagerduty | Microsoft Azure" 
    description="Learn how to use Pagerduty with Azure Active Directory to enable single sign-on, automated provisioning, and more!" 
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
    ms.date="07/08/2016" 
    ms.author="jeedes" />

#Tutorial: Azure Active Directory Integration with Pagerduty
  
The objective of this tutorial is to show the integration of Azure and Pagerduty.  
The scenario outlined in this tutorial assumes that you already have the following items:

-   A valid Azure subscription
-   A Pagerduty tenant
  
After completing this tutorial, the Azure AD users you have assigned to Pagerduty will be able to single sign into the application at your Pagerduty company site (service provider initiated sign on), or using the [Introduction to the Access Panel](active-directory-saas-access-panel-introduction.md).
  
The scenario outlined in this tutorial consists of the following building blocks:

1.  Enabling the application integration for Pagerduty
2.  Configuring single sign-on
3.  Configuring user provisioning
4.  Assigning users

![Scenario](./media/active-directory-saas-pagerduty-tutorial/IC778528.png "Scenario")
##Enabling the application integration for Pagerduty
  
The objective of this section is to outline how to enable the application integration for Pagerduty.

###To enable the application integration for Pagerduty, perform the following steps:

1.  In the Azure Management Portal, on the left navigation pane, click **Active Directory**.

    ![Active Directory](./media/active-directory-saas-pagerduty-tutorial/IC700993.png "Active Directory")

2.  From the **Directory** list, select the directory for which you want to enable directory integration.

3.  To open the applications view, in the directory view, click **Applications** in the top menu.

    ![Applications](./media/active-directory-saas-pagerduty-tutorial/IC700994.png "Applications")

4.  Click **Add** at the bottom of the page.

    ![Add application](./media/active-directory-saas-pagerduty-tutorial/IC749321.png "Add application")

5.  On the **What do you want to do** dialog, click **Add an application from the gallery**.

    ![Add an application from gallerry](./media/active-directory-saas-pagerduty-tutorial/IC749322.png "Add an application from gallerry")

6.  In the **search box**, type **Pagerduty**.

    ![Application gallery](./media/active-directory-saas-pagerduty-tutorial/IC778529.png "Application gallery")

7.  In the results pane, select **Pagerduty**, and then click **Complete** to add the application.

    ![PagerDuty](./media/active-directory-saas-pagerduty-tutorial/IC778530.png "PagerDuty")
##Configuring single sign-on
  
The objective of this section is to outline how to enable users to authenticate to Pagerduty with their account in Azure AD using federation based on the SAML protocol.  
As part of this procedure, you are required to create a base-64 encoded certificate file.  
If you are not familiar with this procedure, see [How to convert a binary certificate into a text file](http://youtu.be/PlgrzUZ-Y1o).

###To configure single sign-on, perform the following steps:

1.  In the Azure classic portal, on the **Pagerduty** application integration page, click **Configure single sign-on** to open the **Configure Single Sign On ** dialog.

    ![Configure single sign-on](./media/active-directory-saas-pagerduty-tutorial/IC778531.png "Configure single sign-on")

2.  On the **How would you like users to sign on to Pagerduty** page, select **Microsoft Azure AD Single Sign-On**, and then click **Next**.

    ![Configure single sign-on](./media/active-directory-saas-pagerduty-tutorial/IC778532.png "Configure single sign-on")

3.  On the **Configure App URL** page, in the **Pagerduty Sign In URL** textbox, type your URL using the following pattern "*https://\<tenant-name\>.Pagerduty.com*", and then click **Next**.

    ![Configure app url](./media/active-directory-saas-pagerduty-tutorial/IC778533.png "Configure app url")

4.  On the **Configure single sign-on at Pagerduty** page, click **Download certificate**, and then save the certificate file on your computer.

    ![Configure single sign-on](./media/active-directory-saas-pagerduty-tutorial/IC778534.png "Configure single sign-on")

5.  In a different web browser window, log into your Pagerduty company site as an administrator.

6.  In the menu on the top, click **Account Settings**.

    ![Account Settings](./media/active-directory-saas-pagerduty-tutorial/IC778535.png "Account Settings")

7.  Click **single sign-on**.

    ![Single sign-on](./media/active-directory-saas-pagerduty-tutorial/IC778536.png "Single sign-on")

8.  On the Enable Single Sign-on (SSO) page, perform the following steps:

    ![Enable single sign-on](./media/active-directory-saas-pagerduty-tutorial/IC778537.png "Enable single sign-on")

    1.  Create a **base-64 encoded** file from your downloaded certificate.  

        >[AZURE.TIP] For more details, see [How to convert a binary certificate into a text file](http://youtu.be/PlgrzUZ-Y1o)

    2.  Open your base-64 encoded certificate in notepad, copy the content of it into your clipboard, and then paste it to the **X.509 Certificate** textbox
    3.  In the Azure classic portal, on the **Configure single sign-on at Pagerduty** dialogue page, copy the **Remote Login URL** value, and then paste it into the **Login URL** textbox.
    4.  In the Azure classic portal, on the **Configure single sign-on at Pagerduty** dialogue page, copy the **Remote Logout URL** value, and then paste it into the **Logout URL** textbox.
    5.  Select **Turn on Single Sign-on**.
    6.  Click **Save Changes**.

9.  On the Azure classic portal, select the single sign-on configuration confirmation, and then click **Complete** to close the **Configure Single Sign On** dialog.

    ![Configure single sign-on](./media/active-directory-saas-pagerduty-tutorial/IC778538.png "Configure single sign-on")
##Configuring user provisioning
  
In order to enable Azure AD users to log into Pagerduty, they must be provisioned into Pagerduty.  
In the case of Pagerduty, provisioning is a manual task.

###To provision a user accounts, perform the following steps:

1.  Log in to your **Pagerduty** tenant.

2.  In the menu on the top, click **Users**.

3.  Click **Add Users**.

    ![Add Users](./media/active-directory-saas-pagerduty-tutorial/IC778539.png "Add Users")

4.  On the **Invite your team** dialog, type the **First and Last Name** and the **Email** address of the Azure AD user you want to provision, click **Add**, and then click **Send Invites**.

    ![Invite your team](./media/active-directory-saas-pagerduty-tutorial/IC778540.png "Invite your team")

    >[AZURE.NOTE] All added users will receive an invite to create a PagerDuty account.

>[AZURE.NOTE] You can use any other Pagerduty user account creation tools or APIs provided by Pagerduty to provision AAD user accounts.

##Assigning users
  
To test your configuration, you need to grant the Azure AD users you want to allow using your application access to it by assigning them.

###To assign users to Pagerduty, perform the following steps:

1.  In the Azure classic portal, create a test account.

2.  On the **Pagerduty **application integration page, click **Assign users**.

    ![Assign users](./media/active-directory-saas-pagerduty-tutorial/IC778541.png "Assign users")

3.  Select your test user, click **Assign**, and then click **Yes** to confirm your assignment.

    ![Yes](./media/active-directory-saas-pagerduty-tutorial/IC767830.png "Yes")
  
If you want to test your single sign-on settings, open the Access Panel. For more details about the Access Panel, see [Introduction to the Access Panel](active-directory-saas-access-panel-introduction.md).