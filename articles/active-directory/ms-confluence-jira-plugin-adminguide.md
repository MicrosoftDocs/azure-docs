---
title: 'Microsoft Azure Active Directory single sign-on Plugin Admin Guide | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Microsoft Azure Active Directory single sign-on for JIRA.
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
# Microsoft Azure Active Directory single sign-on Plugin Admin Guide

## Table of Contents

1. **[OVERVIEW](#overview)**
2. **[HOW IT WORKS](#how-it-works)**
3. **[AUDIENCE](#audience)**
4. **[ASSUMPTIONS](#assumptions)**
5. **[PREREQUISITES](#prerequisites)**
6. **[SUPPORTED VERSIONS OF JIRA AND CONFLUENCE](#supported-versions-of-jira-and-confluence)**
7. **[INSTALLATION](#installation)**
8. **[PLUGIN CONFIGURATION](#plugin-configuration)**
9. **[FIELD EXPLANATION FOR ADD-ON CONFIGURATION SCREEN:](#field-explanation-for-add---on-configuration-screen:)**
10. **[TROUBLESHOOTING](#troubleshooting)**

## Overview

These add-ons enable Microsoft Azure AD customers to use their Organization Username and password for login into the Atlassian Jira and Confluence Server based products. It implements SAML 2.0 based SSO.

## How it works

When users want to login to Atlassian Jira or Confluence application, they see the **Login with Azure AD** button on login page. When they click on it, they are required to login with the Azure AD Organization login page.

Once the users are authenticated, they should be able to login into the application. If they are already authenticated with Organization ID and password, then they directly log into the application. Also, note that login works across JIRA and Confluence. If users are logged into JIRA application and Confluence is also open in the same browser window, they need to login once and don't have to provide the credentials again for other app. The users can also get to the Atlassian product through myapps under Azure account and they should be logged in without being asked for the credentials.

> [!NOTE]
> User provisioning is not done using this add-on.

## Audience

JIRA and Confluence admins who are planning to use this plugin to enable SSO using Azure AD.

## Assumptions

* JIRA/Confluence instance is HTTPS enabled
* Users are already created in JIRA/Confluence
* Users have role assigned in JIRA/Confluence
* Admins have access to information required to configure the plugin
* JIRA/Confluence are available outside the company network as well
* Add on works with only On-premise version of JIRA and confluence

## Prerequisites

Note following prerequisites before you proceed ahead with add-on installation:

* JIRA/Confluence are installed on a Windows 64-bit version
* JIRA/Confluence versions are HTTPS enabled
* Note the supported version for Plugin in “Supported Versions” section below.
* JIRA/Confluence is available on internet.
* Admin credentials for JIRA/Confluence
* Admin credentials for Azure AD
* WebSudo should be disabled in JIRA and confluence

## Supported versions of JIRA and Confluence

As of now, following versions of JIRA and Confluence are supported:

* JIRA Core and Software: 6.0 to 7.2.0
* JIRA Service Desk: 3.0 to 3.2
* Confluence: 5.0 to 5.10

## Installation

Admin should follow the steps stated below to install the plugin:

1. Log in to your JIRA/Confluence instance as an Admin
	
2. Go to JIRA/Confluence Administration and click on Add-ons.
 	
3. From Atlassian Market place, search for **Microsoft SAML SSO Plugin**
 
4. Appropriate version of add-on appears in search
 
5. Select the plugin and UPM installs the same.
 
6. Once the plugin is installed, it appears in User Installed add-ons section of Manage Add-on section
 
7. You have to configure the plugin before you start using it.
 
8. Click on the plugin and you see a configure button.
 
9. Click on it to provide configuration inputs
	
## Plugin Configuration

Following image shows the add-on configuration screen in both JIRA and Confluence
    
![add-on configuration](./media/ms-confluence-jira-plugin-adminguide/jira.png)

### Field explanation for add-on configuration screen:

1.   Metadata URL: URL to get federation metadata from Azure AD
 
2.   Identifier: Used by Azure AD to validate the source of the request. This maps to Identifier element in Azure AD. This is auto derived by plugin as https://<domain:port>/
 
3.   Reply URL: Use Reply URL in your IdP to initiate the SAML login. This maps to the Reply URL element in Azure AD. This is auto derived by plugin as https://<domain:port>/plugins/servlet/saml/auth
 
4.   Sign On URL: Use Sign On URL in your IdP to initiate the SAML login. This maps to the Sign On element in Azure AD. This is auto derived by plugin as https://<domain:port>/plugins/servlet/saml/auth
 
5.   IdP Entity ID: The Entity ID that your IdP uses. This is populated when Metadata URL is resolved.
 
6.   Login URL: The Login URL from your IdP. This is populated from Azure AD when Metadata URL is resolved.
 
7.   Log out URL: The Logout URL from your IdP. This is populated from Azure AD when Metadata URL is resolved.
 
8.   X.509 Certificate: Your IdP’s X.509 certificate. This is populated from Azure AD when Metadata URL is resolved.
 
9.   Login Button Name: Name the login button your organization wants to see. This text is shown to users on login button on login screen.
 
10.   SAML User ID Locations: Where the user id is expected in SAML response. It could either be in NameID or in a custom attribute name. This ID has to be the JIRA/Confluence user id.
 
11.   Attribute name: Name of the attribute where User Id can be expected.
 
12.   Enable Home Realm Discovery: Check this flag if the company using the ADFS-based login.
 
13.   Domain Name: Provide the domain name here in case of the ADFS-based login
 
14.   Enable Single Sign out: Check this office if you wish to log out from Azure AD when a user logs out from JIRA/Confluence.

### Troubleshooting

* If you are getting multiple certificates errors
    
    * Login to Azure AD and remove the multiple certificates available against the app. Ensure that there is only one certificate present.

* Certificate is about to expire in Azure AD.
    
    * Add-ons take care of auto rollover of the certificate. When a certificate is about to be expired, new certificate should be marked active and unused certificate should be deleted. When a user tries to login to JIRA in this scenario, add-on fetches the new certificate and save in plugin.

* How to disable WebSudo(disable the secure administrator session)
    
    * JIRA: Secure administrator sessions (that is, password confirmation before accessing administration functions) are enabled by default. If you wish to disable this in your JIRA instance, you can disable this feature by specifying the following line in your jira-config.properties file: “ira.websudo.is.disabled = true”
    
    * Confluence: Follow the steps provided stated in following URL https://confluence.atlassian.com/doc/configuring-secure-administrator-sessions-218269595.html

* Fields that are supposed to be populated by Metadata URL are not getting populated
    
    * Check if the URL is correct. Check if you have mapped the correct tenant and app id.
    
    * Hit the URL from browser and see if you are receiving the federation metadata XML.

* Internal Server error:
    
    * Go through the logs present in logs directory of the installation. If you are getting the error when user is trying to login using Azure AD SSO, you can share the logs with the Support information provided below in this document.

* User ID not found error when user tries to login
    
    * User is not created in JIRA/Confluence, so create the same.

* App not found error in Azure AD
    
    * See if the appropriate URL is mapped to the app in Azure AD.

* Support details: Reach out to us on: [Azure AD SSO Integration Team](<mailto:SaaSApplicationIntegrations@service.microsoft.com>). We respond within 24-48 business hours.
    
    * You can also raise a support ticket with Microsoft through the Azure portal channel.