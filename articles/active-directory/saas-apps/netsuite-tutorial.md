---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with NetSuite | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and NetSuite.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: dafa0864-aef2-4f5e-9eac-770504688ef4
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: tutorial
ms.date: 04/28/2020
ms.author: jeedes

ms.collection: M365-identity-device-management
---

# Tutorial: Integrate Azure AD single sign-on (SSO) with NetSuite

In this tutorial, you'll learn how to integrate NetSuite with Azure Active Directory (Azure AD). When you integrate NetSuite with Azure AD, you can:

* Control in Azure AD who has access to NetSuite.
* Enable your users to be automatically signed in to NetSuite with their Azure AD accounts.
* Manage your accounts in one central location, the Azure portal.

To learn more about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* A NetSuite single sign-on (SSO)-enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment. 

NetSuite supports:

* IDP-initiated SSO.
* JIT (just-in-time) user provisioning.
* [Automated user provisioning](NetSuite-provisioning-tutorial.md).
* Once you configure the NetSuite you can enforce session controls, which protect exfiltration and infiltration of your organization’s sensitive data in real-time. Session controls extend from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](https://docs.microsoft.com/cloud-app-security/proxy-deployment-aad)

> [!NOTE]
> Because the identifier of this application is a fixed string value, only one instance can be configured in one tenant.

## Add NetSuite from the gallery

To configure the integration of NetSuite into Azure AD, add NetSuite from the gallery to your list of managed SaaS apps by doing the following:

1. Sign in to the [Azure portal](https://portal.azure.com) with either a work or school account, or a personal Microsoft account.
1. In the left pane, select the **Azure Active Directory** service.
1. Go to **Enterprise Applications**, and then select **All Applications**.
1. To add a new application, select **New application**.
1. In the **Add from the gallery** section, type **NetSuite** in the search box.
1. In the results pane, select **NetSuite**, and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD single sign-on for NetSuite

Configure and test Azure AD SSO with NetSuite by using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in NetSuite.

To configure and test Azure AD SSO with NetSuite, complete the following building blocks:

1. [Configure Azure AD SSO](#configure-azure-ad-sso) to enable your users to use this feature.
    * [Create an Azure AD test user](#create-an-azure-ad-test-user) to test Azure AD single sign-on with user B.Simon.  
    * [Assign the Azure AD test user](#assign-the-azure-ad-test-user) to enable user B.Simon to use Azure AD single sign-on.
1. [Configure NetSuite SSO](#configure-netsuite-sso) to configure the single sign-on settings on the application side.
    * [Create the NetSuite test user](#create-the-netsuite-test-user) to have a counterpart of user B.Simon in NetSuite that's linked to the Azure AD representation of the user.
1. [Test SSO](#test-sso) to verify that the configuration works.

## Configure Azure AD SSO

To enable Azure AD SSO in the Azure portal, do the following:

1. In the [Azure portal](https://portal.azure.com/), on the **NetSuite** application integration page, look for the **Manage** section, and then select **Single sign-on**.
1. In the **Select a single sign-on method** pane, select **SAML**.
1. In the **Set up Single Sign-On with SAML** pane, select the **Edit** ("pencil") icon next to **Basic SAML Configuration**.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. In the **Basic SAML Configuration** section, in the **Reply URL** text box, type a URL in one of the following formats:

    ||
    |-|
    | `https://<Instance ID>.NetSuite.com/saml2/acs`|
    | `https://<Instance ID>.na1.NetSuite.com/saml2/acs`|
    | `https://<Instance ID>.na2.NetSuite.com/saml2/acs`|
    | `https://<Instance ID>.sandbox.NetSuite.com/saml2/acs`|
    | `https://<Instance ID>.na1.sandbox.NetSuite.com/saml2/acs`|
    | `https://<Instance ID>.na2.sandbox.NetSuite.com/saml2/acs`|

    * You will get the **<`Instance ID`>** value in the Netsuite configuration section which is explained later in the tutorial at step 8 under Netsuite Configuration. You will find the exact domain (such as system.na0.netsuite.com in this case).

        ![Configure single sign-on](./media/NetSuite-tutorial/domain-value.png)

        > [!NOTE]
        > The values in the preceding URLs are not real. Update them with the actual Reply URL. To get the value, contact the [NetSuite Client support team](http://www.netsuite.com/portal/services/support-services/suitesupport.shtml). You can also refer to the formats shown in the **Basic SAML Configuration** section in the Azure portal.

1. NetSuite application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes.

	![image](common/default-attributes.png)

1. In addition to above, NetSuite application expects few more attributes to be passed back in SAML response which are shown below. These attributes are also pre populated but you can review them as per your requirements.

	| Name | Source attribute |
	| ---------------| --------------- |
	| account  | `account id` |

	> [!NOTE]
	> The value of the account attribute is not real. You'll update this value, as explained later in this tutorial.

1. On the Set up single sign-on with SAML page, in the SAML Signing Certificate section, find Federation Metadata XML and select Download to download the certificate and save it on your computer.

	![The certificate Download link](common/metadataxml.png)

1. In the **Set up NetSuite** section, copy the appropriate URL or URLs, depending on your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

### Create an Azure AD test user

In this section, you create a test user in the Azure portal called B.Simon.

1. In the left pane of the Azure portal, select **Azure Active Directory** > **Users** > **All users**.

1. Select **New user** at the top of the screen.

1. In the **User** properties pane, follow these steps:

   a. In the **Name** box, enter **B.Simon**.  
   b. In the **User name** box, enter the username@companydomain.extension (for example, B.Simon@contoso.com).  
   c. Select the **Show password** check box, and then write down the value that's displayed in the **Password** box.  
   d. Select **Create**.

### Assign the Azure AD test user

In this section, you enable user B.Simon to use Azure single sign-on by granting access to NetSuite.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **NetSuite**.
1. In the overview pane, look for the **Manage** section, and then select the **Users and groups** link.

   ![The "Users and groups" link](common/users-groups-blade.png)

1. Select **Add user** and then, in the **Add Assignment** pane, select **Users and groups**.

	![The "Add user" button](common/add-assign-user.png)

1. In the **Users and groups** pane, in the **Users** drop-down list, select **B.Simon**, and then select the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, do the following:

   a. In the **Select Role** pane, in the drop-down list, select the appropriate role for the user.  
   b. At the bottom of the screen, select the **Select** button.
1. In the **Add Assignment** pane, select the **Assign** button.

## Configure NetSuite SSO

1. Open a new tab in your browser, and sign in to your NetSuite company site as an administrator.

2. In the top navigation bar, select **Setup**, and then select **Company** > **Enable Features**.

    ![Configure single sign-on](./media/NetSuite-tutorial/ns-setupsaml.png)

3. In the toolbar at the middle of the page, select **SuiteCloud**.

    ![Configure single sign-on](./media/NetSuite-tutorial/ns-suitecloud.png)

4. Under **Manage Authentication**, select the **SAML Single Sign-on** check box to enable the SAML single sign-on option in NetSuite.

    ![Configure single sign-on](./media/NetSuite-tutorial/ns-ticksaml.png)

5. In the top navigation bar, select **Setup**.

    ![Configure single sign-on](./media/NetSuite-tutorial/ns-setup.png)

6. In the **Setup Tasks** list, select **Integration**.

	![Configure single sign-on](./media/NetSuite-tutorial/ns-integration.png)

7. Under **Manage Authentication**, select **SAML Single Sign-on**.

    ![Configure single sign-on](./media/NetSuite-tutorial/ns-saml.png)

8. In the **SAML Setup** pane, under **NetSuite Configuration**, do the following:

    ![Configure single sign-on](./media/NetSuite-tutorial/ns-saml-setup.png)
  
    a. Select the **Primary Authentication Method** check box.

    b. Under **SAMLV2 Identity Provider Metadata**, select **Upload IDP Metadata File**, and then select **Browse** to upload the metadata file that you downloaded from the Azure portal.

    c. Select **Submit**.

9. In the NetSuite top navigation bar, select **Setup**, and then select **Company** > **Company Information**.

	![Configure single sign-on](./media/NetSuite-tutorial/ns-com.png)

	![Configure single sign-on](./media/NetSuite-tutorial/ns-account-id.png)

    b. In the **Company Information** pane, in the right column, copy the **Account ID** value.

    c. Paste the **Account ID** that you copied from the NetSuite account into the **Attribute Value** box in Azure AD.

10. Before users can perform single sign-on into NetSuite, they must first be assigned the appropriate permissions in NetSuite. To assign these permissions, do the following:

    a. In the top navigation bar, select **Setup**.

    ![Configure single sign-on](./media/NetSuite-tutorial/ns-setup.png)

    b. In the left pane, select **Users/Roles**, then select **Manage Roles**.

    ![Configure single sign-on](./media/NetSuite-tutorial/ns-manage-roles.png)

    c. Select **New Role**.

    d. Enter a **Name** for the new role.

    ![Configure single sign-on](./media/NetSuite-tutorial/ns-new-role.png)

    e. Select **Save**.

    f. In the top navigation bar, select **Permissions**. Then select **Setup**.

    ![Configure single sign-on](./media/NetSuite-tutorial/ns-sso.png)

    g. Select **SAML Single Sign-on**, and then select **Add**.

    h. Select **Save**.

    i. In the top navigation bar, select **Setup**, and then select **Setup Manager**.

    ![Configure single sign-on](./media/NetSuite-tutorial/ns-setup.png)

    j. In the left pane, select **Users/Roles**, and then select **Manage Users**.

    ![Configure single sign-on](./media/NetSuite-tutorial/ns-manage-users.png)

    k. Select a test user, select **Edit**, and then select the **Access** tab.

    ![Configure single sign-on](./media/NetSuite-tutorial/ns-edit-user.png)

    l. In the **Roles** pane, assign the appropriate role that you have created.

    ![Configure single sign-on](./media/NetSuite-tutorial/ns-add-role.png)

    m. Select **Save**.

### Create the NetSuite test user

In this section, a user called B.Simon is created in NetSuite. NetSuite supports just-in-time user provisioning, which is enabled by default. There's no action item for you in this section. If a user doesn't already exist in NetSuite, a new one is created after authentication.

## Test SSO

In this section, you test your Azure AD single sign-on configuration by using the Access Panel.

When you select the NetSuite tile in the Access Panel, you should be automatically signed in to the NetSuite for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional resources

- [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)
- [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)
- [What is conditional access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)
- [Try NetSuite with Azure AD](https://aad.portal.azure.com/)
- [What is session control in Microsoft Cloud App Security?](https://docs.microsoft.com/cloud-app-security/proxy-intro-aad)

- [How to protect NetSuite with advanced visibility and controls](https://docs.microsoft.com/cloud-app-security/proxy-intro-aad)