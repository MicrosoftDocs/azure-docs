---
title: 'Tutorial: Azure AD SSO integration with eKincare'
description: Learn how to configure single sign-on between Azure Active Directory and eKincare.
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
# Tutorial: Azure AD SSO integration with eKincare

In this tutorial, you'll learn how to integrate eKincare with Azure Active Directory (Azure AD). When you integrate eKincare with Azure AD, you can:

* Control in Azure AD who has access to eKincare.
* Enable your users to be automatically signed-in to eKincare with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To configure Azure AD integration with eKincare, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get a [free account](https://azure.microsoft.com/free/).
* eKincare single sign-on enabled subscription.
* Along with Cloud Application Administrator, Application Administrator can also add or manage applications in Azure AD.
For more information, see [Azure built-in roles](../roles/permissions-reference.md).

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* eKincare supports **IDP** initiated SSO.

* eKincare supports **Just In Time** user provisioning.

## Add eKincare from the gallery

To configure the integration of eKincare into Azure AD, you need to add eKincare from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **eKincare** in the search box.
1. Select **eKincare** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

## Configure and test Azure AD SSO for eKincare

Configure and test Azure AD SSO with eKincare using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in eKincare.

To configure and test Azure AD SSO with eKincare, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure eKincare SSO](#configure-ekincare-sso)** - to configure the single sign-on settings on application side.
    1. **[Create eKincare test user](#create-ekincare-test-user)** - to have a counterpart of B.Simon in eKincare that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **eKincare** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Screenshot shows to edit Basic S A M L Configuration.](common/edit-urls.png "Basic Configuration")

1. On the **Basic SAML Configuration** section, perform the following steps:

    a. In the **Identifier** text box, type a URL using the following pattern:
    `https://<instancename>.ekincare.com/`

    b. In the **Reply URL** text box, type a URL using the following pattern:
    `https://<instancename>.ekincare.com/hul/saml`

	> [!NOTE]
	> These values are not real. Update these values with the actual Identifier and Reply URL. Contact [eKincare Client support team](mailto:tech@ekincare.com) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

1. eKincare application expects the SAML assertions in a specific format. Configure the following claims for this application. You can manage the values of these attributes from the **User Attributes** section on application integration page. On the **Set up Single Sign-On with SAML** page, click **Edit** button to open **User Attributes** dialog.

	![Screenshot that shows the User Attributes dialog with the edit button selected.](common/edit-attribute.png "Attributes")

1. In the **User Claims** section on the **User Attributes** dialog, edit the claims by using **Edit icon** or add the claims by using **Add new claim** to configure SAML token attribute as shown in the image above and perform the following steps: 

	| Name | Source Attribute |
	| ---------------| --------------- |    
	| employeeid | *user.extensionattribute1* |
	| organizationid | *"uniquevalue"* |
	| organizationname | *user.companyname* |
	
	a. Click **Add new claim** to open the **Manage user claims** dialog.

	![Screenshot that shows the "User claims" dialog with the "Add new claim" and "Save" buttons selected.](common/new-save-attribute.png "Claims")

	![Screenshot that shows the image of eKincare application.](common/new-attribute-details.png "Details")

	b. In the **Name** textbox, type the attribute name shown for that row.

	c. Leave the **Namespace** blank.

	d. Select Source as **Attribute**.

	e. From the **Source attribute** list, type the attribute value shown for that row.

	f. Click **Ok**

	g. Click **Save**.

1. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Federation Metadata XML** from the given options as per your requirement and save it on your computer.

	![Screenshot that shows the Certificate download link.](common/metadataxml.png "Certificate")

1. On the **Set up eKincare** section, copy the appropriate URL(s) as per your requirement.

	![Screenshot shows to copy configuration appropriate U R L.](common/copy-configuration-urls.png "Metadata")

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to eKincare.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **eKincare**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure eKincare SSO

To configure single sign-on on **eKincare** side, you need to send the downloaded **Federation Metadata XML** and appropriate copied URLs from Azure portal to [eKincare support team](mailto:tech@ekincare.com). They set this setting to have the SAML SSO connection set properly on both sides.

### Create eKincare test user

In this section, a user called Britta Simon is created in eKincare. eKincare supports **just-in-time user provisioning**, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in eKincare, a new one is created after authentication.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options.

* Click on Test this application in Azure portal and you should be automatically signed in to the eKincare for which you set up the SSO.

* You can use Microsoft My Apps. When you click the eKincare tile in the My Apps, you should be automatically signed in to the eKincare for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Next steps

Once you configure eKincare you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).