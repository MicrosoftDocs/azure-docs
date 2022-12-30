---
title: Troubleshooting Enterprise SSO Extension Plugin on macOS Devices
description: This article helps to troubleshoot deploying the Apple SSO Extension PlugIn on macOS operating system.

services: active-directory
ms.service: active-directory
ms.subservice: devices
ms.topic: troubleshooting
ms.date: 12/29/2022

ms.author: Ryan Schwartz
author: ryschwa-msft
manager: 
ms.reviewer: 

#Customer intent: As an IT admin, I want to learn how to discover and fix issues related to the Enterprise SSO extension plugin on the macOS.

ms.collection: M365-identity-device-management
---
# Troubleshooting Enterprise SSO Extension Plugin on macOS Devices
## Background
Organizations that are opting to provide a better experience for their end users on the macOS platform, involves implementing Single Sign On (SSO) of its applications with an Identity Provider (Idp).  This relieves end users with the burden of excessive authentication prompts. 

Apple has developed an **SSO extension framework** where when deployed via Mobile Device Management (MDM) to a macOS device, functions as an authentication broker for a collection of applications secured by the same Identity provider (IdP). Microsoft has implemented a plugin built on top Apple's SSO framework, which provides brokered authentication (auth) for applications integrated with Microsoft Entra Azure Active Directory (AAD).

Microsoft has implementations for brokered authentication for the following client operating systems:
|**OS**       |Authentication Broker  |
|---------|---------              |
|Windows     |WAM         |
|iOS/iPadOS     | Microsoft Authenticator|
|Android     |Microsoft Authenticator or Microsoft Intune Company Portal         |
|macOS |Microsoft Intune Company Portal (via SSO Extension) |




 
## Purpose
This article provides troubleshooting guidance used to assist macOS administrators to resolving issues that arise with deploying the [Enterprise SSO plugin](../develop/apple-sso-plugin.md). The Apple SSO extension can also be deployed to iOS, however this article focuses on macOS troubleshooting. 
 

## Troubleshooting Model
The following flowchart outlines a logical process flow to approach the troubleshooting steps.  The rest of this article will go into detail on the steps depicted in this flowchart. The troubleshooting can be broken down into two separate focus areas: [Deployment](#deployment-troubleshooting) and [Application Auth Flow](#application-auth-flow-troubleshooting)
:::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/macos-enterprise-sso-tsg-model.png" alt-text="Screenshot of flowchart showing the troubleshooting process flow for macOS extension"lightbox="media/troubleshoot-mac-sso-extension-plugin/macos-enterprise-sso-tsg-model.png":::  
## Deployment Troubleshooting
The majority of issues that customers encounter, stems from either improper Mobile Device Management (MDM) configuration(s) of the SSO extension profile, or an inability for the macOS device to receive the configuration profile from the MDM. This section will cover the steps you can take to ensure successful deployment.  
### Deployment Requirements:
- macOS operating system: **version 10.15 (Catalina)** or greater
- Device is managed by any MDM vendor that supports [Apple macOS](https://support.apple.com/en-ca/guide/deployment/dep1d7afa557/web)  (MDM Enrollment)
- Authentication Broker Software installed: [**Microsoft Intune Company Portal**](https://aka.ms/enrollmymac)

#### Check macOS Operating System Version
1. From the macOS device, click on the Apple icon in the top left corner and select **About This Mac**
:::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/about-this-mac.png" alt-text="Screenshot showing the about my mac":::
1. This will result in a popup showing basic system information. The operating system version will be listed beside macOS
:::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/about-this-mac-info.png" alt-text="Screenshot showing the about this mac basic system information":::


   

## Application Auth Flow Troubleshooting
