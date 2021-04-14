---
title: 'Tutorial: Azure Active Directory integration with SumTotalCentral | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and SumTotalCentral.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 08/31/2020
ms.author: jeedes
---
# Tutorial: Azure Active Directory integration with SumTotalCentral

In this tutorial, you learn how to integrate SumTotalCentral with Azure Active Directory (Azure AD).
Integrating SumTotalCentral with Azure AD provides you with the following benefits:

* You can control in Azure AD who has access to SumTotalCentral.
* You can enable your users to be automatically signed-in to SumTotalCentral (Single Sign-On) with their Azure AD accounts.
* You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](../manage-apps/what-is-single-sign-on.md).
If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To configure Azure AD integration with SumTotalCentral, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get one-month trial [here](https://azure.microsoft.com/pricing/free-trial/)
* SumTotalCentral single sign-on enabled subscription

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* SumTotalCentral supports **SP** initiated SSO

* Once you configure SumTotalCentral you can enforce Session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad)
    
> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Adding SumTotalCentral from the gallery

To configure the integration of SumTotalCentral into Azure AD, you need to add SumTotalCentral from the gallery to your list of managed SaaS apps.

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **SumTotalCentral** in the search box.
1. Select **SumTotalCentral** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD SSO

In this section, you configure and test Azure AD single sign-on with SumTotalCentral based on a test user called **Britta Simon**.
For single sign-on to work, a link relationship between an Azure AD user and the related user in SumTotalCentral needs to be established.

To configure and test Azure AD single sign-on with SumTotalCentral, you need to complete the following building blocks:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    * **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
    * **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
2. **[Configure SumTotalCentral SSO](#configure-sumtotalcentral-sso)** - to configure the Single Sign-On settings on application side.
    * **[Create SumTotalCentral test user](#create-sumtotalcentral-test-user)** - to have a counterpart of Britta Simon in SumTotalCentral that is linked to the Azure AD representation of user.
3. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the [Azure portal](https://portal.azure.com/), on the **SumTotalCentral** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the edit/pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, perform the following steps:

    ![SumTotalCentral Domain and URLs single sign-on information](common/sp-identifier.png)

	a. In the **Sign on URL** text box, type a URL using the following pattern:
    `https://<subdomain>.sumtotalsystems.com/sites/default`

    b. In the **Identifier (Entity ID)** text box, type the value:
    `SumTotalFederationGateway`

    c. In the **Reply URL** textbox, enter a URL using the following pattern:    
    `https://<subdomain>.sumtotalsystems.com/Broker/Token/CUSTOM_URL`

	> [!NOTE]
	> These values are not real. Update the value with the actual Sign-On URL and Reply URL. Contact [SumTotalCentral Client support team](http://www.sumtotalsystems.com/support/) to get the value. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

5. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Federation Metadata XML** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

6. On the **Set up SumTotalCentral** section, copy the appropriate URL(s) as per your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

	a. Login URL

	b. Azure AD Identifier

	c. Logout URL

### Create an Azure AD test user 

In this section, you'll create a test user named B.Simon in the Azure portal.

1. In the left pane of the Azure portal, select **Azure Active Directory**, select **Users**, and then select **All users**.
1. At the top of the screen, select **New user**.
1. In the **User** properties, follow these steps:
   1. In the **Name** field, enter **B.Simon**.  
   1. In the **User name** field, enter `<username>@<companydomain>.<extension>`. For example: `B.Simon@contoso.com`.
   1. Select the **Show password** check box, and then make note of the value that's displayed in the **Password** box.
   1. Select **Create**.

### Assign the Azure AD test user

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to SumTotalCentral.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **SumTotalCentral**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.

   ![The "Users and groups" link](common/users-groups-blade.png)

1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.

	![The Add User link](common/add-assign-user.png)

1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure SumTotalCentral SSO

To configure single sign-on on **SumTotalCentral** side, you need to send the downloaded **Federation Metadata XML** and appropriate copied URLs from Azure portal to [SumTotalCentral support team](http://www.sumtotalsystems.com/support/). They set this setting to have the SAML SSO connection set properly on both sides.

### Create SumTotalCentral test user

In this section, you create a user called Britta Simon in SumTotalCentral. Work with [SumTotalCentral support team](http://www.sumtotalsystems.com/support/) to add the users in the SumTotalCentral platform. Users must be created and activated before you use single sign-on.

## Test SSO

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the SumTotalCentral tile in the Access Panel, you should be automatically signed in to the SumTotalCentral for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](../user-help/my-apps-portal-end-user-access.md).

## Additional Resources

- [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](./tutorial-list.md)

- [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)

- [What is Conditional Access in Azure Active Directory?](../conditional-access/overview.md)