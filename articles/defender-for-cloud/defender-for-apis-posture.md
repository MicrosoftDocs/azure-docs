---
title: Analyze your API security posture
description: Learn how to analyze your API security alerts and posture with Defender for APIs
author: elazark
ms.author: elkrieger
ms.service: defender-for-cloud
ms.topic: conceptual
ms.date: 03/23/2023
---
# Investigate API recommendations, alerts, and risks

This article describes how to review security settings, security posture recommendations, security alerts, and risk insights for APIs protected by [Microsoft Defender for APIs](defender-for-apis-introduction.md). Defender for APIs is currently in preview.

## Before you start

- [Onboard your API resources](defender-for-apis-deploy.md) to Defender for APIs.
- To explore security risks within your organization using Cloud Security Explorer, the Defender Cloud Security Posture Management (CSPM) plan must be enabled. [Learn more](concept-cloud-security-posture-management.md).

## View recommendations and runtime alerts

1. In the Defender for Cloud portal, select **Workload protections**.
1. Select **API security**.
1. In the **API Security** dashboard, select an API collection to drill down.  
1. In the API collection page, to drill down into an API endpoint, select the ellipses (...) > **View resource**.
1. Review API endpoint status details. [Learn more about status settings](defender-for-apis-introduction.md#reviewing-inventory-and-insights).
1. In the **Resource health** page > **Recommendations** for the endpoint, review recommendation details and status.
1. In **Alerts**, review security alerts for the endpoint. Defender for Endpoint monitors API traffic to and and from endpoints, to provide runtime protection against suspicious behavior and malicious attacks.

## Create sample security alerts

In Defender for Cloud you can use sample alerts to evaluate your Defender for Cloud plans, and validate your security configuration. [Follow these instructions](alert-validation.md#generate-sample-security-alerts) to set up sample alerts, and select the relevant APIs within your subscriptions.

## Explore risks with Cloud Security Explorer

In Defender CSPM, [Cloud Security Graph](concept-attack-path.md) collects data to provide a map of assets and connections across organization, to expose security risks, vulnerabilities, and possible lateral movement paths.

When the Defender CSPM plan is enabled together with Defender for APIs, you can use Cloud Security Explorer to query Cloud Security Graph, to identify, review and analyze API security risks across your organization. 

1. In the Defender for Cloud portal, select **Cloud Security Explorer**.
1. You can build your own query, or select the API query template.
    1. To build your own query, in **What would you like to search?** select the **APIs** category. You can query:
        - API collections that contain one or more API endpoints.
        - API endpoints for Azure API Management operations.
    
    The search result display each API resources with its associated insights, so that you can review, prioritize, and fix any issues.

    1. Alternatively, select the predefined query **Unauthenticated API endpoints containing sensitive data are outside the virtual network** > **Open query**. The query returns all unauthenticated API endpoints that contain sensitive data and aren't part of the Azure API management network.
    
    :::image type="content" source="media/defender-for-apis-posture/predefined-query.png" alt-text="Page showing predefined API query.":::
    

## Next steps

[Manage](defender-for-apis-manage.md) your Defender for APIs deployment.



