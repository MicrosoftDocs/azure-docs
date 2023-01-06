---
title: VMware disaster recovery with Azure Site Recovery
description: This article provides an overview of disaster recovery of VMware VMs to Azure using the Azure Site Recovery service.
ms.service: site-recovery
ms.topic: conceptual
ms.date: 08/19/2021
ms.author: ankitadutta
author: ankitaduttaMSFT
---

# About disaster recovery of VMware VMs to Azure

This article provides an overview of disaster recovery for on-premises VMware VMs to Azure using the [Azure Site Recovery](site-recovery-overview.md) service.

>[!NOTE]
>You can now move your existing replicated items to modernized VMware disaster recovery experience. [Learn more](move-from-classic-to-modernized-vmware-disaster-recovery.md).

## What is BCDR?

A business continuity and disaster recovery (BCDR) strategy helps keep your business up and running. During planned downtime and unexpected outages, BCDR keeps data safe and available, and ensures that apps continue running. In addition to platform BCDR features such as regional pairing, and high availability storage, Azure provides Recovery Services as an integral part of your BCDR solution. Recovery services include:

- [Azure Backup](../backup/backup-overview.md) backs up your on-premises and Azure VM data. You can back up a file and folders, specific workloads, or an entire VM.
- [Azure Site Recovery](site-recovery-overview.md) provides resilience and disaster recovery for apps and workloads running on on-premises machines, or Azure IaaS VMs. Site Recovery orchestrates replication, and handles failover to Azure when outages occur. It also handles recovery from Azure to your primary site.

> [!NOTE]
> Site Recovery does not move or store customer data out of the target region, in which disaster recovery has been setup for the source machines. Customers may select a Recovery Services Vault from a different region if they so choose. The Recovery Services Vault contains metadata but no actual customer data.

## How does Site Recovery do disaster recovery?

1. After preparing Azure and your on-premises site, you set up and enable replication for your on-premises machines.
2. Site Recovery orchestrates initial replication of the machine, in accordance with your policy settings.
3. After the initial replication, Site Recovery replicates delta changes to Azure.
4. When everything's replicating as expected, you run a disaster recovery drill.
    - The drill helps ensure that failover will work as expected when a real need arises.
    - The drill performs a test failover without impacting your production environment.
5. If an outage occurs, you run a full failover to Azure. You can fail over a single machine, or you can create a recovery plan that fails over multiple machines at the same time.
6. On failover, Azure VMs are created from the VM data in Managed disks or storage accounts. Users can continue accessing apps and workloads from the Azure VM
7. When your on-premises site is available again, you fail back from Azure.
8. After you fail back and are working from your primary site once more, you start replicating on-premises VMs to Azure again.


## How do I know if my environment is suitable for disaster recovery to Azure?

Site Recovery can replicate any workload running on a supported VMware VM or physical server. Here are the things you need to check in your environment:

