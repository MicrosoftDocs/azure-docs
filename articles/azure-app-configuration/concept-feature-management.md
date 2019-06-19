---
title: Azure App Configuration feature management | Microsoft Docs
description: An overview of how Azure App Configuration can be used to turn on and off application features on demand.
services: azure-app-configuration
documentationcenter: ''
author: yegu-ms
manager: maiye
editor: ''

ms.service: azure-app-configuration
ms.devlang: na
ms.topic: overview
ms.workload: tbd
ms.date: 04/19/2019
ms.author: yegu
---

# Feature management overview

Traditionally, shipping a new application feature requires a complete redeployment of the application itself. To test a feature, you likely must deploy your application many times to control when the feature becomes visible or who gets to see it.

Feature management is a modern software-development practice that decouples feature release from code deployment and enables quick changes to feature availability on demand. It uses a technique called *feature flags* (also known as *feature toggles*, *feature switches*, and so on) to dynamically administer a feature's lifecycle.

Feature management helps developers deal with the following problems:

* **Code branch management**: Feature flags are frequently used to wrap new application functionality that's under development. Such functionality is "hidden" by default. You can safely ship the feature, even though it's unfinished, and it will stay dormant in production. By using this approach, called *dark deployment*, you can release all your code at the end of each development cycle. You no longer need to maintain any code branch across multiple cycles because of a feature taking more than one cycle to be completed.
* **Test in production**: You can use feature flags to grant early access to new functionality in production. For example, you can limit this access to only your team members or to internal beta testers. These users will get the full-fidelity production experience, instead of a simulated or partial experience in a test environment.
* **Flighting**: You can also use feature flags to incrementally roll out new functionality to end users. You can target a small percentage of your user population first and increase that percentage gradually over time, after you have gained more confidence in the implementation.
* **Instant kill switch**: Feature flags provide an inherent safety net for releasing new functionality. With them, you can readily turn application features on and off. If necessary, you can quickly disable a feature without rebuilding and redeploying your application.
* **Selective activation**: While most feature flags exist only until their associated functionalities have been released successfully, some can last for a long time. You can use feature flags to segment your users and deliver a specific set of features to each group. For example, you may have a feature that works only on a certain web browser. You can define a feature flag so that only users of that browser can see and use the feature. With this approach, you can easily expand the supported browser list later without having to make any code changes.

## Basic concepts

Here are several new terms related to feature management:

* **Feature flag**: A feature flag is a variable with a binary state of *on* or *off*. The feature flag also has an associated code block. The state of the feature flag triggers whether the code block runs or not.
* **Feature manager**: A feature manager is an application package that handles the lifecycle of all the feature flags in an application. The feature manager typically provides additional functionality, such as caching feature flags and updating their states.
* **Filter**: A filter is a rule for evaluating the state of a feature flag. A user group, a device or browser type, a geographic location, and a time window are all examples of what a filter can represent.

An effective implementation of feature management consists of at least two components working in concert:

* An application that makes use of feature flags.
* A separate repository that stores the feature flags and their current states.

How these components interact is illustrated in the following examples.

## Feature flag usage in code

The basic pattern for implementing feature flags in an application is simple. You can think of a feature flag as a Boolean state variable used with an `if` conditional statement in your code:

```csharp
if (featureFlag) {
    // Run the following code
}
```

In this case, if `featureFlag` is set to `True`, the enclosed code block is executed; otherwise, it's skipped. You can set the value of `featureFlag` statically, as in the following code example:

```csharp
bool featureFlag = true;
```

You can also evaluate the flag's state based on certain rules:

```csharp
bool featureFlag = isBetaUser();
```

A slightly more complicated feature flag pattern includes an `else` statement as well:

```csharp
if (featureFlag) {
    // This following code will run if the featureFlag value is true
} else {
    // This following code will run if the featureFlag value is false
}
```

You can rewrite this behavior in the basic pattern, however. [Use feature flags in an ASP.NET Core app](./use-feature-flags-dotnet-core.md) shows the advantages of standardizing on a simple code pattern. For example:

```csharp
if (featureFlag) {
    // This following code will run if the featureFlag value is true
}

if (!featureFlag) {
    // This following code will run if the featureFlag value is false
}
```

## Feature flag repository

To use feature flags effectively, you need to externalize all the feature flags used in an application. This approach allows you to change feature flag states without modifying and redeploying the application itself.

Azure App Configuration is designed to be a centralized repository for feature flags. You can use it to define different kinds of feature flags and manipulate their states quickly and confidently. You can then use the App Configuration libraries for various programming language frameworks to easily access these feature flags from your application.

[Use feature flags in an ASP.NET Core app](./use-feature-flags-dotnet-core.md) shows how the .NET Core App Configuration provider and Feature Management libraries are used together to implement feature flags for your ASP.NET web application.

## Next steps

> [!div class="nextstepaction"]
> [Add feature flags to an ASP.NET Core web app](./quickstart-feature-flag-aspnet-core.md)  
