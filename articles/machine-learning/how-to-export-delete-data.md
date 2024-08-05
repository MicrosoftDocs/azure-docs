---
title: Export or delete workspace data
titleSuffix: Azure Machine Learning
description: Learn how to export or delete your workspace with the Azure Machine Learning studio.
services: machine-learning
ms.service: azure-machine-learning
ms.subservice: mldata
ms.custom: devx-track-python
author: fbsolo-ms1
ms.author: franksolomon
ms.reviewer: franksolomon
ms.date: 08/01/2024
ms.topic: how-to
monikerRange: 'azureml-api-2 || azureml-api-1'
---

# Export or delete your Machine Learning service workspace data

In Azure Machine Learning, you can export or delete your workspace data with either the portal graphical interface or the Python SDK. This article describes both options.

[!INCLUDE [GDPR-related guidance](~/reusable-content/ce-skilling/azure/includes/gdpr-dsr-and-stp-note.md)]

[!INCLUDE [GDPR-related guidance](~/reusable-content/ce-skilling/azure/includes/gdpr-intro-sentence.md)]

## Control your workspace data

Azure Machine Learning stores in-product data that is available for export and deletion. You can export and delete data with Azure Machine Learning studio, the CLI, or the SDK. Additionally, you can access telemetry data through the Azure Privacy portal.

In Azure Machine Learning, personal data consists of user information in job history documents.

An Azure workspace relies on a **resource group** to hold the related resources for an Azure solution. When you create a workspace, you can either use an existing resource group, or you can create a new one. Visit [this resource](../azure-resource-manager/management/manage-resource-groups-portal.md) for more information about Azure resource groups.

## Delete high-level resources using the portal

When you create a workspace, Azure creates several resources within the resource group:

- The workspace itself
- A storage account
- A container registry
- An Applications Insights instance
- A key vault

To delete these resources, select them from the list, and choose **Delete**:

> [!IMPORTANT]
> If the resource is configured for soft delete, the data won't actually delete unless you optionally select to delete the resource permanently. For more information, visit these resources:
> * [Azure log analytics workspace](../azure-monitor/logs/delete-workspace.md)
> * [Azure Key Vault soft-delete](../key-vault/general/soft-delete-overview.md)
> * [Soft delete for blobs](../storage/blobs/soft-delete-blob-overview.md)
> * [Soft delete in Azure Container Registry](../container-registry/container-registry-soft-delete-policy.md)
> * [Workspace soft-deletion](concept-soft-delete.md)

:::image type="content" source="media/how-to-export-delete-data/delete-resource-group-resources.png" lightbox="media/how-to-export-delete-data/delete-resource-group-resources.png" alt-text="Screenshot of portal, with delete icon highlighted.":::

A confirmation dialog box opens, where you can confirm your choices.

Job history documents might contain personal user information. These documents are stored in the storage account in blob storage, in `/azureml` subfolders. You can download and delete the data from the portal. First, select the **Storage accounts** Azure services in the Azure portal, as shown in this screenshot:

:::image type="content" source="media/how-to-export-delete-data/storage-account-main-screen.png" lightbox="media/how-to-export-delete-data/storage-account-main-screen.png" alt-text="Screenshot showing selection of Storage accounts in the Azure portal.":::

At the **Storage accounts** page, select the relevant storage account, as shown in this screenshot:

:::image type="content" source="media/how-to-export-delete-data/select-storage-account.png" lightbox="media/how-to-export-delete-data/select-storage-account.png" alt-text="Screenshot showing selection of a specific storage account.":::

Select **Containers** as shown in this screenshot:

:::image type="content" source="media/how-to-export-delete-data/select-containers.png" lightbox="media/how-to-export-delete-data/select-containers.png" alt-text="Screenshot showing selection of Containers at the storage account page.":::

Select a specific container, as shown in this screenshot:

:::image type="content" source="media/how-to-export-delete-data/select-a-container-resource.png" lightbox="media/how-to-export-delete-data/select-a-container-resource.png" alt-text="Screenshot showing selection of a specific container.":::

In that container, select and delete the resource or resources you wish to delete, as shown in this screenshot:

