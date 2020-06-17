---
title: Connect Forcepoint products to Azure Sentinel| Microsoft Docs
description: Learn how to connect Forcepoint products to Azure Sentinel.
services: sentinel
author: yelevin
editor: ''

ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 02/20/2020
ms.author: yelevin

---


# Connect your Forcepoint products to Azure Sentinel

> [!IMPORTANT]
> The Forcepoint products data connector in Azure Sentinel is currently in public preview. This feature is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).


This article explains how to connect your Forcepoint products to Azure Sentinel. 

The Forcepoint data connectors allow you to connect Forcepoint Cloud Access Security Broker and Forcepoint Next Generation Firewall logs with Azure Sentinel. In this way you can automatically export user-defined logs into Azure Sentinel in real time. The connector gives you enriched visibility into user activities recorded by Forcepoint products. It also enables further correlation with data from Azure workloads and other feeds, and improves monitoring capability with Workbooks inside Azure Sentinel.

> [!NOTE]
> Data will be stored in the geographic location of the workspace on which you are running Azure Sentinel.

​

## Forward Forcepoint product logs to the Syslog agent 

​Configure the Forcepoint product to forward Syslog messages in CEF format to your Azure workspace via the Syslog agent.

1. Set up the Forcepoint product to Azure Sentinel integration as described in the following installation guides:
 - [Forcepoint CASB Integration Guide](https://frcpnt.com/casb-sentinel)
 - [Forcepoint NGFW Integration Guide](https://frcpnt.com/ngfw-sentinel)

2. Search for CommonSecurityLog to use the relevant schema in Log Analytics with DeviceVendor name contains 'Forcepoint'. 

3. Continue to [STEP 3: Validate connectivity](connect-cef-verify.md).



## Next steps

In this document, you learned how to connect Forcepoint products to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:

- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).

- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats-built-in.md).

- [Use workbooks](tutorial-monitor-your-data.md) to monitor your data.