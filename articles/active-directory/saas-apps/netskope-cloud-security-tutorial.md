---
title: 'Tutorial: Microsoft Entra SSO integration with Netskope Administrator Console'
description: Learn how to configure single sign-on between Microsoft Entra ID and Netskope Administrator Console.
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

# Tutorial: Microsoft Entra SSO integration with Netskope Administrator Console

In this tutorial, you'll learn how to integrate Netskope Administrator Console with Microsoft Entra ID. When you integrate Netskope Administrator Console with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to Netskope Administrator Console.
* Enable your users to be automatically signed-in to Netskope Administrator Console with their Microsoft Entra accounts.
* Manage your accounts in one central location.

## Prerequisites

To get started, you need the following items:

* A Microsoft Entra subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Netskope Administrator Console single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Microsoft Entra SSO in a test environment.

* Netskope Administrator Console supports **SP and IDP** initiated SSO.

* Netskope Administrator Console supports just-in-time user provisioning.

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Add Netskope Administrator Console from the gallery

To configure the integration of Netskope Administrator Console into Microsoft Entra ID, you need to add Netskope Administrator Console from the gallery to your list of managed SaaS apps.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the **Add from the gallery** section, type **Netskope Administrator Console** in the search box.
1. Select **Netskope Administrator Console** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

<a name='configure-and-test-azure-ad-sso-for-netskope-administrator-console'></a>

## Configure and test Microsoft Entra SSO for Netskope Administrator Console

Configure and test Microsoft Entra SSO with Netskope Administrator Console using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between a Microsoft Entra user and the related user in Netskope Administrator Console.

To configure and test Microsoft Entra SSO with Netskope Administrator Console, perform the following steps:

1. **[Configure Microsoft Entra SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
   1. **[Create a Microsoft Entra test user](#create-an-azure-ad-test-user)** - to test Microsoft Entra single sign-on with B.Simon.
   1. **[Assign the Microsoft Entra test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Microsoft Entra single sign-on.
1. **[Configure Netskope Administrator Console SSO](#configure-netskope-administrator-console-sso)** - to configure the single sign-on settings on application side.
   1. **[Create Netskope Administrator Console test user](#create-netskope-administrator-console-test-user)** - to have a counterpart of B.Simon in Netskope Administrator Console that is linked to the Microsoft Entra representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

Follow these steps to enable Microsoft Entra SSO.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Netskope Administrator Console** > **Single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, if you wish to configure the application in **IDP** initiated mode, perform the following step:

   In the **Reply URL** text box, type a URL using the following pattern:
   `https://<tenant_host_name>/saml/acs`

   > [!NOTE]
   > The value is not real. Update the value with the actual Reply URL. You will get the value explained later in the tutorial.

1. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

   In the **Sign-on URL** text box, type a URL using the following pattern:
   `https://<tenantname>.goskope.com`

   > [!NOTE]
   > The Sign-on URL values is not real. Update Sign-on URL value with the actual Sign-on URL. Contact [Netskope Administrator Console Client support team](mailto:support@netskope.com) to get Sign-on URL value. You can also refer to the patterns shown in the **Basic SAML Configuration** section.

1. Netskope Administrator Console application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes.

   ![image](common/default-attributes.png)

1. In addition to above, Netskope Administrator Console application expects few more attributes to be passed back in SAML response which are shown below. These attributes are also pre populated but you can review them as per your requirements.

   | Name       | Source Attribute   |
   | ---------- | ------------------ |
   | admin-role | user.assignedroles |

   > [!NOTE]
   > Click [here](../develop/howto-add-app-roles-in-azure-ad-apps.md#app-roles-ui) to know how to create roles in Microsoft Entra ID.

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section, find **Certificate (Base64)** and select **Download** to download the certificate and save it on your computer.

   ![The Certificate download link](common/certificatebase64.png)

1. On the **Set up Netskope Administrator Console** section, copy the appropriate URL(s) based on your requirement.

   ![Copy configuration URLs](common/copy-configuration-urls.png)

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

In this section, you'll enable B.Simon to use single sign-on by granting access to Netskope Administrator Console.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Netskope Administrator Console**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you have setup the roles as explained in the above, you can select it from the **Select a role** dropdown.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Netskope Administrator Console SSO

1. Open a new tab in your browser, and sign in to your Netskope Administrator Console company site as an administrator.

1. Click on the **Settings** tab from the left navigation pane.

   ![Screenshot shows Setting selected in the navigation pane.](./media/netskope-cloud-security-tutorial/configure-settings.png)

1. Click **Administration** tab.

   ![Screenshot shows Administration selected from Settings.](./media/netskope-cloud-security-tutorial/administration.png)

1. Click **SSO** tab.

   ![Screenshot shows S S O selected in Administration.](./media/netskope-cloud-security-tutorial/tab.png)

1. On the **Network Settings** section, perform the following steps:

   ![Screenshot shows Network Settings where you can enter the values described.](./media/netskope-cloud-security-tutorial/network.png)

   a. Copy **Assertion Consumer Service URL** value and paste it into the **Reply URL** textbox in the **Basic SAML Configuration** section.

   b. Copy **Service Provider Entity ID** value and paste it into the **Identifier** textbox in the **Basic SAML Configuration** section.

1. Click on the **EDIT SETTINGS** under the **SSO/SLO Settings** section.

   ![Screenshot shows S S O / S L O Settings where you can select EDIT SETTINGS.](./media/netskope-cloud-security-tutorial/settings.png)

1. On the **Settings** pop-up window, perform the following steps;

   ![Screenshot shows the Settings dialog box where you can enter the values described.](./media/netskope-cloud-security-tutorial/configuration.png)

   a. Select **Enable SSO**.

   b. In the **IDP URL** textbox, paste the **Login URL** value, which you copied previously.

   c. In the **IDP ENTITY ID** textbox, paste the **Microsoft Entra Identifier** value, which you copied previously.

   d. Open your downloaded Base64 encoded certificate in notepad, copy the content of it into your clipboard, and then paste it to the **IDP CERTIFICATE** textbox.

   e. Select **Enable SSO**.

   f. In the **IDP SLO URL** textbox, paste the **Logout URL** value, which you copied previously.

   g. Click **SUBMIT**.

### Create Netskope Administrator Console test user

In this section, a user called B.Simon is created in Netskope Administrator Console. Netskope Administrator Console supports just-in-time user provisioning, which is enabled by default. There's no action item for you in this section. If a user doesn't already exist in Netskope Administrator Console, a new one is created after authentication.

## Test SSO

In this section, you test your Microsoft Entra single sign-on configuration with following options. 

#### SP initiated:

* Click on **Test this application**, this will redirect to Netskope Administrator Console Sign on URL where you can initiate the login flow.  

* Go to Netskope Administrator Console Sign-on URL directly and initiate the login flow from there.

#### IDP initiated:

* Click on **Test this application**, and you should be automatically signed in to the Netskope Administrator Console for which you set up the SSO. 

You can also use Microsoft My Apps to test the application in any mode. When you click the Netskope Administrator Console tile in the My Apps, if configured in SP mode you would be redirected to the application sign on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the Netskope Administrator Console for which you set up the SSO. For more information, see [Microsoft Entra My Apps](/azure/active-directory/manage-apps/end-user-experiences#azure-ad-my-apps).

## Next steps

Once you configure Netskope Administrator Console you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-any-app).
