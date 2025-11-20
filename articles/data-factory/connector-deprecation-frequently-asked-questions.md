---
title: Connector upgrade FAQ 
description: Get answers to frequently asked questions about connector upgrade.
author: KrishnakumarRukmangathan
ms.author: krirukm
ms.service: azure-data-factory
ms.subservice: data-movement
ms.topic: concept-article
ms.date: 11/07/2025
ms.custom:
  - build-2025
  - sfi-image-nochange
---

# Connector upgrade FAQ

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article provides answers to frequently asked questions about connector upgrade.

## <a name="why-does-azure-data-factory-adf-release-new-connectors-and-ask-users-to-upgrade-their-existing-connectors"></a> Why does Azure Data Factory (ADF) release new connector versions and ask users to upgrade their existing connectors?

At Azure Data Factory (ADF), we're committed to continually enhancing our platform by improving performance, security and overall user experience. Upgrading connectors is a key part of our efforts to deliver the latest innovations and ensure your data workflows run smoothly. These upgrades offer several important benefits:

 - Improved data ingestion performance for faster processing
 - Seamless native integration with your data sources
 - Better supportability, ensuring quicker response times and bug fixes
 - Enhanced security through a more robust application model

## Which users should be concerned about this? 

If your data factory includes any of the connectors listed in the [parent article](connector-deprecation-plan.md) announcing the **End of Support**, you should plan to migrate to the newer version of the connector or explore alternative solutions before the deprecation/disabled date.

Alternatively, you can check if you have any impacted objects in your data factory by navigating to **Manage → Linked Services** page. If you have any connectors using unsupported versions, an alert icon is displayed beside those linked services.

:::image type="content" source="media/connector-deprecation-frequently-asked-questions/linked-services-page.png" alt-text="Screenshot of the linked services page." lightbox="media/connector-deprecation-frequently-asked-questions/linked-services-page.png":::

## Where can I see the upgrade notification?

The upgrade notifications were shared across multiple channels,

- Public documentation – Refer [Planned connector deprecations for Azure Data Factory](connector-deprecation-plan.md).
- Azure Data Factory Portal – The upgrade warning was displayed as a global banner and on the related linked service page. 

    :::image type="content" source="media/connector-deprecation-frequently-asked-questions/upgrade-warning.png" alt-text="Screenshot of the upgrade warning." lightbox="media/connector-deprecation-frequently-asked-questions/upgrade-warning.png"::: 

- Azure Notification – Notification emails were sent on regular cadence to the impacted subscriptions, detailing the required actions and corresponding timeline.

- Azure Service Health – Your subscription owners will see the upgrade notifications under Azure Service Health → Advisories for all impacted subscriptions.

## What actions should I take? What is the recommended upgrade path?

Your upgrade path may vary depending on the connector:

