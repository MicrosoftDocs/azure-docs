<properties 
    pageTitle="Tutorial: Azure Active Directory integration with Wikispaces | Microsoft Azure" 
    description="Learn how to use Wikispaces with Azure Active Directory to enable single sign-on, automated provisioning, and more!." 
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
    ms.date="06/21/2016" 
    ms.author="jeedes" />

#Tutorial: Azure Active Directory integration with Wikispaces
  
The objective of this tutorial is to show the integration of Azure and Wikispaces.  
The scenario outlined in this tutorial assumes that you already have the following items:

-   A valid Azure subscription
-   A Wikispaces single sign-on enabled subscription
  
After completing this tutorial, the Azure AD users you have assigned to Wikispaces will be able to single sign into the application at your Wikispaces company site (service provider initiated sign on), or using the [Introduction to the Access Panel](active-directory-saas-access-panel-introduction.md).
  
The scenario outlined in this tutorial consists of the following building blocks:

1.  Enabling the application integration for Wikispaces
2.  Configuring single sign-on
3.  Configuring user provisioning
4.  Assigning users

![Sceanrio](./media/active-directory-saas-wikispaces-tutorial/IC787182.png "Sceanrio")

##Enabling the application integration for Wikispaces
  
The objective of this section is to outline how to enable the application integration for Wikispaces.

###To enable the application integration for Wikispaces, perform the following steps:

1.  In the Azure classic portal, on the left navigation pane, click **Active Directory**.

    ![Active Directory](./media/active-directory-saas-wikispaces-tutorial/IC700993.png "Active Directory")

2.  From the **Directory** list, select the directory for which you want to enable directory integration.

3.  To open the applications view, in the directory view, click **Applications** in the top menu.

    ![Applications](./media/active-directory-saas-wikispaces-tutorial/IC700994.png "Applications")

4.  Click **Add** at the bottom of the page.

    ![Add application](./media/active-directory-saas-wikispaces-tutorial/IC749321.png "Add application")

5.  On the **What do you want to do** dialog, click **Add an application from the gallery**.

    ![Add an application from gallerry](./media/active-directory-saas-wikispaces-tutorial/IC749322.png "Add an application from gallerry")

6.  In the **search box**, type **Wikispaces**.

    ![Application Gallery](./media/active-directory-saas-wikispaces-tutorial/IC787186.png "Application Gallery")

7.  In the results pane, select **Wikispaces**, and then click **Complete** to add the application.

    ![Wikispaces](./media/active-directory-saas-wikispaces-tutorial/IC787187.png "Wikispaces")

##Configuring single sign-on
  
The objective of this section is to outline how to enable users to authenticate to Wikispaces with their account in Azure AD using federation based on the SAML protocol.

###To configure single sign-on, perform the following steps:

1.  In the Azure classic portal, on the **Wikispaces** application integration page, click **Configure single sign-on** to open the **Configure Single Sign On ** dialog.

    ![Configure Single Sign-On](./media/active-directory-saas-wikispaces-tutorial/IC787188.png "Configure Single Sign-On")

2.  On the **How would you like users to sign on to Wikispaces** page, select **Microsoft Azure AD Single Sign-On**, and then click **Next**.

    ![Configure Single Sign-On](./media/active-directory-saas-wikispaces-tutorial/IC787189.png "Configure Single Sign-On")

3.  On the **Configure App URL** page, in the **Wikispaces Sign On URL** textbox, type your URL using the following pattern "*http://company.wikispaces.net*", and then click **Next**.

    ![Configure App URL](./media/active-directory-saas-wikispaces-tutorial/IC787190.png "Configure App URL")

4.  On the **Configure single sign-on at Wikispaces** page, click **Download metadata**, and then save the metadata file on your computer.

    ![Configure Single Sign-On](./media/active-directory-saas-wikispaces-tutorial/IC787191.png "Configure Single Sign-On")

5.  Send the metadatafile to the Wikispaces support team.

    >[AZURE.NOTE] The single sign-on configuration has to be performed by the Wikispaces support team. You will get a notification as soon as the configuration has been completed.

6.  On the Azure classic portal, select the single sign-on configuration confirmation, and then click **Complete** to close the **Configure Single Sign On** dialog.

    ![Configure Single Sign-On](./media/active-directory-saas-wikispaces-tutorial/IC787192.png "Configure Single Sign-On")

##Configuring user provisioning
  
In order to enable Azure AD users to log into Wikispaces, they must be provisioned into Wikispaces.  
In the case of Wikispaces, provisioning is a manual task.

###To provision a user accounts, perform the following steps:

1.  Log in to your **Wikispaces** company site as an administrator.

2.  Go to **Members**.

    ![Members](./media/active-directory-saas-wikispaces-tutorial/IC787193.png "Members")

3.  Click the **Invite People**.

    ![Invite People](./media/active-directory-saas-wikispaces-tutorial/IC787194.png "Invite People")

4.  In the **Invite People** section, perform the following steps:

    ![Invite People](./media/active-directory-saas-wikispaces-tutorial/IC787208.png "Invite People")

    1.  Type the **Usernames or Email Address** of a valid AAD account you want to provision into the related textboxes.
    2.  Click **Send**.  

        >[AZURE.NOTE] The Azure Active Directory account holder receives an email including a link to confirm the account before it becomes active.

>[AZURE.NOTE] You can use any other Wikispaces user account creation tools or APIs provided by Wikispaces to provision AAD user accounts.

##Assigning users
  
To test your configuration, you need to grant the Azure AD users you want to allow using your application access to it by assigning them.

###To assign users to Wikispaces, perform the following steps:

1.  In the Azure classic portal, create a test account.

2.  On the **Wikispaces **application integration page, click **Assign users**.

    ![Assign Users](./media/active-directory-saas-wikispaces-tutorial/IC787195.png "Assign Users")

3.  Select your test user, click **Assign**, and then click **Yes** to confirm your assignment.

    ![Yes](./media/active-directory-saas-wikispaces-tutorial/IC767830.png "Yes")
  
If you want to test your single sign-on settings, open the Access Panel. For more details about the Access Panel, see [Introduction to the Access Panel](active-directory-saas-access-panel-introduction.md).