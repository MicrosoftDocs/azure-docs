---
title: About Azure Site Recovery configuration/process/master target servers
description: This article provides an overview of the configuration, process, and master target servers using when setting up disaster recovery of on-premises VMware VMs to Azure with Azure Site Recovery
ms.topic: conceptual
ms.date: 03/17/2020
---

# About Site Recovery components (configuration, process, master target)

This article describes the configuration, process, and master target servers used by the [Site Recovery](site-recovery-overview.md) service to replicate VMware VMs and physical servers to Azure.

## Configuration server

For disaster recovery of on-premises VMware VMs and physical servers, deploy an on-premises Site Recovery configuration server.

**Setting** | **Details** | **Links**
--- | --- | ---
**Components**  | The configuration server machine runs all on-premises Site Recovery components, which include the configuration server, process server, and master target server.<br/><br/> When you set up the configuration server, all the components are installed automatically. | [Read](vmware-azure-common-questions.md#configuration-server) the configuration server FAQ.
**Role** | The configuration server coordinates communications between on-premises and Azure, and manages data replication. | Learn more about the architecture for [VMware](vmware-azure-architecture.md) and [physical server](physical-azure-architecture.md) disaster recovery to Azure.
**VMware requirements** | For disaster recovery of on-premises VMware VMs, you must install and run the configuration server as a on-premises, highly available VMware VM. | [Learn about](vmware-azure-deploy-configuration-server.md#prerequisites) the prerequisites.
**VMware deployment** | We recommend that you deploy the configuration server using a downloaded OVA template. This method provides a simply way to set up a configuration server that complies with all requirements and prerequisites.<br/><br/> If for some reason you're unable to deploy a VMware VM using an OVA template, you can set up the configuration server machines manually, as described below for physical machine disaster recovery. | [Deploy](vmware-azure-deploy-configuration-server.md#deploy-a-configuration-server-through-an-ova-template) with an OVA template.
**Physical server requirements** | For disaster recovery on on-premises physical servers, you deploy the configuration server manually. | [Learn about](physical-azure-set-up-source.md#prerequisites) the prerequisites.
**Physical server deployment** | If it can't be installed as a VMware VM, you can install it on a physical server. | [Deploy](physical-azure-set-up-source.md#set-up-the-source-environment) the configuration server manually.

## Process server

A process server handles replication data during failover and failback, and installs the Mobility service for on-premises VMware VMs and physical servers.

**Setting** | **Details** | **Links**
--- | --- | ---
**Deployment**  | By default, when the configuration server is deployed the process server is installed. <br/><br/> An on-premises process server is needed for disaster recovery and replication of on-premises VMware VMs and physical servers. | [Learn more](vmware-azure-architecture.md#architectural-components).
**Role (on-premises**) | Receives replication data from machines enabled for replication. <br/><br/> Optimizes replication data with caching, compression, and encryption, and sends it to Azure Storage. <br/><br/> Performs a push installation of the Site Recovery Mobility service on on-premises VMware VMs and physical servers that you want to replicate. <br/><br/> Performs automatic discovery of on-premises machines. | [Learn more](vmware-azure-enable-replication.md).
**Role (failback from Azure)** | After failover from your on-premises site, you set up a process server in Azure, as an Azure VM, to handle failback to your on-premises location.<br/><br/> The process server in Azure is temporary. The Azure VM can be deleted after failback is done. | [Learn more](vmware-azure-set-up-process-server-azure.md).
**Scaling** | For larger deployments, on-premises you can set up additional, scale-out process servers. Additional servers scale out capacity, by handling larger numbers of replicating machines, and larger volumes of replication traffic.<br/><br/> You can move machines between two process servers, in order to load balance replication traffic. | [Learn more](vmware-azure-set-up-process-server-scale.md).

## Master target server

The master target server handles replication data during failback from Azure.

- By default, the master target server is installed on the configuration server.
- For large deployments, you can add an additional, separate master target server for failback.

## Next steps

- Review the [architecture](vmware-azure-architecture.md) for disaster recovery of VMware VMs and physical servers.
- Review the [requirements and prerequisites](vmware-physical-azure-support-matrix.md) for disaster recovery of VMware VMs and physical servers to Azure.
