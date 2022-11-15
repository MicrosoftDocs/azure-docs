---
title: Configure VMware syslogs for Azure VMware Solution
description: Learn how to configure diagnostic settings to collect VMware syslogs for your Azure VMware Solution private cloud.
ms.topic: how-to 
ms.service: azure-vmware
ms.date: 10/07/2022

#Customer intent: As an Azure service administrator, I want to collect VMware syslogs and store it in my storage account so that I can view the vCenter Server logs and analyze for any diagnostic purposes.

---

# Configure VMware syslogs for Azure VMware Solution

Diagnostic settings are used to configure streaming export of platform logs and metrics for a resource to the destination of your choice. You can create up to five different diagnostic settings to send different logs and metrics to independent destinations. 

In this article, you'll configure a diagnostic setting to collect VMware syslogs for your Azure VMware Solution private cloud. You'll store the syslog to a storage account to view the vCenter Server logs and analyze for diagnostic purposes. 
 >[!IMPORTANT]
   >The **VMware syslogs** contains the following logs:
   >- NSX-T Data Center Distributed Firewall logs
   >- NSX-T Manager logs
   >- NSX-T Data Center Gateway Firewall logs
   >- ESXi logs
   >- vCenter Server logs
   >- NSX-T Data Center Edge Appliance logs
 

## Prerequisites

Make sure you have an Azure VMware Solution private cloud with access to the vCenter Server and NSX-T Manager interfaces. 

## Configure diagnostic settings

1. From your Azure VMware Solution private cloud, select **Diagnostic settings**, then **Add diagnostic settings**.
 
   :::image type="content" source="media/diagnostic-settings/diagnostic-settings-log-analytics-workspace-1.png" alt-text="Screenshot showing where to configure VMware syslogs." lightbox="media/diagnostic-settings/diagnostic-settings-log-analytics-workspace-1.png":::


1. Select the **vmwaresyslog**, **All metrics**, and select one of the following options presented.

   >[!IMPORTANT]
   >The **Send to log analytics workspace** option is currently unavailable.
 
   ### Archive to storage account

    1. In **Diagnostic setting**, select the storage account where you want to store the logs and select **Save**.

       :::image type="content" source="media/diagnostic-settings/diagnostic-settings-log-analytics-workspace-2.png" alt-text="Screenshot showing the options to select for storing the syslogs." lightbox="media/diagnostic-settings/diagnostic-settings-log-analytics-workspace-2.png":::

    1. Go to your **Storage accounts**, verify **Insight logs vmwarelog** has been created, select it. 
 
       :::image type="content" source="media/diagnostic-settings/diagnostic-settings-log-analytics-workspace-3.png" alt-text="Screenshot showing the Insight logs vmwarelog option created and available." lightbox="media/diagnostic-settings/diagnostic-settings-log-analytics-workspace-3.png":::


    1. Browse **Insight logs vmwarelog** to locate and download the json file to view the logs.

       :::image type="content" source="media/diagnostic-settings/diagnostic-settings-log-analytics-workspace-4.png" alt-text="Screenshot showing the drill-down path to the json file." lightbox="media/diagnostic-settings/diagnostic-settings-log-analytics-workspace-4.png"::: 

   ### Stream to Microsoft Azure Event Hubs

    1. In **Diagnostic setting**, under Destination details, select **Stream to an Event Hub**. 
    1. From the **Event Hub namespace** drop-down menu, choose where you want to send the logs, select, and **Save**.
    
       :::image type="content" source="media/diagnostic-settings/stream-event-hub.png" alt-text="Screenshot showing the drill-down path to send the logs." lightbox="media/diagnostic-settings/stream-event-hub.png"::: 




