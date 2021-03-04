---
# Mandatory fields.
title: Understand your resource health
titleSuffix: Azure Digital Twins
description: See how to use Azure Resource Health to check the health of your Azure Digital Twins instance.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 10/6/2020
ms.topic: how-to
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Troubleshooting Azure Digital Twins: Resource health

[Azure Resource Health](../service-health/resource-health-overview.md) helps you diagnose and get support for service problems that affect your Azure resources. It reports on the current and past health of your resources.

This article shows you how to get **resource health** information for your Azure Digital Twins instances.

## Use Azure Resource Health

Azure Resource Health can help you monitor whether your Azure Digital Twins instance is up and running. You can also use it to learn whether a regional outage is impacting the health of your instance.

To check the health of your instance, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to your Azure Digital Twins instance. You can find it by typing its name into the portal search bar. 

2. From your instance's menu, select _**Resource health**_ under *Support + troubleshooting*. This will take you to the page for viewing resource health history. 

    :::image type="content" source="media/troubleshoot-resource-health/resource-health.png" alt-text="Screenshot showing the 'Resource health' page. There is a 'Health history' section showing a daily report from the last nine days. Each day shows a status of 'Available.'":::

In the image above, this instance is showing as *Available*, and has been for the past nine days. To learn more about the *Available* status and the other status types that may appear, see [*Azure resource health overview*](../service-health/resource-health-overview.md).

You can also learn more about the different checks that go into resource health for different types of Azure resources in [*Resource types and health checks in Azure resource health*](../service-health/resource-health-checks-resource-types.md).

## Next steps

Read about other ways to monitor your Azure Digital Twins instance in the following articles:
* [*Troubleshooting: View metrics with Azure Monitor*](troubleshoot-metrics.md)
* [*Troubleshooting: Set up diagnostics*](troubleshoot-diagnostics.md).
* [*Troubleshooting: Set up alerts*](troubleshoot-alerts.md)
