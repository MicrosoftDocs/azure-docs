---
title: Set up Azure VM disaster recovery to a secondary region with Azure Site Recovery
description: Quickly set up disaster recovery to another Azure region for an Azure VM, using the Azure Site Recovery service.
ms.topic: quickstart
ms.date: 06/23/2021
ms.custom: mvc
---

# Quickstart: Replicate VMware VMs to Azure (preview)

The [Azure Site Recovery (ASR)](site-recovery-overview.md) service contributes to your business continuity and disaster recovery (BCDR) strategy by keeping your business applications online during planned and unplanned outages. Site Recovery manages and orchestrates disaster recovery of on-premises machines and Azure virtual machines (VM), including replication, failover, and recovery.

This quickstart describes how to set up disaster recovery for a VMware VM by replicating it to a secondary Azure region. We recommend you use default setting to enable replication.

## Prerequisites

To complete this tutorial, you need an Azure subscription and a VMware VM.

- If you don't have an Azure account with an active subscription, you can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A VM with a minimum 1 GB of RAM is recommended. [Learn more](https://docs.microsoft.com/azure/virtual-machines/windows/quick-create-portal) about how to create a VM.



## Get started

- Sign in to the [Azure portal](https://portal.azure.com/).
- To get started, navigate to [[Azure private preview portal](https://aka.ms/rcmcanary). And do the steps detailed in the following sections.
  [Create a recovery Services vault](https://docs.microsoft.com/azure/site-recovery/quickstart-create-vault-template?tabs=CLI)
- [Register and deploy ASR replication appliance](deploy-vmware-azure-replication-appliance.md)

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

Follow these steps to enable replication:

1. Select **Enable replication** under **Getting Started** section.

   <image(enable-replication.png)>

2. **Choose** the machine type you want to protect through Azure Site Recovery.

   > [!NOTE]
   > In Preview, the support is limited to virtual machines.

3. After choosing Virtual machines, you need to choose the vCenter server added to Azure Site Recovery replication appliances registered in this vault.

4. Later, search the source VM name to protect the machines of your choice. After selection, to review the selected VMs, Select **Selected resources**.

5. After you choose the list of VMs, Select Next to proceed to source settings. Here, select the replication appliance and VM credentials. These credentials will be used to push mobility agent on the VM by configuration server to complete enabling Azure Site Recovery. Ensure accurate credentials are chosen.

6. Select **Next** to provide target region properties. By default, Vault subscription and Vault resource group are selected. You can choose a subscription and resource group of your choice. Your source machines will be deployed in this subscription and resource group when you failover in the future.

7. Later, you can choose an Azure network or create a new target network to be used during Failover. If you select **Create new**, you will be redirected to create virtual network context blade and asked to provide address space and subnet details. This network will be created in the target subscription and target resource group selected in the previous step.

8. Then, provide test failover network details.

   > [!NOTE]
   > Ensure that the test failover network is different from the failover network. This is to make sure the failover network is readily available readily in case of an actual disaster.

9. Storage

   - Cache storage account:
    -  Now, choose cache storage account which Azure Site Recovery uses for staging purposes – caching and storing logs before writing the changes on to the managed disks.

    - By default, a new LRS v1 type storage account will be created by Azure Site Recovery for the first enable replication operation in a vault. For the next operations, same cache storage account will be re-used.
  -  Managed disks
    -  By default, premium SSD managed disks are created in Azure. You can customize the type of Managed disks by Selecting on **Customize**. Choose the type of disk based on the business requirement. Ensure [appropriate disk type is chosen](https://docs.microsoft.com/azure/virtual-machines/disks-types#disk-comparison) based on the IOPS of the source machine disks. For pricing information, refer to the managed disk pricing document [here](https://azure.microsoft.com/pricing/details/managed-disks/).

    - If mobility agent is installed manually before enabling replication, you can change the type of managed disk at a disk level. Else, by default, one managed disk type can be chosen at a machine level.

10. Replication policy

   - A default replication policy has been created under this vault with 72 hour recovery point retention and 4 hour app consistency frequency.

   - You can create a new replication policy as per your RPO requirements by Selecting on **Create new**.

      - Enter the name

      - Recovery point retention in hours

      - Choose **App-consistent snapshot frequency in hours** as per business requirements

      - Save the policy by selecting **OK**

   - The policy will be created and used protecting the chosen source machines

11. After choosing the replication policy, Select Next. Review the source and target properties. Select Enable Replication to initiate the operation.

   <image(appvault-site-recovery.png)>

A job is created to enable replication of the selected machines. To track the progress, navigate to Site Recovery jobs in the recovery services vault.

## Next steps

<need to add applicable topics>
