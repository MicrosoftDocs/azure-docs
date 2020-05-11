---
title: Connect Zimperium Mobile Threat Defense to Azure Sentinel| Microsoft Docs
description: Learn how to connect Zimperium Mobile Threat Defense to Azure Sentinel.
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

# Connect your Zimperium Mobile Threat Defense to Azure Sentinel


> [!IMPORTANT]
> The Zimperium Mobile Threat Defense data connector in Azure Sentinel is currently in public preview.
> This feature is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).



Zimperium Mobile Threat Defense connector gives you the ability to connect the Zimperium threat log with Azure Sentinel to view dashboards, create custom alerts, and improve investigation. This gives you more insight into your organization's mobile threat landscape and enhances your security operation capabilities.

> [!NOTE]
> Data will be stored in the geographic location of the workspace on which you are running Azure Sentinel.

## Configure and connect Zimperium Mobile Threat Defense

Zimperium Mobile Threat Defense can integrate and export logs directly to **Azure Sentinel**.

1. In the Azure Sentinel portal, click Data connectors and select **Zimperium Mobile Threat Defense**.
2. Select **Open connector page**.
3. Follow the instructions on the **Zimperium Mobile Threat Defense** connector page, summarized as follows.
 1. In zConsole, click **Manage** on the navigation bar.
 2. Click the **Integrations** tab.
 3. Click the **Threat Reporting** button and then the **Add Integrations** button.
 4. Create the Integration by selecting **Microsoft Azure Sentinel** from the available integrations and enter workspace ID and primary key to connect to Azure Sentinel.
 5. Option to select a filter level for the threat data to push to Azure Sentinel is also available. 

4. For additional information, please refer to the [Zimperium customer support portal](https://support.zimperium.com).


## Find your data

After a successful connection is established, the data appears in Log Analytics under CustomLogs ZimperiumThreatLog_CL and ZimperiumMitigationLog_CL.

To use the relevant schema in Log Analytics for the Zimperium Mobile Threat Defense, search for ZimperiumThreatLog_CL and ZimperiumMitigationLog_CL.


## Validate connectivity

It may take upwards of 20 minutes until your logs start to appear in Log Analytics.

## Next steps

In this document, you learned how to connect Zimperium Mobile Threat Defense to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:

- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).

- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats-built-in.md).

- [Use workbooks](tutorial-monitor-your-data.md) to monitor your data.

To learn more about Zimperium, see the following:

- [Zimperium](https://zimperium.com)

- [Zimperium Mobile Security Blog](https://blog.zimperium.com)

- [Zimperium Customer Support Portal](https://support.zimperium.com)

