---
title: View costs for managed online endpoints
titleSuffix: Azure Machine Learning
description: 'Learn to how view costs for a managed online endpoint in Azure Machine Learning in the Azure portal.'
services: machine-learning
ms.service: azure-machine-learning
author: msakande
ms.author: mopeakande
ms.reviewer: sehan
ms.subservice: core
ms.date: 08/15/2024
ms.topic: conceptual
ms.custom: how-to, deploy, devplatv2
#customer intent: As an analyst, I need to view the costs associated with the machine learning endpoints for a workspace.
---

# View costs for an Azure Machine Learning managed online endpoint

Learn how to view costs for a managed online endpoint. Costs for your endpoints accrue to the associated workspace. You can see costs for a specific endpoint using tags.

> [!IMPORTANT]
> This article only applies to viewing costs for Azure Machine Learning managed online endpoints. Managed online endpoints are different from other resources since they must use tags to track costs.
>
> For more information on managing and optimizing cost for Azure Machine Learning, see [Manage and optimize Azure Machine Learning costs](how-to-manage-optimize-cost.md). For more information on viewing the costs of other Azure resources, see [Quickstart: Start using Cost analysis](../cost-management-billing/costs/quick-acm-cost-analysis.md).

## Prerequisites

- Deploy an Azure Machine Learning managed online endpoint.
- Have at least [Billing Reader](../role-based-access-control/role-assignments-portal.yml) access on the subscription where the endpoint is deployed.

## View costs

Navigate to the **Cost Analysis** page for your subscription:

- In the [Azure portal](https://portal.azure.com), select **Cost Analysis** for your subscription.

  :::image type="content" source="./media/how-to-view-online-endpoints-costs/online-endpoints-cost-analysis.png" alt-text="Screenshot of a subscription in the Azure portal showing red box around Cost Analysis button.":::

Create a filter to scope data to your Azure Machine Learning workspace resource:

1. At the top navigation bar, select **Add filter**.

1. In the first filter dropdown, select **Resource** for the filter type.

1. In the second filter dropdown, select your Azure Machine Learning workspace.

   :::image type="content" source="./media/how-to-view-online-endpoints-costs/online-endpoints-cost-analysis-add-filter.png" lightbox="./media/how-to-view-online-endpoints-costs/online-endpoints-cost-analysis-add-filter.png" alt-text="creenshot of the Cost Analysis view showing a red box around the Add filter button.":::

Create a tag filter to show your managed online endpoint and managed online deployment:

1. Select **Add filter** > **Tag** > **azuremlendpoint**: *\<your endpoint name>*.

1. Select **Add filter** > **Tag** > **azuremldeployment**: *\<your deployment name>*.

   > [!NOTE]
   > Dollar values in this image are fictitious and do not reflect actual costs.

   :::image type="content" source="./media/how-to-view-online-endpoints-costs/online-endpoints-cost-analysis-select-endpoint-deployment.png" lightbox="./media/how-to-view-online-endpoints-costs/online-endpoints-cost-analysis-select-endpoint-deployment.png" alt-text="Screenshot of the Cost Analysis view showing a red box around the Tag buttons.":::

> [!TIP]
> Managed online endpoint uses VMs for the deployments. If you submitted a request to create an online deployment and it failed, it might have passed the stage when compute is created. In that case, the failed deployment would incur charges. If you finished debugging or investigation for the failure, you can delete the failed deployments to save the cost.

## Related content

- [Endpoints for inference in production](concept-endpoints.md)
- [Monitor online endpoints](./how-to-monitor-online-endpoints.md)
- [Deploy and score a machine learning model by using an online endpoint](how-to-deploy-online-endpoints.md)
- [Manage and optimize Azure Machine Learning costs](how-to-manage-optimize-cost.md)
