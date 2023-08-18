---
title: Surface custom details in Microsoft Sentinel alerts | Microsoft Docs
description: Extract and surface custom event details in alerts in Microsoft Sentinel analytics rules, for better and more complete incident information
author: yelevin
ms.topic: how-to
ms.date: 04/26/2022
ms.author: yelevin
ms.custom: ignite-fall-2021
---

# Surface custom event details in alerts in Microsoft Sentinel 

## Introduction

[Scheduled query analytics rules](detect-threats-custom.md) analyze **events** from data sources connected to Microsoft Sentinel, and produce **alerts** when the contents of these events are significant from a security perspective. These alerts are further analyzed, grouped, and filtered by Microsoft Sentinel's various engines and distilled into **incidents** that warrant a SOC analyst's attention. However, when the analyst views the incident, only the properties of the component alerts themselves are immediately visible. Getting to the actual content - the information contained in the events - requires doing some digging.

Using the **custom details** feature in the **analytics rule wizard**, you can surface event data in the alerts that are constructed from those events, making the event data part of the alert properties. In effect, this gives you immediate event content visibility in your incidents, enabling you to triage, investigate, draw conclusions, and respond with much greater speed and efficiency.

The procedure detailed below is part of the analytics rule creation wizard. It's treated here independently to address the scenario of adding or changing custom details in an existing analytics rule.

## How to surface custom event details

1. From the Microsoft Sentinel navigation menu, select **Analytics**.

1. Select a scheduled query rule and click **Edit**. Or create a new rule by clicking **Create > Scheduled query rule** at the top of the screen.

1. Click the **Set rule logic** tab.

1. In the **Alert enrichment** section, expand **Custom details**.

    :::image type="content" source="media/surface-custom-details-in-alerts/alert-enrichment.png" alt-text="Find and select custom details":::

1. In the now-expanded **Custom details** section, add key-value pairs corresponding to the details you want to surface:

    1. In the **Key** field, enter a name of your choosing that will appear as the field name in alerts.

    1. In the **Value** field, choose the event parameter you wish to surface in the alerts from the drop-down list. This list will be populated by values corresponding to the fields in the tables that are the subject of the rule query.
    
        :::image type="content" source="media/surface-custom-details-in-alerts/custom-details.png" alt-text="Add custom details":::

1. Click **Add new** to surface more details, repeating the last steps to define key-value pairs. 

    If you change your mind, or if you made a mistake, you can remove a custom detail by clicking the trash can icon next to the **Value** drop-down list for that detail.

1. When you have finished defining custom details, click the **Review and create** tab. Once the rule validation is successful, click **Save**.

    > [!NOTE]
    > 
    > **Service limits**
    > - You can define **up to 20 custom details** in a single analytics rule.
    >
    > - The size limit for all custom details, collectively, is **2 KB**.

## Next steps

In this document, you learned how to surface custom details in alerts using Microsoft Sentinel analytics rules. To learn more about Microsoft Sentinel, see the following articles:

- Get the complete picture on [scheduled query analytics rules](detect-threats-custom.md).
- Learn more about [entities in Microsoft Sentinel](entities.md).