- If you're replicating VMware VMs, are you running the right versions of VMware virtualization servers? [Check here](vmware-physical-azure-support-matrix.md#on-premises-virtualization-servers).
- Are the machines you want to replicate running a supported operating system? [Check here](vmware-physical-azure-support-matrix.md#replicated-machines).
- For Linux disaster recovery, are machines running a supported file system/guest storage? [Check here](vmware-physical-azure-support-matrix.md#linux-file-systemsguest-storage)
- Do the machines you want to replicate comply with Azure requirements? [Check here](vmware-physical-azure-support-matrix.md#azure-vm-requirements).
- Is your network configuration supported? [Check here](vmware-physical-azure-support-matrix.md#network).
- Is your storage configuration supported? [Check here](vmware-physical-azure-support-matrix.md#storage).


## What do I need to set up in Azure before I start?

In Azure you need to prepare the following:

1. Verify that your Azure account has permissions to create VMs in Azure.
2. Create an Azure network that Azure VMs will join when they're created from storage accounts or managed disks after failover.
3. Set up an Azure Recovery Services vault for Site Recovery. The vault resides in the Azure portal, and is used to deploy, configure, orchestrate, monitor, and troubleshoot your Site Recovery deployment.

*Need more help?*

Learn how to set up Azure by [verifying your account](tutorial-prepare-azure.md#verify-account-permissions), creating a [network](tutorial-prepare-azure.md#set-up-an-azure-network), and [setting up a vault](tutorial-prepare-azure.md#create-a-recovery-services-vault).



## What do I need to set up on-premises before I start?

On-premises here's what you need to do:

1. You need to set up a couple of accounts:

    - If you're replicating VMware VMs, an account is needed for Site Recovery to access vCenter Server or vSphere ESXi hosts to automatically discover VMs.
    - An account is needed to install the Site Recovery Mobility service agent on each physical machine or VM you want to replicate.

2. You need to check the compatibility of your VMware infrastructure if you didn't previously do that.
3. Ensure that you can connect to Azure VMs after a failover. You set up RDP on on-premises Windows machines, or SSH on Linux machines.

*Need more help?*
- Prepare accounts for [automatic discovery](vmware-azure-tutorial-prepare-on-premises.md#prepare-an-account-for-automatic-discovery) and for [installation of the Mobility service](vmware-azure-tutorial-prepare-on-premises.md#prepare-an-account-for-mobility-service-installation).
- [Verify](vmware-azure-tutorial-prepare-on-premises.md#check-vmware-requirements) that your VMware settings are compatible.
- [Prepare](vmware-azure-tutorial-prepare-on-premises.md#prepare-to-connect-to-azure-vms-after-failover) so that you connect in Azure after failover.
- If you want more in-depth help about setting up IP addressing for Azure VMs after failover, [read this article](concepts-on-premises-to-azure-networking.md).

## How do I set up disaster recovery?

After you have your Azure and on-premises infrastructure in place, you can set up disaster recovery.

1. To understand the components that you'll need to deploy, review the [VMware to Azure architecture](vmware-azure-architecture.md), and the [physical to Azure architecture](physical-azure-architecture.md). There are a number of components, so it's important to understand how they all fit together.
2. **Source environment**: As a first step in deployment, you set up your replication source environment. You specify what you want to replicate, and where you want to replicate to.
3. **Configuration server** (applicable for Classic): You need to set up a configuration server in your on-premises source environment:
    - The configuration server is a single on-premises machine. For VMware disaster recovery, we recommend that you deploy it as a VMware VM that can be deployed from a downloadable OVF template.
    - The configuration server coordinates communications between on-premises and Azure
    - A couple of other components run on the configuration server machine.
        - The process server receives, optimizes, and sends replication data to cache storage account in Azure. It also handles automatic installation of the Mobility service on machines you want to replicate, and performs automatic discovery of VMs on VMware servers.
        - The master target server handles replication data during failback from Azure.
    - Set up includes registering the configuration server in the vault, downloading MySQL Server and VMware PowerCLI, and specifying the accounts created for automatic discovery and Mobility service installation.
4. **Azure Site Recovery replication appliance** (applicable for modernized): You need to set up a replication appliance in your on-premises source environment. The appliance is the basic building block of the entire Azure Site Recovery on-premises infrastructure. For VMware disaster recovery, we recommend that [you deploy it as a VMware VM](deploy-vmware-azure-replication-appliance-modernized.md#create-azure-site-recovery-replication-appliance) that can be deployed from a downloadable OVF template.  Learn more about replication appliance [here](vmware-azure-architecture-modernized.md).   
5. **Target environment**: You set up your target Azure environment by specifying your Azure subscription and network settings.
6. **Replication policy**: You specify how replication should occur. Settings include how often recovery points are created and stored, and whether app-consistent snapshots should be created.
7. **Enable replication**. You enable replication for on-premises machines. If you created an account to install the Mobility service, then it will be installed when you enable replication for a machine.

*Need more help?*

- For a quick walkthrough of these steps, you can try out our [VMware tutorial](vmware-azure-tutorial.md), and [physical server walkthrough](physical-azure-disaster-recovery.md).
- [Learn more](vmware-azure-set-up-source.md) about setting up your source environment.
- [Learn about](vmware-azure-deploy-configuration-server.md) configuration server requirements, and setting up the configuration server with an OVF template for VMware replication. If for some reason you can't use a template, or you're replicating physical servers, [use these instructions](physical-azure-set-up-source.md#set-up-the-source-environment).
- [Learn more](vmware-azure-set-up-target.md) about target settings.
- [Get more information](vmware-azure-set-up-replication.md) about setting up a replication policy.
- [Learn](vmware-azure-enable-replication.md) how to enable replication, and [exclude](vmware-azure-exclude-disk.md) disks from replication.


## Something went wrong, how do I troubleshoot?

- As a first step, try [monitoring your deployment](site-recovery-monitor-and-troubleshoot.md) to verify the status of replicated items, jobs, and infrastructure issues, and identify any errors.
- If you're unable to complete the initial replication, or ongoing replication isn't working as expected, [review this article](vmware-azure-troubleshoot-replication.md) for common errors and troubleshooting tips.
- If you're having issues with the automatic installation of the Mobility service on machines you want to replicate, review common errors in [this article](vmware-azure-troubleshoot-push-install.md).
- If failover isn't working as expected, check common errors in [this article](site-recovery-failover-to-azure-troubleshoot.md).
- If failback isn't working, check whether your issue appears in [this article](vmware-azure-troubleshoot-failback-reprotect.md).



## Next steps

With replication now in place, you should [run a disaster recovery drill](tutorial-dr-drill-azure.md) to ensure that failover works as expected.
