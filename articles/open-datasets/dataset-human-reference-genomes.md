---
title: Human Reference Genomes
description: Learn how to use the Human Reference Genomes dataset in Azure Open Datasets.
ms.service: open-datasets
ms.topic: sample
ms.date: 04/16/2021
---

# Human Reference Genomes

This dataset includes two human-genome references assembled by the [Genome Reference Consortium](https://www.ncbi.nlm.nih.gov/grc): Hg19 and Hg38.

For more information on Hg19 (GRCh37) data, see the [GRCh37 report at NCBI](https://www.ncbi.nlm.nih.gov/assembly/GCF_000001405.13/).

For more information on Hg38 data, see the [GRCh38 report at NCBI](http://www.ncbi.nlm.nih.gov/assembly/GCF_000001405.26/).

Other details about the data can be found at [NCBI RefSeq](https://www.ncbi.nlm.nih.gov/refseq/) site.

[!INCLUDE [Open Dataset usage notice](../../includes/open-datasets-usage-note.md)]

## Data source

This dataset is sourced from two FTP locations:

ftp://ftp.ncbi.nih.gov/genomes/refseq/vertebrate_mammalian/Homo_sapiens/all_assembly_versions/GCF_000001405.25_GRCh37.p13/

ftp://ftp.ncbi.nih.gov/genomes/refseq/vertebrate_mammalian/Homo_sapiens/latest_assembly_versions/GCF_000001405.39_GRCh38.p13/

Blob names are prefixed beginning with the “vertebrate_mammalian” segment of the URI.

## Data volumes and update frequency

This dataset contains approximately 10 GB of data and is updated daily.

## Storage location

This dataset is stored in the West US 2 and West Central US Azure regions. Allocating compute resources in West US 2 or West Central US is recommended for affinity.

## Data Access

West US 2: 'https://datasetreferencegenomes.blob.core.windows.net/dataset'

West Central US: 'https://datasetreferencegenomes-secondary.blob.core.windows.net/dataset'

[SAS Token](../storage/common/storage-sas-overview.md): sv=2019-02-02&se=2050-01-01T08%3A00%3A00Z&si=prod&sr=c&sig=JtQoPFqiC24GiEB7v9zHLi4RrA2Kd1r%2F3iFt2l9%2FlV8%3D

## Use Terms

Data is available without restrictions. For more information and citation details, see the [NCBI Reference Sequence Database site](https://www.ncbi.nlm.nih.gov/refseq/).

## Contact

For any questions or feedback about this dataset, contact the [Genome Reference Consortium](https://www.ncbi.nlm.nih.gov/grc/contact-us).

## Data access

### Azure Notebooks

# [azure-storage](#tab/azure-storage)

<!-- nbstart https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureNotebooks&package=azure-storage&registryId=genomics-reference-genomes -->


## Getting the Reference Genomes from Azure Open Datasets

Several public genomics data has been uploaded as an Azure Open Dataset [here](https://azure.microsoft.com/services/open-datasets/catalog/). We create a blob service linked to this open dataset. You can find examples of data calling procedure from Azure Open Datasets for `Reference Genomes` dataset in below:

Users can call and download the following path with this notebook: 'https://datasetreferencegenomes.blob.core.windows.net/dataset/vertebrate_mammalian/Homo_sapiens/latest_assembly_versions/GCF_000001405.39_GRCh38.p13/GCF_000001405.39_GRCh38.p13_assembly_structure/genomic_regions_definitions.txt'

**Important note:** Users need to log in their Azure Account via Azure CLI for viewing the data with Azure ML SDK. On the other hand, they do not need do any actions for downloading the data.

[Install the Azure CLI](/cli/azure/install-azure-cli).

### Calling the data from  'Reference Genome Datasets'

```python
import azureml.core
print("Azure ML SDK Version: ", azureml.core.VERSION)
```

```python
from azureml.core import  Dataset
reference_dataset = Dataset.File.from_files('https://datasetreferencegenomes.blob.core.windows.net/dataset')
mount = reference_dataset.mount()
```

```python
import os

REF_DIR = '/vertebrate_mammalian/Homo_sapiens/latest_assembly_versions/GCF_000001405.39_GRCh38.p13/GCF_000001405.39_GRCh38.p13_assembly_structure'
path = mount.mount_point + REF_DIR

with mount:
    print(os.listdir(path))
```

```python
import pandas as pd

# create mount context
mount.start()

# specify path to genomic_regions_definitions.txt file
REF_DIR = 'vertebrate_mammalian/Homo_sapiens/latest_assembly_versions/GCF_000001405.39_GRCh38.p13/GCF_000001405.39_GRCh38.p13_assembly_structure'
metadata_filename = '{}/{}/{}'.format(mount.mount_point, REF_DIR, 'genomic_regions_definitions.txt')

# read genomic_regions_definitions.txt file
metadata = pd.read_table(metadata_filename)
metadata
```

### Download the specific file

```python
import os
import uuid
import sys
from azure.storage.blob import BlockBlobService, PublicAccess

blob_service_client = BlockBlobService(account_name='datasetreferencegenomes',sas_token='sv=2019-02-02&se=2050-01-01T08%3A00%3A00Z&si=prod&sr=c&sig=JtQoPFqiC24GiEB7v9zHLi4RrA2Kd1r%2F3iFt2l9%2FlV8%3D')     
blob_service_client.get_blob_to_path('dataset/vertebrate_mammalian/Homo_sapiens/latest_assembly_versions/GCF_000001405.39_GRCh38.p13/GCF_000001405.39_GRCh38.p13_assembly_structure', 'genomic_regions_definitions.txt', './genomic_regions_definitions.txt')
```

<!-- nbend -->

---

## Next steps

View the rest of the datasets in the [Open Datasets catalog](dataset-catalog.md).