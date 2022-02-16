---
title: 'Tutorial: Azure Active Directory integration with OrgChart Now | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and OrgChart Now.
services: active-directory
author: KMeunier
manager: CBacchi
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 05/11/2021
ms.author: jeedes
---
# Tutorial: Azure Active Directory integration with OrgChart Now

In this tutorial, you'll learn how to integrate OrgChart Now with Azure Active Directory (Azure AD). When you integrate OrgChart Now with Azure AD, you can:

* Control in Azure AD who has access to OrgChart Now.
* Enable your users to be automatically signed-in to OrgChart Now with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* The following Azure AD permissions: Application Administrator and Cloud Application Administrator.
* OrgChart Now single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* OrgChart Now supports **SP** and **IDP** initiated SSO.

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Create a new Enterprise Application for OrgChart Now

To configure the integration of OrgChart Now into Azure AD, you need to create a SAML app in Azure Active Directory.
> [!NOTE]
> You must have the appropriate permissions to create a new, non-gallery Enterprise application.


1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
2.  On the left navigation pane, select the **Azure Active Directory** service.
3.  Navigate to **Enterprise Applications** and then select **All Applications**.
4.  Click on the **+ New application** option to add a new Enterprise application.
5.  Click on the **+ Create your own application** option.
6.  Enter a name for the application (i.e. OrgChart Now SSO).
7.  Click on the **Integrate any other application you don't find in the gallery (Non-gallery)** option.
8.  Click on **Create**.


## Configure and test Azure AD SSO for OrgChart Now

Configure and test Azure AD SSO with OrgChart Now using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in OrgChart Now.

To configure and test Azure AD SSO with OrgChart Now, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure OrgChart Now SSO](#configure-orgchart-now-sso)** - to configure the single sign-on settings on application side.
    1. **[Create OrgChart Now test user](#create-orgchart-now-test-user)** - to have a counterpart of B.Simon in OrgChart Now that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO 

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **OrgChart Now** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

4. Click on the **Add Identifier** option under the **Indetifier (Entity ID)** heading. Then, in the **Identifier (Entity ID)** text box, type a URL using the following pattern:

    `https://{OrgChartNowServer}.orgchartnow.com/saml/sso_metadata?entityID={Your_Azure_AD_Entity_ID}`
    
	> [!NOTE]
> The name of your OrgChart Now server is the first part of the URL displayed while logged in to OrgChart (e.g., unicorn2).
	
	> [!NOTE]
> To find your Azure AD Entity ID, download the **Federation Metadata XML** in the **SAML Signing Certificate** section. The Entity ID is listed between quotation marks, following the **entityID=** indicator, and then copy the Azure AD Identifier value. The entire copied value must be pasted after the **entityID=** portion of the Identifier Entity ID URL listed above.

5. Click on the **Add reply URL** option under the **Reply URL (Assertion Consumer Service URL)** heading. Then, in the **Reply URL (Assertion Consumer URL)** text box, type a URL using the following pattern:

    
    `https://{OrgChartNowServer}.orgchartnow.com/saml/sso_acs?entityID={Your_Azure_AD_Entity_ID}`
	
	> [!NOTE]
> To find your Azure AD Entity ID, download the **Federation Metadata XML** in the **SAML Signing Certificate** section. The Entity ID is listed between quotation marks, following the **entityID=** indicator, and then copy the Azure AD Identifier value. The entire copied value must be pasted after the **entityID=** portion of the Redirect URL (Assertion Consumer SErvice URL) listed above.

6. In the **Sign ON URL** text box, enter a URL using the following pattern:

	`https://{OrgChartNowServer}.orgchartnow.com/saml/sso_acs?entityID={Your_Azure_AD_Entity_ID}`
	> [!NOTE]
> To find your Azure AD Entity ID, download the **Federation Metadata XML** in the **SAML Signing Certificate** section. The Entity ID is listed between quotation marks, following the **entityID=** indicator, and then copy the Azure AD Identifier value. The entire copied value must be pasted after the **entityID=** portion of the Redirect URL (Assertion Consumer SErvice URL) listed above.

7. Click on **Save**.
8. Optionally, copy the App Federation Metadata URL or download the Federation Metadata XML (in the **SAML Signing Certificate** section). You will need either the metadata URL (remote) or metadata XML (local) to complete the SSO setup in OrgChart.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to OrgChart Now.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **OrgChart Now**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure OrgChart Now SSO

To configure single sign-on in **OrgChart Now**, follow the steps enumerated in the [Configuring SSO](https://help.orgchartnow.com/en/topics/sso-configuration.html#configuring-sso-41334) section of the [SSO Configuration](https://help.orgchartnow.com/en/topics/sso-configuration.html) article on OrgChart Now's Help site.

### Create OrgChart Now test user

To enable Azure AD users to log in to OrgChart Now, they must be set up as a user in OrgChart Now, or **Auto-Provisioning** must be enabled in the [SSO Configuration](https://help.orgchartnow.com/en/topics/sso-configuration.html#configuring-sso-41334) panel.


If you do not wish to enable auto-provisioning at this time, you can manually add a user to OrgChart Now for SSO testing purposes. To do so, follow the steps enumerated in the [Creating a New User](https://help.orgchartnow.com/en/account-settings/manage-users.html#UUID-a921b00b-a5a2-3099-8fe5-d0f28f5a50b9_bridgehead-idm4532421481724832584395125038) section of the [Account Settings: Manage Users](https://help.orgchartnow.com/en/account-settings/manage-users.html) article.


## Test SSO

In this section, you test your Azure AD single sign-on configuration with following options. 

#### SP initiated:

To test SP initiated SSO, type a URL into the URL bar using the following pattern:

	`https://{OrgChartNowServer}.orgchartnow.com/saml/sso_endpoint?entityID={Your_Azure_AD_Entity_ID}`

#### IDP initiated:

* Click on **Test this application** in Azure portal and you should be automatically signed in to the OrgChart Now for which you set up the SSO. 

You can also use Microsoft My Apps to test the application in any mode. When you click the OrgChart Now tile in the My Apps, if configured in SP mode you would be redirected to the application sign on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the OrgChart Now for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).

## Next steps

Once you configure OrgChart Now you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-aad).
