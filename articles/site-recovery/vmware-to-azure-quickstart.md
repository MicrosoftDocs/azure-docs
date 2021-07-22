---
title: Replicate VMware VMs to Azure, using Azure Site Recovery replication appliance - preview.
description: Quickly set up disaster recovery for VMware VMs to Azure, using the Azure Site Recovery replication appliance.
ms.topic: quickstart
ms.date: 07/22/2021
ms.custom: mvc
---

# Quickstart: Replicate VMware VMs to Azure (Preview)

<We may not need this quick start. There are several processes involved in replication, which cannot be simplified under a QS. For now, added related links to the sections that drive replication scenario>

The [Azure Site Recovery](site-recovery-overview.md) service contributes to your business continuity and disaster recovery (BCDR) strategy by keeping your business applications online during planned and unplanned outages. Site Recovery manages and orchestrates disaster recovery of on-premises machines and Azure virtual machines (VM), including replication, failover, and recovery.

This Quickstart provides information about how to set up disaster recovery for a VMware VM to Azure, using the Azure Site Recovery service - preview.

We recommend you use default setting to enable replication.

## Prerequisites

To complete this tutorial, you need an Azure subscription and a VMware VM.

- If you don't have an Azure account with an active subscription, you can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A VM with a minimum 1 GB of RAM is recommended. [Learn more](/azure/virtual-machines/windows/quick-create-portal) about how to create a VM.


## Get started

- Sign in to the [Azure portal](https://portal.azure.com/).
- To get started, navigate to [Azure preview portal](https://aka.ms/rcmcanary) and do the steps as detailed in the following sections:

  - [Create a recovery Services vault](/azure/site-recovery/quickstart-create-vault-template?tabs=CLI)
  - [Register and deploy Azure Site Recovery replication appliance](deploy-vmware-azure-replication-appliance-preview.md)

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

**Use the following steps to begin the replication**:

1. Select **Enable replication** under **Getting Started** section.

2. **Choose** the machine type you want to protect through Azure Site Recovery.

   > [!NOTE]
   > In Preview, the support is limited to virtual machines.

3. After choosing Virtual machines, you need to choose the vCenter server added to Azure Site Recovery replication appliances, registered in this vault.

4. Later, search the source VM name to protect the machines of your choice. To review the selected VMs, select **Selected resources**.

5. After you choose the list of VMs, select **Next** to proceed to source settings. Here, select the replication appliance and VM credentials. These credentials will be used to push mobility agent on the VM by configuration server to complete enabling Azure Site Recovery. Ensure accurate credentials are chosen.

6. Select **Next** to provide target region properties. By default, Vault subscription and Vault resource group are selected. You can choose a subscription and resource group of your choice. Your source machines will be deployed in this subscription and resource group when you failover in the future.

  Later, you can choose an Azure network or create a new target network to be used during Failover. If you select **Create new**, you will be redirected to create virtual network context blade and asked to provide address space and subnet details. This network will be created in the target subscription and target resource group selected in the previous step.

8. Then, provide the test failover network details and select the storage.

10. Create a new replication policy if needed. After choosing the replication policy, select **Next**. Review the Source and Target properties. Select **Enable Replication** to initiate the operation.

  ![Site recovery](./media/vmware-azure-set-up-replication-tutorial-preview/appvault-site-recovery.png)

  A job is created to enable replication of the selected machines. To track the progress, navigate to Site Recovery jobs in the recovery services vault.

For detailed information on enabling replication [see this article](vmware-azure-set-up-replication-tutorial-preview.md).

## Next steps

[Plan failover and failback](vmware-azure-tutorial-failover-failback.md)
