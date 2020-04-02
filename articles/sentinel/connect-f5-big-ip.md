---
title: Connect F5 BIG-IP data to Azure Sentinel| Microsoft Docs
description: Learn how to connect F5 BIG-IP data to Azure Sentinel.
services: sentinel
documentationcenter: na
author: yelevin
manager: rkarlin
editor: ''

ms.assetid: d068223f-395e-46d6-bb94-7ca1afd3503c
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 12/30/2019
ms.author: yelevin

---
# Connect your F5 BIG-IP appliance 

> [!IMPORTANT]
> The F5 BIG-IP data connector in Azure Sentinel is currently in public preview.
> This feature is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

The F5 BIG-IP connector allows you to easily connect all your F5 BIG-IP logs with Azure Sentinel, to view workbooks, create custom alerts, and improve investigation. This gives you more insight into your organization’s network and improves your security operation capabilities. Integration between F5 BIG-IP and Azure Sentinel makes use of REST API.


> [!NOTE]
> Data will be stored in the geographic location of the workspace on which you are running Azure Sentinel.

## Configure and connect F5 BIG-IP 

F5 BIG-IP can integrate and export logs directly to Azure Sentinel.

1. In the Azure Sentinel portal, click **Data connectors** and select **F5 BIG-IP** and then **Open connector page**. 
1. To connect your F5 BIG-IP, you have to post a JSON declaration to the system’s API endpoint. For instructions on how to do this, see [Integrating the F5 BIG-IP with Azure Sentinel](https://devcentral.f5.com/s/articles/Integrating-the-F5-BIGIP-with-Azure-Sentinel).
8. From the F5 BIG-IP connector page, copy the Workspace ID and Primary Key and paste them as instructed under [Streaming data to Azure Log Analytics](https://devcentral.f5.com/s/articles/Integrating-the-F5-BIGIP-with-Azure-Sentinel#streaming-data-to-azure-log-analytics).
1. After you complete the F5 BIG-IP instructions, in the Azure Sentinel connector page, you see the connected data types.
1. To use the relevant schema in Log Analytics for the F5 BIG-IP events, search for **F5Telemetry_LTM_CL**, **F5Telemetry_system_CL**, and **F5Telemetry_ASM_CL**.


## Validate connectivity

It may take upwards of 20 minutes until your logs start to appear in Log Analytics. 



## Next steps
In this document, you learned how to connect F5 BIG-IP to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats-built-in.md).
- [Use workbooks](tutorial-monitor-your-data.md) to monitor your data.


