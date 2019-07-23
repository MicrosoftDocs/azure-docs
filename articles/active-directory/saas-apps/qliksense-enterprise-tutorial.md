---
title: 'Tutorial: Azure Active Directory integration with Qlik Sense Enterprise | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Qlik Sense Enterprise.
services: active-directory
documentationCenter: na
author: jeevansd
manager: daveba
ms.reviewer: barbkess

ms.assetid: 8c27e340-2b25-47b6-bf1f-438be4c14f93
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 12/17/2018
ms.author: jeedes

ms.collection: M365-identity-device-management
---
# Tutorial: Azure Active Directory integration with Qlik Sense Enterprise

In this tutorial, you learn how to integrate Qlik Sense Enterprise with Azure Active Directory (Azure AD).
Integrating Qlik Sense Enterprise with Azure AD provides you with the following benefits:

* You can control in Azure AD who has access to Qlik Sense Enterprise.
* You can enable your users to be automatically signed-in to Qlik Sense Enterprise (Single Sign-On) with their Azure AD accounts.
* You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).
If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To configure Azure AD integration with Qlik Sense Enterprise, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get one-month trial [here](https://azure.microsoft.com/pricing/free-trial/)
* Qlik Sense Enterprise single sign-on enabled subscription

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* Qlik Sense Enterprise supports **SP** initiated SSO

## Adding Qlik Sense Enterprise from the gallery

To configure the integration of Qlik Sense Enterprise into Azure AD, you need to add Qlik Sense Enterprise from the gallery to your list of managed SaaS apps.

**To add Qlik Sense Enterprise from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon.

	![The Azure Active Directory button](common/select-azuread.png)

2. Navigate to **Enterprise Applications** and then select the **All Applications** option.

	![The Enterprise applications blade](common/enterprise-applications.png)

3. To add new application, click **New application** button on the top of dialog.

	![The New application button](common/add-new-app.png)

4. In the search box, type **Qlik Sense Enterprise**, select **Qlik Sense Enterprise** from result panel then click **Add** button to add the application.

	 ![Qlik Sense Enterprise in the results list](common/search-new-app.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with Qlik Sense Enterprise based on a test user called **Britta Simon**.
For single sign-on to work, a link relationship between an Azure AD user and the related user in Qlik Sense Enterprise needs to be established.

To configure and test Azure AD single sign-on with Qlik Sense Enterprise, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Configure Qlik Sense Enterprise Single Sign-On](#configure-qlik-sense-enterprise-single-sign-on)** - to configure the Single Sign-On settings on application side.
3. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Create Qlik Sense Enterprise test user](#create-qlik-sense-enterprise-test-user)** - to have a counterpart of Britta Simon in Qlik Sense Enterprise that is linked to the Azure AD representation of user.
6. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal.

To configure Azure AD single sign-on with Qlik Sense Enterprise, perform the following steps:

1. In the [Azure portal](https://portal.azure.com/), on the **Qlik Sense Enterprise** application integration page, select **Single sign-on**.

    ![Configure single sign-on link](common/select-sso.png)

2. On the **Select a Single sign-on method** dialog, select **SAML/WS-Fed** mode to enable single sign-on.

    ![Single sign-on select mode](common/select-saml-option.png)

3. On the **Set up Single Sign-On with SAML** page, click **Edit** icon to open **Basic SAML Configuration** dialog.

	![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, perform the following steps:

    ![Qlik Sense Enterprise Domain and URLs single sign-on information](common/sp-identifier-reply.png)

	a. In the **Sign-on URL** textbox, type a URL using the following pattern: `https://<Qlik Sense Fully Qualifed Hostname>:4443/azure/hub`

    b. In the **Identifier** textbox, type a URL using the following pattern:

    | |
    |--|
    | `https://<Qlik Sense Fully Qualifed Hostname>.qlikpoc.com`|
    | `https://<Qlik Sense Fully Qualifed Hostname>.qliksense.com`|
    | |

    c. In the **Reply URL** textbox, type a URL using the following pattern:

    `https://<Qlik Sense Fully Qualifed Hostname>:4443/samlauthn/`

	> [!NOTE]
	> These values are not real. Update these values with the actual Sign-On URL, Identifier, and Reply URL, Which are explained later in this tutorial or contact [Qlik Sense Enterprise Client support team](https://www.qlik.com/us/services/support) to get these values.

5. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Federation Metadata XML** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

### Configure Qlik Sense Enterprise Single Sign-On

1. Prepare the Federation Metadata XML file so that you can upload that to Qlik Sense server.

    > [!NOTE]
    > Before uploading the IdP metadata to the Qlik Sense server, the file needs to be edited to remove information to ensure proper operation between Azure AD and Qlik Sense server.

    ![QlikSense][qs24]

    a. Open the FederationMetaData.xml file, which you have downloaded from Azure portal in a text editor.

    b. Search for the value **RoleDescriptor**.  There are four entries (two pairs of opening and closing element tags).

    c. Delete the RoleDescriptor tags and all information in between from the file.

    d. Save the file and keep it nearby for use later in this document.

2. Navigate to the Qlik Sense Qlik Management Console (QMC) as a user who can create virtual proxy configurations.

3. In the QMC, click on the **Virtual Proxies** menu item.

    ![QlikSense][qs6]

4. At the bottom of the screen, click the **Create new** button.

    ![QlikSense][qs7]

5. The Virtual proxy edit screen appears.  On the right side of the screen is a menu for making configuration options visible.

    ![QlikSense][qs9]

6. With the Identification menu option checked, enter the identifying information for the Azure virtual proxy configuration.

    ![QlikSense][qs8]  

    a. The **Description** field is a friendly name for the virtual proxy configuration.  Enter a value for a description.

    b. The **Prefix** field identifies the virtual proxy endpoint for connecting to Qlik Sense with Azure AD Single Sign-On.  Enter a unique prefix name for this virtual proxy.

    c. **Session inactivity timeout (minutes)** is the timeout for connections through this virtual proxy.

    d. The **Session cookie header name** is the cookie name storing the session identifier for the Qlik Sense session a user receives after successful authentication.  This name must be unique.

7. Click on the Authentication menu option to make it visible.  The Authentication screen appears.

    ![QlikSense][qs10]

    a. The **Anonymous access mode** drop down determines if anonymous users may access Qlik Sense through the virtual proxy.  The default option is No anonymous user.

    b. The **Authentication method** drop-down determines the authentication scheme the virtual proxy will use.  Select SAML from the drop-down list.  More options appear as a result.

    c. In the **SAML host URI field**, input the hostname users enter to access Qlik Sense through this SAML virtual proxy.  The hostname is the uri of the Qlik Sense server.

    d. In the **SAML entity ID**, enter the same value entered for the SAML host URI field.

    e. The **SAML IdP metadata** is the file edited earlier in the **Edit Federation Metadata from Azure AD Configuration** section.  **Before uploading the IdP metadata, the file needs to be edited** to remove information to ensure proper operation between Azure AD and Qlik Sense server.  **Please refer to the instructions above if the file has yet to be edited.**  If the file has been edited click on the Browse button and select the edited metadata file to upload it to the virtual proxy configuration.

    f. Enter the attribute name or schema reference for the SAML attribute representing the **UserID** Azure AD sends to the Qlik Sense server.  Schema reference information is available in the Azure app screens post configuration.  To use the name attribute, enter `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name`.

    g. Enter the value for the **user directory** that will be attached to users when they authenticate to Qlik Sense server through Azure AD.  Hardcoded values must be surrounded by **square brackets []**.  To use an attribute sent in the Azure AD SAML assertion, enter the name of the attribute in this text box **without** square brackets.

    h. The **SAML signing algorithm** sets the service provider (in this case Qlik Sense server) certificate signing for the virtual proxy configuration.  If Qlik Sense server uses a trusted certificate generated using Microsoft Enhanced RSA and AES Cryptographic Provider, change the SAML signing algorithm to **SHA-256**.

    i. The SAML attribute mapping section allows for additional attributes like groups to be sent to Qlik Sense for use in security rules.

8. Click on the **LOAD BALANCING** menu option to make it visible.  The Load Balancing screen appears.

    ![QlikSense][qs11]

9. Click on the **Add new server node** button, select engine node or nodes Qlik Sense will send sessions to for load balancing purposes, and click the **Add** button.

    ![QlikSense][qs12]

10. Click on the Advanced menu option to make it visible. The Advanced screen appears.

    ![QlikSense][qs13]

    The Host white list identifies hostnames that are accepted when connecting to the Qlik Sense server.  **Enter the hostname users will specify when connecting to Qlik Sense server.** The hostname is the same value as the SAML host uri without the https://.

11. Click the **Apply** button.

    ![QlikSense][qs14]

12. Click OK to accept the warning message that states proxies linked to the virtual proxy will be restarted.

    ![QlikSense][qs15]

13. On the right side of the screen, the Associated items menu appears.  Click on the **Proxies** menu option.

    ![QlikSense][qs16]

14. The proxy screen appears.  Click the **Link** button at the bottom to link a proxy to the virtual proxy.

    ![QlikSense][qs17]

15. Select the proxy node that will support this virtual proxy connection and click the **Link** button.  After linking, the proxy will be listed under associated proxies.

    ![QlikSense][qs18]
  
    ![QlikSense][qs19]

16. After about five to ten seconds, the Refresh QMC message will appear.  Click the **Refresh QMC** button.

    ![QlikSense][qs20]

17. When the QMC refreshes, click on the **Virtual proxies** menu item. The new SAML virtual proxy entry is listed in the table on the screen.  Single click on the virtual proxy entry.

    ![QlikSense][qs51]

18. At the bottom of the screen, the Download SP metadata button will activate.  Click the **Download SP metadata** button to save the metadata to a file.

    ![QlikSense][qs52]

19. Open the sp metadata file.  Observe the **entityID** entry and the **AssertionConsumerService** entry.  These values are equivalent to the **Identifier**, **Sign on URL** and the **Reply URL** in the Azure AD application configuration. Paste these values in the **Qlik Sense Enterprise Domain and URLs** section in the Azure AD application configuration if they are not matching, then you should replace them in the Azure AD App configuration wizard.

    ![QlikSense][qs53]

### Create an Azure AD test user 

The objective of this section is to create a test user in the Azure portal called Britta Simon.

1. In the Azure portal, in the left pane, select **Azure Active Directory**, select **Users**, and then select **All users**.

    ![The "Users and groups" and "All users" links](common/users.png)

2. Select **New user** at the top of the screen.

    ![New user Button](common/new-user.png)

3. In the User properties, perform the following steps.

    ![The User dialog box](common/user-properties.png)

    a. In the **Name** field enter **BrittaSimon**.
  
    b. In the **User name** field type **brittasimon\@yourcompanydomain.extension**  
    For example, BrittaSimon@contoso.com

    c. Select **Show password** check box, and then write down the value that's displayed in the Password box.

    d. Click **Create**.

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Qlik Sense Enterprise.

1. In the Azure portal, select **Enterprise Applications**, select **All applications**, then select **Qlik Sense Enterprise**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, type and select **Qlik Sense Enterprise**.

	![The Qlik Sense Enterprise link in the Applications list](common/all-applications.png)

3. In the menu on the left, select **Users and groups**.

    ![The "Users and groups" link](common/users-groups-blade.png)

4. Click the **Add user** button, then select **Users and groups** in the **Add Assignment** dialog.

    ![The Add Assignment pane](common/add-assign-user.png)

5. In the **Users and groups** dialog select **Britta Simon** in the Users list, then click the **Select** button at the bottom of the screen.

6. If you are expecting any role value in the SAML assertion then in the **Select Role** dialog select the appropriate role for the user from the list, then click the **Select** button at the bottom of the screen.

7. In the **Add Assignment** dialog click the **Assign** button.

### Create Qlik Sense Enterprise test user

In this section, you create a user called Britta Simon in Qlik Sense Enterprise. Work with [Qlik Sense Enterprise support team](https://www.qlik.com/us/services/support) to add the users in the Qlik Sense Enterprise platform. Users must be created and activated before you use single sign-on.

### Test single sign-on 

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Qlik Sense Enterprise tile in the Access Panel, you should be automatically signed in to the Qlik Sense Enterprise for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional Resources

- [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is Conditional Access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

<!--Image references-->

[qs6]: ./media/qliksense-enterprise-tutorial/tutorial_qliksenseenterprise_06.png
[qs7]: ./media/qliksense-enterprise-tutorial/tutorial_qliksenseenterprise_07.png
[qs8]: ./media/qliksense-enterprise-tutorial/tutorial_qliksenseenterprise_08.png
[qs9]: ./media/qliksense-enterprise-tutorial/tutorial_qliksenseenterprise_09.png
[qs10]: ./media/qliksense-enterprise-tutorial/tutorial_qliksenseenterprise_10.png
[qs11]: ./media/qliksense-enterprise-tutorial/tutorial_qliksenseenterprise_11.png
[qs12]: ./media/qliksense-enterprise-tutorial/tutorial_qliksenseenterprise_12.png
[qs13]: ./media/qliksense-enterprise-tutorial/tutorial_qliksenseenterprise_13.png
[qs14]: ./media/qliksense-enterprise-tutorial/tutorial_qliksenseenterprise_14.png
[qs15]: ./media/qliksense-enterprise-tutorial/tutorial_qliksenseenterprise_15.png
[qs16]: ./media/qliksense-enterprise-tutorial/tutorial_qliksenseenterprise_16.png
[qs17]: ./media/qliksense-enterprise-tutorial/tutorial_qliksenseenterprise_17.png
[qs18]: ./media/qliksense-enterprise-tutorial/tutorial_qliksenseenterprise_18.png
[qs19]: ./media/qliksense-enterprise-tutorial/tutorial_qliksenseenterprise_19.png
[qs20]: ./media/qliksense-enterprise-tutorial/tutorial_qliksenseenterprise_20.png
[qs24]: ./media/qliksense-enterprise-tutorial/tutorial_qliksenseenterprise_24.png
[qs51]: ./media/qliksense-enterprise-tutorial/tutorial_qliksenseenterprise_51.png
[qs52]: ./media/qliksense-enterprise-tutorial/tutorial_qliksenseenterprise_52.png
[qs53]: ./media/qliksense-enterprise-tutorial/tutorial_qliksenseenterprise_53.png

