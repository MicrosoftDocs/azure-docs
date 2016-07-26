<properties 
    pageTitle="Tutorial: Azure Active Directory integration with Salesforce Sandbox | Microsoft Azure"
    description="Learn how to use Salesforce Sandbox with Azure Active Directory to enable single sign-on, automated provisioning, and more!." 
    services="active-directory" 
    authors="jeevansd"  
    documentationCenter="na" 
    manager="stevenpo"/>

<tags 
    ms.service="active-directory" 
    ms.devlang="na" 
    ms.topic="article" 
    ms.tgt_pltfrm="na" 
    ms.workload="identity" 
    ms.date="05/19/2016" 
    ms.author="jeedes" />


#Tutorial: Azure Active Directory integration with Salesforce Sandbox
>[AZURE.TIP]For feedback, click [here](http://go.microsoft.com/fwlink/?LinkId=521878).
  
The objective of this tutorial is to show the integration of Azure and Salesforce Sandbox.  
Sandboxes give you the ability to create multiple copies of your organization in separate environments for a variety of purposes, such as development, testing, and training, without compromising the data and applications in your Salesforce production organization.  
For more details, see [Sandbox Overview](https://help.salesforce.com/HTViewHelpDoc?id=create_test_instance.htm&language=en_US)
  
The scenario outlined in this tutorial assumes that you already have the following items:

-   A valid Azure subscription
-   A sandbox in Salesforce.com
  
If you don’t have a valid sandbox in Salesforce.com yet, you need to contact Salesforce.
  
The scenario outlined in this tutorial consists of the following building blocks:

1.  Enabling the application integration for Salesforce Sandbox
2.  Configuring single sign-on
3.  Enabling your domain
4.  Configuring user provisioning
5.  Assigning users

![Scenario](./media/active-directory-saas-salesforce-sandbox-tutorial/IC769571.png "Scenario")
##Enabling the application integration for Salesforce Sandbox
  
The objective of this section is to outline how to enable the application integration for Salesforce sandbox.

###To enable the application integration for Salesforce sandbox, perform the following steps:

1.  In the Azure classic portal, on the left navigation pane, click **Active Directory**.

    ![Active Directory](./media/active-directory-saas-salesforce-sandbox-tutorial/IC700993.png "Active Directory")

2.  From the **Directory** list, select the directory for which you want to enable directory integration.

3.  To open the applications view, in the directory view, click **Applications** in the top menu.

    ![Applications](./media/active-directory-saas-salesforce-sandbox-tutorial/IC700994.png "Applications")

4.  To open the **Application Gallery**, click **Add An App**, and then click **Add an application for my organization to use**.

    ![What do you want to do?](./media/active-directory-saas-salesforce-sandbox-tutorial/IC700995.png "What do you want to do?")

5.  In the **search box**, type **Salesforce Sandbox**.

    ![Application Gallery](./media/active-directory-saas-salesforce-sandbox-tutorial/IC710978.png "Application Gallery")

6.  In the results pane, select **Salesforce Sandbox**, and then click **Complete** to add the application.

    ![Salesforce Sandbox](./media/active-directory-saas-salesforce-sandbox-tutorial/IC746474.png "Salesforce Sandbox")
##Configuring single sign-on
  
The objective of this section is to outline how to enable users to authenticate to Salesforce with their account in Azure AD using federation based on the SAML protocol.

###To configure single sign-on, perform the following steps:

1.  In the Azure classic portal, on the **Salesforce Sandbox** application integration page, click **Configure single sign-on** to open the **Configure Single Sign On** dialog.

    ![Configure single sign-on](./media/active-directory-saas-salesforce-sandbox-tutorial/IC749323.png "Configure single sign-on")

2.  On the **How would you like users to sign on to Salesforce Sandbox** page, select **Microsoft Azure AD Single Sign-On**, and then click **Next**.

    ![Salesforce Sandbox](./media/active-directory-saas-salesforce-sandbox-tutorial/IC746479.png "Salesforce Sandbox")

3.  On the **Configure App URL** page, in the **Sign On URL** textbox, type your URL using the following pattern `http://company.my.salesforce.com`, and then click **Next**.

    ![Configure App URL](./media/active-directory-saas-salesforce-sandbox-tutorial/IC781022.png "Configure App URL")

4. If you have already configured single sign-on for another Salesforce Sandbox instance in your directory, then you must also configure the **Identifier** to have the same value as the **Sign on URL**. The **Identifier** field can be found by checking the **Show advanced settings** checkbox on the **Configure App URL** page of the dialog.

4.  On the **Configure single sign-on at Salesforce Sandbox** page, click **Download certificate**, and then save the certificate file on your computer.

    ![Configure Single Sign-On](./media/active-directory-saas-salesforce-sandbox-tutorial/IC781023.png "Configure Single Sign-On")

5.  In a different web browser window, log into your Salesforce sandbox as an administrator.

6.  In the menu on the top, click **Setup**.

    ![Setup](./media/active-directory-saas-salesforce-sandbox-tutorial/IC781024.png "Setup")

7.  In the navigation pane on the left, click **Security Controls**, and then click **Single Sign-On Settings**.

    ![Single Sign-On Settings](./media/active-directory-saas-salesforce-sandbox-tutorial/IC781025.png "Single Sign-On Settings")

8.  On the Single Sign-On Settings section, perform the following steps:

    ![Single Sign-On Settings](./media/active-directory-saas-salesforce-sandbox-tutorial/IC781026.png "Single Sign-On Settings")

    a.  Select **SAML Enabled**.
    
    b.  Click **New**.

9.  On the SAML Single Sign-On Settings section, perform the following steps:

    ![SAML Single Sign-On Settings](./media/active-directory-saas-salesforce-sandbox-tutorial/IC781027.png "SAML Single Sign-On Settings")

    a.  In the Name textbox, type the name of the configuration (e.g.: *SPSSOWAAD\_Test*).
    
    b.  In the Azure classic portal, on the **Configure single sign-on at Salesforce Sandbox** dialogue page, copy the **Issuer URL** value, and then paste it into the **Issuer** textbox.
    
    c.  In the **Entity Id** textbox, type **https://test.salesforce.com** if this is the first Salesforce Sandbox instance that you are adding to your directory. If you have already added an instance of Salesforce Sandbox, then for the **Entity ID** type in the **Sign On URL**, which should be in this format: `http://company.my.salesforce.com`
    
    d.  Click **Browse** to upload the downloaded certificate.
    
    e.  As **SAML Identity Type**, select **Assertion contains the Federation ID from the User object**.
    
    f.  As **SAML Identity Location**, select **Identity is in the NameIdentifier element of the Subject statement**.
    
    g.  In the Azure classic portal, on the **Configure single sign-on at Salesforce Sandbox** dialogue page, copy the **Remote Login URL** value, and then paste it into the **Identity Provider Login URL** textbox.
    
    h.  SFDC does not support SAML logout.  As a workaround, paste 'https://login.windows.net/common/wsfederation?wa=wsignout1.0' it into the **Identity Provider Logout URL** textbox.
    
    i.  As **Service Provider Initiated Request Binding**, select **HTTP POST**.
    
    j. Click **Save**.

10. On the Azure classic portal, select the single sign-on configuration confirmation, and then click **Complete** to close the **Configure Single Sign On** dialog.

    ![Configure Single Sign-On](./media/active-directory-saas-salesforce-sandbox-tutorial/IC781028.png "Configure Single Sign-On")

##Enabling your domain
  
This section assumes that you already have created a domain.  
For more details, see [Defining Your Domain Name](https://help.salesforce.com/HTViewHelpDoc?id=domain_name_define.htm&language=en_US).

###To enable your domain, perform the following steps:

1.  In the left navigation pane, click **Domain Management**, and then click **My Domain.**

    ![My Domain](./media/active-directory-saas-salesforce-sandbox-tutorial/IC781029.png "My Domain")

    >[AZURE.NOTE]Please make sure that your domain has been configured correctly.

2.  In the **Login Page Settings** section, click **Edit**, then, as **Authentication Service**, select the name of the SAML Single Sign-On Setting from the previous section, and finally click **Save**.

    ![My Domain](./media/active-directory-saas-salesforce-sandbox-tutorial/IC781030.png "My Domain")
  
As soon as you have a domain configured, your users should use the domain URL to login to the Salesforce sandbox.  
To get the value of the URL, click the SSO profile you have created in the previous section.
##Configuring user provisioning
  
The objective of this section is to outline how to enable user provisioning of Active Directory user accounts to Salesforce Sandbox.

###To configure user provisioning, perform the following steps:

1.  In the Salesforce portal, in the top navigation bar, select your name to expand your user menu:

    ![My Settings](./media/active-directory-saas-salesforce-sandbox-tutorial/IC698773.png "My Settings")

2.  From your user menu, select **My Settings** to open your **My Settings** page.

3.  In the left pane, click **Personal** to expand the Personal section, and then click **Reset My Security Token**:

    ![My Settings](./media/active-directory-saas-salesforce-sandbox-tutorial/IC698774.png "My Settings")

4.  On the **Reset My Security Token** page, click **Reset Security Token** to request an email that contains your Salesforce.com security token.

    ![New Token](./media/active-directory-saas-salesforce-sandbox-tutorial/IC698776.png "New Token")

5.  Check your email inbox for an email from Salesforce.com with “**salesforce.com.com security confirmation**” as subject.

6.  Review this email and copy the security token value.

7.  In the Azure classic portal, on the **salesforce Sandbox** application integration page, click **Configure user provisioning** to open the **Configure User Provisioning** dialog.

    ![Configure user provisioning](./media/active-directory-saas-salesforce-sandbox-tutorial/IC769573.png "Configure user provisioning")

8.  On the **Enter your Salesforce Sandbox credentials to enable automatic user provisioning** page, provide the following configuration settings:

    ![Salesforce Sandbox](./media/active-directory-saas-salesforce-sandbox-tutorial/IC746476.png "Salesforce Sandbox")

    a.  In the **Salesforce Sandbox Admin User Name** textbox, type a Salesforce sandbox account name that has the **System Administrator** profile in Salesforce.com assigned.

    b.  In the **Salesforce Sandbox Admin Password** textbox, type the password for this account.

    c.  In the **User Security Token** textbox, paste the security token value.

    d.  Click **Validate** to verify your configuration.

    e.  Click the **Next** button to open the **Confirmation** page.

9.  On the **Confirmation** page, click **Complete** to save your configuration.
##Assigning users
  
To test your configuration, you need to grant the Azure AD users you want to allow using your application access to it by assigning them.

###To assign users to Salesforce Sandbox, perform the following steps:

1.  In the Azure classic portal, create a test account.

2.  On the **Salesforce Sandbox **application integration page, click **Assign users**.

    ![Assign users](./media/active-directory-saas-salesforce-sandbox-tutorial/IC769574.png "Assign users")

3.  Select your test user, click **Assign**, and then click **Yes** to confirm your assignment.

    ![Yes](./media/active-directory-saas-salesforce-sandbox-tutorial/IC767830.png "Yes")
  
You should now wait for 10 minutes and verify that the account has been synchronized to Salesforce Sandbox.
  
If you want to test your single sign-on settings, open the Access Panel. For more details about the Access Panel, see [Introduction to the Access Panel](https://msdn.microsoft.com/library/dn308586).
