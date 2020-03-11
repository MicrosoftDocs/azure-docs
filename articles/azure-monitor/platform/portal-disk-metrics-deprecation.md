---
title: Portal Disk Metrics Deprecation | Microsoft Docs
description: Put description here
services: azure-monitor
ms.subservice: metrics
ms.topic: conceptual
author: normesta
ms.author: normesta
ms.date: 03/10/2020

---

# Portal Disk Metrics Deprecation

We are removing the old deprecated metrics from the Azure Portal Experience on TBD. All these deprecated metrics that are being removed have corresponding new metrics that are an easy replacement. 

## Metrics replacement

Here is a table of the old metrics that are being removed and their corresponding new metrics.

|Deprecated Metrics to be Removed|New Metrics replacing old one|
|----|----|
|Data Disk QD (Deprecated)|Data Disk Queue Depth (Preview)|
|Data Disk Read Bytes/Sec (Deprecated)|Data Disk Read Bytes/Sec (Preview)|
|Data Disk Read Operations/Sec (Deprecated)|Data Disk Read Operations/Sec (Preview)|
|Data Disk Write Bytes/Sec (Deprecated)|Data Disk Write Bytes/Sec (Preview)|
|Data Disk Write Operations/Sec (Deprecated)|Data Disk Write Operations/Sec (Preview)|
|OS QD (Deprecated)|OS Queue Depth (Preview)|
|OS Read Bytes/Sec (Deprecated)|OS Read Bytes/Sec (Preview)|
|OS Read Operations/Sec (Deprecated)|OS Read Operations/Sec (Preview)|
|OS Write Bytes/Sec (Deprecated)|OS Write Bytes/Sec (Preview)|
|OS Write Operations/Sec (Deprecated)|OS Write Operations/Sec (Preview)|\

## How to migrate old alerts

1. In the portal search bar, search for Alerts like shown and select Alerts in the services section:

   > [!div class="mx-imgBorder"]
   > ![Image description](./media/portal-disk-metrics-deprecation/alert-service-in-azure-portal.png)

2. Click on the Manage Alert Rules Icon near the top left corner

   > [!div class="mx-imgBorder"]
   > ![Image description](./media/portal-disk-metrics-deprecation/manage-alert-rules-button.png)

3. Now in the drop-down menus filter for Virtual Machines for the resource type and Metrics for the Signal type.

   > [!div class="mx-imgBorder"]
   > ![Image description](./media/portal-disk-metrics-deprecation/filter-alerts.png)

4. Now go through the results and look for any conditions that relate to Disks, note that they will not have the preview text next to them and click into these alerts and Click on their names.

   > [!div class="mx-imgBorder"]
   > ![Image description](./media/portal-disk-metrics-deprecation/find-disk-conditions.png)

5. Now in rules menu, go to the condition and click on the blue text to adjust the condition.

   > [!div class="mx-imgBorder"]
   > ![Image description](./media/portal-disk-metrics-deprecation/adjust-condition.png)

6. Make note of what the alert is set to because this information will not be there when you come back with the new metric.

   > [!div class="mx-imgBorder"]
   > ![Image description](./media/portal-disk-metrics-deprecation/condition-rules.png)

7. Now select Back to signal selection in new window.

   > [!div class="mx-imgBorder"]
   > ![Image description](./media/portal-disk-metrics-deprecation/back-to-signal-selection.png)

8. And now change the signal selection to the corresponding new metric by searching for it in the search menu and locating it when it pops up.

   > [!div class="mx-imgBorder"]
   > ![Image description](./media/portal-disk-metrics-deprecation/choose-new-metric.png)

9. Now set your Alert and click Done at the very bottom.

   > [!div class="mx-imgBorder"]
   > ![Image description](./media/portal-disk-metrics-deprecation/set-new-metric.png)

10. Now click Save to complete your migration.

    > [!div class="mx-imgBorder"]
    > ![Image description](./media/portal-disk-metrics-deprecation/save-new-metric.png)






