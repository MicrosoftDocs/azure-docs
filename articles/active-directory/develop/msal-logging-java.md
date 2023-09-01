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
ms.date: 11/25/2022
ms.author: dmwendia
ms.reviewer: saeeda, jmprieur, engagement-fy23
ms.custom: aaddev, devx-track-extended-java
---

# Logging in MSAL for Java

[!INCLUDE [MSAL logging introduction](./includes/error-handling-and-tips/error-logging-introduction.md)]

## MSAL for Java logging

MSAL for Java allows you to use the logging library that you're already using with your app, as long as it's compatible with SLF4J. MSAL for Java uses the [Simple Logging Facade for Java](http://www.slf4j.org/) (SLF4J) as a simple facade or abstraction for various logging frameworks, such as [java.util.logging](https://docs.oracle.com/javase/7/docs/api/java/util/logging/package-summary.html), [Logback](http://logback.qos.ch/) and [Log4j](https://logging.apache.org/log4j/2.x/). SLF4J allows the user to plug in the desired logging framework at deployment time and automatically binds to Logback at deployment time. MSAL logs will be written to the console.

This article shows how to enable MSAL4J logging using the logback framework in a spring boot web application. You can refer to the [code sample](https://github.com/Azure-Samples/ms-identity-java-webapp/tree/master/msal-java-webapp-sample) for reference.

1. To implement logging, include the `logback` package in the *pom.xml* file.

    ```xml
    <dependency>
        <groupId>ch.qos.logback</groupId>
        <artifactId>logback-classic</artifactId>
        <version>1.2.3</version>
    </dependency>
    ```

2. Navigate to the *resources* folder, and add a file called *logback.xml*, and insert the following code. This will append logs to the console. You can change the appender `class` to write logs to a file, database or any appender of your choosing.

    ```xml
    <?xml version="1.0" encoding="UTF-8"?>
    <configuration>
        <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
            <encoder>
                <pattern>%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n</pattern>
            </encoder>
        </appender>
        <root level="debug">
            <appender-ref ref="STDOUT" />
        </root>    
    </configuration>
    ```
3. Next, you should set the *logging.config* property to the location of the *logback.xml* file before the main method. Navigate to *MsalWebSampleApplication.java* and add the following code to the `MsalWebSampleApplication` public class. 

    ```java
    @SpringBootApplication
    public class MsalWebSampleApplication {

        static { System.setProperty("logging.config", "C:\Users\<your path>\src\main\resources\logback.xml"); }
        public static void main(String[] arrgs) {
            // Console.log("main");
            // System.console().printf("Hello");
            // System.out.printf("Hello %s!%n", "World");
            System.out.printf("%s%n", "Hello World");
            SpringApplication.run(MsalWebSampleApplication.class, args);
        }
    }
    ```
    
In your tenant, you'll need separate app registrations for the web app and the web API. For app registration and exposing the web API scope, follow the steps in the scenario [A web app that authenticates users and calls web APIs](./scenario-web-app-call-api-overview.md).

For instructions on how to bind to other logging frameworks, see the [SLF4J manual](http://www.slf4j.org/manual.html).

### Personal and organization information

By default, MSAL logging doesn't capture or log any personal or organizational data. In the following example, logging personal or organizational data is off by default:

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
