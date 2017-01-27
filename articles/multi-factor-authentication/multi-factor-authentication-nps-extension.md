---
title: Use existing NPS servers to provide Azure MFA capabilities | Microsoft Docs
description: The NPS extension for Azure Multi-Factor Authentication is a simple solution to add cloud-based two-step vericiation capabilities to your existing authentication infrastructure.
services: multi-factor-authentication
documentationcenter: ''
author: kgremban
manager: femila
editor: yossib

ms.assetid:
ms.service: multi-factor-authentication
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/27/2017
ms.author: kgremban

---
# Augment your existing authentication infrastructure with the NPS extension for Azure Multi-Factor Authentication

The NPS extension for Azure MFA provides a simple solution to add cloud-based MFA capabilities to your authentication infrastructure using your existing NPS servers. With the NPS extension, you can add phone call, SMS, or phone app verification to your existing authentication flow without having to install, configure and maintain new servers. 
 
When using the NPS extension for Azure MFA, the authentication flow includes the following components: 

1. NAS Server/VPN Server: VPN servers that receives requests from VPN clients and converts them into RADIUS requests to NPS servers. 
2. NPS Server: NPS servers connect to Active Directory to perform the primary authentication for the RADIUS requests, and upon success, pass over the request to any installed extensions.  
3. NPS Extension: Triggers an MFA request to Azure cloud-based MFA for performing the secondary authentication. Once it receives the response, and if the MFA challenge succeeds, completes the authentication request by providing the NPS server with security tokens that include an MFA claim, issued by Azure STS.  
4. Azure MFA: a cloud component that communicates with Azure Active Directory to retrieve the user’s details and performs the secondary authentication using a verification method configured to the user.

The following diagram illustrates a high-level authentication request flow: 

![Authentication flow diagram](./media/multi-factor-authentication-nps-extension/auth-flow.png)

## Prerequisites

The NPS extension is meant to work with your existing infrastructure. Make sure you have the following prerequisites before you begin.

### Licenses

The NPS Extension for Azure MFA is available to customers with [licenses for Azure Multi-Factor Authentication](https://docs.microsoft.com/en-us/azure/multi-factor-authentication/multi-factor-authentication) (included with Azure AD Premium, EMS, or an MFA subscription).

### Software

Windows Server 2008 R2 SP1 or above with the NPS component enabled

### Libraries

Two libraries are required for the NPS extension. They're installed during the setup process:

-	Microsoft Visual Studio 2013 C++ Redistributable (X64)
-	Microsoft Azure Active Directory Module for Windows PowerShell Ver 1.1.166

### Azure Active Directory

Everyone using the NPS extension must be synced to Azure Active Directory using Azure AD Connect, and must be enabled for MFA. Two-step verification must be [turned on for these users](multi-factor-authentication-get-started-cloud.md).

When you install the extension, you need the tenant ID and admin credentials for your Azure AD tenant. You can find the tenant ID (a.k.a. ‘Directory ID’) in the [Azure Portal](https://portal.azure.com). Sign in as an administrator, select the **Azure Active Directory** icon on the left, then select **Properties**. Copy the GUID in the **Directory ID** box.

[Find your Directory ID under Azure Active Directory properties](./media/multi-factor-authentication-nps-extension/find-directory-id.png)

## Install the extension

To install the NPS Extension for Azure MFA:

1.	Download it from the Microsoft Download Center
2.	Copy the binary to the NPS Server you want to configure
3.	Run *setup.exe* and follow the installation instructions

Once you complete the installation, the installer creates a PowerShell script in this location: `C:\Program Files\Microsoft\AzureMfa\Config` (where C:\ is your installation drive). This PowerShell script performs the following actions:

-	Create a self-signed certificate.
-	Associate the public key of the certificate to the service principal on Azure AD.
-	Store the cert in the local machine cert store.
-	Grant access to the certificate’s private key to Network User.
-	Restart NPS.

Unless you want to use your own certificates (instead of the self-signed certificates that the PowerShell script generates), run the PowerShell Script to complete the installation.
