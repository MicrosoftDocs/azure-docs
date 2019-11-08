---
title: Logging in Microsoft Authentication Library (MSAL) applications 
titleSuffix: Microsoft identity platform
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

# Logging in MSAL applications

Microsoft Authentication Library (MSAL) apps generate log messages that can help diagnose issues. An app can configure logging with a few lines of code, and have custom control over the level of detail and whether or not personal and organizational data is logged. We recommend you create an MSAL logging callback and provide a way for users to submit logs when they have authentication issues.

## Logging levels

MSAL provides several levels of logging detail:

- Error: Indicates something has gone wrong and an error was generated. Use for debugging and identifying problems.
- Warning: There hasn't necessarily been an error or failure, but are intended for diagnostics and pinpointing problems.
- Info: MSAL will log events intended for informational purposes not necessarily intended for debugging.
- Verbose: Default. MSAL logs the full details of library behavior.

## Personal and organizational data

By default, the MSAL logger doesn't capture any highly sensitive personal or organizational data. The library provides the option to enable logging personal and organizational data if you decide to do so.

## Logging in MSAL.NET

 > [!NOTE]
 > See the [MSAL.NET wiki](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/wiki) for samples of MSAL.NET logging and more.

In MSAL 3.x, logging is set per application at app creation using the `.WithLogging` builder modifier. This method takes optional parameters:

- `Level` enables you to decide which level of logging you want. Setting it to Errors will only get errors
- `PiiLoggingEnabled` enables you to log personal and organizational data if set to true. By default this is set to false, so that your application does not log personal data.
- `LogCallback` is set to a delegate that does the logging. If `PiiLoggingEnabled` is true, this method will receive the messages twice: once with the `containsPii` parameter equals false and the message without personal data, and a second time with the `containsPii` parameter equals to true and the message might contain personal data. In some cases (when the message does not contain personal data), the message will be the same.
- `DefaultLoggingEnabled` enables the default logging for the platform. By default it's false. If you set it to true it uses Event Tracing in Desktop/UWP applications, NSLog on iOS and logcat on Android.

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

- `tag` is a string passed to the callback by the library. It is associated with the log entry and can be used to sort logging messages.
- `logLevel` enables you to decide which level of logging you want. The supported log levels are: `Error`, `Warning`, `Info`, and `Verbose`.
- `message` is the content of the log entry.
- `containsPII` specifies whether messages containing personal data, or organizational data are logged. By default, this is set to false, so that your application doesn't log personal data. If `containsPII` is `true`, this method will receive the messages twice: once with the `containsPII` parameter set to `false` and the `message` without personal data, and a second time with the `containsPii` parameter set to `true` and the message might contain personal data. In some cases (when the message does not contain personal data), the message will be the same.

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

By default, the MSAL logger will not capture any personal identifiable information or organizational identifiable information.
To enable the logging of personal identifiable information or organizational identifiable information:

```java
Logger.getInstance().setEnablePII(true);
```

To disable logging personal data and organization data:

```java
Logger.getInstance().setEnablePII(false);
```

By default logging to logcat is disabled. To enable: 
```java
Logger.getInstance().setEnableLogcatLog(true);
```

## Logging in MSAL.js

 Enable logging in MSAL.js by passing a logger object during the configuration for creating a `UserAgentApplication` instance. This logger object has the following properties:

- `localCallback`: a Callback instance that can be provided by the developer to consume and publish logs in a custom manner. Implement the localCallback method depending on how you want to redirect logs.
- `level` (optional): the configurable log level. The supported log levels are: `Error`, `Warning`, `Info`, and `Verbose`. The default is `Info`.
- `piiLoggingEnabled` (optional): if set to true, logs personal and organizational data. By default this is false so that your application doesn't log personal data. Personal data logs are never written to default outputs like Console, Logcat, or NSLog.
- `correlationId` (optional): a unique identifier, used to map the request with the response for debugging purposes. Defaults to RFC4122 version 4 guid (128 bits).

