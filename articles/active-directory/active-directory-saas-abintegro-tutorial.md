<properties 
    pageTitle="Tutorial: Azure Active Directory integration with Abintegro | Microsoft Azure" 
    description="Learn how to use Abintegro with Azure Active Directory to enable single sign-on, automated provisioning, and more!" 
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

#Tutorial: Azure Active Directory integration with Abintegro

The objective of this tutorial is to show the integration of Azure and Abintegro.  
The scenario outlined in this tutorial assumes that you already have the following items:

-   A valid Azure subscription
-   An Abintegro single sign-on enabled subscription

After completing this tutorial, the Azure AD users you have assigned to Abintegro will be able to single sign into the application at your Abintegro company site (service provider initiated sign on), or using the [Introduction to the Access Panel](active-directory-saas-access-panel-introduction.md).

The scenario outlined in this tutorial consists of the following building blocks:

1.  Enabling the application integration for Abintegro
2.  Configuring single sign-on
3.  Configuring user provisioning
4.  Assigning users

![Scenario](./media/active-directory-saas-abintegro-tutorial/IC790076.png "Scenario")
##Enabling the application integration for Abintegro

The objective of this section is to outline how to enable the application integration for Abintegro.

###To enable the application integration for Abintegro, perform the following steps:

1.  In the Azure classic portal, on the left navigation pane, click **Active Directory**.

    ![Active Directory](./media/active-directory-saas-abintegro-tutorial/IC700993.png "Active Directory")

2.  From the **Directory** list, select the directory for which you want to enable directory integration.

3.  To open the applications view, in the directory view, click **Applications** in the top menu.

    ![Applications](./media/active-directory-saas-abintegro-tutorial/IC700994.png "Applications")

4.  Click **Add** at the bottom of the page.

    ![Add application](./media/active-directory-saas-abintegro-tutorial/IC749321.png "Add application")

5.  On the **What do you want to do** dialog, click **Add an application from the gallery**.

    ![Add an application from gallerry](./media/active-directory-saas-abintegro-tutorial/IC749322.png "Add an application from gallerry")

6.  In the **search box**, type **abintegro**.

    ![Application Gallery](./media/active-directory-saas-abintegro-tutorial/IC790077.png "Application Gallery")

7.  In the results pane, select **Abintegro**, and then click **Complete** to add the application.

    ![Abintegro](./media/active-directory-saas-abintegro-tutorial/IC790078.png "Abintegro")
##Configuring single sign-on

The objective of this section is to outline how to enable users to authenticate to Abintegro with their account in Azure AD using federation based on the SAML protocol.

###To configure single sign-on, perform the following steps:

1.  In the Azure classic portal, on the **Abintegro** application integration page, click **Configure single sign-on** to open the **Configure Single Sign On ** dialog.

    ![Configure Single SignOn](./media/active-directory-saas-abintegro-tutorial/IC790079.png "Configure Single SignOn")

2.  On the **How would you like users to sign on to Abintegro** page, select **Microsoft Azure AD Single Sign-On**, and then click **Next**.

    ![Configure Single SignOn](./media/active-directory-saas-abintegro-tutorial/IC790080.png "Configure Single SignOn")

3.  On the **Configure App URL** page, in the **Abintegro Sign On URL** textbox, type the URL used by your users to sign on to Abintegro (e.g.: `https://dev.abintegro.com/Shibboleth.sso/Login?entityID=<Issuer>&target=https://dev.abintegro.com/secure/`), and then click **Next**.

    ![Configure App URL](./media/active-directory-saas-abintegro-tutorial/IC790081.png "Configure App URL")

4.  On the **Configure single sign-on at Abintegro** page, click **Download metadata**, and then save the metadata file on your computer.

    ![Configure Single SignOn](./media/active-directory-saas-abintegro-tutorial/IC790082.png "Configure Single SignOn")

5.  Send the metadatafile to the Abintegro support team.

    >[AZURE.NOTE] The single sign-on configuration has to be performed by the Abintegro support team. You will get a notification as soon as the configuration has been completed.

6.  On the Azure classic portal, select the single sign-on configuration confirmation, and then click **Complete** to close the **Configure Single Sign On** dialog.

    ![Configure Single SignOn](./media/active-directory-saas-abintegro-tutorial/IC790083.png "Configure Single SignOn")
##Configuring user provisioning

There is no action item for you to configure user provisioning to Abintegro.  
When an assigned user tries to log into Abintegro using the access panel, Abintegro checks whether the user exists.  
If there is no user account available yet, it is automatically created by Abintegro.
##Assigning users

To test your configuration, you need to grant the Azure AD users you want to allow using your application access to it by assigning them.

###To assign users to Abintegro, perform the following steps:

1.  In the Azure classic portal, create a test account.

2.  On the **Abintegro **application integration page, click **Assign users**.

    ![Assign Users](./media/active-directory-saas-abintegro-tutorial/IC790084.png "Assign Users")

3.  Select your test user, click **Assign**, and then click **Yes** to confirm your assignment.

    ![Yes](./media/active-directory-saas-abintegro-tutorial/IC767830.png "Yes")

If you want to test your single sign-on settings, open the Access Panel. For more details about the Access Panel, see [Introduction to the Access Panel](active-directory-saas-access-panel-introduction.md).
