---
title: Use dynamic configuration in a Spring Boot app
titleSuffix: Azure App Configuration
description: Learn how to dynamically update configuration data for Spring Boot apps using Azure App Configuration.
services: azure-app-configuration
author: mrm9084
ms.service: azure-app-configuration
ms.devlang: java
ms.topic: tutorial
ms.date: 03/16/2026
ms.custom: devx-track-java, devx-track-extended-java
ms.author: mametcal
#Customer intent: As a Java Spring developer, I want to dynamically update my app to use the latest configuration data in App Configuration.
---
# Tutorial: Use dynamic configuration in a Java Spring app

App Configuration has two libraries for Spring. 

* `spring-cloud-azure-appconfiguration-config` requires Spring Boot and takes a dependency on `spring-cloud-context`.
* `spring-cloud-azure-appconfiguration-config-web` requires Spring Web along with Spring Boot, and also adds support for automatic checking of configuration refresh.

Both libraries support manual triggering to check for refreshed configuration values.

Refresh allows you to update your configuration values without having to restart your application, though it causes all beans in the `@RefreshScope` to be recreated. It checks for any changes to configured triggers, including metadata. By default, the minimum amount of time between checks for changes, refresh interval, is set to 30 seconds.

`spring-cloud-azure-appconfiguration-config-web`'s automated refresh is triggered based on activity, specifically Spring Web's `ServletRequestHandledEvent`. If a `ServletRequestHandledEvent` isn't triggered, `spring-cloud-azure-appconfiguration-config-web`'s automated refresh doesn't trigger a refresh even if the cache expiration time is expired.

## Use manual refresh

To use manual refresh, start with a Spring Boot app that uses App Configuration, such as the app you create by following the [Spring Boot quickstart for App Configuration](quickstart-java-spring-app.md).

App Configuration exposes `AppConfigurationRefresh`, which checks if the refresh interval has passed. If the refresh interval has passed, it triggers a refresh.

1. To use `AppConfigurationRefresh`, update HelloController.

    ```java
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.web.bind.annotation.GetMapping;
    import org.springframework.web.bind.annotation.RestController;

    import com.azure.spring.cloud.appconfiguration.config.AppConfigurationRefresh;

    @RestController
    public class HelloController {

        @Autowired
        private final AppConfigurationRefresh appConfigurationRefresh;

        @Autowired
        private final MyProperties properties;

        @GetMapping
        public String hello() {
            // Manually refresh configuration from Azure App Configuration
            appConfigurationRefresh.refreshConfigurations().block();
            // Read the property value from @ConfigurationProperties bean
            return "Message: " + properties.getMessage();
        }
    }
    ```

    `AppConfigurationRefresh`'s `refreshConfigurations()` returns a `Mono` that is true if a refresh is triggered, and false if not. False means either the cache expiration time isn't expired, there was no change, or another thread is currently checking for a refresh.

    > [!NOTE]
    > For libraries such as Spring WebFlux that require non-blocking calls, `refreshConfigurations()` needs to be wrapped in a thread as loading configurations requires a blocking call. 
    >
    >    ```java
    >    new Thread(() -> refresh.refreshConfigurations()).start();
    >    ```
            
1.  To enable refresh update `application.properties`:

    ```properties
    spring.cloud.azure.appconfiguration.stores[0].monitoring.enabled=true
    ```

1. Build your Spring Boot application with Maven and run it.

    ```shell
    mvn clean package
    mvn spring-boot:run
    ```

1. Open a browser window, and go to the URL: `http://localhost:8080`. You see the message associated with your key.

    You can also use *curl* to test your application, for example:

    ```cmd
    curl -X GET http://localhost:8080/
    ```

1. To test dynamic configuration, open the Azure App Configuration portal associated with your application. Select **Configuration Explorer**, and update the value of your displayed key, for example:

    | Key | Value |
    |---|---|
    | /application/config.message | Hello - Updated |

1. Refresh the browser page twice to see the new message displayed. The first time triggers the refresh, the second loads the changes.

    > [!NOTE]
    > The library checks for changes only after the refresh interval passes. If the refresh interval hasn't passed, it doesn't check for changes. Wait for the interval to pass, then trigger the refresh check.

## Use automated refresh

To use automated refresh, start with a Spring Boot app that uses App Configuration, such as the app you create by following the [Spring Boot quickstart for App Configuration](quickstart-java-spring-app.md).

Then, open the *pom.xml* file in a text editor and add a `<dependency>` for `spring-cloud-azure-appconfiguration-config-web` using the following code.

```xml
<dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-appconfiguration-config-web</artifactId>
    <version>7.1.0</version>
</dependency>
```

1. To enable refresh update `application.properties`:

    ```properties
    spring.cloud.azure.appconfiguration.stores[0].monitoring.enabled=true
    ```

1. Build your Spring Boot application with Maven and run it.

    ```shell
    mvn clean package
    mvn spring-boot:run
    ```

1. Open a browser window, and go to the URL: `http://localhost:8080`. You now see the message associated with your key.

    You can also use *curl* to test your application, for example:

    ```cmd
    curl -X GET http://localhost:8080/
    ```

1. To test dynamic configuration, open the Azure App Configuration portal associated with your application. Select **Configuration Explorer**, and update the value of your displayed key, for example:

    | Key | Value |
    |---|---|
    | /application/config.message | Hello - Updated |

1. Refresh the browser page twice to see the new message displayed. The first time triggers the refresh, the second loads the changes, as the first request returns using the original scope.

    > [!NOTE]
    > The library checks for changes only after the refresh interval passes. If the refresh interval hasn't passed, it doesn't check for changes. Wait for the interval to pass, then trigger the refresh check.

## Next steps

In this tutorial, you enabled your Spring Boot app to dynamically refresh configuration settings from App Configuration. For further questions see the [reference documentation](https://go.microsoft.com/fwlink/?linkid=2180917), it has all of the details on how the Spring Cloud Azure App Configuration library works. To learn how to use an Azure managed identity to streamline the access to App Configuration, continue to the next tutorial.

> [!div class="nextstepaction"]
> [Managed identity integration](./howto-integrate-azure-managed-service-identity.md)
