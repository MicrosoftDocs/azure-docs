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
ms.devlang: na
ms.topic: tutorial
ms.date: 09/10/2019
ms.author: jeedes

ms.collection: M365-identity-device-management
---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with NetSuite

In this tutorial, you'll learn how to integrate NetSuite with Azure Active Directory (Azure AD). When you integrate NetSuite with Azure AD, you can:

* Control in Azure AD who has access to NetSuite.
* Enable your users to be automatically signed-in to NetSuite with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

To learn more about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* NetSuite single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* NetSuite supports **IDP** initiated SSO

* NetSuite supports **Just In Time** user provisioning

* NetSuite supports [Automated user provisioning](NetSuite-provisioning-tutorial.md)

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Adding NetSuite from the gallery

To configure the integration of NetSuite into Azure AD, you need to add NetSuite from the gallery to your list of managed SaaS apps.

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **NetSuite** in the search box.
1. Select **NetSuite** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD single sign-on for NetSuite

Configure and test Azure AD SSO with NetSuite using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in NetSuite.

To configure and test Azure AD SSO with NetSuite, complete the following building blocks:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure NetSuite SSO](#configure-netsuite-sso)** - to configure the single sign-on settings on application side.
    1. **[Create NetSuite test user](#create-netsuite-test-user)** - to have a counterpart of B.Simon in NetSuite that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the [Azure portal](https://portal.azure.com/), on the **NetSuite** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the edit/pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, enter the values for the following fields:

    In the **Reply URL** text box, type a URL using the following pattern:

	| |
	|--|
	| `https://<tenant-name>.NetSuite.com/saml2/acs` |
	| `https://<tenant-name>.na1.NetSuite.com/saml2/acs` |
	| `https://<tenant-name>.na2.NetSuite.com/saml2/acs` |
	| `https://<tenant-name>.sandbox.NetSuite.com/saml2/acs` |
	| `https://<tenant-name>.na1.sandbox.NetSuite.com/saml2/acs` |
	| `https://<tenant-name>.na2.sandbox.NetSuite.com/saml2/acs` |

	> [!NOTE]
	> The value is not real. Update the value with the actual Reply URL. Contact [NetSuite Client support team](http://www.netsuite.com/portal/services/support-services/suitesupport.shtml) to get the value. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

1. NetSuite application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes. Click **Edit** icon to open User Attributes dialog.

	![image](common/edit-attribute.png)

1. In addition to above, NetSuite application expects few more attributes to be passed back in SAML response. In the User Claims section on the User Attributes dialog, perform the following steps to add SAML token attribute as shown in the below table:

	| Name | Source Attribute | 
	| ---------------| --------------- |
	| account  | `account id` |

	1. Click **Add new claim** to open the **Manage user claims** dialog.

	1. In the **Name** textbox, type the attribute name shown for that row.

	1. Leave the **Namespace** blank.

	1. Select Source as **Attribute**.

	1. From the **Source attribute** list, type the attribute value shown for that row.

	1. Click **Ok**

	1. Click **Save**.

	>[!NOTE]
	>The value of account attribute is not real. You will update this value, which is explained later in the tutorial.

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Federation Metadata XML** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

1. On the **Set up NetSuite** section, copy the appropriate URL(s) based on your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to NetSuite.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **NetSuite**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.

   ![The "Users and groups" link](common/users-groups-blade.png)

1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.

	![The Add User link](common/add-assign-user.png)

1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure NetSuite SSO

1. Open a new tab in your browser, and sign into your NetSuite company site as an administrator.

2. In the toolbar at the top of the page, click **Setup**, then navigate to **Company** and click **Enable Features**.

    ![Configure Single Sign-On](./media/NetSuite-tutorial/ns-setupsaml.png)

3. In the toolbar at the middle of the page, click **SuiteCloud**.

    ![Configure Single Sign-On](./media/NetSuite-tutorial/ns-suitecloud.png)

4. Under **Manage Authentication** section, select **SAML SINGLE SIGN-ON** to enable the SAML SINGLE SIGN-ON option in NetSuite.

    ![Configure Single Sign-On](./media/NetSuite-tutorial/ns-ticksaml.png)

5. In the toolbar at the top of the page, click **Setup**.

    ![Configure Single Sign-On](./media/NetSuite-tutorial/ns-setup.png)

6. From the **SETUP TASKS** list, click **Integration**.

	![Configure Single Sign-On](./media/NetSuite-tutorial/ns-integration.png)

7. In the **MANAGE AUTHENTICATION** section, click **SAML Single Sign-on**.

    ![Configure Single Sign-On](./media/NetSuite-tutorial/ns-saml.png)

8. On the **SAML Setup** page, under **NetSuite Configuration** section perform the following steps:

    ![Configure Single Sign-On](./media/NetSuite-tutorial/ns-saml-setup.png)
  
    a. Select **PRIMARY AUTHENTICATION METHOD**.

    b. For the field labeled **SAMLV2 IDENTITY PROVIDER METADATA**, select **UPLOAD IDP METADATA FILE**. Then click **Browse** to upload the metadata file that you downloaded from Azure portal.

    c. Click **Submit**.

9. In NetSuite, click **Setup** then navigate to **Company** and click **Company Information** from the top navigation menu.

	![Configure Single Sign-On](./media/NetSuite-tutorial/ns-com.png)

	![Configure Single Sign-On](./media/NetSuite-tutorial/ns-account-id.png)

    b. In the **Company Information** Page on the right column copy the **ACCOUNT ID**.

    c. Paste the **Account ID** which you have copied from NetSuite account it into the **Attribute Value** field in Azure AD. 

10. Before users can perform single sign-on into NetSuite, they must first be assigned the appropriate permissions in NetSuite. Follow the instructions below to assign these permissions.

    a. On the top navigation menu, click **Setup**.

    ![Configure Single Sign-On](./media/NetSuite-tutorial/ns-setup.png)

    b. On the left navigation menu, select **Users/Roles**, then click **Manage Roles**.

    ![Configure Single Sign-On](./media/NetSuite-tutorial/ns-manage-roles.png)

    c. Click **New Role**.

    d. Type in a **Name** for your new role.

    ![Configure Single Sign-On](./media/NetSuite-tutorial/ns-new-role.png)

    e. Click **Save**.

    f. In the menu on the top, click **Permissions**. Then click **Setup**.

    ![Configure Single Sign-On](./media/NetSuite-tutorial/ns-sso.png)

    g. Select **SAML Single Sign-on**, and then click **Add**.

    h. Click **Save**.

    i. On the top navigation menu, click **Setup**, then click **Setup Manager**.

    ![Configure Single Sign-On](./media/NetSuite-tutorial/ns-setup.png)

    j. On the left navigation menu, select **Users/Roles**, then click **Manage Users**.

    ![Configure Single Sign-On](./media/NetSuite-tutorial/ns-manage-users.png)

    k. Select a test user. Then click **Edit** and then navigate to **Access** tab.

    ![Configure Single Sign-On](./media/NetSuite-tutorial/ns-edit-user.png)

    l. On the Roles dialog, assign the appropriate role that you have created.

    ![Configure Single Sign-On](./media/NetSuite-tutorial/ns-add-role.png)

    m. Click **Save**.

### Create NetSuite test user

In this section, a user called Britta Simon is created in NetSuite. NetSuite supports just-in-time user provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in NetSuite, a new one is created after authentication.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the NetSuite tile in the Access Panel, you should be automatically signed in to the NetSuite for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional resources

- [ List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory ](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory? ](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is conditional access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

- [Try NetSuite with Azure AD](https://aad.portal.azure.com/)

