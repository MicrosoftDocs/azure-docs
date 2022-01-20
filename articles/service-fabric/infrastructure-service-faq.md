---
title: Infrastructure Service frequently asked questions 
description: Frequently asked questions about Service Fabric Infrastructure Service

ms.topic: troubleshooting
ms.date: 12/21/2021
ms.author: saharsh
---

# Frequently asked questions about Infrastructure Service 

Infrastructure Service is a system service of Azure Service Fabric, which is responsible for coordinating all Infrastructure updates to the underlying virtual machine scale sets in a Service Fabric cluster. It ensures all operations on the clusters are done in a safe manner. There is generally a single Infrastructure Service for a node type(however there can be more than 1 if the nodetype spans across availability zones). It is available for all node types with Durability level Silver and above. All Platform and Tenant updates on a virtual machine scale set corresponding to these node types go via Infrastructure Service, where it looks at the state of the cluster as well as the potential impact of the update, and then decides if the operation can take place without compromising the health of the replicas and instances running on the cluster. 

This document covers most of the frequently asked questions about Infrastructure Service: 

## FAQs 

### What are the different kinds of updates that are managed by Infrastructure Service?
  1. Platform Updates - Updates to underlying host for the virtual machine scale set. These are initiated by the Azure platform and performed in a safe and UD by UD manner. 
  2. Tenant Updates - Updates to the virtual machine scale set initiated by the user. It mostly occurs due to any change in the configuration of the scale set. 
  3. Tenant Maintainence - Updates to a single instance of the virtual machine scale set, like restarting it. 
  4. Platform Maintainence - Maintainence work scheduled on the virtual machines or set of virtual machines on a virtual machine scale set.

### How do I enable Infrastructure Service on my cluster? 
Infrastructure Service is enabled by default in a Service Fabric Cluster if the nodetype is of Silver durability and above. To migrate existing Bronze node type to Silver durability, follow steps mentioned [here](service-fabric-cluster-capacity.md#changing-durability-levels)

### What is the minimum requirement of instance count for Tenant/Platform updates to be safe? 
Minimum of five instances of the virtual machine scale set is required for the Tenant/Platform updates to be performed safely. However, having five instances does not guarantee the operation would proceed, the hosted application/services may put more restriction thus increasing the minimum required count. For a virtual machine scale set spanning zones, at-least five instances are required in each zone for the operations to be safe.

### Why are my virtual machine scale sets not getting updated? 
Updates on the virtual machine scale sets can be stuck for longer duration because of any of the following reasons:
  1. You have performed multiple updates on the virtual machine scale set and Service fabric is trying to update the virtual machine in safe manner, thus executing them one by one. 
  2. The updates on the virtual machine scale set that you have tried is not getting through since the Repair Task corresponding to the infrastructure update is not getting approved. It can be due to multiple reasons, mostly suggesting that the operation is either unsafe/ there is not enough space for the existing replicas/instances to be placed for the existing nodes to go down for update. 
  3. Other Azure Platform Updates and Tenant Maintainence operations are currently progressing on the node type, and Service fabric is throttling the virtual machine scale set updates until the Platform updates complete, in order to execute the updates in a safe manner. By default, Service Fabric allows at most two infrastructure updates on a scale set at a time(Platform updates are not stopped, thus they take preference over Tenant updates).

### I see multiple Tenant update Repair Jobs stuck in Preparing state. What do I do? 
If the Tenant update jobs are stuck in Preparing state for long, it could mean Service fabric is unable to replace existing replicas on the nodes to be updated and place them somewhere else. Mostly, it occurs if there is insufficient capacity, seed node removal etc. that can lead to repair task being blocked. Check the corresponding Repair Task associated with the Tenant Update to find out reasons regarding the stuck Tenant Update.

### The Platform/Tenant update is in executing state for quite a while, and thus blocking my updates. What do I do? 
Platform/Tenant updates once acknowledged and by Service fabric are performed by the underlying compute. Service Fabric waits for acknowledgment from Compute platforms when updates have been successfully applied. If the updates are in executing state for long times, customers should reach out to Compute teams to figure out why Platform update is not making progress.

### How do I ensure all updates in my cluster are safe? 
All Tenant update operations in a Service fabric clusters are carried out if and only if the operations are deemed to be safe by Service Fabric. They are blocked in case Service Fabric cannot ensure if the operations are safe. Customer does not need to worry about if the operation is safe or not. However it is highly advised to perform operations only after understanding its impact, otherwise the updates would remain blocked and other operations on virtual machine scale set would be affected.

### I want to bypass Infrastructure Service and perform operations on my cluster. How do I do that?
By passing Infrastructure service for any infrastructure updates is potentially risky operation and it is not advised to do so. It is advised to engage for support of Service Fabric experts before deciding to perform these steps.  


