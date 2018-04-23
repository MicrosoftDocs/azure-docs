---
title: Monitor Azure Automation runbooks with activity logs
description: This article walks you through monitoring Azure Automation runbooks with the activity log
services: automation
ms.service: automation
author: georgewallace
ms.author: gwallace
ms.date: 03/29/2018
ms.topic: article
manager: carmonm
---
# Monitoring runbooks with Azure Activity logs

## Log in to Azure

Log in to Azure at https://portal.azure.com


## Create alert

In the Azure portal, select **Monitor**. On the Monitor page, select **Alerts** and click **+ New Alert Rule**.

Under **1. Define alert condition**, click **+  Select target**. Under **Filter by resource type**, select **Automation Account**. Choose your Automation Account and click **Done**.

![Select a resource for the alert](./media/automation-alert-activity-log/select-resource.png)

Click **+ Add criteria**. Select **Metrics** for the **Signal type**, and choose **Total Jobs** from the table below.


## Next steps
