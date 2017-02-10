---
title: 'Tutorial: Azure Active Directory integration with Intacct | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Intacct.
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila

ms.assetid: 970bca01-6480-4a9f-ad99-3e4103b5ea88
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/27/2017
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Intacct

In this tutorial, you learn how to integrate Intacct with Azure Active Directory (Azure AD).

Integrating Intacct with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to Intacct.
- You can set up your users to automatically get signed in to Intacct (single sign-on) with their Azure AD accounts.
- You can manage your accounts in one central location: the Azure portal.

If you want more details about software as a service (SaaS) app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](active-directory-appssoaccess-whatis.md).

## Prerequisites

To configure Azure AD integration with Intacct, you need the following items:

- An Azure AD subscription.
- An Intacct subscription with single sign-on turned on.


> [!NOTE]
> To test the steps in this tutorial, we don't recommend using a production environment.


To test the steps in this tutorial, follow these recommendations:

- Don't use your production environment unless it's necessary
- If you don't have an Azure AD trial environment, you can get a [one-month free trial](https://azure.microsoft.com/pricing/free-trial/)


## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment.
The scenario outlined in this tutorial consists of two main building blocks:

1. Add Intacct from the gallery.
2. Configure and test Azure AD single sign-on.


## Add Intacct from the gallery
To configure the integration of Intacct into Azure AD, you need to add Intacct from the gallery to your list of managed SaaS apps.

**To add Intacct from the gallery, perform the following steps:**

