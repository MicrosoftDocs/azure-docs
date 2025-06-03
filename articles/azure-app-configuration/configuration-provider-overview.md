---
title: Configuration Provider Overview
titleSuffix: Azure App Configuration
description: Overview of configuration provider libraries of different programming languages.
services: azure-app-configuration
author: zhiyuanliang-ms
ms.author: zhiyuanliang
ms.service: azure-app-configuration
ms.topic: overview
ms.date: 01/22/2025
#Customer intent: I want to learn about the configuration provider libraries of different languages, specifically to track their feature development status.
ms.custom:
  - build-2025
---

# Configuration Provider Overview

The Azure App Configuration provider libraries enable developers to configure their applications using centralized configuration located in Azure App Configuration. The API design follows the patterns outlined by the common configuration system in different programming languages to make switching to Azure App Configuration a familiar and easy experience.

> [!IMPORTANT]
> The configuration provider libraries are higher-level integration libraries that support additional [features](#feature-development-status) in contrast to the Azure SDKs which provide low-level, direct interaction with the Azure App Configuration service.

> [!NOTE]
> If you use feature flags in Azure App Configuration, we recommend you to use the configuration provider alongside the [feature management](./feature-management-overview.md) libraries, which are designed to work together.

## Configuration Provider Libraries

Module | Platform | Sample | Release Notes
------ | -------- | ------ | -------------
[Microsoft.Extensions.Configuration.AzureAppConfiguration](https://github.com/Azure/AppConfiguration-DotnetProvider)<br/>[![Nuget: Microsoft.Extensions.Configuration.AzureAppConfiguration](https://img.shields.io/nuget/v/Microsoft.Extensions.Configuration.AzureAppConfiguration.svg?color=blue)](https://www.nuget.org/packages/Microsoft.Extensions.Configuration.AzureAppConfiguration/) | .NET Standard | [Sample](https://github.com/Azure/AppConfiguration/tree/main/examples/DotNetCore) | [Release Notes](https://github.com/Azure/AppConfiguration/blob/main/releaseNotes/MicrosoftExtensionsConfigurationAzureAppConfiguration.md)
[Microsoft.Azure.AppConfiguration.AspNetCore](https://github.com/Azure/AppConfiguration-DotnetProvider)<br/>[![Nuget: Microsoft.Azure.AppConfiguration.AspNetCore](https://img.shields.io/nuget/v/Microsoft.Azure.AppConfiguration.AspNetCore.svg?color=blue)](https://www.nuget.org/packages/Microsoft.Azure.AppConfiguration.AspNetCore/) | ASP&#46;NET Core | [Sample](https://github.com/Azure/AppConfiguration/tree/main/examples/DotNetCore) | [Release Notes](https://github.com/Azure/AppConfiguration/blob/main/releaseNotes/MicrosoftAzureAppConfigurationAspNetCore.md)
[Microsoft.Azure.AppConfiguration.Functions.Worker](https://github.com/Azure/AppConfiguration-DotnetProvider)<br/>[![Nuget: Microsoft.Azure.AppConfiguration.Functions.Worker](https://img.shields.io/nuget/v/Microsoft.Azure.AppConfiguration.Functions.Worker.svg?color=blue)](https://www.nuget.org/packages/Microsoft.Azure.AppConfiguration.Functions.Worker/) | Azure Functions<br/>(Isolated process) | [Sample](https://github.com/Azure/AppConfiguration/tree/main/examples/DotNetCore) | [Release Notes](https://github.com/Azure/AppConfiguration/blob/main/releaseNotes/MicrosoftAzureAppConfigurationFunctionsWorker.md)
[Microsoft.Configuration.ConfigurationBuilders.AzureAppConfiguration](https://github.com/aspnet/MicrosoftConfigurationBuilders/tree/main/src/AzureAppConfig)<br/>[![Nuget: Microsoft.Configuration.ConfigurationBuilders.AzureAppConfiguration](https://img.shields.io/nuget/v/Microsoft.Configuration.ConfigurationBuilders.AzureAppConfiguration.svg?color=blue)](https://www.nuget.org/packages/Microsoft.Configuration.ConfigurationBuilders.AzureAppConfiguration/) | .NET Framework | [Sample](https://github.com/Azure/AppConfiguration/tree/main/examples/DotNetFramework/WebDemo) | [Release Notes](https://github.com/aspnet/MicrosoftConfigurationBuilders/releases)
[spring-cloud-azure-appconfiguration-config](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/spring/spring-cloud-azure-appconfiguration-config)<br/>[![Maven: spring-cloud-azure-appconfiguration-config](https://img.shields.io/maven-central/v/com.azure.spring/spring-cloud-azure-appconfiguration-config.svg?color=blue)](https://search.maven.org/artifact/com.azure.spring/spring-cloud-azure-appconfiguration-config) | Java Spring | [Sample](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/main/appconfiguration/spring-cloud-azure-starter-appconfiguration-config/spring-cloud-azure-starter-appconfiguration-config-sample) | [Release Notes](https://github.com/Azure/AppConfiguration/blob/main/releaseNotes/SpringCloudAzureAppConfigurationConfig.md)
[spring-cloud-azure-appconfiguration-config-web](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/spring/spring-cloud-azure-appconfiguration-config-web)<br/>[![Maven: spring-cloud-azure-appconfiguration-config-web](https://img.shields.io/maven-central/v/com.azure.spring/spring-cloud-azure-appconfiguration-config-web.svg?color=blue)](https://search.maven.org/artifact/com.azure.spring/spring-cloud-azure-appconfiguration-config-web) | Java Spring | [Sample](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/main/appconfiguration/spring-cloud-azure-starter-appconfiguration-config/spring-cloud-azure-starter-appconfiguration-config-sample) | [Release Notes](https://github.com/Azure/AppConfiguration/blob/main/releaseNotes/SpringCloudAzureAppConfigurationConfig.md)
[azure-appconfiguration-provider](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/appconfiguration/azure-appconfiguration-provider)<br/>[![Pypi](https://img.shields.io/pypi/v/azure-appconfiguration-provider.svg?color=blue)](https://pypi.org/project/azure-appconfiguration-provider/) | Python | [Sample](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/appconfiguration/azure-appconfiguration-provider/samples) | [Release Notes](https://github.com/Azure/AppConfiguration/blob/main/releaseNotes/AzureAppConfigurationProviderPython.md)
[@azure/app-configuration-provider](https://github.com/Azure/AppConfiguration-JavaScriptProvider)<br/>[![Npm](https://img.shields.io/npm/v/@azure/app-configuration-provider?color=blue)](https://www.npmjs.com/package/@azure/app-configuration-provider) | JavaScript | [Sample](https://github.com/Azure/AppConfiguration-JavaScriptProvider/tree/main/examples) | [Release Notes](https://github.com/Azure/AppConfiguration/blob/main/releaseNotes/JavaScriptProvider.md)

## Feature Development Status

This is an overview of each feature and its current status for different frameworks or programming languages.  

- **GA (General Availability)**: The feature is fully released, considered stable, and ready for production use.  
- **Preview**: The feature is available for early testing and feedback, but not yet fully stable or recommended for production use.  
- **WIP (Work in Progress)**: The feature is actively being developed and not yet ready for release.
- **N/A (Not Available)**: It is not planned to offer the feature for the specified framework or language.

Feature | .NET | Spring | Kubernetes | Python | JavaScript
------- | ---- | ------ | ---------- | ------ | ----------
Connection String Authentication | [GA](./reference-dotnet-provider.md#load-configuration) | GA | GA | GA | [GA](./reference-javascript-provider.md#load-configuration)
Entra ID Authentication | [GA](./reference-dotnet-provider.md#load-configuration) | GA | GA | GA | [GA](./reference-javascript-provider.md#load-configuration)
Dynamic Refresh (Poll Mode) | [GA](./reference-dotnet-provider.md#refresh-on-sentinel-key) | GA | GA | GA | [GA](./reference-javascript-provider.md#refresh-on-sentinel-key)
Dynamic Refresh (Push Mode) | GA | GA | N/A | N/A | N/A
Dynamic Refresh (Collection Monitoring) | [GA](./reference-dotnet-provider.md#configuration-refresh) | WIP | GA | WIP | [GA](./reference-javascript-provider.md#configuration-refresh)
JSON Content Type Handling | [GA](./reference-dotnet-provider.md#json-content-type-handling) | GA | GA | GA | [GA](./reference-javascript-provider.md#json-content-type-handling)
Configuration Setting Mapping | [GA](./reference-dotnet-provider.md#configuration-setting-mapping) | N/A | N/A | N/A | N/A
Key Vault References | [GA](./reference-dotnet-provider.md#key-vault-reference) | GA | GA | GA | [GA](./reference-javascript-provider.md#key-vault-reference)
Key Vault Secret Refresh | [GA](./reference-dotnet-provider.md#key-vault-secret-refresh) | WIP | GA | WIP | WIP
Custom Key Vault Secret Resolution | [GA](./reference-dotnet-provider.md#key-vault-reference) | GA | GA | GA | [GA](./reference-javascript-provider.md#key-vault-reference)
Parallel Secret Resolution | WIP | WIP | WIP | WIP | [GA](./reference-javascript-provider.md#parallel-secret-resolution)
Feature Flags | [GA](./reference-dotnet-provider.md#feature-flag) | GA | GA | GA | [GA](./reference-javascript-provider.md#feature-flag)
Variant Feature Flags | [GA](./reference-dotnet-provider.md#feature-flag) | GA | GA | GA | [GA](./reference-javascript-provider.md#feature-flag)
Feature Flag Telemetry | GA | GA | WIP | GA | GA
Key Prefix Trim | [GA](./reference-dotnet-provider.md#trim-prefix-from-keys) | GA | GA | GA | [GA](./reference-javascript-provider.md#trim-prefix-from-keys)
Configurable Startup Time-out | [GA](./reference-dotnet-provider.md#startup-retry) | WIP | N/A | WIP | [GA](./reference-javascript-provider.md#startup-retry)
Replica Auto Discovery | [GA](./reference-dotnet-provider.md#geo-replication) | GA | GA | WIP | [GA](./reference-javascript-provider.md#geo-replication)
Replica Failover | [GA](./reference-dotnet-provider.md#geo-replication) | GA | GA | WIP | [GA](./reference-javascript-provider.md#geo-replication)
Replica Load Balancing | [GA](./reference-dotnet-provider.md#geo-replication) | WIP | GA | WIP | [GA](./reference-javascript-provider.md#geo-replication)
Snapshots | [GA](./reference-dotnet-provider.md#snapshot) | GA | GA | WIP | [GA](./reference-javascript-provider.md#snapshot)
Distributed tracing | [GA](./reference-dotnet-provider.md#distributed-tracing) | WIP | WIP | WIP | WIP
Health Check | WIP | WIP | WIP | WIP | WIP
Select by Tag Filters | [GA](./reference-dotnet-provider.md#load-specific-key-values-using-selectors) | WIP | WIP | WIP | WIP

## Support policy

Details on the support policy for configuration provider libraries can be found [here](./client-library-support-policy.md).
