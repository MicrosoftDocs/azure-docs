---
title: Example additional source data connections possible with Azure Machine Learning Data Preparation  | Microsoft Docs
description: This document provides a a set of examples of source data connections possible with Azure ML data prep
services: machine-learning
author: euangMS
ms.author: euang
manager: lanceo
ms.reviewer: 
ms.service: machine-learning
ms.workload: data-services
ms.custom: 
ms.devlang: 
ms.topic: article 
ms.date: 09/11/2017
---
# Sample of custom source connections (Python) 
Before reading this appendix read [Python Extensibility Overview](data-prep-python-extensibility-overview.md)

## Loading Data from data.world

### Prerequisites

#### Register yourself at data.world
An API token is needed that you obtain from data.world website.

#### Install data.world library

Open the Azure Machine Learning Workbench command-line interface from _File->Open command-line interface_

```console
pip install git+git://github.com/datadotworld/data.world-py.git
```

Then run `dw configure` on the command line, which prompts you for your token. When you enter your token, a .dw/ directory is created in your home directory and your token is stored there.

```
API token (obtained at: https://data.world/settings/advanced): <enter API token here>
```
Now you should be able to import data.world libraries.

#### Load data into Data Preparation

Create a new script-based data flow and use the following script to load the data from data.world

```python
#paths = df['Path'].tolist()

import datadotworld as dw

#load the dataset
lds = dw.load_dataset('data-society/the-simpsons-by-the-data')

#Load specific data frame from the dataset
df = lds.dataframes['simpsons_episodes']

```

## Load Cosmos DB Data into Data Preparation

Create a new script-based data flow and use the following script to load the data from CosmosDB (the libraries will first need to be installed see the reference document linked above)

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

# Initialize the Python DocumentDB client
client = document_client.DocumentClient(config['ENDPOINT'], {'masterKey': config['MASTERKEY']})

# Read databases and take first since id should not be duplicated.
db = next((data for data in client.ReadDatabases() if data['id'] == config['DOCUMENTDB_DATABASE']))

# Read collections and take first since id should not be duplicated.
coll = next((coll for coll in client.ReadCollections(db['_self']) if coll['id'] == config['DOCUMENTDB_COLLECTION']))

docs = client.ReadDocuments(coll['_self'])

df = pd.DataFrame(list(docs))
```
