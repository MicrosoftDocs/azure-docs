---
title: 'Tutorial: Azure Active Directory integration with Symantec Web Security Service (WSS) | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Symantec Web Security Service (WSS).
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 03/24/2021
ms.author: jeedes
---
# Tutorial: Azure Active Directory integration with Symantec Web Security Service (WSS)

In this tutorial, you will learn how to integrate your Symantec Web Security Service (WSS) account with your Azure Active Directory (Azure AD) account so that WSS can authenticate an end user provisioned in the Azure AD using SAML authentication and enforce user or group level policy rules.

Integrating Symantec Web Security Service (WSS) with Azure AD provides you with the following benefits:

- Manage all of the end users and groups used by your WSS account from your Azure AD portal.

- Allow the end users to authenticate themselves in WSS using their Azure AD credentials.

- Enable the enforcement of user and group level policy rules defined in your WSS account.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Symantec Web Security Service (WSS) single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* Symantec Web Security Service (WSS) supports **IDP** initiated SSO.

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Add Symantec Web Security Service (WSS) from the gallery

To configure the integration of Symantec Web Security Service (WSS) into Azure AD, you need to add Symantec Web Security Service (WSS) from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Symantec Web Security Service (WSS)** in the search box.
1. Select **Symantec Web Security Service (WSS)** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD SSO for Symantec Web Security Service (WSS)

Configure and test Azure AD SSO with Symantec Web Security Service (WSS) using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Symantec Web Security Service (WSS).

To configure and test Azure AD SSO with Symantec Web Security Service (WSS), perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Symantec Web Security Service (WSS) SSO](#configure-symantec-web-security-service-wss-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Symantec Web Security Service (WSS) test user](#create-symantec-web-security-service-wss-test-user)** - to have a counterpart of B.Simon in Symantec Web Security Service (WSS) that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **Symantec Web Security Service (WSS)** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** dialog, perform the following steps:

    a. In the **Identifier** text box, type the URL:
    `https://saml.threatpulse.net:8443/saml/saml_realm`

    b. In the **Reply URL** text box, type the URL:
    `https://saml.threatpulse.net:8443/saml/saml_realm/bcsamlpost`

	> [!NOTE]
	> Contact [Symantec Web Security Service (WSS) Client support team](https://www.symantec.com/contact-us) f the values for the **Identifier** and **Reply URL** are not working for some reason.. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

5. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Federation Metadata XML** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Symantec Web Security Service (WSS).

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Symantec Web Security Service (WSS)**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Symantec Web Security Service (WSS) SSO

To configure single sign-on on the Symantec Web Security Service (WSS) side, refer to the WSS online documentation. The downloaded **Federation Metadata XML** will need to be imported into the WSS portal. Contact the [Symantec Web Security Service (WSS) support team](https://www.symantec.com/contact-us) if you need assistance with the configuration on the WSS portal.

### Create Symantec Web Security Service (WSS) test user

In this section, you create a user called Britta Simon in Symantec Web Security Service (WSS). The corresponding end username can be manually created in the WSS portal or you can wait for the users/groups provisioned in the Azure AD to be synchronized to the WSS portal after a few minutes (~15 minutes). Users must be created and activated before you use single sign-on. The public IP address of the end user machine, which will be used to browse websites also need to be provisioned in the Symantec Web Security Service (WSS) portal.

> [!NOTE]
> Please click [here](https://www.bing.com/search?q=my+ip+address&qs=AS&pq=my+ip+a&sc=8-7&cvid=29A720C95C78488CA3F9A6BA0B3F98C5&FORM=QBLH&sp=1) to get your machine's public IPaddress.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options.

* Click on Test this application in Azure portal and you should be automatically signed in to the Symantec Web Security Service (WSS) for which you set up the SSO.

* You can use Microsoft My Apps. When you click the Symantec Web Security Service (WSS) tile in the My Apps, you should be automatically signed in to the Symantec Web Security Service (WSS) for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Next steps

Once you configure Symantec Web Security Service (WSS) you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](https://docs.microsoft.com/cloud-app-security/proxy-deployment-any-app).
