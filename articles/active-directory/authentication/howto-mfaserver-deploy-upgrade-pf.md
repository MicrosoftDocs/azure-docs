---
title: Upgrade PhoneFactor to Azure Multi-Factor Authentication Server
description: Get started with Azure Multi-Factor Authentication Server when you upgrade from the older phonefactor agent.

services: multi-factor-authentication
ms.service: active-directory
ms.subservice: authentication
ms.topic: how-to
ms.date: 10/18/2022

ms.author: justinha
author: justinha
manager: amycolannino
ms.reviewer: jpettere

ms.collection: M365-identity-device-management
---
# Upgrade the PhoneFactor Agent to Azure Multi-Factor Authentication Server

To upgrade the PhoneFactor Agent v5.x or older to Azure Multi-Factor Authentication Server, uninstall the PhoneFactor Agent and affiliated components first. Then the Multi-Factor Authentication Server and its affiliated components can be installed.

> [!IMPORTANT]
> In September 2022, Microsoft announced deprecation of Azure Multi-Factor Authentication Server. Beginning September 30, 2024, Azure Multi-Factor Authentication Server deployments will no longer service multifactor authentication requests, which could cause authentications to fail for your organization. To ensure uninterrupted authentication services and to remain in a supported state, organizations should [migrate their users’ authentication data](how-to-migrate-mfa-server-to-mfa-user-authentication.md) to the cloud-based Azure MFA service by using the latest Migration Utility included in the most recent [Azure MFA Server update](https://www.microsoft.com/download/details.aspx?id=55849). For more information, see [Azure MFA Server Migration](how-to-migrate-mfa-server-to-azure-mfa.md).  

> To get started with cloud-based MFA, see [Tutorial: Secure user sign-in events with Microsoft Entra multifactor authentication](tutorial-enable-azure-mfa.md).


## Uninstall the PhoneFactor Agent

1. First, back up the PhoneFactor data file. The default installation location is C:\Program Files\PhoneFactor\Data\Phonefactor.pfdata.

2. If the User portal is installed:
   1. Navigate to the install folder and back up the web.config file. The default installation location is C:\inetpub\wwwroot\PhoneFactor.

   2. If you have added custom themes to the portal, back up your custom folder below the C:\inetpub\wwwroot\PhoneFactor\App_Themes directory.

   3. Uninstall the User portal either through the PhoneFactor Agent (only available if installed on the same server as the PhoneFactor Agent) or through Windows Programs and Features.

3. If the Mobile App Web Service is installed:

   1. Go to the install folder and back up the web.config file. The default installation location is C:\inetpub\wwwroot\PhoneFactorPhoneAppWebService.

   2. Uninstall the Mobile App Web Service through Windows Programs and Features.

4. If the Web Service SDK is installed, uninstall it either through the PhoneFactor Agent or through Windows Programs and Features.

5. Uninstall the PhoneFactor Agent through Windows Programs and Features.

<a name='install-the-multi-factor-authentication-server'></a>

<a name='install-the-multifactor-authentication-server'></a>

## Install the Multi-Factor Authentication Server

The installation path is picked up from the registry from the previous PhoneFactor Agent installation, so it should install in the same location (for example, C:\Program Files\PhoneFactor). New installations have a different default install path (for example, C:\Program Files\Multi-Factor Authentication Server). The data file left by the previous PhoneFactor Agent should be upgraded during installation, so your users and settings should still be there after installing the new Multi-Factor Authentication Server.

1. If prompted, activate the Multi-Factor Authentication Server and ensure it is assigned to the correct replication group.

2. If the Web Service SDK was previously installed, install the new Web Service SDK through the Multi-Factor Authentication Server User Interface.

   The default virtual directory name is now **MultiFactorAuthWebServiceSdk** instead of **PhoneFactorWebServiceSdk**. If you want to use the previous name, you must change the name of the virtual directory during installation. Otherwise, if you allow the install to use the new default name, you have to change the URL in any applications that reference the Web Service SDK (like the User portal and Mobile App Web Service) to point at the correct location.

3. If the User portal was previously installed on the PhoneFactor Agent Server, install the new multifactor authentication User portal through the Multi-Factor Authentication Server User Interface.

   The default virtual directory name is now **MultiFactorAuth** instead of **PhoneFactor**. If you want to use the previous name, you must change the name of the virtual directory during installation. Otherwise, if you allow the install to use the new default name, you should click the User portal icon in the Multi-Factor Authentication Server and update the User portal URL on the Settings tab.

4. If the User portal and/or Mobile App Web Service was previously installed on a different server from the PhoneFactor Agent:

   1. Go to the install location (for example, C:\Program Files\PhoneFactor) and copy one or more installers to the other server. There are 32-bit and 64-bit installers for both the User portal and Mobile App Web Service. They're called MultiFactorAuthenticationUserPortalSetupXX.msi and MultiFactorAuthenticationMobileAppWebServiceSetupXX.msi.

   2. To install the User portal on the web server, open a command prompt as an administrator and run MultiFactorAuthenticationUserPortalSetupXX.msi.

      The default virtual directory name is now **MultiFactorAuth** instead of **PhoneFactor**. If you want to use the previous name, you must change the name of the virtual directory during installation. Otherwise, if you allow the install to use the new default name, you should click the User portal icon in the Multi-Factor Authentication Server and update the User portal URL on the Settings tab. Existing users need to be informed of the new URL.

   3. Go to the User portal install location (for example, C:\inetpub\wwwroot\MultiFactorAuth) and edit the web.config file. Copy the values in the appSettings and applicationSettings sections from your original web.config file that was backed up before the upgrade into the new web.config file. If the new default virtual directory name was kept when installing the Web Service SDK, change the URL in the applicationSettings section to point to the correct location. If any other defaults were changed in the previous web.config file, apply those same changes to the new web.config file.

> [!NOTE]
> When upgrading from a version of Azure MFA Server older than 8.0 to 8.0+ that the mobile app web service can be uninstalled after the upgrade

## Next steps

- [Install the users portal](howto-mfaserver-deploy-userportal.md) for the Azure Multi-Factor Authentication Server.

- [Configure Windows Authentication](howto-mfaserver-windows.md) for your applications. 
