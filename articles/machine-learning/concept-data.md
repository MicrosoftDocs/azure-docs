---
title: Data access
titleSuffix: Azure Machine Learning
description: Learn how to connect to your data storage on Azure with Azure Machine Learning.
services: machine-learning
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.topic: conceptual
ms.reviewer: nibaccam
author: blackmist
ms.author: larryfr
ms.date: 05/11/2022
ms.custom: devx-track-python, data4ml, event-tier1-build-2022
#Customer intent: As an experienced Python developer, I need to securely access my data in my Azure storage solutions and use it to accomplish my machine learning tasks.
---

# Data in Azure Machine Learning

> [!div class="op_single_selector" title1="Select the version of Azure Machine Learning developer platform you are using:"]
> * [v1](./v1/concept-data.md)
> * [v2 (current version)](concept-data.md)

Azure Machine Learning makes it easy to connect to your data in the cloud. It provides an abstraction layer over the underlying storage service, so you can securely access and work with your data without having to write code specific to your storage type. Azure Machine Learning also provides the following data capabilities:

*    Interoperability with Pandas and Spark DataFrames
*    Versioning and tracking of data lineage
*    Data labeling (V1 only for now)

You can bring data to Azure Machine Learning 

* Directly from your local machine and URLs

* That's already in a cloud-based storage service in Azure and access it using your [Azure storage account](../storage/common/storage-account-create.md?tabs=azure-portal) related credentials and an Azure Machine Learning datastore.

<a name="datastores"></a>
## Connect to storage with datastores

Azure Machine Learning datastores securely keep the connection information to your data storage on Azure, so you don't have to code it in your scripts. 

You can access your data and create datastores with, 
* [Credential-based data authentication](how-to-access-data.md), like a service principal or shared access signature (SAS) token. These credentials can be accessed by users who have *Reader* access to the workspace. 
* Identity-based data authentication to connect to storage services with your Azure Active Directory ID. 

The following table summarizes which cloud-based storage services in Azure can be registered as datastores and what authentication type can be used to access them. 

Supported storage service | Credential-based authentication | Identity-based authentication
|---|:----:|:---:|
Azure Blob Container| ✓ | ✓|
Azure File Share| ✓ | |
Azure Data Lake Gen1 | ✓ | ✓|
Azure Data Lake Gen2| ✓ | ✓|


## Work with data

You can read in data from a datastore or directly from storage uri's. 

In Azure Machine Learning there are three types for data

Data type | Description | Example
---|------|---
`uri_file` | Refers to a specific file | `https://<account_name>.blob.core.windows.net/<container_name>/path/file.csv`.
`uri_folder`| Refers to a specific folder |`https://<account_name>.blob.core.windows.net/<container_name>/path`
`mltable` |Defines tabular data for use in automated ML and parallel jobs| Schema and subsetting transforms

In the following example, the expectation is to provide a `uri_folder` because to read the file in, the training script creates a path that joins the folder with the file name. If you want to pass in just an individual file rather than the entire folder you can use the `uri_file` type.

```python
 file_name = os.path.join(args.input_folder, "MY_CSV_FILE.csv") 
df = pd.read_csv(file_name)
```

## Next steps 

* [Work with data using SDK v2](how-to-use-data.md)
