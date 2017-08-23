---
title: Azure MFA Server Mobile App Web Service | Microsoft Docs
description: The Microsoft Authenticator app offers an additional out-of-band authentication option.  It allows the MFA server to use push notifications to users.
services: multi-factor-authentication
documentationcenter: ''
author: kgremban
manager: femila

ms.assetid: 6c8d6fcc-70f4-4da4-9610-c76d66635b8b
ms.service: multi-factor-authentication
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 06/15/2017
ms.author: kgremban
ms.reviewer: yossib
ms.custom: H1Hack27Feb2017,it-pro
---
# Enable mobile app authentication with Azure Multi-Factor Authentication Server

The Microsoft Authenticator app offers an additional out-of-band verification option. Instead of placing an automated phone call or SMS to the user during login, Azure Multi-Factor Authentication pushes a notification to the Microsoft Authenticator app on the user’s smartphone or tablet. The user simply taps **Verify** (or enters a PIN and taps “Authenticate”) in the app to complete their sign-in.

Using a mobile app for two-step verification is preferred when phone reception is unreliable. If you use the app as an OATH token generator, it doesn't require any network or internet connection.

Installing the user portal on a server other than the Azure Multi-Factor Authentication Server requires the following steps:

1. Install the web service SDK
2. Install the mobile app web service
3. Configure the mobile app settings in the Azure Multi-Factor Authentication Server
4. Activate the Microsoft Authenticator app for end users

## Requirements

To use the Microsoft Authenticator app, the following are required so that the app can successfully communicate with Mobile App Web Service:

