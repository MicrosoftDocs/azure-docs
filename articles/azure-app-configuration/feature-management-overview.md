---
title: Feature Management Overview
titleSuffix: Azure App Configuration
description: Overview of feature management libraries of different programming languages.
services: azure-app-configuration
author: zhiyuanliang-ms
ms.author: zhiyuanliang
ms.service: azure-app-configuration
ms.topic: overview
ms.date: 01/22/2025
#Customer intent: I want to learn about the feature management libraries of different languages, specifically to track their feature development status.
ms.custom:
  - build-2025
---

# Feature Management Overview

Feature Management libraries provide standardized APIs for enabling feature flags within applications. Use these libraries to secure a consistent experience when developing applications that use patterns such as beta access, rollout, dark deployments, and more.

## Feature Management Libraries

Module | Platform | Sample | Release Notes
------ | -------- | ------ | -------------
[Microsoft.FeatureManagement](https://github.com/microsoft/FeatureManagement-Dotnet)<br/>[![Nuget: Microsoft.FeatureManagement](https://img.shields.io/nuget/v/Microsoft.FeatureManagement.svg?color=blue)](https://www.nuget.org/packages/Microsoft.FeatureManagement)| .NET Standard | [Sample](https://github.com/microsoft/FeatureManagement-Dotnet/tree/main/examples) | [Release Notes](https://github.com/Azure/AppConfiguration/blob/main/releaseNotes/Microsoft.Featuremanagement.md)
[Microsoft.FeatureManagement.AspNetCore](https://github.com/microsoft/FeatureManagement-Dotnet)<br/>[![Nuget: Microsoft.FeatureManagement.AspNetCore](https://img.shields.io/nuget/v/Microsoft.FeatureManagement.AspNetCore.svg?color=blue)](https://www.nuget.org/packages/Microsoft.FeatureManagement.AspNetCore) | ASP&#46;NET Core | [Sample](https://github.com/microsoft/FeatureManagement-Dotnet/tree/main/examples) | [Release Notes](https://github.com/Azure/AppConfiguration/blob/main/releaseNotes/Microsoft.Featuremanagement.md)
[spring-cloud-azure-feature-management](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/spring/spring-cloud-azure-feature-management)<br/>[![Maven: spring-cloud-azure-feature-management](https://img.shields.io/maven-central/v/com.azure.spring/spring-cloud-azure-feature-management.svg?color=blue)](https://search.maven.org/artifact/com.azure.spring/spring-cloud-azure-feature-management) | Spring Boot | [Sample](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/main/appconfiguration/spring-cloud-azure-feature-management/spring-cloud-azure-feature-management-sample) | [Release Notes](https://github.com/Azure/AppConfiguration/blob/main/releaseNotes/SpringCloudAzureFeatureManagement.md)
[spring-cloud-azure-feature-management-web](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/spring/spring-cloud-azure-feature-management-web)<br/>[![Maven: spring-cloud-azure-feature-management-web](https://img.shields.io/maven-central/v/com.azure.spring/spring-cloud-azure-feature-management-web.svg?color=blue)](https://search.maven.org/artifact/com.azure.spring/spring-cloud-azure-feature-management-web) | Spring Boot | [Sample](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/main/appconfiguration/spring-cloud-azure-feature-management-web/spring-cloud-azure-feature-management-web-sample) | [Release Notes](https://github.com/Azure/AppConfiguration/blob/main/releaseNotes/SpringCloudAzureFeatureManagement.md)
[featuremanagement](https://github.com/microsoft/FeatureManagement-Python)<br/>[![PyPi](https://img.shields.io/pypi/v/FeatureManagement?color=blue)](https://pypi.org/project/FeatureManagement/) | Python | [Sample](https://github.com/microsoft/FeatureManagement-Python/tree/main/samples) | [Release Notes](https://github.com/Azure/AppConfiguration/blob/main/releaseNotes/PythonFeatureManagement.md)
[@microsoft/feature-management](https://github.com/microsoft/FeatureManagement-JavaScript)<br/>[![npm](https://img.shields.io/npm/v/@microsoft/feature-management?color=blue)](https://www.npmjs.com/package/@microsoft/feature-management) | JavaScript | [Sample](https://github.com/microsoft/FeatureManagement-JavaScript/tree/main/examples) | [Release Notes](https://github.com/Azure/AppConfiguration/blob/main/releaseNotes/JavaScriptFeatureManagement.md)

## Feature Development Status

This is an overview of each feature and its current status for different frameworks or programming languages.  

- **GA (General Availability)**: The feature is fully released, considered stable, and ready for production use.  
- **Preview**: The feature is available for early testing and feedback, but not yet fully stable or recommended for production use.  
- **WIP (Work in Progress)**: The feature is actively being developed and not yet ready for release.
- **N/A (Not Available)**: It is not planned to offer the feature for the specified framework or language.

Feature | .NET | Spring | Python | JavaScript
------- | ---- | ------ | ------ | ----------
Targeting Filter | [GA](./feature-management-dotnet-reference.md#targeting) | GA | [GA](./feature-management-python-reference.md#targeting) | [GA](./feature-management-javascript-reference.md#targeting)
Targeting Exclusion | [GA](./feature-management-dotnet-reference.md#targeting-exclusion) | GA | [GA](./feature-management-python-reference.md#targeting-exclusion) | [GA](./feature-management-javascript-reference.md#targeting-exclusion)
Ambient Targeting | [GA](./feature-management-dotnet-reference.md#targeting-in-a-web-application) | WIP | WIP | [GA](./feature-management-javascript-reference.md#targeting-in-a-web-application)
Time Window Filter | [GA](./feature-management-dotnet-reference.md#microsofttimewindow) | GA | [GA](./feature-management-python-reference.md#microsofttimewindow) | [GA](./feature-management-javascript-reference.md#microsofttimewindow)
Recurring Time Window | [GA](./feature-management-dotnet-reference.md#microsofttimewindow) | GA | WIP | WIP
Custom Feature Filter | [GA](./feature-management-dotnet-reference.md#implementing-a-feature-filter) | GA | [GA](./feature-management-python-reference.md#implementing-a-feature-filter) | [GA](./feature-management-javascript-reference.md#implementing-a-feature-filter)
Feature Filter Requirement Type (AND/OR) | [GA](./feature-management-dotnet-reference.md#requirement-type) | GA | [GA](./feature-management-python-reference.md#requirement-type) | [GA](./feature-management-javascript-reference.md#requirement-type)
Variant Feature Flag | [GA](./feature-management-dotnet-reference.md#variants) | GA | [GA](./feature-management-python-reference.md#variants) | [GA](./feature-management-javascript-reference.md#variants)
Feature Flag Telemetry | [GA](./feature-management-dotnet-reference.md#telemetry) | GA | [GA](./feature-management-python-reference.md#telemetry) | [GA](./feature-management-javascript-reference.md#telemetry)
Application Insights Integration | [GA](./feature-management-dotnet-reference.md#application-insights-telemetry) | GA | [GA](./feature-management-python-reference.md#application-insights-telemetry) | [GA](./feature-management-javascript-reference.md#application-insights-integration)
Feature Gate | [GA](./feature-management-dotnet-reference.md#controllers-and-actions) | GA | N/A | N/A
Feature Gated Middleware | [GA](./feature-management-dotnet-reference.md#application-building) | GA | N/A | N/A

## Support policy

Details on the support policy for feature management libraries can be found [here](./client-library-support-policy.md).