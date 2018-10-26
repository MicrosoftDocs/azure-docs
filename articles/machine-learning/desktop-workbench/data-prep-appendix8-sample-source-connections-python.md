---
title: Example additional source data connections possible with Azure Machine Learning data preparation  | Microsoft Docs
description: This document provides a set of examples of source data connections that are possible with Azure Machine Learning data preparation
services: machine-learning
author: euangMS
ms.author: euang
manager: lanceo
ms.reviewer: jmartens, jasonwhowell, mldocs
ms.service: machine-learning
ms.component: core
ms.workload: data-services
ms.custom: 
ms.devlang: 
ms.topic: article 
ms.date: 02/01/2018

ROBOTS: NOINDEX
---
# Sample of custom source connections (Python) 

[!INCLUDE [workbench-deprecated](../../../includes/aml-deprecating-preview-2017.md)] 


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

Create a Transform Data Flow (Script) transform. Then use the following script to load the data from data.world.

```python
#paths = df['Path'].tolist()

import datadotworld as dw

#Load the dataset.
lds = dw.load_dataset('data-society/the-simpsons-by-the-data')

#Load specific data frame from the dataset.
df = lds.dataframes['simpsons_episodes']

```
## Azure Cosmos DB as a data source connection
For an example of Azure Cosmos DB as a data connection, read [Load Azure Cosmos DB as a source data connection](data-prep-load-azure-cosmos-db.md)