1. In the [Azure portal](https://portal.azure.com), on the left navigation panel, click the Azure AD icon.

	![Active Directory][1]

2. Go to **Enterprise applications**, and then go to **All applications**.

	![Applications][2]

3. Click the **Add** button at the top of the dialog box.

	![Applications][3]

4. In the search box, enter **Intacct**.

	![Creating an Azure AD test user](./media/active-directory-saas-intacct-tutorial/tutorial_intacct_000.png)

5. In the results panel, select **Intacct**, and then click the **Add** button to add the application.

	![Creating an Azure AD test user](./media/active-directory-saas-intacct-tutorial/tutorial_intacct_0001.png)


##  Configure and test Azure AD single sign-on
In this section, you configure and test Azure AD single sign-on with Intacct that is based on a test user called "Britta Simon."

For single sign-on to work, Azure AD needs to know what the counterpart user in Intacct is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in Intacct needs to be established.

This link relationship is established by assigning the value of the **user name** in Azure AD as the value of the **Username** in Intacct.

To configure and test Azure AD single sign-on with Intacct, you need to complete the following building blocks:

1. **[Configure Azure AD single sign-on](#configure-azure-ad-single-sign-on):** To enable your users to use this feature.
2. **[Create an Azure AD test user](#create-an-azure-ad-test-user):** To test Azure AD single sign-on with Britta Simon.
3. **[Create an Intacct test user](#create-an-intacct-test-user):** To have a counterpart of Britta Simon in Intacct that is linked to Britta's Azure AD representation.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user):** To enable Britta Simon to use Azure AD single sign-on.
5. **[Test single sign-on](#test-single-sign-on):** To verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your Intacct application.

**To configure Azure AD single sign-on with Intacct, perform the following steps:**

1. In the Azure portal, on the **Intacct** application integration page, click **Single sign-on**.

	![Configure single sign-on][4]

2. In the **Single sign-on** dialog box, for the **Mode**, select **SAML-based Sign-on** to turn on single sign-on.

	![Configure single sign-on](./media/active-directory-saas-intacct-tutorial/tutorial_intacct_01.png)

3. In the **Intacct Domain and URLs** section, perform the following steps:

	![Configure single sign-on](./media/active-directory-saas-intacct-tutorial/tutorial_intacct_02.png)

    a. For the **Identifier**, enter this URL: `https://saml.intacct.com`

	b. For the **Reply URL**, enter a URL by using the following pattern: `https://<company name>.intacct.com/ia/acct/sso_response.phtml`

	> [!NOTE]
	> Update the previous values with the actual **Identifier** and **Reply URL** value. We suggest that you use the unique value of the URL as the **Identifier**. Contact the [Intacct support team](mailto:info@intacct.com) to get these values.

4. In the **SAML Signing Certificate** section, click **Create new certificate**.

	![Configure single sign-on](./media/active-directory-saas-intacct-tutorial/tutorial_intacct_03.png) 	

5. In the **Create New Certificate** dialog box, click the calendar icon and select an **expiry date**. Then click the **Save** button.

	![Configure single sign-on](./media/active-directory-saas-intacct-tutorial/tutorial_general_300.png)

6. In the **SAML Signing Certificate** section, select **Make new certificate active** and then click the **Save** button.

	![Configure single sign-on](./media/active-directory-saas-intacct-tutorial/tutorial_intacct_04.png)

7. In the pop-up **Rollover certificate** window, click **OK**.

	![Configure single sign-on](./media/active-directory-saas-intacct-tutorial/tutorial_general_400.png)

8. In the **SAML Signing Certificate** section, click **Certificate (Base64)** and then save the certificate file on your computer.

	![Configure single sign-on](./media/active-directory-saas-intacct-tutorial/tutorial_intacct_05.png)

9. In the **Intacct Configuration** section, click **Configure Intacct** to open the **Configure sign-on** window.

	![Configure single sign-on](./media/active-directory-saas-intacct-tutorial/tutorial_intacct_06.png)

	![Configure single sign-on](./media/active-directory-saas-intacct-tutorial/tutorial_intacct_07.png)

10. In a different web browser window, sign in to your Intacct company site as an administrator.

11. Click the **Company** tab, and then click **Company Info**.

	![Configure single sign-on on app side](./media/active-directory-saas-intacct-tutorial/tutorial_intacct_001.png)

12. Click the **Security** tab, and then click **Edit**.

	![Configure single sign-on on app side](./media/active-directory-saas-intacct-tutorial/tutorial_intacct_002.png)

13. In the **Single sign on (SSO)** section, perform the following steps:

	![Configure single sign-on on app side](./media/active-directory-saas-intacct-tutorial/tutorial_intacct_003.png)

	a. Select **Enable single sign on**.

	b. For the **Identity provider type**, select **SAML 2.0**.

	c. For the **Issuer URL**, use the **SAML Entity ID** value that is listed in the Azure AD application configuration window.

	d. For the **Login URL**, use the **SAML single sign-on Service URL** value that is listed in the Azure AD application configuration window.

	e. Open your downloaded certificate in Notepad, copy the content of the certificate to your clipboard, and then paste it to the **Certificate** box.

	f. Click **Save**.



### Create an Azure AD test user
The objective of this section is to create a test user in the Azure portal called Britta Simon.

![Create Azure AD User][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the **Azure portal**, on the left navigation panel, click the Azure AD icon.

	![Creating an Azure AD test user](./media/active-directory-saas-intacct-tutorial/create_aaduser_01.png)

2. Go to **Users and groups**, and the click **All users** to display the list of users.

	![Creating an Azure AD test user](./media/active-directory-saas-intacct-tutorial/create_aaduser_02.png)

3. At the top of the dialog box, click **Add** to open the **User** dialog box.

	![Creating an Azure AD test user](./media/active-directory-saas-intacct-tutorial/create_aaduser_03.png)

4. In the **User** dialog box, perform the following steps:

	![Creating an Azure AD test user](./media/active-directory-saas-intacct-tutorial/create_aaduser_04.png)

    a. For the **Name**, enter **BrittaSimon**.

    b. For the **User name**, enter the **email address** for BrittaSimon.

	c. Select **Show Password** and write down the value of the **Password**.

    d. Click **Create**.



### Create an Intacct test user

To enable Azure AD users to sign in to Intacct, they must be provisioned into Intacct.  
In the case of Intacct, provisioning is a manual task.

### To provision a user account, perform the following steps:

1. Sign in to your Intacct company site as an administrator.

2. Click the **Company** tab, and then click **Users**.

    ![User provisioning](./media/active-directory-saas-intacct-tutorial/create_aaduser_001.png)

3. Click the **Add** tab.

	![User provisioning](./media/active-directory-saas-intacct-tutorial/create_aaduser_002.png)

4. In the **User Information** section, perform the following steps:

	![User provisioning](./media/active-directory-saas-intacct-tutorial/create_aaduser_003.png)

	a. For the **User ID**, enter the user ID for the Britta Simon account.

	b. For the **Last Name**, enter **Simon**.

	c. For the **First Name**, enter **Britta**.  

	d. For the **Email address**, enter the email address for the Britta Simon account.

	e. Select the **Admin privileges** of the Britta Simon account that you want to provision.

	f. For the **Title**, enter the title of the Britta Simon account.

	g. For the **Phone**, enter the phone number for the Britta Simon account.

	h. Click **Save**.

	> [!NOTE]
    > The Azure AD account holder receives an email and follows a link to confirm their account before it's active. To provision Azure AD user accounts, you can use other Intacct user account creation tools or APIs that are provided by Intacct.


### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting Britta access to Intacct.

![Assign user][200]

**To assign Britta Simon to Intacct, perform the following steps:**

1. In the Azure portal, open the applications view, go to the directory view, go to **Enterprise applications**, and then click **All applications**.

	![Assign user][201]

2. In the applications list, select **Intacct**.

	![Configure single sign-on](./media/active-directory-saas-intacct-tutorial/tutorial_intacct_50.png)

3. In the **Manage** menu, click **Users and groups**.

	![Assign user][202]

4. Click the **Add** button, and then in the **Add Assignment** dialog box, select **Users and groups**.

	![Assign user][203]

5. In the **Users and groups** dialog box, select **Britta Simon** from the Users list.

6. In the **Users and groups** dialog box, click the **Select** button.

7. In the **Add Assignment** dialog box, click the **Assign** button.



### Test single sign-on

In this section, you test your Azure AD single sign-on configuration by using the Access Panel.

When you click the Intacct tile in the Access Panel, you should be automatically signed in to your Intacct application.


## Additional resources

* [List of tutorials on how to integrate SaaS apps with Azure Active Directory](active-directory-saas-tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)



<!--Image references-->

[1]: ./media/active-directory-saas-intacct-tutorial/tutorial_general_01.png
[2]: ./media/active-directory-saas-intacct-tutorial/tutorial_general_02.png
[3]: ./media/active-directory-saas-intacct-tutorial/tutorial_general_03.png
[4]: ./media/active-directory-saas-intacct-tutorial/tutorial_general_04.png

[100]: ./media/active-directory-saas-intacct-tutorial/tutorial_general_100.png

[200]: ./media/active-directory-saas-intacct-tutorial/tutorial_general_200.png
[201]: ./media/active-directory-saas-intacct-tutorial/tutorial_general_201.png
[202]: ./media/active-directory-saas-intacct-tutorial/tutorial_general_202.png
[203]: ./media/active-directory-saas-intacct-tutorial/tutorial_general_203.png
