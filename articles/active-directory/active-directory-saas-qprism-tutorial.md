---
title: 'Tutorial: Azure Active Directory integration with QPrism | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and QPrism.
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila
ms.reviewer: joflore

ms.assetid: 72ab75ba-132b-4f83-a34b-d28b81b6d7bc
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/13/2017
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with QPrism

In this tutorial, you learn how to integrate QPrism with Azure Active Directory (Azure AD).

Integrating QPrism with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to QPrism.
- You can enable your users to automatically get signed on to QPrism (single sign-on) with their Azure AD accounts.
- You can manage your accounts in one central location: the Azure portal.

For more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md).

## Prerequisites

To configure Azure AD integration with QPrism, you need the following items:

- An Azure AD subscription
- A QPrism single-sign on enabled subscription

To test the steps in this tutorial, follow these recommendations:

- Don't use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can [get a one-month trial](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding QPrism from the gallery
2. Configuring and testing Azure AD single sign-on

## Add QPrism from the gallery
To configure the integration of QPrism into Azure AD, you need to add QPrism from the gallery to your list of managed SaaS apps.

**To add QPrism from the gallery:**

1. In the [Azure portal](https://portal.azure.com), in the left pane, select **Azure Active Directory**. 

	![The Azure Active Directory button][1]

2. Navigate to **Enterprise applications** > **All applications**.

	![The Enterprise applications blade][2]
	
3. To add a new application, at the top of the dialog box, select **New application**.

	![The New application button][3]

4. In the search box, type **QPrism**, and select **QPrism** from result panel. Then click **Add** to add the application.

	![QPrism in the results list](./media/active-directory-saas-qprism-tutorial/tutorial_qprism_addfromgallery.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with QPrism, based on a test user called "Britta Simon."

For single sign-on to work, Azure AD needs to know who the counterpart user in QPrism is to a user in Azure AD. In other words, there must be a linked relationship between an Azure AD user and the related user in QPrism.

To establish this relationship, in QPrism, assign the value of the **user name** in Azure AD as the value of the **Username**.

To configure and test Azure AD single sign-on with QPrism, complete the following building blocks:

1. [Configure Azure AD single sign-on](#configure-azure-ad-single-sign-on) to enable your users to use this feature.
2. [Create an Azure AD test user](#create-an-azure-ad-test-user) to test Azure AD single sign-on with Britta Simon.
3. [Create a QPrism test user](#create-a-qprism-test-user) to have a counterpart of Britta Simon in QPrism who is linked to the Azure AD representation of user.
4. [Assign the Azure AD test user](#assign-the-azure-ad-test-user) to enable Britta Simon to use Azure AD single sign-on.
5. [Test single sign-on](#test-single-sign-on) to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal, and configure single sign-on in your QPrism application.

1. In the Azure portal, on the **QPrism** application integration page, select **Single sign-on**.

	![Configure single sign-on link][4]

2. On the **Single sign-on** dialog box, select **Mode** as	**SAML-based Sign-on** to enable single sign-on.
 
	![Single sign-on dialog box](./media/active-directory-saas-qprism-tutorial/tutorial_qprism_samlbase.png)

3. In the **QPrism Domain and URLs** section, do the following:

	![QPrism Domain and URLs single sign-on information](./media/active-directory-saas-qprism-tutorial/tutorial_qprism_url.png)

    a. In the **Sign-on URL** text box, type a URL that uses the following pattern: `https://<customer domain>.qmyzone.com/login`

    b. In the **Identifier** text box, type a URL that uses the following pattern: `https://<customer domain>.qmyzone.com/metadata.php`
    	 
	> [!NOTE] 
	> These values are not real. Update these values with the actual identifier and sign-on URL. Contact [QPrism Client support team](mailto:qsupport-ce@quatrro.com) to get these values. 

4. To generate the **Metadata** URL, do the following:

    a. Select **App registrations**.
    
    ![Configure single sign-on app registrations](./media/active-directory-saas-qprism-tutorial/tutorial_qprism_appregistrations.png)
   
    b. Select **Endpoints** to open **Endpoints** dialog box.  
    
    ![Configure single sign-on endpoint](./media/active-directory-saas-qprism-tutorial/tutorial_qprism_endpointicon.png)

    c. Select the copy button to copy the **FEDERATION METADATA DOCUMENT** URL, and paste it into Notepad.
    
    ![Configure single sign-on endpoint](./media/active-directory-saas-qprism-tutorial/tutorial_qprism_endpoint.png)
     
    d. Now go to the property page of **QPrism**, and copy the **Application ID** by using **Copy**. Then paste it into Notepad.
 
    ![Configure single sign-on application ID](./media/active-directory-saas-qprism-tutorial/tutorial_qprism_appid.png)

    e. Generate the **Metadata URL** by using the following pattern: `<FEDERATION METADATA DOCUMENT url>?appid=<application id>` 

5. Select **Save**.

	![Configure single sign-on Save button](./media/active-directory-saas-qprism-tutorial/tutorial_general_400.png)
	
6. To configure single sign-on on the **QPrism** side, send the **Metadata URL** to the [QPrism support team](mailto:qsupport-ce@quatrro.com). They ensure that the SAML single sign-on connection is set properly on both sides.

> [!TIP]
> You can now read a concise version of these instructions inside the [Azure portal](https://portal.azure.com), while you are setting up the app. After you add this app from the **Active Directory** > **Enterprise Applications** section, simply click the **Single Sign-On** tab and access the embedded documentation through the **Configuration** section at the bottom. You can read more about the embedded documentation feature here: [Azure AD embedded documentation]( https://go.microsoft.com/fwlink/?linkid=845985).

### Create an Azure AD test user

The objective of this section is to create a test user in the Azure portal called Britta Simon.

   ![Create an Azure AD test user][100]

**To create a test user in Azure AD:**

1. In the Azure portal, in the left pane, select **Azure Active Directory**.

    ![The Azure Active Directory button](./media/active-directory-saas-qprism-tutorial/create_aaduser_01.png)

2. To display the list of users, go to **Users and groups**, and then click **All users**.

    ![The "Users and groups" and "All users" links](./media/active-directory-saas-qprism-tutorial/create_aaduser_02.png)

3. To open the **User** dialog box, at the top of the **All Users** dialog box, select **Add**.

    ![The Add button](./media/active-directory-saas-qprism-tutorial/create_aaduser_03.png)

4. In the **User** dialog box, do the following:

    ![The User dialog box](./media/active-directory-saas-qprism-tutorial/create_aaduser_04.png)

    a. In the **Name** box, type **BrittaSimon**.

    b. In the **User name** box, type the email address of user Britta Simon.

    c. Select the **Show Password** check box, and then write down the value that's displayed in the **Password** box.

    d. Select **Create**.
 
### Create a QPrism test user

In this section, you create a user called Britta Simon in QPrism. Work with the [QPrism support team](mailto:qsupport-ce@quatrro.com) to add users in the QPrism platform. Users must be created and activated before you use single sign-on. 

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to QPrism.

![Assign the user role][200] 

**To assign Britta Simon to QPrism:**

1. In the Azure portal, open the applications view, and then navigate to the directory view. Go to **Enterprise applications**, and select **All applications**.

	![Assign User][201] 

2. In the applications list, select **QPrism**.

	![The QPrism link in the applications list](./media/active-directory-saas-qprism-tutorial/tutorial_qprism_app.png)  

3. In the menu on the left, select **Users and groups**.

	![The "Users and groups" link][202]

4. Select **Add**. Then, under **Add Assignment**, select **Users and groups**.

	![The Add Assignment pane][203]

5. On the **Users and groups** dialog box, select **Britta Simon** in the **Users** list.

6. On the **Users and groups** dialog box, select **Select**.

7. Under **Add Assignment**, select **Assign**.
	
### Test single sign-on

In this section, you test your Azure AD single sign-on configuration by using the Access Panel.

In the Access Panel, when you select the QPrism tile, you should get automatically signed on to your QPrism application.
For more information about the Access Panel, see [Introduction to the Access Panel](active-directory-saas-access-panel-introduction.md). 

## Additional resources

* [List of tutorials on how to integrate SaaS apps with Azure Active Directory](active-directory-saas-tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)



<!--Image references-->

[1]: ./media/active-directory-saas-qprism-tutorial/tutorial_general_01.png
[2]: ./media/active-directory-saas-qprism-tutorial/tutorial_general_02.png
[3]: ./media/active-directory-saas-qprism-tutorial/tutorial_general_03.png
[4]: ./media/active-directory-saas-qprism-tutorial/tutorial_general_04.png

[100]: ./media/active-directory-saas-qprism-tutorial/tutorial_general_100.png

[200]: ./media/active-directory-saas-qprism-tutorial/tutorial_general_200.png
[201]: ./media/active-directory-saas-qprism-tutorial/tutorial_general_201.png
[202]: ./media/active-directory-saas-qprism-tutorial/tutorial_general_202.png
[203]: ./media/active-directory-saas-qprism-tutorial/tutorial_general_203.png

