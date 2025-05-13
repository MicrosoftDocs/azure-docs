---
title: Support policy for Azure App Configuration client libraries
description: Learn about the support lifecycle for Azure App Configuration client libraries, including active support, deprecation mode, and out-of-support phases.
author: jimmyca15
ms.author: jimmyca
ms.date: 05/13/2025
ms.topic: reference
ms.service: azure-app-configuration
---
# Support policy for Azure App Configuration client libraries

This document outlines the support policy for Azure App Configuration client libraries. The policy is aligned with the [Azure SDK Support Policy](https://azure.github.io/azure-sdk/policies_support.html) and it applies to all programming languages. For a list of libraries in scope, see [configuration providers](./configuration-provider-overview.md#configuration-provider-libraries) and [feature management](./feature-management-overview.md#feature-management-libraries).

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

- **Feature Management 4.0.0:**
  - Released: November 1, 2024
  - Active Support: Until at least November 1, 2025 (12 months)
  - Maintenance Mode: Begins November 1, 2025, or upon release of 5.x (whichever is later), lasting at least 12 months
  - Out of Support: After maintenance mode ends (e.g., November 1, 2026, or later if 5.x is released after November 1, 2025)
- **.NET Configuration Provider 8.0.0:**
  - Released: October 9, 2024
  - Active Support: Until at least October 9, 2025 (12 months)
  - Maintenance Mode: Begins October 9, 2025, or upon release of 9.x (whichever is later), lasting at least 12 months
  - Out of Support: After maintenance mode ends (e.g., October 9, 2026, or later if 9.x is released after October 9, 2025)

## Existing releases

For major versions released prior to the adoption of this policy, a grace period will be enacted. Any major version currently in deprecation mode as of the announcement of this policy will receive at least 12 months of maintenance support starting from the announcement date.

## Using unsupported versions

If you are using a version of an Azure App Configuration client library that is no longer supported we strongly recommend upgrading to a supported version to benefit from the latest features, bug fixes, and security updates.

> [!TIP]
> To ensure continued support and access to the latest improvements, check the release notes for the latest supported versions of Azure App Configuration client libraries. To check the release notes see [configuration providers](./configuration-provider-overview.md#configuration-provider-libraries) and [feature management](./feature-management-overview.md#feature-management-libraries).