---
title: Connecting to Azure Cosmos DB as a Data Source in Azure Machine Learning Workbench | Microsoft Docs
description: This document provides an example on how to connect to Azure Cosmos DB through Azure Machine Learning Workbench
services: machine-learning
author: cforbe
ms.author: cforbe
manager: mwinkle
ms.reviewer: jmartens, jasonwhowell, mldocs
ms.service: machine-learning
ms.component: core
ms.workload: data-services
ms.custom: 
ms.devlang: 
ms.topic: article 
ms.date: 09/11/2017

ROBOTS: NOINDEX
---

# Connecting to Azure Cosmos DB as a data source

[!INCLUDE [workbench-deprecated](../../../includes/aml-deprecating-preview-2017.md)] 


This article contains a python sample allows you to connect to Cosmos DB in the Azure Machine Learning Workbench.

## Load Azure Cosmos DB data into data preparation

Create a new script-based data flow, and then use the following script to load the data from Azure Cosmos DB. 

```python
import pydocumentdb
import pydocumentdb.document_client as document_client

import pandas as pd

config = { 
    'ENDPOINT': '<Endpoint>',
    'MASTERKEY': '<Key>',
    'DOCUMENTDB_DATABASE': '<DBName>',
    'DOCUMENTDB_COLLECTION': '<collectionname>'
};

# Initialize the Python DocumentDB client.
client = document_client.DocumentClient(config['ENDPOINT'], {'masterKey': config['MASTERKEY']})

# Read databases and take first since id should not be duplicated.
db = next((data for data in client.ReadDatabases() if data['id'] == config['DOCUMENTDB_DATABASE']))

# Read collections and take first since id should not be duplicated.
coll = next((coll for coll in client.ReadCollections(db['_self']) if coll['id'] == config['DOCUMENTDB_COLLECTION']))

docs = client.ReadDocuments(coll['_self'])

df = pd.DataFrame(list(docs))
```

## Other data source connections
For other samples, read [Example additional source data connections](data-prep-appendix8-sample-source-connections-python.md)
