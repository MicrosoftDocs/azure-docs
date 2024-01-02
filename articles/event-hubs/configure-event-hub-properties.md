---
title: Configure properties for an Azure event hub
description: Learn how to configure status, partition count, cleanup policy, and retention time for an event hub
ms.topic: how-to
ms.custom: log-compaction, devx-track-arm-template, devx-track-azurecli, devx-track-azurepowershell
ms.date: 06/19/2023
---

# Configure properties for an event hub
This article shows you how to configure properties such as status, partition count, retention time, etc. for an event hub.

## Configure status
You can update the status of an event hub to one of these values on the **Properties** page after the event hub is created. 

- Select **Active** (default) if you want to send events to and receive events from an event hub. 
- Select **Disabled** if you want to disable both sending and receiving events from an event hub.  
- Select **SendDisabled** if you want to disable sending events to an event hub. 

    :::image type="content" source="./media/configure-event-hub-properties/properties-page.png" alt-text="Screenshot showing the Properties page for an event hub.":::



## Configure partition count
The **Properties** page allows you to see the number of partitions in an event hub for event hubs in all tiers. It allows you to update the partition count for event hubs in a premium or dedicated tier. For other tiers, you can only specify the partition count at the time of creating an event hub. To learn about partitions in Event Hubs, see [Scalability](event-hubs-scalability.md#partitions)

### Configure cleanup policy
You see the cleanup policy for an event hub on the **Properties** page. You can't update it. By default, an event hub is created with the **delete** cleanup policy, where events are purged upon the expiration of the retention time. While creating an event hub, you can set the cleanup policy to **Compact**. For more information, see [Log compaction](log-compaction.md) and [Configure log compaction](use-log-compaction.md).


## Configure retention time

If the cleanup policy is set to **Delete**, the **retention time** is the maximum time that Event Hubs retains an event before discarding the event. The **Properties** page allows you to specify retention time in hours. 

If the cleanup policy is set to **Compact** at the time of creating an event hub, the **infinite retention time** is automatically enabled. You can set the **Tombstone retention time in hours** though. Client applications can mark existing events of an event hub to be deleted during a compaction job by sending a new event with an existing key and a `null` event payload. These markers are known as **Tombstones**. The **Tombstone retention time in hours** is the time to retain tombstone markers in a compacted event hub. 

## Azure CLI
Use the [`az eventhubs eventhub update`](/cli/azure/eventhubs/eventhub#az-eventhubs-eventhub-update) command to configure partition count and retention settings for an event hub. 

- Use the `--status` parameter to set the status of an existing event hub to `Active`, `Disabled`, or `SendDisabled` or `ReceiveDisabled`. 
- Use `--partition-count` parameter to specify the number of partitions. You can specify the partition count for an existing event hub only if it's in the premium or dedicated tier namespace.
- Use the `--retention-time` to specify the number of hours to retain events for an event hub, if the `cleanupPolicy` is `Delete`. 
- Use the `--tombstone-retention-time-in-hours` to specify the number of hours to retain the tombstone markers, if the `cleanupPolicy` is `Compact`.


## Azure PowerShell
Use the [`Set-AzEventHub`](/powershell/module/az.eventhub/set-azeventhub) by using the `-Status`, `-RetentionTimeInHour` or `TomstoneRetentionTimeInHour` parameters. Currently, the PowerShell command doesn't support updating the partition count for an event hub. 

## Azure Resource Manager template

If you're using an Azure Resource Manager template, use the `partitionCount` and `retentionTimeinHours` as shown in the following example. `MYNAMESPACE` is the name of the Event Hubs namespace and `MYEVENTHUB` is the name of the event hub in this example. 

```json
{
	"type": "Microsoft.EventHub/namespaces/eventhubs",
	"apiVersion": "2022-10-01-preview",
	"name": "MYNAMESPACE/MYEVENTHUB ",
	"properties": {
		"partitionIds": [],
		"partitionCount": 1,
		"captureDescription": null,
		"retentionDescription": {
			"cleanupPolicy": "Delete",
			"retentionTimeInHours": 1
		}
	}
}
```

## Next steps
See the following articles:

- [Scalability](event-hubs-scalability.md#partitions)
- [Log compaction](log-compaction.md) and [Configure log compaction](use-log-compaction.md)- 
