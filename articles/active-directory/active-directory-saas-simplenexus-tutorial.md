<properties 
    pageTitle="Tutorial: Azure Active Directory integration with SimpleNexus | Microsoft Azure" 
    description="Learn how to use SimpleNexus with Azure Active Directory to enable single sign-on, automated provisioning, and more!" 
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
    ms.date="06/29/2016" 
    ms.author="jeedes" />

#Tutorial: Azure Active Directory integration with SimpleNexus
  
The objective of this tutorial is to show the integration of Azure and SimpleNexus.  
The scenario outlined in this tutorial assumes that you already have the following items:

-   A valid Azure subscription
-   A SimpleNexus single sign-on enabled subscription
  
After completing this tutorial, the Azure AD users you have assigned to SimpleNexus will be able to single sign into the application at your SimpleNexus company site (service provider initiated sign on), or using the [Introduction to the Access Panel](active-directory-saas-access-panel-introduction.md).
  
The scenario outlined in this tutorial consists of the following building blocks:

1.  Enabling the application integration for SimpleNexus
2.  Configuring single sign-on
3.  Configuring user provisioning
4.  Assigning users

![Scenario](./media/active-directory-saas-simplenexus-tutorial/IC785893.png "Scenario")
##Enabling the application integration for SimpleNexus
  
The objective of this section is to outline how to enable the application integration for SimpleNexus.

###To enable the application integration for SimpleNexus, perform the following steps:

1.  In the Azure classic portal, on the left navigation pane, click **Active Directory**.

    ![Active Directory](./media/active-directory-saas-simplenexus-tutorial/IC700993.png "Active Directory")

2.  From the **Directory** list, select the directory for which you want to enable directory integration.

3.  To open the applications view, in the directory view, click **Applications** in the top menu.

    ![Applications](./media/active-directory-saas-simplenexus-tutorial/IC700994.png "Applications")

4.  Click **Add** at the bottom of the page.

    ![Add application](./media/active-directory-saas-simplenexus-tutorial/IC749321.png "Add application")

5.  On the **What do you want to do** dialog, click **Add an application from the gallery**.

    ![Add an application from gallerry](./media/active-directory-saas-simplenexus-tutorial/IC749322.png "Add an application from gallerry")

6.  In the **search box**, type **simple nexus**.

    ![Application Gallery](./media/active-directory-saas-simplenexus-tutorial/IC785894.png "Application Gallery")

7.  In the results pane, select **SimpleNexus**, and then click **Complete** to add the application.

    ![Simple Nexus](./media/active-directory-saas-simplenexus-tutorial/IC809578.png "Simple Nexus")
##Configuring single sign-on
  
The objective of this section is to outline how to enable users to authenticate to SimpleNexus with their account in Azure AD using federation based on the SAML protocol.

###To configure single sign-on, perform the following steps:

1.  In the Azure classic portal, on the **SimpleNexus** application integration page, click **Configure single sign-on** to open the **Configure Single Sign On ** dialog.

    ![Configure Single Sign-On](./media/active-directory-saas-simplenexus-tutorial/IC785896.png "Configure Single Sign-On")

2.  On the **How would you like users to sign on to SimpleNexus** page, select **Microsoft Azure AD Single Sign-On**, and then click **Next**.

    ![Configure Single Sign-On](./media/active-directory-saas-simplenexus-tutorial/IC785897.png "Configure Single Sign-On")

3.  On the **Configure App URL** page, in the **SimpleNexus Sign In URL** textbox, type your URL using the following pattern "*https://simplenexus.com/CompanyName\_login*", and then click **Next**.

    ![Configure App URL](./media/active-directory-saas-simplenexus-tutorial/IC786904.png "Configure App URL")

4.  On the **Configure single sign-on at SimpleNexus** page, click **Download metadata**, and then forward the metadata file to the SimpleNexus support team.

    ![Configure Single Sign-On](./media/active-directory-saas-simplenexus-tutorial/IC785899.png "Configure Single Sign-On")

    >[AZURE.NOTE] Single sign-on needs to be enabled by the SimpleNexus support team.

5.  On the Azure classic portal, select the single sign-on configuration confirmation, and then click **Complete** to close the **Configure Single Sign On** dialog.

    ![Configure Single Sign-On](./media/active-directory-saas-simplenexus-tutorial/IC785900.png "Configure Single Sign-On")
##Configuring user provisioning
  
In order to enable Azure AD users to log into SimpleNexus, they must be provisioned into SimpleNexus.  
In the case of SimpleNexus, provisioning is a manual task performed by the tenant administrator.

>[AZURE.NOTE] You can use any other SimpleNexus user account creation tools or APIs provided by SimpleNexus to provision AAD user accounts.

##Assigning users
  
To test your configuration, you need to grant the Azure AD users you want to allow using your application access to it by assigning them.

###To assign users to SimpleNexus, perform the following steps:

1.  In the Azure classic portal, create a test account.

2.  On the **SimpleNexus **application integration page, click **Assign users**.

    ![Assign Users](./media/active-directory-saas-simplenexus-tutorial/IC785901.png "Assign Users")

3.  Select your test user, click **Assign**, and then click **Yes** to confirm your assignment.

    ![Yes](./media/active-directory-saas-simplenexus-tutorial/IC767830.png "Yes")
  
If you want to test your single sign-on settings, open the Access Panel. For more details about the Access Panel, see [Introduction to the Access Panel](active-directory-saas-access-panel-introduction.md).