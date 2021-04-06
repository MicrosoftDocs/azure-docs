---
title: 'Tutorial: Azure Active Directory integration with Zscaler Two | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Zscaler Two.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 04/06/2021
ms.author: jeedes
---
# Tutorial: Azure Active Directory integration with Zscaler Two

In this tutorial, you'll learn how to integrate Zscaler Two with Azure Active Directory (Azure AD). When you integrate Zscaler Two with Azure AD, you can:

* Control in Azure AD who has access to Zscaler Two.
* Enable your users to be automatically signed-in to Zscaler Two with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To configure Azure AD integration with Zscaler Two, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get a [free account](https://azure.microsoft.com/free/).
* Zscaler Two single sign-on enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* Zscaler Two supports **SP** initiated SSO.

* Zscaler Two supports **Just In Time** user provisioning.

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Add Zscaler Two from the gallery

To configure the integration of Zscaler Two into Azure AD, you need to add Zscaler Two from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Zscaler Two** in the search box.
1. Select **Zscaler Two** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD SSO for Zscaler Two

Configure and test Azure AD SSO with Zscaler Two using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Zscaler Two.

To configure and test Azure AD SSO with Zscaler Two, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Zscaler Two SSO](#configure-zscaler-two-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Zscaler Two test user](#create-zscaler-two-test-user)** - to have a counterpart of B.Simon in Zscaler Two that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **Zscaler Two** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, enter the values for the following fields:

    In the **Sign-on URL** textbox, type the URL used by your users to sign-on to your ZScaler Two application.

	> [!NOTE]
	> You update the value with the actual Sign-On URL. Contact [Zscaler Two Client support team](https://www.zscaler.com/company/contact) to get the value. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

5. Your Zscaler Two application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes. Click **Edit** icon to open **User Attributes** dialog.

	![Screenshot shows User Attributes with the Edit icon selected.](common/edit-attribute.png)

6. In addition to above, Zscaler Two application expects few more attributes to be passed back in SAML response. In the **User Claims** section on the **User Attributes** dialog, perform the following steps to add SAML token attribute as shown in the below table:
	
	| Name | Source Attribute |
	| ---------| ------------ |
	| memberOf | user.assignedroles |

	a. Click **Add new claim** to open the **Manage user claims** dialog.

	![Screenshot shows User claims with the option to Add new claim.](common/new-save-attribute.png)

	![Screenshot shows the Manage user claims dialog box where you can enter the values described.](common/new-attribute-details.png)

	b. In the **Name** textbox, type the attribute name shown for that row.

	c. Leave the **Namespace** blank.

	d. Select Source as **Attribute**.

	e. From the **Source attribute** list, type the attribute value shown for that row.
	
	f. Click **Save**.

	> [!NOTE]
	> Please click [here](../develop/howto-add-app-roles-in-azure-ad-apps.md#app-roles-ui--preview) to know how to configure Role in Azure AD.

7. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Certificate (Base64)** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

8. On the **Set up Zscaler Two** section, copy the appropriate URL(s) as per your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Zscaler Two.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Zscaler Two**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Zscaler Two SSO

1. To automate the configuration within Zscaler Two, you need to install **My Apps Secure Sign-in browser extension** by clicking **Install the extension**.

	![My apps extension](common/install-myappssecure-extension.png)

2. After adding extension to the browser, click on **Setup Zscaler Two** will direct you to the Zscaler Two application. From there, provide the admin credentials to sign into Zscaler Two. The browser extension will automatically configure the application for you and automate steps 3-6.

	![Setup sso](common/setup-sso.png)

3. If you want to setup Zscaler Two manually, open a new web browser window and sign into your Zscaler Two company site as an administrator and perform the following steps:

4. Go to **Administration > Authentication > Authentication Settings** and perform the following steps:
   
	![Screenshot shows the Zscaler One site with steps as described.](./media/zscaler-two-tutorial/administrator.png "Administration")

	a. Under Authentication Type, choose **SAML**.

	b. Click **Configure SAML**.

5. On the **Edit SAML** window, perform the following steps: and click Save.  
   			
	![Manage Users & Authentication](./media/zscaler-two-tutorial/authentication.png "Manage Users & Authentication")
	
	a. In the **SAML Portal URL** textbox, Paste the **Login URL** which you have copied from Azure portal.

	b. In the **Login Name Attribute** textbox, enter **NameID**.

	c. Click **Upload**, to  upload the Azure SAML signing certificate that you  have downloaded from Azure portal in the **Public SSL Certificate**.

	d. Toggle the **Enable SAML Auto-Provisioning**.

	e. In the **User Display Name Attribute** textbox, enter **displayName** if you want to enable SAML auto-provisioning for displayName attributes.

	f. In the **Group Name Attribute** textbox, enter **memberOf** if you want to enable SAML auto-provisioning for memberOf attributes.

	g. In the **Department Name Attribute** Enter **department** if you want to enable SAML auto-provisioning for department attributes.

	h. Click **Save**.

6. On the **Configure User Authentication** dialog page, perform the following steps:

    ![Screenshot shows the Configure User Authentication dialog box with Activate selected.](./media/zscaler-two-tutorial/activation.png)

	a. Hover over the **Activation** menu near the bottom left.

    b. Click **Activate**.

## Configuring proxy settings

### To configure the proxy settings in Internet Explorer

1. Start **Internet Explorer**.

2. Select **Internet options** from the **Tools** menu for open the **Internet Options** dialog.   
  	
	 ![Internet Options](./media/zscaler-two-tutorial/internet.png "Internet Options")

3. Click the **Connections** tab.   
  
	 ![Connections](./media/zscaler-two-tutorial/ic769493.png "Connections")

4. Click **LAN settings** to open the **LAN Settings** dialog.

5. In the Proxy server section, perform the following steps:   
   
	![Proxy server](./media/zscaler-two-tutorial/proxy.png "Proxy server")

    a. Select **Use a proxy server for your LAN**.

    b. In the Address textbox, type **gateway.Zscaler Two.net**.

    c. In the Port textbox, type **80**.

    d. Select **Bypass proxy server for local addresses**.

    e. Click **OK** to close the **Local Area Network (LAN) Settings** dialog.

6. Click **OK** to close the **Internet Options** dialog.


### Create Zscaler Two test user

In this section, a user called Britta Simon is created in Zscaler Two. Zscaler Two supports just-in-time user provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in Zscaler Two, a new one is created after authentication.

>[!Note]
>If you need to create a user manually, contact [Zscaler Two support team](https://www.zscaler.com/company/contact).

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options. 

* Click on **Test this application** in Azure portal. This will redirect to Zscaler Two Sign-on URL where you can initiate the login flow. 

* Go to Zscaler Two Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the Zscaler Two tile in the My Apps, this will redirect to Zscaler Two Sign-on URL. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Next steps

Once you configure Zscaler Two you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-any-app).
