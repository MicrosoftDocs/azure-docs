---
title: Troubleshooting Enterprise SSO Extension Plug-In on macOS Devices
description: This article helps to troubleshoot deploying the Microsoft Enterprise SSO Plug-In on macOS operating system.

services: active-directory
ms.service: active-directory
ms.subservice: devices
ms.topic: troubleshooting
ms.date: 12/29/2022

ms.author: ryschwa
author: ryschwa-msft
manager: 
ms.reviewer: 

#Customer intent: As an IT admin, I want to learn how to discover and fix issues related to the Microsoft Enterprise SSO plug-in on macOS.

ms.collection: M365-identity-device-management
---
# Troubleshooting Microsoft Enterprise SSO Extension Plugin on macOS Devices
## Background
Organizations may opt to deploy SSO to their corporate devices to provide a better experience for their end users. On the macOS platform, this involves implementing Single Sign On (SSO) via [Primary Refresh Tokens](concept-primary-refresh-token.md).  SSO relieves end users of the burden of excessive authentication prompts.

Apple has developed an **[SSO extension framework](https://devstreaming-cdn.apple.com/videos/tutorials/20190910/301fgloga45ths/introducing_extensible_enterprise_sso/introducing_extensible_enterprise_sso.pdf?dl=1)** where IDP vendors, such as Microsoft with Azure AD, can provide plugins that enable SSO for MDM-managed devices. Microsoft has implemented such a plugin built on top of Apple's SSO framework, which provides brokered authentication for applications integrated with Microsoft Entra Azure Active Directory (Azure AD). For more information, see the article [Microsoft Enterprise SSO plug-in for Apple devices](../develop/apple-sso-plugin.md).

### Redirect vs Credential Extension Types
Apple supports two distinct types of SSO Extensions that are part of its framework: **Redirect** and **Credential**. The Microsoft Enterprise SSO plugin has been implemented as a Redirect type and is best suited for brokering authentication to Azure AD.  The following table compares the two types of extensions.

|**Extension Type**|**Best Suited For**|**How it Works**|**Key Differences**|
|---------|---------|---------|---------|
|Redirect|Modern authentication methods such as OpenID Connect, OAUTH2, and SAML (Azure Active Directory)| Operating System intercepts the authentication request from the application to the Identity provider URLs defined in the extension MDM configuration profile. Redirect extensions receive: URLs, headers, and body.| Request credentials before requesting data. Uses URLs in MDM configuration profile|
|Credential|Challenge and response authentication types like **Kerberos** (on-premises Active Directory Domain Services)| Request is sent from the application to the authentication server (AD domain controller). Credential extensions are configured with HOSTS in the MDM configuration profile. If the authentication server returns a challenge that matches a host listed in the profile, the operating system will route the challenge to the extension. The extension has the choice of handling or rejecting the challenge. If handled, the extension returns the authorization headers to complete the request, and authentication server will return response to the caller.|Request data then get challenged for authentication. Use HOSTs in MDM configuration profile |


Microsoft has implementations for brokered authentication for the following client operating systems:



|**OS**       |**Authentication Broker**  |
|---------|---------|
|Windows     |Web Account Manager (WAM)         |
|iOS/iPadOS     | Microsoft Authenticator|
|Android     |Microsoft Authenticator or Microsoft Intune Company Portal         |
|macOS |Microsoft Intune Company Portal (via SSO Extension) |

All Microsoft broker applications use a key artifact known as a Primary Refresh Token (PRT), which is a JSON Web Token (JWT) used to acquire access tokens for applications and web resources secured with Azure AD. When deployed through an MDM, the Enterprise SSO extension for macOS obtains a PRT that is similar to the PRTs used on Windows devices by the Web Account Manager (WAM). For more information, see the article [**What is a Primary Refresh Token?**](concept-primary-refresh-token.md)  
## Purpose
This article provides troubleshooting guidance used by macOS administrators to resolve issues with deploying and using the [Enterprise SSO plugin](../develop/apple-sso-plugin.md). The Apple SSO extension can also be deployed to iOS/iPadOS, however this article focuses on macOS troubleshooting. 
 ## Troubleshooting Model
The following flowchart outlines a logical flow for approaching troubleshooting the SSO Extension.  The rest of this article will go into detail on the steps depicted in this flowchart. The troubleshooting can be broken down into two separate focus areas: [Deployment](#deployment-troubleshooting) and [Application Auth Flow](#application-auth-flow-troubleshooting).
:::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/macos-enterprise-sso-tsg-model.png.png" alt-text="Screenshot of flowchart showing the troubleshooting process flow for macOS extension" lightbox="media/troubleshoot-mac-sso-extension-plugin/macos-enterprise-sso-tsg-model.png":::
## Deployment Troubleshooting
Most issues that customers encounter stem from either improper Mobile Device Management (MDM) configuration(s) of the SSO extension profile, or an inability for the macOS device to receive the configuration profile from the MDM. This section will cover the steps you can take to ensure that the MDM profile has been deployed to a Mac and that it has the correct configuration.
### Deployment Requirements:
- macOS operating system: **version 10.15 (Catalina)** or greater
- Device is managed by any MDM vendor that supports [Apple macOS](https://support.apple.com/guide/deployment/dep1d7afa557/web)  (MDM Enrollment)
- Authentication Broker Software installed: [**Microsoft Intune Company Portal**](https://learn.microsoft.com/mem/intune/apps/apps-company-portal-macos)

These requirements are only applicable to macOS. For the full list of requirements other Apple platforms (including iOS and iPadOS), see the [Apple SSO plugin Requirements](../develop/apple-sso-plugin.md#requirements).

#### Check macOS Operating System Version
Use the following steps to check the operating system (OS) version on the macOS device. Apple SSO Extension profiles will only be deployed to devices running  **macOS 10.15 (Catalina)** or greater. You can check the macOS version from either the [User Interface](#user-interface) or from the [Terminal](#terminal).

##### User Interface

1. From the macOS device, click on the Apple icon in the top left corner and select **About This Mac**
:::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/about-this-mac.png" alt-text="Screenshot showing the about my mac":::
1. The Operating system version will be listed beside **macOS**
:::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/about-this-mac-info.png" alt-text="Screenshot showing the about this mac basic system information":::

##### Terminal
1. From the macOS device, click on the **spotlight icon**
:::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/spotlight-icon.png" alt-text="screenshot showing the macOS spotlight icon":::
1. When the **Spotlight Search** appears type **Terminal** and hit **return**
1. When the Terminal opens type **sw_vers** at the prompt
    ```bash
    % sw_vers
    ProductName: macOS
    ProductVersion: 13.0.1
    BuildVersion: 22A400
    ```


#### MDM Deployment of SSO Extension Configuration Profile
Work with your MDM administrator (or Device Management team) to ensure that the extension configuration profile is deployed to the macOS devices. The extension profile can be deployed from any MDM that supports macOS devices. 
>[!Important]
> Apple mandates that devices must be enrolled into an MDM for the SSO Extension to be deployed.  

The following table provides specific MDM installation guidance depending on which MDM vendor:

|MDM   |Installation Documentation   | Broker Software |
|---------|---------|---------|
|Microsoft Intune     |[Use the Microsoft Enterprise SSO plug-in on iOS/iPadOS and macOS devices in Microsoft Intune](https://learn.microsoft.com/mem/intune/configuration/use-enterprise-sso-plug-in-ios-ipados-macos)         |Inune Company Portal already required for devices managed by Intune       
|JAMF Pro     |[Use the Microsoft Enterprise SSO plug-in on iOS/iPadOS and macOS devices in JAMF Pro](https://learn.microsoft.com/mem/intune/configuration/use-enterprise-sso-plug-in-ios-ipados-macos-with-jamf-pro)|Intune Company Portal needs to be installed. See JAMF documentation: [Deploy Company Portal](https://docs.jamf.com/technical-papers/jamf-pro/microsoft-intune/10.34.0/Deploy_the_Company_Portal_App_from_Microsoft_to_End_Users.html) Download: [Intune Company Portal for macOS](https://aka.ms/enrollmymac) |          
| Other third Party MDM     |Consult any vendor specific documentation for how to deploy SSO extension profiles and reference our documentation on [Manual Configuration for other MDM Services](../develop/apple-sso-plugin.md#manual-configuration-for-other-mdm-services)|Intune Company Portal needs to be installed. See MDM vendor documentation. Download: [Intune Company Portal for macOS](https://aka.ms/enrollmymac)
>[!Important]
>Although, any MDM is supported for deploying the SSO Extension, many organizations implement [**device-based conditional access polices**](../conditional-access/concept-conditional-access-grant#require-device-to-be-marked-as-compliant) by way of evaluating MDM compliance policies. If a third-party MDM is being used, ensure that the MDM vendor supports [**Intune Partner Compliance**](https://learn.microsoft.com/mem/intune/protect/device-compliance-partners) if you would like to use device-based Conditional Access policies. When the SSO Extension is deployed via Intune or an MDM provider that supports Intune Partner Compliance, the extension can pass the device certificate to Azure AD so that device authentication can be completed.        

#### Validate SSO Configuration Profile on macOS Device 
Assuming the MDM administrator has followed the steps in the previous section [MDM Deployment of SSO Extension Profile](#mdm-deployment-of-sso-extension-profile), the next step is to verify if the profile has been deployed successfully to the device.

##### Locate SSO Extension MDM Configuration Profile
1.  From the macOS device, click on the **spotlight icon** 
:::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/spotlight-icon.png" alt-text="screenshot showing the macOS spotlight icon":::
1. When the **Spotlight Search** appears type **Profiles** and hit **return**
1. This should bring up the **Profiles** panel within the **System Settings**
:::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/profiles-within-system-settings.png" alt-text="Screenshot showing configuration profiles":::


    |**Screenshot Callout**  |**Description**  |
    |:---------:|---------|
    |**1**     |  Indicates that the device is under **MDM** Management     |
    |**2**     | There will likely be multiple profiles to choose from. In this example, the Microsoft Enterprise SSO Extension Profile is called **Extensible Single Sign On Profile-32f37be3-302e-4549-a3e3-854d300e117a**. *Note: The way the Extension appears here, and how it's named varies on the MDM configuration.*         |

    
    >[!NOTE] 
    >Depending on the type of MDM being used, there could be several profiles listed and their naming scheme is arbitrary depending on the MDM configuration.  Select each one and inspect that the **Settings** row indicates that it is a **Single Sign On Extension**.
1. Double-click on the configuration profile that matches a **Settings** value of **Single Sign On Extension**
:::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/sso-extension-config-profile.png" alt-text="screenshot showing sso extension configuration profile":::


    |**Screenshot Callout#**  |**Configuration Profile Setting**  |**Description**  |
    |:---------:|:---------|---------|
    |**1**     |**Signed**         |Signing authority of the MDM provider         |
    |**2**     |**Installed**         |Date/Timestamp showing when the extension was installed (or updated)         |
    |**3**     |**Settings: Single Sign On Extension**         |Indicates that this configuration profile is an **Apple SSO Extension** type         |
    |**4**     |**Extension**         |Identifier that maps to the **bundle Id** of the application that is running the **Microsoft Enterprise Extension Plugin**. The identifier must **always** be set to **`com.microsoft.CompanyPortalMac.ssoextension`** and the Team Identifier must appear as **(UBF8T346G9)**.  *Note: if any values differ, then the MDM won't invoke the extension correctly.*          |
    |**5**     |**Type**         |The **Microsoft Enterprise SSO Extension** must **always** be set to a **Redirect** extension type. For more information, see [Redirect vs Credential Extension Types](#redirect-vs-credential-extension-types)         |
    |**6**     |**URLs**         | The login URLs belonging to the Identity Provider **(Azure AD)**. See list of  [supported URLs](../develop/apple-sso-plugin.md#manual-configuration-for-other-mdm-services)          |
    |

    All Apple SSO Redirect Extensions must have the following MDM Payload components in the configuration profile:
    
    |**MDM Payload Component**|**Description**  |
    |---------|---------|
    |**Extension Identifier**     |Includes both the Bundle Identifier and Team Identifier of the application on the macOS device, running the Extension. Note: The Microsoft Enterprise SSO Extension should always be set to: **com.microsoft.CompanyPortalMac.ssoextension (UBF8T346G9)** to inform the macOS operating system that the extension client code is part of the **Intune Company Portal application**.         |
    |**Type**     |Must be set to **Redirect** to indicate a **Redirect Extension** type         |
    |**URLs**     |Endpoint URLs of the identity provider (Azure AD), where the operating system routes authentication requests to the extension         |
    |**Optional Extension Specific Configuration**    |Dictionary values that may act as configuration parameters. In the context of Microsoft Enterprise SSO Extension, these configuration parameters are called feature flags. See [feature flag definitions](../develop/apple-sso-plugin.md#more-configuration-options).          |

    

    >[!NOTE] 
    >The MDM definitions of the Apple's SSO Extension profile can be referenced in the article [Extensible Single Sign-on MDM payload settings for Apple devices](https://support.apple.com/guide/deployment/depfd9cdf845/web) Microsoft has implemented our extension based on this schema. See [Microsoft Enterprise SSO plug-in for Apple devices](../develop/apple-sso-plugin.md#manual-configuration-for-other-mdm-services)
1. To verify that the correct profile for the Microsoft Apple SSO Extension is installed, the **Extension** field should match: **com.microsoft.CompanyPortalMac.ssoextension (UBF8T346G9)**
1. Take note of the **Installed** field in the configuration profile as it can be a useful troubleshooting indicator, when changes are made to its configuration

If the correct configuration profile has been verified, proceed to the [Application Auth Flow Troubleshooting](#application-auth-flow-troubleshooting) section.

##### MDM Configuration Profile is Missing
If the SSO extension configuration profile doesn't appear in the **Profiles** list after following the [previous section](#locate-sso-extension-mdm-configuration-profile), it could be that the MDM configuration has User/Device targeting enabled, which is effectively **filtering out** the logged in user or the device from receiving the configuration profile. Check with your MDM administrator and collect the **Console** logs found in the [next section](#collect-mdm-specific-console-logs).

###### Collect MDM Specific Console Logs        
1. From the macOS device, click on the **spotlight icon** 
:::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/spotlight-icon.png" alt-text="screenshot showing the macOS spotlight icon":::
1. When the **Spotlight Search** appears, type **Console** and hit **return**
1. Click the **Start** button to enable the Console trace logging
:::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/console-window-start-button.png" alt-text="Screenshot showing the Console app and the start button being clicked":::
1. Have the MDM administrator try to redeploy the config profile to this macOS device/user and force a sync cycle 
1. Type **subsystem:com.apple.ManagedClient** into the **search bar** and hit **return**
:::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/console-subsystem-filter.png" alt-text="Screenshot showing the Console app with the subsystem filter":::
1. Where the cursor is flashing in the **search bar** type **message:Extensible**
:::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/filter-console-message-extensible.png" alt-text="Screenshot showing the console being further filtered on the message field":::
1. You should now see the MDM Console logs filtered on **Extensible SSO** configuration profile activities. The following screenshot shows a log entry **Installed configuration profile**, showing that the configuration profile was installed.
:::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/console-logs-extensible-message.png" alt-text="Screenshot showing a sample of an installed configuration profile in console logs" lightbox="media/troubleshoot-mac-sso-extension-plugin/console-logs-extensible-message.png":::

## Application Auth Flow Troubleshooting
The guidance in this section assumes that the macOS device has a correctly deployed configuration profile. See [Validate SSO Configuration Profile on macOS Device](#validate-sso-configuration-profile-on-macos-device) for the steps.

 

 


Once deployed the **Microsoft Enterprise SSO Extension for Apple devices** supports two types of application authentication flows for each application type. When troubleshooting, it's important to understand the type of application being used.



### Application Types



|**Application Type**  |**Interactive Auth**  |**Silent Auth**|**Description**|**Examples**|
|---------|---------|---------|---------|---------|
| [**Native MSAL App**](../develop/apple-sso-plugin.md#applications-that-use-msal)     |    X     |    X     | MSAL (Microsoft Authentication Library) is an application developer framework tailored for building applications with the Microsoft Identity platform (Azure AD).<br>Apps built on **MSAL version 1.1 or greater** are able to integrate with the Microsoft Enterprise SSO Extension.<br>*If the application is SSO extension (broker) aware it will utilize the extension without any further configuration* See our [MSAL developer sample documentation](https://github.com/AzureAD/microsoft-authentication-library-for-objc)  | Microsoft To Do 
|[**Non-MSAL Native/Browser SSO**](../develop/apple-sso-plugin.md#applications-that-dont-use-msal)     |         |    X     |Applications that use Apple networking technologies or webviews can be configured to obtain a shared credential from the SSO Extension<br>Feature flags must be configured to ensure that the bundle ID for each app is allowed to obtain the shared credential (PRT).|Microsoft Word<br>Safari<br>Microsoft Edge<br>Visual Studio| 

>[!Important]
>Not all Microsoft first-party native applications use the MSAL framework. At the time of this article's publication, most of the Microsoft Office macOS applications still rely on the older ADAL library framework, and thus rely on the Browser SSO flow.

#### How to Find the Bundle ID for an Application on macOS
1.  From the macOS device, click on the **spotlight icon**
:::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/spotlight-icon.png" alt-text="screenshot showing the macOS spotlight icon"::: 
1. When the **Spotlight Search** appears type **Terminal** and hit **return**
1. When the Terminal opens type **`osascript -e 'id of app "<appname>"'`** at the prompt. See some examples follow:
    ```
    % osascript -e 'id of app "Safari"'
    com.apple.Safari

    % osascript -e 'id of app "OneDrive"'
    com.microsoft.OneDrive

    % osascript -e 'id of app "Microsoft Edge"'
    com.microsoft.edgemac
    ``` 
1. Now that the bundle Id(s) have been gathered, follow our [guidance to configure the feature flags](../develop/apple-sso-plugin.md#enable-sso-for-all-apps-with-a-specific-bundle-id-prefix) to ensure that **Non-MSAL Native/Browser SSO apps** can utilize the SSO Extension.  **Note: All bundle ids are case sensitive for the Feature flag configuration**.
>[!Caution]
>Applications that do not use Apple Networking technologies (**i.e. WKWebview and NSURLSession**) will not be able to use the shared credential (PRT) from the SSO Extension. Both **Google Chrome** and **Mozilla Firefox** fall into this category. Even if they are configured in the MDM configuration profile, the result will be a regular authentication prompt in the browser. 

### Bootstrapping
By default, only MSAL apps invoke the SSO Extension, and then in turn the Extension acquires a shared credential (PRT) from Azure AD. However, the **Safari** browser application or other **Non-MSAL** applications can be configured to acquire the PRT. See [Allow users to sign in from unknown applications and the Safari browser](../develop/apple-sso-plugin.md#allow-users-to-sign-in-from-unknown-applications-and-the-safari-browser). After the SSO Extension acquires a PRT, it will store the credential in the user's login Keychain. Next, check to ensure that the PRT is present in the user's keychain:

#### Checking Keychain Access for PRT
1.  From the macOS device, click on the **spotlight icon** 
:::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/spotlight-icon.png" alt-text="screenshot showing the macOS spotlight icon":::
1. When the **Spotlight Search** appears, type **Keychain Access** and hit **return**
1. - Under **Default Keychains** select **Local Items (or iCloud)**<br>
   - Ensure that the **All Items** is selected
   -  In the search bar, on the right-hand side, type **primaryrefresh** (To filter)<br> 
    :::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/prt-located-in-keychainaccess.png" alt-text="screenshot showing how to find the PRT in Keychain access app":::

        |**Screenshot Callout#**  |**Keychain Credential Component**  |**Description**  |
        |:---------:|:---------|---------|
        |**1**           |**All Items**          |Shows all types of credentials across Keychain Access         |
        |**2**           |**Keychain Search Bar**          |Allows filtering by credential. To filter for the Azure AD PRT type **`primaryrefresh`**          |    
        |**3**           |**Kind**          |Refers to the type of credential. The Azure AD PRT credential is an **Application Password** credential type         |
        |**4**           |**Account**          |Displays the Azure AD User Account, which owns the PRT in the format: **`UserObjectId.TenantId-login.windows.net`**        |
        |**5**           |**Where**          |Displays the full name of the credential. The Azure AD PRT credential begins with the following format: **`primaryrefreshtoken-29d9ed98-a469-4536-ade2-f981bc1d605`** The **29d9ed98-a469-4536-ade2-f981bc1d605** is the Application ID for the **Microsoft Authentication Broker** service, responsible for handling PRT acquisition requests          |
        |**6**           |**Modified**          |Shows when the credential was last updated. For the Azure AD PRT credential, anytime the credential is either bootstrapped or updated by an interactive sign-on event will update the date/timestamp         |
        |**7**           |**Keychain**                      |Indicates which Keychain the selected credential resides.  The Azure AD PRT credential will either reside in the **Local Items** or **iCloud** Keychain. *Note: When iCloud is enabled on the macOS device, the **Local Items** Keychain will become the **iCloud** keychain*         |  

1. If the PRT isn't found in Keychain Access, do the following based on the application type:<br> 
    - **Native MSAL**: Check that the application developer, if the app was built with **MSAL version 1.1 or greater**, has enabled the application to be broker aware. Also, check [**Deployment Troubleshooting steps**](#deployment-troubleshooting) to rule out any deployment issues.
    - **Non MSAL (Safari)**: Check to ensure that the feature flag **`browser_sso_interaction_enabled`** is set to 1 and not 0 in the MDM configuration profile

#### Authentication Flow after Bootstrapping a PRT

Now that the PRT (shared credential) has been verified, before doing any deeper troubleshooting, it's helpful to understand the high-level steps for each application type and how it interacts with the Microsoft Enterprise SSO Extension plugin (broker app). The following animations and descriptions should help macOS administrators understand the scenario before looking at any logging data.  

##### Native MSAL Application

Scenario: An MSAL developed application (Example: Microsoft TO DO client) that is running on a macOS device needs to sign the user in with their Azure AD account in order to access an Azure AD protected service (Example: Microsoft To Do Service).

:::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/macos-prt-msal-app.gif" alt-text="A GIF animation showing the authentication flow of an MSAL app with a PRT":::

1. MSAL developed applications invoke the SSO Extension directly, and send the PRT to the Azure AD token endpoint along with the application's request for a token for an Azure AD protected resource
1. Azure AD validates the PRT credential, and returns an application-specific token back to the SSO Extension Broker
1. The SSO Extension Broker then passes the token to the MSAL client application, which then sends it to the Azure AD protected resource
1. The user is now signed into the app and the authentication process is complete

##### Non-MSAL/Browser SSO

Scenario: A user on a macOS device opens up the Safari web browser (or any Non-MSAL native app that supports the Apple Networking Stack) to sign into an Azure AD protected resource (Example: https://office.com).

:::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/macos-prt-nonmsal-app.gif" alt-text="An animation showing the high level authentication flow of a Non-MSAL app using the SSO Extension":::

1. Using a Non-MSAL macOS application (Example: Safari), the user attempts to sign into an Azure AD integrated application (Example: office.com) and is redirected to obtain a token from Azure AD
1. As long as the Non-MSAL is allow-listed in the MDM payload configuration, the macOS Network Stack intercepts the authentication request and redirects the request to the SSO Extension broker
1. Once the SSO Extension receives the intercepted request, the PRT is sent to the Azure AD token endpoint
1. Azure AD validates the PRT, and returns an application-specific token back to the SSO Extension
1. The application-specific token is given to the Non-MSAL client application, and the client application sends the token to access the Azure AD protected service
1. The user now has completed the sign-in and the authentication process is complete


### Obtaining the SSO Extension Logs
One of the most useful tools to troubleshoot various issues with the SSO Extension are the client logs on the macOS device. 

#### Save SSO Extension Logs from Company Portal App 
1.  From the macOS device, click on the **spotlight icon** 
:::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/spotlight-icon.png" alt-text="screenshot showing the macOS spotlight icon":::
1. When the **Spotlight Search** appears, type **Company Portal** and hit **return**
1. When the **Company Portal** loads (Note: no need to Sign into the app), navigate to the top menu bar: **Help**->**Save diagnostic report**:::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/company-portal-help-save-diagnostic.png" alt-text="screenshot showing Help Diagnostic report":::
1. Save the Company Portal Log archive to place of your choice (for example: Desktop)
1. Open the **CompanyPortal.zip** archive and Open the **SSOExtension.log** file with any text editor

>[!Tip]
>A handy way to view the logs is using [**Visual Studio Code**](https://code.visualstudio.com/download) and installing the [**Log Viewer**](https://marketplace.visualstudio.com/items?itemName=berublan.vscode-log-viewer) extension.  



#### Tailing SSO Extension Logs with Terminal
During troubleshooting it may be useful to reproduce a problem while tailing the SSOExtension logs in real time:

1.  From the macOS device, click on the **spotlight icon**
:::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/spotlight-icon.png" alt-text="screenshot showing the macOS spotlight icon"::: 
1. When the **Spotlight Search** appears type: **Terminal** and hit **return**
1. When the Terminal opens type: 
    ```bash 
    tail -F ~/Library/Containers/com.microsoft.CompanyPortalMac.ssoextension/Data/Library/Caches/Logs/Microsoft/SSOExtension/*
    ```
    >[!NOTE]The trailing /* indicates that multiple logs will be tailed should any exist
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

1. As you reproduce the issue keep the **Terminal** window open to observe the output from the tailed **SSOExtension** logs

### Understanding the SSO Extension Logs
Analyzing the SSO Extension logs is an excellent way to troubleshoot the authentication flow from applications sending authentication requests to Azure AD. Any time the SSO Extension Broker is invoked, a series of logging activities results, and these activities are known as **Authorization Requests**. The logs contain the following useful information for troubleshooting:

- Feature Flag configuration
- Authorization Request Types
  - Native MSAL
  - Non MSAL/Browser SSO
- Interaction with the macOS Keychain for credential retrival/storage operations
- Correlation Ids for Azure AD Sign-In Events
  - PRT acquisition
  - Device Registration

>[!Caution] The SSO Extension logs are extremely verbose, especially when looking at Keychain credenential operations. For this reason, it's always best to understand the sceanrio before looking at the logs during troubleshooting.


#### Log Structure
The SSO Extension logs are broken down into columns. The following screenshot shows the column breakdown of the logs:

:::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/sso-extension-column-structure.png" alt-text="Screenshot showing the column structure of the SSO Extension logs":::


|**Column#**  |**Column Name**  |**Description**  |
|:---------:|:---------|---------|
|**1**     |**Local Date/Time**         |The **Local** Date and Time displayed         |
|**2**     |**I-Information<br>W-Warning<br>E-Error**         |Displays Information, Warning, or Errors         |
|**3**    |**Thread ID (TID)**         |Displays the thread ID of the SSO Extension Broker App's execution         |
|**4**     |**MSAL Version Number**         |The Microsoft Enterprise SSO Extension Broker Plugin is build as an MSAL app. This column denotes the version of MSAL that the broker app is running             |
|**5**     |**macOS version**            |Show the version of the macOS operating system         |
|**6**    |**UTC Date/Time**            |The **UTC** Date and Time displayed         |
|**7**    |**Correlation ID**            |Lines in the logs that have to do with Azure AD or Keychain operations extend the UTC Date/Time column with a Correlation ID         |
|**8**     |**Message**             |Shows the detailed messaging of the logs. Most of the troubleshooting information can be found by examining this column         |




#### Feature Flag Configuration

During the MDM configuration of the Microsoft Enterprise SSO Extension, optional extension specific data can be sent as instructions to change how the SSO Extension behaves. These configuration specific instructions are known as **Feature Flags**. The Feature Flag configuration is especially important for Non-MSAL/Browser SSO authorization requests types, as the Bundle ID (or prefixes) can determine if the Extension will be invoked or not. See [Feature Flag documentation](../develop/apple-sso-plugin.md#more-configuration-options). Every authorization request begins with a Feature Flag configuration report. The following screenshot will walk through an example feature flag configuration:
:::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/feature-flag-configuration.png" alt-text="Screenshot showing an example feature flag configuration of the Microsoft SSO Extension":::

|**Callout#**  |**Feature Flag**  |**Description** |
|:---------:|:---------|:---------|
|**1**     |**[browser_sso_interaction_enabled](../develop/apple-sso-plugin.md#allow-users-to-sign-in-from-unknown-applications-and-the-safari-browser)**         |Non-MSAL or Safari browser can bootstrap a PRT        |
|**2**     |**[browser_sso_disable_mfa](../develop/apple-sso-plugin.md#disable-asking-for-mfa-during-initial-bootstrapping)**|During bootstrapping of the PRT credential, by default MFA is required. Notice this configuration is set to **null** which means that the default configuration will be enforced|
|**3**    |**[disable_explicit_app_prompt](../develop/apple-sso-plugin.md#disable-oauth-2-application-prompts)**         |Replaces **prompt=login** authentication requests from applications to reduce prompting|
|**4**     |**[AppPrefixAllowList](../develop/apple-sso-plugin.md#enable-sso-for-all-apps-with-a-specific-bundle-id-prefix)**         |Any Non-MSAL application that has a Bundle ID that starts with **`com.micorosoft.`** can be intercepted and handled by the SSO Extension broker             |

>[!Important Feature flags set to **null** means that their **default** configuration is in place. Check **[Feature Flag documentation](../develop/apple-sso-plugin.md#more-configuration-options)** for more details]

 

 


