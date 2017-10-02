---
title: Azure MFA Server Mobile App Web Service | Microsoft Docs
description: The Microsoft Authenticator app offers an additional out-of-band authentication option.  It allows the MFA server to use push notifications to users.
services: multi-factor-authentication
documentationcenter: ''
author: MicrosoftGuyJFlo
manager: femila

ms.assetid: 6c8d6fcc-70f4-4da4-9610-c76d66635b8b
ms.service: multi-factor-authentication
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 08/23/2017
ms.author: joflore
ms.reviewer: alexwe
ms.custom: it-pro
---
# Enable mobile app authentication with Azure Multi-Factor Authentication Server

The Microsoft Authenticator app offers an additional out-of-band verification option. Instead of placing an automated phone call or SMS to the user during login, Azure Multi-Factor Authentication pushes a notification to the Microsoft Authenticator app on the user’s smartphone or tablet. The user simply taps **Verify** (or enters a PIN and taps “Authenticate”) in the app to complete their sign-in.

Using a mobile app for two-step verification is preferred when phone reception is unreliable. If you use the app as an OATH token generator, it doesn't require any network or internet connection.

Depending on your environment, you may want to deploy the mobile app web service on the same server as Azure Multi-Factor Authentication Server or on another internet-facing server.

## Requirements

To use the Microsoft Authenticator app, the following are required so that the app can successfully communicate with Mobile App Web Service:

