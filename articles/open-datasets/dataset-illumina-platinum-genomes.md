---
title: Illumina Platinum Genomes
description: Learn how to use the Illumina Platinum Genomes dataset in Azure Open Datasets.
ms.service: open-datasets
ms.topic: sample
ms.date: 04/16/2021
---

# Illumina Platinum Genomes

Whole-genome sequencing is enabling researchers worldwide to characterize the human genome more fully and accurately. This requires a comprehensive, genome-wide catalog of high-confidence variants called in a set of genomes as a benchmark. Illumina has generated deep, whole-genome sequence data of 17 individuals in a three-generation pedigree. Illumina has called variants in each genome using a range of currently available algorithms.

For more information on the data, see the official [Illumina site](https://www.illumina.com/platinumgenomes.html).

[!INCLUDE [Open Dataset usage notice](../../includes/open-datasets-usage-note.md)]

## Data source

This dataset is a mirror of ftp://ussd-ftp.illumina.com/

## Data volumes and update frequency

This dataset contains approximately 2 GB of data and is updated daily.

## Storage location

This dataset is stored in the West US 2 and West Central US Azure regions. We recommend locating compute resources in West US 2 or West Central US for affinity.

## Data Access

West US 2: 'https://datasetplatinumgenomes.blob.core.windows.net/dataset'

West Central US: 'https://datasetplatinumgenomes-secondary.blob.core.windows.net/dataset'

[SAS Token](../storage/common/storage-sas-overview.md): sv=2019-02-02&se=2050-01-01T08%3A00%3A00Z&si=prod&sr=c&sig=FFfZ0QaDcnEPQmWsshtpoYOjbzd4jtwIWeK%2Fc4i9MqM%3D

## Use Terms

Data is available without restrictions. For more information and citation details, see the [official Illumina site](https://www.illumina.com/platinumgenomes.html).

## Contact

For any questions or feedback about the dataset, contact platinumgenomes@illumina.com.

## Data access

### Azure Notebooks

# [azure-storage](#tab/azure-storage)

<!-- nbstart https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureNotebooks&package=azure-storage&registryId=genomics-platinum-genomes -->

> [!TIP]
> **[Download the dataset instead](https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureNotebooks&package=azure-storage&registryId=genomics-platinum-genomes)**.

## Getting the Illumina Platinum Genomes from Azure Open Datasets and Doing Initial Analysis 

Use Jupyter notebooks, GATK, and Picard to do the following:

1. Annotate genotypes using VariantFiltration
2. Select Specific Variants
3. Filter the relevant variants- no calls OR specific regions
4. Perform concordance analysis
5. Convert the final VCF files to a table 

**Dependencies:**

This notebook requires the following libraries:

- Azure storage `pip install azure-storage-blob`

- numpy `pip install numpy`

- Genome Analysis Toolkit (GATK) (*Users need to download GATK from Broad Institute's webpage into the same compute environment with this notebook: https://github.com/broadinstitute/gatk/releases*)

**Important information: This notebook is using Python 3.6 kernel**

## Getting the Genomics data from Azure Open Datasets

Several public genomics data has been uploaded as an Azure Open Dataset [here](https://azure.microsoft.com/services/open-datasets/catalog/). We create a blob service linked to this open dataset. You can find examples of data calling procedure from Azure Open Dataset for `Illumina Platinum Genomes` datasets in below:

### Downloading the specific 'Illumina Platinum Genomes'

```python
import os
import uuid
import sys
from azure.storage.blob import BlockBlobService, PublicAccess

blob_service_client = BlockBlobService(account_name='datasetplatinumgenomes', sas_token='sv=2019-02-02&se=2050-01-01T08%3A00%3A00Z&si=prod&sr=c&sig=FFfZ0QaDcnEPQmWsshtpoYOjbzd4jtwIWeK%2Fc4i9MqM%3D')     
blob_service_client.get_blob_to_path('dataset/2017-1.0/hg38/small_variants/NA12877', 'NA12877.vcf.gz', './NA12877.vcf.gz')
```

### 1. Annotate genotypes using VariantFiltration

**Important note: Check your GATK is running on your system.**

If we want to filter heterozygous genotypes, we use VariantFiltration's `--genotype-filter-expression isHet == 1` option. We can specify the annotation value for the tool to label the heterozygous genotypes with the `--genotype-filter-name` option. Here, this parameter's value is set to `isHetFilter`. In our first example, we used `NA12877.vcf.gz` from Illimina Platinum Genomes but users can use any vcf files from other datasets:`Platinum Genomes`

```python
run gatk VariantFiltration -V NA12877.vcf.gz -O outputannot.vcf --genotype-filter-expression "isHet == 1" --genotype-filter-name "isHetFilter"
```

### 2. Select Specific Variants

Select a subset of variants from a VCF file. This tool makes it possible to select a subset of variants based on various criteria in order to facilitate certain analyses. Examples of such analyses include comparing and contrasting cases vs. controls, extracting variant or non-variant loci that meet certain requirements, or troubleshooting some unexpected results, to name a few.

There are many different options for selecting subsets of variants from a larger call set:

Extract one or more samples from a call set based on either a complete sample name or a pattern match.
Specify criteria for inclusion that place thresholds on annotation values, **for example "DP > 1000" (depth of coverage greater than 1000x), "AF < 0.25" (sites with allele frequency less than 0.25)**. These criteria are written as "JEXL expressions", which are documented in the article about using JEXL expressions.
Provide concordance or discordance tracks in order to include or exclude variants that are also present in other given call sets.
Select variants based on criteria like their type (for example, INDELs only), evidence of mendelian violation, filtering status, allelicity, etc.
There are also several options for recording the original values of certain annotations, which are recalculated when one subsets the new call set, trims alleles, etc.

Input: A variant call set in VCF format from which a subset can be selected.

Output: A new VCF file containing the selected subset of variants.

```python
run gatk SelectVariants -R Homo_sapiens_assembly38.fasta -V outputannot.vcf --select-type-to-include SNP --select-type-to-include INDEL -O selective.vcf
```

### 3. Transform filtered genotypes to no call 

Running SelectVariants with --set-filtered-gt-to-nocall will further transform the flagged genotypes with a null genotype call. 

This conversion is necessary because downstream tools do not parse the FORMAT-level filter field.

How can we filter the variants with **'No call'**

```python
run gatk SelectVariants -V outputannot.vcf --set-filtered-gt-to-nocall -O outputnocall.vcf
```

### 4. Check the Concordance of VCF file with Ground Truth

Evaluate site-level concordance of an input VCF against a truth VCF.
This tool evaluates two variant call sets against each other and produces a six-column summary metrics table. 

**This function will:**

1. Stratifies SNP and INDEL calls
2. Report true-positive, False-positive, and false-negative calls
3. Calculates sensitivity and precision

The tool assumes all records in the --truth VCF are passing truth variants. For the -eval VCF, the tool uses only unfiltered passing calls.

Optionally, the tool can be set to produce VCFs of the following variant records, annotated with each variant's concordance status:

True positives and false negatives (that is, all variants in the truth VCF): useful for calculating sensitivity

True positives and false positives (that is, all variants in the eval VCF): useful for obtaining a training data set for machine learning classifiers of artifacts

**These output VCFs can be passed to VariantsToTable to produce a TSV file for statistical analysis in R or Python.**

```python
 run gatk Concordance -R Homo_sapiens_assembly38.fasta -eval outputannot.vcf --truth outputnocall.vcf  --summary summary.tsv 
```

### 5. VariantsToTable

Extract fields from a VCF file to a tab-delimited table. This tool extracts specified fields for each variant in a VCF file to a tab-delimited table, which may be easier to work with than a VCF. By default, the tool only extracts PASS or (unfiltered) variants in the VCF file. Filtered variants may be included in the output by adding the --show-filtered flag. The tool can extract both INFO (that is, site-level) fields and FORMAT (that is, sample-level) fields.

INFO/site-level fields:

Use the `-F` argument to extract INFO fields; each field will occupy a single column in the output file. The field can be any standard VCF column (for example, CHROM, ID, QUAL) or any annotation name in the INFO field (for example, AC, AF). The tool also supports the following fields:

EVENTLENGTH (length of the event)
TRANSITION (1 for a bi-allelic transition (SNP), 0 for bi-allelic transversion (SNP), -1 for INDELs and multi-allelics)
HET (count of het genotypes)
HOM-REF (count of homozygous reference genotypes)
HOM-VAR (count of homozygous variant genotypes)
NO-CALL (count of no-call genotypes)
TYPE (type of variant, possible values are NO_VARIATION, SNP, MNP, INDEL, SYMBOLIC, and MIXED
VAR (count of non-reference genotypes)
NSAMPLES (number of samples)
NCALLED (number of called samples)
MULTI-ALLELIC (is this variant multi-allelic? true/false)

FORMAT/sample-level fields:

Use the `-GF` argument to extract FORMAT/sample-level fields. The tool will create a new column per sample with the name "SAMPLE_NAME.FORMAT_FIELD_NAME" for example, NA12877.GQ, NA12878.GQ.

Input:

A VCF file to convert to a table

Output:

A tab-delimited file containing the values of the requested fields in the VCF file.

```python
run gatk VariantsToTable -V NA12877.vcf.gz -F CHROM -F POS -F TYPE -F AC -F AD -F AF -GF DP -GF AD -O outputtable.table
```

## References

1. VariantFiltration: https://gatk.broadinstitute.org/hc/en-us/articles/360036827111-VariantFiltration 
2. Select Variants:https://gatk.broadinstitute.org/hc/en-us/articles/360037052272-SelectVariants
3. Concordance: https://gatk.broadinstitute.org/hc/en-us/articles/360041851651-Concordance
4. Variants to table: https://gatk.broadinstitute.org/hc/en-us/articles/360036882811-VariantsToTable 
5. Illumina Platinum Genomes:https://www.illumina.com/platinumgenomes.html 

<!-- nbend -->

---

## Next steps

View the rest of the datasets in the [Open Datasets catalog](dataset-catalog.md).