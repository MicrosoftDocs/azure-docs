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


## Enable network isolation via private links
Data collection endpoints when used in conjuction with the new Azure Monitor agent and data collection rules enable you to configure private links, using [Azure Monitor Private Link Scopes (AMPLS)](../logs/private-link-security.md), for sending data to Azure Monitor.



### Prerequisites
- Azure Monitor Agent running on virtual machines, virtual machine scale sets or Azure Arc for servers. See [Install the Azure Monitor agent](../agents/azure-monitor-agent-install.md).
- Data collection rules and associations configured for the above resources. See [Configure data collection for the Azure Monitor agent](../agents/data-collection-rule-azure-monitor-agent.md).
- AMPLS resource(s) with other Azure Monitor features added. See [Example connection](../logs/private-link-security.md#example-connection).

### Create endpoint in Azure portal
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

## Next steps

- [Associate endpoint to machines](data-collection-rule-azure-monitor-agent.md#create-rule-and-association-in-azure-portal)
- [Add endpoint to AMPLS resource](../logs/private-link-security.md#configure-data-collection-endpoints) 
