---
title: Azure Notification Hubs high availability and cross-region disaster recovery
description: Learn about high availability and cross-region disaster recovery options in Azure Notification Hubs. 
author: sethmanheim
ms.author: sethm
ms.service: notification-hubs
ms.topic: conceptual
ms.date: 05/03/2023

---

# High availability for Azure Notification Hubs

[Azure Notification Hubs][] provides an easy-to-use and scaled-out push engine that enables you to send notifications to any platform (iOS,
Android, Windows, etc.) from any back-end (cloud or on-premises). This article describes the configuration options to achieve the availability characteristics required by your solution. For more information about our SLA, see the [Notification Hubs SLA][].

Notification Hubs offers two availability configurations:

- **Cross region disaster recovery** provides metadata disaster recovery coverage. Cross-region is supported in paired and flexible region recovery options. Each Azure region is paired with another region within the same geography. All Notification Hubs tiers support [Azure paired regions][] (where available). All tiers provide a *flexible recovery region* option, enabling you to choose from a list of supported regions. In regions with availability zones and no region pair, you can use flexible recovery to choose a failover region that provides resiliency in the event of a full region failure.

   | Region type               | Options                                                                                                                  |
   |---------------------------|-------------------------------------------------------------------------------------------------------------------|
   | Paired recovery regions   | See [Azure cross-region replication pairings](/azure/reliability/cross-region-replication-azure#azure-cross-region-replication-pairings-for-all-geographies). |
   | Flexible recovery regions (new feature) | - West Us 2 <br />  - North Europe <br />  - Australia East <br />  - Brazil South <br />  - South East Asia <br />  - South Africa North                   |

- **Zone redundant resiliency** uses Azure [availability zones][]. These zones are physically separate locations within each Azure region that are tolerant to local failures. Failures can range from software and hardware failures to events such as earthquakes, floods, and fires. Tolerance to failures is achieved because of redundancy and logical isolation of Azure services. To ensure resiliency, a minimum of three separate availability zones are present in all availability zone-enabled regions. If the primary copy fails, one of the secondary copies is promoted to primary with no perceived downtime. During a zone-wide outage, no action is required during zone recovery; the offering self-heals and rebalances itself to automatically take advantage of the healthy zone. This feature is available for an extra cost for all tiers. You can only configure availability zones for new namespaces at this time.

You can use these options in tandem or separately, where tier support is provided. See the [Notification Hubs pricing][] page for tier details to determine which features are supported on each tier.

## Cross-region disaster recovery

Notification Hubs provides metadata disaster recovery coverage through cross-region replication of metadata (the Notification Hubs name, the connection string, and other critical information). You can use the Azure paired region or choose from a list of supported flexible regions. When a disaster recovery scenario is triggered, registration data is the only segment of the Notification Hubs infrastructure that is lost. See the following section for options for preserving the registration data for your namespace and how to restore it.

### Enable cross-region disaster recovery

Cross-region disaster recovery options can be modified at any time.

Use the [Azure portal][] to edit an existing namespace.

#### Existing namespaces

1. Sign in to the [Azure portal][].
1. Select **All services** on the left menu.
1. Select **Notification Hub Namespaces** in the **Internet of Things** section.
1. On the **Notification Hub Namespaces** page, select the namespace for which you want to modify the disaster recovery settings.
1. On the **Notification Hub Namespace** page for your namespace, you can see the current disaster recovery setting in the **Essentials** section.
1. In the following example, a paired recovery region is enabled. To modify your disaster recovery region selection, select **(edit)** next to the current selection.

   :::image type="content" source="media/notification-hubs-high-availability/notification-hubs-essenntials.png" alt-text="Screenshot showing Notification Hubs metadata essentials." lightbox="media/notification-hubs-high-availability/notification-hubs-essenntials.png":::

1. On the **Edit Disaster** recovery pop-up you can change your selections. Save your changes.

   > [!NOTE]
   > With a paired recovery region, the region is displayed but greyed out. You cannot edit the region.

   :::image type="content" source="media/notification-hubs-high-availability/paired-recovery.png" alt-text="Screenshot of edit recovery options screen." lightbox="media/notification-hubs-high-availability/paired-recovery.png":::

#### New namespace

Use the procedure in the [Azure portal quickstart][] to set up a new namespace with disaster recovery:

### Secondary notification hub

Paired and flexible region recovery only backs up metadata. You must implement a secondary notification hub to repopulate the registration data into your new hub post-recovery:

1. Create a secondary notification hub in a different data center. It's recommended that you create one from scratch, to shield you from a disaster recovery event that might affect your management capabilities. You can also create one at the time of the disaster recovery event.
1. Keep the secondary notification hub in sync with the primary notification hub using one of the following options:
   - For installations: use an app backend that simultaneously creates and updates installations in both notification hubs. Installations enable you to specify your own unique device identifier, making it more suitable for the replication scenario. For more information, see this [sample code][].
   - For registrations: use an app backend that gets a regular dump of registrations from the primary notification hub as a backup. It can then perform a bulk insert into the secondary notification hub.

The secondary notification hub might have expired installations/registrations. When the push is made to an expired handle, Notification Hubs automatically cleans the associated installation/registration record based on the response received from the Push Notification Service (PNS) server. To clean expired records from a secondary notification hub, add custom logic that processes feedback from each send. Then, expire the installation/registration in the secondary notification hub.

If you don't have a backend, when the app starts on target devices, the devices perform a new registration in the secondary notification hub. Eventually the secondary notification hub has all the active devices registered.

There is a period of time during which devices with unopened apps don't receive notifications.

## Zone redundant resiliency

Azure Notification Hubs now provides data resiliency using [availability zones][]. When you use availability zones, both registration data and
metadata are replicated across data centers in the availability zone. In the event of a zonal outage, no customer action is required; the service automatically rebalances itself to take advantage of a healthy zone.

New availability zones are being added regularly. The following regions currently support availability zones:

| Americas      | Europe            | Africa               | Asia Pacific       |
|---------------|-------------------|----------------------|--------------------|
| West US 3     | West Europe       | South Africa North   | Australia East     |
| East US 2     | France Central    |                      | East Asia          |
| West US 2     | Poland Central    |                      | Qatar              |
| Canada Central| UK South          |                      | India Central      |
|               | North Europe      |                      |                    |
|               | Sweden Central    |                      |                    |

### Enable availability zones

At this time, you can only enable availability zones on new namespaces. Notification Hubs does not support migration of existing namespaces. You cannot disable zone redundancy after enabling it on your namespace.

> [!NOTE]
> Availability Zones are enabled by default if you choose a region that supports the feature. There will be associated costs.

:::image type="content" source="media/notification-hubs-high-availability/enable-availability-zones.png" alt-text="Screenshow showing availability zones enabled." lightbox="media/notification-hubs-high-availability/enable-availability-zones.png":::

Use the [Azure portal quickstart][] procedure to set up a new namespace with availability zones.

## Next steps

- [Azure availability zones](/azure/availability-zones/az-overview)
- [Azure services that support availability zones](/azure/availability-zones/az-region)

  [Azure Notification Hubs]: notification-hubs-push-notification-overview.md
  [Notification Hubs SLA]: https://azure.microsoft.com/support/legal/sla/notification-hubs/
  [Azure paired regions]: /azure/availability-zones/cross-region-replication-azure#azure-cross-region-replication-pairings-for-all-geographies
  [availability zones]: /azure/availability-zones/az-overview
  [Notification Hubs Pricing]: https://azure.microsoft.com/pricing/details/notification-hubs/
  [Azure portal]: https://portal.azure.com/
  [Azure portal quickstart]: create-notification-hub-portal.md
  [sample code]: https://github.com/Azure/azure-notificationhubs-dotnet/tree/main/Samples/RedundantHubSample
