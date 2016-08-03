<properties
	pageTitle="Tutorial: Azure Active Directory integration with DocuSign | Microsoft Azure"
	description="Learn how to configure single sign-on between Azure Active Directory and DocuSign."
	services="active-directory"
	documentationCenter=""
	authors="jeevansd"
	manager="femila"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="08/03/2016"
	ms.author="jeedes"/>


# Tutorial: Azure Active Directory integration with DocuSign

The objective of this tutorial is to show the integration of Azure and DocuSign.
The scenario outlined in this tutorial assumes that you already have the following items:

- A valid Azure subscription
- A tenant in DocuSign



The scenario outlined in this tutorial consists of the following building blocks:

1. [Enabling the application integration for DocuSign](#enabling-the-application-integration-for-docusign) 


2. [Configuring single sign-on](#configuring-single-sign-on) 


3. [Configuring account provisioning](#configuring-account-provisioning) 


4. [Assigning users](#assigning-users) 

    ![Configuring single sign-on][0]
 

## Enabling the application integration for DocuSign

The objective of this section is to outline how to enable the application integration for DocuSign.

### To enable the application integration for DocuSign, perform the following steps:

1. In the Azure classic portal, on the left navigation pane, click **Active Directory**.

	![Configuring single sign-on][1]

2. From the Directory list, select the directory for which you want to enable directory integration.

3. To open the applications view, in the directory view, click **Applications** in the top menu.

	![Configuring single sign-on][2]

4. Click **Add** at the bottom of the page.

	![Applications][3]

5. On the What do you want to do dialog, click **Add an application from the gallery**.

	![Configuring single sign-on][4]


6. In the search box, type **DocuSign**.

	![Configuring single sign-on][5]

7. In the results pane, select **DocuSign**, and then click **Complete** to add the application.

	![Configuring single sign-on][6]


## Configuring single sign-on

The objective of this section is to outline how to enable users to authenticate to DocuSign with their account in Azure AD using federation based on the SAML protocol.


### To configure single sign-on, perform the following steps:

1. In the Azure classic portal, on the **DocuSign application integration** page, click **Configure single sign-on** to open the Configure Single Sign On dialog.

	![Configuring single sign-on][7]

2. On the **How would you like users to sign on to DocuSign** page, select **Microsoft Azure AD Single Sign-On**, and then click Next.

	![Configuring single sign-on][8]

3. On the **Configure App Settings** page, perform the following steps:

	![Configuring single sign-on][9]

	a. In the **Sign on URL** textbox, type the URL of your Docusign tenant using the following pattern:  

    - **Production environment**: `https://account.docusign.com/organizations/\<ORGANIZATIONID\>/saml2/login/sp/\<IDPID>` 
    - **Demo environment**: `https://account-d.docusign.com/organizations/\<ORGANIZATIONID\>/saml2/login/sp/\<IDPID>`

	b. In the **Identifier** textbox, type the URL of Docusign Issuer using the following pattern: 

    - **Production environment**: `https://account.docusign.com/organizations/\<ORGANIZATIONID\>/saml2`
    - **Demo environment**: `https://account-d.docusign.com/organizations/\<ORGANIZATIONID\>/saml2`

	c. Click **Next**. 


    > [AZURE.TIP] If you don’t know what your app URL for your tenant is, contact Docusign via [SSOSetup@Docusign.com](emailTo:SSOSetup@Docusign.com) to get the SP Initiated SSO URL for your tenant.
 

4. On the **Configure single sign-on at DocuSign** page, click **Download certificate**, and then save the certificate file locally on your computer.

	![Configuring single sign-on][10]


5. In a different web browser window, log into your **DocuSign admin portal** as an administrator.


6. In the navigation menu on the left, click **Domains**.

	![Configuring single sign-on][51]

7. On the right pane, click **Claim Domain**.

	![Configuring single sign-on][52]

8. On the **Claim a domain** dialog, in the **Domain Name** textbox, type your company domain, and then click **Claim**. Make sure that you verify the domain and the status is active.

	![Configuring single sign-on][53]

9. In menu on the left side, click **Identity Providers**  

	![Configuring single sign-on][54]

10. In the right pane, click **Add Identity Provider**. 
	
	![Configuring single sign-on][55]

11. On the **Identity Provider Settings** page, perform the following steps:

	![Configuring single sign-on][56]


	a. In the **Name** textbox, type a unique name for your configuration. Please do not use spaces.

	b. In the **Identity Provider Issuer** textbox, type the value of **Issuer URL** from Azure AD classic portal.

	c. In the **Identity Provider Login URL** textbox, type the value of **Remote Login URL** from Azure AD classic portal.

	d. In the **Identity PRovider Logout URL** textbox, type the value of **Remote Logout URL** from Azure AD classic portal.

	e. Select **Sign AuthN Request**.

	f. As **Send AuthN request by**, select **POST**.

	g. As **Send logout request by**, select **POST**. 


12. In the **Custom Attribute Mapping** section, choose the field you want to map with Azure AD Claim. In this example, the **emailaddress** claim is mapped with the value of **http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress**. This is the default claim name from Azure AD for email claim. 

	> [AZURE.NOTE] Use the appropriate **User identifier** to map the user from Azure AD to Docusign user mapping. Select the proper Field and enter the appropriate value based on your organization settings.

	![Configuring single sign-on][57]

13. In the **Identity Provider Certificate** section, click **Add Certificate**, and then upload the certificate you have downloaded from Azure AD classic portal.   

	![Configuring single sign-on][58]

14. Click **Save**.

15. In the **Identity Providers** section, click **Actions**, and then click **Endpoints**.   

	![Configuring single sign-on][59]



10. On the Azure classic portal, go back to the **Configure App Settings** page. 

16. On **DocuSign admin portal**, in the **View SAML 2.0 Endpoints** section perform, the following steps:

	![Configuring single sign-on][60]

	a. Copy the **Service Provider Issuer URL**, and then paste it into the **Identifier** textbox on the Azure AD classic portal.

	b. Copy the **Service Provider Login URL**, and then paste into the **Sign On URL** textbox on the Azure AD classic portal.


	c.  Click **Close**  

15. On the Azure classic portal, select the **Single sign-on configuration confirmation**, and then click **Next**.

	![Applications][14]

10. On the **Single sign-on confirmation** page, click **Complete**.

	![Applications][15]
 

## Configuring account provisioning

The objective of this section is to outline how to enable user provisioning of Active Directory user accounts to DocuSign.

### To configure user provisioning, perform the following steps:

1. In the **Azure classic portal**, on the **DocuSign application integration** page, click **Configure account provisioning** to open the Configure User Provisioning dialog.

	![Configuring account provisioning][30]

2. On the **Settings and admin credentials** page, to enable automatic user provisioning, provide the credentials of a DocuSign account with sufficient rights, and then click **Next**. 

	![Configuring account provisioning][31]

3. On the **Test connection** dialog, click **Start test**, and upon a successful test, click **Next**.

	![Configuring account provisioning][32]

3. On the **Confirmation** page, click **Complete**.

	![Configuring account provisioning][33]
 

## Assigning users

To test your configuration, you need to grant the Azure AD users you want to allow using your application access to it by assigning them.

### To assign users to DocuSign, perform the following steps:

1. In the **Azure classic portal**, create a test account.

2. On the **DocuSign application integration** page, click **Assign users**.

	![Assigning users][40]
 

3. Select your test user, click **Assign**, and then click **Yes** to confirm your assignment.

	![Assigning users][41]


You should now wait for 10 minutes and verify that the account has been synchronized to DocuSign.

As a first verification step, you can check the provisioning status, by clicking Dashboard in the D on the DocuSign application integration page on the Azure classic portal.

![Assigning users][42]

A successfully completed user provisioning cycle is indicated by a related status:

![Assigning users][43]


If you want to test your single sign-on settings, open the Access Panel.

For more details about the Access Panel, see Introduction to the Access Panel.


## Additional Resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](active-directory-saas-tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)

<!--Image references-->

[0]: ./media/active-directory-saas-docusign-tutorial/tutorial_docusign_00.png
[1]: ./media/active-directory-saas-docusign-tutorial/tutorial_general_01.png
[2]: ./media/active-directory-saas-docusign-tutorial/tutorial_general_02.png
[3]: ./media/active-directory-saas-docusign-tutorial/tutorial_general_03.png
[4]: ./media/active-directory-saas-docusign-tutorial/tutorial_general_04.png
[5]: ./media/active-directory-saas-docusign-tutorial/tutorial_docusign_01.png
[6]: ./media/active-directory-saas-docusign-tutorial/tutorial_docusign_02.png
[7]: ./media/active-directory-saas-docusign-tutorial/tutorial_docusign_03.png
[8]: ./media/active-directory-saas-docusign-tutorial/tutorial_docusign_04.png
[9]: ./media/active-directory-saas-docusign-tutorial/tutorial_docusign_05.png
[10]: ./media/active-directory-saas-docusign-tutorial/tutorial_docusign_06.png

[14]: ./media/active-directory-saas-docusign-tutorial/tutorial_docusign_10.png
[15]: ./media/active-directory-saas-docusign-tutorial/tutorial_docusign_11.png

[30]: ./media/active-directory-saas-docusign-tutorial/tutorial_general_400.png
[31]: ./media/active-directory-saas-docusign-tutorial/tutorial_docusign_12.png
[32]: ./media/active-directory-saas-docusign-tutorial/tutorial_docusign_13.png
[33]: ./media/active-directory-saas-docusign-tutorial/tutorial_docusign_14.png



[40]: ./media/active-directory-saas-docusign-tutorial/tutorial_docusign_15.png
[41]: ./media/active-directory-saas-docusign-tutorial/tutorial_docusign_16.png
[42]: ./media/active-directory-saas-docusign-tutorial/tutorial_docusign_17.png
[43]: ./media/active-directory-saas-docusign-tutorial/tutorial_docusign_18.png

[51]: ./media/active-directory-saas-docusign-tutorial/tutorial_docusign_21.png
[52]: ./media/active-directory-saas-docusign-tutorial/tutorial_docusign_22.png
[53]: ./media/active-directory-saas-docusign-tutorial/tutorial_docusign_23.png
[54]: ./media/active-directory-saas-docusign-tutorial/tutorial_docusign_19.png
[55]: ./media/active-directory-saas-docusign-tutorial/tutorial_docusign_20.png
[56]: ./media/active-directory-saas-docusign-tutorial/tutorial_docusign_24.png
[57]: ./media/active-directory-saas-docusign-tutorial/tutorial_docusign_25.png
[58]: ./media/active-directory-saas-docusign-tutorial/tutorial_docusign_26.png
[59]: ./media/active-directory-saas-docusign-tutorial/tutorial_docusign_27.png
[60]: ./media/active-directory-saas-docusign-tutorial/tutorial_docusign_28.png