---
title: 'Tutorial: Azure Active Directory integration with Comeet Recruiting Software | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Comeet Recruiting Software.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 08/23/2021
ms.author: jeedes
---
# Tutorial: Azure Active Directory integration with Comeet Recruiting Software

In this tutorial, you'll learn how to integrate Comeet Recruiting Software with Azure Active Directory (Azure AD). When you integrate Comeet Recruiting Software with Azure AD, you can:

* Control in Azure AD who has access to Comeet Recruiting Software.
* Enable your users to be automatically signed-in to Comeet Recruiting Software with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Comeet Recruiting Software single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* Comeet Recruiting Software supports **SP and IDP** initiated SSO.
* Comeet Recruiting Software supports [Automated user provisioning](comeet-recruiting-software-provisioning-tutorial.md).


## Add Comeet Recruiting Software from the gallery

To configure the integration of Comeet Recruiting Software into Azure AD, you need to add Comeet Recruiting Software from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Comeet Recruiting Software** in the search box.
1. Select **Comeet Recruiting Software** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)


## Configure and test Azure AD SSO for Comeet Recruiting Software

Configure and test Azure AD SSO with Comeet Recruiting Software using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Comeet Recruiting Software.

To configure and test Azure AD SSO with Comeet Recruiting Software, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
2. **[Configure Comeet Recruiting Software SSO](#configure-comeet-recruiting-software-sso)** - to configure the Single Sign-On settings on application side.
    1. **[Create Comeet Recruiting Software test user](#create-comeet-recruiting-software-test-user)** - to have a counterpart of Britta Simon in Comeet Recruiting Software that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **Comeet Recruiting Software** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, If you wish to configure the application in **IDP** initiated mode, perform the following steps:

    a. In the **Identifier** text box, type a URL using the following pattern:
    `https://app.comeet.co/adfs_auth/acs/<UNIQUEID>/`

    b. In the **Reply URL** text box, type a URL using the following pattern:
    `https://app.comeet.co/adfs_auth/acs/<UNIQUEID>/`

    > [!NOTE]
    > These values are not real. Update these values with the actual Identifier, and Reply URL. Contact [Comeet Recruiting Software Client support team](https://support.comeet.co/knowledgebase/adfs-single-sign-on/) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

5. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

    In the **Sign-on URL** text box, type a URL:
    `https://app.comeet.co`

5. Comeet Recruiting Software application expects the SAML assertions in a specific format. Configure the following claims for this application. You can manage the values of these attributes from the **User Attributes** section on application integration page. On the **Set up Single Sign-On with SAML** page, click **Edit** button to open **User Attributes** dialog.

    ![Screenshot that shows the "User Attributes" section with the "Edit" button selected.](common/edit-attribute.png)

6. In the **User Claims** section on the **User Attributes** dialog, edit the claims by using **Edit icon** or add the claims by using **Add new claim** to configure SAML token attribute as shown in the image above and perform the following steps: 

    | Name |  Source Attribute|
    | ---------------| --------------- |
    | nameidentifier | user.mail |
    | comeet_id | user.userprincipalname |

    a. Click **Add new claim** to open the **Manage user claims** dialog.

    ![Screenshot that shows the "User claims" section with the "Add new claim" and "Save" actions highlighted.](common/new-save-attribute.png)

    ![image](common/new-attribute-details.png)

    b. In the **Name** textbox, type the attribute name shown for that row.

    c. Leave the **Namespace** blank.

    d. Select Source as **Attribute**.

    e. From the **Source attribute** list, type the attribute value shown for that row.

    f. Click **Ok**

    g. Click **Save**.

4. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Federation Metadata XML** from the given options as per your requirement and save it on your computer.

    ![The Certificate download link](common/metadataxml.png)

6. On the **Set up Comeet Recruiting Software** section, copy the appropriate URL(s) as per your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Comeet Recruiting Software.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Comeet Recruiting Software**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Comeet Recruiting Software SSO

To configure single sign-on on **Comeet Recruiting Software** side, you need to send the downloaded **Federation Metadata XML** and appropriate copied URLs from Azure portal to [Comeet Recruiting Software support team](https://support.comeet.co/knowledgebase/adfs-single-sign-on/). They set this setting to have the SAML SSO connection set properly on both sides.

### Create Comeet Recruiting Software test user

In this section, you create a user called Britta Simon in Comeet Recruiting Software. Work with [Comeet Recruiting Software support team](mailto:support@comeet.co) to add the users in the Comeet Recruiting Software platform. Users must be created and activated before you use single sign-on.

Comeet Recruiting Software also supports automatic user provisioning, you can find more details [here](./comeet-recruiting-software-provisioning-tutorial.md) on how to configure automatic user provisioning.

### Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options.

SP initiated:

* Click on Test this application in Azure portal. This will redirect to Comeet Recruiting Software Sign on URL where you can initiate the login flow.

* Go to Comeet Recruiting Software Sign-on URL directly and initiate the login flow from there.

IDP initiated:

* Click on Test this application in Azure portal and you should be automatically signed in to the Comeet Recruiting Software for which you set up the SSO

You can also use Microsoft My Apps to test the application in any mode. When you click the Comeet Recruiting Software tile in the My Apps, if configured in SP mode you would be redirected to the application sign on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the Comeet Recruiting Software for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).


## Next steps

Once you configure Comeet Recruiting Software you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-any-app).
