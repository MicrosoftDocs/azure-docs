---
author: mmacy
ms.author: marsma
ms.date: 12/16/2020
ms.service: active-directory
ms.subservice: develop
ms.topic: include
# Purpose:
# Ingested by Microsoft identity platform articles in /articles/active-directory/develop/* that document error logging for the different platforms.
---
MSAL.NET takes advantage of the `IIdentityLogger` interface to provide logging messages to applications (MSAL.NET 4.45.0+). This comes with the benefit of enabling one logger implementation to be sharable between our partner SDks (Microsoft.Identity.Web, Microsoft.IdentityModel). In order to take advantage of this new API you will need to provide an implementation of the `IIdentityLogger` interface. This enables you to dynamically change the behavior of the logger without needing to rebuild your application. For example, you could configure the log level in the `IsEnabled` method to use a environment variable for greater flexibility during debugging.

## Logging levels

MSAL provides several levels of logging detail:

- LogAlways: No level filtering is done on this log level. Log messages of all levels will be logged.
- Critical: Logs that describe an unrecoverable application or system crash, or a catastrophic failure that requires immediate attention.
- Error: Indicates something has gone wrong and an error was generated. Used for debugging and identifying problems.
- Warning: There hasn't necessarily been an error or failure, but are intended for diagnostics and pinpointing problems.
- Informational: MSAL will log events intended for informational purposes not necessarily intended for debugging.
- Verbose: Default. MSAL logs the full details of library behavior.

## Personal and organizational data

By default, the MSAL logger doesn't capture any highly sensitive personal or organizational data. The library provides the option to enable logging personal and organizational data if you decide to do so.

The following sections provide more details about MSAL error logging for your application.
