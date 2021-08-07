---
title: Use managed online endpoints (preview) in the studio
titleSuffix: Azure Machine Learning
description: 'Learn how to create and use managed online endpoints (preview) using the Azure Machine Learning studio.'
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
ms.custom: how-to, managed online endpoints, devplatv2
ms.author: ssambare
author: shivanissambare
ms.reviewer: peterlu
ms.date: 05/25/2021
---

# Create and use managed online endpoints (preview) in the studio

Learn how to use the studio to create and manage your managed online endpoints (preview) in Azure Machine Learning. Use managed online endpoints to streamline production-scale deployments. For more information on managed online endpoints, see [What are endpoints](concept-endpoints.md).

In this article, you learn how to:

> [!div class="checklist"]
> * Create a managed online endpoint
> * View managed online endpoints
> * Update managed online endpoints
> * Delete managed online endpoints and deployments

[!INCLUDE [preview disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

## Prerequisites

- An Azure Machine Learning workspace. For more information, see [Create an Azure Machine Learning workspace](how-to-manage-workspace.md).
- A [model registered to your workspace](how-to-deploy-and-where.md#registermodel).
- A scoring file for your deployed model. For a step-by-step example of registering a model and creating a scoring file, see [Tutorial: Image classification](tutorial-train-models-with-aml.md).
- A custom environment registered to your workspace **-or-** a Docker container registry image with a Python environment. For more information on environments, see [Create and use software environments in Azure Machine Learning](how-to-use-environments.md).

## Create a managed online endpoint (preview)

Use the studio to create a managed online endpoint (preview) directly in your browser. When you create a managed online endpoint in the studio, you must define an initial deployment. You cannot create an empty managed online endpoint.

1. Go to the [Azure Machine Learning studio](https://ml.azure.com).
1. In the left navigation bar, select the **Endpoints** page.
1. Select **+ Create (preview)**.

:::image type="content" source="media/how-to-create-managed-online-endpoint-studio/endpoint-create-managed-online-endpoint.png" alt-text="Create a managed online endpoint from the Endpoints tab":::

You can also create a managed online endpoint from the **Models** page in the studio. This is an easy way to add a model to an existing managed online deployment.

1. Go to the [Azure Machine Learning studio](https://ml.azure.com).
1. In the left navigation bar, select the **Models** page.
1. Select a model by checking the circle next to the model name.
1. Select **Deploy** > **Deploy to endpoint (preview)**.

Follow the setup wizard to configure your managed online endpoint.

:::image type="content" source="media/how-to-create-managed-online-endpoint-studio/models-page-deployment-latest.png" alt-text="Create a managed online endpoint from the Models tab":::

## View managed online endpoints (preview)

You can view your managed online endpoints (preview) in the **Endpoints** page. Use the endpoint details page to find critical information including the endpoint URI, status, testing tools, activity monitors, deployment logs, and sample consumption code:

1. In the left navigation bar, select **Endpoints**.
1. (Optional) Create a **Filter** on **Compute type** to show only **Managed** compute types.
1. Select an endpoint name to view the endpoint detail page.

### Test

Use the **Test** tab in the endpoints details page to test your managed online deployment. Enter sample input and view the results.

1. Select the **Test** tab in the endpoint's detail page.
1. Use the dropdown to select the deployment you want to test.
1. Enter sample input.
1. Select **Test**.

:::image type="content" source="media/how-to-create-managed-online-endpoint-studio/test-deployment.png" alt-text="Test a deployment by providing sample data, directly in your browser":::

### Monitoring

Use the **Monitoring** tab to see high-level activity monitor graphs for your managed online endpoint.

To use the monitoring tab, you must select "**Enable Application Insight diagnostic and data collection**" when you create your endpoint.

:::image type="content" source="media/how-to-create-managed-online-endpoint-studio/monitor-endpoint.png" alt-text="Monitor endpoint-level metrics in the studio":::

For more information on how viewing additional monitors and alerts, see [How to monitor managed online endpoints](how-to-monitor-online-endpoints.md).

## Update managed online endpoints (preview)

Learn how to update your managed online endpoints (preview) to add more deployments and adjust traffic allocation.

### Add a managed online deployment

Use the following instructions to add a deployment to an existing managed online endpoint:

1. Select **+ Add Deployment** button in the [endpoint details page](#view-managed-online-endpoints-preview).
2. Follow the instructions to complete the deployment.

Alternatively, you can use the **Models** page to add a deployment:

1. In the left navigation bar, select the **Models** page.
1. Select a model by checking the circle next to the model name.
1. Select **Deploy** > **Deploy to endpoint (preview)**.
1. Choose to deploy to an existing managed online endpoint.

> [!NOTE]
> You can adjust the traffic balance between deployments in an endpoint when adding a new deployment.
>
> :::image type="content" source="media/how-to-create-managed-online-endpoint-studio/adjust-deployment-traffic.png" alt-text="Use sliders to control traffic distribution across multiple deployments":::

### Update deployment traffic allocation

Use **deployment traffic allocation** to control the percentage of incoming of requests going to each deployment in an endpoint.

1. In the endpoint details page, Select  **Update traffic**.
2. Adjust your traffic and select **Update**.

> [!TIP]
> The **Total traffic percentage** must sum to either 0% (to disable traffic) or 100% (to enable traffic).

### Update deployment instance count

Use the following instructions to scale an individual deployment up or down by adjusting the number of instances:

1. In the endpoint details page. Find the card for the deployment you want to update.
1. Select the **edit icon** in the deployment detail card.
1. Update the instance count.
1. Select **Update**.


## Delete managed online endpoints and deployments (preview)

Learn how to delete an entire managed online endpoint (preview) and it's associated deployments (preview). Or, delete an individual deployment from a managed online endpoint.

### Delete a managed online endpoint

Deleting a managed online endpoint also deletes any deployments associated with it.

1. Go to the [Azure Machine Learning studio](https://ml.azure.com).
1. In the left navigation bar, select the **Endpoints** page.
1. Select an endpoint by checking the circle next to the model name.
1. Select **Delete**.

Alternatively, you can delete a managed online endpoint directly in the [endpoint details page](#view-managed-online-endpoints-preview). 


### Delete an individual deployment

Use the following steps to delete an individual deployment from a managed online endpoint. This does affect the other deployments in the managed online endpoint:

> [!NOTE]
> You cannot delete a deployment that has allocated traffic. You must first [set traffic allocation](#update-deployment-traffic-allocation) for the deployment to 0% before deleting it.

1. Go to the [Azure Machine Learning studio](https://ml.azure.com).
1. In the left navigation bar, select the **Endpoints** page.
1. Select your managed online endpoint.
1. In the endpoint details page, find the deployment you want to delete.
1. Select the **delete icon**.

## Next steps

In this article, you learned how to use Azure Machine Learning managed online endpoints. See these next steps:

- [What are endpoints?](concept-endpoints.md)
- [How to deploy managed online endpoints with the Azure CLI](how-to-deploy-managed-online-endpoints.md)
- [Deploy models with REST (preview)](how-to-deploy-with-rest.md)
- [How to monitor managed online endpoints](how-to-monitor-online-endpoints.md)
- [Troubleshooting managed online endpoints deployment and scoring (preview)](how-to-troubleshoot-managed-online-endpoints.md)
- [View costs for an Azure Machine Learning managed online endpoint (preview)](how-to-view-online-endpoints-costs.md)
- [Manage and increase quotas for resources with Azure Machine Learning](how-to-manage-quotas.md#azure-machine-learning-managed-online-endpoints-preview)