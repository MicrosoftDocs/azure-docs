---
title: 'Admin guide for the Microsoft Azure Active Directory single sign-on plug-in | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Microsoft Azure Active Directory single sign-on for Jira.
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila
ms.reviewer: joflore

ms.assetid: 4b663047-7f88-443b-97bd-54224b232815
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/06/2018
ms.author: jeedes

---
# Admin guide for the Microsoft Azure Active Directory single sign-on plug-in

## Overview

The Azure Active Directory (Azure AD) single sign-on (SSO) plug-in enables Microsoft Azure AD customers to use their organization username and password for signing in to Atlassian Jira and Confluence Server-based products. It implements SAML 2.0-based SSO.

## How it works

When users want to login to Atlassian Jira or Confluence application, they see the **Login with Azure AD** button on login page. When they click on it, they are required to login with the Azure AD Organization login page.

Once the users are authenticated, they should be able to login into the application. If they are already authenticated with Organization ID and password, then they directly log into the application. Also, note that login works across Jira and Confluence. If users are logged into Jira application and Confluence is also open in the same browser window, they need to login once and don't have to provide the credentials again for other app. The users can also get to the Atlassian product through myapps under Azure account and they should be logged in without being asked for the credentials.

> [!NOTE]
> User provisioning is not done using this add-on.

## Audience

Jira and Confluence admins who are planning to use this plugin to enable SSO using Azure AD.

## Assumptions

* Jira/Confluence instance is HTTPS enabled.
* Users are already created in Jira/Confluence.
* Users have role assigned in Jira/Confluence.
* Admins have access to information required to configure the plugin.
* Jira/Confluence are available outside the company network as well.
* Add on works with only On-premise version of Jira and Confluence.

## Prerequisites

Note following prerequisites before you proceed ahead with add-on installation:

* Jira/Confluence are installed on a Windows 64-bit version.
* Jira/Confluence versions are HTTPS enabled.
* Note the supported version for Plugin in “Supported Versions” section below.
* Jira/Confluence is available on the internet.
* Admin credentials for Jira/Confluence.
* Admin credentials for Azure AD.
* WebSudo should be disabled in Jira and Confluence.

## Supported versions of Jira and Confluence

As of now, following versions of Jira and Confluence are supported:

* Jira Core and Software: 6.0 to 7.2.0
* Jira Service Desk: 3.0 to 3.2
* Confluence: 5.0 to 5.10

## Installation

To install the plugin, follow these steps:

1. Log in to your Jira/Confluence instance as an Admin.
	
2. Go to Jira/Confluence Administration and click on Add-ons.
 	
3. From Atlassian Market place, search for **Microsoft SAML SSO Plugin**.
 
4. Appropriate version of add-on appears in search.
 
5. Select the plugin and UPM installs the same.
 
6. Once the plugin is installed, it appears in User Installed add-ons section of Manage Add-on section.
 
7. You have to configure the plugin before you start using it.
 
8. Click on the plugin and you see a configure button.
 
9. Click on it to provide configuration inputs
	
## Plugin configuration

Following image shows the add-on configuration screen in both Jira and Confluence:
    
![Add-on configuration](./media/ms-confluence-jira-plugin-adminguide/jira.png)

### Field explanation for add-on configuration screen:

*   Metadata URL: URL to get federation metadata from Azure AD.
 
*   Identifier: Used by Azure AD to validate the source of the request. This maps to Identifier element in Azure AD. This is auto derived by plugin as https://<domain:port>/
 
*   Reply URL: Use Reply URL in your IdP to initiate the SAML login. This maps to the Reply URL element in Azure AD. This is auto derived by plugin as https://<domain:port>/plugins/servlet/saml/auth
 
*   Sign On URL: Use Sign On URL in your IdP to initiate the SAML login. This maps to the Sign On element in Azure AD. This is auto derived by plugin as https://<domain:port>/plugins/servlet/saml/auth
 
*   IdP Entity ID: The Entity ID that your IdP uses. This is populated when Metadata URL is resolved.
 
*   Login URL: The Login URL from your IdP. This is populated from Azure AD when Metadata URL is resolved.
 
*   Log out URL: The Logout URL from your IdP. This is populated from Azure AD when Metadata URL is resolved.
 
*   X.509 Certificate: Your IdP’s X.509 certificate. This is populated from Azure AD when Metadata URL is resolved.
 
*   Login Button Name: Name the login button your organization wants to see. This text is shown to users on login button on login screen.
 
*   SAML User ID Locations: Where the user id is expected in SAML response. It could either be in NameID or in a custom attribute name. This ID has to be the Jira/Confluence user id.
 
*   Attribute name: Name of the attribute where User Id can be expected.
 
*   Enable Home Realm Discovery: Check this flag if the company using the ADFS-based login.
 
*   Domain Name: Provide the domain name here in case of the ADFS-based login
 
*   Enable Single Sign out: Check this office if you wish to log out from Azure AD when a user logs out from Jira/Confluence.

### Troubleshooting

* You're getting multiple certificates errors:
    
  Login to Azure AD and remove the multiple certificates available against the app. Ensure that there is only one certificate present.

* A certificate is about to expire in Azure AD:
    
  Add-ons take care of auto rollover of the certificate. When a certificate is about to be expired, new certificate should be marked active and unused certificate should be deleted. When a user tries to login to Jira in this scenario, add-on fetches the new certificate and save in plugin.

* You want to disable WebSudo(disable the secure administrator session):
    
  * Jira: Secure administrator sessions (that is, password confirmation before accessing administration functions) are enabled by default. If you wish to disable this in your Jira instance, you can disable this feature by specifying the following line in your jira-config.properties file: “ira.websudo.is.disabled = true”
    
  * Confluence: Follow the steps provided stated in following URL https://confluence.atlassian.com/doc/configuring-secure-administrator-sessions-218269595.html

* Fields that are supposed to be populated by Metadata URL are not getting populated:
    
  * Check if the URL is correct. Check if you have mapped the correct tenant and app id.
    
  * Hit the URL from browser and see if you are receiving the federation metadata XML.

* There's an internal server error:
    
  Go through the logs present in logs directory of the installation. If you are getting the error when user is trying to login using Azure AD SSO, you can share the logs with the Support information provided below in this document.

* There's a User ID not found error when the user tries to login:
    
  User is not created in Jira/Confluence, so create the same.

* There's an App not found error in Azure AD:
    
  See if the appropriate URL is mapped to the app in Azure AD.

* You need support: 

  Reach out to the [Azure AD SSO Integration Team](<mailto:SaaSApplicationIntegrations@service.microsoft.com>). We respond within 24-48 business hours.
    
  You can also raise a support ticket with Microsoft through the Azure portal channel.