:::image type="content" source="media/how-to-export-delete-data/delete-a-resource.png" lightbox="media/how-to-export-delete-data/delete-a-resource.png" alt-text="Screenshot showing deletion of a specific resource.":::

## Export and delete machine learning resources using Azure Machine Learning studio

Azure Machine Learning studio provides a unified view of your machine learning resources - for example, data assets, models, notebooks, and jobs. Azure Machine Learning studio emphasizes preservation of a record of your data and experiments. You can delete computational resources - pipelines and compute resources - right in the browser. For these resources, navigate to the resource in question, and choose **Delete**.

You can unregister data assets and archive jobs, but these operations don't delete the data. To completely remove the data, data assets and job data require deletion at the storage level. Storage level deletion happens in the portal, as described earlier. Azure Machine Learning studio can handle individual deletion. Job deletion deletes the data of that job.

### Artifact and log downloads of jobs

Azure Machine Learning studio can handle training artifact and log downloads from experimental jobs. At the Azure Machine Learning studio main page, select **Jobs** as shown in this screenshot:

:::image type="content" source="media/how-to-export-delete-data/azure-machine-learning-studio-select-jobs.png" lightbox="media/how-to-export-delete-data/azure-machine-learning-studio-select-jobs.png" alt-text="Screenshot showing selection of Jobs in Azure Machine Learning studio.":::

To show the available jobs, select the **All Jobs** tab, as shown in this screenshot:

:::image type="content" source="media/how-to-export-delete-data/select-the-all-jobs-tab.png" lightbox="media/how-to-export-delete-data/select-the-all-jobs-tab.png" alt-text="Screenshot showing selection of the All Jobs tab.":::

Select a specific job, as shown in this screenshot:

:::image type="content" source="media/how-to-export-delete-data/select-a-specific-job.png" lightbox="media/how-to-export-delete-data/select-a-specific-job.png" alt-text="Screenshot showing selection of a specific job.":::

Select **Download all**, as shown in this screenshot:

:::image type="content" source="media/how-to-export-delete-data/select-download-all.png" lightbox="media/how-to-export-delete-data/select-download-all.png" alt-text="Screenshot showing how to start the job download process.":::

### Download a registered model

To download a registered model, select **Models** to open the **Model List** in Azure Machine Learning studio, and then select a specific model, as shown in this screenshot:

:::image type="content" source="media/how-to-export-delete-data/select-a-specific-model.png" lightbox="media/how-to-export-delete-data/select-a-specific-model.png" alt-text="Screenshot showing selection of a specific model.":::

Select **Download all** to start the model download process, as shown in this screenshot:

:::image type="contents" source="media/how-to-export-delete-data/model-download.png" lightbox="media/how-to-export-delete-data/model-download.png" alt-text="Screenshot showing how to start the model download process.":::

:::moniker range="azureml-api-1"

## Export and delete resources using the Python SDK

You can download the outputs of a particular job using:

```python
# Retrieved from Azure Machine Learning web UI
run_id = 'aaaaaaaa-bbbb-cccc-dddd-0123456789AB'
experiment = ws.experiments['my-experiment']
run = next(run for run in ex.get_runs() if run.id == run_id)
metrics_output_port = run.get_pipeline_output('metrics_output')
model_output_port = run.get_pipeline_output('model_output')

metrics_output_port.download('.', show_progress=True)
model_output_port.download('.', show_progress=True)
```

You can delete these machine learning resources with the Python SDK:

| Type | Function Call | Notes |
| --- | --- | --- |
| `Workspace` | [`delete`](/python/api/azureml-core/azureml.core.workspace(class)#azureml-core-workspace-delete) | Use `delete-dependent-resources` to cascade the delete |
| `Model` | [`delete`](/python/api/azureml-core/azureml.core.workspace(class)#azureml-core-model-delete) | |
| `ComputeTarget` | [`delete`](/python/api/azureml-core/azureml.core.computetarget#azureml-core-computetarget-delete) | |
| `WebService` | [`delete`](/python/api/azureml-core/azureml.core.workspace(class)#azureml-core-webservice-delete) | |

:::moniker-end

## Next steps

[Learn more about managing workspaces](how-to-manage-workspace.md)