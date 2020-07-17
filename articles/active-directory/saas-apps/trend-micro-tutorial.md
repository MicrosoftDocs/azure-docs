---
title: 'Tutorial: Azure AD SSO integration with Trend Micro Web Security (TMWS)'
description: Learn how to configure single sign-on between Azure Active Directory and Trend Micro Web Security (TMWS).
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: 827285d3-8e65-43cd-8453-baeda32ef174
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: tutorial
ms.date: 04/21/2020
ms.author: jeedes

ms.collection: M365-identity-device-management
---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with Trend Micro Web Security (TMWS)

In this tutorial, you'll learn how to integrate Trend Micro Web Security (TMWS) with Azure Active Directory (Azure AD). When you integrate TMWS with Azure AD, you can:

* Control in Azure AD who has access to TMWS.
* Enable your users to be automatically signed in to TMWS with their Azure AD accounts.
* Manage your accounts in one central location: the Azure portal.

To learn more about SaaS app integration with Azure AD, see [Single sign-on to applications in Azure Active Directory](https://docs.microsoft.com/azure/active-directory/manage-apps/what-is-single-sign-on).

## Prerequisites

To get started, you need:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* A TMWS subscription that's enabled for SSO.

## Scenario description

In this tutorial, you'll configure and test Azure AD SSO in a test environment.

* TMWS supports SP-initiated SSO.
* After you configure TMWS, you can enforce session control, which protects exfiltration and infiltration of your organization's sensitive data in real time. Session control extends from Conditional Access. To learn how to enforce session control by using Microsoft Cloud App Security, see [Onboard and deploy Conditional Access App Control for any app](https://docs.microsoft.com/cloud-app-security/proxy-deployment-any-app).

## Add TMWS from the gallery

To configure the integration of TMWS into Azure AD, you need to add TMWS from the gallery to your list of managed SaaS apps.

1. Sign in to the [Azure portal](https://portal.azure.com) with either a work or school account or a personal Microsoft account.
1. In the left pane, select the **Azure Active Directory** service.
1. Select **Enterprise applications** and then select **All applications**.
1. To add a new application, select **New application**.
1. In the **Add from the gallery** section, enter **Trend Micro Web Security (TMWS)** in the search box.
1. Select **Trend Micro Web Security (TMWS)** in the search results and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD SSO for TMWS

You'll configure and test Azure AD SSO with TMWS by using a test user called B.Simon. For SSO to work, you need to establish a link between an Azure AD user and the related user in TMWS.

You'll complete these basic steps to configure and test Azure AD SSO with TMWS:

1. [Configure Azure AD SSO](#configure-azure-ad-sso) to enable the feature for your users.
    1. [Create an Azure AD user](#create-an-azure-ad-test-user) to test Azure AD single sign-on.
    1. [Grant the Azure AD test user](#grant-the-azure-ad-test-user-access-to-tmws) access to TMWS.
    1. [Configure user and group synchronization settings in Azure AD](#configure-user-and-group-synchronization-settings-in-azure-ad).
1. [Configure TMWS SSO](#configure-tmws-sso) on the application side.
1. [Test SSO](#test-sso) to verify the configuration.

## Configure Azure AD SSO

Complete these steps to enable Azure AD SSO in the Azure portal.

1. In the [Azure portal](https://portal.azure.com/), on the **Trend Micro Web Security (TMWS)** application integration page, in the **Manage** section, select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up Single Sign-On with SAML** page, select the pen button for **Basic SAML Configuration** to edit the settings:

   ![Edit the Basic SAML Configuration settings](common/edit-urls.png)

1. In the **Basic SAML Configuration** section, enter values in the following boxes:

    a. In the **Identifier (Entity ID)** box, enter a URL in the following pattern:

    `https://auth.iws-hybrid.trendmicro.com/([0-9a-f]{16})`

    b. In the **Reply URL** box, enter this URL:

    `https://auth.iws-hybrid.trendmicro.com/simplesaml/module.php/saml/sp/saml2-acs.php/ics-sp`

    > [!NOTE]
    > The identifier value in the previous step isn't the value that you should enter. You need to use the actual identifier. You can get this value in the **Service Provider Settings for the Azure Admin Portal** section on the **Authentication Method** page for Azure AD from **Administration > Directory Services**.

1. TMWS expects the SAML assertions in a specific format, so you need to add custom attribute mappings to your SAML token attributes configuration. This screenshot shows the default attributes:

    ![Default attributes](common/default-attributes.png)

1. In addition to the attributes in the preceding screenshot, TMWS expects two more attributes to be passed back in the SAML response. These attributes are shown in the following table. The attributes are pre-populated, but you can change them to meet your requirements.
    
    | Name | Source attribute|
    | --------------- | --------- |
    | sAMAccountName | user.onpremisessamaccountname |
    | uPN | user.userprincipalname |

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section, find **Certificate (Base64)**. Select the **Download** link next to this certificate name to download the certificate and save it on your computer:

    ![Certificate download link](common/certificatebase64.png)

1. In the **Set up Trend Micro Web Security (TMWS)** section, copy the appropriate URL or URLs, based on your requirements:

    ![Copy the configuration URLs](common/copy-configuration-urls.png)

### Create an Azure AD test user

In this section, you'll create a test user called B.Simon in the Azure portal.

1. In the left pane of the Azure portal, select **Azure Active Directory**. Select **Users**, and then select **All users**.
1. Select **New user** at the top of the screen.
1. In the **User** properties, follow these steps:
   1. In the **Name** box, enter `B.Simon`.  
   1. In the **User name** box, enter ***username*@*companydomain*.*extension***. For example, `B.Simon@contoso.com`.
   1. Select **Show password**, and then write down the value that's displayed in the **Password** box.
   1. Select **Create**.

### Grant the Azure AD test user access to TMWS

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to TMWS.

1. In the Azure portal, select **Enterprise applications**, and then select **All applications**.
1. In the applications list, select **Trend Micro Web Security (TMWS)**.
1. In the app's overview page, in the **Manage** section, select **Users and groups**:

   ![Select Users and groups](common/users-groups-blade.png)

1. Select **Add user**, and then select **Users and groups** in the **Add Assignment** dialog box.

    ![Select Add user](common/add-assign-user.png)

1. In the **Users and groups** dialog box, select **B.Simon** in the **Users** list, and then click the **Select** button at the bottom of the screen.
1. If you expect a role value in the SAML assertion, in the **Select Role** dialog box, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog box, select **Assign**.

### Configure user and group synchronization settings in Azure AD

1. In the left pane, select **Azure Active Directory**.

1. Under **Manage**, select **App registrations**, and then select your new enterprise application under **All applications**.

1. Under **Manage**, select **Certificates & secrets**.

1. In the **Client secrets** area, select **New client secret**.

1. On the **Add a client secret screen**, optionally add a description and select an expiration period for the client secret, and then select **Add**. The new client secret appears in the **Client secrets** area.

1. Record the client secret value. Later, you'll enter it into TMWS.

1. Under **Manage**, select **API permissions**. 

1. In the **API permissions** window, select **Add a permission**.

1. On the **Microsoft APIs** tab of the **Request API permissions** window, select **Microsoft Graph** and then **Application permissions**.

1. Locate and add these permissions: 

    * Group.Read.All
    * User.Read.All

1. Select **Add permissions**. A message appears to confirm that your settings were saved. The new permissions appear in the **API permissions** window.

1. In the **Grant consent** area, select **Grant admin consent for *your administrator account* (Default Directory)**, and then select **Yes**. A message appears to confirm that the admin consent for the requested permissions was granted.

1. Select **Overview**. 

1. Record the **Application (client) ID** and **Directory (tenant) ID** that you see in the right pane. Later, you'll enter that information into TMWS. You can also select **Custom domain names** under **Azure Active Directory > Manage** and record the domain name that you see in the right pane.

## Configure TMWS SSO

Complete these steps to configure TMWS SSO on the application side.

1. Sign in to the TMWS management console, and go to **Administration** > **USERS & AUTHENTICATION** > **Directory Services**.

1. Select **here** on the upper area of the screen.

1. On the **Authentication Method** page, select **Azure AD**.

1. Select **On** or **Off** to configure whether to allow Azure AD users in your organization to visit websites through TMWS if their data isn't synchronized to TMWS.

    > [!NOTE]
    > Users who aren't synchronized from Azure AD can be authenticated only through known TMWS gateways or the dedicated port for your organization.

1. In the **Identity Provider Settings** section, complete these steps:

    a. In the **Service URL** box, enter the **Login URL** value that you copied from the Azure portal.

    b. In the **Logon name attribute** box, enter the **User claim name** with the **user.onpremisessamaccountname** source attribute from the Azure portal.

    c. In the **Public SSL certificate** box, use the downloaded **Certificate (Base64)** from the Azure portal.

1. In the **Synchronization Settings** section, complete these steps:

    a. In the **Tenant** box, enter the **Directory (tenant) ID** or **Custom domain name** value from the Azure portal.

    b. In the **Application ID** box, enter the **Application (client) ID** value from the Azure portal.

    c. In the **Client secret** box, enter the **Client secret** from the Azure portal.

    d. Select **Synchronization schedule** to synchronize with Azure AD manually or according to a schedule. If you select **Manually**, whenever there are changes to Active Directory user information, remember to go back to the **Directory Services** page and perform manual synchronization so that information in TMWS remains current.

    e. Select **Test Connection** to check whether the Azure AD service can be successfully connected.
    
    f. Select **Save**.
 
 > [!NOTE]
 > For more information on how to configure TMWS with Azure AD, see [Configuring Azure AD Settings on TMWS](https://docs.trendmicro.com/en-us/enterprise/trend-micro-web-security-online-help/administration_001/directory-services/azure-active-directo/configuring-azure-ad.aspx).

## Test SSO 

After you configure the Azure AD service and specify Azure AD as the user authentication method, you can sign in to the TMWS proxy server to verify your setup. After the Azure AD sign-in verifies your account, you can visit the internet.

> [!NOTE]
> TMWS doesn't support testing single sign-on from the Azure AD portal, under **Overview** > **Single sign-on** > **Set up Single Sign-on with SAML** > **Test** of your new enterprise application.

1. Clear the browser of all cookies and then restart the browser. 

1. Point your browser to the TMWS proxy server. 
For details, see [Traffic Forwarding Using PAC Files](https://docs.trendmicro.com/en-us/enterprise/trend-micro-web-security-online-help/administration_001/pac-files/traffic-forwarding-u.aspx#GUID-A4A83827-7A29-4596-B866-01ACCEDCC36B).

1. Visit any internet website. TMWS will direct you to the TMWS captive portal.

1. Specify an Active Directory account (format: *domain*\\*sAMAccountName* or *sAMAccountName*@*domain*), email address, or UPN, and then select **Log On**. TMWS sends you to the Azure AD sign-in window.

1. In the Azure AD sign-in window, enter your Azure AD account credentials. You should now be signed in to TMWS.

## Additional resources

- [Tutorials on how to integrate SaaS apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory? ](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is Conditional Access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

- [Try Trend Micro Web Security with Azure AD](https://aad.portal.azure.com/)

- [What is session control in Microsoft Cloud App Security?](https://docs.microsoft.com/cloud-app-security/proxy-intro-aad)

- [How to protect Trend Micro Web Security with advanced visibility and controls](https://docs.microsoft.com/cloud-app-security/proxy-intro-aad)

