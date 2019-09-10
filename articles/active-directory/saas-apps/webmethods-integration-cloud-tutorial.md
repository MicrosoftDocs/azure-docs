---
title: 'Tutorial: Azure Active Directory integration with webMethods Integration Suite | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and webMethods Integration Suite.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: 97261535-7a2d-4d73-94c8-38116b8a776e
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 02/15/2019
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with webMethods Integration Suite

In this tutorial, you learn how to integrate webMethods Integration Suite with Azure Active Directory (Azure AD).
Integrating webMethods Integration Suite with Azure AD provides you with the following benefits:

* You can control in Azure AD who has access to webMethods Integration Suite.
* You can enable your users to be automatically signed-in to webMethods Integration Suite (Single Sign-On) with their Azure AD accounts.
* You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).
If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To configure Azure AD integration with webMethods Integration Suite, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get one-month trial [here](https://azure.microsoft.com/pricing/free-trial/).
* webMethods Integration Suite single sign-on enabled subscription

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* webMethods Integration Suite supports **SP** and **IDP** initiated SSO

* webMethods Integration Suite supports **just-in-time** user provisioning

## Adding webMethods Integration Suite from the gallery

To configure the integration of webMethods Integration Suite into Azure AD, you need to add webMethods Integration Suite from the gallery to your list of managed SaaS apps.

**To add webMethods Integration Suite from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon.

	![The Azure Active Directory button](common/select-azuread.png)

2. Navigate to **Enterprise Applications** and then select the **All Applications** option.

	![The Enterprise applications blade](common/enterprise-applications.png)

3. To add new application, click **New application** button on the top of dialog.

	![The New application button](common/add-new-app.png)

4. In the search box, type **webMethods Integration Suite**, select **webMethods Integration Suite** from result panel then click **Add** button to add the application.

	 ![webMethods Integration Suite in the results list](common/search-new-app.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with webMethods Integration Suite based on a test user called **Britta Simon**.
For single sign-on to work, a link relationship between an Azure AD user and the related user in webMethods Integration Suite needs to be established.

To configure and test Azure AD single sign-on with webMethods Integration Suite, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Configure webMethods Integration Suite Single Sign-On](#configure-webmethods-integration-suite-single-sign-on)** - to configure the Single Sign-On settings on application side.
3. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Create webMethods Integration Suite test user](#create-webmethods-integration-suite-test-user)** - to have a counterpart of Britta Simon in webMethods Integration Suite that is linked to the Azure AD representation of user.
6. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal.

To configure Azure AD single sign-on with webMethods Integration Suite, perform the following steps:

1. In the [Azure portal](https://portal.azure.com/), on the **webMethods Integration Suite** application integration page, select **Single sign-on**.

    ![Configure single sign-on link](common/select-sso.png)

2. On the **Select a Single sign-on method** dialog, select **SAML/WS-Fed** mode to enable single sign-on.

    ![Single sign-on select mode](common/select-saml-option.png)

3. On the **Set up Single Sign-On with SAML** page, click **Edit** icon to open **Basic SAML Configuration** dialog.

	![Edit Basic SAML Configuration](common/edit-urls.png)

4. To configure the **webMethods Integration Cloud**, on the **Basic SAML Configuration** section, if you wish to configure the application in **IDP** initiated mode, perform the following steps:

    ![webMethods Integration Suite Domain and URLs single sign-on information](common/idp-intiated.png)

    a. In the **Identifier** text box, type a URL using the following pattern:

	| |
	|--|
	| `<SUBDOMAIN>.webmethodscloud.com` |
	| `<SUBDOMAIN>.webmethodscloud.eu` |
	| `<SUBDOMAIN>.webmethodscloud.de` |

    b. In the **Reply URL** text box, type a URL using the following pattern:

	| |
	|--|
	| `https://<SUBDOMAIN>.webmethodscloud.com/integration/live/saml/ssoResponse` |
	| `https://<SUBDOMAIN>.webmethodscloud.eu/integration/live/saml/ssoResponse` |
	| `https://<SUBDOMAIN>.webmethodscloud.de/integration/live/saml/ssoResponse` |

	c. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

    ![webMethods Integration Suite Domain and URLs single sign-on information](common/metadata-upload-additional-signon.png)

    d. In the **Sign-on URL** text box, type a URL using the following pattern:

	| |
	|--|
	| `https://<SUBDOMAIN>.webmethodscloud.com/integration/live/saml/ssoRequest` |
	| `https://<SUBDOMAIN>.webmethodscloud.eu/integration/live/saml/ssoRequest` |
	| `https://<SUBDOMAIN>.webmethodscloud.de/integration/live/saml/ssoRequest` |

	> [!NOTE]
	> These values are not real. Update these values with the actual Identifier, Reply URL and Sign-on URL. Contact [webMethods Integration Suite Client support team](https://empower.softwareag.com/) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

5. To configure the **webMethods API Cloud**, on the **Basic SAML Configuration** section, if you wish to configure the application in **IDP** initiated mode, perform the following steps:

	![webMethods Integration Suite Domain and URLs single sign-on information](common/idp-intiated.png)

    a. In the **Identifier** text box, type a URL using the following pattern:

	| |
	|--|
	| `<SUBDOMAIN>.webmethodscloud.com` |
	| `<SUBDOMAIN>.webmethodscloud.eu` |
	| `<SUBDOMAIN>.webmethodscloud.de` |

    b. In the **Reply URL** text box, type a URL using the following pattern:

	| |
	|--|
	| `https://<SUBDOMAIN>.webmethodscloud.com/umc/rest/saml/initsso` |
	| `https://<SUBDOMAIN>.webmethodscloud.eu/umc/rest/saml/initsso` |
	| `https://<SUBDOMAIN>.webmethodscloud.de/umc/rest/saml/initsso` |

	c. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

    ![webMethods Integration Suite Domain and URLs single sign-on information](common/metadata-upload-additional-signon.png)

    d. In the **Sign-on URL** text box, type a URL using the following pattern:

	| |
	|--|
	| `https://api.webmethodscloud.com/umc/rest/saml/initsso/?tenant=<TENANTID>` |
	| `https://api.webmethodscloud.eu/umc/rest/saml/initsso/?tenant=<TENANTID>` |
	| `https://api.webmethodscloud.de/umc/rest/saml/initsso/?tenant=<TENANTID>` |

	> [!NOTE]
	> These values are not real. Update these values with the actual Identifier, Reply URL and Sign-on URL. Contact [webMethods Integration Suite Client support team](https://empower.softwareag.com/) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

6. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Federation Metadata XML** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

7. On the **Set up webMethods Integration Suite** section, copy the appropriate URL(s) as per your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

	a. Login URL

	b. Azure Ad Identifier

	c. Logout URL

### Configure webMethods Integration Suite Single Sign-On

To configure single sign-on on **webMethods Integration Suite** side, you need to send the downloaded **Federation Metadata XML** and appropriate copied URLs from Azure portal to [webMethods Integration Suite support team](https://empower.softwareag.com/). They set this setting to have the SAML SSO connection set properly on both sides.

### Create an Azure AD test user

The objective of this section is to create a test user in the Azure portal called Britta Simon.

1. In the Azure portal, in the left pane, select **Azure Active Directory**, select **Users**, and then select **All users**.

    ![The "Users and groups" and "All users" links](common/users.png)

2. Select **New user** at the top of the screen.

    ![New user Button](common/new-user.png)

3. In the User properties, perform the following steps.

    ![The User dialog box](common/user-properties.png)

    a. In the **Name** field, enter **BrittaSimon**.
  
    b. In the **User name** field, type **brittasimon\@yourcompanydomain.extension**  
    For example, BrittaSimon@contoso.com

    c. Select **Show password** check box, and then write down the value that's displayed in the Password box.

    d. Click **Create**.

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to webMethods Integration Suite.

1. In the Azure portal, select **Enterprise Applications**, select **All applications**, then select **webMethods Integration Suite**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **webMethods Integration Suite**.

	![The webMethods Integration Suite link in the Applications list](common/all-applications.png)

3. In the menu on the left, select **Users and groups**.

    ![The "Users and groups" link](common/users-groups-blade.png)

4. Click the **Add user** button, then select **Users and groups** in the **Add Assignment** dialog.

    ![The Add Assignment pane](common/add-assign-user.png)

5. In the **Users and groups** dialog, select **Britta Simon** in the Users list, then click the **Select** button at the bottom of the screen.

6. If you are expecting any role value in the SAML assertion then in the **Select Role** dialog select the appropriate role for the user from the list, then click the **Select** button at the bottom of the screen.

7. In the **Add Assignment** dialog click the **Assign** button.

### Create webMethods Integration Suite test user

In this section, a user called Britta Simon is created in webMethods Integration Suite. webMethods Integration Suite supports just-in-time user provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in webMethods Integration Suite, a new one is created after authentication.

### Test single sign-on 

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the webMethods Integration Suite tile in the Access Panel, you should be automatically signed in to the webMethods Integration Suite for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional Resources

- [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is Conditional Access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

