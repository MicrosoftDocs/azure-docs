---
title: 'Tutorial: Azure Active Directory integration with LinkedIn Learning | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and LinkedIn Learning.
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila

ms.assetid: d5857070-bf79-4bd3-9a2a-4c1919a74946
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/31/2017
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with LinkedIn Learning

In this tutorial, you learn how to integrate LinkedIn Learning with Azure Active Directory (Azure AD).

Integrating LinkedIn Learning with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to LinkedIn Learning
- You can enable your users to automatically get signed-on to LinkedIn Learning (Single Sign-On) with their Azure AD accounts
- You can manage your accounts in one central location - the Azure Management portal

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](active-directory-appssoaccess-whatis.md).

## Prerequisites

To configure Azure AD integration with LinkedIn Learning, you need the following items:

- An Azure AD subscription
- A LinkedIn Learning single-sign on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- You should not use your production environment, unless this is necessary.
- If you don't have an Azure AD trial environment, you can get an one-month trial [here](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding LinkedIn Learning from the gallery
2. Configuring and testing Azure AD single sign-on

## Adding LinkedIn Learning from the gallery
To configure the integration of LinkedIn Learning into Azure AD, you need to add LinkedIn Learning from the gallery to your list of managed SaaS apps.

**To add LinkedIn Learning from the gallery, perform the following steps:**

