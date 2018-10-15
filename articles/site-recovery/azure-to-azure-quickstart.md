---
title: Replicate an Azure VM to another Azure region
description: This quickstart provides the steps required to replicate an Azure VM in one Azure region to a different region.
services: site-recovery
author: rayne-wiselman
manager: carmonm
ms.service: site-recovery
ms.topic: quickstart
ms.date: 10/10/2018
ms.author: raynew
ms.custom: mvc
---
# Replicate an Azure VM to another Azure region

The [Azure Site Recovery](site-recovery-overview.md) service contributes to your business continuity and disaster recovery (BCDR) strategy by keeping your business apps up and running, during planned and unplanned outages. Site Recovery manages and orchestrates disaster recovery of on-premises machines and Azure virtual machines (VMs), including replication, failover, and recovery.

This quickstart describes how to replicate an Azure VM to a different Azure region.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.



## Log in to Azure

Log in to the Azure portal at http://portal.azure.com.

## Enable replication for the Azure VM

1. In the Azure portal, click **Virtual machines**, and select the VM you want to replicate.

2. In **Operations**, click **Disaster recovery**.
3. In **Configure disaster recovery** > **Target region** select the target region to which you'll replicate.
4. For this Quickstart, accept the other default settings.
5. Click **Enable replication**. This starts a job to enable replication for the VM.

    ![enable replication](media/azure-to-azure-quickstart/enable-replication1.png)



## Verify settings

After the replication job has finished, you can check the replication status, modify replication settings, and test the deployment.

1. In the VM menu, click **Disaster recovery**.
2. You can verify replication health, recovery points that have been created, and source and target regions on the map.

   ![Replication status](media/azure-to-azure-quickstart/replication-status.png)

## Clean up resources

The VM in the primary region stops replicating when you disable replication for it:

- The source replication settings are cleaned up automatically.
- Site Recovery billing for the
VM also stops.

Stop replication as follows:

1. Select the VM.
2. In **Disaster recovery**, click **Disable Replication**.

   ![Disable replication](media/azure-to-azure-quickstart/disable2-replication.png)

## Next steps

In this quickstart, you replicated a single VM to a secondary region.

> [!div class="nextstepaction"]
> [Configure disaster recovery for Azure VMs](azure-to-azure-tutorial-enable-replication.md)
