---
title: Enable Zone Redundancy for Workflows
description: Provide business continuity and disaster recovery for logic app workflows by setting up zone redundancy using availability zones in Azure.
services: azure-logic-apps
ms.suite: integration
ms.reviewers: estfan, shahparth, laveeshb, azla
ms.topic: how-to
ai.usage: ai-assisted
ms.update-cycle: 1095-days
ms.date: 04/27/2026
ms.custom: references_regions
#Customer intent: As an integration developer who works with Azure Logic Apps, I want to provide business continuity and disaster recovery for my logic app workflows by setting up zone redundancy with availability zones.
---

# Protect logic app workflows by enabling zone redundancy with availability zones

[!INCLUDE [logic-apps-sku-consumption-standard](../../includes/logic-apps-sku-consumption-standard.md)]

[!INCLUDE [reliability-az-description](~/reusable-content/ce-skilling/azure/includes/reliability/reliability-availability-zone-description-include.md)]

If you have business-critical logic app workflows, a regional datacenter failure might interrupt service and affect your integrations. *Zone redundancy* protects against this risk by automatically distributing workflow workloads across multiple *availability zones* in an Azure region. If one zone becomes unavailable, your workflows automatically continue running in the other zones.

For Consumption logic apps, zone redundancy is automatically enabled. You don't need to take any extra action. For Standard logic apps, enabling zone redundancy is a simple one-time setup during resource creation.

This guide shows how to set up zone redundancy for Standard logic apps.

## Prerequisites

- An Azure account and subscription. [Get a free Azure account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- Make sure that you understand zone redundancy support. When you create your logic app resource, make sure that you meet the requirements for availability zones, including support in a specific region.

  For more information, see [Reliability in Azure Logic Apps](/azure/reliability/reliability-logic-apps#resilience-to-availability-zone-failures).

- If you have a firewall or a restricted environment, you must allow traffic through all the IP addresses required by Azure Logic Apps, Azure-hosted managed connectors, and any custom connectors in the Azure region where you create your logic app workflows. New and existing IP addresses that support availability zone redundancy are published for Azure Logic Apps, managed connectors, and custom connectors.

  For more information, see:

  - [Firewall configuration: IP addresses and service tags](logic-apps-limits-and-config.md#firewall-ip-configuration)
  - [Inbound IP addresses for Azure Logic Apps](logic-apps-limits-and-config.md#inbound)
  - [Outbound IP addresses for Azure Logic Apps](logic-apps-limits-and-config.md#outbound)
  - [Outbound IP addresses for managed connectors and custom connectors](/connectors/common/outbound-ip-addresses)

## Limitations

With HTTP-based actions, certificates exported or created with AES256 encryption don't work for authenticating client certificates. The same certificates also don't work for OAuth authentication.

## Set up zone redundancy for your logic app

For Consumption logic apps, zone redundancy is automatically enabled. You don't need to take any other steps to enable zone redundancy.

For Standard logic apps only, follow these steps:

1. In the [Azure portal](https://portal.azure.com), start creating a logic app.

   For more information, see [Create Standard logic app workflows using the Azure portal](create-single-tenant-workflows-azure-portal.md).

1. On the **Create Logic App** page, select **Workflow Service Plan** or **App Service Environment V3**, based on the hosting option you want, and then choose **Select**.

   :::image type="content" source="media/set-up-zone-redundancy-availability-zones/select-standard-plan.png" alt-text="Screenshot shows the Azure portal, Create Logic App page, Standard plan types." lightbox="media/set-up-zone-redundancy-availability-zones/select-standard-plan.png":::

   This example continues with **Workflow Service Plan**.

1. Under **Zone redundancy**, select **Enabled**.

   :::image type="content" source="media/set-up-zone-redundancy-availability-zones/enable-zone-redundancy-standard.png" alt-text="Screenshot that shows the Azure portal, Create Logic App page with Standard logic app details, and the Enabled option selected under Zone redundancy." lightbox="media/set-up-zone-redundancy-availability-zones/enable-zone-redundancy-standard.png":::

   > [!NOTE]
   >
   > If you select an unsupported Azure region or a Windows plan that exists in an unsupported Azure region, the **Zone redundancy** options appear unavailable. Select a different region or create a new Windows plan.

1. Finish the steps to create your logic app resource.

1. If you use a firewall, make sure to set up access for traffic through the required IP addresses, according to the [prerequisites](#prerequisites).

## Related content

- [Reliability in Azure Logic Apps](/azure/reliability/reliability-logic-apps)
