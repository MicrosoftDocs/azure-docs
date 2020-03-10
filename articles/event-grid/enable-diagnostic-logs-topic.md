---
title: Azure Event Grid - Enable diagnostic logs for a topic
description: This article provides step-by-step instructions on how to enable diagnostic logs for an Azure event grid topic.
services: event-grid
author: spelluru

ms.service: event-grid
ms.topic: how-to
ms.date: 01/30/2020
ms.author: spelluru
---

#  Diagnostic logs for an Azure event grid topic
Diagnostic settings allow Event Grid users to capture and view publish and delivery failure Logs in one of the following places: an Azure storage account, an event hub, or a Log Analytics workspace. This article provides step-by-step instructions to enable diagnostic logs for an event grid topic.

## Prerequisites

- A provisioned event grid topic
- A provisioned destination for capturing diagnostic logs. It can one of the following destinations:
    - Azure storage account
    - Event hub
    - Log Analytics workspace


## Steps for enabling diagnostic logs for a topic

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Navigate to the event grid topic for which you want to enable diagnostic log settings. 
3. Select **Diagnostic settings** under **Monitoring** in the left menu.
4. On the **Diagnostic settings** page, select **Add New Diagnostic Setting**. 
    
    ![Add diagnostic setting button](./media/enable-diagnostic-logs-topic/diagnostic-settings-add.png)
5. Specify a **name** for the diagnostic setting. 

    ![Diagnostic settings - name](./media/enable-diagnostic-logs-topic/diagnostic-settings-name.png)	 
6. Enable one or more of the capture destinations for the logs, and then configure them by selecting a previous created capture resource. 
    - If you select **Archive to a storage account**, select **Storage account - Configure**, and then select the storage account in your Azure subscription. 

        ![Archive to an Azure storage account](./media/enable-diagnostic-logs-topic/archive-storage.png)
    - If you select **Stream to an event hub**, select **Event hub - Configure**, and then select the Event Hubs namespace, event hub, and the access policy. 
        ![Stream to an event hub](./media/enable-diagnostic-logs-topic/archive-event-hub.png)
    - If you select **Send to Log Analytics**, select the Log Analytics workspace.
        ![Send to Log Analytics](./media/enable-diagnostic-logs-topic/send-log-analytics.png)
7. Select the **DeliveryFailures** and **PublishFailures** options in the **Log** section. 
    ![Select the failures](./media/enable-diagnostic-logs-topic/log-failures.png)
8. Select **Save**. Select **X** in the right-corner to close the page. 
9. Now, back on the **Diagnostic settings** page, confirm that you see a new entry in the **Diagnostics Settings** table. 
    ![Diagnostic setting in the list](./media/enable-diagnostic-logs-topic/diagnostic-setting-list.png)

	 You can also enable collection of all metrics for the topic. 

## Next steps
If you need more help, post your issue in the [Stack Overflow forum](https://stackoverflow.com/questions/tagged/azure-eventgrid) or open a [support ticket](https://azure.microsoft.com/support/options/). 
