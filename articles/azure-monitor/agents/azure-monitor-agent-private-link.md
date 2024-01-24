---
title: Enable network isolation for Azure Monitor Agent using Private Link
description: Enable network isolation for Azure Monitor Agent.
ms.topic: conceptual
ms.date: 5/1/2023
ms.custom: references_region
ms.reviewer: jeffwo

---

# Enable network isolation for Azure Monitor Agent using Private Link

By default, Azure Monitor Agent connects to a public endpoint to connect to your Azure Monitor environment. To enable network isolation for your agents, create [data collection endpoints](../essentials/data-collection-endpoint-overview.md) and add them to your [Azure Monitor Private Link Scopes (AMPLS)](../logs/private-link-configure.md#connect-azure-monitor-resources).

## Create a data collection endpoint

[Create a data collection endpoint](../essentials/data-collection-endpoint-overview.md#create-a-data-collection-endpoint) for each of your regions so that agents can connect instead of using the public endpoint. An agent can only connect to a DCE in the same region. If you have agents in multiple regions, you must create a DCE in each one.

## Create a private link

With [Azure Private Link](../../private-link/private-link-overview.md), you can securely link Azure platform as a service (PaaS) resources to your virtual network by using private endpoints. An Azure Monitor private link connects a private endpoint to a set of Azure Monitor resources that define the boundaries of your monitoring network. That set is called an Azure Monitor Private Link Scope. For information on how to create and configure your AMPLS, see [Configure your private link](../logs/private-link-configure.md).

## Add DCEs to AMPLS

Add the data collection endpoints to a new or existing [Azure Monitor Private Link Scopes](../logs/private-link-configure.md#connect-azure-monitor-resources) resource. This process adds the DCEs to your private DNS zone (see [how to validate](../logs/private-link-configure.md#review-and-validate-your-private-link-setup)) and allows communication via private links. You can do this task from the AMPLS resource or on an existing DCE resource's **Network isolation** tab.

> [!NOTE]
> Other Azure Monitor resources like the Log Analytics workspaces configured in your data collection rules that you want to send data to must be part of this same AMPLS resource.

For your data collection endpoints, ensure the **Accept access from public networks not connected through a Private Link Scope** option is set to **No** on the **Network Isolation** tab of your endpoint resource in the Azure portal. This setting ensures that public internet access is disabled and network communication only happens via private links.
<!-- convertborder later -->
:::image type="content" source="media/azure-monitor-agent-dce/data-collection-endpoint-network-isolation.png" lightbox="media/azure-monitor-agent-dce/data-collection-endpoint-network-isolation.png" alt-text="Screenshot that shows configuring data collection endpoint network isolation." border="false":::

## Associate DCEs to target machines
Associate the data collection endpoints to the target resources by editing the data collection rule in the Azure portal. On the **Resources** tab, select **Enable Data Collection Endpoints**. Select a DCE for each virtual machine. See [Configure data collection for Azure Monitor Agent](../agents/data-collection-rule-azure-monitor-agent.md).
<!-- convertborder later -->
:::image type="content" source="media/azure-monitor-agent-dce/data-collection-rule-virtual-machines-with-endpoint.png" lightbox="media/azure-monitor-agent-dce/data-collection-rule-virtual-machines-with-endpoint.png" alt-text="Screenshot that shows configuring data collection endpoints for an agent." border="false":::

## Next steps

- [Associate endpoint to machines](../agents/data-collection-rule-azure-monitor-agent.md#create-a-data-collection-rule)
- [Add endpoint to AMPLS resource](../logs/private-link-configure.md#connect-azure-monitor-resources).
