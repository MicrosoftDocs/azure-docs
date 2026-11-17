---
title: Enable Microsoft Configuration Manager Connected Inventory
description: Learn how to enable Connected Inventory for Microsoft Configuration Manager device collections and review their inventory in Azure.
ms.date: 11/07/2026
ms.topic: how-to
ms.service: azure-machine-configuration
---

# Enable Microsoft Configuration Manager Connected Inventory (preview)

Microsoft Configuration Manager Connected Inventory makes existing inventory from Configuration Manager-managed servers available in Azure. You select device collections in the Configuration Manager console and review their inventory through the Azure portal and Azure Resource Graph.

Connected Inventory creates read-only Azure representations of the selected servers. It uses inventory already collected by Configuration Manager and doesn't install agents on each managed server.

## Prerequisites

- A Configuration Manager site with managed servers and device collections.
- The Azure Arc connector configured for the site.
- The required Configuration Manager console extension installed.
- Access to the Azure tenant, subscription, resource group, and region configured for the connection.
- Permissions to configure the connection and view the resulting Azure resources.

## Enable Connected Inventory for a collection

1. Open the **Microsoft Configuration Manager console**.
2. Expand **Cloud Services**, and select **Azure Arc Devices**.
3. Select **Arc Connected Device** to open the **Azure Arc setup** wizard.
4. On **Connected Inventory**, verify the site and the **Connected to Azure Arc** destination information, and then select **Next**.
5. On **Choose collections**, select the device collection whose inventory you want to publish, and then select **Next**.
6. On **Review**, verify the Azure destination and the collection changes, and then select **Apply**.
7. Wait for **Apply changes** to complete, and review **Results**.
8. Return to **Azure Arc Devices** and verify that the selected machines show **Enabled** in **Connected Inventory**.

## Review inventory in Azure

1. In the Azure portal, open the relevant Azure Arc **On-premises connector**.
2. Open **Devices**, and select a synchronized server.
3. Open **machine inventory (preview)**.
4. Review the available inventory for that server.

Inventory refreshes daily and can take up to 24 hours to appear after enablement.

## Query device-collection membership

In **Resource Graph Explorer**, select the subscription containing the synchronized servers and run the following query. Replace `<subscription-id>` with your subscription ID.

```kusto
guestconfigurationresources
| where subscriptionId == '<subscription-id>'
| where type =~ 'microsoft.guestconfiguration/devicecollections'
| extend machineResourceId = tostring(split(tolower(id), '/providers/microsoft.guestconfiguration/')[0])
| project machineResourceId, deviceCollection = name,
    properties, resourceGroup, subscriptionId
| order by machineResourceId asc, deviceCollection asc
```

Use the results to verify that collection membership records are available for synchronized machines.

## Troubleshoot Connected Inventory

| Symptom | What to check |
| --- | --- |
| Machines remain disabled | Confirm that you selected the correct collection. Review the wizard's Results page for validation or synchronization errors. |
| Devices don't appear in Azure | Verify the Azure destination, selected subscription, and portal filters. Allow up to 24 hours after enablement. |
| A category is empty or data appears stale | Verify that Configuration Manager collected the expected inventory and that synchronization is functioning. Check whether the category is supported for this collection path. |
| Collection membership is missing | Query `microsoft.guestconfiguration/devicecollections` in the destination subscription and compare the results with the selected collection. |

## Related content

- [Overview of machine inventory](overview.md).
- [View and query machine inventory](view-and-query-machine-inventory.md).
- [Enable agent-based machine inventory](enable-machine-inventory.md).
