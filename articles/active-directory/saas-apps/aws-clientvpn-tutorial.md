---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with AWS ClientVPN | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and AWS ClientVPN.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 11/03/2020
ms.author: jeedes

---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with AWS ClientVPN

In this tutorial, you'll learn how to integrate AWS ClientVPN with Azure Active Directory (Azure AD). When you integrate AWS ClientVPN with Azure AD, you can:

* Control in Azure AD who has access to AWS ClientVPN.
* Enable your users to be automatically signed-in to AWS ClientVPN with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* AWS ClientVPN single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* AWS ClientVPN supports **SP** initiated SSO

* AWS ClientVPN supports **Just In Time** user provisioning

## Adding AWS ClientVPN from the gallery

To configure the integration of AWS ClientVPN into Azure AD, you need to add AWS ClientVPN from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **AWS ClientVPN** in the search box.
1. Select **AWS ClientVPN** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.


## Configure and test Azure AD SSO for AWS ClientVPN

Configure and test Azure AD SSO with AWS ClientVPN using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in AWS ClientVPN.

To configure and test Azure AD SSO with AWS ClientVPN, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure AWS ClientVPN SSO](#configure-aws-clientvpn-sso)** - to configure the single sign-on settings on application side.
    1. **[Create AWS ClientVPN test user](#create-aws-clientvpn-test-user)** - to have a counterpart of B.Simon in AWS ClientVPN that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **AWS ClientVPN** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the edit/pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, enter the values for the following fields:

	a. In the **Sign on URL** text box, type a URL using the following pattern:
    `https://<LOCALHOST>`

    b. In the **Reply URL** text box, type a URL using the following pattern:
    `http://<LOCALHOST>`

	> [!NOTE]
	> These values are not real. Update these values with the actual Sign on URL and Reply URL. Contact [AWS ClientVPN Client support team](mailto:sujab@amazon.com) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

1. In the Azure Active Directory service, navigate to **App registrations** and then select **All Applications**.

1. Type **AWS ClientVPN** in the search box and Select **AWS ClientVPN** from the search panel.

1. Click on **Manifest** and give the Reply URL value as `http://<LOCALHOST>` instead of `https://<LOCALHOST>`, click on **Save**.

    ![](./media/aws-clientvpn-tutorial/reply-url.png)

1. AWS ClientVPN application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes.

	![image](common/default-attributes.png)

1. In addition to above, AWS ClientVPN application expects few more attributes to be passed back in SAML response which are shown below. These attributes are also pre populated but you can review them as per your requirements.
	
	| Name |  Source Attribute|
	| -------------- | --------- |
	| memberOf | user.groups |

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Federation Metadata XML** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

1. On the **Set up AWS ClientVPN** section, copy the appropriate URL(s) based on your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to AWS ClientVPN.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **AWS ClientVPN**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure AWS ClientVPN SSO

To configure single sign-on on **AWS ClientVPN** side, you need to send the downloaded **Federation Metadata XML** and appropriate copied URLs from Azure portal to [AWS ClientVPN support team](mailto:sujab@amazon.com). They set this setting to have the SAML SSO connection set properly on both sides.

### Create AWS ClientVPN test user

In this section, a user called Britta Simon is created in AWS ClientVPN. AWS ClientVPN supports just-in-time user provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in AWS ClientVPN, a new one is created after authentication.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options. 

1. Click on **Test this application** in Azure portal. This will redirect to AWS ClientVPN Sign-on URL where you can initiate the login flow. 

2. Go to AWS ClientVPN Sign-on URL directly and initiate the login flow from there.

3. You can use Microsoft Access Panel. When you click the AWS ClientVPN tile in the Access Panel, this will redirect to AWS ClientVPN Sign-on URL. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).


## Next steps

Once you configure AWS ClientVPN you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](https://docs.microsoft.com/cloud-app-security/proxy-deployment-any-app).


