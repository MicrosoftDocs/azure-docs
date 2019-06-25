---
title: 'Tutorial: Azure Active Directory integration with Alibaba Cloud Service (Role-based SSO) | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Alibaba Cloud Service (Role-based SSO).
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: 3667841e-acfc-4490-acf5-80d9ca3e71e8
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 05/02/2019
ms.author: jeedes

ms.collection: M365-identity-device-management
---
# Tutorial: Azure Active Directory integration with Alibaba Cloud Service (Role-based SSO)

In this tutorial, you learn how to integrate Alibaba Cloud Service (Role-based SSO) with Azure Active Directory (Azure AD).
Integrating Alibaba Cloud Service (Role-based SSO) with Azure AD provides you with the following benefits:

* You can control in Azure AD who has access to Alibaba Cloud Service (Role-based SSO).
* You can enable your users to be automatically signed-in to Alibaba Cloud Service (Role-based SSO) (Single Sign-On) with their Azure AD accounts.
* You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).
If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To configure Azure AD integration with Alibaba Cloud Service (Role-based SSO), you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get a [free account](https://azure.microsoft.com/free/)
* Alibaba Cloud Service (Role-based SSO) single sign-on enabled subscription

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* Alibaba Cloud Service (Role-based SSO) supports **IDP** initiated SSO

## Adding Alibaba Cloud Service (Role-based SSO) from the gallery

To configure the integration of Alibaba Cloud Service (Role-based SSO) into Azure AD, you need to add Alibaba Cloud Service (Role-based SSO) from the gallery to your list of managed SaaS apps.

**To add Alibaba Cloud Service (Role-based SSO) from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon.

	![The Azure Active Directory button](common/select-azuread.png)

2. Navigate to **Enterprise Applications** and then select the **All Applications** option.

	![The Enterprise applications blade](common/enterprise-applications.png)

3. To add new application, click **New application** button on the top of dialog.

	![The New application button](common/add-new-app.png)

4. In the search box, type **Alibaba Cloud Service (Role-based SSO)**, select **Alibaba Cloud Service (Role-based SSO)** from result panel then click **Add** button to add the application.

	![Alibaba Cloud Service (Role-based SSO) in the results list](common/search-new-app.png)

5. On the **Alibaba Cloud Service (Role-based SSO)** page, click **Properties** in the left-side navigation pane, and copy the **object ID** and save it on your computer for subsequent use.

	![Properties config](./media/alibaba-cloud-service-role-based-sso-tutorial/Properties.png)
	
## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with Alibaba Cloud Service (Role-based SSO) based on a test user called **Britta Simon**.
For single sign-on to work, a link relationship between an Azure AD user and the related user in Alibaba Cloud Service (Role-based SSO) needs to be established.

To configure and test Azure AD single sign-on with Alibaba Cloud Service (Role-based SSO), you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Configure Role-Based Single Sign-On in Alibaba Cloud Service](#configure-role-based-single-sign-on-in-alibaba-cloud-service)** - to enable your users to use this feature.
2. **[Configure Alibaba Cloud Service (Role-based SSO) Single Sign-On](#configure-alibaba-cloud-service-role-based-sso-single-sign-on)** - to configure the Single Sign-On settings on application side.
3. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Create Alibaba Cloud Service (Role-based SSO) test user](#create-alibaba-cloud-service-role-based-sso-test-user)** - to have a counterpart of Britta Simon in Alibaba Cloud Service (Role-based SSO) that is linked to the Azure AD representation of user.
6. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal.

To configure Azure AD single sign-on with Alibaba Cloud Service (Role-based SSO), perform the following steps:

1. In the [Azure portal](https://portal.azure.com/), on the **Alibaba Cloud Service (Role-based SSO)** application integration page, select **Single sign-on**.

    ![Configure single sign-on link](common/select-sso.png)

2. On the **Select a Single sign-on method** dialog, select **SAML/WS-Fed** mode to enable single sign-on.

    ![Single sign-on select mode](common/select-saml-option.png)

3. On the **Set up Single Sign-On with SAML** page, click **Edit** icon to open **Basic SAML Configuration** dialog.

	![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, if you have **Service Provider metadata file**, perform the following steps:

	>[!NOTE]
	>You will get the Service Provider metadata from this [URL](https://signin.alibabacloud.com/saml-role/sp-metadata.xml)

	a. Click **Upload metadata file**.

    ![image](common/upload-metadata.png)

	b. Click on **folder logo** to select the metadata file and click **Upload**.

	![image](common/browse-upload-metadata.png)

	c. Once the metadata file is successfully uploaded, the **Identifier** and **Reply URL** values get auto populated in Alibaba Cloud Service (Role-based SSO) section textbox:

	![image](common/idp-intiated.png)

	> [!Note]
	> If the **Identifier** and **Reply URL** values do not get auto populated, then fill in the values manually according to your requirement.

5. Alibaba Cloud Service (Role-based SSO) application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes. Click **Edit** icon to open **User Attributes** dialog.

	![image](common/edit-attribute.png)

6. In addition to above, Alibaba Cloud Service (Role-based SSO) application expects few more attributes to be passed back in SAML response. In the **User Claims** section on the **User Attributes** dialog, perform the following steps to add SAML token attribute as shown in the below table:

	| Name | Namespace | Source Attribute|
	| ---------------| ------------| --------------- |
	| Role | https:\//www.aliyun.com/SAML-Role/Attribute | user.assignedroles |
	| RoleSessionName | https:\//www.aliyun.com/SAML-Role/Attribute | user.userprincipalname |

	> [!NOTE]
	> Please click [here](https://docs.microsoft.com/azure/active-directory/develop/active-directory-enterprise-app-role-management) to know how to configure **Role** in Azure AD

	a. Click **Add new claim** to open the **Manage user claims** dialog.

	![image](common/new-save-attribute.png)

	![image](common/new-attribute-details.png)

	b. In the **Name** textbox, type the attribute name shown for that row.

	c. Leave the **Namespace** blank.

	d. Select Source as **Attribute**.

	e. From the **Source attribute** list, type the attribute value shown for that row.

	f. Click **Save**.

7. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Federation Metadata XML** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

8. On the **Set up Alibaba Cloud Service (Role-based SSO)** section, copy the appropriate URL(s) as per your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

	a. Login URL

	b. Azure AD Identifier

	c. Logout URL

### Configure Role-Based Single Sign-On in Alibaba Cloud Service

1. Sign in to the Alibaba Cloud [RAM console](https://account.alibabacloud.com/login/login.htm?oauth_callback=https%3A%2F%2Fram.console.aliyun.com%2F%3Fspm%3Da2c63.p38356.879954.8.7d904e167h6Yg9) by using Account1.

2. In the left-side navigation pane, select **SSO**.

3. On the **Role-based SSO** tab, click **Create IdP**.

4. On the displayed page, enter `AAD` in the IdP Name field, enter a description in 
the **Note** field, click **Upload** to upload the federation metadata file you downloaded before, and click **OK**.

5. After the IdP is successfully created, click **Create RAM Role**.

6. In the **RAM Role Name** field enter `AADrole`, select `AAD` from the **Select IdP** drop-down list and click OK.

	>[!NOTE]
	>You can grant permission to the role as needed. After creating the IdP and the corresponding role, we recommend that you save the ARNs of the IdP and the role for subsequent use. You can obtain the ARNs on the IdP information page and the role information page.

7. Associate the Alibaba Cloud RAM role (AADrole) with the Azure AD user (u2):
To associate the RAM role with the Azure AD user, you must create a role in Azure AD by following these steps:

	a. Sign on to the [Azure AD Graph Explorer](https://developer.microsoft.com/graph/graph-explorer?spm=a2c63.p38356.879954.9.7d904e167h6Yg9).

	b. Click **modify permissions** to obtain required permissions for creating a role.

	![Graph config](./media/alibaba-cloud-service-role-based-sso-tutorial/graph01.png)

	c. Select the following permissions from the list and click **Modify Permissions**, as shown in the following figure.

	![Graph config](./media/alibaba-cloud-service-role-based-sso-tutorial/graph02.png)

	>[!NOTE]
	>After permissions are granted, log on to the Graph Explorer again.

	d. On the Graph Explorer page, select **GET** from the first drop-down list and **beta** from the second drop-down list. Then enter `https://graph.microsoft.com/beta/servicePrincipals` in the field next to the drop-down lists, and click **Run Query**.

	![Graph config](./media/alibaba-cloud-service-role-based-sso-tutorial/graph03.png)

	>[!NOTE]
	>If you are using multiple directories, you can enter `https://graph.microsoft.com/beta/contoso.com/servicePrincipals` in the field of the query.

	e. In the **Response Preview** section, extract the appRoles property from the 'Service Principal' for subsequent use.

	![Graph config](./media/alibaba-cloud-service-role-based-sso-tutorial/graph05.png)

	>[!NOTE]
	>You can locate the appRoles property by entering `https://graph.microsoft.com/beta/servicePrincipals/<objectID>` in the field of the query. Note that the `objectID` is the object ID you have copied from the Azure AD **Properties** page.

	f. Go back to the Graph Explorer, change the method from **GET** to **PATCH**, paste the following content into the **Request Body** section, and click **Run Query**:
	```
	{ 
  	"appRoles": [
    	{ 
      	"allowedMemberTypes":[
        	"User"
      	],
      	"description": "msiam_access",
      	"displayName": "msiam_access",
      	"id": "41be2db8-48d9-4277-8e86-f6d22d35****",
      	"isEnabled": true,
      	"origin": "Application",
      	"value": null
    	},
    	{ "allowedMemberTypes": [
        	"User"
    	],
    	"description": "Admin,AzureADProd",
    	"displayName": "Admin,AzureADProd",
    	"id": "68adae10-8b6b-47e6-9142-6476078cdbce",
    	"isEnabled": true,
    	"origin": "ServicePrincipal",
    	"value": "acs:ram::187125022722****:role/aadrole,acs:ram::187125022722****:saml-provider/AAD"
    	}
  	]
	}
	```
	> [!NOTE]
	> The `value` is the ARNs of the IdP and the role you created in the RAM console. Here, you can add multiple roles as needed. Azure AD will send the value of these roles as the claim value in SAML response. However, you can only add new roles after the `msiam_access` part for the patch operation. To smooth the creation process, we recommend that you use an ID generator, such as GUID Generator, to generate IDs in real time.

	g. After the 'Service Principal' is patched with the required role, attach the role with the Azure AD user (u2) by following the steps of **Assign the Azure AD test user** section of the tutorial.

### Configure Alibaba Cloud Service (Role-based SSO) Single Sign-On

To configure single sign-on on **Alibaba Cloud Service (Role-based SSO)** side, you need to send the downloaded **Federation Metadata XML** and appropriate copied URLs from Azure portal to [Alibaba Cloud Service (Role-based SSO) support team](https://www.aliyun.com/service/). They set this setting to have the SAML SSO connection set properly on both sides.

### Create an Azure AD test user 

The objective of this section is to create a test user in the Azure portal called Britta Simon.

1. In the Azure portal, in the left pane, select **Azure Active Directory**, select **Users**, and then select **All users**.

    ![The "Users and groups" and "All users" links](common/users.png)

2. Select **New user** at the top of the screen.

    ![New user Button](common/new-user.png)

3. In the User properties, perform the following steps.

    ![The User dialog box](common/user-properties.png)

    a. In the **Name** field, enter **BrittaSimon**.
  
    b. In the **User name** field, type `brittasimon@yourcompanydomain.extension`. For example, BrittaSimon@contoso.com

    c. Select **Show password** check box, and then write down the value that's displayed in the Password box.

    d. Click **Create**.

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Alibaba Cloud Service (Role-based SSO).

1. In the Azure portal, select **Enterprise Applications**, select **All applications**, then select **Alibaba Cloud Service (Role-based SSO)**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **Alibaba Cloud Service (Role-based SSO)**.

	![The Alibaba Cloud Service (Role-based SSO) link in the Applications list](common/all-applications.png)

3. In the menu on the left, select **Users and groups**.

    ![The "Users and groups" link](common/users-groups-blade.png)

4. Click the **Add user** button, then select **Users and groups** in the **Add Assignment** dialog.

    ![The Add Assignment pane](common/add-assign-user.png)

5. On the **Users and groups** tab, select u2 from the user list, and click **Select**. Then, click **Assign**.

	![Test config](./media/alibaba-cloud-service-role-based-sso-tutorial/test01.png)

6. View the assigned role and test Alibaba Cloud Service (Role-based SSO).

	![Test config](./media/alibaba-cloud-service-role-based-sso-tutorial/test02.png)

	>[!NOTE]
	>After you assign the user (u2), the created role is automatically attached to the user. If you have created multiple roles, you need to attach the appropriate role to the user as needed. If you want to implement role-based SSO from Azure AD to multiple Alibaba Cloud accounts, repeat the preceding steps.

### Create Alibaba Cloud Service (Role-based SSO) test user

In this section, you create a user called Britta Simon in Alibaba Cloud Service (Role-based SSO). Work with [Alibaba Cloud Service (Role-based SSO) support team](https://www.aliyun.com/service/) to add the users in the Alibaba Cloud Service (Role-based SSO) platform. Users must be created and activated before you use single sign-on.

### Test single sign-on 

After the preceding configurations are completed, test Alibaba Cloud Service (Role-based SSO) by following these steps:

1. In the Azure portal, go to the **Alibaba Cloud Service (Role-based SSO)** page, select **Single sign-on**, and click **Test**.

	![Test config](./media/alibaba-cloud-service-role-based-sso-tutorial/test03.png)

2. Click **Sign in as current user**.

	![Test config](./media/alibaba-cloud-service-role-based-sso-tutorial/test04.png)

3. On the account selection page, select u2.

	![Test config](./media/alibaba-cloud-service-role-based-sso-tutorial/test05.png)

4. The following page is displayed, indicating that role-based SSO is successful.

	![Test config](./media/alibaba-cloud-service-role-based-sso-tutorial/test06.png)

## Additional Resources

- [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is Conditional Access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

