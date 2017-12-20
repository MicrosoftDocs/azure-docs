---
title: Example additional source data connections possible with Azure Machine Learning data preparation  | Microsoft Docs
description: This document provides a set of examples of source data connections that are possible with Azure Machine Learning data preparation
services: machine-learning
author: euangMS
ms.author: euang
manager: lanceo
ms.reviewer: garyericson, jasonwhowell, mldocs
ms.service: machine-learning
ms.workload: data-services
ms.custom: 
ms.devlang: 
ms.topic: article 
ms.date: 09/11/2017
---
# Sample of custom source connections (Python) 
Before you read this appendix, read [Python extensibility overview](data-prep-python-extensibility-overview.md).

## Load data from data.world

### Prerequisites

#### Register yourself at data.world
You need an API token from the data.world website.

#### Install data.world library

Open the Azure Machine Learning Workbench command-line interface by selecting **File** > **Open command-line interface**.

```console
pip install git+git://github.com/datadotworld/data.world-py.git
```

Next, run `dw configure` on the command line, which prompts you for your token. When you enter your token, a .dw/ directory is created in your home directory and your token is stored there.

```
API token (obtained at: https://data.world/settings/advanced): <enter API token here>
```
Now you should be able to import data.world libraries.

#### Load data into data preparation

Create a new script-based data flow. Then use the following script to load the data from data.world.

```python
#paths = df['Path'].tolist()

import datadotworld as dw

#Load the dataset.
lds = dw.load_dataset('data-society/the-simpsons-by-the-data')

#Load specific data frame from the dataset.
df = lds.dataframes['simpsons_episodes']

```

## Load Azure Cosmos DB data into data preparation

Create a new script-based data flow, and then use the following script to load the data from Azure Cosmos DB. (The libraries need to be installed first. For more information, see the previous reference document that we link to.)

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
