---
title: Support policy for Azure App Configuration client libraries
description: Learn about the support lifecycle for Azure App Configuration client libraries, including active support, deprecation mode, and out-of-support phases.
author: jimmyca15
ms.author: jimmyca
ms.date: 05/13/2025
ms.topic: reference
ms.service: azure-app-configuration
ms.custom:
  - build-2025
---
# Support policy for Azure App Configuration client libraries

This document outlines the support policy for Azure App Configuration client libraries. The policy is aligned with the [Azure SDK Support Policy](https://azure.github.io/azure-sdk/policies_support.html) and it applies to all programming languages. For the list of libraries in scope, see [existing releases](./client-library-support-policy.md#existing-releases). This policy excludes libraries for the Java Spring framework which are governed by the Azure Spring support policy outlined [here](../spring-apps/basic-standard/concept-app-customer-responsibilities.md#spring-boot-and-spring-cloud-versions) and [here](https://github.com/Azure/azure-sdk-for-java/wiki/Spring-Versions-Mapping).

## Key terms

- **Active Support:** During this phase, a major version receives regular updates, including new features, bug fixes, and security patches.
- **Deprecation Mode:** In this phase, a major version receives only critical bug fixes and security updates. No new features are introduced.

## Support lifecycle

Each major version of Azure App Configuration libraries follows this support lifecycle:

- **Active Support Period:** A minimum of 12 months from the release date of the major version. During this time, the library is fully supported with updates and enhancements.
- **Deprecation Mode:** Begins either:
  - Upon the release of the next major version, or
  - At the end of the 12-month active support period,
  whichever occurs later. Deprecation mode lasts for at least 12 months, focusing on critical bug fixes and security updates.
- **Out of Support:** After the deprecation mode period ends, the major version is no longer supported. No further updates, including bug fixes or security patches, will be provided. Customers are encouraged to upgrade to a supported version.

This ensures a minimum of 24 months of total support from the release date of each major version, with at least 12 months of active support followed by at least 12 months of maintenance.

### Example lifecycle

For illustration:

- **Microsoft.Extensions.Configuration.AzureAppConfiguration 8.x.x:**
  - Released: October 9, 2024
  - Active Support: Until at least October 9, 2025 (12 months)
  - Deprecation Mode: Begins October 9, 2025, or upon release of 9.x (whichever is later), lasting at least 12 months
  - Out of Support: After deprecation mode ends (e.g., October 9, 2026, or later if 9.x is released after October 9, 2025)

---

## Existing releases

For major versions released prior to the adoption of this policy, a grace period will be enacted. Any major version currently in deprecation mode as of the announcement of this policy will receive at least 12 months of maintenance support starting from May 20, 2025.

### Configuration providers

#### [.NET](#tab/dotnet)

##### Microsoft.Azure.AppConfiguration.AspNetCore

| Version | Release Date       | Deprecation Mode Start Date | Out of Support Start Date |
|---------|--------------------|-----------------------------|---------------------------|
| 8.x.x   | October 9, 2024    | --                          | --                        |
| 7.x.x   | November 21, 2023  | November 21, 2024           | May 20, 2026*             |
| 6.x.x   | March 28, 2023     | March 28, 2024              | March 28, 2025            |

##### Microsoft.Azure.AppConfiguration.Functions.Worker

| Version | Release Date       | Deprecation Mode Start Date | Out of Support Start Date |
|---------|--------------------|-----------------------------|---------------------------|
| 8.x.x   | October 9, 2024    | --                          | --                        |
| 7.x.x   | November 21, 2023  | November 21, 2024           | May 20, 2026*             |
| 6.x.x   | March 28, 2023     | March 28, 2024              | March 28, 2025            |

##### Microsoft.Configuration.ConfigurationBuilders.AzureAppConfiguration

| Version | Release Date       | Deprecation Mode Start Date | Out of Support Start Date |
|---------|--------------------|-----------------------------|---------------------------|
| 3.x.x   | April 12, 2023     | --                          | --                        |

##### Microsoft.Extensions.Configuration.AzureAppConfiguration

| Version | Release Date       | Deprecation Mode Start Date | Out of Support Start Date |
|---------|--------------------|-----------------------------|---------------------------|
| 8.x.x   | October 9, 2024    | --                          | --                        |
| 7.x.x   | November 21, 2023  | November 21, 2024           | May 20, 2026*             |
| 6.x.x   | March 28, 2023     | March 28, 2024              | March 28, 2025            |
#### [Python](#tab/python)

##### azure-appconfiguration-provider

| Version | Release Date       | Deprecation Mode Start Date | Out of Support Start Date |
|---------|--------------------|-----------------------------|---------------------------|
| 2.x.x   | January 7, 2025    | --                          | --                        |
| 1.x.x   | March 9, 2023      | January 7, 2025             | May 20, 2026*             |

#### [JavaScript](#tab/javascript)

##### @azure/app-configuration-provider

| Version | Release Date       | Deprecation Mode Start Date | Out of Support Start Date |
|---------|--------------------|-----------------------------|---------------------------|
| 2.x.x   | February 13, 2025  | --                          | --                        |
| 1.x.x   | June 5, 2024       | June 5, 2025                | June 5, 2026              |

#### [Kubernetes](#tab/kubernetes)

##### mcr.microsoft.com/azure-app-configuration/kubernetes-provider

| Version | Release Date       | Deprecation Mode Start Date | Out of Support Start Date |
|---------|--------------------|-----------------------------|---------------------------|
| 2.x.x   | September 10, 2024 | --                          | --                        |
| 1.x.x   | November 14, 2023  | November 14, 2024           | November 14, 2025**       |

---

### Feature management

#### [.NET](#tab/dotnet)

##### Microsoft.FeatureManagement

| Version | Release Date       | Deprecation Mode Start Date | Out of Support Start Date |
|---------|--------------------|-----------------------------|---------------------------|
| 4.x.x   | November 1, 2024   | --                          | --                        |
| 3.x.x   | October 27, 2023   | November 1, 2024            | May 20, 2026*             |
| 2.x.x   | February 27, 2020  | October 27, 2023            | October 27, 2024          |

##### Microsoft.FeatureManagement.AspNetCore

| Version | Release Date       | Deprecation Mode Start Date | Out of Support Start Date |
|---------|--------------------|-----------------------------|---------------------------|
| 4.x.x   | November 1, 2024   | --                          | --                        |
| 3.x.x   | October 27, 2023   | November 1, 2024            | May 20, 2026*             |
| 2.x.x   | February 27, 2020  | October 27, 2023            | October 27, 2024          |

#### [Python](#tab/python)

##### FeatureManagement

| Version | Release Date       | Deprecation Mode Start Date | Out of Support Start Date |
|---------|--------------------|-----------------------------|---------------------------|
| 2.x.x   | January 7, 2025    | --                          | --                        |
| 1.x.x   | July 1, 2024       | July 1, 2025                | July 1, 2026             |

#### [JavaScript](#tab/javascript)

##### @microsoft/feature-management

| Version | Release Date       | Deprecation Mode Start Date | Out of Support Start Date |
|---------|--------------------|-----------------------------|---------------------------|
| 2.x.x   | January 14, 2025   | --                          | --                        |
| 1.x.x   | September 25, 2024 | September 25, 2025          | September 25, 2026        |

#### [Kubernetes](#tab/kubernetes)

Not applicable.

---

This table lists the highest out-of-support version for any given library. Any existing library version lower than the ones listed here is considered to be out of support.

\* Dates marked with an asterisk '*' denote an extension due to the initial announcement grace period.  
\*\* The aforementioned grace period does not apply to the Kubernetes configuration provider.

## Using unsupported versions

If you are using a version of an Azure App Configuration client library that is no longer supported we strongly recommend upgrading to a supported version to benefit from the latest features, bug fixes, and security updates.

> [!TIP]
> To ensure continued support and access to the latest improvements, check the release notes for the latest supported versions of Azure App Configuration client libraries. To check the release notes see [configuration providers](./configuration-provider-overview.md#configuration-provider-libraries) and [feature management](./feature-management-overview.md#feature-management-libraries).