1. In the **[Azure Management Portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![Active Directory][1]

2. Navigate to **Enterprise applications**. Then go to **All applications**.

	![Applications][2]
	
3. Click **Add** button on the top of the dialog.

	![Applications][3]

4. In the search box, type **LinkedIn Learning**. From results panel, click **LinkedIn Learning** to add the application.

	![Creating an Azure AD test user](./media/active-directory-saas-linkedinlearning-tutorial/tutorial-linkedinlearning_000.png)

##  Configuring and testing Azure AD single sign-on
In this section, you configure and test Azure AD single sign-on with LinkedIn Learning based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in LinkedIn Learning is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in LinkedIn Learning needs to be established.

This link relationship is established by assigning the value of the **user name** in Azure AD as the value of the **Username** in LinkedIn Learning.

To configure and test Azure AD single sign-on with LinkedIn Learning, you need to complete the following building blocks:

1. **[Configuring Azure AD Single Sign-On](#configuring-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Creating an Azure AD test user](#creating-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
3. **[Creating a LinkedIn Learning test user](#creating-a-linkedin-learning-test-user)** - to test Azure AD single sign-on with Britta Simon.
4. **[Assigning the Azure AD test user](#assigning-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Testing Single Sign-On](#testing-single-sign-on)** - to verify whether the configuration works.

### Configuring Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure Management portal and configure single sign-on in your LinkedIn Learning application.

**To configure Azure AD single sign-on with LinkedIn Learning, perform the following steps:**

1. In the Azure Management portal, on the **LinkedIn Learning** application integration page, click **Single sign-on**.

	![Configure Single Sign-On][4]

2. On the **Single sign-on** dialog, as **Mode** select **SAML-based Sign-on** to enable single sign on.
 
	![Configure Single Sign-On](./media/active-directory-saas-linkedinlearning-tutorial/tutorial-linkedin_01.png)

3. In a different web browser window, sign-on to your LinkedIn Learning tenant as an administrator.

4. In **Account Center**, click **Global Settings** under **Settings**. Also, select **Learning - Default** from the dropdown list.

	![Configure Single Sign-On](./media/active-directory-saas-linkedinlearning-tutorial/tutorial_linkedin_admin_01.png)

5. Click on **OR Click Here to load and copy individual fields from the form** and copy **Entity Id** and **Assertion Consumer Access (ACS) Url**

	![Configure Single Sign-On](./media/active-directory-saas-linkedinlearning-tutorial/tutorial_linkedin_admin_03.png)

6. On Azure Portal, under **LinkedIn Learning Domain and URLs**, perform the following steps if you want to configure SSO in **IdP Initiated** mode

	![Configure Single Sign-On](./media/active-directory-saas-linkedinlearning-tutorial/tutorial_linkedin_signon_01.png)

    a. In the **Identifier** textbox, enter the **Entity ID** copied from LinkedIn Portal 

	b. In the **Reply URL** textbox, enter the **Assertion Consumer Access (ACS) Url** copied from LinkedIn Portal

7. If you want to configure SSO in **SP Initiated**, then click Show Advanced URL setting option in the configuration section and configure the sign on URL with the following pattern:

	`https://www.linkedin.com/checkpoint/enterprise/login/<AccountId>?application=learning&applicationInstanceId=<InstanceId>`

	![Configure Single Sign-On](./media/active-directory-saas-linkedinlearning-tutorial/tutorial_linkedin_signon_02.png)   
	
8. Your LinkedIn Learning application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows an example for this. The default value of **User Identifier** is **user.userprincipalname** but LinkedIn Learning expects this to be mapped with the user's email address. For that you can use **user.mail** attribute from the list or use the appropriate attribute value based on your organization configuration. 

	![Configure Single Sign-On](./media/active-directory-saas-linkedinlearning-tutorial/updateusermail.png)
	
9. In **User Attributes** section, click **View and edit all other user attributes** and set the attributes. You need to add another claim named **department** and the value needs to be mapped to **user.department**.

	| Attribute Name | Attribute Value |
	| --- | --- |    
	| department| user.department |

   ![Creating an Azure AD test user](./media/active-directory-saas-linkedinlearning-tutorial/userattribute.png)

   a. Click on Add attribute to open the attribute details page add the department attribute as shown below-

   ![Creating an Azure AD test user](./media/active-directory-saas-linkedinLearning-tutorial/adduserattribute.png)
   
   b. Click on **Ok** to save the attribute.

10. On the **SAML Signing Certificate** section, click **Metadata XML** and then save the XML file on your computer.

	![Configure Single Sign-On](./media/active-directory-saas-linkedinlearning-tutorial/tutorial-linkedinlearning_certificate.png) 

11. Click **Save**.

	![Configure Single Sign-On](./media/active-directory-saas-linkedinlearning-tutorial/tutorial_general_400.png)

12. Go to **LinkedIn Admin Settings** section. Upload the XML file you just downloaded from the Azure portal by clicking on the Upload XML file option.

	![Configure Single Sign-On](./media/active-directory-saas-linkedinlearning-tutorial/tutorial_linkedin_metadata_03.png)

13. Click **On** to enable SSO. SSO status will change from **Not Connected** to **Connected**

	![Configure Single Sign-On](./media/active-directory-saas-linkedinlearning-tutorial/tutorial_linkedin_admin_05.png)

### Creating an Azure AD test user
The objective of this section is to create a test user in the Azure Management portal called Britta Simon.

![Create Azure AD User][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the **Azure Management portal**, on the left navigation pane, click **Azure Active Directory** icon.

	![Creating an Azure AD test user](./media/active-directory-saas-linkedinlearning-tutorial/create_aaduser_01.png) 

2. Go to **Users and groups** and click **All users** to display the list of users.
	
	![Creating an Azure AD test user](./media/active-directory-saas-linkedinlearning-tutorial/create_aaduser_02.png) 

3. At the top of the dialog click **Add** to open the **User** dialog.
 
	![Creating an Azure AD test user](./media/active-directory-saas-linkedinlearning-tutorial/create_aaduser_03.png) 

4. On the **User** dialog page, perform the following steps:
 
	![Creating an Azure AD test user](./media/active-directory-saas-linkedinlearning-tutorial/create_aaduser_04.png) 

    a. In the **Name** textbox, type **BrittaSimon**.

    b. In the **User name** textbox, type the **email address** of BrittaSimon.

	c. Select **Show Password** and write down the value of the **Password**.

    d. Click **Create**. 

### Creating a LinkedIn Learning test user

Linked Learning Application supports Just in time user provisioning and after authentication users will be created in the application automatically. On the admin settings page on the LinkedIn Learning portal flip the switch **Automatically Assign licenses** to active to enable Just in time provisioning and this will also assign a license to the user.
   
   ![Creating an Azure AD test user](./media/active-directory-saas-linkedinLearning-tutorial/LinkedinUserprovswitch.png)

### Assigning the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting her access to LinkedIn Learning.

![Assign User][200] 

**To assign Britta Simon to LinkedIn Learning, perform the following steps:**

1. In the Azure Management portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

2. In the applications list, select **LinkedIn Learning**.

	![Configure Single Sign-On](./media/active-directory-saas-linkedinlearning-tutorial/tutorial-linkedinlearning_0001.png) 

3. In the menu on the left, click **Users and groups**.

	![Assign User][202] 

4. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![Assign User][203]

5. On **Users and groups** dialog, select **Britta Simon** in the Users list.

6. Click **Select** button on **Users and groups** dialog.

7. Click **Assign** button on **Add Assignment** dialog.
	
### Testing single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the LinkedIn Learning tile in the Access Panel, you should get the Azure Sign-on page and on after successful sign-on, you should get into your LinkedIn Learning application.

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](active-directory-saas-tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)


<!--Image references-->

[1]: ./media/active-directory-saas-linkedinlearning-tutorial/tutorial_general_01.png
[2]: ./media/active-directory-saas-linkedinlearning-tutorial/tutorial_general_02.png
[3]: ./media/active-directory-saas-linkedinlearning-tutorial/tutorial_general_03.png
[4]: ./media/active-directory-saas-linkedinlearning-tutorial/tutorial_general_04.png

[100]: ./media/active-directory-saas-linkedinlearning-tutorial/tutorial_general_100.png

[200]: ./media/active-directory-saas-linkedinlearning-tutorial/tutorial_general_200.png
[201]: ./media/active-directory-saas-linkedinlearning-tutorial/tutorial_general_201.png
[202]: ./media/active-directory-saas-linkedinlearning-tutorial/tutorial_general_202.png
[203]: ./media/active-directory-saas-linkedinlearning-tutorial/tutorial_general_203.png
