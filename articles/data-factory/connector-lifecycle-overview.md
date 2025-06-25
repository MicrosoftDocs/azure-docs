---
title: Connector lifecycle overview
description: This article describes the connector lifecycle.
author: jianleishen
ms.author: jianleishen
ms.service: azure-data-factory
ms.subservice: data-movement
ms.topic: concept-article
ms.custom:
  - references_regions
  - build-2025
ms.date: 06/25/2025
---

# Connector lifecycle overview

In Azure Data Factory, the introduction of the connector lifecycle ensures that customers always have access to the most reliable, secure, and feature-rich connectors. With the structured lifecycle stages, major connector upgrade evolves through distinct lifecycle stages, from preview to general availability and end of support, providing clear expectations for stability, support, and future enhancements. This lifecycle framework guarantees that users can seamlessly adopt new connectors with confidence, benefit from regular performance and security updates, and prepare in advance for any phase-out of older versions. By utilizing versioning within the connector lifecycle, the service empowers users with a predictable, transparent, and future-proof integration experience, reducing operational risks and enhancing overall workload reliability.

## Release rhythm

Connector upgrades are essential to evolve innovation in a fast manner, maintain performance, compatibility, and reliability. These upgrades typically occur in the following scenarios:

- **New feature enhancements such as security, performance, etc.**  

   While the service actively evolves to provide the most secure and reliable features in the connector, leveraging the connector lifecycle is an efficient approach to ensure that users can take full advantage of the new enhancements at their manageable pace without business interruption.

- **Protocol change introduced by external data source vendors leading to potential behavior changes**  

   These changes are not always exhaustively predictable and arise due to incompatibility brought by individual data source vendor itself. Given these uncertainties, versioning ensures that users can adopt the updated connector (e.g. version 2.0) while maintaining a fallback option in a period. This empowers users to well plan for a version upgrade to accommodate potential differences while providing users with a clear transition path.

- **Fixing unintended behaviors**  

   In some cases, earlier connector versions may exhibit unexpected or buggy behaviors due to legacy constraints. When an upgrade corrects these behaviors and improves data integrity and reliability, it may also inevitably bring behavior changes. In this case, versioning plays a crucial role in ensuring that users are aware of these changes, can test them in a controlled environment, and transition smoothly without disruption.

By adopting a structured connector lifecycle with versioning, the service provides customers with transparency, control, and predictability when connector upgrades are introduced. Users can confidently evaluate new versions, mitigate risks associated with behavior changes, and benefit from continuous improvements while maintaining operational stability.

**The diagram outlines the lifecycle of a connector version from its private preview to its removal.**

:::image type="content" source="media/connector-lifecycle/connector-lifecycle.png" alt-text="Screenshot of the linked services page." lightbox="media/connector-lifecycle/connector-lifecycle.png":::

A connector lifecycle includes multiple stages with thorough and measurable assessment to ensure the quality. It includes private preview, public preview, general availability, end of support and version removed. The following table lists the stage name and the relevant criteria.

| Stage                     | Description                                                                                     | Lifecycle                |
|---------------------------|-------------------------------------------------------------------------------------------------|--------------------------|
| Private Preview      | The private preview phase marks the initial release of a new connector version to limited users. During this phase, opt-in users can use the latest version of the connector and provide feedback. | 3 months or above       |
| Public Preview      | This stage marks the initial release of a new connector version to all users publicly. During this phase, users are encouraged to try the latest connector version and provide feedback. For newly created connections, it defaults to the latest connector version. Users can switch back to the previous version. | 1 month or above*       |
| General Availability  | Once a connector version meets the General Availability (GA) criteria, it's released to the public and is suitable for production workloads. To reach this stage, the new connector version must meet the requirements in terms of performance, reliability, and its capability to meet business needs. | 12 months or above*     |
| End-of-Support (EOS) announced | When a connector version reaches its EOS, it will not receive any further updates or support. A six-month notice is announced before the EOS date of this version. This is documented together with the removal date. | 6 months before the end-of-support date* |
| End-of-Support (EOS)  | Once the previously announced EOS date arrives, the connector version becomes officially unsupported. This implies that it will not receive any updates or bug fixes, and no official support will be provided. Users will not be able to create new workloads on a version that is under EOS stage. Using an unsupported connector version is at the user's own risk. The workload running on EOS version may not fail immediately, the service might expedite moving into the final stage at any time, at Microsoft's discretion due to outstanding security issues, or other factors. | /                        |
| Version removed  | Once the connector version passes its EOS date, the service will remove all related components associated with this connector version. This implies that pipelines using this connector version will discontinue to execute. | 1-12 months after the end of support date* |

*\* These timelines are provided as an example and might vary depending on various factors. Lifecycle timelines are subject to change at Microsoft discretion.*

## Understanding connector versions

To manage connection updates effectively, it's important to understand versioning and how to interpret the change. Connectors in Azure Data Factory generally follow versioning Major.Minor (e.g., 1.2):

- **Major updates (x.0):** These are significant changes that require review on the changes before upgrade.
- **Minor updates (1.x):** These might introduce new features or fixes, but with minor changes to the existing behavior.

## How Data Factory handles connector version upgrade

**Major and minor version** updates may include changes that can impact your pipeline output or related components. To help you prepare, we will notify you in advance, providing a window for testing and upgrading to the latest version. Specific examples of version changes can be found in the documentation for each individual connector. We recommend reviewing and upgrading to the latest version as early as possible to take advantage of the up-to-date enhancements and ensure your pipelines continue to run smoothly and reliably.

When new versions are released, the service starts to always set to the latest new versions by default for all newly created linked service. At that time, users can fall back to the earlier version if needed.

When a version reaches its end-of-support date, users are no longer allowed to create new linked service on that version.

In addition to major and minor version updates, the service also delivers new features and bug fixes that are fully backward compatible with your existing setup. These changes do not require a version update to the connector. Depending on the nature of the change, users may either receive the improvements automatically or have the option to enable new features as needed. This approach ensures a seamless experience while maintaining stability and flexibility.

## Automatic Connector Upgrade 

In addition to providing [tools](connector-upgrade-advisor.md) and [best practices](connector-upgrade-guidance.md) to help users manually upgrade their connectors, the service now also provides a more streamlined upgrade process for some cases where applicable. This is designed to help users adopt the most reliable and supported connector versions with minimal disruption.

The following section outlines the general that the service takes for automatic upgrades. While this provides a high-level overview, it is strongly recommended to review the documentation specific to each connector to understand which scenarios are supported and how the upgrade process applies to your workloads.

In cases where certain scenarios running on the latest GA connector version are fully backward compatible with the previous version, the service will automatically upgrade existing workloads (such as Copy, Lookup, and Script activities) to a compatibility mode that preserves the behavior of the earlier version.

These auto-upgraded workloads are not affected by the announced removal date of the older version, giving users additional time to evaluate and transition to the latest GA version without facing immediate failures. 

You can identify which activities have been automatically upgraded by inspecting the activity output, where relevant upgrade information is recorded.

> [!NOTE]
> While compatibility mode offers flexibility, we strongly encourage users to upgrade to the latest GA version as soon as possible to benefit from ongoing improvements, optimizations, and full support. 

## Related content

- [Connector overview](connector-overview.md)  
- [Connector upgrade guidance](connector-upgrade-guidance.md) 
- [Connector upgrade advisor](connector-upgrade-advisor.md)
- [Connector release stages and timelines](connector-release-stages-and-timelines.md)  
- [Connector upgrade FAQ](connector-deprecation-frequently-asked-questions.md)  