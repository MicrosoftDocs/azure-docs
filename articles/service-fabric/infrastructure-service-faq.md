---
title: Introduction to the Service Fabric Infrastructure Service
description: Frequently asked questions about Service Fabric Infrastructure Service
ms.topic: conceptual
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 07/11/2022
---

# Introduction to the Service Fabric Infrastructure Service
In this article, we describe Infrastructure Service, which is a part of Azure Service Fabric and coordinates between Azure infrastructure updates and cluster health to update the underlying infrastructure safely.

## Infrastructure Service Details

The Service Fabric Infrastructure Service is a system service for Azure clusters that ensures all infrastructure operations are done in a safe manner. The service is responsible for coordinating all infrastructure updates to the underlying virtual machine scale sets with durability level Silver and higher. Typically there's one Infrastructure Service per node type, but there will be three if it's a zone resilient node type. All Platform and Tenant updates on a virtual machine scale set corresponding to these node types take in to account the state of the cluster and potential impact of the update. The service then decides if the operation can take place without compromising the health of the replicas and instances running on the cluster.

The rest of this document covers frequently asked questions about Infrastructure Service: 

## FAQs

### What are the different kinds of updates that are managed by Infrastructure Service?
 * Platform Update - An update to underlying host for the virtual machine scale set initiated by the Azure platform and performed in a safe manner by Upgrade Domain (UD). 
 * Tenant Update - User-initiated update of the scale set such as modifying VM count, config, or modifying guest OS.
 * Tenant Maintainence - User-initiated repair to a single instance of the virtual machine scale set such as a reboot. 
 * Platform Maintainence - Maintenance initiated by Azure Compute on a virtual machine or set of virtual machines on a virtual machine scale set.

### How do I enable Infrastructure Service on my cluster? 
Infrastructure Service is enabled by default in an Azure Service Fabric Cluster if the node type is set to Silver durability or higher. To migrate an existing Bronze node type to Silver durability, follow steps mentioned [here](service-fabric-cluster-capacity.md#changing-durability-levels)

### What is the required instance count for Tenant/Platform updates to be safe? 
A minimum of five instances of the virtual machine scale set is required for the Tenant or Platform updates to be performed safely. However, having five instances doesn't guarantee the operation will proceed. Workloads may configure or require additional restrictions or resources thus increasing the minimum required count. For a virtual machine scale set spanning zones, at-least five instances are required in each zone for the operations to be safe.

### Why are my virtual machine scale sets not getting updated? 
Updates on the virtual machine scale sets can be stuck for longer duration because of any of the following reasons:
  * You've performed multiple updates on the virtual machine scale set and Service Fabric is trying to update the virtual machine in safe manner. Service Fabric will execute them one by one so the duration will be longer.
  * The updates on the virtual machine scale set that you've tried aren't progressing since the Repair Task corresponding to the infrastructure update isn't getting approved. The approval can be blocked due to multiple reasons, but usually is because there is not enough resources to safely progress. The existing replicas and instances need to be placed somewhere else for nodes to go down for update safely. 
  * Other Azure Platform Updates and Tenant Maintainence operations are currently progressing on the node type. Service Fabric is throttling the virtual machine scale set updates until the Platform updates complete, in order to execute the updates in a safe manner. By default, Service Fabric allows at most two infrastructure updates on a scale set at a time. Platform updates aren't stopped, thus they take priority over Tenant updates.

### I see multiple Tenant Update Repair Jobs stuck in Preparing state. What do I do? 
Tenant update jobs that get stuck in Preparing state mean Service Fabric is unable to place existing replicas on the nodes to be updated somewhere else. Generally stuck jobs occur for scenarios such as insufficient capacity or seed node removal that can lead to Repair Task being blocked. Use Service Fabric Explorer to check the corresponding Repair Task associated with the Tenant Update to find out reasons regarding the stuck Tenant Update.

### The Platform or Tenant update is in executing state for quite a while, and blocking my updates. What do I do? 
Platform and Tenant updates acknowledged by Service Fabric are performed by the underlying compute. Service Fabric waits for acknowledgment from Compute platforms when updates have been successfully applied. If the updates are in executing state for long times, customers should reach out to Compute team support to figure out why Platform update isn't  making progress.

### How do I ensure all updates in my cluster are safe? 
All Tenant update operations in a Service Fabric cluster are approved only if determined to be safe by Service Fabric. Updates are blocked when Service Fabric can't ensure if the operations are safe. While this generally removes the need for customers to worry about if a given operation is safe or not, it's advised performing operations after understanding their impact. 

### I want to bypass Infrastructure Service and perform operations on my cluster. How do I do that?
Bypassing Infrastructure Service for any infrastructure updates is a risky operation and can result in stuck updates if the safety checks block the repairs from getting approved.
In certain scenarios, if the default throttling is blocking other updates due to the existing ones not making progress, customers can opt to manually allow more updates. This can be done via the following command, after connecting to the SF cluster:
```powershell
   Invoke-ServiceFabricInfrastructureCommand -ServiceName "fabric:/System/InfrastructureService/<nodetype name>" -Command AllowAction:<MR_Jobid_Guid>:*:Prepare
```
MR_Jobid_Guid used above can be found under the "Infrastructure Jobs" tab at the root of the Service Fabric Explorer, as the JobId of the pending update.
Engage [Service Fabric support](service-fabric-support.md) experts if the above doesn't help.
