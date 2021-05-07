---
title: "Tutorial: Azure Active Directory integration with Andromeda | Microsoft Docs"
description: Learn how to configure single sign-on between Azure Active Directory and Andromeda.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 12/28/2020
ms.author: jeedes
---

# Tutorial: Azure Active Directory integration with Andromeda

In this tutorial, you learn how to integrate Andromeda with Azure Active Directory (Azure AD).
Integrating Andromeda with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to Andromeda.
- You can enable your users to be automatically signed-in to Andromeda (Single Sign-On) with their Azure AD accounts.
- You can manage your accounts in one central location - the Azure portal.

## Prerequisites

To configure Azure AD integration with Andromeda, you need the following items:

- An Azure AD subscription. If you don't have an Azure AD environment, you can get a [free account](https://azure.microsoft.com/free/)
- Andromeda single sign-on enabled subscription

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

- Andromeda supports **SP and IDP** initiated SSO
- Andromeda supports **Just In Time** user provisioning

## Adding Andromeda from the gallery

To configure the integration of Andromeda into Azure AD, you need to add Andromeda from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Andromeda** in the search box.
1. Select **Andromeda** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD SSO for Andromeda

Configure and test Azure AD SSO with Andromeda using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Andromeda.

To configure and test Azure AD SSO with Andromeda, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
   1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
   1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
2. **[Configure Andromeda SSO](#configure-andromeda-sso)** - to configure the Single Sign-On settings on application side.
   1. **[Create Andromeda test user](#create-andromeda-test-user)** - to have a counterpart of Britta Simon in Andromeda that is linked to the Azure AD representation of user.
3. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **Andromeda** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, if you wish to configure the application in **IDP** initiated mode, enter the values for the following fields:

   a. In the **Identifier** text box, type a URL using the following pattern:
   `https://<tenantURL>.ngcxpress.com/`

   b. In the **Reply URL** text box, type a URL using the following pattern:
   `https://<tenantURL>.ngcxpress.com/SAMLConsumer.aspx`

1. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

   ![Screenshot shows Set additional U R Ls where you can enter a Sign on U R L.](common/metadata-upload-additional-signon.png)

   In the **Sign-on URL** text box, type a URL using the following pattern:
   `https://<tenantURL>.ngcxpress.com/SAMLLogon.aspx`

   > [!NOTE]
   > These values are not real. You will update the value with the actual Identifier, Reply URL, and Sign-On URL which is explained later in the tutorial.

1. Andromeda application expects the SAML assertions in a specific format. Configure the following claims for this application. You can manage the values of these attributes from the **User Attributes** section on application integration page. On the **Set up Single Sign-On with SAML** page, click **Edit** button to open **User Attributes** dialog.

   ![Screenshot shows User attributes such as givenname user.givenname and emailaddress user.mail.](common/edit-attribute.png)

   > [!Important]
   > Clear out the NameSpace definitions while setting these up.

1. In the **User Claims** section on the **User Attributes** dialog, edit the claims by using **Edit icon** or add the claims by using **Add new claim** to configure SAML token attribute as shown in the image above and perform the following steps:

   | Name    | Source Attribute  |
   | ------- | ----------------- |
   | role    | App specific role |
   | type    | App Type          |
   | company | CompanyName       |

   > [!NOTE]
   > Andromeda expects roles for users assigned to the application. Please set up these roles in Azure AD so that users can be assigned the appropriate roles. To understand how to configure roles in Azure AD, see [here](../develop/howto-add-app-roles-in-azure-ad-apps.md#app-roles-ui).

   a. Click **Add new claim** to open the **Manage user claims** dialog.

   ![Screenshot shows User claims with options to Add new claim and save.](common/new-save-attribute.png)

   ![Screenshot shows Manage user claims where you can enter values described I this step.](common/new-attribute-details.png)

   b. In the **Name** textbox, type the attribute name shown for that row.

   c. Leave the **Namespace** blank.

   d. Select Source as **Attribute**.

   e. From the **Source attribute** list, type the attribute value shown for that row.

   f. Click **Ok**

   g. Click **Save**.

1. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Certificate (Base64)** from the given options as per your requirement and save it on your computer.

   ![The Certificate download link](common/certificatebase64.png)

1. On the **Set up Andromeda** section, copy the appropriate URL(s) as per your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Andromeda.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Andromeda**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you have setup the roles as explained in the above, you can select it from the **Select a role** dropdown.
1. In the **Add Assignment** dialog, click the **Assign** button.

### Configure Andromeda SSO

1. Sign-on to your Andromeda company site as administrator.

2. On the top of the menubar click **Admin** and navigate to **Administration**.

   ![Andromeda admin](./media/andromedascm-tutorial/tutorial_andromedascm_admin.png)

3. On the left side of tool bar under **Interfaces** section, click **SAML Configuration**.

   ![Andromeda saml](./media/andromedascm-tutorial/tutorial_andromedascm_saml.png)

4. On the **SAML Configuration** section page, perform the following steps:

   ![Andromeda config](./media/andromedascm-tutorial/tutorial_andromedascm_config.png)

   a. Check **Enable SSO with SAML**.

   b. Under **Andromeda Information** section, copy the **SP Identity** value and paste it into the **Identifier** textbox of **Basic SAML Configuration** section.

   c. Copy the **Consumer URL** value and paste it into the **Reply URL** textbox of **Basic SAML Configuration** section.

   d. Copy the **Logon URL** value and paste it into the **Sign-on URL** textbox of **Basic SAML Configuration** section.

   e. Under **SAML Identity Provider** section, type your IDP Name.

   f. In the **Single Sign On End Point** textbox, paste the value of **Login URL** which, you have copied from the Azure portal.

   g. Open the downloaded **Base64 encoded certificate** from Azure portal in notepad, paste it into the **X 509 Certificate** textbox.

   h. Map the following attributes with the respective value to facilitate SSO login from Azure AD. The **User ID** attribute is required for logging in. For provisioning, **Email**, **Company**, **UserType**, and **Role** are required. In this section, we define attributes mapping (name and values) which correlate to those defined within Azure portal

   ![Andromeda attbmap](./media/andromedascm-tutorial/tutorial_andromedascm_attbmap.png)

   i. Click **Save**.

### Create Andromeda test user

In this section, a user called Britta Simon is created in Andromeda. Andromeda supports just-in-time user provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in Andromeda, a new one is created after authentication. If you need to create a user manually, contact [Andromeda Client support team](https://www.ngcsoftware.com/support/).

## Test SSO

In this section, you test your Azure AD single sign-on configuration with following options.

#### SP initiated:

- Click on **Test this application** in Azure portal. This will redirect to Andromeda Sign on URL where you can initiate the login flow.

- Go to Andromeda Sign-on URL directly and initiate the login flow from there.

#### IDP initiated:

- Click on **Test this application** in Azure portal and you should be automatically signed in to the Andromeda for which you set up the SSO

You can also use Microsoft My Apps to test the application in any mode. When you click the Andromeda tile in the My Apps, if configured in SP mode you would be redirected to the application sign on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the Andromeda for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Next steps

Once you configure Andromeda you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-any-app).
