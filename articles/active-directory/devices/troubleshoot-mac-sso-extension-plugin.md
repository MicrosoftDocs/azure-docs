---
title: Troubleshooting the Microsoft Enterprise SSO Extension plugin on Apple devices
description: This article helps to troubleshoot deploying the Microsoft Enterprise SSO plug-in on Apple devices

services: active-directory
ms.service: active-directory
ms.subservice: devices
ms.custom: devx-track-linux
ms.topic: troubleshooting
ms.date: 07/05/2023

ms.author: ryschwa
author: ryschwa-msft
manager: 
ms.reviewer: 

ms.collection: M365-identity-device-management
#Customer intent: As an IT admin, I want to learn how to discover and fix issues related to the Microsoft Enterprise SSO plug-in on macOS and iOS.
---
# Troubleshooting the Microsoft Enterprise SSO Extension plugin on Apple devices

This article provides troubleshooting guidance used by administrators to resolve issues with deploying and using the [Enterprise SSO plugin](../develop/apple-sso-plugin.md). The Apple SSO extension can be deployed to iOS/iPadOS and macOS.

Organizations may opt to deploy SSO to their corporate devices to provide a better experience for their end users. On Apple platforms, this process involves implementing Single Sign On (SSO) via [Primary Refresh Tokens](concept-primary-refresh-token.md).  SSO relieves end users of the burden of excessive authentication prompts.

Microsoft has implemented a plugin built on top of Apple's SSO framework, which provides brokered authentication for applications integrated with Microsoft Entra ID. For more information, see the article [Microsoft Enterprise SSO plug-in for Apple devices](../develop/apple-sso-plugin.md).

## Extension types

Apple supports two types of SSO Extensions that are part of its framework: **Redirect** and **Credential**. The Microsoft Enterprise SSO plugin has been implemented as a Redirect type and is best suited for brokering authentication to Microsoft Entra ID.  The following table compares the two types of extensions.

| Extension type | Best suited for | How it works | Key differences |
|---------|---------|---------|---------|
| Redirect | Modern authentication methods such as OpenID Connect, OAUTH2, and SAML (Microsoft Entra ID)| Operating System intercepts the authentication request from the application to the Identity provider URLs defined in the extension MDM configuration profile. Redirect extensions receive: URLs, headers, and body.| Request credentials before requesting data. Uses URLs in MDM configuration profile. |
| Credential | Challenge and response authentication types like **Kerberos** (on-premises Active Directory Domain Services)| Request is sent from the application to the authentication server (AD domain controller). Credential extensions are configured with HOSTS in the MDM configuration profile. If the authentication server returns a challenge that matches a host listed in the profile, the operating system routes the challenge to the extension. The extension has the choice of handling or rejecting the challenge. If handled, the extension returns the authorization headers to complete the request, and the authentication server returns a response to the caller. | Request data then get challenged for authentication. Use HOSTs in MDM configuration profile. |

Microsoft has implementations for brokered authentication for the following client operating systems:

| OS | Authentication broker |
|---------|---------|
| Windows| Web Account Manager (WAM) |
| iOS/iPadOS| Microsoft Authenticator |
| Android| Microsoft Authenticator or Microsoft Intune Company Portal |
| macOS | Microsoft Intune Company Portal (via SSO Extension) |

All Microsoft broker applications use a key artifact known as a Primary Refresh Token (PRT), which is a JSON Web Token (JWT) used to acquire access tokens for applications and web resources secured with Microsoft Entra ID. When deployed through an MDM, the Enterprise SSO extension for macOS or iOS obtains a PRT that is similar to the PRTs used on Windows devices by the Web Account Manager (WAM). For more information, see the article [What is a Primary Refresh Token](concept-primary-refresh-token.md).

## Troubleshooting model

