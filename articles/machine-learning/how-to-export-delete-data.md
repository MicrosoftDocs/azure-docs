---
title: Export or delete workspace data
titleSuffix: Azure Machine Learning
description: Learn how to export or delete your workspace with the Azure Machine Learning studio.
services: machine-learning
ms.service: machine-learning
ms.subservice: mldata
ms.custom: devx-track-python
author: fbsolo-ms1
ms.author: franksolomon
ms.reviewer: franksolomon
ms.date: 08/11/2023
ms.topic: how-to
monikerRange: 'azureml-api-2 || azureml-api-1'
---

# Export or delete your Machine Learning service workspace data

In Azure Machine Learning, you can export or delete your workspace data with either the portal graphical interface or the Python SDK. This article describes both options.

[!INCLUDE [GDPR-related guidance](../../includes/gdpr-dsr-and-stp-note.md)]

[!INCLUDE [GDPR-related guidance](../../includes/gdpr-intro-sentence.md)]

## Control your workspace data

The in-product data that Azure Machine Learning stores is available for export and deletion. You can export and delete data with Azure Machine Learning studio, the CLI, and the SDK. Additionally, you can access telemetry data through the Azure Privacy portal.

In Azure Machine Learning, personal data consists of user information in job history documents.

An Azure workspace relies on a **resource group** to hold the related resources for an Azure solution. When you create a workspace, you have the opportunity to use an existing resource group, or to create a new one. See [this page](../azure-resource-manager/management/manage-resource-groups-portal.md) to learn more about Azure resource groups.

## Delete high-level resources using the portal

When you create a workspace, Azure creates several resources within the resource group:

- The workspace itself
- A storage account
- A container registry
- An Applications Insights instance
- A key vault

To delete these resources, select them from the list, and choose **Delete**:

> [!IMPORTANT]
> If the resource is configured for soft delete, the data won't actually delete unless you optionally select to delete the resource permanently. For more information, see the following articles:
> * [Workspace soft-deletion](concept-soft-delete.md).
> * [Soft delete for blobs](../storage/blobs/soft-delete-blob-overview.md).
> * [Soft delete in Azure Container Registry](../container-registry/container-registry-soft-delete-policy.md).
> * [Azure log analytics workspace](../azure-monitor/logs/delete-workspace.md).
> * [Azure Key Vault soft-delete](../key-vault/general/soft-delete-overview.md).

:::image type="content" source="media/how-to-export-delete-data/delete-resource-group-resources.png" lightbox="media/how-to-export-delete-data/delete-resource-group-resources.png" alt-text="Screenshot of portal, with delete icon highlighted.":::

A confirmation dialog box opens, where you can confirm your choices.

Job history documents might contain personal user information. These documents are stored in the storage account in blob storage, in `/azureml` subfolders. You can download and delete the data from the portal.

:::image type="content" source="media/how-to-export-delete-data/storage-account-folders.png" lightbox="media/how-to-export-delete-data/storage-account-folders.png" alt-text="Screenshot of the Azure Machine Learning directory in the storage account, within the portal.":::

## Export and delete machine learning resources using Azure Machine Learning studio

Azure Machine Learning studio provides a unified view of your machine learning resources - for example, notebooks, data assets, models, and jobs. Azure Machine Learning studio emphasizes preservation of a record of your data and experiments. You can delete computational resources - pipelines and compute resources  - right in the browser. For these resources, navigate to the resource in question, and choose **Delete**.

You can unregister data assets and archive jobs, but these operations don't delete the data. To entirely remove the data, data assets and job data require deletion at the storage level. Storage level deletion happens in the portal, as described earlier. Azure Machine Learning studio can handle individual deletion. Job deletion deletes the data of that job.

Azure Machine Learning studio can handle training artifact downloads from experimental jobs. Choose the relevant **Job**. Choose **Output + logs**, and navigate to the specific artifacts you wish to download. Choose **...** and **Download**, or select **Download all**.

To download a registered model, navigate to the **Model** and choose **Download**.

:::image type="contents" source="media/how-to-export-delete-data/model-download.png" lightbox="media/how-to-export-delete-data/model-download.png" alt-text="Screenshot of studio model page with download option highlighted.":::

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

The following machine learning resources can be deleted using the Python SDK: 

| Type | Function Call | Notes | 
| --- | --- | --- |
| `Workspace` | [`delete`](/python/api/azureml-core/azureml.core.workspace.workspace#delete-delete-dependent-resources-false--no-wait-false-) | Use `delete-dependent-resources` to cascade the delete |
| `Model` | [`delete`](/python/api/azureml-core/azureml.core.model%28class%29#delete--) | | 
| `ComputeTarget` | [`delete`](/python/api/azureml-core/azureml.core.computetarget#delete--) | |
| `WebService` | [`delete`](/python/api/azureml-core/azureml.core.webservice%28class%29) | |

:::moniker-end

## Next steps

Learn more about [Managing a workspace](how-to-manage-workspace.md).