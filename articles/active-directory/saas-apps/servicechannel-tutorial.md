---
title: 'Tutorial: Azure Active Directory integration with ServiceChannel | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and ServiceChannel.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: c3546eab-96b5-489b-a309-b895eb428053
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 03/25/2019
ms.author: jeedes

ms.collection: M365-identity-device-management
---
# Tutorial: Azure Active Directory integration with ServiceChannel

In this tutorial, you learn how to integrate ServiceChannel with Azure Active Directory (Azure AD).
Integrating ServiceChannel with Azure AD provides you with the following benefits:

* You can control in Azure AD who has access to ServiceChannel.
* You can enable your users to be automatically signed-in to ServiceChannel (Single Sign-On) with their Azure AD accounts.
* You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).
If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To configure Azure AD integration with ServiceChannel, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get a [free account](https://azure.microsoft.com/free/)
* ServiceChannel single sign-on enabled subscription

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* ServiceChannel supports **IDP** initiated SSO
* ServiceChannel supports **Just In Time** user provisioning

## Adding ServiceChannel from the gallery

To configure the integration of ServiceChannel into Azure AD, you need to add ServiceChannel from the gallery to your list of managed SaaS apps.

**To add ServiceChannel from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon.

	![The Azure Active Directory button](common/select-azuread.png)

2. Navigate to **Enterprise Applications** and then select the **All Applications** option.

	![The Enterprise applications blade](common/enterprise-applications.png)

3. To add new application, click **New application** button on the top of dialog.

	![The New application button](common/add-new-app.png)

4. In the search box, type **ServiceChannel**, select **ServiceChannel** from result panel then click **Add** button to add the application.

	![ServiceChannel in the results list](common/search-new-app.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with ServiceChannel based on a test user called **Britta Simon**.
For single sign-on to work, a link relationship between an Azure AD user and the related user in ServiceChannel needs to be established.

To configure and test Azure AD single sign-on with ServiceChannel, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Configure ServiceChannel Single Sign-On](#configure-servicechannel-single-sign-on)** - to configure the Single Sign-On settings on application side.
3. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Create ServiceChannel test user](#create-servicechannel-test-user)** - to have a counterpart of Britta Simon in ServiceChannel that is linked to the Azure AD representation of user.
6. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal.

To configure Azure AD single sign-on with ServiceChannel, perform the following steps:

1. In the [Azure portal](https://portal.azure.com/), on the **ServiceChannel** application integration page, select **Single sign-on**.

    ![Configure single sign-on link](common/select-sso.png)

2. On the **Select a Single sign-on method** dialog, select **SAML/WS-Fed** mode to enable single sign-on.

    ![Single sign-on select mode](common/select-saml-option.png)

3. On the **Set up Single Sign-On with SAML** page, click **Edit** icon to open **Basic SAML Configuration** dialog.

	![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Set up Single Sign-On with SAML** page, perform the following steps:

    ![ServiceChannel Domain and URLs single sign-on information](common/idp-intiated.png)

    a. In the **Identifier** text box, type the value as:
    `http://adfs.<domain>.com/adfs/service/trust`

    b. In the **Reply URL** text box, type a URL using the following pattern:
    `https://<customer domain>.servicechannel.com/saml/acs`

	> [!NOTE]
	> These values are not real. Update these values with the actual Identifier and Reply URL. Here we suggest you to use the unique value of string in the Identifier. Contact [ServiceChannel Client support team](https://servicechannel.zendesk.com/hc/en-us) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

5. Your ServiceChannel application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes, where as **nameidentifier** is mapped with **user.userprincipalname**. ServiceChannel application expects **nameidentifier** to be mapped with **user.mail**, so you need to edit the attribute mapping by clicking on **Edit** icon and change the attribute mapping.

	You can refer ServiceChannel guide [here](https://servicechannel.zendesk.com/hc/en-us/articles/217514326-Azure-AD-Configuration-Example) for more guidance on claims.

	![image](common/edit-attribute.png)

	> [!NOTE]
	> See [Manage access using RBAC and the Azure portal](../../role-based-access-control/role-assignments-portal.md) to learn how to configure **Role** in Azure AD.

6. In addition to above, if you are planning to enable Just In Time user provisioning, then you should add the following claims as shown below. **Role** claim needs to be mapped to **user.assignedroles** which contains the role of the user. In the **User Claims** section on the **User Attributes** dialog, perform the following steps to add SAML token attribute as shown in the below table:

	| Name   |  Source Attribute |
	| ------ | --- |
	| Role   | user.assignedroles |

	a. Click **Add new claim** to open the **Manage user claims** dialog.

	![image](common/new-save-attribute.png)

	![image](common/new-attribute-details.png)

	b. In the **Name** textbox, type the attribute name shown for that row.

	c. Leave the **Namespace** blank.

	d. Select Source as **Attribute**.

	e. From the **Source attribute** list, type the attribute value shown for that row.

	f. Click **Ok**

	g. Click **Save**.

7. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Certificate (Base64)** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

8. On the **Set up ServiceChannel** section, copy the appropriate URL(s) as per your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

	a. Login URL

	b. Azure AD Identifier

	c. Logout URL

### Configure ServiceChannel Single Sign-On

To configure single sign-on on **ServiceChannel** side, you need to send the downloaded **Certificate (Base64)** and appropriate copied URLs from Azure portal to [ServiceChannel support team](https://servicechannel.zendesk.com/hc/en-us). They set this setting to have the SAML SSO connection set properly on both sides.

### Create an Azure AD test user

The objective of this section is to create a test user in the Azure portal called Britta Simon.

1. In the Azure portal, in the left pane, select **Azure Active Directory**, select **Users**, and then select **All users**.

    ![The "Users and groups" and "All users" links](common/users.png)

2. Select **New user** at the top of the screen.

    ![New user Button](common/new-user.png)

3. In the User properties, perform the following steps.

    ![The User dialog box](common/user-properties.png)

    a. In the **Name** field enter **BrittaSimon**.
  
    b. In the **User name** field type `brittasimon@yourcompanydomain.extension`  
    For example, BrittaSimon@contoso.com

    c. Select **Show password** check box, and then write down the value that's displayed in the Password box.

    d. Click **Create**.

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to ServiceChannel.

1. In the Azure portal, select **Enterprise Applications**, select **All applications**, then select **ServiceChannel**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **ServiceChannel**.

	![The ServiceChannel link in the Applications list](common/all-applications.png)

3. In the menu on the left, select **Users and groups**.

    ![The "Users and groups" link](common/users-groups-blade.png)

4. Click the **Add user** button, then select **Users and groups** in the **Add Assignment** dialog.

    ![The Add Assignment pane](common/add-assign-user.png)

5. In the **Users and groups** dialog select **Britta Simon** in the Users list, then click the **Select** button at the bottom of the screen.

6. If you are expecting any role value in the SAML assertion then in the **Select Role** dialog select the appropriate role for the user from the list, then click the **Select** button at the bottom of the screen.

7. In the **Add Assignment** dialog click the **Assign** button.

### Create ServiceChannel test user

Application supports Just in time user provisioning and after authentication users will be created in the application automatically. For full user provisioning, please contact [ServiceChannel support team](https://servicechannel.zendesk.com/hc/en-us)

### Test single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the ServiceChannel tile in the Access Panel, you should be automatically signed in to the ServiceChannel for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional Resources

- [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is Conditional Access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)
