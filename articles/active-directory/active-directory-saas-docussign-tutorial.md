<properties
	pageTitle="Tutorial: Azure Active Directory integration with DocuSign | Microsoft Azure"
	description="Learn how to configure single sign-on between Azure Active Directory and DocuSign."
	services="active-directory"
	documentationCenter=""
	authors="markusvi"
	manager="stevenpo"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="10/01/2015"
	ms.author="markusvi"/>


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




<Configuration Image> 

 

## Enabling the application integration for DocuSign

The objective of this section is to outline how to enable the application integration for DocuSign.

### To enable the application integration for DocuSign, perform the following steps:

1. In the Azure Management Portal, on the left navigation pane, click **Active Directory**.
<br><br>![Configuring single sign-on ][1]<br>

2. From the Directory list, select the directory for which you want to enable directory integration.

3. To open the applications view, in the directory view, click **Applications** in the top menu.
<br><br>![Configuring single sign-on ][2]<br>

4. Click **Add** at the bottom of the page.
<br><br>![Applications][3]<br>

5. On the What do you want to do dialog, click **Add an application from the gallery**.
<br><br>![Configuring single sign-on ][4]<br>


6. In the search box, type **Docusign**.
<br><br>![Configuring single sign-on ][5]<br>

7. In the results pane, select **Docusign**, and then click **Complete** to add the application.
<br><br>![Configuring single sign-on ][6]<br>




## Configuring single sign-on

The objective of this section is to outline how to enable users to authenticate to Docusign with their account in Azure AD using federation based on the SAML protocol.


### To configure single sign-on, perform the following steps:

1. In the Azure AD portal, on the **Docusign application integration** page, click **Configure single sign-on** to open the Configure Single Sign On dialog.
<br><br>![Configuring single sign-on ][7]<br>

2. On the **How would you like users to sign on to Docusign** page, select **Microsoft Azure AD Single Sign-On**, and then click Next.
<br><br>![Configuring single sign-on ][8]<br>

3. On the **Configure App URL** page, in the **Docusign sign on URL** textbox, type the URL of your Docusign tenant, and then click **Next**. The URL has the following schema:* https://<yourcompanyname>.docusign.net/Member/MemberLogin.aspx?ssoname=<yourSSOInstanceName>*
<br><br>![Configuring single sign-on ][9]<br>


    > [AZURE.TIP] If you don’t know what your app URL for your tenant is, try contacting Docusign via SSOSetup@Docusign.com to get the SP Initiated SSO URL for your tenant.
 

4. On the **Configure single sign-on at Docusign** page, click **Download certificate**, and then save the certificate file locally on your computer.
<br><br>![Configuring single sign-on ][10]<br>


5. In a different web browser window, log into your **Docusign** company site as an administrator.


6. In the menu on the top, expand the user’s menu, click **Preferences**, and then, in the navigation pane on the left, expand **Account Management**, and then click **Features**.
<br><br>![Configuring single sign-on ][11]<br>

7. Click SAML Configuration, and then click the SAML Configuration link.



8. In the **SAML 2.0 Configuration** section, perform the following steps:
<br><br>![Configuring single sign-on ][13]<br>


    a. In the Azure portal, on the **Configure single sign-on at Docusign** dialogue page, copy the Issuer URL** value, and then paste it into the **Identity Provider Endpoint URL** textbox.

    > [AZURE.IMPORTANT] If this configuration option is unavailable, please contact your Docusign account manager or contact the SSO support team by email ([SSOSetup@docusign.com](mailto:SSOSetup@docusign.com)).
 
    b. Click **Browse** to upload your downloaded certificate.


    c. Select **Enable first name, last name and email address**.


    d. Click **Save**.


9. On the Azure AD portal, select the **single sign-on configuration confirmation**, and then click **Next**.
<br><br>![Applications][14]<br>

10. On the **Single sign-on confirmation** page, click **Complete**.
<br><br>![Applications][15]<br>


 

## Configuring account provisioning

The objective of this section is to outline how to enable user provisioning of Active Directory user accounts to DocuSign.

### To configure user provisioning, perform the following steps:

1. In the Azure Management Portal, on the DocuSign application integration page, click **Configure account provisioning** to open the Configure User Provisioning dialog.
<br><br>![Configuring account provisioning][30]<br>
 

2. On the Enter your DocuSign credentials to enable automatic user provisioning page, provide the credentials of a DocuSign account with sufficient rights, and then click Next. 
<br><br>![Configuring account provisioning][31]<br>

3. On the **Test connection** dialog, click **Start test**.
<br><br>![Configuring account provisioning][32]<br>

3. On the Confirmation page, click **Complete**.

<br><br>![Configuring account provisioning][33]<br>
 

## Assigning users

To test your configuration, you need to grant the Azure AD users you want to allow using your application access to it by assigning them.

### To assign users to Docusign, perform the following steps:

1. In the Azure AD portal, create a test account.

2. On the Docusign application integration page, click Assign users.
<br><br>![Assigning users][40]<br>
 

3. Select your test user, click Assign, and then click Yes to confirm your assignment.

<br><br>![Assigning users][41]<br>


You should now wait for 10 minutes and verify that the account has been synchronized to Docusign.

As a first verification step, you can check the provisioning status, by clicking Dashboard in the D on the Docusign application integration page on the Azure Management Portal.
Dashboard 

<br><br>![Assigning users][42]<br>

A successfully completed user provisioning cycle is indicated by a related status:
Integration status 

<br><br>![Assigning users][43]<br>


If you want to test your single sign-on settings, open the Access Panel.

For more details about the Access Panel, see Introduction to the Access Panel.





## Additional Resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](active-directory-saas-tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)

<!--Image references-->
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