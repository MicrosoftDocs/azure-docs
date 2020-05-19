---
title: Tutorial for using feature flags in a Spring Boot app - Azure App Configuration | Microsoft Docs
description: In this tutorial, you learn how to implement feature flags in Spring Boot apps.
services: azure-app-configuration
documentationcenter: ''
author: mrm9084
manager: zhenlan
editor: ''

ms.assetid: 
ms.service: azure-app-configuration
ms.workload: tbd
ms.devlang: java
ms.topic: tutorial
ms.date: 09/26/2019
ms.author: mametcal
ms.custom: mvc

#Customer intent: I want to control feature availability in my app by using the Spring Boot Feature Manager library.
---

# Tutorial: Use feature flags in a Spring Boot app

The Spring Boot Core Feature Management libraries provide support for implementing feature flags in a Spring Boot application. These libraries allow you to declaratively add feature flags to your code.

The Feature Management libraries also manage feature flag lifecycles behind the scenes. For example, the libraries refresh and cache flag states, or guarantee a flag state to be immutable during a request call. In addition, the Spring Boot library offers integrations, including MVC controller actions, routes, and middleware.

The [Add feature flags to a Spring Boot app Quickstart](./quickstart-feature-flag-spring-boot.md) shows several ways to add feature flags in a Spring Boot application. This tutorial explains these methods in more detail.

In this tutorial, you will learn how to:

> [!div class="checklist"]
> * Add feature flags in key parts of your application to control feature availability.
> * Integrate with App Configuration when you're using it to manage feature flags.

## Set up feature management

The Spring Boot feature manager `FeatureManager` gets feature flags from the framework's native configuration system. As a result, you can define your application's feature flags by using any configuration source that Spring Boot supports, including the local *bootstrap.yml* file or environment variables. `FeatureManager` relies on dependency injection. You can register the feature management services by using standard conventions:

```java
private FeatureManager featureManager;

public HelloController(FeatureManager featureManager) {
    this.featureManager = featureManager;
}
```

We recommend that you keep feature flags outside the application and manage them separately. Doing so allows you to modify flag states at any time and have those changes take effect in the application right away. App Configuration provides a centralized place for organizing and controlling all your feature flags through a dedicated portal UI. App Configuration also delivers the flags to your application directly through its Spring Boot client libraries.

The easiest way to connect your Spring Boot application to App Configuration is through the configuration provider:

### Spring Cloud 1.1.x

```xml
<dependency>
    <groupId>com.microsoft.azure</groupId>
    <artifactId>spring-cloud-azure-feature-management-web</artifactId>
    <version>1.1.2</version>
</dependency>
```

### Spring Cloud 1.2.x

```xml
<dependency>
    <groupId>com.microsoft.azure</groupId>
    <artifactId>spring-cloud-azure-feature-management-web</artifactId>
    <version>1.2.2</version>
</dependency>
```

## Feature flag declaration

Each feature flag has two parts: a name and a list of one or more filters that are used to evaluate if a feature's state is *on* (that is, when its value is `True`). A filter defines a use case for when a feature should be turned on.

When a feature flag has multiple filters, the filter list is traversed in order until one of the filters determines the feature should be enabled. At that point, the feature flag is *on*, and any remaining filter results are skipped. If no filter indicates the feature should be enabled, the feature flag is *off*.

The feature manager supports *application.yml* as a configuration source for feature flags. The following example shows how to set up feature flags in a YAML file:

```yml
feature-management:
  feature-set:
    feature-a: true
    feature-b: false
    feature-c:
      enabled-for:
        -
          name: Percentage
          parameters:
            value: 50
```

By convention, the `feature-management` section of this YML document is used for feature flag settings. The prior example shows three feature flags with their filters defined in the `EnabledFor` property:

* `feature-a` is *on*.
* `feature-b` is *off*.
* `feature-c` specifies a filter named `Percentage` with a `parameters` property. `Percentage` is a configurable filter. In this example, `Percentage` specifies a 50-percent probability for the `feature-c` flag to be *on*.

## Feature flag checks

The basic pattern of feature management is to first check if a feature flag is set to *on*. If so, the feature manager then runs the actions that the feature contains. For example:

```java
private FeatureManager featureManager;
...
if (featureManager.isEnabledAsync("feature-a").block()) {
    // Run the following code
}
```

## Dependency injection

In Spring Boot, you can access the feature manager `FeatureManager` through dependency injection:

```java
@Controller
@ConfigurationProperties("controller")
public class HomeController {
    private FeatureManager featureManager;

    public HomeController(FeatureManager featureManager) {
        this.featureManager = featureManager;
    }
}
```

## Controller actions

In MVC controllers, you use the `@FeatureGate` attribute to control whether a specific action is enabled. The following `Index` action requires `feature-a` to be *on* before it can run:

```java
@GetMapping("/")
@FeatureGate(feature = "feature-a")
public String index(Model model) {
    ...
}
```

When an MVC controller or action is blocked because the controlling feature flag is *off*, a registered `IDisabledFeaturesHandler` interface is called. The default `IDisabledFeaturesHandler` interface returns a 404 status code to the client with no response body.

## MVC filters

You can set up MVC filters so that they're activated based on the state of a feature flag. The following code adds an MVC filter named `FeatureFlagFilter`. This filter is triggered within the MVC pipeline only if `feature-a` is enabled.

```java
@Component
public class FeatureFlagFilter implements Filter {

    @Autowired
    private FeatureManager featureManager;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        if(!featureManager.isEnabledAsync("feature-a").block()) {
            chain.doFilter(request, response);
            return;
        }
        ...
        chain.doFilter(request, response);
    }
}
```

## Routes

You can use feature flags to redirect routes. The following code will redirect a user from `feature-a` is enabled:

```java
@GetMapping("/redirect")
@FeatureGate(feature = "feature-a", fallback = "/getOldFeature")
public String getNewFeature() {
    // Some New Code
}

@GetMapping("/getOldFeature")
public String getOldFeature() {
    // Some New Code
}
```

## Next steps

In this tutorial, you learned how to implement feature flags in your Spring Boot application by using the `spring-cloud-azure-feature-management-web` libraries. For more information about feature management support in Spring Boot and App Configuration, see the following resources:

* [Spring Boot feature flag sample code](/azure/azure-app-configuration/quickstart-feature-flag-spring-boot)
* [Manage feature flags](./manage-feature-flags.md)
