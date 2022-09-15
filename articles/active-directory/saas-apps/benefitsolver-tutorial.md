---
title: 'Tutorial: Azure AD SSO integration with Benefitsolver'
description: Learn how to configure single sign-on between Azure Active Directory and Benefitsolver.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 09/30/2021
ms.author: jeedes
---
# Tutorial: Azure AD SSO integration with Benefitsolver

In this tutorial, you'll learn how to integrate Benefitsolver with Azure Active Directory (Azure AD). When you integrate Benefitsolver with Azure AD, you can:

* Control in Azure AD who has access to Benefitsolver.
* Enable your users to be automatically signed-in to Benefitsolver with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Benefitsolver single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* Benefitsolver supports **SP** initiated SSO.

## Add Benefitsolver from the gallery

To configure the integration of Benefitsolver into Azure AD, you need to add Benefitsolver from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Benefitsolver** in the search box.
1. Select **Benefitsolver** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

## Configure and test Azure AD SSO for Benefitsolver

Configure and test Azure AD SSO with Benefitsolver using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Benefitsolver.

To configure and test Azure AD SSO with Benefitsolver, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Benefitsolver SSO](#configure-benefitsolver-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Benefitsolver test user](#create-benefitsolver-test-user)** - to have a counterpart of B.Simon in Benefitsolver that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **Benefitsolver** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, perform the following steps:

    a. In the **Identifier** box, type a URL using the following pattern:
    `https://<companyname>.benefitsolver.com/saml20`

    b. In the **Reply URL** text box, type the URL using the following pattern:
    `https://www.benefitsolver.com/benefits/BenefitSolverView?page_name=single_signon_saml`

	 c. In the **Sign-on URL** text box, type a URL using the following pattern:
    `http://<companyname>.benefitsolver.com`

	> [!NOTE]
	> These values are not real. Update these values with the actual Identifier, Reply URL and Sign on URL. Contact [Benefitsolver Client support team](https://www.businessolver.com/contact) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

5. Benefitsolver application expects the SAML assertions in a specific format. Configure the following claims for this application. You can manage the values of these attributes from the **User Attributes** section on application integration page. On the **Set up Single Sign-On with SAML** page, click **Edit** button to open **User Attributes** dialog.

	![Screenshot shows User Attributes with the edit control called out.](common/edit-attribute.png)

6. In the **User Claims** section on the **User Attributes** dialog, edit the claims by using **Edit icon** or add the claims by using **Add new claim** to configure SAML token attribute as shown in the image above and perform the following steps: 

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

7. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Federation Metadata XML** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

8. On the **Set up Benefitsolver** section, copy the appropriate URL(s) as per your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Benefitsolver.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Benefitsolver**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Benefitsolver SSO

To configure single sign-on on **Benefitsolver** side, you need to send the downloaded **Metadata XML** and appropriate copied URLs from Azure portal to [Benefitsolver support team](https://www.businessolver.com/contact). They set this setting to have the SAML SSO connection set properly on both sides.

> [!NOTE]
> Your Benefitsolver support team has to do the actual SSO configuration. You will get a notification when SSO has been enabled for your subscription.

### Create Benefitsolver test user

In this section, you create a user called Britta Simon in Benefitsolver. Work with [Benefitsolver support team](https://www.businessolver.com/contact) to add the users in the Benefitsolver platform. Users must be created and activated before you use single sign-on.

## Test SSO

In this section, you test your Azure AD single sign-on configuration with following options. 

* Click on **Test this application** in Azure portal. This will redirect to Benefitsolver Sign-on URL where you can initiate the login flow. 

* Go to Benefitsolver Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the Benefitsolver tile in the My Apps, this will redirect to Benefitsolver Sign-on URL. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Next steps

Once you configure Benefitsolver you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-aad).
