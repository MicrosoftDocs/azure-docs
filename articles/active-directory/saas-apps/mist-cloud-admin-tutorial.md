---
title: 'Tutorial: Microsoft Entra SSO integration with Mist Cloud Admin SSO'
description: Learn how to configure single sign-on between Microsoft Entra ID and Mist Cloud Admin SSO.
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

# Tutorial: Microsoft Entra SSO integration with Mist Cloud Admin SSO

In this tutorial, you'll learn how to integrate Mist Cloud Admin SSO with Microsoft Entra ID. When you integrate Mist Cloud Admin SSO with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to the Mist dashboard.
* Enable your users to be automatically signed-in to the Mist dashboard with their Microsoft Entra accounts.
* Manage your accounts in one central location.

## Prerequisites

To get started, you need the following items:

* A Microsoft Entra subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Mist Cloud account, you can create an account [here](https://manage.mist.com/).
* Along with Cloud Application Administrator, Application Administrator can also add or manage applications in Microsoft Entra ID.
For more information, see [Azure built-in roles](../roles/permissions-reference.md).

## Scenario description

In this tutorial, you configure and test Microsoft Entra SSO in a test environment.

* Mist Cloud Admin SSO supports **SP** and **IDP** initiated SSO.

## Add Mist Cloud Admin SSO from the gallery

To configure the integration of Mist Cloud Admin SSO into Microsoft Entra ID, you need to add Mist Cloud Admin SSO from the gallery to your list of managed SaaS apps.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the **Add from the gallery** section, type **Mist Cloud Admin SSO** in the search box.
1. Select **Mist Cloud Admin SSO** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

<a name='configure-and-test-azure-ad-sso-for-mist-cloud-admin-sso'></a>

## Configure and test Microsoft Entra SSO for Mist Cloud Admin SSO

Configure and test Microsoft Entra SSO with Mist Cloud Admin SSO using a test user called **B.Simon**. For SSO to work, you need to establish a link between your Microsoft Entra app and Mist organization SSO.

To configure and test Microsoft Entra SSO with Mist Cloud Admin SSO, perform the following steps:

1.	**[Perform initial configuration of the Mist Cloud SSO](#perform-initial-configuration-of-the-mist-cloud-sso)** - to generate ACS URL on the application side.
1. **[Configure Microsoft Entra SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1.	**[Create Role for the SSO Application](#create-role-for-the-sso-application)**
    1. **[Create a Microsoft Entra test user](#create-an-azure-ad-test-user)** - to test Microsoft Entra single sign-on with B.Simon.
    1. **[Assign the Microsoft Entra test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Microsoft Entra single sign-on.

1.	**[Complete configuration of the Mist Cloud](#complete-configuration-of-the-mist-cloud)**

1.	**[Create Roles to link roles sent by the Microsoft Entra ID](#create-roles-to-link-roles-sent-by-the-azure-ad)**

1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Perform Initial Configuration of the Mist Cloud SSO

1.	Sign in to the Mist dashboard using a local account.
2.	Go to **Organization > Settings > Single Sign-On > Add IdP**.
3.	Under **Single Sign-On** section select **Add IDP**.
4.	In the **Name** field type `Azure AD` and select **Add**.

    ![Screenshot shows to add identity provider.](./media/mist-cloud-admin-tutorial/identity-provider.png)

1. Copy **Reply URL** value, paste this value into the **Reply URL** text box in the **Basic SAML Configuration** section.

    ![Screenshot shows to Reply URL value.](./media/mist-cloud-admin-tutorial/reply-url.png)


<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

Follow these steps to enable Microsoft Entra SSO.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Mist Cloud Admin SSO** > **Single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

    ![Screenshot shows to edit Basic SAML Configuration.](common/edit-urls.png "Basic Configuration")

1. On the **Basic SAML Configuration** section, perform the following steps:

    a. In the **Identifier** textbox, type a value using the following pattern:
    `https://api.<MISTCLOUDREGION>.mist.com/api/v1/saml/<SSOUNIQUEID>/login`

    b. In the **Reply URL** textbox, type a URL using the following pattern:
    `https://api.<MISTCLOUDREGION>.mist.com/api/v1/saml/<SSOUNIQUEID>/login`

1. Click **Set additional URLs** and perform the following step, if you wish to configure the application in **SP** initiated mode:

    In the **Sign-on URL** text box, type the URL:
    `https://manage.mist.com`

    > [!Note]
    > These values are not real. Update these values with the actual Identifier and Reply URL. Contact [Mist Cloud Admin SSO support team](mailto:support@mist.com) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section.

1. Mist Cloud Admin SSO application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes.

    ![Screenshot shows the image of attribute mappings.](common/default-attributes.png "Image")

1. In addition to above, Mist Cloud Admin SSO application expects few more attributes to be passed back in SAML response, which are shown below. These attributes are also pre populated but you can review them as per your requirements.

    | Name | Source Attribute|
    | ------------ | --------- |
    | FirstName | user.givenname |
    | LastName | user.surname |
    | Role | user.assignedroles |

   > [!NOTE]
   > Please click [here](../develop/howto-add-app-roles-in-azure-ad-apps.md#app-roles-ui) to know how to configure Role in Microsoft Entra ID.
   > Mist Cloud requires Role attribute to assign correct admin privileges to the user.

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Certificate (Base64)** and select **Download** to download the certificate and save it on your computer.

    ![Screenshot shows the Certificate download link.](common/certificatebase64.png "Certificate")

1. 8. On the **Set up Mist Cloud Admin SSO** section, copy the appropriate **Login URL** and **Microsoft Entra Identifier**.

	![Screenshot shows to copy configuration appropriate URL.](common/copy-configuration-urls.png "Metadata")

### Create Role for the SSO Application

In this section, you'll create a Superuser Role to later assign it to test user B.Simon.
 
1.	In the Azure portal, select **App Registrations**, and then select **All Applications**.
2.	In the applications list, select **Mist Cloud Admin SSO**.
3.	In the app's overview page, find the **Manage** section and select **App Roles**.
4.	Select **Create App Role**, then type **Mist Superuser** in the **Display Name** field.
5.	Type **Superuser** in the **Value** field, then type **Mist Superuser Role** in the **Description** field, then select **Apply**.


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

In this section, you'll enable B.Simon to use single sign-on by granting access to Mist Cloud Admin SSO.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Mist Cloud Admin SSO**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. 6.	Click Select a **Role**, then select **Mist Superuser** and click **Select**.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Complete configuration of the Mist Cloud

1. In the **Create Identity Provider** section, perform the following steps:

    ![Screenshot that shows the Organization Algorithm.](./media/mist-cloud-admin-tutorial/configure-mist.png "Organization")

    1. In the **Issuer** textbox, paste the **Microsoft Entra Identifier** value which you copied previously.

    1. Open the downloaded **Certificate (Base64)** into Notepad and paste the content into the **Certificate** textbox.

    1. In the **SSO URL** textbox, paste the **Login URL** value which you copied previously.

    1. Click **Save**.

<a name='create-roles-to-link-roles-sent-by-the-azure-ad'></a>

## Create Roles to link roles sent by the Microsoft Entra ID

1. In the Mist dashboard navigate to **Organization > Settings**. Under **Single Sign-On** section, select **Create Role**.

    ![Screenshot that shows the Create Role section.](./media/mist-cloud-admin-tutorial/create-role.png)

1. Role name must match Role claim value sent by Microsoft Entra ID, for example type `Superuser` in the **Name** field, specify desired admin privileges for the role and select **Create**.

    ![Screenshot that shows the Create Role button.](./media/mist-cloud-admin-tutorial/create-button.png)

## Test SSO 

In this section, you test your Microsoft Entra single sign-on configuration with following options. 

#### SP initiated:

* Click on **Test this application**, this will redirect to Mist Cloud Admin SSO Sign-on URL where you can initiate the login flow.  

* Go to Mist Cloud Admin SSO Sign-on URL directly and initiate the login flow from there.

    > [!NOTE]
    > For each user first login must be performed from the IdP prior to using SP initiated flow.

#### IDP initiated:

* Click on **Test this application**, and you should be automatically signed in to the Mist Cloud Admin SSO for which you set up the SSO. 

You can also use Microsoft My Apps to test the application in any mode. When you click the Mist Cloud Admin SSO tile in the My Apps, if configured in SP mode you would be redirected to the application sign-on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the Mist Cloud Admin SSO for which you set up the SSO. For more information, see [Microsoft Entra My Apps](/azure/active-directory/manage-apps/end-user-experiences#azure-ad-my-apps).

## Next steps

Once you configure Mist Cloud Admin SSO you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).
