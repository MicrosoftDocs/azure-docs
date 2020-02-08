---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with Akamai | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Akamai.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: 1b7e0d7a-e78f-43a5-af93-b626186e2376
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 11/28/2019
ms.author: jeedes

ms.collection: M365-identity-device-management
---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with Akamai

In this tutorial, you'll learn how to integrate Akamai with Azure Active Directory (Azure AD). When you integrate Akamai with Azure AD, you can:

* Control in Azure AD who has access to Akamai.
* Enable your users to be automatically signed-in to Akamai with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

To learn more about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Akamai single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

- Slack supports IDP initiated SSO

## Adding Akamai from the gallery

To configure the integration of Akamai into Azure AD, you need to add Akamai from the gallery to your list of managed SaaS apps.

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Akamai** in the search box.
1. Select **Akamai** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD single sign-on for Akamai

Configure and test Azure AD SSO with Akamai using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Akamai.

To configure and test Azure AD SSO with Akamai, complete the following building blocks:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    * **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    * **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Akamai SSO](#configure-akamai-sso)** - to configure the single sign-on settings on application side.
    * **[Create Akamai test user](#create-akamai-test-user)** - to have a counterpart of B.Simon in Akamai that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the [Azure portal](https://portal.azure.com/), on the **Akamai** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the edit/pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, if you wish to configure the application in **IDP** initiated mode, enter the values for the following fields:

    a. In the **Identifier** text box, type a URL using the following pattern:
    `https://<Yourapp>.login.go.akamai-access.com/sp/response`

    b. In the **Reply URL** text box, type a URL using the following pattern:
    `https:// <Yourapp>.login.go.akamai-access.com/sp/response`

	> [!NOTE]
	> These values are not real. Update these values with the actual Identifier and Reply URL. Contact [Akamai Client support team](https://www.akamai.com/us/en/contact-us/) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Federation Metadata XML** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

1. On the **Set up Akamai** section, copy the appropriate URL(s) based on your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Akamai.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Akamai**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.

   ![The "Users and groups" link](common/users-groups-blade.png)

1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.

	![The Add User link](common/add-assign-user.png)

1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Akamai SSO

### Setting up IDP

1. Signin to **Akamai Enterprise Application Access** console.
1. On the **Akamai EAA console**, Select **Identity** > **Identity Providers**.

	![Configuring Akamai](./media/header-akamai-tutorial/configure01.png)

1. Click **Add Identity Provider**.

	![Configuring Akamai](./media/header-akamai-tutorial/configure02.png)

	a. Specify the **Unique Name**.
	
	b. Choose **Third Party SAML** and click **Create Identity Provider and Configure**.

### General Settings

1. **Identity Intercept** - Specify the name of the (SP base URL–will be used for Azure AD Configuration)

    > [!NOTE]
    > You can choose to have your own custom domain (will require a DNS entry and a Certificate). In this example we are going to use the Akamai Domain.

1. **Akamai Cloud Zone** - Select the Appropriate cloud zone.
1. **Certificate Validation** - Check Akamai Documentation (optional)

	![Configuring Akamai](./media/header-akamai-tutorial/configure03.png)

### Authentication Configuration

1. URL – Specify the URL same as your identity intercept ( this is where users are redirect after authentication).
2. Logout URL : Update the logout URL.
3. Sign SAML Request: default unchecked.
4. For the IDP Metadata File, add the Application in the Azure AD Console.

	![Configuring Akamai](./media/header-akamai-tutorial/configure04.png)

### Header Based Authentication

Akamai Header Based Authentication

1. Choose **Custom HTTP** form the Add Applications Wizard.

    ![Configuring Akamai](./media/header-akamai-tutorial/configure05.png)

    ![Configuring Akamai](./media/header-akamai-tutorial/configure06.png)

    ![Configuring Akamai](./media/header-akamai-tutorial/configure07.png)

    ![Configuring Akamai](./media/header-akamai-tutorial/configure08.png)

#### Authentication

![Configuring Akamai](./media/header-akamai-tutorial/configure09.png)

![Configuring Akamai](./media/header-akamai-tutorial/configure10.png)

#### Services

1. Click Save and Go to Authentication.

![Configuring Akamai](./media/header-akamai-tutorial/configure11.png)

#### Advanced Settings

1. Under the **Customer HTTP Headers**, specify the **CustomerHeader** and **SAML Attribute**.

    ![Configuring Akamai](./media/header-akamai-tutorial/configure12.png)

1. Click **Save and go to Deployment** button.

    ![Configuring Akamai](./media/header-akamai-tutorial/configure13.png)

#### Deploy the Application

1. Click **Deploy Application** button.

    ![Configuring Akamai](./media/header-akamai-tutorial/configure14.png)

1. Verify the Application was deployed successfully.

    ![Configuring Akamai](./media/header-akamai-tutorial/configure15.png)

### Kerberos Authentication

#### Remote Desktop

1. Choose **RDP** from the ADD Applications Wizard.

    ![Configuring Akamai](./media/header-akamai-tutorial/configure16.png)

    ![Configuring Akamai](./media/header-akamai-tutorial/configure17.png)

    ![Configuring Akamai](./media/header-akamai-tutorial/configure18.png)

1. Specify the Connector that will be servicing this.

    ![Configuring Akamai](./media/header-akamai-tutorial/configure19.png)

#### Authentication

Click **Save and go to Services**.

![Configuring Akamai](./media/header-akamai-tutorial/configure20.png)

#### Services

Click **Save and go to Advanced Settings**.

![Configuring Akamai](./media/header-akamai-tutorial/configure21.png)

#### Advanced Settings

Click **Save and go to Deployment**.

![Configuring Akamai](./media/header-akamai-tutorial/configure22.png)

![Configuring Akamai](./media/header-akamai-tutorial/configure23.png)

![Configuring Akamai](./media/header-akamai-tutorial/configure24.png)

### Deployment

#### SSH

1. Go to Add Applications , Choose **SSH**.

    ![Configuring Akamai](./media/header-akamai-tutorial/configure25.png)

    ![Configuring Akamai](./media/header-akamai-tutorial/configure26.png)

1. Configure Application Identity.

    ![Configuring Akamai](./media/header-akamai-tutorial/configure27.png)

    a. Specify Name / Description.

    b. Specify Application Server IP/FQDN and port for SSH.

    c. Specify SSH username / passphrase *Check Akamai EAA.

    d. Specify the External host Name.

    e. Specify the Location for the connector and choose the connector.

#### Authentication

Click on **Save and go to Services**.

![Configuring Akamai](./media/header-akamai-tutorial/configure28.png)

#### Services

Click **Save and go to Advanced Settings**.

![Configuring Akamai](./media/header-akamai-tutorial/configure29.png)

#### Advanced Settings

Click Save and to go Deployment

![Configuring Akamai](./media/header-akamai-tutorial/configure30.png)

![Configuring Akamai](./media/header-akamai-tutorial/configure31.png)

#### Deployment

Click **Deploy application**.

![Configuring Akamai](./media/header-akamai-tutorial/configure32.png)

### Kerberos Applications

#### Adding Directory

![Configuring Akamai](./media/header-akamai-tutorial/configure33.png)

![Configuring Akamai](./media/header-akamai-tutorial/configure34.png)

![Configuring Akamai](./media/header-akamai-tutorial/configure35.png)

![Configuring Akamai](./media/header-akamai-tutorial/configure36.png)

### Create Akamai test user

In this section, you create a user called B.Simon in Akamai. Work with [Akamai Client support team](https://www.akamai.com/us/en/contact-us/) to add the users in the Akamai platform. Users must be created and activated before you use single sign-on. 

## Test SSO

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Akamai tile in the Access Panel, you should be automatically signed in to the Akamai for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional resources

- [ List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory ](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory? ](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is conditional access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

- [Try Akamai with Azure AD](https://aad.portal.azure.com/)
