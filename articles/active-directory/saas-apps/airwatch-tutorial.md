---
title: 'Tutorial: Microsoft Entra integration with AirWatch'
description: Learn how to configure single sign-on between Microsoft Entra ID and AirWatch.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 12/07/2022
ms.author: jeedes
---

# Tutorial: Integrate AirWatch with Microsoft Entra ID

In this tutorial, you'll learn how to integrate AirWatch with Microsoft Entra ID. When you integrate AirWatch with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to AirWatch.
* Enable your users to be automatically signed-in to AirWatch with their Microsoft Entra accounts.
* Manage your accounts in one central location.

## Prerequisites

To get started, you need the following items:
 
* A Microsoft Entra subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* AirWatch single sign-on (SSO)-enabled subscription.

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Scenario description

In this tutorial, you configure and test Microsoft Entra SSO in a test environment. 

* AirWatch supports **SP** initiated SSO.

## Add AirWatch from the gallery

To configure the integration of AirWatch into Microsoft Entra ID, you need to add AirWatch from the gallery to your list of managed SaaS apps.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the **Add from the gallery** section, type **AirWatch** in the search box.
1. Select **AirWatch** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

<a name='configure-and-test-azure-ad-sso-for-airwatch'></a>

## Configure and test Microsoft Entra SSO for AirWatch

Configure and test Microsoft Entra SSO with AirWatch using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between a Microsoft Entra user and the related user in AirWatch.

To configure and test Microsoft Entra SSO with AirWatch, perform the following steps:

