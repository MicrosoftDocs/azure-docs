---
title: 'Tutorial: Azure Active Directory integration with Coupa | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Coupa.
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila
ms.reviewer: joflore

ms.assetid: 47f27746-9057-4b9c-991e-3abf77710f73
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 12/08/2017
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Coupa

In this tutorial, you learn how to integrate Coupa with Azure Active Directory (Azure AD).

Integrating Coupa with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to Coupa.
- You can enable your users to automatically get signed-on to Coupa (Single Sign-On) with their Azure AD accounts.
- You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](active-directory-appssoaccess-whatis.md).

## Prerequisites

To configure Azure AD integration with Coupa, you need the following items:

- An Azure AD subscription
- A Coupa single sign-on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can [get a one-month trial](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding Coupa from the gallery
2. Configuring and testing Azure AD single sign-on

## Adding Coupa from the gallery
To configure the integration of Coupa into Azure AD, you need to add Coupa from the gallery to your list of managed SaaS apps.

**To add Coupa from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![The Azure Active Directory button][1]

2. Navigate to **Enterprise applications**. Then go to **All applications**.

	![The Enterprise applications blade][2]
	
3. To add new application, click **New application** button on the top of dialog.

	![The New application button][3]

4. In the search box, type **Coupa**, select **Coupa** from result panel then click **Add** button to add the application.

	![Coupa in the results list](./media/active-directory-saas-coupa-tutorial/tutorial_coupa_addfromgallery.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with Coupa based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in Coupa is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in Coupa needs to be established.

In Coupa, assign the value of the **user name** in Azure AD as the value of the **Username** to establish the link relationship.

To configure and test Azure AD single sign-on with Coupa, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
3. **[Create a Coupa test user](#create-a-coupa-test-user)** - to have a counterpart of Britta Simon in Coupa that is linked to the Azure AD representation of user.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your Coupa application.

**To configure Azure AD single sign-on with Coupa, perform the following steps:**

1. In the Azure portal, on the **Coupa** application integration page, click **Single sign-on**.

	![Configure single sign-on link][4]

2. On the **Single sign-on** dialog, select **Mode** as	**SAML-based Sign-on** to enable single sign-on.
 
	![Single sign-on dialog box](./media/active-directory-saas-coupa-tutorial/tutorial_coupa_samlbase.png)

3. On the **Coupa Domain and URLs** section, perform the following steps:

	![Coupa Domain and URLs single sign-on information](./media/active-directory-saas-coupa-tutorial/tutorial_coupa_url.png)

    a. In the **Sign-on URL** textbox, type a URL using the following pattern: `http://<companyname>.Coupa.com`

	b. In the **Identifier** textbox, type a URL using the following pattern: `<companyname>.coupahost.com`

    c. In the **Reply URL** textbox, type a URL using the following pattern: `https://<companyname>.coupahost.com/sp/ACS.saml2`

	> [!NOTE] 
	> These values are not real. Update these values with the actual Sign-On URL, Identifier, and Reply URL. Contact [Coupa Client support team](https://success.coupa.com/Support/Contact_Us?) to get these values. you will get the Reply URL value from the metadata, which is explained later in the tutorial.

4. On the **SAML Signing Certificate** section, click **Metadata XML** and then save the metadata file on your computer.

	![The Certificate download link](./media/active-directory-saas-coupa-tutorial/tutorial_coupa_certificate.png) 

5. Click **Save** button.

	![Configure Single Sign-On Save button](./media/active-directory-saas-coupa-tutorial/tutorial_general_400.png)

6. Sign on to your Coupa company site as an administrator.

7. Go to **Setup \> Security Control**.
   
   ![Security Controls](./media/active-directory-saas-coupa-tutorial/ic791900.png "Security Controls")

8. In the **Log in using Coupa credentials** section, perform the following steps:

    ![Coupa SP metadata](./media/active-directory-saas-coupa-tutorial/ic791901.png "Coupa SP metadata")
    
    a. Select **Log in using SAML**.
    
    b. To download the Coupa metadata file to your computer, click **Download and import SP metadata**. open the metadata and copy the **AssertionConsumerService index/URL** value, paste the value into the **Reply URL** textbox in the **Coupa Domain and URLs** section. 
    
    c. Click **Browse** to upload the metadata downloaded from the Azure portal.
    
    d. Click **Save**.

> [!TIP]
> You can now read a concise version of these instructions inside the [Azure portal](https://portal.azure.com), while you are setting up the app!  After adding this app from the **Active Directory > Enterprise Applications** section, simply click the **Single Sign-On** tab and access the embedded documentation through the **Configuration** section at the bottom. You can read more about the embedded documentation feature here: [Azure AD embedded documentation]( https://go.microsoft.com/fwlink/?linkid=845985)
> 

### Create an Azure AD test user

The objective of this section is to create a test user in the Azure portal called Britta Simon.

   ![Create an Azure AD test user][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the Azure portal, in the left pane, click the **Azure Active Directory** button.

    ![The Azure Active Directory button](./media/active-directory-saas-coupa-tutorial/create_aaduser_01.png)

2. To display the list of users, go to **Users and groups**, and then click **All users**.

    ![The "Users and groups" and "All users" links](./media/active-directory-saas-coupa-tutorial/create_aaduser_02.png)

3. To open the **User** dialog box, click **Add** at the top of the **All Users** dialog box.

    ![The Add button](./media/active-directory-saas-coupa-tutorial/create_aaduser_03.png)

4. In the **User** dialog box, perform the following steps:

    ![The User dialog box](./media/active-directory-saas-coupa-tutorial/create_aaduser_04.png)

    a. In the **Name** box, type **BrittaSimon**.

    b. In the **User name** box, type the email address of user Britta Simon.

    c. Select the **Show Password** check box, and then write down the value that's displayed in the **Password** box.

    d. Click **Create**.
 
### Create a Coupa test user

In order to enable Azure AD users to log into Coupa, they must be provisioned into Coupa.  

* In the case of Coupa, provisioning is a manual task.

**To configure user provisioning, perform the following steps:**

1. Log in to your **Coupa** company site as administrator.

2. In the menu on the top, click **Setup**, and then click **Users**.
   
   ![Users](./media/active-directory-saas-coupa-tutorial/ic791908.png "Users")

3. Click **Create**.
   
   ![Create Users](./media/active-directory-saas-coupa-tutorial/ic791909.png "Create Users")

4. In the **User Create** section, perform the following steps:
   
   ![User Details](./media/active-directory-saas-coupa-tutorial/ic791910.png "User Details")
   
   a. Type the **Login**, **First name**, **Last Name**, **Single Sign-On ID**, **Email** attributes of a valid Azure Active Directory account you want to provision into the related textboxes.

   b. Click **Create**.   
   
   >[!NOTE]
   >The Azure Active Directory account holder will get an email with a link to confirm the account before it becomes active. 
   > 

>[!NOTE]
>You can use any other Coupa user account creation tools or APIs provided by Coupa to provision AAD user accounts. 

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Coupa.

![Assign the user role][200] 

**To assign Britta Simon to Coupa, perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

2. In the applications list, select **Coupa**.

	![The Coupa link in the Applications list](./media/active-directory-saas-coupa-tutorial/tutorial_coupa_app.png)  

3. In the menu on the left, click **Users and groups**.

	![The "Users and groups" link][202]

4. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![The Add Assignment pane][203]

5. On **Users and groups** dialog, select **Britta Simon** in the Users list.

6. Click **Select** button on **Users and groups** dialog.

7. Click **Assign** button on **Add Assignment** dialog.
	
### Test single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Coupa tile in the Access Panel, you should get automatically signed-on to your Coupa application.
For more information about the Access Panel, see [Introduction to the Access Panel](active-directory-saas-access-panel-introduction.md). 

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](active-directory-saas-tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)

<!--Image references-->

[1]: ./media/active-directory-saas-coupa-tutorial/tutorial_general_01.png
[2]: ./media/active-directory-saas-coupa-tutorial/tutorial_general_02.png
[3]: ./media/active-directory-saas-coupa-tutorial/tutorial_general_03.png
[4]: ./media/active-directory-saas-coupa-tutorial/tutorial_general_04.png

[100]: ./media/active-directory-saas-coupa-tutorial/tutorial_general_100.png

[200]: ./media/active-directory-saas-coupa-tutorial/tutorial_general_200.png
[201]: ./media/active-directory-saas-coupa-tutorial/tutorial_general_201.png
[202]: ./media/active-directory-saas-coupa-tutorial/tutorial_general_202.png
[203]: ./media/active-directory-saas-coupa-tutorial/tutorial_general_203.png

