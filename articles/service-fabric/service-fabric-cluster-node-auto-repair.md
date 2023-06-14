---
title: Service Fabric managed cluster automatic node repair 
description: Learn how Azure Service Fabric managed cluster performs automatic node repair if they go down.
ms.topic: conceptual
ms.date: 07/18/2022
ms.author: ankujain
---
# Azure Service Fabric managed cluster (SFMC) node auto-repair

Service Fabric managed cluster (SFMC) has added a capability to help keep a cluster healthy automatically via node auto-repair, further reducing operational management required. This new capability will detect when nodes are down in a cluster and attempt to repair them without customer intervention. In this document, you'll learn how automatic node repair works for Service Fabric managed cluster nodes.

## How SFMC checks when nodes are down 

Service Fabric managed cluster continuously monitors the health of nodes and records the time when a node goes up and down. If a node is detected to be down for a pre-defined period, SFMC initiates automatic repair actions on the node. This pre-defined period is currently configured to be 24 hours at launch and can be optimized in future.

## How automatic repair works

SFMC performs the following repair actions on the underlying Virtual Machine (VM) if Service Fabric node is detected down for 24 hours:

1) Reboot the underlying VM for the node.
2) If reboot doesn't bring up the node, redeploy the node.   
3) If redeploy is unsuccessful to bring up the node, deallocate and start the VM back. 
4) If the deallocation doesn't bring up the node, reimage the node.

SFMC waits for nodes to come back up after each action, and if a node doesn't come up, SFMC proceeds to the next action. Node auto-repair actions typically take approximately 30 minutes once started, but can take upwards of three hours to iterate through and complete the full set of actions described. No further retries are made if the node is still down after SFMC has tried all the repair actions above. Alternative remediations will be investigated by SF engineers if auto-repair doesn't bring the node up. 

If SFMC finds multiple nodes to be down during a health check, each node gets repaired individually before another repair begins. SFMC attempts to repair nodes in the same order that they're detected down.

While node auto-repair covers the above scenario described, customers should continue to monitor the health of their cluster and its resources. The goal of this feature is to take off some of the burden of cluster management and operations.

## Future Roadmap

This launch is the first iteration of node auto-repair capability, and SFMC will continue to improve and expand the scope in future.

## Next steps
> [!div class="nextstepaction"]
> [Read about Service Fabric managed cluster configuration options](how-to-managed-cluster-configuration.md)
