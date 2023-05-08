---
title: Investigate your API security findings and posture in Microsoft Defender for Cloud
description: Learn how to analyze your API security alerts and posture in Microsoft Defender for Cloud
author: elazark
ms.author: elkrieger
ms.service: defender-for-cloud
ms.topic: conceptual
ms.date: 03/23/2023
---
# Investigate API findings, recommendations, and alerts

This article describes how to investigate API security findings, alerts, and security posture recommendations for APIs protected by [Microsoft Defender for APIs](defender-for-apis-introduction.md). Defender for APIs is currently in preview.

## Before you start

- [Onboard your API resources](defender-for-apis-deploy.md) to Defender for APIs.
- To explore security risks within your organization using Cloud Security Explorer, the Defender Cloud Security Posture Management (CSPM) plan must be enabled. [Learn more](concept-cloud-security-posture-management.md).

## View recommendations and runtime alerts

1. In the Defender for Cloud portal, select **Workload protections**.
1. Select **API security (Preview)**.
1. In the **API Security** dashboard, select an API collection.

    :::image type="content" source="media/defender-for-apis-posture/api-collection-details.png" alt-text="Screenshot that shows the onboarded API collections."lightbox="media/defender-for-apis-posture/api-collection-details.png":::

1. In the API collection page, to drill down into an API endpoint, select the ellipses (...) > **View resource**.

     :::image type="content" source="media/defender-for-apis-posture/view-resource.png" alt-text="Screenshot that shows an API endpoint details." lightbox="media/defender-for-apis-posture/view-resource.png":::

1. In the **Resource health** page, review the endpoint settings.
1. In the **Recommendations** tab, review recommendation details and status.
1. In the **Alerts** tab review security alerts for the endpoint. Defender for Endpoint monitors API traffic to and from endpoints, to provide runtime protection against suspicious behavior and malicious attacks.

    :::image type="content" source="media/defender-for-apis-posture/resource-health.png" alt-text="Screenshot that shows the health of an endpoint." lightbox="media/defender-for-apis-posture/resource-health.png":::

## Create sample security alerts

In Defender for Cloud you can use sample alerts to evaluate your Defender for Cloud plans, and validate your security configuration. [Follow these instructions](alert-validation.md#generate-sample-security-alerts) to set up sample alerts, and select the relevant APIs within your subscriptions.

## Build queries in Cloud Security Explorer

In Defender CSPM, [Cloud Security Graph](concept-attack-path.md) collects data to provide a map of assets and connections across organization, to expose security risks, vulnerabilities, and possible lateral movement paths.

When the Defender CSPM plan is enabled together with Defender for APIs, you can use Cloud Security Explorer to query Cloud Security Graph, to identify, review and analyze API security risks across your organization. 

1. In the Defender for Cloud portal, select **Cloud Security Explorer**.
1. You can build your own query, or select the API query template.
    1. To build your own query, in **What would you like to search?** select the **APIs** category. You can query:
        - API collections that contain one or more API endpoints.
        - API endpoints for Azure API Management operations.

        :::image type="content" source="media/defender-for-apis-posture/api-insights.png" alt-text="Screenshot that shows the predefined API query." lightbox="media/defender-for-apis-posture/api-insights.png":::
    
    The search resultS display each API resource with its associated insights, so that you can review, prioritize, and fix any issues.

    Alternatively, you can select the predefined query **Unauthenticated API endpoints containing sensitive data are outside the virtual network** > **Open query**. The query returns all unauthenticated API endpoints that contain sensitive data and aren't part of the Azure API management network.
    
    :::image type="content" source="media/defender-for-apis-posture/predefined-query.png" alt-text="Screenshot that shows a predefined API query.":::
    

## Next steps

[Manage](defender-for-apis-manage.md) your Defender for APIs deployment.



