---
title: Protect logic apps from zonal failures
description: Set up availability zone support for logic apps with zone redundancy for business continuity and disaster recovery.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, shahparth, laveeshb, azla
ms.topic: how-to
ms.date: 11/06/2024
ms.custom: references_regions
#Customer intent: As a developer, I want to protect logic apps from zonal failures by setting up availability zones and zone redundancy.
---

# Enable zone-redundancy for your logic app

[!INCLUDE [logic-apps-sku-consumption-standard](../../includes/logic-apps-sku-consumption-standard.md)]

[!INCLUDE [reliability-az-description](../reliability/includes/reliability-availability-zone-description-include.md)]


This guide shows how to enable zone redundancy for your logic apps.

## Prerequisites

- Make sure that you understand zone-redundancy support and considerations in Logic Apps by reading [Reliability in Azure Logic Apps](../reliability/reliability-logic-apps.md).

- You must have an Azure account and subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/pricing/purchase-options/azure-account).

- If you have a firewall or restricted environment, you have to allow traffic through all the IP addresses required by Azure Logic Apps, managed connectors, and any custom connectors in the Azure region where you create your logic app workflows. New IP addresses that support availability zone redundancy are already published for Azure Logic Apps, managed connectors, and custom connectors. For more information, review the following documentation:

  - [Firewall configuration: IP addresses and service tags](logic-apps-limits-and-config.md#firewall-ip-configuration)

  - [Inbound IP addresses for Azure Logic Apps](logic-apps-limits-and-config.md#inbound)

  - [Outbound IP addresses for Azure Logic Apps](logic-apps-limits-and-config.md#outbound)

  - [Outbound IP addresses for managed connectors and custom connectors](/connectors/common/outbound-ip-addresses)


>[!NOTE]
>With HTTP-based actions, certificates exported or created with AES256 encryption won't work when used for client certificate authentication. The same certificates also won't work when used for OAuth authentication.

## Enable zone redundancy for your logic app

For Standard logic apps only, follow these steps:

1. In the [Azure portal](https://portal.azure.com), start creating a Standard logic app. On the **Create Logic App** page, stop after you select **Standard** as the plan type for your logic app.

   :::image type="content" source="media/set-up-zone-redundancy-availability-zones/select-standard-plan.png" alt-text="Screenshot shows Azure portal, Create Logic App page, logic app details, and selected Standard plan type." lightbox="media/set-up-zone-redundancy-availability-zones/select-standard-plan.png":::

   For a tutorial, see [Create Standard logic app workflows with single-tenant Azure Logic Apps in the Azure portal](create-single-tenant-workflows-azure-portal.md).

   After you select **Standard**, the **Zone redundancy** section and options become available.

   > [!NOTE]
   >
   > The **Zone redundancy** options appear unavailable if you select an unsupported Azure region or an 
   > existing Windows plan that created in an unsupported Azure region. Make sure to select a supported 
   > Azure region and a Windows plan that was created in a supported Azure region, or create a new Windows plan.

1. Under **Zone redundancy**, select **Enabled**.

   At this point, your logic app creation experience appears similar to this example:

   :::image type="content" source="media/set-up-zone-redundancy-availability-zones/enable-zone-redundancy-standard.png" alt-text="Screenshot shows Azure portal, Create Logic App page, Standard logic app details, and the Enabled option selected under Zone redundancy." lightbox="media/set-up-zone-redundancy-availability-zones/enable-zone-redundancy-standard.png":::

1. Finish creating your logic app workflow.

1. If you use a firewall and haven't set up access for traffic through the required IP addresses, make sure to complete that [requirement](#prerequisites).

## Related content

- [Reliability in Azure Logic Apps](../reliability/reliability-logic-apps.md)
