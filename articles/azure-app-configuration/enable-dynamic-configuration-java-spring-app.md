---
title: Use dynamic configuration in a Spring Boot app
titleSuffix: Azure App Configuration
description: Learn how to dynamically update configuration data for Spring Boot apps
services: azure-app-configuration
author: mrm9084
ms.service: azure-app-configuration
ms.devlang: java
ms.topic: tutorial
ms.date: 03/25/2022
ms.custom: devx-track-java
ms.author: mametcal

#Customer intent: As a Java Spring developer, I want to dynamically update my app to use the latest configuration data in App Configuration.
---
# Tutorial: Use dynamic configuration in a Java Spring app

App Configuration has two libraries for Spring. `azure-spring-cloud-appconfiguration-config` requires Spring Boot and takes a dependency on `spring-cloud-context`. `azure-spring-cloud-appconfiguration-config-web` requires Spring Web along with Spring Boot. Both libraries support manual triggering to check for refreshed configuration values. `azure-spring-cloud-appconfiguration-config-web` also adds support for automatic checking of configuration refresh.

Refresh allows you to refresh your configuration values without having to restart your application, though it will cause all beans in the `@RefreshScope` to be recreated. The client library checks for changes on a refresh interval. Refresh checks the etag of keys that have been configured to trigger a refresh when they are changed in any way. The default refresh interval for each request is 30 seconds, which is configurable.

`azure-spring-cloud-appconfiguration-config-web`'s automated refresh is triggered based off activity, specifically Spring Web's `ServletRequestHandledEvent`. If a `ServletRequestHandledEvent` is not triggered, `azure-spring-cloud-appconfiguration-config-web`'s automated refresh will not trigger a refresh even if the cache expiration time has expired.

## Use manual refresh

App Configuration exposes `AppConfigurationRefresh` which can be used to check if the cache is expired and if it is expired trigger a refresh.

1. Update HelloController to use `AppConfigurationRefresh`.

```java
import com.azure.spring.cloud.config.AppConfigurationRefresh;

...

import com.azure.spring.cloud.config.AppConfigurationRefresh;

@RestController
public class HelloController {
    private final MessageProperties properties;
    
    @Autowired(required = false)
    private AppConfigurationRefresh refresh;

    public HelloController(MessageProperties properties) {
        this.properties = properties;
    }

    @GetMapping
    public String getMessage() throws InterruptedException, ExecutionException {
        if (refresh != null) {
            refresh.refreshConfigurations();
        }
        return "Message: " + properties.getMessage();
    }
}
```

`AppConfigurationRefresh`'s `refreshConfigurations()` returns a `Future` that is true if a refresh has been triggered, and false if not. False means either the cache expiration time hasn't expired, there was no change, or another thread is currently checking for a refresh.

1. Update `bootstrap.properties` to enable refresh

    ```properties
    spring.cloud.azure.appconfiguration.stores[0].monitoring.enabled=true
    spring.cloud.azure.appconfiguration.stores[0].monitoring.triggers[0].key=sentinel
    ```

1. Open the **Azure Portal** and navigate to your App Configuration resource associated with your application. Select **Configuration Explorer** under **Operations** and create a new key-value pair by selecting **+ Create** > **Key-value** to add the following parameters:

    | Key | Value |
    |---|---|
    | sentinel | 1 |

    Leave **Label** and **Content Type** empty for now.

1. Select **Apply**.

1. Build your Spring Boot application with Maven and run it.

    ```shell
    mvn clean package
    mvn spring-boot:run
    ```

1. Open a browser window, and go to the URL: `http://localhost:8080`.  You will see the message associated with your key.

    You can also use *curl* to test your application, for example:

    ```cmd
    curl -X GET http://localhost:8080/
    ```

1. To test dynamic configuration, open the Azure App Configuration portal associated with your application. Select **Configuration Explorer**, and update the value of your displayed key, for example:

    | Key | Value |
    |---|---|
    | /application/config.message | Hello - Updated |

1. Update the sentinel key you created earlier to a new value. This change will trigger the application to refresh all configuration keys once the refresh interval has passed.

    | Key | Value |
    |---|---|
    | sentinel | 2 |

1. Refresh the browser page to see the new message displayed.

> [!NOTE]
> The default refresh interval is 30s, so it may take a number of seconds before refresh is possible. Also, the refresh of the page will only trigger a refresh. Once the refresh is finished a second refresh of the page is needed in order to get the updated value.

## Use automated refresh

To use automated refresh, start with a Spring Boot app that uses App Configuration, such as the app you create by following the [Spring Boot quickstart for App Configuration](quickstart-java-spring-app.md).

Then, open the *pom.xml* file in a text editor and add a `<dependency>` for `azure-spring-cloud-appconfiguration-config-web` using the following code.

**Spring Boot**

```xml
<dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>azure-spring-cloud-appconfiguration-config-web</artifactId>
    <version>2.5.0</version>
</dependency>
```

> [!NOTE]
> If you need support for older dependencies see our [previous library](https://github.com/Azure/azure-sdk-for-java/blob/spring-cloud-starter-azure-appconfiguration-config_1.2.9/sdk/appconfiguration/spring-cloud-starter-azure-appconfiguration-config/README.md).

1. Update `bootstrap.properties` to enable refresh

    ```properties
    spring.cloud.azure.appconfiguration.stores[0].monitoring.enabled=true
    spring.cloud.azure.appconfiguration.stores[0].monitoring.triggers[0].key=sentinel
    ```

1. Open the **Azure Portal** and navigate to your App Configuration resource associated with your application. Select **Configuration Explorer** under **Operations** and create a new key-value pair by selecting **+ Create** > **Key-value** to add the following parameters:

    | Key | Value |
    |---|---|
    | sentinel | 1 |

    Leave **Label** and **Content Type** empty for now.

1. Select **Apply**.

1. Build your Spring Boot application with Maven and run it.

    ```shell
    mvn clean package
    mvn spring-boot:run
    ```

1. Open a browser window, and go to the URL: `http://localhost:8080`.  You will see the message associated with your key.

    You can also use *curl* to test your application, for example:

    ```cmd
    curl -X GET http://localhost:8080/
    ```

1. To test dynamic configuration, open the Azure App Configuration portal associated with your application. Select **Configuration Explorer**, and update the value of your displayed key, for example:

    | Key | Value |
    |---|---|
    | /application/config.message | Hello - Updated |

1. Update the sentinel key you created earlier to a new value. This change will trigger the application to refresh all configuration keys once the refresh interval has passed.

    | Key | Value |
    |---|---|
    | sentinel | 2 |

1. Refresh the browser page to see the new message displayed.

> [!NOTE]
> The default refresh interval is 30s, so it may take a number of seconds before refresh is possible. Also, the refresh of the page will only trigger a refresh. Once the refresh is finished a second refresh of the page is needed in order to get the updated value.

## Next steps

In this tutorial, you enabled your Spring Boot app to dynamically refresh configuration settings from App Configuration. For further questions see the [reference documentation](https://go.microsoft.com/fwlink/?linkid=2180917) has all of the details on how the Spring Cloud Azure App Configuration library works. To learn how to use an Azure managed identity to streamline the access to App Configuration, continue to the next tutorial.

> [!div class="nextstepaction"]
> [Managed identity integration](./howto-integrate-azure-managed-service-identity.md)
