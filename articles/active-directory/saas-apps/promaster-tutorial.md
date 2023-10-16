---
title: 'Tutorial: Microsoft Entra SSO integration with ProMaster (by Inlogik)'
description: Learn how to configure single sign-on between Microsoft Entra ID and ProMaster (by Inlogik).
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
# Tutorial: Microsoft Entra SSO integration with ProMaster (by Inlogik)

In this tutorial, you'll learn how to integrate ProMaster (by Inlogik) with Microsoft Entra ID. When you integrate ProMaster (by Inlogik) with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to ProMaster (by Inlogik).
* Enable your users to be automatically signed-in to ProMaster (by Inlogik) with their Microsoft Entra accounts.
* Manage your accounts in one central location.

## Prerequisites

To get started, you need the following items:

* A Microsoft Entra subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* ProMaster (by Inlogik) single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Microsoft Entra single sign-on in a test environment.

* ProMaster (by Inlogik) supports **SP** and **IDP** initiated SSO.

## Add ProMaster (by Inlogik) from the gallery

To configure the integration of ProMaster (by Inlogik) into Microsoft Entra ID, you need to add ProMaster (by Inlogik) from the gallery to your list of managed SaaS apps.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the **Add from the gallery** section, type **ProMaster (by Inlogik)** in the search box.
1. Select **ProMaster (by Inlogik)** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

<a name='configure-and-test-azure-ad-sso-for-promaster-by-inlogik'></a>

## Configure and test Microsoft Entra SSO for ProMaster (by Inlogik)

Configure and test Microsoft Entra SSO with ProMaster (by Inlogik) using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between a Microsoft Entra user and the related user in ProMaster (by Inlogik).

To configure and test Microsoft Entra SSO with ProMaster (by Inlogik), perform the following steps:

1. **[Configure Microsoft Entra SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create a Microsoft Entra test user](#create-an-azure-ad-test-user)** - to test Microsoft Entra single sign-on with B.Simon.
    1. **[Assign the Microsoft Entra test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Microsoft Entra single sign-on.
1. **[Configure ProMaster (by Inlogik) SSO](#configure-promaster-by-inlogik-sso)** - to configure the single sign-on settings on application side.
    1. **[Create ProMaster (by Inlogik) test user](#create-promaster-by-inlogik-test-user)** - to have a counterpart of B.Simon in ProMaster (by Inlogik) that is linked to the Microsoft Entra representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

Follow these steps to enable Microsoft Entra SSO.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **ProMaster (by Inlogik)** > **Single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, if you wish to configure the application in **IDP** initiated mode, perform the following steps:

    a. In the **Identifier** text box, type a URL using one of the following patterns:

    | **Identifier** |
    |-------|
    | `https://secure.inlogik.com/<COMPANYNAME>` |
    | `https://<CUSTOMDOMAIN>/SAMLBASE` |

    b. In the **Reply URL** text box, type a URL using one of the following patterns:

    | **Reply URL** |
    |-------|
    | `https://secure.inlogik.com/<COMPANYNAME>/saml/acs` |
    | `https://<CUSTOMDOMAIN>/SAMLBASE/saml/acs` |

5. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

    In the **Sign-on URL** text box, type a URL using one of the following patterns:

    | **Sign-on URL** |
    |-----|
    | `https://secure.inlogik.com/<COMPANYNAME>` |
    | `https://<CUSTOMDOMAIN>/SAMLBASE` |

	> [!NOTE]
	> These values are not real. Update these values with the actual Identifier, Reply URL and Sign-on URL. Contact [ProMaster (by Inlogik) Client support team](https://www.inlogik.com/contact) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section.

6. On the **Set up Single Sign-On with SAML** page, In the **SAML Signing Certificate** section, click copy button to copy **App Federation Metadata Url** and save it on your computer.

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

In this section, you'll enable B.Simon to use single sign-on by granting access to ProMaster (by Inlogik).

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **ProMaster (by Inlogik)**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure ProMaster (by Inlogik) SSO

To configure single sign-on on **ProMaster (by Inlogik)** side, you need to send the **App Federation Metadata Url** to [ProMaster (by Inlogik) support team](https://www.inlogik.com/contact). They set this setting to have the SAML SSO connection set properly on both sides.

### Create ProMaster (by Inlogik) test user

In this section, you create a user called B.Simon in ProMaster (by Inlogik). Work with [ProMaster (by Inlogik) support team](https://www.inlogik.com/contact) to add the users in the ProMaster (by Inlogik) platform. Users must be created and activated before you use single sign-on.

## Test SSO

In this section, you test your Microsoft Entra single sign-on configuration with following options. 

#### SP initiated:

* Click on **Test this application**, this will redirect to ProMaster (by Inlogik) Sign on URL where you can initiate the login flow.  

* Go to ProMaster (by Inlogik) Sign-on URL directly and initiate the login flow from there.

#### IDP initiated:

* Click on **Test this application**, and you should be automatically signed in to the ProMaster (by Inlogik) for which you set up the SSO. 

You can also use Microsoft My Apps to test the application in any mode. When you click the ProMaster (by Inlogik) tile in the My Apps, if configured in SP mode you would be redirected to the application sign on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the ProMaster (by Inlogik) for which you set up the SSO. For more information, see [Microsoft Entra My Apps](/azure/active-directory/manage-apps/end-user-experiences#azure-ad-my-apps).

## Next steps

Once you configure ProMaster (by Inlogik) you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-aad).
