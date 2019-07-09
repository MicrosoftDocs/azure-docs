--
title: How does agent-based VMware VM migration with Azure Migrate Server Migration work?| Microsoft Docs
description: Provides an overview of agent-based VMware VM migration with Azure Migrate Server Migration.
author: rayne-wiselman
ms.service: azure-migrate
ms.topic: conceptual
ms.date: 07/01/2019
ms.author: raynew
---


# How does VMware agent-based migration work?

This article provides an overview of the architecture and processes used for agent-based VMware VM replication with the Azure Migrate Server Migration tool.

[Azure Migrate](migrate-services-overview.md) provides a central hub to track discovery, assessment, and migration of your on-premises apps and workloads, and AWS/GCP VM instances, to Azure. The hub provides Azure Migrate tools for assessment and migration, as well as third-party independent software vendor (ISV) offerings.

## Migration methods

The Azure Migrate Server Migration tool offers a couple of options for VMware VM migration:

- Migration using agentless replication. Migrate VMs without needing to install anything on them.
- Migration with an agent for replication. Install an agent on the VM for replication.

Learn more about the [considerations for selecting a migration method](server-migrate-overview.md).

## Server Migration and Azure Site Recovery

Azure Migrate Server Migration is a tool for migrating on-premises workloads, and cloud-based VMs to Azure. Site Recovery is a disaster recovery tool. The tools share some common technology components used for replication of data, but serve different purposes. Server Migration and Site Recovery do share some software components.


## Architectural components

![Architecture](./media/agent-based-replication-architecture/architecture.png)

The table summarizes the components used for agent-based migration.

Component | Deployment | Details

**Replication appliance** | The replication appliance (configuration server) is an on-premises machine that acts as a bridge between the on-premises environment and Azure Migrate Server Migration.<br/> The appliance discovers the on-premises VM inventory, so that the Server Migration tool can orchestrate replication and migration. The appliance has two components:<br/><br/> **Configuration server**: Connects to Azure Migrate Server Migration and coordinates replication.<br/> **Process server**: Handles data replication. It receives VM data, compresses and encrypts it, and sends to the Azure subscription. There, Server Migration writes the data to managed disks.<br/> By default the process server is installed together with the configuration server on the replication appliance.
**Mobility service*** | The Mobility service is an agent installed on each machine you want to replicate and migrate. It sends replication data to the process server. There are a number of different Mobility service agents located on the replication appliance. You download and install the agent version you need, in accordance with the operating system and version of the machine you want to replicate.

### Mobility service installation

You can deploy the Mobility Service using the following methods:

**Push installation**: The Mobility service is installed by the process server when you enable protection for a machine. 
**Install manually**: You can install the Mobility service manually on each machine through UI or command prompt.

The Mobility service communicates with the replication appliance and machines being replicated. If you have antivirus software running on the replication appliance, process servers, or machines being replicated, these folders should be excluded from scanning:


- C:\Program Files\Microsoft Azure Recovery Services Agent
- C:\ProgramData\ASR
- C:\ProgramData\ASRLogs
- C:\ProgramData\ASRSetupLogs
- C:\ProgramData\LogUploadServiceLogs
- C:\ProgramData\Microsoft Azure Site Recovery
- C:\Program Files (x86)\Microsoft Azure Site Recovery
- C:\ProgramData\ASR\agent (on Windows machines with the Mobility service installed)

## Replication process

1. When you enable replication for a VM, initial replication to Azure begins.
2. During initial replication the Mobility service reads data from the machines disks and replicates it by sending it to the process server. This data is used to seed a copy of the disk in your Azure subscription. Replication is block-level, and near-continuous.
3. After initial replication finishes, replication of delta changes to Azure begins. The Mobility Service intercepts any writes to disk memory, by integrating with the storage subsystem of the operating system. With this method, disk I/O operations on the replicating machine are avoided for incremental replication. 
4. Tracked changes for a machine are sent to the process server on port HTTPS 9443 inbound. This port can be modified.

