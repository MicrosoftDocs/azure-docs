---
title: 'Tutorial: Azure Active Directory integration with Cezanne HR software | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Cezanne HR software.
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila

ms.assetid: fb8f95bf-c3c1-4e1f-b2b3-3b67526be72d
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/05/2017
ms.author: jeedes

---
# Tutorial: Integrate Azure Active Directory with Cezanne HR software

In this tutorial, you learn how to integrate Cezanne HR software with Azure Active Directory (Azure AD).

Integrating Cezanne HR software with Azure AD provides you with the following benefits. You can:

- Control in Azure AD who has access to Cezanne HR software.
- Enable your users to automatically sign in to Cezanne HR software with single sign-on (SSO) with their Azure AD accounts.
- Manage your accounts in one central location: the Azure portal.

To learn more about software as a service (SaaS) app integration with Azure AD, see [What is application access and SSO with Azure Active Directory?](active-directory-appssoaccess-whatis.md).

## Prerequisites

To configure Azure AD integration with Cezanne HR software, you need the following items:

- An Azure AD subscription
- A Cezanne HR software SSO-enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we recommend that you do not use a production environment.

To test the steps in this tutorial, follow these recommendations:

- Don't use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can [get a one-month trial](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD SSO in a test environment. 

The scenario outlined in this tutorial consists of two main building blocks:

* Adding Cezanne HR software from the gallery
* Configuring and testing Azure AD SSO

## Add Cezanne HR software from the gallery
To configure the integration of Cezanne HR software into Azure AD, add Cezanne HR software from the gallery to your list of managed SaaS apps.

To add Cezanne HR software from the gallery, do the following:

