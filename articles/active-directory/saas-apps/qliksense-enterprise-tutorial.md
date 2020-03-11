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
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: tutorial
ms.date: 03/03/2020
ms.author: jeedes

ms.collection: M365-identity-device-management
---

# Tutorial: Integrate Qlik Sense Enterprise with Azure Active Directory

In this tutorial, you'll learn how to integrate Qlik Sense Enterprise with Azure Active Directory (Azure AD). When you integrate Qlik Sense Enterprise with Azure AD, you can:

* Control in Azure AD who has access to Qlik Sense Enterprise.
* Enable your users to be automatically signed-in to Qlik Sense Enterprise with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

To learn more about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](/azure/active-directory/manage-apps/what-is-single-sign-on).

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get one-month free trial [here](https://azure.microsoft.com/pricing/free-trial/).
* Qlik Sense Enterprise single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment. 
* Qlik Sense Enterprise supports **SP** initiated SSO.
* Qlik Sense Enterprise supports **just-in-time provisioning**

* Once you configure Qlik Sense Enterprise you can enforce Session control, which protect exfiltration and infiltration of your organization's sensitive data in real-time. Session control extend from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](https://docs.microsoft.com/cloud-app-security/proxy-deployment-aad)

## Adding Qlik Sense Enterprise from the gallery

To configure the integration of Qlik Sense Enterprise into Azure AD, you need to add Qlik Sense Enterprise from the gallery to your list of managed SaaS apps.

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Qlik Sense Enterprise** in the search box.
1. Select **Qlik Sense Enterprise** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD single sign-on

Configure and test Azure AD SSO with Qlik Sense Enterprise using a test user called **Britta Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Qlik Sense Enterprise.

To configure and test Azure AD SSO with Qlik Sense Enterprise, complete the following building blocks:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    * **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
    * **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
1. **[Configure Qlik Sense Enterprise SSO](#configure-qlik-sense-enterprise-sso)** - to configure the Single Sign-On settings on application side.
    * **[Create Qlik Sense Enterprise test user](#create-qlik-sense-enterprise-test-user)** - to have a counterpart of Britta Simon in Qlik Sense Enterprise that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

### Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the [Azure portal](https://portal.azure.com/), on the **Qlik Sense Enterprise** application integration page, find the **Manage** section and select **Single sign-on**.
1. On the **Select a Single sign-on method** page, select **SAML**.
1. On the **Set up Single Sign-On with SAML** page, click the edit/pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** page, enter the values for the following fields:

    a. In the **Sign-on URL** textbox, type a URL using the following pattern: `https://<Fully Qualified Domain Name>:443{/virtualproxyprefix}/hub`

    b. In the **Identifier** textbox, type a URL using one of the following pattern:

    | |
    |--|
    | `https://<Fully Qualified Domain Name>.qlikpoc.com`|
    | `https://<Fully Qualified Domain Name>.qliksense.com`|
    | |

    c. In the **Reply URL** textbox, type a URL using the following pattern:

    `https://<Fully Qualified Domain Name>:443{/virtualproxyprefix}/samlauthn/`

    > [!NOTE]
    > These values are not real. Update these values with the actual Sign-On URL, Identifier, and Reply URL, Which are explained later in this tutorial or contact [Qlik Sense Enterprise Client support team](https://www.qlik.com/us/services/support) to get these values. The default port for the URLs is 443 but you can customize it per your Organization need.

1. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, find **Federation Metadata XML** from the given options as per your requirement and save it on your computer.

    ![The Certificate download link](common/metadataxml.png)

### Create an Azure AD test user

In this section, you'll create a test user in the Azure portal called Britta Simon.

1. From the left pane in the Azure portal, select **Azure Active Directory**, select **Users**, and then select **All users**.
1. Select **New user** at the top of the screen.
1. In the **User** properties, follow these steps:
   1. In the **Name** field, enter `Britta Simon`.  
   1. In the **User name** field, enter the username@companydomain.extension. For example, `BrittaSimon@contoso.com`.
   1. Select the **Show password** check box, and then write down the value that's displayed in the **Password** box.
   1. Click **Create**.

### Assign the Azure AD test user

In this section, you'll enable Britta Simon to use Azure single sign-on by granting access to Qlik Sense Enterprise.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Qlik Sense Enterprise**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.

   ![The "Users and groups" link](common/users-groups-blade.png)

1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.

    ![The Add User link](common/add-assign-user.png)

1. In the **Users and groups** dialog, select **Britta Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Qlik Sense Enterprise SSO

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

    The Host allow list identifies hostnames that are accepted when connecting to the Qlik Sense server.  **Enter the hostname users will specify when connecting to Qlik Sense server.** The hostname is the same value as the SAML host uri without the https://.

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

### Create Qlik Sense Enterprise test user

Qlik Sense Enterprise supports **just-in-time provisioning**, Users automatically added to the 'USERS' repository of Qlik Sense Enterprise as they use the SSO feature. In addition, clients can use the QMC and create a UDC (User Directory Connector) for pre-populating users in Qlik Sense Enterprise from their LDAP of choice such as Active Directory, and others.

### Test SSO

When you select the Qlik Sense Enterprise tile in the Access Panel, you should be automatically signed in to the Qlik Sense Enterprise for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional resources

- [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory?](/azure/active-directory/manage-apps/what-is-single-sign-on)

- [What is Conditional Access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

- [What is session control in Microsoft Cloud App Security?](https://docs.microsoft.com/cloud-app-security/proxy-intro-aad)

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
