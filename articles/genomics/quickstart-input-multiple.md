---
title: Submit a workflow using multiple inputs
titleSuffix: Microsoft Genomics
description: This article demonstrates how to submit a workflow to the Microsoft Genomics service if your input file is multiple FASTQ or BAM files from the same sample.
ms.service: genomics
author: vigunase
ms.author: vigunase
ms.topic: conceptual
ms.date: 02/05/2018

---

# Submit a workflow using multiple inputs from the same sample

This article demonstrates how to submit a workflow to the Microsoft Genomics service if your input file is multiple FASTQ or BAM files **coming from the same sample**. For example, if you ran the **same sample** in multiple lanes on the sequencer, the sequencer could output a pair of FASTQ files for each lane. Rather than concatenating these FASTQ files prior to alignment and variant calling, you can directly submit all of these inputs to the `msgen` client. The output from the `msgen` client would be a **single set** of files, including a .bam, .bai, .vcf file. 

Keep in mind, however, that you **cannot** mix FASTQ and BAM files in the same submission. Further, you **cannot** submit multiple FASTQ or BAM files from multiple individuals. 

This article assumes you have already installed and run the `msgen` client, and are familiar with how to use Azure Storage. If you have successfully submitted a workflow using the provided sample data, you are ready to proceed with this article. 


## Multiple BAM files

### Upload your input files to Azure storage
Let’s assume you have multiple BAM files as input, *reads.bam*, *additional_reads.bam*, and *yet_more_reads.bam*, and you have uploaded them to your storage account *myaccount* in Azure. You have the API URL and your access key. You want to have outputs in **https://<span></span>myaccount.blob.core<span></span>.windows<span></span>.net<span></span>/outputs<span></span>**.


### Submit your job to the `msgen` client 

You can submit multiple BAM files by passing all their names to the --input-blob-name-1 argument. Note that all files should come from the same sample, but their order is not important. The following section details example submissions from a command line in Windows, in Unix, and using a configuration file. Line breaks are added for clarity:


For Windows:

```
msgen submit ^
  --api-url-base <Genomics API URL> ^
  --access-key <Genomics access key> ^
  --process-args R=b37m1 ^
  --input-storage-account-name myaccount ^
  --input-storage-account-key <storage access key to "myaccount"> ^
  --input-storage-account-container inputs ^
  --input-blob-name-1 reads.bam additional_reads.bam yet_more_reads.bam ^
  --output-storage-account-name myaccount ^
  --output-storage-account-key <storage access key to "myaccount"> ^
  --output-storage-account-container outputs
```


For Unix

```
msgen submit \
  --api-url-base <Genomics API URL> \
  --access-key <Genomics access key> \
  --process-args R=b37m1 \
  --input-storage-account-name myaccount \
  --input-storage-account-key <storage access key to "myaccount"> \
  --input-storage-account-container inputs \
  --input-blob-name-1 reads.bam additional_reads.bam yet_more_reads.bam \
  --output-storage-account-name myaccount \
  --output-storage-account-key <storage access key to "myaccount"> \
  --output-storage-account-container outputs
```


If you prefer using a configuration file, here is what it would contain:

``` config.txt
api_url_base:                     <Genomics API URL>
access_key:                       <Genomics access key>
process_args:                     R=b37m1
input_storage_account_name:       myaccount
input_storage_account_key:        <storage access key to "myaccount">
input_storage_account_container:  inputs
input_blob_name_1:                reads.bam additional_reads.bam yet_more_reads.bam
output_storage_account_name:      myaccount
output_storage_account_key:       <storage access key to "myaccount">
output_storage_account_container: outputs
```

Submit the `config.txt` file with this invocation: `msgen submit -f config.txt`


## Multiple paired FASTQ files

### Upload your input files to Azure storage
Let’s assume you have multiple paired FASTQ files as input, *reads_1.fq.gz* and *reads_2.fq.gz*,  *additional_reads_1.fq.gz* and *additional_reads_2.fq.gz*, and *yet_more_reads_1.fq.gz* and  *yet_more_reads_2.fq.gz*. You have uploaded them to your storage account *myaccount* in Azure and you.have the API URL and your access key. You want to have outputs in **https://<span></span>myaccount.blob.core<span></span>.windows<span></span>.net<span></span>/outputs<span></span>**.


### Submit your job to the `msgen` client 

Paired FASTQ files not only need to come from the same sample, but they also need to be processed together.  The order of the file names matters when they are passed as arguments to --input-blob-name-1 and --input-blob-name-2. 

The following section details example submissions from a command line in Windows, in Unix, and using a configuration file. Line breaks are added for clarity:


For Windows:

```
msgen submit ^
  --api-url-base <Genomics API URL> ^
  --access-key <Genomics access key> ^
  --process-args R=b37m1 ^
  --input-storage-account-name myaccount ^
  --input-storage-account-key <storage access key to "myaccount"> ^
  --input-storage-account-container inputs ^
  --input-blob-name-1 reads_1.fastq.gz additional_reads_1.fastq.gz yet_more_reads_1.fastq.gz ^
  --input-blob-name-2 reads_2.fastq.gz additional_reads_2.fastq.gz yet_more_reads_2.fastq.gz ^
  --output-storage-account-name myaccount ^
  --output-storage-account-key <storage access key to "myaccount"> ^
  --output-storage-account-container outputs
```


For Unix:

```
msgen submit \
  --api-url-base <Genomics API URL> \
  --access-key <Genomics access key> \
  --process-args R=b37m1 \
  --input-storage-account-name myaccount \
  --input-storage-account-key <storage access key to "myaccount"> \
  --input-storage-account-container inputs \
  --input-blob-name-1 reads_1.fastq.gz additional_reads_1.fastq.gz yet_more_reads_1.fastq.gz \
  --input-blob-name-2 reads_2.fastq.gz additional_reads_2.fastq.gz yet_more_reads_2.fastq.gz \
  --output-storage-account-name myaccount \
  --output-storage-account-key <storage access key to "myaccount"> \
  --output-storage-account-container outputs
```


If you prefer using a configuration file, here is what it would contain:

```
api_url_base:                     <Genomics API URL>
access_key:                       <Genomics access key>
process_args:                     R=b37m1
input_storage_account_name:       myaccount
input_storage_account_key:        <storage access key to "myaccount">
input_storage_account_container:  inputs
input_blob_name_1:                reads_1.fq.gz additional_reads_1.fastq.gz yet_more_reads_1.fastq.gz
input_blob_name_2:                reads_2.fq.gz additional_reads_2.fastq.gz yet_more_reads_2.fastq.gz
output_storage_account_name:      myaccount
output_storage_account_key:       <storage access key to "myaccount">
output_storage_account_container: outputs
```

Submit the `config.txt` file with this invocation: `msgen submit -f config.txt`

## Next steps
In this article, you uploaded multiple BAM files or paired FASTQ files into Azure Storage and submitted a workflow to the Microsoft Genomics service through the `msgen` Python client. For more information regarding workflow submission and other commands you can use with the Microsoft Genomics service, see the [FAQ](frequently-asked-questions-genomics.yml). 