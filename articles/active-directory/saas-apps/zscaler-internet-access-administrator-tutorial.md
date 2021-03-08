---
title: 'Tutorial: Azure Active Directory integration with Zscaler Internet Access Administrator | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Zscaler Internet Access Administrator.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 02/25/2021
ms.author: jeedes
---
# Tutorial: Azure Active Directory integration with Zscaler Internet Access Administrator

In this tutorial, you'll learn how to integrate Zscaler Internet Access Administrator with Azure Active Directory (Azure AD). When you integrate Zscaler Internet Access Administrator with Azure AD, you can:

* Control in Azure AD who has access to Zscaler Internet Access Administrator.
* Enable your users to be automatically signed-in to Zscaler Internet Access Administrator with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Zscaler Internet Access Administrator single sign-on (SSO) enabled subscription.

> [!NOTE]
> This integration is also available to use from Azure AD US Government Cloud environment. You can find this application in the Azure AD US Government Cloud Application Gallery and configure it in the same way as you do from public cloud.

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* Zscaler Internet Access Administrator supports **IDP** initiated SSO.

## Add Zscaler Internet Access Administrator from the gallery

To configure the integration of Zscaler Internet Access Administrator into Azure AD, you need to add Zscaler Internet Access Administrator from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Zscaler Internet Access Administrator** in the search box.
1. Select **Zscaler Internet Access Administrator** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD SSO for Zscaler Internet Access Administrator

Configure and test Azure AD SSO with Zscaler Internet Access Administrator using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Zscaler Internet Access Administrator.

To configure and test Azure AD SSO with Zscaler Internet Access Administrator, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
	1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
	1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
2. **[Configure Zscaler Internet Access Administrator SSO](#configure-zscaler-internet-access-administrator-sso)** - to configure the Single Sign-On settings on application side.
	1. **[Create Zscaler Internet Access Administrator test user](#create-zscaler-internet-access-administrator-test-user)** - to have a counterpart of Britta Simon in Zscaler Internet Access Administrator that is linked to the Azure AD representation of user.
3. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **Zscaler Internet Access Administrator** application integration page, find the **Manage** section and select **Single sign-on**.
1. On the **Select a Single sign-on method** page, select **SAML**.
1. On the **Set up Single Sign-On with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, enter the values for the following fields:

    a. In the **Identifier** text box, type one of the following URLs as per your requirement:

	| Identifier |
	|------------|
	| `https://admin.zscaler.net` |
	| `https://admin.zscalerone.net` |
	| `https://admin.zscalertwo.net` |
	| `https://admin.zscalerthree.net` |
	| `https://admin.zscloud.net` |
	| `https://admin.zscalerbeta.net` |

    b. In the **Reply URL** text box, type one of the following URLs as per your requirement:

	| Reply URL |
	|-----------|
	| `https://admin.zscaler.net/adminsso.do` |
	| `https://admin.zscalerone.net/adminsso.do` |
	| `https://admin.zscalertwo.net/adminsso.do` |
	| `https://admin.zscalerthree.net/adminsso.do` |
	| `https://admin.zscloud.net/adminsso.do` |
	| `https://admin.zscalerbeta.net/adminsso.do` |

5. Zscaler Internet Access Administrator application expects the SAML assertions in a specific format. Configure the following claims for this application. You can manage the values of these attributes from the **User Attributes & Claims** section on application integration page. On the **Set up Single Sign-On with SAML page**, click **Edit** button to open **User Attributes & Claims** dialog.

	![The Attribute link](./media/zscaler-internet-access-administrator-tutorial/attributes.png)

6. In the **User Claims** section on the **User Attributes** dialog, configure SAML token attribute as shown in the image above and perform the following steps:

	| Name  | Source Attribute  |
	| ---------| ------------ |
	| Role | user.assignedroles |

	a. Click **Add new claim** to open the **Manage user claims** dialog.

	b. From the **Source attribute** list, select the attribute value.

	c. Click **Ok**.

	d. Click **Save**.

	> [!NOTE]
	> Please click [here](../develop/howto-add-app-roles-in-azure-ad-apps.md#app-roles-ui--preview) to know how to configure Role in Azure AD.

7. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Certificate (Base64)** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

8. On the **Set up Zscaler Internet Access Administrator** section, copy the appropriate URL(s) as per your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Zscaler Internet Access Administrator.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Zscaler Internet Access Administrator**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you have setup the roles as explained in the above, you can select it from the **Select a role** dropdown.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Zscaler Internet Access Administrator SSO

1. In a different web browser window, log in to your Zscaler Internet Access Admin UI.

2. Go to **Administration > Administrator Management** and perform the following steps and click Save:

	![Screenshot shows Administrator Management with options to Enable SAML Authentication, upload S S L Certificate and specify an Issuer.](./media/zscaler-internet-access-administrator-tutorial/management.png "Administration")

	a. Check **Enable SAML Authentication**.

	b. Click **Upload**, to  upload the Azure SAML signing certificate that you  have downloaded from Azure portal in the **Public SSL Certificate**.

	c. Optionally, for additional security, add the **Issuer** details to verify the Issuer of the SAML response.

3. On the Admin UI, perform the following steps:

    ![Screenshot shows the Admin U I where you can perform the steps.](./media/zscaler-internet-access-administrator-tutorial/activation.png)

	a. Hover over the **Activation** menu near the bottom left.

    b. Click **Activate**.

### Create Zscaler Internet Access Administrator test user

The objective of this section is to create a user called Britta Simon in Zscaler Internet Access Administrator. Zscaler Internet Access does not support Just-In-Time provisioning for Administrator SSO. You are required to manually create an Administrator account.
For steps on how to create an Administrator account, refer to Zscaler documentation:

https://help.zscaler.com/zia/adding-admins

## Test SSO

In this section, you test your Azure AD single sign-on configuration with following options.

* Click on Test this application in Azure portal and you should be automatically signed in to the Zscaler Internet Access Administrator for which you set up the SSO

* You can use Microsoft My Apps. When you click the Zscaler Internet Access Administrator tile in the My Apps, you should be automatically signed in to the Zscaler Internet Access Administrator for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Next steps

Once you configure Zscaler Internet Access Administrator you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-any-app).
