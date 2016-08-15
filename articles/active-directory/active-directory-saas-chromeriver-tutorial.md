<properties 
    pageTitle="Tutorial: Azure Active Directory integration with Chromeriver | Microsoft Azure" 
    description="Learn how to use Chromeriver with Azure Active Directory to enable single sign-on, automated provisioning, and more!" 
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


#Tutorial: Azure Active Directory integration with Chromeriver

The objective of this tutorial is to show the integration of Azure and Chromeriver.  
The scenario outlined in this tutorial assumes that you already have the following items:

-   A valid Azure subscription
-   A Chromeriver single sign-on enabled subscription

After completing this tutorial, the Azure AD users you have assigned to Chromeriver will be able to single sign into the application at your Chromeriver company site (service provider initiated sign on), or using the [Introduction to the Access Panel](active-directory-saas-access-panel-introduction.md).

The scenario outlined in this tutorial consists of the following building blocks:

1.  Enabling the application integration for Chromeriver
2.  Configuring single sign-on
3.  Configuring user provisioning
4.  Assigning users

![Scenario](./media/active-directory-saas-chromeriver-tutorial/IC802755.png "Scenario")
##Enabling the application integration for Chromeriver

The objective of this section is to outline how to enable the application integration for Chromeriver.

###To enable the application integration for Chromeriver, perform the following steps:

1.  In the Azure classic portal, on the left navigation pane, click **Active Directory**.

    ![Active Directory](./media/active-directory-saas-chromeriver-tutorial/IC700993.png "Active Directory")

2.  From the **Directory** list, select the directory for which you want to enable directory integration.

3.  To open the applications view, in the directory view, click **Applications** in the top menu.

    ![Applications](./media/active-directory-saas-chromeriver-tutorial/IC700994.png "Applications")

4.  Click **Add** at the bottom of the page.

    ![Add application](./media/active-directory-saas-chromeriver-tutorial/IC749321.png "Add application")

5.  On the **What do you want to do** dialog, click **Add an application from the gallery**.

    ![Add an application from gallerry](./media/active-directory-saas-chromeriver-tutorial/IC749322.png "Add an application from gallerry")

6.  In the **search box**, type **Chromeriver**.

    ![Application Gallery](./media/active-directory-saas-chromeriver-tutorial/IC802756.png "Application Gallery")

7.  In the results pane, select **Chromeriver**, and then click **Complete** to add the application.
##Configuring single sign-on

The objective of this section is to outline how to enable users to authenticate to Chromeriver with their account in Azure AD using federation based on the SAML protocol.

###To configure single sign-on, perform the following steps:

1.  In the Azure classic portal, on the **Chromeriver** application integration page, click **Configure single sign-on** to open the **Configure Single Sign On ** dialog.

    ![Configure Single Sign-On](./media/active-directory-saas-chromeriver-tutorial/IC802757.png "Configure Single Sign-On")

2.  On the **How would you like users to sign on to Chromeriver** page, select **Microsoft Azure AD Single Sign-On**, and then click **Next**.

    ![Configure Single Sign-On](./media/active-directory-saas-chromeriver-tutorial/IC802758.png "Configure Single Sign-On")

3.  On the **Configure App Settings** page, perform the following steps:

    ![Configure App Settings](./media/active-directory-saas-chromeriver-tutorial/IC802759.png "Configure App Settings")

    1.  In the **Reply URL** textbox, type your Chromeriver **AssertionConsumerService URL** (e.g.: *https://qa-app.chromeriver.com/login/sso/saml/consume?customerId=911*).  

        >[AZURE.NOTE] You can get this value from your Chromeriver support team.

    2.  Click **Next**

4.  On the **Configure single sign-on at Chromeriver** page, to download your metadata, click **Download metadata**, and then save the metadata file on your computer.

    ![Configure Single Sign-On](./media/active-directory-saas-chromeriver-tutorial/IC802760.png "Configure Single Sign-On")

5.  Send the downloaded metadata file to your Chromeriver support team.

    >[AZURE.NOTE] Your Chromeriver support team has to do the actual SSO configuration.  
    You will get a notification when SSO has been enabled for your subscription.

6.  On the Azure classic portal, select the single sign-on configuration confirmation, and then click **Complete** to close the **Configure Single Sign On** dialog.

    ![Configure Single Sign-On](./media/active-directory-saas-chromeriver-tutorial/IC802761.png "Configure Single Sign-On")
##Configuring user provisioning

In order to enable Azure AD users to log into Chromeriver, they must be provisioned into Chromeriver.  
In the case of Chromeriver, the user accounts need to be created by your Chromeriver support team.

>[AZURE.NOTE] You can use any other Chromeriver user account creation tools or APIs provided by Chromeriver to provision Azure Active Directory user accounts.

##Assigning users

To test your configuration, you need to grant the Azure AD users you want to allow using your application access to it by assigning them.

###To assign users to Chromeriver, perform the following steps:

1.  In the Azure classic portal, create a test account.

2.  On the **Chromeriver **application integration page, click **Assign users**.

    ![Assign Users](./media/active-directory-saas-chromeriver-tutorial/IC802762.png "Assign Users")

3.  Select your test user, click **Assign**, and then click **Yes** to confirm your assignment.

    ![Yes](./media/active-directory-saas-chromeriver-tutorial/IC767830.png "Yes")

If you want to test your single sign-on settings, open the Access Panel. For more details about the Access Panel, see [Introduction to the Access Panel](active-directory-saas-access-panel-introduction.md).
