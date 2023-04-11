---
title: Analyze your API security posture
description: Learn how to analyze your API security alerts and posture with Defender for APIs
author: elazark
ms.author: elkrieger
ms.service: defender-for-cloud
ms.topic: conceptual
ms.date: 03/23/2023
---
# Review API security alerts and posture

This article describes how to review the security posture for APIs protected by the [Microsoft Defender for APIs](defender-for-apis-introduction.md) plan in Microsoft Defender for Cloud. Defender for APIs is currently in preview.

## Before you start

- [Onboard your API resources](defender-for-apis-deploy.md) to Defender for APIs.
- To explore security risks using Cloud Security Explorer, the Defender Cloud Security Posture Management (CSPM) plan must be enabled. [Learn more](concept-cloud-security-posture-management.md).

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

When you have the Defender Cloud Security Posture Management (CSPM) plan enabled together with Defender for APIs, you can review and analyze your API security risks and posture using Cloud Security Explorer to query [Cloud Security Graph](concept-attack-path.md). Cloud Security Graph collects data to provide a map of assets, connections within your organization, to expose risks, vulnerabilities, and lateral movement possibilities. 

1. In the Defender for Cloud portal, select **Cloud Security Explorer**.
1. You can build your own query, or select one of the API query templates > **Open query**.
    1. To build your own query, in **What would you like to search?** select the **APIs** category. Within **APIs**, you can query:
        - API collections that contain one or more API endpoints.
        - API endpoints for Azure API Management operations.
    1. Alternatively, you can use a predefined query that's populated automatically and can be tweaked as needed.
        - Predefined query: *Unauthenticated API endpoints containing sensitive data are outside the virtual network*.
        - This query returns all unauthenticated API endpoints that contain sensitive data and aren't part of the Azure API management network.

1. Select **Search**. The search result displays each API resources with its associated insights, so that you can review, prioritize, and fix any issues.

    :::image type="content" source="media/defender-for-apis-posture/api-insights.png" alt-text="Page showing API insights.":::


## Next steps

[Manage](defender-for-apis-manage.md) your Defender for APIs deployment.



