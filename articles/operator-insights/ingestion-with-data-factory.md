---
title: Use Azure Data Factory for Ingestion
description: Set up Azure Data Factory to ingest data into an Azure Operator Insights Data Product.
author: rcdun
ms.author: rdunstan
ms.reviewer: TBC
ms.service: operator-insights
ms.topic: how-to
ms.date: 03/15/2024

#CustomerIntent: As a admin in an operator network, I want to upload data to Azure Operator Insights so that my organization can use Azure Operator Insights.
---

# Use Azure Data Factory to ingest data into an Azure Operator Insights Data Product

This article covers how to set up [Azure Data Factory](/azure/data-factory/) to write data into an Azure Operator Insights Data Product.
For more information on Azure Data Factory, see [What is Azure Data Factory](/azure/data-factory/introduction).

> [!WARNING]
> Data Products do not support private links. It is not possible to set up a private link between a Data Product and Azure Data Factory.

## Prerequisites

- A deployed Data Product: see [Create an Azure Operator Insights Data Product](/azure/operator-insights/data-product-create).
- Permission to add role assignments to the Data Product Key Vault.
  - To find the Key Vault, search for the resource group with name starting with `<DATA PRODUCT NAME>-HostedResources-`; the key vault lives in this resource group.
- A deployed [Azure Data Factory](/azure/data-factory/) instance.
- The [Data Factory Contributor](/azure/data-factory/concepts-roles-permissions#scope-of-the-data-factory-contributor-role) role on the Data Factory instance.

## Create a Key Vault linked service

To connect Azure Data Factory to another Azure service, you must create a [linked service](/azure/data-factory/concepts-linked-services?tabs=data-factory). First, create a linked service to connect Azure Data Factory to the Data Product Key Vault.

1. In the [Azure portal](https://ms.portal.azure.com/#home), find the Azure Data Factory resource.
2. From the **Overview** pane, launch the Azure Data Factory studio.
3. Go to the **Manage** view -> **Connections** -> **Linked Services**.
4. Create a new linked service using the **New** button.
    - Select the Azure Key Vault type.
    - Set the target to the Data Product Key Vault (the key vault is in the resource group with name starting with `<DATA PRODUCT NAME>-HostedResources-` and is named `aoi-<uid>-kv`).
    - Set the authentication method to **System Assigned Managed Identity**.
5. Grant Azure Data Factory permissions on the Key Vault resource.
    - Go to the Data Product Key Vault in the Azure portal.
    - In the **Access Control (IAM)** pane, add a new role assignment.
    - Give the Data Factory managed identity (this has the same name as the Data Factory resource) the 'Key Vault Secrets User' role.

## Create a Blob Storage linked service

Data Products expose a Blob Storage endpoint for ingesting data. Use the newly created Key Vault linked service to connect Azure Data Factory to the Data Product ingestion endpoint.

1. In the [Azure portal](https://ms.portal.azure.com/#home), find the Azure Data Factory resource.
2. From the **Overview** pane, launch the Azure Data Factory studio.
3. Go to the **Manage** view -> **Connections** -> **Linked Services**.
4. Create a new linked service using the **New** button.
    - Select the Azure Blob Storage type.
    - Set the authentication type to 'SAS URI'.
    - Choose 'Azure Key Vault' as the source.
    - Select the Key Vault linked service created in [the previous step](#create-a-key-vault-linked-service).
    - Set the secret name to `input-storage-sas`.
    - Leave the secret version as the default value ('Latest version').

Now the Data Factory is connected to the Data Product ingestion endpoint.

## Create Blob Storage datasets

To use the Data Product as the sink for a [Pipeline](/azure/data-factory/concepts-pipelines-activities?tabs=data-factory), you must create a sink [Dataset](/azure/data-factory/concepts-datasets-linked-services?tabs=data-factory).

1. In the [Azure portal](https://ms.portal.azure.com/#home), find the Azure Data Factory resource.
2. From the **Overview** pane, launch the Azure Data Factory studio.
3. Go to the **Author** view -> Add resource -> Dataset.
4. Create a new Azure Blob Storage dataset.
    - Select your output type.
    - Set the linked service to the Data Product ingestion linked service created in [the previous step](#create-a-blob-storage-linked-service).
    - Set the container name to the name of the data type the dataset is associated with.
    - Ensure the folder path includes at least one directory; files copied into the root of the container will not be correctly ingested.
    - Set the other fields as appropriate for your data.
5. Follow the Azure Data Factory documentation (for example [Creating a pipeline with the UI](/azure/data-factory/concepts-pipelines-activities?tabs=data-factory#creating-a-pipeline-with-ui)) to create a pipeline with this new dataset as the sink.

Repeat this step for all required datasets.

> [!IMPORTANT]
> The Data Product may use the folder prefix or the file name prefix (this can be set as part of the pipeline, for example in the [Copy Activity](/azure/data-factory/connector-azure-blob-storage?tabs=data-factory#blob-storage-as-a-sink-type)) to determine how to process an ingested file. See [reference file] for information on how these should be set for each Data Product.

## Create Data Pipelines

Your Azure Data Factory is now configured to connect to your Data Product. To ingest data using this configuration, you must follow the Data Factory documentation.

1. [Set up a connection in Azure Data Factory](/azure/data-factory/connector-overview) to the service containing the source data.
2. [Set up pipelines in Azure Data Factory](/azure/data-factory/concepts-pipelines-activities?tabs=data-factory#creating-a-pipeline-with-ui) to copy data from the source into your Data Product, using the datasets created in [the last step](#create-blob-storage-datasets).

## Related content

Learn how to:

- [View data in dashboards](dashboards-use.md).
- [Query data](data-query.md).