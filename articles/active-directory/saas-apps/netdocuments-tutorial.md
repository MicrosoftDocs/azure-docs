---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with NetDocuments | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and NetDocuments.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: 1a47dc42-1a17-48a2-965e-eca4cfb2f197
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 09/03/2019
ms.author: jeedes

ms.collection: M365-identity-device-management
---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with NetDocuments

In this tutorial, you'll learn how to integrate NetDocuments with Azure Active Directory (Azure AD). When you integrate NetDocuments with Azure AD, you can:

* Control in Azure AD who has access to NetDocuments.
* Enable your users to be automatically signed-in to NetDocuments with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

To learn more about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* NetDocuments single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* NetDocuments supports **SP** initiated SSO

## Adding NetDocuments from the gallery

To configure the integration of NetDocuments into Azure AD, you need to add NetDocuments from the gallery to your list of managed SaaS apps.

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **NetDocuments** in the search box.
1. Select **NetDocuments** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD single sign-on for NetDocuments

Configure and test Azure AD SSO with NetDocuments using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in NetDocuments.

To configure and test Azure AD SSO with NetDocuments, complete the following building blocks:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure NetDocuments SSO](#configure-netdocuments-sso)** - to configure the single sign-on settings on application side.
    1. **[Create NetDocuments test user](#create-netdocuments-test-user)** - to have a counterpart of B.Simon in NetDocuments that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the [Azure portal](https://portal.azure.com/), on the **NetDocuments** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the edit/pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, enter the values for the following fields:

    a. In the **Sign on URL** text box, type a URL using the following pattern:
    `https://vault.netvoyage.com/neWeb2/docCent.aspx?whr=<Repository ID>`

    b. In the **Reply URL** text box, type a URL using the following pattern:
    `https://vault.netvoyage.com/neWeb2/docCent.aspx?whr=<Repository ID>`
    
    c. In the **Identifier (Entity ID)** text box, type a URL using the following pattern:
    `http://netdocuments.com/VAULT`

	> [!NOTE]
	> These values are not real. Update these values with the actual Sign on URL and Reply URL. Repository ID is a value starting with **CA-** followed by 8 character code associated with your NetDocuments Repository. You can check the [NetDocuments Federated Identity support document](https://support.netdocuments.com/hc/en-us/articles/205220410-Federated-Identity-Login) for more information. Alternatively you can contact [NetDocuments Client support team](https://support.netdocuments.com/hc/) to get these values if you have difficulties configuring using the above information . You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

1. NetDocuments application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes, where as **nameidentifier** is mapped with **user.userprincipalname**. NetDocuments application expects **nameidentifier** to be mapped with **employeeid** or any other claim which is applicable to your Organization as **nameidentifier**, so you need to edit the attribute mapping by clicking on **Edit** icon and change the attribute mapping.

	![image](common/edit-attribute.png)

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Federation Metadata XML** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

1. On the **Set up NetDocuments** section, copy the appropriate URL(s) based on your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to NetDocuments.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **NetDocuments**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.

   ![The "Users and groups" link](common/users-groups-blade.png)

1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.

	![The Add User link](common/add-assign-user.png)

1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure NetDocuments SSO

1. In a different web browser window, sign into your NetDocuments company site as an administrator.

2. In the upper-right corner, select your name>**Admin**.

3. Select **Security Center**.
   
    ![Repository](./media/netdocuments-tutorial/security-center.png "Security Center")

4. Select **Advanced Authentication**.
    
    ![Configure advanced authentication options](./media/netdocuments-tutorial/advance-authentication.png "Configure advanced authentication options")

5.	On the **Federated ID** tab, perform the following steps:   
   
    ![Federated Identity](./media/netdocuments-tutorial/federated-id.png "Federated Identity")
   
    a. As **Federated identity server type**, select **Active Directory Federation Services**.
    
    b.	Select **Choose File**, to upload the downloaded metadata file which you have downloaded from Azure portal.
    
    c.	Select **SAVE**.

### Create NetDocuments test user

To enable Azure AD users to sign in to NetDocuments, they must be provisioned into NetDocuments. In the case of NetDocuments, provisioning is a manual task.

**To provision a user account, perform the following steps:**

1. Sign on to your **NetDocuments** company site as administrator.

2. In the upper-right corner, select your name>**Admin**.
   
    ![Admin](./media/netdocuments-tutorial/user-admin.png "Admin")

3. Select **Users and groups**.
   
    ![Repository](./media/netdocuments-tutorial/users-groups.png "Repository")

4. In the **Email Address** textbox, type the email address of a valid Azure Active Directory account you want to provision, and then click **Add User**.
   
    ![Email Address](./media/netdocuments-tutorial/user-mail.png "Email Address")
   
    > [!NOTE]
    > The Azure Active Directory account holder will get an email that includes a link to confirm the account before it becomes active. 
    You can use any other NetDocuments user account creation tools or APIs provided by NetDocuments to provision Azure Active Directory user accounts.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the NetDocuments tile in the Access Panel, you should be automatically signed in to the NetDocuments for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional resources

- [ List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory ](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory? ](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is conditional access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

- [Try NetDocuments with Azure AD](https://aad.portal.azure.com/)
