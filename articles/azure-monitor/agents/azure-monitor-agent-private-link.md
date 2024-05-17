---
title: Enable network isolation for Azure Monitor Agent by using Private Link
description: Enable network isolation for Azure Monitor Agent.
ms.topic: conceptual
ms.date: 5/1/2023
ms.custom: references_region
ms.reviewer: jeffwo

---

# Enable network isolation for Azure Monitor Agent by using Private Link

By default, Azure Monitor Agent connects to a public endpoint to connect to your Azure Monitor environment. This article explains how to enable network isolation for your agents by using [Azure Private Link](../../private-link/private-link-overview.md).

## Prerequisites

- A [data collection rule](../essentials/data-collection-rule-create-edit.md), which defines the data Azure Monitor Agent collects and the destination to which the agent sends data. 

## Link your data collection endpoints to your Azure Monitor Private Link Scope

1. [Create a data collection endpoint](../essentials/data-collection-endpoint-overview.md#create-a-data-collection-endpoint) for each of your regions for agents to connect to instead of using the public endpoint. An agent can only connect to a data collection endpoint in the same region. If you have agents in multiple regions, create a data collection endpoint in each one.

1. [Configure your private link](../logs/private-link-configure.md). You'll use the private link to connect your data collection endpoint to a set of Azure Monitor resources that define the boundaries of your monitoring network. This set is called an Azure Monitor Private Link Scope.

1. [Add the data collection endpoints to your Azure Monitor Private Link Scope](../logs/private-link-configure.md#connect-azure-monitor-resources) resource. This process adds the data collection endpoints to your private DNS zone (see [how to validate](../logs/private-link-configure.md#review-and-validate-your-private-link-setup)) and allows communication via private links. You can do this task from the AMPLS resource or on an existing data collection endpoint resource's **Network isolation** tab.

    > [!IMPORTANT]
    > Other Azure Monitor resources like the Log Analytics workspaces configured in your data collection rules that you want to send data to must be part of this same AMPLS resource.
 
    For your data collection endpoints, ensure the **Accept access from public networks not connected through a Private Link Scope** option is set to **No** on the **Network Isolation** tab of your endpoint resource in the Azure portal. This setting ensures that public internet access is disabled and network communication only happens via private links.
     
    :::image type="content" source="media/azure-monitor-agent-dce/data-collection-endpoint-network-isolation.png" lightbox="media/azure-monitor-agent-dce/data-collection-endpoint-network-isolation.png" alt-text="Screenshot that shows configuring data collection endpoint network isolation." border="false":::
    
1. Associate the data collection endpoints to the target resources by editing the data collection rule in the Azure portal. On the **Resources** tab, select **Enable Data Collection Endpoints**. Select a data collection endpoint for each virtual machine. See [Configure data collection for Azure Monitor Agent](../agents/data-collection-rule-azure-monitor-agent.md).
 
    :::image type="content" source="media/azure-monitor-agent-dce/data-collection-rule-virtual-machines-with-endpoint.png" lightbox="media/azure-monitor-agent-dce/data-collection-rule-virtual-machines-with-endpoint.png" alt-text="Screenshot that shows configuring data collection endpoints for an agent." border="false":::


## Next steps

- Learn more about [Best practices for monitoring virtual machines in Azure Monitor](../best-practices-vm.md).
