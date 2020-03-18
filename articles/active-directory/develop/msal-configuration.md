---
title: Android MSAL configuration file | Azure
titleSuffix: Microsoft identity platform
description: An overview of the Android Microsoft Authentication Library (MSAL) configuration file, which represents an application's configuration in Azure Active Directory.
services: active-directory
author: shoatman
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 09/12/2019
ms.author: shoatman
ms.custom: aaddev
ms.reviewer: shoatman
---

# Android Microsoft Authentication Library configuration file

The Android Microsoft Authentication Library (MSAL) ships with a [default configuration JSON file](https://github.com/AzureAD/microsoft-authentication-library-for-android/blob/dev/msal/src/main/res/raw/msal_default_config.json) that you customize to define the behavior of your public client app for things such as the default authority, which authorities you'll use, and so on.

This article will help you understand the various settings in the configuration file and how to specify the configuration file to use in your MSAL-based app.

## Configuration settings

### General settings

| Property | Data Type | Required | Notes |
|-----------|------------|-------------|-------|
| `client_id` | String | Yes | Your app's Client ID from the [Application registration page](https://ms.portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade) |
| `redirect_uri`   | String | Yes | Your app's Redirect URI from the [Application registration page](https://ms.portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade) |
| `authorities` | List\<Authority> | No | The list of authorities your app needs |
| `authorization_user_agent` | AuthorizationAgent (enum) | No | Possible values: `DEFAULT`, `BROWSER`, `WEBVIEW` |
| `http` | HttpConfiguration | No | Configure `HttpUrlConnection` `connect_timeout` and `read_timeout` |
| `logging` | LoggingConfiguration | No | Specifies the level of logging detail. Optional configurations include: `pii_enabled`, which takes a boolean value, and `log_level`, which takes `ERROR`, `WARNING`, `INFO`, or `VERBOSE`. |

### client_id

The client ID or app ID that was created when you registered your application.

### redirect_uri

The redirect URI you registered when you registered your application. If the redirect URI is to a broker app, refer to [Redirect URI for public client apps](msal-client-application-configuration.md#redirect-uri-for-public-client-apps) to ensure you're using the correct redirect URI format for your broker app.

### authorities

The list of authorities that are known and trusted by you. In addition to the authorities listed here, MSAL also queries Microsoft to get a list of clouds and authorities known to Microsoft. In this list of authorities, specify the type of the authority and any additional optional parameters such as `"audience"`, which should align with the audience of your app based on your app's registration. The following is an example list of authorities:

```javascript
// Example AzureAD and Personal Microsoft Account
{
    "type": "AAD",
    "audience": {
        "type": "AzureADandPersonalMicrosoftAccount"
    },
    "default": true // Indicates that this is the default to use if not provided as part of the acquireToken or acquireTokenSilent call
},
// Example AzureAD My Organization
{
    "type": "AAD",
    "audience": {
        "type": "AzureADMyOrg",
        "tenantId": "contoso.com" // Provide your specific tenant ID here
    }
},
// Example AzureAD Multiple Organizations
{
    "type": "AAD",
    "audience": {
        "type": "AzureADMultipleOrgs"
    }
},
//Example PersonalMicrosoftAccount
{
    "type": "AAD",
    "audience": {
        "type": "PersonalMicrosoftAccount"
    }
}
```

#### Map AAD authority & audience to Microsoft identity platform endpoints

| Type | Audience | Tenant ID | Authority_Url | Resulting Endpoint | Notes |
|------|------------|------------|----------------|----------------------|---------|
| AAD | AzureADandPersonalMicrosoftAccount | | | https://login.microsoftonline.com/common | `common` is a tenant alias for where the account is. Such as a specific Azure Active Directory tenant or the Microsoft account system. |
| AAD | AzureADMyOrg | contoso.com | | https://login.microsoftonline.com/contoso.com | Only accounts present in contoso.com can acquire a token. Any verified domain, or the tenant GUID, may be used as the tenant ID. |
| AAD | AzureADMultipleOrgs | | | https://login.microsoftonline.com/organizations | Only Azure Active Directory accounts can be used with this endpoint. Microsoft accounts can be members of organizations. To acquire a token using a Microsoft account for a resource in an organization, specify the organizational tenant from which you want the token. |
| AAD | PersonalMicrosoftAccount | | | https://login.microsoftonline.com/consumers | Only Microsoft accounts can use this endpoint. |
| B2C | | | See Resulting Endpoint | https://login.microsoftonline.com/tfp/contoso.onmicrosoft.com/B2C_1_SISOPolicy/ | Only accounts present in the contoso.onmicrosoft.com tenant can acquire a token. In this example, the B2C policy is part of the Authority URL path. |

> [!NOTE]
> Authority validation cannot be enabled and disabled in MSAL.
> Authorities are either known to you as the developer as specified via configuration or known to Microsoft via metadata.
> If MSAL receives a request for a token to an unknown authority, an `MsalClientException` of type `UnknownAuthority` results.

#### Authority properties

| Property | Data type  | Required | Notes |
|-----------|-------------|-----------|--------|
| `type` | String | Yes | Mirrors the audience or account type your app targets. Possible values: `AAD`, `B2C` |
| `audience` | Object | No | Only applies when type=`AAD`. Specifies the identity your app targets. Use the value from your app registration |
| `authority_url` | String | Yes | Required only when type=`B2C`. Specifies the authority URL or policy your app should use  |
| `default` | boolean | Yes | A single `"default":true` is required when one or more authorities is specified. |

#### Audience Properties

| Property | Data Type  | Required | Notes |
|-----------|-------------|------------|-------|
| `type` | String | Yes | Specifies the audience your app wants to target. Possible values: `AzureADandPersonalMicrosoftAccount`, `PersonalMicrosoftAccount`, `AzureADMultipleOrgs`, `AzureADMyOrg` |
| `tenant_id` | String | Yes | Required only when `"type":"AzureADMyOrg"`. Optional for other `type` values. This can be a tenant domain such as `contoso.com`, or a tenant ID such as `72f988bf-86f1-41af-91ab-2d7cd011db46`) |

### authorization_user_agent

Indicates whether to use an embedded webview, or the default browser on the device, when signing in an account or authorizing access to a resource.

Possible values:
- `DEFAULT`: Prefers the system browser. Uses the embedded web view if a browser isn't available on the device.
- `WEBVIEW`: Use the embedded web view.
- `BROWSER`: Uses the default browser on the device.

### multiple_clouds_supported

For clients that support multiple national clouds, specify `true`. The Microsoft identity platform will then automatically redirect to the correct national cloud during authorization and token redemption. You can determine the national cloud of the signed-in account by examining the authority associated with the `AuthenticationResult`. Note that the `AuthenticationResult` doesn't provide the national cloud-specific endpoint address of the resource for which you request a token.

### broker_redirect_uri_registered

A boolean that indicates whether you're using a Microsoft Identity broker compatible in-broker redirect URI. Set to `false` if you don't want to use the broker within your app.

If you're using the AAD Authority with Audience set to `"MicrosoftPersonalAccount"`, the broker won't be used.

### http

Configure global settings for HTTP timeouts, such as:

| Property | Data type | Required | Notes |
| ---------|-----------|------------|--------|
| `connect_timeout` | int | No | Time in milliseconds |
| `read_timeout` | int | No | Time in milliseconds |

### logging

The following global settings are for logging:

| Property | Data Type  | Required | Notes |
| ----------|-------------|-----------|---------|
| `pii_enabled`  | boolean | No | Whether to emit personal data |
| `log_level`   | boolean | No | Which log messages to output |
| `logcat_enabled` | boolean | No | Whether to output to log cat in addition to the logging interface |

### account_mode

Specifies how many accounts can be used within your app at a time. The possible values are:

- `MULTIPLE` (Default)
- `SINGLE`

Constructing a `PublicClientApplication` using an account mode that doesn't match this setting will result in an exception.

For more information about the differences between single and multiple accounts, see [Single and multiple account apps](single-multi-account.md).

### browser_safelist

An allow-list of browsers that are compatible with MSAL. These browsers correctly handle redirects to custom intents. You can add to this list. The default is provided in the default configuration shown below.
``
## The default MSAL configuration file

The default MSAL configuration that ships with MSAL is shown below. 
You can see the latest version on [GitHub](https://github.com/AzureAD/microsoft-authentication-library-for-android/blob/dev/msal/src/main/res/raw/msal_default_config.json).

This configuration is supplemented by values that you provide. The values you provide override the defaults.

```javascript
{
  "authorities": [
    {
      "type": "AAD",
      "audience": {
        "type": "AzureADandPersonalMicrosoftAccount"
      },
      "default": true
    }
  ],
  "authorization_user_agent": "DEFAULT",
  "multiple_clouds_supported": false,
  "broker_redirect_uri_registered": false,
  "http": {
    "connect_timeout": 10000,
    "read_timeout": 30000
  },
  "logging": {
    "pii_enabled": false,
    "log_level": "WARNING",
    "logcat_enabled": false
  },
  "shared_device_mode_supported": false,
  "account_mode": "MULTIPLE",
  "browser_safelist": [
    {
      "browser_package_name": "com.android.chrome",
      "browser_signature_hashes": [
        "7fmduHKTdHHrlMvldlEqAIlSfii1tl35bxj1OXN5Ve8c4lU6URVu4xtSHc3BVZxS6WWJnxMDhIfQN0N0K2NDJg=="
      ],
      "browser_use_customTab" : true,
      "browser_version_lower_bound": "45"
    },
    {
      "browser_package_name": "com.android.chrome",
      "browser_signature_hashes": [
        "7fmduHKTdHHrlMvldlEqAIlSfii1tl35bxj1OXN5Ve8c4lU6URVu4xtSHc3BVZxS6WWJnxMDhIfQN0N0K2NDJg=="
      ],
      "browser_use_customTab" : false
    },
    {
      "browser_package_name": "org.mozilla.firefox",
      "browser_signature_hashes": [
        "2gCe6pR_AO_Q2Vu8Iep-4AsiKNnUHQxu0FaDHO_qa178GByKybdT_BuE8_dYk99G5Uvx_gdONXAOO2EaXidpVQ=="
      ],
      "browser_use_customTab" : false
    },
    {
      "browser_package_name": "org.mozilla.firefox",
      "browser_signature_hashes": [
        "2gCe6pR_AO_Q2Vu8Iep-4AsiKNnUHQxu0FaDHO_qa178GByKybdT_BuE8_dYk99G5Uvx_gdONXAOO2EaXidpVQ=="
      ],
      "browser_use_customTab" : true,
      "browser_version_lower_bound": "57"
    },
    {
      "browser_package_name": "com.sec.android.app.sbrowser",
      "browser_signature_hashes": [
        "ABi2fbt8vkzj7SJ8aD5jc4xJFTDFntdkMrYXL3itsvqY1QIw-dZozdop5rgKNxjbrQAd5nntAGpgh9w84O1Xgg=="
      ],
      "browser_use_customTab" : true,
      "browser_version_lower_bound": "4.0"
    },
    {
      "browser_package_name": "com.sec.android.app.sbrowser",
      "browser_signature_hashes": [
        "ABi2fbt8vkzj7SJ8aD5jc4xJFTDFntdkMrYXL3itsvqY1QIw-dZozdop5rgKNxjbrQAd5nntAGpgh9w84O1Xgg=="
      ],
      "browser_use_customTab" : false
    },
    {
      "browser_package_name": "com.cloudmosa.puffinFree",
      "browser_signature_hashes": [
        "1WqG8SoK2WvE4NTYgr2550TRhjhxT-7DWxu6C_o6GrOLK6xzG67Hq7GCGDjkAFRCOChlo2XUUglLRAYu3Mn8Ag=="
      ],
      "browser_use_customTab" : false
    },
    {
      "browser_package_name": "com.duckduckgo.mobile.android",
      "browser_signature_hashes": [
        "S5Av4cfEycCvIvKPpKGjyCuAE5gZ8y60-knFfGkAEIZWPr9lU5kA7iOAlSZxaJei08s0ruDvuEzFYlmH-jAi4Q=="
      ],
      "browser_use_customTab" : false
    },
    {
      "browser_package_name": "com.explore.web.browser",
      "browser_signature_hashes": [
        "BzDzBVSAwah8f_A0MYJCPOkt0eb7WcIEw6Udn7VLcizjoU3wxAzVisCm6bW7uTs4WpMfBEJYf0nDgzTYvYHCag=="
      ],
      "browser_use_customTab" : false
    },

    {
      "browser_package_name": "com.ksmobile.cb",
      "browser_signature_hashes": [
        "lFDYx1Rwc7_XUn4KlfQk2klXLufRyuGHLa3a7rNjqQMkMaxZueQfxukVTvA7yKKp3Md3XUeeDSWGIZcRy7nouw=="
      ],
      "browser_use_customTab" : false
    },

    {
      "browser_package_name": "com.microsoft.emmx",
      "browser_signature_hashes": [
        "Ivy-Rk6ztai_IudfbyUrSHugzRqAtHWslFvHT0PTvLMsEKLUIgv7ZZbVxygWy_M5mOPpfjZrd3vOx3t-cA6fVQ=="
      ],
      "browser_use_customTab" : false
    },

    {
      "browser_package_name": "com.opera.browser",
      "browser_signature_hashes": [
        "FIJ3IIeqB7V0qHpRNEpYNkhEGA_eJaf7ntca-Oa_6Feev3UkgnpguTNV31JdAmpEFPGNPo0RHqdlU0k-3jWJWw=="
      ],
      "browser_use_customTab" : false
    },

    {
      "browser_package_name": "com.opera.mini.native",
      "browser_signature_hashes": [
        "TOTyHs086iGIEdxrX_24aAewTZxV7Wbi6niS2ZrpPhLkjuZPAh1c3NQ_U4Lx1KdgyhQE4BiS36MIfP6LbmmUYQ=="
      ],
      "browser_use_customTab" : false
    },

    {
      "browser_package_name": "mobi.mgeek.TunnyBrowser",
      "browser_signature_hashes": [
        "RMVoXuK1sfJZuGZ8onG1yhMc-sKiAV2NiB_GZfdNlN8XJ78XEE2wPM6LnQiyltF25GkHiPN2iKQiGwaO2bkyyQ=="
      ],
      "browser_use_customTab" : false
    },

    {
      "browser_package_name": "org.mozilla.focus",
      "browser_signature_hashes": [
        "L72dT-stFqomSY7sYySrgBJ3VYKbipMZapmUXfTZNqOzN_dekT5wdBACJkpz0C6P0yx5EmZ5IciI93Q0hq0oYA=="
      ],
      "browser_use_customTab" : false
    }
  ]
}
```
## Example basic configuration

The following example illustrates a basic configuration that specifies the client ID, redirect URI, whether a broker redirect is registered, and a list of authorities.

```javascript
{
  "client_id" : "4b0db8c2-9f26-4417-8bde-3f0e3656f8e0",
  "redirect_uri" : "msauth://com.microsoft.identity.client.sample.local/1wIqXSqBj7w%2Bh11ZifsnqwgyKrY%3D",
  "broker_redirect_uri_registered": true,
  "authorities" : [
    {
      "type": "AAD",
      "audience": {
        "type": "AzureADandPersonalMicrosoftAccount"
      }
      "default": true
    }
  ]
}
```

## How to use a configuration file

1. Create a configuration file. We recommend that you create your custom configuration file in `res/raw/auth_config.json`. But you can put it anywhere that you wish.
2. Tell MSAL where to look for your configuration when you construct the `PublicClientApplication`. For example:

   ```java
   //On Worker Thread
   IMultipleAccountPublicClientApplication sampleApp = null; 
   sampleApp = new PublicClientApplication.createMultipleAccountPublicClientApplication(getApplicationContext(), R.raw.auth_config);
   ```
