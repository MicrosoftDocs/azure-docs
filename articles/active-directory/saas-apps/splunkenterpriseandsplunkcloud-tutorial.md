---
title: 'Tutorial: Azure AD SSO integration with Azure AD SSO for Splunk Enterprise and Splunk Cloud'
description: Learn how to configure single sign-on between Azure Active Directory and Azure AD SSO for Splunk Enterprise and Splunk Cloud.
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
# Tutorial: Azure AD SSO integration with Azure AD SSO for Splunk Enterprise and Splunk Cloud

In this tutorial, you'll learn how to integrate Azure AD SSO for Splunk Enterprise and Splunk Cloud with Azure Active Directory (Azure AD). When you integrate Azure AD SSO for Splunk Enterprise and Splunk Cloud with Azure AD, you can:

* Control in Azure AD who has access to Azure AD SSO for Splunk Enterprise and Splunk Cloud.
* Enable your users to be automatically signed in to Azure AD SSO for Splunk Enterprise and Splunk Cloud with their Azure AD accounts.
* Manage your accounts in one central location: the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Azure AD SSO for Splunk Enterprise and Splunk Cloud single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* Azure AD SSO for Splunk Enterprise and Splunk Cloud supports **SP** initiated SSO.

## Add Azure AD SSO for Splunk Enterprise and Splunk Cloud from the gallery

To configure the integration of Azure AD SSO for Splunk Enterprise and Splunk Cloud into Azure AD, you need to add Azure AD SSO for Splunk Enterprise and Splunk Cloud from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Azure AD SSO for Splunk Enterprise and Splunk Cloud** in the search box.
1. Select **Azure AD SSO for Splunk Enterprise and Splunk Cloud** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

## Configure and test Azure AD SSO for Azure AD SSO for Splunk Enterprise and Splunk Cloud

Configure and test Azure AD SSO with Azure AD SSO for Splunk Enterprise and Splunk Cloud using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Azure AD SSO for Splunk Enterprise and Splunk Cloud.

To configure and test Azure AD SSO with Azure AD SSO for Splunk Enterprise and Splunk Cloud, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Azure AD SSO for Splunk Enterprise and Splunk Cloud SSO](#configure-azure-ad-sso-for-splunk-enterprise-and-splunk-cloud-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Azure AD SSO for Splunk Enterprise and Splunk Cloud test user](#create-azure-ad-sso-for-splunk-enterprise-and-splunk-cloud-test-user)** - to have a counterpart of B.Simon in Azure AD SSO for Splunk Enterprise and Splunk Cloud that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **Azure AD SSO for Splunk Enterprise and Splunk Cloud** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, perform the following steps:

    a. In the **Sign-on URL** text box, type a URL using the following pattern:
    `https://<splunkserverUrl>/app/launcher/home`

    b. In the **Identifier** box, type a URL using the following pattern:
    `<splunkserverUrl>`

    c. In the **Reply URL** text box, type a URL using the following pattern:
    `https://<splunkserver>/saml/acs`

	> [!NOTE]
	> These values are not real. Update these values with the actual Sign-On URL, Identifier and Reply URL. Contact [Azure AD SSO for Splunk Enterprise and Splunk Cloud Client support team](https://www.splunk.com/en_us/about-splunk/contact-us.html) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

5. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Federation Metadata XML** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Azure AD SSO for Splunk Enterprise and Splunk Cloud.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Azure AD SSO for Splunk Enterprise and Splunk Cloud**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Azure AD SSO for Splunk Enterprise and Splunk Cloud SSO

1. Log in to the Splunk Enterprise and Splunk Cloud website as an administrator.

1. Go to the **Settings > Access Controls** menu option.

1. Click on the **Authentication method** link. Click on the **SAML** radio button

1. Click on the **Configure Splunk to use SAML** link below the SAML radio button.

    ![Screenshot that shows Configure Splunk to use SAML.](./media/splunk-enterprise-and-splunk-cloud-tutorial/configure-splunk.png)

1. Perform the following steps in the **SAML Configuration** section:

    ![Screenshot that shows Configure Splunk to SAML configuration.](./media/splunk-enterprise-and-splunk-cloud-tutorial/sso-configuration.png)

    a. Click on the **Select File** button to upload the **Federation Metadata XML** file, which you have downloaded from Azure portal.

    b. In the **Entity ID** field, enter the **Identifier** value, which you have copied from the Azure portal.

    c. Check the **Verify SAML response** checkbox.This will be a requirement moving forward in Splunk Cloud for security best practices, so please make sure this is checked.

1. Scroll down within the configuration dialogue and click on the **Alias** section. Enter the following values in each attribute:

    a. **Role alias**: `http://schemas.microsoft.com/ws/2008/06/identity/claims/groups`

    b.**RealName alias**: `http://schemas.microsoft.com/identity/claims/displayname`

    c. **Mail alias**: `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress`

    ![Screenshot that shows role mapping.](./media/splunk-enterprise-and-splunk-cloud-tutorial/role-alias.png)

1. Scroll down to the **Advanced Settings** section and perform the following steps:

    ![Screenshot that shows Advanced Settings.](./media/splunk-enterprise-and-splunk-cloud-tutorial/advanced-settings.png)

    a. Click the **Name Id Format** and select **Email Address** from the dropdown.

    b. In the **Fully qualified domain name or IP of the load balancer** text box, enter the value as: `https://<acme>.splunkcloud.com`.

    c. Set **Redirect port – load balancer port** to `0(zero)` and click **Save**.

1. Click on the green **New Group** button in the upper right hand corner of the SAML Groups configuration screen in Splunk.

1. In the **Create new SAML Group** configuration dialogue, paste in the first Object ID into the **Group Name** field. Then choose one or more **Splunk Roles** that you wish to map to users that are assigned to that group from the **Available Item(s)** box; the items you choose will populate over into the **Selected Item(s)** box. Click the green **Save** button once finished.

### Create Azure AD SSO for Splunk Enterprise and Splunk Cloud test user

In this section, you create a user called Britta Simon in Azure AD SSO for Splunk Enterprise and Splunk Cloud. Work with [Azure AD SSO for Splunk Enterprise and Splunk Cloud support team](https://www.splunk.com/en_us/about-splunk/contact-us.html) to add the users in the Azure AD SSO for Splunk Enterprise and Splunk Cloud platform. Users must be created and activated before you use single sign-on.

## Test SSO

In this section, you test your Azure AD single sign-on configuration with following options. 

* Click on **Test this application** in Azure portal. This will redirect to Azure AD SSO for Splunk Enterprise and Splunk Cloud Sign-on URL where you can initiate the login flow. 

* Go to Azure AD SSO for Splunk Enterprise and Splunk Cloud Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the Azure AD SSO for Splunk Enterprise and Splunk Cloud tile in the My Apps, this will redirect to Azure AD SSO for Splunk Enterprise and Splunk Cloud Sign-on URL. For more information about the My Apps, see [Introduction to the My Apps](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).

## Next steps

Once you configure Azure AD SSO for Splunk Enterprise and Splunk Cloud you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-any-app).
