---
title: Genome Aggregation Database (gnomAD)
titleSuffix: Azure Open Datasets
description: Learn how to use the Genome Aggregation Database (gnomAD) dataset in Azure Open Datasets.
ms.service: open-datasets
ms.topic: sample
author: peterclu
ms.author: peterlu
ms.date: 04/16/2021
---

# Genome Aggregation Database (gnomAD)

The [Genome Aggregation Database (gnomAD)](https://gnomad.broadinstitute.org/) is a resource developed by an international coalition of investigators, with the goal of aggregating and harmonizing both exome and genome sequencing data from a wide variety of large-scale sequencing projects, and making summary data available for the wider scientific community.

Available versions:

1. The **gnomAD v3.1.2** data set contains 76,156 whole genomes (and no exomes), all mapped to the GRCh38 reference sequence. Available in Hail and VCF formats. [Explore the data](https://msit.powerbi.com/reportEmbed?reportId=876ec2da-e6e4-42c9-9a28-c3d313c6e3eb&autoAuth=true&ctid=72f988bf-86f1-41af-91ab-2d7cd011db47&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9kZi1tc2l0LXNjdXMtcmVkaXJlY3QuYW5hbHlzaXMud2luZG93cy5uZXQvIn0%3D)
2. The **gnomAD v2.1.1** data set contains data from 125,748 exomes and 15,708 whole genomes, all mapped to the GRCh37/hg19 reference sequence. The data is available in Hail, VCF and Parquet formats.

[!INCLUDE [Open Dataset usage notice](../../includes/open-datasets-usage-note.md)]

## Data source

This dataset is hosted as a collaboration with the Broad Institute and the full gnomAD data catalog can be seen at https://gnomad.broadinstitute.org/downloads

## Data volumes and update frequency

This dataset contains approximately 30 TB of data and is updated with each gnomAD release.

## Storage location

The Storage Account hosting this dataset is in the East US Azure region. Allocating compute resources in East US is recommended for affinity.

## Data Access

Storage Account: 'https://datasetgnomad.blob.core.windows.net/dataset/'

The data is available publicly without restrictions, and the AzCopy tool is recommended for bulk operations. For example, to view the VCFs in release 3.0 of gnomAD:

```powershell
$ azcopy ls https://datasetgnomad.blob.core.windows.net/dataset/release/3.0/vcf/genomes
```

To download all the VCFs recursively:

```powershell
$ azcopy cp --recursive=true https://datasetgnomad.blob.core.windows.net/dataset/release/3.0/vcf/genomes .
```

**NEW: Parquet format of gnomAD v2.1.1 VCF files (exomes and genomes)**

To view the parquet files:

```powershell
$ azcopy ls https://datasetgnomadparquet.blob.core.windows.net/dataset
```

To download all the parquet files recursively:

```powershell
$ cp --recursive=true https://datasetgnomadparquet.blob.core.windows.net/dataset
```

The [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/) is also a useful tool for browsing the list of files in the gnomAD release.

## Use Terms

Data is available without restrictions. For more information and citation details, see the [gnomAD about page](https://gnomad.broadinstitute.org/about).

## Contact

For any questions or feedback about this dataset, contact the [gnomAD team](https://gnomad.broadinstitute.org/contact).

## Next steps

View the rest of the datasets in the [Open Datasets catalog](dataset-catalog.md).
