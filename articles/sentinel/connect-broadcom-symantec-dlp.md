---
title: Connect </MFR NAME> </PRODUCT NAME> data to Azure Sentinel| Microsoft Docs
description: Learn how to use the </MFR NAME> </PRODUCT NAME> data connector to pull </PRODUCT NAME> logs into Azure Sentinel. View </PRODUCT NAME> data in workbooks, create alerts, and improve investigation.
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
ms.date: 01/27/2021
ms.author: yelevin

---
# Connect your Symantec Data Loss Prevention (DLP) to Azure Sentinel

This article explains how to connect your Symantec DLP appliance to Azure Sentinel. The Symantec DLP data connector allows you to easily connect your Symantec DLP logs with Azure Sentinel, to view dashboards, create custom alerts, and improve investigation. 


> [!NOTE]
> Data will be stored in the geographic location of the workspace on which you are running Azure Sentinel.

## Forward Symantec DLP logs to the Syslog agent  

Configure Symantec DLP to forward Syslog messages in CEF format to your Azure workspace via the Syslog agent.
1. In the Azure Sentinel portal, click **Data connectors** and select **Symantec DLP** connector.
2. Select **Open connector page**.
3. Follow the instructions on the **Symantec DLP** page.

## Validate connectivity
It may take upwards of 20 minutes until your logs start to appear in Log Analytics. 

4. If the expected logs do not appear, continue to [validate connectivity](connect-cef-verify.md) for troubleshooting.

## Find your data

After a successful connection is established, to use the relevant schema in Log Analytics for the Symantec DLP, search for the **CommonSecurityLog** table.



## Next steps
In this document, you learned how to connect Symantec DLP to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats-built-in.md).
- [Use workbooks](tutorial-monitor-your-data.md) to monitor your data.