<properties 
    pageTitle="Tutorial: Azure Active Directory integration with Cherwell | Microsoft Azure" 
    description="Learn how to use Cherwell with Azure Active Directory to enable single sign-on, automated provisioning, and more!" 
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
    ms.date="07/27/2016" 
    ms.author="jeedes" />

#Tutorial: Azure Active Directory integration with Cherwell

The objective of this tutorial is to show the integration of Azure and Cherwell. The scenario outlined in this tutorial assumes that you already have the following items:

-   A valid Azure subscription
-   A Cherwell single sign-on enabled subscription

After completing this tutorial, the Azure AD users you have assigned to Cherwell will be able to single sign into the application at your Cherwell company site (service provider initiated sign on), or using the [Introduction to the Access Panel](active-directory-saas-access-panel-introduction.md).

The scenario outlined in this tutorial consists of the following building blocks:

1.  Enabling the application integration for Cherwell
2.  Configuring single sign-on
3.  Configuring user provisioning
4.  Assigning users

![Scenario](./media/active-directory-saas-cherwell-tutorial/IC798988.png "Scenario")
##Enabling the application integration for Cherwell

The objective of this section is to outline how to enable the application integration for Cherwell.

###To enable the application integration for Cherwell, perform the following steps:

1.  In the Azure classic portal, on the left navigation pane, click **Active Directory**.

    ![Active Directory](./media/active-directory-saas-cherwell-tutorial/IC700993.png "Active Directory")

2.  From the **Directory** list, select the directory for which you want to enable directory integration.

3.  To open the applications view, in the directory view, click **Applications** in the top menu.

    ![Applications](./media/active-directory-saas-cherwell-tutorial/IC700994.png "Applications")

4.  Click **Add** at the bottom of the page.

    ![Add application](./media/active-directory-saas-cherwell-tutorial/IC749321.png "Add application")

5.  On the **What do you want to do** dialog, click **Add an application from the gallery**.

    ![Add an application from gallerry](./media/active-directory-saas-cherwell-tutorial/IC749322.png "Add an application from gallerry")

6.  In the **search box**, type **Cherwell**.

    ![Cherwell](./media/active-directory-saas-cherwell-tutorial/IC798989.png "Cherwell")

7.  In the results pane, select **Cherwell**, and then click **Complete** to add the application.
##Configuring single sign-on

	![Cherwell](./media/active-directory-saas-cherwell-tutorial/IC798996.png "Cherwell")

The objective of this section is to outline how to enable users to authenticate to Cherwell with their account in Azure AD using federation based on the SAML protocol.

###To configure single sign-on, perform the following steps:

1.  In the Azure classic portal, on the **Cherwell** application integration page, click **Configure single sign-on** to open the **Configure Single Sign On ** dialog.

    ![Configure Single Sign-On](./media/active-directory-saas-cherwell-tutorial/IC798990.png "Configure Single Sign-On")

2.  On the **How would you like users to sign on to Cherwell** page, select **Microsoft Azure AD Single Sign-On**, and then click **Next**.

    ![Configure Single Sign-On](./media/active-directory-saas-cherwell-tutorial/IC798991.png "Configure Single Sign-On")

3.  On the **Configure App URL** page, perform the following steps:

    ![Configure App URL](./media/active-directory-saas-cherwell-tutorial/IC798992.png "Configure App URL")

    a.  In the **Sign On URL** textbox, type the URL used by your users to sign into your **Cherwell** (e.g.: *https://\<company name\>.cherwellondemand.com/cherwellclient*).

    b.  Click **Next**

4.  On the **Configure single sign-on at Cherwell** page, perform the following steps:

    ![Configure Single Sign-On](./media/active-directory-saas-cherwell-tutorial/IC798993.png "Configure Single Sign-On")

    a.  Click **Download certificate**, and then save the certificate locally on your computer.

    b.  Copy the **Identity Provider URL**.

    c.  Copy the **Single Sign-On Service URL**.

    d.  Click **Next**.

5.  Submit the downloaded certificate, the **Identity Provider URL** and the **Single Sign-On Service URL** to your Cherwell support team.

    >[AZURE.NOTE] Your Cherwell support team has to do the actual SSO configuration.
    You will get a notification when SSO has been enabled for your subscription.

6.  On the Azure classic portal, select the single sign-on configuration confirmation, and then click **Complete** to close the **Configure Single Sign On** dialog.

    ![Configure Single Sign-On](./media/active-directory-saas-cherwell-tutorial/IC798994.png "Configure Single Sign-On")

##Configuring user provisioning

In order to enable Azure AD users to log into Cherwell, they must be provisioned into Cherwell.  
In the case of Cherwell, the user accounts need to be created by your Cherwell support team.

>[AZURE.NOTE] You can use any other Cherwell user account creation tools or APIs provided by Cherwell to provision Azure Active Directory user accounts.

##Assigning users

To test your configuration, you need to grant the Azure AD users you want to allow using your application access to it by assigning them.

###To assign users to Cherwell, perform the following steps:

1.  In the Azure classic portal, create a test account.

2.  On the **Cherwell** application integration page, click **Assign users**.

    ![Assign Users](./media/active-directory-saas-cherwell-tutorial/IC798995.png "Assign Users")

3.  Select your test user, click **Assign**, and then click **Yes** to confirm your assignment.

    ![Yes](./media/active-directory-saas-cherwell-tutorial/IC767830.png "Yes")

If you want to test your single sign-on settings, open the Access Panel. For more details about the Access Panel, see [Introduction to the Access Panel](active-directory-saas-access-panel-introduction.md).
