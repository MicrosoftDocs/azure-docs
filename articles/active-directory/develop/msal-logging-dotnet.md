---
title: Logging errors and exceptions in MSAL.NET
description: Learn how to log errors and exceptions in MSAL.NET
services: active-directory
author: Dickson-Mwendia
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 10/21/2022
ms.author: dmwendia
ms.reviewer: saeeda, jmprieur
ms.custom: aaddev
---

# Logging in MSAL.NET

[!INCLUDE [MSAL logging introduction](../../../includes/active-directory-develop-error-logging-introduction.md)]

## Configure logging in MSAL.NET

In MSAL, logging is set at application creation using the `.WithLogging` builder modifier. This method takes optional parameters:

- `IIdentityLogger` is the logging implementation used by MSAL.NET to produce logs for debugging or health check purposes. Logs are only sent if logging is enabled.
- `Level` enables you to decide which level of logging you want. Setting it to Errors will only get errors
- `PiiLoggingEnabled` enables you to log personal and organizational data (PII) if set to true. By default, this parameter is set to false, so that your application doesn't log personal data.
- `LogCallback` is set to a delegate that does the logging. If `PiiLoggingEnabled` is true, this method will receive messages that can have PII, in which case the `containsPii` flag will be set to true.
- `DefaultLoggingEnabled` enables the default logging for the platform. By default it's false. If you set it to true it uses Event Tracing in Desktop/UWP applications, NSLog on iOS and logcat on Android.

### IIdentityLogger Interface
```CSharp
namespace Microsoft.IdentityModel.Abstractions
{
    public interface IIdentityLogger
    {
        //
        // Summary:
        //     Checks to see if logging is enabled at given eventLogLevel.
        //
        // Parameters:
        //   eventLogLevel:
        //     Log level of a message.
        bool IsEnabled(EventLogLevel eventLogLevel);

        //
        // Summary:
        //     Writes a log entry.
        //
        // Parameters:
        //   entry:
        //     Defines a structured message to be logged at the provided Microsoft.IdentityModel.Abstractions.LogEntry.EventLogLevel.
        void Log(LogEntry entry);
    }
}
```

> [!NOTE]
> Partner libraries (`Microsoft.Identity.Web`, `Microsoft.IdentityModel`) provide implementations of this interface already for various environments (in particular ASP.NET Core)

### IIdentityLogger Implementation

The following code snippets are examples of such an implementation. If you use the .NET core configuration, environment variable driven logs levels can be provided for free, in addition to the configuration file based log levels.

#### Log level from configuration file

It's highly recommended to configure your code to use a configuration file in your environment to set the log level as it will enable your code to change the MSAL logging level without needing to rebuild or restart the application. This is critical for diagnostic purposes, enabling us to quickly gather the required logs from the application that is currently deployed and in production. Verbose logging can be costly so it's best to use the *Information* level by default and enable verbose logging when an issue is encountered. [See JSON configuration provider](https://docs.microsoft.com/aspnet/core/fundamentals/configuration#json-configuration-provider) for an example on how to load data from a configuration file without restarting the application.

#### Log Level as Environment Variable

Another option we recommended is to configure your code to use an environment variable on the machine to set the log level as it will enable your code to change the MSAL logging level without needing to rebuild the application. This is critical for diagnostic purposes, enabling us to quickly gather the required logs from the application that is currently deployed and in production.

See [EventLogLevel](https://github.com/AzureAD/azure-activedirectory-identitymodel-extensions-for-dotnet/blob/dev/src/Microsoft.IdentityModel.Abstractions/EventLogLevel.cs) for details on the available log levels.

Example: 

```CSharp
    class MyIdentityLogger : IIdentityLogger
    {
        public EventLogLevel MinLogLevel { get; }

        public TestIdentityLogger()
        {
            //Try to pull the log level from an environment variable
            var msalEnvLogLevel = Environment.GetEnvironmentVariable("MSAL_LOG_LEVEL");

            if (Enum.TryParse(msalEnvLogLevel, out EventLogLevel msalLogLevel))
            {
                MinLogLevel = msalLogLevel;
            }
            else
            {
                //Recommended default log level
                MinLogLevel = EventLogLevel.Informational;
            }
        }

        public bool IsEnabled(EventLogLevel eventLogLevel)
        {
            return eventLogLevel <= MinLogLevel;
        }

        public void Log(LogEntry entry)
        {
            //Log Message here:
            Console.WriteLine(entry.message);
        }
    }
```

Using `MyIdentityLogger`:
```CSharp
    MyIdentityLogger myLogger = new MyIdentityLogger(logLevel);

    var app = ConfidentialClientApplicationBuilder
        .Create(TestConstants.ClientId)
        .WithClientSecret("secret")
        .WithExperimentalFeatures() //Currently an experimental feature, will be removed soon
        .WithLogging(myLogger, piiLogging)
        .Build();
```

> [!TIP]
 > See the [MSAL.NET wiki](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/wiki) for samples of MSAL.NET logging and more.

## Next steps

For more code samples, refer to [Microsoft identity platform code samples](sample-v2-code.md).
