---
title: Error codes for gateway migration workflows
titleSuffix: Azure ExpressRoute
description: This article explains error codes and best practices for gateway migration
services: expressroute
author: duongau
ms.service: azure-expressroute
ms.custom: ignite-2023
ms.topic: concept-article
ms.date: 05/1/2025
ms.author: duau
---

This article provides an overview of error codes associated with gateway migration workflows, along with their causes and resolutions.

## Best practices for avoiding errors

Before migrating, review your environment setup to avoid common issues. These are key practices to prevent errors when using the migration tool:

* Ensure all resources remain in a **succeeded** state throughout the migration process. Avoid running updates on related resources.
* Don't update properties like **FastPath** or **route weight** for connections, as this update might cause connection resources to fail.
* Avoid updating properties like **traffic toggles** for gateways, as this update might cause gateway resources to fail.
* Don't migrate gateways connected to the same circuit in parallel. Only one connection per circuit can be created at a time.
* Avoid manually creating or deleting connections to gateways carrying traffic (admin state enabled) during migration.
* Don't attempt to create connections to gateways undergoing maintenance. This operation fails, and the newly created connection must be deleted to proceed. Only one connection between a circuit and gateway is allowed.

## Common error messages

### Unsupported scenarios

* **Max Gateway Count in VNet Reached**  
  * **Error name**: MaxGatewayCountInVnetReached  
  * **Message**: Operation failed for virtual network {0} as it already contains the maximum allowed number of gateways.  
  * **Cause**: Deploying more than two ExpressRoute gateways in a virtual network isn't permitted.

* **Connection Limits**  
  * **Message**: Existing gateway has {connectionCount} connections. Connections exceed limit {circuitLimit} for gateway size {gatewaySize} for the new gateway.  
  * **Cause**: A new gateway with fewer allowed connection limits than the existing gateway isn't permitted. Downgrading SKU type isn't allowed.

* **FastPath Enabled Connections**  
  * **Message**: ExpressRouteGatewayByPass isn't allowed on gateway size {gatewaySize}.  
  * **Cause**: Gateways connected to FastPath-enabled connections can only migrate to UltraPerf or ERGW3AZ. Downgrading SKU type isn't allowed.

* **Authorization Revoked**  
  * **Message**: Operation failed for virtual network {0} as it already contains the maximum allowed number of gateways.  
  * **Cause**: Gateways connected to circuits with revoked authorizations can't proceed with migration.

### Scenarios with conditional support

* **Gateway Subnet Size**  
  * **Message**: Virtual network {vnetName} doesn't have enough space for another gateway deployment.  
  * **Resolution**: Add more address prefixes to the GatewaySubnet. For details, see [Create multiple prefixes for a subnet](https://learn.microsoft.com/azure/virtual-network/create-multiple-prefixes-for-subnet).

* **Legacy Mode**  
  * **Error name**: ERGWMigrationIPInGREConnectionError  
  * **Message**: The ExpressRoute connections associated with the gateway were created using Legacy Mode.  
  * **Resolution**: Delete and recreate all connections before proceeding with migration. For more information, see [Convert legacy ExpressRoute gateway connections](https://learn.microsoft.com/azure/expressroute/convert-legacy-connections).

* **Unsupported Dedicated Circuit**  
  * **Error name**: ERGWMigrationServerConnectedCircuitError  
  * **Message**: To proceed with your gateway migration, deallocate your dedicated HSM. Virtual networks connected to dedicated HSM aren't supported for migration.  
  * **Resolution**: For more information, see [Troubleshoot Dedicated HSM](https://learn.microsoft.com/azure/dedicated-hsm/troubleshoot).

## Preventable errors with user action

* **Failed State Resources**: If the gateway or any connected resource is in a failed state, the "Validate" stage fails. Connected resources include circuits, connections, public IPs, VNETs, and subnets (GatewaySubnet).  
  * **Resolution**: Ensure all resources are in a succeeded state before proceeding.

* **Default Gateway SKU**: Update default gateways to Standard gateways before migrating to make them zone-resilient.

* **FastPath Update**: Updating connections to FastPath during migration isn't allowed.  
  * **Message**: Update on an existing connection is blocked during gateway migration. Set GatewayByPass to {vnetConfigEntity.DirectTunnelsStatus} before proceeding.

* **Route Weight Update**: Updating route weight during migration isn't allowed.  
  * **Message**: Update on an existing connection is blocked during gateway migration. Set RoutingWeight to {vnetConfigEntity.RoutingWeight} before proceeding.

## How to recover from errors

The migration process includes the following steps: **Validate**, **Prepare**, **Migrate**, and **Commit/Abort**. Errors might occur at each step. These are recovery strategies:

### Validate

* **Issue**: Resources aren't in a succeeded state.  
  * **Recovery**: Perform a GET and SET operation to resolve the issue.

### Prepare

* **Issue**: New resources fail during creation.  
  * **Recovery**: Retry the operation. If retries fail, delete the newly created resources and try again.

### Migrate

* **Issue**: Both gateways remain enabled after migration fails.  
  * **Recovery**: Revert traffic to the old gateway and retry the migration.

### Commit

* **Issue**: Both gateways remain enabled after commit fails.  
  * **Recovery**: Revert traffic to the old gateway and retry the commit.

### Abort

* **Issue**: Both gateways remain enabled after abort fails.  
  * **Recovery**: Revert traffic to the old gateway and retry the abort.

## Next steps

* Learn how to [migrate using the Azure portal](https://learn.microsoft.com/azure/expressroute/howto-gateway-migration-portal).
* Learn how to [migrate using PowerShell](https://learn.microsoft.com/azure/expressroute/howto-gateway-migration-powershell).
* Explore [best practices for high availability](https://learn.microsoft.com/azure/expressroute/designing-for-high-availability-with-expressroute).
* Plan for [disaster recovery](https://learn.microsoft.com/azure/expressroute/designing-for-disaster-recovery-with-expressroute-privatepeering) and [using VPN as a backup](https://learn.microsoft.com/azure/expressroute/use-s2s-vpn-as-backup-for-expressroute-privatepeering).