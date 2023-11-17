---
title: Return Proxy Enable
description: Learn about the Azure CycleCloud return proxy. Learn how to designate a cluster node as a return proxy with listening ports on CycleCloud server forwarded through an SSH tunnel.
author: KimliW
ms.date: 03/01/2020
ms.author: adjohnso
---

# Enable Return Proxy

Nodes in a cluster need to communicate with the Azure CycleCloud server to
report status, as well as making API requests for auto-scaling and distributed
synchronization. Nodes communicate with HTTPS to CycleCloud on its private 9443 port.

If network topology or firewalls prevent communication between the Azure
CycleCloud server and cluster nodes, a node in the cluster can be designated as
a **return proxy** with the listening port on Azure CycleCloud server forwarded
through an SSH tunnel. The cluster nodes will then reach the CycleCloud server
via port 37140 on the proxy. A typical deployment has the cluster
head node designated as the return proxy, but any persistent node can play that
same role.

::: moniker range="=cyclecloud-7"

CycleCloud 7 includes an AMQP broker for getting messages from nodes in a cluster, instead of HTTPS.
The AMQP broker listens locally on port 5672. If a return proxy is used, port 37141 on the proxy node is forwarded to 5672.

::: moniker-end

The settings for enabling or disabling the return proxy can be found in the
Advanced Settings section of the create cluster dialog. 

::: moniker range="=cyclecloud-7"
:::image type="content" source="~/images/version-7/return-proxy-setup.png" alt-text="Return Proxy Setting":::

::: moniker-end

::: moniker range=">=cyclecloud-8"
:::image type="content" source="~/images/version-8/return-proxy-setup.png" alt-text="Return Proxy Setting":::
::: moniker-end

- Azure CycleCloud currently only supports Linux VMs as a return proxy.
- If the CycleCloud VM and the return proxy node resides in different VMs, the
  return proxy node will require a public IP address unless the two [VNETs are
  peered](/azure/virtual-network/virtual-network-peering-overview).


## Custom Return Proxy Node

To demarcate a node as the return proxy, add the following attributes to the
node definition:

``` ini
[[node proxy]]
IsReturnProxy = true  # access to CycleServer is proxied through this node
KeyPairLocation = ~/.ssh/custom-keypair.pem
```

- `IsReturnProxy` specifies that the node is the proxy. Only one node should be
  the designated proxy or the cluster will fail to start
- `KeyPairLocation` determines the SSH private key used to start the SSH tunnel.
  This SSH connection is initiated with the `cyclecloud` user by default

The return proxy is assumed to be running within the same Azure VNET as the
nodes of the cluster, and by default the private network address of the proxy is
used for the nodes to communicate with it. However it is possible to specify
that the public IP address of the proxy node be used for inter-node
communication instead. To do so include the attribute `ReturnProxyAddress =
public` when defining the proxy node.

Please note that `proxy` node in this cluster template only proxies
communication from nodes to CycleCloud. It does not proxy communication to the
larger Internet.
