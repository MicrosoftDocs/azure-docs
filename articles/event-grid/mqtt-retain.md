---
title: MQTT Retain in Azure Event Grid (Preview)
description: Learn how Azure Event Grid supports MQTT Retain to store the last known good value of a topic so that new subscribers get the latest message instantly.
#customer intent: As a developer, I want to understand how MQTT Retain works in Azure Event Grid so that I can ensure new subscribers get the latest message instantly.  
ms.topic: concept-article
ms.date: 07/30/2025
ms.custom:
  - ai-gen-docs-bap
  - ai-gen-title
  - ai-seo-date:07/30/2025
  - ai-gen-description
---

# MQTT Retain support in Azure Event Grid (preview)

The Message Queuing Telemetry Transport (MQTT) Retain feature in Azure Event Grid (preview) ensures that the last known good value of a topic is stored and readily available for new subscribers. This capability allows new clients to instantly receive the most recent message upon connection, eliminating the need to wait for the next publish. It's beneficial in scenarios such as device state reporting, control signals, or configuration data, where timely access to the latest message is critical.

This article provides an overview of how MQTT Retain works, its billing implications, storage limits, message deletion methods, and Retain management considerations.

> [!NOTE]
> This feature is currently in preview.

## Billing

Each retained publish counts as two MQTT operations: one for processing the message, and one for storing it.

## Storage limits

- Up to 640 MB or 10,000 retained messages per throughput unit (TU).
- Maximum size per retained message is 64 KB.

For larger needs, contact Azure Support.

## Message deletion

- **MQTT 3.1.1**: Publish an empty payload to the topic.
- **MQTT 5.0**: Set expiry or send an empty message to remove it.

## Retain management

- Azure portal support for listing retained messages is currently not available.
- Preview doesn't include backfilling retained data for existing namespaces.
- To enable MQTT Retain on an existing namespace, do one of the following operations:

    - Perform a control plane operation, like TU updates.
    - Add or update the `Retain` tag on the namespace.