---
title: How to configure BGP prefix limit on Customer Edge (CE) devices for Azure Operator Nexus
description: Learn the process for configuring BGP prefix limit on Customer Edge (CE) devices for Azure Operator Nexus
author: sushantjrao 
ms.author: sushrao
ms.date: 04/02/2025
ms.topic: how-to
ms.service: azure-operator-nexus
ms.custom: template-how-to, devx-track-azurecli
---

# BGP prefix limiting overview

BGP (Border Gateway Protocol) prefix limiting is an essential overload protection mechanism for Customer Edge (CE) devices. It helps prevent the Nexus fabric from being overwhelmed when a Nexus tenant advertises an excessive number of BGP routes into a Nexus Virtual Routing and Forwarding (VRF) instance. This feature ensures network stability and security by controlling the number of prefixes received from BGP peers.

## Configuration of BGP prefix limits

BGP prefix limits can be configured using two primary parameters:

- **max-routes (hard limits)**: This parameter sets the maximum number of prefixes a BGP router accepts from a neighbor. If the limit is exceeded, the BGP session with that neighbor is terminated to prevent overloading the router.
  
- **warn-threshold (soft limits)**: The warn-threshold parameter sets a warning threshold below the max-routes limit. When the number of prefixes received from a neighbor exceeds this threshold, a warning is generated, but the BGP session isn't terminated. This policy allows network administrators to take corrective action before the hard limit is reached.

### Hard limits (max-routes)

The `max-routes` parameter specifies the maximum number of prefixes that a BGP router can accept from a neighbor. If the number exceeds this limit, the BGP session with that neighbor is terminated. This threshold is a "hard" limit to protect the router from excessive load and to maintain network stability.

### Soft limits (warn-threshold)

The `warn-threshold` parameter is a "soft" limit. When the number of prefixes exceeds this threshold, a warning is triggered, but the BGP session remains active. This safeguard serves as a precautionary measure, allowing administrators to intervene before reaching the hard limit.

To configure **BGP Prefix Limit** on **Customer Edge (CE)** devices for **Azure Operator Nexus**, follow the steps below. This configuration includes setting the prefix limits for BGP sessions to manage network stability and prevent the Nexus fabric from being overwhelmed when a tenant advertises excessive BGP routes.


### Prerequisites

- Ensure that the **Network Fabric (NF)** is upgraded to the supported version or later.

- Verify that your **Customer Edge (CE)** devices are running on compatible software.

- Check that the **peer groups** for both **IPv4** and **IPv6** address-families are properly set up for internal networks.

### Steps to configure BGP prefix limits

#### Step 1: Define BGP prefix limits

You need to configure the BGP prefix limits using the parameters `maximumRoutes` and `threshold`.

- **`maximumRoutes`**: This parameter defines the maximum number of BGP prefixes the router accepts from a BGP peer.

- **`threshold`**: This parameter defines the warning threshold as a percentage of the `maximumRoutes`. When the number of prefixes exceeds this threshold, a warning is generated.

#### Step 2: Configure on the CE device

##### Example 1: BGP Prefix Limit with automatic restart

This configuration will automatically restart the session after a defined idle time when the prefix limit is exceeded.

```json
{
  "prefixLimits": {
    "maximumRoutes": 5000,
    "threshold": 80,
    "idleTimeExpiry": 100
  }
}
```

- **Explanation**:

  - **maximumRoutes**: 5,000 routes are the limit for the BGP session.

  - **threshold**: A warning is triggered when the prefix count reaches 80% (4,000 routes).

  - **idleTimeExpiry**: If the session is shut down, it will restart automatically after 100 seconds of idle time.

##### Example 2: BGP prefix limit without automatic restart

This configuration shuts down the session when the maximum prefix limit is reached, but manual intervention is required to restart the session.

```json
{
  "prefixLimits": {
    "maximumRoutes": 5000,
    "threshold": 80
  }
}
```

