---
title: ClinVar Annotations
description: Learn how to use the ClinVar Annotations dataset in Azure Open Datasets.
ms.service: azure-open-datasets
ms.topic: sample
ms.reviewer: franksolomon
ms.date: 06/13/2024
---

# ClinVar Annotations

The [ClinVar](https://www.ncbi.nlm.nih.gov/clinvar/) resource is a freely accessible, public archive of reports - with supporting evidence - about the relationships among human variations and phenotypes. It facilitates access to and communication about the claimed relationships between human variation and observed health status, and about the history of that interpretation. It provides access to a broader set of clinical interpretations that researchers can incorporate into genomics workflows and applications.

Visit the [Data Dictionary](https://www.ncbi.nlm.nih.gov/projects/clinvar/ClinVarDataDictionary.pdf) and the [FAQ resource](https://www.ncbi.nlm.nih.gov/clinvar/docs/faq/) for more information about the data.

[!INCLUDE [Open Dataset usage notice](./includes/open-datasets-usage-note.md)]

## Data source

This dataset is a mirror of the National Library of Medicine ClinVar [FTP resource](https://ftp.ncbi.nlm.nih.gov/pub/clinvar/xml/).

## Data update frequency

This dataset receives daily updates.

## Data Access

[FTP resource](https://ftp.ncbi.nlm.nih.gov/pub/clinvar/)

[FTP Overview](https://www.ncbi.nlm.nih.gov/clinvar/docs/ftp_primer/)

## Use Terms
Data is available without restrictions. More information and citation details, see [Accessing and using data in ClinVar](https://www.ncbi.nlm.nih.gov/clinvar/docs/maintenance_use/).

## Contact

For any questions or feedback about this dataset, contact [clinvar@ncbi.nlm.nih.gov](mailto:clinvar@ncbi.nlm.nih.gov).

## Data access

### Azure Notebooks

# [azure-storage](#tab/azure-storage)

<!-- nbstart https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureNotebooks&package=azure-storage&registryId=genomics-clinvar -->

## Getting the ClinVar data from Azure Open Dataset

Several public genomics data resources were uploaded as Azure Open Dataset at [this](https://azure.microsoft.com/services/open-datasets/catalog/) resource.

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
