---
title: Connect Barracuda data to Azure Sentinel Preview| Microsoft Docs
description: Learn how to connect Barracuda data to Azure Sentinel.
services: sentinel
documentationcenter: na
author: rkarlin
manager: rkarlin
editor: ''

ms.assetid: 3b33b4aa-7286-4d79-b461-8e1812edc2e1
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 06/17/2019
ms.author: rkarlin

---
# Connect your Barracuda appliance 

> [!IMPORTANT]
> Azure Sentinel is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Barracuda Web Application Firewall (WAF) connector allows you to easily connect your Barracuda logs with your Azure Sentinel, to view dashboards, create custom alerts, and improve investigation. This gives you more insight into your organization’s network and improves your security operation capabilities. Azure Sentinel takes advantage of the native integration between **Barracuda** and Microsoft Monitoring Agent to provide seamless integration. 


> [!NOTE]
> Data will be stored in the geographic location of the workspace on which you are running Azure Sentinel.

## Configure and connect Barracuda WAF
Barracuda Web Application Firewall can integrate and export logs directly to Azure Sentinel via Microsoft Monitoring Agent.
1. Go to [Barracuda WAF configuration flow](https://campus.barracuda.com/product/webapplicationfirewall/doc/73696965/configure-the-barracuda-web-application-firewall-to-integrate-with-the-oms-server-and-export-logs/), and follow the instructions to set up the connection, using these parameters:
    - **Workspace ID**: copy the value of your workspace ID from the Azure Sentinel Barracuda connector page.
    - **Primary key**: copy the value of your primary key from the Azure Sentinel Barracuda connector page.
2. In the Azure Sentinel portal, go to the workspace on which you deployed Azure Sentinel and select the ellipsis (...) at the end of the row and select **Advanced settings**. 
1. Select **Data** and then **Syslog**.
1. Make sure the facility you set in Barracuda exists and set the severity and click **Save**.
6. To use the relevant schema in Log Analytics for the Barracuda events, search for **CommonSecurityLog** and **barracuda_CL**.


## Validate connectivity

It may take upwards of 20 minutes until your logs start to appear in Log Analytics. 



## Next steps
In this document, you learned how to connect Barracuda appliances to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats.md).

