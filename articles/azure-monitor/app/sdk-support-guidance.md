---
title: Application Insights SDK support guidance 
description: Support guidance for Application Insights legacy and preview SDKs
services: azure-monitor
ms.topic: conceptual
ms.date: 11/15/2022
ms.reviewer: vgorbenko
---

# Application Insights SDK support guidance

Microsoft announces feature deprecations or breaking changes at least one year in advance and strives to provide a seamless process for migration to the replacement experience.

For more information, review the [Azure SDK Lifecycle and Support Policy](https://azure.github.io/azure-sdk/policies_support.html).

> [!NOTE]
> Diagnostic tools often provide better insight into the root cause of a problem when the latest stable SDK version is used.

## SDK update guidance

Support engineers are expected to provide SDK update guidance according to the following table, referencing the current SDK version in use and any alternatives.

|Current SDK version in use |Alternative version available |Update policy for support |
|---------|---------|---------|
|Latest GA SDK                                                                  | Newer preview version available                | **NO UPDATE NECESSARY** |
|GA SDK                                                                         | Newer GA released < one year ago               | **UPDATE RECOMMENDED**  |
|GA SDK                                                                         | Newer GA released > one year ago               | **UPDATE REQUIRED**     |
|Unsupported ([support policy](/lifecycle/faq/azure))                           | Any supported version                          | **UPDATE REQUIRED**     |
|Latest Preview                                                                 | No newer version available                     | **NO UPDATE NECESSARY** |
|Latest Preview                                                                 | Newer GA SDK                                   | **UPDATE REQUIRED**     |
|Preview                                                                        | Newer preview version                          | **UPDATE REQUIRED**     |

> [!NOTE]
> * General Availability (GA) refers to non-beta versions.
> * Preview refers to beta versions.

> [!TIP]
> Switching to [auto-instrumentation](codeless-overview.md) eliminates the need for manual SDK updates.

> [!WARNING]
> Only commercially reasonable support is provided for Preview versions of the SDK. If a support incident requires escalation to development for further guidance, customers will be asked to use a fully supported SDK version to continue support. Commercially reasonable support does not include an option to engage Microsoft product development resources; technical workarounds may be limited or not possible.

## Release notes

Reference the release notes to see the current version of Application Insights SDKs and previous versions release dates.

- [.NET SDKs (Including ASP.NET, ASP.NET Core, and Logging Adapters)](https://github.com/Microsoft/ApplicationInsights-dotnet/releases)
- [Python](https://github.com/census-instrumentation/opencensus-python/blob/master/contrib/opencensus-ext-azure/CHANGELOG.md)
- [Node.js](https://github.com/Microsoft/ApplicationInsights-node.js/releases)
- [JavaScript](https://github.com/microsoft/ApplicationInsights-JS/releases)

Our [Service Updates](https://azure.microsoft.com/updates/?service=application-insights) also summarize major Application Insights improvements.
