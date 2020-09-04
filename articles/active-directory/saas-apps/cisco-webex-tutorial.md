---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with Cisco Webex Meetings | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Cisco Webex Meetings.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 08/21/2019
ms.author: jeedes
---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with Cisco Webex Meetings

In this tutorial, you'll learn how to integrate Cisco Webex Meetings with Azure Active Directory (Azure AD). When you integrate Cisco Webex Meetings with Azure AD, you can:

* Control in Azure AD who has access to Cisco Webex Meetings.
* Enable your users to be automatically signed-in to Cisco Webex Meetings with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

To learn more about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Cisco Webex Meetings single sign-on (SSO) enabled subscription.

> [!NOTE]
> This integration is also available to use from Azure AD US Government Cloud environment. You can find this application in the Azure AD US Government Cloud Application Gallery and configure it in the same way as you do from public cloud.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* Cisco Webex Meetings supports **SP and IDP** initiated SSO

* Cisco Webex Meetings supports **Just In Time** user provisioning

## Adding Cisco Webex Meetings from the gallery

To configure the integration of Cisco Webex Meetings into Azure AD, you need to add Cisco Webex Meetings from the gallery to your list of managed SaaS apps.

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Cisco Webex Meetings** in the search box.
1. Select **Cisco Webex Meetings** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD single sign-on for Cisco Webex Meetings

Configure and test Azure AD SSO with Cisco Webex Meetings using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Cisco Webex Meetings.

To configure and test Azure AD SSO with Cisco Webex Meetings, complete the following building blocks:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
	1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
	1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
2. **[Configure Cisco Webex Meetings SSO](#configure-cisco-webex-meetings-sso)** - to configure the single sign-on settings on application side.
	1. **[Create Cisco Webex Meetings test user](#create-cisco-webex-meetings-test-user)** - to have a counterpart of B.Simon in Cisco Webex Meetings that is linked to the Azure AD representation of user.
3. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the [Azure portal](https://portal.azure.com/), on the **Cisco Webex Meetings** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up Single Sign-On with SAML** page, you can configure the application in **IDP** initiated mode by uploading the **Service Provider metadata** file as follows:

	a. Click **Upload metadata file**.

	b. Click on **folder logo** to select the metadata file and click **Upload**.

	c. After successful completion of uploading Service Provider metadata file the **Identifier** and **Reply URL** values get auto populated in **Basic SAML Configuration** section.

	>[!Note]
	>You will get the Service Provider Metadata file from **Configure Cisco Webex Meetings SSO** section, which is explained later in the tutorial. 

1. If you wish to configure the application in **SP** initiated mode, perform the following steps:	

	a. On the **Basic SAML Configuration** section, click the edit/pen icon.

   ![Edit Basic SAML Configuration](common/edit-urls.png)
	
	b. In the **Sign on URL** textbox, type the URL using the following pattern: ` https://<customername>.my.webex.com`

5. Cisco Webex Meetings application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes. Click **Edit** icon to open User Attributes dialog.

	![image](common/edit-attribute.png)

6. In addition to above, Cisco Webex Meetings application expects few more attributes to be passed back in SAML response. In the User Claims section on the User Attributes dialog, perform the following steps to add SAML token attribute as shown in the below table: 

	| Name | Source Attribute|
	| ---------------|  --------- |
	|   firstname    | user.givenname |
	|   lastname    | user.surname |
	|   email       | user.mail |
	|   uid    | user.mail |

	a. Click **Add new claim** to open the **Manage user claims** dialog.

	b. In the **Name** textbox, type the attribute name shown for that row.

	c. Leave the **Namespace** blank.

	d. Select Source as **Attribute**.

	e. From the **Source attribute** list, select the attribute value shown for that row from the drop-down list.

	f. Click **Save**.

4. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Federation Metadata XML** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

6. On the **Set up Cisco Webex Meetings** section, copy the appropriate URL(s) based on your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

### Create an Azure AD test user

In this section, you'll create a test user in the Azure portal called B.Simon.

1. From the left pane in the Azure portal, select **Azure Active Directory**, select **Users**, and then select **All users**.
1. Select **New user** at the top of the screen.
1. In the **User** properties, follow these steps:
	1. In the **Name** field, enter `B.Simon`.  
	1. In the **User name** field, enter the username@companydomain.extension. For example, `B.Simon@contoso.com`.
	1. Select the **Show password** check box, and then write down the value that's displayed in the **Password** box.
	1. Click **Create**.

### Assign the Azure AD test user

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Cisco Webex Meetings.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Cisco Webex Meetings**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.

   	![The "Users and groups" link](common/users-groups-blade.png)

1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.

	![The Add User link](common/add-assign-user.png)

1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Cisco Webex Meetings SSO

1. Go to `https://<customername>.webex.com/admin` URL with your administration credentials.

2. Go to **Common Site Settings** and navigate to **SSO Configuration**.
 
	![Configure single sign-on](./media/cisco-webex-tutorial/tutorial-cisco-webex-11.png)

3. On the **Webex Administration** page, perform the following steps:

	![Configure single sign-on](./media/cisco-webex-tutorial/tutorial-cisco-webex-10.png)

	a. select **SAML 2.0** as **Federation Protocol**.

	b. Click on **Import SAML Metadata** link to upload the metadata file, which you have downloaded from Azure portal.

	c. Click on **Export** button to download the Service Provider Metadata file and upload it in the **Basic SAML Configuration** section on Azure portal.

	d. In the **AuthContextClassRef** textbox, type `urn:oasis:names:tc:SAML:2.0:ac:classes:unspecified` and if you want to enable the MFA using Azure AD type the two values like `urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport;urn:oasis:names:tc:SAML:2.0:ac:classes:X509`

	e. Select **Auto Account Creation**.

	>[!NOTE]
	>For enabling **just-in-time** user provisioning you need to check the **Auto Account Creation**. In addition to that SAML token attributes need to be passed in the SAML response.

	f. Click **Save**.

	>[!NOTE]
	>This configuration is only for the customers that use Webex UserID in email format.

### Create Cisco Webex Meetings test user

The objective of this section is to create a user called B.Simon in Cisco Webex Meetings. Cisco Webex Meetings supports **just-in-time** provisioning, which is by default enabled. There is no action item for you in this section. If a user doesn't already exist in Cisco Webex Meetings, a new one is created when you attempt to access Cisco Webex Meetings.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Cisco Webex Meetings tile in the Access Panel, you should be automatically signed in to the Cisco Webex Meetings for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional Resources

- [ List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory ](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory? ](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is conditional access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

- [Try ServiceNow with Azure AD](https://aad.portal.azure.com)