- **Explanation**:

  - **maximumRoutes**: 5,000 routes are the limit for the BGP session.

  - **threshold**: A warning is triggered when the prefix count reaches 80% (4,000 routes).

  - No automatic restart; manual intervention is required to restart the session.

##### Example 3: Hard-Limit drop BGP sessions

This configuration drops extra routes if the prefix limit is exceeded without maintaining a cache of the dropped routes.

```json
{
  "prefixLimits": {
    "maximumRoutes": 5000
  }
}
```

- **Explanation**:

  - **maximumRoutes**: 5,000 routes are the limit for the BGP session.

  - Once the limit is reached, the CE device drops any extra prefixes received from the BGP peer.

##### Example 4: Hard-Limit warning only

This configuration generates a warning once the prefix count reaches a certain percentage of the maximum limit but does not shut down the session.

```json
{
  "prefixLimits": {
    "maximumRoutes": 8000,
    "threshold": 75,
    "warning-only": true
  }
}
```

- **Explanation**:

  - **maximumRoutes**: 8,000 routes are the limit for the BGP session.

  - **threshold**: A warning is generated when the prefix count reaches 75% (6,000 routes).

  - The session isn't shut down. This configuration is used to only generate a warning without taking any session-terminating action.

#### Step 3: Apply Configuration Using Azure CLI

You can use Azure CLI commands to apply the BGP prefix limits to the external network configuration for Nexus.

- **With Automatic Restart**:

   ```bash
   az networkfabric externalnetwork create --resource-group <resource-group> --fabric-name <fabric-name> --network-name <network-name> --prefix-limits '{"maximumRoutes": 5000, "threshold": 80, "idleTimeExpiry": 100}'
   ```

- **Without Automatic Restart**:

   ```bash
   az networkfabric externalnetwork create --resource-group <resource-group> --fabric-name <fabric-name> --network-name <network-name> --prefix-limits '{"maximumRoutes": 5000, "threshold": 80}'
   ```

- **Hard-Limit Drop BGP Sessions**:

   ```bash
   az networkfabric externalnetwork create --resource-group <resource-group> --fabric-name <fabric-name> --network-name <network-name> --prefix-limits '{"maximumRoutes": 5000}'
   ```

- **Hard-Limit Warning Only**:

   ```bash
   az networkfabric externalnetwork create --resource-group <resource-group> --fabric-name <fabric-name> --network-name <network-name> --prefix-limits '{"maximumRoutes": 8000, "threshold": 75, "warning-only": true}'
   ```

#### Step 4: Monitor and validate the configuration

After applying the configuration, ensure to monitor the **BGP session** and validate whether the prefix limits are being enforced properly. You can check the status of the BGP session by using the following command:

```bash
show ip bgp summary
```

Look for the session states and the number of prefixes advertised by each peer. If the limits are being hit, you should see the session state change to **Established** or **Idle** based on the configuration.

### Considerations

- **Threshold and Maximum Limits**: Ensure that you set appropriate thresholds to avoid unnecessary session terminations while still protecting the network from overload.

- **Automatic vs. Manual Restart**: Depending on your network operations, choose between automatic and manual restart options. Automatic restart is useful for minimizing manual intervention, but manual restart may give network administrators more control over recovery.

## Handling BGP Prefix Limits for Different Networks

### Internal network

The platform supports Layer 3 Isolation Domain (L3IsolationDomain) for tenant workloads. It performs device programming on Nexus instances and Arista devices with peer groups for both IPv4 and IPv6 address families.

### External network Option B (PE)

For external network configuration, only the **hard-limit warning-only** option is supported. Nexus supports this configuration via the ARM API under the **NNI optionBlayer3Configuration** with the `maximumRoutes` parameter.

### NNI Option A

For NNI Option A, only a single peer group is allowed. IPv4 over IPv6 and vice versa aren't supported. Warning-only mode is available for handling prefix limits.

By following this guide, you can configure BGP prefix limits effectively to protect your network from overload and ensure that BGP sessions are properly managed for both internal and external networks.