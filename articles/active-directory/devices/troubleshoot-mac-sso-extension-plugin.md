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

### Redirect vs Credential Extension Types
Apple supports two distinct types of SSO Extensions that are part of its framework: **Redirect** and **Credential**. The Microsoft Enterprise SSO plugin has been implemented as a Redirect type and is best suited for brokering authentication to Azure AD.  The following table compares the two types of extensions.

|**Extension Type**|**Best Suited For**|**How it Works**|**Key Differences**|
|---------|---------|---------|---------|
|Redirect|Modern authentication methods such as OpenID Connect, OAUTH2, and SAML (Azure Active Directory)| Operating System intercepts the authentication request from the application to the Identity provider URLs defined in the extension MDM configuration profile. Redirect extensions receive: URLs, headers, and body.| Request credentials before requesting data. Uses URLs in MDM configuration profile|
|Credential|Challenge and response authentication types like **Kerberos** (On-Premises Active Directory Domain Services)| Request is sent from the application to the authentication server (AD domain controller). Credential extensions are configured with HOSTS in the MDM configuration profile, if the authentication server returns a challenge that matches a host listed in the profile, the operating system will route the challenge to the extension. The extension has the choice of handling or rejecting the challenge. If handled, the extension returns the authorization headers to complete the request and authentication server will return response to the caller.|Request data then get challenged for authentication. Use HOSTs in MDM configuration profile |


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
:::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/macos-enterprise-sso-tsg-model.png.png" alt-text="Screenshot of flowchart showing the troubleshooting process flow for macOS extension" lightbox="media/troubleshoot-mac-sso-extension-plugin/macos-enterprise-sso-tsg-model.png":::
### macOS Spotlight Configuration
The guidance in this article assumes that **Spotlight** has been properly indexed. If by chance you are having issues with **Spotlight** resolving applications, use the following procedure to fix the indexing:

