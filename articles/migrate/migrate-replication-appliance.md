---
title: Azure Migrate replication appliance architecture | Microsoft Docs
description: Provides an overview of the Azure Migrate replication appliance
author: rayne-wiselman
ms.service: azure-migrate
ms.topic: conceptual
ms.date: 07/01/2019
ms.author: raynew
---


# Azure Migrate replication appliance

This article describes the Azure Migrate replication appliance architecture and usage. 

[Azure Migrate](migrate-overview.md) provides a hub of tools that help you to discover, assess, and migrate apps, infrastructure, and workloads to Microsoft Azure. The hub includes Azure Migrate tools, and third-party independent software vendor (ISV) offerings. The Azure Migrate replication appliance is used when you use the Azure Migrate Server Migration to migrate VMware VMs to Azure using an agent-based migration process.

 

## Appliance overview

The Azure Migrate appliance is deployed as follows.

**Deploy as** | **Used for** | **Details**
--- | --- |  ---
VMware VM | VMware VM migration when doing agent-based migration with the Azure Migrate Migration tool. | Download OVA template and import to vCenter Server.

## Appliance deployment requirements

[Review](migrate-support-matrix-vmware.md#agent-based-migration-replication-appliance-requirements) the deployment requirements.



## Appliance license
The appliance comes with a Windows Server 2016 evaluation license, which is valid for 180 days. If the evaluation period is close to expiry, we recommend that you download and deploy a new appliance, or that you activate the operating system license of the appliance VM.

## Replication process

1. When you enable replication for a VM, initial replication to Azure storage begins, using the specified replication policy. 
2. Traffic replicates to Azure storage public endpoints over the internet. Alternately, you can use Azure ExpressRoute with [Microsoft peering](../expressroute/expressroute-circuit-peerings.md#microsoftpeering). Replicating traffic over a site-to-site virtual private network (VPN) from an on-premises site to Azure isn't supported.
3. After initial replication finishes, replication of delta changes to Azure begins. Tracked changes for a machine are sent to the process server.
4. Communication happens as follows:

    - VMs communicate with the replication appliance on port HTTPS 443 inbound, for replication management.
    - The replication appliance orchestrates replication with Azure over port HTTPS 443 outbound.
    - VMs send replication data to the process server (running on the replication appliance) on port HTTPS 9443 inbound. This port can be modified.
    - The process server receives replication data, optimizes and encrypts it, and sends it to Azure storage over port 443 outbound.
1. The replication data logs first land in a cache storage account in Azure. These logs are processed and the data is stored in an Azure managed disk (**asr seed disk**). The recovery points are created on this disk.


## Appliance upgrades

The appliance is upgraded as the Azure Migrate agents running on the appliance are updated.

- This happens automatically because the auto-update is enabled on the appliance by default.
- You can change this default setting to update the agents manually. 

### Set agent updates to manual


Make sure that you update all the agents on the appliance at the same time, using the **Update** button for each outdated agent on the appliance.

You can switch this setting back to automatic updates at any time.

## Next steps

[Learn how](tutorial-assess-vmware.md#set-up-the-appliance-vm) to set up the appliance for VMware.
[Learn how](tutorial-assess-hyper-v.md#set-up-the-appliance-vm) to set up the appliance for Hyper-V.

