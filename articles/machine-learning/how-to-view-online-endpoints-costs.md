---
title: View costs for managed online endpoints
titleSuffix: Azure Machine Learning
description: 'Learn to how view costs for a managed online endpoint in Azure Machine Learning.'
services: machine-learning
ms.service: machine-learning
author: dem108
ms.author: sehan
ms.reviewer: mopeakande
ms.subservice: core
ms.date: 11/04/2022
ms.topic: conceptual
ms.custom: how-to, deploy, devplatv2, event-tier1-build-2022
---

# View costs for an Azure Machine Learning managed online endpoint

Learn how to view costs for a managed online endpoint. Costs for your endpoints will accrue to the associated workspace. You can see costs for a specific endpoint using tags.

> [!IMPORTANT]
> This article only applies to viewing costs for Azure Machine Learning managed online endpoints. Managed online endpoints are different from other resources since they must use tags to track costs. For more information on viewing the costs of other Azure resources, see [Quickstart: Explore and analyze costs with cost analysis](../cost-management-billing/costs/quick-acm-cost-analysis.md).

## Prerequisites

- Deploy an Azure Machine Learning managed online endpoint.
- Have at least [Billing Reader](../role-based-access-control/role-assignments-portal.md) access on the subscription where the endpoint is deployed

## View costs

Navigate to the **Cost Analysis** page for your subscription:

1. In the [Azure portal](https://portal.azure.com), Select **Cost Analysis** for your subscription.

    [![Managed online endpoint cost analysis: screenshot of a subscription in the Azure portal showing red box around "Cost Analysis" button on the left hand side.](./media/how-to-view-online-endpoints-costs/online-endpoints-cost-analysis.png)](./media/how-to-view-online-endpoints-costs/online-endpoints-cost-analysis.png#lightbox)

Create a filter to scope data to your Azure Machine Learning workspace resource:

1. At the top navigation bar, select **Add filter**.

1. In the first filter dropdown, select **Resource** for the filter type.

1. In the second filter dropdown, select your Azure Machine Learning workspace.

    [![Managed online endpoint cost analysis: screenshot of the Cost Analysis view showing a red box around the "Add filter" button at the top right.](./media/how-to-view-online-endpoints-costs/online-endpoints-cost-analysis-add-filter.png)](./media/how-to-view-online-endpoints-costs/online-endpoints-cost-analysis-add-filter.png#lightbox)

Create a tag filter to show your managed online endpoint and/or managed online deployment:
1. Select **Add filter** > **Tag** > **azuremlendpoint**: "\<your endpoint name>" 
1. Select **Add filter** > **Tag** > **azuremldeployment**: "\<your deployment name>".

    > [!NOTE]
    > Dollar values in this image are fictitious and do not reflect actual costs.

    [![Managed online endpoint cost analysis: screenshot of the Cost Analysis view showing a red box around the "Tag" buttons in the top right.](./media/how-to-view-online-endpoints-costs/online-endpoints-cost-analysis-select-endpoint-deployment.png)](./media/how-to-view-online-endpoints-costs/online-endpoints-cost-analysis-select-endpoint-deployment.png#lightbox)

## Next steps
- [What are endpoints?](concept-endpoints.md)
- Learn how to [monitor your managed online endpoint](./how-to-monitor-online-endpoints.md).
- [How to deploy an ML model with an online endpoint (CLI)](how-to-deploy-online-endpoints.md)
- [How to deploy managed online endpoints with the studio](how-to-use-managed-online-endpoint-studio.md)
