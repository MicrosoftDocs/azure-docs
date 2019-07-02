---
title: Azure Migrate appliance architecture | Microsoft Docs
description: Provides an overview of the Azure Migrate appliance
author: rayne-wiselman
ms.service: azure-migrate
ms.topic: conceptual
ms.date: 07/01/2019
ms.author: raynew
---


# Azure Migrate appliance

This article describes the Azure Migrate appliance architecture and usage. 

[Azure Migrate](migrate-overview.md) provides a hub of tools that help you to discover, assess, and migrate apps, infrastructure, and workloads to Microsoft Azure. The hub includes Azure Migrate tools, and third-party independent software vendor (ISV) offerings. The Azure Migrate appliance is used when you use Azure Migrate tools to assess and migrate to Azure. 

 

## Appliance overview

The Azure Migrate appliance is deployed as follows.

**Deploy as** | **Used for** | **Details**
--- | --- |  ---
VMware VM | VMware VM assessment with the Azure Migrate Assessment tool. | Download OVA template and import to vCenter Server.
VMware VM | VMware VM migration when doing agentless migration with the Azure Migrate Migration tool. | Download OVA template and import to vCenter Server.
Hyper-V VM | Hyper-V VM assessment with the Azure Migrate Assessment tool. | Download zipped VHD and import to Hyper-V.

## Appliance access

After you have configured the appliance, you can remotely access the appliance VM through TCP port 3389. You can also remotely access the appliance management app on port 44368 using the URL: https://<appliance-ip-or-name>:44368.

## Appliance license
The appliance comes with a Windows Server 2016 evaluation license, which is valid for 180 days. If the evaluation period is close to expiry, we recommend that you download and deploy a new appliance, or that you activate the operating system license of the appliance VM.

## Appliance agents
The appliance has these agents installed.

**Agent** | **Details**
--- | ---
Discovery agent | Collects VM configuration metadata
Assessment agent | 
Migration adapter |
Migration gateway | 
Management app | 


## Appliance deployment requirements

- [Review](migrate-support-matrix-vmware.md#assessment-appliance-requirements) the deployment requirements for a VMware appliance.
- [Review](migrate-support-matrix-hyper-v.md#assessment-appliance-requirements) the deployment requirements for a Hyper-V appliance.


## Collected data

Here's what the appliance collects.

### VMware data

The appliance collects metadata and performance-related data from the VMs and sends it to Azure.

**Action** | **Details**
--- | ---
**Collected metadata** | vCenter VM name<br/> vCenter VM path (host/cluster/folder)<br/> IP and MAC addresses<br/> Operating system<br/> Number of cores/disks/NICs<br/> Memory and disk size.
**Collected performance data** | CPU/memory usage<br/> Per disk data (disk read/write throughput; disk reads/writes per second)<br/> NIC data (network in, network out).<br/><br/> Performance data is collected continually after the appliance connects to vCenter Server. Historical data isn't collected.

### Hyper-V data

**Action** | **Details**
--- | ---
**Collected metadata** | VM name<br/> VM path <br/> IP and MAC addresses<br/> Operating system<br/> Number of cores/disks/NICs<br/> Memory and disk size<br/> Disk IOPS, disk throughput (MBps), network output (MBps)
**Collected performance data** |  CPU/memory usage<br/> Per disk data (disk read/write throughput; disk reads/writes per second)<br/> NIC data (network in, network out).<br/><br/> Performance data is collected continually after the appliance connects to the Hyper-V host. Historical data isn't collected.

## Discovery and collection process

The appliance communicates with vCenter Servers and Hyper-V hosts/cluster using the following process.


1. **Start discovery**:
    - When you start the discovery on the Hyper-V appliance, it communicates with the Hyper-V hosts on WinRM ports 5985 (HTTP) and 5986 (HTTPS).
    - When you start discovery on the VMware appliance, it communicates with the vCenter server on TCP port 443 by default. IF the vCenter server listens on a different port, you can configure it in the appliance web app.
2. **Gather metadata and performance data**:
    - The appliance uses a Common Information Model (CIM) session to gather Hyper-V VM data from the Hyper-V host on ports 5985 and 5986.
    - The appliance communicates with port 443 by default, to gather VMware VM data from the vCenter Server.
3. **Send data**: The appliance sends the collected data to Azure Migrate Server Assessment and Azure Migrate Server Migration over SSL port 443.
4. **Assess and migrate**: You can now create assessments from the metadata collected by the appliance using Azure Migrate Server Assessment. In addition, you can also start migrating VMware VMs using Azure Migrate Server Migration to orchestrate agentless VM replication.


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

