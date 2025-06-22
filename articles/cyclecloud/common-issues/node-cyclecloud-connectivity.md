---
title: Common Issues - Node Connectivity
description: Azure CycleCloud common issue - Node Connectivity
author: adriankjohnson
ms.date: 11/15/2019
ms.author: adjohnso
---
# Common Issues: Node to CycleCloud Connectivity

CycleCloud installs an agent on each virtual machine that needs to communicate with the CycleCloud application. The agent reports status and monitoring and makes API requests for autoscaling and distributed synchronization.

We recommend deploying the application server in the same virtual network as the cluster. If this configuration isn't feasible, establish connectivity by doing [virtual network peering](../network-connectivity.md#virtual-network-peering) or using a [proxy node](../network-connectivity.md#proxy-node). These error messages indicate that nodes can't communicate with the CycleCloud application server.

## Possible error messages
- `Timeout awaiting system boot-up`
- `Timed out connecting to CycleCloud at {https://A.B.C.D}`
- `Connection refused to CycleCloud through return-proxy tunnel at {https://A.B.C.D:37140}`
- `Unable to setup return proxy: cannot connect to {A.B.C.D:22}`
- `Could not connect to`
- `Certificate validation failed for CycleCloud`

## Resolution

- If the CycleCloud server and the cluster are in the same virtual network, check the network security groups for the subnets in the virtual network. Cluster nodes need to reach the CycleCloud server at TCP 9443 and 5672. In the other direction, Azure CycleCloud needs to reach ganglia (TCP 8652) and SSH (TCP 22) ports of the cluster for system and job monitoring.

- You might need to add a public IP address.

- If the error message indicates a return proxy, check the [return proxy settings](../how-to/return-proxy.md).

- After updating network or proxy settings, test connectivity by SSHing into the node as the cyclecloud user and using `curl -k {https://error-message-url}`.

- After validating that network connectivity is fixed, terminate and restart the node.

## More information

[Learn more about network connectivity](../network-connectivity.md).
[Learn more about return proxy](../how-to/return-proxy.md).