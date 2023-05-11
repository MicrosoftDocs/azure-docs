---
title: Validate your Microsoft Defender for APIs alerts
description: Learn how to validate your Microsoft Defender for APIs alerts
ms.service: defender-for-cloud
ms.topic: conceptual
ms.date: 05/11/2023
ms.custom: references_regions
---

# Validate your Microsoft Defender for APIs alerts

Microsoft Defender for APIs offers full lifecycle protection, detection, and response coverage for APIs that are published in Azure API Management. One of the main capabilities is the ability to detect exploits of the Open Web Application Security Project (OWASP) API Top 10 vulnerabilities through runtime observations of anomalies using machine learning-based and rule-based detections.

This page will walk you through the steps to trigger an alert for one of your API endpoints through Defender for APIs. In this scenario, the alert will be for the detection of a suspicious user agent.

## Prerequisites

- [Create a new Azure API Management service instance in the Azure portal](../api-management/get-started-create-service-instance.md)

- [Import and publish your first API](../api-management/import-and-publish.md)

- [Onboard Defender for APIs](defender-for-apis-deploy.md)

## Simulate an alert

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **API Management services**.

    :::image type="content" source="media/defender-for-apis-validation/api-management.png" alt-text="Screenshot that shows you where on the Azure portal to search for and select API Management service.":::

1. Select **APIs**.

    :::image type="content" source="media/defender-for-apis-validation/apis-section.png" alt-text="Screenshot that shows where to select APIs from the menu.":::

1. Select an API endpoint.

    :::image type="content" source="media/defender-for-apis-validation/api-endpoint.png" alt-text="Screenshot that shows where to select an API endpoint.":::

1. Navigate to the **Test** tab.

1. Select an API operation.