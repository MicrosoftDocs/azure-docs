---
title: 'Tutorial: Microsoft Entra SSO integration with Manifestly Checklists'
description: Learn how to configure single sign-on between Microsoft Entra ID and Manifestly Checklists.
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

# Tutorial: Microsoft Entra SSO integration with Manifestly Checklists

In this tutorial, you'll learn how to integrate Manifestly Checklists with Microsoft Entra ID. When you integrate Manifestly Checklists with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to Manifestly Checklists.
* Enable your users to be automatically signed-in to Manifestly Checklists with their Microsoft Entra accounts.
* Manage your accounts in one central location.

## Prerequisites

To get started, you need the following items:

* A Microsoft Entra subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Manifestly Checklists single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Microsoft Entra SSO in a test environment.

* Manifestly Checklists supports **SP and IDP** initiated SSO.

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Add Manifestly Checklists from the gallery

To configure the integration of Manifestly Checklists into Microsoft Entra ID, you need to add Manifestly Checklists from the gallery to your list of managed SaaS apps.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the **Add from the gallery** section, type **Manifestly Checklists** in the search box.
1. Select **Manifestly Checklists** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

<a name='configure-and-test-azure-ad-sso-for-manifestly-checklists'></a>

## Configure and test Microsoft Entra SSO for Manifestly Checklists

Configure and test Microsoft Entra SSO with Manifestly Checklists using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between a Microsoft Entra user and the related user in Manifestly Checklists.

To configure and test Microsoft Entra SSO with Manifestly Checklists, perform the following steps:

1. **[Configure Microsoft Entra SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create a Microsoft Entra test user](#create-an-azure-ad-test-user)** - to test Microsoft Entra single sign-on with B.Simon.
    1. **[Assign the Microsoft Entra test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Microsoft Entra single sign-on.
1. **[Configure Manifestly Checklists SSO](#configure-manifestly-checklists-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Manifestly Checklists test user](#create-manifestly-checklists-test-user)** - to have a counterpart of B.Simon in Manifestly Checklists that is linked to the Microsoft Entra representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

Follow these steps to enable Microsoft Entra SSO.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Manifestly Checklists** > **Single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, perform the following steps:

    a. In the **Identifier** text box, type the URL:
    `https://app.manifest.ly/users/saml/metadata`

    b. In the **Reply URL** text box, type the URL:
    `https://app.manifest.ly/users/saml/auth`

    c. In the **Sign-on URL** text box, type a URL using one of the following patterns:

    | **Sign-on URL** |
    | -------|
    | `https://app.manifest.ly/users/sign_in` |
    | `https://app.manifest.ly/a/<CustomerName>` |

	> [!NOTE]
	> This value is not real. Update this value with the actual Sign-on URL. Contact [Manifestly Checklists Client support team](mailto:support@manifest.ly) to get this value. You can also refer to the patterns shown in the **Basic SAML Configuration** section.

1. Manifestly Checklists application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes.

	![image](common/default-attributes.png)

1. In addition to above, Manifestly Checklists application expects few more attributes to be passed back in SAML response which are shown below. These attributes are also pre populated but you can review them as per your requirements.
	
	| Name | Source Attribute |
	| ---------| --------- |
	| email | user.mail |
    | first_name | user.givenname |
    | last_name | user.surname |

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Certificate (Base64)** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

1. On the **Set up Manifestly Checklists** section, copy the appropriate URL(s) based on your requirement.

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

In this section, you'll enable B.Simon to use single sign-on by granting access to Manifestly Checklists.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Manifestly Checklists**.
1. In the app's overview page, select **Users and groups**.
1. Select **Add user/group**, then select **Users and groups** in the **Add Assignment** dialog.
   1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
   1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
   1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Manifestly Checklists SSO

1. Log in to your Manifestly Checklists company site as an administrator.

1. Go to **Settings** > **SSO** and click **Set up SAML Sign On** button.

    ![Screenshot shows the SSO Settings.](./media/manifestly-checklists-tutorial/settings.png "SSO Settings")

1. In the **Edit SAML Single Sign** page, perform the following steps:

    ![Screenshot shows the SSO Configuration.](./media/manifestly-checklists-tutorial/certificate.png "SSO Configuration")

    1. Open the downloaded **Certificate (Base64)** into Notepad and paste the content into the **SAML Cert** textbox.

    1.  In the **SAML Entity** textbox, paste the **Microsoft Entra Identifier** value which you copied previously.

    1. In the **SAML URL** textbox, paste the **Login URL** value which you copied previously.

    1. Click **Save**.

### Create Manifestly Checklists test user

1. In a different web browser window, sign into your Manifestly Checklists company site as an administrator.

1. Go to **Teams** > **Users** and click **Add User**.

    ![Screenshot shows the Team Members.](./media/manifestly-checklists-tutorial/user.png "Team Members")

1. Enter the **Name** and **Email** in the textbox and click **Send Invite**.

    ![Screenshot shows to add users.](./media/manifestly-checklists-tutorial/name.png "Add users")    

## Test SSO 

In this section, you test your Microsoft Entra single sign-on configuration with following options. 

#### SP initiated:

* Click on **Test this application**, this will redirect to Manifestly Checklists Sign on URL where you can initiate the login flow.  

* Go to Manifestly Checklists Sign-on URL directly and initiate the login flow from there.

#### IDP initiated:

* Click on **Test this application**, and you should be automatically signed in to the Manifestly Checklists for which you set up the SSO. 

You can also use Microsoft My Apps to test the application in any mode. When you click the Manifestly Checklists tile in the My Apps, if configured in SP mode you would be redirected to the application sign on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the Manifestly Checklists for which you set up the SSO. For more information, see [Microsoft Entra My Apps](/azure/active-directory/manage-apps/end-user-experiences#azure-ad-my-apps).

## Next steps

Once you configure Manifestly Checklists you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).
