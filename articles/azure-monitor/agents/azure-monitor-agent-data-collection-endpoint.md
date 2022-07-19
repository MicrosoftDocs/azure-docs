---
title: Using data collection endpoints with Azure Monitor agent
description: Use data collection endpoints to uniquely configure ingestion settings for your machines.
ms.topic: conceptual
author: shseth
ms.author: shseth
ms.date: 06/06/2022
ms.custom: references_region
ms.reviewer: shseth

---

# Enable network isolation for the Azure Monitor Agent
By default, Azure Monitor agent will connect to a public endpoint to connect to your Azure Monitor environment. You can enable network isolation for your agents by creating [data collection endpoints](../essentials/data-collection-endpoint-overview.md)  and adding them to your [Azure Monitor Private Link Scopes (AMPLS)](../logs/private-link-configure.md#connect-azure-monitor-resources).


## Create data collection endpoint
To use network isolation, you must create a data collection endpoint for each of your regions for agents to connect instead of the public endpoint. See [Create a data collection endpoint](../essentials/data-collection-endpoint-overview.md#create-data-collection-endpoint) for details on create a DCE. An agent can only connect to a DCE in the same region. If you have agents in multiple regions, then you must create a DCE in each one.


## Create private link 
With [Azure Private Link](../../private-link/private-link-overview.md), you can securely link Azure platform as a service (PaaS) resources to your virtual network by using private endpoints. An Azure Monitor Private Link connects a private endpoint to a set of Azure Monitor resources, defining the boundaries of your monitoring network. That set is called an Azure Monitor Private Link Scope (AMPLS). See [Configure your Private Link](../logs/private-link-configure.md) for details on creating and configuring your AMPLS.

## Add DCE to AMPLS
Add the data collection endpoints to a new or existing [Azure Monitor Private Link Scopes (AMPLS)](../logs/private-link-configure.md#connect-azure-monitor-resources) resource. This adds the DCE endpoints to your private DNS zone (see [how to validate](../logs/private-link-configure.md#review-and-validate-your-private-link-setup)) and allows communication via private links. You can do this from either the AMPLS resource or from within an existing DCE resource's 'Network Isolation' tab.

> [!NOTE]
> Other Azure Monitor resources like the Log Analytics workspace(s) configured in your data collection rules that you wish to send data to, must be part of this same AMPLS resource.


For your data collection endpoint(s), ensure **Accept access from public networks not connected through a Private Link Scope** option is set to **No** under the 'Network Isolation' tab of your endpoint resource in Azure portal, as shown below. This ensures that public internet access is disabled, and network communication only happen via private links.

:::image type="content" source="media/azure-monitor-agent-dce/data-collection-endpoint-network-isolation.png" lightbox="media/azure-monitor-agent-dce/data-collection-endpoint-network-isolation.png" alt-text="Screenshot for configuring data collection endpoint network isolation.":::



 Associate the data collection endpoints to the target resources by editing the data collection rule in Azure portal. From the **Resources** tab, select **Enable Data Collection Endpoints** and select a DCE for each virtual machine. See [Configure data collection for the Azure Monitor agent](../agents/data-collection-rule-azure-monitor-agent.md).


:::image type="content" source="media/azure-monitor-agent-dce/data-collection-rule-virtual-machines-with-endpoint.png" lightbox="media/azure-monitor-agent-dce/data-collection-rule-virtual-machines-with-endpoint.png" alt-text="Screenshot for configuring data collection endpoint for an agent.":::




## Next steps
- [Associate endpoint to machines](../agents/data-collection-rule-azure-monitor-agent.md#create-data-collection-rule-and-association)
- [Add endpoint to AMPLS resource](../logs/private-link-configure.md#connect-azure-monitor-resources) 
