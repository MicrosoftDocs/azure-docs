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
ms.date: 12/28/2020
ms.author: yelevin

---
# Map data fields to entities in Azure Sentinel 

> [!IMPORTANT]
>
> - The new version of the entity mapping feature is in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Introduction

Entity mapping is an integral part of the configuration of [scheduled query analytics rules](tutorial-detect-threats-custom.md). It enriches the rules' output (alerts and incidents) with essential information that serves as the building blocks of any investigative processes and remedial actions that follow.

The procedure detailed below is part of the analytics rule creation wizard. It's treated here independently to address the scenario of adding or changing entity mappings in an existing analytics rule.

<!-- 
## Prerequisites

To enable or disable this feature (these prerequisites are not required to use the feature):

- Your user must be a member of your organization's Azure Active Directory, and not a guest user.

- Your user must be assigned the **Global Administrator** or **Security Administrator** roles in Azure AD.

- Your user must be assigned at least one of the following **Azure roles** ([Learn more about Azure RBAC](roles.md)):
    - **Azure Sentinel Contributor** at the workspace or resource group levels.
    - **Log Analytics Contributor** at the resource group or subscription levels.

- Your workspace must not have any Azure resource locks applied to it. [Learn more about Azure resource locking](../azure-resource-manager/management/lock-resources.md). 
-->

## How to map entities

1. From the Azure Sentinel navigation menu, select **Analytics**.

1. Select a scheduled query rule and click **Edit**. Or create a new rule by clicking **Create &#10132; Scheduled query rule** at the top of the screen.

1. Click the **Set rule logic** tab.

1. In the **Alert enhancement** section, under **Entity mapping**, select an entity type from the **Entity type** drop-down list.

1. Select an **identifier** for the entity. Identifiers are attributes of an entity that can sufficiently identify it. Choose one from the **Identifier** drop-down list, and then choose a data field from the **Value** drop-down list that will correspond to the identifier. With some exceptions, the **Value** list is populated by the data fields in the table defined as the subject of the rule query.

    You can define **up to three identifiers** for a given entity. Some identifiers are required, others are optional. You must choose at least one required identifier. If you don't, a warning message will instruct you which identifiers are required.

    > [!NOTE]
    >
    > If you had previously defined entity mappings for this analytics rule using the previous version, those mappings appear in the query code. Entity mappings defined under the new version **do not appear in the query code**. Analytics rules can only support one version of entity mappings at a time. Therefore, any mapping you define here will cause **any** mappings defined in the query code to be **disregarded** when the query runs. 

1. Click **Add new entity** to map more entities. You can map **up to five entities** in a single analytics rule. You can also map more than one of the same type. For example, you can map two **IP** entities, one from a *source IP address* field and one from a *destination IP address* field. This way you can track them both.

    If you change your mind, or if you made a mistake, you can remove an entity mapping by clicking the trash can icon next to the entity drop-down list.

1. When you have finished mapping entities, click the **Review and create** tab. Once the rule validation is successful, click **Save**.

## Next steps
In this document, you learned how to map data fields to entities in Azure Sentinel analytics rules. To learn more about Azure Sentinel, see the following articles:
- Get the complete picture on [scheduled query analytics rules](tutorial-detect-threats-custom.md).
- Learn more about [entities in Azure Sentinel](entities-in-azure-sentinel.md).
