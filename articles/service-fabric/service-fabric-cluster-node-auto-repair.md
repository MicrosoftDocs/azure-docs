---
title: Service Fabric managed cluster automatic node repair 
description: Learn how Azure Service Fabric managed cluster performs automatic node repair if they go down.
ms.topic: conceptual
ms.date: 07/18/2022
ms.author: ankujain
---
# Azure Service Fabric managed cluster (SFMC) node auto-repair

Service Fabric managed cluster (SFMC) has added a capability to detect when nodes are down in a cluster and repair them. SFMC continuously monitors the health of nodes and performs repair actions if they go down. In this document, you'll learn how automatic node repair works for Service Fabric nodes.

## How SFMC checks when nodes are down 

Service Fabric managed cluster tracks node health and records the time when a node goes up and down. If a node is down for an extended period, SFMC will initiate automatic repair actions on the node.

## How automatic repair works

SFMC performs the following repair actions on the VM if Service Fabric node is down for an extended period:

1) Reboot the VM.
2) If reboot doesn't bring the node up, redeploy the node.   
3) If redeploy doesn't work, deallocate and start the VM back. 
4) If the deallocation is unsuccessful, reimage the node.

SFMC waits for nodes to come back up after each action, and if a node does not come up, SFMC proceeds to the next action. No further retries are made if the node is still down after SFMC has tried all the repair actions above. Alternative remediations are investigated by SF engineers if auto-repair doesn't bring the node up. 

If SFMC finds multiple nodes to be down during a health check, each node gets repaired individually before another repair begins. SFMC attempts to repair nodes in the same order they go down.  

## Future Roadmap

1) This is first iteration of auto-repair capability, and we will continue to improve and expand the scope in future.
2) Customers should continue to monitor the health of their cluster and its resources. The goal of this feature is to take off some of the burden of cluster management and operations.

## Next steps
> [!div class="nextstepaction"]
> [Read about Service Fabric managed cluster configuration options](how-to-managed-cluster-configuration.md)
