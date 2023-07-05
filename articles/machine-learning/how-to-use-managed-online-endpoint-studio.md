---
title: Use managed online endpoints in the studio
titleSuffix: Azure Machine Learning
description: 'Learn how to create and use managed online endpoints using the Azure Machine Learning studio.'
services: machine-learning
ms.service: machine-learning
ms.subservice: studio
ms.topic: how-to
ms.custom: how-to, managed online endpoints, devplatv2, studio, event-tier1-build-2022
author: dem108
ms.author: sehan
ms.reviewer: mopeakande
ms.date: 09/07/2022
---

# Create and use managed online endpoints in the studio

Learn how to use the studio to create and manage your managed online endpoints in Azure Machine Learning. Use managed online endpoints to streamline production-scale deployments. For more information on managed online endpoints, see [What are endpoints](concept-endpoints.md).

In this article, you learn how to:

> [!div class="checklist"]
> * Create a managed online endpoint
> * View managed online endpoints
> * Add a deployment to a managed online endpoint
> * Update managed online endpoints
> * Delete managed online endpoints and deployments

## Prerequisites
- An Azure Machine Learning workspace. For more information, see [Create workspace resources](quickstart-create-resources.md).
- The examples repository - Clone the [Azure Machine Learning Example repository](https://github.com/Azure/azureml-examples). This article uses the assets in `/cli/endpoints/online`.

## Create a managed online endpoint

Use the studio to create a managed online endpoint directly in your browser. When you create a managed online endpoint in the studio, you must define an initial deployment. You can't create an empty managed online endpoint.

1. Go to the [Azure Machine Learning studio](https://ml.azure.com).
1. In the left navigation bar, select the **Endpoints** page.
1. Select **+ Create**.

:::image type="content" source="media/how-to-create-managed-online-endpoint-studio/endpoint-create-managed-online-endpoint.png" lightbox="media/how-to-create-managed-online-endpoint-studio/endpoint-create-managed-online-endpoint.png" alt-text="A screenshot for creating managed online endpoint from the Endpoints tab.":::

:::image type="content" source="media/how-to-create-managed-online-endpoint-studio/online-endpoint-wizard.png" lightbox="media/how-to-create-managed-online-endpoint-studio/online-endpoint-wizard.png" alt-text="A screenshot of a managed online endpoint create wizard.":::

### Register the model

A model registration is a logical entity in the workspace that may contain a single model file, or a directory containing multiple files. The steps in this article assume that you've registered the [model folder](https://github.com/Azure/azureml-examples/tree/main/cli/endpoints/online/model-1/model) that contains the model.

To register the example model using Azure Machine Learning studio, use the following steps:

1. Go to the [Azure Machine Learning studio](https://ml.azure.com).
1. In the left navigation bar, select the **Models** page.
1. Select **Register**, and then **From local files**.
1. Select __Unspecified type__ for the __Model type__, then select __Browse__, and __Browse folder__.

    :::image type="content" source="media/how-to-create-managed-online-endpoint-studio/register-model-folder.png" alt-text="A screenshot of the browse folder option.":::

1. Select the `\azureml-examples\cli\endpoints\online\model-1\model` folder from the local copy of the repo you downloaded earlier. When prompted, select __Upload__. Once the upload completes, select __Next__.
1. Enter a friendly __Name__ for the model. The steps in this article assume it's named `model-1`.
1. Select __Next__, and then __Register__ to complete registration.

For more information on working with registered models, see [Register and work with models](how-to-manage-models.md).

### Follow the setup wizard to configure your managed online endpoint.

You can also create a managed online endpoint from the **Models** page in the studio. This is an easy way to add a model to an existing managed online deployment.

1. Go to the [Azure Machine Learning studio](https://ml.azure.com).
1. In the left navigation bar, select the **Models** page.
1. Select a model by checking the circle next to the model name.
1. Select **Deploy** > **Deploy to real-time endpoint**.

    :::image type="content" source="media/how-to-create-managed-online-endpoint-studio/deploy-from-models-page.png" lightbox="media/how-to-create-managed-online-endpoint-studio/deploy-from-models-page.png" alt-text="A screenshot of creating a managed online endpoint from the Models UI.":::

1. Enter an __Endpoint name__ and select __Managed__ as the compute type.
1. Select __Next__, accepting defaults, until you're prompted for the environment. Here, select the following:

    * __Select scoring file and dependencies__: Browse and select the `\azureml-examples\cli\endpoints\online\model-1\onlinescoring\score.py` file from the repo you downloaded earlier.
    * __Choose an environment__ section: Select the **Scikit-learn 0.24.1** curated environment.

1. Select __Next__, accepting defaults, until you're prompted to create the deployment. Select the __Create__ button.

## View managed online endpoints

You can view your managed online endpoints in the **Endpoints** page. Use the endpoint details page to find critical information including the endpoint URI, status, testing tools, activity monitors, deployment logs, and sample consumption code:

1. In the left navigation bar, select **Endpoints**.
1. (Optional) Create a **Filter** on **Compute type** to show only **Managed** compute types.
1. Select an endpoint name to view the endpoint detail page.

:::image type="content" source="media/how-to-create-managed-online-endpoint-studio/managed-endpoint-details-page.png" lightbox="media/how-to-create-managed-online-endpoint-studio/managed-endpoint-details-page.png" alt-text="Screenshot of managed endpoint details view.":::

### Test

Use the **Test** tab in the endpoints details page to test your managed online deployment. Enter sample input and view the results.

1. Select the **Test** tab in the endpoint's detail page.
1. Use the dropdown to select the deployment you want to test.
1. Enter sample input.
1. Select **Test**.

:::image type="content" source="media/how-to-create-managed-online-endpoint-studio/test-deployment.png" lightbox="media/how-to-create-managed-online-endpoint-studio/test-deployment.png" alt-text="A screenshot of testing a deployment by providing sample data, directly in your browser.":::

### Monitoring

Use the **Monitoring** tab to see high-level activity monitor graphs for your managed online endpoint.

To use the monitoring tab, you must select "**Enable Application Insight diagnostic and data collection**" when you create your endpoint.

:::image type="content" source="media/how-to-create-managed-online-endpoint-studio/monitor-endpoint.png" lightbox="media/how-to-create-managed-online-endpoint-studio/monitor-endpoint.png" alt-text="A screenshot of monitoring endpoint-level metrics in the studio.":::

For more information on viewing other monitors and alerts, see [How to monitor managed online endpoints](how-to-monitor-online-endpoints.md).

### Deployment logs

You can get logs from the containers that are running on the VM where the model is deployed. The amount of information you get depends on the provisioning status of the deployment. If the specified container is up and running, you'll see its console output; otherwise, you'll get a message to try again later.

Use the **Deployment logs** tabs in the endpoint's details page to see log output from container.

1. Select the **Deployment logs** tab in the endpoint's details page.
1. Use the dropdown to select the deployment whose log you want to see.

:::image type="content" source="media/how-to-create-managed-online-endpoint-studio/deployment-logs.png" lightbox="media/how-to-create-managed-online-endpoint-studio/deployment-logs.png" alt-text="A screenshot of observing deployment logs in the studio.":::

The logs are pulled from the inference server. Logs include the console log (from the inference server) which contains print/log statements from your scoring script (`score.py`).

To get logs from the storage initializer container, use the Azure CLI or Python SDK. These logs contain information on whether code and model data were successfully downloaded to the container. See the [get container logs section in troubleshooting online endpoints deployment](how-to-troubleshoot-online-endpoints.md#get-container-logs).

## Add a deployment to a managed online endpoint

You can add a deployment to your existing managed online endpoint.

From the **Endpoint details page**

1. Select **+ Add Deployment** button in the [endpoint details page](#view-managed-online-endpoints).
2. Follow the instructions to complete the deployment.

:::image type="content" source="media/how-to-create-managed-online-endpoint-studio/add-deploy-option-from-endpoint-page.png" lightbox="media/how-to-create-managed-online-endpoint-studio/add-deploy-option-from-endpoint-page.png" alt-text="A screenshot of Add deployment option from Endpoint details page.":::

Alternatively, you can use the **Models** page to add a deployment:

1. In the left navigation bar, select the **Models** page.
1. Select a model by checking the circle next to the model name.
1. Select **Deploy** > **Deploy to real-time endpoint**.
1. Choose to deploy to an existing managed online endpoint.

:::image type="content" source="media/how-to-create-managed-online-endpoint-studio/select-existing-managed-endpoints.png" lightbox="media/how-to-create-managed-online-endpoint-studio/select-existing-managed-endpoints.png" alt-text="A screenshot of Add deployment option from Models page.":::

> [!NOTE]
> You can adjust the traffic balance between deployments in an endpoint when adding a new deployment.
>
> :::image type="content" source="media/how-to-create-managed-online-endpoint-studio/adjust-deployment-traffic.png" lightbox="media/how-to-create-managed-online-endpoint-studio/adjust-deployment-traffic.png" alt-text="A screenshot of how to use sliders to control traffic distribution across multiple deployments.":::

## Update managed online endpoints

You can update deployment traffic percentage and instance count from Azure Machine Learning studio.

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

## Delete managed online endpoints and deployments

Learn how to delete an entire managed online endpoint and it's associated deployments. Or, delete an individual deployment from a managed online endpoint.

### Delete a managed online endpoint

Deleting a managed online endpoint also deletes any deployments associated with it.

1. Go to the [Azure Machine Learning studio](https://ml.azure.com).
1. In the left navigation bar, select the **Endpoints** page.
1. Select an endpoint by checking the circle next to the model name.
1. Select **Delete**.

Alternatively, you can delete a managed online endpoint directly in the [endpoint details page](#view-managed-online-endpoints). 

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
- [How to deploy online endpoints with the Azure CLI](how-to-deploy-online-endpoints.md)
- [Deploy models with REST](how-to-deploy-with-rest.md)
- [How to monitor managed online endpoints](how-to-monitor-online-endpoints.md)
- [Troubleshooting managed online endpoints deployment and scoring](./how-to-troubleshoot-online-endpoints.md)
- [View costs for an Azure Machine Learning managed online endpoint](how-to-view-online-endpoints-costs.md)
- [Manage and increase quotas for resources with Azure Machine Learning](how-to-manage-quotas.md#azure-machine-learning-managed-online-endpoints)
