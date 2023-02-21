---
title: Enable replication for a physical server – Modernized
description: This article describes how to enable physical servers replication for disaster recovery using the Azure Site Recovery service
author: ankitaduttaMSFT
manager: jsuri
ms.service: site-recovery
ms.topic: conceptual
ms.author: ankitadutta
ms.date: 10/20/2022
---

# Enable replication for a physical server – Modernized

This article describes how to enable replication for on-premises physical servers for disaster recovery to Azure using the Azure Site Recovery service - Modernized.

See the [tutorial](./physical-azure-disaster-recovery.md) for information on how to set up disaster recovery in Azure Site Recovery Classic releases. 

This is the second tutorial in a series that shows you how to set up disaster recovery to Azure for on-premises physical servers. In the previous tutorial, we prepared the Azure Site Recovery replication appliance for disaster recovery to Azure.

This tutorial, explains on how to enable replication for a physical server.

## Get started

Physical server to Azure replication includes the following procedures:

- Sign in to the [Azure portal](https://portal.azure.com/#home)
- [Prepare Azure account](/azure/site-recovery/vmware-azure-set-up-replication-tutorial-preview#prepare-azure-account)
- [Create a recovery Services vault](./quickstart-create-vault-template.md?tabs=CLI)
- [Prepare infrastructure](#prepare-infrastructure---set-up-azure-site-recovery-replication-appliance)
- [Enable replication](#enable-replication-for-physical-servers)

## Prepare infrastructure - set up Azure Site Recovery Replication appliance

[Set up an Azure Site Recovery replication appliance on the on-premises environment](/azure/site-recovery/deploy-vmware-azure-replication-appliance-preview) to channel mobility agent communications.
 
### Add details of physical server to an appliance

You can add details of the physical servers, which you plan to protect, when you’re performing the appliance registration for the first time, or when the registration is complete. To add the physical server details to the appliance, follow the steps below:

1. After adding the vCenter details, expand **Provide Physical server details** to add the details of the physical servers that you plan to protect.

   :::image type="Physical server credentials." source="./media/physical-server-enable-replication/physical-server-credentials.png" alt-text="Screenshot of Physical server credentials.":::

2. Select **Add credentials** to add credentials of the machine(s) you plan to protect. Add all the details such as the operating system, friendly name for the credentials, username, and password. The user account details will be encrypted and stored locally in the machine.

   :::image type="Add Physical server credentials." source="./media/physical-server-enable-replication/add-physical-server-credentials.png" alt-text="Screenshot of Add Physical server credentials."::: 

3. Select **Add**.

4. Select **Add server** to add physical server details. Provide the machine’s IP address, select the machine's credentials and then select **Add**.
    
   :::image type="Add Physical server details." source="./media/physical-server-enable-replication/add-physical-server-details.png" alt-text="Screenshot of Add Physical server details."::: 

This will add your physical server details to the appliance, and you can enable replication on these machines using any appliance which has healthy or warning status. 

To perform credential-less protection on physical servers, you must manually install the mobility service and enable replication. [Learn more](./vmware-physical-mobility-service-overview.md#install-the-mobility-service-using-ui-modernized).

## Enable replication for Physical servers

Protect the machines, after an Azure Site Recovery replication appliance is added to a vault.

Ensure that you meet the [pre-requisites](./vmware-physical-azure-support-matrix.md) across storage and networking.

Follow these steps to enable replication:

1.	Under **Getting Started**, select **Site Recovery**. 

2. Under **VMware**, select **Enable Replication** and select the machine type as Physical machines if you want to protect physical machines. 
Lists all the machines  discovered by various appliances registered to the vault.

   :::image type="Select source." source="./media/physical-server-enable-replication/select-source.png" alt-text="Screenshot of select source tab."::: 

3.	Search the source machine name to protect it and review the selected machines. To review, select **Selected resources**.

4.	Select the desired machine and select **Next**. Source settings page opens. 

5. Select the replication appliance and machine credentials. These credentials will be used to push the mobility agent on the machine by the appliance to complete enabling Azure Site Recovery. Ensure to choose accurate credentials.

    >[!Note]
    >- For Linux OS, ensure to provide the root credentials. 
    >- For Windows OS, add a user account with admin privileges. 
    >- These credentials will be used to push install mobility service on to the source machine during enable replication operation.
    >- You may be asked to provide a name for the virtual machine which will be created.
 
   :::image type="Source settings." source="./media/physical-server-enable-replication/source-settings.png" alt-text="Screenshot of source settings tab."::: 

6. Select **Next** and provide target region properties. 

    By default, Vault subscription and Vault resource group are selected. You can choose a subscription and resource group of your choice. Your source machines will be deployed in this subscription and resource group when you failover in the future.
 
   :::image type="Target properties." source="./media/physical-server-enable-replication/target-properties.png" alt-text="Screenshot of target properties tab."::: 

7.	You can select an existing Azure network or create a new target network to be used during failover. 

    If you select **Create new**, you are redirected to **Create virtual network** blade. Provide address space and subnet details. This network will be created in the target subscription and target resource group selected in the previous step.

8.	Provide the test failover network details.

    >[!Note]
    >Ensure that the test failover network is different from the failover network. This ensures that the failover network is readily available in case of an actual disaster.

9.	Select the storage.

      - **Cache storage account**: Choose the cache storage account that Azure Site Recovery uses for staging purposes – caching and storing logs before writing the changes on to the managed disks.
    
         Azure Site Recovery creates a new LRS v1 type storage account by default for the first enable replication operation in a vault. For the next operations, the same cache storage account will be re-used.

     - **Managed disks**

       By default, Standard HDD managed disks are created in Azure. Select **Customize** to customize the type of Managed disks. Choose the type of disk based on the business requirement. Ensure to [choose the appropriate disk type](../virtual-machines/disks-types.md#disk-type-comparison) based on the IOPS of the source machine disks. For pricing information, see [managed disk pricing](https://azure.microsoft.com/pricing/details/managed-disks/).
 
       >[!Note]
       >If Mobility Service is installed manually before enabling replication, you can change the type of managed disk, at a disk level. Otherwise, one managed disk type can be chosen at a machine level by default.

10. Create a new replication policy if needed.

    A default replication policy gets created under the vault within three days. Recovery point retention and app-consistent recovery points are disabled by default. You can create a new replication policy or modify the existing policy as per your RPO requirements.

    1. Select **Create new** and enter the **Name**.
    1. Enter a value ranging from 0 to 15 for the **Retention period (in days)**.
    1. Enable **App consistency frequency** if you wish and enter a value for **App-consistent snapshot frequency (in hours)** as per business requirements.
    1. Select **OK** to save the policy.

    Use the policy to protect the chosen source machines.

11. Choose the replication policy and select **Next**. Review the Source and Target properties and select **Enable Replication** to initiate the operation.
 
    :::image type="Review." source="./media/physical-server-enable-replication/review.png" alt-text="Screenshot of review tab."::: 

    A job is created to enable replication of the selected machines. To track the progress, navigate to Site Recovery jobs in the recovery services vault.