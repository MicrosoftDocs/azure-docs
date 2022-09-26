---
title: Genome Aggregation Database (gnomAD)
description: Learn how to use the Genome Aggregation Database (gnomAD) dataset in Azure Open Datasets.
ms.service: open-datasets
ms.topic: sample
ms.date: 04/16/2021
---

# Genome Aggregation Database (gnomAD)

The [Genome Aggregation Database (gnomAD)](https://gnomad.broadinstitute.org/) is a resource developed by an international coalition of investigators, with the goal of aggregating and harmonizing both exome and genome sequencing data from a wide variety of large-scale sequencing projects, and making summary data available for the wider scientific community.

Available versions:

1. The **gnomAD v3.1.2** data set contains 76,156 whole genomes (and no exomes), all mapped to the GRCh38 reference sequence. Available in Hail and VCF formats. 
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

## Use cases

1. Data from gnomad can be used in aiding varinat interpretation including a resource for mitochondrial and structural variations. However, careful evaluation is needed before assigning pathogenicity to a variant [1](https://onlinelibrary.wiley.com/doi/10.1002/humu.24309)
2. PCA loadings and RF models can be used for population inference in your own dataset with some caveats to consider [2](https://gnomad.broadinstitute.org/news/2021-09-using-the-gnomad-ancestry-principal-components-analysis-loadings-and-random-forest-classifier-on-your-dataset/#how-to-use-the-loadings-and-rf-model-on-your-own-dataset)
3. Although at the time of collection, samples were not known for any disease phenotype, the subset controls/biobank data can be used as a control reference set.
4. Individual level data from the samples from 1000 Genomes Project (n=2,435) and the Human Genome Diversity Project (n=780) are available without restrictions. This data from >60 distinct populations can serve as a reference panel for haplotype phasing and genotype imputation, or as a training set for ancestry inference.

## Contact

For any questions or feedback about this dataset, contact the [gnomAD team](https://gnomad.broadinstitute.org/contact).

## Next steps

View the rest of the datasets in the [Open Datasets catalog](dataset-catalog.md).
