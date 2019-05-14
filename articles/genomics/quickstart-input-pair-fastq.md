---
title: Submit a workflow using FASTQ file inputs - Microsoft Genomics
titleSuffix: Azure
description: This article assumes you have the msgen client installed and have successfully run the sample data through the service.  
services: genomics
author: grhuynh
manager: cgronlun
ms.author: grhuynh
ms.service: genomics
ms.topic: conceptual
ms.date: 12/07/2017

---

# Submit a workflow using FASTQ file inputs in Microsoft Genomics

This article demonstrates how to submit a workflow to the Microsoft Genomics service if your input files are a single pair of FASTQ files. This topic assumes you have already installed and run the `msgen` client, and are familiar with how to use Azure Storage. If you have successfully submitted a workflow using the provided sample data, you are ready to proceed with this article. 

## Set up: Upload your FASTQ files to Azure storage
Let’s assume you have two files, *reads_1.fq.gz* and *reads_2.fq.gz*, and you have uploaded them to your storage account *myaccount* in Azure as **https://<span></span>myaccount.blob.core<span></span>.windows<span></span>.net<span></span>/inputs/reads_1<span></span>.fq<span></span>.gz<span></span>** and **https://<span></span>myaccount.blob.core.<span></span>windows<span></span>.net/<span></span>inputs/<span></span>reads_2.fq<span></span>.gz<span></span>**. You have the API URL and your access key. You want to have outputs in **https://<span></span>myaccount.blob.core<span></span>.windows<span></span>.net<span></span>/outputs<span></span>**.


## Submit your job to the `msgen` client 

Here is the minimal set of arguments that you will need to provide to the `msgen` client; line breaks are added for clarity:

For Windows:

```
msgen submit ^
  --api-url-base <Genomics API URL> ^
  --access-key <Genomics access key> ^
  --process-args R=b37m1 ^
  --input-storage-account-name myaccount ^
  --input-storage-account-key <storage access key to "myaccount"> ^
  --input-storage-account-container inputs ^
  --input-blob-name-1 reads_1.fq.gz ^
  --input-blob-name-2 reads_2.fq.gz ^
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
  --input-blob-name-1 reads_1.fq.gz \
  --input-blob-name-2 reads_2.fq.gz \
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
input_blob_name_1:                reads_1.fq.gz
input_blob_name_2:                reads_2.fq.gz
output_storage_account_name:      myaccount
output_storage_account_key:       <storage access key to "myaccount">
output_storage_account_container: outputs
```

Submit the `config.txt` file with this invocation: `msgen submit -f config.txt`

## Next steps
In this article, you uploaded a pair of FASTQ files into Azure Storage and submitted a workflow to the Microsoft Genomics service through the `msgen` python client. To learn more about workflow submission and other commands you can use with the Microsoft Genomics service, see our [FAQ](frequently-asked-questions-genomics.md). 
