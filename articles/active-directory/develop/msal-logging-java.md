---
title: Logging errors and exceptions in MSAL for Java
description: Learn how to log errors and exceptions in MSAL for Java
services: active-directory
author: Dickson-Mwendia
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 01/25/2021
ms.author: dmwendia
ms.reviewer: saeeda, jmprieur
ms.custom: aaddev
---
# Logging in MSAL for Java

[!INCLUDE [MSAL logging introduction](../../../includes/active-directory-develop-error-logging-introduction.md)]

## MSAL for Java logging

MSAL for Java allows you to use the logging library that you are already using with your app, as long as it is compatible with SLF4J. MSAL for Java uses the [Simple Logging Facade for Java](http://www.slf4j.org/) (SLF4J) as a simple facade or abstraction for various logging frameworks, such as [java.util.logging](https://docs.oracle.com/javase/7/docs/api/java/util/logging/package-summary.html), [Logback](http://logback.qos.ch/) and [Log4j](https://logging.apache.org/log4j/2.x/). SLF4J allows the user to plug in the desired logging framework at deployment time.

For example, to use Logback as the logging framework in your application, add the Logback dependency to the Maven pom file for your application:

```xml
<dependency>
    <groupId>ch.qos.logback</groupId>
    <artifactId>logback-classic</artifactId>
    <version>1.2.3</version>
</dependency>
```

Then add the Logback configuration file:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration debug="true">

</configuration>
```

SLF4J automatically binds to Logback at deployment time. MSAL logs will be written to the console.

For instructions on how to bind to other logging frameworks, see the [SLF4J manual](http://www.slf4j.org/manual.html).

### Personal and organization information

By default, MSAL logging does not capture or log any personal or organizational data. In the following example, logging personal or organizational data is off by default:

```java
    PublicClientApplication app2 = PublicClientApplication.builder(PUBLIC_CLIENT_ID)
            .authority(AUTHORITY)
            .build();
```

Turn on personal and organizational data logging by setting `logPii()` on the client application builder. If you turn on personal or organizational data logging, your app must take responsibility for safely handling highly-sensitive data and complying with any regulatory requirements.

In the following example, logging personal or organizational data is enabled:

```java
PublicClientApplication app2 = PublicClientApplication.builder(PUBLIC_CLIENT_ID)
        .authority(AUTHORITY)
        .logPii(true)
        .build();
```

## Next steps

For more code samples, refer to [Microsoft identity platform code samples](sample-v2-code.md).