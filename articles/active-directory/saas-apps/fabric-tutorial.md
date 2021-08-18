---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with Fabric | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Fabric.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 06/08/2021
ms.author: jeedes

---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with Fabric

In this tutorial, you'll learn how to integrate Fabric with Azure Active Directory (Azure AD). When you integrate Fabric with Azure AD, you can:

* Control in Azure AD who has access to Fabric.
* Enable your users to be automatically signed-in to Fabric with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Fabric single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* Fabric supports **SP** initiated SSO.

## Adding Fabric from the gallery

To configure the integration of Fabric into Azure AD, you need to add Fabric from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Fabric** in the search box.
1. Select **Fabric** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.


## Configure and test Azure AD SSO for Fabric

Configure and test Azure AD SSO with Fabric using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Fabric.

To configure and test Azure AD SSO with Fabric, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Fabric SSO](#configure-fabric-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Fabric roles](#create-fabric-roles)** - to have a counterpart of B.Simon in Fabric that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **Fabric** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. In the **Basic SAML Configuration** section, enter the values for the following fields:

   1. In the **Identifier** text box, type a URL using the following pattern:  
      `https://<HOSTNAME>`

   1. In the **Reply URL** text box, type a URL using the following pattern:  
      `https://<HOSTNAME>:<PORT>/api/authenticate`
    
   1. In the **Sign on URL** text box, type a URL using the following pattern:  
      `https://<HOSTNAME>:<PORT>`

	> [!NOTE]
	> These values are not real. Update these values with the actual Identifier, Reply URL and Sign on URL. Contact K2View COE team to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Certificate (Base64)** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

1. In the **Set up Fabric** section, copy the appropriate URL(s) based on your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

1. In the **Token encryption** section, select **Import Certificate** and upload the Fabric certificate file. Contact the K2View COE team to get it.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Fabric.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Fabric**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Fabric SSO

To configure single sign-on on the **Fabric** side, send the downloaded **Certificate (Base64)** and the appropriate copied URLs from the Azure portal to the K2View COE support team. The team configures the setting so that the SAML SSO connection is set properly on both sides.

For more information, see *Fabric SAML Configuration* and *Azure AD SAML Setup Guide* in the [K2view Knowledge Base](https://support.k2view.com/knowledge-base.html).

### Create Fabric roles

Work with the K2View COE support team to set Fabric roles that are matched to the Azure AD groups, and which are relevant to the users who are going to use Fabric. You'll provide the Fabric team the group IDs, because they are sent in the SAML response.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options. 

* In the Azure portal, select **Test this application**. You'll be redirected to the Fabric sign-on URL, where you can initiate the login flow. 

* Go to the Fabric sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you select the **Fabric** tile in the My Apps portal, you'll be redirected to the Fabric sign-on URL. For more information about the My Apps portal, see [Introduction to the My Apps portal](../user-help/my-apps-portal-end-user-access.md).


## Next steps

Once you configure Fabric you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-any-app).


