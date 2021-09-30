---
title: Configure VMware syslogs for Azure VMware Solution
description: Learn how to configure diagnostic settings to collect VMware syslogs for your Azure VMware Solution private cloud.
ms.topic: how-to 
ms.date: 09/24/2021

#Customer intent: As an Azure service administrator, I want to collect VMWare syslogs and store it in my storage account so that I can view the vCenter logs and analyze for any diagnostic purposes.

---

# Configure VMware syslogs for Azure VMware Solution

Diagnostic settings are used to configure streaming export of platform logs and metrics for a resource to the destination of your choice. You can create up to five different diagnostic settings to send different logs and metrics to independent destinations. 

In this topic, you'll configure a diagnostic setting to collect VMware syslogs for your Azure VMware Solution private cloud. You'll store the syslog to a storage account to view the vCenter logs and analyze for diagnostic purposes. 

## Prerequisites

Make sure you have an Azure VMware Solution private cloud with access to the vCenter and NSX-T Manager interfaces. 

## Configure diagnostic settings

1. From your Azure VMware Solution private cloud, select **Diagnostic settings**, and then **Add diagnostic settings**.
 
   :::image type="content" source="media/diagnostic-settings/diagnostic-settings-log-analytics-workspace-1.png" alt-text="Screenshot showing where to configure VMware syslogs." lightbox="media/diagnostic-settings/diagnostic-settings-log-analytics-workspace-1.png":::


1. Select the **vmwaresyslog**, **Allmetrics**, and **Archive to storage account** options.

   >[!IMPORTANT]
   >The **Send to log analytics workspace** option does not currently work.
 
1. Select the storage account where you want to store the logs and then select **Save**.

   :::image type="content" source="media/diagnostic-settings/diagnostic-settings-log-analytics-workspace-2.png" alt-text="Screenshot showing the options to select for storing the syslogs." lightbox="media/diagnostic-settings/diagnostic-settings-log-analytics-workspace-2.png":::

1. Go to your storage and account and verify that **Insight logs vmwarelog** has been created and select it. 
 
   :::image type="content" source="media/diagnostic-settings/diagnostic-settings-log-analytics-workspace-3.png" alt-text="Screenshot showing the Insight logs vmwarelog option created and available." lightbox="media/diagnostic-settings/diagnostic-settings-log-analytics-workspace-3.png":::


1. Browse to the location and download the json file to view the logs.

   :::image type="content" source="media/diagnostic-settings/diagnostic-settings-log-analytics-workspace-4.png" alt-text="Screenshot showing the drill-down path to the json file." lightbox="media/diagnostic-settings/diagnostic-settings-log-analytics-workspace-4.png"::: 

