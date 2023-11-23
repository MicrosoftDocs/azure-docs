---
title: Tutorial - Configure protection for data sources
description: Learn how to configure protection for your data sources which are currently not protected by any solution using Azure Business Continuity center.
ms.topic: tutorial
ms.date: 10/19/2023
ms.service: azure-business-continuity-center
ms.custom:
  - ignite-2023
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Tutorial: Configure protection for data sources (preview) 

This tutorial guides you to configure protection for your data sources that are currently not protected by any solution using Azure Business Continuity center (preview). 

The key principle of data protection is to safeguard and make data or application available under all circumstances.

## Prerequisites

Before you start this tutorial:

- Ensure you have the required resource permissions to view them in the ABC center.

## Protect your data and applications

To determine how often to back up data and where to store backups, you consider the cost of downtime and impact of access loss to data and applications for any duration, as well as the cost of replacing or recreating the lost data. To determine the backup frequency and availability decisions, determine recovery time objectives (RTOs) and recovery point objectives (RPOs) for each data source and application to guide frequency.

- **Recovery Point Objective (RPO)**: The amount of data the organization can afford to lose. This helps to determine how frequently you must back up your data to avoid losing more.
- **Recovery Time Objective (RTO)**:  The maximum amount of time the business can afford to be without access to the data or application i.e., being offline or how quickly you must recover the data and application. This helps in developing your recovery strategy.

RTOs and RPOs might vary depending on the business and the individual applications data. Mission-critical applications mostly require microscopic RTOs and RPOs since, downtime could cost millions per minute.

A datasource is an Azure resource or an item hosted in Azure resource (e.g. SQL database in Azure VM, SAP Hana database in Azure Virtual Machine, and etc.). A datasource belonging to a critical business application should be recoverable in both primary and secondary region in case of any malicious attack or operational disruptions. 

- **Primary region**: Region in which datasource is hosted.
- **Secondary region**: Paired or target region in which datasource can be recovered in case primary region is not accessible.


## Get started

Azure Business Continuity center helps you configure protection, enabling backup or replication of the datasources from various views and options like overview, protectable resources, protected items, and more options. You can choose from the following options to configure protection:

- **Multiple datasources**: To configure protection for multiple datasources, you can use the **Configure protection** option available through the menu on the left or the top pane, like **Overview**, **Protectable resources**, **Protected items**, and etc. 
    :::image type="content" source="./media/tutorial-configure-protection-datasource/configure-multiple-resources.png" alt-text="Screenshot showing configure protection for multiple resources." lightbox="./media/tutorial-configure-protection-datasource/configure-multiple-resources.png":::
 
- **Single datasource**: To configure protection for a single datasource, use the menu on individual resources in **Protectable resources** view. 
    :::image type="content" source="./media/tutorial-configure-protection-datasource/configure-single-resource.png" alt-text="Screenshot showing configure protection for a single resource." lightbox="./media/tutorial-configure-protection-datasource/configure-single-resource.png":::
 

## Configure protection

This tutorial uses option 1 shown in the Getting started section to initiate the configure protection for Azure Virtual Machines.

1. Go to one of the views from **Overview, Protectable resources**, **Protected items**, and so on, and then select **Configure Protection** from the menu available on the top of the view.
    :::image type="content" source="./media/tutorial-configure-protection-datasource/configure-multiple-resources.png" alt-text="Screenshot showing **Configure protection** option." lightbox="./media/tutorial-configure-protection-datasource/configure-multiple-resources.png":::

2. On the **Configure protection** pane, choose **Resources managed by**, select **Datasource type** for which you want to configure protection, and then select the solution (limited to Azure Backup and Azure Site Recovery in this preview) by which you want to configure protection.
    :::image type="content" source="./media/tutorial-configure-protection-datasource/configure-protection.png" alt-text="Screenshot showing **Configure protection** page." lightbox="./media/tutorial-configure-protection-datasource/configure-protection.png":::

> [!NOTE]
> Ensure you have a *Recovery services* vault created to proceed with the flow for [Azure Backup](../backup/backup-overview.md) or [Azure Site recovery](../site-recovery/site-recovery-overview.md). You can create a vault from Vaults view in ABC center: <br>
>     :::image type="content" source="./media/tutorial-configure-protection-datasource/create-vault.png" alt-text="Screenshot showing the create vault option." lightbox="./media/tutorial-configure-protection-datasource/create-vault.png":::

 
3. Select **Configure** to go to the solution-specific configuration page. For example, if you select *Azure Backup*, it opens the **Configure Backup** page in Backup. If you select *Azure Site Recovery*, it opens the **Enable Replication** page. 
    :::image type="content" source="./media/tutorial-configure-protection-datasource/start-configure-backup.png" alt-text="Screenshot showing **Configure Backup** page." lightbox="./media/tutorial-configure-protection-datasource/start-configure-backup.png":::
 
## Next steps

- [Review protected items from ABC center](./tutorial-view-protectable-resources.md).
- [Monitor progress of configure protection](./tutorial-monitor-protection-summary.md).
