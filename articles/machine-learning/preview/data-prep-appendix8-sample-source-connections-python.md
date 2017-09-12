---
title: Sample of Source Connections (Python) | Microsoft Docs
description: Gives samples of python source connections expressions
author: cforbe
ms.author: cforbe@microsoft.com
ms.date: 9/7/2017
---

# Sample of Source Connections (Python) #

## Loading Data from data.world

#### Prerequisites

###### Register yourself at data.world
You will need the API token that you obtain from data.world website.

###### Install data.world library

Open the Azure Machine Learning Workbench command-line interface from _File->Open command-line interface_

```
pip install git+git://github.com/datadotworld/data.world-py.git
```

Then run _dw configure_ on the command line, which will prompt you for your token. When you enter your token, a .dw/ directory will created in your home directory and your token will be stored there.

```
API token (obtained at: https://data.world/settings/advanced): <enter API token here>
```
Now you should be able to import data.world libraries in Pendleton.

#### Load Data into Data Preparation

Create a new script based data flow and use the following script to load the data from data.world

```python
#paths = df['Path'].tolist()

import datadotworld as dw

#load the dataset
lds = dw.load_dataset('data-society/the-simpsons-by-the-data')

#Load specific data frame from the dataset
df = lds.dataframes['simpsons_episodes']

```

#### Load CosmosDB Data to Pendleton

Create a new script based data flow and use the following script to load the data from CosmosDB

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
