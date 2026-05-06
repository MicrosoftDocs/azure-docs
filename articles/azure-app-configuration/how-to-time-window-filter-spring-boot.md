---
title: Enable features on a schedule in a Spring Boot application
titleSuffix: Azure App Configuration
description: Learn how to enable feature flags on a schedule in a Spring Boot application by using time window filters.
ms.service: azure-app-configuration
ms.devlang: java
author: mrm9084
ms.author: mametcal
ms.topic: how-to
ms.custom: mode-other, devx-track-java
ms.date: 04/21/2026
---

# Enable features on a schedule in a Spring Boot application

In this guide, you use the time window filter to enable a feature on a schedule for a Spring Boot application.

The example used is based on the Spring Boot application introduced in the feature management [quickstart](./quickstart-feature-flag-spring-boot.md). Before proceeding further, complete the quickstart to create a Spring Boot application with a *Beta* feature flag. Once completed, you must [add a time window filter](./howto-timewindow-filter.md) to the *Beta* feature flag in your App Configuration store.

## Prerequisites

- Create a [Spring Boot application with a feature flag](./quickstart-feature-flag-spring-boot.md).
- [Add a time window filter to the feature flag](./howto-timewindow-filter.md)

## Use the time window filter

You've added a time window filter for your *Beta* feature flag in the prerequisites. Next, you'll use the feature flag with the time window filter in your Spring Boot application.

The `spring-cloud-azure-feature-management` library includes the built-in `TimeWindowFilter`. This filter is registered automatically when you include the feature management dependency. You don't need to register it manually.

Update the `DemoApplication.java` file in the package directory of your app with the following code:

```java
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.azure.spring.cloud.feature.management.FeatureManager;

@SpringBootApplication
public class DemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }

    @Bean
    public CommandLineRunner runner(FeatureManager featureManager) {
        return args -> {
            for (int i = 0; i < 10; i++) {
                System.out.println("Beta is enabled: " + featureManager.isEnabled("Beta"));
                Thread.sleep(5000);
            }
        };
    }
}
```

## Time window filter in action

When you run the application, the configuration provider loads the *Beta* feature flag from Azure App Configuration. The result of the `isEnabled("Beta")` method will be printed to the console. If your current time is earlier than the start time set for the time window filter, the *Beta* feature flag will be disabled by the time window filter.

You'll see the following console outputs.

```bash
Beta is enabled: false
Beta is enabled: false
Beta is enabled: false
Beta is enabled: false
Beta is enabled: false
Beta is enabled: false
```

Once the start time has passed, you'll notice that the *Beta* feature flag is enabled by the time window filter.

You'll see the console outputs change as the *Beta* is enabled.

```bash
Beta is enabled: false
Beta is enabled: false
Beta is enabled: false
Beta is enabled: false
Beta is enabled: false
Beta is enabled: false
Beta is enabled: true
Beta is enabled: true
Beta is enabled: true
Beta is enabled: true
```

If recurrence is enabled when you set up the time window filter, the console outputs will change to `Beta is enabled: false` once your current time passes the end time you set in the time window filter. However, it will change to `Beta is enabled: true` again according to your recurrence settings and continue this pattern until the recurrence expiration time, if set.

## Next steps

To learn more about the feature filters, continue to the following documents.

> [!div class="nextstepaction"]
> [Enable conditional features with feature filters](./howto-feature-filters.md)

> [!div class="nextstepaction"]
> [Roll out features to targeted audience](./howto-targetingfilter.md)
