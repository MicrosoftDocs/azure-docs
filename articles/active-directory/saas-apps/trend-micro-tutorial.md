---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with Trend Micro Web Security(TMWS) | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Trend Micro Web Security(TMWS).
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: 827285d3-8e65-43cd-8453-baeda32ef174
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: tutorial
ms.date: 04/03/2020
ms.author: jeedes

ms.collection: M365-identity-device-management
---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with Trend Micro Web Security(TMWS)

In this tutorial, you'll learn how to integrate Trend Micro Web Security(TMWS) with Azure Active Directory (Azure AD). When you integrate Trend Micro Web Security(TMWS) with Azure AD, you can:

* Control in Azure AD who has access to Trend Micro Web Security(TMWS).
* Enable your users to be automatically signed-in to Trend Micro Web Security(TMWS) with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

To learn more about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/manage-apps/what-is-single-sign-on).

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Trend Micro Web Security(TMWS) single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* Trend Micro Web Security(TMWS) supports **SP** initiated SSO
* Once you configure Trend Micro Web Security(TMWS) you can enforce session control, which protect exfiltration and infiltration of your organization’s sensitive data in real-time. Session control extend from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](https://docs.microsoft.com/cloud-app-security/proxy-deployment-any-app).

## Adding Trend Micro Web Security(TMWS) from the gallery

To configure the integration of Trend Micro Web Security(TMWS) into Azure AD, you need to add Trend Micro Web Security(TMWS) from the gallery to your list of managed SaaS apps.

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Trend Micro Web Security(TMWS)** in the search box.
1. Select **Trend Micro Web Security(TMWS)** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD single sign-on for Trend Micro Web Security(TMWS)

Configure and test Azure AD SSO with Trend Micro Web Security(TMWS) using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Trend Micro Web Security(TMWS).

To configure and test Azure AD SSO with Trend Micro Web Security(TMWS), complete the following building blocks:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
    1. **[Configure user and group synchronization settings in Azure AD](#configure-user-and-group-synchronization-settings-in-azure-ad)** - Configure user and group synchronization settings in Azure AD
1. **[Configure Trend Micro Web Security(TMWS) SSO](#configure-trend-micro-web-security-sso)** - to configure the single sign-on settings on application side.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the [Azure portal](https://portal.azure.com/), on the **Trend Micro Web Security(TMWS)** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the edit/pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, enter the values for the following fields:

	a. In the **Identifier (Entity ID)** text box, type a URL using the following pattern:
    `https://auth.iws-hybrid.trendmicro.com/([0-9a-f]{16})`

    b. In the **Reply URL** text box, type a URL:
    `https://auth.iws-hybrid.trendmicro.com/simplesaml/module.php/saml/sp/saml2-acs.php/ics-sp`

	> [!NOTE]
	> The Identifier value is not real. Update this value with the actual Identifier. Contact [Trend Micro Web Security(TMWS) Client support team](https://success.trendmicro.com/contact-support-north-america) to get Identifier value. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

1. Trend Micro Web Security(TMWS) application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes.

	![image](common/default-attributes.png)

1. In addition to above, Trend Micro Web Security(TMWS) application expects few more attributes to be passed back in SAML response which are shown below. These attributes are also pre populated but you can review them as per your requirements.
	
	| Name | Source Attribute|
	| --------------- | --------- |
    | sAMAccountName | user.onpremisessamaccountname |
	| uPN | user.userprincipalname |

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Certificate (Base64)** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

1. On the **Set up Trend Micro Web Security(TMWS)** section, copy the appropriate URL(s) based on your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Trend Micro Web Security(TMWS).

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Trend Micro Web Security(TMWS)**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.

   ![The "Users and groups" link](common/users-groups-blade.png)

1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.

	![The Add User link](common/add-assign-user.png)

1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog, click the **Assign** button.

### Configure user and group synchronization settings in Azure AD

1. From the left navigation, click **Azure Active Directory**.

1. Under **Manage**, click **App registrations** and then click your new enterprise application under the **All applications** area.

1. Under **Manage**, click **Certificates & secrets**.

1. Under the Client secrets area that appears, click **New client secret**.

1. On the Add a client secret screen that appears, optionally add a description and select an expiration period for this client secret, and then click **Add**. The newly added client secret appears under the Client secrets area.

1. Record the value. Later, you will type the information into TMWS.

1. Under **Manage**, click **API permissions**. 

1. On the API permissions screen that appears, click **Add a permission**.

1. On the Microsoft APIs tab of the Request API permissions screen that appears, click **Microsoft Graph** and then **Application permissions**.

1. Locate and add the following permissions: 

    * Group.Read.All
    * User.Read.All

1. Click **Add permissions**. A message appears to confirm that your settings were saved successfully. The newly added permissions appear on the API permissions screen.

1. Under the Grant consent area, click **Grant admin consent for < your administrator account > (Default Directory)** and then **Yes**. A message appears to confirm that the admin consent for the requested permissions was successfully granted.

1. Click **Overview**. 

1. In the right pane that appears, record the Application (client) ID and Directory (tenant) ID. Later, you will type the information into TMWS. You can also click **Custom domain names** under Azure **Active Directory > Manage** and record the domain name in the right pane.

## Configure Trend Micro Web Security SSO

To configure single sign-on on **Trend Micro Web Security(TMWS)** side, you need to send the downloaded **Certificate (Base64)** and appropriate copied URLs from Azure portal to [Trend Micro Web Security(TMWS) support team](https://success.trendmicro.com/contact-support-north-america). They set this setting to have the SAML SSO connection set properly on both sides.

## Test SSO 

Once you successfully configured the Azure AD service and specified Azure AD as the user authentication method, you can log on to the TMWS proxy server to verify your setup. After the Azure AD logon verifies your account, you can visit the Internet.

> [!NOTE]
> TMWS does not support testing single sign-on from the Azure AD portal, under Overview > Single sign-on > Set up Single Sign-on with SAML > Test of your new enterprise application.

1. Clear the browser of all cookies and then restart the browser. 

1. Point your browser to the TMWS proxy server. 
For details, see [Traffic Forwarding Using PAC Files](https://docs.trendmicro.com/enterprise/trend-micro-web-security-online-help/administration_001/pac-files/traffic-forwarding-u.aspx#GUID-A4A83827-7A29-4596-B866-01ACCEDCC36B).

1. Visit any Internet website. TMWS will direct you to the TMWS captive portal.

1. Specify an Active Directory account (format: domain\sAMAccountName or sAMAccountName@domain), or email address, or UPN, and then click **Log On**. TMWS sends you to the Azure AD logon.

1. On the Azure AD logon, type your AD account credentials. You should successfully log on to TMWS.

## Additional resources

- [ List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory ](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory? ](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is conditional access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

- [Try Trend Micro Web Security(TMWS) with Azure AD](https://aad.portal.azure.com/)

- [What is session control in Microsoft Cloud App Security?](https://docs.microsoft.com/cloud-app-security/proxy-intro-aad)

- [How to protect Trend Micro Web Security(TMWS) with advanced visibility and controls](https://docs.microsoft.com/cloud-app-security/proxy-intro-aad)

