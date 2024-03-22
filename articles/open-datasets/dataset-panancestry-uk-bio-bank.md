---
title: Pan UK-Biobank
description: Learn how to use the Pan UK-Biobank dataset in Azure Open Datasets.
ms.service: open-datasets
ms.topic: sample
ms.custom: references_regions
ms.date: 05/17/2023
---

# Pan UK-Biobank: Pan-ancestry genetic analysis of the UK Biobank

The [Pan-ancestry genetic analysis of the UK Biobank(Pan-UKBB)](https://pan.ukbb.broadinstitute.org) is a resource to researchers that promotes more inclusive research practices, accelerates scientific discoveries, and improves the health of all people equitably. In genetics research, it's statistically necessary to study groups of individuals together with similar ancestries. In practice, this method has meant that most previous research has excluded individuals with non-European ancestries. The Pan-ancestry of UK-biobank is a resource using one of the most widely accessed sources of genetic data, the UK Biobank, in a manner that is more inclusive than most previous efforts--namely studying groups of individuals with diverse ancestries. The results of this research have many important limitations, which should be carefully considered when researchers use this resource in their work and when they and others interpret subsequent findings.

[!INCLUDE [Open Dataset usage notice](../../includes/open-datasets-usage-note.md)]

## Data source

This dataset is a mirror of the data store at https://pan.ukbb.broadinstitute.org/downloads

## Data volumes and update frequency

This dataset includes approximately 144 TB of data, and is updated monthly during the first week of every month.

## Storage location

This dataset is stored in the East US Azure region. We recommend locating compute resources in East US for affinity.

## Data Access

East US: 'https://datasetpanukbb.blob.core.windows.net/dataset'

[SAS Token](../storage/common/storage-sas-overview.md): ?sp=rl&st=2023-05-17T21:26:19Z&se=2050-05-18T05:26:19Z&spr=https&sv=2022-11-02&sr=c&sig=MGvVbVHbmkGKmWmfkHzpcaJEf5G0ljLnBQy6cbrmR%2FA%3D

## Use Terms

The GWAS results data produced by the Pan-UKB are available free of restrictions under the Creative Commons Attribution 4.0 International (CC BY 4.0). The team requests that you acknowledge and give attribution to both the Pan-UKB project and UK Biobank, and link back to the relevant page, wherever possible. Full terms of use can be found [here](https://pan.ukbb.broadinstitute.org/downloads)

## Contact

For questions on dataset contact us at ukb.diverse.gwas@gmail.com

For details about the code to run this analysis, see the [GitHub](https://github.com/atgu/ukbb_pan_ancestry)

## Next steps

View the rest of the datasets in the [Open Datasets catalog](dataset-catalog.md).
