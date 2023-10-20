---
title: 'Tutorial: Microsoft Entra single sign-on (SSO) integration with SuccessFactors'
description: Learn how to configure single sign-on between Microsoft Entra ID and SuccessFactors.
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

# Tutorial: Microsoft Entra single sign-on (SSO) integration with SuccessFactors

In this tutorial, you'll learn how to integrate SuccessFactors with Microsoft Entra ID. When you integrate SuccessFactors with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to SuccessFactors.
* Enable your users to be automatically signed-in to SuccessFactors with their Microsoft Entra accounts.
* Manage your accounts in one central location.


## Prerequisites

To get started, you need the following items:

* A Microsoft Entra subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* SuccessFactors single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Microsoft Entra SSO in a test environment.

* SuccessFactors supports **SP** initiated SSO.

## Adding SuccessFactors from the gallery

To configure the integration of SuccessFactors into Microsoft Entra ID, you need to add SuccessFactors from the gallery to your list of managed SaaS apps.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the **Add from the gallery** section, type **SuccessFactors** in the search box.
1. Select **SuccessFactors** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)


<a name='configure-and-test-azure-ad-sso-for-successfactors'></a>

## Configure and test Microsoft Entra SSO for SuccessFactors

Configure and test Microsoft Entra SSO with SuccessFactors using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between a Microsoft Entra user and the related user in SuccessFactors.

To configure and test Microsoft Entra SSO with SuccessFactors, perform the following steps:

1. **[Configure Microsoft Entra SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
	1. **[Create a Microsoft Entra test user](#create-an-azure-ad-test-user)** - to test Microsoft Entra single sign-on with B.Simon.
	1. **[Assign the Microsoft Entra test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Microsoft Entra single sign-on.
2. **[Configure SuccessFactors SSO](#configure-successfactors-sso)** - to configure the Single Sign-On settings on application side.
	1. **[Create SuccessFactors test user](#create-successfactors-test-user)** - to have a counterpart of B.Simon in SuccessFactors that is linked to the Microsoft Entra representation of user.
3. **[Test SSO](#test-sso)** - to verify whether the configuration works.

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

Follow these steps to enable Microsoft Entra SSO.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **SuccessFactors** application integration page, find the **Manage** section and select **Single sign-on**.
1. On the **Select a Single sign-on method** page, select **SAML**.
1. On the **Set up Single Sign-On with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, perform the following steps:

    a. In the **Sign-on URL** textbox, type a URL using one of the following patterns:

    - `https://<companyname>.successfactors.com/<companyname>`
    - `https://<companyname>.sapsf.com/<companyname>`
    - `https://<companyname>.successfactors.eu/<companyname>`
    - `https://<companyname>.sapsf.eu`

    b. In the **Identifier** textbox, type a URL using one of the following patterns:

    - `https://www.successfactors.com/<companyname>`
    - `https://www.successfactors.com`
    - `https://<companyname>.successfactors.eu`
    - `https://www.successfactors.eu/<companyname>`
    - `https://<companyname>.sapsf.com`
    - `https://hcm4preview.sapsf.com/<companyname>`
    - `https://<companyname>.sapsf.eu`
    - `https://www.successfactors.cn`
    - `https://www.successfactors.cn/<companyname>`

	c. In the **Reply URL** textbox, type a URL using one of the following patterns:

    - `https://<companyname>.successfactors.com/<companyname>`
    - `https://<companyname>.successfactors.com`
    - `https://<companyname>.sapsf.com/<companyname>`
    - `https://<companyname>.sapsf.com`
    - `https://<companyname>.successfactors.eu/<companyname>`
    - `https://<companyname>.successfactors.eu`
    - `https://<companyname>.sapsf.eu`
    - `https://<companyname>.sapsf.eu/<companyname>`
    - `https://<companyname>.sapsf.cn`
    - `https://<companyname>.sapsf.cn/<companyname>`

	> [!NOTE]
	> These values are not real. Update these values with the actual Sign-on URL, Identifier and Reply URL. Contact [SuccessFactors Client support team](https://www.sap.com/services-support.html) to get these values.

4. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section,  find **Certificate (Base64)** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

1. On the **Set up SuccessFactors** section, copy the appropriate URL(s) based on your requirement.

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

In this section, you'll enable B.Simon to use single sign-on by granting access to SuccessFactors.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **SuccessFactors**.
1. In the app's overview page, select **Users and groups**.
1. Select **Add user/group**, then select **Users and groups** in the **Add Assignment** dialog.
   1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
   1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
   1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure SuccessFactors SSO

1. In a different web browser window, log in to your **SuccessFactors admin portal** as an administrator.

2. Visit **Application Security** and native to **Single Sign On Feature**.

3. Place any value in the **Reset Token** and click **Save Token** to enable SAML SSO.

    ![Screenshot shows Application Security tab with Single Sign On Features called out where you can enter a token.][11]

    > [!NOTE]
    > This value is used as the on/off switch. If any value is saved, the SAML SSO is ON. If a blank value is saved the SAML SSO is OFF.

4. Native to below screenshot and perform the following actions:

    ![Screenshot shows the For SAML-based S S O pane where you can where you can enter the values described.][12]
  
    a. Select the **SAML v2 SSO** Radio Button
  
    b. Set the **SAML Asserting Party Name**(for example, SAML issuer + company name).

    c. In the **Issuer URL** textbox, paste the **Microsoft Entra Identifier** value which you copied previously.

    d. Select **Assertion** as **Require Mandatory Signature**.

    e. Select **Enabled** as **Enable SAML Flag**.

    f. Select **No** as **Login Request Signature(SF Generated/SP/RP)**.

    g. Select **Browser/Post Profile** as **SAML Profile**.

    h. Select **No** as **Enforce Certificate Valid Period**.

    i. Copy the content of the downloaded certificate file from Azure portal, and then paste it into the **SAML Verifying Certificate** textbox.

    > [!NOTE] 
    > The certificate content must have begin certificate and end certificate tags.

5. Navigate to SAML V2, and then perform the following steps:

    ![Screenshot shows the SAML v2 S P initiated logout pane where you can where you can enter the values described.][13]

    a. Select **Yes** as **Support SP-initiated Global Logout**.

    b. In the **Global Logout Service URL (LogoutRequest destination)** textbox, paste the **Sign-Out URL** value which you have copied form the Azure portal.

    c. Select **No** as **Require sp must encrypt all NameID element**.

    d. Select **unspecified** as **NameID Format**.

    e. Select **Yes** as **Enable sp initiated login (AuthnRequest)**.

    f. In the **Send request as Company-Wide issuer** textbox, paste **Login URL** value which you copied previously.

6. Perform these steps if you want to make the login usernames Case Insensitive.

	![Configure Single Sign-On][29]

	a. Visit **Company Settings**(near the bottom).

	b. Select checkbox near **Enable Non-Case-Sensitive Username**.

	c. Click **Save**.

	> [!NOTE]
    > If you try to enable this, the system checks if it creates a duplicate SAML login name. For example if the customer has usernames User1 and user1. Taking away case sensitivity makes these duplicates. The system gives you an error message and does not enable the feature. The customer needs to change one of the usernames so it’s spelled different.

### Create SuccessFactors test user

To enable Microsoft Entra users to sign in to SuccessFactors, they must be provisioned into SuccessFactors. In the case of SuccessFactors, provisioning is a manual task.

To get users created in SuccessFactors, you need to contact the [SuccessFactors support team](https://www.sap.com/services-support.html).

## Test SSO 

In this section, you test your Microsoft Entra single sign-on configuration with following options. 

* Click on **Test this application**, this will redirect to SuccessFactors Sign-on URL where you can initiate the login flow. 

* Go to SuccessFactors Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the SuccessFactors tile in the My Apps, this will redirect to SuccessFactors Sign-on URL. For more information about the My Apps, see [Introduction to the My Apps](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).

## Next steps

Once you configure the SuccessFactors you can enforce session controls, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session controls extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-aad).

<!--Image references-->

[11]: ./media/successfactors-tutorial/tutorial_successfactors_07.png
[12]: ./media/successfactors-tutorial/tutorial_successfactors_08.png
[13]: ./media/successfactors-tutorial/tutorial_successfactors_09.png
[29]: ./media/successfactors-tutorial/tutorial_successfactors_10.png