The following flowchart outlines a logical flow for approaching troubleshooting the SSO Extension.  The rest of this article goes into detail on the steps depicted in this flowchart. The troubleshooting can be broken down into two separate focus areas: [Deployment](#deployment-troubleshooting) and [Application Auth Flow](#application-auth-flow-troubleshooting).

# [iOS](#tab/flowchart-ios)

:::image type="content" source="./media/troubleshoot-mac-sso-extension-plugin/ios-enterprise-sso-tsg-model.png" alt-text="Screenshot of flowchart showing the troubleshooting process flow for Apple SSO extension on iOS devices." lightbox="media/troubleshoot-mac-sso-extension-plugin/ios-enterprise-sso-tsg-model.png":::

# [macOS](#tab/flowchart-macos)

:::image type="content" source="./media/troubleshoot-mac-sso-extension-plugin/macos-enterprise-sso-tsg-model.png" alt-text="Screenshot of flowchart showing the troubleshooting process flow for Apple SSO extension on macOS devices." lightbox="media/troubleshoot-mac-sso-extension-plugin/macos-enterprise-sso-tsg-model.png":::

---

## Deployment troubleshooting

Most issues that customers encounter stem from either improper Mobile Device Management (MDM) configuration(s) of the SSO extension profile, or an inability for the Apple device to receive the configuration profile from the MDM. This section covers the steps you can take to ensure that the MDM profile has been deployed to a Mac and that it has the correct configuration.

### Deployment requirements

- macOS operating system: **version 10.15 (Catalina)** or greater.
- iOS operating system: **version 13** or greater.
- Device managed by any MDM vendor that supports [Apple macOS and/or iOS](https://support.apple.com/guide/deployment/dep1d7afa557/web) (MDM Enrollment).
- Authentication Broker Software installed: [**Microsoft Intune Company Portal**](/mem/intune/apps/apps-company-portal-macos) or [**Microsoft Authenticator for iOS**](https://support.microsoft.com/account-billing/download-and-install-the-microsoft-authenticator-app-351498fc-850a-45da-b7b6-27e523b8702a).

#### Check macOS operating system version

Use the following steps to check the operating system (OS) version on the macOS device. Apple SSO Extension profiles are only deployed to devices running  **macOS 10.15 (Catalina)** or greater. You can check the macOS version from either the [User Interface](#user-interface) or from the [Terminal](#terminal).

##### User interface

1. From the macOS device, select on the Apple icon in the top left corner and select **About This Mac**.

1. The Operating system version is listed beside **macOS**.

##### Terminal

1. From the macOS device, double-click on the **Applications** folder, then double-click on the **Utilities** folder.
1. Double-click on the **Terminal** application.
1. When the Terminal opens type **sw_vers** at the prompt, look for a result like the following:

   ```zsh
   % sw_vers
   ProductName: macOS
   ProductVersion: 13.0.1
   BuildVersion: 22A400
   ```

#### Check iOS operating system version

Use the following steps to check the operating system (OS) version on the iOS device. Apple SSO Extension profiles are only deployed to devices running **iOS 13** or greater. You can check the iOS version from the **Settings app**. Open the **Settings app**:

:::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/settings-app.jpg" alt-text="Screenshot showing iOS Settings app icon.":::

Navigate to **General** and then **About**. This screen lists information about the device, including the iOS version number:

:::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/ios-version.png" alt-text="Screenshot showing iOS version in the Settings app.":::

#### MDM deployment of SSO extension configuration profile

Work with your MDM administrator (or Device Management team) to ensure that the extension configuration profile is deployed to the Apple devices. The extension profile can be deployed from any MDM that supports macOS or iOS devices.

> [!IMPORTANT]
> Apple requires devices are enrolled into an MDM for the SSO extension to be deployed.  

The following table provides specific MDM installation guidance depending on which OS you're deploying the extension to:

- [**iOS/iPadOS**: Deploy the Microsoft Enterprise SSO plug-in](/mem/intune/configuration/use-enterprise-sso-plug-in-ios-ipados-with-intune)
- [**macOS**: Deploy the Microsoft Enterprise SSO plug-in](/mem/intune/configuration/use-enterprise-sso-plug-in-macos-with-intune)

> [!IMPORTANT]
> Although, any MDM is supported for deploying the SSO Extension, many organizations implement [**device-based Conditional Access polices**](../conditional-access/concept-conditional-access-grant.md#require-device-to-be-marked-as-compliant) by way of evaluating MDM compliance policies. If a third-party MDM is being used, ensure that the MDM vendor supports [**Intune Partner Compliance**](/mem/intune/protect/device-compliance-partners) if you would like to use device-based Conditional Access policies. When the SSO Extension is deployed via Intune or an MDM provider that supports Intune Partner Compliance, the extension can pass the device certificate to Microsoft Entra ID so that device authentication can be completed.   

#### Validate SSO configuration profile on macOS device

Assuming the MDM administrator has followed the steps in the previous section [MDM Deployment of SSO Extension Profile](#mdm-deployment-of-sso-extension-configuration-profile), the next step is to verify if the profile has been deployed successfully to the device.

##### Locate SSO extension MDM configuration profile

1. From the macOS device, select on the **System Settings**.
1. When the **System Settings** appears type **Profiles** and hit **return**.
1. This action should bring up the **Profiles** panel.

   :::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/profiles-within-system-settings.png" alt-text="Screenshot showing configuration profiles.":::

   | Screenshot callout | Description |
   |:---------:|---------|
   |**1**| Indicates that the device is under **MDM** Management. |
   |**2**| There may be multiple profiles to choose from. In this example, the Microsoft Enterprise SSO Extension Profile is called **Extensible Single Sign On Profile-32f37be3-302e-4549-a3e3-854d300e117a**. |

   > [!NOTE] 
   > Depending on the type of MDM being used, there could be several profiles listed and their naming scheme is arbitrary depending on the MDM configuration. Select each one and inspect that the **Settings** row indicates that it is a **Single Sign On Extension**.

1. Double-click on the configuration profile that matches a **Settings** value of **Single Sign On Extension**.

   :::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/sso-extension-config-profile.png" alt-text="Screenshot showing SSO extension configuration profile.":::

   | Screenshot callout | Configuration profile setting | Description |
   |:---------:|:---------|---------|
   |**1**|**Signed**| Signing authority of the MDM provider. |
   |**2**|**Installed**| Date/Timestamp showing when the extension was installed (or updated). |
   |**3**|**Settings: Single Sign On Extension**|Indicates that this configuration profile is an **Apple SSO Extension** type.|
   |**4**|**Extension**| Identifier that maps to the **bundle ID** of the application that is running the **Microsoft Enterprise Extension Plugin**. The identifier must **always** be set to **`com.microsoft.CompanyPortalMac.ssoextension`** and the Team Identifier must appear as **(UBF8T346G9)** if the profile is installed on a macOS device.  If any values differ, then the MDM doesn't invoke the extension correctly.|
   |**5**|**Type**| The **Microsoft Enterprise SSO Extension** must **always** be set to a **Redirect** extension type. For more information, see [Redirect vs Credential Extension Types](#extension-types). |
   |**6**|**URLs**| The login URLs belonging to the Identity Provider **(Microsoft Entra ID)**. See list of [supported URLs](../develop/apple-sso-plugin.md#manual-configuration-for-other-mdm-services). |

   All Apple SSO Redirect Extensions must have the following MDM Payload components in the configuration profile:

   | MDM payload component | Description |
   |---------|---------|
   |**Extension Identifier**| Includes both the Bundle Identifier and Team Identifier of the application on the macOS device, running the Extension. Note: The Microsoft Enterprise SSO Extension should always be set to: **com.microsoft.CompanyPortalMac.ssoextension (UBF8T346G9)** to inform the macOS operating system that the extension client code is part of the **Intune Company Portal application**. |
   |**Type**| Must be set to **Redirect** to indicate a **Redirect Extension** type. |
   |**URLs**| Endpoint URLs of the identity provider (Microsoft Entra ID), where the operating system routes authentication requests to the extension. |
   |**Optional Extension Specific Configuration**| Dictionary values that may act as configuration parameters. In the context of Microsoft Enterprise SSO Extension, these configuration parameters are called feature flags. See [feature flag definitions](../develop/apple-sso-plugin.md#more-configuration-options). |

   > [!NOTE] 
   > The MDM definitions for Apple's SSO Extension profile can be referenced in the article [Extensible Single Sign-on MDM payload settings for Apple devices](https://support.apple.com/guide/deployment/depfd9cdf845/web) Microsoft has implemented our extension based on this schema. See [Microsoft Enterprise SSO plug-in for Apple devices](../develop/apple-sso-plugin.md#manual-configuration-for-other-mdm-services)

1. To verify that the correct profile for the Microsoft Enterprise SSO Extension is installed, the **Extension** field should match: **com.microsoft.CompanyPortalMac.ssoextension (UBF8T346G9)**.
1. Take note of the **Installed** field in the configuration profile as it can be a useful troubleshooting indicator, when changes are made to its configuration.

If the correct configuration profile has been verified, proceed to the [Application Auth Flow Troubleshooting](#application-auth-flow-troubleshooting) section.

##### MDM configuration profile is missing

If the SSO extension configuration profile doesn't appear in the **Profiles** list after following the [previous section](#locate-sso-extension-mdm-configuration-profile), it could be that the MDM configuration has User/Device targeting enabled, which is effectively **filtering out** the user or device from receiving the configuration profile. Check with your MDM administrator and collect the **Console** logs found in the [next section](#collect-mdm-specific-console-logs).

###### Collect MDM specific console logs

1. From the macOS device, double-click on the **Applications** folder, then double-click on the **Utilities** folder.
1. Double-click on the **Console** application.
1. Click the **Start** button to enable the Console trace logging.

   :::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/console-window-start-button.png" alt-text="Screenshot showing the Console app and the start button being clicked.":::

1. Have the MDM administrator try to redeploy the config profile to this macOS device/user and force a sync cycle.
1. Type **subsystem:com.apple.ManagedClient** into the **search bar** and hit **return**.

   :::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/console-subsystem-filter.png" alt-text="Screenshot showing the Console app with the subsystem filter.":::

1. Where the cursor is flashing in the **search bar** type **message:Extensible**.

   :::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/filter-console-message-extensible.png" alt-text="Screenshot showing the console being further filtered on the message field.":::

1. You should now see the MDM Console logs filtered on **Extensible SSO** configuration profile activities. The following screenshot shows a log entry **Installed configuration profile**, showing that the configuration profile was installed.

## Application auth flow troubleshooting

The guidance in this section assumes that the macOS device has a correctly deployed configuration profile. See [Validate SSO Configuration Profile on macOS Device](#validate-sso-configuration-profile-on-macos-device) for the steps.

Once deployed the **Microsoft Enterprise SSO Extension for Apple devices** supports two types of application authentication flows for each application type. When troubleshooting, it's important to understand the type of application being used.

### Application types

| Application type | Interactive auth | Silent auth | Description | Examples |
| --------- | :---: | :---: | --------- | :---: |
| [**Native MSAL App**](../develop/apple-sso-plugin.md#applications-that-use-msal) |X|X| MSAL (Microsoft Authentication Library) is an application developer framework tailored for building applications with the Microsoft identity platform (Microsoft Entra ID).<br>Apps built on **MSAL version 1.1 or greater** are able to integrate with the Microsoft Enterprise SSO Extension.<br>*If the application is SSO extension (broker) aware it utilizes the extension without any further configuration* for more information, see our [MSAL developer sample documentation](https://github.com/AzureAD/microsoft-authentication-library-for-objc). | Microsoft To Do |
| [**Non-MSAL Native/Browser SSO**](../develop/apple-sso-plugin.md#applications-that-dont-use-msal) ||X| Applications that use Apple networking technologies or webviews can be configured to obtain a shared credential from the SSO Extension<br>Feature flags must be configured to ensure that the bundle ID for each app is allowed to obtain the shared credential (PRT). | Microsoft Word<br>Safari<br>Microsoft Edge<br>Visual Studio | 

> [!IMPORTANT]
> Not all Microsoft first-party native applications use the MSAL framework. At the time of this article's publication, most of the Microsoft Office macOS applications still rely on the older ADAL library framework, and thus rely on the Browser SSO flow.

#### How to find the bundle ID for an application on macOS

1. From the macOS device, double-click on the **Applications** folder, then double-click on the **Utilities** folder.
1. Double-click on the **Terminal** application.
1. When the Terminal opens type **`osascript -e 'id of app "<appname>"'`** at the prompt. See some examples follow:

   ```zsh
   % osascript -e 'id of app "Safari"'
   com.apple.Safari

   % osascript -e 'id of app "OneDrive"'
   com.microsoft.OneDrive

   % osascript -e 'id of app "Microsoft Edge"'
   com.microsoft.edgemac
   ``` 

1. Now that the bundle ID(s) have been gathered, follow our [guidance to configure the feature flags](../develop/apple-sso-plugin.md#enable-sso-for-all-apps-with-a-specific-bundle-id-prefix) to ensure that **Non-MSAL Native/Browser SSO apps** can utilize the SSO Extension.  **Note: All bundle ids are case sensitive for the Feature flag configuration**.

> [!CAUTION]
> Applications that do not use Apple Networking technologies (**like WKWebview and NSURLSession**) will not be able to use the shared credential (PRT) from the SSO Extension. Both **Google Chrome** and **Mozilla Firefox** fall into this category. Even if they are configured in the MDM configuration profile, the result will be a regular authentication prompt in the browser. 

### Bootstrapping

By default, only MSAL apps invoke the SSO Extension, and then in turn the Extension acquires a shared credential (PRT) from Microsoft Entra ID. However, the **Safari** browser application or other **Non-MSAL** applications can be configured to acquire the PRT. See [Allow users to sign in from applications that don't use MSAL and the Safari browser](../develop/apple-sso-plugin.md#allow-users-to-sign-in-from-applications-that-dont-use-msal-and-the-safari-browser). After the SSO extension acquires a PRT, it will store the credential in the user login Keychain. Next, check to ensure that the PRT is present in the user's keychain:

#### Checking keychain access for PRT

1. From the macOS device, double-click on the **Applications** folder, then double-click on the **Utilities** folder.
1. Double-click on the **Keychain Access** application.
1. Under **Default Keychains** select **Local Items (or iCloud)**.

   - Ensure that the **All Items** is selected.
   - In the search bar, on the right-hand side, type `primaryrefresh` (To filter).
   
   :::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/prt-located-in-keychain-access.png" alt-text="screenshot showing how to find the PRT in Keychain access app.":::

   | Screenshot callout | Keychain credential component | Description |
   |:---------:|:---------|---------|
   |**1** |**All Items**|Shows all types of credentials across Keychain Access|
   |**2** |**Keychain Search Bar**|Allows filtering by credential. To filter for the Microsoft Entra PRT type **`primaryrefresh`**|
   |**3** |**Kind**|Refers to the type of credential. The Microsoft Entra PRT credential is an **Application Password** credential type|
   |**4** |**Account**|Displays the Microsoft Entra user account, which owns the PRT in the format: **`UserObjectId.TenantId-login.windows.net`**   |
   |**5** |**Where**|Displays the full name of the credential. The Microsoft Entra PRT credential begins with the following format: **`primaryrefreshtoken-29d9ed98-a469-4536-ade2-f981bc1d605`** The **29d9ed98-a469-4536-ade2-f981bc1d605** is the Application ID for the **Microsoft Authentication Broker** service, responsible for handling PRT acquisition requests|
   |**6** |**Modified**|Shows when the credential was last updated. For the Microsoft Entra PRT credential, anytime the credential is bootstrapped or updated by an interactive sign-on event it updates the date/timestamp|
   |**7** |**Keychain**  |Indicates which Keychain the selected credential resides.  The Microsoft Entra PRT credential resides in the **Local Items** or **iCloud** Keychain. When iCloud is enabled on the macOS device, the **Local Items** Keychain will become the **iCloud** keychain|  

1. If the PRT isn't found in Keychain Access, do the following based on the application type:

   - **Native MSAL**: Check that the application developer, if the app was built with **MSAL version 1.1 or greater**, has enabled the application to be broker aware. Also, check [**Deployment Troubleshooting steps**](#deployment-troubleshooting) to rule out any deployment issues.
   - **Non MSAL (Safari)**: Check to ensure that the feature flag **`browser_sso_interaction_enabled`** is set to 1 and not 0 in the MDM configuration profile

#### Authentication flow after bootstrapping a PRT

Now that the PRT (shared credential) has been verified, before doing any deeper troubleshooting, it's helpful to understand the high-level steps for each application type and how it interacts with the Microsoft Enterprise SSO Extension plugin (broker app). The following animations and descriptions should help macOS administrators understand the scenario before looking at any logging data.  

##### Native MSAL application

Scenario: An application developed to use MSAL (Example: **Microsoft To Do** client) that is running on an Apple device needs to sign the user in with their Microsoft Entra account in order to access a Microsoft Entra ID protected service (Example: **Microsoft To Do Service**).

:::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/macos-prt-msal-app.gif" alt-text="A GIF animation showing the authentication flow of an MSAL app with a PRT.":::

1. MSAL-developed applications invoke the SSO extension directly, and send the PRT to the Microsoft Entra token endpoint along with the application's request for a token for a Microsoft Entra ID protected resource
1. Microsoft Entra ID validates the PRT credential, and returns an application-specific token back to the SSO extension broker
1. The SSO extension broker then passes the token to the MSAL client application, which then sends it to the Microsoft Entra ID protected resource
1. The user is now signed into the app and the authentication process is complete

##### Non-MSAL/Browser SSO

Scenario: A user on an Apple device opens up the Safari web browser (or any Non-MSAL native app that supports the Apple Networking Stack) to sign into a Microsoft Entra ID protected resource (Example: `https://office.com`).

:::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/macos-prt-non-msal-app.gif" alt-text="An animation showing the high level authentication flow of a Non-MSAL app using the SSO Extension.":::

1. Using a Non-MSAL application (Example: **Safari**), the user attempts to sign into a Microsoft Entra integrated application (Example: office.com) and is redirected to obtain a token from Microsoft Entra ID
1. As long as the Non-MSAL application is allow-listed in the MDM payload configuration, the Apple network stack intercepts the authentication request and redirects the request to the SSO Extension broker
1. Once the SSO extension receives the intercepted request, the PRT is sent to the Microsoft Entra token endpoint
1. Microsoft Entra ID validates the PRT, and returns an application-specific token back to the SSO Extension
1. The application-specific token is given to the Non-MSAL client application, and the client application sends the token to access the Microsoft Entra ID protected service
1. The user now has completed the sign-in and the authentication process is complete

### Obtaining the SSO extension logs

One of the most useful tools to troubleshoot various issues with the SSO extension are the client logs from the Apple device. 

#### Save SSO extension logs from Company Portal app

1. From the macOS device, double-click on the **Applications** folder.
1. Double-click on the **Company Portal** application.
1. When the **Company Portal** loads, navigate to the top menu bar: **Help**->**Save diagnostic report**. There's no need to Sign into the app.

   :::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/company-portal-help-save-diagnostic.png" alt-text="Screenshot showing how to navigate the Help top menu to Save the diagnostic report.":::

1. Save the Company Portal Log archive to place of your choice (for example: Desktop).
1. Open the **CompanyPortal.zip** archive and Open the **SSOExtension.log** file with any text editor.

> [!TIP]
> A handy way to view the logs is using [**Visual Studio Code**](https://code.visualstudio.com/download) and installing the [**Log Viewer**](https://marketplace.visualstudio.com/items?itemName=berublan.vscode-log-viewer) extension.

#### Tailing SSO extension logs on macOS with terminal

During troubleshooting it may be useful to reproduce a problem while tailing the SSOExtension logs in real time:

1. From the macOS device, double-click on the **Applications** folder, then double-click on the **Utilities** folder.
1. Double-click on the **Terminal** application.
1. When the Terminal opens type: 

   ```zsh
   tail -F ~/Library/Containers/com.microsoft.CompanyPortalMac.ssoextension/Data/Library/Caches/Logs/Microsoft/SSOExtension/*
   ```

   > [!NOTE]
   > The trailing /* indicates that multiple logs will be tailed should any exist

   ```output
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

1. As you reproduce the issue, keep the **Terminal** window open to observe the output from the tailed **SSOExtension** logs.

#### Exporting SSO extension logs on iOS

It isn't possible to view iOS SSO Extension logs in real time, as it is on macOS. The iOS SSO extension logs can be exported from the Microsoft Authenticator app, and then reviewed from another device:

1. Open the Microsoft Authenticator app:

   :::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/auth-app.jpg" alt-text="Screenshot showing the icon of the Microsoft Authenticator app on iOS.":::

1. Press the menu button in the upper left:

   :::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/auth-app-menu-button.png" alt-text="Screenshot showing the location of the menu button in the Microsoft Authenticator app.":::

1. Choose the "Send feedback" option:

   :::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/auth-app-send-feedback.png" alt-text="Screenshot showing the location of the send feedback option in the Microsoft Authenticator app.":::

1. Choose the "Having trouble" option:

   :::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/auth-app-having-trouble.png" alt-text="Screenshot showing the location of having trouble option in the Microsoft Authenticator app.":::

1. Press the View diagnostic data option:

   :::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/auth-app-view-diagnostic-data.png" alt-text="Screenshot showing the view diagnostic data button in the Microsoft Authenticator app.":::

   > [!TIP]
   > If you are working with Microsoft Support, at this stage you can press the **Send** button to send the logs to support. This will provide you with an Incident ID, which you can provide to your Microsoft Support contact.

1. Press the "Copy all" button to copy the logs to your iOS device's clipboard. You can then save the log files elsewhere for review or send them via email or other file sharing methods:

   :::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/auth-app-copy-all-logs.png" alt-text="Screenshot showing the Copy all logs option in the Microsoft Authenticator app.":::

### Understanding the SSO extension logs

Analyzing the SSO extension logs is an excellent way to troubleshoot the authentication flow from applications sending authentication requests to Microsoft Entra ID. Any time the SSO extension Broker is invoked, a series of logging activities results, and these activities are known as **Authorization Requests**. The logs contain the following useful information for troubleshooting:

- Feature Flag configuration
- Authorization Request Types
   - Native MSAL
   - Non MSAL/Browser SSO
- Interaction with the macOS Keychain for credential retrival/storage operations
- Correlation IDs for Microsoft Entra sign-in events
   - PRT acquisition
   - Device Registration

> [!CAUTION]  
> The SSO extension logs  are extremely verbose, especially when looking at Keychain credential operations. For this reason, it's always best to understand the scenario before looking at the logs during troubleshooting.

#### Log structure

The SSO extension logs  are broken down into columns. The following screenshot shows the column breakdown of the logs:

:::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/sso-extension-column-structure.png" alt-text="Screenshot showing the column structure of the SSO extension logs.":::

| Column | Column name | Description |
|:---------:|:---------|---------|
|**1**|**Local Date/Time**|The **Local** Date and Time displayed|
|**2**|**I-Information<br>W-Warning<br>E-Error**|Displays Information, Warning, or Errors|
|**3**|**Thread ID (TID)**|Displays the thread ID of the SSO extension Broker App's execution|
|**4**|**MSAL Version Number**|The Microsoft Enterprise SSO extension Broker Plugin is build as an MSAL app. This column denotes the version of MSAL that the broker app is running   |
|**5**|**macOS version**  |Show the version of the macOS operating system|
|**6**|**UTC Date/Time**  |The **UTC** Date and Time displayed|
|**7**|**Correlation ID**  |Lines in the logs that have to do with Microsoft Entra ID or Keychain operations extend the UTC Date/Time column with a Correlation ID|
|**8**|**Message**   |Shows the detailed messaging of the logs. Most of the troubleshooting information can be found by examining this column|

#### Feature flag configuration

During the MDM configuration of the Microsoft Enterprise SSO Extension, an optional extension specific data can be sent as instructions to change how the SSO extension behaves. These configuration specific instructions are known as **Feature Flags**. The Feature Flag configuration is especially important for Non-MSAL/Browser SSO authorization requests types, as the Bundle ID can determine if the Extension is invoked or not. See [Feature Flag documentation](../develop/apple-sso-plugin.md#more-configuration-options). Every authorization request begins with a Feature Flag configuration report. The following screenshot walks through an example feature flag configuration:

:::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/feature-flag-configuration.png" alt-text="Screenshot showing an example feature flag configuration of the Microsoft SSO Extension.":::

| Callout | Feature flag | Description |
|:---------:|:---------|:---------|
|**1**|**[browser_sso_interaction_enabled](../develop/apple-sso-plugin.md#allow-users-to-sign-in-from-applications-that-dont-use-msal-and-the-safari-browser)**|Non-MSAL or Safari browser can bootstrap a PRT   |
|**2**|**browser_sso_disable_mfa**|(Now deprecated) During bootstrapping of the PRT credential, by default MFA is required. Notice this configuration is set to **null** which means that the default configuration is enforced|
|**3**|**[disable_explicit_app_prompt](../develop/apple-sso-plugin.md#disable-oauth-2-application-prompts)**|Replaces **prompt=login** authentication requests from applications to reduce prompting|
|**4**|**[AppPrefixAllowList](../develop/apple-sso-plugin.md#enable-sso-for-all-apps-with-a-specific-bundle-id-prefix)**|Any Non-MSAL application that has a Bundle ID that starts with **`com.micorosoft.`** can be intercepted and handled by the SSO extension broker   |

> [!IMPORTANT]
> Feature flags set to **null** means that their **default** configuration is in place. Check **[Feature Flag documentation](../develop/apple-sso-plugin.md#more-configuration-options)** for more details

#### MSAL native application sign-in flow

The following section walks through how to examine the SSO extension logs  for the Native MSAL Application auth flow.  For this example, we're using the [MSAL macOS/iOS sample application](https://github.com/AzureAD/microsoft-authentication-library-for-objc) as the client application, and the application is making a call to the Microsoft Graph API to display the sign-in user's information.

##### MSAL native: Interactive flow walkthrough

The following actions should take place for a successful interactive sign-on:

1. The user signs in to the MSAL macOS sample app.
1. The Microsoft SSO Extension Broker is invoked and handles the request.
1. Microsoft SSO Extension Broker undergoes the bootstrapping process to acquire a PRT for the signed in user.
1. Store the PRT in the Keychain.
1. Check for the presence of a Device Registration object in Microsoft Entra ID (WPJ).
1. Return an access token to the client application to access the Microsoft Graph with a scope of User.Read.

> [!IMPORTANT]
> The sample log snippets that follows, have been annotated with comment headers // that are not seen in the logs. They are used to help illustrate a specific action being undertaken. We have documented the log snippets this way to assist with copy and paste operations. In addition, the log examples have been trimmed to only show lines of significance for troubleshooting.

The user clicks on the **Call Microsoft Graph API** button to invoke the sign-in process.

:::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/msal-macos-example-click-call-microsoft-graph.png" alt-text="Screenshot showing MSAL example app for macOS launched with Call Microsoft Graph API button.":::

```SSOExtensionLogs
//////////////////////////
//get_accounts_operation//
//////////////////////////
Handling SSO request, requested operation: get_accounts_operation
(Default accessor) Get accounts.
(MSIDAccountCredentialCache) retrieving cached credentials using credential query
(Default accessor) Looking for token with aliases (null), tenant (null), clientId 08dc26ab-e050-465e-beb4-d3f2d66647a5, scopes (null)
(Default accessor) No accounts found in default accessor.
(Default accessor) No accounts found in other accessors.
Completed get accounts SSO request with a personal device mode.
Request complete
Request needs UI
ADB 3.1.40 -[ADBrokerAccountManager allBrokerAccounts:]
ADB 3.1.40 -[ADBrokerAccountManager allMSIDBrokerAccounts:]
(Default accessor) Get accounts.
No existing accounts found, showing webview

/////////
//login//
/////////
Handling SSO request, requested operation: login
Handling interactive SSO request...
Starting SSO broker request with payload: {
    authority = "https://login.microsoftonline.com/common";
    "client_app_name" = MSALMacOS;
    "client_app_version" = "1.0";
    "client_id" = "08dc26ab-e050-465e-beb4-d3f2d66647a5";
    "client_version" = "1.1.7";
    "correlation_id" = "3506307A-E90F-4916-9ED5-25CF81AE97FC";
    "extra_oidc_scopes" = "openid profile offline_access";
    "instance_aware" = 0;
    "msg_protocol_ver" = 4;
    prompt = "select_account";
    "provider_type" = "provider_aad_v2";
    "redirect_uri" = "msauth.com.microsoft.idnaace.MSALMacOS://auth";
    scope = "user.read";
}

////////////////////////////////////////////////////////////
//Request PRT from Microsoft Authentication Broker Service//
////////////////////////////////////////////////////////////
Using request handler <ADInteractiveDevicelessPRTBrokerRequestHandler: 0x117ea50b0>
(Default accessor) Looking for token with aliases (null), tenant (null), clientId 29d9ed98-a469-4536-ade2-f981bc1d605e, scopes (null)
Attempting to get Deviceless Primary Refresh Token interactively.
Caching AAD Environements
networkHost: login.microsoftonline.com, cacheHost: login.windows.net, aliases: login.microsoftonline.com, login.windows.net, login.microsoft.com, sts.windows.net
networkHost: login.partner.microsoftonline.cn, cacheHost: login.partner.microsoftonline.cn, aliases: login.partner.microsoftonline.cn, login.chinacloudapi.cn
networkHost: login.microsoftonline.de, cacheHost: login.microsoftonline.de, aliases: login.microsoftonline.de
networkHost: login.microsoftonline.us, cacheHost: login.microsoftonline.us, aliases: login.microsoftonline.us, login.usgovcloudapi.net
networkHost: login-us.microsoftonline.com, cacheHost: login-us.microsoftonline.com, aliases: login-us.microsoftonline.com
Resolved authority, validated: YES, error: 0
[MSAL] Resolving authority: Masked(not-null), upn: Masked(null)
[MSAL] Resolved authority, validated: YES, error: 0
[MSAL] Start webview authorization session with webview controller class MSIDAADOAuthEmbeddedWebviewController: 
[MSAL] Presenting web view controller. 
```

The logging sample can be broken down into three segments:

|Segment  |Description  |
|---------|---------|
| **`get_accounts_operation`** |Checks to see if there are any existing accounts in the cache<br> -  **ClientID**: The application ID registered in Microsoft Entra ID for this MSAL app<br>**ADB 3.1.40** indicates that version of the Microsoft Enterprise SSO Extension Broker plugin   |
|**`login`** |Broker handles the request for Microsoft Entra ID:<br> - **Handling interactive SSO request...**: Denotes an interactive request<br> - **correlation_id**: Useful for cross referencing with the Microsoft Entra server-side sign-in logs <br> - **scope**: **User.Read** API permission scope being requested from the Microsoft Graph<br> - **client_version**: version of MSAL that the application is running<br> - **redirect_uri**: MSAL apps use the format **`msauth.com.<Bundle ID>://auth`**   |
|**PRT Request**|Bootstrapping process to acquire a PRT interactively has been initiated and renders the Webview SSO Session<br><br>**Microsoft Authentication Broker Service**<br> - **clientId: 29d9ed98-a469-4536-ade2-f981bc1d605e**<br> - All PRT requests are made to Microsoft Authentication Broker Service|

The SSO Webview Controller appears and user is prompted to enter their Microsoft Entra login (UPN/email)

:::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/sso-webview-controller-prompt.png" alt-text="Screenshot showing the Apple SSO prompt with a User information being entered and more information callout.":::

> [!NOTE]
> Clicking on the ***i*** in the bottom left corner of the webview controller displays more information about the SSO extension and the specifics about the app that has invoked it.

:::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/about-single-sign-on-i-flyout.png" alt-text="Screenshot showing the more information details about the SSO extension from the prompt SSO screen.":::
After the user successfully enters their Microsoft Entra credentials, the following log entries are written to the SSO extension logs 

```
SSOExtensionLogs
///////////////
//Acquire PRT//
///////////////
[MSAL] -completeWebAuthWithURL: msauth://microsoft.aad.brokerplugin/?code=(not-null)&client_info=(not-null)&state=(not-null)&session_state=(not-null)
[MSAL] Dismissed web view controller.
[MSAL] Result from authorization session callbackURL host: microsoft.aad.brokerplugin , has error: NO
[MSAL] (Default accessor) Looking for token with aliases (
    "login.windows.net",
    "login.microsoftonline.com",
    "login.windows.net",
    "login.microsoft.com",
    "sts.windows.net"
), tenant (null), clientId 29d9ed98-a469-4536-ade2-f981bc1d605e, scopes (null)
Saving PRT response in cache since no other PRT was found
[MSAL] Saving keychain item, item info Masked(not-null)
[MSAL] Keychain find status: 0
Acquired PRT.

///////////////////////////////////////////////////////////////////////
//Discover if there is an Azure AD Device Registration (WPJ) present //
//and if so re-acquire a PRT and associate with Device ID            //
///////////////////////////////////////////////////////////////////////
WPJ Discovery: do discovery in environment 0
Attempt WPJ discovery using tenantId.
WPJ discovery succeeded.
Using cloud authority from WPJ discovery: https://login.microsoftonline.com/common
ADBrokerDiscoveryAction completed. Continuing Broker Flow.
PRT needs upgrade as device registration state has changed. Device is joined 1, prt is joined 0
Beginning ADBrokerAcquirePRTInteractivelyAction
Attempting to get Primary Refresh Token interactively.
Acquiring broker tokens for broker client id.
Resolving authority: Masked(not-null), upn: auth.placeholder-61945244__domainname.com
Resolved authority, validated: YES, error: 0
Enrollment id read from intune cache : (null).
Handle silent PRT response Masked(not-null), error Masked(null)
Acquired broker tokens.
Acquiring PRT.
Acquiring PRT using broker refresh token.
Requesting PRT from authority https://login.microsoftonline.com/<TenantID>/oauth2/v2.0/token
[MSAL] (Default accessor) Looking for token with aliases (
    "login.windows.net",
    "login.microsoftonline.com",
    "login.windows.net",
    "login.microsoft.com",
    "sts.windows.net"
), tenant (null), clientId (null), scopes (null)
[MSAL] Acquired PRT successfully!
Acquired PRT.
ADBrokerAcquirePRTInteractivelyAction completed. Continuing Broker Flow.
Beginning ADBrokerAcquireTokenWithPRTAction
Resolving authority: Masked(not-null), upn: auth.placeholder-61945244__domainname.com
Resolved authority, validated: YES, error: 0
Handle silent PRT response Masked(not-null), error Masked(null)

//////////////////////////////////////////////////////////////////////////
//Provide Access Token received from Azure AD back to Client Application// 
//and complete authorization request                                    //
//////////////////////////////////////////////////////////////////////////
[MSAL] (Default cache) Removing credentials with type AccessToken, environment login.windows.net, realm TenantID, clientID 08dc26ab-e050-465e-beb4-d3f2d66647a5, unique user ID dbb22b2f, target User.Read profile openid email
ADBrokerAcquireTokenWithPRTAction succeeded.
Composing broker response.
Sending broker response.
Returning to app (msauth.com.microsoft.idnaace.MSALMacOS://auth) - protocol version: 3
hash: 4A07DFC2796FD75A27005238287F2505A86BA7BB9E6A00E16A8F077D47D6D879
payload: Masked(not-null)
Completed interactive SSO request.
Completed interactive SSO request.
Request complete
Completing SSO request...
Finished SSO request.
```

At this point in the authentication/authorization flow, the PRT has been bootstrapped and it should be visible in the macOS keychain access. See [Checking Keychain Access for PRT](#checking-keychain-access-for-prt). The **MSAL macOS sample** application  uses the access token received from the Microsoft SSO Extension Broker to display the user's information.

Next, examine server-side [Microsoft Entra sign-in logs](../reports-monitoring/reference-basic-info-sign-in-logs.md#correlation-id) based on the correlation ID collected from the client-side SSO extension logs. For more information, see [Sign-in logs in Microsoft Entra ID](../reports-monitoring/concept-sign-ins.md).

<a name='view-azure-ad-sign-in-logs-by-correlation-id-filter'></a>

###### View Microsoft Entra sign-in logs by correlation ID filter

1. Open the Microsoft Entra Sign-ins for the tenant where the application is registered.
1. Select **User sign-ins (interactive)**.
1. Select the **Add Filters** and select the **Correlation Id** radio button.
1. Copy and paste the Correlation ID obtained from the SSO extension logs  and select **Apply**.

For the MSAL Interactive Login Flow, we expect to see an interactive sign-in for the resource **Microsoft Authentication Broker** service. This event is where the user entered their password to bootstrap the PRT.

:::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/msal-interactive-azure-ad-details-interactive.png" alt-text="Screenshot showing the interactive User Sign-ins from Microsoft Entra ID showing an interactive sign into the Microsoft Authentication Broker Service.":::

There are also non-interactive sign-in events, due to the fact the PRT is used to acquire the access token for the client application's request. Follow the [View Microsoft Entra sign-in logs by Correlation ID Filter](#view-azure-ad-sign-in-logs-by-correlation-id-filter) but in step 2, select **User sign-ins (non-interactive)**.

:::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/msal-interactive-azure-ad-details-non-interactive-microsoft-graph.png" alt-text="Screenshot showing how the SSO extension uses the PRT to acquire an access token for the Microsoft Graph.":::

|Sign-in log attribute  |Description  |
|---------|---------|
|**Application**| Display Name of the Application registration in the Microsoft Entra tenant where the client application authenticates. |
|**Application Id**| Also referred to the ClientID of the application registration in the Microsoft Entra tenant. |
|**Resource**| The API resource that the client application is trying to obtain access to. In this example, the resource is the **Microsoft Graph API**. |
|**Incoming Token Type**| An Incoming token type of **Primary Refresh Token (PRT)** shows the input token being used to obtain an access token for the resource. |
|**User Agent**| The user agent string in this example is showing that the **Microsoft SSO Extension** is the application processing this request. A useful indicator that the SSO extension is being used, and broker auth request is taking place. |
|**Microsoft Entra app authentication library**| When an MSAL application is being used the details of the library and the platform are written here. |
|**Oauth Scope Information**| The Oauth2 scope information requested for the access token. (**User.Read**,**profile**,**openid**,**email**). |

##### MSAL Native: Silent flow walkthrough

After a period of time, the access token will no longer be valid. So, if the user reclicks on the **Call Microsoft Graph API** button. The SSO extension attempts to refresh the access token with the already acquired PRT.

```
SSOExtensionLogs
/////////////////////////////////////////////////////////////////////////
//refresh operation: Assemble Request based on User information in PRT  /  
/////////////////////////////////////////////////////////////////////////
Beginning authorization request
Request does not need UI
Handling SSO request, requested operation: refresh
Handling silent SSO request...
Looking account up by home account ID dbb22b2f, displayable ID auth.placeholder-61945244__domainname.com
Account identifier used for request: Masked(not-null), auth.placeholder-61945244__domainname.com
Starting SSO broker request with payload: {
    authority = "https://login.microsoftonline.com/<TenantID>";
    "client_app_name" = MSALMacOS;
    "client_app_version" = "1.0";
    "client_id" = "08dc26ab-e050-465e-beb4-d3f2d66647a5";
    "client_version" = "1.1.7";
    "correlation_id" = "45418AF5-0901-4D2F-8C7D-E7C5838A977E";
    "extra_oidc_scopes" = "openid profile offline_access";
    "home_account_id" = "<UserObjectId>.<TenantID>";
    "instance_aware" = 0;
    "msg_protocol_ver" = 4;
    "provider_type" = "provider_aad_v2";
    "redirect_uri" = "msauth.com.microsoft.idnaace.MSALMacOS://auth";
    scope = "user.read";
    username = "auth.placeholder-61945244__domainname.com";
}
//////////////////////////////////////////
//Acquire Access Token with PRT silently//
//////////////////////////////////////////
Using request handler <ADSSOSilentBrokerRequestHandler: 0x127226a10>
Executing new request
Beginning ADBrokerAcquireTokenSilentAction
Beginning silent flow.
[MSAL] Resolving authority: Masked(not-null), upn: auth.placeholder-61945244__domainname.com
[MSAL] (Default cache) Removing credentials with type AccessToken, environment login.windows.net, realm <TenantID>, clientID 08dc26ab-e050-465e-beb4-d3f2d66647a5, unique user ID dbb22b2f, target User.Read profile openid email
[MSAL] (MSIDAccountCredentialCache) retrieving cached credentials using credential query
[MSAL] Silent controller with PRT finished with error Masked(null)
ADBrokerAcquireTokenWithPRTAction succeeded.
Composing broker response.
Sending broker response.
Returning to app (msauth.com.microsoft.idnaace.MSALMacOS://auth) - protocol version: 3
hash: 292FBF0D32D7EEDEB520098E44C0236BA94DDD481FAF847F7FF6D5CD141B943C
payload: Masked(not-null)
Completed silent SSO request.
Request complete
Completing SSO request...
Finished SSO request.
```

The logging sample can be broken down into two segments:

|Segment |Description  |
|:---------:|---------|
|**`refresh`** | Broker handles the request for Microsoft Entra ID:<br> - **Handling silent SSO request...**: Denotes a silent request<br> - **correlation_id**: Useful for cross referencing with the Microsoft Entra server-side sign-in logs <br> - **scope**: **User.Read** API permission scope being requested from the Microsoft Graph<br> - **client_version**: version of MSAL that the application is running<br> - **redirect_uri**: MSAL apps use the format **`msauth.com.<Bundle ID>://auth`**<br><br>**Refresh** has notable differences to the request payload:<br> - **authority**: Contains the Microsoft Entra tenant URL endpoint as opposed to the **common** endpoint<br> - **home_account_id**: Show the User account in the format **\<UserObjectId\>.\<TenantID\>**<br> - **username**:  hashed UPN format **auth.placeholder-XXXXXXXX__domainname.com** |
|**PRT Refresh and Acquire Access Token** | This operation revalidates the PRT and refreshes it if necessary, before returning the access token back to the calling client application. |

We can again take the **correlation Id** obtained from the client-side **SSO Extension** logs and cross reference with the server-side Microsoft Entra sign-in logs.

:::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/msal-silent-azure-ad-sign-ins-access-token.png" alt-text="Screenshot showing the Microsoft Entra silent sign-in request using the Enterprise SSO Broker plugin.":::

The Microsoft Entra Sign-in shows identical information to the Microsoft Graph resource from the **login** operation in the previous [interactive login section](#view-azure-ad-sign-in-logs-by-correlation-id-filter).  

#### Non-MSAL/Browser SSO application login flow

The following section walks through how to examine the SSO extension logs  for the Non-MSAL/Browser Application auth flow.  For this example, we're using the Apple Safari browser as the client application, and the application is making a call to the Office.com (OfficeHome) web application. 

##### Non-MSAL/Browser SSO flow walkthrough

The following actions should take place for a successful sign-on:

1. Assume that  User who already has undergone the bootstrapping process has an existing PRT.
1. On a device, with the **Microsoft SSO Extension Broker** deployed, the configured **feature flags** are checked to ensure that the application can be handled by the SSO Extension.
1. Since the Safari browser adheres to the **Apple Networking Stack**, the SSO extension tries to intercept the Microsoft Entra auth request.
1. The PRT is used to acquire a token for the resource being requested.
1. If the device is Microsoft Entra registered, it passes the Device ID along with the request.
1. The SSO extension populates the header of the Browser request to sign-in to the resource.

The following client-side **SSO Extension** logs show the request being handled transparently by the SSO extension broker to fulfill the request.

```
SSOExtensionLogs
Created Browser SSO request for bundle identifier com.apple.Safari, cookie SSO include-list (
), use cookie sso for this app 0, initiating origin https://www.office.com
Init MSIDKeychainTokenCache with keychainGroup: Masked(not-null)
[Browser SSO] Starting Browser SSO request for authority https://login.microsoftonline.com/common
[MSAL] (Default accessor) Found 1 tokens
[Browser SSO] Checking PRTs for deviceId 73796663
[MSAL] [Browser SSO] Executing without UI for authority https://login.microsoftonline.com/common, number of PRTs 1, device registered 1
[MSAL] [Browser SSO] Processing request with PRTs and correlation ID in headers (null), query 67b6a62f-6c5d-40f1-8440-a8edac7a1f87
[MSAL] Resolving authority: Masked(not-null), upn: Masked(null)
[MSAL] No cached preferred_network for authority
[MSAL] Caching AAD Environements
[MSAL] networkHost: login.microsoftonline.com, cacheHost: login.windows.net, aliases: login.microsoftonline.com, login.windows.net, login.microsoft.com, sts.windows.net
[MSAL] networkHost: login.partner.microsoftonline.cn, cacheHost: login.partner.microsoftonline.cn, aliases: login.partner.microsoftonline.cn, login.chinacloudapi.cn
[MSAL] networkHost: login.microsoftonline.de, cacheHost: login.microsoftonline.de, aliases: login.microsoftonline.de
[MSAL] networkHost: login.microsoftonline.us, cacheHost: login.microsoftonline.us, aliases: login.microsoftonline.us, login.usgovcloudapi.net
[MSAL] networkHost: login-us.microsoftonline.com, cacheHost: login-us.microsoftonline.com, aliases: login-us.microsoftonline.com
[MSAL] Resolved authority, validated: YES, error: 0
[MSAL] Found registration registered in login.microsoftonline.com, isSameAsRequestEnvironment: Yes
[MSAL] Passing device header in browser SSO for device id 43cfaf69-0f94-4d2e-a815-c103226c4c04
[MSAL] Adding SSO-cookie header with PRT Masked(not-null)
SSO extension cleared cookies before handling request 1
[Browser SSO] SSO response is successful 0
[MSAL] Keychain find status: 0
[MSAL] (Default accessor) Found 1 tokens
Request does not need UI
[MSAL] [Browser SSO] Checking PRTs for deviceId 73796663
Request complete
```

|SSO extension log component |Description  |
|---------|---------|
|**Created Browser SSO request** | All Non-MSAL/Browser SSO requests begin with this line:<br> - **bundle identifier**: [Bundle ID](#how-to-find-the-bundle-id-for-an-application-on-macos): `com.apple.Safari`<br> - **initiating origin**: Web URL the browser is accessing before hitting one of the login URLs for Microsoft Entra ID (https://office.com) |
|**Starting Browser SSO request for authority**|Resolves the number of PRTs and if the Device is Registered:<br>https://login.microsoftonline.com/common, number of **PRTs 1, device registered 1** |
|**Correlation ID** | [Browser SSO] Processing request with PRTs and correlation ID in headers (null), query **\<CorrelationID\>**. This ID is important for cross-referencing with the Microsoft Entra server-side sign-in logs |
|**Device Registration** | Optionally if the device is Microsoft Entra registered, the SSO extension can pass the device header in Browser SSO requests: <br> - Found registration registered in<br> - **login.microsoftonline.com, isSameAsRequestEnvironment: Yes** <br><br>Passing device header in browser SSO for **device id** `43cfaf69-0f94-4d2e-a815-c103226c4c04`|

Next, use the correlation ID obtained from the Browser SSO extension logs  to cross-reference the Microsoft Entra sign-in logs.

:::image type="content" source="media/troubleshoot-mac-sso-extension-plugin/browser-sso-azure-ad-sign-ins-interactive.png" alt-text="Screenshot showing cross reference in the Microsoft Entra sign-in logs for the Browser SSO Extension.":::

|Sign-in log attribute  |Description  |
|---------|---------|
|**Application**| Display Name of the Application registration in the Microsoft Entra tenant where the client application authenticates. In this example, the display name is **OfficeHome**. |
|**Application Id**| Also referred to the ClientID of the application registration in the Microsoft Entra tenant. |
|**Resource**| The API resource that the client application is trying to obtain access to. In this example, the resource is the **OfficeHome** web application. |
|**Incoming Token Type**| An Incoming token type of **Primary Refresh Token (PRT)** shows the input token being used to obtain an access token for the resource. |
|**Authentication method detected**| Under the **Authentication Details** tab, the value of  **Microsoft Entra SSO plug-in** is useful indicator that the SSO extension is being used to facilitate the Browser SSO request   |
|**Microsoft Entra SSO extension version**| Under the **Additional Details** tab, this value shows the version of the Microsoft Enterprise SSO extension Broker app. |
|**Device ID**| If the device is registered, the SSO extension can pass the Device ID to handle device authentication requests. |
|**Operating System**| Shows the type of operating system. |
|**Compliant**| SSO extension can facilitate Compliance policies by passing the device header. The requirements are:<br> - **Microsoft Entra Device Registration**<br> - **MDM Management**<br> - **Intune or Intune Partner  Compliance** |
|**Managed**| Indicates that device is under management. |
|**Join Type**| macOS and iOS, if registered, can only be of type: **Microsoft Entra registered**. |

> [!TIP]
> If you use Jamf Connect, it is recommended that you follow the [latest Jamf guidance on integrating Jamf Connect with Microsoft Entra ID](https://learn.jamf.com/bundle/jamf-connect-documentation-current/page/Jamf_Connect_and_Microsoft_Conditional_Access.html). The recommended integration pattern ensures that Jamf Connect works properly with your Conditional Access policies and Microsoft Entra ID Protection.

## Next steps

- [Microsoft Enterprise SSO plug-in for Apple devices (preview)](../develop/apple-sso-plugin.md)
- [Deploy the Microsoft Enterprise SSO plug-in for Apple Devices (preview)](/mem/intune/configuration/use-enterprise-sso-plug-in-ios-ipados-macos)
