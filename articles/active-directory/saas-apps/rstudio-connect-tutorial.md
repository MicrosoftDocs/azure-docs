---
title: 'Tutorial: Microsoft Entra SSO integration with RStudio Connect SAML Authentication'
description: Learn how to configure single sign-on between Microsoft Entra ID and RStudio Connect SAML Authentication.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 11/21/2022
ms.author: jeedes
---
# Tutorial: Microsoft Entra SSO integration with RStudio Connect SAML Authentication

In this tutorial, you'll learn how to integrate RStudio Connect SAML Authentication with Microsoft Entra ID. When you integrate RStudio Connect SAML Authentication with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to RStudio Connect SAML Authentication.
* Enable your users to be automatically signed-in to RStudio Connect SAML Authentication with their Microsoft Entra accounts.
* Manage your accounts in one central location.

## Prerequisites

To configure Microsoft Entra integration with RStudio Connect SAML Authentication, you need the following items:

* A Microsoft Entra subscription. If you don't have a Microsoft Entra environment, you can get a [free account](https://azure.microsoft.com/free/).
* RStudio Connect SAML Authentication. There is a [45 day free evaluation](https://www.rstudio.com/products/connect/).

## Scenario description

In this tutorial, you configure and test Microsoft Entra single sign-on in a test environment.

* RStudio Connect SAML Authentication supports **SP and IDP** initiated SSO.

* RStudio Connect SAML Authentication supports **Just In Time** user provisioning.

## Add RStudio Connect SAML Authentication from the gallery

To configure the integration of RStudio Connect SAML Authentication into Microsoft Entra ID, you need to add RStudio Connect SAML Authentication from the gallery to your list of managed SaaS apps.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the **Add from the gallery** section, type **RStudio Connect SAML Authentication** in the search box.
1. Select **RStudio Connect SAML Authentication** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

<a name='configure-and-test-azure-ad-sso-for-rstudio-connect-saml-authentication'></a>

## Configure and test Microsoft Entra SSO for RStudio Connect SAML Authentication

Configure and test Microsoft Entra SSO with RStudio Connect SAML Authentication using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between a Microsoft Entra user and the related user in RStudio Connect SAML Authentication.

To configure and test Microsoft Entra SSO with RStudio Connect SAML Authentication, perform the following steps:

1. **[Configure Microsoft Entra SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create a Microsoft Entra test user](#create-an-azure-ad-test-user)** - to test Microsoft Entra single sign-on with Britta Simon.
    1. **[Assign the Microsoft Entra test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Microsoft Entra single sign-on.
2. **[Configure RStudio Connect SAML Authentication SSO](#configure-rstudio-connect-saml-authentication-sso)** - to configure the Single Sign-On settings on application side.
    1. **[Create RStudio Connect SAML Authentication test user](#create-rstudio-connect-saml-authentication-test-user)** - to have a counterpart of Britta Simon in RStudio Connect SAML Authentication that is linked to the Microsoft Entra representation of user.
3. **[Test SSO](#test-sso)** - to verify whether the configuration works.

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

Follow these steps to enable Microsoft Entra SSO.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **RStudio Connect SAML Authentication** > **Single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, if you wish to configure the application in **IDP** initiated mode, perform the following steps, replacing `<example.com>` with your RStudio Connect SAML Authentication Server Address and port:

    a. In the **Identifier** text box, type a URL using the following pattern:
    `https://<example.com>/__login__/saml`

    b. In the **Reply URL** text box, type a URL using the following pattern:
    `https://<example.com>/__login__/saml/acs`

5. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

    In the **Sign-on URL** text box, type a URL using the following pattern:
    `https://<example.com>/`

	> [!NOTE]
	> These values are not real. Update these values with the actual Identifier, Reply URL and Sign-on URL. They are determined from the RStudio Connect SAML Authentication Server Address (`https://example.com` in the examples above). Contact the [RStudio Connect SAML Authentication support team](mailto:support@rstudio.com) if you have trouble. You can also refer to the patterns shown in the **Basic SAML Configuration** section.

6. Your RStudio Connect SAML Authentication application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes, where as **nameidentifier** is mapped with **user.userprincipalname**. RStudio Connect SAML Authentication application expects **nameidentifier** to be mapped with **user.mail**, so you need to edit the attribute mapping by clicking on **Edit** icon and change the attribute mapping.

	![image](common/edit-attribute.png)

7. On the **Set up Single Sign-On with SAML** page, In the **SAML Signing Certificate** section, click copy button to copy **App Federation Metadata Url** and save it on your computer.

	![The Certificate download link](common/copy-metadataurl.png)

<a name='create-an-azure-ad-test-user'></a>

### Create a Microsoft Entra test user

In this section, you'll create a test user called B.Simon.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [User Administrator](../roles/permissions-reference.md#user-administrator).
1. Browse to **Identity** > **Users** > **All users**.
1. Select **New user** > **Create new user**, at the top of the screen.
1. In the **User** properties, follow these steps:
   1. In the **Display name** field, enter `B.Simon`.  
   1. In the **User principal name** field, enter the username@companydomain.extension. For example, `B.Simon@contoso.com`.
   1. Select the **Show password** check box, and then write down the value that's displayed in the **Password** box.
   1. Select **Review + create**.
1. Select **Create**.

<a name='assign-the-azure-ad-test-user'></a>

### Assign the Microsoft Entra test user

In this section, you'll enable B.Simon to use single sign-on by granting access to RStudio Connect SAML Authentication.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **RStudio Connect SAML Authentication**.
1. In the app's overview page, select **Users and groups**.
1. Select **Add user/group**, then select **Users and groups** in the **Add Assignment** dialog.
   1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
   1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
   1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure RStudio Connect SAML Authentication SSO

To configure single sign-on on for **RStudio Connect SAML Authentication**, you need to use the **App Federation Metadata Url** and **Server Address** used above. This is done in the RStudio Connect SAML Authentication configuration file at `/etc/rstudio-connect.rstudio-connect.gcfg`.

This is an example configuration file:

```
[Server]
SenderEmail =

; Important! The user-facing URL of your RStudio Connect SAML Authentication server.
Address = 

[Http]
Listen = :3939

[Authentication]
Provider = saml

[SAML]
Logging = true

; Important! The URL where your IdP hosts the SAML metadata or the path to a local copy of it placed in the RStudio Connect SAML Authentication server.
IdPMetaData = 

IdPAttributeProfile = azure
SSOInitiated = IdPAndSP
```

If `IdPAttributeProfile = azure`,the profile sets the NameIDFormat to persistent, among other settings and overrides any other specified attributes defined in the configuration [file](https://docs.rstudio.com/connect/admin/authentication/saml/#the-azure-profile).

This becomes an issue if you want to create a user ahead of time using the RStudio Connect API and apply permissions prior to the user logging in the first time. The NameIDFormat should be set to emailAddress or some other unique identifier because when it's set to persistent, then the value gets hashed and you don't know what the value is ahead of time. So using the API will not work.
API for creating user for SAML: https://docs.rstudio.com/connect/api/#post-/v1/users

So you may want to have this in your configuration file in this situation:

```
[SAML]
NameIDFormat = emailAddress
UniqueIdAttribute = NameID
UsernameAttribute = http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name
FirstNameAttribute = http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname
LastNameAttribute = http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname
EmailAttribute = http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailAddress
```

Store your **Server Address** in the `Server.Address` value, and the **App Federation Metadata Url** in the `SAML.IdPMetaData` value. Note that this sample configuration uses an unencrypted HTTP connection, while Microsoft Entra ID requires the use of an encrypted HTTPS connection. You can either use a [reverse proxy](https://docs.rstudio.com/connect/admin/proxy/) in front of RStudio Connect SAML Authentication or configure RStudio Connect SAML Authentication to [use HTTPS directly](https://docs.rstudio.com/connect/admin/appendix/configuration/#HTTPS). 

If you have trouble with configuration, you can read the [RStudio Connect SAML Authentication Admin Guide](https://docs.rstudio.com/connect/admin/authentication/saml/) or email the [RStudio support team](mailto:support@rstudio.com) for help.

### Create RStudio Connect SAML Authentication test user

In this section, a user called Britta Simon is created in RStudio Connect SAML Authentication. RStudio Connect SAML Authentication supports just-in-time provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in RStudio Connect SAML Authentication, a new one is created when you attempt to access RStudio Connect SAML Authentication.

## Test SSO 

In this section, you test your Microsoft Entra single sign-on configuration with following options. 

#### SP initiated:

* Click on **Test this application**, this will redirect to RStudio Connect SAML Authentication Sign on URL where you can initiate the login flow.  

* Go to RStudio Connect SAML Authentication Sign-on URL directly and initiate the login flow from there.

#### IDP initiated:

* Click on **Test this application**, and you should be automatically signed in to the RStudio Connect SAML Authentication for which you set up the SSO. 

You can also use Microsoft My Apps to test the application in any mode. When you click the RStudio Connect SAML Authentication tile in the My Apps, if configured in SP mode you would be redirected to the application sign on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the RStudio Connect SAML Authentication for which you set up the SSO. For more information, see [Microsoft Entra My Apps](/azure/active-directory/manage-apps/end-user-experiences#azure-ad-my-apps).

## Next steps

Once you configure RStudio Connect SAML Authentication you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-any-app).
