---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with Check Point Remote Access VPN | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Check Point Remote Access VPN.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 04/15/2021
ms.author: jeedes

---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with Check Point Remote Access VPN

In this tutorial, you'll learn how to integrate Check Point Remote Access VPN with Azure Active Directory (Azure AD). When you integrate Check Point Remote Access VPN with Azure AD, you can:

* Control in Azure AD who has access to Check Point Remote Access VPN.
* Enable your users to be automatically signed-in to Check Point Remote Access VPN with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Check Point Remote Access VPN single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* Check Point Remote Access VPN supports **SP** initiated SSO.

## Adding Check Point Remote Access VPN from the gallery

To configure the integration of Check Point Remote Access VPN into Azure AD, you need to add Check Point Remote Access VPN from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Check Point Remote Access VPN** in the search box.
1. Select **Check Point Remote Access VPN** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.


## Configure and test Azure AD SSO for Check Point Remote Access VPN

Configure and test Azure AD SSO with Check Point Remote Access VPN using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Check Point Remote Access VPN.

To configure and test Azure AD SSO with Check Point Remote Access VPN, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Check Point Remote Access VPN SSO](#configure-check-point-remote-access-vpn-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Check Point Remote Access VPN test user](#create-check-point-remote-access-vpn-test-user)** - to have a counterpart of B.Simon in Check Point Remote Access VPN that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **Check Point Remote Access VPN** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, enter the values for the following fields:

    a. In the **Identifier (Entity ID)** text box, type a URL using the following pattern:
    `https://<GATEWAY_IP>/saml-vpn/spPortal/ACS/ID/<IDENTIFIER_UID>`

    b. In the **Reply URL** text box, type a URL using the following pattern:
    `https://<GATEWAY_IP>/saml-vpn/spPortal/ACS/Login/<IDENTIFIER_UID>`

	c. In the **Sign on URL** text box, type a URL using the following pattern:
    `https://<GATEWAY_IP>/saml-vpn/`

	> [!NOTE]
	> These values are not real. Update these values with the actual Identifier, Reply URL and Sign on URL. Contact [Check Point Remote Access VPN Client support team](mailto:support@checkpoint.com) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Certificate (Base64)** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

1. On the **Set up Check Point Remote Access VPN** section, copy the appropriate URL(s) based on your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Check Point Remote Access VPN.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Check Point Remote Access VPN**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Check Point Remote Access VPN SSO

1. Sign in to the Check Point Remote Access VPN company site as an administrator.

1. In SmartConsole > **Gateways & Servers** view, click **New > More > User/Identity > Identity Provider**.

    ![screenshot for new Identity Provider.](./media/check-point-remote-access-vpn-tutorial/identity-provider.png)

1. Perform the following steps in **New Identity Provider** window.

    ![screenshot for Identity Provider section.](./media/check-point-remote-access-vpn-tutorial/new-identity-provider.png)

    a. In the **Gateway** field, select the Security Gateway, which needs to perform the SAML authentication.

    b. In the **Service** field, select **Remote Access VPN** from the dropdown.

    c. Copy **Identifier(Entity ID)** value, paste this value into the **Identifier** text box in the **Basic SAML Configuration** section in the Azure portal.

    d. Copy **Reply URL** value, paste this value into the **Reply URL** text box in the **Basic SAML Configuration** section in the Azure portal.

    e. Select **Import Metadata File** to upload the downloaded **Certificate (Base64)** from the Azure portal.

    > [!NOTE]
    > Alternatively you can also select **Insert Manually** to paste manually the **Entity ID** and **Login URL** values into the corresponding fields, and to upload the **Certificate File** from the Azure portal.

    f. Click **OK**.

### Create Check Point Remote Access VPN test user

In this section, you create a user called Britta Simon in Check Point Remote Access VPN. Work with [Check Point Remote Access VPN support team](mailto:support@checkpoint.com) to add the users in the Check Point Remote Access VPN platform. Users must be created and activated before you use single sign-on.

## Test SSO 

1. Open the VPN client and click **Connect to…**.

    ![screenshot for Connect to.](./media/check-point-remote-access-vpn-tutorial/connect.png)

1. Select **Site** from the dropdown and click **Connect**.

    ![screenshot for selecting site.](./media/check-point-remote-access-vpn-tutorial/site.png)

1. Sign in to the result page using Azure AD credentials, which you have created in the **Create an Azure AD test user** section.

## Next steps

Once you configure Check Point Remote Access VPN you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](https://docs.microsoft.com/cloud-app-security/proxy-deployment-any-app).