1. **Review the differences** – Upgrading your connector may or may not be straightforward. We recommend first reviewing our connector [documentation](connector-deprecation-plan.md#overview), which highlights the differences between versions and offers detailed upgrade guidance.
2. **Migrate to the new connector version** – For connectors with updated versions, we strongly recommend migrating to the latest version.
3. **If you're blocked from upgrading** – If you're unable to upgrade to the new connector version, determine whether it's due to a feature gap or an error/bug with the new connector version. Then follow the instructions outlined under [question 6](#what-should-i-do-if-i-encounter-the-feature-gaps-and-errors-bugs-that-are-preventing-me-from-migrating-to-the-new-connectors) to contact us.

## What will happen after the connector version removal date?

There are three key deadlines outlined in our documentation:

1. **End of Support Announcement:**  This period serves as a recommended upgrade window. You're encouraged to upgrade your connectors to the latest version during this time and engage with the Microsoft team if you encounter any blockers.  

    - New linked services can't use connector unsupported versions, but existing linked services using connector unsupported versions continue to work.

1. **End of Support (EOS) date:**  At this point, the connector is officially deprecated and no longer supported. Your data factories using connector unsupported versions continue to operate, we won't intentionally fail any pipelines. However, the deprecation takes effect with the following:

    - No bug fixes will be provided.
    - No new features will be added.
    - Microsoft reserves the right to disable the connector if a critical security vulnerability (CVE) is identified.

1. **Version removed:** After this date, pipelines using connector removed versions will start to fail if it is not automatically upgraded. All pipelines relying on connector removed versions will start to fail as the service stop all traffic on removed version drivers. 
 
    - New features and bug fixes are only available on the new connector version.  
    - If your activity has been automatically upgraded by the service, your pipelines that rely on the removed versions continue to run, giving users additional time to evaluate and transition to the latest GA version without facing immediate failures.

## <a name="how-should-i-get-an-extension-for-legacy-version-of-the-connectors"></a> How should I get an extension for the removed version of connectors?

In general, we don't recommend customers to request an extension. However, we recognize that, due to various factors, some customers may need more time to complete their upgrades. In such cases, we encourage customers to take full advantage of the service's [automatic upgrade](automatic-connector-upgrade.md) capabilities, which apply at the connector and pipeline activity level. These capabilities effectively grant your workload an extension by automatically upgrading it, thereby preventing failures after the end-of-support date.

It's important to note that the scope of automatic upgrades varies by connector. We strongly recommend reviewing the [criteria](automatic-connector-upgrade.md#supported-automatic-upgraded-criteria) and supported scenarios for each connector to prioritize workloads that require manual upgrades before the end-of-support date, ensuring uninterrupted operations.

While auto-upgraded workloads aren't immediately affected by the announced removal date of the older version, this approach gives customers additional time to evaluate, validate, and transition to the latest GA version without facing unexpected disruptions.

An extension allows the pipeline that relies on the existing removed versions to continue running. However, it won't permit the creation of new workloads, such as linked services, that depend on removed versions.

## If the activity is automatically upgraded, will they still fail after the version removal date?

The auto-upgraded workloads aren't affected by the announced removal date of the older version, giving users additional time to evaluate and transition to the latest GA version without facing immediate failures. Read this [article](automatic-connector-upgrade.md) for more details.

## How can I leverage the auto-upgrade capability?

As the service provides the auto-upgrade capabilities within a list of connectors, each connector has different supported scopes. To ensure that your workload can benefit from this capability, make sure that your configurations or the capabilities used in the impacted connectors are supported by auto-upgrade. You can find more details from the [table](automatic-connector-upgrade.md#supported-automatic-upgraded-criteria) for the individual connector that is planned for the automatic upgrade. The automatic upgrade is triggered from service side in a regular cadence depends on the service release plan as long as your workload meets criteria.  

While compatibility mode offers flexibility, we strongly encourage users to upgrade to the latest GA version as soon as possible to benefit from ongoing improvements, optimizations, and full support.

## How do I know which workload has been automatically upgraded?

You can identify which activities have been automatically upgraded by inspecting the activity output, where relevant upgraded information is recorded. The examples below show the upgraded information in various activity outputs. You can find the payload examples from this [article](automatic-connector-upgrade.md).


## If my workload is automatically upgraded by the service, how much additional time can I get to upgrade to v2?

There are no plans to disable workloads that have been automatically upgraded. However, please note that no bug fixes or new features are available for these workloads.

## <a name="what-should-i-do-if-i-encounter-the-feature-gaps-and-errors-bugs-that-are-preventing-me-from-migrating-to-the-new-connectors"></a> What should I do if I encounter the feature gaps and errors/ bugs that are preventing me from upgrading to the latest connector version?

If you encounter any feature gaps while upgrading the connector to latest versions, please review our connector documentation to check if it’s a known limitation. Additionally, send us an email at **dfconnectorupgrade@microsoft.com** with a description of the feature gap. 

If you encounter any errors or bugs while upgrading to the latest connector versions, please contact our Microsoft support team and open a support ticket. Be sure to include detailed information about the connector, the error encountered, and your use case.

## Related content

- [Connector overview](connector-overview.md)  
- [Connector lifecycle overview](connector-lifecycle-overview.md) 
- [Connector upgrade guidance](connector-upgrade-guidance.md) 
- [Connector upgrade advisor](connector-upgrade-advisor.md)  
- [Connector release stages and timelines](connector-release-stages-and-timelines.md)  
