---
title: 'Tutorial: Microsoft Entra integration with SAP Business ByDesign'
description: Learn how to configure single sign-on between Microsoft Entra ID and SAP Business ByDesign.
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
# Tutorial: Microsoft Entra integration with SAP Business ByDesign

In this tutorial, you'll learn how to integrate SAP Business ByDesign with Microsoft Entra ID. When you integrate SAP Business ByDesign with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to SAP Business ByDesign.
* Enable your users to be automatically signed-in to SAP Business ByDesign with their Microsoft Entra accounts.
* Manage your accounts in one central location.

## Prerequisites

To get started, you need the following items:

* A Microsoft Entra subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* SAP Business ByDesign single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Microsoft Entra SSO in a test environment.

* SAP Business ByDesign supports **SP** initiated SSO

## Add SAP Business ByDesign from the gallery

To configure the integration of SAP Business ByDesign into Microsoft Entra ID, you need to add SAP Business ByDesign from the gallery to your list of managed SaaS apps.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the **Add from the gallery** section, type **SAP Business ByDesign** in the search box.
1. Select **SAP Business ByDesign** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

<a name='configure-and-test-azure-ad-sso'></a>

## Configure and test Microsoft Entra SSO

Configure and test Microsoft Entra SSO with SAP Business ByDesign using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between a Microsoft Entra user and the related user in SAP Business ByDesign.

To configure and test Microsoft Entra SSO with SAP Business ByDesign, perform the following steps:

1. **[Configure Microsoft Entra SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create a Microsoft Entra test user](#create-an-azure-ad-test-user)** - to test Microsoft Entra single sign-on with B.Simon.
    1. **[Assign the Microsoft Entra test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Microsoft Entra single sign-on.
1. **[Configure SAP Business ByDesign SSO](#configure-sap-business-bydesign-sso)** - to configure the Single Sign-On settings on application side.
    1. **[Create SAP Business ByDesign test user](#create-sap-business-bydesign-test-user)** - to have a counterpart of Britta Simon in SAP Business ByDesign that is linked to the Microsoft Entra representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

<a name='configure-azure-ad-sso'></a>

### Configure Microsoft Entra SSO

Follow these steps to enable Microsoft Entra SSO.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **SAP Business ByDesign** > **Single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, perform the following steps:

	a. In the **Sign on URL** text box, type a URL using the following pattern:
    `https://<servername>.sapbydesign.com`

    b. In the **Identifier (Entity ID)** text box, type a URL using the following pattern:
    `https://<servername>.sapbydesign.com`

	> [!NOTE]
	> These values are not real. Update these values with the actual Sign on URL and Identifier. Contact [SAP Business ByDesign Client support team](https://www.sap.com/products/cloud-analytics.support.html) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section.

5. SAP Business ByDesign application expects the SAML assertions in a specific format. Configure the following claims for this application. You can manage the values of these attributes from the **User Attributes** section on application integration page. On the **Set up Single Sign-On with SAML** page, click **Edit** button to open **User Attributes** dialog.

	![image1](common/edit-attribute.png)

6. Click on the **Edit** icon to edit the **Name identifier value**.

	![image2](media/sapbusinessbydesign-tutorial/mail-prefix1.png)

7. On the **Manage user claims** section, perform the following steps:

	![image3](media/sapbusinessbydesign-tutorial/mail-prefix2.png)

	a. Select **Transformation** as a **Source**.

	b. In the **Transformation** dropdown list, select **ExtractMailPrefix()**.

    > [!NOTE]
    > Per default ByD uses the NameID format **unspecified** for user mapping. ByD maps the NameID of SAML-assertions on the ByD User Alias. Additionally ByD support the name ID format **emailAddress**. In this case ByD maps the NameID of the SAM-assertion on the ByD user e-mail address of the ByD employee contact data. For more details, you may refer [this SAP blog](https://blogs.sap.com/2017/05/24/single-sign-on-sso-with-sap-business-bydesign/).

8. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Federation Metadata XML** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

9. On the **Set up SAP Business ByDesign** section, copy the appropriate URL(s) as per your requirement.

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

In this section, you'll enable B.Simon to use single sign-on by granting access to SAP Business ByDesign.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **SAP Business ByDesign**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.

1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure SAP Business ByDesign SSO

1. Sign on to your SAP Business ByDesign portal with administrator rights.

2. Navigate to **Application and User Management Common Task** and click the **Identity Provider** tab.

3. Click **New Identity Provider** and select the metadata XML file that you have downloaded. By importing the metadata, the system automatically uploads the required signature certificate and encryption certificate.

	![Configure Single Sign-On1](./media/sapbusinessbydesign-tutorial/tutorial_sapbusinessbydesign_54.png)

4. To include the **Assertion Consumer Service URL** into the SAML request, select **Include Assertion Consumer Service URL**.

5. Click **Activate Single Sign-On**.

6. Save your changes.

7. Click the **My System** tab.

    ![Configure Single Sign-On2](./media/sapbusinessbydesign-tutorial/tutorial_sapbusinessbydesign_52.png)

8. In the **Microsoft Entra ID Sign On URL** textbox, paste **Login URL** value, which you copied previously.

    ![Configure Single Sign-On3](./media/sapbusinessbydesign-tutorial/tutorial_sapbusinessbydesign_53.png)

9. Specify whether the employee can manually choose between logging on with user ID and password or SSO by selecting **Manual Identity Provider Selection**.

10. In the **SSO URL** section, specify the URL that should be used by the employee to signon to the system.
    In the URL Sent to Employee dropdown list, you can choose between the following options:

    **Non-SSO URL**

    The system sends only the normal system URL to the employee. The employee cannot signon using SSO, and must use password or certificate instead.

    **SSO URL**

    The system sends only the SSO URL to the employee. The employee can signon using SSO. Authentication request is redirected through the IdP.

    **Automatic Selection**

    If SSO is not active, the system sends the normal system URL to the employee. If SSO is active, the system checks whether the employee has a password. If a password is available, both SSO URL and Non-SSO URL are sent to the employee. However, if the employee has no password, only the SSO URL is sent to the employee.

11. Save your changes.

### Create SAP Business ByDesign test user

In this section, you create a user called Britta Simon in SAP Business ByDesign. Please work with [SAP Business ByDesign Client support team](https://www.sap.com/products/cloud-analytics.support.html) to add the users in the SAP Business ByDesign platform. 

> [!NOTE]
> Please make sure that NameID value should match with the username field in the SAP Business ByDesign platform.

## Test SSO 

In this section, you test your Microsoft Entra single sign-on configuration with following options. 

1. Click on **Test this application**, this will redirect to SAP Business ByDesign Sign-on URL where you can initiate the login flow. 

2. Go to SAP Business ByDesign Sign-on URL directly and initiate the login flow from there.

3. You can use Microsoft My Apps. When you click the SAP Business ByDesign tile in the My Apps, this will redirect to SAP Business ByDesign Sign-on URL. For more information about the My Apps, see [Introduction to the My Apps](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).

## Next steps

* Once you configure the SAP Business ByDesign you can enforce session controls, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session controls extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-any-app).
