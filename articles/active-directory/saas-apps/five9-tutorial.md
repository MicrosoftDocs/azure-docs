---
title: 'Tutorial: Azure Active Directory integration with Five9 Plus Adapter (CTI, Contact Center Agents) | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Five9 Plus Adapter (CTI, Contact Center Agents).
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: 88dc82ab-be0b-4017-8335-c47d00775d7b
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 04/04/2019
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Five9 Plus Adapter (CTI, Contact Center Agents)

In this tutorial, you learn how to integrate Five9 Plus Adapter (CTI, Contact Center Agents) with Azure Active Directory (Azure AD).
Integrating Five9 Plus Adapter (CTI, Contact Center Agents) with Azure AD provides you with the following benefits:

* You can control in Azure AD who has access to Five9 Plus Adapter (CTI, Contact Center Agents).
* You can enable your users to be automatically signed-in to Five9 Plus Adapter (CTI, Contact Center Agents) (Single Sign-On) with their Azure AD accounts.
* You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).
If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To configure Azure AD integration with Five9 Plus Adapter (CTI, Contact Center Agents), you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get a [free account](https://azure.microsoft.com/free/).
* Five9 Plus Adapter (CTI, Contact Center Agents) single sign-on enabled subscription

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* Five9 Plus Adapter (CTI, Contact Center Agents) supports **IDP** initiated SSO

## Adding Five9 Plus Adapter (CTI, Contact Center Agents) from the gallery

To configure the integration of Five9 Plus Adapter (CTI, Contact Center Agents) into Azure AD, you need to add Five9 Plus Adapter (CTI, Contact Center Agents) from the gallery to your list of managed SaaS apps.

**To add Five9 Plus Adapter (CTI, Contact Center Agents) from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon.

	![The Azure Active Directory button](common/select-azuread.png)

2. Navigate to **Enterprise Applications** and then select the **All Applications** option.

	![The Enterprise applications blade](common/enterprise-applications.png)

3. To add new application, click **New application** button on the top of dialog.

	![The New application button](common/add-new-app.png)

4. In the search box, type **Five9 Plus Adapter (CTI, Contact Center Agents)**, select **Five9 Plus Adapter (CTI, Contact Center Agents)** from result panel then click **Add** button to add the application.

	 ![Five9 Plus Adapter (CTI, Contact Center Agents) in the results list](common/search-new-app.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with Five9 Plus Adapter (CTI, Contact Center Agents) based on a test user called **Britta Simon**.
For single sign-on to work, a link relationship between an Azure AD user and the related user in Five9 Plus Adapter (CTI, Contact Center Agents) needs to be established.

To configure and test Azure AD single sign-on with Five9 Plus Adapter (CTI, Contact Center Agents), you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Configure Five9 Plus Adapter (CTI, Contact Center Agents) Single Sign-On](#configure-five9-plus-adapter-cti-contact-center-agents-single-sign-on)** - to configure the Single Sign-On settings on application side.
3. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Create Five9 Plus Adapter (CTI, Contact Center Agents) test user](#create-five9-plus-adapter-cti-contact-center-agents-test-user)** - to have a counterpart of Britta Simon in Five9 Plus Adapter (CTI, Contact Center Agents) that is linked to the Azure AD representation of user.
6. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal.

To configure Azure AD single sign-on with Five9 Plus Adapter (CTI, Contact Center Agents), perform the following steps:

1. In the [Azure portal](https://portal.azure.com/), on the **Five9 Plus Adapter (CTI, Contact Center Agents)** application integration page, select **Single sign-on**.

    ![Configure single sign-on link](common/select-sso.png)

2. On the **Select a Single sign-on method** dialog, select **SAML/WS-Fed** mode to enable single sign-on.

    ![Single sign-on select mode](common/select-saml-option.png)

3. On the **Set up Single Sign-On with SAML** page, click **Edit** icon to open **Basic SAML Configuration** dialog.

	![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Set up Single Sign-On with SAML** page, perform the following steps:

    ![Five9 Plus Adapter (CTI, Contact Center Agents) Domain and URLs single sign-on information](common/idp-intiated.png)

    a. In the **Identifier** text box, type a URL using the following pattern:
    
	|    Environment      |       URL      |
	| :-- | :-- |
	| For “Five9 Plus Adapter for Microsoft Dynamics CRM” | `https://app.five9.com/appsvcs/saml/metadata/alias/msdc` |
	| For “Five9 Plus Adapter for Zendesk” | `https://app.five9.com/appsvcs/saml/metadata/alias/zd` |
	| For “Five9 Plus Adapter for Agent Desktop Toolkit” | `https://app.five9.com/appsvcs/saml/metadata/alias/adt` |

    b. In the **Reply URL** text box, type a URL using the following pattern:

    |      Environment     |      URL      |
	| :--                  | :--           |
	| For “Five9 Plus Adapter for Microsoft Dynamics CRM” | `https://app.five9.com/appsvcs/saml/SSO/alias/msdc` |
	| For “Five9 Plus Adapter for Zendesk” | `https://app.five9.com/appsvcs/saml/SSO/alias/zd` |
	| For “Five9 Plus Adapter for Agent Desktop Toolkit” | `https://app.five9.com/appsvcs/saml/SSO/alias/adt` |

6. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Certificate (Base64)** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

7. On the **Set up Five9 Plus Adapter (CTI, Contact Center Agents)** section, copy the appropriate URL(s) as per your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

	a. Login URL

	b. Azure AD Identifier

	c. Logout URL

### Configure Five9 Plus Adapter (CTI, Contact Center Agents) Single Sign-On

1. To configure single sign-on on **Five9 Plus Adapter (CTI, Contact Center Agents)** side, you need to send the downloaded **Certificate(Base64)** and appropriate copied URL(s) to [Five9 Plus Adapter (CTI, Contact Center Agents) support team](https://www.five9.com/about/contact). Also additionally, for configuring SSO further please follow the below steps according to the adapter:

	a. “Five9 Plus Adapter for Agent Desktop Toolkit” Admin Guide: [https://webapps.five9.com/assets/files/for_customers/documentation/integrations/agent-desktop-toolkit/plus-agent-desktop-toolkit-administrators-guide.pdf](https://webapps.five9.com/assets/files/for_customers/documentation/integrations/agent-desktop-toolkit/plus-agent-desktop-toolkit-administrators-guide.pdf)
	
	b. “Five9 Plus Adapter for Microsoft Dynamics CRM” Admin Guide: [https://webapps.five9.com/assets/files/for_customers/documentation/integrations/microsoft/microsoft-administrators-guide.pdf](https://webapps.five9.com/assets/files/for_customers/documentation/integrations/microsoft/microsoft-administrators-guide.pdf)
	
	c. “Five9 Plus Adapter for Zendesk” Admin Guide: [https://webapps.five9.com/assets/files/for_customers/documentation/integrations/zendesk/zendesk-plus-administrators-guide.pdf](https://webapps.five9.com/assets/files/for_customers/documentation/integrations/zendesk/zendesk-plus-administrators-guide.pdf)

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

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Five9 Plus Adapter (CTI, Contact Center Agents).

1. In the Azure portal, select **Enterprise Applications**, select **All applications**, then select **Five9 Plus Adapter (CTI, Contact Center Agents)**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **Five9 Plus Adapter (CTI, Contact Center Agents)**.

	![The Five9 Plus Adapter (CTI, Contact Center Agents) link in the Applications list](common/all-applications.png)

3. In the menu on the left, select **Users and groups**.

    ![The "Users and groups" link](common/users-groups-blade.png)

4. Click the **Add user** button, then select **Users and groups** in the **Add Assignment** dialog.

    ![The Add Assignment pane](common/add-assign-user.png)

5. In the **Users and groups** dialog select **Britta Simon** in the Users list, then click the **Select** button at the bottom of the screen.

6. If you are expecting any role value in the SAML assertion then in the **Select Role** dialog select the appropriate role for the user from the list, then click the **Select** button at the bottom of the screen.

7. In the **Add Assignment** dialog click the **Assign** button.

### Create Five9 Plus Adapter (CTI, Contact Center Agents) test user

In this section, you create a user called Britta Simon in Five9 Plus Adapter (CTI, Contact Center Agents). Work with [Five9 Plus Adapter (CTI, Contact Center Agents) support team](https://www.five9.com/about/contact) to add the users in the Five9 Plus Adapter (CTI, Contact Center Agents) platform. Users must be created and activated before you use single sign-on. 

### Test single sign-on 

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Five9 Plus Adapter (CTI, Contact Center Agents tile in the Access Panel, you should be automatically signed in to the Five9 Plus Adapter (CTI, Contact Center Agents) for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional Resources

- [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is Conditional Access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

