---
title: 'Tutorial: Microsoft Entra integration with Palo Alto Networks Captive Portal'
description: Learn how to configure single sign-on between Microsoft Entra ID and Palo Alto Networks Captive Portal.
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
# Tutorial: Microsoft Entra integration with Palo Alto Networks Captive Portal

In this tutorial, you learn how to integrate Palo Alto Networks Captive Portal with Microsoft Entra ID.
Integrating Palo Alto Networks Captive Portal with Microsoft Entra ID provides you with the following benefits:

* You can control in Microsoft Entra ID who has access to Palo Alto Networks Captive Portal.
* You can enable your users to be automatically signed-in to Palo Alto Networks Captive Portal (Single Sign-On) with their Microsoft Entra accounts.
* You can manage your accounts in one central location.

## Prerequisites

To integrate Microsoft Entra ID with Palo Alto Networks Captive Portal, you need the following items:

* A Microsoft Entra subscription. If you don't have Microsoft Entra ID, you can get a [one-month trial](https://azure.microsoft.com/pricing/free-trial/).
* A Palo Alto Networks Captive Portal single sign-on (SSO)-enabled subscription.

## Scenario description

In this tutorial, you configure and test Microsoft Entra single sign-on in a test environment.

* Palo Alto Networks Captive Portal supports **IDP** initiated SSO
* Palo Alto Networks Captive Portal supports **Just In Time** user provisioning

## Adding Palo Alto Networks Captive Portal from the gallery

To configure the integration of Palo Alto Networks Captive Portal into Microsoft Entra ID, you need to add Palo Alto Networks Captive Portal from the gallery to your list of managed SaaS apps.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the **Add from the gallery** section, type **Palo Alto Networks Captive Portal** in the search box.
1. Select **Palo Alto Networks Captive Portal** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

<a name='configure-and-test-azure-ad-sso'></a>

## Configure and test Microsoft Entra SSO

In this section, you configure and test Microsoft Entra single sign-on with Palo Alto Networks Captive Portal based on a test user called **B.Simon**.
For single sign-on to work, a link relationship between a Microsoft Entra user and the related user in Palo Alto Networks Captive Portal needs to be established.

To configure and test Microsoft Entra single sign-on with Palo Alto Networks Captive Portal, perform the following steps:

1. **[Configure Microsoft Entra SSO](#configure-azure-ad-sso)** - Enable the user to use this feature.
    * **[Create a Microsoft Entra test user](#create-an-azure-ad-test-user)** - Test Microsoft Entra single sign-on with the user B.Simon.
    * **[Assign the Microsoft Entra test user](#assign-the-azure-ad-test-user)** - Set up B.Simon to use Microsoft Entra single sign-on.
2. **[Configure Palo Alto Networks Captive Portal SSO](#configure-palo-alto-networks-captive-portal-sso)** - Configure the single sign-on settings in the application.
    * **[Create a Palo Alto Networks Captive Portal test user](#create-a-palo-alto-networks-captive-portal-test-user)** - to have a counterpart of B.Simon in Palo Alto Networks Captive Portal that is linked to the Microsoft Entra representation of user.
3. **[Test SSO](#test-sso)** - Verify that the configuration works.

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

Follow these steps to enable Microsoft Entra SSO.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Palo Alto Networks Captive Portal** > **Single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

4. In the **Basic SAML Configuration** pane, perform the following steps:

   1. For **Identifier**, enter a URL that has the pattern
      `https://<customer_firewall_host_name>/SAML20/SP`.

   2. For **Reply URL**, enter a URL that has the pattern
      `https://<customer_firewall_host_name>/SAML20/SP/ACS`.

      > [!NOTE]
      > Update the placeholder values in this step with the actual identifier and reply URLs. To get the actual values, contact [Palo Alto Networks Captive Portal Client support team](https://support.paloaltonetworks.com/support).

5. In the **SAML Signing Certificate** section, next to **Federation Metadata XML**, select **Download**. Save the downloaded file on your computer.

	![The Federation Metadata XML download link](common/metadataxml.png)

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

In this section, you'll enable B.Simon to use single sign-on by granting access to Palo Alto Networks Captive Portal.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Palo Alto Networks Captive Portal**.
1. In the app's overview page, select **Users and groups**.
1. Select **Add user/group**, then select **Users and groups** in the **Add Assignment** dialog.
   1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
   1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
   1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Palo Alto Networks Captive Portal SSO

Next, set up single-sign on in Palo Alto Networks Captive Portal:

1. In a different browser window, sign in to the Palo Alto Networks website as an administrator.

2. Select the **Device** tab.

   ![The Palo Alto Networks website Device tab](./media/paloaltonetworks-captiveportal-tutorial/tutorial_paloaltoadmin_admin1.png)

3. In the menu, select **SAML Identity Provider**, and then select **Import**.

   ![The Import button](./media/paloaltonetworks-captiveportal-tutorial/tutorial_paloaltoadmin_admin2.png)

4. In the **SAML Identity Provider Server Profile Import** dialog box, complete the following steps:

   ![Configure Palo Alto Networks single sign-on](./media/paloaltonetworks-captiveportal-tutorial/tutorial_paloaltoadmin_admin3.png)

   1. For **Profile Name**, enter a name, like `AzureAD-CaptivePortal`.

   2. Next to **Identity Provider Metadata**, select **Browse**. Select the metadata.xml file that you downloaded.

   3. Select **OK**.

### Create a Palo Alto Networks Captive Portal test user

Next, create a user named *Britta Simon* in Palo Alto Networks Captive Portal. Palo Alto Networks Captive Portal supports just-in-time user provisioning, which is enabled by default. You don't need to complete any tasks in this section. If a user doesn't already exist in Palo Alto Networks Captive Portal, a new one is created after authentication.

> [!NOTE]
> If you want to create a user manually, contact the [Palo Alto Networks Captive Portal Client support team](https://support.paloaltonetworks.com/support).

## Test SSO 

In this section, you test your Microsoft Entra single sign-on configuration with following options.

* Click on **Test this application**, and you should be automatically signed in to the Palo Alto Networks Captive Portal for which you set up the SSO

* You can use Microsoft My Apps. When you click the Palo Alto Networks Captive Portal tile in the My Apps, you should be automatically signed in to the Palo Alto Networks Captive Portal for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).


## Next steps

Once you configure Palo Alto Networks Captive Portal you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-any-app).
