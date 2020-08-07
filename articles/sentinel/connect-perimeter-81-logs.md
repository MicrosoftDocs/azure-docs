---
title: Connect Perimeter 81 data to Azure Sentinel| Microsoft Docs
description: Learn how to connect Perimeter 81 data to Azure Sentinel.
services: sentinel
documentationcenter: na
author: yelevin
manager: rkarlin
editor: ''

ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 06/21/2020
ms.author: yelevin

---
# Connect your Perimeter 81 activity logs to Azure Sentinel

This article explains how to connect your [Perimeter 81 activity logs](https://www.perimeter81.com/) appliance to Azure Sentinel. The Perimeter 81 activity logs connector allows you to easily bring your Perimeter 81 data into Azure Sentinel, so that you can view it in workbooks, use it to create custom alerts, and incorporate it to improve investigation.

> [!NOTE]
> Data will be stored in the geographic location of the workspace on which you are running Azure Sentinel.

## Prerequisites

- You must have read and write permissions on the Azure Sentinel workspace.

- You must have read permissions to shared keys for the workspace.

## Configure and connect Perimeter 81 Activity Logs

Perimeter 81 Activity Logs can integrate and export logs directly to Azure Sentinel.

1. In the Azure Sentinel portal, click **Data connectors** on the navigation menu.

1. Select **Perimeter 81 Activity Logs** from the gallery, and then click the **Open connector page** button.

1. From the Perimeter 81 Activity Logs connector page, copy the **Workspace ID** and **Primary Key** and paste them in Perimeter 81, [as instructed here](https://support.perimeter81.com/hc/en-us/articles/360012680780).

1. After you complete the instructions, you'll see the connected data types in the Azure Sentinel connector page.

## Find your data

After a successful connection is established, the data appears in **Logs** under **CustomLogs** - **Perimeter81_CL**.

It may take upwards of 20 minutes until your logs start to appear.

## Next steps

In this document, you learned how to connect Perimeter 81 activity logs to Azure Sentinel. To take full advantage of the capabilities built in to this data connector, click on the **Next steps** tab on the data connector page. There you'll find a ready-made workbook and some sample queries so you can get started finding useful information.

To learn more about Azure Sentinel, see the following articles:

- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats-built-in.md).
- [Use workbooks](tutorial-monitor-your-data.md) to monitor your data.
