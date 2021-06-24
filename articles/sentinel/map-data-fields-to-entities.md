---
title: Map data fields to Azure Sentinel entities | Microsoft Docs
description: Map data fields in tables to Azure Sentinel entities in analytics rules, for better incident information
services: sentinel
documentationcenter: na
author: yelevin
manager: rkarlin
editor: ''

ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 02/10/2021
ms.author: yelevin

---
# Map data fields to entities in Azure Sentinel 

> [!IMPORTANT]
>
> - The new version of the entity mapping feature is in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

> [!IMPORTANT]
>
> - See [Notes on the new version](#notes-on-the-new-version) at the end of this document for important information about backward compatibility and differences between the new and old versions of entity mapping.

## Introduction

Entity mapping is an integral part of the configuration of [scheduled query analytics rules](tutorial-detect-threats-custom.md). It enriches the rules' output (alerts and incidents) with essential information that serves as the building blocks of any investigative processes and remedial actions that follow.

The procedure detailed below is part of the analytics rule creation wizard. It's treated here independently to address the scenario of adding or changing entity mappings in an existing analytics rule.

## How to map entities

1. From the Azure Sentinel navigation menu, select **Analytics**.

1. Select a scheduled query rule and click **Edit**. Or create a new rule by clicking **Create > Scheduled query rule** at the top of the screen.

1. Click the **Set rule logic** tab. 

1. In the **Alert enrichment (Preview)** section, expand **Entity mapping**.

    :::image type="content" source="media/map-data-fields-to-entities/alert-enrichment.png" alt-text="Expand entity mapping":::

1. In the now-expanded **Entity mapping** section, select an entity type from the **Entity type** drop-down list.

    :::image type="content" source="media/map-data-fields-to-entities/choose-entity-type.png" alt-text="Choose an entity type":::

1. Select an **identifier** for the entity. Identifiers are attributes of an entity that can sufficiently identify it. Choose one from the **Identifier** drop-down list, and then choose a data field from the **Value** drop-down list that will correspond to the identifier. With some exceptions, the **Value** list is populated by the data fields in the table defined as the subject of the rule query.

    You can define **up to three identifiers** for a given entity. Some identifiers are required, others are optional. You must choose at least one required identifier. If you don't, a warning message will instruct you which identifiers are required. For best results - for maximum unique identification - you should use **strong identifiers** whenever possible, and using multiple strong identifiers will enable greater correlation between data sources. See the full list of available [entities and identifiers](entities-reference.md).

    :::image type="content" source="media/map-data-fields-to-entities/map-entities.png" alt-text="Map fields to entities":::

1. Click **Add new entity** to map more entities. You can map **up to five entities** in a single analytics rule. You can also map more than one of the same type. For example, you can map two **IP** entities, one from a *source IP address* field and one from a *destination IP address* field. This way you can track them both.

    If you change your mind, or if you made a mistake, you can remove an entity mapping by clicking the trash can icon next to the entity drop-down list.

1. When you have finished mapping entities, click the **Review and create** tab. Once the rule validation is successful, click **Save**.

## Notes on the new version

- If you had previously defined entity mappings for this analytics rule using the old version, those mappings appear in the query code. Entity mappings defined under the new version **do not appear in the query code**. Analytics rules can only support one version of entity mappings at a time, and the new version takes precedence. Therefore, any single mapping you define here will cause **any and all** mappings defined in the query code to be **disregarded** when the query runs. 

- If you still need to use the **old version** of entity mapping (as long as the new version is still in preview), you can still access it using a feature flag in the URL. Place your cursor between `https://portal.azure.com/` and `#blade`, and insert the text `?feature.EntityMapping=false`.

  - The limits of the old version will continue to apply. You can map only the user, host, IP address, URL, and file hash entities, and only one of each.

  - You must **remove** any entity mappings created using the new version **before** you return to the old version, otherwise any entity mappings that use the old version **will not work**.

- Once the new version of entity mapping is in General Availability, it will no longer be possible to use the old version. It is highly recommended that you migrate your old entity mappings to the new version.


## Next steps

In this document, you learned how to map data fields to entities in Azure Sentinel analytics rules. To learn more about Azure Sentinel, see the following articles:
- Get the complete picture on [scheduled query analytics rules](tutorial-detect-threats-custom.md).
- Learn more about [entities in Azure Sentinel](entities-in-azure-sentinel.md).
