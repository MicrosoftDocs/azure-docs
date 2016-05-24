<properties 
    pageTitle="Tutorial: Azure Active Directory integration with Workday | Microsoft Azure" 
    description="Learn how to use Workday with Azure Active Directory to enable single sign-on, automated provisioning, and more!." 
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
    ms.date="04/06/2016" 
    ms.author="jeedes" />

#Tutorial: Azure Active Directory integration with Workday
  
The objective of this tutorial is to show the integration of Azure and Workday. The scenario outlined in this tutorial assumes that you already have the following items:

-   A valid Azure subscription
-   A tenant in Workday
  
The scenario outlined in this tutorial consists of the following building blocks:

1.  Enabling the application integration for Workday
2.  Configuring single sign-on
3.  Configuring user provisioning
4.  Configuring user provisioning

![Scenario](./media/active-directory-saas-workday-tutorial/IC782919.png "Scenario")

##Enabling the application integration for Workday
  
The objective of this section is to outline how to enable the application integration for Salesforce.

###To enable the application integration for Workday, perform the following steps:

1.  In the Azure Management Portal, on the left navigation pane, click **Active Directory**.

    ![Active Directory](./media/active-directory-saas-workday-tutorial/IC700993.png "Active Directory")

2.  From the **Directory** list, select the directory for which you want to enable directory integration.

3.  To open the applications view, in the directory view, click **Applications** in the top menu.

    ![Applications](./media/active-directory-saas-workday-tutorial/IC700994.png "Applications")

4.  To open the **Application Gallery**, click **Add An App**, and then click **Add an application for my organization to use**.

    ![What do you want to do?](./media/active-directory-saas-workday-tutorial/IC700995.png "What do you want to do?")

5.  In the **search box**, type **Workday**.

    ![Workday](./media/active-directory-saas-workday-tutorial/IC701021.png "Workday")

6.  In the results pane, select **Workday**, and then click **Complete** to add the application.

    ![Workday](./media/active-directory-saas-workday-tutorial/IC701022.png "Workday")

##Configuring single sign-on
  