1. In the **[Azure portal](https://portal.azure.com)**, in the left pane, select the **Azure Active Directory** button. 

	![The "Azure Active Directory" button][1]

2. Select **Enterprise applications** > **All applications**.

	![The "All applications" link][2]
	
3. To add a new application, at the top of the **All applications** dialog box, select **New application**.

	![The "New application" button][3]

4. In the search box, type **Cezanne HR Software**.

	![The search box](./media/active-directory-saas-cezannehrsoftware-tutorial/tutorial_cezannehrsoftware_search.png)

5. In the results list, select **Cezanne HR Software** and then select the **Add** button to add the application.

	![The results list](./media/active-directory-saas-cezannehrsoftware-tutorial/tutorial_cezannehrsoftware_addfromgallery.png)

## Configure and test Azure AD single sign-on
In this section, you configure and test Azure AD SSO with Cezanne HR software based on a test user called "Britta Simon."

For SSO to work, Azure AD needs to know the Cezanne HR software counterpart to the Azure AD user. In other words, you must establish a link relationship between an Azure AD user and the related user in the Cezanne HR software.

To establish the link relationship, assign the Cezanne HR software **user name** value as the Azure AD **Username** value.

To configure and test Azure AD SSO by using Cezanne HR software, complete the following building blocks.

### Configure Azure AD SSO

In this section, you can enable Azure AD SSO in the Azure portal and configure SSO in your Cezanne HR software application by doing the following:

1. In the Azure portal, on the **Cezanne HR Software** application integration page, select **Single sign-on**.

	![The "Single sign-on" command][4]

2. To enable SSO, in the **Single sign-on** dialog box, select the **Mode** as **SAML-based Sign-on**.
 
	![The "Mode" box](./media/active-directory-saas-cezannehrsoftware-tutorial/tutorial_cezannehrsoftware_samlbase.png)

3. Under **Cezanne HR Software Domain and URLs**, do the following:

	![The "Cezanne HR Software Domain and URLs" section](./media/active-directory-saas-cezannehrsoftware-tutorial/tutorial_cezannehrsoftware_url.png)

    a. In the **Sign-on URL** box, type a URL that has the following syntax: `https://w3.cezanneondemand.com/cezannehr/-/<tenant id>`

	b. In the **Reply URL** box, type a URL that has the following syntax: `https://w3.cezanneondemand.com:443/<tenantid>`    
	 
	> [!NOTE] 
	> The preceding values are not real. Update them with the actual reply URL and the sign-on URL. To obtain the values, contact the [Cezanne HR software client support team](mailto:info@cezannehr.com).

4. Under **SAML Signing Certificate**, select **Certificate (Base64)**, and then save the certificate file on your computer.

	![The "SAML Signing Certificate" section](./media/active-directory-saas-cezannehrsoftware-tutorial/tutorial_cezannehrsoftware_certificate.png) 

5. Select **Save**.

	![The "Save" button](./media/active-directory-saas-cezannehrsoftware-tutorial/tutorial_general_400.png)
	
6. Under **Cezanne HR Software Configuration**, select **Configure Cezanne HR Software** to open the **Configure sign-on** window. Copy the **SAML Entity ID** and **SAML Single Sign-On Service** URL from the **Quick Reference** section.

	![The "Cezanne HR Software Configuration" section](./media/active-directory-saas-cezannehrsoftware-tutorial/tutorial_cezannehrsoftware_configure.png) 

7. In a different web browser window, sign on to your Cezanne HR software tenant as an administrator.

8. In the left pane, select **System Setup**. Select **Security Settings** > **Single Sign-On Configuration**.

	![The "Single Sign-On Configuration" link](./media/active-directory-saas-cezannehrsoftware-tutorial/tutorial_cezannehrsoftware_000.png)

9. In the **Allow users to log in using the following Single Sign-On (SSO) services** pane, select the **SAML 2.0** check box and select the **Advanced Configuration** option.

	![Single sign-on services options](./media/active-directory-saas-cezannehrsoftware-tutorial/tutorial_cezannehrsoftware_001.png)

10. Select **Add New**.

	![The "Add New" button](./media/active-directory-saas-cezannehrsoftware-tutorial/tutorial_cezannehrsoftware_002.png)

11. Under **SAML 2.0 Identity Providers**, do the following:

	![The "SAML 2.0 Identity Providers" section](./media/active-directory-saas-cezannehrsoftware-tutorial/tutorial_cezannehrsoftware_003.png)
	
	a. In the **Display Name** box, enter the name of your identity provider.

	b. In the **Entity Identifier** box, paste the **SAML Entity ID** that you copied from the Azure portal. 

	c. In the **SAML Binding** list box, select **POST**.

	d. In the **Security Token Service Endpoint** box, paste the **SAML Single Sign-On Service** URL that you copied from the Azure portal. 
	
	e. In the **User ID Attribute Name** box, enter `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name`.
	
	f. To upload the downloaded certificate from Azure AD, select the **Upload** button.
	
	g. Select **OK**. 

12. Select **Save**.

	![The "Save" button](./media/active-directory-saas-cezannehrsoftware-tutorial/tutorial_cezannehrsoftware_004.png)

> [!TIP]
> As you set up the app, you can read a concise version of the preceding instructions in the [Azure portal](https://portal.azure.com). After you add the app from the **Active Directory** > **Enterprise applications** section, select the **Single sign-on** tab. Then access the embedded documentation from the **Configuration** section. 

To learn more about the embedded documentation feature, see [Azure AD embedded documentation]( https://go.microsoft.com/fwlink/?linkid=845985).
> 

### Create an Azure AD test user
In this section, you create test user Britta Simon in the Azure portal.

![The test user Britta Simon][100]

To create a test user in Azure AD, do the following:

1. In the **Azure portal**, in the left pane, select the **Azure Active Directory** button.

	![The "Azure Active Directory" button](./media/active-directory-saas-cezannehrsoftware-tutorial/create_aaduser_01.png) 

2. To display the list of users, select **Users and groups** > **All users**.
	
	![The "All users" link](./media/active-directory-saas-cezannehrsoftware-tutorial/create_aaduser_02.png) 
	
	The **All users** dialog box opens.

3. To open the **User** dialog box, select **Add**.
 
	![The "Add" button](./media/active-directory-saas-cezannehrsoftware-tutorial/create_aaduser_03.png) 

4. In the **User** dialog box, do the following:
 
	![The "User" dialog box](./media/active-directory-saas-cezannehrsoftware-tutorial/create_aaduser_04.png) 

    a. In the **Name** box, type **BrittaSimon**.

    b. In the **User name** box, type user Britta Simon's **email address**.

	c. Select the **Show Password** check box, and then note the value that was generated in the **Password** box.

    d. Select **Create**.
 
### Create a Cezanne HR software test user

To enable Azure AD users to sign in to Cezanne HR software, they must be provisioned into Cezanne HR software. In the case of Cezanne HR software, provisioning is a manual task.

Provision a user account by doing the following:

1.  Sign in to your Cezanne HR software company site as an administrator.

2.  In the left pane, select **System Setup** > **Manage Users** > **Add New User**.

    ![The "Add New User" link](./media/active-directory-saas-cezannehrsoftware-tutorial/tutorial_cezannehrsoftware_005.png "New User")

3.  Under **Person Details**, do the following:

    ![The "Person Details" section](./media/active-directory-saas-cezannehrsoftware-tutorial/tutorial_cezannehrsoftware_006.png "New User")
	
	a. Set **Internal User** as **OFF**.
 	
	b. In the **First Name** box, type the user's first name, for example, **Britta**.  
 
	c. In the **Last Name** box, type the user's last name, for example, **Simon**.
	
	d. In the **E-mail** box, type the user's email address, for example, Brittasimon@contoso.com.

4.  Under **Account Information**, do the following:

    ![The "Account Information" section](./media/active-directory-saas-cezannehrsoftware-tutorial/tutorial_cezannehrsoftware_007.png "New User")
	
	a. In the **Username** box, type the user's email address, for example, Brittasimon@contoso.com.
	
	b. In the **Password** box, type the user's password.
 	
	c. In the **Security Role** box, select **HR Professional**.
	
	d. Select **OK**.

5. On the **Single sign-on** tab, in the **SAML 2.0 Identifiers** section, select **Add New**.

	![The "Add New" button](./media/active-directory-saas-cezannehrsoftware-tutorial/tutorial_cezannehrsoftware_008.png "User")

6. In the **Identity Provider** list box, select your identity provider. In the **User Identifier** box, enter the email address for test user Britta Simon's account.

	![The "Identity Provider" and "User Identifier" boxes](./media/active-directory-saas-cezannehrsoftware-tutorial/tutorial_cezannehrsoftware_009.png "User")
	
7. Select **Save**.

	![The "Save" button](./media/active-directory-saas-cezannehrsoftware-tutorial/tutorial_cezannehrsoftware_010.png "User")

### Assign the Azure AD test user

In this section, you enable test user Britta Simon to use Azure SSO by granting access to Cezanne HR software.

![Test user access][200] 

1. In the Azure portal, open the applications view and then go to the directory view. Select **Enterprise applications** > **All applications**.

	![The "All applications" link][201] 

2. In the applications list, select **Cezanne HR Software**.

	![The "Applications" list](./media/active-directory-saas-cezannehrsoftware-tutorial/tutorial_cezannehrsoftware_app.png) 

3. In the menu on the left, select **Users and groups**.

	![Assign user][202] 

4. Select **Add**. Then in the **Add Assignment** dialog box, select **Users and groups**.

	!["Users and Groups" link][203]

5. In the **Users and groups** dialog box, in the **Users** list, select **Britta Simon**.

6. In the **Users and groups** dialog box, select **Select**.

7. In the **Add Assignment** dialog box, select **Assign**.
	
### Test SSO

In this section, you test your Azure AD SSO configuration by using the Access Panel.

When you select the Cezanne HR software tile in the Access Panel, you sign on automatically to your Cezanne HR software application.

## Next steps

* [List of tutorials on how to integrate SaaS apps with Azure Active Directory](active-directory-saas-tutorial-list.md)
* [What is application access and SSO with Azure Active Directory?](active-directory-appssoaccess-whatis.md)

<!--Image references-->

[1]: ./media/active-directory-saas-cezannehrsoftware-tutorial/tutorial_general_01.png
[2]: ./media/active-directory-saas-cezannehrsoftware-tutorial/tutorial_general_02.png
[3]: ./media/active-directory-saas-cezannehrsoftware-tutorial/tutorial_general_03.png
[4]: ./media/active-directory-saas-cezannehrsoftware-tutorial/tutorial_general_04.png

[100]: ./media/active-directory-saas-cezannehrsoftware-tutorial/tutorial_general_100.png

[200]: ./media/active-directory-saas-cezannehrsoftware-tutorial/tutorial_general_200.png
[201]: ./media/active-directory-saas-cezannehrsoftware-tutorial/tutorial_general_201.png
[202]: ./media/active-directory-saas-cezannehrsoftware-tutorial/tutorial_general_202.png
[203]: ./media/active-directory-saas-cezannehrsoftware-tutorial/tutorial_general_203.png

