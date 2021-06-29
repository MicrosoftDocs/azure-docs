---
title: Replicate VMware VMs to Azure, using Azure Site Recovery replication appliance - preview.
description: Quickly set up disaster recovery for VMware VMs to Azure, using the Azure Site Recovery replication appliance.
ms.topic: quickstart
ms.date: 06/29/2021
ms.custom: mvc
---

# Quickstart: Replicate VMware VMs to Azure (Preview)

<We may not need this quick start. There are several processes involved in replication, which cannot be simplified under a QS. For now, added related links to the sections that drive replication scenario>

The [Azure Site Recovery (ASR)](site-recovery-overview.md) (ASR) service contributes to your business continuity and disaster recovery (BCDR) strategy by keeping your business applications online during planned and unplanned outages. Site Recovery manages and orchestrates disaster recovery of on-premises machines and Azure virtual machines (VM), including replication, failover, and recovery.

This Quickstart (Preview) describes how to set up disaster recovery for a VMware VM by replicating it to a secondary Azure region. We recommend you use default setting to enable replication.

## Prerequisites

To complete this tutorial, you need an Azure subscription and a VMware VM.

- If you don't have an Azure account with an active subscription, you can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A VM with a minimum 1 GB of RAM is recommended. [Learn more](/azure/virtual-machines/windows/quick-create-portal) about how to create a VM.


## Get started

- Sign in to the [Azure portal](https://portal.azure.com/).
- To get started, navigate to [[Azure private preview portal](https://aka.ms/rcmcanary). And do the steps detailed in the following sections.
  [Create a recovery Services vault](/azure/site-recovery/quickstart-create-vault-template?tabs=CLI)
- [Register and deploy ASR replication appliance](deploy-vmware-azure-replication-appliance-preview.md)

## Enable replication of VMware VMs

After an Azure Site Recovery replication appliance is added to a vault, you can get started with protecting the VMs.

Ensure the following pre-requisites across storage and networking are met:

- [Linux storage](vmware-physical-azure-support-matrix.md#linux-file-systemsguest-storage)
- [Network](vmware-physical-azure-support-matrix.md#network)
- [Azure VM network post failover](vmware-physical-azure-support-matrix.md#azure-vm-network-after-failover)
- [Storage](vmware-physical-azure-support-matrix.md#storage)
- [Replication channels](vmware-physical-azure-support-matrix.md#replication-channels)
- [Azure storage](vmware-physical-azure-support-matrix.md#azure-storage)
- [Azure compute](vmware-physical-azure-support-matrix.md#azure-compute)
- [Azure VM requirements](vmware-physical-azure-support-matrix.md#azure-vm-requirements)
- [Churn limits](vmware-physical-azure-support-matrix.md#churn-limits)
- [Vault level tasks](vmware-physical-azure-support-matrix.md#vault-tasks)

[Use these steps to enable replication](vmware-azure-set-up-replication-tutorial-preview.md)


## Next steps

[Plan failover and failback](vmware-azure-tutorial-failover-failback.md)
