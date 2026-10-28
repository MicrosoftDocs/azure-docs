---
title: Common Issues - Node Connectivity
description: Troubleshoot connectivity issues between Azure CycleCloud nodes and the CycleCloud application server.
author: adriankjohnson
ai-usage: ai-assisted
ms.date: 08/10/2026
ms.topic: troubleshooting-problem-resolution
ms.author: adjohnso
---
# Common issues: Node to CycleCloud connectivity

CycleCloud installs an agent on each virtual machine that needs to communicate with the CycleCloud application. The agent reports status and monitoring data and makes API requests for autoscaling and distributed synchronization.

We recommend deploying the application server in the same virtual network as the cluster. If you can't use this configuration, establish connectivity by doing [virtual network peering](../network-connectivity.md#virtual-network-peering) or using a [proxy node](../network-connectivity.md#proxy-node). These error messages indicate that nodes can't communicate with the CycleCloud application server.

## Possible error messages
- `Timeout awaiting system boot-up`
- `Timed out connecting to CycleCloud at {https://A.B.C.D}`
- `Connection refused to CycleCloud through return-proxy tunnel at {https://A.B.C.D:37140}`
- `Unable to setup return proxy: cannot connect to {A.B.C.D:22}`
- `Could not connect to`
- `Certificate validation failed for CycleCloud`

## Resolution

- If the CycleCloud server and the cluster are in the same virtual network, check the network security groups for the subnets in the virtual network. In CycleCloud 8, cluster nodes need to reach the CycleCloud server on TCP port 9443. CycleCloud needs to reach TCP port 22 on managed cluster nodes when it uses SSH for orchestration, system access, or job monitoring. CycleCloud 8 retrieves cluster metrics from Azure Monitor. For all direct and return-proxy rules, see the [CycleCloud ports and traffic matrix](../how-to/network-security.md#required-ports-and-traffic).

- For CycleCloud 7, cluster nodes also need to reach TCP port 5672 on the CycleCloud server, and the CycleCloud server needs to reach TCP port 8652 on a Ganglia primary node.

- Add a public IP address.

- Check the [return proxy settings](../how-to/return-proxy.md) if the error message indicates a return proxy.

- After updating network or proxy settings, test connectivity by SSHing into the node as the cyclecloud user and using `curl -k {https://error-message-url}`.

- After validating that network connectivity is fixed, terminate and restart the node.

## More information

[Learn more about network connectivity](../network-connectivity.md).
[Learn more about return proxy](../how-to/return-proxy.md).