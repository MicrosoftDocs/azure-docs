---
title: Connector upgrade FAQ 
description: Get answers to frequently asked questions about connector upgrade.
author: KrishnakumarRukmangathan
ms.author: krirukm
ms.service: azure-data-factory
ms.subservice: data-movement
ms.topic: concept-article
ms.date: 11/08/2024
---

# Connector upgrade FAQ

This article provides answers to frequently asked questions about connector upgrade.

## Why does Azure Data Factory (ADF) release new connectors and ask users to upgrade their existing connectors?

At Azure Data Factory (ADF), we are committed to continually enhancing our platform by improving performance, security and overall user experience. Upgrading connectors is a key part of our efforts to deliver the latest innovations and ensure your data workflows run smoothly. These upgrades offer several important benefits:

 - Improved data ingestion performance for faster processing
 - Seamless native integration with your data sources
 - Better supportability, ensuring quicker response times and bug fixes.
 - Enhanced security through a more robust application model

## Which users should be concerned about this? 

If your data factory includes any of the connectors listed in the [parent article](connector-deprecation-plan.md) announcing the **End of Support**, you should plan to migrate to the newer version of the connector or explore alternative solutions before the deprecation/disabled date.

Alternatively, you can check if you have any impacted objects in your data factory by navigating to **Manage → Linked Services** page. If you have any legacy connectors, an alert icon will be displayed beside those linked services.

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

1. **Review the differences** – Upgrading your connector may or may not be straightforward. We recommend first reviewing our connector [documentation](connector-deprecation-plan.md#overview), which highlights the differences between the legacy and new versions and offers detailed upgrade guidance.
2. **Migrate to the new connector** – For legacy connectors with updated versions, we strongly recommend migrating to the new connector.
3. **If you're blocked from upgrading** – If you're unable to upgrade to the new connector, determine whether it's due to a feature gap or an error/bug with the new connector. Then follow the instructions outlined under [question 6](#what-should-i-do-if-i-encounter-the-feature-gaps-and-errors-bugs-that-are-preventing-me-from-migrating-to-the-new-connectors) to contact us.

## What will happen after the migration deadline?

There are three key deadlines outlined in our documentation:
1. **End of Support Announcement**: This period serves as a recommended upgrade window. You are encouraged to upgrade your legacy connectors to the new ones during this time and engage with the Microsoft team if you encounter any blockers.
    - New linked services cannot use legacy connectors, but existing linked services with legacy connectors will continue to work.

1. **End of Support (EOS)**: At this point, the connector is officially deprecated and no longer supported. Your data factories using legacy connectors will continue to operate, we will not intentionally fail any pipelines. However, the deprecation takes effect with the following:
    - No bug fixes will be provided.
    - No new features will be added.
    - Microsoft reserves the right to disable the connector if a critical security vulnerability (CVE) is identified.

1. **Disabled Date**: After this date, pipelines using legacy connectors will be disabled, meaning all pipelines relying on legacy connectors will start to fail as we stop all traffic on legacy drivers.
    - New features and bug fixes will only be available on the new connectors.

## What should I do if I encounter the feature gaps and errors/ bugs that are preventing me from migrating to the new connectors?

If you encounter any feature gaps while migrating from legacy connectors, please review our connector documentation to check if it’s a known limitation. Additionally, send us an email at **dfconnectorupgrade@microsoft.com** with a description of the feature gap. 

If you encounter any errors or bugs while migrating from legacy connectors, please contact our Microsoft support team and open a support ticket. Be sure to include detailed information about the connector, the error encountered, and your use case.

Our Azure Data Factory team will assist you and ensure a smooth transition to the new connectors. We invite you to fill out this [form](https://forms.office.com/pages/responsepage.aspx?id=v4j5cvGGr0GRqy180BHbR94fEtK94M9FsNIwB3-nUTtUQTFGMjVFNkNEVkFaTEJQMUVaQlc3TlRDVi4u&route=shorturl) to help us better understand your needs and explore possible solutions.

## Related content

- [Planned connector deprecations for Azure Data Factory](connector-deprecation-plan.md)