1. From the macOS device, click on **Finder** icon in the  **Dock**
:::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/mac-dock-icon.png" alt-text="Screenshot showing the finder icon located on the dock":::
1. Click on the **Go** menu in the top navigation and select **Utilities** 
:::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/finder-go-utilities.png" alt-text="Screenshot showing the Go menu to launch the utilities":::
1. From the **Utilities** window double-click the **Terminal** app
:::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/utilities-window.png" alt-text="Screenshot showing the Ultilities window with the Terminal app highlighted":::
1. When the **Terminal** app opens type **`sudo mdutil -a -i on /`** at the prompt
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
- Device is managed by any MDM vendor that supports [Apple macOS](https://support.apple.com/guide/deployment/dep1d7afa557/web)  (MDM Enrollment)
- Authentication Broker Software installed: [**Microsoft Intune Company Portal**](https://learn.microsoft.com/mem/intune/apps/apps-company-portal-macos)

These requirements are only applicable to macOS. For the full list of requirements other Apple platforms (including iOS and iPadOS), please see the [Apple SSO plugin Requirements](../develop/apple-sso-plugin.md#requirements).

#### Check macOS Operating System Version
Use the following steps to check the operating system (OS) version on the macOS device. Apple SSO Extension profiles will only be deployed to devices running  **macOS 10.15 (Catalina)** or greater. You can check the macOS version from either the [User Interface](#user-interface) or from the [Terminal](#terminal).
##### User Interface
1. From the macOS device, click on the Apple icon in the top left corner and select **About This Mac**
:::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/about-this-mac.png" alt-text="Screenshot showing the about my mac":::
1. The Operating system version will be listed beside **macOS**
:::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/about-this-mac-info.png" alt-text="Screenshot showing the about this mac basic system information":::
##### Terminal
1.  From the macOS device, click on the **spotlight icon**
:::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/spotlight-icon.png" alt-text="screenshot showing the macOS spotlight icon"::: 
1. When the **Spotlight Search** appears type **Terminal** and hit **return**:::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/launch-terminal-from-spotlight.png" alt-text="screenshot showing terminal being launched from spotlight":::
1. When the Terminal opens type **sw_vers** at the prompt
    ```
    % sw_vers
    ProductName: macOS
    ProductVersion: 13.0.1
    BuildVersion: 22A400
    ``` 
#### MDM Deployment of SSO Extension Configuration Profile
Please work with your MDM administrator (or Device Management team) to ensure that the extension configuration profile is deployed to the macOS devices. The extension profile can be deployed from any MDM that supports macOS devices. 
>[!Important]
> Apple mandates that devices must be enrolled into an MDM for the SSO Extension to be deployed.  

The following table provides specific MDM installation guidance depending on which MDM vendor:

|MDM   |Installation Documentation   | Broker Software |
|---------|---------|---------|
|Microsoft Intune     |[Use the Microsoft Enterprise SSO plug-in on iOS/iPadOS and macOS devices in Microsoft Intune](https://learn.microsoft.com/mem/intune/configuration/use-enterprise-sso-plug-in-ios-ipados-macos)         |Inune Company Portal already required for devices managed by Intune       
|JAMF Pro     |[Use the Microsoft Enterprise SSO plug-in on iOS/iPadOS and macOS devices in JAMF Pro](https://learn.microsoft.com/mem/intune/configuration/use-enterprise-sso-plug-in-ios-ipados-macos-with-jamf-pro)|Intune Company Portal needs to be installed. See JAMF documentation: [Deploy Company Portal](https://docs.jamf.com/technical-papers/jamf-pro/microsoft-intune/10.34.0/Deploy_the_Company_Portal_App_from_Microsoft_to_End_Users.html) Download: [Intune Company Portal for macOS](https://aka.ms/enrollmymac) |          
| Other 3rd Party MDM     |Please consult any vendor specific documentation for how to deploy SSO extension profiles and reference our documentation on [Manual Configuration for other MDM Services](../develop/apple-sso-plugin.md#manual-configuration-for-other-mdm-services)|Intune Company Portal needs to be installed. See MDM vendor documentation. Download: [Intune Company Portal for macOS](https://aka.ms/enrollmymac)
>[!Important]
>Although, any MDM is supported for deploying the SSO Extension, most organizations implement [**device-based conditional access polices**](../conditional-access/concept-conditional-access-grant#require-device-to-be-marked-as-compliant) by way of evaluating MDM compliance policies. If by chance a third-party MDM is being used, please ensure that the MDM vendor supports [**Intune Partner Compliance**](https://learn.microsoft.com/mem/intune/protect/device-compliance-partners). When the SSO Extension is deployed via Intune or an MDM provider that supports Intune Partner Compliance, the extension can pass the device certificate to Azure AD so that device authentication can be completed.

>[!NOTE] 
>At the present time the Microsoft SSO Extension broker plugin code is bundled into the Microsoft Intune Company Portal app.  In the future we might decide to separate this into its own app, thus requiring a separate app installation on the macOS device.            

#### Validate SSO Configuration Profile on macOS Device 
Assuming the MDM administrator has followed the steps in the previous section [MDM Deployment of SSO Extension Profile](#mdm-deployment-of-sso-extension-profile), we need to verify if the profile has been deployed.

##### Locate SSO Extension MDM Configuration Profile
1.  From the macOS device, click on the **spotlight icon** 
:::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/spotlight-icon.png" alt-text="screenshot showing the macOS spotlight icon":::
1. When the **Spotlight Search** appears type **Profiles** and hit **return**:::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/launch-profiles-from-spotlight.png" alt-text="screenshot showing Profiles being launched from spotlight":::
1. This should bring up the **Profiles** panel within the **System Settings**
:::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/profiles-within-system-settings.png" alt-text="Screenshot showing configuration profiles":::
    
    >[!NOTE] 
    >Depending on the type of MDM being used, there could be several profiles listed and their naming scheme is arbitrary depending on the MDM configuration.  By double-clicking each one and inspect that the **Settings** row indicates that it is a **Single Sign On Extension**.
1. Double-click on the configuration profile that matches a **Settings** value of **Single Sign On Extension**
:::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/sso-extension-config-profile.png" alt-text="screenshot showing sso extension configuration profile":::
    
    All Apple SSO Redirect Extensions must have the following MDM Payload components in the configuration profile:
    
    |**MDM Payload Component**|**Description**  |
    |---------|---------|
    |**Extension Identifier**     |Includes both the Bundle Identifier and Team Identifier of the application on the macOS device, that is running the Extension. Note: The Microsoft Enterprise SSO Extension should always be set to: **com.microsoft.CompanyPortalMac.ssoextension (UBF8T346G9)** to inform the macOS operating system that the extension client code is part of the **Intune Company Portal application**.         |
    |**Type**     |Must be set to **Redirect** to indicate a **Redirect Extension** type         |
    |**URLs**     |These are endpoint URLs of the identity provider (Azure AD), where the operating system routes authentication requests to the extension         |
    |**Optional Extension Specific Configuration**    |These are dictionary values that may act as configuration parameters. Microsoft Enterprise SSO Extension refers to these as feature flags. See [feature flag definitions](../develop/apple-sso-plugin.md#more-configuration-options).          |

    

    >[!NOTE] 
    >The MDM definitions of the Apple's SSO Extension profile can be referenced in the article [Extensible Single Sign-on MDM payload settings for Apple devices](https://support.apple.com/guide/deployment/depfd9cdf845/web) Microsoft has implemented our extension based on this schema. See [Microsoft Enterprise SSO plug-in for Apple devices](../develop/apple-sso-plugin.md#manual-configuration-for-other-mdm-services)
1. To verify that we have the correct profile for the Microsoft Apple SSO Extension the  **Extension** field should match: **com.microsoft.CompanyPortalMac.ssoextension (UBF8T346G9)**
1. Take note of the **Installed** field in the configuration profile as it can be a useful troubleshooting indicator, when changes are made to its configuration

If the correct configuration profile has been verified, please proceed to the [Application Auth Flow Troubleshooting](#application-auth-flow-troubleshooting) section.

##### MDM Configuration Profile is Missing
If the SSO extension configuration profile does not appear in the **Profiles** after following the [previous section](#locate-sso-extension-mdm-configuration-profile), it could be that the MDM configuration has User/Device targeting enabled which is effectively **filtering out** the logged in user or the device from receiving the configuration profile. Please check with your MDM administrator and collect the **Console** logs found in the [next section](#collect-mdm-specific-console-logs).

###### Collect MDM Specific Console Logs        
1. From the macOS device, click on the **spotlight icon** 
:::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/spotlight-icon.png" alt-text="screenshot showing the macOS spotlight icon":::
1. When the **Spotlight Search** appears, type **Console** and hit **return**:::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/console-from-spotlight-searchbar.png" alt-text="screenshot showing Console being launched from spotlight":::
1. Click the **Start** button to enable the Console trace logging
:::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/console-window-start-button.png" alt-text="Screenshot showing the Console app and the start button being clicked":::
1. Have the MDM administrator try to re-deploy the config profile to this macOS device/user and force a sync cycle 
1. Type **subsystem:com.apple.ManagedClient** into the **search bar** and hit **return**
:::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/console-subsystem-filter.png" alt-text="Screenshot showing the Console app with the subsystem filter":::
1. Where the cursor is flashing in the **search bar** type **message:Extensible**
:::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/filter-console-message-extensible.png" alt-text="Screenshot showing the console being further filtered on the message field":::
1. You should now see the MDM Console logs filtered on **Extensible SSO** configuration profile activities. The following screenshot shows a log entry **Installed configuration profile**, showing that the configuration profile was installed.
:::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/console-logs-extensible-message.png" alt-text="Screenshot showing a sample of an installed configuration profile in console logs" lightbox="media/troubleshoot-mac-sso-extension-plugin/console-logs-extensible-message.png":::

## Application Auth Flow Troubleshooting
The guidance in this section assumes that the macOS device has a correctly deployed configuration profile. See [Validate SSO Configuration Profile on macOS Device](#validate-sso-configuration-profile-on-macos-device) for the steps.

 

 


Once deployed the **Microsoft Enterprise SSO Extension for Apple devices** supports two types of application authentication flows for each application type. When troubleshooting it's important to understand the type of application being used.



### Application Types
|**Application Type**  |**Interactive Auth**  |**Silent Auth**|**Description**|**Examples**|
|---------|---------|---------|---------|---------|
| [**Native MSAL App**](../develop/apple-sso-plugin.md#applications-that-use-msal)     |    X     |    X     | MSAL (Microsoft Authentication Library) which is a application developer framework tailored for building applications with the Microsoft Identity platform (Azure AD).<br>Apps that are built on **MSAL version 1.1 or greater** have the option to integrate with the Microsoft Enterprise SSO Extension.<br>*If the application is SSO extension (broker) aware it will utilize the extension without any further configuration* See our [MSAL developer sample documenation](https://github.com/AzureAD/microsoft-authentication-library-for-objc)  | Microsoft Teams<br>Microsoft To Do 
|[**Non-MSAL Native/Browser SSO**](../develop/apple-sso-plugin.md#applications-that-dont-use-msal)     |         |    X     |Applications that adhere to Apple networking technologies or webviews can be configured to obtain a shared credential from the SSO Extension<br>Feature flags must be configured to ensure that the bundle Id for each app is allowed to obtain the shared credential (PRT). 

>[!Important]
>Not all Microsoft first-party native applications are using MSAL framework.  At the time of this article publication, most of the Microsoft Office macOS applications still rely on the older ADAL library framework, and thus relies on the Browser SSO flow. The product teams are working to have the latest versions of most first-party applications. 

#### How to Find the Bundle Id for an Application on macOS
1.  From the macOS device, click on the **spotlight icon**
:::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/spotlight-icon.png" alt-text="screenshot showing the macOS spotlight icon"::: 
1. When the **Spotlight Search** appears type **Terminal** and hit **return**:::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/launch-terminal-from-spotlight.png" alt-text="screenshot showing terminal being launched from spotlight":::
1. When the Terminal opens type **`osascript -e 'id of app "<appname>"'`** at the prompt. See some examples below:
    ```
    % osascript -e 'id of app "Safari"'
    com.apple.Safari

    % osascript -e 'id of app "OneDrive"'
    com.microsoft.OneDrive

    % osascript -e 'id of app "Microsoft Edge"'
    com.microsoft.edgemac
    ``` 
1. Now that the bundle Id(s) have been gathered, please follow our [guidance to configure the feature flags](../develop/apple-sso-plugin.md#enable-sso-for-all-apps-with-a-specific-bundle-id-prefix) to ensure that the **Non-MSAL Native/Browser SSO** can utilize the SSO Extension.  **Note: All bundle ids are case sensitive for the Feature flag configuration**.
>[!Caution]
>Applications that do not use Apple Networking technologies (**i.e. WKWebview and NSURLSession**) will not be able to use the shared credential (PRT) from the SSO Extension. Both **Google Chrome** and **Mozilla Firefox** fall into this category. Even if they are configured in the MDM configuration profile, the result will be a regular authentication prompt in the browser. 

### Bootstrapping
By default only MSAL apps invoke the SSO Extension, and then in turn the Extension acquires a shared credential (PRT) from Azure AD. However, the **Safari** browser application or other NON-MSAL applications can be configured to acquire the PRT. Please see [Allow users to sign in from unknown applications and the Safari browser](../develop/apple-sso-plugin.md#allow-users-to-sign-in-from-unknown-applications-and-the-safari-browser). After the SSO Extension acquires a PRT, it will store the credential in the user's login Keychain. Now let's check to ensure that the PRT is present in the user's keychain.

#### Checking Keychain Access for PRT
1.  From the macOS device, click on the **spotlight icon** 
:::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/spotlight-icon.png" alt-text="screenshot showing the macOS spotlight icon":::
1. When the **Spotlight Search** appears, type **Keychain Access** and hit **return**:::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/keychain-access-from-spotlight.png" alt-text="screenshot showing Console being launched from spotlight"::: 
1. - Under **Default Keychains** select **login**<br>
   - Ensure that the **All Items** is selected
   -  In the search bar on the right-hand side type **primaryrefresh** (To filter)<br> 
    :::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/prt-located-in-keychainaccess.png" alt-text="screenshot showing how to find the PRT in Keychain access app":::Notice the naming convention of the PRT: **primaryfreshtoken-29d9ed98-a469-4536-ad32-f981bc1d605e--** The GUID happens to be the ClientID (AppID) of the **Microsoft Authentication Broker Service**, which handles the authentication requests for broker artifacts.
1. If the PRT is not found in the Keychain Access, do the following based on the application type:<br> 
    - **Native MSAL**: Check that the application developer, if the app was built with **MSAL version 1.1 or greater** and has enabled the application to be broker aware. Also, check [**Deployment Troubleshooting steps**](#deployment-troubleshooting) to rule out any deployment issues.
    - **Non MSAL (Safari)**: Check to ensure that the feature flag **`browser_sso_interaction_enabled`** is set to 1 and not 0




### Obtaining the SSO Extension Logs
By far the best tool to troubleshoot various issues with the SSO Extension are the client logs on the macOS device. 

#### Save SSO Extension Logs from Company Portal App 
1.  From the macOS device, click on the **spotlight icon** 
:::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/spotlight-icon.png" alt-text="screenshot showing the macOS spotlight icon":::
1. When the **Spotlight Search** appears, type **Company Portal** and hit **return**:::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/company-portal-access-from-spotlight.png" alt-text="screenshot showing Company Portal being launched from spotlight":::
1. When the **Company Portal** loads (Note: there is no need to Sign into the app), navigate to the top menu bar: **Help**->**Save diagnostic report**:::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/company-portal-help-save-diagnostic.png" alt-text="screenshot showing Help Diagnostic report":::
1. Save the Company Portal Log archive to place of your choice (e.g. Desktop)
1. Open the **CompanyPortal.zip** archive and Open the **SSOExtension.log** file with any text editor
>[!Tip]
>A handy way to view the logs is using [**Visual Studio Code**](https://code.visualstudio.com/download) and installing the [**Log Viewer**](https://marketplace.visualstudio.com/items?itemName=berublan.vscode-log-viewer) extension.  



#### Tailing SSO Extension Logs with Terminal
Often times during troubleshooting, it's best practice to reproduce a problem. By tailing the SSOExtension logs in real time will assist.

1.  From the macOS device, click on the **spotlight icon**
:::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/spotlight-icon.png" alt-text="screenshot showing the macOS spotlight icon"::: 
1. When the **Spotlight Search** appears type **Terminal** and hit **return**:::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/launch-terminal-from-spotlight.png" alt-text="screenshot showing terminal being launched from spotlight":::
1. When the Terminal opens type **`tail -F ~/Library/Containers/com.microsoft.CompanyPortalMac.ssoextension/Data/Library/Caches/Logs/Microsoft/SSOExtension/*`** Note: the trailing * indicates that multiple logs will be tailed should any exist
    ```
    % tail -F ~/Library/Containers/com.microsoft.CompanyPortalMac.ssoextension/Data/Library/Caches/Logs/Microsoft/SSOExtension/*
    ==> /Users/<username>/Library/Containers/com.microsoft.CompanyPortalMac.ssoextension/Data/Library/Caches/Logs/Microsoft/SSOExtension/SSOExtension 2022-12-25--13-11-52-855.log <==
    2022-12-29 14:49:59:281 | I | TID=783491 MSAL 1.2.4 Mac 13.0.1 [2022-12-29 19:49:59] Handling SSO request, requested operation: 
    2022-12-29 14:49:59:281 | I | TID=783491 MSAL 1.2.4 Mac 13.0.1 [2022-12-29 19:49:59] Ignoring this SSO request...
    2022-12-29 14:49:59:282 | I | TID=783491 MSAL 1.2.4 Mac 13.0.1 [2022-12-29 19:49:59] Finished SSO request.
    2022-12-29 14:49:59:599 | I | Beginning authorization request
    2022-12-29 14:49:59:599 | I | TID=783491 MSAL 1.2.4 Mac 13.0.1 [2022-12-29 19:49:59] Checking for feature flag browser_sso_interaction_enabled, value in config 1, value type __NSCFNumber
    2022-12-29 14:49:59:599 | I | TID=783491 MSAL 1.2.4 Mac 13.0.1 [2022-12-29 19:49:59] Feature flag browser_sso_interaction_enabled is enabled
    2022-12-29 14:49:59:599 | I | TID=783491 MSAL 1.2.4 Mac 13.0.1 [2022-12-29 19:49:59] Checking for feature flag browser_sso_disable_mfa, value in config (null), value type (null)
    2022-12-29 14:49:59:599 | I | TID=783491 MSAL 1.2.4 Mac 13.0.1 [2022-12-29 19:49:59] Checking for feature flag disable_browser_sso_intercept_all, value in config (null), value type (null)
    2022-12-29 14:49:59:600 | I | Request does not need UI
    2022-12-29 14:49:59:600 | I | TID=783491 MSAL 1.2.4 Mac 13.0.1 [2022-12-29 19:49:59] Checking for feature flag admin_debug_mode_enabled, value in config (null), value type (null)
   ```






1. As you reproduce the issue the keep **Terminal** window open to observe the output from the tailed **SSOExtension** logs

### Understanding the SSO Extension Logs

 