```javascript
function loggerCallback(logLevel, message, containsPii) {
   console.log(message);
}

var msalConfig = {
    auth: {
        clientId: "<Enter your client id>",
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

## Logging in MSAL for iOS and macOS

Set a callback to capture MSAL logging and incorporate it in your own application's logging. The signature for the callback looks like this:

```objc
/*!
    The LogCallback block for the MSAL logger
 
    @param  level           The level of the log message
    @param  message         The message being logged
    @param  containsPII     If the message might contain Personally Identifiable Information (PII)
                            this will be true. Log messages possibly containing PII will not be
                            sent to the callback unless PIllLoggingEnabled is set to YES on the
                            logger.

 */
typedef void (^MSALLogCallback)(MSALLogLevel level, NSString *message, BOOL containsPII);
```

For example:

Objective-C
```objc
[MSALGlobalConfig.loggerConfig setLogCallback:^(MSALLogLevel level, NSString *message, BOOL containsPII)
    {
        if (!containsPII)
        {
#if DEBUG
            // IMPORTANT: MSAL logs may contain sensitive information. Never output MSAL logs with NSLog, or print, directly unless you're running your application in debug mode. If you're writing MSAL logs to file, you must store the file securely.
            NSLog(@"MSAL log: %@", message);
#endif
        }
    }];
```

Swift
```swift
MSALGlobalConfig.loggerConfig.setLogCallback { (level, message, containsPII) in
    if let message = message, !containsPII
    {
#if DEBUG
    // IMPORTANT: MSAL logs may contain sensitive information. Never output MSAL logs with NSLog, or print, directly unless you're running your application in debug mode. If you're writing MSAL logs to file, you must store the file securely.
    print("MSAL log: \(message)")
#endif
    }
}
```

### Personal Identifiable Information (PII)

By default, MSAL doesn't capture or log any PII. The library allows app developers to turn this on through a property in the MSALLogger class. By turning on PII, the app takes responsibility for safely handling highly sensitive data and following regulatory requirements.

Objective-C
```objc
// By default, the `MSALLogger` doesn't capture any PII

// PII will be logged
MSALGlobalConfig.loggerConfig.piiEnabled = YES;

// PII will NOT be logged
MSALGlobalConfig.loggerConfig.piiEnabled = NO;
```

Swift
```swift
// By default, the `MSALLogger` doesn't capture any PII

// PII will be logged
MSALGlobalConfig.loggerConfig.piiEnabled = true

// PII will NOT be logged
MSALGlobalConfig.loggerConfig.piiEnabled = false
```

### Logging levels

To set the logging level when you log using MSAL for iOS and macOS, use one of the following values:

|Level  |Description |
|---------|---------|
| `MSALLogLevelNothing`| Disable all logging |
| `MSALLogLevelError` | Default level, prints out information only when errors occur |
| `MSALLogLevelWarning` | Warnings |
| `MSALLogLevelInfo` |  Library entry points, with parameters and various keychain operations |
|`MSALLogLevelVerbose`     |  API tracing       |

For example:

Objective-C
```objc
MSALGlobalConfig.loggerConfig.logLevel = MSALLogLevelVerbose;
 ```
 
 Swift
```swift
MSALGlobalConfig.loggerConfig.logLevel = .verbose
 ```

### Log message format

The message portion of MSAL log messages is in the format of `TID = <thread_id> MSAL <sdk_ver> <OS> <OS_ver> [timestamp - correlation_id] message`

For example:

`TID = 551563 MSAL 0.2.0 iOS Sim 12.0 [2018-09-24 00:36:38 - 36764181-EF53-4E4E-B3E5-16FE362CFC44] acquireToken returning with error: (MSALErrorDomain, -42400) User cancelled the authorization session.`

Providing correlation IDs and timestamps are helpful for tracking down issues. Timestamp and correlation ID information is available in the log message. The only reliable place to retrieve them is from MSAL logging messages.
