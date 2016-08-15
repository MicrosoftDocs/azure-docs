<properties 
    pageTitle="Tutorial: Azure Active Directory integration with TOPdesk - Public | Microsoft Azure" 
    description="Learn how to use TOPdesk - Public with Azure Active Directory to enable single sign-on, automated provisioning, and more!" 
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

#Tutorial: Azure Directory integration with TOPdesk - Public

The objective of this tutorial is to show the integration of Azure and TOPdesk - Public.  
The scenario outlined in this tutorial assumes that you already have the following items:

-   A valid Azure subscription
-   A TOPdesk - Public single sign-on enabled subscription
  
After completing this tutorial, the Azure AD users you have assigned to TOPdesk - Public will be able to single sign into the application at your TOPdesk - Public company site (service provider initiated sign on), or using the [Introduction to the Access Panel](active-directory-saas-access-panel-introduction.md).
  
The scenario outlined in this tutorial consists of the following building blocks:

1.  Enabling the application integration for TOPdesk - Public
2.  Configuring single sign-on
3.  Configuring user provisioning
4.  Assigning users

![Scenario](./media/active-directory-saas-topdesk-public-tutorial/IC790613.png "Scenario")

##Enabling the application integration for TOPdesk - Public
  
The objective of this section is to outline how to enable the application integration for TOPdesk - Public.

###To enable the application integration for TOPdesk - Public, perform the following steps:

1.  In the Azure classic portal, on the left navigation pane, click **Active Directory**.

    ![Active Directory](./media/active-directory-saas-topdesk-public-tutorial/IC700993.png "Active Directory")

2.  From the **Directory** list, select the directory for which you want to enable directory integration.

3.  To open the applications view, in the directory view, click **Applications** in the top menu.

    ![Applications](./media/active-directory-saas-topdesk-public-tutorial/IC700994.png "Applications")

4.  Click **Add** at the bottom of the page.

    ![Add application](./media/active-directory-saas-topdesk-public-tutorial/IC749321.png "Add application")

5.  On the **What do you want to do** dialog, click **Add an application from the gallery**.

    ![Add an application from gallerry](./media/active-directory-saas-topdesk-public-tutorial/IC749322.png "Add an application from gallerry")

6.  In the **search box**, type **TOPdesk - Public**.

    ![Application Gallery](./media/active-directory-saas-topdesk-public-tutorial/IC790614.png "Application Gallery")

7.  In the results pane, select **TOPdesk - Public**, and then click **Complete** to add the application.

    ![TOPdesk Public](./media/active-directory-saas-topdesk-public-tutorial/IC791317.png "TOPdesk Public")

##Configuring single sign-on
  
The objective of this section is to outline how to enable users to authenticate to TOPdesk - Public with their account in Azure AD using federation based on the SAML protocol.  
Configuring single sign-on for TOPdesk - Public requires you to upload a logo icon file. To get the icon file, contact the TOPdesk support team.

###To configure single sign-on, perform the following steps:

1.  Sign on to your **TOPdesk - Public** company site as an administrator.

2.  In the **TOPdesk** menu, click **Settings**.

    ![Settings](./media/active-directory-saas-topdesk-public-tutorial/IC790598.png "Settings")

3.  Click **Login Settings**.

    ![Login Settings](./media/active-directory-saas-topdesk-public-tutorial/IC790599.png "Login Settings")

4.  Expand the **Login Settings** menu, and then click **General**.

    ![General](./media/active-directory-saas-topdesk-public-tutorial/IC790600.png "General")

5.  In the **Public** section of the **SAML login** configuration section, perform the following steps:

    ![Technical Settings](./media/active-directory-saas-topdesk-public-tutorial/IC790601.png "Technical Settings")

    1.  Click **Download** to download the public metadata file, and then save it locally on your computer.
    2.  Open the metadata file, and then locate the **AssertionConsumerService** node.
        ![AssertionConsumerService](./media/active-directory-saas-topdesk-public-tutorial/IC790619.png "AssertionConsumerService")
    3.  Copy the **AssertionConsumerService** value.  

        >[AZURE.NOTE] You will need the value in the **Configure App URL** section later in this tutorial.

6.  In a different web browser window, log into your **Azure classic portal** as an administrator.

7.  On the **TOPdesk - Public** application integration page, click **Configure single sign-on** to open the **Configure Single Sign On ** dialog.

    ![Configure Single Sign-On](./media/active-directory-saas-topdesk-public-tutorial/IC790620.png "Configure Single Sign-On")

8.  On the **How would you like users to sign on to TOPdesk - Public** page, select **Microsoft Azure AD Single Sign-On**, and then click **Next**.

    ![Configure Single Sign-On](./media/active-directory-saas-topdesk-public-tutorial/IC790621.png "Configure Single Sign-On")

