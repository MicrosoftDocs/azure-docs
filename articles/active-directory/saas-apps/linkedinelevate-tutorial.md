---
title: 'Tutorial: Azure Active Directory integration with LinkedIn Elevate | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and LinkedIn Elevate.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: 2ad9941b-c574-42c3-bd0f-5d6ec68537ef
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 04/17/2019
ms.author: jeedes

ms.collection: M365-identity-device-management
---
# Tutorial: Azure Active Directory integration with LinkedIn Elevate

In this tutorial, you learn how to integrate LinkedIn Elevate with Azure Active Directory (Azure AD).
Integrating LinkedIn Elevate with Azure AD provides you with the following benefits:

* You can control in Azure AD who has access to LinkedIn Elevate.
* You can enable your users to be automatically signed-in to LinkedIn Elevate (Single Sign-On) with their Azure AD accounts.
* You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).
If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To configure Azure AD integration with LinkedIn Elevate, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get a [free account](https://azure.microsoft.com/free/)
* LinkedIn Elevate single sign-on enabled subscription

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* LinkedIn Elevate supports **SP and IDP** initiated SSO

* LinkedIn Elevate supports **Just In Time** user provisioning

* LinkedIn Elevate supports [**Automated** user provisioning](linkedinelevate-provisioning-tutorial.md)

## Adding LinkedIn Elevate from the gallery

To configure the integration of LinkedIn Elevate into Azure AD, you need to add LinkedIn Elevate from the gallery to your list of managed SaaS apps.

**To add LinkedIn Elevate from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon.

	![The Azure Active Directory button](common/select-azuread.png)

2. Navigate to **Enterprise Applications** and then select the **All Applications** option.

	![The Enterprise applications blade](common/enterprise-applications.png)

3. To add new application, click **New application** button on the top of dialog.

	![The New application button](common/add-new-app.png)

4. In the search box, type **LinkedIn Elevate**, select **LinkedIn Elevate** from result panel then click **Add** button to add the application.

	![LinkedIn Elevate in the results list](common/search-new-app.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with LinkedIn Elevate based on a test user called **Britta Simon**.
For single sign-on to work, a link relationship between an Azure AD user and the related user in LinkedIn Elevate needs to be established.

To configure and test Azure AD single sign-on with LinkedIn Elevate, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Configure LinkedIn Elevate Single Sign-On](#configure-linkedin-elevate-single-sign-on)** - to configure the Single Sign-On settings on application side.
3. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Create LinkedIn Elevate test user](#create-linkedin-elevate-test-user)** - to have a counterpart of Britta Simon in LinkedIn Elevate that is linked to the Azure AD representation of user.
6. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal.

To configure Azure AD single sign-on with LinkedIn Elevate, perform the following steps:

1. In the [Azure portal](https://portal.azure.com/), on the **LinkedIn Elevate** application integration page, select **Single sign-on**.

    ![Configure single sign-on link](common/select-sso.png)

2. On the **Select a Single sign-on method** dialog, select **SAML/WS-Fed** mode to enable single sign-on.

    ![Single sign-on select mode](common/select-saml-option.png)

3. On the **Set up Single Sign-On with SAML** page, click **Edit** icon to open **Basic SAML Configuration** dialog.

	![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, if you wish to configure the application in **IDP** initiated mode, perform the following steps:

    ![LinkedIn Elevate Domain and URLs single sign-on information](common/idp-intiated.png)

    a. In the **Identifier** text box, enter the **Entity ID** value, you will copy Entity ID value from the Linkedin Portal explained later in this tutorial.

    b. In the **Reply URL** text box, enter the **Assertion Consumer Access (ACS) Url** value, you will copy Assertion Consumer Access (ACS) Url value from the Linkedin Portal explained later in this tutorial.

5. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

    ![LinkedIn Elevate Domain and URLs single sign-on information](common/metadata-upload-additional-signon.png)

    In the **Sign-on URL** text box, type a URL using the following pattern:
    `https://www.linkedin.com/checkpoint/enterprise/login/<AccountId>?application=elevate&applicationInstanceId=<InstanceId>`

6. LinkedIn Elevate application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes, where as **nameidentifier** is mapped with **user.userprincipalname**. LinkedIn Elevate application expects nameidentifier to be mapped with **user.mail**, so you need to edit the attribute mapping by clicking on Edit icon and change the attribute mapping.

	![image](common/edit-attribute.png)

7. In addition to above, LinkedIn Elevate application expects few more attributes to be passed back in SAML response. In the User Claims section on the **User Attributes** dialog, perform the following steps to add SAML token attribute as shown in the below table:

	| Name | Source Attribute|
	| -------| -------------|
	| department | user.department |

	a. Click **Add new claim** to open the **Manage user claims** dialog.

	![image](common/new-save-attribute.png)

	![image](common/new-attribute-details.png)

	b. In the **Name** textbox, type the attribute name shown for that row.

	c. Leave the **Namespace** blank.

	d. Select Source as **Attribute**.

	e. From the **Source attribute** list, type the attribute value shown for that row.

	f. Click **Ok**

	g. Click **Save**.

8. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Federation Metadata XML** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

9. On the **Set up LinkedIn Elevate** section, copy the appropriate URL(s) as per your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

	a. Login URL

	b. Azure AD Identifier

	c. Logout URL

### Configure LinkedIn Elevate Single Sign-On

1. In a different web browser window, sign-on to your LinkedIn Elevate tenant as an administrator.

1. In **Account Center**, click **Global Settings** under **Settings**. Also, select **Elevate - Elevate AAD Test** from the dropdown list.

	![Configure Single Sign-On](./media/linkedinelevate-tutorial/tutorial_linkedin_admin_01.png)

1. Click on **OR Click Here to load and copy individual fields from the form** and perform the following steps:

	![Configure Single Sign-On](./media/linkedinelevate-tutorial/tutorial_linkedin_admin_03.png)

	a. Copy **Entity Id** and paste it into the **Identifier** text box in the **Basic SAML Configuration** in the Azure portal.

	b. Copy **Assertion Consumer Access (ACS) Url** and paste it into the **Reply URL** text box in the **Basic SAML Configuration** in the Azure portal.

1. Go to **LinkedIn Admin Settings** section. Upload the XML file that you have downloaded from the Azure portal by clicking on the Upload XML file option.

	![Configure Single Sign-On](./media/linkedinelevate-tutorial/tutorial_linkedin_metadata_03.png)

1. Click **On** to enable SSO. SSO status will change from **Not Connected** to **Connected**

	![Configure Single Sign-On](./media/linkedinelevate-tutorial/tutorial_linkedin_admin_05.png)

### Create an Azure AD test user

The objective of this section is to create a test user in the Azure portal called Britta Simon.

1. In the Azure portal, in the left pane, select **Azure Active Directory**, select **Users**, and then select **All users**.

    ![The "Users and groups" and "All users" links](common/users.png)

2. Select **New user** at the top of the screen.

    ![New user Button](common/new-user.png)

3. In the User properties, perform the following steps.

    ![The User dialog box](common/user-properties.png)

    a. In the **Name** field enter **BrittaSimon**.
  
    b. In the **User name** field type `brittasimon@yourcompanydomain.extension`. For example, BrittaSimon@contoso.com

    c. Select **Show password** check box, and then write down the value that's displayed in the Password box.

    d. Click **Create**.

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to LinkedIn Elevate.

1. In the Azure portal, select **Enterprise Applications**, select **All applications**, then select **LinkedIn Elevate**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **LinkedIn Elevate**.

	![The LinkedIn Elevate link in the Applications list](common/all-applications.png)

3. In the menu on the left, select **Users and groups**.

    ![The "Users and groups" link](common/users-groups-blade.png)

4. Click the **Add user** button, then select **Users and groups** in the **Add Assignment** dialog.

    ![The Add Assignment pane](common/add-assign-user.png)

5. In the **Users and groups** dialog select **Britta Simon** in the Users list, then click the **Select** button at the bottom of the screen.

6. If you are expecting any role value in the SAML assertion then in the **Select Role** dialog select the appropriate role for the user from the list, then click the **Select** button at the bottom of the screen.

7. In the **Add Assignment** dialog click the **Assign** button.

### Create LinkedIn Elevate test user

LinkedIn Elevate Application supports Just in time user provisioning and after authentication users will be created in the application automatically. On the admin settings page on the LinkedIn Elevate portal flip the switch **Automatically Assign licenses** to active Just in time provisioning and this will also assign a license to the user. LinkedIn Elevate also supports automatic user provisioning, you can find more details [here](linkedinelevate-provisioning-tutorial.md) on how to configure automatic user provisioning.

   ![Creating an Azure AD test user](./media/linkedinelevate-tutorial/LinkedinUserprovswitch.png)

### Test single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the LinkedIn Elevate tile in the Access Panel, you should be automatically signed in to the LinkedIn Elevate for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional Resources

- [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is Conditional Access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)