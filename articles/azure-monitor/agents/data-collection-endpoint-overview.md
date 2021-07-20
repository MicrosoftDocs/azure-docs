---
title: Data Collection Endpoints in Azure Monitor (preview)
description: Overview of data collection endpoints (DCEs) in Azure Monitor including their contents and structure and how you can create and work with them.
ms.topic: conceptual
author: shseth
ms.author: shseth
ms.date: 07/09/2021
ms.custom: references_region

---

# Data collection endpoints in Azure Monitor (preview)
Data Collection Endpoints (DCE) allow you to uniquely configure ingestion settings for your machines, giving you greater control over your networking requirements. This article provides an overview of data collection endpoints including their contents and structure and how you can create and work with them.

## Components of a data collection endpoint
A data collection endpoint includes the following components.

| Component | Description |
|:---|:---|


## Regionality
Data collection endpoints are ARM resources created within specific regions. An endpoint in a given region can only be **associated with machines in the same region**, although you can have more than one endpoint within the same region as per your needs.

## Limits
As this feature is in preview, while there are no feature limitations we do not recommend using it in production environments until generally available.

## Create endpoint in Azure portal
You can use the Azure portal to create a data collection endpoint and associate virtual machines in your subscription to that rule. 

> [!NOTE]
> The data collection endpoint should be created in the **same region** where your virtual machines exist.  

In the **Azure Monitor** menu in the Azure portal, select **Data Collection Endpoint** from the **Settings** section. Click **Create** to create a new Data Collection Rule and assignment.

[![Data Collection Endpoints](media/data-collection-endpoint-overview/data-collection-endpoint-overview.png)](media/data-collection-endpoint-overview/data-collection-endpoint-overview.png#lightbox)

Click **Create** to create a new endpoint. Provide a **Rule name** and specify a **Subscription**, **Resource Group** and **Region**. This specifies where the DCE will be created.

[![Data Collection Rule Basics](media/data-collection-endpoint-overview/data-collection-endpoint-basics.png)](media/data-collection-endpoint-overview/data-collection-endpoint-basics.png#lightbox)

Click **Review + create** to review the details of the data collection endpoint. Click **Create** to create it.

## Sample data collection endpoint
The sample data collection endpoint below is for virtual machines with Azure Monitor agent and has the following details:

## Enable network isolation for the Azure Monitor Agent
You can use data collection endpoints to enable the Azure Monitor agent to communicate to the internet via private links. To do so, you must:
- Configure the data collection endpoints for the target resources, as part of the data collection rules. This results in the agent using the configured the data collection endpoint for network communications. See [Configure data collection for the Azure Monitor agent](../agents/data-collection-rule-azure-monitor-agent.md).
- Add the data collection endpoints to an [Azure Monitor Private Link Scopes (AMPLS)](../logs/private-link-security.md#connect-azure-monitor-resources) resource.
- Ensure **Allow public network access for ingestion** option is set to **No** under the 'Network Isolation' tab of your data collection endpoint resource, as shown below (set to 'No' by default)

![Data collection endpoint network isolation](media/private-link-security/ampls-data-collection-endpoint-network-isolation.png)

## Next steps
- [Associate endpoint to machines](data-collection-rule-azure-monitor-agent.md#create-rule-and-association-in-azure-portal)
- [Add endpoint to AMPLS resource](../logs/private-link-security.md#connect-azure-monitor-resources) 
