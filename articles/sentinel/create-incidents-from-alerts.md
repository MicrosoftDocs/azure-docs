---
title: Create incidents from alerts in Azure Sentinel | Microsoft Docs
description: Learn how to create incidents from alerts in Azure Sentinel.
services: sentinel
documentationcenter: na
author: rkarlin
manager: rkarlin
editor: ''

ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: overview
ms.custom: mvc
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/10/2019
ms.author: rkarlin

---
# Connect incidents from alerts


Alerts triggered in Azure Sentinel that stem from Microsoft solutions, such as Microsoft Cloud App Security and Azure Advanced Threat Protection, are handled differently from other alerts in Azure Sentinel. This article expains the differences.
## Connection to Microsoft security services
During connection to these data sources, you can select whether you want the alerts from these security solutions to automatically stream as raw data into Azure Sentinel and generate alerts. 
To work with Microsoft Security solution alerts, under **Analytic rules**  select **Microsoft security** rules and choose the alert provider, give a name or description - for example you can call one Cloud App Security alerts. This creates incidents from the raw data that is streamed into Sentinel.

When you connect the connector for one of these services, you will be asked in the connection phase if you want to ceate incidents from alerts and there's a checkbox and you say yes it'll generate this rule automatically and take all the alerts and create incidents from them. Becase you can set an alert severity filter, you can create multiple **Microsoft Security** analytic rules. For example, you could create a rule to be considered high severity and set a specific playbook to run for the high severity alerts, while other alerts could trigger merely an informational alert. 


## Next steps

- To get started with Azure Sentinel, you need a subscription to Microsoft Azure. If you do not have a subscription, you can sign up for a [free trial](https://azure.microsoft.com/free/).
- Learn how to [onboard your data to Azure Sentinel](quickstart-onboard.md), and [get visibility into your data, and potential threats](quickstart-get-visibility.md).
