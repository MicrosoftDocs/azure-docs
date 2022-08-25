---
title: Logging errors and exceptions in MSAL.NET
description: Learn how to log errors and exceptions in MSAL.NET
services: active-directory
author: mmacy
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 01/25/2021
ms.author: marsma
ms.reviewer: saeeda, jmprieur
ms.custom: aaddev
---

# Logging in MSAL.NET

[!INCLUDE [MSAL logging introduction](../../../includes/active-directory-develop-error-logging-introduction-dotnet.md)]

## Configure logging in MSAL.NET

In MSAL logging is set at application creation using the `.WithLogging` builder modifier. This method takes optional parameters:

- `IIdentityLogger` is the logging implementation used by MSAL.NET to produce logs for debugging or health check purposes. Logs are only sent if logging is enabled.
- `PiiLoggingEnabled` enables you to log personal and organizational data (PII) if set to true. By default this is set to false, so that your application does not log personal data.

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

Note: Partner libraries (Microsoft.Identity.Web, Microsoft.IdentityModel) provide implementations of this interface already for various environments (in particular ASP.NET Core)

### IIdentityLogger Implementation

The following code are examples of such an implementations. Note that if you use .NET core configuration, environment variable driven logs levels can be provided for free, in addition to the configuration file based log levels.

#### Log level from configuration file

It is highly recommended to configure your code to use a configuration file in your environment to set the log level as it will enable your code to change the MSAL logging level without needing to rebuild or restart the application. This is critical for diagnostic purposes, enabling us to quickly gather the required logs from the application that is currently deployed and in production.

Example Json file to configure log level

See [EventLogLevel](https://github.com/AzureAD/azure-activedirectory-identitymodel-extensions-for-dotnet/blob/dev/src/Microsoft.IdentityModel.Abstractions/EventLogLevel.cs) for details on the available log levels.
```json
{
    "IdentityLoggerLevel": {
        "LogLevel": "Warning"
    }
}
```

Example Log level Acquisition from file using [Microsoft.Extensions.Configuration.Json nuget](https://www.nuget.org/packages/Microsoft.Extensions.Configuration.Json/6.0.0)
```csharp
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.Configuration.Json;

    //Attempts to acquire the log level from a config file. "appsettings.json"
    private EventLogLevel GetLogLevelFromConfig()
    {
        //using JsonConfigurationSource to acquire settings from a JSON config file
        IConfigurationBuilder configurationBuilder;
        JsonConfigurationSource configurationSource;
        IConfigurationProvider configurationProvider;
        IConfigurationRoot configurationRoot;

        configurationBuilder = new ConfigurationBuilder();
        //Configure file options.
        //"Optional" determines if reloading the file is optional.
        //"ReloadOnChange" enables the configuration source to reload the settings in memory when the config file is changed.
        configurationSource = new JsonConfigurationSource() { Optional = false, Path = "appsettings.json", ReloadOnChange = true };
        configurationProvider = new JsonConfigurationProvider(configurationSource);
        configurationBuilder.Add(configurationSource);
        configurationRoot = configurationBuilder.Build();

        //Load configuration from config file by looking for key value pairs
        string logLevelString = configurationRoot.GetSection("IdentityLoggerLevel")["LogLevel"];

        //Parse value to string
        if(Enum.TryParse(logLevelString, out EventLogLevel logLevel))
        {
            return logLevel;
        }

        //If parse fails, return the default log level
        return EventLogLevel.Informational;
    }
```
Example IIdentityLogger
```CSharp
    class MyIdentityLogger : IIdentityLogger
    {
        //This will acquire the log level from the file whenever it is needed.
        //This will enable the log level to change whenever the config file is changed
        //Would be a good idea to check for the log level change periodically to avoid
        //performance issues.
        public EventLogLevel MinLogLevel { get { return GetLogLevelFromConfig(); } }

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

Example Using IdentityLogger
```CSharp
    MyIdentityLogger myLogger = new MyIdentityLogger(logLevel);

    var app = ConfidentialClientApplicationBuilder
        .Create(TestConstants.ClientId)
        .WithClientSecret("secret")
        .WithExperimentalFeatures() //Currently an experimental feature, will be removed soon
        .WithLogging(myLogger, piiLogging)
        .Build();
```

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

Using IdentityLogger:
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
