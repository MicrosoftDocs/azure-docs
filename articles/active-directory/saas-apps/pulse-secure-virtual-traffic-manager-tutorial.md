---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with Pulse Secure Virtual Traffic Manager | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Pulse Secure Virtual Traffic Manager.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 05/18/2021
ms.author: jeedes

---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with Pulse Secure Virtual Traffic Manager

In this tutorial, you'll learn how to integrate Pulse Secure Virtual Traffic Manager with Azure Active Directory (Azure AD). When you integrate Pulse Secure Virtual Traffic Manager with Azure AD, you can:

* Control in Azure AD who has access to Pulse Secure Virtual Traffic Manager.
* Enable your users to be automatically signed-in to Pulse Secure Virtual Traffic Manager with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Pulse Secure Virtual Traffic Manager single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* Pulse Secure Virtual Traffic Manager supports **SP** initiated SSO.

## Add Pulse Secure Virtual Traffic Manager from the gallery

To configure the integration of Pulse Secure Virtual Traffic Manager into Azure AD, you need to add Pulse Secure Virtual Traffic Manager from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Pulse Secure Virtual Traffic Manager** in the search box.
1. Select **Pulse Secure Virtual Traffic Manager** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD SSO for Pulse Secure Virtual Traffic Manager

Configure and test Azure AD SSO with Pulse Secure Virtual Traffic Manager using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Pulse Secure Virtual Traffic Manager.

To configure and test Azure AD SSO with Pulse Secure Virtual Traffic Manager, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Pulse Secure Virtual Traffic Manager SSO](#configure-pulse-secure-virtual-traffic-manager-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Pulse Secure Virtual Traffic Manager test user](#create-pulse-secure-virtual-traffic-manager-test-user)** - to have a counterpart of B.Simon in Pulse Secure Virtual Traffic Manager that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **Pulse Secure Virtual Traffic Manager** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, perform the following steps:

	a. In the **Sign on URL** text box, type a URL using the following pattern:
    `https://<PUBLISHED VIRTUAL SERVER FQDN>/saml/consume`

    b. In the **Identifier (Entity ID)** text box, type a URL using the following pattern:
    `https://<PUBLISHED VIRTUAL SERVER FQDN>/saml/metadata`

    c. In the **Reply URL** text box, type a URL using the following pattern:
    `https://<PUBLISHED VIRTUAL SERVER FQDN>/saml/consume`

	> [!NOTE]
	> These values are not real. Update these values with the actual Sign on URL,Reply URL and Identifier. Contact [Pulse Secure Virtual Traffic Manager Client support team](mailto:support@pulsesecure.net) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Certificate (Base64)** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

1. On the **Set up Pulse Secure Virtual Traffic Manager** section, copy the appropriate URL(s) based on your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Pulse Secure Virtual Traffic Manager.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Pulse Secure Virtual Traffic Manager**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Pulse Secure Virtual Traffic Manager SSO

This section covers the configuration needed to enable Azure AD SAML authentication on the Pulse Virtual Traffic Manager. All configuration changes are made on the Pulse Virtual Traffic Manager using the Admin web UI. 

### Create a SAML Trusted Identity Provider

a. Go to the **Pulse Virtual Traffic Manager Appliance Admin UI > Catalog > SAML > Trusted Identity Providers Catalog** page and click **Edit**.

![saml catalogs page](./media/pulse-secure-virtual-traffic-manager-tutorial/saml-catalogs.png)

b. Add the details for the new SAML Trusted Identity Provider, copying the information from the Azure AD Enterprise application under the Single sign-on settings page and then click **Create New Trusted Identity Provider**.

![Create New Trusted Identity Provider](./media/pulse-secure-virtual-traffic-manager-tutorial/identity-provider.png)

* In the **Name** textbox, enter a name for the trusted identity provider. 

* In the **Entity_id** textbox, enter the **Azure AD Identifier** value which you have copied from the Azure portal.  

* In the **Url** textbox, enter the **Login URL** value which you have copied from the Azure portal. 

* Open the downloaded **Certificate** from the Azure portal into Notepad and paste the content into the **Certificate** textbox.

c. Verify that the new SAML Identity Provider was successfully created. 

![Verify Trusted Identity Provider](./media/pulse-secure-virtual-traffic-manager-tutorial/verify-identity-provider.png)

### Configure the Virtual Server to use Azure AD Authentication

a. Go to the **Pulse Virtual Traffic Manager Appliance Admin UI > Services > Virtual Servers** page and click **Edit** next to the previously created Virtual server.

![Virtual Servers edit](./media/pulse-secure-virtual-traffic-manager-tutorial/virtual-servers.png)

b. In the **Authentication** section, click **Edit**. 

![Authentication section](./media/pulse-secure-virtual-traffic-manager-tutorial/authentication.png)

c. Configure the following authentication settings for the virtual server: 

1. Authentication -

    ![authentication settings for virtual server](./media/pulse-secure-virtual-traffic-manager-tutorial/authentication-1.png)

    a. In the **Auth!type**, select **SAML Service Provider**. 

    b. In the **Auth!verbose**, set to “Yes” to troubleshoot any authentication issues, otherwise, leave default as “No”. 

2. Authentication Session Management -

    ![Authentication Session Management](./media/pulse-secure-virtual-traffic-manager-tutorial/authentication-session.png)

    a. For **Auth!session!cookie_name**, leave default as “VS_SamlSP_Auth”. 

    b. For **auth!session!timeout**, leave default to “7200”. 

    c. In **auth!session!log_external_state**, set to “Yes” to troubleshoot any authentication issues, otherwise, leave default as “No”. 

    d. In **auth!session!cookie_attributes**, change to “HTTPOnly”.

3. SAML Service Provider -

    ![SAML Service Provider](./media/pulse-secure-virtual-traffic-manager-tutorial/service-provider.png)

    a. In the **auth!saml!sp_entity_id** textbox, set to the same URL used as the Azure AD Single sign-on configuration Identifier (Entity ID). Like `https://pulseweb.labb.info/saml/metadata`. 

    b. In the **auth!saml!sp_acs_url**, set to the same URL used as the Azure AD Single sign-on configuration Replay URL (Assertion Consumer Service URL). Like `https://pulseweb.labb.info/saml/consume`. 

    c. In the **auth!saml!idp**, select the **Trusted Identity Provider** you created in previous step. 

    d. In the auth!saml!time_tolerance, leave default to “5” seconds. 

    e. In the auth!saml!nameid_format, select **unspecified**.

    f. Apply changes by clicking **Update** on the bottom of the page.
    
### Create Pulse Secure Virtual Traffic Manager test user

In this section, you create a user called Britta Simon in Pulse Secure Virtual Traffic Manager. Work with [Pulse Secure Virtual Traffic Manager support team](mailto:support@pulsesecure.net) to add the users in the Pulse Secure Virtual Traffic Manager platform. Users must be created and activated before you use single sign-on.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options. 

* Click on **Test this application** in Azure portal. This will redirect to Pulse Secure Virtual Traffic Manager Sign-on URL where you can initiate the login flow. 

* Go to Pulse Secure Virtual Traffic Manager Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the Pulse Secure Virtual Traffic Manager tile in the My Apps, this will redirect to Pulse Secure Virtual Traffic Manager Sign-on URL. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Next steps

Once you configure Pulse Secure Virtual Traffic Manager you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).
