---
title: Connect Alcide kAudit data to Azure Sentinel| Microsoft Docs
description: Learn how to connect Alcide kAudit data to Azure Sentinel.
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
# Connect your Alcide kAudit to Azure Sentinel

[Alcide kAudit](https://www.alcide.io/kaudit-K8s-forensics/) helps you identify anomalous Kubernetes behaviors and focus on Kubernetes breaches and incidents while reducing detection time. This article explains how to connect your Alcide kAudit solution to Azure Sentinel. The Alcide kAudit data connector allows you to easily bring your kAudit log data into Azure Sentinel, so that you can view it in workbooks, use it to create custom alerts, and incorporate it to improve investigation. Integration between Alcide kAudit and Azure Sentinel makes use of REST API.

> [!NOTE]
> Data will be stored in the geographic location of the workspace on which you are running Azure Sentinel.

## Prerequisites

- You must have read and write permissions on the Azure Sentinel workspace.

- You must have read permissions to shared keys for the workspace.

## Configure and connect Alcide kAudit

Alcide kAudit can export logs directly to Azure Sentinel.

1. In the Azure Sentinel portal, click **Data connectors** on the navigation menu.

1. Select **Alcide kAudit** from the gallery, and then click the **Open connector page** button.

1. Follow the step-by-step instructions provided in the [Alcide kAudit Installation Guide](https://get.alcide.io/hubfs/Azure%20Sentinel%20Integration%20with%20kAudit.pdf).

1. When asked for the Workspace ID and the Primary Key, you can copy them from the Alcide kAudit data connector page.

    :::image type="content" source="media/connect-alcide-kaudit/alcide-workspace-id-primary-key.png" alt-text="Workspace ID and Primary Key":::

## Find your data

After a successful connection is established, the data appears in **Logs** under the following data types in **CustomLogs**:

- **alcide_kaudit_detections_1_CL** - Alcide kAudit detections 
- **alcide_kaudit_activity_1_CL** - Alcide kAudit activity logs
- **alcide_kaudit_selections_count_1_CL** - Alcide kAudit activity counts
- **alcide_kaudit_selections_details_1_CL** - Alcide kAudit activity details

To use the relevant schema in Logs for the Alcide kAudit, search for the data types mentioned above.

It may take upwards of 20 minutes until your logs start to appear in Log Analytics.

## Next steps

In this document, you learned how to connect Alcide kAudit to Azure Sentinel. To take full advantage of the capabilities built in to this data connector, click on the **Next steps** tab on the data connector page. There you'll find some ready-made sample queries so you can get started finding useful information.

To learn more about Azure Sentinel, see the following articles:

- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats-built-in.md).
- [Use workbooks](tutorial-monitor-your-data.md) to monitor your data.
