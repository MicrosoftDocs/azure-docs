---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with FortiGate SSL VPN | Microsoft Docs'
description: Learn the steps you need to perform to integrate FortiGate SSL VPN with Azure Active Directory (Azure AD).
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: 18a3d9d5-d81c-478c-be7e-ef38b574cb88
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: tutorial
ms.date: 08/11/2020
ms.author: jeedes

ms.collection: M365-identity-device-management
---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with FortiGate SSL VPN

In this tutorial, you'll learn how to integrate FortiGate SSL VPN with Azure Active Directory (Azure AD). When you integrate FortiGate SSL VPN with Azure AD, you can:

* Use Azure AD to control who can access FortiGate SSL VPN.
* Enable your users to be automatically signed in to FortiGate SSL VPN with their Azure AD accounts.
* Manage your accounts in one central location: the Azure portal.

To learn more about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md).

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* A FortiGate SSL VPN subscription with single sign-on (SSO) enabled.

## Tutorial description

In this tutorial, you'll configure and test Azure AD SSO in a test environment.

FortiGate SSL VPN supports SP-initiated SSO.

After you configure FortiGate SSL VPN, you can enforce session control, which protects exfiltration and infiltration of your organization's sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-any-app).

## Add FortiGate SSL VPN from the gallery

To configure the integration of FortiGate SSL VPN into Azure AD, you need to add FortiGate SSL VPN from the gallery to your list of managed SaaS apps:

