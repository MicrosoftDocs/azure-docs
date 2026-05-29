---
title: Enable replication for a physical server – Modernized
description: This article describes how to enable physical servers replication for disaster recovery using the Azure Site Recovery service
author: Jeronika-MS
ms.service: azure-site-recovery
ms.topic: how-to
ms.author: v-gajeronika
ms.reviewer: v-gajeronika
ms.date: 02/13/2026
ms.custom: sfi-image-nochange
# Customer intent: "As an IT administrator managing on-premises physical servers, I want to enable replication to Azure for disaster recovery, so that I can ensure business continuity in case of system failures or disasters."
---

# Enable replication for a physical server – Modernized

This article describes how to enable replication for on-premises physical servers for disaster recovery to Azure by using the Azure Site Recovery service - Modernized.

For information on how to set up disaster recovery in Azure Site Recovery Classic releases, see the [tutorial](./physical-azure-disaster-recovery.md). 

This tutorial is the second in a series that shows you how to set up disaster recovery to Azure for on-premises physical servers. In the previous tutorial, you prepared the Azure Site Recovery replication appliance for disaster recovery to Azure.

This tutorial explains how to enable replication for a physical server.

## Get started

Physical server to Azure replication includes the following procedures:

- Sign in to the [Azure portal](https://portal.azure.com/#home)
- [Prepare Azure account](/azure/site-recovery/vmware-azure-set-up-replication-tutorial-preview#prepare-azure-account)
- [Create a recovery Services vault](./quickstart-create-vault-template.md?tabs=CLI)
- [Prepare infrastructure](#prepare-infrastructure---set-up-azure-site-recovery-replication-appliance)
- [Enable replication](#enable-replication-for-physical-servers)

## Prepare infrastructure - set up Azure Site Recovery Replication appliance

To channel mobility agent communications, [set up an Azure Site Recovery replication appliance on the on-premises environment](/azure/site-recovery/deploy-vmware-azure-replication-appliance-preview).
 
### Add details of physical server to an appliance

You can add details of the physical servers that you plan to protect when you first register the appliance or after registration. To add physical server details to the appliance, follow these steps:

1. After adding the vCenter details, expand **Provide Physical server details** to add the details of the physical servers that you plan to protect.

   :::image type="Physical server credentials." source="./media/physical-server-enable-replication/physical-server-credentials.png" alt-text="Screenshot of Physical server credentials.":::

1. Select **Add credentials** to add credentials for the machines you plan to protect. Add all the details such as the operating system, friendly name for the credentials, username, and password. The user account details are encrypted and stored locally on the machine.

   :::image type="Add Physical server credentials." source="./media/physical-server-enable-replication/add-physical-server-credentials.png" alt-text="Screenshot of Add Physical server credentials."::: 

1. Select **Add**.

1. Select **Add server** to add physical server details. Provide the machine’s IP address, select the machine's credentials, and then select **Add**.
    
   :::image type="Add Physical server details." source="./media/physical-server-enable-replication/add-physical-server-details.png" alt-text="Screenshot of Add Physical server details."::: 

This process adds your physical server details to the appliance. You can enable replication on these machines by using any appliance that has a healthy or warning status. 

To protect physical servers without credentials, you must manually install the mobility service and enable replication. [Learn more](./vmware-physical-mobility-service-overview.md#install-the-mobility-service-using-ui-modernized).

## Enable replication for physical servers

Protect the machines, after an Azure Site Recovery replication appliance is added to a vault.

Ensure that you meet the [prerequisites](./vmware-physical-azure-support-matrix.md) across storage and networking.

Follow these steps to enable replication:

1.	Under **Getting Started**, select **Site Recovery**. 

1. Under **VMware**, select **Enable Replication** and select the machine type as Physical machines if you want to protect physical machines. 
The portal lists all the machines discovered by various appliances registered to the vault.

   :::image type="Select source." source="./media/physical-server-enable-replication/select-source.png" alt-text="Screenshot of select source tab."::: 

1.	Search the source machine name to protect it and review the selected machines. To review, select **Selected resources**.

1.	Select the desired machine and select **Next**. The portal opens the Source settings page. 

1. Select the replication appliance and machine credentials. The appliance uses these credentials to push the mobility agent on the machine and complete enabling Azure Site Recovery. Ensure you choose accurate credentials.

    >[!Note]
    >- For Linux OS, provide the root credentials. 
    >- For Windows OS, add a user account with admin privileges. 
    >- Use these credentials to push and install the mobility service on the source machine during the enable replication operation.
    >- You might be asked to provide a name for the virtual machine that you create.
 
   :::image type="Source settings." source="./media/physical-server-enable-replication/source-settings.png" alt-text="Screenshot of source settings tab."::: 

1. Select **Next** and provide target region properties. 

    By default, the portal selects the Vault subscription and Vault resource group. You can choose a subscription and resource group of your choice. Your source machines are deployed in this subscription and resource group when you fail over in the future.
 
   :::image type="Target properties." source="./media/physical-server-enable-replication/target-properties.png" alt-text="Screenshot of target properties tab."::: 

1.	You can select an existing Azure network or create a new target network to use during failover. 

    If you select **Create new**, the portal redirects you to **Create virtual network**. Provide address space and subnet details. This network is created in the target subscription and target resource group you selected in the previous step.

1.	Provide the test failover network details.

    >[!Note]
    >Ensure that the test failover network is different from the failover network. This difference ensures that the failover network is readily available in case of an actual disaster.

1.	Select the storage.

      - **Cache storage account**: Choose the cache storage account that Azure Site Recovery uses for staging purposes – caching and storing logs before writing the changes to the managed disks.
    
         By default, Azure Site Recovery creates a new LRS v1 type storage account for the first enable replication operation in a vault. For the next operations, the portal reuses the same cache storage account.

     - **Managed disks**

       By default, the portal creates Standard HDD managed disks in Azure. Select **Customize** to customize the type of managed disks. Choose the type of disk based on your business requirement. Ensure to [choose the appropriate disk type](/azure/virtual-machines/disks-types#disk-type-comparison) based on the IOPS of the source machine disks. For pricing information, see [managed disk pricing](https://azure.microsoft.com/pricing/details/managed-disks/).
 
       >[!Note]
       >If you install Mobility Service manually before enabling replication, you can change the type of managed disk at a disk level. Otherwise, you can choose one managed disk type at a machine level by default.

1. Create a new replication policy if needed.

    A default replication policy is created under the vault within three days. Recovery point retention and app-consistent recovery points are disabled by default. You can create a new replication policy or modify the existing policy as per your RPO requirements.

    1. Select **Create new** and enter the **Name**.
    1. Enter a value ranging from 0 to 15 for the **Retention period (in days)**.
    1. Enable **App consistency frequency** if you want to and enter a value for **App-consistent snapshot frequency (in hours)** based on your business requirements.
    1. Select **OK** to save the policy.

    Use the policy to protect the chosen source machines.

1. Choose the replication policy and select **Next**. Review the Source and Target properties and select **Enable Replication** to start the operation.
 
    :::image type="Review." source="./media/physical-server-enable-replication/review.png" alt-text="Screenshot of review tab."::: 

    A job is created to enable replication of the selected machines. To track the progress, go to Site Recovery jobs in the recovery services vault.

## Next steps

To enable physical machine and VMware to Azure replication, follow [this tutorial](vmware-azure-tutorial.md).