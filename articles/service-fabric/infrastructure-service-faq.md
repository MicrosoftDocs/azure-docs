---
title: Infrastructure Service frequently asked questions 
description: Frequently asked questions about Service Fabric Infrastructure Service

ms.topic: troubleshooting
ms.date: 012/21/2021
ms.author: saharsh
---

# Frequently asked questions about Infrastructure Service 

Infrastructure Service is a system service of Azure Service Fabric, which is responsible for coordinating all Infrastructure related updates to the underlying virtual machine scale sets with Service Fabric cluster and ensuring all operations on the clusters are performed in a safe manner. It is available for all node types with Durability level Silver and above. 

This document covers most of the frequently asked questions about Infrastructure Service: 

## FAQ's 

### Why are my virtual machine scale sets not getting updated? 
Updates on the virtual machine scale sets can be stuck for longer duration due to any of the following reasons:
  1. You have performed multiple updates on the virtual machine scale set and Service fabric is trying to updatet the virtual machine in safe manner, thus executing them one by one. 
  2. The updates on the virtual machine scale set that you have tried is not getting through since the Repair Task corresponding to the infrastructure update is not getting approved. It can be due to multiple reasons, mostly suggesting that the operation is either unsafe/ there is not enough space for the existing replicas/instances to be placed for the existing nodes to go down for update. 
  3. Other Azure Platform Updates and Tenant Maintainence operations are currently progressing on the node type, and Service fabric is throttling the virtual machine scale set updates until the Platform updates complete , in order to execute the updates in a safe manner.



### I see multiple Platform/Tenant update Repair Jobs stuck in Preparing state. What do I do? 

If the Platform/Tenant update jobs are stuck in Preparing state for long, it could mean Service fabric is unable to take down existing replicas on the existing nodes to be updated and place them some where else.  Mostly , it occurs in case of insufficient capacity, seed node removal etc which can lead 

### How do I ensure all updates in my cluster are safe? 
All Tenant update operations in a Service fabric clusters are carried out if and only if the operations are deemed to be safe by Service Fabric. They are blocked in case Service Fabric cannot ensure if the operations are safe. Customer does not need to care about if the operation is safe or not. However it is highly advised to perform operations only after understading its impact, otherwise the updates would remain blocked and other operations on virtual machine scale set would be affected.

### Is there any way to use Infrasturcture Service for any other operations. 

### I want to bypass Infrastructure Service and perform operations on my cluster. How do I do that ?
You can use this/tool in order to approve Tenant Updates on your cluster. However, be very sure before doing so, since its a potentially dangerous operation and can lead to weird situations and potential data loss. 


