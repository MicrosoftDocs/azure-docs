---
title: Export or delete workspace data
titleSuffix: Azure Machine Learning
description: Learn how to export or delete your workspace with the Azure Machine Learning studio.
services: machine-learning
ms.service: machine-learning
ms.subservice: mldata
author: lgayhardt
ms.author: lagayhar
ms.date: 10/21/2021
ms.topic: how-to

---


# Export or delete your Machine Learning service workspace data

In Azure Machine Learning, you can export or delete your workspace data using either the portal's graphical interface or the Python SDK. This article describes both options.

[!INCLUDE [GDPR-related guidance](../../../includes/gdpr-dsr-and-stp-note.md)]

[!INCLUDE [GDPR-related guidance](../../../includes/gdpr-intro-sentence.md)]

## Control your workspace data

In-product data stored by Azure Machine Learning is available for export and deletion. You can export and delete using Azure Machine Learning studio, CLI, and SDK. Telemetry data can be accessed through the Azure Privacy portal. 

In Azure Machine Learning, personal data consists of user information in job history documents. 

## Delete high-level resources using the portal

When you create a workspace, Azure creates several resources within the resource group:

- The workspace itself
- A storage account
- A container registry
- An Applications Insights instance
- A key vault

These resources can be deleted by selecting them from the list and choosing **Delete** 

:::image type="content" source="media/how-to-export-delete-data/delete-resource-group-resources.png" alt-text="Screenshot of portal, with delete icon highlighted":::

Job history documents, which may contain personal user information, are stored in the storage account in blob storage, in subfolders of `/azureml`. You can download and delete the data from the portal.

:::image type="content" source="media/how-to-export-delete-data/storage-account-folders.png" alt-text="Screenshot of azureml directory in storage account, within the portal":::

## Export and delete machine learning resources using Azure Machine Learning studio

Azure Machine Learning studio provides a unified view of your machine learning resources, such as notebooks, data assets, models, and jobs. Azure Machine Learning studio emphasizes preserving a record of your data and experiments. Computational resources such as pipelines and compute resources can be deleted using the browser. For these resources, navigate to the resource in question and choose **Delete**. 

Data assets can be unregistered and jobs can be archived, but these operations don't delete the data. To entirely remove the data, data assets and job data must be deleted at the storage level. Deleting at the storage level is done using the portal, as described previously. An individual Job can be deleted directly in studio. Deleting a Job deletes the Job's data. 

You can download training artifacts from experimental jobs using the Studio. Choose the **Job** in which you're interested. Choose **Output + logs** and navigate to the specific artifacts you wish to download. Choose **...** and **Download** or select **Download all**.

You can download a registered model by navigating to the **Model** and choosing **Download**. 

:::image type="contents" source="media/how-to-export-delete-data/model-download.png" alt-text="Screenshot of studio model page with download option highlighted":::
