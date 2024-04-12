---
title: Set up continuous export to an event hub behind a firewall
description: Learn how to set up continuous export of Microsoft Defender for Cloud security alerts and recommendations to an event hub behind a firewall.
author: dcurwin
ms.author: dacurwin
ms.topic: how-to
ms.date: 03/20/2024
#customer intent: As a security analyst, I want to learn how to set up continuous export of alerts and recommendations to an event hub behind a firewall so that I can analyze the data in Log Analytics or Azure Event Hubs.
---

# Set up continuous export to an event hub behind a firewall

In a situation where an event hub is behind a firewall, you can enable continuous export as a trusted service so that you can send data to the event hub.

## Prerequisites

- [Set up continuous export in the Azure portal](continuous-export.md) or [set up continuous export with Azure Policy](continuous-export-azure-policy.md) or [set up continuous export with REST API](continuous-export-rest-api.md).

## Set up continuous export to the eventhub

You can enable continuous export as a trusted service so that you can send data to an event hub that has Azure Firewall enabled.

**To grant access to continuous export as a trusted service**:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Go to **Microsoft Defender for Cloud** > **Environmental settings**.

1. Select the relevant resource.

1. Select **Continuous export**.

1. Select **Export as a trusted service**.

    :::image type="content" source="media/continuous-export-event-hub-firewall/export-as-trusted.png" alt-text="Screenshot that shows where the checkbox is located to select export as trusted service.":::

## Add the relevant role assignment to the destination event hub.

To add the relevant role assignment to the destination event hub:

1. Go to the selected event hub.

1. In the resource menu, select **Access control (IAM)** > **Add role assignment**.

    :::image type="content" source="media/continuous-export-event-hub-firewall/add-role-assignment.png" alt-text="Screenshot that shows the Add role assignment button." lightbox="media/continuous-export-event-hub-firewall/add-role-assignment.png":::

1. Select **Azure Event Hubs Data Sender**.

1. Select the **Members** tab.

1. Choose **+ Select members**.

1. Search for and then select **Windows Azure Security Resource Provider**.

    :::image type="content" source="media/continuous-export-event-hub-firewall/windows-security-resource.png" alt-text="Screenshot that shows you where to enter and search for Microsoft Azure Security Resource Provider." lightbox="media/continuous-export-event-hub-firewall/windows-security-resource.png":::

1. Select **Review + assign**.

## Next step

> [!div class="nextstepaction"]
> [View exported data in Azure Monitor](continuous-export-view-data.md)
