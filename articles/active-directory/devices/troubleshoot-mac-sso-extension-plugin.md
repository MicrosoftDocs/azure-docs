---
title: Troubleshooting Enterprise SSO Extension Plugin on macOS Devices
description: This article helps to troubleshoot deploying the Apple SSO Extension PlugIn on macOS operating system.

services: active-directory
ms.service: active-directory
ms.subservice: devices
ms.topic: troubleshooting
ms.date: 12/29/2022

ms.author: ryschwa
author: ryschwa-msft
manager: 
ms.reviewer: 

#Customer intent: As an IT admin, I want to learn how to discover and fix issues related to the Enterprise SSO extension plugin on the macOS.

ms.collection: M365-identity-device-management
---
# Troubleshooting Apple Enterprise SSO Extension Plugin on macOS Devices
## Background
Organizations that are opting to provide a better experience for their end users on the macOS platform, involves implementing Single Sign On (SSO) of its applications with an Identity Provider (Idp).  This relieves end users with the burden of excessive authentication prompts. 

Apple has developed an **[SSO extension framework](https://devstreaming-cdn.apple.com/videos/tutorials/20190910/301fgloga45ths/introducing_extensible_enterprise_sso/introducing_extensible_enterprise_sso.pdf?dl=1)** where when deployed via Mobile Device Management (MDM) to a macOS device, functions as an authentication broker for a collection of applications secured by the same Identity provider (IdP). Microsoft has implemented a plugin built on top Apple's SSO framework, which provides brokered authentication (auth) for applications integrated with Microsoft Entra Azure Active Directory (AAD). For more details please see the article [Microsoft Enterprise SSO plug-in for Apple devices](../develop/apple-sso-plugin.md).

Microsoft has implementations for brokered authentication for the following client operating systems:
|**OS**       |**Authentication Broker**  |
|---------|---------|
|Windows     |Web Account Manager (WAM)         |
|iOS/iPadOS     | Microsoft Authenticator|
|Android     |Microsoft Authenticator or Microsoft Intune Company Portal         |
|macOS |Microsoft Intune Company Portal (via SSO Extension) |

The common theme that all brokered authentications have in is they all acquire a key artifact known has a Primary Refresh Token (PRT), which is a JSON Web Token (JWT) used to acquire access tokens for applications and web resources secured with AAD. When deployed through an MDM, the Enterprise SSO extension obtains a PRT that is implemented very similar to the one Windows devices use with WAM. For more information please see the article [**What is a Primary Refresh Token?**](concept-primary-refresh-token.md)  
## Purpose
This article provides troubleshooting guidance used to assist macOS administrators to resolving issues that arise with deploying the [Enterprise SSO plugin](../develop/apple-sso-plugin.md). The Apple SSO extension can also be deployed to iOS/iPadOS, however this article focuses on macOS troubleshooting. 
 ## Troubleshooting Model
The following flowchart outlines a logical process flow to approach the troubleshooting steps.  The rest of this article will go into detail on the steps depicted in this flowchart. The troubleshooting can be broken down into two separate focus areas: [Deployment](#deployment-troubleshooting) and [Application Auth Flow](#application-auth-flow-troubleshooting).
:::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/macos-enterprise-sso-tsg-model.png" alt-text="Screenshot of flowchart showing the troubleshooting process flow for macOS extension" lightbox="media/troubleshoot-mac-sso-extension-plugin/macos-enterprise-sso-tsg-model.png":::
### macOS Spotlight Configuration
The guidance in this article assumes that **Spotlight** has been properly indexed. If by chance you are having issues with **Spotlight** resolving applications, use the following procedure to fix the indexing:

1. From the macOS device, click on **Finder** icon in the  **Dock**
:::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/mac-dock-icon.png" alt-text="Screenshot showing the finder icon located on the dock":::
1. After clicking on the Finder icon, click on the **Go** menu in the top navigation and select **Utilities** 
:::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/finder-go-utilities.png" alt-text="Screenshot showing the Go menu to launch the utilities":::
1. From the **Utilities** window double-click the **Terminal** app
:::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/utilities-window.png" alt-text="Screenshot showing the Ultilities window with the Terminal app highlighted":::
1. When the **Terminal** app opens type **sudo mdutil -a -i on /** at the prompt
    ```
    % sudo mdutil -a -i on /
    Password:
    /:
        Indexing enabled.
    /System/Volumes/Data:
        Indexing enabled.
    /System/Volumes/Preboot:
        Indexing enabled.
    ```  
    >[!Important] 
    >**sudo** will prompt for the administrator's password
## Deployment Troubleshooting
The majority of issues that customers encounter, stems from either improper Mobile Device Management (MDM) configuration(s) of the SSO extension profile, or an inability for the macOS device to receive the configuration profile from the MDM. This section will cover the steps you can take to ensure successful deployment.  
### Deployment Requirements:
- macOS operating system: **version 10.15 (Catalina)** or greater
- Device is managed by any MDM vendor that supports [Apple macOS](https://support.apple.com/en-ca/guide/deployment/dep1d7afa557/web)  (MDM Enrollment)
- Authentication Broker Software installed: [**Microsoft Intune Company Portal**](https://learn.microsoft.com/en-us/mem/intune/apps/apps-company-portal-macos)

These requirements are only applicable to macOS. For the full list of requirements other Apple platforms (including iOS and iPadOS), please see the [Apple SSO plugin Requirements](../develop/apple-sso-plugin.md#requirements).

#### Check macOS Operating System Version
Use the following steps to check the operating system (OS) version on the macOS device. Apple SSO Extension profiles will only be deployed to devices running  **macOS 10.15 (Catalina)** or greater. You can check the macOS version from either the [User Interface](#user-interface) or from the [Terminal](#terminal).
##### User Interface
1. From the macOS device, click on the Apple icon in the top left corner and select **About This Mac**
:::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/about-this-mac.png" alt-text="Screenshot showing the about my mac":::
1. This will result in a popup showing basic system information. The operating system version will be listed beside macOS
:::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/about-this-mac-info.png" alt-text="Screenshot showing the about this mac basic system information":::
##### Terminal
1.  From the macOS device, click on the **spotlight icon** <img width="30" height="30" src="media/troubleshoot-mac-sso-extension-plugin/spotlight-icon.png" alt-text="screenshot showing the macOS spotlight icon">
1. When the **Spotlight Search** appears type **Terminal** and hit **return**:::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/launch-terminal-from-spotlight.png" alt-text="screenshot showing terminal being launched from spotlight":::
1. When the Terminal opens type **sw_vers** at the prompt
    ```
    % sw_vers
    ProductName: macOS
    ProductVersion: 13.0.1
    BuildVersion: 22A400
    ``` 
#### MDM Deployment of SSO Extension Profile
Please work with your MDM administrator (or Device Management team) to ensure that the extension configuration profile is deployed to the macOS devices. The extension profile can be deployed from any MDM that supports macOS devices. 
>[!Important]
> Apple mandates that devices must be enrolled into an MDM for the SSO Extension to be deployed.  

The following table provides specific MDM installation guidance depending on which MDM vendor:

|MDM   |Installation Documentation   | Broker Software
|---------|---------|---------|
|Microsoft Intune     |[Use the Microsoft Enterprise SSO plug-in on iOS/iPadOS and macOS devices in Microsoft Intune](https://learn.microsoft.com/en-us/mem/intune/configuration/use-enterprise-sso-plug-in-ios-ipados-macos)         |Inune Company Portal already required for devices managed by Intune       |
|JAMF Pro     |[Use the Microsoft Enterprise SSO plug-in on iOS/iPadOS and macOS devices in Jamf Pro](https://learn.microsoft.com/mem/intune/configuration/use-enterprise-sso-plug-in-ios-ipados-macos-with-jamf-pro)|Intune Company Portal needs to be installed. See JAMF documentation: [Deploy Company Portal](https://docs.jamf.com/technical-papers/jamf-pro/microsoft-intune/10.34.0/Deploy_the_Company_Portal_App_from_Microsoft_to_End_Users.html) Download: [Intune Company Portal for macOS](https://aka.ms/enrollmymac)          |
|     |         |         |
|Other 3rd Party MDM     |Please consult any vendor specific documentation for how to deploy SSO extension profiles and reference our documentation on [Manual Configuration for other MDM Services](../develop/apple-sso-plugin.md#manual-configuration-for-other-mdm-services)|Intune Company Portal needs to be installed. See MDM vendor documentation. Download: [Intune Company Portal for macOS](https://aka.ms/enrollmymac)
>[!NOTE]
> At the present time the Microsoft SSO Extension broker plugin code is bundled into the Microsoft Intune Company Portal app.  In the future we might decide to separate this into its own app, thus requiring a separate app installation on the macOS device.            
#### Validate SSO Configuration Profile on macOS Device 
Assuming the MDM administrator has followed the steps in the previous section [MDM Deployment of SSO Extension Profile](#mdm-deployment-of-sso-extension-profile), we need to verify if the profile has been deployed:

1.  From the macOS device, click on the **spotlight icon** <img width="30" height="30" src="media/troubleshoot-mac-sso-extension-plugin/spotlight-icon.png" alt-text="screenshot showing the macOS spotlight icon">
1. When the **Spotlight Search** appears type **Profiles** and hit **return**:::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/launch-profiles-from-spotlight.png" alt-text="screenshot showing Profiles being launched from spotlight":::
1. This should bring up the **Profiles** panel within the **System Settings**
:::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/profiles-within-system-settings.png" alt-text="":::
    >[!NOTE] Depending on the type of MDM being used, there could be several profiles listed and their naming scheme is arbitrary depending on the MDM configuration.  By double-clicking each one and inspect that the **Settings** row indicates that it is a **Single Sign On Extension**.
1. Double-click on the configuration profile that matches a **Settings** value of **Single Sign On Extension**
:::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/sso-extension-config-profile.png" alt-text="screnshot showing sso extension configuration profile":::
    



  




   

## Application Auth Flow Troubleshooting
