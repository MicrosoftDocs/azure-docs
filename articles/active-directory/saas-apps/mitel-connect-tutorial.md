---
title: 'Tutorial: Azure Active Directory integration with Mitel Connect | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Mitel Connect.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 07/31/2020
ms.author: jeedes
---
# Tutorial: Azure Active Directory integration with Mitel MiCloud Connect or CloudLink Platform

In this tutorial, you will learn how to use the Mitel Connect app to integrate Azure Active Directory (Azure AD) with Mitel MiCloud Connect or CloudLink Platform. The Mitel Connect app is available in the Azure Gallery. Integrating Azure AD with MiCloud Connect or CloudLink Platform provides you with the following benefits:

* You can control users' access to MiCloud Connect apps and to CloudLink apps in Azure AD by using their enterprise credentials.
* You can enable users on your account to be automatically signed in to MiCloud Connect or CloudLink (single sign-on) by using their Azure AD accounts.

For details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](../manage-apps/what-is-single-sign-on.md).

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin the integration of Azure AD with Mitel MiCloud Connect or CloudLink Platform.

## Prerequisites

To configure Azure AD integration with MiCloud Connect, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get a [free account](https://azure.microsoft.com/free/).
* A Mitel MiCloud Connect account or Mitel CloudLink account, depending on the application you want to configure.

## Scenario description

In this tutorial, you'll configure and test Azure AD single sign-on (SSO).

* Mitel Connect supports **SP** initiated SSO
* Once you configure Mitel Connect you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-any-app).

## Add Mitel Connect from the gallery

To configure the integration of Mitel Connect into Azure AD, you need to add Mitel Connect from the gallery to your list of managed SaaS apps in the Azure portal.

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, select **Azure Active Directory**.

	![The Azure Active Directory button](common/select-azuread.png)

2. Select **Enterprise Applications**, and then select **All Applications**.

	![The Enterprise applications blade](common/enterprise-applications.png)

3. Select **New application**.

	![The New application button](common/add-new-app.png)

4. Type **Mitel Connect** in the search field, select **Mitel Connect** from results panel, and then select **Add**.

	 ![Mitel Connect in the results list](common/search-new-app.png)

## Configure and test Azure AD single sign-on

In this section, you'll configure and test Azure AD SSO with MiCloud Connect or CloudLink Platform based on a test user named **_Britta Simon_**. For single sign-on to work, a link must be established between the user in Azure AD portal and the corresponding user on the Mitel platform. Refer to the following sections for information about configuring and testing Azure AD SSO with MiCloud Connect or CloudLink Platform.
* Configure and test Azure AD SSO with MiCloud Connect
* Configure and test Azure AD SSO with CloudLink Platform

## Configure and test Azure AD SSO with MiCloud Connect

To configure and test Azure AD single sign-on with MiCloud Connect:

