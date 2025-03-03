---
title: Common Issues - Node Connectivity
description: Azure CycleCloud common issue - Node Connectivity
author: adriankjohnson
ms.date: 11/15/2019
ms.author: adjohnso
---
# Common Issues: Node to CycleCloud Connectivity

Cyclecloud installs an agent on each VM that needs to be able to communicate back to the CycleCloud application in order to report status, monitoring, as well as to make API requests for auto-scaling and distributed synchronization.

It is recommended that the application server be deployed in the same VNET (virtual network) as the cluster. Where this is not feasible, connectivity may be established by doing [VNET peering](../network-connectivity.md#vnet-peering) or using a [proxy node](../network-connectivity.md#proxy-node). These error messages indicate that nodes are unable to communicate back to the CycleCloud application server.

## Possible Error Messages
- `Timeout awaiting system boot-up`
- `Timed out connecting to CycleCloud at {https://A.B.C.D}`
- `Connection refused to CycleCloud through return-proxy tunnel at {https://A.B.C.D:37140}`
- `Unable to setup return proxy: cannot connect to {A.B.C.D:22}`
- `Could not connect to`
- `Certificate validation failed for CycleCloud`

## Resolution

- If the CycleCloud server and the cluster is in the same VNET, check the network security groups for the subnets in the VNET. Cluster nodes need to be able to reach the CycleCloud server at TCP 9443 and 5672. In the other direction, Azure CycleCloud needs to be able to reach ganglia (TCP 8652) and SSH (TCP 22) ports of the cluster for system and job monitoring.

- You may need to add a public IP address.

- If the error message indicates a return proxy, check the [return proxy settings](../how-to/return-proxy.md).

- After updating network or proxy settings, you can test connectivity by SSHing into the node as the cyclecloud user and using `curl -k {https://error-message-url}`.

- After validating that network connectivity is fixed, you will need to terminate and restart the node.

## More Information

[Read more about network-connectivity here](../network-connectivity.md)
[Read more about return proxy here](../how-to/return-proxy.md)