<properties 
    pageTitle="Tutorial: Azure Active Directory integration with Innotas | Microsoft Azure"
    description="Learn how to use Innotas with Azure Active Directory to enable single sign-on, automated provisioning, and more!" 
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
    ms.date="07/09/2016" 
    ms.author="jeedes" />

#Tutorial: Azure Active Directory integration with Innotas
  
The objective of this tutorial is to show the integration of Azure and Innotas.  
The scenario outlined in this tutorial assumes that you already have the following items:

-   A valid Azure subscription
-   A Innotas tenant
  
After completing this tutorial, the Azure AD users you have assigned to Innotas will be able to single sign into the application at your Innotas company site (service provider initiated sign on), or using the [Introduction to the Access Panel](active-directory-saas-access-panel-introduction.md).
  
The scenario outlined in this tutorial consists of the following building blocks:

1.  Enabling the application integration for Innotas
2.  Configuring single sign-on
3.  Configuring user provisioning
4.  Assigning users

![Scenario](./media/active-directory-saas-innotas-tutorial/IC777331.png "Scenario")
##Enabling the application integration for Innotas
  
The objective of this section is to outline how to enable the application integration for Innotas.

###To enable the application integration for Innotas, perform the following steps:

1.  In the Azure classic portal, on the left navigation pane, click **Active Directory**.

    ![Active Directory](./media/active-directory-saas-innotas-tutorial/IC700993.png "Active Directory")

2.  From the **Directory** list, select the directory for which you want to enable directory integration.

3.  To open the applications view, in the directory view, click **Applications** in the top menu.

    ![Applications](./media/active-directory-saas-innotas-tutorial/IC700994.png "Applications")

4.  Click **Add** at the bottom of the page.

    ![Add application](./media/active-directory-saas-innotas-tutorial/IC749321.png "Add application")

5.  On the **What do you want to do** dialog, click **Add an application from the gallery**.

    ![Add an application from gallerry](./media/active-directory-saas-innotas-tutorial/IC749322.png "Add an application from gallerry")

6.  In the **search box**, type **Innotas**.

    ![Application gallery](./media/active-directory-saas-innotas-tutorial/IC777332.png "Application gallery")

7.  In the results pane, select **Innotas**, and then click **Complete** to add the application.

    ![Innotas](./media/active-directory-saas-innotas-tutorial/IC777333.png "Innotas")
##Configuring single sign-on
  
The objective of this section is to outline how to enable users to authenticate to Innotas with their account in Azure AD using federation based on the SAML protocol.

###To configure single sign-on, perform the following steps:

1.  In the Azure classic portal, on the **Innotas** application integration page, click **Configure single sign-on** to open the **Configure Single Sign On ** dialog.

    ![Configure single sign-on](./media/active-directory-saas-innotas-tutorial/IC777334.png "Configure single sign-on")

2.  On the **How would you like users to sign on to Innotas** page, select **Microsoft Azure AD Single Sign-On**, and then click **Next**.

    ![Configure single sign-on](./media/active-directory-saas-innotas-tutorial/IC777335.png "Configure single sign-on")

3.  On the **Configure App URL** page, in the **Innotas Sign In URL** textbox, type your URL using the following pattern "*https://\<tenant-name\>.Innotas.com*", and then click **Next**.

    ![Configure app URL](./media/active-directory-saas-innotas-tutorial/IC777336.png "Configure app URL")

4.  On the **Configure single sign-on at Innotas** page, to download your metadata, click **Download metadata**, and then the data file locally as **c:\\InnotasMetaData.xml**.

    ![Configure single sign-on](./media/active-directory-saas-innotas-tutorial/IC777337.png "Configure single sign-on")

5.  Forward that metadata file to Innotas support team. The support team needs configures single sign-on for you.

6.  Select the single sign-on configuration confirmation, and then click **Complete** to close the **Configure Single Sign On** dialog.

    ![Configure single sign-on](./media/active-directory-saas-innotas-tutorial/IC777338.png "Configure single sign-on")
##Configuring user provisioning
  
There is no action item for you to configure user provisioning to Innotas.  
When an assigned user tries to log into Innotas using the access panel, Innotas checks whether the user exists.  
If there is no user account available yet, it is automatically created by Innotas.
##Assigning users
  
To test your configuration, you need to grant the Azure AD users you want to allow using your application access to it by assigning them.

###To assign users to Innotas, perform the following steps:

1.  In the Azure classic portal, create a test account.

2.  On the **Innotas **application integration page, click **Assign users**.

    ![Assign users](./media/active-directory-saas-innotas-tutorial/IC777339.png "Assign users")

3.  Select your test user, click **Assign**, and then click **Yes** to confirm your assignment.

    ![Yes](./media/active-directory-saas-innotas-tutorial/IC767830.png "Yes")
  
If you want to test your single sign-on settings, open the Access Panel. For more details about the Access Panel, see [Introduction to the Access Panel](active-directory-saas-access-panel-introduction.md).