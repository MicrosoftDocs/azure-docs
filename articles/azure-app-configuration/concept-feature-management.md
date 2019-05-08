---
title: Azure App Configuration feature management | Microsoft Docs
description: An overview of how Azure App Configuration can be used to turn on and off application features on demand
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

# Feature management

Traditionally shipping a new application feature requires a complete redeployment of the application itself. To test a feature, you likely have to deploy your application many times to control when it becomes visible or who gets to see it. Feature management is a modern software development practice that decouples feature release from code deployment and enables quick changes to feature availability on demand. It uses a technique called *feature flag* (also known as *feature toggle*, *feature switch*, and so on) to administer a feature's lifecycle dynamically. It helps developers deal with the following problems:

* **Code branch management**: Feature flags are frequently used to wrap new application functionality that is under development. Such functionality is "hidden" by default. You can safely ship it, though unfinished, and it will stay dormant in production. Using this approach, called *dark deployment*, you can release all your code at the end of each development cycle. You no longer need to maintain any code branch across multiple cycles due to a feature taking more than one period to be completed.
* **Test in production**: You can use feature flags to grant early access to new functionality in production. For example, you can limit this access to only your team members or internal beta testers. These users will get the full-fidelity production experience, instead of a simulated or partial experience in a test environment.
* **Flighting**: You can also use feature flags to roll out new functionality to end-users incrementally. You can target a small percentage of your user population first and increase that percentage gradually over time, after you have gained more confidence in the implementation.
* **Instant kill switch**: Feature flags provide an inherent safety net for releasing new functionality. With them, you can not only turn on but also shut off application features readily. You gain the ability to quickly disable a feature, if necessary, without the need to rebuild and redeploy your application.
* **Selective activation**: While most feature flags exist just until their associated functionalities have been released successfully, some can last for a long time. You can use them as a way to segment your users and deliver a specific set of features to each group. For example, you may have a feature that works on a certain web browser. You can define a feature flag such that only users of that browser can see and use the feature. The advantage of this approach is that you can easily expand the supported browser list later on without having to make any code change.

## Basic concepts

Here are several new terms related to feature management.

* **Feature flag**: A feature flag is a variable with a binary state of *on* or *off* and has an associated code block. Its state decides whether the code block runs or not.
* **Feature manager**: A feature manager is an application package that handles the lifecycle of all feature flags in an application. It typically provides additional functionality such as caching of flags and update of their states.
* **Filter**: A filter is a rule for evaluating the state of a feature flag. User group, device or browser type, geo location, time window are all examples of what a filter can represent.

An effective implementation of feature management consists of at least two components working in concert: an application that makes use of feature flags and a separate repository that stores feature flags and their current states. Their interactions are illustrated below.

## Feature flag usage in code

The basic pattern for implementing feature flags in an application is simple. You can conceptualize it as a Boolean state variable used with an `if` conditional statement in your code.

```csharp
if (featureFlag) {
    // Run the following code
}
```

In this case, if `featureFlag` is set to `True`, the enclosed code block is executed; otherwise it is skipped. The value of `featureFlag` can be set statically:

```csharp
bool featureFlag = true;
```

It also can be evaluated based on certain rules:

```csharp
bool featureFlag = isBetaUser();
```

A slightly more complicated feature flag pattern includes an `else` statement as well.

```csharp
if (featureFlag) {
    // This following code will run if the featureFlag value is true
} else {
    // This following code will run if the featureFlag value is false
}
```

This can be rewritten in the basic pattern, however. [Use feature flags in an ASP.NET Core app](./use-feature-flags-dotnet-core.md) shows the advantage of standardizing on a simple code pattern.

```csharp
if (featureFlag) {
    // This following code will run if the featureFlag value is true
}

if (!featureFlag) {
    // This following code will run if the featureFlag value is false
}
```

## Feature flag repository

To use them effectively, you need to externalize all feature flags used in an application. That will allow you to change feature flag states without modifying and redeploying the application itself. Azure App Configuration is designed to be a centralized repository for feature flags. You can utilize it to define different kinds of feature flags and manipulate their states quickly and confidently. You can then access these feature flags easily from your application using the App Configuration libraries for various programming language frameworks. [Use feature flags in an ASP.NET Core app](./use-feature-flags-dotnet-core.md) shows how the .NET Core App Configuration provider and Feature Management libraries are used together as a complete solution for implementing feature flags for your ASP.NET web application.

## Next steps

> [!div class="nextstepaction"]
> [Add feature flags to an ASP.NET Core web app](./quickstart-feature-flag-aspnet-core.md)  