* Azure Multi-Factor Authentication Server v6.0 or higher
* Install Mobile App Web Service on an Internet-facing web server running Microsoft® [Internet Information Services (IIS) IIS 7.x or higher](http://www.iis.net/)
* ASP.NET v4.0.30319 is installed, registered, and set to Allowed
* Required role services include ASP.NET and IIS 6 Metabase Compatibility
* Mobile App Web Service is accessible via a public URL
* Mobile App Web Service is secured with an SSL certificate.
* Install the Azure Multi-Factor Authentication Web Service SDK in IIS 7.x or higher on the same server as the Azure Multi-Factor Authentication Server
* The Azure Multi-Factor Authentication Web Service SDK is secured with an SSL certificate.
* Mobile App Web Service can connect to the Azure Multi-Factor Authentication Web Service SDK over SSL
* Mobile App Web Service can authenticate to the Azure MFA Web Service SDK using the credentials of a service account that is a member of the "PhoneFactor Admins" security group. This service account and group exist in Active Directory if the Azure Multi-Factor Authentication Server is on a domain-joined server. This service account and group exist locally on the Azure Multi-Factor Authentication Server if it is not joined to a domain.


## Install the web service SDK
If the Azure Multi-Factor Authentication Web Service SDK is not already installed on the Azure Multi-Factor Authentication (MFA) Server, go to that server and open the Azure MFA Server.

1. Click the Web Service SDK icon.
2. Click **Install Web Service SDK** and follow the instructions presented.

The Web Service SDK must be secured with an SSL certificate. A self-signed certificate is okay for this purpose. Import the certificate into the “Trusted Root Certification Authorities” store of the Local Computer account on the User Portal web server so that it will trust that certificate when initiating the SSL connection.

![Setup](./media/multi-factor-authentication-get-started-server-webservice/sdk.png)

## Install the mobile app web service
Before installing the mobile app web service, be aware of the following details:

* If the Azure MFA User Portal is already installed on the Internet-facing server, the username, password, and URL to the Web Service SDK can be copied from the User Portal’s web.config file.
* It is helpful to open a web browser on the Internet-facing web server and navigate to the URL of the Web Service SDK that was entered into the web.config file. If the browser can get to the web service successfully, it should prompt you for credentials. Enter the username and password that were entered into the web.config file exactly as it appears in the file. Ensure that no certificate warnings or errors are displayed.
* If a reverse proxy or firewall is sitting in front of the Mobile App Web Service web server and performing SSL offloading, you can edit the Mobile App Web Service web.config file so that the Mobile App Web Service can use http instead of https. SSL is still required from the Mobile App to the firewall/reverse proxy. Add the following key to the \<appSettings\> section:

        <add key="SSL_REQUIRED" value="false"/>

### Install the service

1. Open Windows Explorer on the Azure Multi-Factor Authentication Server and navigate to the folder where the Azure MFA Server is installed (usually C:\Program Files\Azure Multi-Factor Authentication). Choose the 32-bit or 64-bit version of the Azure Multi-Factor AuthenticationPhoneAppWebServiceSetup installation file. Copy the installation file to the Internet-facing server.

2. On the Internet-facing web server, run the setup file with administrator rights. Open a command prompt as an administrator and navigate to the location where the installation file was copied.

3. Run the Multi-Factor AuthenticationMobileAppWebServiceSetup install file, change the Site if desired and change the Virtual directory to a short name such as “PA.”

  A short virtual directory name is recommended since users must enter the Mobile App Web Service URL into the mobile device during activation.

4. After finishing the install of the Azure Multi-Factor AuthenticationMobileAppWebServiceSetup, browse to C:\inetpub\wwwroot\PA (or appropriate directory based on the virtual directory name) and edit the web.config file.

5. Locate the WEB_SERVICE_SDK_AUTHENTICATION_USERNAME and WEB_SERVICE_SDK_AUTHENTICATION_PASSWORD keys. Set the values to the username and password of the service account that is a member of the PhoneFactor Admins security group. This may be the same account being used as the Identity of the Azure Multi-Factor Authentication User Portal if that has been previously installed. Be sure to enter the Username and Password in between the quotation marks at the end of the line, (value=””/>). Use a qualified username like domain\username or machine\username.  

6. Locate the pfMobile App Web Service_pfwssdk_PfWsSdk setting. Change the value from *http://localhost:4898/PfWsSdk.asmx* to the URL of the Web Service SDK that is running on the Azure Multi-Factor Authentication Server (like https://computer1.domain.local/MultiFactorAuthWebServiceSdk/PfWsSdk.asmx).

  Since SSL is used for this connection, you must reference the Web Service SDK by server name and not IP address. The SSL certificate would have been issued for the server name and the URL used must match the name on the certificate. The server name may not resolve to an IP address from the Internet-facing server. If this is the case, add an entry to the hosts file on that server to map the name of the Azure Multi-Factor Authentication Server to its IP address. Save the web.config file after changes have been made.

7. If the website that Mobile App Web Service was installed under has not already been binded with a publicly signed certificate, install the certificate on the server, open IIS Manager, and bind the certificate to the website.

8. Open a web browser from any computer and navigate to the URL where Mobile App Web Service was installed (like https://www.publicwebsite.com/PA). Ensure that no certificate warnings or errors are displayed.

### Configure the mobile app settings in the Azure Multi-Factor Authentication Server
Now that the mobile app web service is installed, you need to configure the Azure Multi-Factor Authentication Server to work with the portal.

1. In the Azure MFA Server, click the User Portal icon. If users are allowed to control their authentication methods, check **Mobile App** on the Settings tab, under **Allow users to select method**. Without this feature enabled, end users will be required to contact your Help Desk to complete activation for the Mobile App.
2. Check the **Allow users to activate Mobile App** box.
3. Check the **Allow User Enrollment** box.
4. Click the Mobile App icon.
5. Enter the URL being used with the virtual directory that was created when installing the Azure Multi-Factor AuthenticationMobileAppWebServiceSetup. An Account Name may be entered in the space provided. This company name will display in the mobile application. If left blank, the name of your Multi-Factor Auth Provider created in the Azure classic portal will be displayed.

<center>![Setup](./media/multi-factor-authentication-get-started-server-webservice/mobile.png)</center>
