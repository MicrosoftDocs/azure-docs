---
title: ClinVar Annotations
description: Learn how to use the ClinVar Annotations dataset in Azure Open Datasets.
ms.service: open-datasets
ms.topic: sample
ms.date: 04/16/2021
---

# ClinVar Annotations

[ClinVar](https://www.ncbi.nlm.nih.gov/clinvar/) is a freely accessible, public archive of reports of the relationships among human variations and phenotypes, with supporting evidence. It facilitates access to and communication about the relationships asserted between human variation and observed health status, and the history of that interpretation. It provides access to a broader set of clinical interpretations that can be incorporated into genomics workflows and applications.

For more information on the data, see the [Data Dictionary](https://www.ncbi.nlm.nih.gov/projects/clinvar/ClinVarDataDictionary.pdf) and [FAQ](https://www.ncbi.nlm.nih.gov/clinvar/docs/faq/).

[!INCLUDE [Open Dataset usage notice](../../includes/open-datasets-usage-note.md)]

## Data source

This dataset is a mirror of ftp://ftp.ncbi.nlm.nih.gov/pub/clinvar/xml/

## Data volumes and update frequency

This dataset contains approximately 56 GB of data and is updated daily.

## Storage location

This dataset is stored in the West US 2 and West Central US Azure regions. Allocating compute resources in West US 2 or West Central US is recommended for affinity.

## Data Access

West US 2: 'https://datasetclinvar.blob.core.windows.net/dataset'

West Central US: 'https://datasetclinvar-secondary.blob.core.windows.net/dataset'

[SAS Token](../storage/common/storage-sas-overview.md): sv=2019-02-02&se=2050-01-01T08%3A00%3A00Z&si=prod&sr=c&sig=qFPPwPba1RmBvaffkzkLuzabYU5dZstSTgMwxuLNME8%3D

## Use Terms
Data is available without restrictions. More information and citation details, see [Accessing and using data in ClinVar](https://www.ncbi.nlm.nih.gov/clinvar/docs/maintenance_use/).

## Contact

For any questions or feedback about this dataset, contact clinvar@ncbi.nlm.nih.gov.

## Data access

### Azure Notebooks

# [azure-storage](#tab/azure-storage)

<!-- nbstart https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureNotebooks&package=azure-storage&registryId=genomics-clinvar -->

> [!TIP]
> **[Download the notebook instead](https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureNotebooks&package=azure-storage&registryId=genomics-clinvar)**.

## Getting the ClinVar data from Azure Open Dataset

Several public genomics data has been uploaded as an Azure Open Dataset [here](https://azure.microsoft.com/services/open-datasets/catalog/). We create a blob service linked to this open dataset. You can find examples of data calling procedure from Azure Open Dataset for `ClinVar` dataset in below:

Users can call and download the following path with this notebook: 'https://datasetclinvar.blob.core.windows.net/dataset/ClinVarFullRelease_00-latest.xml.gz.md5'

> [!NOTE]
> Users needs to log-in their Azure Account via Azure CLI for viewing the data with Azure ML SDK. On the other hand, they do not need do any actions for downloading the data.

For more information on installing the Azure CLI, see [Install the Azure CLI](/cli/azure/install-azure-cli)

### Calling the data from  'ClinVar Data Set'

```python
import azureml.core
print("Azure ML SDK Version: ", azureml.core.VERSION)
```

```python
from azureml.core import  Dataset
reference_dataset = Dataset.File.from_files('https://datasetclinvar.blob.core.windows.net/dataset')
mount = reference_dataset.mount()
```

```python
import os

REF_DIR = '/dataset'
path = mount.mount_point + REF_DIR

with mount:
    print(os.listdir(path))
```

```python
import pandas as pd

# create mount context
mount.start()

# specify path to README file
REF_DIR = '/dataset'
metadata_filename = '{}/{}/{}'.format(mount.mount_point, REF_DIR, '_README')

# read README file
metadata = pd.read_table(metadata_filename)
metadata
```

### Download the specific file

```python
import os
import uuid
import sys
from azure.storage.blob import BlockBlobService, PublicAccess

blob_service_client = BlockBlobService(account_name='datasetclinvar', sas_token='sv=2019-02-02&se=2050-01-01T08%3A00%3A00Z&si=prod&sr=c&sig=qFPPwPba1RmBvaffkzkLuzabYU5dZstSTgMwxuLNME8%3D')     
blob_service_client.get_blob_to_path('dataset', 'ClinVarFullRelease_00-latest.xml.gz.md5', './ClinVarFullRelease_00-latest.xml.gz.md5')
```

<!-- nbend -->

---

## Next steps

View the rest of the datasets in the [Open Datasets catalog](dataset-catalog.md).
