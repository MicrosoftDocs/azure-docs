---
title: Service Fabric managed cluster automatic node repair 
description: Learn how Azure Service Fabric managed cluster performs automatic node repair if they go down.
ms.topic: conceptual
ms.date: 07/18/2022
ms.author: ankujain
---
# Azure Service Fabric managed cluster (SFMC) node auto-repair

Service Fabric managed cluster (SFMC) has added the capability to detect and repair unhealthy nodes in a cluster. SFMC continuously monitors the health of nodes and VMs and performs repair actions if they go down or become unhealthy. In this document, you'll learn how automatic node repair works for Windows and Linux nodes.

## How SFMC checks for unhealthy nodes 

Service Fabric managed cluster tracks the health and records the time when a node goes up and down. If a node fails consecutive health checks over a time threshold, SFMC will initiate automatic repair actions on the VM.

## How automatic repair works 

If a VM is identified to be down during the health check at regular intervals, SFMC performs the following repair actions on the VM in order:  

1) Reboot the node.
2) If reboot is unsuccessful, redeploy the node.   
3) If redeploy is unsuccessful, deallocate and start the VM back. 
4) If the deallocation is unsuccessful, reimage the node. 

SFMC waits for nodes to come back up after each action, and if a node does not come up, SFMC proceeds to the next action. No further retries are made if the node is still down after SFMC has tried all the repair actions above. Alternative remediations are investigated by SF engineers if auto-repair is unsuccessful. 

If SFMC finds multiple unhealthy nodes during a health check, each node gets repaired individually before another repair begins. SFMC attempts to repair nodes in the same order they go down.  

## Future Roadmap

1) This is first iteration of auto-repair capability, and we will continue to improve and expand the scope in future.
2) Customers should continue to monitor the health of their cluster and its resources. The goal of this feature is to take off some of the burden of cluster management and operations.
