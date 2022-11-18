---
title: 'Tutorial: App Proxy configuration for Azure AD SAML SSO for Confluence'
description: Learn App Proxy configuration for Azure AD SAML SSO for Confluence.
services: active-directory
author: dhivyagana
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 11/03/2022
ms.author: dhivyag
---

# Tutorial: App Proxy configuration for Azure AD SAML SSO for Confluence

This article helps to configure Azure AD SAML SSO for your on-premises Confluence application using Application Proxy.

## Prerequisites

To configure Azure AD integration with Confluence SAML SSO by Microsoft, you need the following items:

- An Azure AD subscription.
- Confluence server application installed on a Windows 64-bit server (on-premises or on the cloud IaaS infrastructure).
- Confluence server is HTTPS enabled.
- Note the supported versions for Confluence Plugin are mentioned in below section.
- Confluence server is reachable on internet particularly to Azure AD Login page for authentication and should able to receive the token from Azure AD.
- Admin credentials are set up in Confluence.
- WebSudo is disabled in Confluence.
- Test user created in the Confluence server application.

To get started, you need the following items:

* Do not use your production environment, unless it is necessary.
* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Confluence SAML SSO by Microsoft single sign-on (SSO) enabled subscription.

## Supported versions of Confluence

As of now, following versions of Confluence are supported:

- Confluence: 5.0 to 5.10
- Confluence: 6.0.1 to 6.15.9
- Confluence: 7.0.1 to 7.17.0

> [!NOTE]
> Please note that our Confluence Plugin also works on Ubuntu Version 16.04

## Scenario description

In this tutorial, you configure and test Azure AD SSO for on-premises confluence setup using application proxy mode.
1. Download and Install Azure AD App Proxy connector.
1. Add Application Proxy in Azure AD.
1. Add a Confluence SAML SSO app in Azure AD.
1. Configure SSO for SAML SSO Confluence Application in Azure AD.
1. Create an Azure AD Test user.
1. Assigning the test user for the Confluence Azure AD App.
1. Configure SSO for Confluence SAML SSO by Microsoft Confluence plugin in your Confluence Server.
1. Assigning the test user for the Microsoft Confluence plugin in your Confluence Server.
1. Test the SSO.

## Download and Install the App Proxy Connector Service

1. Sign in to the [Azure portal](https://portal.azure.com/) as an application administrator of the directory that uses Application Proxy. 
2. Select **App proxy** from Azure Services section.
3. Select **Download connector service**.

    ![Screenshot for Download connector service.](./media/confluence-app-proxy-tutorial/download-connector-service.png)

4. Accept terms & conditions to download connector. Once downloaded, install it to the system, which hosts the confluence application.

## Add an On-premises Application in Azure AD

To add an Application proxy, we need to create an enterprise application.

1. Sign in as an administrator in the Azure portal.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. Choose **Add an on-premises application**.

    ![Screenshot for Add an on-premises application.](./media/confluence-app-proxy-tutorial/add-on-premises-application.png)

1. Type the name of the application and click the create button at the bottom left column.

    ![Screenshot for on-premises application.](./media/confluence-app-proxy-tutorial/on-premises-application.png)

    1.	**Internal URL** will be your Confluence application URL.
    2.	**External URL** will be auto-generated based on the Name you choose.
    3.	**Pre Authentication** can be left to Azure Active Directory as default.
    4.	Choose **Connector Group** which lists your connector agent under it as active.
    5.	Leave the **Additional Settings** as default.

1. Click on the **Save** from the top options to configure an application proxy.


## Add a Confluence SAML SSO app in Azure AD

Now that you've prepared your environment and installed a connector, you're ready to add confluence applications to Azure AD.

1.	Sign in as an administrator in the Azure portal.
2.	In the left navigation panel, select Azure Active Directory.
3.	Select Enterprise applications, and then select New applications.
4.	Select **Confluence SAML SSO by Microsoft** widget from the Azure AD Gallery.


## Configure SSO for Confluence SAML SSO Application in Azure AD

1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. Open the **Confluence SAML SSO by Microsoft** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

    ![Screenshot for Edit Basic SAML Configuration.](common/edit-urls.png)

1. On the Basic SAML Configuration section, enter the **External Url** value for the following fields: identifier, Reply URL, SignOn URL.

### Create an Azure AD test user

In this section, you'll create a test user in the Azure portal called B.Simon.

1. From the left pane in the Azure portal, select **Azure Active Directory**, select **Users**, and then select **All users**.
1. Select **New user** at the top of the screen.
1. In the **User** properties, follow these steps:
   1. In the **Name** field, enter `B.Simon`.  
   1. In the **User name** field, enter the username@companydomain.extension. For example, `B.Simon@contoso.com`.
   1. Select the **Show password** check box, and then write down the value that's displayed in the **Password** box.
   1. Click **Create**.

### Assigning the test user for the Confluence Azure AD App

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Confluence Azure AD App.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Confluence SAML SSO by Microsoft**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user/group**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog, click the **Assign** button. 

1. Verify the App Proxy setup by checking if the configured test user is able to SSO using the external URL mentioned in the on-premises application.

> [!NOTE]
> Complete the setup of the JIRA SAML SSO by Microsoft application by following [this](./jiramicrosoft-tutorial.md) tutorial.
