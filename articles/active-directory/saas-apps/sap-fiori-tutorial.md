---
title: 'Tutorial: Azure Active Directory integration with SAP Fiori | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and SAP Fiori.
services: active-directory
documentationCenter: na
author: jeevansd
manager: daveba
ms.reviewer: barbkess

ms.assetid: 77ad13bf-e56b-4063-97d0-c82a19da9d56
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 03/11/2019
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with SAP Fiori

In this tutorial, you learn how to integrate SAP Fiori with Azure Active Directory (Azure AD).

Integrating SAP Fiori with Azure AD gives you the following benefits:

* You can use Azure AD to control who has access to SAP Fiori.
* Users can be automatically signed in to SAP Fiori with their Azure AD accounts (single sign-on).
* You can manage your accounts in one central location, the Azure portal.

For more information about software as a service (SaaS) app integration with Azure AD, see [Single sign-on to applications in Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).

## Prerequisites

To configure Azure AD integration with SAP Fiori, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
* An SAP Fiori subscription with single sign-on enabled.
* SAP Fiori 7.20 or later is required.

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment and integrate SAP Fiori with Azure AD.

SAP Fiori supports the following features:

* **SP-initiated single sign-on**

## Add SAP Fiori in the Azure portal

To integrate SAP Fiori with Azure AD, you must add SAP Fiori to your list of managed SaaS apps.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the left menu, select **Azure Active Directory**.

	![The Azure Active Directory option](common/select-azuread.png)

1. Select **Enterprise applications** > **All applications**.

	![The Enterprise applications pane](common/enterprise-applications.png)

1. To add an application, select **New application**.

	![The New application option](common/add-new-app.png)

1. In the search box, enter **SAP Fiori**. In the search results, select **SAP Fiori**, and then select **Add**.

	![SAP Fiori in the results list](common/search-new-app.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with SAP Fiori based on a test user named **Britta Simon**. For single sign-on to work, you must establish a linked relationship between an Azure AD user and the related user in SAP Fiori.

To configure and test Azure AD single sign-on with SAP Fiori, you must complete the following building blocks:

| Task | Description |
| --- | --- |
| **[Configure Azure AD single sign-on](#configure-azure-ad-single-sign-on)** | Enables your users to use this feature. |
| **[Configure SAP Fiori single sign-on](#configure-sap-fiori-single-sign-on)** | Configures the single sign-on settings in the application. |
| **[Create an Azure AD test user](#create-an-azure-ad-test-user)** | Tests Azure AD single sign-on for a user named Britta Simon. |
| **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** | Enables Britta Simon to use Azure AD single sign-on. |
| **[Create an SAP Fiori test user](#create-an-sap-fiori-test-user)** | Creates a counterpart of Britta Simon in SAP Fiori that is linked to the Azure AD representation of the user. |
| **[Test single sign-on](#test-single-sign-on)** | Verifies that the configuration works. |

### Configure Azure AD single sign-on

In this section, you configure Azure AD single sign-on with SAP Fiori in the Azure portal.

1. Open a new web browser window and sign in to your SAP Fiori company site as an administrator.

1. Make sure that **http** and **https** services are active and that the relevant ports are assigned to transaction code **SMICM**.

1. Sign in to SAP Business Client for SAP system **T01**, where single sign-on is required. Then, activate HTTP Security Session Management.

	1. Go to transaction code **SICF_SESSIONS**. All relevant profile parameters with current values are shown. They look like the following example:

		```
		login/create_sso2_ticket = 2
		login/accept_sso2_ticket = 1
		login/ticketcache_entries_max = 1000
		login/ticketcache_off = 0  login/ticket_only_by_https = 0 
		icf/set_HTTPonly_flag_on_cookies = 3
		icf/user_recheck = 0  http/security_session_timeout = 1800
		http/security_context_cache_size = 2500
		rdisp/plugin_auto_logout = 1800
		rdisp/autothtime = 60
		```

		>[!NOTE]
		> Adjust the parameters based on your organization requirements. The preceding parameters are given only as an example.

	1. If necessary, adjust parameters in the instance (default) profile of the SAP system and restart the SAP system.

	1. Double-click the relevant client to enable an HTTP security session.

	    ![The Current Values of Relevant Profile Parameters page in SAP](./media/sapfiori-tutorial/tutorial-sapnetweaver-profileparameter.png)

	1. Activate the following SICF services:

		```
		/sap/public/bc/sec/saml2
		/sap/public/bc/sec/cdc_ext_service
		/sap/bc/webdynpro/sap/saml2
		/sap/bc/webdynpro/sap/sec_diag_tool (This is only to enable / disable trace)
		```

1. Go to transaction code **SAML2** in Business Client for SAP system [**T01/122**]. The configuration UI opens in a new browser window. In this example, we use Business Client for SAP system 122.

	![The SAP Fiori Business Client sign-in page](./media/sapfiori-tutorial/tutorial-sapnetweaver-sapbusinessclient.png)

1. Enter your username and password, and then select **Log on**.

	![The SAML 2.0 Configuration of ABAP System T01/122 page in SAP](./media/sapfiori-tutorial/tutorial-sapnetweaver-userpwd.png)

1. In the **Provider Name** box, replace **T01122** with **http:\//T01122**, and then select **Save**.

	> [!NOTE]
	> By default, the provider name is in the format \<sid>\<client>. Azure AD expects the name in the format \<protocol>://\<name>. We recommend that you maintain the provider name as https\://\<sid>\<client> so you can configure multiple SAP Fiori ABAP engines in Azure AD.

	![The updated provider name in the SAML 2.0 Configuration of ABAP System T01/122 page in SAP](./media/sapfiori-tutorial/tutorial-sapnetweaver-providername.png)

1. Select **Local Provider tab** > **Metadata**.

1. In the **SAML 2.0 Metadata** dialog box, download the generated metadata XML file and save it on your computer.

	![The Download Metadata link in the SAP SAML 2.0 Metadata dialog box](./media/sapfiori-tutorial/tutorial-sapnetweaver-generatesp.png)

1. In the [Azure portal](https://portal.azure.com/), in the **SAP Fiori** application integration pane, select **Single sign-on**.

    ![The Single sign-on option](common/select-sso.png)

1. In the **Select a single sign-on method** pane, select **SAML** or **SAML/WS-Fed** mode to enable single sign-on.

    ![Single sign-on select mode](common/select-saml-option.png)

1. In the **Set up Single Sign-On with SAML** pane, select **Edit** (the pencil icon) to open the **Basic SAML Configuration** pane.

	![Edit Basic SAML Configuration](common/edit-urls.png)

1. In the **Basic SAML Configuration** section, complete the following steps:

	1. Select **Upload metadata file**.

        ![The Upload metadata file option](common/upload-metadata.png)

   1. To select the metadata file, select the folder icon, and then select **Upload**.

	   ![Select the metadata file and then select the Upload button](common/browse-upload-metadata.png)

1. When the metadata file is successfully uploaded, the **Identifier** and **Reply URL** values are automatically populated in the **Basic SAML Configuration** pane. In the **Sign on URL** box, enter a URL that has the following pattern: https:\//\<your company instance of SAP Fiori\>.

	![SAP Fiori domain and URLs single sign-on information](common/sp-identifier-reply.png)

	> [!NOTE]
	> A few customers report errors related to incorrectly configured **Reply URL** values. If you see this error, you can use the following PowerShell script to set the correct Reply URL for your instance:
    >
	> ```
	> Set-AzureADServicePrincipal -ObjectId $ServicePrincipalObjectId -ReplyUrls "<Your Correct Reply URL(s)>"
	> ``` 
	> 
	> You can set the `ServicePrincipal` object ID yourself before running the script, or you can pass it here.

1. The SAP Fiori application expects the SAML assertions to be in a specific format. Configure the following claims for this application. To manage these attribute values, in the **Set up Single Sign-On with SAML** pane, select **Edit**.

	![The User attributes pane](common/edit-attribute.png)

1. In the **User Attributes & Claims** pane, configure the SAML token attributes as shown in the preceding image. Then, complete the following steps:

	1. Select **Edit** to open the **Manage user claims** pane.

	1. In the **Transformation** list, select **ExtractMailPrefix()**.

	1. In the **Parameter 1** list, select **user.userprinicipalname**.

	1. Select **Save**.

	   ![The Manage user claims pane](./media/sapfiori-tutorial/nameidattribute.png)

	   ![The Transformation section in the Manage user claims pane](./media/sapfiori-tutorial/nameidattribute1.png)


1. In the **Set up Single Sign-On with SAML** pane, in the **SAML Signing Certificate** section, select **Download** next to **Federation Metadata XML**. Select a download option based on your requirements. Save the certificate on your computer.

	![The Certificate download option](common/metadataxml.png)

1. In the **Set up SAP Fiori** section, copy the following URLs based on your requirements:

	* Login URL
	* Azure AD Identifier
	* Logout URL

	![Copy configuration URLs](common/copy-configuration-urls.png)

### Configure SAP Fiori single sign-on

1. Sign in to the SAP system and go to transaction code **SAML2**. A new browser window opens with the SAML configuration page.

1. To configure endpoints for a trusted identity provider (Azure AD), select the **Trusted Providers** tab.

	![The Trusted Providers tab in SAP](./media/sapfiori-tutorial/tutorial-sapnetweaver-samlconfig.png)

1. Select **Add**, and then select **Upload Metadata File** from the context menu.

	![The Add and Upload Metadata File options in SAP](./media/sapfiori-tutorial/tutorial-sapnetweaver-uploadmetadata.png)

1. Upload the metadata file that you downloaded in the Azure portal. Select **Next**.

	![Select the metadata file to upload in SAP](./media/sapfiori-tutorial/tutorial-sapnetweaver-metadatafile.png)

1. On the next page, in the **Alias** box, enter the alias name. For example, **aadsts**. Select **Next**.

	![The Alias box in SAP](./media/sapfiori-tutorial/tutorial-sapnetweaver-aliasname.png)

1. Make sure that the value in the **Digest Algorithm** box is **SHA-256**. Select **Next**.

	![Verify the Digest Algorithm value in SAP](./media/sapfiori-tutorial/tutorial-sapnetweaver-identityprovider.png)

1. Under **Single Sign-On Endpoints**, select **HTTP POST**, and then select **Next**.

	![Single Sign-On Endpoints options in SAP](./media/sapfiori-tutorial/tutorial-sapnetweaver-httpredirect.png)

1. Under **Single Logout Endpoints**, select **HTTP Redirect**, and then select **Next**.

	![Single Logout Endpoints options in SAP](./media/sapfiori-tutorial/tutorial-sapnetweaver-httpredirect1.png)

1. Under **Artifact Endpoints**, select **Next** to continue.

	![Artifact Endpoints options in SAP](./media/sapfiori-tutorial/tutorial-sapnetweaver-artifactendpoint.png)

1. Under **Authentication Requirements**, select **Finish**.

	![Authentication Requirements options and the Finish option in SAP](./media/sapfiori-tutorial/tutorial-sapnetweaver-authentication.png)

1. Select **Trusted Provider** > **Identity Federation** (at the bottom of the page). Select **Edit**.

	![The Trusted Provider and Identity Federation tabs in SAP](./media/sapfiori-tutorial/tutorial-sapnetweaver-trustedprovider.png)

1. Select **Add**.

	![The Add option on the Identity Federation tab](./media/sapfiori-tutorial/tutorial-sapnetweaver-addidentityprovider.png)

1. In the **Supported NameID Formats** dialog box, select **Unspecified**. Select **OK**.

	![The Supported NameID Formats dialog box and options in SAP](./media/sapfiori-tutorial/tutorial-sapnetweaver-nameid.png)

	The values for **User ID Source** and **User ID Mapping Mode** determine the link between the SAP user and the Azure AD claim.  

    **Scenario 1**: SAP user to Azure AD user mapping

	1. In SAP, under **Details of NameID Format "Unspecified"**, note the details:

		![The Details of NameID Format "Unspecified" dialog box in SAP](./media/sapfiori-tutorial/nameiddetails.png)

	1. In the Azure portal, under **User Attributes & Claims**, note the required claims from Azure AD.

		![The User Attributes & Claims dialog box in the Azure portal](./media/sapfiori-tutorial/claimsaad1.png)

    **Scenario 2**: Select the SAP user ID based on the configured email address in SU01. In this case, the email ID should be configured in SU01 for each user who requires SSO.

	1.  In SAP, under **Details of NameID Format "Unspecified"**, note the details:

	    ![The Details of NameID Format "Unspecified" dialog box in SAP](./media/sapfiori-tutorial/tutorial-sapnetweaver-nameiddetails1.png)

	1. In the Azure portal, under **User Attributes & Claims**, note the required claims from Azure AD.

	   ![The User Attributes & Claims dialog box in the Azure portal](./media/sapfiori-tutorial/claimsaad2.png)

1. Select **Save**, and then select **Enable** to enable the identity provider.

	![The Save and Enable options in SAP](./media/sapfiori-tutorial/configuration1.png)

1. Select **OK** when prompted.

	![The OK option in SAML 2.0 Configuration dialog box in SAP](./media/sapfiori-tutorial/configuration2.png)

### Create an Azure AD test user

In this section, you create a test user named Britta Simon in the Azure portal.

1. In the Azure portal, select **Azure Active Directory** > **Users** > **All users**.

    ![The Users and All users options](common/users.png)

1. Select **New user**.

    ![The New user option](common/new-user.png)

1. In the **User** pane, complete the following steps:

    1. In the **Name** box, enter **BrittaSimon**.
  
    1. In the **User name** box, enter **brittasimon\@\<your-company-domain>.\<extension>**. For example, **brittasimon\@contoso.com**.

    1. Select the **Show password** check box. Write down the value that's displayed in the **Password** box.

    1. Select **Create**.

	![The User pane](common/user-properties.png)

### Assign the Azure AD test user

In this section, you grant Britta Simon access to SAP Fiori so she can use Azure single sign-on.

1. In the Azure portal, select **Enterprise applications** > **All applications** > **SAP Fiori**.

	![The Enterprise applications pane](common/enterprise-applications.png)

1. In the applications list, select **SAP Fiori**.

	![SAP Fiori in the applications list](common/all-applications.png)

1. In the menu, select **Users and groups**.

    ![The Users and groups option](common/users-groups-blade.png)

1. Select **Add user**. Then, in the **Add assignment** pane, select **Users and groups**.

    ![The Add assignment pane](common/add-assign-user.png)

1. In the **Users and groups** pane, select **Britta Simon** in the list of users. Choose **Select**.

1. If you are expecting a role value in the SAML assertion, in the **Select role** pane, select the relevant role for the user from the list. Choose **Select**.

1. In the **Add Assignment** pane, select **Assign**.

### Create an SAP Fiori test user

In this section, you create a user named Britta Simon in SAP Fiori. Work with your in-house SAP team of experts or your organization SAP partner to add the user in the SAP Fiori platform.

### Test single sign-on

1. After the identity provider Azure AD is activated in SAP Fiori, try to access one of the following URLs to test single sign-on (you shouldn't be prompted for a username and password):

	* https:\//\<sapurl\>/sap/bc/bsp/sap/it00/default.htm
	* https:\//\<sapurl\>/sap/bc/bsp/sap/it00/default.htm

	> [!NOTE]
	> Replace *sapurl* with the actual SAP host name.

1. The test URL should take you to the following test application page in SAP. If the page opens, Azure AD single sign-on is successfully set up.

	![The standard test application page in SAP](./media/sapfiori-tutorial/testingsso.png)

1. If you are prompted for a username and password, enable trace to help diagnose the issue. Use the following URL for the trace: https:\//\<sapurl\>/sap/bc/webdynpro/sap/sec_diag_tool?sap-client=122&sap-language=EN#.

## Next steps

To learn more, review these articles:

- [List of tutorials for integrating SaaS apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)
- [Single sign-on to applications in Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)
- [What is Conditional Access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)
