---
title: 'Tutorial: Azure Active Directory integration with Zscaler One | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Zscaler One.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 12/18/2020
ms.author: jeedes
---
# Tutorial: Azure Active Directory integration with Zscaler One

In this tutorial, you learn how to integrate Zscaler One with Azure Active Directory (Azure AD).
Integrating Zscaler One with Azure AD provides you with the following benefits:

* You can control in Azure AD who has access to Zscaler One.
* You can enable your users to be automatically signed-in to Zscaler One (Single Sign-On) with their Azure AD accounts.
* You can manage your accounts in one central location - the Azure portal.


## Prerequisites

To configure Azure AD integration with Zscaler One, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get a [free account](https://azure.microsoft.com/free/)
* Zscaler One single sign-on enabled subscription

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* Zscaler One supports **SP** initiated SSO

* Zscaler One supports **Just In Time** user provisioning

## Adding Zscaler One from the gallery

To configure the integration of Zscaler One into Azure AD, you need to add Zscaler One from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Zscaler One** in the search box.
1. Select **Zscaler One** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD SSO for Zscaler One

Configure and test Azure AD SSO with Zscaler One using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Zscaler One.

To configure and test Azure AD SSO with Zscaler One, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
	1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
	1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
2. **[Configure Zscaler One SSO](#configure-zscaler-one-sso)** - to configure the Single Sign-On settings on application side.
	1. **[Create Zscaler One test user](#create-zscaler-one-test-user)** - to have a counterpart of Britta Simon in Zscaler One that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

### Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **Zscaler One** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, perform the following steps:

    In the **Sign-on URL** textbox, type the URL used by your users to sign-on to your Zscaler One application.

	> [!NOTE]
	> You update the value with the actual Sign-On URL. Contact [Zscaler One Client support team](https://www.zscaler.com/company/contact) to get the value. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

5. Your Zscaler One application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes. Click **Edit** icon to open **User Attributes** dialog.

	![Screenshot shows User Attributes with the Edit icon selected.](common/edit-attribute.png)

6. In addition to above, Zscaler One application expects few more attributes to be passed back in SAML response. In the **User Claims** section on the **User Attributes** dialog, perform the following steps to add SAML token attribute as shown in the below table:
	
	| Name | Source Attribute |
	| ---------| ------------ |
	| memberOf | user.assignedroles |

	a. Click **Add new claim** to open the **Manage user claims** dialog.

	b. In the **Name** textbox, type the attribute name shown for that row.

	c. Leave the **Namespace** blank.

	d. Select Source as **Attribute**.

	e. From the **Source attribute** list, type the attribute value shown for that row.
	
	f. Click **Save**.

	> [!NOTE]
	> Please click [here](../develop/howto-add-app-roles-in-azure-ad-apps.md#app-roles-ui--preview) to know how to configure Role in Azure AD.

7. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Certificate (Base64)** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

8. On the **Set up Zscaler One** section, copy the appropriate URL(s) as per your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Zscaler One.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Zscaler One**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you have setup the roles as explained in the above, you can select it from the **Select a role** dropdown.
1. In the **Add Assignment** dialog, click the **Assign** button.

### Configure Zscaler One SSO

1. To automate the configuration within Zscaler One, you need to install **My Apps Secure Sign-in browser extension** by clicking **Install the extension**.

	![My apps extension](common/install-myappssecure-extension.png)

2. After adding extension to the browser, click on **Setup Zscaler One** will direct you to the Zscaler One application. From there, provide the admin credentials to sign into Zscaler One. The browser extension will automatically configure the application for you and automate steps 3-6.

	![Setup sso](common/setup-sso.png)

3. If you want to setup Zscaler One manually, open a new web browser window and sign into your Zscaler One company site as an administrator and perform the following steps:

4. Go to **Administration > Authentication > Authentication Settings** and perform the following steps:
   
	![Screenshot shows the Zscaler One site with steps as described.](./media/zscaler-one-tutorial/ic800206.png "Administration")

	a. Under Authentication Type, choose **SAML**.

	b. Click **Configure SAML**.

5. On the **Edit SAML** window, perform the following steps: and click Save.  
   			
	![Manage Users & Authentication](./media/zscaler-one-tutorial/ic800208.png "Manage Users & Authentication")
	
	a. In the **SAML Portal URL** textbox, Paste the **Login URL** which you have copied from Azure portal.

	b. In the **Login Name Attribute** textbox, enter **NameID**.

	c. Click **Upload**, to  upload the Azure SAML signing certificate that you  have downloaded from Azure portal in the **Public SSL Certificate**.

	d. Toggle the **Enable SAML Auto-Provisioning**.

	e. In the **User Display Name Attribute** textbox, enter **displayName** if you want to enable SAML auto-provisioning for displayName attributes.

	f. In the **Group Name Attribute** textbox, enter **memberOf** if you want to enable SAML auto-provisioning for memberOf attributes.

	g. In the **Department Name Attribute** Enter **department** if you want to enable SAML auto-provisioning for department attributes.

	h. Click **Save**.

6. On the **Configure User Authentication** dialog page, perform the following steps:

    ![Screenshot shows the Configure User Authentication dialog box with Activate selected.](./media/zscaler-one-tutorial/ic800207.png)

	a. Hover over the **Activation** menu near the bottom left.

    b. Click **Activate**.

## Configuring proxy settings
### To configure the proxy settings in Internet Explorer

1. Start **Internet Explorer**.

2. Select **Internet options** from the **Tools** menu for open the **Internet Options** dialog.   

    ![Internet Options](./media/zscaler-one-tutorial/ic769492.png "Internet Options")

3. Click the **Connections** tab.   

    ![Connections](./media/zscaler-one-tutorial/ic769493.png "Connections")

4. Click **LAN settings** to open the **LAN Settings** dialog.

5. In the Proxy server section, perform the following steps:   
   
    ![Proxy server](./media/zscaler-one-tutorial/ic769494.png "Proxy server")

    a. Select **Use a proxy server for your LAN**.

    b. In the Address textbox, type **gateway.Zscaler One.net**.

    c. In the Port textbox, type **80**.

    d. Select **Bypass proxy server for local addresses**.

    e. Click **OK** to close the **Local Area Network (LAN) Settings** dialog.

7. Click **OK** to close the **Internet Options** dialog.

### Create Zscaler One test user

In this section, a user called Britta Simon is created in Zscaler One. Zscaler One supports just-in-time user provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in Zscaler One, a new one is created after authentication.

>[!Note]
>If you need to create a user manually, contact [Zscaler One support team](https://www.zscaler.com/company/contact).

### Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options. 

* Click on **Test this application** in Azure portal. This will redirect to Zscaler One Sign-on URL where you can initiate the login flow. 

* Go to Zscaler One Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the Zscaler One tile in the My Apps, this will redirect to Zscaler One Sign-on URL. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).


## Next steps

Once you configure Zscaler One you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-any-app).