## Ports

**Device** | **Connection**
--- | --- 
VMs | The Mobility service running on VMs communicates with the on-premises replication appliance on port HTTPS 443 inbound, for replication management.<br/><br/> VMs send replication data to the process server (running on the replication appliance by default) on port HTTPS 9443 inbound. This port can be modified.
Replication appliance | The replication appliance orchestrates replication with Azure over port HTTPS 443 outbound.
Process server | The process server receives replication data, optimizes and encrypts it, and sends it to Azure storage over port 443 outbound.


## Performance and scaling

By default, you deploy a single replication appliance that runs both the configuration server and the process server. If you're only replicating a few machines, this deployment is sufficient. However, if you're replicating and migrating hundreds of machines, a single process server might not be able to handle all the replication traffic. In this case, you can deploy additional, scale-out process servers.

### Site Recovery Deployment Planner for VMware

If you're replicating VMware VMs, you can use the [Site Recovery Deployment Planner](../site-recovery/site-recovery-deployment-planner.md) for VMware to help determine performance requirements, including the daily data change rate, and the process servers you need.

### Replication appliance capacity

The guidelines in this table can be used to figure out whether you need an additional process server in your deployment.

- If your daily change rate (churn rate) is over 2 TB, deploy an additional process server.
- If you're replicating more than 200 machines, deploy an additional replication appliance.

**CPU** | **Memory** | **Free space for data caching** | **Churn rate** | **Replication limits**
--- | --- | --- | --- | ---
8 vCPUs (2 sockets * 4 cores \@ 2.5 GHz) | 16 GB | 300 GB | 500 GB or less | < 100 machines 
12 vCPUs (2 sockets * 6 cores \@ 2.5 GHz) | 18 GB | 600 GB | 501 GB to 1 TB	| 100-150 machines.
16 vCPUs (2 sockets * 8 cores \@ 2.5 GHz) | 32 G1 TBB | 1 TB to 2 TB | 151-200 machines.

### Scale-out process server sizing

If you need to deploy a scale-out process server, this table can help you to figure out server sizing.

**Process server** | **Free space for data caching** | **Churn rate** | **Replication limits**
--- | --- | --- | --- 
4 vCPUs (2 sockets * 2 cores \@ 2.5 GHz), 8 GB memory | 300 GB | 250 GB or less | Up to 85 machines 
8 vCPUs (2 sockets * 4 cores \@ 2.5 GHz), 12 GB memory | 600 GB | 251 GB to 1 TB	| 86-150 machines.
12 vCPUs (2 sockets * 6 cores \@ 2.5 GHz), 24 GB memory | 1-2 TB | 151-225 machines.

## Control upload throughput

You can limit the amount of bandwidth used to upload data to Azure on each Hyper-V host. Be careful. If you set the values too low it will adversely impact replication, and delay migration.


1. Sign in to the Hyper-V host or cluster node.
2. Run **C:\Program Files\Microsoft Azure Recovery Services Agent\bin\wabadmin.msc**, to open the Windows Azure Backup MMC snap-in.
3. In the snap-in, select **Change Properties**.
4. In **Throttling**, select **Enable internet bandwidth usage throttling for backup operations**. Set the limits for work and non-work hours. Valid ranges are from 512 Kbps to 1,023 Mbps.
I

### Influence upload efficiency

If you have spare bandwidth for replication, and want to increase uploads, you can increase the number of threads allocated for the upload task, as follows:

1. Open the registry with Regedit.
2. Navigate to key HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows Azure Backup\Replication\UploadThreadsPerVM
3. Increase the value for the number of threads used for data upload for each replicating VM. The default value is 4 and the max value is 32. 

## Next steps

Try out agent-based [VMware VM migration](tutorial-migrate-vmware-agent.md) with Azure Migrate Server Migration.