9.  On the **Configure App URL** page, perform the following steps:

    ![Configure App URL](./media/active-directory-saas-topdesk-public-tutorial/IC790622.png "Configure App URL")

    1.  In the **TOPdesk - Public Sign On URL** textbox, type the URL used by your users to sign into your TOPdesk - Public application (e.g.: "*https://qssolutions.topdesk.net*").
    2.  In the **TOPdesk – Public Reply URL** textbox, paste the **TOPdesk - Public AssertionConsumerService URL** (e.g.: "*https://qssolutions.topdesk.net/tas/public/login/saml*")
    3.  Click **Next**.

10. On the **Configure single sign-on at TOPdesk - Public** page, to download your metadata file, click **Download metadata**, and then save the file locally on your computer.

    ![Configure Single Sign-On](./media/active-directory-saas-topdesk-public-tutorial/IC790623.png "Configure Single Sign-On")

11. To create a certificate file, perform the following steps:

    ![Certificate](./media/active-directory-saas-topdesk-public-tutorial/IC790606.png "Certificate")

    1.  Open the downloaded metadata file.
    2.  Expand the **RoleDescriptor** node that has a **xsi:type** of **fed:ApplicationServiceType**.
    3.  Copy the value of the **X509Certificate** node.
    4.  Save the copied **X509Certificate** value locally on your computer in a file.

12. On your TOPdesk - Public company site, in the **TOPdesk** menu, click **Settings**.

    ![Settings](./media/active-directory-saas-topdesk-public-tutorial/IC790598.png "Settings")

13. Click **Login Settings**.

    ![Login Settings](./media/active-directory-saas-topdesk-public-tutorial/IC790599.png "Login Settings")

14. Expand the **Login Settings** menu, and then click **General**.

    ![General](./media/active-directory-saas-topdesk-public-tutorial/IC790600.png "General")

15. In the **Public** section, click **Add**.

    ![SAML Login](./media/active-directory-saas-topdesk-public-tutorial/IC790625.png "SAML Login")

16. On the **SAML configuration assistant** dialog page, perform the following steps:

    ![SAML Configuration Assistant](./media/active-directory-saas-topdesk-public-tutorial/IC790608.png "SAML Configuration Assistant")

    1.  To upload your downloaded metadata file, under **Federation Metadata**, click **Browse**.
    2.  To upload your certificate file, under **Certificate (RSA)**, click **Browse**.
    3.  To upload the logo file you got from the TOPdesk support team, under **Logo icon**, click **Browse**.
    4.  In the **User name attribute** textbox, type **http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress**.
    5.  In the **Display name** textbox, type a name for your configuration.
    6.  Click **Save**.

17. On the Azure classic portal, select the single sign-on configuration confirmation, and then click **Complete** to close the **Configure Single Sign On** dialog.

    ![Configure Single Sign-On](./media/active-directory-saas-topdesk-public-tutorial/IC790627.png "Configure Single Sign-On")

##Configuring user provisioning
  
In order to enable Azure AD users to log into TOPdesk - Public, they must be provisioned into TOPdesk - Public.  
In the case of TOPdesk - Public, provisioning is a manual task.

###To configure user provisioning, perform the following steps:

1.  Sign on to your **TOPdesk - Public** company site as administrator.

2.  In the menu on the top, click **TOPdesk \> New \> Support Files \> Person**.

    ![Person](./media/active-directory-saas-topdesk-public-tutorial/IC790628.png "Person")

3.  On the New Person dialog, perform the following steps:

    ![New Person](./media/active-directory-saas-topdesk-public-tutorial/IC790629.png "New Person")

    1.  Click the General tab.
    2.  In the Surname textbox, type the last name of a valid Azure Active Directory account you want to provision.
    3.  Select a **Site** for the account.
    4.  Click **Save**.

>[AZURE.NOTE] You can use any other TOPdesk - Public user account creation tools or APIs provided by TOPdesk - Public to provision AAD user accounts.

##Assigning users
  
To test your configuration, you need to grant the Azure AD users you want to allow using your application access to it by assigning them.

###To assign users to TOPdesk - Public, perform the following steps:

1.  In the Azure classic portal, create a test account.

2.  On the **TOPdesk - Public **application integration page, click **Assign users**.

    ![Assign Users](./media/active-directory-saas-topdesk-public-tutorial/IC790630.png "Assign Users")

3.  Select your test user, click **Assign**, and then click **Yes** to confirm your assignment.

    ![Yes](./media/active-directory-saas-topdesk-public-tutorial/IC767830.png "Yes")
  
If you want to test your single sign-on settings, open the Access Panel. For more details about the Access Panel, see [Introduction to the Access Panel](active-directory-saas-access-panel-introduction.md).