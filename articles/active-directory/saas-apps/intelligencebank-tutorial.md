---
title: 'Tutorial: Microsoft Entra single sign-on (SSO) integration with IntelligenceBank'
description: Learn how to configure single sign-on between Microsoft Entra ID and IntelligenceBank.
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

# Tutorial: Microsoft Entra single sign-on (SSO) integration with IntelligenceBank

In this tutorial, you'll learn how to integrate IntelligenceBank with Microsoft Entra ID. When you integrate IntelligenceBank with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to IntelligenceBank.
* Enable your users to be automatically signed-in to IntelligenceBank with their Microsoft Entra accounts.
* Manage your accounts in one central location.

## Prerequisites

To get started, you need the following items:

* A Microsoft Entra subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* IntelligenceBank single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Microsoft Entra SSO in a test environment.

* IntelligenceBank supports **SP** initiated SSO.

## Add IntelligenceBank from the gallery

To configure the integration of IntelligenceBank into Microsoft Entra ID, you need to add IntelligenceBank from the gallery to your list of managed SaaS apps.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the **Add from the gallery** section, type **IntelligenceBank** in the search box.
1. Select **IntelligenceBank** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

<a name='configure-and-test-azure-ad-sso-for-intelligencebank'></a>

## Configure and test Microsoft Entra SSO for IntelligenceBank

Configure and test Microsoft Entra SSO with IntelligenceBank using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between a Microsoft Entra user and the related user in IntelligenceBank.

To configure and test Microsoft Entra SSO with IntelligenceBank, perform the following steps:

1. **[Configure Microsoft Entra SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create a Microsoft Entra test user](#create-an-azure-ad-test-user)** - to test Microsoft Entra single sign-on with B.Simon.
    1. **[Assign the Microsoft Entra test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Microsoft Entra single sign-on.
1. **[Configure IntelligenceBank SSO](#configure-intelligencebank-sso)** - to configure the single sign-on settings on application side.
    1. **[Create IntelligenceBank test user](#create-intelligencebank-test-user)** - to have a counterpart of B.Simon in IntelligenceBank that is linked to the Microsoft Entra representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

Follow these steps to enable Microsoft Entra SSO.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **IntelligenceBank** > **Single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, perform the following steps:

    a. In the **Identifier (Entity ID)** text box, type a URL using one of the following patterns:

    | **Identifier** |
    |-----|
    | `IB` |
    | `IntelligenceBank` |
    | `https://<SUBDOMAIN>.intelligencebank.com` |

	b. In the **Reply URL** text box, type a URL using the following pattern:
	`https://<SUBDOMAIN>.intelligencebank.com/auth`

    c. In the **Sign on URL** text box, type a URL using the following pattern:
    `https://<SUBDOMAIN>.intelligencebank.com`

	> [!NOTE]
	> These values are not real. Update these values with the actual Identifier,Reply URL and Sign on URL. Contact [IntelligenceBank Client support team](mailto:helpdesk@intelligencebank.com) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section.

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Certificate (Base64)** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

1. On the **Set up IntelligenceBank** section, copy the appropriate URL(s) based on your requirement.

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

In this section, you'll enable B.Simon to use single sign-on by granting access to IntelligenceBank.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **IntelligenceBank**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure IntelligenceBank SSO

1. In a different web browser window, sign in to your IntelligenceBank company site as an administrator.

1. Click on **Authenticator** and click on **Add New**.

    ![Screenshot shows the Administrator tab selected and the Add New icon.](./media/intelligencebank-tutorial/authenticator.PNG)

1. Perform the following steps:

    ![Screenshot shows the fields where you enter the information in this step.](./media/intelligencebank-tutorial/fields.PNG)

    a. In the **Name** textbox, enter the name for example like `azureadsso`.

    b. In the **Description** textbox, enter valid description.

    c. Select **SAML** from the dropdown as the **Type**.

    d. In the **Remote Url** textbox, paste the **Login URL** value, which you copied previously.

    e. In the **Host** textbox, paste the **Entity ID** value, which you copied previously.

    f. Open the downloaded **Certificate (Base64)** into Notepad and paste the content into the **CertData** textbox

    g. In the **SingleLogoutService** textbox, paste the **Log out URL** value, which you copied previously.

    h. Click on **Save** button.

### Create IntelligenceBank test user

1. In a different web browser window, sign in to your IntelligenceBank company site as an administrator.

1. Go to **Admin** -> **Users** and select **Add New User Icon** to add the **User**.

    ![Screenshot shows the Users icon selected in the Users tab.](./media/intelligencebank-tutorial/creating-user.PNG)

1. Fill the necessary fields as per your organization requirements and click **Save**.

    ![Screenshot show the Add New User page where you enter user information.](./media/intelligencebank-tutorial/user.PNG)

## Test SSO 

In this section, you test your Microsoft Entra single sign-on configuration with following options. 

* Click on **Test this application**, this will redirect to IntelligenceBank Sign-on URL where you can initiate the login flow. 

* Go to IntelligenceBank Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the IntelligenceBank tile in the My Apps, this will redirect to IntelligenceBank Sign-on URL. For more information about the My Apps, see [Introduction to the My Apps](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).

## Next steps

Once you configure IntelligenceBank you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-aad).
