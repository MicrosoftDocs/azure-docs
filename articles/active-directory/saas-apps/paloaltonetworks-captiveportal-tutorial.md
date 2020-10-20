---
title: 'Tutorial: Azure Active Directory integration with Palo Alto Networks Captive Portal | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Palo Alto Networks Captive Portal.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 09/10/2020
ms.author: jeedes
---
# Tutorial: Azure Active Directory integration with Palo Alto Networks Captive Portal

In this tutorial, you learn how to integrate Palo Alto Networks Captive Portal with Azure Active Directory (Azure AD).
Integrating Palo Alto Networks Captive Portal with Azure AD provides you with the following benefits:

* You can control in Azure AD who has access to Palo Alto Networks Captive Portal.
* You can enable your users to be automatically signed-in to Palo Alto Networks Captive Portal (Single Sign-On) with their Azure AD accounts.
* You can manage your accounts in one central location - the Azure portal.

## Prerequisites

To integrate Azure AD with Palo Alto Networks Captive Portal, you need the following items:

* An Azure Active Directory subscription. If you don't have Azure AD, you can get a [one-month trial](https://azure.microsoft.com/pricing/free-trial/).
* A Palo Alto Networks Captive Portal single sign-on (SSO)-enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* Palo Alto Networks Captive Portal supports **IDP** initiated SSO
* Palo Alto Networks Captive Portal supports **Just In Time** user provisioning

## Adding Palo Alto Networks Captive Portal from the gallery

To configure the integration of Palo Alto Networks Captive Portal into Azure AD, you need to add Palo Alto Networks Captive Portal from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Palo Alto Networks Captive Portal** in the search box.
1. Select **Palo Alto Networks Captive Portal** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD SSO

In this section, you configure and test Azure AD single sign-on with Palo Alto Networks Captive Portal based on a test user called **B.Simon**.
For single sign-on to work, a link relationship between an Azure AD user and the related user in Palo Alto Networks Captive Portal needs to be established.

To configure and test Azure AD single sign-on with Palo Alto Networks Captive Portal, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - Enable the user to use this feature.
    * **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - Test Azure AD single sign-on with the user B.Simon.
    * **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - Set up B.Simon to use Azure AD single sign-on.
2. **[Configure Palo Alto Networks Captive Portal SSO](#configure-palo-alto-networks-captive-portal-sso)** - Configure the single sign-on settings in the application.
    * **[Create a Palo Alto Networks Captive Portal test user](#create-a-palo-alto-networks-captive-portal-test-user)** - to have a counterpart of B.Simon in Palo Alto Networks Captive Portal that is linked to the Azure AD representation of user.
3. **[Test SSO](#test-sso)** - Verify that the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **Palo Alto Networks Captive Portal** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the edit/pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

4. In the **Basic SAML Configuration** pane, perform the following steps:

   1. For **Identifier**, enter a URL that has the pattern
      `https://<customer_firewall_host_name>/SAML20/SP`.

   2. For **Reply URL**, enter a URL that has the pattern
      `https://<customer_firewall_host_name>/SAML20/SP/ACS`.

      > [!NOTE]
      > Update the placeholder values in this step with the actual identifier and reply URLs. To get the actual values, contact [Palo Alto Networks Captive Portal Client support team](https://support.paloaltonetworks.com/support).

5. In the **SAML Signing Certificate** section, next to **Federation Metadata XML**, select **Download**. Save the downloaded file on your computer.

	![The Federation Metadata XML download link](common/metadataxml.png)

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Palo Alto Networks Captive Portal.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Palo Alto Networks Captive Portal**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Palo Alto Networks Captive Portal SSO

Next, set up single-sign on in Palo Alto Networks Captive Portal:

1. In a different browser window, sign in to the Palo Alto Networks website as an administrator.

2. Select the **Device** tab.

	![The Palo Alto Networks website Device tab](./media/paloaltonetworks-captiveportal-tutorial/tutorial_paloaltoadmin_admin1.png)

3. In the menu, select **SAML Identity Provider**, and then select **Import**.

	![The Import button](./media/paloaltonetworks-captiveportal-tutorial/tutorial_paloaltoadmin_admin2.png)

4. In the **SAML Identity Provider Server Profile Import** dialog box, complete the following steps:

	![Configure Palo Alto Networks single sign-on](./media/paloaltonetworks-captiveportal-tutorial/tutorial_paloaltoadmin_admin3.png)

	1. For **Profile Name**, enter a name, like **AzureAD-CaptivePortal**.
	
	2. Next to **Identity Provider Metadata**, select **Browse**. Select the metadata.xml file that you downloaded in the Azure portal.
	
	3. Select **OK**.

### Create a Palo Alto Networks Captive Portal test user

Next, create a user named *Britta Simon* in Palo Alto Networks Captive Portal. Palo Alto Networks Captive Portal supports just-in-time user provisioning, which is enabled by default. You don't need to complete any tasks in this section. If a user doesn't already exist in Palo Alto Networks Captive Portal, a new one is created after authentication.

> [!NOTE]
> If you want to create a user manually, contact the [Palo Alto Networks Captive Portal Client support team](https://support.paloaltonetworks.com/support).

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options.

Click on Test this application in Azure portal and you should be automatically signed in to the Palo Alto Networks Captive Portal for which you set up the SSO

You can use Microsoft Access Panel. When you click the Palo Alto Networks Captive Portal tile in the Access Panel, you should be automatically signed in to the Palo Alto Networks Captive Portal for which you set up the SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Next Steps

Once you configure Palo Alto Networks Captive Portal you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](https://docs.microsoft.com/cloud-app-security/proxy-deployment-any-app).
