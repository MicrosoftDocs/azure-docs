---
title: Analyze your API security posture
description: Learn how to analyze your API security posture with Defender for APIs
author: elazark
ms.author: elkrieger
ms.service: defender-for-cloud
ms.topic: conceptual
ms.date: 03/23/2023
---
# Review your API security posture

This article describes how to review the security posture for APIs protected by the [Microsoft Defender for APIs](defender-for-apis-introduction.md) plan in Microsoft Defender for Cloud. Defender for APIs is currently in preview.

## Before you start

[Onboard your API resources](defender-for-apis-deploy.md) to Defender for APIs.

## View recommendations and runtime alerts

1. In the Defender for Cloud portal, select **Workload protections**.
1. Select **API security**.
1. In the **API Security** dashboard,  drill down into API collections.  

    :::image type="content" source="media/defender-for-apis-posture/api-collection.png" alt-text="Page for drilling into API collections.":::

1. In the API collection page, to drill down into an API endpoint, in the endpoint row, select the ellipses (...) > **View resource**.

    :::image type="content" source="media/defender-for-apis-posture/view-resource.png" alt-text="Click the button to view the details for an API endpoint.":::

1. In the **Resource health** page > **Recommendations** for the API endpoint, review recommendation details and status.

    :::image type="content" source="media/defender-for-apis-posture/endpoint-health.png" alt-text="Review the health of an API endpoint, and get recommendations.":::

1. In **Resource health** page > **Alerts** for the API endpoint, review alerts for the endpoint. Defender for Endpoint monitors API traffic to the endpoints, to provide runtime protection against suspicious behavior and malicious attacks.

## Create sample security alerts

In Defender for Cloud you can use sample alerts to evaluate your Defender for Cloud plans, and validate your security configuration. [Follow these instructions](alert-validation.md#generate-sample-security-alerts) to set up sample alerts, and selecting the relevant APIs within your subscriptions.

## Explore risks with Cloud Security Explorer 

1. In the Defender for Cloud portal, select **Cloud Security Explorer**.
1. You can build your own query, or select one of the API query templates > **Open query**.
1. When you open a predefined query it's populated automatically and can be tweaked as needed. For example, if you select the *Unused APIs that contain sensitive data* template, you get these prepopulated fields. 

    :::image type="content" source="media/defender-for-apis-posture/predefined-query.png" alt-text="Page showing a predefined query for APIs.":::

1. Select **Search**. The search result displays each API resources with its associated insights, so that you can review, prioritize, and fix any issues.

    :::image type="content" source="media/defender-for-apis-posture/api-insights.png" alt-text="Page showing API insights.":::


## Next steps



