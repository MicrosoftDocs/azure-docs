---
title: ENCODE
description: Learn how to use the ENCODE dataset in Azure Open Datasets.
ms.service: open-datasets
ms.topic: sample
ms.date: 04/16/2021
---

# ENCODE: Encyclopedia of DNA Elements

The [Encyclopedia of DNA Elements (ENCODE) Consortium](https://www.encodeproject.org/help/project-overview/) is an ongoing international collaboration of research groups funded by the National Human Genome Research Institute (NHGRI). ENCODE's goal is to build a comprehensive parts list of functional elements in the human genome, including elements that act at the protein and RNA levels, and regulatory elements that control cells and circumstances in which a gene is active.

ENCODE investigators employ various assays and methods to identify functional elements. The discovery and annotation of gene elements is accomplished primarily by sequencing a diverse range of RNA sources, comparative genomics, integrative bioinformatic methods, and human curation. Regulatory elements are typically investigated through DNA hypersensitivity assays, assays of DNA methylation, and immunoprecipitation (IP) of proteins that interact with DNA and RNA, that is, modified histones, transcription factors, chromatin regulators, and RNA-binding proteins, followed by sequencing.

[!INCLUDE [Open Dataset usage notice](../../includes/open-datasets-usage-note.md)]

## Data source

This dataset is a mirror of the data store at https://www.encodeproject.org/

## Data volumes and update frequency

This dataset includes approximately 756 TB of data, and is updated monthly during the first week of every month.

## Storage location

This dataset is stored in the West US 2 and West Central US Azure regions. We recommend locating compute resources in West US 2 or West Central US for affinity.

## Data Access

West US 2: 'https://datasetencode.blob.core.windows.net/dataset'

West Central US: 'https://datasetencode-secondary.blob.core.windows.net/dataset'

[SAS Token](../storage/common/storage-sas-overview.md): ?sv=2019-10-10&si=prod&sr=c&sig=9qSQZo4ggrCNpybBExU8SypuUZV33igI11xw0P7rB3c%3D

## Use Terms

External data users may freely download, analyze, and publish results based on any ENCODE data without restrictions, regardless of type or size, and includes no grace period for ENCODE data producers, either as individual members or as part of the Consortium. Researchers using unpublished ENCODE data are encouraged to contact the data producers to discuss possible publications. The Consortium will continue to publish the results of its own analysis efforts in independent publications.

ENCODE request that researchers who use ENCODE datasets (published or unpublished) in publications and presentations cite the ENCODE Consortium in all of the following ways reported on [https://www.encodeproject.org/help/citing-encode/](https://www.encodeproject.org/help/citing-encode/).

## Contact

If you have any questions, concerns, or comments, email our help desk at encode-help@lists.stanford.edu.

## Next steps

View the rest of the datasets in the [Open Datasets catalog](dataset-catalog.md).