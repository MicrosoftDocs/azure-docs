---
title: Monitor with StandardV2 NAT Gateway Flow Logs
titleSuffix: Azure NAT Gateway
description: Learn how to set up, monitor, and troubleshoot with StandardV2 NAT Gateway Flow Logs.
author: cozhang
ms.author: allensu
ms.service: azure-nat-gateway
ms.topic: how-to
ms.date: 11/04/2025
ms.custom: template-how-to, devx-track-azurecli, devx-track-azurepowershell
#Customer intent: As a network administrator, I want to learn how to enable StandardV2 NAT Gateway flow logs and how the data can be analyzed.
---

# Monitor with StandardV2 NAT Gateway Flow Logs
In this article, you learn how to set up, monitor, and troubleshoot with Azure StandardV2 NAT Gateway flow logs. These logs can help you monitor and analyze the traffic flows going through your NAT gateway resource. The health event logs are provided through the Azure Monitor resource log category NatGatwayFlowlogsV1, which is enabled through Diagnostic Settings.

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- An Azure StandardV2 NAT Gateway resource. To learn how to create a StandardV2 NAT Gateway resource, see [Quickstart: Create a StandardV2 NAT Gateway](./quickstart-create-nat-gateway-v2.md).
- An Azure Monitor Log Analytics workspace. To learn how to create a Log Analytics workspace, see [Quickstart: Create a Log Analytics workspace](/azure/azure-monitor/logs/quick-create-workspace).



> [!NOTE]
> If you're sending logs to Azure Storage or Event Hubs, ensure the region of your storage account and Event Hubs namespace are in the same region as your StandardV2 NAT gateway resource.
 
1. In the Azure portal, navigate to your StandardV2 NAT gateway resource.
1. From your NAT gateway resource's **Overview** page, choose **Monitoring** > **Diagnostic settings**.
1. Select **+ Add diagnostic setting**.
1. In the **Diagnostic setting** window, select or enter the following settings:

    | **Setting** | **Value** |
    | --- | --- |
    | **Diagnostic setting name** | Enter a name for the diagnostic setting. |
    | **Logs** | |
    | **Category Groups** | Select **NatGatewayFlowlogsV1**. |
    | **Metrics** | Leave unchecked. |
    | **Destination details** | Select **Send to Log Analytics workspace**.</br>Select your subscription and your Log Analytics workspace. |

1. Select Save and close the Diagnostic setting window.

    > [!NOTE]
    > Once your diagnostic setting is configured, it can take up to 90 minutes for logs to appear. 

## Configure a log query

In this section, you learn how to query StandardV2 NAT Gateway flow logs to identify virtual machines generating the most outbound traffic sent – commonly referred to as top talkers. This insight is useful for diagnosing unexpected spikes in traffic and understanding bandwidth consumption patterns. The sample query provided sorts the virtual machines by the total number of packets sent in descending order. The query allows you to quickly pinpoint which virtual machines are sending the most outbound traffic from your NAT gateway.

1. In the Azure portal, navigate to your Log Analytics workspace resource associated to your StandardV2 NAT gateway resource.
1. From your Log Analytics workspace's **Overview** page, choose **Logs**.
1. Enter the following code in the query editor:

1. The following code is displayed in the query editor:

    ```kusto
        NatGatewayFlowlogsV1
        | where TimeGenerated > ago(1d)
        | summarize TotalPacketsSent = sum(PacketsSent) by SourceIP
        | sort by TotalPacketsSent desc

    ```
    :::image type="content" source="media/monitor-flow-logs/view-top-talkers-query.png" alt-text="Screenshot of query editor with NAT Gateway top talkers kusto query.":::

1. Select **Run** to execute the query.
1. If you want to modify and save the query, make your query changes and select **Save**>**Save as query**.
1. In the **Save a query** window, enter a name for the query, other optional information, and select **Save**.

## Next step

For more information about StandardV2 NAT Gateway flow logs, see [StandardV2 NAT Gateway Flow Logs](./nat-gateway-flow-logs.md).

