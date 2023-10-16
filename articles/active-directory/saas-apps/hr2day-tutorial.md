---
title: 'Tutorial: Microsoft Entra SSO integration with HR2day by Merces'
description: Learn how to configure single sign-on between Microsoft Entra ID and HR2day by Merces.
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
# Tutorial: Microsoft Entra SSO integration with HR2day by Merces

In this tutorial, you'll learn how to integrate HR2day by Merces with Microsoft Entra ID. When you integrate HR2day by Merces with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to HR2day by Merces.
* Enable your users to be automatically signed-in to HR2day by Merces with their Microsoft Entra accounts.
* Manage your accounts in one central location.

## Prerequisites

To configure Microsoft Entra integration with HR2day by Merces, you need the following items:

* A Microsoft Entra subscription. If you don't have a Microsoft Entra environment, you can get a [free account](https://azure.microsoft.com/free/).
* HR2day by Merces single sign-on enabled subscription.
* Along with Cloud Application Administrator, Application Administrator can also add or manage applications in Microsoft Entra ID.
For more information, see [Azure built-in roles](../roles/permissions-reference.md).

## Scenario description

In this tutorial, you configure and test Microsoft Entra single sign-on in a test environment.

* HR2day by Merces supports **SP** initiated SSO.

## Add HR2day by Merces from the gallery

To configure the integration of HR2day by Merces into Microsoft Entra ID, you need to add HR2day by Merces from the gallery to your list of managed SaaS apps.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the **Add from the gallery** section, type **HR2day by Merces** in the search box.
1. Select **HR2day by Merces** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

<a name='configure-and-test-azure-ad-sso-for-hr2day-by-merces'></a>

## Configure and test Microsoft Entra SSO for HR2day by Merces

Configure and test Microsoft Entra SSO with HR2day by Merces using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between a Microsoft Entra user and the related user in HR2day by Merces.

To configure and test Microsoft Entra SSO with HR2day by Merces, perform the following steps:

1. **[Configure Microsoft Entra SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create a Microsoft Entra test user](#create-an-azure-ad-test-user)** - to test Microsoft Entra single sign-on with B.Simon.
    1. **[Assign the Microsoft Entra test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Microsoft Entra single sign-on.
1. **[Configure HR2day by Merces SSO](#configure-hr2day-by-merces-sso)** - to configure the single sign-on settings on application side.
    1. **[Create HR2day by Merces test user](#create-hr2day-by-merces-test-user)** - to have a counterpart of B.Simon in HR2day by Merces that is linked to the Microsoft Entra representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

Follow these steps to enable Microsoft Entra SSO.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **HR2day by Merces** > **Single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

    ![Screenshot shows to edit Basic S A M L Configuration.](common/edit-urls.png "Basic Configuration")

1. On the **Basic SAML Configuration** section, perform the following steps:

    a. In the **Identifier (Entity ID)** text box, type a URL using the following pattern:
    `https://hr2day.force.com/<companyname>`
	
	b. In the **Sign on URL** text box, type a URL using the following pattern:
    `https://<tenantname>.force.com/<instancename>`

	> [!NOTE]
	> These values are not real. Update these values with the actual Identifier and Sign on URL. Contact [HR2day by Merces Client support team](mailto:servicedesk@merces.nl) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section.

1. Your HR2day by Merces application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes. Click **Edit** icon to open **User Attributes** dialog.

	![Screenshot shows User Attributes with the Edit icon selected.](common/edit-attribute.png "Attributes")

	> [!NOTE]
    > Before you can configure the SAML assertion, you must contact the [HR2day by Merces Client support team](mailto:servicedesk@merces.nl) and request the value of the unique identifier attribute for your tenant. You need this value to complete the steps in the next section.

1. In the **User Claims** section on the **User Attributes** dialog, edit the claims by using **Edit icon** or add the claims by using **Add new claim** to configure SAML token attribute as shown in the image above and perform the following steps:

	| Name |  Source Attribute |
    | ---------- | ----------- |
	| ATTR_LOGINCLAIM | `join([mail],"102938475Z","@"` |
	| | |

	a. Click **Add new claim** to open the **Manage user claims** dialog.

	![Screenshot shows User claims with the option to Add new claim.](common/new-save-attribute.png "Claims")

	![Screenshot shows the Manage user claims dialog box where you can enter the values described.](common/new-attribute-details.png "Details")

	b. In the **Name** textbox, type the attribute name shown for that row.

	c. Leave the **Namespace** blank.

	d. Select Source as **Attribute**.

	e. From the **Source attribute** list, type the attribute value shown for that row.

	f. Click **Ok**

	g. Click **Save**.

1. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Certificate (Base64)** from the given options as per your requirement and save it on your computer.

	![Screenshot shows the Certificate download link.](common/certificatebase64.png "Certificate")

1. On the **Set up HR2day by Merces** section, copy the appropriate URL(s) as per your requirement.

	![Screenshot shows to copy configuration appropriate U R L.](common/copy-configuration-urls.png "Metadata") 

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

In this section, you'll enable B.Simon to use single sign-on by granting access to HR2day by Merces.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **HR2day by Merces**.
1. In the app's overview page, select **Users and groups**.
1. Select **Add user/group**, then select **Users and groups** in the **Add Assignment** dialog.
   1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
   1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
   1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure HR2day by Merces SSO

To configure single sign-on on **HR2day by Merces** side, you need to send the downloaded **Certificate (Base64)** and appropriate copied URLs from the application configuration to [HR2day by Merces support team](mailto:servicedesk@merces.nl). They set this setting to have the SAML SSO connection set properly on both sides.

> [!NOTE]
> Mention to the Merces team that this integration needs the Entity ID to be set with the pattern **https:\//hr2day.force.com/INSTANCENAME**.

### Create HR2day by Merces test user

In this section, you create a user called Britta Simon in HR2day by Merces. Work with [HR2day by Merces support team](mailto:servicedesk@merces.nl) to add the users in the HR2day by Merces platform. Users must be created and activated before you use single sign-on.

> [!NOTE]
> If you need to create a user manually, contact the [HR2day by Merces client support team](mailto:servicedesk@merces.nl).

## Test SSO

In this section, you test your Microsoft Entra single sign-on configuration with following options. 

* Click on **Test this application**, this will redirect to HR2day by Merces Sign-on URL where you can initiate the login flow. 

* Go to HR2day by Merces Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the HR2day by Merces tile in the My Apps, this will redirect to HR2day by Merces Sign-on URL. For more information, see [Microsoft Entra My Apps](/azure/active-directory/manage-apps/end-user-experiences#azure-ad-my-apps).

## Next steps

Once you configure HR2day by Merces you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).
