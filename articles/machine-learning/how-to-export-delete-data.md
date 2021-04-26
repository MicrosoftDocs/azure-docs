---
title: Export or delete workspace data
titleSuffix: Azure Machine Learning
description: Learn how to export or delete your workspace with the Azure Machine Learning studio, CLI, SDK, and authenticated REST APIs.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
author: lobrien
ms.author: laobri
ms.date: 04/24/2020
ms.topic: how-to

---
# Export or delete your Machine Learning service workspace data

In Azure Machine Learning, you can export or delete your workspace data using either the portal's graphical interface or the Python SDK. This article describes both options.

[!INCLUDE [GDPR-related guidance](../../includes/gdpr-dsr-and-stp-note.md)]

[!INCLUDE [GDPR-related guidance](../../includes/gdpr-intro-sentence.md)]

## Control your workspace data

In-product data stored by Azure Machine Learning is available for export and deletion. You can export and delete using Azure Machine Learning studio, CLI, and SDK. Telemetry data can be accessed through the Azure Privacy portal. 

In Azure Machine Learning, personal data consists of user information in run history documents. 

## Delete high-level resources using the portal

When you create a workspace, Azure creates a number of resources within the resource group:

- The workspace itself
- A storage account
- A container registry
- An Applications Insights instance
- A key vault

These resources can be deleted by selecting them from the list and choosing **Delete** 

:::image type="content" source="media/how-to-export-delete-data/delete-resource-group-resources.png" alt-text="Screenshot of portal, with delete icon highlighted":::

Run history documents, which may contain personal user information, are stored in the storage account in blob storage, in subfolders of `/azureml`. You can download and delete the data from the portal.

:::image type="content" source="media/how-to-export-delete-data/storage-account-folders.png" alt-text="Screenshot of azureml directory in storage account, within the portal":::

## Export and delete machine learning resources using Azure Machine Learning studio

Azure Machine Learning studio provides a unified view of your machine learning resources, such as notebooks, datasets, models, and experiments. Azure Machine Learning studio emphasizes preserving a record of your data and experiments. Computational resources such as pipelines and compute resources can be deleted using the browser. For these resources, navigate to the resource in question and choose **Delete**. 

Datasets can be unregistered and Experiments can be archived, but these operations don't delete the data. To entirely remove the data, datasets and run data must be deleted at the storage level. Deleting at the storage level is done using the portal, as described previously.

You can download training artifacts from experimental runs using the Studio. Choose the **Experiment** and **Run** in which you are interested. Choose **Output + logs** and navigate to the specific artifacts you wish to download. Choose **...** and **Download**.

You can download a registered model by navigating to the desired **Model** and choosing **Download**. 

:::image type="contents" source="media/how-to-export-delete-data/model-download.png" alt-text="Screenshot of studio model page with download option highlighted":::

## Export and delete resources using the Python SDK

You can download the outputs of a particular run using: 

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