* Azure Multi-Factor Authentication Server v6.0 or higher
* Install Mobile App Web Service on an Internet-facing web server running Microsoft® [Internet Information Services (IIS) IIS 7.x or higher](http://www.iis.net/)
* ASP.NET v4.0.30319 is installed, registered, and set to Allowed
* Required role services include ASP.NET and IIS 6 Metabase Compatibility
* Mobile App Web Service is accessible via a public URL
* Mobile App Web Service is secured with an SSL certificate.
* Install the Azure Multi-Factor Authentication Web Service SDK in IIS 7.x or higher on the **same server as the Azure Multi-Factor Authentication Server**
* The Azure Multi-Factor Authentication Web Service SDK is secured with an SSL certificate.
* Mobile App Web Service can connect to the Azure Multi-Factor Authentication Web Service SDK over SSL
* Mobile App Web Service can authenticate to the Azure MFA Web Service SDK using the credentials of a service account that is a member of the "PhoneFactor Admins" security group. This service account and group exist in Active Directory if the Azure Multi-Factor Authentication Server is on a domain-joined server. This service account and group exist locally on the Azure Multi-Factor Authentication Server if it is not joined to a domain.

## Install the mobile app web service

Before installing the mobile app web service, be aware of the following details:

* You need a Service Account that is a part of "PhoneFactor Admins" Group. This account can be the same as the one used for the User Portal installation.
* It is helpful to open a web browser on the Internet-facing web server and navigate to the URL of the Web Service SDK that was entered into the web.config file. If the browser can get to the web service successfully, it should prompt you for credentials. Enter the username and password that were entered into the web.config file exactly as it appears in the file. Ensure that no certificate warnings or errors are displayed.
* If a reverse proxy or firewall is sitting in front of the Mobile App Web Service web server and performing SSL offloading, you can edit the Mobile App Web Service web.config file so that the Mobile App Web Service can use http instead of https. SSL is still required from the Mobile App to the firewall/reverse proxy. Add the following key to the \<appSettings\> section:

        <add key="SSL_REQUIRED" value="false"/>

### Install the web service SDK

In either scenario, if the Azure Multi-Factor Authentication Web Service SDK is **not** already installed on the Azure Multi-Factor Authentication (MFA) Server, complete the steps that follow.

1. Open the Multi-Factor Authentication Server console.
2. Go to the **Web Service SDK** and select **Install Web Service SDK**.
3. Complete the install using the defaults unless you need to change them for some reason.
4. Bind an SSL Certificate to the site in IIS.

If you have questions about configuring an SSL Certificate on an IIS server, see the article [How to Set Up SSL on IIS](https://docs.microsoft.com/en-us/iis/manage/configuring-security/how-to-set-up-ssl-on-iis).

The Web Service SDK must be secured with an SSL certificate. A self-signed certificate is okay for this purpose. Import the certificate into the “Trusted Root Certification Authorities” store of the Local Computer account on the User Portal web server so that it trusts that certificate when initiating the SSL connection.

![MFA Server configuration setup Web Service SDK](./media/multi-factor-authentication-get-started-server-webservice/sdk.png)

### Install the service

1. **On the MFA Server**, browse to the installation path.
2. Navigate to the folder where the Azure MFA Server is installed the default is **C:\Program Files\Azure Multi-Factor Authentication**.
3. Locate the installation file **MultiFactorAuthenticationMobileAppWebServiceSetup64**. If the server is **not** Internet-facing, copy the installation file to the Internet-facing server.
4. If the MFA Server is **not** internet-facing switch to the **internet-facing server**.
5. Run the **MultiFactorAuthenticationMobileAppWebServiceSetup64** install file as an administrator, change the Site if desired and change the Virtual directory to a short name if you would like.
6. After finishing the install, browse to **C:\inetpub\wwwroot\MultiFactorAuthMobileAppWebService** (or appropriate directory based on the virtual directory name) and edit the Web.Config file.

   * Find the key **"WEB_SERVICE_SDK_AUTHENTICATION_USERNAME"** and change **value=""** to **value="DOMAIN\User"** where DOMAIN\User is a Service Account that is a part of "PhoneFactor Admins" Group.
   * Find the key **"WEB_SERVICE_SDK_AUTHENTICATION_PASSWORD"** and change **value=""** to **value="Password"** where Password is the password for the Service Account entered in the previous line.
   * Find the **pfMobile App Web Service_pfwssdk_PfWsSdk** setting and change the value from **http://localhost:4898/PfWsSdk.asmx** to the Web Service SDK URL (Example: https://mfa.contoso.com/MultiFactorAuthWebServiceSdk/PfWsSdk.asmx).
   * Save the Web.Config file and close Notepad.

   > [!NOTE]
   > Since SSL is used for this connection, you must reference the Web Service SDK by **fully qualified domain name (FQDN)** and **not IP address**. The SSL certificate would have been issued for the FQDN and the URL used must match the name on the certificate.

7. If the website that Mobile App Web Service was installed under has not already been bound with a publicly signed certificate, install the certificate on the server, open IIS Manager, and bind the certificate to the website.
8. Open a web browser from any computer and navigate to the URL where Mobile App Web Service was installed (Example: https://mfa.contoso.com/MultiFactorAuthMobileAppWebService). Ensure that no certificate warnings or errors are displayed.

## Configure the mobile app settings in the Azure Multi-Factor Authentication Server

Now that the mobile app web service is installed, you need to configure the Azure Multi-Factor Authentication Server to work with the portal.

1. In the Multi-Factor Authentication Server console, click the User Portal icon. If users are allowed to control their authentication methods, check **Mobile App** on the Settings tab, under **Allow users to select method**. Without this feature enabled, end users are required to contact your Help Desk to complete activation for the Mobile App.
2. Check the **Allow users to activate Mobile App** box.
3. Check the **Allow User Enrollment** box.
4. Click the **Mobile App** icon.
5. Enter the URL being used with the virtual directory that was created when installing MultiFactorAuthenticationMobileAppWebServiceSetup64 (Example: https://mfa.contoso.com/MultiFactorAuthMobileAppWebService/) in the field **Mobile App Web Service URL:**.
6. Populate the **Account name** field with the company or organization name to display in the mobile application for this account.
   ![MFA Server configuration Mobile App settings](./media/multi-factor-authentication-get-started-server-webservice/mobile.png)

## Next steps

- [Advanced scenarios with Azure Multi-Factor Authentication and third-party VPNs](multi-factor-authentication-advanced-vpn-configurations.md).