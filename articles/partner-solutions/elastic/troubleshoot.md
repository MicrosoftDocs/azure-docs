---
title: Troubleshooting Elastic - Azure partner solutions
description: This article provides information about troubleshooting Elastic integration with Azure
ms.service: partner-services
ms.topic: conceptual
ms.date: 05/20/2021
author: tfitzmac
ms.author: tomfitz
---

# Troubleshooting Elastic integration with Azure

This document contains information about troubleshooting your solutions that use Elastic.

## Unable to create an Elastic resource

Elastic integration with Azure can only be set up by users who have *Owner* access on the Azure subscription. [Confirm that you have the appropriate access](../../role-based-access-control/check-access.md).

## Logs not being emitted to Elastic

Only resources listed in [Azure Monitor resource log categories](../../azure-monitor/essentials/resource-logs-categories.md) emit logs to Elastic. To verify whether the resource is emitting logs to Elastic, navigate to [Azure diagnostic setting](../../azure-monitor/essentials/diagnostic-settings.md) for the resource. Verify that there's a diagnostic setting option available.

:::image type="content" source="media/troubleshoot/check-diagnostic-setting.png" alt-text="Verify diagnostic setting":::

## Purchase errors

* Purchase fails because a valid credit card isn't connected to the Azure subscription or a payment method isn't associated with the subscription.

  Use a different Azure subscription. Or, add or update the credit card or payment method for the subscription. For more information, see [updating the credit and payment method](../../cost-management-billing/manage/change-credit-card.md).

* The EA subscription doesn't allow Marketplace purchases.

  Use a different subscription. Or, check if your EA subscription is enabled for Marketplace purchase. For more information, see [Enable Marketplace purchases](../../cost-management-billing/manage/ea-azure-marketplace.md#enabling-azure-marketplace-purchases).

## Get support

To contact support about the Elastic integration with Azure, select the **New Support request** in the left pane. Select **Open an Elastic Support ticket**.

:::image type="content" source="media/troubleshoot/open-ticket.png" alt-text="Open support ticket":::

In the Elastic site, open a support request.

:::image type="content" source="media/troubleshoot/elastic-support.png" alt-text="Open Elastic support":::

## Next steps

Learn about [managing your instance](manage.md) of Elastic.