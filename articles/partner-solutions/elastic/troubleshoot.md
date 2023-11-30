---
title: Troubleshooting Elastic Cloud (Elasticsearch) - An Azure Native ISV Service
description: This article provides information about troubleshooting Elastic integration with Azure
ms.topic: conceptual
ms.date: 10/06/2023
author: flang-msft
ms.author: franlanglois
---

# Troubleshooting Elastic Cloud (Elasticsearch) - An Azure Native ISV Service

This document contains information about troubleshooting your solutions that use Elastic.

## Unable to create an Elastic resource

Only users who have *Owner* or *Contributor* access on the Azure subscription can set up the Elastic resource. [Confirm that you have the appropriate access](../../role-based-access-control/check-access.md).

## Logs not being emitted to Elastic

- Only resources listed in [Azure Monitor resource log categories](../../azure-monitor/essentials/resource-logs-categories.md) emit logs to Elastic. To verify whether the resource is emitting logs to Elastic:

   1. Navigate to [Azure diagnostic setting](../../azure-monitor/essentials/diagnostic-settings.md) for the resource.
   1. Verify that there's a diagnostic setting option available.

   :::image type="content" source="media/troubleshoot/check-diagnostic-setting.png" alt-text="Screenshot of verify diagnostic setting.":::

- Resource doesn't support sending logs. Only resource types with monitoring log categories can be configured to send logs. For more information, see [supported categories](../../azure-monitor/essentials/resource-logs-categories.md).

- Limit of five diagnostic settings reached. Each Azure resource can have a maximum of five diagnostic settings. For more information, see [diagnostic settings](../../azure-monitor/essentials/diagnostic-settings.md?tabs=portal)

- Export of Metrics data isn't supported currently by the partner solutions under Azure Monitor diagnostic settings.

## Marketplace Purchase errors

[!INCLUDE [marketplace-purchase-errors](../includes/marketplace-purchase-errors.md)]

## Get support

To contact support about the Elastic integration with Azure, select the **New Support request** in the left pane. Select **Open an Elastic Support ticket**.

:::image type="content" source="media/troubleshoot/open-ticket.png" alt-text="Screenshot of opening a support ticket for the Elastic integration with Azure.":::

In the Elastic site, open a support request.

:::image type="content" source="media/troubleshoot/elastic-support.png" alt-text="Screenshot of opening a support ticket on the Elastic site.":::

## Suggest a feature

To suggest a new feature for the Elastic integration with Azure, select the **Suggest a feature** link at the top of the resource overview page.

:::image type="content" source="media/troubleshoot/suggest-a-feature.png" alt-text="Screenshot of suggesting a feature for the Elastic integration with Azure.":::

This link takes you to the **Developer community forum** where you can suggest a new feature. You can also view, upvote, or comment on feature suggestions from other customers.

## Next steps

- Learn about [managing your instance](manage.md) of Elastic
- Get started with Elastic Cloud (Elasticsearch) - An Azure Native ISV Service on

    > [!div class="nextstepaction"]
    > [Azure portal](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Elastic%2Fmonitors)

    > [!div class="nextstepaction"]
    > [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/elastic.ec-azure-pp?tab=Overview)
