<properties 
    pageTitle="Tutorial: Azure Active Directory integration with Thoughtworks Mingle | Microsoft Azure" 
    description="Learn how to use Thoughtworks Mingle with Azure Active Directory to enable single sign-on, automated provisioning, and more!" 
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

#Tutorial: Azure Active Directory integration with Thoughtworks Mingle
  
The objective of this tutorial is to show the integration of Azure and Thoughtworks Mingle.  
The scenario outlined in this tutorial assumes that you already have the following items:

-   A valid Azure subscription
-   A Thoughtworks Mingle tenant
  
The scenario outlined in this tutorial consists of the following building blocks:

1.  Enabling the application integration for Thoughtworks Mingle
2.  Configuring single sign-on
3.  Configuring user provisioning
4.  Assigning users

![Scenario](./media/active-directory-saas-thoughtworks-mingle-tutorial/IC785150.png "Scenario")

##Enabling the application integration for Thoughtworks Mingle
  
The objective of this section is to outline how to enable the application integration for Thoughtworks Mingle.

###To enable the application integration for Thoughtworks Mingle, perform the following steps:

1.  In the Azure classic portal, on the left navigation pane, click **Active Directory**.

    ![Active Directory](./media/active-directory-saas-thoughtworks-mingle-tutorial/IC700993.png "Active Directory")

2.  From the **Directory** list, select the directory for which you want to enable directory integration.

3.  To open the applications view, in the directory view, click **Applications** in the top menu.

    ![Applications](./media/active-directory-saas-thoughtworks-mingle-tutorial/IC700994.png "Applications")

4.  Click **Add** at the bottom of the page.

    ![Add application](./media/active-directory-saas-thoughtworks-mingle-tutorial/IC749321.png "Add application")

5.  On the **What do you want to do** dialog, click **Add an application from the gallery**.

    ![Add an application from gallerry](./media/active-directory-saas-thoughtworks-mingle-tutorial/IC749322.png "Add an application from gallerry")

6.  In the **search box**, type **thoughtworks mingle**.

    ![Application Gallery](./media/active-directory-saas-thoughtworks-mingle-tutorial/IC785151.png "Application Gallery")

7.  In the results pane, select **Thoughtworks Mingle**, and then click **Complete** to add the application.

    ![Thoughtworks Mingle](./media/active-directory-saas-thoughtworks-mingle-tutorial/IC785152.png "Thoughtworks Mingle")

##Configuring single sign-on
  
The objective of this section is to outline how to enable users to authenticate to Thoughtworks Mingle with their account in Azure AD using federation based on the SAML protocol.  
As part of this procedure, you are required to upload a certificate to Thoughtworks Mingle.

###To configure single sign-on, perform the following steps:

1.  In the Azure classic portal, on the **Thoughtworks Mingle **application integration page, click **Configure single sign-on** to open the **Configure Single Sign On ** dialog.

    ![Configure single sign-on](./media/active-directory-saas-thoughtworks-mingle-tutorial/IC785153.png "Configure single sign-on")

2.  On the **How would you like users to sign on to Thoughtworks Mingle** page, select **Microsoft Azure AD Single Sign-On**, and then click **Next**.

    ![Configure single sign-on](./media/active-directory-saas-thoughtworks-mingle-tutorial/IC785154.png "Configure single sign-on")

3.  On the **Configure App URL** page, in the **Thoughtworks Mingle Tenant URL** textbox, type your URL using the following pattern "*http://company.mingle.thoughtworks.com*", and then click **Next**.

    ![Configure App URL](./media/active-directory-saas-thoughtworks-mingle-tutorial/IC785155.png "Configure App URL")

4.  On the **Configure single sign-on at Thoughtworks Mingle** page, click Download metadata, and then save it on your computer.

    ![Configure single sign-on](./media/active-directory-saas-thoughtworks-mingle-tutorial/IC785156.png "Configure single sign-on")

5.  Log in to your **Thoughtworks Mingle** company site as administrator.

6.  Click the **Admin** tab, and then, click **SSO Config**.

    ![SSO Config](./media/active-directory-saas-thoughtworks-mingle-tutorial/IC785157.png "SSO Config")

7.  In the **SSO Config** section, perform the following steps:

    ![SSO Config](./media/active-directory-saas-thoughtworks-mingle-tutorial/IC785158.png "SSO Config")

    1.  To upload the metadata file, click **Choose file**.
    2.  Click **Save Changes**.

8.  On the Azure classic portal, select the single sign-on configuration confirmation, and then click **Complete** to close the **Configure Single Sign On** dialog.

    ![Configure single sign-on](./media/active-directory-saas-thoughtworks-mingle-tutorial/IC785159.png "Configure single sign-on")

##Configuring user provisioning
  
For AAD users to be able to sign in, they must be provisioned to the Thoughtworks Mingle application using their Azure Active Directory user names.  
In the case of Thoughtworks Mingle, provisioning is a manual task.

###To configure user provisioning, perform the following steps:

1.  Log in to your Thoughtworks Mingle company site as administrator.

2.  Click **Profile**.

    ![Your First Project](./media/active-directory-saas-thoughtworks-mingle-tutorial/IC785160.png "Your First Project")

3.  Click the **Admin** tab, and then click **Users**.

    ![Users](./media/active-directory-saas-thoughtworks-mingle-tutorial/IC785161.png "Users")

4.  Click **New User**.

    ![New User](./media/active-directory-saas-thoughtworks-mingle-tutorial/IC785162.png "New User")

5.  On the **New User** dialog page, perform the following steps:

    ![New User](./media/active-directory-saas-thoughtworks-mingle-tutorial/IC785163.png "New User")

    1.  Type the **Sign-in name**, **Display name**, **Choose password**, **Confirm password** of a valid AAD account you want to provision into the related textboxes.
    2.  As **User type**, select **Full user**.
    3.  Click **Create This Profile**.

>[AZURE.NOTE] You can use any other Thoughtworks Mingle user account creation tools or APIs provided by Thoughtworks Mingle to provision AAD user accounts.

##Assigning users
  
To test your configuration, you need to grant the Azure AD users you want to allow using your application access to it by assigning them.

###To assign users to Thoughtworks Mingle, perform the following steps:

1.  In the Azure classic portal, create a test account.

2.  On the **Thoughtworks Mingle** application integration page, click **Assign users**.

    ![Assign Users](./media/active-directory-saas-thoughtworks-mingle-tutorial/IC785164.png "Assign Users")

3.  Select your test user, click **Assign**, and then click **Yes** to confirm your assignment.

    ![Yes](./media/active-directory-saas-thoughtworks-mingle-tutorial/IC767830.png "Yes")
  
If you want to test your single sign-on settings, open the Access Panel. For more details about the Access Panel, see [Introduction to the Access Panel](active-directory-saas-access-panel-introduction.md).
