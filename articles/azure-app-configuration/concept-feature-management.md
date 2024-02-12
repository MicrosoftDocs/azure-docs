---
title: Understand feature management using Azure App Configuration
description: Turn features on and off using Azure App Configuration 
author: maud-lv
ms.author: malev
ms.service: azure-app-configuration
ms.custom: devdivchpfy22
ms.topic: conceptual
ms.date: 08/17/2022
---

# Feature management overview

Traditionally, shipping a new application feature requires a complete redeployment of the application itself. Testing a feature often requires multiple deployments of the application. Each deployment might change the feature or expose the feature to different customers for testing.  

Feature management is a modern software-development practice that decouples feature release from code deployment and enables quick changes to feature availability on demand. It uses a technique called *feature flags* (also known as *feature toggles* and *feature switches*) to dynamically administer a feature's lifecycle.

Feature management helps developers address the following problems:

* **Code branch management**: Use feature flags to wrap new application functionality currently under development. Such functionality is "hidden" by default. You can safely ship the feature, even though it's unfinished, and it will stay dormant in production. Using this approach, called *dark deployment*, you can release all your code at the end of each development cycle. You no longer need to maintain code branches across multiple development cycles because a given feature requires more than one cycle to complete.
* **Test in production**: Use feature flags to grant early access to new functionality in production. For example, you can limit access to team members or to internal beta testers. These users will experience the full-fidelity production experience instead of a simulated or partial experience in a test environment.
* **Flighting**: Use feature flags to incrementally roll out new functionality to end users. You can target a small percentage of your user population first and increase that percentage gradually over time.
* **Instant kill switch**: Feature flags provide an inherent safety net for releasing new functionality. You can turn application features on and off without redeploying any code. If necessary, you can quickly disable a feature without rebuilding and redeploying your application.
* **Selective activation**: Use feature flags to segment your users and deliver a specific set of features to each group. You might have a feature that works only on a certain web browser. You can define a feature flag so that only users of that browser can see and use the feature. By using this approach, you can easily expand the supported browser list later without having to make any code changes.

## Basic concepts

Here are several new terms related to feature management:

* **Feature flag**: A feature flag is a variable with a binary state of *on* or *off*. The feature flag also has an associated code block. The feature flag's state triggers whether the code block runs.
* **Feature manager**: A feature manager is an application package that handles the life cycle of all the feature flags in an application. The feature manager also provides additional functionality, including caching feature flags and updating their states.
* **Filter**: A filter is a rule for evaluating the state of a feature flag. Potential filters include user groups, device or browser types, geographic locations, and time windows.

An effective implementation of feature management consists of at least two components working in concert:

* An application that makes use of feature flags.
* A separate repository that stores the feature flags and their current states.

## Using feature flags in your code

The basic pattern for implementing feature flags in an application is simple. A feature flag is a Boolean state variable controlling a conditional statement in your code:

```csharp
if (featureFlag) {
    // Run the following code
}
```

You can set the value of `featureFlag` statically:

```csharp
bool featureFlag = true;
```

You can evaluate the flag's state based on certain rules:

```csharp
bool featureFlag = isBetaUser();
```

You can extend the conditional to set application behavior for either state:

```csharp
if (featureFlag) {
    // This following code will run if the featureFlag value is true
} else {
    // This following code will run if the featureFlag value is false
}
```

## Feature flag repository

To use feature flags effectively, you need to externalize all the feature flags used in an application. You can use this approach to change feature flag states without modifying and redeploying the application itself.

Azure App Configuration provides a centralized repository for feature flags. You can use it to define different kinds of feature flags and manipulate their states quickly and confidently. You can then use the App Configuration libraries for various programming language frameworks to easily access these feature flags from your application.

[The feature flags in an ASP.NET Core app](./use-feature-flags-dotnet-core.md) shows how the .NET Core App Configuration provider and Feature Management libraries are used together to implement feature flags for your ASP.NET web application. For more information on feature flags in Azure App Configuration, see the following articles:

* [Manage feature flags](./manage-feature-flags.md)
* [Use conditional feature flags](./howto-feature-filters-aspnet-core.md)
* [Enable a feature for specified users/groups](./howto-targetingfilter-aspnet-core.md)
* [Add feature flags to an ASP.NET Core app](./quickstart-feature-flag-aspnet-core.md)
* [Add feature flags to a .NET Framework app](./quickstart-feature-flag-dotnet.md)
* [Add feature flags to an Azure Functions app](./quickstart-feature-flag-azure-functions-csharp.md)
* [Add feature flags to a Spring Boot app](./quickstart-feature-flag-spring-boot.md)
* [Use feature flags in an ASP.NET Core](./use-feature-flags-dotnet-core.md)
* [Use feature flags in a Spring Boot app](./use-feature-flags-spring-boot.md)

## Next steps

> [!div class="nextstepaction"]
> [Add feature flags to an ASP.NET Core web app](./quickstart-feature-flag-aspnet-core.md)  
