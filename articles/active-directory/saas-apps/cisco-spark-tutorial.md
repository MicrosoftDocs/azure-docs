---
title: 'Tutorial: Azure Active Directory Single sign-on (SSO) integration with Cisco Webex | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Cisco Webex.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 02/17/2021
ms.author: jeedes
---

# Tutorial: Azure Active Directory Single sign-on (SSO) integration with Cisco Webex

In this tutorial, you'll learn how to integrate Cisco Webex with Azure Active Directory (Azure AD). When you integrate Cisco Webex with Azure AD, you can:

* Control in Azure AD who has access to Cisco Webex.
* Enable your users to be automatically signed-in to Cisco Webex with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Cisco Webex single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* Cisco Webex supports **SP** initiated SSO.
* Cisco Webex supports [**Automated user provisioning**](./cisco-webex-provisioning-tutorial.md).

## Adding Cisco Webex from the gallery

To configure the integration of Cisco Webex into Azure AD, you need to add Cisco Webex from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Cisco Webex** in the search box.
1. Select **Cisco Webex** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD SSO for Cisco Webex

Configure and test Azure AD SSO with Cisco Webex using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Cisco Webex.

To configure and test Azure AD SSO with Cisco Webex, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** to enable your users to use this feature.
	1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** to test Azure AD single sign-on with B.Simon.
	1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** to enable B.Simon to use Azure AD single sign-on.
2. **[Configure Cisco Webex](#configure-cisco-webex)** to configure the SSO settings on application side.
	1. **[Create Cisco Webex test user](#create-cisco-webex-test-user)** to have a counterpart of B.Simon in Cisco Webex that is linked to the Azure AD representation of user.
3. **[Test SSO](#test-sso)** to verify whether the configuration works.

### Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **Cisco Webex** application integration page, find the **Manage** section and select **Single sign-on**.
1. On the **Select a Single sign-on method** page, select **SAML**.
1. On the **Set up Single Sign-On with SAML** page, click the edit/pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, upload the downloaded **Service Provider metadata** file and configure the application by performing the following steps:

	>[!Note]
	>You will get the Service Provider Metadata file from the **Configure Cisco Webex** section, which is explained later in the tutorial. 

	a. Click **Upload metadata file**.

	b. Click on **folder logo** to select the metadata file and click **Upload**.

	c. After successful completion of uploading Service Provider metadata file the **Identifier** and **Reply URL** values get auto populated in **Basic SAML Configuration** section:

	In the **Sign on URL** textbox, paste the value of **Reply URL**, which gets autofilled by SP metadata file upload.

1. Cisco Webex application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes.

	![image](common/default-attributes.png)

1. In addition to above, Cisco Webex application expects few more attributes to be passed back in SAML response which are shown below. These attributes are also pre populated but you can review them as per your requirements.
  
	| Name |  Source Attribute|
	| ---------------|--------- |
	| uid | user.userprincipalname |

	> [!NOTE]
	>  The source attribute value is by default mapped to userpricipalname. This can be changed to user.mail or user.onpremiseuserprincipalname or any other value as per the setting in Webex.


1. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, find **Federation Metadata XML** and select **Download** to download the certificate and save it on your computer.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Cisco Webex.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Cisco Webex**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Cisco Webex

1. Sign in to Cisco Webex with your administrator credentials.

1. Select **Organization Settings** and under the **Authentication** section, click **Modify**.

    ![Screenshot shows Authentication Settings where you can select Modify.](./media/cisco-spark-tutorial/organization-settings.png)
  
1. Select **Integrate a 3rd-party identity provider. (Advanced)** and click on **Next**.

	![Screenshot shows Integrate a 3rd-party identity provider.](./media/cisco-spark-tutorial/enterprise-settings.png)

1. Click on **Download Metadata File** to download the **Service Provider Metadata file** and save it in your computer, click on **Next**.

	![Screenshot shows Service Provider Metadata file.](./media/cisco-spark-tutorial/sp-metadata.png)

1. Click on **file browser** option to locate and upload the Azure AD metadata file. Then, select **Require certificate signed by a certificate authority in Metadata (more secure)** and click **Next**.

	![Screenshot shows Import I d P Metadata page.](./media/cisco-spark-tutorial/idp-metadata.png)

1. Select **Test SSO Connection**, and when a new browser tab opens, authenticate with Azure AD by signing in.

1. Return to the **Cisco Cloud Collaboration Management** browser tab. If the test was successful, select **This test was successful. Enable Single Sign-On option** and click **Next**.

1. Click **Save**.

> [!NOTE]
> To know more about how to configure the Cisco Webex, please refer to [this](https://help.webex.com/WBX000022701/How-Do-I-Configure-Microsoft-Azure-Active-Directory-Integration-with-Cisco-Webex-Through-Site-Administration#:~:text=In%20the%20Azure%20portal%2C%20select,in%20the%20Add%20Assignment%20dialog) page.

### Create Cisco Webex test user

In this section, a user called B.Simon is created in Cisco Webex.This application supports automatic user provisioning, which enables automatic provisioning and deprovisioning based on your business rules.  Microsoft recommends using automatic provisioning whenever possible. See how to enable auto provisioning for [Cisco Webex](./cisco-webex-provisioning-tutorial.md).

If you need to create a user manually, perform the following steps:

1. Sign in to Cisco Webex with your administrator credentials.

2. Click **Users** and then **Manage Users**.
   
    ![Screenshot shows the Users page where you can Manage Users.](./media/cisco-spark-tutorial/user-1.png) 

3. In the **Manage Users** window, select **Manually Add or Modify Users**.

	![Screenshot shows the Users page where you can Manage Users and select Manually Add or Modify Users.](./media/cisco-spark-tutorial/user-2.png)

4. Select **Names and Email address**. Then, fill out the textbox as follows:

    ![Screenshot shows the Mange Users dialog box where you can manually add or modify users.](./media/cisco-spark-tutorial/user-3.png) 

	a. In the **First Name** textbox, type first name of user like **B**.

	b. In the **Last Name** textbox, type last name of user like **Simon**.

	c. In the **Email address** textbox, type email address of user like b.simon@contoso.com.

5. Click the plus sign to add B.Simon. Then, click **Next**.

6. In the **Add Services for Users** window, click **Add Users** and then **Finish**.

## Test SSO

In this section, you test your Azure AD single sign-on configuration with following options. 

* Click on **Test this application** in Azure portal. This will redirect to Cisco Webex Sign-on URL where you can initiate the login flow. 

* Go to Cisco Webex Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the Cisco Webex tile in the My Apps, this will redirect to Cisco Webex Sign-on URL. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).


## Next steps

Once you configure Cisco Webex you can enforce Session Control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session Control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad)