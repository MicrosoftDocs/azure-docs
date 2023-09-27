---
title: 'Tutorial: Microsoft Entra SSO integration with Qlik Sense Enterprise Client-Managed'
description: Learn how to configure single sign-on between Microsoft Entra ID and Qlik Sense Enterprise Client-Managed.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 11/21/2022
ms.author: jeedes
---

# Tutorial: Microsoft Entra SSO integration with Qlik Sense Enterprise Client-Managed

In this tutorial, you'll learn how to integrate Qlik Sense Enterprise Client-Managed with Microsoft Entra ID. When you integrate Qlik Sense Enterprise Client-Managed with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to Qlik Sense Enterprise.
* Enable your users to be automatically signed-in to Qlik Sense Enterprise with their Microsoft Entra accounts.
* Manage your accounts in one central location.

Note that there are two versions of Qlik Sense Enterprise. While this tutorial covers integration with the client-managed releases, a different process is required for Qlik Sense Enterprise SaaS (Qlik Cloud version).

## Prerequisites

To get started, you need the following items:

* A Microsoft Entra subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Qlik Sense Enterprise single sign-on (SSO) enabled subscription.
* Along with Cloud Application Administrator, Application Administrator can also add or manage applications in Microsoft Entra ID.
For more information, see [Azure built-in roles](../roles/permissions-reference.md).

## Scenario description

In this tutorial, you configure and test Microsoft Entra SSO in a test environment. 
* Qlik Sense Enterprise supports **SP** initiated SSO.
* Qlik Sense Enterprise supports **just-in-time provisioning**

## Add Qlik Sense Enterprise from the gallery

To configure the integration of Qlik Sense Enterprise into Microsoft Entra ID, you need to add Qlik Sense Enterprise from the gallery to your list of managed SaaS apps.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the **Add from the gallery** section, type **Qlik Sense Enterprise** in the search box.
1. Select **Qlik Sense Enterprise** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

<a name='configure-and-test-azure-ad-sso-for-qlik-sense-enterprise'></a>

## Configure and test Microsoft Entra SSO for Qlik Sense Enterprise

Configure and test Microsoft Entra SSO with Qlik Sense Enterprise using a test user called **Britta Simon**. For SSO to work, you need to establish a link relationship between a Microsoft Entra user and the related user in Qlik Sense Enterprise.

To configure and test Microsoft Entra SSO with Qlik Sense Enterprise, perform the following steps:

1. **[Configure Microsoft Entra SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create a Microsoft Entra test user](#create-an-azure-ad-test-user)** - to test Microsoft Entra single sign-on with Britta Simon.
    1. **[Assign the Microsoft Entra test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Microsoft Entra single sign-on.
1. **[Configure Qlik Sense Enterprise SSO](#configure-qlik-sense-enterprise-sso)** - to configure the Single Sign-On settings on application side.
    1. **[Create Qlik Sense Enterprise test user](#create-qlik-sense-enterprise-test-user)** - to have a counterpart of Britta Simon in Qlik Sense Enterprise that is linked to the Microsoft Entra representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

Follow these steps to enable Microsoft Entra SSO.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Qlik Sense Enterprise** application integration page, find the **Manage** section and select **Single sign-on**.
1. On the **Select a Single sign-on method** page, select **SAML**.
1. On the **Set up Single Sign-On with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

    ![Screenshot shows to edit Basic S A M L Configuration.](common/edit-urls.png "Basic Configuration")

1. On the **Basic SAML Configuration** section, perform the following steps:

    a. In the **Identifier** textbox, type a URL using one of the following patterns:

    | Identifier |
    |-------------|
    | `https://<Fully Qualified Domain Name>.qlikpoc.com` |
    | `https://<Fully Qualified Domain Name>.qliksense.com` |

    b. In the **Reply URL** textbox, type a URL using the following pattern:

    `https://<Fully Qualified Domain Name>:443{/virtualproxyprefix}/samlauthn/`

    c. In the **Sign on URL** textbox, type a URL using the following pattern: 
    `https://<Fully Qualified Domain Name>:443{/virtualproxyprefix}/hub`

    > [!NOTE]
    > These values are not real. Update these values with the actual Identifier, Reply URL and Sign on URL which are explained later in this tutorial or contact [Qlik Sense Enterprise Client support team](https://www.qlik.com/us/services/support) to get these values. The default port for the URLs is 443 but you can customize it per your Organization need.

1. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, find **Federation Metadata XML** from the given options as per your requirement and save it on your computer.

    ![Screenshot shows the Certificate download link.](common/metadataxml.png "Certificate")

<a name='create-an-azure-ad-test-user'></a>

### Create a Microsoft Entra test user

In this section, you'll create a test user called Britta Simon.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [User Administrator](../roles/permissions-reference.md#user-administrator).
1. Browse to **Identity** > **Users** > **All users**.
1. Select **New user** > **Create new user**, at the top of the screen.
1. In the **User** properties, follow these steps:
   1. In the **Display name** field, enter `B.Simon`.  
   1. In the **User principal name** field, enter the username@companydomain.extension. For example, `B.Simon@contoso.com`.
   1. Select the **Show password** check box, and then write down the value that's displayed in the **Password** box.
   1. Select **Review + create**.
1. Select **Create**.

<a name='assign-the-azure-ad-test-user'></a>

### Assign the Microsoft Entra test user

In this section, you'll enable Britta Simon to use Azure single sign-on by granting access to Qlik Sense Enterprise.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Qlik Sense Enterprise**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **Britta Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Qlik Sense Enterprise SSO

1. Prepare the Federation Metadata XML file so that you can upload that to Qlik Sense server.

    > [!NOTE]
    > Before uploading the IdP metadata to the Qlik Sense server, the file needs to be edited to remove information to ensure proper operation between Microsoft Entra ID and Qlik Sense server.

    ![Screenshot shows a Visual Studio Code window with the Federation Metadata X M L file.][qs24]

    a. Open the FederationMetaData.xml file, which you have downloaded from Azure portal in a text editor.

    b. Search for the value **RoleDescriptor**.  There are four entries (two pairs of opening and closing element tags).

    c. Delete the RoleDescriptor tags and all information in between from the file.

    d. Save the file and keep it nearby for use later in this document.

2. Navigate to the Qlik Sense Qlik Management Console (QMC) as a user who can create virtual proxy configurations.

3. In the QMC, click on the **Virtual Proxies** menu item.

    ![Screenshot shows Virtual proxies selected from CONFIGURE SYSTEM.][qs6]

4. At the bottom of the screen, click the **Create new** button.

    ![Screenshot shows the Create new option.][qs7]

5. The Virtual proxy edit screen appears.  On the right side of the screen is a menu for making configuration options visible.

    ![Screenshot shows Identification selected from Properties.][qs9]

6. With the Identification menu option checked, enter the identifying information for the Azure virtual proxy configuration.

    ![Screenshot shows Edit virtual proxy Identification section where you can enter the values described.][qs8]  

    a. The **Description** field is a friendly name for the virtual proxy configuration.  Enter a value for a description.

    b. The **Prefix** field identifies the virtual proxy endpoint for connecting to Qlik Sense with Microsoft Entra Single Sign-On.  Enter a unique prefix name for this virtual proxy.

    c. **Session inactivity timeout (minutes)** is the timeout for connections through this virtual proxy.

    d. The **Session cookie header name** is the cookie name storing the session identifier for the Qlik Sense session a user receives after successful authentication.  This name must be unique.

7. Click on the Authentication menu option to make it visible.  The Authentication screen appears.

    ![Screenshot shows Edit virtual proxy Authentication section where you can enter the values described.][qs10]

    a. The **Anonymous access mode** dropdown list determines if anonymous users may access Qlik Sense through the virtual proxy. The default option is **No anonymous user**.

    b. The **Authentication method** dropdown list determines the authentication scheme the virtual proxy will use. Select SAML from the dropdown list. More options appear as a result.

    c. In the **SAML host URI field**, input the host name that users enter to access Qlik Sense through this SAML virtual proxy. The host name is the URI of the Qlik Sense server.

    d. In the **SAML entity ID**, enter the same value entered for the SAML host URI field.

    e. The **SAML IdP metadata** is the file edited earlier in the **Edit Federation Metadata from Microsoft Entra Configuration** section.  **Before uploading the IdP metadata, the file needs to be edited** to remove information to ensure proper operation between Microsoft Entra ID and Qlik Sense server.  **Please refer to the instructions above if the file has yet to be edited.**  If the file has been edited click on the Browse button and select the edited metadata file to upload it to the virtual proxy configuration.

    f. Enter the attribute name or schema reference for the SAML attribute representing the **UserID** Microsoft Entra ID sends to the Qlik Sense server.  Schema reference information is available in the Azure app screens post configuration.  To use the name attribute, enter `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name`.

    g. Enter the value for the **user directory** that will be attached to users when they authenticate to Qlik Sense server through Microsoft Entra ID.  Hardcoded values must be surrounded by **square brackets []**.  To use an attribute sent in the Microsoft Entra SAML assertion, enter the name of the attribute in this text box **without** square brackets.

    h. The **SAML signing algorithm** sets the service provider (in this case Qlik Sense server) certificate signing for the virtual proxy configuration.  If Qlik Sense server uses a trusted certificate generated using Microsoft Enhanced RSA and AES Cryptographic Provider, change the SAML signing algorithm to **SHA-256**.

    i. The SAML attribute mapping section allows for additional attributes like groups to be sent to Qlik Sense for use in security rules.

8. Click on the **LOAD BALANCING** menu option to make it visible.  The Load Balancing screen appears.

    ![Screenshot shows the Virtual proxy edit screen for LOAD BALANCING where you can select Add new server node.][qs11]

9. Click on the **Add new server node** button, select engine node or nodes Qlik Sense will send sessions to for load balancing purposes, and click the **Add** button.

    ![Screenshot shows the Add server nodes to load balance on dialog button where you can Add servers.][qs12]

10. Click on the Advanced menu option to make it visible. The Advanced screen appears.

    ![Screenshot shows the Edit virtual proxy Advanced screen.][qs13]

    The Host allow list identifies host names that are accepted when connecting to the Qlik Sense server. **Enter the host name that users will specify when connecting to Qlik Sense server.** The host name is the same value as the SAML host URI without the `https://`.

11. Click the **Apply** button.

    ![Screenshot shows the Apply button.][qs14]

12. Click OK to accept the warning message that states proxies linked to the virtual proxy will be restarted.

    ![Screenshot shows the Apply changes to virtual proxy confirmation message.][qs15]

13. On the right side of the screen, the Associated items menu appears.  Click on the **Proxies** menu option.

    ![Screenshot shows Proxies selected from Associated items.][qs16]

14. The proxy screen appears.  Click the **Link** button at the bottom to link a proxy to the virtual proxy.

    ![Screenshot shows the Link button.][qs17]

15. Select the proxy node that will support this virtual proxy connection and click the **Link** button.  After linking, the proxy will be listed under associated proxies.

    ![Screenshot shows Select proxy services.][qs18]
  
    ![Screenshot shows Associated proxies in the Virtual proxy associated items dialog box.][qs19]

16. After about five to ten seconds, the Refresh QMC message will appear.  Click the **Refresh QMC** button.

    ![Screenshot shows the message Your session has ended.][qs20]

17. When the QMC refreshes, click on the **Virtual proxies** menu item. The new SAML virtual proxy entry is listed in the table on the screen.  Single click on the virtual proxy entry.

    ![Screenshot shows Virtual proxies with a single entry.][qs51]

18. At the bottom of the screen, the Download SP metadata button will activate.  Click the **Download SP metadata** button to save the metadata to a file.

    ![Screenshot shows the Download S P metadata button.][qs52]

19. Open the sp metadata file.  Observe the **entityID** entry and the **AssertionConsumerService** entry.  These values are equivalent to the **Identifier**, **Sign on URL** and the **Reply URL** in the Microsoft Entra application configuration. Paste these values in the **Qlik Sense Enterprise Domain and URLs** section in the Microsoft Entra application configuration if they are not matching, then you should replace them in the Microsoft Entra App configuration wizard.

    ![Screenshot shows a plain text editor with a EntityDescriptor with entityID and AssertionConsumerService called out.][qs53]

### Create Qlik Sense Enterprise test user

Qlik Sense Enterprise supports **just-in-time provisioning**, Users automatically added to the 'USERS' repository of Qlik Sense Enterprise as they use the SSO feature. In addition, clients can use the QMC and create a UDC (User Directory Connector) for pre-populating users in Qlik Sense Enterprise from their LDAP of choice such as Active Directory, and others.

## Test SSO

In this section, you test your Microsoft Entra single sign-on configuration with following options. 

* Click on **Test this application**, this will redirect to Qlik Sense Enterprise Sign-on URL where you can initiate the login flow. 

* Go to Qlik Sense Enterprise Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the Qlik Sense Enterprise tile in the My Apps, this will redirect to Qlik Sense Enterprise Sign-on URL. For more information about the My Apps, see [Introduction to the My Apps](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).

## Next steps

Once you configure Qlik Sense Enterprise you can enforce Session control, which protects exfiltration and infiltration of your organization's sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-aad).

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
