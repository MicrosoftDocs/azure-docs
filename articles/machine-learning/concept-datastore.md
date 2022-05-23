---
title: Azure Machine Learning Datastores
titleSuffix: Azure Machine Learning
description: Learn how to securely connect to your data storage on Azure with Azure Machine Learning datastores.
services: machine-learning
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.topic: conceptual
ms.reviewer: nibaccam
author: blackmist
ms.author: larryfr
ms.date: 10/21/2021
ms.custom: devx-track-python, data4ml

# Customer intent: As an experienced Python developer, I need to securely access my data in my Azure storage solutions and use it to accomplish my machine learning tasks.
---

# Azure Machine Learning Datastores

Supported cloud-based storage services in Azure Machine Learning include:

+ Azure Blob Container
+ Azure File Share
+ Azure Data Lake
+ Azure Data Lake Gen2

Azure Machine Learning allows you to connect to data directly by using a storage URI, for example: 

- ```https://storageAccount.blob.core.windows.net/container/path/file.csv``` (Azure Blob Container)
- ```abfss://container@storageAccount.dfs.core.windows.net/base/path/folder1``` (Azure Data Lake Gen2). 

Storage URIs use *identity-based* access that will prompt you for your Azure Active Directory token for data access authentication. This approach allows for data access management at the storage level and keeps credentials confidential.

> [!NOTE]
> When using Notebooks in Azure Machine Learning Studio, your Azure Active Directory token is automatically passed through to storage for data access authentication.

Whilst storage URIs provide a convenient mechanism to access data, there may be cases where using an Azure Machine Learning *Datastore* is a better option:

1. **You need *credential-based* data access (for example: Service Principals, SAS Tokens, Account Name/Key).** Datastores are helpful because they keep the connection information to your data storage securely in an Azure Keyvault, so you don't have to code it in your scripts.
1. **You want team members to easily discover relevant datastores.** Datastores are registered to an Azure Machine Learning workspace making them easier for your team members to find/discover them.

 [Register and create a datastore](how-to-datastore.md) to easily connect to your storage account, and access the data in your underlying storage service. 

## Credential-based vs Identity-based access

Azure Machine Learning Datastores support both credential-based and identity-based access. In *credential-based* access, your authentication credentials are usually kept in a datastore, which is used to ensure you have permission to access the storage service. When these credentials are registered via datastores, any user with the workspace Reader role can retrieve them. That scale of access can be a security concern for some organizations. When you use *identity-based* data access, Azure Machine Learning prompts you for your Azure Active Directory token for data access authentication instead of keeping your credentials in the datastore. That approach allows for data access management at the storage level and keeps credentials confidential.


## Next steps 

+ Create a datastore [using these steps.](how-to-datasores.md)
