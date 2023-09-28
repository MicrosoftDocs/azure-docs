---
title: 'Tutorial: Microsoft Entra SSO integration with Balsamiq Wireframes'
description: Learn how to configure single sign-on between Microsoft Entra ID and Balsamiq Wireframes.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 11/21/2022
ms.author: jeedes

---

# Tutorial: Microsoft Entra SSO integration with Balsamiq Wireframes

In this tutorial, you'll learn how to integrate Balsamiq Wireframes with Microsoft Entra ID. When you integrate Balsamiq Wireframes with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to Balsamiq Wireframes.
* Enable your users to be automatically signed-in to Balsamiq Wireframes with their Microsoft Entra accounts.
* Manage your accounts in one central location.

## Prerequisites

To get started, you need the following items:

* A Microsoft Entra subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Balsamiq Wireframes single sign-on (SSO) enabled subscription.

> [!NOTE]
> This feature is only available for users on the 200-projects Space plan.

## Scenario description

In this tutorial, you configure and test Microsoft Entra SSO in a test environment.

* Balsamiq Wireframes supports **SP and IDP** initiated SSO.
* Balsamiq Wireframes supports **Just In Time** user provisioning.

## Add Balsamiq Wireframes from the gallery

To configure the integration of Balsamiq Wireframes into Microsoft Entra ID, you need to add Balsamiq Wireframes from the gallery to your list of managed SaaS apps.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the **Add from the gallery** section, type **Balsamiq Wireframes** in the search box.
1. Select **Balsamiq Wireframes** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

<a name='configure-and-test-azure-ad-sso-for-balsamiq-wireframes'></a>

## Configure and test Microsoft Entra SSO for Balsamiq Wireframes

Configure and test Microsoft Entra SSO with Balsamiq Wireframes using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between a Microsoft Entra user and the related user in Balsamiq Wireframes.

To configure and test Microsoft Entra SSO with Balsamiq Wireframes, perform the following steps:

1. **[Configure Microsoft Entra SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create a Microsoft Entra test user](#create-an-azure-ad-test-user)** - to test Microsoft Entra single sign-on with B.Simon.
    1. **[Assign the Microsoft Entra test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Microsoft Entra single sign-on.
1. **[Configure Balsamiq Wireframes SSO](#configure-balsamiq-wireframes-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Balsamiq Wireframes test user](#create-balsamiq-wireframes-test-user)** - to have a counterpart of B.Simon in Balsamiq Wireframes that is linked to the Microsoft Entra representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

Follow these steps to enable Microsoft Entra SSO.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Balsamiq Wireframes** > **Single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, perform the following steps:

    a. In the **Identifier** text box, type a URL using the following pattern:
    `https://balsamiq.cloud/samlsso/<ID>`

    b. In the **Reply URL** text box, type a URL using the following pattern:
    `https://balsamiq.cloud/samlsso/<ID>`

    c. In the **Sign-on URL** text box, type a URL using the following pattern:
    `https://balsamiq.cloud/samlsso/<ID>`

    d. In the **Relay State** text box, type a URL using the following pattern:
    `https://balsamiq.cloud/<ID>/projects`

	> [!NOTE]
	> These values are not real. Update these values with the actual Identifier, Reply URL, Sign-on URL and Relay State. Contact [Balsamiq Wireframes Client support team](mailto:support@balsamiq.com) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section.

1. Balsamiq Wireframes application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes.

	![Screenshot shows list of attributes.](common/default-attributes.png)

1. In addition to above, Balsamiq Wireframes application expects few more attributes to be passed back in SAML response which are shown below. These attributes are also pre populated but you can review them as per your requirements.
	
	| Name | Source Attribute|
	| ----------| --------- |
	| Email | user.mail |
    | firstName | user.givenname |
    | lastName | user.surname |

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Federation Metadata XML** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

1. On the **Set up Balsamiq Wireframes** section, copy the appropriate URL(s) based on your requirement.

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

In this section, you'll enable B.Simon to use single sign-on by granting access to Balsamiq Wireframes.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Balsamiq Wireframes**.
1. In the app's overview page, select **Users and groups**.
1. Select **Add user/group**, then select **Users and groups** in the **Add Assignment** dialog.
   1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
   1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
   1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Balsamiq Wireframes SSO

1. Log in to your Balsamiq Wireframes company site as an administrator.

1. Go to **Settings** > **Space Settings** and click **Configure SSO** under Single Sign-On Authentication.

    ![Screenshot shows the SSO Settings.](./media/balsamiq-wireframes-tutorial/settings.png "SSO Settings") 

1. Copy all the required values and paste it in **Basic SAML Configuration** section in the Azure portal and click **Next**.

    ![Screenshot shows the Service Provider Details.](./media/balsamiq-wireframes-tutorial/details.png "Service Provider Details")

1. In the **Configure IDp** section, perform the following steps:

    ![Screenshot shows the IDP Metadata.](./media/balsamiq-wireframes-tutorial/certificate.png "IDP Metadata")

    1. In the **SAML 2.0 Endpoint(HTTP)** textbox, paste the value of **Login URL**, which you copied previously.

    1. In the **Identity Provider Issuer** textbox, paste the value of **Microsoft Entra Identifier**, which you copied previously.

    1. Open the downloaded **Federation Metadata XML** file and **Upload** the file into **Public Certificate** section.
    
    1. Click **Next**.

    > [!Note]
    > If you have an IdP Metadata file to upload, the fields will be automatically populated.

1. Verify your SAML configuration, click **Test SAML Login** button and click **Next**.

    ![Screenshot shows the SAML configuration.](./media/balsamiq-wireframes-tutorial/configuration.png "SAML Login")

1. After the successful test configuration, click **Turn on SAML SSO Now**.

    ![Screenshot shows the Test SAML.](./media/balsamiq-wireframes-tutorial/testing.png "Test SAML")

### Create Balsamiq Wireframes test user

In this section, a user called Britta Simon is created in Balsamiq Wireframes. Balsamiq Wireframes supports just-in-time user provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in Balsamiq Wireframes, a new one is created after authentication.

## Test SSO 

In this section, you test your Microsoft Entra single sign-on configuration with following options. 

#### SP initiated:

* Click on **Test this application**, this will redirect to Balsamiq Wireframes Sign on URL where you can initiate the login flow.  

* Go to Balsamiq Wireframes Sign-on URL directly and initiate the login flow from there.

#### IDP initiated:

* Click on **Test this application**, and you should be automatically signed in to the Balsamiq Wireframes for which you set up the SSO. 

You can also use Microsoft My Apps to test the application in any mode. When you click the Balsamiq Wireframes tile in the My Apps, if configured in SP mode you would be redirected to the application sign on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the Balsamiq Wireframes for which you set up the SSO. For more information, see [Microsoft Entra My Apps](/azure/active-directory/manage-apps/end-user-experiences#azure-ad-my-apps).

## Next steps

Once you configure Balsamiq Wireframes you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).
