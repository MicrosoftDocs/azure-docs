---
title: 'Tutorial: Microsoft Entra SSO integration with Benefitsolver'
description: Learn how to configure single sign-on between Microsoft Entra ID and Benefitsolver.
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
# Tutorial: Microsoft Entra SSO integration with Benefitsolver

In this tutorial, you'll learn how to integrate Benefitsolver with Microsoft Entra ID. When you integrate Benefitsolver with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to Benefitsolver.
* Enable your users to be automatically signed-in to Benefitsolver with their Microsoft Entra accounts.
* Manage your accounts in one central location.

## Prerequisites

To get started, you need the following items:

* A Microsoft Entra subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Benefitsolver single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Microsoft Entra single sign-on in a test environment.

* Benefitsolver supports **SP** initiated SSO.

## Add Benefitsolver from the gallery

To configure the integration of Benefitsolver into Microsoft Entra ID, you need to add Benefitsolver from the gallery to your list of managed SaaS apps.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the **Add from the gallery** section, type **Benefitsolver** in the search box.
1. Select **Benefitsolver** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

<a name='configure-and-test-azure-ad-sso-for-benefitsolver'></a>

## Configure and test Microsoft Entra SSO for Benefitsolver

Configure and test Microsoft Entra SSO with Benefitsolver using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between a Microsoft Entra user and the related user in Benefitsolver.

To configure and test Microsoft Entra SSO with Benefitsolver, perform the following steps:

1. **[Configure Microsoft Entra SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create a Microsoft Entra test user](#create-an-azure-ad-test-user)** - to test Microsoft Entra single sign-on with B.Simon.
    1. **[Assign the Microsoft Entra test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Microsoft Entra single sign-on.
1. **[Configure Benefitsolver SSO](#configure-benefitsolver-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Benefitsolver test user](#create-benefitsolver-test-user)** - to have a counterpart of B.Simon in Benefitsolver that is linked to the Microsoft Entra representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

Follow these steps to enable Microsoft Entra SSO.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Benefitsolver** > **Single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, perform the following steps:

    a. In the **Identifier** box, type a URL using the following pattern:
    `https://<companyname>.benefitsolver.com/saml20`

    b. In the **Reply URL** text box, type the URL using the following pattern:
    `https://www.benefitsolver.com/benefits/BenefitSolverView?page_name=single_signon_saml`

	 c. In the **Sign-on URL** text box, type a URL using the following pattern:
    `http://<companyname>.benefitsolver.com`

	> [!NOTE]
	> These values are not real. Update these values with the actual Identifier, Reply URL and Sign on URL. Contact [Benefitsolver Client support team](https://www.businessolver.com/contact) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section.

1. Benefitsolver application expects the SAML assertions in a specific format. Configure the following claims for this application. You can manage the values of these attributes from the **User Attributes** section on application integration page. On the **Set up Single Sign-On with SAML** page, click **Edit** button to open **User Attributes** dialog.

	![Screenshot shows User Attributes with the edit control called out.](common/edit-attribute.png)

1. In the **User Claims** section on the **User Attributes** dialog, edit the claims by using **Edit icon** or add the claims by using **Add new claim** to configure SAML token attribute as shown in the image above and perform the following steps: 

	| Name |  Source Attribute|
	|---------------|----------------|
	| ClientID | You need to get this value from your [Benefitsolver Client support team](https://www.businessolver.com/contact).|
	| ClientKey | You need to get this value from your [Benefitsolver Client support team](https://www.businessolver.com/contact).|
	| LogoutURL | You need to get this value from your [Benefitsolver Client support team](https://www.businessolver.com/contact).|
	| EmployeeID | You need to get this value from your [Benefitsolver Client support team](https://www.businessolver.com/contact).|
	| | |

	a. Click **Add new claim** to open the **Manage user claims** dialog.

	![Screenshot shows User claims with Add new claim and Save called out.](common/new-save-attribute.png)

	![Screenshot shows Manage user claims where you can enter the values described in this step.](common/new-attribute-details.png)

	b. In the **Name** textbox, type the attribute name shown for that row.

	c. Leave the **Namespace** blank.

	d. Select Source as **Attribute**.

	e. From the **Source attribute** list, type the attribute value shown for that row.

	f. Click **Ok**

	g. Click **Save**.

1. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Federation Metadata XML** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

1. On the **Set up Benefitsolver** section, copy the appropriate URL(s) as per your requirement.

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

In this section, you'll enable B.Simon to use single sign-on by granting access to Benefitsolver.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Benefitsolver**.
1. In the app's overview page, select **Users and groups**.
1. Select **Add user/group**, then select **Users and groups** in the **Add Assignment** dialog.
   1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
   1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
   1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Benefitsolver SSO

To configure single sign-on on **Benefitsolver** side, you need to send the downloaded **Metadata XML** and appropriate copied URLs from the application configuration to [Benefitsolver support team](https://www.businessolver.com/contact). They set this setting to have the SAML SSO connection set properly on both sides.

> [!NOTE]
> Your Benefitsolver support team has to do the actual SSO configuration. You will get a notification when SSO has been enabled for your subscription.

### Create Benefitsolver test user

In this section, you create a user called Britta Simon in Benefitsolver. Work with [Benefitsolver support team](https://www.businessolver.com/contact) to add the users in the Benefitsolver platform. Users must be created and activated before you use single sign-on.

## Test SSO

In this section, you test your Microsoft Entra single sign-on configuration with following options. 

* Click on **Test this application**, this will redirect to Benefitsolver Sign-on URL where you can initiate the login flow. 

* Go to Benefitsolver Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the Benefitsolver tile in the My Apps, this will redirect to Benefitsolver Sign-on URL. For more information, see [Microsoft Entra My Apps](/azure/active-directory/manage-apps/end-user-experiences#azure-ad-my-apps).

## Next steps

Once you configure Benefitsolver you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-aad).
