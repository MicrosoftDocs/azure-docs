---
title: Genome Aggregation Database (gnomAD)
description: Learn how to use the Genome Aggregation Database (gnomAD) dataset in Azure Open Datasets.
ms.service: open-datasets
ms.topic: sample
ms.date: 04/16/2021
---

# Genome Aggregation Database (gnomAD)

The [Genome Aggregation Database (gnomAD)](https://gnomad.broadinstitute.org/) is a resource developed by an international coalition of investigators, with the goal of aggregating and harmonizing both exome and genome sequencing data from a wide variety of large-scale sequencing projects, and making summary data available for the wider scientific community.

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
