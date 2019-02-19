---
title: 'Tutorial: Azure Active Directory integration with Figma | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Figma.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: 8569cae1-87dd-4c40-9bbb-527ac80d6a96
ms.service: Azure-Active-Directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 02/12/2019
ms.author: jeedes

ms.collection: M365-identity-device-management
---
# Tutorial: Azure Active Directory integration with Figma

In this tutorial, you learn how to integrate Figma with Azure Active Directory (Azure AD).
Integrating Figma with Azure AD provides you with the following benefits:

* You can control in Azure AD who has access to Figma.
* You can enable your users to be automatically signed-in to Figma (Single Sign-On) with their Azure AD accounts.
* You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).

## Prerequisites

To configure Azure AD integration with Figma, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get one-month trial [here](https://azure.microsoft.com/pricing/free-trial/)
* A Figma Organization Plan

**Note:**
To test the steps in this tutorial, we do not recommend using a production environment. New customers and active subscribers of Figma Professional Team may contact Figma to upgrade their subscription to the [Figma Organization Plan.](https://www.figma.com/pricing/)

Follow these recommendations:

  - Do not use your production environment, unless it is necessary.
  - If you don't have an Azure AD trial environment, you can get a one-month trial.

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

1. Adding Figma from the gallery
2. Configuring and testing Azure AD single sign-on

## Adding Figma from the gallery

To configure the integration of Figma into Azure AD, you need to add Figma from the gallery to your list of managed SaaS apps.

**To add Figma from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon.

	![The Azure Active Directory button](common/select-azuread.png)

2. Navigate to **Enterprise Applications** and then select the **All Applications** option.

	![The Enterprise applications blade](common/enterprise-applications.png)

3. To add new application, click **New application** button on the top of dialog.

	![The New application button](common/add-new-app.png)
	
	* In the search box, type Figma. Select Figma from the results panel, and then click the Add button to add the application.


	![add_from_gallery](https://user-images.githubusercontent.com/31861984/53034014-393a4600-3427-11e9-8b14-bb3a6a9b5a33.png)
	
	* In the Azure portal, on the Figma application integration page, click Single sign-on. 
	
	![single_sign_on](https://user-images.githubusercontent.com/31861984/53034458-0ba1cc80-3428-11e9-9bc8-080b9d7671f3.png)
	
	* On the Select a Single sign-on method dialog, Click Select for SAML mode to enable single sign-on.
	
	![select](https://user-images.githubusercontent.com/31861984/53034557-49065a00-3428-11e9-8fa3-420d11731f5d.png)
	
	* If you need to change to SAML mode from any another mode, click Change single sign-on mode on top of the screen.
	
	![change](https://user-images.githubusercontent.com/31861984/53034703-9d113e80-3428-11e9-8cc2-9a573a3bfa1c.png)
	
	* **Copy the App Federation Metadata URL.**
	
	![saml_cert](https://user-images.githubusercontent.com/31861984/53034834-f4afaa00-3428-11e9-9f20-5d9cd19d02ab.png)

	### *Note that the following step will require leaving the Azure site.  The copied App Federation Metadata URL will be used on the Figma site to generate the information required to complete the remaining steps.*     
	
	## Complete Figma’s instructions here: [Configure Azure Active Directory SAML SSO](https://help.figma.com/article/243-configure-azure-active-directory-saml-sso) to generate configuration details
	
	### Instructions below to be completed in Azure Portal: 
	
## Finish Single Sign-On Configuration: 


- On the **Set up Single Sign-On with SAML** page, click **Edit** icon to open **Basic SAML Configuration** dialog.

	![setup](https://user-images.githubusercontent.com/31861984/53035862-46f1ca80-342b-11e9-9223-6660cac70a6e.png)
	
- On the **Basic SAML Configuration** section, perform the following steps, if you wish to configure the application in **IDP** initiated mode:
	
	![basic](https://user-images.githubusercontent.com/31861984/53035916-67218980-342b-11e9-99d1-f20efa111d77.png)
	
	
	- Using the Tenant ID generated in from Figma’s [Configure Azure Active Directory SAML SSO process](https://help.figma.com/article/243-configure-azure-active-directory-saml-sso),  insert the following text. 
	  -  In the **Identifier** textbox, type a URL using the following pattern: 
	  `https://www.figma.com/saml/<TENANT ID>`
	  -  In the **Reply URL** textbox, type a URL using the following pattern: 
	  `https://www.figma.com/saml/<TENANT ID>/consume`
	  
	- Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:
	
	![set_additional](https://user-images.githubusercontent.com/31861984/53036099-d8613c80-342b-11e9-92dd-b96558bdc29d.png)
	
	- In the **Sign-on URL** textbox, type a URL using the following pattern: 
	`https://www.figma.com/saml/<TENANT ID>/start`
	
	- Figma application expects the SAML assertions in a specific format. Configure the following claims for this application. You can manage the values of these attributes from the **User Attributes** section on application integration page. On the **Set up Single Sign-On with SAML** page, click **Edit** button to open **User Attributes** dialog.
	
	![attributes](https://user-images.githubusercontent.com/31861984/53036182-0b0b3500-342c-11e9-818c-523b24600591.png)
	
	- In the **User Claims** section on the **User Attributes** dialog, configure SAML token attribute as shown in the image above and perform the following steps:
	
	
	| Name | Source Attribute|
	| ---------------| --------- |
	| `externalId` | `user.mailnickname` |
	| `displayName` | `user.displayname` |
	| `title` | `user.jobtitle` |
	| `emailaddress` | `user.mail` |
	| `familyName` | `user.surname` |
	| `givenName` | `givenName` |
	| `userName` | `user.userprincipalname` |
	
	- Click Add new claim to open the Manage user claims dialog.
	
	![user_claims](https://user-images.githubusercontent.com/31861984/53036330-63423700-342c-11e9-87a7-eb6160a579b0.png)
	
	![manage_user_claims](https://user-images.githubusercontent.com/31861984/53036413-91c01200-342c-11e9-9b00-a5fd1f7b3a1f.png)
	
	
  -  In the **Name** textbox, type the attribute name shown for that row.
  -  Leave the **Namespace** blank.
  -  Select Source as **Attribute**.
  -  From the **Source attribute** list, type the attribute value shown for that row.
  -  Click **Ok**.
  -  Click **Save**.


	
## Test Azure AD Single Sign-On

In this section, you configure and test Azure AD single sign-on with Figma based on a test user called **Britta Simon**.
For single sign-on to work, Azure AD needs to be linked to Figma. To configure and test Azure AD single sign-on with Figma, complete the following steps:

1. **Create an Azure AD test user** - to test Azure AD single sign-on with Britta Simon. 
2. **Create a Figma test user** - to have a counterpart of Britta Simon in Figma that is linked to the Azure AD representation of user
3. **Assigning the Azure AD test user** - to enable Britta Simon to use Azure AD single sign-on. 
4. **Testing single sign-on** - to verify whether the configuration works

### 1.Creating an Azure AD test user
The objective of this section is to create a test user in the Azure portal called Britta Simon.
- In the Azure portal, in the left pane, select Azure Active Directory, select Users, and then select All users.

![all_users](https://user-images.githubusercontent.com/31861984/53037407-ff6d3d80-342e-11e9-885e-0042e80b5b02.png)

- Select **New user** at the top of the screen.

![new-user](https://user-images.githubusercontent.com/31861984/53037514-43f8d900-342f-11e9-93af-3f3a1211ea58.png)

- In the User properties, perform the following steps:

![user](https://user-images.githubusercontent.com/31861984/53037552-612da780-342f-11e9-94d9-ac1a84bc7c83.png)

- In the Name field, enter BrittaSimon. 
- In the User name field, type brittasimon@yourcompanydomain.extension. For example, BrittaSimon@contoso.com
- Select Properties, select the Show password check box, and then write down the value that's displayed in the Password box.
- Select Create. 
	
	
### Creating a Figma test user 
The objective of this section is to create a user called Britta Simon in Figma. Figma supports just-in-time provisioning, which is by default enabled. There is no action item for you in this section. A new user is created during an attempt to access Figma if it doesn't exist yet.

### Assigning the Azure AD test user
In this section, you enable Britta Simon to use Azure single sign-on by granting access to Figma SAML.

1. In the Azure portal, select Enterprise Applications, select All applications.

![enterprise](https://user-images.githubusercontent.com/31861984/53037854-1fe9c780-3430-11e9-93b3-4e8fb7f92a93.png)

2. In the applications list, select **Figma SAML** 

![figma_saml](https://user-images.githubusercontent.com/31861984/53037917-4576d100-3430-11e9-9463-1ea7fe160fda.png)

3. In the menu on the left, click **Users and groups**

![users-groups](https://user-images.githubusercontent.com/31861984/53037992-76ef9c80-3430-11e9-9af4-9f25eb89f8a3.png)

4. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog

![add-user](https://user-images.githubusercontent.com/31861984/53038041-98508880-3430-11e9-9f93-01efbcc7f9c1.png)

5. In the **Users and groups** dialog select **Britta Simon** in the Users list, then click the **Select** button at the bottom of the screen.

6. In the **Add Assignment dialog**, select the **Assign**  Button

### Testing Single Sign-On

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Figma tile in the Access Panel, you should be automatically signed in to the Figma for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional Resources

- [ List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory ](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory? ](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is conditional access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)
