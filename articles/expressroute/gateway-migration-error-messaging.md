---
title: Azure ExpressRoute gateway migration - Troubleshooting errors and best practices
description: Learn how to address Azure ExpressRoute gateway migration errors and implement best practices for a seamless migration process. Resolve frequent challenges and prevent common mistakes.
services: expressroute
author: mekaylamoore
ms.service: azure-expressroute
ms.topic: concept-article
ms.date: 05/01/2025
ms.author: duau
---

# Azure ExpressRoute gateway migration - Troubleshooting errors and best practices

This article provides an overview of error codes associated with gateway migration workflows, along with their causes and resolutions. Problems that commonly occur during each stage of the migration process: **Validate**, **Prepare**, **Migrate**, and **Commit or Abort**. 

## Best practices for avoiding migration errors

Follow these best practices to minimize errors during the gateway migration process:

* **Maintain resource health**: Ensure all resources remain in a **succeeded** state throughout the migration. Avoid running updates on related resources during the process.
* **Avoid property updates**: Refrain from updating properties like **FastPath**, **route weight**, or **traffic toggles** for connections and gateways, as these updates can cause resource failures.
* **Sequential gateway migration**: Migrate gateways connected to the same circuit one at a time. Parallel migrations on the same circuit aren't supported.
* **Avoid manual changes**: Refrain from manually creating, deleting, updating, or resetting gateways or their connections while they are actively carrying traffic (admin state enabled) during the migration process.

* **Check for maintenance**: Avoid creating connections to gateways undergoing maintenance, as this operation fails. Any failed connections must be deleted before retrying.

By adhering to these practices, you can reduce the likelihood of encountering errors during migration.

## Common issues during migration stages and their resolutions

The following table outlines common issues encountered during each migration stage and provides strategies to resolve them:

| Migration Stage | Issue | Resolution |
|-----------------|-------|------------|
| **Validate**    | Resources aren't in a succeeded state. | To resolve the issue, perform a GET and SET operation on the affected resources. |
| **Prepare**     | Creation of new resources fails. | Retry the operation. If retries continue to fail, delete the newly created resources and attempt the operation again. |
| **Migrate**     | Both gateways remain enabled after a migration failure. | Redirect traffic back to the old gateway and retry the migration process. |
| **Commit**      | The old gateway remains enabled, and the commit step fails. | Retry the migration step. Once the old gateway is successfully disabled, delete the old gateway and its associated resources. |
| **Abort**       | Cleanup of resources fails during the abort step. | Redirect traffic to the new gateway and retry the abort operation. |

## Common error messages

The following table outlines common error messages encountered during the migration process, along with their causes and resolutions:

### Scenarios with conditional support

These scenarios include solutions to prevent failures and ensure a successful migration.

| Error name | Message | Resolution |
|------------|---------|------------|
| **Insufficient gateway subnet size** | Virtual network `{vnetName}` doesn't have sufficient space for deploying another gateway. | Delete and recreate the GatewaySubnet as a /27 or shorter prefix (for example, /26 or /25). For guidance, see [Delete and recreate a subnet](../virtual-network/virtual-network-manage-subnet.md). |
| **Legacy connection mode** | The ExpressRoute connections linked to the gateway were created before 2017 (Legacy mode). | Delete and recreate all connections before initiating migration. For detailed steps, see [Convert legacy ExpressRoute gateway connections](howto-recreate-connections.md). |
| **Incompatible dedicated circuit** | Gateway migration can't proceed due to a dedicated Hardware Security Module (HSM) connected to the virtual network. | To proceed with the migration, deallocate the dedicated Hardware Security Module (HSM). For detailed troubleshooting steps, see [Troubleshoot Dedicated HSM](/azure/dedicated-hsm/troubleshoot). |
| **Resources in failed state** | The **validated** stage fails if the gateway or any connected resource, such as circuits, connections, public IPs, VNets, or GatewaySubnet, is in a failed state. | Verify that all resources are in a succeeded state before initiating the migration process. For more information, see [Troubleshoot failed state](../networking/troubleshoot-failed-state.md).|
| **Default gateway SKU limitation** | Default gateways must be upgraded to a Standard SKU before migration to ensure zone resiliency. | Change the gateway SKU to Standard before proceeding with the migration. For more information, see [Resize a gateway SKU](expressroute-howto-add-gateway-resource-manager.md#resize-a-gateway). |
| **FastPath configuration restriction** | Enabling or disabling FastPath during migration isn't supported. | Ensure FastPath remains in its original configuration before proceeding with the migration. |
| **Route weight modification restriction** | Adjusting the route weight during migration isn't permitted. | Revert the route weight to its original value before continuing with the migration process. |

### Unsupported scenarios to avoid

The following table outlines unsupported scenarios that may result in migration failures and don't have available resolutions:

| Error name | Message | Cause |
|--|--|--|
| **Max gateway count in VNet reached** | The operation failed for virtual network `{virtualNetworkName}` because it already contains the maximum number of allowed gateways. | A virtual network can't have more than two ExpressRoute gateways deployed. |
| **Connection limit exceeded** | The existing gateway has `{connectionCount}` connections, which exceed the limit of `{circuitLimit}` connections for the new gateway size `{gatewaySize}`. | Migrating to a gateway with a lower connection limit than the existing gateway isn't allowed. Downgrading the SKU type is unsupported. |
| **FastPath restriction** | ExpressRouteGatewayByPass isn't supported for gateway size `{gatewaySize}`. | Gateways connected to FastPath-enabled connections can only migrate to UltraPerf or ERGW3AZ SKUs. Downgrading the SKU type is unsupported. |
| **Revoked circuit authorization** | The operation failed for virtual network `{virtualNetworkName}` because it already contains the maximum number of allowed gateways. | Gateways connected to circuits with revoked authorizations can't proceed with migration. |

## Next steps

* Learn how to [migrate using the Azure portal](expressroute-howto-gateway-migration-portal.md).
* Learn how to [migrate using PowerShell](expressroute-howto-gateway-migration-powershell.md).
* Explore [best practices for high availability](designing-for-high-availability-with-expressroute.md).
