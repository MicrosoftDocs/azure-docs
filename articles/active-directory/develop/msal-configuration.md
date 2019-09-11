---
title: Understanding the Android MSAL configuration file | Azure
description: An overview of the Android Microsoft Authentication Library (MSAL) configuration file, which represents an application's configuration in an Azure AD tenant, and is used to facilitate callbacks, JTW and more.
services: active-directory
documentationcenter: ''
author: rwike77
manager: CelesteDG
editor: ''
ms.assetid: 4804f3d4-0ff1-4280-b663-f8f10d54d184
ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 04/13/2019
ms.author: ryanwi
ms.custom: aaddev
ms.reviewer: sureshja
ms.collection: M365-identity-device-management
---

# Android MSAL configuration file

To get started configuring your app, you'll want to become familiar with the MSAL configuration json file.  MSAL ships with a default configuration which is supplemented by whatever you provide if your configuration.  

## Configuration Settings

### General 
| Property        | Data Type  | Required | Notes |
| ------------- |-------------|-------------|-------------|
| client_id      | String | Yes | Your apps Client ID from https://apps.dev.microsoft.com |
| redirect_uri   | String | Yes | Your apps Redirect URI from https://apps.dev.microsoft.com |
| authorities | List\<Authority> | No | The list of authorities your app needs |
| authorization_user_agent | AuthorizationAgent (enum) | No | Read more in the SSO wiki article, Options: DEFAULT, BROWSER, WEBVIEW |
| http | HttpConfiguration | No | HTTP configurations like connect and read timeout |
| logging | LoggingConfiguration | No | Level of detail logger captures, Optional configs: pii_enabled (boolean), log_level ([values](https://github.com/AzureAD/microsoft-authentication-library-for-android/blob/dev/msal/src/main/java/com/microsoft/identity/client/Logger.java#L81)) |

### client_id
The client id or app id created when you registered your application.

### redirect_uri
The redirect URI you registered when you registered your application.

>Note: If you want to use the broker please refer to the following <TBD LINK> to ensure that you are using the correct format of redirect uri to support operation with the broker.

### authorities

Authorities is a list of authorities that are known to you and trusted by you.  MSAL also queries Microsoft to get a list of Clouds and Authorities known to Microsoft. In this list of authorities you specify the type of the authority and optional additional parameters include "audience" which aligns to the audience of your application in your app registration.

```javascript
//Example AzureAD and Personal Microsoft Account
{
    "type": "AAD",
    "audience": {
        "type": "AzureADandPersonalMicrosoftAccount"
    },
    "default": true //Indicates that this is the default to use if not provided as part of the acquireToken or acquireTokenSilent call
},
//Example AzureAD My Organization
{
    "type": "AAD",
    "audience": {
        "type": "AzureADMyOrg",
        "tenandId": "contoso.com" // Here you need to provide your specific tenant id
    }
},
//Example AzureAD Multiple Organizations
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

#### AAD Authority & Audience - Mapping to Microsoft Identity Platform Endpoints

| Type | Audience                           | Tenant Id   | Authority_Url          | Resulting Endpoint                                                              | Notes                                                                                                                                                                                                                                                                                                       |
|------|------------------------------------|-------------|------------------------|---------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| AAD  | AzureADandPersonalMicrosoftAccount |             |                        | https://login.microsoftonline.com/common                                        | Common is a tenant alias for the account's "home".  A specific Azure Active Directory tenant or the Microsoft account system.                                                                                                                                                                               |
| AAD  | AzureADMyOrg                       | contoso.com |                        | https://login.microsoftonline.com/contoso.com                                   | Only accounts which are present in the contoso.com will be able to acquire a token. Any verified domain or the tenant GUID may be used as the the tenant id.                                                                                                                                                |
| AAD  | AzureADMultipleOrgs                |             |                        | https://login.microsoftonline.com/organizations                                 | Only Azure Active Directory accounts will be able to be used with this endpoint.  Microsoft accounts can be members of organizations.  In order to acquire a token using a Microsoft account for a resource in an organization you need to specify the organizational tenant from which you want the token. |
| AAD  | PersonalMicrosoftAccount           |             |                        | https://login.microsoftonline.com/consumers                                     | Only Microsoft accounts will be able to be used with this endpoint.                                                                                                                                                                                                                                         |
| B2C  |                                    |             | See Resulting Endpoint | https://login.microsoftonline.com/tfp/contoso.onmicrosoft.com/B2C_1_SISOPolicy/ | Only accounts which are present in the contoso.onmicrosoft.com tenant will be able to acquire a token.  In this example the B2C policy is part of the Authority URL path.                                                                                                                                   |
NOTE: Authority validation no longer something that can be enabled and disabled in MSAL.  Authorities are either known to you as the developer as specified via configuration or known to Microsoft via metadata.  If MSAL receives a request for a token to an unknown authority an MsalClientException of type "UnknownAuthority" will result.

#### Authority Properties
| Property        | Data Type  | Required | Notes |
| ------------- |-------------|-------------|-------------|
| type      | String | Yes | Mirrors the audience or account type your app targets, Options: AAD, B2C |
| audience   | Object | No | Only applies to type=AAD, specifies the identity your app targets, mirror your app registration configuration|
| authority_url | String | Yes | Required if and only if type=B2C, indicates the authority url or policy your app should use  |
| default | boolean | Yes | If one or more authority is specified, a single default=true is required.  |


#### Audience Properties
| Property        | Data Type  | Required | Notes |
| ------------- |-------------|-------------|-------------|
| type      | String | Yes | Indicates the audience your app wants to target, Options: AzureADandPersonalMicrosoftAccount, PersonalMicrosoftAccount, AzureADMultipleOrgs, or AzureADMyOrg |
| tenant_id   | String | Yes | Required if and only if type=AzureADMyOrg. Optional for other type values. This can be a tenant domain (e.g. contoso.com) or a tenant ID (e.g. 72f988bf-86f1-41af-91ab-2d7cd011db46)|

### authorization_user_agent

Indicates whether to use embedded webview or the default browser on the device when signing an account in or authorizing access to a resource.  

Possible settings include:
- DEFAULT (Prefers use of system browser.  Will default back to embedded web view if no other reliable browser is available on the device)
- WEBVIEW - Uses the embedded web view
- BROWSER - Uses the default browser on the device.

### multiple_clouds_supported

Some clients may wish to support multiple national clouds.  If your client is aware of how to operate in these environments you can specify "true" for this boolean setting.  Doing so will result in the Microsoft Identity Platform redirecting to the correct national cloud during authorization and token redemption automatically.  You will be able to determine the national cloud of the signed in account by examining the resulting authority associated with the AuthenticationResult.  The AuthenticationResult does not provide the national cloud specific endpoint address of the resource for which you request a token. 

### broker_redirect_uri_registered

A boolean indicating whether you are using a Microsoft Identity broker compatible in broker redirect URI.  See <TODO add link to broker redirect URIs>.  If you don't want to use the broker within your app set this to false.  

> Note: If you are using the AAD Authority with Audience "MicrosoftPersonalAccount" the broker will not be used.

### http

Configure global settings for HTTP timeouts:

#### http Properties

| Property        | Data Type  | Required | Notes |
| ------------- |-------------|-------------|-------------|
| connect_timeout      | int | No | Time in milliseconds |
| read_timeout   | int | No | Time in milliseconds|


### logging

Configure global settings for logging:

#### logging Properties
| Property        | Data Type  | Required | Notes |
| ------------- |-------------|-------------|-------------|
| pii_enabled      | boolean | No | Indicates whether to emit PII |
| log_level   | boolean | No | Indicates the level of the log messages that you want to have outputted.|
| logcat_enabled | boolean | No | Indicates whether to output to log cat as well as via the logging interface  |


### shared_device_mode_supported

The Microsoft Identity platform will soon allow devices to be placed into a shared mode.  This boolean indicates whether or not your app knows how to operate in this environment.  Apps that wish to be compatible with shared device mode and learn more here. <TODO Add link>

### account_mode

MSAL introduces the ability to control how many accounts are allowed to be used within your app at a time.  Possible settings include:

- MULTIPLE (Default)
- SINGLE

>NOTE: If you attempt to construct a PublicClientApplication; Single or MultipleAccount that does not align with this setting an exception will occur.

See: for more information on single account vs multiple account public client applications.

### browser_safelist

This is an allow list of browsers that we know are compatible with MSAL.  These are browsers that correctly handle redirects to custom intents.  You can add to this list as needed.  The default is provided in the default configuration below.

## Default Configuration
The following is the default MSAL configuration that ships with the library.  This configuration will be supplemented by what you provide and in all cases may be overridden by the values that your provide.

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


## Example Basic Configuration

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

## Using Configuration

### 1. Create your configuration 

   The configuration object is JSON and lives in a file alongside your app. Feel free to drop it anywhere in your app, but we recommend creating your custom configuration in `res/raw/auth_config.json`.  Use the information above to create your configuration file.

### 2. Tell MSAL where to find your configuration file

   Next, you need to tell MSAL where to look for your configuration. This is done in the construction of a `PublicClientApplication`, for example:

   ```java
   //On Worker Thread
   IMultipleAccountPublicClientApplication sampleApp = null; 
   sampleApp = new PublicClientApplication.createMultipleAccountPublicClientApplication(getApplicationContext(), R.raw.auth_config);
   ```






