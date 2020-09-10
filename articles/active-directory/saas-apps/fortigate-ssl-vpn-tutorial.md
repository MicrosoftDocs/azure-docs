---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with FortiGate SSL VPN | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and FortiGate SSL VPN.
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

* Control in Azure AD who has access to FortiGate SSL VPN.
* Enable your users to be automatically signed-in to FortiGate SSL VPN with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

To learn more about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/manage-apps/what-is-single-sign-on).

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* FortiGate SSL VPN single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* FortiGate SSL VPN supports **SP** initiated SSO
* Once you configure FortiGate SSL VPN you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](https://docs.microsoft.com/cloud-app-security/proxy-deployment-any-app).

## Adding FortiGate SSL VPN from the gallery

To configure the integration of FortiGate SSL VPN into Azure AD, you need to add FortiGate SSL VPN from the gallery to your list of managed SaaS apps.

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **FortiGate SSL VPN** in the search box.
1. Select **FortiGate SSL VPN** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD SSO for FortiGate SSL VPN

Configure and test Azure AD SSO with FortiGate SSL VPN using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in FortiGate SSL VPN.

To configure and test Azure AD SSO with FortiGate SSL VPN, complete the following building blocks:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure FortiGate SSL VPN SSO](#configure-fortigate-ssl-vpn-sso)** - to configure the single sign-on settings on application side.
    1. **Create FortiGate SSL VPN test user** - to have a counterpart of B.Simon in FortiGate SSL VPN that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-single-sign-on)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the [Azure portal](https://portal.azure.com/), on the **FortiGate SSL VPN** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the edit/pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Set up single sign-on with SAML** page, enter the values for the following fields:

    a. In the **Sign on URL** text box, type a URL using the following pattern:
    `https://<FQDN>/remote/login`

    b. In the **Identifier** text box, type a URL using the following pattern:
    `https://<FQDN>/remote/saml/metadata`

    c. In the **Reply URL** text box, type a URL using the following pattern:
    `https://><FQDN/remote/saml/login`

    d. In the **Logout URL** text box, type a URL using the following pattern:
    `https://<FQDN>/remote/saml/logout`

	> [!NOTE]
	> These values are not real. Update these values with the actual Sign on URL, Identifier, Reply URL and Logout URL. Contact [FortiGate SSL VPN Client support team](mailto:tac_amer@fortinet.com) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

1. FortiGate SSL VPN application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes.

	![image](common/default-attributes.png)

1. In addition to above, FortiGate SSL VPN application expects few more attributes to be passed back in SAML response which are shown below. These attributes are also pre populated but you can review them as per your requirements.
	
	| Name |  Source Attribute|
	| ------------ | --------- |
	| username | user.userprincipalname |
	| group | user.groups |

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Certificate (Base64)** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

1. On the **Set up FortiGate SSL VPN** section, copy the appropriate URL(s) based on your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to FortiGate SSL VPN.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **FortiGate SSL VPN**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.

   ![The "Users and groups" link](common/users-groups-blade.png)

1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.

	![The Add User link](common/add-assign-user.png)

1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog, click the **Assign** button.

### Create a security group for the test user

In this section, you'll create a security group in Azure Active Directory for the test user. This security group will be used by FortiGate to grant the user network access via the VPN.

1. From the left pane in the Azure portal, select **Azure Active Directory**, and then select **Groups**.
1. Select **New group** at the top of the screen.
1. In the **New Group** properties, follow these steps:
   1. In the **Group type** field, select **Security**.
   1. In the **Name** field, enter `FortiGateAccess`.
   1. In the **Group description** field, enter `Group for granting FortiGate VPN access`.
   1. For the **Azure AD roles can be assigned to the group (Preview)** settings, select **No**.
   1. In the **Membership type** field, select **Assigned**.
   1. Under **Members**, select **No members selected**.
   1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
   1. Select **Create**.
1. Once you've been returned to the **Groups** blade in Azure Active Directory, locate the **FortiGate Access** group and take note of the **Object Id** for later use.

## Configure FortiGate SSL VPN SSO

### Upload the Base64 SAML Certificate to the FortiGate appliance

After completing the SAML configuration of the FortiGate app in your tenant, you downloaded the Base64 encoded SAML certificate. This must be uploaded to the FortiGate appliance:

1. Sign in to the management portal of your FortiGate appliance.
1. In the left-hand menu, click **System**.
1. Under **System**, click **Certificates**.
1. Click **Import** -> **Remote Certificate**.
1. Browse to the certificate downloaded from the FortiGate App deployment in the Azure tenant, select it, and click **OK**

After the certificate has uploaded, take note of its name under **System** > **Certificates** > **Remote Certificate**. By default, it will be named REMOTE_Cert_**N** where **N** is an integer value.

### Perform FortiGate command-line configuration

The following steps require the Azure logout URL to be configured. This URL contains a question mark (?). Special steps are required to submit this character successfully. The steps can't be performed from the FortiGate CLI Console. Instead, establish an SSH session to the FortiGate applicance using a tool like PuTTY. If your FortiGate appliance is an Azure virtual machine, you can perform the following steps from the Azure virtual machine serial console.

To perform these steps, you will need the values recorded earlier:

- Entity ID
- Reply URL
- Logout URL
- Azure Login URL
- Azure AD Identifier
- Azure Logout URL
- Base64 SAML Certificate Name (REMOTE_Cert_N)

1. Establish an SSH session to your FortiGate applicance and sign in with a FortiGate Administrator account.
1. Perform the following commands:

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
   > The **Azure Logout URL** contains a `?` character. You must enter a special key sequence to correctly provide the URL to the FortiGate serial console. The URL usually is `https://login.microsoftonline.com/common/wsfederation?wa=wsignout1.0`.
   >
   > To enter the Azure Logout URL in the serial console, enter `set idp-single-logout-url https://login.microsoftonline.com/common/wsfederation`.
   > 
   > Then, select CTRL+V and paste the rest of the URL to complete the line: `set idp-single-logout-url https://login.microsoftonline.com/common/wsfederation?wa=wsignout1.0`.

### Configure FortiGate for Group Matching

In this section, you will configure FortiGate to recognize the Object Id of the Security Group in which the test user resides. This will allow FortiGate to make access decisions based on this group membership.

To perform these steps you will need the Object Id of the **FortiGateAccess** security group created earlier

1. Establish an SSH session to your FortiGate Applicance and sign-in with a FortiGate Administrator account.
1. Perform the following commands:

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

### Create FortiGate VPN Portals and Firewall Policy

In this section, you configure FortiGate VPN Portals and Firewall Policy that grant access to the security group, **FortiGateAccess** created above.

Work with the [FortiGate support team](mailto:tac_amer@fortinet.com) to add the VPN Portals and Firewall Policy to the FortiGate VPN platform. These steps must be complete before you use single sign-on.

## Test Single Sign-On 

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the FortiGate SSL VPN tile in the Access Panel, you should be automatically signed in to the FortiGate SSL VPN for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

Microsoft and FortiGate recommend that you use the Fortinet VPN client, FortiClient for the best end user experience.

## Additional resources

- [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is conditional access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

- [Try FortiGate SSL VPN with Azure AD](https://aad.portal.azure.com/)

- [What is session control in Microsoft Cloud App Security?](https://docs.microsoft.com/cloud-app-security/proxy-intro-aad)
