---
title: 'Tutorial: Microsoft Entra SSO integration with MongoDB Atlas - SSO'
description: Learn how to configure single sign-on between Microsoft Entra ID and MongoDB Atlas - SSO.
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

# Tutorial: Microsoft Entra SSO integration with MongoDB Atlas - SSO

In this tutorial, you'll learn how to integrate MongoDB Atlas - SSO with Microsoft Entra ID. When you integrate MongoDB Atlas - SSO with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to MongoDB Atlas, the MongoDB community, MongoDB University, and MongoDB Support.
* Enable your users to be automatically signed in to MongoDB Atlas - SSO with their Microsoft Entra accounts.
* Assign MongoDB Atlas roles to users based on their Microsoft Entra group memberships.
* Manage your accounts in one central location: the Azure portal.

## Prerequisites

To get started, you need the following items:

* A Microsoft Entra subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* MongoDB Atlas - SSO single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Microsoft Entra SSO in a test environment.

* MongoDB Atlas - SSO supports **SP** and **IDP** initiated SSO.
* MongoDB Atlas - SSO supports **Just In Time** user provisioning.

## Add MongoDB Atlas - SSO from the gallery

To configure the integration of MongoDB Atlas - SSO into Microsoft Entra ID, you need to add MongoDB Atlas - SSO from the gallery to your list of managed SaaS apps.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the **Add from the gallery** section, type **MongoDB Atlas - SSO** in the search box.
1. Select **MongoDB Atlas - SSO** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

<a name='configure-and-test-azure-ad-sso-for-mongodb-atlas---sso'></a>

## Configure and test Microsoft Entra SSO for MongoDB Atlas - SSO

Configure and test Microsoft Entra SSO with MongoDB Atlas - SSO, by using a test user called **B.Simon**. For SSO to work, you need to establish a linked relationship between a Microsoft Entra user and the related user in MongoDB Atlas - SSO.

To configure and test Microsoft Entra SSO with MongoDB Atlas - SSO, perform the following steps:

1. [Configure Microsoft Entra SSO](#configure-azure-ad-sso) to enable your users to use this feature.
    1. [Create a Microsoft Entra test user and test group](#create-an-azure-ad-test-user-and-test-group) to test Microsoft Entra single sign-on with B.Simon.
    1. [Assign the Microsoft Entra test user or test group](#assign-the-azure-ad-test-user-or-test-group) to enable B.Simon to use Microsoft Entra single sign-on.
1. [Configure MongoDB Atlas SSO](#configure-mongodb-atlas-sso) to configure the single sign-on settings on the application side.
    1. [Create a MongoDB Atlas SSO test user](#create-a-mongodb-atlas-sso-test-user) to have a counterpart of B.Simon in MongoDB Atlas - SSO, linked to the Microsoft Entra representation of the user.
1. [Test SSO](#test-sso) to verify whether the configuration works.

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

Follow these steps to enable Microsoft Entra SSO.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **MongoDB Atlas - SSO** application integration page, find the **Manage** section. Select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up Single Sign-On with SAML** page, select the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Screenshot of Set up Single Sign-On with SAML page, with pencil icon highlighted](common/edit-urls.png)

1. In the **Basic SAML Configuration** section, if you want to configure the application in **IDP** initiated mode, enter the values for the following fields:

    a. In the **Identifier** text box, type a URL that uses the following pattern:
    `https://www.okta.com/saml2/service-provider/<Customer_Unique>`

    b. In the **Reply URL** text box, type a URL that uses the following pattern:
    `https://auth.mongodb.com/sso/saml2/<Customer_Unique>`

1. Select **Set additional URLs**, and perform the following step if you want to configure the application in **SP** initiated mode:

    In the **Sign-on URL** text box, type a URL that uses the following pattern:
    `https://cloud.mongodb.com/sso/<Customer_Unique>`

	> [!NOTE]
	> These values are not real. Update these values with the actual Identifier, Reply URL, and Sign-on URL. To get these values, contact the [MongoDB Atlas - SSO Client support team](https://support.mongodb.com/). You can also refer to the patterns shown in the **Basic SAML Configuration** section.

1. The MongoDB Atlas - SSO application expects the SAML assertions to be in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes.

	![Screenshot of default attributes](common/default-attributes.png)

1. In addition to the preceding attributes, the MongoDB Atlas - SSO application expects a few more attributes to be passed back in the SAML response. These attributes are also pre-populated, but you can review them per your requirements.
	
	| Name | Source attribute|
	| ---------------| --------- |
	| email | user.userprincipalname |
	| firstName | user.givenname |
	| lastName | user.surname |

1. If you would like to authorize users using MongoDB Atlas [role mappings](https://docs.atlas.mongodb.com/security/manage-role-mapping/), add the below group claim to send user's group information within SAML assertion.

    | Name | Source attribute|
	| ---------------| --------- |
	| memberOf | Group ID |
       
1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section, find **Federation Metadata XML**. Select **Download** to download the certificate and save it on your computer.

	![Screenshot of SAML Signing Certificate section, with Download link highlighted](common/metadataxml.png)

1. In the **Set up MongoDB Atlas - SSO** section, copy the appropriate URLs, based on your requirement.

	![Screenshot of Set up Mongo DB Cloud section, with URLs highlighted](common/copy-configuration-urls.png)

<a name='create-an-azure-ad-test-user-and-test-group'></a>

### Create a Microsoft Entra test user and test group

In this section, you create a test user called B.Simon.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [User Administrator](../roles/permissions-reference.md#user-administrator).
1. Browse to **Identity** > **Users** > **All users**.
1. Select **New user** > **Create new user**, at the top of the screen.
1. In the **User** properties, follow these steps:
   1. In the **Display name** field, enter `B.Simon`.  
   1. In the **User principal name** field, enter the username@companydomain.extension. For example, `B.Simon@contoso.com`.
   1. Select the **Show password** check box, and then write down the value that's displayed in the **Password** box.
   1. Select **Review + create**.
1. Select **Create**.

If you are using MongoDB Atlas role mappings feature in order to assign roles to users based on their Microsoft Entra groups, create a test group and B.Simon as a member:
1. Browse to **Identity** > **Groups**.
1. Select **New group** at the top of the screen. 
1. In the **Group** properties, follow these steps:
   1. Select 'Security' in **Group type** dropdown.  
   1. In the **Group name** field, enter 'Group 1'. 
   1. Select **Create**.
   
<a name='assign-the-azure-ad-test-user-or-test-group'></a>

### Assign the Microsoft Entra test user or test group

In this section, you'll enable B.Simon or Group 1 to use Azure single sign-on by granting access to MongoDB Atlas - SSO.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **MongoDB Atlas - SSO**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list or if you are using MongoDB Atla role mappings, select  **Group 1** from the Groups list; then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure MongoDB Atlas SSO

To configure single sign-on on the MongoDB Atlas side, you need the appropriate URLs copied. You also need to configure the Federation Application for your MongoDB Atlas Organization. Follow the instructions in the [MongoDB Atlas documentation](https://docs.atlas.mongodb.com/security/federated-auth-azure-ad/). If you have a problem, contact the [MongoDB support team](https://support.mongodb.com/).

### Configure MongoDB Atlas Role Mapping

To authorize users in MongoDB Atlas based on their Microsoft Entra group membership, you can map the Microsoft Entra group's Object-IDs to MongoDB Atlas Organization/Project roles with the help of MongoDB Atlas role mappings.  Follow the instructions in the [MongoDB Atlas documentation](https://docs.atlas.mongodb.com/security/manage-role-mapping/#add-role-mappings-in-your-organization-and-its-projects). If you have a problem, contact the [MongoDB support team](https://support.mongodb.com/).

### Create a MongoDB Atlas SSO test user

MongoDB Atlas supports just-in-time user provisioning, which is enabled by default. There is no additional action for you to take. If a user doesn't already exist in MongoDB Atlas, a new one is created after authentication.

## Test SSO 

In this section, you test your Microsoft Entra single sign-on configuration with following options. 

#### SP initiated:

* Click on **Test this application**, this will redirect to MongoDB Atlas Sign-on URL where you can initiate the login flow.  

* Go to MongoDB Atlas Sign on URL directly and initiate the login flow from there.

#### IDP initiated:

* Click on **Test this application**, and you should be automatically signed in to the MongoDB Atlas for which you set up the SSO. 

You can also use Microsoft My Apps to test the application in any mode. When you click the MongoDB Atlas - SSO tile in the My Apps, if configured in SP mode you would be redirected to the application sign-on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the MongoDB Atlas - SSO for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).

## Next steps

Once you configure MongoDB Atlas - SSO you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-any-app).
