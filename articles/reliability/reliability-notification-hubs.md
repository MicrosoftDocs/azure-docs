---
title: Reliability in Azure Notification Hubs
description: Find out about reliability in Azure Notification Hubs. 
author: sethmanheim
ms.author: sethm
ms.service: notification-hubs
ms.topic: reliability-article
ms.custom: subject-reliability, references_regions
ms.date: 03/06/2024

---

# Reliability in Azure Notification Hubs

This article describes reliability support in Azure Notification Hubs and covers both regional resiliency with [availability zones](#availability-zone-support) and [disaster recovery and business continuity](#cross-region-disaster-recovery-and-business-continuity)


## Availability zone support

[!INCLUDE [Availability zone description](includes/reliability-availability-zone-description-include.md)]


In a region that supports availability zones, Notification Hubs supports a zone-redundant deployment by default. When you deploy with availability zones, both registration data and metadata are replicated across all zones in the specified region. 


### Prerequisites

- Azure Notification Hubs uses [availability zones](availability-zones-overview.md#zonal-and-zone-redundant-services) in regions where they're available. For a list of regions that support availability zones, see [Availability zone service and regional support](availability-zones-service-support.md).

- Availability zones are supported by default only in specific tiers. To learn which tiers support availability zone deployments, see [Notification Hubs pricing](https://azure.microsoft.com/pricing/details/notification-hubs.

### SLA improvements

Availability zones support incurs an additional cost on top of existing tier pricing.  For more information about our SLA, see the [Notification Hubs SLA](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services).


### Zone down experience

During a zone-wide outage, no action is required during zone recovery. Notification Hubs self-heals and re-balances itself to automatically take advantage of the healthy zone. 

### Enable availability zones

You can only enable availability zones on new namespaces. Because Notification Hubs doesn't support the migration of existing namespaces, you can't disable zone redundancy after enabling it on your namespace.


:::image type="content" source="./media/reliability-notification-hubs/enable-availability-zones.png" alt-text="Screenshow showing availability zones enabled." :::


To learn how to set up a new namespace with availability zones, see [Create an Azure notification hub in the Azure portal](/azure/notification-hubs/create-notification-hub-portal).

### Migrate to availability zone support

To learn how to move an existing Notification Hubs resource to a new region with availability zone support, follow the guidance in [Move resources between Azure regions](/azure/notification-hubs/move-registrations).


## Cross-region disaster recovery and business continuity

[!INCLUDE [introduction to disaster recovery](includes/reliability-disaster-recovery-description-include.md)]

Notification Hubs provides metadata disaster recovery coverage through cross-region replication of metadata such as the Notification Hubs name, the connection string, and other critical information. 

You can use the [Azure paired region](./cross-region-replication-azure.md#azure-paired-regions) or choose from a list of regions that support [Flexible Recovery Region](#flexible-recovery-region). 

When a disaster recovery scenario is triggered, registration data is the only segment of the Notification Hubs infrastructure that's lost. See the [Back up registration data](#back-up-registration-data) section for options for preserving the registration data for your namespace and how to restore it.


### Flexible Recovery Region

Flexible Recovery Region is a simple solution that allows you to configure a secondary namespace as a failover target for your primary namespace. You can choose from the list of supported regions. In the case of regions with availability zones but no paired region, you can use flexible recovery to select a secondary region. When the failover is triggered, the secondary namespace becomes the active namespace, and the primary namespace becomes the passive namespace. All the requests and messages sent to the primary namespace are redirected to the secondary namespace, and the push notifications are delivered from the secondary namespace.

The following regions support Flexible Recovery Region:

- West US 2
- North Europe
- Australia East
- Brazil South
- South East Asia
- South Africa North


### Back up registration data

Paired and flexible region recovery only backs up metadata. You must implement a solution to repopulate the registration data into your hub post-recovery.

Azure Notification Hubs supports two types of device registrations: installations and registrations. We recommend that you back up your registrations to either:

-  **A storage solution of your choice**: If a DR event occurs, there will be some downtime for restoration activities.
- **Another hub you create in another region**: Use this option to back up your registrations. As a working hub, you can implement code to switch to this copy. To keep a secondary notification hub in sync with the primary notification hub, you can use one of the following options to back up your registrations:
   - **For installations**: Use an app backend that simultaneously creates and updates installations in both notification hubs. Installations enable you to specify your own unique device identifier, making it more suitable for the replication scenario. For more information, see this [sample code](https://github.com/Azure/azure-notificationhubs-dotnet/tree/main/Samples/RedundantHubSample).
   - **For registrations**: Use an app backend that gets a regular dump of registrations from the primary notification hub as a backup. It can then perform a bulk insert into the secondary notification hub. See [Export and import Azure Notification Hubs registrations in bulk](/azure/notification-hubs/export-modify-registrations-bulk).

The secondary notification hub might have expired registrations. When the push is made to an expired handle, Notification Hubs automatically cleans the associated registration record on the primary notification hub, based on the response received from the PNS server. You can clean expired records from the backup solution of your choice by adding custom logic that processes feedback from each send, and removes expired registrations.

If you don't have a backend, when the app starts on target devices, the devices perform a new registration in the secondary notification hub. Eventually the secondary notification hub will have all the active devices registered.

There is a period of time during which devices with unopened apps don't receive notifications.


### Enable cross-region disaster recovery

To enable disaster recovery for a new namespace, follow the procedure in the [Create an Azure notification hub in the Azure portal](/azure/notification-hubs/create-notification-hub-portal).


To enable or disable disaster recovery for an existing namespace:

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. On the left menu, select **All services**.
1. In the **Internet of Things** section, select **Notification Hub Namespaces**.
1. On the **Notification Hub Namespaces** page, select the namespace for which you want to modify the disaster recovery settings.
1. On the **Notification Hub Namespace** page for your namespace, you can see the current disaster recovery setting in the **Essentials** section.
1. In the following example, a flexible recovery region is enabled. Click the current disaster recovery region selection to display the edit pop-up.

   :::image type="content" source="./media/reliability-notification-hubs/notification-hubs-essentials.png" alt-text="Screenshot showing Notification Hubs metadata essentials." :::

1. On the **Edit Disaster** recovery pop-up you can change your selections. Save your changes.

   > [!NOTE]
   > With a paired recovery region, the region is displayed but greyed out. You cannot edit the region.

   :::image type="content" source="./media/reliability-notification-hubs/paired-recovery.png" alt-text="Screenshot of edit recovery options screen." :::


## Next steps

- [Reliability in Azure](./overview.md)