The objective of this section is to outline how to enable users to authenticate to Workday with their account in Azure AD using federation based on the SAML protocol.  
As part of this procedure, you are required to create a base-64 encoded certificate.  
If you are not familiar with this procedure, see [How to convert a binary certificate into a text file](http://youtu.be/PlgrzUZ-Y1o).

###To configure single sign-on, perform the following steps:

1.  On the **Workday** application integration page, click **Configure single sign-on** to open the **Configure Single Sign On ** dialog.

    ![Configure single sign-on](./media/active-directory-saas-workday-tutorial/IC782920.png "Configure single sign-on")

2.  On the **How would you like users to sign on to Workday** page, select **Microsoft Azure AD Single Sign-On**, and then click **Next**.

    ![Configure single sign-on](./media/active-directory-saas-workday-tutorial/IC782921.png "Configure single sign-on")

3.  On the **Configure App URL** page, perform the following steps, and then click **Next**.

    ![Configure App URL](./media/active-directory-saas-workday-tutorial/IC782957.png "Configure App URL")

    1.  In the **Sign On URL** textbox, type the URL used by your users to sign in to Workday (e.g.: *https://impl.workday.com/\<tenant\>/login-saml2.htmld*)
    2.  In the **Workday Reply URL** textbox, type the Workday reply URL (e.g.: *https://impl.workday.com/\<tenant\>/login-saml.htmld*).

        >[AZURE.NOTE] Your reply URL must have a sub-domain (e.g.: www, wd2, wd3, wd3-impl, wd5, wd5-impl). 
		>Using something like "*http://www.myworkday.com*" works but "*http://myworkday.com*" does not. 
 
4.  On the **Configure single sign-on at Workday** page, to download your certificate, click **Download certificate**, and then save the certificate file on your computer.

    ![Configure single sign-on](./media/active-directory-saas-workday-tutorial/IC782922.png "Configure single sign-on")

5.  In a different web browser window, log into your Workday company site as an administrator.

6.  Go to **Menu \> Workbench**.

    ![Workbench](./media/active-directory-saas-workday-tutorial/IC782923.png "Workbench")

7.  Go to **Account Administration**.

    ![Account Administration](./media/active-directory-saas-workday-tutorial/IC782924.png "Account Administration")

8.  Go to **Edit Tenant Setup – Security**.

    ![Edit Tenant Security](./media/active-directory-saas-workday-tutorial/IC782925.png "Edit Tenant Security")

9.  In the **Redirection URLs** section, perform the following steps:

    ![Redirection URLs](./media/active-directory-saas-workday-tutorial/IC7829581.png "Redirection URLs")

     9.1. Click **Add Row**.

     9.2. In the **Login Redirect URL** textbox and the **Mobile Redirect URL** textbox, type the **Workday Tenant URL** you have entered on the **Configure App URL** page of the Azure portal.
    
     9.3. In the Azure portal, on the **Configure single sign-on at Workday** dialog page, copy the **Single Sign-Out Service URL**, and then paste it into the **Logout Redirect URL** textbox.

     9.4.  In **Environment** textbox, type the environment name.  


       >[AZURE.NOTE] The value of the Environment attribute is tied to the value of the tenant URL:
		>
        >-   If the domain name of the Workday tenant URL starts with impl (e.g.: *https://impl.workday.com/\<tenant\>/login-saml2.htmld*), the **Environment** attribute must be set to Implementation.
        >-   If the domain name starts with something else, you need to contact Workday to get the matching **Environment** value.

10. In the **SAML Setup** section, perform the following steps:

    ![SAML Setup](./media/active-directory-saas-workday-tutorial/IC782926.png "SAML Setup")

     10.1.  Select **Enable SAML Authentication**.

     10.2.  Click **Add Row**.

11. In the SAML Identity Providers section, perform the following steps:

    ![SAML Identity Providers](./media/active-directory-saas-workday-tutorial/IC7829271.png "SAML Identity Providers")

     11.1.  In the Identity Provider Name textbox, type a provider name (e.g.: *SPInitiatedSSO*).

     11.2.  In the Azure portal, on the **Configure single sign-on at Workday** dialog page, copy the **Identity Provider ID** value, and then paste it into the **Issuer** textbox.

     11.3.  Select **Enable Workday Initialted Logout**.

     11.4. In the Azure portal, on the **Configure single sign-on at Workday** dialog page, copy the **Single Sign-Out Service URL** value, and then paste it into the **Logout Request URL** textbox.


     11.3.  Click **Identity Provider Public Key Certificate**, and then click **Create**. <br><br>
        ![Create](./media/active-directory-saas-workday-tutorial/IC782928.png "Create")

     11.4.  Click **Create x509 Public Key**. <br><br>
        ![Create](./media/active-directory-saas-workday-tutorial/IC782929.png "Create")

     11.5.  In the **View x509 Public Key** section, perform the following steps: <br><br>
        ![View x509 Public Key](./media/active-directory-saas-workday-tutorial/IC782930.png "View x509 Public Key") <br>

      1.  In the **Name** textbox, type a name for your certificate (e.g.: *PPE\_SP*).
      2.  In the **Valid From** textbox, type the valid from attribute value of your certificate.
      3.  In the **Valid To** textbox, type the valid to attribute value of your certificate.
		
           >[AZURE.NOTE] You can get the valid from date and the valid to date from the downloaded certificate by double-clicking it. The dates are listed under the **Details** tab.

      4.  Create a **Base-64 encoded** file from your downloaded certificate.  

		>[AZURE.TIP] For more details, see [How to convert a binary certificate into a text file](http://youtu.be/PlgrzUZ-Y1o)

      5.  Open your base-64 encoded certificate in notepad, and then copy the content of it.
      6.  In the **Certificate** textbox, paste the content of your clipboard.
      7.  Click **OK**.

12.  Perform the following steps: <br><br>
        ![SSO configuration](./media/active-directory-saas-workday-tutorial/IC7829351111.png "SSO configuration")

     12.1.  Enable the **x509 Private Key Pair**.

     12.2.  In the **Service Provider ID** textbox, type **http://www.workday.com**.

     12.3.  Select **Enable SP Initiated SAML Authentication**.

     12.4.  In the Azure portal, on the **Configure single sign-on at Workday** dialog page, copy the **Single Sign-On Service URL** value, and then paste it into the **IdP SSO Service URL** textbox.
     
     12.5 Select **Do Not Deflate SP-initiated Authentication Request**.

     12.6. As **Authentication Request Signature Method**, select **SHA256**. <br><br>
        ![Authentication Request Signature Method](./media/active-directory-saas-workday-tutorial/IC782932.png "Authentication Request Signature Method") <br><br>
 
     12.7 Click **OK**. <br><br>
        ![OK](./media/active-directory-saas-workday-tutorial/IC782933.png "OK")

12. In the Azure AD portal, on the **Configure single sign-on at Workday** page, click **Next**. <br><br>

    ![Configure single sign-on](./media/active-directory-saas-workday-tutorial/IC782934.png "Configure single sign-on")

13. On the **Single sign-on confirmation** page, click **Complete**. <br><br>

    ![Configure single sign-on](./media/active-directory-saas-workday-tutorial/IC782935111.png "Configure single sign-on")



##Configuring user provisioning
  
To get a test user provisioned into Workday, you need to contact the Workday support team.  
The Workday support team will create the user for you.

##Assigning users
  
To test your configuration, you need to grant the Azure AD users you want to allow using your application access to it by assigning them.

###To assign users to Workday, perform the following steps:

1.  In the Azure AD portal, create a test account.

2.  On the **Workday **application integration page, click **Assign users**.

    ![Assign Users](./media/active-directory-saas-workday-tutorial/IC782935.png "Assign Users")

3.  Select your test user, click **Assign**, and then click **Yes** to confirm your assignment.

    ![Yes](./media/active-directory-saas-workday-tutorial/IC767830.png "Yes")
  
If you want to test your single sign-on settings, open the Access Panel. For more details about the Access Panel, see [Introduction to the Access Panel](active-directory-saas-access-panel-introduction.md).