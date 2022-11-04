---
title: Azure Notification Hubs cross-region disaster recovery
description: Learn about cross-region disaster recovery options in Azure Notification Hubs. 
author: sethmanheim
ms.author: sethm
ms.service: notification-hubs
ms.topic: conceptual
ms.date: 10/07/2022

---

# Cross-region disaster recovery (preview)

> [!NOTE]
> The ability to edit your cross region disaster recovery options is available in preview. If you are interested in using this feature, contact your customer success manager at Microsoft, or create an Azure support ticket which will be triaged by the support team.

[Azure Notification Hubs](notification-hubs-push-notification-overview.md) provides an easy-to-use and scaled-out push engine that enables you to send notifications to any platform (iOS, Android, Windows, etc.) from any back-end (cloud or on-premises). This article describes the cross-region disaster recovery configuration options currently available.

Cross-region disaster recovery provides *metadata* disaster recovery coverage. This is supported in paired and flexible region recovery
options. Each Azure region is paired with another region within the same geography. All Notification Hubs tiers support [Azure paired regions](../availability-zones/cross-region-replication-azure.md#azure-cross-region-replication-pairings-for-all-geographies)
(where available) or a flexible recovery region option that enables you to choose from a list of supported regions.

## Enable cross region disaster recovery

Cross-region disaster recovery options can be modified at any time.

### Use existing namespace

Use the Azure portal to edit an existing namespace:

1. Sign in to the [Azure portal](https://portal.azure.com).

2. Select **All services** on the left menu.

3. Select **Notification Hub Namespaces** in the **Internet of Things** section.

4. On the **Notification Hub Namespaces** page, select the namespace for which you want to modify the disaster recovery settings.

5. On the **Notification Hub Namespace** page for your namespace, you can see the current disaster recovery setting in the **Essentials** section.

6. In the following example, paired recovery region is enabled. To modify your disaster recovery region selection, select the **(edit)** link next to the current selection.

   :::image type="content" source="media/cross-region-recovery/cedr1.png" alt-text="Azure portal namespace":::

7. On the **Edit Disaster** recovery pop-up screen, you can change your selections. Save your changes.

   :::image type="content" source="media/cross-region-recovery/cedr2.png" alt-text="Azure portal edit recovery":::

### Use new namespace

To create a new namespace with disaster recovery, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com).

2. Select **All services** on the left menu.

3. Select **Notification Hubs** in the **Mobile** section. 

4. Select the star icon next to the service name to add the service to the **FAVORITES** section on the left menu. After you add **Notification Hubs** to **FAVORITES**, select it on the left menu.

   :::image type="content" source="media/cross-region-recovery/cedr3.png" alt-text="Azure portal favorites":::

5. On the **Notification Hubs** page, select **Create** on the toolbar.

   :::image type="content" source="media/cross-region-recovery/cedr4.png" alt-text="Create notification hub":::

6. In the **Basics** tab on the **Notification Hub** page, perform the following steps:

   1. In **Subscription**, select the name of the Azure subscription you want to use, and then select an existing resource group, or create a
    new one.
   1. Enter a unique name for the new namespace in **Namespace Details**.
   1. A namespace contains one or more notification hubs, so type a name for the hub in **Notification Hub Details**. Or, select an existing
    namespace from the drop-down.
   1. Select a value from the **Location** drop-down list box. This value specifies the location in which you want to create the hub.
   1. Choose your **Disaster recovery** option – None, Paired recovery region or Flexible recovery region. If you choose **Paired recovery region**, the failover region is displayed.

      :::image type="content" source="media/cross-region-recovery/cedr5.png" alt-text="Notification hub properties":::

   1. If you select **Flexible recovery region**, use the drop-down to choose from a list of recovery regions.

      :::image type="content" source="media/cross-region-recovery/cedr6.png" alt-text="Select region":::

   1. Select **Create**.

### Add resiliency

Paired and flexible region recovery only backs up metadata. You must implement a solution to repopulate the registration data into your new
hub post-recovery:

1. Create a secondary notification hub in a different datacenter. We recommend creating one from the beginning, to shield you from a disaster recovery event that might affect your management capabilities. You can also create one at the time of the disaster recovery event.

2. Keep the secondary notification hub in sync with the primary notification hub using one of the following options:
    - Use an app backend that simultaneously creates and updates installations in both notification hubs. Installations allow you to specify your own unique device identifier, making it more suitable for the replication scenario. For more information, [see this sample](https://github.com/Azure/azure-notificationhubs-dotnet/tree/main/Samples/RedundantHubSample).
    - Use an app backend that gets a regular dump of registrations from the primary notification hub as a backup. It can then perform a bulk insert into the secondary notification hub.

The secondary notification hub might end up with expired installations/registrations. When the push is made to an expired handle, Notification Hubs automatically cleans the associated installation/registration record based on the response received from the PNS server. To clean expired records from a secondary notification hub, add custom logic that processes feedback from each send. Then, expire installation/registration in the secondary notification hub.

If you don't have a backend, when the app starts on target devices, they perform a new registration in the secondary notification hub. Eventually the secondary notification hub will have all the active devices registered.

There will be a time period when devices with unopened apps won't receive notifications.

## Next steps

- [Azure Notification Hubs](notification-hubs-push-notification-overview.md)