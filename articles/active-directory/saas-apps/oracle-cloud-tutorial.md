---
title: 'Tutorial: Microsoft Entra SSO integration with Oracle Cloud Infrastructure Console'
description: Learn how to configure single sign-on between Microsoft Entra ID and Oracle Cloud Infrastructure Console.
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

# Tutorial: Microsoft Entra SSO integration with Oracle Cloud Infrastructure Console

In this tutorial, you'll learn how to integrate Oracle Cloud Infrastructure Console with Microsoft Entra ID. When you integrate Oracle Cloud Infrastructure Console with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to Oracle Cloud Infrastructure Console.
* Enable your users to be automatically signed-in to Oracle Cloud Infrastructure Console with their Microsoft Entra accounts.
* Manage your accounts in one central location.

## Prerequisites

To get started, you need the following items:

* A Microsoft Entra subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Oracle Cloud Infrastructure Console single sign-on (SSO) enabled subscription.

> [!NOTE]
> This integration is also available to use from Microsoft Entra US Government Cloud environment. You can find this application in the Microsoft Entra US Government Cloud Application Gallery and configure it in the same way as you do from public cloud.

## Scenario description

In this tutorial, you configure and test Microsoft Entra SSO in a test environment.

* Oracle Cloud Infrastructure Console supports **SP** initiated SSO.
* Oracle Cloud Infrastructure Console supports [**Automated** user provisioning and deprovisioning](oracle-cloud-infrastructure-console-provisioning-tutorial.md) (recommended).

## Add Oracle Cloud Infrastructure Console from the gallery

To configure the integration of Oracle Cloud Infrastructure Console into Microsoft Entra ID, you need to add Oracle Cloud Infrastructure Console from the gallery to your list of managed SaaS apps.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the **Add from the gallery** section, type **Oracle Cloud Infrastructure Console** in the search box.
1. Select **Oracle Cloud Infrastructure Console** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

<a name='configure-and-test-azure-ad-sso'></a>

## Configure and test Microsoft Entra SSO

Configure and test Microsoft Entra SSO with Oracle Cloud Infrastructure Console using a test user called **B. Simon**. For SSO to work, you need to establish a link relationship between a Microsoft Entra user and the related user in Oracle Cloud Infrastructure Console.

To configure and test Microsoft Entra SSO with Oracle Cloud Infrastructure Console, perform the following steps:

