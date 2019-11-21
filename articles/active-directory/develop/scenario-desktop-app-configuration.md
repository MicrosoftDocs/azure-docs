---
title: Desktop app that calls web APIs (code configuration) - Microsoft identity platform
description: Learn how to build a Desktop app that calls web APIs (app's code configuration)
services: active-directory
documentationcenter: dev-center-name
author: jmprieur
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 10/30/2019
ms.author: jmprieur
ms.custom: aaddev
#Customer intent: As an application developer, I want to know how to write a Desktop app that calls web APIs using the Microsoft identity platform for developers.
ms.collection: M365-identity-device-management
---

# Desktop app that calls web APIs - code configuration

Now that you've created your application, you'll learn how to configure the code with the application's coordinates.

## MSAL libraries

The Microsoft libraries supporting desktop applications are:

  MSAL library | Description
  ------------ | ----------
  ![MSAL.NET](media/sample-v2-code/logo_NET.png) <br/> MSAL.NET  | Supports building a desktop application in multiple platforms- Linux, Windows and MacOS
  ![Python](media/sample-v2-code/logo_python.png) <br/> MSAL Python | Supports building a desktop application in multiple platforms. Development in progress - in public preview
  ![Java](media/sample-v2-code/logo_java.png) <br/> MSAL Java | Supports building a desktop application in multiple platforms. Development in progress - in public preview
  ![MSAL iOS](media/sample-v2-code/logo_iOS.png) <br/> MSAL iOS | Supports desktop applications running on macOS only

## Public client application

From a code point of view, desktop applications are public client applications. The configuration will be a bit different based on whether you use interactive authentication or not.

# [.NET](#tab/dotnet)

You'll need to build and manipulate MSAL.NET `IPublicClientApplication`.

![IPublicClientApplication](media/scenarios/public-client-application.png)

### Exclusively by code

The following code instantiates a public client application, signing-in users in the Microsoft Azure public cloud, with a work and school account, or a personal Microsoft account.

```CSharp
IPublicClientApplication app = PublicClientApplicationBuilder.Create(clientId)
    .Build();
```

If you intend to use interactive authentication or Device Code Flow, as seen above, you want to use the `.WithRedirectUri` modifier:

```CSharp
IPublicClientApplication app;
app = PublicClientApplicationBuilder.Create(clientId)
        .WithDefaultRedirectUri()
        .Build();
```

### Using configuration files

The following code instantiates a Public client application from a configuration object, which could be filled-in programmatically or read from a configuration file

```CSharp
PublicClientApplicationOptions options = GetOptions(); // your own method
IPublicClientApplication app = PublicClientApplicationBuilder.CreateWithApplicationOptions(options)
        .WithDefaultRedirectUri()
        .Build();
```

### More elaborated configuration

You can elaborate the application building by adding a number of modifiers. For instance, if you want your application to be a multi-tenant application in a national cloud (here US Government), you could write:

```CSharp
IPublicClientApplication app;
app = PublicClientApplicationBuilder.Create(clientId)
        .WithDefaultRedirectUri()
        .WithAadAuthority(AzureCloudInstance.AzureUsGovernment,
                         AadAuthorityAudience.AzureAdMultipleOrgs)
        .Build();
```

MSAL.NET also contains a modifier for ADFS 2019:

```CSharp
IPublicClientApplication app;
app = PublicClientApplicationBuilder.Create(clientId)
        .WithAdfsAuthority("https://consoso.com/adfs")
        .Build();
```

Finally, if you want to acquire tokens for an Azure AD B2C tenant, can specify your tenant as shown in the following code snippet:

```CSharp
IPublicClientApplication app;
app = PublicClientApplicationBuilder.Create(clientId)
        .WithB2CAuthority("https://fabrikamb2c.b2clogin.com/tfp/{tenant}/{PolicySignInSignUp}")
        .Build();
```

### Learn more

To learn more on how to configure an MSAL.NET desktop application:

- For the list of all modifiers available on `PublicClientApplicationBuilder`, see the reference documentation [PublicClientApplicationBuilder](https://docs.microsoft.com/dotnet/api/microsoft.identity.client.publicclientapplicationbuilder#methods)
- For the description of all the options exposed in `PublicClientApplicationOptions` see [PublicClientApplicationOptions](https://docs.microsoft.com/dotnet/api/microsoft.identity.client.publicclientapplicationoptions), in the reference documentation

### Complete example with configuration Options

Imagine a .NET Core console application that has the following `appsettings.json` configuration file:

```JSon
{
  "Authentication": {
    "AzureCloudInstance": "AzurePublic",
    "AadAuthorityAudience": "AzureAdMultipleOrgs",
    "ClientId": "ebe2ab4d-12b3-4446-8480-5c3828d04c50"
  },

  "WebAPI": {
    "MicrosoftGraphBaseEndpoint": "https://graph.microsoft.com"
  }
}
```

You have little code to read this file using the .NET provided configuration framework;

```CSharp
public class SampleConfiguration
{
 /// <summary>
 /// Authentication options
 /// </summary>
 public PublicClientApplicationOptions PublicClientApplicationOptions { get; set; }

 /// <summary>
 /// Base URL for Microsoft Graph (it varies depending on whether the application is ran
 /// in Microsoft Azure public clouds or national / sovereign clouds
 /// </summary>
 public string MicrosoftGraphBaseEndpoint { get; set; }

 /// <summary>
 /// Reads the configuration from a json file
 /// </summary>
 /// <param name="path">Path to the configuration json file</param>
 /// <returns>SampleConfiguration as read from the json file</returns>
 public static SampleConfiguration ReadFromJsonFile(string path)
 {
  // .NET configuration
  IConfigurationRoot Configuration;
  var builder = new ConfigurationBuilder()
                    .SetBasePath(Directory.GetCurrentDirectory())
                    .AddJsonFile(path);
  Configuration = builder.Build();

  // Read the auth and graph endpoint config
  SampleConfiguration config = new SampleConfiguration()
  {
   PublicClientApplicationOptions = new PublicClientApplicationOptions()
  };
  Configuration.Bind("Authentication", config.PublicClientApplicationOptions);
  config.MicrosoftGraphBaseEndpoint =
  Configuration.GetValue<string>("WebAPI:MicrosoftGraphBaseEndpoint");
  return config;
 }
}
```

Now, to create your application, you'll just need to write the following code:

```CSharp
SampleConfiguration config = SampleConfiguration.ReadFromJsonFile("appsettings.json");
var app = PublicClientApplicationBuilder.CreateWithApplicationOptions(config.PublicClientApplicationOptions)
           .WithDefaultRedirectUri()
           .Build();
```

and before the call to the `.Build()` method, you can override your configuration with calls to `.WithXXX` methods as seen previously.

# [Java](#tab/java)

Here is the class used in MSAL Java dev samples to configure the samples: [TestData](https://github.com/AzureAD/microsoft-authentication-library-for-java/blob/dev/src/samples/public-client/TestData.java).

```Java
PublicClientApplication app = PublicClientApplication.builder(TestData.PUBLIC_CLIENT_ID)
        .authority(TestData.AUTHORITY_COMMON)
        .build();
```

# [Python](#tab/python)

```Python
config = json.load(open(sys.argv[1]))

app = msal.PublicClientApplication(
    config["client_id"], authority=config["authority"],
    # token_cache=...  # Default cache is in memory only.
                       # You can learn how to use SerializableTokenCache from
                       # https://msal-python.rtfd.io/en/latest/#msal.SerializableTokenCache
    )
```

# [MacOS](#tab/macOS)

The following code instantiates a public client application, signing-in users in the Microsoft Azure public cloud, with a work and school account, or a personal Microsoft account.

### Quick configuration

Objective-C:

```objc
NSError *msalError = nil;

MSALPublicClientApplicationConfig *config = [[MSALPublicClientApplicationConfig alloc] initWithClientId:@"<your-client-id-here>"];    
MSALPublicClientApplication *application = [[MSALPublicClientApplication alloc] initWithConfiguration:config error:&msalError];
```

Swift:
```swift
let config = MSALPublicClientApplicationConfig(clientId: "<your-client-id-here>")
if let application = try? MSALPublicClientApplication(configuration: config){ /* Use application */}
```

### More elaborated configuration

You can elaborate the application building by adding a number of modifiers. For instance, if you want your application to be a multi-tenant application in a national cloud (here US Government), you could write:

Objective-C:

```objc
MSALAADAuthority *aadAuthority =
                [[MSALAADAuthority alloc] initWithCloudInstance:MSALAzureUsGovernmentCloudInstance
                                                   audienceType:MSALAzureADMultipleOrgsAudience
                                                      rawTenant:nil
                                                          error:nil];

MSALPublicClientApplicationConfig *config =
                [[MSALPublicClientApplicationConfig alloc] initWithClientId:@"<your-client-id-here>"
                                                                redirectUri:@"<your-redirect-uri-here>"
                                                                  authority:aadAuthority];

NSError *applicationError = nil;
MSALPublicClientApplication *application =
                [[MSALPublicClientApplication alloc] initWithConfiguration:config error:&applicationError];
```

Swift:

```swift
let authority = try? MSALAADAuthority(cloudInstance: .usGovernmentCloudInstance, audienceType: .azureADMultipleOrgsAudience, rawTenant: nil)

let config = MSALPublicClientApplicationConfig(clientId: "<your-client-id-here>", redirectUri: "<your-redirect-uri-here>", authority: authority)
if let application = try? MSALPublicClientApplication(configuration: config) { /* Use application */}
```
---

## Next steps

> [!div class="nextstepaction"]
> [Acquiring a token for a desktop app](scenario-desktop-acquire-token.md)
