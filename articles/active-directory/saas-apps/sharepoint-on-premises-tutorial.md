---
title: 'Tutorial: Azure Active Directory integration with SharePoint on-premises | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and SharePoint on-premises.
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila
ms.reviewer: joflore

ms.assetid: 85b8d4d0-3f6a-4913-b9d3-8cc327d8280d
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/21/2018
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with SharePoint on-premises

In this tutorial, you learn how to integrate SharePoint on-premises with Azure Active Directory (Azure AD).

Integrating SharePoint on-premises with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to SharePoint on-premises.
- You can enable your users to automatically get signed-on to SharePoint on-premises (Single Sign-On) with their Azure AD accounts.
- You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](../manage-apps/what-is-single-sign-on.md).

## Prerequisites

To configure Azure AD integration with SharePoint on-premises, you need the following items:

- An Azure AD subscription
- A SharePoint on-premises single sign-on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can [get a one-month trial](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description

In this tutorial, you test Azure AD single sign-on in a test environment.
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding SharePoint on-premises from the gallery
2. Configuring and testing Azure AD single sign-on

## Adding SharePoint on-premises from the gallery

To configure the integration of SharePoint on-premises into Azure AD, you need to add SharePoint on-premises from the gallery to your list of managed SaaS apps.

**To add SharePoint on-premises from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon.

	![The Azure Active Directory button][1]

2. Navigate to **Enterprise applications**. Then go to **All applications**.

	![The Enterprise applications blade][2]

3. To add new application, click **New application** button on the top of dialog.

	![The New application button][3]

4. In the search box, type **SharePoint on-premises**, select **SharePoint on-premises** from result panel then click **Add** button to add the application.

	![SharePoint on-premises in the results list](./media\sharepoint-on-premises-tutorial/tutorial_sharepointonpremises_addfromgallery.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with SharePoint on-premises based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in SharePoint on-premises is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in SharePoint on-premises needs to be established.

To configure and test Azure AD single sign-on with SharePoint on-premises, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
3. **[Grant access to SharePoint on-premises test user](#grant-access-to-sharePoint-on-premises-test-user)** - to have a counterpart of Britta Simon in SharePoint on-premises that is linked to the Azure AD representation of user.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your SharePoint on-premises application.

**To configure Azure AD single sign-on with SharePoint on-premises, perform the following steps:**

1. In the Azure portal, on the **SharePoint on-premises** application integration page, click **Single sign-on**.

	![Configure single sign-on link][4]

2. On the **Single sign-on** dialog, select **Mode** as	**SAML-based Sign-on** to enable single sign-on.

	![Single sign-on dialog box](./media\sharepoint-on-premises-tutorial/tutorial_sharepointonpremises_samlbase.png)

3. On the **SharePoint on-premises Domain and URLs** section, perform the following steps:

	![SharePoint on-premises Domain and URLs single sign-on information](./media\sharepoint-on-premises-tutorial/tutorial_sharepointonpremises_url1.png)

	a. In the **Sign-on URL** textbox, type a URL using the following pattern: `https://<YourSharePointServerURL>/_trust/default.aspx`

    b. In the **Identifier** textbox, type the URL: `urn:sharepoint:federation`

	c. In the **Reply URL** textbox, type a URL using the following pattern: `https://<YourSharePointServerURL>/_trust/default.aspx`

4. On the **SAML Signing Certificate** section, click **Certificate (Base64)** and then save the certificate file on your computer.

	![The Certificate download link](./media\sharepoint-on-premises-tutorial/tutorial_sharepointonpremises_certificate.png)

	> [!Note]
	> Please note down the file path to which you have downloaded the certificate file, as you need to use it later in the PowerShell script for configuration.

5. Click **Save** button.

	![Configure Single Sign-On Save button](./media\sharepoint-on-premises-tutorial/tutorial_general_400.png)

6. On the **SharePoint on-premises Configuration** section, click **Configure SharePoint on-premises** to open **Configure sign-on** window. Copy the **SAML Entity ID** from the **Quick Reference section.** For **Single Sign-On Service URL**, use a value of the following pattern: `https://login.microsoftonline.com/_my_directory_id_/wsfed` 

    > [!Note]
    > _my_directory_id_ is the tenant id of Azure Ad subcription.

	![SharePoint on-premises Configuration](./media\sharepoint-on-premises-tutorial/tutorial_sharepointonpremises_configure.png)

	> [!NOTE]
	> Sharepoint On-Premises application uses SAML 1.1 token, so Azure AD expects WS Fed request from SharePoint server and after authentication, it issues the SAML 1.1. token.

7. In a different web browser window, log in to your SharePoint on-premises company site as an administrator.

8. **Configure a new trusted identity provider in SharePoint Server 2016**

	Sign into the SharePoint Server 2016 server and open the SharePoint 2016 Management Shell. Fill in the values of $realm (Identifier value from the SharePoint on-premises Domain and URLs section in the Azure portal), $wsfedurl (Single Sign-On Service URL), and $filepath (file path to which you have downloaded the certificate file) from Azure portal and run the following commands to configure a new trusted identity provider.

	> [!TIP]
	> If you're new to using PowerShell or want to learn more about how PowerShell works, see [SharePoint PowerShell](https://docs.microsoft.com/en-us/powershell/sharepoint/overview?view=sharepoint-ps). 

	```
	$realm = "<Identifier value from the SharePoint on-premises Domain and URLs section in the Azure portal>"
	$wsfedurl="<SAML single sign-on service URL value which you have copied from the Azure portal>"
	$filepath="<Full path to SAML signing certificate file which you have downloaded from the Azure portal>"
	$cert = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2($filepath)
	New-SPTrustedRootAuthority -Name "AzureAD" -Certificate $cert
	$map = New-SPClaimTypeMapping -IncomingClaimType "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name" -IncomingClaimTypeDisplayName "name" -LocalClaimType "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/upn"
	$map2 = New-SPClaimTypeMapping -IncomingClaimType "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname" -IncomingClaimTypeDisplayName "GivenName" -SameAsIncoming
	$map3 = New-SPClaimTypeMapping -IncomingClaimType "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname" -IncomingClaimTypeDisplayName "SurName" -SameAsIncoming
	$map4 = New-SPClaimTypeMapping -IncomingClaimType "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress" -IncomingClaimTypeDisplayName "Email" -SameAsIncoming
	$ap = New-SPTrustedIdentityTokenIssuer -Name "AzureAD" -Description "SharePoint secured by Azure AD" -realm $realm -ImportTrustCertificate $cert -ClaimsMappings $map,$map2,$map3,$map4 -SignInUrl $wsfedurl -IdentifierClaim "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
	```

	Next, follow these steps to enable the trusted identity provider for your application:

	a. In Central Administration, navigate to **Manage Web Application** and select the web application that you wish to secure with Azure AD.

	b. In the ribbon, click **Authentication Providers** and choose the zone that you wish to use.

	c. Select **Trusted Identity provider** and select the identify provider you just registered named *AzureAD*.

	d. On the sign-in page URL setting, select **Custom sign in page** and provide the value “/_trust/”.

	e. Click **OK**.

	![Configuring your authentication provider](./media\sharepoint-on-premises-tutorial/fig10-configauthprovider.png)

	> [!NOTE]
	> Some of the external users will not able to use this single sign-on integration as their UPN will have mangled value something like `MYEMAIL_outlook.com#ext#@TENANT.onmicrosoft.com`. Soon we will allow customers app config on how to handle the UPN depending on the user type. After that all your guest users should be able to use SSO seamlessly as the organization employees.

### Create an Azure AD test user

The objective of this section is to create a test user in the Azure portal called Britta Simon.

   ![Create an Azure AD test user][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the Azure portal, in the left pane, click the **Azure Active Directory** button.

    ![The Azure Active Directory button](./media\sharepoint-on-premises-tutorial/create_aaduser_01.png)

2. To display the list of users, go to **Users and groups**, and then click **All users**.

    ![The "Users and groups" and "All users" links](./media\sharepoint-on-premises-tutorial/create_aaduser_02.png)

3. To open the **User** dialog box, click **Add** at the top of the **All Users** dialog box.

    ![The Add button](./media\sharepoint-on-premises-tutorial/create_aaduser_03.png)

4. In the **User** dialog box, perform the following steps:

    ![The User dialog box](./media\sharepoint-on-premises-tutorial/create_aaduser_04.png)

    a. In the **Name** box, type **BrittaSimon**.

    b. In the **User name** box, type the email address of user Britta Simon.

    c. Select the **Show Password** check box, and then write down the value that's displayed in the **Password** box.

    d. Click **Create**.

### Grant access to SharePoint on-premises test user

The users who will log into Azure AD and access SharePoint must be granted access to the application  Use the following steps to set the permissions to access the web application.

1. In Central Administration, click **Application Management**.

2. On the **Application Management** page, in the **Web Applications** section, click **Manage web applications**.

3. Click the appropriate web application, and then click **User Policy**.

4. In Policy for Web Application, click **Add Users**.

	![Searching for a user by their name claim](./media\sharepoint-on-premises-tutorial/fig11-searchbynameclaim.png)

5. In the **Add Users** dialog box, click the appropriate zone in **Zones**, and then click **Next**.

6. In the **Policy for Web Application** dialog box, in the **Choose Users** section, click the **Browse** icon.

7. In the **Find** textbox, type the **user principal name(UPN)** value for which you have configured the SharePoint on-premises application in the Azure AD and click **Search**. </br>Example: *brittasimon@contoso.com*.

8. Under the AzureAD heading in the list view, select the name property and click **Add** then click **OK** to close the dialog.

9. In Permissions, click **Full Control**.

	![Granting full control to a claims user](./media\sharepoint-on-premises-tutorial/fig12-grantfullcontrol.png)

10. Click **Finish**, and then click **OK**.

### Configuring one trusted identity provider for multiple web applications

The configuration works for a single web application, but needs additional configuration if you intend to use the same trusted identity provider for multiple web applications. For example, assume we had extended a web application to use the URL `https://portal.contoso.local` and now want to authenticate the users to `https://sales.contoso.local` as well. To do this, we need to update the identity provider to honor the WReply parameter and update the application registration in Azure AD to add a reply URL.

1. In the Azure Portal, open the Azure AD directory. Click **App registrations**, then click **View all applications**. Click the application that you created previously (SharePoint SAML Integration).

2. Click **Settings**.

3. In the settings blade, click **Reply URLs**. 

4. Add the URL for the additional web application with `/_trust/default.aspx` appended to the URL (such as `https://sales.contoso.local/_trust/default.aspx`) and click **Save**.

5. On the SharePoint server, open the **SharePoint 2016 Management Shell** and execute the following commands, using the name of the trusted identity token issuer that you used previously.

	```
	$t = Get-SPTrustedIdentityTokenIssuer "AzureAD"
	$t.UseWReplyParameter=$true
	$t.Update()
	```
6. In Central Administration, go to the web application and enable the existing trusted identity provider. Remember to also configure the sign-in page URL as a custom sign in page `/_trust/`.

7. In Central Administration, click the web application and choose **User Policy**. Add a user with the appropriate permissions as demonstrated previously in this article.

### Fixing People Picker

Users can now log into SharePoint 2016 using identities from Azure AD, but there are still opportunities for improvement to the user experience. For instance, searching for a user presents multiple search results in the people picker. There is a search result for each of the 3 claim types that were created in the claim mapping. To choose a user using the people picker, you must type their user name exactly and choose the **name** claim result.

![Claims search results](./media\sharepoint-on-premises-tutorial/fig16-claimssearchresults.png)

There is no validation on the values you search for, which can lead to misspellings or users accidentally choosing the wrong claim type to assign such as the **SurName** claim. This can prevent users from successfully accessing resources.

To assist with this scenario, there is an open-source solution called [AzureCP](https://yvand.github.io/AzureCP/) that provides a custom claims provider for SharePoint 2016. It will use the Azure AD Graph to resolve what users enter and perform validation. Learn more at [AzureCP](https://yvand.github.io/AzureCP/).

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to SharePoint on-premises.

![Assign the user role][200]

**To assign Britta Simon to SharePoint on-premises, perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201]

2. In the applications list, select **SharePoint on-premises**.

	![The SharePoint link in the Applications list](./media\sharepoint-on-premises-tutorial/tutorial_sharepointonpremises_app.png)

3. In the menu on the left, click **Users and groups**.

	![The "Users and groups" link][202]

4. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![The Add Assignment pane][203]

5. On **Users and groups** dialog, select **Britta Simon** in the Users list.

6. Click **Select** button on **Users and groups** dialog.

7. Click **Assign** button on **Add Assignment** dialog.

### Test single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the SharePoint on-premises tile in the Access Panel, you should get automatically signed-on to your SharePoint on-premises application.
For more information about the Access Panel, see [Introduction to the Access Panel](../user-help/active-directory-saas-access-panel-introduction.md).

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)
* [Using Azure AD for SharePoint Server Authentication](https://docs.microsoft.com/en-us/office365/enterprise/using-azure-ad-for-sharepoint-server-authentication)

<!--Image references-->

[1]: ./media\sharepoint-on-premises-tutorial/tutorial_general_01.png
[2]: ./media\sharepoint-on-premises-tutorial/tutorial_general_02.png
[3]: ./media\sharepoint-on-premises-tutorial/tutorial_general_03.png
[4]: ./media\sharepoint-on-premises-tutorial/tutorial_general_04.png

[100]: ./media\sharepoint-on-premises-tutorial/tutorial_general_100.png

[200]: ./media\sharepoint-on-premises-tutorial/tutorial_general_200.png
[201]: ./media\sharepoint-on-premises-tutorial/tutorial_general_201.png
[202]: ./media\sharepoint-on-premises-tutorial/tutorial_general_202.png
[203]: ./media\sharepoint-on-premises-tutorial/tutorial_general_203.png
