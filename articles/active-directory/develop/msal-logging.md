---
title: Logging in MSAL applications | Azure
description: Learn about logging in Microsoft Authentication Library (MSAL) applications.
services: active-directory
documentationcenter: dev-center-name
author: TylerMSFT
manager: CelesteDG
editor: ''

ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 09/05/2019
ms.author: twhitney
ms.reviewer: saeeda
ms.custom: aaddev
#Customer intent: As an application developer, I want to learn about logging so I can diagnose and troubleshoot my apps.
ms.collection: M365-identity-device-management
---

# Logging

Microsoft Authentication Library (MSAL) apps to generate log messages that can help diagnose issues and provide details. An app can configure logging with a few lines of code, and have custom control over the level of detail and whether or not personal and organizational data is logged. It is recommended that you set an MSAL logging callback and provide a way for users to submit logs when they are having authentication issues.

## Logging levels

You can specify the level of detail to be captured by MSAL's logger:

- **Error**: MSAL will log error information.
- **Warning**: MSAL will log information that can be used to help diagnose problems.
- **Info**: MSAL will log general information that isn't necessarily intended for debugging.
- **Verbose**: This is the default logging level. MSAL will log full library behavior details.

## Personal and organizational data

By default, the MSAL logger does not capture any highly sensitive personal or organizational data. The library provides you the option to enable logging personal and organizational data if you decide to do so.

## Logging in MSAL.NET

 > [!NOTE]
 > For more information about MSAL.NET, check out the [MSAL.NET wiki](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/wiki). Get samples of MSAL.NET logging and more.
 
In MSAL 3.x, logging is set per application at app creation using the `.WithLogging` builder modifier. This method takes optional parameters:

- *Level* enables you to decide which level of logging you want. Setting it to Errors will only get errors
- *PiiLoggingEnabled* enables you to log personal and organizational data if set to true. By default this is set to false, so that your application does not log personal data.
- *LogCallback* is set to a delegate that does the logging. If *PiiLoggingEnabled* is true, this method will receive the messages twice: once with the *containsPii* parameter equals false and the message without personal data, and a second time with the *containsPii* parameter equals to true and the message might contain personal data. In some cases (when the message does not contain personal data), the message will be the same.
- *DefaultLoggingEnabled* enables the default logging for the platform. By default it's false. If you set it to true it uses Event Tracing in Desktop/UWP applications, NSLog on iOS and logcat on Android.

```csharp
class Program
 {
  private static void Log(LogLevel level, string message, bool containsPii)
  {
     if (containsPii)
     {
        Console.ForegroundColor = ConsoleColor.Red;
     }
     Console.WriteLine($"{level} {message}");
     Console.ResetColor();
  }

  static void Main(string[] args)
  {
    var scopes = new string[] { "User.Read" };

    var application = PublicClientApplicationBuilder.Create("<clientID>")
                      .WithLogging(Log, LogLevel.Info, true)
                      .Build();

    AuthenticationResult result = application.AcquireTokenInteractive(scopes)
                                             .ExecuteAsync().Result;
  }
 }
 ```

## Logging in MSAL for Android using Java

Turn logging on at app creation by creating a logging callback. The callback takes these parameters:

- `tag` enables you to associate log entries with a string. This can help you sort logging messages by types (strings) that you define.
- `logLevel` enables you to decide which level of logging you want. Setting it to `Errors` means only errors will be logged, for example.
- `message` is the content of the log entry.
- `containsPII` specifies whether personal identifiable information (PII) or organizational identifiable information (OII) messages are logged. By default, this is set to false, so that your application doesn't log personal data. If `containsPII` is `true`, this method will receive the messages twice: once with the `containsPII` parameter set to `false` and the `message` without personal data, and a second time with the `containsPii` parameter set to `true` and the message might contain personal data. In some cases (when the message does not contain personal data), the message will be the same.

```java
private StringBuilder mLogs;

mLogs = new StringBuilder();
Logger.getInstance().setExternalLogger(new ILoggerCallback()
{
   @Override
   public void log(String tag, Logger.LogLevel logLevel, String message, boolean containsPII)
   {
      mLogs.append(message).append('\n');
   }
});
```

By default, the MSAL logger will not capture any PII or OII.
To enable logging PII or OII:

```java
Logger.getInstance().setEnablePII(true);
```

To disable PII & OII:

```java
Logger.getInstance().setEnablePII(false);
```

## Logging in MSAL.js

 You can enable logging in MSAL.js by passing a logger object during the configuration for creating a `UserAgentApplication` instance. This logger object has the following properties:

- *localCallback*: a Callback instance that can be provided by the developer to consume and publish logs in a custom manner. Implement the localCallback method depending on how you want to redirect logs.

- *level* (optional): the configurable log level. The supported log levels are: Error, Warning, Info, Verbose. Default value is Info.

- *piiLoggingEnabled* (optional): enables you to log personal and organizational data if set to true. By default this is set to false so that your application does not log personal data. Personal data logs are never written to default outputs like Console, Logcat, or NSLog. Default is set to false.

- *correlationId* (optional): a unique identifier, used to map the request with the response for debugging purposes. Defaults to RFC4122 version 4 guid (128 bits).

```javascript

function loggerCallback(logLevel, message, containsPii) {
   console.log(message);
}

var msalConfig = {
    auth: {
        clientId: “abcd-ef12-gh34-ikkl-ashdjhlhsdg”,
    },
     system: {
    		 logger: new Msal.Logger(
                                loggerCallback ,{
                                     level: Msal.LogLevel.Verbose,
                                     piiLoggingEnabled: false,
                                     correlationId: '1234'
                                }
                        )
     }
}

var UserAgentApplication = new Msal.UserAgentApplication(msalConfig);
```
