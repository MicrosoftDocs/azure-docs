---
title: Configure BGP Prefix Limit on CE Devices for Azure Operator Nexus
description: Learn the process for configuring a BGP prefix limit on customer edge (CE) devices for Azure Operator Nexus.
author: sushantjrao 
ms.author: sushrao
ms.date: 04/02/2025
ms.topic: how-to
ms.service: azure-operator-nexus
ms.custom: template-how-to, devx-track-azurecli
---

# BGP prefix limiting overview

Border Gateway Protocol (BGP) prefix limiting is an essential overload protection mechanism for customer edge (CE) devices. It helps prevent the Azure Operator Nexus fabric from being overwhelmed when an Azure Operator Nexus tenant advertises an excessive number of BGP routes into an Azure Operator Nexus virtual routing and forwarding (VRF) instance. This feature helps to ensure network stability and security by controlling the number of prefixes that are received from BGP peers.

## Configuration of BGP prefix limits

To configure BGP prefix limits, you can use two primary parameters:

- `max-routes`
- `warn-threshold`

### Hard limits (max-routes)

The `max-routes` parameter specifies the maximum number of prefixes that a BGP router can accept from a neighbor. If the number exceeds this limit, the BGP session with that neighbor is terminated. This threshold is a hard limit to protect the router from excessive load and to maintain network stability.

### Soft limits (warn-threshold)

The `warn-threshold` parameter is a soft limit. When the number of prefixes exceeds this threshold, a warning is triggered, but the BGP session remains active. This safeguard serves as a precautionary measure so that administrators can intervene before the hard limit is reached.

To configure the BGP prefix limit on CE devices for Azure Operator Nexus, follow the next steps. This configuration includes setting the prefix limits for BGP sessions to manage network stability and prevent the Nexus fabric from being overwhelmed when a tenant advertises excessive BGP routes.

### Prerequisites

- Ensure that Azure Operator Nexus Network Fabric is upgraded to the supported version or later.
- Verify that your CE devices are running on compatible software.
- Check that the peer groups for both IPv4 and IPv6 address families are properly set up for internal networks.

### Steps to configure BGP prefix limits

#### Step 1: Define BGP prefix limits

Configure the BGP prefix limits by using the parameters `maximumRoutes` and `threshold`:

- `maximumRoutes`: This parameter defines the maximum number of BGP prefixes that the router accepts from a BGP peer.
- `threshold`: This parameter defines the warning threshold as a percentage of the `maximumRoutes` parameter. When the number of prefixes exceeds this threshold, a warning is generated.

#### Step 2: Configure on the CE device

##### Example 1: BGP prefix limit with automatic restart

This configuration automatically restarts the session after a defined idle time when the prefix limit is exceeded.

```json
{
  "prefixLimits": {
    "maximumRoutes": 5000,
    "threshold": 80,
    "idleTimeExpiry": 100
  }
}
```

Explanation:

- `maximumRoutes`: The limit for the BGP session is 5,000 routes.
- `threshold`: A warning is triggered when the prefix count reaches 80% (4,000 routes).
- `idleTimeExpiry`: If the session is shut down, it restarts automatically after 100 seconds of idle time.

##### Example 2: BGP prefix limit without automatic restart

This configuration shuts down the session when the maximum prefix limit is reached. Manual intervention is required to restart the session.

```json
{
  "prefixLimits": {
    "maximumRoutes": 5000,
    "threshold": 80
  }
}
```

Explanation:

- `maximumRoutes`: The limit for the BGP session is 5,000 routes.
- `threshold`: A warning is triggered when the prefix count reaches 80% (4,000 routes).
- No automatic restart. Manual intervention is required to restart the session.

##### Example 3: Hard-limit drop BGP sessions

This configuration drops extra routes if the prefix limit is exceeded without maintaining a cache of the dropped routes.

```json
{
  "prefixLimits": {
    "maximumRoutes": 5000
  }
}
```

Explanation:

- `maximumRoutes`: The limit for the BGP session is 5,000 routes.
- After the limit is reached, the CE device drops any extra prefixes received from the BGP peer.

##### Example 4: Hard-limit warning only

This configuration generates a warning after the prefix count reaches a certain percentage of the maximum limit but doesn't shut down the session.

```json
{
  "prefixLimits": {
    "maximumRoutes": 8000,
    "threshold": 75,
    "warning-only": true
  }
}
```

Explanation:

- `maximumRoutes`: The limit for the BGP session is 8,000 routes.
- `threshold`: A warning is generated when the prefix count reaches 75% (6,000 routes).
- The session isn't shut down. This configuration is used to generate only a warning without taking any session-terminating action.

#### Step 3: Apply configuration by using the Azure CLI

You can use Azure CLI commands to apply the BGP prefix limits to the external network configuration for Nexus.

- With automatic restart:

   ```bash
   az networkfabric externalnetwork create --resource-group <resource-group> --fabric-name <fabric-name> --network-name <network-name> --prefix-limits '{"maximumRoutes": 5000, "threshold": 80, "idleTimeExpiry": 100}'
   ```

- Without automatic restart:

   ```bash
   az networkfabric externalnetwork create --resource-group <resource-group> --fabric-name <fabric-name> --network-name <network-name> --prefix-limits '{"maximumRoutes": 5000, "threshold": 80}'
   ```

- Hard-limit drop BGP sessions:

   ```bash
   az networkfabric externalnetwork create --resource-group <resource-group> --fabric-name <fabric-name> --network-name <network-name> --prefix-limits '{"maximumRoutes": 5000}'
   ```

- Hard-limit warning only:

   ```bash
   az networkfabric externalnetwork create --resource-group <resource-group> --fabric-name <fabric-name> --network-name <network-name> --prefix-limits '{"maximumRoutes": 8000, "threshold": 75, "warning-only": true}'
   ```

#### Step 4: Monitor and validate the configuration

After you apply the configuration, make sure to monitor the BGP session and validate whether the prefix limits are being enforced properly. Check the status of the BGP session by using the following command:

```bash
show ip bgp summary
```

Look for the session states and the number of prefixes advertised by each peer. If the limits are being hit, you should see the session state change to **Established** or **Idle** based on the configuration.

### Considerations

- **Threshold and maximum limits:** Ensure that you set appropriate thresholds to avoid unnecessary session terminations while still protecting the network from overload.
- **Automatic versus manual restart:** Depending on your network operations, choose between automatic and manual restart options. Automatic restart is useful for minimizing manual intervention. Manual restart might give network administrators more control over recovery.

## Handle BGP prefix limits for different networks

### Internal network

The platform supports layer 3 isolation domain (`L3IsolationDomain`) for tenant workloads. It performs device programming on Nexus instances and Arista devices with peer groups for both IPv4 and IPv6 address families.

### External network option B (provider edge)

For external network configuration, only the hard-limit `warning-only` option is supported. Nexus supports this configuration via the Azure Resource Manager API under `NNI optionBlayer3Configuration` with the `maximumRoutes` parameter.

### NNI option A

For network-to-network interface (NNI) option A, only a single peer group is allowed. IPv4 over IPv6 and vice versa aren't supported. The `warning-only` mode is available for handling prefix limits.

By following the steps in this article, you can configure BGP prefix limits effectively to protect your network from overload. You can help to ensure that BGP sessions are properly managed for both internal and external networks.
