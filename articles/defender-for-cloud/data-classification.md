---
title: Classify APIs with sensitive data exposure
description: Learn how to monitor your APIs for sensitive data exposure.
ms.date: 11/05/2023
author: dcurwin
ms.author: dacurwin
ms.topic: conceptual
---

# Classify APIs with sensitive data exposure

Once your APIs are onboarded, Defender for APIs starts monitoring your APIs for sensitive data exposure. APIs are classified with both built-in and custom sensitive information types and labels as defined by your organization's Microsoft Information Protection (MIP) Purview governance rules. If you do not have MIP Purview configured, APIs are classified with the Microsoft Defender for Cloud default classification rule set with the following features.

Within Defender for APIs inventory experience, you can search for sensitivity labels or sensitive information types by adding a filter to identify APIs with custom classifications and information types.

:::image type="content" source="media/data-classification/api-inventory.png" alt-text="Screenshot showing API inventory list." lightbox="media/data-classification/api-inventory.png":::

## Explore API exposure through attack paths

When the Defender Cloud Security Posture Management (CSPM) plan is enabled, API attack paths let you discover and remediate the risk of API data
exposure. For more information, see [Data security in Defender CSPM](concept-data-security-posture.md#data-security-in-defender-cspm).

1. Select the API attack path **Internet exposed APIs that are unauthenticated carry sensitive data** and review the data path:

   :::image type="content" source="media/data-classification/attack-path-analysis.png" alt-text="Screenshot showing attack path analysis." lightbox="media/data-classification/attack-path-analysis.png":::

1. View the attack path details by selecting the attack path published.
1. Select the **Insights** resource.
1. Expand the insight to analyze further details about this attack path:

   :::image type="content" source="media/data-classification/insights.png" alt-text="Screenshot showing attack path insights." lightbox="media/data-classification/insights.png":::

1. For risk mitigation steps, open **Active Recommendations** and resolve unhealthy recommendations for the API endpoint in scope.

## Explore API data exposure through Cloud Security Graph

When the Defender Cloud Security Posture Management CSPM plan is enabled, you can view sensitive APIs data exposure and identify the APIs labels according to your sensitivity settings by adding the following filter:
  
:::image type="content" source="media/data-classification/computer-description.png" alt-text="Screenshot of a computer Description automatically generated." lightbox="media/data-classification/computer-description.png":::

## Explore sensitive APIs in security alerts

With Defender for APIs and data sensitivity integration into API security alerts, you can prioritize API security incidents involving sensitive data exposure. For more information, see [Defender for APIs alerts](defender-for-apis-introduction.md#detecting-threats).

In the alert's extended properties, you can find sensitivity scanning findings for the sensitivity context:

- **Sensitivity scanning time UTC**: when the last scan was performed.
- **Top sensitivity label**: the most sensitive label found in the API endpoint.
- **Sensitive information types**: information types that were found, and whether they are based on custom rules.
- **Sensitive file types**: the file types of the sensitive data.

:::image type="content" source="media/data-classification/alert-details.png" alt-text="Screenshot showing alert details." lightbox="media/data-classification/alert-details.png":::

## Next steps

[Learn about](defender-for-apis-introduction.md) Defender for APIs.
