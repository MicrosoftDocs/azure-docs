---
title: View costs for managed online endpoints (preview)
titleSuffix: Azure Machine Learning
description: 'Learn to how view costs for a managed online endpoint in Azure Machine Learning.'
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.author: gopalv
author: gvashishtha
ms.date: 05/03/2021
ms.topic: conceptual
ms.custom: how-to, deploy
---

# View costs for an Azure Machine Learning managed online endpoint

Learn how to view costs for an online Azure Machine Learning managed online endpoint. Costs for your endpoints will accrue to the associated workspace. You can see costs for a specific endpoint using tags.

> [!TIP]
> This article only applies to Azure Machine Learning managed online endpoints. For viewing the costs of other Azure resources, see [Quickstart: Explore and analyze costs with cost analysis](../cost-management-billing/costs/quick-acm-cost-analysis.md).

## Prerequisites

In order to use the steps in this article, you must:

- Have a deployed Azure Machine Learning managed online endpoint
- Have at least [Billing Reader](../role-based-access-control/role-assignments-portal.md) access on the subscription where the endpoint is deployed

## Viewing costs

To view costs for an Azure Machine Learning managed online endpoint:

1. Select **Cost Analysis** for your subscription in the [Azure portal](https://portal.azure.com).

    [![Screenshot of a subscription in the Azure portal showing red box around "Cost Analysis" button on the lefthand side](./media/how-to-view-online-endpoints-costs/1.cost-analysis.png)](./media/how-to-view-online-endpoints-costs/1.cost-analysis.png#lightbox)

1. Choose **Add filter** at the top navigation bar.

    [![Screenshot of the Cost Analysis view showing a red box around the "Add filter" button at the top right](./media/how-to-view-online-endpoints-costs/2.add-filter.png)](./media/how-to-view-online-endpoints-costs/2.add-filter.png#lightbox)

1. Select your workspace.

    [![Screenshot of the Cost Analysis view showing a red box around the "Resource" dropdown menu](./media/how-to-view-online-endpoints-costs/3.select-workspace.png)](./media/how-to-view-online-endpoints-costs/3.select-workspace.png#lightbox)


1. Select **Tag**, then **azuremlendpoint**: "<your endpoint name>" and **azuremldeployment**: "<your deployment name>".

    [![Screenshot of the Cost Analysis view showing a red box around the "Tag" buttons in the top right](./media/how-to-view-online-endpoints-costs/4.select-endpoint-deployment.png)](./media/how-to-view-online-endpoints-costs/4.select-endpoint-deployment.png#lightbox)


## Next steps

* Learn how to [monitor your endpoint](./how-to-monitor-online-endpoints.md).