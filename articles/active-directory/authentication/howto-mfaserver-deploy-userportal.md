---
title: User portal for Azure MFA Server
description: Get started with Azure MFA and the user portal.

services: multi-factor-authentication
ms.service: active-directory
ms.subservice: authentication
ms.topic: how-to
ms.date: 01/29/2023

ms.author: justinha
author: justinha
manager: amycolannino
ms.reviewer: jpettere

ms.collection: M365-identity-device-management
---
# User portal for the Microsoft Entra multifactor authentication Server

The user portal is an IIS web site that allows users to enroll in Microsoft Entra multifactor authentication and maintain their accounts. A user may change their phone number, change their PIN, or choose to bypass two-step verification during their next sign-on.

Users sign in to the user portal with their normal username and password, then either complete a two-step verification call or answer security questions to complete their authentication. If user enrollment is allowed, users configure their phone number and PIN the first time they sign in to the user portal.

User portal Administrators may be set up and granted permission to add new users and update existing users.

Depending on your environment, you may want to deploy the user portal on the same server as Microsoft Entra multifactor authentication Server or on another internet-facing  server.

> [!IMPORTANT]
> In September 2022, Microsoft announced deprecation of Microsoft Entra multifactor authentication Server. Beginning September 30, 2024, Microsoft Entra multifactor authentication Server deployments will no longer service multifactor authentication requests, which could cause authentications to fail for your organization. To ensure uninterrupted authentication services and to remain in a supported state, organizations should [migrate their users’ authentication data](how-to-migrate-mfa-server-to-mfa-user-authentication.md) to the cloud-based Azure MFA service by using the latest Migration Utility included in the most recent [Azure MFA Server update](https://www.microsoft.com/download/details.aspx?id=55849). For more information, see [Azure MFA Server Migration](how-to-migrate-mfa-server-to-azure-mfa.md).  

> To get started with cloud-based MFA, see [Tutorial: Secure user sign-in events with Microsoft Entra multifactor authentication](tutorial-enable-azure-mfa.md).


![MFA Server User portal log in page](./media/howto-mfaserver-deploy-userportal/portal.png)

> [!NOTE]
> The user portal is only available with multifactor authentication Server. If you use multifactor authentication in the cloud, refer your users to the [Set-up your account for two-step verification](https://support.microsoft.com/account-billing/how-to-use-the-microsoft-authenticator-app-9783c865-0308-42fb-a519-8cf666fe0acc) or [Manage your settings for two-step verification](https://support.microsoft.com/account-billing/change-your-two-step-verification-method-and-settings-c801d5ad-e0fc-4711-94d5-33ad5d4630f7).

## Install the web service SDK

In either scenario, if the Microsoft Entra multifactor authentication Web Service SDK is **not** already installed on the Microsoft Entra multifactor authentication Server, complete the steps that follow.

1. Open the multifactor authentication Server console.
2. Go to the **Web Service SDK** and select **Install Web Service SDK**.
3. Complete the install using the defaults unless you need to change them for some reason.
4. Bind a TLS/SSL Certificate to the site in IIS.

If you have questions about configuring a TLS/SSL Certificate on an IIS server, see the article [How to Set Up SSL on IIS](/iis/manage/configuring-security/how-to-set-up-ssl-on-iis).

The Web Service SDK must be secured with a TLS/SSL certificate. A self-signed certificate is okay for this purpose. Import the certificate into the "Trusted Root Certification Authorities" store of the Local Computer account on the User Portal web server so that it trusts that certificate when initiating the TLS connection.

![MFA Server configuration setup Web Service SDK](./media/howto-mfaserver-deploy-userportal/sdk.png)

<a name='deploy-the-user-portal-on-the-same-server-as-the-azure-ad-multi-factor-authentication-server'></a>

## Deploy the user portal on the same server as the Microsoft Entra multifactor authentication Server

The following pre-requisites are required to install the user portal on the **same server** as the Microsoft Entra multifactor authentication Server:

* IIS, including ASP.NET, and IIS 6 meta base compatibility (for IIS 7 or higher)
* An account with admin rights for the computer and Domain if applicable. The account needs permissions to create Active Directory security groups.
* Secure the user portal with a TLS/SSL certificate.
* Secure the Microsoft Entra multifactor authentication Web Service SDK with a TLS/SSL certificate.

To deploy the user portal, follow these steps:

1. Open the Microsoft Entra multifactor authentication Server console, click the **User Portal** icon in the left menu, then click **Install User Portal**.
2. Complete the install using the defaults unless you need to change them for some reason.
3. Bind a TLS/SSL Certificate to the site in IIS

   > [!NOTE]
   > This TLS/SSL Certificate is usually a publicly signed TLS/SSL Certificate.

4. Open a web browser from any computer and navigate to the URL where the user portal was installed (Example: `https://mfa.contoso.com/MultiFactorAuth`). Ensure that no certificate warnings or errors are displayed.

![MFA Server User Portal installation](./media/howto-mfaserver-deploy-userportal/install.png)

If you have questions about configuring a TLS/SSL Certificate on an IIS server, see the article [How to Set Up SSL on IIS](/iis/manage/configuring-security/how-to-set-up-ssl-on-iis).

## Deploy the user portal on a separate server

If the server where Microsoft Entra multifactor authentication Server is running isn't internet-facing, you should install the user portal on a **separate, internet-facing server**.

If your organization uses the Microsoft Authenticator app as one of the verification methods, and want to deploy the user portal on its own server, complete the following requirements:

* Use v6.0 or higher of the Microsoft Entra multifactor authentication Server.
* Install the user portal on an internet-facing web server running Microsoft internet Information Services (IIS) 6.x or higher.
* When using IIS 6.x, ensure ASP.NET v2.0.50727 is installed, registered, and set to **Allowed**.
* When using IIS 7.x or higher, IIS, including Basic Authentication, ASP.NET, and IIS 6 meta base compatibility.
* Secure the user portal with a TLS/SSL certificate.
* Secure the Microsoft Entra multifactor authentication Web Service SDK with a TLS/SSL certificate.
* Ensure that the user portal can connect to the Microsoft Entra multifactor authentication Web Service SDK over TLS/SSL.
* Ensure that the user portal can authenticate to the Microsoft Entra multifactor authentication Web Service SDK using the credentials of a service account in the "PhoneFactor Admins" security group. This service account and group should exist in Active Directory if the Microsoft Entra multifactor authentication Server is running on a domain-joined server. This service account and group exist locally on the Microsoft Entra multifactor authentication Server if it isn't joined to a domain.

Installing the user portal on a server other than the Microsoft Entra multifactor authentication Server requires the following steps:

1. **On the MFA Server**, browse to the installation path (Example: C:\Program Files\multifactor authentication Server), and copy the file **MultiFactorAuthenticationUserPortalSetup64** to a location accessible to the internet-facing server where you'll install it.
2. **On the internet-facing web server**, run the  MultiFactorAuthenticationUserPortalSetup64 install file as an administrator, change the Site if desired and change the Virtual directory to a short name if you would like.
3. Bind a TLS/SSL Certificate to the site in IIS.

   > [!NOTE]
   > This TLS/SSL Certificate is usually a publicly signed TLS/SSL Certificate.

4. Browse to **C:\inetpub\wwwroot\MultiFactorAuth**
5. Edit the Web.Config file in Notepad

    * Find the key **"USE_WEB_SERVICE_SDK"** and change **value="false"** to **value="true"**
    * Find the key **"WEB_SERVICE_SDK_AUTHENTICATION_USERNAME"** and change **value=""** to **value="DOMAIN\User"** where DOMAIN\User is a Service Account that is a part of "PhoneFactor Admins" Group.
    * Find the key **"WEB_SERVICE_SDK_AUTHENTICATION_PASSWORD"** and change **value=""** to **value="Password"** where Password is the password for the Service Account entered in the previous line.
    * Find the value `https://www.contoso.com/MultiFactorAuthWebServiceSdk/PfWsSdk.asmx` and change this placeholder URL to the Web Service SDK URL we installed in step 2.
    * Save the Web.Config file and close Notepad.

6. Open a web browser from any computer and navigate to the URL where the user portal was installed (Example: `https://mfa.contoso.com/MultiFactorAuth`). Ensure that no certificate warnings or errors are displayed.

If you have questions about configuring a TLS/SSL Certificate on an IIS server, see the article [How to Set Up SSL on IIS](/iis/manage/configuring-security/how-to-set-up-ssl-on-iis).

<a name='configure-user-portal-settings-in-the-azure-ad-multi-factor-authentication-server'></a>

## Configure user portal settings in the Microsoft Entra multifactor authentication Server

Now that the user portal is installed, you need to configure the Microsoft Entra multifactor authentication Server to work with the portal.

1. In the Microsoft Entra multifactor authentication Server console, click the **User Portal** icon. On the Settings tab, enter the URL to the user portal in the **User Portal URL** textbox. If email functionality has been enabled, this URL is included in the emails that are sent to users when they're imported into the Microsoft Entra multifactor authentication Server.
2. Choose the settings that you want to use in the User Portal. For example, if users are allowed to choose their authentication methods, ensure that **Allow users to select method** is checked, along with the methods they can choose from.
3. Define who should be Administrators on the **Administrators** tab. You can create granular administrative permissions using the checkboxes and dropdowns in the Add/Edit boxes.

Optional configuration:

- **Security Questions** - Define approved security questions for your environment and the language they appear in.
- **Passed Sessions** - Configure user portal integration with a form-based website using MFA.
- **Trusted IPs** - Allow users to skip MFA when authenticating from a list of trusted IPs or ranges.

![MFA Server User Portal configuration](./media/howto-mfaserver-deploy-userportal/config.png)

Microsoft Entra multifactor authentication server provides several options for the user portal. The following table provides a list of these options and an explanation of what they're used for.

| User Portal Settings | Description |
|:--- |:--- |
| User Portal URL | Enter the URL of where the portal is being hosted. |
| Primary authentication | Specify the type of authentication to use when signing in to the portal. Either Windows, Radius, or LDAP authentication. |
| Allow users to log in | Allow users to enter a username and password on the sign-in page for the User portal. If this option isn't selected, the boxes are grayed out. |
| Allow user enrollment | Allow a user to enroll in multifactor authentication by taking them to a setup screen that prompts them for additional information such as telephone number. Prompt for backup phone allows users to specify a secondary phone number. Prompt for third-party OATH token allows users to specify a third-party OATH token. |
| Allow users to initiate One-Time Bypass | Allow users to initiate a one-time bypass. If a user sets up this option, it will take effect the next time the user signs in. Prompt for bypass seconds provides the user with a box so they can change the default of 300 seconds. Otherwise, the one-time bypass is only good for 300 seconds. |
| Allow users to select method | Allow users to specify their primary contact method. This method can be phone call, text message, mobile app, or OATH token. |
| Allow users to select language | Allow users to change the language that is used for the phone call, text message, mobile app, or OATH token. |
| Allow users to activate mobile app | Allow users to generate an activation code to complete the mobile app activation process that is used with the server.  You can also set the number of devices they can activate the app on, between 1 and 10. |
| Use security questions for fallback | Allow security questions in case two-step verification fails. You can specify the number of security questions that must be successfully answered. |
| Allow users to associate third-party OATH token | Allow users to specify a third-party OATH token. |
| Use OATH token for fallback | Allow for the use of an OATH token in case two-step verification isn't successful. You can also specify the session timeout in minutes. |
| Enable logging | Enable logging on the user portal. The log files are located at: C:\Program Files\multifactor authentication Server\Logs. |

> [!IMPORTANT]
> Starting in March of 2019 the phone call options will not be available to MFA Server users in free/trial Microsoft Entra tenants. SMS messages are not impacted by this change. Phone call will continue to be available to users in paid Microsoft Entra tenants. This change only impacts free/trial Microsoft Entra tenants.

The user can see these settings after they sign in to the user portal.

![Manage your MFA Server account using the user portal](./media/howto-mfaserver-deploy-userportal/portalsettings.png)

### Self-service user enrollment

If you want your users to sign in and enroll, you must select the **Allow users to log in** and **Allow user enrollment** options under the Settings tab. Remember that the settings you select affect the user sign-in experience.

For example, when a user signs in to the user portal for the first time, they're then taken to the Microsoft Entra multifactor authentication User Setup page. Depending on how you have configured Microsoft Entra multifactor authentication, the user may be able to select their authentication method.

If they select the Voice Call verification method or have been pre-configured to use that method, the page prompts the user to enter their primary phone number and extension if applicable. They may also be allowed to enter a backup phone number.

![Register primary and backup phone numbers](./media/howto-mfaserver-deploy-userportal/backupphone.png)

If the user is required to use a PIN when they authenticate, the page prompts them to create a PIN. After entering their phone number(s) and PIN (if applicable), the user clicks the **Call Me Now to Authenticate** button. Microsoft Entra multifactor authentication performs a phone call verification to the user's primary phone number. The user must answer the phone call and enter their PIN (if applicable) and press # to move on to the next step of the self-enrollment process.

If the user selects the Text Message verification method or has been pre-configured to use that method, the page prompts the user for their mobile phone number. If the user is required to use a PIN when they authenticate, the page also prompts them to enter a PIN.  After entering their phone number and PIN (if applicable), the user clicks the **Text Me Now to Authenticate** button. Microsoft Entra multifactor authentication performs an SMS verification to the user's mobile phone. The user receives the text message with a one-time-passcode (OTP), then replies to the message with that OTP plus their PIN (if applicable).

![User portal verification using SMS](./media/howto-mfaserver-deploy-userportal/text.png)

If the user selects the Mobile App verification method, the page prompts the user to install the Microsoft Authenticator app on their device and generate an activation code. After installing the app, the user clicks the Generate Activation Code button.

> [!NOTE]
> To use the Microsoft Authenticator app, the user must enable push notifications for their device.

The page then displays an activation code and a URL along with a barcode picture. If the user is required to use a PIN when they authenticate, the page additionally prompts them to enter a PIN. The user enters the activation code and URL into the Microsoft Authenticator app or uses the barcode scanner to scan the barcode picture and clicks the Activate button.

After the activation is complete, the user clicks the **Authenticate Me Now** button. Microsoft Entra multifactor authentication performs a verification to the user's mobile app. The user must enter their PIN (if applicable) and press the Authenticate button in their mobile app to move on to the next step of the self-enrollment process.

If the administrators have configured the Microsoft Entra multifactor authentication Server to collect security questions and answers, the user is then taken to the Security Questions page. The user must select four security questions and provide answers to their selected questions.

![User portal security questions](./media/howto-mfaserver-deploy-userportal/secq.png)

The user self-enrollment is now complete and the user is signed in to the user portal. Users can sign back in to the user portal at any time in the future to change their phone numbers, PINs, authentication methods, and security questions if changing their methods is allowed by their administrators.

## Next steps

- [Deploy the Microsoft Entra multifactor authentication Server Mobile App Web Service](howto-mfaserver-deploy-mobileapp.md)
