---
title: Planning for an Azure Storage Discovery deployment
titleSuffix: Azure Storage Discovery
description: Considerations and best-practices while deploying Azure Storage Discovery service
author: pthippeswamy
ms.service: azure-storage-mover
ms.topic: overview
ms.date: 08/01/2025
ms.author: shaas
---

# Azure Storage Discovery: Regional availability and planning guide

Azure Storage Discovery empowers organizations to gain deep, actionable insights into their storage estate—across subscriptions, regions, and scopes. This article outlines the regional availability of Azure Storage Discovery, explains how to select regions for your workspace, and clarifies how regional aggregation of insights work.

## Workspace Region Availability

Azure Storage Discovery Workspaces (ASDW) are the foundational resource for configuring and visualizing your storage insights.
[!INCLUDE [control-plane-regions](includes/control-plane-regions.md)]

### What This Means for You

The region where your discovery workspace is deployed determines where the control plane for your discovery experience resides. This includes:

- **Latency**: Choosing a region close to your operational base can improve dashboard responsiveness.
- **Compliance**: Some organizations may have regulatory requirements that dictate where data must reside.

### Planning Guidance

When selecting a region for your workspace:

- **Proximity**: Choose a region geographically close to your primary operations or data sources.
- **Compliance**: Ensure the region aligns with your data residency and compliance policies.
- **Preview Availability**: Confirm that the region is supported in the current release phase (e.g., public preview).

## Regions for Storage Insights Aggregation

While the workspace defines where your Discovery resource resides, the actual data being analyzed comes from storage accounts across multiple regions.
[!INCLUDE [data-plane-regions](includes/data-plane-regions.md)]

### What This Means for You

This means that even if your workspace is deployed in a limited set of regions, you can still gain visibility into storage accounts located in a broader set of Azure regions. The service collects and aggregates metrics such as:

- **Capacity trends**
- **Activity and transaction volumes**
- **Configuration and security settings**
- **Cost and consumption breakdowns**

These insights are then visualized in your Discovery reports, enabling centralized visualization of a globally distributed storage estate.

## Best Practices for Regional Planning

To maximize the value of Azure Storage Discovery:

1. **Deploy your workspace in a supported region**: Ensure your chosen region is enabled for workspace creation.
2. **Define scopes strategically**: Use tenant, subscription, or resource group levels to group storage accounts logically.
3. **Use tags for filtering**: Apply Azure tags to storage accounts to selectively include them in your discovery scope.
4. **Verify access**: Ensure users have Reader access to the ASDW resource to view reports.
5. **Allow time for data to populate**: Metrics typically begin appearing within 24 hours of scope configuration.

For questions or feedback, contact the team at [StorageDiscovery@microsoft.com](mailto:StorageDiscovery@microsoft.com).