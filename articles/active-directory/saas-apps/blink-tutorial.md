---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with Blink'
description: Learn how to configure single sign-on between Azure Active Directory and Blink.
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

# Tutorial: Azure Active Directory single sign-on (SSO) integration with Blink

In this tutorial, you'll learn how to integrate Blink with Azure Active Directory (Azure AD). When you integrate Blink with Azure AD, you can:

* Control in Azure AD who has access to Blink.
* Enable your users to be automatically signed-in to Blink with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Blink single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* Blink supports **SP** initiated SSO.
* Blink supports **Just In Time** user provisioning.
* Blink supports [Automated user provisioning](blink-provisioning-tutorial.md).

## Adding Blink from the gallery

To configure the integration of Blink into Azure AD, you need to add Blink from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Blink** in the search box.
1. Select **Blink** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

## Configure and test Azure AD SSO for Blink

Configure and test Azure AD SSO with Blink using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Blink.

To configure and test Azure AD SSO with Blink, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Blink SSO](#configure-blink-sso)** - to configure the Single Sign-On settings on application side.
    1. **[Create Blink test user](#create-blink-test-user)** - to have a counterpart of B.Simon in Blink that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **Blink** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up Single Sign-On with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, enter the values for the following fields:

    1. In the **Sign on URL** text box, type a URL using one of the following patterns:

    | Sign-on URL|
    |------------|
    | `https://app.joinblink.com` |
    | `https://<SUBDOMAIN>.joinblink.com` |

    2. In the **Identifier (Entity ID)** text box, type a URL using the following pattern:

    `https://api.joinblink.com/saml/o-<TENANTID>`

    > [!NOTE]
    > These values are not real. Update these values with the actual Sign on URL and Identifier. Contact [Blink Client support team](https://help.joinblink.com) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

1. Blink Meetings application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes. Click **Edit** icon to open User Attributes dialog.

    ![image](common/edit-attribute.png)

1. In addition to above, Blink Meetings application expects few more attributes to be passed back in SAML response. In the User Claims section on the User Attributes dialog, perform the following steps to add SAML token attribute as shown in the below table:

    | Name | Source Attribute|
    | ---------------|  --------- |
    |   first_name    | user.givenname |
    |   second_name    | user.surname |
    |   email       | user.mail |
    | | |

    1. Click **Add new claim** to open the **Manage user claims** dialog.

    1. In the **Name** textbox, type the attribute name shown for that row.

    1. Leave the **Namespace** blank.

    1. Select Source as **Attribute**.

    1. From the **Source attribute** list, type the attribute value shown for that row.

    1. Click **Save**.

1. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section,  find **Federation Metadata XML** and select **Download** to download the certificate and save it on your computer.

    ![The Certificate download link](common/metadataxml.png)

1. On the **Set up Blink** section, copy the appropriate URL(s) based on your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Blink.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Blink**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Blink SSO

To configure single sign-on on **Blink** side, you need to send the downloaded **Federation Metadata XML** and appropriate copied URLs from Azure portal to [Blink support team](https://help.joinblink.com). They set this setting to have the SAML SSO connection set properly on both sides.

### Create Blink test user

In this section, a user called Britta Simon is created in Blink. Blink supports just-in-time user provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in Blink, a new one is created after authentication.

Blink also supports automatic user provisioning, you can find more details [here](./blink-provisioning-tutorial.md) on how to configure automatic user provisioning.

## Test SSO

In this section, you test your Azure AD single sign-on configuration with following options.

* Click on Test this application in Azure portal. This will redirect to Blink Sign-on URL where you can initiate the login flow.

* Go to Blink Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the Blink tile in the My Apps, this will redirect to Blink Sign-on URL. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Next steps

Once you configure Blink you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-aad).
