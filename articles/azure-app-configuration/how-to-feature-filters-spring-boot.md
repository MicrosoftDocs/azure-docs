---
title: Enable conditional features with a custom filter in a Spring Boot application
titleSuffix: Azure App Configuration
description: Learn how to implement a custom feature filter to enable conditional feature flags for your Spring Boot application.
ms.service: azure-app-configuration
ms.devlang: java
ms.custom: devx-track-java
author: mrm9084
ms.author: mametcal
ms.topic: how-to
ms.date: 02/11/2026
---

# Enable conditional features with a custom filter in a Spring Boot application

Feature flags can use feature filters to enable features conditionally. To learn more about feature filters, see [Enable conditional features with feature filters](./howto-feature-filters.md).

The example used in this guide is based on the Spring Boot application introduced in the feature management [quickstart](./quickstart-feature-flag-spring-boot.md). Before proceeding further, complete the quickstart to create a Spring Boot application with a *Beta* feature flag. Once completed, you must [add a custom feature filter](./howto-feature-filters.md) to the *Beta* feature flag in your App Configuration store.

In this article, you learn how to implement a custom feature filter and use the feature filter to enable features conditionally.

## Prerequisites

- Create a [Spring Boot app with a feature flag](./quickstart-feature-flag-spring-boot.md).
- [Add a custom feature filter to the feature flag](./howto-feature-filters.md)

## Implement a custom feature filter

You've added a custom feature filter named **Random** with a **Percentage** parameter for your *Beta* feature flag in the prerequisites. Next, you implement the feature filter to enable the *Beta* feature flag based on the chance defined by the **Percentage** parameter.

1. Add a `RandomFilter.java` file in the package directory of your application with the following code.

    ```java
    import java.util.Random;

    import com.azure.spring.cloud.feature.management.filters.FeatureFilter;
    import com.azure.spring.cloud.feature.management.models.FeatureFilterEvaluationContext;

    import org.springframework.stereotype.Component;

    @Component("Random")
    public class RandomFilter implements FeatureFilter {

        @Override
        public boolean evaluate(FeatureFilterEvaluationContext context) {
            Object value = context.getParameters().get("Percentage");
            int percentage = value != null ? Integer.parseInt(value.toString()) : 0;
            int random = new Random().nextInt(100);
            return random < percentage;
        }
    }
    ```

    You added a `RandomFilter` class that implements the `FeatureFilter` interface from the `spring-cloud-azure-feature-management` library. The `FeatureFilter` interface has a single method named `evaluate`, which is called whenever a feature flag is evaluated. In `evaluate`, a feature filter enables a feature flag by returning `true`.

    You decorated the class with `@Component("Random")` to register it as a Spring bean with the name **Random**, which matches the filter name you set in the *Beta* feature flag in Azure App Configuration.

1. Open your main application class or controller and add code to access the *Beta* feature flag a few times:

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
                    System.out.println("Beta is " + featureManager.isEnabled("Beta"));
                }
            };
        }
    }
    ```

## Feature filter in action

When you run the application, the configuration provider loads the *Beta* feature flag from Azure App Configuration. The result of the `isEnabled("Beta")` method is printed to the console. Since the `RandomFilter` is used by the *Beta* feature flag and is configured to 50 percent, the result is `True` 50 percent of the time and `False` the other 50 percent of the time.

Running the application shows that the *Beta* feature flag is sometimes enabled and sometimes not.

```bash
Beta is true
Beta is false
Beta is true
Beta is true
Beta is true
Beta is false
Beta is false
Beta is false
Beta is true
Beta is true
```

## Next steps

To learn more about the built-in feature filters, continue to the following documents.

> [!div class="nextstepaction"]
> [Enable features on a schedule](./howto-timewindow-filter.md)

> [!div class="nextstepaction"]
> [Roll out features to targeted audience](./howto-targetingfilter.md)
