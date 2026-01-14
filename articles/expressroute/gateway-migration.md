---
title: About migrating to an availability zone-enabled ExpressRoute virtual network gateway
titleSuffix: Azure ExpressRoute
description: This article explains how to migrate from Standard/HighPerf/UltraPerf SKUs to ErGw1/2/3AZ SKUs.
services: expressroute
author: duongau
ms.service: azure-expressroute
ms.custom:
  - ignite-2023
  - build-2025
ms.topic: concept-article
ms.date: 05/19/2025
ms.author: duau
# Customer intent: As a network administrator, I want to migrate my existing ExpressRoute gateway to an Availability Zone-enabled SKU, so that I can enhance the reliability and high availability of my network connections without significant downtime.
---

# About ExpressRoute Gateway Migration

This article outlines the ExpressRoute gateway migration process, allowing you to move from your current SKU to any equal or higher SKU and from Basic IP to Standard IP—enhancing reliability and availability, while downgrades aren't supported.

For guidance on upgrading Basic SKU public IP addresses for other networking services, see [Upgrading Basic to Standard SKU](../virtual-network/ip-services/public-ip-basic-upgrade-guidance.md#steps-to-complete-the-upgrade).

> [!IMPORTANT]
>On September 30, 2025, Basic SKU public IPs will be retired. For more information, see the [official announcement](https://azure.microsoft.com/updates/upgrade-to-standard-sku-public-ip-addresses-in-azure-by-30-september-2025-basic-sku-will-be-retired/). If you're currently using Basic SKU public IPs, make sure to upgrade to Standard SKU public IPs prior to the retirement date. 

## Gateway migration experience

The gateway migration experience allows you to deploy a second virtual network gateway in the same GatewaySubnet, with Azure [automatically assigning a new public IP-](expressroute-about-virtual-network-gateways.md#auto-assigned-public-ip) eliminating the need for manual IP creation—while configurations are migrated from the old gateway to the new one; both gateways run simultaneously to minimize disruption, though brief connectivity interruptions may still occur.

After migration, the old gateway and its connections are deleted, and the new gateway is tagged with **CreatedBy: GatewaySKUMigration** to identify it as a migrated resource and shouldn’t be deleted.
## Supported Migration Scenarios

The guided ExpressRoute gateway migration experience enables customers to move from their current SKU to any equal or higher SKU. Migrating to a lower SKU (downgrades) isn't supported.

If you have an ExpressRoute gateway deployed in the same virtual network as a VPN Gateway, you can use the ExpressRoute Gateway migration tool. There's no expected impact to VPN Gateway traffic during this process.
 
Learn how to [migrate using the Azure portal](expressroute-howto-gateway-migration-portal.md).  
Learn how to [migrate using PowerShell](expressroute-howto-gateway-migration-powershell.md).

For enhanced reliability and high availability, we recommend migrating to an Az-enabled SKU.

### Migrate to ErGwScale (Scalable Gateway)
The ExpressRoute Scalable Gateway (ErGwScale) is a new virtual network gateway SKU that provides flexible, high-bandwidth connectivity for your Azure virtual networks.

> [!IMPORTANT]
>The minimum scale unit must be 1, when the maximum scale unit is 1.


You can configure the gateway's scaling, as per requirements, by setting the minimum and maximum scale units:
- To configure a fixed-size gateway, set both the **minimum** and **maximum** scale units to the same value (for example, set both to **1**, set both to **20**, set both to **40**).
- To enable autoscaling, set the **minimum scale unit** to **2** or higher, and specify the desired **maximum scale unit** (up to 40).

This allows the gateway to automatically scale based on your workload requirements.

For more information, see [About Scalable Gateway](scalable-gateway.md).

| Scenario              | Minimum Scale Unit | Maximum Scale Unit | Autoscaling Enabled? |
|-----------------------|-------------------|-------------------|---------------------|
| Fixed scaling         | 1                 | 1                 | No                  |
| Fixed scaling         | 20                | 20                | No                  |  
| Fixed scaling         | 40                | 40                | No                  |  
| Autoscaling           | 2 or higher       | Up to 40          | Yes                 |

## Steps to migrate to a new gateway

1. **Validate**: Check that all resources are in a succeeded state. If any prerequisites aren't met, validation fails and migration can't proceed.
2. **Prepare**:  Azure creates a new virtual network gateway, [automatically assigns a new Public IP-](expressroute-about-virtual-network-gateways.md#auto-assigned-public-ip) a new Public IP  and re-establishes connections—this process can take up to 45 minutes; you can specify a custom name for the new gateway, or Azure will add **_migrated** to the original name by default. During preparation, the existing gateway is locked to prevent changes, with the option to **abort** and delete the new gateway and connections.

> [!NOTE]
> The new gateway is created in the same region as the existing one. To change regions, you must delete the current gateway and create a new one in the desired region.

3. **Migrate**: Switch traffic from the old gateway to the new one. This step can take up to 15 minutes and may cause brief connectivity interruptions. Don't navigate away from the migration page while traffic is being moved. Leaving the page may interrupt the process.
4. **Commit**: Finalize the migration by deleting the original gateway and its connections. If you need to cancel the migration, first switch traffic back to the original gateway by selecting the radio button in the **Migrate** section, then click **Migrate**, and finally choose **Abort** to delete the new gateway and its connections.

> [!IMPORTANT]
> After migration, validate your connectivity to ensure everything is functioning as expected. You can revert to the old gateway by selecting **Abort** after the prepare step, which will delete the new gateway and connections.

## Limitations

The guided gateway migration experience has the following limitations:

- **ExpressRoute Only**: The migration tool is designed for **ExpressRoute virtual network gateways**. It does **not** support VPN gateways or other gateway types.
-**Same Virtual Network Requirement**: Migration is only supported within the same **virtual network**. Cross-subscription, cross-region, or cross-gateway-type migrations (for example, to/from VPN gateways) aren't supported.
- **No Downgrades**: Downgrading from an **Az-enabled SKU** to a **non-Az-enabled SKU** is **not** supported.
- **GatewaySubnet Size**: The GatewaySubnet must have a /27 prefix or longer to proceed with migration. For more information, see [Create multiple prefixes for a subnet](../virtual-network/virtual-network-manage-subnet.md) for more information.
- **Private Endpoint Connectivity**: Private endpoints (PEs) connected via ExpressRoute private peering may experience **connectivity issues** during migration. Refer to guidance on mitigating these issues in the Private endpoint connectivity documentation. [Private endpoint connectivity](expressroute-about-virtual-network-gateways.md#private-endpoint-connectivity-and-planned-maintenance-events).
- **Legacy Gateways**: ExpressRoute gateways created or connected to circuits in **2017 or earlier** aren't supported.
- **Unsupported SKUs**: Gateways using the **"default" SKU** aren't eligible for migration. To check the migration eligibility of your Gateway, there should be an Advisor notification.
- **Incompatible dedicated circuit**: Gateway migration can't proceed with a dedicated Hardware Security Module (HSM) connected to the virtual network. To proceed with the migration, deallocate the dedicated Hardware Security Module (HSM). For detailed troubleshooting steps, see [Troubleshoot Dedicated HSM](/azure/dedicated-hsm/troubleshoot).

For detailed troubleshooting errors and best practices, see [Troubleshooting Gateway Migration](gateway-migration-error-messaging.md).

## FAQ

### How do I add a second prefix to the GatewaySubnet?

Adding multiple prefixes to the GatewaySubnet is currently in Public Preview and supported only via PowerShell. When you add an additional prefix, both prefixes will be used by the migrated gateway, so don't delete the old prefix. For instructions, see [Create multiple prefixes for a subnet](../virtual-network/virtual-network-manage-subnet.md).

### How do I monitor the health of the new gateway?

Monitoring for the new gateway is the same as for the old gateway. The new gateway is a separate resource with its own metrics. During migration, you can also observe traffic patterns using the migration tool.

After migration, if you had existing monitoring, alerting, customer-defined maintenance windows, or diagnostic settings configured, you'll need to reconfigure these on the newly created gateway.

### Will migration cause downtime?

Migration may cause a few minutes of downtime. Plan to perform the migration during a maintenance window to minimize impact.

### How long can I wait before committing to the new gateway?

There's no mandatory waiting period to do commit. However, if you need time to validate connectivity and ensure all requirements are met before finalizing the migration, then you have up to 15 days to commit after migration.

### How do I check if my gateway SKU is eligible for migration?

Azure Advisor will notify you if your gateway is eligible or requires migration. You can also check your ExpressRoute Gateway resource in the Azure portal—if your gateway is eligible, a banner at the top of the page will display the message "Implement Zone Redundant ExpressRoute Gateways."

:::image type="content" source="./media/gateway-migration/advisor.png" alt-text="Image showing Azure Advisor notification in overview of the gateway." lightbox="./media/gateway-migration/advisor-expansion.png":::

### How do I validate if my gateway is Zone Resilient after migration?

To confirm your gateway is zone resilient after migration:

- Check Azure Advisor: If your gateway is zone resilient, you'll no longer see Advisor alerts recommending a zone-redundant gateway.
- Verify resource tags: The migrated gateway will have a default tag labeled `GatewaySKUMigration`, indicating it has been moved to the zone-resilient deployment model.

These checks confirm that your gateway is now zone resilient.

### Can I roll back this change?

Yes, until it's committed. The migration is composed of four major steps:​

1. Validate – Confirms if your gateway is eligible for migration. ​
No changes at this stage; nothing to roll back​

2. Prepare – Creates a new Virtual Network Gateway with the desired configuration. ​
The process can be aborted after step 2 and the new gateway will be deleted.​

3. Migrate – Transfer the configuration from the existing gateway to the new one.​
If needed, the configuration can be reverted to the existing gateway after step 3.​ Don't navigate away from the migration page while traffic is being moved. Leaving the page may interrupt the process.

4. Commit – Finalize the migration by decommissioning the old gateway and its connections. ​
Once the change is committed, it can no longer be rolled back.

### What is the traffic impact during migration? Is there packet loss or routing disruption?

During the migration process, traffic is rerouted seamlessly. There's no expected packet loss or routing disruption under normal conditions.

### What should I do if the Prepare step fails due to a cross-region connection on a Basic SKU circuit during gateway migration?

If the Prepare step fails because your Basic SKU circuit has a cross-region connection, **abort** the gateway migration and **upgrade** the circuit SKU before trying again. This configuration is unsupported, and migration continues to fail until the circuit SKU is upgraded.

## Next Steps

- Troubleshoot migration  issues with [Troubleshooting Gateway Migration](gateway-migration-error-messaging.md).
- Learn how to [migrate using the Azure portal](expressroute-howto-gateway-migration-portal.md).
- Learn how to [migrate using PowerShell](expressroute-howto-gateway-migration-powershell.md).