1. **[Configure Microsoft Entra SSO](#configure-azure-ad-sso)** to enable your users to use this feature.
   1. **[Create a Microsoft Entra test user](#create-an-azure-ad-test-user)** to test Microsoft Entra single sign-on with B. Simon.
   1. **[Assign the Microsoft Entra test user](#assign-the-azure-ad-test-user)** to enable B. Simon to use Microsoft Entra single sign-on.
1. **[Configure Oracle Cloud Infrastructure Console SSO](#configure-oracle-cloud-infrastructure-console-sso)** to configure the SSO settings on application side.
   1. **[Create Oracle Cloud Infrastructure Console test user](#create-oracle-cloud-infrastructure-console-test-user)** to have a counterpart of B. Simon in Oracle Cloud Infrastructure Console that is linked to the Microsoft Entra representation of user.
1. **[Test SSO](#test-sso)** to verify whether the configuration works.

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

Follow these steps to enable Microsoft Entra SSO.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Oracle Cloud Infrastructure Console** application integration page, find the **Manage** section and select **Single sign-on**.
1. On the **Select a Single sign-on method** page, select **SAML**.
1. On the **Set up Single Sign-On with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, perform the following steps:

   > [!NOTE]
   > You will get the Service Provider metadata file from the **Configure Oracle Cloud Infrastructure Console Single Sign-On** section of the tutorial.
	
   1. Click **Upload metadata file**.

   1. Click on **folder logo** to select the metadata file and click **Upload**.

   1. Once the metadata file is successfully uploaded, the **Identifier** and **Reply URL** values get auto populated in **Basic SAML Configuration** section textbox.
	
      > [!NOTE]
      > If the **Identifier** and **Reply URL** values do not get auto populated, then fill in the values manually according to your requirement.

      In the **Sign-on URL** text box, type a URL using the following pattern:
      `https://cloud.oracle.com/?region=<REGIONNAME>`

      > [!NOTE]
      > The value is not real. Update the value with the actual Sign-On URL. Contact [Oracle Cloud Infrastructure Console Client support team](https://www.oracle.com/support/advanced-customer-services/cloud/) to get the value. You can also refer to the patterns shown in the **Basic SAML Configuration** section.

1. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, find **Federation Metadata XML** and select **Download** to download the certificate and save it on your computer.

   ![The Certificate download link](common/metadataxml.png)

1. Oracle Cloud Infrastructure Console application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes. Click **Edit** icon to open User Attributes dialog.

   ![image1](common/edit-attribute.png)

1. In addition to above, Oracle Cloud Infrastructure Console application expects few more attributes to be passed back in SAML response. In the **User Attributes & Claims** section on the **Group Claims (Preview)** dialog, perform the following steps:

   1. Click the **pen** next to **Name identifier value**.

   1. Select **Persistent** as **Choose name identifier format**.
 
   1. Click **Save**.

      ![Screenshot showing image2](./media/oracle-cloud-tutorial/attributes.png)
	
      ![Screenshot showing image3](./media/oracle-cloud-tutorial/claims.png)

   1. Click the **pen** next to **Groups returned in claim**.

   1. Select **Security groups** from the radio list.

   1. Select **Source Attribute** of **Group ID**.

   1. Check **Customize the name of the group claim**.

   1. In the **Name** text box, type **groupName**.

   1. In the **Namespace (optional)** text box, type `https://auth.oraclecloud.com/saml/claims`.

   1. Click **Save**.

      ![Screenshot showing image4](./media/oracle-cloud-tutorial/groups.png)

1. On the **Set up Oracle Cloud Infrastructure Console** section, copy the appropriate URL(s) based on your requirement.

   ![Copy configuration URLs](common/copy-configuration-urls.png)

<a name='create-an-azure-ad-test-user'></a>

### Create a Microsoft Entra test user

In this section, you'll create a test user called B. Simon.

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

In this section, you'll enable B. Simon to use Azure single sign-on by granting access to Oracle Cloud Infrastructure Console.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Oracle Cloud Infrastructure Console**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B. Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Oracle Cloud Infrastructure Console SSO

1. In a different web browser window, sign in to Oracle Cloud Infrastructure Console as an Administrator.

1. Click on the left side of the menu and click on **Identity** then navigate to **Federation**.

   ![Screenshot showing Configuration1](./media/oracle-cloud-tutorial/menu.png)

1. Save the **Service Provider metadata file** by clicking the **Download this document** link and upload it into the **Basic SAML Configuration** section of Azure portal and then click on **Add Identity Provider**.

   ![Screenshot showing Configuration2](./media/oracle-cloud-tutorial/metadata.png)

1. On the **Add Identity Provider** pop-up, perform the following steps:

   ![Screenshot showing Configuration3](./media/oracle-cloud-tutorial/file.png)

   1. In the **NAME** text box, enter your name.

   1. In the **DESCRIPTION** text box, enter your description.

   1. Select **MICROSOFT ACTIVE DIRECTORY FEDERATION SERVICE (ADFS) OR SAML 2.0 COMPLIANT IDENTITY PROVIDER** as **TYPE**.

   1. Click **Browse** to upload the Federation Metadata XML, which you have downloaded previously.

   1. Click **Continue** and on the **Edit Identity Provider** section perform the following steps:

      ![Screenshot showing Configuration4](./media/oracle-cloud-tutorial/mapping.png)

   1. The **IDENTITY PROVIDER GROUP** should be selected as Microsoft Entra group Object ID. The GROUP ID should be the GUID of the group from Microsoft Entra ID. The group needs to be mapped with corresponding group in **OCI GROUP** field.

   1. You can map multiple groups as per your setup in Azure portal and your organization need. Click on **+ Add mapping** to add as many groups as you need.

   1. Click **Submit**.
   
### Create Oracle Cloud Infrastructure Console test user

 Oracle Cloud Infrastructure Console supports just-in-time provisioning, which is by default. There is no action item for you in this section. A new user does not get created during an attempt to access and also no need to create the user.

## Test SSO

When you select the Oracle Cloud Infrastructure Console tile in the My Apps, you will be redirected to the Oracle Cloud Infrastructure Console sign-in page. Select the **IDENTITY PROVIDER** from the drop-down menu and click **Continue** as shown below to sign in. For more information about the My Apps, see [Introduction to the My Apps](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).

![Screenshot showing Configuration](./media/oracle-cloud-tutorial/tenant.png)

## Next steps

Once you configure the Oracle Cloud Infrastructure Console you can enforce session controls, which protect exfiltration and infiltration of your organization’s sensitive data in real time. Session controls extend from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-aad).
