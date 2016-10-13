<properties 
	pageTitle="Upgrading the PhoneFactor Agent to Azure Multi-Factor Authentication Server" 
	description="This document describes how to get started with Azure MFA Server and how to upgrade from the older phonefactor agent." 
	services="multi-factor-authentication" 
	documentationCenter="" 
	authors="billmath" 
	manager="stevenpo" 
	editor="curtland"/>

<tags 
	ms.service="multi-factor-authentication" 
	ms.workload="identity" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="get-started-article" 
	ms.date="08/04/2016" 
	ms.author="billmath"/>

# Upgrading the PhoneFactor Agent to Azure Multi-Factor Authentication Server

Upgrading from the PhoneFactor Agent v5.x or older to the Azure Multi-Factor Authentication Server requires the PhoneFactor Agent and affiliated components to be uninstalled before the Multi-Factor Authentication Server and its affiliated components can be installed. 

## To upgrade the PhoneFactor Agent to Azure Multi-Factor Authentication Server
<ol>
<li>First, back up the PhoneFactor data file. The default installation location is C:\Program Files\PhoneFactor\Data\Phonefactor.pfdata.


<li>If the User Portal is installed:</li>
<ol>
<li>Navigate to the install folder and back up the web.config file. The default installation location is C:\inetpub\wwwroot\PhoneFactor.</li>


<li>If you have added custom themes to the portal, back up your custom folder below the C:\inetpub\wwwroot\PhoneFactor\App_Themes directory.</li>


<li>Uninstall the User Portal either through the PhoneFactor Agent (only available if installed on the same server as the PhoneFactor Agent) or through Windows Programs and Features.</li></ol>




<li>If the Mobile App Web Service is installed:
<ol>
<li>Go to the install folder and back up the web.config file. The default installation location is C:\inetpub\wwwroot\PhoneFactorPhoneAppWebService.</li>
<li>Uninstall the Mobile App Web Service through Windows Programs and Features.</li></ol>

<li>If the Web Service SDK is installed, uninstall it either through the PhoneFactor Agent or through Windows Programs and Features.

<li>Uninstall the PhoneFactor Agent through Windows Programs and Features.

<li>Install the Multi-Factor Authentication Server. Note that the installation path is picked up from the registry from the previous PhoneFactor Agent installation so it should install in the same location (e.g. C:\Program Files\PhoneFactor). New installations will have a different default install path (e.g. C:\Program Files\Multi-Factor Authentication Server). The data file left by the previous PhoneFactor Agent should be upgraded during installation, so your users and settings should still be there after installing the new Multi-Factor Authentication Server.

<li>If prompted, activate the Multi-Factor Authentication Server and ensure it is assigned to the correct replication group.

<li>If the Web Service SDK was previously installed, install the new Web Service SDK through the Multi-Factor Authentication Server User Interface. Note that the default virtual directory name is now “MultiFactorAuthWebServiceSdk” instead of “PhoneFactorWebServiceSdk”. If you want to use the previous name, you must change the name of the virtual directory during installation. Otherwise, if you allow the install to use the new default name, you will have to change the URL in any applications that reference the Web Service SDK such as the User Portal and Mobile App Web Service to point at the correct location.

<li>If the User Portal was previously installed on the PhoneFactor Agent Server, install the new Multi-Factor Authentication User Portal through the Multi-Factor Authentication Server User Interface. Note that the default virtual directory name is now “MultiFactorAuth” instead of “PhoneFactor”. If you want to use the previous name, you must change the name of the virtual directory during installation. Otherwise, if you allow the install to use the new default name, you should click the User Portal icon in the Multi-Factor Authentication Server and update the User Portal URL on the Settings tab. 

<li>If the User Portal and/or Mobile App Web Service was previously installed on a different server from the PhoneFactor Agent:
<ol>
<li>Go to the install location (e.g. C:\Program Files\PhoneFactor) and copy the appropriate installer(s) to the other server. There are 32-bit and 64-bit installers for both the User Portal and Mobile App Web Service. They are called MultiFactorAuthenticationUserPortalSetupXX.msi and MultiFactorAuthenticationMobileAppWebServiceSetupXX.msi respectively.</li>
<li>To install the User Portal on the web server, open a command prompt as an administrator and run the MultiFactorAuthenticationUserPortalSetupXX.msi. Note that the default virtual directory name is now “MultiFactorAuth” instead of “PhoneFactor”. If you want to use the previous name, you must change the name of the virtual directory during installation. Otherwise, if you allow the install to use the new default name, you should click the User Portal icon in the Multi-Factor Authentication Server and update the User Portal URL on the Settings tab. Existing users will need to be informed of the new URL.</li>
<li>Go to the User Portal install location (e.g. C:\inetpub\wwwroot\MultiFactorAuth) and edit the web.config file. Copy the values in the appSettings and applicationSettings sections from your original web.config file that was backed up prior to the upgrade into the new web.config file. If the new default virtual directory name was kept when installing the Web Service SDK, change the URL in the applicationSettings section to point to the correct location. If any other defaults were changed in the previous web.config file, apply those same changes to the new web.config file.</li>
<li>To install the Mobile App Web Service on the web server, open a command prompt as an administrator and run the MultiFactorAuthenticationMobileAppWebServiceSetupXX.msi. Note that the default virtual directory name is now “MultiFactorAuthMobileAppWebService” instead of “PhoneFactorPhoneAppWebService”. If you want to use the previous name, you must change the name of the virtual directory during installation. You may want to choose a shorter name to make it easy for end users to type in on their mobile devices. Otherwise, if you allow the install to use the new default name, you should click the Mobile App icon in the Multi-Factor Authentication Server and update the Mobile App Web Service URL.</li>
<li>Go to the Mobile App Web Service install location (e.g. C:\inetpub\wwwroot\MultiFactorAuthMobileAppWebService) and edit the web.config file. Copy the values in the appSettings and applicationSettings sections from your original web.config file that was backed up prior to the upgrade into the new web.config file. If the new default virtual directory name was kept when installing the Web Service SDK, change the URL in the applicationSettings section to point to the correct location. If any other defaults were changed in the previous web.config file, apply those same changes to the new web.config file.</li></ol>


 


 
