---
title: Collecting data from Network Watcher in Azure Security Insights | Microsoft Docs
description: Learn how to collect data  from Network Watcher in Azure Security Insights.
services: security-insights
documentationcenter: na
author: rkarlin
manager: MBaldwin
editor: ''

ms.assetid: c3df8afb-90d7-459c-a188-c55ba99e7b92
ms.service: security-insights
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 1/30/2019
ms.author: rkarlin

---
# Collecting data from Azure Network Watcher

You can stream logs from [Azure Network Watcher](../network-watcher/network-watcher-monitoring-overview.md) into Security Insights.


## Prerequisites

- User with contributor authorization permissions on each subscription you connect


## Connect to Network Watcher

1. Before you start, make sure you have a [dedicated storage account in Azure].

2. In Azure Security Insights, select **Data collection** and then click the **Network Watcher** tile.

3. In the Network Watcher pane next to each subscription whose logs you want to collect, click the three buttons at the end of the row of each subscription and select **Enable**. You can expand the subscription and for each subscription, and then select enable per region whose data you want to stream.

5. Select **NSG flow logs**. For each NSG on your subscription, set it to send logs to Security Insights by clicking the subscription, then clicking on the NSG name. 

6. Set the following:
    - **Flow logs settings** change the status to **ON**.
    - **Storage account**, set the information about the storage you set aside.
    - **Protection**, make sure it's not set to 0.
    - **Traffic analytic status** to ON.
7. Choose your workspace. This is the workspace in which you are running Security Insights to which you want to stream the logs.



## Next steps
In this document, you learned how to connect Azure AD Identity Protection to Security Insights. To learn more about Security Insights, see the following articles:
