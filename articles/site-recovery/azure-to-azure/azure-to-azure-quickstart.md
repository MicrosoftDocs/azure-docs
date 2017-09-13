---
title: Quickstart - Azure to Azure disaster recovery
description: This quickstart provides the steps required to replicate Azure virtual machines (VMs) in one Azure region to a different region.
services: site-recovery
author: rajani-janaki-ram
manager: carmonm

ms.service: site-recovery
ms.workload: storage-backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/01/2017
ms.author: rajanaki
ms.custom: mvc
---
# Configure disaster recovery for a virtual machine from the Azure portal

Disaster Recovery for Azure virtual machines can be configured through the Azure portal. This
quickstart provides the steps required to replicate Azure virtual machines (VMs) in one Azure
region to a different region.

If you don't have an Azure subscription, create a
[free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Log in to Azure

Log in to the Azure portal at http://portal.azure.com.

## Set up disaster recovery settings

1. Click on **Virtual machines** button found on the left-hand menu of the Azure portal.

2. Select the virtual machine for which you want to enable disaster recovery.

3. Under **Settings** menu, click on **Site Recovery**.

   ![azurevmsiterecovery](media/azure-to-azure-quickstart/a2avmbutton.JPG)

4. Under **Configure disaster recovery**, select the **Target region** to which you want your
   virtual machines to fail over. Site Recovery automatically suggests failover settings. You can
   choose the default settings or configure different values.

5. Click on **Enable replication**

   ![dr-config-for-vm](media/azure-to-azure-quickstart/drconfigbladea2a.jpg)

   Clicking the button starts a job to enable replication for the virtual machine.

## Verify that disaster recovery is properly configured

Once the replication job has completed you can monitor the replication status, edit replication
settings, and perform a disaster recovery drill or failover. In this example, we check the
replication status to verify that disaster recovery is properly configured.

1. Click on the **Site Recovery** button of the virtual machine menu.
2. Note the replication health status, the source, the target region, and other regions available
   on the map.

   ![replication-status](media/azure-to-azure-quickstart/replicationstatus-azure-to-azure.jpg)

## Clean up resources

Replication of the VM stops when you remove the replicated VM from Azure Site Recovery. The
replication configuration on the source is cleaned up automatically. Site Recovery billing for the
VM also stops.

Use the following steps to stop replication of a virtual machine:

1. Select the virtual machine for which you want to disable disaster recovery.
2. Under **Settings** menu, click on **Site Recovery**.
3. Click on **More**
4. Click on **Disable Replication**.

   ![disable-replication](media/azure-to-azure-quickstart/disablereplication.jpg)

## Next steps

In this quickstart, you have enabled disaster recovery for a virtual machine. To learn more about
configuring disaster recovery and performing application failover, see the
[tutorial](azure-to-azure-tutorial-enable-replication.md) for disaster recovery of Azure virtual
machines.
