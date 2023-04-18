---
title: 1000 Genomes
description: Learn how to use the 1000 Genomes dataset in Azure Open Datasets.
ms.service: open-datasets
ms.topic: sample
ms.date: 04/16/2021
---

# 1000 Genomes

The 1000 Genomes Project ran between 2008 and 2015, creating the largest public catalog of human variation and genotype data. The final data set contains data for 2,504 individuals from 26 populations and 84 million identified variants. For more information, see the 1000 Genome Project website and the following publications:

Pilot Analysis: A map of human genome variation from population-scale sequencing Nature 467, 1061-1073 (28 October 2010)

Phase 1 Analysis: An integrated map of genetic variation from 1,092 human genomes Nature 491, 56-65 (01 November 2012)

Phase 3 Analysis: A global reference for human genetic variation Nature 526, 68-74 (01 October 2015) and An integrated map of structural variation in 2,504 human genomes Nature 526, 75-81 (01 October 2015)

For details on data formats refer to http://www.internationalgenome.org/formats

**[NEW]** the dataset is also available in [parquet format](https://github.com/microsoft/genomicsnotebook/tree/main/vcf2parquet-conversion/1000genomes)

[!INCLUDE [Open Dataset usage notice](../../includes/open-datasets-usage-note.md)]

## Data source

This dataset is a mirror of ftp://ftp.1000genomes.ebi.ac.uk/vol1/ftp/

## Data volumes and update frequency

This dataset contains approximately 815 TB of data and is updated daily.

## Storage location

This dataset is stored in the West US 2 and West Central US Azure regions. Allocating compute resources in West US 2 or West Central US is recommended for affinity.

## Data Access

West US 2: 'https://dataset1000genomes.blob.core.windows.net/dataset'

West Central US: 'https://dataset1000genomes-secondary.blob.core.windows.net/dataset'

[SAS Token](../storage/common/storage-sas-overview.md): sv=2019-10-10&si=prod&sr=c&sig=9nzcxaQn0NprMPlSh4RhFQHcXedLQIcFgbERiooHEqM%3D

## Data Access: Curated 1000 genomes dataset in parquet format

East US: `https://curated1000genomes.blob.core.windows.net/dataset`

SAS Token: sv=2018-03-28&si=prod&sr=c&sig=BgIomQanB355O4FhxqBL9xUgKzwpcVlRZdBewO5%2FM4E%3D

## Use Terms

Following the final publications, data from the 1000 Genomes Project is publicly available without embargo to anyone for use under the terms provided by the dataset source ([http://www.internationalgenome.org/data](http://www.internationalgenome.org/data)). Use of the data should be cited per details available in the [FAQs]() from the 1000 Genome Project.

## Contact

https://www.internationalgenome.org/contact

## Next steps

View the rest of the datasets in the [Open Datasets catalog](dataset-catalog.md).
