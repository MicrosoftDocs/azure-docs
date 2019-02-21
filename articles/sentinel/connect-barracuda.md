---
title: Collect Barracuda data in Azure Sentinel | Microsoft Docs
description: Learn how to collect Barracuda data in Azure Sentinel.
services: sentinel
documentationcenter: na
author: rkarlin
manager: MBaldwin
editor: ''

ms.assetid: 3b33b4aa-7286-4d79-b461-8e1812edc2e1
ms.service: sentinel
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 2/28/2019
ms.author: rkarlin

---
# Connect your Barracuda appliance to Azure Sentinel

Barracuda Web Application Firewall (WAF) connector allows you to easily connect your Barracuda logs with your Azure Security Insights, to view dashboards, create custom alerts, and improve investigation. This gives you more insight into your organization’s network and improves your security operation capabilities. Azure Sentinel takes advantage of the native integration between **Barracuda** and Microsoft Azure OMS to provide seamless integration. 


>[!NOTE]

> - Data will be stored in the geographic location of the workspace on which you are running Azure Sentinel.

## Configure and connect Barracuda WAF
Barracuda Web Application Firewall can integrate and export logs directly to [ASI] via Azure OMS Server.
1. Go to [Barracuda WAF configuration flow](https://campus.barracuda.com/product/webapplicationfirewall/doc/73696965/configure-the-barracuda-web-application-firewall-to-integrate-with-the-oms-server-and-export-logs/), and follow the instructions to set up the connection, using these parameters:
- **Workspace ID**: 
- **Primary key**:
2. In the Azure Sentinel dashboard, go to the workspace on which you deployed Azure Sentinel and click the three dots at the end of the row and select **Advanced settings**. 
1. Select **Data** and then **Syslog**.
1. Make sure the facility you set in Barracuda exists and set the severity and click **Save**.


## Validate connectivity

It may take upwards of 20 minutes until your logs start to appear in Log Analytics. 



## Next steps
In this document, you learned how to connect Barracuda appliances to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](qs-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats.md).

