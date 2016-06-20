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
	ms.date="05/26/2016"
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




![Configuring single sign-on ][0]


 

## Enabling the application integration for DocuSign

The objective of this section is to outline how to enable the application integration for DocuSign.

### To enable the application integration for DocuSign, perform the following steps:

1. In the Azure classic portal, on the left navigation pane, click **Active Directory**.

	![Configuring single sign-on ][1]

2. From the Directory list, select the directory for which you want to enable directory integration.

3. To open the applications view, in the directory view, click **Applications** in the top menu.

	![Configuring single sign-on ][2]

4. Click **Add** at the bottom of the page.

	![Applications][3]

5. On the What do you want to do dialog, click **Add an application from the gallery**.

	![Configuring single sign-on ][4]


6. In the search box, type **Docusign**.

	![Configuring single sign-on ][5]

7. In the results pane, select **Docusign**, and then click **Complete** to add the application.

	![Configuring single sign-on ][6]




## Configuring single sign-on

The objective of this section is to outline how to enable users to authenticate to Docusign with their account in Azure AD using federation based on the SAML protocol.


### To configure single sign-on, perform the following steps:

1. In the Azure classic portal, on the **Docusign application integration** page, click **Configure single sign-on** to open the Configure Single Sign On dialog.

	![Configuring single sign-on ][7]

2. On the **How would you like users to sign on to Docusign** page, select **Microsoft Azure AD Single Sign-On**, and then click Next.

	![Configuring single sign-on ][8]

3. On the **Configure App Settings** page, perform the following steps:

	![Configuring single sign-on ][9]

	a. in the **Sign on URL** textbox, type the URL of your Docusign tenant using the following pattern: `https://<company name>.docusign.net/Member/MemberLogin.aspx?ssoname=<SSO instance name>`

	b. Click **Next**. 


    > [AZURE.TIP] If you don’t know what your app URL for your tenant is, try contacting Docusign via SSOSetup@Docusign.com to get the SP Initiated SSO URL for your tenant.
 

4. On the **Configure single sign-on at Docusign** page, click **Download certificate**, and then save the certificate file locally on your computer.

	![Configuring single sign-on ][10]


5. In a different web browser window, log into your **Docusign** company site as an administrator.


6. In the menu on the top, expand the user’s menu, click **Preferences**, and then, in the navigation pane on the left, expand **Account Management**, and then click **Features**.

	![Configuring single sign-on ][11]

7. Click **SAML Configuration**, and then click the **SAML Configuration** link.



8. In the **SAML 2.0 Configuration** section, perform the following steps:

	![Configuring single sign-on ][13]


    a. In the Azure classic portal, on the **Configure single sign-on at Docusign** dialogue page, copy the Issuer URL** value, and then paste it into the **Identity Provider Endpoint URL** textbox.

    > [AZURE.IMPORTANT] If this configuration option is unavailable, please contact your Docusign account manager or contact the SSO support team by email ([SSOSetup@docusign.com](mailto:SSOSetup@docusign.com)).
 
    b. Click **Browse** to upload your downloaded certificate.


    c. Select **Enable first name, last name and email address**.


    d. Click **Save**.


9. On the Azure classic portal, select the **single sign-on configuration confirmation**, and then click **Next**.

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

### To assign users to Docusign, perform the following steps:

1. In the **Azure classic portal**, create a test account.

2. On the **Docusign application integration** page, click **Assign users**.

	![Assigning users][40]
 

3. Select your test user, click **Assign**, and then click **Yes** to confirm your assignment.

	![Assigning users][41]


You should now wait for 10 minutes and verify that the account has been synchronized to Docusign.

As a first verification step, you can check the provisioning status, by clicking Dashboard in the D on the Docusign application integration page on the Azure classic portal.

![Assigning users][42]

A successfully completed user provisioning cycle is indicated by a related status:

![Assigning users][43]


If you want to test your single sign-on settings, open the Access Panel.

For more details about the Access Panel, see Introduction to the Access Panel.





## Additional Resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](active-directory-saas-tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)

<!--Image references-->

[0]: ./media/active-directory-saas-docussign-tutorial/tutorial_docusign_00.png
[1]: ./media/active-directory-saas-docussign-tutorial/tutorial_general_01.png
[2]: ./media/active-directory-saas-docussign-tutorial/tutorial_general_02.png
[3]: ./media/active-directory-saas-docussign-tutorial/tutorial_general_03.png
[4]: ./media/active-directory-saas-docussign-tutorial/tutorial_general_04.png
[5]: ./media/active-directory-saas-docussign-tutorial/tutorial_docusign_01.png
[6]: ./media/active-directory-saas-docussign-tutorial/tutorial_docusign_02.png
[7]: ./media/active-directory-saas-docussign-tutorial/tutorial_docusign_03.png
[8]: ./media/active-directory-saas-docussign-tutorial/tutorial_docusign_04.png
[9]: ./media/active-directory-saas-docussign-tutorial/tutorial_docusign_05.png
[10]: ./media/active-directory-saas-docussign-tutorial/tutorial_docusign_06.png
[11]: ./media/active-directory-saas-docussign-tutorial/tutorial_docusign_07.png

[13]: ./media/active-directory-saas-docussign-tutorial/tutorial_docusign_09.png
[14]: ./media/active-directory-saas-docussign-tutorial/tutorial_docusign_10.png
[15]: ./media/active-directory-saas-docussign-tutorial/tutorial_docusign_11.png

[30]: ./media/active-directory-saas-docussign-tutorial/tutorial_general_400.png
[31]: ./media/active-directory-saas-docussign-tutorial/tutorial_docusign_12.png
[32]: ./media/active-directory-saas-docussign-tutorial/tutorial_docusign_13.png
[33]: ./media/active-directory-saas-docussign-tutorial/tutorial_docusign_14.png



[40]: ./media/active-directory-saas-docussign-tutorial/tutorial_docusign_15.png
[41]: ./media/active-directory-saas-docussign-tutorial/tutorial_docusign_16.png
[42]: ./media/active-directory-saas-docussign-tutorial/tutorial_docusign_17.png
[43]: ./media/active-directory-saas-docussign-tutorial/tutorial_docusign_18.png