1. Sign in to the [Azure portal](https://portal.azure.com) with a work or school account or with a personal Microsoft account.
1. In the left pane, select **Azure Active Directory**.
1. Go to **Enterprise applications** and then select **All Applications**.
1. To add an application, select **New application**.
1. In the **Add from the gallery** section, enter **FortiGate SSL VPN** in the search box.
1. Select **FortiGate SSL VPN** in the results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD SSO for FortiGate SSL VPN

You'll configure and test Azure AD SSO with FortiGate SSL VPN by using a test user named B.Simon. For SSO to work, you need to establish a link relationship between an Azure AD user and the corresponding user in FortiGate SSL VPN.

To configure and test Azure AD SSO with FortiGate SSL VPN, you'll complete these high-level steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** to enable the feature for your users.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** to test Azure AD single sign-on.
    1. **[Grant access to the test user](#grant-access-to-the-test-user)** to enable Azure AD single sign-on for that user.
1. **[Configure FortiGate SSL VPN SSO](#configure-fortigate-ssl-vpn-sso)** on the application side.
    1. **Create a FortiGate SSL VPN test user** as a counterpart to the Azure AD representation of the user.
1. **[Test SSO](#test-single-sign-on)** to verify that the configuration works.

### Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal:

1. In the [Azure portal](https://portal.azure.com/), on the **FortiGate SSL VPN** application integration page, in the **Manage** section, select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up Single Sign-On with SAML** page, select the pencil button for **Basic SAML Configuration** to edit the settings:

   ![Screenshot that shows the pencil button for editing the basic SAML configuration.](common/edit-urls.png)

1. On the **Set up Single Sign-On with SAML** page, enter the following values:

    a. In the **Sign on URL** box, enter a URL in the pattern
    `https://<FQDN>/remote/login`.

    b. In the **Identifier** box, enter a URL in the pattern
    `https://<FQDN>/remote/saml/metadata`.

    c. In the **Reply URL** box, enter a URL in the pattern
    `https://<FQDN>/remote/saml/login`.

    d. In the **Logout URL** box, enter a URL in the pattern
    `https://<FQDN>/remote/saml/logout`.

	> [!NOTE]
	> These values are just patterns. You need to use the actual **Sign on URL**, **Identifier**, **Reply URL**, and **Logout URL**. Contact the [FortiGate SSL VPN client support team](mailto:tac_amer@fortinet.com) to get the actual values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

1. The FortiGate SSL VPN application expects SAML assertions in a specific format, which requires you to add custom attribute mappings to the configuration. The following screenshot shows the list of default attributes.

	![Screenshot that shows the default attributes.](common/default-attributes.png)

1. The two additional claims required by FortiGate SSL VPN are shown in the following table. The names of these claims must match the names used in the **Perform FortiGate command-line configuration** section of this tutorial. 

   | Name |  Source attribute|
   | ------------ | --------- |
   | username | user.userprincipalname |
   | group | user.groups |
   
   To create these additional claims:
   
   1. Next to **User Attributes & Claims**, select **Edit**.
   1. Select **Add new claim**.
   1. For **Name**, enter **username**.
   1. For **Source attribute**, select **user.userprincipalname**.
   1. Select **Save**.
   1. Select **Add a group claim**.
   1. Select **All groups**.
   1. Seect the **Customize the name of the group claim** check box.
   1. For **Name**, enter **group**.
   1. Select **Save**.   

1. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section,  select the **Download** link next to **Certificate (Base64)** to download the certificate and save it on your computer:

	![Screenshot that shows the certificate download link.](common/certificatebase64.png)

1. In the **Set up FortiGate SSL VPN** section, copy the appropriate URL or URLs, based on your requirements:

	![Screenshot that shows the configuration URLs.](common/copy-configuration-urls.png)

#### Create an Azure AD test user

In this section, you'll create a test user named B.Simon in the Azure portal.

1. In the left pane of the Azure portal, select **Azure Active Directory**. Select **Users**, and then select **All users**.
1. Select **New user** at the top of the screen.
1. In the **User** properties, complete these steps:
   1. In the **Name** box, enter **B.Simon**.  
   1. In the **User name** box, enter \<username>@\<companydomain>.\<extension>. For example, `B.Simon@contoso.com`.
   1. Select **Show password**, and then write down the value that's displayed in the **Password** box.
   1. Select **Create**.

#### Grant access to the test user

In this section, you'll enable B.Simon to use Azure single sign-on by granting that user access to FortiGate SSL VPN.

1. In the Azure portal, select **Enterprise applications**, and then select **All applications**.
1. In the applications list, select **FortiGate SSL VPN**.
1. On the app's overview page, in the **Manage** section, select **Users and groups**:

   ![Screenshot that shows the Users and groups option.](common/users-groups-blade.png)

1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog box:

	![Screenshot that shows the Add user button.](common/add-assign-user.png)

1. In the **Users and groups** dialog box, select **B.Simon** in the **Users** list, and then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog box, select the appropriate role for the user from the list. Click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog box, select **Assign**.

#### Create a security group for the test user

In this section, you'll create a security group in Azure Active Directory for the test user. FortiGate will use this security group to grant the user network access via the VPN.

1. In the left pane of the Azure portal, select **Azure Active Directory**. Then select **Groups**.
1. Select **New group** at the top of the screen.
1. In the **New Group** properties, complete these steps:
   1. In the **Group type** list, select **Security**.
   1. In the **Group name** box, enter **FortiGateAccess**.
   1. In the **Group description** box, enter **Group for granting FortiGate VPN access**.
   1. For the **Azure AD roles can be assigned to the group (Preview)** settings, select **No**.
   1. In the **Membership type** box, select **Assigned**.
   1. Under **Members**, select **No members selected**.
   1. In the **Users and groups** dialog box, select **B.Simon** from the **Users** list, and then click the **Select** button at the bottom of the screen.
   1. Select **Create**.
1. After you're back in the **Groups** section in Azure Active Directory, find the **FortiGate Access** group and note the **Object Id**. You'll need it later.

### Configure FortiGate SSL VPN SSO

#### Upload the Base64 SAML Certificate to the FortiGate appliance

After you completed the SAML configuration of the FortiGate app in your tenant, you downloaded the Base64-encoded SAML certificate. You need to upload this certificate to the FortiGate appliance:

1. Sign in to the management portal of your FortiGate appliance.
1. In the left pane, select **System**.
1. Under **System**, select **Certificates**.
1. Select **Import** > **Remote Certificate**.
1. Browse to the certificate downloaded from the FortiGate app deployment in the Azure tenant, select it, and then select **OK**.

After the certificate is uploaded, take note of its name under **System** > **Certificates** > **Remote Certificate**. By default, it will be named REMOTE_Cert_*N*, where *N* is an integer value.

#### Complete FortiGate command-line configuration

The following steps require that you configure the Azure Logout URL. This URL contains a question mark character (?). You need to take specific steps to successfully submit this character. You can't complete these steps from the FortiGate CLI Console. Instead, establish an SSH session to the FortiGate appliance by using a tool like PuTTY. If your FortiGate appliance is an Azure virtual machine, you can complete the following steps from the serial console for Azure virtual machines.

To complete these steps, you'll need the values you recorded earlier:

- Entity ID
- Reply URL
- Logout URL
- Azure Login URL
- Azure AD Identifier
- Azure Logout URL
- Base64 SAML certificate name (REMOTE_Cert_*N*)

1. Establish an SSH session to your FortiGate appliance, and sign in with a FortiGate Administrator account.
1. Run these commands:

   ```console
    config user saml
    edit azure
    set entity-id <Entity ID>
    set single-sign-on-url <Reply URL>
    set single-logout-url <Logout URL>
    set idp-single-sign-on-url <Azure Login URL>
    set idp-entity-id <Azure AD Identifier>
    set idp-single-logout-url <Azure Logout URL>
    set idp-cert <Base64 SAML Certificate Name>
    set user-name username
    set group-name group
    end

   ```

   > [!NOTE]
   > The Azure Logout URL contains a `?` character. You must enter a special key sequence to correctly provide this URL to the FortiGate serial console. The URL is usually `https://login.microsoftonline.com/common/wsfederation?wa=wsignout1.0`.
   >
   > To enter the Azure Logout URL in the serial console, enter `set idp-single-logout-url https://login.microsoftonline.com/common/wsfederation`.
   > 
   > Then select CTRL+V and paste the rest of the URL to complete the line: `set idp-single-logout-url https://login.microsoftonline.com/common/wsfederation?wa=wsignout1.0`.

#### Configure FortiGate for group matching

In this section, you'll configure FortiGate to recognize the Object Id of the security group that includes the test user. This configuration will allow FortiGate to make access decisions based on the group membership.

To complete these steps, you'll need the Object Id of the FortiGateAccess security group that you created earlier in this tutorial.

1. Establish an SSH session to your FortiGate appliance, and sign in with a FortiGate Administrator account.
1. Run these commands:

   ```
    config user group
    edit FortiGateAccess
    set member azure
    config match
    edit 1
    set server-name azure
    set group-name <Object Id>
    next
    end
    next
    end
   ```

#### Create a FortiGate VPN Portals and Firewall Policy

In this section, you'll configure a FortiGate VPN Portals and Firewall Policy that grants access to the FortiGateAccess security group you created earlier in this tutorial.

Work with the [FortiGate support team](mailto:tac_amer@fortinet.com) to add the VPN Portals and Firewall Policy to the FortiGate VPN platform. You need to complete this step before you use single sign-on.

### Test single sign-on 

In this section, you'll test your Azure AD single sign-on configuration by using Access Panel.

When you select the FortiGate SSL VPN tile in Access Panel, you should be automatically signed in to the FortiGate SSL VPN for which you set up SSO. For more information about Access Panel, see [Introduction to Access Panel](../user-help/my-apps-portal-end-user-access.md).

Microsoft and FortiGate recommend that you use the Fortinet VPN client, FortiClient, for the best end-user experience.

## Additional resources

- [Tutorials on how to integrate SaaS apps with Azure Active Directory](./tutorial-list.md)

- [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)

- [What is Conditional Access in Azure Active Directory?](../conditional-access/overview.md)

- [Try FortiGate SSL VPN with Azure AD](https://aad.portal.azure.com/)

- [What is session control in Microsoft Cloud App Security?](/cloud-app-security/proxy-intro-aad)