---
title: 'Tutorial: Azure Active Directory integration with ArcGIS Online | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and ArcGIS Online.
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila
ms.reviewer: joflore

ms.assetid: a9e132a4-29e7-48bf-beb9-4148e617c8a9
ms.service: active-directory
ms.component: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 12/13/2017
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with ArcGIS Online

In this tutorial, you learn how to integrate ArcGIS Online with Azure Active Directory (Azure AD).

Integrating ArcGIS Online with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to ArcGIS Online.
- You can enable your users to automatically get signed-on to ArcGIS Online (Single Sign-On) with their Azure AD accounts.
- You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](../manage-apps/what-is-single-sign-on.md).

## Prerequisites

To configure Azure AD integration with ArcGIS Online, you need the following items:

- An Azure AD subscription
- A ArcGIS Online single sign-on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can [get a one-month trial](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding ArcGIS Online from the gallery
1. Configuring and testing Azure AD single sign-on

## Adding ArcGIS Online from the gallery
To configure the integration of ArcGIS Online into Azure AD, you need to add ArcGIS Online from the gallery to your list of managed SaaS apps.

**To add ArcGIS Online from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![The Azure Active Directory button][1]

1. Navigate to **Enterprise applications**. Then go to **All applications**.

	![The Enterprise applications blade][2]
	
1. To add new application, click **New application** button on the top of dialog.

	![The New application button][3]

1. In the search box, type **ArcGIS Online**, select **ArcGIS Online** from result panel then click **Add** button to add the application.

	![ArcGIS Online in the results list](./media/arcgis-tutorial/tutorial_arcgisonline_addfromgallery.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with ArcGIS Online based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in ArcGIS Online is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in ArcGIS Online needs to be established.

In ArcGIS Online, assign the value of the **user name** in Azure AD as the value of the **Username** to establish the link relationship.

To configure and test Azure AD single sign-on with ArcGIS Online, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
1. **[Create a ArcGIS Online test user](#create-a-arcgis-online-test-user)** - to have a counterpart of Britta Simon in ArcGIS Online that is linked to the Azure AD representation of user.
1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
1. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your ArcGIS Online application.

**To configure Azure AD single sign-on with ArcGIS Online, perform the following steps:**

1. In the Azure portal, on the **ArcGIS Online** application integration page, click **Single sign-on**.

	![Configure single sign-on link][4]

1. On the **Single sign-on** dialog, select **Mode** as	**SAML-based Sign-on** to enable single sign-on.
 
	![Single sign-on dialog box](./media/arcgis-tutorial/tutorial_arcgisonline_samlbase.png)

1. On the **ArcGIS Online Domain and URLs** section, perform the following steps:

	![ArcGIS Online Domain and URLs single sign-on information](./media/arcgis-tutorial/tutorial_arcgisonline_url.png)

    a. In the **Sign-on URL** textbox, type a URL using the following pattern: `https://<companyname>.maps.arcgis.com`

	b. In the **Identifier** textbox, type a URL using the following pattern: `<companyname>.maps.arcgis.com`

	> [!NOTE] 
	> These values are not real. Update these values with the actual Sign-On URL and Identifier. Contact [ArcGIS Online Client support team](http://support.esri.com/en/) to get these values. 
 


1. On the **SAML Signing Certificate** section, click **Metadata XML** and then save the metadata file on your computer.

	![The Certificate download link](./media/arcgis-tutorial/tutorial_arcgisonline_certificate.png) 

1. Click **Save** button.

	![Configure Single Sign-On Save button](./media/arcgis-tutorial/tutorial_general_400.png)

1. In a different web browser window, log into your ArcGIS company site as an administrator.

1. Click **EDIT SETTINGS**.

    ![Edit Settings](./media/arcgis-tutorial/ic784742.png "Edit Settings")

1. Click **Security**.

    ![Security](./media/arcgis-tutorial/ic784743.png "Security")

1. Under **Enterprise Logins**, click **SET IDENTITY PROVIDER**.

    ![Enterprise Logins](./media/arcgis-tutorial/ic784744.png "Enterprise Logins")

1. On the **Set Identity Provider** configuration page, perform the following steps:
   
    ![Set Identity Provider](./media/arcgis-tutorial/ic784745.png "Set Identity Provider")
   
    a. In the **Name** textbox, type your organization’s name.

    b. For **Metadata for the Enterprise Identity Provider will be supplied using**, select **A File**.

    c. To upload your downloaded metadata file, click **Choose file**.

    d. Click **SET IDENTITY PROVIDER**.

> [!TIP]
> You can now read a concise version of these instructions inside the [Azure portal](https://portal.azure.com), while you are setting up the app!  After adding this app from the **Active Directory > Enterprise Applications** section, simply click the **Single Sign-On** tab and access the embedded documentation through the **Configuration** section at the bottom. You can read more about the embedded documentation feature here: [Azure AD embedded documentation]( https://go.microsoft.com/fwlink/?linkid=845985)
> 

### Create an Azure AD test user

The objective of this section is to create a test user in the Azure portal called Britta Simon.

   ![Create an Azure AD test user][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the Azure portal, in the left pane, click the **Azure Active Directory** button.

    ![The Azure Active Directory button](./media/arcgis-tutorial/create_aaduser_01.png)

1. To display the list of users, go to **Users and groups**, and then click **All users**.

    ![The "Users and groups" and "All users" links](./media/arcgis-tutorial/create_aaduser_02.png)

1. To open the **User** dialog box, click **Add** at the top of the **All Users** dialog box.

    ![The Add button](./media/arcgis-tutorial/create_aaduser_03.png)

1. In the **User** dialog box, perform the following steps:

    ![The User dialog box](./media/arcgis-tutorial/create_aaduser_04.png)

    a. In the **Name** box, type **BrittaSimon**.

    b. In the **User name** box, type the email address of user Britta Simon.

    c. Select the **Show Password** check box, and then write down the value that's displayed in the **Password** box.

    d. Click **Create**.
 
### Create a ArcGIS Online test user

In order to enable Azure AD users to log into ArcGIS Online, they must be provisioned into ArcGIS Online.  
In the case of ArcGIS Online, provisioning is a manual task.

**To provision a user account, perform the following steps:**

1. Log in to your **ArcGIS** tenant.

1. Click **INVITE MEMBERS**.
   
    ![Invite Members](./media/arcgis-tutorial/ic784747.png "Invite Members")

1. Select **Add members automatically without sending an email**, and then click **NEXT**.
   
    ![Add Members Automatically](./media/arcgis-tutorial/ic784748.png "Add Members Automatically")

1. On the **Members** dialog page, perform the following steps:
   
     ![Add and review](./media/arcgis-tutorial/ic784749.png "Add and review")
    
	 a. Enter the **Email**, **First Name**, and **Last Name** of a valid AAD account you want to provision.
  
     b. Click **ADD AND REVIEW**.
1. Review the data you have entered, and then click **ADD MEMBERS**.
   
    ![Add member](./media/arcgis-tutorial/ic784750.png "Add member")
		
	> [!NOTE]
    > The Azure Active Directory account holder will receive an email and follow a link to confirm their account before it becomes active.

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to ArcGIS Online.

![Assign the user role][200] 

**To assign Britta Simon to ArcGIS Online, perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

1. In the applications list, select **ArcGIS Online**.

	![The ArcGIS Online link in the Applications list](./media/arcgis-tutorial/tutorial_arcgisonline_app.png)  

1. In the menu on the left, click **Users and groups**.

	![The "Users and groups" link][202]

1. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![The Add Assignment pane][203]

1. On **Users and groups** dialog, select **Britta Simon** in the Users list.

1. Click **Select** button on **Users and groups** dialog.

1. Click **Assign** button on **Add Assignment** dialog.
	
### Test single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the ArcGIS Online tile in the Access Panel, you should get automatically signed-on to your ArcGIS Online application.
For more information about the Access Panel, see [Introduction to the Access Panel](../user-help/active-directory-saas-access-panel-introduction.md). 

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)

<!--Image references-->

[1]: ./media/arcgis-tutorial/tutorial_general_01.png
[2]: ./media/arcgis-tutorial/tutorial_general_02.png
[3]: ./media/arcgis-tutorial/tutorial_general_03.png
[4]: ./media/arcgis-tutorial/tutorial_general_04.png

[100]: ./media/arcgis-tutorial/tutorial_general_100.png

[200]: ./media/arcgis-tutorial/tutorial_general_200.png
[201]: ./media/arcgis-tutorial/tutorial_general_201.png
[202]: ./media/arcgis-tutorial/tutorial_general_202.png
[203]: ./media/arcgis-tutorial/tutorial_general_203.png

