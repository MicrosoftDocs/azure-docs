---
# Mandatory fields.
title: Use Azure Resource Health
titleSuffix: Azure Digital Twins
description: See how to use Azure Resource Health to check the health of your Azure Digital Twins instance.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 10/6/2020
ms.topic: troubleshooting
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Troubleshooting Azure Digital Twins: Resource health

## Use Azure Resource Health

Use Azure Resource Health to monitor whether your Azure Digital Twins instance is up and running. You can also learn whether a regional outage is impacting the health of your instance. To understand specific details about the health state of your Azure instance, we recommend that you [use Azure Monitor](troubleshoot-metrics.md).

Azure Digital Twins indicates health at a regional level. If a regional outage impacts your instance, the health status shows as **Unknown**. To learn more, see [Resource types and health checks in Azure resource health](../service-health/resource-health-checks-resource-types.md).

To check the health of your instance, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com).

2. Navigate to **Service Health** > **Resource health**.

3. From the drop-down boxes, select your subscription then select **Azure Digital Twins** as the resource type.

To learn more about how to interpret health data, see [Azure resource health overview](../service-health/resource-health-overview.md).

## Next steps

Read about other ways to monitor your Azure Digital Twins instance in the following articles:
* [*Troubleshooting: View metrics with Azure Monitor*](troubleshoot-metrics.md)
* [*Troubleshooting: Set up diagnostics*](troubleshoot-diagnostics.md).
* [*Troubleshooting: Set up alerts*](troubleshoot-alerts.md)