1. **[Configure Microsoft Entra SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create a Microsoft Entra test user](#create-an-azure-ad-test-user)** - to test Microsoft Entra single sign-on with B.Simon.
    1. **[Assign the Microsoft Entra test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Microsoft Entra single sign-on.
1. **[Configure AirWatch SSO](#configure-airwatch-sso)** - to configure the single sign-on settings on application side.
    1. **[Create AirWatch test user](#create-airwatch-test-user)** - to have a counterpart of B.Simon in AirWatch that is linked to the Microsoft Entra representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

Follow these steps to enable Microsoft Entra SSO.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **AirWatch** application integration page, find the **Manage** section and select **Single sign-on**.
1. On the **Select a Single sign-on method** page, select **SAML**.
1. On the **Set up Single Sign-On with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** page, enter the values for the following fields:

   a. In the **Identifier (Entity ID)** text box, type the value as:
    `AirWatch`

   b. In the **Reply URL** text box, type a URL using one of the following patterns:

   | Reply URL|
   |-----------|
   | `https://<SUBDOMAIN>.awmdm.com/<COMPANY_CODE>` |
   | `https://<SUBDOMAIN>.airwatchportals.com/<COMPANY_CODE>` |
   |

   c. In the **Sign on URL** text box, type a URL using the following pattern:
    `https://<subdomain>.awmdm.com/AirWatch/Login?gid=companycode`

	> [!NOTE]
	> These values are not the real. Update these values with the actual Reply URL and Sign-on URL. Contact [AirWatch Client support team](https://www.vmware.com/in/support/acquisitions/airwatch.html) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section.

1. AirWatch application expects the SAML assertions in a specific format. Configure the following claims for this application. You can manage the values of these attributes from the **User Attributes** section on application integration page. On the **Set up Single Sign-On with SAML** page, click **Edit** button to open **User Attributes** dialog.

	![image](common/edit-attribute.png)

1. In the **User Claims** section on the **User Attributes** dialog, edit the claims by using **Edit icon** or add the claims by using **Add new claim** to configure SAML token attribute as shown in the image above and perform the following steps:

	| Name |  Source Attribute|
	|---------------|----------------|
	| UID | user.userprincipalname |
    | | |

	a. Click **Add new claim** to open the **Manage user claims** dialog.

	b. In the **Name** textbox, type the attribute name shown for that row.

	c. Leave the **Namespace** blank.

	d. Select Source as **Attribute**.

	e. From the **Source attribute** list, type the attribute value shown for that row.

	f. Click **Ok**

	g. Click **Save**.

1. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, find **Federation Metadata XML** and select **Download** to download the Metadata XML and save it on your computer.

   ![The Certificate download link](common/metadataxml.png)

1. On the **Set up AirWatch** section, copy the appropriate URL(s) based on your requirement.

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

In this section, you'll enable B.Simon to use single sign-on by granting access to AirWatch.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **AirWatch**.
1. In the app's overview page, select **Users and groups**.
1. Select **Add user/group**, then select **Users and groups** in the **Add Assignment** dialog.
   1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
   1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
   1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure AirWatch SSO

1. In a different web browser window, sign in to your AirWatch company site as an administrator.

1. In the left navigation pane, select **Groups & Settings**, and then select **All Settings**.
1. Next, go to **System > Enterprise Integration > Directory Services**.
1. Select the **User** tab, in the **Base DN** field, type your `domain name`, and then select **Save**.
1. Select the **Group** tab, in the **Base DN** field, type your `domain name`, and then select **Save**.
1. Select the **Server** tab and perform the following steps:
   1. As **Directory Type**, select **None**.
   1. Enable the **Use SAML For Authentication** option.
   1. Select the **Import Identity Provider Settings** and click **Upload** to upload the XML file that you downloaded in Step4 above.
1. In the **Request** section, perform the following steps:
   1. As **Request Binding Type**, select **POST**.
   1. Browse to **Identity** > **Applications** > **Enterprise applications** > **AirWatch**. 
   1. Under the **AirWatch Configuration** section, select **Configure AirWatch** to open **Configure sign-on** window
   1. Copy the **SAML Single Sign-On Service URL** from the **Quick Reference** section, and then paste it into the **Identity Provider Single Sign-On URL** textbox.
   1. As **NameID Format**, select **Email Address**.
   1. Select **Save**.
1. In the **Response** section, under **Response Binding Type**, select **Post**.
1. Select the **User** tab again.
1. Select **Show Advanced** to display the advanced user settings. 
1. In the **Attribute** section, perform the following steps:

   ![Attribute](./media/airwatch-tutorial/attributes.png "Attribute")

   1. In the **Object Identifier** textbox, type `http://schemas.microsoft.com/identity/claims/objectidentifier`.
   1. In the **Username** textbox, type `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress`.
   1. In the **Display Name** textbox, type `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname`.
   1. In the **First Name** textbox, type `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname`.
   1. In the **Last Name** textbox, type `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname`.
   1. In the **Email** textbox, type `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress`.
   1. Click **Save**.

### Create AirWatch test user

To enable Microsoft Entra users to sign in to AirWatch, they must be provisioned in to AirWatch. In the case of AirWatch, provisioning is a manual task.

**To configure user provisioning, perform the following steps:**

1. Sign in to your **AirWatch** company site as administrator.

2. In the navigation pane on the left side, click **Accounts**, and then click **Users**.

3. In the **Users** menu, click **List View**, and then click **Add > Add User**.

4. On the **Add / Edit User** dialog, perform the following steps:

   a. Type the **Username**, **Password**, **Confirm Password**, **First Name**, **Last Name**, **Email Address** of a valid Microsoft Entra account you want to provision into the related textboxes.

   b. Click **Save**.

> [!NOTE]
> You can use any other AirWatch user account creation tools or APIs provided by AirWatch to provision Microsoft Entra user accounts.

## Test SSO

In this section, you test your Microsoft Entra single sign-on configuration with following options. 

* Click on **Test this application**, this will redirect to AirWatch Sign-on URL where you can initiate the login flow. 

* Go to AirWatch Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the AirWatch tile in the My Apps, this will redirect to AirWatch Sign-on URL. For more information about the My Apps, see [Introduction to the My Apps](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).

## Next steps

Once you configure AirWatch you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-any-app).
