---
title: Set up Azure VM disaster recovery to a secondary region with Azure Site Recovery
description: Quickly set up disaster recovery to another Azure region for an Azure VM, using the Azure Site Recovery service.
ms.topic: quickstart
ms.date: 07/14/2023
ms.custom: mvc, mode-other
ms.author: ankitadutta
author: ankitaduttaMSFT
ms.service: azure-site-recovery
---

# Quickstart: Set up disaster recovery to a secondary Azure region for an Azure VM

The [Azure Site Recovery](site-recovery-overview.md) service contributes to your business continuity and disaster recovery (BCDR) strategy by keeping your business applications online during planned and unplanned outages. Site Recovery manages and orchestrates disaster recovery of on-premises machines and Azure virtual machines (VM), including replication, failover, and recovery.

Azure Site Recovery has an option of *High Churn*, enabling you to configure disaster recovery for Azure VMs having data churn up to 100 MB/s. This helps you to enable disaster recovery for more IO intensive workloads. [Learn more](../site-recovery/concepts-azure-to-azure-high-churn-support.md).

This quickstart describes how to set up disaster recovery for an Azure VM by replicating it to a secondary Azure region. In general, default settings are used to enable replication. [Learn more](azure-to-azure-tutorial-enable-replication.md).

## Prerequisites

To complete this tutorial, you need an Azure subscription and a VM.

- If you don't have an Azure account with an active subscription, you can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A VM with a minimum 1 GB of RAM is recommended. [Learn more](/azure/virtual-machines/windows/quick-create-portal) about how to create a VM.

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Enable replication for the Azure VM

The following steps enable VM replication to a secondary location.

1. On the Azure portal, from **Home** > **Virtual machines** menu, select a VM to replicate.
1. In **Operations**, select **Disaster recovery**.
1. From **Basics** > **Target region**, select the target region.
1. To view the replication settings, select **Review + Start replication**. If you need to change any defaults, select **Advanced settings**.
   >[!Note]
   >Azure Site Recovery has a *High Churn* option that you can choose to protect VMs with high data change rate. With this, you can use a *Premium Block Blob* type of storage account. By default, the **Normal Churn** option is selected. For more information, see [Azure VM Disaster Recovery - High Churn Support](./concepts-azure-to-azure-high-churn-support.md).
   >:::image type="High churn" source="media/concepts-azure-to-azure-high-churn-support/churn-for-vms.png" alt-text="Screenshot of Churn for VM.":::
1. To start the job that enables VM replication, select **Start replication**.

   :::image type="content" source="media/azure-to-azure-quickstart/enable-replication1.png" alt-text="Enable replication.":::

## Verify settings

After the replication job is complete, you can check the replication status, modify replication settings, and test the deployment.

1. On the Azure portal menu, select **Virtual machines** and select the VM that you replicated.
1. In **Operations**, select **Disaster recovery**.
1. To view the replication details from the **Overview** select **Essentials**. More details are shown in the **Health and status**, **Failover readiness**, and the **Infrastructure view** map.

   :::image type="content" source="media/azure-to-azure-quickstart/replication-status.png" alt-text="Replication status.":::

## Clean up resources

To stop replication of the VM in the primary region, you must disable replication:

- The source replication settings are cleaned up automatically.
- The Site Recovery extension installed on the VM during replication isn't removed.
- Site Recovery billing for the VM stops.

To disable replication, perform these steps:

1. On the Azure portal menu, select **Virtual machines** and select the VM that you replicated.
1. In **Operations**, select **Disaster recovery**.
1. From **Overview**, select **Disable Replication**.
1. To uninstall the Site Recovery extension, go to the VM's **Settings** > **Extensions**.

   :::image type="content" source="media/azure-to-azure-quickstart/disable2-replication.png" alt-text="Disable replication.":::

## Next steps

In this quickstart, you replicated a single VM to a secondary region. Next, [set up replication for multiple Azure VMs](azure-to-azure-tutorial-enable-replication.md).

