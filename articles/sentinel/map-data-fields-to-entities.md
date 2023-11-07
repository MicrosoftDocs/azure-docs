---
title: Map data fields to Microsoft Sentinel entities | Microsoft Docs
description: Map data fields in tables to Microsoft Sentinel entities in analytics rules, for better incident information
author: yelevin
ms.topic: how-to
ms.date: 04/26/2022
ms.author: yelevin
ms.custom: ignite-fall-2021
---

# Map data fields to entities in Microsoft Sentinel 

> [!IMPORTANT]
>
> - See "[Notes on the new version](#notes-on-the-new-version)" at the end of this document for important information about backward compatibility and differences between the new and old versions of entity mapping.

## Introduction

Entity mapping is an integral part of the configuration of [scheduled query analytics rules](detect-threats-custom.md). It enriches the rules' output (alerts and incidents) with essential information that serves as the building blocks of any investigative processes and remedial actions that follow.

The procedure detailed below is part of the analytics rule creation wizard. It's treated here independently to address the scenario of adding or changing entity mappings in an existing analytics rule.

## How to map entities

1. From the Microsoft Sentinel navigation menu, select **Analytics**.

1. Select a scheduled query rule and select **Edit** from the details pane. Or create a new rule by clicking **Create > Scheduled query rule** at the top of the screen.

1. Select the **Set rule logic** tab. If a new rule, type a query in the **Rule query** window.

1. In the **Alert enhancement** section, expand **Entity mapping**.

    :::image type="content" source="media/map-data-fields-to-entities/alert-enrichment.png" alt-text="Expand entity mapping":::

1. In the now-expanded **Entity mapping** section, select **Add new entity**.

    :::image type="content" source="media/map-data-fields-to-entities/add-new-entity.png" alt-text="Screenshot shows how to add a new entity.":::

1. Select an entity type from the **Entity** drop-down list.

    :::image type="content" source="media/map-data-fields-to-entities/choose-entity-type.png" alt-text="Choose an entity type":::

1. Select an **identifier** for the entity. Identifiers are attributes of an entity that can sufficiently identify it. Choose one from the **Identifier** drop-down list, and then choose a data field from the **Value** drop-down list that will correspond to the identifier. With some exceptions, the **Value** list is populated by the data fields in the table defined as the subject of the rule query.

    You can define **up to three identifiers** for a given entity mapping. Some identifiers are required, others are optional. You must choose at least one required identifier. If you don't, a warning message will instruct you which identifiers are required. For best results&mdash;for maximum unique identification&mdash;you should use **strong identifiers** whenever possible, and using multiple strong identifiers will enable greater correlation between data sources. See the full list of available [entities and identifiers](entities-reference.md).

    :::image type="content" source="media/map-data-fields-to-entities/map-entities.png" alt-text="Map fields to entities":::

1. Select **Add new entity** to map more entities. You can define **up to ten entity mappings** in a single analytics rule. You can also map more than one of the same type. For example, you can map two **IP** entities, one from a *source IP address* field and one from a *destination IP address* field. This way you can track them both.

    If you change your mind, or if you made a mistake, you can remove an entity mapping by clicking the trash can icon next to the entity drop-down list.

1. When you have finished mapping entities, click the **Review and create** tab. Once the rule validation is successful, click **Save**.

> [!NOTE]
> - ***Up to 500 entities collectively* can be identified in a single alert, divided equally across all entity mappings defined in the rule**.
>   - For example, if two entity mappings are defined in the rule, each mapping can identify up to 250 entities; if five mappings are defined, each one can identify up to 100 entities, and so on.
>   - Multiple mappings of a single entity type (say, source IP and destination IP) each count separately.
>   - If an alert contains items in excess of this limit, those excess items will not be recognized and extracted as entities.
>
> - **The size limit for the entire *entities* area of an alert (the *Entities* field) is *64 KB***.
>   - *Entities* fields that grow larger than 64 KB will be truncated. As entities are identified, they are added to the alert one by one until the field size reaches 64 KB, and any entities yet unidentified are dropped from the alert.

## Notes on the new version

- As the new version is now generally available (GA), the feature-flag workaround to use the old version is no longer available. 

- If you had previously defined entity mappings for this analytics rule using the old version, they will be automatically converted to the new version.

## Next steps

In this document, you learned how to map data fields to entities in Microsoft Sentinel analytics rules. To learn more about Microsoft Sentinel, see the following articles:

- Get the complete picture on [scheduled query analytics rules](detect-threats-custom.md).
- Learn more about [entities in Microsoft Sentinel](entities.md).



