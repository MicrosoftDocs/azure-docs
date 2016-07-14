<properties 
    pageTitle="Tutorial: Azure Active Directory integration with 15Five | Microsoft Azure" 
    description="Learn how to use 15Five with Azure Active Directory to enable single sign-on, automated provisioning, and more!" 
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
    ms.date="07/11/2016" 
    ms.author="jeedes" />

#Tutorial: Azure Active Directory integration with 15Five

The objective of this tutorial is to show the integration of Azure and 15Five. The scenario outlined in this tutorial assumes that you already have the following items:

-   A valid Azure subscription
-   A 15Five single sign-on enabled subscription

After completing this tutorial, the Azure AD users you have assigned to 15Five will be able to single sign into the application at your 15Five company site (service provider initiated sign on), or using the [Introduction to the Access Panel](active-directory-saas-access-panel-introduction.md).

The scenario outlined in this tutorial consists of the following building blocks:

1.  Enabling the application integration for 15Five
2.  Configuring single sign-on
3.  Configuring user provisioning
4.  Assigning users

![Scenario](./media/active-directory-saas-15five-tutorial/IC784667.png "Scenario")
##Enabling the application integration for 15Five

The objective of this section is to outline how to enable the application integration for 15Five.

###To enable the application integration for 15Five, perform the following steps:

1.  In the Azure classic portal, on the left navigation pane, click **Active Directory**.

    ![Active Directory](./media/active-directory-saas-15five-tutorial/IC700993.png "Active Directory")

2.  From the **Directory** list, select the directory for which you want to enable directory integration.

3.  To open the applications view, in the directory view, click **Applications** in the top menu.

    ![Applications](./media/active-directory-saas-15five-tutorial/IC700994.png "Applications")

4.  Click **Add** at the bottom of the page.

    ![Add application](./media/active-directory-saas-15five-tutorial/IC749321.png "Add application")

5.  On the **What do you want to do** dialog, click **Add an application from the gallery**.

    ![Add an application from gallerry](./media/active-directory-saas-15five-tutorial/IC749322.png "Add an application from gallerry")

6.  In the **search box**, type **15Five**.

    ![Application Gallery](./media/active-directory-saas-15five-tutorial/IC784668.png "Application Gallery")

7.  In the results pane, select **15Five**, and then click **Complete** to add the application.

    ![15Five](./media/active-directory-saas-15five-tutorial/IC784669.png "15Five")
##Configuring single sign-on

The objective of this section is to outline how to enable users to authenticate to 15Five with their account in Azure AD using federation based on the SAML protocol.

###To configure single sign-on, perform the following steps:

1.  In the Azure classic portal, on the **15Five** application integration page, click **Configure single sign-on** to open the **Configure Single Sign On ** dialog.

    ![Configure single sign-on](./media/active-directory-saas-15five-tutorial/IC784670.png "Configure single sign-on")

2.  On the **How would you like users to sign on to 15Five** page, select **Microsoft Azure AD Single Sign-On**, and then click **Next**.

    ![Configure single sign-on](./media/active-directory-saas-15five-tutorial/IC784671.png "Configure single sign-on")

3.  On the **Configure App URL** page, in the **15Five Sign In URL** textbox, type your URL using the following pattern "*https://company.15Five.com*", and then click **Next**.

    ![Configure App URL](./media/active-directory-saas-15five-tutorial/IC784672.png "Configure App URL")

4.  On the **Configure single sign-on at 15Five** page, click **Download metadata**, and then forward the metadata file to the 15Five support team.

    ![Configure single sign-on](./media/active-directory-saas-15five-tutorial/IC784673.png "Configure single sign-on")

    >[AZURE.NOTE] Single sign-on needs to be enabled by the 15Five support team.

5.  On the Azure classic portal, select the single sign-on configuration confirmation, and then click **Complete** to close the **Configure Single Sign On** dialog.

    ![Configure single sign-on](./media/active-directory-saas-15five-tutorial/IC784674.png "Configure single sign-on")
##Configuring user provisioning

In order to enable Azure AD users to log into 15Five, they must be provisioned into 15Five.  
In the case of 15Five, provisioning is a manual task.

###To configure user provisioning, perform the following steps:

1.  Log in to your **15Five** company site as administrator.

2.  Go to **Manage Company**.

    ![Manage Company](./media/active-directory-saas-15five-tutorial/IC784675.png "Manage Company")

3.  Go to **People \> Add People**.

    ![People](./media/active-directory-saas-15five-tutorial/IC784676.png "People")

4.  In the Add New Person section, perform the following steps:

    ![Add New Person](./media/active-directory-saas-15five-tutorial/IC784677.png "Add New Person")

    1.  Type the **First Name**, **Last Name**, **Title**, **Email address** of a valid Azure Active Directory account you want to provision into the related textboxes.
    2.  Click **Done**.

    >[AZURE.NOTE] The Azure AD account holder will receive an email including a link to confirm the account before it becomes active.

>[AZURE.NOTE] You can use any other 15Five user account creation tools or APIs provided by 15Five to provision AAD user accounts.

##Assigning users

To test your configuration, you need to grant the Azure AD users you want to allow using your application access to it by assigning them.

###To assign users to 15Five, perform the following steps:

1.  In the Azure classic portal, create a test account.

2.  On the **15Five **application integration page, click **Assign users**.

    ![Assign users](./media/active-directory-saas-15five-tutorial/IC784678.png "Assign users")

3.  Select your test user, click **Assign**, and then click **Yes** to confirm your assignment.

    ![Yes](./media/active-directory-saas-15five-tutorial/IC767830.png "Yes")

If you want to test your single sign-on settings, open the Access Panel. For more details about the Access Panel, see [Introduction to the Access Panel](active-directory-saas-access-panel-introduction.md).
