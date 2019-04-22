---
title: Azure CycleCloud Return Proxy Enable | Microsoft Docs
description: Enable Return Proxy for Azure CycleCloud.
author: KimliW
ms.date: 08/01/2018
ms.author: adjohnso
---

# Enable Return Proxy

Nodes in a cluster need to communicate with the Azure CycleCloud server to report status, as well as making API requests for auto-scaling and distributed synchronization. Both HTTPS and AMQP protocols are used with the default TCP ports (443 and 5672 respectively).

If network topology or firewalls prevent communication between the Azure CycleCloud server and cluster nodes, a node in the cluster can be designated as a **return proxy** with the listening ports on Azure CycleCloud server forwarded through an SSH tunnel. The cluster nodes will then reach the CycleCloud server via ports 37140 and 37141 on the proxy. A typical deployment has the cluster head node designated as the return proxy, but any persistent node can play that same role.

Azure CycleCloud currently only supports Linux VMs as a return proxy.

To demarcate a node as the return proxy, add the following attributes to the node definition:

``` ini
[[node proxy]]
IsReturnProxy = true  # access to CycleServer is proxied through this node
KeyPairLocation = ~/.ssh/custom-keypair.pem
```

- `IsReturnProxy` specifies that the node is the proxy. Only one node should be the designated proxy or the cluster will fail to start
- `KeyPairLocation` determines the SSH private key used to start the SSH tunnel. This SSH connection is initiated with the `cyclecloud` user by default

The return proxy is assumed to be running within the same Azure VNET as the nodes of the cluster, and by default the private network address of the proxy is used for the nodes to communicate with it. However it is possible to specify that the public IP address of the proxy node be used for inter-node communication instead. To do so include the attribute `ReturnProxyAddress = public` when defining the proxy node.
