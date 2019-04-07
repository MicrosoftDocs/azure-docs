---
title: Connect Symantec ICDX data to Azure Sentinel Preview| Microsoft Docs
description: Learn how to connect Symantec ICDX data to Azure Sentinel.
services: sentinel
documentationcenter: na
author: rkarlin
manager: barbkess
editor: ''

ms.assetid: d068223f-395e-46d6-bb94-7ca1afd3503c
ms.service: sentinel
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 04/07/2019
ms.author: rkarlin

---
# Connect your Symantec ICDX appliance 

> [!IMPORTANT]
> Azure Sentinel is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Symantec ICDX connector allows you to easily connect all your Symantec security solution logs with your Azure Sentinel, to view dashboards, create custom alerts, and improve investigation. This gives you more insight into your organization’s network and improves your security operation capabilities. Integration between Symantec ICDX and Azure Sentinel makes use of REST API.


> [!NOTE]
> Data will be stored in the geographic location of the workspace on which you are running Azure Sentinel.

## Configure and connect Symantec ICDX 

Symantec ICDX can integrate and export logs directly to Azure Sentinel.

1. Open the ICDX Management Console.
2. In the left navigation menu, select **Configuration** and then the **Forwarders** tab.
3. In the Microsoft Azure Log Analytics row, click **More**, followed by **Edit**. 
4. In the **Microsoft Azure Log Analytics Forwarder** window, set the following:
    - Leave Custom Log Name as the default, SymantecICDX.
    - Copy the workspace ID and paste it in the **Customer Identifier** field. Copy the **Primary key** and paste it in the Shared Key field. You can copy these values from Azure Sentinel portal by selecting **Data connectors** and then **Symantec ICDX**.
6. To use the relevant schema in Log Analytics for the Symantec ICDX events, search for **SymantecICDX_CL**.


## Validate connectivity

It may take upwards of 20 minutes until your logs start to appear in Log Analytics. 



## Next steps
In this document, you learned how to connect Symantec ICDX to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats.md).