1. **[Configure MiCloud Connect for SSO with Azure AD](#configure-micloud-connect-for-sso-with-azure-ad)** - to enable your users to use this feature and to configure the SSO settings on the application side.
2. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
3. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
4. **[Create a Mitel MiCloud Connect test user](#create-a-mitel-micloud-connect-test-user)** - to have a counterpart of Britta Simon on your MiCloud Connect account that is linked to the Azure AD representation of the user.
5. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

## Configure MiCloud Connect for SSO with Azure AD

In this section, you'll enable Azure AD single sign-on for MiCloud Connect in the Azure portal and configure your MiCloud Connect account to allow SSO using Azure AD.

To configure MiCloud Connect with SSO for Azure AD, it is easiest to open the Azure portal and the Mitel Account portal side by side. You'll need to copy some information from the Azure portal to the Mitel Account portal and some from the Mitel Account portal to the Azure portal.


1. To open the configuration page in the [Azure portal](https://portal.azure.com/):

    1. On the **Mitel Connect** application integration page, select **Single sign-on**.

       ![Configure single sign-on link](common/select-sso.png)

    1. In the **Select a Single sign-on method** dialog box, select **SAML**.
    
       ![Single sign-on select mode](common/select-saml-option.png)
	
	   The SAML-based sign-on page is displayed.

2. To open the configuration dialog box in the Mitel Account portal:

    1. On the **Phone System** menu, select **Add-On Features**.

    1. To the right of **Single Sign-On**, select **Activate** or **Settings**.
    
    The Connect Single Sign-On Settings dialog box appears.
	
3. Select the **Enable Single Sign-On** check box.
    
    ![Screenshot that shows the Mitel Connect Single Sign-On Settings page, with the Enable Single Sign-On check box selected.](./media/mitel-connect-tutorial/mitel-connect-enable.png)

4. In the Azure portal, select the **Edit** icon in the **Basic SAML Configuration** section.
   
    ![Screenshot shows the Set up Single Sign-On with SAML page with the edit icon selected.](common/edit-urls.png)

    The Basic SAML Configuration dialog box appears.

5.  Copy the URL from the **Mitel Identifier (Entity ID)** field in the Mitel Account portal and paste it into the **Identifier (Entity ID)** field in the Azure portal.

6. Copy the URL from the **Reply URL (Assertion Consumer Service URL)** field in the Mitel Account portal and paste it into the **Reply URL (Assertion Consumer Service URL)** field in the Azure portal.

   ![Screenshot shows Basic SAML Configuration in the Azure portal and the Set Up Identity Provider section in the Mitel Account portal with lines indicating the relationship between them.](./media/mitel-connect-tutorial/mitel-azure-basic-configuration.png)

7. In the **Sign-on URL** text box, type one of the following URLs:

    1. **https://portal.shoretelsky.com** - to use the Mitel Account portal as your default Mitel application
    1. **https://teamwork.shoretel.com** - to use Teamwork as your default Mitel application

    > [!NOTE]
    > The default Mitel application is the application that is accessed when a user selects the Mitel Connect tile in the Access Panel. This is also the application accessed when doing a test setup from Azure AD.

8. Select **Save** in the **Basic SAML Configuration** dialog box in the Azure portal.

9. In the **SAML Signing Certificate** section on the **SAML-based sign-on** page in the Azure portal, select **Download** next to **Certificate (Base64)** to download the **Signing Certificate** and save it to your computer.

    ![Screenshot shows the SAML Signing Certificate pane where you can download a certificate.](./media/mitel-connect-tutorial/azure-signing-certificate.png)

10. Open the Signing Certificate file in a text editor, copy all data in the file, and then paste the data in the **Signing Certificate** field in the Mitel Account portal. 

      ![Screenshot shows the Signing Certificate field.](./media/mitel-connect-tutorial/mitel-connect-signing-certificate.png)

11. In the **Setup Mitel Connect** section on the **SAML-based sign-on** page of the Azure portal:

     1. Copy the URL from the **Login URL** field and paste it into the **Sign-in URL** field in the Mitel Account portal.

     1. Copy the URL from the **Azure AD Identifier** field and paste it into the **Entity ID** field in the Mitel Account portal.
         
         ![Screenshot shows the relationship between the SAML-based sign-on page of the Azure portal and the Mitel Account portal.](./media/mitel-connect-tutorial/mitel-azure-set-up-connect.png)

12. Select **Save** on the **Connect Single Sign-On Settings** dialog box in the Mitel Account portal.

### Create an Azure AD test user 

In this section, you'll create a test user named Britta Simon in the Azure portal.

1. In the Azure portal, in the left pane, select **Azure Active Directory**, select **Users**, and then select **All users**.

    ![The "Users and groups" and "All users" links](common/users.png)

2. Select **New user** at the top of the screen.

    ![New user Button](common/new-user.png)

3. In the User properties dialog box, do the following steps:

    ![The User dialog box](common/user-properties.png)

    1. In the **Name** field, type **BrittaSimon**.
  
    1. In the **User name** field, type brittasimon@\<yourcompanydomain\>.\<extension\>.  For example, BrittaSimon@contoso.com.

    1. Select the **Show password** check box, and then write down the value that is displayed in the **Password** box.

    1. Select **Create**.

### Assign the Azure AD test user

In this section, you'll enable Britta Simon to use Azure single sign-on by granting access to Mitel Connect.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **Mitel Connect**.

	![The Mitel Connect link in the Applications list](common/all-applications.png)

3. In the menu on the left, select **Users and groups**.

    ![The "Users and groups" link](common/users-groups-blade.png)

4. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog box.

    ![The Add Assignment pane](common/add-assign-user.png)

5. In the **Users and groups** dialog box, select **Britta Simon** in the **Users** list, then choose **Select** at the bottom of the screen.

6. If you are expecting any role value in the SAML assertion, select the appropriate role for the user from the list in the **Select Role** dialog box, and then choose **Select** at the bottom of the screen.

7. In the **Add Assignment** dialog box, select **Assign**.

### Create a Mitel MiCloud Connect test user

In this section, you create a user named Britta Simon on your MiCloud Connect account. Users must be created and activated before using single sign-on.

For details about adding users in the Mitel Account portal, see the [Adding a User](https://oneview.mitel.com/s/article/Adding-a-User-092815) article in the Mitel Knowledge Base.

Create a user on your MiCloud Connect account with the following details:

* **Name:** Britta Simon
* **Business Email Address:** `brittasimon@<yourcompanydomain>.<extension>`   
  (Example: [brittasimon@contoso.com](mailto:brittasimon@contoso.com))
* **Username:** `brittasimon@<yourcompanydomain>.<extension>`  
  (Example: [brittasimon@contoso.com](mailto:brittasimon@contoso.com); the user’s username is typically the same as the user’s business email address)

> [!NOTE]
> The user’s MiCloud Connect username must be identical to the user’s email address in Azure.

### Test single sign-on

In this section, you'll test your Azure AD single sign-on configuration using the Access Panel.

When you select the Mitel Connect tile in the Access Panel, you should be automatically redirected to sign in to the MiCloud Connect application you configured as your default in the **Sign-on URL** field. For more information about the Access Panel, see [Introduction to the Access Panel](../user-help/my-apps-portal-end-user-access.md).

## Configure and test Azure AD SSO with CloudLink Platform

This section describes how to enable Azure AD SSO for CloudLink platform in the Azure portal and how to configure your CloudLink platform account to allow single sign-on using Azure AD.

To configure CloudLink platform with single sign-on for Azure AD, it is recommended that you  open the Azure portal and the CloudLink Accounts portal side by side as you will need to copy some information from the Azure portal to the CloudLink Accounts portal and vice versa.

1. To open the configuration page in the [Azure portal](https://portal.azure.com/):

    1. On the **Mitel Connect** application integration page, select **Single sign-on**.

       ![Configure single sign-on link](common/select-sso.png)

    1. In the **Select a Single sign-on method** dialog box, select **SAML**.

       ![Single sign-on select mode](common/select-saml-option.png)
	
	   The **SAML-based Sign-on** page opens, displaying the **Basic SAML Configuration** section.

       ![Screenshot shows the SAML-based Sign-on page with Basic SAML Configuration.](./media/mitel-connect-tutorial/mitel-azure-saml-settings.png)

2. To access the **Azure AD Single Sign On** configuration panel in the CloudLink Accounts portal:

    1. Go to the **Account Information** page of the customer account with which you want to enable the integration.

    1. In the **Integrations** section, select **+ Add new**. A pop-up screen displays the **Integrations** panel.

    1. Select the **3rd party** tab. A list of supported third-party applications is displayed. Select the **Add** button associated with **Azure AD Single Sign On**,  and select **Done**.

       ![Screenshot shows the Integrations page where you can add Azure A D Single Sign-On.](./media/mitel-connect-tutorial/mitel-cloudlink-integrations.png)

       The **Azure AD Single Sign On** is enabled for the customer account and is added to the **Integrations** section of the **Account Information** page.   

   1. Select **Complete Setup**.
    
      ![Screenshot shows the Complete Setup option for Azure A D Single Sign-On.](./media/mitel-connect-tutorial/mitel-cloudlink-complete-setup.png)
      
      The **Azure AD Single Sign On** configuration panel opens.
      
       ![Screenshot shows Azure A D Single Sign-On configuration.](./media/mitel-connect-tutorial/mitel-cloudlink-sso-setup.png)
       
       Mitel recommends that the **Enable Mitel Credentials (Optional)** check box in the **Optional Mitel credentials** section is not selected. Select this check box only if you want the user to sign in to the CloudLink application using the Mitel credentials in addition to the single sign-on option.

3. In the Azure portal, from the **SAML-based Sign-on** page, select the **Edit** icon  in the **Basic SAML Configuration** section. The **Basic SAML Configuration** panel opens.

    ![Screenshot shows the Basic SAML Configuration pane with the Edit icon selected.](./media/mitel-connect-tutorial/mitel-azure-saml-basic.png)
 
 4. Copy the URL from the **Mitel Identifier (Entity ID)** field in the CloudLink Accounts portal and paste it into the **Identifier (Entity ID)** field in the Azure portal.

 5. Copy the URL from the **Reply URL (Assertion Consumer Service URL)** field in the CloudLink Accounts portal and paste it into the **Reply URL (Assertion Consumer Service URL)** field in the Azure portal.  
    
    ![Screenshot shows the relation between pages in the CloudLink Accounts portal and the Azure portal.](./media/mitel-connect-tutorial/mitel-cloudlink-saml-mapping.png) 

 6. In the **Sign-on URL** text box, type the URL `https://accounts.mitel.io` to use the CloudLink Accounts portal as your default Mitel application.
     
     ![Screenshot shows the Sign on U R L text box.](./media/mitel-connect-tutorial/mitel-cloudlink-sign-on-url.png)
  
     > [!NOTE]
     > The default Mitel application is the application that opens when a user selects the Mitel Connect tile in the Access Panel. This is also the application accessed when the user configures a test setup from Azure AD.

7. Select **Save** in the **Basic SAML Configuration** dialog box.

8. In the **SAML Signing Certificate** section on the **SAML-based sign-on** page in the Azure portal, select **Download** beside **Certificate (Base64)** to download the **Signing Certificate**. Save the certificate on your computer.
  
    ![Screenshot shows the SAML Signing Certificate section where you can download a Base64 certificate.](./media/mitel-connect-tutorial/mitel-cloudlink-save-certificate.png)

9. Open the Signing Certificate file in a text editor, copy all data in the file, and then paste the data into the **Signing Certificate** field in the CloudLink Accounts portal.  

    > [!NOTE]
    > If you have more than one certificate, we recommend that you paste them one after the other. 
       
    ![Screenshot shows Step two of the procedure where you fill in values from your Azure A D integration.](./media/mitel-connect-tutorial/mitel-cloudlink-enter-certificate.png)

10. In the **Set up Mitel Connect** section on the **SAML-based sign-on** page of the Azure portal:

     1. Copy the URL from the **Login URL** field and paste it into the **Sign-in URL** field in the CloudLink Accounts portal.

     1. Copy the URL from the **Azure AD Identifier** field and paste it into the **IDP Identifier (Entity ID)** field in the CloudLink Accounts portal.
     
        ![Screenshot shows the source for the values described here in Mintel Connect.](./media/mitel-connect-tutorial/mitel-cloudlink-copy-settings.png)

11. Select **Save** on the **Azure AD Single Sign On** panel in the CloudLink Accounts portal.

### Create an Azure AD test user 

In this section, you'll create a test user named Britta Simon in the Azure portal.

1. In the Azure portal, in the left pane, select **Azure Active Directory**, select **Users**, and then select **All users**.

    ![The "Users and groups" and "All users" links](common/users.png)

2. Select **New user** at the top of the screen.

    ![New user Button](common/new-user.png)

3. In the User properties dialog box, do the following steps:

    ![The User dialog box](common/user-properties.png)

    1. In the **Name** field, type **BrittaSimon**.
  
    1. In the **User name** field, type brittasimon@\<yourcompanydomain\>.\<extension\>.  For example, BrittaSimon@contoso.com.

    1. Select the **Show password** check box, and then write down the value that is displayed in the **Password** box.

    1. Select **Create**.

### Assign the Azure AD test user

In this section, you'll enable Britta Simon to use Azure single sign-on by granting access to Mitel Connect.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **Mitel Connect**.

	![The Mitel Connect link in the Applications list](common/all-applications.png)

3. In the menu on the left, select **Users and groups**.

    ![The "Users and groups" link](common/users-groups-blade.png)

4. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog box.

    ![The Add Assignment pane](common/add-assign-user.png)

5. In the **Users and groups** dialog box, select **Britta Simon** in the **Users** list, then choose **Select** at the bottom of the screen.

6. If you are expecting any role value in the SAML assertion, select the appropriate role for the user from the list in the **Select Role** dialog box, and then choose **Select** at the bottom of the screen.

7. In the **Add Assignment** dialog box, select **Assign**.

### Create a CloudLink test user

This section describes how to create a test user named **_Britta Simon_** on your CloudLink platform. Users must be created and activated before they can use single sign-on.

For details about adding users in the CloudLink Accounts portal, see **_Managing Users_** in the [CloudLink Accounts documentation](https://www.mitel.com/document-center/technology/cloudlink/all-releases/en/cloudlink-accounts-html).

Create a user on your CloudLink Accounts portal with the following details:

* Name: Britta Simon
* First Name: Britta
* Last Name: Simon
* Email: BrittaSimon@contoso.com

> [!NOTE]
> The user's CloudLink email address must be identical to the **User Principal Name** in the Azure portal.

### Test single sign-on

In this section, you'll test your Azure AD SSO configuration using the Access Panel.

When you select the Mitel Connect tile in the Access Panel, you will be automatically redirected to sign in to the CloudLink application you configured as your default in the **Sign-on URL** field. For more information about the Access Panel, see [Introduction to the Access Panel](../user-help/my-apps-portal-end-user-access.md).

## Additional resources

- [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](./tutorial-list.md)

- [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)

- [What is Conditional Access in Azure Active Directory?](../conditional-access/overview.md)