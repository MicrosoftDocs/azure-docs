---
title: Protect logic apps from zonal failures
description: Set up availability zone support for logic apps with zone redundancy for business continuity and disaster recovery.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, shahparth, laveeshb, azla
ms.topic: how-to
ms.date: 07/17/2024
ms.custom: references_regions
#Customer intent: As a developer, I want to protect logic apps from zonal failures by setting up availability zones and zone redundancy.
---

# Protect logic apps from zonal failures with availability zones and zone redundancy

[!INCLUDE [logic-apps-sku-consumption-standard](../../includes/logic-apps-sku-consumption-standard.md)]

In each Azure region, *availability zones* are physically separate locations that are tolerant to local failures. Such failures can range from software and hardware failures to events such as earthquakes, floods, and fires. These zones achieve tolerance through the redundancy and logical isolation of Azure services.

To provide resiliency and distributed availability, at least three separate availability zones exist in any Azure region that supports and enables zone redundancy. The Azure Logic Apps platform distributes these zones and logic app workloads across these zones. This capability is a key requirement for enabling resilient architectures and providing high availability if datacenter failures happen in a region.

For more information, see the following documentation:

* [What are availability zones](../reliability/availability-zones-overview.md)?
* [Azure regions with availability zone support](../reliability/availability-zones-service-support.md)

This guide provides a brief overview, considerations, and information about how to enable availability zones in Azure Logic Apps.

## Considerations

### [Standard](#tab/standard)

Availability zones are supported with Standard logic app workflows, which run in single-tenant Azure Logic Apps and are powered by Azure Functions extensibility. For more information, see [Reliability in Azure Functions](../reliability/reliability-functions.md#availability-zone-support).

* You can enable this capability only when you create a Standard logic app in a [supported Azure region](../reliability/reliability-functions.md#regional-availability) or in an [App Service Environment v3 (ASE v3) - Windows plans only](../app-service/environment/overview-zone-redundancy.md).

* You can enable this capability *only for new* Standard logic apps. You can't enable availability zone support for existing Standard logic app workflows.

* You can enable this capability *only at creation time*. No programmatic tool support, such as Azure PowerShell or Azure CLI, currently exists to enable availability zone support after creation.

* This capability supports only built-in connector operations, which directly run with the Azure Logic Apps runtime, not connector operations that are hosted and run in Azure.

### [Consumption](#tab/consumption)

Availability zones are supported with Consumption logic app workflows, which run in multitenant Azure Logic Apps. This capability is automatically enabled for new and existing Consumption logic app workflows in [Azure regions that support availability zones](../reliability/availability-zones-service-support.md#azure-regions-with-availability-zone-support).

---

## Limitations

With HTTP-based actions, certificates exported or created with AES256 encryption won't work when used for client certificate authentication. The same certificates also won't work when used for OAuth authentication.

## Prerequisites

* An Azure account and subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* If you have a firewall or restricted environment, you have to allow traffic through all the IP addresses required by Azure Logic Apps, managed connectors, and any custom connectors in the Azure region where you create your logic app workflows. New IP addresses that support availability zone redundancy are already published for Azure Logic Apps, managed connectors, and custom connectors. For more information, review the following documentation:

  * [Firewall configuration: IP addresses and service tags](logic-apps-limits-and-config.md#firewall-ip-configuration)

  * [Inbound IP addresses for Azure Logic Apps](logic-apps-limits-and-config.md#inbound)

  * [Outbound IP addresses for Azure Logic Apps](logic-apps-limits-and-config.md#outbound)

  * [Outbound IP addresses for managed connectors and custom connectors](/connectors/common/outbound-ip-addresses)

## Enable availability zones

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

* [Business continuity and disaster recovery for Azure Logic Apps](business-continuity-disaster-recovery-guidance.md)
