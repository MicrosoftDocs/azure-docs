---
title: Microsoft Azure Data Manager for Energy - How to enable Reservoir DDMS
description: "This article describes how to enable Reservoir DDMS in Azure Data Manager for Energy."
author: bharathim
ms.author: bselvaraj
ms.service: azure-data-manager-energy
ms.topic: how-to #Don't change
ms.date: 02/08/2025

#customer intent: As a Data Manager, I want to enable Reservoir DDMS for storing data related to seismic and well intepretation, structural modeling, geological modeling and reservoir modeling including reservoir simulation input.
---

# How to enable Reservoir DDMS (Preview)
The Reservoir Domain Data Management Service (Reservoir DDMS) is a group of services that provides storage associated with seismic and well interpretation, structural modeling, geological modeling, and reservoir modeling including reservoir simulation input.

[OSDU&reg; Reservoir DDMS](https://community.opengroup.org/osdu/platform/domain-data-mgmt-services/reservoir/home) is now available as a preview on the Azure Data Manager for Energy Developer tier only. This preview currently supports features in OSDU&reg; milestone M23 - v0.26.

The DDMS is fully integrated with all other OSDU&reg; services on Azure Data Manager for Energy. However, during the preview phase, it isn't be enabled for all Azure Data Manager for Energy resources by default. Interested customers should submit a support request on the Azure portal providing the following details:
- Subscription ID
- Azure Data Manager for Energy developer tier resource name
- Azure Data Manager for Energy developer tier resource group name
- Region where the instance is deployed
- Data partition name for which Reservoir DDMS needs to be enabled

You're informed via support channels once your request is processed.

> [!NOTE]
> The deployment of Reservoir DDMS is associated with a data partition of the Azure Data Manager for Energy resource, and all API calls must reference this specific data partition.

> [!IMPORTANT]
> During this preview period, the deployment of Reservoir DDMS is limited to a single data partition per developer tier resource.

## Next steps
To learn more about how to use Reservoir DDMS APIs, see:
> [!div class="nextstepaction"]
> [Tutorial: Use Reservoir DDMS websocket API endpoints](tutorial-reservoir-ddms-websocket.md)
> [Tutorial: Use Reservoir DDMS API endpoints](tutorial-reservoir-ddms-apis.md)