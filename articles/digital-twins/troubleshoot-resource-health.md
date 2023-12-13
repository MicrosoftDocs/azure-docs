---
# Mandatory fields.
title: Troubleshoot resource health
titleSuffix: Azure Digital Twins
description: Learn how to use Azure Resource Health to check the health of your Azure Digital Twins instance.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 11/1/2022
ms.topic: how-to
ms.service: digital-twins
ms.custom: contperf-fy22q1

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Troubleshoot Azure Digital Twins resource health

[Azure Service Health](../service-health/index.yml) is a suite of experiences that can help you diagnose and get support for service problems that affect your Azure resources. It contains resource health, service health, and status information, and reports on both current and past health information.

## Use Azure Resource Health

[Azure Resource Health](../service-health/resource-health-overview.md) can help you monitor whether your Azure Digital Twins instance is up and running. You can also use it to learn whether a regional outage is impacting the health of your instance.

To check the health of your instance, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to your Azure Digital Twins instance. You can find it by typing its name into the portal search bar. 

2. From your instance's menu, select **Resource health** under **Support + troubleshooting**. This will take you to the page for viewing resource health history. 

    :::image type="content" source="media/troubleshoot-resource-health/resource-health.png" alt-text="Screenshot showing the 'Resource health' page. There is a 'Health history' section showing a daily report from the last nine days.":::

In the image above, this instance is showing as **Available**, and has been for the past nine days. To learn more about the Available status and the other status types that may appear, see [Resource Health overview](../service-health/resource-health-overview.md).

You can also learn more about the different checks that go into resource health for different types of Azure resources in [Resource types and health checks in Azure resource health](../service-health/resource-health-checks-resource-types.md).

## Use Azure Service Health

[Azure Service Health](../service-health/service-health-overview.md) can help you check the health of the entire Azure Digital Twins service in a certain region, and be aware of events like ongoing service issues and upcoming planned maintenance.

To check service health, sign in to the [Azure portal](https://portal.azure.com) and navigate to the **Service Health** service. You can find it by typing "service health" into the portal search bar. 

You can then filter service issues by subscription, region, and service.

For more information on using Azure Service Health, see [Service Health overview](../service-health/service-health-overview.md).

## Use Azure status

The [Azure status](../service-health/azure-status-overview.md) page provides a global view of the health of Azure services and regions. While Azure Service Health and Azure Resource Health are personalized to your specific resource, Azure status has a larger scope and can be useful to understand incidents with wide-ranging impact.

To check Azure status, navigate to the [Azure status](https://azure.status.microsoft/status/) page. The page displays a table of Azure services along with health indicators per region. You can view Azure Digital Twins by searching for its table entry on the page.

For more information on using the Azure status page, see [Azure status overview](../service-health/azure-status-overview.md).

## Next steps

Read about other ways to monitor your Azure Digital Twins instance in [Monitor your Azure Digital Twins instance](how-to-monitor.md).
