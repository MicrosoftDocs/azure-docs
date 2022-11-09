---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with Onshape | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Onshape.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 03/03/2021
ms.author: jeedes

---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with Onshape

In this tutorial, you'll learn how to integrate Onshape with Azure Active Directory (Azure AD). When you integrate Onshape with Azure AD, you can:

* Control in Azure AD who has access to Onshape.
* Enable your users to be automatically signed-in to Onshape with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Onshape single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* Onshape supports **SP and IDP** initiated SSO
* Onshape supports **Just In Time** user provisioning
> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.


## Adding Onshape from the gallery

To configure the integration of Onshape into Azure AD, you need to add Onshape from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Onshape** in the search box.
1. Select **Onshape** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)


## Configure and test Azure AD SSO for Onshape

Configure and test Azure AD SSO with Onshape using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Onshape.

To configure and test Azure AD SSO with Onshape, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Onshape SSO](#configure-onshape-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Onshape test user](#create-onshape-test-user)** - to have a counterpart of B.Simon in Onshape that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **Onshape** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. If prompted to save your single sign-on setting, select **Yes**. 
1. The Onshape application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes.

	![image](common/default-attributes.png)

1. In addition to above, the Onshape application expects few more attributes shown below to be passed to it in the SAML response. These attributes are also pre-populated but you can review them as per your requirements.
	
	| Name |  Source Attribute|
	| --------------- | --------- |
	| firstName | user.givenname |
	| lastName | user.surname |
	| companyName | <COMPANY_NAME> |

    > [!NOTE]
    > You _must_ change the value of the **companyName** attribute to the *domain prefix* of your Onshape enterprise. For example, if you access the Onshape application by using a URL like `https://acme.onshape.com`, your domain prefix is *acme*. The attribute value must be only the prefix, not the entire DNS name.

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section, find **Federation Metadata XML** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

1. On the **Set up Onshape** section, copy the appropriate URL(s) based on your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Onshape.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Onshape**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Onshape SSO

For information about how to configure single sign-on on the **Onshape** side, see [Integrating with Microsoft Azure AD](https://cad.onshape.com/help/Content/MS_AzureAD.htm).

### Create Onshape test user

In this section, a user called Britta Simon is created in Onshape. Onshape supports just-in-time user provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in Onshape, a new one is created after authentication.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options. 

#### SP initiated:

* Click on **Test this application** in Azure portal. This will redirect to Onshape Sign on URL where you can initiate the login flow.  

* Go to Onshape Sign-on URL directly and initiate the login flow from there.

#### IDP initiated:

* Click on **Test this application** in Azure portal and you should be automatically signed in to the Onshape for which you set up the SSO 

You can also use Microsoft My Apps to test the application in any mode. When you click the Onshape tile in the My Apps, if configured in SP mode you would be redirected to the application sign on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the Onshape for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).


## Next steps

Once you configure Onshape you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-any-app).
